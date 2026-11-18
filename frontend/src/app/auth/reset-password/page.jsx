'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Col, FormControl, FormLabel, Row } from 'react-bootstrap';
import { completePasswordRecovery, validatePasswordRecovery } from '@/lib/api/endpoints/auth';
import { isApiError } from '@/lib/api/errors';

// Token chega no fragmento (#token=...), nunca em query/log/analytics.
// Lido uma única vez no bootstrap da página e removido da barra de endereço.
const ResetPassword = () => {
  const tokenRef = useRef(null);
  const initializedRef = useRef(false);
  const [phase, setPhase] = useState('validating'); // validating | invalid | ready | done
  const [policy, setPolicy] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Guarda contra o duplo efeito do StrictMode em dev: a 2ª execução leria
    // a URL já sem o fragmento (removido pela 1ª) e zeraria o token.
    if (initializedRef.current) return;
    initializedRef.current = true;

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const token = fragment.get('token');
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    tokenRef.current = token;

    if (!token) {
      setPhase('invalid');
      return;
    }
    (async () => {
      try {
        const result = await validatePasswordRecovery({ token });
        setPolicy(result.password_policy);
        setPhase('ready');
      } catch {
        setPhase('invalid');
      }
    })();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    if (submitting) return;
    if (newPassword !== confirmation) {
      setError('As senhas informadas não coincidem.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await completePasswordRecovery({ token: tokenRef.current, newPassword, passwordConfirmation: confirmation });
      setPhase('done');
    } catch (err) {
      if (isApiError(err) && err.code === 'recovery_token_invalid_or_expired') {
        setPhase('invalid');
      } else {
        setError('Não foi possível trocar a senha. Tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  let body;
  if (phase === 'validating') {
    body = <p className="text-center text-white opacity-75 mb-0">Validando link de recuperação...</p>;
  } else if (phase === 'invalid') {
    body = <div className="d-flex flex-column align-items-center gap-3">
        <p className="text-center text-white mb-0">Este link de recuperação é inválido ou expirou.</p>
        <Link href="/auth/forgot-password" className="btn btn-dark bg-opacity-50 border-dark btn-lg">
          Solicitar novo link
        </Link>
      </div>;
  } else if (phase === 'done') {
    body = <div className="d-flex flex-column align-items-center gap-3">
        <p className="text-center text-white mb-0">Senha alterada com sucesso. Faça login novamente.</p>
        <Link href="/auth/login" className="btn btn-primary bg-opacity-75 btn-lg">
          Ir para o login
        </Link>
      </div>;
  } else {
    body = <form onSubmit={handleSubmit}>
        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
        {policy && (
          <p className="text-white opacity-50 small mb-3">
            Mínimo {policy.min_length} caracteres
            {policy.require_uppercase ? ', letra maiúscula' : ''}
            {policy.require_number ? ', número' : ''}
            {policy.require_symbol ? ', símbolo' : ''}.
          </p>
        )}
        <div className="mb-3">
          <FormLabel>Nova senha</FormLabel>
          <FormControl
            size="lg" type="password" required className="text-white bg-dark border-light border-opacity-25 bg-opacity-25"
            value={newPassword} onChange={e => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <FormLabel>Confirmar nova senha</FormLabel>
          <FormControl
            size="lg" type="password" required className="text-white bg-dark border-light border-opacity-25 bg-opacity-25"
            value={confirmation} onChange={e => setConfirmation(e.target.value)}
          />
        </div>
        <div className="d-grid">
          <Button type="submit" variant="primary" size="lg" className="bg-primary bg-opacity-75" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Trocar senha'}
          </Button>
        </div>
      </form>;
  }

  return <Row className="justify-content-center">
      <Col xs={11} md={8} lg={6} xl={4}>
        <div className="login-card p-4 p-md-6 bg-dark bg-opacity-50 translucent-dark rounded-4">
          <h2 className="text-center mb-4">Definir nova senha</h2>
          {body}
        </div>
      </Col>
    </Row>;
};
export default ResetPassword;
