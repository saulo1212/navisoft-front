'use client';

import { useId, useRef } from 'react';
import { Alert, Button, Modal, Spinner } from 'react-bootstrap';
import { operationError, useOperationalAction } from './OperationalUi';
import { newIdempotencyKey } from '@/lib/api/idempotency';
import { useSession } from '@/lib/session/SessionContext';

export const uidPattern = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
export const billingModeLabel = mode => ({ postpaid: 'Pós-pago', prepaid: 'Pré-pago' })[mode] ?? mode;

export function money(cents, currency) {
  if (!Number.isFinite(cents)) return '—';
  if (!/^[A-Z]{3}$/.test(currency ?? '')) return `${cents} centavos`;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(cents / 100);
}

export function BillingField({ label, options, optional, ...props }) {
  const id = useId();
  return <div className="mb-3">
    <label htmlFor={id} className="form-label">{label}</label>
    {options
      ? <select id={id} className="form-select" required={!optional} {...props}>
        {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
      </select>
      : <input id={id} className={props.type === 'checkbox' ? 'form-check-input ms-2' : 'form-control'}
        required={!optional && props.type !== 'checkbox'} {...props} />}
  </div>;
}

export function BillingRead({ query, children }) {
  if (query.loading) return <Spinner animation="border" size="sm" role="status" aria-label="Carregando" />;
  if (query.error) return <Alert variant="danger">{operationError(query.error)}</Alert>;
  return query.data ? children(query.data) : null;
}

export function BillingSessionScope({ children }) {
  const { token, areaAccess } = useSession();
  return <BillingScope key={`${token}:${JSON.stringify(areaAccess)}`}>{children}</BillingScope>;
}

function BillingScope({ children }) { return children; }

export function useBillingMutation() {
  const action = useOperationalAction();
  const receipts = useRef(new Map());
  return {
    ...action,
    submit(request, body, success, denied) {
      const fingerprint = JSON.stringify(body);
      const key = receipts.current.get(fingerprint) ?? newIdempotencyKey();
      receipts.current.set(fingerprint, key);
      return action.run(signal => request({ body, signal, idempotencyKey: key }), result => {
        receipts.current.delete(fingerprint);
        success?.(result);
      }, denied);
    }
  };
}

export function BillingForm({ title, submitLabel = 'Salvar', children, mutation, onSubmit, onClose, submitDisabled = false }) {
  return <Modal show centered onHide={mutation.busy ? undefined : onClose} backdrop={mutation.busy ? 'static' : true} keyboard={!mutation.busy}>
    <form onSubmit={event => {
      event.preventDefault();
      onSubmit(Object.fromEntries(new FormData(event.currentTarget)));
    }}>
      <Modal.Header closeButton={!mutation.busy}><Modal.Title className="fs-5">{title}</Modal.Title></Modal.Header>
      <Modal.Body>
        {mutation.error && <Alert variant="danger">{mutation.error}</Alert>}
        <fieldset disabled={mutation.busy}>{children}</fieldset>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" type="button" onClick={onClose} disabled={mutation.busy}>Fechar</Button>
        <Button type="submit" disabled={mutation.busy || submitDisabled}>{mutation.busy ? 'Enviando…' : submitLabel}</Button>
      </Modal.Footer>
    </form>
  </Modal>;
}
