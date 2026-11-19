'use client';

import { useRef, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import EventNotificationNavigation from '@/components/admin/EventNotificationNavigation';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import { OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createEventRule, deleteEventRule, getEventModel, getEventRule, listEventModels, listEventRules, updateEventRule } from '@/lib/api/endpoints/events';
import { EVENT_PRIORITIES, eventRuleBody, eventRuleForm } from '@/lib/domain/eventsNotifications';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="events"><Rules /></OperationalGate>; }
function Rules() {
  const { token, selectedOrganizationUid } = useSession();
  const list = useOffsetList(listEventRules, { params: { organizationUid: selectedOrganizationUid } });
  const models = useOffsetList(listEventModels, { limit: 100 });
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const [current, setCurrent] = useState(null);
  const [remove, setRemove] = useState(null);
  const [notice, setNotice] = useState(null);
  const args = { token, organizationUid: selectedOrganizationUid };
  const deny = () => { setCurrent(null); setForm(null); setRemove(null); list.setItems([]); };
  const complete = () => { setCurrent(null); setForm(null); setRemove(null); setNotice('Operação concluída.'); list.refresh(); };
  const field = key => ({ value: form[key], onChange: event => setForm({ ...form, [key]: event.target.value }) });
  const save = event => {
    event.preventDefault();
    void action.run(async signal => {
      const modelResult = await getEventModel({ token, uid: form.uid_model, signal });
      const body = eventRuleBody(form, selectedOrganizationUid, modelResult.item ?? modelResult);
      return current ? updateEventRule({ ...args, uid: current.uid, body, signal }) : createEventRule({ ...args, body, signal, idempotencyKey: intentKey(intention, 'event-rule', body) });
    }, complete, deny);
  };
  const open = row => {
    action.clearError(); setNotice(null);
    void action.run(async signal => {
      const result = await getEventRule({ ...args, uid: row.uid, signal });
      const record = result.item ?? result;
      return { record, form: eventRuleForm(record) };
    }, result => { setCurrent(result.record); setForm(result.form); }, deny);
  };
  const model = models.items.find(row => row.uid === form?.uid_model);
  return <>
    <PageBreadcrumb title="Regras de eventos" subTitle1="Operação" /><EventNotificationNavigation />
    {action.error && !form && !remove && <Alert variant="danger">{action.error}</Alert>}{notice && <Alert variant="success">{notice}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar por nome..." actionLabel="Nova regra" actionDisabled={action.busy} onAction={() => { intention.current = null; action.clearError(); setCurrent(null); setNotice(null); setForm(eventRuleForm()); }} />
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[
      { key: 'name', label: 'Regra', render: row => <Button variant="link" disabled={action.busy} onClick={() => open(row)}>{row.name}</Button> }, { key: 'model_code', label: 'Modelo' }, { key: 'priority', label: 'Prioridade', render: row => EVENT_PRIORITIES[row.priority] || row.priority }, { key: 'active', label: 'Ativa', render: row => row.active ? 'Sim' : 'Não' }, { key: 'actions', label: 'Ações', render: row => <Button variant="outline-danger" size="sm" disabled={action.busy} onClick={() => { action.clearError(); setRemove(row); }}>Excluir</Button> }
    ]} />
    {form && <FormModal show title={current ? 'Editar regra' : 'Nova regra'} onSubmit={save} submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setForm(null); }}><fieldset disabled={action.busy}>
      <OperationField label="Nome" required {...field('name')} />
      <Form.Group controlId="event-model" className="mb-3"><Form.Label>Modelo de evento</Form.Label><Form.Select required value={form.uid_model} onChange={event => { const selected = models.items.find(row => row.uid === event.target.value); setForm({ ...form, uid_model: event.target.value, parameters: JSON.stringify(selected?.defaults || {}, null, 2) }); }}><option value="">Selecione</option>{models.items.filter(row => row.active && !row.fixed && !row.periodic && !row.activation_only).map(row => <option key={row.uid} value={row.uid}>{row.name}</option>)}{current && !models.items.some(row => row.uid === form.uid_model) && <option value={form.uid_model}>{current.model_code || form.uid_model}</option>}</Form.Select></Form.Group>
      {models.error && <Alert variant="danger">Erro ao carregar modelos: {models.error}</Alert>}{models.hasMore && <Button type="button" variant="outline-secondary" onClick={models.loadMore} disabled={models.loading}>Mais modelos</Button>}
      <Form.Group controlId="event-priority" className="mb-3"><Form.Label>Prioridade</Form.Label><Form.Select {...field('priority')}>{Object.entries(EVENT_PRIORITIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Form.Select></Form.Group>
      <Form.Check id="event-active" label="Regra ativa" checked={form.active} onChange={event => setForm({ ...form, active: event.target.checked })} className="mb-3" />
      <h6>Alvo na organização selecionada</h6><p className="small text-muted">Deixe os campos vazios para toda a organização. Campos preenchidos compõem o mesmo alvo.</p>
      {['entity', 'unit', 'group', 'asset'].map((key, index) => <OperationField key={key} label={`UUID ${['da entidade', 'da unidade', 'do grupo', 'do ativo'][index]}`} {...field(`uid_${key}`)} />)}
      <OperationField label="Parâmetros do modelo (JSON)" multiline required {...field('parameters')} /><p className="small text-muted">Parâmetros permitidos: {Object.keys(model?.allowed_parameters || {}).join(', ') || 'consulte o tipo de evento'}.</p>
      <OperationField label="Confirmação da condição (segundos)" type="number" min="0" step="1" required {...field('condition_for_seconds')} /><OperationField label="Recuperação (segundos)" type="number" min="0" step="1" required {...field('recovery_for_seconds')} /><OperationField label="Atraso para disponibilizar ocorrência (segundos)" type="number" min="0" step="1" required {...field('delayed_seconds')} />
      <OperationField label="Início da vigência (fuso do navegador)" type="datetime-local" {...field('valid_from')} /><OperationField label="Fim da vigência (fuso do navegador)" type="datetime-local" {...field('valid_until')} />
      <details><summary className="mb-3">Condições, janelas e destinatários</summary><OperationField label="Condições AND (JSON)" multiline required {...field('conditions')} /><OperationField label="Janelas semanais (JSON)" multiline required {...field('windows')} /><p className="small">Dias de 1 (segunda) a 7 (domingo). Janelas podem atravessar a semana.</p><OperationField label="UUIDs de destinatários de Events (um por linha)" multiline {...field('recipients')} /><p className="small text-muted">Use destinatários cadastrados no domínio Events. Os destinatários de Notifications são independentes.</p></details>
    </fieldset></FormModal>}
    {remove && <FormModal show title="Excluir regra" submitLabel="Excluir" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setRemove(null); }} onSubmit={event => { event.preventDefault(); void action.run(signal => deleteEventRule({ ...args, uid: remove.uid, signal }), complete, deny); }}><p>Excluir a regra “{remove.name}”? O histórico será preservado.</p></FormModal>}
  </>;
}
