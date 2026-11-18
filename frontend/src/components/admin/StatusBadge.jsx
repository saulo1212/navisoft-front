import { Badge } from 'react-bootstrap';

const VARIANTS = {
  active: { bg: 'success', label: 'Ativo' },
  available: { bg: 'success', label: 'Disponível' },
  allowed: { bg: 'success', label: 'Permitido' },
  evaluated: { bg: 'success', label: 'Avaliado' },
  completed: { bg: 'success', label: 'Concluído' },
  open: { bg: 'warning', text: 'dark', label: 'Aberta' },
  cancelled: { bg: 'secondary', label: 'Cancelada' },
  closed: { bg: 'success', label: 'Fechado' },
  inactive: { bg: 'secondary', label: 'Inativo' },
  blocked: { bg: 'danger', label: 'Bloqueado' },
  denied: { bg: 'danger', label: 'Negado' },
  not_evaluated: { bg: 'warning', text: 'dark', label: 'Não avaliado' },
  pending: { bg: 'warning', text: 'dark', label: 'Pendente' },
  dispatched: { bg: 'info', text: 'dark', label: 'Despachada' },
  in_progress: { bg: 'info', text: 'dark', label: 'Em andamento' },
  return_pending: { bg: 'warning', text: 'dark', label: 'Retorno pendente' },
  draft: { bg: 'secondary', label: 'Rascunho' }
};

const StatusBadge = ({ status, label }) => {
  const variant = VARIANTS[status] || { bg: 'secondary', label: label || status };
  return <Badge bg={variant.bg} text={variant.text}>{label || variant.label}</Badge>;
};

export default StatusBadge;
