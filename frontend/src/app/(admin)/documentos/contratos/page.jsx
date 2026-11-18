'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { Alert, Button } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DocumentsNavigation from '@/components/admin/DocumentsNavigation';
import { OperationalGate, OperationField, useOperationalAction } from '@/components/admin/OperationalUi';
import { createDocumentContract } from '@/lib/api/endpoints/documents';
import { documentContractBody } from '@/lib/domain/documents';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { return <OperationalGate area="documents"><Contracts /></OperationalGate>; }
function Contracts() {
  const { token, selectedOrganizationUid } = useSession();
  const action = useOperationalAction();
  const intention = useRef(null);
  const [form, setForm] = useState({ contract_year: new Date().getFullYear(), contract_code: '' });
  const [created, setCreated] = useState(null);
  const save = event => {
    event.preventDefault();
    void action.run(signal => {
      const body = documentContractBody(form, selectedOrganizationUid);
      return createDocumentContract({ token, organizationUid: selectedOrganizationUid, body, signal, idempotencyKey: intentKey(intention, 'ged-contract', body) });
    }, result => setCreated(result.item ?? result), () => setCreated(null));
  };
  return <><PageBreadcrumb title="Contratos GED" subTitle1="Conteúdo" /><DocumentsNavigation /><p>O contrato GED organiza a numeração dos documentos da organização selecionada.</p>
    {action.error && <Alert variant="danger">{action.error}</Alert>}
    <form className="card panel p-3" onSubmit={save}><fieldset disabled={action.busy || !!created}><OperationField label="Ano do contrato" type="number" min="1" max="9999" step="1" required value={form.contract_year} onChange={event => setForm({ ...form, contract_year: event.target.value })} /><OperationField label="Código do contrato" required value={form.contract_code} onChange={event => setForm({ ...form, contract_code: event.target.value })} /><Button type="submit">Criar contrato</Button></fieldset></form>
    {created && <Alert variant="success" className="mt-3"><p>Contrato criado: {created.contract_code || form.contract_code}</p><p className="text-break">UUID: {created.uid}</p><Link href={`/documentos?contrato=${encodeURIComponent(created.uid)}`}>Criar um documento neste contrato</Link><Button className="ms-3" variant="outline-secondary" onClick={() => { setCreated(null); setForm({ ...form, contract_code: '' }); intention.current = null; action.clearError(); }}>Novo contrato</Button></Alert>}
  </>;
}
