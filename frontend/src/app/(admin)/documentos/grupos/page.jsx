'use client';
import { useRef, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import DocumentsNavigation from '@/components/admin/DocumentsNavigation';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import { OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createGedFunctionalGroup, createGedFunctionalMember, listGedFunctionalGroups, listGedFunctionalMembers, removeGedFunctionalMember, updateGedFunctionalGroup } from '@/lib/api/endpoints/documents';
import { functionalGroupBody, functionalMemberBody } from '@/lib/domain/documents';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="documents"><Groups /></OperationalGate>; }
function Groups() {
  const { token, selectedOrganizationUid } = useSession();
  const args = { token, organizationUid: selectedOrganizationUid };
  const action = useOperationalAction();
  const intention = useRef(null);
  const list = useOffsetList(listGedFunctionalGroups, { params: { organizationUid: selectedOrganizationUid } });
  const [group, setGroup] = useState(null);
  const [form, setForm] = useState(null);
  const [memberUid, setMemberUid] = useState(null);
  const [remove, setRemove] = useState(null);
  const [notice, setNotice] = useState(null);
  const members = useOffsetList(listGedFunctionalMembers, { params: { organizationUid: selectedOrganizationUid, groupUid: group?.uid }, enabled: !!group });
  const deny = () => { setGroup(null); setForm(null); setMemberUid(null); setRemove(null); list.setItems([]); members.setItems([]); };
  const complete = () => { setForm(null); setMemberUid(null); setRemove(null); setNotice('Operação concluída.'); list.refresh(); if (group) members.refresh(); };
  return <><PageBreadcrumb title="Grupos funcionais GED" subTitle1="Conteúdo" /><DocumentsNavigation /><p>A associação a um grupo não cria acesso à organização. O membro precisa manter um escopo legítimo; as ações GED dependem das permissões da classe.</p>
    {notice && <Alert variant="success">{notice}</Alert>}{action.error && !form && memberUid === null && !remove && <Alert variant="danger">{action.error}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} actionLabel="Novo grupo" actionDisabled={action.busy} onAction={() => { action.clearError(); intention.current = null; setForm({ code: '', name: '', description: '', active: true, uid: null }); }} />
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[{ key: 'code', label: 'Código' }, { key: 'name', label: 'Grupo', render: row => <Button variant="link" disabled={action.busy} onClick={() => setGroup(row)}>{row.name}</Button> }, { key: 'active', label: 'Ativo', render: row => row.active ? 'Sim' : 'Não' }, { key: 'edit', label: 'Ações', render: row => <Button variant="outline-secondary" size="sm" disabled={action.busy} onClick={() => { action.clearError(); setForm({ ...row, description: row.description || '' }); }}>Editar</Button> }]} />
    {group && <section className="mt-4"><div className="d-flex justify-content-between align-items-center mb-3"><h5>Membros de {group.name}</h5><Button disabled={action.busy} onClick={() => { action.clearError(); intention.current = null; setMemberUid(''); }}>Associar usuário</Button></div><DataTable rows={members.items} loading={members.loading} error={members.error} hasMore={!members.loading && members.hasMore} onLoadMore={members.loadMore} columns={[{ key: 'user', label: 'Usuário', render: row => row.user_name || row.display_name || row.uid_member_user }, { key: 'active', label: 'Associação', render: row => row.active === false ? 'Inativa' : 'Cadastrada' }, { key: 'remove', label: 'Ações', render: row => <Button variant="outline-danger" size="sm" disabled={action.busy} onClick={() => { action.clearError(); setRemove(row); }}>Remover associação</Button> }]} /></section>}
    {form && <FormModal show title={form.uid ? 'Editar grupo' : 'Novo grupo'} submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setForm(null); }} onSubmit={event => { event.preventDefault(); void action.run(signal => { const body = functionalGroupBody(form, selectedOrganizationUid, !form.uid); return form.uid ? updateGedFunctionalGroup({ ...args, uid: form.uid, body, signal }) : createGedFunctionalGroup({ ...args, body, signal, idempotencyKey: intentKey(intention, 'ged-group', body) }); }, complete, deny); }}><fieldset disabled={action.busy}>{!form.uid && <OperationField label="Código" required value={form.code} onChange={event => setForm({ ...form, code: event.target.value })} />}<OperationField label="Nome" required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /><OperationField label="Descrição" multiline value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /><Form.Check id="ged-group-active" label="Grupo ativo" checked={form.active} onChange={event => setForm({ ...form, active: event.target.checked })} /></fieldset></FormModal>}
    {memberUid !== null && group && <FormModal show title={`Associar usuário a ${group.name}`} submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setMemberUid(null); }} onSubmit={event => { event.preventDefault(); void action.run(signal => { const body = functionalMemberBody({ uid_functional_group: group.uid, uid_member_user: memberUid }, selectedOrganizationUid); return createGedFunctionalMember({ ...args, body, signal, idempotencyKey: intentKey(intention, `ged-member:${group.uid}`, body) }); }, complete, deny); }}><OperationField label="UUID do usuário" required value={memberUid} onChange={event => setMemberUid(event.target.value)} /><p className="small">A API valida se o usuário possui acesso legítimo à organização selecionada.</p></FormModal>}
    {remove && <FormModal show title="Remover associação" submitLabel="Remover" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setRemove(null); }} onSubmit={event => { event.preventDefault(); void action.run(signal => removeGedFunctionalMember({ ...args, uid: remove.uid, signal }), complete, deny); }}><p>Remover a associação do usuário {remove.uid_member_user} ao grupo {group?.name}?</p></FormModal>}
  </>;
}
