## ID do Cenário
[CT-M014-FO-022]

## Título
Validar renderização e cores das badges de status da transação

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, listagem de transações.
- M014: Modelo Comportamental / Ciclo de vida da Prestação de Contas.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado contendo transações em variados status (`Pendente`, `Em Validação`, `Validado`, `Revisar`, `Reprovado`).

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Inspecionar as tags/badges de status em cada linha de transação.

## Dados de Entrada
- Perfil: `coordenador`.
- Transações com status `Pendente`, `Em Validação`, `Validado`, `Revisar`, `Reprovado`.

## Resultado Esperado
- Cada transação exibe uma tag arredondada com o rótulo do status e esquema de cores correspondente:
  - `Pendente`: badge em tonalidade laranja/alerta.
  - `Em Validação`: badge em tonalidade azul.
  - `Validado`: badge em tonalidade verde.
  - `Revisar`: badge em tonalidade amarela/atenção.
  - `Reprovado`: badge em tonalidade vermelha/erro.
- As badges não apresentam quebra de linha interna (`whiteSpace: nowrap`).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
