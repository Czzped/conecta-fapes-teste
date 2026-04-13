# M002 - Importacao de Editais

[← Voltar ao Backlog Central](../../backlog-product.md) | [Domain 07 — Importacao de Dados (SIGFAPES)](../../discovery/domains/07-importacao-sigfapes.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida de Edital, Projeto e Alocacao |

---

## Sobre o Modulo

Hoje, os dados de editais, projetos e alocacoes precisam ser digitados manualmente a partir do Sigfapes, causando retrabalho significativo e erros de transcricao que comprometem a confiabilidade das informacoes. Este modulo resolve esse problema ao importar automaticamente do Sigfapes as informacoes de Editais, Projetos e Alocacoes, eliminando a entrada manual de dados. O sucesso sera medido pelo percentual de editais importados automaticamente e pela reducao de erros de transcricao.

---

## Dominio

A FAPES realiza o cadastro e gestao de seus editais, projetos e alocacoes de bolsistas via sistema SigFapes. Para apoiar a gestao de alocacoes e pagamentos sao usadas planilhas. Esses dados sao fundamentais para a geracao de folhas de pagamento de bolsistas.

Os dados de editais, projetos e alocacoes de bolsistas estao registrados e sao mantidos no SigFapes. Entretanto, informacoes como a quantidade de cotas ja pagas sao controladas atualmente via planilhas. Para que as folhas de pagamentos possam ser geradas, e necessario que tais dados estejam disponiveis no ConectaFapes. Assim, e preciso importar os dados existentes do SigFapes, e mante-los sincronizados para capturar eventuais alteracoes no SigFapes, alem de complementar com as informacoes das alocacoes, hoje mantidas em planilhas.

Ha tres contextos de recuperacao de dados do SigFapes para o ConectaFapes: carga inicial, importacao e sincronizacao.

A carga inicial e realizada com o intuito de buscar as informacoes basicas de editais para que o usuario possa indicar quais passarao a existir no ConectaFapes, ou seja, serao importados e sincronizados. Esta carga e realizada uma unica vez e envolve os Editais, Modalidades e Niveis de Bolsas ativos. Tais dados devem ser recuperados do SigFapes e adaptados ao formato do ConectaFapes.

A importacao e realizada com o intuito de buscar as informacoes dos editais selecionados, incluindo dados dos Editais, seus Projetos, as Alocacoes dos projetos e os Bolsistas alocados.

A sincronizacao e realizada com o intuito de atualizar as informacoes ja importadas e recuperar possiveis novos registros. Sao atualizados os dados de Projetos, suas Alocacoes e Bolsistas. Sao importados novos Editais, novos Projetos, novas Alocacoes e novos Bolsistas. E fundamental que as informacoes estejam sincronizadas imediatamente antes que seus dados possam ser alterados ou utilizados para gerar novos dados ou tomar decisoes.

Para gerir e completar tais dados, sao necessarias algumas funcionalidades. Apos a carga inicial, o sistema deve permitir a selecao de quais editais serao importados, indicando sua area tecnica. Uma vez importados os editais, para cada um de seus projetos, devem ser exibidas as suas alocacoes, para que o usuario possa complementar as informacoes considerando os dados hoje contidos em planilhas, por exemplo, a quantidade de cotas ja pagas e as alocacoes canceladas. Uma vez que tais informacoes de um projeto foram completadas, este recebe o status de "Completo" e ja podera ser considerado no proximo modulo de geracao de folha de pagamento.

As funcionalidades de criacao de Editais, Projetos, cadastro de Bolsistas, seus dados bancarios, solicitacao e aprovacao de Alocacoes e outras, continuam sendo realizadas no SigFapes. Tais acoes apenas geram dados que serao importados e sincronizados neste modulo.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Uma vez definida a quantidade de cotas pagas para uma alocacao importada, ela nao pode retornar para nulo. | Must |
| RN02 | Alocacoes que forem canceladas neste modulo precisam informar data de fim de atividades e justificativa. As que vierem canceladas do SigFapes nao tem essa obrigatoriedade. | Must |
| RN03 | Projetos "substituidos" devido a mudanca de coordenador devem ser adaptados para contar como apenas um projeto. | Must |
| RN04 | Uma vez que todas as alocacoes de um projeto tem suas informacoes completas, o projeto e considerado Completo. | Must |
| RN05 | Cada edital importado deve ser associado a uma Area Tecnica responsavel pela gestao de suas atividades e pagamentos. | Must |
| RN06 | Um edital so pode ser importado (projetos, alocacoes e bolsistas) apos ser selecionado pelo Gerente da Area Tecnica e receber status "a importar". | Must |
| RN07 | Apos a importacao, o edital recebe o status "importado" e passa a ser sincronizado periodicamente. | Must |
| RN08 | Para efeito de sincronizacao, as entidades Edital, Projeto, AlocacaoBolsista, Bolsista e VersaoNivel possuem o atributo idSigFapes como identificador de referencia. | Must |

### Requisitos Nao-Funcionais

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RNF01 | Cada evento de importacao ou sincronizacao deve ser realizado em tempo inferior a 5 segundos. | Must |
| RNF02 | Os dados serao importados da base de dados do SigFapes por meio de consultas a Web Services providos pelo cliente. | Must |
| RNF03 | Os dados de projetos, alocacoes e bolsistas do ConectaFapes devem estar sincronizados com os dados do SigFapes imediatamente antes de qualquer acao que envolva sua alteracao ou geracao de novos dados. | Must |
