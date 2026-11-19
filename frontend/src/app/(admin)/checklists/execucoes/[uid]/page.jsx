'use client';

import { useEffect, useState } from 'react';
import { useDetailParam } from '@/lib/navigation/useDetailParam';
import { Alert, Button, Modal } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ChecklistNavigation from '@/components/admin/ChecklistNavigation';
import StatusBadge from '@/components/admin/StatusBadge';
import { OperationalGate, OperationField, operationError, useOperationalAction } from '@/components/admin/OperationalUi';
import { getChecklistRun, updateChecklistRun } from '@/lib/api/endpoints/checklists';
import { APPLICABILITY, EFFECTS, QUESTION_TYPES, checklistAnswersBody, runAnswers, runIsComplete } from '@/lib/domain/checklists';
import { requireUid } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

const resultLabel = value => ({ fit: 'Apto', not_fit: 'Inapto', released: 'Liberado', blocked: 'Bloqueado' })[value] || value || 'Não calculado';
export default function Page() { const uid = useDetailParam('uid'); return <OperationalGate area="checklists"><Run key={uid} uid={uid} /></OperationalGate>; }
function Run({ uid }) {
  const { token, selectedOrganizationUid } = useSession();
  const [run, setRun] = useState(null);
  const [values, setValues] = useState({});
  const [asset, setAsset] = useState('');
  const [confirmComplete, setConfirmComplete] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const action = useOperationalAction();
  const args = { token, organizationUid: selectedOrganizationUid, uid };
  const apply = result => { const record = result.item ?? result; setRun(record); setValues(runAnswers(record)); setAsset(record.uid_asset || ''); setConfirmComplete(false); setLoadError(null); };
  useEffect(() => {
    const controller = new AbortController();
    getChecklistRun({ token, organizationUid: selectedOrganizationUid, uid, signal: controller.signal }).then(result => { if (!controller.signal.aborted) apply(result); }).catch(err => { if (!controller.signal.aborted) setLoadError(operationError(err)); });
    return () => controller.abort();
  }, [token, selectedOrganizationUid, uid]);
  const denied = () => { setRun(null); setValues({}); setConfirmComplete(false); };
  const refresh = () => action.run(signal => getChecklistRun({ ...args, signal }), apply, denied);
  const closed = runIsComplete(run);
  const change = (executionUid, code, value) => setValues(prev => ({ ...prev, [executionUid]: { ...(prev[executionUid] || {}), [code]: value } }));
  const attach = event => {
    event.preventDefault();
    if (closed || run.uid_asset) return;
    void action.run(async signal => {
      await updateChecklistRun({ ...args, body: { uid_asset: requireUid(asset, 'ativo') }, signal });
      return getChecklistRun({ ...args, signal });
    }, apply, denied);
  };
  const save = complete => {
    if (closed) return;
    void action.run(async signal => {
      const body = checklistAnswersBody(run, values, complete);
      await updateChecklistRun({ ...args, body, signal });
      if (complete) await updateChecklistRun({ ...args, body: { complete: true }, signal });
      return getChecklistRun({ ...args, signal });
    }, apply, denied);
  };
  return <>
    <PageBreadcrumb title="Execução de checklist" subTitle1="Operação" /><ChecklistNavigation />
    {loadError && <Alert variant="danger">{loadError}</Alert>}{action.error && <Alert variant="danger">{action.error}</Alert>}
    <Button size="sm" variant="outline-secondary" disabled={action.busy} className="mb-3" onClick={refresh}>Recarregar execução</Button>
    {!run && !loadError && !action.error && <p>Carregando execução...</p>}
    {run && <>
      <div className="card panel p-4 mb-3">
        <p className="text-break">Identificador: {run.uid}</p><p>Motorista: {run.uid_driver}</p><p>Ativo: {run.uid_asset || 'Ainda não selecionado'}</p><div><StatusBadge status={closed ? 'completed' : run.status || 'in_progress'} /></div>
        <p className="mt-3 mb-0">Resultado: <strong>{resultLabel(run.outcome)}</strong> · Motorista: {resultLabel(run.driver_result)} · Ativo: {resultLabel(run.asset_result)}</p>
        {closed && <Alert variant={run.outcome === 'blocked' ? 'warning' : 'success'} className="mt-3 mb-0">Execução encerrada. As respostas e versões fixadas são preservadas.</Alert>}
      </div>
      {!closed && !run.uid_asset && <form className="card panel p-4 mb-3" onSubmit={attach}><fieldset disabled={action.busy || confirmComplete}>
        <OperationField label="UUID do ativo da organização (opcional)" value={asset} onChange={e => setAsset(e.target.value)} />
        <p className="small text-muted">Confira o ativo antes de selecioná-lo. Para trabalhar com outro ativo depois de responder, inicie uma nova execução.</p>
        <Button type="submit" size="sm" disabled={!asset}>Selecionar ativo e carregar checklists</Button>
      </fieldset></form>}
      {!(run.executions || []).length && <Alert variant="info">Nenhum checklist publicado foi aplicado até esta etapa. Ao selecionar um ativo, outros checklists poderão ser carregados.</Alert>}
      <fieldset disabled={closed || action.busy || confirmComplete}>
        {(run.executions || []).map(execution => <section key={execution.uid} className="card panel p-4 mb-3">
          <h5>{execution.checklist?.name || 'Checklist'}</h5>
          <p className="text-muted">{APPLICABILITY[execution.target_type] || execution.target_type} · Versão fixada {execution.version_number} · {execution.checklist?.group?.name}</p>
          {(execution.checklist?.definition?.questions || []).map(question => {
            const value = values[execution.uid]?.[question.code];
            const stored = (execution.answers || []).some(answer => answer.question_code === question.code && typeof answer.value === 'boolean');
            return <div className="mb-4" key={question.code}>
              {question.type === 'boolean' ? <><label className="form-label" htmlFor={`${execution.uid}-${question.code}`}>{question.label}{question.required ? ' *' : ''}</label><select id={`${execution.uid}-${question.code}`} className="form-select" value={value === true ? 'true' : value === false ? 'false' : ''} onChange={e => change(execution.uid, question.code, e.target.value === '' ? undefined : e.target.value === 'true')}><option value="" disabled={stored}>Não respondido</option><option value="true">Sim</option><option value="false">Não</option></select></> : question.type === 'text' ? <OperationField label={`${question.label}${question.required ? ' *' : ''}`} multiline value={value ?? ''} onChange={e => change(execution.uid, question.code, e.target.value)} /> : <Alert variant="warning">{question.label}: o tipo {question.type} não é suportado nesta tela. {value !== undefined ? 'A resposta existente será preservada.' : 'Não foi preenchida uma resposta.'}</Alert>}
              {question.type === 'boolean' && question.effect && question.effect !== 'none' && <p className="small text-muted mt-1">Se Sim: {EFFECTS[question.effect] || question.effect}.</p>}
            </div>;
          })}
        </section>)}
        {!closed && <div className="d-flex gap-2 mb-4"><Button type="button" onClick={() => save(false)}>Salvar respostas</Button><Button type="button" variant="success" onClick={() => setConfirmComplete(true)}>Concluir execução</Button></div>}
      </fieldset>
    </>}
    <Modal show={confirmComplete} onHide={() => { if (!action.busy) setConfirmComplete(false); }}>
      <Modal.Header closeButton={!action.busy}><Modal.Title>Concluir execução</Modal.Title></Modal.Header>
      <Modal.Body>{action.error && <Alert variant="danger">{action.error}</Alert>}As respostas serão salvas e a execução ficará imutável. O resultado será calculado pelas regras da versão fixada. Respostas que indiquem ativo inapto podem gerar manutenção e bloquear sua disponibilidade.</Modal.Body>
      <Modal.Footer><Button variant="outline-secondary" disabled={action.busy} onClick={() => setConfirmComplete(false)}>Voltar</Button><Button variant="success" disabled={action.busy} onClick={() => save(true)}>Confirmar conclusão</Button></Modal.Footer>
    </Modal>
  </>;
}
