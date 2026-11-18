# Fase 10 — Eventos e notificações

Implementação frontend em 17/11/2026. Fontes: `API_CONTRACTS.md`, `TESTING_GUIDE.md` (eventos administrativos e ocorrências), `DEVELOPER_GUIDE.md` (Events Core 0184/0185 e Notifications Core) e collection `Insomnia_2026-11-11.json`.

## Páginas

| Rota | Comportamento |
| --- | --- |
| `/eventos` | Lista paginada e detalhe de ocorrências; ações `acknowledge`, `note` e `close`, com texto obrigatório para nota/resolução. Sem criação administrativa de ocorrência. |
| `/eventos/modelos` | Catálogo global de tipos de evento, detalhes, parâmetros/padrões e campos/operadores/unidades para condições. |
| `/eventos/regras` | Cadastro inativo por padrão; GET antes de editar; PUT completo; exclusão confirmada. Um alvo composto, parâmetros, condições AND, janelas semanais, destinatários e confirmação/recuperação/atraso independentes. |
| `/notificacoes` | Listagem, consulta e CRUD de destinatários externos, com múltiplos endpoints e vínculos de organização/entidade/ativo. Destinatários vinculados a contatos ficam em consulta. |
| `/notificacoes/hooks` | Lista e consulta do hook efetivo `organizations.insert`; PUT sempre com organização explícita cria/atualiza override, sem editar o default global. Preserva payload completo, inclusive actions e placeholders. |
| `/notificacoes/entregas` | Consulta manual de delivery por UID e metadados da credencial Autoscale Notifications via Core; distingue status local, status do provedor, aceite e supressão. |

Menu lateral e sino do cabeçalho apontam para as páginas reais. Removidos do sino mensagens de demonstração e contador fictício. Não há endpoint documentado de inbox, não lidas, marcação de leitura ou preferências pessoais. Hooks e destinatários representam as configurações efetivamente disponíveis.

## Contratos e autorização

Eventos: `GET /v1/admin/events/models`, `models/:uid`, `fields`, `rules`, `rules/:uid`, `occurrences`, `occurrences/:uid`; `POST rules`; `PUT rules/:uid`; `DELETE rules/:uid`; `PATCH occurrences/:uid`. Catálogos globais não recebem filtro organizacional. Listas operacionais usam `filters` JSON com `uid_organization eq`, `limit` e `offset`. Regras podem filtrar por nome. Detalhe e mutações enviam o contexto da organização, além da revalidação no backend.

O contrato atual de regra usa `target`; `targets` legado com vários itens é bloqueado na edição para não perder alternativas. Os campos do alvo compõem uma interseção e o servidor deriva `scope_level`. PUT reenvia as listas completas e preserva vigência não editada, inclusive seus segundos. Modelos fixos, periódicos ou de ativação não são tratados como regras operacionais comuns. Parâmetros precisam pertencer ao catálogo; condições avançadas e referências são revalidadas pela API. Os destinatários em `rules.recipients` são do domínio Events, não do cadastro de Notifications.

Notifications: `/v1/admin/notifications/recipients`, `recipients/:uid`, `hooks`, `hooks/organizations.insert`, `deliveries/:uid/status`, com `uid_organization` explícito. Criação de destinatário exige Idempotency-Key; o frontend mantém a mesma chave por intenção. Full replacement do destinatário inclui endpoints e as três listas de vínculos. **UID de endpoint é metadado de resposta e não pode ser reenviado no PUT**: a primeira homologação retornou 422 `invalid_notification_endpoint`; removido o campo, a atualização real passou. Metadata e referência de contato existentes são preservadas nos campos de entrada correspondentes.

Gates por área: `events`, `event_occurrences`, `notifications`. Formulários e requisições são desmontados/abortados na troca de token, organização ou contexto de acesso. Erros 403/404 limpam o detalhe acionado e atualizam o contexto. A permissão de área não concede escrita irrestrita: perfil, organização, escopo e transições são validados nos endpoints. Não foi inferido perfil a partir de campos ausentes da sessão.

Integração externa: `GET /v1/admin/organizations/:uid/integration-tokens/autoscale-notifications` retorna somente metadados. O browser usa o Core para consultar deliveries; não recebe credenciais M2M nem chama o domínio administrativo do Notify. A disponibilidade de credencial não comprova conectividade. Aceite/enfileiramento não comprova entrega final.

Não há stream HTTP de ocorrências documentado na collection/guias disponíveis. A atualização implementada é explícita. Redpanda, SSE de sessão e infraestrutura de logs não são substitutos para um contrato de feed operacional. Administração de mapas técnicos globais, variantes, políticas fixas, ativações e relatórios periódicos não compõe este conjunto de telas.

## Validação

`npm.cmd run test:events-notifications`: 17 testes locais aprovados. Cobrem alvo/tenant, agregados completos, datas, false, parâmetros, janelas atravessando semana, ações de atendimento, domínios independentes, endpoint sem UID gerado, hook organizacional, idempotência, códigos de erro e abort signal. ESLint dos arquivos da funcionalidade/menu/cabeçalho/FormDrawer passou. FormDrawer recebeu `submitDisabled` para separar formulário em consulta de operação em andamento.

`npm.cmd run test:events-notifications:http`: [evidência consolidada](evidence/phase10-http-2026-11-17.json), `passed:true`. Organização Admin Homolog Client; apenas fixtures exclusivas inativas, sem envio de mensagem ou alteração de hook compartilhado.

- Catálogos models/fields, busca por nome, listagens de regras/ocorrências, hooks efetivos e metadados Notify: 200.
- Regra: criação 201; replay 200/mesmo UID; corpo divergente 409 `event_conflict`; GET/PUT/list 200; atraso negativo 422 `invalid_event_payload`; DELETE 204. PUT preservou regra inativa e janela sábado→segunda.
- Destinatário externo inativo: criação 201; replay 200/mesmo UID; divergência 409 `idempotency_conflict`; GET/PUT/list 200; DELETE 204. Endpoints/vínculos e estado inativo preservados.
- Fixtures finais: regra `893e1818-62c9-4443-81fc-db06732b0962` e recipient `3c865da7-2102-42ce-9b9b-327aa5f7fba2`, removidos logicamente. Fixtures da primeira tentativa (`4c74da4f-b7b3-4551-a745-de36e2dacc97`, `d4afac7b-9a26-4258-a2b2-5efecb01539e`) também tiveram limpeza 204. Sessões de teste encerradas.

## Limites da aprovação

Ocorrências retornaram `total:0`. Consulta individual e tratamento têm implementação e testes locais, sem nova homologação HTTP de ações. Não foram criadas ocorrências artificiais nem alterados registros operacionais preexistentes.

Gravação de hook, delivery real, entrega externa, contatos vinculados, destinatários de Events não vazios, condições tipadas complexas, referências de alvo além da organização, Basic/Secondary e cross-tenant não foram homologados nesta rodada. A leitura de uma credencial não confirma envio. O runner não inicia Consumer, Worker ou broker e não faz chamadas de envio.

`npm.cmd run build` falhou com `Error: spawn EPERM` ao iniciar a compilação otimizada do Next.js 16.2.9. Build e navegador permanecem pendentes. A aprovação dos testes locais/HTTP acima não equivale à aprovação integral do módulo.
