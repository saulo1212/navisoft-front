'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isAccessDenied, readErrorMessage } from '@/lib/api/errors';
import { useSession } from '@/lib/session/SessionContext';

// Hook genérico para listagens paginadas por cursor (after_uid/has_more),
// padrão comum a todos os endpoints administrativos documentados.
// `fetcher` recebe { token, q, afterUid, signal, ...params } e deve
// retornar { items, has_more, next_after_uid }.
export function useCursorList(fetcher, { params = {}, enabled = true } = {}) {
  const { token } = useSession();
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [afterUid, setAfterUid] = useState(null);
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
    try {
      const result = await fetcher({ token, q, afterUid: reset ? null : afterUid, signal: controller.signal, ...params });
      if (controller.signal.aborted) return;
      setItems(prev => (reset ? result.items : [...prev, ...result.items]));
      setHasMore(result.has_more);
      setAfterUid(result.next_after_uid);
    } catch (err) {
      if (controller.signal.aborted) return;
      if (isAccessDenied(err)) {
        setItems([]);
        setHasMore(false);
        setAfterUid(null);
      }
      setError(readErrorMessage(err));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, q, afterUid, enabled, paramsKey]);

  useEffect(() => {
    setItems([]);
    setAfterUid(null);
    void load({ reset: true });
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, q, enabled, paramsKey]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) void load({ reset: false });
  }, [loading, hasMore, load]);

  const refresh = useCallback(() => {
    setItems([]);
    setAfterUid(null);
    void load({ reset: true });
  }, [load]);

  return { q, setQ, items, setItems, hasMore, loadMore, loading, error, refresh };
}
