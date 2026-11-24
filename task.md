# Movisat / Navisoft — Plano de Construção do Frontend

> Plano por etapas para integrar o frontend (Next.js / SmartAdmin) à API Navisoft
> descrita na collection `Insomnia_2026-11-04.json` (1341 requests, 50 grupos) e nos
> documentos de `platform_documents/`.
>
> **Como usar:** cada item começa como `[ ]`. Ao concluir, marcar `[x]`.
> Só avançar de fase quando os itens de "Pré-requisito" da fase seguinte estiverem prontos.
> **Status deste documento:** plano em execução; implementação e evidências de validação são registradas por fase abaixo.
>
> 📑 **Contratos de API mapeados:** ver `api-contracts/` — respostas reais (GET) capturadas da API + contratos de request das mutações, agrupados por recurso. Usar como fonte ao implementar a etapa **"Contrato"** da receita de cada módulo.

---

## Estado atual (ponto de partida — não refazer)

- [x] Template SmartAdmin instalado em `frontend/` (Next.js, Bootstrap, react-hook-form, yup, tanstack-table, apexcharts).
- [x] Camada de API base: `src/lib/api/http.js` (fetch, Bearer, `no-store`, `Idempotency-Key`), `config.js` (modo mock/real), `errors.js` (`ApiError`).
- [x] Sessão: `src/lib/session/SessionContext.jsx`, `storage.js`, `useOrganizationsList.js`; hook `useCursorList.js`.
- [x] Endpoints + mocks já existentes (modo mock): `auth`, `entities`, `fleet`, `devices`, `geography`, `technicians`, `workorders`.
- [x] Páginas base existentes (mock): `login`, `entidades`, `frota`, `geografia`, `tecnicos`, `ordens-servico`, `devices-sim`.
- [ ] **Nada ainda integrado ao backend real** — toda a construção abaixo é sobre os endpoints reais da collection.

---

## Fase 0 — Fundação e contratos (habilitar modo real)

> Objetivo: destravar o consumo real da API para todos os módulos seguintes.

- [x] Definir `.env.local` (`NEXT_PUBLIC_API_MODE`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_APPLICATION`) e documentar no `.env.example`.
- [x] Importar o environment do Insomnia (bases homolog/externa, `application`, limites de paginação) e mapear para `config.js` (`KNOWN_BASES`, `API_APPLICATION`, `DEFAULT_LIST_LIMIT`).
- [x] Padronizar envelope de resposta e paginação: `normalizeList()` no `http.js` cobre **offset** (`admin/*`) e **cursor** (`me/organizations`); `useCursorList` (cursor) + novo `useOffsetList` (offset).
- [x] Padronizar tratamento de erros por código de negócio em `errors.js` (`ApiError.category`, `errorMessage()` PT) + toasts em `lib/ui/toast.js` (`notifyError`/`notifySuccess`).
- [x] Reautenticação global em 401 `state=revoked/expired`: `registerUnauthorizedHandler` no `http.js` acionado pela `SessionContext` (`ApiError.isReloginRequired`).
- [x] Convenção de `Idempotency-Key`: `idempotency.js` (`newIdempotencyKey`) + geração automática em `create`/`update` da fábrica.
- [x] "Receita de módulo" reutilizável: fábrica `createResourceApi()` (`resource.js`) gerando list/get/create/update/patch/remove + `lib/api/README.md` com a receita.
- [x] Menu lateral reorganizado (`data.js`) com a árvore de módulos definitiva (Operação, Pessoas & Acesso, Conteúdo, Comercial & Financeiro, Sistema) + telas de template agrupadas.

**Verificação:** todos os arquivos passam no parser; `next dev` compila e `/entidades` responde 200 renderizando o menu novo + `SessionContext` sem erros de import.

---

## Fase 1 — Autenticação, Acesso e Perfil

> Collection: `00 - Authentication`, `01 - Users`, `MFA`. Docs: `frontend_01`, `frontend_02`.

- [x] Login (`POST /v1/users/login`) — 200 ativo (token em `session.token`) e `202 pending_mfa`. **200 verificado ao vivo.**
- [x] Desafio MFA (`/v1/users/login/challenge`) + tela `two-factor` — Bearer = token pendente, body `{code}` (contrato real; sem conta MFA para teste ao vivo).
- [x] Status de sessão (`GET /v1/users/status`) + re-fetch de contexto ao focar a aba.
- [x] Contexto de acesso global (`GET /v1/users/me/access-context`) → `areas` (allowed/denied) e modo temporal de `session.access_period.mode` (disabled/warn/block).
- [x] Lista de organizações (`GET /v1/users/me/organizations`, cursor) + seletor. **Verificado ao vivo (orgs reais).**
- [x] Contexto por organização (`GET /v1/users/me/organizations/{uid}/access-context`) → gates. **Verificado ao vivo.**
- [x] Logout (`POST /v1/users/logout`).
- [x] Segurança (`GET/PUT /v1/users/security`) — shape real `{require_mfa, effective_require_mfa, organization_require_mfa}`.
- [x] Perfil (`GET/PUT /v1/users/profile`) — edição em `/account/profile`, com atualização do nome no menu da conta. Ver Fase 17.
- [x] Recuperação de senha por e-mail ligada a `/v1/users/password-recovery` nas telas de solicitação e redefinição. A troca autenticada usa `PUT /v1/users/password` com a senha atual.
- [x] Verificação de e-mail (`/v1/users/contact-verification/request|confirm`) — solicitação e confirmação em `/account/profile`. Ver Fase 17.
- [x] Guards de rota por área e período (`AuthGuard` + `OrganizationGate` + banner temporal). **Guard verificado ao vivo.**

**Infra adicional (necessária p/ modo real no browser):** a API não envia CORS e exige User-Agent de navegador, então o browser não a chama direto. Criado **proxy same-origin** `src/app/api/navisoft/[...path]/route.js` (server-side, injeta UA, repassa auth); `NEXT_PUBLIC_API_BASE_URL=/api/navisoft` e `NAVISOFT_API_URL` (só servidor) apontam para o upstream.

**Verificação:** `next dev` (modo real) → login `admin.autoscale` → autenticou, carregou access-context, listou organizações reais, selecionou org (gates OK), dashboard renderizou. Sem erros de app no console.

---

## Fase 2 — Organizações e Controle de Acesso

> Collection: `Organizations`, `/v1/admin/organizations` (143 requests), `GED Permissions`, `groups-permissions`, `situations`.

- [x] Organizações (`/v1/admin/organizations`): listagem (`/organizacoes`) + detalhe (`/organizacoes/[uid]`) com edição por gates `code_name_update` e `reseller_enabled_update` (via `me/organizations/{uid}/access-context`). **Verificado ao vivo** (24 orgs reais, detalhe + gates). Corrigido bug: reseller usa `PUT :uid {reseller_enabled}` (não `/reseller`). Form de criação de org: pendente (fluxo de onboarding/Fase 13, endpoint pronto).
- [x] Política de sessão da organização (`GET/PUT .../session-policy`, read/update) — no detalhe da org. **Leitura verificada ao vivo** (switches gated por `session_policy.update`).
- [x] Grupos de permissões (`/v1/admin/groups-permissions`) — listagem agrupada + contadores + associar (`/grupos-permissoes`). **Verificado ao vivo** (50 associações reais).
- [x] Situações (`/v1/admin/situations`) — CRUD completo (`/situacoes`), badge "sistema" p/ `locked`. **Listagem verificada ao vivo** (5 situações reais).
- [~] Controle de acesso / perfis (Primary/Administrator/Secondary/Basic) na UI de usuários — parcial (contadores por grupo em Grupos & Permissões). Gestão por usuário depende do módulo de Usuários (**Fase 3**).
- [x] Tela legada `/access-control/user-profile` redireciona para Meu perfil, conforme a Fase 17.

**Infra:** fábrica `createResourceApi` usada em `situations`/`groups-permissions`; `useOffsetList` nas listagens; toasts (`notifyError/Success`) nas mutações.

**Verificação:** `next dev` (modo real) → login → Organizações (lista 24 reais) → detalhe (identidade, revenda, política de sessão, todos com gates `allowed`) → Situações (5 reais) → Grupos & Permissões (contadores + 50 assoc.). Mutações **não** disparadas em produção. Sem erros de app.

---

## Fase 3 — Colaboradores e Usuários Admin

> Collection: `Colaboradores`, `Colaboradores 2/3`, `/v1/admin/collaborators`, `/v1/admin/users`, `Contacts`.

- [x] CRUD de colaboradores (`/v1/admin/collaborators`): lista org-scoped via `POST /search` (`/colaboradores`) + detalhe (`/colaboradores/[uid]`) com edição (PUT), ativar/desativar (PATCH), engagements (criar/encerrar) e assignments (lotação por posição + unidade). Endpoints + mock em `collaborators.js`.
- [x] Vínculo colaborador ↔ usuário ↔ organização: colaborador nasce ancorado à org selecionada; pessoas conectadas por engagements/assignments; credencial de login administrada no módulo de Usuários (abaixo). `OrganizationGate` garante contexto de org.
- [x] Administração de usuários (`/v1/admin/users`) — lista (`/usuarios`, offset) + detalhe (`/usuarios/[uid]`): criação provisionada (nasce `enabled:false`), ativação/desativação (PATCH `enabled`), `profile_code` (Primary/Administrator/Secondary/Basic), `organizations_access` + scopes, aplicações (`GET/PUT /applications`). Aviso de revogação de sessão no PUT completo.
- [x] Contatos (`/v1/admin/contacts`) — página `/contatos` (org-scoped): **lista real paginada + busca por nome** (`GET /v1/admin/contacts` com `filters` = `uid_organization eq` [+ `name contains`]) + criar. **Verificado ao vivo** (busca incremental 200). A listagem existe (o engano inicial foi ver só o `GET /:uid`); o backend confirmou `GET /v1/admin/contacts` + `POST /contacts/search` (org vai dentro do `filters`, não como query param). `usercontact` (template) permanece como está.
- [~] Convite / primeiro acesso — **adiado**: depende do alinhamento INT-02 (fluxo público). A criação de usuário já deixa o registro provisionado/desabilitado pronto para a ativação; o fluxo público de convite não foi implementado.

**Infra:** `usePagedList` nas listas (users offset; collaborators via `/search` adaptado no endpoint); `OrganizationGate` nas telas que exigem org (colaboradores, contatos); `PROFILE_LABELS` em `lib/domain/users.js` (compartilhado lista/detalhe); toasts (`notifyError/Success`) nas mutações. Menu: `/colaboradores`, `/usuarios` (já existentes) + nova entrada `/contatos`.

**Verificação (ao vivo, modo real, 2026-11-08):** login `admin.autoscale` → org "Admin Homolog Client". **Colaboradores:** `POST /search` 200, criação `POST /collaborators` **201** (colaborador listado), detalhe `GET` 200, `GET /assignments` 200, engagements criados pela UI **201**. **Usuários:** `GET /admin/users` 200 (25 reais), detalhe `GET /:uid` 200, `GET /applications` 200, escopos renderizados (mutações não disparadas — PUT revoga sessão). **Contatos:** `POST /contacts` **201** (criado e exibido). Sem erros de app.

**Bugs encontrados e corrigidos durante a homologação:**
1. Listagens aninhadas de colaboradores (`positions`, `organization-units`, `assignments`) escopam por org via query **`filters`** (array JSON), não `uid_organization` — passava o param errado e retornava **400**. Como as 3 refs carregam em `Promise.all`, o 400 derrubava também o dropdown de tipos de vínculo. Corrigido (`orgFilters()` no `collaborators.js`).
2. `POST .../engagements` exige header **`Idempotency-Key`** (400 `idempotency_key_required`) **e** `uid_country` no body (422 `invalid_engagement`). `createEngagement`/`createAssignment` não enviavam a chave; o form não coletava país. Corrigido: idempotência nas duas funções + campo **País** no form, populado pelo catálogo global real `GET /v1/admin/drivers/countries` (`listCountries`), 249 países, Brasil padrão. **Verificado ao vivo.** Rota informada pelo backend (não é `/common/countries`; mora sob `/drivers`). Ainda **sem endpoint**: `country-subdivisions` e `marital-status` (opcionais, fora dos forms) — ver `api-contracts/solicitacao-referencias-colaboradores.md`.

**Dados de teste criados em homologação (limpeza opcional):** colaborador `ee6db52a-…d0e8` (com 2 engagements), contato `26e7a23f-…bad431` — na org `6f68ea93-…fbb8`.

---

## Fase 4 — Entidades, Endereços e Frota

> Collection: `02 - Entities`, `03 - Assets`, `Addresses`. Docs: `frontend_03`, `frontend_04`. (base mock já existe)

- [x] Migrar módulo Entidades para API real (`/v1/admin/entities`): lista org-scoped via `POST /search` (`/entidades`) + detalhe (`/entidades/[uid]`) com edição (`PUT`), tipos por UID (`PUT /{uid}/types`, substituição em bloco, bloqueio de lista vazia) alimentados por `POST /types/search` + criação de tipo (`POST /types`), e unidades (`POST /units/search` + `POST /units`). Endpoints em `entities.js`.
- [x] Endereços (`/v1/admin/addresses`) vinculados a entidades: `createAddress` (`link_code:'entity'` + `uid_link`, `purposes[]`) + listagem real (`GET .../addresses?filters` com `uid_organization`+`link_code`+`uid_link`) + edição (`PATCH /:uid?uid_organization=`) + exclusão lógica (`DELETE /:uid?uid_organization=`), tudo no detalhe da entidade. Confirmado pelo backend em 2026-11-11 (`Navisoft_Fase4_Handoff_Frontend.md`).
- [x] Frota/Assets (`/v1/admin/assets`): lista via `POST /search` (`/frota`) + detalhe (`/frota/[uid]`) com `PATCH` (identificação/unidade/combustível/modelo/veículo), participações em grupos (`GET/POST/DELETE group-assets`, proteção da última participação) e slots de dispositivo (`GET /{uid}/device-slots`, leitura). Create com seletor em cascata **tipo → fabricante → modelo** (`GET assets/types|manufacturers|models` com `filters`) + `vehicle`/`uid_fuel`. Imutabilidade de organização/entidade respeitada no form.
- [x] Grupos de frota (`frota/grupos`): lista org-scoped (`GET /groups?filters`) + criação (`POST /groups`). Sem `DELETE` (não exposto na collection).
- [x] **Lifecycle de entidade e asset** (`PATCH /entities|assets/:uid/lifecycle`, body `{state, reason}`, estados `active/blocked/inactive`): ação "Alterar situação" nos detalhes de entidade e asset, com motivo obrigatório fora de `active`. Rota confirmada pelo backend em 2026-11-11 — era o bloqueio mais urgente (não havia como mudar `uid_situations` de um registro específico).
- [x] **Exclusão de entidade e asset**: `DELETE /entities/:uid` (física, pode `409` por dependência histórica) e `DELETE /assets/:uid` (lógica) — botão "Excluir" nos detalhes, com confirmação.
- [x] Páginas de detalhe `entidades/[uid]` e `frota/[uid]` com dados reais, situação resolvida via `/v1/admin/situations` + ação de lifecycle para alterá-la.

**Correções de contrato vs. base mock (herdada da Fase 0):** a camada antiga assumia `GET` com query `uid_organization[eq]`, `lifecycle` (`/lifecycle`), `uid_energy` e tipos como strings. A API real usa **`POST /search` com `filters` estruturados**, estado por **`uid_situations`** (lido do catálogo) alterável via **rota de lifecycle dedicada**, **`uid_fuel`**, e tipos como **objetos** (`{uid, code, name, is_system}`) substituídos por UID. Endpoints e páginas reescritos de acordo; `listAssets`/`getAsset` mantidos como alias p/ não quebrar Ordens de Serviço (Fase 7, ainda em mock).

**Resolvido nesta rodada (ver `api-contracts/retorno-insomnia-2026-11-10.md` → backend respondeu em `Navisoft_Fase4_Handoff_Frontend.md`, 2026-11-11):** os 4 pontos 🔴/🟡 que travavam a UI — listagem de `group-assets` e `groups` (já estavam certos no palpite anterior, apenas confirmados), lifecycle de entity/asset, e catálogos de `models`/`manufacturers`/`types`. Endereços (listagem/PATCH/DELETE) também confirmados.

**Pendências/limites da Fase 4:** FIPE (sync/valuation) e `technical-package` ficaram fora da entrega. O histórico de vínculos foi tratado na Fase 19.

**Bug do `DELETE /v1/admin/addresses/:uid` (reportado em `api-contracts/retorno-insomnia-2026-11-11.md`) — corrigido.** Confirmado ao vivo em 2026-11-11 (direto no Insomnia, método DELETE em `/v1/admin/addresses/:uid?uid_organization=...`): 204/sucesso, sem o `404 directory_record_not_found` anterior. Fase 4 considerada homologada ponta a ponta (criar/buscar/editar/excluir endereço, lifecycle de entity/asset, delete de entity/asset, catálogos de group-assets/groups/models/manufacturers/types).

---

## Fase 5 — Devices e SIM Cards

> Collection: `Devices`, `Devices 2/3`, `/v1/admin/devices`, `Sim Cards`, `/v1/admin/simcards`. Doc: `frontend_05`.

- [~] CRUD de devices (`/v1/admin/devices`) — `GET`/`PUT`/`DELETE`/lifecycle implementados contra o contrato confirmado; **criação (`POST`) ainda não homologa** — ver bloqueio abaixo. Situação (ativo/bloqueado/inativo) via `PATCH /devices/:uid/lifecycle` implementada, não testada ao vivo (não há device de teste criado).
- [x] Senha do device: campo `device_pwd` implementado (omitir preserva, `null` limpa, string troca). **Neste ambiente de homolog retorna `422 device_encryption_not_configured`** — chave AES-256-GCM não configurada no servidor; não é algo para corrigir no frontend.
- [x] SIM cards (`/v1/admin/simcards`) — CRUD **homologado ao vivo**: `GET` com `filters` (200), `POST` criar (201), `DELETE` (204). Vínculo (`/devices/linked-simcards`, troca via `PUT`, desvínculo via `DELETE`) implementado conforme contrato confirmado, mas não testado ao vivo (depende de ter um device real, ver bloqueio).
- [ ] Protocol identities / telemetry mappings (`/v1/admin/devices/protocol-identities`, `/telemetry-mappings`) — listagem confirmada (`GET` + `POST /search`), mas **tela não desenhada nesta rodada** (fora do escopo mínimo desta fase) e ainda sujeita a SYS-RES-01 (replay) em aberto no backend.
- [x] Página `devices-sim` integrada à API real — devices e SIM cards (list/create, offset via `useOffsetList`), situação via modal de lifecycle (igual assets/entities), vincular/trocar/desvincular SIM sem precisar desativar o device.

**Iniciado em 2026-11-11, contrato confirmado em 2026-11-12, homologado parcialmente em 2026-11-12.** Levantamento contra `Insomnia_2026-11-11.json`, `API_CONTRACTS.md` e `frontend_05_devices_sim.md` encontrou lacunas — pedido em `api-contracts/solicitacao-referencias-devices-simcards.md`. O backend respondeu com 4 dúvidas (respondidas em `api-contracts/esclarecimento-devices-simcards-2026-11-12.md`) e depois mandou `DEVELOPER_GUIDE.md`/`TESTING_GUIDE.md` atualizados com o contrato completo (vínculo device↔SIM como recurso próprio com UID, lifecycle dedicado, `device_pwd` com semântica omitir/null/troca, `DELETE` físico, listagem de protocol-identities/telemetry-mappings). `devices.js`/`mock/devices.js`/`devices-sim/page.jsx` reescritos de acordo.

**Teste ao vivo (2026-11-12, org `Admin Homolog Client`, login `admin.autoscale`, `https://api.navisoft.app`):** confirmados `POST /devices/search` (200), `GET /simcards?filters=` (200), `POST /simcards` (201), `DELETE /simcards/:uid` (204) — exatamente como documentado, dados de teste já limpos. **Bloqueado:** `POST /v1/admin/devices` (criar device) retorna `422 invalid_device` mesmo usando um `uid` de modelo real (obtido via `GET /devices/models`) — testei com `uid_catalog` e `uid_model` como nome do campo, nenhum funcionou, e o erro genérico não diz qual campo está errado. Sem conseguir criar um device, não dava pra testar ao vivo vínculo/troca/lifecycle de SIM nem o próprio lifecycle de device.

**Fase 5 pausada aqui. Falta para fechar:**
1. 🔴 **Perguntar ao backend o corpo exato de `POST /v1/admin/devices`** — nome certo do campo de modelo (`uid_catalog`/`uid_model`/outro), se `uid_type`/`uid_manufacturer` também são obrigatórios junto do modelo, e qualquer outro campo que o `invalid_device` genérico não está revelando. Sem isso não dá pra homologar criação de device nem nada que dependa de ter um device real (vínculo, troca de SIM, lifecycle).
2. 🟡 Trocar o catálogo estático mockado (`deviceCatalog`, em `mock/devices.js`) pelo catálogo real (`GET /devices/types`, `/manufacturers`, `/models` — já confirmados, mesmo padrão usado em `fleet.js` para assets) no formulário de criação da tela.
3. 🟡 Depois que (1) resolver: homologar ao vivo criação de device, lifecycle (ativo/bloqueado/inativo com liberação de SIM), vincular/trocar/desvincular SIM no link real.
4. 🟢 `device_pwd` só pode ser homologado quando o backend configurar a chave de criptografia neste ambiente (`device_encryption_not_configured`) — fora do nosso controle.
5. 🟢 Protocol identities / telemetry mappings seguem fora do escopo desta fase (tela não desenhada) — decidir em outra rodada se entra como Fase 5b ou fica para depois, e checar status do SYS-RES-01 antes.

---

## Fase 6 — Geografia

> Collection: `Geocode`, `/v1/admin/geo`. Doc: `frontend_06`. (base mock já existe)

- [~] Cercas (geofences), pontos e rotas (`/v1/admin/geo/...`) com gates de área geográfica: listagem/detalhe/criação/edição/exclusão implementadas. Pontos, círculos e polígonos aprovados no ensaio HTTP administrativo de 15/11/2026 (criação, replay, conflito, negativas, PUT, GET e search); exclusão confirmada após retentativa. Criação de rota bloqueada por **503 geo_storage_unavailable**. Filtros centrais e offset preservados.
- [ ] Geocode (`/v1/admin/geocode`) — busca de endereço/coordenada. Contrato de busca não está na collection disponível; provisionamento do serviço não comprova endpoint de pesquisa.
- [x] Mapa / visualização na página `geografia`: mapa local de coordenadas com seleção, zoom, raios de pontos e geometrias GeoJSON (Point/LineString/Polygon/MultiPolygon). Sem base de ruas; exibe os registros carregados e as geometrias presentes na resposta.

**Entrega parcial em 13/11/2026:** removida referência quebrada a `mock.SCOPE_LEVELS`; consulta por escopo explícito, gates `geo_points`/`geo_geofences`/`geo_routes`, validação de coordenadas/UUIDs, exclusão com confirmação e chave de idempotência preservada para retentativas do mesmo payload. Mudança de organização, escopo ou área desmonta os dados abertos. Ver [contratos pendentes de Geografia](api-contracts/solicitacao-referencias-geografia.md).

**Verificação local:** `cd frontend; node scripts/geography.test.mjs` — 5 testes passaram (HTTP simulado). Sintaxe dos arquivos alterados validada. `npm.cmd run build` impedido por `spawn EPERM` no ambiente; build, navegador e homologação HTTP continuam pendentes. Nenhuma mutação real executada.

**Revisão em 15/11/2026:** CRUD de cercas e rotas implementado a partir dos contratos já presentes no `TESTING_GUIDE.md` (seções 11.3–11.5). Formulários de polígono e pontos ordenados recebem JSON; validação local cobre coordenadas, anéis fechados, medidas não negativas e pelo menos dois pontos distintos. A API permanece responsável pela validade topológica e autorização. O mapa também desenha rotas recebidas em `points`. Menu de Geografia condicionado às áreas permitidas; consultas não globais exigem organização selecionada. Chaves de criação são preservadas para retentativas do mesmo payload; mensagens dos seis códigos GEO canônicos adicionadas.

**Verificação desta revisão:** 9 testes locais passaram (HTTP simulado), incluindo corpos de círculo/polígono/rota, métodos de CRUD/search, autenticação, no-store, repetição da chave e propagação de erros 400/403/404/409/422/503. Parser aprovado para os arquivos alterados. `npm.cmd run build` novamente falhou com `spawn EPERM`. **Não há evidência de replay/conflito real, isolamento por perfis, execução em navegador ou CRUD contra a API real.** A Fase 6 permanece parcial, inclusive por faltar contrato de pesquisa de endereço (geocode). Ver [pendências e critérios de aceite](api-contracts/solicitacao-referencias-geografia.md).

**Continuação da Fase 6 (15/11/2026):** editor visual de pontos ordenados da rota (adicionar/remover/mover, coordenadas e velocidade por segmento); detalhes de margens e velocidades; corrigidos aviso antigo de contrato pendente e texto de exclusão. Campos numéricos rejeitam booleanos/espaços; velocidade de segmento em branco usa o padrão da rota. Consultas sem organização em escopo não global são barradas antes do HTTP. Listagens descartam respostas abortadas e limpam dados após 403/404.

**Validação da continuação:** 11 testes de domínio/contrato e 2 do roteiro de homologação passaram com HTTP simulado; parser aprovado. Comando local: `cd frontend; npm.cmd run test:geography`. Roteiro real preparado em `frontend/scripts/geography.http.mjs` (CRUD/search/replay/conflito/negativas/limpeza/relatório), configurado conforme o documento de pendências. Uma consulta real a `/v1/users/status` retornou **401** com o token local; nenhuma mutação real executada. `next dev` também bloqueado por `spawn EPERM`. Ainda faltam credencial/organização de homologação, build/navegador, testes reais por perfil e contrato de busca de endereços. **Fase 6 continua parcial.**

**Homologação autenticada de 15/11/2026 (substitui a pendência de credencial acima):** login com a conta informada pelo usuário retornou 200. Em Admin Homolog Client, pontos/círculos/polígonos passaram em criação 201, replay 200 com mesmo UID, conflito 409, geometria inválida 422, GET/PUT/list/search 200. Rota com dois pontos distintos retornou 503; diagnóstico isolado confirmou `geo_storage_unavailable` e request ID `d6d3e7eb-3d91-4e4d-bcd2-f93844a2db25`. Após a falha, exclusões GEO também retornaram 503; em tentativas posteriores todos os seis pontos/cercas das duas rodadas foram excluídos 204 e os detalhes retornaram 404. Não há causa SQL comprovada, e nenhuma rota foi criada com UID reconhecido. **Fase 6 permanece parcial** por rota, Geocode, outros perfis e build/navegador. Ver [diagnóstico para o backend](api-contracts/solicitacao-correcao-geo-routes-2026-11-15.md).

---

## Fase 7 — Técnicos, Ordens de Serviço e Manutenção

> Collection: `Service Orders`, `/v1/technician/work-orders`, `Maintenance`, `/v1/admin/maintenance`. Docs: `frontend_07`, `frontend_08`.

- [x] Técnicos/prestadoras (`/v1/admin/entities/technicians`) + preços/capabilities: tela e API reais, catálogo, PATCH de capacidades, desativação e tabela GET/PUT por capacidade/operação. Prestadora é entidade tipificada em Entidades. Fluxos de executor/preço homologados por HTTP em fixture exclusiva; navegador ainda pendente.
- [~] Ciclo de OS técnica: create/replay, dispatch, pricing snapshot, start, confirmação de custódia, conclusão, devolução, recebimento. **Instalação e retirada administrativas homologadas por HTTP em 15/11/2026**, com replay/conflito de criação e conclusão, snapshots priced/unpriced, bloqueio antes do recebimento, confirmação, início, declaração e fechamento físico de custódia. Ainda faltam substituição, pacote com testes obrigatórios fail/pass, conclusão parcial e outros perfis.
- [~] Self-service do executor (`/v1/technician/work-orders`) sem exposição de `pricing_snapshot`: páginas `/minhas-ordens-servico` e detalhe, rotas próprias e projeção sem campos financeiros implementadas/testadas localmente. Conta Basic vinculada e declaração de retorno pelo executor ainda precisam de validação/contrato.
- [x] Manutenção (`/v1/admin/maintenance`) — ordens e transições: lista/detalhe/criação/PATCH agregado, iniciar/concluir/cancelar, condições e disponibilidade do ativo. Criação/replay, agregação, início/conclusão/replay, resolução de condição e imutabilidade terminal homologados por HTTP; cancelamento/outros perfis/navegador ainda pendentes.
- [~] Páginas `tecnicos`, `ordens-servico`, `ordens-servico/[uid]`, `minhas-ordens-servico` e `manutencao` ligadas à API real, com gates e limpeza ao trocar contexto. Lint/imports aprovados; build e navegador pendentes por `spawn EPERM`.

**Entrega em 15/11/2026:** removidas referências indefinidas a mock em técnicos, paginação cursor indevida, rota inexistente de pricing e caminhos de custódia aninhados na OS. Os novos formulários enviam os campos reais da collection. Na operação técnica maintenance o mesmo device é enviado antes/depois; na criação de OS a organização é derivada do asset. Área financeira confirmada no access-context: `devices.pricing`. Escritas de manutenção continuam sujeitas a `assets.fleet_admin` no backend, que não expõe esse flag no contexto global.

**Verificação:** `cd frontend; npm.cmd run test:technical-operations` — **16 testes locais passaram**. ESLint dos arquivos da funcionalidade e validação de imports/sintaxe passaram. `npm.cmd run build` falhou com `spawn EPERM`. Login pela credencial de teste da collection retornou 200; buscas reais de técnicos/OS/manutenção e catálogo retornaram 200. Fixture HTTP validou técnicos, preços e manutenção; ativo excluído, executor desativado, prestadora inativada e manutenção concluída preservada no histórico. Nenhuma OS preexistente alterada e nenhum dispositivo despachado. **Fase 7 parcialmente homologada; não confundir com aprovação integral do ciclo de OS ou do portal.** Ver [contratos, evidências e pendências da Fase 7](api-contracts/fase7-tecnicos-os-manutencao.md).

**Nova validação com a autenticação informada pelo usuário:** técnicos/preços/manutenção passaram novamente; dois ciclos administrativos de instalação/retirada de dispositivos exclusivos de teste passaram, com limpeza. Os devices foram inativados quando a exclusão foi impedida por histórico; ativos excluídos, prestadora inativada e executor desativado; OS concluídas preservadas. Corrigido o botão de confirmação para usar `technician_received_at`, distinto de `received_at` físico. **17 testes de operações técnicas + 13 de Geografia passaram localmente**, e lint dos arquivos corrigidos passou. Evidências: [OS/custódia](api-contracts/evidence/phase7-work-orders-http-2026-11-15.json), [técnicos/manutenção](api-contracts/evidence/phase7-authenticated-http-2026-11-15.json). A aprovação não abrange portal Basic, outros perfis nem navegador/build.

---

## Fase 8 — Checklists

> Collection: `CheckList`, `/v1/admin/checklists`, `/v1/admin/checklist-groups`, `/v1/checklists/runs`.

- [x] Grupos de checklist (`/v1/admin/checklist-groups`) — busca/offset, criação idempotente, detalhe, PATCH e desativação; API validada em fixture própria.
- [x] Templates de checklist (`/v1/admin/checklists`) — editor de agregado, perguntas boolean/text, ordem, obrigatoriedade/efeitos, alvos selecionados ou todos, rascunho e publicação explícita; v1/no-op/v2 e snapshots antigos validados na API.
- [x] Execuções/runs (`/v1/checklists/runs`) — criar/reabrir por UID, selecionar ativo, responder snapshots, salvar parcialmente e concluir; false preservado, required 422, imutabilidade/troca de ativo 409 e resultados released/blocked validados. Não há rota documentada de listagem global de runs.
- [~] Páginas de listagem, detalhe e execução implementadas em `/checklists`, `/checklists/[uid]`, `/checklists/grupos`, `/checklists/execucoes` e `/checklists/execucoes/[uid]`, com gates de área/organização e navegação. Lint e API aprovados; validação no navegador e build seguem pendentes por `spawn EPERM`.

**Entrega em 16/11/2026:** camada de API e validações de checklist, formulários de grupos/templates, editor de perguntas e destinatários e execução sobre versão fixada. Publicação não ocorre automaticamente ao salvar rascunho; execuções antigas não usam o template atual para montar respostas. PATCH real exige agregado completo com `uid_organization` no corpo; após responder ao ativo a API não permite sua substituição. Esses dois pontos foram conferidos e refletidos na UI.

**Verificação:** `cd frontend; npm.cmd run test:checklists` — **12 testes passaram**; ESLint da funcionalidade/menu passou. Ensaio HTTP na organização Admin Homolog Client aprovou criação/replay/conflito, publicação v1/no-op/v2, snapshots fixados, obrigatórias, false, encerramento e integração que gerou uma única manutenção por ativo inapto. Templates publicados inativos, grupos/motoristas desativados, ativos excluídos e manutenção de teste resolvida; históricos preservados. `npm.cmd run build` falhou com `spawn EPERM`; não há aprovação de navegador/build, outros perfis ou cross-tenant. Ver [contratos, evidências e limites da Fase 8](api-contracts/fase8-checklists.md).

---

## Fase 9 — Agenda / Schedule

> Collection: `Schedule`, `/v1/admin/agenda`, `/v1/reports/schedules`.

- [x] Agenda (`/v1/admin/agenda`) — implementada conforme o contrato real: consulta de projeções de manutenção, detalhe, PATCH de controles com `controls_version`, análises idempotentes/histórico paginado e cores da organização. **Não há CRUD de compromissos avulsos na API documentada**; criação/encerramento pertencem ao processo de origem.
- [~] Integração com `fullcalendar` — `/agenda` usa FullCalendar com mês/semana/lista, cores e abertura do detalhe; `/fullcalendar` passa a servir a mesma tela real. O calendário informa quantos registros foram carregados e permite carregar mais pela tabela. Lint passou; navegador/build pendentes por `spawn EPERM`.
- [~] Schedules de relatórios (`/v1/reports/schedules`) — `/relatorios/agendamentos` com listagem/detalhe, criação diária, edição, pausa, retomada e exclusão confirmada. Ciclo HTTP aprovado em fixture própria com limpeza; **replay de criação retorna 422 `invalid_report_request`**, pendência do backend registrada abaixo. Outras periodicidades/períodos existentes são preservados na edição; criação de novas variantes depende de contrato completo.

**Entrega em 17/11/2026:** camadas de API/domínio, páginas e navegação da fase implementadas. Datas da Agenda usam o fuso do navegador; schedules usam o fuso derivado da organização, sem enviar `timezone`. O access-context real possui área `agenda`, mas não possui área `reports`; relatórios dependem da autorização por definição/proprietário/organização reaplicada pelos endpoints. A edição de schedules converte o snapshot de filtros retornado no GET para o formato de entrada aceito, sem reenviar paginação/estado normalizados.

**Verificação:** `cd frontend; npm.cmd run test:agenda` — **15 testes passaram**; ESLint dos arquivos alterados passou. HTTP: leitura da Agenda/cores/busca por título 200 (organização de homologação sem entradas); schedules create 201, GET/PUT/state/list/delete 200, fixtures excluídas. O replay, repetido em fixtures distintas, falhou com 422; evidência consolidada tem `passed:false`. As baterias congeladas do backend da Agenda não foram repetidas; escrita de controles/análises/cores na API, navegador, outros perfis e cross-tenant não foram homologados nesta entrega. `npm.cmd run build` falhou com `spawn EPERM`. Ver [contratos, evidências e pendências da Fase 9](api-contracts/fase9-agenda-schedules.md).

---

## Fase 10 — Eventos e Notificações

> Collection: `Events`, `Events 2`, `Events RedPanda`, `/v1/admin/events`, `Notificacoes`, `External Notify`, `/v1/admin/notifications`.

- [~] Ocorrências e tipos de evento (`/v1/admin/events`) — `/eventos` consulta ocorrências e oferece reconhecer/anotar/encerrar; `/eventos/modelos` consulta tipos/parâmetros e catálogo de campos; `/eventos/regras` cria/consulta/edita/exclui regras com alvo composto, parâmetros, condições AND, janelas, destinatários e tempos distintos. Catálogos e ciclo HTTP de regra inativa aprovados; tratamento real de ocorrência depende de fixture (lista de homologação vazia).
- [N/A] Feed de eventos / stream (RedPanda) — não há contrato de stream HTTP de ocorrências nas fontes disponíveis. Tela usa consulta paginada e atualização explícita. SSE de sessão não é feed operacional; brokers e credenciais não foram expostos ao navegador.
- [~] Notificações (`/v1/admin/notifications`) — `/notificacoes` gerencia destinatários externos e vínculos; `/notificacoes/hooks` lista hooks e edita override `organizations.insert` da organização; `/notificacoes/entregas` consulta status por UID. Não existem rotas documentadas de inbox, marcar como lida ou preferências pessoais; configuração disponível é de hooks/destinatários. Sino do cabeçalho substituído por navegação real, sem mensagens/contador fictícios. CRUD de destinatário e leituras de hooks aprovados por HTTP; gravação de hook e status real de delivery pendentes de homologação.
- [~] Notificações externas (`External Notify`) — consulta de metadados da credencial organizacional e status de delivery pelo Core implementadas, sem segredos no browser. Administração direta do provedor é control-plane M2M e não tem proxy frontend documentado. Envio/entrega externa não foram provocados nem homologados nesta fase.

**Entrega em 17/11/2026:** APIs, validações, seis páginas, menus e atalhos do cabeçalho. Gates `events`, `event_occurrences` e `notifications`, organização obrigatória, abort/desmontagem ao trocar identidade/tenant/acesso e erros de negócio. Área liberada não presume autorização de escrita: o backend continua responsável por revalidar cada mutação. Novas regras começam inativas; PUT preserva o agregado e converte os endpoints do destinatário para o contrato de entrada, sem seu UID gerado (reenviá-lo causava 422 `invalid_notification_endpoint`). Destinatários de Events e Notifications são domínios independentes; destinatários Notifications vinculados a contatos ficam em consulta até haver contrato completo de edição.

**Verificação:** `cd frontend; npm.cmd run test:events-notifications` — **17 testes passaram**; ESLint dos arquivos alterados passou. `npm.cmd run test:events-notifications:http` aprovou catálogos, busca, regra inativa e destinatário externo inativo (create/replay/conflito/get/PUT/list/delete), hooks efetivos e metadados Notify; fixtures excluídas/desativadas e sessão própria encerrada. Ocorrências retornaram 200/total 0; não houve inserção SQL nem tratamento de registros preexistentes. `npm.cmd run build` falhou com `spawn EPERM`; navegador/build, outros perfis, cross-tenant, condições complexas, escrita de hooks e delivery real permanecem sem aprovação nesta entrega. Ver [contratos, evidências e limites da Fase 10](api-contracts/fase10-eventos-notificacoes.md).

---

## Fase 11 — Knowledge Base

> Collection: `Knowledge`, `/v1/admin/knowledge`, `/v1/public/knowledge`, `/v1/knowledge/items`.

- [~] Categorias e itens administrativos (`/v1/admin/knowledge/items`) — `/knowledge` e `/knowledge/[uid]` com criação de item draft, revisões imutáveis, vídeos YouTube, publicação explícita por revisão/audiência, archive, anexos GED fixos e editor de grants. `/knowledge/categorias` consulta catálogo paginado; cadastro/edição de categorias e classificação aguardam o contrato de `knowledge.md`, ausente no workspace. GET/list/search retornaram 200 nesta rodada, sem o 503 histórico. **Grants com corpo documentado retornam 422 `unclassified_http_422`**, inclusive lista vazia; pendência registrada para investigação na API.
- [x] Busca de itens (`/v1/admin/knowledge/items/search`) — POST com `q`, `limit` e `offset`; listagem mostra metadados sem usar conteúdo draft como publicação. Busca administrativa e dos leitores público/autenticado verificadas por HTTP.
- [~] Portal público de knowledge (`/v1/public/knowledge`) — `/ajuda` e `/ajuda/[slug]`, fora do AuthGuard, sem Bearer; busca, paginação, artigo publicado, links de vídeo e download binário de anexos por rota Knowledge. Leitor autenticado separado em `/knowledge/leitura` e `/knowledge/leitura/[slug]`, com organização explícita. Publicação pública/authenticated e ocultação de draft/archived aprovadas por HTTP; anexos reais e navegador/build pendentes.

**Entrega em 17/11/2026:** sete rotas de página mais layout público, APIs/domínio, consulta cancelável para visitantes sem sessão, editor de revisões/publicação e navegação. Administração global continua Primary-only na API; o frontend exige área `knowledge`, não inventa papel a partir da sessão e não aplica filtro organizacional à lista editorial global. Audiência e revisão publicadas são independentes da última revisão salva. Conteúdo é renderizado como texto seguro; vídeos usam somente links HTTPS canônicos, sem embed. Downloads usam o tratamento compartilhado de erros/401 e `responseType: 'blob'`, sem decodificar bytes como JSON nem confiar em URLs de storage retornadas.

**Verificação:** `cd frontend; npm.cmd run test:knowledge` — **15 testes passaram**; lint passou. Regressões de Agenda (**15**), Eventos/Notificações (**17**) e Checklists (**12**) passaram após a extensão binária no cliente HTTP. Ensaio HTTP aprovou draft/replay, revisão/replay/conflito, vídeo normalizado, publicação pública, busca anônima, preservação do snapshot publicado após novo draft, histórico, audiência authenticated e arquivo/404; anexos vazios aceitaram PUT. Resultado consolidado `passed:false` devido aos dois erros de grants. Artigos de teste arquivados; sessões encerradas. `npm.cmd run build` falhou com `spawn EPERM`; navegador, downloads reais, matriz de perfis/selected e edição de categorias permanecem sem homologação. Ver [contratos, evidências e limites da Fase 11](api-contracts/fase11-knowledge-base.md).

---

## Fase 12 — Documentos / GED

> Collection: `GED Permissions`, `GED fase 2`, `/v1/admin/documents`, `document-contracts`, `document-classes`, `document-revisions`, `document-distributions`.

- [x] Classes de documento (`/v1/admin/document-classes`) — `/documentos/classes`: lista/busca paginada, criação idempotente, detalhe antes de editar, nome/ativação e substituição explícita de permissões por ação. Create/replay/GET/PUT e desativação validados por HTTP.
- [x] Contratos de documento (`/v1/admin/document-contracts`) — `/documentos/contratos`: criação com ano/código e organização selecionada; UUID retornado alimenta o cadastro de documento. **SYS-GED-01 não reproduzido:** criação 201, retry exato 200/mesmo UID e divergência 409 nesta rodada. A documentação atual confirma somente POST; a interface não inventa lista de contratos (tentativa GET não forneceu listagem utilizável).
- [~] Documentos, revisões e distribuições — `/documentos` e `/documentos/[uid]`: pesquisa com filtro organizacional obrigatório, criação por catálogo/contrato/classe/alvo, histórico, download, class assignment e distribuição create/edit/revoke com `follow_latest`/`fixed_revision`. Ciclo HTTP aprovado com documento exclusivo; contexto destinatário expôs somente R00 após fixação, preservando o proprietário. Navegador/build pendentes.
- [~] Permissões GED (`GED Permissions`) — editor por ação independente (`read`, `download`, `revise`, `manage`), grupos funcionais/membros em `/documentos/grupos`, sem conceder `documents.access` global nem criar scopes. Grupo/member e permissão `functional_group/read` persistidos por HTTP; matriz Basic/Secondary/delegated_support e negativas por ação não re-homologadas nesta entrega.
- [~] Upload / storage de objetos físicos — upload binário PDF/JPEG, R00 com nome/formato canônicos, R01+ com resumo obrigatório e conteúdo diferente; retry conserva chave conforme hash+headers. Proxy repassa `X-File-Name`/`X-Revision-Summary` e mantém bytes. R00/replay/R01, conflitos e download PDF com SHA-256 idêntico passaram no storage configurado. Download `presign` HTTPS tem suporte e teste local; S3/HA, JPEG real e navegador não foram homologados. Configuração operacional de storage segue na Fase 15.

**Entrega em 17/11/2026:** cinco páginas, navegação, APIs e validações GED; gate `documents`, contexto organizacional e abort/desmontagem ao trocar identidade/tenant/acesso. Proprietário, contexto de leitura e alvo são distintos; alvo não substitui distribuição. Destinatário não recebe controles de upload/gestão. Negação de download revalida a leitura do documento sem presumir perda de todas as ações. Classes/grupos/membros usam `filters` JSON com organização; detalhe/mutações usam `uid_organization` explícito. O editor suporta principais `functional_group`, `target` e `delegated_support`; tipos desconhecidos existentes são mostrados e bloqueiam salvamento, evitando descarte silencioso.

**Verificação:** `cd frontend; npm.cmd run test:documents` — **18 testes passaram**, incluindo o proxy binário; ESLint dos arquivos alterados passou. Regressões após ampliar o cliente HTTP: Knowledge **15**, Eventos/Notificações **17**, Checklists **12**, todas aprovadas. `npm.cmd run test:documents:http` retornou `passed:true`: contrato/replay/conflito, grupo/member, classe/read, documento/replay, R00/replay, unchanged 409, R01 sem resumo 422, R01 válida, downloads/hashes, pesquisa e distribuição/fixação. Distribuição revogada e membership removida; classe/grupo desativados e permissões limpas. Contrato/documento/revisões/objetos permanecem como histórico (sem purge documentado); sessão encerrada. `npm.cmd run build` falhou com `spawn EPERM`. Ver [contratos, evidências e limites da Fase 12](api-contracts/fase12-documentos-ged.md).

---

## Fase 13 — Billing, Planos e Comercial

> Collection: `Billing`, `REfatoring Billing`, `/v1/admin/billing`, `/v1/admin/billing-plans`, `/v1/commercial/orders`, `/v1/commercial/overview`.

- [x] Planos de cobrança em `/planos`, com faixas, política de ajuste negativo, capacidades e cotação. A exclusão está integrada, com reteste HTTP pendente após 503.
- [x] Lançamentos e demonstrativos em `/billing`, com detalhe, busca de lançamentos, filtro por conta, duplicação, cancelamento e fechamento.
- [x] Separação de acesso financeiro (INT-01). Planos e faturamento dispensam a seleção operacional. A API decide a visibilidade financeira e nenhuma organização consumidora é adicionada ao seletor pelo faturamento.
- [~] Pedidos comerciais em `/comercial`, com seleção de serviços, aceite de termos reconhecidos e transições versionadas. A conclusão exibe o acordo quando fornecido pela API e indica o processamento assíncrono do provisionamento. O histórico da tela dura enquanto o contexto estiver aberto. Homologação positiva pendente em organização de teste com conta vinculada e oferta elegível.
- [x] Visão geral comercial por organização (`/v1/commercial/overview`), com conta e ofertas vigentes.
- [x] Criação de organização com administrador e plano em `/organizacoes`. Validação do formulário e integração local concluídas. Ensaio de provisionamento HTTP pendente.

**Homologação:** leitura de planos, capacidades, cotação, lançamentos, demonstrativos e visão comercial confirmada. O filtro por conta retornou 200 em lançamentos e demonstrativos. A API retornou 404 para o catálogo de contas. A criação e edição de um plano descartável inativo retornaram 201 e 200. O DELETE retornou 503 `billing_storage_unavailable` no reteste (request ID `ef2ea303-8b4a-4714-9a8e-2c67ba7a5677`), e o GET confirmou que a fixture segue inativa. O pedido na organização de teste sem conta vinculada retornou 422 `invalid_commercial_order`.

**Validação local:** lint dos arquivos alterados e 38 testes automatizados aprovados (3 Billing, 18 GED e 17 Operação Técnica). Build de produção concluído com configuração temporária de workers em threads para contornar `spawn EPERM` no ambiente. O servidor de produção respondeu 200 em `/billing`, `/planos`, `/comercial`, `/organizacoes` e `/ordens-servico`.

---

## Fase 14 — Relatórios

> Collection: `Reports 1/2/3`, `/v1/reports`, `/v1/reports/organizations|entities|assets|schedules`, relatórios salvos por UID.

- [x] Catálogo de definições por domínio e histórico paginado das exportações do solicitante (`POST /v1/reports/search`), com busca e filtro por organização.
- [x] Relatórios de organizações, entidades e ativos em `/relatorios`, com colunas, filtros, ordenação e paginação conforme as definições da API.
- [~] Solicitação de exportação privada, consulta por UID com atualização de status, download autenticado e nova geração a partir dos parâmetros salvos quando a versão e o contexto são compatíveis. A geração de novos arquivos está bloqueada na homologação pelo processamento de relatórios.
- [x] Tabela conforme a projeção e gráfico ApexCharts agregado sobre os registros da página, com dimensão conforme o domínio.

**Homologação:** as definições e consultas dos três domínios, o histórico e a busca no histórico retornaram 200. O detalhe por UID e o download de um XLSX existente retornaram 200. Novas exportações privadas dos três domínios retornaram 201 `pending`; o replay de Entidades e Ativos retornou 200 com o mesmo UID. As três solicitações passaram para `failed` com `report_definition_unavailable` (request IDs de criação `3f40dfc7-0aca-4a83-aaf1-7f3335eb7cf3`, `1faf60a5-d930-4691-bc3b-950133aded2c`, `0042e747-817c-4a21-8458-4cd0429ebf89`).

**Validação local:** build de produção, lint e 18 testes aprovados (3 de Relatórios e 15 de Agenda). O servidor de produção respondeu 200 em `/relatorios` e `/relatorios/agendamentos`. Pelo proxy do frontend, histórico, detalhe e download autenticado de um XLSX existente retornaram 200. O arquivo tinha 2.940.624 bytes e assinatura ZIP, esperada para XLSX.

---

## Fase 15 — Serviços de Plataforma e Infraestrutura

> Collection: `Services`, `Platform Capabilites`, `/v1/admin/integrations`, `Fipe Sync`, `Storage`, `/v1/admin/images`, `Common`, `Redis Cache (T2/T4)`, `/v1/health`.

- [~] Capacidades da plataforma em `/platform-capabilities`, com busca paginada no catálogo e edição dos padrões em `/planos`. A capacidade efetiva depende da versão do contrato ativo. O contrato HTTP disponível não oferece edição direta nem consulta do snapshot por organização.
- [~] Integrações em `/integracoes`, com catálogo de Services, vínculos da organização selecionada e importação, substituição e revogação da credencial Autoscale Notifications conforme o contrato de `integration-tokens`.
- [~] Sincronização FIPE em `/integracoes/fipe`, com criação idempotente de tarefas de catálogo, referência e variante, histórico paginado e detalhe por UID.
- [~] Upload binário de logos de organização e entidade, visualização autenticada da imagem vinculada ao asset e prévia local de JPEG no GED. Upload de fotos de assets aguarda contrato HTTP de envio e vínculo. Os repositórios de storage são configurados no backend. O reteste de vínculo da logo de entidade depende da correção SYS-IMG-01 descrita no guia de testes.
- [~] Saúde em `/health`, com leitura de `/v1/health/details`, incluindo diagnóstico crítico com HTTP 503. A interface aceita credencial temporária `health:read` em memória quando a sessão não tem acesso ao diagnóstico.
- [~] Redis e Services constam como diagnósticos de leitura. O painel de saúde mostra disponibilidade dos caches e contadores de sessão quando fornecidos pela API. A tela de integrações mostra o estado solicitado dos serviços por organização.

**Validação local:** 119 testes aprovados, incluindo seis da Fase 15 com HTTP simulado (`cd frontend; npm.cmd run test:platform`). As quatro novas rotas foram geradas no build com servidor Next.js e na exportação estática para GitHub Pages. O lint dos arquivos novos passou. Permanecem três ocorrências preexistentes de `react-hooks/set-state-in-effect` nas páginas de detalhe de organização, entidade e asset.

**Homologação:** a API respondeu 200 em `GET /v1/health/ready`. A sessão disponível retornou 401 em `/v1/users/status` e nas consultas protegidas de catálogo, Services, FIPE e Health. A homologação de leituras protegidas e mutações depende de uma sessão autorizada de teste.

---

## Fase 16 — Dashboards e Finalização

- [x] Painéis de Visão geral, Operações e Financeiro com totais da API. Operação usa o contexto selecionado. Financeiro mantém o escopo das contas da sessão. Falhas ou respostas sem total ficam explícitas.
- [~] Menu e rotas diretas compartilham os gates de área documentados. As consultas dependentes da seleção aguardam o contexto organizacional. Formulários e dados do escopo anterior são desmontados ao trocar organização ou acesso. A matriz cross-tenant ao vivo permanece pendente.
- [~] O cliente e as listas compartilhadas apresentam mensagens consistentes para 401/403/404/409/422/503 e descartam dados de listas quando o acesso é negado. Cenários locais executados. A validação de telas e perfis na API real permanece pendente.
- [x] Produção usa a API real e oculta as demonstrações do template. As rotas demonstrativas redirecionam. Em desenvolvimento, a navegação demonstrativa fica disponível com `NEXT_PUBLIC_ENABLE_TEMPLATE_DEMOS=1`.
- [~] Roteiro de homologação HTTP somente leitura disponível em `frontend/scripts/homologation-read.http.mjs`. Readiness e portal público responderam 200 e o contexto anônimo retornou 401 como esperado. A sessão local retornou 401. As consultas protegidas e os fluxos de escrita ainda dependem de uma sessão e organização descartável de homologação. [Evidência da execução](api-contracts/evidence/phase16-readonly.json)
- [x] Documentação de uso, testes, configuração do proxy e deploy estático em [frontend/README.md](frontend/README.md).

**Validação local:** 124 testes aprovados, lint dos novos painéis e guardas aprovado e exportação para GitHub Pages com 163 páginas geradas. Foram conferidos os recursos estáticos dos três painéis e os redirecionamentos das duas páginas demonstrativas de autenticação. O lint ampliado ainda aponta ocorrências preexistentes nos hooks de paginação e no controle de menu móvel.

**Homologação:** a tentativa adicional de abrir uma sessão com a conta dedicada de teste também retornou 401 (request ID `3d55b460-c204-43f5-9eb1-81a7db47e202`). A rodada autenticada, as escritas e a matriz cross-tenant continuam pendentes.

---

## Próximas integrações — Fases 17 a 22

Começar pelo Perfil. Motoristas é a primeira tela nova de operação. As Fases 17 a 20 podem avançar com os contratos disponíveis, começando pela consulta na Fase 20. As fases de ativação e geocodificação começam pela confirmação das dependências da API. [Coleção do Insomnia de 11/11](Insomnia_2026-11-11.json) · [Guia de testes da API](TESTING_GUIDE.md) · [Pendências do reteste de 19/11](api-contracts/pendencias-homologacao-api-navisoft.md)

### Fase 17 — Meu perfil e verificação de contato

1. [x] Mapear os campos de apresentação de `GET/PUT /v1/users/profile` e o contrato de e-mail em `POST /v1/users/contact-verification/request` e `/confirm`. O e-mail é o canal com exemplo na coleção e evidência HTTP no guia de testes.
2. [x] Criar `/account/profile` no menu da conta, reutilizar `fetchProfile` e `updateProfile` e recarregar o perfil depois de salvar. Redirecionar a rota legada para a tela de Meu perfil.
3. [x] Implementar solicitação, confirmação e reenvio de e-mail. Tratar contato ausente, contato já verificado, desafio inválido ou expirado e intervalo de reenvio informado pela API.
4. [~] Validar no navegador com uma conta de teste e um destino controlado. O lint e 14 testes locais passaram. Os três testes específicos de Perfil rodam com `cd frontend` e `node scripts/account-profile.test.mjs`. Com a API simulada, o Chrome confirmou o redirecionamento da rota legada, o salvamento, a atualização do menu, a persistência após recarregar, a espera para reenvio, a rejeição de token inválido e a confirmação com token válido. A rota de recuperação de senha respondeu 200. A homologação com conta e e-mail reais segue pendente.

**Aceite.** A pessoa autenticada edita o próprio perfil, vê os dados atualizados no menu e consegue verificar um contato de teste.

### Fase 18 — Motoristas e seleção no Checklist

1. [x] Integrar cadastro, detalhe, edição parcial, inativação e busca em `/v1/admin/entities/drivers`. A API implantada retorna `items`, `total`, `limit` e `offset`. A busca envia a organização selecionada, aplica os escopos da sessão no backend e pode incluir inativos. [Contrato de Motoristas](TESTING_GUIDE.md#L3647)
2. [x] Liberar `/motoristas` e o detalhe pela área `drivers`. A troca de organização desmonta a lista e os formulários e cancela as consultas pendentes. O detalhe confere a organização retornada pela API antes de apresentar o registro ou permitir alterações.
3. [x] Reutilizar a busca em `/checklists/execucoes`. A interface mostra motoristas ativos do contexto selecionado, confirma o registro antes de iniciar e envia `uid_driver` no corpo da execução.
4. [~] Homologação HTTP em 24/11/2026 no ambiente de teste. Cadastro (201), replay (200), busca por nome e contrato, paginação, edição (200), início (201) e encerramento do checklist (200) passaram. Depois da inativação (200), a busca de ativos ficou vazia e o detalhe com `include_inactive` manteve o histórico. A busca sem sessão retornou 401 e a troca de organização excluiu o registro da busca e bloqueou seu detalhe no cliente. Os tokens disponíveis para perfis restritos retornaram 401, o que deixa a validação de permissões granulares em aberto.

No Chrome passaram o cadastro, a edição, a inativação, o início de execução, a limpeza da seleção ao trocar de organização e o bloqueio simulado da área `drivers`. A API retornou `404 checklist_run_not_found` ao acessar a execução após inativar o motorista. A reativação temporária permitiu encerrar a execução (request ID `823208e0-9673-4292-8926-b521e40c1e19`). O motorista de teste voltou a ficar inativo.

**Aceite.** Um operador autorizado gerencia motoristas no escopo selecionado e consegue escolher um motorista elegível para iniciar um Checklist.

### Fase 19 — Histórico de dispositivos na Frota

1. [x] Reutilizar `listLinkHistory` de `fleet.js`. Na homologação, `GET /v1/admin/assets/:uid/link_history` devolveu `{items,total,elapsed_ms}`, em ordem decrescente de `occurred_at`. Variar `limit` e `offset` devolveu os mesmos quatro eventos do ativo de teste.
2. [x] Adicionar a aba **Histórico de dispositivos** no detalhe do ativo, com data e hora, operação, slot e os dispositivos anterior e posterior. A interface agrupa a retirada e a instalação de uma troca quando o par é da mesma OS e do mesmo slot. A consulta ocorre ao abrir a aba e tem estados de carregamento, histórico vazio e erro com nova tentativa.
3. [x] Homologar no Chrome com os ativos de teste. A OS de troca do slot 2 confirmou os dois dispositivos exibidos em uma única linha. Ao trocar de organização, o detalhe anterior ficou indisponível e o cliente deixou de consultar seu histórico. O segundo ativo exibiu o histórico vazio. Uma resposta 503 simulada confirmou o estado de erro e a recuperação ao tentar novamente. [Contrato de histórico e slots](TESTING_GUIDE.md#L4000)

**Validação local.** 135 testes passaram, incluindo três casos de histórico que cobrem retirada independente, troca e mudança de slot. O lint dos arquivos alterados e o build do Next.js também passaram.

**Aceite.** Um operador autorizado consegue consultar instalações, trocas e retiradas registradas para o ativo selecionado.

### Fase 20 — Identidades de protocolo e mapeamentos de telemetria

1. [ ] Mapear os filtros, campos e limites de paginação de `GET` e `POST /search` para `/v1/admin/devices/protocol-identities` e `/v1/admin/devices/telemetry-mappings`.
2. [ ] Adicionar abas de consulta em `/devices-sim` com busca, filtros, paginação e controle de acesso. Exibir identidades como texto para preservar zeros iniciais e distinguir perfis de mapeamento de substituições por dispositivo conforme a resposta da API.
3. [ ] Conferir as duas listas no navegador com registros de teste, incluindo filtros e troca de contexto. Retestar criação e replay antes de liberar ações de escrita. Registrar o estado de SYS-RES-01 e validar o vínculo ao UID da rota antes de oferecer compartilhamento. [Contrato e testes de consulta](TESTING_GUIDE.md#L29) · [Ocorrência de replay](TESTING_GUIDE.md#L826)

**Aceite.** Um operador autorizado consegue localizar identidades e mapeamentos com filtros e paginação. A homologação de escrita tem aceite próprio após o reteste da API.

### Fase 21 — Convite e primeiro acesso

1. [ ] Confirmar com o backend o escopo do INT-02, o deploy das rotas de convite e ativação e a disponibilidade do provedor de notificações no ambiente de teste.
2. [ ] Integrar o envio do convite ao administrador no detalhe da organização, conforme as permissões e o estado elegível da conta. Usar `POST /v1/admin/organizations/:uid/admins/:uid_admin/activation-invitation`.
3. [ ] Criar a tela pública de primeiro acesso para validar o token, definir a senha via `/v1/users/activation/complete` e encaminhar para o login. Tratar token inválido, expirado e já utilizado.
4. [ ] Validar com organização, administrador pendente e caixa de e-mail de teste. Conferir o recebimento, o uso único do link e o primeiro login após ativar. [Rotas e dependências de ativação](DEVELOPER_GUIDE.md#L31)

**Aceite.** Um operador autorizado envia o convite e o administrador convidado ativa a conta pelo link recebido e entra na plataforma.

### Fase 22 — Busca de endereços em Geografia

1. [ ] Obter o contrato das buscas por endereço e por coordenadas, incluindo caminhos, escopo de organização, autorização, formatos de retorno e erros. Confirmar a disponibilidade do serviço em homologação. [Pendências de Geografia](api-contracts/solicitacao-referencias-geografia.md)
2. [ ] Integrar as duas buscas à aba **Buscar endereço** em `/geografia`. Permitir selecionar um resultado e visualizar a posição no mapa existente.
3. [ ] Validar as duas direções da busca com endereços e coordenadas conhecidos. Cobrir busca vazia, ausência de resultados e serviço indisponível. Registrar separadamente o reteste do `503 geo_storage_unavailable` na criação de rotas.

**Aceite.** A pessoa consulta um endereço ou uma coordenada e visualiza o resultado no mapa da Geografia.

---

## Receita padrão por módulo (aplicar em cada fase)

Cada módulo segue o mesmo pipeline:

1. [ ] **Contrato** — mapear requests da collection → documentar payloads, query params e códigos de erro.
2. [ ] **Endpoints** — `src/lib/api/endpoints/<modulo>.js` (real) + `mock/<modulo>.js`.
3. [ ] **Tipos/validação** — schemas yup + shapes de dados.
4. [ ] **Hooks de dados** — listagem por cursor, detalhe, mutações (com idempotência).
5. [ ] **UI** — página de lista (filtros/paginação), detalhe `[uid]`, formulários de criação/edição.
6. [ ] **Gates** — aplicar `access-context` (esconder/desabilitar ações negadas; nunca assumir permissão).
7. [ ] **Navegação** — entrada no menu condicionada à área.
8. [ ] **Teste HTTP** — validar fluxo real (positivo + negativas) e registrar evidência.

---

## Convenções e cuidados transversais

- Todas as rotas autenticadas respondem `Cache-Control: no-store`; sempre `cache:'no-store'`.
- `access-context` **não concede** autorização — o backend reavalia cada ação; UI apenas orienta navegação.
- Após qualquer `PUT` completo de usuário/scope a sessão pode ser revogada (`version_sessions`): descartar Bearer e reautenticar.
- Paginação é por cursor exclusivo (`after_uid`), sem snapshot multi-página — tratar itens novos/removidos entre páginas.
- Replay idempotente: create pode retornar `200` (replay) em vez de `201`; corpo divergente com mesma chave → `409`.
- Respeitar corte organizacional (`organization_target`) nas listagens que exigem.
- ⚠️ Issues de backend conhecidas em aberto (checar antes de integrar): SYS-RES-01 (protocol-identities), SYS-GED-01 (document-contracts), histórico 503 Knowledge. Ver `frontend_integration_status.md`.
