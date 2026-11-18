# Camada de API — receita de módulo

Fundação para consumir a API Navisoft. Cada módulo de negócio segue a mesma receita.

## Peças da fundação

| Arquivo | Responsabilidade |
|---|---|
| `config.js` | Base URL, `application`, limites de paginação. |
| `http.js` | `apiRequest` (fetch, Bearer, `no-store`, Idempotency-Key, 401 global) + `normalizeList`. |
| `errors.js` | `ApiError` (status, code, `category`, `isReloginRequired`) + `errorMessage()` em PT. |
| `idempotency.js` | `newIdempotencyKey()`. |
| `resource.js` | `createResourceApi()` — gera list/get/create/update/patch/remove. |
| `../ui/toast.js` | `notifySuccess` / `notifyError(ApiError)` etc. |
| `../../hooks/usePagedList.js` | **Padrão de listagem**: páginas numeradas (offset/limit). Fatia no cliente se o endpoint ignorar paginação. |
| `../../hooks/useOffsetList.js` | Listagem "carregar mais" (acumula páginas) — para scroll infinito. |
| `../../hooks/useCursorList.js` | Listagem por cursor (`/v1/users/me/organizations`). |
| `../../components/admin/Pagination.jsx` | Controle de páginas numeradas (usado pelo `DataTable` via prop `pagination`). |

## Paginação

Padrão das listagens admin: **`usePagedList`** (páginas numeradas via `DataTable`
prop `pagination`). Envelopes suportados por `normalizeList`:

- **Admin** (`/v1/admin/*`): `{ items, total, limit, offset, elapsed_ms }` → query `limit`/`offset`.
- **Access-context** (`/v1/users/me/organizations`): `{ items, has_more, next_after_uid }` → `useCursorList`.

`normalizeList(payload)` devolve `{ items, total, limit, offset, nextAfterUid, hasMore, mode }`.

> **Nota:** alguns endpoints (ex.: `/v1/admin/organizations`) **ignoram `limit`/`offset`**
> e retornam o conjunto inteiro com `total`. `usePagedList` detecta isso (itens > pageSize)
> e **fatia no cliente**, mantendo a MESMA UX; passa a paginar no servidor assim que o
> backend respeitar os parâmetros, sem mudar o front.

## Receita de um módulo novo (ex.: `simcards`)

1. **Endpoints** — `endpoints/<modulo>.js`:
   ```js
   import { createResourceApi } from '../resource';
   export const simcardsApi = createResourceApi({ basePath: '/v1/admin/simcards' });
   ```
2. **Hook de lista** — na página: `useOffsetList(({ token, limit, offset, q, signal }) => simcardsApi.list({ token, limit, offset, q, uid_organization, signal }))`.
3. **Mutações** — `simcardsApi.create({ token, body, uid_organization })` (Idempotency-Key automática); em retentativa, reusar a mesma `idempotencyKey`.
4. **Erros** — em `catch`, `notifyError(err)`; a UI nunca assume sucesso.
5. **Gates** — esconder/desabilitar ações conforme `access-context`; o backend revalida.

## Scoping por organização

A maioria dos endpoints admin exige `uid_organization` na query. Passar como parâmetro extra em qualquer chamada — ele vira query string automaticamente.
