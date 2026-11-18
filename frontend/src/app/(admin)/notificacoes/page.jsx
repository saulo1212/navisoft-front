'use client';

import { useRef, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import EventNotificationNavigation from '@/components/admin/EventNotificationNavigation';
import FormDrawer from '@/components/admin/FormDrawer';
import { OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createNotificationRecipient, deleteNotificationRecipient, getNotificationRecipient, listNotificationRecipients, updateNotificationRecipient } from '@/lib/api/endpoints/notifications';
import { notificationRecipientBody, notificationRecipientForm } from '@/lib/domain/eventsNotifications';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="notifications"><Recipients /></OperationalGate>; }
function Recipients() {
  const { token, selectedOrganizationUid } = useSession();
  const list = useOffsetList(listNotificationRecipients, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const [current, setCurrent] = useState(null);
  const [remove, setRemove] = useState(null);
  const [notice, setNotice] = useState(null);
  const args = { token, organizationUid: selectedOrganizationUid };
  const deny = () => { setForm(null); setCurrent(null); setRemove(null); list.setItems([]); };
  const complete = () => { setForm(null); setCurrent(null); setRemove(null); setNotice('Operação concluída.'); list.refresh(); };
  const field = key => ({ value: form[key], onChange: event => setForm({ ...form, [key]: event.target.value }) });
  const save = event => {
    event.preventDefault();
    void action.run(signal => {
      const body = notificationRecipientBody(form, selectedOrganizationUid);
      return current ? updateNotificationRecipient({ ...args, uid: current.uid, body, signal }) : createNotificationRecipient({ ...args, body, signal, idempotencyKey: intentKey(intention, 'notification-recipient', body) });
    }, complete, deny);
  };
  const open = row => {
    action.clearError(); setNotice(null);
    void action.run(signal => getNotificationRecipient({ ...args, uid: row.uid, signal }), result => { const record = result.item ?? result; setCurrent(record); setForm(notificationRecipientForm(record)); }, deny);
  };
  const endpointChange = (index, patch) => setForm({ ...form, endpoints: form.endpoints.map((endpoint, i) => i === index ? { ...endpoint, ...patch } : endpoint) });
  return <>
    <PageBreadcrumb title="Destinatários de notificações" subTitle1="Operação" /><EventNotificationNavigation notifications />
    <p>Cadastre os destinos de entrega e seus vínculos. Salvar um destinatário não envia uma mensagem.</p>
    {notice && <Alert variant="success">{notice}</Alert>}{action.error && !form && !remove && <Alert variant="danger">{action.error}</Alert>}
    <div className="d-flex gap-2 mb-3"><Button disabled={action.busy} onClick={() => { action.clearError(); intention.current = null; setCurrent(null); setNotice(null); setForm(notificationRecipientForm({ organization_bindings: [{ uid_organization: selectedOrganizationUid }] })); }}>Novo destinatário externo</Button><Button variant="outline-secondary" disabled={list.loading || action.busy} onClick={list.refresh}>Atualizar</Button></div>
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[
      { key: 'name', label: 'Nome', render: row => <Button variant="link" disabled={action.busy} onClick={() => open(row)}>{row.name || row.uid}</Button> }, { key: 'kind', label: 'Tipo' }, { key: 'active', label: 'Ativo', render: row => row.active ? 'Sim' : 'Não' }, { key: 'actions', label: 'Ações', render: row => <Button size="sm" variant="outline-danger" disabled={action.busy} onClick={() => { action.clearError(); setRemove(row); }}>Desativar</Button> }
    ]} />
    {form && <FormDrawer show title={current ? 'Destinatário' : 'Novo destinatário externo'} submitting={action.busy} submitDisabled={form.kind !== 'external'} error={action.error} onSubmit={save} onHide={() => { if (!action.busy) setForm(null); }}><fieldset disabled={action.busy || form.kind !== 'external'}>
      {form.kind !== 'external' && <Alert variant="info">Destinatário vinculado: consulta disponível. A edição deve ser feita no cadastro de origem.</Alert>}
      <OperationField label="Nome" required {...field('name')} /><Form.Check id="notification-recipient-active" label="Ativo" checked={form.active} onChange={event => setForm({ ...form, active: event.target.checked })} className="mb-3" />
      <h6>Destinos de entrega</h6>{form.endpoints.map((endpoint, index) => <div className="border rounded p-2 mb-3" key={endpoint.uid || index}>
        <OperationField label="Serviço" required value={endpoint.service} onChange={event => endpointChange(index, { service: event.target.value })} /><OperationField label="Destino" required value={endpoint.destination} onChange={event => endpointChange(index, { destination: event.target.value })} /><Form.Check id={`recipient-endpoint-${index}`} label="Destino ativo" checked={endpoint.active} onChange={event => endpointChange(index, { active: event.target.checked })} /><Button type="button" variant="outline-danger" size="sm" className="mt-2" onClick={() => setForm({ ...form, endpoints: form.endpoints.filter((_, i) => i !== index) })}>Remover destino</Button>
      </div>)}<Button type="button" variant="outline-secondary" className="mb-3" onClick={() => setForm({ ...form, endpoints: [...form.endpoints, { service: 'email', destination: '', active: true }] })}>Adicionar destino</Button>
      <details><summary className="mb-3">Vínculos de destino</summary><OperationField label="Organizações (JSON)" multiline required {...field('organization_bindings')} /><OperationField label="Entidades (JSON)" multiline required {...field('entity_bindings')} /><OperationField label="Ativos (JSON)" multiline required {...field('asset_bindings')} /></details>
    </fieldset></FormDrawer>}
    {remove && <FormDrawer show title="Desativar destinatário" submitLabel="Desativar" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setRemove(null); }} onSubmit={event => { event.preventDefault(); void action.run(signal => deleteNotificationRecipient({ ...args, uid: remove.uid, signal }), complete, deny); }}><p>Desativar “{remove.name}”? O histórico de entregas será preservado.</p></FormDrawer>}
  </>;
}
