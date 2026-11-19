'use client';

import { useRef, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import FormModal from './FormModal';
import { useOperationalAction } from './OperationalUi';
import StoredImage from './StoredImage';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { readPlatformImage, uploadPlatformLogo } from '@/lib/api/endpoints/platform';
import { newIdempotencyKey } from '@/lib/api/idempotency';
import { PLATFORM_LOGO_TYPES, validatePlatformLogo } from '@/lib/domain/platform';
import { useSession } from '@/lib/session/SessionContext';

export default function PlatformLogo(props) {
  const { token, areaAccess, selectedOrganizationUid } = useSession();
  if (!token || areaAccess?.status !== 'evaluated') return null;
  if (props.editable === false && !props.imageUid) return null;
  return <LogoCard key={`${token}:${selectedOrganizationUid}:${props.uid}:${JSON.stringify(areaAccess)}`} token={token} {...props} />;
}

function LogoCard({ token, owner, uid, imageUid, editable = true }) {
  const [uploadedUid, setUploadedUid] = useState(null);
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const [denied, setDenied] = useState(false);
  const [file, setFile] = useState(null);
  const action = useOperationalAction();
  const intention = useRef(null);

  const submit = event => {
    event.preventDefault();
    void action.run(signal => {
      validatePlatformLogo(file);
      intention.current ??= newIdempotencyKey();
      return uploadPlatformLogo({ token, signal, owner, uid, file, idempotencyKey: intention.current });
    }, result => {
      setUploadedUid(result?.item?.uid ?? result?.uid ?? null);
      setSaved(true);
      setFile(null);
      setOpen(false);
    }, () => {
      setDenied(true);
      setFile(null);
      setOpen(false);
    });
  };
  const currentUid = uploadedUid ?? imageUid;

  return <Card className="panel mt-3">
    <Card.Body>
      <h2 className="h5">Logotipo</h2>
      {currentUid && <PlatformImage uid={currentUid} publicImage={Boolean(uploadedUid)} alt="Logotipo atual" />}
      {saved && <Alert variant="success">Logotipo atualizado.</Alert>}
      {denied && action.error && <Alert variant="warning">{action.error}</Alert>}
      {editable && !denied && <Button size="sm" variant="outline-primary" onClick={() => {
        setSaved(false);
        action.clearError();
        setOpen(true);
      }}>Enviar logotipo</Button>}
    </Card.Body>
    {open && <FormModal show title="Enviar logotipo" submitting={action.busy} submitDisabled={!file}
      error={action.error} onSubmit={submit} onHide={() => { setFile(null); setOpen(false); }}>
      <Form.Group controlId="platform-logo-file" className="mb-3">
        <Form.Label>Imagem PNG, JPEG ou GIF</Form.Label>
        <Form.Control type="file" accept={PLATFORM_LOGO_TYPES.join(',')} required disabled={action.busy} onChange={event => {
          intention.current = null;
          action.clearError();
          setFile(event.target.files?.[0] ?? null);
        }} />
      </Form.Group>
      <p>O arquivo será vinculado como logotipo público.</p>
    </FormModal>}
  </Card>;
}

export function PlatformImage({ uid, publicImage = false, alt }) {
  const { token, areaAccess, selectedOrganizationUid } = useSession();
  const query = useKnowledgeQuery(readPlatformImage, { token, uid, publicImage, selectedOrganizationUid, areaAccess },
    Boolean(token && uid && areaAccess?.status === 'evaluated'));
  if (query.error) return <p className="small text-muted">Não foi possível carregar a imagem.</p>;
  return <StoredImage blob={query.data} alt={alt} />;
}
