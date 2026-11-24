export const SCOPE_LABELS = { global: 'Global', organization: 'Organização', entity: 'Entidade', asset: 'Veículo / ativo' };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function pointBody(form, organizationUid) {
  const scope = form.scope_level;
  if (!Object.hasOwn(SCOPE_LABELS, scope)) throw new Error('Selecione um escopo válido.');
  if (!form.name?.trim()) throw new Error('Informe o nome do ponto.');
  const numeric = (value, label, min, max) => {
    const number = Number(value);
    if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '' || !Number.isFinite(number) || number < min || number > max) throw new Error(`${label} inválida.`);
    return number;
  };
  const body = {
    name: form.name.trim(), description: form.description?.trim() || null,
    scope_level: scope, active: form.active === true,
    latitude: numeric(form.latitude, 'Latitude', -90, 90),
    longitude: numeric(form.longitude, 'Longitude', -180, 180),
    radius_meters: numeric(form.radius_meters, 'Medida do raio', 0, Infinity)
  };
  if (scope !== 'global') {
    if (!UUID.test(organizationUid || '')) throw new Error('Selecione uma organização válida.');
    body.uid_organization = organizationUid;
  }
  if (scope === 'entity' || scope === 'asset') {
    if (!UUID.test(form.uid_entity || '')) throw new Error('Informe o UUID da entidade vinculada.');
    body.uid_entity = form.uid_entity;
  }
  if (scope === 'asset') {
    if (!UUID.test(form.uid_asset || '')) throw new Error('Informe o UUID do veículo / ativo vinculado.');
    body.uid_asset = form.uid_asset;
  }
  return body;
}

export function pointCoordinates(row) {
  const lat = row?.latitude;
  const lon = row?.longitude;
  if (![lat, lon].every(value => (typeof value === 'number' || typeof value === 'string') && String(value).trim() !== '')) return null;
  return Number.isFinite(Number(lat)) && Number.isFinite(Number(lon)) && Math.abs(Number(lat)) <= 90 && Math.abs(Number(lon)) <= 180
    ? [Number(lon), Number(lat)] : null;
}

export function previewCoordinates(latitude, longitude) {
  const values = [latitude, longitude].map(value => value.trim().replace(',', '.'));
  if (values.some(value => !value)) throw new Error('Informe a latitude e a longitude.');
  const isDecimal = /^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/;
  const pair = values.every(value => isDecimal.test(value))
    ? pointCoordinates({ latitude: values[0], longitude: values[1] }) : null;
  if (!pair) throw new Error('Informe uma latitude entre -90 e 90 e uma longitude entre -180 e 180.');
  return { latitude: pair[1], longitude: pair[0] };
}

export function recordGeometry(row) {
  const geometry = row.geojson?.type === 'Feature' ? row.geojson.geometry : row.geojson;
  if (geometry && ['Point', 'LineString', 'Polygon', 'MultiPolygon'].includes(geometry.type)) return geometry;
  if (Array.isArray(row.points) && row.points.length >= 2) {
    const coordinates = row.points.map(pointCoordinates);
    if (coordinates.every(Boolean)) return { type: 'LineString', coordinates };
  }
  const coordinates = pointCoordinates(row);
  return coordinates ? { type: 'Point', coordinates } : null;
}

function measure(value, label, nullable = false) {
  if (nullable && (value === '' || value == null)) return null;
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0) throw new Error(`${label} deve ser um número não negativo.`);
  return Number(value);
}

function json(value, label) {
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { throw new Error(`${label}: JSON inválido.`); }
}

// Scope and identity fields use the same documented hierarchy for all GEO resources.
function commonBody(form, organizationUid) {
  const body = pointBody({ ...form, latitude: 0, longitude: 0, radius_meters: 0 }, organizationUid);
  delete body.latitude; delete body.longitude; delete body.radius_meters;
  return body;
}

export function fenceBody(form, organizationUid) {
  const body = { ...commonBody(form, organizationUid), shape: form.shape,
    entry_margin_meters: measure(form.entry_margin_meters, 'Margem de entrada'),
    exit_margin_meters: measure(form.exit_margin_meters, 'Margem de saída') };
  if (form.shape === 'circle') {
    const point = pointBody(form, organizationUid);
    if (point.radius_meters <= 0) throw new Error('O raio da cerca deve ser maior que zero.');
    return { ...body, latitude: point.latitude, longitude: point.longitude, radius_meters: point.radius_meters };
  }
  if (form.shape !== 'polygon') throw new Error('Selecione o formato da cerca.');
  const geometry = json(form.geojson, 'Polígono');
  if (geometry?.type !== 'Polygon' || !Array.isArray(geometry.coordinates) || !geometry.coordinates.length) throw new Error('Informe uma geometria GeoJSON Polygon.');
  for (const ring of geometry.coordinates) {
    if (!Array.isArray(ring) || ring.length < 4 || !ring.every(p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90)
      || ring[0][0] !== ring.at(-1)[0] || ring[0][1] !== ring.at(-1)[1]) throw new Error('Cada anel deve ter coordenadas válidas e terminar no primeiro vértice.');
  }
  return { ...body, geojson: geometry };
}

export function routeBody(form, organizationUid) {
  const points = json(form.points, 'Pontos da rota');
  if (!Array.isArray(points) || points.length < 2) throw new Error('Informe ao menos dois pontos na ordem do percurso.');
  const validated = points.map(point => {
    const coords = pointCoordinates(point);
    if (!coords || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') throw new Error('Cada ponto precisa de latitude e longitude numéricas válidas.');
    return { latitude: coords[1], longitude: coords[0], ...(point.max_speed_to_next_kmh != null && point.max_speed_to_next_kmh !== '' ? { max_speed_to_next_kmh: measure(point.max_speed_to_next_kmh, 'Velocidade do segmento') } : {}) };
  });
  if (new Set(validated.map(p => `${p.longitude},${p.latitude}`)).size < 2) throw new Error('A rota deve conter dois pontos distintos.');
  return { ...commonBody(form, organizationUid), lateral_margin_meters: measure(form.lateral_margin_meters, 'Margem lateral'), max_speed_kmh: measure(form.max_speed_kmh, 'Velocidade máxima', true), points: validated };
}
