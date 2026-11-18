import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid } from '../../domain/technicalOperations';

const root = '/v1/admin/notifications';
const context = organizationUid => ({ uid_organization: requireUid(organizationUid, 'organização') });
const recipient = uid => `${root}/recipients/${encodeURIComponent(requireUid(uid, 'destinatário'))}`;
export function listNotificationRecipients({ token, organizationUid, limit = 50, offset = 0, signal }) {
  return apiRequest(`${root}/recipients`, { token, signal, searchParams: { ...context(organizationUid), limit, offset } });
}
export function getNotificationRecipient({ token, organizationUid, uid, signal }) { return apiRequest(recipient(uid), { token, signal, searchParams: context(organizationUid) }); }
export function createNotificationRecipient({ token, organizationUid, body, idempotencyKey = newIdempotencyKey(), signal }) { return apiRequest(`${root}/recipients`, { method: 'POST', token, signal, body, idempotencyKey, searchParams: context(organizationUid) }); }
export function updateNotificationRecipient({ token, organizationUid, uid, body, signal }) { return apiRequest(recipient(uid), { method: 'PUT', token, signal, body, searchParams: context(organizationUid) }); }
export function deleteNotificationRecipient({ token, organizationUid, uid, signal }) { return apiRequest(recipient(uid), { method: 'DELETE', token, signal, searchParams: context(organizationUid) }); }
export function listNotificationHooks({ token, organizationUid, limit = 50, offset = 0, signal }) { return apiRequest(`${root}/hooks`, { token, signal, searchParams: { ...context(organizationUid), limit, offset } }); }
function hookPath(code) { if (code !== 'organizations.insert') throw new Error('Hook sem contrato de edição disponível.'); return `${root}/hooks/${encodeURIComponent(code)}`; }
export function getNotificationHook({ token, organizationUid, code, signal }) { return apiRequest(hookPath(code), { token, signal, searchParams: context(organizationUid) }); }
export function updateNotificationHook({ token, organizationUid, code, body, signal }) { return apiRequest(hookPath(code), { method: 'PUT', token, signal, body, searchParams: context(organizationUid) }); }
export function getNotificationDelivery({ token, organizationUid, uid, signal }) { return apiRequest(`${root}/deliveries/${encodeURIComponent(requireUid(uid, 'entrega'))}/status`, { token, signal, searchParams: context(organizationUid) }); }
export function getNotifyIntegrationStatus({ token, organizationUid, signal }) { return apiRequest(`/v1/admin/organizations/${encodeURIComponent(requireUid(organizationUid, 'organização'))}/integration-tokens/autoscale-notifications`, { token, signal }); }
