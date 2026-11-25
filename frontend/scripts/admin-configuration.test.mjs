import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://admin-configuration.example.test';
const domain = await importBrowserModule(new URL('../src/lib/domain/adminConfiguration.js', import.meta.url));
const endpoint = filename => importBrowserModule(new URL(`../src/lib/api/endpoints/${filename}.js`, import.meta.url));
const [collaborators, billing, devices, events, fleet] = await Promise.all(
  ['collaborators', 'billing', 'devices', 'events', 'fleet'].map(endpoint)
);
const uid = '11111111-1111-4111-8111-111111111111';
const organizationUid = '22222222-2222-4222-8222-222222222222';
const assignmentUid = '33333333-3333-4333-8333-333333333333';
const auth = { token: 'test-only', uid, organizationUid, assignmentUid };

function requests(t) {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: new URL(url), ...options, body: options.body && JSON.parse(options.body) });
    return Response.json({}, { status: 200 });
  });
  return calls;
}

test('assignment history uses a filter, writes use the selected organization and dates remain date-only', async t => {
  const calls = requests(t);
  await collaborators.listAssignmentManagers({ ...auth, limit: 20 });
  const body = { ...domain.datePeriod('2026-11-24'), uid_manager_assignment: uid };
  await collaborators.addAssignmentManager({ ...auth, body, idempotencyKey: 'same-intent' });
  await collaborators.endAssignmentWorkMode({ ...auth, periodUid: uid, body: { ended_on: '2026-12-01' } });
  assert.equal(calls[0].url.pathname, `/v1/admin/collaborators/${uid}/assignments/${assignmentUid}/managers`);
  assert.deepEqual(JSON.parse(calls[0].url.searchParams.get('filters')), [{ field: 'uid_organization', operator: 'eq', value: organizationUid }]);
  assert.equal(calls[1].url.searchParams.get('uid_organization'), organizationUid);
  assert.equal(calls[1].headers['Idempotency-Key'], 'same-intent');
  assert.deepEqual(calls[1].body, body);
  assert.equal(calls[2].method, 'PATCH');
  assert.throws(() => domain.datePeriod('2026-11-24', '2026-11-23'), /datas/);
});

test('telemetry keeps identity zeros and sends flat replacement separate from an explicit reset', async t => {
  const calls = requests(t);
  await devices.saveProtocolIdentity({ ...auth, uid: undefined, body: { device_number: '000229', uid_device: uid }, idempotencyKey: 'same-intent' });
  await devices.saveProtocolIdentity({ ...auth, body: { device_number: '000229', uid_device: uid, active: false } });
  const replace = { source: 'ADDR', mode: 'replace', canonical: 'voltage', type: 'number', offset: 0 };
  const overrides = domain.telemetryRules(JSON.stringify([replace, { source: 'IGN', mode: 'remove', type: 'ignored' }]), true);
  await devices.setDeviceTelemetryOverride({ ...auth, deviceUid: uid, body: { overrides } });
  await devices.setDeviceTelemetryOverride({ ...auth, deviceUid: uid, body: { overrides: [] } });
  assert.deepEqual(calls.slice(0, 2).map(call => [call.method, call.body.device_number, call.body.uid_organization]), [
    ['POST', '000229', organizationUid], ['PUT', '000229', organizationUid]
  ]);
  assert.equal(calls[0].headers['Idempotency-Key'], 'same-intent');
  assert.equal(calls[1].headers['Idempotency-Key'], undefined);
  assert.deepEqual(calls[2].body.overrides, [replace, { source: 'IGN', mode: 'remove' }]);
  assert.deepEqual(calls[3].body, { overrides: [] });
  assert.throws(() => domain.telemetryRules(JSON.stringify([{ source: 'ADDR', mode: 'replace', mapping: replace }]), true), /canônico/);
});

test('event publication uses a separate action and draft validation requires a compatible model and variant', async t => {
  const calls = requests(t);
  const variant = { uid, uid_model: assignmentUid, code: 'MODEL01' };
  const binding = { uid_model: assignmentUid, variantUid: uid, valid_from: '2026-11-24T10:00:00-03:00' };
  const rule = { source_code: 'ignition_on', uid_event_model: uid, strategy: 'instant' };
  const fields = { code: 'mapa', name: 'Mapa', active: 'on', rules: JSON.stringify([rule]) };
  const body = domain.technicalMapBody(fields, [binding], [variant]);
  assert.deepEqual(body.models, [{ uid_model: assignmentUid, protocol_variant: 'MODEL01', valid_from: '2026-11-24T13:00:00.000Z', valid_until: null }]);
  assert.throws(() => domain.technicalMapBody(fields, [{ ...binding, uid_model: organizationUid }], [variant]), /pertença/);
  assert.throws(() => domain.uniqueRows([{ signal_code: 'SINAL' }, { signal_code: 'sinal' }], 'signal_code', 'sinais'), /duplicados/);
  await events.saveEventTechnicalMap({ ...auth, body });
  await events.publishEventTechnicalMap(auth);
  assert.deepEqual(calls.map(call => [call.method, call.url.pathname, call.body]), [
    ['PUT', `/v1/admin/events/technical-maps/${uid}`, body], ['POST', `/v1/admin/events/technical-maps/${uid}/publish`, {}]
  ]);
});

test('financial removal keeps the confirmation body and valuation retains the HTTP status', async t => {
  const calls = requests(t);
  const body = { reason: 'Teste', confirm_removal: true };
  await billing.removeOrganizationBillingAccount({ ...auth, body });
  await fleet.setAssetTechnicalPackage({ ...auth, assetUid: uid, body: { uid_technical_package: assignmentUid } });
  const valuation = await fleet.getAssetValuation({ ...auth, assetUid: uid });
  assert.equal(calls[0].url.pathname, `/v1/admin/organizations/${organizationUid}/billing-account`);
  assert.equal(calls[0].method, 'DELETE');
  assert.deepEqual(calls[0].body, body);
  assert.deepEqual(calls[1].body, { uid_technical_package: assignmentUid });
  assert.equal(valuation.status, 200);
});

test('device catalog sends the full model on PUT and uses idempotency keys on creation', async t => {
  const calls = requests(t);
  const type = { name: 'Rastreador', active: true };
  const model = { name: 'Modelo A', active: false, uid_type: uid, uid_manufacturer: assignmentUid, requires_simcard: true };
  await devices.createDeviceType({ token: auth.token, body: type, idempotencyKey: 'type' });
  await devices.saveDeviceModel({ token: auth.token, body: model, idempotencyKey: 'model' });
  await devices.getDeviceModel(auth);
  await devices.saveDeviceModel({ ...auth, body: { ...model, requires_simcard: false } });
  assert.deepEqual(calls.map(call => [call.method, call.url.pathname, call.headers['Idempotency-Key'], call.body]), [
    ['POST', '/v1/admin/devices/types', 'type', type],
    ['POST', '/v1/admin/devices/models', 'model', model],
    ['GET', `/v1/admin/devices/models/${uid}`, undefined, undefined],
    ['PUT', `/v1/admin/devices/models/${uid}`, undefined, { ...model, requires_simcard: false }]
  ]);
});

test('protocol variants are global and preserve the selected model in the idempotent create', async t => {
  const calls = requests(t);
  const body = { uid_model: assignmentUid, code: 'VARIANT', name: 'Variante' };
  await events.createEventProtocolVariant({ ...auth, body, idempotencyKey: 'variant' });
  await events.getEventProtocolVariant(auth);
  assert.deepEqual(calls.map(call => [call.method, call.url.pathname, call.url.search, call.body]), [
    ['POST', '/v1/admin/events/protocol-variants', '', body],
    ['GET', `/v1/admin/events/protocol-variants/${uid}`, '', undefined]
  ]);
  assert.equal(calls[0].headers['Idempotency-Key'], 'variant');
});

test('assignment detail and updates are scoped and PATCH retains an explicit false', async t => {
  const calls = requests(t);
  await collaborators.getAssignment(auth);
  await collaborators.updateAssignment({ ...auth, body: { is_primary: false } });
  await collaborators.updateAssignment({ ...auth, body: { ended_on: '2027-02-28' } });
  assert.deepEqual(calls.map(call => [call.method, call.body]), [
    ['GET', undefined], ['PATCH', { is_primary: false }], ['PATCH', { ended_on: '2027-02-28' }]
  ]);
  for (const call of calls) {
    assert.equal(call.url.pathname, `/v1/admin/collaborators/${uid}/assignments/${assignmentUid}`);
    assert.equal(call.url.searchParams.get('uid_organization'), organizationUid);
    assert.equal(call.cache, 'no-store');
  }
});
