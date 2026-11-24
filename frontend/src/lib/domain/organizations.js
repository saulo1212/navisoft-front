export const accessDays = {
  monday: 'Segunda-feira', tuesday: 'Terça-feira', wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira', friday: 'Sexta-feira', saturday: 'Sábado', sunday: 'Domingo'
};

export const accessModes = { disabled: 'Desativado', warn: 'Avisar', block: 'Bloquear' };
export const lifecycleStates = { active: 'Ativa', blocked: 'Bloqueada', inactive: 'Inativa' };

export function canProvisionOrganization(actor) {
  return actor?.profile_code === 'primary_admin' ||
    (actor?.profile_code === 'administrator' && actor.can_create_organizations === true);
}

export function organizationProvisioningBody(fields) {
  const body = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.trim()]));
  if (!body.admin_login) delete body.admin_login;
  return body;
}

const startHour = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
export function accessPeriodsBody({ mode, timezone, week }) {
  if (!Object.hasOwn(accessModes, mode) || !timezone?.trim()) throw new Error('Selecione um modo e um fuso horário.');
  const intervals = Object.fromEntries(Object.entries(accessDays).map(([day, label]) => {
    const windows = week[day] ?? [];
    for (const { start, end } of windows) {
      if (!startHour.test(start) || !(startHour.test(end) || end === '24:00') || start >= end) {
        throw new Error(`${label} tem um intervalo inválido. Divida horários que atravessam a meia-noite em dois dias.`);
      }
    }
    const sorted = [...windows].sort((a, b) => a.start.localeCompare(b.start));
    if (sorted.some((range, index) => index > 0 && sorted[index - 1].end > range.start)) {
      throw new Error(`${label} tem intervalos sobrepostos.`);
    }
    return [day, windows.map(({ start, end }) => ({ start, end }))];
  }));
  return { mode, timezone: timezone.trim(), week: intervals };
}

export const brandingFields = [
  ['primary', 'Principal'], ['secondary', 'Secundária'], ['success', 'Sucesso'], ['warning', 'Aviso'], ['danger', 'Perigo'],
  ['background', 'Fundo'], ['surface', 'Superfície'], ['border', 'Borda'], ['text', 'Texto'], ['text_muted', 'Texto secundário'],
  ['header.background', 'Fundo do cabeçalho'], ['header.text', 'Texto do cabeçalho'],
  ['button.primary_background', 'Fundo do botão principal'], ['button.primary_text', 'Texto do botão principal'],
  ['button.secondary_background', 'Fundo do botão secundário'], ['button.secondary_text', 'Texto do botão secundário']
];

export function brandingValue(theme, path) {
  const [category, token] = path.split('.');
  return token ? theme?.[category]?.[token] : theme?.[category];
}

export function brandingPatch(fields) {
  const theme = {};
  for (const [path, label] of brandingFields) {
    if (!Object.hasOwn(fields, path)) continue;
    const value = fields[path];
    if (value !== null && !/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`Informe uma cor hexadecimal de seis dígitos para ${label.toLowerCase()}.`);
    const [category, token] = path.split('.');
    if (token) (theme[category] ??= {})[token] = value;
    else theme[category] = value;
  }
  return theme;
}
