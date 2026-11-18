<!-- Leia primeiro DEVELOPER_GUIDE.md. Este é o roteiro mestre e cumulativo de homologação. Atualize-o em toda entrega. -->

## 23/10/2026 — SYS-GED-01: replay de contrato e regressão transversal

Novo teste HTTP independente do GED: GET catalogs 200, POST document-contracts 201 e retry idêntico 422 invalid_document. A chamada read-only common.check_create_visibility('document-contracts',uid), sob navisoft_auth/Primary, confirmou SQLSTATE 22023 invalid_create_resource e ROLLBACK. Contrato fixture 613148b0-6a44-4b5b-9f55-da7dd39c01a8 preservado: nenhuma criação de documento, revisão, distribuição ou objeto físico foi alcançada. Não repetir com outra chave para contornar o defeito. Evidência: [GED](evidence/2026-10-23-ged-http.json).

Comparação estática entre dispatcher da 0171 e definição efetivamente instalada encontrou 12 branches explícitos ausentes: document-contracts, documents, document-revisions, document-distributions, document-classes, functional-groups, functional-group-members, checklist-groups, checklists, checklist-runs, maintenance-orders e maintenance-order-transitions. O branch dinâmico drivers/drivers-* também não aparece na definição atual. A 0203 substituiu a função com uma versão reduzida; correções 0209–0211 restauraram apenas casos pontuais. Isto comprova omissões no dispatcher, não falha HTTP reproduzida de todos esses recursos; GED contrato foi reproduzido. SYS-RES-01 segue aberto para o recurso novo de identidade, que também precisa integração explícita.

Correção de análise anterior: o relato em SYS-OS-01 de que os recursos GED tinham branches correspondentes não descreve o banco atual e não deve orientar implementação. Exige auditoria cumulativa do dispatcher, incluindo rotas cuja intenção nasce fora de atomicCreateResources e normalização entre rota/recurso de receipt. 0217 foi encontrada registrada nesta consulta, sem execução de rebuild/worker ou confirmação de regressão integral.


## 23/10/2026 — Device Resolution rebuild cursor (0217)

O erro operacional `42702 column reference "h" is ambiguous` vinha de `common.device_resolution_rebuild_page(text,integer)`: a variável PL/pgSQL `h` tinha o mesmo nome da coluna projetada no CTE. A forward 0217 usa aliases qualificados e variáveis distintas, preservando owner, SECURITY DEFINER, `search_path`, grants e RLS. A regressão real foi ampliada para consumir duas páginas de um item, com `next_after` não nulo, e confirmar que ambos os hashes foram enfileirados; ela termina em `ROLLBACK`.

Revisar e aplicar somente migrations ausentes pelo wrapper, depois executar a regressão:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/upgrade_device_resolution.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/device_protocol_resolution.sql
```

A regressão completa ainda não foi executada após a mudança da fixture de override. Um probe isolado em PGlite compilou e exercitou o corpo da função 0217 com três hashes, três páginas/cursors, página terminal vazia e enqueue de todos os hashes; não substitui a migration/regressão completa. Confirme `ROLLBACK` antes de considerar a evidência SQL aprovada. Os testes Go locais não substituem essa execução nem a validação de rebuild com Valkey.

## 22/10/2026 — SYS-OS-02 retestado; SYS-RES-01 aberto

API voltou a responder. Fixture nova executou instalação, substituição e retirada com executor Basic vinculado e scope explícito de assets. Conclusões e replays 200, mesmos UIDs/completed_at, sem pricing_snapshot no self-service. Conflito de fingerprint 409; perda/restauração de scope com novo login negou/permitiu replay. Substituição e retirada tiveram declaração de devolução 200 preservando return_pending e recebimento físico administrativo 200 fechando custódia. SYS-OS-02 encerrado nesses cenários HTTP após 0212. Não é aprovação integral do módulo nem confirmação independente da regressão SQL. Fixture: login desvinculado/desabilitado, técnico desativado, dois assets excluídos 204; devices preservados com histórico e sem custódia pendente. Evidência: [0212 HTTP](evidence/2026-10-22-work-order-executor-0212-http.json).

Continuidade em identidade/projeção (0213–0216): listagens protocol-identities e telemetry-mappings 200; identidade criada 201 com zeros iniciais preservados. Retry com mesma chave/body/ator retornou 422 invalid_device: **SYS-RES-01 aberto**. Consulta read-only sob navisoft_auth/Primary confirmou common.check_create_visibility('devices/protocol-identities',uid) -> 22023 invalid_create_resource, com ROLLBACK. Go registra devices/protocol-identities, devices/protocol-identities/:uid/shares e devices/telemetry-mappings como create idempotente; revisar integração de todos com o dispatcher, sem presumir que os dois últimos já falharam em HTTP. Identidade de teste desativada por PUT 200. Worker/Valkey não foram iniciados ou homologados. Evidência: [identidade e replay](evidence/2026-10-22-protocol-resolution-http.json).


## 22/10/2026 — reteste bloqueado por conexão HTTP recusada

Verificadas as últimas entregas: 0212 corrige validação da prestadora na retirada self-service; 0213–0216 adicionam/corrigem resolução de identidade e projeção. Consulta PostgreSQL read-only confirmou essas cinco migrations registradas e terminou em ROLLBACK. Isso não comprova sucesso das regressões SQL. O último retorno do programador ainda deixa pendente o reteste de device_protocol_resolution.sql após corrigir a fixture de replacement completo de overrides.

Tentativa real de POST /v1/users/login em http://172.25.73.91:8080 falhou antes de obter resposta HTTP: WinError 10061 (conexão recusada). Nenhum status HTTP, login ou fixture foi criado; SYS-OS-02 continua aguardando reteste HTTP da retirada/replacement e replay com executor Basic. É necessário disponibilizar novamente o listener da API nesse endereço para continuar. Não confundir indisponibilidade de conexão com erro de payload ou de autorização. Evidência: [tentativa e estado SQL](evidence/2026-10-22-work-order-executor-0212-http.json).


## Protocol identity resolver — 0213–0216 encontradas; 0217 preparada e regressão aguarda reteste

O erro anterior no refresh foi causado pela guarda histórica comparando colunas geradas em um trigger BEFORE; a migration forward 0216 compara apenas campos armazenados e mantém a imutabilidade do restante. No relato operacional seguinte, a regressão avançou pelo refresh e falhou na fixture ao liberar um device recebido: `custody_receive()` o deixa em `cleaning_testing/testing`, e `inventory_transition(...,'release')` exige condição `ready`. A fixture agora registra e verifica a inspeção explícita para `ready` antes da liberação. Essa alteração local ainda aguarda reteste PostgreSQL. Probe isolado PGlite da guarda: **PASS** para fechamento válido e rejeição de update de outro campo/DELETE; não substitui a regressão integral, que exige `btree_gist`. O wrapper aplica apenas migrations ausentes.

Pre-homologation review: the isolated PL/pgSQL `telemetry_mapping_valid()` function compiled and passed eight PGlite positive/negative cases. Focused Go tests, `go vet ./...`, `go build -buildvcs=false ./...`, `gofmt`, and `git diff --check` passed for the earlier 0213 implementation. The full migration and SQL regression were not executed in PGlite because this build does not provide `btree_gist`; this is not SQL/regression approval. Operator runs exposed fixture issues: the internal hash helper was called under the runtime role, and direct `devices.link_save()` attempted initial associations despite the work-order guard. The fixture now creates initial associations through work orders and custody confirmation, expects direct relinking to fail, and uses `work_order_complete()` for completion payloads. The latest operator run then exposed a production SQL defect: create generated a local UID but let the table generate a different UID, then read back using the unused local value. Migration 0214 assigns the inserted row's returned UID before readback. The updated fixture and 0214 have not yet been run against PostgreSQL; rerun the wrapper and full regression, confirming `ROLLBACK`.

The migration also declares and regression-checks the `(uid_organization, uid)` unique key required by the override-version composite FK. The exact override/versions DDL compiled in isolated PGlite with stub parent tables. This addresses the DDL error reported at migration line 80; after the local correction, re-run the full PostgreSQL regression as a single operator step before proceeding with API/worker homologation. Its asset-change scenario now uses the existing work-order removal/install lifecycle and separately asserts that direct relinking is rejected by `device_work_order_required`.

The lookup digest uses the PostgreSQL built-in `pg_catalog.sha256(bytea)` so the migration does not rely on `pgcrypto` having been installed into `common`. The regression checks the fixed normalized input/output vector outside `navisoft_auth` and asserts that `navisoft_auth` has no direct EXECUTE privilege on the internal hash helper. Do not grant the helper to the runtime to make the assertion pass; SECURITY DEFINER owner routines call it internally.

1. Review `migrations/0216_protocol_destination_close_guard.up.sql`, `migrations/upgrade_device_resolution.sql`, and the updated regression. Do not edit or reapply 0213–0215.
2. Apply manually: `psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/upgrade_device_resolution.sql`. It skips recorded migrations and installs only missing forward versions.
3. Run regression: `psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/device_protocol_resolution.sql`; verify it ends in `ROLLBACK`.
4. Configure `postgres_device_resolution_worker` with a dedicated LOGIN on the same database, member of `navisoft_device_resolution_worker`; configure a dedicated Valkey deployment/ACL in `redis_device_resolution`. Keep `device_resolution_sync.enabled=false` until ready. Run `go run ./cmd/device-resolution-sync -config config.json -check-config`.
5. Build/restart the API to expose admin routes, then test identity create (including leading zeroes), duplicate conflict, mapping profile/version, device override and Primary-only share/revoke one case at a time.
6. Start only the separate worker after target review. Check `/live`, `/health`, `/metrics`, then change an identity/link/mapping and observe a higher projection generation and complete Valkey replacement. Test against Gateway event `createdAt` across an asset transfer and share revocation; never substitute GPS time.
7. Test worker restart and `-rebuild` only in an isolated Valkey namespace, with all projector instances stopped. Rebuild clears only `gateway:resolution:v1:*}:snapshot`.

Evidence status: after the fixture added inspection to `ready` before release, the operator run reached `shared_identity_mapping_projection_not_refreshed`. The assertion expected the base device's `S_ASSIGN1` replacement after a second override PUT had replaced the full override array without carrying that entry forward. The fixture now retains that replacement and still tests `inherit`/`remove`; this change awaits PostgreSQL retest. The failure does not establish a production projection defect, and the full SQL regression is not approved. Confirm migration markers in the operator database. Valkey Lua, worker deployment, HTTP homologation, Consumer Positions and ClickHouse remain pending. No operational database or external service was accessed by the agent.

## SYS-OS-01 — replay retestado; SYS-OS-02 — retirada pelo executor

Operador informou regressão PostgreSQL concluída com RESET/DO/ROLLBACK e API reiniciada. Consulta read-only confirmou 0210 e 0211 registradas e terminou em ROLLBACK. Replay do receipt original de conclusão retornou 200/replayed=true, mesmo UID, completed_at e pricing_snapshot. Em fixture HTTP nova com usuário Basic vinculado ao executor: instalação/conclusão e replay 200; corpo alterado com mesma chave 409; alvo diferente 409; ausência de sessão 401; retirada de scope com novo login 404; restauração de scope com novo login permitiu replay 200. Resposta self-service não expôs pricing_snapshot. SYS-OS-01 encerrado nesses cenários. Não foi retirada a permissão global devices.access.

A continuação encontrou **SYS-OS-02**: retirada criada e despachada; start self-service 200; conclusão pelo executor 409 `device_reference_conflict`; a mesma OS/corpo foi concluída pelo Primary (200). O operador executou a regressão e capturou SQLSTATE 23503 `device_technician_not_found` em `capture_technician_history()`. A causa era a leitura da entidade prestadora filtrada por `entities.can_manage_record()` dentro de `technician_provider_valid()`, que oculta a entidade ao Basic executor. A correção forward 0212 mantém a validação de lifecycle e tipo pela associação estrutural, sem ampliar RLS/grants. A regressão exige 0212 e chama o wrapper self-service real. Veja a seção SYS-OS-02 para comandos e critérios; ainda não homologar até o operador reaplicar a regressão e retestar HTTP.

Cleanup concluído via API: executor declarou devolução 200, mantendo return_pending sem received_at/closed_at; Primary recebeu fisicamente 200 e fechou custódia. Login desvinculado, executor desativado, usuário de fixture desabilitado e dois assets excluídos 204. Device mantido por 409 de dependência histórica, sem custódia aberta. Evidências: [replay original](evidence/2026-10-21-work-order-0211-retest.json) e [executor e retirada](evidence/2026-10-21-work-order-executor-0211-http.json). Não marcar todo o módulo como homologado.


## SYS-TECH-01 — 0209 retestada; novo bloqueio SYS-OS-01

Operador informou migrations e regressão sem erro. HTTP confirmou replay do receipt original 200 e novo ciclo create 201/replay 200/conflict 409. Capabilities repetidas retornaram 422 sem alteração; preço válido 200 com custo 10001, markup 12.34 e total 11235 centavos. Replacement no-op preservou items/version/effective_at; custo negativo 422 preservou preços; DELETE técnico 405 e desativação 200. Em conta Secondary com grant temporário, criação 201, replay após retirada e novo login 404, e replay após restaurar grant 200 com mesmo UID. Campos originais da conta conferidos restaurados e executores desativados. Evidências: [0209](evidence/2026-10-21-technician-0209-retest.json) e [replay com scope](evidence/2026-10-21-technician-replay-scope-http.json). SYS-TECH-01 encerrado nesses cenários.

Continuidade em OS: novo asset/device de fixture, prepare/release, create/replay de OS, dispatch e snapshot priced version 1/11235 centavos aprovados. Start antes de confirmar recebimento retornou 409 device_custody_confirmation_required; confirmação, start e conclusão retornaram 200, completed=true. Replay imediato da conclusão com mesmo body/chave retornou 422 invalid_device; consulta SQL reportada pelo operador retornou 22023 `invalid_create_resource` para `device_work_order_completion`, com receipt original presente. A 0210 restaurou o branch; a 0211 remove o gate duplicado do dispatcher, mas o getter do executor continua revalidando conta, área `devices`, lifecycle ativo e scope do asset. A fixture mantém a permissão durante vínculo, conclusão e replay autorizado; testa perda de autorização retirando/restaurando o scope do asset e confirma que a receipt original permanece. Não se deve esperar replay positivo após revogação da área. A 0211 e a regressão corrigida ainda precisam ser aplicadas/executadas pelo operador.

Após revisão, se 0210 já estiver aplicada, aplicar a correção forward: `psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/upgrade_work_order_completion_self_service_replay.sql`. Executar em seguida `psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/device_technician_self_service.sql` e confirmar `ROLLBACK`. O reteste HTTP deve repetir a conclusão e o replay imediato com a mesma chave, body, ator e UID da OS usados no caso original; esperado: ambos 200, segundo response com `replayed=true` e snapshot/UID iguais. Repetir com o usuário executor também é necessário para confirmar o branch de OS própria. A regressão remove apenas o asset da OS do scope atual do executor, espera `device_work_order_not_found`, restaura o scope e confirma que a mesma receipt continua replayável, sem exigir a área `devices`. Não marque HTTP ou PostgreSQL como aprovados antes da execução real.

Cleanup pelo fluxo operacional: segunda OS removeu o device, recebimento de retorno 200 fechou a custódia, asset excluído 204, executor desativado 200. Exclusão do device retornou 409 por dependência histórica; mantido na fixture, sem apagar OS ou FKs. Evidência [OS completa e cleanup](evidence/2026-10-21-technical-work-order-http.json). A primeira execução do teste esperava incorretamente 201 no replay de criação da OS; o 200 observado era correto e a expectativa foi ajustada antes de continuar. Não atribuir esse ajuste ao backend.


## SYS-TECH-01 — replay de executor: 0209 registrada na base testada; regressão SQL e HTTP pendentes

Após SYS-GEO-01 resolvido e avanço nos tópicos Entidades/Frota/Devices, cadastro de técnico foi testado com prestadora nova classificada technician. Create retornou 201 com executor `74bca4b5-0657-4110-a638-9ddfbc7bde93`; retry imediato do mesmo body/chave retornou 422 `invalid_technician`, em vez de 200 replay. Receipt confirmado somente por consulta read-only: request_uid `191b68eb-e53f-40e7-9904-89d09e3aaa57`, resource `entities/technicians`. Não foi necessário criar outro executor para reproduzir.

A definição da 0203 não reconhece o recurso `entities/technicians` no dispatcher SQL, embora Go o registre para create idempotente. `common.begin_create()` encontrava o receipt e, ao revalidar visibilidade, falhava com 22023 `invalid_create_resource`; `technicalProviderError()` convertia isso em 422 `invalid_technician`. A migration 0209 restaura o gate `devices` e `devices.technician_get(id)` sem remover autorização nem alterar o receipt. A execução reportada passou a pré-condição da regressão que exige 0209 registrada, mas parou primeiro na fixture com chamada direta a `access.can_read_data()` sem acesso ao schema interno; após essa correção, um negativo de listagem usou org B, permitida ao ator. A fixture agora restringe o Administrator temporário à org B e testa a org A como cross-tenant. A regressão completa ainda está pendente.

A chamada direta a `access.can_read_data()` foi removida; nenhum grant ao runtime é necessário, pois `common.begin_create()` executa o gate sob sua fronteira autorizada. O teste cross-tenant usa Administrator temporário com scope somente em org B, exige área `devices` e executa get/update/list contra org A, esperando os erros de domínio respectivos. Nenhum grant ao runtime é necessário.

Executor de teste foi desativado via PATCH 200; prestadora preservada por DELETE 409 devido à referência histórica, sem apagar vínculo/constraint para forçar limpeza. Preço/dispatch não foram alcançados nesta rodada. Evidência em [técnico/prestadora](evidence/2026-10-21-technician-provider-pricing-http.json). Critérios de correção em frontend_issues.md. Nenhuma OS foi criada ou despachada.

Depois de revisar/aplicar a migration, execute a regressão completa com `ON_ERROR_STOP=1` e confirme `ROLLBACK`. Em HTTP, repetir primeiro o mesmo POST com a chave original somente se a fixture ainda estiver válida: esperado 200, `Idempotency-Replayed: true` e o mesmo UID; em seguida, mesma chave com body alterado deve retornar 409 `idempotency_conflict`. Para perda de acesso, usar ator/fixture descartável: criar com scope no alvo, remover somente esse scope preservando acesso a outra organização e repetir a mesma chave/body; a leitura deve ser negada, sem revelar o executor nem criar nova receipt. Não usar somente teste do helper como prova do caminho HTTP.

Comandos preparados, ainda não executados operacionalmente:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/upgrade_technician_create_replay_visibility.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/technician_capabilities.sql
```


## SYS-GEO-01 — 0208 aplicada, reteste HTTP e fronteira de privilégios

Operador informou SQL executado; consulta read-only confirmou 0208 registrada. Fronteira observada: navisoft_auth sem SELECT na scope_grants; owner Geo com SELECT na coluna uid_user e sem UPDATE. ROLLBACK confirmado. Não foi rerodada a regressão operacional completa pelo tester.

Reteste inicial GET/POST cercas, pontos e rotas: quatro 200. Fixture de duas cercas organizacionais: 26 chamadas passaram (duas criações e 24 consultas GET/list/search/detail em quatro perfis), incluindo listas vazias fora do scope e detalhe 404 para Administrator/Secondary. Basic recebeu 403 area_not_allowed, coerente com sua área atual; isso não testa Basic com área concedida. Duas exclusões da fixture retornaram 204. Evidências: [preflight](evidence/2026-10-21-geofence-0208-preflight.json) e [quatro perfis](evidence/2026-10-21-geofence-0208-http.json). SYS-GEO-01 encerrado neste escopo; não homologa toda geometria, transferência ou concorrência.

## Ampliação HTTP — Entidades, Frota e Devices/SIM

Entidades: sete operações CRUD/idempotência e 15 casos adicionais de tipos, lifecycle e negativas passaram. Frota: 15 operações de entidade/grupo/asset/participação, replay, imutabilidade organizacional e lifecycle passaram; entidade parent preservada por 409 após exclusão lógica do asset (dependência histórica). Devices/SIM: 12 chamadas passaram, liberação atômica de SIM observada na desativação e ausência de relink automático na reativação; cadastros novos removidos por DELETE 204. Não houve alteração de ativos ou dispositivos preexistentes, comando físico, ingestão ou provisioning externo.

Documentos por tópico: [Entidades](frontend_03_entities.md), [Frota](frontend_04_fleet.md), [Devices/SIM](frontend_05_devices_sim.md), [Geografia](frontend_06_geography.md). Todos delimitam o escopo testado; não representam aprovação integral dos módulos.


## SYS-KB-01 e SYS-GEO-01 — estado das correções frontend

Após correção, 13 chamadas de Knowledge passaram: GET/POST listagem com envelope, paginação sem duplicatas entre as páginas observadas, busca vazia, limite/filtro inválido 400, detalhe preservado e seis negativas de listagem/pesquisa com Administrator/Secondary/Basic (403 knowledge_primary_required). Listas não incluíram videos. Evidência: [reteste Knowledge](evidence/2026-10-21-knowledge-listing-retest.json). SYS-KB-01 encerrado no escopo HTTP executado; isso não homologa todos os fluxos editoriais.

A varredura prosseguiu com 24 GETs; consultas antes sem organização passaram ao receber filtro uid_organization eq. Billing, Services, Commercial overview, configuração da Agenda e Notifications responderam 200. Geofences permaneceu 403 geo_not_allowed com Primary, mesmo com filtro válido. Evidência: [continuação da varredura](evidence/2026-10-21-system-readonly-primary-survey-continued.json).

SYS-GEO-01: a reprodução PostgreSQL reportada pelo operador, sob `navisoft_auth` com Primary, falhou em `geo.can_read_scope()` com SQLSTATE 42501 ao ler `access.scope_grants`. A função é SECURITY DEFINER de `navisoft_geo_owner`; 0067 a atualizou para leitura direta da tabela, mas esse owner não tinha SELECT/policy na tabela FORCE RLS pertencente a `navisoft_policy`. A migration forward 0208 preparada concede somente SELECT(uid_user,uid_organization) ao owner geográfico e limita as linhas por RLS ao UID atual com `access.can_read_data()`. Nenhum privilégio é concedido ao runtime. A regressão local executa a query gerada pelo `filters.Manager` como `navisoft_auth` para Primary e para um Secondary cross-tenant, além de conferir a negação de SELECT direto do runtime. Testes Go focados, vet e build passaram. O runner PostGIS não foi executado porque o WSL disponível não tem `initdb`, `pg_ctl` ou `postgres`; migration, regressão PostgreSQL e homologação HTTP permanecem pendentes. Após revisão, aplicar `migrations/upgrade_geo_scope_grant_visibility.sql`, executar `migrations/tests/run-geography.sh` em ambiente local descartável e então homologar os dois endpoints conforme [frontend_issues.md](frontend_issues.md). Não reaplicar 0044 nem considerar a falha interna como negação legítima do Primary.


## Varredura de sistema — bloqueio Knowledge em listagem/pesquisa

Executadas 52 consultas GET de reconhecimento com Primary, em 21/10/2026; não são homologação completa dos módulos. Respostas 400 `organization_target_required` indicam chamadas ainda sem o corte organizacional do contrato, não defeitos comprovados. Dois 403 geográficos permanecem por investigar. O primeiro 5xx ocorreu em listagem de artigos Knowledge. Evidência agregada em [varredura Primary](evidence/2026-10-21-system-readonly-primary-survey.json).

Reprodução dirigida: GET `/v1/admin/knowledge/items` e POST `/v1/admin/knowledge/items/search` com `{limit:2,offset:0}` retornaram 503 `knowledge_storage_unavailable`. Categorias e detalhe do artigo existente retornaram 200 na mesma sessão; não atribuir a falha a indisponibilidade total de Knowledge. Request IDs das falhas: `8ae81a34-bbc5-446b-b659-ecb015ce2cce` e `e3910096-3381-4ace-a8d2-5e741d5703db`. Evidência em [reprodução Knowledge](evidence/2026-10-21-knowledge-listing-503.json).

SYS-KB-01: a forma antiga `knowledge.admin_item_rows() AS k(uid uuid,...)` falha com SQLSTATE `42601` porque a função já declara colunas em `RETURNS TABLE`. O mapa do `filters.Manager` foi corrigido para `knowledge.admin_item_rows() AS k`. Teste Go confere SQL/alias/paginação; `migrations/knowledge/tests/videos.sql` reproduz `42601` na sintaxe antiga e executa a consulta paginada equivalente sob `navisoft_knowledge_runtime`, sem acesso direto às tabelas. O SQLSTATE do incidente HTTP operacional não foi registrado na evidência sanitizada; `42601` foi comprovado no harness descartável. Não houve acesso ao PostgreSQL operacional. Após rebuild/restart, o operador deve repetir GET `/v1/admin/knowledge/items?limit=2&offset=0` e POST `/v1/admin/knowledge/items/search` com `{"limit":2,"offset":0}`; confirmar HTTP 200, envelope paginado e ausência de `videos` na lista. A homologação HTTP permanece pendente.

Validação local: teste focal `internal/filters`, teste `internal/server` para `itemList`, regressão PGlite Knowledge, vet focal e build da API passaram. A suíte completa combinada de filtros/servidor não completou porque a suíte cumulativa Core parou em `billing_0192_required`; o pacote servidor passou. Não executar migrations nem considerar HTTP homologado com base nesses testes locais.

Bloqueio de aceite: tela administrativa de artigos e pesquisa não podem ser consideradas integráveis/homologadas até corrigir e retestar. A recuperação de senha permanece funcional; a restauração da senha antiga é pendência independente e não motivou esta parada.


## INT-02 — recuperação positiva aprovada; restauração de senha bloqueada

Operador recebeu o email real e forneceu o link de recovery. Validate retornou 200 com política de senha e prazo, sem identidade; complete com senha nova de homologação retornou 204 sem corpo. Bearer anterior retornou 401 `revoked` em Status e 401 no contexto. Revalidação e segundo complete do token consumido retornaram 422 `recovery_token_invalid_or_expired`. Login com a senha nova retornou 200.

A tentativa autorizada de restaurar a senha anterior usando `cmd/password-init -recover` foi rejeitada com `password_recently_used` (exit 1). Não houve bypass do histórico nem alteração SQL. A senha do Basic permanece a nova usada no recovery e seu login foi conferido 200 após a falha de restauração. Credencial e token não são gravados neste documento ou evidência. **Pendência operacional aberta:** alinhar com operador/programador se manter senha nova ou prover procedimento de homologação específico, sem enfraquecer a política geral. Não declarar restauração concluída.

Evidência: [recuperação positiva](evidence/2026-10-21-int02-recovery-positive-http.json). Recuperação funcional e uso único passaram; restauração é bloqueio separado. O navegador ainda não foi homologado, e isso não entrega fluxo de convite/primeira senha nem cadastro público.


## INT-02 — documentação inicial e recovery negativo

Sete casos HTTP de recovery inválido/inelegível passaram, sem troca de senha. Detalhes, sequência frontend e trecho React em [frontend_02_credentials.md](frontend_02_credentials.md). Recuperação positiva e primeiro acesso pelo navegador permanecem pendentes; não equivalem à homologação MFA recém-concluída.


## INT-01 — sessão pending_mfa e promoção homologadas

O email autorizado pelo operador já estava associado e verificado no Basic; não foi duplicado nem transferido. Preferência pessoal de MFA foi temporariamente habilitada pela API. Login retornou 202 `pending_mfa`; Status 200 com `authenticated=false`; as três rotas INT-01 retornaram 401, sem contexto de negócio. O operador forneceu o código recebido; confirmação retornou 200 e promoveu a mesma sessão para active. O mesmo Bearer acessou Status e três rotas INT-01 com 200. Preferência original `require_mfa=false` foi restaurada por PUT e conferida por GET; política organizacional permaneceu false. Código e Bearers não foram gravados na evidência.

Evidência: [pending MFA e confirmação](evidence/2026-10-21-int01-pending-mfa-http.json). Isso encerra a dependência do teste pending_mfa neste cenário; o teste não cobre todos os erros de código, expiração ou perda do fator. Persistem limites de falha técnica isolada e escala/concorrência. Não declarar essas verificações executadas.


## INT-01 — acesso financeiro separado do operacional; limite de MFA

Fixture nova `int01.financial.0207`, perfil Secondary, foi criada pela API com scope somente sobre a Power. A senha foi inicializada com `cmd/password-init`. Durante habilitação temporária: seletor 200, contexto Power 200, contexto e GET administrativo do consumidor Automega 404 `organization_not_found`, GET de Billing Entry do consumidor 200. Isso comprova leitura financeira consolidada sem converter membership em contexto operacional no cenário executado. Não foram criados ou alterados lançamentos nem memberships. Conta desativada ao final. Evidência: [financeiro sem operação](evidence/2026-10-21-int01-financial-only-http.json).

A fixture temporal foi reabilitada somente para verificar MFA exigido na organização descartável: login com senha válida e email não verificado retornou 422 `mfa_verified_email_required`. A política original foi reenviada com sucesso e a conta desativada novamente. Evidência: [pré-condição MFA](evidence/2026-10-21-int01-mfa-precondition.json). A geração de sessão pending_mfa não foi homologada: falta uma fixture isolada com email verificado por fluxo real. Não marcar verificação diretamente em SQL nem extrair OTP para fabricar evidência HTTP.

**Parecer acumulado:** positivos de leitura nos quatro perfis, negativas de autenticação/cross-tenant, gates versus operações no-op, paginação pequena, revogação pelo PUT completo, block/warn e separação financeira executados. Pendentes: pending_mfa contra as três rotas, falha técnica por injeção controlada, escala superior a 100 organizações/concorrência. Nenhuma interrupção de infraestrutura compartilhada foi feita. A regressão SQL permanece evidência reportada pelo operador.

### Alinhamento necessário para concluir MFA

Disponibilizar uma conta de teste isolada com email cujo acesso ao fluxo de confirmação seja autorizado, verificar o contato pela API, habilitar MFA e conferir: login 202, Status pendente não autenticado, três endpoints INT-01 retornando 401 sem dados, confirmação válida e novo acesso autorizado. Registrar restauração e desativação. Falha técnica requer ambiente/fixture de falha isolada; não derrubar PostgreSQL ou Redis compartilhados para completar a matriz.


## INT-01 — horário block/warn homologado em fixture isolada

Após revisão do programador, a invalidação após PUT completo de usuário foi aceita como contrato existente e documentada; nenhum backend foi alterado pelo tester. Prosseguiu-se com teste temporal em conta nova `int01.temporal.0207` na organização descartável 0203, sem email de entrega e sem modificar contas compartilhadas. Cadastro pela API retornou 201; senha foi inicializada por `cmd/password-init`, sem reset de senha existente. A conta foi habilitada temporariamente e desativada ao final.

Dez GETs com o mesmo Bearer foram observados: em `block` com semana vazia, Status 200, contexto global 200 com `area_access.status=not_evaluated`, `reason=outside_access_period`; seletor, contexto organizacional e perfil retornaram 403. Em `warn`, os cinco GETs retornaram 200 e o contexto global voltou a `evaluated`. A janela foi aplicada somente à organização descartável. O payload original mode/timezone/week foi restaurado pela API e comparado com o GET final: preservado. A conta permanece desativada como fixture identificada. Auditoria, autoria e sessões decorrentes dos testes permanecem como histórico legítimo.

Evidência: [2026-10-21-int01-temporal-http.json](evidence/2026-10-21-int01-temporal-http.json). O teste comprova gate temporal e consulta mínima durante bloqueio; não comprova MFA, falha técnica, grant somente financeiro ou todas as bordas de calendário/tolerância. Não reaplicar migrations por esse teste.

### Consequência para React

Não converter `not_evaluated` e `areas={}` em uma lista confirmada de áreas negadas. Apresentar aviso de restrição temporal e suspender consultas protegidas. No modo warn, permitir navegação autorizada e exibir aviso conforme o período retornado. Estado autenticado fora de horário não é equivalente a revogação; em 401 `relogin_required`, reconstruir a sessão e os contextos após novo login.


## INT-01 — PUT de scope invalida a sessão anterior

O Secondary recebeu temporariamente um scope adicional para a fixture 0203, autenticou-se e obteve contexto 200. Ao restaurar os scopes pelo PUT completo, `/v1/users/status` com o Bearer anterior retornou 401, `state=revoked`, `relogin_required=true`. Após novo login, o contexto retirado retornou 404 e o original 200. Os campos administráveis foram restaurados.

O comportamento atual decorre do PUT completo: `users.admin_save()` atualiza campos que disparam `version_sessions`, incrementando `session_version`; a sessão anterior passa a responder `state=revoked`. O teste não verificou `revoked_at`. Após qualquer PUT de usuário, descarte o Bearer anterior da conta afetada e faça novo login antes de repetir as consultas INT-01. O novo login avalia os scopes atuais. Evidência: [revogação de scope](evidence/2026-10-21-int01-live-scope-revocation.json). Outros caminhos de alteração de autorização e cenários de temporalidade/MFA/acesso somente financeiro seguem pendentes.


## INT-01 — comparação HTTP de gates com operações reais

Executadas 16 comparações nos quatro perfis, usando valores existentes em PUTs de código/nome, revenda e política de sessão, além de GET da política. Todos coerentes com os gates: Primary 200 em todos; Administrator 403 em revenda; Secondary 403 em nome/código e revenda; Basic 403 nas duas edições de organização e 404 `resource_not_found` em GET/PUT de política (ocultação prevista em `accessError`). O teste inicial esperava 403 nessa última negativa; o código confirmou 404 e a evidência foi corrigida sem alterar a API. Campos de negócio e política conferidos preservados; autoria/auditoria podem mudar nos PUTs. Tópico frontend com exemplo React e limites em [frontend_01_access_context.md](frontend_01_access_context.md). Evidência em [operações HTTP](evidence/2026-10-21-int01-gate-operations-http.json). Temporalidade, MFA, outros caminhos de revogação dinâmica e conta somente financeira permanecem pendentes; não declarar aprovação integral.


## INT-01 — perfis confirmados no PostgreSQL e leitura Administrator

Consulta autorizada em `10.10.11.17`, banco `autoscale_nvs_db`, com `autoscale_ems_admin`, executada em `BEGIN READ ONLY` e concluída com `ROLLBACK`: `admin.autoscale` é `primary_admin`, `basic.copacabana.0067` é `basic_user`, `secondary.homolog.0067` é `secondary_admin`, e `administrator.homolog` é `administrator`; as quatro contas estão habilitadas e têm senha inicializada. Isso confirma os perfis por dado real, não por nome de login. Nenhum hash/senha foi consultado e nenhuma conta foi criada ou redefinida.

Login autorizado de `administrator.homolog` retornou 200. Oito GETs retornaram os resultados descritos abaixo, todos com `Cache-Control: no-store`: contexto global 200; seletor 200 com Empresa Teste e Admin Homolog Client; contexto de ambas 200, edição de nome/código `allowed` e alteração de revenda `denied`; política de sessão `allowed` na própria organização e `denied` no cliente. Os contextos Autoscale, Power e UUID inexistente retornaram 404 `organization_not_found`. GET real da política de sessão da própria organização retornou 200, coerente com o gate de leitura. Nenhum PUT foi enviado: equivalência de mutação permanece não homologada.

Evidência HTTP em [2026-10-21-int01-administrator-http.json](evidence/2026-10-21-int01-administrator-http.json). Positivos e negativas de leitura foram executados com os quatro perfis; não equivalem a aprovação integral de outros caminhos de revogação dinâmica, grants somente financeiros, temporalidade, MFA ou falhas técnicas. A consulta superuser confirma dados, não substitui os testes HTTP de autorização. Nenhuma configuração, permissão ou dado de negócio foi alterado; login cria sessão conforme a política existente.


## INT-01 — HTTP Basic e Secondary: leitura restrita conferida

Em 21/10/2026, login autorizado de `basic.copacabana.0067` e `secondary.homolog.0067` retornou 200. Foram executados 20 GETs, dez por conta, sem alteração de scopes, grupos de permissões, política ou dados de negócio. Login cria sessão e pode aplicar a política de concorrência existente.

| Verificação | Basic | Secondary |
|---|---|---|
| Status e resumo global | 200, sessão ativa | 200, sessão ativa |
| Organizações selecionáveis | Uma: Empresa Teste Atualizada | Uma: Empresa Teste Atualizada |
| Edição código/nome e revenda no contexto visível | `denied` / `denied` | `denied` / `denied` |
| Gates de leitura/edição da política de sessão | `denied` / `denied` | `allowed` / `allowed` |
| Contextos Autoscale, Power, fixture 0203 e UUID inexistente | 404 `organization_not_found` nos quatro | 404 `organization_not_found` nos quatro |
| Busca `q=autoscale` | 200, lista vazia | 200, lista vazia |
| `limit=101` | 422 `invalid_organization_query` | 422 `invalid_organization_query` |

Todas as 20 respostas incluíram `Cache-Control: no-store`. As áreas retornadas diferiram entre os perfis; Basic recebeu, entre outras, `assets=allowed` e `users=commercial=organizations=denied`; Secondary recebeu `users=commercial=allowed`, `organizations=denied`. Esses valores são observações das contas atuais, não defaults universais dos perfis. O gate de política de sessão permitido ao Secondary não comprova mutação: a equivalência com GET/PUT reais ainda precisa de teste específico, preservando integridade.

Evidências: [2026-10-21-int01-basic-secondary-http.json](evidence/2026-10-21-int01-basic-secondary-http.json). Parecer: positivos de leitura e ocultação cross-tenant observados nestas contas aprovados; conjunto autorizado não foi comparado com inventário independente no banco. Nenhuma SQL ou teste Go foi executado nesta rodada. Pendentes: Administrator, mutações versus gates, conta somente financeira, revogação dinâmica, bloqueio temporal/MFA e falha técnica. Não declarar homologação integral.


## INT-01 — homologação HTTP Primary parcial aprovada

Após novo login autorizado (HTTP 200), o tester executou 27 GETs: todos retornaram os status esperados. Contexto global e contextos Autoscale/Power retornaram 200; a sessão foi preservada e as 27 áreas retornaram `allowed` para Primary. Os quatro gates organizacionais retornaram `allowed`. Organização inexistente retornou 404 `organization_not_found`; UUID malformado retornou 422 `invalid_organization_uid`. Oito consultas com limites/cursor inválidos, parâmetros repetidos ou desconhecidos retornaram 422. Três negativas sem Bearer retornaram 401. Todas as respostas desses GETs incluíram `Cache-Control: no-store`.

A busca `q=power` retornou três organizações correspondentes; busca sem correspondência retornou `items=[]`, `has_more=false`, `next_after_uid=null`. Paginação com limite 3 percorreu 22 organizações em oito páginas, ordenadas por UID, sem duplicatas e com término confirmado. Isso não prova completude independente do conjunto, escala superior a 100 organizações ou comportamento sob alteração concorrente de grants.

Evidência sem credenciais: [2026-10-21-int01-primary-http-active.json](evidence/2026-10-21-int01-primary-http-active.json). A rodada expirou anterior permanece histórica; estes positivos usam uma sessão nova. A regressão SQL com `ROLLBACK` foi informada pelo operador, não executada pelo tester. Nenhuma mutação de negócio foi feita; o login cria sessão e pode aplicar a política corrente de concorrência.

**Parecer: aprovação HTTP parcial para Primary e negativas sem autenticação.** Pendentes HTTP: Administrator, Secondary, Basic, cross-tenant com sessão válida, membership somente financeiro, outros caminhos de alteração de autorização, modo temporal block/warn, pending MFA, falha técnica e equivalência dos gates com mutações reais. O caso de scope removido por PUT completo foi testado separadamente. Não marcar INT-01 integralmente homologado. A busca também apresentou um nome preexistente com caracteres de substituição; origem e abrangência dessa anomalia de dados não investigadas nesta rodada.


## INT-01 — reteste após reinício: autenticação expirada

Operador confirmou migrations/regressão sem erro e `ROLLBACK`. Tester observou `/v1/users/status` 401 com `state=expired`; três endpoints INT-01 retornaram 401 `authentication required` e `Cache-Control: no-store`. Negativas sem token também retornaram 401/no-store. Positivos, paginação e validações de domínio ficaram bloqueados pela sessão expirada. Obter novo token e repetir, sem reaplicar migrations por causa desses 401. Ver [evidência HTTP](evidence/2026-10-21-int01-primary-http.json) e [controle da integração](frontend_integration_status.md). Nenhuma escrita HTTP ou SQL foi feita.


## INT-01 — homologação dos context endpoints

Implementação local: três GETs autenticados, sem mutações. Antes do teste HTTP, aplique a migration 0207 pelo wrapper abaixo e faça rebuild/restart da API. Não aplique a migration completa de bootstrap. Os testes Go não substituem a regressão SQL nem a homologação HTTP.

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/upgrade_frontend_access_context.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/frontend_access_context.sql
```

Com um bearer de sessão ativa (`Authorization: Bearer <token>`):

1. `GET /v1/users/me/access-context` deve retornar 200, `session.state` igual ao `/v1/users/status` para a mesma sessão e `area_access.status=evaluated` durante período permitido. Cada área recebe `allowed` ou `denied`; isso é só um gate de área. Durante modo temporal bloqueante, a consulta continua disponível para identidade ativa e retorna a mesma sessão, `area_access.status=not_evaluated`, `reason=outside_access_period` e áreas vazias. Pending MFA e sessão inválida não acessam o endpoint.
2. `GET /v1/users/me/organizations?limit=1&q=Power` retorna somente `uid`, `code`, `name`, `has_more` e `next_after_uid`. `q` pesquisa código/nome via catálogo central. Repita usando o UID retornado como `after_uid`; `limit` padrão é 50, máximo 100. Sem mais páginas, `next_after_uid` é `null`. Teste `limit=101`, `after_uid` malformado, `q` duplicado, parâmetros repetidos e parâmetro desconhecido; todos retornam 422 `invalid_organization_query`.
3. `GET /v1/users/me/organizations/{uid}/access-context` retorna os gates `organization.code_name_update`, `organization.reseller_enabled_update` e `session_policy.read/update` na forma documentada no manual frontend. UID inválido retorna 422 `invalid_organization_uid`; organização inexistente ou oculta retorna 404 `organization_not_found`; gates negados em organização selecionável continuam sendo uma resposta 200 com `denied`.

Os três GETs devem incluir `Cache-Control: no-store`. Para revogar scope pelo PUT completo de usuário, espere a sessão existente da conta-alvo ser invalidada: `/v1/users/status` com o Bearer anterior retorna 401 `state=revoked`; faça novo login e então repita consultas/páginas para observar os scopes atuais. O teste HTTP desse caminho foi aprovado em 21/10/2026. Para outros caminhos de alteração de grants, não presuma o mesmo efeito sem homologação. Não há garantia de snapshot consistente entre páginas concorrentes. A verificação HTTP anterior à implementação, que recebeu 404 para as rotas propostas, permanece evidência histórica. Matriz e exemplos completos: [frontend_integration_status.md](frontend_integration_status.md).

## Fase 3A.1 — elegibilidade financeira / 0203 HOMOLOGADA e FROZEN no escopo validado

**Migration:** o operador confirmou 0203 aplicada. Não reaplique 0203–0205.

**Regressão SQL:** `migrations/tests/commercial_foundation.sql` foi aprovada no PostgreSQL real e terminou em `ROLLBACK`.

**Go:** esta atualização documental não executou testes Go e o operador não forneceu novo resultado de `go test`/`go vet`/build. A evidência HTTP abaixo não substitui validação Go.

**Fixture:** `migrations/tests/setup_service_eligibility_http_0203.sql` foi executada e concluiu com `COMMIT`. Preparou a oferta para a organização descartável `7a7eb1f8-79de-498f-a20e-b7ae77adae3a`, sem alterar a associação financeira; a preparação e os UIDs estão em [service_eligibility_http_0203.md](service_eligibility_http_0203.md).

**HTTP confirmado pelo operador:**

- Commercial Order `d9831603-e4ee-41cd-9c74-b1821f9b6fa2` foi concluído com `geocode`; Agreement resultante `9ba680cb-c214-4dc7-a6a1-65a5118aaef5`; Billing Account `d380a098-092b-467b-a116-637085e5e6b0`.
- B203-15: ativação `active`, `replayed=false`, com `effective_at` distinto de `recorded_at`; elegibilidade `7708253f-7f89-44ed-b96f-a707937895f7`.
- B203-16: replay de ativação `replayed=true`, mesmo UID e referências preservadas.
- B203-17: encerramento `closed`, `replayed=false`, com `ended_at` e referências econômicas preenchidos.
- B203-18: replay de encerramento `replayed=true`, com os mesmos timestamps e referências.

O operador não informou códigos HTTP para estes cenários; não inferir nem acrescentar status. Fase 3A.1 está **HOMOLOGADA/FROZEN somente nesse escopo**. Permanecem fora da evidência: geração automática de Billing Entry/Statement; troca de Agreement durante elegibilidade por HTTP (há cobertura SQL); concorrência real em duas sessões; sincronização externa real do Geocode (provisioning esteve desabilitado). O ambiente atual é homologação e será reinicializado antes da produção.

Na inspeção anterior, a configuração local tinha `services.provisioning.enabled=true` e um target configurado. O operador confirmou que provisioning externo permaneceu desabilitado durante esta homologação; portanto não houve prova de sincronização real do Geocode. Nenhuma configuração foi modificada. A preparação SQL não enfileira provisioning; o aceite pode alterar desired state e enfileirar reconciliação quando o worker estiver ativo. O fluxo não cria notification, Billing Entry nem Statement. A regressão em sessão única não substitui ensaio concorrente real.
## Telemetry State Store — Fase 1 / 0193–0194 aplicadas (confirmação do operador)

**Não execute PostgreSQL/Valkey pelo agente.** O operador confirmou 0193 e 0194 aplicadas. A falha histórica `max(uuid)` motivou a correção 0194; não reaplique essas migrations. A regressão corrigida deve ser considerada aprovada somente quando houver evidência explícita da execução após 0194. O bloco `telemetry_state_sync` permanece configurável separadamente; consulte o estado atual dos dois arquivos de configuração sem expor segredos.

Validação local desta entrega e do hardening de retry:

```bash
gofmt -w internal/config/config.go internal/config/validate.go internal/telemetrystate/*.go cmd/telemetry-state-sync/main.go
go test -count=1 ./internal/telemetrystate ./internal/config ./internal/platform ./cmd/telemetry-state-sync
```

Além dos testes de retry/recovery, a suíte focada cobre health idle com `last_apply_at` antigo, thresholds de backlog/progresso, heartbeat de loop parado, canary write/read e schema sentinel, amostra limitada sem SCAN, versões match/missing/stale/ahead/invalid, lease expirada persistente, poison, eviction, transições de recovery, snapshot-only do endpoint e ausência de segredos/cardinalidade nos logs/métricas. `TestValkeyHealthCanaryVerifiesWriteReadAndParsesSafeInfo` valida também o parser sanitizado do INFO. A validação final desta entrega está registrada abaixo; ela não equivale à regressão SQL nem à homologação com serviços reais. Nesta entrega não foi executada a bateria inteira `go test ./...`; o resultado anterior continua sendo que `internal/filters/TestListQueriesAgainstPostgres` falha no bootstrap PGlite em `billing_0192_required`, após aplicar somente migrations até 0036. Isso não valida nem executa a migration 0193. Nenhum PostgreSQL operacional ou Valkey real foi acessado.

Contrato operacional: `GET /live` responde `200 {"status":"up"}` sem probes e serve apenas para liveness; `GET /health` serializa snapshot operacional e pode retornar 503 em recovery/degradação/down; `GET /metrics` expõe métricas agregadas. O collector verifica PostgreSQL e capacidade de claim, Valkey PING + canary SET/GET, INFO sanitizado e um sample periódico do verifier. Fila vazia com loop/dependências saudáveis fica `up` mesmo com último apply antigo. O verifier é limitado por cursor e `projection_verify_sample_size`; diferenças explicadas por jobs queued/running/retrying são `pending`. Mismatches sem job recebem recheck dirigido, e drift confirmado desaparece automaticamente quando o asset volta a coincidir ou tem trabalho pendente. Não há self-heal automático. Leases expiradas degradam após duas coletas sucessivas.

O hardening local também cobre canary por `instance_id` UUID com TTL, INFO negado por ACL sem derrubar Valkey quando PING/SET/GET passam, e `-rebuild` preservando o schema sentinel e canaries de outras instâncias. Health/métricas não expõem UID de asset e mostram contagem agregada de drift confirmado; WARN operacional de drift confirmado contém UID e versões, rate-limited, sem payload ou placa.

```bash
go vet ./...
go build -buildvcs=false ./...
go build -buildvcs=false ./cmd/telemetry-state-sync
go build -buildvcs=false ./cmd/navisoft
go run ./cmd/navisoft -config config.json -check-config
go run ./cmd/navisoft -config config.example.json -check-config
go run ./cmd/telemetry-state-sync -config config.json -check-config
go run ./cmd/telemetry-state-sync -config config.example.json -check-config
```

Validação local do resolver 0213 e limites desta entrega: veja a seção Protocol identity resolver no início deste guia. Os resultados Go desta implementação não comprovam instalação SQL, conectividade Valkey ou homologação HTTP.

Depois da validação local, o operador pode aplicar e regredir, cada etapa em comando próprio:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/upgrade_telemetry_state.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/telemetry_state.sql
```

A regressão requer um asset existente não deletado e termina em `ROLLBACK`. Após aplicação, conceda membership da role interna ao login dedicado configurado: `GRANT navisoft_telemetry_state_worker TO <login_dedicado_configurado>;`. Prepare `postgres_telemetry_state_worker` e `redis_telemetry_state` em config local conforme [telemetry_state.md](telemetry_state.md), valide configuração e só então rode:

```bash
go run ./cmd/telemetry-state-sync -config config.json
```

Para rebuild completo (rodar em uma instância sem outra execução simultânea de rebuild):

```bash
go run ./cmd/telemetry-state-sync -config config.json -rebuild
```

Ainda pendem: aplicação/regressão real da migration, role membership operacional, configuração de dependências dedicada e homologação do worker/health/rebuild contra PostgreSQL e Valkey. Isso não comprova posições, ClickHouse, Rabbit, tags, scopes ou Event Engine.

## Services Foundation Fase 1 — administração HTTP homologada; 0187 preparada

Estado confirmado pelo operador: 0186 aplicada, regressão SQL aprovada com `ROLLBACK` e administração HTTP homologada. O incidente teve 200 cross-tenant histórico, mas sua causa raiz não foi reproduzida/comprovada. A função SQL instalada chama `services.require_organization_admin()`; a execução direta como `navisoft_auth` com o Secondary real e Autoscale como target foi negada com `services_not_allowed`. Não foi identificado SELECT direto, reader, cache, fallback ou rota concorrente. O preflight Go de visibilidade organizacional foi homologado como defesa em profundidade, não como causa raiz.

Evidências HTTP confirmadas: Secondary→Autoscale/services 403; Primary→Autoscale/services 200; Primary→organização inexistente 404; Secondary→própria organização sem vínculos 200 `items: []`; cross-tenant POST/PATCH/DELETE de tokens 403; negativas mantiveram desired version em 8; Primary→organização existente sem tokens 200 `items: []`.

O example documenta `services.provisioning.enabled=false` e sem targets. Na leitura desta preparação, o `config.json` local estava habilitado e tinha um target; trate os dois arquivos como configurações independentes e preserve os valores operacionais existentes. Para o aceite da fixture 0203, desligue o worker na instância de teste ou confirme que o target é isolado, conforme [service_eligibility_http_0203.md](service_eligibility_http_0203.md). Nenhum serviço foi chamado durante esta tarefa.

A regressão SQL não depende de duas organizações de homologação previamente cadastradas. Dentro da própria transação, ela provisiona duas organizações descartáveis pelo fluxo `organizations.provision()`, cria um administrador temporário com scope somente para a segunda organização para provar isolamento, e termina com `SET CONSTRAINTS ALL IMMEDIATE` + `ROLLBACK`. Requer a fixture Primary `b0000000-0000-4000-8000-000000000001` e um plano de billing disponível; nenhum cadastro de teste persiste.

0187 está preparada, não aplicada. Ela adiciona um estado terminal `failed` para resposta stale, com atualização protegida pelo UID, versão e claim corrente. A regressão foi estendida para falha stale terminal, ausência de reclaim e reabertura somente quando uma nova versão é desejada. Aplique e execute pelo wrapper (que verifica 0186 e aplica 0187 se faltar), depois rode a regressão:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_services.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/services_foundation.sql
```

O protocolo Core→target é descrito em [services.md](services.md). A resposta stale esperada é HTTP 409 `{"error_code":"stale_version","last_applied_version":N}`; o Core marca falha terminal somente para a geração ainda atual. Para a aplicação normal, o target confirma 2xx com `{"applied_version": <version>}`. 401/403 são repetidos no máximo uma vez por hora; 429/5xx/rede/timeout seguem retry exponencial. Nenhum segredo ou body bruto é registrado.

Validação local da implementação do worker: `gofmt`, `go test -count=1 ./internal/servicesync ./internal/config ./internal/app`, `go vet ./...`, `go build ./...` e `-check-config` nos dois arquivos passaram. `go test ./...` falhou no teste PGlite existente `internal/filters/TestListQueriesAgainstPostgres`, que consulta `users.users` sem privilégio e termina em `permission denied for table users`; os outros pacotes passaram. Nenhum PostgreSQL operacional ou target real foi acessado. A regressão SQL Services permanece pendente após aplicar 0187.

Matriz HTTP a executar uma chamada por vez com Bearer Primary para catálogo e vínculo, e administrador autorizado da organização para seus serviços/tokens:

| Caso | Método e URL | Body/headers | Evidência |
|---|---|---|---|
| Catálogo | `GET /v1/admin/services` | Bearer Primary | Homologado; catálogo retorna services sem expor targets. |
| Ativar/alterar serviço | `PUT /v1/admin/organizations/{org}/services/geocode` | `{"desired_status":"active"}` | Contrato administrativo homologado. |
| Organização inexistente | Mesmo PUT com UUID válido inexistente | Mesmo body | HTTP 404 `organization_not_found` homologado. |
| Repetir estado | Mesmo PUT | Mesmo body | No-op/versionamento documentado; regressão SQL cobre replay sem incremento. |
| Listar vínculos cross-tenant | `GET /v1/admin/organizations/a0000000-0000-4000-8000-000000000001/services` | Bearer Secondary | 403 homologado após preflight; 200 histórico original permanece sem causa raiz comprovada. |
| Listar vínculo próprio sem bindings | `GET /v1/admin/organizations/{org-secondary}/services` | Bearer Secondary | 200 `items: []` homologado. |
| Primary em Autoscale | `GET /v1/admin/organizations/a0000000-0000-4000-8000-000000000001/services` | Bearer Primary | 200 homologado. |
| Primary em organização inexistente | Mesmo GET com UUID válido inexistente | Bearer Primary | 404 `organization_not_found` homologado. |
| Tokens cross-tenant | POST/PATCH/DELETE em token de Autoscale | Bearer Secondary | 403; desired version permaneceu 8, homologado. |
| Lista de tokens vazia | `GET /v1/admin/organizations/{org}/services/geocode/tokens` | Bearer autorizado | Primary em organização existente sem tokens: 200 `items: []`, homologado. |

| Repetir estado | `PUT .../services/geocode` com estado já atual | Bearer autorizado; body igual | No-op sem incremento de versão, comprovado pela regressão SQL; reteste HTTP não listado como evidência. |
| Isolamento | GET/PUT e POST/PATCH/DELETE de tokens com organização de outro tenant | Bearer sem autorização | Negado; operações cross-tenant de tokens retornaram 403 e a versão permaneceu 8. |

O contrato HTTP administrativo está homologado. O 200 cross-tenant histórico foi confirmado, mas sua causa raiz não foi reproduzida nem comprovada. A função SQL e o call path conhecidos negam o Secondary; nenhuma causa alternativa foi demonstrada. O preflight Go homologado é defesa em profundidade e não deve ser descrito como causa raiz.

Limitação da migration aplicada: `services.service_tokens_list`, `service_token_create`, `service_token_revoke` e `service_token_rate_limit_set` não distinguem código global desconhecido de serviço válido não ativado ou token ausente. A listagem pode retornar `items: []`; create mantém `organization_service_not_active`; revoke/rate mantém `service_token_not_found`. Fechar a distinção para `service_not_found` exige função SQL estreita futura, sem leitura direta do catálogo.

O protocolo de provisioning descrito em [services.md](services.md) e o estado da migration corretiva 0187 ainda não foram homologados em PostgreSQL/target real. Antes de habilitar o worker, aplicar `migrations/upgrade_services.sql` e executar `migrations/tests/services_foundation.sql`. Nenhum target foi chamado nesta entrega.

O worker/provisioning ainda não foi homologado contra targets reais. Depois de implementar o receiver Geocode e aplicar 0187, testar: snapshot active/suspended/disabled e tokens; dois targets independentes; 401/403 com retry lento; 429/5xx/timeout com retry; stale antigo terminal sem alterar geração nova; receiver idempotente para mesma chave; cancelamento no shutdown. Não use target real até o operador revisar o mapeamento privado e as credenciais M2M.

## Report Core Fase 1 — 0180–0183 aplicadas; regressão e homologação operacional concluídas

Estado confirmado pelo operador em 2026-10-13: 0180, 0181, 0182 e 0183 aplicadas. `migrations/upgrade_reports.sql` aplica 0181→0182→0183 condicionalmente e na ordem correta. `migrations/tests/report_core.sql` executou com sucesso e terminou em `ROLLBACK`. `cmd/navisoft -check-config` e `cmd/report-worker -check-config` passaram com `reports_enabled=true`. O PostgreSQL dedicado do worker está provisionado (writer membro de `navisoft_report_worker`; reader membro de `navisoft_reader`), o repository privado é gravável e a route Rabbit `kind=report` / `navisoft.reports.requested.v1` está habilitada.

Homologação operacional confirmada: `POST /v1/reports` → 201 `pending`; replay retorna a mesma request com `replayed=true`; conflito de idempotência → 409 `idempotency_conflict`; GET e search isolado por requester passaram. O percurso outbox→relay→RabbitMQ→report-worker→`messaging.receipt` passou; `submitted_at` e `acknowledged_at` foram preenchidos, `attempts=1` e `last_error_code` ficou nulo. Geração CSV passou. Download privado autenticado passou; sem autenticação retorna 401; requester diferente e organização incorreta retornam 404 `report_not_found`. Report público e capability pública sem autenticação passaram; capability inválida retorna 404. `q=COPA` exportou apenas o asset correspondente. Não existe `artifact_asset_manifest`; `reports.artifacts` guarda metadata constante por report. `report_code` desconhecido falha fechado; coluna fora da allowlist → 422 `invalid_report_columns`; formato não suportado, visibility inválida e limit/offset/state inválidos para export são rejeitados. TTL 604800 foi aceito e 604801 retorna `invalid_report_ttl`.

Escopo e limites preservados: somente `assets.list` v1, CSV e `private/public`; sem schedules, Notifications de conclusão, XLSX/PDF, cleanup worker ou Redis como autoridade. PostgreSQL é a autoridade de `expires_at`. Filtros são aplicados diretamente na query da fonte, não em Go; worker usa claim/lease e `Resources.Read()`. O public token ainda é recuperável em texto no banco (hardening futuro); pode restar objeto órfão se storage `Put` concluir e uma etapa posterior falhar. Não há manifest por asset. Consulte [reports.md](reports.md) para o contrato e limites.

Validação local direcionada:

```bash
go test -count=1 ./internal/reportcore ./internal/server ./internal/config ./internal/platform ./cmd/report-worker
go vet ./...
go build -buildvcs=false ./...
go run ./cmd/navisoft -config config.json -check-config
go run ./cmd/navisoft -config config.example.json -check-config
go run ./cmd/report-worker -config config.json -check-config
```

`go test ./internal/filters` percorre também uma integração PGlite histórica; uma execução anterior falhou antes dos testes novos em `permission denied for table users`. Não atribuir essa falha a Report Core. Essa observação descreve apenas aquelas execuções locais, não a regressão PostgreSQL real aprovada acima.

O teste isolado de paginação `go test -count=1 ./internal/filters -run '^TestListQueryPaginationIsStableAndReusable$'` passou. `go vet ./...`, `go build -buildvcs=false ./...`, os três `-check-config` listados acima e `node migrations/tests/documentation-audit.mjs` também passaram.

> Creates de cadastro e upload (0057): `Idempotency-Key` obrigatório. Cada intenção usa UUID próprio; retry conserva a chave e o corpo. Buscas/GET/PUT/PATCH/DELETE não exigem essa chave. [Contrato completo](Idempotency-Key.md).

## Fase B — contratos HTTP e requests lentas (implementado; homologação direcionada pendente)

Validação local desta entrega: `go test -count=1 ./internal/config ./internal/server ./internal/organizations` passou; `go test -count=1 ./internal/filters -run '^TestListQueryPaginationIsStableAndReusable$'` passou. A suíte integral de `internal/filters` foi tentada e falhou em `TestListQueriesAgainstPostgres` no runner PGlite, após migrations 0034–0036, com `permission denied for table users`; não é uma falha dos testes desta alteração e não foi corrigida incidentalmente. `go vet ./internal/config ./internal/server ./internal/organizations ./internal/filters`, `go build -buildvcs=false ./...` e `-check-config` em `config.json` e `config.example.json` passaram. A regressão PostgreSQL `migrations/tests/users_crud.sql` foi atualizada, mas não executada; nenhum banco ou migration operacional foi acessado. Não contar estes testes locais como homologação HTTP.

Depois de recompilar/reiniciar a API, execute os casos abaixo um por vez:

1. `POST /v1/admin/users` com login que viole o formato, sem duplicar outro identificador: esperado `422 {"message":"invalid_login_name"}` e nenhum usuário/identifier parcial. Login já existente continua `409 user_conflict`. Em seguida teste email e mobile malformados: `422 invalid_email` e `422 invalid_mobile`.
2. `PUT /v1/admin/organizations/{uid}` trocando para plano inexistente/inativo: esperado `422 {"message":"billing_plan_unavailable"}`. Confirme que qualquer outro campo enviado no mesmo PUT foi revertido. Esse contrato já tem cobertura Go; repetir HTTP após o binário novo.
3. Nos endpoints administrativos Notifications, provoque somente erros funcionais conhecidos em fixture descartável e confirme os códigos de domínio. Respostas SQL 404 desconhecidas devem ser `notification_resource_not_found`; validações SQL não mapeadas, `invalid_notification_request`. Confirme que nenhum SQLSTATE/texto PostgreSQL livre aparece no body.
4. Envie uma cor/estrutura de branding inválida conhecida e confirme os códigos documentados. Se a validação retornar mensagem SQL desconhecida, esperado `422 invalid_branding_theme`, sem texto interno no body.
5. Com a rota técnica de reload de filtros e uma cópia de settings inválida, confirme `422` no envelope existente `error/active/server_name`, sem `detail`; `active` deve permanecer true se havia snapshot válido. Verifique log correlacionado sem caminho local nem conteúdo do arquivo.
6. Para slow request, configure temporariamente `http.slow_requests.threshold` baixo em cópia de homologação e valide um GET JSON. Headers/body de timing mantêm o contrato atual; linha de conclusão e evento `access` devem marcar `slow_request=true`, `slow_threshold_ms` e usar a route template. Confira que query, UID, body e credenciais não aparecem. Restaure a configuração operacional depois.
7. Refaça com threshold acima da duração: não deve haver campos slow. Uma rota SSE e um download/arquivo lentos devem continuar excluídos. Um 204 lento pode aparecer como slow em log/evento, mas segue bodyless e sem alterar os headers de timing.

# Roteiro mestre de testes do Navisoft

## Checklist — Fases 1 e 2 homologadas e congeladas

O operador confirmou 0167–0170 aplicadas, `migrations/tests/checklists_execution.sql` aprovada com `ROLLBACK` e a homologação HTTP das duas fases. Não repetir nem reabrir a bateria. A interface Checklist permanece congelada; a integração 1.5 é uma chamada transacional interna e não muda suas rotas/payloads. Migration aplicada, regressão SQL, Go e HTTP continuam evidências distintas.

## Maintenance e Checklist → Maintenance homologados e congelados (0171–0172)

O operador confirmou 0171/0172 aplicadas; `maintenance_core.sql` e `checklist_maintenance_integration.sql` aprovadas com `ROLLBACK`; Maintenance HTTP core e a integração principal Checklist 1.5 homologadas. As fases Checklist 1/2, Maintenance 1 e integração 1.5 estão congeladas. Não repetir as baterias.

A confirmação HTTP da integração inclui run asset bloqueado, resultados `driver_result=fit`/`asset_result=not_fit`, exatamente uma OS `checklist`, condição blocking/open, origem de execution/pergunta preservada e `operational_available=false`. A regressão 0172 também cobre as outras branches, idempotência, integridade e atomicidade; manter migration, regressão SQL, Go local e HTTP como evidências separadas.

## Agenda Operacional — Fases 1 e 2 homologadas/congeladas (0173–0176)

Fase 1: o operador confirmou 0173–0175 aplicadas, `migrations/tests/agenda_core.sql` aprovada com `ROLLBACK` e HTTP homologado para search/backfill, GET, PATCH controls, conflito stale, settings/herança, atualização source Maintenance e isolamento por source. Está congelada; não repetir.

Fase 2: 0176 aplicada em PostgreSQL real; `migrations/tests/agenda_analyses.sql` executada com `ON_ERROR_STOP=1`, aprovada e terminada em `ROLLBACK`; API recompilada/reiniciada; HTTP homologado manualmente. Está congelada; não reabrir nem repetir.

Evidências HTTP Fase 2: timeline paginada e ordenada por `created_at DESC`; projection inicial `source_change` system; PATCH efetivo de vários controles gera uma `agenda_change` única e omite campos iguais; PATCH totalmente no-op mantém `controls_version`, `updated_at` e total de analyses; versão stale é 409 `agenda_version_conflict` mesmo quando o valor enviado já é o atual. Analysis manual, replay idempotente (`replayed=true` e mesmo UID), conflito da mesma chave com body diferente (`idempotency_conflict`), `next_contact_at` null→data, reagendamento e limpeza foram homologados. Maintenance `open→in_progress→completed` gerou `source_change`, incluindo `terminal false→true`, sem alterar controles; histórico continuou disponível após terminal. Paginação/offset e rejeição de `limit` acima do máximo foram verificados. Documento GED foi fixado por UID + revisão; a resposta continha somente referências e `accessible`, sem metadata de storage; replay não duplicou analysis/vínculo e documento não incrementou `controls_version`.

Não repetir migrations, regressão SQL ou a bateria HTTP da Agenda, pois ambas as fases estão congeladas. Manter as evidências de PostgreSQL, testes Go locais e HTTP separadas em qualquer relatório posterior.

As rotas, migrations, regressão SQL e HTTP das Fases 1 e 2 estão homologadas e congeladas. Os comandos e passos incrementais antigos foram removidos deste roteiro para evitar reabrir ou repetir a homologação. O contrato e as evidências completas estão em [agenda.md](agenda.md).

## Provisionamento HTTP de Organizations — reteste direcionado pendente

O operador confirmou anteriormente `migrations/tests/provisioning_after_auth_recovery.sql` com `primary_provisioning_probe_passed` e `ROLLBACK`, mas a constraint diferida não era forçada. A regressão foi corrigida e executada em PostgreSQL real com a definição 0178 aplicada somente dentro da transação do teste: owner Primary preservado, grant organization-wide presente antes da constraint, replay sem grant duplicado e `SET CONSTRAINTS ALL IMMEDIATE` passaram; o teste terminou em `ROLLBACK`. Logo, a migration 0178 continua preparada e não aplicada persistentemente. Para a 0200, as tentativas iniciais locais de `resellers.sql` expuseram dependências de fixture/role e foram corrigidas; a evidência atual substitui o estado antigo: o operador confirmou 0200 aplicada em 20/10/2026 às 10:59:48 -03 e a regressão `migrations/tests/resellers.sql` aprovada com `ROLLBACK`. A homologação HTTP R01–R11 também foi concluída conforme a seção de encerramento da Fase 6 e [resellers.md](resellers.md). Não houve teste concorrente HTTP. Não reaplique 0200 nem trate a análise/implementação anterior como evidência da homologação. Com Notifications Core desativado, `POST /v1/admin/organizations` retornou 422 `invalid_provisioning_data`; não atribuir ao hook Notifications. O handler mantém 422 e registra diagnóstico sanitizado correlacionado por `request_id`. O reteste HTTP desse fluxo de provisionamento continua pendente.

Na regressão de revenda, as imagens de logo são criadas com `common.register_stored_image()` como públicas e com metadados fictícios de storage; `register_linked_image()` cria imagem privada sem esses metadados e falha corretamente na validação de `link_image()` introduzida na 0101. O teste de revogação lê o logo do cliente da própria revenda revogada e confirma que o logo do cliente de outra revenda continua oculto.

```http
POST /v1/admin/organizations
Authorization: Bearer <Primary>
Content-Type: application/json
Idempotency-Key: <UUID novo>
```

```json
{
  "code": "notify-core-off-0177",
  "name": "Notify Core OFF 0177",
  "email": "admin@notify-core-off-0177.example",
  "admin_name": "Administrador",
  "uid_billing_plan": "c0320000-0000-4000-8000-000000000001"
}
```

Go local confirma uma chamada à assinatura de 13 argumentos e os valores normalizados, incluindo `admin_login` default `<code>.admin`; PostgreSQL ajusta o login efetivo de Primary para `admin.<code>`. Teste local não é evidência de sucesso HTTP. Depois de identificar o erro PostgreSQL real, repetir uma vez com `code`, email e Idempotency-Key novos; sucesso esperado é 201 e replay da mesma intenção é 200.
## Infraestrutura, eventstream e rate limit distribuído

O writer `postgres` permanece autoritativo. Pools read-only nomeados são opcionais e configuram-se em `postgres.readers`; `postgres.read_balance` aceita `round_robin`, `healthy_round_robin`, `weighted_round_robin`, `least_acquired` ou `power_of_two`. Nenhum endpoint/repository de domínio foi migrado para eles. `Write()` e `ReadCritical()` nunca selecionam reader. `Read()` escolhe uma vez e volta ao writer quando não há reader disponível; query errors não são refeitos em outro pool.

Verificação local desta evolução: `go test -count=1 ./internal/platform ./internal/config ./internal/server ./cmd/postgres-read-test`, `go vet ./...`, `go build -buildvcs=false ./...` e `-check-config` para `config.json` e `config.example.json` passaram. Os testes cobrem selectors, thresholds de falha/recuperação, health snapshot, fallback, métricas, concorrência e o monitor; a regressão de preflight inicia três readers unhealthy, observa fallback, espera o monitor promovê-los e então verifica seleção nos três. `go test -race -count=1 ./internal/platform` foi tentado no Windows, mas o `cgo.exe` terminou com exit status 2 antes de compilar os testes; race detector permanece sem resultado. Nenhum PostgreSQL foi acessado.

Para conferir readers após provisionar uma réplica de homologação e publicar/reiniciar a API, um teste por vez:

1. Antes de habilitar tráfego em readers, configurar itens nomeados em `postgres.readers` com credenciais read-only/RLS apropriadas e testar só a infraestrutura: `go run ./cmd/postgres-read-test -config config.json -requests 10000 -concurrency 100 -wait-healthy 15s -wait-readers all`. O comando inicia o monitor real, espera todos os readers elegíveis ficarem healthy até o timeout e então inicia as requests; se expirar, informa no stderr/JSON e continua com fallback normal. `-wait-readers any` (default) aguarda ao menos um. Esperar `strategy` igual à configuração, fallback zero quando os readers esperados estiverem healthy, contadores por reader e distribuição compatível com a strategy. O JSON inclui `configured_readers`, `healthy_readers_at_start`, `health_wait_ms`, `preflight_satisfied` e `preflight_timed_out`. O comando só faz `SELECT 1`; não comprova consistência de queries de negócio.
2. Observar `GET /v1/health/details`: `postgres_read.pool.readers[]` deve listar nome, peso, healthy, latência e pool stats; reader indisponível continua opcional e não muda `/v1/health/ready`. Após duas falhas consecutivas o manager retira o reader das strategies health-aware; após duas sondagens bem-sucedidas ele volta. `round_robin` ignora estado de saúde de propósito.
3. De uma origem permitida em `metrics.allowed_cidrs`, consultar `GET /metrics` e conferir `navisoft_postgres_reader_up`, `navisoft_postgres_reader_selected_total`, `navisoft_postgres_reader_errors_total`, `navisoft_postgres_reader_fallback_total`, `navisoft_postgres_pool_connections` e `navisoft_postgres_reader_health_transitions_total`. O histograma `navisoft_postgres_reader_query_duration_seconds` usa tracer associado ao pool e labels somente pelo nome configurado. Não há metric de replica lag nesta entrega.

4. `GET /v1/health/details`: conferir dependências, eventstream e readers. Sem readers, `postgres_read.enabled=false` e seleção volta ao writer. O estado físico do broker fica em `dependencies.redpanda`; `eventstream` contém o estado lógico e métricas, sem `redpanda` top-level. Com Redpanda desabilitado, ambos mostram `disabled`; limiter desabilitado deve estar `disabled`.
5. Fazer um GET JSON ordinário: conferir `X-Elapsed-Ms`, `Server-Timing` e `elapsed_ms` no objeto root.
6. Fazer `GET /v1/health` e conferir que a resposta JSON também inclui o campo.
7. Com origem fora de `metrics.allowed_cidrs`, `GET /metrics` retorna 403 `metrics_access_denied`; com `metrics.enabled=false`, retorna 404. De uma origem permitida, conferir métricas HTTP de rota template sem UID real.
8. Conferir SSE/download/imagem e `204`: sem `elapsed_ms` ou headers de timing; payload original preservado.
9. Em ambiente isolado, habilitar Redpanda com endpoint inválido: `dependencies.redpanda.status=down`, `eventstream.status=down`, contadores agregados disponíveis, health geral `degraded` e `/v1/health/ready` continua 200/up. Não deve existir `redpanda` top-level; não devem aparecer brokers, SASL/TLS values, chaves ou IDs no payload.
10. Quando o processo separado `cmd/audit-relay` estiver habilitado, consultar `GET /health` e `GET /metrics` no bind local configurado em `audit_relay.health_address`; conferir `published_total`, `errors_total` e backlog real. O health agregado da API não publica estado presumido do relay. Em falhas de claim, confira no WARN o `error_code`, o erro sanitizado e o `sqlstate` quando originado pelo PostgreSQL; o JSON deve conter apenas uma chave `component` e nunca dados do payload.

Validação Go local: testes focados em eventstream e server passaram após incluir drenagem da fila no shutdown e preservar os limites locais existentes de login/security flows quando o rate limit distribuído está desabilitado. A suíte de infraestrutura também cobre fila/batching/redaction, fanout do logger, rate limit/falha Redis, route-policy, JSON Lines e que o offset não avança antes de VictoriaLogs aceitar. Ainda não há homologação com Redis rate limit, Redpanda ou VictoriaLogs reais.

O eventstream mantém o mesmo worker após falha temporária do broker: o batch fica pendente, `queue_depth` inclui o batch e a fila, `retry_attempts` limita as tentativas imediatas de cada ciclo e o worker tenta novamente com `retry_backoff`. A regressão local `TestBrokerRecoveryDrainsPendingEventsWithoutRestart` prova backlog preservado, recuperação sem recriar o stream, múltiplas transições down/up, `published_total` crescente e nenhum drop transitório; `TestPublishFailureLogIncludesSanitizedOriginalError` verifica que o WARN preserva detalhe útil do franz-go sem credenciais. Em homologação, com a API em execução, confirme `dependencies.redpanda.status=down`, publique eventos e observe `eventstream.queue_depth>0`/`dropped_total` estável; restaure broker/tópicos sem reiniciar a API e aguarde `dependencies.redpanda.status=up`, `eventstream.status=up`, `queue_depth=0` e `published_total` crescente.

Verificação ampla adicional: `go test -count=1 ./...` executou os demais pacotes, mas falhou em `internal/filters/TestListQueriesAgainstPostgres` durante a regressão cumulativa PGlite com `permission denied for schema access`, após aplicar as migrations 0034–0036. Os pacotes eventstream, auditrelay, logdrainer, ratelimit, config, platform e server passaram; a falha não é evidência contra essas alterações.

0165/0166 e a regressão SQL devem ser tratados separadamente. O operador já executou a regressão 0165 em PostgreSQL real, mas ela falhou nas asserções INSERT/DELETE; os testes foram corrigidos para distinguir SQL NULL de JSON `null`. A aplicação/registro da 0165 não foi confirmado nesta conversa: primeiro confira `common.schema_migrations`. Não reaplique uma versão já aplicada. A 0166 está preparada, não aplicada. Depois de confirmar 0165 aplicada, execute:

```bash
sudo -u postgres psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/0166_audit_relay_backlog.up.sql
sudo -u postgres psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/eventstream_audit_outbox.sql
```

Use superuser (`postgres` nestes comandos): a 0166 cria função de backlog para o papel restrito do relay. A regressão deve terminar em `ROLLBACK`. Ela verifica `operation_id`, snapshots/redaction, inserção transacional na outbox, claim/ack, backlog e acesso restrito ao health helper. Não execute a regressão antes de confirmar 0165 e aplicar 0166.

Homologação operacional, um passo por vez:

1. Conferir `-check-config` em `config.json` e `config.example.json`; manter `metrics.enabled` restrito a CIDRs internos.
2. Com Redpanda e Redis provisionados, habilitar `redpanda` e `redis_rate_limit`/`rate_limit` no ambiente de homologação. Confirmar `/metrics` mostra queue depth/dropped e métricas de rate limit sem labels de identidade.
3. Fazer login válido e uma rota GET: conferir evento `navisoft.access.v1` com route template, host/server, request_id/operation_id e IP resolvido, sem query string.
4. Fazer uma operação administrativa não sensível: conferir o logger local continua recebendo a mensagem e o eventstream publica em `navisoft.application.v1`.
5. Fazer uma negativa controlada de login/permissão: conferir `navisoft.security.v1`, código sanitizado e ausência de senha, Bearer, OTP, email/body secreto.
6. Para auditoria, depois de 0165, efetuar uma alteração descartável e verificar `audit.events` e `audit.eventstream_outbox` na mesma transação. Rodar `go run ./cmd/audit-relay -config config.json`; conferir ACK após publish e at-least-once por `event_uid`.

### Log-drainer → VictoriaLogs: stream labels

O operador já homologou o pipeline real API → Redpanda → `cmd/log-drainer` → VictoriaLogs: consumer group `Stable`, `TOTAL-LAG=0` e ingestão sem erros. Essa evidência antecede a classificação nova de streams e não confirma ainda os labels abaixo. Após recompilar o drainer, com API/Redpanda/VictoriaLogs saudáveis, rode `go run ./cmd/log-drainer -config config.json` e gere um evento de cada tópico. Confirme no VictoriaLogs os streams `{service="navisoft",stream="access",server_name="navisoft-local"}`, `{service="navisoft",stream="application",server_name="navisoft-local"}`, `{service="navisoft",stream="security",server_name="navisoft-local"}` e `{service="navisoft",stream="audit",server_name="navisoft-local"}`. `server_name` preserva o da origem e usa o configurado no drainer somente se o evento não o trouxer. Pesquise um evento por `request_id` como campo normal, sem criar stream por ID. Verifique `_time` em UTC: `timestamp` válido tem prioridade; se faltar/for inválido em audit, `created_at` válido é o fallback; se ambos forem inválidos/ausentes, usa-se o instante de ingestão. Os campos originais permanecem no JSON. Verifique também que `_msg` e stream fields continuam iguais; payload/segredos não devem aparecer. Confirme o group lag retorna a zero após ingestão. O drainer continua at-least-once: VictoriaLogs aceita primeiro e o offset Kafka é confirmado depois; falha pode gerar duplicata, mas não deve avançar offset sem aceite.

Para poison records, provisionar `navisoft.logs.dlq.v1` com permissão de escrita do principal Redpanda usado pelo log-drainer antes de iniciar a versão nova. O processo expõe `GET http://127.0.0.1:8083/metrics` (ou o endereço configurado) com `navisoft_log_drainer_poison_total`, `navisoft_log_drainer_dlq_total` e `navisoft_log_drainer_dlq_errors_total`. Em ambiente isolado, produzir na origem um evento válido, um JSON inválido contendo um marcador secreto de teste e outro evento válido. Esperado: os dois válidos chegam ao VictoriaLogs, a DLQ recebe somente `source_topic`, `source_partition`, `source_offset`, `error_code`, causa categorizada e `failed_at`, sem o payload; o offset avança depois dos aceites, as métricas aumentam e o consumer continua processando. Depois indisponibilizar VictoriaLogs: offsets não avançam e não há classificação/DLQ de mensagens válidas; restaurá-lo deve permitir retry. Se a escrita DLQ falhar, nenhum offset do lote é confirmado.

Validação local do poison handling aprovada: `go test -count=1 ./internal/logdrainer ./internal/eventstream ./cmd/log-drainer`, `go vet ./...`, `go build -buildvcs=false ./...` e `-check-config` para `config.json` e `config.example.json` passaram. Isso não substitui a homologação real da DLQ/ACL e do endpoint `/metrics`.
7. Rodar `go run ./cmd/log-drainer -config config.json`; conferir JSON Lines em VictoriaLogs e que offsets Kafka só avançam após aceite. Desligar VictoriaLogs temporariamente para comprovar backlog/retry antes de retomar.
8. Habilitar uma policy temporariamente baixa e testar requests dentro e acima do limite: verificar HTTP 429, `Retry-After`, isolamento entre dois usuários e teto da organização/global. Indisponibilidade Redis: `closed` deve responder 503; `local` aplica fallback local limitado.

Os passos 2–8 são pendentes de execução pelo operador; esta entrega não chamou brokers/providers nem executou SQL. As migrations 0162–0164 e o Session Core ficaram fora do escopo.

## Platform Billing PB — 0145–0151 e 0160 aplicadas; regressão SQL e HTTP confirmados

**Estado confirmado pelo operador:** migrations 0145–0151 e 0160 aplicadas. `migrations/tests/platform_billing.sql` foi executada com `ON_ERROR_STOP=1`, sem erro, terminando em `ROLLBACK`. As correções Go de PATCH e `Cache-Control` foram recompiladas/reiniciadas antes da homologação HTTP. Os fluxos descritos abaixo estão homologados conforme suas evidências; não execute migrations ou regressões como se estivessem pendentes.

PATCH `PUT /v1/admin/organizations/{uid}` homologado: plano inexistente → 422 `billing_plan_unavailable`; valuation currency válida antes de evento econômico → 200; currency inexistente → 422 `invalid_valuation_currency`; após evento econômico → 409 `valuation_currency_locked`. O lock foi gerado por `billing_rating_run()` real de zero centavos em fixture descartável e `first_economic_source=platform_billing_rating`.

Atomicidade confirmada por HTTP: campo cadastral + moeda travada reverte integralmente; plano válido + moeda travada reverte integralmente; moeda válida + plano inexistente reverte integralmente; plano e moeda válidos são aplicados juntos. Retry/no-op do mesmo plano/moeda não gera agreement novo. Histórico de agreements é preservado, permanece apenas um agreement ativo, e a troca explícita para `demo_postpaid` adotou a versão publicada V3. V1/V2/V3 são imutáveis; snapshots confirmados: V1 `{}`, V2 `{procurement,products}`, V3 `{}`. `plan_has_capability()` no agreement V3 retorna false para `products` e `procurement`, conforme o snapshot.

Capability/currency inativa: **N/A neste ambiente**, pois não existe linha `active=false` nos catálogos atuais. Isso não é uma pendência genérica.

Preserve a distinção entre migration aplicada, regressão SQL, validação Go e HTTP. Nenhum teste desta seção foi executado por esta atualização documental.

### PB 0192 — publish exige política de ajuste negativo explícita

**Aplicada e homologada.** A migration adiciona a política explícita ao CRUD legado e ao snapshot automático. `billing_save()` exige o campo em POST/PUT; `billing_get()`/`billing_list()` o retornam; `billing_plan_snapshot_create()` rejeita política NULL e plano sem tiers, copiando a policy a todos os componentes. Durante `billing_save()` o GUC transacional `app.billing_snapshot_deferred` suprime somente os snapshots dos triggers daquela operação; a função restaura o valor anterior e cria um único snapshot depois de persistir o estado completo. Alterações diretas externas ao CRUD seguem cobertas pelos triggers. Não há default nem backfill. O operador confirmou 0192 aplicada e aprovou `billing.sql`, `platform_billing.sql` e a versão então vigente de `commercial_foundation.sql` com `ROLLBACK`. Posteriormente, a versão ampliada e atual de `commercial_foundation.sql` foi executada pelo operador com `ON_ERROR_STOP=1` e aprovada terminando em `ROLLBACK`, junto à regressão de Reseller Billing Accounts.

As regressões verificam ausência/valor desconhecido no CRUD, exatamente uma versão publicada com três componentes no create, uma versão adicional por PUT (tiers e depois policy-only), versão anterior imutável, rollback integral de tiers inválidos, restauração do GUC, rejeição de snapshot sem tiers, triggers de plano e tier ainda ativos fora de `billing_save()` e ausência de recursão por `uid_current_version`. A fixture Secondary é escolhida pelo `users.admin_list()` e qualificada pelas funções autorizadas `organizations.billing_agreement_list(uuid)` e `organizations.billing_get(uuid)`; não chame `users.is_secondary_for_organization()` diretamente com `navisoft_auth`, pois EXECUTE é restrito aos owners internos. O CRUD/snapshot é executado com Primary, já que `organizations.billing_save()` é Primary-only; a Secondary selecionada é usada apenas nos asserts finais de autorização. A fixture não depende de UID operacional fixo nem lê diretamente `organizations.organizations` com `navisoft_auth`. Se não houver ator elegível, a regressão indica `billing_secondary_fixture_missing_active_scoped_user_with_plan`. A tentativa de criar fixture com `users.admin_save()` falhou na validação de `access.scope_grants` e foi removida. `platform_billing.sql` também cobre publish: componente NULL e policies divergentes são rejeitados; conjuntos uniformes `floor_at_zero` e `apply_negative` são publicados. O operador confirmou `billing.sql` e `platform_billing.sql` aprovadas em PostgreSQL real com `ON_ERROR_STOP=1` e `ROLLBACK`. A versão atual ampliada de `commercial_foundation.sql` também foi posteriormente aprovada com `ON_ERROR_STOP=1` e `ROLLBACK`, conforme o encerramento da Fase 2 de Reseller Billing Accounts, registrado ao final deste guia.

A regressão Commercial verifica a mesma rejeição antes de criar oferta/pedido, sem enfraquecer `billing_agreement_apply_commercial_order()`. O operador confirmou 0192 aplicada e aprovou as regressões abaixo em PostgreSQL real com `ROLLBACK`. A extensão atual da regressão Commercial foi posteriormente executada e aprovada pelo operador; o histórico e os resultados atuais estão registrados no encerramento da Fase 2 de Reseller Billing Accounts.

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/billing.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/platform_billing.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/commercial_foundation.sql
```

Não envie POST/PUT de billing sem `negative_adjustment_policy`: após a 0192 a ausência ou valor fora de `apply_negative|floor_at_zero` retorna HTTP 422 `invalid_billing_data`. Envie o payload completo atualizado conforme [billing.md](billing.md). O comando de upgrade é histórico: as migrations já estão aplicadas. A evidência SQL anterior, a extensão atual da regression e a homologação HTTP são estados separados.

## Fundação comum A1 — países e subdivisões (0135–0136 aplicadas)

**Estado confirmado pelo operador:** 0135 e 0136 aplicadas em homologação; `migrations/tests/common_a1_countries_subdivisions.sql` aprovada no PostgreSQL real e terminou com `ROLLBACK`. O probe local `node migrations/tests/common_a1_pglite.mjs` também passou. O catálogo tem 249 países, 5.046 subdivisões em 200 países e mantém o UUID BR, os metadados telefônicos e as 27 UFs. A fonte da A1 é detalhada em [migrations.md](migrations.md).

## Fundação comum A2 — moedas, idiomas e catálogos neutros (0137–0138 aplicadas)

**Estado confirmado pelo operador:** migrations 0137–0138 aplicadas em homologação; `migrations/tests/common_a2.sql` aprovada no PostgreSQL real e terminou com `ROLLBACK`. Os geradores offline e o probe PGlite também passaram como evidências locais separadas.

Os snapshots são SIX ISO 4217 List One de 17/09/2026 (178 códigos) e IANA Language Subtag Registry File-Date 17/09/2026 (8.158 idiomas: 7.927 ativos e 231 deprecated). A1 continua aplicada e não foi reescrita. Não há crosswalk IANA↔ISO 639; `language_identifiers` está vazia intencionalmente. Moeda preserva código numérico como texto, categoria e minor unit de origem (incluindo UYW=4). `document_types` mantém o comportamento CPF/CNPJ e não é o catálogo `documents.types` do único GED global.

Antes de executar as migrations, os relatórios podem ser reproduzidos offline:

```bash
node migrations/seeds/currencies/generate.mjs
node migrations/seeds/languages/generate.mjs
node migrations/tests/common_a2_pglite.mjs
```

Para homologação PostgreSQL manual, aplicar e testar separadamente:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_common_a2.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/common_a2.sql
```

O segundo comando deve terminar em `ROLLBACK`. Verifique contagens e metadados dos catálogos, códigos requeridos (`pt`, `en`, `es`, `ak`, `ro`, `sh`, `tl`, `tw`), deprecated/preferred value, exclusão da faixa `qaa..qtz`, UUIDs por código e ausência de crosswalk não aprovado. Confirme que `common.document_types` preserva CPF/CNPJ, holder/country/subdivision e a separação de `documents.types`; catálogos relacionais não têm dependências de domínio. A regressão verifica unicidade, replay, RLS/FORCE RLS, ausência de DML runtime/PUBLIC e telefone BR. Nenhuma rota Go/HTTP foi alterada.

A prova cumulativa A1 já foi homologada e não precisa ser repetida para o A2: aplicar A2 exige 0136 registrada no `common.schema_migrations`.

## Collaborator Core/C1 e C2 — 0139–0143 aplicadas; regressões SQL aprovadas; HTTP C2 homologado para o contrato de frontend

O operador confirmou 0139 e 0140 aplicadas e aprovou `migrations/tests/collaborator_create_context_reset.sql` com `ROLLBACK`. A homologação HTTP do Collaborator Core C01–C20 foi concluída manualmente.

0139 cria `collaborators.collaborators`, autorização SQL por organização, RLS/FORCE RLS, auditoria sem valores pessoais, create idempotente e endpoints administrativos integrados ao `filters.Manager`. Não cria associação com user/driver/technician/entity, não recria `people`, não adiciona CPF/documentos, contatos, telefone, endereço, emprego ou remuneração. Image/profile-photo permanece fora porque Images ainda não aceita `record_type=collaborator`.

Estado C1 confirmado pelo operador: migration 0141 aplicada e `migrations/tests/collaborator_engagements.sql` aprovada integralmente com `ROLLBACK`. A homologação HTTP C1 continua manual/em andamento. Go, SQL e HTTP são evidências separadas.

Aplicação e regressão C1, em comandos separados:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_collaborator_engagements.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/collaborator_engagements.sql
```

A regressão já aprovada terminou com `ROLLBACK`; exige os atores, organizações e catálogos geográficos do preflight. Ela cria entities de teste temporárias nas duas organizações dentro da própria transação, então não depende de entities previamente cadastradas. Não reaplique 0141 durante a homologação HTTP.

A regressão base de 0139 e o teste focado da correção 0140 já estão homologados. A bateria HTTP C01–C20 também foi concluída; não precisa ser repetida como parte do C1.

Bateria HTTP C1 em andamento (seguir manualmente; não confundir com C2):

1. Como administrador com scope integral e área `collaborators`, crie registro com `Idempotency-Key`; espere 201 e `replayed:false`.
2. Consulte `GET /v1/admin/collaborators/engagement-types`; verifique os oito tipos globais e ausência de `clt`/`pj`.
3. Crie engagement com organização, tipo ativo, BR/RJ, entity da mesma organização, datas e `is_primary=true`; espere 201. Repita a mesma chave/body (200, `replayed:true`) e depois reuse a chave com body diferente (409).
4. Crie engagement simultâneo `is_primary=false` e uma nova linha para recontratação; ambos devem ter UIDs distintos. Crie um primary em período adjacente ao anterior (aceito) e um com data final inclusiva compartilhada (409 `engagement_primary_period_conflict`).
5. Tente subdivision de outro país, entity de outra organização, tipo/país inexistente, data inválida e fim anterior ao início; todos devem falhar sem criar linha ou consumir sucesso idempotente.
6. Faça PATCH `{"ended_on":"2027-03-31"}` e confira evento `engagement.ended`; tente limpar/alterar a data encerrada ou enviar campo histórico (rejeitado). Confirme que o collaborator continua ativo. PATCH `is_primary` válido deve produzir `engagement.primary_changed`.
7. Desative o collaborator e tente novo POST (409 `inactive_collaborator`); GET do engagement histórico ainda deve funcionar. Reative o collaborator para seguir.
8. GET/list com organização e collaborator corretos; confirme paginação `{items,total,limit,offset}` e filtros de tipo/país/período/primary. Tente UID de outra organização com contexto conhecido (404) e list/search sem alvo explícito (400). Não há DELETE.
9. Refaça os casos de negativa com conta sem área/scope integral. Confirme que nenhum user, driver, technician, profile, scope ou permissão foi criado/alterado.

### C2 — Estrutura organizacional e alocação profissional (0142–0143 aplicadas; SQL aprovada; HTTP homologado para o contrato de frontend)

O operador confirmou 0142 e 0143 aplicadas e `migrations/tests/collaborator_organization_structure.sql` aprovado no PostgreSQL real com `ROLLBACK`. A correção Go do PATCH de assignment e o mapeamento dos códigos de conflito foram compilados, reiniciados e validados via HTTP. A homologação HTTP C2 está concluída para o contrato de frontend; o roteiro abaixo registra somente os casos executados. O probe `node migrations/tests/c2_migration_probe.mjs` é validação local em PGlite descartável com dependências stubadas, separada da regressão PostgreSQL e da homologação HTTP.

**Evidência HTTP executada pelo operador:**

- Catálogos `organization-unit-types` e `work-modes`; criação de organization unit raiz/filha; replay idempotente e `idempotency_conflict`; conflito de `code` usando nova key; listagem com organization target, erro `organization_target_required` sem target e GET individual.
- Position create/replay/GET/list/PATCH.
- Assignment create/replay/GET/list; PATCH com campo histórico proibido retornando `invalid_collaborator_structure`; primary overlap retornando `assignment_primary_period_conflict`.
- Work mode `onsite`, overlap retornando `assignment_work_mode_period_conflict`, encerramento de `onsite`, criação subsequente de `remote` e listagem histórica mostrando dois períodos.
- Self-manager foi rejeitado.

O happy path HTTP de manager não foi repetido manualmente. Ciclo, validações de período e manager válido permanecem cobertos pela regressão SQL aprovada com `ROLLBACK`; não são evidências de testes HTTP executados. C2 é considerada homologada para o contrato de frontend com essa distinção preservada.

Os endpoints de update usam PATCH controlado; não há PUT substitutivo nem DELETE para recursos históricos. C1 continua em homologação HTTP separada. `entities.units` continua sendo unidade operacional de frota e não é usada como unidade organizacional de pessoas.

## Encerramento gracioso da API — Ctrl+C

1. Inicie a API pelo terminal que acompanhará o processo: `go run ./cmd/navisoft -config config.json`.
2. Aguarde `http server starting` e pressione `Ctrl+C` nesse mesmo terminal.
3. Confirme `shutdown signal received`, `shutdown started`, `background workers shutdown started` e `platform resource cleanup started/completed`; o processo deve sair dentro de `lifecycle.shutdown_timeout` (atualmente 15s no config local). Se worker ou fechamento de recurso exceder o prazo, a API registra a etapa que expirou e termina sem ficar presa.
4. Inicie novamente a API e repita com os consumidores habilitados. Não use o Gerenciador de Tarefas para encerrar o processo durante esta prova. Se a API estiver sob um serviço/wrapper, teste também se o wrapper encaminha Ctrl+C/SIGTERM ao processo filho.

## Regressão local — diagnóstico HTTP 5xx

Antes de retomar a homologação MFA, os testes Go direcionados devem confirmar que erro interno mapeado para 503 mantém o corpo público sanitizado, mas grava a causa original no `error.log` com request_id, código HTTP público, tipo da causa e operação. Verifique também que 4xx funcionais não geram falha técnica e que `component`, `host` e `server_name` aparecem uma única vez. A validação automatizada está em `internal/server` e `internal/logging`; não requer SQL nem alteração de banco.

# Notifications Core — preparação da intent e delivery

O operador reportou uma intent real de `organizations.insert` sem delivery persistida. A chamada SQL direta a `notifications.delivery_create()` com `payload.to` resolvido, `destinations` como array e `names:[]` passou em transação com rollback. A causa Go foi corrigida localmente: ausência de `recipient_names` serializava como `names:null`; agora o worker envia array vazio. O teste local também fixa o JSON entregue à função, preserva `to` como array e mantém compatibilidade com `to` string. O worker/Notify ainda precisa ser recompilado e retestado; não há evidência nesta entrega de que essa intent já foi aceita pelo Notify.

O teste operacional deve distinguir: intent criada, delivery persistida e solicitação aceita pelo Notify. A mensagem de sucesso do worker significa aceitação pelo Notify, não entrega final ao destinatário. A regressão PostgreSQL formal de 0177 não foi marcada como aprovada nesta evidência. Se for necessário aplicar/testar em outro ambiente, use:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_notifications_core.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/notifications_core.sql
```

A regressão deve terminar em `ROLLBACK`; ela verifica bindings, snapshots, múltiplas actions/deliveries, no-op de hook inexistente, RLS/FORCE RLS, grants e seed de área, e requer as fixtures Primary/org já usadas pelos testes do repositório. O wrapper exige 0176 e instala somente 0177.

Depois de aprovar SQL e configurar `notifications.core.enabled=true` com `notifications.autoscale.enabled=true`, homologar um passo por vez em organização descartável com token Autoscale Notify pertencente à própria organização:

1. Como Primary, configurar o hook default `organizations.insert`:

   ```http
   PUT /v1/admin/notifications/hooks/organizations.insert
   Content-Type: application/json
   Authorization: Bearer <PRIMARY_TOKEN>
   ```

   Body: `{"active":true,"payload":{"service":"email","to":["{{ organization.email }}"],"subject":"Organização {{ organization.name }} criada","message":"Código {{ organization.code }}"}}`. Use uma organização sem Notification Recipients para cobrir o caso em que `context_snapshot.recipients` e `recipient_names` estão vazios.

2. Criar uma organização descartável pelo fluxo HTTP já existente. A criação e a intent devem compartilhar a transação. O Core não substitui a notificação legada de onboarding. Confirme que aparece uma linha em `notifications.deliveries` e que `destination_snapshot` contém o email como array; uma falta de credencial M2M da própria organização deixa a delivery retentando, sem fallback para token global/de owner/outra organização.

3. No log seguro do worker, localizar `uid_delivery`, `uid_organization`, `notify_uid` e status HTTP. A mensagem de sucesso significa aceitação pelo Notify, não entrega final ao destinatário.

4. Consultar o estado da delivery:

   ```http
   GET /v1/admin/notifications/deliveries/<UID_DELIVERY>/status?uid_organization=<UID_ORGANIZATION>
   Authorization: Bearer <ADMIN_TOKEN>
   ```

   Confirmar o estado local e, se houver `notify_uid`, o refresh do Notify. Se o provider estiver indisponível, o último snapshot conhecido não deve desaparecer.

5. Em seguida, criar um recipient externo separado com `Idempotency-Key` UUID, endpoints/bindings da mesma organização; conferir replay exato 200 com `replayed=true`, chave/body divergentes 409 `idempotency_conflict`, e negar isolamento entre organizações. Desativação é `DELETE`; não há exclusão histórica física.

Limite conhecido: o request atual não envia `uid_delivery` como idempotency/external ID porque o contrato do Notify não documenta esse recurso. Se a aceitação externa ocorrer e a resposta se perder, o retry do Navisoft pode duplicar a solicitação; resolver essa janela depende de confirmação explícita do contrato do Notify.

Não habilitar um hook de segurança para teste: MFA, password recovery, contact verification e security notice continuam usando somente o dispatcher homologado. Não enviar token, OTP, email completo, payload ou headers de credencial a logs. O pipeline HTTP real ainda está pendente e nenhum teste HTTP deste Core deve ser marcado como concluído antes da confirmação do operador.

## Identity 2 — MFA por email e security notifications (0127–0134)

**Estado SQL confirmado:** 0127–0129 aplicadas; `migrations/tests/identity_mfa.sql` aprovado com `ROLLBACK`. O operador confirmou 0130–0134 aplicadas em PostgreSQL real e `migrations/tests/security_notification_cleanup.sql` aprovada com `ROLLBACK`. A primeira tentativa de 0134 parou no `LOCK TABLE`, antes de mudanças; a migration corrigida executou lock e DDL no contexto do migrador, sem transferir ownership nem ampliar privilégios runtime. A 0134 removeu worker/role/rota Rabbit exclusivos de security notifications. Aplicação, regressão SQL e HTTP continuam evidências distintas.

**Fluxo de entrega:** a API confirma a transação que cria o challenge e agenda o dispatch in-process limitado. O request HTTP não aguarda o provider. Credencial Autoscale é resolvida para o `uid_organization` da conta/notificação. Autoscale Notifications mantém fila durável, retry, provider e estado de entrega; Core não usa retry local, outbox Rabbit de segurança ou worker Rabbit. A limpeza 0134 foi aplicada e removeu os resíduos confirmados e a role exclusiva, preservando tabela de notificações, resolver de credenciais e infraestrutura genérica. RabbitMQ, auditoria, `cmd/message-relay` e outbox para outros domínios continuam ativos.

**Contact verification homologado manualmente por HTTP:** solicitação de email, dispatch direto Core→Autoscale Notifications, email recebido, confirmação do contato, cooldown configurável, resposta 429 durante cooldown e `Retry-After`/`retry_after_seconds` conforme o contrato. SMS e frontend continuam pendentes.

**MFA homologado manualmente por HTTP:**

- `GET /v1/users/security` inicialmente mostrou MFA desabilitado; preferência pessoal foi habilitada.
- Login retornou `pending_mfa`; o email `login_mfa` chegou.
- Bearer pendente mostrou `authenticated=false` no Status e foi rejeitado em rota de negócio.
- Challenge correto promoveu a mesma `uid_session`; o mesmo Bearer passou a `authenticated=true`, `state=active`, e uma rota normal funcionou.
- Código errado retornou 422; código correto após a tentativa inválida ainda promoveu a sessão.
- Com `max_attempts=5`, tentativas 1–4 retornaram 422 e a quinta retornou 429 `mfa_attempt_limit_reached`; sessão pendente foi revogada, `relogin_required=true` e o Bearer revogado falhou depois.
- Política organizacional `require_mfa=true` permaneceu efetiva mesmo com preferência do usuário `require_mfa=false`; login novo continuou exigindo MFA.
- Confirmação de challenge a partir de outro IP retornou 403 `mfa_client_ip_mismatch`.

Testes Go, regressões PostgreSQL e homologação HTTP são resultados separados. A bateria acima registra somente o resultado HTTP manual informado pelo operador.

### Regressões SQL

Os comandos abaixo são para validar regressões separadamente; não reaplicar as migrations já confirmadas neste banco. Cada arquivo de teste deve terminar com `ROLLBACK`.

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/identity_mfa.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/integration_tokens.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/security_notification_dispatch.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/contact_verification_request.sql
```

Neste ambiente, 0130–0134 já foram aplicadas e a limpeza SQL foi aprovada com `ROLLBACK`; não reaplique a migration nem repita essa regressão. As regressões de dispatch/credenciais acima permanecem testes independentes. O teste de integration tokens verifica o resolver de `navisoft_auth`; não depende da role removida.

Validação SQL local descartável: `node migrations/tests/security_notification_cleanup_pglite.mjs` aplica a migration e executa a regressão em PGlite, sem conectar a PostgreSQL operacional. Isso não substitui a execução PostgreSQL real após a aplicação manual.

Configuração mantém token por organização em `integrations.credentials`; não existem `notifications.autoscale.token` nem `notifications.autoscale.organization_id` globais. Habilite security flows somente com chave AES configurada e credencial válida da organização. Não registre token, código, segredo, endereço completo ou corpo da mensagem. O log pode exibir recipient mascarado e metadados seguros retornados pelo provider.

### Contrato e limites ainda pendentes

Password recovery mantém resposta pública genérica contra enumeração. Contact verification é autenticado e devolve `challenge_id` quando cria e agenda o dispatch; ausência de email retorna 422, contato já verificado 409 e cooldown 429 com o restante calculado pelo PostgreSQL. O cooldown vem de `auth.security_flows.contact_verification.cooldown_seconds`; a política antiga de cinco solicitações por hora foi removida para este fluxo. SMS e páginas frontend `/recovery` e `/verify-contact` permanecem pendentes.

## Integration Tokens por organização — 0130–0134 aplicadas; limpeza aprovada

O Core importa tokens Autoscale já emitidos, associados a uma organização. Primary administra credenciais; cada envio usa a organização durável da notificação, nunca `uid_organization_owner`, sem fallback global ou entre organizações. A API recebe somente as funções autorizadas e não DML direto em `integrations.credentials`.

0130–0134 foram confirmadas pelo operador como aplicadas em PostgreSQL real; `security_notification_cleanup.sql` terminou aprovado com `ROLLBACK`. Não reaplicar no ambiente confirmado. O endpoint administrativo de importação/rotação/revogação e a bateria HTTP de credenciais permanecem descritos abaixo; isso é separado da homologação dos envios de security email.

### Homologação HTTP — Primary, uma chamada por vez

Use token emitido para uma organização de teste e não o inclua em capturas, histórico de terminal ou logs.

1. `GET {{ _.baseURL }}/v1/admin/organizations/{{ _.orgA }}/integration-tokens/autoscale-notifications` com Bearer Primary retorna metadados; não pode conter token, digest ou ciphertext.
2. `PUT` na mesma rota com `Content-Type: application/json` e body `{"token":"TOKEN_AUTOSCALE_EMITIDO_PARA_ORG_A"}` importa/rotaciona; repetir token ativo deve retornar `replayed=true` sem criar outra credencial.
3. Repita para organização B e confirme isolamento.
4. Não-Primary recebe `403 integration_credential_not_allowed`; campo extra retorna 400 e token vazio/malformado retorna 422.
5. `DELETE` revoga e retorna 204; GET mostra estado revogado.

A homologação manual registrada acima confirma uso do provider nos fluxos contact-verification e MFA. Isso não significa que todos os casos administrativos de Integration Tokens tenham sido repetidos por HTTP.

## Knowledge Base — Partes 1/2A/2B aplicadas; Parte 2C preparada

**Parte 1 confirmada pelo operador em PostgreSQL real:** bootstrap e database independente `postgres_knowledge` concluídos; migration 0001 e replay idempotente aprovados; `foundation.sql` terminou com `ROLLBACK`; `navisoft_knowledge_api` autenticou por TCP como membro de `navisoft_knowledge_runtime`; SELECT direto no schema `knowledge` foi negado; config habilitada e health mostrou `enabled=true`, `critical=false`, `status=up`. Ao indisponibilizar somente Knowledge, a dependência ficou down/unavailable e `/v1/health/ready` permaneceu up.

**Estado confirmado pelo operador:** Core 0122 e Knowledge 0001–0003 estão aplicadas; as regressões PostgreSQL correspondentes foram executadas sem erro e com `ROLLBACK`. O papel runtime continua sem DML direto. Aplicação e regressão SQL não substituem evidência HTTP.

Depois, reinicie a API local com o pool Knowledge configurado. Com token Primary, percorra as rotas do contrato em [knowledge.md](knowledge.md): criar/listar categorias; criar item, vincular categorias/contexts; criar R00/R01; publicar explicitamente uma revisão; conferir GET/listagem; configurar grants `selected`; arquivar. Repetir POST com a mesma `Idempotency-Key` e payload deve responder 200 com `replayed=true`; reutilizar a chave com outra intenção deve conflitar. Com sessão ativa não-Primary, chamadas administrativas devem responder 403. Sem sessão, 401. Indisponibilidade de `postgres_knowledge` deve afetar somente essas rotas (503), mantendo Core e `/v1/health/ready` operacionais.

Validação local anterior: o harness PGlite passou. **Parte 2C está preparada e não aplicada:** 0123 no Core e 0004 em `postgres_knowledge`. A regressão `migrations/knowledge/tests/attachments.sql` passou no PGlite isolado; a regressão Core 0123 não foi executada. Nenhum banco foi acessado nem alterado nesta entrega. Core e Knowledge são bancos separados; cada regressão deve terminar com `ROLLBACK`.

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_knowledge_access.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/knowledge_ged_revision_resolve.sql
psql -d postgres_knowledge -v ON_ERROR_STOP=1 -f migrations/knowledge/apply.sql
psql -d postgres_knowledge -v ON_ERROR_STOP=1 -f migrations/knowledge/tests/attachments.sql
```

Validação desta entrega: `node migrations/knowledge/tests/run-pglite.mjs` passou em 0001–0004 com regressões e rollback; `go test -count=1 ./internal/server ./internal/users ./internal/knowledge`, `go vet ./internal/server ./internal/users ./internal/knowledge` e `go build -buildvcs=false -o .tmp-knowledge-2c/navisoft.exe ./cmd/navisoft` passaram. PGlite não prova grants/owners reais. HTTP da Parte 2C está pendente.

Na validação ampla solicitada, `go vet ./...` e `go build ./...` passaram (`GOFLAGS=-buildvcs=false` no build). `go test -count=1 ./...` falhou apenas em `internal/filters`: a regressão cumulativa interrompe em `permission denied for schema access` no probe Core/GED preexistente. `internal/server`, `internal/users` e `internal/knowledge` passaram isoladamente.

### Bateria HTTP manual da Parte 2C (após aplicar e validar SQL)

Prepare no Insomnia `knowledgeRevision`, `knowledgeItem`, `knowledgeSlug`, `attachmentUid`, `gedDocument`, `gedRevision`, `gedRevisionNext`, `primaryToken` e tokens de usuários autorizados. Use somente documento GED da Autoscale Ultra Master. Reinicie a API com o código desta entrega. Execute em ordem:

**K2C01 — vincular attachment em revisão Knowledge draft.**

```http
PUT {{ _.baseURL }}/v1/admin/knowledge/revisions/{{ _.knowledgeRevision }}/attachments
Authorization: Bearer {{ _.primaryToken }}
Content-Type: application/json

{"attachments":[{"uid_document":"{{ _.gedDocument }}","uid_document_revision":"{{ _.gedRevision }}"}]}
```

Esperado `200`; a resposta administrativa identifica o vínculo Knowledge e o par GED persistido. Consulte também `GET {{ _.baseURL }}/v1/admin/knowledge/revisions/{{ _.knowledgeRevision }}`; `attachments` deve conter o par fixo. Repetir o mesmo PUT mantém um único vínculo. Teste separadamente document de organização cliente, document inexistente, revision inexistente, revision pertencente a outro document e UUID inválido: esperado 422/erro de validação, sem mudar o conjunto anterior. Interromper Core/GED deve resultar em 503 e sem alteração Knowledge.

**K2C02 — publicar a revisão que contém attachment.**

```http
POST {{ _.baseURL }}/v1/admin/knowledge/items/{{ _.knowledgeItem }}/publish
Authorization: Bearer {{ _.primaryToken }}
Content-Type: application/json

{"uid_revision":"{{ _.knowledgeRevision }}","audience_mode":"public"}
```

Esperado `200`; a operação valida novamente cada par GED e só publica se o conjunto de attachments não mudou desde a validação.

**K2C03 — item público expõe somente o identificador/URL Knowledge.**

```http
GET {{ _.baseURL }}/v1/public/knowledge/items/{{ _.knowledgeSlug }}
```

Esperado `200`, attachment com `uid` Knowledge e `download_url`. Confirmar que o JSON não contém `uid_document`, `uid_document_revision`, repository, object key ou storage URL.

**K2C04 — download público.**

```http
GET {{ _.baseURL }}/v1/public/knowledge/items/{{ _.knowledgeSlug }}/attachments/{{ _.attachmentUid }}
```

Sem Bearer. Esperado `200`, bytes da revisão GED exata, MIME e filename canônico; validar `Content-Length` quando conhecido, `X-Content-Type-Options: nosniff` e `Cache-Control: no-store`.

**K2C05 — attachment de outro item.** Usar slug público A com `attachmentUid` do item B. Esperado `404 knowledge_attachment_not_found`, sem metadados indicando a qual item o UID pertence.

**K2C06 — item authenticated pela rota pública.** Usar um slug existente com audiência `authenticated`. `GET /v1/public/knowledge/items/{slug}/attachments/{attachment_uid}` sem Bearer deve retornar `404`; não deve revelar que o item existe.

**K2C07 — download authenticated autorizado.**

```http
GET {{ _.baseURL }}/v1/knowledge/items/{{ _.knowledgeSlug }}/attachments/{{ _.attachmentUid }}?uid_organization={{ _.organizationUid }}
Authorization: Bearer {{ _.authorizedToken }}
```

Esperado `200` somente quando a sessão tem `knowledge.access` e a ACL da Knowledge permite o item; conferir `Cache-Control: private, no-store`. Se o conteúdo for público, a rota autenticada também pode servi-lo quando a sessão passar o gate Core.

**K2C08 — selected sem grant.** Com sessão válida e `knowledge.access`, tente item `selected` sem grant efetivo. Esperado `404`; nenhuma leitura GED nem acesso ao storage deve ocorrer.

**K2C09 — selected com grant.** Conceda grant editorial válido, mantendo scope Core quando organization/entity-scoped, e repita com a mesma conta. Esperado `200`. Remova o scope Core ou membership de functional group e repita: próximo download deve voltar a `404`.

**K2C10 — archive/despublicação.** Arquive o item publicado pela rota administrativa. GET/download consumer do item devem retornar `404`. O documento e as revisões GED continuam existentes; não apagar/remover histórico.

**K2C11 — nova revisão GED não muda attachment Knowledge.** Crie `R01` GED do mesmo documento depois de Knowledge apontar para `R00`, sem alterar Knowledge. Download continua entregando os bytes de `R00`.

**K2C12 — nova revisão Knowledge aponta para revisão GED nova.** Crie uma nova Knowledge revision, vincule `{{ _.gedRevisionNext }}`, publique-a explicitamente e confirme que o download passa a servir essa revisão. A associação antiga permanece no histórico imutável. O mesmo GED par pode ser associado a vários itens: publicar um item como público não torna o attachment UID dos outros itens acessível.

Em todos os casos negativos de item/attachment (draft, archived, slug não visível, revision antiga não publicada atualmente, UID inexistente ou não associado), conferir `404` genérico. Interromper Knowledge/Core GED/storage deve retornar `503 knowledge_attachment_unavailable`; item textual público continua funcionando quando só Core/GED/storage estiver indisponível. Nenhuma resposta deve conter link pré-assinado ou metadado interno GED.

### Knowledge 2D — vídeos YouTube por revisão (implementação local; homologação pendente)

Testes locais desta entrega: `go test -count=1 ./internal/knowledge ./internal/server` passou; `node migrations/knowledge/tests/run-pglite.mjs` passou aplicando Knowledge 0001–0005 em PGlite isolado e executando regressões com `ROLLBACK`. Não houve aplicação PostgreSQL real, regressão PostgreSQL real ou HTTP. O estado operacional de Knowledge 0004/Core 0123 ainda precisa ser confirmado pelo operador antes de qualquer comando operacional; `apply.sql` aplica cada migration Knowledge que estiver ausente, inclusive 0004 antes de 0005.

Regressão preparada: `migrations/knowledge/tests/videos.sql`. Ela cobre default vazio, um e vinte vídeos, excesso do limite, ID/posição repetidos, campos desconhecidos, idempotência, revisão publicada preservada, publish explícito, ACL selected, ausência dos arrays em revision list/search e fronteira sem DML runtime. Execute apenas depois da confirmação prévia das versões Knowledge 0004 e Core 0123:

```bash
psql -d postgres_knowledge -v ON_ERROR_STOP=1 -P pager=off -f migrations/knowledge/tests/videos.sql
```

Para homologação HTTP, após revisão/aplicação autorizada e reinício da API, use Primary e execute uma chamada por vez:

1. `POST /v1/admin/knowledge/items/{uid}/revisions` com `Idempotency-Key`, incluindo dois vídeos válidos; conferir 201 e IDs/URLs canônicas na resposta.
2. Repetir chave e body idênticos; conferir replay 200, mesmo UID e `replayed=true`. Reutilizar a chave com body diferente deve conflitar.
3. Consultar `GET /v1/admin/knowledge/revisions/{uid}` e o detalhe do item; confirmar vídeos e ordem. `GET /items/{uid}/revisions` não deve conter arrays `videos`.
4. Antes de publicar, confirmar que o detalhe consumer não expõe a revisão nova. Publicar explicitamente pela rota existente e confirmar vídeos apenas no detalhe autorizado do artigo publicado. A busca consumer não deve incluir o array completo.
5. Repetir com audiência pública e selected: público vê somente artigo publicamente publicado; selected sem grant/scope permanece 404; ator com autorização atual vê os vídeos da revisão publicada.
6. Rejeitar HTTP, host semelhante, porta, userinfo, query `v` duplicada, path não aprovado, ID inválido, URL codificada, campos extras, HTML, posição/ID repetido e 21 vídeos. Confirmar que nenhuma revisão parcial foi criada.

Esses passos são roteiro futuro, não evidência HTTP executada.

## Assets rodoviários e FIPE — cache 0001–0002 aplicada; configuração local em validação

**Estado confirmado pelo operador:** 0117–0121 aplicadas em `autoscale_nvs_db`; `migrations/tests/asset_vehicle_fipe.sql` aprovada com `ROLLBACK`; database `postgres_fipe_cache` criado; cache FIPE 0001–0002 aplicadas; `migrations/fipe/tests/idempotent_cache.sql` e `migrations/fipe/tests/reader_privileges.sql` aprovadas com `ROLLBACK`. O login `fipe_cache_reader` pertence somente a `navisoft_fipe_reader` e não tem membership em `navisoft_fipe_worker`. `autoscale_us` permanece login principal restrito da API, sem roles FIPE. `autoscale_ems_admin` permanece exclusivamente administrativo/interativo e não deve constar nos configs operacionais. Os arquivos locais foram separados: API usa reader; worker usa `fipe_sync_jobs` e `fipe_cache_worker`. Os dois `-check-config` passaram localmente sem conexão; eles não validam autenticação. A senha nova do reader está vazia em `config.json` e deve ser preenchida localmente em `postgres_fipe_cache.password` antes da API usar valuation. Worker real e HTTP FIPE continuam pendentes.

**Validação local concluída:** `go run ./cmd/navisoft -config config.example.json -check-config` passou sem conectar aos serviços. Também passaram os comandos com os arquivos separados `config.json` e `config.fipe-worker.json`; `-check-config` verifica apenas a estrutura e não tenta autenticar no PostgreSQL. `go test -count=1 ./internal/fipe ./internal/config ./internal/platform ./internal/server ./cmd/fipe-sync` e `go vet ./internal/fipe ./internal/config ./internal/platform ./internal/server ./cmd/fipe-sync` passaram; `cmd/fipe-sync` não tem testes próprios. O operador confirmou a migration 0002 e a regressão real PostgreSQL; worker real e rotas HTTP continuam pendentes.

FIX F03: uma fila `common.jobs_sync` vazia é idle normal. `RunOnce` retorna sem erro, não decodifica JSON nem cria `fipe.import_runs`; o loop aguarda `poll_interval`. Testes também confirmam `catalog_sync` com `{}` válido e payload malformado de job reivindicado ainda produz erro. Para esta correção passaram `go fmt ./...`, `go test -count=1 ./internal/fipe ./cmd/fipe-sync`, `go vet ./internal/fipe ./cmd/fipe-sync` e `go build ./cmd/fipe-sync`. O build usou `GOFLAGS=-buildvcs=false` por uma limitação de acesso ao metadado VCS do checkout.

### Validar a fronteira de privilégios e a configuração local

O operador já aplicou a cache 0002 no PostgreSQL e confirmou `fipe_cache_reader` associado somente a `navisoft_fipe_reader`; a regressão `reader_privileges.sql` terminou com `ROLLBACK`. Não reaplique a migration, não repita GRANTs nem rode SQL para essa etapa.

1. Use configurações separadas e com permissões de arquivo restritas. Em `config.json`, mantenha o bloco `postgres` habilitado com `autoscale_us`; `postgres_fipe_cache` habilitado usa `fipe_cache_reader`; `postgres_fipe_jobs` e `postgres_fipe_cache_worker` ficam desabilitados, sem senha operacional. Preencha a senha reader localmente em `postgres_fipe_cache.password`. Em `config.fipe-worker.json`, `postgres` fica desabilitado e sem senha; `postgres_fipe_jobs` usa `fipe_sync_jobs`; `postgres_fipe_cache_worker` habilitado usa `fipe_cache_worker`; o reader fica desabilitado, com senha vazia. A API e o worker nunca usam `autoscale_ems_admin`.

2. Estes comandos de validação já passaram localmente sem abrir conexões. Rode novamente depois de preencher a senha reader, antes de iniciar a API:

       go run ./cmd/navisoft -config config.json -check-config
       go run ./cmd/fipe-sync -config config.fipe-worker.json -check-config

Depois de preencher localmente a senha reader e repetir o check da API, os configs estarão prontos para a etapa seguinte. A senha de `fipe_cache_worker` já está configurada no arquivo local do worker. Somente então inicie o worker em um terminal:

       go run ./cmd/fipe-sync -config config.fipe-worker.json

Essa será a primeira execução real ainda pendente. Em seguida, use a bateria HTTP abaixo para enfileirar `catalog_sync`, confirmar a conclusão pela lista/detalhe de jobs e executar os cenários de valuation. Não execute migrations operacionais nesta etapa.

### Homologação HTTP

Use token Primary Autoscale e, para leitura de valuation, uma organização/asset autorizados. O Idempotency-Key é obrigatório no POST de sync e uma nova intenção recebe UUID própria.

1. Como Primary, agende o catálogo:

       curl -i -X POST "$BASE/v1/admin/integrations/fipe/sync" \
         -H "Authorization: Bearer $PRIMARY_TOKEN" \
         -H "Idempotency-Key: 11700000-0000-4000-8000-000000000001" \
         -H "Content-Type: application/json" \
         -d '{"job_type":"catalog_sync","payload":{}}'

   Esperado: 202 e job queued/running. Repetição exata deve retornar 200 com replayed=true ou já-running. Mesma chave e payload diferente deve retornar 409 idempotency_conflict. Repetir o POST não deve chamar a FIPE em linha na API.

2. Consulte jobs como Primary:

       curl -s "$BASE/v1/admin/integrations/fipe/jobs?limit=25&offset=0" \
         -H "Authorization: Bearer $PRIMARY_TOKEN"

       curl -s "$BASE/v1/admin/integrations/fipe/jobs/$JOB_UID" \
         -H "Authorization: Bearer $PRIMARY_TOKEN"

   Confira status, attempts, timestamps, contadores e last_error. Verifique também que outro perfil recebe 403.

3. Com o worker fipe-sync rodando em outro terminal, acompanhe a conclusão do catalog_sync. Faça um pedido distinto reference_sync e confirme referências/importação sem duplicação após uma nova execução.

4. Configure um tipo como road_vehicle/cars; associe fabricante e fipe_brand_codes para o UUID do tipo; configure fipe_model_code e parâmetros-base no modelo; configure fipe_fuel_code no combustível. Faça GET das listas e dos UIDs para confirmar que as extensões aparecem tanto no item quanto na lista.

5. Crie asset rodoviário com uma unidade da entidade e inclua vehicle no mesmo POST:

       curl -i -X POST "$BASE/v1/admin/assets" \
         -H "Authorization: Bearer $PRIMARY_TOKEN" \
         -H "Idempotency-Key: 11700000-0000-4000-8000-000000000002" \
         -H "Content-Type: application/json" \
       -d "{\"uid_organization\":\"$ORG\",\"uid_entity\":\"$ENTITY\",\"uid_unit\":\"$UNIT\",\"uid_model\":\"$MODEL\",\"uid_fuel\":\"$FUEL\",\"identification\":\"HOMOLOG-FIPE-01\",\"vehicle\":{\"plate\":\"ABC1D23\",\"model_year\":2024,\"telemetry_params_override\":{\"gps\":{\"report_interval\":30}}}}"

   No terminal Bash, defina $ORG, $ENTITY, $UNIT, $MODEL e $FUEL com UUIDs reais antes do curl. No Insomnia, use os UUIDs reais diretamente no JSON. Deve criar asset e veículo atomicamente. Retry exato deve retornar o mesmo asset. GET do asset deve incluir vehicle, asset_profile, telemetry_params_model e os parâmetros efetivos mesclados.

6. Faça valuation:

       curl -i "$BASE/v1/admin/assets/$ASSET_UID/valuation" \
         -H "Authorization: Bearer $AUTHORIZED_TOKEN"

   Com cache preenchido, esperado 200 com fonte, código FIPE, `reference` mais recente, valor em centavos e histórico apenas para os meses de referência exatos disponíveis. Cada período é relativo à reference_date retornada; mês ausente permanece `null`, sem aproximação. Exemplo: referência 2026-10-01 e preço de 2026-09-01 disponível devem preencher `history.1_month`, com `price_cents=6476000`, `change_cents=-93700` e `change_percent` aproximadamente `-1.45`. Em cache miss, esperado 202 refresh_queued; confirme job valuation_refresh e depois repita a leitura. Erro do cache/provider pode afetar esta funcionalidade FIPE, mas login, assets, devices, telemetria e readiness Core devem continuar disponíveis.

7. Negativos: Basic/outro perfil não deve agendar catalog_sync/reference_sync/variant_refresh; valuation de asset fora do scope deve retornar not-found/deny; mapping inválido não salva; tipo incompatível de modelo não pode ser ligado ao veículo; preço/mês do provider inválido deve falhar o job sem duplicar linhas; desligue o cache ou bloqueie a API externa em ambiente de teste e confirme que Core continua saudável.

8. Verifique isolamento operacional: valuation e jobs têm contexto de organização obrigatório via ACL existente; catalog_sync não dá acesso a dados operacionais de outras organizações. No cache, as tabelas são catálogo FIPE global e não possuem UIDs de cliente.

### Evidência

Registre separadamente: migrations operacionais 0117–0121 aplicadas; cache 0001–0002 aplicadas; regressões operacionais, cache idempotente e reader aprovadas com `ROLLBACK`; login reader membro somente de `navisoft_fipe_reader` e sem membership worker; `autoscale_us` restrito e sem roles FIPE; configuração API e worker validadas estruturalmente por `-check-config` (senha reader preenchida localmente e check repetido ainda pendentes); testes Go e vet aprovados; execução real do worker; HTTP jobs; HTTP CRUD de assets/vehicle; HTTP valuation/cache miss; teste de indisponibilidade Core. Preenchimento da senha, worker real e HTTP FIPE continuam pendentes até execução pelo operador.

## Armazenamento compartilhado, logos e GED — 0101–0110 aplicadas; regressão SQL aprovada; core HTTP Phase 1 homologado

O operador confirmou 0101–0110 aplicadas; `migrations/tests/shared_storage_images.sql` e `migrations/tests/shared_storage_documents.sql` foram aprovados com `ROLLBACK`. O operador confirmou `migrations/tests/shared_storage_distributions.sql` aprovada integralmente com `ROLLBACK`, após corrigirmos a chave `details.uid_distribution` e o tratamento do UUID vazio do alvo entity opcional. O core HTTP Phase 1 foi homologado manualmente para owner, distribuição, `follow_latest`, `fixed_revision`, revoke, isolamento do recipient, tentativa de revisão pelo recipient, target organization/entity, target sem distribuição, replay/idempotency e revisão efetiva com acesso à revisão antiga negado. Os comandos de repetição abaixo não representam pendências por si só; somente casos periféricos nominalmente identificados como pendentes seguem pendentes. 0106 fixa a taxonomia canônica, 0107 protege a família MIME de R00, 0108 exige nome canônico/resumo/conteúdo novo, 0109 acrescenta alvo e distribuição organizacional em leitura, e 0110 corrige o UPDATE da política.

Para aplicar a correção GED preparada e validar os catálogos, rode o wrapper cumulativo e a regressão:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_shared_storage_documents.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/shared_storage_documents.sql
```

O wrapper aplica apenas versões ausentes, incluindo 0106–0110; as regressões terminam com `ROLLBACK`, validam taxonomia, MIME, nome canônico, resumo obrigatório, SHA distinto do latest, replay, sequência não consumida e distribuição/revogação. A regressão de distribuição exige duas organizações destinatárias ativas além da Autoscale. Rejeições não criam objeto nem recibo de sucesso. Não execute o reset de desenvolvimento se existirem contratos, documentos ou revisões. O reset verifica isso e aborta sem apagar dados.

O teste termina em `ROLLBACK`. Depois reinicie o binário atualizado e repita a bateria abaixo. Registre aplicação da migration, regressão SQL, Go e HTTP como evidências separadas.

### Upload GED: conteúdo, extensão e tipo estável entre revisões

O código local foi validado com `go test -count=1 ./internal/documents ./internal/server`; homologação HTTP ainda está pendente. A rota aceita somente PDF e JPEG. R00 estabelece MIME e nome canônicos e permite omitir `X-Revision-Summary`; um resumo válido também pode ser informado. Para R01+, envie o mesmo `X-File-Name` (ou omita para herdar o nome de R00) e um `X-Revision-Summary` obrigatório: texto UTF-8 de 1–500 caracteres Unicode, no máximo 2.000 bytes e sem controles. Cabeçalho de resumo presente, mas vazio ou só com espaços, retorna `422 document_revision_summary_invalid` em qualquer revisão. Use uma nova `Idempotency-Key` UUID por nova intenção; o retry exato reutiliza a chave e os mesmos bytes/headers:

```bash
# PDF válido: esperado 201, mime_type=application/pdf, extension=pdf
curl -i -X POST "$BASE/v1/admin/documents/$DOC/revisions?uid_organization=$ORG" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/pdf' \
  -H 'X-File-Name: termo.pdf' -H 'Idempotency-Key: UUID_PDF' \
  --data-binary '@termo.pdf'

# Repita exatamente o request anterior com a mesma chave: esperado 200 e replayed=true.

# JPEG válido: esperado 201, mime_type=image/jpeg, extension=jpg (ou jpeg)
curl -i -X POST "$BASE/v1/admin/documents/$DOC/revisions?uid_organization=$ORG" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: image/jpeg' \
  -H 'X-File-Name: foto.jpg' -H 'Idempotency-Key: UUID_JPEG' \
  --data-binary '@foto.jpg'
```

Repita usando JPEG bytes com `application/pdf` + `.pdf`, PDF bytes com `image/jpeg` + `.jpg`, JPEG bytes com `application/pdf` + `.jpg`, um filename sem extensão e uma extensão não suportada como `.docx`. Mismatches de bytes/MIME/extensão retornam `422 document_file_type_mismatch`; nome sem extensão retorna `400 document_filename_extension_required`. Crie também outro documento e envie R00 sem `X-Revision-Summary`; deve retornar `201` e criar uma única revisão R00. R00 com um resumo válido também deve retornar `201` e persistir o resumo.

Com R00 PDF, envie R01 PDF com bytes alterados, mesmo nome canônico e `X-Revision-Summary`; espere `201`, `revision_number=1`, `revision_code=R01` e resumo persistido. R01 sem resumo deve retornar `422 document_revision_summary_required`; R01 com resumo só de espaços deve retornar `422 document_revision_summary_invalid`. Em ambos os erros, não pode haver write no storage, revisão, recibo de sucesso ou consumo de sequência. Nome diferente retorna `422 document_revision_filename_mismatch`; mesmo SHA-256 da revisão latest com nova chave retorna `409 document_revision_unchanged`. Depois envie conteúdo diferente válido e confirme R01. R01+ pode omitir `X-File-Name` e herda o nome de R00.

Ao tentar mudar PDF para JPEG ou o inverso, bytes/MIME/extensão primeiro precisam ser compatíveis; a divergência com o nome canônico deve retornar `422 document_file_type_mismatch`. SQL também protege a família MIME contra chamada direta à função de registro. JPEG `.jpg` e `.jpeg` são da mesma família MIME, porém não permitem mudar o nome canônico. Teste a semântica do hash com R00=A, R01=B e R02=A: permitido, pois A difere do latest B. Retry exato de R01/R02 aceito continua `200`/`replayed:true` sem novo objeto/revisão; mesma chave com outro fingerprint retorna `409 idempotency_conflict`.

A rejeição da família incompatível acontece antes do write ao storage e do recibo de sucesso. A revisão e seu número não são persistidos; utilize uma nova `Idempotency-Key` para o envio válido após a rejeição.

Antes de subir binário, configure no `config.json` os repositories público/privado, tenant GED e limites. Em production, todo filesystem persistente precisa de `shared:true` e do mesmo mount em cada API atrás do HAProxy. Configure S3 endpoint/bucket/region/credentials pelo mesmo código de configuração em todos os nós. Não use sticky sessions como requisito. Não envie repository/key/visibility no HTTP.

### Imagens

Com Primary ou administrador autorizado, envie uma logo e guarde o UID retornado. Use arquivo válido PNG, JPEG ou GIF:

```bash
curl -i -X POST "$BASE/v1/admin/images/organization/$ORG?link=true" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: image/png' \
  -H 'Idempotency-Key: 81010000-0000-4000-8000-000000000001' \
  --data-binary '@logo.png'
curl -i "$BASE/v1/public/images/$IMAGE_UID"
```

Esperado: primeiro upload `201`, retry idêntico `200`/mesmo UID; a resposta tem `public_url` e não contém `repository_code` ou `object_key`. Download público entrega a logo vinculada. Repita para entidade. Envie também uma imagem sem `link=true`: deve retornar `201`, sem `public_url`, e seu UID deve retornar 404 na rota pública até haver vínculo. Substitua a logo existente e confirme que só a nova logo resolve publicamente. Para mesmo `Idempotency-Key` com bytes diferentes, espere `409 idempotency_conflict`. Envie avatar de usuário ou foto de asset e confirme que `GET /v1/public/images/{uid}` responde 404, enquanto o download autenticado e autorizado em `/v1/images/{uid}` funciona. Confirme leitura de imagem legada sem repository metadata. Para HAProxy, faça upload no nó 1 e download no nó 2, sem afinidade de sessão.

### Contratos e metadados GED

```bash
curl -i -X GET "$BASE/v1/admin/documents/catalogs" -H "Authorization: Bearer $TOKEN"

curl -i -X POST "$BASE/v1/admin/document-contracts" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 61020000-0000-4000-8000-000000000001' \
  -d '{"uid_organization":"UUID_ORG","contract_year":2026,"contract_code":"FROTA-01"}'

curl -i -X POST "$BASE/v1/admin/documents" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 61020000-0000-4000-8000-000000000002' \
  -d '{"uid_organization":"UUID_ORG","uid_contract":"UUID_CONTRACT","origin_code":"I","area_code":"TEC","type_code":"IM","title":"Termo técnico","metadata":{}}'

curl -i -X POST "$BASE/v1/admin/documents/search" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"filters":[{"field":"uid_organization","operator":"eq","value":"UUID_ORG"}]}'
```

Use valores retornados para `UUID_CONTRACT` e `UUID_DOCUMENT`. O create de contrato/documento deve retornar `201`; repetir chave e conteúdo exatos deve retornar `200` com `replayed:true`. Reutilizar a chave com conteúdo alterado deve retornar `409 idempotency_conflict`. A pesquisa sem exatamente um `uid_organization eq UUID` deve falhar `400`; somente a organização autorizada pode aparecer.

### Upload, replay, revisões e download privados

```bash
curl -i -X POST "$BASE/v1/admin/documents/$DOCUMENT_UID/revisions?uid_organization=$ORG" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/pdf' \
  -H 'X-File-Name: termo.pdf' \
  -H 'Idempotency-Key: 61020000-0000-4000-8000-000000000003' \
  --data-binary '@termo.pdf'

curl -i -X POST "$BASE/v1/admin/documents/$DOCUMENT_UID/revisions?uid_organization=$ORG" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/pdf' \
  -H 'X-File-Name: termo.pdf' \
  -H 'Idempotency-Key: 61020000-0000-4000-8000-000000000003' \
  --data-binary '@termo.pdf'

curl -i "$BASE/v1/admin/documents/$DOCUMENT_UID?uid_organization=$ORG" -H "Authorization: Bearer $TOKEN"
curl -i "$BASE/v1/admin/documents/$DOCUMENT_UID/revisions?uid_organization=$ORG" -H "Authorization: Bearer $TOKEN"
curl -i "$BASE/v1/admin/document-revisions/$REVISION_UID/download?uid_organization=$ORG" -H "Authorization: Bearer $TOKEN"
```

Esperado: primeira revisão `R00`, retry idêntico `200`/`replayed:true` e exatamente uma revisão. Reutilizar a chave com outro binário ou filename retorna `409 idempotency_conflict`. Documento/revisão nunca aparecem em URL pública. Com `private_download_mode=proxy`, download retorna bytes; com `presign` e repository S3 privado, retorna `{url,expires_at}` depois de autorizar na API. Filesystem sempre usa proxy. Confirme que UUID de outra organização retorna 404 mesmo com usuário autenticado; Basic sem `documents.access` não pode gerir documentos por ter acesso a assets.

Para concorrência multi-node, dispare em paralelo dois POSTs idênticos pela HAProxy com a mesma chave: deve resultar uma revisão lógica e uma key determinística; nenhum retry deve criar uma segunda revisão. Também teste chave igual/conteúdo diferente e upload concorrente de chaves novas. Falhas físicas/SQL devem retornar erro, não registrar sucesso; erro de limpeza pode deixar órfão inacessível por metadados. Não há transação distribuída nem purge de órfãos nesta fase.

### Validação local preparada

```powershell
go test -count=1 ./internal/storage ./internal/images ./internal/documents ./internal/config ./internal/server ./internal/platform
go vet ./internal/storage ./internal/images ./internal/documents ./internal/config ./internal/server ./internal/platform
node migrations/tests/run.mjs
```

Para esta etapa, `go test -count=1 ./internal/server`, os testes focados de filtros e `go vet ./internal/server ./internal/filters` passaram. `NAVISOFT_TEST_GED_ONLY=1 node migrations/tests/run.mjs` passou os contratos estáticos e sondas PGlite de 0104–0108; isso não executa as regressões PostgreSQL de 0109–0110. O runner amplo ainda para na fixture 0067 com `permission denied for schema access`, antes dos contratos GED. O operador confirmou 0101–0110 aplicadas e `shared_storage_documents.sql` aprovada; `shared_storage_distributions.sql` chegou às asserções finais, corrigidas para consultar `details.uid_distribution` e tratar o UUID vazio do alvo entity opcional. O operador confirmou que a regressão terminou com `ROLLBACK`. O core HTTP Phase 1 foi homologado manualmente; somente casos periféricos explicitamente listados permanecem pendentes. Nenhuma migration ou teste foi executado no banco compartilhado por este agente nesta etapa. PGlite, PostgreSQL real e HTTP são evidências distintas.

## Pessoas e papéis driver/technician — 0079–0088 aplicadas; regressão SQL aprovada; reteste HTTP pendente

O operador confirmou 0079–0085 aplicadas em homologação e `migrations/tests/people_technicians.sql` aprovado com `ROLLBACK`. A 0085 concede somente `USAGE` nos schemas `drivers` e `devices` a `navisoft_users_owner`, permitindo chamar os predicados de papel sem conceder acesso direto às tabelas. O operador também confirmou 0086–0088 aplicadas e `migrations/tests/driver_technician_cutover.sql` e `migrations/tests/entity_technician_type_guard.sql` aprovados com `ROLLBACK`. A proteção SQL está aprovada. O HTTP retornou `503 event_storage_unavailable` porque uma rota PUT duplicada desviava a chamada para o handler genérico de eventos; a duplicidade foi removida no Go. Recompile/reinicie o binário e reteste pela API. Registre separadamente resultados Go, SQL e HTTP:

**Estado do corte de papéis:** 0086–0088 aplicadas em homologação; `migrations/tests/driver_technician_cutover.sql` e `migrations/tests/entity_technician_type_guard.sql` aprovados com `ROLLBACK`, conforme confirmação do operador. A homologação HTTP encontrou a falha e o estado de teste foi restaurado. Usuário, motorista e executor continuam sem identidade/vínculo compartilhado. A resposta 503 veio de uma rota PUT duplicada registrada em Go, já removida; recompile/reinicie o binário e valide o mesmo PUT. Esperado com executor ativo: `409 {"message":"technicians_attached"}`; confirme também que os tipos não mudaram. Sem executor vinculado, a remoção deve poder prosseguir conforme a regra SQL.

```powershell
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_people_technicians.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/people_technicians.sql
```

A regressão `people_technicians.sql` foi aprovada pelo operador com `ROLLBACK`. As listagens de executores exigem exatamente um filtro `uid_organization eq UUID`; a API valida e instala o alvo em `app.organization_target`, e as funções SQL aplicam o corte antes de ler os registros. Nesta revisão, `go test ./internal/server` e `go vet ./internal/server` passaram. `node migrations/tests/run.mjs` aprovou os contratos estáticos até 0088, mas a suíte PGlite parou em `permission denied for schema access` durante as migrations antigas. A regressão 0088 foi executada diretamente na homologação e aprovada com `ROLLBACK`, conforme confirmação do operador; ela não foi validada pelo runner PGlite. O próximo passo é somente o reteste HTTP, sem reaplicar migration ou repetir a regressão SQL.

Use [people_role_cutover.md](people_role_cutover.md) para o histórico do corte e [device_technician_workflow.md](device_technician_workflow.md) para o contrato vigente. A ordem HTTP recomendada é: (1) criar a entidade prestadora; (2) atribuir-lhe o tipo `technician`; (3) criar executor opcional subordinado a essa entidade; (4) criar motorista como registro independente; (5) opcionalmente associar uma conta Basic ativa do mesmo tenant ao executor; (6) confirmar self-service restrito às próprias OS/custódias, ou usar operação administrativa se não houver login; (7) validar confirmação de entrega, start, conclusão, declaração de retorno e recebimento físico; (8) confirmar isolamento cross-organization e snapshots históricos; (9) confirmar que o fluxo de estoque SIM/device não regrediu. A existência e atribuição do executor não dependem de login.

Ids técnicos anteriores à atualização continuam referenciados em OS/custódia durante o backfill e mantêm histórico. Depois do cutover, a API não aceita a rota legada `/v1/admin/drivers/{uid}/technician-account`. Mantenha resultados separados para migration aplicada, regressão SQL, testes Go e HTTP; o sucesso de uma camada não homologa as demais.

## Contacts and addresses — 0077–0078 applied; SQL regression approved

The operator confirmed 0077 and 0078 applied and `migrations/tests/directory_contacts_addresses.sql` approved with `ROLLBACK`. The fixture chooses active organization/entity rows with `lifecycle.effective()`; those base tables do not have `deleted_at`. The regression checks area grants, validator allowlist, enabled Primary-only trigger, and the internal schema privilege. Run `node migrations/tests/directory_contract.mjs`, `go test ./internal/server ./internal/filters`, and `go vet ./internal/server ./internal/filters` before starting HTTP tests. Use the matrix in [directory_contacts_addresses.md](directory_contacts_addresses.md): organization/entity links, resolved organization, context-scoped duplicate email/phone, multi-role contact, multiple address purposes, WhatsApp validation, required organization-target filter/parameter, idempotent replay, and rejection of cross-organization UUID probing. Record migration, SQL, Go, and HTTP results separately.

### Hands-on HTTP sequence — contacts and addresses

Use a Primary token for the first pass and an active test organization. To test an entity link, choose an active entity belonging to that same organization. Replace the UUID placeholders and use fresh `Idempotency-Key` UUIDs for each distinct POST. In Insomnia, create a folder named **Contacts** and another named **Addresses**; all requests below use Bearer auth and JSON bodies. The following commands are Bash examples.

```bash
BASE='http://127.0.0.1:8080'
TOKEN='TOKEN_PRIMARY'
ORG='UUID_ORGANIZACAO_TESTE'
ENTITY='UUID_ENTIDADE_DA_MESMA_ORGANIZACAO'
CONTACT='UUID_RETORNADO_NO_POST_DO_CONTATO'
ENTITY_CONTACT='UUID_RETORNADO_NO_POST_DO_CONTATO_DA_ENTIDADE'
ADDRESS='UUID_RETORNADO_NO_POST_DO_ENDERECO'
```

Create a contact linked to the organization. Save the returned `uid` as `CONTACT`:

```bash
curl -i -X POST "$BASE/v1/admin/contacts" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 7da58038-7a55-476e-ae9c-e0669b64f102' \
  -d "{\"link_code\":\"organization\",\"uid_link\":\"$ORG\",\"name\":\"Contato teste\",\"roles\":[\"financial\",\"commercial\"],\"methods\":[{\"type\":\"phone\",\"value\":\"+5531998765432\",\"is_whatsapp\":true,\"is_primary\":true},{\"type\":\"email\",\"value\":\"contato.teste@example.test\",\"is_primary\":true}]}"
```

Esperado: `201 Created`, organização resolvida no retorno, telefone/email normalizados e arrays `roles`/`methods`. Copie o `uid` da resposta para `CONTACT` antes dos próximos comandos. Repita exatamente o mesmo POST com a mesma chave: esperado `200 OK` e `replayed:true`. Cada nova criação deve usar uma Idempotency-Key UUID ainda não usada; não reutilize a chave com outro conteúdo.

Pesquise sempre com a organização alvo como filtro obrigatório:

```bash
curl -i -X POST "$BASE/v1/admin/contacts/search" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"filters\":[{\"field\":\"uid_organization\",\"operator\":\"eq\",\"value\":\"$ORG\"}]}"
```

Consulte, substitua e remova o registro. Use o `uid` retornado no create como `CONTACT`; PUT é substituição completa dos campos e das relações:

```bash
curl -i "$BASE/v1/admin/contacts/$CONTACT?uid_organization=$ORG" \
  -H "Authorization: Bearer $TOKEN"

curl -i -X PUT "$BASE/v1/admin/contacts/$CONTACT?uid_organization=$ORG" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"link_code\":\"organization\",\"uid_link\":\"$ORG\",\"name\":\"Contato teste atualizado\",\"roles\":[\"financial\"],\"methods\":[{\"type\":\"phone\",\"value\":\"+5531998765432\",\"is_whatsapp\":true,\"is_primary\":true},{\"type\":\"email\",\"value\":\"contato.atualizado@example.test\",\"is_primary\":true}]}"
```

Esperado: GET `200` e PUT `200`. O PUT substitui os vínculos filhos; este exemplo mantém o telefone ativo para testar duplicidade entre contextos abaixo.

Crie um endereço com mais de uma finalidade e salve o `uid` retornado como `ADDRESS`:

```bash
curl -i -X POST "$BASE/v1/admin/addresses" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 1b9e90b3-2cb6-4c5e-b820-ea51bbda35d1' \
  -d "{\"link_code\":\"organization\",\"uid_link\":\"$ORG\",\"country_code\":\"BR\",\"postal_code\":\"30110-012\",\"region\":\"MG\",\"city\":\"Belo Horizonte\",\"address_line1\":\"Rua de Teste\",\"number\":\"100\",\"purposes\":[{\"code\":\"headquarters\",\"is_primary\":false},{\"code\":\"billing\",\"is_primary\":false}]}"
```

Esperado: `201 Created`, `uid_organization` resolvido e dois `purposes`. Copie o `uid` da resposta para `ADDRESS`. Pesquise com o filtro obrigatório da organização:

```bash
curl -i -X POST "$BASE/v1/admin/addresses/search" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"filters\":[{\"field\":\"uid_organization\",\"operator\":\"eq\",\"value\":\"$ORG\"}]}"
```

Consulte, atualize e exclua. Se repetir o POST de endereço como nova criação, gere outra Idempotency-Key UUID:

```bash
curl -i "$BASE/v1/admin/addresses/$ADDRESS?uid_organization=$ORG" \
  -H "Authorization: Bearer $TOKEN"

curl -i -X PUT "$BASE/v1/admin/addresses/$ADDRESS?uid_organization=$ORG" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"link_code\":\"organization\",\"uid_link\":\"$ORG\",\"country_code\":\"BR\",\"city\":\"Belo Horizonte\",\"address_line1\":\"Rua de Teste Atualizada\",\"number\":\"101\",\"purposes\":[{\"code\":\"headquarters\",\"is_primary\":false},{\"code\":\"billing\",\"is_primary\":false}]}"

curl -i -X DELETE "$BASE/v1/admin/addresses/$ADDRESS?uid_organization=$ORG" \
  -H "Authorization: Bearer $TOKEN"
```

Esperado: GET `200`, PUT `200`, DELETE `204` para o endereço. Para testar o vínculo por entity e duplicidade entre contextos, execute este POST antes de excluir o contato da organização; ele reutiliza o telefone do exemplo anterior e deve ser aceito por ser outro `link_code + uid_link`. Copie o UID da resposta para `ENTITY_CONTACT`:

```bash
curl -i -X POST "$BASE/v1/admin/contacts" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 51dd761e-bf3f-4b77-817c-bcd5a2512673' \
  -d "{\"link_code\":\"entity\",\"uid_link\":\"$ENTITY\",\"name\":\"Contato da entidade\",\"roles\":[\"technical\",\"support\"],\"methods\":[{\"type\":\"phone\",\"value\":\"+5531998765432\"}]}"
```

O retorno deve resolver `uid_organization` para `$ORG`. Uma duplicidade email/telefone no mesmo contexto deve ser rejeitada; o mesmo valor em outro contexto organization/entity é permitido.

Com o contato da organização ainda ativo, tente criar outro contato na mesma organização com o mesmo telefone; esperado `409 directory_duplicate`:

```bash
curl -i -X POST "$BASE/v1/admin/contacts" \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 614f926e-dd8d-4a4f-9387-f5295bf90748' \
  -d "{\"link_code\":\"organization\",\"uid_link\":\"$ORG\",\"name\":\"Contato duplicado\",\"methods\":[{\"type\":\"phone\",\"value\":\"+5531998765432\"}]}"
```

Finalize a limpeza lógica dos cadastros de teste:

```bash
curl -i -X DELETE "$BASE/v1/admin/contacts/$CONTACT?uid_organization=$ORG" -H "Authorization: Bearer $TOKEN"
curl -i -X DELETE "$BASE/v1/admin/contacts/$ENTITY_CONTACT?uid_organization=$ORG" -H "Authorization: Bearer $TOKEN"
curl -i -X DELETE "$BASE/v1/admin/addresses/$ADDRESS?uid_organization=$ORG" -H "Authorization: Bearer $TOKEN"
```

Cada DELETE deve retornar `204`; a busca normal não deve exibir esses registros.

Negativos essenciais: omitir o filtro/query `uid_organization` deve falhar; enviar `uid_organization` no body do POST deve falhar; tentar consultar o UUID usando outra organização alvo deve resultar em `404`; WhatsApp num método email e propósito inválido devem ser rejeitados. Registre o status e `request_id` de cada resposta. Campos, erros completos e detalhes de normalização estão em [directory_contacts_addresses.md](directory_contacts_addresses.md).

Revisão: 03/10/2026. Para ordem de instalação e upgrades, comece por [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). Este arquivo começa depois da implantação e conduz os testes HTTP/funcionais em ordem de dependência. Estado confirmado em homologação: 0067–0100 aplicadas; `migrations/tests/device_technician_self_service.sql` aprovado com `ROLLBACK` após 0100; o replay HTTP idêntico da conclusão pelo executor passou. O replay HTTP administrativo continua pendente. `go test ./internal/server` passou; `go test ./internal/filters` para antes por `permission denied for schema access` na fixture 0067 do runner. Os demais testes HTTP do pacote 0092–0100 permanecem pendentes.

### Logs estruturados da API

`config.json` controla separadamente `log.access` e `log.error`; cada destino pode ativar arquivo e/ou stdout. Caminhos relativos partem da pasta do arquivo de configuração. `file_path` é o nome-base; o processo acrescenta o hostname antes da extensão, então `data/logs/access.log` vira `data/logs/access-<HOST>.log` e o error vira `error-<HOST>.log`. `-check-config` verifica a capacidade de abrir os arquivos específicos do host. A mesma política `max_size_mb`, `max_age_days`, `max_backups` e `compress` é usada pelos dois arquivos.

Após alterar a configuração ou os logs, valide localmente com:

```powershell
$env:GOCACHE='.cache-go'
go test -count=1 ./internal/logging ./internal/config ./internal/server ./internal/platform
go vet ./internal/logging ./internal/config ./internal/server ./internal/platform
```

Confirme em cada destino JSON Lines e o campo `host`. Para forçar rotação sem alterar a configuração operacional, use uma cópia local com `max_size_mb=1`, gere mais de 1 MiB de linhas válidas e confirme `access-<HOST>-<timestamp>.log.gz` (quando `compress=true`) e o ativo `access-<HOST>.log`; repita para error, sem atingir o limite no outro fluxo. A rotação é por tamanho: `max_age_days` só remove backups antigos, não dispara rotação por tempo. Confirme também máximo de backups, gzip e append após reinício. O error log deve compartilhar `request_id` com o access log em 5xx; erros de domínio 4xx não são falhas técnicas. Esta etapa não envia logs a VictoriaLogs.

Os manuais de cada recurso contêm variações e erros adicionais; a sequência única abaixo é a ordem operacional. Para provisionamento de organizações após 0062, aplique também 0065; para validar a ordem do erro no PUT de usuários, confirme a 0066. A 0067 foi aplicada em homologação. 0070 dá visibilidade de validação a entity ao papel interno NOLOGIN. 0071 corrige o filtro de soft-delete da policy operacional de assets e mantém a policy restritiva de lifecycle. 0072 mantém a visibilidade administrativa de usuário inativo apenas dentro de `users.admin_save()`; a regressão SQL passou, e os testes HTTP desse caso ainda precisam ser executados.

## Ordem única de execução

Siga esta lista de cima para baixo. Os títulos `Fase 10`, `Fase 15` e `Fase 16` mantêm os números antigos dos módulos; **não** indicam a ordem. Aqui está a ordem real para homologar sem voltar páginas:

| Passo | Faça nesta ordem | O que precisa guardar para continuar |
|---|---|---|
| 1 | Fases 0–1: confira instalação/configuração, suba a API e prepare Autoscale/Primary. | `primaryToken`, `uidAutoscale`, `uidPrimary` |
| 2 | Fase 2: login, status/SSE, logout e troca de senha. | Token atual; confirme sessão revogada antes de seguir. |
| 3 | Fases 3–4: cadastros padrão, situações e billing. | `uidBilling` e IDs dos defaults criados. |
| 4 | Fase 5: crie e confira a organização cliente. | `uidCustomerOrganization` |
| 5 | Fase 6, itens 6.1–6.6: Secondary, autorização explícita da revenda, suporte, carteira, isolamento e política de sessões. **Pule o Basic por enquanto.** | `secondaryToken`, `resellerToken`, `resellerPeerToken`, UUIDs das organizações e usuários. |
| 6 | Fase 7: entidades, tipos e fuso. | `uidEntity` |
| 7 | Fase 8: catálogos de asset e device. | UUIDs de tipos, fabricantes e modelos necessários. |
| 8 | Fase 9: unidades, grupos e assets. | `uidAsset`, `uidUnit`, `uidGroup` |
| 9 | Retomada do item 6.7: após 0067, use `organization → entities[]` e valide OR dentro dos arrays / AND entre dimensions. | `uidBasic`, `basicToken`; preserve os UUIDs usados nos scopes. |
| 10 | Fase 15: motoristas, habilitações e exames. | Um motorista/técnico para as ordens de serviço. |
| 11 | Fase 10: inventário de devices, SIM, vínculo, transferência, slots e histórico. | `uidDevice`, `uidSIM`, asset com slots disponíveis. |
| 12 | Fase 16: instalação, retirada, substituição, custódia e OS. | Histórico do asset e devices devolvidos ao estoque. |
| 13 | Fase 11: pontos, cercas e rotas. | UUIDs dos pontos/cercas/rotas usados pelos eventos. |
| 14 | Fase 12: modelos, regras, suspensão, relatórios e ocorrências. | UUIDs das regras e alvos; lembre que o processador de eventos está pendente. |
| 15 | Fases 13–14: filtros, auditoria, falhas e testes automatizados. | `request_id` e resultados; não grave tokens/segredos. |
| 16 | Depois da sequência: branding/login, recuperação/verificação e ciclo de vida. | Use as contas e dados preparados acima; respeite bloqueios indicados em cada seção. |

Antes dos passos HTTP, siga [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) e confirme as versões registradas. 0067–0072 estão aplicadas na homologação compartilhada; `profile_scopes.sql` passou com `ROLLBACK`, incluindo regressões da 0072. Não reaplique migrations `.up.sql` diretamente. O wrapper e a suite SQL reproduzível são:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_user_scopes.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/profile_scopes.sql
```

Como 0072 já foi aplicada e a prova SQL passou, não reaplique o wrapper agora; mantenha o primeiro comando apenas para instalações/ambientes ainda pendentes. Os testes HTTP específicos para criar e editar Basic desabilitado continuam pendentes. O reset opcional `migrations/development_reset_user_scopes.sql` limpa grants/membership de uma conta não-Primary, exige UID e confirmação e não foi executado. “Esperado” é critério de aceite, não prova de execução. Posições, consumer de notificações, execução financeira e purge continuam fora desta homologação.

## Como registrar a execução

Para cada caso, anote ambiente, data, ator, método/URL, corpo sem segredos, HTTP/resposta, `request_id` e resultado. Use estes estados:

- `[ ]` não executado;
- `[x]` aprovado;
- `[!]` falhou, com o primeiro erro;
- `[-]` não aplicável ou bloqueado por funcionalidade pendente.

Variáveis sugeridas no Insomnia:

```json
{
  "baseURL": "http://127.0.0.1:8080",
  "primaryLogin": "admin.autoscale",
  "primaryToken": "",
  "uidAutoscale": "",
  "uidPrimary": "",
  "uidBilling": "c0320000-0000-4000-8000-000000000001",
  "uidBillingTest": "",
  "uidCustomerOrganization": "",
  "uidCustomerLogo": "",
  "uidEntity": "",
  "uidAsset": "",
  "uidDevice": "",
  "uidSIM": "",
  "secondaryToken": "",
  "resellerToken": "",
  "resellerPeerToken": "",
  "basicToken": "",
  "tokenA": "",
  "tokenB": "",
  "uidCustomerSupport": "",
  "uidSecondary": "",
  "uidResellerOrganization": "",
  "uidResellerSupport": "",
  "uidResellerUser": "",
  "uidResellerPeer": "",
  "uidResellerCustomerOrganization": "",
  "uidBasic": ""
}
```

Nunca grave a senha ou token neste arquivo nem no Git.

## Fase 0 — banco e backend

- [ ] Se precisar manipular o banco via EMS, criar `autoscale_ems_admin` conforme [database_access.md](database_access.md), sem alterar `autoscale_us`.
- [ ] Seguir [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) e terminar os upgrades necessários antes de começar esta fase. Não aplicar migrations no meio do roteiro funcional.
- [ ] Copiar `settings/filters.json` atualizado.
- [ ] Validar configuração: `go run ./cmd/navisoft -config config.json -check-config`.
- [ ] Iniciar API e confirmar `/v1/health` e `/v1/health/ready`.
- [ ] Com token temporário contendo `health:read`, consultar `GET /v1/health/details`; sem token esperado 401, sem permissão 403. Conferir runtime, memória/GC, processo quando suportado, pools disponíveis e ausência de credenciais/DSN. FIPE, Knowledge, RabbitMQ e `redis_cache_api` são opcionais; suas indisponibilidades não mudam readiness Core. Cache FIPE/Knowledge/Redis API podem mostrar `status=down` na dependência e `status=degraded` no detalhe, com HTTP 200 e readiness HTTP 200/status `up`. Para tablecache, conferir também `table_cache_ready`; `false` significa bypass para PostgreSQL. Falha de PostgreSQL ou outra dependência crítica habilitada deve dar `status=down` e HTTP 503 no detalhe.
- [ ] Confirmar no `common.schema_migrations` as versões exigidas pelas fases selecionadas. Na homologação compartilhada, 0067–0072 estão aplicadas e `profile_scopes.sql` passou com `ROLLBACK`:

```bash
psql -d autoscale_nvs_db -c "SELECT version,applied_at FROM common.schema_migrations WHERE version BETWEEN '0066' AND '0072' ORDER BY version;"
```

Compare a saída com a tabela de migrations do [guia de implantação](DEPLOYMENT_GUIDE.md); versões não precisam ser contínuas quando o conjunto não se aplica, mas todo pré-requisito precisa estar registrado. O consumidor de notificações e o processador de eventos continuam fora desta homologação.

`/v1/health` é liveness público e barato; `/v1/health/ready` é readiness público do Core. Para o diagnóstico protegido, use o token temporário de configuração que tenha `health:read`:

```bash
curl -i "$BASE/v1/health/details" -H "Authorization: Bearer $HEALTH_TOKEN"
curl -i "$BASE/v1/health/ready"
```

O detalhe responde `200` com `up` ou `degraded`, e `503` somente com `down`; cada dependência informa `enabled`, `critical`, `status`, latência quando verificada, pools quando disponíveis e código de erro sanitizado. Dependência desativada aparece como `disabled`. `/v1/admin/health` é a rota legada protegida e mantém seu formato simplificado.

## Fase 1 — raiz Autoscale e Primary

Em instalação de desenvolvimento sem Autoscale, execute uma vez:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/bootstrap_autoscale_development.sql
```

O script cria ou valida:

- planos fictícios `demo_postpaid` e `demo_prepaid`, com faixas 1–10, 11–30 e 31–50, quando estiverem ausentes;
- organização `autoscale`, única `is_ultra_master=true`;
- usuário `admin.autoscale`, perfil `primary_admin`, owner e pertencimento Autoscale;
- `organizations_access=all` e nenhum registro em `access.scopes`;
- nenhuma senha automática.

Não use `migrations/examples/identity.sql` em instalações novas: ele é uma fixture antiga. Para bancos de desenvolvimento que já a utilizaram, o bootstrap reconhece somente o Primary legado exato (`admin`, UUID reservado, Autoscale/Autoscale, perfil Primary e acesso `all`) e o converte para `admin.autoscale`, preservando a senha e o mesmo UUID. Qualquer outra colisão continua bloqueada.

Inicialize a primeira senha pela entrada padrão:

```bash
go run ./cmd/password-init -config config.json -uid b0000000-0000-4000-8000-000000000001
```

- [ ] Bootstrap concluiu sem alterar conta existente incompatível.
- [ ] `password-init` informou sucesso.
- [ ] Repetir `password-init` foi recusado, pois não é reset.

Para redefinir uma senha já inicializada exclusivamente na configuração de desenvolvimento (`"mode":"developer"`), use `go run ./cmd/password-init -config config.json -uid UUID_DO_USUARIO --recover` e digite a senha nova pela entrada padrão. `--recover` é recusado em `mode: production`; a opção não recupera senha nem envia email. A troca respeita política/histórico e invalida sessões. Detalhes em [users.md](users.md#redefinir-uma-senha-em-desenvolvimento).

## Fase 2 — login, status, SSE, logout e senha

### 2.1 — login e token fixo durante o teste

Organize a pasta **Users** no Insomnia com Login Primary, Status, Status SSE, Logout e Change Password. Os exemplos deste guia são para importar no Insomnia; no terminal substitua as variáveis `{{ _.nome }}` pelos valores reais e, no PowerShell, use `curl.exe`.

```bash
curl --request POST '{{ _.baseURL }}/v1/users/login' \
  --header 'Content-Type: application/json' \
  --data '{"identifier":"admin.autoscale","password":"SENHA_DIGITADA"}'
```

O corpo de login aceita `identifier` (obrigatório: login, email ou telefone), `password` (obrigatório) e `country` (opcional: país do telefone em código ISO de duas letras; padrão `BR`). Neste exemplo, use nome de usuário e senha. Para testar telefone brasileiro, use `{"identifier":"11987654321","password":"SENHA_DIGITADA","country":"BR"}`. O contrato completo está em [login.md](login.md#campos-e-preparacao-no-insomnia).

Esperado **200**. Copie `session.token` para `primaryToken`. O usuário informa somente `identifier=admin.autoscale`; `organization.code=autoscale` volta na resposta, resolvido pelo servidor. Login não exige Authorization nem Idempotency-Key. Confira `session.expires_at`, `session.authenticated_at`, `session.previous_login_at`, `organization.uid`, `organization.name` e `organization.branding.logo_url` quando houver logo. No primeiro acesso histórico, `session.previous_login_at` é `null`; no segundo login válido, deve conter o horário do primeiro. Uma senha errada não deve mudar esses dois horários.

Use uma variável separada para cada conta: primaryToken, secondaryToken, resellerToken, resellerPeerToken e basicToken. Se usar Response → Body Attribute, selecione a resposta do login correto, atributo `session.token`, e **Never Resend**. Always pode executar outro login antes da consulta e esconder a revogação do token anterior. Um script After-response é opcional nas versões que o oferecem; não é pré-requisito. Nunca sobrescreva o token de outro perfil.

### 2.2 — consultar status

```bash
curl --request GET '{{ _.baseURL }}/v1/users/status' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **200**, authenticated=true, state=active, relogin_required=false. Guarde uid_user em uidPrimary, uid_organization em uidAutoscale e anote uid_session. Os campos de access_period informam admissão por horário; não concedem permissão de dados. Não compare apenas uid_user: dois logins da mesma pessoa têm sessões distintas.

### 2.3 — abrir SSE (Server-Sent Events)

SSE é um GET que fica aberto recebendo eventos. Não é uma busca que termina depois da primeira resposta. Mantenha o mesmo token do Status:

```bash
curl --request GET '{{ _.baseURL }}/v1/users/status/stream' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Accept: text/event-stream' --no-buffer
```

Esperado **200**, Content-Type text/event-stream, seguido de `id`, `event` e `data`, separados por linha vazia. O primeiro evento é `status`; seu JSON contém os mesmos campos da consulta normal. A conexão continua aberta.

| Evento | O que o integrador faz |
|---|---|
| status | Ler o JSON de data e atualizar a sessão. Se authenticated=false ou relogin_required=true, encerrar o canal e exigir novo login. |
| heartbeat | Sinal de conexão viva, com time. Não representa novo login nem renovação do token. |
| reconnect | reason=max_duration: abrir outro canal com o token ainda válido. |
| temporary_error | Falha temporária de revalidação; não interpretar como autorização renovada. O servidor tentará novamente. |

O exemplo de configuração usa auth.status_stream.enabled=true, heartbeat=20s, revalidate=30s, max_duration=30m e max_connections_per_user=3. Confira os valores do ambiente. O limite de conexões é contado nesta instância da API; não é um limite global Redis entre servidores. O id é sequencial por conexão; não é cursor durável e não há replay via Last-Event-ID. Esse stream acompanha sessão, não posições nem alertas de veículos.

No Insomnia, crie uma requisição Event Stream/GET quando disponível, configure Bearer e confira na Timeline se **Authorization foi realmente enviado**. Em versões antigas em que Status funciona e SSE dá 401 sem esse header na Timeline, use o curl acima como diagnóstico. Não coloque o token na URL. No navegador use fetch com Authorization e leitura do body em streaming; EventSource nativo não permite esse header. Manual técnico: [login.md](login.md#status-em-tempo-real-por-sse).

### 2.4 — revogar exatamente a sessão acompanhada

Deixe SSE aberto e execute em outra requisição, sem refazer login:

```bash
curl --request POST '{{ _.baseURL }}/v1/users/logout' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **204**, sem JSON. X-Revoked-Session deve ser igual ao uid_session anotado no Status. O SSE recebe estado final sem autenticação e encerra; a invalidação local/Redis antecipa a atualização, e a revalidação periódica é fallback. Se uma dependência falhar, registre o erro em vez de presumir encerramento instantâneo.

Repita Status, SSE e GET /v1/admin/organizations com **o mesmo token revogado**: esperado 401. Para SSE esse 401 ocorre antes de abrir o canal. Uma resposta 204 não deve ser convertida em JSON ou data pela interface. Para expires_at vazio ou data sentinela, mostre “sessão encerrada”; não tente formatar uma data inválida.

Se uid_session mudou, houve novo login ou você usou outro token. Com política concorrente habilitada, logout não derruba o outro login. Volte ao 2.1 e atualize primaryToken antes de continuar.

### 2.5 — trocar senha conscientemente

```bash
curl --request PUT '{{ _.baseURL }}/v1/users/password' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"current_password":"SENHA_ATUAL","new_password":"NOVA_SENHA_CONFORME_POLITICA"}'
```

Esperado **200**, com changed=true e relogin_required=true; sessões anteriores são invalidadas. Faça login com a nova senha e atualize a variável. Senha incorreta: 401; senha fora da política ou reutilizada: 422. Não use esse teste sem guardar a nova senha no seu gerenciador local.

### 2.6 — critérios de aprovação

- [ ] Credencial errada retorna 401; token técnico/ausente não autentica CRUD.
- [ ] Status e SSE inicial apontam para a mesma sessão.
- [ ] Logout revoga essa sessão, com 401 nas chamadas posteriores e encerramento do SSE.
- [ ] Com limite de três canais configurado, a quarta conexão desse usuário na mesma instância retorna 429 status_stream_limit_reached. Feche os canais de teste.
- [ ] Stream desabilitado não fica disponível; não confundir ausência da rota com token inválido.
- [ ] Novo login explícito permite retomar o roteiro. Concorrência por organização será testada em 6.6 usando contas descartáveis.

### 2.7 — Identity 1: Application Gate e vínculos

Execute com uma conta de teste com credenciais válidas. Nesta versão, o catálogo contém somente `navisoft`; não há sessão HTTP válida de outro aplicativo para exercitar o middleware até que outro produto seja adicionado.

**I1-01 — login sem `application`:**

```bash
curl --request POST '{{ _.baseURL }}/v1/users/login' \
  --header 'Content-Type: application/json' \
  --data '{"identifier":"admin.autoscale","password":"SENHA_DIGITADA"}'
```

Esperado **200** e `session.application="navisoft"`. Salve o token como `primaryToken`.

**I1-02 — login explícito:** repita com `"application":"navisoft"`; esperado **200** e o mesmo campo.

**I1-03 — aplicação não admitida:** com senha correta, use `"application":"nao-cadastrada"`; esperado **403 `application_access_denied`**. Se a política da organização desabilita sessões simultâneas, confirme que o token salvo continua autenticado em Status. O PostgreSQL deve negar antes de revogar sessões, consumir exceção de acesso ou atualizar o histórico.

**I1-04 — credencial errada:** use uma senha errada e `"application":"nao-cadastrada"`; esperado **401 `invalid_credentials`**, sem indicação de aplicação. Campo `organization_code` ou qualquer campo desconhecido deve retornar **400 `invalid_request`** sem chamar o serviço de login.

**I1-05 — status e SSE:** consulte `GET /v1/users/status` com `primaryToken`; esperado `application="navisoft"` no nível superior. Abra `/v1/users/status/stream`; o evento inicial `status` também contém o campo.

**I1-06 — aplicações do usuário:** usando Primary e um `targetUserUid` descartável com senha conhecida, consulte e substitua o conjunto:

```http
GET {{ _.baseURL }}/v1/admin/users/{{ _.targetUserUid }}/applications
Authorization: Bearer {{ _.primaryToken }}
```

Esperado **200** com a lista atual. Em seguida faça replacement vazio:

```http
PUT {{ _.baseURL }}/v1/admin/users/{{ _.targetUserUid }}/applications
Authorization: Bearer {{ _.primaryToken }}
Content-Type: application/json

{"applications":[]}
```

Esperado **200** e lista vazia. Tente login válido do usuário alvo: esperado **403 `application_access_denied`**. Restaure imediatamente com `PUT {"applications":["navisoft"]}`; novo login deve funcionar, enquanto uma sessão revogada antes da restauração continua revogada. `PUT {"applications":["nao-cadastrada"]}` deve retornar **422 `invalid_application_set`**. Campos extra como `profile`/`scopes` retornam **400**. Ator não Primary recebe **403**; as funções SQL também impõem esse limite independentemente do middleware.

Os testes Go cobrem a rejeição pelo middleware, Status e SSE de uma sessão válida de outro app, antes da autorização de área. Como a 0124 só cadastra `navisoft`, essa sessão não pode ser emitida no HTTP real neste momento. A migration 0124 e as regressões SQL de Identity 1/lifecycle foram confirmadas pelo operador no PostgreSQL real; esta seção é a bateria de homologação HTTP do código Go.

### Identity Session Fast Path e runtime Redis — 0162/0163 aplicadas; migration corretiva 0164 preparada

O operador confirmou 0162 aplicada, medida e `migrations/tests/identity_session_validation.sql` aprovada com `ROLLBACK`; também confirmou 0163 aplicada e `migrations/tests/identity_session_runtime.sql` aprovada. Não reaplicar migrations nem repetir essas regressões PostgreSQL. Os seis cenários de runtime anteriores (HIT, fallback, logout, sessões concorrentes e transição de período) já foram homologados antes desta finalização; a lista abaixo verifica somente o prime/fencing atualizado e compatibilidade necessária.

O runtime utiliza `redis_cache_user_tokens`, chaves por ambiente/versão/digest e `navisoft:session-events`. A rota protegida faz um único Redis `EVAL` no HIT, sem chamada a `users.session_validate_strict()`. MISS, revalidação temporal, listener não sincronizado ou erro Redis continuam pelo PostgreSQL estrito. `pending_mfa` não é primada nem aceita como HIT normal. O idle online é controlado no Redis e persistido em lote por `users.session_runtime_touch()`. Status e SSE mantêm o caminho/payload rico atual.

Mutação de segurança da API estabelece fence Redis antes da operação PostgreSQL; a resposta fica em buffer até invalidação/liberação do fence. Falha de fence retorna 503 `session_runtime_fence_unavailable`. NOTIFY/triggers da 0163 continuam como reconciliação para SQL externo. Redis indisponível não aceita cache local: requests fazem strict fallback e mutações críticas falham fechadas. `prime_failures` registra falha best-effort de aquecimento sem rejeitar uma sessão ativa confirmada no PostgreSQL.

`go test -count=1 ./internal/sessionruntime ./internal/users ./internal/server`, `go vet ./...`, `go build -buildvcs=false ./...` e `go run ./cmd/navisoft -config config.json -check-config` passaram. `go test -count=1 ./...` falhou somente no teste cumulativo PGlite existente de `internal/filters` com `permission denied for schema access`; os demais pacotes passaram. Não foi executado PostgreSQL real. A homologação manual desta alteração começa somente pelo T1 abaixo. Execute um teste por vez e pare para conferir evidências antes de seguir.

Durante o T1 operacional, o log revelou que a persistência periódica do `last_seen_at` tentava escanear o boolean OID 16 de `session_runtime_touch()` como JSON binário. A consulta Go foi corrigida para converter o boolean em JSON antes do scanner comum. Testes locais de `internal/users`, `internal/sessionruntime` e `internal/platform` passaram após a correção. O T1 precisa ser repetido com o binário novo; confirmar que os erros `cannot scan bool (OID 16)` cessaram e que o touch continua persistindo. Nenhuma migration/regressão PostgreSQL deve ser repetida.

A homologação subsequente confirmou outro defeito: após login sem MFA, `primes` continuava em 0 e a primeira rota protegida incrementava `fallbacks`/`strict_loads`, só então primando a sessão. A causa era a invalidação ampla da 0163: login atualiza metadados neutros em `users.users`, e o sincronizador de lifecycle podia atualizar um registro sem alterar seu estado; os dois eventos competiam com o strict load pós-login e impediam o prime seguro. A migration 0164 está preparada, sem execução, para ignorar apenas essas mudanças neutras. Após aplicá-la, rode a regressão `migrations/tests/identity_session_runtime_login_prime.sql` com `ROLLBACK`, e então execute o teste HTTP T1 abaixo.

Aplicação pelo operador, somente depois de revisar a migration:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_session_runtime.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/identity_session_runtime_login_prime.sql
```

**T1 — validar prime no login:** registre baseline de `/v1/health/details`; faça login sem MFA e confirme `primes` incrementado antes de outra rota. Em seguida faça `GET /v1/users/profile` com o token recém-emitido: deve retornar 200, `hits` deve subir e `fallbacks`/`strict_loads` devem permanecer iguais aos valores logo após login. Se qualquer um destes últimos subir, pare: o runtime ainda não comprovou o prime no login.

**T1 — login ativo primado antes da primeira rota protegida**

1. Em `/v1/health/details`, anote `session_runtime_ready`, `primes`, `hits`, `fallbacks` e `strict_loads`.
2. Faça login de uma conta sem MFA requerido, com Redis saudável e runtime pronto. O contrato HTTP do login permanece inalterado. Antes de chamar outra rota, confirme que `primes` aumentou.
3. Faça a primeira chamada protegida com o Bearer recém-retornado, por exemplo `GET /v1/users/profile`. Esperado 200; `hits` aumenta e `fallbacks`/`strict_loads` ficam iguais ao valor anotado. Consultas de área/dados posteriores não são parte da medição do gate de sessão.

Não copie o Bearer para logs/transcripts compartilhados. Depois de registrar T1, confira o resultado antes de executar T2.

**Próximos testes desta finalização, execute somente depois de conferir T1:**

2. **MFA:** login retorna `pending_mfa` sem incremento de `primes` nem HIT normal; após confirmar o mesmo desafio/sessão, `primes` aumenta e a primeira rota protegida ativa é HIT.
3. **Prime com Redis indisponível:** para usuário sem revogação de sessão anterior, login PostgreSQL válido continua sucesso; `prime_failures` aumenta; request protegida faz strict fallback e incrementa `fallbacks`/`strict_loads`. Não parar Redis compartilhado sem janela de impacto planejada.
4. **Logout com fence:** com snapshot já primado, logout retorna 204; imediatamente depois o token retorna 401, mesmo sem depender do listener assíncrono.
5. **`allow_concurrent_sessions=false`:** depois de login B retornar sucesso, token A retorna 401 e B continua válido.
6. **Limite de período — evidência anterior mantida:** já homologado antes desta finalização (200 antes da borda; 403 `outside_access_period` depois, sessão autenticada). Não repetir nesta bateria, salvo se T1–T5 revelar regressão temporal.
7. **Rollback:** force uma mutação de segurança a falhar após a invalidação antecipada; a transação PostgreSQL não deixa estado parcial e a próxima request reconstrói pelo estado antigo via strict loader. Um MISS extra é aceitável.
8. **Redis indisponível no runtime — evidência anterior mantida:** já homologado antes desta finalização (`session_runtime_ready=false`, strict PostgreSQL fallback, sem cache local). O novo T3 cobre especificamente falha no prime do login; não parar Redis compartilhado para repetir o cenário antigo.

`/v1/health/details` expõe `session_runtime_metrics`: `hits`, `fallbacks`, `strict_loads`, `primes`, `prime_failures` e `access_revalidations`. Registre separadamente: migrations/regressões PostgreSQL já confirmadas, testes Go locais, build/config check e cada resultado HTTP novo. Não há transação distribuída PG/Redis; fences cobrem mutações da API enquanto Redis está disponível e dentro do lease, não cancelam requests que já passaram pelo gate, e SQL direto externo continua sendo reconciliado por NOTIFY/listener.

## Fase 3 — defaults obrigatórios

Primeiro valide o que as migrations já criaram; não duplique defaults pela API.

```bash
psql -d autoscale_nvs_db -c "SELECT code,name,enabled,operational,locked FROM common.situations ORDER BY code;"
psql -d autoscale_nvs_db -c "SELECT code,name,billing_mode,active FROM organizations.billing_plans ORDER BY code;"
psql -d autoscale_nvs_db -c "SELECT name,active FROM assets.fuels ORDER BY name;"
psql -d autoscale_nvs_db -c "SELECT name,active FROM assets.voltages ORDER BY name;"
psql -d autoscale_nvs_db -c "SELECT code,name,fixed,periodic,active FROM events.models ORDER BY code;"
psql -d autoscale_nvs_db -c "SELECT code,name,is_system,active FROM entities.types WHERE uid_organization=(SELECT uid FROM organizations.organizations WHERE code='autoscale') ORDER BY code;"
```

- [ ] Situação `active` existe e está protegida.
- [ ] Planos `demo_postpaid` e `demo_prepaid` têm faixas fictícias.
- [ ] Combustíveis e tensões foram inseridos.
- [ ] Modelos padrão de eventos existem.
- [ ] Toda organização possui os tipos protegidos `customer` e `technician`.
- [ ] `GET /v1/admin/common/timezones` contém `America/Sao_Paulo`.

Para validar filtros pelo HTTP:

```bash
curl '{{ _.baseURL }}/v1/admin/assets/fuels?q=Diesel' --header 'Authorization: Bearer {{ _.primaryToken }}'
curl '{{ _.baseURL }}/v1/admin/assets/voltages?q=220' --header 'Authorization: Bearer {{ _.primaryToken }}'
curl --request POST '{{ _.baseURL }}/v1/admin/events/models/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"filters":[{"field":"category","operator":"eq","value":"mechanical"}]}'
```

## Fase 4 — situações e plano de cobrança

Crie uma situação de homologação:

```bash
curl --header 'Idempotency-Key: c878163a-3cfe-5fe2-a058-f762ffc24271' --request POST '{{ _.baseURL }}/v1/admin/situations' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"code":"test_blocked","name":"Bloqueado para homologação","enabled":true,"operational":true,"locked":true,"applies_to_all":false,"scopes":["entities","assets"]}'
```

O plano `demo_postpaid`, identificado por `uidBilling`, veio do bootstrap da Fase 1 e serve como default estável para organizações. O CRUD legado foi homologado com o plano descartável abaixo, que **já existe**; não repita o POST de criação neste roteiro.

```bash
curl '{{ _.baseURL }}/v1/admin/billing-plans/f09747d2-7d11-404f-8c59-c359460633c1' --header 'Authorization: Bearer {{ _.primaryToken }}'
curl '{{ _.baseURL }}/v1/admin/billing-plans/f09747d2-7d11-404f-8c59-c359460633c1/quote?quantity=50' --header 'Authorization: Bearer {{ _.primaryToken }}'
```

UID `f09747d2-7d11-404f-8c59-c359460633c1`, code `homologacao_progressivo`, versão `05aca161-91a9-4c1e-9f94-bba0e6fa578b`; resposta 201/replay e conflitos de idempotência/code estão registrados como aprovados acima. O plano possui tiers contínuos 1..10 a 1000, 11..30 a 800 e 31..50 a 700 centavos por unidade.

Payload usado na criação homologada:

```json
{
  "code": "homologacao_progressivo",
  "name": "Homologação progressiva",
  "description": "Plano descartável do roteiro de testes",
  "billing_mode": "postpaid",
  "unit_label": "ativo",
  "active": true,
  "tiers": [
    {"quantity_from": 1, "quantity_to": 10, "unit_price_cents": 1000},
    {"quantity_from": 11, "quantity_to": 30, "unit_price_cents": 800},
    {"quantity_from": 31, "quantity_to": 50, "unit_price_cents": 700}
  ]
}
```

- [ ] Situação criada, pesquisável, atualizável e removível quando não usada.
- [ ] GET de UUID válido inexistente (ou excluído) retorna **404 `situation_not_found`**; UUID malformado retorna erro de validação, e 503 fica reservado para falha real de storage.
- [ ] Tentar desabilitar, bloquear, restringir ou excluir o seed `active` falha.
- [x] **Homologado por HTTP:** POST do plano com chave nova retorna 201; retry de mesma chave/corpo retorna 200 `replayed:true`; mesma chave com corpo diferente retorna 409 `idempotency_conflict`; chave nova com `code` já cadastrado retorna 409 `billing_code_exists`.
- [x] Plano descartável criado: `homologacao_progressivo`, UID `f09747d2-7d11-404f-8c59-c359460633c1`, versão corrente `05aca161-91a9-4c1e-9f94-bba0e6fa578b`.
- [x] **Homologado manualmente** no plano `demo_postpaid` (`c0320000-0000-4000-8000-000000000001`): quote retorna HTTP 200 e `total_cents` 1000 para quantity=1, 10000 para 10, 10800 para 11, 26000 para 30, 26700 para 31 e 40000 para 50.
- [x] **Homologado por HTTP:** GET do plano descartável retorna o plano/tiers criados; quote quantity=50 retorna `40000` centavos pela progressão 10×1000 + 20×800 + 20×700.
- [x] **Homologado por HTTP:** tiers com gap (`1..10`, `12..30`) e overlap (`1..10`, `10..30`) retornam 422 `invalid_billing_data`; os planos inválidos não aparecem na listagem e o plano íntegro permanece.

O create acima é histórico, não um passo a repetir: o plano já existe. Não reutilize a antiga chave fixa `f5d99dd4-a021-5db5-93ea-05889df41a3c`; ela possui receipt de criação associado a um plano antigo removido. Replays revalidam visibilidade e podem retornar `404 billing_not_found` se o recurso do receipt não existir. Isso é comportamento previsto, não falha de idempotência.

### Homologação HTTP do quote — contrato e casos aprovados

Rota: `GET /v1/admin/billing-plans/{uid}/quote?quantity={inteiro}`. Exige Bearer autenticado e retorna `Cache-Control: private, no-store`. A autorização efetiva é SQL: Primary pode cotar qualquer plano; para non-Primary, `organizations.can_read_billing_plan()` exige uma organização que use o plano e `is_secondary_for_organization()` ou `can_manage_admin()` verdadeiro para ela. Basic sem essa autorização recebe 403 `billing_not_allowed`. O plano inativo não é bloqueado pela cotação: para ator autorizado, ela continua calculada se houver cobertura de tier.

O handler aceita um único `quantity` como inteiro decimal, obrigatório, de 0 a 1.000.000.000 inclusive. Ausente, repetido, negativo, fracionário ou não numérico é rejeitado antes da consulta SQL. O quote é simulação e não gera cobrança.

| Estado | Método e URL | Status/body esperado | Evidência |
|---|---|---|---|
| Aprovado | `GET /v1/admin/billing-plans/c0320000-0000-4000-8000-000000000001/quote?quantity=1` | 200; `total_cents: 1000` | Homologado manualmente |
| Aprovado | Mesmo GET com `quantity=10` | 200; `total_cents: 10000` | Homologado manualmente |
| Aprovado | Mesmo GET com `quantity=11` | 200; `total_cents: 10800` | Homologado manualmente |
| Aprovado | Mesmo GET com `quantity=30` | 200; `total_cents: 26000` | Homologado manualmente |
| Aprovado | Mesmo GET com `quantity=31` | 200; `total_cents: 26700` | Homologado manualmente |
| Aprovado | Mesmo GET com `quantity=50` | 200; `total_cents: 40000` | Homologado manualmente |
| Aprovado | `quantity` ausente, `-1`, `1.5` ou `abc` | 422 `{"message":"invalid_quantity"}` | Homologado manualmente |
| Aprovado | `quantity=1&quantity=2` | 422 `{"message":"invalid_quantity"}` | Homologado manualmente |
| Aprovado | `quantity=0` | 200; `total_cents: 0` | Homologado manualmente |
| Aprovado | `quantity=1000000001` | 422 `{"message":"invalid_quantity"}` | Acima do limite sintático; homologado manualmente |
| Aprovado | `quantity=1000000000` no `demo_postpaid` | 422 `{"message":"invalid_billing_data"}` | Inteiro dentro do limite, mas sem tier cobrindo a quantidade; homologado manualmente |
| Aprovado | UUID malformado no path | 422 `{"message":"invalid_billing_uid"}` | Homologado manualmente |
| Aprovado | UUID válido inexistente, com token Primary | 404 `{"message":"billing_not_found"}` | Homologado manualmente |
| Aprovado | `quantity=51` no `demo_postpaid` | 422 `{"message":"invalid_billing_data"}` | SQL `quantity_outside_billing_tiers` é normalizado pelo mapper; homologado manualmente |
| Aprovado | Basic `091e62c3-75c1-432c-93e4-4a0134174efd` no `demo_postpaid` | 403 `{"message":"billing_not_allowed"}` | Repetido após recompilar/reiniciar; `Cache-Control: private, no-store` presente |
| Aprovado | Secondary da `empresa-teste` no plano usado pela organização | 200; quote de quantity=1 com `total_cents: 1000` | Ramo positivo homologado manualmente |
| Aprovado | Plano inativo `homologacao_inativo` (`4f3a581c-967f-48e1-abcd-0178cd124eac`), Primary, quantity=1 | 200; `total_cents: 1000` | Plano `active=false`, tier 1..10 a 1000; homologado manualmente |
| Aprovado | Mesmo plano inativo, Secondary da `empresa-teste` que não o utiliza | 403 `{"message":"billing_not_allowed"}` | Inatividade não amplia autorização; homologado manualmente |

Use Primary para os casos de plano malformado/inexistente e quantidades; use as contas explicitamente indicadas para autorização. Resposta de sucesso tem o envelope `{ "uid_billing_plan": "...", "quantity": N, "currency": "BRL", "total_cents": N, "billing_mode": "postpaid", "simulation": true }`. As mensagens de erro acima são as respostas públicas `message` do Echo. A regressão SQL `migrations/tests/billing.sql` e os testes Go são evidências distintas da homologação HTTP.

**PB53 — histórico e conclusão:** o operador observou um 200 inesperado para o Basic, apesar dos controles de sessão, perfil, SQL direto com `navisoft_auth`, platform capabilities e GET individual do plano negarem corretamente. A causa daquele 200 não foi comprovada; cache/instância anterior eram hipóteses, não conclusão. Foi adicionada proteção `Cache-Control: private, no-store` aos GET de billing. Após recompilar/reiniciar a API, o mesmo quote com Basic retornou 403 `billing_not_allowed`. O reteste final está aprovado; não registrar “o problema era cache”.

## Fase 5 — organização cliente com menor poder

“Menor poder” é definido pelo **perfil e pelos vínculos dos usuários**, não por um campo de privilégio enviado no cadastro da organização. Organização não recebe profile_code nem all. A Autoscale é a raiz global; uma organização cliente comum nasce com administrador Secondary, que administra entidades e frota autorizadas, mas não cria organizações.

### 5.1 — criar o cliente como Primary

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/organizations' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: f0000000-0000-4000-8000-000000000101' \
  --header 'Content-Type: application/json' \
  --data '{"code":"empresa-teste","name":"Empresa-Teste","email":"admin@empresa-teste.example","admin_name":"Administrador","uid_billing_plan":"{{ _.uidBilling }}"}'
```

Esperado **201**. Guarde organization.uid em uidCustomerOrganization e uid_admin em uidCustomerSupport. Primary define o login efetivo admin.empresa-teste, perfil secondary_admin, pertencimento à empresa-teste, owner Autoscale e vínculo amplo apenas à nova organização. Isso não dá acesso global ao usuário de suporte. Não envie perfil/owner/escopos neste POST: são definidos pelo provisionamento.

- Mesmo corpo, mesma chave e mesmo ator: replay, sem segunda organização; chave com corpo diferente: 409.
- Nova intenção precisa de nova chave; repetir code com outra chave continua sendo conflito de negócio.
- uid_billing_plan é obrigatório, existente e ativo. Cliente/Técnico e demais defaults são criados pelo servidor.
- A resposta contém uid_notification, mas não a senha. A notificação é cifrada; entrega depende do consumidor ainda adiado.

**Correção do roteiro anterior:** o usuário provisionado já possui senha gerada. password-init não serve para substituí-la; password_already_initialized significa que nenhuma senha foi alterada. Para continuar a homologação sem depender do email, criaremos uma conta de teste adicional em 6.1. Essa preparação por CLI é exclusiva do ambiente de desenvolvimento e não é um fluxo HTTP de onboarding para integradores.

### 5.2 — consultar e alterar somente o nome

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidCustomerOrganization }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```


```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidCustomerOrganization }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Empresa Teste Atualizada"}'
```

Esperado **200** nas duas chamadas. Confira que code, uid_billing_plan, uid e owner foram preservados. Estados active/blocked/inactive são testados no pacote lifecycle do início deste guia, após preparar os usuários. Não exclua esta organização: as próximas fases dependem dela.

### 5.3 — vincular a logo usada pelo login

Escolha um PNG/JPEG/GIF pequeno de homologação. O arquivo não pertence ao repositório; no Insomnia use Body Binary. No terminal, substitua o caminho:

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/images/organization/{{ _.uidCustomerOrganization }}?link=true' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: f0000000-0000-4000-8000-000000000503' \
  --header 'Content-Type: image/png' \
  --data-binary '@CAMINHO_LOCAL/logo-homologacao.png'
```

Esperado **201**. Guarde o uid retornado em uidCustomerLogo. Repetir a mesma imagem/chave retorna replay; outra imagem é nova intenção e usa nova chave. Na fase 6.1, o login de secondary.teste deve retornar `organization.code=empresa-teste`, `organization.name` atualizado e `organization.branding.logo_url=/v1/images/{{ _.uidCustomerLogo }}`. Baixe essa URL com secondaryToken e espere **200** com o MIME original. Sem Bearer, com token de outra organização ou UUID inventado: **404/401**, sem revelar o arquivo. Uma organização sem logo retorna `branding.logo_url: null`.

## Fase 6 — usuários, revenda e isolamento reproduzível

### Encerramento operacional da Services/Reseller Foundation — migration 0200

**Evidência PostgreSQL:** 0200 aplicada em 20/10/2026 às 10:59:48 -03; `migrations/tests/resellers.sql` aprovada pelo operador e terminada em `ROLLBACK`.

**Evidência Go:** API recompilada/atualizada e iniciada para o ciclo HTTP. Nenhum resultado de suíte Go novo foi informado neste encerramento; manter esse estado separado da aprovação SQL e HTTP.

**Evidência HTTP homologada pelo operador:**

| Caso | Resultado confirmado |
|---|---|
| R01 | Primary habilitou Power como revenda. |
| R02–R03 | Primary promoveu `admin` da Power a `administrator` com scope organizacional; login do Administrator Power realizado. |
| R04B | Power criou `automega-power-homolog`; owner/criador são Power e a organização não herdou `reseller_enabled`. |
| R05 | Replay retornou `replayed:true` e os mesmos UIDs. |
| R06–R08 | Revogação pela Primary; replay recuperou o resultado; nova criação negada com `provisioning_denied`. |
| R09 | Auto-habilitação pela Power negada com `organization_not_allowed`. |
| R10–R11 | Power continuou administrando Automega após revogação; Primary restaurou `reseller_enabled=true` na Power. |

UIDs preservados: Power `a0000000-0000-4000-8000-000000000002`; Administrator Power `b0000000-0000-4000-8000-000000000002`; Automega criada pela Power `b5c64f64-b8dc-418b-8893-d6dd3635df5b`; Administrator Automega `4a284762-9736-480b-bce0-7b86ce771a9e`; Automega criada pelo Primary `49bc0a91-b0c1-409d-bbb3-41700b0438b3`.

A primeira tentativa de criação de Automega ocorreu acidentalmente com token Primary e criou uma organização separada, de owner Autoscale; não foi defeito de autorização e não representa R04B. Testes concorrentes HTTP não foram executados. Fase 1: **HOMOLOGADA nos cenários listados e FROZEN**. A próxima atividade é análise específica da Fase 2 — Billing Account e associação financeira automática; não é parte da evidência acima.

Para distinguir a organização proprietária do cadastro da organização operacional e reproduzir o caso de um usuário Geomx atuando na Segminas, siga também [access_hierarchy.md — Revenda Geomx com acesso a Segminas](access_hierarchy.md#revenda-geomx-com-acesso-a-segminas). Os exemplos mostram promoção para `administrator`, concessão/substituição de escopos e criação de Basic com owner Geomx e pertencimento Segminas.

Para criar organizações depois de aplicar a 0062, aplique a correção 0065 antes do POST de Primary (comando em [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)). A regressão SQL completa e transacional pode ser executada com `psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/provisioning_after_auth_recovery.sql`; espere o aviso `primary_provisioning_probe_passed`. O teste termina com `ROLLBACK` e não deixa a organização de diagnóstico gravada.

### 6.0 — mapa de contas e dependências

| Conta | Pertencimento / owner | Perfil e alcance | Token |
|---|---|---|---|
| admin.autoscale | Autoscale / Autoscale | primary_admin, all; raiz | primaryToken |
| secondary.teste | empresa-teste / empresa-teste | secondary_admin, organização cliente | secondaryToken |
| admin.geomx-teste | geomx-teste / Autoscale | suporte; promovido a administrator pelo Primary | senha gerada; não precisamos usá-la |
| revenda.teste e revenda.par | geomx-teste / geomx-teste | administrator; organização própria e novas organizações compartilhadas | resellerToken / resellerPeerToken |
| basic.teste | empresa-teste / empresa-teste | basic_user; somente o asset escolhido | basicToken, criado em 6.7 **depois da fase 9** |

Primary é o único que atribui Administrator/Primary. Administrator pode criar Secondary/Basic; Secondary pode criar Basic. Toda operação ainda exige área e vínculos. Owner protege quem administra a conta; não concede visibilidade global. Dados fora de escopo nunca ficam acessíveis por filtros.

### 6.1 — criar Secondary sem poder criar organizações

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/users' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: f0000000-0000-4000-8000-000000000601' \
  --header 'Content-Type: application/json' \
  --data '{"uid_organization":"{{ _.uidCustomerOrganization }}","profile_code":"secondary_admin","name":"secondary.teste","login":"secondary.teste","enabled":false,"organizations_access":"selected","scopes":[{"uid_organization":"{{ _.uidCustomerOrganization }}"}]}'
```

Esperado **201**, password_initialized=false. Guarde uid em uidSecondary. Não envie senha no JSON. Primary omitindo owner usa a organização alvo; essa conta é controlada pela empresa-teste.

No terminal do backend, substitua UUID_RETORNADO pelo uidSecondary:

```bash
go run ./cmd/password-init -config config.json -uid UUID_RETORNADO
```

Digite a senha localmente. O comando exige acesso do operador ao backend, não é uma API para integradores. Depois habilite pelo PUT completo:

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/users/{{ _.uidSecondary }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"uid_organization":"{{ _.uidCustomerOrganization }}","profile_code":"secondary_admin","name":"secondary.teste","login":"secondary.teste","enabled":true,"organizations_access":"selected","scopes":[{"uid_organization":"{{ _.uidCustomerOrganization }}"}]}'
```


```bash
curl --request POST '{{ _.baseURL }}/v1/users/login' \
  --header 'Content-Type: application/json' \
  --data '{"identifier":"secondary.teste","password":"SENHA_ESCOLHIDA_NO_PASSWORD_INIT"}'
```

Esperado **200**. Guarde token em secondaryToken, sem substituir primaryToken. Refaça 2.2/2.3 com secondaryToken para conferir pertencimento. Não precisa anexar entidade para Secondary com vínculo amplo da organização.

Teste a proibição com corpo válido:

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/organizations' \
  --header 'Authorization: Bearer {{ _.secondaryToken }}' \
  --header 'Idempotency-Key: f0000000-0000-4000-8000-000000000602' \
  --header 'Content-Type: application/json' \
  --data '{"code":"cliente-proibido","name":"Cliente-Proibido","email":"admin@cliente-proibido.example","admin_name":"Administrador","uid_billing_plan":"{{ _.uidBilling }}"}'
```

Esperado **403**, sem criar organização; pode ser area_not_allowed ou organization_not_allowed conforme a barreira que negar primeiro. Não é erro de Idempotency-Key. Secondary deverá conseguir criar a entidade da fase 7 com uidCustomerOrganization.

### 6.2 — criar Geomx e promover o suporte a Administrator

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/organizations' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: f0000000-0000-4000-8000-000000000603' \
  --header 'Content-Type: application/json' \
  --data '{"code":"geomx-teste","name":"Geomx-Teste","email":"admin@geomx-teste.example","admin_name":"Administrador","uid_billing_plan":"{{ _.uidBilling }}"}'
```

Guarde organization.uid em uidResellerOrganization e uid_admin em uidResellerSupport. Por enquanto o suporte é Secondary. Como Primary, mude somente o perfil:

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/users/{{ _.uidResellerSupport }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"profile_code":"administrator"}'
```


```bash
curl --request GET '{{ _.baseURL }}/v1/admin/users/{{ _.uidResellerSupport }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **200**. Verifique administrator, organizations_access=selected, scopes com Geomx, login admin.geomx-teste e owner Autoscale preservado. Não use all: esse modo é exclusivo de Primary Autoscale. A promoção não troca a senha gerada e não habilita a organização como revenda. Administradores da Geomx não podem editar essa conta de suporte.

### 6.3 — preparar dois administradores de teste da Geomx

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/users' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: f0000000-0000-4000-8000-000000000604' \
  --header 'Content-Type: application/json' \
  --data '{"uid_organization":"{{ _.uidResellerOrganization }}","profile_code":"administrator","name":"revenda.teste","login":"revenda.teste","enabled":false,"organizations_access":"selected","scopes":[{"uid_organization":"{{ _.uidResellerOrganization }}"}]}'
```

Guarde uid em uidResellerUser. Inicialize sua senha com o comando de 6.1 usando esse UUID; depois habilite:

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/users/{{ _.uidResellerUser }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"uid_organization":"{{ _.uidResellerOrganization }}","profile_code":"administrator","name":"revenda.teste","login":"revenda.teste","enabled":true,"organizations_access":"selected","scopes":[{"uid_organization":"{{ _.uidResellerOrganization }}"}]}'
```


```bash
curl --request POST '{{ _.baseURL }}/v1/users/login' \
  --header 'Content-Type: application/json' \
  --data '{"identifier":"revenda.teste","password":"SENHA_ESCOLHIDA_PARA_REVENDA"}'
```

Guarde token em resellerToken. Antes da habilitação explícita, uma criação válida por esse Administrator deve retornar 403 `provisioning_denied`; promoção de perfil sozinha não basta. Tente o POST de 6.4 com uma chave nova e um `code` de diagnóstico, sem prosseguir com a mesma intenção após a negativa.

Como Primary, habilite Geomx pelo PUT já existente:

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidResellerOrganization }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"reseller_enabled":true}'
```

Esperado **200** com `reseller_enabled:true`. Omitir esse campo em PUT posterior não o desliga. Agora teste com resellerToken uma tentativa de enviar `{"reseller_enabled":false}` ao próprio PUT de Geomx: esperado 403 `organization_not_allowed`, sem alterar a flag.

Agora crie o segundo administrador como Primary:

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/users' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: f0000000-0000-4000-8000-000000000605' \
  --header 'Content-Type: application/json' \
  --data '{"uid_organization":"{{ _.uidResellerOrganization }}","profile_code":"administrator","name":"revenda.par","login":"revenda.par","enabled":false,"organizations_access":"selected","scopes":[{"uid_organization":"{{ _.uidResellerOrganization }}"}]}'
```

Guarde uid em uidResellerPeer. Execute password-init com esse UUID e escolha a senha. Habilite com o corpo completo:

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/users/{{ _.uidResellerPeer }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"uid_organization":"{{ _.uidResellerOrganization }}","profile_code":"administrator","name":"revenda.par","login":"revenda.par","enabled":true,"organizations_access":"selected","scopes":[{"uid_organization":"{{ _.uidResellerOrganization }}"}]}'
```

```bash
curl --request POST '{{ _.baseURL }}/v1/users/login' \
  --header 'Content-Type: application/json' \
  --data '{"identifier":"revenda.par","password":"SENHA_ESCOLHIDA_PARA_O_SEGUNDO_ADMIN"}'
```

Guarde token em resellerPeerToken. Ambos os Administrator devem existir **antes** de criar o cliente a seguir; administradores criados posteriormente recebem os vínculos escolhidos no seu cadastro, sem retroatividade automática.

### 6.4 — criar cliente pela revenda e verificar compartilhamento

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/organizations' \
  --header 'Authorization: Bearer {{ _.resellerToken }}' \
  --header 'Idempotency-Key: f0000000-0000-4000-8000-000000000606' \
  --header 'Content-Type: application/json' \
  --data '{"code":"cliente-geomx-teste","name":"Cliente-Geomx-Teste","email":"admin@cliente-geomx-teste.example","admin_name":"Administrador","uid_billing_plan":"{{ _.uidBilling }}","admin_login":"cliente.admin"}'
```

Esperado **201**. Guarde organization.uid em uidResellerCustomerOrganization. A organização nova tem owner Geomx; o administrador inicial cliente.admin é Secondary e tem owner/pertencimento na nova organização. A revenda só pode usar o plano ativo da própria Geomx: uidBilling funciona aqui porque foi o plano usado em 6.2. Não é permitido escolher plano de outra carteira.

Depois de concluir as verificações do cliente, como Primary revogue `reseller_enabled` para Geomx. Uma nova intenção de POST válida com chave nova deve retornar 403 `provisioning_denied`, e um GET/PATCH permitido de um cliente já existente deve continuar funcionando. Repita também o POST original com a mesma `Idempotency-Key` e body normalizado: esperado 200 com `replayed:true` e os mesmos UIDs; nenhuma entidade, usuário, notificação, audit ou outbox novo deve ser criado. O replay só é permitido ao mesmo ator com acesso administrativo atual ao cliente. Chave igual com body alterado e tentativa de outro ator devem retornar 409 `provisioning_conflict`; se o scope atual do ator para o cliente for removido, replay deve ser negado. Reative a flag como Primary para continuar os passos posteriores que criam clientes. Nenhum cliente, usuário, scope ou histórico existente deve ser apagado pela revogação.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/organizations' \
  --header 'Authorization: Bearer {{ _.resellerToken }}'
```


```bash
curl --request GET '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidResellerCustomerOrganization }}' \
  --header 'Authorization: Bearer {{ _.resellerPeerToken }}'
```


```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidResellerCustomerOrganization }}' \
  --header 'Authorization: Bearer {{ _.resellerToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Cliente da Geomx atualizado"}'
```

Esperado **200**. A listagem da revenda contém Geomx e seu cliente, mas não Autoscale nem empresa-teste. O segundo Administrator também vê o cliente novo. Como Primary, consulte o suporte admin.geomx-teste: seus scopes também receberam o novo cliente, embora o owner da conta seja Autoscale. Secondary/Basic não recebem esse compartilhamento automático.

### 6.5 — provas negativas de isolamento

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidCustomerOrganization }}' \
  --header 'Authorization: Bearer {{ _.resellerToken }}'
```


```bash
curl --request POST '{{ _.baseURL }}/v1/admin/organizations/search' \
  --header 'Authorization: Bearer {{ _.resellerToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"filters":[{"field":"uid","operator":"eq","value":"{{ _.uidCustomerOrganization }}"}]}'
```


```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/users/{{ _.uidResellerSupport }}' \
  --header 'Authorization: Bearer {{ _.resellerToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Tentativa indevida"}'
```

A primeira consulta deve retornar **404**; a pesquisa **200 com items vazio**, sem Idempotency-Key. A alteração de suporte deve ser negada (403/404 conforme a camada), nunca 200. Não use código inválido para testar autorização: todos os UUIDs acima devem existir.

Como Primary, consulte o usuário revenda.teste e confirme selected e scopes válidos. A correção da ordem de validação exige a migration 0066 (comando em [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)). Depois dela, Administrator ativo com `scopes=[]` deve receber `422 {"message":"invalid_user"}` e manter os scopes anteriores, mesmo que um identificador do corpo também esteja em conflito. Com scopes válidos, login/email/mobile duplicados ou vínculo de escopo duplicado retornam `409 user_conflict`. Se ocorrer `409`, use o `X-Request-Id` para localizar `user administration unique constraint violation`; o log informa somente a constraint, sem valores de usuário. Delegar empresa-teste a um usuário da Geomx usando resellerToken deve falhar; não ampliar as permissões para fazer o teste passar. Owner, perfil e áreas são verificações adicionais aos vínculos.

### 6.6 — logins simultâneos na organização owner

Use revenda.teste, cujo owner é Geomx, para não revogar as sessões globais da Autoscale. O suporte admin.geomx-teste tem owner Autoscale e segue a política da Autoscale, apesar de pertencer à Geomx.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidResellerOrganization }}/session-policy' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```


```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidResellerOrganization }}/session-policy' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"allow_concurrent_sessions":false}'
```

Guarde o valor original antes do PUT; esperado **200**, com revoked_count. Execute duas vezes o login de revenda.teste e guarde cada token separadamente em tokenA e tokenB. Status com tokenA deve retornar 401 após o segundo login; tokenB continua 200. Um SSE do tokenA recebe revogação. Isso é sessão única **por usuário**, não uma única sessão para toda a organização.

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidResellerOrganization }}/session-policy' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"allow_concurrent_sessions":true}'
```

Agora dois logins explícitos da mesma conta permanecem válidos; logout com tokenA não revoga tokenB. Restaure o valor original por PUT, refaça os logins de revenda.teste/revenda.par e atualize as variáveis antes de prosseguir.

### Retomada depois da frota

O usuário Basic com escopo de um asset é criado após a Fase 9; volte ao bloco **Usuário Basic — teste de menor escopo** logo depois dela. A aprovação completa desta etapa também foi movida para o fechamento desse bloco, quando já existem todos os dados necessários.

## Fase 7 — entidade, tipos e fuso

### 7.0 — preparar o ambiente do Insomnia

Os curls abaixo são para **importar no Insomnia**, usando as variáveis do ambiente. No terminal, substitua `{{ _.variavel }}` pelo valor real; essa sintaxe não é expansão do shell. Em PowerShell, use curl.exe ou importe diretamente no Insomnia.

Use Primary para montar o cenário. Depois repita os testes de isolamento com `secondaryToken` e `basicToken`, obtidos em 6.1 e 6.7; Basic só é preparado depois da frota da fase 9. Token de outro usuário deve vir de outra requisição de login com **Never Resend**. Não copie credenciais para este documento.

Acrescente as variáveis abaixo conforme as respostas chegarem. Uma variável vazia ainda não é um UUID válido:

| Variáveis a guardar | Origem |
|---|---|
| uidEntity | POST entities, campo uid |
| uidCustomerType, uidTechnicianType | Lista de tipos, itens customer e technician da organização cliente |
| uidSupplierType | POST entities/types, campo uid |
| uidTimezone | Catálogo common/timezones, code America/Sao_Paulo |
| uidAssetType, uidAssetManufacturer, uidAssetModel | POSTs dos catálogos de assets |
| uidDeviceType, uidDeviceManufacturer, uidDeviceModel | POSTs dos catálogos de devices |
| uidCatalogDisposable | Tipo temporário para testar exclusão |
| uidDevice, uidSIM, uidLinkedDevice, uidLinkedSIM | Criações da fase 10 |
| uidDestinationOrganization | Segunda organização criada pela fase 5; nunca um UUID inventado |
| uidPoint, uidCircle, uidPolygon, uidRoute | Criações da fase 11 |
| uidIgnitionModel, uidPanicModel, uidAnchorModel, uidPeriodicModel | Modelos padrão encontrados pelo code na fase 12 |
| uidRecipient, uidRule, uidFixedPolicy, uidSuspension, uidPeriodicReport, uidActivation | Criações da fase 12 |
| uidOccurrence | Ocorrência real/fixture autorizada; não há POST administrativo para criá-la |

`uidAsset` depende da fase 9. Sem ele, execute os casos de entidade/organização/estoque e marque os casos dependentes como bloqueados.

[x] Contrato 0057 implementado nos creates cadastrais e uploads. Os exemplos usam uma chave por intenção; repetir o mesmo create retorna replay, sem duplicar. Homologação documentada em [HOMOLOGATION_8_13_RESULTS.md](HOMOLOGATION_8_13_RESULTS.md).

### 7.1 — criar, ler, atualizar e pesquisar a entidade

```bash
curl --header 'Idempotency-Key: bd82924b-3592-5260-b34a-05bcfb1206bc' --request POST '{{ _.baseURL }}/v1/admin/entities' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_unit": "",
  "uid_situations": "",
  "name": "Filial Rio de Janeiro"
}'
```

Esperado: **201**, objeto da entidade. Guarde uid em uidEntity. Unidade e situação vazias acionam os defaults; types deve incluir customer. Organização e nome são obrigatórios; UUID de outra organização não deve ser aceito como unidade.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/entities/{{ _.uidEntity }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado: **200**, mesmo uid e organização.

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/entities/{{ _.uidEntity }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Filial Rio de Janeiro - Homologação"
}'
```

Esperado: **200**, só o nome muda; confira novamente por GET que organização, unidade e situação foram preservadas.

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/entities/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "{{ _.uidCustomerOrganization }}"
    }
  ],
  "q": "Homologação"
}'
```

Esperado: **200**, items/total; a entidade aparece somente para um ator autorizado. q e filtros não ampliam vínculos.

### 7.2 — consultar defaults e criar Fornecedor

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/entities/types/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "{{ _.uidCustomerOrganization }}"
    }
  ]
}'
```

Nos items da **mesma organização**, copie customer e technician para uidCustomerType e uidTechnicianType. Não use o UUID de um default de outra organização.

```bash
curl --header 'Idempotency-Key: eadec4db-5997-558a-b51c-5eeaebbc374a' --request POST '{{ _.baseURL }}/v1/admin/entities/types' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "code": "supplier",
  "name": "Fornecedor",
  "active": true
}'
```

Esperado: **201**, uid em uidSupplierType. Se supplier já existir, use o resultado da consulta; não tente recriar com outro uid.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/entities/types/{{ _.uidSupplierType }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```


```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/entities/types/{{ _.uidSupplierType }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "code": "supplier",
  "name": "Fornecedor de serviços",
  "active": true
}'
```

Esperado: **200** em leitura e atualização. PUT envia o cadastro completo.

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/entities/{{ _.uidEntity }}/types' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "types": [
    "{{ _.uidCustomerType }}",
    "{{ _.uidSupplierType }}",
    "{{ _.uidTechnicianType }}"
  ]
}'
```

Esperado: **200**. Consulte novamente a entidade: ela deve apresentar os três tipos. Esse PUT substitui a lista; não acrescenta apenas o último item.

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/entities/{{ _.uidEntity }}/types' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "types": []
}'
```

Esperado: rejeição **422**, sem perder os vínculos anteriores. Repita GET para confirmar. Tipo de outra organização também é inválido.

### 7.3 — definir fuso por catálogo

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/common/timezones' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado: **200**, array de fusos. Procure code=America/Sao_Paulo e guarde uid em uidTimezone. Não envie -03:00 nem o nome textual onde a API pede UUID.

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/organizations/{{ _.uidCustomerOrganization }}/timezone' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_timezone": "{{ _.uidTimezone }}"
}'
```


```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/entities/{{ _.uidEntity }}/timezone' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_timezone": "{{ _.uidTimezone }}"
}'
```

Esperado: **200**, uid_timezone e timezone=America/Sao_Paulo. O fuso da organização sincroniza sua configuração; o da entidade define o override. Este endpoint exige UUID válido: não use null para tentar remover o override.

### 7.4 — exclusão de tipo e proteção dos defaults

Faça este teste antes de reutilizar Fornecedor em outros cadastros. Primeiro mantenha só os defaults:

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/entities/{{ _.uidEntity }}/types' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "types": [
    "{{ _.uidCustomerType }}",
    "{{ _.uidTechnicianType }}"
  ]
}'
```


```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/entities/types/{{ _.uidSupplierType }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado: **204** sem corpo quando não há referências; **409** se ainda estiver em uso. GET do removido deve retornar 404. Não apague a entidade usada pelas próximas fases.

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/entities/types/{{ _.uidCustomerType }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado: rejeição, sem excluir o default. Consulte a lista e confirme customer/technician preservados. Detalhes: entities.md.

## Fase 8 — catálogos de assets e devices

Resultados da execução pelo assistente, separados dos resultados esperados abaixo: [HOMOLOGATION_8_13_RESULTS.md](HOMOLOGATION_8_13_RESULTS.md). Uma chamada documentada não equivale a um teste executado.

### 8.1 — tipo → fabricante → modelo de asset

Catálogos globais são mantidos pelo Primary Autoscale. name e active são obrigatórios; fabricante exige types e modelo exige o par compatível tipo/fabricante.

```bash
curl --header 'Idempotency-Key: 33a275a8-8ec7-519c-89e1-9dc793221f17' --request POST '{{ _.baseURL }}/v1/admin/assets/types' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Veículo homologação",
  "active": true
}'
```

Esperado **201**; guarde uidAssetType.

```bash
curl --header 'Idempotency-Key: 52c3f973-e085-53e2-ac9f-9d3a84f236d3' --request POST '{{ _.baseURL }}/v1/admin/assets/manufacturers' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Fabricante asset homologação",
  "active": true,
  "types": [
    "{{ _.uidAssetType }}"
  ]
}'
```

Esperado **201**; guarde uidAssetManufacturer. types é uma lista de UUIDs; fabricante pode atender mais de um tipo.

```bash
curl --header 'Idempotency-Key: 42c0b3d3-ade9-5f62-8293-a14dcd9a5cad' --request POST '{{ _.baseURL }}/v1/admin/assets/models' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Modelo asset homologação",
  "active": true,
  "uid_type": "{{ _.uidAssetType }}",
  "uid_manufacturer": "{{ _.uidAssetManufacturer }}"
}'
```

Esperado **201**; guarde uidAssetModel.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/assets/models/{{ _.uidAssetModel }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```


```bash
curl --request POST '{{ _.baseURL }}/v1/admin/assets/manufacturers/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": [
    {
      "field": "active",
      "operator": "eq",
      "value": "true"
    }
  ],
  "q": "homologação"
}'
```

Esperado **200**. Confira o par tipo/fabricante no modelo e os types do fabricante.

### 8.2 — atualizar e testar integridade

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/assets/models/{{ _.uidAssetModel }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Modelo asset homologação revisado",
  "active": true,
  "uid_type": "{{ _.uidAssetType }}",
  "uid_manufacturer": "{{ _.uidAssetManufacturer }}"
}'
```

Esperado **200**, mesmo uid. PUT exige todos os campos do modelo.

```bash
curl --header 'Idempotency-Key: cbb9d6a1-8913-565a-9001-5c93ecd995f0' --request POST '{{ _.baseURL }}/v1/admin/assets/types' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Veículo homologação",
  "active": true
}'
```

Esperado **409** por duplicata, inclusive com variação de caixa. Consulte para confirmar que continua existindo apenas um.

```bash
curl --header 'Idempotency-Key: d8dfb0a7-27d3-56ae-9b6e-7a5b132dc475' --request POST '{{ _.baseURL }}/v1/admin/assets/types' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Não deve ser criado",
  "active": true,
  "campo_inexistente": true
}'
```

Esperado **422**, nada criado.

```bash
curl --header 'Idempotency-Key: 021986f5-03a7-51da-aa4a-e53e94a515cb' --request POST '{{ _.baseURL }}/v1/admin/assets/types' \
  --header 'Authorization: Bearer {{ _.secondaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Secondary não pode criar catálogo global",
  "active": true
}'
```

Esperado **403**, mesmo que Secondary administre uma organização.

Não delete o tipo/fabricante/modelo principal: serão usados no inventário. Para testar exclusão sem dependências:

```bash
curl --header 'Idempotency-Key: 5861f9e4-346b-5c6b-a97e-bf475d71a412' --request POST '{{ _.baseURL }}/v1/admin/assets/types' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Tipo descartável homologação",
  "active": true
}'
```

Guarde uidCatalogDisposable.

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/assets/types/{{ _.uidCatalogDisposable }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **204**; GET do mesmo UUID deve retornar 404. Excluir tipo usado por fabricante/modelo deve retornar **409** e preservar as referências.

### 8.3 — catálogos próprios de devices

```bash
curl --header 'Idempotency-Key: 12ffe784-5f58-5924-a778-ffbb96451cff' --request POST '{{ _.baseURL }}/v1/admin/devices/types' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Rastreador homologação",
  "active": true
}'
```

Esperado **201**; guarde uidDeviceType.

```bash
curl --header 'Idempotency-Key: ba906ef9-9817-5061-b620-06427a94c2e5' --request POST '{{ _.baseURL }}/v1/admin/devices/manufacturers' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Fabricante device homologação",
  "active": true,
  "types": [
    "{{ _.uidDeviceType }}"
  ]
}'
```

Esperado **201**; guarde uidDeviceManufacturer.

```bash
curl --header 'Idempotency-Key: 9de603ec-edc2-5301-93b0-2fa2b8045666' --request POST '{{ _.baseURL }}/v1/admin/devices/models' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Rastreador modelo H1",
  "active": true,
  "uid_type": "{{ _.uidDeviceType }}",
  "uid_manufacturer": "{{ _.uidDeviceManufacturer }}"
}'
```

Esperado **201**; guarde uidDeviceModel. UUIDs de assets não servem para catálogos de devices.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/devices/models/{{ _.uidDeviceModel }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```


```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/devices/models/{{ _.uidDeviceModel }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "Rastreador modelo H1 revisado",
  "active": true,
  "uid_type": "{{ _.uidDeviceType }}",
  "uid_manufacturer": "{{ _.uidDeviceManufacturer }}"
}'
```

Esperado **200**. Para testar incompatibilidade, troque uid_type por outro tipo real não associado ao fabricante: deve rejeitar com **409**, sem alterar o modelo original.

### 8.4 — combustíveis e tensões já semeados

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/assets/fuels' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```


```bash
curl --request POST '{{ _.baseURL }}/v1/admin/assets/voltages/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "q": "220",
  "filters": [
    {
      "field": "active",
      "operator": "eq",
      "value": "true"
    }
  ]
}'
```

Esperado **200**, items/total. Confirme opções dos seeds e guarde os UUIDs escolhidos. Não recrie Gasoline/220 V AC se já existirem. A fase 9 permite atribuir uid_fuel/uid_voltage ao asset por POST/PUT/PATCH.

## Fase 9 — CRUD de unidades, grupos, assets e vínculos

Pré-requisito: migrations 0052–0057 e backend atualizado, entidade da fase 7 e modelo da fase 8. Essas migrations são aplicadas na implantação, conforme [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). Contrato completo, campos opcionais, permissões e erros: [fleet.md](fleet.md).

Cada POST de criação abaixo usa chave diferente. Em retry, conserve a chave e o corpo. Para repetir toda a homologação, escolha novos nomes/identifications e novas chaves. No Insomnia, guarde os UUIDs indicados. Não copie a resposta inteira para PUT/PATCH.

### 9.1 — criar e editar unidade da entidade

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/entities/units' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: 95200000-0000-4000-8000-000000000001' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "name": "HOMOLOG Unidade Rio"
}'
```

Esperado **201**. Guarde `uid` em `uidUnit`. Organização+entidade+nome são obrigatórios. Reenvie a mesma chamada: **200**, mesmo UUID, `replayed:true`. Mude o nome com a mesma chave: **409**, sem nova unidade. Nova chave com nome já existente também retorna **409**.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/entities/units/{{ _.uidUnit }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/entities/units/{{ _.uidUnit }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "HOMOLOG Unidade Rio Revisada"
}'
```

Esperado **200**; organização e entidade preservadas. PUT para definir o estado editável completo:

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/entities/units/{{ _.uidUnit }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "name": "HOMOLOG Unidade Rio"
}'
```

### 9.2 — criar e editar grupo da organização

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/assets/groups' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: 95200000-0000-4000-8000-000000000002' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "name": "HOMOLOG Frota Pesada"
}'
```

Esperado **201**. Guarde `uid` em `uidAssetGroup`. Grupo não recebe uid_entity: pode reunir assets de entidades distintas da mesma organização.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/assets/groups/{{ _.uidAssetGroup }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/assets/groups/{{ _.uidAssetGroup }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "HOMOLOG Frota Revisada"
}'
```

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/assets/groups/{{ _.uidAssetGroup }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "name": "HOMOLOG Frota Pesada"
}'
```

### 9.3 — criar e atualizar asset

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/assets' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: 95200000-0000-4000-8000-000000000003' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "uid_unit": "{{ _.uidUnit }}",
  "identification": "HOMOLOG-ASSET-001",
  "uid_model": "{{ _.uidAssetModel }}"
}'
```

Esperado **201**. Guarde `uid` em `uidAsset`. Não envie name/plate/uid_type/uid_manufacturer. `uid_model` é opcional; remova a chave se não escolheu um modelo. `uid_fuel`/`uid_voltage` são opcionais e recebem UUIDs dos catálogos da fase 8. Unidade omitida usa a unidade padrão da entidade.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/assets/{{ _.uidAsset }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/assets/{{ _.uidAsset }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "identification": "HOMOLOG-ASSET-002"
}'
```

Esperado **200**, alterando só identification. Confira que organização, entidade, unidade e modelo não mudaram.

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/assets/{{ _.uidAsset }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "uid_unit": "{{ _.uidUnit }}",
  "identification": "HOMOLOG-ASSET-001",
  "uid_model": "{{ _.uidAssetModel }}"
}'
```

Esperado **200**. PUT restaura identification do exemplo; campos opcionais omitidos voltam aos defaults. Para limpar só a tensão:

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/assets/{{ _.uidAsset }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_voltage": null
}'
```

### 9.4 — vincular asset ao grupo e pesquisar

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/assets/group-assets' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: 95200000-0000-4000-8000-000000000004' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_group": "{{ _.uidAssetGroup }}",
  "uid_asset": "{{ _.uidAsset }}"
}'
```

Esperado **201**; guarde `uid` em `uidGroupAsset`. Os dois registros precisam pertencer à mesma organização. Repetir com nova chave retorna **409**.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/assets/group-assets/{{ _.uidGroupAsset }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/assets/group-assets/{{ _.uidGroupAsset }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_group": "{{ _.uidAssetGroup }}",
  "uid_asset": "{{ _.uidAsset }}"
}'
```

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/assets/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": [
    {
      "field": "uid_group",
      "operator": "eq",
      "value": "{{ _.uidAssetGroup }}"
    }
  ]
}'
```

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/entities/units/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "q": "HOMOLOG",
  "filters": [
    {
      "field": "uid_entity",
      "operator": "eq",
      "value": "{{ _.uidEntity }}"
    }
  ]
}'
```

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/assets/groups/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "q": "HOMOLOG"
}'
```

Esperado **200**, items/total limitados ao alcance do usuário. Busca não usa Idempotency-Key.

### 9.5 — exclusão e negativos

Faça estes testes com registros descartáveis ou depois das fases 10–12: elas usam o asset criado.

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/entities/units/{{ _.uidUnit }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Enquanto houver asset nessa unidade, esperado **409**. Unidade Geral também não pode ser excluída.

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/assets/groups/{{ _.uidAssetGroup }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Enquanto houver participação, esperado **409**. Para remover somente a participação e depois excluir o grupo personalizado:

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/assets/group-assets/{{ _.uidGroupAsset }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/assets/groups/{{ _.uidAssetGroup }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **204** em cada chamada. O asset continua no grupo Geral. Remover seu último grupo é rejeitado.

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/assets/{{ _.uidAsset }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **204** se não houver device/escopo de usuário associado; caso contrário **409**, sem alteração parcial. Excluir é lógico e o GET seguinte retorna **404**, mesmo com include_inactive. Unidade usada pelo histórico desse asset continua protegida. Para testar exclusão de unidade, crie uma unidade descartável sem referências.

- [ ] Primary e Secondary autorizados realizam CRUD no próprio alcance.
- [ ] Secondary externo não lê nem altera o ramo.
- [ ] Basic vê apenas seus assets e não grava.
- [ ] Outra entidade não pode usar esta unidade exclusiva.
- [ ] Nome/identification duplicados, campo desconhecido e UUID inválido são rejeitados.
- [ ] Antes/depois e ator aparecem na auditoria; repetição sem mudança não inventa alteração.

## Usuário Basic — teste de menor escopo (retomada do item 6.7, após Fase 9)

Agora que a organização tem entidade e asset, crie o Basic com acesso a somente esse asset. Como Primary:

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/users' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Idempotency-Key: f0000000-0000-4000-8000-000000000607' \
  --header 'Content-Type: application/json' \
  --data '{
    "uid_organization": "{{ _.uidCustomerOrganization }}",
    "profile_code": "basic_user",
    "name": "basic.teste",
    "login": "basic.teste",
    "enabled": false,
    "organizations_access": "selected",
    "scopes": [{
      "uid_organization": "{{ _.uidCustomerOrganization }}",
      "entities": [{
        "uid_entity": "{{ _.uidEntity }}",
        "uid_units": [],
        "uid_groups": [],
        "uid_assets": ["{{ _.uidAsset }}"]
      }]
    }]
  }'
```

Guarde `uidBasic`. Inicialize a senha desse UUID pelo comando descrito na Fase 6.1 e habilite:

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/users/{{ _.uidBasic }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
    "uid_organization": "{{ _.uidCustomerOrganization }}",
    "profile_code": "basic_user",
    "name": "basic.teste",
    "login": "basic.teste",
    "enabled": true,
    "organizations_access": "selected",
    "scopes": [{
      "uid_organization": "{{ _.uidCustomerOrganization }}",
      "entities": [{
        "uid_entity": "{{ _.uidEntity }}",
        "uid_units": [],
        "uid_groups": [],
        "uid_assets": ["{{ _.uidAsset }}"]
      }]
    }]
  }'
```

Faça login e guarde `basicToken`:

```bash
curl --request POST '{{ _.baseURL }}/v1/users/login' \
  --header 'Content-Type: application/json' \
  --data '{"identifier":"basic.teste","password":"SENHA_ESCOLHIDA_PARA_BASIC"}'
```

Use GET `/v1/admin/assets` com esse token: somente o asset vinculado pode aparecer, desde que a área `assets` esteja habilitada no perfil. `403 area_not_allowed` significa área ausente, não defeito no escopo. Para testar isolamento, crie um segundo asset da mesma entidade seguindo 9.3, com identification diferente e chave nova, sem adicioná-lo aos scopes do Basic. GET pelo UUID desse segundo asset não deve retornar seus dados.

Basic não cria organizações, entidades nem assets. No contrato 0067, o mínimo por entity é qualquer uma das dimensões unit/group/asset; o exemplo anterior mantém acesso a um único asset para validar o caso mais restrito. Não exclua o asset do scope até concluir os testes que usam `basicToken`.

### Scopes hierárquicos — 0067 (em homologação, matriz ainda não concluída)

0067 define um bloco por organização e `entities[]`. Há OR dentro de cada array, AND entre dimensões preenchidas, OR entre entities e OR entre organizações. Arrays vazios não restringem aquela dimensão; unit/group podem ser cadastrados mesmo quando hoje não resultam em assets. Basic precisa de pelo menos uma dimensão não vazia em **cada** regra de entity (unit OU group OU asset), mas pode ter muitas organizações/entities e combinações. Secondary precisa de pelo menos uma organização, sem limite de quantidade. Primary mantém acesso global conforme o contrato. A persistência usa uma regra pai e tabelas filhas normalizadas, sem produto cartesiano. A migration descarta ACLs escalares temporárias; os vínculos antigos devem ser recriados pelo roteiro de API. A prova dinâmica de `profile_scopes.sql` altera somente unit e memberships de group: a visibilidade acompanha esses vínculos atuais sem regravar grants. O CRUD comum não permite mudar `uid_entity` ou `uid_organization`; transferência entre Entities depende de operação dedicada futura. GET recompõe o JSON aninhado e PUT substitui tudo atomicamente; falha deve preservar usuário, grants, membership, version, identifiers e auditoria. Uma referência a asset já soft-deleted pode ser mantida ou removida no PUT; nova referência inativa é rejeitada. Soft-deletes permanecem fora das consultas normais e FKs impedem hard-delete referenciado. O usuário confirmou que `profile_scopes.sql` passou em homologação após 0067–0072, incluindo a regressão de lifecycle da 0072. Toda consulta operacional exige primeiro `uid_organization` da organização alvo da operação.

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/users/{{ _.uidBasic }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "profile_code": "basic_user",
  "name": "basic.teste",
  "login": "basic.teste",
  "enabled": true,
  "organizations_access": "selected",
  "scopes": [{
    "uid_organization": "{{ _.uidCustomerOrganization }}",
    "entities": [{
      "uid_entity": "{{ _.uidEntity }}",
      "uid_units": [],
      "uid_groups": [],
      "uid_assets": ["{{ _.uidAsset }}", "{{ _.uidAssetSecond }}"]
    }]
  }]
}'
```

Esperado **200** com uma entity, units, groups e dois assets explícitos; cada asset precisa pertencer à entity e satisfazer as units e groups selecionados. GET `/v1/admin/users/{{ _.uidBasic }}` devolve a forma nested; o endpoint de assets com `basicToken` deve limitar os resultados à interseção autorizada. Remova A2 no PUT e confirme que ele deixa de aparecer. Teste também: Basic com U1 apenas; G1 apenas; A1/A2 apenas; combinação U1+G1; outra organization; e outra entity. Para Basic, organização inteira (`entities: []`) e entity inteira (três arrays vazios) devem retornar 422 e manter o escopo anterior. Esses dois escopos continuam válidos para perfis autorizados, inclusive Secondary/Administrator conforme delegação. Secondary deve aceitar mais de uma organization autorizada.

Fixture SQL exigida para validar a operação real do AND (em banco descartável, dentro de transação com rollback):

| Regra na E1 | Resultado esperado |
| --- | --- |
| `uid_units:[U1]` | A1, A2, A3 |
| `uid_groups:[G1]` | A1, A2, A4 |
| `uid_units:[U1]` + `uid_groups:[G1]` | A1, A2 |
| `uid_units:[U2]` + `uid_groups:[G1]` | A4 |
| `uid_units:[U1]` + `uid_groups:[G1]` + `uid_assets:[A2]` | A2 |
| `uid_units:[U1]` + `uid_assets:[A1]` | A1 |
| `uid_groups:[G1]` + `uid_assets:[A1]` | A1 |
| E1 + U1 + G1 sem interseção atual | Regra válida; zero assets até surgir membro correspondente |

`migrations/tests/profile_scopes.sql` cobre essa matriz, delegado por dimensão, Basic unit/group/asset, Secondary multi-organização, AND/OR, conjunto vazio futuro, entrada/saída de unit e group com Entity fixa, asset explícito preservado ao mudar de unit, round-trip GET/PUT, soft-delete, hard-delete, lifecycle de usuários inativos e rollback integral. Não testa mudança de Entity pelo CRUD comum. Executa com roles reais e termina com `ROLLBACK`. `migrations/tests/run-profile-scopes.sh` cria cluster local isolado, aplica migrations até 0066, faz bootstrap fictício, aplica 0068/0069 e 0067/0070/0071/0072, roda a suite e verifica reaplicação segura dos wrappers. Requer `initdb`, `pg_ctl`, `createdb`, `psql` e PostGIS instalados localmente. Não lê `config.json` e não se conecta à homologação.

Nas buscas HTTP de `/v1/admin/assets`, `/v1/admin/entities/units`, `/v1/admin/assets/groups` e `/v1/admin/assets/group-assets`, inclua exatamente um filtro `uid_organization` com `operator: "eq"`. Exemplo: `POST {{ _.baseURL }}/v1/admin/assets/search` com body `{"filters":[{"field":"uid_organization","operator":"eq","value":"{{ _.uidCustomerOrganization }}"}]}`. Omissão, duplicidade, operador diferente de `eq` ou UUID inválido retorna `400 organization_target_required`; filtros de entity, unit, group ou asset são aplicados depois desse corte.

Matriz estrutural: delegação dimensional; isolamento por perfil; carteira; Basic; Secondary multi-organização; Administrator; Primary; rollback; dimensões/interseções vazias; associação futura sem ACL rewrite; entrada/saída de unit/group mantendo a Entity; asset explicitamente concedido ainda visível ao mudar de unit quando a regra não restringe unit; soft-delete preservado/removível; nova referência inativa negada; hard-delete bloqueado. Não usar alteração direta de `uid_entity` como critério do CRUD público. Cada consulta corta primeiro pela organização alvo, diferente da root/owner da carteira. Os comandos reproduzíveis, inclusive EXPLAIN, estão na seção “Execução local em ordem” abaixo. A aplicação da migration no ambiente de homologação é uma decisão separada da fixture: ela limpa scopes temporários antigos.

#### Execução local em ordem

Execute estes passos em WSL/Linux com ferramentas PostgreSQL/PostGIS locais. O runner completo também está em `bash migrations/tests/run-profile-scopes.sh` e preserva o cluster parado em `/tmp` para inspeção. Para execução manual, deixe o PostgreSQL local disponível em `127.0.0.1:5432`, usuário superuser `postgres`:

```bash
# 1. Criar banco descartável e instalar PostGIS
createdb -h 127.0.0.1 -p 5432 -U postgres navisoft_scope_test
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -c 'CREATE EXTENSION postgis;'

# 2. Instalar todas as migrations até 0066 e preparar a raiz/Primary fictícios
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -f migrations/apply.sql
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -f migrations/bootstrap_autoscale_development.sql

# 3. Resolver unidade default e aplicar ACL hierárquica + policy interna do validador
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -f migrations/upgrade_entity_default_unit.sql
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -f migrations/upgrade_user_scopes.sql

# 4. Executar suite SQL; ela deve terminar com ROLLBACK
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -f migrations/tests/profile_scopes.sql

# 5. Testes Go completos
go test ./...

# 6. Vet e build
go vet ./...
go build ./cmd/navisoft

# 7. Reaplicar wrappers: devem informar que migrations já foram aplicadas e não alterar dados
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -f migrations/upgrade_entity_default_unit.sql
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -f migrations/upgrade_user_scopes.sql
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -c "SELECT version,applied_at FROM common.schema_migrations WHERE version BETWEEN '0066' AND '0072' ORDER BY version;"

# 8. Rodar novamente a fixture com EXPLAIN ANALYZE/BUFFERS no corte da organização
psql -h 127.0.0.1 -p 5432 -U postgres -d navisoft_scope_test -v ON_ERROR_STOP=1 -v scope_explain=1 -f migrations/tests/profile_scopes.sql
```

`migrations/apply.sql` termina em 0066 para separar a instalação base da decisão explícita de aplicar 0067. O upgrade wrapper é reaplicável e vira no-op depois da versão registrada; não rode o arquivo `.up.sql` diretamente uma segunda vez. O EXPLAIN da fixture prova a forma da consulta e os buffers desse conjunto pequeno, não uma meta de latência com 25 mil/10 milhões de assets. Para escala, carregue um volume representativo no mesmo banco descartável antes de aceitar conclusões de performance. Após o teste, descarte somente o banco criado para ele: `dropdb -h 127.0.0.1 -p 5432 -U postgres navisoft_scope_test`.

### Aprovação dos usuários e da hierarquia (fechamento do item 6.8)

- [ ] Secondary entra e cria entidades do cliente, mas recebe 403 ao criar organização.
- [ ] Administrator da revenda cria/edita seus clientes; outro Administrator preexistente recebe o vínculo.
- [ ] Revenda não vê empresa-teste, nem altera suporte controlado pela Autoscale.
- [ ] Basic só vê o asset escolhido e não cadastra recursos administrativos.
- [ ] PUT de Administrator ativo com `scopes=[]` retorna `422 invalid_user` depois da 0066 e preserva os scopes antigos.
- [ ] Perfil, áreas e scopes são verificados pela API/SQL mesmo sem frontend.
- [ ] Anotar `request_id`, perfil/token utilizado e resposta em cada negativa; não anotar os tokens no relatório.

## Fase 15 — motoristas, habilitações e exames (0058)

**Ordem de execução: passo 10.** Esta fase prepara o técnico usado nas ordens de serviço.

Pré-requisito: migrations 0058 e dependências aplicadas e API reiniciada, conforme [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). Os testes SQL foram feitos com rollback; esta fase HTTP permanece para homologar depois da instalação.

Use login administrativo válido e escolha uma organização autorizada. Os registros operacionais usam `/v1/admin/entities/drivers` e subrotas; catálogos e configuração de jurisdição continuam em `/v1/admin/drivers`. Isso só organiza a API: as tabelas permanecem no schema `drivers`, e os escopos atuais ainda podem alcançar mais de uma entidade. Campos, defaults, erros e CRUD dos catálogos estão em [drivers.md](drivers.md). A troca de rotas está implementada, mas esta fase ainda requer homologação HTTP autenticada. Os exemplos não notificam nem geram sessão de condução.

```sh
BASE_URL="http://127.0.0.1:8080"
TOKEN="TOKEN_DO_LOGIN"
ORG="UUID_DA_ORGANIZACAO_AUTORIZADA"
CATEGORY_C="c0580000-0000-4000-8000-000000000013"
EXAM_TYPE="c0580000-0000-4000-8000-000000000020"
REQUIREMENT="c0580000-0000-4000-8000-000000000021"
```


### 1. Consultar opções brasileiras

```sh
curl "$BASE_URL/v1/admin/drivers/countries" -H "Authorization: Bearer $TOKEN"
curl -X POST "$BASE_URL/v1/admin/drivers/license-categories/search" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d '{"filters":[{"field":"uid_jurisdiction","operator":"eq","value":"c0580000-0000-4000-8000-000000000002"}]}'
```

### 2. Criar motorista

```sh
curl -X POST "$BASE_URL/v1/admin/entities/drivers" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -H "Idempotency-Key: d0580000-0000-4000-8000-000000000001" \
 -d "{\"uid_organization\":\"$ORG\",\"name\":\"Motorista de homologação\",\"birth_date\":\"1990-05-20\",\"internal_contract_number\":\"000-TEST-001\",\"scopes\":[{}]}"
```

Copie o `uid` para `DRIVER`. Reenvie o mesmo POST com a mesma chave: deve retornar o mesmo uid e `replayed:true`. Troque somente name mantendo a chave: 409.

```sh
DRIVER="UUID_RETORNADO"
curl "$BASE_URL/v1/admin/entities/drivers/$DRIVER" -H "Authorization: Bearer $TOKEN"
curl -X PATCH "$BASE_URL/v1/admin/entities/drivers/$DRIVER" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"Motorista atualizado"}'
curl -X PUT "$BASE_URL/v1/admin/entities/drivers/$DRIVER" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d "{\"uid_organization\":\"$ORG\",\"name\":\"Motorista de homologação\",\"birth_date\":\"1990-05-20\",\"internal_contract_number\":\"000-TEST-001\",\"scopes\":[{}]}"
```

### 3. Grupo e participação

```sh
curl -X POST "$BASE_URL/v1/admin/entities/drivers/groups" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -H "Idempotency-Key: d0580000-0000-4000-8000-000000000002" \
 -d "{\"uid_organization\":\"$ORG\",\"code\":\"night_test\",\"name\":\"Turno noturno de teste\"}"
GROUP="UUID_DO_GRUPO"
curl -X POST "$BASE_URL/v1/admin/entities/drivers/group-members" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -H "Idempotency-Key: d0580000-0000-4000-8000-000000000003" \
 -d "{\"uid_organization\":\"$ORG\",\"uid_group\":\"$GROUP\",\"uid_driver\":\"$DRIVER\"}"
MEMBERSHIP="UUID_DO_VINCULO"
```

### 4. Habilitação e RFID

```sh
curl -X POST "$BASE_URL/v1/admin/entities/drivers/licenses" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -H "Idempotency-Key: d0580000-0000-4000-8000-000000000004" \
 -d "{\"uid_organization\":\"$ORG\",\"uid_driver\":\"$DRIVER\",\"number\":\"00000000001\",\"document_category\":\"C\",\"issued_on\":\"2026-01-01\",\"expires_on\":\"2031-01-01\",\"categories\":[\"$CATEGORY_C\"]}"
LICENSE="UUID_DA_HABILITACAO"
curl -X POST "$BASE_URL/v1/admin/entities/drivers/credentials" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -H "Idempotency-Key: d0580000-0000-4000-8000-000000000005" \
 -d "{\"uid_organization\":\"$ORG\",\"uid_driver\":\"$DRIVER\",\"kind\":\"organization_rfid\",\"identifier\":\"000123456789012345678901234567890\",\"label\":\"Cartão interno\"}"
CREDENTIAL="UUID_DA_CREDENCIAL"
```

A habilitação retorna `days_remaining`, `license_status` e `license_color`. Estados: valid (>180), renewal_green (91–180), renewal_yellow (16–90), renewal_red (0–15), expired_grace (-1 a -30), expired (<-30), suspended (prioritário). Limites vêm da jurisdição. Dias calculados na data local do fuso de acesso configurado na organização. Validade não concede acesso nem autoriza automaticamente condução.

### 5. Registrar exame adicional

```sh
curl -X POST "$BASE_URL/v1/admin/entities/drivers/exams" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -H "Idempotency-Key: d0580000-0000-4000-8000-000000000006" \
 -d "{\"uid_organization\":\"$ORG\",\"uid_driver\":\"$DRIVER\",\"uid_license\":\"$LICENSE\",\"uid_exam_type\":\"$EXAM_TYPE\",\"uid_requirement\":\"$REQUIREMENT\",\"performed_on\":\"2026-01-01\",\"expires_on\":\"2028-07-01\",\"result\":\"fit\",\"provider\":\"Laboratório fictício\",\"certificate_number\":\"HOMOLOG-0001\"}"
EXAM="UUID_DO_EXAME"
```

As datas acima são exemplo fictício, não cálculo de vencimento individual. Consulte o prazo oficial/documental antes de registrar dados reais. A resposta contém `days_remaining` e `exam_status`: valid, expired, unfit, pending ou inconclusive.

### 6. Pesquisar e consultar vencimentos

```sh
curl -X POST "$BASE_URL/v1/admin/entities/drivers/search" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"q":"Motorista"}'
curl -X POST "$BASE_URL/v1/admin/entities/drivers/licenses/search" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d '{"filters":[{"field":"days_remaining","operator":"lte","value":"90"}]}'
curl -X POST "$BASE_URL/v1/admin/entities/drivers/exams/search" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d "{\"filters\":[{\"field\":\"uid_driver\",\"operator\":\"eq\",\"value\":\"$DRIVER\"}]}"
```

Listas retornam `{items:[],total:N}`; total é dos resultados visíveis filtrados. Sem paginação nesta versão. Datas civis e inteiros aceitam eq/gte/lte/gt/lt; UUIDs eq/in; arrays `categories`/`groups` eq/in; nomes e identificadores têm pesquisa por prefixo. Valores de filtros permanecem strings, inclusive números. Configuração completa em `settings/filters.json`.

### 7. Desativar, consultar histórico e reativar

```sh
curl -X PATCH "$BASE_URL/v1/admin/entities/drivers/$DRIVER" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"active":false}'
curl "$BASE_URL/v1/admin/entities/drivers/$DRIVER?include_inactive=true" -H "Authorization: Bearer $TOKEN"
curl -X PATCH "$BASE_URL/v1/admin/entities/drivers/$DRIVER" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"active":true}'
```

GET sem include_inactive deve dar 404 enquanto inativo; não deve escapar do escopo com a flag. Registros filhos ficam ocultos por padrão quando o motorista está inativo; o histórico não é apagado.

### 8. Excluir na ordem das dependências

```sh
curl -X DELETE "$BASE_URL/v1/admin/entities/drivers/exams/$EXAM" -H "Authorization: Bearer $TOKEN"
curl -X DELETE "$BASE_URL/v1/admin/entities/drivers/licenses/$LICENSE" -H "Authorization: Bearer $TOKEN"
curl -X DELETE "$BASE_URL/v1/admin/entities/drivers/credentials/$CREDENTIAL" -H "Authorization: Bearer $TOKEN"
curl -X DELETE "$BASE_URL/v1/admin/entities/drivers/groups/$GROUP" -H "Authorization: Bearer $TOKEN"
curl -X DELETE "$BASE_URL/v1/admin/entities/drivers/$DRIVER" -H "Authorization: Bearer $TOKEN"
```

Excluir grupo encerra a participação, dispensando DELETE separado dela. Se houver outras dependências, o motorista retorna 409 até resolvê-las.


### Negativos obrigatórios

1. POST sem chave: 400. Retry igual: 200 mesmo UUID; conteúdo diferente na mesma chave: 409.
2. CPF/número não é usado como inteiro: tente RFID numérico (422), depois texto com zeros à esquerda (201).
3. Categoria de outra jurisdição: 422; número de habilitação duplicado na mesma organização/jurisdição: 409.
4. Exame ligado à habilitação de outro motorista: 409. Validade anterior à realização: 422. Regra incompatível com idade/categoria: rejeição.
5. Secondary não cadastra catálogo global e não administra organização externa. Usuário restrito não amplia scopes; Basic não acessa exames.
6. Desativar motorista oculta o cadastro/filhos por padrão; histórico exige administração autorizada. DELETE respeita dependências.
7. Procure auditoria pelo request ID. Presença na outbox não comprova entrega externa.

## Fase 10 — devices, SIM e vínculos

**Ordem de execução: passo 11.** Faça esta fase depois dos motoristas e dos assets.

### 10.1 — criar inventário, consultar e editar

Não depende de asset. Campos obrigatórios: organização, tipo, fabricante, modelo, serial, active e transmits. IMEI é string de 15 dígitos quando presente; neste exemplo fica null para evitar associação com modem real.

```bash
curl --header 'Idempotency-Key: 9712fa97-3b4c-56d7-90a1-1af7f49136bf' --request POST '{{ _.baseURL }}/v1/admin/devices' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_type": "{{ _.uidDeviceType }}",
  "uid_manufacturer": "{{ _.uidDeviceManufacturer }}",
  "uid_model": "{{ _.uidDeviceModel }}",
  "device_serial": "HOMOLOG-DEVICE-001",
  "device_imei": null,
  "active": true,
  "transmits": true
}'
```

Esperado **201**, uid em uidDevice. Não enviar senha nesta etapa; has_password deve ser false.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/devices/{{ _.uidDevice }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```


```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/devices/{{ _.uidDevice }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "device_serial": "HOMOLOG-DEVICE-001-REV"
}'
```

Esperado **200**. Organização, catálogos e transmits intactos. device_pwd/ciphertext nunca aparecem.

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/devices/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "{{ _.uidCustomerOrganization }}"
    }
  ],
  "q": "HOMOLOG"
}'
```


### 10.2 — criar SIM e vinculá-lo ao device

```bash
curl --header 'Idempotency-Key: 73268612-ed89-554f-8b1d-509927f76833' --request POST '{{ _.baseURL }}/v1/admin/simcards' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "iccid": "89510000000000000001",
  "msisdn": null,
  "operator_name": "Operadora homologação",
  "active": true
}'
```

Esperado **201**, uid em uidSIM. ICCID é texto, preserva zeros à esquerda; não reutilize um ICCID já cadastrado.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/simcards/{{ _.uidSIM }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```


```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/simcards/{{ _.uidSIM }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "operator_name": "Operadora homologação revisada"
}'
```


```bash
curl --header 'Idempotency-Key: 4c88d5cc-759d-5c7a-832c-f467953e040f' --request POST '{{ _.baseURL }}/v1/admin/devices/linked-simcards' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_device": "{{ _.uidDevice }}",
  "uid_simcard": "{{ _.uidSIM }}"
}'
```

Esperado **201**, uid em uidLinkedSIM.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/devices/linked-simcards/{{ _.uidLinkedSIM }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

- [ ] Repita o POST do vínculo: **409**; não cria segundo vínculo.
- [ ] Com segundo device real, tente usar o mesmo SIM: **409**.
- [ ] Com SIM real de outra organização: rejeição **409**; device/SIM devem pertencer à mesma organização.

### 10.3 — vínculo com asset (somente após fase 9)

```bash
curl --header 'Idempotency-Key: 456ef787-f7a8-56af-a535-92cc9565c16b' --request POST '{{ _.baseURL }}/v1/admin/assets/linked-devices' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_device": "{{ _.uidDevice }}",
  "uid_asset": "{{ _.uidAsset }}"
}'
```

Esperado **201**, uid em uidLinkedDevice. Asset e device precisam estar na mesma organização.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/assets/linked-devices/{{ _.uidLinkedDevice }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Repita o POST: **409**. Tentar vincular esse device a outro asset também deve falhar; um asset pode receber vários devices, cada device tem um único asset.

### 10.4 — transferência do conjunto e retorno

Pré-requisito: uidDestinationOrganization obtido por outra criação da fase 5, e ator administrando origem/destino. Com vínculo a asset, primeiro tente:

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/devices/{{ _.uidDevice }}/transfer' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidDestinationOrganization }}",
  "reason": "Transferência de homologação"
}'
```

Esperado **409** enquanto device estiver vinculado ao asset. Nenhuma organização deve mudar. Remova só o vínculo device–asset:

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/assets/linked-devices/{{ _.uidLinkedDevice }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **204**. Repita o POST de transferência acima: **200**. GET do device **e** GET do SIM devem mostrar uidDestinationOrganization; vínculo SIM–device continua. Sem permissão no destino, a operação é negada sem movimento parcial.

Retorne o conjunto para a organização original, preservando o cenário das próximas fases:

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/devices/{{ _.uidDevice }}/transfer' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "reason": "Retorno após homologação"
}'
```


### 10.5 — desativar e liberar SIM

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/devices/{{ _.uidDevice }}/lifecycle' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "state": "inactive",
  "reason": "Teste de retirada de operação"
}'
```

Esperado **200**, simcard_unlinked=true quando havia SIM. Repetir retorna false. Consultar estoque SIM deve continuar possível; o vínculo foi removido, não o SIM.

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/devices/{{ _.uidDevice }}/lifecycle' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "state": "active",
  "reason": "Final do teste"
}'
```

Esperado **200**. Reativação não refaz o vínculo. Se precisar dele, repita o POST linked-simcards e guarde o **novo** uidLinkedSIM.

Exclusão de inventário é outro teste, opcional e **ao final**: após remover vínculos, DELETE devices/uidDevice e DELETE simcards/uidSIM retornam 204; em uso retornam 409. Não exclua se ainda precisar desses UUIDs.

### 10.6 — slots e histórico de vínculos do asset — 0063–0064

Pré-requisitos: migrations 0058, 0062, 0063 e 0064 aplicadas conforme [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md), com API atualizada/reiniciada. Em um asset de teste, consulte os sete slots:

```bash
curl '{{ _.baseURL }}/v1/admin/assets/{{ _.uidAsset }}/device-slots' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado: slots 1 Principal, 2 Secundário, 3 Leitora RFID e 4–7 genéricos. Ajuste o nome do slot 3:

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/assets/{{ _.uidAsset }}/device-slots/3' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{"code":"rfid_reader","name":"Leitora da cabine"}'
```

Esperado 200. Depois de 0064, `POST/PUT/DELETE /v1/admin/assets/linked-devices` retorna 409 `device_work_order_required`; associe e troque devices pela OS conforme fase 16. Um slot ocupado não pode ser desativado. Consulte `GET /v1/admin/assets/{{ _.uidAsset }}/link_history`; a trilha detalhada é gravada no PostgreSQL e inclui before/after, slot, ator, request e nome do servidor mesmo depois da retirada. Faça a consulta com usuário sem escopo do asset e espere 404.

Os slots e o histórico são conferidos aqui; OS, atribuição a técnico e custódia são testados na fase 16, depois da criação do motorista na fase 15.

## Fase 16 — slots, Núcleo/OS, custódia e estoque de devices (0063–0064)

**Ordem de execução: passo 12.** Depende dos assets, devices e motorista/técnico criados antes.

Pré-requisito: migrations 0063–0064 e dependências aplicadas conforme [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md); fase 15 de motoristas e fase 10 de inventário também concluídas. Após o corte 0079–0082, crie pessoa e papel técnico conforme a seção inicial deste guia.

O pacote 0063–0064 e suas dependências devem estar aplicados, e o backend reiniciado, antes desta fase (veja [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)). Use Bearer Primary/Administrator com área `devices`, organização de teste autorizada, asset ativo e um registro ativo em `devices.technicians` na mesma organização após o corte 0079–0082. Até aplicar esse corte, use somente o contrato legado.

### Fase 16.1 — elegibilidade, técnico e operações de OS (0073)

Atualização: 0073–0076 foram aplicadas pelo operador e `migrations/tests/device_technician_workflow.sql` passou integralmente com `ROLLBACK`. A regressão valida requisito de SIM, transições do inventário, operação direta idempotente, auditoria e consistência de estado. A sequência de migrations corretivas preserva RLS e não concede DML ao papel da API. O contrato e os payloads estão em [device_technician_workflow.md](device_technician_workflow.md).

Para repetir a regressão SQL após mudanças futuras:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/device_technician_workflow.sql
```

1. Em Primary, crie/edite um modelo com `requires_simcard:false` e outro com `requires_simcard:true`. Confirme que device genérico sem transmissão/IMEI/SIM continua permitido; tente liberar o modelo obrigatório sem SIM e espere `409 device_required_simcard_missing`. Associe um SIM ativo e repita; deve liberar. Tente desativar/desvincular SIM obrigatório de device ativo; deve falhar sem alterar vínculo.
2. **Passo legado 0079–0085, apenas histórico:** ele usava `people.people` e `/v1/admin/people`; não repita esse fluxo após aplicar 0086. O roteiro alvo é criar a entidade prestadora pelo CRUD normal, associar o tipo pela rota `/v1/admin/entities/:uid/types`, e cadastrar executores opcionais em `/v1/admin/entities/technicians`, conforme a seção de corte 0086 no fim deste guia.
3. **Fluxo de OS/custódia legado; não executar nesta fase.** Para homologação HTTP atual, use somente a bateria `0092–0100` ao final deste guia. Ela cobre executor com e sem login, confirmação, conclusão por item, replay idempotente e recebimento físico.
4. Os passos antigos de retirada/substituição e recebimento também foram substituídos pela bateria HTTP `0092–0100` ao final deste guia; não os use como roteiro vigente.
5. Confirme que `require_work_order` é `true` por padrão e que operação direta sem OS retorna `409 device_work_order_required`. Configure `false` na organização de teste. Faça install/remove/replace direto com chave idempotente; primeira chamada cria histórico, retry idêntico retorna replay e reutilização da chave com body diferente dá conflito. Duas operações concorrentes no mesmo slot ou estado anterior divergente devem falhar sem estado parcial.
6. Consulte histórico e auditoria: instalação/substituição/retirada e OS devem identificar asset, slot, device antes/depois, ator e servidor. Verifique que `device_pwd` e material/chave de cifra nunca aparecem no before/after da auditoria. Primary/admin deve continuar vendo inventário autorizado; Basic técnico não deve ganhar acesso ao inventário geral ou a devices de outro asset.

Regressão SQL 0073–0076 confirmada pelo operador com `ROLLBACK`. 0089–0100 estão aplicadas; `device_technician_self_service.sql` passou com `ROLLBACK` e o replay HTTP idêntico de conclusão pelo executor foi aprovado. O replay HTTP administrativo e os demais testes HTTP seguem pendentes. A homologação HTTP de OS/custódia está consolidada exclusivamente na seção `OS e custódia por item — 0092–0100` ao final deste guia.

```sh
BASE_URL="http://127.0.0.1:8080"
TOKEN="TOKEN_ADMIN"
ASSET="UUID_ASSET"
TECHNICIAN="UUID_DRIVER" # usado somente pelo fluxo legado 16.3–16.5, não executar
```

### 16.1 Conferir os sete slots

```sh
curl "$BASE_URL/v1/admin/assets/$ASSET/device-slots" -H "Authorization: Bearer $TOKEN"
```

Esperado: sete slots, 1 Principal, 2 Secundário, 3 Leitora RFID e slots 4–7 editáveis. Slot ocupado não pode ser desativado. O PATCH de slot só muda `code`, `name` e/ou `active`:

```sh
curl -X PATCH "$BASE_URL/v1/admin/assets/$ASSET/device-slots/3" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d '{"name":"Leitora do motorista"}'
```

### 16.2 Preparar dois devices

Crie devices pela rota documentada em [devices.md](devices.md), usando catálogos válidos, `uid_organization` igual à organização do asset e um `Idempotency-Key` UUID novo por cadastro. Reenvie a chave somente para retry idêntico; mude a chave para criar o segundo device. Para cada UUID retornado execute:

```sh
curl -X POST "$BASE_URL/v1/admin/devices/$DEVICE_NOVO/prepare" -H "Authorization: Bearer $TOKEN"
curl -X POST "$BASE_URL/v1/admin/devices/$DEVICE_NOVO/release" -H "Authorization: Bearer $TOKEN"
```

Esperado: estados `preparing` e depois `available`. Repetir prepare/release fora do estado esperado dá 409. Consulte o inventário por `GET /v1/admin/devices` ou pesquise `inventory_status` pelo POST `/v1/admin/devices/search`.

### 16.3–16.5 Fluxo legado de OS/custódia — não executar

Os exemplos abaixo usam o contrato antigo (`UUID_DRIVER`, `dispatch → start → complete` e conclusão sem itens). São apenas referência histórica e não devem ser executados. A fonte única vigente para homologação HTTP de OS/custódia é a bateria `0092–0100` ao final deste guia.

Use uma Idempotency-Key UUID nova para cada nova OS. Retry do mesmo POST mantém a mesma chave; a resposta passa de 201 a 200 com `replayed:true`.

```sh
curl -X POST "$BASE_URL/v1/admin/devices/work-orders" \
 -H "Authorization: Bearer $TOKEN" -H "Idempotency-Key: 16400000-0000-4000-8000-000000000001" \
 -H "Content-Type: application/json" \
 -d "{\"uid_asset\":\"$ASSET\",\"uid_technician\":\"$TECHNICIAN\",\"description\":\"Instalar rastreador principal\",\"items\":[{\"slot_number\":1,\"operation\":\"install\",\"uid_device_before\":null,\"uid_device_after\":\"$DEVICE_1\"}]}"
```

Copie `uid` para `WORK_ORDER`. Execute dispatch, start e complete nesta ordem:

```sh
curl -X POST "$BASE_URL/v1/admin/devices/work-orders/$WORK_ORDER/dispatch" -H "Authorization: Bearer $TOKEN"
curl -X POST "$BASE_URL/v1/admin/devices/work-orders/$WORK_ORDER/start" -H "Authorization: Bearer $TOKEN"
curl -X POST "$BASE_URL/v1/admin/devices/work-orders/$WORK_ORDER/complete" -H "Authorization: Bearer $TOKEN"
```

Esperado: device instalado no slot 1, `inventory_status=installed`, OS `completed`. Repetir uma transição retorna 409; não duplica vínculo.

#### 16.4 Substituir o Principal e receber o antigo — legado

Prepare/libere `$DEVICE_2`. Crie outra OS (chave idempotente nova), agora com `operation=replace`, `uid_device_before=$DEVICE_1`, `uid_device_after=$DEVICE_2`. Despache, inicie e conclua como acima. Esperado: `$DEVICE_2` instalado e `$DEVICE_1` `return_pending`, sob custódia do técnico.

```sh
curl "$BASE_URL/v1/admin/devices/custody" -H "Authorization: Bearer $TOKEN"
```

Esperado: device antigo na lista; quando uma OS está despachada, devices novos também aparecem `with_technician`. Copie o `uid` da custódia do antigo e registre a entrega:

```sh
curl -X POST "$BASE_URL/v1/admin/devices/custody/$CUSTODY/receive" -H "Authorization: Bearer $TOKEN"
```

Esperado: `received` e inventário `cleaning_testing`. Após inspeção física, libere-o com `POST /v1/admin/devices/$DEVICE_1/release`; deve passar a `available`.

#### 16.5 Histórico, retirada e manutenção — legado

```sh
curl "$BASE_URL/v1/admin/assets/$ASSET/link_history" -H "Authorization: Bearer $TOKEN"
curl "$BASE_URL/v1/admin/devices/work-orders/$WORK_ORDER" -H "Authorization: Bearer $TOKEN"
```

Esperado: histórico cronológico de mudanças no asset com slot e before/after; OS inclui técnico e itens. Teste também `remove` (device_before atual e after null), `maintenance` (before e after iguais), e consulta/recebimento da custódia. Link direto via `/v1/admin/assets/linked-devices` deve falhar com 409 `device_work_order_required`, protegendo a trilha de serviço.

### 16.6 Negativos e auditoria

- Tente usar device ainda `new`/`preparing` na instalação: 409 `device_not_available_for_work_order`.
- Tente reservar slot já ocupado em outra OS pendente: 409; altere o estado da OS/slot antes de tentar de novo.
- Use técnico ou device de outra organização: 404/409, sem revelar dados fora do escopo.
- Crie OS sem Idempotency-Key: 400; chave igual/conteúdo diferente: 409 `idempotency_conflict`.
- Tente desativar slot ocupado ou aposentar device instalado: operação rejeitada.
- Consulte pelo `X-Request-Id` a auditoria dos work_orders, itens, custody, devices e vínculos. O histórico do asset deve mostrar ator, host, `server_name`, request_id, slot e snapshot antes/depois.

A validação SQL automatizada com rollback está em `migrations/tests/device_work_orders.sql`; execute apenas em banco de teste dedicado já migrado. Não rode essa fixture no banco compartilhado de homologação: ela cria e reverte registros de domínio.

## Fase 11 — pontos, cercas e rotas

**Ordem de execução: passo 13.** Execute depois da OS/inventário; esses registros serão usados nas regras de eventos.

#### SYS-GEO-01 — correção local preparada (0208 ainda não aplicada)

Depois de confirmar a 0207 e o pré-requisito PostGIS, revisar/aplicar `migrations/upgrade_geo_scope_grant_visibility.sql`. Para regressão isolada, execute `bash migrations/tests/run-geography.sh` em WSL/Linux local com PostgreSQL, `initdb`, `pg_ctl` e PostGIS instalados; o script cria seu próprio cluster descartável, percorre a cadeia completa, executa `migrations/tests/geography.sql` e a query real emitida por `filters.Manager` sob `navisoft_auth`. Verifique o resultado Primary positivo, Secondary cross-tenant vazio e SELECT direto da role da API negado. O agente ainda não executou esse runner nem acessou PostgreSQL operacional. Após aplicação e build/restart, reteste GET `/v1/admin/geo/geofences` e POST `/v1/admin/geo/geofences/search`, registrando status/corpo por perfil em [frontend_issues.md](frontend_issues.md). Não rode o wrapper antigo `upgrade_geography.sql` como correção.

Use escopo entity para não depender de criação de asset. Organização/entidade devem ser do mesmo ramo. PUT de geografia é completo; não envie só o nome.

### 11.1 — ponto de interesse

```bash
curl --header 'Idempotency-Key: 805d217a-34a7-5ebc-b02b-26e2811b4027' --request POST '{{ _.baseURL }}/v1/admin/geo/points' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope_level": "entity",
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "name": "Base homologação",
  "description": "Minha base de testes",
  "latitude": -23.55052,
  "longitude": -46.633308,
  "radius_meters": 120,
  "active": true
}'
```
Esperado **201**; guarde uidPoint. Latitude/longitude são números e raio está em metros.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/geo/points/{{ _.uidPoint }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/geo/points/{{ _.uidPoint }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope_level": "entity",
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "name": "Base homologação",
  "description": "Minha base de testes",
  "latitude": -23.55052,
  "longitude": -46.633308,
  "radius_meters": 150,
  "active": true
}'
```
Esperado **200**, raio=150 e o mesmo uid.

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/geo/points/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "q": "Base homologação",
  "filters": [
    {
      "field": "uid_entity",
      "operator": "eq",
      "value": "{{ _.uidEntity }}"
    }
  ]
}'
```

### 11.2 — resolver descrição (exige uidAsset do mesmo ramo)

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/geo/points/resolve' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_asset": "{{ _.uidAsset }}",
  "latitude": -23.55052,
  "longitude": -46.633308
}'
```

Esperado **200**, uid_poi=uidPoint e poi_description="Minha base de testes", desde que não exista POI mais específico/prioritário nessa posição.

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/geo/points/resolve' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_asset": "{{ _.uidAsset }}",
  "latitude": 0,
  "longitude": 0
}'
```

Esperado **200**, uid_poi/poi_description null se não houver outro POI aplicável. Isso testa a resolução via API, não o pipeline futuro de posições.

### 11.3 — círculo e polígono

```bash
curl --header 'Idempotency-Key: 2f95cb93-5a87-5e06-9914-81a27f039b32' --request POST '{{ _.baseURL }}/v1/admin/geo/geofences' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope_level": "entity",
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "name": "Garagem homologação",
  "shape": "circle",
  "latitude": -23.55052,
  "longitude": -46.633308,
  "radius_meters": 80,
  "entry_margin_meters": 5,
  "exit_margin_meters": 10,
  "active": true
}'
```
Esperado **201**, uidCircle.

```bash
curl --header 'Idempotency-Key: 0d9882e7-33ed-5ecd-96b9-e14270825d1e' --request POST '{{ _.baseURL }}/v1/admin/geo/geofences' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope_level": "entity",
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "name": "Pátio homologação",
  "shape": "polygon",
  "geojson": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          -46.64,
          -23.55
        ],
        [
          -46.62,
          -23.55
        ],
        [
          -46.62,
          -23.56
        ],
        [
          -46.64,
          -23.55
        ]
      ]
    ]
  },
  "entry_margin_meters": 5,
  "exit_margin_meters": 10,
  "active": true
}'
```

Esperado **201**, uidPolygon. GeoJSON usa **[longitude, latitude]**; o último vértice fecha o anel.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/geo/geofences/{{ _.uidPolygon }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/geo/geofences/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": [
    {
      "field": "shape",
      "operator": "eq",
      "value": "circle"
    },
    {
      "field": "uid_entity",
      "operator": "eq",
      "value": "{{ _.uidEntity }}"
    }
  ]
}'
```

Esperado **200**, a busca retorna o círculo, não o polígono. Troque latitude por 100 no círculo, ou radius_meters por -1: **422**, sem criação. Polígono autointersectado também é inválido. Cercas não emitem alertas nesta etapa.

### 11.4 — rota ordenada

```bash
curl --header 'Idempotency-Key: 6372d2c2-7f58-57e5-a624-25ed2e2c85cc' --request POST '{{ _.baseURL }}/v1/admin/geo/routes' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope_level": "entity",
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "name": "Rota homologação",
  "description": "Corredor autorizado",
  "lateral_margin_meters": 80,
  "max_speed_kmh": 60,
  "active": true,
  "points": [
    {
      "longitude": -46.63,
      "latitude": -23.55,
      "max_speed_to_next_kmh": 40
    },
    {
      "longitude": -46.61,
      "latitude": -23.54
    }
  ]
}'
```
Esperado **201**, uidRoute. Mínimo dois pontos distintos, na ordem do percurso. Velocidade do primeiro segmento=40 km/h, default da rota=60 km/h.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/geo/routes/{{ _.uidRoute }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/geo/routes/{{ _.uidRoute }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope_level": "entity",
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_entity": "{{ _.uidEntity }}",
  "name": "Rota homologação",
  "description": "Corredor autorizado",
  "lateral_margin_meters": 100,
  "max_speed_kmh": 60,
  "active": true,
  "points": [
    {
      "longitude": -46.63,
      "latitude": -23.55,
      "max_speed_to_next_kmh": 40
    },
    {
      "longitude": -46.61,
      "latitude": -23.54
    }
  ]
}'
```

Esperado **200**, pontos preservados e margem=100. Enviar só um ponto deve retornar **422**.

### 11.5 — exclusão e isolamento

No final dos testes que precisarem dessa geografia:

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/geo/points/{{ _.uidPoint }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/geo/geofences/{{ _.uidCircle }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/geo/geofences/{{ _.uidPolygon }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/geo/routes/{{ _.uidRoute }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **204**; GET do registro excluído retorna **404**, lista deixa de trazê-lo. Essas exclusões são lógicas. Não execute agora se associar essas referências a outras regras.

Com usuário sem vínculo, GET deve negar/ocultar o registro; listagem não pode trazê-lo. Basic só acessa a geografia permitida pelos vínculos e áreas; não deve alterar geografia de entidade inteira por ter um único asset.

## Fase 12 — eventos administrativos

**Ordem de execução: passo 14.** Este módulo configura os eventos; o processador e o envio de notificações continuam pendentes.

### 12.1 — buscar os modelos padrão

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/events/models' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/events/models/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": [
    {
      "field": "category",
      "operator": "eq",
      "value": "mechanical"
    }
  ]
}'
```

Esperado **200**, items/total. A busca mechanical é um subconjunto. Na **lista completa**, guarde os UUIDs pelo code:

| code | Variável |
|---|---|
| ignition_change | uidIgnitionModel |
| panic | uidPanicModel |
| anchor_exit | uidAnchorModel |
| assets_without_transmission | uidPeriodicModel |

Não use UUID de modelo de device/asset aqui. Modelos de evento já vêm da migration.

### 12.2 — cadastrar destinatário

```bash
curl --header 'Idempotency-Key: 990c3da4-00ee-58f4-b71f-d4a2c4e2a8a7' --request POST '{{ _.baseURL }}/v1/admin/events/recipients' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "kind": "organization_admins",
  "channel": "email",
  "verified": false,
  "active": true
}'
```

Esperado **201**, uidRecipient. Este exemplo usa administradores da organização, sem endereço externo e sem uid_user. kind=user exige uid_user; external exige value. A API não envia email nesta etapa.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/events/recipients/{{ _.uidRecipient }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/events/recipients/{{ _.uidRecipient }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "kind": "organization_admins",
  "channel": "email",
  "verified": false,
  "active": true
}'
```

Esperado **200**. Não marcar endereço externo como verified sem verificação real do destinatário.

### 12.3 — regra de ignição e janela de sábado a segunda

```bash
curl --header 'Idempotency-Key: 7ac21e01-e352-575e-8a59-43928425f7ae' --request POST '{{ _.baseURL }}/v1/admin/events/rules' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_model": "{{ _.uidIgnitionModel }}",
  "name": "Ignição no fim de semana",
  "priority": "high",
  "parameters": {
    "states": [
      "on",
      "off"
    ]
  },
  "valid_from": null,
  "valid_until": null,
  "condition_for_seconds": 0,
  "recovery_for_seconds": 0,
  "active": true,
  "targets": [
    {
      "scope_level": "entity",
      "uid_organization": "{{ _.uidCustomerOrganization }}",
      "uid_entity": "{{ _.uidEntity }}"
    }
  ],
  "windows": [
    {
      "start_isodow": 6,
      "start_time": "14:00",
      "end_isodow": 1,
      "end_time": "07:00"
    }
  ],
  "recipients": [
    "{{ _.uidRecipient }}"
  ]
}'
```

Esperado **201**, uidRule. Sábado=6 e segunda=1. A janela atravessa a semana; não precisa criar três regras. O motor futuro interpretará transições on/off, uma ocorrência por transição, sem 1X Dia/1X Tipo.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/events/rules/{{ _.uidRule }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/events/rules/{{ _.uidRule }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_model": "{{ _.uidIgnitionModel }}",
  "name": "Ignição no fim de semana revisada",
  "priority": "high",
  "parameters": {
    "states": [
      "on",
      "off"
    ]
  },
  "valid_from": null,
  "valid_until": null,
  "condition_for_seconds": 0,
  "recovery_for_seconds": 0,
  "active": true,
  "targets": [
    {
      "scope_level": "entity",
      "uid_organization": "{{ _.uidCustomerOrganization }}",
      "uid_entity": "{{ _.uidEntity }}"
    }
  ],
  "windows": [
    {
      "start_isodow": 6,
      "start_time": "14:00",
      "end_isodow": 1,
      "end_time": "07:00"
    }
  ],
  "recipients": [
    "{{ _.uidRecipient }}"
  ]
}'
```

Esperado **200**, targets/windows/recipients preservados porque foram reenviados. PUT substitui essas listas; não use corpo parcial.

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/events/rules/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "{{ _.uidCustomerOrganization }}"
    }
  ],
  "q": "Ignição"
}'
```

Esperado **200**. Acrescente parameters.campo_inexistente ao corpo de criação: **422**. Modelo periódico no lugar de ignition_change também deve ser recusado. Destinatário de outra organização nunca deve ser aceito.

### 12.4 — desabilitar um evento fixo

```bash
curl --header 'Idempotency-Key: 446821e5-26c7-599b-a94f-281b20b147f7' --request POST '{{ _.baseURL }}/v1/admin/events/fixed-policies' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_model": "{{ _.uidPanicModel }}",
  "scope_level": "entity",
  "uid_entity": "{{ _.uidEntity }}",
  "enabled": false
}'
```

Esperado **201**, uidFixedPolicy. Esta configuração desabilita panic na entidade para o futuro avaliador, sem apagar seu modelo.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/events/fixed-policies/{{ _.uidFixedPolicy }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/events/fixed-policies/{{ _.uidFixedPolicy }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_model": "{{ _.uidPanicModel }}",
  "scope_level": "entity",
  "uid_entity": "{{ _.uidEntity }}",
  "enabled": true
}'
```

Esperado **200**. Uma desabilitação superior continua prevalecendo no contrato do avaliador.

### 12.5 — suspensão temporária do asset (0059)

Pré-requisito: migration 0059 aplicada e API reiniciada conforme [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). Ela não depende de drivers 0058. O exemplo representa o veículo na oficina; não suspende a entidade nem bloqueia login.

Defina suspensionStartsAt e suspensionEndsAt com instantes ISO 8601 contendo Z ou offset; o término deve ser posterior ao início. uidAsset é o asset criado na fase 9.

```bash
curl --header 'Idempotency-Key: 1923ef1f-9c69-51b7-a820-c9447dc64037' --request POST '{{ _.baseURL }}/v1/admin/events/suspensions' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_asset": "{{ _.uidAsset }}",
  "starts_at": "{{ _.suspensionStartsAt }}",
  "ends_at": "{{ _.suspensionEndsAt }}",
  "reason": "Veículo na oficina por três dias"
}'
```

Esperado **201**, uidSuspension; repetir a intenção com a mesma chave retorna **200**, mesmo uid. Motivo é opcional. Organização/entidade, active, created_at, updated_at, uid_user_created e uid_user_updated são preenchidos pelo servidor. Não enviar scope_level, uid_model, organização, entidade nem campos de controle no body. Abrange todos os modelos de evento do asset durante a janela; não interrompe recepção de posições. A aplicação efetiva depende do processador futuro.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/events/suspensions/{{ _.uidSuspension }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

PUT/PATCH não existem (**405**). Para mudar o período, cancele e crie outra suspensão, com nova chave. Datas invertidas, horário sem fuso ou tentativa de forjar campos de controle devem retornar **422**; asset fora do alcance deve ser rejeitado.

Cancelamento (também utilizado na limpeza do roteiro):

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/events/suspensions/{{ _.uidSuspension }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **204**; novo GET dá **404**. Se cancelar aqui, não repita o DELETE na limpeza esperando outro 204. O registro fica cancelado com deleted_at, updated_at e uid_user_updated; a autoria original é preservada. Não há purge automático: tarefa do binário posterior à API em [purge_worker_design.md](purge_worker_design.md).

### 12.6 — relatório periódico

```bash
curl --header 'Idempotency-Key: f2122ca0-2718-5940-8004-d6921d5acbf8' --request POST '{{ _.baseURL }}/v1/admin/events/periodic-reports' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_model": "{{ _.uidPeriodicModel }}",
  "name": "Sem transmissão 12 24 48 horas",
  "threshold_hours": [
    12,
    24,
    48
  ],
  "run_isodow": [
    1,
    2,
    3,
    4,
    5
  ],
  "run_at": "08:00",
  "recipients": [
    "{{ _.uidRecipient }}"
  ],
  "active": true
}'
```

Esperado **201**, uidPeriodicReport. Limiares em horas, dias ISO e horário local segundo o contrato de fuso; isto cadastra o relatório, não consulta posições agora.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/events/periodic-reports/{{ _.uidPeriodicReport }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PUT '{{ _.baseURL }}/v1/admin/events/periodic-reports/{{ _.uidPeriodicReport }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_model": "{{ _.uidPeriodicModel }}",
  "name": "Sem transmissão 12 24 48 horas",
  "threshold_hours": [
    12,
    24,
    48
  ],
  "run_isodow": [
    1,
    2,
    3,
    4,
    5
  ],
  "run_at": "09:00",
  "recipients": [
    "{{ _.uidRecipient }}"
  ],
  "active": true
}'
```

Esperado **200**, run_at=09:00, destinatários e limiares preservados. Dia ISO 8 ou limiar negativo deve retornar **422**.

### 12.7 — âncora (depende de uidAsset)

Defina anchorExpiresAt como instante UTC futuro. A posição do exemplo é enviada pelo cliente porque a API de última posição ainda não foi entregue.

```bash
curl --header 'Idempotency-Key: f3179bed-95bb-555e-b8a2-7758659d8edd' --request POST '{{ _.baseURL }}/v1/admin/events/activations' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "uid_organization": "{{ _.uidCustomerOrganization }}",
  "uid_model": "{{ _.uidAnchorModel }}",
  "uid_asset": "{{ _.uidAsset }}",
  "latitude": -23.55052,
  "longitude": -46.633308,
  "radius_meters": 100,
  "expires_at": "{{ _.anchorExpiresAt }}"
}'
```

Esperado **201**, uidActivation. Um novo POST para o mesmo asset ainda armado deve retornar **409**.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/events/activations' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/events/activations/{{ _.uidActivation }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **204** no DELETE: desarma e conserva histórico. Consulte a lista para verificar status. Não existe GET individual/PUT da ativação nesta versão. Alerta de saída depende do processador futuro.

### 12.8 — ocorrências: consulta e tratamento condicionado

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/events/occurrences' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **200**, possivelmente items=[] e total=0. Lista vazia não é falha: não há processador produzindo ocorrências neste pacote. **Sem ocorrência real ou fixture autorizado, marque os testes seguintes como bloqueados**, não invente UUID nem faça INSERT no banco operacional para simular aprovação.

```bash
curl --request GET '{{ _.baseURL }}/v1/admin/events/occurrences/{{ _.uidOccurrence }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/events/occurrences/{{ _.uidOccurrence }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "action": "acknowledge"
}'
```

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/events/occurrences/{{ _.uidOccurrence }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "action": "note",
  "note": "Cliente contatado na homologação"
}'
```

```bash
curl --request PATCH '{{ _.baseURL }}/v1/admin/events/occurrences/{{ _.uidOccurrence }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "action": "close",
  "resolution": "Tratamento da ocorrência de teste finalizado"
}'
```

Esperado **200** conforme estado e autorização; reconhecer vem antes de fechar. Basic pode ler ocorrência de asset autorizado, mas não tratá-la. Não existe POST administrativo para forjar ocorrência.

### 12.9 — remover configurações de teste

Execute só depois de conferir as consultas e atualizações. Remova dependentes antes do destinatário:

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/events/rules/{{ _.uidRule }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/events/periodic-reports/{{ _.uidPeriodicReport }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/events/fixed-policies/{{ _.uidFixedPolicy }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/events/suspensions/{{ _.uidSuspension }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

```bash
curl --request DELETE '{{ _.baseURL }}/v1/admin/events/recipients/{{ _.uidRecipient }}' \
  --header 'Authorization: Bearer {{ _.primaryToken }}'
```

Esperado **204**; destinatário ainda referenciado deve retornar **409**. Regras, suspensões e relatórios usam exclusão lógica; política fixa/destinatário seguem seus contratos. Confirme listas e GET após exclusão.

## Fase 13 — filtros, auditoria e falhas

**Ordem de execução: passo 15, junto com os testes automatizados da Fase 14.**

### 13.1 — pesquisa válida e negativa

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/devices/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "q": "HOMOLOG",
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "{{ _.uidCustomerOrganization }}"
    }
  ]
}'
```

Esperado **200**, somente registros autorizados.

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/devices/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": [
    {
      "field": "campo_inexistente",
      "operator": "eq",
      "value": "x"
    }
  ]
}'
```

Esperado **422**. Corpo filters como objeto em vez de lista causa **400 invalid_search_request**:

```bash
curl --request POST '{{ _.baseURL }}/v1/admin/events/models/search' \
  --header 'Authorization: Bearer {{ _.primaryToken }}' \
  --header 'Content-Type: application/json' \
  --data '{
  "filters": {
    "category": {
      "eq": "mechanical"
    }
  }
}'
```

Nenhuma busca exige Idempotency-Key. Com secondaryToken, consultar UUID de organização fora dos vínculos não deve trazer dados; filtro nunca é concessão de acesso.

### 13.2 — auditoria sem imprimir segredos

Guarde X-Request-Id da resposta de uma criação/alteração. No servidor PostgreSQL, substitua REQUEST_ID pelo valor real:
```bash
psql -d autoscale_nvs_db -c "SELECT created_at, event_type, record_uid, uid_actor, host, server_name, request_id FROM audit.events WHERE request_id='REQUEST_ID' ORDER BY created_at;"
psql -d autoscale_nvs_db -c "SELECT kind, attempts, submitted_at, acknowledged_at, last_error_code FROM messaging.outbox ORDER BY created_at DESC LIMIT 20;"
```

- [ ] Conferir ator, registro e identificação do binário/servidor.
- [ ] Não esperar uma linha por mensagem exclusivamente do teste na consulta da outbox: ela também contém outras operações. Correlacionar pelo horário e identificadores sem expor payload sensível.
- [ ] submitted_at indica submissão registrada; não comprova que email foi entregue. acknowledged_at depende do fluxo consumidor.

### 13.3 — erros e recuperação

| Resultado | O que conferir |
|---|---|
| 401 | Token atual, Never Resend, logout/expiração/bloqueio; fazer login conscientemente |
| 403 | Perfil, área e vínculos; não resolver concedendo role interna ao login PostgreSQL |
| 404 | UUID correto, exclusão lógica, escopo e include_inactive nos recursos suportados |
| 409 | Identidade duplicada, vínculo exclusivo ou FK em uso; consultar antes de repetir POST |
| 422 | Campos obrigatórios, tipos JSON, UUIDs, geometria e parâmetros do modelo |
| 503 | Migration e dependência indisponível; correlacionar log pelo X-Request-Id |

Teste de falha deve usar instância de homologação dedicada: com RabbitMQ indisponível, cadastro permanece salvo e outbox conserva trabalho para retry; com PostgreSQL indisponível, a API não pode devolver sucesso de gravação. Não interrompa serviços compartilhados durante outros testes. Isso é teste manual pendente, não evidência já obtida por executar os curls acima.

## Fase 14 — testes automatizados

**Ordem de execução: passo 15.** Rode após concluir os testes funcionais e registrar os resultados.

Na raiz do repositório:
```bash
go test ./...
go vet ./...
go build ./cmd/...
node migrations/tests/run.mjs
node migrations/tests/run-lifecycle.mjs
```

Esperado: exit code 0. run.mjs cobre núcleo até 0043 e semântica independente 0047; run-lifecycle.mjs cobre cenário isolado de 0051. Nenhum dos dois certifica os módulos PostGIS.

Com PostgreSQL/PostGIS local disponível:
```bash
bash migrations/tests/run-geography.sh
bash migrations/tests/run-events.sh
```

Esses scripts precisam das ferramentas PostgreSQL locais e criam clusters descartáveis. Não apontar suas fixtures para o banco de homologação compartilhado. Falta de initdb/pg_ctl/PostGIS é pré-requisito ausente, não teste aprovado.

## Events Core — 0184/0185 aplicadas; regressões pendentes

0184 e 0185 foram aplicadas conforme a execução operacional. Depois da correção de EXECUTE em `rule_format()`, `events.sql` avançou e falhou porque o teste tentava consultar `events.occurrences` sob `navisoft_auth`, sem SELECT. A regressão foi ajustada para transportar o UID por GUC transacional e testar `occurrence_get()` sem acesso direto à tabela. Reexecute:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/events_rule_format_owner_execute.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/events.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/events_engine_foundation.sql
```

O teste termina em `ROLLBACK`. Para exercitar a conversão real de regras legadas com vários alvos OR, use somente o runner local descartável, que carrega uma fixture entre 0183 e 0184:

```bash
bash migrations/tests/run-events.sh
```

O runner executa a fixture legada e regressões em cluster descartável; não o aponte ao PostgreSQL compartilhado. As falhas `min(uuid)` e colisão alias/variável foram corrigidas em 0184; a permissão de `rule_format()` foi corrigida em 0185. A tentativa atual de `events.sql` falhou porque o teste consultava a tabela diretamente como `navisoft_auth`; após essa correção do teste, as regressões e a homologação HTTP ainda aguardam confirmação.

Após a migration, o teste HTTP deve ser feito em etapas: primeiro `GET /v1/admin/events/fields`; depois criar uma única regra com `target` composto e uma condição booleana AND; em seguida verificar GET/list e `scope_level` derivado. Negativos para mais de um alvo legado, valor tipado incorreto e dimensão incompatível devem ser executados individualmente. Esses curls ainda não constituem evidência de homologação; nenhum Event Engine ou processamento de posição faz parte do teste.

O roteiro manual valida HTTP real; testes descartáveis validam SQL/RLS/rollback. A entrega de security email foi homologada separadamente. Os testes de telemetria e alertas continuam pendentes enquanto seus consumidores não forem implementados.

## Fase futura — manutenção preventiva de assets

Maintenance geral manual da Fase 1 foi aplicada e homologada em 0171; Checklist → Maintenance 1.5 foi aplicada e homologada em 0172, conforme o estado consolidado no início deste guia. Esta seção cobre somente uma fase futura: séries/offsets e medidores monotônicos, seleção de fonte entre vários devices, planos por tempo/km/horímetro, alvos por organização/entidade/unidade/grupo/tipo/modelo/asset, política `any/all`, transições `due_soon/overdue` sem repetição, conclusão transacional, componentes e integração com ocorrências. Isso não faz parte das fases implementadas. Referência futura: [maintenance_design.md](maintenance_design.md).

## Registro histórico da homologação de 24/09/2026

Este registro é histórico: as fases 8–13 foram executadas com migrations até 0057. Não marca como concluída a sequência atual nem as migrations posteriores. Consulte [resultados e limites](HOMOLOGATION_8_13_RESULTS.md) e [evidências por requisição](evidence/2026-09-24-api.json). Os cadastros HOMOLOG-813 permanecem identificados para inspeção; a conta temporária foi desativada e suas sessões revogadas.



## Validações adicionais após o roteiro principal

**Ordem de execução: passo 16.** Branding, recuperação/verificação e ciclo de vida reutilizam as contas e cadastros criados nas etapas anteriores.

Os testes abaixo complementam as fases principais. Sua posição aqui é intencional: use as contas e os registros criados no roteiro antes de executá-los.

## Branding e tema dinâmico — 0061

Manual: [organization_branding.md](organization_branding.md). Pré-requisito: migrations 0060–0061 aplicadas e API reiniciada conforme [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). Faça login e confirme `session.token`, `session.authenticated_at`, `session.previous_login_at` e `organization.branding.theme`. No primeiro login bem-sucedido o `previous_login_at` é `null`; em logins seguintes deve mostrar o horário bem-sucedido anterior. `organization.branding.logo_url` será `null` se a organização e seus owners ainda não têm logo.

Como Primary, personalize uma organização de teste:

```bash
curl -i -X PUT 'http://127.0.0.1:8080/v1/admin/organizations/UUID_ORGANIZACAO_TESTE/branding' \
  -H 'Authorization: Bearer TOKEN_PRIMARY' -H 'Content-Type: application/json' \
  -d '{"theme":{"primary":"#7C3AED","header":{"background":"#111827","text":"#FFFFFF"}}}'
```

Esperado 200 com as cores alteradas e os demais tokens preenchidos pelos defaults/herança. `GET /v1/branding/current` com token de usuário dessa organização deve retornar o mesmo tema. Faça `PATCH` com `{"theme":{"success":"#15803D"}}`: as cores anteriores permanecem e success muda. Faça `PATCH` com `{"theme":{"primary":null}}`: primary retorna ao valor herdado. `PUT` com `{"theme":{}}` limpa todos os overrides próprios.

Abra o SSE com token da organização e altere de novo uma cor com Primary. Esperado evento `status` com o novo objeto `branding` logo após o commit; a revalidação periódica `auth.status_stream.revalidate` é o fallback. Confirme a imagem enviando logo pela rota existente `/v1/admin/images/organization/UUID?link=true`; SSE, login e status refletem a nova `logo_url`. Baixe a URL com Bearer.

Teste negativo: `#FFF` ou token desconhecido retorna 422; sem permissão/vínculo retorna 403; sem sessão retorna 401. Os GET/PATCH/PUT de branding não usam `Idempotency-Key`. Registre o resultado em [organization_branding.md](organization_branding.md) e confira auditoria da alteração.

## Recuperação de senha e verificação de contatos — 0062

Manual completo: [auth_recovery.md](auth_recovery.md). Migrations 0130–0133 foram confirmadas aplicadas pelo operador. Não reaplique-as nesse banco. O fluxo usa config `auth.security_flows`, chave AES e credencial de integração da organização; a API agenda o dispatch in-process após commit, sem worker Rabbit de security notifications. A confirmação de entrega real abaixo veio de homologação manual, não da regressão SQL.

**Contact verification — homologado manualmente por HTTP:**

- [x] Solicitação autenticada de verificação de email retornou 202 e `challenge_id`; Core despachou diretamente para Autoscale Notifications e o email real chegou.
- [x] Confirmação do contato por meio do challenge recebido.
- [x] Cooldown configurável: requisição durante o período retornou 429; `Retry-After` e `retry_after_seconds` refletiram o tempo restante conforme o contrato.

**MFA — homologado manualmente por HTTP:**

- [x] `GET /v1/users/security` começou com MFA desabilitado; preferência pessoal foi habilitada.
- [x] Login exigindo MFA retornou `pending_mfa`; email de login chegou. O Bearer pendente mostrou `authenticated=false` no Status e não acessou rota de negócio.
- [x] Challenge correto promoveu a mesma `uid_session`; o mesmo Bearer passou a `authenticated=true`, `state=active`, e rota normal foi aceita.
- [x] Código errado retornou 422; código correto após erro ainda promoveu a sessão.
- [x] Com limite 5, tentativas incorretas 1–4 retornaram 422 e a quinta retornou 429 `mfa_attempt_limit_reached`; a sessão pendente foi revogada, `relogin_required=true` e o Bearer revogado falhou depois.
- [x] Política organizacional `require_mfa=true` continuou exigindo MFA mesmo com preferência pessoal `require_mfa=false`; novo login também exigiu MFA.
- [x] Challenge confirmado de IP diferente retornou 403 `mfa_client_ip_mismatch`.

**Evidências distintas:** o operador confirmou migrations 0130–0133 aplicadas. `migrations/tests/identity_mfa.sql` está aprovado com `ROLLBACK` para 0127–0129. Não inferir aprovação das regressões SQL de 0130–0133 somente a partir da aplicação ou da homologação HTTP; registre os resultados SQL pelos outputs dos próprios scripts. Testes Go locais são reportados separadamente na entrega da Fase 2.

**Ainda fora da homologação registrada:** frontend `/recovery` e `/verify-contact`, SMS, e qualquer caso de password recovery não listado acima. O endpoint público de password recovery continua respondendo genericamente contra enumeração.

Para outro banco que ainda não tenha as versões, o wrapper idempotente aplica 0131→0132→0133 depois de 0130; não execute no banco cuja aplicação já foi confirmada. Para regressões SQL, execute cada arquivo isoladamente e exija `ROLLBACK`:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/identity_mfa.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/security_notification_dispatch.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/integration_tokens.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/contact_verification_request.sql
```
## Validação funcional do ciclo de vida — migration 0051

Manual completo: [lifecycle.md](lifecycle.md). Pré-requisito: migration 0051 e dependências aplicadas conforme [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md). A 0125 corrige a origem das dimensões do asset; a 0126 concede somente os EXECUTEs dos dois helpers de frota ao owner lifecycle. O operador confirmou que a regressão SQL passou integralmente com `ROLLBACK`, incluindo os gates do asset por administrador delegado. O bloco abaixo serve para reaplicar/verificar o wrapper e repetir a regressão quando necessário:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_lifecycle_asset_scope.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/lifecycle.sql
```

O teste SQL termina em `ROLLBACK` e cobre lifecycle em asset por Primary e administrador delegado com scope, negação para Basic, negação de asset inexistente e EXECUTEs mínimos do owner lifecycle. A fixture prepara o administrador com `organizations_access='selected'`, valida seu acesso, recria o grant hierárquico da conta de suporte `b3` por `users.admin_save()` e usa temporariamente `app.include_inactive=true` durante essa leitura administrativa. O operador confirmou que a regressão passou integralmente com `ROLLBACK`. Isso não marca os testes HTTP abaixo como executados. Não altere autorização de produção para fazer a regressão passar.

- [ ] Fazer login Primary; no Insomnia usar **Never Resend** no token dinâmico. Guardar também tokens de um administrador da revenda e de um cliente dela. Não regenerar token automaticamente durante testes de revogação.
- [ ] PATCH `{{ _.baseURL }}/v1/admin/entities/{{ _.uidEntity }}` com `{"name":"Filial de homologação"}`. Esperado 200; UUID, organização, unidade e demais campos preservados. Não enviar Idempotency-Key.
- [ ] Repetir para organization (name), asset (identification), device (device_serial), SIM (operator_name) e user (name). Conferir unicidade, campos preservados e senha do device intacta. Tabela de campos permitidos em lifecycle.md.
- [ ] Enviar `{}`, `{"name":null}` em entidade e `{"is_ultra_master":true}` em organização: 422, sem alteração. Administrador de outra organização: 403. Basic: escrita negada.
- [ ] Configurar PUT `/v1/admin/organizations/{uidRevenda}/administrative-contact` com `{"name":"Financeiro da revenda","email":"financeiro@example.test","phone":"+552100000000","message":"Procure nosso financeiro para regularizar o acesso."}`. GET deve devolver os dados.
- [ ] Abrir SSE com token do cliente. Como Primary, PATCH `/v1/admin/organizations/{uidRevenda}/lifecycle` com `{"state":"blocked","reason":"Teste de inadimplência"}`. Esperado 200, state/effective_state blocked, ingestion_allowed true, operations_allowed false.
- [ ] Tokens da revenda e dos clientes deixam de autorizar consultas; SSE sinaliza perda da sessão. Novo login com senha correta retorna 423 com contato responsável. Senha errada continua invalid_credentials. Conta de suporte pertencente à revenda também é impedida.
- [ ] Primary consulta o cadastro bloqueado. Basic de outra organização, mesmo com vínculo ao registro bloqueado, não o vê. Um administrador sem vínculo também não o vê.
- [ ] Como Primary, desativar individualmente uma entidade da revenda pelo PATCH lifecycle, state inactive e motivo. Reativar a revenda com state active. GET lifecycle da entidade continua inactive; tokens antigos continuam revogados. Fazer novo login.
- [ ] Lista normal omite a entidade e seus assets; lista com `?include_inactive=true` permite ao administrador autorizado consultar histórico. POST de pesquisa aceita `{"include_inactive":true,"filters":[]}`. Basic não ganha acesso a inativos. GET individual histórico também usa o parâmetro.
- [ ] Tentar bloquear/desativar a Autoscale: 409 autoscale_protected; conferir que permanece ativa.
- [ ] Desativar device vinculado a SIM: resposta simcard_unlinked true, vínculo removido. Repetir: false. Reativar device não refaz vínculo. Bloquear organização não remove seus vínculos de inventário.
- [ ] Conferir auditoria de estado/contato e logs pelo request_id, host e server_name. Reverter os estados dos dados de homologação e fazer novo login.

Pendente de componentes futuros: comprovar ingestão de posições sob bloqueio, suspensão de eventos operacionais, avisos de cobrança, backup e purge. Não fazem parte do processador entregue nesta etapa.

## Motoristas, entidades prestadoras e executores — 0086–0096 aplicadas; regressões SQL aprovadas

O corte remove o cadastro genérico `people.people`. `drivers.drivers` é independente e conserva seus campos legais próprios. A entidade com tipo `technician` é a empresa prestadora. A entidade pode existir sem executor; executores individuais são opcionais em `devices.technicians`, obrigatoriamente subordinados a uma prestadora ativa da mesma organização. Não existe deduplicação ou vínculo transversal entre motorista e executor.

Crie a empresa prestadora pelas rotas de entidades e substitua sua lista de tipos com `PUT /v1/admin/entities/:uid/types`, por exemplo:

```bash
curl --request PUT \
  --url "{{ _.baseURL }}/v1/admin/entities/ENTITY_UUID/types" \
  --header "Authorization: Bearer {{ _.primaryToken }}" \
  --header "Content-Type: application/json" \
  --data '{"types":["TECHNICIAN_TYPE_UUID","SUPPLIER_TYPE_UUID"]}'
```

O body substitui todos os tipos da entidade; preserve os tipos que devem continuar associados. Executor é opcional. Para cadastrar um executor, envie nome, organização e UID da prestadora:

```bash
curl --request POST \
  --url "{{ _.baseURL }}/v1/admin/entities/technicians" \
  --header "Authorization: Bearer {{ _.primaryToken }}" \
  --header "Idempotency-Key: {{ _.newUuid }}" \
  --header "Content-Type: application/json" \
  --data '{"uid_organization":"ORG_UUID","uid_provider_entity":"ENTITY_UUID","name":"José Silva","birth_date":"1988-04-03","active":true}'
```

Listagem usa POST `/v1/admin/entities/technicians/search` com `uid_organization eq UUID`; GET por UID segue o mesmo corte organizacional no PostgreSQL.

### Estado SQL e retomada da homologação HTTP

O operador confirmou 0086–0096 aplicadas. As regressões `driver_technician_cutover.sql`, `entity_technician_type_guard.sql`, `device_custody_receipt_confirmation.sql` e `device_technician_self_service.sql` passaram com `ROLLBACK`. O `503 event_storage_unavailable` observado anteriormente na rota de tipos foi corrigido no Go; recompile/reinicie o binário atualizado e faça o reteste HTTP.

```bash
go run ./cmd/navisoft -config config.json
```

Com o binário atualizado, repita o teste HTTP do passo 4: substitua os tipos de uma entidade com executor vinculado por uma lista sem `technician`. Esperado: HTTP `409` com `{"message":"technicians_attached"}` e tipos anteriores inalterados. As regressões de custódia e self-service passaram com `ROLLBACK`; não é necessário repeti-las para iniciar HTTP. A regressão self-service verifica vínculos por `devices.link_list()` e não por leitura direta de `assets.linked_devices`.

```bash
Para testar o login opcional do executor e o isolamento das rotas `/v1/technician/...`, siga exclusivamente a bateria HTTP `0092–0100` ao final deste guia. Esta seção cobre o cadastro do executor e não duplica os testes de OS/custódia.

1. Criar uma entidade prestadora pelo CRUD de entidades; atribuir o tipo `technician` com `PUT /v1/admin/entities/:uid/types`, preservando outros tipos existentes.
2. Confirmar que a entidade prestadora não precisa de executor. Criar executor em `POST /v1/admin/entities/technicians`, informando `uid_organization`, `uid_provider_entity`, `name` e, se disponível, `birth_date`.
3. Consultar lista com `POST /v1/admin/entities/technicians/search` e filtro obrigatório por `uid_organization`; consultar o executor por `GET /v1/admin/entities/technicians/:uid`.
4. Tentar criar executor com prestadora de outra organização; deve ser rejeitado. Com executor vinculado, substituir os tipos por uma lista sem `technician`; esperado `409 technicians_attached`, com os tipos anteriores intactos. Remover outro tipo mantendo `technician` deve funcionar. Só tente remover `technician` após não haver registro executor vinculado.
5. Criar um motorista independente em `/v1/admin/entities/drivers`. Não enviar `uid_person` ou vínculo a usuário. Mesmo nome/data de nascimento entre motorista e executor não deve criar associação.
6. A homologação HTTP de OS/custódia e snapshots está descrita exclusivamente na bateria `0092–0100` ao final deste guia.
7. Repetir o fluxo de estoque SIM/device já homologado para confirmar que esta etapa não o regrediu.

Os exemplos completos de CRUD de motoristas estão em [drivers.md](drivers.md); OS, custódia e cenários de erro estão em [device_technician_workflow.md](device_technician_workflow.md). Use uma `Idempotency-Key` nova por criação e preserve a mesma chave apenas ao repetir a mesma intenção.

## OS e custódia por item — 0092–0100 aplicadas; regressão SQL e replay HTTP do executor aprovados

0092–0100 foram aplicadas em homologação. `device_technician_self_service.sql` passou com `ROLLBACK`, incluindo conclusão por item, notas e visibilidade dos recibos de idempotência. O retry HTTP idêntico pela rota do executor retornou replay sem duplicar efeitos; o replay da rota administrativa e a bateria HTTP restante ainda precisam ser registrados.

### Replay idempotente da conclusão — migration 0100 aplicada

A regressão SQL da 0100 foi executada e aprovada com `ROLLBACK`. Não reaplique o wrapper nesta homologação. A regression também verifica a visibilidade dos recibos de conclusão tanto para o executor vinculado quanto para o administrador.

A regressão verifica se a 0100 está aplicada antes de trocar para `navisoft_auth`; os checks condicionais usam esse valor local e não exigem SELECT do papel da aplicação em `common.schema_migrations`.

Use uma OS própria em `in_progress` e item `planned` para cada rota. Faça a primeira conclusão com uma chave UUID nova e guarde exatamente o body e a chave enviados:

```http
POST {{ _.baseURL }}/v1/admin/devices/work-orders/{{ _.uid_work_order }}/complete
Authorization: Bearer {{ _.primaryToken }}
Idempotency-Key: {{ _.adminCompletionKey }}
Content-Type: application/json

{"items":[{"uid_item":"{{ _.uid_work_order_item }}","result_notes":"retry idempotency check"}]}

POST {{ _.baseURL }}/v1/technician/work-orders/{{ _.uid_work_order }}/complete
Authorization: Bearer {{ _.technicianToken }}
Idempotency-Key: {{ _.technicianCompletionKey }}
Content-Type: application/json

{"items":[{"uid_item":"{{ _.uid_work_order_item }}","result_notes":"retry idempotency check"}]}
```

Reenvie a mesma requisição, para a mesma OS, sem alterar a chave nem o JSON. Esperado: HTTP 200, `replayed:true`, mesmo resultado armazenado e nenhuma nova conclusão, teste de device, vínculo, custódia ou auditoria. Reutilizar a chave na mesma rota/ator com outro body normalizado ou apontando para outra OS deve retornar HTTP 409 `idempotency_conflict`. A autorização da OS continua sendo verificada para o mesmo ator no replay.

O replay idêntico do executor já foi confirmado em HTTP. Valide separadamente como administrador autorizado; não use a rota administrativa para inferir a autorização do executor. O retry deve retornar HTTP 200 com `replayed:true`, sem repetir testes, vínculo, custódia, auditoria ou transições. A fixture verifica a lista global de permissões do perfil e só cria `basic_user / devices.access` se ainda não existir. Para repetir somente a regressão SQL em outro ambiente com 0100 aplicada, execute `psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/device_technician_self_service.sql`; o teste termina com `ROLLBACK`.

### SYS-OS-02 — correção da validação da prestadora na conclusão pelo executor

A evidência HTTP registra `POST /v1/technician/work-orders/{uid}/complete` retornando 409 `device_reference_conflict` para uma retirada, enquanto o Primary concluiu a mesma OS/corpo. O operador executou a regressão e capturou SQLSTATE 23503 `device_technician_not_found` no trigger `capture_technician_history()` ao inserir `custody.return_pending`. O helper da prestadora consultava `entities.entities` por uma policy administrativa `entities.can_manage_record`; o Basic executor não administra entidades, então o SELECT era filtrado. A migration forward 0212 muda somente essa consulta para `entities.entity_types` + `entities.types`, mantendo lifecycle ativo e tipo `technician` ativo. Nenhum grant, RLS ou gate do executor é alterado.

A regressão `migrations/tests/device_technician_self_service.sql` exige 0212 e conclui operações `remove` e `replace` pela função `devices.technician_work_order_complete()` sob a identidade Basic vinculada. Ela verifica receipt/replay, conflito de fingerprint, ausência de campos de preço, retorno declarado pelo executor e recebimento administrativo. Na execução mais recente reportada, o teste passou da falha `device_technician_not_found` e parou na custódia de replacement: após trocar para o ator Basic, a fixture chamou incorretamente `devices.custody_confirm_receipt()`, que exige `devices.can_manage()` e oculta a custódia com `device_custody_not_found`. A fixture agora chama `devices.technician_custody_confirm()` para a confirmação pelo próprio executor. Reexecute a regressão e confira `ROLLBACK`; não aplique novamente a migration já instalada. Comandos:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/upgrade_technician_provider_visibility.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/device_technician_self_service.sql
```

A regressão SQL anterior falhou com `device_technician_not_found`. A nova execução reportada avançou até o cenário de replacement e falhou em `custody_confirm_receipt`; isso não é evidência de falha da autorização de produção, mas de chamada administrativa indevida na fixture. Após a correção, não marcar SYS-OS-02 como aprovado até a regressão terminar em `ROLLBACK` e os casos HTTP serem repetidos. Para a listagem, os testes existentes de `internal/server` e `internal/filters` são independentes deste defeito.

### Lista administrativa e lista do executor

Admin pode filtrar por organização alvo e, opcionalmente, `uid_technician`. `pending` é o default (`draft|dispatched|in_progress`), `completed` lista concluídas e `all` inclui canceladas. O executor não envia `uid_technician`; a conta associada define o executor. Seu `pending` é apenas `dispatched|in_progress`, nunca `draft`.

```bash
curl -G '{{ _.baseURL }}/v1/admin/devices/work-orders' \
  -H 'Authorization: Bearer {{ _.primaryToken }}' \
  --data-urlencode 'state=pending' --data-urlencode 'uid_technician=UUID_EXECUTOR' \
  --data-urlencode 'limit=25' --data-urlencode 'offset=0'

curl -G '{{ _.baseURL }}/v1/technician/work-orders' \
  -H 'Authorization: Bearer {{ _.technicianToken }}' \
  --data-urlencode 'state=pending' --data-urlencode 'limit=25' --data-urlencode 'offset=0'
```

Esperado: `{ "items":[], "total":0, "limit":25, "offset":0 }` e cada resumo inclui `items_total`, `items_completed`, `items_pending`. `limit` padrão 100, máximo 500; offset inicia em zero. POST `/search` aceita o mesmo contrato em JSON. `state` e filtro explícito `status` não podem ser misturados. Teste que o executor não consegue informar `uid_technician` via query nem body (400 `invalid_search_request`) e que a lista nunca mostra OS draft.

GET e POST `/search` passam pelo mesmo handler e filtros. Complete a matriz de estado com `state=completed` e `state=all` para admin e executor; `all` inclui `draft` apenas para admin e `cancelled` para ambos. Admin também pode enviar `uid_technician` como filtro por query ou no array `filters` do body; a lista continua sujeita à autorização SQL e um ator sem scope do asset não deve obter a OS. Para o executor, confira que uma conta associada vê suas próprias OS, mas não as de outro executor. A resposta deve manter o envelope `{items,total,limit,offset}` e os contadores por item; ordenação é por atividade mais recente, com desempate estável.

```bash
curl -G '{{ _.baseURL }}/v1/admin/devices/work-orders' \
  -H 'Authorization: Bearer {{ _.primaryToken }}' \
  --data-urlencode 'state=completed' --data-urlencode 'limit=25' --data-urlencode 'offset=0'

curl -G '{{ _.baseURL }}/v1/admin/devices/work-orders' \
  -H 'Authorization: Bearer {{ _.primaryToken }}' \
  --data-urlencode 'state=all' --data-urlencode 'uid_technician=UUID_EXECUTOR'

curl -G '{{ _.baseURL }}/v1/technician/work-orders' \
  -H 'Authorization: Bearer {{ _.technicianToken }}' \
  --data-urlencode 'state=completed'

curl -G '{{ _.baseURL }}/v1/technician/work-orders' \
  -H 'Authorization: Bearer {{ _.technicianToken }}' \
  --data-urlencode 'state=all'
```

Esperado: combinação de `state` com filtro explícito `status` retorna 400 `invalid_search_request`; `uid_technician` enviado pelo executor em query ou body também retorna 400. `limit=501` é rejeitado com HTTP 422 `invalid pagination`; `limit=25&offset=0` retorna os valores na resposta. Para validar o filtro administrativo sem depender de `primaryToken`, repita como administrador sem acesso ao asset: a OS não deve aparecer (`total=0`).

### Pacote técnico e vínculo ao asset

Crie um pacote por organização. Os testes obrigatórios pertencem ao requisito do slot; não cadastrar testes soltos no pacote. Use uma `Idempotency-Key` nova por criação:

```bash
curl -i -X POST '{{ _.baseURL }}/v1/admin/devices/technical-packages' \
  -H 'Authorization: Bearer {{ _.primaryToken }}' \
  -H 'Idempotency-Key: UUID_NOVA_DO_PACOTE' -H 'Content-Type: application/json' \
  -d '{"uid_organization":"UUID_ORG","code":"instalacao-padronizada","name":"Instalação padrão","instructions":{"safety":"Desligar alimentação antes da instalação"},"requirements":[{"slot_number":1,"requirement_type":"primary_tracker","uid_device_type":"UUID_TIPO","uid_device_model":"UUID_MODELO","required":true,"instructions":{"check":"Fixação e alimentação"},"tests":[{"test_code":"boot","name":"Inicialização e transmissão","required":true}]}]}'

curl -X PUT '{{ _.baseURL }}/v1/admin/assets/UUID_ASSET/technical-package' \
  -H 'Authorization: Bearer {{ _.primaryToken }}' -H 'Content-Type: application/json' \
  -d '{"uid_technical_package":"UUID_PACOTE"}'
```

A busca de pacotes exige `uid_organization eq UUID`. Teste isolamento tentando consultar/atribuir pacote de outra organização; a operação deve falhar. Altere o pacote antes do dispatch e confira o snapshot atualizado; depois do dispatch, edições no catálogo não podem alterar o snapshot da OS.

### Dispatch, transporte de ida e confirmação

Crie a OS draft pela rota já usada no teste, com ao menos dois itens. Despache com o transporte no nível da OS:

```bash
curl -X POST '{{ _.baseURL }}/v1/admin/devices/work-orders/UUID_OS/dispatch' \
  -H 'Authorization: Bearer {{ _.primaryToken }}' -H 'Content-Type: application/json' \
  -d '{"dispatch_method":"courier","dispatch_reference":"REMESSA-123","dispatch_cost_cents":1250,"dispatch_notes":"Envio ao executor"}'
```

Confira `status=dispatched`, os campos de transporte e o snapshot técnico. `start` antes de confirmar recebimento do executor deve retornar 409 `device_custody_confirmation_required`. Confirme por `/v1/technician/custody/UUID_CUSTODIA/confirm-receipt` com token vinculado ou pela rota administrativa equivalente; depois, start deve funcionar.

### Conclusão parcial, fail→pass e fechamento automático

Envie apenas o item que deseja tentar concluir. Para teste obrigatório reprovado, a chamada retorna HTTP 200, persiste `fail`, devolve `completed:false` e lista bloqueios; o item fica pendente. Falha funcional não causa rollback. Conclua outro item válido em outra chamada: ele deve ficar completed, mas a OS ainda permanece `in_progress`. Então envie `pass` para o item bloqueado com uma chave nova, pois o conteúdo da intenção mudou:

```bash
curl -i -X POST '{{ _.baseURL }}/v1/technician/work-orders/UUID_OS/complete' \
  -H 'Authorization: Bearer {{ _.technicianToken }}' -H 'Idempotency-Key: UUID_INTENCAO_FAIL' \
  -H 'Content-Type: application/json' \
  -d '{"items":[{"uid_item":"UUID_ITEM_1","tests":[{"test_code":"boot","result":"fail","notes":"Sem transmissão na bancada"}]}]}'

curl -i -X POST '{{ _.baseURL }}/v1/technician/work-orders/UUID_OS/complete' \
  -H 'Authorization: Bearer {{ _.technicianToken }}' -H 'Idempotency-Key: UUID_INTENCAO_PASS' \
  -H 'Content-Type: application/json' \
  -d '{"items":[{"uid_item":"UUID_ITEM_1","tests":[{"test_code":"boot","result":"pass","notes":"Transmissão confirmada"}]}]}'
```

Use `/v1/admin/devices/work-orders/UUID_OS/complete` para registrar administrativamente. Repita o mesmo body/chave para provar idempotência sem duplicar teste, vínculo, custody ou auditoria. A OS deve mudar automaticamente para `completed` apenas quando o último item obrigatório completar. Erro técnico ou de integridade continua revertendo a operação.

### Cancelamento parcial

Com OS in_progress de dois itens e sem custody aberta, complete um item e então chame `POST /v1/admin/devices/work-orders/UUID_OS/cancel`. Esperado: item concluído continua completed, item restante passa explicitamente a cancelled, OS passa a cancelled. Se existir custody `with_technician` ou `return_pending`, cancelamento retorna 409 `device_work_order_cannot_cancel` até o recebimento físico fechar a custody.

### Transporte de retorno e chegada física sem declaração

Em `remove` ou no device antigo de `replace`, confira custody `return_pending`. A declaração opcional pode incluir:

```json
{"notes":"Retorno ao estoque","condition":"testing","return_method":"courier","return_reference":"DEVOLUCAO-123","return_cost_cents":875,"return_paid_by":"organization","return_reimbursement_cents":0,"return_notes":"Coleta agendada"}
```

Teste também a chegada física antes de qualquer declaração: `POST /v1/admin/devices/custody/UUID_CUSTODIA/receive` deve concluir com sucesso, preservar `technician_returned_at:null`, preencher `received_at` e `closed_at`, direcionar o inventário conforme condição e registrar em auditoria `received_without_return_declaration=true`.

Ao terminar, confira histórico por asset e device, slot, device before/after, OS, executor, prestadora, ator e request_id. HTTP só passa após execução manual; não inferir homologação pelo resultado SQL.

## GED Phase 1 — alvos e distribuição global (core HTTP homologado manualmente)

**Estado atual:** o core HTTP foi homologado manualmente para owner; criação/uso de distribuição `follow_latest` e `fixed_revision`; revoke; isolamento do recipient; tentativa de revisão pelo recipient; targets organization e entity; target sem distribuição sem acesso; replay/idempotency; e revisão efetiva, com acesso à revisão antiga negado. Os passos abaixo permanecem como roteiro reproduzível; somente casos periféricos nominalmente marcados como pendentes devem ser tratados como não homologados. A base depende de 0101–0110 aplicadas, regressão SQL aprovada com `ROLLBACK`, binário atualizado e `settings/filters.json` correspondente. Use `OWNER_TOKEN` autorizado a administrar o proprietário e `RECIPIENT_TOKEN` autorizado a ler documentos na organização destinatária; `OWNER_ORG`, `RECIPIENT_ORG` e `DOCUMENT_UID` devem ser UIDs reais. O documento continua pertencendo ao owner. O alvo opcional descreve o assunto e não concede acesso.

Primeiro, o administrador proprietário cria uma distribuição `follow_latest`; a chave deve ser um UUID novo para esta intenção:

```bash
curl -i -X POST "$BASE/v1/admin/documents/$DOCUMENT_UID/distributions?uid_organization=$OWNER_ORG" \
  -H "Authorization: Bearer $OWNER_TOKEN" -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 61090000-0000-4000-8000-000000000001' \
  -d "{\"uid_recipient_organization\":\"$RECIPIENT_ORG\",\"access_mode\":\"read\",\"revision_policy\":\"follow_latest\"}"
```

Esperado: primeira resposta `201`, mesmo retry `200` com `replayed:true`; mesmo UUID em outra requisição/corpo deve dar `409 idempotency_conflict`. A resposta inclui UID da distribuição. Criar outra distribuição ativa para o mesmo documento e destinatário deve retornar conflito `document_distribution_exists`.

Agora use a conta destinatária e o contexto dela (`uid_organization=RECIPIENT_ORG`):

```bash
curl -G -i "$BASE/v1/admin/documents" -H "Authorization: Bearer $RECIPIENT_TOKEN" \
  --data-urlencode "filters=[{\"field\":\"uid_organization\",\"operator\":\"eq\",\"value\":\"$RECIPIENT_ORG\"}]"
curl -i "$BASE/v1/admin/documents/DOCUMENT_UID?uid_organization=RECIPIENT_ORG" \
  -H "Authorization: Bearer $RECIPIENT_TOKEN"
curl -i "$BASE/v1/admin/documents/DOCUMENT_UID/revisions?uid_organization=RECIPIENT_ORG" \
  -H "Authorization: Bearer $RECIPIENT_TOKEN"
curl -i "$BASE/v1/admin/document-revisions/REVISION_UID/download?uid_organization=RECIPIENT_ORG" \
  -H "Authorization: Bearer $RECIPIENT_TOKEN"
```

Esperado: o documento aparece somente após a distribuição; `uid_organization` da resposta continua sendo o owner, `uid_organization_context` é o destinatário e `access_source=distribution`. O destinatário vê/lista/baixa apenas a revisão efetiva, sem `repository_code` ou `object_key`. Tentar criar revisão deve ser negado; alterar/revogar a distribuição pelo contexto destinatário deve falhar; organização B sem distribuição não deve localizar o documento mesmo conhecendo UID.

Para provar `follow_latest`, o owner envia uma revisão válida nova; a leitura do destinatário deve apontar para R01 sem UPDATE da distribuição. Em seguida, o owner altera a mesma distribuição para fixed revision e confirma que revisões mais novas não mudam o UID efetivo:

```bash
curl -i -X PUT "$BASE/v1/admin/document-distributions/DISTRIBUTION_UID?uid_organization=$OWNER_ORG" \
  -H "Authorization: Bearer $OWNER_TOKEN" -H 'Content-Type: application/json' \
  -d '{"access_mode":"read","revision_policy":"fixed_revision","uid_fixed_revision":"R00_UID"}'
```

Para revogar, o owner executa `DELETE /v1/admin/document-distributions/DISTRIBUTION_UID?uid_organization=OWNER_ORG`; esperado `204 No Content`. O destinatário deve receber 404 no GET/lista/download imediatamente. Reconfirme que o owner ainda consegue ler e revisar o próprio documento. Alvos organization/entity são atribuídos somente no create; confira que entity precisa pertencer a uma organização autorizada e que alvo não altera proprietário nem cria distribuição.

A regressão SQL já foi aprovada com `ROLLBACK`. Use estes comandos somente para repetir o teste em outro ambiente:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_shared_storage_documents.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/shared_storage_distributions.sql
```

## GED Phase 2 — classes funcionais e autorização por ação (SQL aprovada; HTTP manual aprovado nos cenários listados)

**Estado atual:** 0111–0116 foram aplicadas em homologação e `migrations/tests/ged_phase2_security.sql` passou integralmente, terminando em `ROLLBACK`. A 0116 corrigiu os três `RETURNING` inválidos com aliases, mantendo os owners e ACL existentes. A verificação estática/PGlite limitada passou até 0116. A fixture resolve `tenant_code` antes da troca de role, sem ampliar privilégios de `navisoft_auth`. A 0111 concede `CREATE` temporariamente em `access` a `navisoft_policy` e em `users` a `navisoft_users_owner`, somente durante os respectivos blocos de DDL. Para definir as FKs dos grupos funcionais, concede também `REFERENCES(uid)` temporário em `users.users` e `organizations.organizations`, revogado após a criação das tabelas. O mesmo privilégio restrito às colunas `uid` é temporariamente concedido a `navisoft_documents_owner` para criar as FKs de `documents.classes` e `documents.class_permissions`, e revogado antes dos triggers de auditoria. `TRIGGER` em `organizations.organizations` é temporário e revogado após instalar o trigger de seed. A auditoria de `documents.targets` requer `USAGE` contínuo em `audit`, concedido por 0114 somente ao owner GED. O seed preserva o autor da organização quando válido e usa Primary Autoscale para registros legados sem autor; a regressão confere que não há grupos sem autoria.

**HTTP homologado manualmente:** criação de grupo funcional; membership de Basic com scope legítimo; concessão explícita de `documents.access` ao perfil Basic; criação de classe; grant único `functional_group/read`; Basic lendo documento classificado por grupo funcional; `read` sem implicar `download` ou `manage`; alteração para grant único `target/read`; documento classificado com target `entity`; Basic com scope parcial dentro da entity recebendo `document_not_found`; usuário de revenda sem delegação explícita recebendo `document_not_found`.

O cenário positivo de `delegated_support` não foi reproduzido por HTTP porque não havia conta já delegada à organização-alvo. Ele permanece coberto pela regressão SQL e **não** está homologado manualmente. SQL, Go e HTTP são evidências independentes; este registro não altera o estado dos testes Go.

### Aplicar e executar a regressão SQL

As migrations 0101–0116 estão instaladas. Para repetir a regressão SQL, execute:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_shared_storage_documents.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/ged_phase2_security.sql
```

O wrapper confirma as migrations já aplicadas; a regressão requer duas organizações ativas, cria fixtures dentro da transação e termina com `ROLLBACK`. O tenant da organização A é lido no preflight antes de `SET LOCAL ROLE navisoft_auth` e passado por GUC transacional; não conceda acesso a `documents.organization_sequences` ao papel HTTP. A regressão cria unidades específicas para cada entidade de teste: `entities.create()` atribui a unidade Geral legada da organização, que não é necessariamente uma unidade filha daquela entidade e não pode ser usada como grant `uid_unit`. As asserções diretas dos predicados internos `access.*` mudam temporariamente para `navisoft_documents_owner`, pois não são concedidas ao papel HTTP `navisoft_auth`; os mesmos resultados funcionais são exercitados via `documents.authorize_document()` no bloco HTTP. Não adicione esses grants para contornar o teste. A regressão verifica target organization/entity persistido e retornado, ações independentes, scopes integrais, membership contextual, remoção dinâmica de acesso, Basic sem exposição legacy, delegated support, administração local e restrita, distribuição, FORCE RLS, ausência de DML genérico/BYPASSRLS e privilégios mínimos de auditoria (`audit.USAGE` para o owner GED, nenhum para `navisoft_auth`). A 0111 preserva o owner instalado de `users.validate_group_permission()` e exige execução pelo owner atual ou superuser. Os cenários HTTP listados acima já foram homologados; o positivo de delegated support permanece somente coberto por SQL.

### Preparar a bateria HTTP

Use uma organização-alvo ativa (`ORG`), um administrador local/Primary (`ADMIN_TOKEN`), uma conta Basic com scope válido naquela organização (`BASIC_TOKEN`), seu UID (`BASIC_UID`), um documento de teste (`DOC_UID`) e UIDs de grupo/classe retornados pela API. Para testar suporte delegado, use o token de uma revenda autorizada na organização alvo, sem tratá-lo como administrador local. Reinicie o binário com o código e `settings/filters.json` desta entrega após a migration.

`documents.access` não é concedido ao Basic por padrão. A concessão pelo CRUD de `groups-permissions` é por perfil e afeta **todos** os usuários desse perfil; ela somente habilita a área. O CRUD permanece exclusivo ao Primary da Autoscale:

```bash
curl -i -X POST "$BASE/v1/admin/groups-permissions" \
  -H "Authorization: Bearer $PRIMARY_TOKEN" -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 61110000-0000-4000-8000-000000000001' \
  -d '{"group_code":"basic_user","permission_code":"documents.access"}'
```

Se a associação já existir, use GET para confirmar em vez de repetir com nova chave. Confirmar a área **não** deve tornar documentos classificados ou antigos sem classe visíveis por si só.

Crie um grupo funcional dentro da organização em contexto. A associação ao Basic exige que ele já possua scope legítimo para `ORG`; o membership não cria esse scope:

```bash
curl -i -X POST "$BASE/v1/admin/users/functional-groups" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 61110000-0000-4000-8000-000000000002' \
  -d "{\"uid_organization\":\"$ORG\",\"code\":\"finance_test\",\"name\":\"Financeiro de teste\"}"

curl -i -X POST "$BASE/v1/admin/users/functional-group-members" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 61110000-0000-4000-8000-000000000003' \
  -d "{\"uid_organization\":\"$ORG\",\"uid_functional_group\":\"$FUNCTIONAL_GROUP_UID\",\"uid_member_user\":\"$BASIC_UID\"}"
```

Esperado: `201` nas criações. Tente associar um usuário sem scope em `ORG`: deve retornar `422 functional_group_member_not_authorized`. Depois remova o scope do Basic pelo PUT normal de usuário; a linha de membership pode continuar cadastrada, mas já não autoriza.

Crie uma classe sem permissões implícitas, depois substitua suas permissões explicitamente. Exemplo: `finance_test` recebe somente `read`; `target` também recebe somente `read`:

```bash
curl -i -X POST "$BASE/v1/admin/document-classes" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: 61110000-0000-4000-8000-000000000004' \
  -d "{\"uid_organization\":\"$ORG\",\"code\":\"finance_test\",\"name\":\"Financeiro de teste\"}"

curl -i -X PUT "$BASE/v1/admin/document-classes/$CLASS_UID?uid_organization=$ORG" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' \
  -d "{\"name\":\"Financeiro de teste\",\"active\":true,\"permissions\":[{\"principal_type\":\"functional_group\",\"uid_functional_group\":\"$FUNCTIONAL_GROUP_UID\",\"action_code\":\"read\"},{\"principal_type\":\"target\",\"action_code\":\"read\"}]}"

curl -i -X PUT "$BASE/v1/admin/documents/$DOC_UID/class?uid_organization=$ORG" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' \
  -d "{\"uid_class\":\"$CLASS_UID\"}"
```

Em homologação, substitua os placeholders pelos UIDs retornados. Com o Basic membro do grupo, GET do documento classificado deve funcionar; download, revisão e gestão devem ser negados, pois `read` não implica outras ações. Troque a classe para grant único `revise`: revisão deve ser permitida e read/download negados. Faça o mesmo com grant único `manage`: gestão deve ser permitida e leitura/download/revisão negadas. Para permitir mais de uma ação, envie todas as linhas explicitamente na substituição completa do array.

Crie/configure também um documento com target `entity` e grant de target apenas `read`. Um Basic com somente asset/unit parcial dentro da entity deve ser negado por target; uma conta com grant da entity inteira pode ler, mas não baixar sem target grant `download`. Para target `organization`, exija grant integral da organização. Esses testes não alteram a semântica operacional da visibilidade de assets.

Com token de suporte delegado em contexto explícito autorizado para `ORG`, leitura e download de documento classificado devem funcionar sem membership funcional; revise/manage e mudanças de distribuição devem continuar negadas sem permissão explícita. Administrador local do owner e Primary mantêm as quatro ações existentes. Uma organização fora do scope deve retornar não encontrado mesmo quando o cliente conhece o UID.

Distribuição continua sendo autorização read/download independente da classe; confirme revogação imediata usando os passos da seção GED Phase 1 acima. Mantenha separados os resultados: **0111 aplicada**, **regressão SQL aprovada com ROLLBACK**, **Go validado** e **HTTP homologado** são estados distintos.
## Commercial foundation — 0144 aplicada; regressão SQL e HTTP homologadas

O operador confirmou `migrations/upgrade_commercial_foundation.sql` aplicada e `migrations/tests/platform_capabilities.sql` aprovada com `ROLLBACK`. A regressão cobriu catálogo global, relação vazia por padrão, replacement Primary-only, `[]` para limpar, helper interno de entitlement, falta de DML runtime, ausência de EXECUTE indevido para `PUBLIC`/`navisoft_auth`, cobrança progressiva preservada e nenhum grant de `products` para `users.has_area`. A aplicação e a regressão não devem ser repetidas como pendentes; mantenha migration, SQL, Go local e HTTP como evidências distintas.

Evidência HTTP confirmada com token Primary: PC01 `GET /v1/admin/platform-capabilities` retornou 200 com 18 capabilities; PC02 `GET /v1/admin/billing-plans` retornou 200; PC03 `demo_postpaid` iniciou com `capabilities: []`; PC04 PUT de `products` e `procurement` retornou 200; PC05 GET confirmou `procurement, products`; PC06 PUT `[]` retornou 200 e restaurou o estado original. Também foram homologados: non-Primary GET/PUT → 403 `billing_not_allowed`; UUID inválido → 422 `invalid_billing_uid`; plano inexistente → 404 `billing_not_found`; capability inexistente/formato inválido/duplicada/array ausente/null → 422 `invalid_platform_capabilities`; campo JSON desconhecido → 400 `invalid_request`. O conjunto permaneceu `[]` após todos os negativos. Capability inativa ficou N/A, pois não existe `active=false` no catálogo atual.

`POST /v1/admin/platform-capabilities/search` também foi homologado: `q=products` → 200 com 1 item; non-Primary → 403 `billing_not_allowed`; campo JSON desconhecido → 400 `invalid_search_request`; filtro desconhecido, operador não permitido e boolean inválido → 422; `limit=501` → 422 `invalid pagination`; body `{}` e body vazio → 200, total 18, limit 100, offset 0; filtro `code` prefix `prod` → 200 com `products`.

O roteiro abaixo permanece como referência do fluxo positivo/replay; os negativos descritos acima já são evidência concluída e não devem ser repetidos como pendentes:

```http
GET /v1/admin/platform-capabilities
GET /v1/admin/billing-plans/{uid_billing_plan}/capabilities
PUT /v1/admin/billing-plans/{uid_billing_plan}/capabilities
Content-Type: application/json

{"capabilities":["products","procurement"]}
```

Esperado: listagem 200 no envelope `{items,total,limit,offset}` (default 100/max 500); GET do plano retorna `{uid_billing_plan,capabilities}`; PUT retorna 200 com o conjunto substituído. Repita GET para confirmar. Envie `{"capabilities":[]}` e confirme que o conjunto fica vazio. Com usuário não-Primary, GET/PUT devem retornar 403 `billing_not_allowed`; UUID de plano inválido retorna 422 `invalid_billing_uid`, inexistente retorna 404 `billing_not_found`. Corpos com campo extra retornam 400 `invalid_request`; array ausente/null, código repetido ou formato/código inexistente/inativo retornam 422 `invalid_platform_capabilities`, sem alterar o conjunto. Nenhuma destas chamadas concede área ao usuário; o entitlement do plano, a permissão do usuário e o scope continuam gates independentes.

Os negativos HTTP desta seção foram homologados manualmente. Produtos/bundles, procurement, inventory/costing, pricing e contratos comerciais ainda não possuem rotas nesta etapa.

## Tablecache Redis da API — 0161 aplicada; reteste de lifecycle pendente

O cache inicial cobre somente os catálogos globais de combustíveis, voltagens e tipos de device. Não altera as respostas HTTP: autorização continua no PostgreSQL, e filtros/paginação são aplicados pelo caminho existente. `redis_cache_api` usa cliente/pool próprio. A API deve permanecer pronta mesmo se esse Redis cair; nesse caso a resposta vem do PostgreSQL.

O operador confirmou 0161 aplicada e `migrations/tests/tablecache_invalidation.sql` aprovada com `ROLLBACK`. **Não reaplique a migration.** A regressão não foi repetida nesta correção Go. O comando registrado para uma futura execução autorizada é:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/tablecache_invalidation.sql
```

A causa confirmada de `table_cache_ready:false` foi o listener iniciado em `platform.Open()` com o contexto limitado de startup, cancelado assim que a abertura das dependências terminava. O listener agora é iniciado depois de `platform.Open()` usando o contexto de runtime da aplicação, e `Close()` cancela e aguarda sua goroutine. Os testes Go locais dessa correção passaram. Recompile e reinicie a API; com token autorizado, `GET /v1/health/details` deve chegar a `table_cache_ready:true` após conectar, confirmar triggers e fazer o purge inicial. Se listener/triggers estiverem indisponíveis, deve mostrar `false`, mas o readiness `/v1/health/ready` continua 200 quando as dependências Core estiverem saudáveis.

Para validar sem alterar dados, compare duas leituras idênticas em cada namespace e confirme os envelopes e itens iguais. Consulte `/v1/health/details` antes/depois: `hit_total` deve crescer na leitura repetida, enquanto `load_total` só cresce quando o dataset é carregado do PostgreSQL. Rotas:

```http
GET /v1/admin/assets/fuels?limit=25&offset=0
GET /v1/admin/assets/voltages?limit=25&offset=0
GET /v1/admin/devices/types?limit=25&offset=0
```

Repita uma rota com o mesmo query e use também seus `POST .../search` existentes com o mesmo filtro/paginação; a resposta deve permanecer idêntica e o hit deve aumentar. Não envie filtros arbitrários: use os campos já documentados em `settings/filters.json`.

Para comprovar invalidação multi-instância, inicie todas as APIs e aguarde `table_cache_ready:true` antes de aquecer as três listas. Faça uma alteração de catálogo por seu CRUD administrativo existente e autorizado; após commit, a próxima listagem em qualquer instância deve refletir a alteração. Uma transação revertida não deve invalidar estado confirmado. Faça esse teste somente com uma fixture descartável e limpe-a pelo CRUD suportado. Não trate teste unitário ou regression SQL estrutural como prova de HTTP multi-instância/Redis real.

## Autoscale Notify organization sync — 0179 preparada; homologação pendente

Não execute o worker até 0178/0179 estarem aplicadas e o bloco `notifications.autoscale.organization_sync` estar completo localmente. O worker está desabilitado por padrão nos dois arquivos de configuração; preencha `admin_organization_id` e `admin_token` fora do repositório/sem imprimi-los, depois habilite `enabled`. Ele usa HTTPS em `admin_base_url` e o timeout já configurado em `notifications.autoscale.timeout`.

Aplicação e regressão são operações do operador; não foram executadas nesta entrega. A primeira tentativa reportou role ausente `navisoft_notification_worker`, removida pela 0134. A correção preparada não exige essa role e trata as demais roles de runtime opcionais. Como a falha ocorreu dentro do `BEGIN` da 0179 antes do registro da versão e do `COMMIT`, confirme a ausência de `0179` em `common.schema_migrations` antes de reaplicar:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_provisioned_admin_scope.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_notify_organization_sync.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/notify_organization_sync.sql
```

Consulta read-only para confirmar o estado da migration:

```sql
SELECT version FROM common.schema_migrations WHERE version = '0179';
```

A regressão usa uma organização não-root ativa em transação e termina com `ROLLBACK`. Se 0178 já estiver aplicada, pule somente seu comando; o wrapper 0179 exige a versão 0178.

Testes Go locais também cobrem falha transitória, timeout, resposta perdida após criação remota e recuperação por GET sem POST duplicado. A interação com Notifications Core é coberta por teste: sem credencial, a delivery fica retryable sem HTTP; quando o sync disponibiliza a credencial da organização, a delivery prossegue. Isso não substitui a regressão PostgreSQL nem a homologação contra Notify real.

Depois de habilitar o worker e reiniciar a API, homologar em ordem, usando organização descartável:

1. Criar organização pelo fluxo normal. Confirmar commit antes de qualquer HTTP Notify. Esperar a linha local passar de `pending/processing` para `synced`; confirmar que o Notify contém exatamente o mesmo UUID, nome e estado e que `integrations.credentials` possui somente metadados/ciphertext para `autoscale_notifications`.
2. Repetir o mesmo estado/nome e confirmar que não cria outra linha de sync nem rotaciona token se o Notify retornar o mesmo.
3. Alterar o nome pelo fluxo normal e confirmar PUT com apenas `companyName`; estado final remoto e local deve coincidir.
4. Mudar lifecycle para `inactive` e depois `active`; confirmar PATCH `enabled:false` e `enabled:true`, sem revogar a credencial local.
5. Testar recuperação de resposta incerta: interromper o processo depois que Notify concluiu create, atualizar/reiniciar o Core e confirmar que a próxima reconciliação usa GET, não duplica tenant e persiste o token recuperado.
6. Confirmar que `secretKey`, token admin e token da organização não aparecem nos logs; notification delivery para a organização continua usando sua própria credencial de data-plane.

O contrato externo exige `POST/GET/PUT/PATCH /admin/organizations` e headers `X-Organization-Id`/`X-Token`. Esta etapa não chama Notify real; nenhuma dessas etapas HTTP está homologada até execução manual.
## Correção do validador de branding — 0180 aplicada

0180 corrige a ambiguidade 42702 de `jsonb_each()` em `organizations.branding_validate(jsonb)`. O operador confirmou a migration aplicada. A migration não altera o contrato HTTP nem as regras: tema válido continua sendo aceito; tema inválido continua retornando o erro de domínio sanitizado.

Comandos históricos de aplicação e regressão (não repetir em bancos que já registram 0180):

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/upgrade_fix_branding_validate_ambiguous_columns.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -f migrations/tests/branding_validate.sql
```

A regressão exercita tema simples válido, cor inválida (espera `22023` / `invalid_branding_color`, nunca `42702`) e tema `header` aninhado; termina em `ROLLBACK`. Depois, repetir o request autenticado de PATCH de branding que antes produziu `branding_storage_unavailable`; confirmar resposta normal para payload válido e `422 invalid_branding_color` para a cor inválida. Migration/regressão PostgreSQL e HTTP permanecem pendentes até confirmação do operador.

Probe local isolado (não conecta ao PostgreSQL configurado):

```bash
node migrations/tests/branding_validate_pglite.mjs
```

Após a aplicação, confirme o registro com `SELECT version,applied_at FROM common.schema_migrations WHERE version='0180';`.
# Commercial Foundation 0188–0192 — migrations applied; SQL/HTTP evidence consolidated

The operator confirmed migrations 0188–0192 applied. `migrations/tests/billing.sql`, `platform_billing.sql`, and the earlier `commercial_foundation.sql` passed on real PostgreSQL with `ON_ERROR_STOP=1` and ended in `ROLLBACK`. The expanded Commercial regression exposed and corrected three fixture issues: UUID assigned to a `jsonb` variable; final order referencing an older, non-current published version; and membership/origin assertions selecting protected tables under `navisoft_auth`. The current fixture keeps `commercial.order_create()` under `navisoft_auth`, then resets the role and checks `billing_account_members` and `billing_commercial_origins` under `navisoft_billing_owner`, which already owns the read boundary. No grants were broadened. Rerun the expanded regression before claiming its new assertions passed; these fixture errors do not invalidate the earlier approved run.

The approved SQL run validated the migration set and rolled back all fixtures. The newly added test cases remain local until the operator runs the regression below; no grant, RLS, or migration changed for this extension. Migrations are already applied, so do not rerun the upgrade wrapper for this test.

Run the expanded regression separately:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/commercial_foundation.sql
```

The regression is transaction-scoped and must end with `ROLLBACK`. SQL execution does not prove HTTP behavior. No API restart is needed for this regression-only delivery.

## HTTP homologation confirmed by the operator

This is the entry check for repeating a manual battery, not an outstanding first test. Use a Primary or user authorized for the selected existing organization. Substitute an organization UUID the actor may read and a current session token.

**Title:** Read Commercial offers for an authorized organization
**Method:** `GET`
**URL:** `http://localhost:8080/v1/commercial/overview?uid_organization=<AUTHORIZED_ORG_UUID>`
**Headers:** `Authorization: Bearer <SESSION_TOKEN>`
**Body:** none
**Expected status:** `200`
**Expected response:** object containing `uid_organization`, `billing_account` (object or `null`), and `offers` (array). Each offer includes its published plan version, billing mode, allowed Services, and required Terms. An actor without commercial read/organization scope must receive `403 commercial_not_allowed`; a valid but nonexistent organization under an authorized actor returns `404 organization_not_found`.

The operator confirmed Primary overview and the following manual HTTP cases: postpaid V4 order/accept/replay and one active agreement; idempotency conflict; stale expected version with transaction/receipt rollback and same-key valid cancel; prepaid `awaiting_payment`/replay/cancel without agreement or activation; completed-order cancel returning `message=invalid_commercial_transition` with no mutation; historical V3 rejection (`message=billing_offer_not_found`, status not recorded); invalid service and arbitrary Terms rejection (`message=invalid_commercial_service_selection` and `message=invalid_terms_acceptance`, statuses not recorded); and the 0192 PUT behavior described in [billing.md](billing.md). The historical cross-tenant overview 200 has no reproduced/proven root cause; the current defense-in-depth preflight was homologated and denies the Secondary.

Not manually HTTP-homologated because no active current offer has Services or Terms: successful explicit service selection, omitted default-disabled selection, desired-state application via Commercial, valid/missing clickwrap, external-signature flow, seller-assisted commission attribution, and external payer unless separately evidenced. These are SQL fixture coverage only; the expanded regression still needs an operator run. Full request/response contracts remain in [commercial_integration.md](commercial_integration.md).


## Technician capabilities — 0195 aplicada e regressão SQL aprovada; HTTP não confirmado

O operador confirmou 0195 aplicada e `migrations/tests/technician_capabilities.sql` aprovada com `ROLLBACK`. A lista abaixo é o contrato HTTP para homologação; não há evidência HTTP incluída nesta atualização.
1. `GET /v1/admin/entities/technician-capabilities` com sessão autorizada na área `devices` → `200` e catálogo contendo code, kind, name, active e sort_order.
2. `POST /v1/admin/entities/technicians` com `Idempotency-Key`, `uid_organization`, `uid_provider_entity`, `name` e `capabilities:["installation","telemetry"]` → `201`; response do técnico inclui objetos `{code,kind,name}`.
3. `GET /v1/admin/entities/technicians/{uid}` e `GET /v1/admin/entities/technicians` → os mesmos objetos de capability.
4. `PATCH /v1/admin/entities/technicians/{uid}` sem `capabilities` → preserva o conjunto; com `capabilities:[]` → limpa; com code desconhecido/inativo/duplicado → `422 invalid_technician_capability` sem alteração parcial.
5. `POST /v1/admin/entities/technicians/search` com filtro `capability_code eq telemetry` → só executores compatíveis dentro da organização autorizada; `in` aceita lista de codes. Um Secondary não pode ler nem alterar executor de outra organização.

Este roteiro não testa matching, OS dispatch, localização, disponibilidade, níveis ou certificações; esses comportamentos não fazem parte de 0195.

## Technician Capabilities 0195–0196 e Manual Billing 0197–0199 — SQL e HTTP com evidências separadas

**Estado informado pelo operador em 20/10/2026:** 0195 aplicada e regressão aprovada; 0196 aplicada às 00:31:57 -03 e regressão terminou em `ROLLBACK`; 0197 aplicada às 00:33:58 -03 e `migrations/tests/billing_entries.sql` terminou com `DO` e `ROLLBACK`. A 0199 foi aplicada conforme relato do operador e o PATCH que a motivou foi homologado por HTTP. A evidência formal de execução da versão atualizada de `billing_entries.sql` após a 0199 não foi fornecida; portanto, a aprovação SQL específica da correção 0199 permanece não confirmada.

O incidente HTTP de `PATCH /v1/admin/billing/entries/:uid` foi causado por `jsonb_object_length(jsonb)`, indisponível no PostgreSQL do ambiente (42883). A 0199 substitui a contagem por `count(*) FROM jsonb_object_keys(...)`, mantendo a regra de que `status` não pode ser combinado com outros campos. A fixture cross-organization da regressão foi movida para o bloco prévio a `SET ROLE navisoft_auth`; a operação cross-tenant continua sendo exercitada sob o role de autenticação.

### Homologação HTTP Manual Billing — casos B01–B48

Os resultados abaixo foram informados pelo operador. Quando não há código HTTP ou mensagem explicitamente informado, registramos apenas o resultado funcional observado.

| Caso | Resultado observado |
|---|---|
| B01 | Criação de lançamento Gateway por uso mensal aprovada. |
| B02 | Replay idempotente da criação aprovado. |
| B03 | Pró-rata aprovado após usar `calendar_day`: 20/30 dias, R$ 90,00 → R$ 60,00. |
| B04 | Duplicação de seis competências futuras aprovada. |
| B05 | PATCH de quantidade mudou `planned` para `ready`, total R$ 180,00. |
| B06 | Replay da duplicação devolveu o snapshot original sem reverter alteração posterior. |
| B07 | GET confirmou a persistência da alteração após replay. |
| B08 | Statement criado/fechado por R$ 180,00 com uma linha. |
| B09 | PATCH de lançamento faturado rejeitado com `billing_entry_immutable`. |
| B10 | Replay com a mesma chave devolveu o statement original com `replayed=true`. |
| B11 | Nova chave para a mesma conta/competência devolveu o statement existente com `replayed=false`; nenhum statement/valor duplicado. |
| B12 | GET confirmou a integridade do statement. |
| B13 | Novo lançamento na competência fechada rejeitado com `billing_statement_closed`. |
| B14 | GET confirmou lançamento `billed` vinculado ao statement. |
| B15 | Cancelamento aprovado após a correção 0199. |
| B16 | Alteração de lançamento cancelado rejeitada com `billing_entry_immutable`. |
| B17 | Pesquisa de lançamentos cancelados aprovada. |
| B18 | Pesquisa de statements fechados aprovada. |
| B19 | Filtro inexistente rejeitado com `invalid_search_request`. |
| B20 | Com o token Secondary correto, lançamento da Autoscale oculto como `billing_entry_not_found`. A tentativa inicial usou token incorreto e não é evidência de vulnerabilidade. |
| B21 | Secondary sem autorização recebeu `billing_not_allowed` ao consultar statement. |
| B22 | Reuso de chave com payload diferente rejeitado com `idempotency_conflict`. |
| B23 | POST sem `Idempotency-Key` rejeitado com `idempotency_key_required`. |
| B24 | PATCH combinando `status` e `quantity` rejeitado com `invalid_billing_entry`. |
| B25 | GET confirmou que o PATCH rejeitado não alterou o lançamento. |
| B26 | Fechamento sem entradas `ready` rejeitado com `billing_statement_empty`. |
| B27 | Paginação `limit=2`, `offset=0` executada; sem duplicação observada entre páginas. |
| B28 | Paginação `limit=2`, `offset=2` executada; sem duplicação observada entre páginas. |
| B29 | `limit=501` rejeitado com `invalid_search_request`. |
| B30 | Moeda `ZZZ` rejeitada com `invalid_billing_currency`. |
| B31 | Quantidade `1.5` na criação Gateway rejeitada. |
| B32 | Pró-rata em `monthly_unique_usage` rejeitado. |
| B33 | Quantidade zero rejeitada. |
| B34 | Duplicação com `count=25` rejeitada. |
| B35 | Preço unitário negativo rejeitado. |
| B36 | Agreement inexistente rejeitado com `invalid_billing_reference`. |
| B37 | Duplicação de entrada faturada permitida e nova entrada criada como `planned`. |
| B38 | Mesma chave com origem/path diferente rejeitada com `idempotency_conflict`. |
| B39 | `monthly_unique_usage` com `copy_quantity=true` criou quantidade `null`. |
| B40 | PATCH com quantidade fracionária rejeitado. |
| B41 | PATCH para 15.000 unidades a R$ 50,00 calculou R$ 750.000,00. |
| B42 | Lançamento com preço zero criado corretamente. |
| B43 | Lançamento de cortesia cancelado. |
| B44 | Lançamento de R$ 750.000,00 cancelado. |
| B45 | Auditoria encontrou duas entradas `ready`, totalizando R$ 110,00. |
| B46 | Entrada de telemetria de R$ 60,00 cancelada. |
| B47 | Entrada Gateway de R$ 50,00 cancelada. |
| B48 | Auditoria final retornou `items=[]`, `total=0` para `status=ready`. |

### Decisão documental B11

O comportamento instalado e observado em B11 preserva idempotência de negócio pelo par Billing Account/competência: mesma `Idempotency-Key` devolve o statement original com `replayed=true`; chave nova para a mesma conta/competência também devolve o statement original, agora com `replayed=false`. Não cria statement nem duplica valores. A documentação antiga previa `billing_statement_already_closed` para a segunda chamada; esse erro não descreve o comportamento observado e foi removido do contrato documentado. Nenhuma alteração de implementação foi feita nesta consolidação.

### Validação e limites

- PASS, informado pelo operador: regressões SQL 0196 e 0197 conforme acima; cenários HTTP B01–B48.
- PASS local da entrega de implementação anterior: `gofmt`, `go test -count=1 ./internal/server`, teste focado de `internal/filters`, `go vet ./...` e `go build -buildvcs=false ./...`.
- NOT CONFIRMED: execução da versão atualizada de `migrations/tests/billing_entries.sql` após aplicar 0199.
- NOT RUN nesta atualização documental: PostgreSQL, migrations, testes Go e novos requests HTTP.
- Fora da homologação: Gateway/Valkey/Rabbit/ClickHouse como dependências de execução real; os cenários descritos não homologam ainda sua medição automática, integração de pagamento ou processamento externo.

### Sequência SQL de referência

As migrations 0196, 0197 e 0199 são reportadas como aplicadas; não as reexecute. Para revisão e execução da regressão atualizada em outra instalação compatível, confira `migrations/upgrade_manual_billing.sql` e use:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/billing_entries.sql
```

O script de regressão deve terminar em `ROLLBACK`. Isso não substitui a evidência formal ainda ausente da execução pós-0199 no ambiente homologado.

Para iniciar a API após migrations aprovadas pelo operador:

```bash
go run ./cmd/navisoft -config config.json
```

### Contrato HTTP implementado — Manual Billing

Todas as rotas abaixo exigem `Authorization: Bearer <session_token>` e autorização SQL de Primary ou gestão comercial da organização alvo. JSON usa `Content-Type: application/json`. A área de usuário é a já existente `commercial`. POST de criação exige também `Idempotency-Key: <UUID>`; sucesso novo retorna 201, replay retorna 200 com `Idempotency-Replayed: true`. Não há DELETE físico.

**Criar lançamento — `POST /v1/admin/billing/entries`**

```json
{
  "uid_billing_account": "<uuid>",
  "uid_organization": "<uuid membro ativo>",
  "service_code": "gateway",
  "description": "Gateway — competência 2026-09",
  "competence": "2026-09",
  "reference_from": "2026-09-01",
  "reference_to": "2026-10-01",
  "due_date": "2026-10-10",
  "quantity": 15000,
  "unit_price_cents": 50,
  "currency": "BRL",
  "billing_basis": "monthly_unique_usage",
  "proration_policy": "none"
}
```

`uid_commercial_order` e `uid_billing_agreement` são opcionais. `quantity` omitida ou `null` deixa a entrada `planned`; com quantidade positiva, a entrada é `ready`. Para `contracted_quantity`, o request exige um agreement de referência, mas a quantidade é informada pelo operador após conferência desse contrato; não há resolução automática de componente/medidor nesta fase. Valores monetários são centavos inteiros. `monthly_unique_usage` exige quantidade inteira quando informada e `proration_policy=none`. O preço deve ser não negativo nesta fase.

Resposta criada é o lançamento (inclui UID, account/organization, serviço, datas, quantity, `unit_price_cents`, currency, basis, policy, status e `calculation_snapshot`) com `replayed:false`; replay devolve o registro original com `replayed:true`. Status 422 inclui `invalid_billing_reference`, `invalid_billing_competence`, `invalid_billing_quantity`, `invalid_billing_entry`, `invalid_billing_currency`; 403 `billing_not_allowed`; 404 `billing_account_not_found`; 409 `billing_account_organization_mismatch`, `billing_statement_closed` ou `idempotency_conflict`; indisponibilidade técnica 503 `billing_storage_unavailable`.

**Consultar e pesquisar lançamentos**

`GET /v1/admin/billing/entries/{uid}` devolve o objeto de lançamento ou 404 `billing_entry_not_found`. `GET /v1/admin/billing/entries` e `POST /v1/admin/billing/entries/search` devolvem `{items,total,limit,offset}`; filtros disponíveis incluem UIDs, service_code, description, competência, intervalo, vencimento, basis, policy, status, currency e timestamps. Busca livre `q` atua em service_code/description. Paginação usa o padrão central (limit default 100, máximo 500, offset default 0). Erro de consulta/filtro: 400 `invalid_search_request` para body inválido ou 422 `invalid_search_request` para regra/filtro recusado; os resultados continuam limitados pela autorização SQL.

**Alterar/cancelar**

`PATCH /v1/admin/billing/entries/{uid}` aceita somente `quantity`, `due_date`, `description` ou `status`. Exemplo:

```json
{"quantity":15000,"due_date":"2026-10-10"}
```

Para cancelar, envie somente `{"status":"cancelled"}`. Apenas `planned`/`ready` podem ser alteradas; `billed` é imutável, cancelada não volta automaticamente. Retorna 200 com entry. Erros: 404 `billing_entry_not_found`, 409 `billing_entry_immutable`, 422 `invalid_billing_entry`, `invalid_billing_entry_status` ou `invalid_billing_quantity`.

**Duplicar competências**

`POST /v1/admin/billing/entries/{uid}/duplicate`, com `Idempotency-Key`, aceita `{"count":6,"first_competence":"2026-11","due_day":10}` e opcional `copy_quantity` (default false). Count 1–24, dia 1–28. Retorna 201 (replay 200) `{uid,items,total,replayed}`. O fingerprint idempotente inclui a origem do path, sem alterar o body; mesma chave/body com outra origem conflita. Para `monthly_unique_usage`, quantidade nunca é copiada: novas competências ficam `planned`.

**Fechar statement**

`POST /v1/admin/billing/statements`, com `Idempotency-Key`, recebe:

```json
{"uid_billing_account":"<uuid>","competence":"2026-09"}
```

Fecha atomicamente somente entradas `ready` daquela conta/competência e moeda; não fecha vazio nem mistura moedas. Para a mesma conta/competência, a mesma chave devolveu o statement original com `replayed=true`; chave nova também devolveu o statement original, com `replayed=false` (B10–B11). Não cria statement nem duplica valores. GET item: `/v1/admin/billing/statements/{uid}`. List/search: `GET /v1/admin/billing/statements` ou `POST /v1/admin/billing/statements/search`; mesma paginação e envelope. Erros funcionais observados incluem 403 `billing_not_allowed`; 404 `billing_statement_not_found`/`billing_account_not_found`; 409 `billing_statement_empty`, `billing_statement_currency_mismatch`, `billing_statement_closed` e `idempotency_conflict`; 422 `invalid_billing_statement`. `billing_statement_already_closed` constava de documentação anterior, mas não corresponde ao comportamento observado em B11.

Os contratos desta seção foram exercitados manualmente nos casos B01–B48, com resultados e limites registrados acima. A ausência de status HTTP nos relatos de determinados casos foi preservada; não inferir códigos que não foram registrados.

## Fase 2 — Reseller Billing Accounts 0201–0202 (HOMOLOGADA/FROZEN nos cenários executados)

**Estado SQL confirmado pelo operador:** migrations 0201 e 0202 registradas no PostgreSQL de homologação. `migrations/tests/reseller_billing_accounts.sql` e `migrations/tests/commercial_foundation.sql` executadas com `ON_ERROR_STOP=1`, aprovadas e terminadas em `DO / RESET / ROLLBACK`. Essa evidência SQL é distinta da homologação HTTP.

**Estado HTTP confirmado pelo operador:** casos B201-01 a B201-29 executados. Como a confirmação recebida lista os resultados de forma consolidada, este guia não atribui um número individual a cada chamada nem inventa status HTTP que não foram informados.

| Evidência HTTP reportada | Resultado confirmado |
|---|---|
| Associação própria da Power à Billing Account e associação da Automega criada pela Power | Confirmadas |
| Repetição no-op da associação | Membership e timestamps preservados |
| Administrator Power tenta transferir associação financeira | Negado conforme política Primary-only |
| Provisionamento de cliente pela Power | Associação financeira automática à conta da Power |
| Replay idempotente do provisionamento | Resultado original recuperado sem duplicar efeitos financeiros |
| Revogação de `reseller_enabled` | Bloqueou novas criações; preservou replay confirmado e administração autorizada de clientes existentes |
| Restauração de `reseller_enabled=true` | Confirmada |
| Remoção/transferência da própria organização pagadora Power com clientes ativos | Proteção confirmada |
| Leitura financeira pela Power e isolamento dos dados de entries/statements da Autoscale | Confirmados |
| Billing Entry da Automega, atualização pelo Administrator Power, cancelamento e tentativa de alterar o lançamento cancelado | Criação vinculada à conta Power, atualização autorizada, cancelamento e imutabilidade confirmados |
| Consultas com filtros estruturados | Funcionaram conforme os casos executados |

UIDs usados: Autoscale `a0000000-0000-4000-8000-000000000001`; Power `a0000000-0000-4000-8000-000000000002`; Automega Power `b5c64f64-b8dc-418b-8893-d6dd3635df5b`; cliente Power `71099c48-786c-43c1-b74b-13de490344c6`; Billing Account Power `6f0db72e-826f-44a9-8189-5cf937e7e161`; Billing Account Autoscale `6ed6d071-48bc-4689-95eb-38283d4dd393`.

O Billing Entry de homologação `d6b14745-ff00-4fc9-9554-7041182d613d` foi cancelado; seu estado final é `cancelled` e o valor histórico é R$ 20,00. Não incluir esse lançamento em fechamento futuro.

**Suporte e autorização:** o Administrator Power administra a carteira dentro dos seus perfis, áreas e scopes operacionais. A evidência observada preservou `uid_user_created` do Primary Autoscale e identificou `uid_user_updated` como Administrator Power após o PATCH; após cancelamento pelo Primary, o ator de atualização refletiu o Primary. Membership financeiro permite leitura consolidada conforme a política da conta, mas não concede autorização operacional de escrita sobre a organização consumidora. A regressão SQL aprovou o caso de ator com acesso financeiro à Power e sem scope operacional no consumidor; o caso equivalente não foi executado por HTTP.

### Ocorrência B201-15 — não reproduzida, causa raiz não determinada

Foi observada uma resposta inicial contendo demonstrativo pertencente à Autoscale durante uma consulta feita com intenção de autenticação Power. O parâmetro `?uid_billing_account=UUID` não é reconhecido pelo parser; a chamada correta usa `filters` estruturado ou `POST /search`. Isso não explica, por si só, a presença do demonstrativo da Autoscale. Retestes de acesso individual, listagem e busca estruturada não reproduziram a exposição. A investigação permanece aberta; não atribuir a causa a cliente HTTP, cache, proxy, token ou PostgreSQL sem evidência, nem registrar a ocorrência como corrigida.

### Verificações ainda não executadas

- Homologação HTTP com ator que tenha acesso financeiro, mas nenhum scope operacional no consumidor.
- Leitura consolidada HTTP com múltiplas organizações e valores no mesmo demonstrativo.
- Concorrência real de duas sessões para transferências; a regressão valida fronteiras temporais sequenciais, não espera concorrente em locks.
- Avaliação de rejeição explícita de parâmetros de filtro desconhecidos.
- Hardening `Cache-Control: private, no-store` nas rotas financeiras.
- Investigação adicional da B201-15 se a anomalia voltar a ocorrer.

A Fase 2 está **HOMOLOGADA E FROZEN no escopo funcional validado**. Isso não encerra a investigação de segurança da B201-15 nem homologa os cenários listados como não executados.

### Regressões SQL — comandos de repetição

As migrations já estão registradas; não reaplique migrations nesta etapa. Para repetir somente as regressões, execute na máquina operacional e confirme `ROLLBACK` ao final de cada script:

```bash
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/reseller_billing_accounts.sql
psql -d autoscale_nvs_db -v ON_ERROR_STOP=1 -P pager=off -f migrations/tests/commercial_foundation.sql
```

### Contrato das operações de associação financeira

As chamadas exigem Bearer de sessão e `Content-Type: application/json`; a autorização SQL é a autoridade. Não usam `Idempotency-Key`: PUT/DELETE são idempotentes e a repetição no-op não cria período ou auditoria. Somente Primary pode alterar/remover memberships manualmente.

`PUT /v1/admin/organizations/{uid}/billing-account` recebe:

```json
{
  "uid_payer_organization": "<uuid da organização pagadora>",
  "uid_commercial_origin_organization": "<uuid da origem comercial>",
  "reason": "Motivo comercial aprovado",
  "confirm_transfer": true
}
```

A resposta de mudança inclui `uid_organization`, `uid_billing_account`, `uid_payer_organization`, `uid_commercial_origin_organization`, `started_at` e `changed:true`; repetição retorna `changed:false`. `DELETE /v1/admin/organizations/{uid}/billing-account` recebe `{"reason":"Motivo aprovado","confirm_removal":true}`. Se o alvo for o payer organization da própria conta, DELETE e PUT que tente transferi-lo são recusados com `billing_account_conflict`; clientes não são movidos automaticamente.

Códigos documentados pelo contrato: 400 `invalid_request`; 401 `authentication required`; 403 `billing_not_allowed`; 404 `organization_not_found`; 409 `billing_account_conflict`, `billing_account_required`, `billing_commercial_origin_conflict` ou `billing_account_membership_period_overlap`; 422 `invalid_billing_uid`, `invalid_billing_reference` ou `invalid_billing_account_transfer`; 503 `billing_storage_unavailable`.

## Precificação técnica — Fase 2 / 0206 HOMOLOGADA E FROZEN no escopo validado

O operador confirmou os pré-requisitos 0196 e 0205, a aplicação da 0206 em `autoscale_nvs_db` em `2026-10-21 00:37:49.393635-03` e a regressão `migrations/tests/technician_pricing.sql` aprovada com `ON_ERROR_STOP=1`, terminando em `SET CONSTRAINTS`/`ROLLBACK`. Testes Go focados, vet e build foram aprovados localmente durante a implementação. A suíte agregada de filtros ficou bloqueada pela precondição `billing_0192_required` do harness PGlite; não registrar essa suíte como aprovada. A evidência HTTP abaixo é independente das validações SQL e Go.

A regressão SQL cobre imutabilidade de UPDATE/DELETE das versões até pela role proprietária, integridade dos snapshots, inserção legítima e tombstone `disabled`, FKs compostas snapshot→OS/item e snapshot→versão de preço, rejeição de combinação item/OS incompatível, UPDATE idempotente da capability em OS despachada e rejeição de mudança efetiva após o dispatch. Projeções preservam testes técnicos e OS canceladas.

**HTTP confirmado pelo operador:** TP-06–TP-13 cobriram GET vazio, consulta e associação de capabilities, quatro preços versão 1, cálculo monetário, PUT idêntico como no-op e alteração para versão 2 (`vehicle_cameras/install`: custo 11000 centavos, markup 40%, preço 15400). PostgreSQL confirmou versões 1 e 2 preservadas. TP-26–TP-30 cobriram OS #60: criação draft sem snapshot, dispatch com snapshot version 2/11000/40%/15400/BRL e preservação desse snapshot após a tabela avançar à versão 3 (custo 13000/preço 18200). TP-31 confirmou que o executor não recebe snapshot nem valores financeiros; TP-32 confirmou Basic negado com `area_not_allowed`. TP-36–TP-38 cobriram OS #61 sem preço: draft sem snapshot e dispatch com `status=unpriced`, sem versão ou valores econômicos. As OS #60 (`b823f40e-6b26-4c76-ba1e-f4dc00abc963`) e #61 (`be314edf-f6d7-429a-a319-f9246e47304e`) permaneceram `dispatched`; nenhum status HTTP não fornecido pelo operador é inferido neste registro.

**HTTP ainda pendente:** isolamento financeiro cross-organization com atores distintos; matriz completa de permissões administrativas alternativas; concorrência real em sessões distintas; remoção/desativação de preços; OS com itens precificados e `unpriced` no mesmo pedido; e demais negativos periféricos não executados. A Fase 2 está **HOMOLOGADA/FROZEN somente no escopo acima**. Não repetir migrations ou regressão SQL homologadas para estes casos.

1. `GET /v1/admin/entities/technicians/{uid}/prices` com Bearer de Primary ou Administrator com área financeira. Esperado 200; para tabela vazia, `items: []`.
2. `PUT /v1/admin/entities/technicians/{uid}/prices` com `Content-Type: application/json` e body:
   `{"items":[{"capability_code":"vehicle_cameras","operation":"install","technician_cost_cents":10001,"markup_percent":12.34,"currency_code":"BRL"}]}`. Esperado 200 com version 1 e `client_price_cents:11235`.
3. Repetir o PUT idêntico. Esperado 200 com a mesma versão, sem nova auditoria/version.
4. Criar uma OS por `POST /v1/admin/devices/work-orders`, header `Idempotency-Key: <UUID>`, com item opcional `"capability_code":"vehicle_cameras"`; itens sem capability devem continuar aceitos.
5. Despachar em `POST /v1/admin/devices/work-orders/{uid}/dispatch` com Bearer. Esperado 200; detalhe administrativo com área financeira mostra snapshots. Para item precificado, `status=priced`; para item sem preço, `status=unpriced`, sem valores fictícios. A OS mista deve ser despachável.
6. Alterar a tabela e consultar o detalhe novamente; snapshot original deve preservar versão/custo/markup/preço/moeda.
7. Consultar a mesma OS em `/v1/technician/work-orders/{uid}` com sessão do executor atribuído. Confirmar que não existe `pricing_snapshot`, custo, markup, preço ou moeda; o requisito `required_capability` pode ser exibido.
8. Tentar preço sem área financeira e entre organizações; esperado 403/404 sem revelar ou alterar dados.

Os passos seguintes são cenários de expansão ainda pendentes, não evidência de homologação. Os status descritos são expectativas do contrato local, não resultados observados. Confira [technician_pricing.md](technician_pricing.md) para payloads e erros; não repita os casos TP já confirmados acima.

### Requisições de OS para a homologação 0206

Criação com uma capability e outro item sem capability (substituir os UIDs pelos dados criados durante o roteiro; não reutilizar uma Idempotency-Key):

```http
POST /v1/admin/devices/work-orders
Authorization: Bearer <ADMIN_OR_PRIMARY_TOKEN>
Idempotency-Key: <UUID>
Content-Type: application/json
```

```json
{
  "uid_asset": "ASSET_UUID",
  "uid_technician": "TECHNICIAN_UUID",
  "description": "Homologação de snapshot de preço técnico",
  "items": [
    {"slot_number": 1, "operation": "install", "uid_device_before": null, "uid_device_after": "DEVICE_UUID_1", "capability_code": "vehicle_cameras"},
    {"slot_number": 2, "operation": "install", "uid_device_before": null, "uid_device_after": "DEVICE_UUID_2"}
  ]
}
```

Esperado: 201 na primeira chamada; replay da mesma chave/body retorna a OS existente. `capability_code` é opcional. Os dois devices precisam estar `available` e os slots ativos/vazios.

```http
POST /v1/admin/devices/work-orders/WORK_ORDER_UUID/dispatch
Authorization: Bearer <ADMIN_OR_PRIMARY_TOKEN>
Content-Type: application/json
```

Body: `{}`. Esperado: 200. Para validar snapshot, o técnico precisa ter `vehicle_cameras` ativo e associado. Com preço vigente, o item 1 fica `priced`; o item 2 fica `unpriced`; ambos são despachados. Um executor sem área financeira consultando seu próprio detalhe não recebe os campos `pricing_snapshot` nem valores econômicos.
