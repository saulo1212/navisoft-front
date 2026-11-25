'use client';

import { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { ReferenceField, useAdminProfile } from './AdminReferenceFields';
import { BillingField, BillingForm, BillingRead, useBillingMutation } from './BillingUi';
import DataTable from './DataTable';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import {
  createDeviceType, getDeviceModel, listDeviceManufacturers, listDeviceModels, listDeviceTypes, saveDeviceModel
} from '@/lib/api/endpoints/devices';
import { requiredText, requireUid } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const yesNo = value => value ? 'Sim' : 'Não';
const nameOf = (list, uid) => list.items.find(row => row.uid === uid)?.name ?? uid;

export default function DeviceCatalog() {
  const { token } = useSession();
  const canWrite = useAdminProfile() === 'primary_admin';
  const [tab, setTab] = useState('models');
  const [selected, setSelected] = useState(null);
  const [editor, setEditor] = useState(null);
  const [revision, setRevision] = useState(0);
  const models = useOffsetList(listDeviceModels, { enabled: tab === 'models' });
  const types = useOffsetList(listDeviceTypes, { limit: 100 });
  const manufacturers = useOffsetList(listDeviceManufacturers, { limit: 100, enabled: tab === 'models' });
  const detail = useKnowledgeQuery(getDeviceModel, { token, uid: selected, revision }, Boolean(selected));
  const modelTab = tab === 'models';
  const list = modelTab ? models : types;

  const saved = response => {
    setEditor(null);
    list.refresh();
    if (modelTab) {
      setSelected(response.uid);
      setRevision(value => value + 1);
    }
    notifySuccess(modelTab ? 'Modelo salvo.' : 'Tipo cadastrado.');
  };

  return <section>
    <h2 className="h5">Catálogo de dispositivos</h2>
    <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
      <Nav variant="pills" activeKey={tab} onSelect={key => { setTab(key); setSelected(null); setEditor(null); }}>
        <Nav.Item><Nav.Link eventKey="models">Modelos</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="types">Tipos</Nav.Link></Nav.Item>
      </Nav>
      {canWrite && <Button size="sm" disabled={list.loading || Boolean(list.error)}
        onClick={() => setEditor('create')}>{modelTab ? 'Novo modelo' : 'Novo tipo'}</Button>}
    </div>
    <DataTable rows={list.error ? [] : list.items} loading={list.loading} error={list.error}
      hasMore={list.hasMore} loadingMore={list.loading && list.items.length > 0} onLoadMore={list.loadMore}
      columns={[
        { key: 'name', label: 'Nome', render: row => modelTab
          ? <Button variant="link" className="p-0" onClick={() => setSelected(row.uid)}>{row.name}</Button> : row.name },
        ...(modelTab ? [
          { key: 'uid_type', label: 'Tipo', render: row => nameOf(types, row.uid_type) },
          { key: 'uid_manufacturer', label: 'Fabricante', render: row => nameOf(manufacturers, row.uid_manufacturer) },
          { key: 'requires_simcard', label: 'Exige SIM', render: row => yesNo(row.requires_simcard) }
        ] : []),
        { key: 'active', label: 'Ativo', render: row => yesNo(row.active) }
      ]} />
    {selected && <section className="card panel p-3 mt-3">
      <div className="d-flex justify-content-between gap-2">
        <h3 className="h6">{detail.data?.name ?? 'Detalhe do modelo'}</h3>
        <Button size="sm" variant="outline-secondary" onClick={() => setSelected(null)}>Fechar</Button>
      </div>
      <BillingRead query={detail}>{row => <>
        <dl className="row mb-0">
          <dt className="col-sm-3">Tipo</dt><dd className="col-sm-9">{nameOf(types, row.uid_type)}</dd>
          <dt className="col-sm-3">Fabricante</dt><dd className="col-sm-9">{nameOf(manufacturers, row.uid_manufacturer)}</dd>
          <dt className="col-sm-3">Exige SIM</dt><dd className="col-sm-9">{yesNo(row.requires_simcard)}</dd>
          <dt className="col-sm-3">Ativo</dt><dd className="col-sm-9">{yesNo(row.active)}</dd>
        </dl>
        {canWrite && <div><Button size="sm" variant="outline-primary" onClick={() => setEditor('edit')}>Editar modelo</Button></div>}
      </>}</BillingRead>
    </section>}
    {canWrite && editor && (!modelTab || editor === 'create' || detail.data) &&
      <CatalogEditor model={modelTab} row={editor === 'edit' ? detail.data : undefined} types={types}
        onClose={() => setEditor(null)} onSaved={saved} />}
  </section>;
}

function CatalogEditor({ model, row, types, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const [typeUid, setTypeUid] = useState(row?.uid_type ?? '');
  const save = model ? saveDeviceModel : createDeviceType;
  return <BillingForm title={model ? (row ? 'Editar modelo' : 'Novo modelo') : 'Novo tipo'}
    mutation={mutation} onClose={onClose} onSubmit={fields => mutation.submit(args => {
      const body = { name: requiredText(fields.name, 'o nome'), active: fields.active === 'on' };
      if (model) Object.assign(body, {
        uid_type: requireUid(fields.uid_type, 'tipo'),
        uid_manufacturer: requireUid(fields.uid_manufacturer, 'fabricante'),
        requires_simcard: fields.requires_simcard === 'on'
      });
      return save({ ...args, token, uid: row?.uid, body });
    }, fields, onSaved)}>
    <BillingField name="name" label="Nome" defaultValue={row?.name} />
    {model && <>
      <ReferenceField label="Tipo" name="uid_type" list={types} rows={types.items.filter(type => type.active || type.uid === row?.uid_type)}
        value={typeUid} onChange={event => setTypeUid(event.target.value)} />
      <CompatibleManufacturerField key={typeUid} typeUid={typeUid} originalUid={typeUid === row?.uid_type ? row.uid_manufacturer : ''} />
      <BillingField name="requires_simcard" label="Exige SIM" type="checkbox" defaultChecked={row?.requires_simcard ?? false} />
    </>}
    <BillingField name="active" label="Ativo" type="checkbox" defaultChecked={row?.active ?? true} />
  </BillingForm>;
}

function CompatibleManufacturerField({ typeUid, originalUid }) {
  const list = useOffsetList(listDeviceManufacturers, { params: { typeUid }, enabled: Boolean(typeUid) });
  return <ReferenceField label="Fabricante compatível" name="uid_manufacturer" list={list}
    rows={list.items.filter(row => row.active || row.uid === originalUid)} defaultValue={originalUid}
    disabled={!typeUid} placeholder={typeUid ? 'Selecione…' : 'Selecione o tipo primeiro'} />;
}
