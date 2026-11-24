'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import { confirmContactVerification, fetchProfile, requestContactVerification, updateProfile } from '@/lib/api/endpoints/auth';
import { errorMessage } from '@/lib/api/errors';
import { useSession } from '@/lib/session/SessionContext';

const profileFields = [
  { key: 'display_name', label: 'Nome de exibição' },
  { key: 'headline', label: 'Título do perfil' },
  { key: 'job_title', label: 'Cargo' },
  { key: 'city', label: 'Cidade' },
  { key: 'website', label: 'Site', type: 'url' },
  { key: 'bio', label: 'Biografia', multiline: true }
];

function readProfileFields(profile) {
  return Object.fromEntries(profileFields.map(({ key }) => [key, profile[key] ?? '']));
}

function resendDelay(seconds, retryAfter) {
  const secondsInBody = Number(seconds);
  if (Number.isFinite(secondsInBody) && secondsInBody > 0) return Math.ceil(secondsInBody);
  if (!retryAfter) return 0;
  if (/^\d+$/.test(retryAfter)) return Number(retryAfter);
  return Math.max(0, Math.ceil((Date.parse(retryAfter) - Date.now()) / 1000)) || 0;
}

export default function AccountProfilePage() {
  const { token, syncAccountProfile } = useSession();
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loadRevision, setLoadRevision] = useState(0);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const saveRequest = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchProfile({ token, signal: controller.signal }).then(result => {
      if (controller.signal.aborted) return;
      setProfile(result);
      setDraft(readProfileFields(result));
      syncAccountProfile(token, result);
    }).catch(error => {
      if (!controller.signal.aborted) setLoadError(error);
    });
    return () => controller.abort();
  }, [token, loadRevision, syncAccountProfile]);

  useEffect(() => () => saveRequest.current?.abort(), []);

  const patch = {};
  if (draft) {
    for (const { key } of profileFields) {
      const original = profile[key] ?? '';
      const value = draft[key].trim();
      if (draft[key] !== original && value !== original) patch[key] = value;
    }
  }
  const changed = Object.keys(patch).length > 0;

  async function save(event) {
    event.preventDefault();
    if (saveRequest.current || !changed) return;
    if (patch.website && !/^https?:\/\//i.test(patch.website)) {
      setNotice({ variant: 'danger', text: 'Informe um site com endereço HTTP ou HTTPS.' });
      return;
    }

    const controller = new AbortController();
    saveRequest.current = controller;
    const { signal } = controller;
    setSaving(true);
    setNotice(null);
    try {
      const result = await updateProfile({ token, patch, signal });
      if (signal.aborted) return;

      let saved = { ...profile, ...patch, ...result };
      let message = { variant: 'success', text: 'Perfil atualizado.' };
      try {
        saved = await fetchProfile({ token, signal });
      } catch {
        message = { variant: 'warning', text: 'Perfil salvo. A atualização da leitura falhou. Recarregue a página para conferir os dados.' };
      }
      if (signal.aborted) return;
      setProfile(saved);
      setDraft(readProfileFields(saved));
      syncAccountProfile(token, saved);
      setNotice(message);
    } catch (error) {
      if (!signal.aborted) setNotice({ variant: 'danger', text: errorMessage(error) });
    } finally {
      saveRequest.current = null;
      if (!signal.aborted) setSaving(false);
    }
  }

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title="Meu perfil" subTitle1="Conta" />
      <Row className="g-3">
        <Col xs={12} lg={7}>
          <section className="card panel p-4" aria-labelledby="profile-details">
            <h2 id="profile-details" className="h5 mb-3">Dados do perfil</h2>
            {loadError && <Alert variant="danger" className="mb-0">
              <p className="mb-2">{errorMessage(loadError)}</p>
              <Button variant="outline-danger" size="sm" onClick={() => {
                setLoadError(null);
                setLoadRevision(value => value + 1);
              }}>Tentar novamente</Button>
            </Alert>}
            {!draft && !loadError && <Spinner animation="border" size="sm" role="status"><span className="visually-hidden">Carregando perfil</span></Spinner>}
            {draft && <Form onSubmit={save}>
              {notice && <Alert variant={notice.variant}>{notice.text}</Alert>}
              <fieldset disabled={saving}>
                <Row className="g-3">
                  {profileFields.map(({ key, label, type, multiline }) => (
                    <Col key={key} xs={12} md={multiline ? 12 : 6}>
                      <Form.Group controlId={`profile-${key}`}>
                        <Form.Label>{label}</Form.Label>
                        <Form.Control
                          as={multiline ? 'textarea' : 'input'} type={type ?? 'text'}
                          rows={multiline ? 4 : undefined} value={draft[key]}
                          onChange={event => setDraft(current => ({ ...current, [key]: event.target.value }))}
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
                <Button className="mt-3" type="submit" disabled={!changed}>
                  {saving ? 'Salvando…' : 'Salvar perfil'}
                </Button>
              </fieldset>
            </Form>}
          </section>
        </Col>
        <Col xs={12} lg={5}>
          <EmailVerification token={token} profile={profile} />
        </Col>
      </Row>
    </div>
  );
}

function EmailVerification({ token, profile }) {
  const [verification, setVerification] = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  const [verificationToken, setVerificationToken] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [retryAt, setRetryAt] = useState(0);
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState(null);
  const request = useRef(null);
  const verified = verification === 'verified' || profile?.email_verified === true || Boolean(profile?.email_verified_at);
  const missing = !verified && (verification === 'missing' || (profile && Object.hasOwn(profile, 'email') && !profile.email));

  useEffect(() => () => request.current?.abort(), []);

  useEffect(() => {
    if (!retryAt) return;
    const timer = window.setInterval(() => {
      const seconds = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
      setRemaining(seconds);
      if (!seconds) window.clearInterval(timer);
    }, 250);
    return () => window.clearInterval(timer);
  }, [retryAt]);

  function waitToResend(seconds) {
    setRemaining(seconds);
    setRetryAt(seconds ? Date.now() + seconds * 1000 : 0);
  }

  async function verify(operation) {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    const { signal } = controller;
    setBusy(operation);
    setNotice(null);
    try {
      if (operation === 'send') {
        const result = await requestContactVerification({ token, signal });
        if (signal.aborted) return;
        if (!result?.challenge_id || result.accepted === false) {
          setNotice({ variant: 'danger', text: 'O serviço não confirmou o envio. Tente novamente.' });
          return;
        }
        setChallengeId(result.challenge_id);
        setVerificationToken('');
        waitToResend(resendDelay(result.retry_after_seconds));
        setNotice({ variant: 'info', text: 'Solicitação aceita. Confira a caixa de entrada do e-mail cadastrado.' });
      } else {
        const result = await confirmContactVerification({ token, challengeId, verificationToken: verificationToken.trim(), signal });
        if (signal.aborted) return;
        if (result?.verified === false || result?.confirmed === false) {
          setNotice({ variant: 'danger', text: 'Token inválido ou expirado. Confira o token ou solicite um novo.' });
          return;
        }
        setVerification('verified');
        setChallengeId(null);
        setVerificationToken('');
        setNotice({ variant: 'success', text: 'E-mail verificado.' });
      }
    } catch (error) {
      if (signal.aborted) return;
      if (operation === 'send' && error.status === 409) {
        setVerification('verified');
        setChallengeId(null);
        setVerificationToken('');
        setNotice({ variant: 'info', text: 'Este e-mail já está verificado.' });
      } else if (operation === 'send' && error.status === 422) {
        setVerification('missing');
      } else if (error.status === 429) {
        if (operation === 'send') waitToResend(resendDelay(error.payload?.retry_after_seconds, error.retryAfter));
        setNotice({ variant: 'warning', text: 'Aguarde antes de tentar novamente.' });
      } else if (operation === 'confirm' && [400, 404, 409, 410, 422].includes(error.status)) {
        setNotice({ variant: 'danger', text: 'Token inválido ou expirado. Confira o token ou solicite um novo.' });
      } else {
        setNotice({ variant: 'danger', text: errorMessage(error) });
      }
    } finally {
      request.current = null;
      if (!signal.aborted) setBusy(null);
    }
  }

  return (
    <section className="card panel p-4" aria-labelledby="profile-contact">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <h2 id="profile-contact" className="h5 mb-0">Verificação de e-mail</h2>
        {verified && <Badge bg="success">Verificado</Badge>}
        {!verified && profile?.email_verified === false && !missing && <Badge bg="secondary">Pendente</Badge>}
      </div>
      {profile?.email && <p className="text-break mb-3">{profile.email}</p>}
      {notice && <Alert variant={notice.variant}>{notice.text}</Alert>}
      {missing && <p className="text-muted mb-0">A conta precisa ter um e-mail cadastrado para iniciar a verificação.</p>}
      {!verified && !missing && <>
        {!challengeId && <p className="text-muted">Envie a verificação para o e-mail cadastrado na conta.</p>}
        {challengeId && <Form className="mb-3" onSubmit={event => {
          event.preventDefault();
          if (verificationToken.trim()) void verify('confirm');
        }}>
          <Form.Group controlId="profile-verification-token" className="mb-3">
            <Form.Label>Token recebido por e-mail</Form.Label>
            <Form.Control
              type="text" autoComplete="off" spellCheck={false} required value={verificationToken}
              disabled={Boolean(busy)} onChange={event => setVerificationToken(event.target.value)}
            />
          </Form.Group>
          <Button type="submit" disabled={Boolean(busy) || !verificationToken.trim()}>
            {busy === 'confirm' ? 'Confirmando…' : 'Confirmar e-mail'}
          </Button>
        </Form>}
        <div className="d-flex flex-wrap align-items-center gap-2">
          <Button type="button" variant="outline-primary" disabled={Boolean(busy) || remaining > 0} onClick={() => void verify('send')}>
            {busy === 'send' ? 'Solicitando…' : challengeId ? 'Reenviar verificação' : 'Enviar verificação'}
          </Button>
          {remaining > 0 && <span className="text-muted small">Novo envio em {remaining} s</span>}
        </div>
      </>}
    </section>
  );
}
