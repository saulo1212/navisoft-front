'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import DriverFields from '@/components/admin/DriverFields';
import FormModal from '@/components/admin/FormModal';
import ListToolbar from '@/components/admin/ListToolbar';
import StatusBadge from '@/components/admin/StatusBadge';
import { OperationalGate, useOperationalAction } from '@/components/admin/OperationalUi';
import { usePagedList } from '@/hooks/usePagedList';
import { createDriver, driverFields, searchDrivers } from '@/lib/api/endpoints/drivers';
import { fmtDate } from '@/lib/domain/collaborators';
import { intentKey } from '@/lib/domain/technicalOperations';
import { detailHref } from '@/lib/navigation/detailRoutes';
import { useSession } from '@/lib/session/SessionContext';
import { notifySuccess } from '@/lib/ui/toast';

const columns = [
  { key: 'name', label: 'Nome', render: driver => <Link href={detailHref('/motoristas', driver.uid)}>{driver.name}</Link> },
  { key: 'internal_contract_number', label: 'Contrato interno', render: driver => driver.internal_contract_number || '—' },
  { key: 'birth_date', label: 'Nascimento', render: driver => fmtDate(driver.birth_date) },
  { key: 'active', label: 'Estado', render: driver => <StatusBadge status={driver.active ? 'active' : 'inactive'} /> }
];

export default function Page() {
  return <OperationalGate area="drivers"><Drivers /></OperationalGate>;
}

function Drivers() {
  const { token, selectedOrganizationUid: organizationUid } = useSession();
  const [includeInactive, setIncludeInactive] = useState(false);
  const [form, setForm] = useState(null);
  const [createDenied, setCreateDenied] = useState(false);
  const action = useOperationalAction();
  const intention = useRef(null);
  const list = usePagedList(searchDrivers, { params: { organizationUid, includeInactive } });

  function openCreate() {
    action.clearError();
    setForm({});
  }

  function submit(event) {
    event.preventDefault();
    void action.run(signal => {
      const fields = driverFields(form);
      const idempotencyKey = intentKey(intention, 'create-driver', { organizationUid, fields });
      return createDriver({ token, organizationUid, fields, idempotencyKey, signal });
    }, () => {
      intention.current = null;
      setForm(null);
      notifySuccess('Motorista cadastrado.');
      void list.refresh();
    }, () => setCreateDenied(true));
  }

  return <>
    <PageBreadcrumb title="Motoristas" subTitle1="Operação" />
    <ListToolbar q={list.q} onChangeQ={list.setQ} placeholder="Buscar motoristas..."
      createLabel="Novo motorista" onAction={openCreate} actionDisabled={list.loading || Boolean(list.error) || createDenied} />
    <Form.Check id="drivers-include-inactive" className="mb-3" label="Incluir motoristas inativos"
      checked={includeInactive} onChange={event => {
        list.goToPage(1);
        setIncludeInactive(event.target.checked);
      }} />
    <DataTable columns={columns} rows={list.loading || list.error ? [] : list.items} loading={list.loading} error={list.error}
      emptyMessage="Nenhum motorista encontrado nesta organização."
      pagination={{ page: list.page, pageCount: list.pageCount, total: list.total, onPage: list.goToPage }} />
    {form && <FormModal show onHide={() => setForm(null)} title="Novo motorista" onSubmit={submit}
      submitting={action.busy} submitDisabled={createDenied} error={action.error} submitLabel="Cadastrar">
      <DriverFields value={form} onChange={setForm} required />
    </FormModal>}
  </>;
}
