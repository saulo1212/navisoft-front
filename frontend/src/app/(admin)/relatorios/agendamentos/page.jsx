'use client';

import { useRef, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import AgendaNavigation from '@/components/admin/AgendaNavigation';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createReportSchedule, deleteReportSchedule, getReportSchedule, listReportSchedules, setReportScheduleState, updateReportSchedule } from '@/lib/api/endpoints/reportSchedules';
import { scheduleBody, scheduleForm } from '@/lib/domain/agenda';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() {
  const { token, selectedOrganizationUid, areaAccess } = useSession();
  // Reports has no area in access-context. Authorization is per definition,
  // owner and target organization, revalidated by the reports endpoints.
  if (!selectedOrganizationUid || areaAccess?.status !== 'evaluated') return <Alert variant="warning">Selecione uma organização e aguarde a avaliação do acesso.</Alert>;
  return <Schedules key={`${token}:${selectedOrganizationUid}:${JSON.stringify(areaAccess)}`} />;
}
function Schedules() {
  const { token, selectedOrganizationUid } = useSession();
  const list = useOffsetList(listReportSchedules, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const [current, setCurrent] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [notice, setNotice] = useState(null);
  const args = { token, organizationUid: selectedOrganizationUid };
  const denied = () => { setForm(null); setCurrent(null); setConfirmation(null); list.setItems([]); };
  const completed = () => { setForm(null); setCurrent(null); setConfirmation(null); setNotice('Operação concluída.'); list.refresh(); };
  const edit = row => {
    action.clearError(); setNotice(null);
    void action.run(signal => getReportSchedule({ ...args, uid: row.uid, signal }), result => { const item = result.item ?? result; setCurrent(item); setForm(scheduleForm(item)); }, denied);
  };
  const save = event => {
    event.preventDefault();
    void action.run(signal => {
      const body = scheduleBody(form, selectedOrganizationUid);
      return current ? updateReportSchedule({ ...args, uid: current.uid, body, signal }) : createReportSchedule({ ...args, body, signal, idempotencyKey: intentKey(intention, 'create-report-schedule', body) });
    }, completed, denied);
  };
  const confirm = event => {
    event.preventDefault();
    void action.run(signal => confirmation.remove ? deleteReportSchedule({ ...args, uid: confirmation.row.uid, signal }) : setReportScheduleState({ ...args, uid: confirmation.row.uid, state: confirmation.state, signal }), completed, denied);
  };
  const field = key => ({ value: form[key], onChange: event => setForm({ ...form, [key]: event.target.value }) });
  return <>
    <PageBreadcrumb title="Agendamentos de relatórios" subTitle1="Relatórios" /><AgendaNavigation />
    <p>Gerencie os agendamentos disponíveis para seu usuário na organização selecionada. Os horários seguem o fuso da organização.</p>
    <p className="text-muted">Salvar configura o agendamento. A geração e a entrega dos arquivos dependem do serviço de relatórios.</p>
    {action.error && !form && !confirmation && <Alert variant="danger">{action.error}</Alert>}
    {notice && <Alert variant="success">{notice}</Alert>}
    <div className="d-flex gap-2 mb-3"><Button disabled={action.busy} onClick={() => { action.clearError(); intention.current = null; setCurrent(null); setForm(scheduleForm()); setNotice(null); }}>Novo agendamento</Button><Button variant="outline-secondary" disabled={list.loading || action.busy} onClick={list.refresh}>Atualizar</Button></div>
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[
      { key: 'report_code', label: 'Relatório', render: row => <Button variant="link" disabled={action.busy} onClick={() => edit(row)}>{row.report_code} · v{row.report_version}</Button> },
      { key: 'state', label: 'Situação', render: row => ({ active: 'Ativo', paused: 'Pausado' }[row.state] || row.state) },
      { key: 'cadence', label: 'Periodicidade / horário', render: row => `${row.cadence?.frequency === 'daily' ? 'Diária' : row.cadence?.frequency || '—'} · ${row.cadence?.at || '—'}` },
      { key: 'timezone', label: 'Fuso' }, { key: 'next_run_at', label: 'Próxima execução', render: row => row.next_run_at ? new Date(row.next_run_at).toLocaleString('pt-BR') : 'Não informada' },
      { key: 'actions', label: 'Ações', render: row => <div className="d-flex gap-2"><Button size="sm" variant="outline-secondary" disabled={action.busy || !['active', 'paused'].includes(row.state)} onClick={() => { action.clearError(); setConfirmation({ row, state: row.state === 'paused' ? 'active' : 'paused' }); }}>{row.state === 'paused' ? 'Retomar' : 'Pausar'}</Button><Button size="sm" variant="outline-danger" disabled={action.busy} onClick={() => { action.clearError(); setConfirmation({ row, remove: true }); }}>Excluir</Button></div> }
    ]} />
    {form && <FormModal show title={current ? 'Editar agendamento' : 'Novo agendamento diário'} submitting={action.busy} error={action.error} onSubmit={save} onHide={() => { if (!action.busy) setForm(null); }}><fieldset disabled={action.busy}>
      {current && <p>Fuso: {current.timezone || 'Definido pela organização'} · Periodicidade: {current.cadence?.frequency}. O período e a periodicidade existentes serão preservados.</p>}
      <OperationField label="Código do relatório publicado" required {...field('report_code')} />
      <OperationField label="Versão publicada" type="number" min="1" step="1" required {...field('report_version')} />
      <p className="small text-muted">Use o código, a versão e as colunas de uma definição publicada. A API valida sua disponibilidade e suas permissões.</p>
      <Form.Group className="mb-3" controlId="schedule-format"><Form.Label>Formato</Form.Label><Form.Select {...field('format')}><option value="xlsx">Excel (XLSX)</option><option value="csv">CSV</option></Form.Select></Form.Group>
      <Form.Group className="mb-3" controlId="schedule-visibility"><Form.Label>Visibilidade do arquivo</Form.Label><Form.Select {...field('visibility')}><option value="private">Privado</option><option value="public">Público</option></Form.Select></Form.Group>
      <OperationField label="Horário no fuso da organização" type="time" required {...field('at')} />
      <OperationField label="Retenção do arquivo (segundos)" type="number" min="1" max="2592000" step="1" required {...field('retention_seconds')} />
      <OperationField label="Colunas (uma por linha)" multiline required {...field('columns')} />
      <details><summary className="mb-3">Filtros e ordenação avançados</summary><OperationField label="Filtros do relatório (JSON)" multiline required {...field('filters')} /><OperationField label="Ordenação (JSON)" multiline required {...field('sort')} /></details>
    </fieldset></FormModal>}
    {confirmation && <FormModal show title={confirmation.remove ? 'Excluir agendamento' : confirmation.state === 'paused' ? 'Pausar agendamento' : 'Retomar agendamento'} submitting={action.busy} error={action.error} onSubmit={confirm} submitLabel="Confirmar" onHide={() => { if (!action.busy) setConfirmation(null); }}><p>{confirmation.row.report_code} · {confirmation.row.uid}</p><p>{confirmation.remove ? 'O agendamento será excluído logicamente. O histórico de relatórios será preservado.' : 'A situação do agendamento será alterada.'}</p></FormModal>}
  </>;
}
