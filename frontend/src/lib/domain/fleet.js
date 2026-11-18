// Helpers de domínio compartilhados por Entidades, Endereços e Frota (Fase 4).

// Rótulos de propósito de endereço (polimórfico por link_code). Os códigos são
// os aceitos pelo backend em `purposes[].code` (ver contrato POST /addresses).
export const ADDRESS_PURPOSES = [
  { code: 'headquarters', label: 'Sede' },
  { code: 'billing', label: 'Cobrança' },
  { code: 'delivery', label: 'Entrega' },
  { code: 'correspondence', label: 'Correspondência' }
];

// Perfis de asset conhecidos (asset_profile). `road_vehicle` tem o sub-objeto
// `vehicle` (placa, ano, etc.); outros perfis podem não ter.
export const ASSET_PROFILE_LABELS = {
  road_vehicle: 'Veículo rodoviário',
  generic: 'Genérico',
  machine: 'Máquina',
  trailer: 'Reboque'
};

// Resolve o NOME de uma situação (uid_situations) a partir de um mapa
// uid → situação (montado da listagem /v1/admin/situations). Entidades e assets
// referenciam o estado por `uid_situations`, não por um enum de lifecycle.
export const situationName = (uid, byUid) => {
  if (!uid) return '—';
  const s = byUid?.[uid];
  return s ? (s.name || s.code || uid) : `${String(uid).slice(0, 8)}…`;
};

// Status de badge aproximado a partir da situação (para colorir o StatusBadge).
// Situações operacionais/habilitadas → "active"; desabilitadas → "inactive".
export const situationBadgeStatus = (uid, byUid) => {
  const s = byUid?.[uid];
  if (!s) return undefined;
  if (s.enabled === false) return 'inactive';
  if (s.operational === false) return 'blocked';
  return 'active';
};
