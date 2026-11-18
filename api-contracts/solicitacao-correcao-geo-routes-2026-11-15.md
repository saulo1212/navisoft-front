# Criação de rota GEO — 503 reproduzido em 15/11/2026

Base: API configurada no frontend (`https://api.navisoft.app`). Organização de testes: Admin Homolog Client (`6f68ea93-7ba5-4dae-b764-f4fe076bfbb8`). Login autenticou com 200; nenhuma credencial consta nas evidências.

## Falha reproduzida

`POST /v1/admin/geo/routes`, Bearer administrativo válido, JSON e Idempotency-Key UUID. Corpo com escopo organization, nome exclusivo de fixture, active=true, margem lateral 80, velocidade padrão 60 e pontos numéricos distintos:

```json
{
  "scope_level": "organization",
  "uid_organization": "6f68ea93-7ba5-4dae-b764-f4fe076bfbb8",
  "name": "QA-GEO-71798cc6-86fe-4a44-a92d-b5d3a83af60f-3",
  "description": "Fixture temporária de homologação",
  "active": true,
  "lateral_margin_meters": 80,
  "max_speed_kmh": 60,
  "points": [
    { "longitude": -46.63, "latitude": -23.55, "max_speed_to_next_kmh": 40 },
    { "longitude": -46.61, "latitude": -23.54 }
  ]
}
```

Resultado: **503 geo_storage_unavailable**, mensagem `Geographic storage is temporarily unavailable.` Último request ID: **d6d3e7eb-3d91-4e4d-bcd2-f93844a2db25**.

O corpo numérico segue o exemplo de rota ordenada da seção 11.4 do TESTING_GUIDE, usando o escopo organization disponível no módulo. A falha se repetiu em duas baterias e diagnóstico isolado. O diagnóstico exato preservou chave, nome e corpo da segunda bateria, sem criar uma nova intenção após o erro. Não houve UID de rota reconhecido nas respostas. O HTTP 503 não comprova qual migration, função SQL ou dependência falhou.

## Efeito observado na limpeza

Após falhar a rota, DELETE de pontos/cercas do ensaio e alguns GETs também responderam 503. Nas tentativas posteriores as exclusões retornaram 204 e os detalhes 404. Os seis pontos/cercas das duas rodadas tiveram limpeza confirmada. A relação temporal está registrada; não se conclui causa compartilhada sem consultar logs do servidor.

Pontos, círculos e polígonos passaram em criação/replay/conflito, negativas, GET/PUT/list/search com a mesma conta e organização. Portanto não há evidência para tratar o erro como negação legítima de acesso do administrador.

## Evidências e ação necessária

- [Primeira bateria](evidence/phase6-authenticated-http-2026-11-15.json).
- [Segunda bateria](evidence/phase6-authenticated-retest-2026-11-15.json).
- [Limpeza da primeira bateria](evidence/phase6-cleanup-diagnostic-2026-11-15.json).
- [Limpeza da segunda bateria](evidence/phase6-route-diagnostic-2026-11-15.json).
- [Reprodução com corpo/chave exatos e request ID](evidence/phase6-route-exact-diagnostic-2026-11-15.json).
- [Conferência final de limpeza](evidence/phases6-7-final-cleanup-2026-11-15.json): seis detalhes GEO 404 e buscas pelos dois nomes de rota com 200/items vazios. Não ficaram rotas das tentativas com 503.

Consultar os logs pelo request ID, identificar a falha de armazenamento de rotas e corrigir o backend/ambiente. Este workspace contém frontend e documentação, sem o código Go/SQL do serviço para corrigir a causa. Após a correção, executar a bateria de Geografia e validar criação, ordem/velocidade dos pontos, replay/conflito, PUT e limpeza da rota. Nenhuma alteração no payload do frontend foi inventada para contornar o 503.
