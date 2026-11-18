import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://agenda.test';
const domain = await importBrowserModule(new URL('../src/lib/domain/agenda.js', import.meta.url));
const agenda = await importBrowserModule(new URL('../src/lib/api/endpoints/agenda.js', import.meta.url));
const schedules = await importBrowserModule(new URL('../src/lib/api/endpoints/reportSchedules.js', import.meta.url));
const org = '11111111-1111-4111-8111-111111111111';
const uid = '22222222-2222-4222-8222-222222222222';
const args = { token: 'test-only', organizationUid: org, uid };
const entry = { uid, controls_version: 4, priority: 'normal', pinned: true, notified: true, terminal: false, snoozed_until: '2026-11-17T12:34:56.789Z', next_contact_at: null };
async function capture(operation, status = 200, payload = {}) {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ ...options, url: new URL(url), json: options.body === undefined ? undefined : JSON.parse(options.body) });
    return new Response(status === 204 ? null : JSON.stringify(payload), { status });
  };
  try { return { calls, result: await operation() }; } finally { globalThis.fetch = previous; }
}
test('controls send current version and preserve false, clear dates explicitly', () => {
  const body = domain.agendaControlsBody(entry, { ...domain.agendaControlForm(entry), pinned: false, notified: false, snoozed_until: '' });
  assert.deepEqual(body, { controls_version: 4, pinned: false, notified: false, snoozed_until: null });
});
test('untouched date preserves seconds instead of silently truncating stored data', () => {
  assert.deepEqual(domain.agendaControlsBody(entry, domain.agendaControlForm(entry)), { controls_version: 4 });
});
test('terminal, stale shape, invalid priority and non-boolean controls are blocked', () => {
  const form = domain.agendaControlForm(entry);
  for (const record of [{ ...entry, terminal: true }, { ...entry, controls_version: null }]) assert.throws(() => domain.agendaControlsBody(record, form));
  for (const patch of [{ priority: 'unknown' }, { pinned: 'false' }, { next_contact_at: 'not-a-date' }]) assert.throws(() => domain.agendaControlsBody(entry, { ...form, ...patch }));
});
test('manual analysis requires a trimmed description', () => {
  assert.deepEqual(domain.agendaAnalysisBody(' Retorno do cliente '), { description: 'Retorno do cliente' });
  assert.throws(() => domain.agendaAnalysisBody(' '));
});
test('color changes preserve inheritance for untouched colors and reject invalid values', () => {
  const before = { priorities: { normal: '#ABCDEF', high: '#112233' }, controls: { pinned: '#112233' } };
  assert.deepEqual(domain.agendaColorChanges(before, { ...before, priorities: { normal: '#abcdef', high: '#223344' } }), { colors: { priorities: { high: '#223344' } } });
  assert.throws(() => domain.agendaColorChanges(before, { priorities: { high: 'red' } }));
});
test('calendar uses operational dates and prevents invalid end/color values', () => {
  const row = { uid, title: 'Manutenção', priority: 'high', occurred_at: '2026-11-17T08:00:00Z', next_contact_at: '2026-11-18T09:00:00Z', scheduled_end: '2026-11-16T09:00:00Z' };
  const result = domain.agendaEvent(row, { colors: { priorities: { high: '#F97316' } } });
  assert.equal(result.start, row.next_contact_at);
  assert.equal(result.editable, false);
  assert.equal(result.backgroundColor, '#F97316');
  assert.equal('end' in result, false);
  assert.equal(domain.agendaEvent({ uid }), null);
  assert.equal('backgroundColor' in domain.agendaEvent(row, { colors: { priorities: { high: 'url(bad)' } } }), false);
});
test('agenda search is tenant-scoped and uses offset plus title filter', async () => {
  const { calls: [call] } = await capture(() => agenda.listAgenda({ ...args, q: ' oficina ', limit: 10, offset: 20 }));
  assert.equal(call.url.pathname, '/v1/admin/agenda/entries/search');
  assert.deepEqual(call.json, { filters: [{ field: 'uid_organization', operator: 'eq', value: org }, { field: 'title', operator: 'contains', value: 'oficina' }], limit: 10, offset: 20 });
});
test('agenda get, controls, analyses and settings pass the organization and signal', async () => {
  const controller = new AbortController();
  for (const operation of [agenda.getAgendaEntry, agenda.patchAgendaControls, agenda.listAgendaAnalyses, agenda.getAgendaSettings, agenda.patchAgendaSettings]) {
    const { calls: [call] } = await capture(() => operation({ ...args, signal: controller.signal, body: { controls_version: 4 } }));
    assert.equal(call.url.searchParams.get('uid_organization'), org);
    assert.equal(call.signal, controller.signal);
  }
  assert.throws(() => agenda.getAgendaEntry({ ...args, organizationUid: '' }));
});
test('analysis retries retain caller idempotency key and route identity', async () => {
  const { calls: [call] } = await capture(() => agenda.createAgendaAnalysis({ ...args, body: { description: 'Retorno' }, idempotencyKey: uid }));
  assert.equal(call.url.pathname, `/v1/admin/agenda/entries/${uid}/analyses`);
  assert.equal(call.headers['Idempotency-Key'], uid);
  assert.equal(call.method, 'POST');
});
const form = () => domain.scheduleForm({ report_code: 'assets.inventory', report_version: 2 });
test('schedule body excludes timezone, metadata and state; organization is explicit', () => {
  const body = domain.scheduleBody({ ...form(), timezone: 'UTC', state: 'active' }, org);
  assert.equal(body.uid_organization, org);
  assert.equal('timezone' in body, false);
  assert.equal('state' in body, false);
  assert.deepEqual(body.cadence, { frequency: 'daily', at: '08:00' });
  assert.deepEqual(body.period, { mode: 'none' });
});
test('schedule edit preserves period, cadence extras, normalized filters and source metadata', () => {
  const item = { report_code: 'assets.inventory', report_version: 2, cadence: { frequency: 'weekly', at: '09:30', weekday: 2 }, period: { mode: 'previous_month', field: 'created_at' }, filters: { q: '', include_inactive: false, filters: [], limit: 0, offset: 0, state: 'all' }, source_screen_id: 'assets.inventory', retention_policy: 'expire' };
  const body = domain.scheduleBody(domain.scheduleForm(item), org);
  for (const key of ['cadence', 'period', 'source_screen_id', 'retention_policy']) assert.deepEqual(body[key], item[key]);
  assert.deepEqual(body.filters, { q: '', include_inactive: false, filters: [] });
});
test('schedule rejects malformed JSON, invalid time, unsupported format and retention outside bounds', () => {
  for (const patch of [{ filters: '{' }, { filters: 'null' }, { sort: '{}' }, { sort: '[{"field":"uid","direction":"unsafe"}]' }, { columns: '' }, { at: '24:01' }, { format: 'pdf' }, { retention_seconds: 2592001 }, { retention_seconds: 0 }, { report_version: 0 }]) assert.throws(() => domain.scheduleBody({ ...form(), ...patch }, org));
});
test('schedules use GET pagination and tenant context on get/delete', async () => {
  const { calls: [call] } = await capture(() => schedules.listReportSchedules({ ...args, limit: 5, offset: 10 }));
  assert.equal(call.method, 'GET');
  assert.equal(call.url.searchParams.get('offset'), '10');
  assert.equal(call.url.searchParams.get('uid_organization'), org);
  const removed = await capture(() => schedules.deleteReportSchedule(args), 204);
  assert.equal(removed.result, null);
  assert.equal(removed.calls[0].url.searchParams.get('uid_organization'), org);
});
test('schedule create/replace/state use their own routes and organization overrides body input', async () => {
  for (const [operation, method, path] of [[schedules.createReportSchedule, 'POST', '/v1/reports/schedules'], [schedules.updateReportSchedule, 'PUT', `/v1/reports/schedules/${uid}`]]) {
    const { calls: [call] } = await capture(() => operation({ ...args, body: { uid_organization: uid }, idempotencyKey: uid }));
    assert.equal(call.method, method); assert.equal(call.url.pathname, path); assert.equal(call.json.uid_organization, org);
    if (method === 'POST') assert.equal(call.headers['Idempotency-Key'], uid);
  }
  const { calls: [call] } = await capture(() => schedules.setReportScheduleState({ ...args, state: 'paused' }));
  assert.deepEqual(call.json, { uid_organization: org, state: 'paused' });
  assert.equal(call.url.pathname, `/v1/reports/schedules/${uid}/state`);
  assert.throws(() => schedules.setReportScheduleState({ ...args, state: 'deleted' }));
});
test('API conflicts propagate with business code for reload without automatic overwrite', async () => {
  await assert.rejects(() => capture(() => agenda.patchAgendaControls({ ...args, body: { controls_version: 1 } }), 409, { code: 'agenda_version_conflict' }), error => error.status === 409 && error.code === 'agenda_version_conflict');
});
