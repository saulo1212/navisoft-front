'use client';

import { useId, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import EventNotificationNavigation from '@/components/admin/EventNotificationNavigation';
import { OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { getEventOccurrence, listEventOccurrences, treatEventOccurrence } from '@/lib/api/endpoints/events';
import { occurrenceActionBody } from '@/lib/domain/eventsNotifications';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="event_occurrences"><Occurrences /></OperationalGate>; }
function Occurrences() {
  const { token, selectedOrganizationUid } = useSession();
  const list = useOffsetList(listEventOccurrences, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const detailTitleId = useId();
  const [detail, setDetail] = useState(null);
  const [treatment, setTreatment] = useState('acknowledge');
  const [text, setText] = useState('');
  const [notice, setNotice] = useState(null);
  const args = { token, organizationUid: selectedOrganizationUid };
  const deny = () => { setDetail(null); list.setItems([]); };
  const open = row => {
    setNotice(null); action.clearError();
    void action.run(signal => getEventOccurrence({ ...args, uid: row.uid, signal }), result => { setDetail(result.item ?? result); setTreatment('acknowledge'); setText(''); }, deny);
  };
  const save = event => {
    event.preventDefault();
    void action.run(async signal => {
      await treatEventOccurrence({ ...args, uid: detail.uid, body: occurrenceActionBody(treatment, text), signal });
      return getEventOccurrence({ ...args, uid: detail.uid, signal });
    }, result => { setDetail(result.item ?? result); setText(''); setNotice('Tratamento registrado.'); list.refresh(); }, deny);
  };
  return <>
    <PageBreadcrumb title="Ocorrências de eventos" subTitle1="Operação" /><EventNotificationNavigation />
    <p>Consulte os eventos recebidos e registre o atendimento. Reconheça a ocorrência antes de encerrá-la.</p>
    {action.error && <Alert variant="danger">{action.error}</Alert>}{notice && <Alert variant="success">{notice}</Alert>}
    <Button className="mb-3" variant="outline-secondary" disabled={list.loading || action.busy} onClick={list.refresh}>Atualizar ocorrências</Button>
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} emptyMessage="Nenhuma ocorrência disponível nesta organização." columns={[
      { key: 'event', label: 'Evento', render: row => <Button variant="link" disabled={action.busy} onClick={() => open(row)}>{row.model_name || row.event_name || row.model_code || row.uid}</Button> },
      { key: 'asset', label: 'Ativo', render: row => row.asset_identification || row.uid_asset || '—' },
      { key: 'status', label: 'Situação', render: row => row.status || row.state || '—' },
      { key: 'occurred_at', label: 'Data', render: row => row.occurred_at ? new Date(row.occurred_at).toLocaleString('pt-BR') : '—' }
    ]} />
    <Modal
      show={!!detail}
      onHide={action.busy ? undefined : () => setDetail(null)}
      aria-labelledby={detailTitleId}
      centered
      scrollable
      backdrop="static"
      keyboard={!action.busy}
    >
      <Modal.Header closeButton={!action.busy} closeLabel="Fechar">
        <Modal.Title id={detailTitleId} className="fs-5">Atendimento da ocorrência</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {detail && <>
          <p>{detail.model_name || detail.model_code || detail.uid}</p><p>Ativo: {detail.asset_identification || detail.uid_asset || '—'}</p><p>Situação: {detail.status || detail.state || '—'}</p>
          {detail.notes && <pre className="text-wrap">{typeof detail.notes === 'string' ? detail.notes : JSON.stringify(detail.notes, null, 2)}</pre>}
          {action.error && <Alert variant="danger">{action.error}</Alert>}{notice && <Alert variant="success">{notice}</Alert>}
          <form onSubmit={save}><fieldset disabled={action.busy || ['closed', 'resolved'].includes(detail.status || detail.state)}>
            <Form.Group controlId="occurrence-action" className="mb-3"><Form.Label>Ação</Form.Label><Form.Select value={treatment} onChange={event => { setTreatment(event.target.value); setText(''); }}><option value="acknowledge">Reconhecer</option><option value="note">Adicionar anotação</option><option value="close">Encerrar</option></Form.Select></Form.Group>
            {treatment !== 'acknowledge' && <OperationField multiline label={treatment === 'close' ? 'Resolução' : 'Anotação'} required value={text} onChange={event => setText(event.target.value)} />}
            <Button type="submit">Confirmar tratamento</Button>
          </fieldset></form>
        </>}
      </Modal.Body>
    </Modal>
  </>;
}
