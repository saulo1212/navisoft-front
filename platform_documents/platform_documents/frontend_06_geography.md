# Frontend — tópico 06: Pontos, cercas e rotas

## Estado

Roteiro inicial derivado do contrato e dos testes abaixo; aprovação parcial do módulo. Exemplos React completos serão acrescidos após fechar as decisões e pendências de cada fluxo.

POI descreve posição, cerca define região, rota organiza pontos. Cadastro não comprova motor automático de eventos ou ingestão de tracking.

## Sequência de integração

1. Carregar contextos permitidos e áreas geo_points/geo_geofences/geo_routes.
2. Selecionar scope_level global/organization/entity/asset; UUIDs obrigatórios dependem desse nível e devem manter a mesma hierarquia.
3. Cercas circle recebem centro/raio; polygon recebe GeoJSON segundo geography.md. Não misturar graus com metros.
4. GET lista e POST search usam filtros centrais; preservar organização e filtros entre páginas.
5. GET individual fora do scope oculta o registro; não apresentar UUID oculto como recurso existente.
6. A API valida geometria, alcance e mutações; mapa não autoriza por posição geográfica.

## Evidência 0208

Quatro leituras iniciais 200. Duas cercas organizacionais de teste criadas 201, seguidas de 24 chamadas nos quatro perfis. Primary viu ambas; Administrator/Secondary viram somente a própria, com lista vazia e detalhe 404 para a outra. Basic sem área recebeu 403 area_not_allowed. Duas exclusões 204. A 0208 foi confirmada instalada e runtime permanece sem SELECT direto em scope_grants.

## Limites

Não homologados aqui: polígonos complexos, edições, geometrias inválidas, margens, resolução de ponto, Basic com área concedida e concorrência. Ver geography.md e geographic_design.md, distinguindo implementação e proposta.

## Evidências

- [2026-10-21-geofence-0208-preflight.json](evidence/2026-10-21-geofence-0208-preflight.json)
- [2026-10-21-geofence-0208-http.json](evidence/2026-10-21-geofence-0208-http.json)
