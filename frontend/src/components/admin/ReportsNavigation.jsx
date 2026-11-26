'use client';
import Link from 'next/link';
export default function ReportsNavigation() {
  return <nav className="d-flex gap-3 mb-3" aria-label="Relatórios">
    <Link href="/relatorios">Geração</Link>
    <Link href="/relatorios/agendamentos">Agendamentos</Link>
    <Link href="/relatorios/autoria">Autoria</Link>
  </nav>;
}
