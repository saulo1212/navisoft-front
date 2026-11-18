'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Alert, Button, Col, FormControl, FormLabel, InputGroup, Row } from 'react-bootstrap';
import { isApiError } from '@/lib/api/errors';
import { useSession } from '@/lib/session/SessionContext';

const ERROR_MESSAGES = {
  invalid_credentials: 'Login ou senha inválidos.',
  account_disabled: 'Esta conta está desativada.',
  network_error: 'Não foi possível contactar o servidor. Tente novamente.'
};

const Login = () => {
  const router = useRouter();
  const { login } = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async event => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await login(identifier, password);
      if (result.status === 'pending_mfa') {
        router.push('/auth/two-factor');
      } else {
        router.push('/');
      }
    } catch (err) {
      const code = isApiError(err) ? err.code : 'network_error';
      setError(ERROR_MESSAGES[code] || 'Não foi possível entrar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return <Row className="justify-content-center">
      <Col xs={11} md={8} lg={6} xl={4}>
        <div id="regular-login" className="login-card p-4 p-md-6 bg-dark bg-opacity-50 translucent-dark rounded-4">
          <h2 className="text-center mb-4">Navisoft</h2>
          <p className="text-center text-white opacity-50 mb-4">Entre com suas credenciais para continuar</p>
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <FormLabel>Login, e-mail ou telefone</FormLabel>
              <FormControl
                type="text" size="lg" id="identifier" required autoFocus
                className="text-white bg-dark border-light border-opacity-25 bg-opacity-25"
                value={identifier} onChange={e => setIdentifier(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <FormControl
                  size="lg" type="password" id="password" required
                  className="text-white bg-dark border-light border-opacity-25 bg-opacity-25"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </InputGroup>
            </div>
            <div className="d-grid mb-3">
              <Button type="submit" variant="primary" size="lg" className="bg-primary bg-opacity-75" disabled={submitting}>
                {submitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
            <div className="text-center mb-2">
              <Link href="/auth/forgot-password" className="text-decoration-none small text-white">
                Esqueci minha senha
              </Link>
            </div>
          </form>
        </div>
      </Col>
    </Row>;
};
export default Login;
