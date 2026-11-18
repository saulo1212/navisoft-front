import { nonnegative, requiredText, requireUid } from './technicalOperations';
import { localDateTime } from './agenda';

export const EVENT_PRIORITIES = { low: 'Baixa', normal: 'Normal', high: 'Alta', critical: 'Crítica' };
export function parseObject(text, label) {
  let value;
  try { value = JSON.parse(text); } catch { throw new Error(`${label}: JSON inválido.`); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label}: informe um objeto.`);
  return value;
}
export function parseRows(text, label) {
  let value;
  try { value = JSON.parse(text); } catch { throw new Error(`${label}: JSON inválido.`); }
  if (!Array.isArray(value) || value.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error(`${label}: informe uma lista de objetos.`);
  return value;
}
const json = value => JSON.stringify(value, null, 2);
export function eventRuleForm(row = {}) {
  const targets = row.target ? [row.target] : row.targets || [];
  if (targets.length > 1) throw new Error('Esta regra possui vários alvos legados e precisa de revisão antes da edição.');
  const target = targets[0] || {};
  return { name: row.name || '', uid_model: row.uid_model || '', priority: row.priority || 'normal', active: row.active ?? false, parameters: json(row.parameters || {}), conditions: json(row.conditions || []), windows: json(row.windows || []), recipients: (row.recipients || []).map(value => typeof value === 'string' ? value : value.uid_recipient || value.uid).join('\n'), uid_entity: target.uid_entity || '', uid_unit: target.uid_unit || '', uid_group: target.uid_group || '', uid_asset: target.uid_asset || '', condition_for_seconds: row.condition_for_seconds ?? 0, recovery_for_seconds: row.recovery_for_seconds ?? 0, delayed_seconds: row.delayed_seconds ?? 0, valid_from: localDateTime(row.valid_from), valid_until: localDateTime(row.valid_until), original: row };
}
function dateValue(value, previous) {
  if (value === localDateTime(previous)) return previous || null;
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Data inválida.');
  return date.toISOString();
}
export function eventRuleBody(form, organizationUid, model) {
  const org = requireUid(organizationUid, 'organização');
  if (!model || model.uid !== form.uid_model || !model.active || model.periodic || model.activation_only || model.fixed) throw new Error('Selecione um modelo ativo que aceite regras operacionais.');
  if (!Object.hasOwn(EVENT_PRIORITIES, form.priority)) throw new Error('Prioridade inválida.');
  if (form.original?.uid_organization && form.original.uid_organization !== org) throw new Error('A regra não pertence à organização selecionada.');
  const parameters = parseObject(form.parameters, 'Parâmetros');
  for (const [key, value] of Object.entries(parameters)) {
    const type = model.allowed_parameters?.[key];
    if (!type) throw new Error(`Parâmetro não permitido: ${key}.`);
    if ((type === 'array' && !Array.isArray(value)) || (type === 'boolean' && typeof value !== 'boolean') || (type === 'number' && (typeof value !== 'number' || !Number.isFinite(value))) || (['string', 'text', 'uuid'].includes(type) && typeof value !== 'string')) throw new Error(`Tipo inválido para ${key}.`);
  }
  const target = { uid_organization: org };
  for (const key of ['uid_entity', 'uid_unit', 'uid_group', 'uid_asset']) if (form[key]?.trim()) target[key] = requireUid(form[key].trim(), key);
  const windows = parseRows(form.windows, 'Janelas');
  for (const window of windows) {
    if (![window.start_isodow, window.end_isodow].every(day => Number.isInteger(day) && day >= 1 && day <= 7) || ![window.start_time, window.end_time].every(time => /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(time))) throw new Error('Janela inválida: use dias de 1 a 7 e horários HH:MM.');
  }
  const recipients = [...new Set(form.recipients.split(/[\n,]/).map(value => value.trim()).filter(Boolean))].map(value => requireUid(value, 'destinatário de Events'));
  const valid_from = dateValue(form.valid_from, form.original?.valid_from);
  const valid_until = dateValue(form.valid_until, form.original?.valid_until);
  if (valid_from && valid_until && new Date(valid_until) <= new Date(valid_from)) throw new Error('O fim da vigência deve ser posterior ao início.');
  return { uid_organization: org, uid_model: requireUid(form.uid_model, 'modelo de evento'), name: requiredText(form.name, 'o nome'), priority: form.priority, active: form.active === true, parameters, target, conditions: parseRows(form.conditions, 'Condições'), windows, recipients, valid_from, valid_until, condition_for_seconds: nonnegative(form.condition_for_seconds, 'Confirmação em segundos', true), recovery_for_seconds: nonnegative(form.recovery_for_seconds, 'Recuperação em segundos', true), delayed_seconds: nonnegative(form.delayed_seconds, 'Atraso em segundos', true) };
}
export function occurrenceActionBody(action, text) {
  if (action === 'acknowledge') return { action };
  if (action === 'note') return { action, note: requiredText(text, 'a anotação') };
  if (action === 'close') return { action, resolution: requiredText(text, 'a resolução') };
  throw new Error('Ação de ocorrência inválida.');
}
export function notificationRecipientForm(row = {}) {
  return { kind: row.kind || 'external', name: row.name || '', active: row.active ?? true, endpoints: (row.endpoints || [{ service: 'email', destination: '', active: true }]).map(endpoint => ({ ...endpoint })), organization_bindings: json(row.organization_bindings || []), entity_bindings: json(row.entity_bindings || []), asset_bindings: json(row.asset_bindings || []), original: row };
}
export function notificationRecipientBody(form, organizationUid) {
  const org = requireUid(organizationUid, 'organização');
  if (form.original?.uid_organization && form.original.uid_organization !== org) throw new Error('O destinatário não pertence à organização selecionada.');
  if (!form.endpoints.length) throw new Error('Informe ao menos um endereço de entrega.');
  const endpoints = form.endpoints.map(endpoint => {
    const service = requiredText(endpoint.service, 'o serviço');
    const destination = requiredText(endpoint.destination, 'o destino');
    if (service === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination)) throw new Error('Informe um e-mail válido.');
    // Endpoint UIDs are response metadata; full replacement rejects them.
    return { service, destination, active: endpoint.active === true, ...(endpoint.metadata ? { metadata: endpoint.metadata } : {}), ...(endpoint.uid_contact_method ? { uid_contact_method: requireUid(endpoint.uid_contact_method, 'contato') } : {}) };
  });
  const organization_bindings = parseRows(form.organization_bindings, 'Vínculos organizacionais');
  const entity_bindings = parseRows(form.entity_bindings, 'Vínculos de entidades');
  const asset_bindings = parseRows(form.asset_bindings, 'Vínculos de ativos');
  // Bindings are part of full replacement; never replace existing lists implicitly.
  for (const rows of [organization_bindings, entity_bindings, asset_bindings]) for (const row of rows) {
    if (row.uid_organization && row.uid_organization !== org) throw new Error('Vínculo fora da organização selecionada.');
    for (const key of ['uid_organization', 'uid_entity', 'uid_asset']) if (row[key]) requireUid(row[key], key);
  }
  const body = { kind: form.kind, name: requiredText(form.name, 'o nome'), active: form.active === true, endpoints, organization_bindings, entity_bindings, asset_bindings };
  if (form.kind === 'external') return body;
  // Other kinds require domain-specific linking. Preserve existing records for
  // display, but do not silently rewrite a linked contact as an external recipient.
  throw new Error('A edição de destinatários vinculados depende do contrato de contatos.');
}
export function notificationHookBody(form) {
  const payload = parseObject(form.payload, 'Conteúdo do hook');
  if (!Object.keys(payload).length) throw new Error('Informe o conteúdo do hook.');
  return { active: form.active === true, payload };
}
