# M010 - Planejamento e Estrategia

[<< Voltar ao Backlog Central](../../backlog-product.md) | [Domain 02 -- Planejamento e Estrategia](../../discovery/domains/02-planejamento.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de Parceria e Programa |

---

## Sobre o Modulo

Atualmente, o planejamento estrategico, a gestao de parcerias e a gestao de programas de fomento sao feitos de forma isolada, sem integracao entre os instrumentos de cooperacao e os programas que executam as acoes. Parcerias sao controladas em documentos avulsos, sem rastreabilidade de instituicoes parceiras, valores investidos, aportes, aditivos e documentos relacionados. Programas nao possuem vinculacao formal com planejamento estrategico, parceria de referencia, comite de governanca, beneficios esperados e recursos recebidos. Este modulo resolve esse problema ao prover uma plataforma integrada para gestao do plano estrategico, parcerias institucionais e programas de fomento, desde o planejamento ate o encerramento. O sucesso sera medido pela capacidade de rastrear a alocacao de recursos desde o eixo estrategico ate os editais e projetos financiados.

---

## Dominio

A agencia de fomento define seu plano estrategico em eixos que orientam a criacao de programas de fomento e a alocacao de recursos. Cada programa deve estar vinculado a um planejamento estrategico e a pelo menos um eixo estrategico, podendo combinar mais de um eixo quando o escopo do programa cruza diferentes diretrizes institucionais.

A agencia estabelece parcerias com entidades publicas e privadas para cofinanciamento e execucao conjunta de acoes de fomento. Uma parceria pode envolver uma ou mais instituicoes parceiras, cada uma com valor investido, e mantem dados de processo, vigencia, objetivo, coordenacao, ponto focal interno, gerencia responsavel e documentos relacionados. Uma mesma parceria pode apoiar varios programas de fomento, servindo como base para recursos compartilhados e para futuras captacoes. A parceria pode receber aportes financeiros adicionais e aditivos de tempo ou aporte, sempre com justificativa e documento comprobatorio. A execucao da parceria e acompanhada ate seu encerramento, com prestacao de contas final. Base legal: Art. 3 X, Art. 28 I, Art. 25 III.

Programas de fomento possuem identificacao propria, instituicao demandante, periodo de vigencia, parceria de referencia opcional, resumo, beneficios esperados, resultados esperados, riscos, enquadramento de repasse de recursos e comite de governanca com membros definidos. Cada programa registra seus recursos com origem, valor, data de aporte e documento de descentralizacao, podendo combinar dotacao orcamentaria interna e recursos provenientes de parceria. Programas habilitam a criacao de editais (captacoes de iniciativas) que resultam em projetos financiados. Base legal: Art. 4, Art. 14 VII, Art. 12.

> Editais sao configurados em M011 e acompanhados em M003. Este modulo define os programas e parcerias que servem de base para a criacao de editais e para a composicao dos recursos financeiros do edital.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Um programa deve estar vinculado a pelo menos um eixo estrategico. | Must |
| RN02 | Uma parceria pode estar vinculada a um ou mais programas; um programa pode referenciar no maximo uma parceria de referencia por vez. | Must |
| RN03 | O registro de aporte financeiro requer que a parceria tenha acordo assinado (status Vigente). | Must |
| RN04 | Aditivos de tempo e de aporte requerem justificativa e documento comprobatorio anexado. | Must |
| RN05 | Membros do comite de governanca possuem papeis definidos (Presidente, Membro, Suplente). | Must |
| RN06 | A dotacao orcamentaria de um programa nao pode exceder o saldo disponivel da fonte de recursos. | Must |
| RN07 | O encerramento de uma parceria requer prestacao de contas final aprovada. | Must |
| RN08 | Um eixo estrategico pertence a exatamente um plano estrategico. | Must |
| RN09 | Um plano estrategico possui vigencia definida (data inicio e fim); so pode haver um plano ativo por vez. | Should |
| RN10 | O mesmo aporte de parceria pode ser distribuido entre varios programas, desde que o total vinculado nao exceda o valor registrado na parceria. | Should |
| RN11 | Todo recurso vinculado a um programa deve registrar origem, valor, data do aporte e documento de descentralizacao quando aplicavel. | Should |
| RI1 | Nao e possivel excluir um programa que possua editais vinculados. | Must |
| RI2 | Nao e possivel encerrar uma parceria que possua programas ativos com editais em andamento. | Must |
