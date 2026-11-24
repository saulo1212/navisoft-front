'use client';

import { useState } from 'react';
import { Alert, Button, Offcanvas } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import { useAdminProfile } from '@/components/admin/AdminReferenceFields';
import { EventSignalMappings, EventTechnicalMaps } from '@/components/admin/EventTechnicalConfiguration';
import EventNotificationNavigation from '@/components/admin/EventNotificationNavigation';
import ListToolbar from '@/components/admin/ListToolbar';
import { OperationalGate, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { getEventModel, listEventFields, listEventModels } from '@/lib/api/endpoints/events';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="events"><Models /></OperationalGate>; }
function Models() {
  const { token } = useSession();
  const canWriteSignals = useAdminProfile() === 'primary_admin';
  const list = useOffsetList(listEventModels);
  const fields = useOffsetList(listEventFields);
  const action = useOperationalAction();
  const [detail, setDetail] = useState(null);
  return <>
    <PageBreadcrumb title="Tipos de evento" subTitle1="Operação" /><EventNotificationNavigation />
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar modelo por nome..." />
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[
      { key: 'name', label: 'Nome', render: row => <Button variant="link" disabled={action.busy} onClick={() => { action.clearError(); void action.run(signal => getEventModel({ token, uid: row.uid, signal }), result => setDetail(result.item ?? result), () => setDetail(null)); }}>{row.name}</Button> },
      { key: 'code', label: 'Código' }, { key: 'category', label: 'Categoria' }, { key: 'kind', label: 'Aplicação', render: row => row.periodic ? 'Periódico' : row.activation_only ? 'Ativação' : row.fixed ? 'Fixo' : 'Regra operacional' }, { key: 'active', label: 'Ativo', render: row => row.active ? 'Sim' : 'Não' }
    ]} />
    <h5 className="mt-4">Campos disponíveis para condições</h5>
    <DataTable rows={fields.items} rowKey={row => row.code} loading={fields.loading} error={fields.error} hasMore={!fields.loading && fields.hasMore} onLoadMore={fields.loadMore} columns={[{ key: 'name', label: 'Campo' }, { key: 'code', label: 'Código' }, { key: 'value_type', label: 'Tipo' }, { key: 'operators', label: 'Operadores', render: row => row.operators?.join(', ') }, { key: 'units', label: 'Unidades', render: row => row.units?.join(', ') || '—' }]} />
    <EventTechnicalMaps />
    <Offcanvas show={!!detail} onHide={() => setDetail(null)} placement="end">
      <Offcanvas.Header closeButton><Offcanvas.Title>{detail?.name}</Offcanvas.Title></Offcanvas.Header>
      <Offcanvas.Body>{detail && <>
        <p>Código {detail.code}</p><p>Categoria {detail.category}</p>
        <h6>Parâmetros permitidos</h6><pre className="text-wrap">{JSON.stringify(detail.allowed_parameters || {}, null, 2)}</pre>
        <h6>Valores padrão</h6><pre className="text-wrap">{JSON.stringify(detail.defaults || {}, null, 2)}</pre>
        <EventSignalMappings key={detail.uid} uid={detail.uid} canWrite={canWriteSignals} />
      </>}</Offcanvas.Body>
    </Offcanvas>
  </>;
}
