// País padrão (pré-seleção) do campo uid_country em engagements. A lista completa
// vem do catálogo global via GET /v1/admin/drivers/countries (ver
// endpoints/collaborators.js `listCountries`). Brasil é o padrão por ser uma
// plataforma de frota brasileira; UID confirmado ao vivo no catálogo (code BR).
export const DEFAULT_COUNTRY_UID = 'c0580000-0000-4000-8000-000000000001';

// Datas "date-only" (YYYY-MM-DD) formatadas sem passar por Date(), que as lê
// como meia-noite UTC e, em fuso negativo (BR -03), mostra o dia anterior.
// Timestamps completos (com T/hora) usam o formato local normal.
export const fmtDate = v => {
  if (!v) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return new Date(v).toLocaleDateString('pt-BR');
};
