import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';

// Colaboradores (/v1/admin/collaborators). O recurso é sempre escopado por
// organização: a maioria das rotas exige `uid_organization` (query ou body) e o
// backend reavalia a visibilidade cross-tenant. A listagem é feita por POST
// /search (filtros estruturados), não por GET. Vínculo colaborador ↔ usuário ↔
// organização: o colaborador pertence a uma organização e é conectado às pessoas
// via engagements/assignments; o usuário de login é administrado em `users.js`.

const ROOT = '/v1/admin/collaborators';

// Monta um filtro { field, operator, value } no formato aceito pelo /search.
const eq = (field, value) => ({ field, operator: 'eq', value });

// As rotas GET de LISTAGEM (positions, organization-units, assignments,
// work-modes) escopam por organização via query `filters` = array JSON
// codificado — NÃO via `uid_organization`. (POST/PATCH e GET por UID usam
// `uid_organization` direto.) Devolve a string JSON pronta p/ query string.
const orgFilters = uid => JSON.stringify([eq('uid_organization', uid)]);

// Listagem via POST /search. O hook de paginação passa { q, limit, offset };
// convertemos `q` em filtro `contains` sobre o nome preferencial.
export async function searchCollaborators({ token, organizationUid, q, limit = 50, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (q) filters.push({ field: 'preferred_name', operator: 'contains', value: q });
  return apiRequest(`${ROOT}/search`, { method: 'POST', token, signal, body: { filters, limit, offset } });
}

export async function getCollaborator({ token, uid, organizationUid, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}`, {
    token, signal, searchParams: { uid_organization: organizationUid }
  });
}

export async function createCollaborator({ token, body, idempotencyKey }) {
  return apiRequest(ROOT, {
    method: 'POST', token, body, idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// PUT completo (legal_name, preferred_name, birth_date, uid_birth_country,
// uid_marital_status, active).
export async function updateCollaborator({ token, uid, organizationUid, body }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}`, {
    method: 'PUT', token, body, searchParams: { uid_organization: organizationUid }
  });
}

// PATCH parcial — usado para ativar/desativar ({ active }).
export async function patchCollaborator({ token, uid, organizationUid, body }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}`, {
    method: 'PATCH', token, body, searchParams: { uid_organization: organizationUid }
  });
}

// --- Engagements (vínculos de trabalho do colaborador) -----------------------
export async function searchEngagements({ token, uid, organizationUid, limit = 100, offset = 0, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}/engagements/search`, {
    method: 'POST', token, signal,
    body: { filters: [eq('uid_organization', organizationUid)], limit, offset }
  });
}

export async function createEngagement({ token, uid, body, idempotencyKey }) {
  // POST exige Idempotency-Key (400 idempotency_key_required sem ela) e o body
  // exige uid_country (422 invalid_engagement sem ele).
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}/engagements`, {
    method: 'POST', token, body, idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

export async function endEngagement({ token, uid, engagementUid, organizationUid, endedOn }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}/engagements/${encodeURIComponent(engagementUid)}`, {
    method: 'PATCH', token, body: { ended_on: endedOn }, searchParams: { uid_organization: organizationUid }
  });
}

// --- Assignments (lotação: posição + unidade organizacional) -----------------
export async function listAssignments({ token, uid, organizationUid, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}/assignments`, {
    token, signal, searchParams: { filters: orgFilters(organizationUid) }
  });
}

export async function createAssignment({ token, uid, organizationUid, body, idempotencyKey }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}/assignments`, {
    method: 'POST', token, body, searchParams: { uid_organization: organizationUid },
    idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// --- Tabelas de referência (para preencher os formulários) -------------------
export async function listEngagementTypes({ token, signal }) {
  return apiRequest(`${ROOT}/engagement-types`, { token, signal });
}

export async function listPositions({ token, organizationUid, signal }) {
  return apiRequest(`${ROOT}/positions`, { token, signal, searchParams: { filters: orgFilters(organizationUid) } });
}

export async function createPosition({ token, organizationUid, body, idempotencyKey }) {
  return apiRequest(`${ROOT}/positions`, {
    method: 'POST', token, body, searchParams: { uid_organization: organizationUid },
    idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

export async function listOrganizationUnits({ token, organizationUid, signal }) {
  return apiRequest(`${ROOT}/organization-units`, { token, signal, searchParams: { filters: orgFilters(organizationUid) } });
}

// Catálogo GLOBAL de países (não escopado por organização). Fonte do uid_country
// exigido na criação de engagement. Rota mantida pelo backend por compatibilidade
// sob /drivers; envelope offset `{ items, total, limit, offset }`. 249 países no
// catálogo — limit alto para trazer todos de uma vez (o select filtra por nome).
export async function listCountries({ token, limit = 300, offset = 0, signal }) {
  return apiRequest('/v1/admin/drivers/countries', { token, signal, searchParams: { limit, offset } });
}
