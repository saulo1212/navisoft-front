import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://device-resolution.test';
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/devices.js', import.meta.url));
const organizationUid = '11111111-1111-4111-8111-111111111111';
const otherOrg = '22222222-2222-4222-8222-222222222222';
const uid = '33333333-3333-4333-8333-333333333333';
const args = { token: 'test-only', organizationUid };

async function capture(payload, run) {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: new URL(url), ...options, body: options.body && JSON.parse(options.body) });
    return new Response(JSON.stringify(payload));
  };
  try { await run(calls); } finally { globalThis.fetch = previous; }
}

test('identity search combines pagination and organization filters and preserves leading zeros', async () => {
  const payload = { items: [{ uid, uid_organization: organizationUid, device_number: '0000123' }], total: 10 };
  await capture(payload, async calls => {
    const result = await api.listProtocolIdentities({ ...args, q: ' 0000123 ', vendor: ' suntech ', model: '229', deviceUid: uid, active: false, limit: 5, offset: 5 });
    assert.equal(result.items[0].device_number, '0000123');
    const [request] = calls;
    assert.equal(request.method, 'POST');
    assert.equal(request.url.pathname, '/v1/admin/devices/protocol-identities/search');
    assert.deepEqual(request.body, { q: '0000123', limit: 5, offset: 5, filters: [
      { field: 'uid_organization', operator: 'eq', value: organizationUid },
      { field: 'vendor', operator: 'eq', value: 'suntech' },
      { field: 'model', operator: 'eq', value: '229' },
      { field: 'uid_device', operator: 'eq', value: uid },
      { field: 'active', operator: 'eq', value: 'false' }
    ] });
  });
});

test('mapping GET and POST use the same scoped manufacturer, model and state filters', async () => {
  await capture({ items: [] }, async calls => {
    const filters = { ...args, protocolModel: '00229', manufacturerUid: uid, active: true, q: '002', limit: 500 };
    await api.listTelemetryMappings({ ...filters, search: false });
    await api.listTelemetryMappings(filters);
    const [get, post] = calls;
    assert.equal(get.method, 'GET');
    assert.equal(get.url.pathname, '/v1/admin/devices/telemetry-mappings');
    assert.deepEqual(JSON.parse(get.url.searchParams.get('filters')), post.body.filters);
    assert.equal(get.url.searchParams.get('q'), '002');
    assert.equal(get.url.searchParams.get('offset'), '0');
    assert.equal(get.url.searchParams.get('limit'), '500');
    assert.deepEqual(post.body.filters.map(filter => filter.field), ['uid_organization', 'uid_manufacturer', 'protocol_model', 'active']);
  });
});

test('profile details and device overrides use distinct endpoints and reject foreign data', async () => {
  await capture({ uid, uid_device: uid, uid_organization: otherOrg, items: [{ uid, uid_organization: otherOrg }] }, async calls => {
    await assert.rejects(api.getTelemetryMapping({ ...args, uid }), { status: 404 });
    await assert.rejects(api.getDeviceTelemetryOverride({ ...args, deviceUid: uid }), { status: 404 });
    await assert.rejects(api.listTelemetryMappings(args), { status: 403 });
    assert.deepEqual(calls.map(call => call.url.pathname), [
      `/v1/admin/devices/telemetry-mappings/${uid}`,
      `/v1/admin/devices/${uid}/telemetry-mapping`,
      '/v1/admin/devices/telemetry-mappings/search'
    ]);
  });
});
