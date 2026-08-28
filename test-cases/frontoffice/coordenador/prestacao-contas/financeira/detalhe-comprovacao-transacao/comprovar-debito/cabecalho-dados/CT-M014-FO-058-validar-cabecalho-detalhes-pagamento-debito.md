## ID do Cenário
[CT-M014-FO-058]

## Título
Validar exibição do cabeçalho e dados do pagamento de Débito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regra Canônica: M014: `RN05` (Identificação e detalhamento de lançamentos de Débito)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação do tipo Débito selecionada no extrato do projeto.

## Passo a Passo
1. Acessar a rota de detalhe de uma transação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`).
2. Verificar o Breadcrumb no topo da página.
3. Verificar a seção `Detalhes do Pagamento` e o banner com os dados da transação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Perfil: `coordenador`

## Resultado Esperado
- O Breadcrumb exibe a estrutura: `Prestação de Contas > Financeira > Detalhes`.
- O título exibe `Detalhes do Pagamento`.
- A barra de dados exibe os valores exatos importados do extrato:
  - **Pagamento**: `Débito`
  - **Valor**: Valor monetário formatado (ex: `R$ 21.619,50`)
  - **Data**: Data e hora da saída (ex: `11/05/2026 - 23:24`)
  - **Destinatário**: CNPJ ou identificador (ex: `12.345.678/9900-01`)

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
