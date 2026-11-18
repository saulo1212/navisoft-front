'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormDrawer from '@/components/admin/FormDrawer';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { areaAllowed, OperationalGate, OperationField, operationError, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createTechnician, getTechnician, listTechnicians, listTechnicianCapabilities, patchTechnician, replaceCapabilities, getTechnicianPrices, replaceTechnicianPrices, getTechnicianUser, linkTechnicianUser } from '@/lib/api/endpoints/technicians';
import { intentKey, OPERATIONS, priceBody, requireUid, technicianBody } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

export default function TechniciansPage() { return <OperationalGate area="devices"><Technicians /></OperationalGate>; }

function Technicians() {
  const { token, selectedOrganizationUid, areaAccess } = useSession();
  const list = useOffsetList(listTechnicians, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const [detail, setDetail] = useState(null);
  const [capabilities, setCapabilities] = useState([]);
  const [catalogError, setCatalogError] = useState(null);
  const [codes, setCodes] = useState([]);
  const canPrice = areaAllowed(areaAccess, 'devices.pricing');
  useEffect(() => {
    const controller = new AbortController();
    listTechnicianCapabilities({ token, signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) setCapabilities(Array.isArray(result) ? result : result.items || []);
    }).catch(error => { if (!controller.signal.aborted) setCatalogError(operationError(error)); });
    return () => controller.abort();
  }, [token]);
  const deny = () => { setDetail(null); setForm(null); list.setItems([]); };
  const refreshDetail = async signal => {
    const result = await getTechnician({ token, technicianUid: detail.uid, signal });
    return result.item ?? result;
  };
  const open = row => action.run(signal => getTechnician({ token, technicianUid: row.uid, signal }), result => {
    const record = result.item ?? result;
    setDetail(record); setCodes((record.capabilities || []).map(cap => typeof cap === 'string' ? cap : cap.code));
  }, deny);
  const save = event => {
    event.preventDefault();
    void action.run(signal => {
      const body = technicianBody(form, selectedOrganizationUid);
      return createTechnician({ token, body, idempotencyKey: intentKey(intention, 'create-technician', body), signal });
    }, () => { setForm(null); list.refresh(); notifySuccess('Executor criado.'); }, deny);
  };
  const changeActive = () => action.run(async signal => {
    await patchTechnician({ token, technicianUid: detail.uid, body: { active: !detail.active }, signal });
    return refreshDetail(signal);
  }, result => { setDetail(result); list.refresh(); }, deny);
  const saveCapabilities = () => action.run(async signal => {
    await replaceCapabilities({ token, technicianUid: detail.uid, codes, signal });
    return refreshDetail(signal);
  }, result => { setDetail(result); list.refresh(); notifySuccess('Capacidades salvas.'); }, deny);
  return <>
    <PageBreadcrumb title="Técnicos e prestadoras" subTitle1="Operação" />
    <p>Cadastre a prestadora em <Link href="/entidades">Entidades</Link> e associe o tipo de prestadora técnica antes de criar seus executores.</p>
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    {catalogError && <Alert variant="warning">Catálogo de capacidades: {catalogError}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} actionLabel="Novo executor" actionDisabled={action.busy} onAction={() => { action.clearError(); intention.current = null; setForm({ name: '', uid_provider_entity: '', active: true }); }} />
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} onRowClick={row => { if (!action.busy) void open(row); }} columns={[
      { key: 'name', label: 'Executor' }, { key: 'provider_name', label: 'Prestadora', render: row => row.provider_name || row.uid_provider_entity },
      { key: 'active', label: 'Situação', render: row => <StatusBadge status={row.active ? 'active' : 'inactive'} /> }
    ]} />
    {form && <FormDrawer show title="Novo executor" onHide={() => { if (!action.busy) setForm(null); }} submitting={action.busy} onSubmit={save} error={action.error}>
      <fieldset disabled={action.busy}>
        <OperationField label="UUID da entidade prestadora" value={form.uid_provider_entity} required onChange={e => setForm({ ...form, uid_provider_entity: e.target.value })} />
        <OperationField label="Nome do executor" value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })} />
        <label><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Ativo</label>
      </fieldset>
    </FormDrawer>}
    <Modal show={!!detail} onHide={() => { if (!action.busy) setDetail(null); }} size="lg">
      <Modal.Header closeButton={!action.busy}><Modal.Title>{detail?.name}</Modal.Title></Modal.Header>
      <Modal.Body>{detail && <>
        {action.error && <Alert variant="danger">{action.error}</Alert>}
        <p>Prestadora: {detail.provider_name || detail.uid_provider_entity}</p>
        <p>Custódias abertas: {detail.open_custody ?? '—'} · OS abertas: {detail.open_work_orders ?? '—'}</p>
        <Button size="sm" variant="outline-secondary" disabled={action.busy} onClick={changeActive}>{detail.active ? 'Desativar executor' : 'Ativar executor'}</Button>
        <fieldset className="my-3" disabled={action.busy || !!catalogError}>
          <legend className="fs-6">Capacidades</legend>
          {capabilities.map(cap => <label className="d-block mb-1" key={cap.code}><input type="checkbox" checked={codes.includes(cap.code)} disabled={cap.active === false && !codes.includes(cap.code)} onChange={e => setCodes(e.target.checked ? [...codes, cap.code] : codes.filter(code => code !== cap.code))} /> {cap.name} · {cap.kind === 'operation' ? 'Operação' : 'Tecnologia'}</label>)}
          {codes.filter(code => !capabilities.some(cap => cap.code === code)).map(code => <p key={code}>Capacidade existente preservada: {code}</p>)}
          <Button size="sm" disabled={!capabilities.length} onClick={saveCapabilities}>Salvar capacidades</Button>
        </fieldset>
        <TechnicianAccount key={`user-${detail.uid}`} technicianUid={detail.uid} />
        {canPrice && <TechnicianPrices key={`prices-${detail.uid}`} technicianUid={detail.uid} capabilities={capabilities} />}
      </>}</Modal.Body>
    </Modal>
  </>;
}

function TechnicianAccount({ technicianUid }) {
  const { token } = useSession();
  const action = useOperationalAction();
  const [user, setUser] = useState(null);
  const [input, setInput] = useState('');
  const load = () => action.run(signal => getTechnicianUser({ token, technicianUid, signal }), result => { setUser(result); setInput(result.uid_user || ''); }, () => setUser(null));
  return <div className="border-top pt-3 mt-3">
    <h6>Conta de acesso do executor</h6>
    <p className="small text-muted">Vincule uma conta existente. Este vínculo não cria usuário nem senha.</p>
    {action.error && <Alert variant="warning">{action.error}</Alert>}
    <Button size="sm" variant="outline-secondary" disabled={action.busy} onClick={load}>Consultar vínculo</Button>
    {user && <form className="mt-2" onSubmit={event => { event.preventDefault(); void action.run(signal => linkTechnicianUser({ token, technicianUid, userUid: input ? requireUid(input, 'usuário') : null, signal }), () => { setUser(null); notifySuccess('Vínculo atualizado.'); }); }}>
      <fieldset disabled={action.busy}><OperationField label="UUID do usuário (em branco para desvincular)" value={input} onChange={e => setInput(e.target.value)} /><Button type="submit" size="sm">Salvar vínculo</Button></fieldset>
    </form>}
  </div>;
}

function TechnicianPrices({ technicianUid, capabilities }) {
  const { token } = useSession();
  const action = useOperationalAction();
  const [prices, setPrices] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const load = () => action.run(signal => getTechnicianPrices({ token, technicianUid, signal }), result => { setPrices(result.items || []); setConfirm(false); }, () => setPrices(null));
  const change = (index, field, value) => { setConfirm(false); setPrices(prices.map((row, i) => i === index ? { ...row, [field]: value } : row)); };
  const save = event => {
    event.preventDefault();
    if (!confirm) return;
    void action.run(async signal => {
      const body = priceBody(prices);
      await replaceTechnicianPrices({ token, technicianUid, body, signal });
      return getTechnicianPrices({ token, technicianUid, signal });
    }, result => { setPrices(result.items || []); setConfirm(false); notifySuccess('Tabela de preços atualizada.'); }, () => setPrices(null));
  };
  return <div className="border-top pt-3 mt-3">
    <h6>Tabela de preços</h6>
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    <Button size="sm" variant="outline-secondary" disabled={action.busy} onClick={load}>Consultar preços</Button>
    {prices && <form onSubmit={save} className="mt-3"><fieldset disabled={action.busy}>
      {prices.map((row, index) => <div className="border rounded p-3 mb-2" key={index}>
        <label className="form-label" htmlFor={`price-cap-${index}`}>Capacidade tecnológica</label>
        <select id={`price-cap-${index}`} className="form-select mb-3" value={row.capability_code} required onChange={e => change(index, 'capability_code', e.target.value)}><option value="">Selecione...</option>{[...new Set([...capabilities.filter(cap => cap.kind !== 'operation').map(cap => cap.code), row.capability_code].filter(Boolean))].map(code => <option key={code} value={code}>{capabilities.find(cap => cap.code === code)?.name || code}</option>)}</select>
        <label className="form-label" htmlFor={`price-op-${index}`}>Operação</label>
        <select id={`price-op-${index}`} className="form-select mb-3" value={row.operation} onChange={e => change(index, 'operation', e.target.value)}>{Object.entries(OPERATIONS).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select>
        <OperationField label="Custo do técnico (centavos)" type="number" min="0" step="1" required value={row.technician_cost_cents} onChange={e => change(index, 'technician_cost_cents', e.target.value)} />
        <OperationField label="Markup (%)" type="number" min="0" step="0.01" required value={row.markup_percent} onChange={e => change(index, 'markup_percent', e.target.value)} />
        <OperationField label="Moeda" required maxLength={3} value={row.currency_code} onChange={e => change(index, 'currency_code', e.target.value)} />
        <p className="small text-muted">Versão atual: {row.version ?? 'nova'} · Preço atual ao cliente: {row.client_price_cents ?? '—'} centavos</p>
        <Button size="sm" variant="outline-danger" onClick={() => { setPrices(prices.filter((_, i) => i !== index)); setConfirm(false); }}>Remover linha</Button>
      </div>)}
      <Button size="sm" variant="outline-secondary" onClick={() => { setPrices([...prices, { capability_code: '', operation: 'install', technician_cost_cents: '', markup_percent: '', currency_code: 'BRL' }]); setConfirm(false); }}>Adicionar preço</Button>
      <label className="d-block my-3"><input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)} /> Confirmo a substituição da tabela completa, incluindo a retirada das linhas removidas.</label>
      <Button size="sm" type="submit" disabled={!confirm}>Salvar tabela completa</Button>
    </fieldset></form>}
  </div>;
}
