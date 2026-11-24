export const dashboardHome = '/dashboards/control-center';
export const templateDemosEnabled = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_TEMPLATE_DEMOS === '1';

const areaRoutes = [
  ['/organizacoes', 'organizations'],
  ['/entidades', 'entities'],
  ['/frota/grupos', 'assets_groups'],
  ['/frota', 'assets'],
  ['/devices-sim', 'devices', 'simcards'],
  ['/geografia', 'geo_points', 'geo_geofences', 'geo_routes'],
  ['/tecnicos', 'devices'],
  ['/ordens-servico', 'devices'],
  ['/minhas-ordens-servico', 'devices'],
  ['/manutencao', 'maintenance'],
  ['/checklists', 'checklists'],
  ['/agenda', 'agenda'],
  ['/eventos/modelos', 'events'],
  ['/eventos/regras', 'events'],
  ['/eventos', 'event_occurrences'],
  ['/notificacoes', 'notifications'],
  ['/colaboradores', 'collaborators'],
  ['/usuarios', 'users'],
  ['/contatos', 'contacts'],
  ['/knowledge', 'knowledge'],
  ['/documentos', 'documents'],
  ['/comercial', 'commercial']
];

const globalRoutes = ['/account/profile', '/access-control/user-profile', '/account/security', '/billing', '/planos', '/platform-capabilities', '/health', '/integracoes', '/dashboards/subscription'];
const contextualRoutes = [dashboardHome, '/dashboards/project-management', '/situacoes', '/grupos-permissoes', '/relatorios'];
const publicRoutes = ['/ajuda', '/auth/login', '/auth/forgot-password', '/auth/reset-password', '/auth/two-factor'];
const containsPath = (base, path) => path === base || path?.startsWith(`${base}/`);

export const areaAllowed = (context, area) => context?.status === 'evaluated' && context.areas?.[area] === 'allowed';
export const requiresOrganization = path => !globalRoutes.some(base => containsPath(base, path));
export const isDemoPath = path => Boolean(path) && ![...globalRoutes, ...contextualRoutes, ...publicRoutes, ...areaRoutes.map(([base]) => base)]
  .some(base => containsPath(base, path));

export function canAccessPath(path, context) {
  if (publicRoutes.some(base => containsPath(base, path))) return true;
  if (context?.status !== 'evaluated') return false;
  const policy = areaRoutes.find(([base]) => containsPath(base, path));
  return !policy || policy.slice(1).some(area => areaAllowed(context, area));
}

export function accessibleMenu(items, context, demos = templateDemosEnabled) {
  return items.flatMap(item => {
    if (item.isTitle) return item.key === 'template-demo' && !demos ? [] : [item];
    if (item.children) {
      const children = accessibleMenu(item.children, context, demos);
      return children.length ? [{ ...item, children }] : [];
    }
    return item.url && (demos || !isDemoPath(item.url)) && canAccessPath(item.url, context) ? [item] : [];
  }).filter((item, index, visible) => !item.isTitle || (visible[index + 1] && !visible[index + 1].isTitle));
}
