# Solicitação — Lacunas de contrato: Devices e SIM Cards (Fase 5)

**Para:** responsável pela API Navisoft
**De:** time frontend (Movisat)
**Data:** 2026-11-11
**Prioridade:** alta (itens 1 e 2 bloqueiam fluxos da UI; a Fase 5 não começa a ser implementada
contra API real até esses pontos serem confirmados)
**Tipo:** lacunas de contrato — baseado em `Insomnia_2026-11-11.json` (pastas `Devices`,
`DEvices 2`, `Devices 3`, `Sim Cards` — 81 requisições), `api-contracts/API_CONTRACTS.md` (análise
estática) e `frontend_05_devices_sim.md` (homologação parcial de 2026-10-21).

> ⚠️ Mesma lição das fases anteriores: se a rota já existe, mandem a rota + formato exato; se não
> existe, é pedido de criação.

---

## Contexto

Vamos integrar **Devices** (`/v1/admin/devices`) e **SIM Cards** (`/v1/admin/simcards`) ao backend
real. O `frontend_05_devices_sim.md` já documenta uma homologação parcial de 12 chamadas em
2026-10-21, o que nos dá uma base boa — mas ela descreve **comportamento**, não o contrato request/
response completo, e não cobre tudo que a tela precisa.

---

## 🔴 1. Como desvincular um SIM card **sem** desativar o device?

`frontend_05_devices_sim.md` (passo 6) diz: *"PUT completo do device com `active=false` libera o SIM
atomicamente e informa `simcard_unlinked`/`unlinked_simcards`."* Isso cobre o caso de **desativar o
device**. Mas:

- E se eu quiser **trocar** o SIM de um device **ativo** (ex.: SIM com defeito, substituir por outro,
  sem tirar o device de operação)? Não achamos endpoint de unlink dedicado nem na collection nem no
  doc.
- Hoje o mock do frontend (`devices.js`) assume `DELETE /v1/admin/devices/:uid/linked-simcards` — essa
  rota **não aparece em nenhum lugar** (nem na collection de 1398 requisições, nem no
  `API_CONTRACTS.md`). Achamos que é um palpite antigo, provavelmente errado.

**Confirmar:**
1. Existe uma forma de desvincular/trocar SIM sem desativar o device (ex.:
   `DELETE /v1/admin/devices/linked-simcards/:uid`, ou vincular um novo SIM substitui o anterior
   automaticamente)?
2. Se não existe, o único caminho realmente é desativar → reativar → vincular outro SIM? (o doc já
   confirma que reativar **não** revincula SIM automaticamente, então a UI precisaria orientar o
   usuário por esse caminho manual.)
3. Qual o nome exato do(s) campo(s) na resposta do `PUT /v1/admin/devices/:uid` quando o SIM é
   liberado — `simcard_unlinked` (bool) e/ou `unlinked_simcards` (array)? O doc cita os dois nomes,
   não está claro se são a mesma coisa ou dois campos distintos.

---

## 🔴 2. SYS-RES-01 (replay/idempotência quebrado) — segue em aberto?

Registrado em `frontend_issues.md` (22–23/10/2026): `POST /v1/admin/devices/protocol-identities`
com retry (mesma `idempotency key` + corpo) devolveu **`422 invalid_device`** em vez do registro já
criado; consulta read-only confirmou `22023 invalid_create_resource` no dispatcher. O mesmo
problema foi apontado como **possivelmente afetando** `protocol-identities/:uid/shares` e
`telemetry-mappings` (ainda sem HTTP reproduzido para esses dois, só análise estática do dispatcher).
Não há reteste registrado depois de 23/10.

**Confirmar:**
1. SYS-RES-01 foi corrigido? Se sim, em qual data/forward, e foi re-testado contra os 3 recursos
   (`protocol-identities`, `protocol-identities/:uid/shares`, `telemetry-mappings`)?
2. Se ainda não foi corrigido: isso bloqueia qualquer fluxo da UI que precise de retry seguro ao criar
   identidade protocolar/mapeamento de telemetria (ex. timeout de rede seguido de reenvio pelo
   usuário) — o segundo envio quebraria em vez de devolver o registro já existente.

---

## 🟡 3. Listagem de `protocol-identities` e `telemetry-mappings`

Em toda a collection (1398 requisições) e no `API_CONTRACTS.md` só existe **`POST` (criar)** para:

```
POST /v1/admin/devices/protocol-identities
POST /v1/admin/devices/protocol-identities/:uid/shares
POST /v1/admin/devices/telemetry-mapping-profiles
POST /v1/admin/devices/telemetry-mappings
```

Não há `GET`/`search` de nenhum dos quatro.

**Confirmar:**
1. Existe listagem (por `uid_device` ou `uid_organization`)? Se a tela de device precisar mostrar
   "identidades protocolares cadastradas" ou "mapeamentos de telemetria vigentes", precisamos da rota.
2. Se não existe, é porque esses recursos **não têm tela própria** nesta fase (são só setup via API,
   ex. integração do time de telemetria) e a UI de `devices-sim` não precisa exibi-los? Preferimos
   confirmar isso antes de desenhar a tela.

---

## 🟡 4. `DELETE` de device e de SIM card — confirmar contrato completo

`frontend_05_devices_sim.md` registra: *"DELETE de SIM e device de teste retornaram 204"* — mas
**nenhuma requisição `DELETE`** para `devices` ou `simcards` aparece na collection nem no
`API_CONTRACTS.md` (0 ocorrências buscando o método `DELETE` nessas duas famílias).

**Confirmar:**
1. Rota exata: `DELETE /v1/admin/devices/:uid` e `DELETE /v1/admin/simcards/:uid`?
2. Pré-condições/negativas: device com SIM vinculado bloqueia o `DELETE` (como o 409
   `device_reference_conflict` do passo 5 do doc, que hoje só foi testado para `DELETE` de SIM)?
   Device com custódia/histórico de OS bloqueia com 409, como ocorre em `entities`?
3. É exclusão lógica (como `assets`) ou física (como `entities`)?

---

## 🟡 5. Senha do device — como é definida/alterada?

Nenhum exemplo de `POST`/`PUT /v1/admin/devices` documentado (nem na collection, nem no
`API_CONTRACTS.md`) inclui o campo `password` no corpo — só aparece `has_password: bool` na
**resposta** do `GET`. O próprio `frontend_05_devices_sim.md` lista **"rotação de senha"** como não
homologada ainda.

**Confirmar:**
1. `password` é aceito no `POST /v1/admin/devices` (criação) e é opcional?
2. Existe rota dedicada para alterar a senha depois de criado (ex.:
   `PUT /v1/admin/devices/:uid/password`)? Se sim, qual o formato?

(Este item não bloqueia o CRUD básico — podemos lançar sem exposer rotação de senha na primeira
versão da tela — mas precisamos saber se `password` no create é obrigatório ou não.)

---

## 🟢 6. Pontos a confirmar (não bloqueiam)

**6.1 — Listagem simples de devices.** Só existe `POST /v1/admin/devices/search` (filtros
estruturados) na collection/contrato — nenhum `GET /v1/admin/devices?filters=`. Confirmar que o
padrão aqui é mesmo só `POST /search` (diferente de outras famílias que têm os dois).

**6.2 — "Vínculo oculto 404" (frontend_05, evidência).** O doc menciona um cenário de "vínculo oculto
404" sem detalhar — é o `GET /v1/admin/devices/linked-simcards` retornando 404 quando não há vínculo
ativo para o filtro passado? Ou é outra coisa? Pedimos o detalhe pra não interpretar errado na UI.

**6.3 — Reativação não revincula SIM (já confirmado, só documentando).** `PUT` com `active=true` não
restaura o vínculo de SIM anterior — a UI não vai desenhar isso como toggle reversível. Nenhuma ação
do backend necessária aqui, é só pra constar que entendemos.

---

## Resumo (TL;DR para o programador)

| # | Rota faltando / a confirmar | Impacto | Severidade |
|---|------------------------------|---------|:---:|
| 1 | Unlink/troca de SIM em device **ativo** (sem desativar) | Só dá pra trocar SIM desativando o device | 🔴 |
| 2 | SYS-RES-01 (replay quebrado em protocol-identities/shares/telemetry-mappings) | Retry de criação falha em vez de ser idempotente | 🔴 |
| 3 | `GET`/`search` de `protocol-identities` e `telemetry-mappings` | Não dá pra listar o que já foi cadastrado | 🟡 |
| 4 | Contrato completo de `DELETE devices/:uid` e `DELETE simcards/:uid` | Confirmar rota/pré-condições antes de ligar o botão "Excluir" | 🟡 |
| 5 | Campo `password` no create/edição de device; rota de rotação | Senha do device fica sem fluxo de UI | 🟡 |
| 6 | Listagem de devices só por `/search`; detalhe do "vínculo oculto 404"; reativação não revincula | Confirmações | 🟢 |

**O que já está confirmado e pronto pra implementar (nenhuma ação):** `POST/GET/PUT /devices`,
`POST /devices/search`, `POST /devices/:uid/prepare`, `POST /devices/:uid/release`,
`GET /devices/custody` + `confirm-receipt`/`declare-return`/`receive`,
`GET/POST/PUT /devices/models` (+ `GET /devices/models/:uid`), `GET/POST /devices/types`,
`GET/POST /simcards`, `POST /devices/linked-simcards`, `GET /devices/linked-simcards`,
`GET /assets/:uid/device-slots`. O comportamento de desativação (libera SIM atomicamente) e a
proteção 409 ao tentar `DELETE` de SIM vinculado também já estão confirmados por
`frontend_05_devices_sim.md`.
