# M011 - Configuracao de Captacao

[<- Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 03 -- Fomento Pre-Award](../../../discovery/domains/03-fomento-pre-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida do Edital |

---

## Sobre o Modulo

Antes que um edital possa receber propostas, a agencia de fomento precisa configura-lo: definir cronograma, vincular o edital a um programa quando aplicavel, selecionar parceria financeira quando houver, criar formularios de submissao e avaliacao, registrar revisores ad hoc e definir parametros de fomento. Atualmente esse processo e realizado por meio de documentos manuais, sem templates nem padronizacao, o que gera inconsistencias entre editais e retrabalho frequente. Este modulo visa resolver esse problema ao permitir a configuracao completa dos editais gerenciados operacionalmente em M003, de forma estruturada e padronizada. O sucesso sera medido pela reducao do tempo de configuracao de editais e pela eliminacao de inconsistencias entre editais publicados.

---

## Dominio

A agencia de fomento publica editais de fomento (demanda publica ou induzida) para selecionar e financiar projetos de pesquisa. Antes de abrir o recebimento de propostas, cada edital gerenciado em M003 precisa ser configurado com cronograma, formularios e parametros.

Quando houver alinhamento estrategico definido, o edital pode ser vinculado a um programa de fomento previamente cadastrado no M010. Esse vinculo permite reaproveitar o contexto estrategico do programa e manter a rastreabilidade entre planejamento, programa e captacao.

O cronograma define os periodos do edital: submissao, avaliacao de merito, resultado preliminar, recurso, resultado final e contratacao. As datas devem ser sequenciais e o edital deve ter ao menos um periodo de submissao.

Para cada edital, a agencia de fomento cria formularios de submissao (preenchidos pelos proponentes) e formularios de avaliacao (preenchidos pelos revisores). Os formularios podem ser versionados para reutilizacao em editais futuros. O formulario de avaliacao deve estar configurado antes da fase de avaliacao de merito.

Revisores ad hoc sao consultores externos cadastrados pela agencia de fomento para avaliar propostas. Um revisor nao pode avaliar propostas da propria instituicao (conflito de interesses). Os revisores sao associados a editais especificos.

Os parametros de fomento definem orcamento total, cotas por area, valores maximos por projeto e outras restricoes financeiras do edital. Quando o edital utilizar recursos oriundos de parceria, a configuracao tambem registra a parceria selecionada e o valor da parceria destinado ao edital.

Uma vez publicado em M003, um edital nao pode mais ter sua configuracao alterada diretamente. Caso necessario, deve-se registrar uma nova configuracao versionada para viabilizar a retificacao.

> O edital e gerenciado operacionalmente por M003. Programas e parcerias sao gerenciados por M010. Este modulo consome esses contextos para estruturar a configuracao do edital.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Um edital deve possuir ao menos um periodo de submissao no cronograma antes de ser publicado. | Must |
| RN02 | O formulario de avaliacao deve estar configurado antes do inicio da fase de avaliacao de merito. | Must |
| RN03 | Um revisor ad hoc nao pode avaliar propostas da propria instituicao (conflito de interesses). | Must |
| RN04 | Um edital publicado em M003 nao pode ter sua configuracao alterada diretamente, somente retificada por meio de nova versao de configuracao. | Must |
| RN05 | As datas do cronograma devem ser sequenciais (submissao antes de avaliacao, avaliacao antes de resultado, etc.). | Must |
| RN06 | Um formulario publicado nao pode ser alterado, apenas versionado. | Must |
| RN07 | O orcamento total do edital deve ser igual ou superior a soma dos valores alocados por area. | Must |
| RN08 | Um edital so pode ser publicado em M003 quando cronograma, formularios e parametros obrigatorios estiverem completos. | Must |
| RN09 | Alteracoes relevantes apos a publicacao devem gerar nova versao de configuracao vinculada ao mesmo edital. | Must |
| RI1 | Um revisor nao pode ser associado mais de uma vez ao mesmo edital. | Must |
| RI2 | Um edital nao pode ter dois formularios de submissao ativos simultaneamente. | Must |
