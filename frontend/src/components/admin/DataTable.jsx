'use client';

import { Button, Spinner, Table } from 'react-bootstrap';
import Pagination from './Pagination';

const ERROR_LABELS = {
  organization_not_found: 'Organização não encontrada ou fora do escopo.',
  area_not_allowed: 'Sua área de acesso não permite ver estes dados.',
  network_error: 'Falha de rede ao buscar os dados.'
};

// Tabela genérica para listagens administrativas paginadas por cursor.
// `columns`: [{ key, label, render?(row) }]
const DataTable = ({
  columns, rows, loading, error, emptyMessage = 'Nenhum registro encontrado.',
  onRowClick, rowKey = row => row.uid, hasMore, onLoadMore, loadingMore, pagination
}) => {
  return (
    <div className="card panel">
      <div className="table-responsive">
        <Table hover className="mb-0 align-middle">
          <thead>
            <tr>
              {columns.map(col => <th key={col.key}>{col.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined} style={onRowClick ? { cursor: 'pointer' } : undefined}>
                {columns.map(col => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {loading && rows.length === 0 && (
        <div className="text-center py-4"><Spinner animation="border" size="sm" /></div>
      )}
      {!loading && rows.length === 0 && !error && (
        <p className="text-muted text-center small py-4 mb-0">{emptyMessage}</p>
      )}
      {error && (
        <p className="text-danger text-center small py-3 mb-0">{ERROR_LABELS[error] || `Erro: ${error}`}</p>
      )}
      {!error && rows.length > 0 && (hasMore || loadingMore) && !pagination && (
        <div className="text-center py-3 border-top">
          {loadingMore ? <Spinner animation="border" size="sm" /> : (
            <Button variant="outline-secondary" size="sm" onClick={onLoadMore}>Carregar mais</Button>
          )}
        </div>
      )}
      {!error && pagination && pagination.pageCount > 1 && (
        <div className="d-flex justify-content-between align-items-center py-2 px-3 border-top flex-wrap gap-2">
          <span className="text-muted small">
            Página {pagination.page} de {pagination.pageCount}
            {pagination.total != null ? ` · ${pagination.total} registro(s)` : ''}
          </span>
          <Pagination page={pagination.page} pageCount={pagination.pageCount} onPage={pagination.onPage} />
        </div>
      )}
    </div>
  );
};

export default DataTable;
