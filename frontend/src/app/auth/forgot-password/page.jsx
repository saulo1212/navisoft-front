'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Col, FormControl, FormLabel, Row } from 'react-bootstrap';
import { requestPasswordRecovery } from '@/lib/api/endpoints/auth';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await requestPasswordRecovery({ identifier });
      // A resposta real nunca revela se a conta existe/é elegível; sempre neutra.
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return <Row className="justify-content-center">
        <Col xs={11} md={8} lg={6} xl={6}>
          <div className="login-card p-4 p-md-6 bg-dark bg-opacity-50 translucent-dark rounded-4">
            <div className="d-flex flex-column align-items-center justify-content-center gap-3">
              <h2 className="text-center mb-2">Verifique seu e-mail</h2>
              <p className="text-center text-white mb-2">
                Se o identificador informado tiver uma conta elegível, enviamos um link de recuperação.
              </p>
              <div className="d-grid w-100">
                <Link href="/auth/login" className="btn btn-dark bg-opacity-50 border-dark btn-lg">
                  Voltar para o login
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>;
  }

  return <Row className="justify-content-center">
      <Col xs={11} md={8} lg={6} xl={6}>
        <div className="login-card p-4 p-md-6 bg-dark bg-opacity-50 translucent-dark rounded-4">
          <h2 className="text-center mb-4">Esqueci minha senha</h2>
          <p className="text-center text-white opacity-50 mb-4">Enviaremos um link de recuperação para o seu contato cadastrado</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <FormLabel htmlFor="identifier">Login, e-mail ou telefone</FormLabel>
              <FormControl
                size="lg" type="text" id="identifier" required
                className="text-white bg-dark border-light border-opacity-25 bg-opacity-25"
                value={identifier} onChange={e => setIdentifier(e.target.value)}
              />
            </div>
            <div className="text-end">
              <Button size="lg" variant="warning" type="submit" className="waves-effect bg-opacity-50 border-dark" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar link de recuperação'}
              </Button>
            </div>
          </form>
        </div>
      </Col>
    </Row>;
};
export default ForgotPassword;
