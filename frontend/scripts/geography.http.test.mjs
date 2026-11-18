import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import path from 'node:path';

// Exercise the runner's reporting and fixture cleanup without a real API.
for (const failInvalidCheck of [false, true]) {
  test(`HTTP runner cleans fixtures when ${failInvalidCheck ? 'a negative check fails' : 'all checks pass'}`, async () => {
    const dir = await mkdtemp(path.resolve('.geo-http-test-'));
    const reportPath = path.join(dir, 'report.json');
    const vars = ['GEO_API_URL', 'GEO_ORGANIZATION_UID', 'GEO_TOKEN', 'GEO_REPORT_PATH'];
    const saved = Object.fromEntries(vars.map(key => [key, process.env[key]]));
    const oldFetch = globalThis.fetch;
    const oldExitCode = process.exitCode;
    const records = new Map();
    const intentions = new Map();
    let counter = 0;
    Object.assign(process.env, { GEO_API_URL: 'https://geography.test', GEO_ORGANIZATION_UID: '11111111-1111-4111-8111-111111111111', GEO_TOKEN: 'not-a-real-token', GEO_REPORT_PATH: reportPath });
    globalThis.fetch = async (url, options) => {
      const target = new URL(url);
      const body = options.body && JSON.parse(options.body);
      const response = (status, payload) => new Response(status === 204 ? null : JSON.stringify(payload), { status });
      if (target.pathname === '/v1/users/status') return response(200, {});
      if (options.method === 'POST' && !target.pathname.endsWith('/search')) {
        const key = options.headers['Idempotency-Key'];
        const previous = intentions.get(key);
        if (previous) return response(previous.signature === options.body ? 200 : 409, previous.record);
        const invalid = body.latitude === 100 || body.radius_meters < 0 || body.geojson?.coordinates.length === 0 || body.points?.length === 1;
        if (invalid && !failInvalidCheck) return response(422, { error: 'invalid_geo_payload' });
        const record = { ...body, uid: `22222222-2222-4222-8222-${String(++counter).padStart(12, '0')}` };
        records.set(`${target.pathname}/${record.uid}`, record);
        intentions.set(key, { signature: options.body, record });
        return response(201, record);
      }
      if (options.method === 'DELETE') { records.delete(target.pathname); return response(204); }
      if (options.method === 'PUT') { records.set(target.pathname, { ...body, uid: target.pathname.split('/').at(-1) }); return response(200, records.get(target.pathname)); }
      if (target.search || target.pathname.endsWith('/search')) return response(200, { items: [...records.values()] });
      return records.has(target.pathname) ? response(200, records.get(target.pathname)) : response(404, { error: 'geo_not_found' });
    };
    try {
      await import(`./geography.http.mjs?case=${failInvalidCheck}`);
      const report = JSON.parse(await readFile(reportPath, 'utf8'));
      assert.equal(report.passed, !failInvalidCheck);
      assert.equal(report.cleanup.length, failInvalidCheck ? 2 : 4);
      assert.ok(report.cleanup.every(result => result.passed));
      assert.equal(records.size, 0, 'all acknowledged fixtures, including unexpected creations, must be deleted');
      assert.equal(JSON.stringify(report).includes('not-a-real-token'), false);
    } finally {
      globalThis.fetch = oldFetch;
      process.exitCode = oldExitCode;
      for (const key of vars) { if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key]; }
      await rm(dir, { recursive: true, force: true });
    }
  });
}
