# Plano de Testes — Sauce Demo

## Objetivo
Validar a qualidade funcional, de usabilidade, acessibilidade e responsividade da plataforma de e-commerce Sauce Demo (https://www.saucedemo.com), garantindo que os fluxos críticos de negócio operem corretamente para todos os perfis de usuário.

## Escopo

### In Scope
- Autenticação (login e logout) para todos os 6 tipos de usuário
- Gerenciamento de produtos: listagem, ordenação, detalhe
- Gerenciamento do carrinho: adicionar, remover, persistência
- Fluxo completo de compra (checkout end-to-end)
- Navegação entre páginas e uso do menu lateral
- Responsividade em dispositivos móveis (iOS e Android)
- Acessibilidade conforme WCAG 2.1 nível AA

### Out of Scope
- Backend e infraestrutura da aplicação
- Processamento real de pagamentos
- Integrações com sistemas externos
- Testes de carga sobre a UI

## Tipos de Teste
| Tipo | Ferramenta | Cobertura |
|---|---|---|
| Funcional automatizado | Playwright + TypeScript | Todos os cenários do Nível 1 |
| Responsividade | Playwright (mobile viewports) | Pixel 5 e iPhone 13 |
| Acessibilidade | axe-core + Playwright | WCAG 2.1 AA em todas as páginas |
| Regressão | Playwright (CI-ready) | Smoke em chromium + firefox |

## Ambiente de Teste
- **Browsers:** Chromium (Desktop Chrome), Firefox
- **Mobile:** Pixel 5 (393×851), iPhone 13 (390×844)
- **Sistema Operacional:** Windows 11
- **Node.js:** v22.x
- **URL base:** https://www.saucedemo.com

## Usuários de Teste
| Usuário | Senha | Propósito |
|---|---|---|
| standard_user | secret_sauce | Baseline — fluxo feliz |
| locked_out_user | secret_sauce | Teste de bloqueio de acesso |
| problem_user | secret_sauce | Descoberta de bugs intencionais |
| performance_glitch_user | secret_sauce | Teste de performance / lentidão |
| error_user | secret_sauce | Teste de tratamento de erros |
| visual_user | secret_sauce | Teste de regressão visual |

## Critérios de Entrada
- Ambiente de testes disponível e acessível
- Dependências instaladas (`npm install`, `npx playwright install`)
- Repositório clonado localmente

## Critérios de Saída
- 100% dos casos de Nível 1 executados
- Taxa de aprovação ≥ 90% nos cenários funcionais (exceto bugs documentados intencionais)
- Bugs encontrados documentados em `bug-analysis.md`
- Relatório HTML gerado

## Riscos
Ver `risk-analysis.md` para matriz completa.

## Referências
- https://www.saucedemo.com
- https://playwright.dev
