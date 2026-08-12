---
title: Configuração Financeira do Projeto
tipo: requisito
---

# Configuração Financeira do Projeto

<contexto>
Antes que um coordenador consiga prestar contas de um projeto, a FAPES precisa deixar montada a base financeira daquele projeto. Essa base tem três peças: as **contas bancárias** do projeto (de onde saem e para onde entram os recursos), o **orçamento** do projeto (quanto foi planejado para bolsas e quanto para as demais despesas, por ano) e a **estrutura de rúbricas** — as categorias contábeis, organizadas em rúbricas e subrúbricas, usadas para classificar cada despesa. Sobre essa base, o sistema ainda oferece um **resumo financeiro** que compara o que foi orçado com o que já foi realizado, permitindo acompanhar o consumo do orçamento sem precisar somar nada manualmente.

Este documento descreve a **configuração e a consulta dessa base**: como a FAPES cadastra e mantém contas bancárias, orçamento e rúbricas, e como qualquer interessado consulta o resumo de orçado x realizado. É a peça complementar de [[prestacao-de-contas]]: lá está o fluxo de montar, submeter e aprovar uma prestação; aqui está a fundação que a prestação consome. Quem monta a prestação (o coordenador) apenas **consulta** essa base — quem a **configura** é a FAPES.
</contexto>

## Atores

- **Responsável FAPES (Analista)** — configura e administra toda a base financeira do projeto: cadastra e edita as contas bancárias, cria e edita o orçamento anual, cria e edita as rúbricas (contas contábeis) e suas subrúbricas, e importa as movimentações bancárias. É o único perfil que pode **criar ou alterar** qualquer parte dessa base.
- **Coordenador** — usa a base como referência ao montar a prestação de contas: consulta o orçamento do projeto, as rúbricas disponíveis para classificar despesas e os dados da conta bancária. Tem acesso **somente de leitura** a toda a configuração financeira — não cria nem altera contas bancárias, orçamento ou rúbricas.
- **Qualquer usuário autenticado** — pode consultar o resumo financeiro (orçado x realizado) de um projeto. Essa consulta não exige vínculo do usuário com o projeto: basta estar autenticado.

> As permissões de administração da base (criar/editar contas bancárias, orçamento e rúbricas) são exclusivas da FAPES. O coordenador enxerga a base, mas não a modifica.

## Fluxo principal

1. **Cadastro das contas bancárias.** A FAPES registra as contas bancárias do projeto (banco, agência, número e titular). São essas contas que recebem os repasses e de onde saem os pagamentos do projeto.
2. **Importação das movimentações.** A FAPES importa o extrato bancário, gerando as movimentações financeiras (entradas e saídas) vinculadas à conta. Essas movimentações são o que o coordenador depois vincula à prestação.
3. **Criação do orçamento anual.** A FAPES cria o orçamento do projeto para um ano, definindo quanto está previsto para **bolsas** e quanto para **capital** (as demais despesas). O valor total do orçamento é a soma desses dois blocos.
4. **Definição das rúbricas.** Dentro do orçamento, a FAPES cria as **rúbricas** (categorias contábeis, como Material de Consumo, Equipamentos ou Passagens), cada uma com seu **limite** de gasto. Cada rúbrica pode ser detalhada em **subrúbricas** (segundo nível), também com limites próprios.
5. **Importação em uma etapa (opcional).** Em vez de criar tudo peça por peça, a FAPES pode **importar o orçamento junto com toda a estrutura de rúbricas e subrúbricas** de uma só vez, numa única operação — inclusive projetos que ainda não tinham orçamento.
6. **Uso pelo coordenador.** Com a base pronta, o coordenador passa a **consultar** o orçamento, as rúbricas do projeto e a conta bancária enquanto monta a prestação (o fluxo de prestação está em [[prestacao-de-contas]]).
7. **Acompanhamento do consumo.** A qualquer momento, o resumo financeiro do projeto mostra o **orçado x realizado**: valor total do orçamento, valor já gasto, percentual utilizado e a quebra do gasto por rúbrica.

## Regras de negócio

### Contas bancárias do projeto

- A conta bancária guarda **banco, agência, número e titular** e pertence a um projeto.
- A conta tem um **saldo atual** que acompanha as movimentações; esse saldo **nunca pode ser negativo**.
- Só a FAPES cadastra e edita contas bancárias. O coordenador apenas consulta os dados de uma conta.
- As movimentações financeiras são **importadas** pela FAPES a partir do extrato; cada movimentação é uma entrada (crédito) ou saída (débito) e fica associada à conta bancária. O tratamento dessas movimentações (classificação de créditos, estornos, vínculo com prestação) está detalhado em [[prestacao-de-contas]].

### Orçamento anual do projeto

- O orçamento pertence a um projeto e é definido **por ano**. Ele separa o planejado em dois blocos: **valor de bolsas previsto** (recursos para bolsas) e **valor de capital previsto** (recursos para as demais despesas — equipamentos, materiais, passagens etc.).
- O **valor total** do orçamento é a soma do previsto de bolsas com o previsto de capital.
- O orçamento controla **saldos** próprios: saldo de bolsas, saldo de capital e saldo total, comparando o previsto com o já consumido em cada bloco.
- Só a FAPES cria e edita o orçamento. O coordenador tem acesso somente de leitura.
- **Um orçamento por projeto na importação**: se o projeto já tem orçamento, uma nova importação de orçamento é recusada — a proteção contra orçamento duplicado é mantida.

### Rúbricas (contas contábeis) e subrúbricas

- A **rúbrica** (também chamada de conta contábil) é a categoria onde cada despesa é classificada. Ela pertence a um orçamento e tem uma **descrição** e um **limite** de gasto.
- As rúbricas formam uma **árvore de dois níveis**: rúbricas de topo (raiz) e, abaixo delas, **subrúbricas** (o nível folha, mais detalhado). Uma subrúbrica sempre pertence a uma rúbrica pai e ao mesmo orçamento.
- O **limite nunca pode ser negativo**, tanto para rúbricas de topo quanto para subrúbricas.
- **Descrição obrigatória** em toda rúbrica e subrúbrica.
- **Sem duplicidade de descrição no mesmo nível**, comparando sem diferenciar maiúsculas/minúsculas e ignorando espaços nas pontas:
  - duas rúbricas de topo do mesmo orçamento não podem ter a mesma descrição;
  - duas subrúbricas da mesma rúbrica pai não podem ter a mesma descrição;
  - subrúbricas com a mesma descrição **em rúbricas pais diferentes são permitidas**.
- **Limites encaixados**: a soma dos limites das rúbricas de topo não pode ultrapassar o **valor de capital previsto** do orçamento; e a soma dos limites das subrúbricas não pode ultrapassar o limite da rúbrica pai.
- O **saldo de uma rúbrica** é o seu limite menos a soma dos itens de despesa classificados nela. Saldo positivo significa limite disponível; saldo negativo sinaliza que o limite foi ultrapassado.
- Só a FAPES cria e edita rúbricas (inclusive ajustar limites). O coordenador consulta as rúbricas disponíveis para classificar os itens da prestação.

### Importação do orçamento com rúbricas e subrúbricas

- A FAPES pode importar, **numa única operação**, o orçamento e toda a estrutura de rúbricas de topo com suas subrúbricas — evitando ter que cadastrar peça por peça depois.
- A importação **aceita subrúbricas de forma opcional**: um envio só com rúbricas de topo (sem subrúbricas) continua válido e funciona como antes. Rúbrica de topo sem subrúbricas é válida; lista de subrúbricas vazia é tratada como "sem subrúbricas".
- A importação é **tudo-ou-nada**: se qualquer rúbrica ou subrúbrica for inválida, a importação inteira é recusada e **nada** é gravado (não há importação parcial). As mesmas validações de descrição obrigatória, limite não negativo, duplicidade por nível e limites encaixados são aplicadas antes de gravar.
- Ao concluir, a importação devolve a estrutura criada em **formato hierárquico** (rúbricas com suas subrúbricas), para conferência imediata.

### Consulta das rúbricas por projeto

- É possível consultar, de uma vez, **todas as rúbricas do orçamento de um projeto**, já com sua estrutura de subrúbricas preservada e ordenadas em **ordem alfabética** pela descrição no nível de topo.
- A consulta é **isolada por projeto**: nunca traz rúbricas de outro projeto.
- Distinção importante entre dois cenários:
  - projeto **com** orçamento mas **sem** rúbricas → devolve **lista vazia** (é um resultado válido, não um erro);
  - projeto **sem** orçamento → devolve **não encontrado**, sinalizando que sequer existe base financeira montada.
- A consulta é **estritamente de leitura**: não cria, altera nem remove nada como efeito colateral.

### Classificação contábil nos itens da prestação

- Ao visualizar uma prestação completa, cada item de nota fiscal traz junto os **dados da sua rúbrica** (descrição, limite e saldo), a **rúbrica pai** resumida (quando existir) e a lista de **subrúbricas** diretas resumidas — permitindo enxergar a classificação contábil completa do item sem precisar de consultas adicionais.
- Quando o item **não tem rúbrica vinculada** (ou aponta para uma rúbrica que não existe mais), a classificação vem **vazia**, sem erro.
- Cada item exibe exatamente a **sua própria** rúbrica; não há mistura de dados de rúbrica, pai ou subrúbricas entre itens diferentes.

### Resumo financeiro do projeto (orçado x realizado)

- O resumo consolida, em uma única consulta, o **orçado x realizado** de um projeto:
  - **valor total do orçamento** — o total planejado;
  - **valor gasto** — a soma **exclusivamente** dos gastos já efetivamente lançados (itens de despesa classificados no orçamento);
  - **percentual utilizado** — o valor gasto dividido pelo total do orçamento, multiplicado por 100;
  - **detalhamento por rúbrica** — a quebra do valor consumido em cada rúbrica.
- O **detalhamento inclui todas as rúbricas** vinculadas ao orçamento, mesmo as que ainda não tiveram gasto (aparecem com consumo **zero**), ordenadas em **ordem alfabética** pela descrição.
- **Consistência garantida**: o valor gasto é sempre **exatamente igual** à soma dos valores consumidos no detalhamento por rúbrica, sem divergência por arredondamento.
- **Só conta o que foi realizado**: valores apenas previstos, limites planejados de rúbrica ou gastos não efetivamente lançados **não entram** no valor gasto.
- **Isolamento por orçamento**: gastos classificados numa rúbrica que não pertence ao orçamento consultado não aparecem no detalhamento nem influenciam o valor gasto.
- A consulta é **somente de leitura** e exige apenas usuário autenticado — qualquer usuário autenticado pode consultar o resumo de qualquer projeto, sem precisar de vínculo com ele.

## Estados e transições

A configuração financeira não tem uma máquina de estados própria como a prestação. O que existe é uma ordem de montagem e a distinção entre configurar e consultar:

| Situação | O que significa | O que é possível |
|---|---|---|
| Projeto sem orçamento | Base financeira ainda não montada | A FAPES precisa criar o orçamento (ou importá-lo); consultas de rúbricas e resumo respondem "não encontrado" |
| Orçamento sem rúbricas | Orçamento criado, mas sem categorias contábeis | A FAPES cadastra rúbricas/subrúbricas; a consulta de rúbricas devolve lista vazia |
| Base completa | Contas bancárias, orçamento e rúbricas configurados | O coordenador consulta e classifica despesas na prestação; o resumo orçado x realizado fica disponível |

Sobre o consumo: à medida que despesas são lançadas e classificadas em rúbricas (no fluxo de [[prestacao-de-contas]]), o **valor gasto** e o **percentual utilizado** do resumo sobem, e os **saldos** das rúbricas e do orçamento diminuem. Essas mudanças são reflexo do lançamento de despesas, não de uma ação sobre a própria configuração.

## Casos especiais e exceções

- **Projeto sem orçamento.** Consultar as rúbricas ou o resumo financeiro de um projeto que não tem orçamento devolve "não encontrado" — deliberadamente diferente de "lista vazia", para distinguir "base não montada" de "montada mas sem itens".
- **Orçamento com valor total zero.** No cálculo do percentual utilizado, o sistema evita divisão por zero e devolve **zero**, sem falhar a consulta.
- **Gasto acima do orçamento.** O percentual utilizado pode passar de 100 (por exemplo, 110): o valor real é devolvido **sem cortar em 100** e sem sinalização extra — cabe à tela decidir como destacar esse cenário.
- **Projeto sem gastos.** O resumo devolve valor gasto zero, percentual zero e o detalhamento listando todas as rúbricas com consumo zero — sem erro.
- **Rúbrica sem gasto no detalhamento.** Toda rúbrica do orçamento aparece no detalhamento, inclusive as que nunca receberam despesa (consumo zero); elas não inflam o valor gasto.
- **Limites encaixados violados.** Tentar cadastrar/importar rúbricas cuja soma de limites ultrapassa o capital previsto (nas de topo) ou o limite do pai (nas subrúbricas) é recusado.
- **Duplicidade de descrição.** Descrições repetidas no mesmo nível (respeitando maiúsculas/minúsculas e espaços nas pontas) são recusadas; repetição entre pais diferentes é aceita.
- **Importação em projeto que já tem orçamento.** É recusada — a proteção contra orçamento duplicado por projeto permanece.
- **Importação com qualquer item inválido.** A importação inteira é recusada; nada é gravado, evitando estrutura contábil pela metade.
- **Saldo bancário negativo.** O saldo da conta bancária não pode ficar negativo.
- **Item da prestação sem rúbrica válida.** Item sem rúbrica, ou apontando para rúbrica inexistente, é exibido com classificação vazia, sem erro.

## Dados envolvidos

- [[ContaBancaria]] — conta bancária do projeto (banco, agência, número, titular e saldo).
- [[Orcamento]] — orçamento anual do projeto, com previsto de bolsas e de capital.
- [[ContaContabil]] — rúbricas e subrúbricas (árvore de dois níveis), com descrição, limite e saldo.
- [[OrcamentoFornecedor]] — cotações de fornecedor associadas às justificativas de despesa.
- [[TransacaoFinanceira]] — movimentações bancárias importadas para a conta do projeto.
- [[ItemDocumentoFiscal]] — itens de nota fiscal classificados nas rúbricas.
- [[ItemInvoice]] — itens de fatura internacional classificados nas rúbricas.
- [[Prestacao]] — o envelope da prestação que consome esta base.
- [[Projeto]] — o projeto a que a base financeira pertence.

## Funcionalidades relacionadas

- [[prestacao-de-contas]] — o fluxo de montar, submeter, analisar e aprovar prestações que consome toda esta base financeira.
- [[pagamentos]] — origem dos recursos e das movimentações que alimentam as contas bancárias do projeto.
- [[importacao-de-editais]] — origem dos projetos que recebem a configuração financeira.
- [[autenticacao-autorizacao]] — define quem atua como responsável FAPES (configura) e como coordenador (consulta) sobre a base.
