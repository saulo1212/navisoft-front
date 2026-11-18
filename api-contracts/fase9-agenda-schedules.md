# Fase 9 — Agenda e agendamentos de relatórios

Implementação frontend em 17/11/2026, baseada em `API_CONTRACTS.md`, `DEVELOPER_GUIDE.md`, `TESTING_GUIDE.md` e `Insomnia_2026-11-11.json`.

## Telas e contrato

- `/agenda` e `/fullcalendar`: calendário real e tabela com busca por título/paginação por offset. Calendário representa somente registros carregados; o total é informado e a tabela permite carregar mais. Registros sem data continuam disponíveis na tabela.
- `/agenda/[uid]`: origem, controles com versão, prioridade, fixação, notificação, adiamento, próximo contato e histórico/análises. O calendário não permite arrastar/criar registros. Agenda é uma projeção; processos de origem continuam responsáveis por criar/encerrar registros. Marcar `notified` não envia mensagem.
- `/relatorios/agendamentos`: lista, consulta antes da edição, criação diária com período `none`, edição, confirmação de pausa/retomada/exclusão lógica. Horário, definição publicada, versão, formato, visibilidade, retenção, colunas, filtros e ordenação configuráveis. Periodicidade, período e política de retenção existentes são preservados na edição; não se inventaram campos de variantes de periodicidade ausentes da documentação disponível.

Agenda exige a área `agenda` e organização selecionada. Relatórios não possuem uma área `reports` no access-context real; exigem contexto avaliado e deixam a autorização por definição/ator/organização aos endpoints. Mudanças de token, organização ou contexto desmontam formulários e abortam requisições. A API revalida permissões de escrita; o frontend não presume que o gate da área concede escrita.

Controles usam `controls_version` do último GET. Um 409 `agenda_version_conflict` recarrega o registro e pede revisão antes de nova gravação. Valores `false`, limpeza de datas por `null` e segundos de datas não editadas são preservados. Controles de registros terminais ficam desabilitados; análises seguem submetidas à autorização do endpoint. Chaves idempotentes de criação/análise permanecem iguais ao repetir a mesma intenção.

Horários de controles são apresentados no fuso do navegador e enviados em ISO UTC. O fuso de schedules vem exclusivamente da organização: GET informa `timezone`, POST/PUT não o enviam. O GET retorna filtros normalizados com `limit`, `offset` e `state`; reenviá-los no PUT produziu 400 `invalid_request`. O frontend envia apenas `q`, `include_inactive` e `filters`, corrigindo o ciclo de edição real. Cores são validadas e somente diferenças são enviadas para não congelar a herança das demais cores.

## Validação e limites

`npm.cmd run test:agenda`: 15 testes locais aprovados, incluindo concorrência, datas, terminalidade, booleanos, cores/herança, escopo, rotas, idempotência, filtros, retenção e preservação da configuração na edição. ESLint dos arquivos alterados aprovado.

`npm.cmd run test:agenda:http`: evidência em [phase9-http-2026-11-17.json](evidence/phase9-http-2026-11-17.json). Usou Admin Homolog Client e encerrou a própria sessão. Agenda: busca por organização e título e settings retornaram 200; total de entradas era zero. Nenhuma mutação da Agenda nem bateria congelada do backend foi executada. Logo, detalhe/histórico/controles/análises/cores têm implementação e testes locais, sem nova homologação HTTP ou visual dessas escritas.

Schedules: criação 201; consulta, atualização, pausa, retomada, listagem e exclusão 200. As três fixtures criadas durante o diagnóstico foram excluídas logicamente (`65669f7f-7990-480a-9f32-f9e973eb3ffd`, `4925c2f6-5e11-4a66-a555-dc226d44514a`, `b909cd36-793f-4cf7-80e5-fafcdee1a1dc`). O teste não solicitou geração avulsa de relatórios; a geração automática/entrega pelo Worker não foi validada.

O relatório consolidado permanece com `passed:false` por causa do replay descrito abaixo. O runner retorna código de falha enquanto essa pendência existir. Não há aprovação integral de idempotência, navegador, outros perfis ou isolamento cross-tenant.

`npm.cmd run build`: Next.js 16.2.9 iniciou a compilação e falhou com `Error: spawn EPERM`. Não houve build aprovado nem validação em navegador nesta entrega.

## Pendência para o backend: replay de criação de schedule

Em três fixtures distintas, `POST /v1/reports/schedules` com `Idempotency-Key` UUID e body válido criou o schedule com 201. Repetir imediatamente a mesma rota, chave e body retornou 422 `invalid_report_request`. Esperado: replay do mesmo UID, sem nova criação. O frontend mantém a chave original; não troca automaticamente por outra chave ao receber o erro.

Última reprodução: fixture `b909cd36-793f-4cf7-80e5-fafcdee1a1dc`; request de criação `a44bb27e-ec9a-4b9d-9a87-e44410474d8e`; replay `b6aef1c7-206b-4aaa-ac4f-948ec0d53b9c`. Consultar os demais request IDs e a limpeza na evidência. Revisar a validação/restituição do recibo de criação de schedules; não foi possível determinar a causa no código do backend, ausente deste workspace.
