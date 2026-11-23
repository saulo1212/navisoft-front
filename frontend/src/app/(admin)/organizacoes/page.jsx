'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { BillingField, BillingForm, uidPattern, useBillingMutation } from '@/components/admin/BillingUi';
import { areaAllowed } from '@/components/admin/OperationalUi';
import DataTable from '@/components/admin/DataTable';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { usePagedList } from '@/hooks/usePagedList';
import { createOrganization, listOrganizations } from '@/lib/api/endpoints/organizations';
import { useSession } from '@/lib/session/SessionContext';

const OrganizationsPage = () => {
  const router = useRouter();
  const { token, selectedOrganizationUid, areaAccess } = useSession();
  const scope = `${token}:${selectedOrganizationUid}:${JSON.stringify(areaAccess)}`;
  const [creationScope, setCreationScope] = useState(null);
  const [created, setCreated] = useState(null);
  const { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh } =
    usePagedList(args => listOrganizations(args), { pageSize: 20 });

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
        createLabel={areaAllowed(areaAccess, 'organizations') ? 'Nova organização' : undefined}
        onAction={() => setCreationScope(scope)}
      />
      {created?.scope === scope && <Alert variant="success">Organização criada.</Alert>}
      {total != null && <p className="text-muted small mb-2">{total} organização(ões) visível(is).</p>}
      <DataTable
        columns={columns} rows={items} loading={loading} error={error}
        onRowClick={row => router.push(detailHref('/organizacoes', row.uid))}
        emptyMessage="Nenhuma organização visível para o seu acesso."
        pagination={{ page, pageCount, total, onPage: goToPage }}
      />
      {creationScope === scope && <OrganizationEditor key={scope} onClose={() => setCreationScope(null)} onCreated={result => {
        setCreationScope(null);
        setCreated({ scope });
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
  return <BillingForm title="Nova organização" submitLabel="Criar organização" mutation={mutation} onClose={onClose}
    onSubmit={fields => mutation.submit(args => createOrganization({ ...args, token }),
      Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.trim()])), onCreated)}>
    <BillingField label="Código da organização" name="code" />
    <BillingField label="Nome da organização" name="name" />
    <BillingField label="E-mail" type="email" name="email" />
    <BillingField label="Nome do administrador" name="admin_name" />
    <BillingField label="Login do administrador" name="admin_login" />
    <BillingField label="Plano de cobrança (UUID)" name="uid_billing_plan" pattern={uidPattern} />
  </BillingForm>;
}

export default OrganizationsPage;
