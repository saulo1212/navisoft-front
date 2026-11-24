import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://drivers.test';
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/drivers.js', import.meta.url));
const access = await importBrowserModule(new URL('../src/lib/navigation/access.js', import.meta.url));
const organizationUid = '11111111-1111-4111-8111-111111111111';
const otherOrg = '22222222-2222-4222-8222-222222222222';
const uid = '33333333-3333-4333-8333-333333333333';
const driver = { uid, uid_organization: organizationUid, active: true };
const args = { token: 'test-only', organizationUid, uid };

async function capture(run, payload) {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: new URL(url), ...options, body: options.body && JSON.parse(options.body) });
    return new Response(JSON.stringify(payload));
  };
  try { await run(calls); } finally { globalThis.fetch = previous; }
}

test('drivers menu and direct routes require the drivers area', () => {
  const menu = [{ key: 'drivers', url: '/motoristas' }];
  for (const permission of ['allowed', 'denied']) {
    const context = { status: 'evaluated', areas: { drivers: permission, entities: 'allowed', checklists: 'allowed' } };
    assert.equal(access.canAccessPath('/motoristas/detalhe/', context), permission === 'allowed');
    assert.equal(access.accessibleMenu(menu, context).length, permission === 'allowed' ? 1 : 0);
    assert.equal(access.canAccessPath('/checklists/execucoes', context), true);
  }
});

test('driver search sends server pagination, organization and active filter', async () => {
  const payload = { items: [driver], total: 42 };
  await capture(async calls => {
    assert.deepEqual(await api.searchDrivers({ ...args, q: '  Ana ', limit: 20, offset: 20 }), payload);
    assert.equal(calls[0].url.pathname, '/v1/admin/entities/drivers/search');
    assert.equal(calls[0].method, 'POST');
    assert.deepEqual(calls[0].body, {
      filters: [
        { field: 'uid_organization', operator: 'eq', value: organizationUid },
        { field: 'active', operator: 'eq', value: 'true' }
      ],
      q: 'Ana', limit: 20, offset: 20, include_inactive: false
    });
    await api.searchDrivers({ ...args, includeInactive: true });
    assert.equal(calls[1].body.include_inactive, true);
    assert.equal(calls[1].body.filters.length, 1);
  }, payload);
});

test('requests reject records outside the selected organization and block cross-organization updates', async () => {
  const foreign = { ...driver, uid_organization: otherOrg };
  await capture(async calls => {
    await assert.rejects(api.searchDrivers(args), { status: 403 });
    await assert.rejects(api.patchDriver({ ...args, body: { active: false } }), { status: 404 });
    assert.deepEqual(calls.map(call => call.method), ['POST', 'GET']);
  }, { ...foreign, items: [foreign] });
});

test('active-only lookup blocks stale checklist selections and management can read inactive drivers', async () => {
  const inactive = { ...driver, active: false };
  await capture(async calls => {
    await assert.rejects(api.searchDrivers(args), { status: 403 });
    await assert.rejects(api.getDriver(args), { status: 404 });
    assert.deepEqual(await api.getDriver({ ...args, includeInactive: true }), inactive);
    assert.equal(calls[2].url.searchParams.get('include_inactive'), 'true');
  }, { item: inactive, items: [inactive] });
});

test('creation uses idempotency and preserves leading zeros; inactivation is a partial update', async () => {
  const fields = { name: ' Ana ', birth_date: '1990-01-01', internal_contract_number: '00012' };
  await capture(async calls => {
    await api.createDriver({ ...args, fields, idempotencyKey: uid });
    assert.equal(calls[0].headers['Idempotency-Key'], uid);
    assert.deepEqual(calls[0].body, { ...fields, name: 'Ana', uid_organization: organizationUid, scopes: [{}] });
    await api.patchDriver({ ...args, body: { active: false } });
    assert.equal(calls[2].method, 'PATCH');
    assert.deepEqual(calls[2].body, { active: false });
  }, driver);
});
