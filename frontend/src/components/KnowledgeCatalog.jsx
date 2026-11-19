'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useState } from 'react';
import Link from 'next/link';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { listPublicKnowledge, listReadableKnowledge } from '@/lib/api/endpoints/knowledge';
import { operationError } from '@/components/admin/OperationalUi';

export default function KnowledgeCatalog({ publicAccess = true, token, organizationUid }) {
  const [input, setInput] = useState('');
  const [q, setQ] = useState('');
  const [offset, setOffset] = useState(0);
  const [revision, setRevision] = useState(0);
  const limit = 20;
  const query = useKnowledgeQuery(publicAccess ? listPublicKnowledge : listReadableKnowledge, { ...(publicAccess ? {} : { token, organizationUid }), q, limit, offset, revision });
  const items = query.data?.items || [];
  return <>
    <form className="d-flex gap-2 mb-4" onSubmit={event => { event.preventDefault(); setQ(input.trim()); setOffset(0); setRevision(value => value + 1); }}><label className="visually-hidden" htmlFor="knowledge-search">Buscar artigos</label><input id="knowledge-search" className="form-control" placeholder="Buscar na base de conhecimento..." value={input} onChange={event => setInput(event.target.value)} /><Button type="submit" disabled={query.loading}>Buscar</Button></form>
    {query.loading && <Spinner animation="border" size="sm" />}
    {query.error && <Alert variant="danger">{operationError(query.error)} <Button variant="link" onClick={() => setRevision(value => value + 1)}>Tentar novamente</Button></Alert>}
    {!query.loading && !query.error && <>
      <p className="text-muted small">{query.data?.total ?? items.length} artigo(s) disponível(is)</p>
      {items.length === 0 && <p>Nenhum artigo encontrado.</p>}
      {items.map(item => <article className="card panel p-4 mb-3" key={item.slug}><h3 className="h5"><Link href={detailHref(publicAccess ? '/ajuda' : '/knowledge/leitura', item.slug, 'slug')}>{item.title || item.slug}</Link></h3><p className="mb-1">{item.summary}</p>{item.published_at && <span className="small text-muted">Publicado em {new Date(item.published_at).toLocaleDateString('pt-BR')}</span>}</article>)}
      <div className="d-flex align-items-center justify-content-between gap-2 mt-3"><Button variant="outline-secondary" disabled={offset === 0} onClick={() => setOffset(value => Math.max(0, value - limit))}>Anterior</Button><span>Página {Math.floor(offset / limit) + 1}</span><Button variant="outline-secondary" disabled={offset + items.length >= (query.data?.total ?? items.length) || items.length === 0} onClick={() => setOffset(value => value + limit)}>Próxima</Button></div>
    </>}
  </>;
}
