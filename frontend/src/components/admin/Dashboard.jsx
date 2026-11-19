'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Alert, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { getDashboardTotal } from '@/lib/api/endpoints/dashboard';
import { errorMessage } from '@/lib/api/errors';
import { canAccessPath } from '@/lib/navigation/access';
import { useSession } from '@/lib/session/SessionContext';

const metrics = {
  overview: [
    ['assets', 'Ativos', '/frota'], ['entities', 'Entidades', '/entidades'],
    ['devices', 'Dispositivos ativos', '/devices-sim', 'devices'], ['simcards', 'SIM cards', '/devices-sim', 'simcards'],
    ['occurrences', 'Ocorrências de eventos', '/eventos'], ['documents', 'Documentos GED', '/documentos']
  ],
  operations: [
    ['workPending', 'Ordens de serviço pendentes', '/ordens-servico'],
    ['workCompleted', 'Ordens de serviço concluídas', '/ordens-servico'],
    ['maintenance', 'Ordens de manutenção', '/manutencao'], ['agenda', 'Registros na agenda', '/agenda']
  ],
  finance: [
    ['entries', 'Lançamentos', '/billing'], ['statements', 'Demonstrativos', '/billing'],
    ['plans', 'Planos de cobrança', '/planos']
  ]
};
const titles = { overview: 'Visão geral', operations: 'Operações', finance: 'Financeiro' };
const number = new Intl.NumberFormat('pt-BR');

export default function Dashboard({ section }) {
  const { token, selectedOrganizationUid, areaAccess } = useSession();
  const [refresh, setRefresh] = useState(0);
  const financial = section === 'finance';
  const visible = metrics[section].filter(([, , href, area]) =>
    canAccessPath(href, areaAccess) && (!area || areaAccess.areas?.[area] === 'allowed')
  );

  return <>
    <PageBreadcrumb title={titles[section]} subTitle1="Painéis" />
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <p className="text-body-secondary mb-0">{financial
        ? 'Totais financeiros das contas acessíveis pela sessão.'
        : 'Totais da organização selecionada, conforme o acesso da sessão.'}</p>
      {visible.length > 0 && <Button variant="outline-secondary" onClick={() => setRefresh(value => value + 1)}>Atualizar indicadores</Button>}
    </div>
    {visible.length === 0 && <Alert variant="info">Nenhum indicador disponível para seu contexto de acesso.</Alert>}
    <Row className="g-3">
      {visible.map(([source, label, href]) => <Col key={source} xs={12} md={6} xl={4}>
        <DashboardMetric source={source} label={label} href={href} token={token}
          organizationUid={financial ? undefined : selectedOrganizationUid} refresh={refresh} />
      </Col>)}
    </Row>
  </>;
}

function DashboardMetric({ source, label, href, token, organizationUid, refresh }) {
  const { data, loading, error } = useKnowledgeQuery(getDashboardTotal, { source, token, organizationUid, refresh });
  return <Card className="panel h-100">
    <Card.Body className="d-flex flex-column gap-2">
      <h2 className="h6 mb-0">{label}</h2>
      {loading ? <Spinner animation="border" size="sm" role="status" aria-label={`Carregando ${label}`} />
        : error ? <p className="small mb-0 text-body-secondary" role="status">{errorMessage(error)}</p>
          : <p className="fs-2 mb-0">{data == null ? '—' : number.format(data)}</p>}
      {!loading && !error && data == null && <p className="small text-body-secondary mb-0">Total indisponível para esta consulta.</p>}
      {!error && <Link href={href} className="small mt-auto">Abrir {label.toLocaleLowerCase('pt-BR')}</Link>}
    </Card.Body>
  </Card>;
}
