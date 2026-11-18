import Link from 'next/link';

export const metadata = { title: 'Base de conhecimento' };
export default function KnowledgePublicLayout({ children }) {
  return <div className="container py-4" style={{ maxWidth: 960 }}><header className="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom pb-3 mb-4"><Link className="h4 mb-0 text-decoration-none" href="/ajuda">Movisat · Central de ajuda</Link><Link href="/auth/login">Entrar na plataforma</Link></header><main>{children}</main></div>;
}
