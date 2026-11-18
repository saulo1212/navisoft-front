'use client';

import { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { OperationalGate } from '@/components/admin/OperationalUi';
import { BillingField, BillingForm, BillingRead, billingModeLabel, useBillingMutation } from '@/components/admin/BillingUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { commercialOrders, getCommercialOverview, transitionOrder } from '@/lib/api/endpoints/billing';
import { UUID_PATTERN } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

const stateLabels = {
  pending: 'Pendente', accepted: 'Aceito', completed: 'Concluído', cancelled: 'Cancelado',
  awaiting_payment: 'Aguardando pagamento', awaiting_signature: 'Aguardando assinatura'
};

export default function CommercialPage() {
  return <>
    <PageBreadcrumb title="Comercial" subTitle1="Comercial & Financeiro" />
    <OperationalGate area="commercial"><Commercial /></OperationalGate>
  </>;
}

function Commercial() {
  const { token, selectedOrganizationUid: organizationUid } = useSession();
  const overview = useKnowledgeQuery(getCommercialOverview, { token, organizationUid });
  const [offer, setOffer] = useState(null);
  const [orders, setOrders] = useState([]);
  const created = result => {
    const order = result?.order ?? result;
    setOrders(previous => [{ order, name: offer.plan_name, mode: offer.billing_mode }, ...previous]);
    setOffer(null);
  };
  return <>
    <BillingRead query={overview}>{data => <>
      <section className="card panel p-3 mb-3">
        <h2 className="h5">Conta de faturamento</h2>
        {data.billing_account ? <dl className="mb-0">
          <dt>Identificador</dt><dd className="font-monospace text-break">{data.billing_account.uid}</dd>
          <dt>Tipo de pagador</dt><dd>{data.billing_account.payer_kind}</dd>
          {data.billing_account.external_legal_name && <><dt>Razão social</dt><dd>{data.billing_account.external_legal_name}</dd></>}
        </dl> : <p className="mb-0">Nenhuma conta vinculada.</p>}
      </section>
      <h2 className="h5">Ofertas disponíveis</h2>
      {!data.offers?.length && <p>Nenhuma oferta disponível para esta organização.</p>}
      <div className="row g-3 mb-4">
        {data.offers?.map(item => <div className="col-md-6 col-xl-4" key={item.uid_plan_version}>
          <section className="card panel p-3 h-100">
            <h3 className="h6">{item.plan_name}</h3>
            <p>{billingModeLabel(item.billing_mode)} · {item.plan_code}</p>
            <p>Serviços disponíveis {item.services?.map(service => service.code).join(', ') || '—'}</p>
            <div className="mt-auto"><Button size="sm" variant="outline-primary" onClick={() => setOffer(item)}>Revisar oferta</Button></div>
          </section>
        </div>)}
      </div>
    </>}</BillingRead>
    {offer && <OfferForm offer={offer} organizationUid={organizationUid} hasBillingAccount={Boolean(overview.data?.billing_account)}
      onClose={() => setOffer(null)} onCreated={created} />}
    {orders.length > 0 && <section>
      <h2 className="h5">Pedidos criados nesta página</h2>
      {orders.map((item, index) => <OrderCard key={item.order?.uid ?? item.order?.uid_order ?? index} {...item}
        onChanged={order => setOrders(previous => previous.map(row => row === item ? { ...row, order } : row))} />)}
    </section>}
  </>;
}

function OfferForm({ offer, organizationUid, hasBillingAccount, onClose, onCreated }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const terms = offer.terms ?? [];
  const uidOf = term => term?.uid_terms_version ?? term?.uid;
  const modeOf = term => term?.acceptance_mode ?? term?.mode;
  const signatureOf = term => modeOf(term) === 'external_signature';
  const contentOf = term => typeof term?.content === 'string' ? term.content.trim() : '';
  const linkOf = term => typeof term?.url === 'string' && term.url.startsWith('https://') ? term.url : null;
  const unsupportedTerms = terms.some(term => !UUID_PATTERN.test(uidOf(term) ?? '') ||
    !['clickwrap', 'external_signature'].includes(modeOf(term)) || !(contentOf(term) || linkOf(term)));
  const submit = values => {
    if (unsupportedTerms || !hasBillingAccount) return;
    const body = { uid_organization: organizationUid, uid_plan_version: offer.uid_plan_version };
    if (offer.services?.length) body.services = offer.services.filter(service => values[`service-${service.code}`]).map(service => service.code);
    const accepted = terms.filter(term => values[`term-${uidOf(term)}`] && !signatureOf(term)).map(uidOf);
    if (accepted.length) body.accepted_terms = accepted;
    mutation.submit(args => commercialOrders.create({ ...args, token }), body, onCreated);
  };
  return <BillingForm title={offer.plan_name} submitLabel="Criar pedido" mutation={mutation} onClose={onClose}
    onSubmit={submit} submitDisabled={unsupportedTerms || !hasBillingAccount}>
    <p>{billingModeLabel(offer.billing_mode)}</p>
    {!hasBillingAccount && <Alert variant="warning">Vincule uma conta de faturamento à organização para criar o pedido.</Alert>}
    {offer.services?.length > 0 && <fieldset><legend className="fs-6">Serviços</legend>
      {offer.services.map(service => <BillingField key={service.code} name={`service-${service.code}`}
        type="checkbox" label={service.code} defaultChecked={service.default_enabled} />)}
    </fieldset>}
    {unsupportedTerms && <Alert variant="warning">A oferta retornou termos sem identificação ou conteúdo legível. A criação está indisponível.</Alert>}
    {terms.length > 0 && !unsupportedTerms && <fieldset><legend className="fs-6">Termos da oferta</legend>
      {terms.map(term => <div key={uidOf(term)}>
        <p className="mb-1">{term.title ?? term.name ?? 'Termo da oferta'}</p>
        {contentOf(term) && <p className="text-break" style={{ whiteSpace: 'pre-wrap' }}>{contentOf(term)}</p>}
        {linkOf(term) && <p><a href={linkOf(term)} target="_blank" rel="noreferrer">Abrir termo</a></p>}
        {signatureOf(term) ? <p>Requer assinatura externa.</p> :
          <BillingField name={`term-${uidOf(term)}`} label="Li e aceito este termo" type="checkbox" required={term.required !== false} />}
      </div>)}
    </fieldset>}
  </BillingForm>;
}

function OrderCard({ order, name, mode, onChanged }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const [action, setAction] = useState(null);
  const uid = order?.uid ?? order?.uid_order ?? order?.uid_commercial_order;
  const state = order?.state ?? order?.status;
  const version = order?.state_version;
  const stage = order?.stage ?? order?.state_reason ?? order?.pending_reason;
  const agreement = order?.uid_billing_agreement ?? order?.billing_agreement?.uid;
  const canTransition = UUID_PATTERN.test(uid ?? '') && Number.isSafeInteger(version);
  const canAccept = canTransition && state === 'pending' && stage !== 'awaiting_signature';
  const canCancel = canTransition && ['pending', 'accepted', 'awaiting_payment', 'awaiting_signature'].includes(state);
  const submit = () => {
    const body = { action, expected_state_version: version };
    if (action === 'cancel') body.reason_code = 'customer_requested';
    mutation.submit(args => transitionOrder({ ...args, token, uid }), body, result => {
      onChanged(result?.order ?? result);
      setAction(null);
    });
  };
  return <article className="card panel p-3 mb-3">
    <h3 className="h6">{name}</h3>
    <p className="text-break">Pedido {uid ?? 'recebido'}</p>
    <p>{billingModeLabel(mode)} · {stateLabels[state] ?? state ?? 'Estado indisponível'}{stage && ` · ${stateLabels[stage] ?? stage}`}</p>
    {agreement && <p className="text-break">Acordo de cobrança {agreement}</p>}
    {state === 'completed' && <p>O provisionamento dos serviços é processado de forma assíncrona.</p>}
    <div className="d-flex gap-2">
      {canAccept && <Button size="sm" onClick={() => { mutation.clearError(); setAction('accept'); }}>Aceitar pedido</Button>}
      {canCancel && <Button size="sm" variant="outline-danger" onClick={() => { mutation.clearError(); setAction('cancel'); }}>Cancelar pedido</Button>}
    </div>
    {action && <BillingForm title={action === 'accept' ? 'Aceitar pedido' : 'Cancelar pedido'}
      submitLabel={action === 'accept' ? 'Confirmar aceite' : 'Confirmar cancelamento'}
      mutation={mutation} onClose={() => setAction(null)} onSubmit={submit}>
      <p>{action === 'accept' ? `Confirme o aceite do pedido de ${name}.` : `Confirme o cancelamento do pedido de ${name} a pedido do cliente.`}</p>
    </BillingForm>}
  </article>;
}
