'use client';

import { useState } from 'react';
import { recordGeometry } from '@/lib/domain/geography';

const validPair = p => Array.isArray(p) && p.length >= 2 && p.slice(0, 2).every(Number.isFinite) && Math.abs(p[0]) <= 180 && Math.abs(p[1]) <= 90;
function lines(geometry) {
  const c = geometry?.coordinates;
  if (geometry?.type === 'Point') return validPair(c) ? [[c]] : [];
  const paths = geometry?.type === 'LineString' ? [c] : geometry?.type === 'Polygon' ? c : geometry?.type === 'MultiPolygon' ? c?.flat() : [];
  return Array.isArray(paths) ? paths.filter(path => Array.isArray(path) && path.length > 1 && path.every(validPair)) : [];
}

// Geographic overview rendered locally; coordinates remain in the browser.
export default function GeographyMap({ rows, selectedUid, onSelect }) {
  const [zoom, setZoom] = useState(1);
  const features = rows.map(row => ({ row, geometry: recordGeometry(row) })).map(f => ({ ...f, paths: lines(f.geometry) })).filter(f => f.paths.length);
  const pairs = features.flatMap(f => f.paths.flat());
  if (!pairs.length) return <div className="card panel p-4 text-muted mb-3">Nenhuma geometria disponível para visualizar nesta lista.</div>;
  const lons = pairs.map(p => p[0]);
  const lats = pairs.map(p => p[1]);
  const lon0 = (Math.min(...lons) + Math.max(...lons)) / 2;
  const lat0 = (Math.min(...lats) + Math.max(...lats)) / 2;
  const cos = Math.max(0.01, Math.cos(lat0 * Math.PI / 180));
  const radiusDegrees = Math.max(0, ...features.map(f => Number(f.row.radius_meters) || 0)) / 111320;
  const span = Math.max((Math.max(...lons) - Math.min(...lons)) * cos, (Math.max(...lats) - Math.min(...lats)) * 2, radiusDegrees * 4, 0.005) * 1.3 / zoom;
  const project = p => [450 + (p[0] - lon0) * cos * 800 / span, 220 - (p[1] - lat0) * 800 / span];
  return <div className="card panel mb-3 overflow-hidden">
    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <span>Mapa de coordenadas · {features.length} registro(s)</span>
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-secondary" type="button" aria-label="Afastar mapa" onClick={() => setZoom(z => Math.max(0.25, z / 1.5))}>−</button>
        <button className="btn btn-outline-secondary" type="button" onClick={() => setZoom(1)}>Ajustar</button>
        <button className="btn btn-outline-secondary" type="button" aria-label="Aproximar mapa" onClick={() => setZoom(z => Math.min(64, z * 1.5))}>+</button>
      </div>
    </div>
    <svg viewBox="0 0 900 440" role="img" aria-label="Mapa das geometrias carregadas, com latitude e longitude" style={{ width: '100%', maxHeight: 440, background: '#edf3f6' }}>
      {Array.from({ length: 9 }, (_, i) => {
        const x = 50 + i * 100;
        return <g key={`x${i}`}><path d={`M ${x} 0 V 440`} stroke="#cedce3" /><text x={x + 3} y="430" fontSize="11" fill="#526675">{(lon0 + (x - 450) * span / 800 / cos).toFixed(4)}°</text></g>;
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const y = 20 + i * 100;
        return <g key={`y${i}`}><path d={`M 0 ${y} H 900`} stroke="#cedce3" /><text x="5" y={y + 13} fontSize="11" fill="#526675">{(lat0 - (y - 220) * span / 800).toFixed(4)}°</text></g>;
      })}
      {features.map(({ row, geometry, paths }) => {
        const color = row.uid === selectedUid ? '#b64b16' : '#146c94';
        const [x, y] = project(paths[0][0]);
        const polygon = geometry.type.includes('Polygon');
        return <g key={row.uid} role="button" tabIndex={0} aria-label={`Selecionar ${row.name || row.uid}`} onClick={() => onSelect(row)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(row); } }} style={{ cursor: 'pointer' }}>
          <title>{row.name || row.uid}</title>
          {geometry.type === 'Point' ? <>
            {Number(row.radius_meters) > 0 && <circle cx={x} cy={y} r={Number(row.radius_meters) / 111320 * 800 / span} stroke={color} fill={color} fillOpacity="0.12" />}
            <circle cx={x} cy={y} r="6" fill={color} stroke="white" strokeWidth="2" />
          </> : <path d={paths.map(path => path.map((p, i) => `${i ? 'L' : 'M'} ${project(p).join(' ')}`).join(' ') + (polygon ? ' Z' : '')).join(' ')} stroke={color} strokeWidth="3" fill={polygon ? color : 'none'} fillOpacity="0.15" fillRule="evenodd" />}
          <text x={x + 10} y={y - 10} fontSize="13" fill={color}>{row.name}</text>
        </g>;
      })}
      <text x="865" y="25" fill="#526675" fontSize="14">N ↑</text>
    </svg>
    <p className="small text-muted p-3 mb-0">Visualização das geometrias carregadas, sem base de ruas. Clique em um registro para abrir os detalhes. Raios em metros; coordenadas em graus.</p>
  </div>;
}
