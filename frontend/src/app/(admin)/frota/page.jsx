'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormDrawer from '@/components/admin/FormDrawer';
import ListToolbar from '@/components/admin/ListToolbar';
import OrganizationGate from '@/components/admin/OrganizationGate';
import { usePagedList } from '@/hooks/usePagedList';
import { searchEntities, searchUnits } from '@/lib/api/endpoints/entities';
import { createAsset, listAssetManufacturers, listAssetModels, listAssetTypes, listFuels, searchAssets } from '@/lib/api/endpoints/fleet';
import { normalizeList } from '@/lib/api/http';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';

const EMPTY = { entityUid: '', unitUid: '', identification: '', fuelUid: '', typeUid: '', manufacturerUid: '', modelUid: '', plate: '', modelYear: '' };

const FleetInner = () => {
  const router = useRouter();
  const { token, selectedOrganizationUid: orgUid } = useSession();
  const { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh } =
    usePagedList(args => searchAssets({ ...args, organizationUid: orgUid }), {
      params: { organizationUid: orgUid }, pageSize: 20
    });

  const [entities, setEntities] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [types, setTypes] = useState([]);
  useEffect(() => {
    if (!token || !orgUid) return;
    searchEntities({ token, organizationUid: orgUid, limit: 100 })
      .then(res => setEntities(normalizeList(res).items)).catch(() => {});
    listFuels({ token }).then(res => setFuels(normalizeList(res).items)).catch(() => {});
    listAssetTypes({ token }).then(res => setTypes(normalizeList(res).items)).catch(() => {});
  }, [token, orgUid]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [units, setUnits] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setForm(EMPTY); setUnits([]); setManufacturers([]); setModels([]); setOpen(true); };

  const onEntityChange = async entityUid => {
    setForm(f => ({ ...f, entityUid, unitUid: '' }));
    setUnits([]);
    if (!entityUid) return;
    try {
      const res = await searchUnits({ token, organizationUid: orgUid, entityUid });
      setUnits(normalizeList(res).items);
    } catch { /* unidades são opcionais */ }
  };

  const onTypeChange = async typeUid => {
    setForm(f => ({ ...f, typeUid, manufacturerUid: '', modelUid: '' }));
    setManufacturers([]); setModels([]);
    if (!typeUid) return;
    try {
      const res = await listAssetManufacturers({ token, typeUid });
      setManufacturers(normalizeList(res).items);
    } catch { /* fabricante é opcional */ }
  };

  const onManufacturerChange = async manufacturerUid => {
    setForm(f => ({ ...f, manufacturerUid, modelUid: '' }));
    setModels([]);
    if (!manufacturerUid) return;
    try {
      const res = await listAssetModels({ token, typeUid: form.typeUid || undefined, manufacturerUid });
      setModels(normalizeList(res).items);
    } catch { /* modelo é opcional */ }
  };

  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      const vehicle = (form.plate || form.modelYear)
        ? { plate: form.plate || null, model_year: form.modelYear ? Number(form.modelYear) : null }
        : undefined;
      await createAsset({
        token, organizationUid: orgUid, entityUid: form.entityUid,
        unitUid: form.unitUid || undefined, fuelUid: form.fuelUid || undefined, modelUid: form.modelUid || undefined,
        identification: form.identification, vehicle
      });
      notifySuccess('Asset criado.');
      setOpen(false);
      refresh();
    } catch (err) { notifyError(err); } finally { setSaving(false); }
  };

  const entityName = u => entities.find(e => e.uid === u)?.name || <span className="text-muted font-monospace">{u ? `${String(u).slice(0, 8)}…` : '—'}</span>;

  const columns = [
    { key: 'identification', label: 'Identificação' },
    { key: 'uid_entity', label: 'Entidade', render: r => entityName(r.uid_entity) },
    { key: 'plate', label: 'Placa', render: r => r.vehicle?.plate || <span className="text-muted">—</span> }
  ];

  return (
    <>
      <PageBreadcrumb title="Frota" subTitle1="Operação" subTitle2="Assets" />
      <ListToolbar q={q} onChangeQ={setQ} placeholder="Buscar por identificação..." actionLabel="Novo asset" onAction={openCreate} />
      {total != null && <p className="text-muted small mb-2">{total} asset(s) nesta organização.</p>}
      <DataTable
        columns={columns} rows={items} loading={loading} error={error}
        onRowClick={row => router.push(`/frota/${row.uid}`)}
        emptyMessage="Nenhum asset cadastrado nesta organização."
        pagination={{ page, pageCount, total, onPage: goToPage }}
      />

      <FormDrawer show={open} onHide={() => setOpen(false)} title="Novo asset" onSubmit={submit} submitting={saving}>
        <div className="mb-3">
          <label className="form-label">Entidade</label>
          <Form.Select value={form.entityUid} onChange={e => onEntityChange(e.target.value)} required>
            <option value="">Selecione...</option>
            {entities.map(e => <option key={e.uid} value={e.uid}>{e.name}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Unidade <span className="text-muted small">(opcional)</span></label>
          <Form.Select value={form.unitUid} onChange={e => setForm(f => ({ ...f, unitUid: e.target.value }))} disabled={!form.entityUid}>
            <option value="">—</option>
            {units.map(u => <option key={u.uid} value={u.uid}>{u.name}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Identificação</label>
          <input className="form-control" value={form.identification} onChange={e => setForm(f => ({ ...f, identification: e.target.value }))} required placeholder="placa ou serial" />
        </div>
        <div className="mb-3">
          <label className="form-label">Combustível <span className="text-muted small">(opcional)</span></label>
          <Form.Select value={form.fuelUid} onChange={e => setForm(f => ({ ...f, fuelUid: e.target.value }))}>
            <option value="">—</option>
            {fuels.map(f => <option key={f.uid} value={f.uid}>{f.name}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de asset <span className="text-muted small">(opcional)</span></label>
          <Form.Select value={form.typeUid} onChange={e => onTypeChange(e.target.value)}>
            <option value="">—</option>
            {types.map(t => <option key={t.uid} value={t.uid}>{t.name}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Fabricante <span className="text-muted small">(opcional)</span></label>
          <Form.Select value={form.manufacturerUid} onChange={e => onManufacturerChange(e.target.value)} disabled={!form.typeUid}>
            <option value="">—</option>
            {manufacturers.map(m => <option key={m.uid} value={m.uid}>{m.name}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Modelo <span className="text-muted small">(opcional)</span></label>
          <Form.Select value={form.modelUid} onChange={e => setForm(f => ({ ...f, modelUid: e.target.value }))} disabled={!form.manufacturerUid}>
            <option value="">—</option>
            {models.map(m => <option key={m.uid} value={m.uid}>{m.name}</option>)}
          </Form.Select>
        </div>
        <div className="row g-2">
          <div className="col-7 mb-2"><label className="form-label">Placa <span className="text-muted small">(opcional)</span></label><input className="form-control" value={form.plate} onChange={e => setForm(f => ({ ...f, plate: e.target.value }))} /></div>
          <div className="col-5 mb-2"><label className="form-label">Ano</label><input type="number" className="form-control" value={form.modelYear} onChange={e => setForm(f => ({ ...f, modelYear: e.target.value }))} /></div>
        </div>
        <p className="text-muted small">O asset é criado já com participação no grupo &quot;Geral&quot; da organização. Organização e entidade são imutáveis depois.</p>
      </FormDrawer>
    </>
  );
};

const FleetAssetsPage = () => (
  <OrganizationGate>
    <FleetInner />
  </OrganizationGate>
);

export default FleetAssetsPage;
