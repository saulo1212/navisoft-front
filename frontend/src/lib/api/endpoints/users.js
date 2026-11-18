import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';

// Administração de usuários de login (/v1/admin/users). Diferente do colaborador
// (pessoa física), o usuário é a credencial de acesso: tem login, profile_code
// (primary_admin | administrator | secondary_admin | basic_user), escopo de
// organizações (organizations_access = all | selected) e scopes[] por org.
//
// ⚠️ Um PUT completo pode revogar a sessão (version_sessions). Para alterações
// pontuais (ex.: e-mail), preferir PATCH. A UI avisa o operador antes do PUT.

const ROOT = '/v1/admin/users';

export async function listUsers({ token, q, limit = 50, offset = 0, includeInactive, signal }) {
  return apiRequest(ROOT, { token, signal, searchParams: { q, limit, offset, include_inactive: includeInactive } });
}

export async function getUser({ token, uid, includeInactive, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}`, {
    token, signal, searchParams: { include_inactive: includeInactive }
  });
}

// Criação provisionada: cria o usuário (tipicamente enabled:false) e o primeiro
// acesso/ativação é tratado à parte (fluxo de convite — ver INT-02).
export async function createUser({ token, body, idempotencyKey }) {
  return apiRequest(ROOT, {
    method: 'POST', token, body, idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// PUT completo (nome, login, profile_code, organizations_access, scopes, enabled).
export async function updateUser({ token, uid, body }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}`, { method: 'PUT', token, body });
}

// PATCH parcial (ex.: { email } ou { enabled }).
export async function patchUser({ token, uid, body }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}`, { method: 'PATCH', token, body });
}

// Aplicações liberadas para o usuário (navisoft, etc.).
export async function getUserApplications({ token, uid, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}/applications`, { token, signal });
}

export async function setUserApplications({ token, uid, applications }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(uid)}/applications`, {
    method: 'PUT', token, body: { applications }
  });
}
