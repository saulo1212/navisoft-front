'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { BillingField, BillingForm, useBillingMutation } from '@/components/admin/BillingUi';
import { areaAllowed } from '@/components/admin/OperationalUi';
import DataTable from '@/components/admin/DataTable';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { usePagedList } from '@/hooks/usePagedList';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import { billingPlans } from '@/lib/api/endpoints/billing';
import { createOrganization, getOrganizationProvisioningActor, listOrganizations } from '@/lib/api/endpoints/organizations';
import { canProvisionOrganization, organizationProvisioningBody } from '@/lib/domain/organizations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const OrganizationsPage = () => {
  const router = useRouter();
  const { token, account, selectedOrganizationUid, areaAccess } = useSession();
  const scope = `${token}:${selectedOrganizationUid}:${JSON.stringify(areaAccess)}`;
  const [creationScope, setCreationScope] = useState(null);
  const [includeInactive, setIncludeInactive] = useState(false);
  const actor = useKnowledgeQuery(getOrganizationProvisioningActor, { token, uid: account?.uid },
    Boolean(account?.uid && areaAllowed(areaAccess, 'organizations')));
  const canCreate = canProvisionOrganization(actor.data);
  const canIncludeInactive = ['primary_admin', 'administrator'].includes(actor.data?.profile_code);
  const { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh } =
    usePagedList(listOrganizations, { pageSize: 20, params: { includeInactive: canIncludeInactive && includeInactive } });

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'code', label: 'Código', render: row => <span className="font-monospace small">{row.code}</span> },
    {
      key: 'reseller_enabled', label: 'Revenda',
      render: row => <StatusBadge status={row.reseller_enabled ? 'active' : 'inactive'} label={row.reseller_enabled ? 'Sim' : 'Não'} />
    },
    { key: 'created_at', label: 'Criada em', render: row => (row.created_at ? new Date(row.created_at).toLocaleDateString('pt-BR') : '—') }
  ];

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title="Organizações" subTitle1="Operação" />
      <ListToolbar
        q={q}
        onChangeQ={setQ}
        placeholder="Buscar por nome ou código..."
        createLabel={canCreate ? 'Nova organização' : undefined}
        onAction={() => setCreationScope(scope)}
      />
      {canIncludeInactive && <Form.Check id="organizations-inactive" className="mb-3" label="Incluir organizações inativas"
        checked={includeInactive} onChange={event => { goToPage(1); setIncludeInactive(event.target.checked); }} />}
      {total != null && <p className="text-muted small mb-2">{total} organização(ões) visível(is).</p>}
      <DataTable
        columns={columns} rows={loading || error ? [] : items} loading={loading} error={error}
        onRowClick={row => router.push(detailHref('/organizacoes', row.uid))}
        emptyMessage="Nenhuma organização visível para o seu acesso."
        pagination={{ page, pageCount, total, onPage: goToPage }}
      />
      {canCreate && creationScope === scope && <OrganizationEditor key={scope} onClose={() => setCreationScope(null)} onCreated={result => {
        setCreationScope(null);
        notifySuccess(result?.uid_admin && result?.activation_expires_at
          ? 'Organização criada. O administrador inicial aguarda ativação.' : 'Organização criada.');
        refresh();
        const uid = result?.uid_organization ?? result?.organization?.uid ?? result?.uid;
        if (uid) router.push(detailHref('/organizacoes', uid));
      }} />}
    </div>
  );
};

function OrganizationEditor({ onClose, onCreated }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const plans = useOffsetList(billingPlans.list);
  const activePlans = plans.items.filter(plan => plan.active === true);
  return <BillingForm title="Nova organização" submitLabel="Criar organização" mutation={mutation} onClose={onClose}
    submitDisabled={Boolean(plans.error) || !activePlans.length}
    onSubmit={fields => mutation.submit(args => createOrganization({ ...args, token }),
      organizationProvisioningBody(fields), onCreated)}>
    <BillingField label="Código da organização" name="code" />
    <BillingField label="Nome da organização" name="name" />
    <BillingField label="E-mail" type="email" name="email" />
    <BillingField label="Nome do administrador" name="admin_name" />
    <BillingField label="Login do administrador (opcional)" name="admin_login" optional />
    <BillingField label="Plano de cobrança" name="uid_billing_plan"
      options={[[ '', plans.loading ? 'Carregando planos…' : 'Selecione um plano' ], ...activePlans.map(plan => [plan.uid, plan.name || plan.code])]} />
    {plans.error && <Alert variant="danger">{plans.error} <Button type="button" size="sm" variant="link" onClick={plans.refresh}>Tentar novamente</Button></Alert>}
    {!plans.loading && !plans.error && !activePlans.length && !plans.hasMore && <p className="text-body-secondary">Nenhum plano ativo disponível.</p>}
    {plans.hasMore && <Button type="button" size="sm" variant="outline-secondary" disabled={plans.loading} onClick={plans.loadMore}>Carregar mais planos</Button>}
  </BillingForm>;
}

export default OrganizationsPage;
