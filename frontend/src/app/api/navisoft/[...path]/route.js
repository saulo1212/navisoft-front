// Proxy same-origin para a API Navisoft.
//
// Por que existe: a API (https://api.navisoft.app) NÃO envia cabeçalhos CORS e
// fica atrás de um Cloudflare que exige User-Agent de navegador. Um app no
// browser não consegue chamá-la direto. Este route handler roda no servidor
// Next (sem CORS), injeta o User-Agent e repassa Authorization/corpo.
//
// O destino real vem de NAVISOFT_API_URL (variável SÓ de servidor, nunca
// exposta ao browser). O cliente chama /api/navisoft/<path> (mesma origem).

export const dynamic = 'force-dynamic';

const UPSTREAM = (process.env.NAVISOFT_API_URL || 'https://api.navisoft.app').replace(/\/$/, '');
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

// Cabeçalhos do cliente que repassamos ao upstream.
const FORWARD_REQ_HEADERS = ['authorization', 'content-type', 'idempotency-key', 'accept', 'x-file-name', 'x-revision-summary'];

async function handle(request, ctx) {
  const { path = [] } = await ctx.params;
  const search = new URL(request.url).search;
  const target = `${UPSTREAM}/${path.map(encodeURIComponent).join('/')}${search}`;

  const headers = new Headers();
  for (const name of FORWARD_REQ_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('User-Agent', BROWSER_UA);
  if (!headers.has('accept')) headers.set('accept', 'application/json');

  let body;
  if (!['GET', 'HEAD'].includes(request.method)) {
    body = await request.arrayBuffer();
  }

  let upstream;
  try {
    upstream = await fetch(target, { method: request.method, headers, body, redirect: 'manual', cache: 'no-store' });
  } catch {
    return Response.json({ error: 'upstream_unreachable' }, { status: 502 });
  }

  const resBody = await upstream.arrayBuffer();
  const resHeaders = new Headers();
  const ct = upstream.headers.get('content-type');
  if (ct) resHeaders.set('content-type', ct);
  for (const name of ['content-disposition', 'x-request-id', 'retry-after']) {
    const value = upstream.headers.get(name);
    if (value) resHeaders.set(name, value);
  }
  resHeaders.set('cache-control', 'no-store');

  // Fetch/undici lança TypeError ao construir uma Response com body não-nulo
  // para status "null body" (101/103/204/205/304), mesmo com buffer vazio —
  // era a causa real do 500 que víamos no DELETE de assets (upstream respondia
  // 204 corretamente, só a reconstrução da resposta aqui que explodia).
  const NULL_BODY_STATUSES = new Set([101, 103, 204, 205, 304]);
  if (NULL_BODY_STATUSES.has(upstream.status)) {
    return new Response(null, { status: upstream.status, headers: resHeaders });
  }
  return new Response(resBody, { status: upstream.status, headers: resHeaders });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const HEAD = handle;
