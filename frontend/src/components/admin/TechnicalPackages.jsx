'use client';

import { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { ReferenceField, useAdminProfile } from './AdminReferenceFields';
import { BillingField, BillingForm, BillingRead, useBillingMutation } from './BillingUi';
import DataTable from './DataTable';
import { OperationField } from './OperationalUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createTechnicalPackage, listDeviceModels, listDeviceTypes, listTechnicalPackages } from '@/lib/api/endpoints/devices';
import { getAssetTechnicalPackage, setAssetTechnicalPackage } from '@/lib/api/endpoints/fleet';
import { requiredText } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const packageLabel = row => [row.code, row.name].filter(Boolean).join(' · ') || row.uid;
const instructions = (content, key) => content?.trim() ? { [key]: content.trim() } : {};
const emptySlot = () => ({ id: crypto.randomUUID(), slot_number: '', requirement_type: '', uid_device_type: '', uid_device_model: '', required: true, note: '', tests: [] });
const emptyTest = () => ({ id: crypto.randomUUID(), test_code: '', name: '', required: true });

export function InstructionList({ value }) {
  if (typeof value === 'string') return <p>{value}</p>;
  const lines = Object.entries(value ?? {}).filter(([, text]) => typeof text === 'string' && text);
  return lines.length > 0 && <ul className="mb-2 ps-3">{lines.map(([key, text]) => <li key={key}>{text}</li>)}</ul>;
}

export function TechnicalPackagesTab() {
  const { selectedOrganizationUid: organizationUid } = useSession();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const profile = useAdminProfile();
  const canWrite = ['primary_admin', 'administrator'].includes(profile);
  const list = useOffsetList(listTechnicalPackages, { params: { organizationUid } });
  return <>
    <h2 className="h5">Pacotes técnicos</h2>
    {canWrite && <Button className="mb-3" size="sm" disabled={list.loading || !!list.error} onClick={() => setOpen(true)}>Novo pacote técnico</Button>}
    <DataTable columns={[
      { key: 'code', label: 'Código', render: row => <Button variant="link" size="sm" onClick={() => setExpanded(expanded === row.uid ? null : row.uid)}>{row.code}</Button> },
      { key: 'name', label: 'Nome' },
      { key: 'active', label: 'Ativo', render: row => row.active === false ? 'Não' : 'Sim' }
    ]} rows={list.error ? [] : list.items} loading={list.loading} error={list.error} hasMore={list.hasMore}
      onLoadMore={list.loadMore} loadingMore={list.loading && list.items.length > 0} />
    {expanded && <PackageDetails uid={expanded} organizationUid={organizationUid} />}
    {open && <PackageEditor organizationUid={organizationUid} onClose={() => setOpen(false)} onSaved={() => {
      setOpen(false); list.refresh(); notifySuccess('Pacote técnico cadastrado.');
    }} />}
  </>;
}

function PackageDetails({ uid, organizationUid }) {
  const { token } = useSession();
  const query = useKnowledgeQuery(getTechnicalPackage, { token, uid, organizationUid });
  return <div className="border rounded p-3 mt-3"><BillingRead query={query}>{row => <PackageContents row={row} />}</BillingRead></div>;
}

function PackageContents({ row }) {
  return <>
    <h6>{packageLabel(row)}</h6>
    <InstructionList value={row.instructions} />
    {row.requirements?.map(slot => <div className="border-top pt-2" key={slot.uid || slot.slot_number}>
      <p className="mb-1">Slot {slot.slot_number} · {slot.requirement_type}{slot.required && ' · Obrigatório'}</p>
      <InstructionList value={slot.instructions} />
      {slot.tests?.length > 0 && <ul>{slot.tests.map(test => <li key={test.test_code}>{test.name || test.test_code}{test.required && ' (obrigatório)'}</li>)}</ul>}
    </div>)}
  </>;
}

function PackageEditor({ organizationUid, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const [slots, setSlots] = useState(() => [emptySlot()]);
  const types = useOffsetList(listDeviceTypes);
  return <BillingForm title="Novo pacote técnico" mutation={mutation} onClose={onClose} submitDisabled={!slots.length}
    onSubmit={fields => mutation.submit(args => {
      const requirements = slots.map(({ id, note, tests, slot_number, ...slot }) => ({
        ...slot, slot_number: Number(slot_number), requirement_type: requiredText(slot.requirement_type, 'o tipo de requisito'),
        uid_device_type: slot.uid_device_type || null, uid_device_model: slot.uid_device_model || null,
        instructions: instructions(note, 'check'),
        tests: tests.map(({ id: testId, test_code, name, required }) => ({
          test_code: requiredText(test_code, 'o código do teste'), name: requiredText(name, 'o nome do teste'), required
        }))
      }));
      if (new Set(requirements.map(slot => slot.slot_number)).size !== requirements.length) throw new Error('Informe apenas um requisito por slot.');
      if (requirements.some(slot => new Set(slot.tests.map(test => test.test_code)).size !== slot.tests.length)) throw new Error('Há códigos de teste duplicados no mesmo slot.');
      const body = { code: requiredText(fields.code, 'o código'), name: requiredText(fields.name, 'o nome'),
        instructions: instructions(fields.instructions, 'installation'), requirements };
      return createTechnicalPackage({ ...args, token, organizationUid, body });
    }, { ...fields, slots }, onSaved)}>
    <BillingField label="Código" name="code" />
    <BillingField label="Nome" name="name" />
    <OperationField label="Instruções de instalação" name="instructions" multiline />
    {slots.map((slot, index) => <SlotEditor key={slot.id} slot={slot} index={index} types={types}
      onChange={patch => setSlots(rows => rows.map(row => row.id === slot.id ? { ...row, ...patch } : row))}
      onRemove={() => setSlots(rows => rows.filter(row => row.id !== slot.id))} />)}
    <Button type="button" variant="outline-primary" size="sm" onClick={() => setSlots(rows => [...rows, emptySlot()])}>Adicionar slot</Button>
  </BillingForm>;
}

function SlotEditor({ slot, index, types, onChange, onRemove }) {
  const models = useOffsetList(listDeviceModels, { params: { typeUid: slot.uid_device_type }, enabled: Boolean(slot.uid_device_type) });
  const field = key => ({ value: slot[key], onChange: event => onChange({ [key]: event.target.value }) });
  return <fieldset className="border rounded p-3 mb-3">
    <legend className="fs-6">Requisito {index + 1}</legend>
    <BillingField type="number" min="1" step="1" label="Número do slot" {...field('slot_number')} />
    <BillingField label="Tipo de requisito" placeholder="primary_tracker" {...field('requirement_type')} />
    <ReferenceField label="Tipo de dispositivo" list={types} value={slot.uid_device_type} optional
      onChange={event => onChange({ uid_device_type: event.target.value, uid_device_model: '' })} />
    <ReferenceField label="Modelo de dispositivo" list={models} optional {...field('uid_device_model')} />
    <BillingField label="Requisito obrigatório" type="checkbox" checked={slot.required} onChange={event => onChange({ required: event.target.checked })} />
    <OperationField label="Instruções para o slot" multiline {...field('note')} />
    {slot.tests.map(test => {
      const update = patch => onChange({ tests: slot.tests.map(row => row.id === test.id ? { ...row, ...patch } : row) });
      return <fieldset key={test.id} className="border rounded p-2 mb-2">
        <legend className="fs-6">Teste técnico</legend>
        <BillingField label="Código do teste" value={test.test_code} onChange={event => update({ test_code: event.target.value })} />
        <BillingField label="Nome do teste" value={test.name} onChange={event => update({ name: event.target.value })} />
        <BillingField label="Teste obrigatório" type="checkbox" checked={test.required} onChange={event => update({ required: event.target.checked })} />
        <Button type="button" variant="outline-danger" size="sm" onClick={() => onChange({ tests: slot.tests.filter(row => row.id !== test.id) })}>Remover teste</Button>
      </fieldset>;
    })}
    <div className="d-flex gap-2">
      <Button type="button" variant="outline-secondary" size="sm" onClick={() => onChange({ tests: [...slot.tests, emptyTest()] })}>Adicionar teste</Button>
      <Button type="button" variant="outline-danger" size="sm" onClick={onRemove}>Remover slot</Button>
    </div>
  </fieldset>;
}

export function AssetPackage({ assetUid, organizationUid, canManage }) {
  const { token } = useSession();
  const profile = useAdminProfile();
  const [revision, setRevision] = useState(0);
  const [open, setOpen] = useState(false);
  const mutation = useBillingMutation();
  const query = useKnowledgeQuery(getAssetTechnicalPackage, { token, assetUid, revision });
  const canWrite = canManage && ['primary_admin', 'administrator'].includes(profile);
  const packages = useOffsetList(listTechnicalPackages, { params: { organizationUid }, enabled: open && canWrite });
  const uid = query.data?.uid_technical_package ?? query.data?.technical_package?.uid ?? query.data?.package?.uid;
  const pkg = query.data?.technical_package ?? query.data?.package;
  const failed = query.error && !['technical_package_not_found', 'device_technical_package_not_found'].includes(query.error.code);
  return <section className="card panel p-3 mb-3">
    <h5>Pacote técnico do ativo</h5>
    {failed ? <BillingRead query={query}>{() => null}</BillingRead> : query.loading ? <p>Consultando pacote…</p> : pkg
      ? <PackageContents row={pkg} /> : uid ? <PackageDetails uid={uid} organizationUid={organizationUid} /> : <p>Nenhum pacote técnico vinculado.</p>}
    {canWrite && !query.loading && !failed && <div><Button size="sm" variant="outline-primary" onClick={() => setOpen(true)}>
      {uid ? 'Trocar pacote' : 'Vincular pacote'}
    </Button></div>}
    {open && canWrite && <BillingForm title="Vincular pacote técnico" mutation={mutation} onClose={() => setOpen(false)}
      submitDisabled={!!packages.error || !packages.items.some(row => row.active !== false)}
      onSubmit={fields => mutation.submit(args => setAssetTechnicalPackage({ ...args, token, assetUid }), fields, () => {
        setOpen(false); setRevision(value => value + 1); notifySuccess('Pacote técnico vinculado.');
      })}>
      <ReferenceField label="Pacote técnico" name="uid_technical_package" list={packages}
        rows={packages.items.filter(row => row.active !== false)} labelOf={packageLabel} defaultValue={uid} />
      {!packages.loading && !packages.error && !packages.items.length && <Alert variant="info">Cadastre um pacote em Devices &amp; SIM.</Alert>}
    </BillingForm>}
  </section>;
}
