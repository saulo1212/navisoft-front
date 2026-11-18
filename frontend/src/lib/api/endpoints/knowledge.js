import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid } from '../../domain/technicalOperations';

const root = '/v1/admin/knowledge';
const itemPath = uid => `${root}/items/${encodeURIComponent(requireUid(uid, 'artigo'))}`;
const revisionPath = uid => `${root}/revisions/${encodeURIComponent(requireUid(uid, 'revisão'))}`;
function slugPart(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Informe um identificador de artigo válido, com letras minúsculas, números e hífens.');
  return encodeURIComponent(slug);
}
export function listKnowledgeItems({ token, q = '', limit = 20, offset = 0, signal }) {
  return apiRequest(`${root}/items/search`, { method: 'POST', token, signal, body: { q, limit, offset } });
}
export function listKnowledgeCategories({ token, limit = 50, offset = 0, signal }) { return apiRequest(`${root}/categories`, { token, signal, searchParams: { limit, offset } }); }
export function createKnowledgeItem({ token, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${root}/items`, { method: 'POST', token, body, signal, idempotencyKey }); }
export function getKnowledgeItem({ token, uid, signal }) { return apiRequest(itemPath(uid), { token, signal }); }
export function listKnowledgeRevisions({ token, uid, limit = 20, offset = 0, signal }) { return apiRequest(`${itemPath(uid)}/revisions`, { token, signal, searchParams: { limit, offset } }); }
export function getKnowledgeRevision({ token, uid, signal }) { return apiRequest(revisionPath(uid), { token, signal }); }
export function createKnowledgeRevision({ token, uid, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${itemPath(uid)}/revisions`, { method: 'POST', token, body, signal, idempotencyKey }); }
export function publishKnowledgeItem({ token, uid, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${itemPath(uid)}/publish`, { method: 'POST', token, body, signal, idempotencyKey }); }
export function archiveKnowledgeItem({ token, uid, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${itemPath(uid)}/archive`, { method: 'POST', token, signal, idempotencyKey }); }
export function replaceKnowledgeGrants({ token, uid, body, signal }) { return apiRequest(`${itemPath(uid)}/grants`, { method: 'PUT', token, body, signal }); }
export function replaceKnowledgeAttachments({ token, uid, body, signal }) { return apiRequest(`${revisionPath(uid)}/attachments`, { method: 'PUT', token, body, signal }); }
export function listPublicKnowledge({ q = '', limit = 20, offset = 0, signal }) { return apiRequest('/v1/public/knowledge/items', { signal, searchParams: { q, limit, offset } }); }
export function getPublicKnowledge({ slug, signal }) { return apiRequest(`/v1/public/knowledge/items/${slugPart(slug)}`, { signal }); }
export function listReadableKnowledge({ token, organizationUid, q = '', limit = 20, offset = 0, signal }) { return apiRequest('/v1/knowledge/items', { token, signal, searchParams: { uid_organization: requireUid(organizationUid, 'organização'), q, limit, offset } }); }
export function getReadableKnowledge({ token, organizationUid, slug, signal }) { return apiRequest(`/v1/knowledge/items/${slugPart(slug)}`, { token, signal, searchParams: { uid_organization: requireUid(organizationUid, 'organização') } }); }
export function downloadKnowledgeAttachment({ token, organizationUid, slug, uid, publicAccess = false, signal }) {
  const path = `/v1/${publicAccess ? 'public/knowledge' : 'knowledge'}/items/${slugPart(slug)}/attachments/${encodeURIComponent(requireUid(uid, 'anexo'))}`;
  return apiRequest(path, { ...(publicAccess ? {} : { token, searchParams: { uid_organization: requireUid(organizationUid, 'organização') } }), signal, responseType: 'blob' });
}
