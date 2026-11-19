# Navisoft — Frontend

Painel administrativo em Next.js com autenticação e MFA, seleção de organização e módulos integrados à API Navisoft.

## Uso local

Use Node.js 22 e execute em `frontend/`.

```bash
npm ci
npm run dev
```

Copie `.env.example` para `.env.local` se precisar configurar outra base. Em desenvolvimento e no servidor Next.js, use `NEXT_PUBLIC_API_BASE_URL=/api/navisoft` e indique o destino da API em `NAVISOFT_API_URL`. O proxy encaminha as chamadas na mesma origem. Mantenha credenciais fora das variáveis públicas.

Abra [localhost:3000](http://localhost:3000), entre com sua conta e selecione uma organização para consultar os módulos operacionais. O painel **Visão geral** mostra contagens da organização informada na API. **Operações** resume ordens de serviço, manutenções e agenda. **Financeiro** usa as contas acessíveis pela sessão e funciona sem selecionar uma organização. Um zero indica total zero retornado pela API. Um traço indica que a resposta veio sem total.

Os dados de negócio vêm da API real em todos os ambientes. Para navegar pelas páginas demonstrativas do SmartAdmin durante o desenvolvimento, use `NEXT_PUBLIC_ENABLE_TEMPLATE_DEMOS=1`. A produção oculta o menu demonstrativo e redireciona as rotas demonstrativas.

## Produção

### Servidor Next.js

```bash
npm run build
npm start
```

Configure o mesmo proxy usado no desenvolvimento. O build usa Webpack para o Sass do tema.

### GitHub Pages

Em **Settings → Pages**, escolha **GitHub Actions** como fonte. Em **Settings → Secrets and variables → Actions → Variables**, configure `NAVISOFT_API_BASE_URL` com a URL HTTPS da API ou de um proxy com CORS habilitado.

O workflow define `NEXT_STATIC_EXPORT=1`, `PAGES_BASE_PATH` e `NEXT_PUBLIC_API_BASE_URL`, gera `frontend/out` e publica o artefato. O servidor que atende a API deve permitir preflights e requisições da origem do Pages com os cabeçalhos usados pelos fluxos, incluindo `Authorization`, `Content-Type`, `Idempotency-Key`, `X-File-Name` e `X-Revision-Summary`. A publicação estática exige a URL HTTPS porque o proxy Next.js depende de um servidor. [Workflow de publicação](../.github/workflows/deploy.yml)

## Verificação

- `npm run test:dashboard` valida os agregados e seus filtros de organização, a navegação por área e as mensagens dos estados HTTP.
- Rode os scripts de teste de `package.json` por módulo para verificar contratos com HTTP simulado.
- `npm run test:homologation:read` verifica consultas na API real. Configure `TEST_API_URL`, `TEST_API_TOKEN` e `TEST_API_ORGANIZATION_UID` para o ambiente de homologação. `TEST_HEALTH_TOKEN` habilita a consulta detalhada de saúde. `TEST_API_REPORT_PATH` grava as evidências com status, códigos e identificadores de requisição. O roteiro não cria registros de negócio.
- Os roteiros de mutação por módulo requerem sessão e organização descartável de homologação. Consulte os casos aprovados e as pendências antes de executar. [Checklist e evidências](../task.md)
