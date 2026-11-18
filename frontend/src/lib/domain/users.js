// Rótulos de perfil de usuário (profile_code) compartilhados entre a lista e o
// detalhe de usuários. Mantido fora das páginas de rota para evitar acoplamento
// entre arquivos de página do App Router.
export const PROFILE_LABELS = {
  primary_admin: 'Primary',
  administrator: 'Administrator',
  secondary_admin: 'Secondary',
  basic_user: 'Basic'
};

export const PROFILE_CODES = Object.keys(PROFILE_LABELS);
