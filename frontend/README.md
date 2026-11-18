# Navisoft — Frontend

Painel administrativo construído em Next.js (App Router) sobre o template SmartAdmin v5.6.0,
integrando com a API Navisoft documentada em `platform_documents/` (sessão/MFA, entidades, frota,
devices/SIM, geografia, técnicos e ordens de serviço técnica).

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A rota raiz redireciona para o login.

> O dev/build usam `next dev --webpack` / `next build --webpack`. O pipeline Sass do template
> (`bootstrap` + `@import "variables-dark"`) quebra sob o Turbopack padrão do Next 16 nesta
> combinação de versões; webpack resolve sem alterar o CSS do tema.

## Modo mock vs. backend real

Controlado por `.env.local`:

```
NEXT_PUBLIC_API_MODE=mock   # ou "real"
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Em `mock` (padrão, backend Navisoft indisponível no momento), toda a camada `src/lib/api/mock/*`
simula os contratos HTTP documentados (status codes, idempotência, paginação por cursor, gates)
inteiramente no navegador — sem rede. Contas de demonstração aparecem na própria tela de login.

Para apontar para a API real, defina `NEXT_PUBLIC_API_MODE=real` e a `NEXT_PUBLIC_API_BASE_URL`
correta. As funções em `src/lib/api/endpoints/*.js` já chamam os caminhos REST documentados —
confirme-os contra `platform_documents/*.md` antes de homologar, pois alguns (ex.: edição de
organização/política de sessão) foram inferidos por convenção onde o texto não detalhava a rota
exata.

## Estrutura

- `src/lib/api/` — cliente HTTP real + mocks + camada de endpoints por domínio.
- `src/lib/session/` — `SessionProvider` (login, MFA, contexto de acesso, organização selecionada).
- `src/components/admin/` — primitivas reutilizadas pelos módulos (tabela com paginação por
  cursor, drawer de formulário, diálogo de confirmação, badges de status, guarda de autenticação).
- `src/app/auth/` — login, MFA, esqueci senha, redefinição de senha.
- `src/app/(admin)/` — módulos operacionais: `entidades`, `frota`, `devices-sim`, `geografia`,
  `tecnicos`, `ordens-servico`, além de `account/security` e as páginas de demonstração originais
  do template.

## Escopo

Cobre os fluxos descritos em `platform_documents/frontend_01..08`. Itens explicitamente fora do
escopo nos próprios documentos (CRUD completo de unidades, portal do executor, polígonos
complexos, concorrência, etc.) não foram implementados — ver as seções "Limites" de cada tópico.
