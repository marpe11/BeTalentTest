# Análise de Bugs e Quirks — Restful-Booker API

## BUG-API-001 — DELETE retorna 201 em vez de 204
| Campo | Detalhe |
|---|---|
| **Severidade** | Médio |
| **Endpoint** | DELETE /booking/{id} |
| **Status** | Aberto (comportamento intencional da API de teste) |

**Descrição:** Ao excluir uma reserva com autenticação válida, a API retorna HTTP 201 Created — um código de status semanticamente incorreto para operações de deleção.

**Resultado esperado:** HTTP 204 No Content (padrão REST) ou HTTP 200 OK com body de confirmação.
**Resultado obtido:** HTTP 201 Created (normalmente usado para criação de recursos).
**Impacto:** Clientes que validam estritamente o código de status podem interpretar erroneamente que um recurso foi criado.

---

## BUG-API-002 — Token deve ser enviado como Cookie, não Authorization Bearer
| Campo | Detalhe |
|---|---|
| **Severidade** | Alto |
| **Endpoints** | PUT, PATCH, DELETE /booking/{id} |
| **Status** | Aberto |

**Descrição:** A documentação da API não deixa claro que o token de autenticação deve ser enviado exclusivamente no header `Cookie: token=<value>`. Tentativas de usar `Authorization: Bearer <token>` retornam 403 Forbidden.

**Resultado esperado:** API aceitar autenticação via header `Authorization: Bearer` (padrão OAuth2/JWT) ou documentar claramente o método correto.
**Resultado obtido:** Somente `Cookie: token=<value>` é aceito. Bearer token retorna 403.
**Impacto:** Alto risco de integração incorreta; comportamento não-padrão dificulta a adoção.

---

## BUG-API-003 — Campos obrigatórios ausentes retornam 500 em vez de 400
| Campo | Detalhe |
|---|---|
| **Severidade** | Alto |
| **Endpoint** | POST /booking |
| **Status** | Aberto |

**Descrição:** Ao criar uma reserva sem campos obrigatórios (ex: `firstname`, `totalprice`, `bookingdates`), a API retorna HTTP 500 Internal Server Error em vez de HTTP 400 Bad Request com mensagem descritiva do erro de validação.

**Resultado esperado:** HTTP 400 com body `{"error": "firstname is required"}`.
**Resultado obtido:** HTTP 500 sem body informativo.
**Impacto:** Dificulta o debugging; expõe erros internos do servidor; não segue RFC 7807 (Problem Details).

---

## BUG-API-004 — API aceita datas de checkout anteriores ao checkin
| Campo | Detalhe |
|---|---|
| **Severidade** | Médio |
| **Endpoint** | POST /booking, PUT /booking/{id} |
| **Status** | Aberto |

**Descrição:** A API aceita criar reservas onde `checkout` é anterior a `checkin` (ex: checkin 2025-12-31, checkout 2025-01-01).

**Resultado esperado:** HTTP 400 — datas logicamente inválidas devem ser rejeitadas.
**Resultado obtido:** HTTP 200 — reserva criada com datas incoerentes.
**Impacto:** Dados inconsistentes no sistema; reservas impossíveis do ponto de vista de negócio.

---

## BUG-API-005 — API aceita totalprice negativo
| Campo | Detalhe |
|---|---|
| **Severidade** | Médio |
| **Endpoint** | POST /booking, PUT /booking/{id} |
| **Status** | Aberto |

**Descrição:** Reservas com `totalprice` negativo (ex: -99) são aceitas sem validação.

**Resultado esperado:** HTTP 400 — preço deve ser um número positivo.
**Resultado obtido:** HTTP 200 — reserva criada com preço negativo.
**Impacto:** Valores incoerentes na base de dados; potencial para abuso em sistemas com integração financeira.

---

## BUG-API-006 — PUT com ID inexistente retorna 405 em vez de 404
| Campo | Detalhe |
|---|---|
| **Severidade** | Baixo |
| **Endpoint** | PUT /booking/{id} |
| **Status** | Aberto |

**Descrição:** Ao tentar atualizar (PUT) uma reserva com um ID que não existe (ex: 999999), a API retorna HTTP 405 Method Not Allowed.

**Resultado esperado:** HTTP 404 Not Found.
**Resultado obtido:** HTTP 405 Method Not Allowed (semântica incorreta — o método é permitido, o recurso é que não existe).
**Impacto:** Código de status enganoso para clientes da API.

---

## QUIRK-API-007 — Reset automático a cada 10 minutos
| Campo | Detalhe |
|---|---|
| **Severidade** | Informativo |
| **Escopo** | Toda a API |

**Descrição:** A Restful-Booker reseta seu estado a cada ~10 minutos, voltando ao conjunto inicial de 10 reservas pré-carregadas. Reservas criadas durante os testes são perdidas após o reset.

**Impacto nos testes:** Testes dependentes de reservas previamente criadas devem recriar os dados ou ser executados dentro da janela de 10 minutos. A collection Postman foi estruturada para ser auto-suficiente (cria → usa → deleta dentro da mesma execução).
