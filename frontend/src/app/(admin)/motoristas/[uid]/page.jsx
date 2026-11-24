'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DriverFields from '@/components/admin/DriverFields';
import FormModal from '@/components/admin/FormModal';
import StatusBadge from '@/components/admin/StatusBadge';
import { OperationalGate, operationError, useOperationalAction } from '@/components/admin/OperationalUi';
import { getDriver, patchDriver } from '@/lib/api/endpoints/drivers';
import { useDetailParam } from '@/lib/navigation/useDetailParam';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

export default function Page() {
  const uid = useDetailParam('uid');
  return <OperationalGate area="drivers"><Driver key={uid} uid={uid} /></OperationalGate>;
}

function Driver({ uid }) {
  const { token, selectedOrganizationUid: organizationUid } = useSession();
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const action = useOperationalAction();

  function apply(driver) {
    setRecord(driver);
    setForm({
      name: driver.name,
      birth_date: driver.birth_date?.slice(0, 10) ?? '',
      internal_contract_number: driver.internal_contract_number ?? ''
    });
    setConfirm(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    getDriver({ token, organizationUid, uid, includeInactive: true, signal: controller.signal })
      .then(driver => { if (!controller.signal.aborted) apply(driver); })
      .catch(error => { if (!controller.signal.aborted) setLoadError(operationError(error)); });
    return () => controller.abort();
  }, [token, organizationUid, uid]);

  function update(body, message) {
    void action.run(async signal => {
      await patchDriver({ token, organizationUid, uid, body, signal });
      return getDriver({ token, organizationUid, uid, includeInactive: true, signal });
    }, driver => {
      apply(driver);
      notifySuccess(message);
    }, () => {
      setRecord(null);
      setForm(null);
      setConfirm(false);
    });
  }

  function save(event) {
    event.preventDefault();
    if (!record?.active) return;
    const body = Object.fromEntries(Object.entries(form).filter(([key, value]) =>
      value.trim() !== (record[key]?.slice(0, key === 'birth_date' ? 10 : undefined) ?? '')
    ).map(([key, value]) => [key, value.trim() || null]));
    if (Object.keys(body).length) update(body, 'Motorista atualizado.');
  }

  return <>
    <PageBreadcrumb title="Detalhe do motorista" subTitle1="Operação" />
    <Link href="/motoristas" className="d-inline-block mb-3">Voltar para Motoristas</Link>
    {(loadError || (action.error && !confirm)) && <Alert variant="danger">{loadError || action.error}</Alert>}
    {!record && !loadError && !action.error && <Spinner animation="border" role="status"><span className="visually-hidden">Carregando motorista</span></Spinner>}
    {record && <form className="card panel p-4" onSubmit={save}>
      <div className="mb-3"><StatusBadge status={record.active ? 'active' : 'inactive'} /></div>
      <fieldset disabled={action.busy || !record.active}>
        <DriverFields value={form} onChange={setForm} />
        {record.active && <div className="d-flex flex-wrap gap-2">
          <Button type="submit">Salvar alterações</Button>
          <Button type="button" variant="outline-danger" onClick={() => {
            action.clearError();
            setConfirm(true);
          }}>Inativar motorista</Button>
        </div>}
      </fieldset>
    </form>}
    {record && <FormModal show={confirm} title="Inativar motorista" onHide={() => setConfirm(false)}
      onSubmit={event => { event.preventDefault(); update({ active: false }, 'Motorista inativado.'); }}
      submitting={action.busy} error={action.error} submitLabel="Inativar">
      <p className="mb-0">Inativar {record.name}? O motorista deixará de aparecer na seleção de novos checklists. A API também pode ocultar as execuções vinculadas a ele.</p>
    </FormModal>}
  </>;
}
