'use client';
import Link from 'next/link';
export default function AgendaNavigation() {
  return <nav className="d-flex gap-3 mb-3" aria-label="Agenda"><Link href="/agenda">Agenda operacional</Link><Link href="/relatorios/agendamentos">Agendamentos de relatórios</Link></nav>;
}
