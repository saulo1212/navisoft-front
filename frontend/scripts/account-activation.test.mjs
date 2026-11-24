import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';
import { activationLink, isActivationCandidate } from '../src/lib/domain/activation.js';
import { canAccessPath, isDemoPath } from '../src/lib/navigation/access.js';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://activation.test';
const auth = await importBrowserModule(new URL('../src/lib/api/endpoints/auth.js', import.meta.url));
const organizations = await importBrowserModule(new URL('../src/lib/api/endpoints/organizations.js', import.meta.url));
const users = await importBrowserModule(new URL('../src/lib/api/endpoints/users.js', import.meta.url));
const organizationUid = '11111111-1111-4111-8111-111111111111';
const adminUid = '22222222-2222-4222-8222-222222222222';
const challengeId = '33333333-3333-4333-8333-333333333333';

async function capture(run) {
  const previous = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push({ url: new URL(url), ...options, body: options.body && JSON.parse(options.body) });
    return new Response('{}');
  };
  try { await run(requests); } finally { globalThis.fetch = previous; }
}

test('first access is public and both invitation credentials are removed from the address', () => {
  assert.equal(canAccessPath('/auth/activate', null), true);
  assert.equal(isDemoPath('/auth/activate'), false);
  const url = 'https://activation.test/auth/activate';
  for (const params of [
    `?lang=pt#challenge_id=${challengeId}&token=a%2Bb`,
    `?lang=pt&challenge_id=${challengeId}#token=a%2Bb`,
    `?lang=pt&challenge_id=${challengeId}&token=a%2Bb`
  ]) {
    assert.deepEqual(activationLink(new URL(url + params)), {
      challengeId, token: 'a+b', cleanPath: '/auth/activate?lang=pt'
    });
  }
});

test('only pending-looking administrators in the target organization become candidates', () => {
  const candidate = { uid_organization: organizationUid, profile_code: 'secondary_admin', enabled: false,
    password_initialized: false, email: 'admin@example.test' };
  assert.equal(isActivationCandidate(candidate, organizationUid), true);
  assert.equal(isActivationCandidate({ ...candidate, profile_code: 'administrator' }, organizationUid), true);
  for (const patch of [
    { uid_organization: adminUid }, { enabled: true }, { password_initialized: true },
    { profile_code: 'basic_user' }, { email: ' ' }, { password_initialized: undefined }
  ]) {
    assert.equal(isActivationCandidate({ ...candidate, ...patch }, organizationUid), false);
  }
});

test('invitation is scoped to the organization and administrator and preserves the retry key', async () => {
  await capture(async requests => {
    await users.listDisabledOrganizationUsers({ token: 'session-test', organizationUid, offset: 20, limit: 20 });
    await organizations.sendActivationInvitation({ token: 'session-test', organizationUid, adminUid, idempotencyKey: challengeId });
    const [list, invite] = requests;
    assert.equal(list.url.searchParams.get('include_inactive'), 'true');
    assert.equal(list.url.searchParams.get('offset'), '20');
    assert.deepEqual(JSON.parse(list.url.searchParams.get('filters')), [
      { field: 'uid_organization', operator: 'eq', value: organizationUid },
      { field: 'enabled', operator: 'eq', value: 'false' }
    ]);
    assert.equal(invite.url.pathname, `/v1/admin/organizations/${organizationUid}/admins/${adminUid}/activation-invitation`);
    assert.equal(invite.method, 'POST');
    assert.equal(invite.headers['Idempotency-Key'], challengeId);
    assert.equal(invite.headers.Authorization, 'Bearer session-test');
    assert.deepEqual(invite.body, {});
  });
});

test('public activation puts the credentials in the request body without a session header', async () => {
  await capture(async requests => {
    const credentials = { challengeId, token: 'invitation-test' };
    const password = 'test_password';
    await auth.validateActivation(credentials);
    await auth.completeActivation({ ...credentials, password, passwordConfirmation: password });
    const [validate, complete] = requests;
    assert.equal(validate.url.pathname, '/v1/users/activation/validate');
    assert.equal(complete.url.pathname, '/v1/users/activation/complete');
    assert.equal(validate.method, 'POST');
    assert.equal(complete.method, 'POST');
    assert.equal(validate.headers.Authorization, undefined);
    assert.equal(complete.headers.Authorization, undefined);
    assert.deepEqual(validate.body, { challenge_id: challengeId, token: credentials.token });
    assert.deepEqual(complete.body, { ...validate.body, password, password_confirmation: password });
  });
});
