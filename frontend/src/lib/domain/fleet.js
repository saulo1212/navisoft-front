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

const historyTime = entry => Date.parse(entry.occurred_at) || 0;

export function assetLinkHistoryRows(items, assetUid) {
  const rows = [...items].sort((a, b) => historyTime(b) - historyTime(a)).map(entry => {
    const details = entry.details;
    const beforeAsset = details?.uid_asset_before ?? details?.before?.uid_asset;
    const afterAsset = details?.uid_asset_after ?? details?.after?.uid_asset;
    const before = beforeAsset && beforeAsset !== assetUid ? null : entry.uid_device_before ?? details?.before?.uid_device;
    const after = afterAsset && afterAsset !== assetUid ? null : entry.uid_device_after ?? details?.after?.uid_device;
    const beforeSlot = details?.before?.slot_number;
    const afterSlot = details?.after?.slot_number;
    const slotNumber = entry.slot_number ?? details?.slot_number ?? afterSlot ?? beforeSlot;
    const slot = before && after && beforeSlot != null && afterSlot != null && beforeSlot !== afterSlot
      ? `${beforeSlot} → ${afterSlot}` : slotNumber;
    let operation = 'Atualização do vínculo';
    if (before && after && before !== after) operation = 'Troca';
    else if (before && !after) operation = 'Retirada';
    else if (!before && after) operation = 'Instalação';
    else if (typeof slot === 'string') operation = 'Mudança de slot';
    return {
      uid: entry.uid, occurredAt: entry.occurred_at, slot, before, after, operation,
      workOrder: entry.uid_work_order ?? details?.uid_work_order
    };
  });

  // Uma troca via OS grava uma retirada e uma instalação no mesmo slot.
  // O UID da OS e o slot distinguem a troca de operações independentes.
  const movements = new Map();
  rows.forEach((row, index) => {
    if (!row.workOrder || row.slot == null || !['Instalação', 'Retirada'].includes(row.operation)) return;
    const key = JSON.stringify([row.workOrder, row.slot]);
    const group = movements.get(key) ?? [];
    group.push(index);
    movements.set(key, group);
  });
  const consumed = new Set();
  for (const indices of movements.values()) {
    if (indices.length !== 2) continue;
    const [newer, older] = indices;
    const install = rows[newer];
    const removal = rows[older];
    if (install.operation !== 'Instalação' || removal.operation !== 'Retirada' || install.after === removal.before) continue;
    rows[newer] = { ...install, operation: 'Troca', before: removal.before };
    consumed.add(older);
  }
  return rows.filter((_, index) => !consumed.has(index));
}
