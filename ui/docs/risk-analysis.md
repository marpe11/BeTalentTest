# Análise de Riscos — UI Testing (Sauce Demo)

| ID | Risco | Probabilidade | Impacto | Severidade | Mitigação |
|---|---|---|---|---|---|
| R01 | Instabilidade da aplicação Sauce Demo (serviço fora do ar) | Baixa | Alto | Médio | Retry automático; documentar se persistir |
| R02 | Mudanças de seletores CSS entre versões | Média | Alto | Alto | Uso de `data-test` attributes; POM centraliza locators |
| R03 | Flakiness em performance_glitch_user (timeout) | Alta | Médio | Médio | timeout configurado para 60s; retry em CI |
| R04 | Bugs intencionais de problem_user bloqueiam fluxo | Alta | Alto | Alto | Testes específicos documentam os bugs como comportamento esperado |
| R05 | Falhas de acessibilidade em componentes terceiros | Média | Médio | Médio | Escopo limitado à aplicação; violações documentadas |
| R06 | Variação de comportamento entre browsers (chromium vs firefox) | Média | Médio | Médio | Testes executados em ambos; divergências registradas |
| R07 | Elementos não visíveis em viewport mobile específica | Média | Baixo | Baixo | Viewports padrão Playwright (Pixel 5, iPhone 13) |
| R08 | Dependência de rede para acesso à URL pública | Baixa | Alto | Médio | Sem mitigação técnica; conexão estável necessária |
| R09 | Estado do carrinho contaminado entre testes | Média | Alto | Alto | Reset via `resetAppState()` ou autenticação nova por contexto |
| R10 | Evidências de screenshot/vídeo com dados sensíveis | Baixa | Baixo | Baixo | Aplicação usa dados fictícios; sem dados reais |

## Legenda
- **Probabilidade:** Baixa / Média / Alta
- **Impacto:** Baixo / Médio / Alto
- **Severidade:** Baixo (Probabilidade × Impacto)
