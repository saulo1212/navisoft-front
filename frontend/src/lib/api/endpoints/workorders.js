import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { executorProjection, scopedFilters } from '../../domain/technicalOperations';

const root = selfService => selfService ? '/v1/technician/work-orders' : '/v1/admin/devices/work-orders';
const project = (response, selfService) => selfService ? executorProjection(response) : response;
export async function listWorkOrders({ token, organizationUid, q, state = 'pending', limit = 50, offset = 0, signal, selfService = false }) {
  const filters = selfService ? [] : scopedFilters(organizationUid);
  if (q?.trim()) filters.push({ field: 'description', operator: 'contains', value: q.trim() });
  return project(await apiRequest(`${root(selfService)}/search`, { method: 'POST', token, signal, body: { state, filters, limit, offset } }), selfService);
}
export async function getWorkOrder({ token, workOrderUid, signal, selfService = false }) {
  return project(await apiRequest(`${root(selfService)}/${encodeURIComponent(workOrderUid)}`, { token, signal }), selfService);
}
export function createWorkOrder({ token, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(root(false), { method: 'POST', token, body, idempotencyKey, signal });
}
export function dispatchWorkOrder({ token, workOrderUid, body, signal }) {
  return apiRequest(`${root(false)}/${encodeURIComponent(workOrderUid)}/dispatch`, { method: 'POST', token, body, signal });
}
export async function startWorkOrder({ token, workOrderUid, signal, selfService = false }) {
  return project(await apiRequest(`${root(selfService)}/${encodeURIComponent(workOrderUid)}/start`, { method: 'POST', token, body: {}, signal }), selfService);
}
export async function completeWorkOrder({ token, workOrderUid, body, idempotencyKey = newIdempotencyKey(), signal, selfService = false }) {
  return project(await apiRequest(`${root(selfService)}/${encodeURIComponent(workOrderUid)}/complete`, { method: 'POST', token, body, idempotencyKey, signal }), selfService);
}
const custodyRoot = selfService => selfService ? '/v1/technician/custody' : '/v1/admin/devices/custody';
export async function listCustody({ token, organizationUid, limit = 50, offset = 0, signal, selfService = false }) {
  return project(await apiRequest(custodyRoot(selfService), { token, signal, searchParams: { limit, offset, ...(selfService ? {} : { filters: JSON.stringify(scopedFilters(organizationUid)) }) } }), selfService);
}
export function confirmCustody({ token, custodyUid, signal, selfService = false }) {
  return apiRequest(`${custodyRoot(selfService)}/${encodeURIComponent(custodyUid)}/confirm-receipt`, { method: 'POST', token, body: {}, signal });
}
export function declareReturn({ token, custodyUid, body, signal }) {
  return apiRequest(`${custodyRoot(false)}/${encodeURIComponent(custodyUid)}/declare-return`, { method: 'POST', token, body, signal });
}
export function receiveReturn({ token, custodyUid, signal }) {
  return apiRequest(`${custodyRoot(false)}/${encodeURIComponent(custodyUid)}/receive`, { method: 'POST', token, body: {}, signal });
}
