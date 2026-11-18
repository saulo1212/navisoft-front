import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';

// Frota / Assets (/v1/admin/assets). Asset é o recurso rastreável; `vehicle` é o
// perfil específico (placa, ano). Unidade pertence à entidade; grupo pertence à
// organização e pode reunir assets de entidades diferentes. Todas as LISTAS
// (assets/groups/group-assets/linked-devices) exigem filtro estruturado
// `uid_organization eq <uuid>` — assets via POST /search; as demais via GET com
// query `filters` (array JSON). Organização e entidade são IMUTÁVEIS no CRUD.

const ROOT = '/v1/admin/assets';
const eq = (field, value) => ({ field, operator: 'eq', value });
const filtersQuery = arr => JSON.stringify(arr);

// --- Assets ------------------------------------------------------------------
export async function searchAssets({ token, organizationUid, q, limit = 50, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (q) filters.push({ field: 'identification', operator: 'contains', value: q });
  return apiRequest(`${ROOT}/search`, { method: 'POST', token, signal, body: { filters, limit, offset } });
}

// Alias de compatibilidade (ordens-servico/Fase 7 ainda consome `listAssets`).
export const listAssets = searchAssets;

export async function getAsset({ token, assetUid, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(assetUid)}`, { token, signal });
}

// POST cria o asset. `identification` é obrigatória; entidade/organização fixam
// o escopo (imutáveis). `vehicle` é opcional (perfil rodoviário). A criação já
// associa o asset ao grupo "Geral" da organização.
export async function createAsset({ token, organizationUid, entityUid, unitUid, modelUid, fuelUid, identification, vehicle, idempotencyKey }) {
  const body = { uid_organization: organizationUid, uid_entity: entityUid, identification };
  if (unitUid) body.uid_unit = unitUid;
  if (modelUid) body.uid_model = modelUid;
  if (fuelUid) body.uid_fuel = fuelUid;
  if (vehicle) body.vehicle = vehicle;
  return apiRequest(ROOT, { method: 'POST', token, body, idempotencyKey: idempotencyKey ?? newIdempotencyKey() });
}

// PATCH preserva campos omitidos (edição parcial). Não reaproveitar o payload do
// PUT aqui: PUT tem semântica completa e pode restaurar defaults.
export async function patchAsset({ token, assetUid, body }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(assetUid)}`, { method: 'PATCH', token, body });
}

export async function updateAsset({ token, assetUid, body }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(assetUid)}`, { method: 'PUT', token, body });
}

export async function listDeviceSlots({ token, assetUid, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(assetUid)}/device-slots`, { token, signal });
}

export async function listLinkHistory({ token, assetUid, signal }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(assetUid)}/link_history`, { token, signal });
}

// --- Grupos (pertencem à organização) ----------------------------------------
export async function listGroups({ token, organizationUid, limit = 100, offset = 0, signal }) {
  return apiRequest(`${ROOT}/groups`, {
    token, signal, searchParams: { filters: filtersQuery([eq('uid_organization', organizationUid)]), limit, offset }
  });
}

export async function createGroup({ token, organizationUid, name, idempotencyKey }) {
  return apiRequest(`${ROOT}/groups`, {
    method: 'POST', token, body: { uid_organization: organizationUid, name },
    idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// --- Participações (asset ↔ grupo) -------------------------------------------
// group-assets é listado por GET com `filters` (uid_organization + uid_asset),
// devolvendo os registros de participação (com uid próprio p/ remoção).
export async function listGroupAssets({ token, organizationUid, assetUid, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (assetUid) filters.push(eq('uid_asset', assetUid));
  return apiRequest(`${ROOT}/group-assets`, { token, signal, searchParams: { filters: filtersQuery(filters) } });
}

export async function addParticipation({ token, groupUid, assetUid, idempotencyKey }) {
  return apiRequest(`${ROOT}/group-assets`, {
    method: 'POST', token, body: { uid_group: groupUid, uid_asset: assetUid },
    idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// A última participação é protegida por constraint diferida (o asset deve
// manter pelo menos um grupo); a remoção pode devolver 409.
export async function removeParticipation({ token, participationUid, groupUid, assetUid }) {
  return apiRequest(`${ROOT}/group-assets/${encodeURIComponent(participationUid)}`, {
    method: 'DELETE', token, body: { uid_group: groupUid, uid_asset: assetUid }
  });
}

// --- Catálogos (combustíveis / voltagens) ------------------------------------
export async function listFuels({ token, q, signal }) {
  return apiRequest(`${ROOT}/fuels`, { token, signal, searchParams: { q } });
}

export async function listVoltages({ token, q, signal }) {
  return apiRequest(`${ROOT}/voltages`, { token, signal, searchParams: { q } });
}

// --- Catálogos (tipos / fabricantes / modelos de asset) ----------------------
// Confirmado pelo backend (Fase 4): GET com `filters` (array JSON) — modelo
// filtra por `uid_type`/`uid_manufacturer`; fabricante filtra por `uid_type`.
export async function listAssetTypes({ token, limit = 100, offset = 0, signal }) {
  return apiRequest(`${ROOT}/types`, { token, signal, searchParams: { limit, offset } });
}

export async function listAssetManufacturers({ token, typeUid, limit = 100, offset = 0, signal }) {
  const filters = typeUid ? filtersQuery([eq('uid_type', typeUid)]) : undefined;
  return apiRequest(`${ROOT}/manufacturers`, { token, signal, searchParams: { filters, limit, offset } });
}

export async function listAssetModels({ token, typeUid, manufacturerUid, limit = 100, offset = 0, signal }) {
  const filterArr = [];
  if (typeUid) filterArr.push(eq('uid_type', typeUid));
  if (manufacturerUid) filterArr.push(eq('uid_manufacturer', manufacturerUid));
  return apiRequest(`${ROOT}/models`, {
    token, signal, searchParams: { filters: filterArr.length ? filtersQuery(filterArr) : undefined, limit, offset }
  });
}

// --- Lifecycle / exclusão -----------------------------------------------------
// Rota dedicada confirmada (Fase 4): grava o estado operacional do asset
// (active/blocked/inactive), diferente do catálogo de `uid_situations`.
export async function patchAssetLifecycle({ token, assetUid, state, reason }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(assetUid)}/lifecycle`, { method: 'PATCH', token, body: { state, reason } });
}

// Exclusão lógica — pode ser revertida reativando o lifecycle.
export async function deleteAsset({ token, assetUid }) {
  return apiRequest(`${ROOT}/${encodeURIComponent(assetUid)}`, { method: 'DELETE', token });
}
