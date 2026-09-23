## ID do Cenário
[CT-M014-FO-114]

## Título
Criar prestação de contas de débito conjunta a partir de seleção múltipla no extrato

## Requisito/História Relacionada
- Requisito/Issue: #2943 / #2165 (Múltiplas Transações de Débito por Prestação)
- Regra Canônica: M014: `RN02` / `RN13` (Criação de JustificativaDespesa vinculando N TransacaoFinanceira)
- Contrato/API: `M014: CriarJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Acessar a listagem de extrato da prestação financeira contendo múltiplos débitos pendentes de comprovação.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Na tabela de extrato, marcar o checkbox de seleção correspondente ao Débito 1 (ex: R$ 500,00).
3. Marcar o checkbox de seleção correspondente ao Débito 2 (ex: R$ 700,00).
4. Clicar no botão `Criar prestação` (ou `Comprovar selecionadas`).
5. Inspecionar o cabeçalho e as transações vinculadas na página de detalhes da nova prestação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira`
- Débito 1: ID `tx_debito_01` (R$ 500,00)
- Débito 2: ID `tx_debito_02` (R$ 700,00)

## Resultado Esperado
- O sistema redireciona para a tela de detalhes de comprovação de débito.
- A prestação é criada contendo as duas transações (Débito 1 e Débito 2) previamente vinculadas.
- O valor total das transações é exibido como a soma dos débitos selecionados (R$ 1.200,00).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
