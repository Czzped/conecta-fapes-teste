# M011 - Configuracao de Captacao

[<- Voltar ao Backlog Central](../../backlog-product.md) | [Domain 03 -- Fomento Pre-Award](../../discovery/domains/03-fomento-pre-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida do Edital |

---

## Sobre o Modulo

Antes que um edital possa receber propostas, a FAPES precisa configura-lo: definir cronograma, criar formularios de submissao e avaliacao, registrar revisores ad hoc e definir parametros de fomento. Atualmente esse processo e realizado por meio de documentos manuais, sem templates nem padronizacao, o que gera inconsistencias entre editais e retrabalho frequente. Este modulo visa resolver esse problema ao permitir a configuracao completa de editais de forma estruturada e padronizada. O sucesso sera medido pela reducao do tempo de configuracao de editais e pela eliminacao de inconsistencias entre editais publicados.

---

## Dominio

A FAPES publica editais de fomento (demanda publica ou induzida) para selecionar e financiar projetos de pesquisa. Antes de abrir o recebimento de propostas, cada edital precisa ser configurado com cronograma, formularios e parametros.

O cronograma define os periodos do edital: submissao, avaliacao de merito, resultado preliminar, recurso, resultado final e contratacao. As datas devem ser sequenciais e o edital deve ter ao menos um periodo de submissao.

Para cada edital, a FAPES cria formularios de submissao (preenchidos pelos proponentes) e formularios de avaliacao (preenchidos pelos revisores). Os formularios podem ser versionados para reutilizacao em editais futuros. O formulario de avaliacao deve estar configurado antes da fase de avaliacao de merito.

Revisores ad hoc sao consultores externos cadastrados pela FAPES para avaliar propostas. Um revisor nao pode avaliar propostas da propria instituicao (conflito de interesses). Os revisores sao associados a editais especificos.

Os parametros de fomento definem orcamento total, cotas por area, valores maximos por projeto e outras restricoes financeiras do edital.

Uma vez publicado, um edital nao pode mais ser editado diretamente. Caso necessario, deve-se criar uma nova versao (retificacao).

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Um edital deve possuir ao menos um periodo de submissao no cronograma antes de ser publicado. | Must |
| RN02 | O formulario de avaliacao deve estar configurado antes do inicio da fase de avaliacao de merito. | Must |
| RN03 | Um revisor ad hoc nao pode avaliar propostas da propria instituicao (conflito de interesses). | Must |
| RN04 | Um edital publicado nao pode ser editado, somente retificado por meio de nova versao. | Must |
| RN05 | As datas do cronograma devem ser sequenciais (submissao antes de avaliacao, avaliacao antes de resultado, etc.). | Must |
| RN06 | Um formulario publicado nao pode ser alterado, apenas versionado. | Must |
| RN07 | O orcamento total do edital deve ser igual ou superior a soma dos valores alocados por area. | Must |
| RN08 | O edital so pode transitar para EmAndamento quando a data de inicio de submissao for atingida. | Must |
| RN09 | O edital so pode transitar para Encerrado quando todas as fases do cronograma forem concluidas. | Must |
| RI1 | Um revisor nao pode ser associado mais de uma vez ao mesmo edital. | Must |
| RI2 | Um edital nao pode ter dois formularios de submissao ativos simultaneamente. | Must |
