import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid, scopedFilters } from '../../domain/technicalOperations';

const root = '/v1/admin/agenda';
const context = organizationUid => ({ uid_organization: requireUid(organizationUid, 'organização') });
const entry = uid => `${root}/entries/${encodeURIComponent(requireUid(uid, 'registro'))}`;
export function listAgenda({ token, organizationUid, q, limit = 50, offset = 0, signal }) {
  return apiRequest(`${root}/entries/search`, { method: 'POST', token, signal, body: { filters: scopedFilters(organizationUid, q, 'title'), limit, offset } });
}
export function getAgendaEntry({ token, organizationUid, uid, signal }) {
  return apiRequest(entry(uid), { token, signal, searchParams: context(organizationUid) });
}
export function patchAgendaControls({ token, organizationUid, uid, body, signal }) {
  return apiRequest(`${entry(uid)}/controls`, { method: 'PATCH', token, signal, body, searchParams: context(organizationUid) });
}
export function listAgendaAnalyses({ token, organizationUid, uid, limit = 20, offset = 0, signal }) {
  return apiRequest(`${entry(uid)}/analyses`, { token, signal, searchParams: { ...context(organizationUid), limit, offset } });
}
export function createAgendaAnalysis({ token, organizationUid, uid, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(`${entry(uid)}/analyses`, { method: 'POST', token, signal, body, idempotencyKey, searchParams: context(organizationUid) });
}
export function getAgendaSettings({ token, organizationUid, signal }) {
  return apiRequest(`${root}/settings`, { token, signal, searchParams: context(organizationUid) });
}
export function patchAgendaSettings({ token, organizationUid, body, signal }) {
  return apiRequest(`${root}/settings`, { method: 'PATCH', token, body, signal, searchParams: context(organizationUid) });
}
