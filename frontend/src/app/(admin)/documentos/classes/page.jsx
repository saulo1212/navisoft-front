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
import { createDocumentClass, getDocumentClass, listDocumentClasses, listGedFunctionalGroups, updateDocumentClass } from '@/lib/api/endpoints/documents';
import { documentClassBody, documentClassForm, GED_ACTIONS, GED_PRINCIPALS } from '@/lib/domain/documents';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="documents"><Classes /></OperationalGate>; }
function Classes() {
  const { token, selectedOrganizationUid } = useSession();
  const args = { token, organizationUid: selectedOrganizationUid };
  const list = useOffsetList(listDocumentClasses, { params: { organizationUid: selectedOrganizationUid } });
  const groups = useOffsetList(listGedFunctionalGroups, { params: { organizationUid: selectedOrganizationUid } });
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const [current, setCurrent] = useState(null);
  const [notice, setNotice] = useState(null);
  const deny = () => { setForm(null); setCurrent(null); list.setItems([]); };
  const save = event => {
    event.preventDefault();
    void action.run(signal => {
      const body = documentClassBody(form, selectedOrganizationUid, !current);
      return current ? updateDocumentClass({ ...args, uid: current.uid, body, signal }) : createDocumentClass({ ...args, body, signal, idempotencyKey: intentKey(intention, 'ged-class', body) });
    }, () => { setForm(null); setCurrent(null); setNotice('Classe salva.'); list.refresh(); }, deny);
  };
  const permissionChange = (index, patch) => setForm({ ...form, permissions: form.permissions.map((row, i) => i === index ? { ...row, ...patch } : row) });
  return <><PageBreadcrumb title="Classes e permissões GED" subTitle1="Conteúdo" /><DocumentsNavigation /><p>Leitura, download, revisão e gestão são autorizações independentes. Nenhuma ação concede as demais automaticamente.</p>
    {notice && <Alert variant="success">{notice}</Alert>}{action.error && !form && <Alert variant="danger">{action.error}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} actionLabel="Nova classe" actionDisabled={action.busy} onAction={() => { intention.current = null; action.clearError(); setCurrent(null); setForm(documentClassForm()); }} />
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[{ key: 'code', label: 'Código' }, { key: 'name', label: 'Classe', render: row => <Button variant="link" disabled={action.busy} onClick={() => { action.clearError(); void action.run(signal => getDocumentClass({ ...args, uid: row.uid, signal }), result => { const item = result.item ?? result; setCurrent(item); setForm(documentClassForm(item)); }, deny); }}>{row.name}</Button> }, { key: 'active', label: 'Ativa', render: row => row.active ? 'Sim' : 'Não' }]} />
    {form && <FormModal show title={current ? 'Editar classe e permissões' : 'Nova classe'} submitting={action.busy} error={action.error} onSubmit={save} onHide={() => { if (!action.busy) setForm(null); }}><fieldset disabled={action.busy}>
      {!current && <OperationField label="Código" required value={form.code} onChange={event => setForm({ ...form, code: event.target.value })} />}<OperationField label="Nome" required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} />
      {current ? <><Form.Check id="ged-class-active" label="Classe ativa" checked={form.active} onChange={event => setForm({ ...form, active: event.target.checked })} className="mb-3" /><h6>Permissões explícitas</h6>{form.permissions.map((row, index) => <div key={index} className="border rounded p-2 mb-3"><label className="form-label" htmlFor={`principal-${index}`}>Quem recebe</label><Form.Select id={`principal-${index}`} className="mb-2" value={row.principal_type} onChange={event => permissionChange(index, { principal_type: event.target.value, uid_functional_group: '' })}>{Object.entries(GED_PRINCIPALS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}{!Object.hasOwn(GED_PRINCIPALS, row.principal_type) && <option value={row.principal_type}>{row.principal_type}</option>}</Form.Select>{row.principal_type === 'functional_group' && <><label className="form-label" htmlFor={`group-${index}`}>Grupo funcional</label><Form.Select id={`group-${index}`} required className="mb-2" value={row.uid_functional_group} onChange={event => permissionChange(index, { uid_functional_group: event.target.value })}><option value="">Selecione</option>{groups.items.filter(group => group.active || group.uid === row.uid_functional_group).map(group => <option key={group.uid} value={group.uid}>{group.name}</option>)}{row.uid_functional_group && !groups.items.some(group => group.uid === row.uid_functional_group) && <option value={row.uid_functional_group}>{row.uid_functional_group}</option>}</Form.Select></>}<label className="form-label" htmlFor={`action-${index}`}>Ação autorizada</label><Form.Select id={`action-${index}`} className="mb-2" value={row.action_code} onChange={event => permissionChange(index, { action_code: event.target.value })}>{Object.entries(GED_ACTIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Form.Select><Button type="button" variant="outline-danger" size="sm" onClick={() => setForm({ ...form, permissions: form.permissions.filter((_, i) => i !== index) })}>Remover permissão</Button></div>)}<Button type="button" variant="outline-secondary" onClick={() => setForm({ ...form, permissions: [...form.permissions, { principal_type: 'target', action_code: 'read', uid_functional_group: '' }] })}>Adicionar permissão</Button>{groups.hasMore && <Button type="button" variant="link" disabled={groups.loading} onClick={groups.loadMore}>Mais grupos</Button>}{groups.error && <Alert variant="danger">Erro ao carregar grupos: {groups.error}</Alert>}<p className="small mt-3">Salvar substitui toda a lista de permissões. Lista vazia remove as concessões explícitas.</p></> : <p className="small">A classe nasce sem concessões. Abra a classe criada para configurar suas permissões.</p>}
    </fieldset></FormModal>}
  </>;
}
