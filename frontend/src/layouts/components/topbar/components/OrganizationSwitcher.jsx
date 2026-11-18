'use client';

import { useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Spinner } from 'react-bootstrap';
import { fetchMyOrganizations } from '@/lib/api/endpoints/auth';
import { useSession } from '@/lib/session/SessionContext';

const OrganizationSwitcher = () => {
  const { token, selectedOrganizationUid, selectOrganization, clearOrganization } = useSession();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    fetchMyOrganizations({ token, limit: 50 })
      .then(result => { if (active) setOrganizations(result.items); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  const current = organizations.find(org => org.uid === selectedOrganizationUid);

  return (
    <Dropdown>
      <DropdownToggle
        as="button" type="button" data-bs-toggle="dropdown"
        className="btn-system bg-transparent d-flex flex-shrink-0 align-items-center gap-2 no-arrow px-2"
        aria-label="Trocar organização"
      >
        <i className="sa sa-building" aria-hidden="true" />
        <span className="d-none d-md-inline text-truncate" style={{ maxWidth: 160 }}>
          {current ? current.name : 'Selecionar organização'}
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-animated dropdown-menu-end" style={{ minWidth: 260 }}>
        <div className="px-3 py-2 small text-muted">Organizações disponíveis</div>
        <hr className="m-0" />
        {loading && <div className="px-3 py-2"><Spinner size="sm" animation="border" /></div>}
        {!loading && organizations.map(org => (
          <DropdownItem
            key={org.uid} active={org.uid === selectedOrganizationUid}
            onClick={() => selectOrganization(org.uid)}
            className="d-flex justify-content-between"
          >
            <span>{org.name}</span>
            <span className="text-muted small font-monospace">{org.code}</span>
          </DropdownItem>
        ))}
        <hr className="m-0" />
        <DropdownItem onClick={() => clearOrganization()}>
          <span className="small">Ver todas / trocar...</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default OrganizationSwitcher;
