import { apiRequest } from '../http';
import { createResourceApi } from '../resource';
import { requireUid } from '../../domain/technicalOperations';

const billing = '/v1/admin/billing';
const plans = '/v1/admin/billing-plans';
const commercial = '/v1/commercial';
const resourcePath = (root, uid) => `${root}/${requireUid(uid, 'registro')}`;

export const billingPlans = createResourceApi({ basePath: plans });
export const billingEntries = createResourceApi({ basePath: `${billing}/entries` });
export const billingStatements = createResourceApi({ basePath: `${billing}/statements` });

export function listEntries({ token, signal, q, limit, offset, accountUid }) {
  return billingEntries.list({ token, signal, q, limit, offset, uid_billing_account: accountUid });
}

export function listStatements({ token, signal, limit, offset, accountUid }) {
  return billingStatements.list({ token, signal, limit, offset, uid_billing_account: accountUid });
}

export function quotePlan({ token, signal, uid, quantity }) {
  return apiRequest(`${resourcePath(plans, uid)}/quote`, { token, signal, searchParams: { quantity } });
}

export function getPlanCapabilities({ token, signal, uid }) {
  return apiRequest(`${resourcePath(plans, uid)}/capabilities`, { token, signal });
}

export function setPlanCapabilities({ token, signal, uid, body }) {
  return apiRequest(`${resourcePath(plans, uid)}/capabilities`, { method: 'PUT', token, signal, body });
}

export function duplicateEntry({ token, signal, uid, body, idempotencyKey }) {
  return apiRequest(`${resourcePath(`${billing}/entries`, uid)}/duplicate`, { method: 'POST', token, signal, body, idempotencyKey });
}

export function getCommercialOverview({ token, signal, organizationUid }) {
  return apiRequest(`${commercial}/overview`, {
    token, signal, searchParams: { uid_organization: requireUid(organizationUid, 'organização') }
  });
}

export const commercialOrders = createResourceApi({ basePath: `${commercial}/orders` });

export function transitionOrder({ token, signal, uid, body, idempotencyKey }) {
  return apiRequest(`${resourcePath(`${commercial}/orders`, uid)}/transition`, { method: 'POST', token, signal, body, idempotencyKey });
}
