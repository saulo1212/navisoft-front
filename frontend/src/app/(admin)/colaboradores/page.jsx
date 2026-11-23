'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import OrganizationGate from '@/components/admin/OrganizationGate';
import StatusBadge from '@/components/admin/StatusBadge';
import { usePagedList } from '@/hooks/usePagedList';
import { createCollaborator, searchCollaborators } from '@/lib/api/endpoints/collaborators';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';
import { fmtDate } from '@/lib/domain/collaborators';

const EMPTY = { legal_name: '', preferred_name: '', birth_date: '' };

const CollaboratorsInner = () => {
  const router = useRouter();
  const { token, selectedOrganizationUid } = useSession();
  const { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh } =
    usePagedList(args => searchCollaborators({ ...args, organizationUid: selectedOrganizationUid }), {
      params: { organizationUid: selectedOrganizationUid }, pageSize: 20
    });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setForm(EMPTY); setOpen(true); };

  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      await createCollaborator({
        token,
        body: {
          uid_organization: selectedOrganizationUid,
          legal_name: form.legal_name,
          preferred_name: form.preferred_name || null,
          birth_date: form.birth_date || null,
          active: true
        }
      });
      notifySuccess('Colaborador criado.');
      setOpen(false);
      refresh();
    } catch (err) { notifyError(err); } finally { setSaving(false); }
  };

  const columns = [
    { key: 'legal_name', label: 'Nome legal' },
    { key: 'preferred_name', label: 'Nome preferencial', render: r => r.preferred_name || <span className="text-muted">—</span> },
    { key: 'birth_date', label: 'Nascimento', render: r => fmtDate(r.birth_date) },
    { key: 'active', label: 'Estado', render: r => <StatusBadge status={r.active ? 'active' : 'inactive'} /> }
  ];

  return (
    <>
      <PageBreadcrumb title="Colaboradores" subTitle1="Pessoas & Acesso" />
      <ListToolbar q={q} onChangeQ={setQ} placeholder="Buscar por nome..." createLabel="Novo colaborador" onAction={openCreate} />
      {total != null && <p className="text-muted small mb-2">{total} colaborador(es) nesta organização.</p>}
      <DataTable
        columns={columns} rows={items} loading={loading} error={error}
        onRowClick={row => router.push(detailHref('/colaboradores', row.uid))}
        emptyMessage="Nenhum colaborador cadastrado nesta organização."
        pagination={{ page, pageCount, total, onPage: goToPage }}
      />

      <FormModal show={open} onHide={() => setOpen(false)} title="Novo colaborador" onSubmit={submit} submitting={saving}>
        <div className="mb-3">
          <label className="form-label">Nome legal</label>
          <input className="form-control" value={form.legal_name} onChange={e => setForm(f => ({ ...f, legal_name: e.target.value }))} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nome preferencial <span className="text-muted small">(opcional)</span></label>
          <input className="form-control" value={form.preferred_name} onChange={e => setForm(f => ({ ...f, preferred_name: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="form-label">Data de nascimento <span className="text-muted small">(opcional)</span></label>
          <input type="date" className="form-control" value={form.birth_date} onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))} />
        </div>
        <p className="text-muted small">O colaborador nasce ativo e vinculado à organização atual. Vínculos de trabalho (engagements) e lotação são definidos na tela de detalhe.</p>
      </FormModal>
    </>
  );
};

const CollaboratorsPage = () => (
  <OrganizationGate>
    <CollaboratorsInner />
  </OrganizationGate>
);

export default CollaboratorsPage;
