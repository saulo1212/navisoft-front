import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid } from '../../domain/technicalOperations';

const root = '/v1/reports/schedules';
const context = organizationUid => ({ uid_organization: requireUid(organizationUid, 'organização') });
const schedule = uid => `${root}/${encodeURIComponent(requireUid(uid, 'agendamento'))}`;
export function listReportSchedules({ token, organizationUid, limit = 50, offset = 0, signal }) {
  return apiRequest(root, { token, signal, searchParams: { ...context(organizationUid), limit, offset } });
}
export function getReportSchedule({ token, organizationUid, uid, signal }) {
  return apiRequest(schedule(uid), { token, signal, searchParams: context(organizationUid) });
}
export function createReportSchedule({ token, organizationUid, body, idempotencyKey = newIdempotencyKey(), signal }) {
  return apiRequest(root, { method: 'POST', token, signal, body: { ...body, ...context(organizationUid) }, idempotencyKey });
}
export function updateReportSchedule({ token, organizationUid, uid, body, signal }) {
  return apiRequest(schedule(uid), { method: 'PUT', token, signal, body: { ...body, ...context(organizationUid) } });
}
export function setReportScheduleState({ token, organizationUid, uid, state, signal }) {
  if (!['active', 'paused'].includes(state)) throw new Error('Situação de agendamento inválida.');
  return apiRequest(`${schedule(uid)}/state`, { method: 'PUT', token, signal, body: { ...context(organizationUid), state } });
}
export function deleteReportSchedule({ token, organizationUid, uid, signal }) {
  return apiRequest(schedule(uid), { method: 'DELETE', token, signal, searchParams: context(organizationUid) });
}
