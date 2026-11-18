'use client';

import { useRef, useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormDrawer from '@/components/admin/FormDrawer';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { areaAllowed, OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createMaintenance, getMaintenance, getMaintenanceAssetStatus, listMaintenance, patchMaintenance, transitionMaintenance } from '@/lib/api/endpoints/maintenance';
import { intentKey, maintenanceBody, requiredText } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

export default function MaintenancePage() { return <OperationalGate area="maintenance"><Maintenance /></OperationalGate>; }
function Maintenance() {
  const { token, selectedOrganizationUid, areaAccess } = useSession();
  // Access-context exposes areas, not the fleet_admin capability. The API
  // revalidates that additional write permission on every mutation.
  const canWrite = areaAllowed(areaAccess, 'assets');
  const list = useOffsetList(listMaintenance, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const [detail, setDetail] = useState(null);
  const [assetStatus, setAssetStatus] = useState(null);
  const [description, setDescription] = useState('');
  const [newItem, setNewItem] = useState('');
  const [itemEdits, setItemEdits] = useState({});
  const [newCondition, setNewCondition] = useState('');
  const [blocking, setBlocking] = useState(false);
  const [resolved, setResolved] = useState([]);
  const [pendingTransition, setPendingTransition] = useState(null);
  const args = { token, organizationUid: selectedOrganizationUid };
  const deny = () => { setDetail(null); setForm(null); setAssetStatus(null); setPendingTransition(null); list.setItems([]); };
  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const open = row => action.run(signal => getMaintenance({ ...args, uid: row.uid, signal }), result => {
    const record = result.item ?? result;
    setDetail(record); setDescription(record.description || ''); setResolved([]); setAssetStatus(null); setPendingTransition(null); setNewItem(''); setItemEdits({}); setNewCondition(''); setBlocking(false);
  }, deny);
  const refreshDetail = signal => getMaintenance({ ...args, uid: detail.uid, signal });
  const save = event => {
    event.preventDefault();
    if (!canWrite) return;
    void action.run(signal => {
      const body = maintenanceBody(form, selectedOrganizationUid);
      return createMaintenance({ token, body, idempotencyKey: intentKey(intention, 'create-maintenance', body), signal });
    }, () => { setForm(null); list.refresh(); notifySuccess('Manutenção criada.'); }, deny);
  };
  const patch = event => {
    event.preventDefault();
    if (!canWrite) return;
    void action.run(async signal => {
      const body = { description: requiredText(description, 'a descrição') };
      const edited = Object.entries(itemEdits).map(([uid, item]) => ({ uid, description: requiredText(item.description, 'a descrição do item'), notes: item.notes?.trim() || '' }));
      if (newItem.trim()) edited.push({ description: newItem.trim() });
      if (edited.length) body.items = edited;
      if (newCondition.trim()) body.conditions = [{ description: newCondition.trim(), blocking }];
      await patchMaintenance({ ...args, uid: detail.uid, body, signal });
      return refreshDetail(signal);
    }, result => { setDetail(result.item ?? result); setNewItem(''); setItemEdits({}); setNewCondition(''); list.refresh(); notifySuccess('Manutenção atualizada.'); }, deny);
  };
  const transition = () => {
    if (!canWrite) return;
    void action.run(async signal => {
      const body = { status: pendingTransition, ...(pendingTransition === 'completed' ? { resolve_conditions: resolved } : {}) };
      await transitionMaintenance({ ...args, uid: detail.uid, body, idempotencyKey: intentKey(intention, `transition:${detail.uid}`, body), signal });
      return refreshDetail(signal);
    }, result => { setDetail(result.item ?? result); setPendingTransition(null); setResolved([]); list.refresh(); notifySuccess('Situação atualizada.'); }, deny);
  };
  const terminal = detail && ['completed', 'cancelled'].includes(detail.status);
  return <>
    <PageBreadcrumb title="Manutenção" subTitle1="Operação" />
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    {!canWrite && <Alert variant="info">Seu contexto permite consultar manutenções. A edição exige administração de frota.</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar por descrição..." actionLabel={canWrite ? 'Nova manutenção' : undefined} actionDisabled={action.busy} onAction={() => { action.clearError(); intention.current = null; setForm({ uid_asset: '', description: '', items: [{ description: '' }], conditions: [] }); }} />
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} onRowClick={row => { if (!action.busy) void open(row); }} columns={[
      { key: 'asset', label: 'Ativo', render: row => row.asset_identification || row.uid_asset }, { key: 'description', label: 'Descrição' }, { key: 'origin_kind', label: 'Origem' }, { key: 'status', label: 'Situação', render: row => <StatusBadge status={row.status} /> }
    ]} />
    {form && canWrite && <FormDrawer show title="Nova manutenção" submitting={action.busy} error={action.error} onSubmit={save} onHide={() => { if (!action.busy) setForm(null); }}><fieldset disabled={action.busy}>
      <OperationField label="UUID do ativo" required value={form.uid_asset} onChange={e => set('uid_asset', e.target.value)} />
      <OperationField label="Descrição" required multiline value={form.description} onChange={e => set('description', e.target.value)} />
      {form.items.map((item, index) => <div className="border rounded p-2 mb-2" key={index}>
        <OperationField label={`Item ${index + 1}`} required value={item.description} onChange={e => set('items', form.items.map((row, i) => i === index ? { ...row, description: e.target.value } : row))} />
        <Button size="sm" variant="outline-danger" disabled={form.items.length === 1} onClick={() => set('items', form.items.filter((_, i) => i !== index))}>Remover item</Button>
      </div>)}
      <Button size="sm" variant="outline-secondary" onClick={() => set('items', [...form.items, { description: '' }])}>Adicionar item</Button>
      <h6 className="mt-3">Condições do ativo</h6>
      {form.conditions.map((condition, index) => <div className="border rounded p-2 mb-2" key={index}>
        <OperationField label="Descrição da condição" required value={condition.description} onChange={e => set('conditions', form.conditions.map((row, i) => i === index ? { ...row, description: e.target.value } : row))} />
        <label className="d-block mb-2"><input type="checkbox" checked={condition.blocking} onChange={e => set('conditions', form.conditions.map((row, i) => i === index ? { ...row, blocking: e.target.checked } : row))} /> Bloqueia a disponibilidade operacional</label>
        <Button size="sm" variant="outline-danger" onClick={() => set('conditions', form.conditions.filter((_, i) => i !== index))}>Remover condição</Button>
      </div>)}
      <Button size="sm" variant="outline-secondary" onClick={() => set('conditions', [...form.conditions, { description: '', blocking: false }])}>Adicionar condição</Button>
    </fieldset></FormDrawer>}
    <Modal show={!!detail} onHide={() => { if (!action.busy) setDetail(null); }} size="lg">
      <Modal.Header closeButton={!action.busy}><Modal.Title>Detalhes da manutenção</Modal.Title></Modal.Header>
      <Modal.Body>{detail && <>
        {action.error && <Alert variant="danger">{action.error}</Alert>}
        <p>Ativo: {detail.asset_identification || detail.uid_asset} · Origem: {detail.origin_kind}</p>
        <StatusBadge status={detail.status} />
        <p className="mt-3">{detail.description}</p>
        <h6>Itens</h6><ul>{(detail.items || []).map((item, i) => <li key={item.uid || i}>{item.description || 'Item sem descrição'}{item.notes ? ` · ${item.notes}` : ''}</li>)}</ul>
        <h6>Condições</h6>
        {(detail.conditions || []).map(condition => <div className="border rounded p-2 mb-2" key={condition.uid}>
          <p>{condition.description} · {condition.blocking ? 'Bloqueante' : 'Não bloqueante'} · {condition.status}</p>
          {canWrite && !terminal && condition.status === 'open' && <label><input type="checkbox" checked={resolved.includes(condition.uid)} onChange={e => setResolved(e.target.checked ? [...resolved, condition.uid] : resolved.filter(uid => uid !== condition.uid))} /> Resolver esta condição ao concluir</label>}
        </div>)}
        <Button size="sm" variant="outline-secondary" disabled={action.busy} onClick={() => action.run(signal => getMaintenanceAssetStatus({ ...args, assetUid: detail.uid_asset, signal }), setAssetStatus, deny)}>Consultar disponibilidade do ativo</Button>
        {assetStatus && <Alert className="mt-2" variant={assetStatus.operational_available ? 'success' : 'warning'}>{assetStatus.operational_available ? 'Ativo operacionalmente disponível.' : 'Ativo com condições bloqueantes abertas.'}</Alert>}
        {canWrite && !terminal && <>
          <form onSubmit={patch} className="border-top mt-3 pt-3"><fieldset disabled={action.busy}>
            <OperationField label="Descrição" required multiline value={description} onChange={e => setDescription(e.target.value)} />
            {(detail.items || []).filter(item => item.uid).map((item, index) => {
              const edit = itemEdits[item.uid] || item;
              return <div className="border rounded p-2 mb-2" key={item.uid}>
                <OperationField label={`Descrição do item ${index + 1}`} required value={edit.description || ''} onChange={e => setItemEdits({ ...itemEdits, [item.uid]: { ...edit, description: e.target.value } })} />
                <OperationField label={`Notas do item ${index + 1}`} value={edit.notes || ''} onChange={e => setItemEdits({ ...itemEdits, [item.uid]: { ...edit, notes: e.target.value } })} />
              </div>;
            })}
            <OperationField label="Adicionar item (opcional)" value={newItem} onChange={e => setNewItem(e.target.value)} />
            <OperationField label="Abrir condição (opcional)" value={newCondition} onChange={e => setNewCondition(e.target.value)} />
            <label className="d-block mb-3"><input type="checkbox" checked={blocking} onChange={e => setBlocking(e.target.checked)} /> Nova condição bloqueante</label>
            <Button size="sm" type="submit">Salvar alterações</Button>
          </fieldset></form>
          <div className="d-flex gap-2 mt-3">
            {detail.status === 'open' && <Button size="sm" disabled={action.busy} onClick={() => setPendingTransition('in_progress')}>Iniciar</Button>}
            <Button size="sm" variant="success" disabled={action.busy} onClick={() => setPendingTransition('completed')}>Concluir</Button>
            <Button size="sm" variant="outline-danger" disabled={action.busy} onClick={() => setPendingTransition('cancelled')}>Cancelar manutenção</Button>
          </div>
          {pendingTransition && <Alert variant="warning" className="mt-3"><p>Confirma a mudança para {pendingTransition === 'completed' ? 'concluída' : pendingTransition === 'cancelled' ? 'cancelada' : 'em andamento'}?{pendingTransition === 'completed' ? ` ${resolved.length} condição(ões) serão resolvidas.` : ''}</p><Button size="sm" disabled={action.busy} onClick={transition}>Confirmar mudança</Button>{' '}<Button size="sm" variant="outline-secondary" disabled={action.busy} onClick={() => setPendingTransition(null)}>Voltar</Button></Alert>}
        </>}
      </>}</Modal.Body>
    </Modal>
  </>;
}
