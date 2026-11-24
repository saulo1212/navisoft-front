'use client';

import { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { ReferenceField } from './AdminReferenceFields';
import { BillingField, BillingForm, BillingRead, uidPattern, useBillingMutation } from './BillingUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import { getCommercialOverview, removeOrganizationBillingAccount, setOrganizationBillingAccount } from '@/lib/api/endpoints/billing';
import { getOrganization, listOrganizations } from '@/lib/api/endpoints/organizations';
import { requiredText } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

export const billingAccountLabel = row => row.payer_organization_name || row.uid_payer_organization_name ||
  row.external_legal_name || row.name || row.code || row.uid;

export function BillingAccountField({ list, ...props }) {
  if (!list.error) return <ReferenceField {...props} list={list} labelOf={billingAccountLabel} />;
  return <>
    <Alert variant="warning" className="py-2">Catálogo de contas indisponível. Use o identificador da conta.
      <Button type="button" variant="link" size="sm" onClick={list.refresh}>Tentar novamente</Button>
    </Alert>
    <BillingField {...props} pattern={uidPattern} />
  </>;
}

export default function BillingAccountManagement({ accounts, organizationUid, canManage }) {
  const { token } = useSession();
  const [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState(null);
  const [lastChange, setLastChange] = useState(null);
  const overview = useKnowledgeQuery(getCommercialOverview, { token, organizationUid, revision });
  const organizations = useOffsetList(listOrganizations, { enabled: Boolean(editor) });
  const orgName = (uid, label) => label || organizations.items.find(row => row.uid === uid)?.name || uid || 'Não informada pela API';
  const result = lastChange?.uid_organization === organizationUid ? lastChange : null;
  const accountDetails = accounts.items.find(row => row.uid === overview.data?.billing_account?.uid);
  const payerUid = result?.uid_payer_organization ?? overview.data?.billing_account?.uid_payer_organization ?? accountDetails?.uid_payer_organization;
  const originUid = result?.uid_commercial_origin_organization ?? overview.data?.billing_account?.uid_commercial_origin_organization ??
    accountDetails?.uid_commercial_origin_organization;
  const payer = useKnowledgeQuery(getOrganization, { token, uid: payerUid }, Boolean(payerUid));
  const origin = useKnowledgeQuery(getOrganization, { token, uid: originUid }, Boolean(originUid));
  const isPayer = payerUid === organizationUid;
  return <section className="card panel p-3 mb-3">
    <h2 className="h5">Vínculo financeiro da organização selecionada</h2>
    <BillingRead query={overview}>{({ billing_account: account }) => account ? <>
      <dl className="row mb-2">
        <dt className="col-sm-3">Conta</dt><dd className="col-sm-9 text-break">{account.uid}</dd>
        <dt className="col-sm-3">Pagador</dt><dd className="col-sm-9">{orgName(payerUid, accountDetails?.payer_organization_name ||
          account.payer_organization_name || account.external_legal_name || payer.data?.name ||
          (!payerUid && ({ organization: 'Organização', external: 'Pagador externo' })[account.payer_kind]))}</dd>
        <dt className="col-sm-3">Origem comercial</dt><dd className="col-sm-9">{orgName(originUid,
          accountDetails?.commercial_origin_organization_name || account.commercial_origin_organization_name || origin.data?.name)}</dd>
      </dl>
      {canManage && isPayer && <p className="mb-0 small">A organização é a titular da conta.</p>}
    </> : <p className="mb-2">A organização está sem conta vinculada.</p>}</BillingRead>
    {canManage && overview.data && !isPayer && <div className="d-flex flex-wrap gap-2">
      <Button size="sm" variant="outline-primary" onClick={() => setEditor('set')}>
        {overview.data.billing_account ? 'Transferir vínculo' : 'Vincular a uma conta'}
      </Button>
      {overview.data.billing_account && <Button size="sm" variant="outline-danger" onClick={() => setEditor('remove')}>Remover vínculo</Button>}
    </div>}
    {editor && <MembershipEditor accounts={accounts} organizations={organizations} organizationUid={organizationUid}
      removing={editor === 'remove'} transferring={Boolean(overview.data?.billing_account)} originUid={originUid}
      onClose={() => setEditor(null)} onSaved={response => {
        setLastChange(editor === 'remove' ? null : response);
        setEditor(null); setRevision(value => value + 1);
        notifySuccess(response?.changed === false ? 'O vínculo já estava atualizado.' : 'Vínculo financeiro atualizado.');
      }} />}
  </section>;
}

function MembershipEditor({ accounts, organizations, organizationUid, removing, transferring, originUid, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const knownPayers = accounts.items.filter(row => row.uid_payer_organization);
  const payerOptions = knownPayers.length ? knownPayers : organizations.items;
  const label = removing ? 'Remover vínculo' : transferring ? 'Transferir vínculo' : 'Vincular a uma conta';
  return <BillingForm title={label} submitLabel={label} mutation={mutation} onClose={onClose}
    onSubmit={fields => mutation.submit(args => {
      const reason = requiredText(fields.reason, 'o motivo');
      const confirmed = fields.confirm === 'yes';
      if (!confirmed) throw new Error('Confirme a operação.');
      const body = removing ? { reason, confirm_removal: true } : {
        uid_payer_organization: fields.uid_payer_organization,
        ...(fields.uid_commercial_origin_organization ? { uid_commercial_origin_organization: fields.uid_commercial_origin_organization } : {}),
        reason, confirm_transfer: transferring
      };
      const request = removing ? removeOrganizationBillingAccount : setOrganizationBillingAccount;
      return request({ ...args, token, organizationUid, body });
    }, fields, onSaved)}>
    {!removing && <>
      <ReferenceField label="Organização pagadora" name="uid_payer_organization" rows={payerOptions}
        list={knownPayers.length ? accounts : organizations} getValue={row => row.uid_payer_organization || row.uid}
        labelOf={row => billingAccountLabel(row)} />
      <ReferenceField label="Origem comercial" name="uid_commercial_origin_organization" list={organizations} defaultValue={originUid}
        placeholder="Usar a origem definida pela API" optional />
    </>}
    <BillingField label="Motivo" name="reason" />
    <label className="d-flex align-items-center gap-2"><input className="form-check-input m-0" name="confirm" value="yes" required type="checkbox" /> Confirmo a operação financeira</label>
  </BillingForm>;
}
