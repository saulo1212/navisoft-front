'use client';
import Link from 'next/link';
export default function DocumentsNavigation() { return <nav className="d-flex flex-wrap gap-3 mb-3" aria-label="Documentos GED"><Link href="/documentos">Documentos</Link><Link href="/documentos/contratos">Contratos GED</Link><Link href="/documentos/classes">Classes e permissões</Link><Link href="/documentos/grupos">Grupos funcionais</Link></nav>; }
