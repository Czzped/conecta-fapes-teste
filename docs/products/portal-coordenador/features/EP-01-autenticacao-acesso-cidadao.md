# EP-01 — Autenticacao com Acesso Cidadao

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M005 |
| **Produto** | Portal Coordenador |
| **Status** | Done |

## Jornada

O usuario acessa o portal e e redirecionado para o Acesso Cidadao (OpenID Connect). Apos autenticacao, o callback processa o token e estabelece a sessao. Rotas protegidas bloqueiam acesso sem sessao valida.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M005 | — | Autenticacao via Acesso Cidadao | A definir (M005 sem EPICs) |

## Cenarios de aceitacao do produto

Cenarios especificos de UX/frontend que nao existem nos EPICs backend:

- **Acessar a pagina de login**: o portal exibe a tela de login com botao de acesso externo
- **Iniciar autenticacao externa**: ao clicar, o usuario e redirecionado ao Acesso Cidadao
- **Bloquear rota protegida sem sessao**: tentativa de acessar area interna sem sessao redireciona para login
