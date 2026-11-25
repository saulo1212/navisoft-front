# Movisat / Navisoft — Contratos de API

> Gerado a partir de `Insomnia_2026-11-04.json` + varredura real de LEITURA (GET) contra `https://api.navisoft.app`.
> **Respostas (GET):** schema real capturado da API (produção), tipos inferidos.
> **Mutações (POST/PUT/PATCH/DELETE):** contrato de *request* extraído da collection (não disparadas).
> Segmentos `:uid` = UUID na rota. Schemas mostram o *tipo* de cada campo, não os valores.

## Módulos

- **users/login** — 2 rotas
- **users/status** — 2 rotas
- **admin/users** — 9 rotas
- **users/logout** — 1 rotas
- **users/password** — 1 rotas
- **reports** — 4 rotas
- **reports/schedules** — 6 rotas
- **admin/reports** — 7 rotas
- **reports/organizations** — 2 rotas
- **reports/search** — 1 rotas
- **reports/entities** — 2 rotas
- **reports/assets** — 2 rotas
- **public/reports** — 2 rotas
- **admin/events** — 17 rotas
- **admin/devices** — 29 rotas
- **admin/geo** — 3 rotas
- **admin/simcards** — 2 rotas
- **admin/assets** — 27 rotas
- **admin/entities** — 20 rotas
- **technician/work-orders** — 5 rotas
- **admin/organizations** — 27 rotas
- **admin/billing** — 11 rotas
- **admin/knowledge** — 8 rotas
- **knowledge/items** — 2 rotas
- **public/knowledge** — 2 rotas
- **commercial/overview** — 1 rotas
- **commercial/orders** — 2 rotas
- **admin/billing-plans** — 11 rotas
- **admin/services** — 1 rotas
- **admin/notifications** — 9 rotas
- **admin/settings** — 1 rotas
- **admin/agenda** — 7 rotas
- **admin/maintenance** — 6 rotas
- **admin/documents** — 8 rotas
- **checklists/runs** — 3 rotas
- **admin/checklist-groups** — 4 rotas
- **admin/checklists** — 5 rotas
- **health/details** — 1 rotas
- **users/profile** — 1 rotas
- **health/ready** — 1 rotas
- **metrics** — 1 rotas
- **admin/platform-capabilities** — 2 rotas
- **admin/collaborators** — 27 rotas
- **users/security** — 2 rotas
- **users/contact-verification** — 2 rotas
- **admin/document-contracts** — 1 rotas
- **admin/integrations** — 3 rotas
- **health** — 1 rotas
- **admin/groups-permissions** — 2 rotas
- **admin/document-classes** — 2 rotas
- **admin/document-revisions** — 1 rotas
- **admin/document-distributions** — 2 rotas
- **admin/images** — 1 rotas
- **public/images** — 1 rotas
- **technician/custody** — 2 rotas
- **admin/addresses** — 1 rotas
- **admin/contacts** — 2 rotas
- **admin/situations** — 5 rotas
- **admin/common** — 1 rotas
- **images** — 1 rotas


---

## users/login

### `POST /v1/users/login`
- **Ex. collection:** 01 - Login Primary
- **Request body:**
```json
{	
	"identifier": "admin.autoscale",
	"password": "Hmtphfx4qt@@"
}
```

### `POST /v1/users/login/challenge`
- **Ex. collection:** T2-J — confirmar o desafio MFA
- **Request body:**
```json
{
  "code": "765474"
}
```


---

## users/status

### `GET /v1/users/status`
- **Ex. collection:** I05 — Status da sessão mostra application
- **Response (schema real):**
```jsonc
{
  "authenticated": bool,
  "state": string,
  "relogin_required": bool,
  "application": string,
  "uid_user": string,
  "uid_organization": string,
  "uid_organization_owner": string,
  "organization_code": string,
  "organization_name": string,
  "branding": {
    "theme": {
      "text": string,
      "border": string,
      "button": {
        "primary_text": string,
        "secondary_text": string,
        "primary_background": string,
        "secondary_background": string,
      },
      "danger": string,
      "header": {
        "text": string,
        "background": string,
      },
      "primary": string,
      "success": string,
      "surface": string,
      "warning": string,
      "secondary": string,
      "background": string,
      "text_muted": string,
    },
    "version": int,
    "logo_url": null,
  },
  "uid_session": string,
  "expires_at": string,
  "authenticated_at": string,
  "previous_login_at": null,
  "access_period": {
    "holidays": [[]],
    "tolerance_minutes": int,
    "uid_exception": null,
    "exception_ends_at": null,
    "mode": string,
    "within_period": bool,
    "allowed": bool,
    "timezone": string,
    "weekday": int,
    "source": string,
    "intervals": [{
      "start": string,
      "end": string,
    }],
    "checked_at": string,
  },
  "elapsed_ms": float,
}
```

### `GET /v1/users/status/stream`
- **Ex. collection:** I15 — SSE da sessão inclui application
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## admin/users

### `GET /v1/admin/users`
- **Ex. collection:** 04 - List All
- **Response (schema real):**
```jsonc
{
  "items": [{
    "can_create_organizations": null,
    "created_at": string,
    "email": string,
    "enabled": bool,
    "login": string,
    "mobile": null,
    "mobile_country": string,
    "name": string,
    "organizations_access": string,
    "password_initialized": bool,
    "profile_code": string,
    "scopes": [{
      "uid_organization": string,
      "entities": [[]],
    }],
    "uid": string,
    "uid_organization": string,
    "uid_organization_owner": string,
    "uid_situations": string,
    "updated_at": string,
  }],
  "limit": int,
  "offset": int,
  "total": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/users`
- **Ex. collection:** FB01 — login inválido deve retornar invalid_login_name
- **Request body:**
```json
{
  "uid_organization": "9c16286b-d7c4-40b5-8f3f-22744be4c46d",
  "profile_code": "administrator",
  "name": "FB01 Login Inválido",
  "login": "fb01.usuario@example.com",
  "enabled": false,
  "organizations_access": "selected",
  "scopes": [
    {
      "uid_organization": "9c16286b-d7c4-40b5-8f3f-22744be4c46d"
    }
  ]
}
```

### `GET /v1/admin/users/:uid`
- **Query:** `include_inactive`
- **Ex. collection:** PB53-B — Confirmar o perfil real do usuário
- **Response (schema real):**
```jsonc
{
  "created_at": string,
  "email": string,
  "enabled": bool,
  "login": string,
  "mobile": null,
  "mobile_country": string,
  "name": string,
  "organizations_access": string,
  "password_initialized": bool,
  "profile_code": string,
  "scopes": [{
    "uid_organization": string,
    "entities": [{
      "uid_entity": string,
      "uid_units": [[]],
      "uid_groups": [string],
      "uid_assets": [[]],
    }],
  }],
  "uid": string,
  "uid_organization": string,
  "uid_organization_owner": string,
  "uid_situations": string,
  "updated_at": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/users/:uid`
- **Ex. collection:** 81 — habilitar Secondary
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "profile_code": "secondary_admin",
  "name": "Secondary Homolog 0067",
  "login": "secondary.homolog.0067",
  "enabled": true,
  "organizations_access": "selected",
  "scopes": [
    {
      "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
      "entities": []
    }
  ]
}
```

### `PATCH /v1/admin/users/:uid`
- **Ex. collection:** 06 - Change data
- **Request body:**
```json
{
  "email": "admin.power@example.com"
}
```

### `GET /v1/admin/users/:uid/applications`
- **Ex. collection:** I06 — Consultar aplicações do usuário
- **Response (schema real):**
```jsonc
{
  "uid_user": string,
  "applications": [{
    "uid": string,
    "code": string,
    "name": string,
    "enabled": bool,
    "application_enabled": bool,
  }],
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/users/:uid/applications`
- **Ex. collection:** I07 — Replacement mantendo navisoft
- **Request body:**
```json
{
  "applications": ["navisoft"]
}
```

### `POST /v1/admin/users/functional-group-members`
- **Ex. collection:** G02 — Vincular Basic ao grupo funcional
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_functional_group": "8c5f7d8c-0d0c-4f52-9276-7388eee5af81",
  "uid_member_user": "091e62c3-75c1-432c-93e4-4a0134174efd"
}
```

### `POST /v1/admin/users/functional-groups`
- **Ex. collection:** teste inicvio
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "code": "ged_homolog_financial",
  "name": "Financeiro GED Homologação"
}
```


---

## users/logout

### `POST /v1/users/logout`
- **Ex. collection:** 05 - Logout
- **Request body:**
```json
{
  "name": "TABLECACHE-HOMOLOG-API-20261010",
  "active": true
}
```


---

## users/password

### `PUT /v1/users/password`
- **Ex. collection:** 06 - Change Password
- **Request body:**
```json
{
  "current_password": "Hmtphfx4qt@@",
  "new_password": "Jb88fwt2q3@@"
}
```


---

## reports

### `POST /v1/reports`
- **Ex. collection:** AST-355 — Gerar relatório com datas nativas
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "report_code": "assets.inventory",
  "report_version": 2,
  "format": "xlsx",
  "visibility": "private",
  "filters": {
    "q": "",
    "include_inactive": false,
    "filters": []
  },
  "columns": [
    "identification",
    "organization_name",
    "entity_name",
    "unit_name",
    "created_at",
    "updated_at"
  ],
  "sort": [
    {
      "field": "identification",
      "direction": "asc"
    },
    {
      "field": "uid",
      "direction": "asc"
    }
  ],
  "ttl_seconds": 259200,
  "source_screen_id": "assets.inventory"
}
```

### `GET /v1/reports/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** AST-356 — Verificar processamento
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "format": string,
  "status": string,
  "filters": {
    "q": string,
    "limit": int,
    "state": string,
    "offset": int,
    "filters": [[]],
    "include_inactive": bool,
  },
  "options": {
    "sort": [{
      "field": string,
      "direction": string,
    }],
    "columns": [string],
  },
  "failed_at": null,
  "created_at": string,
  "error_code": null,
  "expires_at": string,
  "public_url": null,
  "started_at": string,
  "updated_at": string,
  "visibility": string,
  "report_code": string,
  "completed_at": string,
  "requested_at": string,
  "download_path": null,
  "report_version": int,
  "source_screen_id": string,
  "uid_organization": string,
  "uid_user_requested": string,
  "elapsed_ms": float,
}
```

### `GET /v1/reports/:uid/download`
- **Query:** `uid_organization`
- **Ex. collection:** AST-357 — Baixar e validar o XLSX
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `POST /v1/reports/:uid/download`
- **Query:** `uid_organization`
- **Ex. collection:** RC13-A — rejeitar limit em export
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "report_code": "assets.list",
  "format": "csv",
  "visibility": "private",
  "filters": {
    "q": "",
    "filters": [],
    "include_inactive": false,
    "limit": 1
  },
  "columns": [
    "uid",
    "identification"
  ]
}
```


---

## reports/schedules

### `GET /v1/reports/schedules`
- **Query:** `uid_organization`
- **Ex. collection:** AST-312 — Verificar listagem de agendamentos
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "sort": [{
      "field": string,
      "direction": string,
    }],
    "state": string,
    "format": string,
    "period": {
      "mode": string,
    },
    "cadence": {
      "at": string,
      "frequency": string,
    },
    "columns": [string],
    "filters": {
      "q": string,
      "limit": int,
      "state": string,
      "offset": int,
      "filters": [[]],
      "include_inactive": bool,
    },
    "timezone": string,
    "created_at": string,
    "updated_at": string,
    "visibility": string,
    "last_run_at": string,
    "next_run_at": string,
    "report_code": string,
    "report_version": int,
    "retention_policy": string,
    "source_screen_id": null,
    "uid_organization": string,
    "retention_seconds": int,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/reports/schedules`
- **Ex. collection:** AST-387 — Criar agendamento de homologação
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "report_code": "assets.inventory",
  "report_version": 2,
  "format": "xlsx",
  "visibility": "private",
  "filters": {
    "q": "",
    "include_inactive": false,
    "filters": []
  },
  "columns": [
    "identification",
    "organization_name",
    "created_at"
  ],
  "sort": [
    {
      "field": "identification",
      "direction": "asc"
    },
    {
      "field": "uid",
      "direction": "asc"
    }
  ],
  "cadence": {
    "frequency": "daily",
    "at": "23:55"
  },
  "period": {
    "mode": "none"
  },
  "retention_seconds": 259200,
  "retention_policy": "expire"
}
```

### `GET /v1/reports/schedules/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** AST-321 — Consultar agendamento cadastrado
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `PUT /v1/reports/schedules/:uid`
- **Ex. collection:** AST-394 — Alterar horário do agendamento
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "report_code": "assets.inventory",
  "report_version": 2,
  "format": "xlsx",
  "visibility": "private",
  "filters": {
    "q": "",
    "include_inactive": false,
    "filters": []
  },
  "columns": [
    "identification",
    "organization_name",
    "created_at"
  ],
  "sort": [
    {
      "field": "identification",
      "direction": "asc"
    },
    {
      "field": "uid",
      "direction": "asc"
    }
  ],
  "cadence": {
    "frequency": "daily",
    "at": "22:02"
  },
  "period": {
    "mode": "none"
  },
  "retention_seconds": 259200,
  "retention_policy": "expire"
}
```

### `DELETE /v1/reports/schedules/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** AST-325 — Excluir logicamente o agendamento

### `PUT /v1/reports/schedules/:uid/state`
- **Ex. collection:** AST-322 — Pausar agendamento
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "state": "paused"
}
```


---

## admin/reports

### `GET /v1/admin/reports/adapters/assets.inventory.v2/json-schema`
- **Ex. collection:** AST-53 — Consultar o schema JSON do adapter
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `POST /v1/admin/reports/definitions/publish`
- **Ex. collection:** GEN-REP-33 — Testar publicação sem autenticação
- **Request body:**
```json
{
  "report_code": "assets.inventory",
  "version": 1,
  "source_code": "assets.list.v1",
  "title": "Inventário de Ativos",
  "description": "Inventário autorizado de ativos do Navisoft",
  "columns": [
    "uid",
    "uid_organization",
    "identification",
    "created_at"
  ],
  "default_columns": [
    "identification",
    "created_at"
  ],
  "filters": [
    {
      "field": "identification",
      "operators": ["eq", "prefix", "contains"],
      "search_operator": "contains"
    }
  ],
  "sorts": [],
  "default_sort": [],
  "formats": [
    {
      "code": "csv",
      "visibility": ["private"]
    }
  ],
  "limits": {
    "max_rows": 100000,
    "max_bytes": 52428800,
    "max_ttl_seconds": 172800
  }
}
```

### `POST /v1/admin/reports/schedule-runs/:uid/retry`
- **Ex. collection:** AST-431 — Recuperação administrativa
- **Request body:**
```json
{
  "reason_code": "schema_fix_applied"
}
```

### `POST /v1/admin/reports/sources/publish`
- **Ex. collection:** AST-270 — Publicar capacidade PostgreSQL
- **Request body:**
```json
{
  "source_code": "entities.entity_types.generic.v1",
  "logical_code": "entities.entity_types.generic",
  "revision_number": 1,
  "relation_code": "entities.entity_types",
  "authorization_strategy": "organization_scope_rls",
  "max_rows": 10000,
  "max_bytes": 10485760,
  "max_ttl_seconds": 1800,
  "fields": [
    {
      "code": "uid_organization",
      "display_name": "Organização",
      "selectable": false,
      "filterable": false,
      "operators": [],
      "search_operator": null,
      "sortable": false,
      "directions": []
    },
    {
      "code": "uid",
      "display_name": "UID",
      "selectable": true,
      "filterable": false,
      "operators": [],
      "search_operator": null,
      "sortable": true,
      "directions": ["asc", "desc"]
    },
    {
      "code": "uid_entity",
      "display_name": "Entidade",
      "selectable": true,
      "filterable": false,
      "operators": [],
      "search_operator": null,
      "sortable": false,
      "directions": []
    },
    {
      "code": "uid_type",
      "display_name": "Tipo",
      "selectable": true,
      "filterable": false,
      "operators": [],
      "search_operator": null,
      "sortable": false,
      "directions": []
    }
  ],
  "formats": [
    {
      "code": "xlsx",
      "visibility": ["private"]
    }
  ]
}
```

### `GET /v1/admin/reports/templates`
- **Ex. collection:** AST-116 — Listar templates com Primary
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "scope": string,
    "revoked": bool,
    "created_at": string,
    "updated_at": string,
    "report_code": null,
    "uid_organization": null,
    "uid_active_revision": string,
  }],
  "elapsed_ms": float,
}
```

### `POST /v1/admin/reports/templates/:uid/revisions`
- **Ex. collection:** AST-119 — Publicar o primeiro template global

### `GET /v1/admin/reports/templates/effective`
- **Query:** `report_code`
- **Ex. collection:** AST-118 — Consultar a política efetiva de templates
- **Response (schema real):**
```jsonc
{
  "mode": string,
  "template": {
    "uid": string,
    "scope": string,
    "sha256": string,
    "size_bytes": int,
    "report_code": null,
    "uid_revision": string,
    "revision_number": int,
    "contract_version": string,
  },
  "elapsed_ms": float,
}
```


---

## reports/organizations

### `GET /v1/reports/organizations/definition`
- **Ex. collection:** REP-ORG-01 — Consultar a definição do relatório
- **Response (schema real):**
```jsonc
{
  "report_code": string,
  "report_version": int,
  "domain": string,
  "columns": [{
    "field": string,
    "type": string,
  }],
  "json_paths": [[]],
  "default_columns": [string],
  "filters": [{
    "name": string,
    "operators": [string],
    "search": string,
    "pattern": string,
    "normalize": string,
  }],
  "sort": {
    "default": [{
      "field": string,
      "direction": string,
    }],
    "allowed_fields": [string],
    "allowed_directions": [string],
  },
  "pagination": {
    "required": bool,
    "default_limit": int,
    "maximum_limit": int,
    "default_offset": int,
  },
  "export_enabled": bool,
  "export_formats": [string],
  "export_limits": {
    "max_rows": int,
    "max_bytes": int,
    "timeout_seconds": int,
  },
  "elapsed_ms": float,
}
```

### `POST /v1/reports/organizations/search`
- **Ex. collection:** REP-ORG-02 — Primeira consulta JSON paginada
- **Request body:**
```json
{
  "report_code": "organizations.list",
  "report_version": 1,
  "columns": [
    "uid",
    "name",
    "code",
    "created_at"
  ],
  "q": "",
  "filters": [],
  "include_inactive": false,
  "sort": [
    {
      "field": "created_at",
      "direction": "desc"
    }
  ],
  "limit": 5,
  "offset": 0
}
```


---

## reports/search

### `POST /v1/reports/search`
- **Ex. collection:** REP-ORG-24 — Verificar compatibilidade do histórico existente
- **Request body:**
```json
{
  "uid_organization": "7a7eb1f8-79de-498f-a20e-b7ae77adae3a",
  "limit": 5,
  "offset": 0
}
```


---

## reports/entities

### `GET /v1/reports/entities/definition`
- **Ex. collection:** REP-ENT-01 — Consultar a definição do relatório
- **Response (schema real):**
```jsonc
{
  "report_code": string,
  "report_version": int,
  "domain": string,
  "columns": [{
    "field": string,
    "type": string,
  }],
  "json_paths": [[]],
  "default_columns": [string],
  "filters": [{
    "name": string,
    "operators": [string],
    "search": string,
    "pattern": string,
    "normalize": string,
  }],
  "sort": {
    "default": [{
      "field": string,
      "direction": string,
    }],
    "allowed_fields": [string],
    "allowed_directions": [string],
  },
  "pagination": {
    "required": bool,
    "default_limit": int,
    "maximum_limit": int,
    "default_offset": int,
  },
  "export_enabled": bool,
  "export_formats": [string],
  "export_limits": {
    "max_rows": int,
    "max_bytes": int,
    "timeout_seconds": int,
  },
  "elapsed_ms": float,
}
```

### `POST /v1/reports/entities/search`
- **Ex. collection:** REP-ENT-02 — Primeira consulta com relacionamentos
- **Request body:**
```json
{
  "report_code": "entities.list",
  "report_version": 1,
  "columns": [
    "uid",
    "uid_organization",
    "name",
    "organization_name",
    "uid_unit",
    "unit_name",
    "situation_name",
    "effective_lifecycle",
    "entity_types",
    "created_at"
  ],
  "q": "",
  "filters": [],
  "include_inactive": false,
  "sort": [
    {
      "field": "created_at",
      "direction": "desc"
    }
  ],
  "limit": 5,
  "offset": 0
}
```


---

## reports/assets

### `GET /v1/reports/assets/definition`
- **Query:** `version`
- **Ex. collection:** AST-05 — Consultar definição completa de Assets
- **Response (schema real):**
```jsonc
{
  "report_code": string,
  "report_version": int,
  "domain": string,
  "columns": [{
    "field": string,
    "type": string,
  }],
  "json_paths": [{
    "code": string,
    "pattern": string,
    "base_code": string,
    "name": string,
    "type": string,
    "multiplicity": string,
    "default": bool,
    "schema_uid": string,
    "root_type": string,
  }],
  "default_columns": [string],
  "filters": [{
    "name": string,
    "operators": [string],
    "search": string,
    "pattern": string,
    "normalize": string,
  }],
  "sort": {
    "default": [{
      "field": string,
      "direction": string,
    }],
    "allowed_fields": [string],
    "allowed_directions": [string],
  },
  "pagination": {
    "required": bool,
    "default_limit": int,
    "maximum_limit": int,
    "default_offset": int,
  },
  "export_enabled": bool,
  "export_formats": [string],
  "export_limits": {
    "max_rows": int,
    "max_bytes": int,
    "timeout_seconds": int,
  },
  "elapsed_ms": float,
}
```

### `POST /v1/reports/assets/search`
- **Ex. collection:** AST-06 — Consulta completa de Assets
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "report_code": "assets.inventory",
  "report_version": 2,
  "columns": [
    "uid",
    "uid_organization",
    "organization_name",
    "uid_entity",
    "entity_name",
    "uid_unit",
    "unit_name",
    "uid_situations",
    "situation_code",
    "situation_name",
    "effective_lifecycle",
    "identification",
    "uid_group",
    "primary_group",
    "groups",
    "uid_model",
    "model",
    "uid_fuel",
    "fuel",
    "uid_voltage",
    "voltage",
    "uid_technical_package",
    "technical_package",
    "vehicle",
    "linked_devices",
    "device_slots",
    "uid_image_logo",
    "created_at",
    "updated_at"
  ],
  "q": "",
  "filters": [],
  "include_inactive": false,
  "sort": [
    {
      "field": "identification",
      "direction": "asc"
    }
  ],
  "limit": 5,
  "offset": 0
}
```


---

## public/reports

### `GET /v1/public/reports/:token`
- **Ex. collection:** RC09-C — baixar relatório público sem autenticação
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `GET /v1/public/reports/token-invalido`
- **Ex. collection:** RC09-D — capability pública inválida
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## admin/events

### `GET /v1/admin/events/models`
- **Ex. collection:** EV01-HTTP-01 — Listar catálogo global de eventos
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "fixed": bool,
    "active": bool,
    "category": string,
    "defaults": {
      "threshold_hours": [int],
    },
    "periodic": bool,
    "activation_only": bool,
    "allowed_parameters": {
      "threshold_hours": string,
    },
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/events/models/:uid`
- **Ex. collection:** Teste 02 — Consultar o modelo diretamente
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "name": string,
  "fixed": bool,
  "active": bool,
  "category": string,
  "defaults": {
    "states": [string],
  },
  "periodic": bool,
  "created_at": string,
  "updated_at": string,
  "activation_only": bool,
  "uid_user_created": null,
  "uid_user_updated": null,
  "allowed_parameters": {
    "states": string,
  },
  "technical_required": bool,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/events/models/:uid/signal-mappings`
- **Ex. collection:** Teste 01 — Consultar associações existentes
- **Response (schema real):**
```jsonc
[{
  "state": string,
  "active": bool,
  "strategy": string,
  "end_codes": [[]],
  "uid_model": string,
  "created_at": string,
  "parameters": {},
  "updated_at": string,
  "signal_code": string,
  "duration_unit": null,
  "duration_field": null,
  "duration_scale": null,
  "duration_offset_seconds": null,
}]
```

### `PUT /v1/admin/events/models/:uid/signal-mappings`
- **Ex. collection:** Teste 03 — Associar ignition_on e ignition_off
- **Request body:**
```json
{
  "items": [
    {
      "signal_code": "ignition_on",
      "strategy": "instant",
      "state": "on",
      "parameters": {},
      "active": true
    },
    {
      "signal_code": "ignition_off",
      "strategy": "instant",
      "state": "off",
      "parameters": {},
      "active": true
    }
  ]
}
```

### `POST /v1/admin/events/models/search`
- **Ex. collection:** 02 - Filter Categories
- **Request body:**
```json
{"filters":[{"field":"category","operator":"eq","value":"mechanical"}]}
```

### `GET /v1/admin/events/protocol-variants`
- **Ex. collection:** EV02-HTTP-01 — Listar variantes protocolares
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "uid_model": string,
    "created_at": string,
    "model_name": string,
    "uid_user_created": null,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/events/protocol-variants`
- **Homologação de 2026-11-25:** Primary recebe 201 com a variante criada. Repetir a mesma chave com o mesmo corpo retorna 200 e o mesmo UID. Código duplicado para o modelo com outra chave retorna 409 `event_conflict`. Secondary consulta lista e detalhe (200) e recebe 403 `event_not_allowed` ao criar. Envie `Idempotency-Key`.
- **Ex. collection:** EV02-HTTP-03 — Bloquear criação de variante pelo Secondary
- **Request body:**
```json
{
  "uid_model": "185cfd21-0bb9-4dec-91d1-8ae5eb32f50f",
  "code": "EV02_SECONDARY_DENIED",
  "name": "EV02 - Teste de Permissão Secondary"
}
```

### `GET /v1/admin/events/protocol-variants/:uid`
- **Ex. collection:** EV02-HTTP-02 — Consultar detalhe com Secondary
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "name": string,
  "uid_model": string,
  "created_at": string,
  "model_name": string,
  "uid_user_created": null,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/events/rules`
- **Ex. collection:** EV02-HTTP-07 — Consultar regras existentes da organização
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "name": string,
    "active": bool,
    "target": {
      "uid_unit": null,
      "uid_asset": null,
      "uid_group": null,
      "uid_entity": null,
      "scope_level": string,
      "uid_organization": string,
    },
    "targets": [{
      "uid_unit": null,
      "uid_asset": null,
      "uid_group": null,
      "uid_entity": null,
      "scope_level": string,
      "uid_organization": string,
    }],
    "windows": [[]],
    "priority": string,
    "uid_model": string,
    "conditions": [[]],
    "created_at": string,
    "model_code": string,
    "parameters": {
      "states": [string],
      "uid_point": string,
    },
    "recipients": [[]],
    "updated_at": string,
    "valid_from": null,
    "valid_until": null,
    "delayed_seconds": int,
    "uid_organization": string,
    "recovery_for_seconds": int,
    "condition_for_seconds": int,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/events/rules`
- **Ex. collection:** EV02-HTTP-09 — Criar regra operacional
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_model": "649c4be3-b52d-4310-bbfb-5556cbaf010e",
  "name": "EV02 - Homologação Mudança de Ignição",
  "priority": "normal",
  "parameters": {
    "states": ["on", "off"]
  },
  "active": true,
  "targets": [
    {
      "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
      "scope_level": "organization"
    }
  ],
  "conditions": [],
  "windows": [],
  "recipients": []
}
```

### `GET /v1/admin/events/rules/:uid`
- **Ex. collection:** EV02-HTTP-13 — Consultar a regra original
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "name": string,
  "active": bool,
  "target": {
    "uid_unit": null,
    "uid_asset": null,
    "uid_group": null,
    "uid_entity": null,
    "scope_level": string,
    "uid_organization": string,
  },
  "targets": [{
    "uid_unit": null,
    "uid_asset": null,
    "uid_group": null,
    "uid_entity": null,
    "scope_level": string,
    "uid_organization": string,
  }],
  "windows": [[]],
  "priority": string,
  "uid_model": string,
  "conditions": [[]],
  "created_at": string,
  "deleted_at": null,
  "model_code": string,
  "parameters": {
    "states": [string],
    "uid_point": string,
  },
  "recipients": [[]],
  "updated_at": string,
  "valid_from": null,
  "valid_until": null,
  "delayed_seconds": int,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "recovery_for_seconds": int,
  "condition_for_seconds": int,
  "elapsed_ms": float,
}
```

### `DELETE /v1/admin/events/rules/:uid`
- **Ex. collection:** EV02-SEC-05 — Excluir a regra de homologação

### `GET /v1/admin/events/technical-maps`
- **Ex. collection:** EV01-HTTP-02 — Listar os mapas técnicos
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "active": bool,
    "created_at": string,
    "updated_at": string,
    "draft_revision": null,
    "published_revision": int,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/events/technical-maps`
- **Ex. collection:** EV01-HTTP-04 — Criar o primeiro mapa técnico
- **Request body:**
```json
{
  "code": "homolog_queclink_events",
  "name": "Homologação Queclink - Eventos",
  "active": true,
  "rules": [
    {
      "source_code": "ignition_on",
      "uid_event_model": "649c4be3-b52d-4310-bbfb-5556cbaf010e",
      "strategy": "instant"
    }
  ],
  "models": [
    {
      "uid_model": "f67f6ff6-f527-45b8-8d83-5d87e5f18bed",
      "protocol_variant": "GV30CAU",
      "valid_from": "2026-10-24T00:00:00-03:00",
      "valid_until": null
    }
  ]
}
```

### `GET /v1/admin/events/technical-maps/:uid`
- **Ex. collection:** EV01-HTTP-07 — Consultar o mapa técnico criado
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "name": string,
  "active": bool,
  "revisions": [{
    "uid": string,
    "rules": [{
      "strategy": string,
      "end_codes": [string],
      "source_code": string,
      "uid_event_model": string,
    }],
    "status": string,
    "uid_map": string,
    "bindings": [[]],
    "revision": int,
    "created_at": string,
    "updated_at": string,
    "published_at": null,
    "model_bindings": [{
      "uid_model": string,
      "valid_from": string,
      "valid_until": null,
      "protocol_variant": string,
    }],
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "created_at": string,
  "updated_at": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/events/technical-maps/:uid`
- **Ex. collection:** EV01-HTTP-08 — Atualizar o mapa técnico em draft
- **Request body:**
```json
{
  "code": "homolog_queclink_events",
  "name": "Homologação Queclink - Eventos Revisados",
  "active": true,
  "rules": [
    {
      "source_code": "ignition_on",
      "uid_event_model": "649c4be3-b52d-4310-bbfb-5556cbaf010e",
      "strategy": "instant"
    }
  ],
  "models": [
    {
      "uid_model": "f67f6ff6-f527-45b8-8d83-5d87e5f18bed",
      "protocol_variant": "GV30CAU",
      "valid_from": "2026-10-24T00:00:00-03:00",
      "valid_until": null
    }
  ]
}
```

### `POST /v1/admin/events/technical-maps/:uid/publish`
- **Ex. collection:** EV01-HTTP-27 — Publicar o mapa técnico


---

## admin/devices

### `POST /v1/admin/devices`
- **Ex. collection:** DR-19 — Cadastrar dispositivo para o segundo destino
- **Request body:**
```json
{
  "uid_organization": "8682539f-20db-470e-9776-336b49859f08",
  "uid_type": "14c309f0-a8c6-4fe1-9e31-7cf2015fa6bb",
  "uid_manufacturer": "bed9f48e-2769-4e4a-bf28-494ab1d12055",
  "uid_model": "f67f6ff6-f527-45b8-8d83-5d87e5f18bed",
  "device_serial": "HOMOLOG-RESOLVER-0217-B",
  "device_imei": null,
  "active": true,
  "transmits": true
}
```

### `GET /v1/admin/devices/:uid`
- **Ex. collection:** CP-83 — Consultar o dispositivo e suas operações disponíveis
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "active": bool,
  "locked": bool,
  "uid_type": string,
  "transmits": bool,
  "uid_model": string,
  "created_at": string,
  "updated_at": string,
  "device_imei": null,
  "has_password": bool,
  "device_serial": string,
  "condition_status": string,
  "inventory_status": string,
  "uid_manufacturer": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/devices/:uid`
- **Ex. collection:** TP-24 — Verificar o contrato de alteração do dispositivo
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_type": "426fc714-6265-43bb-afe4-b4c7dcea802c",
  "uid_manufacturer": "a96af33c-485e-46df-963a-78a1b8c3446f",
  "uid_model": "b44513c1-630b-47e0-ad4f-855e928568a9",
  "device_serial": "HOMOLOG-PRICING-0206-CAM-001",
  "device_imei": null,
  "active": true,
  "transmits": false
}
```

### `POST /v1/admin/devices/:uid/prepare`
- **Ex. collection:** DR-20 — Preparar dispositivo
- **Request body:**
```json
{}
```

### `POST /v1/admin/devices/:uid/release`
- **Ex. collection:** DR-21 — Liberar dispositivo
- **Request body:**
```json
{
  "inventory_status": "available"
}
```

### `GET /v1/admin/devices/custody`
- **Ex. collection:** DR-39 — Consultar a custódia do dispositivo
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "status": string,
    "purpose": string,
    "closed_at": null,
    "uid_asset": string,
    "created_at": string,
    "uid_device": string,
    "updated_at": string,
    "received_at": null,
    "device_serial": string,
    "dispatched_at": string,
    "uid_technician": string,
    "uid_work_order": string,
    "technician_name": string,
    "uid_organization": string,
    "work_order_number": int,
    "asset_identification": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/devices/custody/:uid/confirm-receipt`
- **Ex. collection:** DR-40 — Confirmar recebimento do dispositivo
- **Request body:**
```json
{}
```

### `POST /v1/admin/devices/custody/:uid/declare-return`
- **Ex. collection:** 30 — declarar devolução do device antigo
- **Request body:**
```json
{
  "condition": "testing",
  "notes": "HOMOLOG equipamento substituído retornando para a organização"
}
```

### `POST /v1/admin/devices/custody/:uid/receive`
- **Ex. collection:** 31 — recebimento físico pela organização

### `GET /v1/admin/devices/linked-simcards`
- **Ex. collection:** } CP-86 — SIM já vinculado a outro dispositivo.
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "created_at": string,
    "uid_device": string,
    "updated_at": string,
    "uid_simcard": string,
    "uid_organization": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/devices/linked-simcards`
- **Ex. collection:** DR-25 — Vincular SIM Card ao dispositivo
- **Request body:**
```json
{
  "uid_device": "e06f84c9-4ef2-4429-859a-04fdfdd92503",
  "uid_simcard": "2cf3e7fc-570b-4287-83ea-4bf827b666e2"
}
```

### `GET /v1/admin/devices/models`
- **Ex. collection:** EV01-HTTP-03 — Consultar um modelo físico para associação
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "name": string,
    "active": bool,
    "uid_type": string,
    "created_at": string,
    "updated_at": string,
    "requires_simcard": bool,
    "uid_manufacturer": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/devices/models`
- **Homologação de 2026-11-25:** Primary cadastra com `Idempotency-Key` e recebe 201 com os campos do modelo. Duplicata retorna 409 `device_catalog_conflict`. Secondary pode consultar o detalhe e recebe 403 `device_catalog_not_allowed` ao cadastrar ou editar.
- **Ex. collection:** EV01-HTTP-25 — Criar modelo físico exclusivo para testar a publicação
- **Request body:**
```json
{
  "name": "EV01-HOMOLOG-MODEL-20261024",
  "uid_type": "426fc714-6265-43bb-afe4-b4c7dcea802c",
  "uid_manufacturer": "a96af33c-485e-46df-963a-78a1b8c3446f",
  "requires_simcard": false,
  "active": true
}
```

### `GET /v1/admin/devices/models/:uid`
- **Ex. collection:** EV01-HTTP-30 — Criar revisão 3 removendo a associação ao modelo
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "name": string,
  "active": bool,
  "uid_type": string,
  "created_at": string,
  "updated_at": string,
  "requires_simcard": bool,
  "uid_manufacturer": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/devices/models/:uid`
- **Homologação de 2026-11-25:** o corpo completo abaixo preserva nome, status, tipo e fabricante ao alterar `requires_simcard`. Retorno 200 com o modelo atualizado. Tipo sem associação ao fabricante retornou 422 `invalid_device_catalog`.
- **Ex. collection:** 98 — marcar modelo como requires_simcard=true
- **Request body:**
```json
{
  "name": "HOMOLOG-813-0fab5a99devices",
  "active": true,
  "uid_type": "14c309f0-a8c6-4fe1-9e31-7cf2015fa6bb",
  "uid_manufacturer": "bed9f48e-2769-4e4a-bf28-494ab1d12055",
  "requires_simcard": true
}
```

### `POST /v1/admin/devices/protocol-identities`
- **Ex. collection:** DR-01 — Cadastrar identidade protocolar
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_device": "f003b0ec-5b75-4566-bcc5-035ca298f44b",
  "vendor": "suntech",
  "device_number": "2290026110",
  "model": "229",
  "active": true
}
```

### `POST /v1/admin/devices/protocol-identities/:uid/shares`
- **Ex. collection:** DR-44 — Compartilhar identidade protocolar com a organização B
- **Request body:**
```json
{
  "uid_organization": "8682539f-20db-470e-9776-336b49859f08",
  "uid_device": "e06f84c9-4ef2-4429-859a-04fdfdd92503",
  "reason": "Compartilhamento autorizado para homologacao do resolver de telemetria 1:N"
}
```

### `POST /v1/admin/devices/search`
- **Ex. collection:** EV01-HTTP-23 — Verificar dispositivos vinculados ao modelo
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_model",
      "operator": "eq",
      "value": "b44513c1-630b-47e0-ad4f-855e928568a9"
    }
  ]
}
```

### `POST /v1/admin/devices/technical-packages`
- **Ex. collection:** C17 — criar pacote técnico para o slot 4
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "code": "homolog-slot4-test",
  "name": "HOMOLOG Slot 4 com teste obrigatório",
  "instructions": {
    "installation": "Validar fixação, alimentação e comunicação antes de concluir."
  },
  "requirements": [
    {
      "slot_number": 4,
      "requirement_type": "auxiliary_tracker",
      "uid_device_type": "14c309f0-a8c6-4fe1-9e31-7cf2015fa6bb",
      "uid_device_model": "f67f6ff6-f527-45b8-8d83-5d87e5f18bed",
      "required": true,
      "instructions": {
        "check": "Confirmar alimentação e transmissão."
      },
      "tests": [
        {
          "test_code": "boot",
          "name": "Inicialização e transmissão",
          "required": true
        }
      ]
    }
  ]
}
```

### `POST /v1/admin/devices/telemetry-mapping-profiles`
- **Ex. collection:** DR-06 — Cadastrar mapping padrão
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_manufacturer": "bed9f48e-2769-4e4a-bf28-494ab1d12055",
  "protocol_model": "229",
  "active": true,
  "mappings": [
    {
      "source": "S_ASSIGN1",
      "canonical": "extBatteryVoltage",
      "group": "hardware",
      "type": "number",
      "unit": "V",
      "scale": 1,
      "offset": 0
    }
  ]
}
```

### `POST /v1/admin/devices/telemetry-mappings`
- **Ex. collection:** DR-06 — Cadastrar mapping padrão Suntech 229
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_manufacturer": "bed9f48e-2769-4e4a-bf28-494ab1d12055",
  "protocol_model": "229",
  "active": true,
  "mappings": [
    {
      "source": "S_ASSIGN1",
      "canonical": "extBatteryVoltage",
      "group": "hardware",
      "type": "number",
      "unit": "V",
      "scale": 1,
      "offset": 0
    }
  ]
}
```

### `GET /v1/admin/devices/types`
- **Ex. collection:** EV01-HTTP-24 — Identificar um tipo de dispositivo para a fixture
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "name": string,
    "active": bool,
    "created_at": string,
    "updated_at": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/devices/types`
- **Homologação de 2026-11-25:** Primary cadastra com `Idempotency-Key` e recebe 201 com o tipo. Duplicata retorna 409 `device_catalog_conflict`. Secondary tem acesso à lista e recebe 403 `device_catalog_not_allowed` ao cadastrar.
- **Ex. collection:** TC30 — criar device type pela API
- **Request body:**
```json
{
  "name": "TABLECACHE-HOMOLOG-API-20261010",
  "active": true
}
```

### `GET /v1/admin/devices/work-orders`
- **Query:** `limit, offset, state, uid_technician`
- **Ex. collection:** L1 — Admin, listagem default pending
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "number": int,
    "status": string,
    "uid_asset": string,
    "created_at": string,
    "started_at": null,
    "updated_at": string,
    "description": string,
    "items_total": int,
    "cancelled_at": null,
    "completed_at": null,
    "dispatched_at": string,
    "items_pending": int,
    "uid_technician": string,
    "items_completed": int,
    "uid_organization": string,
    "uid_provider_entity": string,
    "asset_identification": string,
    "provider_name_snapshot": string,
    "technician_name_snapshot": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/devices/work-orders`
- **Ex. collection:** DR-37 — Criar Ordem de Serviço de instalação
- **Request body:**
```json
{
  "uid_asset": "ee767547-aef6-4b59-9911-a816aef69364",
  "uid_technician": "f0047a27-0491-4a36-964f-853b519ddf98",
  "description": "Homologação Resolver 1:N - Instalação de dispositivo",
  "items": [
    {
      "slot_number": 1,
      "operation": "install",
      "uid_device_before": null,
      "uid_device_after": "e06f84c9-4ef2-4429-859a-04fdfdd92503"
    }
  ]
}
```

### `POST /v1/admin/devices/work-orders/:uid/complete`
- **Ex. collection:** DR-42 — Concluir instalação da OS 102
- **Request body:**
```json
{
  "items": [
    {
      "uid_item": "6e29f1dd-3526-4011-861b-cbc4a680af8b",
      "result_notes": "Instalação de homologação do resolver 1:N concluída"
    }
  ]
}
```

### `POST /v1/admin/devices/work-orders/:uid/dispatch`
- **Ex. collection:** DR-38 — Despachar Ordem de Serviço 102
- **Request body:**
```json
{
  "dispatch_method": "courier",
  "dispatch_reference": "HOMOLOG-RESOLVER-0217-OS102",
  "dispatch_cost_cents": 0,
  "dispatch_notes": "Despacho de homologação do resolver 1:N"
}
```

### `POST /v1/admin/devices/work-orders/:uid/start`
- **Ex. collection:** DR-41 — Iniciar Ordem de Serviço 102
- **Request body:**
```json
{}
```

### `POST /v1/admin/devices/work-orders/search`
- **Ex. collection:** L12 — /search administrativo com filtro por executor
- **Request body:**
```json
{
  "state": "all",
  "limit": 25,
  "offset": 0,
  "filters": [
    {
      "field": "uid_technician",
      "operator": "eq",
      "value": "e33312b8-bbc5-4648-a92e-bc1b372a573c"
    }
  ]
}
```


---

## admin/geo

### `GET /v1/admin/geo/points`
- **Ex. collection:** GEO-HTTP-01 — Listar pontos cadastrados
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "name": string,
    "active": bool,
    "geojson": {
      "type": string,
      "coordinates": [float],
    },
    "latitude": float,
    "longitude": float,
    "uid_asset": null,
    "created_at": string,
    "uid_entity": null,
    "updated_at": string,
    "description": string,
    "scope_level": string,
    "radius_meters": float,
    "uid_organization": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/geo/points`
- **Ex. collection:** GEO-HTTP-02 — Criar ponto com raio de 500 metros
- **Request body:**
```json
{
  "scope_level": "organization",
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "name": "GEO-HOMOLOG - Ponto com Raio",
  "description": "Ponto de homologação para evento de entrada e saída",
  "latitude": -19.931,
  "longitude": -43.938,
  "radius_meters": 500,
  "active": true
}
```

### `PUT /v1/admin/geo/points/:uid`
- **Ex. collection:** GEO-SYNC-09 — Alterar o raio de 500 para 800 metros
- **Request body:**
```json
{
  "scope_level": "organization",
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "name": "GEO-HOMOLOG - Ponto com Raio",
  "description": "Ponto de homologação para evento de entrada e saída",
  "latitude": -19.931,
  "longitude": -43.938,
  "radius_meters": 800,
  "active": true
}
```


---

## admin/simcards

### `GET /v1/admin/simcards`
- **Ex. collection:** CP-85 — Consultar SIM Cards disponíveis
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "iccid": string,
    "active": bool,
    "msisdn": null,
    "created_at": string,
    "updated_at": string,
    "operator_name": string,
    "uid_organization": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/simcards`
- **Ex. collection:** DR-24 — Cadastrar SIM Card de homologação
- **Request body:**
```json
{
  "uid_organization": "8682539f-20db-470e-9776-336b49859f08",
  "iccid": "89510000000000210217",
  "msisdn": null,
  "operator_name": "Operadora Homologacao Resolver",
  "active": true
}
```


---

## admin/assets

### `POST /v1/admin/assets`
- **Ex. collection:** F32 — Criar asset rodoviário com veículo
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_entity": "6e40aece-42bb-4a41-ac48-57afa5435ca8",
  "uid_unit": "842741fd-8fbb-46c6-b0c9-be3e05c28ec0",
  "uid_model": "09c8171a-a1a5-46b9-8ca0-4e2337b058c8",
  "uid_fuel": "28607c62-4c42-4c0a-bc8d-7fb43aa9a369",
  "identification": "HOMOLOG-FIPE-AUDI-2014-01",
  "vehicle": {
    "plate": "FIP2A14",
    "model_year": 2014,
    "telemetry_params_override": {
      "gps": {
        "report_interval": 30
      }
    }
  }
}
```

### `GET /v1/admin/assets/:uid`
- **Ex. collection:** DR-36 — Verificar requisitos técnicos do asset
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "groups": [string],
  "vehicle": null,
  "uid_fuel": null,
  "uid_unit": string,
  "uid_group": string,
  "uid_model": string,
  "created_at": string,
  "deleted_at": null,
  "uid_entity": string,
  "updated_at": string,
  "uid_voltage": null,
  "asset_profile": string,
  "identification": string,
  "uid_image_logo": null,
  "uid_situations": string,
  "telemetry_params": {},
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "uid_technical_package": null,
  "telemetry_params_model": {},
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/assets/:uid`
- **Ex. collection:** 01 - MOve A1 to UNit Def
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_entity": "34ecddd9-b634-4bf1-a3b9-bd1df43c1ee8",
  "uid_unit": "f0a9b007-3c59-43dd-adcb-2bd490e64f8e",
  "identification": "SCOPE-0067-COPA-01",
  "uid_model": null
}
```

### `PATCH /v1/admin/assets/:uid`
- **Ex. collection:** F37 — Alterar o ano do veículo para preparar cache miss
- **Request body:**
```json
{
  "vehicle": {
    "model_year": 2013
  }
}
```

### `GET /v1/admin/assets/:uid/device-slots`
- **Ex. collection:** DR-27 — Verificar os slots do asset
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "active": bool,
    "uid_asset": string,
    "created_at": string,
    "updated_at": string,
    "slot_number": int,
    "uid_organization": string,
    "uid_user_created": null,
    "uid_user_updated": null,
  }],
  "total": int,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/assets/:uid/link_history`
- **Ex. collection:** CP-94 — Consultar dispositivos vinculados ao ativo
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "host": string,
    "details": {
      "after": {
        "uid": string,
        "uid_asset": string,
        "created_at": string,
        "uid_device": string,
        "updated_at": string,
        "slot_number": int,
        "uid_organization": string,
        "uid_user_created": string,
        "uid_user_updated": string,
      },
      "before": null,
      "uid_asset": string,
      "uid_device": string,
      "slot_number": int,
      "uid_work_order": string,
      "uid_asset_after": string,
      "uid_asset_before": null,
    },
    "uid_actor": string,
    "event_type": string,
    "request_id": string,
    "occurred_at": string,
    "server_name": string,
    "slot_number": int,
    "uid_technician": string,
    "uid_work_order": string,
    "uid_device_after": string,
    "uid_device_before": null,
    "uid_provider_entity": string,
    "provider_name_snapshot": string,
    "technician_name_snapshot": string,
  }],
  "total": int,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/assets/:uid/technical-package`
- **Ex. collection:** C18 — vincular pacote técnico ao asset
- **Request body:**
```json
{
  "uid_technical_package": "c9b1e536-50dc-42be-9858-fdcbae55f84b"
}
```

### `GET /v1/admin/assets/:uid/valuation`
- **Ex. collection:** F34 — Valuation FIPE do asset
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `GET /v1/admin/assets/fuels`
- **Query:** `q`
- **Ex. collection:** FB10 — Provar que o snapshot anterior continua funcional
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "name": string,
    "active": bool,
    "created_at": string,
    "updated_at": string,
    "fipe_fuel_code": null,
    "uid_user_created": null,
    "uid_user_updated": null,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/assets/fuels/:uid`
- **Ex. collection:** EV11-D — gerar novo access event
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "name": string,
  "active": bool,
  "created_at": string,
  "updated_at": string,
  "fipe_fuel_code": null,
  "uid_user_created": null,
  "uid_user_updated": null,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/assets/fuels/:uid`
- **Ex. collection:** F28 — Mapear Gasoline para o código FIPE
- **Request body:**
```json
{
  "name": "Gasoline",
  "active": true,
  "fipe_fuel_code": 1
}
```

### `POST /v1/admin/assets/group-assets`
- **Ex. collection:** 38 — adicionar A1 ao G1
- **Request body:**
```json
{
  "uid_group": "52f410cd-f2a8-41c4-9140-28c61cf8bae6",
  "uid_asset": "bc8d08ba-9b30-42f5-9faf-ac94dbb69769"
}
```

### `DELETE /v1/admin/assets/group-assets/:uid`
- **Ex. collection:** 44 — remover A1 do G1
- **Request body:**
```json
{
  "uid_group": "52f410cd-f2a8-41c4-9140-28c61cf8bae6",
  "uid_asset": "bc8d08ba-9b30-42f5-9faf-ac94dbb69769"
}
```

### `POST /v1/admin/assets/groups`
- **Ex. collection:** 02 - Create
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "name": "HOMOLOG Scope Group G1"
}
```

### `GET /v1/admin/assets/linked-devices`
- **Query:** `filters`
- **Ex. collection:** 96a - Slots
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "slot_code": string,
    "slot_name": string,
    "uid_asset": string,
    "created_at": string,
    "uid_device": string,
    "updated_at": string,
    "slot_number": int,
    "uid_organization": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/assets/linked-devices/search`
- **Ex. collection:** CP-95 — Consultar vínculos ativos do ativo
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    },
    {
      "field": "uid_asset",
      "operator": "eq",
      "value": "3fde142d-5331-4c1f-a356-faf0aaa4c8e2"
    }
  ]
}
```

### `GET /v1/admin/assets/manufacturers/:uid`
- **Ex. collection:** F18 — Consultar o fabricante do asset
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "name": string,
  "types": [string],
  "active": bool,
  "created_at": string,
  "updated_at": string,
  "fipe_brand_codes": {
    "93df5f22-9d4a-449c-9332-b0364193f70a": string,
  },
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/assets/manufacturers/:uid`
- **Ex. collection:** F19 — Associar o fabricante ao tipo rodoviário
- **Request body:**
```json
{
  "name": "HOMOLOG-813-44e4cd4aassets",
  "active": true,
  "types": [
    "d1c3e08d-0bc3-447c-a562-3e53ad8374fc",
    "93df5f22-9d4a-449c-9332-b0364193f70a"
  ],
  "fipe_brand_codes": {}
}
```

### `POST /v1/admin/assets/models`
- **Ex. collection:** F23 — Criar modelo dedicado para a homologação FIPE
- **Request body:**
```json
{
  "name": "HOMOLOG-FIPE-AUDI-20261005",
  "active": true,
  "uid_type": "93df5f22-9d4a-449c-9332-b0364193f70a",
  "uid_manufacturer": "4f547b91-8b31-42bc-8f00-a6ff88878731"
}
```

### `GET /v1/admin/assets/models/:uid`
- **Ex. collection:** F22 — Consultar o modelo que vamos mapear para FIPE
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "name": string,
  "active": bool,
  "uid_type": string,
  "created_at": string,
  "updated_at": string,
  "fipe_model_code": null,
  "telemetry_params": {},
  "uid_manufacturer": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/assets/models/:uid`
- **Ex. collection:** F25 — Mapear o modelo Navisoft para o modelo FIPE
- **Request body:**
```json
{
  "name": "HOMOLOG-FIPE-AUDI-20261005",
  "active": true,
  "uid_type": "93df5f22-9d4a-449c-9332-b0364193f70a",
  "uid_manufacturer": "4f547b91-8b31-42bc-8f00-a6ff88878731",
  "fipe_model_code": "5496",
  "telemetry_params": {
    "gps": {
      "report_interval": 60
    }
  }
}
```

### `POST /v1/admin/assets/search`
- **Ex. collection:** CP-92 — Consultar os ativos da organização A
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    }
  ]
}
```

### `POST /v1/admin/assets/types`
- **Ex. collection:** F46 — Rejeitar mapeamento FIPE inválido sem tocar em cadastro existente
- **Request body:**
```json
{
  "name": "HOMOLOG-FIPE-INVALID-20261005",
  "active": true,
  "profile_code": "road_vehicle",
  "fipe_vehicle_type": "aircraft"
}
```

### `GET /v1/admin/assets/types/:uid`
- **Ex. collection:** F16 — Consultar o tipo de asset que vamos transformar em veículo rodoviário Método
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "name": string,
  "active": bool,
  "created_at": string,
  "updated_at": string,
  "profile_code": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "fipe_vehicle_type": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/assets/types/:uid`
- **Ex. collection:** F17 — Configurar o tipo como road_vehicle / cars
- **Request body:**
```json
{
  "name": "HOMOLOG-813-12b803a4assets",
  "active": true,
  "profile_code": "road_vehicle",
  "fipe_vehicle_type": "cars"
}
```

### `GET /v1/admin/assets/voltages`
- **Query:** `q`
- **Ex. collection:** 02 - Filter Voltage
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "name": string,
    "active": bool,
    "created_at": string,
    "updated_at": string,
    "uid_user_created": null,
    "uid_user_updated": null,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/assets/voltages/search`
- **Ex. collection:** TC13 — primeiro acesso a assets.voltages
- **Request body:**
```json
{
  "q": "220",
  "filters": [
    {
      "field": "active",
      "operator": "eq",
      "value": "true"
    }
  ]
}
```


---

## admin/entities

### `GET /v1/admin/entities`
- **Ex. collection:** 01 - List
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "name": string,
    "uid_unit": string,
    "created_at": string,
    "updated_at": string,
    "uid_image_logo": null,
    "uid_situations": string,
    "uid_organization": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/entities`
- **Ex. collection:** DR-32 — Cadastrar entidade prestadora
- **Request body:**
```json
{
  "uid_organization": "8682539f-20db-470e-9776-336b49859f08",
  "uid_unit": "57943b6a-e8dd-4650-8f8a-3716ae41c9e1",
  "name": "HOMOLOG-RESOLVER-0217-PRESTADORA"
}
```

### `GET /v1/admin/entities/:uid`
- **Ex. collection:** 8 — conferir a entidade
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "uid_organization": string,
  "uid_unit": string,
  "uid_situations": string,
  "name": string,
  "types": [{
    "uid": string,
    "uid_organization": string,
    "code": string,
    "name": string,
    "is_system": bool,
    "active": bool,
  }],
  "created_at": string,
  "updated_at": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/entities/:uid/types`
- **Ex. collection:** DR-34 — Habilitar a entidade como prestadora técnica
- **Request body:**
```json
{
  "types": [
    "832ea1b7-295b-4149-9559-4dc72995b644",
    "fa0e7795-14b0-4920-806d-da46e541faae"
  ]
}
```

### `POST /v1/admin/entities/drivers`
- **Ex. collection:** 8 — criar motorista com os mesmos dados do executor
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "name": "HOMOLOG Executor Técnico 0086",
  "birth_date": "1988-04-03",
  "internal_contract_number": "HOMOLOG-DRV-0086",
  "scopes": [
    {}
  ]
}
```

### `PATCH /v1/admin/entities/drivers/:uid`
- **Ex. collection:** Alterar Nome Motorista
- **Request body:**
```json
{
  "name": "HOMOLOG Motorista Independente 0086"
}
```

### `POST /v1/admin/entities/search`
- **Ex. collection:** 01 - Filter
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    }
  ]
}
```

### `GET /v1/admin/entities/technician-capabilities`
- **Ex. collection:** TP-08 — Consultar catálogo de capacidades
- **Response (schema real):**
```jsonc
[{
  "uid": string,
  "code": string,
  "kind": string,
  "name": string,
  "active": bool,
  "sort_order": int,
}]
```

### `POST /v1/admin/entities/technicians`
- **Ex. collection:** DR-35 — Cadastrar executor técnico
- **Request body:**
```json
{
  "uid_organization": "8682539f-20db-470e-9776-336b49859f08",
  "uid_provider_entity": "fbaccd60-7501-44d3-a91a-6269f78aeb3f",
  "name": "Executor Homologação Resolver 0217",
  "active": true
}
```

### `GET /v1/admin/entities/technicians/:uid`
- **Ex. collection:** TP-07 — Consultar as capacidades do técnico
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "name": string,
  "active": bool,
  "uid_user": string,
  "birth_date": string,
  "created_at": string,
  "deleted_at": null,
  "updated_at": string,
  "capabilities": [{
    "code": string,
    "kind": string,
    "name": string,
  }],
  "open_custody": int,
  "provider_name": string,
  "open_work_orders": int,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "uid_provider_entity": string,
  "elapsed_ms": float,
}
```

### `PATCH /v1/admin/entities/technicians/:uid`
- **Ex. collection:** TP-09 — Vincular capacidades ao técnico
- **Request body:**
```json
{
  "capabilities": [
    "installation",
    "removal",
    "maintenance",
    "telemetry",
    "vehicle_cameras"
  ]
}
```

### `GET /v1/admin/entities/technicians/:uid/prices`
- **Ex. collection:** TP-32 — Verificar isolamento da tabela de preços
- **Response (schema real):**
```jsonc
{
  "items": [{
    "version": int,
    "operation": string,
    "effective_at": string,
    "currency_code": string,
    "markup_percent": float,
    "capability_code": string,
    "client_price_cents": int,
    "technician_cost_cents": int,
  }],
  "uid_technician": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/entities/technicians/:uid/prices`
- **Ex. collection:** TP-29 — Reajustar novamente a tabela do técnico
- **Request body:**
```json
{
  "items": [
    {
      "capability_code": "vehicle_cameras",
      "operation": "install",
      "technician_cost_cents": 13000,
      "markup_percent": 40,
      "currency_code": "BRL"
    },
    {
      "capability_code": "vehicle_cameras",
      "operation": "remove",
      "technician_cost_cents": 4000,
      "markup_percent": 50,
      "currency_code": "BRL"
    },
    {
      "capability_code": "vehicle_cameras",
      "operation": "replace",
      "technician_cost_cents": 12000,
      "markup_percent": 35,
      "currency_code": "BRL"
    },
    {
      "capability_code": "telemetry",
      "operation": "install",
      "technician_cost_cents": 7000,
      "markup_percent": 40,
      "currency_code": "BRL"
    }
  ]
}
```

### `GET /v1/admin/entities/technicians/:uid/user-account`
- **Ex. collection:** L5.1 — conferir vínculo executor ↔ usuário
- **Response (schema real):**
```jsonc
{
  "active": bool,
  "uid_user": string,
  "updated_at": string,
  "user_enabled": bool,
  "uid_technician": string,
  "uid_organization": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/entities/technicians/:uid/user-account`
- **Ex. collection:** L5.6 — vincular Basic ao executor
- **Request body:**
```json
{
  "uid_user": "091e62c3-75c1-432c-93e4-4a0134174efd"
}
```

### `POST /v1/admin/entities/technicians/search`
- **Ex. collection:** CP-96 — Consultar técnicos da organização A
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    }
  ]
}
```

### `POST /v1/admin/entities/types`
- **Ex. collection:** 01 - Create Technician
- **Request body:**
```json
{"uid_organization":"adbadcf0-1a3f-4be6-b129-2adf05f565cf","code":"technician","name":"Técnico","active":true}
```

### `POST /v1/admin/entities/types/search`
- **Ex. collection:** 2 — buscar o tipo technician
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    }
  ]
}
```

### `POST /v1/admin/entities/units`
- **Ex. collection:** 63 — criar segunda unit da E1
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_entity": "34ecddd9-b634-4bf1-a3b9-bd1df43c1ee8",
  "name": "HOMOLOG Savassi"
}
```

### `POST /v1/admin/entities/units/search`
- **Ex. collection:** 35 — listar Units da E2
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    },
    {
      "field": "uid_entity",
      "operator": "eq",
      "value": "0a267d6b-6543-4973-bf4f-1c35d465208e"
    }
  ]
}
```


---

## technician/work-orders

### `GET /v1/technician/work-orders`
- **Query:** `limit, offset, state, uid_technician`
- **Ex. collection:** L5.7 — listar OS pendentes do executor
- **Response (schema real):**
```jsonc
{
  "items": [[]],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `GET /v1/technician/work-orders/:uid`
- **Ex. collection:** TP-31 — Verificar acesso do executor à OS
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `POST /v1/technician/work-orders/:uid/complete`
- **Ex. collection:** C15 — concluir SOMENTE o item de manutenção
- **Request body:**
```json
{
  "items": [
    {
      "uid_item": "f96e21cd-a443-4d30-9e7a-77d29af84c3b",
      "result_notes": "Manutenção do equipamento secundário concluída na homologação 0092-0099"
    }
  ]
}
```

### `POST /v1/technician/work-orders/:uid/start`
- **Ex. collection:** C11 — técnico tenta iniciar antes de confirmar recebimento

### `POST /v1/technician/work-orders/search`
- **Ex. collection:** L9 — state não pode ser combinado com filtro status
- **Request body:**
```json
{
  "state": "pending",
  "filters": [
    {
      "field": "status",
      "operator": "eq",
      "value": "draft"
    }
  ]
}
```


---

## admin/organizations

### `GET /admin/organizations/:uid`
- **Ex. collection:** NC09M-A — identificar o serviço atrás do baseUrl
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `PUT /admin/organizations/:uid`
- **Ex. collection:** NC10G — preparar teste de “Notify executou, Core não sabe”
- **Request body:**
```json
{
  "companyName": "Notify Sync Remote Drift"
}
```

### `GET /v1/admin/organizations`
- **Query:** `q`
- **Ex. collection:** PB01 — escolher uma organização descartável para testar troca de plano
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid_organization_owner": string,
    "reseller_enabled": bool,
    "uid_user_created": string,
    "uid_billing_plan": string,
    "uid_valuation_currency": string,
    "uid_timezone": string,
    "uid": string,
    "code": string,
    "name": string,
    "uid_situations": string,
    "created_at": string,
    "updated_at": string,
  }],
  "total": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/organizations`
- **Ex. collection:** HTTP-R04 — Power cria organização cliente
- **Request body:**
```json
{
  "code": "automega-power-homolog",
  "name": "Automega Power Homologação",
  "email": "admin@automega-power-homolog.example",
  "admin_name": "Administrador Automega Power",
  "admin_login": "admin.automega.power",
  "uid_billing_plan": "c0320000-0000-4000-8000-000000000001"
}
```

### `GET /v1/admin/organizations/`
- **Ex. collection:** SVC-0186-07A — Validar o uidAutoscale usado no teste
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `GET /v1/admin/organizations/:uid`
- **Ex. collection:** Situação da Fase 2 — Reseller Billing Accounts
- **Response (schema real):**
```jsonc
{
  "uid_organization_owner": string,
  "reseller_enabled": bool,
  "uid_user_created": string,
  "uid_billing_plan": string,
  "uid_valuation_currency": string,
  "uid_timezone": string,
  "uid": string,
  "code": string,
  "name": string,
  "email": string,
  "uid_situations": string,
  "created_at": string,
  "updated_at": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/organizations/:uid`
- **Ex. collection:** HTTP-R01 — Primary habilitar uma organização como revenda
- **Request body:**
```json
{
  "reseller_enabled": true
}
```

### `PATCH /v1/admin/organizations/:uid`
- **Ex. collection:** HTTP-R10 — Administrar cliente existente após revogação
- **Request body:**
```json
{
  "name": "Automega Power Homologação - Atualizada"
}
```

### `GET /v1/admin/organizations/:uid/access-periods`
- **Ex. collection:** SR11-A — ler a configuração atual de horário da empresa-teste
- **Response (schema real):**
```jsonc
{
  "mode": string,
  "week": {
    "friday": [{
      "end": string,
      "start": string,
    }],
    "monday": [{
      "end": string,
      "start": string,
    }],
    "sunday": [{
      "end": string,
      "start": string,
    }],
    "tuesday": [{
      "end": string,
      "start": string,
    }],
    "saturday": [{
      "end": string,
      "start": string,
    }],
    "thursday": [{
      "end": string,
      "start": string,
    }],
    "wednesday": [{
      "end": string,
      "start": string,
    }],
  },
  "timezone": string,
  "uid_organization": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/organizations/:uid/access-periods`
- **Ex. collection:** SR11-B — criar uma transição próxima
- **Request body:**
```json
{
  "mode": "block",
  "timezone": "America/Sao_Paulo",
  "week": {
    "monday": [{"start":"00:00","end":"23:59"}],
    "tuesday": [{"start":"00:00","end":"23:59"}],
    "wednesday": [{"start":"00:00","end":"23:59"}],
    "thursday": [{"start":"00:00","end":"23:59"}],
    "friday": [{"start":"00:00","end":"23:59"}],
    "saturday": [{"start":"00:00","end":"15:36"}],
    "sunday": [{"start":"00:00","end":"23:59"}]
  }
}
```

### `PUT /v1/admin/organizations/:uid/billing-account`
- **Ex. collection:** B201-01 — Estabelecer a Power como própria pagadora
- **Request body:**
```json
{
  "uid_payer_organization": "a0000000-0000-4000-8000-000000000002",
  "uid_commercial_origin_organization": "a0000000-0000-4000-8000-000000000001",
  "reason": "Estabelecimento inicial da conta financeira da revenda Power - Fase 2",
  "confirm_transfer": true
}
```

### `DELETE /v1/admin/organizations/:uid/billing-account`
- **Ex. collection:** B201-13 — Impedir a remoção financeira da Power
- **Request body:**
```json
{
  "reason": "Homologacao 0201: validar protecao do pagador principal da conta Power",
  "confirm_removal": true
}
```

### `PATCH /v1/admin/organizations/:uid/branding`
- **Ex. collection:** FB06 — Sanitização do Branding
- **Request body:**
```json
{
  "theme": {
    "primary": "VALOR_SECRETO_SENTINELA_123"
  }
}
```

### `GET /v1/admin/organizations/:uid/integration-tokens/autoscale-notifications`
- **Ex. collection:** NC09H — confirmar que o token retornado pelo Notify foi persistido no Core
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "enabled": bool,
    "provider": string,
    "created_at": string,
    "revoked_at": null,
    "updated_at": string,
    "uid_organization": string,
  }],
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/organizations/:uid/integration-tokens/autoscale-notifications`
- **Ex. collection:** NC07Z — importar a credencial Notify da organização
- **Request body:**
```json
{
  "token": "TOKEN_EMITIDO_PELO_AUTOSCALE_NOTIFY_PARA_ESTA_ORGANIZACAO"
}
```

### `PATCH /v1/admin/organizations/:uid/lifecycle`
- **Ex. collection:** NC09K — testar lifecycle → Notify
- **Request body:**
```json
{
  "state": "blocked",
  "reason": "Homologação sync Notify 0179"
}
```

### `GET /v1/admin/organizations/:uid/services`
- **Ex. collection:** SVC-0186-05 — Listar serviços da organização
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "version": int,
    "created_at": string,
    "updated_at": string,
    "uid_service": string,
    "desired_status": string,
    "uid_organization": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/organizations/:uid/services/:uid`
- **Ex. collection:** SVC-0186-06A — Ativar Geocode usando o UID do serviço
- **Request body:**
```json
{
  "desired_status": "active"
}
```

### `PUT /v1/admin/organizations/:uid/services/geocode`
- **Ex. collection:** GEO-PROV-31 — Suspender o serviço Geocode
- **Request body:**
```json
{
  "desired_status": "suspended"
}
```

### `GET /v1/admin/organizations/:uid/services/geocode/tokens`
- **Ex. collection:** GEO-PROV-34 — Confirmar que o token continua ativo no Core
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "name": string,
    "active": bool,
    "version": int,
    "created_at": string,
    "revoked_at": string,
    "token_hint": string,
    "last_used_at": null,
    "rate_limit_rps": int,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/organizations/:uid/services/geocode/tokens`
- **Ex. collection:** GEO-PROV-25 — Criar novo token ativo e provocar version 9
- **Request body:**
```json
{
  "name": "geocode-homolog",
  "rate_limit_rps": 25
}
```

### `PATCH /v1/admin/organizations/:uid/services/geocode/tokens/:uid`
- **Ex. collection:** GEO-PROV-28 — Alterar rate limit do token
- **Request body:**
```json
{
  "rate_limit_rps": 50
}
```

### `DELETE /v1/admin/organizations/:uid/services/geocode/tokens/:uid`
- **Ex. collection:** GEO-PROV-38 — Revogar o token ativo

### `GET /v1/admin/organizations/:uid/session-policy`
- **Ex. collection:** SR08 — allow_concurrent_sessions=false
- **Response (schema real):**
```jsonc
{
  "uid_organization": string,
  "allow_concurrent_sessions": bool,
  "require_mfa": bool,
  "revoked_sessions": [[]],
  "revoked_count": int,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/organizations/:uid/session-policy`
- **Ex. collection:** T4-R — restaurar sessões concorrentes
- **Request body:**
```json
{
  "allow_concurrent_sessions": true
}
```

### `GET /v1/admin/organizations/abc/services`
- **Ex. collection:** SVC-0186-25 — UID de organização malformado
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `POST /v1/admin/organizations/search`
- **Ex. collection:** 01 - Search 2
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    }
  ]
}
```


---

## admin/billing

### `GET /v1/admin/billing/accounts`
- **Ex. collection:** HTTP-B02 — Consultar contas de faturamento
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `GET /v1/admin/billing/entries`
- **Query:** `uid_billing_account`
- **Ex. collection:** B201-16 — Consultar lançamentos financeiros pela Power
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "status": string,
    "currency": string,
    "due_date": string,
    "quantity": null,
    "competence": string,
    "created_at": string,
    "updated_at": string,
    "description": string,
    "reference_to": string,
    "service_code": string,
    "billing_basis": string,
    "reference_from": string,
    "proration_policy": string,
    "uid_organization": string,
    "unit_price_cents": int,
    "uid_billing_account": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/billing/entries`
- **Ex. collection:** B201-18 — Criar lançamento financeiro da Automega
- **Request body:**
```json
{
  "uid_billing_account": "6f0db72e-826f-44a9-8189-5cf937e7e161",
  "uid_organization": "b5c64f64-b8dc-418b-8893-d6dd3635df5b",
  "service_code": "gateway",
  "description": "HOMOLOGACAO 0201 - Gateway Automega Power",
  "competence": "2026-10",
  "reference_from": "2026-10-01",
  "reference_to": "2026-11-01",
  "due_date": "2026-11-10",
  "quantity": 1,
  "unit_price_cents": 1000,
  "currency": "BRL",
  "billing_basis": "monthly_unique_usage",
  "proration_policy": "none"
}
```

### `GET /v1/admin/billing/entries/:uid`
- **Ex. collection:** B201-19 — Power consultando o lançamento da Automega
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "status": string,
  "currency": string,
  "due_date": string,
  "quantity": float,
  "competence": string,
  "created_at": string,
  "updated_at": string,
  "description": string,
  "reference_to": string,
  "service_code": string,
  "uid_currency": string,
  "billing_basis": string,
  "uid_statement": null,
  "reference_from": string,
  "proration_policy": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "unit_price_cents": int,
  "uid_billing_account": string,
  "calculation_snapshot": {
    "amount_cents": int,
    "billable_days": int,
    "days_in_period": int,
    "proration_policy": string,
    "gross_monthly_cents": int,
  },
  "uid_commercial_order": null,
  "uid_billing_agreement": null,
  "elapsed_ms": float,
}
```

### `PATCH /v1/admin/billing/entries/:uid`
- **Ex. collection:** B201-20 — Power tentando alterar o lançamento da Automega
- **Request body:**
```json
{
  "quantity": 2
}
```

### `POST /v1/admin/billing/entries/:uid/duplicate`
- **Ex. collection:** HTTP-B04 — Duplicar lançamento para seis meses
- **Request body:**
```json
{
  "count": 6,
  "first_competence": "2026-11",
  "due_day": 10,
  "copy_quantity": false
}
```

### `POST /v1/admin/billing/entries/search`
- **Ex. collection:** B201-24 — Listagem financeira com filtro estruturado
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_billing_account",
      "operator": "eq",
      "value": "6f0db72e-826f-44a9-8189-5cf937e7e161"
    }
  ],
  "limit": 100,
  "offset": 0
}
```

### `GET /v1/admin/billing/statements`
- **Query:** `uid_billing_account`
- **Ex. collection:** B201-15 — Consultar o demonstrativo consolidado da Power
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "state": string,
    "currency": string,
    "closed_at": string,
    "competence": string,
    "entry_count": int,
    "total_cents": int,
    "uid_billing_account": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/billing/statements`
- **Ex. collection:** HTTP-B08 — Fechar faturamento de novembro/2026
- **Request body:**
```json
{
  "uid_billing_account": "6ed6d071-48bc-4689-95eb-38283d4dd393",
  "competence": "2026-11"
}
```

### `GET /v1/admin/billing/statements/:uid`
- **Ex. collection:** B201-15B — Testar acesso direto ao demonstrativo da Autoscale
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "items": [{
    "due_date": string,
    "quantity": float,
    "uid_entry": string,
    "competence": string,
    "calculation": {
      "amount_cents": int,
      "billable_days": int,
      "days_in_period": int,
      "proration_policy": string,
      "gross_monthly_cents": int,
    },
    "description": string,
    "amount_cents": int,
    "reference_to": string,
    "service_code": string,
    "uid_currency": string,
    "billing_basis": string,
    "reference_from": string,
    "proration_policy": string,
    "uid_organization": string,
    "unit_price_cents": int,
  }],
  "state": string,
  "currency": string,
  "snapshot": {
    "competence": string,
    "entry_count": int,
    "total_cents": int,
    "uid_currency": string,
    "uid_billing_account": string,
  },
  "closed_at": string,
  "competence": string,
  "entry_count": int,
  "total_cents": int,
  "uid_currency": string,
  "uid_user_closed": string,
  "uid_billing_account": string,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/billing/statements/search`
- **Ex. collection:** B201-28 — Validar filtro estruturado de demonstrativos
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_billing_account",
      "operator": "eq",
      "value": "6ed6d071-48bc-4689-95eb-38283d4dd393"
    }
  ],
  "limit": 100,
  "offset": 0
}
```


---

## admin/knowledge

### `GET /v1/admin/knowledge/items/:uid`
- **Ex. collection:** K2D-11 — Consultar um artigo existente
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "slug": string,
  "grants": [[]],
  "contexts": [[]],
  "categories": [[]],
  "created_at": string,
  "updated_at": string,
  "attachments": [{
    "created_at": string,
    "uid_document": string,
    "uid_user_created": string,
    "uid_document_revision": string,
    "uid_knowledge_revision": string,
  }],
  "published_at": string,
  "audience_mode": string,
  "latest_revision": {
    "uid": string,
    "body": string,
    "title": string,
    "videos": [{
      "url": string,
      "title": string,
      "sort_order": int,
      "description": string,
      "youtube_video_id": string,
    }],
    "summary": string,
    "uid_item": string,
    "created_at": string,
    "search_vector": string,
    "revision_number": int,
    "uid_user_created": string,
  },
  "uid_user_created": string,
  "uid_user_updated": string,
  "publication_status": string,
  "published_revision": {
    "uid": string,
    "body": string,
    "title": string,
    "videos": [{
      "url": string,
      "title": string,
      "sort_order": int,
      "description": string,
      "youtube_video_id": string,
    }],
    "summary": string,
    "uid_item": string,
    "created_at": string,
    "search_vector": string,
    "revision_number": int,
    "uid_user_created": string,
  },
  "published_revision_uid": string,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/knowledge/items/:uid/archive`
- **Ex. collection:** K2C10 — Archive/despublicação

### `PUT /v1/admin/knowledge/items/:uid/grants`
- **Ex. collection:** K2C09A — Dar grant efetivo ao Primary
- **Request body:**
```json
{
  "grants": [
    {
      "principal_type": "profile",
      "profile_code": "primary_admin",
      "scope_type": "global"
    }
  ]
}
```

### `POST /v1/admin/knowledge/items/:uid/publish`
- **Ex. collection:** K2D-13 — Publicar a revisão com vídeos
- **Request body:**
```json
{
  "uid_revision": "c267125a-0671-431c-93ea-eea408443a9f",
  "audience_mode": "selected"
}
```

### `GET /v1/admin/knowledge/items/:uid/revisions`
- **Ex. collection:** Próximo teste — K2D-17: verificar listagem sem vídeos
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "body": string,
    "title": string,
    "summary": string,
    "uid_item": string,
    "created_at": string,
    "search_vector": string,
    "revision_number": int,
    "uid_user_created": string,
  }],
  "total": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/knowledge/items/:uid/revisions`
- **Ex. collection:** K2D-07 — Criar revisão com dois vídeos
- **Request body:**
```json
{
  "title": "Instalação e retirada de câmera veicular",
  "summary": "Procedimentos técnicos para instalação e retirada.",
  "body": "Este artigo apresenta os procedimentos de instalação, retirada e verificação de câmeras veiculares.",
  "videos": [
    {
      "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      "title": "Vídeo de homologação 1",
      "description": "Teste do formato watch.",
      "sort_order": 1
    },
    {
      "url": "https://youtu.be/9bZkp7q19f0",
      "title": "Vídeo de homologação 2",
      "description": "Teste do formato curto.",
      "sort_order": 2
    }
  ]
}
```

### `GET /v1/admin/knowledge/revisions/:uid`
- **Ex. collection:** K2C01B — Conferir a revisão e o attachment fixo
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "body": string,
  "title": string,
  "videos": [[]],
  "summary": string,
  "uid_item": string,
  "created_at": string,
  "attachments": [{
    "uid_document": string,
    "uid_document_revision": string,
  }],
  "search_vector": string,
  "revision_number": int,
  "uid_user_created": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/knowledge/revisions/:uid/attachments`
- **Ex. collection:** K2C01 — Vincular o attachment GED à revisão Knowledge draft
- **Request body:**
```json
{
  "attachments": [
    {
      "uid_document": "66d002de-53fd-4a29-9c18-efadc8f22036",
      "uid_document_revision": "13b7ab37-57cc-5671-9c56-081065a8cb78"
    }
  ]
}
```


---

## knowledge/items

### `GET /v1/knowledge/items/:slug`
- **Query:** `uid_organization`
- **Ex. collection:** K2D-15 — Leitura consumer autenticada
- **Response (schema real):**
```jsonc
{
  "body": string,
  "slug": string,
  "title": string,
  "videos": [{
    "url": string,
    "title": string,
    "sort_order": int,
    "description": string,
    "youtube_video_id": string,
  }],
  "summary": string,
  "contexts": [[]],
  "categories": [[]],
  "attachments": [[]],
  "published_at": string,
  "revision_number": int,
  "elapsed_ms": float,
}
```

### `GET /v1/knowledge/items/:slug/attachments/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** K2C07 — Download authenticated autorizado
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## public/knowledge

### `GET /v1/public/knowledge/items/:slug`
- **Ex. collection:** K2D-16 — Verificar proteção da rota pública
- **Response (schema real):**
```jsonc
{
  "body": string,
  "slug": string,
  "title": string,
  "videos": [[]],
  "summary": string,
  "contexts": [[]],
  "categories": [[]],
  "attachments": [{
    "uid": string,
    "download_url": string,
  }],
  "published_at": string,
  "revision_number": int,
  "elapsed_ms": float,
}
```

### `GET /v1/public/knowledge/items/:slug/attachments/:uid`
- **Ex. collection:** K2C04 — Download público do attachment
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## commercial/overview

### `GET /v1/commercial/overview`
- **Query:** `uid_organization`
- **Ex. collection:** HTTP-B01 — Criar lançamento manual
- **Response (schema real):**
```jsonc
{
  "offers": [{
    "terms": [[]],
    "services": [{
      "code": string,
      "default_enabled": bool,
    }],
    "plan_code": string,
    "plan_name": string,
    "billing_mode": string,
    "uid_plan_version": string,
  }],
  "billing_account": {
    "uid": string,
    "payer_kind": string,
    "external_legal_name": null,
    "external_country_code": null,
    "external_tax_identifier_type": null,
  },
  "uid_organization": string,
  "elapsed_ms": float,
}
```


---

## commercial/orders

### `POST /v1/commercial/orders`
- **Ex. collection:** COM-0188-06 — Criar primeira Commercial Order postpaid
- **Request body:**
```json
{
  "uid_organization": "a0000000-0000-4000-8000-000000000001",
  "uid_plan_version": "935e0e0a-e52a-407c-b377-3b192036d711"
}
```

### `POST /v1/commercial/orders/:uid/transition`
- **Ex. collection:** COM-0188-08 — Aceitar Order postpaid
- **Request body:**
```json
{
  "action": "accept",
  "expected_state_version": 1
}
```


---

## admin/billing-plans

### `GET /v1/admin/billing-plans`
- **Query:** `q`
- **Ex. collection:** PC02 — Listar billing plans para pegar o UID do plano
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "tiers": [{
      "uid": string,
      "quantity_to": null,
      "quantity_from": int,
      "uid_billing_plan": string,
      "unit_price_cents": int,
    }],
    "active": bool,
    "currency": string,
    "created_at": string,
    "unit_label": string,
    "updated_at": string,
    "description": string,
    "billing_mode": string,
    "uid_user_created": string,
    "uid_user_updated": string,
    "negative_adjustment_policy": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/billing-plans`
- **Ex. collection:** PB57 — Criar plano dedicado de homologação
- **Request body:**
```json
{
  "code": "homologacao_progressivo",
  "name": "Homologação progressiva",
  "description": "Plano descartável do roteiro de testes",
  "billing_mode": "postpaid",
  "unit_label": "ativo",
  "active": true,
  "tiers": [
    {
      "quantity_from": 1,
      "quantity_to": 10,
      "unit_price_cents": 1000
    },
    {
      "quantity_from": 11,
      "quantity_to": 30,
      "unit_price_cents": 800
    },
    {
      "quantity_from": 31,
      "quantity_to": 50,
      "unit_price_cents": 700
    }
  ]
}
```

### `GET /v1/admin/billing-plans/:uid`
- **Ex. collection:** COM-0188-09 — Conferir estado atual do demo_postpaid
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "name": string,
  "tiers": [{
    "uid": string,
    "quantity_to": int,
    "quantity_from": int,
    "uid_billing_plan": string,
    "unit_price_cents": int,
  }],
  "active": bool,
  "currency": string,
  "created_at": string,
  "unit_label": string,
  "updated_at": string,
  "description": string,
  "billing_mode": string,
  "uid_user_created": null,
  "uid_user_updated": string,
  "uid_current_version": string,
  "negative_adjustment_policy": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/billing-plans/:uid`
- **Ex. collection:** COM-0188-10 — Definir floor_at_zero no demo_postpaid
- **Request body:**
```json
{
  "code": "demo_postpaid",
  "name": "DEMO pós-pago",
  "description": "Dados fictícios para homologação",
  "billing_mode": "postpaid",
  "unit_label": "unidade",
  "active": true,
  "negative_adjustment_policy": "floor_at_zero",
  "tiers": [
    {
      "quantity_from": 1,
      "quantity_to": 10,
      "unit_price_cents": 1000
    },
    {
      "quantity_from": 11,
      "quantity_to": 30,
      "unit_price_cents": 800
    },
    {
      "quantity_from": 31,
      "quantity_to": 50,
      "unit_price_cents": 700
    }
  ]
}
```

### `DELETE /v1/admin/billing-plans/:uid`
- **Ex. collection:** 01 - Delete

### `GET /v1/admin/billing-plans/:uid/capabilities`
- **Ex. collection:** PC03 — Consultar capabilities do billing plan
- **Response (schema real):**
```jsonc
{
  "capabilities": [[]],
  "uid_billing_plan": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/billing-plans/:uid/capabilities`
- **Ex. collection:** PC04 — Atribuir capabilities ao billing plan
- **Request body:**
```json
{
  "capabilities": [
    "products",
    "procurement"
  ]
}
```

### `GET /v1/admin/billing-plans/:uid/quote`
- **Query:** `quantity`
- **Ex. collection:** PB38 — Quote de 50 unidades
- **Response (schema real):**
```jsonc
{
  "currency": string,
  "quantity": int,
  "simulation": bool,
  "total_cents": int,
  "billing_mode": string,
  "uid_billing_plan": string,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/billing-plans/not-a-uuid/capabilities`
- **Ex. collection:** PB15 — UUID inválido no endpoint de capabilities
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `PUT /v1/admin/billing-plans/not-a-uuid/capabilities`
- **Ex. collection:** PB24 — PUT com UUID de plano inválido
- **Request body:**
```json
{
  "capabilities": []
}
```

### `GET /v1/admin/billing-plans/not-a-uuid/quote`
- **Query:** `quantity`
- **Ex. collection:** PB51 — UUID do plano malformado
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## admin/services

### `GET /v1/admin/services`
- **Ex. collection:** SVC-0186-04 — Listar catálogo de Services
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "active": bool,
    "created_at": string,
    "updated_at": string,
    "description": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```


---

## admin/notifications

### `GET /v1/admin/notifications/deliveries/:uid/status`
- **Query:** `uid_organization`
- **Ex. collection:** NC07Y — consultar a delivery pela API
- **Response (schema real):**
```jsonc
{
  "action_index": int,
  "attempts": int,
  "claim_token": null,
  "created_at": string,
  "destination_snapshot": [string],
  "hook_version": int,
  "http_status": int,
  "lease_until": null,
  "next_attempt_at": string,
  "notify_response_code": string,
  "notify_status": null,
  "notify_status_checked_at": null,
  "notify_status_snapshot": null,
  "notify_uid": null,
  "payload_snapshot": {
    "message": string,
    "service": string,
    "subject": string,
    "to": [string],
  },
  "recipient_name_snapshot": [[]],
  "responded_at": string,
  "send_authorized_at": null,
  "service": string,
  "status": string,
  "submitted_at": null,
  "suppressed_at": null,
  "suppression_reason": null,
  "uid": string,
  "uid_intent": string,
  "uid_organization": string,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/notifications/hooks`
- **Query:** `uid_organization`
- **Ex. collection:** NC05 — listar hooks do Notifications Core
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "scope": string,
    "active": bool,
    "payload": {
      "to": [string],
      "message": string,
      "service": string,
      "subject": string,
    },
    "version": int,
    "created_at": string,
    "updated_at": string,
    "uid_organization": null,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/notifications/hooks/organizations.insert`
- **Query:** `uid_organization`
- **Ex. collection:** NC12A — consultar o hook efetivo da organização
- **Response (schema real):**
```jsonc
{
  "code": string,
  "scope": string,
  "active": bool,
  "payload": {
    "to": [string],
    "message": string,
    "service": string,
    "subject": string,
  },
  "version": int,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/notifications/hooks/organizations.insert`
- **Query:** `uid_organization`
- **Ex. collection:** NC06 — criar hook default organizations.insert
- **Request body:**
```json
{
  "active": true,
  "payload": {
    "service": "email",
    "to": "wesleylacerda@gmail.ocm",
    "subject": "Organização Autoscale criada",
    "message": "Código 1426000001"
  }
}
```

### `GET /v1/admin/notifications/recipients`
- **Query:** `uid_organization`
- **Ex. collection:** FB05 — Sanitização de erro no Notifications Core
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_

### `POST /v1/admin/notifications/recipients`
- **Query:** `uid_organization`
- **Ex. collection:** FB05-R1 — Forçar erro interno de validação no Notifications Core
- **Request body:**
```json
{
  "kind": "external",
  "name": "FB05 Sanitização",
  "active": true,
  "endpoints": [
    {
      "service": "email",
      "destination": "fb05@example.test",
      "active": true
    }
  ],
  "organization_bindings": [
    {
      "uid_organization": "VALOR_SECRETO_SENTINELA_123"
    }
  ],
  "entity_bindings": [],
  "asset_bindings": []
}
```

### `GET /v1/admin/notifications/recipients/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** NC11D — tentar ler o recipient pelo tenant errado
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "kind": string,
  "name": string,
  "active": bool,
  "uid_link": null,
  "endpoints": [{
    "uid": string,
    "active": bool,
    "service": string,
    "metadata": {},
    "destination": string,
    "uid_contact_method": null,
  }],
  "link_code": null,
  "created_at": string,
  "updated_at": string,
  "uid_contact": null,
  "asset_bindings": [[]],
  "entity_bindings": [[]],
  "uid_organization": string,
  "organization_bindings": [{
    "uid_organization": string,
  }],
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/notifications/recipients/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** NC11F — atualizar o recipient
- **Request body:**
```json
{
  "kind": "external",
  "name": "Responsável Homologação Notify Atualizado",
  "active": true,
  "endpoints": [
    {
      "service": "email",
      "destination": "responsavel.notify0177@example.test",
      "active": true
    }
  ],
  "organization_bindings": [
    {
      "uid_organization": "e09d3738-513d-4877-8f18-7cdb42166df6"
    }
  ],
  "entity_bindings": [],
  "asset_bindings": []
}
```

### `DELETE /v1/admin/notifications/recipients/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** NC11G — desativar o recipient


---

## admin/settings

### `POST /v1/admin/settings/filters/reload`
- **Ex. collection:** FB09 — Reload inválido não pode vazar detalhe interno


---

## admin/agenda

### `GET /v1/admin/agenda/entries/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** AG06 — GET individual da entry
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "title": string,
  "due_at": null,
  "pinned": bool,
  "summary": null,
  "notified": bool,
  "priority": string,
  "terminal": bool,
  "uid_asset": string,
  "created_at": string,
  "source_uid": string,
  "uid_device": null,
  "updated_at": string,
  "notified_at": string,
  "occurred_at": string,
  "source_state": string,
  "scheduled_end": null,
  "snoozed_until": null,
  "source_domain": string,
  "next_contact_at": null,
  "scheduled_start": null,
  "source_resource": string,
  "controls_version": int,
  "uid_organization": string,
  "source_created_at": string,
  "source_updated_at": string,
  "attention_required": bool,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/agenda/entries/:uid/analyses`
- **Query:** `limit, offset, uid_organization`
- **Ex. collection:** AG19 — listar histórico da entry
- **Response (schema real):**
```jsonc
{
  "items": [[]],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/agenda/entries/:uid/analyses`
- **Query:** `uid_organization`
- **Ex. collection:** AG23 — criar análise manual
- **Request body:**
```json
{
  "description": "Liguei para o cliente e não obtive retorno."
}
```

### `PATCH /v1/admin/agenda/entries/:uid/controls`
- **Query:** `uid_organization`
- **Ex. collection:** AG07 — alterar somente os controles da Agenda
- **Request body:**
```json
{
  "controls_version": 1,
  "priority": "high",
  "pinned": true,
  "notified": true
}
```

### `POST /v1/admin/agenda/entries/search`
- **Ex. collection:** AG04 — localizar na Agenda a OS originada pelo Checklist
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    },
    {
      "field": "source_uid",
      "operator": "eq",
      "value": "221f12d9-7870-46e6-94ba-c14be52e68e9"
    }
  ]
}
```

### `GET /v1/admin/agenda/settings`
- **Query:** `uid_organization`
- **Ex. collection:** AG09 — consultar cores efetivas da Agenda
- **Response (schema real):**
```jsonc
{
  "colors": {
    "states": {
      "maintenance.open": string,
      "maintenance.cancelled": string,
      "maintenance.completed": string,
      "maintenance.in_progress": string,
    },
    "controls": {
      "pinned": string,
      "overdue": string,
      "snoozed": string,
      "notified": string,
      "attention_required": string,
    },
    "priorities": {
      "low": string,
      "high": string,
      "normal": string,
      "critical": string,
    },
  },
  "overrides": {
    "states": {},
    "controls": {},
    "priorities": {},
  },
  "uid_organization": string,
  "elapsed_ms": float,
}
```

### `PATCH /v1/admin/agenda/settings`
- **Query:** `uid_organization`
- **Ex. collection:** AG10 — criar override de cor na organização
- **Request body:**
```json
{
  "colors": {
    "states": {
      "maintenance.open": "#112233"
    }
  }
}
```


---

## admin/maintenance

### `GET /v1/admin/maintenance/assets/:uid/status`
- **Query:** `uid_organization`
- **Ex. collection:** MT08 — consultar status operacional do asset
- **Response (schema real):**
```jsonc
{
  "uid_asset": string,
  "open_conditions": [{
    "uid": string,
    "blocking": bool,
    "opened_at": string,
    "description": string,
    "uid_work_order": string,
  }],
  "uid_organization": string,
  "operational_available": bool,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/maintenance/orders`
- **Ex. collection:** AG20B — criar Maintenance ativa para a Agenda Fase 2
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_asset": "bc8d08ba-9b30-42f5-9faf-ac94dbb69769",
  "description": "Homologação Agenda Fase 2",
  "items": [
    {
      "description": "Validar timeline e controles da Agenda"
    }
  ]
}
```

### `GET /v1/admin/maintenance/orders/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** AG15A — conferir a Maintenance com o MESMO secondaryToken
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "items": [[]],
  "status": string,
  "uid_asset": string,
  "conditions": [{
    "uid": string,
    "status": string,
    "blocking": bool,
    "opened_at": string,
    "uid_asset": string,
    "created_at": string,
    "updated_at": string,
    "description": string,
    "resolved_at": string,
    "uid_work_order": string,
    "uid_organization": string,
    "uid_user_created": string,
    "uid_user_updated": string,
    "uid_checklist_run": string,
    "source_question_code": string,
    "uid_checklist_execution": string,
  }],
  "created_at": string,
  "updated_at": string,
  "description": string,
  "origin_kind": string,
  "cancelled_at": null,
  "completed_at": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "uid_checklist_run": string,
  "asset_identification": string,
  "elapsed_ms": float,
}
```

### `PATCH /v1/admin/maintenance/orders/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** MT09 — PATCH agregado: atualizar item + adicionar item + condição não bloqueante
- **Request body:**
```json
{
  "items": [
    {
      "uid": "4379651c-8861-4e76-800d-3cadd5efc7bd",
      "description": "Inspecionar equipamento e conexões",
      "notes": "Item atualizado durante a homologação"
    },
    {
      "description": "Verificar fixação do equipamento",
      "notes": "Novo item da OS"
    }
  ],
  "conditions": [
    {
      "description": "Ruído observado sem impacto operacional",
      "blocking": false
    }
  ]
}
```

### `POST /v1/admin/maintenance/orders/:uid/transition`
- **Query:** `uid_organization`
- **Ex. collection:** AG12 — concluir a Maintenance e deixar a Agenda sincronizar
- **Request body:**
```json
{
  "status": "completed",
  "resolve_conditions": [
    "27c9e647-76e2-4fc0-a8b5-fa05f034426d"
  ]
}
```

### `POST /v1/admin/maintenance/orders/search`
- **Ex. collection:** MI08 — localizar a OS criada automaticamente
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    },
    {
      "field": "uid_checklist_run",
      "operator": "eq",
      "value": "3799aad3-1bbd-4756-a61c-8305258be89f"
    }
  ]
}
```


---

## admin/documents

### `POST /v1/admin/documents`
- **Ex. collection:** K2C19B — Criar documento GED da organização cliente
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_contract": "9060dcdf-1595-40db-932a-8445f34eeff4",
  "origin_code": "I",
  "area_code": "TEC",
  "type_code": "IM",
  "title": "Knowledge 2C - Documento Cliente",
  "metadata": {}
}
```

### `GET /v1/admin/documents/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** K2C18A — Consultar documento GED atual
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "title": string,
  "active": bool,
  "target": null,
  "metadata": {},
  "area_code": string,
  "revisions": [{
    "uid": string,
    "sha256": string,
    "extension": string,
    "mime_type": string,
    "created_at": string,
    "size_bytes": int,
    "uid_document": string,
    "revision_code": string,
    "change_summary": null,
    "revision_number": int,
    "uid_organization": string,
    "uid_user_created": string,
    "original_filename": string,
  }],
  "type_code": string,
  "uid_class": null,
  "class_name": null,
  "created_at": string,
  "updated_at": string,
  "origin_code": string,
  "tenant_code": string,
  "distribution": null,
  "uid_contract": string,
  "access_source": string,
  "contract_code": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "document_sequence": int,
  "permission_source": string,
  "organization_sequence": int,
  "uid_organization_context": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/documents/:uid/class`
- **Query:** `uid_organization`
- **Ex. collection:** G06 — Associar a classe Financeiro ao documento
- **Request body:**
```json
{
  "uid_class": "d98dbd66-bdbd-4b9f-a908-0cace3b97c25"
}
```

### `POST /v1/admin/documents/:uid/distributions`
- **Query:** `uid_organization`
- **Ex. collection:** G04 — distribuir para a organização cliente com follow_latest
- **Request body:**
```json
{
  "uid_recipient_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "access_mode": "read",
  "revision_policy": "follow_latest"
}
```

### `GET /v1/admin/documents/:uid/revisions`
- **Query:** `uid_organization`
- **Ex. collection:** AG33A — consultar a revisão fixa do documento
- **Response (schema real):**
```jsonc
[{
  "uid": string,
  "sha256": string,
  "extension": string,
  "mime_type": string,
  "created_at": string,
  "size_bytes": int,
  "uid_document": string,
  "revision_code": string,
  "change_summary": null,
  "revision_number": int,
  "uid_organization": string,
  "uid_user_created": string,
  "original_filename": string,
}]
```

### `POST /v1/admin/documents/:uid/revisions`
- **Query:** `uid_organization`
- **Ex. collection:** K2C19C — Criar R00 GED do documento cliente

### `GET /v1/admin/documents/catalogs`
- **Ex. collection:** C29 — consultar catálogos do GED
- **Response (schema real):**
```jsonc
{
  "areas": [{
    "code": string,
    "name": string,
    "active": bool,
  }],
  "types": [{
    "code": string,
    "name": string,
    "active": bool,
  }],
  "origins": [{
    "code": string,
    "name": string,
    "active": bool,
  }],
  "elapsed_ms": float,
}
```

### `POST /v1/admin/documents/search`
- **Ex. collection:** AG33 — localizar um documento GED utilizável
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    }
  ],
  "limit": 10,
  "offset": 0
}
```


---

## checklists/runs

### `POST /v1/checklists/runs`
- **Ex. collection:** MI04 — criar um novo Checklist Run para a integração
- **Request body:**
```json
{
  "uid_driver": "e96dcfa8-6c71-4852-b4bb-14cee1b8bd3d"
}
```

### `GET /v1/checklists/runs/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** CK38 — GET do Run e confirmação dos snapshots fixados
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "status": string,
  "outcome": string,
  "complete": bool,
  "uid_asset": string,
  "created_at": string,
  "executions": [{
    "uid": string,
    "answers": [[]],
    "checklist": {
      "code": string,
      "name": string,
      "group": {
        "uid": string,
        "code": string,
        "name": string,
      },
      "active": bool,
      "uid_group": string,
      "definition": {
        "questions": [{
          "code": ...,
          "type": ...,
          "label": ...,
          "required": ...,
        }],
      },
      "description": null,
      "uid_template": string,
      "applicability": string,
      "uid_organization": string,
    },
    "target_type": string,
    "version_number": int,
    "uid_template_version": string,
  }],
  "uid_driver": string,
  "updated_at": string,
  "asset_result": string,
  "completed_at": string,
  "driver_result": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/checklists/runs/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** MI05 — selecionar o asset
- **Request body:**
```json
{
  "uid_asset": "bc8d08ba-9b30-42f5-9faf-ac94dbb69769"
}
```


---

## admin/checklist-groups

### `POST /v1/admin/checklist-groups`
- **Ex. collection:** CK03 — subir API e criar o primeiro grupo
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "code": "homolog_group",
  "name": "Checklist homologation"
}
```

### `GET /v1/admin/checklist-groups/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** CK25 — GET individual do grupo
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "name": string,
  "active": bool,
  "created_at": string,
  "updated_at": string,
  "description": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `PATCH /v1/admin/checklist-groups/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** CK24 — PATCH do grupo
- **Request body:**
```json
{
  "description": "Grupo de checklists utilizado na homologação da Fase 1"
}
```

### `POST /v1/admin/checklist-groups/search`
- **Ex. collection:** CK26 — pesquisar grupos da organização
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    }
  ],
  "limit": 100,
  "offset": 0
}
```


---

## admin/checklists

### `POST /v1/admin/checklists`
- **Ex. collection:** CK05 — criar o primeiro checklist agregado
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_group": "929ec7fa-fd42-40a7-b518-f49d333e6929",
  "code": "pre_use_asset",
  "name": "Inspeção antes do uso",
  "applicability": "asset",
  "assignment": {
    "mode": "all"
  },
  "definition": {
    "questions": [
      {
        "code": "tires_worn",
        "label": "Os pneus estão carecas?",
        "type": "boolean",
        "required": true,
        "effect": "asset_not_fit"
      },
      {
        "code": "fuel_ok",
        "label": "O tanque está em nível adequado?",
        "type": "boolean",
        "required": true,
        "effect": "warning"
      }
    ]
  }
}
```

### `GET /v1/admin/checklists/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** CK16 — GET do checklist agregado atual
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "name": string,
  "active": bool,
  "uid_group": string,
  "assignment": {
    "mode": string,
  },
  "created_at": string,
  "definition": {
    "questions": [{
      "code": string,
      "type": string,
      "label": string,
      "effect": string,
      "required": bool,
    }],
  },
  "updated_at": string,
  "description": string,
  "published_at": string,
  "applicability": string,
  "latest_version": int,
  "assignment_mode": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `PATCH /v1/admin/checklists/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** CK08 — alterar o agregado depois da publicação
- **Request body:**
```json
{
  "uid_group": "929ec7fa-fd42-40a7-b518-f49d333e6929",
  "code": "pre_use_asset",
  "name": "Inspeção antes do uso",
  "description": "Checklist pré-operacional do ativo",
  "active": true,
  "applicability": "asset",
  "assignment": {
    "mode": "all"
  },
  "definition": {
    "questions": [
      {
        "code": "tires_worn",
        "label": "Os pneus estão carecas?",
        "type": "boolean",
        "required": true,
        "effect": "asset_not_fit"
      },
      {
        "code": "fuel_ok",
        "label": "O tanque está em nível adequado?",
        "type": "boolean",
        "required": true,
        "effect": "warning"
      },
      {
        "code": "notes",
        "label": "Observações da inspeção",
        "type": "text",
        "required": false
      }
    ]
  }
}
```

### `POST /v1/admin/checklists/:uid/publish`
- **Query:** `uid_organization`
- **Ex. collection:** CK06 — publicar a primeira versão

### `POST /v1/admin/checklists/search`
- **Ex. collection:** CK21 — pesquisar checklists da organização
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    }
  ],
  "limit": 100,
  "offset": 0
}
```


---

## health/details

### `GET /v1/health/details`
- **Ex. collection:** EV11-E — conferir métricas do eventstream
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## users/profile

### `GET /v1/users/profile`
- **Ex. collection:** T4-D — testar tokenA
- **Response (schema real):**
```jsonc
{
  "bio": string,
  "uid": string,
  "city": string,
  "theme": string,
  "locale": string,
  "website": string,
  "headline": string,
  "uid_user": string,
  "interests": [[]],
  "job_title": string,
  "created_at": string,
  "updated_at": string,
  "accent_color": string,
  "display_name": string,
  "uid_image_cover": null,
  "uid_image_avatar": null,
  "uid_organization": string,
  "uid_user_created": null,
  "uid_user_updated": null,
  "elapsed_ms": float,
}
```


---

## health/ready

### `GET /v1/health/ready`
- **Ex. collection:** EV09-F — readiness com Redpanda indisponível
- **Response (schema real):**
```jsonc
{
  "server_name": string,
  "status": string,
  "uptime_seconds": int,
  "elapsed_ms": float,
}
```


---

## metrics

### `GET /metrics`
- **Ex. collection:** EV06 — acessar /metrics sem credencial técnica
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## admin/platform-capabilities

### `GET /v1/admin/platform-capabilities`
- **Ex. collection:** PC01 — Consultar catálogo global de capabilities
- **Response (schema real):**
```jsonc
{
  "items": [{
    "code": string,
    "name": string,
    "active": bool,
    "created_at": string,
    "updated_at": string,
    "description": string,
    "uid_user_created": null,
    "uid_user_updated": null,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/platform-capabilities/search`
- **Ex. collection:** PB27 — Search de platform capabilities / happy path
- **Request body:**
```json
{
  "q": "products",
  "limit": 25,
  "offset": 0
}
```


---

## admin/collaborators

### `POST /v1/admin/collaborators`
- **Ex. collection:** C1-01 — Criar colaborador exclusivo para os testes de Engagement
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "legal_name": "Colaborador Engagement Homologacao",
  "preferred_name": "Colaborador C1",
  "birth_date": "1990-05-20",
  "active": true
}
```

### `GET /v1/admin/collaborators/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** C06 — Buscar colaborador por UID
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "active": bool,
  "birth_date": null,
  "created_at": string,
  "legal_name": string,
  "updated_at": string,
  "preferred_name": null,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "uid_birth_country": null,
  "uid_marital_status": null,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/collaborators/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** C05 — PUT completo do colaborador
- **Request body:**
```json
{
  "legal_name": "Maria Helena de Souza",
  "preferred_name": "Helena",
  "birth_date": "1991-04-18",
  "uid_birth_country": "c0580000-0000-4000-8000-000000000001",
  "uid_marital_status": "7812d6d2-cd08-5105-8fd0-2325ede56bc0",
  "active": true
}
```

### `PATCH /v1/admin/collaborators/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** E20 — Desativar o collaborator
- **Request body:**
```json
{
  "active": false
}
```

### `GET /v1/admin/collaborators/:uid/assignments`
- **Query:** `filters`
- **Ex. collection:** S19 — Listar assignments do colaborador
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "ended_on": null,
    "created_at": string,
    "is_primary": bool,
    "started_on": string,
    "updated_at": string,
    "uid_position": string,
    "uid_engagement": string,
    "uid_collaborator": string,
    "uid_organization": string,
    "uid_user_created": string,
    "uid_user_updated": string,
    "uid_organization_unit": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/collaborators/:uid/assignments`
- **Query:** `uid_organization`
- **Ex. collection:** S17 — Criar assignment principal
- **Request body:**
```json
{
  "uid_engagement": "995f425d-2e88-46a4-90bc-9bcdfcf63e30",
  "uid_organization_unit": "3e504bb1-f9f3-4ae0-ab52-88f56b302572",
  "uid_position": "241bf6b9-0884-4e5e-9bc9-afd0381917b6",
  "started_on": "2027-01-01",
  "is_primary": true
}
```

### `GET /v1/admin/collaborators/:uid/assignments/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** S20 — GET individual do assignment
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "ended_on": null,
  "created_at": string,
  "is_primary": bool,
  "started_on": string,
  "updated_at": string,
  "uid_position": string,
  "uid_engagement": string,
  "uid_collaborator": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "uid_organization_unit": string,
  "elapsed_ms": float,
}
```

### `PATCH /v1/admin/collaborators/:uid/assignments/:uid`
- **Query:** `uid_organization`
- **Corpo confirmado para encerramento:**
```json
{
  "ended_on": "2027-02-28"
}
```
- **Retorno:** 200 com os mesmos campos do detalhe. Data civil inválida ou anterior ao início retorna 422 `invalid_collaborator_structure`. Outra data em uma lotação já encerrada retorna 409 `assignment_end_immutable`. Uma organização diferente retorna 404 `collaborator_structure_not_found`.
- **Pendente:** `{"is_primary": true}` e `{"is_primary": false}` receberam 200 e preservaram o valor anterior no retorno e na releitura. O mesmo ocorreu quando o campo acompanhou `ended_on`. No POST de criação, duas lotações principais com vigência sobreposta retornaram 409 `assignment_primary_period_conflict`. [Evidência de 2026-11-25](evidence/phases32-34-http-2026-11-25.json)
- **Ex. collection:** S21 envia o campo proibido `uid_position`.

### `POST /v1/admin/collaborators/:uid/assignments/:uid/managers`
- **Query:** `uid_organization`
- **Ex. collection:** S27 — Impedir assignment de gerenciar a si próprio
- **Request body:**
```json
{
  "uid_manager_assignment": "45840032-e33f-406d-8b60-e562e6c554c6",
  "started_on": "2027-01-01"
}
```

### `GET /v1/admin/collaborators/:uid/assignments/:uid/work-modes`
- **Query:** `filters`
- **Ex. collection:** S28 — Listar histórico de work modes
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "ended_on": null,
    "created_at": string,
    "started_on": string,
    "updated_at": string,
    "uid_work_mode": string,
    "uid_assignment": string,
    "uid_organization": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/collaborators/:uid/assignments/:uid/work-modes`
- **Query:** `uid_organization`
- **Ex. collection:** S23 — Criar período de trabalho presencial
- **Request body:**
```json
{
  "uid_work_mode": "91420000-0000-4000-8000-000000000011",
  "started_on": "2027-01-01"
}
```

### `PATCH /v1/admin/collaborators/:uid/assignments/:uid/work-modes/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** S25 — Encerrar período onsite
- **Request body:**
```json
{
  "ended_on": "2027-03-31"
}
```

### `POST /v1/admin/collaborators/:uid/engagements`
- **Ex. collection:** E02 — Criar engagement principal
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "uid_engagement_type": "91410000-0000-4000-8000-000000000001",
  "uid_country": "c0580000-0000-4000-8000-000000000001",
  "uid_country_subdivision": null,
  "uid_contract_entity": null,
  "started_on": "2026-10-01",
  "ended_on": null,
  "is_primary": true
}
```

### `GET /v1/admin/collaborators/:uid/engagements/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** E22 — Engagement histórico continua legível com collaborator inativo
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "ended_on": string,
  "created_at": string,
  "is_primary": bool,
  "started_on": string,
  "updated_at": string,
  "uid_country": string,
  "uid_collaborator": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "uid_contract_entity": null,
  "uid_engagement_type": string,
  "uid_country_subdivision": null,
  "elapsed_ms": float,
}
```

### `PATCH /v1/admin/collaborators/:uid/engagements/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** E07 — Encerrar o engagement principal atual
- **Request body:**
```json
{
  "ended_on": "2026-12-31"
}
```

### `POST /v1/admin/collaborators/:uid/engagements/search`
- **Ex. collection:** E24 — Listar engagements do collaborator
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    }
  ],
  "limit": 100,
  "offset": 0
}
```

### `GET /v1/admin/collaborators/engagement-types`
- **Ex. collection:** E01 — Consultar tipos de vínculo
- **Response (schema real):**
```jsonc
[{
  "uid": string,
  "code": string,
  "active": bool,
  "created_at": string,
  "updated_at": string,
  "description": null,
  "canonical_name": string,
  "uid_user_created": null,
  "uid_user_updated": null,
}]
```

### `GET /v1/admin/collaborators/organization-unit-types`
- **Ex. collection:** S01 — Consultar tipos de unidade organizacional
- **Response (schema real):**
```jsonc
[{
  "uid": string,
  "code": string,
  "active": bool,
  "canonical_name": string,
}]
```

### `GET /v1/admin/collaborators/organization-units`
- **Query:** `filters`
- **Ex. collection:** S09 — Listar unidades da organização
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "active": bool,
    "created_at": string,
    "uid_parent": string,
    "updated_at": string,
    "uid_unit_type": string,
    "uid_organization": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/collaborators/organization-units`
- **Query:** `uid_organization`
- **Ex. collection:** S03 — Criar unidade organizacional raiz
- **Request body:**
```json
{
  "uid_unit_type": "91420000-0000-4000-8000-000000000001",
  "uid_parent": null,
  "code": "DIR_OPERACIONAL",
  "name": "Diretoria Operacional"
}
```

### `GET /v1/admin/collaborators/organization-units/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** S11 — Consultar unidade filha por UID
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "name": string,
  "active": bool,
  "created_at": string,
  "uid_parent": string,
  "updated_at": string,
  "uid_unit_type": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/collaborators/positions`
- **Query:** `filters`
- **Ex. collection:** S15 — Listar posições da organização
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "active": bool,
    "created_at": string,
    "updated_at": string,
    "description": string,
    "uid_organization": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/collaborators/positions`
- **Query:** `uid_organization`
- **Ex. collection:** S12 — Criar posição
- **Request body:**
```json
{
  "code": "GER_OPERACOES",
  "name": "Gerente de Operações",
  "description": "Responsável pela operação"
}
```

### `GET /v1/admin/collaborators/positions/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** S14 — GET da posição criada
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "name": string,
  "active": bool,
  "created_at": string,
  "updated_at": string,
  "description": string,
  "uid_organization": string,
  "uid_user_created": string,
  "uid_user_updated": string,
  "elapsed_ms": float,
}
```

### `PATCH /v1/admin/collaborators/positions/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** S16 — PATCH da posição
- **Request body:**
```json
{
  "description": "Responsável pela operação e gestão da equipe"
}
```

### `POST /v1/admin/collaborators/search`
- **Ex. collection:** C08 — Search do colaborador na organização
- **Request body:**
```json
{
  "filters": [
    {
      "field": "uid_organization",
      "operator": "eq",
      "value": "adbadcf0-1a3f-4be6-b129-2adf05f565cf"
    },
    {
      "field": "preferred_name",
      "operator": "contains",
      "value": "Helena"
    }
  ],
  "limit": 100,
  "offset": 0
}
```

### `GET /v1/admin/collaborators/work-modes`
- **Ex. collection:** S02 — Consultar modos de trabalho
- **Response (schema real):**
```jsonc
[{
  "uid": string,
  "code": string,
  "active": bool,
  "canonical_name": string,
}]
```


---

## users/security

### `GET /v1/users/security`
- **Ex. collection:** M02 — Consultar configuração MFA do próprio usuário
- **Response (schema real):**
```jsonc
{
  "require_mfa": bool,
  "effective_require_mfa": bool,
  "organization_require_mfa": bool,
  "elapsed_ms": float,
}
```

### `PUT /v1/users/security`
- **Ex. collection:** M03 — Usuário habilita o próprio MFA
- **Request body:**
```json
{
  "require_mfa": true
}
```


---

## users/contact-verification

### `POST /v1/users/contact-verification/confirm`
- **Ex. collection:** M05 — Confirmar verificação do e-mail
- **Request body:**
```json
{
  "channel": "email",
  "challenge_id": "e151ef7b-6daf-4430-96a8-7869c3801318",
  "token": "e3gPe7eSDhBDt0qoPTtP72sunULcdKW5-8J5ymsRsP8",
  "code": ""
}
```

### `POST /v1/users/contact-verification/request`
- **Ex. collection:** M03B — Solicitar verificação do email
- **Request body:**
```json
{
  "channel": "email"
}
```


---

## admin/document-contracts

### `POST /v1/admin/document-contracts`
- **Ex. collection:** K2C19A — Criar contrato GED na organização cliente
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "contract_year": 2026,
  "contract_code": "KNOW-2C-CUSTOMER-01"
}
```


---

## admin/integrations

### `GET /v1/admin/integrations/fipe/jobs`
- **Query:** `limit, offset`
- **Ex. collection:** F09 — Listar jobs FIPE
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "status": string,
    "job_key": string,
    "payload": {
      "fuel_code": int,
      "model_year": int,
      "vehicle_type": string,
      "source_brand_code": string,
      "source_model_code": string,
    },
    "attempts": int,
    "job_type": string,
    "locked_at": null,
    "created_at": string,
    "last_error": string,
    "started_at": string,
    "updated_at": string,
    "finished_at": string,
    "request_uid": string,
    "available_at": string,
    "items_failed": int,
    "items_updated": int,
    "items_inserted": int,
    "items_received": int,
    "items_unchanged": int,
    "uid_user_created": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `GET /v1/admin/integrations/fipe/jobs/:uid`
- **Ex. collection:** F06 — Consultar o job criado
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "status": string,
  "job_key": string,
  "payload": {},
  "attempts": int,
  "job_type": string,
  "locked_at": null,
  "created_at": string,
  "last_error": null,
  "started_at": string,
  "updated_at": string,
  "finished_at": string,
  "request_uid": string,
  "available_at": string,
  "items_failed": int,
  "items_updated": int,
  "items_inserted": int,
  "items_received": int,
  "items_unchanged": int,
  "uid_user_created": string,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/integrations/fipe/sync`
- **Ex. collection:** F05 — Enfileirar catalog_sync
- **Request body:**
```json
{
  "job_type": "catalog_sync",
  "payload": {}
}
```


---

## health

### `GET /v1/health`
- **Ex. collection:** F59 — Readiness Core com cache FIPE fora
- **Response (schema real):**
```jsonc
{
  "server_name": string,
  "status": string,
  "uptime_seconds": int,
  "elapsed_ms": float,
}
```


---

## admin/groups-permissions

### `GET /v1/admin/groups-permissions`
- **Query:** `filters`
- **Ex. collection:** L5.3 — verificar devices.access no Basic
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "created_at": string,
    "group_code": string,
    "updated_at": string,
    "permission_code": string,
    "uid_user_created": string,
    "uid_user_updated": string,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/groups-permissions`
- **Ex. collection:** G03 — Conceder documents.access ao perfil Basic
- **Request body:**
```json
{
  "group_code": "basic_user",
  "permission_code": "documents.access"
}
```


---

## admin/document-classes

### `POST /v1/admin/document-classes`
- **Ex. collection:** G04 — Criar classe documental Financeiro
- **Request body:**
```json
{
  "uid_organization": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "code": "ged_homolog_financial",
  "name": "Financeiro GED Homologação"
}
```

### `PUT /v1/admin/document-classes/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** G05 — Conceder somente read ao grupo Financeiro
- **Request body:**
```json
{
  "name": "Financeiro GED Homologação",
  "active": true,
  "permissions": [
    {
      "principal_type": "functional_group",
      "uid_functional_group": "8c5f7d8c-0d0c-4f52-9276-7388eee5af81",
      "action_code": "read"
    }
  ]
}
```


---

## admin/document-revisions

### `GET /v1/admin/document-revisions/:uid/download`
- **Query:** `uid_organization`
- **Ex. collection:** G08 — Basic NÃO pode baixar com grant somente read
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## admin/document-distributions

### `PUT /v1/admin/document-distributions/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** G09 — fixar a distribuição na R00
- **Request body:**
```json
{
  "access_mode": "read",
  "revision_policy": "fixed_revision",
  "uid_fixed_revision": "8ad234fc-2961-5e63-a242-e1b2a7aa1b6b"
}
```

### `DELETE /v1/admin/document-distributions/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** G11 — revogar a distribuição


---

## admin/images

### `POST /v1/admin/images/organization/:uid`
- **Query:** `link`
- **Ex. collection:** C28 — nova logo usando o storage novo


---

## public/images

### `GET /v1/public/images/:uid`
- **Ex. collection:** C28B — confirmar que logo não vinculada continua oculta
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## technician/custody

### `GET /v1/technician/custody`
- **Ex. collection:** C12 — listar custódias do executor
- **Response (schema real):**
```jsonc
[[]]
```

### `POST /v1/technician/custody/:uid/confirm-receipt`
- **Ex. collection:** C13 — executor confirma o recebimento


---

## admin/addresses

### `POST /v1/admin/addresses`
- **Ex. collection:** 93 — criar endereço de cobrança + sede
- **Request body:**
```json
{
  "link_code": "organization",
  "uid_link": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "country_code": "BR",
  "postal_code": "30110-012",
  "region": "MG",
  "city": "Belo Horizonte",
  "district": "Centro",
  "address_line1": "Avenida HOMOLOG",
  "number": "100",
  "complement": "Sala 10",
  "purposes": [
    {
      "code": "headquarters",
      "is_primary": true
    },
    {
      "code": "billing",
      "is_primary": true
    }
  ]
}
```


---

## admin/contacts

### `POST /v1/admin/contacts`
- **Ex. collection:** 90 — criar Contact na Organization
- **Request body:**
```json
{
  "link_code": "organization",
  "uid_link": "adbadcf0-1a3f-4be6-b129-2adf05f565cf",
  "name": "HOMOLOG Contato Duplicado",
  "roles": [
    "support"
  ],
  "methods": [
    {
      "type": "phone",
      "value": "+5531987654301"
    }
  ]
}
```

### `GET /v1/admin/contacts/:uid`
- **Query:** `uid_organization`
- **Ex. collection:** 95 — isolamento por Organization
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_


---

## admin/situations

### `GET /v1/admin/situations`
- **Query:** `q`
- **Ex. collection:** 02 - List All
- **Response (schema real):**
```jsonc
{
  "items": [{
    "uid": string,
    "code": string,
    "name": string,
    "locked": bool,
    "scopes": [[]],
    "enabled": bool,
    "created_at": string,
    "updated_at": string,
    "operational": bool,
    "applies_to_all": bool,
  }],
  "limit": int,
  "total": int,
  "offset": int,
  "elapsed_ms": float,
}
```

### `POST /v1/admin/situations`
- **Ex. collection:** 01 - Create
- **Request body:**
```json
{
  "code": "test_blocked",
  "name": "Bloqueado para homologação",
  "enabled": true,
  "operational": true,
  "locked": true,
  "applies_to_all": false,
  "scopes": [
    "entities",
    "assets"
  ]
}
```

### `GET /v1/admin/situations/:uid`
- **Ex. collection:** 02 - List One
- **Response (schema real):**
```jsonc
{
  "uid": string,
  "code": string,
  "name": string,
  "applies_to_all": bool,
  "enabled": bool,
  "operational": bool,
  "locked": bool,
  "scopes": [[]],
  "created_at": string,
  "updated_at": string,
  "elapsed_ms": float,
}
```

### `PUT /v1/admin/situations/:uid`
- **Ex. collection:** 01 - Update
- **Request body:**
```json
{
  "code": "active",
  "name": "Ativo",
  "applies_to_all": false,
  "scopes": [
    "assets"
  ],
  "enabled": true,
  "operational": true,
  "locked": false
}
```

### `DELETE /v1/admin/situations/:uid`
- **Ex. collection:** 01 - Delete


---

## admin/common

### `GET /v1/admin/common/timezones`
- **Ex. collection:** 01 - Timezones
- **Response (schema real):**
```jsonc
[{
  "uid": string,
  "code": string,
  "active": bool,
  "created_at": string,
  "updated_at": string,
  "uid_user_created": null,
  "uid_user_updated": null,
}]
```


---

## images

### `GET /v1/images/:uid`
- **Ex. collection:** C26 — download autenticado da imagem
- **Response:** _(não capturado — uid/fixture indisponível na varredura)_
