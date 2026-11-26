import { apiRequest } from '../http';
import { newIdempotencyKey } from '../idempotency';
import { requireUid } from '../../domain/technicalOperations';

// Autoria de relatórios — superfície administrativa de engenharia de relatórios
// (/v1/admin/reports/*). Diferente de reports.js (que CONSOME relatórios já
// publicados), estas rotas PUBLICAM as peças que geram os relatórios: fontes de
// dados, definições, revisões de template (planilha XLSX) e políticas efetivas.
const root = '/v1/admin/reports';

// Catálogo de templates publicados e a política efetiva por report_code.
export function listReportTemplates({ token, signal, limit = 50, offset = 0 }) {
  return apiRequest(`${root}/templates`, { token, signal, searchParams: { limit, offset } });
}
export function getEffectiveTemplate({ token, signal, reportCode }) {
  if (!reportCode?.trim()) throw new Error('Informe o código do relatório.');
  return apiRequest(`${root}/templates/effective`, { token, signal, searchParams: { report_code: reportCode.trim() } });
}

// Publicar uma revisão de template é um upload binário (planilha XLSX) com a
// metainformação de escopo/contrato nos cabeçalhos — mesmo padrão do upload de
// imagens em platform.js (rawBody + Content-Type do arquivo).
export function publishReportTemplateRevision({ token, signal, templateUid, file, scope = 'global', contract, idempotencyKey = newIdempotencyKey() }) {
  if (!file) throw new Error('Selecione o arquivo de template (XLSX).');
  const headers = { 'Content-Type': file.type || 'application/octet-stream', 'X-Template-Scope': scope };
  if (contract?.trim()) headers['X-Template-Contract'] = contract.trim();
  return apiRequest(`${root}/templates/${requireUid(templateUid, 'template')}/revisions`, {
    method: 'POST', token, signal, rawBody: file, headers, idempotencyKey
  });
}

// Publicar definição de relatório (report_code + versão + fonte + colunas/filtros).
export function publishReportDefinition({ token, signal, body, idempotencyKey = newIdempotencyKey() }) {
  return apiRequest(`${root}/definitions/publish`, { method: 'POST', token, signal, body, idempotencyKey });
}

// Publicar capacidade/fonte de dados (relação, campos, estratégia de autorização).
export function publishReportSource({ token, signal, body, idempotencyKey = newIdempotencyKey() }) {
  return apiRequest(`${root}/sources/publish`, { method: 'POST', token, signal, body, idempotencyKey });
}

// Schema JSON do adapter — referência para montar a definição/seletor.
export function getAdapterJsonSchema({ token, signal, adapter }) {
  if (!adapter?.trim()) throw new Error('Informe o código do adapter.');
  return apiRequest(`${root}/adapters/${encodeURIComponent(adapter.trim())}/json-schema`, { token, signal });
}

// Recuperação administrativa: reexecutar uma execução agendada que falhou.
export function retryScheduleRun({ token, signal, runUid, reasonCode }) {
  const body = reasonCode?.trim() ? { reason_code: reasonCode.trim() } : {};
  return apiRequest(`${root}/schedule-runs/${requireUid(runUid, 'execução agendada')}/retry`, {
    method: 'POST', token, signal, body
  });
}
