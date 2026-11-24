'use client';

import { Alert, Button } from 'react-bootstrap';
import { BillingField } from './BillingUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { getOrganizationProvisioningActor } from '@/lib/api/endpoints/organizations';
import { useSession } from '@/lib/session/SessionContext';

export function useAdminProfile() {
  const { token, account } = useSession();
  return useKnowledgeQuery(getOrganizationProvisioningActor, { token, uid: account?.uid }, Boolean(token && account?.uid)).data?.profile_code;
}

export function ReferenceField({ list, rows = list?.items ?? [], placeholder = 'Selecione…', labelOf = row => row.name || row.code || row.uid,
  getValue = row => row.uid, optional, ...props }) {
  const options = new Map([['', list?.loading ? 'Carregando…' : placeholder]]);
  for (const row of rows) options.set(getValue(row), labelOf(row));
  const value = props.value ?? props.defaultValue;
  if (value && !options.has(value)) options.set(value, value);
  return <>
    <BillingField {...props} optional={optional} options={[...options]} />
    {list?.error && <Alert variant="warning" className="small">{list.error}</Alert>}
    {list?.hasMore && <Button type="button" size="sm" variant="outline-secondary" disabled={list.loading}
      className="mb-3" onClick={list.loadMore}>Carregar mais opções</Button>}
  </>;
}
