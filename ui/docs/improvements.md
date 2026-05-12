# Sugestões de Melhorias — Sauce Demo

## UX e Funcionalidade

### 1. Mensagens de Erro Mais Descritivas no Login
**Situação atual:** Mensagem genérica "Username and password do not match any user in this service."
**Sugestão:** Manter a segurança (não revelar qual campo está errado), mas adicionar link para "Esqueceu sua senha?" e limitar tentativas com lockout progressivo.

### 2. Feedback Visual de Carregamento
**Situação atual:** Nenhum indicador visual durante o login lento do `performance_glitch_user`.
**Sugestão:** Adicionar spinner/loading state durante operações assíncronas para evitar duplo-clique acidental.

### 3. Confirmação antes de Remover Item do Carrinho
**Situação atual:** Item é removido imediatamente ao clicar em "Remove".
**Sugestão:** Adicionar Toast com opção de desfazer (undo) por 3 segundos, evitando remoção acidental.

### 4. Filtro por Categoria de Produto
**Situação atual:** Apenas ordenação por nome e preço disponíveis.
**Sugestão:** Adicionar filtros por categoria (camisetas, acessórios, etc.) para melhor navegabilidade.

### 5. Persistência do Carrinho em Recarregamento
**Situação atual:** Itens no carrinho são perdidos se o localStorage for limpo.
**Sugestão:** Sincronizar estado do carrinho com sessão do servidor.

## Acessibilidade

### 6. Labels ARIA nos Botões de Ação
**Situação atual:** Botão "Add to cart" não tem `aria-label` descritivo com o nome do produto.
**Sugestão:** `aria-label="Adicionar Sauce Labs Backpack ao carrinho"` para leitores de tela.

### 7. Gestão de Foco ao Abrir/Fechar Sidebar
**Situação atual:** Foco não é capturado dentro do menu ao abrir.
**Sugestão:** Implementar focus trap no menu lateral (padrão WAI-ARIA Dialog).

### 8. Skip Navigation Link
**Situação atual:** Ausente.
**Sugestão:** Adicionar link "Pular para o conteúdo principal" no topo da página.

## Segurança

### 9. Timeout de Sessão
**Situação atual:** Sessão nunca expira enquanto o browser está aberto.
**Sugestão:** Implementar timeout de inatividade de 30 minutos.

### 10. HTTPS e Headers de Segurança
**Situação atual:** Faltam headers como `Content-Security-Policy`, `X-Frame-Options`.
**Sugestão:** Configurar security headers padrão de mercado.

## Performance

### 11. Otimização de Imagens
**Situação atual:** Imagens carregadas em tamanho original sem lazy loading.
**Sugestão:** Implementar lazy loading e servir imagens em formato WebP com srcset responsivo.
