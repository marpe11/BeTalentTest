# Casos de Teste — Sauce Demo

## TC-AUTH: Autenticação

| ID | Título | Pré-condição | Passos | Resultado Esperado | Prioridade |
|---|---|---|---|---|---|
| TC-AUTH-01 | Login bem-sucedido com standard_user | Aplicação acessível | 1. Acessar https://www.saucedemo.com<br>2. Inserir standard_user / secret_sauce<br>3. Clicar em Login | Redirecionado para /inventory.html | Alta |
| TC-AUTH-02 | Login bloqueado com locked_out_user | Aplicação acessível | 1. Inserir locked_out_user / secret_sauce<br>2. Clicar em Login | Mensagem de erro: "Sorry, this user has been locked out" | Alta |
| TC-AUTH-03 | Login com problem_user acessa inventário | Aplicação acessível | 1. Inserir problem_user / secret_sauce<br>2. Clicar em Login | Acessa /inventory.html (com bugs nas imagens) | Alta |
| TC-AUTH-04 | Login com performance_glitch_user apresenta atraso | Aplicação acessível | 1. Inserir performance_glitch_user / secret_sauce<br>2. Clicar em Login<br>3. Aguardar | Redireciona após 5–8s | Média |
| TC-AUTH-05 | Campos em branco exibem erro | Aplicação acessível | 1. Clicar em Login sem preencher | "Username is required" | Alta |
| TC-AUTH-06 | Apenas senha preenchida exibe erro | Aplicação acessível | 1. Preencher só senha<br>2. Clicar em Login | "Username is required" | Alta |
| TC-AUTH-07 | Apenas username exibe erro de senha | Aplicação acessível | 1. Preencher só username<br>2. Clicar em Login | "Password is required" | Alta |
| TC-AUTH-08 | Senha errada exibe erro de credenciais | Aplicação acessível | 1. Inserir username válido e senha errada | "Username and password do not match" | Alta |
| TC-AUTH-09 | Fechar erro com botão X | Erro visível | 1. Clicar no X da mensagem de erro | Erro desaparece | Média |

## TC-PROD: Produtos e Inventário

| ID | Título | Pré-condição | Passos | Resultado Esperado | Prioridade |
|---|---|---|---|---|---|
| TC-PROD-01 | Inventário exibe 6 produtos | Logado como standard_user | Observar página de inventário | 6 itens com nome, preço, imagem e descrição | Alta |
| TC-PROD-02 | Ordenar por Name A-Z | Logado | Selecionar "Name (A to Z)" no dropdown | Produtos em ordem alfabética crescente | Alta |
| TC-PROD-03 | Ordenar por Name Z-A | Logado | Selecionar "Name (Z to A)" | Produtos em ordem alfabética decrescente | Alta |
| TC-PROD-04 | Ordenar por Price Low-High | Logado | Selecionar "Price (low to high)" | Preços em ordem crescente | Alta |
| TC-PROD-05 | Ordenar por Price High-Low | Logado | Selecionar "Price (high to low)" | Preços em ordem decrescente | Alta |
| TC-PROD-06 | Clicar no nome navega ao detalhe | Logado | Clicar no nome de um produto | Abre página de detalhe com informações do produto | Média |
| TC-PROD-07 | Clicar na imagem navega ao detalhe | Logado | Clicar na imagem de um produto | Abre página de detalhe | Média |
| TC-PROD-08 | Botão voltar retorna ao inventário | Na página de detalhe | Clicar em "Back to products" | Retorna a /inventory.html | Média |
| TC-PROD-09 | BUG: Imagens incorretas para problem_user | Logado como problem_user | Observar listagem de produtos | FALHA ESPERADA: todos os produtos exibem a mesma imagem incorreta | Alta |

## TC-CART: Carrinho

| ID | Título | Pré-condição | Passos | Resultado Esperado | Prioridade |
|---|---|---|---|---|---|
| TC-CART-01 | Carrinho vazio após login | Logado | Acessar /cart.html | Nenhum item listado | Alta |
| TC-CART-02 | Adicionar item ao carrinho | Logado | Clicar em "Add to cart" em qualquer produto | Badge mostra "1"; item aparece no carrinho | Alta |
| TC-CART-03 | Remover item do inventário | Item no carrinho | Clicar em "Remove" no inventário | Badge decrementado; botão volta a "Add to cart" | Alta |
| TC-CART-04 | Remover item do carrinho | Item no carrinho | Ir a /cart.html; clicar em "Remove" | Item removido da lista | Alta |
| TC-CART-05 | Persistência de itens | Items adicionados | Navegar para outras páginas e voltar | Items ainda presentes no carrinho | Média |
| TC-CART-06 | Continue Shopping | Na página do carrinho | Clicar em "Continue Shopping" | Retorna a /inventory.html | Média |
| TC-CART-07 | Badge desaparece com carrinho vazio | 1 item no carrinho | Remover o item | Badge não aparece mais | Alta |

## TC-CHECKOUT: Processo de Compra

| ID | Título | Pré-condição | Passos | Resultado Esperado | Prioridade |
|---|---|---|---|---|---|
| TC-CHK-01 | Fluxo completo de compra | Item no carrinho | Checkout → preencher dados → Finish | Página de confirmação exibida | Alta |
| TC-CHK-02 | Verificar cálculo de totais | Múltiplos itens no carrinho | Observar Step 2 | Total = subtotal + tax | Alta |
| TC-CHK-03 | Erro ao omitir First Name | Na tela de checkout Step 1 | Deixar first name vazio → Continue | "First Name is required" | Alta |
| TC-CHK-04 | Erro ao omitir Last Name | Na tela de checkout Step 1 | Deixar last name vazio → Continue | "Last Name is required" | Alta |
| TC-CHK-05 | Erro ao omitir Zip Code | Na tela de checkout Step 1 | Deixar zip vazio → Continue | "Postal Code is required" | Alta |
| TC-CHK-06 | Cancelar no Step 1 volta ao carrinho | Em checkout Step 1 | Clicar em Cancel | Retorna a /cart.html | Média |
| TC-CHK-07 | Cancelar no Step 2 volta ao inventário | Em checkout Step 2 | Clicar em Cancel | Retorna a /inventory.html | Média |
| TC-CHK-08 | Back Home após compra | Compra finalizada | Clicar em "Back Home" | Retorna a /inventory.html | Média |
| TC-CHK-09 | BUG: problem_user não preenche lastname | Logado como problem_user, em checkout Step 1 | Tentar digitar no campo Last Name | FALHA ESPERADA: campo não aceita entrada | Alta |

## TC-NAV: Navegação

| ID | Título | Pré-condição | Passos | Resultado Esperado | Prioridade |
|---|---|---|---|---|---|
| TC-NAV-01 | Sidebar abre e fecha | Logado | Clicar no ☰ → observar → clicar no X | Menu abre e fecha corretamente | Média |
| TC-NAV-02 | Link All Items | Sidebar aberta | Clicar em "All Items" | Navega para /inventory.html | Média |
| TC-NAV-03 | Reset App State limpa carrinho | Items no carrinho | Sidebar → Reset App State | Carrinho esvaziado | Média |
| TC-NAV-04 | Acesso não autenticado redirecionado | Sem login | Tentar acessar /inventory.html | Redirecionado para / | Alta |
| TC-NAV-05 | Logout via sidebar | Logado | Sidebar → Logout | Redirecionado para /, sessão encerrada | Alta |
| TC-NAV-06 | Após logout, voltar não acessa inventário | Pós-logout | Pressionar botão voltar do browser | Permanece na tela de login | Alta |
