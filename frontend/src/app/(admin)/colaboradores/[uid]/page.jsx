'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import FormDrawer from '@/components/admin/FormDrawer';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  createAssignment, createEngagement, endEngagement, getCollaborator, listAssignments,
  listCountries, listEngagementTypes, listOrganizationUnits, listPositions, patchCollaborator,
  searchEngagements, updateCollaborator
} from '@/lib/api/endpoints/collaborators';
import { errorMessage } from '@/lib/api/errors';
import { normalizeList } from '@/lib/api/http';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';
import { DEFAULT_COUNTRY_UID, fmtDate } from '@/lib/domain/collaborators';

const CollaboratorDetailPage = () => {
  const { uid } = useParams();
  const { token, selectedOrganizationUid: orgUid } = useSession();

  const [col, setCol] = useState(null);
  const [engagements, setEngagements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tabelas de referência (carregadas sob demanda ao abrir os formulários).
  const [refs, setRefs] = useState({ engagementTypes: [], positions: [], units: [], countries: [] });

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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const detail = await getCollaborator({ token, uid, organizationUid: orgUid });
      setCol(detail);
      const [eng, asg, types] = await Promise.all([
        searchEngagements({ token, uid, organizationUid: orgUid }).catch(() => null),
        listAssignments({ token, uid, organizationUid: orgUid }).catch(() => null),
        // Tipos de vínculo são globais/baratos — carregados já no load para
        // exibir o NOME (não o UID) no painel de engagements.
        listEngagementTypes({ token }).catch(() => null)
      ]);
      setEngagements(eng ? normalizeList(eng).items : []);
      setAssignments(asg ? normalizeList(asg).items : []);
      if (types) setRefs(r => ({ ...r, engagementTypes: Array.isArray(types) ? types : normalizeList(types).items }));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token, uid, orgUid]);

  useEffect(() => { void load(); }, [load]);

  const ensureRefs = useCallback(async () => {
    try {
      const [types, pos, units, countries] = await Promise.all([
        listEngagementTypes({ token }),
        listPositions({ token, organizationUid: orgUid }),
        listOrganizationUnits({ token, organizationUid: orgUid }),
        listCountries({ token })
      ]);
      setRefs({
        engagementTypes: Array.isArray(types) ? types : normalizeList(types).items,
        positions: normalizeList(pos).items,
        units: normalizeList(units).items,
        countries: normalizeList(countries).items.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      });
    } catch (err) { notifyError(err); }
  }, [token, orgUid]);

  const openEdit = () => {
    setEditForm({
      legal_name: col.legal_name ?? '', preferred_name: col.preferred_name ?? '',
      birth_date: col.birth_date ?? ''
    });
    setEditOpen(true);
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

  const openEng = async () => { await ensureRefs(); setEngForm({ uid_engagement_type: '', uid_country: DEFAULT_COUNTRY_UID, started_on: '', is_primary: false }); setEngOpen(true); };
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
          uid_country_subdivision: null,
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
    setAsgForm({ uid_engagement: engagements[0]?.uid ?? '', uid_position: '', uid_organization_unit: '', started_on: '', is_primary: false });
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
                <Button size="sm" variant="outline-primary" onClick={openEng}>Novo engagement</Button>
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
                <Button size="sm" variant="outline-primary" onClick={openAsg} disabled={engagements.length === 0}
                  title={engagements.length === 0 ? 'Crie um engagement antes de lotar o colaborador' : undefined}>
                  Nova lotação
                </Button>
              </div>
              {assignments.length === 0 && <p className="text-muted small mb-0">Nenhuma lotação registrada.</p>}
              {assignments.map(a => (
                <div key={a.uid} className="border-bottom py-2 small">
                  {a.is_primary && <Badge bg="info" text="dark" className="me-2">principal</Badge>}
                  <strong>{posName(a.uid_position)}</strong>
                  <span className="text-muted ms-2">em {unitName(a.uid_organization_unit)}</span>
                  <span className="text-muted ms-2">· desde {fmtDate(a.started_on)}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <FormDrawer show={editOpen} onHide={() => setEditOpen(false)} title="Editar colaborador" onSubmit={saveEdit} submitting={savingEdit}>
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
          </>
        )}
      </FormDrawer>

      <FormDrawer show={engOpen} onHide={() => setEngOpen(false)} title="Novo engagement" onSubmit={saveEng} submitting={savingEng}>
        <div className="mb-3">
          <label className="form-label">Tipo de vínculo</label>
          <Form.Select value={engForm.uid_engagement_type} onChange={e => setEngForm(f => ({ ...f, uid_engagement_type: e.target.value }))} required>
            <option value="">Selecione...</option>
            {refs.engagementTypes.map(t => <option key={t.uid} value={t.uid}>{t.canonical_name || t.code}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">País</label>
          <Form.Select value={engForm.uid_country} onChange={e => setEngForm(f => ({ ...f, uid_country: e.target.value }))} required>
            {refs.countries.length === 0 && <option value={DEFAULT_COUNTRY_UID}>Brasil</option>}
            {refs.countries.map(c => <option key={c.uid} value={c.uid}>{c.name}{c.code ? ` (${c.code})` : ''}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Início</label>
          <input type="date" className="form-control" value={engForm.started_on} onChange={e => setEngForm(f => ({ ...f, started_on: e.target.value }))} required />
        </div>
        <Form.Check type="switch" id="eng-primary" label="Vínculo principal" checked={engForm.is_primary} onChange={e => setEngForm(f => ({ ...f, is_primary: e.target.checked }))} />
      </FormDrawer>

      <FormDrawer show={asgOpen} onHide={() => setAsgOpen(false)} title="Nova lotação" onSubmit={saveAsg} submitting={savingAsg}>
        <div className="mb-3">
          <label className="form-label">Engagement</label>
          <Form.Select value={asgForm.uid_engagement} onChange={e => setAsgForm(f => ({ ...f, uid_engagement: e.target.value }))} required>
            <option value="">Selecione...</option>
            {engagements.map(e => <option key={e.uid} value={e.uid}>{fmtDate(e.started_on)} {e.is_primary ? '(principal)' : ''}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Posição</label>
          <Form.Select value={asgForm.uid_position} onChange={e => setAsgForm(f => ({ ...f, uid_position: e.target.value }))} required>
            <option value="">Selecione...</option>
            {refs.positions.map(p => <option key={p.uid} value={p.uid}>{p.name}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Unidade organizacional</label>
          <Form.Select value={asgForm.uid_organization_unit} onChange={e => setAsgForm(f => ({ ...f, uid_organization_unit: e.target.value }))} required>
            <option value="">Selecione...</option>
            {refs.units.map(u => <option key={u.uid} value={u.uid}>{u.name}</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Início</label>
          <input type="date" className="form-control" value={asgForm.started_on} onChange={e => setAsgForm(f => ({ ...f, started_on: e.target.value }))} required />
        </div>
        <Form.Check type="switch" id="asg-primary" label="Lotação principal" checked={asgForm.is_primary} onChange={e => setAsgForm(f => ({ ...f, is_primary: e.target.checked }))} />
      </FormDrawer>
    </div>
  );
};

export default CollaboratorDetailPage;
