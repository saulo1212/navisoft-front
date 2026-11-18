'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, ButtonGroup, Form, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import ListToolbar from '@/components/admin/ListToolbar';
import { operationError, useOperationalAction } from '@/components/admin/OperationalUi';
import ApexChart from '@/components/client-wrappers/ApexChartClient';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createReport, downloadReport, getReport, getReportDefinition, searchReport, searchReportHistory } from '@/lib/api/endpoints/reports';
import { definitionColumns, reportBuckets, reportDomains, reportFieldLabel, reportIsPending, reportSelection, reportStatuses } from '@/lib/domain/reports';
import { intentKey, UUID_PATTERN } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

const operators = { eq: 'Igual a', in: 'Está na lista', prefix: 'Começa com', contains: 'Contém', gte: 'A partir de', lt: 'Anterior a' };
const reportStatus = value => reportStatuses[value] ?? value;
const reportName = row => row.report_name || row.report_code;
const formatDate = value => value ? new Date(value).toLocaleString('pt-BR') : '—';

export default function ReportsPage() {
  const { token, selectedOrganizationUid, areaAccess } = useSession();
  if (areaAccess?.status !== 'evaluated') return <Alert variant="warning">Aguarde a avaliação do acesso.</Alert>;
  return <Reports key={`${token}:${selectedOrganizationUid}:${JSON.stringify(areaAccess)}`} token={token} organizationUid={selectedOrganizationUid} />;
}

function Reports({ token, organizationUid }) {
  const [view, setView] = useState('organizations');
  const [active, setActive] = useState(null);
  const [historyRevision, setHistoryRevision] = useState(0);
  const reloadHistory = () => setHistoryRevision(value => value + 1);
  const open = (uid, context) => {
    setActive({ uid, organizationUid: context });
    setView('history');
  };
  const showCreated = (result, context) => {
    reloadHistory();
    open(result.uid, result.uid_organization || context);
  };
  return <>
    <PageBreadcrumb title="Relatórios" subTitle1="Comercial & Financeiro" />
    <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
      <ButtonGroup aria-label="Relatórios por domínio" className="flex-wrap">
        {Object.entries(reportDomains).map(([key, { label }]) => <Button key={key} aria-pressed={view === key}
          variant={view === key ? 'primary' : 'outline-primary'} onClick={() => setView(key)}>{label}</Button>)}
        <Button aria-pressed={view === 'history'} variant={view === 'history' ? 'primary' : 'outline-primary'} onClick={() => setView('history')}>Histórico</Button>
      </ButtonGroup>
      <Link className="btn btn-outline-secondary" href="/relatorios/agendamentos">Agendamentos</Link>
    </div>
    {view === 'history' ? <>
      {active && <ReportDetail key={`${active.uid}:${active.organizationUid ?? ''}`} token={token} {...active}
        onClose={() => setActive(null)} onFinished={reloadHistory} onCreated={showCreated} />}
      <History revision={historyRevision} organizationUid={organizationUid} onOpen={open} />
    </> : <ReportDefinition key={view} domain={view} token={token} organizationUid={organizationUid}
      onCreated={result => showCreated(result, view === 'assets' ? organizationUid : undefined)} />}
  </>;
}

function ReportDefinition({ domain, token, organizationUid, onCreated }) {
  const { data, loading, error } = useKnowledgeQuery(getReportDefinition, { token, domain });
  if (loading) return <Spinner size="sm" role="status" aria-label="Carregando definição" />;
  if (error) return <Alert variant="danger">{operationError(error)}</Alert>;
  return data ? <ReportEditor definition={data} domain={domain} token={token} organizationUid={organizationUid} onCreated={onCreated} /> : null;
}

function ReportEditor({ definition, domain, token, organizationUid, onCreated }) {
  const [selected, setSelected] = useState(definition.default_columns);
  const [filterName, setFilterName] = useState('');
  const [scopedEntities, setScopedEntities] = useState(true);
  const [request, setRequest] = useState(null);
  const [offset, setOffset] = useState(0);
  const [inputError, setInputError] = useState(null);
  const [viewChart, setViewChart] = useState(false);
  const [sequence, setSequence] = useState(0);
  const action = useOperationalAction();
  const intention = useRef(null);
  const limit = definition.pagination.default_limit;
  const query = useKnowledgeQuery(searchReport, { token, domain, organizationUid, definition, selection: request, limit, offset, sequence }, Boolean(request));
  const availableFilters = definition.filters.filter(filter => filter.name !== 'uid_organization' || (domain === 'entities' && !scopedEntities));
  const filter = availableFilters.find(option => option.name === filterName);

  const submit = event => {
    event.preventDefault();
    setInputError(null);
    action.clearError();
    const form = new FormData(event.currentTarget);
    const exporting = event.nativeEvent.submitter?.value === 'export';
    let selection;
    try {
      const filters = [];
      if (domain === 'entities' && scopedEntities) filters.push({ field: 'uid_organization', operator: 'eq', value: organizationUid });
      if (filter) {
        const operator = form.get('operator');
        const raw = String(form.get('filterValue')).trim();
        const value = operator === 'in' ? raw.split(',').map(item => item.trim()).filter(Boolean) : raw;
        if (!value.length) throw new Error('Informe um valor para o filtro.');
        filters.push({ field: filter.name, operator, value });
      }
      selection = reportSelection(definition, {
        columns: selected, q: String(form.get('q')), includeInactive: form.has('inactive'), sortField: form.get('sort'),
        sortDirection: form.get('direction'), filters
      });
    } catch (error) {
      setInputError(operationError(error));
      return;
    }
    if (exporting) {
      const format = form.get('format');
      const idempotencyKey = intentKey(intention, `export-${domain}`, { selection, format });
      void action.run(signal => createReport({ token, signal, domain, organizationUid, definition, selection, format, idempotencyKey }), result => {
        intention.current = null;
        onCreated(result);
      });
      return;
    }
    setOffset(0);
    setSequence(value => value + 1);
    setRequest(selection);
  };

  return <>
    <Form className="card panel p-3 mb-3" onSubmit={submit}>
      <h2 className="h5">{reportDomains[domain].label}</h2>
      {domain === 'assets' && <p className="text-muted">Consulta e exportação na organização selecionada.</p>}
      {(inputError || action.error) && <Alert variant="danger">{inputError || action.error}</Alert>}
      <fieldset disabled={action.busy}>
        <div className="row g-3">
          <Form.Group className="col-md-6" controlId="report-q"><Form.Label>Busca</Form.Label><Form.Control name="q" /></Form.Group>
          <Form.Group className="col-md-3" controlId="report-sort">
            <Form.Label>Ordenar por</Form.Label>
            <Form.Select name="sort"><option value="">Padrão do relatório</option>
              {definition.sort.allowed_fields.map(field => <option key={field} value={field}>{reportFieldLabel(field)}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="col-md-3" controlId="report-direction">
            <Form.Label>Direção</Form.Label>
            <Form.Select name="direction">{definition.sort.allowed_directions.map(direction =>
              <option key={direction} value={direction}>{direction === 'asc' ? 'Crescente' : 'Decrescente'}</option>)}</Form.Select>
          </Form.Group>
          <Form.Group className="col-md-4" controlId="report-filter">
            <Form.Label>Filtro</Form.Label>
            <Form.Select value={filter?.name ?? ''} onChange={event => setFilterName(event.target.value)}>
              <option value="">Sem filtro adicional</option>
              {availableFilters.map(option => <option key={option.name} value={option.name}>{reportFieldLabel(option.name)}</option>)}
            </Form.Select>
          </Form.Group>
          {filter && <FilterInputs key={filter.name} filter={filter} />}
        </div>
        <div className="d-flex flex-wrap gap-3 my-3">
          <Form.Check id="report-inactive" label="Incluir inativos" name="inactive" />
          {domain === 'entities' && <Form.Check id="report-entities-scope" label="Limitar à organização selecionada" checked={scopedEntities}
            onChange={event => setScopedEntities(event.target.checked)} />}
        </div>
        <details className="mb-3">
          <summary>Colunas selecionadas ({selected.length})</summary>
          <div className="row g-2 mt-1">
            {definitionColumns(definition).map((field, index) => <Form.Check className="col-sm-6 col-lg-4" id={`report-column-${index}`}
              key={field} label={reportFieldLabel(field)} checked={selected.includes(field)}
              onChange={event => setSelected(previous => event.target.checked ? [...previous, field] : previous.filter(item => item !== field))} />)}
          </div>
        </details>
        <div className="d-flex flex-wrap gap-2 align-items-end">
          <Button type="submit" value="search" disabled={query.loading}>Consultar</Button>
          {definition.export_enabled && definition.export_formats?.length > 0 && <>
            <Form.Group controlId="report-format">
              <Form.Label className="visually-hidden">Formato da exportação</Form.Label>
              <Form.Select name="format">{definition.export_formats.map(format => <option key={format} value={format}>{format.toUpperCase()}</option>)}</Form.Select>
            </Form.Group>
            <Button type="submit" value="export" variant="outline-primary">{action.busy ? 'Solicitando…' : 'Exportar relatório'}</Button>
          </>}
        </div>
      </fieldset>
    </Form>
    {query.error && <Alert variant="danger">{operationError(query.error)}</Alert>}
    {request && !query.error && <ReportResults domain={domain} columns={request.columns} query={query} offset={offset} limit={limit}
      onPage={page => setOffset((page - 1) * limit)} chart={viewChart} setChart={setViewChart} />}
  </>;
}

function FilterInputs({ filter }) {
  const [operator, setOperator] = useState(filter.operators[0]);
  return <>
    <Form.Group className="col-md-3" controlId="report-operator">
      <Form.Label>Operador</Form.Label>
      <Form.Select name="operator" value={operator} onChange={event => setOperator(event.target.value)}>
        {filter.operators.map(value => <option key={value} value={value}>{operators[value] ?? value}</option>)}
      </Form.Select>
    </Form.Group>
    <Form.Group className="col-md-5" controlId="report-value">
      <Form.Label>Valor {operator === 'in' ? '(separe por vírgula)' : ''}</Form.Label>
      <Form.Control name="filterValue" required placeholder={filter.name.endsWith('_at') ? '2026-11-01T00:00:00Z' : undefined} />
    </Form.Group>
  </>;
}

function reportCell(value, field) {
  if (value == null) return '—';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (typeof value === 'string' && field.endsWith('_at') && !Number.isNaN(Date.parse(value))) return formatDate(value);
  if (typeof value !== 'object') return String(value);
  if (Array.isArray(value)) return value.map(item => typeof item === 'object' && item !== null ? item.name ?? JSON.stringify(item) : String(item)).join(', ') || '—';
  return value.name ?? JSON.stringify(value);
}

function ReportResults({ domain, columns, query, offset, limit, onPage, chart, setChart }) {
  const items = query.data?.items ?? [];
  const total = query.data?.page?.total ?? 0;
  const buckets = reportBuckets(domain, columns, items);
  const rows = items.map((row, index) => ({ row, key: offset + index }));
  return <section>
    {query.data && <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-2">
      <span>{total} registro(s)</span>
      {buckets && items.length > 0 && <Button variant="outline-primary" size="sm" onClick={() => setChart(!chart)} aria-expanded={chart}>
        {chart ? 'Ocultar gráfico' : 'Exibir gráfico'}
      </Button>}
    </div>}
    {chart && buckets && items.length > 0 && <section className="card panel p-3 mb-3">
      <h3 className="h6">Registros nesta página por {reportFieldLabel(buckets.field).toLowerCase()}</h3>
      <ApexChart key={JSON.stringify(buckets)} type="bar" getOptions={() => ({
        chart: { height: 320, toolbar: { show: false } },
        xaxis: { categories: buckets.categories }, yaxis: { min: 0, decimalsInFloat: 0 },
        series: [{ name: 'Registros', data: buckets.counts }]
      })} />
    </section>}
    <DataTable rows={rows} rowKey={record => record.key} loading={query.loading}
      columns={columns.map(field => ({ key: field, label: reportFieldLabel(field), render: ({ row }) => reportCell(row[field], field) }))}
      pagination={{ page: offset / limit + 1, pageCount: Math.ceil(total / limit), total, onPage }} />
  </section>;
}

function History({ organizationUid, onOpen, revision }) {
  const [onlySelected, setOnlySelected] = useState(false);
  const [lookupError, setLookupError] = useState(null);
  const list = useOffsetList(searchReportHistory, { params: { organizationUid: onlySelected ? organizationUid : undefined, revision }, limit: 20 });
  return <section className="mb-3">
    <h2 className="h5">Histórico de exportações</h2>
    <form className="d-flex flex-wrap gap-2 align-items-end mb-3" onSubmit={event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const uid = String(form.get('uid')).trim();
      if (!UUID_PATTERN.test(uid)) { setLookupError('Informe um UID válido.'); return; }
      setLookupError(null);
      onOpen(uid, form.has('context') ? organizationUid : undefined);
    }}>
      <Form.Group controlId="report-uid"><Form.Label>Consultar por UID</Form.Label><Form.Control name="uid" required /></Form.Group>
      <Form.Check className="mb-2" id="report-lookup-context" label="Usar a organização selecionada" name="context" />
      <Button type="submit" variant="outline-primary">Abrir relatório</Button>
    </form>
    {lookupError && <Alert variant="warning">{lookupError}</Alert>}
    <Form.Check className="mb-2" id="report-history-context" label="Mostrar apenas relatórios da organização selecionada" checked={onlySelected}
      onChange={event => setOnlySelected(event.target.checked)} />
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar no histórico…" actionLabel="Atualizar" onAction={list.refresh} />
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={list.hasMore}
      onLoadMore={list.loadMore} loadingMore={list.loading && list.items.length > 0}
      columns={[
        { key: 'report_code', label: 'Relatório', render: row => <Button variant="link" onClick={() => onOpen(row.uid, row.uid_organization)}>{reportName(row)}</Button> },
        { key: 'status', label: 'Status', render: row => reportStatus(row.status) },
        { key: 'format', label: 'Formato', render: row => row.format?.toUpperCase() },
        { key: 'requested_at', label: 'Solicitado em', render: row => formatDate(row.requested_at) }
      ]} emptyMessage="Nenhuma exportação encontrada." />
  </section>;
}

const runnableDomains = {
  'organizations.list': 'organizations',
  'entities.list': 'entities',
  'assets.inventory': 'assets'
};

function ReportDetail({ token, uid, organizationUid, onClose, onFinished, onCreated }) {
  const [revision, setRevision] = useState(0);
  const observedPending = useRef(false);
  const intention = useRef(null);
  const action = useOperationalAction();
  const exportAction = useOperationalAction();
  const query = useKnowledgeQuery(getReport, { token, uid, organizationUid, revision });
  const status = query.data?.status;
  const domain = runnableDomains[query.data?.report_code];
  const canRerun = domain === 'assets' ? Boolean(query.data?.uid_organization) : domain && !query.data?.uid_organization;
  useEffect(() => {
    if (!status) return;
    if (reportIsPending(status)) {
      observedPending.current = true;
      const timer = setTimeout(() => setRevision(value => value + 1), 5000);
      return () => clearTimeout(timer);
    }
    if (observedPending.current) {
      observedPending.current = false;
      onFinished();
    }
  }, [status]);
  const download = row => void action.run(async signal => {
    const blob = await downloadReport({ token, uid, organizationUid, signal });
    if (!blob.size || blob.type.includes('json') || blob.type.includes('html')) throw new Error('O servidor retornou um arquivo inválido.');
    return blob;
  }, blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const format = row.format === 'csv' ? 'csv' : 'xlsx';
    link.href = url;
    link.download = `relatorio-${uid}.${format}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const rerun = row => void exportAction.run(async signal => {
    const definition = await getReportDefinition({ token, signal, domain });
    if (definition.report_code !== row.report_code || definition.report_version !== row.report_version) {
      throw new Error('A versão desta execução não está disponível no catálogo atual.');
    }
    const selection = {
      columns: row.options?.columns?.length ? row.options.columns : definition.default_columns,
      sort: row.options?.sort?.length ? row.options.sort : definition.sort.default,
      q: row.filters?.q ?? '', filters: row.filters?.filters ?? [], include_inactive: Boolean(row.filters?.include_inactive)
    };
    return createReport({ token, signal, domain, organizationUid: row.uid_organization, definition, selection, format: row.format,
      idempotencyKey: intentKey(intention, 'rerun-report', { uid, selection, format: row.format }) });
  }, result => onCreated(result, row.uid_organization));
  return <section className="card panel p-3 mb-3">
    <div className="d-flex gap-2 justify-content-between align-items-start mb-2">
      <h2 className="h5">{query.data ? reportName(query.data) : 'Detalhes do relatório'}</h2>
      <Button size="sm" variant="outline-secondary" onClick={onClose}>Fechar detalhes</Button>
    </div>
    <p className="text-break font-monospace">{uid}</p>
    {query.loading && <Spinner size="sm" role="status" aria-label="Consultando status" />}
    {(query.error || action.error) && <Alert variant="danger">{query.error ? operationError(query.error) : action.error}</Alert>}
    {exportAction.error && <Alert variant="danger">{exportAction.error}</Alert>}
    {query.data && <>
      <p>Status <strong>{reportStatus(status)}</strong>{query.data.error_code && ` · ${query.data.error_code}`}</p>
      <p>Expiração {formatDate(query.data.expires_at)}</p>
    </>}
    <div className="d-flex gap-2">
      <Button size="sm" variant="outline-primary" disabled={query.loading} onClick={() => setRevision(value => value + 1)}>Atualizar status</Button>
      {status === 'completed' && (query.data.download_available ?? Boolean(query.data.download_path)) &&
        <Button size="sm" disabled={action.busy} onClick={() => download(query.data)}>{action.busy ? 'Baixando…' : 'Baixar arquivo'}</Button>}
      {query.data && canRerun && !reportIsPending(status) &&
        <Button size="sm" variant="outline-primary" disabled={exportAction.busy} onClick={() => rerun(query.data)}>
          {exportAction.busy ? 'Solicitando…' : 'Gerar novamente'}
        </Button>}
    </div>
  </section>;
}
