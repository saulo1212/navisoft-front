import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const modules = new Map();
async function moduleUrl(url) {
  if (modules.has(url.href)) return modules.get(url.href);
  let source = await readFile(url, 'utf8');
  for (const match of [...source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)]) source = source.replace(match[0], `from '${await moduleUrl(new URL(`${match[1]}.js`, url))}'`);
  const encoded = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  modules.set(url.href, encoded);
  return encoded;
}
process.env.NEXT_PUBLIC_API_BASE_URL = 'https://technical.test';
const domain = await import(await moduleUrl(new URL('../src/lib/domain/technicalOperations.js', import.meta.url)));
const tech = await import(await moduleUrl(new URL('../src/lib/api/endpoints/technicians.js', import.meta.url)));
const wo = await import(await moduleUrl(new URL('../src/lib/api/endpoints/workorders.js', import.meta.url)));
const maintenance = await import(await moduleUrl(new URL('../src/lib/api/endpoints/maintenance.js', import.meta.url)));
const org = '11111111-1111-4111-8111-111111111111';
const uid = '22222222-2222-4222-8222-222222222222';
const other = '33333333-3333-4333-8333-333333333333';
const args = { token: 'test-only', organizationUid: org, technicianUid: uid, workOrderUid: uid, custodyUid: other, uid };
const item = { slot_number: '1', operation: 'install', uid_device_after: other };
const form = { uid_asset: uid, uid_technician: other, description: ' OS ', items: [item] };
const price = { capability_code: 'vehicle_cameras', operation: 'install', technician_cost_cents: '10001', markup_percent: '12.34', currency_code: 'brl' };
async function capture(run, payload = {}) {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: new URL(url), ...options, json: options.body === undefined ? undefined : JSON.parse(options.body) });
    return new Response(JSON.stringify(payload), { status: 200 });
  };
  try { return { result: await run(), calls }; } finally { globalThis.fetch = previous; }
}

test('technician body validates organization/provider and never invents credentials', () => {
  assert.deepEqual(domain.technicianBody({ uid_provider_entity: uid, name: ' Técnico ', active: true }, org), { uid_organization: org, uid_provider_entity: uid, name: 'Técnico', active: true });
  for (const change of [{ uid_provider_entity: '' }, { name: ' ' }]) assert.throws(() => domain.technicianBody({ uid_provider_entity: uid, name: 'Técnico', ...change }, org));
});
test('price replacement uses cents and distinct capability/operation pairs', () => {
  assert.deepEqual(domain.priceBody([price]).items[0], { ...price, technician_cost_cents: 10001, markup_percent: 12.34, currency_code: 'BRL' });
  assert.throws(() => domain.priceBody([price, price]), /repetidos/);
  for (const change of [{ technician_cost_cents: -1 }, { technician_cost_cents: 0.5 }, { technician_cost_cents: ' ' }, { markup_percent: true }, { operation: 'unknown' }, { currency_code: 'R$' }]) assert.throws(() => domain.priceBody([{ ...price, ...change }]));
  assert.deepEqual(domain.priceBody([]), { items: [] });
});
test('work order creation sends real slot/device fields without organization', () => {
  const body = domain.workOrderBody(form);
  assert.equal('uid_organization' in body, false);
  assert.deepEqual(body.items[0], { slot_number: 1, operation: 'install', uid_device_before: null, uid_device_after: other });
  assert.equal(body.description, 'OS');
});
test('remove, replace and maintenance preserve the correct device identities', () => {
  for (const [operation, after] of [['remove', null], ['replace', other], ['maintenance', uid]]) {
    const body = domain.workOrderBody({ ...form, items: [{ slot_number: 1, operation, uid_device_before: uid, uid_device_after: other }] });
    assert.equal(body.items[0].uid_device_after, after);
    assert.equal(body.items[0].uid_device_before, uid);
  }
  assert.throws(() => domain.workOrderBody({ ...form, items: [{ ...item, operation: 'replace', uid_device_before: other }] }), /distintos/);
});
test('invalid work orders are rejected before mutations', () => {
  for (const items of [[], [item, item], [{ ...item, slot_number: 0 }], [{ ...item, slot_number: 1.5 }], [{ ...item, uid_device_after: '' }], [{ ...item, operation: 'unknown' }], [{ ...item, operation: 'remove' }]]) assert.throws(() => domain.workOrderBody({ ...form, items }));
});
test('work order context requires the selected organization and an active executor', () => {
  domain.assertWorkOrderContext({ uid_organization: org }, { uid_organization: org, active: true }, org);
  assert.throws(() => domain.assertWorkOrderContext({ uid_organization: other }, { uid_organization: org, active: true }, org));
  assert.throws(() => domain.assertWorkOrderContext({ uid_organization: org }, { uid_organization: org, active: false }, org));
});
test('completion supports a subset and explicit fail/pass; it never invents OK', () => {
  const body = domain.completionBody([{ uid_item: uid, result_notes: '', tests: [{ test_code: 'boot', result: 'fail', notes: ' Sem transmissão ' }] }]);
  assert.equal(body.items.length, 1);
  assert.equal(body.items[0].result_notes, null);
  assert.deepEqual(body.items[0].tests, [{ test_code: 'boot', result: 'fail', notes: 'Sem transmissão' }]);
  assert.throws(() => domain.completionBody([]));
  assert.throws(() => domain.completionBody([{ uid_item: uid }, { uid_item: uid }]));
  assert.throws(() => domain.completionBody([{ uid_item: uid, tests: [{ test_code: 'boot', result: 'ok' }] }]));
});
test('intent keys survive retries and change only with the action or body', () => {
  const ref = { current: null };
  const key = domain.intentKey(ref, 'complete', { items: [uid] });
  assert.equal(domain.intentKey(ref, 'complete', { items: [uid] }), key);
  const next = domain.intentKey(ref, 'complete', { items: [other] });
  assert.notEqual(next, key);
  assert.notEqual(domain.intentKey(ref, 'create', { items: [other] }), next);
});
test('maintenance creation is explicit about organization, asset, items and blocking conditions', () => {
  const body = domain.maintenanceBody({ uid_asset: uid, description: ' Revisão ', items: [{ description: 'Inspecionar' }], conditions: [{ description: 'Falha', blocking: true }] }, org);
  assert.equal(body.uid_organization, org);
  assert.equal(body.conditions[0].blocking, true);
  assert.throws(() => domain.maintenanceBody({ uid_asset: uid, description: 'Revisão', items: [] }, org));
});
test('technician and maintenance lists use central filters and offset, never cursors', async () => {
  const { calls } = await capture(async () => {
    await tech.listTechnicians({ ...args, q: ' Técnico ', offset: 50, limit: 25 });
    await maintenance.listMaintenance({ ...args, offset: 100, limit: 25 });
  });
  assert.equal(calls[0].url.pathname, '/v1/admin/entities/technicians/search');
  assert.equal(calls[1].url.pathname, '/v1/admin/maintenance/orders/search');
  assert.deepEqual(calls[0].json.filters, [{ field: 'uid_organization', operator: 'eq', value: org }, { field: 'name', operator: 'contains', value: 'Técnico' }]);
  assert.equal(calls[0].json.offset, 50);
  for (const call of calls) { assert.equal(call.method, 'POST'); assert.equal('after_uid' in call.json, false); assert.equal(call.cache, 'no-store'); assert.equal(call.headers.Authorization, 'Bearer test-only'); }
});
test('capabilities use PATCH and prices use a separate full PUT /prices', async () => {
  const { calls } = await capture(async () => {
    await tech.listTechnicianCapabilities(args);
    await tech.replaceCapabilities({ ...args, codes: ['installation', 'vehicle_cameras'] });
    await tech.getTechnicianPrices(args);
    await tech.replaceTechnicianPrices({ ...args, body: domain.priceBody([price]) });
    await tech.linkTechnicianUser({ ...args, userUid: null });
  });
  assert.equal(calls[0].url.pathname, '/v1/admin/entities/technician-capabilities');
  assert.equal(calls[1].method, 'PATCH');
  assert.equal(calls[1].url.pathname, `/v1/admin/entities/technicians/${uid}`);
  assert.deepEqual(calls[1].json, { capabilities: ['installation', 'vehicle_cameras'] });
  assert.equal(calls[3].method, 'PUT');
  assert.equal(calls[3].url.pathname, `/v1/admin/entities/technicians/${uid}/prices`);
  assert.deepEqual(calls[4].json, { uid_user: null });
});
test('work order admin and executor lists respect state; executor never sends technician or organization filters', async () => {
  const { calls } = await capture(async () => {
    await wo.listWorkOrders({ ...args, state: 'all', offset: 25 });
    await wo.listWorkOrders({ ...args, state: 'completed', selfService: true, technicianUid: other });
  });
  assert.equal(calls[0].json.state, 'all');
  assert.equal(calls[0].json.offset, 25);
  assert.equal(calls[0].json.filters[0].value, org);
  assert.equal(calls[1].url.pathname, '/v1/technician/work-orders/search');
  assert.deepEqual(calls[1].json, { state: 'completed', filters: [], limit: 50, offset: 0 });
});
test('executor responses remove nested prices while preserving item results and blockers', async () => {
  const payload = { uid, pricing_snapshot: { total_cents: 10 }, items: [{ uid_item: other, required_capability: { code: 'telemetry' }, pricing_snapshot: {}, technician_cost_cents: 10, markup_percent: 10, currency_code: 'BRL', tests: [{ test_code: 'boot', result: 'fail' }] }], completed: false, blockers: ['boot'] };
  const { result, calls } = await capture(() => wo.completeWorkOrder({ ...args, selfService: true, body: { items: [{ uid_item: other }] }, idempotencyKey: 'same-intention' }), payload);
  assert.equal(calls[0].url.pathname, `/v1/technician/work-orders/${uid}/complete`);
  assert.equal(calls[0].headers['Idempotency-Key'], 'same-intention');
  assert.equal(result.completed, false);
  assert.deepEqual(result.blockers, ['boot']);
  assert.equal('pricing_snapshot' in result, false);
  assert.deepEqual(result.items[0], { uid_item: other, required_capability: { code: 'telemetry' }, tests: [{ test_code: 'boot', result: 'fail' }] });
});
test('custody actions address custody UIDs, not work order UIDs', async () => {
  const { calls } = await capture(async () => {
    await wo.confirmCustody({ ...args, selfService: true });
    await wo.declareReturn({ ...args, body: { condition: 'testing', notes: 'Retorno' } });
    await wo.receiveReturn(args);
  });
  assert.equal(calls[0].url.pathname, `/v1/technician/custody/${other}/confirm-receipt`);
  assert.equal(calls[1].url.pathname, `/v1/admin/devices/custody/${other}/declare-return`);
  assert.equal(calls[2].url.pathname, `/v1/admin/devices/custody/${other}/receive`);
});
test('technician receipt is distinct from physical receipt by the organization', () => {
  const custody = { status: 'with_technician', closed_at: null, received_at: null, technician_received_at: null };
  assert.equal(domain.custodyNeedsConfirmation(custody), true);
  assert.equal(domain.custodyNeedsConfirmation({ ...custody, technician_received_at: '2026-11-15T12:00:00Z' }), false);
  assert.equal(domain.custodyNeedsConfirmation({ ...custody, status: 'return_pending' }), false);
  assert.equal(domain.custodyNeedsConfirmation({ ...custody, closed_at: '2026-11-15T12:00:00Z' }), false);
});
test('maintenance create/transition preserve keys and query organization; PATCH merges without replacement', async () => {
  const { calls } = await capture(async () => {
    await maintenance.createMaintenance({ ...args, body: { uid_organization: org }, idempotencyKey: 'create-key' });
    await maintenance.patchMaintenance({ ...args, body: { items: [{ description: 'Novo item' }] } });
    await maintenance.transitionMaintenance({ ...args, body: { status: 'completed', resolve_conditions: [other] }, idempotencyKey: 'transition-key' });
  });
  assert.equal(calls[0].headers['Idempotency-Key'], 'create-key');
  assert.equal(calls[1].method, 'PATCH');
  assert.equal(calls[1].url.searchParams.get('uid_organization'), org);
  assert.deepEqual(calls[1].json, { items: [{ description: 'Novo item' }] });
  assert.equal(calls[2].headers['Idempotency-Key'], 'transition-key');
  assert.equal(calls[2].url.pathname, `/v1/admin/maintenance/orders/${uid}/transition`);
  assert.deepEqual(calls[2].json, { status: 'completed', resolve_conditions: [other] });
});
test('business errors preserve status/code rather than promoting failed operations to success', async () => {
  const previous = globalThis.fetch;
  try {
    for (const [status, code] of [[403, 'area_not_allowed'], [404, 'device_not_found'], [409, 'device_custody_confirmation_required'], [422, 'invalid_maintenance_transition'], [503, 'maintenance_storage_unavailable']]) {
      globalThis.fetch = async () => new Response(JSON.stringify({ error: code }), { status });
      await assert.rejects(wo.startWorkOrder(args), err => err.status === status && err.code === code);
    }
  } finally { globalThis.fetch = previous; }
});
