import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { homologationSession } from './homologation-session.mjs';

const { call, org } = await homologationSession();
const source = JSON.parse(await readFile(new URL('../../api-contracts/evidence/phase7-authenticated-http-2026-11-15.json', import.meta.url), 'utf8'));
assert.equal(source.organization, org, 'Fixture deve pertencer à organização de teste');
const providerUid = source.fixtures.provider;
const technicianUid = source.fixtures.technician;
const report = { date: new Date().toISOString(), organization: org, checks: [], fixtures: { provider: providerUid, technician: technicianUid, orders: [] }, cleanup: [], passed: false };
const prefix = `QA-OS-${randomUUID().slice(0, 8)}`;
const item = response => response.body?.item ?? response.body;
async function request(label, path, method = 'GET', body, key, expected = [200]) {
  const result = await call(path, method, body, key);
  const passed = expected.includes(result.status);
  report.checks.push({ label, path, method, status: result.status, expected, code: result.body?.error, requestId: result.requestId, passed });
  assert.ok(passed, `${label}: HTTP ${result.status} ${result.body?.error || ''}`);
  return result;
}
const custodyPath = `/v1/admin/devices/custody?${new URLSearchParams({ filters: JSON.stringify([{ field: 'uid_organization', operator: 'eq', value: org }]), limit: '100', offset: '0' })}`;
async function custodyFor(uid) {
  const response = await request('listar custódias', custodyPath);
  return (response.body?.items || []).filter(row => row.uid_work_order === uid);
}
async function orderCycle(operation, deviceUid) {
  const path = '/v1/admin/devices/work-orders';
  const body = { uid_asset: report.fixtures.asset, uid_technician: technicianUid, description: `${prefix} ${operation}`, items: [{ slot_number: 1, operation, uid_device_before: operation === 'install' ? null : deviceUid, uid_device_after: operation === 'install' ? deviceUid : null, capability_code: 'telemetry' }] };
  const key = randomUUID();
  const created = await request(`${operation}: criar OS`, path, 'POST', body, key, [201]);
  const uid = item(created)?.uid;
  assert.ok(uid, 'Criação de OS sem UID');
  report.fixtures.orders.push(uid);
  const replay = await request(`${operation}: replay criação`, path, 'POST', body, key);
  assert.equal(item(replay)?.uid, uid);
  await request(`${operation}: conflito criação`, path, 'POST', { ...body, description: `${prefix} divergente` }, key, [409]);
  await request(`${operation}: despachar`, `${path}/${uid}/dispatch`, 'POST', { dispatch_method: 'courier', dispatch_reference: prefix, dispatch_cost_cents: 0, dispatch_notes: 'Transporte exclusivo de fixture' });
  let detail = item(await request(`${operation}: detalhe após despacho`, `${path}/${uid}`));
  const snapshot = detail.items?.[0]?.pricing_snapshot;
  report.checks.push({ label: `${operation}: snapshot`, status: snapshot?.status, version: snapshot?.version, passed: snapshot?.status === (operation === 'install' ? 'priced' : 'unpriced') });
  assert.equal(snapshot?.status, operation === 'install' ? 'priced' : 'unpriced');
  if (operation === 'install') {
    await request('início sem recebimento deve falhar', `${path}/${uid}/start`, 'POST', {}, undefined, [409]);
    const custody = (await custodyFor(uid)).find(row => !row.closed_at);
    assert.ok(custody?.uid, 'Custódia de ida não encontrada');
    await request('confirmar recebimento da custódia', `/v1/admin/devices/custody/${custody.uid}/confirm-receipt`, 'POST', {});
  }
  await request(`${operation}: iniciar`, `${path}/${uid}/start`, 'POST', {});
  detail = item(await request(`${operation}: detalhe em andamento`, `${path}/${uid}`));
  const completion = { items: detail.items.map(row => ({ uid_item: row.uid_item || row.uid, result_notes: `${prefix} resultado ${operation}` })) };
  const completionKey = randomUUID();
  const completed = item(await request(`${operation}: concluir`, `${path}/${uid}/complete`, 'POST', completion, completionKey));
  assert.equal(completed.completed, true, 'HTTP 200 sem conclusão efetiva');
  const completionReplay = item(await request(`${operation}: replay conclusão`, `${path}/${uid}/complete`, 'POST', completion, completionKey));
  assert.equal(completionReplay.uid, completed.uid);
  assert.equal(completionReplay.completed_at, completed.completed_at);
  await request(`${operation}: conflito conclusão`, `${path}/${uid}/complete`, 'POST', { items: [{ ...completion.items[0], result_notes: 'corpo divergente' }] }, completionKey, [409]);
  detail = item(await request(`${operation}: estado final`, `${path}/${uid}`));
  assert.equal(detail.status, 'completed');
  if (operation === 'remove') {
    const returned = (await custodyFor(uid)).find(row => row.status === 'return_pending' && !row.closed_at);
    assert.ok(returned?.uid, 'Custódia de retorno não encontrada');
    await request('declarar devolução', `/v1/admin/devices/custody/${returned.uid}/declare-return`, 'POST', { condition: 'testing', notes: `${prefix} retorno` });
    const receipt = await request('receber fisicamente', `/v1/admin/devices/custody/${returned.uid}/receive`, 'POST', {});
    report.checks.push({ label: 'resposta de recebimento', fields: Object.keys(item(receipt) || {}), closedAt: item(receipt)?.closed_at, receivedAt: item(receipt)?.received_at, status: item(receipt)?.status });
    const closed = (await custodyFor(uid)).find(row => row.uid === returned.uid);
    // The default custody list contains open records; received fixtures can leave it.
    assert.ok(item(receipt)?.closed_at || item(receipt)?.status === 'received' || (!closed && receipt.status === 200), 'Recebimento não retirou a custódia da lista aberta');
  }
}
let failure;
try {
  assert.equal(source.passed, true, 'Fonte da fixture não aprovada');
  await request('reativar prestadora de fixture', `/v1/admin/entities/${providerUid}/lifecycle`, 'PATCH', { state: 'active', reason: prefix });
  await request('reativar executor de fixture', `/v1/admin/entities/technicians/${technicianUid}`, 'PATCH', { active: true });
  const tech = item(await request('conferir executor de fixture', `/v1/admin/entities/technicians/${technicianUid}`));
  assert.equal(tech.uid_organization, org);
  assert.match(tech.name, /^QA-PHASE7-/);
  const asset = await request('criar ativo exclusivo', '/v1/admin/assets', 'POST', { uid_organization: org, uid_entity: providerUid, identification: `${prefix}-ASSET` }, randomUUID(), [201]);
  report.fixtures.asset = item(asset)?.uid;
  const models = await request('catálogo de modelos', '/v1/admin/devices/models?limit=100&offset=0');
  const model = models.body?.items?.find(row => row.active && row.requires_simcard === false && row.uid_type && row.uid_manufacturer);
  assert.ok(model, 'Sem modelo disponível que dispense SIM');
  const device = await request('criar dispositivo exclusivo', '/v1/admin/devices', 'POST', { uid_organization: org, uid_type: model.uid_type, uid_manufacturer: model.uid_manufacturer, uid_model: model.uid, device_serial: `${prefix}-DEVICE`, device_imei: null, active: true, transmits: false }, randomUUID(), [201]);
  report.fixtures.device = item(device)?.uid;
  await request('preparar dispositivo', `/v1/admin/devices/${report.fixtures.device}/prepare`, 'POST', {});
  await request('liberar dispositivo', `/v1/admin/devices/${report.fixtures.device}/release`, 'POST', { inventory_status: 'available' });
  await orderCycle('install', report.fixtures.device);
  await orderCycle('remove', report.fixtures.device);
  report.passed = true;
} catch (error) {
  failure = error;
  report.failure = error.message;
} finally {
  const cleanup = async (label, operation) => { try { await operation(); report.cleanup.push({ label, passed: true }); } catch (error) { report.cleanup.push({ label, passed: false, error: error.message }); } };
  for (const uid of report.fixtures.orders) await cleanup(`encerrar OS não terminal ${uid}`, async () => {
    const response = await call(`/v1/admin/devices/work-orders/${uid}`);
    if (response.status === 200 && !['completed', 'cancelled'].includes(item(response)?.status)) await request('cancelar OS de fixture', `/v1/admin/devices/work-orders/${uid}/cancel`, 'POST', {});
  });
  if (report.fixtures.device) await cleanup('excluir device ou inativar preservando histórico', async () => {
    const deletion = await call(`/v1/admin/devices/${report.fixtures.device}`, 'DELETE');
    if (deletion.status === 409) await request('inativar device histórico', `/v1/admin/devices/${report.fixtures.device}/lifecycle`, 'PATCH', { state: 'inactive', reason: 'Ensaio Fase 7 encerrado' });
    else assert.equal(deletion.status, 204);
  });
  if (report.fixtures.asset) await cleanup('excluir ativo de fixture', async () => { const result = await call(`/v1/admin/assets/${report.fixtures.asset}`, 'DELETE'); assert.equal(result.status, 204); });
  await cleanup('desativar executor', () => request('desativar executor', `/v1/admin/entities/technicians/${technicianUid}`, 'PATCH', { active: false }));
  await cleanup('inativar prestadora', () => request('inativar prestadora', `/v1/admin/entities/${providerUid}/lifecycle`, 'PATCH', { state: 'inactive', reason: 'Ensaio Fase 7 encerrado' }));
  await writeFile(new URL('../../api-contracts/evidence/phase7-work-orders-http-2026-11-15.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: report.passed, failure: report.failure, checks: report.checks.length, fixtures: report.fixtures, cleanup: report.cleanup }));
}
if (failure || report.cleanup.some(result => !result.passed)) process.exitCode = 1;
