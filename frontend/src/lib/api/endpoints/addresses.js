import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';

// Endereços (/v1/admin/addresses) — recurso polimórfico ligado por
// `link_code` + `uid_link` (ex.: "entity"/"organization" + UID do alvo).
// Confirmado pelo backend (Fase 4): listagem via GET/`filters` (array JSON) ou
// POST /search, exigindo exatamente um filtro `uid_organization eq`; o recurso
// individual (GET/PATCH/DELETE) exige `?uid_organization=` na query. PATCH
// preserva campos e `purposes` omitidos; DELETE é lógico.

const ROOT = '/v1/admin/addresses';
const eq = (field, value) => ({ field, operator: 'eq', value });
const filtersQuery = arr => JSON.stringify(arr);

export async function createAddress({ token, body, idempotencyKey }) {
  return apiRequest(ROOT, { method: 'POST', token, body, idempotencyKey: idempotencyKey ?? newIdempotencyKey() });
}

export async function listAddresses({ token, organizationUid, linkCode, linkUid, limit = 100, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (linkCode) filters.push(eq('link_code', linkCode));
  if (linkUid) filters.push(eq('uid_link', linkUid));
  return apiRequest(ROOT, { token, signal, searchParams: { filters: filtersQuery(filters), limit, offset } });
}

export async function getAddress({ token, addressUid, organizationUid, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(addressUid)}`, { token, signal, searchParams: { uid_organization: organizationUid } });
}

// PATCH parcial — campos e `purposes` omitidos são preservados pelo backend.
export async function patchAddress({ token, addressUid, organizationUid, body }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(addressUid)}`, {
    method: 'PATCH', token, body, searchParams: { uid_organization: organizationUid }
  });
}

// Exclusão lógica.
export async function deleteAddress({ token, addressUid, organizationUid }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(addressUid)}`, {
    method: 'DELETE', token, searchParams: { uid_organization: organizationUid }
  });
}
