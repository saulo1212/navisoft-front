import { apiRequest } from '../http';
import { ApiError } from '../errors';
import { requireUid } from '../../domain/technicalOperations';

const admin = '/v1/admin';
const fipe = `${admin}/integrations/fipe`;
const organization = uid => `${admin}/organizations/${requireUid(uid, 'organização')}`;
const integration = uid => `${organization(uid)}/integration-tokens/autoscale-notifications`;
const geocodeService = uid => `${organization(uid)}/services/geocode`;
const geocodeTokens = uid => `${geocodeService(uid)}/tokens`;
const geocodeToken = (organizationUid, uid) => `${geocodeTokens(organizationUid)}/${requireUid(uid, 'token Geocode')}`;

export function searchPlatformCapabilities({ token, signal, q, limit = 50, offset = 0 }) {
  return apiRequest(`${admin}/platform-capabilities/search`, {
    method: 'POST', token, signal, body: { limit, offset, ...(q?.trim() && { q: q.trim() }) }
  });
}

export function listPlatformServices({ token, signal, limit = 50, offset = 0 }) {
  return apiRequest(`${admin}/services`, { token, signal, searchParams: { limit, offset } });
}

export function listOrganizationServices({ token, signal, organizationUid, limit = 50, offset = 0, code }) {
  const filters = code ? JSON.stringify([{ field: 'code', operator: 'eq', value: code }]) : undefined;
  return apiRequest(`${organization(organizationUid)}/services`, { token, signal, searchParams: { limit, offset, filters } });
}

export async function getGeocodeService({ organizationUid, ...args }) {
  const { items } = await listOrganizationServices({ ...args, organizationUid, code: 'geocode' });
  const service = items?.find(row => row.code === 'geocode');
  if (service && service.uid_organization !== organizationUid) throw new ApiError(403, null, null);
  return { service: service ?? null };
}

export function setGeocodeService({ token, signal, organizationUid, desiredStatus }) {
  return apiRequest(geocodeService(organizationUid), { method: 'PUT', token, signal, body: { desired_status: desiredStatus } });
}

export async function listGeocodeTokens({ token, signal, organizationUid, limit = 20, offset = 0 }) {
  const { items, total, limit: pageSize, offset: pageOffset } = await apiRequest(geocodeTokens(organizationUid), {
    token, signal, searchParams: { limit, offset }
  });
  return {
    total, limit: pageSize, offset: pageOffset,
    items: items?.map(({ uid, name, active, version, created_at, revoked_at, token_hint, last_used_at, rate_limit_rps }) => ({
      uid, name, active, version, created_at, revoked_at, token_hint, last_used_at, rate_limit_rps
    })) ?? []
  };
}

export function createGeocodeToken({ token, signal, organizationUid, body, idempotencyKey }) {
  return apiRequest(geocodeTokens(organizationUid), { method: 'POST', token, signal, body, idempotencyKey });
}

export function updateGeocodeTokenLimit({ token, signal, organizationUid, uid, rateLimit }) {
  return apiRequest(geocodeToken(organizationUid, uid), { method: 'PATCH', token, signal, body: { rate_limit_rps: rateLimit } });
}

export function revokeGeocodeToken({ token, signal, organizationUid, uid }) {
  return apiRequest(geocodeToken(organizationUid, uid), { method: 'DELETE', token, signal });
}

export function getNotifyCredential({ token, signal, organizationUid }) {
  return apiRequest(integration(organizationUid), { token, signal });
}

export function replaceNotifyCredential({ token, signal, organizationUid, credential }) {
  return apiRequest(integration(organizationUid), { method: 'PUT', token, signal, body: { token: credential } });
}

export function revokeNotifyCredential({ token, signal, organizationUid }) {
  return apiRequest(integration(organizationUid), { method: 'DELETE', token, signal });
}

// Invalida o cache de filtros do servidor (operação administrativa). 202/200
// sem corpo relevante — o importante é o sucesso da solicitação.
export function reloadFilterCache({ token, signal }) {
  return apiRequest(`${admin}/settings/filters/reload`, { method: 'POST', token, signal });
}

export function listFipeJobs({ token, signal, limit = 25, offset = 0 }) {
  return apiRequest(`${fipe}/jobs`, { token, signal, searchParams: { limit, offset } });
}

export function getFipeJob({ token, signal, uid }) {
  return apiRequest(`${fipe}/jobs/${requireUid(uid, 'tarefa FIPE')}`, { token, signal });
}

export function enqueueFipeJob({ token, signal, body, idempotencyKey }) {
  return apiRequest(`${fipe}/sync`, { method: 'POST', token, signal, body, idempotencyKey });
}

// Readiness probe (/v1/health/ready) — indica se o Core está apto a atender,
// independentemente do estado de dependências opcionais. 200 = pronto; 503 com
// `{status:'down'|...}` continua sendo um diagnóstico válido (não é erro de UI).
export async function getHealthReady({ token, signal }) {
  try {
    return await apiRequest('/v1/health/ready', { token, signal, includeStatus: true, notifyUnauthorized: false });
  } catch (error) {
    if (error.status === 503 && error.payload) return { status: 503, body: error.payload };
    throw error;
  }
}

export async function getHealthDetails({ token, signal, diagnosticToken }) {
  try {
    return await apiRequest('/v1/health/details', { token: diagnosticToken ?? token, signal, notifyUnauthorized: !diagnosticToken });
  } catch (error) {
    // A falha crítica é reportada com 503 e continua sendo um diagnóstico válido.
    if (error.status === 503 && error.payload?.status === 'down' && error.payload.dependencies) return error.payload;
    throw error;
  }
}

export function uploadPlatformLogo({ token, signal, owner, uid, file, idempotencyKey }) {
  if (!['organization', 'entity'].includes(owner)) throw new Error('Tipo de proprietário da imagem inválido.');
  return apiRequest(`${admin}/images/${owner}/${requireUid(uid, 'proprietário da imagem')}`, {
    method: 'POST', token, signal, searchParams: { link: true }, rawBody: file,
    headers: { 'Content-Type': file.type }, idempotencyKey
  });
}

export function readPlatformImage({ token, signal, uid, publicImage = false }) {
  const path = publicImage ? '/v1/public/images' : '/v1/images';
  return apiRequest(`${path}/${requireUid(uid, 'imagem')}`, {
    token: publicImage ? undefined : token, signal, responseType: 'blob', headers: { Accept: 'image/*' }
  });
}
