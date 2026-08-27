## ID do Cenário
[CT-M014-FO-028]

## Título
Bloquear ações e renovar autenticação quando a sessão/token JWT expirar

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, segurança de sessão.
- Arquitetura: 03 — Acesso e Segurança (Autenticação JWT / OpenID Connect).
- M005: Autenticação.

## Pré-condições
- Usuário autenticado como Coordenador e com a tela `/coordenador/prestacao-financeira` aberta.
- O token JWT de acesso expira e o mecanismo de refresh token automático é invalidado/falha.

## Passo a Passo
1. Estar na tela `/coordenador/prestacao-financeira`.
2. Aguardar a expiração do token de sessão (ou simular token expirado).
3. Tentar realizar qualquer ação na tela (ex.: aplicar filtro de extrato, mudar página ou clicar em uma transação).

## Dados de Entrada
- Perfil: `coordenador`.
- Token JWT: Expirado / Inválido.

## Resultado Esperado
- A requisição aos serviços de backend retorna HTTP 401 Unauthorized.
- A interface intercepta a resposta, limpa o estado de autenticação local e apresenta modal de sessão expirada ou redireciona o usuário para login no Acesso Cidadão.
- Dados sensíveis não continuam em cache navegável após o encerramento da sessão.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
