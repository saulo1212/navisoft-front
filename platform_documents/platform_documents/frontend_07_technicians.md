# Frontend — tópico 07: prestadora, executor e precificação

## SYS-TECH-01 — 0209 retestada; novo bloqueio SYS-OS-01

Operador informou migrations e regressão sem erro. HTTP confirmou replay do receipt original 200 e novo ciclo create 201/replay 200/conflict 409. Capabilities repetidas retornaram 422 sem alteração; preço válido 200 com custo 10001, markup 12.34 e total 11235 centavos. Replacement no-op preservou items/version/effective_at; custo negativo 422 preservou preços; DELETE técnico 405 e desativação 200. Em conta Secondary com grant temporário, criação 201, replay após retirada e novo login 404, e replay após restaurar grant 200 com mesmo UID. Campos originais da conta conferidos restaurados e executores desativados. Evidências: [0209](evidence/2026-10-21-technician-0209-retest.json) e [replay com scope](evidence/2026-10-21-technician-replay-scope-http.json). SYS-TECH-01 encerrado nesses cenários.

Continuidade em OS: novo asset/device de fixture, prepare/release, create/replay de OS, dispatch e snapshot priced version 1/11235 centavos aprovados. Start antes de confirmar recebimento retornou 409 device_custody_confirmation_required; confirmação, start e conclusão retornaram 200, completed=true. Replay imediato da conclusão com mesmo body/chave retornou 422 invalid_device: **SYS-OS-01 aberto**. Diagnóstico SQL read-only sob navisoft_auth/Primary: check_create_visibility('device_work_order_completion',uid) retorna 22023 invalid_create_resource. Receipt original existe. ROLLBACK confirmado.

Cleanup pelo fluxo operacional: segunda OS removeu o device, recebimento de retorno 200 fechou a custódia, asset excluído 204, executor desativado 200. Exclusão do device retornou 409 por dependência histórica; mantido na fixture, sem apagar OS ou FKs. Evidência [OS completa e cleanup](evidence/2026-10-21-technical-work-order-http.json). A primeira execução do teste esperava incorretamente 201 no replay de criação da OS; o 200 observado era correto e a expectativa foi ajustada antes de continuar. Não atribuir esse ajuste ao backend.


## Estado

Integração parcial; SYS-TECH-01 tem correção local preparada em 0209. Não homologar replay até aplicar a migration, executar a regressão SQL e retestar HTTP.

## Conceitos e ordem

1. Selecionar organização operacional autorizada.
2. Cadastrar/selecionar entidade prestadora na mesma organização e associar tipo technician. Types é replacement completo; preservar os demais tipos.
3. Cadastrar executor em /v1/admin/entities/technicians, com uid_organization, uid_provider_entity, name e chave idempotente. Ativo e nascimento conforme contrato.
4. Carregar catálogo /v1/admin/entities/technician-capabilities; editar capabilities por code, distinguindo operation de technology. Não são permissões do usuário ou certificado.
5. Login do executor é opcional; user-account liga conta existente, não cria senha nem usuário.
6. Preços são um contrato separado com devices.pricing.access; valor de custo/markup não deve aparecer no portal executor.
7. OS/custódia impede certas alterações; DELETE de técnico retorna 405, desativação por PATCH active=false preserva histórico.

## Evidência atual

Tipo técnico consultado 200; prestadora criada 201 e classificada 200; executor criado 201 com capabilities. Replay falhou 422 (esperado 200), causa documentada em frontend_issues.md. Executor desativado; exclusão da prestadora bloqueada 409 por referência histórica. Não há evidência nova de preços ou dispatch nesta rodada.

Ver [evidência](evidence/2026-10-21-technician-provider-pricing-http.json), driver_technician_roles.md, technician_pricing.md e device_technician_workflow.md. Nenhum exemplo frontend deve sugerir gerar outra Idempotency-Key automaticamente após um 422 técnico: isso pode duplicar intenção; primeiro diagnosticar a falha.
