// Exclusive GED fixtures. Existing documents and global profile grants are not
// changed. Contracts/documents/revisions remain as audit history (no purge API).
import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { homologationSession } from './homologation-session.mjs';
import { importBrowserModule } from './import-browser-module.mjs';

const { base, token, org, call } = await homologationSession();
process.env.NEXT_PUBLIC_API_BASE_URL = base;
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/documents.js', import.meta.url));
const domain = await importBrowserModule(new URL('../src/lib/domain/documents.js', import.meta.url));
const args = { token, organizationUid: org };
const unwrap = value => value.item ?? value;
const prefix = `qa_phase12_${randomUUID().slice(0, 8)}`;
const report = { date: new Date().toISOString(), organization: org, checks: [], fixtures: {}, cleanup: [], passed: false };
const previousFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  const response = await previousFetch(url, { ...options, headers: { ...options.headers, 'User-Agent': 'Mozilla/5.0' }, signal: options.signal ?? AbortSignal.timeout(20000) });
  const error = response.status >= 400 ? await response.clone().json().catch(() => null) : null;
  report.checks.push({ path: new URL(url).pathname, method: options.method || 'GET', status: response.status, code: error?.code || error?.error, requestId: response.headers.get('x-request-id') });
  return response;
};
const check = (label, passed) => { report.checks.push({ label, passed: !!passed }); assert.ok(passed, label); };
async function negative(label, status, operation) {
  let error;
  try { await operation(); } catch (caught) { error = caught; }
  report.checks.push({ label, expected: status, actual: error?.status, code: error?.code });
  assert.equal(error?.status, status, label);
}
function pdf(text) {
  const stream = `BT /F1 12 Tf 40 100 Td (${text}) Tj ET`;
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 150] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let content = '%PDF-1.4\n', offsets = [0];
  for (const [i, object] of objects.entries()) { offsets.push(Buffer.byteLength(content)); content += `${i + 1} 0 obj\n${object}\nendobj\n`; }
  const xref = Buffer.byteLength(content);
  content += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new File([content], 'phase12.pdf', { type: 'application/pdf' });
}
let failure;
try {
  const catalogs = await api.getDocumentCatalogs(args);
  check('GED catalogs available', catalogs.origins.length && catalogs.areas.length && catalogs.types.length);
  const contractBody = domain.documentContractBody({ contract_year: 2026, contract_code: prefix }, org), contractKey = randomUUID();
  const contract = unwrap(await api.createDocumentContract({ ...args, body: contractBody, idempotencyKey: contractKey }));
  report.fixtures.contract = contract.uid;
  check('contract created', !!contract.uid);
  check('SYS-GED-01 exact replay returns same contract', unwrap(await api.createDocumentContract({ ...args, body: contractBody, idempotencyKey: contractKey })).uid === contract.uid);
  await negative('contract conflicting key rejected', 409, () => api.createDocumentContract({ ...args, body: { ...contractBody, contract_code: `${prefix}_different` }, idempotencyKey: contractKey }));
  const groupBody = domain.functionalGroupBody({ code: prefix, name: `${prefix} group`, description: 'Exclusive frontend fixture', active: true }, org, true);
  const group = unwrap(await api.createGedFunctionalGroup({ ...args, body: groupBody })); report.fixtures.group = group.uid;
  check('functional group created', !!group.uid);
  const status = await call('/v1/users/status');
  const userUid = status.body?.uid_user;
  check('test session actor available', !!userUid);
  const memberBody = domain.functionalMemberBody({ uid_functional_group: group.uid, uid_member_user: userUid }, org);
  const member = unwrap(await api.createGedFunctionalMember({ ...args, body: memberBody })); report.fixtures.member = member.uid;
  check('functional member created without changing user scope', !!member.uid);
  const members = await api.listGedFunctionalMembers({ ...args, groupUid: group.uid, limit: 100 });
  check('functional group members list scoped', members.items.some(row => row.uid === member.uid));
  const classBody = domain.documentClassBody({ code: prefix, name: `${prefix} class` }, org, true), classKey = randomUUID();
  const documentClass = unwrap(await api.createDocumentClass({ ...args, body: classBody, idempotencyKey: classKey })); report.fixtures.class = documentClass.uid;
  check('class replay keeps UID', unwrap(await api.createDocumentClass({ ...args, body: classBody, idempotencyKey: classKey })).uid === documentClass.uid);
  await api.updateDocumentClass({ ...args, uid: documentClass.uid, body: domain.documentClassBody({ name: `${prefix} class`, active: true, permissions: [{ principal_type: 'functional_group', uid_functional_group: group.uid, action_code: 'read' }] }, org) });
  const classDetail = unwrap(await api.getDocumentClass({ ...args, uid: documentClass.uid }));
  report.classShape = { fields: Object.keys(classDetail), permissions: classDetail.permissions };
  check('class read permission does not add other actions', classDetail.permissions?.length === 1 && classDetail.permissions[0].action_code === 'read');
  const body = domain.documentBody({ uid_contract: contract.uid, title: `${prefix} document`, origin_code: 'I', area_code: 'TEC', type_code: 'IM', metadata: '{}', uid_class: documentClass.uid, target_type: 'organization', target_uid: org }, org, catalogs);
  const documentKey = randomUUID();
  const document = unwrap(await api.createDocument({ ...args, body, idempotencyKey: documentKey })); report.fixtures.document = document.uid;
  check('document replay keeps UID', unwrap(await api.createDocument({ ...args, body, idempotencyKey: documentKey })).uid === document.uid);
  await api.assignDocumentClass({ ...args, uid: document.uid, classUid: documentClass.uid });
  const file = pdf('GED frontend QA revision zero');
  const intent = await domain.documentUploadIntent(file, '', []), uploadKey = randomUUID();
  const r00 = unwrap(await api.uploadDocumentRevision({ ...args, uid: document.uid, file, headers: intent.headers, idempotencyKey: uploadKey })); report.fixtures.r00 = r00.uid;
  check('R00 upload registered', !!r00.uid && r00.revision_number === 0);
  check('R00 exact replay keeps UID', unwrap(await api.uploadDocumentRevision({ ...args, uid: document.uid, file, headers: intent.headers, idempotencyKey: uploadKey })).uid === r00.uid);
  await negative('unchanged revision rejected with new key', 409, () => api.uploadDocumentRevision({ ...args, uid: document.uid, file, headers: { ...intent.headers, 'X-Revision-Summary': 'No change fixture' } }));
  const fileNext = pdf('GED frontend QA revision one');
  await negative('R01 missing summary rejected', 422, () => api.uploadDocumentRevision({ ...args, uid: document.uid, file: fileNext, headers: { 'Content-Type': 'application/pdf' } }));
  const intentNext = await domain.documentUploadIntent(fileNext, 'New revision fixture', [r00]);
  const r01 = unwrap(await api.uploadDocumentRevision({ ...args, uid: document.uid, file: fileNext, headers: intentNext.headers })); report.fixtures.r01 = r01.uid;
  check('R01 keeps canonical filename and records summary', r01.revision_number === 1 && r01.original_filename === r00.original_filename && r01.change_summary === 'New revision fixture');
  for (const [revision, source] of [[r00, file], [r01, fileNext]]) {
    const downloaded = await api.downloadDocumentRevision({ ...args, uid: revision.uid });
    check(`revision ${revision.revision_number} proxy download bytes match upload`, downloaded.kind === 'blob' && createHash('sha256').update(new Uint8Array(await downloaded.blob.arrayBuffer())).digest('hex') === createHash('sha256').update(new Uint8Array(await source.arrayBuffer())).digest('hex'));
  }
  const detail = unwrap(await api.getDocument({ ...args, uid: document.uid }));
  check('document metadata excludes physical storage keys', !('repository_code' in detail) && !('object_key' in detail));
  const revisions = await api.listDocumentRevisions({ ...args, uid: document.uid });
  check('exactly two revisions', (Array.isArray(revisions) ? revisions : revisions.items).length === 2);
  const listed = await api.listDocuments({ ...args, q: prefix, limit: 10 });
  check('document search is tenant/title scoped', listed.items.some(row => row.uid === document.uid));
  const distributions = await api.listDocumentDistributions({ ...args, uid: document.uid, limit: 10 });
  check('owner distribution list available', Array.isArray(distributions.items) || Array.isArray(distributions));
  const organizations = await call('/v1/users/me/organizations?limit=100');
  const recipient = organizations.body?.items?.find(row => row.uid !== org && /homolog/i.test(row.name || ''));
  if (recipient) {
    report.recipientOrganization = recipient.uid;
    const distributionBody = domain.distributionBody({ uid_recipient_organization: recipient.uid, revision_policy: 'follow_latest' }, [r00, r01], true, org);
    const distributionKey = randomUUID();
    const distribution = unwrap(await api.createDocumentDistribution({ ...args, uid: document.uid, body: distributionBody, idempotencyKey: distributionKey })); report.fixtures.distribution = distribution.uid;
    check('distribution exact replay keeps UID', unwrap(await api.createDocumentDistribution({ ...args, uid: document.uid, body: distributionBody, idempotencyKey: distributionKey })).uid === distribution.uid);
    await api.updateDocumentDistribution({ ...args, uid: distribution.uid, body: domain.distributionBody({ revision_policy: 'fixed_revision', uid_fixed_revision: r00.uid }, [r00, r01], false) });
    const received = unwrap(await api.getDocument({ token, organizationUid: recipient.uid, uid: document.uid }));
    check('recipient context exposes fixed revision while preserving owner', received.uid_organization === org && received.uid_organization_context === recipient.uid && received.revisions?.length === 1 && received.revisions[0].uid === r00.uid);
  } else report.distributionLimit = 'No second organization explicitly named for homologation; existing organizations were not used as recipients.';
  report.passed = true;
} catch (error) { failure = error; report.failure = { status: error.status, code: error.code, message: error.code || (error.name === 'AssertionError' ? error.message : error.name) }; }
finally {
  for (const [kind, operation, body] of [
    ['distribution', api.revokeDocumentDistribution],
    ['member', api.removeGedFunctionalMember],
    ['class', api.updateDocumentClass, { name: `${prefix} class`, active: false, permissions: [] }],
    ['group', api.updateGedFunctionalGroup, { name: `${prefix} group`, active: false, description: 'Inactive test fixture' }]
  ]) if (report.fixtures[kind]) {
    try { await operation({ ...args, uid: report.fixtures[kind], body }); report.cleanup.push({ kind, uid: report.fixtures[kind], completed: true }); }
    catch (error) { report.cleanup.push({ kind, uid: report.fixtures[kind], completed: false, status: error.status, code: error.code }); report.passed = false; failure ||= error; }
  }
  report.preserved = ['contract', 'document', 'r00', 'r01'].filter(kind => report.fixtures[kind]);
  await call('/v1/users/logout', 'POST').catch(() => {});
  globalThis.fetch = previousFetch;
  await writeFile(new URL('../../api-contracts/evidence/phase12-http-2026-11-17.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
if (failure || !report.passed) process.exitCode = 1;
