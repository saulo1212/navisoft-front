import { createResourceApi } from '../resource';

// Situações (/v1/admin/situations) — CRUD padrão. Campos: code, name, enabled,
// operational, locked, applies_to_all, scopes[]. `locked` protege registros de
// sistema; a exclusão de situação travada é negada pelo backend.
export const situationsApi = createResourceApi({ basePath: '/v1/admin/situations' });
