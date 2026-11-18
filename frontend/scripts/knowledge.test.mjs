import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://knowledge.test';
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/knowledge.js', import.meta.url));
const domain = await importBrowserModule(new URL('../src/lib/domain/knowledge.js', import.meta.url));
const org = '11111111-1111-4111-8111-111111111111';
const uid = '22222222-2222-4222-8222-222222222222';
const other = '33333333-3333-4333-8333-333333333333';
const args = { token: 'test-only', organizationUid: org, uid, slug: 'artigo-de-teste' };
const video = { title: 'Orientação', url: 'https://youtu.be/jNQXAC9IVRw', description: '', sort_order: 1 };
const revision = { title: ' Artigo ', summary: ' Resumo ', body: ' Texto ', videos: [video] };
async function capture(operation, status = 200, payload = {}, contentType = 'application/json') {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ ...options, url: new URL(url), json: options.body === undefined ? undefined : JSON.parse(options.body) });
    return new Response(status === 204 ? null : contentType === 'application/json' ? JSON.stringify(payload) : payload, { status, headers: { 'Content-Type': contentType } });
  };
  try { return { calls, result: await operation() }; } finally { globalThis.fetch = previous; }
}
test('item creation only sends slug and rejects path manipulation', () => {
  assert.deepEqual(domain.knowledgeItemBody(' teste-artigo '), { slug: 'teste-artigo' });
  for (const slug of ['', '../admin', 'hello world', 'slug?token=x']) assert.throws(() => domain.knowledgeItemBody(slug));
});
test('revision has independent body, canonical videos and no publication metadata', () => {
  const body = domain.knowledgeRevisionBody({ ...revision, uid, audience_mode: 'public' });
  assert.deepEqual(body, { title: 'Artigo', summary: 'Resumo', body: 'Texto', videos: [{ ...video, url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' }] });
  assert.equal('audience_mode' in body, false); assert.equal('uid' in body, false);
});
test('published revision can seed a new draft while preserving video identity and order', () => {
  const form = domain.knowledgeRevisionForm({ ...revision, videos: [{ ...video, youtube_video_id: 'jNQXAC9IVRw' }], attachments: [{ uid_document: uid }] });
  assert.equal(domain.knowledgeRevisionBody(form).videos[0].sort_order, 1);
  assert.equal('attachments' in form, false);
});
test('video URL validation rejects untrusted hosts, schemes and credentials', () => {
  assert.equal(domain.youtubeVideoId('https://www.youtube.com/watch?v=jNQXAC9IVRw&feature=share'), 'jNQXAC9IVRw');
  for (const url of ['javascript:alert(1)', 'http://youtu.be/jNQXAC9IVRw', 'https://youtube.com.evil.test/watch?v=jNQXAC9IVRw', 'https://user:pass@youtube.com/watch?v=jNQXAC9IVRw', 'https://youtu.be/bad']) assert.throws(() => domain.youtubeVideoId(url));
  assert.equal(domain.safeVideoUrl({ url: 'javascript:bad' }), null);
});
test('duplicate video IDs or positions, excessive lists and limits are rejected', () => {
  for (const videos of [[video, { ...video, sort_order: 2 }], [video, { ...video, url: 'https://youtu.be/9bZkp7q19f0' }], [{ ...video, sort_order: 0 }], [{ ...video, title: 'x'.repeat(151) }], [{ ...video, description: 'x'.repeat(501) }], Array(21).fill(video)]) assert.throws(() => domain.knowledgeRevisionBody({ ...revision, videos }));
  assert.throws(() => domain.knowledgeRevisionBody({ ...revision, body: ' ' }));
});
test('publication is separate, pins a revision and validates audience', () => {
  assert.deepEqual(domain.knowledgePublishBody(uid, 'authenticated'), { uid_revision: uid, audience_mode: 'authenticated' });
  assert.throws(() => domain.knowledgePublishBody(uid, 'everyone'));
  assert.throws(() => domain.knowledgePublishBody('', 'public'));
});
test('attachment replacement sends fixed GED pairs only and can explicitly clear the set', () => {
  assert.deepEqual(domain.knowledgeAttachmentsBody([{ uid_document: uid, uid_document_revision: other, uid, storage_key: 'not-an-input' }]), { attachments: [{ uid_document: uid, uid_document_revision: other }] });
  assert.deepEqual(domain.knowledgeAttachmentsBody([]), { attachments: [] });
  assert.throws(() => domain.knowledgeAttachmentsBody([{ uid_document: uid, uid_document_revision: 'bad' }]));
  assert.throws(() => domain.knowledgeAttachmentsBody(Array(2).fill({ uid_document: uid, uid_document_revision: other })));
});
test('grants replace complete list and empty list explicitly revokes', () => {
  assert.deepEqual(domain.knowledgeGrantsBody('[]'), { grants: [] });
  assert.throws(() => domain.knowledgeGrantsBody('{}')); assert.throws(() => domain.knowledgeGrantsBody('['));
});
test('administrative search uses documented global POST q/limit/offset without tenant narrowing', async () => {
  const { calls: [call] } = await capture(() => api.listKnowledgeItems({ ...args, q: 'câmera', limit: 5, offset: 10 }));
  assert.equal(call.url.pathname, '/v1/admin/knowledge/items/search'); assert.equal(call.method, 'POST');
  assert.deepEqual(call.json, { q: 'câmera', limit: 5, offset: 10 });
});
test('editorial create/revision/publish/archive keep caller idempotency keys and target UID', async () => {
  for (const operation of [api.createKnowledgeItem, api.createKnowledgeRevision, api.publishKnowledgeItem, api.archiveKnowledgeItem]) {
    const controller = new AbortController();
    const { calls: [call] } = await capture(() => operation({ ...args, body: {}, idempotencyKey: other, signal: controller.signal }));
    assert.equal(call.method, 'POST'); assert.equal(call.headers['Idempotency-Key'], other); assert.equal(call.signal, controller.signal);
    if (operation !== api.createKnowledgeItem) assert.ok(call.url.pathname.includes(`/items/${uid}/`));
  }
});
test('public list/details never carry a logged-in token or organization', async () => {
  for (const operation of [api.listPublicKnowledge, api.getPublicKnowledge]) {
    const { calls: [call] } = await capture(() => operation(args));
    assert.equal(call.headers.Authorization, undefined); assert.equal(call.url.searchParams.has('uid_organization'), false);
    assert.ok(call.url.pathname.startsWith('/v1/public/knowledge/'));
  }
});
test('authenticated reader pins session and explicit organization, does not use admin detail', async () => {
  for (const operation of [api.listReadableKnowledge, api.getReadableKnowledge]) {
    const { calls: [call] } = await capture(() => operation(args));
    assert.equal(call.headers.Authorization, 'Bearer test-only'); assert.equal(call.url.searchParams.get('uid_organization'), org);
    assert.ok(call.url.pathname.startsWith('/v1/knowledge/items'));
  }
  assert.throws(() => api.getReadableKnowledge({ ...args, organizationUid: '' }));
});
test('public attachment download discards passed auth and reads exact binary bytes', async () => {
  const bytes = new Uint8Array([0, 255, 128, 10, 13]);
  const { calls: [call], result } = await capture(() => api.downloadKnowledgeAttachment({ ...args, publicAccess: true }), 200, bytes, 'application/pdf');
  assert.equal(call.headers.Authorization, undefined); assert.equal(call.url.searchParams.has('uid_organization'), false);
  assert.deepEqual(new Uint8Array(await result.arrayBuffer()), bytes);
  assert.equal(call.url.pathname, `/v1/public/knowledge/items/${args.slug}/attachments/${uid}`);
});
test('authenticated attachment download uses session and tenant without trusting a storage URL', async () => {
  const { calls: [call] } = await capture(() => api.downloadKnowledgeAttachment({ ...args, download_url: 'https://evil.test' }), 200, 'content', 'application/octet-stream');
  assert.equal(call.url.host, 'knowledge.test'); assert.equal(call.headers.Authorization, 'Bearer test-only');
  assert.equal(call.url.searchParams.get('uid_organization'), org);
});
test('attachment errors and storage unavailable retain shared business codes', async () => {
  for (const [status, code] of [[404, 'knowledge_attachment_not_found'], [503, 'knowledge_storage_unavailable']]) await assert.rejects(() => capture(() => api.downloadKnowledgeAttachment({ ...args, publicAccess: true }), status, { code }), error => error.status === status && error.code === code);
});
