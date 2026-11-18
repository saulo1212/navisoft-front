'use client';

import { Pagination as BsPagination } from 'react-bootstrap';

// Controle de páginas numeradas (1-based). Serve tanto para paginação no
// cliente (lista inteira já carregada) quanto no servidor (offset/limit).
// Mostra primeira/última, vizinhas da atual e reticências.
function pageWindow(page, pageCount, span = 1) {
  const pages = new Set([1, pageCount]);
  for (let p = page - span; p <= page + span; p += 1) {
    if (p >= 1 && p <= pageCount) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push('…');
    out.push(p);
    prev = p;
  }
  return out;
}

const Pagination = ({ page, pageCount, onPage, className = '' }) => {
  if (!pageCount || pageCount <= 1) return null;
  const items = pageWindow(page, pageCount);
  return (
    <BsPagination className={`mb-0 ${className}`}>
      <BsPagination.Prev disabled={page <= 1} onClick={() => onPage(page - 1)} />
      {items.map((it, i) =>
        it === '…' ? (
          <BsPagination.Ellipsis key={`e${i}`} disabled />
        ) : (
          <BsPagination.Item key={it} active={it === page} onClick={() => onPage(it)}>
            {it}
          </BsPagination.Item>
        )
      )}
      <BsPagination.Next disabled={page >= pageCount} onClick={() => onPage(page + 1)} />
    </BsPagination>
  );
};

export default Pagination;
