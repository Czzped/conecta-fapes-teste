# M010 - Planejamento e Estrategia

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 02 -- Planejamento e Estrategia](../../../discovery/domains/02-planejamento.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de Parceria e Programa |

---

## Sobre o Modulo

Atualmente, o planejamento estrategico, a gestao de parcerias e a gestao de programas de fomento sao feitos de forma isolada, sem integracao entre os instrumentos de cooperacao e os programas que executam as acoes. Parcerias sao controladas em documentos avulsos, sem rastreabilidade de instituicoes, aportes financeiros e coordenacao. Este modulo resolve esse problema ao prover uma plataforma integrada para gestao do plano estrategico, parcerias institucionais e programas de fomento. O sucesso sera medido pela capacidade de rastrear a alocacao de recursos desde o eixo estrategico ate os editais e projetos financiados.

---

## Dominio

O sistema e estruturado em tres dominios integrados:

**Plano Estrategico e Eixos** — A agencia de fomento define seu plano estrategico em eixos que orientam a criacao de programas de fomento. Cada programa deve estar vinculado a pelo menos um eixo estrategico. So pode haver um plano ativo por vez.

**Parcerias** — A agencia estabelece parcerias com entidades publicas e privadas para cofinanciamento de acoes de fomento. Uma parceria e um instrumento formal com nome, numero de processo, data de assinatura, vigencia e objetivo. Cada parceria e classificada por uma Finalidade (Pesquisa, Inovacao, Extensao — cadastrada em M008), possui um ou mais aportes financeiros com origem em uma Instituicao (M008), esta sob responsabilidade de uma UnidadeOrganizacional (M008) e pode ter um ou mais coordenadores (PessoaFisica de M008) ao longo do tempo via Coordenacao temporal. Base legal: Art. 3 X, Art. 28 I, Art. 25 III.

**Programas de Fomento** — Programas possuem codigo, nome, resumo e periodo de vigencia. Um programa pode referenciar uma parceria como fonte de recursos. Programas habilitam a criacao de editais (captacoes de iniciativas) que resultam em projetos financiados. Base legal: Art. 4, Art. 14 VII, Art. 12.

> Editais sao configurados em M011 e gerenciados operacionalmente em M003 apos contratacao. Este modulo define os programas e parcerias que servem de base para os editais.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Um programa deve estar vinculado a pelo menos um eixo estrategico. | Must |
| RN02 | Uma parceria pode estar vinculada a um ou mais programas; um programa pode referenciar no maximo uma parceria de referencia. | Must |
| RN03 | O registro de aporte financeiro requer que a parceria tenha data de assinatura preenchida. | Must |
| RN04 | Cada aporte financeiro deve ter origem em uma Instituicao cadastrada em M008. | Must |
| RN05 | Uma parceria deve estar associada a pelo menos uma Finalidade (M008). | Must |
| RN06 | Uma parceria esta sob responsabilidade de exatamente uma UnidadeOrganizacional (M008). | Must |
| RN07 | O encerramento de uma parceria requer prestacao de contas final aprovada. | Must |
| RN08 | Um eixo estrategico pertence a exatamente um plano estrategico. | Must |
| RN09 | Um plano estrategico possui vigencia definida (data inicio e fim); so pode haver um plano ativo por vez. | Should |
| RI1 | Nao e possivel excluir um programa que possua editais vinculados. | Must |
| RI2 | Nao e possivel encerrar uma parceria que possua programas ativos com editais em andamento. | Must |
