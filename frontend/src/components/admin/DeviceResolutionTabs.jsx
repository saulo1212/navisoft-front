'use client';

import { useState } from 'react';
import { Button, Form, Nav } from 'react-bootstrap';
import DataTable from './DataTable';
import Pagination from './Pagination';
import StatusBadge from './StatusBadge';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { usePagedList } from '@/hooks/usePagedList';
import {
  getDeviceTelemetryOverride, getTelemetryMapping, listDevices, listProtocolIdentities, listTelemetryMappings
} from '@/lib/api/endpoints/devices';
import { UUID_PATTERN } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

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
  const isProfile = kind === 'profiles';
  const [draft, setDraft] = useState({});
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(null);
  const list = usePagedList(isProfile ? listTelemetryMappings : listProtocolIdentities, {
    params: { organizationUid, ...filters }, pageSize: 20
  });
  const columns = isProfile ? [
    { key: 'protocol_model', label: 'Modelo de protocolo', render: row => (
      <Button variant="link" className="p-0" onClick={() => setSelected(row.uid)}>{row.protocol_model}</Button>
    ) },
    ...profileColumns
  ] : identityColumns;

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
    <DataTable columns={columns} rows={list.loading || list.error ? [] : list.items} loading={list.loading} error={list.error}
      emptyMessage={isProfile ? 'Nenhum perfil encontrado.' : 'Nenhuma identidade encontrada.'}
      pagination={{ page: list.page, pageCount: list.pageCount, total: list.total, onPage: page => {
        setSelected(null);
        list.goToPage(page);
      } }} />
    {selected && !list.loading && !list.error && <MappingRules key={selected} token={token} organizationUid={organizationUid} uid={selected} />}
  </>;
}

function DeviceOverrides() {
  const { token, selectedOrganizationUid: organizationUid } = useSession();
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
    {deviceUid && <MappingRules key={deviceUid} token={token} organizationUid={organizationUid} deviceUid={deviceUid} />}
  </>;
}

const overrideMode = { replace: 'Substituir', inherit: 'Herdar', remove: 'Remover' };
function MappingRules({ token, organizationUid, uid, deviceUid }) {
  const overrides = Boolean(deviceUid);
  const { data, loading, error } = useKnowledgeQuery(overrides ? getDeviceTelemetryOverride : getTelemetryMapping,
    { token, organizationUid, uid, deviceUid });
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
    <DataTable columns={columns} rows={rows} rowKey={row => row.source} loading={loading} error={error}
      emptyMessage={overrides ? 'Nenhuma substituição configurada para este dispositivo.' : 'Nenhuma regra cadastrada neste perfil.'} />
  </section>;
}
