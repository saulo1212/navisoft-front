import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid, scopedFilters } from '../../domain/technicalOperations';

const groups = '/v1/admin/checklist-groups';
const templates = '/v1/admin/checklists';
const runs = '/v1/checklists/runs';
function context(organizationUid) { return { uid_organization: requireUid(organizationUid, 'organização') }; }
function search(root, { token, organizationUid, q, limit = 50, offset = 0, signal }) {
  return apiRequest(`${root}/search`, { method: 'POST', token, signal, body: { filters: scopedFilters(organizationUid, q), limit, offset } });
}
export const listChecklistGroups = args => search(groups, args);
export const listChecklists = args => search(templates, args);
export function getChecklistGroup({ token, organizationUid, uid, signal }) {
  return apiRequest(`${groups}/${encodeURIComponent(requireUid(uid, 'grupo'))}`, { token, signal, searchParams: context(organizationUid) });
}
export function createChecklistGroup({ token, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(groups, { method: 'POST', token, body, idempotencyKey, signal });
}
export function patchChecklistGroup({ token, organizationUid, uid, body, signal }) {
  return apiRequest(`${groups}/${encodeURIComponent(requireUid(uid, 'grupo'))}`, { method: 'PATCH', token, body, signal, searchParams: context(organizationUid) });
}
export function getChecklist({ token, organizationUid, uid, signal }) {
  return apiRequest(`${templates}/${encodeURIComponent(requireUid(uid, 'checklist'))}`, { token, signal, searchParams: context(organizationUid) });
}
export function createChecklist({ token, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(templates, { method: 'POST', token, body, idempotencyKey, signal });
}
export function patchChecklist({ token, organizationUid, uid, body, signal }) {
  // Unlike groups, template PATCH saves the full aggregate. The live API also
  // requires organization in its body, even when it is present in the query.
  return apiRequest(`${templates}/${encodeURIComponent(requireUid(uid, 'checklist'))}`, { method: 'PATCH', token, body: { ...body, uid_organization: requireUid(organizationUid, 'organização') }, signal, searchParams: context(organizationUid) });
}
export function publishChecklist({ token, organizationUid, uid, signal }) {
  return apiRequest(`${templates}/${encodeURIComponent(requireUid(uid, 'checklist'))}/publish`, { method: 'POST', token, signal, searchParams: context(organizationUid) });
}
export function createChecklistRun({ token, driverUid, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(runs, { method: 'POST', token, body: { uid_driver: requireUid(driverUid, 'motorista') }, idempotencyKey, signal });
}
export function getChecklistRun({ token, organizationUid, uid, signal }) {
  return apiRequest(`${runs}/${encodeURIComponent(requireUid(uid, 'execução'))}`, { token, signal, searchParams: context(organizationUid) });
}
export function updateChecklistRun({ token, organizationUid, uid, body, signal }) {
  return apiRequest(`${runs}/${encodeURIComponent(requireUid(uid, 'execução'))}`, { method: 'PUT', token, body, signal, searchParams: context(organizationUid) });
}
