## ID do Cenário
[CT-M014-FO-124]

## Título
Validar agrupamento de itens de compra por Nota Fiscal na etapa de associação de rubrica

## Requisito/História Relacionada
- Requisito/Issue: #2943 / Seção D1 (Agrupamento de itens por nota fiscal)
- Regra Canônica: M014: `RN06` / `RN07` (Associação de ItemDocumentoFiscal agrupado por DocumentoFiscal)
- Contrato/API: `M014: ListarItensDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas contendo **duas Notas Fiscais de emitentes diferentes** anexadas e confirmadas.

## Passo a Passo
1. Acessar a tela de comprovação de débito contendo NF-e 1 (Fornecedor A) e NF-e 2 (Fornecedor B).
2. Expandir a etapa `3. Associar Compra *`.
3. Inspecionar o layout e a organização visual dos itens listados para associação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- NF-e 1: Emitente `FORNECEDOR A LTDA` (Itens: Notebook, Mouse)
- NF-e 2: Emitente `FORNECEDOR B S.A.` (Itens: Monitor, Teclado)

## Resultado Esperado
- Os itens de compra são exibidos agrupados por Nota Fiscal.
- Cada bloco/grupo apresenta no seu cabeçalho o nome do emitente, a chave de acesso e o número da Nota Fiscal correspondente.
- A associação da categoria/rubrica contábil realizada em um item aplica-se exclusivamente àquele item específico dentro de seu respectivo grupo.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
