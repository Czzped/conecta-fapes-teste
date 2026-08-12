---
title: Cancelamento de Bolsa
tipo: requisito
---
# Cancelamento de Bolsa

O cancelamento de bolsa é a funcionalidade pela qual o coordenador de um projeto encerra uma bolsa vigente, informando a data de fim das atividades (vigência do cancelamento) e uma justificativa. O comportamento do cancelamento não é único: ele depende de quando a solicitação é feita em relação ao calendário mensal de pagamentos. A ideia central é conciliar a gestão da bolsa com a área de pagamentos, evitando que um cancelamento produza efeitos retroativos incompatíveis com uma folha de pagamento que já foi processada.

Para isso, o sistema distingue três janelas dentro do mês corrente da solicitação, delimitadas por dois marcos: o **dia 15/16** do mês e o **marco de geração de folha** do plano mensal daquele mês de competência. Conforme a data em que o coordenador registra a solicitação, o cancelamento pode ser **imediato** (efetivado na hora, com a bolsa passando a cancelada), um **pré-cancelamento** (aceito e registrado, mas com a bolsa mantida ativa até que um processamento externo efetive o encerramento) ou sujeito a uma **restrição de datas** que impede retroação quando a folha já foi gerada.

Público-alvo desta nota: analistas de produto e QA que precisam validar exaustivamente as janelas de datas, os marcos de calendário e os estados resultantes do cancelamento.

## Atores

- **Coordenador do projeto**: único ator que solicita o cancelamento. Informa a data de fim das atividades e a justificativa e confirma a operação.
- **Sistema (validação de calendário)**: determina a regra aplicável a partir da data da solicitação e do marco de geração de folha, aceita ou rejeita a data informada e define se o cancelamento é imediato ou pré-cancelamento.
- **Processamento externo de folha**: efetiva posteriormente o encerramento das bolsas que ficaram em pré-cancelamento. Está fora do escopo desta funcionalidade, mas é o destinatário dos dados registrados.

## Fluxo principal

1. Na lista de bolsistas do projeto, o coordenador seleciona uma bolsa ativa e aciona o cancelamento.
2. O coordenador informa a justificativa de cancelamento e o último dia de atividade (data de fim).
3. O coordenador confirma a operação.
4. O sistema valida que a bolsa existe, que o solicitante é coordenador do projeto, que a bolsa está em status elegível e que a justificativa atende às validações existentes.
5. O sistema localiza o plano mensal do mês de competência derivado da data de início da alocação e obtém o marco de geração de folha.
6. O sistema determina a regra aplicável **com base na data da solicitação** (e não apenas na data de fim informada) e valida a data de fim contra a janela permitida.
7. O sistema conclui de uma das formas:
   - **Cancelamento imediato**: registra o cancelamento localmente e a bolsa passa para o status cancelada.
   - **Pré-cancelamento**: registra a solicitação (data de fim e data da solicitação), mantém a bolsa ativa e informa que o cancelamento foi solicitado e será efetivado por processamento externo.
   - **Rejeição**: recusa a data informada e exibe mensagem explicativa quando ela viola a janela permitida.

## Regras de negócio

### Pré-condições e validações comuns

- **Status elegível**: só é possível cancelar bolsas em status cancelável pelo coordenador. As restrições já existentes são preservadas: bolsas já canceladas, finalizadas ou em status não elegível continuam bloqueadas.
- **Status cancelável de partida**: a operação parte de uma bolsa **ativa ou suspensa**.
- **Justificativa obrigatória**: a justificativa é obrigatória e deve obedecer às validações existentes (inclui um tamanho mínimo já definido).
- **Plano mensal obrigatório**: deve existir um plano mensal para o mês de competência derivado da data de início da alocação. Se não existir, a solicitação é impedida e o sistema retorna erro claro informando que não foi encontrado plano mensal correspondente para validar o cancelamento.
- **Data de fim dentro do mês corrente**: a data de fim informada deve pertencer ao mês corrente da solicitação. Datas fora desse mês são rejeitadas.
- **A regra vale pela data da solicitação**: o sistema determina qual das três janelas se aplica com base na data em que o coordenador registra a solicitação.

### Janela A — solicitação feita antes do dia 16

- Janela válida para a data de fim: **do primeiro dia do mês corrente até a data da solicitação** (o dia atual).
- **Cancelamento imediato** ocorre quando a solicitação é feita **até o dia 15** e a data de fim também é **até o dia 15** do mesmo mês corrente. Nesse caso, a bolsa passa imediatamente para cancelada.
- Se a data de fim for **posterior ao dia 15**, a solicitação é aceita, mas vira **pré-cancelamento**: o sistema registra a solicitação sem cancelar imediatamente a bolsa.

### Janela B — solicitação feita do dia 16 até a véspera do marco de geração de folha

- Janela válida para a data de fim: **dentro do mês corrente**, conforme as demais regras de vigência da bolsa.
- O resultado é sempre **pré-cancelamento**: a data de fim é aceita, mas o **status da bolsa permanece ativo**.
- A resposta ao coordenador deve deixar claro que o cancelamento foi **solicitado** e será **efetivado por processamento externo** (registrado para processamento posterior).

### Janela C — solicitação feita no dia do marco de geração de folha ou depois

- Janela válida para a data de fim: **da data da solicitação até o último dia do mês corrente**.
- **Datas anteriores à data da solicitação são rejeitadas** (não é permitido retroagir a vigência naquele mês).
- Quando a tentativa envolve uma data não permitida, o sistema exibe mensagem informativa clara explicando que a folha do mês já foi gerada e que o cancelamento produzirá efeitos apenas a partir da data informada, não sendo possível definir data retroativa para aquele mês.

### Marco de geração de folha

- O marco de geração de folha é obtido do plano mensal do **mesmo mês de competência associado à data de início da alocação**.
- Ele é a referência temporal que separa o pré-cancelamento com retroação permitida (Janelas A e B) do bloqueio de retroação (Janela C).

### Efeitos e continuidade

- No **cancelamento imediato**, o encerramento é efetivo localmente (não depende de processamento externo).
- No **pré-cancelamento**, o sistema mantém preenchidos os dados necessários (data da solicitação de cancelamento e data de fim das atividades) para que o processamento externo efetive posteriormente o encerramento.
- O sistema deve funcionar corretamente na virada do mês, recalculando a janela de datas válidas conforme o novo mês corrente e o plano mensal correspondente.

## Estados e transições

| Situação da bolsa | Condição da solicitação | Resultado | Status final |
|---|---|---|---|
| Ativa ou suspensa | Solicitação até o dia 15 **e** data de fim até o dia 15 do mesmo mês | Cancelamento imediato | Cancelada |
| Ativa ou suspensa | Solicitação antes do dia 16, data de fim posterior ao dia 15 | Pré-cancelamento | Permanece ativa |
| Ativa ou suspensa | Solicitação do dia 16 até a véspera do marco de geração de folha, data de fim válida no mês | Pré-cancelamento | Permanece ativa |
| Ativa ou suspensa | Solicitação no dia do marco de geração de folha ou depois, data de fim entre a solicitação e o fim do mês | Aceita | (Efetivação por processamento externo) |
| Ativa ou suspensa | Solicitação no dia do marco de geração de folha ou depois, data de fim anterior à solicitação | Rejeitada | Inalterada |

> Nas listagens, uma bolsa que teve pré-cancelamento aceito pode continuar sendo identificada por um estado derivado de "pré-cancelada", ainda que o status permaneça ativo até a efetivação externa.

## Casos especiais e exceções

- **Solicitação exatamente no dia 15**: continua permitindo cancelamento imediato apenas quando a data de fim também for até o dia 15 do mesmo mês.
- **Solicitação exatamente no dia 16**: muda para a regra condicionada ao marco de geração de folha (Janela B), deixando de haver cancelamento imediato.
- **Solicitação exatamente no dia do marco de geração de folha**: segue a regra mais restritiva (Janela C), sem permitir data anterior à data da solicitação.
- **Plano mensal inexistente**: quando não existe plano mensal para o mês de competência usado na validação, a solicitação é impedida com erro claro.
- **Bolsa em status não cancelável**: quando a bolsa já está cancelada, finalizada ou em status não elegível, a operação continua bloqueada.
- **Data de fim fora do mês corrente**: sempre rejeitada.
- **Ajuste de mensagens**: as mensagens ao usuário podem ser ajustadas e consumidas pela interface existente sem criar novo fluxo de aprovação.

## Dados envolvidos

- [[AlocacaoBolsista]]
- [[PlanoMensal]]
- [[PagamentoBolsista]]
- [[Projeto]]
- [[Coordenacao]]

## Funcionalidades relacionadas

- [[solicitacao-de-bolsa]]
- [[implementacao-de-bolsa]]
- [[pagamentos]]
- [[voluntariacao]]
