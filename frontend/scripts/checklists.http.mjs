import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { homologationSession } from './homologation-session.mjs';
import { importBrowserModule } from './import-browser-module.mjs';

const { base, token, org } = await homologationSession();
process.env.NEXT_PUBLIC_API_BASE_URL = base;
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/checklists.js', import.meta.url));
const { apiRequest } = await importBrowserModule(new URL('../src/lib/api/http.js', import.meta.url));
const domain = await importBrowserModule(new URL('../src/lib/domain/checklists.js', import.meta.url));
const prefix = `qa_ck_${randomUUID().slice(0, 8)}`;
const report = { date: new Date().toISOString(), organization: org, prefix, checks: [], fixtures: { templates: [], assets: [], runs: [], maintenance: [] }, cleanup: [], passed: false };
const previousFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  const result = await previousFetch(url, { ...options, headers: { ...options.headers, 'User-Agent': 'Mozilla/5.0' }, signal: options.signal ?? AbortSignal.timeout(20000) });
  const error = result.status >= 400 ? await result.clone().json().catch(() => null) : null;
  report.checks.push({ path: new URL(url).pathname, method: options.method || 'GET', status: result.status, code: error?.error ?? error?.code, requestId: result.headers.get('x-request-id') });
  return result;
};
const call = (path, options = {}) => apiRequest(path, { token, ...options });
const unwrap = result => result.item ?? result;
const uidOf = result => unwrap(result)?.uid;
function check(label, passed) { report.checks.push({ label, passed: !!passed }); assert.ok(passed, label); }
async function negative(label, status, operation) {
  let error;
  try { await operation(); } catch (caught) { error = caught; }
  check(label, error?.status === status);
}
const args = uid => ({ token, organizationUid: org, uid });
const getRun = uid => api.getChecklistRun(args(uid));
const groupPatch = (uid, body) => api.patchChecklistGroup({ ...args(uid), body });
const templatePatch = (uid, body) => api.patchChecklist({ ...args(uid), body });
const putRun = (uid, body) => api.updateChecklistRun({ ...args(uid), body });
const question = { code: 'hazard', label: 'Há restrição na fixture?', type: 'boolean', required: true, effect: 'warning' };
let failure;
try {
  const driver = await call('/v1/admin/entities/drivers', { method: 'POST', idempotencyKey: randomUUID(), body: { uid_organization: org, name: `${prefix} motorista de teste`, birth_date: '1990-01-01', internal_contract_number: prefix, scopes: [{}] } });
  report.fixtures.driver = uidOf(driver);
  check('motorista exclusivo criado', !!report.fixtures.driver);
  const groupBody = domain.checklistGroupBody({ code: `${prefix}_group`, name: `${prefix} grupo`, active: true }, org);
  const groupKey = randomUUID();
  report.fixtures.group = uidOf(await api.createChecklistGroup({ token, body: groupBody, idempotencyKey: groupKey }));
  check('grupo criado/replay preserva UID', uidOf(await api.createChecklistGroup({ token, body: groupBody, idempotencyKey: groupKey })) === report.fixtures.group);
  await negative('grupo com mesma chave e corpo divergente 409', 409, () => api.createChecklistGroup({ token, body: { ...groupBody, name: `${prefix} divergente` }, idempotencyKey: groupKey }));
  await groupPatch(report.fixtures.group, { description: 'Grupo de fixture da integração frontend' });
  check('detalhe do grupo', (await api.getChecklistGroup(args(report.fixtures.group))).description === 'Grupo de fixture da integração frontend');
  const form = { code: `${prefix}_driver`, name: `${prefix} motorista`, uid_group: report.fixtures.group, active: true, applicability: 'driver', assignmentMode: 'selected', targets: report.fixtures.driver, questions: [question] };
  const body = domain.checklistBody(form, org);
  const key = randomUUID();
  const templateUid = uidOf(await api.createChecklist({ token, body, idempotencyKey: key }));
  report.fixtures.templates.push(templateUid);
  check('template replay preserva UID', uidOf(await api.createChecklist({ token, body, idempotencyKey: key })) === templateUid);
  await negative('template divergente com mesma chave 409', 409, () => api.createChecklist({ token, body: { ...body, name: `${prefix} divergente` }, idempotencyKey: key }));
  const draft = await api.getChecklist(args(templateUid));
  check('assignment selecionado roundtrip do editor', domain.checklistForm(draft).targets === report.fixtures.driver);
  report.templateShape = { fields: Object.keys(draft), assignment: draft.assignment };
  await api.publishChecklist(args(templateUid));
  const published = await api.getChecklist(args(templateUid));
  check('primeira publicação v1', published.latest_version === 1);
  await api.publishChecklist(args(templateUid));
  check('publicação sem alteração não cria v2', (await api.getChecklist(args(templateUid))).latest_version === 1);
  const runKey = randomUUID();
  const runUid = uidOf(await api.createChecklistRun({ token, driverUid: report.fixtures.driver, idempotencyKey: runKey }));
  report.fixtures.runs.push(runUid);
  check('run replay preserva UID', uidOf(await api.createChecklistRun({ token, driverUid: report.fixtures.driver, idempotencyKey: runKey })) === runUid);
  let run = await getRun(runUid);
  let execution = run.executions.find(row => row.checklist?.uid_template === templateUid);
  check('execução fixa v1', execution?.version_number === 1);
  report.runShape = { fields: Object.keys(run), executionFields: Object.keys(execution || {}) };
  await negative('required ausente retorna 422', 422, () => putRun(runUid, { complete: true }));
  const revised = domain.checklistBody({ ...form, questions: [{ ...question, label: 'Enunciado da versão dois' }, { code: 'notes', label: 'Notas', type: 'text', required: false }] }, org);
  await templatePatch(templateUid, revised);
  await api.publishChecklist(args(templateUid));
  check('rascunho alterado publica v2', (await api.getChecklist(args(templateUid))).latest_version === 2);
  run = await getRun(runUid);
  execution = run.executions.find(row => row.checklist?.uid_template === templateUid);
  check('run anterior continua na versão/label original', execution.version_number === 1 && execution.checklist.definition.questions[0].label === question.label);
  await putRun(runUid, { executions: [{ uid_execution: execution.uid, answers: [{ question_code: 'hazard', value: false }] }] });
  run = await getRun(runUid);
  check('false foi persistido como resposta', domain.runAnswers(run)[execution.uid]?.hazard === false);
  await putRun(runUid, { executions: [{ uid_execution: execution.uid, answers: [{ question_code: 'hazard', value: true }] }] });
  await putRun(runUid, { complete: true });
  run = await getRun(runUid);
  check('warning libera sem tornar motorista inapto', domain.runIsComplete(run) && run.outcome === 'released' && run.driver_result === 'fit');
  await negative('run concluído rejeita alterações', 409, () => putRun(runUid, { executions: [{ uid_execution: execution.uid, answers: [{ question_code: 'hazard', value: false }] }] }));
  const entity = await call('/v1/admin/entities', { method: 'POST', idempotencyKey: randomUUID(), body: { uid_organization: org, name: `${prefix} entidade de teste` } });
  report.fixtures.entity = uidOf(entity);
  for (let index = 0; index < 2; index++) {
    const asset = await call('/v1/admin/assets', { method: 'POST', idempotencyKey: randomUUID(), body: { uid_organization: org, uid_entity: report.fixtures.entity, identification: `${prefix}_asset_${index}` } });
    report.fixtures.assets.push(uidOf(asset));
  }
  const assetBody = domain.checklistBody({ ...form, code: `${prefix}_asset`, applicability: 'asset', targets: report.fixtures.assets.join('\n'), questions: [{ ...question, effect: 'asset_not_fit' }] }, org);
  const assetTemplate = uidOf(await api.createChecklist({ token, body: assetBody, idempotencyKey: randomUUID() }));
  report.fixtures.templates.push(assetTemplate);
  await api.publishChecklist(args(assetTemplate));
  const secondUid = uidOf(await api.createChecklistRun({ token, driverUid: report.fixtures.driver, idempotencyKey: randomUUID() }));
  report.fixtures.runs.push(secondUid);
  await putRun(secondUid, { uid_asset: report.fixtures.assets[0] });
  let second = await getRun(secondUid);
  const driverExecution = second.executions.find(row => row.checklist?.uid_template === templateUid);
  const firstAssetExecution = second.executions.find(row => row.checklist?.uid_template === assetTemplate);
  check('novo run fixa driver v2 e descobre ativo', driverExecution?.version_number === 2 && !!firstAssetExecution);
  await putRun(secondUid, { executions: [{ uid_execution: firstAssetExecution.uid, answers: [{ question_code: 'hazard', value: false }] }] });
  await negative('trocar ativo após respostas retorna 409', 409, () => putRun(secondUid, { uid_asset: report.fixtures.assets[1] }));
  second = await getRun(secondUid);
  const secondAssetExecution = second.executions.find(row => row.checklist?.uid_template === assetTemplate);
  check('troca rejeitada preserva ativo, snapshot e respostas', second.uid_asset === report.fixtures.assets[0] && secondAssetExecution?.uid === firstAssetExecution.uid && domain.runAnswers(second)[secondAssetExecution.uid]?.hazard === false);
  const values = Object.fromEntries(second.executions.map(row => [row.uid, Object.fromEntries(row.checklist.definition.questions.map(q => [q.code, q.type === 'boolean' ? row.uid === secondAssetExecution.uid : 'Notas da fixture']))]));
  await putRun(secondUid, domain.checklistAnswersBody(second, values, true));
  await putRun(secondUid, { complete: true });
  second = await getRun(secondUid);
  check('resultado bloqueado vem da API', domain.runIsComplete(second) && second.outcome === 'blocked' && second.asset_result === 'not_fit');
  const search = await call('/v1/admin/maintenance/orders/search', { method: 'POST', body: { filters: [{ field: 'uid_organization', operator: 'eq', value: org }, { field: 'uid_checklist_run', operator: 'eq', value: secondUid }], limit: 10, offset: 0 } });
  report.fixtures.maintenance = (search.items || []).map(row => row.uid);
  check('integração gerou exatamente uma manutenção na fixture', report.fixtures.maintenance.length === 1);
  const templates = await api.listChecklists({ token, organizationUid: org, q: prefix, limit: 1, offset: 0 });
  const more = await api.listChecklists({ token, organizationUid: org, q: prefix, limit: 1, offset: 1 });
  check('listagem por nome e paginação são reais', templates.items?.length === 1 && more.items?.length === 1 && templates.items[0].uid !== more.items[0].uid);
  report.passed = true;
} catch (error) {
  failure = error;
  report.failure = { message: error.message, code: error.code, status: error.status };
} finally {
  const cleanup = async (label, operation) => { try { await operation(); report.cleanup.push({ label, passed: true }); } catch (error) { report.cleanup.push({ label, passed: false, code: error.code, status: error.status, message: error.message }); } };
  for (const uid of report.fixtures.templates) await cleanup(`inativar e publicar template ${uid}`, async () => {
    const current = await api.getChecklist(args(uid));
    await templatePatch(uid, domain.checklistBody({ ...domain.checklistForm(current), active: false }, org));
    await api.publishChecklist(args(uid));
  });
  if (report.fixtures.group) await cleanup('desativar grupo', () => groupPatch(report.fixtures.group, { active: false }));
  for (const uid of report.fixtures.maintenance) await cleanup(`resolver manutenção de fixture ${uid}`, async () => {
    const path = `/v1/admin/maintenance/orders/${uid}?uid_organization=${org}`;
    const current = await call(path);
    if (!['completed', 'cancelled'].includes(current.status)) await call(`/v1/admin/maintenance/orders/${uid}/transition?uid_organization=${org}`, { method: 'POST', idempotencyKey: randomUUID(), body: { status: 'completed', resolve_conditions: (current.conditions || []).filter(row => row.status === 'open').map(row => row.uid) } });
  });
  for (const uid of report.fixtures.assets) await cleanup(`excluir ativo de fixture ${uid}`, () => call(`/v1/admin/assets/${uid}`, { method: 'DELETE' }));
  if (report.fixtures.entity) await cleanup('inativar entidade de fixture', () => call(`/v1/admin/entities/${report.fixtures.entity}/lifecycle`, { method: 'PATCH', body: { state: 'inactive', reason: 'Fixture de checklist encerrada' } }));
  if (report.fixtures.driver) await cleanup('desativar motorista de fixture', () => call(`/v1/admin/entities/drivers/${report.fixtures.driver}`, { method: 'PATCH', body: { active: false } }));
  globalThis.fetch = previousFetch;
  const output = new URL('../../api-contracts/evidence/phase8-checklists-http-2026-11-16.json', import.meta.url);
  await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: report.passed, checks: report.checks.length, failure: report.failure, cleanup: report.cleanup }));
}
if (failure || report.cleanup.some(row => !row.passed)) process.exitCode = 1;
