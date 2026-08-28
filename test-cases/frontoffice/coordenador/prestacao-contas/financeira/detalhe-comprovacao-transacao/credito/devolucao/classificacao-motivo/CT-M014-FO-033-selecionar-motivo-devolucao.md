## ID do Cenário
[CT-M014-FO-033]

## Título
Selecionar motivo de devolução de recurso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Detalhe e Comprovação de Transação
- Regra Canônica: M014: `RN09` / `RI-DEV01` (Motivos de devolução voluntária)
- Contrato/API: `M014: ClassificarDevolucaoRecurso`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito aberta para classificação como devolução voluntária.

## Passo a Passo
1. Localizar o campo select "Motivo da Devolução".
2. Selecionar a opção desejada (ex: "Saldo de Diária Não Utilizado").
3. Preencher a caixa de texto "Justificativa da Devolução" com a descrição detalhada.
4. Clicar em "Salvar Rascunho".

## Dados de Entrada
- Motivo Selecionado: `Saldo de Diária Não Utilizado`
- Justificativa: `Devolução referente a 1 diária não realizada devido ao adiantamento do evento.`

## Resultado Esperado
- As informações do motivo e justificativa são salvas no rascunho.
- O indicador de preenchimento do formulário atualiza para "Motivo Classificado".

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
