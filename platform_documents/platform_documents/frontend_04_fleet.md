# Frontend — tópico 04: Frota: unidades, grupos, assets e participações

## Estado

Roteiro inicial derivado do contrato e dos testes abaixo; aprovação parcial do módulo. Exemplos React completos serão acrescidos após fechar as decisões e pendências de cada fluxo.

Unidade pertence à entidade; grupo pertence à organização e pode reunir assets de entidades diferentes. Asset é o recurso rastreável, veículo é seu perfil específico. Não usar grupo de frota como grupo de permissões.

## Sequência de integração

1. Organização → entidade → unidade/modelos e catálogos.
2. Listas assets/units/groups/group-assets exigem filtro estruturado uid_organization eq com um UUID; não mandar uid em query arbitrária esperando filtragem.
3. Criar asset por /v1/admin/assets com uid_organization, uid_entity e identification; UID de modelo/energia e unidade conforme formulário.
4. identification é normalizada, não existe name de asset. Organização e entidade são imutáveis no CRUD comum.
5. Grupos em /v1/admin/assets/groups; participações em /v1/admin/assets/group-assets com uid_group/uid_asset.
6. PATCH preserva omitidos; PUT tem semântica completa e pode restaurar defaults. Não reaproveitar genericamente o payload de um no outro.
7. Asset deve manter pelo menos uma participação; a criação associa Geral. Constraint diferida protege a última participação.
8. Lifecycle inactive/active com motivo; DELETE é exclusão lógica, não desativação reversível.

## Evidência

15 operações executadas em fixtures próprias: create/replay/read/PATCH, organização imutável 422, participação 201, grupo em uso 409, remoção do vínculo 204, lifecycle inactive/active 200, delete 204 e asset oculto 404. A entidade parent não foi excluída: a dependência histórica do asset excluído produziu 409. Não apagar esse histórico para limpar fixture.

## Limites

Não homologados neste conjunto: criação/edição de unidade, perfil rodoviário, FIPE, interseções completas de scope, concorrência e todas as dependências. Ver fleet.md e assets_vehicles_fipe.md.

## Evidências

- [2026-10-21-fleet-crud-http.json](evidence/2026-10-21-fleet-crud-http.json)
