# EPI-04 — Autenticacao e Sessao

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |
| **Fonte no codigo** | `app/routers/auth.py`, `app/security/jwt_auth.py`, `app/clients/supabase_auth.py`, `frontend/src/contexts/AuthContext.tsx`, `frontend/src/components/auth/ProtectedRoute.tsx` |

## Jornada

O operador acessa a aplicacao e e direcionado para `/login`. Informa email e senha da sua conta no Supabase Auth; o backend faz `POST /auth/v1/token?grant_type=password` e devolve `access_token` + `refresh_token` no JSON e tambem em cookies HttpOnly (`sb-access-token` e `sb-refresh-token`). O frontend armazena o token em `sessionStorage` via `AuthContext` e redireciona para `/editais`. Em todas as requisicoes protegidas, o middleware JWT valida o token (Bearer OU cookie) usando JWKS publico do Supabase com cache de 1h; requests sem token valido retornam HTTP 401. `ProtectedRoute` redireciona de volta para `/login` se a sessao expirar.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [M002](../../../implementation/modules/M002-importacao-editais/README.md) | Camada transversal de autenticacao | Done |

## User Stories

| ID | User Story |
|----|-----------|
| US-04-01 | Como operador, quero fazer login com email e senha para acessar a ferramenta. |
| US-04-02 | Como operador, quero manter minha sessao entre recarregamentos da pagina. |
| US-04-03 | Como operador, quero ser redirecionado para `/login` automaticamente quando minha sessao expirar. |
| US-04-04 | Como sistema, quero validar o JWT em todas as rotas protegidas via Bearer ou cookie HttpOnly. |
| US-04-05 | Como operador, quero fazer logout e limpar cookies + sessionStorage. |
| US-04-06 | Como admin, quero restringir rotas `/internal/*` apenas a usuarios com role em `INTERNAL_ALLOWED_ROLES`. |

## Cenarios de aceitacao do produto

- **Login Supabase Auth**: email e senha validos retornam `access_token`, `refresh_token`, `expires_in` (3600s) e dados do usuario (id, email).
- **Cookies HttpOnly**: `sb-access-token` (TTL = `expires_in`) e `sb-refresh-token` (TTL `AUTH_REFRESH_COOKIE_MAX_AGE`, default 30 dias). Flags `secure`, `samesite`, `domain`, `path` configuraveis por ambiente.
- **Validacao JWT**: cache JWKS por `SUPABASE_JWKS_CACHE_TTL_SECONDS` (1h default); valida `iss`, `aud`, algoritmos permitidos (`ES256,RS256`) e leeway de 30s.
- **Sessao persistente**: `AuthContext` armazena token em `sessionStorage`; reload da pagina nao exige reautenticacao.
- **Rota protegida**: `ProtectedRoute` redireciona para `/login` quando `AuthContext.token` e null.
- **401 em token invalido**: requests a rotas protegidas sem token valido recebem HTTP 401 com detalhe.
- **Role interno**: rotas em `/internal/*` exigem role no JWT em `INTERNAL_ALLOWED_ROLES` (default `admin,service_role`); sem role retorna HTTP 403.
- **CORS com credenciais**: `CORS_ALLOW_CREDENTIALS=1` requer origem explicita em `CORS_ORIGINS` (nao `*`).
