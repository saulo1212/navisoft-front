# Solicitação — Lacunas de contrato: Entidades, Endereços e Frota (Fase 4)

**Para:** responsável pela API Navisoft
**De:** time frontend (Movisat)
**Data:** 2026-11-09
**Prioridade:** alta (itens 1, 2 e 3 bloqueiam fluxos da UI de Frota/Entidades)
**Tipo:** lacunas de contrato — endpoints de listagem/descoberta ausentes **na collection exportada**
(`Insomnia_2026-11-04.json`). Vários deles podem já existir no backend (como foi o caso de
`countries`, `contacts` e `addresses` na Fase 3) — por isso o pedido é, antes de tudo, **confirmar a
rota e o formato**.

---

## Contexto

Integramos os módulos **Entidades** (`/v1/admin/entities`), **Endereços** (`/v1/admin/addresses`) e
**Frota/Assets** (`/v1/admin/assets`) ao backend real. Tudo que a collection documenta foi
implementado. Abaixo estão os pontos onde a collection **não** expõe a rota necessária, com o impacto
em cada um e o que precisamos confirmar/receber.

> ⚠️ Lição da Fase 3: `countries`, `contacts` e `addresses` "não existiam" na collection mas existiam
> no backend. Então, para cada item abaixo: **se já existe, nos mande a rota + formato exato; se não
> existe, é um pedido de criação.**

---

## 🔴 1. Listagem de participações `group-assets` (bloqueia remover asset de grupo)

A collection só tem:

```
POST   /v1/admin/assets/group-assets           (criar participação: {uid_group, uid_asset})
DELETE /v1/admin/assets/group-assets/:uid       (remover por UID da participação)
```

**Problema:** para **remover** uma participação eu preciso do `:uid` do **registro de participação**.
Esse UID só viria de uma listagem — mas ela não está na collection. O `GET /v1/admin/assets/:uid`
devolve apenas `groups: [uid_group, …]` (os UIDs dos grupos, **não** o UID da participação).

**Confirmar/expor:**

```
GET /v1/admin/assets/group-assets?filters=[{"field":"uid_organization","operator":"eq","value":"…"},
                                           {"field":"uid_asset","operator":"eq","value":"…"}]
   → { items: [{ uid, uid_group, uid_asset, uid_organization, … }], total, … }
```

(ou um `POST /v1/admin/assets/group-assets/search` equivalente.) Sem isso, a UI consegue **adicionar**
asset a um grupo, mas **não consegue removê-lo**.

---

## 🔴 2. Listagem de grupos de frota `assets/groups`

Na collection só há `POST /v1/admin/assets/groups` (criar). **Não há `GET`/list.**

O doc `frontend_04_fleet.md` afirma: *"Listas assets/units/groups/group-assets exigem filtro
estruturado `uid_organization eq`"* — ou seja, a listagem **deveria** existir. Implementamos no palpite
`GET /v1/admin/assets/groups?filters=[…]`.

**Confirmar:** qual a rota real e o formato?

```
GET  /v1/admin/assets/groups?filters=[{"field":"uid_organization","operator":"eq","value":"…"}]
# ou
POST /v1/admin/assets/groups/search   { "filters": [...], "limit", "offset" }
   → { items: [{ uid, uid_organization, name, is_default?, … }], total, … }
```

---

## 🔴 3. Como alterar a SITUAÇÃO (`uid_situations`) de entidade e asset?

- `GET /v1/admin/entities/:uid` e `GET /v1/admin/assets/:uid` **retornam** `uid_situations`.
- Mas **não achamos como gravá-la.** Os exemplos de `PUT /entities/:uid`, `PUT /assets/:uid` e
  `PATCH /assets/:uid` na collection **não** incluem `uid_situations`.
- A única rota de lifecycle na collection é **`PATCH /v1/admin/organizations/:uid/lifecycle`** — não há
  equivalente para entities/assets (embora `frontend_03`/`frontend_04` mencionem lifecycle
  `active/inactive/blocked`).

**Confirmar qual é o mecanismo:**
- (a) enviar `uid_situations` no corpo do `PUT`/`PATCH` da própria entidade/asset? ou
- (b) existe uma rota dedicada (ex.: `PATCH /v1/admin/entities/:uid/lifecycle`,
  `PATCH /v1/admin/assets/:uid/situation`) que ficou fora da collection?

Hoje a UI **exibe** a situação (resolvendo o nome via `/v1/admin/situations`), mas **não permite
trocá-la**, por não saber o contrato.

---

## 🟡 4. Catálogo de modelos / fabricantes / tipos de asset — só há GET por UID

Existem apenas:

```
GET /v1/admin/assets/models/:uid          PUT /v1/admin/assets/models/:uid          POST /v1/admin/assets/models
GET /v1/admin/assets/manufacturers/:uid   PUT /v1/admin/assets/manufacturers/:uid
GET /v1/admin/assets/types/:uid           PUT /v1/admin/assets/types/:uid           POST /v1/admin/assets/types
```

**Não há listagem/busca** de nenhum dos três. Consequência: no formulário de **criar/editar asset**
não conseguimos montar o **seletor de modelo** — hoje criamos o asset com `uid_model` nulo.

**Expor/confirmar** (mesmo padrão `?filters` ou `POST /search` dos demais):

```
GET/POST  /v1/admin/assets/models          (filtrável por uid_manufacturer, uid_type)
GET/POST  /v1/admin/assets/manufacturers   (filtrável por tipo)
GET/POST  /v1/admin/assets/types
```

> Obs.: `fuels` e `voltages` **já têm** listagem (`GET /assets/fuels?q`, `GET /assets/voltages?q`,
> `POST /assets/voltages/search`) — esses estão OK, nenhuma ação. Se o seletor de modelo depender do
> catálogo **FIPE**, indicar também a rota de listagem FIPE.

---

## 🟡 5. Endereços — listagem/edição/exclusão

A collection só traz `POST /v1/admin/addresses` (criar). Porém o documento da Fase 3
(`solicitacao-referencias-colaboradores.md`, item 5) registra que o backend confirmou:

```
GET  /v1/admin/addresses          (listar — uid/link dentro do `filters`, `q` em city)
POST /v1/admin/addresses/search   (pesquisar)
```

**Confirmar o formato exato** para endereços ligados a uma **entidade**:

```
GET /v1/admin/addresses?filters=[{"field":"link_code","operator":"eq","value":"entity"},
                                 {"field":"uid_link","operator":"eq","value":"<uid_entity>"}]
   → { items: [{ uid, link_code, uid_link, postal_code, city, region, purposes[], … }], total, … }
```

E se existem **update/delete** de endereço (`PUT`/`DELETE /v1/admin/addresses/:uid`). Hoje a UI só
**cria** endereço e exibe um aviso de que a listagem não está ligada.

---

## 🟢 6. Pontos a confirmar (não bloqueiam)

**6.1 — Exclusão de entidade e asset.** Não há `DELETE /v1/admin/entities/:uid` nem
`DELETE /v1/admin/assets/:uid` na collection, mas `frontend_03`/`frontend_04` falam em `204 delete`
(exclusão lógica). Existem? Quais as rotas e as negativas (ex.: `409` por dependência histórica)?

**6.2 — `POST /v1/admin/entities`, campo `uid_unit`.** O exemplo da collection envia
`{uid_organization, uid_unit, name}`. O `uid_unit` é **obrigatório** ou opcional? E referencia o quê?
Parece circular: a unidade da entidade é criada **depois** (`POST /v1/admin/entities/units`, que exige
`uid_entity`). Hoje criamos a entidade só com `{uid_organization, name}` — está correto?

**6.3 — Herdados da Fase 3 (ainda abertos):** listagem de `country-subdivisions` e `marital-status`
(ver `solicitacao-referencias-colaboradores.md`, item 3b). Opcionais.

---

## Resumo (TL;DR para o programador)

| # | Rota faltando / a confirmar | Impacto | Severidade |
|---|------------------------------|---------|:---:|
| 1 | `GET`/`search` de `assets/group-assets` (com `uid` da participação) | Não dá p/ **remover** asset de grupo | 🔴 |
| 2 | `GET`/`search` de `assets/groups` | Listagem de grupos (chutada hoje) | 🔴 |
| 3 | Como gravar `uid_situations` de entity/asset (PUT? rota lifecycle?) | Não dá p/ **trocar situação** | 🔴 |
| 4 | `GET`/`search` de `assets/models` / `manufacturers` / `types` (+ FIPE?) | Asset criado sem **modelo** | 🟡 |
| 5 | Formato de `GET /addresses` + update/delete | Endereços só **criam**, não listam | 🟡 |
| 6 | DELETE de entity/asset; `uid_unit` no create de entity; refs Fase 3 | Confirmações | 🟢 |

**O que já está 100% OK (nenhuma ação):** `entities` (search/get/create/update/types/units),
`entities/types`, `assets` (search/get/create/patch/put), `assets/fuels`, `assets/voltages`,
`assets/:uid/device-slots`, `assets/:uid/link_history`, `assets/groups` POST,
`assets/group-assets` POST/DELETE, `addresses` POST.
