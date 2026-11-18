'use client';
import Link from 'next/link';
export default function KnowledgeNavigation() {
  return <nav className="d-flex flex-wrap gap-3 mb-3" aria-label="Base de conhecimento"><Link href="/knowledge">Artigos administrativos</Link><Link href="/knowledge/categorias">Categorias</Link><Link href="/knowledge/leitura">Artigos disponíveis</Link><Link href="/ajuda">Portal público</Link></nav>;
}
