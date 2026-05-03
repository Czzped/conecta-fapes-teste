# M003 - Gestao de Iniciativas Captadas

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 04 — Fomento Post-Award](../../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Entidades de iniciativa, plano, resultados, equipe, orcamento e execucao consolidada |
| [Proposta: Ciclo de Fomento da Iniciativa](specifications/proposta-ciclo-fomento-iniciativa.md) | Proposta de timeline pre-award, award e post-award como read model transversal |
| [Diarias da Iniciativa](diarias/README.md) | Subfluxo dedicado para solicitacao, aceite, alocacao, remocao antes do inicio e regularizacao de diarias; abrangencia, tipo de diaria e parametros de calculo sao referencias do M008 |
| [Aditivos da Iniciativa](aditivos/README.md) | Subfluxo dedicado para vigencia, orcamento original e dados dos aditivos da iniciativa |

---

## Sobre o Modulo

Apos a contratacao, a agencia de fomento precisa acompanhar a iniciativa apoiada como um objeto unico: seus dados estaveis, ortogado, plano vigente, objetivos, resultados, riscos, beneficios, equipe planejada, cronograma, orcamento planejado, execucao consolidada e alteracoes autorizadas de rubrica.

O M003 concentra a gestao pos-contratacao da `Iniciativa`. Ele nao e dono de edital, cotas de edital, alocacao de bolsistas ou prestacao de contas detalhada. Esses conceitos pertencem a outros modulos e sao consumidos pelo M003 apenas como referencias ou integracoes.

> **Fronteira com M011:** `Edital`, chamada, inscricao, avaliacao, recurso, resultado e configuracao da captacao sao responsabilidade do M011. O M003 assume a iniciativa depois da contratacao/outorga.

> **Fronteira com M009:** bolsas, bolsistas, indicacoes, implementacoes e alocacoes de bolsa sao responsabilidade do M009. O M003 pode informar o orcamento planejado de bolsas, os papeis previstos da equipe e solicitar diarias para bolsistas alocados, mas nao executa a gestao de bolsas.

> **Fronteira com M014:** documentos fiscais, extratos bancarios, transacoes, prestacao de contas e execucao financeira detalhada sao responsabilidade do M014. O M003 mantem uma visao consolidada de `OrcamentoExecutado`, alimentada por lancamentos ou integracoes financeiras. A solicitacao operacional de diaria nasce no M003; a prestacao de contas apenas referencia essa solicitacao para registrar `JustificativaDiaria` e comprovantes de pagamento.

---

## Dominio

No ConectaFAPES, `Iniciativa` e o conceito operacional unico para o item apoiado pela agencia apos a contratacao. Uma iniciativa pode representar projeto de pesquisa, projeto de inovacao, visita tecnica ou outro tipo cadastrado em `TipoIniciativa`.

A `Iniciativa` possui um `Ortogado`, que e o papel assumido por uma `PessoaFisica` no contexto da outorga. O ortogado ativo pode solicitar inclusao ou retirada de rubricas do orcamento planejado.

Os elementos planejaveis da iniciativa ficam em `VersaoPlanoIniciativa`. Resultados, objetivos, riscos, beneficios, equipe, cronograma e orcamento planejado pertencem a uma versao do plano. Alteracoes relevantes geram nova versao, preservando historico.

O `OrcamentoPlanejado` registra a previsao aprovada de recursos para executar a iniciativa. O `OrcamentoExecutado` e uma visao consolidada e historica da execucao, calculada a partir de `LancamentoExecucao` e integrada aos modulos financeiros quando necessario.

A `SolicitacaoDiaria` registra o pedido operacional de diaria feito pelo ortogado/coordenador para uma `AlocacaoBolsista` do M009. O coordenador informa alocacao, abrangencia, partida, chegada, origem da missao, destino final, roteiro de viagem e motivo; o sistema consulta o M008 para validar a `Abrangencia`, localizar o `TipoDiaria` vigente e obter o `ParametroCalculoDiaria` vinculado ao tipo, calcula automaticamente a quantidade e o valor da diaria e grava snapshots de abrangencia, roteiro, valor e memoria de calculo. Quando a viagem possuir trecho interno de apoio ate aeroporto/rodoviaria e trecho nacional ou internacional, o roteiro deve registrar todos os trechos, mas a forma de gerar uma unica diaria ou diarias separadas fica como duvida aberta para decisao do PO, pois pode alterar o valor consumido da rubrica. A solicitacao nao passa por aprovacao manual da FAPES: se houver rubrica de diaria e saldo suficiente, o valor e alocado/comprometido na criacao. O aceite do bolsista fica registrado na propria `SolicitacaoDiaria`, declarando ciencia da diaria e aceite de recebimento na conta bancaria cadastrada. Apos o aceite, a solicitacao passa automaticamente para aprovada e fica disponivel para comprovacao em M014.

A consulta de vigencia e aditivos preserva a data de aprovacao original, a data inicial, a data final original, a data final vigente e o orcamento original da iniciativa. A data final vigente so muda por aditivo de tempo aprovado; o orcamento original permanece historico mesmo quando houver aditivo financeiro. A tela **Meu Projeto** deve exibir o bloco **Vigencia e aditivos** com abas **Resumo** e **Dados dos aditivos**; a area **Projetos** pode expor uma aba **Aditivos** para consulta dos mesmos registros.

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
| RN16 | A iniciativa pode possuir uma timeline transversal em `EstagioCicloFomento`, com marcos de pre-award, award e post-award. | Must |
| RN17 | Cada `EstagioCicloFomento` deve registrar fase, marco, estado, datas previstas/efetivas, modulo de origem e referencia de origem quando disponivel. | Must |
| RN18 | A timeline deve preservar ownership: M011 para pre-award, M022 para contratacao/outorga, M003 para execucao, M014 para prestacao de contas e M015 para conclusao/finalizacao. | Must |
| RN19 | Apenas um estagio da timeline pode estar `ATUAL` por iniciativa. | Must |
| RN20 | `CONCLUIDO` e `CANCELADA` sao marcos terminais alternativos do ciclo; a iniciativa nao pode finalizar simultaneamente nos dois. | Must |
| RN21 | `SUSPENSA` e um marco intermediario do post-award e deve manter data de inicio/fim da suspensao quando houver reativacao, cancelamento ou finalizacao. | Must |
| RN22 | O M003 e dono da solicitacao operacional de diaria da iniciativa, incluindo alocacao do bolsista, periodo de deslocamento, calculo automatico e aceite. | Must |
| RN23 | A solicitacao de diaria deve estar vinculada a uma iniciativa ativa e a uma `AlocacaoBolsista` valida consultada em M009. | Must |
| RN24 | O coordenador informa abrangencia, data/hora de partida e chegada, origem da missao, destino final e roteiro; o sistema calcula quantidade de diarias e valor total usando o tipo de diaria e os parametros de calculo vigentes no momento da solicitacao. | Must |
| RN25 | O valor calculado da diaria deve ser persistido na solicitacao para preservar historico mesmo que a tabela de valores seja alterada posteriormente. | Must |
| RN26 | O aceite deve ficar registrado na propria `SolicitacaoDiaria`; apos o aceite, a solicitacao passa automaticamente para aprovada, declarando ciencia e aceite de recebimento na conta bancaria cadastrada. | Must |
| RN27 | A prestacao de contas em M014 deve referenciar a solicitacao de diaria do M003 ao registrar `JustificativaDiaria`, evitando comprovacao sem pedido operacional rastreavel. | Should |
| RN28 | O M003 deve consumir do M008 a abrangencia, o tipo de diaria vigente e os parametros de calculo vinculados antes de permitir o calculo de novas solicitacoes. | Must |
| RN28-A | Duvida para PO: definir se viagem nacional/internacional com trecho interno de apoio ate aeroporto/rodoviaria deve gerar uma unica diaria pela maior abrangencia ou diarias separadas por trecho, considerando impacto no valor consumido da rubrica. | Open |
| RN28-B | Enquanto a duvida RN28-A nao for decidida, o sistema deve registrar o roteiro da viagem e manter a memoria de calculo preparada para auditar os trechos e a abrangencia aplicada. | Must |
| RN29 | A solicitacao de diaria nao depende de permissao ou aprovacao manual da FAPES; a criacao deve ser bloqueada quando nao houver rubrica de Diarias e Passagens ou saldo suficiente. | Must |
| RN30 | Quando a solicitacao de diaria for criada com saldo suficiente, o M003 deve gerar debito/comprometimento na rubrica de Diarias e Passagens pelo valor total calculado. | Must |
| RN31 | O debito gerado pelo comprometimento da diaria deve ser rastreavel ate a `SolicitacaoDiaria` e compor a execucao consolidada da iniciativa. | Must |
| RN32 | O coordenador pode remover uma solicitacao de diaria `ALOCADA` ou `APROVADA` com justificativa somente antes da data/hora de partida. | Must |
| RN33 | A remocao ou regularizacao de diaria nao utilizada deve gerar credito de reversao na rubrica de Diarias e Passagens, rastreavel ate a `SolicitacaoDiaria`, quando houver comprometimento anterior. | Must |
| RN34 | Toda iniciativa deve preservar data de aprovacao original, data inicial, data final original, data final vigente e orcamento original para consulta historica. | Must |
| RN35 | A data final vigente deve ser igual a data final original quando nao houver aditivo de tempo aprovado. | Must |
| RN36 | Quando houver aditivo de tempo aprovado, a data final vigente deve refletir a ultima data final aprovada. | Must |
| RN37 | A existencia de aditivo financeiro nao altera por si so a data final vigente. | Must |
| RN38 | A existencia de aditivo de tempo nao altera por si so o orcamento original da iniciativa. | Must |
| RN39 | O bloco **Vigencia e aditivos** em **Meu Projeto** deve possuir abas **Resumo** e **Dados dos aditivos**. | Must |
| RN40 | A aba **Dados dos aditivos** deve exibir data de aprovacao original, orcamento original e lista de aditivos vinculados ao projeto, quando existirem. | Must |
| RN41 | Quando nao houver aditivos, a aba **Dados dos aditivos** deve exibir estado vazio objetivo. | Must |
| RN42 | A visao orcamentaria por rubrica em **Meu Projeto** deve ser exibida somente para coordenador da iniciativa, contendo total, consumido, alocado quando aplicavel, disponivel e percentuais por rubrica. | Must |
