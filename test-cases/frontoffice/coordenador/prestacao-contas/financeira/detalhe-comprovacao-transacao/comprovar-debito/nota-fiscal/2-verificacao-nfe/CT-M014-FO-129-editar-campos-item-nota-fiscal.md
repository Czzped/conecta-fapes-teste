## ID do Cenário
[CT-M014-FO-129]

## Título
Editar campos de item da Nota Fiscal e validar recálculo de valor total e persistência

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal), seção `Verificar Informações da Nota Fiscal` > tabela `Itens da Nota Fiscal`.
- Regra Canônica: M014: `RN05` (Integridade da edição de `ItemDocumentoFiscal`); `RI3` (`ItemDocumentoFiscal.ValorTotal = Quantidade × ValorUnitario`); `RN09` (auditoria e histórico de alterações).
- Heurísticas de Nielsen: **#1** (Visibilidade do Status do Sistema) e **#5** (Prevenção de Erros).
- Contrato/API: `M014: EditarItemNotaFiscal` / `PUT /api/prestacao-de-contas/projeto/:projectId/justificativa-nf/:justificativaId/documento-fiscal/:documentoFiscalId/item/:itemId`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de débito aberta na tela de comprovação (`/coordenador/prestacao-financeira/detalhes/:paymentId`).
- Arquivo de Nota Fiscal anexado e processado com dados e itens extraídos.
- Tabela `Itens da Nota Fiscal` visível com itens de produto/serviço listados (colunas `Descrição`, `Quantidade`, `Valor Unitário` e `Valor Total`).
- Status da comprovação: `Pendente` ou `Em Rascunho` (edicao liberada).

## Passo a Passo
1. Acessar a tela de comprovação de débito com a Nota Fiscal anexada (`/coordenador/prestacao-financeira/detalhes/:paymentId`).
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no botão `Editar` (ícone de lápis) no card da nota fiscal.
3. No painel expandido `Verificar informações da Nota Fiscal`, localizar a tabela `Itens da Nota Fiscal`.
4. Clicar sobre a linha do item desejado (ou no botão/ícone de edição do item) para abrir o modal `Item da Nota Fiscal`.
5. No modal, alterar o campo `Quantidade` para um novo valor válido (ex.: de `1` para `2`).
6. Observar que o campo `Valor Total` do item no modal é recalculado automaticamente com base na fórmula `Quantidade × Valor Unitário`.
7. Clicar no botão `Confirmar` dentro do modal `Item da Nota Fiscal`.
8. Verificar que a linha correspondente na tabela `Itens da Nota Fiscal` é atualizada com a nova quantidade e o valor total recalculado.
9. Clicar no botão `Confirmar edição` no rodapé da seção da nota fiscal.
10. Observar a exibição da notificação (toast) de sucesso confirmando a alteração.
11. Recarregar a página (`F5`) para verificar a persistência da alteração no servidor.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Item Selecionado: `AR COND SPLIT HW LG AI DUAL INVERTER VOICE 9000 BTU` (ou equivalente na despesa)
- Quantidade Original: `1`
- Quantidade Editada: `2`
- Valor Unitário: `R$ 1.481,35`
- Valor Total Esperado no Recálculo: `R$ 2.962,70` (`2 × R$ 1.481,35`)

## Resultado Esperado
- Ao clicar no item da tabela, o modal `Item da Nota Fiscal` abre exibindo os campos editáveis do item.
- Ao alterar a `Quantidade` ou o `Valor Unitário`, o campo `Valor Total` é recalculado instantaneamente respeitando a regra `RI3`.
- Ao clicar em `Confirmar` no modal, a tabela `Itens da Nota Fiscal` reflete os valores ajustados.
- Ao clicar em `Confirmar edição`, o sistema submete a alteração ao backend e exibe toast de confirmação (ex.: *"Nota fiscal editada com sucesso"*).
- Após recarregar a página (`F5`), a quantidade alterada (`2`) e o valor total recalculado (`R$ 2.962,70`) persistem inalterados no item da tabela.
- Na Seção 3 (`Associar Compra`), a lista de itens para classificação orçamentária passa a refletir a quantidade atualizada do item.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
