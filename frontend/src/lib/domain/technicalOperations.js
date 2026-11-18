import { newIdempotencyKey } from '../api/idempotency';

export const OPERATIONS = { install: 'Instalar', remove: 'Retirar', replace: 'Substituir', maintenance: 'Manutenção' };
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function requireUid(value, label) {
  if (!UUID_PATTERN.test(value || '')) throw new Error(`Informe um UUID válido para ${label}.`);
  return value;
}
export function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Informe ${label}.`);
  return value.trim();
}
export function nonnegative(value, label, integer = false) {
  if (!['number', 'string'].includes(typeof value) || String(value).trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0 || (integer && !Number.isSafeInteger(Number(value)))) throw new Error(`${label} inválido.`);
  return Number(value);
}
export function scopedFilters(organizationUid, q, field = 'name') {
  const filters = [{ field: 'uid_organization', operator: 'eq', value: requireUid(organizationUid, 'organização') }];
  if (q?.trim()) filters.push({ field, operator: 'contains', value: q.trim() });
  return filters;
}
export function intentKey(ref, action, body) {
  const signature = JSON.stringify({ action, body });
  if (ref.current?.signature !== signature) ref.current = { signature, key: newIdempotencyKey() };
  return ref.current.key;
}
export function technicianBody(form, organizationUid) {
  return { uid_organization: requireUid(organizationUid, 'organização'), uid_provider_entity: requireUid(form.uid_provider_entity, 'prestadora'), name: requiredText(form.name, 'o nome do executor'), active: form.active === true };
}
export function priceBody(rows) {
  const seen = new Set();
  return { items: rows.map(row => {
    const capability_code = requiredText(row.capability_code, 'a capacidade');
    if (!Object.hasOwn(OPERATIONS, row.operation)) throw new Error('Selecione uma operação válida.');
    const key = `${capability_code}:${row.operation}`;
    if (seen.has(key)) throw new Error('Há preços repetidos para a mesma capacidade/operação.');
    seen.add(key);
    const currency_code = requiredText(row.currency_code, 'a moeda').toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency_code)) throw new Error('Informe uma moeda com três letras.');
    return { capability_code, operation: row.operation, technician_cost_cents: nonnegative(row.technician_cost_cents, 'Custo em centavos', true), markup_percent: nonnegative(row.markup_percent, 'Markup'), currency_code };
  }) };
}
export function workOrderBody(form) {
  if (!Array.isArray(form.items) || !form.items.length) throw new Error('Adicione ao menos um item.');
  const slots = new Set();
  const items = form.items.map(row => {
    const slot_number = nonnegative(row.slot_number, 'Slot', true);
    if (!slot_number || slots.has(slot_number)) throw new Error('Cada item deve ter um slot positivo e distinto.');
    slots.add(slot_number);
    if (!Object.hasOwn(OPERATIONS, row.operation)) throw new Error('Selecione uma operação válida.');
    const before = row.uid_device_before || null;
    const after = row.uid_device_after || null;
    if (['remove', 'replace', 'maintenance'].includes(row.operation)) requireUid(before, 'dispositivo atual');
    if (['install', 'replace'].includes(row.operation)) requireUid(after, 'dispositivo novo');
    if (row.operation === 'replace' && before === after) throw new Error('A substituição exige dispositivos distintos.');
    return { slot_number, operation: row.operation, uid_device_before: row.operation === 'install' ? null : before, uid_device_after: row.operation === 'maintenance' ? before : ['install', 'replace'].includes(row.operation) ? after : null,
      ...(row.capability_code?.trim() ? { capability_code: row.capability_code.trim() } : {}) };
  });
  return { uid_asset: requireUid(form.uid_asset, 'ativo'), uid_technician: requireUid(form.uid_technician, 'executor'), description: form.description?.trim() || null, items };
}
export function assertWorkOrderContext(asset, technician, organizationUid) {
  requireUid(organizationUid, 'organização');
  if (asset?.uid_organization !== organizationUid || technician?.uid_organization !== organizationUid) throw new Error('O ativo e o executor devem pertencer à organização selecionada.');
  if (technician.active !== true) throw new Error('Selecione um executor ativo.');
}
export function custodyNeedsConfirmation(custody) {
  return custody.status === 'with_technician' && !custody.closed_at && !custody.technician_received_at;
}
export function completionBody(rows) {
  if (!rows.length) throw new Error('Selecione ao menos um item para concluir.');
  const seen = new Set();
  return { items: rows.map(row => {
    const uid_item = requireUid(row.uid_item, 'item');
    if (seen.has(uid_item)) throw new Error('Item de conclusão repetido.');
    seen.add(uid_item);
    const tests = (row.tests || []).filter(t => t.result).map(t => {
      if (!['pass', 'fail'].includes(t.result)) throw new Error('Resultado de teste inválido.');
      return { test_code: requiredText(t.test_code, 'o código do teste'), result: t.result, notes: t.notes?.trim() || null };
    });
    return { uid_item, result_notes: row.result_notes?.trim() || null, ...(tests.length ? { tests } : {}) };
  }) };
}
export function maintenanceBody(form, organizationUid) {
  const items = (form.items || []).map(row => ({ description: requiredText(row.description, 'a descrição do item'), ...(row.notes?.trim() ? { notes: row.notes.trim() } : {}) }));
  if (!items.length) throw new Error('Adicione ao menos um item de manutenção.');
  return { uid_organization: requireUid(organizationUid, 'organização'), uid_asset: requireUid(form.uid_asset, 'ativo'), description: requiredText(form.description, 'a descrição'), items,
    conditions: (form.conditions || []).map(row => ({ description: requiredText(row.description, 'a descrição da condição'), blocking: row.blocking === true })) };
}
// Keep the executor projection free of financial data even if an upstream response regresses.
export function executorProjection(value) {
  if (Array.isArray(value)) return value.map(executorProjection);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => !/pricing|price|cost|markup|currency/i.test(key)).map(([key, entry]) => [key, executorProjection(entry)]));
}
