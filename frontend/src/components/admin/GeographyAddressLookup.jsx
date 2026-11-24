'use client';

import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import GeographyMap from './GeographyMap';
import { previewCoordinates } from '@/lib/domain/geography';

const labels = { latitude: 'Latitude', longitude: 'Longitude' };
const numberFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8, useGrouping: false });

export default function GeographyAddressLookup() {
  const [fields, setFields] = useState({ latitude: '', longitude: '' });
  const [point, setPoint] = useState(null);
  const [error, setError] = useState(null);

  function change(field, value) {
    setFields(previous => ({ ...previous, [field]: value }));
    setPoint(null);
    setError(null);
  }

  function showCoordinates(event) {
    event.preventDefault();
    try {
      setPoint({ uid: 'coordinate-preview', name: 'Coordenadas informadas', ...previewCoordinates(fields.latitude, fields.longitude) });
      setError(null);
    } catch (err) {
      setPoint(null);
      setError(err.message);
    }
  }

  return <>
    <Alert variant="info">A busca por endereço e a identificação de endereços por coordenadas estão indisponíveis neste ambiente.</Alert>
    <Card className="panel mb-3">
      <Card.Body>
        <h2 className="h5 mb-3">Visualizar coordenadas</h2>
        <Form onSubmit={showCoordinates}>
          {error && <Alert variant="danger" role="alert">{error}</Alert>}
          <div className="row g-3 align-items-end">
            {Object.entries(labels).map(([field, label]) => (
              <Form.Group key={field} controlId={`coordinate-preview-${field}`} className="col-12 col-sm-4">
                <Form.Label>{label}</Form.Label>
                <Form.Control value={fields[field]} inputMode="decimal" onChange={event => change(field, event.target.value)} />
              </Form.Group>
            ))}
            <div className="col-auto"><Button type="submit">Mostrar no mapa</Button></div>
          </div>
        </Form>
      </Card.Body>
    </Card>
    {point && <>
      <p className="small text-body-secondary mb-2" role="status">
        Latitude {numberFormat.format(point.latitude)}°, longitude {numberFormat.format(point.longitude)}°
      </p>
      <GeographyMap rows={[point]} selectedUid={point.uid} />
    </>}
  </>;
}
