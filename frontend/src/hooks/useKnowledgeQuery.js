'use client';
import { useEffect, useState } from 'react';

// Public catalogs must work without a session, unlike useOffsetList. Hide data
// immediately when any request argument changes; aborted responses never win.
export function useKnowledgeQuery(fetcher, args, enabled = true) {
  const key = JSON.stringify(args);
  const [result, setResult] = useState(null);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    Promise.resolve().then(() => fetcher({ ...JSON.parse(key), signal: controller.signal })).then(data => {
      if (!controller.signal.aborted) setResult({ key, fetcher, data });
    }).catch(error => { if (!controller.signal.aborted) setResult({ key, fetcher, error }); });
    return () => controller.abort();
  }, [fetcher, key, enabled]);
  const current = enabled && result?.key === key && result?.fetcher === fetcher ? result : null;
  return { data: current?.data, error: current?.error, loading: enabled && !current };
}
