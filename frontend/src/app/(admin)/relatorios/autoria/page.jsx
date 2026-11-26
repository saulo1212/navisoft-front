'use client';

import { useRef, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ReportsNavigation from '@/components/admin/ReportsNavigation';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import { OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import {
  getAdapterJsonSchema, getEffectiveTemplate, listReportTemplates, publishReportDefinition,
  publishReportSource, publishReportTemplateRevision, retryScheduleRun
} from '@/lib/api/endpoints/reportAuthoring';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

// Exemplos de corpo para guiar a autoria — refletem os contratos publicados da
// API. Servem apenas como ponto de partida editável; a API valida o conteúdo.
const DEFINITION_EXAMPLE = JSON.stringify({
  report_code: 'assets.inventory', version: 2, source_code: 'assets.inventory.v2',
  title: 'Inventário de Ativos', description: 'Inventário autorizado de ativos',
  columns: ['uid', 'identification', 'created_at'], default_columns: ['identification', 'created_at'],
  filters: [{ field: 'identification', operators: ['eq', 'prefix', 'contains'], search_operator: 'contains' }],
  sorts: [], default_sort: [], formats: [{ code: 'csv', visibility: ['private'] }]
}, null, 2);
const SOURCE_EXAMPLE = JSON.stringify({
  source_code: 'entities.entity_types.generic.v1', logical_code: 'entities.entity_types.generic',
  revision_number: 1, relation_code: 'entities.entity_types', authorization_strategy: 'organization_scope_rls',
  max_rows: 10000, max_bytes: 10485760, max_ttl_seconds: 1800,
  fields: [{ code: 'uid', display_name: 'UID', selectable: true, filterable: false, operators: [], search_operator: null, sortable: true, directions: ['asc', 'desc'] }],
  formats: [{ code: 'xlsx', visibility: ['private'] }]
}, null, 2);

export default function Page() {
  const { token, areaAccess } = useSession();
  if (!token || areaAccess?.status !== 'evaluated') return <div className="content-wrapper"><PageBreadcrumb title="Autoria de relatórios" subTitle1="Relatórios" /><ReportsNavigation /><Alert variant="warning">O contexto atual da sessão não permite consultar esta página.</Alert></div>;
  return <Authoring key={`${token}:${JSON.stringify(areaAccess)}`} />;
}

function Authoring() {
  return <div className="content-wrapper">
    <PageBreadcrumb title="Autoria de relatórios" subTitle1="Relatórios" />
    <ReportsNavigation />
    <p className="text-muted">Publique as peças que compõem os relatórios: fontes de dados, definições e revisões de template. As operações são administrativas e validadas pelo serviço de relatórios.</p>
    <TemplatesSection />
    <EffectiveTemplateSection />
    <PublishSection />
    <AdapterSchemaSection />
    <RetryRunSection />
  </div>;
}

// --- Templates publicados + upload de revisão --------------------------------
function TemplatesSection() {
  const { token } = useSession();
  const list = useOffsetList(listReportTemplates);
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const [notice, setNotice] = useState(null);
  const field = key => ({ value: form[key], onChange: event => setForm({ ...form, [key]: event.target.value }) });
  const submit = event => {
    event.preventDefault();
    void action.run(signal => publishReportTemplateRevision({
      token, signal, templateUid: form.templateUid.trim(), file: form.file, scope: form.scope.trim() || 'global',
      contract: form.contract, idempotencyKey: intentKey(intention, 'publish-template-revision', { u: form.templateUid, s: form.scope, c: form.contract, n: form.file?.name, z: form.file?.size })
    }), () => { setForm(null); setNotice('Revisão de template publicada.'); list.refresh(); });
  };
  return <Card className="mb-4"><Card.Header as="h2" className="h5">Templates publicados</Card.Header><Card.Body>
    {notice && <Alert variant="success">{notice}</Alert>}
    {action.error && !form && <Alert variant="danger">{action.error}</Alert>}
    <div className="d-flex gap-2 mb-3">
      <Button onClick={() => { action.clearError(); intention.current = null; setNotice(null); setForm({ templateUid: '', scope: 'global', contract: '', file: null }); }}>Publicar revisão</Button>
      <Button variant="outline-secondary" disabled={list.loading} onClick={list.refresh}>Atualizar</Button>
    </div>
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} emptyMessage="Nenhum template publicado." columns={[
      { key: 'report_code', label: 'Relatório', render: row => row.report_code || row.code || '—' },
      { key: 'scope', label: 'Escopo', render: row => row.scope || '—' },
      { key: 'contract', label: 'Contrato', render: row => row.contract || row.template_contract || '—' },
      { key: 'version', label: 'Versão', render: row => row.version ?? row.revision_number ?? '—' },
      { key: 'uid', label: 'UID', render: row => <code className="small">{row.uid || '—'}</code> }
    ]} />
    {form && <FormModal show title="Publicar revisão de template" submitLabel="Publicar" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setForm(null); }} onSubmit={submit}>
      <fieldset disabled={action.busy}>
        <OperationField label="UID do template" required placeholder="76a0e5b9-…" {...field('templateUid')} />
        <OperationField label="Escopo (X-Template-Scope)" required placeholder="global" {...field('scope')} />
        <OperationField label="Contrato (X-Template-Contract) — opcional" placeholder="corporate_v2" {...field('contract')} />
        <Form.Group className="mb-3" controlId="template-file"><Form.Label>Arquivo de template (XLSX)</Form.Label>
          <Form.Control type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required onChange={event => setForm({ ...form, file: event.target.files?.[0] ?? null })} /></Form.Group>
        <p className="small text-muted">A planilha é enviada como corpo binário. Repetir a mesma intenção reusa a chave de idempotência.</p>
      </fieldset>
    </FormModal>}
  </Card.Body></Card>;
}

// --- Política efetiva por report_code ----------------------------------------
function EffectiveTemplateSection() {
  const { token } = useSession();
  const action = useOperationalAction();
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const submit = event => {
    event.preventDefault();
    setResult(null);
    void action.run(signal => getEffectiveTemplate({ token, signal, reportCode: code }), data => setResult(data));
  };
  return <Card className="mb-4"><Card.Header as="h2" className="h5">Política efetiva de template</Card.Header><Card.Body>
    <Form onSubmit={submit} className="d-flex flex-wrap gap-2 align-items-end mb-2">
      <Form.Group controlId="effective-code" className="flex-grow-1"><Form.Label>Código do relatório</Form.Label><Form.Control value={code} onChange={event => setCode(event.target.value)} placeholder="assets.inventory" required disabled={action.busy} /></Form.Group>
      <Button type="submit" disabled={action.busy}>Consultar</Button>
    </Form>
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    {result && <ResultPanel data={result} />}
  </Card.Body></Card>;
}

// --- Publicar definição / fonte (editor JSON) --------------------------------
function PublishSection() {
  const [kind, setKind] = useState(null);
  return <Card className="mb-4"><Card.Header as="h2" className="h5">Publicar definição e fonte de dados</Card.Header><Card.Body>
    <p className="text-muted mb-3">Publique o corpo JSON de uma definição de relatório ou de uma capacidade/fonte de dados.</p>
    <div className="d-flex flex-wrap gap-2">
      <Button onClick={() => setKind('definition')}>Publicar definição</Button>
      <Button variant="outline-primary" onClick={() => setKind('source')}>Publicar fonte de dados</Button>
    </div>
    {kind && <JsonPublishModal kind={kind} onClose={() => setKind(null)} />}
  </Card.Body></Card>;
}

function JsonPublishModal({ kind, onClose }) {
  const { token } = useSession();
  const action = useOperationalAction();
  const intention = useRef(null);
  const isDefinition = kind === 'definition';
  const [text, setText] = useState(isDefinition ? DEFINITION_EXAMPLE : SOURCE_EXAMPLE);
  const [result, setResult] = useState(null);
  const submit = event => {
    event.preventDefault();
    let body;
    try { body = JSON.parse(text); } catch { action.clearError(); setResult({ invalid: true }); return; }
    setResult(null);
    const publish = isDefinition ? publishReportDefinition : publishReportSource;
    void action.run(signal => publish({ token, signal, body, idempotencyKey: intentKey(intention, `publish-${kind}`, body) }), data => setResult({ ok: true, data }));
  };
  return <FormModal show title={isDefinition ? 'Publicar definição de relatório' : 'Publicar fonte de dados'} submitLabel="Publicar" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) onClose(); }} onSubmit={submit}>
    <fieldset disabled={action.busy}>
      {result?.invalid && <Alert variant="danger" className="py-2 small">JSON inválido. Revise a sintaxe.</Alert>}
      {result?.ok && <Alert variant="success" className="py-2 small">Publicado com sucesso.</Alert>}
      <Form.Group controlId="publish-json"><Form.Label>Corpo (JSON)</Form.Label>
        <Form.Control as="textarea" rows={16} value={text} onChange={event => setText(event.target.value)} spellCheck={false} style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} /></Form.Group>
      {result?.ok && <ResultPanel data={result.data} />}
    </fieldset>
  </FormModal>;
}

// --- Schema JSON do adapter --------------------------------------------------
function AdapterSchemaSection() {
  const { token } = useSession();
  const action = useOperationalAction();
  const [adapter, setAdapter] = useState('');
  const [result, setResult] = useState(null);
  const submit = event => {
    event.preventDefault();
    setResult(null);
    void action.run(signal => getAdapterJsonSchema({ token, signal, adapter }), data => setResult(data));
  };
  return <Card className="mb-4"><Card.Header as="h2" className="h5">Schema JSON do adapter</Card.Header><Card.Body>
    <Form onSubmit={submit} className="d-flex flex-wrap gap-2 align-items-end mb-2">
      <Form.Group controlId="adapter-code" className="flex-grow-1"><Form.Label>Código do adapter</Form.Label><Form.Control value={adapter} onChange={event => setAdapter(event.target.value)} placeholder="assets.inventory.v2" required disabled={action.busy} /></Form.Group>
      <Button type="submit" disabled={action.busy}>Consultar schema</Button>
    </Form>
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    {result && <ResultPanel data={result} />}
  </Card.Body></Card>;
}

// --- Reexecutar execução agendada --------------------------------------------
function RetryRunSection() {
  const { token } = useSession();
  const action = useOperationalAction();
  const [form, setForm] = useState({ runUid: '', reasonCode: '' });
  const [notice, setNotice] = useState(null);
  const submit = event => {
    event.preventDefault();
    setNotice(null);
    void action.run(signal => retryScheduleRun({ token, signal, runUid: form.runUid.trim(), reasonCode: form.reasonCode }), () => { setNotice('Reexecução solicitada.'); setForm({ runUid: '', reasonCode: '' }); });
  };
  return <Card className="mb-4"><Card.Header as="h2" className="h5">Reexecutar execução agendada</Card.Header><Card.Body>
    <p className="text-muted">Recuperação administrativa de uma execução agendada que falhou. Informe o UID da execução.</p>
    {notice && <Alert variant="success">{notice}</Alert>}
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    <Form onSubmit={submit} className="d-flex flex-wrap gap-2 align-items-end">
      <Form.Group controlId="retry-run" className="flex-grow-1"><Form.Label>UID da execução</Form.Label><Form.Control value={form.runUid} onChange={event => setForm({ ...form, runUid: event.target.value })} placeholder="dfc8a91d-…" required disabled={action.busy} /></Form.Group>
      <Form.Group controlId="retry-reason" className="flex-grow-1"><Form.Label>Código do motivo (opcional)</Form.Label><Form.Control value={form.reasonCode} onChange={event => setForm({ ...form, reasonCode: event.target.value })} placeholder="schema_fix_applied" disabled={action.busy} /></Form.Group>
      <Button type="submit" variant="outline-primary" disabled={action.busy}>Reexecutar</Button>
    </Form>
  </Card.Body></Card>;
}

function ResultPanel({ data }) {
  return <pre className="bg-light border rounded p-2 mt-2 mb-0" style={{ maxHeight: '320px', overflow: 'auto', fontSize: '0.8rem' }}>{JSON.stringify(data, null, 2)}</pre>;
}
