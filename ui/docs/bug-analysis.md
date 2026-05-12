# Análise de Bugs — Sauce Demo

> Evidências visuais disponíveis em [`evidence/screenshots/`](../../evidence/screenshots/) e [`evidence/videos/`](../../evidence/videos/).

## BUG-001 — Campo Lastname Não Editável (problem_user)
| Campo | Detalhe |
|---|---|
| **Severidade** | Crítico |
| **Usuário afetado** | problem_user |
| **Página** | Checkout Step 1 (/checkout-step-one.html) |
| **Status** | Aberto (comportamento intencional da aplicação de teste) |

**Passos para reproduzir:**
1. Fazer login com `problem_user` / `secret_sauce`
2. Adicionar qualquer produto ao carrinho
3. Navegar ao carrinho e clicar em "Checkout"
4. Tentar preencher o campo "Last Name"

**Resultado esperado:** Campo aceita digitação normalmente.
**Resultado obtido:** Campo não aceita nenhuma entrada — `input.value` permanece vazio após digitação.
**Impacto:** Impossibilidade de finalizar a compra com este usuário.
**Evidência:** [`evidence/screenshots/08-bug-problem-user-lastname-not-editable.png`](../../evidence/screenshots/08-bug-problem-user-lastname-not-editable.png) · [`evidence/videos/02-bug-problem-user-lastname-chromium.webm`](../../evidence/videos/02-bug-problem-user-lastname-chromium.webm)

---

## BUG-002 — Imagens de Produtos Incorretas (problem_user)
| Campo | Detalhe |
|---|---|
| **Severidade** | Alto |
| **Usuário afetado** | problem_user |
| **Página** | Inventário (/inventory.html) |
| **Status** | Aberto |

**Passos para reproduzir:**
1. Fazer login com `problem_user`
2. Observar as imagens dos produtos na listagem

**Resultado esperado:** Cada produto exibe sua imagem correspondente (6 imagens distintas).
**Resultado obtido:** Todos os produtos exibem a mesma imagem (um cachorro/animal de estimação).
**Impacto:** Experiência do usuário confusa; impossível identificar produtos visualmente.
**Evidência:** [`evidence/screenshots/07-bug-problem-user-wrong-images.png`](../../evidence/screenshots/07-bug-problem-user-wrong-images.png)

---

## BUG-003 — Login com Atraso Significativo (performance_glitch_user)
| Campo | Detalhe |
|---|---|
| **Severidade** | Alto |
| **Usuário afetado** | performance_glitch_user |
| **Página** | Login → Inventário |
| **Status** | Aberto |

**Passos para reproduzir:**
1. Acessar https://www.saucedemo.com
2. Fazer login com `performance_glitch_user` / `secret_sauce`

**Resultado esperado:** Redirecionamento para `/inventory.html` em < 3 segundos.
**Resultado obtido:** Redirecionamento ocorre após 5–8 segundos de delay artificial.
**Impacto:** Alta degradação de UX; pode ser confundido com falha e provocar resubmissão.

---

## BUG-004 — Usuário Bloqueado Sem Instruções de Recuperação (locked_out_user)
| Campo | Detalhe |
|---|---|
| **Severidade** | Médio |
| **Usuário afetado** | locked_out_user |
| **Página** | Login |
| **Status** | Aberto |

**Passos para reproduzir:**
1. Tentar login com `locked_out_user`

**Resultado esperado:** Mensagem de bloqueio com instruções de contato ou recuperação de conta.
**Resultado obtido:** Mensagem "Sorry, this user has been locked out." sem qualquer orientação adicional.
**Impacto:** Usuário sem caminho de resolução; potencial abandono da plataforma.
**Evidência:** [`evidence/screenshots/04-bug-locked-out-user.png`](../../evidence/screenshots/04-bug-locked-out-user.png)

---

## BUG-005 — Botão "Remove" com Comportamento Inconsistente (error_user)
| Campo | Detalhe |
|---|---|
| **Severidade** | Médio |
| **Usuário afetado** | error_user |
| **Página** | Inventário (/inventory.html) |
| **Status** | Aberto |

**Passos para reproduzir:**
1. Fazer login com `error_user`
2. Adicionar produto ao carrinho
3. Clicar em "Remove"

**Resultado esperado:** Item removido do carrinho, badge decrementado.
**Resultado obtido:** Em alguns produtos, o botão não executa a ação de remoção corretamente.
**Impacto:** Usuário não consegue gerenciar o carrinho de forma confiável.
