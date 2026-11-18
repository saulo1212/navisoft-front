# Fase 6 — implementação e critérios de aceite

## Revisão de 15/11/2026

Os exemplos em TESTING_GUIDE.md, seção 11, encerram a lacuna de corpos de cercas e rotas da revisão anterior. O frontend oferece listagem, detalhe, criação, PUT completo e exclusão para os três recursos. A camada de API oferece POST /search sem chave de idempotência; a tela usa GET com filtros centrais e offset.

- Cercas: shape circle com latitude/longitude/radius_meters; shape polygon com geojson; entry_margin_meters e exit_margin_meters. Trocar formato remove os campos incompatíveis do corpo.
- Rotas: points ordenados com coordenadas e velocidade opcional por segmento; lateral_margin_meters e max_speed_kmh. PUT envia todos os pontos.
- Escopos: global/organization/entity/asset com UUIDs da hierarquia; edição mantém escopo e vínculos. O backend confirma permissões e hierarquia.
- Criação preserva a chave nas retentativas do mesmo corpo; alteração do corpo gera outra intenção na tela.
- Mapa local: pontos, círculos, GeoJSON e rotas recebidas em points; sem base de ruas, restrito aos registros carregados.

O formulário de polígono recebe GeoJSON; a rota tem editor de pontos com campos de latitude/longitude, velocidade por segmento e ações de adicionar, remover e reordenar. A validação local cobre coordenadas, anéis fechados, medidas não negativas e dois pontos distintos. Validade topológica, incluindo autointerseção, é decidida pela API.

## Verificação executada

`cd frontend; npm.cmd run test:geography`: **13 testes locais** (11 de domínio/contrato e 2 do roteiro HTTP), com HTTP simulado. Cobrem campos/métodos dos três recursos, filtros/offset, Bearer, no-store, retentativa com a mesma chave, DELETE 204, propagação dos seis erros GEO canônicos, rejeição de números inválidos e limpeza de fixtures mesmo se uma negativa falhar.

Parser JavaScript/JSX aprovado nos arquivos alterados. `npm.cmd run build` falhou com `spawn EPERM`. Build e navegador continuam pendentes. Os testes simulados não comprovam autorização por perfil ou isolamento real de tenant; a execução HTTP posterior está registrada abaixo.

Nesta continuação, `npm.cmd run dev -- --port 3016` também falhou com `spawn EPERM`. Uma única consulta real `GET /v1/users/status` com o token local retornou **401**, sem imprimir nem copiar o token. Nenhum CRUD real foi iniciado.

### Homologação posterior com a conta informada pelo usuário

Login ativo 200, organização Admin Homolog Client. Pontos, círculos e polígonos passaram em criação 201, replay 200 com mesmo UID, chave/corpo divergente 409, geometria inválida 422, detalhe/PUT/listagem GET/search POST 200. As exclusões falharam inicialmente com 503, mas as tentativas posteriores terminaram em 204 e GET 404 para todos os registros criados.

**Rotas continuam bloqueadas:** POST com dois pontos numéricos distintos retornou 503 nas duas baterias e no diagnóstico isolado. Código confirmado `geo_storage_unavailable`; request ID `d6d3e7eb-3d91-4e4d-bcd2-f93844a2db25`. Nenhum UID de rota foi devolvido. O workspace não contém backend Go/SQL para corrigir a causa.

Ver [primeira execução](evidence/phase6-authenticated-http-2026-11-15.json), [reteste](evidence/phase6-authenticated-retest-2026-11-15.json) e [diagnóstico com critérios de reteste](solicitacao-correcao-geo-routes-2026-11-15.md). A falha de rotas impede aprovar a Fase 6 inteira. Geocode, perfis/cross-tenant e navegador também continuam pendentes.

## Roteiro HTTP preparado

`frontend/scripts/geography.http.mjs` executa CRUD de ponto, círculo, polígono e rota, replay de mesma chave/corpo, conflito 409, geometria inválida 422, GET/list/search e exclusão seguida de GET 404. Faz limpeza em finally de todos os UIDs de criação reconhecidos, inclusive se uma negativa criar um registro inesperadamente. Não modifica registros preexistentes. Gera relatório sem Bearer. Um timeout na criação pode deixar registro sem UID reconhecido: o relatório conserva nome e chave de cada intenção para conferência.

Configurar no PowerShell com os valores do ambiente de homologação:

```powershell
$env:GEO_API_URL = 'https://HOST-DE-HOMOLOGACAO'
$env:GEO_ORGANIZATION_UID = 'UUID-DA-ORGANIZACAO-DE-TESTE'
$env:GEO_TOKEN_FILE = 'C:\caminho\token-de-teste.txt'
$env:GEO_REPORT_PATH = 'geography-http-report.json'
npm.cmd run test:geography:http
```

Executar de frontend, usando conta com acesso aos três recursos. A base e a organização devem ser confirmadas antes da execução. O roteiro não cobre outros perfis nem cross-tenant; esses cenários continuam no aceite abaixo.

## Pendências para encerrar a Fase 6

1. Executar build e validar no navegador: alternância de área/organização/escopo, paginação, detalhes, formulários, erros, mapa e confirmação de exclusão.
2. Corrigir o 503 de criação de rota no backend/ambiente e homologar seu CRUD, ordem/velocidades e limpeza. Pontos/círculos/polígonos já têm evidência administrativa positiva.
3. Homologar replay/conflito da rota após a correção do 503. Pontos/círculos/polígonos já confirmaram mesmo UID em replay e 409 para chave com corpo divergente na API real.
4. Validar filtros por recurso, escopo asset e UUIDs, perfis sem área, acesso cross-tenant com lista vazia/detalhe oculto e negativas de geometria.
5. **Geocode:** fornecer método/path de pesquisa direta/reversa, autenticação, gates, parâmetros, envelopes e erros. Provisionamento em organizations/:uid/services/geocode não demonstra pesquisa. Resolver POI em geo/points/resolve também não substitui busca de endereços.

Os manuais geography.md e geographic_design.md citados na imagem não estão neste workspace. Os exemplos locais permitem implementar o CRUD, mas não validar as linhas/testes de backend apresentados na matriz. A Fase 6 permanece parcial no task.md.
