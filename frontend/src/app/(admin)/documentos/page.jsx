'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { Suspense, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, Button, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import DocumentsNavigation from '@/components/admin/DocumentsNavigation';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import { OperationalGate, OperationField, operationError, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { createDocument, getDocumentCatalogs, listDocumentClasses, listDocuments } from '@/lib/api/endpoints/documents';
import { documentBody } from '@/lib/domain/documents';
import { intentKey, requireUid } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="documents"><Suspense fallback={<p>Carregando documentos...</p>}><Documents /></Suspense></OperationalGate>; }
function Documents() {
  const { token, selectedOrganizationUid } = useSession();
  const router = useRouter();
  const search = useSearchParams();
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState(null);
  const list = useOffsetList(listDocuments, { params: { organizationUid: selectedOrganizationUid } });
  const catalogs = useKnowledgeQuery(getDocumentCatalogs, { token });
  const classes = useOffsetList(listDocumentClasses, { params: { organizationUid: selectedOrganizationUid } });
  const field = key => ({ value: form[key], onChange: event => setForm({ ...form, [key]: event.target.value }) });
  const save = event => {
    event.preventDefault();
    void action.run(async signal => {
      const body = documentBody(form, selectedOrganizationUid, catalogs.data);
      const result = await createDocument({ token, organizationUid: selectedOrganizationUid, body, signal, idempotencyKey: intentKey(intention, 'ged-document', body) });
      return requireUid((result.item ?? result).uid, 'documento criado');
    }, uid => { setForm(null); router.push(detailHref('/documentos', uid)); }, () => { setForm(null); list.setItems([]); });
  };
  return <>
    <PageBreadcrumb title="Documentos / GED" subTitle1="Conteúdo" /><DocumentsNavigation />
    <p>Consulte documentos próprios e recebidos por distribuição no contexto da organização selecionada.</p>
    {action.error && !form && <Alert variant="danger">{action.error}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar por título..." createLabel="Novo documento" actionDisabled={action.busy || !catalogs.data} onAction={() => { action.clearError(); intention.current = null; setForm({ uid_contract: search.get('contrato') || '', title: '', uid_class: '', origin_code: '', area_code: '', type_code: '', metadata: '{}', target_type: '', target_uid: '' }); }} />
    {catalogs.error && <Alert variant="danger">{operationError(catalogs.error)}</Alert>}
    <Button variant="outline-secondary" className="mb-3" disabled={list.loading} onClick={list.refresh}>Atualizar</Button>
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[
      { key: 'code', label: 'Documento', render: row => <Button variant="link" onClick={() => router.push(detailHref('/documentos', row.uid))}>{row.code || row.uid}</Button> }, { key: 'title', label: 'Título' }, { key: 'class_name', label: 'Classe' }, { key: 'access_source', label: 'Acesso', render: row => row.access_source === 'distribution' ? 'Distribuído' : row.access_source || 'Próprio' }, { key: 'active', label: 'Ativo', render: row => row.active ? 'Sim' : 'Não' }
    ]} />
    {form && <FormModal show title="Novo documento" submitting={action.busy} error={action.error} onSubmit={save} onHide={() => { if (!action.busy) setForm(null); }}><fieldset disabled={action.busy}>
      <OperationField label="UUID do contrato GED" required {...field('uid_contract')} /><OperationField label="Título" required {...field('title')} />
      {[['origin_code', 'origins', 'Origem'], ['area_code', 'areas', 'Área'], ['type_code', 'types', 'Tipo']].map(([key, catalog, label]) => <Form.Group key={key} controlId={`ged-${key}`} className="mb-3"><Form.Label>{label}</Form.Label><Form.Select required {...field(key)}><option value="">Selecione</option>{catalogs.data?.[catalog]?.filter(row => row.active).map(row => <option key={row.code} value={row.code}>{row.code} — {row.name}</option>)}</Form.Select></Form.Group>)}
      <Form.Group controlId="ged-class" className="mb-3"><Form.Label>Classe documental</Form.Label><Form.Select {...field('uid_class')}><option value="">Sem classe</option>{classes.items.filter(row => row.active).map(row => <option key={row.uid} value={row.uid}>{row.name}</option>)}</Form.Select></Form.Group>{classes.hasMore && <Button type="button" variant="outline-secondary" onClick={classes.loadMore} disabled={classes.loading}>Carregar mais classes</Button>}{classes.error && <Alert variant="danger">Erro nas classes: {classes.error}</Alert>}
      <Form.Group controlId="ged-target" className="mb-3"><Form.Label>Assunto / alvo opcional</Form.Label><Form.Select {...field('target_type')}><option value="">Sem alvo</option><option value="organization">Organização</option><option value="entity">Entidade</option></Form.Select></Form.Group>{form.target_type && <OperationField label="UUID do alvo" required {...field('target_uid')} />}<p className="small text-muted">O alvo descreve o assunto. Compartilhamento com outra organização exige distribuição explícita.</p>
      <details><summary className="mb-3">Metadados adicionais</summary><OperationField label="Metadados (JSON)" multiline required {...field('metadata')} /></details>
    </fieldset></FormModal>}
  </>;
}
