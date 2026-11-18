// Read-only Agenda checks (the backend Agenda homologation suites are frozen).
// Report schedule mutations use a new fixture only, deleted in finally.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { homologationSession } from './homologation-session.mjs';
import { importBrowserModule } from './import-browser-module.mjs';

const { base, token, org, call } = await homologationSession();
process.env.NEXT_PUBLIC_API_BASE_URL = base;
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/reportSchedules.js', import.meta.url));
const domain = await importBrowserModule(new URL('../src/lib/domain/agenda.js', import.meta.url));
const args = { token, organizationUid: org };
const report = { date: new Date().toISOString(), organization: org, checks: [], cleanup: [], passed: false };
const previousFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  const result = await previousFetch(url, { ...options, headers: { ...options.headers, 'User-Agent': 'Mozilla/5.0' }, signal: options.signal ?? AbortSignal.timeout(20000) });
  const payload = result.status >= 400 ? await result.clone().json().catch(() => null) : null;
  report.checks.push({ path: new URL(url).pathname, method: options.method || 'GET', status: result.status, code: payload?.code || payload?.error, requestId: result.headers.get('x-request-id') });
  return result;
};
const check = (label, passed) => { report.checks.push({ label, passed: !!passed }); assert.ok(passed, label); };
const item = result => result.item ?? result;
let fixture, failure;
try {
  const context = await call('/v1/users/me/access-context');
  check('agenda area confirmed, reports has no independent area', context.status === 200 && context.body.area_access?.areas?.agenda === 'allowed' && !Object.hasOwn(context.body.area_access.areas, 'reports'));
  for (const [path, method, body] of [
    ['/v1/admin/agenda/entries/search', 'POST', { filters: [{ field: 'uid_organization', operator: 'eq', value: org }], limit: 5, offset: 0 }],
    ['/v1/admin/agenda/entries/search', 'POST', { filters: [{ field: 'uid_organization', operator: 'eq', value: org }, { field: 'title', operator: 'contains', value: 'qa_phase9' }], limit: 5, offset: 0 }],
    [`/v1/admin/agenda/settings?uid_organization=${org}`, 'GET']
  ]) {
    const result = await call(path, method, body);
    report.checks.push({ path, method, status: result.status, requestId: result.requestId, code: result.body?.code || result.body?.error, fields: Object.keys(result.body || {}), total: result.body?.total });
    check(`read-only ${path}`, result.status === 200);
  }
  const form = domain.scheduleForm({ report_code: 'assets.inventory', report_version: 2 });
  // The next daily occurrence is kept away from this short validation window.
  const hour = (new Date().getUTCHours() + 12) % 24;
  form.at = `${String(hour).padStart(2, '0')}:37`;
  const body = domain.scheduleBody(form, org);
  const key = randomUUID();
  const created = item(await api.createReportSchedule({ ...args, body, idempotencyKey: key }));
  fixture = created.uid;
  report.fixture = fixture;
  check('schedule created with UID', !!fixture);
  try { check('creation replay keeps UID', item(await api.createReportSchedule({ ...args, body, idempotencyKey: key })).uid === fixture); }
  catch (error) { report.replayIssue = { status: error.status, code: error.code, message: 'Same key and body did not replay successfully; continuing fixture lifecycle checks.' }; }
  await api.setReportScheduleState({ ...args, uid: fixture, state: 'paused' });
  let current = item(await api.getReportSchedule({ ...args, uid: fixture }));
  check('schedule paused and timezone derived by backend', current.state === 'paused' && !!current.timezone);
  const edited = domain.scheduleForm(current);
  edited.at = `${String(hour).padStart(2, '0')}:42`;
  await api.updateReportSchedule({ ...args, uid: fixture, body: domain.scheduleBody(edited, org) });
  current = item(await api.getReportSchedule({ ...args, uid: fixture }));
  check('replacement preserves cadence and updates time', current.cadence?.at === edited.at);
  await api.setReportScheduleState({ ...args, uid: fixture, state: 'active' });
  check('schedule resumed', item(await api.getReportSchedule({ ...args, uid: fixture })).state === 'active');
  await api.setReportScheduleState({ ...args, uid: fixture, state: 'paused' });
  const listed = await api.listReportSchedules({ ...args, limit: 100, offset: 0 });
  check('schedule list is paginated', Array.isArray(listed.items) && Number.isInteger(listed.total));
  report.passed = !report.replayIssue;
} catch (error) {
  failure = error;
  report.failure = { status: error.status, code: error.code, message: error.code || (error.name === 'AssertionError' ? error.message : error.name) };
} finally {
  if (fixture) {
    try { await api.deleteReportSchedule({ ...args, uid: fixture }); report.cleanup.push({ uid: fixture, deleted: true }); }
    catch (error) { report.cleanup.push({ uid: fixture, deleted: false, status: error.status, code: error.code }); report.passed = false; failure ||= error; }
  }
  await call('/v1/users/logout', 'POST').catch(() => {});
  globalThis.fetch = previousFetch;
  await writeFile(new URL('../../api-contracts/evidence/phase9-http-2026-11-17.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
if (failure || !report.passed) process.exitCode = 1;
