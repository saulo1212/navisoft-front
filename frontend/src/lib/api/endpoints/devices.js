import { apiRequest } from '../http';
import { ApiError } from '../errors';
import { requireUid } from '../../domain/technicalOperations';
import { newIdempotencyKey } from '../idempotency';

// Devices (/v1/admin/devices) e SIM Cards (/v1/admin/simcards). Contrato
// confirmado e HOMOLOGADO AO VIVO em 2026-11-12 contra https://api.navisoft.app
// (org "Admin Homolog Client"):
//
// - Create: campos são `device_serial`/`device_imei` (NÃO `serial`/`imei`) +
//   `uid_type`+`uid_manufacturer`+`uid_model` (os três juntos, obrigatórios) +
//   `uid_organization`+`active`+`transmits`. `device_pwd` opcional — neste
//   ambiente de homolog retorna 422 `device_encryption_not_configured`
//   (chave AES-256-GCM não configurada no servidor, não é bug do frontend).
// - Update é `PATCH` (parcial, preserva campos omitidos), **não** `PUT`.
// - Situação (ativo/bloqueado/inativo) é `PATCH /devices/:uid/lifecycle`
//   `{state, reason}` — `reason` é OBRIGATÓRIO em todo estado, inclusive
//   "active" (diferente de assets/entities, onde só é obrigatório fora de
//   "active"). Resposta é um objeto reduzido:
//   `{uid, state, reason, effective_state, simcard_unlinked,
//   ingestion_allowed, operations_allowed}` — não o device inteiro.
// - Device inativo some de `GET`/`search` por padrão — precisa
//   `include_inactive=true` (query no GET, campo no body do POST /search).
// - Vínculo device↔SIM é recurso próprio com UID (retornado em
//   `uid`, não confundir com `uid_device`/`uid_simcard`). Troca de SIM em
//   device ATIVO: `PUT /devices/linked-simcards/:uid` (uid do link) com
//   `{uid_device, uid_simcard: novo}` — 200, sem desativar nada. Desvínculo
//   simples: `DELETE` no mesmo path, 204 sem corpo.
// - `DELETE` device/simcard é físico, 204 (sem vínculo protegido).

const DEVICES_ROOT = '/v1/admin/devices';
const SIMCARDS_ROOT = '/v1/admin/simcards';
const LINKED_SIMCARDS_ROOT = `${DEVICES_ROOT}/linked-simcards`;
const eq = (field, value) => ({ field, operator: 'eq', value });
const filtersQuery = arr => JSON.stringify(arr);

export async function listDevices({ token, organizationUid, q, includeInactive, limit = 50, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (q) filters.push({ field: 'device_serial', operator: 'contains', value: q });
  return apiRequest(`${DEVICES_ROOT}/search`, {
    method: 'POST', token, signal, body: { filters, limit, offset, include_inactive: includeInactive }
  });
}

async function listResolutionResources(resource, {
  token, organizationUid, q, filters, limit = 100, offset = 0, signal, search = true
}) {
  const scopedFilters = [eq('uid_organization', requireUid(organizationUid, 'organização')), ...filters];
  const params = { q: q?.trim() || undefined, limit, offset };
  const root = `${DEVICES_ROOT}/${resource}`;
  const result = search
    ? await apiRequest(`${root}/search`, { method: 'POST', token, signal, body: { ...params, filters: scopedFilters } })
    : await apiRequest(root, { token, signal, searchParams: { ...params, filters: filtersQuery(scopedFilters) } });
  if (result?.items?.some(row => row.uid_organization !== organizationUid)) throw new ApiError(403, null, null);
  return result;
}

export function listProtocolIdentities({ vendor, model, deviceUid, active, ...args }) {
  const filters = [];
  if (vendor?.trim()) filters.push(eq('vendor', vendor.trim()));
  if (model?.trim()) filters.push(eq('model', model.trim()));
  if (deviceUid) filters.push(eq('uid_device', requireUid(deviceUid, 'dispositivo')));
  if (typeof active === 'boolean') filters.push(eq('active', String(active)));
  return listResolutionResources('protocol-identities', { ...args, filters });
}

export function listTelemetryMappings({ manufacturerUid, protocolModel, active, ...args }) {
  const filters = [];
  if (manufacturerUid) filters.push(eq('uid_manufacturer', requireUid(manufacturerUid, 'fabricante')));
  if (protocolModel?.trim()) filters.push(eq('protocol_model', protocolModel.trim()));
  if (typeof active === 'boolean') filters.push(eq('active', String(active)));
  return listResolutionResources('telemetry-mappings', { ...args, filters });
}

export async function getTelemetryMapping({ token, organizationUid, uid, signal }) {
  requireUid(organizationUid, 'organização');
  const result = await apiRequest(`${DEVICES_ROOT}/telemetry-mappings/${requireUid(uid, 'perfil')}`, { token, signal });
  if (result?.uid !== uid || result.uid_organization !== organizationUid) throw new ApiError(404, null, null);
  return result;
}

export async function getDeviceTelemetryOverride({ token, organizationUid, deviceUid, signal }) {
  requireUid(organizationUid, 'organização');
  const result = await apiRequest(`${DEVICES_ROOT}/${requireUid(deviceUid, 'dispositivo')}/telemetry-mapping`, { token, signal });
  if (result?.uid_device !== deviceUid || result.uid_organization !== organizationUid) throw new ApiError(404, null, null);
  return result;
}

function saveResolution(resource, { token, organizationUid, uid, body, idempotencyKey, signal }) {
  const path = `${DEVICES_ROOT}/${resource}`;
  return apiRequest(uid ? `${path}/${requireUid(uid, 'registro')}` : path, {
    method: uid ? 'PUT' : 'POST', token, signal, body: { ...body, uid_organization: requireUid(organizationUid, 'organização') },
    idempotencyKey: uid ? undefined : idempotencyKey ?? newIdempotencyKey()
  });
}

export const saveProtocolIdentity = args => saveResolution('protocol-identities', args);
export const saveTelemetryMapping = args => saveResolution('telemetry-mappings', args);
export const createTechnicalPackage = args => saveResolution('technical-packages', args);
export const listTechnicalPackages = args => listResolutionResources('technical-packages', { ...args, filters: [], search: false });

export async function getTechnicalPackage({ token, uid, organizationUid, signal }) {
  requireUid(organizationUid, 'organização');
  const result = await apiRequest(`${DEVICES_ROOT}/technical-packages/${requireUid(uid, 'pacote')}`, { token, signal });
  if (result?.uid !== uid || result.uid_organization !== organizationUid) throw new ApiError(404, null, null);
  return result;
}

export async function getProtocolIdentity({ token, organizationUid, uid, signal }) {
  requireUid(organizationUid, 'organização');
  const result = await apiRequest(`${DEVICES_ROOT}/protocol-identities/${requireUid(uid, 'identidade')}`, { token, signal });
  if (result?.uid !== uid || result.uid_organization !== organizationUid) throw new ApiError(404, null, null);
  return result;
}

export function setDeviceTelemetryOverride({ token, deviceUid, body, signal }) {
  return apiRequest(`${DEVICES_ROOT}/${requireUid(deviceUid, 'dispositivo')}/telemetry-mapping`, {
    method: 'PUT', token, signal, body
  });
}

export function changeDeviceInventory({ token, deviceUid, prepare, signal }) {
  return apiRequest(`${DEVICES_ROOT}/${requireUid(deviceUid, 'dispositivo')}/${prepare ? 'prepare' : 'release'}`, {
    method: 'POST', token, signal, body: prepare ? {} : { inventory_status: 'available' }
  });
}

export async function getDevice({ token, deviceUid, includeInactive, signal }) {
  return apiRequest(`${DEVICES_ROOT}/${encodeURIComponent(deviceUid)}`, {
    token, signal, searchParams: { include_inactive: includeInactive }
  });
}

export async function createDevice({
  token, organizationUid, typeUid, manufacturerUid, modelUid, deviceSerial, deviceImei, devicePwd,
  active, transmits, idempotencyKey
}) {
  const body = {
    uid_organization: organizationUid, uid_type: typeUid, uid_manufacturer: manufacturerUid, uid_model: modelUid,
    device_serial: deviceSerial, device_imei: deviceImei ?? null, active, transmits
  };
  if (devicePwd) body.device_pwd = devicePwd;
  return apiRequest(DEVICES_ROOT, { method: 'POST', token, body, idempotencyKey: idempotencyKey ?? newIdempotencyKey() });
}

// PATCH parcial — manda só os campos que mudaram. devicePwd: não passar =
// preserva; null = limpa; string = troca.
export async function patchDevice({ token, deviceUid, deviceSerial, deviceImei, transmits, devicePwd }) {
  const body = {};
  if (deviceSerial !== undefined) body.device_serial = deviceSerial;
  if (deviceImei !== undefined) body.device_imei = deviceImei;
  if (transmits !== undefined) body.transmits = transmits;
  if (devicePwd !== undefined) body.device_pwd = devicePwd;
  return apiRequest(`${DEVICES_ROOT}/${encodeURIComponent(deviceUid)}`, { method: 'PATCH', token, body });
}

// reason é obrigatório em QUALQUER estado (inclusive "active"). Resposta NÃO
// é o device completo — só {uid,state,reason,effective_state,
// simcard_unlinked,ingestion_allowed,operations_allowed}. Saír de "active"
// libera o SIM vinculado atomicamente (simcard_unlinked:true na resposta).
export async function patchDeviceLifecycle({ token, deviceUid, state, reason }) {
  return apiRequest(`${DEVICES_ROOT}/${encodeURIComponent(deviceUid)}/lifecycle`, { method: 'PATCH', token, body: { state, reason } });
}

// Físico — 204 só sem vínculo de SIM ativo (409 `device_reference_conflict` caso contrário).
export async function deleteDevice({ token, deviceUid }) {
  return apiRequest(`${DEVICES_ROOT}/${encodeURIComponent(deviceUid)}`, { method: 'DELETE', token });
}

// --- Catálogo (tipos / fabricantes / modelos) — mesmo padrão de assets -------

export async function listDeviceTypes({ token, limit = 100, offset = 0, signal }) {
  return apiRequest(`${DEVICES_ROOT}/types`, { token, signal, searchParams: { limit, offset } });
}

export async function listDeviceManufacturers({ token, typeUid, limit = 100, offset = 0, signal }) {
  const filters = typeUid ? filtersQuery([eq('uid_type', typeUid)]) : undefined;
  return apiRequest(`${DEVICES_ROOT}/manufacturers`, { token, signal, searchParams: { filters, limit, offset } });
}

export async function listDeviceModels({ token, typeUid, manufacturerUid, limit = 100, offset = 0, signal }) {
  const filterArr = [];
  if (typeUid) filterArr.push(eq('uid_type', typeUid));
  if (manufacturerUid) filterArr.push(eq('uid_manufacturer', manufacturerUid));
  return apiRequest(`${DEVICES_ROOT}/models`, {
    token, signal, searchParams: { filters: filterArr.length ? filtersQuery(filterArr) : undefined, limit, offset }
  });
}

// --- SIM cards ---

export async function listSimcards({ token, organizationUid, q, limit = 50, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (q) filters.push({ field: 'iccid', operator: 'contains', value: q });
  return apiRequest(SIMCARDS_ROOT, { token, signal, searchParams: { filters: filtersQuery(filters), limit, offset } });
}

export async function createSimcard({ token, organizationUid, iccid, active, idempotencyKey }) {
  return apiRequest(SIMCARDS_ROOT, {
    method: 'POST', token, body: { uid_organization: organizationUid, iccid, active },
    idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// Físico — 204 só sem vínculo de device ativo (409 `device_reference_conflict` caso contrário).
export async function deleteSimcard({ token, simcardUid }) {
  return apiRequest(`${SIMCARDS_ROOT}/${encodeURIComponent(simcardUid)}`, { method: 'DELETE', token });
}

// --- Vínculo device ↔ SIM (recurso próprio, com UID do link) ----------------

export async function listLinkedSimcards({ token, organizationUid, deviceUid, limit = 100, offset = 0, signal }) {
  const filters = [eq('uid_organization', organizationUid)];
  if (deviceUid) filters.push(eq('uid_device', deviceUid));
  return apiRequest(LINKED_SIMCARDS_ROOT, { token, signal, searchParams: { filters: filtersQuery(filters), limit, offset } });
}

export async function linkSimcard({ token, deviceUid, simcardUid, idempotencyKey }) {
  return apiRequest(LINKED_SIMCARDS_ROOT, {
    method: 'POST', token, body: { uid_device: deviceUid, uid_simcard: simcardUid },
    idempotencyKey: idempotencyKey ?? newIdempotencyKey()
  });
}

// Troca o SIM do mesmo link SEM desativar o device — `linkUid` é o uid do
// vínculo (obtido via listLinkedSimcards), não o uid do device.
export async function swapLinkedSimcard({ token, linkUid, deviceUid, simcardUid }) {
  return apiRequest(`${LINKED_SIMCARDS_ROOT}/${encodeURIComponent(linkUid)}`, {
    method: 'PUT', token, body: { uid_device: deviceUid, uid_simcard: simcardUid }
  });
}

// Desvincula sem desativar o device — 204 sem corpo. `linkUid` = uid do vínculo.
export async function unlinkSimcard({ token, linkUid }) {
  return apiRequest(`${LINKED_SIMCARDS_ROOT}/${encodeURIComponent(linkUid)}`, { method: 'DELETE', token });
}
