## ID do Cenário
[CT-M009-FO-004]

## Título
Validar bloqueio de solicitação de alteração de nível por saldo ou cota insuficiente sob dupla contagem conservadora

## Requisito/História Relacionada
- Requisito/Issue: https://github.com/leds-conectafapes/leds-conectafapes-prestacao-de-contas/issues/714 (Feature: https://github.com/leds-conectafapes/conectafapes-project/issues/2550, Subtarefas: #2674, #2675)
- Regra Canônica: M009: RN01 (Validação de cota e saldo da rubrica), M013: RN-SLD02 (`SALDO_INSUFICIENTE`), FR-005 (Dupla contagem conservadora de bolsas em coexistência)
- Contrato/API: `POST /api/alocacoes-bolsistas/{id}/alterar-nivel`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado com margem orçamentária ajustada ou cotas no limite (sem folga suficiente para alocar o valor integral da bolsa nova enquanto a origem continua ocupando saldo/cota).
- Bolsista com alocação ativa.

## Passo a Passo
1. Acessar `/coordenador/minha-equipe`.
2. Acessar a tela de Detalhes do bolsista (`Minha Equipe › Bolsistas do Projeto › Detalhes`).
3. Na aba `Informações`, clicar no botão `Alterar Nível da Bolsa`.
4. No modal, selecionar um novo nível cujo valor total do período exceda o saldo orçamentário disponível ou o limite de cotas do projeto (ex.: `BPIG-I`).
5. Preencher a `Data de Início` desejada.
6. Clicar no botão `Confirmar`.
7. Observar a resposta da API e a mensagem de erro apresentada na tela.

## Dados de Entrada
- Nível Atual: `BPIG-III` (valor alocado R$ 1.500,00/mês)
- Novo Nível: `BPIG-I` (valor necessário R$ 3.000,00/mês)
- Saldo Disponível na Rubrica de Bolsas do Projeto: R$ 5.000,00 (insuficiente para cobrir o valor integral da bolsa nova de R$ 18.000,00 para 6 meses, devido à coexistência conservadora da origem)
- Data de Início: `01/11/2026`

## Resultado Esperado
- O backend rejeita a solicitação com erro de validação orçamentária/cota (`HTTP 422 Unprocessable Entity`).
- O sistema não cria a solicitação nem a nova bolsa, mantendo a bolsa de origem intacta e sem congelamento.
- A interface exibe mensagem de erro clara e orientadora, especificando o nível, a quantidade de cotas ou o valor financeiro faltante (ex.: "Saldo orçamentário insuficiente para comportar a nova bolsa. Faltam R$ 13.000,00 na rubrica de bolsas. Realize um remanejamento orçamentário prévio antes de solicitar a troca.").

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
