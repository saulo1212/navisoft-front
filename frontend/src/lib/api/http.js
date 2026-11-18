import { API_BASE_URL } from './config';
import { ApiError } from './errors';

// --- Handler global de sessão inválida ---------------------------------------
// A SessionContext registra um callback aqui; qualquer 401 com relogin_required
// (expired/revoked) dispara o reset global da sessão, independentemente de qual
// chamada o detectou. Evita espalhar essa lógica por todas as telas.
let unauthorizedHandler = null;
export function registerUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
  return () => { if (unauthorizedHandler === fn) unauthorizedHandler = null; };
}

// Cliente HTTP real. Todas as chamadas usam cache:'no-store' porque o backend
// documentado envia Cache-Control: no-store em todas as rotas autenticadas.
export async function apiRequest(path, { method = 'GET', body, rawBody, headers: requestHeaders, token, signal, searchParams, idempotencyKey, includeStatus = false, responseType = 'json' } = {}) {
  if (body !== undefined && rawBody !== undefined) throw new Error('Escolha corpo JSON ou binário, não ambos.');
  // Base pode ser absoluta (http...) ou relativa same-origin (ex.: /api/navisoft,
  // o proxy do Next). Base relativa é resolvida contra a origem atual do browser.
  let base = API_BASE_URL || '';
  if (base && !/^https?:\/\//.test(base)) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    base = origin.replace(/\/$/, '') + '/' + base.replace(/^\//, '');
  }
  if (!base.endsWith('/')) base = `${base}/`;
  const url = new URL(path.replace(/^\//, ''), base);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    });
  }
  const headers = { 'Content-Type': 'application/json', ...requestHeaders };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  let response;
  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      body: rawBody !== undefined ? rawBody : body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      signal
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new ApiError(0, 'network_error', null);
  }

  // Binary downloads still use the shared authentication/error handling. Never
  // decode attachment bytes as JSON/text before returning the successful blob.
  if (response.ok && responseType === 'blob') {
    const blob = await response.blob();
    return includeStatus ? { status: response.status, body: blob } : blob;
  }
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }
  if (!response.ok) {
    const code = payload?.error ?? payload?.code ?? null;
    const err = new ApiError(response.status, code, payload);
    if (err.isReloginRequired && unauthorizedHandler) {
      try { unauthorizedHandler(err); } catch { /* não deixar o handler mascarar o erro original */ }
    }
    throw err;
  }
  // `includeStatus` devolve o código HTTP junto do corpo — necessário quando a
  // distinção 200 vs 202 importa (ex.: login ativo vs pending_mfa).
  return includeStatus ? { status: response.status, body: payload } : payload;
}

// --- Normalização de listagens ------------------------------------------------
// A API usa dois envelopes de paginação:
//   admin/*             -> { items, total, limit, offset, elapsed_ms }   (offset)
//   users/me/organizations -> { items, has_more, next_after_uid }        (cursor)
// `normalizeList` devolve um formato único que ambas as paginações preenchem.
export function normalizeList(payload) {
  const items = Array.isArray(payload?.items) ? payload.items
    : Array.isArray(payload?.data) ? payload.data
    : Array.isArray(payload) ? payload
    : [];
  const hasCursor = payload && (payload.has_more !== undefined || payload.next_after_uid !== undefined);
  if (hasCursor) {
    return {
      items,
      total: payload.total ?? null,
      limit: payload.limit ?? null,
      offset: null,
      nextAfterUid: payload.next_after_uid ?? null,
      hasMore: payload.has_more === true,
      mode: 'cursor'
    };
  }
  const total = payload?.total ?? items.length;
  const limit = payload?.limit ?? null;
  const offset = payload?.offset ?? 0;
  return {
    items,
    total,
    limit,
    offset,
    nextAfterUid: null,
    hasMore: typeof total === 'number' ? offset + items.length < total : items.length === (limit ?? items.length),
    mode: 'offset'
  };
}
