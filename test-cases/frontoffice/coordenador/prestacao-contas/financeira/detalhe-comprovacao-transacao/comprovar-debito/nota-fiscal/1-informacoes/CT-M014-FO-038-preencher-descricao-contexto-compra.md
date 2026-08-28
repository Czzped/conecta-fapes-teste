## ID do Cenário
[CT-M014-FO-038]

## Título
Preencher descrição do contexto do pagamento realizado

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regra Canônica: M014: `RN05` (Descrição justificativa da compra)
- Contrato/API: `M014: RegistrarJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Tipo de documento selecionado como `Nota Fiscal (Produto ou Serviço)`.

## Passo a Passo
1. Localizar a seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.
2. Clicar no campo de texto multilinha de descrição.
3. Inserir o texto explicativo sobre o contexto da aquisição.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Texto de Descrição: `Aquisição de notebook de alto desempenho para processamento de dados do projeto de pesquisa.`
- Limite: `250 caracteres`

## Resultado Esperado
- O texto inserido é aceito na caixa de texto.
- O contador de caracteres é atualizado em tempo real (ex: `103/250 caracteres`).
- A mensagem orientativa *"Inclua a Nota Fiscal que justifique esse pagamento"* permanece visível abaixo do campo.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
