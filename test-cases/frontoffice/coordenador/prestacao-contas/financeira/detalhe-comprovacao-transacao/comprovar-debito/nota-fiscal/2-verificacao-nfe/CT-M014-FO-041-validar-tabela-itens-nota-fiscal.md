## ID do Cenário
[CT-M014-FO-041]

## Título
Validar tabela de Itens da Nota Fiscal

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` (Leitura e listagem dos itens da NF-e)
- Contrato/API: `M014: ListarItensNotaFiscal`

## Pré-condições
- Nota Fiscal com itens de produtos/serviços anexada no formulário.

## Passo a Passo
1. Localizar a tabela `Itens da Nota Fiscal` dentro do painel de verificação da Nota Fiscal.
2. Inspecionar as colunas: `Descrição`, `Quantidade`, `Valor Unitário` e `Valor Total`.

## Dados de Entrada
- Item: `NB I7 16GB1TB SSD ARC A350M`
- Quantidade: `4`
- Valor Unitário: `R$ 5.399,90`
- Valor Total: `R$ 21.599,60`

## Resultado Esperado
- A tabela lista cada item individualmente conforme extraído do documento fiscal.
- O cálculo do Valor Total do item é verificado (`Quantidade` x `Valor Unitário`).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
