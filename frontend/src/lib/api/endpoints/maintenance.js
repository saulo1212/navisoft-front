import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { scopedFilters } from '../../domain/technicalOperations';

const ROOT = '/v1/admin/maintenance';
export function listMaintenance({ token, organizationUid, q, limit = 50, offset = 0, signal }) {
  return apiRequest(`${ROOT}/orders/search`, { method: 'POST', token, signal, body: { filters: scopedFilters(organizationUid, q, 'description'), limit, offset } });
}
export function getMaintenance({ token, organizationUid, uid, signal }) {
  return apiRequest(`${ROOT}/orders/${encodeURIComponent(uid)}`, { token, signal, searchParams: { uid_organization: organizationUid } });
}
export function createMaintenance({ token, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(`${ROOT}/orders`, { method: 'POST', token, body, idempotencyKey, signal });
}
export function patchMaintenance({ token, organizationUid, uid, body, signal }) {
  return apiRequest(`${ROOT}/orders/${encodeURIComponent(uid)}`, { method: 'PATCH', token, body, signal, searchParams: { uid_organization: organizationUid } });
}
export function transitionMaintenance({ token, organizationUid, uid, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(`${ROOT}/orders/${encodeURIComponent(uid)}/transition`, { method: 'POST', token, body, idempotencyKey, signal, searchParams: { uid_organization: organizationUid } });
}
export function getMaintenanceAssetStatus({ token, organizationUid, assetUid, signal }) {
  return apiRequest(`${ROOT}/assets/${encodeURIComponent(assetUid)}/status`, { token, signal, searchParams: { uid_organization: organizationUid } });
}
