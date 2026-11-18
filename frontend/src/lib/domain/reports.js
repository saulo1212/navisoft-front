export const reportDomains = {
  organizations: { label: 'Organizações', chartFields: ['created_at', 'updated_at'] },
  entities: { label: 'Entidades', chartFields: ['situation_name', 'unit_name', 'organization_name', 'created_at'] },
  assets: { label: 'Ativos', chartFields: ['effective_lifecycle', 'situation_name', 'entity_name', 'unit_name', 'created_at'] }
};

export const reportLabels = {
  uid: 'Identificador', name: 'Nome', code: 'Código', identification: 'Identificação',
  organization_name: 'Organização', entity_name: 'Entidade', unit_name: 'Unidade',
  uid_organization: 'UUID da organização', uid_entity: 'UUID da entidade', uid_unit: 'UUID da unidade',
  created_at: 'Criação', updated_at: 'Atualização', situation_name: 'Situação',
  effective_lifecycle: 'Ciclo de vida', entity_types: 'Tipos de entidade',
  uid_billing_plan: 'UUID do plano', groups: 'Grupos', primary_group: 'Grupo principal'
};

export const reportFieldLabel = field => reportLabels[field] ?? field.replaceAll('_', ' ');
export const reportStatuses = {
  pending: 'Na fila', processing: 'Processando', running: 'Processando',
  completed: 'Concluído', failed: 'Falhou', expired: 'Expirado', cancelled: 'Cancelado'
};
export const reportIsPending = status => ['pending', 'processing', 'running'].includes(status);

export function definitionColumns(definition) {
  return [...new Set([
    ...definition.columns.map(column => column.field),
    ...(definition.json_paths ?? []).map(path => path.code).filter(Boolean)
  ])];
}

export function reportSelection(definition, { columns, q, includeInactive, sortField, sortDirection, filters = [] }) {
  const allowed = new Set(definitionColumns(definition));
  if (!columns.length || columns.some(column => !allowed.has(column))) {
    throw new Error('Selecione pelo menos uma coluna disponível.');
  }
  const sort = sortField ? [{ field: sortField, direction: sortDirection }] : definition.sort.default;
  return { columns, q: q.trim(), filters, include_inactive: includeInactive, sort };
}

export function reportBuckets(domain, columns, items) {
  const field = reportDomains[domain].chartFields.find(candidate => columns.includes(candidate));
  if (!field) return null;
  const dates = field.endsWith('_at');
  const counts = new Map();
  for (const row of items) {
    const raw = row[field];
    const key = dates && /^\d{4}-\d{2}/.test(raw ?? '') ? raw.slice(0, 7) : String(raw ?? 'Sem informação');
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const ordered = [...counts].sort(dates ? ([a], [b]) => a.localeCompare(b) : ([, a], [, b]) => b - a);
  const buckets = ordered.slice(0, 10);
  if (ordered.length > 10) buckets.push(['Outros', ordered.slice(10).reduce((total, [, count]) => total + count, 0)]);
  return { field, categories: buckets.map(([value]) => dates && /^\d{4}-\d{2}$/.test(value) ? `${value.slice(5)}/${value.slice(0, 4)}` : value),
    counts: buckets.map(([, count]) => count) };
}
