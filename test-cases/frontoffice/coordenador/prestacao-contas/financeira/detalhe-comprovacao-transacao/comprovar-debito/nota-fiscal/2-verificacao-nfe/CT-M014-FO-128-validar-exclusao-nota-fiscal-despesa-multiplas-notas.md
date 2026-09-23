## ID do Cenário
[CT-M014-FO-128]

## Título
Validar exclusão de uma Nota Fiscal específica em despesa contendo múltiplas notas anexadas

## Requisito/História Relacionada
- Requisito/Issue: #2943 / #2919 (Remoção de Nota Fiscal no cenário de múltiplas notas)
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Exclusão direcionada de DocumentoFiscal e atualização dos totais da despesa)
- Contrato/API: `DELETE /api/prestacao-de-contas/projeto/{projectId}/justificativa-nf/{justificativaId}/documento-fiscal/{documentoFiscalId}`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Despesa contendo exatamente **duas ou mais Notas Fiscais anexadas e confirmadas** (ex: NF-e 1 - R$ 1.500,00 e NF-e 2 - R$ 2.000,00, totalizando R$ 3.500,00).

## Passo a Passo
1. Acessar a tela de comprovação de débito em `/coordenador/prestacao-financeira/detalhes/:paymentId`.
2. Na Seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no botão `Editar`.
3. Localizar o card específico da Nota Fiscal que se deseja excluir (ex: NF-e 2).
4. Clicar no ícone de remoção/exclusão (lixeira) localizado no canto superior do card da NF-e 2.
5. Confirmar a exclusão na modal/popover de confirmação.
6. Inspecionar a remoção do card, o recalculo do valor total da despesa e a barra de conciliação.
7. Recarregar a página (`F5`) para validar a persistência da exclusão.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Estado inicial: 2 Notas Fiscais (NF-e 1: R$ 1.500,00 | NF-e 2: R$ 2.000,00 | Total: R$ 3.500,00)
- Nota selecionada para exclusão: NF-e 2 (`documentoFiscalId` da NF-e 2)

## Resultado Esperado
- Apenas o card da NF-e 2 é removido da lista de notas da Seção 2.
- A NF-e 1 permanece ativa e inalterada.
- O valor total da despesa é recalculado automaticamente para refletir apenas o valor da nota remanescente (R$ 1.500,00).
- A barra de conciliação entre notas e transações atualiza instantaneamente seu saldo e status de conciliação.
- É exibida a notificação de sucesso: *"Nota fiscal removida com sucesso"*.
- Ao recarregar a página (`F5`), apenas a NF-e 1 é exibida na tela, confirmando a persistência no servidor.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
