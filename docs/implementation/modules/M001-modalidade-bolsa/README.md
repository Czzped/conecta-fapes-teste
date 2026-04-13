# M001 - Modalidades de Bolsas

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 01 — Corporativo e Administrativo](../../../discovery/domains/01-corporativo.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da VersaoModalidade |

---

## Sobre o Modulo

Atualmente, as modalidades, niveis e requisitos de bolsas sao controlados manualmente via planilhas, o que gera inconsistencias frequentes entre as resolucoes publicadas e os dados efetivamente cadastrados. Este modulo visa resolver esse problema ao permitir o cadastro e manutencao de Modalidades, Niveis e Requisitos de Bolsas diretamente vinculados as Resolucoes da agencia de fomento, garantindo integridade e rastreabilidade dos dados. O sucesso sera medido pela reducao de inconsistencias cadastrais e pelo tempo necessario para cadastrar uma nova modalidade.

---

## Dominio

A agencia de fomento, por meio dos projetos que fomenta, concede bolsas a pesquisadores, estudantes e outros profissionais. Tais bolsas podem ser de pesquisa, desenvolvimento tecnologico, extensao, capacitacao e outros e sao estabelecidas por meio de Resolucoes internas da Fapes.

Uma Resolucao define uma ou mais Modalidades de bolsas (e.g., BPIG, DTI, EXT), organizadas em Niveis (e.g., BPIG-I, BPIG-X) que determinam os valores das bolsas. As resolucoes definem ainda caracteristicas e requisitos para aplicacao das bolsas.

Ha requisitos que valem para todas as bolsas da Fapes, requisitos que sao oriundos da Modalidade (e.g., possuir CPF, estar adimplente com o governo) e requisitos dos Niveis (e.g., possuir mestrado, ter 4 anos de experiencia). Tais requisitos serao verificados, por uma pessoa ou automaticamente, durante a implementacao das bolsas.

Com o tempo, as modalidades vao sendo atualizadas, tendo alterados seus valores, requisitos ou mesmo niveis. Tais alteracoes sao formalizadas por meio de resolucoes. Assim, uma nova resolucao pode "versionar" uma ou mais modalidades, possivelmente alterando seus niveis, valores ou requisitos.

Um projeto, ao ser contratado, e vinculado a uma determinada modalidade definida por uma resolucao (ou seja, a uma versao especifica de uma modalidade). Apos definida uma nova versao de modalidade, esta deve ser publicada para que possa ser utilizada por projetos. Apos sua publicacao, uma versao de modalidade nao pode mais ser editada. A forma de atualizar as modalidades existentes, mantendo seu historico, e por meio de versionamento, atendendo as definicoes de uma nova resolucao.

A titulo de exemplo, a Resolucao 172 de 2017 cria a modalidade BPIG, definindo nove niveis (BPIG-I a BPIG-IX, com valores de R$ 200 a R$ 3.200). Mais recentemente, a Resolucao 323 de 2023 atualizou a modalidade BPIG, que passou a ter 10 niveis (BPIG-I a BPIG-X, com valores de R$ 300 a R$ 10.000) e teve algumas de suas regras alteradas. Assim, a agencia de fomento possui duas versoes da modalidade BPIG que foram aplicadas a diferentes projetos ao longo do tempo.

> Requisitos validos para todas as modalidades de bolsa nao estao no escopo deste modulo pois uma solucao para uma definicao formal destes requisitos ainda esta sendo trabalhada pela Fapes.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | As modalidades, niveis e requisitos de bolsas sao definidas e atualizadas por Resolucoes. | Must |
| RN02 | Uma resolucao pode definir/atualizar uma ou mais modalidades de bolsa. | Must |
| RN03 | Uma modalidade e dividida em um ou mais niveis e cada nivel pertence a apenas uma modalidade. | Must |
| RN04 | Duas versoes de uma mesma modalidade podem ter niveis diferentes (ex. a versao 1 da BPIG tem os niveis de I a IX e a versao 2 adicionou o nivel X) | Must |
| RN05 | Quando cria-se uma nova versao da modalidade cria-se tambem novas versoes dos niveis. | Must |
| RN06 | Duas versoes de uma mesma modalidade podem ter requisitos diferentes. O mesmo vale para duas versoes de um mesmo nivel. | Must |
| RN07 | O valor da bolsa e definido pela versao do nivel da bolsa. | Must |
| RN08 | Uma vez publicada, uma versao de modalidade nao pode mais ser alterada. | Must |
| RN09 | Uma versao de modalidade pode definir quais outras modalidades sao acumulativas (ex: BPIG versao 2023 e compativel com bolsas UnAC). | Must |
| RN10 | Um requisito e definido ou para uma versao de modalidade ou para uma versao de nivel, nunca para ambos (XOR). | Must |
| RI1 | Uma resolucao nao pode definir mais de uma versao para a mesma modalidade. | Must |
| RI2 | Uma versao de modalidade nao pode definir mais de uma versao para o mesmo nivel. | Must |
| RN11 | Cada modalidade so pode ter uma versao ativa por vez. Ao ativar uma nova versao, a anterior e automaticamente inativada. | Must |
