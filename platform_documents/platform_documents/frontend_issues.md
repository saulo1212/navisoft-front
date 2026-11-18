# Integração frontend — impedimentos reproduzidos

## SYS-KB-01 — listagem e pesquisa administrativa Knowledge retornam 503

Estado: correção local implementada; reteste HTTP operacional pendente.

Reprodução com Primary válido:

- GET `/v1/admin/knowledge/items`: 503 knowledge_storage_unavailable.
- POST `/v1/admin/knowledge/items/search`, body `{"limit":2,"offset":0}`: mesmo 503.
- Controle: GET categorias com limit 2 e GET de artigo existente retornam 200.

Impacto: grid, paginação e pesquisa administrativa de artigos bloqueados.

Causa confirmada no código: `internal/filters/lists.go` aplicava `AS k(uid uuid,...)` a `knowledge.admin_item_rows()`, embora a função da Knowledge 0002 já declare as mesmas colunas via `RETURNS TABLE`. PostgreSQL rejeita essa lista redundante para função com parâmetros de saída com SQLSTATE `42601` (syntax_error). A regressão local executa a forma antiga e verifica esse SQLSTATE; a evidência HTTP original contém somente o erro sanitizado `knowledge_storage_unavailable`, sem SQLSTATE do servidor operacional.

Correção: a fonte do `filters.Manager` agora usa `knowledge.admin_item_rows() AS k`, aproveitando os nomes e tipos já declarados pela função. Nenhum grant, migration, RLS ou autorização foi alterado. A regressão SQL executa a query paginada equivalente sob `navisoft_knowledge_runtime`, confirma 2 itens, envelope e ausência de `videos`, e verifica que a role continua sem SELECT direto na tabela.

Aceite local: parser da forma antiga rejeita com `42601`; query corrigida passa sob role runtime no harness PostgreSQL descartável; teste Go confirma o SQL emitido pelo `ListQuery` usa alias sem redefinição de colunas. Aceite HTTP continua pendente: repetir GET e POST search com Primary e confirmar 200, envelope/filtros/paginação, além de controles de detalhe e negação para perfis não Primary. O teste local não substitui reteste no PostgreSQL Knowledge operacional nem HTTP.

Validação local desta correção: teste Go focal do filtro, teste da rota no pacote `internal/server`, suíte Knowledge PGlite com a regressão de listagem, `go vet ./internal/filters ./internal/server`, build `./cmd/navisoft` e `git diff --check` nos arquivos de código/SQL passaram. A suíte integral `go test ./internal/filters ./internal/server` falhou apenas em `TestListQueriesAgainstPostgres`: o harness Core parou no pré-requisito existente `billing_0192_required` antes da asserção de listagem; `internal/server` passou. Nenhum PostgreSQL operacional foi acessado.

Evidência: [reprodução](evidence/2026-10-21-knowledge-listing-503.json). Não alterar pg_hba ou configuração para mascarar o problema.

## SYS-GEO-01 — privilégio interno ausente na leitura de scopes de geofences

Estado: correção local preparada; migration forward 0208 e regressões SQL/PostGIS ainda não executadas; homologação HTTP pendente. A evidência operacional original foi GET `/v1/admin/geo/geofences` com Primary retornando 403 `geo_not_allowed`, embora a área aparecesse habilitada.

Causa reproduzida pelo operador em SQL: sob `navisoft_auth`, `geo.geofence_list()` alcança `geo.can_read_scope()` e falha com SQLSTATE `42501`, `permission denied for table scope_grants`. O 403 resultante era erro de autorização interno, não uma decisão negativa de acesso do Primary.

Causa no código/migrations: 0044 torna `geo.can_read_scope()` SECURITY DEFINER, com owner `navisoft_geo_owner`. A 0067 substitui seu corpo por uma leitura direta de `access.scope_grants`, mas a tabela pertence a `navisoft_policy`, possui ENABLE/FORCE RLS e não tinha grant/policy para `navisoft_geo_owner`. O runtime só executa `geo.geofence_list()`; o acesso à tabela ocorre dentro do owner da função. A rota de listagem passa por `filteredList()` em `internal/server/search.go`, usa `filters.Manager.ListQuery()` e executa a query na mesma transação após `SET LOCAL ROLE navisoft_auth`.

Correção local: migration 0208 concede ao owner geográfico SELECT somente nas colunas `uid_user` e `uid_organization`, com policy RLS que limita a leitura às grants do usuário atual enquanto `access.can_read_data()` é verdadeiro. Não concede SELECT/DML a `navisoft_auth`, não altera a função de autorização nem as migrations aplicadas. A regressão verifica a fronteira de privilégios, Primary positivo, Secondary sem leitura cross-tenant e executa a query gerada realmente por `filters.Manager` sob a role da API. O runner foi ajustado para não reaplicar 0044 antes dos testes, pois isso restaurava uma definição antiga de `geo.can_read_scope()` e mascarava 0067.

Validação local: `go test -count=1 ./internal/filters -run TestGeographyQueryContract`, teste de rota `internal/server`, `go vet ./internal/filters ./internal/server`, `go build -buildvcs=false ./cmd/navisoft` e `git diff --check` passaram. O runner SQL/PostGIS não foi executado: no WSL deste ambiente só há `psql`; `initdb`, `pg_ctl` e `postgres` não estão instalados. Nenhum banco operacional foi acessado.

Aceite HTTP após aplicação e rebuild/restart: GET `/v1/admin/geo/geofences` e POST `/v1/admin/geo/geofences/search` com Primary devem retornar 200; testar também Secondary autorizado na própria organização e Secondary sem scope para a organização alvo, que não pode ver a cerca. A regressão local/PostGIS e a homologação HTTP são evidências separadas; nenhuma é considerada aprovada por esta alteração local.

## Reteste SYS-GEO-01 — encerrado no escopo executado

0208 confirmada, quatro consultas iniciais 200 e 26 chamadas de fixture/quatro perfis aprovadas; duas exclusões 204. Evidência em [geofence-0208-http](evidence/2026-10-21-geofence-0208-http.json). A negação ao Primary deixou de ocorrer; privilégios do runtime permanecem restritos. Não equivale à homologação de todas as operações geográficas.

## SYS-TECH-01 — idempotência de cadastro de executor quebrada

Estado: migration forward 0209 consta aplicada na base usada pelo operador, pois a regressão passou sua pré-condição de versão; a execução SQL falhou na fixture antes de concluir a regressão. Reteste HTTP pendente. Evidência original: POST /v1/admin/entities/technicians criou 201; replay imediato retornou 422 invalid_technician. Request UID: 191b68eb-e53f-40e7-9904-89d09e3aaa57. Registro UID: 74bca4b5-0657-4110-a638-9ddfbc7bde93.

Na execução reportada, a fixture falhou antes de testar replay porque chamou `access.can_read_data()` diretamente sob `navisoft_auth`, que não possui `USAGE` no schema interno `access`. Isso era uma falha da fixture, não uma falha de autorização da aplicação. A asserção direta foi removida: a regressão agora prova o gate pelo resultado de `common.begin_create()` e distingue a negação de visibilidade (`device_technician_not_found`) de uma perda indevida do acesso geral (`42501`). Nenhum grant foi ampliado. A regressão corrigida ainda precisa ser executada integralmente com `ROLLBACK` confirmado.

Na execução seguinte, a fixture chegou ao teste de listagem cross-tenant, mas selecionou `organization_target=org B` para a qual o ator podia administrar devices. `devices.technician_list()` aceitou corretamente o contexto autorizado, então a expectativa de erro estava errada. A fixture agora restringe o Administrator temporário a org B, exige a área `devices` e testa update/get/list contra org A, onde está o executor. As operações sobre esse alvo devem permanecer ocultas (`device_technician_not_found`) ou negadas (`device_not_allowed`). Nenhuma autorização de produção foi alterada.

Payload original:

```json
{"uid_organization":"7a7eb1f8-79de-498f-a20e-b7ae77adae3a","uid_provider_entity":"1c9e6709-e4f3-43a2-af01-f21de2e940cf","name":"INT07 Executor","active":true,"capabilities":["installation","vehicle_cameras"]}
```

Reprodução: a criação e retry ocorreram antes da desativação de limpeza. O executor agora está desativado; considerar isso antes do reteste, sem apresentar inatividade como causa da falha original.

Causa confirmada no call path: POST `/v1/admin/entities/technicians` passa pelo `createIntentMiddleware`, que registra `entities/technicians`; `mutationWithError()` executa a mutação com `idempotency.QueryJSON()` na mesma transação. `common.begin_create()` encontra o receipt e chama `common.check_create_visibility()`. A função instalada pela 0203 não mapeia `entities/technicians` nem para a área `devices` nem para `devices.technician_get(id)`, então cai no `ELSE` e retorna SQLSTATE 22023 `invalid_create_resource`. `technicalProviderError()` traduz 22023 para 422 `invalid_technician`, ocultando a causa interna. A migration 0086 tinha introduzido a revalidação correta (`devices` + `devices.technician_get`), mas uma substituição posterior do dispatcher deixou esse caso de fora. A consulta read-only reportada pelo operador, sob `navisoft_auth`/Primary, reproduziu 22023 e terminou em ROLLBACK.

Correção 0209 restaura somente o branch perdido para o recurso já aceito pelo Go. O replay mantém a verificação de área `devices` e chama `devices.technician_get(id)`, que revalida a visibilidade atual do executor. Owner e ACL existentes do dispatcher são preservados; nenhum grant, RLS ou migration aplicada é alterado. A regressão `technician_capabilities.sql` cobre criação/receipt, replay exato, conflito de fingerprint e replay negado após remover apenas o scope da organização alvo, mantendo outro scope para exercitar a revalidação do registro. Em seguida restaura o scope, confirma que a mesma chave ainda devolve o UID original com `replayed=true` e, assim, comprova que a negação não consumiu nem substituiu a receipt concluída.

Aceite pendente após aplicar 0209: create 201; replay exato 200 com mesmo UID e receipt; mesma chave com body diferente 409 idempotency_conflict; remover o scope do ator para a organização do executor deve negar replay sem revelar o executor nem criar nova receipt. Verificar também ausência de duplicação do executor/capabilities/auditoria. SQL sob roles reais e HTTP são evidências distintas; os testes locais não homologam a rota completa.

## Reteste SYS-TECH-01 — encerrado no escopo executado

0209 foi aplicada pelo operador e regressão reportada sem erro. Receipt original e novos receipts replayam 200, conflito 409; após perda de scope e novo login, replay negado 404; restaurar scope e relogar retorna receipt original 200. Não remover revalidação. Evidências em technician-0209-retest e technician-replay-scope-http.

## SYS-OS-01 — replay de conclusão de OS

Causa confirmada: `workOrderCompletionIntent()` cria explicitamente o recurso `device_work_order_completion` para as rotas administrativa e do executor, fora do mapa `atomicCreateResources`. `common.begin_create()` revalida receipts chamando `common.check_create_visibility()`. A definição atual foi substituída na 0203 e a 0209 restaurou o recurso `entities/technicians`, mas deixou de fora o recurso de conclusão que existia nos dispatchers anteriores (0100, 0111 e 0167/0169/0171). O replay então cai em `invalid_create_resource`/22023, mapeado pelo handler para 422 `invalid_device`. A evidência HTTP mostra conclusão original 200 `completed=true` seguida por replay 422; receipt original preservada.

0210 restaurou o branch de leitura/visibilidade. A 0211 remove o gate de área duplicado do dispatcher do receipt, mas não remove a autorização efetiva: `technician_work_order_get()` exige `current_technician()`, que verifica conta elegível, área `devices`, lifecycle ativo e scope atual do asset. Portanto, um replay após revogação da área deve ser negado, assim como após perda de scope. SECURITY DEFINER/owner/ACL, grants runtime, fingerprint, receipt, função de conclusão e vínculo com a OS permanecem. A intenção Go preserva `TargetUID`, e `QueryJSONGuarded()` compara o UID da resposta armazenada com a OS solicitada. Auditoria dos outros recursos construídos fora de `atomicCreateResources`: GED usa `document-contracts`, `documents`, `document-revisions` e `document-distributions`; imagens usa `images`. Todos têm branch correspondente no dispatcher atual; nenhuma outra omissão foi encontrada nessa revisão.

Regressões locais preparadas: teste Go do fluxo guarded verifica replay autorizado, conflito/ator diferente, UID da OS e negação quando a visibilidade atual falha, sem repetir a mutação. A regressão PostgreSQL `device_technician_self_service.sql` exige 0212 e testa receipts de conclusão para executor e administrador. O vínculo, a conclusão original e o replay autorizado mantêm a área `devices`, exigida por `technician_account_allowed()` e `current_technician()`. Para testar perda de acesso, a fixture retira temporariamente somente o asset da OS do scope, mantendo outro asset para satisfazer a estrutura mínima do perfil; espera `device_work_order_not_found`, restaura o scope e confirma replay da receipt original. Não remove nem recria permissões globais. A regressão ainda aguarda nova execução após aplicação da 0212; não confundir o FAIL anterior, que diagnosticou SYS-OS-02, com aprovação.

O cleanup reportado removeu o device por fluxo próprio, mas a dependência histórica impediu sua exclusão. Evidência [technical-work-order-http](evidence/2026-10-21-technical-work-order-http.json).

## SYS-OS-01 — replay retestado; SYS-OS-02 — retirada pelo executor

Operador informou regressão PostgreSQL concluída com RESET/DO/ROLLBACK e API reiniciada. Consulta read-only confirmou 0210 e 0211 registradas e terminou em ROLLBACK. Replay do receipt original de conclusão retornou 200/replayed=true, mesmo UID, completed_at e pricing_snapshot. Em fixture HTTP nova com usuário Basic vinculado ao executor: instalação/conclusão e replay 200; corpo alterado com mesma chave 409; alvo diferente 409; ausência de sessão 401; retirada de scope com novo login 404; restauração de scope com novo login permitiu replay 200. Resposta self-service não expôs pricing_snapshot. SYS-OS-01 encerrado nesses cenários. Não foi retirada a permissão global devices.access.

O operador executou a regressão ampliada e confirmou a causa do SYS-OS-02: conclusão de retirada falhou com SQLSTATE 23503 `device_technician_not_found` no trigger `devices.capture_technician_history()` durante INSERT da custódia `return_pending`. `devices.technicians` era legível pelo owner do trigger; a rejeição vinha de `entities.technician_provider_valid()`, que consultava `entities.entities` sob `domain_entity_lookup` e `entities.can_manage_record()`. O Basic executor tem acesso à OS/asset, mas não administra entidades; o SELECT da prestadora ficava vazio. Primary passa por satisfazer o gate administrativo.

A migration forward 0212 altera apenas a fonte da validação da prestadora para `entities.entity_types` + `entities.types`. As FKs existentes comprovam entidade, organização e tipo; a função ainda exige lifecycle ativo e tipo `technician` ativo e retorna somente boolean ao owner de Devices. Não há alteração de grants, RLS, autorização do executor, receipt/fingerprint ou regra de custódia. A regressão exige 0212 e chama `devices.technician_work_order_complete()` para retirada/replacement. 0212 aguarda aplicação e a regressão/HTTP devem ser repetidas pelo operador antes de homologar.

Cleanup concluído via API: executor declarou devolução 200, mantendo return_pending sem received_at/closed_at; Primary recebeu fisicamente 200 e fechou custódia. Login desvinculado, executor desativado, usuário de fixture desabilitado e dois assets excluídos 204. Device mantido por 409 de dependência histórica, sem custódia aberta. Evidências: [replay original](evidence/2026-10-21-work-order-0211-retest.json) e [executor e retirada](evidence/2026-10-21-work-order-executor-0211-http.json). Não marcar todo o módulo como homologado.

### Solicitação ao programador — SYS-OS-02

Investigar POST /v1/technician/work-orders/{uid}/complete em operação remove. Fixture Basic com conta vinculada, área vigente e scope explícito do asset instalou e concluiu normalmente; nova OS de retirada iniciou 200 e falhou ao concluir com 409 device_reference_conflict. Primary concluiu a mesma OS com o mesmo corpo em 200. Capturar SQLSTATE/message/context reais em regressão isolada; revisar visibilidade nos triggers/validações após desvincular device e criar custódia de retorno. Incluir retirada e replace pelo executor real, rollback atômico da falha, devolução, recebimento e replay, preservando autorização, histórico e sigilo de preços. Evidência contém UID, item, corpo e chave; não inferir sucesso do portal a partir de execução como Primary. Não aplicar DML operacional para contornar.

**Diagnóstico original (2026-10-22, supersedido pela regressão):** a evidência HTTP mostrava somente `device_reference_conflict`; o handler não registrava causas PostgreSQL 23503 como 5xx. A regressão do operador identificou precisamente `capture_technician_history()` e `technician_provider_valid()`; a causa e a correção forward 0212 estão descritas acima. A regressão usa o wrapper self-service real.

**Reteste mais recente:** a regressão avançou até a confirmação da custódia da OS de replacement e falhou com `device_custody_not_found`. A fixture já havia definido `app.uid_user` como o usuário Basic executor, mas invocou `devices.custody_confirm_receipt()`, que é a operação administrativa e requer `devices.can_manage()`. Corrigida somente a fixture para usar `devices.technician_custody_confirm()` nesse passo, conforme o ator e o fluxo de recebimento pelo executor. A regressão PostgreSQL ainda precisa ser repetida pelo operador; HTTP permanece pendente e SYS-OS-02 não está homologado.

## 22/10/2026 — SYS-OS-02 retestado; SYS-RES-01 aberto

API voltou a responder. Fixture nova executou instalação, substituição e retirada com executor Basic vinculado e scope explícito de assets. Conclusões e replays 200, mesmos UIDs/completed_at, sem pricing_snapshot no self-service. Conflito de fingerprint 409; perda/restauração de scope com novo login negou/permitiu replay. Substituição e retirada tiveram declaração de devolução 200 preservando return_pending e recebimento físico administrativo 200 fechando custódia. SYS-OS-02 encerrado nesses cenários HTTP após 0212. Não é aprovação integral do módulo nem confirmação independente da regressão SQL. Fixture: login desvinculado/desabilitado, técnico desativado, dois assets excluídos 204; devices preservados com histórico e sem custódia pendente. Evidência: [0212 HTTP](evidence/2026-10-22-work-order-executor-0212-http.json).

Continuidade em identidade/projeção (0213–0216): listagens protocol-identities e telemetry-mappings 200; identidade criada 201 com zeros iniciais preservados. Retry com mesma chave/body/ator retornou 422 invalid_device: **SYS-RES-01 aberto**. Consulta read-only sob navisoft_auth/Primary confirmou common.check_create_visibility('devices/protocol-identities',uid) -> 22023 invalid_create_resource, com ROLLBACK. Go registra devices/protocol-identities, devices/protocol-identities/:uid/shares e devices/telemetry-mappings como create idempotente; revisar integração de todos com o dispatcher, sem presumir que os dois últimos já falharam em HTTP. Identidade de teste desativada por PUT 200. Worker/Valkey não foram iniciados ou homologados. Evidência: [identidade e replay](evidence/2026-10-22-protocol-resolution-http.json).

### Solicitação ao programador — SYS-RES-01

Corrigir a revalidação de replay de devices/protocol-identities: POST 201 seguido de mesmo body/chave 422 invalid_device; dispatcher retorna 22023 invalid_create_resource. Verificar também os recursos devices/protocol-identities/:uid/shares e devices/telemetry-mappings registrados no Go. Preservar receipt, fingerprint, autorização e visibilidade atuais, vínculo do share ao alvo e limites Primary-only. Incluir regressão e HTTP de create/replay/conflito/perda de acesso para cada recurso. Não resolver ignorando revalidação ou ampliando grants. A evidência contém UUID, body e chave, sem tokens.

## 23/10/2026 — SYS-GED-01: replay de contrato e regressão transversal

Novo teste HTTP independente do GED: GET catalogs 200, POST document-contracts 201 e retry idêntico 422 invalid_document. A chamada read-only common.check_create_visibility('document-contracts',uid), sob navisoft_auth/Primary, confirmou SQLSTATE 22023 invalid_create_resource e ROLLBACK. Contrato fixture 613148b0-6a44-4b5b-9f55-da7dd39c01a8 preservado: nenhuma criação de documento, revisão, distribuição ou objeto físico foi alcançada. Não repetir com outra chave para contornar o defeito. Evidência: [GED](evidence/2026-10-23-ged-http.json).

Comparação estática entre dispatcher da 0171 e definição efetivamente instalada encontrou 12 branches explícitos ausentes: document-contracts, documents, document-revisions, document-distributions, document-classes, functional-groups, functional-group-members, checklist-groups, checklists, checklist-runs, maintenance-orders e maintenance-order-transitions. O branch dinâmico drivers/drivers-* também não aparece na definição atual. A 0203 substituiu a função com uma versão reduzida; correções 0209–0211 restauraram apenas casos pontuais. Isto comprova omissões no dispatcher, não falha HTTP reproduzida de todos esses recursos; GED contrato foi reproduzido. SYS-RES-01 segue aberto para o recurso novo de identidade, que também precisa integração explícita.

Correção de análise anterior: o relato em SYS-OS-01 de que os recursos GED tinham branches correspondentes não descreve o banco atual e não deve orientar implementação. Exige auditoria cumulativa do dispatcher, incluindo rotas cuja intenção nasce fora de atomicCreateResources e normalização entre rota/recurso de receipt. 0217 foi encontrada registrada nesta consulta, sem execução de rebuild/worker ou confirmação de regressão integral.

### Pedido ao programador — corrigir dispatcher cumulativo

SYS-GED-01: POST /v1/admin/document-contracts cria 201 e replay idêntico retorna 422 invalid_document. Evidência contém body, chave e UID; banco responde invalid_create_resource na revalidação. Revisar toda a substituição da 0203 contra dispatchers anteriores e implementações atuais. Restaurar em migration forward os recursos omitidos preservando getters e verificações por ação, organização, owner, scope e identidade atual. Incluir também protocol identities/shares/mappings da SYS-RES-01. Não remover common.check_create_visibility, não conceder bypass/RLS/DML amplo e não editar migrations aplicadas.

Entregar matriz rota -> resource armazenado -> getter/guard de replay e regressões para cada família: create/replay, fingerprint diferente, perda de autorização, restauração, target diferente e ausência de efeitos duplicados. Testar GED revisões/distribuições, classes/grupos funcionais, checklists, manutenção e drivers com papéis reais. Verificar intents criados manualmente e recursos de transição. Separar cobertura estática, SQL e HTTP. O objetivo é evitar novas correções isoladas do mesmo dispatcher.
