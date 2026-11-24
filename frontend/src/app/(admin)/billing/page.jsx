'use client';

import { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import NewButton from '@/components/admin/NewButton';
import DataTable from '@/components/admin/DataTable';
import BillingAccountManagement, { BillingAccountField } from '@/components/admin/BillingAccountManagement';
import { useAdminProfile } from '@/components/admin/AdminReferenceFields';
import ListToolbar from '@/components/admin/ListToolbar';
import { BillingField, BillingForm, BillingRead, BillingSessionScope, money, uidPattern, useBillingMutation } from '@/components/admin/BillingUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import { billingEntries, billingStatements, duplicateEntry, listBillingAccounts, listEntries, listStatements } from '@/lib/api/endpoints/billing';
import { useSession } from '@/lib/session/SessionContext';

const tabs = [['entries', 'Lançamentos'], ['statements', 'Demonstrativos']];
const statuses = { planned: 'Planejado', ready: 'Pronto', cancelled: 'Cancelado', billed: 'Faturado', closed: 'Fechado' };
const basis = [['monthly_unique_usage', 'Uso único mensal'], ['contracted_quantity', 'Quantidade contratada']];
const policies = [['none', 'Sem pró-rata'], ['calendar_day', 'Dias corridos']];

export default function BillingPage() {
  return <BillingSessionScope><Billing /></BillingSessionScope>;
}

function Billing() {
  const [tab, setTab] = useState('entries');
  const [accountUid, setAccountUid] = useState('');
  const { selectedOrganizationUid } = useSession();
  const primary = useAdminProfile() === 'primary_admin';
  const accounts = useOffsetList(listBillingAccounts);
  return <>
    <PageBreadcrumb title="Faturamento" subTitle1="Comercial & Financeiro" />
    <form className="card panel p-3 mb-3" onSubmit={event => {
      event.preventDefault();
      setAccountUid(String(new FormData(event.currentTarget).get('account')).trim());
    }}>
      {!accounts.error && <BillingField label="Buscar conta de faturamento" optional value={accounts.q} onChange={event => accounts.setQ(event.target.value)} />}
      <BillingAccountField label="Conta de faturamento" list={accounts} name="account" defaultValue={accountUid}
        placeholder="Todas as contas visíveis" optional />
      <div><Button type="submit" size="sm" variant="outline-primary">Aplicar filtro</Button></div>
    </form>
    {selectedOrganizationUid && <BillingAccountManagement key={selectedOrganizationUid} organizationUid={selectedOrganizationUid}
      canManage={primary} accounts={accounts} />}
    <ButtonGroup className="mb-3" aria-label="Seções de faturamento">
      {tabs.map(([key, label]) => <Button key={key} variant={key === tab ? 'primary' : 'outline-primary'}
        aria-pressed={key === tab} onClick={() => setTab(key)}>{label}</Button>)}
    </ButtonGroup>
    <BillingList key={`${tab}:${accountUid}`} tab={tab} accountUid={accountUid} accounts={accounts} />
  </>;
}

function BillingList({ tab, accountUid, accounts }) {
  const showingEntries = tab === 'entries';
  const list = useOffsetList(showingEntries ? listEntries : listStatements, { params: { accountUid } });
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [revision, setRevision] = useState(0);
  const columns = [
    { key: 'competence', label: 'Competência', render: row => <Button variant="link" onClick={() => setSelected(row.uid)}>{row.competence}</Button> },
    { key: 'uid_billing_account', label: 'Conta de faturamento' },
    ...(showingEntries ? [
      { key: 'description', label: 'Descrição' }, { key: 'due_date', label: 'Vencimento' },
      { key: 'unit_price_cents', label: 'Preço unitário', render: row => money(row.unit_price_cents, row.currency) }
    ] : [
      { key: 'entry_count', label: 'Lançamentos' },
      { key: 'total_cents', label: 'Total', render: row => money(row.total_cents, row.currency) }
    ]),
    { key: 'status', label: 'Status', render: row => statuses[row.status ?? row.state] ?? row.status ?? row.state }
  ];
  const refresh = () => {
    setRevision(value => value + 1);
    list.refresh();
  };
  return <>
    {showingEntries && <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar por serviço ou descrição…" />}
    <div className="mb-3">
      {showingEntries
        ? <NewButton label="Novo lançamento" disabled={list.loading || !!list.error} onClick={() => setCreating(true)} />
        : <Button disabled={list.loading || !!list.error} onClick={() => setCreating(true)}>Fechar competência</Button>}
    </div>
    <DataTable columns={columns} rows={list.items} loading={list.loading} error={list.error}
      hasMore={list.hasMore} onLoadMore={list.loadMore} loadingMore={list.loading && list.items.length > 0} />
    {selected && <BillingDetail key={`${selected}:${revision}`} uid={selected} showingEntries={showingEntries}
      onClose={() => setSelected(null)} onChanged={refresh} />}
    {creating && <NewBillingRecord showingEntries={showingEntries} accountUid={accountUid} accounts={accounts}
      onClose={() => setCreating(false)} onSaved={result => {
        setCreating(false); refresh(); setSelected(result?.uid ?? null);
      }} />}
  </>;
}

function NewBillingRecord({ showingEntries, accountUid, accounts, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const submit = fields => {
    const request = showingEntries ? billingEntries.create : billingStatements.create;
    const body = { ...fields };
    if (showingEntries) {
      body.unit_price_cents = Number(fields.unit_price_cents);
      body.currency = fields.currency.toUpperCase();
      if (!fields.uid_billing_agreement) delete body.uid_billing_agreement;
      if (fields.quantity !== '') body.quantity = Number(fields.quantity);
      else delete body.quantity;
    }
    mutation.submit(args => request({ ...args, token }), body, onSaved);
  };
  return <BillingForm title={showingEntries ? 'Novo lançamento' : 'Fechar competência'}
    submitLabel={showingEntries ? 'Criar lançamento' : 'Confirmar fechamento'} mutation={mutation} onClose={onClose} onSubmit={submit}>
    <BillingAccountField label="Conta de faturamento" name="uid_billing_account" list={accounts} defaultValue={accountUid} />
    <BillingField label="Competência" name="competence" type="month" />
    {showingEntries ? <>
      <BillingField label="Organização consumidora (UUID)" name="uid_organization" pattern={uidPattern} />
      <BillingField label="Acordo de cobrança (UUID)" name="uid_billing_agreement" pattern={uidPattern} optional />
      <BillingField label="Código do serviço" name="service_code" />
      <BillingField label="Descrição" name="description" />
      <BillingField label="Início da referência" name="reference_from" type="date" />
      <BillingField label="Fim da referência" name="reference_to" type="date" />
      <BillingField label="Vencimento" name="due_date" type="date" />
      <BillingField label="Quantidade" name="quantity" type="number" min="0" step="any" optional defaultValue="1" />
      <BillingField label="Preço unitário em centavos" name="unit_price_cents" type="number" min="0" step="1" />
      <BillingField label="Moeda" name="currency" pattern="[A-Za-z]{3}" defaultValue="BRL" />
      <BillingField label="Base de cálculo" name="billing_basis" options={basis} />
      <BillingField label="Pró-rata" name="proration_policy" options={policies} />
    </> : <p>O fechamento consolida os lançamentos da conta na competência informada.</p>}
  </BillingForm>;
}

function BillingDetail({ uid, showingEntries, onClose, onChanged }) {
  const { token } = useSession();
  const [dialog, setDialog] = useState(null);
  const mutation = useBillingMutation();
  const query = useKnowledgeQuery(showingEntries ? billingEntries.get : billingStatements.get, { token, uid });
  const change = (request, body) => mutation.submit(args => request({ ...args, token, uid }), body, onChanged, onClose);
  return <section className="card panel p-4 my-3">
    <div className="d-flex justify-content-between gap-2">
      <h2 className="h5">{showingEntries ? 'Detalhes do lançamento' : 'Detalhes do demonstrativo'}</h2>
      <Button variant="outline-secondary" size="sm" onClick={onClose}>Fechar detalhes</Button>
    </div>
    <BillingRead query={query}>{row => <>
      <dl className="mt-3">
        <dt>Conta de faturamento</dt><dd className="text-break">{row.uid_billing_account}</dd>
        <dt>Competência</dt><dd>{row.competence}</dd>
        <dt>Status</dt><dd>{statuses[row.status ?? row.state] ?? row.status ?? row.state}</dd>
        {showingEntries ? <>
          <dt>Descrição</dt><dd>{row.description}</dd>
          <dt>Serviço</dt><dd>{row.service_code}</dd>
          <dt>Organização consumidora</dt><dd className="text-break">{row.uid_organization}</dd>
          <dt>Referência</dt><dd>{row.reference_from} a {row.reference_to}</dd>
          <dt>Vencimento</dt><dd>{row.due_date}</dd>
          <dt>Quantidade</dt><dd>{row.quantity ?? '—'}</dd>
          <dt>Preço unitário</dt><dd>{money(row.unit_price_cents, row.currency)}</dd>
          <dt>Valor calculado</dt><dd>{money(row.calculation_snapshot?.amount_cents, row.currency)}</dd>
          {row.uid_billing_agreement && <><dt>Acordo de cobrança</dt><dd className="text-break">{row.uid_billing_agreement}</dd></>}
        </> : <>
          <dt>Total</dt><dd>{money(row.snapshot?.total_cents ?? row.total_cents, row.currency)}</dd>
          <dt>Fechamento</dt><dd>{row.closed_at ? new Date(row.closed_at).toLocaleString('pt-BR') : '—'}</dd>
        </>}
      </dl>
      {!showingEntries && <DataTable rows={row.items ?? []} rowKey={item => item.uid_entry} columns={[
        { key: 'description', label: 'Lançamento' }, { key: 'uid_organization', label: 'Organização consumidora' },
        { key: 'quantity', label: 'Quantidade' }, { key: 'due_date', label: 'Vencimento' },
        { key: 'amount_cents', label: 'Valor', render: item => money(item.amount_cents, row.currency) }
      ]} />}
      {showingEntries && !row.uid_statement && ['planned', 'ready'].includes(row.status) &&
        <div className="d-flex flex-wrap gap-2">
          {Object.entries({ edit: 'Editar lançamento', duplicate: 'Duplicar', cancel: 'Cancelar lançamento' }).map(([key, label]) =>
            <Button key={key} size="sm" variant={key === 'cancel' ? 'outline-danger' : 'outline-primary'}
              onClick={() => { mutation.clearError(); setDialog(key); }}>{label}</Button>)}
        </div>}
      {dialog === 'edit' && <BillingForm title="Editar lançamento" mutation={mutation} onClose={() => setDialog(null)}
        onSubmit={fields => change(billingEntries.patch, {
          description: fields.description, due_date: fields.due_date, ...(fields.quantity !== '' ? { quantity: Number(fields.quantity) } : {})
        })}>
        <BillingField label="Descrição" name="description" defaultValue={row.description} />
        <BillingField label="Vencimento" name="due_date" type="date" defaultValue={row.due_date} />
        <BillingField label="Quantidade" name="quantity" type="number" min="0" step="any" optional defaultValue={row.quantity ?? ''} />
      </BillingForm>}
      {dialog === 'duplicate' && <BillingForm title="Duplicar lançamento" submitLabel="Duplicar" mutation={mutation}
        onClose={() => setDialog(null)} onSubmit={fields => change(duplicateEntry, {
          first_competence: fields.first_competence, count: Number(fields.count),
          due_day: Number(fields.due_day), copy_quantity: fields.copy_quantity === 'on'
        })}>
        <BillingField label="Primeira competência" name="first_competence" type="month" />
        <BillingField label="Número de competências" name="count" type="number" min="1" max="24" defaultValue="1" />
        <BillingField label="Dia de vencimento" name="due_day" type="number" min="1" max="28" defaultValue="10" />
        {row.billing_basis !== 'monthly_unique_usage' && <BillingField label="Copiar quantidade" name="copy_quantity" type="checkbox" />}
      </BillingForm>}
      {dialog === 'cancel' && <BillingForm title="Cancelar lançamento" submitLabel="Confirmar cancelamento" mutation={mutation}
        onClose={() => setDialog(null)} onSubmit={() => change(billingEntries.patch, { status: 'cancelled' })}>
        <p>Confirme o cancelamento de {row.description} na competência {row.competence}.</p>
      </BillingForm>}
    </>}</BillingRead>
  </section>;
}
