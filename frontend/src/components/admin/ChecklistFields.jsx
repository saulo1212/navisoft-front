'use client';

import { Button } from 'react-bootstrap';
import { OperationField } from './OperationalUi';
import { useOffsetList } from '@/hooks/useOffsetList';
import { listChecklistGroups } from '@/lib/api/endpoints/checklists';
import { APPLICABILITY, EFFECTS, QUESTION_TYPES } from '@/lib/domain/checklists';
import { useSession } from '@/lib/session/SessionContext';

export const newChecklistQuestion = () => ({ code: '', label: '', type: 'boolean', required: true, effect: 'none' });
export function ChecklistFields({ form, onChange, editing = false }) {
  const { selectedOrganizationUid } = useSession();
  const groups = useOffsetList(listChecklistGroups, { params: { organizationUid: selectedOrganizationUid }, limit: 50 });
  const set = (field, value) => onChange({ ...form, [field]: value });
  const question = (index, field, value) => set('questions', form.questions.map((row, i) => i === index ? { ...row, [field]: value } : row));
  const move = (index, step) => { const rows = [...form.questions]; [rows[index], rows[index + step]] = [rows[index + step], rows[index]]; set('questions', rows); };
  return <>
    <OperationField label="Código" required disabled={editing} value={form.code} onChange={e => set('code', e.target.value)} />
    <OperationField label="Nome" required value={form.name} onChange={e => set('name', e.target.value)} />
    <OperationField label="Descrição" multiline value={form.description || ''} onChange={e => set('description', e.target.value)} />
    <label className="form-label" htmlFor="checklist-group">Grupo</label>
    <select id="checklist-group" className="form-select mb-2" required value={form.uid_group} onChange={e => set('uid_group', e.target.value)}>
      <option value="">Selecione...</option>
      {form.uid_group && !groups.items.some(group => group.uid === form.uid_group) && <option value={form.uid_group}>Grupo atual: {form.uid_group}</option>}
      {groups.items.map(group => <option key={group.uid} value={group.uid} disabled={group.active === false && group.uid !== form.uid_group}>{group.name}{group.active === false ? ' (inativo)' : ''}</option>)}
    </select>
    <OperationField label="Buscar grupo por nome" value={groups.q} onChange={e => groups.setQ(e.target.value)} />
    {groups.error && <p className="text-danger">Não foi possível carregar os grupos ({groups.error}).</p>}
    {groups.loading && <p>Carregando grupos...</p>}
    {groups.hasMore && !groups.loading && <Button type="button" size="sm" variant="outline-secondary" className="mb-3" onClick={groups.loadMore}>Mais grupos</Button>}
    <label className="d-block mb-3"><input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} /> Ativo</label>
    <label className="form-label" htmlFor="checklist-applicability">Aplicação</label>
    <select id="checklist-applicability" className="form-select mb-3" value={form.applicability} onChange={e => onChange({ ...form, applicability: e.target.value, assignmentMode: e.target.value === 'general' ? 'all' : 'selected', targets: '' })}>{Object.entries(APPLICABILITY).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select>
    <label className="form-label" htmlFor="checklist-assignment">Destinatários</label>
    <select id="checklist-assignment" className="form-select mb-3" value={form.assignmentMode} onChange={e => set('assignmentMode', e.target.value)}><option value="all">Todos os destinatários aplicáveis da organização</option>{form.applicability !== 'general' && <option value="selected">Selecionados</option>}</select>
    {form.assignmentMode === 'selected' && <OperationField label={`UUIDs dos ${form.applicability === 'asset' ? 'ativos' : 'motoristas'} (um por linha)`} multiline required value={form.targets} onChange={e => set('targets', e.target.value)} />}
    <h5>Perguntas</h5>
    <p className="small text-muted">O código identifica a pergunta nas respostas. A ordem abaixo será mantida na versão publicada.</p>
    {form.questions.map((row, index) => <div className="border rounded p-3 mb-3" key={index}>
      <h6>Pergunta {index + 1}</h6>
      <OperationField label="Código da pergunta" required value={row.code} onChange={e => question(index, 'code', e.target.value)} />
      <OperationField label="Enunciado" required value={row.label} onChange={e => question(index, 'label', e.target.value)} />
      <label className="form-label" htmlFor={`question-type-${index}`}>Tipo de resposta</label>
      <select id={`question-type-${index}`} className="form-select mb-3" value={row.type} onChange={e => question(index, 'type', e.target.value)}>{!QUESTION_TYPES[row.type] && <option value={row.type}>Tipo existente: {row.type}</option>}{Object.entries(QUESTION_TYPES).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select>
      <label className="d-block mb-3"><input type="checkbox" checked={row.required === true} onChange={e => question(index, 'required', e.target.checked)} /> Resposta obrigatória</label>
      {row.type === 'boolean' && <><label className="form-label" htmlFor={`question-effect-${index}`}>Efeito quando a resposta for Sim</label><select id={`question-effect-${index}`} className="form-select mb-3" value={row.effect || 'none'} onChange={e => question(index, 'effect', e.target.value)}>{Object.entries(EFFECTS).map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></>}
      <div className="d-flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline-secondary" disabled={index === 0} onClick={() => move(index, -1)}>Mover para cima</Button>
        <Button type="button" size="sm" variant="outline-secondary" disabled={index === form.questions.length - 1} onClick={() => move(index, 1)}>Mover para baixo</Button>
        <Button type="button" size="sm" variant="outline-danger" onClick={() => set('questions', form.questions.filter((_, i) => i !== index))}>Remover pergunta</Button>
      </div>
    </div>)}
    <Button type="button" size="sm" variant="outline-secondary" onClick={() => set('questions', [...form.questions, newChecklistQuestion()])}>Adicionar pergunta</Button>
  </>;
}
