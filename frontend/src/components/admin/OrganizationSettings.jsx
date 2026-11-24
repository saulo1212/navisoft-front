'use client';

import { useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import FormModal from './FormModal';
import StatusBadge from './StatusBadge';
import { useOperationalAction } from './OperationalUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import {
  getOrganizationAccessPeriods, getOrganizationBranding, getOrganizationLifecycle, listOrganizationTimezones,
  patchOrganizationBranding, patchOrganizationLifecycle, updateOrganizationAccessPeriods
} from '@/lib/api/endpoints/organizations';
import { errorMessage } from '@/lib/api/errors';
import { normalizeList } from '@/lib/api/http';
import { accessDays, accessModes, accessPeriodsBody, brandingFields, brandingPatch, brandingValue, lifecycleStates } from '@/lib/domain/organizations';
import { requiredText } from '@/lib/domain/technicalOperations';
import { notifySuccess } from '@/lib/ui/toast';

function SettingsCard({ title, query, editLabel, onEdit, children }) {
  return <Card className="panel h-100">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
        <h5 className="mb-0">{title}</h5>
        {query.data && onEdit && <Button type="button" size="sm" variant="outline-primary" onClick={onEdit}>{editLabel}</Button>}
      </div>
      {query.loading && <Spinner animation="border" size="sm" role="status" aria-label={`Carregando ${title}`} />}
      {query.error && <Alert variant="warning" className="mb-0">{errorMessage(query.error)}</Alert>}
      {query.data && children}
    </Card.Body>
  </Card>;
}

export function OrganizationLifecycle({ token, uid, includeInactive, editable, onSaved }) {
  const args = { token, uid };
  const query = useKnowledgeQuery(getOrganizationLifecycle, { ...args, includeInactive });
  const [draft, setDraft] = useState(null);
  const action = useOperationalAction();

  function submit(event) {
    event.preventDefault();
    void action.run(signal => patchOrganizationLifecycle({
      ...args, state: draft.state, reason: requiredText(draft.reason, 'o motivo da alteração'), signal
    }), () => {
      setDraft(null);
      notifySuccess('Situação da organização alterada.');
      void onSaved();
    });
  }

  const status = query.data;
  return <>
    <SettingsCard title="Ciclo de vida" query={query} editLabel="Alterar situação"
      onEdit={editable ? () => { action.clearError(); setDraft({ state: status.state, reason: '' }); } : undefined}>
      {status && <>
        <StatusBadge status={status.state} label={lifecycleStates[status.state] ?? status.state} />
        {status.effective_state && status.effective_state !== status.state &&
          <p className="mt-2 mb-0 small">Situação efetiva: {lifecycleStates[status.effective_state] ?? status.effective_state}</p>}
        {status.reason && <p className="text-body-secondary small mb-0 mt-2">{status.reason}</p>}
      </>}
    </SettingsCard>
    {draft && <FormModal show title="Alterar situação da organização" onHide={() => setDraft(null)}
      onSubmit={submit} error={action.error} submitting={action.busy} submitDisabled={draft.state === status?.state}>
      <Form.Group controlId="organization-lifecycle-state" className="mb-3">
        <Form.Label>Situação</Form.Label>
        <Form.Select value={draft.state} onChange={event => setDraft({ ...draft, state: event.target.value })} disabled={action.busy}>
          {Object.entries(lifecycleStates).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="organization-lifecycle-reason">
        <Form.Label>Motivo</Form.Label>
        <Form.Control as="textarea" rows={2} required value={draft.reason} disabled={action.busy}
          onChange={event => setDraft({ ...draft, reason: event.target.value })} />
      </Form.Group>
    </FormModal>}
  </>;
}

export function OrganizationAccessPeriods({ token, uid, editable }) {
  const [revision, setRevision] = useState(0);
  const [draft, setDraft] = useState(null);
  const query = useKnowledgeQuery(getOrganizationAccessPeriods, { token, uid, revision });
  const zones = useKnowledgeQuery(listOrganizationTimezones, { token }, Boolean(draft));
  const action = useOperationalAction();

  function setDay(day, windows) {
    setDraft(current => ({ ...current, week: { ...current.week, [day]: windows } }));
  }
  function submit(event) {
    event.preventDefault();
    void action.run(signal => updateOrganizationAccessPeriods({ token, uid, body: accessPeriodsBody(draft), signal }), () => {
      setDraft(null);
      setRevision(value => value + 1);
      notifySuccess('Horários de acesso atualizados.');
    });
  }

  return <>
    <SettingsCard title="Horários de acesso" query={query} editLabel="Editar horários" onEdit={editable ? () => {
      action.clearError();
      const { mode, timezone, week } = query.data;
      setDraft({ mode, timezone, week });
    } : undefined}>
      {query.data && <>
        <p className="small mb-2">{accessModes[query.data.mode] ?? query.data.mode} · {query.data.timezone}</p>
        <dl className="row small mb-0">
          {Object.entries(accessDays).map(([day, label]) => (
            <div key={day} className="col-sm-6 mb-2">
              <dt>{label}</dt>
              <dd className="mb-0">{query.data.week?.[day]?.map(({ start, end }) => `${start}–${end}`).join(', ') || 'Sem intervalos'}</dd>
            </div>
          ))}
        </dl>
      </>}
    </SettingsCard>
    {draft && <FormModal show title="Horários de acesso" onHide={() => setDraft(null)} onSubmit={submit}
      submitting={action.busy} error={action.error}>
      <fieldset disabled={action.busy}>
        <div className="row g-2 mb-3">
          <Form.Group controlId="access-period-mode" className="col-sm-5">
            <Form.Label>Modo</Form.Label>
            <Form.Select value={draft.mode} onChange={event => setDraft({ ...draft, mode: event.target.value })}>
              {Object.entries(accessModes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="access-period-timezone" className="col-sm-7">
            <Form.Label>Fuso horário</Form.Label>
            <Form.Control value={draft.timezone} list="organization-timezones" required
              onChange={event => setDraft({ ...draft, timezone: event.target.value })} />
            <datalist id="organization-timezones">
              {normalizeList(zones.data).items.filter(zone => zone.active !== false).map(zone => <option key={zone.code} value={zone.code} />)}
            </datalist>
          </Form.Group>
        </div>
        <p className="small text-body-secondary">Use HH:mm. Para atravessar a meia-noite, encerre em 24:00 e adicione outro intervalo no dia seguinte.</p>
        {Object.entries(accessDays).map(([day, label]) => {
          const windows = draft.week[day] ?? [];
          return <fieldset key={day} className="border rounded p-2 mb-2">
            <legend className="fs-6 mb-2">{label}</legend>
            {windows.map((range, index) => <div className="d-flex gap-2 mb-2" key={index}>
              {['start', 'end'].map(field => <Form.Control key={field} type="text" maxLength={5} required
                aria-label={`${field === 'start' ? 'Início' : 'Fim'} do intervalo ${index + 1} de ${label}`}
                value={range[field]} onChange={event => setDay(day, windows.map((row, i) =>
                  i === index ? { ...row, [field]: event.target.value } : row))} />)}
              <Button type="button" size="sm" variant="outline-danger" onClick={() => setDay(day, windows.filter((_, i) => i !== index))}>
                Remover
              </Button>
            </div>)}
            <Button type="button" size="sm" variant="outline-secondary" onClick={() => setDay(day, [...windows, { start: '', end: '' }])}>Adicionar intervalo</Button>
          </fieldset>;
        })}
      </fieldset>
    </FormModal>}
  </>;
}

export function OrganizationBranding({ token, uid, editable }) {
  const [revision, setRevision] = useState(0);
  const [draft, setDraft] = useState(null);
  const query = useKnowledgeQuery(getOrganizationBranding, { token, uid, revision });
  const action = useOperationalAction();
  const theme = query.data?.theme;

  function save(value) {
    void action.run(signal => patchOrganizationBranding({
      token, uid, theme: brandingPatch({ [draft.field]: value }), signal
    }), () => {
      setDraft(null);
      setRevision(previous => previous + 1);
      notifySuccess(value === null ? 'Herança da cor restaurada.' : 'Cor atualizada.');
    });
  }

  return <>
    <SettingsCard title="Identidade visual" query={query} editLabel="Editar cores" onEdit={editable ? () => {
      action.clearError();
      setDraft({ field: 'primary', color: brandingValue(theme, 'primary') ?? '' });
    } : undefined}>
      <div className="row g-2">
        {brandingFields.map(([path, label]) => {
          const color = brandingValue(theme, path);
          return <div className="col-12 col-sm-6" key={path}>
            <div className="d-flex align-items-center gap-2 small">
              <span className="d-inline-block rounded border flex-shrink-0" style={{ width: 16, height: 16, backgroundColor: color }} aria-hidden="true" />
              <span>{label} <code>{color ?? '—'}</code></span>
            </div>
          </div>;
        })}
      </div>
    </SettingsCard>
    {draft && <FormModal show title="Editar cor do tema" onHide={() => setDraft(null)} onSubmit={event => {
      event.preventDefault();
      save(draft.color.trim());
    }} submitting={action.busy} error={action.error} footerExtra={
      <Button type="button" variant="outline-secondary" disabled={action.busy} onClick={() => save(null)}>Restaurar herança</Button>
    }>
      <fieldset disabled={action.busy}>
        <Form.Group controlId="organization-theme-token" className="mb-3">
          <Form.Label>Elemento</Form.Label>
          <Form.Select value={draft.field} onChange={event => setDraft({
            field: event.target.value, color: brandingValue(theme, event.target.value) ?? ''
          })}>
            {brandingFields.map(([path, label]) => <option key={path} value={path}>{label}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="organization-theme-color">
          <Form.Label>Cor hexadecimal</Form.Label>
          <Form.Control value={draft.color} onChange={event => setDraft({ ...draft, color: event.target.value })} required pattern="#[0-9a-fA-F]{6}" />
        </Form.Group>
      </fieldset>
    </FormModal>}
  </>;
}
