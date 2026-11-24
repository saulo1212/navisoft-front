import assert from 'node:assert/strict';
import { test } from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://account.example.test';

const { fetchProfile, updateProfile, requestContactVerification, confirmContactVerification } =
  await importBrowserModule(new URL('../src/lib/api/endpoints/auth.js', import.meta.url));
const { canAccessPath, isDemoPath, requiresOrganization } =
  await importBrowserModule(new URL('../src/lib/navigation/access.js', import.meta.url));

test('account profile and legacy entry are authenticated routes independent of organization selection', () => {
  for (const path of ['/account/profile', '/access-control/user-profile']) {
    assert.equal(canAccessPath(path, null), false);
    assert.equal(canAccessPath(path, { status: 'evaluated', areas: {} }), true);
    assert.equal(requiresOrganization(path), false);
    assert.equal(isDemoPath(path), false);
  }
});

test('profile and verification use the current session and the challenge assigned by the API', async t => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const path = new URL(url).pathname;
    calls.push({ path, ...options });
    if (path.endsWith('/request')) return Response.json({ accepted: true, challenge_id: 'challenge-test' }, { status: 202 });
    if (path.endsWith('/confirm')) return Response.json({ verified: true });
    return Response.json({ display_name: 'Nome de teste' });
  });
  const args = { token: 'session-test', signal: new AbortController().signal };

  await fetchProfile(args);
  await updateProfile({ ...args, patch: { display_name: 'Nome de teste' } });
  const { challenge_id: challengeId } = await requestContactVerification(args);
  const result = await confirmContactVerification({ ...args, challengeId, verificationToken: 'proof-test' });

  assert.equal(result.verified, true);
  assert.deepEqual(calls.map(call => [call.method, call.path, call.body && JSON.parse(call.body)]), [
    ['GET', '/v1/users/profile', undefined],
    ['PUT', '/v1/users/profile', { display_name: 'Nome de teste' }],
    ['POST', '/v1/users/contact-verification/request', { channel: 'email' }],
    ['POST', '/v1/users/contact-verification/confirm', { channel: 'email', challenge_id: 'challenge-test', token: 'proof-test' }]
  ]);
  assert.ok(calls.every(call => call.signal === args.signal && call.cache === 'no-store'
    && call.headers.Authorization === 'Bearer session-test'));
});

test('verification retains the server Retry-After when the cooldown response omits seconds', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ code: 'contact_verification_cooldown' }, {
    status: 429,
    headers: { 'Retry-After': '10' }
  }));

  await assert.rejects(requestContactVerification({ token: 'session-test' }), {
    status: 429, retryAfter: '10'
  });
});
