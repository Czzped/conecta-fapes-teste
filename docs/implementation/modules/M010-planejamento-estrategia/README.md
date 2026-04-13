# M010 - Planejamento e Estrategia

[<< Voltar ao Backlog Central](../../backlog-product.md) | [Domain 02 -- Planejamento e Estrategia](../../discovery/domains/02-planejamento.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de Parceria e Programa |

---

## Sobre o Modulo

Atualmente, o planejamento estrategico, a gestao de parcerias e a gestao de programas de fomento sao feitos de forma isolada, sem integracao entre os instrumentos de cooperacao e os programas que executam as acoes. Parcerias sao controladas em documentos avulsos, sem rastreabilidade de aportes e aditivos. Programas nao possuem vinculacao formal com eixos estrategicos nem controle de dotacao orcamentaria. Este modulo resolve esse problema ao prover uma plataforma integrada para gestao do plano estrategico, parcerias institucionais e programas de fomento, desde o planejamento ate o encerramento. O sucesso sera medido pela capacidade de rastrear a alocacao de recursos desde o eixo estrategico ate os editais e projetos financiados.

---

## Dominio

A FAPES define seu plano estrategico em eixos que orientam a criacao de programas de fomento e a alocacao de recursos. Cada eixo estrategico agrupa programas tematicos (ex: Formacao de Recursos Humanos, Pesquisa em Saude, Inovacao Tecnologica).

A agencia estabelece parcerias com entidades publicas e privadas para cofinanciamento e execucao conjunta de programas. Uma parceria pode envolver um ou mais parceiros e esta sempre vinculada a um programa. Cada parceiro pode aportar recursos financeiros, e a parceria pode receber aditivos de tempo (prorrogacao de vigencia) e aditivos de aporte (recurso financeiro adicional), sendo que cada aditivo deve ter documento comprobatorio anexado. A execucao da parceria e acompanhada ate seu encerramento, com prestacao de contas final. Base legal: Art. 3 X, Art. 28 I, Art. 25 III.

Programas de fomento sao vinculados a eixos estrategicos e possuem comites gestores (camaras e comites de avaliacao de merito) com membros definidos. Cada programa recebe dotacao orcamentaria conforme LOA/LDO/PPA e pode captar recursos adicionais oriundos de parcerias. Programas habilitam a criacao de editais (captacoes de iniciativas) que resultam em projetos financiados. Base legal: Art. 4, Art. 14 VII, Art. 12.

> Editais e projetos sao gerenciados pelos modulos M002 e M003. Este modulo define os programas e parcerias que servem de base para a criacao de editais.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Um programa deve estar vinculado a pelo menos um eixo estrategico. | Must |
| RN02 | Uma parceria deve estar vinculada a um programa. | Must |
| RN03 | O registro de aporte financeiro requer que a parceria tenha acordo assinado (status Vigente). | Must |
| RN04 | Aditivos de tempo e de aporte requerem justificativa e documento comprobatorio anexado. | Must |
| RN05 | Membros do comite gestor possuem papeis definidos (Presidente, Membro, Suplente). | Must |
| RN06 | A dotacao orcamentaria de um programa nao pode exceder o saldo disponivel da fonte de recursos. | Must |
| RN07 | O encerramento de uma parceria requer prestacao de contas final aprovada. | Must |
| RN08 | Um eixo estrategico pertence a exatamente um plano estrategico. | Must |
| RN09 | Um plano estrategico possui vigencia definida (data inicio e fim); so pode haver um plano ativo por vez. | Should |
| RN10 | O aporte de parceria vinculado a um programa e um percentual do valor total da parceria. | Should |
| RN11 | O programa pode receber aditivos de tempo e aporte, cada um com documento comprobatorio. | Should |
| RI1 | Nao e possivel excluir um programa que possua editais vinculados. | Must |
| RI2 | Nao e possivel encerrar uma parceria que possua programas com editais em andamento. | Must |
