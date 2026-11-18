'use client';

import { Button } from 'react-bootstrap';

export default function RoutePointsEditor({ points, onChange }) {
  const update = (index, field, value) => onChange(points.map((point, i) => i === index ? { ...point, [field]: value } : point));
  const move = (index, direction) => {
    const reordered = [...points];
    [reordered[index], reordered[index + direction]] = [reordered[index + direction], reordered[index]];
    onChange(reordered);
  };
  return <fieldset className="mb-3">
    <legend className="fs-6">Pontos na ordem do percurso</legend>
    <p className="small text-muted">Adicione ao menos dois pontos distintos. A velocidade do segmento vale até o próximo ponto; em branco, usa a velocidade da rota.</p>
    {points.map((point, index) => <div className="border rounded p-2 mb-2" key={index}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Ponto {index + 1}</strong>
        <div className="btn-group btn-group-sm">
          <Button type="button" variant="outline-secondary" aria-label={`Mover ponto ${index + 1} para cima`} disabled={index === 0} onClick={() => move(index, -1)}>↑</Button>
          <Button type="button" variant="outline-secondary" aria-label={`Mover ponto ${index + 1} para baixo`} disabled={index === points.length - 1} onClick={() => move(index, 1)}>↓</Button>
          <Button type="button" variant="outline-danger" aria-label={`Remover ponto ${index + 1}`} onClick={() => onChange(points.filter((_, i) => i !== index))}>Remover</Button>
        </div>
      </div>
      {[
        ['latitude', 'Latitude', -90, 90],
        ['longitude', 'Longitude', -180, 180],
        ['max_speed_to_next_kmh', 'Velocidade até o próximo ponto (km/h)', 0, undefined]
      ].map(([field, label, min, max]) => <div className="mb-2" key={field}>
        <label className="form-label" htmlFor={`route-${index}-${field}`}>{label}</label>
        <input id={`route-${index}-${field}`} className="form-control" type="number" step="any" min={min} max={max} required={field !== 'max_speed_to_next_kmh'} value={point[field] ?? ''} onChange={e => update(index, field, e.target.value === '' ? '' : Number(e.target.value))} />
      </div>)}
    </div>)}
    <Button type="button" size="sm" variant="outline-primary" onClick={() => onChange([...points, { latitude: '', longitude: '' }])}>Adicionar ponto</Button>
  </fieldset>;
}
