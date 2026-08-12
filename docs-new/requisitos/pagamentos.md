---
title: Pagamentos
tipo: requisito
---

# Pagamentos

Depois que uma bolsa é concedida e está ativa, o bolsista passa a receber uma quantia mensal durante a vigência da sua atividade. Este requisito cobre todo o ciclo financeiro dessas bolsas: como os pagamentos de cada bolsista são gerados, como cada parcela é identificada, as diferentes situações por que uma parcela passa até ser efetivamente paga, o caso especial dos pagamentos adiantados (distribuídos em meses escolhidos manualmente), o bônus aplicável a certas modalidades, e o acompanhamento tanto pelo bolsista quanto pelo coordenador da equipe.

O pagamento é sempre atrelado a uma bolsa concedida (a alocação do bolsista no projeto). Cada parcela corresponde a um mês de competência e tem um valor previsto; ao longo do processo, ela caminha por situações até virar um pagamento efetivo, com data e valor pagos.

## Atores

- **Bolsista**: acompanha o próprio histórico de pagamentos e as situações de cada parcela.
- **Coordenador do projeto**: acompanha os pagamentos da sua equipe, filtra e revisa; nas bolsas de pagamento adiantado, define e ajusta os meses das parcelas.
- **Equipe FAPES (administradores)**: conduz o ciclo mensal da folha — liberação, geração, autorização — e o relacionamento com o banco.
- **Sistema de pagamento e banco (Bandes)**: origem da geração das parcelas e destino da remessa bancária; o sistema conversa com esse serviço para gerar e efetivar pagamentos.

## Fluxo principal

**Ciclo mensal da folha (equipe FAPES)**

1. **Liberação**: a equipe libera os editais para pagamento e acompanha a liberação por área técnica.
2. **Geração da folha**: o sistema gera a folha do mês, criando as parcelas dos bolsistas ativos, e permite visualizá-la.
3. **Autorização**: a folha gerada é analisada e recebe uma decisão — autorizada, cancelada ou rejeitada.
4. **Fila da DIRAF** (Diretoria de Administração e Finanças): a folha autorizada segue para aprovação ou rejeição final.
5. **Remessa bancária**: gera-se a remessa para o banco (Bandes), acompanha-se o retorno e, quando necessário, solicitam-se os recursos correspondentes.

**Geração das parcelas de uma bolsa**

1. Quando uma bolsa está ativa, o sistema gera as parcelas de pagamento do bolsista junto ao serviço de pagamento, cobrindo os meses de vigência da atividade.
2. Cada parcela nasce com uma **referência** própria e um valor previsto, associada ao mês de competência.
3. Se a bolsa é estendida (aditivo de vigência), o sistema gera parcelas adicionais para os novos meses, sem mexer no que já foi consolidado.

## Regras de negócio

**Geração da folha e das parcelas**
- As parcelas são geradas junto ao serviço de pagamento de bolsistas. Se esse serviço está indisponível, a geração falha com aviso claro de indisponibilidade.
- Se o serviço responde mas não devolve nenhuma parcela, o sistema avisa que nenhum pagamento foi retornado.
- Datas inválidas vindas na geração (anteriores a 1950) são normalizadas para "sem data", evitando registros com datas absurdas.

**Referência de pagamento**
- Cada parcela recebe uma referência no formato `{Sigla}-{Ano}-{Sequência}` — a sigla da modalidade/nível, o ano e um número sequencial. É o identificador legível pelo qual a parcela é reconhecida.

**Pagamento adiantado (avançado)**
- Algumas bolsas não seguem o pagamento sequencial mês a mês: elas têm as parcelas distribuídas manualmente em meses específicos escolhidos dentro da vigência.
- Ao criar as parcelas adiantadas, todas as datas informadas precisam estar dentro do período de vigência da bolsa; datas fora do período são recusadas.
- A quantidade de datas informadas precisa ser exatamente igual à quantidade de cotas alocadas da bolsa; divergência é recusada.
- As parcelas adiantadas nascem na situação "programado".
- **Ajuste de datas**: só é permitido alterar a data de uma parcela que esteja na situação "programado". Parcelas em qualquer outra situação (por exemplo, já pagas) não podem ter a data alterada.
- Ao ajustar uma data de parcela programada, valem as travas: a nova data precisa estar dentro da vigência; não pode ser no mesmo mês do plano mensal atual; não pode ser em mês já passado; e não pode coincidir com uma data já programada para outra parcela (sem duplicidade).

**Extensão de bolsa com pagamento específico**
- Aplica-se apenas a bolsas ativas que já usam pagamento em meses específicos.
- É preciso informar um novo mês de término, posterior ao término atual e dentro da vigência do projeto.
- É preciso informar quantas novas cotas serão adicionadas (maior que zero), e essas cotas precisam caber nos meses futuros ainda elegíveis.
- Os meses já pagos, o mês atual e os meses futuros já configurados anteriormente permanecem travados; só meses futuros ainda não usados podem receber as novas cotas.
- A janela de novos meses começa após o maior valor entre "término atual + 1 mês" e "mês atual + 1 mês" e vai até o novo término informado.
- A quantidade de meses selecionados precisa ser exatamente igual à quantidade de novas cotas. É obrigatório informar justificativa antes de enviar, e a disponibilidade é validada pela quantidade de novas cotas (não pela diferença total de meses).

**Bônus**
- Além do valor original da parcela, pode haver um valor de bônus — um acréscimo aplicável a bolsistas de certas modalidades em determinado mês. A parcela guarda separadamente o valor original, o valor de bônus e o valor efetivamente pago.

**Acompanhamento pelo bolsista**
- O bolsista consulta o próprio histórico de pagamentos, com as situações apresentadas de forma simplificada (ver a seção de estados).
- Se os dados de identificação do bolsista vierem vazios, a consulta falha com aviso de que as informações de acesso vieram vazias.

**Acompanhamento pelo coordenador**
- O coordenador atual do projeto consulta os pagamentos da sua equipe, vendo apenas os bolsistas vinculados àquele projeto.
- Cada item traz nome do bolsista, mês de competência, mês de pagamento, sigla, valor e situação.
- A consulta é filtrável por nome do bolsista, competência (mês e ano), modalidade/nível e situação.
- A lista é paginada; parâmetros inválidos de paginação (por exemplo, página zero ou tamanho acima do limite permitido) são recusados com erro de validação.
- Um coordenador não consegue consultar os pagamentos de um projeto que não coordena.

**Plano mensal**
- Existe um plano mensal de referência com os marcos do mês (solicitação de bolsa, envio de documentos, geração da folha e pagamento). Ele é consultável por data.
- A consulta a um mês sem plano definido retorna aviso de que não há plano mensal.

## Estados e transições

Cada parcela passa por situações internas ao longo do processo. Para o bolsista, elas são apresentadas de forma simplificada:

| Situação interna da parcela | Como o bolsista vê |
|---|---|
| Alocado, em folha, enviado | Pendente |
| Falha de agendamento, agendado | Pendente |
| Programado | Pendente |
| Pago, pagamento externo | Pago |
| Cancelado | Cancelado |
| Suspenso por solicitação | Suspenso |

- Uma parcela normal caminha de "alocado" → "em folha" → "enviado"/"agendado" → "pago" à medida que a folha é gerada, autorizada, enviada ao banco e efetivada.
- Uma parcela de pagamento adiantado nasce "programado" e só pode ter a data ajustada enquanto permanecer nessa situação.
- "Pagamento externo" representa uma parcela efetivada por fora do fluxo padrão, mas que para o bolsista aparece igualmente como paga.
- "Suspenso por solicitação" reflete uma suspensão pedida sobre aquela parcela.

## Casos especiais e exceções

- **Serviço de pagamento indisponível**: geração recusada com aviso de indisponibilidade.
- **Resposta sem parcelas**: aviso de que nenhum pagamento foi retornado.
- **Datas absurdas na geração** (anteriores a 1950): normalizadas para "sem data".
- **Ajuste de data em parcela não programada**: recusado — apenas parcelas "programado" podem ser alteradas.
- **Data no mesmo mês do plano mensal atual**: recusada.
- **Data em mês já passado**: recusada.
- **Data duplicada** (já existe parcela programada para a mesma data): recusada.
- **Quantidade de datas diferente das cotas alocadas** (pagamento adiantado): recusada.
- **Datas fora da vigência** (pagamento adiantado): recusadas.
- **Coordenador consultando projeto alheio**: recusado, por não ser coordenador daquele projeto.
- **Paginação inválida** na consulta da equipe: erro de validação.
- **Dados de acesso vazios** na consulta do bolsista: erro informando que as informações vieram vazias.
- **Plano mensal inexistente** para a data consultada: aviso de que não há plano mensal.

## Dados envolvidos

[[PagamentoBolsista]] · [[AlocacaoBolsista]] · [[PlanoMensal]] · [[VersaoNivel]]

## Funcionalidades relacionadas

[[implementacao-de-bolsa]] · [[remanejamento-de-cotas]] · [[cancelamento-de-bolsa]] · [[prestacao-de-contas]] · [[painel-e-indicadores]] · [[notificacoes]] · [[autenticacao-autorizacao]]
