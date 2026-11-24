'use client';

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import DataTable from './DataTable';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { listLinkHistory } from '@/lib/api/endpoints/fleet';
import { assetLinkHistoryRows } from '@/lib/domain/fleet';

const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const device = uid => uid ? <span className="font-monospace">{uid}</span> : '—';
const columns = [
  { key: 'occurredAt', label: 'Data e hora', render: row => {
    const timestamp = Date.parse(row.occurredAt);
    return Number.isFinite(timestamp) ? <time dateTime={row.occurredAt}>{dateFormat.format(timestamp)}</time> : '—';
  } },
  { key: 'operation', label: 'Operação' },
  { key: 'slot', label: 'Slot', render: row => row.slot ?? '—' },
  { key: 'before', label: 'Dispositivo anterior', render: row => device(row.before) },
  { key: 'after', label: 'Dispositivo após a operação', render: row => device(row.after) }
];

export default function AssetLinkHistory({ token, assetUid }) {
  const [retry, setRetry] = useState(0);
  const { data, error, loading } = useKnowledgeQuery(listLinkHistory, { token, assetUid, retry });
  const failure = error ?? (data !== undefined && !Array.isArray(data?.items) ? 'Resposta inválida ao consultar o histórico.' : null);
  const rows = Array.isArray(data?.items) ? assetLinkHistoryRows(data.items, assetUid) : [];

  return <>
    <DataTable columns={columns} rows={rows} loading={loading} error={failure}
      emptyMessage="Nenhuma movimentação de dispositivo registrada para este ativo." />
    {failure && <Button className="mt-3" size="sm" variant="outline-primary" onClick={() => setRetry(value => value + 1)}>
      Tentar novamente
    </Button>}
  </>;
}
