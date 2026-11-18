# Frontend — tópico 03: Entidades, tipos e ciclo de vida

## Estado

Roteiro inicial derivado do contrato e dos testes abaixo; aprovação parcial do módulo. Exemplos React completos serão acrescidos após fechar as decisões e pendências de cada fluxo.

Uma entidade representa um cadastro de negócio da organização. Não é usuário, técnico executor ou motorista. Tipos são múltiplos: nova entidade recebe customer; prestadora técnica exige classificação technician. Tipo não concede acesso.

## Sequência de integração

1. Escolher organização autorizada; carregar tipos e seletores dentro desse contexto.
2. Listar/pesquisar entidades com motor central. A lista é enxuta; GET individual contém types.
3. POST /v1/admin/entities com uid_organization/name, chave UUID, e unidade/situação opcionais.
4. Guardar uid; PUT individual recebe name e opcionais, sem mudar organização. PATCH/lifecycle são contratos distintos.
5. PUT /{uid}/types substitui todo o array; nunca enviar [] como limpeza: foi rejeitado com 422 invalid_entity_types.
6. GET/PATCH /{uid}/lifecycle administra blocked/inactive/active com motivo; consultar estado efetivo.
7. DELETE só quando sem dependências; dependência não deve ser contornada.

## Evidência e armadilhas

CRUD Primary: 201 create, 200 replay com mesmo UID, 409 entity_conflict em chave reutilizada com outra intenção, 200 read/update, 422 organization_immutable e 204 delete. Não uniformizar o código entity_conflict para idempotency_conflict no frontend: observar o código real do domínio.

Tipos/lifecycle: 15 casos passaram. Administrador e Secondary sem scope na fixture receberam 404 entity_not_found; Basic sem área recebeu 403 area_not_allowed. Tipos vazios não alteraram vínculos; ciclo blocked/inactive/active e leituras 200; após delete, leitura 404.

## Frontend

Formulário deve manter somente campos editáveis; não reenviar GET completo. Troca de organização limpa entity/types selecionados e cancela requests antigos. Oferecer confirmação e motivo para mudança de lifecycle. Edição e visibilidade são autorizações distintas.

## Limites

Não homologados aqui: todas as combinações de tipos, fusos, delegação parcial, entidades com técnicos/assets em uso e concorrência. Contratos completos em entities.md, entity_types.md e lifecycle.md.

## Evidências

- [2026-10-21-entity-crud-http.json](evidence/2026-10-21-entity-crud-http.json)
- [2026-10-21-entity-types-lifecycle-http.json](evidence/2026-10-21-entity-types-lifecycle-http.json)
