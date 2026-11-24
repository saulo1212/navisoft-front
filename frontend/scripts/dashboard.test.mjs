import assert from 'node:assert/strict';
import { test } from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://dashboard.example.test';
const load = path => importBrowserModule(new URL(`../src/lib/${path}`, import.meta.url));
const { getDashboardTotal, getDashboardTotals } = await load('api/endpoints/dashboard.js');
const { ApiError, isAccessDenied, readErrorMessage } = await load('api/errors.js');
const { accessibleMenu, canAccessPath, isDemoPath, requiresOrganization } = await load('navigation/access.js');
const organizationUid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const otherUid = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

test('dashboard requests one row and reports the total in the selected organization', async t => {
  const signal = new AbortController().signal;
  const filters = [{ field: 'uid_organization', operator: 'eq', value: organizationUid }];
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: new URL(url), ...options });
    return Response.json({ items: [{ uid_organization: organizationUid }], total: 35 });
  });
  for (const source of ['assets', 'workPending', 'workCompleted', 'occurrences']) {
    assert.equal(await getDashboardTotal({ source, token: 'test', organizationUid, signal }), 35);
  }
  assert.deepEqual(JSON.parse(calls[0].body), { filters, limit: 1, offset: 0 });
  assert.equal(JSON.parse(calls[1].body).state, 'pending');
  assert.equal(JSON.parse(calls[2].body).state, 'completed');
  assert.deepEqual(JSON.parse(calls[3].url.searchParams.get('filters')), filters);
  assert.ok(calls.every(call => call.signal === signal && call.cache === 'no-store'));
  await assert.rejects(getDashboardTotal({ source: 'assets', token: 'test' }), /UUID/);
  assert.equal(calls.length, 4);
});

test('dashboard rejects out-of-context assets, honors distributed GED and does not invent totals', async t => {
  let payload = { items: [{ uid_organization: otherUid }], total: 2 };
  t.mock.method(globalThis, 'fetch', async () => Response.json(payload));
  const args = { token: 'test', organizationUid };
  await assert.rejects(getDashboardTotal({ ...args, source: 'assets' }), { status: 403 });
  assert.equal(await getDashboardTotal({ ...args, source: 'documents' }), 2);
  payload = { items: [] };
  assert.equal(await getDashboardTotal({ ...args, source: 'events' }).catch(error => error.message), 'Indicador desconhecido.');
  assert.equal(await getDashboardTotal({ ...args, source: 'assets' }), null);
  payload = { items: [], total: 0 };
  assert.equal(await getDashboardTotal({ ...args, source: 'assets' }), 0);
});

test('financial counts preserve account scope and propagate denial', async t => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async url => {
    calls.push(new URL(url));
    return Response.json({ code: 'billing_not_allowed' }, { status: 403 });
  });
  await assert.rejects(getDashboardTotal({ source: 'statements', token: 'test', organizationUid }), { status: 403 });
  assert.equal(calls[0].pathname, '/v1/admin/billing/statements');
  assert.equal(calls[0].search, '?limit=1&offset=0');
});

test('chart totals retain zeros and isolate missing totals and denied metrics', async t => {
  t.mock.method(globalThis, 'fetch', async url => {
    const path = new URL(url).pathname;
    if (path.endsWith('/assets/search')) return Response.json({ total: 0 });
    if (path.endsWith('/entities/search')) return Response.json({ code: 'area_not_allowed' }, { status: 403 });
    return Response.json({ items: [] });
  });
  const [assets, entities, devices] = await getDashboardTotals({
    sources: ['assets', 'entities', 'devices'], token: 'test', organizationUid
  });
  assert.deepEqual(assets, { status: 'fulfilled', value: 0 });
  assert.equal(entities.status, 'rejected');
  assert.equal(entities.reason.status, 403);
  assert.deepEqual(devices, { status: 'fulfilled', value: null });
});

test('menu and direct paths share area checks, preserve global access and hide demos', () => {
  const context = { status: 'evaluated', areas: { events: 'allowed', event_occurrences: 'denied', assets_groups: 'allowed', simcards: 'allowed' } };
  const items = [
    { key: 'events', children: [{ key: 'occurrences', url: '/eventos' }, { key: 'models', url: '/eventos/modelos' }] },
    { key: 'demo', url: '/dashboards/marketing' },
    { key: 'billing', url: '/billing' }
  ];
  assert.deepEqual(accessibleMenu(items, context, false).map(item => item.key), ['events', 'billing']);
  assert.deepEqual(accessibleMenu(items, context, false)[0].children.map(item => item.key), ['models']);
  assert.equal(canAccessPath('/frota/detalhe', context), false);
  assert.equal(canAccessPath('/frota/grupos/detalhe', context), true);
  assert.equal(canAccessPath('/devices-sim', context), true);
  assert.equal(canAccessPath('/billing', { status: 'not_evaluated', areas: {} }), false);
  assert.equal(canAccessPath('/ajuda/detalhe', null), true);
  assert.equal(isDemoPath('/appintel'), true);
  assert.equal(isDemoPath('/dashboards/subscription'), false);
  assert.equal(requiresOrganization('/dashboards/subscription'), false);
  assert.equal(requiresOrganization('/dashboards/project-management'), true);
});

test('common error states have consistent messages and discard data only after access failures', () => {
  const expected = {
    401: /Autenticação/, 403: /permissão/, 404: /indisponível para este acesso/,
    409: /Conflito/, 422: /Dados inválidos/, 503: /temporariamente indisponível/
  };
  for (const [status, message] of Object.entries(expected)) {
    const error = new ApiError(Number(status), 'unmapped', { message: 'Untranslated upstream error' });
    assert.match(readErrorMessage(error), message);
    assert.match(readErrorMessage(`http_${status}`), message);
    assert.equal(isAccessDenied(error), ['401', '403', '404'].includes(status));
  }
  assert.match(readErrorMessage(new ApiError(401, 'other', { state: 'revoked' })), /Entre novamente/);
});
