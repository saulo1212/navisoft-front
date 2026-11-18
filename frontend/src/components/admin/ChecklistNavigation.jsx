import Link from 'next/link';

export default function ChecklistNavigation() {
  return <nav aria-label="Navegação de checklists" className="d-flex gap-3 flex-wrap mb-3"><Link href="/checklists">Templates</Link><Link href="/checklists/grupos">Grupos</Link><Link href="/checklists/execucoes">Execuções</Link></nav>;
}
