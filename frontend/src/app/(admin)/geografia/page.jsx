'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Modal, Nav } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormDrawer from '@/components/admin/FormDrawer';
import GeographyMap from '@/components/admin/GeographyMap';
import RoutePointsEditor from '@/components/admin/RoutePointsEditor';
import ListToolbar from '@/components/admin/ListToolbar';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createFence, updateFence, deleteFence, createRoute, updateRoute, deleteRoute, createPoint, deletePoint, getFence, getPoint, getRoute, listFences, listPoints, listRoutes, SCOPE_LEVELS, updatePoint } from '@/lib/api/endpoints/geography';
import { errorMessage, isApiError } from '@/lib/api/errors';
import { newIdempotencyKey } from '@/lib/api/idempotency';
import { fenceBody, routeBody, pointBody, pointCoordinates, SCOPE_LABELS } from '@/lib/domain/geography';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const RESOURCES = {
  points: { label: 'Pontos', area: 'geo_points', list: listPoints, get: getPoint, create: createPoint, update: updatePoint, remove: deletePoint, body: pointBody, singular: 'ponto' },
  fences: { label: 'Cercas', area: 'geo_geofences', list: listFences, get: getFence, create: createFence, update: updateFence, remove: deleteFence, body: fenceBody, singular: 'cerca' },
  routes: { label: 'Rotas', area: 'geo_routes', list: listRoutes, get: getRoute, create: createRoute, update: updateRoute, remove: deleteRoute, body: routeBody, singular: 'rota' }
};
const EMPTY = { name: '', description: '', scope_level: 'organization', uid_entity: '', uid_asset: '', latitude: '', longitude: '', radius_meters: 0, active: true, shape: 'circle', entry_margin_meters: 0, exit_margin_meters: 0, lateral_margin_meters: 0, max_speed_kmh: '', geojson: '', points: [] };
const message = err => isApiError(err) ? `${errorMessage(err)}${err.code ? ` (${err.code})` : ''}` : err.message || 'Não foi possível concluir a operação.';

export default function GeographyPage() {
  const { areaAccess, selectedOrganizationUid, token } = useSession();
  const [tab, setTab] = useState('points');
  const [scope, setScope] = useState('organization');
  const allowed = key => areaAccess?.status === 'evaluated' && areaAccess?.areas?.[RESOURCES[key].area] === 'allowed';
  return <>
    <PageBreadcrumb title="Geografia" subTitle1="Operação" />
    <Nav variant="tabs" activeKey={tab} onSelect={setTab} className="mb-3">
      {Object.entries(RESOURCES).map(([key, resource]) => <Nav.Item key={key}><Nav.Link eventKey={key}>{resource.label}</Nav.Link></Nav.Item>)}
      <Nav.Item><Nav.Link eventKey="geocode">Buscar endereço</Nav.Link></Nav.Item>
    </Nav>
    {tab === 'geocode' ? <Alert variant="info">A busca de endereços está indisponível neste ambiente.</Alert> : <>
      <div className="mb-3" style={{ maxWidth: 300 }}>
        <label htmlFor="list-scope" className="form-label">Escopo da consulta</label>
        <select id="list-scope" className="form-select" value={scope} onChange={e => setScope(e.target.value)}>{SCOPE_LEVELS.map(level => <option key={level} value={level}>{SCOPE_LABELS[level]}</option>)}</select>
      </div>
      {scope !== 'global' && !selectedOrganizationUid ? <Alert variant="warning">Selecione uma organização para consultar este escopo.</Alert> : allowed(tab) ? <ResourceTab key={`${token}:${selectedOrganizationUid}:${tab}:${scope}`} kind={tab} scope={scope} /> : <Alert variant="warning">Seu contexto de acesso não permite consultar {RESOURCES[tab].label.toLowerCase()}.</Alert>}
    </>}
  </>;
}

function ResourceTab({ kind, scope }) {
  const { token, selectedOrganizationUid, refreshAccessContext } = useSession();
  const resource = RESOURCES[kind];
  const list = useOffsetList(resource.list, { params: { organizationUid: selectedOrganizationUid, scopeLevel: scope } });
  const [form, setForm] = useState(null);
  const [detail, setDetail] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const requestRef = useRef(null);
  const intention = useRef(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; requestRef.current?.abort(); };
  }, []);
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const fail = err => {
    if (!mounted.current) return;
    setError(message(err));
    if ([403, 404].includes(err.status)) {
      setDetail(null);
      setForm(null);
      setPendingDelete(null);
      list.setItems([]);
      void refreshAccessContext();
    }
  };
  const openDetail = async row => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setDetail(null); setError(null); setBusy(true);
    try {
      const result = await resource.get({ token, uid: row.uid, signal: controller.signal });
      if (!controller.signal.aborted) setDetail(result?.item ?? result);
    } catch (err) { if (!controller.signal.aborted) fail(err); }
    finally { if (!controller.signal.aborted) setBusy(false); }
  };
  const openForm = row => {
    intention.current = null;
    setError(null);
    setForm(row ? { ...EMPTY, ...row, geojson: row.geojson ? JSON.stringify(row.geojson, null, 2) : '', points: Array.isArray(row.points) ? row.points : [] } : { ...EMPTY, scope_level: scope, points: [{ latitude: '', longitude: '' }, { latitude: '', longitude: '' }] });
    setDetail(null);
  };
  const save = async event => {
    event.preventDefault(); setBusy(true); setError(null);
    try {
      const body = resource.body(form, selectedOrganizationUid);
      const signature = JSON.stringify(body);
      if (intention.current?.signature !== signature) intention.current = { signature, key: newIdempotencyKey() };
      await (form.uid ? resource.update : resource.create)({ token, uid: form.uid, body, ...(form.uid ? {} : { idempotencyKey: intention.current.key }) });
      if (!mounted.current) return;
      setForm(null); notifySuccess('Registro salvo.'); list.refresh();
    } catch (err) { fail(err); }
    finally { if (mounted.current) setBusy(false); }
  };
  const remove = async () => {
    setBusy(true); setError(null);
    try {
      await resource.remove({ token, uid: pendingDelete.uid });
      if (!mounted.current) return;
      setPendingDelete(null); setDetail(null); notifySuccess('Registro excluído.'); list.refresh();
    } catch (err) { fail(err); }
    finally { if (mounted.current) setBusy(false); }
  };
  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'scope_level', label: 'Escopo', render: row => SCOPE_LABELS[row.scope_level] || '—' },
    { key: 'active', label: 'Situação', render: row => row.active === true ? 'Ativo' : row.active === false ? 'Inativo' : '—' },
    ...(kind === 'points' ? [{ key: 'coordinates', label: 'Latitude, longitude', render: row => { const p = pointCoordinates(row); return p ? `${p[1].toFixed(5)}, ${p[0].toFixed(5)}` : '—'; } }, { key: 'radius_meters', label: 'Raio (m)' }] : []),
    { key: 'actions', label: '', render: row => <Button size="sm" variant="outline-primary" disabled={busy} onClick={() => openDetail(row)}>Detalhes</Button> }
  ];
  return <>
    {error && !form && <Alert variant="danger">{error}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar por nome..." actionLabel={`Cadastrar ${resource.singular}`} onAction={() => openForm(null)} actionDisabled={busy} />
    {!list.error && <GeographyMap rows={list.items} selectedUid={detail?.uid} onSelect={row => { if (!busy && !form && !pendingDelete) void openDetail(row); }} />}
    <DataTable columns={columns} rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} emptyMessage="Nenhum registro encontrado neste escopo." />
    {form && <FormDrawer show onHide={() => { if (!busy) setForm(null); }} title={`${form.uid ? 'Editar' : 'Cadastrar'} ${resource.singular}`} onSubmit={save} submitting={busy} error={error}>
      <fieldset disabled={busy}>
        <Field label="Nome" id="point-name" value={form.name} onChange={v => set('name', v)} required />
        <Field label="Descrição" id="point-description" value={form.description ?? ''} onChange={v => set('description', v)} />
        <label htmlFor="point-scope" className="form-label">Escopo</label>
        <select id="point-scope" className="form-select mb-3" value={form.scope_level} onChange={e => { set('scope_level', e.target.value); set('uid_entity', ''); set('uid_asset', ''); }} disabled={!!form.uid}>{SCOPE_LEVELS.map(level => <option key={level} value={level}>{SCOPE_LABELS[level]}</option>)}</select>
        {['entity', 'asset'].includes(form.scope_level) && <Field label="UUID da entidade" id="point-entity" value={form.uid_entity || ''} onChange={v => set('uid_entity', v)} required disabled={!!form.uid} />}
        {form.scope_level === 'asset' && <Field label="UUID do veículo / ativo" id="point-asset" value={form.uid_asset || ''} onChange={v => set('uid_asset', v)} required disabled={!!form.uid} />}
        {kind === 'fences' && <><label htmlFor="fence-shape" className="form-label">Formato</label><select id="fence-shape" className="form-select mb-3" value={form.shape} onChange={e => set('shape', e.target.value)}><option value="circle">Círculo</option><option value="polygon">Polígono</option></select></>}
        {(kind === 'points' || (kind === 'fences' && form.shape === 'circle')) && <>
        <Field label="Latitude" id="point-latitude" type="number" step="any" min="-90" max="90" value={form.latitude} onChange={v => set('latitude', v)} required />
        <Field label="Longitude" id="point-longitude" type="number" step="any" min="-180" max="180" value={form.longitude} onChange={v => set('longitude', v)} required />
        <Field label="Raio (metros)" id="point-radius" type="number" step="any" min="0" value={form.radius_meters} onChange={v => set('radius_meters', v)} required />
        </>}
        {kind === 'fences' && <>
          {form.shape === 'polygon' && <JsonField label="Polígono GeoJSON (longitude, latitude)" id="fence-geometry" value={form.geojson} onChange={v => set('geojson', v)} />}
          <Field label="Margem de entrada (metros)" id="fence-entry" type="number" min="0" step="any" value={form.entry_margin_meters} onChange={v => set('entry_margin_meters', v)} required />
          <Field label="Margem de saída (metros)" id="fence-exit" type="number" min="0" step="any" value={form.exit_margin_meters} onChange={v => set('exit_margin_meters', v)} required />
        </>}
        {kind === 'routes' && <>
          <Field label="Margem lateral (metros)" id="route-margin" type="number" min="0" step="any" value={form.lateral_margin_meters} onChange={v => set('lateral_margin_meters', v)} required />
          <Field label="Velocidade máxima (km/h, opcional)" id="route-speed" type="number" min="0" step="any" value={form.max_speed_kmh ?? ''} onChange={v => set('max_speed_kmh', v)} />
          <RoutePointsEditor points={form.points} onChange={v => set('points', v)} />
        </>}
        <label className="d-flex gap-2"><input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />Ativo</label>
      </fieldset>
    </FormDrawer>}
    <Modal show={!!detail} onHide={() => setDetail(null)} size="lg">
      <Modal.Header closeButton><Modal.Title>{detail?.name || 'Detalhes'}</Modal.Title></Modal.Header>
      <Modal.Body>{detail && <>
        <p>{detail.description || 'Sem descrição.'}</p>
        <dl className="row"><dt className="col-sm-3">Escopo</dt><dd className="col-sm-9">{SCOPE_LABELS[detail.scope_level] || '—'}</dd><dt className="col-sm-3">Identificador</dt><dd className="col-sm-9 text-break">{detail.uid}</dd></dl>
        {kind === 'fences' && <p>Formato: {detail.shape === 'circle' ? 'Círculo' : 'Polígono'} · Margens de entrada/saída: {detail.entry_margin_meters ?? '—'} / {detail.exit_margin_meters ?? '—'} m</p>}
        {kind === 'routes' && <>
          <p>Margem lateral: {detail.lateral_margin_meters ?? '—'} m · Velocidade máxima: {detail.max_speed_kmh ?? '—'} km/h</p>
          <ol>{detail.points?.map((point, index) => <li key={index}>{point.latitude}, {point.longitude}{point.max_speed_to_next_kmh != null ? ` · Até o próximo ponto: ${point.max_speed_to_next_kmh} km/h` : ''}</li>)}</ol>
        </>}
        <GeographyMap rows={[detail]} onSelect={() => {}} />
      </>}</Modal.Body>
      <Modal.Footer><><Button variant="outline-danger" disabled={busy} onClick={() => { setError(null); setPendingDelete(detail); setDetail(null); }}>Excluir</Button><Button disabled={busy} onClick={() => openForm(detail)}>Editar</Button></><Button variant="secondary" onClick={() => setDetail(null)}>Fechar</Button></Modal.Footer>
    </Modal>
    <Modal show={!!pendingDelete} onHide={() => { if (!busy) setPendingDelete(null); }}>
      <Modal.Header closeButton={!busy}><Modal.Title>Excluir {resource.singular}</Modal.Title></Modal.Header>
      <Modal.Body>Confirma a exclusão de “{pendingDelete?.name}”?{error && <Alert variant="danger" className="mt-3">{error}</Alert>}</Modal.Body>
      <Modal.Footer><Button variant="secondary" disabled={busy} onClick={() => setPendingDelete(null)}>Cancelar</Button><Button variant="danger" disabled={busy} onClick={remove}>{busy ? 'Excluindo...' : 'Excluir'}</Button></Modal.Footer>
    </Modal>
  </>;
}

function Field({ label, id, onChange, ...props }) {
  return <div className="mb-3"><label htmlFor={id} className="form-label">{label}</label><input id={id} className="form-control" {...props} onChange={e => onChange(e.target.value)} /></div>;
}

function JsonField({ label, id, value, onChange }) {
  return <div className="mb-3"><label htmlFor={id} className="form-label">{label}</label><textarea id={id} className="form-control font-monospace" rows={8} value={value} onChange={e => onChange(e.target.value)} required /></div>;
}
