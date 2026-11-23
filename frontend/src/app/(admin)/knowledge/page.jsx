'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import KnowledgeNavigation from '@/components/admin/KnowledgeNavigation';
import ListToolbar from '@/components/admin/ListToolbar';
import { OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { createKnowledgeItem, listKnowledgeItems } from '@/lib/api/endpoints/knowledge';
import { knowledgeItemBody, KNOWLEDGE_AUDIENCES, KNOWLEDGE_STATUSES } from '@/lib/domain/knowledge';
import { intentKey, requireUid } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="knowledge"><Items /></OperationalGate>; }
function Items() {
  const { token } = useSession();
  const router = useRouter();
  const list = useOffsetList(listKnowledgeItems);
  const action = useOperationalAction();
  const intention = useRef(null);
  const [slug, setSlug] = useState(null);
  const save = event => {
    event.preventDefault();
    void action.run(async signal => {
      const body = knowledgeItemBody(slug);
      const result = await createKnowledgeItem({ token, body, signal, idempotencyKey: intentKey(intention, 'knowledge-item', body) });
      return requireUid((result.item ?? result).uid, 'artigo criado');
    }, uid => { setSlug(null); router.push(detailHref('/knowledge', uid)); }, () => { setSlug(null); list.setItems([]); });
  };
  return <>
    <PageBreadcrumb title="Base de conhecimento" subTitle1="Conteúdo" /><KnowledgeNavigation />
    <p>Administração editorial global, exclusiva do perfil Primary. Criar e salvar uma revisão mantém o conteúdo em rascunho até a publicação explícita.</p>
    {action.error && slug === null && <Alert variant="danger">{action.error}</Alert>}
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar artigos..." createLabel="Novo artigo" actionDisabled={action.busy} onAction={() => { action.clearError(); intention.current = null; setSlug(''); }} />
    <Button variant="outline-secondary" className="mb-3" disabled={list.loading || action.busy} onClick={list.refresh}>Atualizar</Button>
    <DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[
      { key: 'title', label: 'Artigo', render: row => <Button variant="link" onClick={() => router.push(detailHref('/knowledge', row.uid))}>{row.title || row.slug}</Button> }, { key: 'slug', label: 'Identificador' }, { key: 'publication_status', label: 'Situação', render: row => KNOWLEDGE_STATUSES[row.publication_status] || row.publication_status }, { key: 'audience_mode', label: 'Audiência', render: row => KNOWLEDGE_AUDIENCES[row.audience_mode] || 'Sem publicação' }
    ]} />
    {slug !== null && <FormModal show title="Novo artigo" submitting={action.busy} error={action.error} onSubmit={save} onHide={() => { if (!action.busy) setSlug(null); }}><OperationField label="Identificador na URL" required placeholder="como-instalar-o-equipamento" value={slug} onChange={event => setSlug(event.target.value)} /><p className="small text-muted">Depois da criação, escreva a primeira revisão do artigo.</p></FormModal>}
  </>;
}
