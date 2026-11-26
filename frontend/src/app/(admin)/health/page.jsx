'use client';

import { useCallback, useState } from 'react';
import { Alert, Badge, Button, Card, Table } from 'react-bootstrap';
import FormModal from '@/components/admin/FormModal';
import { OperationField } from '@/components/admin/OperationalUi';
import { PlatformPage, PlatformRead } from '@/components/admin/PlatformUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { getHealthDetails, getHealthReady } from '@/lib/api/endpoints/platform';
import { useSession } from '@/lib/session/SessionContext';

const healthStatus = {
  up: ['Operacional', 'success'],
  degraded: ['Degradado', 'warning'],
  down: ['Indisponível', 'danger'],
  disabled: ['Desabilitado', 'secondary']
};
const dependencyNames = {
  postgres_write: 'PostgreSQL de escrita',
  postgres_read: 'PostgreSQL de leitura',
  postgres_fipe_cache: 'Cache FIPE',
  postgres_knowledge: 'Knowledge Base',
  redis: 'Redis',
  redis_cache_api: 'Cache Redis da API',
  rabbitmq: 'RabbitMQ',
  redpanda: 'Redpanda'
};
const runtimeCounters = {
  hits: 'Acertos no cache',
  fallbacks: 'Consultas alternativas',
  strict_loads: 'Leituras estritas',
  primes: 'Sessões carregadas no cache',
  prime_failures: 'Falhas ao carregar sessões',
  access_revalidations: 'Revalidações de acesso'
};

function HealthBadge({ status }) {
  const [label, variant] = Object.hasOwn(healthStatus, status) ? healthStatus[status] : ['Não informado', 'secondary'];
  return <Badge bg={variant}>{label}</Badge>;
}

export default function Page() {
  return <PlatformPage title="Saúde da plataforma">{Health}</PlatformPage>;
}

function Health() {
  const { token } = useSession();
  const [revision, setRevision] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [diagnosticToken, setDiagnosticToken] = useState(null);
  const fetchDetails = useCallback(args => getHealthDetails({ ...args, diagnosticToken }), [diagnosticToken]);
  const query = useKnowledgeQuery(fetchDetails, { token, revision });
  const readiness = useKnowledgeQuery(getHealthReady, { token, revision });
  const refresh = () => setRevision(value => value + 1);

  return <>
    <div className="d-flex flex-wrap gap-2 mb-3">
      <Button variant="outline-secondary" onClick={refresh} disabled={query.loading}>Atualizar diagnóstico</Button>
      {([401, 403].includes(query.error?.status) || diagnosticToken) &&
        <Button variant="outline-secondary" onClick={() => setDialog(true)} disabled={query.loading}>Usar credencial de diagnóstico</Button>}
      {diagnosticToken && <Button variant="link" onClick={() => setDiagnosticToken(null)}>Voltar à credencial da sessão</Button>}
    </div>
    {dialog && <FormModal show title="Credencial de diagnóstico" submitLabel="Consultar" onHide={() => setDialog(false)} onSubmit={event => {
      event.preventDefault();
      const value = new FormData(event.currentTarget).get('diagnostic-token')?.trim();
      if (!value) return;
      setDiagnosticToken(value);
      setDialog(false);
      refresh();
    }}>
      <OperationField label="Token temporário com permissão health:read" name="diagnostic-token" type="password" autoComplete="off" required />
    </FormModal>}
    {readiness.data && <Alert variant={readiness.data.status === 200 ? 'success' : 'warning'}>
      Prontidão (readiness) <HealthBadge status={readiness.data.status === 200 ? 'up' : 'down'} />
      {readiness.data.body?.status && <span className="ms-2 text-muted small">({readiness.data.body.status})</span>}
    </Alert>}
    <PlatformRead query={query}>{health => <>
      <Alert variant={health.status === 'down' ? 'danger' : health.status === 'degraded' ? 'warning' : 'secondary'}>
        Estado da plataforma <HealthBadge status={health.status} />
      </Alert>
      <Card className="mb-3">
        <Card.Header>Dependências</Card.Header>
        <Table responsive className="mb-0">
          <thead><tr><th>Componente</th><th>Situação</th><th>Criticidade</th><th>Latência</th></tr></thead>
          <tbody>{Object.entries(health.dependencies || {}).map(([key, info]) => <tr key={key}>
            <th scope="row">{dependencyNames[key] || key}</th>
            <td><HealthBadge status={info?.status} /></td>
            <td>{info?.critical === true ? 'Crítica' : info?.critical === false ? 'Opcional' : '—'}</td>
            <td>{Number.isFinite(info?.latency_ms) ? `${info.latency_ms} ms` : '—'}</td>
          </tr>)}</tbody>
        </Table>
      </Card>
      {(typeof health.table_cache_ready === 'boolean' || typeof health.session_runtime_ready === 'boolean') && <Card className="mb-3">
        <Card.Header>Cache Redis</Card.Header>
        <Card.Body>
          {typeof health.table_cache_ready === 'boolean' && <p>Cache de catálogos <HealthBadge status={health.table_cache_ready ? 'up' : 'down'} /></p>}
          {typeof health.session_runtime_ready === 'boolean' && <p>Cache de sessões <HealthBadge status={health.session_runtime_ready ? 'up' : 'down'} /></p>}
          <dl className="row mb-0">{Object.entries(runtimeCounters).filter(([key]) => Number.isFinite(health.session_runtime_metrics?.[key])).map(([key, label]) =>
            <div className="col-sm-6 col-lg-4" key={key}><dt>{label}</dt><dd>{health.session_runtime_metrics[key].toLocaleString('pt-BR')}</dd></div>)}</dl>
        </Card.Body>
      </Card>}
    </>}</PlatformRead>
  </>;
}
