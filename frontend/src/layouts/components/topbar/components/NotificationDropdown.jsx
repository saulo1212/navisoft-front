'use client';

import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import { basePath } from '@/helpers';
import { areaAllowed } from '@/components/admin/OperationalUi';
import { useSession } from '@/lib/session/SessionContext';

export default function NotificationDropdown() {
  const { areaAccess } = useSession();
  if (!areaAllowed(areaAccess, 'notifications')) return null;
  return <Dropdown>
    <Dropdown.Toggle as="button" className="btn btn-system no-arrow" aria-label="Abrir notifica??es">
      <svg className="sa-icon sa-icon-2x" aria-hidden="true"><use href={`${basePath}/icons/sprite.svg#bell`} /></svg>
    </Dropdown.Toggle>
    <Dropdown.Menu align="end">
      <Dropdown.Header>Notifica??es</Dropdown.Header>
      <Dropdown.Item as={Link} href="/notificacoes">Destinat?rios</Dropdown.Item>
      <Dropdown.Item as={Link} href="/notificacoes/hooks">Automa??es</Dropdown.Item>
      <Dropdown.Item as={Link} href="/notificacoes/entregas">Entregas e integra??o</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>;
}
