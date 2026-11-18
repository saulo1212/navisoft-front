'use client';

import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import DocumentsNavigation from '@/components/admin/DocumentsNavigation';
import FormDrawer from '@/components/admin/FormDrawer';
import { OperationalGate, OperationField, operationError, useOperationalAction } from '@/components/admin/OperationalUi';
import { useKnowledgeQuery } from '@/hooks/useKnowledgeQuery';
import { useOffsetList } from '@/hooks/useOffsetList';
import { assignDocumentClass, createDocumentDistribution, downloadDocumentRevision, getDocument, listDocumentClasses, listDocumentDistributions, listDocumentRevisions, revokeDocumentDistribution, updateDocumentDistribution, uploadDocumentRevision } from '@/lib/api/endpoints/documents';
import { distributionBody, distributionForm, documentUploadIntent } from '@/lib/domain/documents';
import { intentKey } from '@/lib/domain/technicalOperations';
import { useSession } from '@/lib/session/SessionContext';

export default function Page() { const { uid } = useParams(); return <OperationalGate area="documents"><Document key={uid} uid={uid} /></OperationalGate>; }
function Document({ uid }) {
  const { token, selectedOrganizationUid } = useSession();
  const [revision, setRevision] = useState(0);
  const [denied, setDenied] = useState(false);
  const query = useKnowledgeQuery(getDocument, { token, organizationUid: selectedOrganizationUid, uid, revision }, !denied);
  const history = useKnowledgeQuery(listDocumentRevisions, { token, organizationUid: selectedOrganizationUid, uid, revision }, !denied);
  const record = query.data?.item ?? query.data;
  const revisions = Array.isArray(history.data) ? history.data : history.data?.items || [];
  const isOwner = !!record && record.uid_organization === selectedOrganizationUid && record.access_source !== 'distribution';
  const distributions = useOffsetList(listDocumentDistributions, { params: { organizationUid: selectedOrganizationUid, uid, revision }, enabled: isOwner && !denied });
  const classes = useOffsetList(listDocumentClasses, { params: { organizationUid: selectedOrganizationUid }, enabled: isOwner && !denied });
  const action = useOperationalAction();
  const intention = useRef(null);
  const [upload, setUpload] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [remove, setRemove] = useState(null);
  const [classUid, setClassUid] = useState(null);
  const [notice, setNotice] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);
  const args = { token, organizationUid: selectedOrganizationUid };
  const clear = () => { setUpload(null); setDistribution(null); setRemove(null); setClassUid(null); setDownloadLink(null); };
  const deny = () => { clear(); setDenied(true); distributions.setItems([]); classes.setItems([]); };
  const complete = () => { clear(); setNotice('Operação concluída.'); setRevision(value => value + 1); };
  const begin = callback => { action.clearError(); setNotice(null); intention.current = null; callback(); };
  const download = row => {
    setDownloadLink(null); action.clearError();
    void action.run(signal => downloadDocumentRevision({ ...args, uid: row.uid, signal }), result => {
      if (result.kind === 'link') { setDownloadLink(result); return; }
      const url = URL.createObjectURL(result.blob), anchor = document.createElement('a');
      anchor.href = url; anchor.download = row.original_filename || 'documento'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, () => { setDownloadLink(null); setRevision(value => value + 1); });
  };
  const saveUpload = event => {
    event.preventDefault();
    void action.run(async signal => {
      if (!isOwner) throw new Error('Crie revisões no contexto da organização proprietária.');
      const intent = await documentUploadIntent(upload.file, upload.summary, revisions);
      return uploadDocumentRevision({ ...args, uid, file: upload.file, headers: intent.headers, signal, idempotencyKey: intentKey(intention, `ged-upload:${uid}`, intent.signature) });
    }, complete, deny);
  };
  const saveDistribution = event => {
    event.preventDefault();
    void action.run(signal => {
      if (!isOwner) throw new Error('Gerencie a distribuição no contexto do proprietário.');
      const body = distributionBody(distribution.form, revisions, !distribution.current, record.uid_organization);
      return distribution.current ? updateDocumentDistribution({ ...args, uid: distribution.current.uid, body, signal }) : createDocumentDistribution({ ...args, uid, body, signal, idempotencyKey: intentKey(intention, `ged-distribution:${uid}`, body) });
    }, complete, deny);
  };
  const modal = upload || distribution || remove || classUid !== null;
  return <>
    <PageBreadcrumb title={record?.title || 'Documento GED'} subTitle1="Conteúdo" /><DocumentsNavigation />
    {query.loading && <Spinner animation="border" size="sm" />}{query.error && <Alert variant="danger">{operationError(query.error)}</Alert>}{denied && <Alert variant="warning">Documento indisponível para a operação. Recarregue para reavaliar o acesso.</Alert>}
    {action.error && !modal && <Alert variant="danger">{action.error}</Alert>}{notice && <Alert variant="success">{notice}</Alert>}
    <Button variant="outline-secondary" className="mb-3" disabled={action.busy} onClick={() => { clear(); setDenied(false); setRevision(value => value + 1); }}>Recarregar documento</Button>
    {record && <>
      <div className="card panel p-3 mb-3"><h5>{record.code}</h5><p>{record.title}</p><p>Classe: {record.class_name || 'Sem classe'} · Origem: {record.access_source === 'distribution' ? 'Distribuição' : record.access_source || 'Proprietário'}</p><p className="small text-break">Organização proprietária: {record.uid_organization}<br />Contexto atual: {selectedOrganizationUid}<br />Permissão: {record.permission_source || 'Revalidada por ação na API'}</p>{record.target && <p className="small">Alvo: {record.target.type} · {record.target.uid}</p>}{record.distribution && <p>Política recebida: {record.distribution.revision_policy}</p>}</div>
      {isOwner ? <div className="d-flex flex-wrap gap-2 mb-4"><Button disabled={action.busy || history.loading || !!history.error} onClick={() => begin(() => setUpload({ file: null, summary: '' }))}>Enviar nova revisão</Button><Button variant="outline-secondary" disabled={action.busy} onClick={() => begin(() => setClassUid(record.uid_class || ''))}>Alterar classe</Button><Button variant="outline-secondary" disabled={action.busy || !revisions.length} onClick={() => begin(() => setDistribution({ current: null, form: distributionForm() }))}>Distribuir para organização</Button></div> : <Alert variant="info">Documento recebido. A API disponibiliza a revisão efetiva da distribuição e revalida separadamente o download.</Alert>}
      <h5>Revisões disponíveis</h5><DataTable rows={revisions} loading={history.loading} error={history.error ? history.error.code || 'network_error' : null} columns={[{ key: 'revision_code', label: 'Revisão' }, { key: 'original_filename', label: 'Arquivo' }, { key: 'change_summary', label: 'Resumo da alteração' }, { key: 'size_bytes', label: 'Tamanho', render: row => `${row.size_bytes} bytes` }, { key: 'download', label: 'Arquivo', render: row => <Button size="sm" variant="outline-primary" disabled={action.busy} onClick={() => download(row)}>Baixar</Button> }]} />
      {downloadLink && <Alert variant="info" className="mt-3"><a href={downloadLink.url} target="_blank" rel="noopener noreferrer">Abrir download autorizado</a>{downloadLink.expires_at && <p className="small mb-0">Válido até {new Date(downloadLink.expires_at).toLocaleString('pt-BR')}</p>}</Alert>}
      {isOwner && <section className="mt-4"><h5>Distribuições</h5><DataTable rows={distributions.items} loading={distributions.loading} error={distributions.error} hasMore={!distributions.loading && distributions.hasMore} onLoadMore={distributions.loadMore} columns={[{ key: 'recipient', label: 'Organização destinatária', render: row => row.recipient_organization_name || row.uid_recipient_organization }, { key: 'revision_policy', label: 'Revisão', render: row => row.revision_policy === 'follow_latest' ? 'Acompanhar a mais recente' : 'Revisão fixa' }, { key: 'active', label: 'Ativa', render: row => row.active === false || row.revoked_at ? 'Não' : 'Sim' }, { key: 'actions', label: 'Ações', render: row => <div className="d-flex gap-2"><Button size="sm" variant="outline-secondary" disabled={action.busy || !!row.revoked_at || row.active === false} onClick={() => begin(() => setDistribution({ current: row, form: distributionForm(row) }))}>Editar</Button><Button size="sm" variant="outline-danger" disabled={action.busy || !!row.revoked_at || row.active === false} onClick={() => begin(() => setRemove(row))}>Revogar</Button></div> }]} /></section>}
    </>}
    {upload && <FormDrawer show title="Nova revisão do documento" submitting={action.busy} error={action.error} onSubmit={saveUpload} onHide={() => { if (!action.busy) setUpload(null); }}><fieldset disabled={action.busy}><label htmlFor="ged-file" className="form-label">Arquivo PDF ou JPEG</label><input id="ged-file" type="file" accept="application/pdf,image/jpeg,.pdf,.jpg,.jpeg" required className="form-control mb-3" onChange={event => setUpload({ ...upload, file: event.target.files?.[0] || null })} /><OperationField label="Resumo da alteração" multiline required={revisions.length > 0} maxLength={500} value={upload.summary} onChange={event => setUpload({ ...upload, summary: event.target.value })} /><p className="small text-muted">R00 define o nome e formato canônicos. Novas revisões mantêm esses dados e exigem conteúdo diferente e resumo. A revisão anterior permanece no histórico.</p></fieldset></FormDrawer>}
    {classUid !== null && <FormDrawer show title="Alterar classe documental" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setClassUid(null); }} onSubmit={event => { event.preventDefault(); void action.run(signal => assignDocumentClass({ ...args, uid, classUid, signal }), complete, deny); }}><label className="form-label" htmlFor="document-class-change">Classe</label><Form.Select id="document-class-change" value={classUid} onChange={event => setClassUid(event.target.value)}><option value="">Sem classe</option>{classes.items.filter(row => row.active || row.uid === record?.uid_class).map(row => <option key={row.uid} value={row.uid}>{row.name}</option>)}{classUid && !classes.items.some(row => row.uid === classUid) && <option value={classUid}>{classUid}</option>}</Form.Select>{classes.hasMore && <Button type="button" variant="link" onClick={classes.loadMore} disabled={classes.loading}>Mais classes</Button>}{classes.error && <Alert variant="danger">Erro nas classes: {classes.error}</Alert>}<p className="small mt-3">A alteração muda as concessões explícitas aplicadas ao documento. Cada ação continua independente.</p></FormDrawer>}
    {distribution && <FormDrawer show title={distribution.current ? 'Editar distribuição' : 'Distribuir documento'} submitting={action.busy} error={action.error} onSubmit={saveDistribution} onHide={() => { if (!action.busy) setDistribution(null); }}><fieldset disabled={action.busy}>{!distribution.current && <OperationField label="UUID da organização destinatária" required value={distribution.form.uid_recipient_organization} onChange={event => setDistribution({ ...distribution, form: { ...distribution.form, uid_recipient_organization: event.target.value } })} />}<label className="form-label" htmlFor="distribution-policy">Política de revisão</label><Form.Select id="distribution-policy" className="mb-3" value={distribution.form.revision_policy} onChange={event => setDistribution({ ...distribution, form: { ...distribution.form, revision_policy: event.target.value } })}><option value="follow_latest">Acompanhar a mais recente</option><option value="fixed_revision">Fixar uma revisão</option></Form.Select>{distribution.form.revision_policy === 'fixed_revision' && <><label className="form-label" htmlFor="distribution-fixed">Revisão fixa</label><Form.Select id="distribution-fixed" required value={distribution.form.uid_fixed_revision} onChange={event => setDistribution({ ...distribution, form: { ...distribution.form, uid_fixed_revision: event.target.value } })}><option value="">Selecione</option>{revisions.map(row => <option key={row.uid} value={row.uid}>{row.revision_code} — {row.original_filename}</option>)}</Form.Select></>}<p className="small mt-3">O documento continua pertencendo à organização proprietária. O destinatário recebe acesso de leitura sujeito às permissões e à política selecionada.</p></fieldset></FormDrawer>}
    {remove && <FormDrawer show title="Revogar distribuição" submitLabel="Revogar" submitting={action.busy} error={action.error} onHide={() => { if (!action.busy) setRemove(null); }} onSubmit={event => { event.preventDefault(); void action.run(signal => revokeDocumentDistribution({ ...args, uid: remove.uid, signal }), complete, deny); }}><p>Revogar o acesso da organização {remove.uid_recipient_organization} a este documento?</p></FormDrawer>}
  </>;
}
