import { requiredText, requireUid } from './technicalOperations';

export function readJson(text, label, kind) {
  let value;
  try { value = JSON.parse(text); } catch { throw new Error(`Revise o JSON de ${label}.`); }
  if (kind === 'array' ? !Array.isArray(value) : !value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Informe ${kind === 'array' ? 'uma lista' : 'um objeto'} JSON para ${label}.`);
  }
  return value;
}

export function uniqueRows(rows, field, label) {
  const values = rows.map(row => requiredText(row?.[field], label));
  if (new Set(values.map(value => value.toLowerCase())).size !== values.length) throw new Error(`Há valores duplicados em ${label}.`);
  return rows.map((row, index) => ({ ...row, [field]: values[index] }));
}

export function datePeriod(startedOn, endedOn) {
  if (!startedOn || (endedOn && endedOn < startedOn)) throw new Error('Confira as datas de início e fim.');
  return { started_on: startedOn, ...(endedOn ? { ended_on: endedOn } : {}) };
}

export function technicalMapBody(fields, bindings, variants) {
  const rules = uniqueRows(readJson(fields.rules, 'regras', 'array'), 'source_code', 'códigos de origem');
  for (const rule of rules) requireUid(rule.uid_event_model, 'modelo de evento');
  const models = bindings.map(binding => {
    const variant = variants.find(item => binding.variantUid ? item.uid === binding.variantUid
      : item.uid_model === binding.uid_model && item.code === binding.protocol_variant);
    if (!variant || variant.uid_model !== binding.uid_model) throw new Error('Selecione uma variante que pertença ao modelo do dispositivo.');
    const timestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
    if (!timestamp.test(binding.valid_from) || (binding.valid_until && !timestamp.test(binding.valid_until))) {
      throw new Error('Informe as datas de vigência com o fuso horário.');
    }
    const from = new Date(binding.valid_from);
    const until = binding.valid_until ? new Date(binding.valid_until) : null;
    if (!Number.isFinite(from.getTime()) || (until && !(until > from))) throw new Error('Confira a vigência do vínculo ao modelo.');
    return { uid_model: variant.uid_model, protocol_variant: variant.code, valid_from: from.toISOString(), valid_until: until?.toISOString() ?? null };
  });
  return { code: requiredText(fields.code, 'o código'), name: requiredText(fields.name, 'o nome'), active: fields.active === 'on', rules, models };
}

export function telemetryRules(text, override = false) {
  const rows = uniqueRows(readJson(text, 'regras de telemetria', 'array'), 'source', 'campos de origem');
  for (const row of rows) {
    if (override && !['replace', 'inherit', 'remove'].includes(row.mode)) throw new Error('Escolha uma ação válida para cada substituição.');
    if (!override || row.mode === 'replace') {
      requiredText(row.canonical, 'o campo canônico');
      requiredText(row.type, 'o tipo');
    }
  }
  return rows.map(row => override && row.mode !== 'replace' ? { source: row.source, mode: row.mode } : row);
}
