'use client';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import KnowledgeNavigation from '@/components/admin/KnowledgeNavigation';
import { OperationalGate } from '@/components/admin/OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { listKnowledgeCategories } from '@/lib/api/endpoints/knowledge';
export default function Page() { return <OperationalGate area="knowledge"><Categories /></OperationalGate>; }
function Categories() {
  const list = useOffsetList(listKnowledgeCategories);
  return <><PageBreadcrumb title="Categorias da base de conhecimento" subTitle1="Conteúdo" /><KnowledgeNavigation /><DataTable rows={list.items} loading={list.loading} error={list.error} hasMore={!list.loading && list.hasMore} onLoadMore={list.loadMore} columns={[{ key: 'name', label: 'Categoria' }, { key: 'code', label: 'Código', render: row => row.code || row.slug || '—' }, { key: 'description', label: 'Descrição' }]} /></>;
}
