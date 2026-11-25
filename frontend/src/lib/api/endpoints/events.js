import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid, scopedFilters } from '../../domain/technicalOperations';

const root = '/v1/admin/events';
const context = organizationUid => ({ uid_organization: requireUid(organizationUid, 'organização') });
const resource = (name, uid) => `${root}/${name}/${encodeURIComponent(requireUid(uid, 'registro'))}`;
function list(name, { token, organizationUid, q, limit = 50, offset = 0, signal }, global = false) {
  const filters = global ? [] : scopedFilters(organizationUid);
  if (q?.trim()) filters.push({ field: 'name', operator: 'contains', value: q.trim() });
  return apiRequest(`${root}/${name}`, { token, signal, searchParams: { filters: JSON.stringify(filters), limit, offset } });
}
export const listEventModels = args => list('models', args, true);
export const listEventFields = args => list('fields', args, true);
export const listEventRules = args => list('rules', args);
export const listEventTechnicalMaps = args => list('technical-maps', args, true);
export const listEventProtocolVariants = args => list('protocol-variants', args, true);
export function getEventProtocolVariant({ token, uid, signal }) {
  return apiRequest(resource('protocol-variants', uid), { token, signal });
}
export function createEventProtocolVariant({ token, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(`${root}/protocol-variants`, { method: 'POST', token, body, idempotencyKey, signal });
}
export function getEventSignalMappings({ token, uid, signal }) {
  return apiRequest(`${resource('models', uid)}/signal-mappings`, { token, signal });
}
export function setEventSignalMappings({ token, uid, body, signal }) {
  return apiRequest(`${resource('models', uid)}/signal-mappings`, { method: 'PUT', token, signal, body });
}
export function getEventTechnicalMap({ token, uid, signal }) {
  return apiRequest(resource('technical-maps', uid), { token, signal });
}
export function saveEventTechnicalMap({ token, uid, body, idempotencyKey, signal }) {
  return apiRequest(uid ? resource('technical-maps', uid) : `${root}/technical-maps`, {
    method: uid ? 'PUT' : 'POST', token, signal, body, idempotencyKey: uid ? undefined : idempotencyKey ?? newIdempotencyKey()
  });
}
export function publishEventTechnicalMap({ token, uid, signal }) {
  return apiRequest(`${resource('technical-maps', uid)}/publish`, { method: 'POST', token, signal, body: {} });
}
export function listEventOccurrences({ token, organizationUid, status, limit = 50, offset = 0, signal }) {
  const filters = scopedFilters(organizationUid);
  if (status) filters.push({ field: 'status', operator: 'eq', value: status });
  return apiRequest(`${root}/occurrences`, { token, signal, searchParams: { filters: JSON.stringify(filters), limit, offset } });
}
export function getEventModel({ token, uid, signal }) { return apiRequest(resource('models', uid), { token, signal }); }
export function getEventRule({ token, organizationUid, uid, signal }) { return apiRequest(resource('rules', uid), { token, signal, searchParams: context(organizationUid) }); }
export function createEventRule({ token, organizationUid, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(`${root}/rules`, { method: 'POST', token, signal, body: { ...body, ...context(organizationUid) }, idempotencyKey });
}
export function updateEventRule({ token, organizationUid, uid, body, signal }) {
  return apiRequest(resource('rules', uid), { method: 'PUT', token, signal, body: { ...body, ...context(organizationUid) } });
}
export function deleteEventRule({ token, organizationUid, uid, signal }) { return apiRequest(resource('rules', uid), { method: 'DELETE', token, signal, searchParams: context(organizationUid) }); }
export function getEventOccurrence({ token, organizationUid, uid, signal }) { return apiRequest(resource('occurrences', uid), { token, signal, searchParams: context(organizationUid) }); }
export function treatEventOccurrence({ token, organizationUid, uid, body, signal }) { return apiRequest(resource('occurrences', uid), { method: 'PATCH', token, signal, body, searchParams: context(organizationUid) }); }
