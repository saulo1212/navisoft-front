# Fase 8 — Checklists

Entrega em 16/11/2026, baseada na collection local e nos contratos de grupos, templates agregados e runs. A implementação consome a interface existente; não altera migrations nem reabre regressões SQL do backend.

## Telas

| Rota | Comportamento |
| --- | --- |
| `/checklists` | Templates da organização, busca por nome e paginação offset. Criação com chave preservada nas retentativas. |
| `/checklists/[uid]` | Editor do agregado, perguntas boolean/text, ordem das perguntas, efeitos e respostas obrigatórias, destinatários all/selected por driver/asset/general. Salvar rascunho e publicar são ações separadas. Publicação exige confirmação; publicação sem alteração pode reaproveitar a versão. |
| `/checklists/grupos` | Lista/busca, criação, detalhe, edição e desativação de grupos. Sem DELETE inventado. |
| `/checklists/execucoes` | Criar run a partir do motorista ou abrir run conhecido por UID. Não há listagem global de runs documentada; a tela não inventa esse endpoint. |
| `/checklists/execucoes/[uid]` | Selecionar ativo, responder os snapshots fixados, salvar parcialmente e concluir com confirmação. Resultado e imutabilidade vêm da API. Após selecionar um ativo a tela mantém esse vínculo; não oferece substituição que possa invalidar respostas. |

Menu condicionado à área `checklists`. A mudança de organização, sessão ou áreas desmonta formulários e aborta requisições. A API continua responsável por permissões, hierarquia e escopo. A organização do POST de run é derivada do motorista; a consulta do run no contexto selecionado é validada antes de navegar para o detalhe.

## Contratos observados

- Listas administrativas usam POST `/search`, `uid_organization eq`, filtro `name contains` e limit/offset.
- Grupo usa POST/GET/PATCH. Template usa POST/GET/PATCH e POST `/publish`. Grupo permite alteração parcial; **PATCH de template exige o agregado completo, incluindo uid_organization no corpo**, além da organização na query. O formulário e a camada de API foram ajustados após observar 422 na execução real.
- Destinatários selecionados usam `assignment.drivers` ou `assignment.assets`. `general` usa mode=all. O editor não elimina metadata adicional da definição existente. Tipos além de boolean/text são exibidos como não suportados e não são silenciosamente convertidos.
- Runs usam POST `/v1/checklists/runs` com `{uid_driver}`, GET por UID com organização e PUT do run. Seleção de ativo usa `{uid_asset}`; respostas usam `executions: [{uid_execution, answers:[{question_code,value}]}]`; encerramento usa `{complete:true}`.
- A UI distingue false de resposta ausente; não inventa Sim/Não nem notas positivas. Salvar parcialmente não exige todas as perguntas; concluir valida obrigatórias localmente e a API revalida. Respostas são montadas a partir das perguntas da versão fixada, sem consultar o template atual para responder um run antigo.
- Respostas são mescladas por question_code. Respostas booleanas já persistidas não são apresentadas como removíveis por uma opção vazia que a API não documenta. Texto pode ser editado sem alterar as versões.
- Após respostas do ativo, tentar trocá-lo retorna 409 checklist_asset_locked e preserva ativo, snapshot e respostas. Conclusão torna o run imutável (409 checklist_run_immutable em alteração posterior).
- Resultado overall released/blocked e driver_result/asset_result fit/not_fit é exibido conforme o servidor. HTTP 200 não é convertido em aprovação. Uma resposta asset_not_fit pode criar manutenção transacionalmente.

## Validação

- `cd frontend; npm.cmd run test:checklists`: **12 testes locais passaram**. Cobrem payloads, alvos tipados, ordem/metadata, snapshot, false obrigatório, merge de respostas, imutabilidade, paginação, contexto, chave idempotente e códigos de negócio.
- ESLint passou nos arquivos da funcionalidade/menu. O build foi tentado e falhou com **spawn EPERM** antes da compilação de produção; build e navegador não estão aprovados.
- [Ensaio HTTP final](evidence/phase8-checklists-http-2026-11-16.json): passou na organização Admin Homolog Client, usando a credencial previamente autorizada. O roteiro importa a mesma camada de API/domain usada nas telas, sem salvar senha ou Bearer no relatório.

O ensaio validou grupo create/replay/conflict e PATCH; template create/replay/conflict, leitura de assignment selecionado, publicação v1/no-op/v2; run create/replay, required ausente 422, snapshot v1 preservado após publicação v2, false persistido, warning com outcome=released, terminal 409, novo run com v2, descoberta de checklist do ativo, troca após respostas negada 409, outcome=blocked/asset_result=not_fit e exatamente uma manutenção originada no run. Busca e duas páginas distintas foram confirmadas na API.

As execuções intermediárias identificaram dois ajustes da integração: PATCH sem organização/agregado e expectativa incorreta de que seria possível trocar o ativo após responder. Essas expectativas foram corrigidas; não se registram como defeitos do backend. Relatórios intermediários foram preservados para rastreabilidade:

- [Primeira execução](evidence/phase8-checklists-initial-2026-11-16.json).
- [Execução que confirmou o bloqueio do ativo](evidence/phase8-checklists-asset-lock-2026-11-16.json).
- [Auditoria final de cleanup](evidence/phase8-cleanup-audit-2026-11-16.json).

Todos os templates de teste foram inativados **e publicados inativos**, os grupos e motoristas desativados, as entidades inativadas e os ativos excluídos. A manutenção gerada no ensaio final foi concluída com resolução das condições. Históricos de versões, motoristas e runs foram preservados. Runs incompletos dos diagnósticos também permanecem como histórico; o contrato disponível não oferece cancelamento ou DELETE desses runs. A auditoria confirmou templates/grupos inativos e ativos removidos.

## Reprodução e limites

`npm.cmd run test:checklists:http` executa a fixture própria. Usa o helper de autenticação de homologação já existente, com TEST_API_URL/TEST_LOGIN_IDENTIFIER/TEST_LOGIN_PASSWORD ou a credencial de teste da collection local. Não altera cadastros preexistentes nem publica templates all para terceiros; os destinatários são somente o motorista e ativos criados pelo ensaio.

Pendente para aprovação integral: navegador/build, perfis sem área/escopo e cross-tenant, outros tipos de pergunta se forem contratados, concorrência real e comportamento visual em telas menores. O teste administrativo não comprova esses cenários. O fluxo de consulta de runs é por UID enquanto não houver contrato de listagem.
