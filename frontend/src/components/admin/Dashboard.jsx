'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Alert, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ApexChartClient from '@/components/client-wrappers/ApexChartClient';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { getDashboardTotals } from '@/lib/api/endpoints/dashboard';
import { errorMessage } from '@/lib/api/errors';
import { canAccessPath } from '@/lib/navigation/access';
import { useSession } from '@/lib/session/SessionContext';
import { getColor } from '@/utils/getColor';

const sections = {
  overview: {
    title: 'Visão geral',
    groups: [
      { title: 'Inventário', color: 'primary', metrics: [
        ['assets', 'Ativos', '/frota'], ['entities', 'Entidades', '/entidades'],
        ['devices', 'Dispositivos ativos', '/devices-sim', 'devices'], ['simcards', 'SIM cards', '/devices-sim', 'simcards']
      ] },
      { title: 'Eventos e documentos', color: 'info', metrics: [
        ['occurrences', 'Ocorrências de eventos', '/eventos'], ['documents', 'Documentos GED', '/documentos']
      ] }
    ]
  },
  operations: {
    title: 'Operações',
    groups: [
      { title: 'Ordens de serviço por situação', color: 'primary', metrics: [
        ['workPending', 'Pendentes', '/ordens-servico'],
        ['workCompleted', 'Concluídas', '/ordens-servico']
      ] },
      { title: 'Manutenção e agenda', color: 'warning', metrics: [
        ['maintenance', 'Ordens de manutenção', '/manutencao'], ['agenda', 'Registros na agenda', '/agenda']
      ] }
    ]
  },
  finance: {
    title: 'Financeiro',
    groups: [
      { title: 'Registros de cobrança', color: 'success', metrics: [
        ['entries', 'Lançamentos', '/billing'], ['statements', 'Demonstrativos', '/billing'],
        ['plans', 'Planos de cobrança', '/planos']
      ] }
    ]
  }
};
const number = new Intl.NumberFormat('pt-BR');

export default function Dashboard({ section }) {
  const { token, selectedOrganizationUid, areaAccess } = useSession();
  const [refresh, setRefresh] = useState(0);
  const financial = section === 'finance';
  const { title, groups } = sections[section];
  const visible = groups.map(group => ({
    ...group,
    metrics: group.metrics.filter(([, , href, area]) =>
      canAccessPath(href, areaAccess) && (!area || areaAccess.areas?.[area] === 'allowed')
    )
  })).filter(group => group.metrics.length);

  return <>
    <PageBreadcrumb title={title} subTitle1="Painéis" />
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <p className="text-body-secondary mb-0">{financial
        ? 'Totais financeiros das contas acessíveis pela sessão.'
        : 'Totais da organização selecionada, conforme o acesso da sessão.'}</p>
      {visible.length > 0 && <Button variant="outline-secondary" onClick={() => setRefresh(value => value + 1)}>Atualizar indicadores</Button>}
    </div>
    {visible.length === 0 && <Alert variant="info">Nenhum indicador disponível para seu contexto de acesso.</Alert>}
    <Row className="g-3">
      {visible.map(group => <Col key={group.title} xs={12} xl={visible.length > 1 ? 6 : 12}>
        <DashboardChart group={group} token={token} organizationUid={financial ? undefined : selectedOrganizationUid} refresh={refresh} />
      </Col>)}
    </Row>
  </>;
}

function DashboardChart({ group, token, organizationUid, refresh }) {
  const sources = group.metrics.map(([source]) => source);
  const { data, loading } = useKnowledgeQuery(getDashboardTotals, { sources, token, organizationUid, refresh });
  const rows = group.metrics.map(([source, label, href], index) => ({
    source, label, href, total: data?.[index]?.value, error: data?.[index]?.reason
  }));
  const points = rows.filter(row => row.total != null).map(row => ({ x: row.label, y: row.total }));
  const height = 250;
  const maximum = Math.max(0, ...points.map(point => point.y));

  function getOptions() {
    return {
      chart: { height, toolbar: { show: false }, animations: { enabled: false }, parentHeightOffset: 0 },
      colors: [getColor(group.color, 600) || '#3669bb'],
      plotOptions: { bar: { horizontal: true, barHeight: '46%', borderRadius: 4 } },
      dataLabels: { enabled: false },
      grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
      xaxis: {
        min: 0,
        max: maximum === 0 ? 1 : undefined,
        tickAmount: Math.max(1, Math.min(4, maximum)),
        decimalsInFloat: 0,
        labels: { formatter: value => number.format(value) },
        axisTicks: { show: false },
        axisBorder: { show: false }
      },
      yaxis: { labels: { maxWidth: 150 } },
      tooltip: { y: { formatter: value => number.format(value) } }
    };
  }

  return <Card className="panel h-100">
    <Card.Body>
      <h2 className="h5 mb-0">{group.title}</h2>
      {loading ? <div className="d-grid align-content-center justify-content-center" style={{ minHeight: height }}>
        <Spinner animation="border" role="status" aria-label={`Carregando ${group.title}`} />
      </div> : points.length > 0 ? (
        <div role="group" aria-label={`Gráfico de ${group.title}`} className="mt-2">
          <ApexChartClient type="bar" getOptions={getOptions} series={[{ name: 'Total', data: points }]} />
        </div>
      ) : <p className="text-body-secondary my-4" role="status">Nenhum total disponível para montar o gráfico.</p>}
      <ul className="list-unstyled mb-0 border-top">
        {rows.map(row => <li key={row.source} className="d-flex justify-content-between flex-wrap gap-1 border-bottom py-2">
          {row.error ? <span className="small">{row.label}</span> : <Link className="small" href={row.href}>{row.label}</Link>}
          <span className="small fw-medium">
            {loading ? '…' : row.error ? errorMessage(row.error) : row.total == null ? 'Total indisponível' : number.format(row.total)}
          </span>
        </li>)}
      </ul>
    </Card.Body>
  </Card>;
}
