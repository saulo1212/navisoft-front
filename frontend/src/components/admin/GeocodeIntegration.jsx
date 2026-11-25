'use client';

import { useId, useRef, useState } from 'react';
import { Alert, Button, Card, Form, Modal } from 'react-bootstrap';
import DataTable from './DataTable';
import FormModal from './FormModal';
import { OperationField, useOperationalAction } from './OperationalUi';
import { PlatformRead } from './PlatformUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { usePagedList } from '@/hooks/usePagedList';
import { createGeocodeToken, getGeocodeService, listGeocodeTokens, revokeGeocodeToken, setGeocodeService, updateGeocodeTokenLimit } from '@/lib/api/endpoints/platform';
import { geocodeDesiredStatus, geocodeRateLimit, geocodeTokenBody, SERVICE_STATUSES } from '@/lib/domain/platform';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

const stateLabel = status => SERVICE_STATUSES[status] || status || 'Sem configuração';
const dateLabel = value => value ? new Date(value).toLocaleString('pt-BR') : '—';
const tokenActive = row => row.active === true && !row.revoked_at;
const titles = { service: 'Alterar estado do Geocode', create: 'Emitir token Geocode', limit: 'Alterar limite do token', revoke: 'Revogar token Geocode' };
const confirmations = { create: 'Emitir token', revoke: 'Revogar token' };
const successMessages = { service: 'Estado solicitado atualizado.', create: 'Token emitido.', limit: 'Limite atualizado.', revoke: 'Token revogado.' };

export default function GeocodeIntegration({ organizationUid, onServiceChange }) {
  const { token } = useSession();
  const [dialog, setDialog] = useState(null);
  const [secret, setSecret] = useState(null);
  const [notice, setNotice] = useState(null);
  const [revision, setRevision] = useState(0);
  const intent = useRef(null);
  const action = useOperationalAction();
  const requestScope = { token, organizationUid };
  const serviceQuery = useKnowledgeQuery(getGeocodeService, { ...requestScope, revision });
  const tokens = usePagedList(listGeocodeTokens, { params: { organizationUid }, pageSize: 20 });
  const service = serviceQuery.data?.service;
  const refreshService = () => setRevision(value => value + 1);
  const open = (kind, row) => {
    action.clearError();
    setNotice(null);
    setDialog({ kind, row });
  };

  function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const { kind, row } = dialog;
    void action.run(signal => {
      const args = { ...requestScope, signal };
      if (kind === 'service') return setGeocodeService({ ...args, desiredStatus: geocodeDesiredStatus(fields.desired_status) });
      if (kind === 'limit') return updateGeocodeTokenLimit({ ...args, uid: row.uid, rateLimit: geocodeRateLimit(fields.rate_limit_rps) });
      if (kind === 'revoke') return revokeGeocodeToken({ ...args, uid: row.uid });
      const body = geocodeTokenBody(fields);
      return createGeocodeToken({ ...args, body, idempotencyKey: intentKey(intent, 'emitir token Geocode', body) });
    }, result => {
      if (kind === 'create') {
        intent.current = null;
        if (typeof result?.token === 'string' && result.token) setSecret(result.token);
      }
      setDialog(null);
      setNotice(successMessages[kind]);
      refreshService();
      onServiceChange();
      if (kind !== 'service') {
        if (kind === 'create' && tokens.page !== 1) tokens.goToPage(1);
        else void tokens.refresh();
      }
    });
  }

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'token_hint', label: 'Identificador parcial', render: row => <code>{row.token_hint || '—'}</code> },
    { key: 'active', label: 'Situação', render: row => row.revoked_at ? 'Revogado' : tokenActive(row) ? 'Ativo' : 'Inativo' },
    { key: 'rate_limit_rps', label: 'Requisições por segundo' },
    { key: 'last_used_at', label: 'Último uso', render: row => dateLabel(row.last_used_at) },
    { key: 'actions', label: 'Ações', render: row => tokenActive(row) && <div className="d-flex flex-wrap gap-1">
      <Button size="sm" variant="outline-secondary" onClick={() => open('limit', row)}>Alterar limite</Button>
      <Button size="sm" variant="outline-danger" onClick={() => open('revoke', row)}>Revogar</Button>
    </div> }
  ];

  return <Card className="mt-4">
    <Card.Header as="h2" className="h5">Geocode</Card.Header>
    <Card.Body>
      {notice && <Alert variant="success">{notice}</Alert>}
      <PlatformRead query={serviceQuery} onRetry={refreshService}>{() => <>
        <dl className="row mb-3">
          <dt className="col-sm-4">Estado solicitado</dt><dd className="col-sm-8">{stateLabel(service?.desired_status)}</dd>
          <dt className="col-sm-4">Versão da configuração</dt><dd className="col-sm-8">{service?.version ?? '—'}</dd>
          <dt className="col-sm-4">Aplicação no Geocode</dt>
          <dd className="col-sm-8">{service?.effective_status ? stateLabel(service.effective_status) : 'A API não informa o estado efetivo.'}</dd>
        </dl>
        <Button size="sm" variant="outline-primary" onClick={() => open('service')}>Alterar estado</Button>
      </>}</PlatformRead>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4 mb-2">
        <h3 className="h6 mb-0">Tokens de acesso</h3>
        {service?.desired_status === 'active' && !tokens.loading && !tokens.error &&
          <Button size="sm" onClick={() => open('create')}>Emitir token</Button>}
      </div>
      <DataTable columns={columns} rows={tokens.loading || tokens.error ? [] : tokens.items} loading={tokens.loading} error={tokens.error}
        emptyMessage="Nenhum token cadastrado."
        pagination={{ page: tokens.page, pageCount: tokens.pageCount, total: tokens.total, onPage: tokens.goToPage }} />
      {tokens.error && <Button variant="outline-secondary" size="sm" className="mt-2" onClick={() => void tokens.refresh()}>Tentar carregar tokens novamente</Button>}
    </Card.Body>
    {dialog && <FormModal show title={titles[dialog.kind]} submitLabel={confirmations[dialog.kind] || 'Salvar'}
      submitting={action.busy} error={action.error} onSubmit={submit} onHide={() => setDialog(null)}>
      {dialog.kind === 'service' &&
        <Form.Group controlId="geocode-desired-status">
          <Form.Label>Estado solicitado</Form.Label>
          <Form.Select name="desired_status" required defaultValue={service?.desired_status || ''} disabled={action.busy}>
            <option value="">Selecione um estado</option>
            {Object.entries(SERVICE_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Form.Select>
        </Form.Group>}
      {dialog.kind === 'create' && <OperationField label="Nome do token" name="name" required disabled={action.busy} />}
      {['create', 'limit'].includes(dialog.kind) &&
        <OperationField label="Limite de requisições por segundo" name="rate_limit_rps" type="number"
          min="1" step="1" defaultValue={dialog.row?.rate_limit_rps ?? ''} required disabled={action.busy} />}
      {dialog.kind === 'revoke' && <p>Revogar o token <strong>{dialog.row.name}</strong> impede seu uso após a aplicação da configuração.</p>}
    </FormModal>}
    {secret && <IssuedToken value={secret} onClose={() => setSecret(null)} />}
  </Card>;
}

function IssuedToken({ value, onClose }) {
  const titleId = useId();
  const fieldId = useId();
  return <Modal show centered aria-labelledby={titleId} onHide={onClose} backdrop="static">
    <Modal.Header closeButton closeLabel="Fechar"><Modal.Title id={titleId} className="h5">Token Geocode emitido</Modal.Title></Modal.Header>
    <Modal.Body>
      <p>Copie o token antes de fechar. A lista exibe apenas o identificador parcial.</p>
      <Form.Label htmlFor={fieldId}>Token</Form.Label>
      <Form.Control id={fieldId} as="textarea" rows={3} value={value} className="font-monospace" readOnly autoComplete="off" spellCheck={false} />
    </Modal.Body>
    <Modal.Footer><Button onClick={onClose}>Concluir</Button></Modal.Footer>
  </Modal>;
}
