## ID do Cenário
[CT-M014-FO-025]

## Título
Bloquear acesso de usuário anônimo / não autenticado e redirecionar para Acesso Cidadão

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, autenticação e segurança.
- Arquitetura: 03 — Acesso e Segurança (Autenticação via Acesso Cidadão / OpenID Connect).
- M005: Autenticação SSO.

## Pré-condições
- Usuário não autenticado na aplicação (sem sessão ativa e sem token JWT no navegador).

## Passo a Passo
1. Abrir o navegador em modo anônimo (ou com cookies e storage limpos).
2. Tentar acessar diretamente a URL protegida `/coordenador/prestacao-financeira`.

## Dados de Entrada
- Usuário anônimo (não autenticado).
- URL requisitada: `/coordenador/prestacao-financeira`.

## Resultado Esperado
- O middleware/route guard de autenticação intercepta a requisição.
- O acesso aos dados da prestação financeira é totalmente bloqueado.
- O usuário é redirecionado para o fluxo de autenticação do Acesso Cidadão (com parâmetro de retorno para a rota de origem após login com sucesso).

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
