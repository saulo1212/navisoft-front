'use client';

import { Button, Col, FormControl, Row } from 'react-bootstrap';
import NewButton from './NewButton';

const ListToolbar = ({ q, onChangeQ, placeholder = 'Buscar...', createLabel, actionLabel, onAction, actionDisabled, actionTitle }) => (
  <Row className="mb-3 g-2 align-items-center">
    <Col xs={12} md={6} lg={4}>
      <FormControl placeholder={placeholder} value={q} onChange={e => onChangeQ(e.target.value)} />
    </Col>
    <Col className="d-flex justify-content-end">
      {createLabel ? (
        <NewButton label={createLabel} onClick={onAction} disabled={actionDisabled} title={actionTitle} />
      ) : actionLabel && (
        <Button onClick={onAction} disabled={actionDisabled} title={actionTitle}>{actionLabel}</Button>
      )}
    </Col>
  </Row>
);

export default ListToolbar;
