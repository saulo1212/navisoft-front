# Fase 12 — Documentos / GED

Entrega frontend em 17/11/2026. Fontes: `API_CONTRACTS.md`, `TESTING_GUIDE.md` (storage/GED Phases 1 e 2), `DEVELOPER_GUIDE.md`, collection `Insomnia_2026-11-11.json` e ensaio HTTP próprio. Nenhuma migration, concessão global de perfil ou configuração operacional de storage foi alterada.

## Páginas

| Rota | Comportamento |
| --- | --- |
| `/documentos` | Pesquisa paginada por organização e título; cadastro usando contrato, catálogos de origem/área/tipo, classe e alvo opcional organization/entity. |
| `/documentos/[uid]` | Proprietário/contexto, classe, revisões, download e upload append-only; distribuições para o proprietário, com criação/edição/revogação confirmada. |
| `/documentos/contratos` | Criação do contrato GED por organização/ano/código, retornando o UUID e link para cadastrar documento. |
| `/documentos/classes` | Catálogo paginado, criação, detalhe e edição de nome/ativação e lista completa de permissões independentes por ação. |
| `/documentos/grupos` | Listagem/criação/edição de grupos funcionais e associação/remoção de usuários, sujeitas ao scope legítimo validado no backend. |

Contratos: somente a criação está documentada nas fontes disponíveis. A tentativa de GET de listagem retornou 401 enquanto os demais endpoints na mesma sessão funcionaram. Isso não comprova uma causa de autorização nem ausência de rota; não foi usada como catálogo e não foi inventada uma listagem local persistente. Documentos também aceitam um UUID de contrato já conhecido. Não há exclusão/purge de documento ou contrato implementada sem contrato de API.

## Autorização e contexto

Todas as páginas exigem a área `documents` e organização selecionada. O gate de área não implica capacidade de escrita. O backend revalida, separadamente, `read`, `download`, `revise` e `manage`; cada concessão da classe autoriza somente sua ação. A interface não inventa um perfil ausente da sessão.

Proprietário (`uid_organization`), contexto da leitura (`uid_organization_context`) e alvo comercial são distintos. Um target não concede distribuição. Um documento recebido mantém o owner original e a revisão efetiva da política. A interface do destinatário não mostra controles de upload/gestão. Uma negação de download provoca nova consulta de leitura, preservando a independência das permissões sem manter metadados cuja leitura foi revogada.

Classes/grupos/membros são listados com `filters` JSON contendo o tenant; um `uid_organization` solto não foi suficiente nessas listagens (400 `organization_target_required`). Documento usa `POST /documents/search` com exatamente um filtro `uid_organization eq`, acrescido de título quando houver busca. Detalhes e mutações recebem o contexto por query; creates de recursos próprios ancoram a organização no corpo. Grupos funcionais não criam scopes; membership só autoriza enquanto houver acesso legítimo à organização.

O editor de permissões suporta `functional_group`, `target` e `delegated_support`, cada um com ação explícita. Permissões retornadas perdem somente metadados gerados ao montar o corpo de PUT; não se incluem outras ações automaticamente. Principais desconhecidos existentes ficam visíveis e bloqueiam gravação em vez de serem descartados. Não foi implementada criação de permissões por perfil sem contrato completo, nem concedido `documents.access` ao Basic globalmente.

## Revisões e armazenamento

Upload usa POST de bytes crus, sem multipart ou base64, com Content-Type PDF/JPEG, `X-File-Name` na R00, `X-Revision-Summary` quando preenchido e Idempotency-Key. A R00 define nome/MIME; R01+ omite filename para herdar o canônico e exige resumo. O frontend valida extensão/MIME/assinatura inicial, mantém a família MIME e valida o resumo (até 500 caracteres Unicode, até 2.000 bytes e sem controles). O servidor continua responsável pela validação completa e por rejeitar conteúdo igual ao latest.

A chave de retry usa uma assinatura de SHA-256 dos bytes, nome canônico, MIME e resumo; arquivos com metadados iguais e bytes diferentes não compartilham a intenção. Os valores Unicode dos headers são codificados em bytes UTF-8. O proxy same-origin passou a repassar os dois headers de upload e a devolver Content-Disposition, X-Request-ID e Retry-After. O cliente HTTP recebeu `rawBody` e headers explícitos, mantendo o comportamento JSON anterior, o tratamento de erros/401 e a proteção contra uso simultâneo dos dois tipos de corpo.

Downloads usam a rota autorizada de revisão e contexto, com suporte a bytes em proxy ou JSON `{url,expires_at}`. URLs presign precisam ser HTTPS sem credenciais embutidas; a interface oferece link explícito sem buscar essa URL com o Bearer. Links de objeto de downloads binários são revogados após uso. Nenhuma resposta de domínio deve depender de repository_code/object_key.

Distribuições usam somente access_mode `read`. `follow_latest` não reenvia UID fixo residual; `fixed_revision` exige uma revisão do mesmo documento. Edição preserva o destinatário; revogação é DELETE confirmado. O backend é responsável por autorização e revisão efetiva.

## Validação

- `npm.cmd run test:documents`: **18 testes locais aprovados**. Cobertura de contexto, catálogos, permissões independentes, corpo completo, distribuições, membership, validação binária, resumo Unicode, assinatura de retry, download proxy/presign, erros e proxy de headers/bytes.
- ESLint dos arquivos GED, menu, HTTP e proxy aprovado.
- Regressões após ampliar o cliente HTTP: Knowledge 15, Eventos/Notificações 17, Checklists 12 — aprovadas.
- `npm.cmd run test:documents:http`: [evidência consolidada](evidence/phase12-http-2026-11-17.json), **`passed:true`**.

O ensaio usou Admin Homolog Client, fixture exclusiva e sessão Primary. Confirmou catálogos 200; contrato 201/replay 200/mesmo UID/conflito 409; grupo/member 201 e lista 200; classe 201/replay 200/GET/PUT 200 com somente `functional_group/read`; documento 201/replay 200 e class assignment 200. Isso comprova a persistência da permissão, não toda a matriz de autorização por ação.

Upload PDF R00 201/replay 200; mesmos bytes com chave nova 409 `document_revision_unchanged`; R01 sem resumo 422 `document_revision_summary_required`; R01 válida 201 com nome herdado/resumo. Downloads R00/R01 200 com SHA-256 igual aos respectivos arquivos enviados. Histórico contém duas revisões; busca por organização/título encontrou o documento. Detalhe não expôs repository_code/object_key.

Distribuição para outra organização explicitamente de homologação: create 201/replay 200; update fixed_revision 200; GET com contexto destinatário 200, owner preservado e somente R00 visível. Foi o mesmo ator Primary em outro contexto, não um teste de conta recipient de menor privilégio.

## SYS-GED-01 e fixtures

O histórico antigo do task apontava replay de contratos em aberto. Os guias mais recentes registram correção; o ensaio atual confirmou o cenário: contrato `89c1e046-ee2c-440c-9e5c-739f45334e42`, criação request ID `6158d435-edcd-4ef1-aa9d-b6c1ad85b94f`, replay `1cafb455-1e22-4455-bbf4-39def1e388d5`, conflito `3202b7e6-badb-4a05-b3ea-fb48c693bf6d`. Não há nova evidência de SYS-GED-01 nesse fluxo; não equivale à validação completa de todos os receipts GED.

Limpeza: distribuição `2c89e374-776a-4a29-9e35-1b847c3435ae` revogada 204; membership `bfcb4571-191d-4684-800b-f7d95834e5cf` removida 204; classe `be204bff-30b6-4f8b-b556-631287436e35` desativada/permissões limpas; grupo `2ddce12c-d0fc-4951-8699-97e475e48258` desativado. Sessão encerrada. Nenhum recurso preexistente foi modificado.

Preservados como histórico: contrato acima; documento `b0bea612-5d4a-4b8b-a934-e9370fc175e3`; R00 `a1bfef57-5364-5533-b2ab-5bcf29eb9dcc`; R01 `a434bfa2-1969-56fc-9d58-f525084b76ca` e os objetos físicos. Não há purge documentado usado para excluir esse histórico. O conteúdo é um PDF pequeno e genérico de QA.

## Limites da aprovação

`npm.cmd run build` falhou com `Error: spawn EPERM` ao iniciar a compilação otimizada do Next.js 16.2.9. Não há aprovação de navegador/build. Upload/download no storage configurado foram testados diretamente por HTTP; o proxy tem teste local de preservação de bytes/headers.

Basic/Administrator/Secondary, suporte delegado positivo, negativas por ação, perda dinâmica de scope/membership, target entity, JPEG real, presign S3 operacional, concorrência multi-node, alta disponibilidade e recuperação de falhas de storage permanecem sem nova homologação. A configuração de repositories/segredos e infraestrutura física continua no escopo da Fase 15. Não se inferiu a configuração do storage a partir de um download em proxy.
