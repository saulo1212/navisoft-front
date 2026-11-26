'use client';

import { useState } from 'react';
import { Button, Form, Nav } from 'react-bootstrap';
import { ReferenceField, useAdminProfile } from './AdminReferenceFields';
import { BillingField, BillingForm, BillingRead, useBillingMutation } from './BillingUi';
import DataTable from './DataTable';
import { OperationField } from './OperationalUi';
import Pagination from './Pagination';
import StatusBadge from './StatusBadge';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { usePagedList } from '@/hooks/usePagedList';
import { useOffsetList } from '@/hooks/useOffsetList';
import {
  getDeviceTelemetryOverride, getProtocolIdentity, getTelemetryMapping, listDeviceManufacturers, listDevices,
  listProtocolIdentities, listTelemetryMappings, saveProtocolIdentity, saveTelemetryMapping,
  setDeviceTelemetryOverride, shareProtocolIdentity
} from '@/lib/api/endpoints/devices';
import { listEventProtocolVariants } from '@/lib/api/endpoints/events';
import { telemetryRules } from '@/lib/domain/adminConfiguration';
import { requiredText, requireUid, UUID_PATTERN } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const mono = value => value ? <span className="font-monospace">{value}</span> : '—';
const status = { key: 'active', label: 'Estado', render: row => <StatusBadge status={row.active ? 'active' : 'inactive'} /> };
const identityColumns = [
  { key: 'device_number', label: 'Identidade', render: row => mono(row.device_number) },
  { key: 'vendor', label: 'Fornecedor do protocolo' },
  { key: 'model', label: 'Modelo de protocolo' },
  { key: 'uid_device', label: 'Dispositivo', render: row => mono(row.uid_device) },
  { key: 'version', label: 'Versão' },
  status
];
const profileColumns = [
  { key: 'uid_manufacturer', label: 'Fabricante', render: row => mono(row.uid_manufacturer) },
  { key: 'version', label: 'Versão' },
  status
];
const filterFields = {
  identities: [
    { name: 'q', label: 'Buscar identidade' },
    { name: 'vendor', label: 'Fornecedor do protocolo' },
    { name: 'model', label: 'Modelo de protocolo' },
    { name: 'deviceUid', label: 'UID do dispositivo', pattern: UUID_PATTERN.source }
  ],
  profiles: [
    { name: 'q', label: 'Buscar perfil por modelo' },
    { name: 'protocolModel', label: 'Modelo de protocolo' },
    { name: 'manufacturerUid', label: 'UID do fabricante', pattern: UUID_PATTERN.source }
  ]
};

export function ProtocolIdentitiesTab() {
  return <ResolutionList kind="identities" />;
}

export function TelemetryMappingsTab() {
  const [view, setView] = useState('profiles');
  return <>
    <Nav variant="pills" activeKey={view} onSelect={setView} className="mb-3">
      <Nav.Item><Nav.Link eventKey="profiles">Perfis por fabricante e modelo</Nav.Link></Nav.Item>
      <Nav.Item><Nav.Link eventKey="overrides">Substituições por dispositivo</Nav.Link></Nav.Item>
    </Nav>
    {view === 'profiles' ? <ResolutionList kind="profiles" /> : <DeviceOverrides />}
  </>;
}

function ResolutionList({ kind }) {
  const { token, selectedOrganizationUid: organizationUid } = useSession();
  const profile = useAdminProfile();
  const canWrite = ['primary_admin', 'administrator'].includes(profile);
  const isProfile = kind === 'profiles';
  const [draft, setDraft] = useState({});
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [revision, setRevision] = useState(0);
  const list = usePagedList(isProfile ? listTelemetryMappings : listProtocolIdentities, {
    params: { organizationUid, ...filters }, pageSize: 20
  });
  const columns = isProfile ? [
    { key: 'protocol_model', label: 'Modelo de protocolo', render: row => (
      <Button variant="link" className="p-0" onClick={() => setSelected(row.uid)}>{row.protocol_model}</Button>
    ) },
    ...profileColumns
  ] : identityColumns.map(column => column.key === 'device_number' ? {
    ...column, render: row => <Button variant="link" className="p-0 font-monospace" onClick={() => setSelected(row.uid)}>{row.device_number}</Button>
  } : column);
  const saved = () => { setRevision(value => value + 1); setCreating(false); list.refresh(); };

  function applyFilters(event) {
    event.preventDefault();
    setSelected(null);
    const { active, ...fields } = draft;
    const next = Object.fromEntries(Object.entries(fields).map(([field, value]) => [field, value.trim()]).filter(([, value]) => value));
    if (active) next.active = active === 'true';
    if (list.page === 1 && JSON.stringify(next) === JSON.stringify(filters)) void list.refresh();
    list.goToPage(1);
    setFilters(next);
  }

  return <>
    <Form className="row g-2 align-items-end mb-3" onSubmit={applyFilters}>
      {filterFields[kind].map(({ name, label, pattern }) => (
        <Form.Group key={name} controlId={`resolution-${name}`} className="col-12 col-md">
          <Form.Label>{label}</Form.Label>
          <Form.Control pattern={pattern} value={draft[name] ?? ''} onChange={event => setDraft({ ...draft, [name]: event.target.value })} />
        </Form.Group>
      ))}
      <Form.Group controlId="resolution-active" className="col-6 col-md-auto">
        <Form.Label>Estado</Form.Label>
        <Form.Select value={draft.active ?? ''} onChange={event => setDraft({ ...draft, active: event.target.value })}>
          <option value="">Todos</option><option value="true">Ativos</option><option value="false">Inativos</option>
        </Form.Select>
      </Form.Group>
      <div className="col-auto"><Button type="submit">Buscar</Button></div>
    </Form>
    {canWrite && organizationUid && !list.error && <Button size="sm" className="mb-3" onClick={() => setCreating(true)}>
      {isProfile ? 'Novo perfil de telemetria' : 'Nova identidade de protocolo'}
    </Button>}
    <DataTable columns={columns} rows={list.loading || list.error ? [] : list.items} loading={list.loading} error={list.error}
      emptyMessage={isProfile ? 'Nenhum perfil encontrado.' : 'Nenhuma identidade encontrada.'}
      pagination={{ page: list.page, pageCount: list.pageCount, total: list.total, onPage: page => {
        setSelected(null);
        list.goToPage(page);
      } }} />
    {selected && (isProfile ? <MappingRules key={selected} token={token} organizationUid={organizationUid}
      uid={selected} canWrite={canWrite} version={revision} onChanged={saved} /> : <IdentityDetails key={selected}
      uid={selected} organizationUid={organizationUid} canWrite={canWrite} version={revision} onChanged={saved} />)}
    {creating && canWrite && <ResolutionEditor kind={kind} organizationUid={organizationUid} onClose={() => setCreating(false)} onSaved={saved} />}
  </>;
}

function DeviceOverrides() {
  const { token, selectedOrganizationUid: organizationUid } = useSession();
  const profile = useAdminProfile();
  const canWrite = ['primary_admin', 'administrator'].includes(profile);
  const [selected, setSelected] = useState('');
  const devices = usePagedList(listDevices, { params: { organizationUid, includeInactive: true }, pageSize: 20 });
  const visible = devices.loading || devices.error ? [] : devices.items.filter(row => row.uid_organization === organizationUid);
  const deviceUid = visible.some(row => row.uid === selected) ? selected : '';
  return <>
    <div className="row g-2 mb-3">
      <Form.Group controlId="resolution-device-search" className="col-md-5">
        <Form.Label>Buscar pelo serial</Form.Label>
        <Form.Control value={devices.q} onChange={event => { setSelected(''); devices.setQ(event.target.value); }} />
      </Form.Group>
      <Form.Group controlId="resolution-device" className="col-md-7">
        <Form.Label>Dispositivo</Form.Label>
        <Form.Select value={deviceUid} disabled={!visible.length} onChange={event => setSelected(event.target.value)}>
          <option value="">{devices.loading ? 'Carregando dispositivos…' : devices.error ? 'Lista indisponível' :
            visible.length ? 'Selecione um dispositivo' : 'Nenhum dispositivo encontrado'}</option>
          {visible.map(row => <option key={row.uid} value={row.uid}>{row.device_serial || row.uid}</option>)}
        </Form.Select>
      </Form.Group>
    </div>
    {devices.error && <p className="text-danger" role="alert">{devices.error}</p>}
    {!devices.loading && !devices.error && <Pagination page={devices.page} pageCount={devices.pageCount} onPage={page => {
      setSelected('');
      devices.goToPage(page);
    }} />}
    {deviceUid && <MappingRules key={deviceUid} token={token} organizationUid={organizationUid} deviceUid={deviceUid} canWrite={canWrite} />}
  </>;
}

const overrideMode = { replace: 'Substituir', inherit: 'Herdar', remove: 'Remover' };
function MappingRules({ token, organizationUid, uid, deviceUid, canWrite, version, onChanged }) {
  const overrides = Boolean(deviceUid);
  const [revision, setRevision] = useState(0);
  const [dialog, setDialog] = useState(null);
  const { data, loading, error } = useKnowledgeQuery(overrides ? getDeviceTelemetryOverride : getTelemetryMapping,
    { token, organizationUid, uid, deviceUid, revision, version });
  const rows = (overrides ? data?.overrides : data?.mappings) ?? [];
  const columns = [
    { key: 'source', label: 'Campo de origem' },
    ...(overrides ? [{ key: 'mode', label: 'Ação', render: row => overrideMode[row.mode] || row.mode || '—' }] : []),
    { key: 'canonical', label: 'Campo de destino', render: row => (row.mapping ?? row).canonical ?? '—' },
    { key: 'type', label: 'Tipo', render: row => (row.mapping ?? row).type ?? '—' },
    { key: 'unit', label: 'Unidade', render: row => (row.mapping ?? row).unit ?? '—' },
    { key: 'scale', label: 'Escala', render: row => (row.mapping ?? row).scale ?? '—' },
    { key: 'offset', label: 'Deslocamento', render: row => (row.mapping ?? row).offset ?? '—' }
  ];
  return <section className="mt-4">
    <h5>{overrides ? 'Substituições do dispositivo' : `Regras do perfil ${data?.protocol_model ?? ''}`}</h5>
    {data?.version > 0 && <p className="text-muted small">Versão {data.version}</p>}
    {canWrite && data && <div className="d-flex gap-2 mb-3">
      <Button size="sm" variant="outline-primary" onClick={() => setDialog('edit')}>
        {overrides ? 'Editar substituições' : 'Editar perfil'}
      </Button>
      {overrides && rows.length > 0 && <Button size="sm" variant="outline-danger" onClick={() => setDialog('clear')}>Limpar substituições</Button>}
    </div>}
    <DataTable columns={columns} rows={rows} rowKey={row => row.source} loading={loading} error={error}
      emptyMessage={overrides ? 'Nenhuma substituição configurada para este dispositivo.' : 'Nenhuma regra cadastrada neste perfil.'} />
    {dialog && canWrite && data && <ResolutionEditor kind={overrides ? 'overrides' : 'profiles'} row={data} organizationUid={organizationUid}
      deviceUid={deviceUid} clearing={dialog === 'clear'} onClose={() => setDialog(null)} onSaved={() => {
        setDialog(null); setRevision(value => value + 1); onChanged?.();
      }} />}
  </section>;
}

function IdentityDetails({ uid, organizationUid, canWrite, version, onChanged }) {
  const { token } = useSession();
  const [editing, setEditing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const query = useKnowledgeQuery(getProtocolIdentity, { token, organizationUid, uid, version });
  return <section className="card panel p-3 mt-3">
    <h5>Identidade de protocolo</h5>
    <BillingRead query={query}>{row => <>
      <dl className="row">
        <dt className="col-sm-3">Identidade</dt><dd className="col-sm-9">{mono(row.device_number)}</dd>
        <dt className="col-sm-3">Fornecedor</dt><dd className="col-sm-9">{row.vendor}</dd>
        <dt className="col-sm-3">Modelo</dt><dd className="col-sm-9">{row.model || '—'}</dd>
        <dt className="col-sm-3">Versão</dt><dd className="col-sm-9">{row.version ?? '—'}</dd>
        <dt className="col-sm-3">Estado</dt><dd className="col-sm-9"><StatusBadge status={row.active ? 'active' : 'inactive'} /></dd>
      </dl>
      {canWrite && <div className="d-flex gap-2">
        <Button size="sm" variant="outline-primary" onClick={() => setEditing(true)}>Editar identidade</Button>
        <Button size="sm" variant="outline-secondary" onClick={() => setSharing(true)}>Compartilhar</Button>
      </div>}
      {editing && canWrite && <ResolutionEditor kind="identities" row={row} organizationUid={organizationUid}
        onClose={() => setEditing(false)} onSaved={() => { setEditing(false); onChanged(); }} />}
      {sharing && canWrite && <ShareIdentity uid={row.uid} onClose={() => setSharing(false)} onShared={() => setSharing(false)} />}
    </>}</BillingRead>
  </section>;
}

// Compartilha a identidade com OUTRA organização (resolver 1:N). O dispositivo
// de destino pertence à organização de destino, então ambos os UIDs são
// informados manualmente — o escopo do destino não é consultável por esta sessão.
function ShareIdentity({ uid, onClose, onShared }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const submit = fields => mutation.submit(args => shareProtocolIdentity({
    ...args, token, uid,
    organizationUid: requireUid(fields.uid_organization?.trim(), 'organização de destino'),
    deviceUid: requireUid(fields.uid_device?.trim(), 'dispositivo de destino'),
    reason: fields.reason
  }), fields, () => { notifySuccess('Identidade compartilhada com a organização de destino.'); onShared(); });
  return <BillingForm title="Compartilhar identidade de protocolo" submitLabel="Compartilhar" mutation={mutation} onClose={onClose} onSubmit={submit}>
    <p className="small text-body-secondary">Vincula esta identidade a um dispositivo de outra organização. Informe os UIDs de destino.</p>
    <BillingField label="UID da organização de destino" name="uid_organization" />
    <BillingField label="UID do dispositivo de destino" name="uid_device" />
    <OperationField label="Motivo do compartilhamento" name="reason" multiline />
  </BillingForm>;
}

const ruleSample = { source: 'S_ASSIGN1', canonical: 'extBatteryVoltage', group: 'hardware', type: 'number', unit: 'V', scale: 1, offset: 0 };
const editableMapping = ({ source, canonical, group, type, unit, scale, offset, ...other }) =>
  Object.fromEntries(Object.entries({ ...other, source, canonical, group, type, unit, scale, offset })
    .filter(([key, value]) => !['uid', 'created_at', 'updated_at'].includes(key) && value != null));
const editableOverride = row => row.mode === 'replace' ? editableMapping({ ...row.mapping, ...row, mapping: undefined })
  : { source: row.source, mode: row.mode };

function ResolutionEditor({ kind, row, organizationUid, deviceUid, clearing, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const identity = kind === 'identities';
  const override = kind === 'overrides';
  const profile = kind === 'profiles';
  const [identityDevice, setIdentityDevice] = useState(row?.uid_device ?? '');
  const devices = useOffsetList(listDevices, { params: { organizationUid }, enabled: identity });
  const makers = useOffsetList(listDeviceManufacturers, { enabled: profile });
  const variants = useOffsetList(listEventProtocolVariants, { limit: 100, enabled: identity });
  const chosenDevice = devices.items.find(item => item.uid === identityDevice && item.uid_organization === organizationUid);
  const originalDevice = row?.uid_device === identityDevice;
  const variantOptions = variants.items.filter(item => (chosenDevice?.uid_model && item.uid_model === chosenDevice.uid_model) ||
    (originalDevice && row?.uid_protocol_variant === item.uid));
  const title = clearing ? 'Limpar substituições' : override ? 'Editar substituições' :
    `${row ? 'Editar' : 'Cadastrar'} ${identity ? 'identidade de protocolo' : 'perfil de telemetria'}`;
  const submit = fields => mutation.submit(args => {
    if (override) return setDeviceTelemetryOverride({ ...args, token, deviceUid, body: {
      overrides: clearing ? [] : telemetryRules(fields.rules, true)
    } });
    const active = fields.active === 'on';
    const body = identity ? {
      uid_device: requireUid(identityDevice, 'dispositivo'), vendor: requiredText(fields.vendor, 'o fornecedor'),
      device_number: requiredText(fields.device_number, 'a identidade'), model: requiredText(fields.model, 'o modelo'),
      uid_protocol_variant: fields.uid_protocol_variant || null, active
    } : {
      uid_manufacturer: requireUid(fields.uid_manufacturer, 'fabricante'), protocol_model: requiredText(fields.protocol_model, 'o modelo'),
      active, mappings: telemetryRules(fields.rules)
    };
    if (identity && !originalDevice && !chosenDevice) throw new Error('Selecione um dispositivo disponível na organização.');
    if (identity && body.uid_protocol_variant && !variantOptions.some(item => item.uid === body.uid_protocol_variant) &&
      !(originalDevice && row?.uid_protocol_variant === body.uid_protocol_variant)) throw new Error('Selecione uma variante compatível com o modelo do dispositivo.');
    return (identity ? saveProtocolIdentity : saveTelemetryMapping)({ ...args, token, organizationUid, uid: row?.uid, body });
  }, { ...fields, identityDevice }, () => {
    notifySuccess(clearing ? 'Substituições removidas. O dispositivo volta a herdar o perfil.' : 'Configuração de telemetria salva.');
    onSaved();
  });
  const ruleRows = override ? (row?.overrides ?? []).map(editableOverride) : (row?.mappings ?? []).map(editableMapping);
  return <BillingForm title={title} submitLabel={clearing ? 'Confirmar limpeza' : 'Salvar'} mutation={mutation} onClose={onClose} onSubmit={submit}>
    {identity && <>
      {row ? <BillingField label="Dispositivo" value={chosenDevice?.device_serial || identityDevice} readOnly /> : <>
        <BillingField label="Buscar dispositivo pelo serial" value={devices.q} onChange={event => devices.setQ(event.target.value)} optional />
        <ReferenceField label="Dispositivo" list={devices} rows={devices.items.filter(item => item.uid_organization === organizationUid)}
          labelOf={item => item.device_serial || item.uid} value={identityDevice} onChange={event => setIdentityDevice(event.target.value)} />
      </>}
      <BillingField label="Fornecedor do protocolo" name="vendor" defaultValue={row?.vendor} readOnly={!!row} />
      <BillingField label="Identidade do dispositivo" name="device_number" defaultValue={row?.device_number} readOnly={!!row} />
      <BillingField label="Modelo de protocolo" name="model" defaultValue={row?.model} readOnly={!!row} />
      <ReferenceField key={identityDevice} label="Variante do protocolo" name="uid_protocol_variant" list={variants} rows={variantOptions}
        defaultValue={originalDevice ? row?.uid_protocol_variant : ''} labelOf={item => item.code} optional placeholder="Sem variante" />
    </>}
    {profile && <>
      <ReferenceField label="Fabricante" name="uid_manufacturer" list={makers} defaultValue={row?.uid_manufacturer} />
      <BillingField label="Modelo de protocolo" name="protocol_model" defaultValue={row?.protocol_model} />
    </>}
    {!override && <BillingField label="Ativo" name="active" type="checkbox" defaultChecked={row?.active ?? true} />}
    {clearing ? <p>Remover todas as substituições deste dispositivo e voltar às regras herdadas?</p> :
      !identity && <>
        {override && <p>Use <code>replace</code> para substituir, <code>remove</code> para suprimir ou <code>inherit</code> para herdar o campo.</p>}
        <OperationField label={override ? 'Substituições (JSON)' : 'Regras do perfil (JSON)'} name="rules"
          multiline required defaultValue={JSON.stringify(ruleRows, null, 2)} />
        {!ruleRows.length && <p className="small text-body-secondary">Exemplo de regra <code>
          {JSON.stringify(override ? { ...ruleSample, mode: 'replace' } : ruleSample)}
        </code></p>}
      </>}
  </BillingForm>;
}
