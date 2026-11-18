import { createResourceApi } from '../resource';

// Grupos de permissões (/v1/admin/groups-permissions). Associa um permission_code
// a um group_code (perfis: primary_admin, administrator, secondary_admin, basic_user).
export const groupsPermissionsApi = createResourceApi({ basePath: '/v1/admin/groups-permissions' });
