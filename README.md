# BeTalentTest — QA Challenge

Repositório de testes para o desafio técnico de QA da BeTalent, cobrindo:
- **UI Testing:** Sauce Demo (https://www.saucedemo.com) — Playwright + TypeScript
- **API Testing:** Restful-Booker (https://restful-booker.herokuapp.com) — Postman + Newman + k6

---

## Pré-requisitos

| Ferramenta | Versão mínima | Instalação |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| k6 | Qualquer | https://grafana.com/docs/k6/latest/set-up/install-k6/ |
| Git | Qualquer | https://git-scm.com |

---

## Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/marpe11/BeTalentTest.git
cd BeTalentTest

# 2. Instalar dependências Node
npm install

# 3. Instalar browsers do Playwright
npx playwright install chromium firefox
```

---

## Executando os Testes

### UI — Playwright

```bash
# Todos os testes (chromium + firefox + mobile + acessibilidade)
npm run test:ui

# Apenas um arquivo específico
npm run test:ui:login
npm run test:ui:cart
npm run test:ui:purchase
npm run test:ui:mobile
npm run test:ui:a11y

# Modo headed (abre o browser visualmente)
npm run test:ui:headed

# Modo debug (pausa no primeiro erro)
npm run test:ui:debug

# Ver relatório HTML após execução
npm run report
```

### API — Newman (Postman)

```bash
# Executar toda a collection e gerar relatório HTML
npm run test:api

# Relatório gerado em: test-results/newman-report/report.html
```

> **Nota:** A Restful-Booker reseta a cada ~10 minutos. Se algum teste falhar por ID não encontrado, re-execute.

### Performance — k6

```bash
# Smoke test (1 VU, 1 min — verificação básica)
npm run test:perf:smoke

# Load test (até 50 VUs, 7 min — carga realista)
npm run test:perf:load

# Stress test (até 200 VUs, 10 min — encontrar limite)
npm run test:perf:stress

# Salvar resultado em JSON
k6 run api/performance/k6-load.js --out json=test-results/k6-results/load.json
```

### Suite Completa

```bash
npm run test:all
```

---

## Estrutura do Projeto

```
BeTalentTest/
├── playwright.config.ts          # Configuração do Playwright
├── package.json                  # Dependências e scripts
├── tsconfig.json                 # Configuração TypeScript
│
├── ui/
│   ├── docs/
│   │   ├── test-plan.md          # Plano de testes
│   │   ├── test-cases.md         # Casos de teste manuais
│   │   ├── bug-analysis.md       # Bugs encontrados
│   │   ├── improvements.md       # Sugestões de melhoria
│   │   └── risk-analysis.md      # Matriz de riscos
│   └── tests/
│       ├── data/users.ts         # Credenciais dos usuários
│       ├── fixtures/             # Auth fixture (login reutilizável)
│       ├── helpers/              # axe-core wrapper
│       ├── pages/                # Page Object Model (8 classes)
│       └── specs/                # 8 arquivos de spec
│           ├── login.spec.ts
│           ├── logout.spec.ts
│           ├── inventory.spec.ts
│           ├── cart.spec.ts
│           ├── purchase-flow.spec.ts
│           ├── navigation.spec.ts
│           ├── responsiveness.spec.ts  # mobile-chrome, mobile-safari
│           └── accessibility.spec.ts  # WCAG 2.1 AA via axe-core
│
└── api/
    ├── docs/
    │   ├── test-scenarios.md     # Todos os cenários de API
    │   └── bug-analysis.md       # Bugs e quirks da API
    ├── postman/
    │   ├── BeTalent_Booker.postman_collection.json
    │   └── BeTalent_Booker.postman_environment.json
    └── performance/
        ├── k6-smoke.js           # 1 VU, 1 min
        ├── k6-load.js            # ramp 10→50 VUs, 7 min
        └── k6-stress.js          # ramp 50→200 VUs, 10 min
```

---

## Ferramentas e Justificativas

| Ferramenta | Uso | Justificativa |
|---|---|---|
| **Playwright** | Automação UI | Cross-browser nativo, suporte mobile, TypeScript, screenshot/vídeo built-in |
| **TypeScript** | Linguagem | Type safety reduz erros; ótima DX com Playwright |
| **axe-core** | Acessibilidade | Biblioteca mais completa para WCAG; integração nativa com Playwright |
| **Postman** | Collection API | Formato padrão da indústria; suporte a scripts de teste |
| **Newman** | Runner CLI | Executa collections Postman via linha de comando; reporter HTML |
| **k6** | Performance | Scripting em JS, relatórios detalhados, thresholds automatizados |

---

## Premissas

- A aplicação Sauce Demo é uma plataforma de demonstração com **bugs intencionais** para fins de teste. Os bugs de `problem_user`, `locked_out_user` e `performance_glitch_user` são comportamentos esperados da plataforma e estão documentados em `ui/docs/bug-analysis.md`.
- A Restful-Booker é uma API pública de testes que **reseta a cada ~10 minutos**. Testes de API foram estruturados para criar e limpar seus próprios dados.
- A autenticação na Restful-Booker requer o token no header `Cookie: token=<value>` — não em `Authorization: Bearer`.
- Testes de acessibilidade baseiam-se no WCAG 2.1 nível AA. Violações encontradas estão registradas nos resultados do axe-core.

---

## Evidências

- **Screenshots:** Capturados automaticamente em falhas (configuração `screenshot: 'only-on-failure'`)
- **Vídeos:** Retidos em falhas + sempre gravados no fluxo de compra completo (`purchase-flow.spec.ts`)
- **Relatório UI:** `npx playwright show-report test-results/playwright-report` após execução
- **Relatório API:** `test-results/newman-report/report.html`

---

## Cobertura

### Nível 1 (Obrigatório) — 100% coberto
- ✅ Login com diferentes tipos de usuário
- ✅ Ordenação e filtragem de produtos
- ✅ Fluxo completo de compra
- ✅ Remoção de itens do carrinho
- ✅ Navegação entre páginas
- ✅ Logout
- ✅ Autenticação básica na API
- ✅ CRUD de reservas
- ✅ Validação de campos obrigatórios

### Nível 2 (Diferencial) — 100% coberto
- ✅ Testes de responsividade (Pixel 5 + iPhone 13)
- ✅ Testes de acessibilidade (WCAG 2.1 AA via axe-core)
- ✅ Testes automatizados UI (Playwright)
- ✅ Testes de performance (k6: smoke, load, stress)
- ✅ Testes de segurança (SQL injection, XSS, headers incorretos)
- ✅ Automação via Newman
