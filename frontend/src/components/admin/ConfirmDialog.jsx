'use client';

import { useState } from 'react';
import { Alert, Button, FormControl, FormLabel, Modal, Spinner } from 'react-bootstrap';

// Confirmação genérica para ações de lifecycle/exclusão. Quando `requireReason`
// é true, exige motivo antes de habilitar a confirmação (mudança de lifecycle
// deve ter motivo registrado, conforme frontend_03).
const ConfirmDialog = ({
  show, onHide, title, body, confirmLabel = 'Confirmar', variant = 'danger',
  requireReason = false, onConfirm, submitting, error
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = async () => {
    await onConfirm(requireReason ? reason : undefined);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        <p>{body}</p>
        {requireReason && (
          <div className="mb-2">
            <FormLabel className="small">Motivo</FormLabel>
            <FormControl as="textarea" rows={2} value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={submitting}>Cancelar</Button>
        <Button variant={variant} onClick={handleConfirm} disabled={submitting || (requireReason && !reason.trim())}>
          {submitting ? <Spinner animation="border" size="sm" /> : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDialog;
