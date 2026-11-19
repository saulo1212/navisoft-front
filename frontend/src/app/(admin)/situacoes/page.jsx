'use client';

import { useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { usePagedList } from '@/hooks/usePagedList';
import { situationsApi } from '@/lib/api/endpoints/situations';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';

const EMPTY = { code: '', name: '', enabled: true, operational: true, locked: false, applies_to_all: false, scopes: '' };

const SituationsPage = () => {
  const { token } = useSession();
  const { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh } =
    usePagedList(args => situationsApi.list(args), { pageSize: 20 });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = row => {
    setEditing(row);
    setForm({ ...row, scopes: (row.scopes || []).join(', ') });
    setOpen(true);
  };

  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    const body = {
      code: form.code, name: form.name,
      enabled: !!form.enabled, operational: !!form.operational,
      locked: !!form.locked, applies_to_all: !!form.applies_to_all,
      scopes: form.scopes.split(',').map(s => s.trim()).filter(Boolean)
    };
    try {
      if (editing) await situationsApi.update({ token, uid: editing.uid, body });
      else await situationsApi.create({ token, body });
      notifySuccess(editing ? 'Situação atualizada.' : 'Situação criada.');
      setOpen(false);
      refresh();
    } catch (err) { notifyError(err); } finally { setSaving(false); }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'code', label: 'Código', render: r => <span className="font-monospace small">{r.code}</span> },
    { key: 'enabled', label: 'Estado', render: r => <StatusBadge status={r.enabled ? 'active' : 'inactive'} label={r.enabled ? 'Habilitada' : 'Desabilitada'} /> },
    { key: 'operational', label: 'Operacional', render: r => (r.operational ? 'Sim' : 'Não') },
    { key: 'scopes', label: 'Escopos', render: r => (r.scopes?.length ? r.scopes.map(s => <Badge key={s} bg="light" text="dark" className="me-1">{s}</Badge>) : <span className="text-muted">todos</span>) },
    { key: 'locked', label: '', render: r => (r.locked ? <Badge bg="secondary">sistema</Badge> : null) }
  ];

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title="Situações" subTitle1="Operação" />
      <ListToolbar q={q} onChangeQ={setQ} placeholder="Buscar situação..." actionLabel="Nova situação" onAction={openCreate} />
      {total != null && <p className="text-muted small mb-2">{total} situação(ões).</p>}
      <DataTable
        columns={columns} rows={items} loading={loading} error={error}
        onRowClick={openEdit}
        emptyMessage="Nenhuma situação cadastrada."
        pagination={{ page, pageCount, total, onPage: goToPage }}
      />

      <FormModal
        show={open} onHide={() => setOpen(false)} title={editing ? 'Editar situação' : 'Nova situação'}
        onSubmit={submit} submitting={saving}
      >
        <div className="mb-3">
          <label className="form-label">Código</label>
          <input className="form-control font-monospace" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required disabled={!!editing?.locked} />
        </div>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Escopos <span className="text-muted small">(separados por vírgula; vazio = todos)</span></label>
          <input className="form-control" value={form.scopes} onChange={e => setForm(f => ({ ...f, scopes: e.target.value }))} placeholder="entities, assets" disabled={!!form.applies_to_all} />
        </div>
        <div className="form-check form-switch mb-2">
          <input className="form-check-input" type="checkbox" id="s-enabled" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))} />
          <label className="form-check-label" htmlFor="s-enabled">Habilitada</label>
        </div>
        <div className="form-check form-switch mb-2">
          <input className="form-check-input" type="checkbox" id="s-operational" checked={form.operational} onChange={e => setForm(f => ({ ...f, operational: e.target.checked }))} />
          <label className="form-check-label" htmlFor="s-operational">Operacional</label>
        </div>
        <div className="form-check form-switch mb-2">
          <input className="form-check-input" type="checkbox" id="s-all" checked={form.applies_to_all} onChange={e => setForm(f => ({ ...f, applies_to_all: e.target.checked }))} />
          <label className="form-check-label" htmlFor="s-all">Aplica-se a todos os escopos</label>
        </div>
        {editing?.locked && <p className="text-muted small mb-0">Situação de sistema (travada): código e exclusão são protegidos.</p>}
      </FormModal>
    </div>
  );
};

export default SituationsPage;
