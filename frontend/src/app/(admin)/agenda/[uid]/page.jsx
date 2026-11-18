'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import AgendaNavigation from '@/components/admin/AgendaNavigation';
import DataTable from '@/components/admin/DataTable';
import { OperationalGate, OperationField, operationError, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createAgendaAnalysis, getAgendaEntry, listAgendaAnalyses, patchAgendaControls } from '@/lib/api/endpoints/agenda';
import { agendaAnalysisBody, agendaControlForm, agendaControlsBody, PRIORITIES } from '@/lib/domain/agenda';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { const { uid } = useParams(); return <OperationalGate area="agenda"><Entry key={uid} uid={uid} /></OperationalGate>; }
function Entry({ uid }) {
  const { token, selectedOrganizationUid } = useSession();
  const action = useOperationalAction();
  const intention = useRef(null);
  const [entry, setEntry] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);
  const [description, setDescription] = useState('');
  const history = useOffsetList(listAgendaAnalyses, { params: { organizationUid: selectedOrganizationUid, uid, revision }, limit: 20 });
  useEffect(() => {
    const controller = new AbortController();
    getAgendaEntry({ token, organizationUid: selectedOrganizationUid, uid, signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) { const item = result.item ?? result; setError(null); setEntry(item); setForm(agendaControlForm(item)); }
    }).catch(err => { if (!controller.signal.aborted) { setEntry(null); setForm(null); setError(operationError(err)); } });
    return () => controller.abort();
  }, [token, selectedOrganizationUid, uid, revision]);
  const reload = () => { setEntry(null); setForm(null); setError(null); setRevision(value => value + 1); };
  const denied = () => { setEntry(null); setForm(null); history.setItems([]); };
  const save = event => {
    event.preventDefault();
    void action.run(async signal => {
      try { return await patchAgendaControls({ token, organizationUid: selectedOrganizationUid, uid, body: agendaControlsBody(entry, form), signal }); }
      catch (err) { if (err.code === 'agenda_version_conflict') reload(); throw err; }
    }, reload, denied);
  };
  const analyse = event => {
    event.preventDefault();
    void action.run(signal => {
      const body = agendaAnalysisBody(description);
      return createAgendaAnalysis({ token, organizationUid: selectedOrganizationUid, uid, body, signal, idempotencyKey: intentKey(intention, `analysis:${uid}`, body) });
    }, () => { intention.current = null; setDescription(''); reload(); }, denied);
  };
  return <>
    <PageBreadcrumb title={entry?.title || 'Registro da agenda'} subTitle1="Operação" /><AgendaNavigation />
    {action.error && <Alert variant="danger">{action.error}{action.error.includes('agenda_version_conflict') && ' O registro foi recarregado. Confira os valores antes de salvar novamente.'}</Alert>}
    {error && <Alert variant="danger">{error}</Alert>}
    <Button variant="outline-secondary" className="mb-3" disabled={action.busy} onClick={reload}>Recarregar registro</Button>
    {!entry && !error && <Spinner animation="border" size="sm" />}
    {entry && form && <>
      <div className="card panel p-3 mb-3"><p>{entry.summary}</p><p>Origem: {entry.source_domain} / {entry.source_resource} · {entry.source_state}</p><p className="small">Identificador na origem: {entry.source_uid}</p>{entry.source_domain === 'maintenance' && <Link href="/manutencao">Consultar manutenções</Link>}</div>
      {entry.terminal && <Alert variant="info">Registro encerrado na origem. Os controles estão bloqueados; o histórico permanece disponível.</Alert>}
      <form className="card panel p-3 mb-3" onSubmit={save}><h5>Controles</h5><fieldset disabled={action.busy || entry.terminal}>
        <Form.Group className="mb-3" controlId="agenda-priority"><Form.Label>Prioridade</Form.Label><Form.Select value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value })}>{Object.entries(PRIORITIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Form.Select></Form.Group>
        <Form.Check id="agenda-pinned" label="Fixado" checked={form.pinned} onChange={event => setForm({ ...form, pinned: event.target.checked })} />
        <Form.Check id="agenda-notified" label="Notificado" checked={form.notified} onChange={event => setForm({ ...form, notified: event.target.checked })} />
        <p className="small text-muted">Marcar como notificado registra o controle; o envio de mensagens pertence ao fluxo de notificações.</p>
        <OperationField label="Adiar até (fuso do navegador)" type="datetime-local" value={form.snoozed_until} onChange={event => setForm({ ...form, snoozed_until: event.target.value })} />
        <OperationField label="Próximo contato (fuso do navegador)" type="datetime-local" value={form.next_contact_at} onChange={event => setForm({ ...form, next_contact_at: event.target.value })} />
        <Button type="submit" disabled={action.busy}>Salvar controles</Button>
      </fieldset></form>
      <form className="card panel p-3 mb-3" onSubmit={analyse}><h5>Registrar análise</h5><fieldset disabled={action.busy}><OperationField multiline label="Descrição" value={description} required onChange={event => setDescription(event.target.value)} /><Button type="submit">Registrar análise</Button></fieldset></form>
    </>}
    <h5>Histórico</h5><DataTable rows={history.items} loading={history.loading} error={history.error} hasMore={!history.loading && history.hasMore} onLoadMore={history.loadMore} columns={[
      { key: 'created_at', label: 'Data', render: row => row.created_at ? new Date(row.created_at).toLocaleString('pt-BR') : '—' },
      { key: 'kind', label: 'Tipo', render: row => row.kind || row.type || row.analysis_type || 'Análise' },
      { key: 'description', label: 'Descrição', render: row => row.description || JSON.stringify(row.changes || {}) }
    ]} />
  </>;
}
