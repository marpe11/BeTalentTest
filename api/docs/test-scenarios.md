# Cenários de Teste — Restful-Booker API

**Base URL:** https://restful-booker.herokuapp.com
**Autenticação:** `POST /auth` → token enviado como `Cookie: token=<value>`
**Reset automático:** A cada ~10 minutos

---

## 1. Health Check

| ID | Cenário | Método | Endpoint | Input | Status Esperado | Asserções |
|---|---|---|---|---|---|---|
| TC-API-001 | API está disponível | GET | /ping | — | 201 | Body contém "Created" |

---

## 2. Autenticação

| ID | Cenário | Método | Endpoint | Input | Status Esperado | Asserções |
|---|---|---|---|---|---|---|
| TC-API-002 | Autenticação com credenciais válidas | POST | /auth | `{username:"admin", password:"password123"}` | 200 | Body contém `token`; token salvo em variável de ambiente |
| TC-API-003 | Autenticação com senha inválida | POST | /auth | `{username:"admin", password:"errada"}` | 200 | Body contém `reason: "Bad credentials"` |
| TC-API-004 | Autenticação sem corpo | POST | /auth | `{}` | 200 | Não retorna token válido |

---

## 3. Listar Reservas

| ID | Cenário | Método | Endpoint | Input | Status Esperado | Asserções |
|---|---|---|---|---|---|---|
| TC-API-005 | Listar todas as reservas | GET | /booking | — | 200 | Array de objetos `{bookingid: number}` |
| TC-API-006 | Filtrar por firstname | GET | /booking | `?firstname=Jim` | 200 | Array (pode ser vazio); IDs numéricos |
| TC-API-007 | Filtrar por datas de estadia | GET | /booking | `?checkin=2024-01-01&checkout=2025-12-31` | 200 | Array de IDs |
| TC-API-008 | Buscar reserva por ID válido | GET | /booking/{id} | ID existente | 200 | Todos os campos obrigatórios presentes |
| TC-API-009 | Buscar reserva por ID inexistente | GET | /booking/999999 | — | 404 | — |

---

## 4. Criar Reserva

| ID | Cenário | Método | Endpoint | Input | Status Esperado | Asserções |
|---|---|---|---|---|---|---|
| TC-API-010 | Criar reserva com todos os campos | POST | /booking | Objeto completo com additionalneeds | 200 | `bookingid` presente; dados correspondem ao enviado |
| TC-API-011 | Criar reserva sem additionalneeds (opcional) | POST | /booking | Objeto sem additionalneeds | 200 | `bookingid` presente |
| TC-API-012 | Criar reserva sem firstname [BUG] | POST | /booking | Objeto sem firstname | 400 (esperado) / 500 (atual) | Retorna erro |
| TC-API-013 | Criar reserva sem totalprice [BUG] | POST | /booking | Objeto sem totalprice | 400 (esperado) / 500 (atual) | Retorna erro |
| TC-API-014 | Criar reserva sem bookingdates [BUG] | POST | /booking | Objeto sem bookingdates | 400 (esperado) / 500 (atual) | Retorna erro |
| TC-API-015 | Checkout anterior ao checkin [BUG] | POST | /booking | checkin: 2025-12-31, checkout: 2025-01-01 | 400 (esperado) / 200 (atual — bug) | Documenta aceitação indevida |
| TC-API-016 | Preço negativo [BUG] | POST | /booking | totalprice: -99 | 400 (esperado) / 200 (atual — bug) | Documenta aceitação indevida |

---

## 5. Atualização Completa (PUT)

| ID | Cenário | Método | Endpoint | Input | Status Esperado | Asserções |
|---|---|---|---|---|---|---|
| TC-API-017 | Atualização completa autenticada | PUT | /booking/{id} | Objeto completo + Cookie | 200 | Dados atualizados retornados |
| TC-API-018 | PUT sem autenticação | PUT | /booking/{id} | Objeto completo, sem Cookie | 403 | — |
| TC-API-019 | PUT com Authorization Bearer [QUIRK] | PUT | /booking/{id} | Bearer token em vez de Cookie | 403 | Documenta que Bearer não é aceito |
| TC-API-020 | PUT com ID inexistente [BUG] | PUT | /booking/999999 | Objeto completo + Cookie | 404 (esperado) / 405 (atual — bug) | Retorna erro |

---

## 6. Atualização Parcial (PATCH)

| ID | Cenário | Método | Endpoint | Input | Status Esperado | Asserções |
|---|---|---|---|---|---|---|
| TC-API-021 | PATCH de campo único | PATCH | /booking/{id} | `{firstname: "Novo"}` + Cookie | 200 | Campo atualizado; demais campos inalterados |
| TC-API-022 | PATCH de bookingdates | PATCH | /booking/{id} | `{bookingdates: {...}}` + Cookie | 200 | Datas atualizadas |
| TC-API-023 | PATCH sem autenticação | PATCH | /booking/{id} | `{firstname: "X"}`, sem Cookie | 403 | — |

---

## 7. Excluir Reserva (DELETE)

| ID | Cenário | Método | Endpoint | Input | Status Esperado | Asserções |
|---|---|---|---|---|---|---|
| TC-API-024 | DELETE autenticado [QUIRK: retorna 201] | DELETE | /booking/{id} | Cookie | 201 (quirk: não 204) | Recurso removido |
| TC-API-025 | GET após DELETE | GET | /booking/{id} | — | 404 | Confirma deleção |
| TC-API-026 | DELETE sem autenticação | DELETE | /booking/{id} | Sem Cookie | 403 | — |
| TC-API-027 | DELETE de ID inexistente | DELETE | /booking/999999 | Cookie | 404 ou 405 | Não retorna 200 |

---

## 8. Segurança

| ID | Cenário | Método | Endpoint | Input | Status Esperado | Asserções |
|---|---|---|---|---|---|---|
| TC-API-028 | SQL Injection no parâmetro ID | GET | /booking/1' OR '1'='1 | — | 400/404/405 | Não expõe dados da base |
| TC-API-029 | XSS no campo firstname | POST | /booking | firstname com `<script>` | Não 500 | Payload não executa no contexto da API |
| TC-API-030 | Authorization Bearer recusado | PUT | /booking/{id} | `Authorization: Bearer <token>` | 403 | Documenta quirk de segurança |
| TC-API-031 | Query param excessivamente longo | GET | /booking | firstname com 300 caracteres | Não 500 | API resiliente a input excessivo |
