// Uses inactive, exclusive fixtures. Never sends messages, changes shared hooks,
// manufactures occurrences or starts a broker/worker.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { homologationSession } from './homologation-session.mjs';
import { importBrowserModule } from './import-browser-module.mjs';

const { base, token, org, call } = await homologationSession();
process.env.NEXT_PUBLIC_API_BASE_URL = base;
const events = await importBrowserModule(new URL('../src/lib/api/endpoints/events.js', import.meta.url));
const notifications = await importBrowserModule(new URL('../src/lib/api/endpoints/notifications.js', import.meta.url));
const domain = await importBrowserModule(new URL('../src/lib/domain/eventsNotifications.js', import.meta.url));
const report = { date: new Date().toISOString(), organization: org, checks: [], fixtures: {}, cleanup: [], passed: false };
const args = { token, organizationUid: org };
const prefix = `qa_phase10_${randomUUID().slice(0, 8)}`;
const unwrap = value => value.item ?? value;
const check = (label, passed) => { report.checks.push({ label, passed: !!passed }); assert.ok(passed, label); };
const previousFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  const response = await previousFetch(url, { ...options, headers: { ...options.headers, 'User-Agent': 'Mozilla/5.0' }, signal: options.signal ?? AbortSignal.timeout(20000) });
  const payload = response.status >= 400 ? await response.clone().json().catch(() => null) : null;
  report.checks.push({ path: new URL(url).pathname, method: options.method || 'GET', status: response.status, code: payload?.code || payload?.error, requestId: response.headers.get('x-request-id') });
  return response;
};
async function negative(label, status, operation) {
  let error;
  try { await operation(); } catch (caught) { error = caught; }
  report.checks.push({ label, expectedStatus: status, status: error?.status, code: error?.code, passed: error?.status === status });
  assert.equal(error?.status, status, label);
}
let failure;
try {
  const context = await call('/v1/users/me/access-context');
  check('areas events, event_occurrences and notifications allowed', ['events', 'event_occurrences', 'notifications'].every(area => context.body?.area_access?.areas?.[area] === 'allowed'));
  const models = await events.listEventModels({ ...args, limit: 100 });
  const model = models.items.find(row => row.code === 'ignition_change' && row.active);
  check('global event models available', !!model);
  const fields = await events.listEventFields({ ...args, limit: 100 });
  check('condition field catalog available', fields.items.length > 0);
  const named = await events.listEventModels({ ...args, q: model.name, limit: 5 });
  check('model name filter accepted', named.items.some(row => row.uid === model.uid));
  const fullModel = unwrap(await events.getEventModel({ ...args, uid: model.uid }));
  const form = domain.eventRuleForm({ name: `${prefix} inactive rule`, uid_model: model.uid, active: false, parameters: { states: ['on', 'off'] }, windows: [{ start_isodow: 6, start_time: '14:00', end_isodow: 1, end_time: '07:00' }] });
  const body = domain.eventRuleBody(form, org, fullModel);
  const ruleKey = randomUUID();
  const createdRule = unwrap(await events.createEventRule({ ...args, body, idempotencyKey: ruleKey }));
  report.fixtures.rule = createdRule.uid;
  check('inactive rule created', !!createdRule.uid);
  check('rule replay retains UID', unwrap(await events.createEventRule({ ...args, body, idempotencyKey: ruleKey })).uid === createdRule.uid);
  await negative('rule conflicting body rejected', 409, () => events.createEventRule({ ...args, body: { ...body, name: `${prefix} conflict` }, idempotencyKey: ruleKey }));
  const rule = unwrap(await events.getEventRule({ ...args, uid: createdRule.uid }));
  report.ruleShape = { fields: Object.keys(rule), target: rule.target, windows: rule.windows };
  const edited = domain.eventRuleForm(rule);
  edited.name += ' edited'; edited.delayed_seconds = 10;
  await events.updateEventRule({ ...args, uid: rule.uid, body: domain.eventRuleBody(edited, org, fullModel) });
  const updated = unwrap(await events.getEventRule({ ...args, uid: rule.uid }));
  check('rule full replacement preserved inactive state and windows', updated.active === false && updated.name === edited.name && updated.delayed_seconds === 10 && updated.windows.length === 1);
  const rules = await events.listEventRules({ ...args, q: prefix, limit: 100 });
  check('scoped rule search finds fixture', rules.items.some(row => row.uid === rule.uid));
  await negative('negative delay rejected', 422, () => events.updateEventRule({ ...args, uid: rule.uid, body: { ...body, delayed_seconds: -1 } }));
  const occurrences = await events.listEventOccurrences({ ...args, limit: 5 });
  check('scoped occurrence list available', Array.isArray(occurrences.items));
  report.occurrences = { total: occurrences.total, treatmentTested: false, reason: 'No authorized treatment fixture; pre-existing occurrences are not changed.' };
  const recipientForm = domain.notificationRecipientForm({ name: `${prefix} recipient`, active: false, endpoints: [{ service: 'email', destination: `${prefix}@example.test`, active: false }], organization_bindings: [{ uid_organization: org }] });
  const recipientBody = domain.notificationRecipientBody(recipientForm, org);
  const recipientKey = randomUUID();
  const createdRecipient = unwrap(await notifications.createNotificationRecipient({ ...args, body: recipientBody, idempotencyKey: recipientKey }));
  report.fixtures.recipient = createdRecipient.uid;
  check('inactive recipient created', !!createdRecipient.uid);
  check('recipient replay retains UID', unwrap(await notifications.createNotificationRecipient({ ...args, body: recipientBody, idempotencyKey: recipientKey })).uid === createdRecipient.uid);
  await negative('recipient conflicting body rejected', 409, () => notifications.createNotificationRecipient({ ...args, body: { ...recipientBody, name: `${prefix} conflict` }, idempotencyKey: recipientKey }));
  const recipient = unwrap(await notifications.getNotificationRecipient({ ...args, uid: createdRecipient.uid }));
  report.recipientShape = { fields: Object.keys(recipient), endpointFields: Object.keys(recipient.endpoints?.[0] || {}) };
  const recipientEdit = domain.notificationRecipientForm(recipient);
  recipientEdit.name += ' edited';
  await notifications.updateNotificationRecipient({ ...args, uid: recipient.uid, body: domain.notificationRecipientBody(recipientEdit, org) });
  const recipientUpdated = unwrap(await notifications.getNotificationRecipient({ ...args, uid: recipient.uid }));
  check('recipient replacement preserves endpoint and organization bindings', recipientUpdated.name === recipientEdit.name && recipientUpdated.active === false && recipientUpdated.endpoints.length === 1 && recipientUpdated.organization_bindings.length === 1);
  const recipients = await notifications.listNotificationRecipients({ ...args, limit: 100 });
  check('scoped recipient list finds fixture', recipients.items.some(row => row.uid === recipient.uid));
  const hooks = await notifications.listNotificationHooks({ ...args, limit: 50 });
  check('hooks paginated list available', Array.isArray(hooks.items));
  const hook = unwrap(await notifications.getNotificationHook({ ...args, code: 'organizations.insert' }));
  check('effective organization hook readable without changing default', !!hook.payload);
  const integration = await notifications.getNotifyIntegrationStatus(args);
  check('Notify integration returns metadata only', Array.isArray(integration.items) && integration.items.every(row => !('token' in row) && !('secret' in row)));
  report.deliveryStatusTested = false;
  report.passed = true;
} catch (error) {
  failure = error;
  report.failure = { status: error.status, code: error.code, message: error.code || (error.name === 'AssertionError' ? error.message : error.name) };
} finally {
  for (const [kind, operation] of [['rule', events.deleteEventRule], ['recipient', notifications.deleteNotificationRecipient]]) if (report.fixtures[kind]) {
    try { await operation({ ...args, uid: report.fixtures[kind] }); report.cleanup.push({ kind, uid: report.fixtures[kind], deleted: true }); }
    catch (error) { report.cleanup.push({ kind, uid: report.fixtures[kind], deleted: false, status: error.status, code: error.code }); report.passed = false; failure ||= error; }
  }
  await call('/v1/users/logout', 'POST').catch(() => {});
  globalThis.fetch = previousFetch;
  await writeFile(new URL('../../api-contracts/evidence/phase10-http-2026-11-17.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
if (failure || !report.passed) process.exitCode = 1;
