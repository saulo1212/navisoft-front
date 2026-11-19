'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ChecklistNavigation from '@/components/admin/ChecklistNavigation';
import { ChecklistFields, newChecklistQuestion } from '@/components/admin/ChecklistFields';
import DataTable from '@/components/admin/DataTable';
import FormDrawer from '@/components/admin/FormDrawer';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { OperationalGate, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createChecklist, listChecklists } from '@/lib/api/endpoints/checklists';
import { APPLICABILITY, checklistBody } from '@/lib/domain/checklists';
import { intentKey, requireUid } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="checklists"><Templates /></OperationalGate>; }
function Templates() {
  const { token, selectedOrganizationUid } = useSession();
  const router = useRouter();
  const list = useOffsetList(listChecklists, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const save = event => {
    event.preventDefault();
    void action.run(async signal => {
      const body = checklistBody(form, selectedOrganizationUid);
      const result = await createChecklist({ token, body, idempotencyKey: intentKey(intention, 'create-checklist', body), signal });
      return requireUid((result.item ?? result)?.uid, 'checklist criado');
    }, uid => { setForm(null); router.push(detailHref('/checklists', uid)); }, () => { setForm(null); list.setItems([]); });
  };
  return <>
    <PageBreadcrumb title="Checklists" subTitle1="Operação" /><ChecklistNavigation />
    <p>Edite o rascunho e publique uma versão para disponibilizá-la nas próximas execuções.</p>
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} actionLabel="Novo checklist" actionDisabled={action.busy} onAction={() => { action.clearError(); intention.current = null; setForm({ code: '', name: '', description: '', uid_group: '', active: true, applicability: 'driver', assignmentMode: 'selected', targets: '', questions: [newChecklistQuestion()] }); }} />
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} onRowClick={row => router.push(detailHref('/checklists', row.uid))} columns={[
      { key: 'code', label: 'Código' }, { key: 'name', label: 'Nome' }, { key: 'applicability', label: 'Aplicação', render: row => APPLICABILITY[row.applicability] || row.applicability },
      { key: 'latest_version', label: 'Última versão publicada', render: row => row.latest_version || 'Sem publicação' },
      { key: 'active', label: 'Situação', render: row => <StatusBadge status={row.active ? 'active' : 'inactive'} /> }
    ]} />
    {form && <FormDrawer show title="Novo checklist" onSubmit={save} submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setForm(null); }}><fieldset disabled={action.busy}><ChecklistFields form={form} onChange={setForm} /></fieldset></FormDrawer>}
  </>;
}
