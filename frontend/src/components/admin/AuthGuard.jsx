'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Alert, Button } from 'react-bootstrap';
import Loader from '@/components/Loader';
import { useSession } from '@/lib/session/SessionContext';
import OrganizationGate from './OrganizationGate';
import TemporalBanner from './TemporalBanner';
import { errorMessage } from '@/lib/api/errors';
import { canAccessPath, dashboardHome, isDemoPath, requiresOrganization, templateDemosEnabled } from '@/lib/navigation/access';

// Porta de entrada das rotas (admin). Segue a sequência do tópico 01:
// status -> access-context global -> seleção de organização -> gates.
const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, phase, areaAccess, selectedOrganizationUid, temporalMode, error, refreshAccessContext,
    orgGatesLoading, orgGatesError, retryOrganizationAccess, clearOrganization } = useSession();
  const hiddenDemo = isDemoPath(pathname) && !templateDemosEnabled;

  useEffect(() => {
    if (phase === 'unauthenticated') router.replace('/auth/login');
    if (phase === 'pending_mfa') router.replace('/auth/two-factor');
    if (phase === 'authenticated' && hiddenDemo) router.replace(dashboardHome);
  }, [phase, router, hiddenDemo]);

  if (phase === 'booting') return <Loader height="100vh" />;
  if (phase !== 'authenticated') return <Loader height="100vh" />;
  if (hiddenDemo) return <Loader height="100vh" />;

  if (!areaAccess) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center gap-3" style={{ height: '100vh' }}>
        <p className="text-muted">Não foi possível carregar o contexto de acesso.</p>
        <Button variant="primary" onClick={() => refreshAccessContext()}>Tentar novamente</Button>
      </div>
    );
  }

  // Bloqueio temporal: areas={} e status not_evaluated não equivalem a
  // "nenhuma área liberada" permanente — é restrição de horário, suspender
  // consultas de negócio e não tratar como sessão revogada.
  if (areaAccess.status === 'not_evaluated' && temporalMode === 'block') {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center gap-3 text-center px-4" style={{ height: '100vh' }}>
        <h4>Acesso fora do horário permitido</h4>
        <p className="text-muted" style={{ maxWidth: 480 }}>
          Sua conta está configurada com restrição de horário de acesso. Volte dentro da janela permitida
          ou contate um administrador. {error === 'relogin_required' ? 'Faça login novamente.' : ''}
        </p>
      </div>
    );
  }

  if (!canAccessPath(pathname, areaAccess)) return (
    <div className="content-wrapper">
      <Alert variant="warning">Seu contexto de acesso não permite abrir esta página.</Alert>
      <Link href={dashboardHome}>Voltar à visão geral</Link>
    </div>
  );

  const scoped = requiresOrganization(pathname);
  if (scoped && selectedOrganizationUid && orgGatesLoading) return <Loader height="100vh" />;
  if (scoped && selectedOrganizationUid && orgGatesError) return <div className="content-wrapper">
    <Alert variant="warning">{errorMessage(orgGatesError)}</Alert>
    <div className="d-flex flex-wrap gap-2">
      <Button variant="outline-primary" onClick={retryOrganizationAccess}>Reavaliar acesso</Button>
      <Button variant="outline-secondary" onClick={clearOrganization}>Trocar organização</Button>
    </div>
  </div>;
  const content = <ScopedRoute key={JSON.stringify([token, scoped || pathname === '/account/security' ? selectedOrganizationUid : null, areaAccess])}>
    {temporalMode === 'warn' && <TemporalBanner />}
    {children}
  </ScopedRoute>;

  return scoped ? <OrganizationGate>{content}</OrganizationGate> : <div className="content-wrapper">{content}</div>;
};

function ScopedRoute({ children }) { return children; }

export default AuthGuard;
