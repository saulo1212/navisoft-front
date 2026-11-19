'use client';

import { useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { PlatformPage, PlatformRead } from '@/components/admin/PlatformUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import {
  getNotifyCredential, listOrganizationServices, listPlatformServices, replaceNotifyCredential, revokeNotifyCredential
} from '@/lib/api/endpoints/platform';
import { useSession } from '@/lib/session/SessionContext';

const serviceStatuses = { active: 'Ativo', suspended: 'Suspenso', disabled: 'Desabilitado' };
const serviceColumns = [{ key: 'code', label: 'Código' }, { key: 'name', label: 'Serviço' }];

export default function Page() {
  return <PlatformPage title="Integrações">{Integrations}</PlatformPage>;
}

function Integrations() {
  const { selectedOrganizationUid } = useSession();
  const services = useOffsetList(listPlatformServices);

  return <>
    <h2 className="h5">Catálogo de serviços</h2>
    <ServiceTable list={services} columns={[
      ...serviceColumns,
      { key: 'description', label: 'Descrição' },
      { key: 'active', label: 'Situação', render: row => row.active ? 'Ativo' : 'Inativo' }
    ]} />
    {selectedOrganizationUid
      ? <OrganizationIntegrations key={selectedOrganizationUid} organizationUid={selectedOrganizationUid} />
      : <Alert variant="info" className="mt-3">Selecione uma organização para consultar seus serviços e a integração de notificações.</Alert>}
  </>;
}

function ServiceTable({ list, columns }) {
  return <DataTable rows={list.items} error={list.error} loading={list.loading} hasMore={list.hasMore && !list.loading}
    onLoadMore={list.loadMore} columns={columns} emptyMessage="Nenhum serviço encontrado." />;
}

function OrganizationIntegrations({ organizationUid }) {
  const { token } = useSession();
  const services = useOffsetList(listOrganizationServices, { params: { organizationUid } });
  const [revision, setRevision] = useState(0);
  const query = useKnowledgeQuery(getNotifyCredential, { token, organizationUid, revision });
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const action = useOperationalAction();
  const refresh = () => setRevision(value => value + 1);

  const submit = event => {
    event.preventDefault();
    const credential = new FormData(event.currentTarget).get('credential')?.trim();
    const revoking = dialog === 'revoke';
    void action.run(signal => {
      const args = { token, signal, organizationUid };
      if (revoking) return revokeNotifyCredential(args);
      if (!credential) throw new Error('Informe a credencial da organização.');
      return replaceNotifyCredential({ ...args, credential });
    }, () => {
      setDialog(null);
      setNotice(revoking ? 'Credencial revogada.' : 'Credencial salva.');
      refresh();
    }, () => {
      setDialog(null);
      setBlocked(true);
      refresh();
    });
  };

  const open = next => {
    action.clearError();
    setNotice(null);
    setDialog(next);
  };

  return <>
    <h2 className="h5 mt-4">Serviços da organização selecionada</h2>
    <ServiceTable list={services} columns={[
      ...serviceColumns,
      { key: 'desired_status', label: 'Estado solicitado', render: row => serviceStatuses[row.desired_status] || row.desired_status },
      { key: 'version', label: 'Versão' }
    ]} />
    <Card className="mt-4">
      <Card.Header as="h2" className="h5">Autoscale Notifications</Card.Header>
      <Card.Body>
        {notice && <Alert variant="success">{notice}</Alert>}
        {blocked && action.error && <Alert variant="warning">{action.error}</Alert>}
        <PlatformRead query={query} onRetry={refresh}>{data => {
          const items = data.items || [];
          const active = items.find(item => item.enabled && !item.revoked_at);
          return <>
            <p>{active ? 'Credencial ativa.' : items.length ? 'Credencial revogada.' : 'Nenhuma credencial cadastrada.'}</p>
            <div className="d-flex flex-wrap gap-2">
              <Button disabled={blocked} onClick={() => open('replace')}>{active ? 'Substituir credencial' : 'Importar credencial'}</Button>
              {active && <Button disabled={blocked} variant="outline-danger" onClick={() => open('revoke')}>Revogar credencial</Button>}
            </div>
          </>;
        }}</PlatformRead>
      </Card.Body>
    </Card>
    {dialog && <FormModal show title={dialog === 'revoke' ? 'Revogar credencial' : 'Salvar credencial de notificações'}
      submitLabel={dialog === 'revoke' ? 'Revogar' : 'Salvar'} submitting={action.busy} error={action.error}
      onHide={() => setDialog(null)} onSubmit={submit}>
      {dialog === 'revoke'
        ? <p>A revogação interrompe o uso desta credencial para os envios da organização selecionada.</p>
        : <OperationField name="credential" type="password" label="Credencial emitida para esta organização" autoComplete="off" required disabled={action.busy} />}
    </FormModal>}
  </>;
}
