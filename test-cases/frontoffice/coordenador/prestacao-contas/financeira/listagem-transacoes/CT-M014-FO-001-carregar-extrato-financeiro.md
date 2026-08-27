## ID do Cenário
[CT-M014-FO-001]

## Título
Carregar o extrato financeiro do projeto do coordenador

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, jornada de navegação por transações financeiras.
- M014: `ConsultarPrestacaoContas`.
- M014: RN02 (movimentos bancários importados e conciliação).

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto selecionado no contexto do portal.
- Existem `TransacaoFinanceira` importadas para a iniciativa do projeto.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar a seção `Extrato do Projeto`.
4. Inspecionar os dados exibidos em uma transação da listagem.

## Dados de Entrada
- Perfil: `coordenador`.
- Projeto com movimentos bancários importados.

## Resultado Esperado
- A página exibe o resumo financeiro e a seção `Extrato do Projeto`.
- A listagem apresenta as `TransacaoFinanceira` disponíveis no contexto do projeto.
- Cada transação exibe, no mínimo, operação (crédito ou débito), valor, data, favorecido/documento e status.
- A tela não trata a transação como rubrica orçamentária; a classificação de despesa permanece responsabilidade da `RubricaProjeto` (M013).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
