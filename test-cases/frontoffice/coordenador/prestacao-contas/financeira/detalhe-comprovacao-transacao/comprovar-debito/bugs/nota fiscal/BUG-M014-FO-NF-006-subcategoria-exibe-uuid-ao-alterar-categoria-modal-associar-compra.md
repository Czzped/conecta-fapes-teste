# Título
[Bug] Campo de subcategoria exibe UUID interno do banco ao alterar a categoria na modal "Associar Compra"

## ID
BUG-M014-FO-NF-006

## Requisito/Regra Violada
- Regra Canônica: M014 / M013: `RN06` — Classificação de itens em categorias e subcategorias contábeis / UX de encadeamento de selects
- Rota/Componente: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` — Modal `Associar Compra` (Seção 3)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo

1. Acessar `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId` com Nota Fiscal anexada e confirmada.
2. Na seção `3. Associar Compra *`, clicar em um item para abrir o modal `Associar Compra`.
3. No select `Selecione a categoria do item`, escolher uma categoria (ex: `Material de Consumo`).
4. No select `Selecione a subcategoria do item`, escolher uma subcategoria válida (ex: `Clips de Papel`).
5. Voltar ao select `Selecione a categoria do item` e alterar para outra categoria diferente (ex: `Material Permanente`).
6. Observar o valor exibido no campo `Selecione a subcategoria do item`.

## Dados de Entrada
- URL: `https://conectafapes.hom.es.gov.br/prestacao-financeira/:paymentId`
- Categoria Inicial: `Material de Consumo`
- Subcategoria Inicial: `Clips de Papel`
- Nova Categoria: `Material Permanente`

## Comportamento Esperado
- Ao alterar a categoria no select principal, a seleção do select de subcategoria deve ser **respetada/limpa** (voltando ao estado placeholder *"Selecione a subcategoria do item"*).
- A lista de opções do select de subcategoria deve ser filtrada com base nas subcategorias pertencentes à nova categoria selecionada.

## Comportamento Atual
- Ao alterar a categoria pai, o select de subcategoria **não limpa** o valor selecionado nem reseta para o placeholder.
- Como o identificador da subcategoria anterior deixara de existir nas opções da nova categoria, o componente de select passa a exibir visualmente o **UUID/ID cru de banco de dados** do registro (ex: `af1222b2-h385-487b-879d-2d6146365c2`), exposto diretamente na interface para o usuário final.

## Evidências
- 📷 **Categoria e Subcategoria selecionadas normalmente:**

  `evidencias-BUG-NF-006-categoria-e-subcategoria-selecionadas.png`

- 📷 **UUID interno exposto no select de subcategoria após trocar a categoria pai:**

  `evidencias-BUG-NF-006-uuid-exibido-subcategoria-ao-alterar-categoria.png`

## Sugestão de Investigação (Opcional)
- Adicionar um watcher/handler no evento `@change` / `watch` da propriedade de `categoria` para resetar a variável reativa de `subcategoria` (`subcategoriaId = null`) sempre que o valor da categoria for modificado.