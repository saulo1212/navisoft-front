'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMyOrganizations } from '@/lib/api/endpoints/auth';
import { isApiError } from '@/lib/api/errors';
import { useSession } from './SessionContext';

// Seletor paginado de /v1/users/me/organizations (tópico 01, item 3 da
// sequência). `q` reinicia a paginação; next_after_uid encadeia páginas.
export function useOrganizationsList() {
  const { token } = useSession();
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [afterUid, setAfterUid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const load = useCallback(async ({ reset } = { reset: false }) => {
    if (!token) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyOrganizations({
        token, q, afterUid: reset ? null : afterUid, limit: 50, signal: controller.signal
      });
      setItems(prev => (reset ? result.items : [...prev, ...result.items]));
      setHasMore(result.has_more);
      setAfterUid(result.next_after_uid);
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(isApiError(err) ? err.code || `http_${err.status}` : 'network_error');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, q, afterUid]);

  useEffect(() => {
    setItems([]);
    setAfterUid(null);
    void load({ reset: true });
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, q]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) void load({ reset: false });
  }, [loading, hasMore, load]);

  return { q, setQ, items, hasMore, loadMore, loading, error };
}
