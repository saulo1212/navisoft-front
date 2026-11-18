import assert from 'node:assert/strict';
import { test } from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://reports.example.test';
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/reports.js', import.meta.url));
const { reportBuckets, reportSelection } = await importBrowserModule(new URL('../src/lib/domain/reports.js', import.meta.url));
const organizationUid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const uid = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const definition = {
  report_code: 'assets.inventory', report_version: 2, export_enabled: true, export_formats: ['xlsx'],
  columns: [{ field: 'identification' }, { field: 'created_at' }, { field: 'effective_lifecycle' }],
  sort: { default: [{ field: 'identification', direction: 'asc' }] }
};
const selection = reportSelection(definition, {
  columns: ['identification', 'created_at'], q: '  frota ', includeInactive: true
});

function capture(t, response = () => Response.json({})) {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: new URL(url), ...options, body: JSON.parse(options.body ?? 'null') });
    return response();
  });
  return calls;
}

test('interactive search paginates and scopes assets; export pins columns and filters without pagination', async t => {
  const calls = capture(t);
  const args = { token: 'test', domain: 'assets', organizationUid, definition, selection };
  await api.searchReport({ ...args, limit: 20, offset: 40 });
  await api.createReport({ ...args, selection: { ...selection, limit: 20, offset: 40 }, format: 'xlsx', idempotencyKey: uid });
  assert.equal(calls[0].url.pathname, '/v1/reports/assets/search');
  assert.equal(calls[0].body.offset, 40);
  assert.equal(calls[0].body.limit, 20);
  assert.equal(calls[1].url.pathname, '/v1/reports');
  assert.equal(calls[1].headers['Idempotency-Key'], uid);
  assert.equal(calls[1].body.visibility, 'private');
  assert.deepEqual(calls[1].body.filters, { q: 'frota', filters: [], include_inactive: true });
  for (const call of calls) {
    assert.equal(call.body.uid_organization, organizationUid);
    assert.deepEqual(call.body.columns, selection.columns);
    assert.equal(call.body.report_version, 2);
  }
});

test('history preserves its explicit context and downloads through the authenticated API as bytes', async t => {
  const calls = capture(t, () => new Response(new Uint8Array([0x50, 0x4b]), { headers: { 'Content-Type': 'application/octet-stream' } }));
  await api.searchReportHistory({ token: 'test', q: 'assets', limit: 20, offset: 20, organizationUid });
  await api.getReport({ token: 'test', uid });
  const blob = await api.downloadReport({ token: 'test', uid, organizationUid });
  assert.deepEqual(calls[0].body, { uid_organization: organizationUid, q: 'assets', filters: [], limit: 20, offset: 20 });
  assert.equal(calls[1].url.searchParams.has('uid_organization'), false);
  assert.equal(calls[2].url.pathname, `/v1/reports/${uid}/download`);
  assert.equal(calls[2].url.searchParams.get('uid_organization'), organizationUid);
  assert.equal(calls[2].headers.Authorization, 'Bearer test');
  assert.deepEqual([...new Uint8Array(await blob.arrayBuffer())], [0x50, 0x4b]);
});

test('chart totals count the displayed page and keep missing values visible', () => {
  const chart = reportBuckets('assets', ['effective_lifecycle'], [
    { effective_lifecycle: 'active' }, { effective_lifecycle: null }, { effective_lifecycle: 'active' }
  ]);
  assert.deepEqual(chart, { field: 'effective_lifecycle', categories: ['active', 'Sem informação'], counts: [2, 1] });
  assert.equal(reportBuckets('assets', ['identification'], []), null);
});
