import { apiRequest } from './http';
import { newIdempotencyKey } from './idempotency';

// Fábrica da camada de API por recurso. Em vez de reescrever list/get/create/
// update/patch/remove para cada módulo, criar um client padronizado:
//
//   export const organizationsApi = createResourceApi({ basePath: '/v1/admin/organizations' });
//
// Convenções:
//  - Qualquer chave extra passada numa chamada vira query string (searchParams).
//    Ex.: list({ token, uid_organization, q, limit, offset }).
//  - `create`/`update` geram Idempotency-Key automaticamente se não for passada;
//    para retentativas idempotentes, passe a MESMA `idempotencyKey`.
export function createResourceApi({ basePath }) {
  const root = basePath.replace(/\/$/, '');
  const splitQuery = ({ token, signal, body, idempotencyKey, uid, ...query }) => ({ token, signal, body, idempotencyKey, uid, query });

  return {
    basePath: root,

    list(args = {}) {
      const { token, signal, query } = splitQuery(args);
      return apiRequest(root, { token, signal, searchParams: query });
    },

    get(args = {}) {
      const { token, signal, uid, query } = splitQuery(args);
      return apiRequest(`${root}/${uid}`, { token, signal, searchParams: query });
    },

    create(args = {}) {
      const { token, signal, body, idempotencyKey, query } = splitQuery(args);
      return apiRequest(root, {
        method: 'POST', token, signal, body, searchParams: query,
        idempotencyKey: idempotencyKey ?? newIdempotencyKey()
      });
    },

    update(args = {}) {
      const { token, signal, uid, body, idempotencyKey, query } = splitQuery(args);
      return apiRequest(`${root}/${uid}`, {
        method: 'PUT', token, signal, body, searchParams: query, idempotencyKey
      });
    },

    patch(args = {}) {
      const { token, signal, uid, body, idempotencyKey, query } = splitQuery(args);
      return apiRequest(`${root}/${uid}`, { method: 'PATCH', token, signal, body, searchParams: query, idempotencyKey });
    },

    remove(args = {}) {
      const { token, signal, uid, query } = splitQuery(args);
      return apiRequest(`${root}/${uid}`, { method: 'DELETE', token, signal, searchParams: query });
    }
  };
}
