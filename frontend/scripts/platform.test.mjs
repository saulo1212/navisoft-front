import assert from 'node:assert/strict';
import { test } from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://platform.example.test';
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/platform.js', import.meta.url));
const { registerUnauthorizedHandler } = await importBrowserModule(new URL('../src/lib/api/http.js', import.meta.url));
const { fipeSyncBody, geocodeDesiredStatus, geocodeRateLimit, geocodeTokenBody, validatePlatformLogo } =
  await importBrowserModule(new URL('../src/lib/domain/platform.js', import.meta.url));
const organizationUid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const uid = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const token = 'test-bearer';

function capture(t, respond = () => Response.json({})) {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: new URL(url), ...options });
    return respond(calls.at(-1));
  });
  return calls;
}

test('capabilities use global search and services use explicit organizational scope', async t => {
  const calls = capture(t);
  await api.searchPlatformCapabilities({ token, q: ' products ', limit: 25, offset: 50 });
  await api.listPlatformServices({ token, limit: 5, offset: 10 });
  await api.listOrganizationServices({ token, organizationUid });
  assert.equal(calls[0].url.pathname, '/v1/admin/platform-capabilities/search');
  assert.equal(calls[0].method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].body), { q: 'products', limit: 25, offset: 50 });
  assert.equal(calls[1].url.pathname, '/v1/admin/services');
  assert.equal(calls[1].url.search, '?limit=5&offset=10');
  assert.equal(calls[2].url.pathname, `/v1/admin/organizations/${organizationUid}/services`);
  assert.throws(() => api.listOrganizationServices({ token }), /UUID/);
  assert.ok(calls.every(call => call.cache === 'no-store' && call.headers.Authorization === `Bearer ${token}`));
});

test('credential replacement sends the credential only in the scoped PUT body', async t => {
  const calls = capture(t);
  const args = { token, organizationUid };
  await api.getNotifyCredential(args);
  await api.replaceNotifyCredential({ ...args, credential: 'mock-service-credential' });
  await api.revokeNotifyCredential(args);
  assert.deepEqual(calls.map(call => call.method), ['GET', 'PUT', 'DELETE']);
  assert.ok(calls.every(call => call.url.pathname === `/v1/admin/organizations/${organizationUid}/integration-tokens/autoscale-notifications` && !call.url.search));
  assert.deepEqual(JSON.parse(calls[1].body), { token: 'mock-service-credential' });
  assert.equal(calls[0].body, undefined);
  assert.equal(calls[2].body, undefined);
});

test('Geocode reads the filtered organization binding and rejects foreign bindings', async t => {
  let row = { code: 'geocode', uid_organization: organizationUid, desired_status: 'active', version: 1 };
  const calls = capture(t, () => Response.json({ items: row ? [row] : [] }));
  const args = { token, organizationUid };
  assert.deepEqual(await api.getGeocodeService(args), { service: row });
  assert.equal(calls[0].url.pathname, `/v1/admin/organizations/${organizationUid}/services`);
  assert.deepEqual(JSON.parse(calls[0].url.searchParams.get('filters')), [{ field: 'code', operator: 'eq', value: 'geocode' }]);
  row = { ...row, uid_organization: uid };
  await assert.rejects(api.getGeocodeService(args), { status: 403 });
  row = null;
  assert.deepEqual(await api.getGeocodeService(args), { service: null });
});

test('Geocode admin operations are scoped and token listings retain only metadata', async t => {
  const issuedToken = 'test-token-visible-only-on-creation';
  const calls = capture(t, call => call.method === 'GET'
    ? Response.json({ items: [{ uid, name: 'QA', token_hint: 'qa…', token: issuedToken }], total: 20, limit: 5, offset: 5 })
    : Response.json(call.method === 'POST' ? { uid, token: issuedToken } : {}));
  const args = { token, organizationUid };
  await api.setGeocodeService({ ...args, desiredStatus: geocodeDesiredStatus('suspended') });
  const page = await api.listGeocodeTokens({ ...args, limit: 5, offset: 5 });
  const body = geocodeTokenBody({ name: ' QA ', rate_limit_rps: '25' });
  assert.equal((await api.createGeocodeToken({ ...args, body, idempotencyKey: uid })).token, issuedToken);
  await api.updateGeocodeTokenLimit({ ...args, uid, rateLimit: 50 });
  await api.revokeGeocodeToken({ ...args, uid });
  const path = `/v1/admin/organizations/${organizationUid}/services/geocode`;
  assert.deepEqual(calls.map(call => [call.method, call.url.pathname, call.body && JSON.parse(call.body)]), [
    ['PUT', path, { desired_status: 'suspended' }],
    ['GET', `${path}/tokens`, undefined],
    ['POST', `${path}/tokens`, { name: 'QA', rate_limit_rps: 25 }],
    ['PATCH', `${path}/tokens/${uid}`, { rate_limit_rps: 50 }],
    ['DELETE', `${path}/tokens/${uid}`, undefined]
  ]);
  assert.equal(calls[1].url.search, '?limit=5&offset=5');
  assert.ok(calls.every(call => call.cache === 'no-store' && call.headers.Authorization === `Bearer ${token}`));
  assert.equal(calls[2].headers['Idempotency-Key'], uid);
  assert.equal(page.items[0].token_hint, 'qa…');
  assert.ok(!JSON.stringify(page).includes(issuedToken));
});

test('Geocode rejects invalid names, states and request limits', () => {
  assert.throws(() => geocodeDesiredStatus('applied'));
  assert.throws(() => geocodeTokenBody({ name: '  ', rate_limit_rps: '10' }));
  for (const invalid of [0, -1, '2.5', '']) assert.throws(() => geocodeRateLimit(invalid));
});

test('FIPE validates sync types and preserves the enqueue key and request context', async t => {
  const calls = capture(t);
  const form = { job_type: 'variant_refresh', vehicle_type: 'cars', source_brand_code: ' 6 ', source_model_code: '5496', model_year: '2014', fuel_code: '1' };
  const body = fipeSyncBody(form);
  assert.deepEqual(body, { job_type: 'variant_refresh', payload: {
    vehicle_type: 'cars', source_brand_code: '6', source_model_code: '5496', model_year: 2014, fuel_code: 1
  } });
  assert.deepEqual(fipeSyncBody({ ...form, job_type: 'catalog_sync' }), { job_type: 'catalog_sync', payload: {} });
  assert.throws(() => fipeSyncBody({ ...form, job_type: 'valuation_refresh' }), /tipo/);
  assert.throws(() => fipeSyncBody({ ...form, model_year: '2014.5' }), /Ano/);
  const signal = new AbortController().signal;
  await api.enqueueFipeJob({ token, body, signal, idempotencyKey: uid });
  await api.getFipeJob({ token, uid, signal });
  await api.listFipeJobs({ token, limit: 25, offset: 50 });
  assert.equal(calls[0].url.pathname, '/v1/admin/integrations/fipe/sync');
  assert.equal(calls[0].headers['Idempotency-Key'], uid);
  assert.equal(calls[0].signal, signal);
  assert.deepEqual(JSON.parse(calls[0].body), body);
  assert.equal(calls[1].url.pathname, `/v1/admin/integrations/fipe/jobs/${uid}`);
  assert.equal(calls[2].url.search, '?limit=25&offset=50');
});

test('health shows an official critical diagnosis even with HTTP 503', async t => {
  const diagnosis = { status: 'down', dependencies: { postgres_write: { status: 'down' } } };
  let response = diagnosis;
  const calls = capture(t, () => Response.json(response, { status: 503 }));
  assert.deepEqual(await api.getHealthDetails({ token }), diagnosis);
  assert.equal(calls[0].url.pathname, '/v1/health/details');
  response = { code: 'service_unavailable' };
  await assert.rejects(api.getHealthDetails({ token }), { status: 503, code: 'service_unavailable' });
});

test('expired diagnostic credentials cannot invalidate the platform session', async t => {
  const calls = capture(t, () => Response.json({ code: 'relogin_required' }, { status: 401 }));
  let unauthorized = 0;
  const unregister = registerUnauthorizedHandler(() => { unauthorized += 1; });
  t.after(unregister);
  await assert.rejects(api.getHealthDetails({ token, diagnosticToken: 'test-diagnostic' }), { status: 401 });
  assert.equal(unauthorized, 0);
  assert.equal(calls[0].headers.Authorization, 'Bearer test-diagnostic');
  await assert.rejects(api.getHealthDetails({ token }), { status: 401 });
  assert.equal(unauthorized, 1);
});

test('linked logo sends binary bytes and public image fetch never sends bearer', async t => {
  const file = new Blob([Uint8Array.of(137, 80, 78, 71)], { type: 'image/png' });
  const calls = capture(t, call => call.method === 'GET' ? new Response(file) : Response.json({ uid }));
  validatePlatformLogo(file);
  assert.throws(() => validatePlatformLogo(new Blob(['<svg/>'], { type: 'image/svg+xml' })), /PNG/);
  await api.uploadPlatformLogo({ token, owner: 'organization', uid: organizationUid, file, idempotencyKey: uid });
  const image = await api.readPlatformImage({ token, uid, publicImage: true });
  await api.readPlatformImage({ token, uid });
  assert.equal(calls[0].url.pathname, `/v1/admin/images/organization/${organizationUid}`);
  assert.equal(calls[0].url.search, '?link=true');
  assert.equal(calls[0].headers['Content-Type'], 'image/png');
  assert.equal(calls[0].headers['Idempotency-Key'], uid);
  assert.equal(calls[0].body, file);
  assert.equal(calls[1].url.pathname, `/v1/public/images/${uid}`);
  assert.equal(calls[1].headers.Authorization, undefined);
  assert.equal(calls[2].url.pathname, `/v1/images/${uid}`);
  assert.equal(calls[2].headers.Authorization, `Bearer ${token}`);
  assert.deepEqual(new Uint8Array(await image.arrayBuffer()), new Uint8Array(await file.arrayBuffer()));
});
