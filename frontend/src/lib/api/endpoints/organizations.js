import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid } from '../../domain/technicalOperations';

// Administração de organizações (/v1/admin/organizations). Os gates de edição
// vêm de /v1/users/me/organizations/{uid}/access-context (code_name_update,
// reseller_enabled_update, session_policy). "allowed" não garante payload válido.

export async function listOrganizations({ token, q, limit, offset, includeInactive, signal }) {
  // A API retorna todas as organizações visíveis (ignora limit/offset) com `total`.
  return apiRequest('/v1/admin/organizations', { token, signal, searchParams: { q, limit, offset, include_inactive: includeInactive || undefined } });
}

export async function getOrganization({ token, uid, includeInactive, signal }) {
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(uid)}`, { token, signal, searchParams: { include_inactive: includeInactive || undefined } });
}

const orgResource = (uid, resource) => `/v1/admin/organizations/${requireUid(uid, 'organização')}/${resource}`;

export async function getOrganizationProvisioningActor({ token, uid, signal }) {
  const filters = [{ field: 'uid', operator: 'eq', value: requireUid(uid, 'usuário') }];
  const { items } = await apiRequest('/v1/admin/users', { token, signal, searchParams: { filters: JSON.stringify(filters), limit: 1 } });
  return items?.find(item => item.uid === uid) ?? null;
}

export function getOrganizationLifecycle({ token, uid, includeInactive, signal }) {
  return apiRequest(orgResource(uid, 'lifecycle'), { token, signal, searchParams: { include_inactive: includeInactive || undefined } });
}

export function patchOrganizationLifecycle({ token, uid, state, reason, signal }) {
  return apiRequest(orgResource(uid, 'lifecycle'), { token, signal, method: 'PATCH', body: { state, reason } });
}

export function getOrganizationAccessPeriods({ token, uid, signal }) {
  return apiRequest(orgResource(uid, 'access-periods'), { token, signal });
}

export function updateOrganizationAccessPeriods({ token, uid, body, signal }) {
  return apiRequest(orgResource(uid, 'access-periods'), { token, signal, method: 'PUT', body });
}

export function listOrganizationTimezones({ token, signal }) {
  return apiRequest('/v1/admin/common/timezones', { token, signal });
}

export function getOrganizationBranding({ token, uid, signal }) {
  return apiRequest(orgResource(uid, 'branding'), { token, signal });
}

export function patchOrganizationBranding({ token, uid, theme, signal }) {
  return apiRequest(orgResource(uid, 'branding'), { token, signal, method: 'PATCH', body: { theme } });
}

export async function createOrganization({ token, body, idempotencyKey, signal }) {
  return apiRequest('/v1/admin/organizations', {
    method: 'POST', token, body, signal, idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// Edição de identidade (code/name) — protegida pelo gate code_name_update.
export async function updateOrganizationIdentity({ token, uid, code, name }) {
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(uid)}`, {
    method: 'PUT', token, body: { code, name }
  });
}

// Habilitar/desabilitar revenda — Primary-only (reseller_enabled_update).
// Correção: a rota real é o PUT base com { reseller_enabled }, não /reseller.
export async function updateOrganizationReseller({ token, uid, resellerEnabled }) {
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(uid)}`, {
    method: 'PUT', token, body: { reseller_enabled: resellerEnabled }
  });
}

export async function getOrgSessionPolicy({ token, uid, signal }) {
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(uid)}/session-policy`, { token, signal });
}

export async function updateOrgSessionPolicy({ token, uid, allowConcurrentSessions, requireMfa }) {
  const body = {};
  if (allowConcurrentSessions !== undefined) body.allow_concurrent_sessions = allowConcurrentSessions;
  if (requireMfa !== undefined) body.require_mfa = requireMfa;
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(uid)}/session-policy`, {
    method: 'PUT', token, body
  });
}

// Gates por organização (reusa a rota de contexto do usuário).
export async function getOrganizationGates({ token, uid, signal }) {
  return apiRequest(`/v1/users/me/organizations/${encodeURIComponent(uid)}/access-context`, { token, signal });
}

export function sendActivationInvitation({ token, organizationUid, adminUid, idempotencyKey = newIdempotencyKey(), signal }) {
  const organization = requireUid(organizationUid, 'organização');
  const admin = requireUid(adminUid, 'administrador');
  return apiRequest(`/v1/admin/organizations/${organization}/admins/${admin}/activation-invitation`, {
    method: 'POST', token, body: {}, idempotencyKey, signal
  });
}
