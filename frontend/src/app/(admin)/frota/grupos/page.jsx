'use client';

import { useState } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import OrganizationGate from '@/components/admin/OrganizationGate';
import { usePagedList } from '@/hooks/usePagedList';
import { createGroup, listGroups } from '@/lib/api/endpoints/fleet';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';

const FleetGroupsInner = () => {
  const { token, selectedOrganizationUid: orgUid } = useSession();
  const { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh } =
    usePagedList(args => listGroups({ ...args, organizationUid: orgUid }), {
      params: { organizationUid: orgUid }, pageSize: 20
    });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      await createGroup({ token, organizationUid: orgUid, name });
      notifySuccess('Grupo criado.');
      setOpen(false);
      setName('');
      refresh();
    } catch (err) { notifyError(err); } finally { setSaving(false); }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'uid', label: 'UID', render: r => <span className="text-muted font-monospace">{String(r.uid).slice(0, 8)}…</span> }
  ];

  return (
    <>
      <PageBreadcrumb title="Grupos de frota" subTitle1="Operação" subTitle2="Frota" />
      <ListToolbar q={q} onChangeQ={setQ} placeholder="Buscar grupo por nome..." actionLabel="Novo grupo" onAction={() => { setName(''); setOpen(true); }} />
      {total != null && <p className="text-muted small mb-2">{total} grupo(s) nesta organização.</p>}
      <DataTable
        columns={columns} rows={items} loading={loading} error={error}
        emptyMessage="Nenhum grupo cadastrado nesta organização."
        pagination={{ page, pageCount, total, onPage: goToPage }}
      />

      <FormModal show={open} onHide={() => setOpen(false)} title="Novo grupo" onSubmit={submit} submitting={saving}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <p className="text-muted small">Grupos pertencem à organização e podem reunir assets de entidades diferentes.</p>
      </FormModal>
    </>
  );
};

const FleetGroupsPage = () => (
  <OrganizationGate>
    <FleetGroupsInner />
  </OrganizationGate>
);

export default FleetGroupsPage;
