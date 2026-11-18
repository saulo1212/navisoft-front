import { requiredText, requireUid } from './technicalOperations';

export const PRIORITIES = { low: 'Baixa', normal: 'Normal', high: 'Alta', critical: 'Crítica' };
export function localDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
function timestamp(value) {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Informe uma data válida.');
  return date.toISOString();
}
export function agendaControlForm(entry) {
  return { priority: entry.priority, pinned: entry.pinned === true, notified: entry.notified === true, snoozed_until: localDateTime(entry.snoozed_until), next_contact_at: localDateTime(entry.next_contact_at) };
}
export function agendaControlsBody(entry, form) {
  if (entry.terminal) throw new Error('Este registro já foi encerrado na origem.');
  if (!Number.isSafeInteger(entry.controls_version) || entry.controls_version < 1) throw new Error('Recarregue a versão dos controles.');
  if (!Object.hasOwn(PRIORITIES, form.priority)) throw new Error('Selecione uma prioridade válida.');
  const body = { controls_version: entry.controls_version };
  for (const key of ['priority', 'pinned', 'notified']) {
    if (key !== 'priority' && typeof form[key] !== 'boolean') throw new Error('Controle inválido.');
    if (form[key] !== entry[key]) body[key] = form[key];
  }
  for (const key of ['snoozed_until', 'next_contact_at']) {
    // Preserve original seconds/timezone when the minute-level field was untouched.
    if (form[key] !== localDateTime(entry[key])) body[key] = timestamp(form[key]);
  }
  return body;
}
export const agendaAnalysisBody = description => ({ description: requiredText(description, 'a descrição da análise') });
export function agendaColorChanges(previous, current) {
  const colors = {};
  for (const [group, values] of Object.entries(current)) {
    for (const [key, value] of Object.entries(values)) {
      if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error('Informe uma cor hexadecimal válida.');
      if (value.toLowerCase() !== previous?.[group]?.[key]?.toLowerCase()) (colors[group] ??= {})[key] = value;
    }
  }
  return { colors };
}
export function agendaEvent(entry, settings) {
  const start = entry.scheduled_start || entry.next_contact_at || entry.due_at || entry.occurred_at;
  if (!start || !Number.isFinite(new Date(start).getTime())) return null;
  const color = settings?.colors?.priorities?.[entry.priority];
  return { id: entry.uid, title: entry.title || 'Registro operacional', start, ...(entry.scheduled_end && new Date(entry.scheduled_end) > new Date(start) ? { end: entry.scheduled_end } : {}), ...(typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color) ? { backgroundColor: color, borderColor: color } : {}), extendedProps: { entry }, editable: false };
}
export function scheduleForm(item = {}) {
  return { report_code: item.report_code || '', report_version: item.report_version || 1, format: item.format || 'xlsx', visibility: item.visibility || 'private', at: item.cadence?.at || '08:00', retention_seconds: item.retention_seconds ?? 259200, retention_policy: item.retention_policy || 'expire', columns: (item.columns || ['identification', 'organization_name', 'created_at']).join('\n'), filters: JSON.stringify(item.filters || { q: '', include_inactive: false, filters: [] }, null, 2), sort: JSON.stringify(item.sort || [{ field: 'identification', direction: 'asc' }, { field: 'uid', direction: 'asc' }], null, 2), cadence: item.cadence || { frequency: 'daily' }, period: item.period || { mode: 'none' }, source_screen_id: item.source_screen_id };
}
export function scheduleBody(form, organizationUid) {
  const report_version = Number(form.report_version);
  const retention_seconds = Number(form.retention_seconds);
  if (!Number.isSafeInteger(report_version) || report_version < 1) throw new Error('Informe uma versão positiva.');
  if (!Number.isSafeInteger(retention_seconds) || retention_seconds < 1 || retention_seconds > 2592000) throw new Error('A retenção deve ser entre 1 segundo e 30 dias, sujeita ao limite do relatório.');
  if (!['xlsx', 'csv'].includes(form.format) || !['private', 'public'].includes(form.visibility)) throw new Error('Formato ou visibilidade inválidos.');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(form.at)) throw new Error('Informe um horário válido.');
  let filters, sort;
  try { filters = JSON.parse(form.filters); sort = JSON.parse(form.sort); } catch { throw new Error('Filtros e ordenação precisam ser JSON válido.'); }
  if (!filters || Array.isArray(filters) || typeof filters !== 'object' || !Array.isArray(filters.filters) || !Array.isArray(sort) || sort.some(row => !row || typeof row.field !== 'string' || !['asc', 'desc'].includes(row.direction))) throw new Error('Estrutura de filtros ou ordenação inválida.');
  const columns = [...new Set(form.columns.split(/[\n,]/).map(value => value.trim()).filter(Boolean))];
  if (!columns.length) throw new Error('Informe ao menos uma coluna do relatório.');
  // GET returns the normalized search snapshot, including pagination/state.
  // Export configuration accepts only the original filter input fields.
  const filterInput = { q: filters.q ?? '', include_inactive: filters.include_inactive ?? false, filters: filters.filters };
  return { uid_organization: requireUid(organizationUid, 'organização'), report_code: requiredText(form.report_code, 'o código do relatório'), report_version, format: form.format, visibility: form.visibility, filters: filterInput, columns, sort, cadence: { ...form.cadence, at: form.at }, period: form.period, retention_seconds, retention_policy: form.retention_policy, ...(form.source_screen_id ? { source_screen_id: form.source_screen_id } : {}) };
}
