'use client';

import { useDetailParam } from '@/lib/navigation/useDetailParam';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import NewButton from '@/components/admin/NewButton';
import FormModal from '@/components/admin/FormModal';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  createAssignment, createEngagement, endEngagement, getCollaborator, listAssignments,
  listCountries, listCountrySubdivisions, listEngagementTypes, listMaritalStatuses, listOrganizationUnits,
  listPositions, patchCollaborator, searchEngagements, updateCollaborator
} from '@/lib/api/endpoints/collaborators';
import { errorMessage } from '@/lib/api/errors';
import { normalizeList } from '@/lib/api/http';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';
import { AssignmentConfiguration } from '@/components/admin/CollaboratorStructure';
import { DEFAULT_COUNTRY_UID, fmtDate, maritalStatusLabel } from '@/lib/domain/collaborators';

const CollaboratorDetailPage = () => {
  const uid = useDetailParam('uid');
  const { token, selectedOrganizationUid: orgUid } = useSession();
  return <CollaboratorDetail key={JSON.stringify([token, orgUid, uid])} token={token} orgUid={orgUid} uid={uid} />;
};

const CollaboratorDetail = ({ token, orgUid, uid }) => {
  const [col, setCol] = useState(null);
  const [engagements, setEngagements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [openAssignment, setOpenAssignment] = useState(null);
  const openEngagements = engagements.filter(engagement => !engagement.ended_on);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tabelas de referência (carregadas sob demanda ao abrir os formulários).
  const [refs, setRefs] = useState({ engagementTypes: [], positions: [], units: [], countries: [], subdivisions: [], maritalStatuses: [] });

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [togglingActive, setTogglingActive] = useState(false);

  const [engOpen, setEngOpen] = useState(false);
  const [engForm, setEngForm] = useState({ uid_engagement_type: '', uid_country: DEFAULT_COUNTRY_UID, started_on: '', is_primary: false });
  const [savingEng, setSavingEng] = useState(false);

  const [asgOpen, setAsgOpen] = useState(false);
  const [asgForm, setAsgForm] = useState({ uid_engagement: '', uid_position: '', uid_organization_unit: '', started_on: '', is_primary: false });
  const [savingAsg, setSavingAsg] = useState(false);

  const reloadAssignments = async signal => {
    const result = await listAssignments({ token, uid, organizationUid: orgUid, signal });
    if (!signal.aborted) setAssignments(normalizeList(result).items);
  };

  const load = useCallback(async signal => {
    setLoading(true);
    setError(null);
    try {
      const detail = await getCollaborator({ token, uid, organizationUid: orgUid, signal });
      if (signal?.aborted) return;
      setCol(detail);
      const [eng, asg, types] = await Promise.all([
        searchEngagements({ token, uid, organizationUid: orgUid, signal }).catch(() => null),
        listAssignments({ token, uid, organizationUid: orgUid, signal }).catch(() => null),
        // Tipos de vínculo são globais/baratos — carregados já no load para
        // exibir o NOME (não o UID) no painel de engagements.
        listEngagementTypes({ token, signal }).catch(() => null)
      ]);
      if (signal?.aborted) return;
      setEngagements(eng ? normalizeList(eng).items : []);
      setAssignments(asg ? normalizeList(asg).items : []);
      if (types) setRefs(r => ({ ...r, engagementTypes: Array.isArray(types) ? types : normalizeList(types).items }));
    } catch (err) {
      if (!signal?.aborted) setError(errorMessage(err));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [token, uid, orgUid]);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => { if (!controller.signal.aborted) void load(controller.signal); });
    return () => controller.abort();
  }, [load]);

  const ensureRefs = useCallback(async (countryUid = DEFAULT_COUNTRY_UID) => {
    try {
      const [types, pos, units, countries, subdivisions, maritalStatuses] = await Promise.all([
        listEngagementTypes({ token }),
        listPositions({ token, organizationUid: orgUid }),
        listOrganizationUnits({ token, organizationUid: orgUid }),
        listCountries({ token }),
        listCountrySubdivisions({ token, countryUid }).catch(() => null),
        listMaritalStatuses({ token }).catch(() => null)
      ]);
      setRefs({
        engagementTypes: Array.isArray(types) ? types : normalizeList(types).items,
        positions: normalizeList(pos).items,
        units: normalizeList(units).items,
        countries: normalizeList(countries).items.slice().sort((a, b) => (a.name || '').localeCompare(b.name || '')),
        subdivisions: subdivisions ? normalizeList(subdivisions).items : [],
        maritalStatuses: maritalStatuses ? normalizeList(maritalStatuses).items : []
      });
    } catch (err) { notifyError(err); }
  }, [token, orgUid]);

  // Recarrega apenas as subdivisões quando o país do engagement muda.
  const reloadSubdivisions = useCallback(async countryUid => {
    try {
      const result = await listCountrySubdivisions({ token, countryUid });
      setRefs(r => ({ ...r, subdivisions: normalizeList(result).items }));
    } catch { setRefs(r => ({ ...r, subdivisions: [] })); }
  }, [token]);

  const openEdit = async () => {
    setEditForm({
      legal_name: col.legal_name ?? '', preferred_name: col.preferred_name ?? '',
      birth_date: col.birth_date ?? '', uid_marital_status: col.uid_marital_status ?? ''
    });
    setEditOpen(true);
    if (!refs.maritalStatuses.length) {
      try { setRefs(r => ({ ...r, maritalStatuses: normalizeList(await listMaritalStatuses({ token })).items })); } catch { /* catálogo opcional */ }
    }
  };

  const saveEdit = async event => {
    event.preventDefault();
    setSavingEdit(true);
    try {
      await updateCollaborator({
        token, uid, organizationUid: orgUid,
        body: {
          legal_name: editForm.legal_name,
          preferred_name: editForm.preferred_name || null,
          birth_date: editForm.birth_date || null,
          uid_marital_status: editForm.uid_marital_status || null,
          active: col.active
        }
      });
      notifySuccess('Colaborador atualizado.');
      setEditOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingEdit(false); }
  };

  const toggleActive = async () => {
    setTogglingActive(true);
    try {
      await patchCollaborator({ token, uid, organizationUid: orgUid, body: { active: !col.active } });
      notifySuccess(col.active ? 'Colaborador desativado.' : 'Colaborador reativado.');
      await load();
    } catch (err) { notifyError(err); } finally { setTogglingActive(false); }
  };

  const openEng = async () => { await ensureRefs(); setEngForm({ uid_engagement_type: '', uid_country: DEFAULT_COUNTRY_UID, uid_country_subdivision: '', started_on: '', is_primary: false }); setEngOpen(true); };
  const saveEng = async event => {
    event.preventDefault();
    setSavingEng(true);
    try {
      await createEngagement({
        token, uid,
        body: {
          uid_organization: orgUid,
          uid_engagement_type: engForm.uid_engagement_type,
          uid_country: engForm.uid_country,
          uid_country_subdivision: engForm.uid_country_subdivision || null,
          uid_contract_entity: null,
          started_on: engForm.started_on,
          ended_on: null,
          is_primary: !!engForm.is_primary
        }
      });
      notifySuccess('Engagement criado.');
      setEngOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingEng(false); }
  };

  const closeEngagement = async eng => {
    const endedOn = new Date().toISOString().slice(0, 10);
    try {
      await endEngagement({ token, uid, engagementUid: eng.uid, organizationUid: orgUid, endedOn });
      notifySuccess('Engagement encerrado.');
      await load();
    } catch (err) { notifyError(err); }
  };

  const openAsg = async () => {
    await ensureRefs();
    setAsgForm({ uid_engagement: openEngagements[0]?.uid ?? '', uid_position: '', uid_organization_unit: '', started_on: '', is_primary: false });
    setAsgOpen(true);
  };
  const saveAsg = async event => {
    event.preventDefault();
    setSavingAsg(true);
    try {
      await createAssignment({
        token, uid, organizationUid: orgUid,
        body: {
          uid_engagement: asgForm.uid_engagement,
          uid_position: asgForm.uid_position,
          uid_organization_unit: asgForm.uid_organization_unit,
          started_on: asgForm.started_on,
          is_primary: !!asgForm.is_primary
        }
      });
      notifySuccess('Lotação (assignment) criada.');
      setAsgOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingAsg(false); }
  };

  const posName = u => refs.positions.find(p => p.uid === u)?.name || u || '—';
  const unitName = u => refs.units.find(x => x.uid === u)?.name || u || '—';
  const engTypeName = u => {
    const t = refs.engagementTypes.find(x => x.uid === u);
    return t?.canonical_name || t?.code || (u ? `${u.slice(0, 8)}…` : '—');
  };

  if (loading) return <div className="content-wrapper"><div className="text-center py-5"><Spinner animation="border" /></div></div>;
  if (error) return <div className="content-wrapper"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title={col.preferred_name || col.legal_name} subTitle1="Colaboradores" />

      <Row className="g-3">
        <Col lg={5}>
          <Card className="panel">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="mb-0">Identidade</h5>
                <Button size="sm" variant="outline-primary" onClick={openEdit}>Editar</Button>
              </div>
              <dl className="row mb-0 small">
                <dt className="col-sm-5 text-muted">Nome legal</dt><dd className="col-sm-7">{col.legal_name}</dd>
                <dt className="col-sm-5 text-muted">Nome preferencial</dt><dd className="col-sm-7">{col.preferred_name || '—'}</dd>
                <dt className="col-sm-5 text-muted">Nascimento</dt><dd className="col-sm-7">{fmtDate(col.birth_date)}</dd>
                <dt className="col-sm-5 text-muted">Estado civil</dt><dd className="col-sm-7">{col.marital_status ? maritalStatusLabel(col.marital_status) : (refs.maritalStatuses.find(s => s.uid === col.uid_marital_status) ? maritalStatusLabel(refs.maritalStatuses.find(s => s.uid === col.uid_marital_status)) : (col.uid_marital_status ? '—' : 'Não informado'))}</dd>
                <dt className="col-sm-5 text-muted">Estado</dt><dd className="col-sm-7"><StatusBadge status={col.active ? 'active' : 'inactive'} /></dd>
                <dt className="col-sm-5 text-muted">UID</dt><dd className="col-sm-7 font-monospace">{col.uid}</dd>
                <dt className="col-sm-5 text-muted">Criado em</dt><dd className="col-sm-7">{col.created_at ? new Date(col.created_at).toLocaleString('pt-BR') : '—'}</dd>
              </dl>
              <hr />
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small">{col.active ? 'Colaborador ativo na organização.' : 'Colaborador inativo — histórico permanece legível.'}</span>
                <Button size="sm" variant={col.active ? 'outline-danger' : 'outline-success'} onClick={toggleActive} disabled={togglingActive}>
                  {togglingActive ? <Spinner size="sm" animation="border" /> : (col.active ? 'Desativar' : 'Reativar')}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="panel">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Vínculos (engagements)</h5>
                <NewButton label="Novo engagement" size="sm" variant="outline-primary" onClick={openEng} />
              </div>
              {engagements.length === 0 && <p className="text-muted small mb-0">Nenhum vínculo registrado.</p>}
              {engagements.map(e => (
                <div key={e.uid} className="d-flex justify-content-between align-items-center border-bottom py-2 small">
                  <div>
                    {e.is_primary && <Badge bg="info" text="dark" className="me-2">principal</Badge>}
                    <span>{engTypeName(e.uid_engagement_type)}</span>
                    <span className="text-muted ms-2">{fmtDate(e.started_on)} → {e.ended_on ? fmtDate(e.ended_on) : 'em aberto'}</span>
                  </div>
                  {!e.ended_on && <Button size="sm" variant="link" className="text-danger p-0" onClick={() => closeEngagement(e)}>encerrar</Button>}
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card className="panel mt-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Lotações (assignments)</h5>
                <NewButton label="Nova lotação" size="sm" variant="outline-primary" onClick={openAsg} disabled={col.active === false || !openEngagements.length}
                  title={openEngagements.length === 0 ? 'O colaborador precisa de um vínculo em aberto' : undefined} />
              </div>
              {assignments.length === 0 && <p className="text-muted small mb-0">Nenhuma lotação registrada.</p>}
              {assignments.map(a => (
                <div key={a.uid} className="border-bottom py-2 small">
                  {a.is_primary && <Badge bg="info" text="dark" className="me-2">principal</Badge>}
                  <strong>{posName(a.uid_position)}</strong>
                  <span className="text-muted ms-2">em {unitName(a.uid_organization_unit)}</span>
                  <span className="text-muted ms-2">· desde {fmtDate(a.started_on)}</span>
                  {a.ended_on && <span className="text-muted ms-2">até {fmtDate(a.ended_on)}</span>}
                  <Button type="button" size="sm" variant="link" aria-expanded={openAssignment === a.uid}
                    onClick={() => setOpenAssignment(openAssignment === a.uid ? null : a.uid)}>Detalhes da lotação</Button>
                  {openAssignment === a.uid && <AssignmentConfiguration key={`${orgUid}:${a.uid}`} uid={uid}
                    organizationUid={orgUid} assignmentUid={a.uid} reloadAssignments={reloadAssignments}
                    canWrite={col.active !== false && openEngagements.some(e => e.uid === a.uid_engagement)} />}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <FormModal show={editOpen} onHide={() => setEditOpen(false)} title="Editar colaborador" onSubmit={saveEdit} submitting={savingEdit}>
        {editForm && (
          <>
            <div className="mb-3">
              <label className="form-label">Nome legal</label>
              <input className="form-control" value={editForm.legal_name} onChange={e => setEditForm(f => ({ ...f, legal_name: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Nome preferencial</label>
              <input className="form-control" value={editForm.preferred_name} onChange={e => setEditForm(f => ({ ...f, preferred_name: e.target.value }))} />
            </div>
            <div className="mb-3">
              <label className="form-label">Data de nascimento</label>
              <input type="date" className="form-control" value={editForm.birth_date || ''} onChange={e => setEditForm(f => ({ ...f, birth_date: e.target.value }))} />
            </div>
            {refs.maritalStatuses.length > 0 && <div className="mb-3">
              <label className="form-label">Estado civil <span className="text-muted small">(opcional)</span></label>
              <Form.Select value={editForm.uid_marital_status || ''} onChange={e => setEditForm(f => ({ ...f, uid_marital_status: e.target.value }))}>
                <option value="">Não informado</option>
                {refs.maritalStatuses.map(s => <option key={s.uid} value={s.uid}>{maritalStatusLabel(s)}</option>)}
              </Form.Select>
            </div>}
          </>
        )}
      </FormModal>

      <FormModal show={engOpen} onHide={() => setEngOpen(false)} title="Novo engagement" onSubmit={saveEng} submitting={savingEng}>
        <div className="mb-3">
          <label className="form-label">Tipo de vínculo</label>
          <Form.Select value={engForm.uid_engagement_type} onChange={e => setEngForm(f => ({ ...f, uid_engagement_type: e.target.value }))} required>
            <option value="">Selecione...</option>
            {refs.engagementTypes.map(t => <option key={t.uid} value={t.uid}>{t.canonical_name || t.code}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">País</label>
          <Form.Select value={engForm.uid_country} onChange={e => { const uid_country = e.target.value; setEngForm(f => ({ ...f, uid_country, uid_country_subdivision: '' })); void reloadSubdivisions(uid_country); }} required>
            {refs.countries.length === 0 && <option value={DEFAULT_COUNTRY_UID}>Brasil</option>}
            {refs.countries.map(c => <option key={c.uid} value={c.uid}>{c.name}{c.code ? ` (${c.code})` : ''}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Subdivisão (UF/estado) <span className="text-muted small">(opcional)</span></label>
          <Form.Select value={engForm.uid_country_subdivision} onChange={e => setEngForm(f => ({ ...f, uid_country_subdivision: e.target.value }))} disabled={refs.subdivisions.length === 0}>
            <option value="">{refs.subdivisions.length === 0 ? 'Sem subdivisões para o país' : 'Não informada'}</option>
            {refs.subdivisions.map(s => <option key={s.uid} value={s.uid}>{s.name}{s.code ? ` (${s.code})` : ''}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Início</label>
          <input type="date" className="form-control" value={engForm.started_on} onChange={e => setEngForm(f => ({ ...f, started_on: e.target.value }))} required />
        </div>
        <Form.Check type="switch" id="eng-primary" label="Vínculo principal" checked={engForm.is_primary} onChange={e => setEngForm(f => ({ ...f, is_primary: e.target.checked }))} />
      </FormModal>

      <FormModal show={asgOpen} onHide={() => setAsgOpen(false)} title="Nova lotação" onSubmit={saveAsg} submitting={savingAsg}>
        <div className="mb-3">
          <label className="form-label">Engagement</label>
          <Form.Select value={asgForm.uid_engagement} onChange={e => setAsgForm(f => ({ ...f, uid_engagement: e.target.value }))} required>
            <option value="">Selecione...</option>
            {openEngagements.map(e => <option key={e.uid} value={e.uid}>{fmtDate(e.started_on)} {e.is_primary ? '(principal)' : ''}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Posição</label>
          <Form.Select value={asgForm.uid_position} onChange={e => setAsgForm(f => ({ ...f, uid_position: e.target.value }))} required>
            <option value="">Selecione...</option>
            {refs.positions.filter(p => p.active !== false).map(p => <option key={p.uid} value={p.uid}>{p.name}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Unidade organizacional</label>
          <Form.Select value={asgForm.uid_organization_unit} onChange={e => setAsgForm(f => ({ ...f, uid_organization_unit: e.target.value }))} required>
            <option value="">Selecione...</option>
            {refs.units.filter(u => u.active !== false).map(u => <option key={u.uid} value={u.uid}>{u.name}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Início</label>
          <input type="date" className="form-control" value={asgForm.started_on} onChange={e => setAsgForm(f => ({ ...f, started_on: e.target.value }))} required />
        </div>
        <Form.Check type="switch" id="asg-primary" label="Lotação principal" checked={asgForm.is_primary} onChange={e => setAsgForm(f => ({ ...f, is_primary: e.target.checked }))} />
      </FormModal>
    </div>
  );
};

export default CollaboratorDetailPage;
