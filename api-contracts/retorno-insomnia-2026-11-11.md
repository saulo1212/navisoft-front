
 resolvido os 4 pontos bloqueantes (`group-assets`, `groups`, lifecycle de entity/asset,
catálogos `models`/`manufacturers`/`types`) — implementamos tudo no frontend e homologamos ao vivo
contra a base real (org `Admin Homolog Client`, `6f68ea93-…fbb8`). A maior parte funcionou de
primeira. Dois pontos específicos, porém, deram erro mesmo seguindo o contrato exatamente como
documentado em `Navisoft_Fase4_Handoff_Frontend.md`

---

## 🔴 1. `DELETE /v1/admin/addresses/:uid` — 404 mesmo o registro existindo

Reproduzido isolado (fora da UI, via fetch direto, pra eliminar qualquer suspeita do frontend)

```
GET    /v1/admin/addresses/18e57ddf-…66fcd?uid_organization=6f68ea93-…fbb8   → 200 (devolve o endereço completo)
PATCH  /v1/admin/addresses/18e57ddf-…66fcd?uid_organization=6f68ea93-…fbb8   → 200 (atualizou "number": "1000" → "2000", confirmado no GET seguinte)
DELETE /v1/admin/addresses/18e57ddf-…66fcd?uid_organization=6f68ea93-…fbb8   → 404 {"message": "directory_record_not_found"}
```

Mesmo UID, mesmo `uid_organization`, mesma query string  `GET` e `PATCH` acham o registro sem
problema, só o `DELETE` não acha. Testei também variações:

- `DELETE` sem `?uid_organization=` e com `uid_organization` no body → `400 organization_target_required`
  (confirma que o backend espera o param via **query**, igual o `GET`/`PATCH`, então não é erro de
  formato nossa).
- `GET` no mesmo UID logo depois do `404` → ainda `200`, registro intacto (ou seja, o `DELETE` não
  aplicou nada, nem parcialmente).

A mensagem `directory_record_not_found` sugere que o handler do `DELETE` está consultando uma tabela/
view diferente da que `GET`/`PATCH` usam (talvez um join com "directory" que falha). Pedimos
confirmar e corrigir — hoje a UI não consegue remover endereço nenhum.

---

## 🟡 2. `DELETE /v1/admin/assets/:uid` — responde 500, mas a exclusão acontece

```
DELETE /v1/admin/assets/29e55ea4-…c6167 → 500 
GET    /v1/admin/assets/29e55ea4-…c6167 → 404 {"message": "fleet_not_found"}   ← rodado logo em seguida
POST   /v1/admin/assets/search (mesma org) → lista volta a 0 assets
```

O efeito colateral da exclusão lógica **aconteceu de verdade** (o asset sumiu da listagem e do GET
individual), só a resposta HTTP da chamada que disparou isso veio `500` em vez de `200`/`204`. Isso é
pior do que parece pra UX: hoje a tela mostra "erro inesperado" pro usuário mesmo a exclusão tendo
funcionado, então a pessoa tende a tentar de novo (e aí sim recebe `404 fleet_not_found`, confuso).
Pedimos ajustar o `DELETE` de assets pra devolver o status de sucesso correto quando a exclusão lógica
é aplicada.

---

## ✅ O que já confirmamos funcionando 100% (nenhuma ação necessária)

- `GET`/`search` de `group-assets` e `groups` (o palpite anterior da UI já estava certo).
- `PATCH /entities/:uid/lifecycle` e `PATCH /assets/:uid/lifecycle` (`{state, reason}`) — testado ao
  vivo, o badge de situação reflete a mudança imediatamente.
- `DELETE /entities/:uid` devolvendo **409** corretamente quando há endereço vinculado (dependência).
- `GET` de `assets/types`, `assets/manufacturers` (filtro `uid_type`) e `assets/models` (filtro
  `uid_type`+`uid_manufacturer`) — testamos o seletor em cascata completo na tela de criar asset, os
  3 níveis carregaram e filtraram certo.
- `GET`/`POST /search` de `addresses`, e `PATCH /addresses/:uid?uid_organization=` (só o `DELETE` que
  tem o bug do item 1).

---

## Pedido direto

1. 🔴 Corrigir `DELETE /v1/admin/addresses/:uid` — hoje não remove nenhum endereço.
2. 🟡 Corrigir o status HTTP de `DELETE /v1/admin/assets/:uid` quando a exclusão lógica é aplicada
   (devolver 200/204, não 500).

Dados de teste usados (podem ser limpos ou ignorados, ambiente de homologação):
entidade `8c9262fe-…5b1b` ("Teste Fase4 Claude", org `6f68ea93-…fbb8`, hoje em `blocked`, não pôde
ser excluída por causa do endereço `18e57ddf-…66fcd` que não conseguimos remover — ver item 1); asset
`29e55ea4-…c6167` já foi excluído com sucesso (apesar do 500).
