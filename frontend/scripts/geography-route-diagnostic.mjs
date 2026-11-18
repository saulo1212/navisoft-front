import { readFile, writeFile } from 'node:fs/promises';
import { homologationSession } from './homologation-session.mjs';

const { org, call } = await homologationSession();
const source = JSON.parse(await readFile(new URL('../../api-contracts/evidence/phase6-authenticated-retest-2026-11-15.json', import.meta.url), 'utf8'));
if (source.organization !== org) throw new Error('Organização de teste divergente.');
const intention = source.creations.find(row => row.path === '/v1/admin/geo/routes');
const body = { scope_level: 'organization', uid_organization: org, description: 'Fixture temporária de homologação', active: true, lateral_margin_meters: 80, max_speed_kmh: 60, points: [{ longitude: -46.63, latitude: -23.55, max_speed_to_next_kmh: 40 }, { longitude: -46.61, latitude: -23.54 }], name: intention.name };
const result = await call(intention.path, 'POST', body, intention.key);
const report = { date: new Date().toISOString(), method: 'POST', path: intention.path, body, key: intention.key, status: result.status, code: result.body?.error ?? result.body?.code, message: result.body?.message, contentType: result.contentType, errorText: result.errorText, requestId: result.requestId };
const uid = (result.body?.item ?? result.body)?.uid;
if ([200, 201].includes(result.status) && uid) {
  const deletion = await call(`${intention.path}/${uid}`, 'DELETE');
  report.cleanup = { uid, status: deletion.status, requestId: deletion.requestId };
}
await writeFile(new URL('../../api-contracts/evidence/phase6-route-exact-diagnostic-2026-11-15.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, code: report.code, requestId: report.requestId, cleanup: report.cleanup }));
if (![200, 201].includes(result.status)) process.exitCode = 1;
