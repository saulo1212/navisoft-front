// Erros HTTP normalizados. `code` segue o vocabulário de domínio documentado
// (ex.: invalid_organization_uid, entity_not_found) e não deve ser generalizado.
export class ApiError extends Error {
  constructor(status, code, payload) {
    super(code || `http_${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = code || null;
    this.payload = payload ?? null;
  }

  // Categoria grosseira para orientar o tratamento na UI (toast, redirect, etc).
  get category() {
    if (this.status === 0) return 'network';
    if (this.status === 401) return 'auth';
    if (this.status === 403) return 'gate';
    if (this.status === 404) return 'not_found';
    if (this.status === 409) return 'conflict';
    if (this.status === 422 || this.status === 400) return 'validation';
    if (this.status === 503) return 'technical';
    return 'unknown';
  }

  // 401 com relogin_required => sessão morta, exige novo login.
  get isReloginRequired() {
    return this.status === 401 && (this.payload?.relogin_required === true
      || this.code === 'relogin_required'
      || ['expired', 'revoked'].includes(this.payload?.state));
  }
}

export function isApiError(error) {
  return error instanceof ApiError;
}

// Mensagens em PT por código de negócio. A chave é o `code` retornado pela API
// (ou um fallback por status). Textos genéricos por categoria cobrem o resto.
const CODE_MESSAGES = {
  invalid_document: 'Dados do documento inválidos. Confira contrato, catálogos e organização.',
  document_not_found: 'Documento não encontrado ou indisponível para esta organização e ação.',
  document_revision_unchanged: 'O arquivo é igual à revisão mais recente. Envie um conteúdo diferente.',
  document_revision_summary_required: 'Informe o resumo da alteração para criar uma nova revisão.',
  document_revision_summary_invalid: 'Resumo inválido. Use até 500 caracteres, sem caracteres de controle.',
  document_revision_filename_mismatch: 'A revisão deve manter o nome canônico definido na R00.',
  document_file_type_mismatch: 'Os bytes, o MIME e a extensão do arquivo precisam corresponder a PDF ou JPEG.',
  document_distribution_exists: 'Já existe uma distribuição ativa para esta organização destinatária.',
  functional_group_member_not_authorized: 'O usuário precisa possuir acesso legítimo à organização para integrar este grupo.',
  invalid_knowledge_request: 'Dados do artigo inválidos. Confira identificador, revisão e classificação.',
  knowledge_item_not_found: 'Artigo não encontrado ou indisponível para este acesso.',
  knowledge_revision_immutable: 'A revisão publicada é imutável. Crie uma nova revisão para alterar o conteúdo.',
  knowledge_attachment_unavailable: 'Não foi possível acessar o anexo. Tente novamente mais tarde.',
  knowledge_attachment_not_found: 'Anexo não encontrado ou indisponível para este acesso.',
  invalid_event_request: 'Dados do evento inválidos. Confira modelo, alvo, parâmetros e condições.',
  invalid_event_rule: 'Regra de evento inválida. Revise os parâmetros e vínculos.',
  event_not_found: 'Evento não encontrado ou fora do seu escopo.',
  invalid_notification_request: 'Configuração de notificação inválida. Confira destinos, vínculos e conteúdo.',
  notification_resource_not_found: 'Recurso de notificação não encontrado ou fora do seu escopo.',
  agenda_version_conflict: 'Os controles foram alterados por outra operação. Confira a versão atual antes de salvar novamente.',
  agenda_entry_not_found: 'Registro da agenda não encontrado ou fora do seu escopo.',
  agenda_entry_terminal: 'Este registro já foi encerrado na origem.',
  invalid_report_schedule: 'Configuração de agendamento inválida. Confira a definição publicada, filtros, horário e retenção.',
  network_error: 'Falha de conexão com o servidor. Verifique sua rede e tente novamente.',
  relogin_required: 'Sua sessão expirou. Entre novamente para continuar.',
  invalid_credentials: 'Credenciais inválidas.',
  pending_mfa: 'Confirmação em duas etapas necessária.',
  mfa_verified_email_required: 'É necessário verificar o e-mail antes de ativar a verificação em duas etapas.',
  recovery_token_invalid_or_expired: 'O link de recuperação é inválido ou expirou.',
  activation_invitation_invalid_or_expired: 'Este convite é inválido, expirou ou já foi utilizado.',
  activation_invitation_not_allowed: 'Você não pode enviar um convite de ativação para esta conta.',
  invalid_activation_request: 'Confira os dados de ativação e tente novamente.',
  password_confirmation_mismatch: 'As senhas informadas não coincidem.',
  password_recently_used: 'Esta senha foi usada recentemente. Escolha uma diferente.',
  organization_not_found: 'Organização não encontrada ou indisponível para o seu acesso.',
  organization_target_required: 'Selecione uma organização para esta operação.',
  invalid_organization_uid: 'Identificador de organização inválido.',
  invalid_organization_query: 'Parâmetros de listagem inválidos.',
  area_not_allowed: 'Você não tem acesso a esta área.',
  geo_not_allowed: 'Acesso à área geográfica negado.',
  geo_not_found: 'Registro geográfico não encontrado ou indisponível para o seu acesso.',
  geo_conflict: 'Conflito ao salvar o registro geográfico. Revise os dados antes de tentar novamente.',
  invalid_geo_payload: 'Dados geográficos inválidos. Revise as coordenadas, geometrias e vínculos.',
  geo_storage_unavailable: 'O serviço de geografia está temporariamente indisponível.',
  invalid_geo_uid: 'Identificador geográfico inválido.',
  knowledge_primary_required: 'Esta operação exige perfil Primary.',
  knowledge_storage_unavailable: 'O armazenamento de conteúdo está temporariamente indisponível.',
  outside_access_period: 'Acesso fora do período permitido.',
  device_reference_conflict: 'Conflito de referência de dispositivo.',
  idempotency_conflict: 'Esta chave já foi usada em uma operação com dados diferentes.',
  maintenance_transition_conflict: 'A situação da manutenção mudou ou há condições que impedem esta transição.',
  invalid_maintenance_transition: 'Transição de manutenção inválida.',
  maintenance_order_identity_immutable: 'O ativo e a organização de uma manutenção existente não podem ser alterados.',
  maintenance_order_immutable: 'A manutenção já foi encerrada e não pode ser alterada.',
  invalid_checklist: 'Dados do checklist inválidos. Revise grupo, destinatários e perguntas.',
  checklist_required_answers_missing: 'Responda às perguntas obrigatórias antes de concluir.',
  checklist_run_immutable: 'A execução já foi encerrada. Recarregue para consultar o resultado final.',
  checklist_asset_locked: 'O ativo desta execução não pode mais ser alterado. Inicie outra execução para selecionar um ativo diferente.',
  device_custody_confirmation_required: 'É preciso confirmar o recebimento do dispositivo antes de prosseguir.'
};

const CATEGORY_MESSAGES = {
  network: 'Falha de conexão com o servidor.',
  auth: 'Autenticação necessária.',
  gate: 'Você não tem permissão para esta ação.',
  not_found: 'Recurso não encontrado ou indisponível para este acesso.',
  conflict: 'Conflito: o recurso já existe ou foi alterado.',
  validation: 'Dados inválidos. Revise os campos e tente novamente.',
  technical: 'Serviço temporariamente indisponível. Tente novamente em instantes.',
  unknown: 'Ocorreu um erro inesperado.'
};

// Resolve a melhor mensagem legível para um erro (ApiError ou genérico).
export function errorMessage(error) {
  if (!isApiError(error)) return CATEGORY_MESSAGES.unknown;
  if (error.isReloginRequired) return CODE_MESSAGES.relogin_required;
  if (error.code && Object.hasOwn(CODE_MESSAGES, error.code)) return CODE_MESSAGES[error.code];
  if (error.category !== 'unknown') return CATEGORY_MESSAGES[error.category];
  const payloadMsg = error.payload?.message;
  if (typeof payloadMsg === 'string' && payloadMsg && payloadMsg !== 'Not Found') return payloadMsg;
  return CATEGORY_MESSAGES[error.category] ?? CATEGORY_MESSAGES.unknown;
}

export const isAccessDenied = error => isApiError(error) && [401, 403, 404].includes(error.status);

export function readErrorMessage(error) {
  if (isApiError(error)) return errorMessage(error);
  if (typeof error !== 'string') return CATEGORY_MESSAGES.network;
  if (Object.hasOwn(CODE_MESSAGES, error)) return CODE_MESSAGES[error];
  const status = /^http_(\d{3})$/.exec(error)?.[1];
  return status ? errorMessage(new ApiError(Number(status))) : error;
}
