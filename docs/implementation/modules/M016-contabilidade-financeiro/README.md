# M016 - Contabilidade e Financeiro

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 05 -- Financeiro](../../../discovery/domains/05-financeiro.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da ConciliacaoBancaria |
| [Acao Transversal](acao-transversal/README.md) | Gestao financeira institucional da reserva de Acao Transversal vinculada a Parcerias |

---

## Sobre o Modulo

A agencia de fomento necessita de controle contabil (plano de contas, lancamentos vinculados a programas, parcerias e iniciativas) e gestao financeira (contas bancarias, fluxo de caixa, conciliacao, controle de saldos). Atualmente esses processos estao dispersos em planilhas e sistemas externos sem integracao, gerando inconsistencias nos dados financeiros, dificuldade de rastreamento de recursos e atrasos na conciliacao bancaria. Este modulo visa resolver esses problemas ao centralizar a gestao contabil e financeira em uma unica plataforma integrada. O sucesso sera medido pela reducao do tempo de conciliacao bancaria e pela acuracia dos saldos contabeis.

---

## Dominio

A agencia de fomento gerencia recursos financeiros provenientes de diversas fontes para fomento a pesquisa e inovacao. O controle financeiro envolve duas grandes areas: contabilidade e gestao de contas bancarias.

Na area contabil, a agencia de fomento mantem um plano de contas que segue a estrutura do governo, onde cada conta contabil pode ser associada a iniciativas, programas ou parcerias. O plano de contas permite a classificacao dos lancamentos financeiros e a geracao de dashboards contabeis que apoiam a tomada de decisao.

Na area de gestao financeira, cada iniciativa apoiada, programa ou parceria pode possuir uma ou mais contas bancarias associadas. As movimentacoes financeiras (entradas e saidas) sao registradas e rastreadas por conta. Periodicamente, e necessario realizar a conciliacao bancaria, comparando os registros do sistema com os extratos bancarios para identificar divergencias. O fluxo de caixa consolida as movimentacoes e permite projetar a disponibilidade de recursos.

Dashboards financeiros fornecem visao consolidada de saldos, movimentacoes e projecoes, apoiando gestores na alocacao de recursos e no cumprimento de obrigacoes financeiras.

> Iniciativas sao gerenciadas por M003 como abstracao estrutural, enquanto programas e parcerias sao gerenciados por M010. Este modulo consome esses contextos para operacionalizar a gestao contabil e financeira. O M010 tambem consome este modulo: a operacao `RegistrarAporteFinanceiro` referencia `ContaBancaria` (M016) como destino do deposito via `contaBancariaDestinoId`.

## Conceitos Financeiros

| Conceito | Pergunta que responde | Definicao | Exemplos |
|----------|-----------------------|-----------|----------|
| Conta contabil | Que natureza contabil tem este recurso ou despesa? | Classificacao do plano de contas usada para registrar receitas, despesas, ativos, passivos e demais lancamentos contabeis. | Receita de parcerias, despesa com diarias, despesa com servicos de terceiros. |
| Fundo financeiro | Em qual carteira/fonte segregada este dinheiro esta? | Agrupador financeiro que separa uma massa de recursos para controle de saldo, origem, disponibilidade e conciliacao. | Carteira Acao Transversal FAPES, Fundo de Parcerias Institucionais, Fundo de Pesquisa e Inovacao. |
| Centro de custo | Qual area, unidade ou finalidade interna e responsavel pelo consumo? | Estrutura gerencial que atribui responsabilidade pelo uso do recurso a uma area/finalidade institucional. | Gerencia de Parcerias, Diretoria Tecnico-Cientifica, Gestao Institucional de Programas. |
| Rubrica | Em que categoria de gasto o recurso sera planejado ou executado? | Categoria orcamentaria/despesa usada no planejamento e na execucao do gasto. No ConectaFAPES, rubricas de referencia sao fornecidas por M008 e orcamentos de projeto sao geridos no M013. | Diarias, passagens, publicacoes, servicos de terceiros, material permanente. |
| Orcamento do projeto | Qual limite aprovado o projeto pode gastar por rubrica? | Planejamento/limite financeiro aprovado para uma Iniciativa/Projeto. Nao e conta contabil. | Orcamento de R$ 100.000,00 distribuido entre bolsas, custeio, capital e diarias. |

Resumo operacional: **orcamento** define limite planejado; **rubrica** classifica a categoria do gasto; **conta contabil** registra a natureza contabil; **fundo financeiro** segrega a carteira/fonte; **centro de custo** indica quem responde pelo consumo.

### Acao Transversal

A Acao Transversal e tratada neste modulo como gestao financeira institucional da agencia de fomento. O M010 calcula e reserva o percentual na Parceria, bloqueando esse valor para aportes em Programas. A partir dessa reserva, o M016 controla o plano de aplicacao, a execucao financeira, documentos comprobatórios, glosas, estornos, saldos e a prestacao financeira institucional.

Essa prestacao financeira institucional **nao** substitui nem pertence ao M014. O M014 continua sendo o contexto dono da prestacao de contas da Iniciativa/Projeto, feita pelo coordenador ou outorgado sobre os recursos executados na iniciativa. A Acao Transversal pertence a gestao financeira interna da agencia, pois cobre despesas operacionais e administrativas da propria FAPES/agencia.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | O plano de contas deve seguir a estrutura do plano de contas do governo. | Must |
| RN02 | Toda conta contabil deve estar associada a pelo menos uma iniciativa, programa ou parceria. | Must |
| RN03 | Cada iniciativa apoiada deve possuir pelo menos uma conta bancaria associada, podendo haver compartilhamento no nivel de programa ou parceria quando aplicavel. | Must |
| RN04 | A conciliacao bancaria deve comparar os registros do sistema com os registros do extrato bancario. | Must |
| RN05 | O saldo de uma conta bancaria nao pode ficar negativo sem autorizacao expressa de gestor autorizado. | Must |
| RN06 | Toda movimentacao financeira deve possuir trilha de auditoria completa (usuario, data, hora, operacao). | Must |
| RN07 | A associacao entre contas contabeis e iniciativas/programas/parcerias e obrigatoria para lancamentos. | Must |
| RN08 | Uma conciliacao so pode ser iniciada se nao houver outra em andamento para a mesma conta bancaria. | Should |
| RN09 | Divergencias identificadas na conciliacao devem ser registradas e tratadas antes do fechamento. | Must |
| RN10 | O fluxo de caixa deve consolidar movimentacoes realizadas e projetadas. | Should |
| RN11 | Toda reserva de Acao Transversal recebida do M010 deve manter rastreabilidade com a Parceria de origem, aporte financeiro de origem, politica aplicada, percentual, valor base e valor reservado. | Must |
| RN12 | Toda reserva de Acao Transversal deve ser classificada em conta contabil, fundo financeiro e centro de custo institucional antes do plano de aplicacao por rubricas. | Must |
| RN13 | Despesas de Acao Transversal devem estar vinculadas a reserva, rubrica, documento comprobatório e unidade/centro financeiro responsavel. | Must |
| RN14 | A prestacao financeira institucional da Acao Transversal consolida despesas internas da agencia e nao pode ser usada para prestar contas de Iniciativas ou Projetos, que pertencem ao M014. | Must |
| RN15 | O plano de aplicacao da Acao Transversal deve distribuir o valor reservado em rubricas permitidas e nao pode ultrapassar o saldo da reserva. | Must |
| RI1 | Uma conta contabil nao pode ser excluida se possuir lancamentos associados. | Must |
| RI2 | Uma conta bancaria nao pode ser excluida se possuir movimentacoes registradas. | Must |
