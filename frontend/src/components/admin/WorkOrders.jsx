'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from './DataTable';
import FormDrawer from './FormDrawer';
import ListToolbar from './ListToolbar';
import StatusBadge from './StatusBadge';
import { areaAllowed, OperationalGate, OperationField, operationError, useOperationalAction } from './OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { completeWorkOrder, confirmCustody, createWorkOrder, declareReturn, dispatchWorkOrder, getWorkOrder, listCustody, listWorkOrders, receiveReturn, startWorkOrder } from '@/lib/api/endpoints/workorders';
import { getAsset } from '@/lib/api/endpoints/fleet';
import { getTechnician } from '@/lib/api/endpoints/technicians';
import { assertWorkOrderContext, completionBody, custodyNeedsConfirmation, intentKey, nonnegative, OPERATIONS, workOrderBody } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const emptyItem = () => ({ slot_number: '', operation: 'install', uid_device_before: '', uid_device_after: '', capability_code: '' });
const rowUid = item => item.uid_item || item.uid;
const unwrap = result => result?.item ?? result;
const route = selfService => selfService ? '/minhas-ordens-servico' : '/ordens-servico';

export function WorkOrdersPage({ selfService = false }) { return <OperationalGate area="devices"><Orders selfService={selfService} /></OperationalGate>; }
function Orders({ selfService }) {
  const { token, selectedOrganizationUid } = useSession();
  const router = useRouter();
  const [state, setState] = useState('pending');
  const list = useOffsetList(listWorkOrders, { params: { organizationUid: selectedOrganizationUid, selfService, state } });
  const [form, setForm] = useState(null);
  const action = useOperationalAction();
  const intention = useRef(null);
  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const changeItem = (index, field, value) => set('items', form.items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const save = event => {
    event.preventDefault();
    void action.run(async signal => {
      const body = workOrderBody(form);
      const [asset, technician] = await Promise.all([
        getAsset({ token, assetUid: body.uid_asset, signal }),
        getTechnician({ token, technicianUid: body.uid_technician, signal })
      ]);
      assertWorkOrderContext(unwrap(asset), unwrap(technician), selectedOrganizationUid);
      return createWorkOrder({ token, body, idempotencyKey: intentKey(intention, 'create-work-order', body), signal });
    }, response => {
      setForm(null); list.refresh(); notifySuccess('OS criada.');
      const uid = unwrap(response)?.uid;
      if (uid) router.push(`${route(false)}/${encodeURIComponent(uid)}`);
    }, () => { setForm(null); list.setItems([]); });
  };
  return <>
    <PageBreadcrumb title={selfService ? 'Minhas ordens de serviço' : 'Ordens de serviço'} subTitle1="Operação" />
    {!selfService && <p><Link href="/minhas-ordens-servico">Abrir minha área de executor</Link></p>}
    <label htmlFor="wo-state" className="form-label">Situação da lista</label>
    <select id="wo-state" className="form-select mb-3" style={{ maxWidth: 300 }} value={state} onChange={e => setState(e.target.value)}><option value="pending">Pendentes</option><option value="completed">Concluídas</option><option value="all">Todas, incluindo canceladas</option></select>
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar por descrição..." actionLabel={selfService ? undefined : 'Nova OS'} actionDisabled={action.busy} onAction={() => { intention.current = null; action.clearError(); setForm({ uid_asset: '', uid_technician: '', description: '', items: [emptyItem()] }); }} />
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} onRowClick={row => router.push(`${route(selfService)}/${encodeURIComponent(row.uid)}`)} columns={[
      { key: 'number', label: 'Número' }, { key: 'asset', label: 'Ativo', render: row => row.asset_identification || row.uid_asset },
      ...(!selfService ? [{ key: 'technician', label: 'Executor', render: row => row.technician_name_snapshot || row.uid_technician }] : []),
      { key: 'items_total', label: 'Itens' }, { key: 'items_completed', label: 'Concluídos' }, { key: 'items_pending', label: 'Pendentes' },
      { key: 'status', label: 'Situação', render: row => <StatusBadge status={row.status} /> }
    ]} />
    {form && <FormDrawer show title="Nova OS técnica" submitting={action.busy} error={action.error} onSubmit={save} onHide={() => { if (!action.busy) setForm(null); }}>
      <fieldset disabled={action.busy}>
        <OperationField label="UUID do ativo" required value={form.uid_asset} onChange={e => set('uid_asset', e.target.value)} />
        <OperationField label="UUID do executor ativo" required value={form.uid_technician} onChange={e => set('uid_technician', e.target.value)} />
        <OperationField label="Descrição" multiline value={form.description} onChange={e => set('description', e.target.value)} />
        <p className="small text-muted">O ativo e o executor devem pertencer à organização selecionada. Dispositivos novos precisam estar disponíveis após preparação e liberação.</p>
        {form.items.map((item, index) => <div className="border rounded p-3 mb-3" key={index}>
          <h6>Item {index + 1}</h6>
          <OperationField label="Slot" type="number" min="1" step="1" required value={item.slot_number} onChange={e => changeItem(index, 'slot_number', e.target.value)} />
          <label className="form-label" htmlFor={`wo-operation-${index}`}>Operação</label>
          <select id={`wo-operation-${index}`} className="form-select mb-3" value={item.operation} onChange={e => changeItem(index, 'operation', e.target.value)}>{Object.entries(OPERATIONS).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select>
          {item.operation !== 'install' && <OperationField label="UUID do dispositivo atual" required value={item.uid_device_before} onChange={e => changeItem(index, 'uid_device_before', e.target.value)} />}
          {['install', 'replace'].includes(item.operation) && <OperationField label="UUID do dispositivo novo" required value={item.uid_device_after} onChange={e => changeItem(index, 'uid_device_after', e.target.value)} />}
          <OperationField label="Código de capacidade tecnológica (opcional)" value={item.capability_code} onChange={e => changeItem(index, 'capability_code', e.target.value)} />
          <Button size="sm" variant="outline-danger" disabled={form.items.length === 1} onClick={() => set('items', form.items.filter((_, i) => i !== index))}>Remover item</Button>
        </div>)}
        <Button size="sm" variant="outline-secondary" onClick={() => set('items', [...form.items, emptyItem()])}>Adicionar item</Button>
      </fieldset>
    </FormDrawer>}
  </>;
}

export function WorkOrderDetailPage({ uid, selfService = false }) {
  return <OperationalGate area="devices"><OrderDetail key={`${uid}:${selfService}`} uid={uid} selfService={selfService} /></OperationalGate>;
}
function OrderDetail({ uid, selfService }) {
  const { token, areaAccess } = useSession();
  const [order, setOrder] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [revision, setRevision] = useState(0);
  const [drafts, setDrafts] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [dispatch, setDispatch] = useState({ dispatch_method: 'courier', dispatch_reference: '', dispatch_cost_cents: 0, dispatch_notes: '' });
  const action = useOperationalAction();
  const intention = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    getWorkOrder({ token, workOrderUid: uid, selfService, signal: controller.signal }).then(result => {
      if (!controller.signal.aborted) { setOrder(unwrap(result)); setLoadError(null); }
    }).catch(err => { if (!controller.signal.aborted) setLoadError(operationError(err)); });
    return () => controller.abort();
  }, [token, uid, selfService]);
  const run = operation => action.run(async signal => {
    const result = await operation(signal);
    const updated = await getWorkOrder({ token, workOrderUid: uid, selfService, signal });
    return { result, updated };
  }, ({ result, updated }) => {
    setOrder(unwrap(updated));
    setFeedback({ message: result?.completed === false ? 'Resultado registrado. Há itens pendentes; confira os bloqueios antes de tentar novamente.' : 'Operação registrada.', blockers: Array.isArray(result?.blockers) ? result.blockers : [] });
    setRevision(value => value + 1);
  }, () => setOrder(null));
  const draft = item => drafts[rowUid(item)] || { selected: false, result_notes: '', tests: (item.technical_requirement_snapshot?.tests || []).map((test, index) => ({ test_code: test.test_code, result: '', notes: '', localId: `${rowUid(item)}-${index}` })) };
  const change = (item, patch) => setDrafts(prev => ({ ...prev, [rowUid(item)]: { ...draft(item), ...patch } }));
  const complete = () => run(signal => {
    const body = completionBody((order.items || []).filter(item => draft(item).selected && !item.completed && item.status !== 'completed').map(item => ({ uid_item: rowUid(item), ...draft(item) })));
    return completeWorkOrder({ token, workOrderUid: uid, selfService, body, signal, idempotencyKey: intentKey(intention, `complete:${uid}`, body) });
  });
  return <>
    <PageBreadcrumb title={order ? `OS ${order.number ?? order.uid?.slice(0, 8)}` : 'Ordem de serviço'} subTitle1="Operação" />
    <p><Link href={route(selfService)}>Voltar à lista</Link></p>
    {loadError && <Alert variant="danger">{loadError}</Alert>}
    {!order && !loadError && <p>Carregando...</p>}
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    {feedback && <Alert variant="info"><p>{feedback.message}</p>{feedback.blockers.map((blocker, i) => <p key={i}>{typeof blocker === 'string' ? blocker : blocker.message || blocker.code || 'Requisito pendente no item.'}</p>)}</Alert>}
    {order && <>
      <div className="card panel p-4 mb-3">
        <p><strong>Ativo:</strong> {order.asset_identification || order.uid_asset}</p>
        <p><strong>Executor:</strong> {order.technician_name_snapshot || order.uid_technician}</p>
        <p>{order.description}</p><div><StatusBadge status={order.status} /></div>
        {!selfService && order.status === 'draft' && <form className="mt-3" onSubmit={event => { event.preventDefault(); void run(signal => dispatchWorkOrder({ token, workOrderUid: uid, body: { ...dispatch, dispatch_cost_cents: nonnegative(dispatch.dispatch_cost_cents, 'Custo de envio', true) }, signal })); }}>
          <fieldset disabled={action.busy}>
            <OperationField label="Forma de envio" required value={dispatch.dispatch_method} onChange={e => setDispatch({ ...dispatch, dispatch_method: e.target.value })} />
            <OperationField label="Referência de envio" value={dispatch.dispatch_reference} onChange={e => setDispatch({ ...dispatch, dispatch_reference: e.target.value })} />
            <OperationField label="Custo de envio (centavos)" type="number" min="0" step="1" required value={dispatch.dispatch_cost_cents} onChange={e => setDispatch({ ...dispatch, dispatch_cost_cents: e.target.value })} />
            <OperationField label="Notas do envio" multiline value={dispatch.dispatch_notes} onChange={e => setDispatch({ ...dispatch, dispatch_notes: e.target.value })} />
            <Button type="submit">Despachar e congelar requisitos e preços</Button>
          </fieldset>
        </form>}
        {order.status === 'dispatched' && <div className="mt-3"><p className="small text-muted">Confirme abaixo o recebimento de cada custódia antes de iniciar.</p><Button disabled={action.busy} onClick={() => run(signal => startWorkOrder({ token, workOrderUid: uid, selfService, signal }))}>Iniciar OS</Button></div>}
      </div>
      {!selfService && areaAllowed(areaAccess, 'devices.pricing') && order.pricing_snapshot && <PricingSnapshot snapshot={order.pricing_snapshot} />}
      <div className="card panel p-4 mb-3">
        <h5>Itens</h5>
        <fieldset disabled={action.busy}>
          {(order.items || []).map(item => <div className="border rounded p-3 mb-3" key={rowUid(item)}>
            <h6>Slot {item.slot_number} · {OPERATIONS[item.operation] || item.operation}</h6>
            {item.slot_name && <p>{item.slot_name}</p>}
            <p>{item.description || item.required_capability?.name || item.capability_code}</p>
            {typeof item.technical_requirement_snapshot?.instructions === 'string' && <p>{item.technical_requirement_snapshot.instructions}</p>}
            {(item.technical_requirement_snapshot?.tests || []).map(test => <p className="small" key={test.test_code}>Teste {test.test_code}: {test.name || test.test_code}{test.required ? ' (obrigatório)' : ''}</p>)}
            <p className="small text-muted">Dispositivo atual: {item.uid_device_before || '—'} · Novo: {item.uid_device_after || '—'}</p>
            <StatusBadge status={item.completed || item.status === 'completed' ? 'completed' : item.status || 'pending'} />
            {!selfService && areaAllowed(areaAccess, 'devices.pricing') && item.pricing_snapshot && <PricingSnapshot snapshot={item.pricing_snapshot} />}
            {order.status === 'in_progress' && !item.completed && !['completed', 'cancelled'].includes(item.status) && <>
              <label className="d-block my-2"><input type="checkbox" checked={draft(item).selected} onChange={e => change(item, { selected: e.target.checked })} /> Enviar resultado deste item</label>
              <OperationField label="Notas do resultado" multiline value={draft(item).result_notes} onChange={e => change(item, { result_notes: e.target.value })} />
              <TestResults tests={draft(item).tests} onChange={tests => change(item, { tests })} />
            </>}
            {item.result_notes && <p className="mt-2">Resultado: {item.result_notes}</p>}
            {(item.tests || []).map((test, index) => <p className="small mt-2" key={test.uid || index}>Teste {test.test_code}: {test.result === 'pass' ? 'Aprovado' : test.result === 'fail' ? 'Reprovado' : test.result}{test.notes ? ` · ${test.notes}` : ''}</p>)}
            {Array.isArray(item.blockers) && item.blockers.map((blocker, i) => <Alert variant="warning" key={i}>{typeof blocker === 'string' ? blocker : blocker.message || blocker.code || 'Teste obrigatório pendente.'}</Alert>)}
          </div>)}
          {order.status === 'in_progress' && <Button variant="success" onClick={complete}>Registrar resultados dos itens selecionados</Button>}
        </fieldset>
      </div>
      <CustodyPanel key={`custody:${revision}`} workOrderUid={uid} selfService={selfService} />
    </>}
  </>;
}

function TestResults({ tests, onChange }) {
  const change = (index, field, value) => onChange(tests.map((test, i) => i === index ? { ...test, [field]: value } : test));
  return <div className="my-3">
    <p className="small text-muted">Registre os testes exigidos pelo requisito do item. Falhas são persistidas e podem manter o item pendente.</p>
    {tests.map((test, index) => <div className="border rounded p-2 mb-2" key={index}>
      <OperationField label="Código do teste" value={test.test_code} onChange={e => change(index, 'test_code', e.target.value)} />
      <label className="form-label" htmlFor={`test-${test.localId}`}>Resultado</label>
      <select id={`test-${test.localId}`} className="form-select mb-3" value={test.result} onChange={e => change(index, 'result', e.target.value)}><option value="">Não informado</option><option value="pass">Aprovado</option><option value="fail">Reprovado</option></select>
      <OperationField label="Notas do teste" value={test.notes} onChange={e => change(index, 'notes', e.target.value)} />
      <Button size="sm" variant="outline-danger" onClick={() => onChange(tests.filter((_, i) => i !== index))}>Remover teste</Button>
    </div>)}
    <Button size="sm" variant="outline-secondary" onClick={() => onChange([...tests, { test_code: '', result: '', notes: '', localId: crypto.randomUUID() }])}>Adicionar teste</Button>
  </div>;
}

function PricingSnapshot({ snapshot }) {
  return <div className="border rounded p-3 my-3"><h6>Preço congelado no despacho</h6>
    <p>Situação: {snapshot.status || '—'} · Versão: {snapshot.version ?? '—'}</p>
    <p>Custo: {snapshot.technician_cost_cents ?? snapshot.cost_cents ?? '—'} centavos · Markup: {snapshot.markup_percent ?? '—'}% · Preço ao cliente: {snapshot.client_price_cents ?? snapshot.total_cents ?? '—'} centavos · {snapshot.currency_code || ''}</p>
  </div>;
}

function CustodyPanel({ workOrderUid, selfService }) {
  const { token, selectedOrganizationUid } = useSession();
  const list = useOffsetList(listCustody, { params: { organizationUid: selectedOrganizationUid, selfService } });
  const action = useOperationalAction();
  const [pending, setPending] = useState(null);
  const [notes, setNotes] = useState('');
  const [condition, setCondition] = useState('testing');
  const rows = list.items.filter(row => row.uid_work_order === workOrderUid);
  const run = operation => action.run(operation, () => { setPending(null); list.refresh(); notifySuccess('Custódia atualizada.'); }, () => { setPending(null); list.setItems([]); });
  return <div className="card panel p-4 mb-3"><h5>Custódias desta OS</h5>
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    {list.error && <Alert variant="danger">{list.error}</Alert>}
    {list.loading && <p>Carregando custódias...</p>}
    {!list.loading && !rows.length && <p>Nenhuma custódia desta OS nas páginas carregadas.</p>}
    {rows.map(row => <div className="border rounded p-3 mb-2" key={row.uid}>
      <p>Dispositivo: {row.device_serial || row.uid_device} · <StatusBadge status={row.status} /></p>
      {custodyNeedsConfirmation(row) && <Button size="sm" disabled={action.busy} onClick={() => setPending({ row, type: 'confirm' })}>Confirmar recebimento</Button>}
      {!selfService && !row.closed_at && row.status === 'return_pending' && <div className="d-flex gap-2 flex-wrap">
        <Button size="sm" variant="outline-secondary" disabled={action.busy} onClick={() => setPending({ row, type: 'declare' })}>Declarar devolução</Button>
        <Button size="sm" disabled={action.busy} onClick={() => setPending({ row, type: 'receive' })}>Receber fisicamente</Button>
      </div>}
    </div>)}
    {pending && <form className="border rounded p-3 my-3" onSubmit={event => {
      event.preventDefault();
      const custodyUid = pending.row.uid;
      void run(signal => pending.type === 'confirm' ? confirmCustody({ token, custodyUid, selfService, signal }) : pending.type === 'receive' ? receiveReturn({ token, custodyUid, signal }) : declareReturn({ token, custodyUid, body: { condition, notes }, signal }));
    }}><fieldset disabled={action.busy}>
      <p>Confirma {pending.type === 'receive' ? 'o recebimento físico e fechamento' : pending.type === 'confirm' ? 'o recebimento pelo executor' : 'a declaração de devolução'} da custódia de {pending.row.device_serial || pending.row.uid_device}?</p>
      {pending.type === 'declare' && <><OperationField label="Condição do dispositivo" required value={condition} onChange={e => setCondition(e.target.value)} /><OperationField label="Notas da devolução" multiline value={notes} onChange={e => setNotes(e.target.value)} /></>}
      <Button type="submit" size="sm">Confirmar</Button>{' '}<Button size="sm" variant="outline-secondary" onClick={() => setPending(null)}>Cancelar</Button>
    </fieldset></form>}
    {!list.loading && list.hasMore && <Button size="sm" variant="outline-secondary" onClick={list.loadMore}>Consultar mais custódias</Button>}
  </div>;
}
