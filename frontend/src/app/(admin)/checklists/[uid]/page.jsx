'use client';

import { useEffect, useState } from 'react';
import { useDetailParam } from '@/lib/navigation/useDetailParam';
import { Alert, Button, Modal } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ChecklistNavigation from '@/components/admin/ChecklistNavigation';
import { ChecklistFields } from '@/components/admin/ChecklistFields';
import { OperationalGate, operationError, useOperationalAction } from '@/components/admin/OperationalUi';
import { getChecklist, patchChecklist, publishChecklist } from '@/lib/api/endpoints/checklists';
import { checklistBody, checklistForm } from '@/lib/domain/checklists';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

export default function Page() { const uid = useDetailParam('uid'); return <OperationalGate area="checklists"><Template key={uid} uid={uid} /></OperationalGate>; }
function Template({ uid }) {
  const { token, selectedOrganizationUid } = useSession();
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const action = useOperationalAction();
  const args = { token, organizationUid: selectedOrganizationUid, uid };
  const apply = result => { const item = result.item ?? result; setRecord(item); setForm(checklistForm(item)); setLoadError(null); setConfirm(false); };
  useEffect(() => {
    const controller = new AbortController();
    getChecklist({ token, organizationUid: selectedOrganizationUid, uid, signal: controller.signal }).then(result => { if (!controller.signal.aborted) apply(result); }).catch(err => { if (!controller.signal.aborted) setLoadError(operationError(err)); });
    return () => controller.abort();
  }, [token, selectedOrganizationUid, uid]);
  const denied = () => { setRecord(null); setForm(null); setConfirm(false); };
  const dirty = form && record && JSON.stringify(form) !== JSON.stringify(checklistForm(record));
  const save = event => {
    event.preventDefault();
    void action.run(async signal => {
      const body = checklistBody(form, selectedOrganizationUid);
      await patchChecklist({ ...args, body, signal });
      return getChecklist({ ...args, signal });
    }, result => { apply(result); notifySuccess('Rascunho salvo. Publique para usá-lo nas próximas execuções.'); }, denied);
  };
  const publish = () => {
    if (dirty) return;
    void action.run(async signal => { await publishChecklist({ ...args, signal }); return getChecklist({ ...args, signal }); }, result => { apply(result); notifySuccess('Versão publicada.'); }, denied);
  };
  return <>
    <PageBreadcrumb title={record?.name || 'Detalhe do checklist'} subTitle1="Operação" /><ChecklistNavigation />
    {loadError && <Alert variant="danger">{loadError}</Alert>}
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    {!record && !loadError && !action.error && <p>Carregando checklist...</p>}
    {record && form && <>
      <div className="card panel p-3 mb-3"><p className="mb-1">Última versão publicada: <strong>{record.latest_version || 'Nenhuma'}</strong></p><p className="mb-0 small text-muted">Alterações no rascunho não modificam as versões já fixadas em execuções. Para desativar uma versão nas próximas execuções, salve o rascunho inativo e publique.</p></div>
      <form className="card panel p-4" onSubmit={save}><fieldset disabled={action.busy || confirm}>
        <ChecklistFields form={form} onChange={setForm} editing />
        <div className="d-flex flex-wrap gap-2 mt-4"><Button type="submit" disabled={!dirty}>Salvar rascunho</Button><Button type="button" variant="outline-primary" disabled={!!dirty} onClick={() => setConfirm(true)}>Publicar versão</Button></div>
        {dirty && <p className="text-muted small mt-2">Salve as alterações antes de publicar.</p>}
      </fieldset></form>
    </>}
    <Modal show={confirm} onHide={() => { if (!action.busy) setConfirm(false); }}>
      <Modal.Header closeButton={!action.busy}><Modal.Title>Publicar checklist</Modal.Title></Modal.Header>
      <Modal.Body>{action.error && <Alert variant="danger">{action.error}</Alert>}A versão publicada será usada nas próximas execuções dos destinatários configurados. Execuções existentes manterão suas versões. Sem alterações, a API poderá reutilizar a mesma versão.</Modal.Body>
      <Modal.Footer><Button variant="outline-secondary" disabled={action.busy} onClick={() => setConfirm(false)}>Voltar</Button><Button disabled={action.busy || !!dirty} onClick={publish}>Confirmar publicação</Button></Modal.Footer>
    </Modal>
  </>;
}
