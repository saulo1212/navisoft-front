'use client';

import { Alert, Button, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { useSession } from '@/lib/session/SessionContext';
import { operationError } from './OperationalUi';

export function PlatformPage({ title, children: Content }) {
  const { token, areaAccess } = useSession();
  return <div className="content-wrapper">
    <PageBreadcrumb title={title} subTitle1="Sistema" />
    {token && areaAccess?.status === 'evaluated'
      ? <Content key={`${token}:${JSON.stringify(areaAccess)}`} />
      : <Alert variant="warning">O contexto atual da sessão não permite consultar esta página.</Alert>}
  </div>;
}

export function PlatformRead({ query, onRetry, children }) {
  if (query.loading) return <Spinner animation="border" size="sm" role="status"><span className="visually-hidden">Carregando</span></Spinner>;
  if (query.error) return <Alert variant="warning">
    {[401, 403].includes(query.error.status) ? 'A sessão não tem acesso a esta consulta.' : operationError(query.error)}
    {onRetry && <Button className="ms-2" size="sm" variant="outline-secondary" onClick={onRetry}>Tentar novamente</Button>}
  </Alert>;
  return query.data ? children(query.data) : null;
}
