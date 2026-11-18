'use client';
import { useParams } from 'next/navigation';
import KnowledgeArticle from '@/components/KnowledgeArticle';
import { OperationalGate } from '@/components/admin/OperationalUi';
import { useSession } from '@/lib/session/SessionContext';
export default function Page() { const { slug } = useParams(); return <OperationalGate area="knowledge"><Reader key={slug} slug={slug} /></OperationalGate>; }
function Reader({ slug }) { const { token, selectedOrganizationUid } = useSession(); return <KnowledgeArticle publicAccess={false} token={token} organizationUid={selectedOrganizationUid} slug={slug} />; }
