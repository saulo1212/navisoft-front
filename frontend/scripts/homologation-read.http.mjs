import { writeFile } from 'node:fs/promises';

const base = new URL(process.env.TEST_API_URL || 'https://api.navisoft.app');
const token = process.env.TEST_API_TOKEN?.trim();
const diagnosticToken = process.env.TEST_HEALTH_TOKEN?.trim();
const organizationUid = process.env.TEST_API_ORGANIZATION_UID?.trim();
const page = { limit: 1, offset: 0 };
const evidence = { checkedAt: new Date().toISOString(), mode: 'read-only', checks: [], authenticated: 'pending' };
const uidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function check(name, path, { bearer, body, expected = [200] } = {}) {
  try {
    const response = await fetch(new URL(path, base), {
      method: body ? 'POST' : 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Navisoft homologation)',
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'error',
      cache: 'no-store',
      signal: AbortSignal.timeout(15000)
    });
    const requestId = response.headers.get('x-request-id');
    const payload = await response.json().catch(() => null);
    const code = payload?.code ?? payload?.error;
    evidence.checks.push({
      name, expected, status: response.status, passed: expected.includes(response.status),
      ...(/^[0-9a-f-]{36}$/i.test(requestId || '') ? { requestId } : {}),
      ...(response.status >= 400 && typeof code === 'string' && /^[a-z][a-z0-9_]{1,79}$/.test(code) ? { code } : {})
    });
    return { status: response.status, payload };
  } catch {
    evidence.checks.push({ name, expected, status: null, passed: false, code: 'network_error' });
    return {};
  }
}

await check('health-ready', '/v1/health/ready');
await check('public-knowledge', '/v1/public/knowledge/items?limit=1&offset=0');
await check('anonymous-session-denied', '/v1/users/me/access-context', { expected: [401] });
if (diagnosticToken) await check('health-details', '/v1/health/details', { bearer: diagnosticToken, expected: [200, 503] });

const session = token && await check('session-status', '/v1/users/status', { bearer: token });
if (session?.status !== 200 || session.payload?.authenticated !== true) {
  evidence.authenticated = token ? 'session_unavailable' : 'session_not_configured';
} else {
  const auth = { bearer: token };
  const area = await check('access-context', '/v1/users/me/access-context', auth);
  if (area.payload?.area_access?.status !== 'evaluated') {
    evidence.authenticated = 'access_not_evaluated';
  } else {
    evidence.authenticated = 'global_reads_checked';
    const global = [
      ['organizations-picker', '/v1/users/me/organizations?limit=1'],
      ['organizations-admin', '/v1/admin/organizations?limit=1&offset=0'],
      ['users', '/v1/admin/users?limit=1&offset=0'],
      ['knowledge-admin', '/v1/admin/knowledge/items/search', { ...page }],
      ['billing', '/v1/admin/billing/statements?limit=1&offset=0'],
      ['billing-plans', '/v1/admin/billing-plans?limit=1&offset=0'],
      ['reports', '/v1/reports/assets/definition'],
      ['platform-capabilities', '/v1/admin/platform-capabilities/search', { ...page }],
      ['services', '/v1/admin/services?limit=1&offset=0'],
      ['fipe', '/v1/admin/integrations/fipe/jobs?limit=1&offset=0']
    ];
    for (const [name, path, body] of global) await check(name, path, { ...auth, body });
    if (uidPattern.test(organizationUid || '')) {
      const context = await check('organization-access', `/v1/users/me/organizations/${organizationUid}/access-context`, auth);
      if (context.status === 200) {
        evidence.authenticated = 'scoped_reads_checked';
        const filters = [{ field: 'uid_organization', operator: 'eq', value: organizationUid }];
        const search = { ...page, filters };
        const query = new URLSearchParams({ ...page, filters: JSON.stringify(filters) });
        const scope = new URLSearchParams({ ...page, uid_organization: organizationUid });
        const geography = new URLSearchParams({ ...page, filters: JSON.stringify([...filters, { field: 'scope_level', operator: 'eq', value: 'organization' }]) });
        const scoped = [
          ['entities', '/v1/admin/entities/search', search],
          ['fleet', '/v1/admin/assets/search', search],
          ['devices', '/v1/admin/devices/search', search],
          ['simcards', `/v1/admin/simcards?${query}`],
          ['geography', `/v1/admin/geo/points?${geography}`],
          ['collaborators', '/v1/admin/collaborators/search', search],
          ['contacts', `/v1/admin/contacts?${query}`],
          ['technicians', '/v1/admin/entities/technicians/search', search],
          ['work-orders', '/v1/admin/devices/work-orders/search', { ...search, state: 'pending' }],
          ['maintenance', '/v1/admin/maintenance/orders/search', search],
          ['checklists', '/v1/admin/checklists/search', search],
          ['agenda', '/v1/admin/agenda/entries/search', search],
          ['events', `/v1/admin/events/occurrences?${query}`],
          ['notifications', `/v1/admin/notifications/recipients?${scope}`],
          ['documents', '/v1/admin/documents/search', search],
          ['commercial', `/v1/commercial/overview?uid_organization=${organizationUid}`],
          ['organization-services', `/v1/admin/organizations/${organizationUid}/services`]
        ];
        for (const [name, path, body] of scoped) await check(name, path, { ...auth, body });
      } else evidence.authenticated = 'organization_unavailable';
    } else evidence.authenticated = 'organization_not_configured';
  }
}

const output = JSON.stringify(evidence, null, 2);
if (process.env.TEST_API_REPORT_PATH) await writeFile(process.env.TEST_API_REPORT_PATH, `${output}\n`);
console.log(output);
if (evidence.authenticated !== 'scoped_reads_checked' || evidence.checks.some(item => !item.passed)) process.exitCode = 1;
