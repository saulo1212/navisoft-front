import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';

export const SCOPE_LEVELS = ['global', 'organization', 'entity', 'asset'];

function listResource(resource, { token, organizationUid, scopeLevel = 'organization', q, offset = 0, limit = 50, signal }) {
  if (!SCOPE_LEVELS.includes(scopeLevel)) throw new Error('Selecione um escopo válido.');
  if (scopeLevel !== 'global' && !organizationUid) throw new Error('Selecione uma organização para consultar este escopo.');
  const filters = [{ field: 'scope_level', operator: 'eq', value: scopeLevel }];
  if (scopeLevel !== 'global') filters.push({ field: 'uid_organization', operator: 'eq', value: organizationUid });
  if (q?.trim()) filters.push({ field: 'name', operator: 'contains', value: q.trim() });
  return apiRequest(`/v1/admin/geo/${resource}`, {
    token, signal, searchParams: { filters: JSON.stringify(filters), limit, offset }
  });
}

export const listPoints = args => listResource('points', args);
export const listFences = args => listResource('geofences', args);
export const listRoutes = args => listResource('routes', args);
export const getPoint = ({ token, uid, signal }) => apiRequest(`/v1/admin/geo/points/${encodeURIComponent(uid)}`, { token, signal });
export const getFence = ({ token, uid, signal }) => apiRequest(`/v1/admin/geo/geofences/${encodeURIComponent(uid)}`, { token, signal });
export const getRoute = ({ token, uid, signal }) => apiRequest(`/v1/admin/geo/routes/${encodeURIComponent(uid)}`, { token, signal });
export function createPoint({ token, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest('/v1/admin/geo/points', { method: 'POST', token, body, idempotencyKey, signal });
}
export function updatePoint({ token, uid, body, idempotencyKey, signal }) {
  return apiRequest(`/v1/admin/geo/points/${encodeURIComponent(uid)}`, { method: 'PUT', token, body, idempotencyKey, signal });
}
export function deletePoint({ token, uid, signal }) {
  return apiRequest(`/v1/admin/geo/points/${encodeURIComponent(uid)}`, { method: 'DELETE', token, signal });
}

function mutations(resource) {
  const path = `/v1/admin/geo/${resource}`;
  return {
    create: ({ token, body, idempotencyKey = newIdempotencyKey(), signal }) => apiRequest(path, { method: 'POST', token, body, idempotencyKey, signal }),
    update: ({ token, uid, body, signal }) => apiRequest(`${path}/${encodeURIComponent(uid)}`, { method: 'PUT', token, body, signal }),
    remove: ({ token, uid, signal }) => apiRequest(`${path}/${encodeURIComponent(uid)}`, { method: 'DELETE', token, signal }),
    search: ({ token, body, signal }) => apiRequest(`${path}/search`, { method: 'POST', token, body, signal })
  };
}
export const { create: createFence, update: updateFence, remove: deleteFence, search: searchFences } = mutations('geofences');
export const { create: createRoute, update: updateRoute, remove: deleteRoute, search: searchRoutes } = mutations('routes');
export const { search: searchPoints } = mutations('points');
