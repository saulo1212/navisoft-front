'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isApiError } from '@/lib/api/errors';
import { normalizeList } from '@/lib/api/http';
import { DEFAULT_LIST_LIMIT } from '@/lib/api/config';
import { useSession } from '@/lib/session/SessionContext';

// Listagem paginada por offset/limit — padrão dos endpoints /v1/admin/*.
// `fetcher` recebe { token, q, limit, offset, signal, ...params } e deve
// retornar o PAYLOAD BRUTO da API ({ items, total, limit, offset, ... }).
// O hook normaliza via normalizeList e acumula páginas em `loadMore`.
export function useOffsetList(fetcher, { params = {}, limit = DEFAULT_LIST_LIMIT, enabled = true } = {}) {
  const { token } = useSession();
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const paramsKey = JSON.stringify(params);

  const load = useCallback(async ({ reset }) => {
    if (!enabled || !token) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    const nextOffset = reset ? 0 : offset;
    try {
      const payload = await fetcher({ token, q, limit, offset: nextOffset, signal: controller.signal, ...params });
      if (controller.signal.aborted) return;
      const norm = normalizeList(payload);
      setItems(prev => (reset ? norm.items : [...prev, ...norm.items]));
      setTotal(norm.total);
      setHasMore(norm.hasMore);
      setOffset(nextOffset + norm.items.length);
    } catch (err) {
      if (controller.signal.aborted) return;
      if ([403, 404].includes(err.status)) {
        setItems([]);
        setTotal(null);
        setHasMore(false);
      }
      setError(isApiError(err) ? err.code || `http_${err.status}` : 'network_error');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, q, offset, limit, enabled, paramsKey]);

  useEffect(() => {
    setItems([]);
    setOffset(0);
    setHasMore(false);
    setTotal(null);
    setError(null);
    setLoading(false);
    void load({ reset: true });
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, q, limit, enabled, paramsKey]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) void load({ reset: false });
  }, [loading, hasMore, load]);

  const refresh = useCallback(() => {
    setItems([]);
    setOffset(0);
    void load({ reset: true });
  }, [load]);

  return { q, setQ, items, setItems, total, hasMore, loadMore, loading, error, refresh };
}
