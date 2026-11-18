# Frontend — tópico 02: credenciais, MFA e recuperação

## INT-02 — recuperação positiva aprovada; restauração de senha bloqueada

Operador recebeu o email real e forneceu o link de recovery. Validate retornou 200 com política de senha e prazo, sem identidade; complete com senha nova de homologação retornou 204 sem corpo. Bearer anterior retornou 401 `revoked` em Status e 401 no contexto. Revalidação e segundo complete do token consumido retornaram 422 `recovery_token_invalid_or_expired`. Login com a senha nova retornou 200.

A tentativa autorizada de restaurar a senha anterior usando `cmd/password-init -recover` foi rejeitada com `password_recently_used` (exit 1). Não houve bypass do histórico nem alteração SQL. A senha do Basic permanece a nova usada no recovery e seu login foi conferido 200 após a falha de restauração. Credencial e token não são gravados neste documento ou evidência. **Pendência operacional aberta:** alinhar com operador/programador se manter senha nova ou prover procedimento de homologação específico, sem enfraquecer a política geral. Não declarar restauração concluída.

Evidência: [recuperação positiva](evidence/2026-10-21-int02-recovery-positive-http.json). Recuperação funcional e uso único passaram; restauração é bloqueio separado. O navegador ainda não foi homologado, e isso não entrega fluxo de convite/primeira senha nem cadastro público.


## Escopo e estado

Login e MFA positivo foram executados por HTTP: sessão pendente 202, rejeição das rotas INT-01, promoção 200 com mesmo token/sessão e preferência pessoal restaurada. Sete casos negativos/ineligíveis de recovery também passaram. Recuperação positiva completa, primeira senha pelo navegador e cadastro público não estão homologados por este tópico.

## Telas e sequência

1. Login: `POST /v1/users/login` com identifier/password e application opcional. Organização não é escolhida no login. Em 200 guardar sessão ativa; em 202 apresentar MFA sem liberar consultas de negócio.
2. MFA: enviar `POST /v1/users/login/challenge` com o Bearer pendente e `{code}`. Sucesso 200 promove a mesma sessão e conserva o Bearer; refazer Status e contexto. Não registrar código/token em logs.
3. Segurança pessoal: `GET/PUT /v1/users/security`, PUT `{require_mfa:boolean}`. Exigência efetiva combina preferência e política organizacional. Não oferecer remoção da exigência organizacional pelo usuário.
4. Esqueci minha senha: `POST /v1/users/password-recovery/request` com `{identifier,country?}`. A resposta 202 accepted não comprova existência, elegibilidade, dispatch ou recebimento; mostrar texto neutro.
5. Página de recovery: ler token do fragmento `#token=...`, removê-lo da barra com history.replaceState e mantê-lo em memória. Não colocá-lo em query, logs ou analytics.
6. Consultar `POST /v1/users/password-recovery/validate` com `{token}`. A resposta válida contém valid_until e password_policy; orientar os campos pelas regras recebidas.
7. Enviar `POST /v1/users/password-recovery/complete` com token, new_password e password_confirmation. Sucesso 204 não contém JSON; descartar contexto autenticado e solicitar novo login. Recovery não remove MFA.
8. Sessão inválida/revogada: não tentar refresh inexistente; tratar relogin e reconstruir contexto depois de autenticar.

## Pré-condições e limites

O recovery atual não substitui convite: exige conta habilitada, senha inicializada e email verificado, além das configurações de segurança. Usuário CRUD sem senha ainda usa password-init operacional; o administrador provisionado segue outro caminho de geração de credencial/notificação. Não expor CLI como recurso de um formulário público. Fluxo de convite/cadastro público depende de alinhamento próprio.

Contato é globalmente único. Não transferir email entre usuários para preparar MFA. A verificação de email usa request autenticado e confirmação por link com challenge/token; o login MFA usa código. Não confundir as duas provas.

## Resultados HTTP observados — recovery

| Caso | HTTP e resposta |
|---|---|
| Request sem identifier | 400 invalid_request |
| Request com campo extra email | 400 invalid_request |
| Identificador inexistente | 202 accepted=true |
| Conta fixture desativada | 202 accepted=true |
| Validate sem token | 422 recovery_token_invalid_or_expired |
| Validate com token inválido de tamanho aceito | 422 recovery_token_invalid_or_expired |
| Complete vazio | 422 invalid_password_recovery_request |

Não houve troca de senha nem uso de token válido nessa bateria. Evidência em [recovery negativo](evidence/2026-10-21-int02-recovery-negative-http.json); MFA em [confirmação real](evidence/2026-10-21-int01-pending-mfa-http.json).

## React — consumo de token de recovery

Exemplo de trecho para página específica de recuperação, não compilado ou homologado em navegador nesta entrega. Não executar este código em todas as páginas da aplicação.

```tsx
// Executar uma vez no bootstrap da página, antes de montar o formulário.
const fragment = new URLSearchParams(window.location.hash.slice(1));
const recoveryToken = fragment.get('token');
window.history.replaceState(
  null, '', window.location.pathname + window.location.search
);
// Passar recoveryToken em memória ao formulário. Não persistir nem registrar.

async function validateRecovery(baseUrl: string, token: string) {
  const response = await fetch(`${baseUrl}/v1/users/password-recovery/validate`, {
    method: 'POST', cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!response.ok) throw new Error(`recovery_validation_${response.status}`);
  return response.json();
}
```

O formulário real deve tratar token ausente/inválido, prazo, validações retornadas, falha de rede, duplo clique, senha/confirmacão diferentes e resposta 204 sem parse JSON. Não confundir erro técnico com prova inválida. Acesso navegador depende de mesma origem/proxy ou CORS aprovado; testes diretos não comprovam CORS.

## Continuidade

Para completar o recovery positivo: solicitar recuperação autorizada, receber link pelo canal real, validar política, trocar senha de conta de teste para valor novo aprovado, verificar revogação e uso único, depois restaurar credencial pelo procedimento autorizado respeitando histórico. Não substituir essa prova por extração de token do banco. Planejamento e homologação desse fluxo devem preservar a conta e a possibilidade de acesso do operador.
