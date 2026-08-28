## ID do Cenário
[CT-M014-FO-029]

## Título
Validar exibição do cabeçalho e dados do pagamento de Crédito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regra Canônica: M014: `RN08` / `RN09` (Identificação de lançamentos de Crédito)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação do tipo Crédito pendente de classificação selecionada no extrato.

## Passo a Passo
1. Acessar a rota de detalhe de uma transação de Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`).
2. Verificar o Breadcrumb no topo da página.
3. Verificar a seção `Detalhes do Pagamento` e a barra de informações.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/paymentId_credito_01`
- Perfil: `coordenador`

## Resultado Esperado
- O Breadcrumb exibe a estrutura: `Prestação de Contas > Financeira > Classificar Crédito`.
- O título exibe `Detalhes do Pagamento`.
- A barra de dados exibe os valores exatos importados do extrato:
  - **Pagamento**: `Crédito`
  - **Valor**: Valor monetário formatado (ex: `R$ 2.599,60`)
  - **Data**: Data e hora da entrada (ex: `01/08/2026 - 19:44`)
  - **Destinatário**: CNPJ ou identificador (ex: `60.000.000/0001-13`)

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
