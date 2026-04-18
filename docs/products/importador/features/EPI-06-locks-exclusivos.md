# EPI-06 — Locks Exclusivos por Recurso

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/locks.py`, `app/services/locks.py`, `frontend/src/hooks/useLock.ts`, migration `migrations/20260227_create_resource_locks.sql` |

## Jornada

Quando o operador abre um edital para correcao, o frontend chama `POST /locks/acquire` com `edital_id` e `kind`. O backend insere uma linha em `resource_locks` com `resource_key = <MM_YYYY>/<kind>/<edital_id>`, `lock_token` (UUID), `expires_at = now + LOCK_TTL_SECONDS` (1800s default) e identificacao do dono (`owner_user_id`, `owner_email`). Um indice unico parcial `WHERE released_at IS NULL` garante exclusividade. O hook `useLock` do frontend faz heartbeat automatico a cada 45s via `POST /locks/heartbeat` para renovar `expires_at`. Se outro operador tentar abrir o mesmo recurso, recebe HTTP 409 com o dono atual e expiracao. Ao sair, o frontend chama `POST /locks/release` com `reason` (`manual`, `completed`, `abandon`). Se o heartbeat falhar 3 vezes consecutivas (cerca de 2 min), o hook notifica o operador e libera o lock.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Concorrencia controlada por lock | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-06-01 | Como operador, quero adquirir lock exclusivo ao abrir um edital para impedir edicao concorrente. |
| US-06-02 | Como operador, quero ver quem esta editando um edital ja bloqueado (email + expiracao). |
| US-06-03 | Como sistema, quero renovar lock automaticamente a cada 45s enquanto o operador estiver ativo. |
| US-06-04 | Como operador, quero liberar lock ao sair do edital (`manual`, `completed`, `abandon`). |
| US-06-05 | Como sistema, quero expirar locks automaticamente apos `LOCK_HEARTBEAT_GRACE_SECONDS` sem heartbeat. |
| US-06-06 | Como operador, quero listar todos os meus locks ativos. |
| US-06-07 | Como operador, quero consultar status de lock de multiplos editais em uma unica chamada (batch). |

## Cenarios de aceitacao do produto

- **`POST /locks/acquire`**: body `{edital_id, kind}`; retorna `lock_token`, `expires_at`, `resource_key`. HTTP 409 se ja bloqueado com `{locked_by, expires_at}`.
- **`POST /locks/heartbeat`**: body `{resource_key, lock_token}`; renova `heartbeat_at` e `expires_at`. HTTP 403 se nao for o dono, HTTP 404 se lock expirou.
- **`POST /locks/release`**: body `{resource_key, lock_token, reason?}`; marca `released_at = now()` e grava motivo.
- **Heartbeat 45s**: `useLock` no frontend usa `setInterval(45_000)`; 3 falhas consecutivas disparam `onHeartbeatFailed`.
- **Grace period**: lock expira 120s apos ultimo heartbeat (`LOCK_HEARTBEAT_GRACE_SECONDS`).
- **Indice unico parcial**: Postgres impede duas linhas ativas para mesma `resource_key` (`WHERE released_at IS NULL`).
- **`GET /locks/me`**: lista locks ativos do usuario autenticado.
- **`GET /locks/status`**: consulta por `resource_key` ou `(edital_id + kind + month_year?)`.
- **`POST /locks/batch-status`**: body `{edital_ids: [...], month_year?}`; retorna status de todos para renderizar badges na `EditaisPage`.
- **Feature flag**: quando `LOCKS_ENABLED=0`, operacoes de write nao exigem lock; quando `=1`, writes sem lock valido retornam HTTP 403.
