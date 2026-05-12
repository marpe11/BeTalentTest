# BeTalentTest — QA Challenge

Repositório de testes para o desafio técnico de QA da BeTalent.

| Frente | Aplicação | Stack |
|---|---|---|
| UI Testing | [Sauce Demo](https://www.saucedemo.com) | Playwright + TypeScript |
| API Testing | [Restful-Booker](https://restful-booker.herokuapp.com) | Postman + Newman + k6 |
| Relatórios | UI + API unificados | Allure Report |

---

## Pré-requisitos

| Ferramenta | Versão mínima | Instalação |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| Java | 8+ | https://adoptium.net *(necessário para Allure)* |
| k6 | Qualquer | https://grafana.com/docs/k6/latest/set-up/install-k6/ |
| Git | Qualquer | https://git-scm.com |

---

## Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/marpe11/BeTalentTest.git
cd BeTalentTest

# 2. Instalar dependências Node (Playwright, Newman, Allure, axe-core…)
npm install

# 3. Instalar browsers do Playwright
npx playwright install chromium firefox
```

---

## Estrutura do Projeto

```
BeTalentTest/
├── playwright.config.ts          # Configuração multi-browser do Playwright
├── package.json                  # Dependências e scripts npm
├── tsconfig.json                 # Configuração TypeScript
│
├── ui/
│   ├── docs/
│   │   ├── test-plan.md          # Plano de testes UI
│   │   ├── test-cases.md         # Casos de teste documentados (40+)
│   │   ├── bug-analysis.md       # Bugs encontrados com severidade
│   │   ├── improvements.md       # Sugestões de melhoria da aplicação
│   │   └── risk-analysis.md      # Matriz de riscos
│   └── tests/
│       ├── data/
│       │   └── users.ts          # Credenciais dos 6 tipos de usuário
│       ├── fixtures/
│       │   └── auth.fixture.ts   # Fixture de login reutilizável entre specs
│       ├── helpers/
│       │   └── axe-helper.ts     # Wrapper axe-core para scans WCAG 2.1 AA
│       ├── pages/                # Page Object Model — 8 classes
│       │   ├── LoginPage.ts
│       │   ├── InventoryPage.ts
│       │   ├── ProductDetailPage.ts
│       │   ├── CartPage.ts
│       │   ├── CheckoutStepOnePage.ts
│       │   ├── CheckoutStepTwoPage.ts
│       │   ├── CheckoutCompletePage.ts
│       │   └── SidebarComponent.ts
│       └── specs/                # 8 arquivos de spec — 118 testes
│           ├── login.spec.ts          # 12 casos — todos os tipos de usuário
│           ├── logout.spec.ts         # 4 casos — sessão e redirecionamento
│           ├── inventory.spec.ts      # 13 casos — produtos, ordenação, carrinho
│           ├── cart.spec.ts           # 9 casos — itens, badge, navegação
│           ├── purchase-flow.spec.ts  # 11 casos — fluxo E2E (vídeo sempre gravado)
│           ├── navigation.spec.ts     # 10 casos — sidebar, links, acesso não autenticado
│           ├── responsiveness.spec.ts # 10 casos — Pixel 5 + iPhone 13
│           └── accessibility.spec.ts # 10 casos — WCAG 2.1 AA via axe-core
│
└── api/
    ├── docs/
    │   ├── test-scenarios.md     # 31 cenários de API documentados
    │   └── bug-analysis.md       # Bugs e quirks conhecidos da API
    ├── postman/
    │   ├── BeTalent_Booker.postman_collection.json   # 28 requests, 8 pastas
    │   └── BeTalent_Booker.postman_environment.json  # Variáveis de ambiente
    └── performance/
        ├── k6-smoke.js           # 1 VU, 1 min — verificação básica
        ├── k6-load.js            # ramp 10→50 VUs, 7 min — carga realista
        └── k6-stress.js          # ramp 50→200 VUs, 10 min — encontrar limite
```

---

## Executando os Testes

### UI — Playwright

```bash
# Todos os testes (chromium + firefox + mobile + acessibilidade)
npm run test:ui

# Por spec
npm run test:ui:login
npm run test:ui:logout
npm run test:ui:inventory
npm run test:ui:cart
npm run test:ui:purchase
npm run test:ui:navigation
npm run test:ui:mobile
npm run test:ui:a11y

# Modo headed (abre o browser visualmente)
npm run test:ui:headed

# Modo debug (pausa no primeiro erro)
npm run test:ui:debug
```

**Projetos configurados no Playwright:**

| Projeto | Device | Specs |
|---|---|---|
| chromium | Desktop Chrome | Todas exceto responsiveness e accessibility |
| firefox | Desktop Firefox | Todas exceto responsiveness e accessibility |
| mobile-chrome | Pixel 5 | responsiveness.spec.ts |
| mobile-safari | iPhone 13 | responsiveness.spec.ts |
| accessibility | Desktop Chrome | accessibility.spec.ts |

### API — Newman (Postman)

```bash
# Executa a collection completa e gera relatórios (htmlextra + Allure)
npm run test:api

# Relatório htmlextra gerado em: test-results/newman-report/report.html
```

> **Nota:** A Restful-Booker reseta a cada ~10 minutos. Se um teste falhar por ID não encontrado, re-execute.

**Pastas da collection:**

| Pasta | Requests | Descrição |
|---|---|---|
| Health Check | 1 | GET /ping |
| Autenticação | 3 | POST /auth — válido, inválido, campos ausentes |
| Listar Reservas | 4 | GET /booking — lista, filtros, ID específico, inexistente |
| Criar Reserva | 5 | POST /booking — campos completos, opcional, validações, bugs |
| Atualizar (PUT) | 3 | PUT /booking/:id — autenticado, sem auth, ID inválido |
| Atualizar Parcialmente (PATCH) | 3 | PATCH /booking/:id — campo único, datas, sem auth |
| Excluir Reserva | 4 | DELETE — autenticado, sem auth, ID inválido, verificação pós-delete |
| Segurança | 4 | SQL injection, XSS, header incorreto, input excessivo |

### Performance — k6

```bash
# Smoke test (1 VU, 1 min — sanidade rápida)
npm run test:perf:smoke

# Load test (ramp 10→50 VUs, 7 min — carga realista)
npm run test:perf:load

# Stress test (ramp 50→200 VUs, 10 min — encontrar ponto de ruptura)
npm run test:perf:stress

# Salvar resultado em JSON
k6 run api/performance/k6-load.js --out json=test-results/k6-results/load.json
```

**Thresholds por script:**

| Script | VUs | Duração | p95 | p99 | Erros |
|---|---|---|---|---|---|
| k6-smoke.js | 1 | 1 min | < 2s | — | < 1% |
| k6-load.js | 10→50 | 7 min | < 3s | < 5s | < 5% |
| k6-stress.js | 50→200 | 10 min | observação | — | — |

### Allure Report — Dashboard Unificado UI + API

> **Pré-requisito:** Java 8+ instalado. Verifique com `java -version`.

```bash
# Rodar tudo e abrir relatório Allure em um único comando
npm run test:all:allure

# Ou passo a passo
npm run test:ui          # gera allure-results/ com resultados Playwright
npm run test:api         # adiciona resultados da API em allure-results/
npm run allure:generate  # compila → allure-report/
npm run allure:open      # abre no browser
```

O Allure consolida Playwright + Newman em um único dashboard com:
- Visão geral de execução (passed / failed / broken / skipped)
- Histórico de execuções e gráfico de tendência entre runs
- Categorias de falha automáticas (produto vs. ambiente)
- Screenshots e vídeos embutidos clicáveis por teste
- Informações de ambiente (browser, baseURL, framework)

### Suite Completa (sem Allure)

```bash
npm run test:all
```

---

## Evidências

A pasta [`evidence/`](evidence/) contém capturas geradas durante execução real dos testes (2026-05-12):

**Screenshots (12 imagens):**
- Fluxo completo de compra — happy path e múltiplos itens
- Validações de formulário — credenciais inválidas, campos obrigatórios
- Bugs documentados — `locked_out_user`, `problem_user` (imagens erradas, campo bloqueado)
- Inventário — exibição dos 6 produtos, ordenações

**Vídeos (3 arquivos .webm):**
- `01-e2e-purchase-complete-chromium.webm` — fluxo E2E completo
- `02-bug-problem-user-lastname-chromium.webm` — bug crítico campo Last Name
- `03-checkout-math-subtotal-tax-chromium.webm` — verificação matemática do pedido

> Ao rodar os testes, o Playwright gera evidências adicionais automaticamente (screenshots em falha, vídeos do purchase-flow). Ver [`evidence/README.md`](evidence/README.md) para detalhes.

---

## Relatórios Disponíveis

| Relatório | Comando | Saída | Cobertura |
|---|---|---|---|
| **Allure** (unificado) | `npm run test:all:allure` | `allure-report/index.html` | UI + API |
| **Playwright HTML** | `npm run report` | `playwright-report/index.html` | UI |
| **Newman htmlextra** | `npm run test:api` | `test-results/newman-report/report.html` | API |

---

## Ferramentas e Justificativas

| Ferramenta | Uso | Justificativa |
|---|---|---|
| **Playwright** | Automação UI | Cross-browser nativo, suporte mobile, TypeScript, screenshot/vídeo built-in |
| **TypeScript** | Linguagem | Type safety reduz erros em page objects e fixtures |
| **axe-core** | Acessibilidade | Biblioteca mais completa para WCAG; integração nativa com Playwright |
| **Postman** | Collection API | Formato padrão de mercado; suporte a scripts de teste por request |
| **Newman** | Runner CLI | Executa collections Postman no terminal; reporters htmlextra e Allure |
| **k6** | Performance | Scripting em JS, thresholds automatizados, relatórios detalhados |
| **Allure Report** | Relatórios | Dashboard unificado UI + API com histórico, tendências e evidências embutidas |

---

## Usuários do Sauce Demo

Todos os usuários usam a senha `secret_sauce`.

| Usuário | Comportamento |
|---|---|
| `standard_user` | Fluxo normal — referência para todos os testes |
| `locked_out_user` | Bloqueado no login — erro documentado |
| `problem_user` | Imagens erradas; campo `Last Name` não editável no checkout |
| `performance_glitch_user` | Login com atraso de ~5s (timeout configurado: 60s) |
| `error_user` | Erros em ações diversas |
| `visual_user` | Inconsistências visuais na interface |

---

## Bugs Confirmados

### UI — Sauce Demo

| # | Usuário | Descrição | Severidade |
|---|---|---|---|
| UI-01 | `locked_out_user` | Login bloqueado sem possibilidade de recuperação | Alta |
| UI-02 | `problem_user` | Imagens dos produtos são exibidas incorretamente | Média |
| UI-03 | `problem_user` | Campo `Last Name` no checkout não aceita digitação | Crítica |
| UI-04 | `performance_glitch_user` | Login leva ~5s — degradação perceptível de UX | Média |
| UI-05 | `visual_user` | Inconsistências visuais em botões e layout | Baixa |

### API — Restful-Booker

| # | Endpoint | Comportamento Observado | Esperado |
|---|---|---|---|
| API-01 | `POST /booking` sem campo obrigatório | Retorna **500** | 400 Bad Request |
| API-02 | `POST /booking` com `checkout < checkin` | Aceita sem erro | 422 Unprocessable Entity |
| API-03 | `POST /booking` com `totalprice` negativo | Aceita sem erro | 400 Bad Request |
| API-04 | `PUT /booking/999999` (ID inexistente) | Retorna **405** | 404 Not Found |
| API-05 | `DELETE /booking/:id` autenticado | Retorna **201** | 204 No Content |
| API-06 | Auth via `Authorization: Bearer` | Retorna 403 | Quirk documentado — usar `Cookie: token=<value>` |

---

## Resultados — Última Execução (2026-05-12)

### UI — Playwright

| Projeto | Testes | Passaram | Falharam |
|---|---|---|---|
| chromium | 78 | 78 | 0 |
| firefox | 40 | 40 | 0 |
| **Total** | **118** | **118** | **0** |

### API — Newman

| Métrica | Resultado |
|---|---|
| Requests executados | 28 |
| Assertions verificadas | 50 |
| Falhas | **0** |
| Duração total | 6,9s |
| Tempo médio de resposta | 164ms |
| Min / Max | 135ms / 639ms |

---

## Premissas

- O Sauce Demo possui **bugs intencionais** — comportamentos de `problem_user`, `locked_out_user` e `performance_glitch_user` são documentados, não bloqueantes.
- A Restful-Booker é API pública de testes que **reseta a cada ~10 minutos**. Os testes criam e limpam seus próprios dados dentro da execução.
- Autenticação na Restful-Booker requer `Cookie: token=<value>` — não `Authorization: Bearer`.
- Testes de acessibilidade seguem WCAG 2.1 nível AA via axe-core.

---

## Cobertura

### UI — Sauce Demo

#### Nível 1 — Obrigatório

- ✅ Login com todos os tipos de usuário (6 perfis)
- ✅ Logout e proteção de rotas autenticadas
- ✅ Ordenação de produtos (A-Z, Z-A, preço crescente, decrescente)
- ✅ Adição e remoção de itens do carrinho
- ✅ Fluxo completo de compra E2E com verificação de math (subtotal + tax = total)
- ✅ Navegação entre páginas e sidebar

#### Nível 2 — Diferencial

- ✅ Responsividade em dispositivos móveis (Pixel 5 + iPhone 13)
- ✅ Acessibilidade WCAG 2.1 AA via axe-core (7 páginas escaneadas)
- ✅ Multi-browser: chromium + firefox
- ✅ Documentação completa: plano de testes, casos, bugs, melhorias, riscos

---

### API — Restful-Booker

#### Nível 1 — Obrigatório

- ✅ Autenticação (token válido, credenciais inválidas, campos ausentes)
- ✅ CRUD completo de reservas (GET, POST, PUT, PATCH, DELETE)
- ✅ Filtros por nome e datas no GET /booking
- ✅ Validação de campos obrigatórios e cenários de erro documentados

#### Nível 2 — Diferencial

- ✅ Testes de segurança (SQL injection via query param, XSS no body, header de auth incorreto)
- ✅ Testes de performance com k6 (smoke, load e stress)
- ✅ Documentação de bugs e quirks da API (7 itens)
- ✅ Relatório unificado UI + API via Allure Report
