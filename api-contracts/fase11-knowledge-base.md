# Fase 11 — Knowledge Base

Entrega frontend em 17/11/2026. Fontes: `API_CONTRACTS.md`, `DEVELOPER_GUIDE.md`, `TESTING_GUIDE.md`, collection `Insomnia_2026-11-11.json` e consultas/fixtures HTTP próprias. O manual `knowledge.md` referenciado pelos guias não está no workspace; foi solicitado seu caminho sem interromper as tarefas independentes.

## Rotas e comportamento

| Rota | Função |
| --- | --- |
| `/knowledge` | Listagem editorial global, busca POST por q, offset/limit e criação de item pelo slug. |
| `/knowledge/[uid]` | Detalhe, histórico/preview de revisão, nova revisão com vídeos, publicação explícita, arquivamento, grants e associações GED do rascunho. |
| `/knowledge/categorias` | Consulta paginada do catálogo de categorias. |
| `/knowledge/leitura` | Catálogo de artigos autorizados para a sessão e organização selecionada. |
| `/knowledge/leitura/[slug]` | Artigo da revisão publicada autorizada, vídeos e anexos. |
| `/ajuda` | Portal público com busca e paginação, fora do layout protegido. |
| `/ajuda/[slug]` | Artigo público e anexos, sem enviar Bearer ou organização. |

Administração exige a área `knowledge` no frontend e a autorização Primary reaplicada pelo backend. Nenhuma propriedade de perfil ausente da sessão foi inventada. Os endpoints editoriais são globais e não recebem filtro de organização; os leitores autenticados recebem `uid_organization`. Mudanças de identidade/contexto desmontam os componentes protegidos; consultas são abortadas e resultados anteriores ficam ocultos assim que seus argumentos mudam. O portal público não depende de token para consultar a API.

O POST de item aceita `{slug}` e cria um draft sem revisão. Cada edição de conteúdo cria uma revisão nova; não há edição em lugar da revisão publicada. Publicar envia explicitamente `{uid_revision,audience_mode}`. Valores aceitos: public/authenticated/selected. A interface mostra última revisão e revisão publicada separadamente e permite publicar uma revisão escolhida do histórico. Archive despublica e preserva o histórico.

Vídeos: até 20, título obrigatório de até 150 caracteres, descrição de até 500, sort_order positivo e único e IDs YouTube distintos. Formatos de entrada suportados: HTTPS youtube.com/watch e youtu.be, normalizados para URL canônica. A interface oferece links externos, sem player/embed. Conteúdo do artigo é exibido como texto, sem execução de HTML.

Anexos administrativos usam pares fixos de UUID de documento/revisão GED em `PUT /v1/admin/knowledge/revisions/:uid/attachments`; não há upload de arquivo nesta fase. O editor lê a associação da revisão antes de substituí-la e bloqueia o botão para a revisão publicada atualmente. O servidor continua responsável por toda a imutabilidade histórica e autorização GED. Criar revisão de conteúdo não copia anexos automaticamente; a interface informa essa separação.

Leitores constroem o caminho de download com slug e UID Knowledge, ignorando URLs arbitrárias de storage/download. O cliente HTTP compartilhado recebeu `responseType:'blob'`: bytes são preservados e respostas de erro continuam passando pelo mesmo mapeamento e tratamento de sessão. Links de objeto temporários são revogados após o download. IDs GED/storage não são usados pelos leitores públicos.

## Contratos ainda ausentes e pendência da API

Categorias: a consulta GET com envelope está confirmada. A collection disponível não contém criação/edição de categorias nem substituição de categorias/contexts de item, e os guias apenas remetem ao manual ausente. Essas escritas não foram inventadas. O catálogo atual retornou total zero. Falta completar cadastro/classificação após receber esse contrato.

Grants: o frontend envia o PUT documentado em `/v1/admin/knowledge/items/:uid/grants`. Tanto a concessão de perfil `{principal_type:'profile',profile_code:'primary_admin',scope_type:'global'}` quanto `{grants:[]}` retornaram **422 `unclassified_http_422`** em fixture própria. A mesma requisição consta da collection e do contrato. A origem do erro não foi determinada sem código/logs do backend. O frontend mostra a falha e não troca silenciosamente a audiência ou simula sucesso.

Reprodução final: item `90e83ccc-29c2-4476-a104-3ef416d1f156`; request IDs `d45d096d-7699-4a97-bead-bd094d97dc20` (concessão) e `ba326fae-1cf4-424a-af1a-072134ef875f` (limpeza). Investigar validação/SQL e o código não classificado preservando a autorização. Nenhum SQL ou migration foi executado neste workspace.

## Evidências

- `npm.cmd run test:knowledge`: **15 testes locais aprovados**. Cobrem slug, revisão/publicação separadas, URLs e limites de vídeos, anexos fixos, corpo de grants, idempotência/abort, busca global, ausência de Bearer público, organização no leitor autenticado, preservação binária e erros 404/503.
- ESLint dos arquivos alterados aprovado.
- Regressões após mudar o cliente HTTP: Agenda 15, Eventos/Notificações 17, Checklists 12 — todas aprovadas.
- `npm.cmd run test:knowledge:http`: [evidência consolidada](evidence/phase11-http-2026-11-17.json). `passed:false` pelos erros de grants; os demais checks registrados passaram.
- GET editorial e POST search responderam 200. O erro histórico de list/search `knowledge_storage_unavailable` não ocorreu nas consultas desta rodada; não foi induzida falha de infraestrutura.
- Item draft 201/replay 200, sem revisão inicial; anônimo recebeu 404. Revisão com vídeo 201/replay 200; intenção divergente 409. PUT de attachments vazios 200. Publicação pública 200; GET público e busca anônima 200, vídeo canônico. Novo draft preservou o artigo público anterior. Detalhe e histórico separaram as revisões. Publicação authenticated 200; público 404 e leitor autenticado 200 com organização. Archive 200; público 404.
- Fixtures arquivadas: probe de contrato `021bcc69-6226-49c8-9ca3-48f43eb332fd`; primeiro ensaio `18f3e88b-e5f0-4748-b7a4-5fa35170bc30`; ensaio final `90e83ccc-29c2-4476-a104-3ef416d1f156`. As publicações temporárias continham somente texto genérico de QA e foram retiradas. Sessões de teste encerradas. Nenhum artigo preexistente foi modificado.

## Limites

`npm.cmd run build` falhou com `Error: spawn EPERM` ao iniciar a compilação do Next.js 16.2.9. Build e navegador não foram aprovados. Downloads de anexos reais, associações GED não vazias, matriz Primary/Administrator/Secondary/Basic, grants selected, revogação, cross-tenant e falha real de storage continuam sem homologação nesta rodada. A API foi testada com Primary e um artigo exclusivo; isso não aprova a matriz completa de acesso. O funcionamento das rotas públicas foi comprovado por HTTP sem Bearer, sem constituir validação visual do portal.
