'use client';

import { useRouter } from 'next/navigation';
import { useDetailParam } from '@/lib/navigation/useDetailParam';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import AssetLinkHistory from '@/components/admin/AssetLinkHistory';
import AssetValuation from '@/components/admin/AssetValuation';
import { AssetPackage } from '@/components/admin/TechnicalPackages';
import FormModal from '@/components/admin/FormModal';
import OrganizationGate from '@/components/admin/OrganizationGate';
import { PlatformImage } from '@/components/admin/PlatformLogo';
import StatusBadge from '@/components/admin/StatusBadge';
import { getEntity, searchUnits } from '@/lib/api/endpoints/entities';
import {
  addParticipation, deleteAsset, getAsset, listAssetModels, listDeviceSlots, listFuels, listGroupAssets, listGroups,
  patchAsset, patchAssetLifecycle, removeParticipation
} from '@/lib/api/endpoints/fleet';
import { situationsApi } from '@/lib/api/endpoints/situations';
import { ApiError, errorMessage } from '@/lib/api/errors';
import { normalizeList } from '@/lib/api/http';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';
import { ASSET_PROFILE_LABELS, situationBadgeStatus, situationName } from '@/lib/domain/fleet';

const AssetDetailInner = ({ uid }) => {
  const router = useRouter();
  const { token, selectedOrganizationUid: orgUid } = useSession();

  const [asset, setAsset] = useState(null);
  const [entityName, setEntityName] = useState(null);
  const [situations, setSituations] = useState({});
  const [fuels, setFuels] = useState([]);
  const [units, setUnits] = useState([]);
  const [groups, setGroups] = useState([]);
  const [models, setModels] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const [addGroup, setAddGroup] = useState('');
  const [busyPart, setBusyPart] = useState(false);

  const [lifecycleOpen, setLifecycleOpen] = useState(false);
  const [lifecycle, setLifecycle] = useState({ state: 'blocked', reason: '' });
  const [savingLifecycle, setSavingLifecycle] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const loadParticipations = useCallback(async () => {
    try {
      const res = await listGroupAssets({ token, organizationUid: orgUid, assetUid: uid });
      setParticipations(normalizeList(res).items);
    } catch { setParticipations([]); }
  }, [token, orgUid, uid]);

  const load = useCallback(async (signal) => {
    if (!signal) {
      setLoading(true);
      setError(null);
    }
    try {
      const detail = await getAsset({ token, assetUid: uid, signal });
      if (signal?.aborted) return;
      if (detail?.uid_organization !== orgUid) throw new ApiError(404, null, null);
      setAsset(detail);
      const [sit, fuelRes, grpRes, slotRes, modelRes] = await Promise.all([
        situationsApi.list({ token, limit: 100 }).catch(() => null),
        listFuels({ token }).catch(() => null),
        listGroups({ token, organizationUid: orgUid }).catch(() => null),
        listDeviceSlots({ token, assetUid: uid, signal }).catch(() => null),
        listAssetModels({ token }).catch(() => null)
      ]);
      if (signal?.aborted) return;
      if (sit) { const m = {}; for (const s of normalizeList(sit).items) m[s.uid] = s; setSituations(m); }
      setFuels(fuelRes ? normalizeList(fuelRes).items : []);
      setGroups(grpRes ? normalizeList(grpRes).items : []);
      setSlots(slotRes ? normalizeList(slotRes).items : []);
      setModels(modelRes ? normalizeList(modelRes).items : []);
      if (detail.uid_entity) {
        getEntity({ token, entityUid: detail.uid_entity }).then(e => setEntityName(e.name)).catch(() => {});
        searchUnits({ token, organizationUid: orgUid, entityUid: detail.uid_entity })
          .then(u => setUnits(normalizeList(u).items)).catch(() => {});
      }
      await loadParticipations();
    } catch (err) {
      if (!signal?.aborted) setError(errorMessage(err));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [token, uid, orgUid, loadParticipations]);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => { if (!controller.signal.aborted) void load(controller.signal); });
    return () => controller.abort();
  }, [load]);

  const openEdit = () => {
    setForm({
      identification: asset.identification ?? '', uid_unit: asset.uid_unit ?? '', uid_fuel: asset.uid_fuel ?? '',
      uid_model: asset.uid_model ?? '', plate: asset.vehicle?.plate ?? '', model_year: asset.vehicle?.model_year ?? ''
    });
    setEditOpen(true);
  };

  const saveEdit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const body = {
        identification: form.identification, uid_unit: form.uid_unit || null, uid_fuel: form.uid_fuel || null,
        uid_model: form.uid_model || null
      };
      if (asset.vehicle || form.plate || form.model_year) {
        body.vehicle = { plate: form.plate || null, model_year: form.model_year ? Number(form.model_year) : null };
      }
      await patchAsset({ token, assetUid: uid, body });
      notifySuccess('Asset atualizado.');
      setEditOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSaving(false); }
  };

  const openLifecycle = () => { setLifecycle({ state: 'blocked', reason: '' }); setLifecycleOpen(true); };
  const saveLifecycle = async event => {
    event.preventDefault();
    if (lifecycle.state !== 'active' && !lifecycle.reason.trim()) {
      notifyError(new Error('Informe o motivo.'));
      return;
    }
    setSavingLifecycle(true);
    try {
      await patchAssetLifecycle({ token, assetUid: uid, state: lifecycle.state, reason: lifecycle.reason.trim() || undefined });
      notifySuccess('Situação alterada.');
      setLifecycleOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingLifecycle(false); }
  };

  const doDeleteAsset = async () => {
    if (!window.confirm('Excluir este asset? A exclusão é lógica e pode ser revertida reativando a situação.')) return;
    setDeleting(true);
    try {
      await deleteAsset({ token, assetUid: uid });
      notifySuccess('Asset excluído.');
      router.push('/frota');
    } catch (err) { notifyError(err); setDeleting(false); }
  };

  const doAddParticipation = async () => {
    if (!addGroup) return;
    setBusyPart(true);
    try {
      await addParticipation({ token, groupUid: addGroup, assetUid: uid });
      notifySuccess('Participação adicionada.');
      setAddGroup('');
      await Promise.all([loadParticipations(), load()]);
    } catch (err) { notifyError(err); } finally { setBusyPart(false); }
  };

  const doRemoveParticipation = async p => {
    setBusyPart(true);
    try {
      await removeParticipation({ token, participationUid: p.uid, groupUid: p.uid_group, assetUid: uid });
      notifySuccess('Participação removida.');
      await Promise.all([loadParticipations(), load()]);
    } catch (err) { notifyError(err); } finally { setBusyPart(false); }
  };

  const groupName = u => groups.find(g => g.uid === u)?.name || (u ? `${String(u).slice(0, 8)}…` : '—');
  const fuelName = u => fuels.find(f => f.uid === u)?.name;

  if (loading) return <div className="content-wrapper"><div className="text-center py-5"><Spinner animation="border" /></div></div>;
  if (error) return <div className="content-wrapper"><Alert variant="danger">{error}</Alert></div>;

  const assignedGroupUids = new Set(participations.map(p => p.uid_group));
  const addableGroups = groups.filter(g => !assignedGroupUids.has(g.uid));

  const details = (
      <Row className="g-3">
        <Col lg={6}>
          <Card className="panel">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="mb-0">Dados do asset</h5>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={openEdit}>Editar</Button>
                  <Button size="sm" variant="outline-danger" disabled={deleting} onClick={doDeleteAsset}>Excluir</Button>
                </div>
              </div>
              <dl className="row mb-0 small">
                <dt className="col-sm-5 text-muted">Identificação</dt><dd className="col-sm-7">{asset.identification}</dd>
                <dt className="col-sm-5 text-muted">Entidade</dt><dd className="col-sm-7">{entityName || <span className="font-monospace">{String(asset.uid_entity).slice(0, 8)}…</span>}</dd>
                <dt className="col-sm-5 text-muted">Perfil</dt><dd className="col-sm-7">{ASSET_PROFILE_LABELS[asset.asset_profile] || asset.asset_profile || '—'}</dd>
                <dt className="col-sm-5 text-muted">Situação</dt>
                <dd className="col-sm-7 d-flex align-items-center gap-2">
                  {asset.uid_situations ? <StatusBadge status={situationBadgeStatus(asset.uid_situations, situations)} label={situationName(asset.uid_situations, situations)} /> : '—'}
                  <Button size="sm" variant="link" className="p-0" onClick={openLifecycle}>Alterar</Button>
                </dd>
                <dt className="col-sm-5 text-muted">Modelo</dt><dd className="col-sm-7">{models.find(m => m.uid === asset.uid_model)?.name || '—'}</dd>
                <dt className="col-sm-5 text-muted">Combustível</dt><dd className="col-sm-7">{fuelName(asset.uid_fuel) || '—'}</dd>
                {asset.vehicle && <>
                  <dt className="col-sm-5 text-muted">Placa</dt><dd className="col-sm-7">{asset.vehicle.plate || '—'}</dd>
                  <dt className="col-sm-5 text-muted">Ano</dt><dd className="col-sm-7">{asset.vehicle.model_year || '—'}</dd>
                </>}
                <dt className="col-sm-5 text-muted">UID</dt><dd className="col-sm-7 font-monospace">{asset.uid}</dd>
              </dl>
              {asset.uid_organization === orgUid && asset.uid_image_logo && <div className="mt-3">
                <PlatformImage uid={asset.uid_image_logo} alt={`Imagem do asset ${asset.identification}`} />
              </div>}
              <p className="text-muted small mb-0 mt-3">Organização e entidade são imutáveis por este formulário.</p>
            </Card.Body>
          </Card>

          <Card className="panel mt-3">
            <Card.Body>
              <h5 className="mb-3">Slots de dispositivo</h5>
              {slots.length === 0 && <p className="text-muted small mb-0">Nenhum slot de dispositivo.</p>}
              {slots.map(s => (
                <div key={s.uid} className="d-flex justify-content-between border-bottom py-2 small">
                  <span>#{s.slot_number} · {s.name || s.code}</span>
                  <StatusBadge status={s.active ? 'active' : 'inactive'} />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="panel">
            <Card.Body>
              <h5 className="mb-1">Grupos (participações)</h5>
              <p className="text-muted small mb-3">O asset deve permanecer em ao menos um grupo.</p>
              {participations.length === 0 && <p className="text-muted small">Nenhuma participação.</p>}
              {participations.map(p => (
                <div key={p.uid} className="d-flex justify-content-between align-items-center border rounded px-3 py-2 mb-2">
                  <span>{groupName(p.uid_group)}</span>
                  <Button size="sm" variant="outline-danger" disabled={busyPart} onClick={() => doRemoveParticipation(p)}>Remover</Button>
                </div>
              ))}
              {addableGroups.length > 0 && (
                <div className="d-flex gap-2 mt-2">
                  <Form.Select value={addGroup} onChange={e => setAddGroup(e.target.value)}>
                    <option value="">Adicionar a um grupo...</option>
                    {addableGroups.map(g => <option key={g.uid} value={g.uid}>{g.name}</option>)}
                  </Form.Select>
                  <Button size="sm" disabled={!addGroup || busyPart} onClick={doAddParticipation}>Adicionar</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  );

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title={asset.identification} subTitle1="Operação" subTitle2="Frota" />

      <Tabs id="asset-detail-tabs" defaultActiveKey="details" className="mb-3" mountOnEnter unmountOnExit transition={false}>
        <Tab eventKey="details" title="Detalhes">
          {details}
        </Tab>
        <Tab eventKey="device-history" title="Histórico de dispositivos">
          <AssetLinkHistory token={token} assetUid={asset.uid} />
        </Tab>
        <Tab eventKey="valuation" title="Avaliação FIPE">
          <AssetValuation key={asset.uid} assetUid={asset.uid} />
        </Tab>
        <Tab eventKey="package" title="Pacote técnico">
          <AssetPackage key={`${orgUid}:${asset.uid}`} assetUid={asset.uid} organizationUid={orgUid} canManage={asset.uid_organization === orgUid} />
        </Tab>
      </Tabs>

      <FormModal show={editOpen} onHide={() => setEditOpen(false)} title="Editar asset" onSubmit={saveEdit} submitting={saving}>
        {form && (
          <>
            <div className="mb-3">
              <label className="form-label">Identificação</label>
              <input className="form-control" value={form.identification} onChange={e => setForm(f => ({ ...f, identification: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Unidade</label>
              <Form.Select value={form.uid_unit} onChange={e => setForm(f => ({ ...f, uid_unit: e.target.value }))}>
                <option value="">—</option>
                {units.map(u => <option key={u.uid} value={u.uid}>{u.name}</option>)}
              </Form.Select>
            </div>
            <div className="mb-3">
              <label className="form-label">Combustível</label>
              <Form.Select value={form.uid_fuel} onChange={e => setForm(f => ({ ...f, uid_fuel: e.target.value }))}>
                <option value="">—</option>
                {fuels.filter(f => f.active !== false || f.uid === asset.uid_fuel).map(f => <option key={f.uid} value={f.uid}>{f.name}</option>)}
              </Form.Select>
            </div>
            <div className="mb-3">
              <label className="form-label">Modelo <span className="text-muted small">(opcional)</span></label>
              <Form.Select value={form.uid_model} onChange={e => setForm(f => ({ ...f, uid_model: e.target.value }))}>
                <option value="">—</option>
                {models.filter(m => m.active !== false || m.uid === asset.uid_model).map(m => <option key={m.uid} value={m.uid}>{m.name}</option>)}
              </Form.Select>
            </div>
            <div className="row g-2">
              <div className="col-7 mb-2"><label className="form-label">Placa</label><input className="form-control" value={form.plate} onChange={e => setForm(f => ({ ...f, plate: e.target.value }))} /></div>
              <div className="col-5 mb-2"><label className="form-label">Ano</label><input type="number" className="form-control" value={form.model_year} onChange={e => setForm(f => ({ ...f, model_year: e.target.value }))} /></div>
            </div>
          </>
        )}
      </FormModal>

      <FormModal show={lifecycleOpen} onHide={() => setLifecycleOpen(false)} title="Alterar situação" onSubmit={saveLifecycle} submitting={savingLifecycle}>
        <div className="mb-3">
          <label className="form-label">Novo estado</label>
          <Form.Select value={lifecycle.state} onChange={e => setLifecycle(l => ({ ...l, state: e.target.value }))}>
            <option value="active">Ativo</option>
            <option value="blocked">Bloqueado</option>
            <option value="inactive">Inativo</option>
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Motivo {lifecycle.state !== 'active' && <span className="text-danger">*</span>}</label>
          <textarea className="form-control" rows={3} value={lifecycle.reason} onChange={e => setLifecycle(l => ({ ...l, reason: e.target.value }))} />
        </div>
      </FormModal>
    </div>
  );
};

const AssetDetailPage = () => {
  const uid = useDetailParam('uid');
  return <OrganizationGate><AssetDetailInner key={uid} uid={uid} /></OrganizationGate>;
};

export default AssetDetailPage;
