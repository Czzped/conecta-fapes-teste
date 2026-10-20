## ID do Cenário
[CT-M009-FO-007]

## Título
Cancelar bolsa de origem com troca de nível pendente através do fluxo de confirmação composta

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2674, #2675)
- Regra Canônica: M009: RN10 (Cancelamento de bolsa), FR-013 (Fluxo composto de cancelamento com troca pendente)
- Contrato/API: `POST /api/solicitacoes-alteracao-nivel/{id}/desistir` seguido de `POST /api/alocacoes-bolsistas/{id}/cancelar`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Bolsista com alocação ativa que possui uma solicitação de alteração de nível pendente (`Status = PENDENTE`).
- Sistema configurado com o fluxo de cancelamento assistido.

## Passo a Passo
1. Acessar `/coordenador/minha-equipe`.
2. Acessar os Detalhes do bolsista (`Minha Equipe › Bolsistas do Projeto › Detalhes`).
3. Localizar a opção de cancelamento de bolsa e acioná-la.
4. Observar a exibição do modal de confirmação especial informando a existência da alteração de nível em andamento.
5. Confirmar a mensagem que adverte: "Existe uma troca de nível em andamento; ao cancelar a bolsa a troca também será cancelada. Confirmar?".
6. Clicar no botão `Confirmar Cancelamento`.
7. Aguardar a execução das chamadas em sequência no frontend.

## Dados de Entrada
- `alocacaoId`: ID da bolsa de origem
- `solicitacaoAlteracaoNivelId`: ID da solicitação de troca vinculada
- Motivo do cancelamento: "Cancelamento da bolsa pelo coordenador com descarte de troca pendente"

## Resultado Esperado
- O frontend dispara a primeira chamada para cancelar a solicitação de troca (`POST /api/solicitacoes-alteracao-nivel/{id}/desistir`).
- Após o sucesso da primeira chamada, dispara automaticamente a segunda chamada para cancelar a alocação de bolsa (`POST /api/alocacoes-bolsistas/{id}/cancelar`).
- Ambas as operações são concluídas com êxito:
  - A solicitação passa a `CANCELADA`.
  - A bolsa nova é marcada como `DESCARTADO`.
  - A bolsa de origem é marcada como `CANCELADA` no domínio.
- A listagem de `Minha Equipe` e o extrato são atualizados refletindo o status cancelado da bolsa.
- Em caso de falha na segunda requisição (ex.: erro de rede no cancelamento da bolsa), o sistema trata o erro notificando o usuário com precisão: informa que a troca de nível foi cancelada com sucesso, mas a bolsa não pôde ser cancelada naquele instante, evitando reexecuções indevidas da primeira chamada.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
