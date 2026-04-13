# M016 - Contabilidade e Financeiro

[<< Voltar ao Backlog Central](../../backlog-product.md) | [Domain 05 -- Financeiro](../../discovery/domains/05-financeiro.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da ConciliacaoBancaria |

---

## Sobre o Modulo

A FAPES necessita de controle contabil (plano de contas, lancamentos vinculados a programas/projetos) e gestao financeira (contas bancarias, fluxo de caixa, conciliacao, controle de saldos). Atualmente esses processos estao dispersos em planilhas e sistemas externos sem integracao, gerando inconsistencias nos dados financeiros, dificuldade de rastreamento de recursos e atrasos na conciliacao bancaria. Este modulo visa resolver esses problemas ao centralizar a gestao contabil e financeira em uma unica plataforma integrada. O sucesso sera medido pela reducao do tempo de conciliacao bancaria e pela acuracia dos saldos contabeis.

---

## Dominio

A FAPES gerencia recursos financeiros provenientes de diversas fontes para fomento a pesquisa e inovacao. O controle financeiro envolve duas grandes areas: contabilidade e gestao de contas bancarias.

Na area contabil, a FAPES mantem um plano de contas que segue a estrutura do governo, onde cada conta contabil pode ser associada a iniciativas, programas ou parcerias. O plano de contas permite a classificacao dos lancamentos financeiros e a geracao de dashboards contabeis que apoiam a tomada de decisao.

Na area de gestao financeira, cada projeto ou programa possui uma ou mais contas bancarias associadas. As movimentacoes financeiras (entradas e saidas) sao registradas e rastreadas por conta. Periodicamente, e necessario realizar a conciliacao bancaria, comparando os registros do sistema com os extratos bancarios para identificar divergencias. O fluxo de caixa consolida as movimentacoes e permite projetar a disponibilidade de recursos.

Dashboards financeiros fornecem visao consolidada de saldos, movimentacoes e projecoes, apoiando gestores na alocacao de recursos e no cumprimento de obrigacoes financeiras.

> Projetos e programas sao gerenciados por outros modulos (M003, M010). Este modulo consome essas informacoes para operacionalizar a gestao contabil e financeira.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | O plano de contas deve seguir a estrutura do plano de contas do governo. | Must |
| RN02 | Toda conta contabil deve estar associada a pelo menos uma iniciativa, programa ou parceria. | Must |
| RN03 | Cada projeto deve possuir pelo menos uma conta bancaria associada (podendo ser compartilhada no nivel do programa). | Must |
| RN04 | A conciliacao bancaria deve comparar os registros do sistema com os registros do extrato bancario. | Must |
| RN05 | O saldo de uma conta bancaria nao pode ficar negativo sem autorizacao expressa de gestor autorizado. | Must |
| RN06 | Toda movimentacao financeira deve possuir trilha de auditoria completa (usuario, data, hora, operacao). | Must |
| RN07 | A associacao entre contas contabeis e iniciativas/programas/parcerias e obrigatoria para lancamentos. | Must |
| RN08 | Uma conciliacao so pode ser iniciada se nao houver outra em andamento para a mesma conta bancaria. | Should |
| RN09 | Divergencias identificadas na conciliacao devem ser registradas e tratadas antes do fechamento. | Must |
| RN10 | O fluxo de caixa deve consolidar movimentacoes realizadas e projetadas. | Should |
| RI1 | Uma conta contabil nao pode ser excluida se possuir lancamentos associados. | Must |
| RI2 | Uma conta bancaria nao pode ser excluida se possuir movimentacoes registradas. | Must |
