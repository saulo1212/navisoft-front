import { API_APPLICATION } from '../config';
import { apiRequest } from '../http';

// Camada única consumida pela UI — chama a API Navisoft nos caminhos
// confirmados contra a base externa (ver /api-contracts). Shapes reais:
//   login 200 -> { session:{token,...}, organization:{...} }
//   login 202 -> pending_mfa (mesmo envelope de sessão, com token pendente)
//   challenge -> promove a sessão (Bearer = token pendente, body { code })

export async function login({ identifier, password, application = API_APPLICATION }) {
  const { status, body } = await apiRequest('/v1/users/login', {
    method: 'POST', body: { identifier, password, application }, includeStatus: true
  });
  return {
    status,
    pendingMfa: status === 202,
    token: body?.session?.token ?? null,
    organization: body?.organization ?? null,
    body
  };
}

export async function challengeMfa({ token, code }) {
  const { status, body } = await apiRequest('/v1/users/login/challenge', {
    method: 'POST', token, body: { code }, includeStatus: true
  });
  // A confirmação pode devolver uma nova sessão; senão, mantém o mesmo token.
  return { status, token: body?.session?.token ?? token, body };
}

export async function fetchStatus({ token, signal }) {
  return apiRequest('/v1/users/status', { token, signal });
}

export async function logout({ token }) {
  return apiRequest('/v1/users/logout', { method: 'POST', token }).catch(() => null);
}

export async function getSecurity({ token }) {
  return apiRequest('/v1/users/security', { token });
}

export async function putSecurity({ token, requireMfa }) {
  return apiRequest('/v1/users/security', { method: 'PUT', token, body: { require_mfa: requireMfa } });
}

export async function fetchProfile({ token, signal }) {
  return apiRequest('/v1/users/profile', { token, signal });
}

export async function updateProfile({ token, patch, signal }) {
  return apiRequest('/v1/users/profile', { method: 'PATCH', token, body: patch, signal });
}

// Troca de senha autenticada com a senha atual.
export async function changePassword({ token, currentPassword, newPassword }) {
  return apiRequest('/v1/users/password', {
    method: 'PUT', token, body: { current_password: currentPassword, new_password: newPassword }
  });
}

export async function requestContactVerification({ token, channel = 'email', signal }) {
  return apiRequest('/v1/users/contact-verification/request', { method: 'POST', token, body: { channel }, signal });
}

export async function confirmContactVerification({ token, channel = 'email', challengeId, verificationToken, signal }) {
  return apiRequest('/v1/users/contact-verification/confirm', {
    method: 'POST', token, body: { channel, challenge_id: challengeId, token: verificationToken }, signal
  });
}

export async function fetchAccessContext({ token, signal }) {
  return apiRequest('/v1/users/me/access-context', { token, signal });
}

export async function fetchMyOrganizations({ token, q, afterUid, limit = 50, signal }) {
  return apiRequest('/v1/users/me/organizations', { token, signal, searchParams: { q, after_uid: afterUid, limit } });
}

export async function fetchOrganizationAccessContext({ token, organizationUid, signal }) {
  return apiRequest(`/v1/users/me/organizations/${encodeURIComponent(organizationUid)}/access-context`, { token, signal });
}

export async function fetchOrganization({ token, organizationUid, signal }) {
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(organizationUid)}`, { token, signal });
}

export async function updateOrganizationIdentity({ token, organizationUid, code, name }) {
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(organizationUid)}`, { method: 'PUT', token, body: { code, name } });
}

export async function updateOrganizationReseller({ token, organizationUid, resellerEnabled }) {
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(organizationUid)}/reseller`, { method: 'PUT', token, body: { reseller_enabled: resellerEnabled } });
}

export async function fetchSessionPolicy({ token, organizationUid, signal }) {
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(organizationUid)}/session-policy`, { token, signal });
}

export async function updateSessionPolicy({ token, organizationUid, allowConcurrentSessions, requireMfa }) {
  return apiRequest(`/v1/admin/organizations/${encodeURIComponent(organizationUid)}/session-policy`, {
    method: 'PUT', token, body: { allow_concurrent_sessions: allowConcurrentSessions, require_mfa: requireMfa }
  });
}

export async function requestPasswordRecovery({ identifier, country }) {
  return apiRequest('/v1/users/password-recovery/request', { method: 'POST', body: { identifier, country } });
}

export async function validatePasswordRecovery({ token }) {
  return apiRequest('/v1/users/password-recovery/validate', { method: 'POST', body: { token } });
}

export async function completePasswordRecovery({ token, newPassword, passwordConfirmation }) {
  return apiRequest('/v1/users/password-recovery/complete', {
    method: 'POST', body: { token, new_password: newPassword, password_confirmation: passwordConfirmation }
  });
}

export function validateActivation({ challengeId, token, signal }) {
  return apiRequest('/v1/users/activation/validate', {
    method: 'POST', body: { challenge_id: challengeId, token }, signal, notifyUnauthorized: false
  });
}

export function completeActivation({ challengeId, token, password, passwordConfirmation, signal }) {
  return apiRequest('/v1/users/activation/complete', {
    method: 'POST', body: { challenge_id: challengeId, token, password, password_confirmation: passwordConfirmation },
    signal, notifyUnauthorized: false
  });
}
