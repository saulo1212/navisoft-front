// Own temporary article only. Public publication contains generic QA text and
// is archived in finally. No existing article, category, grant or GED is edited.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { homologationSession } from './homologation-session.mjs';
import { importBrowserModule } from './import-browser-module.mjs';

const { base, token, org, call } = await homologationSession();
process.env.NEXT_PUBLIC_API_BASE_URL = base;
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/knowledge.js', import.meta.url));
const domain = await importBrowserModule(new URL('../src/lib/domain/knowledge.js', import.meta.url));
const report = { date: new Date().toISOString(), checks: [], cleanup: [], passed: false };
const slug = `qa-phase11-${randomUUID().slice(0, 8)}`;
const args = { token, organizationUid: org, slug };
const unwrap = result => result.item ?? result;
const check = (label, passed) => { report.checks.push({ label, passed: !!passed }); assert.ok(passed, label); };
const previousFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  const response = await previousFetch(url, { ...options, headers: { ...options.headers, 'User-Agent': 'Mozilla/5.0' }, signal: options.signal ?? AbortSignal.timeout(20000) });
  const error = response.status >= 400 ? await response.clone().json().catch(() => null) : null;
  report.checks.push({ path: new URL(url).pathname, method: options.method || 'GET', status: response.status, code: error?.code || error?.error, authenticated: !!options.headers?.Authorization, requestId: response.headers.get('x-request-id') });
  return response;
};
async function negative(label, status, operation) {
  let error;
  try { await operation(); } catch (caught) { error = caught; }
  report.checks.push({ label, expected: status, actual: error?.status, code: error?.code });
  assert.equal(error?.status, status, label);
}
let uid, failure;
try {
  const categories = await api.listKnowledgeCategories({ token, limit: 5, offset: 0 });
  check('category catalog paginated', Array.isArray(categories.items) && Number.isInteger(categories.total));
  const listed = await api.listKnowledgeItems({ token, limit: 2, offset: 0 });
  check('admin list/search no longer returns historical 503', Array.isArray(listed.items) && listed.limit === 2);
  const key = randomUUID();
  const body = domain.knowledgeItemBody(slug);
  const created = unwrap(await api.createKnowledgeItem({ token, body, idempotencyKey: key }));
  uid = created.uid; report.fixture = { uid, slug };
  check('item draft created without revision or public exposure', !!uid && created.publication_status === 'draft' && !created.latest_revision);
  check('item replay keeps UID', unwrap(await api.createKnowledgeItem({ token, body, idempotencyKey: key })).uid === uid);
  await negative('draft hidden from anonymous access', 404, () => api.getPublicKnowledge({ slug }));
  const revisionBody = domain.knowledgeRevisionBody({ title: `${slug} orientação`, summary: 'Artigo temporário de validação frontend.', body: 'Conteúdo genérico e temporário para validar a base de conhecimento.', videos: [{ title: 'Referência de validação', url: 'https://youtu.be/jNQXAC9IVRw', description: '', sort_order: 1 }] });
  const revisionKey = randomUUID();
  const first = unwrap(await api.createKnowledgeRevision({ token, uid, body: revisionBody, idempotencyKey: revisionKey }));
  report.firstRevisionShape = { fields: Object.keys(first) };
  check('revision created', !!first.uid);
  check('revision replay retains UID', unwrap(await api.createKnowledgeRevision({ token, uid, body: revisionBody, idempotencyKey: revisionKey })).uid === first.uid);
  await negative('revision key conflicting body rejected', 409, () => api.createKnowledgeRevision({ token, uid, body: { ...revisionBody, title: 'Changed' }, idempotencyKey: revisionKey }));
  await api.replaceKnowledgeAttachments({ token, uid: first.uid, body: { attachments: [] } });
  await api.publishKnowledgeItem({ token, uid, body: domain.knowledgePublishBody(first.uid, 'public') });
  const publicItem = unwrap(await api.getPublicKnowledge({ slug }));
  check('public reader returns explicitly published snapshot anonymously', publicItem.title === revisionBody.title && publicItem.videos?.[0]?.youtube_video_id === 'jNQXAC9IVRw');
  const publicList = await api.listPublicKnowledge({ q: slug, limit: 2, offset: 0 });
  check('public search finds published fixture', publicList.items.some(row => row.slug === slug));
  const next = unwrap(await api.createKnowledgeRevision({ token, uid, body: { ...revisionBody, title: `${slug} novo rascunho`, videos: [] } }));
  check('new draft leaves published content unchanged', unwrap(await api.getPublicKnowledge({ slug })).title === revisionBody.title);
  const detail = unwrap(await api.getKnowledgeItem({ token, uid }));
  check('admin detail separates latest and published revision', detail.latest_revision.uid === next.uid && detail.published_revision_uid === first.uid);
  const history = await api.listKnowledgeRevisions({ token, uid });
  check('revision history has fixed snapshots', history.items.length >= 2 && history.items.every(row => !Object.hasOwn(row, 'videos')));
  const search = await api.listKnowledgeItems({ token, q: slug, limit: 2, offset: 0 });
  check('administrative q search finds draft title', search.items.some(row => row.uid === uid));
  report.grantIssues = [];
  for (const grants of [[{ principal_type: 'profile', profile_code: 'primary_admin', scope_type: 'global' }], []]) {
    try { await api.replaceKnowledgeGrants({ token, uid, body: { grants } }); }
    catch (error) { report.grantIssues.push({ operation: grants.length ? 'profile grant' : 'clear grants', status: error.status, code: error.code }); }
  }
  await api.publishKnowledgeItem({ token, uid, body: domain.knowledgePublishBody(next.uid, 'authenticated') });
  await negative('authenticated audience hidden from public reader', 404, () => api.getPublicKnowledge({ slug }));
  check('authenticated reader receives published revision with tenant context', unwrap(await api.getReadableKnowledge(args)).title === `${slug} novo rascunho`);
  const readable = await api.listReadableKnowledge({ ...args, q: slug, limit: 2, offset: 0 });
  check('authenticated catalog search works', readable.items.some(row => row.slug === slug));
  report.passed = report.grantIssues.length === 0;
} catch (error) { failure = error; report.failure = { status: error.status, code: error.code, message: error.code || (error.name === 'AssertionError' ? error.message : error.name) }; }
finally {
  if (uid) {
    try {
      await api.archiveKnowledgeItem({ token, uid }); report.cleanup.push({ uid, archived: true });
      let hidden;
      try { await api.getPublicKnowledge({ slug }); hidden = false; } catch (error) { hidden = error.status === 404; }
      report.cleanup.push({ publicHidden: hidden }); if (!hidden) report.passed = false;
    } catch (error) { report.cleanup.push({ uid, archived: false, status: error.status, code: error.code }); report.passed = false; failure ||= error; }
  }
  await call('/v1/users/logout', 'POST').catch(() => {});
  globalThis.fetch = previousFetch;
  await writeFile(new URL('../../api-contracts/evidence/phase11-http-2026-11-17.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
if (failure || !report.passed) process.exitCode = 1;
