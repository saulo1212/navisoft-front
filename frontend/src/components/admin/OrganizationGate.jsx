'use client';

import { Button, Col, FormControl, ListGroup, Row, Spinner } from 'react-bootstrap';
import { useSession } from '@/lib/session/SessionContext';
import { useOrganizationsList } from '@/lib/session/useOrganizationsList';

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
  const { selectOrganization } = useSession();
  const { q, setQ, items, hasMore, loadMore, loading, error } = useOrganizationsList();

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <Row className="justify-content-center w-100">
        <Col xs={11} md={8} lg={6} xl={5}>
          <div className="card panel p-4">
            <h4 className="mb-1">Selecione uma organização</h4>
            <p className="text-muted small mb-3">
              Esta seleção define o contexto administrativo atual. Você pode trocar a qualquer momento.
            </p>
            <FormControl
              placeholder="Buscar por nome ou código..." className="mb-3"
              value={q} onChange={e => setQ(e.target.value)}
            />
            {error && <p className="text-danger small">Não foi possível carregar as organizações ({error}).</p>}
            <ListGroup className="mb-3" style={{ maxHeight: 320, overflowY: 'auto' }}>
              {items.map(org => (
                <ListGroup.Item
                  key={org.uid} action onClick={() => selectOrganization(org.uid)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{org.name}</span>
                  <span className="text-muted small font-monospace">{org.code}</span>
                </ListGroup.Item>
              ))}
              {!loading && items.length === 0 && !error && (
                <ListGroup.Item className="text-muted small">Nenhuma organização encontrada.</ListGroup.Item>
              )}
            </ListGroup>
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
