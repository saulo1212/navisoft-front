'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Form } from 'react-bootstrap';
import DataTable from '@/components/admin/DataTable';
import { PlatformPage } from '@/components/admin/PlatformUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { searchPlatformCapabilities } from '@/lib/api/endpoints/platform';

export default function Page() {
  return <PlatformPage title="Capacidades da plataforma">{Capabilities}</PlatformPage>;
}

function Capabilities() {
  const [search, setSearch] = useState('');
  const catalog = useOffsetList(searchPlatformCapabilities);

  return <>
    <p>Configure as capacidades padrão em <Link href="/planos">Planos</Link>. Para cada organização, valem as capacidades da versão vinculada ao contrato ativo.</p>
    <Form className="d-flex flex-wrap gap-2 align-items-end mb-3" onSubmit={event => {
      event.preventDefault();
      const query = search.trim();
      if (query === catalog.q) catalog.refresh();
      else catalog.setQ(query);
    }}>
      <Form.Group controlId="platform-capability-search">
        <Form.Label>Nome ou código</Form.Label>
        <Form.Control type="search" value={search} onChange={event => setSearch(event.target.value)} />
      </Form.Group>
      <Button type="submit" disabled={catalog.loading}>Buscar</Button>
    </Form>
    <DataTable rows={catalog.items} rowKey={row => row.code} loading={catalog.loading} error={catalog.error}
      hasMore={!catalog.loading && catalog.hasMore} onLoadMore={catalog.loadMore} emptyMessage="Nenhuma capacidade encontrada."
      columns={[
        { key: 'code', label: 'Código' },
        { key: 'name', label: 'Nome', render: row => row.name || '—' },
        { key: 'description', label: 'Descrição', render: row => row.description || '—' },
        { key: 'active', label: 'Situação', render: row => row.active === true ? 'Ativa' : row.active === false ? 'Inativa' : '—' }
      ]} />
  </>;
}
