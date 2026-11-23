'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Alert, Button, Table } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import ListToolbar from '@/components/admin/ListToolbar';
import { BillingField, BillingForm, BillingRead, BillingSessionScope, billingModeLabel, money, useBillingMutation } from '@/components/admin/BillingUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import { billingPlans, getPlanCapabilities, quotePlan, setPlanCapabilities } from '@/lib/api/endpoints/billing';
import { useSession } from '@/lib/session/SessionContext';

const modes = [['postpaid', 'Pós-pago'], ['prepaid', 'Pré-pago']];
const policies = [['', 'Selecione'], ['apply_negative', 'Aplicar ajuste negativo'], ['floor_at_zero', 'Limitar a zero']];

export default function PlansPage() {
  return <BillingSessionScope><Plans /></BillingSessionScope>;
}

function Plans() {
  const list = useOffsetList(billingPlans.list);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const columns = [
    { key: 'name', label: 'Plano', render: row => <Button variant="link" onClick={() => setSelected(row.uid)}>{row.name}</Button> },
    { key: 'code', label: 'Código' },
    { key: 'billing_mode', label: 'Cobrança', render: row => billingModeLabel(row.billing_mode) },
    { key: 'active', label: 'Status', render: row => row.active ? 'Ativo' : 'Inativo' }
  ];
  return <>
    <PageBreadcrumb title="Planos de cobrança" subTitle1="Comercial & Financeiro" />
    <ListToolbar
      q={list.q}
      onChangeQ={list.setQ}
      placeholder="Buscar por nome ou código…"
      actionLabel="Novo plano"
      actionDisabled={list.loading || !!list.error}
      onAction={() => setCreating(true)}
    />
    <DataTable columns={columns} rows={list.items} loading={list.loading} error={list.error}
      hasMore={list.hasMore} onLoadMore={list.loadMore} loadingMore={list.loading && list.items.length > 0} />
    {creating && <PlanEditor onClose={() => setCreating(false)} onSaved={result => {
      setCreating(false); list.refresh(); setSelected(result?.uid ?? null);
    }} />}
    {selected && <PlanDetail key={selected} uid={selected} onClose={() => setSelected(null)} onChange={list.refresh} />}
  </>;
}

function PlanDetail({ uid, onClose, onChange }) {
  const { token } = useSession();
  const [revision, setRevision] = useState(0);
  return <PlanDetailsContent key={revision} uid={uid} token={token} onClose={onClose} onChange={onChange}
    refresh={() => { setRevision(value => value + 1); onChange(); }} />;
}

function PlanDetailsContent({ uid, token, onClose, onChange, refresh }) {
  const [dialog, setDialog] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const plan = useKnowledgeQuery(billingPlans.get, { token, uid });
  const capabilities = useKnowledgeQuery(getPlanCapabilities, { token, uid }, Boolean(plan.data));
  const quote = useKnowledgeQuery(quotePlan, { token, uid, quantity }, quantity !== null);
  const mutation = useBillingMutation();
  return <section className="card panel p-4 my-3">
    <div className="d-flex justify-content-between gap-2">
      <h2 className="h5">Detalhes do plano</h2>
      <Button variant="outline-secondary" size="sm" onClick={onClose}>Fechar detalhes</Button>
    </div>
    <BillingRead query={plan}>{data => <>
      <h3 className="h6 mt-3">{data.name}</h3>
      <p>{data.description}</p>
      <p>{billingModeLabel(data.billing_mode)} · {data.currency} · {data.unit_label} · {data.active ? 'Ativo' : 'Inativo'}</p>
      <dl>
        <dt>Identificador do plano</dt><dd className="text-break">{data.uid}</dd>
        {data.uid_current_version && <><dt>Versão publicada</dt><dd className="text-break">{data.uid_current_version}</dd></>}
      </dl>
      <Table responsive size="sm">
        <thead><tr><th>De</th><th>Até</th><th>Preço unitário</th></tr></thead>
        <tbody>{data.tiers?.map(tier => <tr key={tier.uid ?? tier.quantity_from}>
          <td>{tier.quantity_from}</td><td>{tier.quantity_to ?? 'Sem limite'}</td><td>{money(tier.unit_price_cents, data.currency)}</td>
        </tr>)}</tbody>
      </Table>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button size="sm" onClick={() => setDialog('edit')}>Editar plano</Button>
        <Button size="sm" variant="outline-danger" onClick={() => { mutation.clearError(); setDialog('delete'); }}>Excluir plano</Button>
      </div>
      <BillingRead query={capabilities}>{result => <>
        <p>Capacidades padrão {result.capabilities?.join(', ') || '—'}</p>
        <p className="small">As capacidades padrão são usadas na publicação de versões do plano. <Link href="/platform-capabilities">Consultar catálogo</Link></p>
        <Button size="sm" variant="outline-primary" onClick={() => { mutation.clearError(); setDialog('capabilities'); }}>Editar capacidades</Button>
        {dialog === 'capabilities' && <BillingForm title="Editar capacidades" mutation={mutation} onClose={() => setDialog(null)}
          onSubmit={values => mutation.submit(args => setPlanCapabilities({ ...args, token, uid }),
            { capabilities: [...new Set(values.capabilities.split(',').map(code => code.trim()).filter(Boolean))] }, refresh)}>
          <BillingField label="Códigos de capacidade separados por vírgula" name="capabilities" optional defaultValue={result.capabilities?.join(', ')} />
        </BillingForm>}
      </>}</BillingRead>
      <form className="mt-3" onSubmit={event => {
        event.preventDefault();
        setQuantity(Number(new FormData(event.currentTarget).get('quantity')));
      }}>
        <BillingField label="Quantidade para cotação" name="quantity" type="number" min="1" step="1" defaultValue="1" />
        <Button type="submit" variant="outline-primary" size="sm">Simular cobrança</Button>
      </form>
      <BillingRead query={quote}>{result => <p className="mt-3 mb-0">{result.quantity} unidade(s) · {money(result.total_cents, result.currency)}</p>}</BillingRead>
      {dialog === 'edit' && <PlanEditor plan={data} onClose={() => setDialog(null)} onSaved={refresh} />}
      {dialog === 'delete' && <BillingForm title="Excluir plano" submitLabel="Confirmar exclusão" mutation={mutation}
        onClose={() => setDialog(null)} onSubmit={() => mutation.run(signal => billingPlans.remove({ token, uid, signal }), () => { onClose(); onChange(); })}>
        <p>Confirme a exclusão do plano {data.name}.</p>
      </BillingForm>}
    </>}</BillingRead>
  </section>;
}

function PlanEditor({ plan, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const [error, setError] = useState(null);
  const [tiers, setTiers] = useState(() => plan?.tiers?.length ? plan.tiers.map((tier, index) => ({ ...tier, key: index })) : [{ key: 0, quantity_from: 1 }]);
  const submit = fields => {
    setError(null);
    const brackets = tiers.map(({ key }) => ({
      quantity_from: Number(fields[`from-${key}`]),
      quantity_to: fields[`to-${key}`] === '' ? null : Number(fields[`to-${key}`]),
      unit_price_cents: Number(fields[`price-${key}`])
    }));
    if (brackets.some((tier, index) => (tier.quantity_to !== null && tier.quantity_to < tier.quantity_from) ||
      (index > 0 && (brackets[index - 1].quantity_to === null || tier.quantity_from !== brackets[index - 1].quantity_to + 1)))) {
      setError('Use faixas consecutivas, em ordem crescente, sem lacunas ou sobreposição.');
      return;
    }
    const body = {
      code: fields.code.trim(), name: fields.name.trim(), description: fields.description.trim(),
      billing_mode: fields.billing_mode, unit_label: fields.unit_label.trim(), active: fields.active === 'on',
      negative_adjustment_policy: fields.negative_adjustment_policy, tiers: brackets
    };
    const request = plan ? billingPlans.update : billingPlans.create;
    mutation.submit(args => request({ ...args, token, uid: plan?.uid }), body, onSaved);
  };
  return <BillingForm title={plan ? 'Editar plano' : 'Novo plano'} mutation={mutation} onClose={onClose} onSubmit={submit}>
    {error && <Alert variant="danger">{error}</Alert>}
    <BillingField label="Código" name="code" defaultValue={plan?.code} />
    <BillingField label="Nome" name="name" defaultValue={plan?.name} />
    <BillingField label="Descrição" name="description" optional defaultValue={plan?.description} />
    <BillingField label="Modalidade" name="billing_mode" options={modes} defaultValue={plan?.billing_mode} />
    <BillingField label="Unidade" name="unit_label" defaultValue={plan?.unit_label} />
    <BillingField label="Política de ajuste negativo" name="negative_adjustment_policy" options={policies} defaultValue={plan?.negative_adjustment_policy ?? ''} />
    <BillingField label="Ativo" name="active" type="checkbox" defaultChecked={plan?.active ?? true} />
    {tiers.map((tier, index) => <fieldset className="border rounded p-2 mb-2" key={tier.key}>
      <legend className="float-none w-auto px-1 fs-6">Faixa {index + 1}</legend>
      <BillingField label="Quantidade inicial" name={`from-${tier.key}`} type="number" min="1" step="1" defaultValue={tier.quantity_from} />
      <BillingField label="Quantidade final (em branco para sem limite)" name={`to-${tier.key}`} type="number" min="1" step="1" optional defaultValue={tier.quantity_to ?? ''} />
      <BillingField label="Preço unitário em centavos" name={`price-${tier.key}`} type="number" min="0" step="1" defaultValue={tier.unit_price_cents} />
      {tiers.length > 1 && <Button size="sm" variant="outline-danger" onClick={() => setTiers(tiers.filter(row => row.key !== tier.key))}>Remover faixa</Button>}
    </fieldset>)}
    <Button size="sm" variant="outline-primary" onClick={() => setTiers([...tiers, { key: tiers.at(-1).key + 1 }])}>Adicionar faixa</Button>
  </BillingForm>;
}
