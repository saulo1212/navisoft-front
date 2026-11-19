'use client';

import { useRef, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { PlatformPage, PlatformRead } from '@/components/admin/PlatformUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import { enqueueFipeJob, getFipeJob, listFipeJobs } from '@/lib/api/endpoints/platform';
import { FIPE_SYNC_TYPES, FIPE_VEHICLE_TYPES, fipeSyncBody } from '@/lib/domain/platform';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

const jobLabels = { ...FIPE_SYNC_TYPES, valuation_refresh: 'Atualizar avaliação' };
const jobStatuses = { queued: 'Na fila', running: 'Em execução', succeeded: 'Concluída', failed: 'Falhou' };
const counters = {
  attempts: 'Tentativas', items_received: 'Recebidos', items_inserted: 'Incluídos',
  items_updated: 'Atualizados', items_unchanged: 'Sem alterações', items_failed: 'Falhas'
};
const formatDate = value => value ? new Date(value).toLocaleString('pt-BR') : '—';

export default function Page() {
  return <PlatformPage title="Sincronização FIPE">{FipeJobs}</PlatformPage>;
}

function FipeJobs() {
  const { token } = useSession();
  const jobs = useOffsetList(listFipeJobs, { limit: 25 });
  const [type, setType] = useState(null);
  const [uid, setUid] = useState(null);
  const [notice, setNotice] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const action = useOperationalAction();
  const intention = useRef(null);

  const submit = event => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    void action.run(signal => {
      const body = fipeSyncBody(form);
      return enqueueFipeJob({ token, signal, body, idempotencyKey: intentKey(intention, 'fipe-sync', body) });
    }, () => {
      setType(null);
      setNotice('Solicitação registrada. Acompanhe o andamento na lista.');
      jobs.refresh();
    }, () => {
      setType(null);
      setBlocked(true);
      jobs.refresh();
    });
  };

  return <>
    <div className="d-flex flex-wrap gap-2 mb-3">
      <Button disabled={jobs.total === null || jobs.loading || Boolean(jobs.error) || blocked} onClick={() => {
        intention.current = null;
        action.clearError();
        setNotice(null);
        setType('catalog_sync');
      }}>Solicitar sincronização</Button>
      <Button variant="outline-secondary" disabled={jobs.loading} onClick={jobs.refresh}>Atualizar tarefas</Button>
    </div>
    {notice && <Alert variant="success">{notice}</Alert>}
    {blocked && action.error && <Alert variant="warning">{action.error}</Alert>}
    <DataTable rows={jobs.items} loading={jobs.loading} error={jobs.error} hasMore={!jobs.loading && jobs.hasMore} onLoadMore={jobs.loadMore}
      emptyMessage="Nenhuma tarefa FIPE encontrada." columns={[
        { key: 'job_type', label: 'Tarefa', render: row => jobLabels[row.job_type] || row.job_type },
        { key: 'status', label: 'Situação', render: row => jobStatuses[row.status] || row.status },
        { key: 'created_at', label: 'Solicitada em', render: row => formatDate(row.created_at) },
        { key: 'details', label: 'Ações', render: row => <Button variant="link" onClick={() => setUid(row.uid)}>Detalhes</Button> }
      ]} />
    {type && <FormModal show title="Solicitar sincronização FIPE" submitLabel="Enfileirar" submitting={action.busy}
      error={action.error} onHide={() => setType(null)} onSubmit={submit}>
      <fieldset disabled={action.busy}>
        <Form.Group controlId="fipe-job-type" className="mb-3">
          <Form.Label>Tipo de tarefa</Form.Label>
          <Form.Select name="job_type" value={type} onChange={event => setType(event.target.value)}>
            {Object.entries(FIPE_SYNC_TYPES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Form.Select>
        </Form.Group>
        {type === 'variant_refresh' && <>
          <Form.Group controlId="fipe-vehicle-type" className="mb-3">
            <Form.Label>Categoria de veículo</Form.Label>
            <Form.Select name="vehicle_type">
              {Object.entries(FIPE_VEHICLE_TYPES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Form.Select>
          </Form.Group>
          <OperationField name="source_brand_code" label="Código FIPE da marca" required />
          <OperationField name="source_model_code" label="Código FIPE do modelo" required />
          <OperationField name="model_year" label="Ano do modelo" type="number" min="1" step="1" required />
          <OperationField name="fuel_code" label="Código FIPE do combustível" type="number" min="1" step="1" required />
        </>}
      </fieldset>
    </FormModal>}
    {uid && <JobDetail token={token} uid={uid} onHide={() => setUid(null)} />}
  </>;
}

function JobDetail({ token, uid, onHide }) {
  const [revision, setRevision] = useState(0);
  const query = useKnowledgeQuery(getFipeJob, { token, uid, revision });
  return <Modal show centered scrollable onHide={onHide} aria-labelledby="fipe-job-detail-title">
    <Modal.Header closeButton closeLabel="Fechar"><Modal.Title id="fipe-job-detail-title">Detalhes da tarefa FIPE</Modal.Title></Modal.Header>
    <Modal.Body>
      <PlatformRead query={query}>{result => {
        const job = result.item ?? result;
        return <>
          <dl className="row">
            <dt className="col-5">Tarefa</dt><dd className="col-7">{jobLabels[job.job_type] || job.job_type}</dd>
            <dt className="col-5">Situação</dt><dd className="col-7">{jobStatuses[job.status] || job.status}</dd>
            <dt className="col-5">Início</dt><dd className="col-7">{formatDate(job.started_at)}</dd>
            <dt className="col-5">Conclusão</dt><dd className="col-7">{formatDate(job.finished_at)}</dd>
            {Object.entries(counters).filter(([key]) => Number.isFinite(job[key])).map(([key, label]) => <div className="d-flex" key={key}>
              <dt className="col-5">{label}</dt><dd className="col-7">{job[key]}</dd>
            </div>)}
          </dl>
          {job.last_error && <Alert variant="warning">{job.last_error}</Alert>}
        </>;
      }}</PlatformRead>
    </Modal.Body>
    <Modal.Footer><Button variant="outline-secondary" disabled={query.loading} onClick={() => setRevision(value => value + 1)}>Atualizar</Button></Modal.Footer>
  </Modal>;
}
