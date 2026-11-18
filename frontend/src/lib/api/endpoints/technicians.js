import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { scopedFilters } from '../../domain/technicalOperations';

const ROOT = '/v1/admin/entities';
const technicianPath = uid => `${ROOT}/technicians/${encodeURIComponent(uid)}`;
export function listTechnicians({ token, organizationUid, q, limit = 50, offset = 0, signal }) {
  return apiRequest(`${ROOT}/technicians/search`, { method: 'POST', token, signal, body: { filters: scopedFilters(organizationUid, q), limit, offset } });
}
export function getTechnician({ token, technicianUid, signal }) {
  return apiRequest(technicianPath(technicianUid), { token, signal });
}
export function listTechnicianCapabilities({ token, signal }) {
  return apiRequest(`${ROOT}/technician-capabilities`, { token, signal });
}
export function createTechnician({ token, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(`${ROOT}/technicians`, { method: 'POST', token, body, idempotencyKey, signal });
}
export function patchTechnician({ token, technicianUid, body, signal }) {
  return apiRequest(technicianPath(technicianUid), { method: 'PATCH', token, body, signal });
}
export function replaceCapabilities({ token, technicianUid, codes, signal }) {
  return patchTechnician({ token, technicianUid, body: { capabilities: codes }, signal });
}
export function getTechnicianPrices({ token, technicianUid, signal }) {
  return apiRequest(`${technicianPath(technicianUid)}/prices`, { token, signal });
}
export function replaceTechnicianPrices({ token, technicianUid, body, signal }) {
  return apiRequest(`${technicianPath(technicianUid)}/prices`, { method: 'PUT', token, body, signal });
}
export function getTechnicianUser({ token, technicianUid, signal }) {
  return apiRequest(`${technicianPath(technicianUid)}/user-account`, { token, signal });
}
export function linkTechnicianUser({ token, technicianUid, userUid, signal }) {
  return apiRequest(`${technicianPath(technicianUid)}/user-account`, { method: 'PUT', token, body: { uid_user: userUid || null }, signal });
}
