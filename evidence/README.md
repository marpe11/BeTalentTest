# Evidências de Teste

Capturas geradas durante execução real dos testes em **2026-05-12** — Chromium, resolução Desktop.

---

## Screenshots

| Arquivo | Cenário | Tipo |
|---|---|---|
| `01-purchase-complete-happy-path.png` | Fluxo completo de compra — confirmação final | Happy path |
| `02-purchase-complete-multiple-items.png` | Compra com múltiplos itens — confirmação | Happy path |
| `03-checkout-order-summary-math.png` | Resumo do pedido — verificação subtotal + tax = total | Validação |
| `04-bug-locked-out-user.png` | locked_out_user — mensagem de bloqueio | Bug BUG-001 |
| `05-login-empty-credentials-error.png` | Credenciais em branco — mensagem de erro | Validação |
| `06-login-wrong-password-error.png` | Senha incorreta — mensagem de erro | Validação |
| `07-bug-problem-user-wrong-images.png` | problem_user — imagens de produtos incorretas | Bug BUG-002 |
| `08-bug-problem-user-lastname-not-editable.png` | problem_user — campo Last Name bloqueado | Bug BUG-003 |
| `09-inventory-6-products.png` | Página de inventário com 6 produtos | Happy path |
| `10-inventory-sort-az.png` | Ordenação por nome A→Z aplicada | Happy path |
| `11-inventory-sort-price-low-high.png` | Ordenação por preço crescente aplicada | Happy path |
| `12-cart-badge-after-add.png` | Badge do carrinho incrementado após adicionar item | Happy path |

---

## Vídeos

| Arquivo | Cenário | Duração aprox. |
|---|---|---|
| `01-e2e-purchase-complete-chromium.webm` | Fluxo completo E2E — login → adicionar item → checkout → confirmação | ~15s |
| `02-bug-problem-user-lastname-chromium.webm` | Bug crítico — problem_user não consegue digitar no campo Last Name | ~12s |
| `03-checkout-math-subtotal-tax-chromium.webm` | Verificação matemática do pedido (6 itens) — subtotal + tax = total | ~20s |

> Para reproduzir os vídeos `.webm`, use qualquer browser moderno ou VLC.

---

## Evidências Adicionais Geradas em Tempo de Execução

Ao rodar `npm run test:ui` ou `npm run test:all:allure`, o Playwright gera automaticamente:
- **Screenshots** de testes com falha (em `test-results/`)
- **Vídeos** de todos os testes do `purchase-flow.spec.ts` (em `test-results/`)
- **Relatório Allure** interativo com screenshots e vídeos embutidos por teste (em `allure-report/`)
- **Relatório Playwright HTML** (em `playwright-report/`)
