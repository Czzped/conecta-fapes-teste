## ID do Cenário
[CT-M014-FO-091]

## Título
Validar colunas e campos de informação das transações na listagem do extrato

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Extrato de Prestação Financeira (`/coordenador/financeira`)
- Regra Canônica: M014: `RN02` / `RN11` (Exibição de dados dos movimentos bancários CNAB 240)
- Contrato/API: `M014: ConsultarExtratoFinanceiro`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transações financeiras (Crédito e Débito) importadas no extrato do projeto.

## Passo a Passo
1. Acessar a rota da prestação financeira (`/coordenador/financeira`).
2. Localizar a tabela de listagem das transações financeiras.
3. Inspecionar cada linha/card de transação e verificar a presença e formatação dos campos de informação.
4. Verificar o ícone/seta de ação (`>`) para abertura do detalhamento no canto direito do card.

## Dados de Entrada
- Rota: `/coordenador/financeira`
- Exemplo de dados na linha:
  - **Pagamento**: `Crédito` ou `Débito`
  - **Valor**: `R$ 13.045,80`
  - **Data**: `01/12/2026 - 15:12`
  - **Destinatário**: `27.573.006/0001-04`
  - **Status**: `Pendente` (badge amarelo), `Em Rascunho`, `Em Análise`, `Validado`/`Aprovada`, `Rejeitada`

## Resultado Esperado
- Cada registro na listagem exibe de forma clara e alinhada todas as colunas obrigatórias:
  - **Pagamento**: exibe o tipo da transação (`Crédito` ou `Débito`).
  - **Valor**: exibido no formato de moeda brasileira (ex: `R$ 13.045,80`).
  - **Data**: exibe data e hora no formato `dd/mm/aaaa - hh:mm`.
  - **Destinatário**: exibe o CNPJ/CPF ou identificação do pagador/beneficiário formatado.
  - **Status**: exibe o badge visual com a cor e texto correspondentes ao estado atual.
  - **Ação (`>`)**: exibe a indicação clicável que redireciona o usuário para a tela de classificação/comprovação da transação.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
