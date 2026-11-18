'use client';
import Link from 'next/link';
export default function EventNotificationNavigation({ notifications = false }) {
  const links = notifications ? [['/notificacoes', 'Destinatários'], ['/notificacoes/hooks', 'Automações'], ['/notificacoes/entregas', 'Entregas e integração']] : [['/eventos', 'Ocorrências'], ['/eventos/modelos', 'Tipos de evento'], ['/eventos/regras', 'Regras']];
  return <nav className="d-flex flex-wrap gap-3 mb-3" aria-label={notifications ? 'Notificações' : 'Eventos'}>{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</nav>;
}
