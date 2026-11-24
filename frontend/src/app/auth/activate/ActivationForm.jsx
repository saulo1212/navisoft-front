'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { completeActivation, validateActivation } from '@/lib/api/endpoints/auth';
import { errorMessage } from '@/lib/api/errors';
import { activationLink } from '@/lib/domain/activation';
import { notifySuccess } from '@/lib/ui/toast';

const invalidMessage = 'Este convite é inválido, expirou ou já foi utilizado.';
const inputStyle = 'text-white bg-dark border-light border-opacity-25 bg-opacity-25';

function passwordRequirements(policy) {
  if (!policy) return '';
  return [
    policy.min_length > 0 && `Mínimo de ${policy.min_length} caracteres`,
    policy.require_lowercase && 'letra minúscula',
    policy.require_uppercase && 'letra maiúscula',
    policy.require_number && 'número',
    policy.require_symbol && 'símbolo'
  ].filter(Boolean).join(', ');
}

export default function ActivationForm() {
  const router = useRouter();
  const credentials = useRef(null);
  const submission = useRef(null);
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState('validating');
  const [policy, setPolicy] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function openNewLink() {
      const { challengeId, token, cleanPath } = activationLink(window.location);
      if (!challengeId && !token) return;
      window.history.replaceState(window.history.state, '', cleanPath);
      credentials.current = { challengeId, token };
      submission.current?.abort();
      submission.current = null;
      setSubmitting(false);
      setPassword('');
      setConfirmation('');
      setError(null);
      setPhase('validating');
      setAttempt(value => value + 1);
    }
    window.addEventListener('hashchange', openNewLink);
    return () => window.removeEventListener('hashchange', openNewLink);
  }, []);

  useEffect(() => {
    if (credentials.current === null) {
      const { challengeId, token, cleanPath } = activationLink(window.location);
      credentials.current = { challengeId, token };
      window.history.replaceState(window.history.state, '', cleanPath);
    }

    const controller = new AbortController();
    const current = credentials.current;
    async function validate() {
      const { challengeId, token } = current;
      if (controller.signal.aborted || credentials.current !== current) return;
      if (!challengeId || !token) {
        setPhase('invalid');
        return;
      }
      try {
        const result = await validateActivation({ challengeId, token, signal: controller.signal });
        if (controller.signal.aborted || credentials.current !== current) return;
        setPolicy(result?.password_policy ?? null);
        setPhase('ready');
      } catch (err) {
        if (controller.signal.aborted || credentials.current !== current) return;
        if (['activation_invitation_invalid_or_expired', 'invalid_request'].includes(err.code)) {
          credentials.current = {};
          setPhase('invalid');
        } else {
          setError(errorMessage(err));
          setPhase('unavailable');
        }
      }
    }
    queueMicrotask(() => { void validate(); });
    return () => {
      controller.abort();
      submission.current?.abort();
    };
  }, [attempt]);

  async function save(event) {
    event.preventDefault();
    if (phase !== 'ready' || submission.current) return;
    if (password !== confirmation) {
      setError('As senhas informadas não coincidem.');
      return;
    }
    const controller = new AbortController();
    submission.current = controller;
    setError(null);
    setSubmitting(true);
    try {
      await completeActivation({
        ...credentials.current, password, passwordConfirmation: confirmation, signal: controller.signal
      });
      if (controller.signal.aborted) return;
      credentials.current = {};
      setPassword('');
      setConfirmation('');
      setPhase('done');
      notifySuccess('Conta ativada. Entre com sua nova senha.');
      router.replace('/auth/login');
    } catch (err) {
      if (controller.signal.aborted) return;
      if (err.code === 'activation_invitation_invalid_or_expired') {
        credentials.current = {};
        setPassword('');
        setConfirmation('');
        setPhase('invalid');
      } else {
        setError(errorMessage(err));
      }
    } finally {
      if (!controller.signal.aborted) {
        submission.current = null;
        setSubmitting(false);
      }
    }
  }

  const requirements = passwordRequirements(policy);
  return <Row className="justify-content-center">
    <Col xs={11} md={8} lg={6} xl={4}>
      <div className="login-card p-4 p-md-6 bg-dark bg-opacity-50 translucent-dark rounded-4">
        <h2 className="text-center mb-4">Primeiro acesso</h2>
        {phase === 'validating' && <p role="status" className="text-center text-white opacity-75 mb-0">Validando convite…</p>}
        {phase === 'invalid' && <div className="text-center">
          <Alert variant="warning">{invalidMessage}</Alert>
          <p className="text-white">Se sua conta ainda estiver pendente, solicite outro convite à organização.</p>
          <Link className="btn btn-primary" href="/auth/login">Ir para o login</Link>
        </div>}
        {phase === 'unavailable' && <div className="text-center">
          <Alert variant="danger">{error}</Alert>
          <Button type="button" onClick={() => {
            setError(null);
            setPhase('validating');
            setAttempt(value => value + 1);
          }}>Tentar novamente</Button>
        </div>}
        {phase === 'done' && <p role="status" className="text-center text-white mb-0">Conta ativada. Redirecionando para o login…</p>}
        {phase === 'ready' && <Form onSubmit={save}>
          {error && <Alert variant="danger">{error}</Alert>}
          {requirements && <p className="text-white opacity-75 small">{requirements}.</p>}
          <fieldset disabled={submitting}>
            <Form.Group controlId="activation-password" className="mb-3">
              <Form.Label>Nova senha</Form.Label>
              <Form.Control className={inputStyle} type="password" size="lg" required
                autoComplete="new-password" minLength={policy?.min_length}
                value={password} onChange={event => setPassword(event.target.value)} />
            </Form.Group>
            <Form.Group controlId="activation-confirmation" className="mb-4">
              <Form.Label>Confirmar nova senha</Form.Label>
              <Form.Control className={inputStyle} type="password" size="lg" required
                autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" size="lg">{submitting ? 'Ativando…' : 'Ativar conta'}</Button>
            </div>
          </fieldset>
        </Form>}
      </div>
    </Col>
  </Row>;
}
