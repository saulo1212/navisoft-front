import { requiredText, requireUid } from './technicalOperations';

export const KNOWLEDGE_AUDIENCES = { public: 'Público', authenticated: 'Usuários autenticados', selected: 'Acesso selecionado por permissões' };
export const KNOWLEDGE_STATUSES = { draft: 'Rascunho', published: 'Publicado', archived: 'Arquivado' };
export function knowledgeItemBody(slug) {
  const value = requiredText(slug, 'o identificador do artigo');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) throw new Error('Use letras minúsculas, números e hífens no identificador.');
  return { slug: value };
}
export function youtubeVideoId(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Informe uma URL HTTPS do YouTube.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) throw new Error('URL de vídeo inválida.');
  let id;
  if (['youtube.com', 'www.youtube.com'].includes(url.hostname) && url.pathname === '/watch') id = url.searchParams.get('v');
  if (url.hostname === 'youtu.be' && /^\/[A-Za-z0-9_-]{11}$/.test(url.pathname)) id = url.pathname.slice(1);
  if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) throw new Error('Use uma URL youtube.com/watch ou youtu.be válida.');
  return id;
}
export function knowledgeRevisionForm(revision = {}) {
  return { title: revision.title || '', summary: revision.summary || '', body: revision.body || '', videos: (revision.videos || []).map(video => ({ title: video.title, description: video.description || '', url: video.youtube_video_id ? `https://www.youtube.com/watch?v=${video.youtube_video_id}` : video.url, sort_order: video.sort_order })) };
}
export function knowledgeRevisionBody(form) {
  if (!Array.isArray(form.videos) || form.videos.length > 20) throw new Error('Adicione no máximo 20 vídeos.');
  const ids = new Set(), orders = new Set();
  const videos = form.videos.map(video => {
    const id = youtubeVideoId(video.url);
    const title = requiredText(video.title, 'o título do vídeo');
    const description = video.description?.trim() || '';
    const sort_order = Number(video.sort_order);
    if (title.length > 150 || description.length > 500 || !Number.isSafeInteger(sort_order) || sort_order < 1 || ids.has(id) || orders.has(sort_order)) throw new Error('Confira os limites dos vídeos, IDs duplicados e posições positivas distintas.');
    ids.add(id); orders.add(sort_order);
    return { url: `https://www.youtube.com/watch?v=${id}`, title, description, sort_order };
  });
  return { title: requiredText(form.title, 'o título'), summary: form.summary?.trim() || '', body: requiredText(form.body, 'o conteúdo'), videos };
}
export function knowledgePublishBody(uid, audience) {
  if (!Object.hasOwn(KNOWLEDGE_AUDIENCES, audience)) throw new Error('Selecione a audiência.');
  return { uid_revision: requireUid(uid, 'revisão a publicar'), audience_mode: audience };
}
export function knowledgeGrantsBody(text) {
  let grants;
  try { grants = JSON.parse(text); } catch { throw new Error('Permissões: JSON inválido.'); }
  if (!Array.isArray(grants) || grants.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Permissões: informe uma lista de concessões.');
  return { grants };
}
export function knowledgeAttachmentsBody(rows) {
  if (!Array.isArray(rows)) throw new Error('Informe a lista de anexos.');
  const seen = new Set();
  return { attachments: rows.map(row => {
    const uid_document = requireUid(row.uid_document, 'documento GED');
    const uid_document_revision = requireUid(row.uid_document_revision, 'revisão GED');
    const key = `${uid_document}:${uid_document_revision}`;
    if (seen.has(key)) throw new Error('Anexo duplicado.');
    seen.add(key);
    return { uid_document, uid_document_revision };
  }) };
}
export function safeVideoUrl(video) {
  try { return `https://www.youtube.com/watch?v=${youtubeVideoId(video.url || `https://www.youtube.com/watch?v=${video.youtube_video_id}`)}`; } catch { return null; }
}
