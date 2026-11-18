# Frontend — tópico 05: Devices, estoque SIM e exclusividade

## Estado

Roteiro inicial derivado do contrato e dos testes abaixo; aprovação parcial do módulo. Exemplos React completos serão acrescidos após fechar as decisões e pendências de cada fluxo.

Device é equipamento, asset é o recurso atendido. SIM é estoque de conectividade. Serial/IMEI/ICCID são strings; segredo do device é entrada protegida e nunca dado de apresentação.

## Sequência de integração

1. Selecionar tipo/fabricante/modelo compatíveis; não usar modelo de asset como modelo de device.
2. Criar inventário em /v1/admin/devices com organização, tripla de catálogo, serial, active e transmits; IMEI/senha conforme contrato.
3. Criar SIM em /v1/admin/simcards, ICCID string e active.
4. Vincular em /v1/admin/devices/linked-simcards com uid_device/uid_simcard; um por lado, mesma organização.
5. DELETE de SIM vinculado foi recusado com 409 device_reference_conflict.
6. PUT completo do device com active=false libera o SIM atomicamente e informa simcard_unlinked/unlinked_simcards. Confirmar resposta e atualizar as duas telas.
7. Reativar device não reassocia SIM automaticamente. Não desenhar a interface como toggle que restaura todos os vínculos.
8. Transferência e vínculo a asset são fluxos dedicados; organização não se muda pelo PUT comum.

## Evidência

12 chamadas passaram: catálogo de modelos, criação/replay/leitura de device, criação SIM/vínculo, proteção de delete, desativação, vínculo oculto 404, SIM preservado, reativação e ausência de relink. DELETE de SIM e device de teste retornaram 204. Sem comandos físicos ou alterações em equipamento preexistente.

## Limites

Não homologados aqui: transferência, OS, custódia, SIM obrigatório em todas as transições, rotação de senha e device vinculado a asset. Ver devices.md, simcards.md e device_technician_workflow.md.

## Evidências

- [2026-10-21-devices-sim-http.json](evidence/2026-10-21-devices-sim-http.json)
