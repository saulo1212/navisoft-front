// sessionStorage: sobrevive a reload da aba, mas não a troca/fechamento de
// aba nem a outra origem — razoável para o Bearer de uma SPA administrativa.
// Nunca persistir em localStorage (fica retido indefinidamente) nem logar o valor.
const TOKEN_KEY = '__navisoft_session_token__';
const ORG_KEY = '__navisoft_selected_organization__';

const hasStorage = () => typeof window !== 'undefined' && !!window.sessionStorage;

export function readToken() {
  if (!hasStorage()) return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function writeToken(token) {
  if (!hasStorage()) return;
  if (token) window.sessionStorage.setItem(TOKEN_KEY, token);
  else window.sessionStorage.removeItem(TOKEN_KEY);
}

export function readSelectedOrganization() {
  if (!hasStorage()) return null;
  return window.sessionStorage.getItem(ORG_KEY);
}

export function writeSelectedOrganization(organizationUid) {
  if (!hasStorage()) return;
  if (organizationUid) window.sessionStorage.setItem(ORG_KEY, organizationUid);
  else window.sessionStorage.removeItem(ORG_KEY);
}

export function clearSession() {
  writeToken(null);
  writeSelectedOrganization(null);
}
