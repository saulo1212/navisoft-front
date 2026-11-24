import { apiRequest, normalizeList } from '../http';
import { ApiError } from '../errors';
import { newIdempotencyKey } from '../idempotency';
import { requireUid, requiredText, scopedFilters } from '../../domain/technicalOperations';

const root = '/v1/admin/entities/drivers';
const driverPath = uid => `${root}/${encodeURIComponent(requireUid(uid, 'motorista'))}`;

export async function searchDrivers({ token, organizationUid, q, limit = 20, offset = 0, includeInactive = false, signal }) {
  const filters = scopedFilters(organizationUid);
  if (!includeInactive) filters.push({ field: 'active', operator: 'eq', value: 'true' });
  const result = await apiRequest(`${root}/search`, {
    method: 'POST', token, signal, body: { filters, q: q?.trim() || undefined, limit, offset, include_inactive: includeInactive }
  });
  const { items } = normalizeList(result);
  if (items.some(driver => driver.uid_organization !== organizationUid || (!includeInactive && driver.active !== true))) {
    throw new ApiError(403, null, null);
  }
  return result;
}

export async function getDriver({ token, organizationUid, uid, includeInactive = false, signal }) {
  requireUid(organizationUid, 'organização');
  const result = await apiRequest(driverPath(uid), {
    token, signal, searchParams: { include_inactive: includeInactive || undefined }
  });
  const driver = result?.item ?? result;
  if (driver?.uid !== uid || driver.uid_organization !== organizationUid || (!includeInactive && driver.active !== true)) {
    throw new ApiError(404, null, null);
  }
  return driver;
}

export function driverFields(form) {
  const birthDate = form.birth_date?.trim();
  const contract = form.internal_contract_number?.trim();
  return {
    name: requiredText(form.name, 'o nome do motorista'),
    ...(birthDate && { birth_date: birthDate }),
    ...(contract && { internal_contract_number: contract })
  };
}

export function createDriver({ token, organizationUid, fields, idempotencyKey = newIdempotencyKey(), signal }) {
  const body = { ...driverFields(fields), uid_organization: requireUid(organizationUid, 'organização'), scopes: [{}] };
  return apiRequest(root, { method: 'POST', token, body, idempotencyKey, signal });
}

export async function patchDriver({ token, organizationUid, uid, body, signal }) {
  await getDriver({ token, organizationUid, uid, signal });
  return apiRequest(driverPath(uid), { method: 'PATCH', token, body, signal });
}
