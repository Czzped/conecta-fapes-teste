## ID do Cenário
[CT-M014-FO-072]

## Título
Preencher descrição do contexto do Invoice com limite de caracteres

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN05` (Descrição justificativa da compra internacional)
- Contrato/API: `M014: RegistrarJustificativaDespesa`

## Pré-condições
- Tipo de documento selecionado como `Invoice (Pagamento Internacional)`.
- Campo `Descrição` visível com placeholder *"Descreva o contexto do Invoice"*.

## Passo a Passo
1. Clicar na área de texto `Descrição`.
2. Digitar uma descrição explicando o contexto da compra internacional.
3. Observar o contador de caracteres.

## Dados de Entrada
- Texto: `Aquisição de equipamento de pesquisa importado de fornecedor internacional para uso no laboratório do projeto.`
- Limite: `250 caracteres`

## Resultado Esperado
- O texto é inserido com sucesso.
- O contador atualiza em tempo real (ex: `107/250 caracteres`).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
