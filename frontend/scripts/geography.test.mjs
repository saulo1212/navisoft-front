import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// Import the existing extensionless browser modules in Node without changing
// the application's module resolution or contacting a real API.
async function moduleUrl(url) {
  let source = await readFile(url, 'utf8');
  const imports = [...source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)];
  for (const match of imports) {
    const dependency = new URL(`${match[1]}.js`, url);
    source = source.replace(match[0], `from '${await moduleUrl(dependency)}'`);
  }
  return `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
}
const domain = await import(await moduleUrl(new URL('../src/lib/domain/geography.js', import.meta.url)));
process.env.NEXT_PUBLIC_API_BASE_URL = 'https://geography.test';
const api = await import(await moduleUrl(new URL('../src/lib/api/endpoints/geography.js', import.meta.url)));
const org = '11111111-1111-4111-8111-111111111111';
const entity = '22222222-2222-4222-8222-222222222222';
const asset = '33333333-3333-4333-8333-333333333333';
const form = { name: ' Ponto ', scope_level: 'organization', latitude: '0', longitude: '-43.9', radius_meters: '500', active: true };

test('point contract uses real field names and preserves zero coordinates', () => {
  const body = domain.pointBody(form, org);
  assert.deepEqual(body, { name: 'Ponto', description: null, scope_level: 'organization', active: true, latitude: 0, longitude: -43.9, radius_meters: 500, uid_organization: org });
  assert.deepEqual(domain.pointCoordinates(body), [-43.9, 0]);
});

test('invalid coordinates and radius are rejected before sending a mutation', () => {
  for (const change of [{ latitude: '' }, { longitude: 181 }, { latitude: -91 }, { longitude: 'NaN' }, { radius_meters: -1 }, { radius_meters: Infinity }, { name: ' ' }, { scope_level: 'unknown' }]) {
    assert.throws(() => domain.pointBody({ ...form, ...change }, org));
  }
  assert.equal(domain.pointCoordinates({ latitude: null, longitude: 0 }), null);
});

test('coordinate preview accepts decimal commas and zeroes and rejects invalid input', () => {
  assert.deepEqual(domain.previewCoordinates(' -23,5505 ', '-46.6333'), { latitude: -23.5505, longitude: -46.6333 });
  assert.deepEqual(domain.previewCoordinates('0', '0'), { latitude: 0, longitude: 0 });
  assert.throws(() => domain.previewCoordinates('', '0'), /Informe a latitude e a longitude/);
  for (const pair of [['91', '0'], ['0', '-181'], ['0x20', '0'], ['1,2.3', '0']]) {
    assert.throws(() => domain.previewCoordinates(...pair), /latitude entre -90 e 90/);
  }
});

test('scope hierarchy requires organization, entity and asset and drops unrelated UIDs', () => {
  assert.throws(() => domain.pointBody(form, null));
  assert.throws(() => domain.pointBody({ ...form, scope_level: 'asset', uid_asset: asset }, org));
  const body = domain.pointBody({ ...form, scope_level: 'asset', uid_entity: entity, uid_asset: asset }, org);
  assert.equal(body.uid_entity, entity);
  assert.equal(body.uid_asset, asset);
  const global = domain.pointBody({ ...form, scope_level: 'global', uid_entity: entity, uid_asset: asset }, org);
  for (const key of ['uid_entity', 'uid_asset', 'uid_organization']) assert.equal(key in global, false);
});

test('GeoJSON is preserved and point coordinates are a safe fallback', () => {
  const polygon = { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] };
  assert.deepEqual(domain.recordGeometry({ geojson: { type: 'Feature', geometry: polygon } }), polygon);
  assert.equal(domain.recordGeometry({}), null);
  assert.deepEqual(domain.recordGeometry({ latitude: 0, longitude: 0 }), { type: 'Point', coordinates: [0, 0] });
});

const polygon = { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] };
const fence = { ...form, shape: 'circle', entry_margin_meters: '5', exit_margin_meters: '10' };
const route = { ...form, lateral_margin_meters: '80', max_speed_kmh: '60', points: JSON.stringify([{ longitude: 0, latitude: 0, max_speed_to_next_kmh: 40 }, { longitude: 1, latitude: 1 }]) };

test('circle and polygon use documented fields and exclude stale geometry', () => {
  const circle = domain.fenceBody({ ...fence, geojson: polygon }, org);
  assert.equal(circle.radius_meters, 500);
  assert.equal(circle.entry_margin_meters, 5);
  assert.equal('geojson' in circle, false);
  const body = domain.fenceBody({ ...fence, shape: 'polygon', geojson: JSON.stringify(polygon) }, org);
  assert.deepEqual(body.geojson, polygon);
  assert.equal('latitude' in body, false);
  assert.equal('radius_meters' in body, false);
  for (const patch of [{ radius_meters: 0 }, { entry_margin_meters: -1 }, { exit_margin_meters: '' }, { shape: 'unknown' }, { shape: 'polygon', geojson: '{}' }, { shape: 'polygon', geojson: '{' }, { shape: 'polygon', geojson: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [2, 2]]] } }]) {
    assert.throws(() => domain.fenceBody({ ...fence, ...patch }, org));
  }
});

test('ordered route preserves segment speeds and rejects invalid or identical points', () => {
  const body = domain.routeBody(route, org);
  assert.equal(body.lateral_margin_meters, 80);
  assert.equal(body.max_speed_kmh, 60);
  assert.equal(body.points[0].max_speed_to_next_kmh, 40);
  assert.deepEqual(domain.recordGeometry(body), { type: 'LineString', coordinates: [[0, 0], [1, 1]] });
  for (const points of ['{', [], [{ latitude: 0, longitude: 0 }], [{ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 0 }], [{ latitude: 0, longitude: 0 }, { latitude: 91, longitude: 1 }], [{ latitude: 0, longitude: 0 }, { latitude: '1', longitude: 1 }]]) {
    assert.throws(() => domain.routeBody({ ...route, points }, org));
  }
  assert.equal(domain.routeBody({ ...route, max_speed_kmh: '' }, org).max_speed_kmh, null);
});

test('form numbers reject whitespace and booleans; blank segment speed uses route default', () => {
  for (const value of [' ', '\t', true, false, [], {}]) {
    assert.throws(() => domain.pointBody({ ...form, latitude: value }, org));
    assert.throws(() => domain.fenceBody({ ...fence, entry_margin_meters: value }, org));
    assert.equal(domain.pointCoordinates({ latitude: value, longitude: 0 }), null);
  }
  const body = domain.routeBody({ ...route, points: [{ latitude: 0, longitude: 0, max_speed_to_next_kmh: '' }, { latitude: 1, longitude: 1 }] }, org);
  assert.equal('max_speed_to_next_kmh' in body.points[0], false);
});

test('non-global queries require organization and reject unknown scopes before HTTP', () => {
  for (const list of [api.listPoints, api.listFences, api.listRoutes]) {
    assert.throws(() => list({ token: 'test-only', scopeLevel: 'asset' }), /organização/);
    assert.throws(() => list({ token: 'test-only', scopeLevel: 'unknown', organizationUid: org }), /escopo/);
  }
});

test('all GEO mutations and searches send the documented methods, bodies and keys', async () => {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: new URL(url), ...options });
    return new Response(options.method === 'DELETE' ? null : JSON.stringify({ uid: asset }), { status: options.method === 'DELETE' ? 204 : 200 });
  };
  try {
    for (const [resource, create, update, remove, search, body] of [
      ['points', api.createPoint, api.updatePoint, api.deletePoint, api.searchPoints, domain.pointBody(form, org)],
      ['geofences', api.createFence, api.updateFence, api.deleteFence, api.searchFences, domain.fenceBody(fence, org)],
      ['routes', api.createRoute, api.updateRoute, api.deleteRoute, api.searchRoutes, domain.routeBody(route, org)]
    ]) {
      for (let attempt = 0; attempt < 2; attempt++) await create({ token: 'test-only', body, idempotencyKey: 'retry-key' });
      assert.equal(calls.at(-1).headers['Idempotency-Key'], 'retry-key');
      assert.equal(calls.at(-2).body, calls.at(-1).body);
      assert.equal(calls.at(-1).url.pathname, `/v1/admin/geo/${resource}`);
      assert.equal(calls.at(-1).method, 'POST');
      await update({ token: 'test-only', uid: asset, body });
      assert.equal(calls.at(-1).method, 'PUT');
      assert.equal(calls.at(-1).url.pathname, `/v1/admin/geo/${resource}/${asset}`);
      assert.deepEqual(JSON.parse(calls.at(-1).body), body);
      const query = { filters: [{ field: 'uid_organization', operator: 'eq', value: org }], offset: 50, limit: 25 };
      await search({ token: 'test-only', body: query });
      assert.equal(calls.at(-1).url.pathname, `/v1/admin/geo/${resource}/search`);
      assert.equal(calls.at(-1).method, 'POST');
      assert.equal('Idempotency-Key' in calls.at(-1).headers, false);
      assert.deepEqual(JSON.parse(calls.at(-1).body), query);
      assert.equal(await remove({ token: 'test-only', uid: asset }), null);
      assert.equal(calls.at(-1).method, 'DELETE');
    }
    for (const call of calls) {
      assert.equal(call.headers.Authorization, 'Bearer test-only');
      assert.equal(call.cache, 'no-store');
    }
  } finally { globalThis.fetch = previous; }
});

test('canonical GEO errors reach the caller with the original HTTP status', async () => {
  const previous = globalThis.fetch;
  try {
    for (const [status, code] of [[403, 'geo_not_allowed'], [404, 'geo_not_found'], [409, 'geo_conflict'], [422, 'invalid_geo_payload'], [503, 'geo_storage_unavailable'], [400, 'invalid_geo_uid']]) {
      globalThis.fetch = async () => new Response(JSON.stringify({ error: code }), { status });
      await assert.rejects(api.getPoint({ token: 'test-only', uid: asset }), err => err.status === status && err.code === code);
    }
  } finally { globalThis.fetch = previous; }
});

test('HTTP contract: offset, scope isolation, Bearer, no-store, point body and retry key', async () => {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: new URL(url), ...options });
    return new Response(options.method === 'DELETE' ? null : JSON.stringify({ items: [], total: 0 }), { status: options.method === 'DELETE' ? 204 : 200 });
  };
  try {
    await api.listPoints({ token: 'test-only', organizationUid: org, scopeLevel: 'asset', q: ' Centro ', limit: 25, offset: 50 });
    const request = calls.at(-1);
    assert.equal(request.url.pathname, '/v1/admin/geo/points');
    assert.equal(request.url.searchParams.get('offset'), '50');
    assert.equal(request.url.searchParams.has('after_uid'), false);
    assert.deepEqual(JSON.parse(request.url.searchParams.get('filters')), [
      { field: 'scope_level', operator: 'eq', value: 'asset' },
      { field: 'uid_organization', operator: 'eq', value: org },
      { field: 'name', operator: 'contains', value: 'Centro' }
    ]);
    assert.equal(request.headers.Authorization, 'Bearer test-only');
    assert.equal(request.cache, 'no-store');
    for (const list of [api.listPoints, api.listFences, api.listRoutes]) {
      await list({ token: 'test-only', organizationUid: org, scopeLevel: 'global' });
      assert.deepEqual(JSON.parse(calls.at(-1).url.searchParams.get('filters')), [{ field: 'scope_level', operator: 'eq', value: 'global' }]);
    }
    const body = domain.pointBody(form, org);
    for (let attempt = 0; attempt < 2; attempt++) await api.createPoint({ token: 'test-only', body, idempotencyKey: 'same-intention' });
    assert.equal(calls.at(-1).headers['Idempotency-Key'], calls.at(-2).headers['Idempotency-Key']);
    assert.deepEqual(JSON.parse(calls.at(-1).body), body);
    await api.updatePoint({ token: 'test-only', uid: asset, body });
    assert.equal(calls.at(-1).method, 'PUT');
    assert.equal(calls.at(-1).url.pathname, `/v1/admin/geo/points/${asset}`);
    assert.equal(await api.deletePoint({ token: 'test-only', uid: asset }), null);
    assert.equal(calls.at(-1).method, 'DELETE');
  } finally { globalThis.fetch = previous; }
});
