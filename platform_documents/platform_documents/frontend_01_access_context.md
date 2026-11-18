# Frontend — tópico 01: sessão, áreas e contexto organizacional

## INT-01 — sessão pending_mfa e promoção homologadas

O email autorizado pelo operador já estava associado e verificado no Basic; não foi duplicado nem transferido. Preferência pessoal de MFA foi temporariamente habilitada pela API. Login retornou 202 `pending_mfa`; Status 200 com `authenticated=false`; as três rotas INT-01 retornaram 401, sem contexto de negócio. O operador forneceu o código recebido; confirmação retornou 200 e promoveu a mesma sessão para active. O mesmo Bearer acessou Status e três rotas INT-01 com 200. Preferência original `require_mfa=false` foi restaurada por PUT e conferida por GET; política organizacional permaneceu false. Código e Bearers não foram gravados na evidência.

Evidência: [pending MFA e confirmação](evidence/2026-10-21-int01-pending-mfa-http.json). Isso encerra a dependência do teste pending_mfa neste cenário; o teste não cobre todos os erros de código, expiração ou perda do fator. Persistem limites de falha técnica isolada e escala/concorrência. Não declarar essas verificações executadas.


## INT-01 — acesso financeiro separado do operacional; limite de MFA

Fixture nova `int01.financial.0207`, perfil Secondary, foi criada pela API com scope somente sobre a Power. A senha foi inicializada com `cmd/password-init`. Durante habilitação temporária: seletor 200, contexto Power 200, contexto e GET administrativo do consumidor Automega 404 `organization_not_found`, GET de Billing Entry do consumidor 200. Isso comprova leitura financeira consolidada sem converter membership em contexto operacional no cenário executado. Não foram criados ou alterados lançamentos nem memberships. Conta desativada ao final. Evidência: [financeiro sem operação](evidence/2026-10-21-int01-financial-only-http.json).

A fixture temporal foi reabilitada somente para verificar MFA exigido na organização descartável: login com senha válida e email não verificado retornou 422 `mfa_verified_email_required`. A política original foi reenviada com sucesso e a conta desativada novamente. Evidência: [pré-condição MFA](evidence/2026-10-21-int01-mfa-precondition.json). A geração de sessão pending_mfa não foi homologada: falta uma fixture isolada com email verificado por fluxo real. Não marcar verificação diretamente em SQL nem extrair OTP para fabricar evidência HTTP.

**Parecer acumulado:** positivos de leitura nos quatro perfis, negativas de autenticação/cross-tenant, gates versus operações no-op, paginação pequena, revogação pelo PUT completo, block/warn e separação financeira executados. Pendentes: pending_mfa contra as três rotas, falha técnica por injeção controlada, escala superior a 100 organizações/concorrência. Nenhuma interrupção de infraestrutura compartilhada foi feita. A regressão SQL permanece evidência reportada pelo operador.

### Alinhamento necessário para concluir MFA

Disponibilizar uma conta de teste isolada com email cujo acesso ao fluxo de confirmação seja autorizado, verificar o contato pela API, habilitar MFA e conferir: login 202, Status pendente não autenticado, três endpoints INT-01 retornando 401 sem dados, confirmação válida e novo acesso autorizado. Registrar restauração e desativação. Falha técnica requer ambiente/fixture de falha isolada; não derrubar PostgreSQL ou Redis compartilhados para completar a matriz.


## INT-01 — horário block/warn homologado em fixture isolada

Após revisão do programador, a invalidação após PUT completo de usuário foi aceita como contrato existente e documentada; nenhum backend foi alterado pelo tester. Prosseguiu-se com teste temporal em conta nova `int01.temporal.0207` na organização descartável 0203, sem email de entrega e sem modificar contas compartilhadas. Cadastro pela API retornou 201; senha foi inicializada por `cmd/password-init`, sem reset de senha existente. A conta foi habilitada temporariamente e desativada ao final.

Dez GETs com o mesmo Bearer foram observados: em `block` com semana vazia, Status 200, contexto global 200 com `area_access.status=not_evaluated`, `reason=outside_access_period`; seletor, contexto organizacional e perfil retornaram 403. Em `warn`, os cinco GETs retornaram 200 e o contexto global voltou a `evaluated`. A janela foi aplicada somente à organização descartável. O payload original mode/timezone/week foi restaurado pela API e comparado com o GET final: preservado. A conta permanece desativada como fixture identificada. Auditoria, autoria e sessões decorrentes dos testes permanecem como histórico legítimo.

Evidência: [2026-10-21-int01-temporal-http.json](evidence/2026-10-21-int01-temporal-http.json). O teste comprova gate temporal e consulta mínima durante bloqueio; não comprova MFA, falha técnica, grant somente financeiro ou todas as bordas de calendário/tolerância. Não reaplicar migrations por esse teste.

### Consequência para React

Não converter `not_evaluated` e `areas={}` em uma lista confirmada de áreas negadas. Apresentar aviso de restrição temporal e suspender consultas protegidas. No modo warn, permitir navegação autorizada e exibir aviso conforme o período retornado. Estado autenticado fora de horário não é equivalente a revogação; em 401 `relogin_required`, reconstruir a sessão e os contextos após novo login.


## INT-01 — PUT de scope invalida a sessão anterior

O Secondary recebeu temporariamente um scope adicional para a fixture 0203, autenticou-se e obteve contexto 200. Ao restaurar os scopes pelo PUT completo, `/v1/users/status` com o Bearer anterior retornou 401, `state=revoked`, `relogin_required=true`. Após novo login, o contexto retirado retornou 404 e o original 200. Os campos administráveis foram restaurados.

O comportamento decorre do caminho atual: `users.admin_save()` atualiza campos que fazem o trigger `version_sessions` incrementar `session_version`; a validação compara essa versão com a armazenada na sessão. Assim, o PUT de scopes invalida o Bearer anterior como efeito do PUT completo. O teste não verificou `revoked_at` na linha da sessão. **Contrato para o cliente:** após qualquer `PUT /v1/admin/users/{uid}`, descarte a sessão anterior do usuário-alvo e exija novo login; a nova sessão usa os scopes vigentes. Não alterar o backend para manter o token anterior. Evidência HTTP: [revogação de scope](evidence/2026-10-21-int01-live-scope-revocation.json). MFA, bloqueio temporal e acesso somente financeiro permanecem sem homologação completa.


## Estado e objetivo

Contrato INT-01 implementado na 0207. Operador informou regressão SQL sem erro e `ROLLBACK`. Testes HTTP cobrem quatro perfis, paginação, validação, negativas, comparação dos gates com operações e o efeito de revogação da sessão após PUT de scope. Isso não é homologação integral de temporalidade, MFA nem de todos os caminhos de alteração de autorização.

## Conceitos obrigatórios

- Primary (`primary_admin`) é diferente de Administrator (`administrator`).
- Perfil pessoal não contém permissões de negócio.
- `area_access.areas` indica o gate de área, não escrita nem acesso irrestrito a registros.
- Organização selecionada é contexto do frontend; não muda a identidade da sessão.
- Scopes delimitam dados; área abre uma classe de operações; os endpoints verificam as duas dimensões conforme o domínio.
- Membership financeiro não concede administração operacional.
- Autoria e owner não devem ser usados como atalhos de autorização.
- Ações administrativas e dados sensíveis não são liberados só porque um registro apareceu na lista.

## Sequência das telas

1. Após autenticação ativa, consultar `/v1/users/status` para estado da sessão. Login com MFA pendente é outro estado; não iniciar consultas de negócio.
2. Consultar `/v1/users/me/access-context`. Usar `session` para estado atual e `area_access` para sinais de navegação. Se `status=not_evaluated`, não interpretar mapa vazio como permissões confirmadas.
3. Quando permitido pelo horário, consultar `/v1/users/me/organizations?limit=50`. Os itens contêm `uid`, `code`, `name`. Preservar `q` entre páginas e usar `next_after_uid` quando `has_more=true`.
4. Selecionar uma organização explicitamente. Chave de cache deve incluir sessão/usuário e organização. Não confundir organização da sessão com organização alvo.
5. Consultar `/v1/users/me/organizations/{uid}/access-context` para os quatro gates administrativos. Gate `allowed` não garante payload válido nem sucesso da operação.
6. Carregar recursos por seus próprios endpoints e filtros obrigatórios de organização. Não carregar catálogos globais de assets para descobrir permissões.
7. Reconsultar contexto ao foco/troca de organização e após erro de autorização. Cancelar requests antigos e ignorar respostas de seleção anterior.

## Rotas e campos

| Consulta | Uso |
|---|---|
| `GET /v1/users/me/access-context` | `session`, `area_access.status`, `area_access.reason`, mapa `area_access.areas` |
| `GET /v1/users/me/organizations?limit=50&after_uid=UUID&q=texto` | Seletor operacional: `items`, `has_more`, `next_after_uid` |
| `GET /v1/users/me/organizations/{uid}/access-context` | `organization.code_name_update`, `organization.reseller_enabled_update`, `session_policy.read`, `session_policy.update` |

As três rotas exigem Bearer e usam `Cache-Control: no-store`. A primeira pode informar bloqueio de horário sem liberar dados de negócio; as outras impõem período. Não há revision geral, push de ACL, capabilities por asset ou ancestrais contextuais.

Paginação: default 50, máximo 100, UID crescente, sem total e sem snapshot entre páginas. Inclusão com UID anterior ao cursor exige reiniciar a lista. Parâmetros repetidos/desconhecidos ou inválidos retornam 422 `invalid_organization_query`. Não enviar os filtros da listagem administrativa neste seletor.

## Tratamento de resposta

- 401: sessão ausente/inválida ou pendente de MFA; distinguir fluxo pelo status, sem loop de login automático.
- 403 temporal: mostrar restrição e não confundir com sessão revogada.
- 404 `organization_not_found` no contexto: alvo inexistente ou oculto; remover seleção/dados locais sem revelar existência.
- 422 `invalid_organization_uid` ou `invalid_organization_query`: corrigir a requisição.
- 503: falha técnica; não gravar como permissão negada.
- A rota real de política de sessão oculta negação em **404 `resource_not_found`**; edição de organização negada retorna **403 `organization_not_allowed`**. Não generalizar códigos entre domínios.

## Exemplo React/TypeScript — organização selecionada

Exemplo de integração, não aplicação executada em navegador. `token` deve vir do controlador de sessão; não contém credencial fixa. O componente deve ser montado somente após sessão ativa.

```tsx
import { useEffect, useState } from 'react';

type Gates = {
  uid_organization: string;
  organization: {
    code_name_update: 'allowed' | 'denied';
    reseller_enabled_update: 'allowed' | 'denied';
  };
  session_policy: { read: 'allowed' | 'denied'; update: 'allowed' | 'denied' };
};

export function OrganizationAccess({ baseUrl, token, organizationUid }: {
  baseUrl: string; token: string; organizationUid: string;
}) {
  const [state, setState] = useState<{
    key: string; gates?: Gates; error?: number;
  } | null>(null);
  const key = `${token}:${organizationUid}`; // chave em memória; nunca registrar

  useEffect(() => {
    const controller = new AbortController();
    let current = true;
    setState(null);
    async function load() {
      try {
        const response = await fetch(
          `${baseUrl}/v1/users/me/organizations/${encodeURIComponent(organizationUid)}/access-context`,
          { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
            signal: controller.signal }
        );
        if (!response.ok) {
          if (current) setState({ key, error: response.status });
          return;
        }
        const gates: Gates = await response.json();
        if (current) setState({ key, gates });
      } catch (error) {
        if (current && !controller.signal.aborted) setState({ key, error: 0 });
      }
    }
    void load();
    return () => { current = false; controller.abort(); };
  }, [baseUrl, token, organizationUid, key]);

  // Nem por um frame reutilizar gates de outra sessão/organização.
  if (!state || state.key !== key) return <p>Carregando acesso...</p>;
  if (state.error !== undefined) return <p>Acesso indisponível ({state.error}).</p>;
  return <button disabled={state.gates?.organization.code_name_update !== 'allowed'}>
    Editar nome/código
  </button>;
}
```

O controlador real deve tratar 401/403/404 conforme as regras acima e tratar erros do PUT mesmo com botão habilitado. Escolha de armazenamento da sessão, CORS/proxy e cliente SSE serão detalhados no tópico de autenticação. A disponibilidade HTTP foi testada por cliente direto; o exemplo React ainda não foi compilado nem homologado em navegador.

## Evidência por perfil — equivalência dos gates

Na organização Empresa Teste, quatro operações por perfil foram exercitadas: PUT código/nome com os mesmos valores, PUT de revenda com o valor existente, GET de política e PUT de política com os valores existentes.

| Perfil | Nome/código PUT | Revenda PUT | Política GET | Política PUT |
|---|---|---|---|---|
| Primary | 200 | 200 | 200 | 200 |
| Administrator | 200 | 403 | 200 | 200 |
| Secondary | 403 | 403 | 200 | 200 |
| Basic | 403 | 403 | 404 | 404 |

Os 16 resultados são coerentes com os gates. Os campos code, name, reseller_enabled, plano e moeda foram comparados antes/depois e preservados; allow_concurrent_sessions e require_mfa também foram preservados. PUTs podem atualizar autoria/datas/auditoria conforme o domínio: não se afirma ausência de efeitos internos. O teste não comprova alterações de valores diferentes, todas as transições, nem todas as organizações.

Ver [evidência das operações](evidence/2026-10-21-int01-gate-operations-http.json), [controle geral](frontend_integration_status.md), [Primary](evidence/2026-10-21-int01-primary-http-active.json), [Basic/Secondary](evidence/2026-10-21-int01-basic-secondary-http.json) e [Administrator](evidence/2026-10-21-int01-administrator-http.json).

## Pendências antes de aprovação integral

Outros caminhos de revogação de autorização; bloqueio temporal block/warn; sessão pending MFA; outros cenários financeiros não cobertos pela fixture; falha técnica; mais de 100 organizações e concorrência de paginação. Cada teste precisa de fixture identificada e restauração, sem alterar perfis globais ou interromper infraestrutura compartilhada.
