'use client';

import { useRouter } from 'next/navigation';
import { useDetailParam } from '@/lib/navigation/useDetailParam';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import NewButton from '@/components/admin/NewButton';
import FormModal from '@/components/admin/FormModal';
import PlatformLogo from '@/components/admin/PlatformLogo';
import OrganizationGate from '@/components/admin/OrganizationGate';
import StatusBadge from '@/components/admin/StatusBadge';
import {
  createEntityType, createUnit, deleteEntity, getEntity, patchEntityLifecycle, replaceEntityTypes,
  searchEntityTypes, searchUnits, updateEntity
} from '@/lib/api/endpoints/entities';
import { createAddress, deleteAddress, listAddresses, patchAddress } from '@/lib/api/endpoints/addresses';
import { situationsApi } from '@/lib/api/endpoints/situations';
import { errorMessage } from '@/lib/api/errors';
import { normalizeList } from '@/lib/api/http';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';
import { ADDRESS_PURPOSES, situationBadgeStatus, situationName } from '@/lib/domain/fleet';

const EMPTY_ADDRESS = {
  postal_code: '', region: '', city: '', district: '', address_line1: '', number: '', complement: '', purpose: 'headquarters'
};

const EntityDetailInner = () => {
  const uid = useDetailParam('uid');
  const router = useRouter();
  const { token, selectedOrganizationUid: orgUid } = useSession();

  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [situations, setSituations] = useState({});
  const [typeCatalog, setTypeCatalog] = useState([]);
  const [units, setUnits] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [typesOpen, setTypesOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [savingTypes, setSavingTypes] = useState(false);
  const [newType, setNewType] = useState({ code: '', name: '' });

  const [unitOpen, setUnitOpen] = useState(false);
  const [unitName, setUnitName] = useState('');
  const [savingUnit, setSavingUnit] = useState(false);

  const [addrOpen, setAddrOpen] = useState(false);
  const [addr, setAddr] = useState(EMPTY_ADDRESS);
  const [savingAddr, setSavingAddr] = useState(false);

  const [editAddrOpen, setEditAddrOpen] = useState(false);
  const [editAddrUid, setEditAddrUid] = useState(null);
  const [editAddr, setEditAddr] = useState(EMPTY_ADDRESS);
  const [savingEditAddr, setSavingEditAddr] = useState(false);
  const [busyAddr, setBusyAddr] = useState(false);

  const [lifecycleOpen, setLifecycleOpen] = useState(false);
  const [lifecycle, setLifecycle] = useState({ state: 'blocked', reason: '' });
  const [savingLifecycle, setSavingLifecycle] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const loadAddresses = useCallback(async () => {
    try {
      const res = await listAddresses({ token, organizationUid: orgUid, linkCode: 'entity', linkUid: uid });
      setAddresses(normalizeList(res).items);
    } catch { setAddresses([]); }
  }, [token, orgUid, uid]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const detail = await getEntity({ token, entityUid: uid });
      setEntity(detail);
      const [sit, unitList] = await Promise.all([
        situationsApi.list({ token, limit: 100 }).catch(() => null),
        searchUnits({ token, organizationUid: orgUid, entityUid: uid }).catch(() => null)
      ]);
      if (sit) {
        const map = {};
        for (const s of normalizeList(sit).items) map[s.uid] = s;
        setSituations(map);
      }
      setUnits(unitList ? normalizeList(unitList).items : []);
      await loadAddresses();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [token, uid, orgUid, loadAddresses]);

  useEffect(() => { void load(); }, [load]);

  const openEdit = () => { setEditName(entity.name ?? ''); setEditOpen(true); };
  const saveEdit = async event => {
    event.preventDefault();
    setSavingEdit(true);
    try {
      await updateEntity({ token, entityUid: uid, body: { name: editName } });
      notifySuccess('Entidade atualizada.');
      setEditOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingEdit(false); }
  };

  const openTypes = async () => {
    setSelectedTypes((entity.types || []).map(t => t.uid));
    try {
      const res = await searchEntityTypes({ token, organizationUid: orgUid });
      setTypeCatalog(normalizeList(res).items);
    } catch (err) { notifyError(err); }
    setTypesOpen(true);
  };
  const toggleType = u => setSelectedTypes(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u]);
  const saveTypes = async event => {
    event.preventDefault();
    if (selectedTypes.length === 0) { notifyError(new Error('Selecione ao menos um tipo.')); return; }
    setSavingTypes(true);
    try {
      await replaceEntityTypes({ token, entityUid: uid, types: selectedTypes });
      notifySuccess('Tipos atualizados.');
      setTypesOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingTypes(false); }
  };
  const addType = async () => {
    if (!newType.code.trim() || !newType.name.trim()) return;
    try {
      const created = await createEntityType({ token, organizationUid: orgUid, code: newType.code.trim(), name: newType.name.trim() });
      setTypeCatalog(prev => [...prev, created]);
      setSelectedTypes(prev => [...prev, created.uid]);
      setNewType({ code: '', name: '' });
    } catch (err) { notifyError(err); }
  };

  const openUnit = () => { setUnitName(''); setUnitOpen(true); };
  const saveUnit = async event => {
    event.preventDefault();
    setSavingUnit(true);
    try {
      await createUnit({ token, organizationUid: orgUid, entityUid: uid, name: unitName });
      notifySuccess('Unidade criada.');
      setUnitOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingUnit(false); }
  };

  const openAddr = () => { setAddr(EMPTY_ADDRESS); setAddrOpen(true); };
  const saveAddr = async event => {
    event.preventDefault();
    setSavingAddr(true);
    try {
      await createAddress({
        token,
        body: {
          link_code: 'entity', uid_link: uid, country_code: 'BR',
          postal_code: addr.postal_code, region: addr.region, city: addr.city, district: addr.district,
          address_line1: addr.address_line1, number: addr.number, complement: addr.complement || null,
          purposes: [{ code: addr.purpose, is_primary: true }]
        }
      });
      notifySuccess('Endereço cadastrado.');
      setAddrOpen(false);
      await loadAddresses();
    } catch (err) { notifyError(err); } finally { setSavingAddr(false); }
  };

  const openEditAddr = address => {
    setEditAddrUid(address.uid);
    setEditAddr({
      postal_code: address.postal_code || '', region: address.region || '', city: address.city || '',
      district: address.district || '', address_line1: address.address_line1 || '', number: address.number || '',
      complement: address.complement || '', purpose: address.purposes?.[0]?.code || 'headquarters'
    });
    setEditAddrOpen(true);
  };
  const saveEditAddr = async event => {
    event.preventDefault();
    setSavingEditAddr(true);
    try {
      await patchAddress({
        token, addressUid: editAddrUid, organizationUid: orgUid,
        body: {
          postal_code: editAddr.postal_code, region: editAddr.region, city: editAddr.city, district: editAddr.district,
          address_line1: editAddr.address_line1, number: editAddr.number, complement: editAddr.complement || null,
          purposes: [{ code: editAddr.purpose, is_primary: true }]
        }
      });
      notifySuccess('Endereço atualizado.');
      setEditAddrOpen(false);
      await loadAddresses();
    } catch (err) { notifyError(err); } finally { setSavingEditAddr(false); }
  };

  const doDeleteAddr = async address => {
    if (!window.confirm('Remover este endereço?')) return;
    setBusyAddr(true);
    try {
      await deleteAddress({ token, addressUid: address.uid, organizationUid: orgUid });
      notifySuccess('Endereço removido.');
      await loadAddresses();
    } catch (err) { notifyError(err); } finally { setBusyAddr(false); }
  };

  const openLifecycle = () => { setLifecycle({ state: 'blocked', reason: '' }); setLifecycleOpen(true); };
  const saveLifecycle = async event => {
    event.preventDefault();
    if (lifecycle.state !== 'active' && !lifecycle.reason.trim()) {
      notifyError(new Error('Informe o motivo.'));
      return;
    }
    setSavingLifecycle(true);
    try {
      await patchEntityLifecycle({ token, entityUid: uid, state: lifecycle.state, reason: lifecycle.reason.trim() || undefined });
      notifySuccess('Situação alterada.');
      setLifecycleOpen(false);
      await load();
    } catch (err) { notifyError(err); } finally { setSavingLifecycle(false); }
  };

  const doDeleteEntity = async () => {
    if (!window.confirm('Excluir esta entidade? Esta ação é física e pode ser bloqueada se houver dependências.')) return;
    setDeleting(true);
    try {
      await deleteEntity({ token, entityUid: uid });
      notifySuccess('Entidade excluída.');
      router.push('/entidades');
    } catch (err) { notifyError(err); setDeleting(false); }
  };

  if (loading) return <div className="content-wrapper"><div className="text-center py-5"><Spinner animation="border" /></div></div>;
  if (error) return <div className="content-wrapper"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title={entity.name} subTitle1="Operação" subTitle2="Entidades" />

      <Row className="g-3">
        <Col lg={5}>
          <Card className="panel">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="mb-0">Dados cadastrais</h5>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={openEdit}>Editar</Button>
                  <Button size="sm" variant="outline-danger" disabled={deleting} onClick={doDeleteEntity}>Excluir</Button>
                </div>
              </div>
              <dl className="row mb-0 small">
                <dt className="col-sm-5 text-muted">Nome</dt><dd className="col-sm-7">{entity.name}</dd>
                <dt className="col-sm-5 text-muted">Situação</dt>
                <dd className="col-sm-7 d-flex align-items-center gap-2">
                  {entity.uid_situations
                    ? <StatusBadge status={situationBadgeStatus(entity.uid_situations, situations)} label={situationName(entity.uid_situations, situations)} />
                    : '—'}
                  <Button size="sm" variant="link" className="p-0" onClick={openLifecycle}>Alterar</Button>
                </dd>
                <dt className="col-sm-5 text-muted">UID</dt><dd className="col-sm-7 font-monospace">{entity.uid}</dd>
                <dt className="col-sm-5 text-muted">Criada em</dt><dd className="col-sm-7">{entity.created_at ? new Date(entity.created_at).toLocaleString('pt-BR') : '—'}</dd>
              </dl>
              <p className="text-muted small mb-0 mt-3">Organização é imutável após a criação.</p>
            </Card.Body>
          </Card>
          <PlatformLogo owner="entity" uid={entity.uid} imageUid={entity.uid_image_logo} />

          <Card className="panel mt-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Tipos</h5>
                <Button size="sm" variant="outline-primary" onClick={openTypes}>Editar tipos</Button>
              </div>
              {(entity.types || []).length === 0 && <p className="text-muted small mb-0">Nenhum tipo definido.</p>}
              <div className="d-flex flex-wrap gap-2">
                {(entity.types || []).map(t => (
                  <Badge key={t.uid} bg="light" text="dark" className="border">
                    {t.name || t.code}{t.is_system && <span className="text-muted ms-1">(sistema)</span>}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="panel">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Unidades</h5>
                <NewButton label="Nova unidade" size="sm" variant="outline-primary" onClick={openUnit} />
              </div>
              {units.length === 0 && <p className="text-muted small mb-0">Nenhuma unidade cadastrada.</p>}
              {units.map(u => (
                <div key={u.uid} className="d-flex justify-content-between border-bottom py-2 small">
                  <span>{u.name}</span>
                  <span className="text-muted font-monospace">{String(u.uid).slice(0, 8)}…</span>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card className="panel mt-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Endereços</h5>
                <NewButton label="Cadastrar endereço" size="sm" variant="outline-primary" onClick={openAddr} />
              </div>
              {addresses.length === 0 && <p className="text-muted small mb-0">Nenhum endereço cadastrado.</p>}
              {addresses.map(a => (
                <div key={a.uid} className="d-flex justify-content-between align-items-start border-bottom py-2 small">
                  <div>
                    <div>{a.address_line1}, {a.number} — {a.city}/{a.region}</div>
                    <div className="text-muted">CEP {a.postal_code}{a.district ? ` · ${a.district}` : ''}</div>
                    <div className="d-flex gap-1 mt-1">
                      {(a.purposes || []).map(p => (
                        <Badge key={p.code} bg="light" text="dark" className="border">
                          {ADDRESS_PURPOSES.find(ap => ap.code === p.code)?.label || p.code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0 ms-2">
                    <Button size="sm" variant="outline-primary" disabled={busyAddr} onClick={() => openEditAddr(a)}>Editar</Button>
                    <Button size="sm" variant="outline-danger" disabled={busyAddr} onClick={() => doDeleteAddr(a)}>Remover</Button>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <FormModal show={editOpen} onHide={() => setEditOpen(false)} title="Editar entidade" onSubmit={saveEdit} submitting={savingEdit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input className="form-control" value={editName} onChange={e => setEditName(e.target.value)} required />
        </div>
      </FormModal>

      <FormModal show={typesOpen} onHide={() => setTypesOpen(false)} title="Editar tipos" onSubmit={saveTypes} submitting={savingTypes}>
        <p className="text-muted small">Substituição completa — não é possível salvar com zero tipos.</p>
        <div className="d-flex flex-column gap-2 mb-3">
          {typeCatalog.map(t => (
            <Form.Check
              key={t.uid} type="checkbox" id={`type-${t.uid}`}
              label={<span>{t.name || t.code}{t.is_system && <span className="text-muted ms-1 small">(sistema)</span>}</span>}
              checked={selectedTypes.includes(t.uid)} onChange={() => toggleType(t.uid)}
            />
          ))}
          {typeCatalog.length === 0 && <span className="text-muted small">Nenhum tipo no catálogo desta organização.</span>}
        </div>
        <hr />
        <label className="form-label small text-muted">Criar novo tipo</label>
        <div className="d-flex gap-2 mb-2">
          <input className="form-control" placeholder="código" value={newType.code} onChange={e => setNewType(n => ({ ...n, code: e.target.value }))} />
          <input className="form-control" placeholder="nome" value={newType.name} onChange={e => setNewType(n => ({ ...n, name: e.target.value }))} />
          <Button type="button" variant="outline-secondary" onClick={addType}>+</Button>
        </div>
      </FormModal>

      <FormModal show={unitOpen} onHide={() => setUnitOpen(false)} title="Nova unidade" onSubmit={saveUnit} submitting={savingUnit}>
        <div className="mb-3">
          <label className="form-label">Nome da unidade</label>
          <input className="form-control" value={unitName} onChange={e => setUnitName(e.target.value)} required />
        </div>
        <p className="text-muted small">A unidade pertence a esta entidade.</p>
      </FormModal>

      <FormModal show={addrOpen} onHide={() => setAddrOpen(false)} title="Cadastrar endereço" onSubmit={saveAddr} submitting={savingAddr}>
        <div className="row g-2">
          <div className="col-5 mb-2"><label className="form-label">CEP</label><input className="form-control" value={addr.postal_code} onChange={e => setAddr(a => ({ ...a, postal_code: e.target.value }))} required /></div>
          <div className="col-7 mb-2"><label className="form-label">Cidade</label><input className="form-control" value={addr.city} onChange={e => setAddr(a => ({ ...a, city: e.target.value }))} required /></div>
          <div className="col-4 mb-2"><label className="form-label">UF</label><input className="form-control" value={addr.region} onChange={e => setAddr(a => ({ ...a, region: e.target.value }))} required /></div>
          <div className="col-8 mb-2"><label className="form-label">Bairro</label><input className="form-control" value={addr.district} onChange={e => setAddr(a => ({ ...a, district: e.target.value }))} /></div>
          <div className="col-9 mb-2"><label className="form-label">Logradouro</label><input className="form-control" value={addr.address_line1} onChange={e => setAddr(a => ({ ...a, address_line1: e.target.value }))} required /></div>
          <div className="col-3 mb-2"><label className="form-label">Número</label><input className="form-control" value={addr.number} onChange={e => setAddr(a => ({ ...a, number: e.target.value }))} /></div>
          <div className="col-12 mb-2"><label className="form-label">Complemento</label><input className="form-control" value={addr.complement} onChange={e => setAddr(a => ({ ...a, complement: e.target.value }))} /></div>
          <div className="col-12 mb-2">
            <label className="form-label">Finalidade</label>
            <Form.Select value={addr.purpose} onChange={e => setAddr(a => ({ ...a, purpose: e.target.value }))}>
              {ADDRESS_PURPOSES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
            </Form.Select>
          </div>
        </div>
      </FormModal>

      <FormModal show={editAddrOpen} onHide={() => setEditAddrOpen(false)} title="Editar endereço" onSubmit={saveEditAddr} submitting={savingEditAddr}>
        <div className="row g-2">
          <div className="col-5 mb-2"><label className="form-label">CEP</label><input className="form-control" value={editAddr.postal_code} onChange={e => setEditAddr(a => ({ ...a, postal_code: e.target.value }))} required /></div>
          <div className="col-7 mb-2"><label className="form-label">Cidade</label><input className="form-control" value={editAddr.city} onChange={e => setEditAddr(a => ({ ...a, city: e.target.value }))} required /></div>
          <div className="col-4 mb-2"><label className="form-label">UF</label><input className="form-control" value={editAddr.region} onChange={e => setEditAddr(a => ({ ...a, region: e.target.value }))} required /></div>
          <div className="col-8 mb-2"><label className="form-label">Bairro</label><input className="form-control" value={editAddr.district} onChange={e => setEditAddr(a => ({ ...a, district: e.target.value }))} /></div>
          <div className="col-9 mb-2"><label className="form-label">Logradouro</label><input className="form-control" value={editAddr.address_line1} onChange={e => setEditAddr(a => ({ ...a, address_line1: e.target.value }))} required /></div>
          <div className="col-3 mb-2"><label className="form-label">Número</label><input className="form-control" value={editAddr.number} onChange={e => setEditAddr(a => ({ ...a, number: e.target.value }))} /></div>
          <div className="col-12 mb-2"><label className="form-label">Complemento</label><input className="form-control" value={editAddr.complement} onChange={e => setEditAddr(a => ({ ...a, complement: e.target.value }))} /></div>
          <div className="col-12 mb-2">
            <label className="form-label">Finalidade</label>
            <Form.Select value={editAddr.purpose} onChange={e => setEditAddr(a => ({ ...a, purpose: e.target.value }))}>
              {ADDRESS_PURPOSES.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
            </Form.Select>
          </div>
        </div>
      </FormModal>

      <FormModal show={lifecycleOpen} onHide={() => setLifecycleOpen(false)} title="Alterar situação" onSubmit={saveLifecycle} submitting={savingLifecycle}>
        <div className="mb-3">
          <label className="form-label">Novo estado</label>
          <Form.Select value={lifecycle.state} onChange={e => setLifecycle(l => ({ ...l, state: e.target.value }))}>
            <option value="active">Ativa</option>
            <option value="blocked">Bloqueada</option>
            <option value="inactive">Inativa</option>
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Motivo {lifecycle.state !== 'active' && <span className="text-danger">*</span>}</label>
          <textarea className="form-control" rows={3} value={lifecycle.reason} onChange={e => setLifecycle(l => ({ ...l, reason: e.target.value }))} />
        </div>
      </FormModal>
    </div>
  );
};

const EntityDetailPage = () => (
  <OrganizationGate>
    <EntityDetailInner />
  </OrganizationGate>
);

export default EntityDetailPage;
