import { readFile } from 'node:fs/promises';

// Credentials stay in memory. Existing local Insomnia credentials can supply the
// explicitly selected test login; no password or bearer is written to evidence.
export async function homologationSession() {
  const config = await readFile(new URL('../.env.local', import.meta.url), 'utf8');
  const base = process.env.TEST_API_URL || config.match(/^NAVISOFT_API_URL=(.*)$/m)?.[1].trim();
  const identifier = process.env.TEST_LOGIN_IDENTIFIER || 'admin.autoscale';
  let password = process.env.TEST_LOGIN_PASSWORD;
  if (!password) {
    const collection = JSON.parse(await readFile(new URL('../../Insomnia_2026-11-11.json', import.meta.url), 'utf8'));
    for (const request of collection.resources || []) {
      if (request._type !== 'request' || request.method !== 'POST' || !/\/v1\/users\/login$/.test(request.url || '')) continue;
      try { const body = JSON.parse(request.body?.text || '{}'); if (body.identifier === identifier && body.password && !body.password.includes('{{')) { password = body.password; break; } } catch { /* unrelated request */ }
    }
  }
  if (!base || !password) throw new Error('Configure a base e a credencial de homologação.');
  const headers = { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' };
  const response = await fetch(`${base}/v1/users/login`, { method: 'POST', headers, body: JSON.stringify({ identifier, password, application: 'navisoft' }), signal: AbortSignal.timeout(15000) });
  if (response.status !== 200) throw new Error(`Login HTTP ${response.status}`);
  const token = (await response.json()).session?.token;
  if (!token) throw new Error('Login sem sessão ativa.');
  const call = async (path, method = 'GET', body, key) => {
    const response = await fetch(`${base}${path}`, { method, headers: { ...headers, Authorization: `Bearer ${token}`, ...(key ? { 'Idempotency-Key': key } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(20000) });
    let payload = null;
    const text = await response.text();
    try { payload = text ? JSON.parse(text) : null; } catch { /* 204 or non-JSON */ }
    return { status: response.status, body: payload, requestId: response.headers.get('x-request-id'), contentType: response.headers.get('content-type'), errorText: response.status >= 400 && !payload ? text.replaceAll(token, '[redacted]').slice(0, 500) : undefined };
  };
  const organizations = await call('/v1/users/me/organizations?limit=100');
  const organization = organizations.body?.items?.find(item => item.name === 'Admin Homolog Client');
  if (!organization) throw new Error('Organização exclusiva de homologação indisponível.');
  return { base, token, org: organization.uid, call };
}
