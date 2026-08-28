## ID do Cenário
[CT-M014-FO-088]

## Título
Validar estado bloqueado/desabilitado do dropdown Selecione o Item sem categoria prévia selecionada

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN07` (Dependência sequencial entre categoria de despesa e item do Edital)
- Contrato/API: `M014: ConsultarItensAprovadosEdital`

## Pré-condições
- Seção `4. Associar Itens do Invoice *` visível.
- Nenhuma opção selecionada no dropdown `Selecione a Categoria do Item*` (campo exibindo o valor padrão ou em branco).

## Passo a Passo
1. Acessar a seção `4. Associar Itens do Invoice *`.
2. Tentar interagir/clicar no campo `Selecione o Item*` antes de escolher qualquer opção em `Selecione a Categoria do Item*`.

## Dados de Entrada
- Categoria do Item: `(não selecionada / em branco)`

## Resultado Esperado
- O dropdown `Selecione o Item*` permanece desabilitado (disabled/read-only) ou não expande nenhuma opção.
- O campo exibe mensagem ou estado indicativo (ex: *"Selecione uma categoria primeiro"*).
- O usuário não consegue prosseguir sem antes definir a categoria da despesa.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
