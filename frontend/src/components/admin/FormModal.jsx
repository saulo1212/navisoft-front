'use client';

import { useId } from 'react';
import { Alert, Button, Modal, Spinner } from 'react-bootstrap';

const FormModal = ({ show, onHide, title, onSubmit, submitting, submitDisabled = false, error, submitLabel = 'Salvar', children, footerExtra }) => {
  const titleId = useId();

  return (
    <Modal
      show={show}
      onHide={submitting ? undefined : onHide}
      aria-labelledby={titleId}
      centered
      scrollable
      backdrop="static"
      keyboard={!submitting}
    >
      <form onSubmit={onSubmit} className="d-flex flex-column overflow-hidden">
        <Modal.Header closeButton={!submitting} closeLabel="Fechar">
          <Modal.Title id={titleId} className="fs-5">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          {children}
        </Modal.Body>
        <Modal.Footer>
          {footerExtra}
          <Button variant="outline-secondary" type="button" onClick={onHide} disabled={submitting}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={submitting || submitDisabled}>
            {submitting ? (
              <Spinner animation="border" size="sm" role="status">
                <span className="visually-hidden">Enviando</span>
              </Spinner>
            ) : submitLabel}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default FormModal;
