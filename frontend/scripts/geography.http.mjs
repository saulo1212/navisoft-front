// Run only against a test organization: GEO_API_URL, GEO_ORGANIZATION_UID and
// GEO_TOKEN (or GEO_TOKEN_FILE). Uses organization scope and deletes its fixtures.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const base = process.env.GEO_API_URL;
const org = process.env.GEO_ORGANIZATION_UID;
const token = process.env.GEO_TOKEN || (process.env.GEO_TOKEN_FILE ? (await readFile(process.env.GEO_TOKEN_FILE, 'utf8')).trim().replace(/^Bearer\s+/i, '') : null);
if (!base || !org || !token) throw new Error('Configure GEO_API_URL, GEO_ORGANIZATION_UID e GEO_TOKEN ou GEO_TOKEN_FILE.');
const report = { date: new Date().toISOString(), base, organization: org, creations: [], checks: [], errors: [], cleanup: [], passed: false };
const fixtures = [];
const prefix = `QA-GEO-${randomUUID()}`;
async function request(path, method = 'GET', body, key) {
  const isCreation = method === 'POST' && /^\/v1\/admin\/geo\/(points|geofences|routes)$/.test(path);
  if (isCreation) report.creations.push({ path, key, name: body.name });
  const response = await fetch(`${base.replace(/\/$/, '')}${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0', ...(key ? { 'Idempotency-Key': key } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(20000)
  });
  const text = await response.text();
  let payload;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = null; }
  if (response.status >= 400) report.errors.push({ path, method, status: response.status, code: payload?.error ?? payload?.code, requestId: response.headers.get('x-request-id') });
  const uid = (payload?.item ?? payload)?.uid;
  if (isCreation && [200, 201].includes(response.status) && uid && !fixtures.some(f => f.path === path && f.uid === uid)) fixtures.push({ path, uid });
  return { status: response.status, body: payload };
}
function check(label, actual, expected) {
  const passed = Array.isArray(expected) ? expected.includes(actual) : actual === expected;
  report.checks.push({ label, actual, expected, passed });
  assert.ok(passed, `${label}: ${actual}; esperado ${JSON.stringify(expected)}`);
}
const item = response => response.body?.item ?? response.body;
const common = { scope_level: 'organization', uid_organization: org, description: 'Fixture temporária de homologação', active: true };
const cases = [
  ['points', { latitude: -23.55, longitude: -46.63, radius_meters: 120 }, { latitude: 100 }],
  ['geofences', { shape: 'circle', latitude: -23.55, longitude: -46.63, radius_meters: 80, entry_margin_meters: 5, exit_margin_meters: 10 }, { radius_meters: -1 }],
  ['geofences', { shape: 'polygon', geojson: { type: 'Polygon', coordinates: [[[-46.64, -23.55], [-46.62, -23.55], [-46.62, -23.56], [-46.64, -23.55]]] }, entry_margin_meters: 5, exit_margin_meters: 10 }, { geojson: { type: 'Polygon', coordinates: [] } }],
  ['routes', { lateral_margin_meters: 80, max_speed_kmh: 60, points: [{ longitude: -46.63, latitude: -23.55, max_speed_to_next_kmh: 40 }, { longitude: -46.61, latitude: -23.54 }] }, { points: [{ longitude: -46.63, latitude: -23.55 }] }]
];
let failure;
try {
  check('sessão válida', (await request('/v1/users/status')).status, 200);
  for (const [index, [resource, geometry, invalid]] of cases.entries()) {
    const path = `/v1/admin/geo/${resource}`;
    const body = { ...common, ...geometry, name: `${prefix}-${index}` };
    const key = randomUUID();
    const created = await request(path, 'POST', body, key);
    const uid = item(created)?.uid;
    check(`${index}: create`, created.status, 201);
    assert.match(uid ?? '', /^[0-9a-f-]{36}$/i, 'Criação sem UID reconhecível');
    const replay = await request(path, 'POST', body, key);
    check(`${index}: replay status`, replay.status, 200);
    check(`${index}: replay UID`, item(replay)?.uid, uid);
    check(`${index}: payload divergente`, (await request(path, 'POST', { ...body, name: `${body.name}-divergente` }, key)).status, 409);
    check(`${index}: geometria inválida`, (await request(path, 'POST', { ...body, ...invalid }, randomUUID())).status, 422);
    const detail = await request(`${path}/${uid}`);
    check(`${index}: detalhe`, detail.status, 200);
    check(`${index}: nome no detalhe`, item(detail)?.name, body.name);
    const updated = { ...body, name: `${body.name}-editado` };
    check(`${index}: PUT completo`, (await request(`${path}/${uid}`, 'PUT', updated)).status, 200);
    const after = await request(`${path}/${uid}`);
    check(`${index}: edição persistida`, item(after)?.name, updated.name);
    if (resource === 'routes') {
      assert.deepEqual(item(after)?.points?.map(p => [p.longitude, p.latitude]), body.points.map(p => [p.longitude, p.latitude]));
      report.checks.push({ label: `${index}: ordem dos pontos preservada`, passed: true });
    }
    const query = { filters: [{ field: 'uid_organization', operator: 'eq', value: org }, { field: 'name', operator: 'eq', value: updated.name }], limit: 10, offset: 0 };
    for (const method of ['GET', 'POST']) {
      const url = method === 'GET' ? `${path}?${new URLSearchParams({ filters: JSON.stringify(query.filters), limit: '10', offset: '0' })}` : `${path}/search`;
      const result = await request(url, method, method === 'POST' ? query : undefined);
      check(`${index}: ${method} lista/search`, result.status, 200);
      assert.ok(result.body?.items?.some(row => row.uid === uid), 'Fixture ausente da busca');
    }
  }
  report.passed = true;
} catch (error) {
  failure = error;
  report.failure = error.message;
} finally {
  for (const fixture of fixtures.reverse()) {
    try {
      const deleted = await request(`${fixture.path}/${fixture.uid}`, 'DELETE');
      const missing = await request(`${fixture.path}/${fixture.uid}`);
      const passed = deleted.status === 204 && missing.status === 404;
      report.cleanup.push({ ...fixture, deleteStatus: deleted.status, getStatus: missing.status, passed });
      if (!passed) report.passed = false;
    } catch (error) { report.cleanup.push({ ...fixture, passed: false, error: error.message }); report.passed = false; }
  }
  const output = process.env.GEO_REPORT_PATH || 'geography-http-report.json';
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ passed: report.passed, checks: report.checks.length, fixtures: fixtures.length, report: output }));
}
if (failure || !report.passed) process.exitCode = 1;
