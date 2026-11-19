'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useSession } from '@/lib/session/SessionContext';
import { errorMessage, isApiError } from '@/lib/api/errors';
import { areaAllowed } from '@/lib/navigation/access';

export const operationError = error => isApiError(error) ? `${errorMessage(error)}${error.code ? ` (${error.code})` : ''}` : error.message || 'Não foi possível concluir a operação.';
export { areaAllowed };

export function OperationalGate({ area, children }) {
  const { token, selectedOrganizationUid, areaAccess } = useSession();
  if (!selectedOrganizationUid) return <Alert variant="warning">Selecione uma organização.</Alert>;
  if (!areaAllowed(areaAccess, area)) return <Alert variant="warning">Seu contexto de acesso não permite consultar esta área.</Alert>;
  // Unmount every open form and request when the identity, tenant or grants change.
  return <ScopedContent key={`${token}:${selectedOrganizationUid}:${JSON.stringify(areaAccess)}`}>{children}</ScopedContent>;
}
function ScopedContent({ children }) { return children; }

export function OperationField({ label, multiline = false, ...props }) {
  const id = useId();
  const Tag = multiline ? 'textarea' : 'input';
  return <div className="mb-3"><label className="form-label" htmlFor={id}>{label}</label><Tag id={id} className="form-control" {...(multiline ? { rows: 3 } : {})} {...props} /></div>;
}

export function useOperationalAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const active = useRef(false);
  const mounted = useRef(true);
  const controller = useRef(null);
  const { refreshAccessContext } = useSession();
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; controller.current?.abort(); };
  }, []);
  const run = async (action, success, denied) => {
    if (active.current) return;
    active.current = true;
    controller.current = new AbortController();
    const signal = controller.current.signal;
    setBusy(true); setError(null);
    try {
      const result = await action(signal);
      if (mounted.current && !signal.aborted) success?.(result);
    } catch (err) {
      if (mounted.current && !signal.aborted) {
        setError(operationError(err));
        if ([403, 404].includes(err.status)) { denied?.(); void refreshAccessContext(); }
      }
    } finally {
      active.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  return { run, busy, error, clearError: () => setError(null) };
}
