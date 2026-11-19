import { apiRequest } from '../http';
import { requireUid } from '../../domain/technicalOperations';

const admin = '/v1/admin';
const fipe = `${admin}/integrations/fipe`;
const organization = uid => `${admin}/organizations/${requireUid(uid, 'organização')}`;
const integration = uid => `${organization(uid)}/integration-tokens/autoscale-notifications`;

export function searchPlatformCapabilities({ token, signal, q, limit = 50, offset = 0 }) {
  return apiRequest(`${admin}/platform-capabilities/search`, {
    method: 'POST', token, signal, body: { limit, offset, ...(q?.trim() && { q: q.trim() }) }
  });
}

export function listPlatformServices({ token, signal, limit = 50, offset = 0 }) {
  return apiRequest(`${admin}/services`, { token, signal, searchParams: { limit, offset } });
}

export function listOrganizationServices({ token, signal, organizationUid, limit = 50, offset = 0 }) {
  return apiRequest(`${organization(organizationUid)}/services`, { token, signal, searchParams: { limit, offset } });
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

export function listFipeJobs({ token, signal, limit = 25, offset = 0 }) {
  return apiRequest(`${fipe}/jobs`, { token, signal, searchParams: { limit, offset } });
}

export function getFipeJob({ token, signal, uid }) {
  return apiRequest(`${fipe}/jobs/${requireUid(uid, 'tarefa FIPE')}`, { token, signal });
}

export function enqueueFipeJob({ token, signal, body, idempotencyKey }) {
  return apiRequest(`${fipe}/sync`, { method: 'POST', token, signal, body, idempotencyKey });
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
