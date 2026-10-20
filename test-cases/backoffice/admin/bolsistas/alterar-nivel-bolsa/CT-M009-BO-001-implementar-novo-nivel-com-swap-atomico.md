## ID do Cenário
[CT-M009-BO-001]

## Título
Implementar novo nível de bolsa pela FAPES com efetivação de swap atômico e transição de pagamentos

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2676, #3024)
- Regra Canônica: M009: RN07 (Implementação de bolsa), RN11 (Liberação de cotas), Regra de Swap Atômico (invariante de nunca haver duas bolsas ativas e nunca haver lacuna no mês), Supressão de eventos de participante Autherix
- Contrato/API: `POST /api/solicitacoes-alteracao-nivel/{id}/implementar`

## Pré-condições
- Usuário autenticado com o perfil `administrador` ou `analista_fapes`.
- Solicitação de alteração de nível em análise (`SolicitacaoAlteracaoNivel` com status `EM_AVALIACAO`).
- Documentação da nova bolsa devidamente analisada e aprovada pelo analista.
- Bolsa de origem encontra-se `ATIVA` (congelada).

## Passo a Passo
1. Acessar o Portal Admin em `Gestão de Bolsistas › Visualizar Pendências` (`/gestao-bolsa/visualizar-pendencias`).
2. Localizar o card da pendência correspondente ao bolsista (exibindo o selo roxo "Alteração de nível").
3. Acessar a tela de `Documentos do Bolsista` (`/gestao-bolsa/documentos-bolsista/{idAlocacao}`).
4. Conferir os documentos e verificar a exibição do botão primário `Implementar Novo Nível`.
5. Clicar em `Implementar Novo Nível`.
6. No modal de confirmação `Implementar Novo Nível`, ler o detalhamento das consequências da ação (ativação da nova bolsa a partir da data de início, cancelamento da origem e liberação de saldo).
7. Clicar em `Sim, implementar`.
8. Aguardar o processamento da transação.

## Dados de Entrada
- Rota: `/gestao-bolsa/documentos-bolsista/{idAlocacao}`
- Ação: Aprovação/Implementação de alteração de nível
- Data de Início da nova bolsa: `01/11/2026`

## Resultado Esperado
- O backend executa a efetivação em uma **única transação atômica** (commit único):
  - A nova `AlocacaoBolsista` passa ao status `ATIVA`.
  - As parcelas da nova bolsa são geradas a partir do mês de referência da `DataInicio` (`11/2026`).
  - A `AlocacaoBolsista` de origem passa ao status `CANCELADA`, com fechamento das parcelas "previstas" remanescentes (evitando cotas fantasmas).
  - A `SolicitacaoAlteracaoNivel` passa ao status `APROVADA`, com gravação de data de efetivação e id do analista responsável.
- Em nenhum momento o bolsista fica com duas bolsas `ATIVA` simultaneamente ou com mês descoberto (sem bolsa).
- A integração Outbox/Autherix **suprime** o evento `CANCEL_ALOCACAO_PARTICIPANTE`, mantendo intacta a permissão de acesso do bolsista ao projeto.
- A tela é atualizada para o estado somente leitura de alteração aprovada com feedback positivo ("Alteração de nível implementada com sucesso").

## Tipo de Teste
[x] Positivo  [ ] Negativo  [x] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
