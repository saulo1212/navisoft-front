'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isAccessDenied, readErrorMessage } from '@/lib/api/errors';
import { normalizeList } from '@/lib/api/http';
import { DEFAULT_LIST_LIMIT } from '@/lib/api/config';
import { useSession } from '@/lib/session/SessionContext';

// Paginação no SERVIDOR por página (offset/limit) — para endpoints que paginam
// de verdade (situations, users, services, …). Diferente de useOffsetList, aqui
// cada página SUBSTITUI a anterior (navegação por número de página, não scroll).
// `fetcher` recebe { token, q, limit, offset, signal, ...params } e retorna o
// payload bruto ({ items, total, limit, offset }).
export function usePagedList(fetcher, { params = {}, pageSize = DEFAULT_LIST_LIMIT, enabled = true } = {}) {
  const { token } = useSession();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const paramsKey = JSON.stringify(params);

  const load = useCallback(async (targetPage) => {
    if (!enabled || !token) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const offset = (targetPage - 1) * pageSize;
      const payload = await fetcher({ token, q, limit: pageSize, offset, signal: controller.signal, ...params });
      if (controller.signal.aborted) return;
      const norm = normalizeList(payload);
      // Se o endpoint ignorou limit/offset (devolveu mais que pageSize), ele
      // paginamos no cliente — mantém o MESMO comportamento/UX dos que paginam
      // no servidor, e passa a paginar de verdade assim que o backend respeitar.
      const serverPaginated = norm.items.length <= pageSize;
      setItems(serverPaginated ? norm.items : norm.items.slice(offset, offset + pageSize));
      setTotal(norm.total);
    } catch (err) {
      if (controller.signal.aborted) return;
      if (isAccessDenied(err)) {
        setItems([]);
        setTotal(null);
      }
      setError(readErrorMessage(err));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, q, pageSize, enabled, paramsKey]);

  // Busca/params mudaram: volta à página 1.
  useEffect(() => { setPage(1); }, [q, paramsKey, token]);
  useEffect(() => { void load(page); return () => controllerRef.current?.abort(); }, [page, load]);

  const pageCount = total != null ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const goToPage = useCallback(p => setPage(Math.min(Math.max(1, p), pageCount)), [pageCount]);
  const refresh = useCallback(() => load(page), [load, page]);

  return { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh };
}
