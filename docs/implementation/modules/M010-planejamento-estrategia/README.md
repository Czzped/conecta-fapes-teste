# M010 - Planejamento e Estrategia

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 02 -- Planejamento e Estrategia](../../../discovery/domains/02-planejamento.md)

---

## Organizacao do Modulo

O M010 e subdividido em **tres subdominios** com modelos estruturais e comportamentais proprios, facilitando leitura e evolucao independente. Contrato de aplicacao e API HTTP permanecem **consolidados** na raiz.

```
M010-planejamento-estrategia/
├── README.md                     ← voce esta aqui (indice)
├── backlog.md                    ← rastreabilidade consolidada
├── contrato.md                   ← operacoes publicas (consolidado)
├── contrato-api.md               ← contrato HTTP REST (consolidado)
├── planejamento/                 ← Plano Estrategico + Eixos
│   ├── processo.md
│   ├── jornada-gestao-planejamento.md
│   ├── modelo-estrutural.md
│   ├── modelo-comportamental.md
│   └── epics/EPIC-M010-001.md
├── programas/                    ← Programa + Recursos + Comite + AporteFinanceiroParceriaPrograma
│   ├── README.md
│   ├── processo.md
│   ├── jornada-gestao-programa.md
│   ├── jornada-criacao-ativacao-programa.md
│   ├── jornada-aditivos-programa.md
│   ├── jornada-retirada-aporte-programa.md
│   ├── jornada-suspensao-reativacao-programa.md
│   ├── jornada-encerramento-remocao-programa.md
│   ├── jornada-acompanhamento-programa.md
│   ├── modelo-estrutural.md
│   ├── modelo-comportamental.md
│   └── epics/EPIC-M010-003.md
└── parcerias/                    ← Parceria + Vigencias + AporteFinanceiro + Documentos
    ├── README.md
    ├── processo.md
    ├── jornada-criacao-parceria.md
    ├── jornada-aditivo-parceria.md
    ├── jornada-suspensao-encerramento-parceria.md
    ├── jornada-suspensao-cascata.md
    ├── modelo-estrutural.md
    ├── modelo-comportamental.md
    └── epics/EPIC-M010-002.md
```

## Fronteira com Acao Transversal

A Acao Transversal e calculada uma unica vez na Parceria, antes da distribuicao de recursos para Programas. O M010 e dono do calculo aplicado sobre a Parceria, da reserva e do bloqueio desse valor para aportes em Programas. A gestao financeira institucional da reserva, incluindo plano de aplicacao, despesas, documentos, glosas e prestacao financeira da agencia, pertence ao [M016 - Contabilidade e Financeiro](../M016-contabilidade-financeiro/acao-transversal/README.md).

O M014 permanece como contexto de prestacao de contas da Iniciativa/Projeto. Portanto, a prestacao financeira da Acao Transversal nao deve ser modelada no M014.

Referencia normativa: [Resolucao CCAF nº 334/2023 - FAPES](https://fapes.es.gov.br/Media/fapes/Resolu%C3%A7%C3%B5es/Resolu%C3%A7%C3%A3o_CCAF_n%C2%BA_334.2023_-_utiliza%C3%A7%C3%A3o_recursos_financeiros_de_projetos_e-ou_programas_em_parcerias_destinados_a_A%C3%A7%C3%A3o_Transversal_para_a_FAPES..pdf). Os percentuais e faixas dessa resolucao devem ser parametrizados no M016 e apenas consumidos pelo M010 no momento de calcular a reserva da Parceria.

## Indice de Documentos

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica consolidada: comandos, consultas, jobs |
| [Contrato API](contrato-api.md) | Contrato HTTP REST consolidado |
| [Backlog](backlog.md) | EPICs, US e rastreabilidade |
| [Planejamento — Processo](planejamento/processo.md) / [Jornada](planejamento/jornada-gestao-planejamento.md) / [Estrutural](planejamento/modelo-estrutural.md) / [Comportamental](planejamento/modelo-comportamental.md) | Plano Estrategico + Eixos |
| [Programas](programas/README.md) | Indice do subdominio, capacidades, jornadas, modelos e epic |
| [Programas — Processo](programas/processo.md) / [Estrutural](programas/modelo-estrutural.md) / [Comportamental](programas/modelo-comportamental.md) | Programas + Recursos + Comite + AporteFinanceiroParceriaPrograma |
| [Jornadas — Gestao do Programa](programas/jornada-gestao-programa.md) | Mapa das jornadas de Programas |
| [Parcerias](parcerias/README.md) | Indice do subdominio, dores, capacidades e documentos |
| [Parcerias — Processo](parcerias/processo.md) / [Estrutural](parcerias/modelo-estrutural.md) / [Comportamental](parcerias/modelo-comportamental.md) | Parcerias + Vigencias + Aportes + Documentos |
| [Jornada — Criacao da Parceria](parcerias/jornada-criacao-parceria.md) | Solicitacao, cadastro, aporte original e formalizacao |
| [Jornada — Aditivo da Parceria](parcerias/jornada-aditivo-parceria.md) | Aditivo de vigencia e aditivo de aporte |
| [Jornada — Suspensao e Encerramento](parcerias/jornada-suspensao-encerramento-parceria.md) | Suspensao, reativacao e encerramento com cascata |
| [Jornada — Suspensao em Cascata](parcerias/jornada-suspensao-cascata.md) | Impacto da suspensao sobre Programas e Iniciativas |

## Consumidores

| Perfil | Atuacao |
|--------|---------|
| Diretoria da Agencia de Fomento | Mantem Plano Estrategico e Eixos |
| Servidor da Area Tecnica (Agencia de Fomento) | Mantem Programas (recursos, comite, aportes recebidos) |
| Servidor da Area de Parcerias (Agencia de Fomento) | Mantem Parcerias (vigencias, aportes, documentos) |
| Gestor da Parceria / Diretoria | Consulta dashboards financeiros de parcerias (EPIC-M010-004) |

## Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece `Instituicao`, `Documento` e `TipoDocumento` |
| M016 | Modulo interno | Fornece `ContaBancaria` como destino do deposito em `RegistrarAporteFinanceiro` — deferido para pos-M014 |
| M003 | Modulo interno | Fornece `ConsultarIniciativasPorPrograma` e consumo consolidado por iniciativa |
| M014 | Modulo interno | Fornece movimentacoes e prestacoes de contas que alimentam consolidacoes de consumo |
| M016 / Acao Transversal | Modulo interno | Fornece politica/faixas de Acao Transversal e recebe a reserva financeira institucional calculada na Parceria |

---

## Sobre o Modulo

Atualmente, o planejamento estrategico, a gestao de parcerias e a gestao de programas de fomento sao feitos de forma isolada, sem integracao entre os instrumentos de cooperacao e os programas que executam as acoes. Parcerias sao controladas em documentos avulsos, sem rastreabilidade da Instituicao vinculada e dos aportes financeiros. Este modulo resolve esse problema ao prover uma plataforma integrada para gestao do plano estrategico, parcerias institucionais e programas de fomento. O sucesso sera medido pela capacidade de rastrear a alocacao de recursos desde o eixo estrategico ate os editais e projetos financiados.

---

## Dominio

O sistema e estruturado em tres subdominios integrados (cada um com sua propria pasta):

**Planejamento** — A agencia define seus planejamentos estrategicos e eixos que orientam a criacao de programas. Pode haver mais de um planejamento cadastrado para ciclos diferentes, mas so pode haver um plano ativo por vez (RN09). Detalhes em [planejamento](planejamento/processo.md).

**Programas** — Programas sao o instrumento de execucao, demandados por uma Instituicao (RN16), orientados por eixos (RN01), com comite de governanca, e podem receber aportes de uma ou mais Parcerias via `AporteFinanceiroParceriaPrograma` (N:N, RN11). Detalhes em [programas](programas/README.md).

**Parcerias** — Instrumento formal vinculado a exatamente uma Instituicao, com Vigencia (original + aditivos), aportes financeiros recebidos e Documentos regularizadores. Parcerias destinam aportes aos Programas (outflow). Detalhes em [parcerias](parcerias/README.md).

> Editais sao configurados e gerenciados em M011. Apos a contratacao/outorga, o M003 gerencia a iniciativa resultante.

---

<a id="regras-de-negocio"></a>

## Regras de Negocio Consolidadas

| ID | Descricao | Prioridade | Subdominio |
|----|-----------|------------|------------|
| RN01 | Um programa deve estar vinculado a pelo menos um eixo estrategico. | Must | programas |
| RN02 | Parcerias e Programas relacionam-se exclusivamente via `AporteFinanceiroParceriaPrograma` (N:N). Uma Parceria pode aportar em varios Programas; um Programa pode receber aportes de varias Parcerias. Nao existe relacao direta "parceria de referencia". | Must | programas / parcerias |
| RN03 | O registro de aporte financeiro requer que a parceria tenha data de assinatura preenchida. | Must | parcerias |
| RN04 | Cada aporte financeiro deve ter origem na Instituicao vinculada a Parceria, cadastrada em M008. | Must | parcerias |
| RN06 | A primeira Vigencia da Parceria tem `isAditivo = false` e e criada junto ao cadastro (RN15). Toda alteracao posterior ocorre via nova Vigencia com `isAditivo = true`, contendo justificativa e documento (termo aditivo). Uma Vigencia aditivo exige: (a) `dataAssinatura` posterior a da Vigencia original; (b) `dataFim` posterior a `vigenciaFimCorrente` anterior. | Must | parcerias |
| RN08 | Um eixo estrategico pertence a exatamente um plano estrategico. | Must | planejamento |
| RN09 | Um plano estrategico possui vigencia definida (data inicio e fim); so pode haver um plano ativo por vez. | Should | planejamento |
| RN10 | Uma Parceria deve estar vinculada a exatamente uma Instituicao (M008). | Must | parcerias |
| RN11 | Uma Parceria pode aportar em um ou mais Programas; um Programa pode receber aportes de uma ou mais Parcerias. Cada aporte exige valor nao-negativo (`>= 0`, admite zero) e Parceria vigente. Aportes com valor negativo sao rejeitados. | Must | programas |
| RN12 | Todo AporteFinanceiro deve estar formalizado por um `Documento`. No ato do registro do aporte, o sistema sempre classifica esse Documento com `TipoDocumento = "Termo de Descentralizacao"`. | Must | parcerias |
| RN13 | Um Programa nao pode comecar antes da `vigenciaInicioCorrente` (RN15) de nenhuma Parceria que nele aporte, nem terminar depois da `vigenciaFimCorrente`. Invariante estrutural: validar ao registrar aporte, ao alterar datas do Programa e ao registrar nova Vigencia. | Must | programas / parcerias |
| RN14 | A Parceria deve manter saldos financeiros nao negativos. Quando houver Acao Transversal, o saldo operacional para Programas deve considerar a reserva transversal antes de permitir novos aportes. Aportes retirados do Programa nao compoem o total alocado e devolvem saldo alocavel a Parceria. | Must | parcerias / programas |
| RN15 | A vigencia efetiva da Parceria e derivada das instancias de `Vigencia`: `vigenciaInicioCorrente = MIN(Vigencia.dataInicio)` e `vigenciaFimCorrente = MAX(Vigencia.dataFim)`. Toda Parceria deve ter exatamente uma Vigencia com `isAditivo = false`. | Must | parcerias |
| RN16 | Todo Programa deve ter exatamente uma `Instituicao` demandante (relacao `demandadoPor`). | Must | programas |
| RN17 | O primeiro `AporteFinanceiro` de uma Parceria tem `isAditivo = false` (original). Um aditivo so pode ser registrado apos existir pelo menos um original, com `dataAporte` posterior. | Must | parcerias |
| RN18 | Um `AporteFinanceiro` com `isAditivo = true` pode ser editado ou removido, e o `saldo` e recalculado. A operacao e rejeitada se o saldo resultante ficar negativo (mantem RN14). | Must | parcerias |
| RN19 | Transicao `EmElaboracao → Vigente` exige: `dataAssinatura` + >=1 `AporteFinanceiro` original + Vigencia original + >=1 `Documento` anexado + hoje em `[vigenciaInicioCorrente, vigenciaFimCorrente]` (inclusivo). | Must | parcerias |
| RN20 | A Taxa de Gestao de Parcerias e calculada uma unica vez por AporteFinanceiro, com base na PoliticaTaxaGestaoParcerias vigente parametrizada no M016; Programas nao recalculam Taxa de Gestao sobre aportes recebidos. | Must | parcerias / financeiro |
| RN21 | O valor da Taxa de Gestao de Parcerias nao compoe o saldo alocavel em Programas (`valorTaxaGestao` e descontado antes de calcular `saldoAlocavelEmProgramas`). | Must | parcerias / programas |
| RN22 | O saldo alocavel em Programas e `SUM(AporteFinanceiro.valorInvestido) - valorTaxaGestao - SUM(AporteFinanceiroParceriaPrograma.valor em estado ATIVO)`, sempre `>= 0`. | Must | parcerias / programas |
| RN23 | Cada AporteFinanceiro gera sua propria `TaxaGestaoParcerias` com snapshot imutavel da politica, faixa, percentual, base de calculo e valor calculado. Nao se recalcula retroativamente para aportes anteriores. | Must | parcerias / financeiro |
| RN24 | A prestacao financeira da AcaoTransversal pertence ao M016; a prestacao de contas da Iniciativa/Projeto permanece no M014. | Must | financeiro / prestacao de contas |
| RI1 | Um Programa pode ser removido sem impacto quando nao possui nenhuma Iniciativa vinculada. Se ja houver Iniciativa vinculada, a remocao e bloqueada e o Programa deve ser encerrado para preservar historico. | Must | programas |
| RI2 | Uma Parceria transita para `Encerrada` em dois gatilhos: solicitacao do usuario ou expiracao automatica (`vigenciaFimCorrente < hoje`). Em ambos os casos, exige `justificativa` obrigatoria e encerra em cascata todos os Programas aportados, apos confirmacao explicita. | Must | parcerias |
| RI3 | Uma Parceria so pode ser removida se nao estiver vinculada a nenhum Programa (sem `AporteFinanceiroParceriaPrograma`). | Must | parcerias |
| RI4 | Ao suspender uma Parceria, todos os Programas aportados e Iniciativas vinculadas devem ser suspensos enquanto a Parceria permanecer suspensa. | Must | parcerias / programas / iniciativas |
