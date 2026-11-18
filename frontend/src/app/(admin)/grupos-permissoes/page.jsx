'use client';

import { useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import DataTable from '@/components/admin/DataTable';
import FormDrawer from '@/components/admin/FormDrawer';
import { useOffsetList } from '@/hooks/useOffsetList';
import { groupsPermissionsApi } from '@/lib/api/endpoints/groupsPermissions';
import { notifyError, notifySuccess } from '@/lib/ui/toast';
import { useSession } from '@/lib/session/SessionContext';

const GROUPS = ['primary_admin', 'administrator', 'secondary_admin', 'basic_user'];
const GROUP_LABELS = { primary_admin: 'Primary', administrator: 'Administrator', secondary_admin: 'Secondary', basic_user: 'Basic' };

const GroupsPermissionsPage = () => {
  const { token } = useSession();
  const { items, loading, error, hasMore, loadMore, refresh } = useOffsetList(args => groupsPermissionsApi.list(args));

  const [open, setOpen] = useState(false);
  const [groupCode, setGroupCode] = useState('basic_user');
  const [permissionCode, setPermissionCode] = useState('');
  const [saving, setSaving] = useState(false);

  const byGroup = useMemo(() => {
    const map = {};
    for (const it of items) (map[it.group_code] ||= []).push(it);
    return map;
  }, [items]);

  const submit = async event => {
    event.preventDefault();
    setSaving(true);
    try {
      await groupsPermissionsApi.create({ token, body: { group_code: groupCode, permission_code: permissionCode.trim() } });
      notifySuccess('Permissão associada ao grupo.');
      setOpen(false);
      setPermissionCode('');
      refresh();
    } catch (err) { notifyError(err); } finally { setSaving(false); }
  };

  const columns = [
    { key: 'group_code', label: 'Grupo', render: r => <Badge bg="info" text="dark">{GROUP_LABELS[r.group_code] || r.group_code}</Badge> },
    { key: 'permission_code', label: 'Permissão', render: r => <span className="font-monospace small">{r.permission_code}</span> }
  ];

  return (
    <div className="content-wrapper">
      <PageBreadcrumb title="Grupos & Permissões" subTitle1="Pessoas & Acesso" />

      <Row className="g-2 mb-3">
        {GROUPS.map(g => (
          <Col key={g} xs={6} md={3}>
            <Card className="panel text-center">
              <Card.Body className="py-3">
                <div className="fs-4 fw-bold">{(byGroup[g] || []).length}</div>
                <div className="text-muted small">{GROUP_LABELS[g]}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => setOpen(true)}>Associar permissão</Button>
      </div>

      <DataTable
        columns={columns} rows={items} loading={loading} error={error}
        hasMore={hasMore} onLoadMore={loadMore}
        emptyMessage="Nenhuma associação de permissão encontrada."
      />

      <FormDrawer show={open} onHide={() => setOpen(false)} title="Associar permissão a grupo" onSubmit={submit} submitting={saving} submitLabel="Associar">
        <div className="mb-3">
          <label className="form-label">Grupo</label>
          <Form.Select value={groupCode} onChange={e => setGroupCode(e.target.value)}>
            {GROUPS.map(g => <option key={g} value={g}>{GROUP_LABELS[g]} ({g})</option>)}
          </Form.Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Código da permissão</label>
          <input className="form-control font-monospace" value={permissionCode} onChange={e => setPermissionCode(e.target.value)} placeholder="documents.access" required />
        </div>
        <p className="text-muted small">Associações duplicadas são rejeitadas (409). O backend valida o código da permissão.</p>
      </FormDrawer>
    </div>
  );
};

export default GroupsPermissionsPage;
