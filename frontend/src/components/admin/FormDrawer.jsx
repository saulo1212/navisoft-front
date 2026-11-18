'use client';

import { Alert, Button, Offcanvas, Spinner } from 'react-bootstrap';

const FormDrawer = ({ show, onHide, title, onSubmit, submitting, submitDisabled = false, error, submitLabel = 'Salvar', children, footerExtra }) => (
  <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: 460 }}>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>{title}</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <form onSubmit={onSubmit}>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        {children}
        <div className="d-flex justify-content-end gap-2 mt-4">
          {footerExtra}
          <Button variant="outline-secondary" type="button" onClick={onHide} disabled={submitting}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={submitting || submitDisabled}>
            {submitting ? <Spinner animation="border" size="sm" /> : submitLabel}
          </Button>
        </div>
      </form>
    </Offcanvas.Body>
  </Offcanvas>
);

export default FormDrawer;
