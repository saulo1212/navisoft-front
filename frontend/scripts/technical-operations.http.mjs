// Controlled fixture for technicians/prices and maintenance in a test organization.
// Does not dispatch devices, link users or alter pre-existing operational records.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const base = process.env.OPS_API_URL;
const org = process.env.OPS_ORGANIZATION_UID;
const token = process.env.OPS_TOKEN;
if (!base || !org || !token) throw new Error('Configure OPS_API_URL, OPS_ORGANIZATION_UID e OPS_TOKEN para uma organização de testes.');
process.env.NEXT_PUBLIC_API_BASE_URL = base;
async function moduleUrl(url) {
  let source = await readFile(url, 'utf8');
  for (const match of [...source.matchAll(/from\s+['"](\.[^'"]+)['"]/g)]) source = source.replace(match[0], `from '${await moduleUrl(new URL(`${match[1]}.js`, url))}'`);
  return `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
}
const { apiRequest } = await import(await moduleUrl(new URL('../src/lib/api/http.js', import.meta.url)));
const tech = await import(await moduleUrl(new URL('../src/lib/api/endpoints/technicians.js', import.meta.url)));
const maintenance = await import(await moduleUrl(new URL('../src/lib/api/endpoints/maintenance.js', import.meta.url)));
const report = { date: new Date().toISOString(), base, organization: org, checks: [], fixtures: {}, cleanup: [], passed: false };
const prefix = `QA-PHASE7-${randomUUID().slice(0, 8)}`;
const call = (path, options = {}) => apiRequest(path, { token, ...options });
const uidOf = result => (result?.item ?? result)?.uid;
const check = (label, passed) => { report.checks.push({ label, passed: !!passed }); assert.ok(passed, label); };
async function negative(label, status, operation) {
  try { await operation(); check(label, false); } catch (error) { check(label, error.status === status); report.checks.at(-1).status = error.status; report.checks.at(-1).code = error.code; }
}
const previousFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  const response = await previousFetch(url, { ...options, signal: options.signal ?? AbortSignal.timeout(20000), headers: { ...options.headers, 'User-Agent': 'Mozilla/5.0' } });
  report.checks.push({ path: new URL(url).pathname, method: options.method || 'GET', status: response.status });
  return response;
};
let failure;
try {
  await call('/v1/users/status');
  const filters = [{ field: 'uid_organization', operator: 'eq', value: org }];
  const types = await call('/v1/admin/entities/types/search', { method: 'POST', body: { filters, limit: 100, offset: 0 } });
  const type = types.items?.find(type => type.code === 'technician' && type.active !== false);
  check('tipo technician existente na organização', !!type);
  const catalogResult = await tech.listTechnicianCapabilities({ token });
  const catalog = Array.isArray(catalogResult) ? catalogResult : catalogResult.items || [];
  const technology = catalog.find(cap => cap.code === 'telemetry' && cap.active !== false);
  check('capacidade telemetry disponível', !!technology);
  const provider = await call('/v1/admin/entities', { method: 'POST', body: { uid_organization: org, name: `${prefix} prestadora` }, idempotencyKey: randomUUID() });
  report.fixtures.provider = uidOf(provider);
  check('prestadora criada com UID', !!report.fixtures.provider);
  await call(`/v1/admin/entities/${report.fixtures.provider}/types`, { method: 'PUT', body: { types: [type.uid] } });
  const body = { uid_organization: org, uid_provider_entity: report.fixtures.provider, name: `${prefix} executor`, active: true };
  const key = randomUUID();
  const created = await tech.createTechnician({ token, body, idempotencyKey: key });
  const technicianUid = report.fixtures.technician = uidOf(created);
  check('executor criado com UID', !!technicianUid);
  const replay = await tech.createTechnician({ token, body, idempotencyKey: key });
  check('replay do executor mantém UID', uidOf(replay) === technicianUid);
  await negative('payload divergente retorna 409', 409, () => tech.createTechnician({ token, body: { ...body, name: `${prefix} divergente` }, idempotencyKey: key }));
  const codes = ['installation', technology.code];
  await tech.replaceCapabilities({ token, technicianUid, codes });
  const detail = await tech.getTechnician({ token, technicianUid });
  check('capabilities retornam objetos com code', detail.capabilities?.some(cap => cap.code === technology.code));
  await negative('capabilities duplicadas retornam 422', 422, () => tech.replaceCapabilities({ token, technicianUid, codes: [technology.code, technology.code] }));
  const prices = { items: [{ capability_code: technology.code, operation: 'install', technician_cost_cents: 10001, markup_percent: 12.34, currency_code: 'BRL' }] };
  await tech.replaceTechnicianPrices({ token, technicianUid, body: prices });
  const priced = await tech.getTechnicianPrices({ token, technicianUid });
  check('preço com cálculo em centavos', priced.items?.[0]?.client_price_cents === 11235);
  await tech.replaceTechnicianPrices({ token, technicianUid, body: prices });
  const noop = await tech.getTechnicianPrices({ token, technicianUid });
  check('replacement no-op preserva versão', noop.items?.[0]?.version === priced.items?.[0]?.version);
  await negative('custo negativo retorna 422', 422, () => tech.replaceTechnicianPrices({ token, technicianUid, body: { items: [{ ...prices.items[0], technician_cost_cents: -1 }] } }));
  const asset = await call('/v1/admin/assets', { method: 'POST', idempotencyKey: randomUUID(), body: { uid_organization: org, uid_entity: report.fixtures.provider, identification: `${prefix}-ASSET` } });
  const assetUid = report.fixtures.asset = uidOf(asset);
  check('ativo exclusivo da fixture criado', !!assetUid);
  const maintenanceBody = { uid_organization: org, uid_asset: assetUid, description: `${prefix} manutenção`, items: [{ description: 'Inspeção de fixture' }], conditions: [{ description: 'Condição exclusiva da fixture', blocking: true }] };
  const maintenanceKey = randomUUID();
  const order = await maintenance.createMaintenance({ token, body: maintenanceBody, idempotencyKey: maintenanceKey });
  const uid = report.fixtures.maintenance = uidOf(order);
  check('manutenção criada', !!uid);
  check('replay da manutenção mantém UID', uidOf(await maintenance.createMaintenance({ token, body: maintenanceBody, idempotencyKey: maintenanceKey })) === uid);
  const args = { token, organizationUid: org, uid };
  const opened = await maintenance.getMaintenance(args);
  check('manutenção inicia aberta', opened.status === 'open');
  check('condição bloqueante indisponibiliza somente o ativo de teste', (await maintenance.getMaintenanceAssetStatus({ token, organizationUid: org, assetUid })).operational_available === false);
  await maintenance.patchMaintenance({ ...args, body: { items: [{ description: 'Item adicional de fixture' }] } });
  const patched = await maintenance.getMaintenance(args);
  check('PATCH agrega item sem perder o anterior', patched.items?.length === 2);
  await maintenance.transitionMaintenance({ ...args, body: { status: 'in_progress' }, idempotencyKey: randomUUID() });
  const transitionBody = { status: 'completed', resolve_conditions: (patched.conditions || []).filter(condition => condition.status === 'open').map(condition => condition.uid) };
  const transitionKey = randomUUID();
  await maintenance.transitionMaintenance({ ...args, body: transitionBody, idempotencyKey: transitionKey });
  await maintenance.transitionMaintenance({ ...args, body: transitionBody, idempotencyKey: transitionKey });
  check('manutenção concluída após replay', (await maintenance.getMaintenance(args)).status === 'completed');
  check('ativo disponível após resolver condição', (await maintenance.getMaintenanceAssetStatus({ token, organizationUid: org, assetUid })).operational_available === true);
  await negative('manutenção terminal não aceita PATCH', 409, () => maintenance.patchMaintenance({ ...args, body: { description: 'Não deve alterar' } }));
  report.passed = true;
} catch (error) {
  failure = error;
  report.failure = { message: error.message, status: error.status, code: error.code };
} finally {
  const cleanup = async (label, operation) => { try { await operation(); report.cleanup.push({ label, passed: true }); } catch (error) { report.cleanup.push({ label, passed: false, status: error.status, code: error.code }); } };
  if (report.fixtures.maintenance) await cleanup('encerrar manutenção não terminal', async () => {
    const args = { token, organizationUid: org, uid: report.fixtures.maintenance };
    const current = await maintenance.getMaintenance(args);
    if (!['completed', 'cancelled'].includes(current.status)) await maintenance.transitionMaintenance({ ...args, body: { status: 'cancelled' }, idempotencyKey: randomUUID() });
  });
  if (report.fixtures.asset) await cleanup('excluir ativo de fixture ou inativar por histórico', async () => {
    try { await call(`/v1/admin/assets/${report.fixtures.asset}`, { method: 'DELETE' }); }
    catch (error) { if (error.status !== 409) throw error; await call(`/v1/admin/assets/${report.fixtures.asset}/lifecycle`, { method: 'PATCH', body: { state: 'inactive', reason: 'Fixture Fase 7 encerrada' } }); }
  });
  if (report.fixtures.technician) await cleanup('desativar executor de fixture', () => tech.patchTechnician({ token, technicianUid: report.fixtures.technician, body: { active: false } }));
  if (report.fixtures.provider) await cleanup('inativar prestadora de fixture', () => call(`/v1/admin/entities/${report.fixtures.provider}/lifecycle`, { method: 'PATCH', body: { state: 'inactive', reason: 'Fixture Fase 7 encerrada' } }));
  globalThis.fetch = previousFetch;
  const output = process.env.OPS_REPORT_PATH || 'technical-operations-http-report.json';
  await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: report.passed, checks: report.checks.length, failure: report.failure, cleanup: report.cleanup, report: output }));
}
if (failure || report.cleanup.some(result => !result.passed)) process.exitCode = 1;
