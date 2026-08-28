## ID do Cenário
[CT-M014-FO-087]

## Título
Validar atualização dinâmica das opções do dropdown Selecione o Item ao alterar a Categoria do Item

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN07` (Cascateamento de categorias contábeis e itens aprovados no Edital)
- Contrato/API: `M014: ConsultarItensAprovadosEdital`

## Pré-condições
- Seção `4. Associar Itens do Invoice *` visível.
- Edital do projeto associado com diferentes categorias de despesa cadastradas (ex: *Material de Consumo*, *Equipamento e Material Permanente*, *Serviços de Terceiros*).

## Passo a Passo
1. No campo `Selecione a Categoria do Item*`, inspecionar as opções disponíveis na lista.
2. Selecionar a categoria `Material de Consumo`.
3. Clicar no dropdown `Selecione o Item*` e observar a lista de itens de consumo aprovados.
4. Alterar o campo `Selecione a Categoria do Item*` para `Material Permanente`.
5. Verificar se a seleção anterior do item é resetada e o dropdown exibe os itens de equipamentos/permanentes.
6. Repetir alternando para as categorias `Diária` e `Passagens`.

## Dados de Entrada
- Categorias Válidas do Edital: `Diária`, `Material de Consumo`, `Material Permanente`, `Passagens`
- Teste de Troca:
  - Seleção 1: `Material de Consumo` → Exibe itens de consumo
  - Seleção 2: `Material Permanente` → Exibe itens permanentes (reseta seleção anterior)
  - Seleção 3: `Diária` → Exibe modalidades de diárias aprovadas
  - Seleção 4: `Passagens` → Exibe opções de passagens aprovadas

## Resultado Esperado
- Ao selecionar `Material de Consumo`, o dropdown `Selecione o Item*` é populado exclusivamente com os itens da rubrica de consumo.
- Ao alterar a categoria para `Equipamento e Material Permanente`, a seleção anterior do item é resetada e o dropdown atualiza dinamicamente apenas com os itens de equipamentos aprovados no Edital.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
