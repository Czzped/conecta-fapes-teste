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

## Indice de Documentos

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica consolidada: comandos, consultas, jobs |
| [Contrato API](contrato-api.md) | Contrato HTTP REST consolidado |
| [Backlog](backlog.md) | EPICs, US e rastreabilidade |
| [Planejamento — Estrutural](planejamento/modelo-estrutural.md) / [Comportamental](planejamento/modelo-comportamental.md) | Plano Estrategico + Eixos |
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
| Gestor da Parceria / Diretoria | Consulta relatorios financeiros de parcerias (EPIC-M010-004) |

## Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece `Instituicao`, `Documento` e `TipoDocumento` |
| M016 | Modulo interno | Fornece `ContaBancaria` como destino do deposito em `RegistrarAporteFinanceiro` — deferido para pos-M014 |
| M013 | Modulo interno | Fornece `ConsultarExecucaoPorPrograma` para calculo de `valorExecutado` nos relatorios financeiros de parcerias |
| M003 | Modulo interno | Fornece `ConsultarProjetosPorPrograma` para navegacao Projeto ↔ Programa nos relatorios |

---

## Sobre o Modulo

Atualmente, o planejamento estrategico, a gestao de parcerias e a gestao de programas de fomento sao feitos de forma isolada, sem integracao entre os instrumentos de cooperacao e os programas que executam as acoes. Parcerias sao controladas em documentos avulsos, sem rastreabilidade da Instituicao vinculada e dos aportes financeiros. Este modulo resolve esse problema ao prover uma plataforma integrada para gestao do plano estrategico, parcerias institucionais e programas de fomento. O sucesso sera medido pela capacidade de rastrear a alocacao de recursos desde o eixo estrategico ate os editais e projetos financiados.

---

## Dominio

O sistema e estruturado em tres subdominios integrados (cada um com sua propria pasta):

**Planejamento** — A agencia define seu plano estrategico e eixos que orientam a criacao de programas. So pode haver um plano ativo por vez (RN09). Detalhes em [planejamento/](planejamento/).

**Programas** — Programas sao o instrumento de execucao, demandados por uma Instituicao (RN16), orientados por eixos (RN01), com comite de governanca, e podem receber aportes de uma ou mais Parcerias via `AporteFinanceiroParceriaPrograma` (N:N, RN11). Detalhes em [programas/](programas/).

**Parcerias** — Instrumento formal vinculado a exatamente uma Instituicao, com Vigencia (original + aditivos), aportes financeiros recebidos e Documentos regularizadores. Parcerias destinam aportes aos Programas (outflow). Detalhes em [parcerias/](parcerias/).

> Editais sao configurados em M011 e gerenciados operacionalmente em M003 apos contratacao.

---

## Regras de Negocio (consolidadas)

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
| RN14 | A Parceria possui `saldo = SUM(AporteFinanceiro.valorInvestido) - SUM(AporteFinanceiroParceriaPrograma.valor em estado ATIVO)`, sempre `>= 0`. Aportes retirados do Programa nao compoem o total alocado e devolvem saldo a Parceria. | Must | parcerias / programas |
| RN15 | A vigencia efetiva da Parceria e derivada das instancias de `Vigencia`: `vigenciaInicioCorrente = MIN(Vigencia.dataInicio)` e `vigenciaFimCorrente = MAX(Vigencia.dataFim)`. Toda Parceria deve ter exatamente uma Vigencia com `isAditivo = false`. | Must | parcerias |
| RN16 | Todo Programa deve ter exatamente uma `Instituicao` demandante (relacao `demandadoPor`). | Must | programas |
| RN17 | O primeiro `AporteFinanceiro` de uma Parceria tem `isAditivo = false` (original). Um aditivo so pode ser registrado apos existir pelo menos um original, com `dataAporte` posterior. | Must | parcerias |
| RN18 | Um `AporteFinanceiro` com `isAditivo = true` pode ser editado ou removido, e o `saldo` e recalculado. A operacao e rejeitada se o saldo resultante ficar negativo (mantem RN14). | Must | parcerias |
| RN19 | Transicao `EmElaboracao → Vigente` exige: `dataAssinatura` + >=1 `AporteFinanceiro` original + Vigencia original + >=1 `Documento` anexado + hoje em `[vigenciaInicioCorrente, vigenciaFimCorrente]` (inclusivo). | Must | parcerias |
| RI1 | Um Programa pode ser removido sem impacto quando nao possui nenhuma Iniciativa vinculada. Se ja houver Iniciativa vinculada, a remocao e bloqueada e o Programa deve ser encerrado para preservar historico. | Must | programas |
| RI2 | Uma Parceria transita para `Encerrada` em dois gatilhos: solicitacao do usuario ou expiracao automatica (`vigenciaFimCorrente < hoje`). Em ambos os casos, exige `justificativa` obrigatoria e encerra em cascata todos os Programas aportados, apos confirmacao explicita. | Must | parcerias |
| RI3 | Uma Parceria so pode ser removida se nao estiver vinculada a nenhum Programa (sem `AporteFinanceiroParceriaPrograma`). | Must | parcerias |
| RI4 | Ao suspender uma Parceria, todos os Programas aportados e Iniciativas vinculadas devem ser suspensos enquanto a Parceria permanecer suspensa. | Must | parcerias / programas / iniciativas |
