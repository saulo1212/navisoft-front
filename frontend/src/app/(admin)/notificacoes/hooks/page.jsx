'use client';

import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import EventNotificationNavigation from '@/components/admin/EventNotificationNavigation';
import FormModal from '@/components/admin/FormModal';
import { OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { getNotificationHook, listNotificationHooks, updateNotificationHook } from '@/lib/api/endpoints/notifications';
import { notificationHookBody } from '@/lib/domain/eventsNotifications';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="notifications"><Hooks /></OperationalGate>; }
function Hooks() {
  const { token, selectedOrganizationUid } = useSession();
  const list = useOffsetList(listNotificationHooks, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const [form, setForm] = useState(null);
  const [notice, setNotice] = useState(null);
  const args = { token, organizationUid: selectedOrganizationUid, code: 'organizations.insert' };
  const deny = () => { setForm(null); list.setItems([]); };
  const open = () => {
    action.clearError(); setNotice(null);
    void action.run(signal => getNotificationHook({ ...args, signal }), result => { const hook = result.item ?? result; setForm({ active: hook.active === true, payload: JSON.stringify(hook.payload || {}, null, 2), scope: hook.scope, version: hook.version }); }, deny);
  };
  const save = event => {
    event.preventDefault();
    void action.run(signal => updateNotificationHook({ ...args, body: notificationHookBody(form), signal }), () => { setForm(null); setNotice('Automação salva para a organização selecionada.'); list.refresh(); }, deny);
  };
  return <>
    <PageBreadcrumb title="Automações de notificações" subTitle1="Operação" /><EventNotificationNavigation notifications />
    <p>Configure o conteúdo e a ativação das notificações automáticas da organização.</p>
    {notice && <Alert variant="success">{notice}</Alert>}{action.error && !form && <Alert variant="danger">{action.error}</Alert>}
    <div className="d-flex gap-2 mb-3"><Button disabled={action.busy} onClick={open}>Configurar criação de organização</Button><Button variant="outline-secondary" disabled={list.loading || action.busy} onClick={list.refresh}>Atualizar</Button></div>
    <DataTable rows={list.items} rowKey={row => row.uid || row.code} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[{ key: 'code', label: 'Automação' }, { key: 'scope', label: 'Origem', render: row => row.scope === 'default' ? 'Padrão herdado' : 'Organização' }, { key: 'version', label: 'Versão' }, { key: 'active', label: 'Ativa', render: row => row.active ? 'Sim' : 'Não' }]} />
    {form && <FormModal show title="Criação de organização" submitting={action.busy} error={action.error} submitLabel="Salvar para esta organização" onSubmit={save} onHide={() => { if (!action.busy) setForm(null); }}><fieldset disabled={action.busy}>
      <p>Configuração atual: {form.scope === 'default' ? 'padrão herdado' : 'organização'} · versão {form.version}.</p><p>Salvar define uma configuração própria para a organização selecionada.</p>
      <Form.Check id="notification-hook-active" label="Automação ativa" checked={form.active} onChange={event => setForm({ ...form, active: event.target.checked })} className="mb-3" />
      <OperationField multiline label="Conteúdo e destinatários (JSON)" required value={form.payload} onChange={event => setForm({ ...form, payload: event.target.value })} />
      <p className="small text-muted">Preserve as ações e os campos que deseja manter. Campos do contexto, como {'{{ organization.name }}'}, são resolvidos no momento da notificação.</p>
    </fieldset></FormModal>}
  </>;
}
