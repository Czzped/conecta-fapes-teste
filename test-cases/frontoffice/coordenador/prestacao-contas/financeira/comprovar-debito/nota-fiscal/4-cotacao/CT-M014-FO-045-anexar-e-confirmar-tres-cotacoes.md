## ID do Cenário
[CT-M014-FO-045]

## Título
Anexar e preencher dados das 3 cotações de fornecedores

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN07` / `RI-COT02` (Cadastro de orçamentos de fornecedores com data, nome e valor)
- Contrato/API: `M014: AnexarOrcamentoFornecedor`

## Pré-condições
- Seção `4. Cotação` visível.
- 3 arquivos de orçamentos em formato PDF disponíveis para upload.

## Passo a Passo
1. Clicar em `Anexar Cotação 1/3` e enviar o PDF do primeiro fornecedor.
2. Preencher os campos `Fornecedor*`, `Valor*` e `Data*` do primeiro orçamento e clicar no botão ciano `Confirmar`.
3. Repetir os passos para a cotação `2/3` e `3/3`.
4. Clicar no botão `Enviar cotações`.

## Dados de Entrada
- Cotação 1: `PERERADOSSANTOS1` | Valor: `R$ 5.826,00` | Data: `10/05/2026`
- Cotação 2: `FAST SHOP` | Valor: `R$ 5.854,83` | Data: `11/05/2026`
- Cotação 3: `Fast Shop Magalu` | Valor: `R$ 8.764,00` | Data: `11/05/2026`

## Resultado Esperado
- Cada um dos 3 orçamentos é listado no painel com seus respectivos campos preenchidos e confirmados.
- O botão `Enviar cotações` é habilitado e conclui o registro das cotações.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
