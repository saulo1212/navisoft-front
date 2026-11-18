'use client';

import { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import EventNotificationNavigation from '@/components/admin/EventNotificationNavigation';
import { OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { getNotificationDelivery, getNotifyIntegrationStatus } from '@/lib/api/endpoints/notifications';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="notifications"><Deliveries /></OperationalGate>; }
function Deliveries() {
  const { token, selectedOrganizationUid } = useSession();
  const action = useOperationalAction();
  const integrationAction = useOperationalAction();
  const [uid, setUid] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [integration, setIntegration] = useState(null);
  const args = { token, organizationUid: selectedOrganizationUid };
  const search = event => {
    event.preventDefault(); setDelivery(null); action.clearError();
    void action.run(signal => getNotificationDelivery({ ...args, uid: uid.trim(), signal }), result => setDelivery(result.item ?? result), () => setDelivery(null));
  };
  const date = value => value ? new Date(value).toLocaleString('pt-BR') : '—';
  return <>
    <PageBreadcrumb title="Entregas e integração" subTitle1="Notificações" /><EventNotificationNavigation notifications />
    <div className="card panel p-3 mb-3"><h5>Consultar entrega</h5><p>Informe o identificador de uma entrega para consultar o estado registrado no Core e no provedor.</p>
      <form onSubmit={search}><fieldset disabled={action.busy}><OperationField label="UUID da entrega" required value={uid} onChange={event => { setUid(event.target.value); setDelivery(null); }} /><Button type="submit">Consultar status</Button></fieldset></form>
      {action.error && <Alert className="mt-3" variant="danger">{action.error}</Alert>}
      {delivery && <dl className="row mt-3"><dt className="col-sm-4">Entrega</dt><dd className="col-sm-8 text-break">{delivery.uid}</dd><dt className="col-sm-4">Estado no Core</dt><dd className="col-sm-8">{delivery.status}</dd><dt className="col-sm-4">Estado no provedor</dt><dd className="col-sm-8">{typeof delivery.notify_status === 'string' ? delivery.notify_status : 'Não informado'}</dd><dt className="col-sm-4">Tentativas</dt><dd className="col-sm-8">{delivery.attempts}</dd><dt className="col-sm-4">Aceite</dt><dd className="col-sm-8">{date(delivery.submitted_at)}</dd><dt className="col-sm-4">Consulta ao provedor</dt><dd className="col-sm-8">{date(delivery.notify_status_checked_at)}</dd><dt className="col-sm-4">Supressão</dt><dd className="col-sm-8">{delivery.suppression_reason || '—'}</dd><dt className="col-sm-4">Código de resposta</dt><dd className="col-sm-8">{delivery.notify_response_code || delivery.http_status || '—'}</dd></dl>}
      <p className="small text-muted mt-3 mb-0">Aceite ou enfileiramento pelo provedor não confirma a entrega final ao destinatário.</p>
    </div>
    <div className="card panel p-3"><h5>Integração Autoscale Notifications</h5><p>Consulte a disponibilidade da credencial da organização. As entregas são acompanhadas pelo Core.</p><Button variant="outline-secondary" disabled={integrationAction.busy} onClick={() => { setIntegration(null); void integrationAction.run(signal => getNotifyIntegrationStatus({ ...args, signal }), result => setIntegration(result.items || []), () => setIntegration(null)); }}>Consultar integração</Button>
      {integrationAction.error && <Alert variant="danger" className="mt-3">{integrationAction.error}</Alert>}
      {integration && <div className="mt-3">{integration.length ? integration.map(item => <p key={item.uid}>{item.provider}: {item.enabled && !item.revoked_at ? 'Credencial habilitada' : 'Credencial desabilitada'} · atualizado em {date(item.updated_at)}</p>) : <p>Credencial não cadastrada.</p>}<p className="small text-muted">Uma credencial habilitada não comprova conectividade nem entrega de mensagens.</p></div>}
    </div>
  </>;
}
