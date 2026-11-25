'use client';

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ReferenceField, useAdminProfile } from './AdminReferenceFields';
import { BillingField, BillingForm, BillingRead, useBillingMutation } from './BillingUi';
import DataTable from './DataTable';
import ListToolbar from './ListToolbar';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import { listDeviceModels } from '@/lib/api/endpoints/devices';
import { createEventProtocolVariant, getEventProtocolVariant, listEventProtocolVariants } from '@/lib/api/endpoints/events';
import { requiredText, requireUid } from '@/lib/domain/technicalOperations';
import { fmtDate } from '@/lib/domain/collaborators';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

export default function EventProtocolVariants() {
  const { token } = useSession();
  const canWrite = useAdminProfile() === 'primary_admin';
  const list = useOffsetList(listEventProtocolVariants);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const detail = useKnowledgeQuery(getEventProtocolVariant, { token, uid: selected }, Boolean(selected));

  return <section className="mt-4">
    <h2 className="h5">Variantes de protocolo</h2>
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar variante por nome…"
      createLabel={canWrite && !list.error ? 'Nova variante' : undefined} onAction={() => setCreating(true)} />
    <DataTable rows={list.error ? [] : list.items} loading={list.loading} error={list.error}
      hasMore={list.hasMore} loadingMore={list.loading && list.items.length > 0} onLoadMore={list.loadMore}
      columns={[
        { key: 'name', label: 'Nome', render: row => <Button variant="link" className="p-0" onClick={() => setSelected(row.uid)}>{row.name}</Button> },
        { key: 'code', label: 'Código' },
        { key: 'model_name', label: 'Modelo de dispositivo', render: row => row.model_name || row.uid_model }
      ]} />
    {selected && <section className="card panel p-3 mt-3">
      <div className="d-flex justify-content-between gap-2">
        <h3 className="h6">{detail.data?.name ?? 'Detalhe da variante'}</h3>
        <Button size="sm" variant="outline-secondary" onClick={() => setSelected(null)}>Fechar</Button>
      </div>
      <BillingRead query={detail}>{row => <dl className="row mb-0">
        <dt className="col-sm-3">Código</dt><dd className="col-sm-9">{row.code}</dd>
        <dt className="col-sm-3">Modelo de dispositivo</dt><dd className="col-sm-9">{row.model_name || row.uid_model}</dd>
        <dt className="col-sm-3">Cadastrada em</dt><dd className="col-sm-9">{fmtDate(row.created_at)}</dd>
      </dl>}</BillingRead>
    </section>}
    {canWrite && creating && <VariantEditor onClose={() => setCreating(false)} onSaved={row => {
      setCreating(false);
      setSelected(row.uid);
      list.refresh();
      notifySuccess('Variante cadastrada.');
    }} />}
  </section>;
}

function VariantEditor({ onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const models = useOffsetList(listDeviceModels, { limit: 100 });
  return <BillingForm title="Nova variante de protocolo" mutation={mutation} onClose={onClose}
    submitDisabled={models.loading || Boolean(models.error)} onSubmit={fields => mutation.submit(args => {
      const body = {
        uid_model: requireUid(fields.uid_model, 'modelo'),
        code: requiredText(fields.code, 'o código'),
        name: requiredText(fields.name, 'o nome')
      };
      return createEventProtocolVariant({ ...args, token, body });
    }, fields, onSaved)}>
    <ReferenceField label="Modelo de dispositivo" name="uid_model" list={models} rows={models.items.filter(row => row.active)} />
    <BillingField label="Código" name="code" />
    <BillingField label="Nome" name="name" />
  </BillingForm>;
}
