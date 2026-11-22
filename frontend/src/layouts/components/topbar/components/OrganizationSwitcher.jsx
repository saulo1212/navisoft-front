'use client';

import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Spinner } from 'react-bootstrap';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { fetchMyOrganizations } from '@/lib/api/endpoints/auth';
import { useSession } from '@/lib/session/SessionContext';
import { basePath } from '@/helpers';

const nameCollator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

const OrganizationSwitcher = () => {
  const { account, token, areaAccess, selectedOrganizationUid, selectOrganization, clearOrganization } = useSession();
  const enabled = Boolean(token && areaAccess?.status === 'evaluated');
  const { data, loading } = useKnowledgeQuery(fetchMyOrganizations, { token, areaAccess, limit: 50 }, enabled);
  if (!enabled) return null;
  const organizations = data?.items ?? [];
  const accountName = account?.name?.trim();
  const organizationLabel = org => {
    const name = org.name?.trim();
    if (!name || (accountName && nameCollator.compare(name, accountName) === 0)) {
      return 'Organização';
    }
    return name;
  };

  const current = organizations.find(org => org.uid === selectedOrganizationUid);

  return (
    <Dropdown>
      <DropdownToggle
        as="button" type="button" data-bs-toggle="dropdown"
        className="org-switcher d-flex flex-shrink-0 align-items-center gap-2 no-arrow"
        aria-label="Trocar organização"
      >
        <span className="org-switcher-icon d-flex align-items-center justify-content-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
          </svg>
        </span>
        <span className="org-switcher-text d-none d-md-flex flex-column text-start">
          <span className="org-switcher-label">Organização</span>
          <span className="org-switcher-name text-truncate">
            {current ? organizationLabel(current) : 'Selecionar organização'}
          </span>
        </span>
        <svg className="sa-icon org-switcher-caret d-none d-md-block" aria-hidden="true">
          <use href={`${basePath}/icons/sprite.svg#chevron-down`}></use>
        </svg>
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
            <span>{organizationLabel(org)}</span>
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
