import { nonnegative, requireUid, requiredText } from './technicalOperations';

export const GED_ACTIONS = { read: 'Ler metadados', download: 'Baixar arquivo', revise: 'Criar revisão', manage: 'Gerir documento' };
export const GED_PRINCIPALS = { functional_group: 'Grupo funcional', target: 'Alvo do documento', delegated_support: 'Suporte delegado' };
export function documentContractBody(form, organizationUid) {
  const contract_year = nonnegative(form.contract_year, 'Ano do contrato', true);
  if (contract_year < 1 || contract_year > 9999) throw new Error('Informe um ano de contrato válido.');
  return { uid_organization: requireUid(organizationUid, 'organização'), contract_year, contract_code: requiredText(form.contract_code, 'o código do contrato') };
}
export function documentBody(form, organizationUid, catalogs) {
  let metadata;
  try { metadata = JSON.parse(form.metadata || '{}'); } catch { throw new Error('Metadados: JSON inválido.'); }
  if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') throw new Error('Metadados devem ser um objeto.');
  const body = { uid_organization: requireUid(organizationUid, 'organização'), uid_contract: requireUid(form.uid_contract, 'contrato'), title: requiredText(form.title, 'o título'), metadata };
  for (const [key, catalog] of [['origin_code', 'origins'], ['area_code', 'areas'], ['type_code', 'types']]) {
    if (!catalogs?.[catalog]?.some(row => row.code === form[key] && row.active)) throw new Error('Selecione origem, área e tipo ativos nos catálogos do GED.');
    body[key] = form[key];
  }
  if (form.uid_class) body.uid_class = requireUid(form.uid_class, 'classe');
  if (form.target_type) {
    if (!['organization', 'entity'].includes(form.target_type)) throw new Error('Tipo de alvo inválido.');
    body.target = { type: form.target_type, uid: requireUid(form.target_uid, 'alvo') };
  }
  return body;
}
export function documentClassForm(row = {}) {
  return { code: row.code || '', name: row.name || '', active: row.active ?? true, permissions: (row.permissions || []).map(permission => ({ principal_type: permission.principal_type, action_code: permission.action_code, uid_functional_group: permission.uid_functional_group || '' })) };
}
export function documentClassBody(form, organizationUid, creating = false) {
  const body = { name: requiredText(form.name, 'o nome da classe') };
  if (creating) return { ...body, uid_organization: requireUid(organizationUid, 'organização'), code: requiredText(form.code, 'o código da classe') };
  const seen = new Set();
  if (!Array.isArray(form.permissions)) throw new Error('Informe a lista completa de permissões.');
  body.active = form.active === true;
  body.permissions = form.permissions.map(row => {
    if (!Object.hasOwn(GED_ACTIONS, row.action_code) || !Object.hasOwn(GED_PRINCIPALS, row.principal_type)) throw new Error('Permissão ou principal sem contrato disponível.');
    const permission = { principal_type: row.principal_type, action_code: row.action_code };
    if (row.principal_type === 'functional_group') permission.uid_functional_group = requireUid(row.uid_functional_group, 'grupo funcional');
    const key = JSON.stringify(permission);
    if (seen.has(key)) throw new Error('Permissão duplicada.');
    seen.add(key); return permission;
  });
  return body;
}
export function distributionForm(row = {}) { return { uid_recipient_organization: row.uid_recipient_organization || '', revision_policy: row.revision_policy || 'follow_latest', uid_fixed_revision: row.uid_fixed_revision || '' }; }
export function distributionBody(form, revisions, creating = true, ownerUid) {
  if (!['follow_latest', 'fixed_revision'].includes(form.revision_policy)) throw new Error('Política de revisão inválida.');
  const body = { access_mode: 'read', revision_policy: form.revision_policy };
  if (creating) {
    body.uid_recipient_organization = requireUid(form.uid_recipient_organization, 'organização destinatária');
    if (body.uid_recipient_organization === ownerUid) throw new Error('Selecione uma organização destinatária diferente do proprietário.');
  }
  if (form.revision_policy === 'fixed_revision') {
    if (!revisions.some(row => row.uid === form.uid_fixed_revision)) throw new Error('Selecione uma revisão deste documento.');
    body.uid_fixed_revision = requireUid(form.uid_fixed_revision, 'revisão fixa');
  }
  return body;
}
export function functionalGroupBody(form, organizationUid, creating = false) {
  const body = { name: requiredText(form.name, 'o nome'), description: form.description?.trim() || null, active: form.active === true };
  return creating ? { ...body, code: requiredText(form.code, 'o código'), uid_organization: requireUid(organizationUid, 'organização') } : body;
}
export function functionalMemberBody(form, organizationUid) { return { uid_organization: requireUid(organizationUid, 'organização'), uid_functional_group: requireUid(form.uid_functional_group, 'grupo funcional'), uid_member_user: requireUid(form.uid_member_user, 'usuário membro') }; }
function headerBytes(value) { return Array.from(new TextEncoder().encode(value), byte => String.fromCharCode(byte)).join(''); }
export async function documentUploadIntent(file, summary, revisions = []) {
  if (!file || !file.size || typeof file.arrayBuffer !== 'function') throw new Error('Selecione um arquivo PDF ou JPEG não vazio.');
  const extension = file.name?.split('.').pop()?.toLowerCase();
  const contentType = extension === 'pdf' ? 'application/pdf' : ['jpg', 'jpeg'].includes(extension) ? 'image/jpeg' : null;
  if (!contentType || (file.type && !['application/octet-stream', contentType].includes(file.type))) throw new Error('Envie PDF ou JPEG com MIME e extensão compatíveis.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const isPdf = new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-';
  const isJpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if ((contentType === 'application/pdf' && !isPdf) || (contentType === 'image/jpeg' && !isJpeg)) throw new Error('O conteúdo do arquivo não corresponde ao formato informado.');
  const first = [...revisions].sort((a, b) => a.revision_number - b.revision_number)[0];
  if (first?.mime_type && first.mime_type !== contentType) throw new Error('Novas revisões devem manter o formato definido na R00.');
  const text = summary?.trim() || '';
  if (revisions.length && !text) throw new Error('Informe o resumo da alteração para R01 e posteriores.');
  if (text && (Array.from(text).length > 500 || new TextEncoder().encode(text).length > 2000 || /[\x00-\x1f\x7f-\x9f]/.test(text))) throw new Error('Resumo inválido: até 500 caracteres, sem controles.');
  const filename = first?.original_filename || requiredText(file.name, 'o nome do arquivo');
  if (/[\x00-\x1f\x7f-\x9f]/.test(filename)) throw new Error('Nome de arquivo inválido.');
  const headers = { 'Content-Type': contentType, ...(revisions.length ? {} : { 'X-File-Name': headerBytes(filename) }), ...(text ? { 'X-Revision-Summary': headerBytes(text) } : {}) };
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
  return { headers, signature: { hash, filename, summary: text, contentType } };
}
