'use client';

import { useRef, useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import DataTable from './DataTable';
import FormModal from './FormModal';
import { useOperationalAction } from './OperationalUi';
import { usePagedList } from '@/hooks/usePagedList';
import { sendActivationInvitation } from '@/lib/api/endpoints/organizations';
import { listDisabledOrganizationUsers } from '@/lib/api/endpoints/users';
import { isActivationCandidate } from '@/lib/domain/activation';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function ActivationInvitations({ organizationUid }) {
  const { token } = useSession();
  const [target, setTarget] = useState(null);
  const [queued, setQueued] = useState(null);
  const intention = useRef(null);
  const action = useOperationalAction();
  const list = usePagedList(listDisabledOrganizationUsers, { params: { organizationUid }, pageSize: 20 });
  const rows = list.loading || list.error ? [] : list.items.filter(user => isActivationCandidate(user, organizationUid));
  const columns = [
    { key: 'name', label: 'Administrador', render: user => user.name || user.login },
    { key: 'email', label: 'E-mail' },
    { key: 'invitation', label: 'Convite', render: user => (
      <Button size="sm" variant="outline-primary" onClick={() => {
        action.clearError();
        setTarget(user);
      }}>{queued?.uid === user.uid ? 'Reenviar convite' : 'Enviar convite'}</Button>
    ) }
  ];

  function send(event) {
    event.preventDefault();
    if (!target || !rows.some(user => user.uid === target.uid)) return;
    void action.run(signal => {
      const adminUid = target.uid;
      const idempotencyKey = intentKey(intention, 'activation-invitation', { organizationUid, adminUid });
      return sendActivationInvitation({ token, organizationUid, adminUid, idempotencyKey, signal });
    }, () => {
      intention.current = null;
      setQueued(target);
      setTarget(null);
      void list.refresh();
    });
  }

  return <Card className="panel mt-3">
    <Card.Body>
      <h5 className="mb-3">Convites de primeiro acesso</h5>
      {queued && <Alert variant="success">Convite enfileirado para {queued.email}.</Alert>}
      <DataTable columns={columns} rows={rows} loading={list.loading} error={list.error}
        emptyMessage="Nenhum administrador elegível nesta página."
        pagination={{ page: list.page, pageCount: list.pageCount, total: list.total, onPage: list.goToPage }} />
      {target && <FormModal show title="Enviar convite de primeiro acesso" onHide={() => setTarget(null)}
        onSubmit={send} error={action.error} submitting={action.busy} submitLabel="Enviar convite">
        <p>O link será enviado para <strong>{target.email}</strong>.</p>
        <p className="mb-0">Se houver um convite anterior, o envio substituirá o link.</p>
      </FormModal>}
    </Card.Body>
  </Card>;
}
