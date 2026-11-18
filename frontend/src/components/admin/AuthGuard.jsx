'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Loader from '@/components/Loader';
import { useSession } from '@/lib/session/SessionContext';
import OrganizationGate from './OrganizationGate';
import TemporalBanner from './TemporalBanner';

// Porta de entrada das rotas (admin). Segue a sequência do tópico 01:
// status -> access-context global -> seleção de organização -> gates.
const AuthGuard = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { phase, areaAccess, temporalMode, error, refreshAccessContext } = useSession();

  useEffect(() => {
    if (phase === 'unauthenticated') router.replace('/auth/login');
    if (phase === 'pending_mfa') router.replace('/auth/two-factor');
  }, [phase, router]);

  if (phase === 'booting') return <Loader height="100vh" />;
  if (phase !== 'authenticated') return <Loader height="100vh" />;

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

  if (pathname === '/billing' || pathname === '/planos') {
    return <div className="content-wrapper">
      {temporalMode === 'warn' && <TemporalBanner />}
      {children}
    </div>;
  }

  return (
    <OrganizationGate>
      {temporalMode === 'warn' && <TemporalBanner />}
      {children}
    </OrganizationGate>
  );
};

export default AuthGuard;
