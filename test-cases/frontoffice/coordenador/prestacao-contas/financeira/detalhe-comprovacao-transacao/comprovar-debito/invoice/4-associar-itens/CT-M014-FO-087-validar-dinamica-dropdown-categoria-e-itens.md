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
1. No campo `Selecione a Categoria do Item*`, escolher a opção `Material de Consumo`.
2. Clicar no dropdown `Selecione o Item*` e observar a lista de itens exibida.
3. Voltar ao campo `Selecione a Categoria do Item*` e alterar a seleção para `Equipamento e Material Permanente`.
4. Clicar novamente no dropdown `Selecione o Item*` e inspecionar a nova lista de opções.

## Dados de Entrada
- Categoria 1: `Material de Consumo` → Espera itens como: *Reagente Químico*, *Vidrarias*, *Material de Escritório*.
- Categoria 2: `Equipamento e Material Permanente` → Espera itens como: *Microcomputador*, *Nobreak*, *Impressora 3D*.

## Resultado Esperado
- Ao selecionar `Material de Consumo`, o dropdown `Selecione o Item*` é populado exclusivamente com os itens da rubrica de consumo.
- Ao alterar a categoria para `Equipamento e Material Permanente`, a seleção anterior do item é resetada e o dropdown atualiza dinamicamente apenas com os itens de equipamentos aprovados no Edital.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
