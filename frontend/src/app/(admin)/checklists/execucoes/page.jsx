'use client';

import { detailHref } from '@/lib/navigation/detailRoutes';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ChecklistNavigation from '@/components/admin/ChecklistNavigation';
import { areaAllowed, OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import Pagination from '@/components/admin/Pagination';
import { usePagedList } from '@/hooks/usePagedList';
import { createChecklistRun, getChecklistRun } from '@/lib/api/endpoints/checklists';
import { getDriver, searchDrivers } from '@/lib/api/endpoints/drivers';
import { intentKey, requireUid } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="checklists"><Runs /></OperationalGate>; }
function Runs() {
  const { token, selectedOrganizationUid, areaAccess } = useSession();
  const router = useRouter();
  const action = useOperationalAction();
  const intention = useRef(null);
  const [driver, setDriver] = useState('');
  const [lookup, setLookup] = useState('');
  const canReadDrivers = areaAllowed(areaAccess, 'drivers');
  const drivers = usePagedList(searchDrivers, {
    params: { organizationUid: selectedOrganizationUid }, enabled: canReadDrivers
  });
  const driverReady = canReadDrivers && !drivers.loading && !drivers.error &&
    drivers.items.some(item => item.uid === driver);

  const create = event => {
    event.preventDefault();
    if (!driverReady) return;
    void action.run(async signal => {
      const { uid: driverUid } = await getDriver({ token, organizationUid: selectedOrganizationUid, uid: driver, signal });
      const result = await createChecklistRun({ token, driverUid, signal, idempotencyKey: intentKey(intention, 'create-checklist-run', { uid_driver: driverUid }) });
      const uid = requireUid((result.item ?? result)?.uid, 'execução criada');
      // Resolve under the selected context before exposing a newly created run.
      await getChecklistRun({ token, organizationUid: selectedOrganizationUid, uid, signal });
      return uid;
    }, uid => router.push(detailHref('/checklists/execucoes', uid)), () => {
      setDriver('');
      void drivers.refresh();
    });
  };
  const open = event => {
    event.preventDefault();
    void action.run(async signal => {
      const uid = requireUid(lookup, 'execução');
      await getChecklistRun({ token, organizationUid: selectedOrganizationUid, uid, signal });
      return uid;
    }, uid => router.push(detailHref('/checklists/execucoes', uid)));
  };
  return <>
    <PageBreadcrumb title="Execuções de checklist" subTitle1="Operação" /><ChecklistNavigation />
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    <div className="row g-3">
      <div className="col-lg-6"><form className="card panel p-4" onSubmit={create}><h5>Nova execução</h5><fieldset disabled={action.busy}>
        {canReadDrivers ? <>
          <OperationField label="Buscar motorista" value={drivers.q} onChange={event => {
            setDriver('');
            drivers.setQ(event.target.value);
          }} />
          {drivers.error && <Alert variant="danger">{drivers.error}</Alert>}
          <Form.Group controlId="checklist-driver" className="mb-3">
            <Form.Label>Motorista</Form.Label>
            <Form.Select required value={driverReady ? driver : ''} onChange={event => setDriver(event.target.value)}
              disabled={drivers.loading || Boolean(drivers.error) || !drivers.items.length}>
              <option value="">{drivers.loading ? 'Carregando motoristas…' :
                drivers.error ? 'Lista indisponível' : drivers.items.length ? 'Selecione um motorista' : 'Nenhum motorista ativo encontrado'}</option>
              {!drivers.loading && !drivers.error && drivers.items.map(item => (
                <option key={item.uid} value={item.uid}>
                  {item.name}{item.internal_contract_number ? ` · ${item.internal_contract_number}` : ''}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {!drivers.loading && !drivers.error && <Pagination page={drivers.page} pageCount={drivers.pageCount} onPage={page => {
            setDriver('');
            drivers.goToPage(page);
          }} />}
          <p className="small text-muted mt-3">A execução usará os checklists publicados aplicáveis ao motorista. Você poderá selecionar o ativo na etapa seguinte.</p>
        </> : <Alert variant="warning">Seu contexto de acesso não permite consultar motoristas.</Alert>}
        <Button type="submit" disabled={!driverReady}>Iniciar execução</Button>
      </fieldset></form></div>
      <div className="col-lg-6"><form className="card panel p-4" onSubmit={open}><h5>Abrir execução existente</h5><fieldset disabled={action.busy}>
        <OperationField label="UUID da execução" required value={lookup} onChange={e => setLookup(e.target.value)} />
        <Button type="submit" variant="outline-primary">Consultar execução</Button>
      </fieldset></form></div>
    </div>
  </>;
}
