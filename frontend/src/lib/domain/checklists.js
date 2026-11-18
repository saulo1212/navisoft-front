import { requiredText, requireUid } from './technicalOperations';

export const APPLICABILITY = { driver: 'Motorista', asset: 'Ativo', general: 'Geral' };
export const EFFECTS = { none: 'Sem efeito', warning: 'Aviso', driver_not_fit: 'Motorista inapto', asset_not_fit: 'Ativo inapto' };
export const QUESTION_TYPES = { boolean: 'Sim / Não', text: 'Texto' };
export function checklistGroupBody(form, organizationUid) {
  return { uid_organization: requireUid(organizationUid, 'organização'), code: requiredText(form.code, 'o código'), name: requiredText(form.name, 'o nome'), description: form.description?.trim() || null, active: form.active === true };
}
export function checklistForm(record) {
  const assignment = record.assignment || {};
  return { ...record, questions: record.definition?.questions || [], assignmentMode: assignment.mode || record.assignment_mode || 'all', targets: (assignment.drivers || assignment.assets || []).join('\n') };
}
export function checklistBody(form, organizationUid) {
  if (!Object.hasOwn(APPLICABILITY, form.applicability)) throw new Error('Selecione uma aplicação válida.');
  if (!['all', 'selected'].includes(form.assignmentMode)) throw new Error('Selecione os destinatários.');
  const assignment = { mode: form.assignmentMode };
  if (assignment.mode === 'selected') {
    if (form.applicability === 'general') throw new Error('O checklist geral deve ser aplicado a todos.');
    const targets = [...new Set((form.targets || '').split(/[\s,;]+/).filter(Boolean))];
    if (!targets.length) throw new Error('Informe pelo menos um destinatário.');
    targets.forEach(uid => requireUid(uid, 'destinatário'));
    assignment[form.applicability === 'driver' ? 'drivers' : 'assets'] = targets;
  }
  if (!Array.isArray(form.questions) || !form.questions.length) throw new Error('Adicione pelo menos uma pergunta.');
  const seen = new Set();
  const questions = form.questions.map(question => {
    const code = requiredText(question.code, 'o código de cada pergunta');
    if (seen.has(code)) throw new Error('Os códigos das perguntas devem ser únicos.');
    seen.add(code);
    if (!Object.hasOwn(QUESTION_TYPES, question.type)) throw new Error(`O tipo da pergunta ${code} não é suportado neste editor.`);
    const result = { ...question, code, label: requiredText(question.label, 'o enunciado da pergunta'), required: question.required === true };
    if (question.type === 'boolean') {
      result.effect = question.effect || 'none';
      if (!Object.hasOwn(EFFECTS, result.effect)) throw new Error('Selecione um efeito válido.');
    } else delete result.effect;
    return result;
  });
  const body = { uid_organization: requireUid(organizationUid, 'organização'), uid_group: requireUid(form.uid_group, 'grupo'), code: requiredText(form.code, 'o código'), name: requiredText(form.name, 'o nome'), description: form.description?.trim() || null, active: form.active === true, applicability: form.applicability, assignment, definition: { ...(form.definition || {}), questions } };
  return body;
}
export const runIsComplete = run => run?.complete === true || run?.status === 'completed' || !!run?.completed_at;
export function runAnswers(run) {
  return Object.fromEntries((run.executions || []).map(execution => [execution.uid, Object.fromEntries((execution.answers || []).map(answer => [answer.question_code, answer.value]))]));
}
export function checklistAnswersBody(run, values, requireAll = false) {
  if (runIsComplete(run)) throw new Error('Esta execução já foi encerrada.');
  const executions = (run.executions || []).map(execution => {
    const answers = [];
    for (const question of execution.checklist?.definition?.questions || []) {
      const value = values[execution.uid]?.[question.code];
      const absent = value === undefined || value === null || (typeof value === 'string' && !value.trim());
      if (absent && question.required && requireAll) throw new Error(`Responda a pergunta obrigatória: ${question.label}.`);
      if (value === undefined || value === null) continue;
      if (question.type === 'boolean' && typeof value !== 'boolean') throw new Error(`Responda Sim ou Não: ${question.label}.`);
      if (question.type === 'text' && typeof value !== 'string') throw new Error(`Informe uma resposta textual: ${question.label}.`);
      if (!Object.hasOwn(QUESTION_TYPES, question.type) && requireAll && question.required && absent) throw new Error(`Tipo de pergunta não suportado: ${question.type}.`);
      answers.push({ question_code: question.code, value });
    }
    return { uid_execution: requireUid(execution.uid, 'execução do checklist'), answers };
  });
  return { executions };
}
