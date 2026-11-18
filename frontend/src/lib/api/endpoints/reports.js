import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid } from '../../domain/technicalOperations';
import { reportDomains } from '../../domain/reports';

const root = '/v1/reports';
const domainPath = domain => {
  if (!Object.hasOwn(reportDomains, domain)) throw new Error('Domínio de relatório inválido.');
  return `${root}/${domain}`;
};
const reportPath = uid => `${root}/${requireUid(uid, 'relatório')}`;
const context = organizationUid => organizationUid ? { uid_organization: requireUid(organizationUid, 'organização') } : {};

export function getReportDefinition({ token, signal, domain }) {
  return apiRequest(`${domainPath(domain)}/definition`, { token, signal });
}

export function searchReport({ token, signal, domain, organizationUid, definition, selection, limit, offset }) {
  const scope = domain === 'assets' ? context(requireUid(organizationUid, 'organização')) : {};
  return apiRequest(`${domainPath(domain)}/search`, {
    method: 'POST', token, signal,
    body: { ...selection, ...scope, report_code: definition.report_code, report_version: definition.report_version, limit, offset }
  });
}

export function searchReportHistory({ token, signal, q = '', limit, offset, organizationUid }) {
  return apiRequest(`${root}/search`, {
    method: 'POST', token, signal, body: { ...context(organizationUid), q, filters: [], limit, offset }
  });
}

export function createReport({ token, signal, domain, organizationUid, definition, selection, format, idempotencyKey = newIdempotencyKey() }) {
  const scope = domain === 'assets' ? context(requireUid(organizationUid, 'organização')) : {};
  domainPath(domain);
  if (!definition.export_enabled || !definition.export_formats.includes(format)) throw new Error('Formato indisponível para este relatório.');
  const { columns, sort, q, filters, include_inactive } = selection;
  return apiRequest(root, {
    method: 'POST', token, signal, idempotencyKey,
    body: { ...scope, report_code: definition.report_code, report_version: definition.report_version, format, visibility: 'private',
      filters: { q, filters, include_inactive }, columns, sort, ttl_seconds: 172800 }
  });
}

export function getReport({ token, signal, uid, organizationUid }) {
  return apiRequest(reportPath(uid), { token, signal, searchParams: context(organizationUid) });
}

export function downloadReport({ token, signal, uid, organizationUid }) {
  return apiRequest(`${reportPath(uid)}/download`, {
    token, signal, searchParams: context(organizationUid), responseType: 'blob',
    headers: { Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, application/octet-stream' }
  });
}
