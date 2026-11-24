'use client';

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ReferenceField, useAdminProfile } from './AdminReferenceFields';
import { BillingField, BillingForm, BillingRead, useBillingMutation } from './BillingUi';
import DataTable from './DataTable';
import ListToolbar from './ListToolbar';
import { OperationField } from './OperationalUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import {
  getEventSignalMappings, getEventTechnicalMap, listEventModels, listEventProtocolVariants, listEventTechnicalMaps,
  publishEventTechnicalMap, saveEventTechnicalMap, setEventSignalMappings
} from '@/lib/api/endpoints/events';
import { normalizeList } from '@/lib/api/http';
import { readJson, technicalMapBody, uniqueRows } from '@/lib/domain/adminConfiguration';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const mappingFields = ['signal_code', 'strategy', 'state', 'parameters', 'active', 'end_codes', 'duration_unit', 'duration_field', 'duration_scale', 'duration_offset_seconds'];
const keepMappingFields = row => Object.fromEntries(mappingFields.filter(key => row[key] != null).map(key => [key, row[key]]));
const strategyLabel = { instant: 'Instantâneo', duration: 'Duração', paired: 'Início e fim' };

export function EventSignalMappings({ uid, canWrite }) {
  const { token } = useSession();
  const [revision, setRevision] = useState(0);
  const [editing, setEditing] = useState(false);
  const query = useKnowledgeQuery(getEventSignalMappings, { token, uid, revision });
  const mutation = useBillingMutation();
  const rows = normalizeList(query.data).items;
  return <section className="mt-4">
    <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
      <h6 className="mb-0">Mapeamentos de sinais</h6>
      {canWrite && !query.loading && !query.error && <Button size="sm" variant="outline-primary"
        onClick={() => { mutation.clearError(); setEditing(true); }}>Editar sinais</Button>}
    </div>
    <DataTable rows={rows} rowKey={row => row.signal_code} loading={query.loading}
      error={query.error ? query.error.message : null} emptyMessage="Nenhum sinal mapeado." columns={[
        { key: 'signal_code', label: 'Sinal' },
        { key: 'strategy', label: 'Estratégia', render: row => strategyLabel[row.strategy] ?? row.strategy },
        { key: 'state', label: 'Estado' },
        { key: 'active', label: 'Ativo', render: row => row.active ? 'Sim' : 'Não' }
      ]} />
    {editing && <BillingForm title="Editar mapeamentos de sinais" mutation={mutation} onClose={() => setEditing(false)}
      onSubmit={fields => mutation.submit(args => {
        const items = uniqueRows(readJson(fields.items, 'sinais', 'array'), 'signal_code', 'códigos de sinal');
        if (items.some(row => !Object.hasOwn(strategyLabel, row.strategy))) throw new Error('Use uma estratégia válida para cada sinal.');
        return setEventSignalMappings({ ...args, token, uid, body: { items: items.map(keepMappingFields) } });
      }, fields, () => { setEditing(false); setRevision(value => value + 1); notifySuccess('Sinais atualizados.'); })}>
      <p>Salvar substitui a configuração do modelo. Sinais omitidos são desativados. Use <code>instant</code>, <code>duration</code> ou <code>paired</code> em <code>strategy</code>.</p>
      <OperationField label="Sinais (JSON)" name="items" multiline required defaultValue={JSON.stringify(rows.map(keepMappingFields), null, 2)} />
      {!rows.length && <p className="small text-body-secondary"><code>{'{"signal_code":"ignition_on","strategy":"instant","state":"on","parameters":{},"active":true}'}</code></p>}
    </BillingForm>}
  </section>;
}

export function EventTechnicalMaps() {
  const { token } = useSession();
  const canWrite = useAdminProfile() === 'primary_admin';
  const list = useOffsetList(listEventTechnicalMaps);
  const [selected, setSelected] = useState(null);
  const [revision, setRevision] = useState(0);
  const [dialog, setDialog] = useState(null);
  const query = useKnowledgeQuery(getEventTechnicalMap, { token, uid: selected, revision }, Boolean(selected));
  const draft = query.data?.revisions?.find(row => row.status === 'draft');
  const saved = response => {
    setDialog(null);
    if (response?.uid || response?.uid_map) setSelected(response.uid_map ?? response.uid);
    setRevision(value => value + 1);
    list.refresh();
  };
  return <section className="mt-4">
    <h2 className="h5">Mapas técnicos de eventos</h2>
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar mapa por nome…"
      createLabel={canWrite && !list.error ? 'Novo mapa técnico' : undefined} onAction={() => setDialog('create')} />
    <DataTable columns={[
      { key: 'name', label: 'Nome', render: row => <Button variant="link" className="p-0" onClick={() => setSelected(row.uid)}>{row.name}</Button> },
      { key: 'code', label: 'Código' }, { key: 'draft_revision', label: 'Rascunho' },
      { key: 'published_revision', label: 'Publicada' }
    ]} rows={list.error ? [] : list.items} loading={list.loading} error={list.error}
      hasMore={list.hasMore} onLoadMore={list.loadMore} loadingMore={list.loading && list.items.length > 0} />
    {selected && <section className="card panel p-3 mt-3">
      <div className="d-flex justify-content-between gap-2">
        <h3 className="h6">{query.data?.name || 'Detalhe do mapa'}</h3>
        <Button size="sm" variant="outline-secondary" onClick={() => setSelected(null)}>Fechar</Button>
      </div>
      <BillingRead query={query}>{row => <>
        <div className="d-flex gap-2 my-3">
          {canWrite && <Button size="sm" variant="outline-primary" onClick={() => setDialog('edit')}>{draft ? 'Editar rascunho' : 'Criar revisão'}</Button>}
          {canWrite && draft && <Button size="sm" onClick={() => setDialog('publish')}>Publicar revisão {draft.revision}</Button>}
        </div>
        <DataTable rows={row.revisions ?? []} rowKey={item => item.uid} columns={[
          { key: 'revision', label: 'Versão' },
          { key: 'status', label: 'Estado', render: item => ({ draft: 'Rascunho', published: 'Publicada', superseded: 'Substituída' })[item.status] || item.status },
          { key: 'rules', label: 'Sinais', render: item => item.rules?.map(rule => rule.source_code).join(', ') || '—' },
          { key: 'model_bindings', label: 'Variantes', render: item => item.model_bindings?.map(binding => binding.protocol_variant).join(', ') || '—' }
        ]} />
      </>}</BillingRead>
    </section>}
    {canWrite && (dialog === 'create' || (dialog === 'edit' && query.data)) &&
      <TechnicalMapEditor row={dialog === 'edit' ? query.data : null} onClose={() => setDialog(null)}
        onSaved={response => { saved(response); notifySuccess('Rascunho salvo.'); }} />}
    {canWrite && dialog === 'publish' && draft &&
      <PublishMap uid={selected} draft={draft} onClose={() => setDialog(null)}
        onSaved={() => { saved(); notifySuccess('Revisão publicada.'); }} />}
  </section>;
}

function PublishMap({ uid, draft, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  return <BillingForm title={`Publicar revisão ${draft.revision}`} submitLabel="Publicar" mutation={mutation} onClose={onClose}
    onSubmit={() => mutation.submit(args => publishEventTechnicalMap({ ...args, token, uid }), {}, onSaved)}>
    <p>A publicação aplica a revisão às variantes vinculadas na vigência informada.</p>
  </BillingForm>;
}

const variantLabel = row => `${row.model_name || row.uid_model} · ${row.code}`;
const editableRule = ({ source_code, uid_event_model, strategy, end_codes, duration_field, duration_unit, duration_scale, duration_offset_seconds, parameters, state }) =>
  Object.fromEntries(Object.entries({ source_code, uid_event_model, strategy, end_codes, duration_field, duration_unit,
    duration_scale, duration_offset_seconds, parameters, state }).filter(([, value]) => value != null));

function TechnicalMapEditor({ row, onClose, onSaved }) {
  const { token } = useSession();
  const mutation = useBillingMutation();
  const variants = useOffsetList(listEventProtocolVariants, { limit: 100 });
  const models = useOffsetList(listEventModels, { limit: 100 });
  const base = row?.revisions?.find(item => item.status === 'draft') ??
    [...(row?.revisions ?? [])].filter(item => item.status === 'published').sort((a, b) => b.revision - a.revision)[0];
  const [bindings, setBindings] = useState(() => (base?.model_bindings ?? []).map(item => ({ ...item, key: crypto.randomUUID() })));
  const [rules, setRules] = useState(() => JSON.stringify((base?.rules ?? []).map(editableRule), null, 2));
  const [ruleModel, setRuleModel] = useState('');
  const [ruleSource, setRuleSource] = useState('');
  const [appendError, setAppendError] = useState(null);
  const update = (key, patch) => setBindings(rows => rows.map(item => item.key === key ? { ...item, ...patch } : item));
  function appendRule() {
    try {
      const items = readJson(rules, 'regras', 'array');
      items.push({ source_code: ruleSource.trim(), uid_event_model: ruleModel, strategy: 'instant' });
      setRules(JSON.stringify(items, null, 2)); setRuleSource(''); setRuleModel(''); setAppendError(null);
    } catch (err) { setAppendError(err.message); }
  }
  return <BillingForm title={row ? 'Editar rascunho do mapa' : 'Novo mapa técnico'} submitLabel="Salvar rascunho"
    mutation={mutation} onClose={onClose} submitDisabled={!!variants.error}
    onSubmit={fields => mutation.submit(args => saveEventTechnicalMap({
      ...args, token, uid: row?.uid, body: technicalMapBody(fields, bindings, variants.items)
    }), { ...fields, bindings }, onSaved)}>
    <BillingField label="Código" name="code" defaultValue={row?.code} />
    <BillingField label="Nome" name="name" defaultValue={row?.name} />
    <BillingField label="Ativo" name="active" type="checkbox" defaultChecked={row?.active ?? true} />
    <fieldset className="border rounded p-3 mb-3">
      <legend className="fs-6">Adicionar regra de sinal</legend>
      <BillingField label="Código de origem" optional value={ruleSource} onChange={event => setRuleSource(event.target.value)} />
      <ReferenceField label="Modelo de evento" list={models} optional value={ruleModel} onChange={event => setRuleModel(event.target.value)} />
      {appendError && <p className="text-danger" role="alert">{appendError}</p>}
      <Button type="button" size="sm" variant="outline-secondary" disabled={!ruleSource.trim() || !ruleModel} onClick={appendRule}>Adicionar regra</Button>
    </fieldset>
    <OperationField label="Regras do mapa (JSON)" name="rules" multiline required value={rules} onChange={event => setRules(event.target.value)} />
    <p className="small text-body-secondary">Informe a vigência em ISO 8601 com fuso, por exemplo <code>2026-11-24T00:00:00-03:00</code>.</p>
    {bindings.map(binding => {
      const variant = variants.items.find(item => binding.variantUid ? item.uid === binding.variantUid
        : item.uid_model === binding.uid_model && item.code === binding.protocol_variant);
      return <fieldset key={binding.key} className="border rounded p-3 mb-3">
        <legend className="fs-6">Variante do modelo</legend>
        <ReferenceField label="Modelo e variante" list={variants} labelOf={variantLabel}
          value={variant?.uid ?? ''} onChange={event => {
            const item = variants.items.find(option => option.uid === event.target.value);
            update(binding.key, { variantUid: item?.uid, uid_model: item?.uid_model, protocol_variant: item?.code });
          }} />
        <BillingField label="Início da vigência" value={binding.valid_from} onChange={event => update(binding.key, { valid_from: event.target.value })} />
        <BillingField label="Fim da vigência" value={binding.valid_until ?? ''} optional onChange={event => update(binding.key, { valid_until: event.target.value })} />
        <Button type="button" size="sm" variant="outline-danger" onClick={() => setBindings(rows => rows.filter(item => item.key !== binding.key))}>Remover vínculo</Button>
      </fieldset>;
    })}
    <Button type="button" size="sm" variant="outline-primary"
      onClick={() => setBindings(rows => [...rows, { key: crypto.randomUUID(), valid_from: '', valid_until: '' }])}>Adicionar variante</Button>
  </BillingForm>;
}
