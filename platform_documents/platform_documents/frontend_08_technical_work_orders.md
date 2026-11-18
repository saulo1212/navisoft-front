# Frontend — tópico 08: OS técnica, custódia e snapshot

## 22/10/2026 — SYS-OS-02 retestado; SYS-RES-01 aberto

API voltou a responder. Fixture nova executou instalação, substituição e retirada com executor Basic vinculado e scope explícito de assets. Conclusões e replays 200, mesmos UIDs/completed_at, sem pricing_snapshot no self-service. Conflito de fingerprint 409; perda/restauração de scope com novo login negou/permitiu replay. Substituição e retirada tiveram declaração de devolução 200 preservando return_pending e recebimento físico administrativo 200 fechando custódia. SYS-OS-02 encerrado nesses cenários HTTP após 0212. Não é aprovação integral do módulo nem confirmação independente da regressão SQL. Fixture: login desvinculado/desabilitado, técnico desativado, dois assets excluídos 204; devices preservados com histórico e sem custódia pendente. Evidência: [0212 HTTP](evidence/2026-10-22-work-order-executor-0212-http.json).

Continuidade em identidade/projeção (0213–0216): listagens protocol-identities e telemetry-mappings 200; identidade criada 201 com zeros iniciais preservados. Retry com mesma chave/body/ator retornou 422 invalid_device: **SYS-RES-01 aberto**. Consulta read-only sob navisoft_auth/Primary confirmou common.check_create_visibility('devices/protocol-identities',uid) -> 22023 invalid_create_resource, com ROLLBACK. Go registra devices/protocol-identities, devices/protocol-identities/:uid/shares e devices/telemetry-mappings como create idempotente; revisar integração de todos com o dispatcher, sem presumir que os dois últimos já falharam em HTTP. Identidade de teste desativada por PUT 200. Worker/Valkey não foram iniciados ou homologados. Evidência: [identidade e replay](evidence/2026-10-22-protocol-resolution-http.json).


## SYS-OS-01 — replay retestado; SYS-OS-02 — retirada pelo executor

Operador informou regressão PostgreSQL concluída com RESET/DO/ROLLBACK e API reiniciada. Consulta read-only confirmou 0210 e 0211 registradas e terminou em ROLLBACK. Replay do receipt original de conclusão retornou 200/replayed=true, mesmo UID, completed_at e pricing_snapshot. Em fixture HTTP nova com usuário Basic vinculado ao executor: instalação/conclusão e replay 200; corpo alterado com mesma chave 409; alvo diferente 409; ausência de sessão 401; retirada de scope com novo login 404; restauração de scope com novo login permitiu replay 200. Resposta self-service não expôs pricing_snapshot. SYS-OS-01 encerrado nesses cenários. Não foi retirada a permissão global devices.access.

A continuação encontrou **SYS-OS-02**: nova OS de retirada criada e despachada, start self-service 200, mas complete do executor retornou 409 device_reference_conflict. A mesma OS e corpo foram concluídos via rota administrativa com Primary (200). Causa interna ainda não confirmada; o handler mapeia SQLSTATE 23503 desconhecido para essa mensagem. Inspeção read-only encontrou trigger devices.capture_technician_history na custódia, que revalida técnico/prestadora; é ponto de investigação, não causa comprovada. Solicitar regressão com identidade Basic e scope restrito a assets durante a retirada, sem ampliar grants ou transformar o executor em administrador.

Cleanup concluído via API: executor declarou devolução 200, mantendo return_pending sem received_at/closed_at; Primary recebeu fisicamente 200 e fechou custódia. Login desvinculado, executor desativado, usuário de fixture desabilitado e dois assets excluídos 204. Device mantido por 409 de dependência histórica, sem custódia aberta. Evidências: [replay original](evidence/2026-10-21-work-order-0211-retest.json) e [executor e retirada](evidence/2026-10-21-work-order-executor-0211-http.json). Não marcar todo o módulo como homologado.


## Ordem obrigatória

1. Selecionar asset e executor ativo da mesma organização; técnicos/capabilities são dados de negócio, não permissões.
2. Device novo deve passar prepare/release para ficar available; requisitos de SIM/condição continuam valendo.
3. Criar OS com uid_asset, uid_technician, description e items por slot. A organização é derivada do asset; não adicionar campo inventado.
4. Dispatch congela requisitos e preço por item, mas não instala automaticamente. Consulta financeira requer área separada; self-service não deve exibir preços.
5. Confirmar recebimento da custódia antes do start; 409 device_custody_confirmation_required mantém OS despachada.
6. Completar por items [{uid_item,result_notes,tests?}], com Idempotency-Key. Não mostrar OS concluída só porque HTTP 200: verificar completed e bloqueios por item.
7. Remoção/substituição gera retorno pendente. Declaração do técnico e recebimento administrativo são eventos diferentes; receber fisicamente fecha custódia.
8. Device com histórico pode não ser excluído. Preservar OS, auditoria e FKs.

## Evidência executada

Instalação com capability vehicle_cameras e snapshot priced v1, custo 10001, markup 12.34, total 11235 centavos. Recebimento, start e complete aprovados. Retirada por nova OS e recebimento do retorno também passaram. Asset excluído e técnico desativado. Device protegido de exclusão por histórico.

## Bloqueio

SYS-OS-01: replay da conclusão retornou 422 invalid_device; não marcar este fluxo como integralmente homologado. Criação da OS replaya 200 corretamente. Não emitir nova chave automaticamente para retry de conclusão: preservar intenção e corrigir a falha.

Ver [evidência](evidence/2026-10-21-technical-work-order-http.json), [issues](frontend_issues.md), devices.md e device_technician_workflow.md. Não homologados nesta rodada: portal executor, testes obrigatórios fail/pass, conclusão parcial, snapshot mixed/unpriced, concorrência e perda de acesso na conclusão.
