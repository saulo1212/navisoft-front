# Fase 7 — técnicos, OS e manutenção

Implementação em 15/11/2026 baseada em `Insomnia_2026-11-11.json`, `API_CONTRACTS.md`, `DEVELOPER_GUIDE.md`, `TESTING_GUIDE.md` e roteiros frontend 07/08.

## Telas e contratos

| Tela | Entrega |
| --- | --- |
| `/tecnicos` | Busca real por organização e offset; criação com chave preservada; detalhe consultado; ativação/desativação; catálogo real de capacidades; PATCH de capabilities; vínculo opcional a usuário existente; GET/PUT da tabela completa de preços por capacidade/operação. |
| `/ordens-servico` | Busca por state pending/completed/all, filtros centrais e offset; contadores de itens; criação de itens por slot com install/remove/replace/maintenance e UIDs antes/depois. A organização é derivada do ativo, sem campo adicional no POST. Ativo e executor são conferidos na organização selecionada antes da criação. |
| `/ordens-servico/[uid]` | Detalhe; despacho com transporte; início; conclusão dos itens selecionados, resultados pass/fail e notas; retentativas preservam chave/corpo. Após ação, relê o estado da OS; HTTP 200 com completed=false não produz conclusão artificial. Preços por item dependem da área financeira. |
| `/minhas-ordens-servico` e `/minhas-ordens-servico/[uid]` | Rotas self-service dedicadas; não enviam uid_technician nem filtro de organização e não consultam APIs administrativas. Projeção remove recursivamente preços/custos/moeda/markup. Início, conclusão parcial e confirmação de recebimento usam as rotas do executor. |
| `/manutencao` | Busca, criação, detalhe, PATCH agregado de descrição/itens/condições; iniciar/concluir/cancelar com confirmação; resolução explícita de condições na conclusão; consulta da disponibilidade do ativo. Terminais não exibem edição. Create e transition preservam chaves nas retentativas. |

Custódia é um recurso próprio: GET `/v1/admin/devices/custody` ou `/v1/technician/custody`; confirmação em `/:uid/confirm-receipt`. Declaração e recebimento físico administrativos usam `/:uid/declare-return` e `/:uid/receive`, nunca o UID da OS. As páginas de custódia são carregadas por offset e filtradas no cliente pela OS; o botão permite carregar outras páginas. Nenhuma coincidência nas páginas já carregadas é apresentada como ausência definitiva.

As áreas de navegação são `devices`, `maintenance` e **`devices.pricing`**, nome confirmado no access-context real. `devices.pricing.access` é a permissão interna citada nos guias, não a chave do mapa de áreas. O contexto global não expõe `assets.fleet_admin`; a tela de manutenção exibe operações para áreas maintenance/assets permitidas, e o backend revalida a permissão adicional em toda escrita. Trocar sessão, organização ou áreas desmonta formulários e aborta requisições.

A prestadora continua sendo entidade com tipo technician, administrada em Entidades. O frontend não substitui tipos automaticamente nem oferece DELETE de executor. A tabela de preços avisa e exige confirmação de replacement completo; respostas de preço são relidas para obter versão e cálculo autoritativos.

## Validação local

- `cd frontend; npm.cmd run test:technical-operations`: **17 testes passaram**, com HTTP simulado. Cobrem campos reais, manutenção do mesmo device antes/depois na operação maintenance, contexto da organização, preço por operação, conclusão parcial/fail/pass, chaves por intenção, custódia por UID, distinção de recebimento técnico/físico, paginação e remoção de campos financeiros no executor.
- ESLint passou nos 16 arquivos JS/JSX alterados da funcionalidade. A configuração foi migrada para os presets flat do Next instalado; `npm run lint` agora chama `eslint src`, pois o comando antigo usava `next lint`.
- Sintaxe e exports: 16 arquivos, 103 imports locais resolvidos, nenhum erro.
- `npm.cmd run build`: **falhou com spawn EPERM**. Não há aprovação de build nem validação no navegador.

## Evidência HTTP real

O token antigo retornou 401. A credencial de teste da collection local autenticou com 200; nenhum token/senha foi salvo nos relatórios.

- [Consultas iniciais](evidence/phase7-readonly-2026-11-15.json): catálogo real com 11 capacidades, busca de técnicos, OS e manutenção com 200 na organização Admin Homolog Client.
- [Técnicos/preços/manutenção](evidence/phase7-technicians-maintenance-http-2026-11-15.json): fixture exclusiva, concluída com sucesso. Executor criado, replay com mesmo UID, corpo divergente 409, capabilities duplicadas 422; preços PUT/GET 200, custo 10001 + markup 12.34 produziu 11235 centavos, no-op preservou versão, custo negativo 422. Manutenção criada/replayada, condição bloqueante afetou só o ativo da fixture, PATCH agregou item, transições in_progress/completed retornaram 201 e replay da conclusão 200; condição resolvida tornou o ativo disponível; PATCH terminal retornou 409 maintenance_order_immutable.
- [Formato de OS existente](evidence/phase7-work-order-readonly-shape-2026-11-15.json): GET administrativo 200, somente leitura. Itens usam `uid`, snapshots financeiros por item e `technical_requirement_snapshot`; relatório conserva apenas tipos de campos, sem dados da OS consultada.

Cleanup confirmado no relatório: ativo da fixture excluído 204; executor desativado 200; prestadora inativada 200; manutenção concluída preservada como histórico. Não houve despacho, instalação ou retirada de dispositivos neste ensaio, nem alteração de OS preexistente ou vínculo de usuário.

Roteiro reproduzível: `frontend/scripts/technical-operations.http.mjs`, via `npm.cmd run test:technical-operations:http`. Exige OPS_API_URL, OPS_ORGANIZATION_UID, OPS_TOKEN e opcional OPS_REPORT_PATH. Cria fixtures próprias de técnico/preço/manutenção; não é uma bateria do ciclo físico de OS nem do portal executor.

### Nova execução com a conta informada pelo usuário

[Técnicos/preços/manutenção](evidence/phase7-authenticated-http-2026-11-15.json) passaram novamente, com a mesma limpeza operacional. Em seguida, a fixture desse ensaio foi reativada somente para testar [OS administrativa de instalação e retirada](evidence/phase7-work-orders-http-2026-11-15.json):

- Dispositivo exclusivo, com modelo real que dispensa SIM, preparado/liberado antes do despacho. Nenhum dispositivo preexistente foi movimentado.
- Duas OS: criação 201, replay 200 com mesmo UID e conflito de corpo 409. Dispatch/início/conclusão 200; snapshot install priced, remove unpriced. Ausência de preço na retirada não bloqueou a operação.
- Início sem recebimento retornou 409; confirmação da custódia permitiu iniciar.
- Conclusões retornaram completed=true; replay preservou UID/completed_at e corpo divergente retornou 409.
- Declaração de devolução e recebimento físico 200; a própria resposta de receive confirmou status=received, received_at e closed_at. A custódia fechada saiu da lista aberta.
- Cleanup: OS concluídas preservadas; devices inativados quando DELETE foi impedido por histórico, ativos excluídos, executor desativado e prestadora inativada.

A [conferência final de limpeza](evidence/phases6-7-final-cleanup-2026-11-15.json) confirmou zero custódias abertas das quatro OS das duas execuções.

O ensaio detectou e corrigiu uma falha do frontend: confirmar entrega ao técnico depende de `technician_received_at`, enquanto `received_at` identifica o recebimento físico administrativo. Um teste local de regressão cobre essa distinção.

As duas primeiras execuções do roteiro de OS registraram erros do próprio harness: consultar executor antes de reativar a prestadora e procurar custódia recebida na lista de abertas. Foram corrigidos no roteiro; não são falhas atribuídas ao backend. As evidências intermediárias foram preservadas, e o relatório final aprovado contém a resposta de recebimento com os timestamps de fechamento.

Roteiro: `npm.cmd run test:work-orders:http`, somente na organização de teste e com a fixture indicada no relatório de técnicos. O helper `homologation-session.mjs` usa TEST_API_URL/TEST_LOGIN_IDENTIFIER/TEST_LOGIN_PASSWORD ou a credencial de teste já presente na collection local; não grava senha/token em arquivo.

## Aceite ainda pendente

1. Build e navegador: abrir telas, validar formulários, erros, alterações de contexto, paginação e retentativas. A checagem de lint/imports não substitui execução da UI.
2. Ampliar a fixture administrativa para substituição, snapshot mixed, requisitos com testes obrigatórios fail/pass e conclusão parcial. Instalação/retirada, replay/conflito, snapshots priced/unpriced, confirmação, início, declaração e recebimento já passaram no ensaio posterior.
3. Conta Basic vinculada ao executor: isolamento de OS, ausência de preços na resposta real, replay após perda/restauração de acesso e negativas de scope/área. A proteção local da projeção não comprova a resposta do backend.
4. Confirmar o contrato HTTP de declaração de devolução pelo executor. Os arquivos disponíveis confirmam a declaração administrativa e a confirmação de recebimento self-service; não documentam o path/body de declaração self-service. Essa ação não foi inventada na tela do executor.
5. Validar os campos reais dos snapshots com requisitos/testes preenchidos e as negativas em outros perfis. A consulta read-only de OS confirmou a estrutura básica, com requisito nulo no item consultado.

A Fase 7 tem a implementação principal entregue e homologação administrativa de técnicos, preços, manutenção e OS de instalação/retirada. Os roteiros frontend contêm registros históricos contraditórios de SYS-OS-01/02; as novas evidências desta entrega não reabrem nem comprovam esses defeitos. Não estender a aprovação para portal Basic, outros perfis ou cenários ainda pendentes.
