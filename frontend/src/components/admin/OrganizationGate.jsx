'use client';

import { Button, Col, FormControl, Row, Spinner } from 'react-bootstrap';
import { useSession } from '@/lib/session/SessionContext';
import { useOrganizationsList } from '@/lib/session/useOrganizationsList';
import { basePath } from '@/helpers';

// Seleção explícita de organização (tópico 01, item 4). Organização é
// contexto do frontend, não identidade da sessão — pode ser troca livre.
const OrganizationGate = ({ children }) => {
  const { selectedOrganizationUid } = useSession();
  // Único filho direto de .app-content (flex row): o tema espera exatamente
  // um wrapper "content-wrapper" (flex:1 1 auto) para a página esticar.
  if (selectedOrganizationUid) return <div className="content-wrapper">{children}</div>;
  return <div className="content-wrapper"><OrganizationPicker /></div>;
};

const OrganizationPicker = () => {
  const { selectOrganization, selectedOrganizationUid } = useSession();
  const { q, setQ, items, hasMore, loadMore, loading, error } = useOrganizationsList();

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <Row className="justify-content-center w-100">
        <Col xs={11} md={9} lg={7} xl={6}>
          <div className="card panel org-picker p-4">
            <div className="d-flex align-items-start gap-3 mb-3">
              <span className="org-picker-icon d-flex align-items-center justify-content-center flex-shrink-0">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                  <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
                </svg>
              </span>
              <div>
                <h4 className="mb-1 fw-bold">Selecione uma organização</h4>
                <p className="text-muted small mb-0">
                  Esta seleção define o contexto administrativo atual. Você pode trocar a qualquer momento.
                </p>
              </div>
            </div>

            <div className="org-picker-search position-relative mb-3">
              <svg className="sa-icon org-picker-search-icon" aria-hidden="true">
                <use href={`${basePath}/icons/sprite.svg#search`}></use>
              </svg>
              <FormControl
                placeholder="Buscar por nome ou código..." style={{ paddingLeft: '3.4rem' }}
                value={q} onChange={e => setQ(e.target.value)}
              />
            </div>

            {error && <p className="text-danger small">Não foi possível carregar as organizações ({error}).</p>}

            <div className="org-picker-list mb-3" style={{ maxHeight: 340, overflowY: 'auto' }}>
              {items.map(org => (
                <button
                  type="button" key={org.uid}
                  onClick={() => selectOrganization(org.uid)}
                  className={`org-picker-item ${org.uid === selectedOrganizationUid ? 'active' : ''}`}
                >
                  <span className="org-picker-name">{org.name}</span>
                </button>
              ))}
              {!loading && items.length === 0 && !error && (
                <div className="org-picker-empty text-muted small">Nenhuma organização encontrada.</div>
              )}
            </div>

            <div className="text-center">
              {loading && <Spinner animation="border" size="sm" />}
              {!loading && hasMore && (
                <Button variant="outline-secondary" size="sm" onClick={loadMore}>Carregar mais</Button>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OrganizationGate;
