'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { downloadKnowledgeAttachment, getPublicKnowledge, getReadableKnowledge } from '@/lib/api/endpoints/knowledge';
import { safeVideoUrl } from '@/lib/domain/knowledge';
import { operationError } from '@/components/admin/OperationalUi';

export default function KnowledgeArticle({ slug, publicAccess = true, token, organizationUid }) {
  const [revision, setRevision] = useState(0);
  const query = useKnowledgeQuery(publicAccess ? getPublicKnowledge : getReadableKnowledge, { slug, ...(publicAccess ? {} : { token, organizationUid }), revision });
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const controller = useRef(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; controller.current?.abort(); }; }, []);
  const download = async attachment => {
    if (controller.current) return;
    controller.current = new AbortController();
    setDownloading(true); setDownloadError(null);
    try {
      const blob = await downloadKnowledgeAttachment({ token, organizationUid, slug, uid: attachment.uid, publicAccess, signal: controller.current.signal });
      if (!mounted.current) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = attachment.name || `${slug}-anexo`; document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { if (mounted.current && error.name !== 'AbortError') setDownloadError(operationError(error)); }
    finally { controller.current = null; if (mounted.current) setDownloading(false); }
  };
  const article = query.data?.item ?? query.data;
  return <>
    <Link className="d-inline-block mb-3" href={publicAccess ? '/ajuda' : '/knowledge/leitura'}>← Voltar aos artigos</Link>
    {query.loading && <div><Spinner animation="border" size="sm" /></div>}
    {query.error && <Alert variant={query.error.status === 404 ? 'warning' : 'danger'}>{query.error.status === 404 ? 'Artigo não encontrado ou indisponível para este acesso.' : operationError(query.error)} <Button variant="link" onClick={() => setRevision(value => value + 1)}>Tentar novamente</Button></Alert>}
    {article && <article className="card panel p-4"><h1 className="h2">{article.title}</h1><p className="lead">{article.summary}</p><p className="text-muted small">Versão {article.revision_number} · {article.published_at ? new Date(article.published_at).toLocaleDateString('pt-BR') : ''}</p>
      <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{article.body}</div>
      {!!article.videos?.length && <section className="mt-4"><h2 className="h5">Vídeos de apoio</h2>{[...article.videos].sort((a, b) => a.sort_order - b.sort_order).map((video, index) => { const url = safeVideoUrl(video); return <div key={video.youtube_video_id || index} className="mb-3">{url ? <a href={url} target="_blank" rel="noopener noreferrer">{video.title}</a> : <span>{video.title}</span>}<p className="small mb-0">{video.description}</p></div>; })}</section>}
      {!!article.attachments?.length && <section className="mt-4"><h2 className="h5">Anexos</h2>{article.attachments.map((attachment, index) => <Button key={attachment.uid} variant="outline-primary" className="me-2 mb-2" disabled={downloading} onClick={() => void download(attachment)}>Baixar {attachment.name || `anexo ${index + 1}`}</Button>)}</section>}
      {downloadError && <Alert variant="danger" className="mt-3">{downloadError}</Alert>}
    </article>}
  </>;
}
