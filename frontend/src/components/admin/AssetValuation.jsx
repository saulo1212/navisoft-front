'use client';

import { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { BillingRead, money } from './BillingUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { getAssetValuation } from '@/lib/api/endpoints/fleet';
import { useSession } from '@/lib/session/SessionContext';

const periods = { '1_month': '1 mês', '3_months': '3 meses', '6_months': '6 meses', '12_months': '12 meses' };

export default function AssetValuation({ assetUid }) {
  const { token } = useSession();
  const [revision, setRevision] = useState(0);
  const query = useKnowledgeQuery(getAssetValuation, { token, assetUid, revision }, revision > 0);
  return <section className="card panel p-3 mb-3">
    <h5>Avaliação FIPE</h5>
    <div><Button size="sm" variant="outline-primary" className="mb-3" disabled={query.loading}
      onClick={() => setRevision(value => value + 1)}>{revision ? 'Consultar novamente' : 'Consultar avaliação'}</Button></div>
    {query.error?.code === 'fipe_unavailable' ? <Alert variant="warning">O serviço FIPE está indisponível. Consulte novamente mais tarde.</Alert>
    : query.error?.code === 'fleet_not_found' ? <Alert variant="info">A API não encontrou uma avaliação FIPE para este ativo.</Alert>
    : <BillingRead query={query}>{({ status, body }) => {
      if (status === 202) return <Alert variant="info">Atualização FIPE solicitada. Consulte novamente quando o preço estiver disponível.</Alert>;
      const valuation = body?.valuation ?? body ?? {};
      const price = valuation.price_cents ?? valuation.value_cents;
      const reference = valuation.reference_date ?? valuation.reference?.reference_date ?? valuation.reference?.date ?? valuation.reference?.label ??
        (typeof valuation.reference === 'string' ? valuation.reference : null);
      return <>
        {!Number.isFinite(price) && <Alert variant="info">Preço indisponível para a referência informada.</Alert>}
        <dl className="row">
          <dt className="col-sm-3">Valor</dt><dd className="col-sm-9">{money(price, valuation.currency || 'BRL')}</dd>
          <dt className="col-sm-3">Referência</dt><dd className="col-sm-9">{reference || '—'}</dd>
          <dt className="col-sm-3">Código FIPE</dt><dd className="col-sm-9">{valuation.fipe_code || valuation.fipe_model_code || '—'}</dd>
          <dt className="col-sm-3">Combustível</dt><dd className="col-sm-9">{valuation.fuel_name || valuation.fuel?.name || valuation.fipe_fuel_code || '—'}</dd>
          {typeof valuation.source === 'string' && <><dt className="col-sm-3">Fonte</dt><dd className="col-sm-9">{valuation.source}</dd></>}
        </dl>
        {valuation.history && <>
          <h6>Histórico de preços</h6>
          <ul>{Object.entries(periods).map(([key, label]) => <li key={key}>{label} · {money(valuation.history[key]?.price_cents, valuation.currency || 'BRL')}</li>)}</ul>
        </>}
      </>;
    }}</BillingRead>}
  </section>;
}
