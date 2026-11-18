# Integração frontend — inventário e alinhamentos

## 23/10/2026 — SYS-GED-01: replay de contrato e regressão transversal

Novo teste HTTP independente do GED: GET catalogs 200, POST document-contracts 201 e retry idêntico 422 invalid_document. A chamada read-only common.check_create_visibility('document-contracts',uid), sob navisoft_auth/Primary, confirmou SQLSTATE 22023 invalid_create_resource e ROLLBACK. Contrato fixture 613148b0-6a44-4b5b-9f55-da7dd39c01a8 preservado: nenhuma criação de documento, revisão, distribuição ou objeto físico foi alcançada. Não repetir com outra chave para contornar o defeito. Evidência: [GED](evidence/2026-10-23-ged-http.json).

Comparação estática entre dispatcher da 0171 e definição efetivamente instalada encontrou 12 branches explícitos ausentes: document-contracts, documents, document-revisions, document-distributions, document-classes, functional-groups, functional-group-members, checklist-groups, checklists, checklist-runs, maintenance-orders e maintenance-order-transitions. O branch dinâmico drivers/drivers-* também não aparece na definição atual. A 0203 substituiu a função com uma versão reduzida; correções 0209–0211 restauraram apenas casos pontuais. Isto comprova omissões no dispatcher, não falha HTTP reproduzida de todos esses recursos; GED contrato foi reproduzido. SYS-RES-01 segue aberto para o recurso novo de identidade, que também precisa integração explícita.

Correção de análise anterior: o relato em SYS-OS-01 de que os recursos GED tinham branches correspondentes não descreve o banco atual e não deve orientar implementação. Exige auditoria cumulativa do dispatcher, incluindo rotas cuja intenção nasce fora de atomicCreateResources e normalização entre rota/recurso de receipt. 0217 foi encontrada registrada nesta consulta, sem execução de rebuild/worker ou confirmação de regressão integral.


## 22/10/2026 — SYS-OS-02 retestado; SYS-RES-01 aberto

API voltou a responder. Fixture nova executou instalação, substituição e retirada com executor Basic vinculado e scope explícito de assets. Conclusões e replays 200, mesmos UIDs/completed_at, sem pricing_snapshot no self-service. Conflito de fingerprint 409; perda/restauração de scope com novo login negou/permitiu replay. Substituição e retirada tiveram declaração de devolução 200 preservando return_pending e recebimento físico administrativo 200 fechando custódia. SYS-OS-02 encerrado nesses cenários HTTP após 0212. Não é aprovação integral do módulo nem confirmação independente da regressão SQL. Fixture: login desvinculado/desabilitado, técnico desativado, dois assets excluídos 204; devices preservados com histórico e sem custódia pendente. Evidência: [0212 HTTP](evidence/2026-10-22-work-order-executor-0212-http.json).

Continuidade em identidade/projeção (0213–0216): listagens protocol-identities e telemetry-mappings 200; identidade criada 201 com zeros iniciais preservados. Retry com mesma chave/body/ator retornou 422 invalid_device: **SYS-RES-01 aberto**. Consulta read-only sob navisoft_auth/Primary confirmou common.check_create_visibility('devices/protocol-identities',uid) -> 22023 invalid_create_resource, com ROLLBACK. Go registra devices/protocol-identities, devices/protocol-identities/:uid/shares e devices/telemetry-mappings como create idempotente; revisar integração de todos com o dispatcher, sem presumir que os dois últimos já falharam em HTTP. Identidade de teste desativada por PUT 200. Worker/Valkey não foram iniciados ou homologados. Evidência: [identidade e replay](evidence/2026-10-22-protocol-resolution-http.json).


## 22/10/2026 — reteste bloqueado por conexão HTTP recusada

Verificadas as últimas entregas: 0212 corrige validação da prestadora na retirada self-service; 0213–0216 adicionam/corrigem resolução de identidade e projeção. Consulta PostgreSQL read-only confirmou essas cinco migrations registradas e terminou em ROLLBACK. Isso não comprova sucesso das regressões SQL. O último retorno do programador ainda deixa pendente o reteste de device_protocol_resolution.sql após corrigir a fixture de replacement completo de overrides.

Tentativa real de POST /v1/users/login em http://172.25.73.91:8080 falhou antes de obter resposta HTTP: WinError 10061 (conexão recusada). Nenhum status HTTP, login ou fixture foi criado; SYS-OS-02 continua aguardando reteste HTTP da retirada/replacement e replay com executor Basic. É necessário disponibilizar novamente o listener da API nesse endereço para continuar. Não confundir indisponibilidade de conexão com erro de payload ou de autorização. Evidência: [tentativa e estado SQL](evidence/2026-10-22-work-order-executor-0212-http.json).


## SYS-OS-01 — replay retestado; SYS-OS-02 — retirada pelo executor

Operador informou regressão PostgreSQL concluída com RESET/DO/ROLLBACK e API reiniciada. Consulta read-only confirmou 0210 e 0211 registradas e terminou em ROLLBACK. Replay do receipt original de conclusão retornou 200/replayed=true, mesmo UID, completed_at e pricing_snapshot. Em fixture HTTP nova com usuário Basic vinculado ao executor: instalação/conclusão e replay 200; corpo alterado com mesma chave 409; alvo diferente 409; ausência de sessão 401; retirada de scope com novo login 404; restauração de scope com novo login permitiu replay 200. Resposta self-service não expôs pricing_snapshot. SYS-OS-01 encerrado nesses cenários. Não foi retirada a permissão global devices.access.

A continuação encontrou **SYS-OS-02**: nova OS de retirada criada e despachada, start self-service 200, mas complete do executor retornou 409 device_reference_conflict. A mesma OS e corpo foram concluídos via rota administrativa com Primary (200). Causa interna ainda não confirmada; o handler mapeia SQLSTATE 23503 desconhecido para essa mensagem. Inspeção read-only encontrou trigger devices.capture_technician_history na custódia, que revalida técnico/prestadora; é ponto de investigação, não causa comprovada. Solicitar regressão com identidade Basic e scope restrito a assets durante a retirada, sem ampliar grants ou transformar o executor em administrador.

Cleanup concluído via API: executor declarou devolução 200, mantendo return_pending sem received_at/closed_at; Primary recebeu fisicamente 200 e fechou custódia. Login desvinculado, executor desativado, usuário de fixture desabilitado e dois assets excluídos 204. Device mantido por 409 de dependência histórica, sem custódia aberta. Evidências: [replay original](evidence/2026-10-21-work-order-0211-retest.json) e [executor e retirada](evidence/2026-10-21-work-order-executor-0211-http.json). Não marcar todo o módulo como homologado.


## SYS-TECH-01 — 0209 retestada; novo bloqueio SYS-OS-01

Operador informou migrations e regressão sem erro. HTTP confirmou replay do receipt original 200 e novo ciclo create 201/replay 200/conflict 409. Capabilities repetidas retornaram 422 sem alteração; preço válido 200 com custo 10001, markup 12.34 e total 11235 centavos. Replacement no-op preservou items/version/effective_at; custo negativo 422 preservou preços; DELETE técnico 405 e desativação 200. Em conta Secondary com grant temporário, criação 201, replay após retirada e novo login 404, e replay após restaurar grant 200 com mesmo UID. Campos originais da conta conferidos restaurados e executores desativados. Evidências: [0209](evidence/2026-10-21-technician-0209-retest.json) e [replay com scope](evidence/2026-10-21-technician-replay-scope-http.json). SYS-TECH-01 encerrado nesses cenários.

Continuidade em OS: novo asset/device de fixture, prepare/release, create/replay de OS, dispatch e snapshot priced version 1/11235 centavos aprovados. Start antes de confirmar recebimento retornou 409 device_custody_confirmation_required; confirmação, start e conclusão retornaram 200, completed=true. Replay imediato da conclusão com mesmo body/chave retornou 422 invalid_device: **SYS-OS-01 aberto**. Diagnóstico SQL read-only sob navisoft_auth/Primary: check_create_visibility('device_work_order_completion',uid) retorna 22023 invalid_create_resource. Receipt original existe. ROLLBACK confirmado.

Cleanup pelo fluxo operacional: segunda OS removeu o device, recebimento de retorno 200 fechou a custódia, asset excluído 204, executor desativado 200. Exclusão do device retornou 409 por dependência histórica; mantido na fixture, sem apagar OS ou FKs. Evidência [OS completa e cleanup](evidence/2026-10-21-technical-work-order-http.json). A primeira execução do teste esperava incorretamente 201 no replay de criação da OS; o 200 observado era correto e a expectativa foi ajustada antes de continuar. Não atribuir esse ajuste ao backend.


## SYS-TECH-01 — replay de criação de executor rejeitado

Após SYS-GEO-01 resolvido e avanço nos tópicos Entidades/Frota/Devices, cadastro de técnico foi testado com prestadora nova classificada technician. Create retornou 201 com executor `74bca4b5-0657-4110-a638-9ddfbc7bde93`; retry imediato do mesmo body/chave retornou 422 `invalid_technician`, em vez de 200 replay. Receipt confirmado somente por consulta read-only: request_uid `191b68eb-e53f-40e7-9904-89d09e3aaa57`, resource `entities/technicians`. Não foi necessário criar outro executor para reproduzir.

A chamada de common.check_create_visibility('entities/technicians',uid) sob navisoft_auth, ator Primary, retornou SQLSTATE 22023 `invalid_create_resource`, com ROLLBACK confirmado. A definição atual da função na 0203 não contém esse recurso na revalidação do replay, enquanto o registro Go aceita a criação idempotente. O mapeamento de erro do técnico transforma 22023 em invalid_technician. Não foi alterado SQL ou código pelo tester.

Executor de teste foi desativado via PATCH 200; prestadora preservada por DELETE 409 devido à referência histórica, sem apagar vínculo/constraint para forçar limpeza. Preço/dispatch não foram alcançados nesta rodada. Evidência em [técnico/prestadora](evidence/2026-10-21-technician-provider-pricing-http.json). Critérios de correção em frontend_issues.md. Nenhuma OS foi criada ou despachada.


## SYS-GEO-01 — 0208 aplicada, reteste HTTP e fronteira de privilégios

Operador informou SQL executado; consulta read-only confirmou 0208 registrada. Fronteira observada: navisoft_auth sem SELECT na scope_grants; owner Geo com SELECT na coluna uid_user e sem UPDATE. ROLLBACK confirmado. Não foi rerodada a regressão operacional completa pelo tester.

Reteste inicial GET/POST cercas, pontos e rotas: quatro 200. Fixture de duas cercas organizacionais: 26 chamadas passaram (duas criações e 24 consultas GET/list/search/detail em quatro perfis), incluindo listas vazias fora do scope e detalhe 404 para Administrator/Secondary. Basic recebeu 403 area_not_allowed, coerente com sua área atual; isso não testa Basic com área concedida. Duas exclusões da fixture retornaram 204. Evidências: [preflight](evidence/2026-10-21-geofence-0208-preflight.json) e [quatro perfis](evidence/2026-10-21-geofence-0208-http.json). SYS-GEO-01 encerrado neste escopo; não homologa toda geometria, transferência ou concorrência.

## Ampliação HTTP — Entidades, Frota e Devices/SIM

Entidades: sete operações CRUD/idempotência e 15 casos adicionais de tipos, lifecycle e negativas passaram. Frota: 15 operações de entidade/grupo/asset/participação, replay, imutabilidade organizacional e lifecycle passaram; entidade parent preservada por 409 após exclusão lógica do asset (dependência histórica). Devices/SIM: 12 chamadas passaram, liberação atômica de SIM observada na desativação e ausência de relink automático na reativação; cadastros novos removidos por DELETE 204. Não houve alteração de ativos ou dispositivos preexistentes, comando físico, ingestão ou provisioning externo.

Documentos por tópico: [Entidades](frontend_03_entities.md), [Frota](frontend_04_fleet.md), [Devices/SIM](frontend_05_devices_sim.md), [Geografia](frontend_06_geography.md). Todos delimitam o escopo testado; não representam aprovação integral dos módulos.


## SYS-KB-01 — reteste HTTP aprovado; nova falha SYS-GEO-01

Após correção, 13 chamadas de Knowledge passaram: GET/POST listagem com envelope, paginação sem duplicatas entre as páginas observadas, busca vazia, limite/filtro inválido 400, detalhe preservado e seis negativas de listagem/pesquisa com Administrator/Secondary/Basic (403 knowledge_primary_required). Listas não incluíram videos. Evidência: [reteste Knowledge](evidence/2026-10-21-knowledge-listing-retest.json). SYS-KB-01 encerrado no escopo HTTP executado; isso não homologa todos os fluxos editoriais.

A varredura prosseguiu com 24 GETs; consultas antes sem organização passaram ao receber filtro uid_organization eq. Billing, Services, Commercial overview, configuração da Agenda e Notifications responderam 200. Geofences permaneceu 403 geo_not_allowed com Primary, mesmo com filtro válido. Evidência: [continuação da varredura](evidence/2026-10-21-system-readonly-primary-survey-continued.json).

SYS-GEO-01 confirmado em PostgreSQL: BEGIN READ ONLY, SET LOCAL ROLE navisoft_auth, ator Primary e app.organization_target, chamada geo.geofence_list() capturada em bloco de diagnóstico retornou SQLSTATE 42501, MESSAGE permission denied for table scope_grants; contexto SQL function can_read_scope, chamada pela listagem de cercas. ROLLBACK confirmado. Uma primeira probe sob reader negou EXECUTE da função; essa role NÃO é a utilizada por filteredList para geofences e não é a reprodução representativa. A reprodução relevante usa navisoft_auth, como internal/server/search.go. Não conceder SELECT genérico ao runtime ou mudar RLS para mascarar a falha; programador deve determinar a fronteira mínima correta.


## Varredura de sistema — bloqueio Knowledge em listagem/pesquisa

Executadas 52 consultas GET de reconhecimento com Primary, em 21/10/2026; não são homologação completa dos módulos. Respostas 400 `organization_target_required` indicam chamadas ainda sem o corte organizacional do contrato, não defeitos comprovados. Dois 403 geográficos permanecem por investigar. O primeiro 5xx ocorreu em listagem de artigos Knowledge. Evidência agregada em [varredura Primary](evidence/2026-10-21-system-readonly-primary-survey.json).

Reprodução dirigida: GET `/v1/admin/knowledge/items` e POST `/v1/admin/knowledge/items/search` com `{limit:2,offset:0}` retornaram 503 `knowledge_storage_unavailable`. Categorias e detalhe do artigo existente retornaram 200 na mesma sessão; não atribuir a falha a indisponibilidade total de Knowledge. Request IDs das falhas: `8ae81a34-bbc5-446b-b659-ecb015ce2cce` e `e3910096-3381-4ace-a8d2-5e741d5703db`. Evidência em [reprodução Knowledge](evidence/2026-10-21-knowledge-listing-503.json).

Hipótese estática a confirmar: `internal/filters/lists.go` usa `knowledge.admin_item_rows() AS k(uid uuid,...)`, enquanto a migration Knowledge 0002 declara RETURNS TABLE, para o qual uma lista tipada redundante pode ser inválida. Não houve alteração de código. A inspeção direta do banco `postgres_knowledge` foi recusada por pg_hba para o acesso administrativo; não foi alterado pg_hba nem reutilizada credencial da aplicação. Causa instalada ainda precisa de confirmação pelo programador/log SQL.

Bloqueio de aceite: tela administrativa de artigos e pesquisa não podem ser consideradas integráveis/homologadas até corrigir e retestar. A recuperação de senha permanece funcional; a restauração da senha antiga é pendência independente e não motivou esta parada.


## INT-02 — recuperação positiva aprovada; restauração de senha bloqueada

Operador recebeu o email real e forneceu o link de recovery. Validate retornou 200 com política de senha e prazo, sem identidade; complete com senha nova de homologação retornou 204 sem corpo. Bearer anterior retornou 401 `revoked` em Status e 401 no contexto. Revalidação e segundo complete do token consumido retornaram 422 `recovery_token_invalid_or_expired`. Login com a senha nova retornou 200.

A tentativa autorizada de restaurar a senha anterior usando `cmd/password-init -recover` foi rejeitada com `password_recently_used` (exit 1). Não houve bypass do histórico nem alteração SQL. A senha do Basic permanece a nova usada no recovery e seu login foi conferido 200 após a falha de restauração. Credencial e token não são gravados neste documento ou evidência. **Pendência operacional aberta:** alinhar com operador/programador se manter senha nova ou prover procedimento de homologação específico, sem enfraquecer a política geral. Não declarar restauração concluída.

Evidência: [recuperação positiva](evidence/2026-10-21-int02-recovery-positive-http.json). Recuperação funcional e uso único passaram; restauração é bloqueio separado. O navegador ainda não foi homologado, e isso não entrega fluxo de convite/primeira senha nem cadastro público.


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

O código explica o resultado: `users.admin_save()` atualiza campos que disparam `version_sessions`; o trigger aumenta `session_version`, e a validação de sessão retorna `state=revoked` quando a versão diverge. O teste não confirmou que `revoked_at` foi preenchido. Esse é o comportamento atual do PUT completo de usuário; após qualquer PUT, o cliente deve descartar o Bearer anterior e exigir novo login para a conta afetada. A autorização no novo login reflete os scopes atuais. Evidência: [revogação de scope](evidence/2026-10-21-int01-live-scope-revocation.json). Outros caminhos de alteração de autorização, temporalidade/MFA e acesso somente financeiro permanecem pendentes.


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

**Parecer: aprovação HTTP parcial para Primary e negativas sem autenticação.** Pendentes HTTP: Administrator, Secondary, Basic, cross-tenant com sessão válida, membership somente financeiro, outros caminhos de alteração de autorização, modo temporal block/warn, pending MFA, falha técnica e equivalência dos gates com mutações reais. O caso de retirada de scope por PUT completo foi homologado separadamente e invalidou a sessão anterior. Não marcar INT-01 integralmente homologado. A busca também apresentou um nome preexistente com caracteres de substituição; origem e abrangência dessa anomalia de dados não investigadas nesta rodada.


## Reteste HTTP após implementação — sessão expirada

O operador informou aplicação das migrations e execução da regressão sem erro, terminando em `ROLLBACK`, seguida de reinício da API. Essa é evidência SQL reportada pelo operador; o tester não executou SQL.

No reteste direto, `/v1/users/status` retornou **401**, `authenticated=false`, `state=expired`, `relogin_required=true`. As três rotas INT-01 retornaram **401 authentication required**, com `Cache-Control: no-store`; sem Bearer também retornaram 401 com no-store. Não houve payload funcional acessível. Casos de paginação, busca, UUID inválido e organização inexistente não atingiram sua validação de domínio: são **inconclusivos por sessão expirada**, não falhas funcionais. Paginação não foi avaliada.

Evidência sanitizada em [2026-10-21-int01-primary-http.json](evidence/2026-10-21-int01-primary-http.json). Necessário token Primary ativo para continuar; depois, sessões restritas para negativas de autorização. Não houve mutação HTTP, SQL nem execução Go nesta rodada. As declarações anteriores de migration ainda não aplicada são históricas e foram superadas pelo relato atual do operador; isso não representa homologação HTTP completa.


## Objetivo e limites

Preparar o roteiro de integração React por módulo, com contratos derivados do código e evidências separadas de implementação, testes locais, regressão SQL e homologação HTTP. Este registro não implementa nem autoriza acesso novo.

## INT-01 — contexto de acesso do frontend

Estado atual: implementado localmente. A migration forward `0207_frontend_access_context.up.sql` é necessária para o terceiro endpoint e ainda não deve ser considerada aplicada. Os exemplos abaixo descrevem o código local; não são homologação HTTP.

### Contratos implementados

Todos os endpoints exigem `Authorization: Bearer <token>` e respondem `Cache-Control: no-store`. Pending MFA e sessão inválida não passam pelos endpoints de contexto. O endpoint global usa o middleware de identidade sem impor o gate de período; os dois endpoints de organização usam o mesmo gate temporal de `/v1` protegido. O estado de sessão continua sendo serializado pelo DTO usado em `/v1/users/status`.

`GET /v1/users/me/access-context` retorna a sessão atual e os gates grosseiros de área:

```json
{
  "session": {
    "authenticated": true,
    "state": "active",
    "relogin_required": false,
    "application": "navisoft",
    "uid_user": "<uid do próprio usuário>",
    "uid_organization": "<organização da sessão>",
    "uid_session": "<sessão atual>",
    "access_period": { "mode": "disabled", "allowed": true }
  },
  "area_access": {
    "status": "evaluated",
    "areas": {
      "assets": "allowed",
      "organizations": "denied",
      "maintenance": "denied"
    }
  }
}
```

O campo `session` mantém o shape completo atual de `/v1/users/status`; o exemplo abrevia campos dinâmicos. `areas` contém o catálogo fixo: `addresses`, `agenda`, `assets`, `assets_groups`, `checklists`, `collaborators`, `commercial`, `contacts`, `devices`, `devices.pricing`, `documents`, `drivers`, `drivers_exams`, `entities`, `entity_types`, `event_occurrences`, `events`, `geo_geofences`, `geo_points`, `geo_routes`, `knowledge`, `maintenance`, `notifications`, `organizations`, `simcards`, `units` e `users`. Cada valor reflete apenas a verificação de área existente para o próprio ator. Não é permissão de escrita ou de acesso a qualquer registro. Fora do período, a resposta mantém a sessão e retorna `area_access.status=not_evaluated`, `reason=outside_access_period`, `areas={}`; se o próprio dado temporal não estiver disponível, `reason=access_period_unavailable`. A consulta de gates é pulada nessas condições.

`GET /v1/users/me/organizations?limit=50&after_uid=<uuid>&q=<texto>` lista as organizações explicitamente visíveis ao ator pela política operacional de organização, ordenadas por UID crescente. `q` é opcional e usa a busca central de `organizations`, limitada aos campos de código/nome; não são aceitos filtros por owner, criador, billing plan ou outros campos internos:

```json
{
  "items": [{"uid":"<uuid>","code":"power","name":"Power"}],
  "has_more": true,
  "next_after_uid": "<uid do último item desta página>"
}
```

`limit` é opcional, padrão 50, intervalo 1–100. `after_uid` é opcional e exclusivo: a próxima página consulta UIDs maiores. `next_after_uid` é `null` quando não há próxima página. Os parâmetros repetidos, desconhecidos, inválidos e limites fora da faixa retornam HTTP 422 `invalid_organization_query`. O predicado de busca é construído pelo `filters.Manager` a partir do catálogo fixo e de `settings/filters.json`; a paginação/cursor não passa pelo offset da listagem administrativa. A query usa RLS a cada página e seleciona apenas UID/code/name. Não expande ancestrais, não consulta membership financeiro nem filtra lifecycle; cada operação de domínio mantém suas próprias verificações. Sob mudanças concorrentes, grants revogados deixam de aparecer nas consultas seguintes; organizações novas com UID maior que o cursor podem aparecer. Uma nova organização com UID menor/igual ao cursor não entra na sequência já iniciada. Não há snapshot multi-page.

`GET /v1/users/me/organizations/{uid}/access-context` retorna gates gerais para uma organização que seja visível ao ator:

```json
{
  "uid_organization": "<uuid>",
  "organization": {
    "code_name_update": "allowed",
    "reseller_enabled_update": "denied"
  },
  "session_policy": {"read":"allowed","update":"allowed"}
}
```

`code_name_update` informa o gate administrativo geral que protege edição de código/nome; validação do payload, unicidade, referência de plano e demais regras ainda podem rejeitar o PUT. `reseller_enabled_update` é Primary-only e independe do gate geral. `session_policy.read/update` usa a mesma regra de gerenciamento de acesso aplicada pela rota; `update=allowed` não garante payload válido nem ausência de efeitos colaterais como revogação de sessões. A consulta de política é somente uma leitura de gate e não chama a função mutadora que bloqueia a linha `settings`. Não há gate separado para plano de cobrança nesta versão. Nenhum campo é inferido de autoria, owner ou membership financeiro.

Erros: 401 para sessão inválida ou pending MFA; 403 para aplicação incompatível e para bloqueio temporal nos endpoints que impõem período (a resposta mantém o DTO de sessão como `/v1/users/status`); 422 `invalid_organization_uid` para UUID malformado; 404 `organization_not_found` para organização inexistente ou ocultada pela política atual; 422 `invalid_organization_query` para paginação inválida; 503 com código estável de contexto/armazenamento para falha técnica. Os corpos de erro não expõem mensagem PostgreSQL nem nome de função SQL. Uma organização visível com gate negado retorna 200 e `denied`; estar selecionável não concede escrita.

### Autoridades e limites

- As áreas são calculadas pelo gate atual `users.has_area` para o ator; o conjunto de códigos acompanha a allowlist de permissões cadastráveis. Esta lista ajuda a construir navegação, não espelha todos os gates adicionais de rotas.
- A seleção é uma leitura sob `navisoft_writer` e RLS existente de `organizations.organizations`; apenas membership operacional explícito/global pode produzir itens. Membership financeiro é irrelevante.
- A projeção `organizations.frontend_access_context(uuid)` da migration 0207 valida que o alvo existe e está atualmente visível, retornando a mesma decisão de autorização geral usada pelos endpoints correspondentes. O DTO traduz os resultados em `allowed`/`denied` e não inclui os nomes das funções SQL.
- Nenhuma resposta concede autorização. O backend reavalia cada ação real, cada registro e cada página. A API não lista assets para construir capabilities.
- Não há revision, cache de autorização do servidor ou evento/SSE que cubra toda mudança de scopes/permissões. Refazer os GETs ao focar a aplicação, trocar organização e depois de 403/404; limpar cache local de dados agora inacessíveis. Dados abertos continuam sujeitos a autorização nas próximas chamadas.

### Evidência HTTP histórica — antes da implementação — 21/10/2026

Base de homologação: `http://172.25.73.91:8080`. Foram feitas somente quatro consultas GET, com sessão Primary fornecida pelo operador, após seu relato de reinício da API. Token não registrado neste documento.

| Consulta | Resultado observado |
|---|---|
| `/v1/users/status` | 200; `authenticated=true`, `state=active`, `application=navisoft`, organização Autoscale; período `mode=disabled`, `allowed=true`. |
| `/v1/users/me/access-context` | 404; `message=Not Found`. |
| `/v1/users/me/organizations?limit=1` | 404; `message=Not Found`. |
| `/v1/users/me/organizations/a0000000-0000-4000-8000-000000000001/access-context` | 404; `message=Not Found`. |

Naquele checkout, as rotas ainda não existiam; as três respostas 404 são evidência histórica anterior à implementação. Não representam o estado local atual. A aplicação da 0207, regressão SQL e reteste HTTP ainda são necessários para homologação funcional.

### Aceite ainda necessário

- Revisão da implementação e dos contratos exatos antes de gerar exemplos React.
- Positivos Primary e perfis restritos; negativas cross-tenant e membership somente financeiro.
- Scopes parciais, revogação com sessão existente e paginação com reautorização.
- Gates consistentes com a autorização das operações correspondentes, separando validação de payload.
- Restrição temporal, sessão pendente MFA, sessão inválida e indisponibilidade técnica.
- `Cache-Control: no-store` e ausência de segredos/metadados fora do alcance.

## Próximos alinhamentos

1. INT-02: primeiro acesso, convite e recuperação de senha; distinguir usuário CRUD, administrador provisionado e conta vinculada a técnico.
2. Cadastro público: investigar fluxo de visitante, organização e administrador; não expor provisionamento administrativo como cadastro público por suposição.
3. Contratação e ativação: separar oferta/termos, pedido, Agreement, desired state, provisioning e elegibilidade financeira.
4. Demais módulos: fechar inventário e evidência antes da documentação detalhada e dos exemplos React.

Convite verificar email e habilitar conta são decisões ainda não confirmadas pelo operador. Não tratá-las como comportamento aprovado ou existente.
