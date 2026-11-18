# Retorno — a collection nova não cobriu o que a gente pediu

**Para:** responsável pela API Navisoft
**De:** time frontend (Movisat)
**Data:** 2026-11-10
**Referente a:** `solicitacao-referencias-entidades-frota.md` (2026-11-09)

---

Oi! Conferi a `Insomnia_2026-11-10.json` endpoint por endpoint contra os 6 pontos que levantamos.
Valeu por mandar — resolveu 2 dos 6, mas os 4 que mais importam (os que travam a UI hoje) continuam
sem a rota que precisamos. Deixo abaixo o que já tá OK, o que falta, e minha opinião sobre se cada
rota **deveria existir** ou não — pra agilizar sua decisão.

---

## ✅ Isso aqui já resolveu

**Endereços (item 5).** Achei `GET /v1/admin/addresses?filters=[...]` e
`PATCH /v1/admin/addresses/:uid`. Funciona, só que o filtro usa `uid_organization` em vez de
`link_code`/`uid_link` como a gente tinha sugerido — vamos ajustar a UI pra esse formato, sem
problema. Falta só confirmar se tem `DELETE /addresses/:uid` (não vi na collection).

**Subdivisões/estado civil (item 6.3).** `GET` e `POST /search` pros dois, com paginação e busca.
Ótimo, nenhuma ação necessária.

---

## ❌ Isso aqui ainda não veio — e minha opinião sobre cada um

### 1. Listar `group-assets` — **deveria existir, sim**
A collection só tem `POST` (criar) e `DELETE /:uid`. O problema é que esse `:uid` do `DELETE` só
existe nos seus testes porque vocês anotaram ele manualmente na hora de criar. Na vida real, a UI
não tem como saber o UID de uma participação asset↔grupo sem uma listagem — e sem isso,
literalmente não dá pra remover um asset de um grupo pela tela. Isso não é um "nice to have", é o
caminho inverso de uma operação que já existe (criar participação). Faz sentido ter o `GET`/`search`
espelhando o `POST`.

### 2. Listar `assets/groups` — **deveria existir, sim**
Mesma lógica: só tem `POST`. Pra UI mostrar "a quais grupos esse asset pertence" ou popular um
seletor de grupo, precisa de listagem. Hoje estamos chutando a rota (`GET .../groups?filters=...`)
sem confirmação — então mesmo que já exista no backend, precisamos saber o formato certo.

### 3. Trocar a situação (`uid_situations`) de entity/asset — **precisa existir, e é o mais urgente**
Isso aqui foi mal-entendido na collection nova: vocês mandaram o CRUD do **catálogo** de situações
(`/v1/admin/situations` — criar/editar/listar os *tipos* de situação, tipo "ativo", "bloqueado").
Isso não é o que pedimos. A pergunta é outra: **dado um asset ou entity específico, como eu mudo a
situação dele?** Hoje a tela só mostra a situação (lendo o catálogo), mas não tem como eu, usuário,
clicar em "bloquear esse asset" e isso ser salvo. Isso é uma lacuna de produto, não só de API —
sem essa rota, o fluxo de bloqueio/reativação de ativo não existe na prática. Precisa de uma rota
dedicada (`PATCH /entities/:uid/lifecycle` ou aceitar `uid_situations` no `PUT` do próprio recurso).

### 4. Listar `assets/models` / `manufacturers` / `types` — **deveria existir, sim**
A collection trouxe só `GET`/`PUT` por UID único e `POST` pra criar — nada de listagem. O que veio
de novo (`/v1/admin/integrations/fipe/sync` e `/fipe/jobs`) é outra coisa: é o job que sincroniza o
catálogo FIPE pro banco de vocês, não uma rota pra eu buscar/filtrar modelos pra popular um combobox
na tela de criar asset. Continua sem como montar esse seletor — hoje a gente cria o asset com
`uid_model` nulo porque não tem outra opção.

### 6.1. `DELETE` de entity/asset — **precisa de confirmação, não necessariamente criação**
Diferente dos itens acima, aqui eu não tenho certeza se deveria existir — depende de como vocês
decidiram tratar exclusão lógica no backend. Se `frontend_03`/`frontend_04` já falam em "204
delete", é provável que já exista e só não esteja na collection. Então esse é mais um "nos mande a
rota" do que um "crie a rota".

---

## Pedido direto

Pra desbloquear a UI, nessa ordem de prioridade:

1. 🔴 `GET`/`search` de `assets/group-assets` (retornando o `uid` da participação)
2. 🔴 `GET`/`search` de `assets/groups`
3. 🔴 Rota para alterar `uid_situations` de `entities`/`assets` (não o catálogo)
4. 🟡 `GET`/`search` de `assets/models`, `assets/manufacturers`, `assets/types`
5. 🟢 Confirmar `DELETE /addresses/:uid`
6. 🟢 Confirmar `DELETE` de `entities`/`assets`
