'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { isApiError } from '@/lib/api/errors';
import { registerUnauthorizedHandler } from '@/lib/api/http';
import {
  challengeMfa, fetchAccessContext, fetchOrganizationAccessContext, fetchProfile, fetchStatus,
  login as apiLogin, logout as apiLogout
} from '@/lib/api/endpoints/auth';
import { clearSession, readSelectedOrganization, readToken, writeSelectedOrganization, writeToken } from './storage';

// Implementa a sequência obrigatória do tópico 01: status -> access-context
// global -> seleção explícita de organização -> access-context por organização.
// "allowed" em qualquer gate aqui NUNCA autoriza uma operação por si só; cada
// tela deve revalidar na própria API de domínio.

const SessionContext = createContext(undefined);

const INITIAL_STATE = {
  phase: 'booting', // booting | unauthenticated | pending_mfa | authenticated
  token: null,
  account: null,
  areaAccess: null, // { status, reason, areas }
  temporalMode: 'none',
  error: null
};

export function SessionProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE);
  const [selectedOrganizationUid, setSelectedOrganizationUid] = useState(null);
  const [orgGates, setOrgGates] = useState(null);
  const [orgGatesRevision, setOrgGatesRevision] = useState(0);
  const bootRef = useRef(false);
  const contextRequest = useRef(0);

  const resetToUnauthenticated = useCallback((error = null) => {
    contextRequest.current += 1;
    clearSession();
    setSelectedOrganizationUid(null);
    setOrgGates(null);
    setState({ ...INITIAL_STATE, phase: 'unauthenticated', error });
  }, []);

  const loadAccessContext = useCallback(async (token, account) => {
    const requestId = ++contextRequest.current;
    try {
      const ctx = await fetchAccessContext({ token });
      if (requestId !== contextRequest.current) return;
      // O modo temporal vem de session.access_period.mode (disabled|warn|block).
      const mode = ctx?.session?.access_period?.mode;
      const temporalMode = mode === 'warn' || mode === 'block' ? mode : 'none';
      setState(prev => ({
        ...prev, phase: 'authenticated', token, account: account ?? prev.account, areaAccess: ctx.area_access,
        temporalMode, error: null
      }));
    } catch (error) {
      if (requestId !== contextRequest.current) return;
      if (isApiError(error) && error.status === 401) {
        resetToUnauthenticated('relogin_required');
        return;
      }
      setState(prev => ({ ...prev, phase: 'authenticated', token, account: account ?? prev.account, areaAccess: null, error: 'access_context_unavailable' }));
    }
  }, [resetToUnauthenticated]);

  // Monta o "account" exibido na UI a partir do status (sessão/organização) e,
  // quando disponível, do profile (nome de exibição). Nenhum destes endpoints
  // retorna o papel/role; campos ausentes ficam nulos.
  const afterAuth = useCallback(async token => {
    const status = await fetchStatus({ token });
    let profile = null;
    try { profile = await fetchProfile({ token }); } catch { /* profile é opcional para a navegação */ }
    // `acct` cobre o shape do mock (status.account); o real traz os campos no topo.
    const acct = status?.account ?? null;
    const account = {
      uid: status?.uid_user ?? acct?.uid ?? null,
      name: profile?.display_name || acct?.name || status?.organization_name || 'Usuário',
      email: profile?.email ?? acct?.email ?? null,
      profile: acct?.profile ?? null,
      organizationCode: status?.organization_code ?? acct?.organizationCode ?? null,
      organizationName: status?.organization_name ?? acct?.organizationName ?? null,
      branding: status?.branding ?? null
    };
    await loadAccessContext(token, account);
  }, [loadAccessContext]);

  const bootstrap = useCallback(async () => {
    const token = readToken();
    if (!token) {
      setState({ ...INITIAL_STATE, phase: 'unauthenticated' });
      return;
    }
    try {
      const result = await fetchStatus({ token });
      if (!result.authenticated) {
        // Sessão pendente de MFA (state=pending_mfa) ou inválida.
        if (result.state === 'pending_mfa') setState({ ...INITIAL_STATE, phase: 'pending_mfa', token });
        else resetToUnauthenticated(result.relogin_required ? 'relogin_required' : null);
        return;
      }
      const savedOrg = readSelectedOrganization();
      if (savedOrg) setSelectedOrganizationUid(savedOrg);
      await afterAuth(token);
    } catch (error) {
      if (isApiError(error) && error.status === 401) resetToUnauthenticated('relogin_required');
      else resetToUnauthenticated();
    }
  }, [afterAuth, resetToUnauthenticated]);

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;
    void bootstrap();
  }, [bootstrap]);

  // Qualquer chamada que receba 401 relogin_required (expired/revoked) derruba a
  // sessão globalmente, sem cada tela precisar tratar isso.
  useEffect(() => registerUnauthorizedHandler(() => resetToUnauthenticated('relogin_required')), [resetToUnauthenticated]);

  const login = useCallback(async (identifier, password) => {
    setState(prev => ({ ...prev, error: null }));
    const result = await apiLogin({ identifier, password });
    const token = result.token ?? readToken();
    writeToken(token);
    if (result.pendingMfa) {
      setState(prev => ({ ...prev, phase: 'pending_mfa', token }));
      return { status: 'pending_mfa' };
    }
    await afterAuth(token);
    return { status: 'active' };
  }, [afterAuth]);

  const confirmMfa = useCallback(async code => {
    const token = state.token ?? readToken();
    const result = await challengeMfa({ token, code });
    const activeToken = result.token ?? token;
    writeToken(activeToken);
    await afterAuth(activeToken);
  }, [state.token, afterAuth]);

  const logout = useCallback(async () => {
    const token = state.token ?? readToken();
    if (token) await apiLogout({ token });
    resetToUnauthenticated();
  }, [state.token, resetToUnauthenticated]);

  const refreshAccessContext = useCallback(async () => {
    if (!state.token) return;
    await loadAccessContext(state.token);
  }, [state.token, loadAccessContext]);

  const syncAccountProfile = useCallback((token, profile) => {
    const name = profile?.display_name;
    if (typeof name !== 'string') return;
    setState(prev => {
      if (prev.phase !== 'authenticated' || prev.token !== token || !prev.account) return prev;
      const account = {
        ...prev.account,
        name: name || prev.account.organizationName || 'Usuário',
        email: Object.hasOwn(profile, 'email') ? profile.email : prev.account.email
      };
      if (account.name === prev.account.name && account.email === prev.account.email) return prev;
      return { ...prev, account };
    });
  }, []);

  // Ao focar/reexibir a aba, reavaliar o contexto de acesso: scopes/período
  // podem ter mudado no servidor (docs 01 — não há evento/SSE que cubra tudo).
  useEffect(() => {
    if (state.phase !== 'authenticated') return;
    const onFocus = () => { if (document.visibilityState !== 'hidden') void refreshAccessContext(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [state.phase, refreshAccessContext]);

  const selectOrganization = useCallback(organizationUid => {
    if (organizationUid === selectedOrganizationUid) return;
    setOrgGates(null);
    setSelectedOrganizationUid(organizationUid);
    writeSelectedOrganization(organizationUid);
  }, [selectedOrganizationUid]);

  const clearOrganization = useCallback(() => {
    setSelectedOrganizationUid(null);
    writeSelectedOrganization(null);
    setOrgGates(null);
  }, []);

  const retryOrganizationAccess = useCallback(() => {
    setOrgGates(null);
    setOrgGatesRevision(value => value + 1);
  }, []);
  const orgContextEnabled = state.phase === 'authenticated' && state.areaAccess?.status === 'evaluated' && Boolean(selectedOrganizationUid);
  const orgContextKey = orgContextEnabled ? JSON.stringify([state.token, selectedOrganizationUid, state.areaAccess, orgGatesRevision]) : null;

  useEffect(() => {
    if (!orgContextKey) return;
    const controller = new AbortController();
    (async () => {
      try {
        const gates = await fetchOrganizationAccessContext({
          token: state.token, organizationUid: selectedOrganizationUid, signal: controller.signal
        });
        if (!controller.signal.aborted) setOrgGates({ key: orgContextKey, data: gates, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        if (isApiError(error) && error.status === 401) {
          resetToUnauthenticated('relogin_required');
          return;
        }
        if (isApiError(error) && error.status === 404) {
          clearOrganization();
          return;
        }
        setOrgGates({ key: orgContextKey, data: null, error });
      }
    })();
    return () => controller.abort();
  }, [orgContextKey, state.token, selectedOrganizationUid, resetToUnauthenticated, clearOrganization]);

  const currentOrgGates = orgContextKey && orgGates?.key === orgContextKey ? orgGates : null;
  const value = useMemo(() => ({
    ...state,
    selectedOrganizationUid,
    orgGates: currentOrgGates?.data ?? null,
    orgGatesLoading: Boolean(orgContextKey && !currentOrgGates),
    orgGatesError: currentOrgGates?.error ?? null,
    login, confirmMfa, logout, refreshAccessContext, syncAccountProfile, selectOrganization, clearOrganization, retryOrganizationAccess
  }), [state, selectedOrganizationUid, currentOrgGates, orgContextKey, login, confirmMfa, logout, refreshAccessContext, syncAccountProfile, selectOrganization, clearOrganization, retryOrganizationAccess]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession só pode ser usado dentro de SessionProvider');
  return ctx;
}
