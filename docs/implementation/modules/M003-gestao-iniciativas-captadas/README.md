# M003 - Gestao de Iniciativas Captadas

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 04 — Fomento Post-Award](../../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Entidades de iniciativa, plano, resultados, equipe, orcamento e execucao consolidada |

---

## Sobre o Modulo

Apos a contratacao, a agencia de fomento precisa acompanhar a iniciativa apoiada como um objeto unico: seus dados estaveis, ortogado, plano vigente, objetivos, resultados, riscos, beneficios, equipe planejada, cronograma, orcamento planejado, execucao consolidada e alteracoes autorizadas de rubrica.

O M003 concentra a gestao pos-contratacao da `Iniciativa`. Ele nao e dono de edital, cotas de edital, alocacao de bolsistas ou prestacao de contas detalhada. Esses conceitos pertencem a outros modulos e sao consumidos pelo M003 apenas como referencias ou integracoes.

> **Fronteira com M011:** `Edital`, chamada, inscricao, avaliacao, recurso, resultado e configuracao da captacao sao responsabilidade do M011. O M003 assume a iniciativa depois da contratacao/outorga.

> **Fronteira com M009:** bolsas, bolsistas, indicacoes, implementacoes e alocacoes de bolsa sao responsabilidade do M009. O M003 pode informar o orcamento planejado de bolsas e os papeis previstos da equipe, mas nao executa a gestao de bolsas.

> **Fronteira com M014:** documentos fiscais, extratos bancarios, transacoes, prestacao de contas e execucao financeira detalhada sao responsabilidade do M014. O M003 mantem uma visao consolidada de `OrcamentoExecutado`, alimentada por lancamentos ou integracoes financeiras.

---

## Dominio

No ConectaFAPES, `Iniciativa` e o conceito operacional unico para o item apoiado pela agencia apos a contratacao. Uma iniciativa pode representar projeto de pesquisa, projeto de inovacao, visita tecnica ou outro tipo cadastrado em `TipoIniciativa`.

A `Iniciativa` possui um `Ortogado`, que e o papel assumido por uma `PessoaFisica` no contexto da outorga. O ortogado ativo pode solicitar inclusao ou retirada de rubricas do orcamento planejado.

Os elementos planejaveis da iniciativa ficam em `VersaoPlanoIniciativa`. Resultados, objetivos, riscos, beneficios, equipe, cronograma e orcamento planejado pertencem a uma versao do plano. Alteracoes relevantes geram nova versao, preservando historico.

O `OrcamentoPlanejado` registra a previsao aprovada de recursos para executar a iniciativa. O `OrcamentoExecutado` e uma visao consolidada e historica da execucao, calculada a partir de `LancamentoExecucao` e integrada aos modulos financeiros quando necessario.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | `Iniciativa` e a entidade operacional unica para o item contratado no modelo do M003. | Must |
| RN02 | A iniciativa pode possuir `TipoIniciativa` quando a configuracao da captacao exigir essa classificacao. | Must |
| RN03 | Toda iniciativa deve possuir um `Ortogado` ativo vinculado a uma `PessoaFisica` do M008. | Must |
| RN04 | A iniciativa pode possuir versoes de plano quando a captacao exigir planejamento; apenas uma versao pode estar `VIGENTE`. | Must |
| RN05 | Objetivos, resultados, riscos, beneficios, equipe, cronograma, orcamento e rubricas sao blocos configuraveis pela captacao no M011. | Must |
| RN06 | A obrigatoriedade de objetivo geral, objetivos especificos e associacao com resultados depende da configuracao da captacao. | Must |
| RN07 | A obrigatoriedade de riscos, beneficios e indicadores depende da configuracao da captacao. | Must |
| RN08 | O orcamento planejado pertence a uma versao do plano quando a captacao exigir orcamento; alteracoes aprovadas devem gerar nova versao. | Must |
| RN09 | Todo item de orcamento planejado informado e todo lancamento de execucao devem estar associados a uma `RubricaOrcamentaria`. | Must |
| RN10 | O orcamento executado da iniciativa deve ser calculado a partir de lancamentos de execucao, preservando historico de movimentos. | Must |
| RN11 | Somente o `Ortogado` ativo pode solicitar inclusao ou retirada de rubrica. | Must |
| RN12 | Retirada de rubrica deve ser bloqueada quando houver lancamento impeditivo associado a rubrica. | Must |
| RN13 | O M003 nao gerencia `Edital`; o ownership de edital e do M011. | Must |
| RN14 | O M003 nao gerencia cotas, bolsistas ou alocacoes de bolsa; o ownership desses conceitos e do M009. | Must |
| RN15 | O M003 nao gerencia documentos fiscais, extratos ou prestacao de contas detalhada; o ownership desses conceitos e do M014. | Must |
