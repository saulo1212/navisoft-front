import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';

// Entidades (/v1/admin/entities). Uma entidade é um cadastro de negócio da
// organização (não é usuário/técnico/motorista). Sempre escopada por
// organização: a LISTAGEM é feita por POST /search com filtro estruturado
// `uid_organization eq <uuid>` (não por query arbitrária). Tipos são múltiplos e
// substituídos em bloco (PUT /types). O estado é referenciado por
// `uid_situations` (módulo Situações), não por um enum de lifecycle — a API
// desta collection não expõe rota /lifecycle.

const ROOT = '/v1/admin/entities';
const eq = (field, value) => ({ field, operator: 'eq', value });

// Listagem/pesquisa via POST /search. O hook passa { q, limit, offset };
// convertemos `q` em filtro `contains` sobre o nome.
export async function searchEntities({ token, organizationUid, q, limit = 50, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (q) filters.push({ field: 'name', operator: 'contains', value: q });
  return apiRequest(`${ROOT}/search`, { method: 'POST', token, signal, body: { filters, limit, offset } });
}

export async function getEntity({ token, entityUid, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(entityUid)}`, { token, signal });
}

// POST cria com uid_organization + name (organização imutável depois). Chave de
// idempotência obrigatória (replay devolve 200 com o mesmo UID).
export async function createEntity({ token, organizationUid, name, uidSituations, idempotencyKey }) {
  const body = { uid_organization: organizationUid, name };
  if (uidSituations) body.uid_situations = uidSituations;
  return apiRequest(ROOT, { method: 'POST', token, body, idempotencyKey: idempotencyKey ?? newIdempotencyKey() });
}

// PUT individual recebe name (e opcionais), nunca a organização.
export async function updateEntity({ token, entityUid, body }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(entityUid)}`, { method: 'PUT', token, body });
}

// PUT /{uid}/types SUBSTITUI todo o array de tipos (por UID). Nunca enviar []
// como limpeza — o backend rejeita com 422 invalid_entity_types.
export async function replaceEntityTypes({ token, entityUid, types }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(entityUid)}/types`, { method: 'PUT', token, body: { types } });
}

// --- Catálogo de tipos de entidade (org-scoped) ------------------------------
export async function searchEntityTypes({ token, organizationUid, q, limit = 100, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (q) filters.push({ field: 'name', operator: 'contains', value: q });
  return apiRequest(`${ROOT}/types/search`, { method: 'POST', token, signal, body: { filters, limit, offset } });
}

export async function createEntityType({ token, organizationUid, code, name, idempotencyKey }) {
  return apiRequest(`${ROOT}/types`, {
    method: 'POST', token, body: { uid_organization: organizationUid, code, name, active: true },
    idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// --- Unidades (pertencem à entidade) -----------------------------------------
export async function searchUnits({ token, organizationUid, entityUid, limit = 100, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (entityUid) filters.push(eq('uid_entity', entityUid));
  return apiRequest(`${ROOT}/units/search`, { method: 'POST', token, signal, body: { filters, limit, offset } });
}

export async function createUnit({ token, organizationUid, entityUid, name, idempotencyKey }) {
  return apiRequest(`${ROOT}/units`, {
    method: 'POST', token, body: { uid_organization: organizationUid, uid_entity: entityUid, name },
    idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// --- Lifecycle / exclusão -----------------------------------------------------
// Rota dedicada confirmada (Fase 4): grava o estado operacional da entidade
// (active/blocked/inactive), diferente do catálogo de `uid_situations`.
export async function patchEntityLifecycle({ token, entityUid, state, reason }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(entityUid)}/lifecycle`, { method: 'PATCH', token, body: { state, reason } });
}

// Exclusão FÍSICA (confirmado): pode devolver 409 por dependências históricas.
export async function deleteEntity({ token, entityUid }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(entityUid)}`, { method: 'DELETE', token });
}
