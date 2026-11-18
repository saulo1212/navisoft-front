import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';

// Contatos (/v1/admin/contacts). O contato é sempre ancorado a um alvo via
// { link_code, uid_link } (ex.: organization + uid da org, ou entity + uid da
// entidade) e isolado por organização.
//
// Listagem: GET /v1/admin/contacts com query `filters` (array JSON) — é
// OBRIGATÓRIO exatamente um filtro `uid_organization` `eq`. `?uid_organization=`
// sozinho NÃO basta na listagem (só na consulta por UID). `q` pesquisa `name`.
// Equivalente por POST /search (mesmo corpo de filtros). Envelope offset
// { items, total, limit, offset }. limit padrão 100, máx 500.

const ROOT = '/v1/admin/contacts';

const eq = (field, value) => ({ field, operator: 'eq', value });

export async function listContacts({ token, organizationUid, q, limit = 50, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (q) filters.push({ field: 'name', operator: 'contains', value: q });
  return apiRequest(ROOT, {
    token, signal, searchParams: { filters: JSON.stringify(filters), limit, offset }
  });
}

export async function createContact({ token, body, idempotencyKey }) {
  return apiRequest(ROOT, {
    method: 'POST', token, body, idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

export async function getContact({ token, uid, organizationUid, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}`, {
    token, signal, searchParams: { uid_organization: organizationUid }
  });
}
