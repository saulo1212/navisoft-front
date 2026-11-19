'use client';

import { useDetailParam } from '@/lib/navigation/useDetailParam';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import FormModal from '@/components/admin/FormModal';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  getUser, getUserApplications, patchUser, setUserApplications, updateUser
} from '@/lib/api/endpoints/users';
import { errorMessage } from '@/lib/api/errors';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';
import { PROFILE_CODES as PROFILES, PROFILE_LABELS } from '@/lib/domain/users';
// Aplicações conhecidas da plataforma (a lista real vem do backend por usuário).
const KNOWN_APPS = ['navisoft'];

const UserDetailPage = () => {
  const uid = useDetailParam('uid');
  const { token } = useSession();

  const [user, setUser] = useState(null);
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingApps, setSavingApps] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const detail = await getUser({ token, uid, includeInactive: true });
      setUser(detail);
      try { setApps(await getUserApplications({ token, uid })); } catch { setApps(null); }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token, uid]);

  useEffect(() => { void load(); }, [load]);

  const openEdit = () => {
    setForm({
      name: user.name ?? '', login: user.login ?? '',
      profile_code: user.profile_code ?? 'basic_user',
      organizations_access: user.organizations_access ?? 'selected',
      enabled: !!user.enabled
    });
    setEditOpen(true);
  };

  // PUT completo — pode revogar a sessão do usuário-alvo (version_sessions).
  const saveEdit = async event => {
    event.preventDefault();
    setSavingEdit(true);
    try {
      await updateUser({
        token, uid,
        body: {
          uid_organization: user.uid_organization,
          profile_code: form.profile_code,
          name: form.name,
          login: form.login,
          enabled: form.enabled,
          organizations_access: form.organizations_access,
          scopes: user.scopes ?? []
        }
      });
      notifySuccess('Usuário atualizado.');
      setEditOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingEdit(false); }
  };

  const toggleEnabled = async () => {
    try {
      await patchUser({ token, uid, body: { enabled: !user.enabled } });
      notifySuccess(user.enabled ? 'Usuário desabilitado.' : 'Usuário habilitado.');
      await load();
    } catch (err) { notifyError(err); }
  };

  const currentAppCodes = () => new Set((apps?.applications || []).filter(a => a.enabled).map(a => a.code));

  const toggleApp = async code => {
    const set = currentAppCodes();
    if (set.has(code)) set.delete(code); else set.add(code);
    setSavingApps(true);
    try {
      const updated = await setUserApplications({ token, uid, applications: [...set] });
      setApps(updated);
      notifySuccess('Aplicações atualizadas.');
    } catch (err) { notifyError(err); await load(); } finally { setSavingApps(false); }
  };

  if (loading) return <div className="content-wrapper"><div className="text-center py-5"><Spinner animation="border" /></div></div>;
  if (error) return <div className="content-wrapper"><Alert variant="danger">{error}</Alert></div>;

  const enabledApps = currentAppCodes();

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title={user.name || user.login} subTitle1="Usuários" />

      <Row className="g-3">
        <Col lg={7}>
          <Card className="panel">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="mb-0">Identidade & acesso</h5>
                <Button size="sm" variant="outline-primary" onClick={openEdit}>Editar</Button>
              </div>
              <dl className="row mb-0 small">
                <dt className="col-sm-4 text-muted">Nome</dt><dd className="col-sm-8">{user.name || '—'}</dd>
                <dt className="col-sm-4 text-muted">Login</dt><dd className="col-sm-8 font-monospace">{user.login}</dd>
                <dt className="col-sm-4 text-muted">E-mail</dt><dd className="col-sm-8">{user.email || '—'}</dd>
                <dt className="col-sm-4 text-muted">Perfil</dt><dd className="col-sm-8"><Badge bg="info" text="dark">{PROFILE_LABELS[user.profile_code] || user.profile_code}</Badge></dd>
                <dt className="col-sm-4 text-muted">Acesso a orgs</dt><dd className="col-sm-8">{user.organizations_access === 'all' ? 'Todas' : 'Selecionadas'}</dd>
                <dt className="col-sm-4 text-muted">Estado</dt><dd className="col-sm-8"><StatusBadge status={user.enabled ? 'active' : 'inactive'} label={user.enabled ? 'Habilitado' : 'Desabilitado'} /></dd>
                <dt className="col-sm-4 text-muted">Senha iniciada</dt><dd className="col-sm-8">{user.password_initialized ? 'Sim' : 'Não (aguarda primeiro acesso)'}</dd>
                <dt className="col-sm-4 text-muted">UID</dt><dd className="col-sm-8 font-monospace">{user.uid}</dd>
              </dl>
              <hr />
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small">{user.enabled ? 'Usuário pode autenticar.' : 'Usuário bloqueado para login.'}</span>
                <Button size="sm" variant={user.enabled ? 'outline-danger' : 'outline-success'} onClick={toggleEnabled}>
                  {user.enabled ? 'Desabilitar' : 'Habilitar'}
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="panel mt-3">
            <Card.Body>
              <h5 className="mb-3">Escopos ({(user.scopes || []).length})</h5>
              {(user.scopes || []).length === 0 && <p className="text-muted small mb-0">Sem escopos específicos (ou acesso a todas as organizações).</p>}
              {(user.scopes || []).map((s, i) => (
                <div key={s.uid_organization || i} className="border-bottom py-2 small">
                  <span className="font-monospace">{s.uid_organization}</span>
                  {Array.isArray(s.entities) && s.entities.length > 0 && (
                    <span className="text-muted ms-2">· {s.entities.length} entidade(s) restritas</span>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="panel">
            <Card.Body>
              <h5 className="mb-3">Aplicações</h5>
              {!apps && <p className="text-muted small mb-0">Lista de aplicações indisponível.</p>}
              {apps && KNOWN_APPS.map(code => (
                <Form.Check key={code} type="switch" id={`app-${code}`} className="mb-2"
                  label={code}
                  checked={enabledApps.has(code)}
                  disabled={savingApps}
                  onChange={() => toggleApp(code)}
                />
              ))}
              {apps && <p className="text-muted small mb-0 mt-2">A substituição é atômica: desmarcar remove o acesso do usuário àquela aplicação.</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <FormModal show={editOpen} onHide={() => setEditOpen(false)} title="Editar usuário" onSubmit={saveEdit} submitting={savingEdit}>
        {form && (
          <>
            <Alert variant="warning" className="py-2 small">
              Salvar um PUT completo pode <strong>revogar a sessão</strong> do usuário (ele precisará reautenticar).
            </Alert>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Login</label>
              <input className="form-control font-monospace" value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Perfil</label>
              <Form.Select value={form.profile_code} onChange={e => setForm(f => ({ ...f, profile_code: e.target.value }))}>
                {PROFILES.map(p => <option key={p} value={p}>{PROFILE_LABELS[p]} ({p})</option>)}
              </Form.Select>
            </div>
            <div className="mb-3">
              <label className="form-label">Acesso a organizações</label>
              <Form.Select value={form.organizations_access} onChange={e => setForm(f => ({ ...f, organizations_access: e.target.value }))}>
                <option value="selected">Somente selecionadas</option>
                <option value="all">Todas as organizações</option>
              </Form.Select>
            </div>
            <Form.Check type="switch" id="user-enabled" label="Habilitado" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))} />
          </>
        )}
      </FormModal>
    </div>
  );
};

export default UserDetailPage;
