'use client';
import KnowledgeCatalog from '@/components/KnowledgeCatalog';
import KnowledgeNavigation from '@/components/admin/KnowledgeNavigation';
import { OperationalGate } from '@/components/admin/OperationalUi';
import { useSession } from '@/lib/session/SessionContext';
export default function Page() { return <OperationalGate area="knowledge"><Reader /></OperationalGate>; }
function Reader() { const { token, selectedOrganizationUid } = useSession(); return <><h1 className="h3">Base de conhecimento</h1><KnowledgeNavigation /><KnowledgeCatalog publicAccess={false} token={token} organizationUid={selectedOrganizationUid} /></>; }
