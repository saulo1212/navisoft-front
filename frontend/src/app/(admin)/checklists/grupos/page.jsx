'use client';

import { useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ChecklistNavigation from '@/components/admin/ChecklistNavigation';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createChecklistGroup, getChecklistGroup, listChecklistGroups, patchChecklistGroup } from '@/lib/api/endpoints/checklists';
import { checklistGroupBody } from '@/lib/domain/checklists';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

export default function Page() { return <OperationalGate area="checklists"><Groups /></OperationalGate>; }
function Groups() {
  const { token, selectedOrganizationUid } = useSession();
  const list = useOffsetList(listChecklistGroups, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const args = { token, organizationUid: selectedOrganizationUid };
  const denied = () => { setForm(null); list.setItems([]); };
  const open = row => action.run(signal => getChecklistGroup({ ...args, uid: row.uid, signal }), result => { action.clearError(); setForm(result.item ?? result); }, denied);
  const save = event => {
    event.preventDefault();
    void action.run(signal => {
      const body = checklistGroupBody(form, selectedOrganizationUid);
      if (form.uid) return patchChecklistGroup({ ...args, uid: form.uid, body: { name: body.name, description: body.description, active: body.active }, signal });
      return createChecklistGroup({ token, body, idempotencyKey: intentKey(intention, 'create-checklist-group', body), signal });
    }, () => { setForm(null); list.refresh(); notifySuccess('Grupo salvo.'); }, denied);
  };
  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  return <>
    <PageBreadcrumb title="Grupos de checklist" subTitle1="Operação" /><ChecklistNavigation />
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} actionLabel="Novo grupo" actionDisabled={action.busy} onAction={() => { action.clearError(); intention.current = null; setForm({ code: '', name: '', description: '', active: true }); }} />
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} onRowClick={row => { if (!action.busy) void open(row); }} columns={[
      { key: 'code', label: 'Código' }, { key: 'name', label: 'Nome' }, { key: 'active', label: 'Situação', render: row => <StatusBadge status={row.active ? 'active' : 'inactive'} /> }
    ]} />
    {form && <FormModal show title={form.uid ? 'Editar grupo' : 'Novo grupo'} onSubmit={save} submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setForm(null); }}><fieldset disabled={action.busy}>
      <OperationField label="Código" required disabled={!!form.uid} value={form.code} onChange={e => set('code', e.target.value)} />
      <OperationField label="Nome" required value={form.name} onChange={e => set('name', e.target.value)} />
      <OperationField label="Descrição" multiline value={form.description || ''} onChange={e => set('description', e.target.value)} />
      <label><input type="checkbox" checked={form.active === true} onChange={e => set('active', e.target.checked)} /> Ativo</label>
    </fieldset></FormModal>}
  </>;
}
