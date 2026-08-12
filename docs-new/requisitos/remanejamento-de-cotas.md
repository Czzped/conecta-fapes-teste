---
title: Remanejamento de Cotas
tipo: requisito
---

# Remanejamento de Cotas

Durante a vigência de um [[Projeto]], a quantidade de bolsas prevista para cada nível (a "cota planejada") pode precisar de ajustes: um nível recebe mais bolsistas do que o esperado, outro fica ocioso, uma nova modalidade passa a ser usada. O remanejamento é a operação que redistribui essas cotas entre os níveis, sempre dentro do orçamento de bolsa do projeto, sem nunca sobrescrever o planejamento anterior. Cada ajuste cria um novo planejamento e preserva o anterior como histórico permanente, de modo que o projeto tem sempre uma "foto atual" das cotas e uma trilha completa de como chegou até ela.

O remanejamento mexe **apenas nas cotas planejadas**. Ele não altera as bolsas já concedidas nem as cotas já comprometidas com bolsistas — essas variam pelo próprio ciclo de vida das bolsas (concessão, ativação, cancelamento etc.). É a base que sustenta a solicitação e a concessão de novas bolsas: só é possível conceder até o limite planejado por nível.

## Atores

- **Coordenador do projeto**: usuário identificado pelo vínculo de coordenação atual do projeto (não é um papel fixo, e sim a relação de quem coordena aquele projeto naquele momento). Pode consultar e remanejar as cotas do seu projeto.
- **Administrador**: equipe FAPES. Pode consultar e remanejar as cotas de qualquer projeto, mesmo sem ser coordenador dele.
- **Demais usuários**: não têm acesso ao remanejamento nem à consulta do histórico.

## Fluxo principal

1. O coordenador (ou administrador) abre o planejamento de cotas do projeto e o sistema apresenta o **estado atual** de cada nível: sigla do nível, valor unitário, se a cota é com ou sem redução, cotas planejadas, cotas já utilizadas (alocadas) e cotas disponíveis (planejadas menos utilizadas).
2. O usuário informa a nova distribuição desejada de cotas por nível — pode aumentar um nível, reduzir outro, incluir um nível que ainda não tinha cotas ou zerar um nível.
3. Enquanto edita, a tela mostra uma **simulação em tempo real**: total de valor planejado, orçamento total, saldo restante e percentual utilizado. Se a nova distribuição faria o saldo ficar negativo (valor planejado acima do orçamento), a tela sinaliza e bloqueia o envio.
4. Opcionalmente, o usuário escreve uma **justificativa** em texto livre para a operação.
5. Ao confirmar, o sistema valida a permissão e o orçamento. Sendo tudo válido:
   - o planejamento atual passa a "não atual" (vira histórico);
   - um **novo planejamento** é criado com a distribuição atualizada, tornando-se o atual;
   - novas cotas por nível são geradas para esse novo planejamento;
   - na mesma operação, é gravado um **registro de histórico imutável** da mudança.
6. A partir daí, todo o restante do sistema (solicitação e concessão de bolsas, indicadores) passa a enxergar o novo planejamento como o vigente.

## Regras de negócio

**Quem pode remanejar**
- Apenas o coordenador atual do projeto ou um administrador. Qualquer outra pessoa recebe recusa por falta de permissão sobre o planejamento.
- O administrador pode remanejar mesmo sem ser coordenador daquele projeto.

**Novo planejamento com preservação do histórico**
- Nada é editado no lugar. Cada remanejamento cria um novo planejamento e marca o anterior como "não atual". O projeto tem sempre exatamente um planejamento atual.
- As cotas por nível são recriadas para o novo planejamento, sempre desdobradas em duas trilhas: **com redução** e **sem redução**.

**Limite de orçamento**
- O projeto tem um orçamento de bolsa (em moeda). O valor planejado (soma do que se pretende comprometer por nível, considerando o valor unitário de cada nível) não pode exceder esse orçamento.
- Se o valor planejado ultrapassar o orçamento disponível, a operação é recusada com a mensagem de que o valor planejado excede o orçamento disponível.

**Remanejamento é aditivo (nunca abaixo do já alocado)**
- A nova quantidade planejada de um nível é o total de cotas já alocadas naquele nível mais as cotas adicionais desejadas informadas na operação. Como consequência, nunca se planeja abaixo do que já está comprometido com bolsistas.

**Cálculo das cotas utilizadas**
- Para saber quanto já está comprometido, o sistema conta as bolsas em todas as situações relevantes: documentação pendente, aguardando aceites, pendente de avaliação, em avaliação, ativa, suspensa, finalizada e cancelada. Ou seja, o cálculo é conservador e não libera cota que ainda possa voltar a valer.

**Simulação e saldo negativo**
- A tela exibe simulação em tempo real (saldo, total previsto, percentual utilizado) e bloqueia o envio caso o saldo ficasse negativo, evitando enviar uma distribuição que seria recusada.

**Histórico imutável**
- Cada remanejamento concluído com sucesso gera, na mesma operação, um registro permanente. Se a operação falha na validação (orçamento, permissão ou dados inválidos), nenhum registro é criado.
- O registro nunca pode ser alterado nem removido — não existe edição, exclusão nem exclusão lógica. É somente-leitura para sempre.
- **O que o registro guarda** (cabeçalho): projeto, data e hora, executor (identificação do usuário, CPF e nome), justificativa (quando informada), orçamento de bolsa e valor alocado no momento, e a referência ao planejamento anterior e ao novo.
- **O que o registro guarda** (detalhe por nível): uma linha por combinação de nível + modalidade + trilha de redução (com/sem), contendo a sigla da modalidade, a sigla do nível, a versão de nível de referência, a indicação de redução, as cotas planejadas antes, as cotas planejadas depois e as cotas alocadas no momento. Só entram linhas de níveis que tinham cota planejada ou alocada antes **ou** depois da operação; níveis que nunca tiveram cota ficam de fora.
- **O que é calculado (não guardado)**: as cotas remanejadas (diferença entre depois e antes), as cotas disponíveis (planejadas menos alocadas) e o "tipo de operação" de cada linha são derivados na hora da consulta a partir dos números guardados.

**Quem consulta o histórico**
- A consulta é restrita ao administrador e ao coordenador atual do projeto — a mesma regra de permissão aplicada ao próprio remanejamento. A consulta retorna, além do CPF e nome, a identificação de quem executou.
- Os registros voltam ordenados da operação mais recente para a mais antiga.
- Há filtros combináveis: por período (data inicial e final, inclusivas), por modalidade, por nível, por tipo de operação e por executor. Como uma operação pode ter várias linhas, o filtro por modalidade/nível/tipo retorna a operação inteira quando ao menos uma de suas linhas satisfaz o critério, e o detalhamento continua mostrando todas as linhas.

**Sem retroatividade**
- Remanejamentos ocorridos antes de o histórico passar a existir não têm registro e não aparecem na consulta. Não há reconstrução de operações antigas.

## Estados e transições

**Planejamento de cotas do projeto**
- `Atual` → `Não atual`: no momento em que um novo remanejamento é confirmado, o planejamento vigente deixa de ser o atual e o recém-criado assume. O projeto mantém sempre um único planejamento atual.
- Um planejamento "não atual" nunca volta a ser atual; ele permanece apenas como parte do histórico.

**Tipo de operação de cada linha do histórico** (calculado a partir das cotas antes/depois e alocadas):
- **Inclusão**: o nível não tinha cotas planejadas (antes = 0) e passou a ter (depois > 0).
- **Exclusão**: o nível tinha cotas (antes > 0), ficou sem cotas planejadas (depois = 0) **e** sem cotas alocadas. Só é exclusão quando não sobra nada alocado.
- **Aumento**: as cotas planejadas depois são maiores que antes.
- **Redução**: as cotas planejadas depois são menores que antes, sem se enquadrar em exclusão (ex.: ainda há cotas alocadas no nível).
- **Sem alteração**: as cotas planejadas depois são iguais às de antes; o nível aparece no registro por ter tido cota, mas não mudou.

## Casos especiais e exceções

- **Sem planejamento atual**: se o projeto ainda não tem um planejamento vigente, a consulta do estado de cotas retorna erro informando que não há planejamento de alocação atual para o projeto.
- **Operação mista**: um único remanejamento pode aumentar um nível e reduzir outro ao mesmo tempo. Cada linha do registro carrega o seu próprio tipo de operação.
- **Nível zerado com bolsas ainda vinculadas**: se o coordenador tenta esvaziar um nível que ainda tem cotas alocadas, o resultado é uma redução (não uma exclusão), e a regra aditiva impede planejar abaixo do já alocado.
- **Excede orçamento**: envio recusado, com a mensagem de que o valor planejado excede o orçamento disponível; nenhum planejamento novo e nenhum registro de histórico são criados.
- **Sem permissão**: envio recusado por não ter permissão sobre o planejamento atual; nada é criado.
- **Filtro de período invertido** (data inicial maior que a final): tratado como faixa vazia ou erro de validação, sem retorno inconsistente.
- **Projeto sem histórico**: a consulta retorna lista vazia, sem erro.
- **Justificativa opcional**: a operação com justificativa guarda o texto no registro; a operação sem justificativa é gravada normalmente, apenas sem esse campo.

## Dados envolvidos

[[PlanejamentoAlocacao]] · [[CotasPorNivel]] · [[PlanejamentoNivel]] · [[VersaoNivel]] · [[HistoricoRemanejamento]] · [[HistoricoRemanejamentoItem]] · [[Projeto]] · [[NivelBolsa]] · [[VersaoModalidade]]

## Funcionalidades relacionadas

[[solicitacao-de-bolsa]] · [[implementacao-de-bolsa]] · [[gestao-de-modalidades]] · [[pagamentos]] · [[painel-e-indicadores]] · [[autenticacao-autorizacao]]
