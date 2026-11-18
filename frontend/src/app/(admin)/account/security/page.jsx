'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import {
  fetchSessionPolicy, getSecurity, putSecurity, updateSessionPolicy
} from '@/lib/api/endpoints/auth';
import { isApiError } from '@/lib/api/errors';
import { useSession } from '@/lib/session/SessionContext';

const AccountSecurityPage = () => {
  const { token, selectedOrganizationUid, orgGates } = useSession();
  const [requireMfa, setRequireMfa] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(true);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [personalMessage, setPersonalMessage] = useState(null);

  const [policy, setPolicy] = useState(null);
  const [policyState, setPolicyState] = useState('loading'); // loading | ready | hidden | error
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [policyMessage, setPolicyMessage] = useState(null);

  useEffect(() => {
    let active = true;
    getSecurity({ token }).then(result => { if (active) setRequireMfa(Boolean(result.require_mfa)); })
      .finally(() => { if (active) setLoadingPersonal(false); });
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    if (!selectedOrganizationUid || orgGates?.session_policy?.read !== 'allowed') {
      setPolicyState('hidden');
      return;
    }
    let active = true;
    setPolicyState('loading');
    fetchSessionPolicy({ token, organizationUid: selectedOrganizationUid })
      .then(result => { if (active) { setPolicy(result); setPolicyState('ready'); } })
      .catch(error => {
        if (!active) return;
        // Negação real nesta rota é oculta como 404 resource_not_found.
        if (isApiError(error) && error.status === 404) setPolicyState('hidden');
        else setPolicyState('error');
      });
    return () => { active = false; };
  }, [token, selectedOrganizationUid, orgGates]);

  const savePersonal = async event => {
    event.preventDefault();
    setSavingPersonal(true);
    setPersonalMessage(null);
    try {
      const result = await putSecurity({ token, requireMfa });
      setRequireMfa(Boolean(result.require_mfa));
      setPersonalMessage({ variant: 'success', text: 'Preferência atualizada.' });
    } catch {
      setPersonalMessage({ variant: 'danger', text: 'Não foi possível salvar a preferência.' });
    } finally {
      setSavingPersonal(false);
    }
  };

  const savePolicy = async event => {
    event.preventDefault();
    setSavingPolicy(true);
    setPolicyMessage(null);
    try {
      const result = await updateSessionPolicy({
        token, organizationUid: selectedOrganizationUid,
        allowConcurrentSessions: policy.allow_concurrent_sessions, requireMfa: policy.require_mfa
      });
      setPolicy(result);
      setPolicyMessage({ variant: 'success', text: 'Política da organização atualizada.' });
    } catch (error) {
      if (isApiError(error) && error.status === 404) setPolicyState('hidden');
      else setPolicyMessage({ variant: 'danger', text: 'Não foi possível salvar a política.' });
    } finally {
      setSavingPolicy(false);
    }
  };

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title="Segurança da conta" subTitle1="Conta" />
      <Row className="g-3">
      <Col xs={12} lg={6}>
        <div className="card panel p-4">
          <h5 className="mb-1">Preferência pessoal de MFA</h5>
          <p className="text-muted small mb-3">
            A exigência efetiva combina esta preferência com a política da organização; não é possível
            remover a exigência organizacional por aqui.
          </p>
          {loadingPersonal ? <Spinner size="sm" animation="border" /> : (
            <form onSubmit={savePersonal}>
              {personalMessage && <Alert variant={personalMessage.variant} className="py-2 small">{personalMessage.text}</Alert>}
              <Form.Check
                type="switch" id="require-mfa-personal" label="Exigir verificação em duas etapas no login"
                checked={requireMfa} onChange={e => setRequireMfa(e.target.checked)}
              />
              <div className="mt-3">
                <Button type="submit" size="sm" disabled={savingPersonal}>
                  {savingPersonal ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Col>

      {policyState !== 'hidden' && (
        <Col xs={12} lg={6}>
          <div className="card panel p-4">
            <h5 className="mb-1">Política de sessão da organização</h5>
            <p className="text-muted small mb-3">Aplica-se a todos os usuários da organização selecionada.</p>
            {policyState === 'loading' && <Spinner size="sm" animation="border" />}
            {policyState === 'error' && <p className="text-danger small">Não foi possível carregar a política.</p>}
            {policyState === 'ready' && policy && (
              <form onSubmit={savePolicy}>
                {policyMessage && <Alert variant={policyMessage.variant} className="py-2 small">{policyMessage.text}</Alert>}
                <Form.Check
                  type="switch" id="allow-concurrent" label="Permitir sessões simultâneas" className="mb-2"
                  checked={policy.allow_concurrent_sessions}
                  disabled={orgGates?.session_policy?.update !== 'allowed'}
                  onChange={e => setPolicy(prev => ({ ...prev, allow_concurrent_sessions: e.target.checked }))}
                />
                <Form.Check
                  type="switch" id="org-require-mfa" label="Exigir MFA para todos os usuários"
                  checked={policy.require_mfa}
                  disabled={orgGates?.session_policy?.update !== 'allowed'}
                  onChange={e => setPolicy(prev => ({ ...prev, require_mfa: e.target.checked }))}
                />
                <div className="mt-3">
                  <Button type="submit" size="sm" disabled={savingPolicy || orgGates?.session_policy?.update !== 'allowed'}>
                    {savingPolicy ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Col>
      )}
      </Row>
    </div>
  );
};

export default AccountSecurityPage;
