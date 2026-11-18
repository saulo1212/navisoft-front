import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://ged.test';
process.env.NAVISOFT_API_URL = 'https://ged-upstream.test';
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/documents.js', import.meta.url));
const domain = await importBrowserModule(new URL('../src/lib/domain/documents.js', import.meta.url));
const http = await importBrowserModule(new URL('../src/lib/api/http.js', import.meta.url));
const proxy = await importBrowserModule(new URL('../src/app/api/navisoft/[...path]/route.js', import.meta.url));
const org = '11111111-1111-4111-8111-111111111111';
const uid = '22222222-2222-4222-8222-222222222222';
const other = '33333333-3333-4333-8333-333333333333';
const args = { token: 'test-only', organizationUid: org, uid };
const catalogs = { origins: [{ code: 'I', active: true }], areas: [{ code: 'TEC', active: true }], types: [{ code: 'IM', active: true }] };
const form = { uid_contract: uid, title: ' Termo ', origin_code: 'I', area_code: 'TEC', type_code: 'IM', metadata: '{}' };
async function capture(operation, { status = 200, payload = {}, contentType = 'application/json' } = {}) {
  const previous = globalThis.fetch, calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ ...options, url: new URL(url), json: typeof options.body === 'string' && options.headers?.['Content-Type'] === 'application/json' ? JSON.parse(options.body) : undefined });
    return new Response(status === 204 ? null : contentType === 'application/json' ? JSON.stringify(payload) : payload, { status, headers: { 'Content-Type': contentType, 'x-request-id': 'test-request', 'content-disposition': 'attachment; filename="test.pdf"' } });
  };
  try { return { calls, result: await operation() }; } finally { globalThis.fetch = previous; }
}
const pdf = (text = 'fixture', name = 'test.pdf') => new File([`%PDF-1.4\n${text}\n%%EOF`], name, { type: 'application/pdf' });
test('contract is tenant scoped and validates its independent year/code', () => {
  assert.deepEqual(domain.documentContractBody({ contract_year: '2026', contract_code: ' QA ' }, org), { uid_organization: org, contract_year: 2026, contract_code: 'QA' });
  for (const patch of [{ contract_year: 0 }, { contract_year: 1.5 }, { contract_code: '' }]) assert.throws(() => domain.documentContractBody({ contract_year: 2026, contract_code: 'QA', ...patch }, org));
});
test('document pins owner/contract and validated catalog codes, target is separate from distribution', () => {
  const body = domain.documentBody({ ...form, uid_class: other, target_type: 'entity', target_uid: other, repository_code: 'ignored' }, org, catalogs);
  assert.deepEqual(body.target, { type: 'entity', uid: other }); assert.equal(body.uid_organization, org); assert.equal(body.uid_class, other); assert.equal('distribution' in body, false); assert.equal('repository_code' in body, false);
  for (const patch of [{ type_code: 'UNKNOWN' }, { uid_contract: 'bad' }, { metadata: '[]' }, { target_type: 'asset', target_uid: other }]) assert.throws(() => domain.documentBody({ ...form, ...patch }, org, catalogs));
});
test('class creation does not invent implicit permissions', () => {
  assert.deepEqual(domain.documentClassBody({ code: 'finance', name: ' Financeiro ', permissions: [{ action_code: 'manage' }] }, org, true), { uid_organization: org, code: 'finance', name: 'Financeiro' });
});
test('class full replacement strips response metadata and keeps every action independent', () => {
  const permission = { uid, uid_class: uid, principal_type: 'functional_group', uid_functional_group: other, action_code: 'read' };
  const body = domain.documentClassBody(domain.documentClassForm({ code: 'x', name: 'X', active: false, permissions: [permission] }), org);
  assert.deepEqual(body, { name: 'X', active: false, permissions: [{ principal_type: 'functional_group', uid_functional_group: other, action_code: 'read' }] });
  assert.deepEqual(domain.documentClassBody({ name: 'X', active: true, permissions: [] }, org).permissions, []);
});
test('invalid/duplicate class permissions reject before mutation', () => {
  for (const permissions of [[{ principal_type: 'target', action_code: 'all' }], [{ principal_type: 'unknown', action_code: 'read' }], [{ principal_type: 'functional_group', action_code: 'read', uid_functional_group: 'bad' }], Array(2).fill({ principal_type: 'target', action_code: 'read' })]) assert.throws(() => domain.documentClassBody({ name: 'X', active: true, permissions }, org));
});
test('distribution follow_latest omits stale fixed revision and pins recipient only on create', () => {
  const body = domain.distributionBody({ uid_recipient_organization: other, revision_policy: 'follow_latest', uid_fixed_revision: uid }, [{ uid }], true, org);
  assert.deepEqual(body, { access_mode: 'read', revision_policy: 'follow_latest', uid_recipient_organization: other });
  assert.deepEqual(domain.distributionBody({ revision_policy: 'fixed_revision', uid_fixed_revision: uid, uid_recipient_organization: other }, [{ uid }], false), { access_mode: 'read', revision_policy: 'fixed_revision', uid_fixed_revision: uid });
});
test('distribution cannot fix a foreign revision or share back to its owner', () => {
  assert.throws(() => domain.distributionBody({ uid_recipient_organization: org, revision_policy: 'follow_latest' }, [], true, org));
  assert.throws(() => domain.distributionBody({ revision_policy: 'fixed_revision', uid_fixed_revision: other }, [{ uid }], false));
});
test('functional membership pins user/group/tenant without changing user scopes', () => {
  assert.deepEqual(domain.functionalMemberBody({ uid_functional_group: uid, uid_member_user: other, scopes: ['global'] }, org), { uid_organization: org, uid_functional_group: uid, uid_member_user: other });
});
test('R00 upload uses binary PDF bytes and sets filename but no empty summary header', async () => {
  const file = pdf();
  const intent = await domain.documentUploadIntent(file, '', []);
  assert.deepEqual(intent.headers, { 'Content-Type': 'application/pdf', 'X-File-Name': 'test.pdf' });
  assert.match(intent.signature.hash, /^[a-f0-9]{64}$/);
  const { calls: [call] } = await capture(() => api.uploadDocumentRevision({ ...args, file, headers: intent.headers, idempotencyKey: uid }));
  assert.equal(call.body, file); assert.equal(call.headers['Content-Type'], 'application/pdf'); assert.equal(call.headers['Idempotency-Key'], uid); assert.equal(call.url.searchParams.get('uid_organization'), org);
});
test('R01 inherits canonical filename, requires summary and keeps family MIME', async () => {
  const prior = [{ uid, revision_number: 0, mime_type: 'application/pdf', original_filename: 'original.pdf' }];
  const intent = await domain.documentUploadIntent(pdf('changed', 'renamed.pdf'), ' Revisão corrigida ', prior);
  assert.equal('X-File-Name' in intent.headers, false); assert.equal(intent.signature.filename, 'original.pdf');
  assert.equal(new TextDecoder().decode(Uint8Array.from(intent.headers['X-Revision-Summary'], char => char.charCodeAt(0))), 'Revisão corrigida');
  await assert.rejects(() => domain.documentUploadIntent(pdf(), '', prior));
  await assert.rejects(() => domain.documentUploadIntent(new File([new Uint8Array([255, 216, 255, 0])], 'x.jpg', { type: 'image/jpeg' }), 'Changed', prior));
});
test('retry signature changes with bytes, filename or summary, independent of same file metadata', async () => {
  const initial = await domain.documentUploadIntent(pdf('a'), '', []);
  assert.deepEqual(await domain.documentUploadIntent(pdf('a'), '', []), initial);
  assert.notDeepEqual((await domain.documentUploadIntent(pdf('b'), '', [])).signature, initial.signature);
  assert.notDeepEqual((await domain.documentUploadIntent(pdf('a', 'other.pdf'), '', [])).signature, initial.signature);
  assert.notDeepEqual((await domain.documentUploadIntent(pdf('a'), 'Summary', [])).signature, initial.signature);
});
test('upload rejects zero bytes, wrong MIME/extension/magic, summary controls and excessive characters', async () => {
  for (const file of [new File([], 'x.pdf'), new File(['fake'], 'x.pdf', { type: 'application/pdf' }), new File(['%PDF-1.4'], 'x.docx', { type: 'application/pdf' }), new File(['%PDF-1.4'], 'x.jpg', { type: 'image/jpeg' })]) await assert.rejects(() => domain.documentUploadIntent(file, '', []));
  for (const text of ['x\ny', 'x'.repeat(501)]) await assert.rejects(() => domain.documentUploadIntent(pdf(), text, []));
});
test('document search and class/group lists carry exactly one explicit organization filter', async () => {
  for (const operation of [api.listDocuments, api.listDocumentClasses, api.listGedFunctionalGroups]) {
    const { calls: [call] } = await capture(() => operation({ ...args, q: 'Termo', limit: 10, offset: 20 }));
    const filters = operation === api.listDocuments ? call.json.filters : JSON.parse(call.url.searchParams.get('filters'));
    assert.equal(filters.filter(row => row.field === 'uid_organization' && row.operator === 'eq' && row.value === org).length, 1);
    assert.equal(operation === api.listDocuments ? call.json.offset : Number(call.url.searchParams.get('offset')), 20);
  }
});
test('contract/document/class creates pin organization and caller idempotency key', async () => {
  for (const operation of [api.createDocumentContract, api.createDocument, api.createDocumentClass]) {
    const { calls: [call] } = await capture(() => operation({ ...args, body: { uid_organization: other }, idempotencyKey: uid }));
    assert.equal(call.json.uid_organization, org); assert.equal(call.headers['Idempotency-Key'], uid);
  }
});
test('detail and mutations retain selected context, including distribution owner actions', async () => {
  for (const operation of [api.getDocument, api.listDocumentRevisions, api.assignDocumentClass, api.listDocumentDistributions, api.createDocumentDistribution, api.updateDocumentDistribution, api.revokeDocumentDistribution, api.getDocumentClass, api.updateDocumentClass, api.removeGedFunctionalMember]) {
    const { calls: [call] } = await capture(() => operation({ ...args, body: {}, classUid: other }));
    assert.equal(call.url.searchParams.get('uid_organization'), org);
  }
  assert.throws(() => api.getDocument({ ...args, organizationUid: '' }));
});
test('download supports exact proxy bytes and authorized HTTPS presign without following it', async () => {
  const bytes = new Uint8Array([0, 255, 128, 10]);
  const binary = await capture(() => api.downloadDocumentRevision(args), { payload: bytes, contentType: 'application/pdf' });
  assert.deepEqual(new Uint8Array(await binary.result.blob.arrayBuffer()), bytes);
  const linked = await capture(() => api.downloadDocumentRevision(args), { payload: { url: 'https://private-storage.test/object?signature=example', expires_at: '2026-11-17T15:00:00Z' } });
  assert.equal(linked.result.kind, 'link'); assert.equal(linked.calls.length, 1); assert.equal(linked.calls[0].url.host, 'ged.test');
  await assert.rejects(() => capture(() => api.downloadDocumentRevision(args), { payload: { url: 'javascript:alert(1)' } }));
});
test('401, 404, 409 and storage errors remain shared API errors for binary requests', async () => {
  for (const [status, code] of [[401, 'authentication_required'], [404, 'document_not_found'], [409, 'document_revision_unchanged'], [503, 'document_storage_unavailable']]) await assert.rejects(() => capture(() => api.downloadDocumentRevision(args), { status, payload: { code } }), error => error.status === status && error.code === code);
  await assert.rejects(() => http.apiRequest('/x', { body: {}, rawBody: pdf() }));
});
test('same-origin proxy forwards upload headers and unchanged binary bytes with metadata headers back', async () => {
  const bytes = new Uint8Array([37, 80, 68, 70, 45, 255]);
  const request = new Request('https://frontend.test/api/navisoft/v1/admin/documents/revisions', { method: 'POST', headers: { Authorization: 'Bearer test-only', 'Content-Type': 'application/pdf', 'X-File-Name': 'test.pdf', 'X-Revision-Summary': 'Updated', 'Idempotency-Key': uid }, body: bytes });
  const { calls: [call], result } = await capture(() => proxy.POST(request, { params: Promise.resolve({ path: ['v1', 'admin', 'documents', uid, 'revisions'] }) }), { status: 201, payload: { uid } });
  assert.equal(call.url.host, 'ged-upstream.test'); assert.deepEqual(new Uint8Array(call.body), bytes);
  assert.equal(call.headers.get('x-file-name'), 'test.pdf'); assert.equal(call.headers.get('x-revision-summary'), 'Updated');
  assert.equal(call.headers.get('authorization'), 'Bearer test-only'); assert.equal(call.headers.get('idempotency-key'), uid);
  assert.equal(result.headers.get('x-request-id'), 'test-request'); assert.equal(result.headers.get('cache-control'), 'no-store');
});
