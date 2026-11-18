import assert from 'node:assert/strict';
import { test } from 'node:test';
import { importBrowserModule } from './import-browser-module.mjs';

process.env.NEXT_PUBLIC_API_BASE_URL = 'https://billing.example.test';
const api = await importBrowserModule(new URL('../src/lib/api/endpoints/billing.js', import.meta.url));
const account = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const organization = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const record = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const key = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

function capture(t) {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url: new URL(url), ...options, body: JSON.parse(options.body ?? 'null') });
    return Response.json({});
  });
  return calls;
}

test('finance reads remain available without an operational organization and keep account scope on every page', async t => {
  const calls = capture(t);
  await api.listEntries({ token: 'test', q: 'gateway', offset: 20, limit: 20, accountUid: account, uid_organization: organization });
  await api.listStatements({ token: 'test', offset: 20, limit: 20, accountUid: account });
  await api.listEntries({ token: 'test', offset: 0, limit: 20 });
  assert.deepEqual(calls.map(call => call.url.pathname), [
    '/v1/admin/billing/entries', '/v1/admin/billing/statements', '/v1/admin/billing/entries'
  ]);
  for (const call of calls) assert.equal(call.url.searchParams.has('uid_organization'), false);
  for (const call of calls.slice(0, 2)) {
    assert.equal(call.url.searchParams.get('uid_billing_account'), account);
    assert.equal(call.url.searchParams.get('offset'), '20');
  }
  assert.equal(calls[0].url.searchParams.get('q'), 'gateway');
  assert.equal(calls[2].url.searchParams.has('uid_billing_account'), false);
});

test('commercial remains organization scoped and submits the displayed version with a stable retry key', async t => {
  const calls = capture(t);
  await api.getCommercialOverview({ token: 'test', organizationUid: organization });
  const body = { uid_organization: organization, uid_plan_version: record, services: ['gateway'], accepted_terms: [key] };
  await api.commercialOrders.create({ token: 'test', body, idempotencyKey: key });
  const transition = { action: 'accept', expected_state_version: 3 };
  await api.transitionOrder({ token: 'test', uid: record, body: transition, idempotencyKey: key });
  await api.transitionOrder({ token: 'test', uid: record, body: transition, idempotencyKey: key });
  assert.equal(calls[0].url.searchParams.get('uid_organization'), organization);
  assert.deepEqual(calls[1].body, body);
  assert.equal(calls[1].headers['Idempotency-Key'], key);
  for (const call of calls.slice(2)) {
    assert.equal(call.url.pathname, `/v1/commercial/orders/${record}/transition`);
    assert.equal(call.method, 'POST');
    assert.equal(call.headers['Idempotency-Key'], key);
    assert.deepEqual(call.body, transition);
  }
});

test('billing cancellation sends a standalone status change and forwards the retry key', async t => {
  const calls = capture(t);
  const body = { status: 'cancelled' };
  await api.billingEntries.patch({ token: 'test', uid: record, body, idempotencyKey: key });
  assert.equal(calls[0].method, 'PATCH');
  assert.equal(calls[0].url.pathname, `/v1/admin/billing/entries/${record}`);
  assert.equal(calls[0].headers['Idempotency-Key'], key);
  assert.deepEqual(calls[0].body, body);
});
