'use client';

import { useEffect, useState } from 'react';
import { Alert, Badge, Button, FormSelect, Modal, Nav } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import { ProtocolIdentitiesTab, TelemetryMappingsTab } from '@/components/admin/DeviceResolutionTabs';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { useOffsetList } from '@/hooks/useOffsetList';
import {
  createDevice, createSimcard, deleteSimcard, getDevice, linkSimcard, listDeviceManufacturers, listDeviceModels,
  listDevices, listDeviceTypes, listLinkedSimcards, listSimcards, patchDeviceLifecycle, swapLinkedSimcard, unlinkSimcard
} from '@/lib/api/endpoints/devices';
import { isApiError } from '@/lib/api/errors';
import { normalizeList } from '@/lib/api/http';
import { areaAllowed } from '@/lib/navigation/access';
import { useSession } from '@/lib/session/SessionContext';

const DevicesSimPage = () => {
  const { areaAccess } = useSession();
  const canDevices = areaAllowed(areaAccess, 'devices');
  const canSims = areaAllowed(areaAccess, 'simcards');
  const [selectedTab, setTab] = useState('devices');
  const tab = !canDevices ? 'simcards' : selectedTab === 'simcards' && !canSims ? 'devices' : selectedTab;
  return (
    <div className="content-wrapper">
      <PageBreadcrumb title="Devices & SIM" subTitle1="Operação" />
      <Nav variant="tabs" activeKey={tab} onSelect={k => setTab(k)} className="mb-3">
        {canDevices && <Nav.Item><Nav.Link eventKey="devices">Devices</Nav.Link></Nav.Item>}
        {canSims && <Nav.Item><Nav.Link eventKey="simcards">SIM cards</Nav.Link></Nav.Item>}
        {canDevices && <Nav.Item><Nav.Link eventKey="identities">Identidades de protocolo</Nav.Link></Nav.Item>}
        {canDevices && <Nav.Item><Nav.Link eventKey="mappings">Mapeamentos de telemetria</Nav.Link></Nav.Item>}
      </Nav>
      {tab === 'devices' && canDevices && <DevicesTab canSims={canSims} />}
      {tab === 'simcards' && canSims && <SimcardsTab />}
      {tab === 'identities' && canDevices && <ProtocolIdentitiesTab />}
      {tab === 'mappings' && canDevices && <TelemetryMappingsTab />}
    </div>
  );
};

const EMPTY_DEVICE_FORM = { typeUid: '', manufacturerUid: '', modelUid: '', deviceSerial: '', deviceImei: '', devicePwd: '' };

const DevicesTab = ({ canSims }) => {
  const { token, selectedOrganizationUid } = useSession();
  const { q, setQ, items, hasMore, loadMore, loading, error, refresh } = useOffsetList(listDevices, {
    params: { organizationUid: selectedOrganizationUid, includeInactive: true }
  });
  const { items: simItems, refresh: refreshSims } = useOffsetList(listSimcards, {
    params: { organizationUid: selectedOrganizationUid }, enabled: canSims
  });

  // Catálogo (tipo → fabricante → modelo), mesmo padrão de assets/frota.
  const [types, setTypes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  useEffect(() => {
    if (!token) return;
    listDeviceTypes({ token }).then(res => setTypes(normalizeList(res).items)).catch(() => {});
  }, [token]);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_DEVICE_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [detail, setDetail] = useState(null);
  const [link, setLink] = useState(null);
  const [detailBusy, setDetailBusy] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [linkChoice, setLinkChoice] = useState('');

  const [lifecycleOpen, setLifecycleOpen] = useState(false);
  const [lifecycleState, setLifecycleState] = useState('blocked');
  const [lifecycleReason, setLifecycleReason] = useState('');

  const openCreate = () => { setForm(EMPTY_DEVICE_FORM); setManufacturers([]); setModels([]); setFormError(null); setShowCreate(true); };

  const onTypeChange = async typeUid => {
    setForm(f => ({ ...f, typeUid, manufacturerUid: '', modelUid: '' }));
    setManufacturers([]); setModels([]);
    if (!typeUid) return;
    try {
      const res = await listDeviceManufacturers({ token, typeUid });
      setManufacturers(normalizeList(res).items);
    } catch { /* fabricante segue vazio */ }
  };

  const onManufacturerChange = async manufacturerUid => {
    setForm(f => ({ ...f, manufacturerUid, modelUid: '' }));
    setModels([]);
    if (!manufacturerUid) return;
    try {
      const res = await listDeviceModels({ token, typeUid: form.typeUid || undefined, manufacturerUid });
      setModels(normalizeList(res).items);
    } catch { /* modelo segue vazio */ }
  };

  const handleCreate = async event => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createDevice({
        token, organizationUid: selectedOrganizationUid, typeUid: form.typeUid, manufacturerUid: form.manufacturerUid,
        modelUid: form.modelUid, deviceSerial: form.deviceSerial, deviceImei: form.deviceImei || undefined,
        devicePwd: form.devicePwd || undefined, active: true, transmits: true, idempotencyKey: crypto.randomUUID()
      });
      setShowCreate(false);
      refresh();
    } catch (err) {
      setFormError(isApiError(err) ? `Não foi possível criar o device (${err.code || err.status}).` : 'Falha de rede.');
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async row => {
    setDetail(row);
    setDetailError(null);
    setLinkChoice('');
    setLink(null);
    if (canSims && row.uid_linked_simcard) {
      try {
        const result = await listLinkedSimcards({ token, organizationUid: selectedOrganizationUid, deviceUid: row.uid });
        setLink(normalizeList(result).items[0] ?? null);
      } catch {
        setDetailError('Não foi possível carregar o vínculo de SIM.');
      }
    }
  };

  const openLifecycle = () => {
    setLifecycleState(detail.active ? 'blocked' : 'active');
    setLifecycleReason('');
    setLifecycleOpen(true);
  };

  // reason é obrigatório em QUALQUER estado nesta API (inclusive "active").
  const saveLifecycle = async event => {
    event.preventDefault();
    if (!lifecycleReason.trim()) {
      setDetailError('Informe o motivo.');
      return;
    }
    setDetailBusy(true);
    setDetailError(null);
    try {
      const result = await patchDeviceLifecycle({ token, deviceUid: detail.uid, state: lifecycleState, reason: lifecycleReason.trim() });
      const refreshed = await getDevice({ token, deviceUid: detail.uid, includeInactive: true });
      setDetail(refreshed);
      if (result.simcard_unlinked) setLink(null);
      setLifecycleOpen(false);
      refresh();
      refreshSims();
    } catch {
      setDetailError('Não foi possível alterar a situação do device.');
    } finally {
      setDetailBusy(false);
    }
  };

  const handleLink = async () => {
    if (!linkChoice) return;
    setDetailBusy(true);
    setDetailError(null);
    try {
      const created = await linkSimcard({ token, deviceUid: detail.uid, simcardUid: linkChoice });
      setDetail(prev => ({ ...prev, uid_linked_simcard: linkChoice }));
      setLink(created);
      setLinkChoice('');
      refreshSims();
    } catch {
      setDetailError('Não foi possível vincular o SIM.');
    } finally {
      setDetailBusy(false);
    }
  };

  // Troca o SIM do device sem desativar — usa o link existente.
  const handleSwap = async () => {
    if (!linkChoice || !link) return;
    setDetailBusy(true);
    setDetailError(null);
    try {
      const updated = await swapLinkedSimcard({ token, linkUid: link.uid, deviceUid: detail.uid, simcardUid: linkChoice });
      setDetail(prev => ({ ...prev, uid_linked_simcard: linkChoice }));
      setLink(updated);
      setLinkChoice('');
      refreshSims();
    } catch {
      setDetailError('Não foi possível trocar o SIM.');
    } finally {
      setDetailBusy(false);
    }
  };

  const handleUnlink = async () => {
    if (!link) return;
    setDetailBusy(true);
    setDetailError(null);
    try {
      await unlinkSimcard({ token, linkUid: link.uid });
      setDetail(prev => ({ ...prev, uid_linked_simcard: null }));
      setLink(null);
      refreshSims();
    } catch {
      setDetailError('Não foi possível desvincular o SIM.');
    } finally {
      setDetailBusy(false);
    }
  };

  const catalogLabel = row => {
    const t = types.find(x => x.uid === row.uid_type);
    return [t?.name, row.uid_model].filter(Boolean).join(' · ') || row.uid_model;
  };
  const simLabel = uid => simItems.find(s => s.uid === uid)?.iccid || uid;
  const availableSims = simItems.filter(s => !s.uid_linked_device);

  const columns = [
    { key: 'device_serial', label: 'Serial' },
    { key: 'catalog', label: 'Modelo', render: catalogLabel },
    { key: 'active', label: 'Ativo', render: row => <StatusBadge status={row.active ? 'active' : 'inactive'} /> },
    { key: 'sim', label: 'SIM vinculado', render: row => (row.uid_linked_simcard ? simLabel(row.uid_linked_simcard) : '—') }
  ];

  return (
    <>
      <ListToolbar q={q} onChangeQ={setQ} placeholder="Buscar por serial..." createLabel="Novo device" onAction={openCreate} />
      <DataTable
        columns={columns} rows={items} loading={loading} error={error} hasMore={hasMore} onLoadMore={loadMore}
        onRowClick={openDetail}
        emptyMessage="Nenhum device cadastrado nesta organização."
      />

      <FormModal show={showCreate} onHide={() => setShowCreate(false)} title="Novo device" onSubmit={handleCreate} submitting={submitting} error={formError}>
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <FormSelect required value={form.typeUid} onChange={e => onTypeChange(e.target.value)}>
            <option value="">Selecione...</option>
            {types.map(t => <option key={t.uid} value={t.uid}>{t.name}</option>)}
          </FormSelect>
        </div>
        <div className="mb-3">
          <label className="form-label">Fabricante</label>
          <FormSelect required value={form.manufacturerUid} onChange={e => onManufacturerChange(e.target.value)} disabled={!form.typeUid}>
            <option value="">Selecione...</option>
            {manufacturers.map(m => <option key={m.uid} value={m.uid}>{m.name}</option>)}
          </FormSelect>
        </div>
        <div className="mb-3">
          <label className="form-label">Modelo</label>
          <FormSelect required value={form.modelUid} onChange={e => setForm(f => ({ ...f, modelUid: e.target.value }))} disabled={!form.manufacturerUid}>
            <option value="">Selecione...</option>
            {models.map(m => <option key={m.uid} value={m.uid}>{m.name}</option>)}
          </FormSelect>
        </div>
        <div className="mb-3">
          <label className="form-label">Serial</label>
          <input className="form-control" required value={form.deviceSerial} onChange={e => setForm(f => ({ ...f, deviceSerial: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="form-label">IMEI (opcional)</label>
          <input className="form-control" value={form.deviceImei} onChange={e => setForm(f => ({ ...f, deviceImei: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha do device (opcional)</label>
          <input type="password" className="form-control" value={form.devicePwd} onChange={e => setForm(f => ({ ...f, devicePwd: e.target.value }))} autoComplete="new-password" />
          <p className="text-muted small mt-1 mb-0">Entrada protegida; nunca é exibida depois de salva.</p>
        </div>
      </FormModal>

      <Modal show={Boolean(detail)} onHide={() => setDetail(null)} centered>
        {detail && (
          <>
            <Modal.Header closeButton><Modal.Title className="fs-5">{detail.device_serial}</Modal.Title></Modal.Header>
            <Modal.Body>
              {detailError && <Alert variant="danger" className="py-2 small">{detailError}</Alert>}
              <p className="mb-2"><strong>Modelo:</strong> {catalogLabel(detail)}</p>
              <p className="mb-3 d-flex align-items-center gap-2">
                <strong>Status:</strong> <StatusBadge status={detail.active ? 'active' : 'inactive'} />
                <Button size="sm" variant="outline-secondary" disabled={detailBusy} onClick={openLifecycle}>Alterar situação</Button>
              </p>
              {canSims && <>
              <hr />
              <h6>SIM vinculado</h6>
              {detail.uid_linked_simcard ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{simLabel(detail.uid_linked_simcard)}</span>
                    <Button size="sm" variant="outline-danger" disabled={detailBusy || !link} onClick={handleUnlink}>Desvincular</Button>
                  </div>
                  <p className="text-muted small mt-2 mb-1">Trocar por outro SIM (sem precisar desativar o device):</p>
                  <div className="d-flex gap-2">
                    <FormSelect value={linkChoice} onChange={e => setLinkChoice(e.target.value)} disabled={!link}>
                      <option value="">Selecione um SIM disponível...</option>
                      {availableSims.map(s => <option key={s.uid} value={s.uid}>{s.iccid}</option>)}
                    </FormSelect>
                    <Button size="sm" disabled={!linkChoice || detailBusy || !link} onClick={handleSwap}>Trocar</Button>
                  </div>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <FormSelect value={linkChoice} onChange={e => setLinkChoice(e.target.value)} disabled={!detail.active}>
                    <option value="">Selecione um SIM disponível...</option>
                    {availableSims.map(s => <option key={s.uid} value={s.uid}>{s.iccid}</option>)}
                  </FormSelect>
                  <Button size="sm" disabled={!linkChoice || detailBusy || !detail.active} onClick={handleLink}>Vincular</Button>
                </div>
              )}
              {!detail.active && !detail.uid_linked_simcard && (
                <p className="text-muted small mt-2 mb-0">Reative o device para vincular um SIM.</p>
              )}
              </>}
            </Modal.Body>
          </>
        )}
      </Modal>

      <FormModal
        show={lifecycleOpen} onHide={() => setLifecycleOpen(false)} title="Alterar situação" onSubmit={saveLifecycle} submitting={detailBusy}
      >
        <div className="mb-3">
          <label className="form-label">Novo estado</label>
          <FormSelect value={lifecycleState} onChange={e => setLifecycleState(e.target.value)}>
            <option value="active">Ativo</option>
            <option value="blocked">Bloqueado</option>
            <option value="inactive">Inativo</option>
          </FormSelect>
        </div>
        <div className="mb-3">
          <label className="form-label">Motivo <span className="text-danger">*</span></label>
          <textarea className="form-control" rows={3} required value={lifecycleReason} onChange={e => setLifecycleReason(e.target.value)} />
        </div>
        <p className="text-muted small mb-0">Sair de "Ativo" libera o SIM vinculado automaticamente. Reativar não reassocia SIM.</p>
      </FormModal>
    </>
  );
};

const SimcardsTab = () => {
  const { token, selectedOrganizationUid } = useSession();
  const { q, setQ, items, hasMore, loadMore, loading, error, refresh } = useOffsetList(listSimcards, {
    params: { organizationUid: selectedOrganizationUid }
  });
  const [showCreate, setShowCreate] = useState(false);
  const [iccid, setIccid] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [rowError, setRowError] = useState(null);

  const handleCreate = async event => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createSimcard({ token, organizationUid: selectedOrganizationUid, iccid, active: true, idempotencyKey: crypto.randomUUID() });
      setShowCreate(false);
      setIccid('');
      refresh();
    } catch (err) {
      setFormError(isApiError(err) ? `Não foi possível criar o SIM (${err.code || err.status}).` : 'Falha de rede.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async sim => {
    setRowError(null);
    try {
      await deleteSimcard({ token, simcardUid: sim.uid });
      refresh();
    } catch (err) {
      const code = isApiError(err) ? err.code : null;
      setRowError(code === 'device_reference_conflict'
        ? `O SIM ${sim.iccid} está vinculado a um device e não pode ser excluído.`
        : 'Não foi possível excluir o SIM.');
    }
  };

  const columns = [
    { key: 'iccid', label: 'ICCID' },
    { key: 'active', label: 'Ativo', render: row => <StatusBadge status={row.active ? 'active' : 'inactive'} /> },
    { key: 'linked', label: 'Vinculado', render: row => (row.uid_linked_device ? <Badge bg="info" text="dark">Sim</Badge> : '—') },
    {
      key: 'actions', label: '', render: row => (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={e => { e.stopPropagation(); handleDelete(row); }}>
          Excluir
        </button>
      )
    }
  ];

  return (
    <>
      {rowError && <p className="text-danger small">{rowError}</p>}
      <ListToolbar q={q} onChangeQ={setQ} placeholder="Buscar por ICCID..." createLabel="Novo SIM" onAction={() => setShowCreate(true)} />
      <DataTable columns={columns} rows={items} loading={loading} error={error} hasMore={hasMore} onLoadMore={loadMore} emptyMessage="Nenhum SIM cadastrado." />

      <FormModal show={showCreate} onHide={() => setShowCreate(false)} title="Novo SIM" onSubmit={handleCreate} submitting={submitting} error={formError}>
        <div className="mb-3">
          <label className="form-label">ICCID</label>
          <input className="form-control" required value={iccid} onChange={e => setIccid(e.target.value)} />
        </div>
      </FormModal>
    </>
  );
};

export default DevicesSimPage;
