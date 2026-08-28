## ID do Cenário
[CT-M014-FO-057]

## Título
Enviar comprovação final de débito de passagem com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN10` (Submissão final da comprovação de passagem e transição para Em Análise)
- Contrato/API: `M014: SubmeterComprovacaoDebito`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Todas as 3 seções concluídas (Descrição, Comprovantes anexados e Informações/Itinerário da passagem confirmados).

## Passo a Passo
1. Revisar as 3 seções do formulário.
2. Clicar no botão primário ciano `Enviar` no rodapé da página.
3. Confirmar a submissão final.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_passagem_01`

## Resultado Esperado
- O sistema processa o envio da comprovação de passagem.
- O status da comprovação transiciona de `Em Rascunho` para `Em Análise`.
- O formulário e seus anexos são bloqueados contra edições posteriores.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
