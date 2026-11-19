'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge, Button, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { usePagedList } from '@/hooks/usePagedList';
import { createUser, listUsers, patchUser } from '@/lib/api/endpoints/users';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';
import { PROFILE_CODES as PROFILES, PROFILE_LABELS } from '@/lib/domain/users';

const EMPTY = { name: '', login: '', profile_code: 'basic_user', organizations_access: 'selected' };

const UsersPage = () => {
  const router = useRouter();
  const { token, selectedOrganizationUid } = useSession();
  const { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh } =
    usePagedList(args => listUsers(args), { pageSize: 20 });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [togglingUid, setTogglingUid] = useState(null);

  const openCreate = () => { setForm(EMPTY); setOpen(true); };

  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const body = {
        uid_organization: selectedOrganizationUid,
        profile_code: form.profile_code,
        name: form.name,
        login: form.login,
        enabled: false, // provisionado: ativação depois (fluxo de primeiro acesso)
        organizations_access: form.organizations_access
      };
      if (form.organizations_access === 'selected') {
        body.scopes = selectedOrganizationUid ? [{ uid_organization: selectedOrganizationUid }] : [];
      }
      await createUser({ token, body });
      notifySuccess('Usuário provisionado (desabilitado até o primeiro acesso).');
      setOpen(false);
      refresh();
    } catch (err) { notifyError(err); } finally { setSaving(false); }
  };

  const toggleEnabled = async (row, event) => {
    event.stopPropagation();
    setTogglingUid(row.uid);
    try {
      await patchUser({ token, uid: row.uid, body: { enabled: !row.enabled } });
      notifySuccess(row.enabled ? 'Usuário desabilitado.' : 'Usuário habilitado.');
      refresh();
    } catch (err) { notifyError(err); } finally { setTogglingUid(null); }
  };

  const columns = [
    { key: 'name', label: 'Nome', render: r => r.name || <span className="text-muted">—</span> },
    { key: 'login', label: 'Login', render: r => <span className="font-monospace small">{r.login}</span> },
    { key: 'profile_code', label: 'Perfil', render: r => <Badge bg="info" text="dark">{PROFILE_LABELS[r.profile_code] || r.profile_code}</Badge> },
    { key: 'organizations_access', label: 'Acesso', render: r => (r.organizations_access === 'all' ? 'Todas orgs' : 'Selecionadas') },
    { key: 'enabled', label: 'Estado', render: r => <StatusBadge status={r.enabled ? 'active' : 'inactive'} label={r.enabled ? 'Habilitado' : 'Desabilitado'} /> },
    {
      key: 'actions', label: '', render: r => (
        <Button size="sm" variant={r.enabled ? 'outline-danger' : 'outline-success'} disabled={togglingUid === r.uid} onClick={e => toggleEnabled(r, e)}>
          {r.enabled ? 'Desabilitar' : 'Habilitar'}
        </Button>
      )
    }
  ];

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title="Usuários" subTitle1="Pessoas & Acesso" />
      <ListToolbar q={q} onChangeQ={setQ} placeholder="Buscar por nome, login ou e-mail..." actionLabel="Novo usuário" onAction={openCreate} />
      {total != null && <p className="text-muted small mb-2">{total} usuário(s).</p>}
      <DataTable
        columns={columns} rows={items} loading={loading} error={error}
        onRowClick={row => router.push(detailHref('/usuarios', row.uid))}
        emptyMessage="Nenhum usuário encontrado."
        pagination={{ page, pageCount, total, onPage: goToPage }}
      />

      <FormModal show={open} onHide={() => setOpen(false)} title="Novo usuário" onSubmit={submit} submitting={saving} submitLabel="Provisionar">
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Login</label>
          <input className="form-control font-monospace" value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))} placeholder="usuario@example.com" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Perfil</label>
          <Form.Select value={form.profile_code} onChange={e => setForm(f => ({ ...f, profile_code: e.target.value }))}>
            {PROFILES.map(p => <option key={p} value={p}>{PROFILE_LABELS[p]} ({p})</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Acesso a organizações</label>
          <Form.Select value={form.organizations_access} onChange={e => setForm(f => ({ ...f, organizations_access: e.target.value }))}>
            <option value="selected">Somente selecionadas</option>
            <option value="all">Todas as organizações</option>
          </Form.Select>
        </div>
        <p className="text-muted small mb-0">
          O usuário é criado <strong>desabilitado</strong> e com escopo na organização atual.
          A ativação (habilitar + primeiro acesso/convite) é feita depois.
        </p>
      </FormModal>
    </div>
  );
};

export default UsersPage;
