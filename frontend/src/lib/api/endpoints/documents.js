import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid, scopedFilters } from '../../domain/technicalOperations';

const root = '/v1/admin';
const context = organizationUid => ({ uid_organization: requireUid(organizationUid, 'organização') });
const path = (resource, uid) => `${root}/${resource}/${encodeURIComponent(requireUid(uid, 'registro'))}`;
function list(resource, { token, organizationUid, q, limit = 50, offset = 0, signal }) {
  return apiRequest(`${root}/${resource}`, { token, signal, searchParams: { filters: JSON.stringify(scopedFilters(organizationUid, q)), limit, offset } });
}
export function getDocumentCatalogs({ token, signal }) { return apiRequest(`${root}/documents/catalogs`, { token, signal }); }
export function listDocuments({ token, organizationUid, q, limit = 50, offset = 0, signal }) { return apiRequest(`${root}/documents/search`, { method: 'POST', token, signal, body: { filters: scopedFilters(organizationUid, q, 'title'), limit, offset } }); }
export function createDocumentContract({ token, organizationUid, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${root}/document-contracts`, { method: 'POST', token, signal, body: { ...body, ...context(organizationUid) }, idempotencyKey }); }
export function createDocument({ token, organizationUid, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${root}/documents`, { method: 'POST', token, signal, body: { ...body, ...context(organizationUid) }, idempotencyKey }); }
export function getDocument({ token, organizationUid, uid, signal }) { return apiRequest(path('documents', uid), { token, signal, searchParams: context(organizationUid) }); }
export function listDocumentRevisions({ token, organizationUid, uid, signal }) { return apiRequest(`${path('documents', uid)}/revisions`, { token, signal, searchParams: context(organizationUid) }); }
export function assignDocumentClass({ token, organizationUid, uid, classUid, signal }) { return apiRequest(`${path('documents', uid)}/class`, { method: 'PUT', token, signal, body: { uid_class: classUid ? requireUid(classUid, 'classe') : null }, searchParams: context(organizationUid) }); }
export function uploadDocumentRevision({ token, organizationUid, uid, file, headers, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${path('documents', uid)}/revisions`, { method: 'POST', token, signal, rawBody: file, headers, idempotencyKey, searchParams: context(organizationUid) }); }
export async function downloadDocumentRevision({ token, organizationUid, uid, signal }) {
  const blob = await apiRequest(`${path('document-revisions', uid)}/download`, { token, signal, responseType: 'blob', searchParams: context(organizationUid) });
  if (blob.type.split(';')[0] === 'application/json') {
    const payload = JSON.parse(await blob.text());
    const url = new URL(payload.url);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('O serviço devolveu um link de download inválido.');
    return { kind: 'link', url: url.href, expires_at: payload.expires_at };
  }
  return { kind: 'blob', blob };
}
export function listDocumentDistributions({ token, organizationUid, uid, limit = 50, offset = 0, signal }) { return apiRequest(`${path('documents', uid)}/distributions`, { token, signal, searchParams: { ...context(organizationUid), limit, offset } }); }
export function createDocumentDistribution({ token, organizationUid, uid, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${path('documents', uid)}/distributions`, { method: 'POST', token, signal, body, idempotencyKey, searchParams: context(organizationUid) }); }
export function updateDocumentDistribution({ token, organizationUid, uid, body, signal }) { return apiRequest(path('document-distributions', uid), { method: 'PUT', token, signal, body, searchParams: context(organizationUid) }); }
export function revokeDocumentDistribution({ token, organizationUid, uid, signal }) { return apiRequest(path('document-distributions', uid), { method: 'DELETE', token, signal, searchParams: context(organizationUid) }); }
export const listDocumentClasses = args => list('document-classes', args);
export function getDocumentClass({ token, organizationUid, uid, signal }) { return apiRequest(path('document-classes', uid), { token, signal, searchParams: context(organizationUid) }); }
export function createDocumentClass({ token, organizationUid, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${root}/document-classes`, { method: 'POST', token, signal, body: { ...body, ...context(organizationUid) }, idempotencyKey }); }
export function updateDocumentClass({ token, organizationUid, uid, body, signal }) { return apiRequest(path('document-classes', uid), { method: 'PUT', token, signal, body, searchParams: context(organizationUid) }); }
export const listGedFunctionalGroups = args => list('users/functional-groups', args);
export function createGedFunctionalGroup({ token, organizationUid, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${root}/users/functional-groups`, { method: 'POST', token, signal, body: { ...body, ...context(organizationUid) }, idempotencyKey }); }
export function updateGedFunctionalGroup({ token, organizationUid, uid, body, signal }) { return apiRequest(path('users/functional-groups', uid), { method: 'PUT', token, signal, body, searchParams: context(organizationUid) }); }
export function listGedFunctionalMembers({ token, organizationUid, groupUid, limit = 50, offset = 0, signal }) { return apiRequest(`${root}/users/functional-group-members`, { token, signal, searchParams: { filters: JSON.stringify([...scopedFilters(organizationUid), { field: 'uid_functional_group', operator: 'eq', value: requireUid(groupUid, 'grupo funcional') }]), limit, offset } }); }
export function createGedFunctionalMember({ token, organizationUid, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${root}/users/functional-group-members`, { method: 'POST', token, signal, body: { ...body, ...context(organizationUid) }, idempotencyKey }); }
export function removeGedFunctionalMember({ token, organizationUid, uid, signal }) { return apiRequest(path('users/functional-group-members', uid), { method: 'DELETE', token, signal, searchParams: context(organizationUid) }); }
