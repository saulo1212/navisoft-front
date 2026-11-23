'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import OrganizationGate from '@/components/admin/OrganizationGate';
import StatusBadge from '@/components/admin/StatusBadge';
import { usePagedList } from '@/hooks/usePagedList';
import { createEntity, searchEntities } from '@/lib/api/endpoints/entities';
import { situationsApi } from '@/lib/api/endpoints/situations';
import { normalizeList } from '@/lib/api/http';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';
import { situationBadgeStatus, situationName } from '@/lib/domain/fleet';

const EntitiesInner = () => {
  const router = useRouter();
  const { token, selectedOrganizationUid: orgUid } = useSession();
  const { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh } =
    usePagedList(args => searchEntities({ ...args, organizationUid: orgUid }), {
      params: { organizationUid: orgUid }, pageSize: 20
    });

  // Mapa uid_situations → situação, para rotular o estado na listagem.
  const [situations, setSituations] = useState({});
  useEffect(() => {
    if (!token) return;
    situationsApi.list({ token, limit: 100 })
      .then(res => {
        const map = {};
        for (const s of normalizeList(res).items) map[s.uid] = s;
        setSituations(map);
      })
      .catch(() => {});
  }, [token]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setName(''); setOpen(true); };

  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      await createEntity({ token, organizationUid: orgUid, name });
      notifySuccess('Entidade criada.');
      setOpen(false);
      refresh();
    } catch (err) { notifyError(err); } finally { setSaving(false); }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    {
      key: 'uid_situations', label: 'Situação',
      render: r => r.uid_situations
        ? <StatusBadge status={situationBadgeStatus(r.uid_situations, situations)} label={situationName(r.uid_situations, situations)} />
        : <span className="text-muted">—</span>
    }
  ];

  return (
    <>
      <PageBreadcrumb title="Entidades" subTitle1="Operação" />
      <ListToolbar q={q} onChangeQ={setQ} placeholder="Buscar entidade por nome..." createLabel="Nova entidade" onAction={openCreate} />
      {total != null && <p className="text-muted small mb-2">{total} entidade(s) nesta organização.</p>}
      <DataTable
        columns={columns} rows={items} loading={loading} error={error}
        onRowClick={row => router.push(detailHref('/entidades', row.uid))}
        emptyMessage="Nenhuma entidade cadastrada nesta organização."
        pagination={{ page, pageCount, total, onPage: goToPage }}
      />

      <FormModal show={open} onHide={() => setOpen(false)} title="Nova entidade" onSubmit={submit} submitting={saving}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <p className="text-muted small">
          A entidade nasce vinculada à organização atual (organização imutável depois). Tipos, unidades e endereços
          são definidos na tela de detalhe.
        </p>
      </FormModal>
    </>
  );
};

const EntitiesPage = () => (
  <OrganizationGate>
    <EntitiesInner />
  </OrganizationGate>
);

export default EntitiesPage;
