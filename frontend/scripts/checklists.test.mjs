import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://checklists.test';
const domain = await importBrowserModule(new URL('../src/lib/domain/checklists.js', import.meta.url));
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/checklists.js', import.meta.url));
const org = '11111111-1111-4111-8111-111111111111';
const uid = '22222222-2222-4222-8222-222222222222';
const other = '33333333-3333-4333-8333-333333333333';
const question = { code: 'hazard', label: 'Há restrição?', type: 'boolean', required: true, effect: 'warning' };
const form = { code: ' pre_op ', name: ' Inspeção ', description: '', active: true, uid_group: uid, applicability: 'driver', assignmentMode: 'selected', targets: other, questions: [question] };
const execution = { uid, version_number: 1, checklist: { definition: { questions: [question, { code: 'notes', label: 'Notas', type: 'text', required: false }] } }, answers: [{ question_code: 'hazard', value: false }] };
const run = { uid: other, status: 'open', complete: false, executions: [execution] };
const args = { token: 'test-only', organizationUid: org, uid };
async function capture(operation, payload = {}) {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ ...options, url: new URL(url), json: options.body === undefined ? undefined : JSON.parse(options.body) });
    return new Response(JSON.stringify(payload), { status: 200 });
  };
  try { return { calls, result: await operation() }; } finally { globalThis.fetch = previous; }
}
test('group creation is scoped and validates code/name', () => {
  assert.deepEqual(domain.checklistGroupBody({ code: ' g ', name: ' Grupo ', active: true }, org), { code: 'g', name: 'Grupo', active: true, description: null, uid_organization: org });
  assert.throws(() => domain.checklistGroupBody({ code: '', name: 'Grupo' }, org));
});
test('selected assignments use typed targets and omit unrelated recipients', () => {
  const body = domain.checklistBody({ ...form, targets: `${other}\n${other}` }, org);
  assert.deepEqual(body.assignment, { mode: 'selected', drivers: [other] });
  assert.deepEqual(domain.checklistBody({ ...form, applicability: 'asset' }, org).assignment, { mode: 'selected', assets: [other] });
  assert.deepEqual(domain.checklistBody({ ...form, applicability: 'general', assignmentMode: 'all' }, org).assignment, { mode: 'all' });
  for (const patch of [{ applicability: 'general' }, { targets: '' }, { targets: 'invalid' }, { applicability: 'unknown' }]) assert.throws(() => domain.checklistBody({ ...form, ...patch }, org));
});
test('question order/metadata is preserved; duplicates and unsupported types are rejected', () => {
  const text = { code: 'notes', label: 'Notas', type: 'text', required: false, effect: 'warning' };
  const body = domain.checklistBody({ ...form, definition: { title: 'Instruções' }, questions: [question, text] }, org);
  assert.equal(body.definition.title, 'Instruções');
  assert.deepEqual(body.definition.questions.map(row => row.code), ['hazard', 'notes']);
  assert.equal('effect' in body.definition.questions[1], false);
  for (const questions of [[], [question, question], [{ ...question, type: 'unsupported' }], [{ ...question, effect: 'unknown' }]]) assert.throws(() => domain.checklistBody({ ...form, questions }, org));
});
test('editing a selected checklist hydrates assignments and immutable published metadata is not sent', () => {
  const hydrated = domain.checklistForm({ uid, latest_version: 5, uid_group: uid, code: 'a', name: 'A', active: true, applicability: 'asset', assignment: { mode: 'selected', assets: [other] }, definition: { questions: [question] } });
  assert.equal(hydrated.targets, other);
  const body = domain.checklistBody(hydrated, org);
  assert.equal('latest_version' in body, false);
  assert.equal('uid' in body, false);
});
test('false is a real answer and required boolean questions are never defaulted', () => {
  assert.deepEqual(domain.runAnswers(run), { [uid]: { hazard: false } });
  assert.deepEqual(domain.checklistAnswersBody(run, domain.runAnswers(run), true), { executions: [{ uid_execution: uid, answers: [{ question_code: 'hazard', value: false }] }] });
  assert.deepEqual(domain.checklistAnswersBody(run, {}, false), { executions: [{ uid_execution: uid, answers: [] }] });
  assert.throws(() => domain.checklistAnswersBody(run, {}, true), /obrigatória/);
  assert.throws(() => domain.checklistAnswersBody(run, { [uid]: { hazard: 'false' } }), /Sim ou Não/);
});
test('answers are built from fixed run questions, not current template or stale asset drafts', () => {
  const values = { [uid]: { hazard: true, notes: 'Observação', other_question: true }, [other]: { stale_asset_question: true } };
  const body = domain.checklistAnswersBody(run, values);
  assert.deepEqual(body.executions, [{ uid_execution: uid, answers: [{ question_code: 'hazard', value: true }, { question_code: 'notes', value: 'Observação' }] }]);
  assert.equal('version_number' in body.executions[0], false);
});
test('completed runs cannot produce mutation bodies and required text rejects blanks', () => {
  for (const closed of [{ complete: true }, { status: 'completed' }, { completed_at: '2026-11-16T10:00:00Z' }]) assert.throws(() => domain.checklistAnswersBody({ ...run, ...closed }, {}), /encerrada/);
  const textRun = { ...run, executions: [{ ...execution, checklist: { definition: { questions: [{ code: 'reason', label: 'Motivo', type: 'text', required: true }] } } }] };
  assert.throws(() => domain.checklistAnswersBody(textRun, { [uid]: { reason: '  ' } }, true), /obrigatória/);
  assert.throws(() => domain.checklistAnswersBody(textRun, { [uid]: { reason: false } }, true), /textual/);
});
test('lists use search filters with organization, name and offset', async () => {
  const { calls } = await capture(async () => { await api.listChecklistGroups({ ...args, q: ' Grupo ', offset: 25, limit: 25 }); await api.listChecklists({ ...args, offset: 50 }); });
  assert.equal(calls[0].url.pathname, '/v1/admin/checklist-groups/search');
  assert.equal(calls[1].url.pathname, '/v1/admin/checklists/search');
  assert.deepEqual(calls[0].json.filters, [{ field: 'uid_organization', operator: 'eq', value: org }, { field: 'name', operator: 'contains', value: 'Grupo' }]);
  assert.equal(calls[0].json.offset, 25);
  assert.equal('after_uid' in calls[0].json, false);
});
test('group/template creates preserve retry keys and details/patches carry context', async () => {
  const { calls } = await capture(async () => {
    await api.createChecklistGroup({ ...args, body: { name: 'Grupo' }, idempotencyKey: 'group-intent' });
    await api.createChecklist({ ...args, body: domain.checklistBody(form, org), idempotencyKey: 'template-intent' });
    await api.getChecklistGroup(args); await api.getChecklist(args);
    await api.patchChecklistGroup({ ...args, body: { active: false } }); await api.patchChecklist({ ...args, body: { ...domain.checklistBody(form, org), uid_organization: other } });
  });
  assert.equal(calls[0].headers['Idempotency-Key'], 'group-intent');
  assert.equal(calls[1].headers['Idempotency-Key'], 'template-intent');
  for (const call of calls.slice(2)) assert.equal(call.url.searchParams.get('uid_organization'), org);
  assert.equal(calls[4].method, 'PATCH'); assert.equal(calls[5].method, 'PATCH');
  assert.deepEqual(calls[5].json, domain.checklistBody(form, org));
});
test('publishing is explicit; run creation derives organization from driver', async () => {
  const { calls } = await capture(async () => { await api.publishChecklist(args); await api.createChecklistRun({ ...args, driverUid: other, idempotencyKey: 'run-intent' }); });
  assert.equal(calls[0].method, 'POST'); assert.equal(calls[0].url.pathname, `/v1/admin/checklists/${uid}/publish`);
  assert.equal(calls[0].url.searchParams.get('uid_organization'), org);
  assert.equal(calls[1].url.pathname, '/v1/checklists/runs');
  assert.deepEqual(calls[1].json, { uid_driver: other });
  assert.equal(calls[1].headers['Idempotency-Key'], 'run-intent');
});
test('run updates use PUT for asset, answers and completion without publishing or inventing result', async () => {
  const { calls, result } = await capture(async () => {
    await api.updateChecklistRun({ ...args, body: { uid_asset: other } });
    await api.updateChecklistRun({ ...args, body: domain.checklistAnswersBody(run, domain.runAnswers(run)) });
    return api.updateChecklistRun({ ...args, body: { complete: true } });
  }, { complete: true, outcome: 'blocked', asset_result: 'not_fit' });
  assert.equal(result.outcome, 'blocked');
  for (const call of calls) { assert.equal(call.method, 'PUT'); assert.equal(call.url.pathname, `/v1/checklists/runs/${uid}`); assert.equal(call.url.searchParams.get('uid_organization'), org); }
  assert.deepEqual(calls[2].json, { complete: true });
});
test('HTTP failures retain business status and all requests use Bearer/no-store', async () => {
  const { calls } = await capture(() => api.getChecklistRun(args));
  assert.equal(calls[0].headers.Authorization, 'Bearer test-only'); assert.equal(calls[0].cache, 'no-store');
  const previous = globalThis.fetch;
  try {
    for (const [status, code] of [[403, 'checklist_not_allowed'], [409, 'checklist_run_immutable'], [422, 'checklist_required_answers_missing']]) {
      globalThis.fetch = async () => new Response(JSON.stringify({ code }), { status });
      await assert.rejects(api.updateChecklistRun({ ...args, body: { complete: true } }), error => error.status === status && error.code === code);
    }
  } finally { globalThis.fetch = previous; }
});
