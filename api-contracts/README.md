# API Contracts — Navisoft

Contratos de API derivados da collection `Insomnia_2026-11-04.json` + varredura **real de leitura** contra `https://api.navisoft.app` (produção), executada em 05/11/2026.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `API_CONTRACTS.md` | Documento legível, **agrupado por recurso de API** (`admin/organizations`, `admin/assets`, …). Para cada rota: método, query params, body de request (mutações) e **schema real da resposta** (GETs). |
| `contracts.json` | Mesmos dados em formato máquina (1 objeto por rota) — base para geração de tipos/clients. |
| `coverage.json` | Estatísticas de cobertura e lista de lacunas. |

## Como foi feito

- **GET (leitura):** disparados de verdade contra produção com sessão `admin.autoscale` (Primary). O JSON retornado foi reduzido ao **schema** (tipo de cada campo). Zero efeito colateral.
- **POST/PUT/PATCH/DELETE (mutações):** **não disparadas** (evitar criar/alterar/apagar dados reais). O contrato de *request* (payload/params) foi extraído dos bodies da collection.
- Segmentos `:uid` nos paths = UUID. UUIDs e tokens longos foram normalizados para deduplicar rotas.

## Cobertura

- **315 rotas únicas** (130 GET, 116 POST, 41 PUT, 19 PATCH, 9 DELETE).
- **107 / 130 GETs** com schema de resposta real capturado.
- **168 / 185 mutações** com body de request documentado.

### Lacunas conhecidas (GET sem resposta capturada — 23)

Motivos: fixture/uid inexistente no momento da varredura (404), storage indisponível (503), ou teste negativo intencional. Principais:

- **Relatórios salvos por UID** (`/v1/reports/:uid`, `/v1/reports/:uid/download`) — os UIDs de homologação na collection já não existem. Rota válida; precisa de um relatório gerado real.
- **GED / download** (`admin/document-revisions/:uid/download`, `admin/documents/:uid`) — alguns 404/503 de storage.
- **Knowledge attachments** (`knowledge/items/:slug/attachments/:uid`) — 503 `knowledge_storage_unavailable` (issue de backend conhecida).
- **assets/:uid/valuation** — 503 intermitente.
- Detalhes que exigem `uid_organization` específico não presente no env (collaborators, contacts, checklists).

Para fechar essas lacunas: rodar a varredura com a base de homologação (`172.25.73.91:8080` via VPN) usando fixtures vivas, ou gerar os recursos antes de consultar.

## Regenerar

Scripts no scratchpad da sessão: `sweep.py` (varredura GET), `backfill.py` (detalhes por uid vivo), `gen_contracts.py` (gera estes arquivos). Requer login válido; o token expira (~24h).

## Avisos

- Capturado contra **produção**. Os schemas refletem o estado real em 05/11/2026; campos podem evoluir.
- Nenhum valor sensível foi persistido aqui — apenas **tipos** de campos. Tokens/senhas não estão nestes arquivos.
