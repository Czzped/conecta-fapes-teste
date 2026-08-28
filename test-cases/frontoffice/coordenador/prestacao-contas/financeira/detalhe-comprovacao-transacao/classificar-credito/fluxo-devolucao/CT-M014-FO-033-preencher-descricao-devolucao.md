## ID do Cenário
[CT-M014-FO-033]

## Título
Preencher campo Descrição no fluxo de Devolução

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regra Canônica: M014: `RN09` (Justificativa de devolução voluntária de saldo)
- Contrato/API: `M014: ClassificarDevolucaoRecurso`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito aberta na rota `/coordenador/prestacao-financeira/classificar-credito/:paymentId`.

## Passo a Passo
1. No campo `Classificação`, selecionar a opção `Devolução`.
2. Verificar que o campo `Associe esse Crédito...` é ocultado.
3. Observar o surgimento do campo `Descrição` (textarea) com o placeholder `Descreva o motivo da entrada de valor na conta do projeto.`.
4. Digitar o motivo da devolução no campo `Descrição`.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/classificar-credito/paymentId_credito_01`
- Classificação: `Devolução`
- Descrição: `Devolução referente ao saldo remanescente de diárias não utilizadas no evento de pesquisa.`

## Resultado Esperado
- O campo de associação de débito é ocultado da tela.
- O campo `Descrição` é exibido com o placeholder e contador de caracteres zerado (`0/250 caracteres`).
- O texto digitado é aceito e o contador é atualizado conforme o número de caracteres inseridos.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
