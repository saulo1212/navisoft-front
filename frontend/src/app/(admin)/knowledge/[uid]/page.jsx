'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useRef, useState } from 'react';
import { useDetailParam } from '@/lib/navigation/useDetailParam';
import Link from 'next/link';
import { Alert, Button, Form, Offcanvas, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import NewButton from '@/components/admin/NewButton';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import KnowledgeNavigation from '@/components/admin/KnowledgeNavigation';
import { OperationalGate, OperationField, operationError, useOperationalAction } from '@/components/admin/OperationalUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { archiveKnowledgeItem, createKnowledgeRevision, getKnowledgeItem, getKnowledgeRevision, listKnowledgeRevisions, publishKnowledgeItem, replaceKnowledgeAttachments, replaceKnowledgeGrants } from '@/lib/api/endpoints/knowledge';
import { knowledgeAttachmentsBody, knowledgeGrantsBody, knowledgePublishBody, knowledgeRevisionBody, knowledgeRevisionForm, KNOWLEDGE_AUDIENCES, KNOWLEDGE_STATUSES } from '@/lib/domain/knowledge';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { const uid = useDetailParam('uid'); return <OperationalGate area="knowledge"><Item key={uid} uid={uid} /></OperationalGate>; }
function Item({ uid }) {
  const { token } = useSession();
  const [revision, setRevision] = useState(0);
  const [denied, setDenied] = useState(false);
  const args = { token, uid, revision };
  const query = useKnowledgeQuery(getKnowledgeItem, args, !denied);
  const history = useKnowledgeQuery(listKnowledgeRevisions, args, !denied);
  const action = useOperationalAction();
  const intention = useRef(null);
  const [editor, setEditor] = useState(null);
  const [publication, setPublication] = useState(null);
  const [archive, setArchive] = useState(false);
  const [grants, setGrants] = useState(null);
  const [attachments, setAttachments] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notice, setNotice] = useState(null);
  const item = query.data?.item ?? query.data;
  const latest = item?.latest_revision;
  const clear = () => { setEditor(null); setPublication(null); setArchive(false); setGrants(null); setAttachments(null); setPreview(null); };
  const deny = () => { clear(); setDenied(true); };
  const complete = () => { clear(); setNotice('Operação concluída.'); setRevision(value => value + 1); };
  const open = setter => { action.clearError(); setNotice(null); intention.current = null; setter(); };
  const saveRevision = event => {
    event.preventDefault();
    void action.run(signal => {
      const body = knowledgeRevisionBody(editor);
      return createKnowledgeRevision({ token, uid, body, signal, idempotencyKey: intentKey(intention, `knowledge-revision:${uid}`, body) });
    }, complete, deny);
  };
  const publish = event => {
    event.preventDefault();
    void action.run(signal => {
      const body = knowledgePublishBody(publication.uid, publication.audience);
      return publishKnowledgeItem({ token, uid, body, signal, idempotencyKey: intentKey(intention, `knowledge-publish:${uid}`, body) });
    }, complete, deny);
  };
  const readRevision = row => {
    action.clearError();
    void action.run(signal => getKnowledgeRevision({ token, uid: row.uid, signal }), result => setPreview(result.item ?? result), deny);
  };
  const readAttachments = () => {
    if (!latest) return;
    action.clearError();
    void action.run(signal => getKnowledgeRevision({ token, uid: latest.uid, signal }), result => {
      const row = result.item ?? result;
      setAttachments({ uid: row.uid, rows: (row.attachments || []).map(attachment => ({ uid_document: attachment.uid_document, uid_document_revision: attachment.uid_document_revision })) });
    }, deny);
  };
  const changeVideo = (index, patch) => setEditor({ ...editor, videos: editor.videos.map((video, i) => i === index ? { ...video, ...patch } : video) });
  const field = key => ({ value: editor[key], onChange: event => setEditor({ ...editor, [key]: event.target.value }) });
  const modalOpen = editor || publication || archive || grants !== null || attachments;
  return <>
    <PageBreadcrumb title={latest?.title || item?.slug || 'Artigo'} subTitle1="Knowledge Base" /><KnowledgeNavigation />
    {query.loading && <Spinner animation="border" size="sm" />}
    {query.error && <Alert variant="danger">{operationError(query.error)}</Alert>}
    {denied && <Alert variant="warning">O artigo não está disponível para esta operação. Recarregue para reavaliar seu acesso.</Alert>}
    {action.error && !modalOpen && <Alert variant="danger">{action.error}</Alert>}{notice && <Alert variant="success">{notice}</Alert>}
    <Button variant="outline-secondary" className="mb-3" disabled={action.busy} onClick={() => { setDenied(false); setRevision(value => value + 1); }}>Recarregar artigo</Button>
    {item && <>
      <div className="card panel p-3 mb-3"><p className="mb-1">{item.slug} · {KNOWLEDGE_STATUSES[item.publication_status] || item.publication_status}</p><p>Audiência publicada: {KNOWLEDGE_AUDIENCES[item.audience_mode] || 'Nenhuma'}</p><p className="small">Última revisão: {latest?.revision_number ?? 'Sem revisão'} · Revisão publicada: {item.published_revision?.revision_number ?? 'Nenhuma'}</p><div className="d-flex flex-wrap gap-3"><Link href={detailHref('/knowledge/leitura', item.slug, 'slug')}>Consultar versão disponível para minha sessão</Link>{item.audience_mode === 'public' && item.publication_status === 'published' && <Link href={detailHref('/ajuda', item.slug, 'slug')}>Abrir versão pública</Link>}</div></div>
      <div className="d-flex flex-wrap gap-2 mb-4"><NewButton label="Nova revisão" disabled={action.busy} onClick={() => open(() => setEditor(knowledgeRevisionForm(latest || {})))} /><Button variant="outline-primary" disabled={action.busy || !latest} onClick={() => open(() => setPublication({ uid: latest.uid, audience: Object.hasOwn(KNOWLEDGE_AUDIENCES, item.audience_mode) ? item.audience_mode : 'authenticated' }))}>Publicar revisão</Button><Button variant="outline-secondary" disabled={action.busy} onClick={() => open(() => setGrants(JSON.stringify(item.grants || [], null, 2)))}>Permissões de acesso selecionado</Button><Button variant="outline-secondary" disabled={action.busy || !latest || latest.uid === item.published_revision_uid} onClick={readAttachments}>Anexos do rascunho atual</Button><Button variant="outline-danger" disabled={action.busy || item.publication_status === 'archived'} onClick={() => open(() => setArchive(true))}>Arquivar / despublicar</Button></div>
      <h5>Histórico de revisões</h5><DataTable rows={history.data?.items || []} loading={history.loading} error={history.error ? history.error.code || 'network_error' : null} columns={[{ key: 'revision_number', label: 'Revisão' }, { key: 'title', label: 'Título', render: row => <Button variant="link" disabled={action.busy} onClick={() => readRevision(row)}>{row.title}</Button> }, { key: 'published', label: 'Publicada atualmente', render: row => row.uid === item.published_revision_uid ? 'Sim' : 'Não' }, { key: 'created_at', label: 'Criada em', render: row => new Date(row.created_at).toLocaleString('pt-BR') }]} />
    </>}
    {editor && <FormModal show title="Nova revisão em rascunho" submitting={action.busy} error={action.error} onSubmit={saveRevision} onHide={() => { if (!action.busy) setEditor(null); }}><fieldset disabled={action.busy}>
      <OperationField label="Título" required {...field('title')} /><OperationField label="Resumo" multiline {...field('summary')} /><OperationField label="Conteúdo" multiline required {...field('body')} />
      <p className="small text-muted">Salvar cria uma revisão independente. Anexos são associados separadamente à nova revisão; a publicação atual permanece disponível.</p>
      <h6>Vídeos do YouTube</h6>{editor.videos.map((video, index) => <div className="border rounded p-2 mb-3" key={index}><OperationField label="Título do vídeo" required maxLength={150} value={video.title} onChange={event => changeVideo(index, { title: event.target.value })} /><OperationField label="URL HTTPS (watch ou youtu.be)" type="url" required value={video.url} onChange={event => changeVideo(index, { url: event.target.value })} /><OperationField label="Descrição do vídeo" multiline maxLength={500} value={video.description} onChange={event => changeVideo(index, { description: event.target.value })} /><OperationField label="Posição" type="number" min="1" step="1" required value={video.sort_order} onChange={event => changeVideo(index, { sort_order: event.target.value })} /><Button type="button" size="sm" variant="outline-danger" onClick={() => setEditor({ ...editor, videos: editor.videos.filter((_, i) => i !== index) })}>Remover vídeo</Button></div>)}<Button type="button" variant="outline-secondary" disabled={editor.videos.length >= 20} onClick={() => setEditor({ ...editor, videos: [...editor.videos, { title: '', url: '', description: '', sort_order: Math.max(0, ...editor.videos.map(video => Number(video.sort_order) || 0)) + 1 }] })}>Adicionar vídeo</Button>
    </fieldset></FormModal>}
    {publication && <FormModal show title="Publicar uma revisão" submitLabel="Confirmar publicação" submitting={action.busy} error={action.error} onSubmit={publish} onHide={() => { if (!action.busy) setPublication(null); }}><fieldset disabled={action.busy}><Form.Group controlId="knowledge-publish-revision" className="mb-3"><Form.Label>Revisão a publicar</Form.Label><Form.Select required value={publication.uid} onChange={event => setPublication({ ...publication, uid: event.target.value })}>{(history.data?.items || [latest]).filter(Boolean).map(row => <option key={row.uid} value={row.uid}>R{row.revision_number} — {row.title}</option>)}</Form.Select></Form.Group><Form.Group controlId="knowledge-audience" className="mb-3"><Form.Label>Audiência</Form.Label><Form.Select value={publication.audience} onChange={event => setPublication({ ...publication, audience: event.target.value })}>{Object.entries(KNOWLEDGE_AUDIENCES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</Form.Select></Form.Group><p>{publication.audience === 'public' ? 'O conteúdo e seus anexos ficarão disponíveis sem login no portal público.' : publication.audience === 'selected' ? 'O acesso dependerá das permissões configuradas para este artigo e da autorização atual da sessão.' : 'O acesso exigirá uma sessão autorizada na base de conhecimento.'}</p></fieldset></FormModal>}
    {archive && <FormModal show title="Arquivar artigo" submitLabel="Arquivar e despublicar" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setArchive(false); }} onSubmit={event => { event.preventDefault(); void action.run(signal => archiveKnowledgeItem({ token, uid, signal, idempotencyKey: intentKey(intention, `knowledge-archive:${uid}`, {}) }), complete, deny); }}><p>Arquivar “{item?.slug}” retira o artigo dos leitores e preserva as revisões administrativas.</p></FormModal>}
    {grants !== null && <FormModal show title="Permissões de acesso selecionado" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setGrants(null); }} onSubmit={event => { event.preventDefault(); void action.run(signal => replaceKnowledgeGrants({ token, uid, body: knowledgeGrantsBody(grants), signal }), complete, deny); }}><OperationField multiline label="Concessões (JSON)" required value={grants} onChange={event => setGrants(event.target.value)} /><p className="small">A lista substitui todas as concessões do artigo. Uma lista vazia revoga as concessões. A seleção de audiência é feita separadamente na publicação.</p></FormModal>}
    {attachments && <FormModal show title="Anexos do rascunho" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setAttachments(null); }} onSubmit={event => { event.preventDefault(); void action.run(signal => replaceKnowledgeAttachments({ token, uid: attachments.uid, body: knowledgeAttachmentsBody(attachments.rows), signal }), complete, deny); }}><fieldset disabled={action.busy}><p>Associe o documento GED e sua revisão fixa. A API valida a origem e a disponibilidade de cada documento.</p>{attachments.rows.map((row, index) => <div className="border rounded p-2 mb-3" key={index}>{['uid_document', 'uid_document_revision'].map(key => <OperationField key={key} label={key === 'uid_document' ? 'UUID do documento GED' : 'UUID da revisão GED'} required value={row[key]} onChange={event => setAttachments({ ...attachments, rows: attachments.rows.map((value, i) => i === index ? { ...value, [key]: event.target.value } : value) })} />)}<Button type="button" size="sm" variant="outline-danger" onClick={() => setAttachments({ ...attachments, rows: attachments.rows.filter((_, i) => i !== index) })}>Remover associação</Button></div>)}<Button type="button" variant="outline-secondary" onClick={() => setAttachments({ ...attachments, rows: [...attachments.rows, { uid_document: '', uid_document_revision: '' }] })}>Adicionar associação</Button><p className="small mt-3">Salvar substitui a lista de anexos desta revisão. Revisões publicadas são imutáveis.</p></fieldset></FormModal>}
    <Offcanvas show={!!preview} onHide={() => setPreview(null)} placement="end" style={{ width: 560 }}><Offcanvas.Header closeButton><Offcanvas.Title>R{preview?.revision_number} — {preview?.title}</Offcanvas.Title></Offcanvas.Header><Offcanvas.Body>{preview && <><p>{preview.summary}</p><div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{preview.body}</div><p className="small mt-3">Vídeos: {preview.videos?.length || 0} · Anexos: {preview.attachments?.length || 0}</p></>}</Offcanvas.Body></Offcanvas>
  </>;
}
