import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://events-notifications.test';
const domain = await importBrowserModule(new URL('../src/lib/domain/eventsNotifications.js', import.meta.url));
const events = await importBrowserModule(new URL('../src/lib/api/endpoints/events.js', import.meta.url));
const notifications = await importBrowserModule(new URL('../src/lib/api/endpoints/notifications.js', import.meta.url));
const org = '11111111-1111-4111-8111-111111111111';
const uid = '22222222-2222-4222-8222-222222222222';
const other = '33333333-3333-4333-8333-333333333333';
const args = { token: 'test-only', organizationUid: org, uid };
const model = { uid, active: true, fixed: false, periodic: false, activation_only: false, allowed_parameters: { states: 'array', enabled: 'boolean' } };
const ruleForm = () => domain.eventRuleForm({ uid_model: uid, name: 'Ignição', parameters: { states: ['on', 'off'] } });
async function capture(operation, status = 200, payload = {}) {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ ...options, url: new URL(url), json: options.body === undefined ? undefined : JSON.parse(options.body) });
    return new Response(status === 204 ? null : JSON.stringify(payload), { status });
  };
  try { return { calls, result: await operation() }; } finally { globalThis.fetch = previous; }
}
test('new operational rule is inactive, scoped and sends one compound target', () => {
  const body = domain.eventRuleBody({ ...ruleForm(), uid_entity: other, uid_group: uid }, org, model);
  assert.equal(body.active, false);
  assert.deepEqual(body.target, { uid_organization: org, uid_entity: other, uid_group: uid });
  assert.equal('targets' in body, false);
  assert.equal('original' in body, false);
});
test('rule PUT preserves conditions, windows, recipients, delays and precise validity dates', () => {
  const row = { uid, uid_organization: org, uid_model: uid, name: 'Regra', priority: 'high', active: false, target: { uid_organization: org, uid_asset: other, scope_level: 'asset' }, parameters: { enabled: false }, conditions: [{ field: 'ignition', operator: 'eq', value: false }], windows: [{ start_isodow: 6, start_time: '14:00:00', end_isodow: 1, end_time: '07:00:00' }], recipients: [other], delayed_seconds: 10, condition_for_seconds: 5, recovery_for_seconds: 3, valid_from: '2026-11-17T12:00:56.123Z', valid_until: null };
  const body = domain.eventRuleBody(domain.eventRuleForm(row), org, model);
  for (const key of ['conditions', 'windows', 'recipients', 'delayed_seconds', 'condition_for_seconds', 'recovery_for_seconds', 'valid_from', 'valid_until', 'active', 'parameters']) assert.deepEqual(body[key], row[key]);
});
test('legacy multi-target rules and cross-tenant replacements cannot silently lose scope', () => {
  assert.throws(() => domain.eventRuleForm({ targets: [{ uid_asset: uid }, { uid_asset: other }] }));
  assert.throws(() => domain.eventRuleBody({ ...ruleForm(), original: { uid_organization: other } }, org, model));
});
test('unsupported model modes, unknown parameters and invalid types are rejected', () => {
  for (const patch of [{ active: false }, { fixed: true }, { periodic: true }, { activation_only: true }, { uid: other }]) assert.throws(() => domain.eventRuleBody(ruleForm(), org, { ...model, ...patch }));
  for (const parameters of ['{"unknown":1}', '{"states":"on"}', '{"enabled":"false"}', '[]']) assert.throws(() => domain.eventRuleBody({ ...ruleForm(), parameters }, org, model));
});
test('window crossing week is accepted, malformed day/time and negative delays are rejected', () => {
  const windows = JSON.stringify([{ start_isodow: 6, start_time: '14:00', end_isodow: 1, end_time: '07:00' }]);
  assert.equal(domain.eventRuleBody({ ...ruleForm(), windows }, org, model).windows.length, 1);
  for (const patch of [{ delayed_seconds: -1 }, { delayed_seconds: 0.5 }, { priority: 'bad' }, { uid_asset: 'bad' }, { windows: windows.replace('14:00', '24:00') }, { valid_from: '2026-11-19T12:00', valid_until: '2026-11-18T12:00' }]) assert.throws(() => domain.eventRuleBody({ ...ruleForm(), ...patch }, org, model));
});
test('occurrence actions have distinct mandatory text and never create an occurrence', () => {
  assert.deepEqual(domain.occurrenceActionBody('acknowledge', 'ignored'), { action: 'acknowledge' });
  assert.deepEqual(domain.occurrenceActionBody('note', ' Retorno '), { action: 'note', note: 'Retorno' });
  assert.deepEqual(domain.occurrenceActionBody('close', ' Resolvido '), { action: 'close', resolution: 'Resolvido' });
  for (const action of ['note', 'close', 'unknown']) assert.throws(() => domain.occurrenceActionBody(action, ' '));
  assert.equal('createEventOccurrence' in events, false);
});
test('global models/fields do not inherit tenant filter; rules/occurrences always do', async () => {
  for (const fetcher of [events.listEventModels, events.listEventFields, events.listEventRules, events.listEventOccurrences]) {
    const { calls: [call] } = await capture(() => fetcher({ ...args, limit: 5, offset: 10 }));
    const filters = JSON.parse(call.url.searchParams.get('filters'));
    assert.equal(filters.some(filter => filter.field === 'uid_organization' && filter.value === org), [events.listEventRules, events.listEventOccurrences].includes(fetcher));
    assert.equal(call.url.searchParams.get('offset'), '10');
  }
  assert.throws(() => events.listEventRules({ token: 'x', organizationUid: '' }));
});
test('rule create and replacement anchor organization, preserve idempotency and abort signal', async () => {
  const controller = new AbortController();
  for (const [operation, method] of [[events.createEventRule, 'POST'], [events.updateEventRule, 'PUT']]) {
    const { calls: [call] } = await capture(() => operation({ ...args, body: { uid_organization: other }, signal: controller.signal, idempotencyKey: uid }));
    assert.equal(call.json.uid_organization, org); assert.equal(call.signal, controller.signal); assert.equal(call.method, method);
    if (method === 'POST') assert.equal(call.headers['Idempotency-Key'], uid);
  }
});
test('occurrence detail/treatment and rule delete carry tenant context without unscoped calls', async () => {
  for (const operation of [events.getEventOccurrence, events.treatEventOccurrence, events.getEventRule, events.deleteEventRule]) {
    const { calls: [call] } = await capture(() => operation({ ...args, body: { action: 'acknowledge' } }));
    assert.equal(call.url.searchParams.get('uid_organization'), org);
    assert.equal(call.method, operation === events.treatEventOccurrence ? 'PATCH' : operation === events.deleteEventRule ? 'DELETE' : 'GET');
  }
});
const recipient = () => domain.notificationRecipientForm({ kind: 'external', name: 'Contato', active: false, endpoints: [{ service: 'email', destination: 'qa@example.test', active: false }], organization_bindings: [{ uid_organization: org }], entity_bindings: [{ uid_entity: uid }], asset_bindings: [{ uid_asset: other }] });
test('notification recipient preserves all binding arrays and false flags on replacement', () => {
  const body = domain.notificationRecipientBody(recipient(), org);
  assert.equal(body.active, false); assert.equal(body.endpoints[0].active, false);
  assert.deepEqual(body.organization_bindings, [{ uid_organization: org }]);
  assert.deepEqual(body.entity_bindings, [{ uid_entity: uid }]); assert.deepEqual(body.asset_bindings, [{ uid_asset: other }]);
  assert.equal('verified' in body, false); assert.equal('original' in body, false);
});
test('recipient replacement strips generated endpoint UID while preserving metadata', () => {
  const form = recipient();
  form.endpoints[0] = { ...form.endpoints[0], uid, metadata: { locale: 'pt-BR' } };
  const body = domain.notificationRecipientBody(form, org);
  assert.equal('uid' in body.endpoints[0], false);
  assert.deepEqual(body.endpoints[0].metadata, { locale: 'pt-BR' });
});
test('linked recipients are read-only rather than silently converted, foreign bindings rejected', () => {
  for (const patch of [{ kind: 'contact' }, { organization_bindings: JSON.stringify([{ uid_organization: other }]) }, { original: { uid_organization: other } }, { endpoints: [] }, { endpoints: [{ service: 'email', destination: 'bad', active: true }] }]) assert.throws(() => domain.notificationRecipientBody({ ...recipient(), ...patch }, org));
});
test('hook replacement preserves multi-action template content and false active state', () => {
  const payload = { actions: [{ service: 'email', to: ['{{ organization.email }}'], message: '{{ organization.name }}' }], custom: { items: [] } };
  assert.deepEqual(domain.notificationHookBody({ active: false, payload: JSON.stringify(payload), version: 99, scope: 'default' }), { active: false, payload });
  assert.throws(() => domain.notificationHookBody({ payload: '{}' }));
});
test('notification recipient APIs scope every call and use their own domain', async () => {
  for (const operation of [notifications.listNotificationRecipients, notifications.getNotificationRecipient, notifications.createNotificationRecipient, notifications.updateNotificationRecipient, notifications.deleteNotificationRecipient]) {
    const { calls: [call] } = await capture(() => operation({ ...args, body: {}, idempotencyKey: uid }));
    assert.equal(call.url.searchParams.get('uid_organization'), org);
    assert.ok(call.url.pathname.startsWith('/v1/admin/notifications/recipients'));
    if (operation === notifications.createNotificationRecipient) assert.equal(call.headers['Idempotency-Key'], uid);
  }
});
test('hook edits always target organization override, never global default', async () => {
  const { calls: [call] } = await capture(() => notifications.updateNotificationHook({ ...args, code: 'organizations.insert', body: { active: false, payload: {} } }));
  assert.equal(call.url.pathname, '/v1/admin/notifications/hooks/organizations.insert');
  assert.equal(call.url.searchParams.get('uid_organization'), org);
  assert.equal(call.method, 'PUT');
  assert.throws(() => notifications.updateNotificationHook({ ...args, code: 'unknown' }));
  assert.throws(() => notifications.updateNotificationHook({ ...args, organizationUid: '', code: 'organizations.insert' }));
});
test('delivery status and external integration use authenticated Core GET without provider tokens', async () => {
  for (const operation of [notifications.getNotificationDelivery, notifications.getNotifyIntegrationStatus]) {
    const { calls: [call] } = await capture(() => operation(args));
    assert.equal(call.url.host, 'events-notifications.test'); assert.equal(call.method, 'GET'); assert.equal(call.headers.Authorization, 'Bearer test-only');
    assert.equal(call.headers['X-Token'], undefined); assert.equal(call.body, undefined);
  }
  assert.throws(() => notifications.getNotificationDelivery({ ...args, uid: 'bad' }));
});
test('API denial and conflict stay visible, without retrying a mutation under a new key', async () => {
  for (const status of [403, 409, 422]) await assert.rejects(() => capture(() => events.createEventRule({ ...args, body: {}, idempotencyKey: uid }), status, { code: 'domain_error' }), error => error.status === status && error.code === 'domain_error');
});
