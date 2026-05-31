# Processo 1 — Fomento

## Visao Geral

O Processo de Fomento representa o aporte financeiro de um Programa, Parceria ou recurso interno para
fomentar projetos de um eixo estrategico. Um Fomento define as faixas (com
valores minimos, maximos e duracao maxima), os publicos-alvo de cada faixa, as rubricas
permitidas por faixa e os resultados esperados (produtos, servicos, processos).

O Fomento e a base financeira e de regras de investimento que uma Captacao (Processo 2) ira
utilizar. Uma Captacao somente pode ser criada a partir de um Fomento com estado `APROVADO`.

---

## Atores

| Ator | Papel no processo |
|------|-------------------|
| GestorFomento | Papel atribuivel a qualquer funcionario da FAPES autorizado a buscar aportes de Programas e Parcerias. Cria, edita, aprova e encerra o Fomento. |
| AnalistaTecnico | Configura os detalhes tecnicos do Fomento: rubricas e bolsas por faixa de investimento. |

---

## Fluxo do Processo

```mermaid
flowchart TD
    subgraph GestorFomento[GestorFomento]
        A[Identificar necessidade de fomento]
        B[Criar Fomento com titulo, descricao, data de inicio e data de fim]
        AT[Definir area tecnica responsavel]
        C[Vincular ao eixo estrategico do M010]
        D[Adicionar aportes financeiros]
        E{Tipo de origem do aporte}
        F[Selecionar Programa e informar valor aportado]
        G[Selecionar Parceria e informar valor aportado]
        RI[Selecionar ContaContabil interna e informar valor aportado]
        H[Adicionar mais aportes quando necessario]
        I[Definir resultados esperados]
        J[Definir faixas]
        K[Informar nome, publico-alvo, valor minimo, valor maximo e duracao maxima]
        TA[Associar tipos de projeto a cada faixa]
        P[Revisar fomento]
        Q{Fomento valido?}
        R[Aprovar Fomento]
    end

    subgraph AnalistaTecnico[AnalistaTecnico]
        L[Selecionar rubricas permitidas por faixa]
        M{Rubrica do tipo Bolsa selecionada?}
        N[Configurar modalidades e niveis de bolsa para a faixa]
        O[Sistema resolve ultima versao ativa de cada nivel no M001]
    end

    A --> B --> AT --> C --> D --> E
    E -->|PROGRAMA| F --> H
    E -->|PARCERIA| G --> H
    E -->|RECURSO_INTERNO| RI --> H
    H --> I --> J --> K --> TA
    TA --> L
    L --> M
    M -->|Sim| N --> O --> P
    M -->|Nao| P
    P --> Q
    Q -->|Nao| J
    Q -->|Sim| R
    R --> S[Fomento disponivel para uso em Captacoes]
```

---

## Atividades e Responsaveis

| # | Atividade | Responsavel | Descricao |
|---|-----------|-------------|-----------|
| 1 | Identificar necessidade de fomento | GestorFomento | Identifica necessidade de fomentar projetos em um eixo estrategico e decide iniciar novo Fomento. |
| 2 | Criar Fomento com titulo e descricao | GestorFomento | Registra o Fomento com titulo, descricao do objetivo, data de inicio e data de fim da vigencia. Inicia no estado `EM_ELABORACAO`. |
| 3 | Definir area tecnica responsavel | GestorFomento | Seleciona a Area Tecnica da FAPES responsavel pela gestao deste fomento. |
| 4 | Vincular ao eixo estrategico | GestorFomento | Seleciona o eixo do planejamento estrategico (M010) que o Fomento pretende atingir. |
| 5 | Adicionar aportes financeiros | GestorFomento | Inclui um ou mais aportes com tipo de origem (PROGRAMA, PARCERIA ou RECURSO_INTERNO), referencia ao Programa ou Parceria do M010 quando aplicavel, ou a ContaContabil do M016 quando for recurso interno, valor aportado, data do aporte, indicacao se e aporte aditivo e justificativa quando aplicavel. |
| 6 | Definir resultados esperados | GestorFomento | Declara os produtos, servicos ou processos esperados dos projetos financiados. Opcional. |
| 7 | Definir faixas | GestorFomento / AnalistaTecnico | Cria uma ou mais faixas. Cada faixa e a regua de valor e duracao para um ou mais tipos de projeto especificos. Informa nome, valor minimo, valor maximo, duracao maxima e publico-alvo quando diferenciado. |
| 8 | Associar tipos de projeto a cada faixa | GestorFomento / AnalistaTecnico | Para cada faixa, seleciona quais tipos de projeto ela cobre. Ex: "Pesquisa — Faixa A" cobre apenas Pesquisa; uma faixa pode cobrir mais de um tipo quando os limites de investimento sao iguais. O conjunto de tipos apoiados pelo Fomento e derivado das faixas cadastradas. |
| 9 | Selecionar rubricas permitidas por faixa | AnalistaTecnico | Para cada faixa, seleciona do catalogo M008 rubricas e subrubricas autorizadas para o orcamento dos projetos daquela faixa. Define obrigatoriedade, limites de valor ou percentual, observacoes e restricoes especificas. |
| 10 | Configurar modalidades e niveis de bolsa por faixa | AnalistaTecnico | Quando rubrica do tipo Bolsa selecionada, configura modalidades e niveis com cotas e limite de bolsistas. Sistema resolve automaticamente ultima versao ativa de cada nivel no M001. |
| 11 | Revisar fomento | GestorFomento | Confere vigencia, area tecnica, faixas, tipos associados, aportes e rubricas antes da aprovacao. Retorna para ajustes se necessario. |
| 12 | Aprovar Fomento | GestorFomento | Transita para `APROVADO`. Exige ao menos um aporte, uma faixa, um tipo de projeto associado a faixa e area tecnica definida. Disponivel para uso em Captacoes. |

---

## Saida do Processo 1

Fomento aprovado contendo:

- ao menos um aporte financeiro com origem em Programa, Parceria ou recurso interno;
- eixo estrategico atingido;
- ao menos uma faixa;
- tipos de projeto aceitos pelo Fomento;
- rubricas e subrubricas permitidas por faixa, com percentuais, restricoes e observacoes quando aplicavel;
- configuracoes de modalidade e nivel de bolsa por faixa, com a ultima versao ativa resolvida no M001, quando a rubrica Bolsa estiver selecionada;
- resultados esperados (produtos, servicos ou processos), quando aplicavel.

---

## Cronograma Financeiro

| Restricao | Regra |
|-----------|-------|
| Total de aportes | Soma dos `valorAportado` de todos os `AporteFomento` |
| Aporte individual | Cada aporte deve ser maior que zero |
| Origem exclusiva | Cada aporte referencia exatamente um Programa, uma Parceria ou um recurso interno |

---

## Subprocesso: Aporte Aditivo

Apos aprovacao, o GestorFomento pode registrar um novo `AporteFomento` com `isAditivo=true` para ampliar o valor disponivel do Fomento. O aporte aditivo preserva origem, valor, data do aporte e justificativa no proprio historico de aportes do Fomento.

```mermaid
flowchart TD
    subgraph GestorFomento[GestorFomento]
        A[Identificar necessidade de aporte aditivo]
        B[Selecionar origem do aporte]
        C[Informar valor e data do aporte]
        D[Informar justificativa]
        E[Registrar AporteFomento com isAditivo=true]
    end

    A --> B --> C --> D --> E
    E --> F[Fomento atualizado com novo valor disponivel]
```

| # | Atividade | Responsavel | Descricao |
|---|-----------|-------------|-----------|
| 1 | Identificar necessidade de aporte aditivo | GestorFomento | Identifica que o fomento precisa de ampliacao de valor apos aprovacao. |
| 2 | Selecionar origem do aporte | GestorFomento | Define se a origem do aporte aditivo e PROGRAMA, PARCERIA ou RECURSO_INTERNO. |
| 3 | Informar valor e data do aporte | GestorFomento | Informa o valor financeiro a ser acrescido ao total do fomento e a data do aporte. O valor deve ser maior que zero. |
| 4 | Informar justificativa | GestorFomento | Registra o motivo do aporte aditivo. Obrigatorio. |
| 5 | Registrar AporteFomento | GestorFomento | Confirma o aporte com `isAditivo=true`. O sistema preserva o registro no historico de aportes e recalcula o total financeiro pela soma dos aportes. |

**Regras do aporte aditivo:**

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-A01 | GestorFomento | Aporte aditivo so pode ser registrado em Fomento com estado `APROVADO`. |
| RN-A02 | GestorFomento | Aporte aditivo deve possuir valor maior que zero, data do aporte e justificativa. |
| RN-A03 | GestorFomento | Quando a origem for RECURSO_INTERNO, o aporte deve referenciar uma ContaContabil interna da FAPES. |
| RN-A04 | Sistema | O total financeiro do Fomento e recalculado pela soma de todos os AporteFomento, incluindo os registros com `isAditivo=true`. |

---

## Subprocesso: Remanejamento de Valores entre Faixas

Apos a selecao dos projetos (Processo 3), o GestorFomento pode remanejar valor aportado entre
faixas do mesmo Fomento. Isso ocorre quando a demanda real de projetos aprovados em uma faixa
supera ou nao atinge o valor originalmente alocado.

Cada remanejamento e um registro imutavel com historico dos valores anteriores de cada faixa.

```mermaid
flowchart TD
    subgraph GestorFomento[GestorFomento]
        A[Identificar desequilibrio de demanda entre faixas]
        B[Selecionar faixa de origem — faixa com saldo excedente]
        C[Selecionar faixa de destino — faixa com deficit de valor]
        D[Informar valor a remanejar]
        E[Informar justificativa]
        F[Registrar RemanejamentoFaixas]
    end

    A --> B --> C --> D --> E --> F
    F --> G[Sistema atualiza valorAportado efetivo da faixaOrigem e faixaDestino e preserva historico]
```

| # | Atividade | Responsavel | Descricao |
|---|-----------|-------------|-----------|
| 1 | Identificar desequilibrio de demanda | GestorFomento | Apos resultado da selecao, verifica quais faixas tiveram mais ou menos projetos aprovados do que o valor alocado comporta. |
| 2 | Selecionar faixa de origem | GestorFomento | Seleciona a faixa com saldo excedente — valor aportado maior do que a demanda de projetos aprovados. |
| 3 | Selecionar faixa de destino | GestorFomento | Seleciona a faixa com deficit — valor aportado insuficiente para atender os projetos aprovados. Deve ser diferente da faixa de origem. |
| 4 | Informar valor a remanejar | GestorFomento | Define o valor a ser transferido. Nao pode exceder o valorAportado efetivo da faixa de origem. |
| 5 | Informar justificativa | GestorFomento | Registra o motivo do remanejamento — geralmente excesso ou falta de demanda. Obrigatorio. |
| 6 | Registrar RemanejamentoFaixas | GestorFomento | Confirma o remanejamento. Sistema grava registro imutavel com valores anteriores de cada faixa para rastreabilidade e atualiza os valores efetivos. |

**Regras do remanejamento:**

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-R01 | GestorFomento | Remanejamento so pode ser registrado em Fomento com estado `APROVADO`. |
| RN-R02 | GestorFomento | Faixa de origem e faixa de destino devem pertencer ao mesmo Fomento. |
| RN-R03 | GestorFomento | Faixa de origem e faixa de destino devem ser diferentes. |
| RN-R04 | GestorFomento | O valor remanejado deve ser maior que zero e nao pode exceder o valorAportado efetivo da faixa de origem. |
| RN-R05 | Sistema | O registro e imutavel — preserva `valorOrigemAnterior` e `valorDestinoAnterior` para rastreabilidade. |
| RN-R06 | Sistema | Apos remanejamento, o valorAportado efetivo de cada faixa e recalculado considerando todos os remanejamentos registrados. |

---

## Estados do Fomento

| Estado | Descricao | Efeito nos projetos vinculados |
|--------|-----------|-------------------------------|
| EM_ELABORACAO | Fomento sendo configurado, ainda nao aprovado. | Nenhum — nao ha captacoes ativas. |
| APROVADO | Fomento ativo e operacional. | Captacoes e projetos operam normalmente. |
| INTERROMPIDO | GestorFomento suspendeu o fomento temporariamente por algum motivo. | Captacoes e projetos vinculados sao suspensos em cascata enquanto o fomento estiver neste estado. |
| ENCERRADO | GestorFomento cancelou o fomento antes do prazo. | Captacoes e projetos vinculados sao cancelados em cascata. |
| CONCLUIDO | Prazo do fomento (`dataFim`) foi atingido naturalmente. Transicao automatica pelo sistema. | Nenhum novo projeto pode ser captado. Projetos em andamento continuam ate seus proprios prazos. |

```mermaid
stateDiagram-v2
    [*] --> EmElaboracao : GestorFomento cria Fomento
    EmElaboracao --> Aprovado : GestorFomento aprova
    Aprovado --> Interrompido : GestorFomento interrompe (com justificativa)
    Interrompido --> Aprovado : GestorFomento retoma
    Interrompido --> Encerrado : GestorFomento encerra (cancela projetos)
    Aprovado --> Encerrado : GestorFomento encerra (cancela projetos)
    Aprovado --> Concluido : Sistema — dataFim atingida
    Encerrado --> [*]
    Concluido --> [*]
```

---

## Regras de Negocio

| ID | Responsavel | Regra |
|----|-------------|-------|
| RN-F01 | GestorFomento | Todo Fomento deve possuir ao menos um aporte financeiro originado de Programa, Parceria ou recurso interno. |
| RN-F02 | GestorFomento | Todo Fomento deve estar vinculado a exatamente um eixo estrategico do M010. |
| RN-F03 | GestorFomento | Todo Fomento deve possuir ao menos uma faixa antes de ser aprovado. |
| RN-F05 | GestorFomento | Cada aporte deve indicar exatamente uma origem (PROGRAMA, PARCERIA ou RECURSO_INTERNO), possuir valor aportado maior que zero, data do aporte, indicacao se e aporte aditivo e justificativa quando aplicavel. |
| RN-F06 | GestorFomento / AnalistaTecnico | O total financeiro do Fomento e calculado pela soma dos aportes; nao ha total financeiro manual na faixa. |
| RN-F07 | GestorFomento / AnalistaTecnico | Todo Fomento deve possuir ao menos um tipo de projeto aceito. |
| RN-F08 | Sistema | Os tipos de projeto apoiados pelo Fomento sao definidos diretamente no Fomento. |
| RN-F09 | AnalistaTecnico | Rubricas e subrubricas sao configuradas por faixa. |
| RN-F10 | AnalistaTecnico | Quando a rubrica Bolsa estiver permitida em uma faixa, devem ser configuradas as modalidades e niveis de bolsa permitidos. Para cada nivel, o processo recupera automaticamente a ultima versao ativa do M001. |
| RN-F11 | AnalistaTecnico | BolsaPermitidaFaixa so pode ser configurada em faixa que permite rubrica do tipo Bolsa. |
| RN-F12 | AnalistaTecnico | RubricaPermitidaFaixa com rubrica DOACI (RUB-DOACI): o percentualMaximo, quando informado, nao pode superar a tabela normativa aplicavel. |
| RN-F13 | GestorFomento | Somente um Fomento com estado APROVADO pode ser referenciado por uma nova Captacao. |
| RN-F14 | GestorFomento | GestorFomento pode interromper um Fomento APROVADO informando justificativa. Captacoes e projetos vinculados sao suspensos em cascata. |
| RN-F15 | GestorFomento | GestorFomento pode retomar um Fomento INTERROMPIDO. Captacoes e projetos retomam o estado anterior. |
| RN-F16 | GestorFomento | GestorFomento pode encerrar um Fomento APROVADO ou INTERROMPIDO informando justificativa. Captacoes e projetos vinculados sao cancelados em cascata. |
| RN-F17 | Sistema | Fomento transita automaticamente para CONCLUIDO quando a dataFim e atingida. Nenhuma nova Captacao pode ser criada a partir de um Fomento CONCLUIDO. |
| RN-F18 | Sistema | Nenhuma data do cronograma de uma Captacao pode ser anterior a `Fomento.dataInicio` nem posterior a `Fomento.dataFim`. |
| RN-F19 | Sistema | Nenhum projeto gerado por uma Captacao pode ter data de inicio anterior a `Fomento.dataInicio` nem data de fim posterior a `Fomento.dataFim`. |

---

## Integracao

| Modulo | Papel |
|--------|-------|
| M010 | Fornece Programa, Parceria e EixoEstrategico que alimentam o Fomento. |
| M016 | Fornece a referencia de recurso interno quando o aporte vier de fundo/carteira financeira da FAPES. |
| M008 | Fornece o catalogo de TipoProjeto e de Rubricas disponivel para configuracao por faixa. |
| M001 | Fornece modalidades, niveis e a ultima versao ativa de cada nivel de bolsa configurado por faixa. |

---

## Historico de Alteracoes

| Commit | Data | Autor | Descricao |
|--------|------|-------|-----------|
| `a718782` | 2026-05-31 | Paulo Sergio Santos Junior | Renomeia TipoIniciativa para TipoProjeto |
| `3756666` | 2026-05-31 | Paulo Sergio Santos Junior | Move arquivos de processo para subpasta process/ |
| `6b209d7` | 2026-05-29 | victoriocarvalho | Adicao da classe Fomento e outros ajustes |
| `b5e6ef8` | 2026-05-29 | Paulo Sergio Santos Junior | Normaliza terminologia iniciativa -> projeto |
| `985c5f0` | 2026-05-29 | Paulo Sergio Santos Junior | Alinha documentos com a ontologia |
| `e722e02` | 2026-05-29 | Paulo Sergio Santos Junior | Reestrutura ontologia e processos do modulo de captacao |
