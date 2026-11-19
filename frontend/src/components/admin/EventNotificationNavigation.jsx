'use client';
import Link from 'next/link';
import { canAccessPath } from '@/lib/navigation/access';
import { useSession } from '@/lib/session/SessionContext';
export default function EventNotificationNavigation({ notifications = false }) {
  const links = notifications ? [['/notificacoes', 'Destinatários'], ['/notificacoes/hooks', 'Automações'], ['/notificacoes/entregas', 'Entregas e integração']] : [['/eventos', 'Ocorrências'], ['/eventos/modelos', 'Tipos de evento'], ['/eventos/regras', 'Regras']];
  const { areaAccess } = useSession();
  return <nav className="d-flex flex-wrap gap-3 mb-3" aria-label={notifications ? 'Notificações' : 'Eventos'}>{links.filter(([href]) => canAccessPath(href, areaAccess)).map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav>;
}
