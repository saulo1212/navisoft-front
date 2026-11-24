'use client';

import { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { ReferenceField, useAdminProfile } from './AdminReferenceFields';
import { BillingField, BillingForm, useBillingMutation } from './BillingUi';
import DataTable from './DataTable';
import { OperationField } from './OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createResourceApi } from '@/lib/api/resource';
import { listAssetManufacturers, listAssetModels, listAssetTypes, listFuels } from '@/lib/api/endpoints/fleet';
import { readJson } from '@/lib/domain/adminConfiguration';
import { ASSET_PROFILE_LABELS } from '@/lib/domain/fleet';
import { requiredText } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const catalogs = {
  types: { label: 'Tipos', singular: 'tipo', list: listAssetTypes },
  manufacturers: { label: 'Fabricantes', singular: 'fabricante', list: listAssetManufacturers },
  models: { label: 'Modelos', singular: 'modelo', list: listAssetModels },
  fuels: { label: 'Combustíveis', singular: 'combustível', list: listFuels }
};
const vehicleTypes = [['', 'Sem vínculo'], ['cars', 'Carros'], ['motorcycles', 'Motos'], ['trucks', 'Caminhões']];

export default function FleetCatalogs({ onSaved }) {
  const [kind, setKind] = useState('types');
  const primary = useAdminProfile() === 'primary_admin';
  return <section className="mt-4">
    <h2 className="h5">Catálogos da Frota</h2>
    <Nav activeKey={kind} variant="pills" className="mb-3" onSelect={setKind}>
      {Object.entries(catalogs).map(([key, { label }]) => <Nav.Item key={key}><Nav.Link eventKey={key}>{label}</Nav.Link></Nav.Item>)}
    </Nav>
    <Catalog key={kind} kind={kind} primary={primary} onSaved={onSaved} />
  </section>;
}

function Catalog({ kind, primary, onSaved }) {
  const def = catalogs[kind];
  const list = useOffsetList(def.list);
  const [record, setRecord] = useState(null);
  const columns = [
    { key: 'name', label: 'Nome' },
    ...(kind === 'types' ? [{ key: 'profile_code', label: 'Perfil' }, { key: 'fipe_vehicle_type', label: 'Tipo FIPE' }] : []),
    ...(kind === 'models' || kind === 'fuels' ? [{ key: kind === 'models' ? 'fipe_model_code' : 'fipe_fuel_code', label: 'Código FIPE' }] : []),
    { key: 'active', label: 'Ativo', render: row => row.active ? 'Sim' : 'Não' },
    ...(primary ? [{ key: 'actions', label: 'Ações', render: row => <Button size="sm" variant="link" onClick={() => setRecord(row)}>Editar</Button> }] : [])
  ];
  return <>
    {primary && kind !== 'fuels' && <Button size="sm" className="mb-3" disabled={!!list.error || list.loading}
      onClick={() => setRecord({})}>Cadastrar {def.singular}</Button>}
    <DataTable columns={columns} rows={list.error ? [] : list.items} loading={list.loading} error={list.error}
      hasMore={list.hasMore} onLoadMore={list.loadMore} loadingMore={list.loading && list.items.length > 0} />
    {record && primary && <CatalogEditor kind={kind} row={record} onClose={() => setRecord(null)} onSaved={() => {
      setRecord(null); list.refresh(); onSaved?.(); notifySuccess('Catálogo atualizado.');
    }} />}
  </>;
}

function CatalogEditor({ kind, row, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const api = createResourceApi({ basePath: `/v1/admin/assets/${kind}` });
  const isType = kind === 'types';
  const isMaker = kind === 'manufacturers';
  const isModel = kind === 'models';
  const types = useOffsetList(listAssetTypes, { enabled: isMaker || isModel });
  const [typeUid, setTypeUid] = useState(row.uid_type ?? '');
  const [makerUid, setMakerUid] = useState(row.uid_manufacturer ?? '');
  const [typeUids, setTypeUids] = useState(row.types?.map(type => typeof type === 'string' ? type : type.uid ?? type.uid_type).filter(Boolean) ?? []);
  const makers = useOffsetList(listAssetManufacturers, { params: { typeUid }, enabled: isModel && Boolean(typeUid) });
  return <BillingForm title={`${row.uid ? 'Editar' : 'Cadastrar'} ${catalogs[kind].singular}`} mutation={mutation} onClose={onClose}
    onSubmit={fields => mutation.submit(args => {
      const body = { name: requiredText(fields.name, 'o nome'), active: fields.active === 'on' };
      if (isType) {
        body.profile_code = fields.profile_code;
        body.fipe_vehicle_type = fields.fipe_vehicle_type || null;
      } else if (isMaker) {
        body.types = typeUids;
        body.fipe_brand_codes = readJson(fields.fipe_brand_codes, 'códigos FIPE por categoria', 'object');
      } else if (isModel) {
        body.uid_type = typeUid;
        body.uid_manufacturer = makerUid;
        body.fipe_model_code = fields.fipe_model_code.trim() || null;
        body.telemetry_params = readJson(fields.telemetry_params, 'parâmetros de telemetria', 'object');
      } else {
        body.fipe_fuel_code = fields.fipe_fuel_code ? Number(fields.fipe_fuel_code) : null;
      }
      const save = row.uid ? api.update : api.create;
      return save({ ...args, token, uid: row.uid, body });
    }, { ...fields, typeUid, makerUid, typeUids }, onSaved)}>
    <BillingField name="name" label="Nome" defaultValue={row.name} />
    <BillingField name="active" label="Ativo" type="checkbox" defaultChecked={row.active ?? true} />
    {isType && <>
      <BillingField name="profile_code" label="Perfil do ativo" options={Object.entries(ASSET_PROFILE_LABELS)} defaultValue={row.profile_code ?? 'generic'} />
      <BillingField name="fipe_vehicle_type" label="Tipo de veículo FIPE" options={vehicleTypes} optional defaultValue={row.fipe_vehicle_type ?? ''} />
    </>}
    {isMaker && <>
      <fieldset className="mb-3"><legend className="fs-6">Tipos associados</legend>
        {types.items.map(type => <BillingField key={type.uid} type="checkbox" label={type.name} checked={typeUids.includes(type.uid)}
          onChange={event => setTypeUids(values => event.target.checked ? [...values, type.uid] : values.filter(uid => uid !== type.uid))} />)}
        {types.error && <p className="text-danger" role="alert">{types.error}</p>}
        {types.hasMore && <Button type="button" size="sm" variant="outline-secondary" disabled={types.loading} onClick={types.loadMore}>Carregar mais tipos</Button>}
      </fieldset>
      <OperationField label="Códigos FIPE por categoria (JSON)" name="fipe_brand_codes" multiline required defaultValue={JSON.stringify(row.fipe_brand_codes ?? {}, null, 2)} />
    </>}
    {isModel && <>
      <ReferenceField label="Tipo" list={types} value={typeUid} onChange={event => { setTypeUid(event.target.value); setMakerUid(''); }} />
      <ReferenceField label="Fabricante" list={makers} value={makerUid} onChange={event => setMakerUid(event.target.value)} />
      <BillingField name="fipe_model_code" label="Código do modelo FIPE" optional defaultValue={row.fipe_model_code ?? ''} />
      <OperationField label="Parâmetros de telemetria (JSON)" name="telemetry_params" multiline required defaultValue={JSON.stringify(row.telemetry_params ?? {}, null, 2)} />
    </>}
    {!isType && !isMaker && !isModel &&
      <BillingField name="fipe_fuel_code" label="Código de combustível FIPE" type="number" min="1" step="1" optional defaultValue={row.fipe_fuel_code ?? ''} />}
  </BillingForm>;
}
