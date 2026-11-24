'use client';

import { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import DataTable from './DataTable';
import { BillingField, BillingForm, useBillingMutation } from './BillingUi';
import { ReferenceField } from './AdminReferenceFields';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import {
  addAssignmentManager, addAssignmentWorkMode, createOrganizationUnit, createPosition, endAssignmentWorkMode,
  listAssignmentManagers, listAssignments, listAssignmentWorkModes, listOrganizationUnits, listOrganizationUnitTypes,
  listPositions, listWorkModes, searchCollaborators, updateOrganizationUnit, updatePosition
} from '@/lib/api/endpoints/collaborators';
import { normalizeList } from '@/lib/api/http';
import { datePeriod } from '@/lib/domain/adminConfiguration';
import { fmtDate } from '@/lib/domain/collaborators';
import { requiredText } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const refName = row => row.canonical_name || row.name || row.code;
const personName = row => row.preferred_name || row.legal_name || row.name;
const colDates = [
  { key: 'started_on', label: 'Início', render: row => fmtDate(row.started_on) },
  { key: 'ended_on', label: 'Fim', render: row => fmtDate(row.ended_on) }
];
const activeOn = (row, day) => row.started_on <= day && (!row.ended_on || row.ended_on >= day);
const listProps = list => ({
  rows: list.error ? [] : list.items, error: list.error, loading: list.loading,
  hasMore: list.hasMore, loadingMore: list.loading && list.items.length > 0, onLoadMore: list.loadMore
});

export function CollaboratorStructure() {
  const { token, selectedOrganizationUid: organizationUid } = useSession();
  return <Structure key={`${token}:${organizationUid}`} />;
}

function Structure() {
  const { token, selectedOrganizationUid: organizationUid } = useSession();
  const [tab, setTab] = useState('positions');
  const [editor, setEditor] = useState(null);
  const unitTab = tab === 'units';
  const positions = useOffsetList(listPositions, { params: { organizationUid }, enabled: !unitTab });
  const units = useOffsetList(listOrganizationUnits, { params: { organizationUid }, enabled: unitTab });
  const types = useKnowledgeQuery(listOrganizationUnitTypes, { token }, unitTab);
  const unitTypes = normalizeList(types.data).items;
  const list = unitTab ? units : positions;
  const columns = [
    { key: 'code', label: 'Código' }, { key: 'name', label: 'Nome' },
    ...(unitTab ? [
      { key: 'uid_unit_type', label: 'Tipo', render: row => refName(unitTypes.find(type => type.uid === row.uid_unit_type) ?? {}) || row.uid_unit_type },
      { key: 'uid_parent', label: 'Unidade superior', render: row => units.items.find(unit => unit.uid === row.uid_parent)?.name || row.uid_parent || 'Raiz' }
    ] : [{ key: 'description', label: 'Descrição' }]),
    { key: 'active', label: 'Ativo', render: row => row.active ? 'Sim' : 'Não' },
    { key: 'actions', label: 'Ações', render: row => <Button type="button" variant="link" size="sm" onClick={() => setEditor(row)}>Editar</Button> }
  ];
  return <section className="mt-4">
    <h2 className="h5">Estrutura organizacional</h2>
    <Nav variant="pills" className="mb-3" activeKey={tab} onSelect={key => { setEditor(null); setTab(key); }}>
      <Nav.Item><Nav.Link eventKey="positions">Cargos</Nav.Link></Nav.Item>
      <Nav.Item><Nav.Link eventKey="units">Unidades organizacionais</Nav.Link></Nav.Item>
    </Nav>
    <Button size="sm" className="mb-3" onClick={() => setEditor({})} disabled={list.loading || !!list.error || (unitTab && !unitTypes.length)}>
      {unitTab ? 'Nova unidade' : 'Novo cargo'}
    </Button>
    {unitTab && types.error && <p className="text-danger" role="alert">Falha ao consultar os tipos de unidade.</p>}
    <DataTable columns={columns} {...listProps(list)} />
    {editor && <StructureEditor row={editor} unitTab={unitTab} units={units} types={unitTypes} onClose={() => setEditor(null)}
      onSaved={() => { setEditor(null); list.refresh(); notifySuccess(unitTab ? 'Unidade salva.' : 'Cargo salvo.'); }} />}
  </section>;
}

function StructureEditor({ row, unitTab, units, types, onClose, onSaved }) {
  const { token, selectedOrganizationUid: organizationUid } = useSession();
  const mutation = useBillingMutation();
  const label = unitTab ? 'unidade' : 'cargo';
  const save = unitTab ? (row.uid ? updateOrganizationUnit : createOrganizationUnit) : (row.uid ? updatePosition : createPosition);
  const descendants = new Set([row.uid].filter(Boolean));
  while (units.items.some(unit => descendants.has(unit.uid_parent) && !descendants.has(unit.uid))) {
    for (const unit of units.items) if (descendants.has(unit.uid_parent)) descendants.add(unit.uid);
  }
  const parentOptions = units.items.filter(unit => unit.active && !descendants.has(unit.uid));
  return <BillingForm title={`${row.uid ? 'Editar' : 'Criar'} ${label}`} mutation={mutation} onClose={onClose}
    onSubmit={fields => mutation.submit(args => {
      const body = {
        code: requiredText(fields.code, 'o código'), name: requiredText(fields.name, 'o nome'),
        ...(unitTab ? { uid_unit_type: fields.uid_unit_type, uid_parent: fields.uid_parent || null } : { description: fields.description.trim() })
      };
      if (row.uid) body.active = fields.active === 'on';
      return save({ ...args, token, organizationUid, uid: row.uid, body });
    }, fields, onSaved)}>
    <BillingField name="code" label="Código" defaultValue={row.code} />
    <BillingField name="name" label="Nome" defaultValue={row.name} />
    {unitTab ? <>
      <ReferenceField label="Tipo de unidade" name="uid_unit_type" rows={types.filter(type => type.active || type.uid === row.uid_unit_type)}
        labelOf={refName} defaultValue={row.uid_unit_type} />
      <ReferenceField label="Unidade superior" name="uid_parent" list={units} rows={parentOptions} defaultValue={row.uid_parent ?? ''}
        placeholder="Unidade raiz" optional />
    </> : <BillingField name="description" label="Descrição" defaultValue={row.description ?? ''} optional />}
    {row.uid && <BillingField name="active" label="Ativo" type="checkbox" defaultChecked={row.active} />}
  </BillingForm>;
}

export function AssignmentConfiguration({ uid, organizationUid, assignment, canWrite = true }) {
  const { token } = useSession();
  const [editor, setEditor] = useState(null);
  const params = { uid, organizationUid, assignmentUid: assignment.uid };
  const periods = useOffsetList(listAssignmentWorkModes, { params });
  const managers = useOffsetList(listAssignmentManagers, { params });
  const types = useKnowledgeQuery(listWorkModes, { token });
  const options = normalizeList(types.data).items;
  const writable = canWrite && !assignment.ended_on;
  const periodColumns = [
    { key: 'uid_work_mode', label: 'Modo', render: row => refName(options.find(item => item.uid === row.uid_work_mode) ?? {}) || row.uid_work_mode },
    ...colDates,
    { key: 'actions', label: 'Ações', render: row => writable && !row.ended_on &&
      <Button size="sm" variant="link" onClick={() => setEditor({ kind: 'end', row })}>Encerrar</Button> }
  ];
  return <div className="border rounded p-3 mt-2">
    <div className="d-flex justify-content-between gap-2 align-items-center mb-2">
      <h6 className="mb-0">Histórico de modos de trabalho</h6>
      {writable && <Button size="sm" variant="outline-primary" disabled={!!periods.error || !options.some(option => option.active)}
        onClick={() => setEditor({ kind: 'mode' })}>Adicionar modo</Button>}
    </div>
    <DataTable columns={periodColumns} {...listProps(periods)} emptyMessage="Nenhum modo de trabalho cadastrado." />
    <div className="d-flex justify-content-between gap-2 align-items-center my-2">
      <h6 className="mb-0">Histórico de gestores</h6>
      {writable && <Button size="sm" variant="outline-primary" disabled={!!managers.error}
        onClick={() => setEditor({ kind: 'manager' })}>Vincular gestor</Button>}
    </div>
    <DataTable columns={[
      { key: 'uid_manager_assignment', label: 'Gestor', render: row => row.manager_name || row.manager_preferred_name || row.uid_manager_assignment },
      ...colDates
    ]} {...listProps(managers)} emptyMessage="Nenhum gestor vinculado." />
    {editor && <AssignmentEditor editor={editor} params={params} assignment={assignment} options={options.filter(option => option.active)}
      onClose={() => setEditor(null)} onSaved={() => {
        setEditor(null); (editor.kind === 'manager' ? managers : periods).refresh(); notifySuccess('Lotação atualizada.');
      }} />}
  </div>;
}

function AssignmentEditor({ editor, params, assignment, options, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const [managerUid, setManagerUid] = useState('');
  const [day, setDay] = useState('');
  const manager = editor.kind === 'manager';
  const end = editor.kind === 'end';
  const people = useOffsetList(searchCollaborators, { params: { organizationUid: params.organizationUid }, enabled: manager });
  const assignments = useOffsetList(listAssignments, { params: { organizationUid: params.organizationUid, uid: managerUid }, enabled: manager && Boolean(managerUid) });
  const choices = (assignments.error || assignments.loading ? [] : assignments.items).filter(row => row.uid !== assignment.uid &&
    row.uid_collaborator === managerUid && row.uid_organization === params.organizationUid && activeOn(row, day));
  const request = manager ? addAssignmentManager : end ? endAssignmentWorkMode : addAssignmentWorkMode;
  return <BillingForm title={manager ? 'Vincular gestor' : end ? 'Encerrar modo de trabalho' : 'Adicionar modo de trabalho'}
    mutation={mutation} onClose={onClose} submitDisabled={manager && !choices.length} onSubmit={fields => mutation.submit(args => {
      const period = datePeriod(end ? editor.row.started_on : fields.started_on, fields.ended_on);
      const body = end ? { ended_on: period.ended_on } : manager
        ? { ...period, uid_manager_assignment: fields.uid_manager_assignment } : { ...period, uid_work_mode: fields.uid_work_mode };
      if (manager && !choices.some(row => row.uid === body.uid_manager_assignment)) throw new Error('Selecione uma lotação vigente do gestor.');
      return request({ ...args, token, ...params, body, periodUid: editor.row?.uid });
    }, fields, onSaved)}>
    {!end && <BillingField label="Início" name="started_on" type="date" min={assignment.started_on} value={day} onChange={event => setDay(event.target.value)} />}
    {manager ? <>
      <BillingField label="Buscar gestor pelo nome" optional value={people.q} onChange={event => { setManagerUid(''); people.setQ(event.target.value); }} />
      <ReferenceField label="Colaborador gestor" list={people} rows={people.items.filter(row => row.active !== false)}
        labelOf={personName} value={managerUid} onChange={event => setManagerUid(event.target.value)} />
      <ReferenceField key={`${managerUid}:${day}`} label="Lotação vigente do gestor" name="uid_manager_assignment" list={assignments}
        rows={choices} placeholder="Selecione o gestor e a data" labelOf={row => `${row.position_name || row.organization_unit_name || row.uid} · ${fmtDate(row.started_on)}`} />
    </> : !end && <ReferenceField label="Modo de trabalho" name="uid_work_mode" rows={options} labelOf={refName} />}
    <BillingField label="Fim" name="ended_on" type="date" min={end ? editor.row.started_on : day || assignment.started_on} optional={!end} />
  </BillingForm>;
}
