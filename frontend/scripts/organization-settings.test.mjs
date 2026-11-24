import assert from 'node:assert/strict';
import test from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';
import { accessPeriodsBody, brandingPatch, canProvisionOrganization, organizationProvisioningBody } from '../src/lib/domain/organizations.js';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://organizations.example.test';
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/organizations.js', import.meta.url));
const uid = '11111111-1111-4111-8111-111111111111';

test('provisioning keeps the backend default login and matches the actor role and capability', () => {
  assert.deepEqual(organizationProvisioningBody({ code: ' org ', admin_login: '  ', uid_billing_plan: uid }), { code: 'org', uid_billing_plan: uid });
  assert.deepEqual(organizationProvisioningBody({ admin_login: ' admin.org ' }), { admin_login: 'admin.org' });
  assert.equal(canProvisionOrganization({ profile_code: 'primary_admin', can_create_organizations: null }), true);
  assert.equal(canProvisionOrganization({ profile_code: 'administrator', can_create_organizations: true }), true);
  assert.equal(canProvisionOrganization({ profile_code: 'administrator', can_create_organizations: false }), false);
  assert.equal(canProvisionOrganization({ profile_code: 'secondary_admin', can_create_organizations: true }), false);
});

test('weekly intervals stay on their own day and preserve valid midnight boundaries', () => {
  const draft = { mode: 'block', timezone: 'America/Sao_Paulo', week: {
    monday: [{ start: '22:00', end: '24:00' }], tuesday: [{ start: '00:00', end: '06:00' }]
  } };
  const body = accessPeriodsBody(draft);
  assert.deepEqual(body.week.monday, draft.week.monday);
  assert.deepEqual(body.week.tuesday, draft.week.tuesday);
  assert.deepEqual(body.week.sunday, []);
  assert.equal(Object.keys(body.week).length, 7);
  for (const windows of [
    [{ start: '22:00', end: '06:00' }],
    [{ start: '24:00', end: '24:00' }],
    [{ start: '16:00', end: '18:00' }, { start: '15:00', end: '17:00' }]
  ]) assert.throws(() => accessPeriodsBody({ ...draft, week: { monday: windows } }));
});

test('theme patch sends only selected tokens and uses null to inherit a nested member', () => {
  assert.deepEqual(brandingPatch({ primary: '#00AABB', 'header.text': null }), { primary: '#00AABB', header: { text: null } });
  assert.throws(() => brandingPatch({ primary: '#fff' }), /hexadecimal/);
});

test('organization session settings use confirmed methods, scope and historical query', async t => {
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push({ url: new URL(url), ...options, body: options.body && JSON.parse(options.body) });
    return Response.json({ items: [{ uid, profile_code: 'primary_admin' }] });
  });
  const args = { token: 'test', uid };
  const actor = await api.getOrganizationProvisioningActor(args);
  assert.equal(actor.profile_code, 'primary_admin');
  await api.getOrganization({ ...args, includeInactive: true });
  await api.getOrganizationLifecycle({ ...args, includeInactive: true });
  await api.patchOrganizationLifecycle({ ...args, state: 'blocked', reason: 'Fixture' });
  await api.updateOrganizationAccessPeriods({ ...args, body: { mode: 'disabled' } });
  await api.patchOrganizationBranding({ ...args, theme: { primary: null } });
  assert.deepEqual(JSON.parse(requests[0].url.searchParams.get('filters')), [{ field: 'uid', operator: 'eq', value: uid }]);
  assert.equal(requests[1].url.searchParams.get('include_inactive'), 'true');
  assert.equal(requests[2].url.searchParams.get('include_inactive'), 'true');
  assert.deepEqual(requests.slice(3).map(request => [request.method, request.url.pathname.split('/').at(-1), request.body]), [
    ['PATCH', 'lifecycle', { state: 'blocked', reason: 'Fixture' }],
    ['PUT', 'access-periods', { mode: 'disabled' }],
    ['PATCH', 'branding', { theme: { primary: null } }]
  ]);
  assert.ok(requests.every(request => request.headers.Authorization === 'Bearer test'));
});
