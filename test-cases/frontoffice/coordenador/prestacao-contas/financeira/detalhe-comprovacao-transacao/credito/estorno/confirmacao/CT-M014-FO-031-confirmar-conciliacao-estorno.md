## ID do Cenário
[CT-M014-FO-031]

## Título
Confirmar conciliação e submeter estorno pareado

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Detalhe e Comprovação de Transação
- Regra Canônica: M014: `RN08` / `RN10` (Submissão e bloqueio pós-envio de estorno)
- Contrato/API: `M014: SubmeterComprovacaoCredito`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de crédito devidamente pareada com uma transação de débito equivalente.
- Status do par marcado como "Pareado e Válido".

## Passo a Passo
1. Revisar o painel de resumo da conciliação do estorno.
2. Confirmar a leitura da declaração de veracidade das informações.
3. Clicar no botão "Submeter Comprovação de Estorno".
4. Confirmar na modal de confirmação final.

## Dados de Entrada
- ID do Par Pareado: `PAR_ESTORNO_883`
- Status Inicial: `RASCUNHO`

## Resultado Esperado
- O sistema processa a submissão e altera o status da comprovação da transação para `EM_ANALISE`.
- Exibe notificação de sucesso: "Comprovação de estorno submetida com sucesso".
- Os botões de edição, desvinculação e exclusão ficam desativados (bloqueio de edição em análise).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
