import { ApiError } from '../errors';
import { requireUid } from '../../domain/technicalOperations';
import { listAgenda } from './agenda';
import { billingPlans, listEntries, listStatements } from './billing';
import { listDevices, listSimcards } from './devices';
import { listDocuments } from './documents';
import { searchEntities } from './entities';
import { listEventOccurrences } from './events';
import { searchAssets } from './fleet';
import { listMaintenance } from './maintenance';
import { listWorkOrders } from './workorders';

const sources = {
  assets: searchAssets,
  entities: searchEntities,
  devices: listDevices,
  simcards: listSimcards,
  occurrences: listEventOccurrences,
  documents: listDocuments,
  agenda: listAgenda,
  maintenance: listMaintenance,
  workPending: args => listWorkOrders({ ...args, state: 'pending' }),
  workCompleted: args => listWorkOrders({ ...args, state: 'completed' }),
  entries: listEntries,
  statements: listStatements,
  plans: billingPlans.list
};
const financial = new Set(['entries', 'statements', 'plans']);

export async function getDashboardTotal({ source, token, organizationUid, signal }) {
  if (!Object.hasOwn(sources, source)) throw new Error('Indicador desconhecido.');
  const scoped = financial.has(source) ? {} : { organizationUid: requireUid(organizationUid, 'organização') };
  const response = await sources[source]({ token, ...scoped, limit: 1, offset: 0, signal });
  // Documentos distribuídos preservam o UID da organização proprietária.
  if (source !== 'documents' && scoped.organizationUid && Array.isArray(response?.items)
    && response.items.some(item => item?.uid_organization && item.uid_organization !== scoped.organizationUid)) {
    throw new ApiError(403, 'area_not_allowed');
  }
  const total = response?.total;
  return Number.isSafeInteger(total) && total >= 0 ? total : null;
}
