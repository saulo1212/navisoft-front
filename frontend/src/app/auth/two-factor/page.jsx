'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, FormControl, FormLabel, Row } from 'react-bootstrap';
import { isApiError } from '@/lib/api/errors';
import { useSession } from '@/lib/session/SessionContext';

const TwoFactor = () => {
  const router = useRouter();
  const { phase, confirmMfa } = useSession();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Não há sessão pendente (acesso direto à URL ou já promovida): volte ao login.
    if (phase === 'unauthenticated') router.replace('/auth/login');
    if (phase === 'authenticated') router.replace('/');
  }, [phase, router]);

  const handleSubmit = async event => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await confirmMfa(code);
      router.push('/');
    } catch (err) {
      const apiErr = isApiError(err);
      if (apiErr && err.code === 'mfa_code_invalid') setError('Código inválido. Tente novamente.');
      else if (apiErr && err.status === 401) setError('Sessão expirada. Faça login novamente.');
      else setError('Não foi possível confirmar o código.');
    } finally {
      setSubmitting(false);
    }
  };

  return <Row className="justify-content-center">
      <Col xs={11} md={8} lg={6} xl={4}>
        <div className="login-card p-4 p-md-6 bg-dark bg-opacity-50 translucent-dark rounded-4">
          <h2 className="text-center mb-4">Verificação em duas etapas</h2>
          <p className="text-center text-white opacity-50 mb-4">Informe o código de 6 dígitos enviado para seu contato cadastrado</p>
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <FormLabel>Código de autenticação</FormLabel>
              <FormControl
                size="lg" type="text" inputMode="numeric" className="text-white bg-dark border-light border-opacity-25 bg-opacity-25 text-center"
                id="otp" placeholder="123456" maxLength={6} required
                value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="mb-3 d-grid">
              <Button type="submit" variant="primary" size="lg" className="bg-primary bg-opacity-75 waves-effect" disabled={submitting || code.length < 6}>
                {submitting ? 'Verificando...' : 'Verificar'}
              </Button>
            </div>
          </form>
        </div>
      </Col>
    </Row>;
};
export default TwoFactor;
