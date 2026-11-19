'use client';

import { useDetailParam } from '@/lib/navigation/useDetailParam';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import FormDrawer from '@/components/admin/FormDrawer';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  getOrganization, getOrganizationGates, getOrgSessionPolicy,
  updateOrganizationIdentity, updateOrganizationReseller, updateOrgSessionPolicy
} from '@/lib/api/endpoints/organizations';
import { errorMessage } from '@/lib/api/errors';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';

const OrganizationDetailPage = () => {
  const uid = useDetailParam('uid');
  const { token } = useSession();
  const [org, setOrg] = useState(null);
  const [gates, setGates] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [savingId, setSavingId] = useState(false);
  const [savingReseller, setSavingReseller] = useState(false);
  const [savingPolicy, setSavingPolicy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [detail, g] = await Promise.all([
        getOrganization({ token, uid }),
        getOrganizationGates({ token, uid }).catch(() => null)
      ]);
      setOrg(detail);
      setGates(g);
      if (g?.session_policy?.read === 'allowed') {
        try { setPolicy(await getOrgSessionPolicy({ token, uid })); } catch { setPolicy(null); }
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token, uid]);

  useEffect(() => { void load(); }, [load]);

  const canEditIdentity = gates?.organization?.code_name_update === 'allowed';
  const canEditReseller = gates?.organization?.reseller_enabled_update === 'allowed';
  const canUpdatePolicy = gates?.session_policy?.update === 'allowed';

  const openEdit = () => { setCode(org.code ?? ''); setName(org.name ?? ''); setEditOpen(true); };

  const saveIdentity = async event => {
    event.preventDefault();
    setSavingId(true);
    try {
      await updateOrganizationIdentity({ token, uid, code, name });
      notifySuccess('Identidade da organização atualizada.');
      setEditOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingId(false); }
  };

  const toggleReseller = async () => {
    setSavingReseller(true);
    try {
      await updateOrganizationReseller({ token, uid, resellerEnabled: !org.reseller_enabled });
      notifySuccess('Configuração de revenda atualizada.');
      await load();
    } catch (err) { notifyError(err); } finally { setSavingReseller(false); }
  };

  const savePolicyField = async patch => {
    setSavingPolicy(true);
    try {
      const updated = await updateOrgSessionPolicy({ token, uid, ...patch });
      setPolicy(updated);
      notifySuccess('Política de sessão atualizada.');
    } catch (err) { notifyError(err); await load(); } finally { setSavingPolicy(false); }
  };

  if (loading) return <div className="content-wrapper"><div className="text-center py-5"><Spinner animation="border" /></div></div>;
  if (error) return <div className="content-wrapper"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title={org.name} subTitle1="Organizações" />

      <Row className="g-3">
        <Col lg={7}>
          <Card className="panel">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="mb-0">Identidade</h5>
                <Button size="sm" variant="outline-primary" onClick={openEdit}
                  disabled={!canEditIdentity} title={canEditIdentity ? undefined : 'Edição não permitida para o seu acesso'}>
                  Editar
                </Button>
              </div>
              <dl className="row mb-0 small">
                <dt className="col-sm-4 text-muted">Nome</dt><dd className="col-sm-8">{org.name}</dd>
                <dt className="col-sm-4 text-muted">Código</dt><dd className="col-sm-8 font-monospace">{org.code}</dd>
                <dt className="col-sm-4 text-muted">E-mail</dt><dd className="col-sm-8">{org.email || '—'}</dd>
                <dt className="col-sm-4 text-muted">UID</dt><dd className="col-sm-8 font-monospace">{org.uid}</dd>
                <dt className="col-sm-4 text-muted">Plano</dt><dd className="col-sm-8 font-monospace">{org.uid_billing_plan || '—'}</dd>
                <dt className="col-sm-4 text-muted">Criada em</dt><dd className="col-sm-8">{org.created_at ? new Date(org.created_at).toLocaleString('pt-BR') : '—'}</dd>
              </dl>
            </Card.Body>
          </Card>

          <Card className="panel mt-3">
            <Card.Body>
              <h5 className="mb-3">Revenda</h5>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <StatusBadge status={org.reseller_enabled ? 'active' : 'inactive'} label={org.reseller_enabled ? 'Habilitada' : 'Desabilitada'} />
                  <p className="text-muted small mb-0 mt-1">Permite que esta organização atue como revenda (Primary-only).</p>
                </div>
                <Button size="sm" variant={org.reseller_enabled ? 'outline-danger' : 'outline-success'}
                  onClick={toggleReseller} disabled={!canEditReseller || savingReseller}
                  title={canEditReseller ? undefined : 'Alteração não permitida para o seu acesso'}>
                  {savingReseller ? <Spinner size="sm" animation="border" /> : (org.reseller_enabled ? 'Desabilitar' : 'Habilitar')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="panel">
            <Card.Body>
              <h5 className="mb-3">Política de sessão</h5>
              {gates?.session_policy?.read !== 'allowed' && (
                <p className="text-muted small mb-0">Leitura da política não permitida para o seu acesso.</p>
              )}
              {gates?.session_policy?.read === 'allowed' && !policy && (
                <p className="text-muted small mb-0">Política indisponível.</p>
              )}
              {policy && (
                <>
                  <Form.Check type="switch" id="allow-concurrent" className="mb-2"
                    label="Permitir sessões simultâneas"
                    checked={!!policy.allow_concurrent_sessions}
                    disabled={!canUpdatePolicy || savingPolicy}
                    onChange={e => savePolicyField({ allowConcurrentSessions: e.target.checked })}
                  />
                  <Form.Check type="switch" id="require-mfa"
                    label="Exigir verificação em duas etapas (MFA)"
                    checked={!!policy.require_mfa}
                    disabled={!canUpdatePolicy || savingPolicy}
                    onChange={e => savePolicyField({ requireMfa: e.target.checked })}
                  />
                  {!canUpdatePolicy && <p className="text-muted small mb-0 mt-2">Alteração não permitida para o seu acesso.</p>}
                  {policy.revoked_count > 0 && (
                    <p className="text-muted small mb-0 mt-2">{policy.revoked_count} sessão(ões) revogada(s) pela política atual.</p>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <FormDrawer
        show={editOpen} onHide={() => setEditOpen(false)} title="Editar identidade"
        onSubmit={saveIdentity} submitting={savingId}
      >
        <div className="mb-3">
          <label className="form-label">Código</label>
          <input className="form-control font-monospace" value={code} onChange={e => setCode(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <p className="text-muted small">
          A validação final (unicidade de código, formato) é feita pelo backend; o gate liberado não garante aceite do payload.
        </p>
      </FormDrawer>
    </div>
  );
};

export default OrganizationDetailPage;
