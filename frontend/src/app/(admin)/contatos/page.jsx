'use client';

import { useState } from 'react';
import { Badge, Button, Form, Row, Col } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormDrawer from '@/components/admin/FormDrawer';
import ListToolbar from '@/components/admin/ListToolbar';
import OrganizationGate from '@/components/admin/OrganizationGate';
import { usePagedList } from '@/hooks/usePagedList';
import { createContact, listContacts } from '@/lib/api/endpoints/contacts';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';

const METHOD_TYPES = ['phone', 'email', 'whatsapp'];
const ROLES = ['support', 'billing', 'technical', 'commercial'];
const EMPTY = { name: '', role: 'support', method_type: 'phone', method_value: '' };

const ContactsInner = () => {
  const { token, selectedOrganizationUid } = useSession();
  const { q, setQ, items, total, page, pageCount, goToPage, loading, error, refresh } =
    usePagedList(args => listContacts({ ...args, organizationUid: selectedOrganizationUid }), {
      params: { organizationUid: selectedOrganizationUid }, pageSize: 20
    });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      await createContact({
        token,
        body: {
          link_code: 'organization',
          uid_link: selectedOrganizationUid,
          name: form.name,
          roles: [form.role],
          methods: [{ type: form.method_type, value: form.method_value }]
        }
      });
      notifySuccess('Contato criado.');
      setForm(EMPTY);
      setOpen(false);
      refresh();
    } catch (err) { notifyError(err); } finally { setSaving(false); }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'roles', label: 'Papéis', render: r => (r.roles || []).map(x => <Badge key={x} bg="light" text="dark" className="me-1">{x}</Badge>) },
    { key: 'methods', label: 'Métodos', render: r => (r.methods || []).map((m, i) => <span key={i} className="d-block small"><span className="text-muted">{m.type}:</span> {m.value}{m.is_whatsapp ? ' (WhatsApp)' : ''}</span>) },
    { key: 'active', label: 'Ativo', render: r => (r.active === false ? <Badge bg="secondary">não</Badge> : <Badge bg="success">sim</Badge>) }
  ];

  return (
    <>
      <PageBreadcrumb title="Contatos" subTitle1="Pessoas & Acesso" />
      <ListToolbar q={q} onChangeQ={setQ} placeholder="Buscar por nome..." actionLabel="Novo contato" onAction={() => { setForm(EMPTY); setOpen(true); }} />
      {total != null && <p className="text-muted small mb-2">{total} contato(s) nesta organização.</p>}
      <DataTable
        columns={columns} rows={items} loading={loading} error={error}
        emptyMessage="Nenhum contato cadastrado nesta organização."
        pagination={{ page, pageCount, total, onPage: goToPage }}
      />

      <FormDrawer show={open} onHide={() => setOpen(false)} title="Novo contato" onSubmit={submit} submitting={saving}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Papel</label>
          <Form.Select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </Form.Select>
        </div>
        <Row className="g-2 mb-3">
          <Col xs={5}>
            <label className="form-label">Método</label>
            <Form.Select value={form.method_type} onChange={e => setForm(f => ({ ...f, method_type: e.target.value }))}>
              {METHOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Form.Select>
          </Col>
          <Col xs={7}>
            <label className="form-label">Valor</label>
            <input className="form-control" value={form.method_value} onChange={e => setForm(f => ({ ...f, method_value: e.target.value }))}
              placeholder={form.method_type === 'email' ? 'nome@dominio.com' : '+5531999999999'} required />
          </Col>
        </Row>
        <p className="text-muted small mb-0">O contato é ancorado à organização atual. O backend valida o formato do método (ex.: e-mail precisa ser e-mail válido).</p>
      </FormDrawer>
    </>
  );
};

const ContactsPage = () => (
  <OrganizationGate>
    <ContactsInner />
  </OrganizationGate>
);

export default ContactsPage;
