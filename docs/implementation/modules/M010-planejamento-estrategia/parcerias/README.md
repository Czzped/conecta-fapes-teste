# Parcerias

[← Voltar ao M010](../README.md)

---

## Visao Geral

O subdominio de Parcerias organiza o ciclo de vida das cooperacoes institucionais firmadas pela agencia de fomento com uma Instituicao. Ele cobre a solicitacao, formalizacao, vigencia, aditivos, aportes financeiros, alocacao de recursos em Programas ou Iniciativas, suspensao, encerramento e rastreabilidade documental.

Uma Parceria pertence a exatamente uma Instituicao e pode aportar recursos em um ou mais Programas. O Programa tambem pode receber aportes de mais de uma Parceria, sempre por meio de `AporteFinanceiroParceriaPrograma`.

## Dores

| Dor | Impacto | Resposta do Subdominio |
|-----|---------|------------------------|
| Falta de gestao processual de como criar uma parceria | A criacao da parceria depende de documentos avulsos, troca de informacoes fora do sistema e pouca clareza sobre o que falta para formalizar a cooperacao. | O processo de criacao define inicio pela solicitacao da Instituicao, envio do documento de solicitacao, analise, cadastro, vigencia original, documentos e criterios para transicao para `Vigente`. |
| Falta de gestao financeira da parceria | Nao ha rastreabilidade clara sobre quanto foi investido, quando o recurso foi implementado e quando foi alocado em Programas ou Iniciativas. | O modelo separa aportes recebidos pela Parceria (`AporteFinanceiro`) dos recursos destinados a Programas (`AporteFinanceiroParceriaPrograma`), permitindo acompanhar saldo, historico de aportes, aditivos e alocacoes. |

## Documentos

| Documento | Finalidade |
|-----------|------------|
| [Processo](processo.md) | Fluxos operacionais de criacao, aditivo, suspensao, encerramento e suspensao em cascata. |
| [Jornada — Criacao da Parceria](jornada-criacao-parceria.md) | Jornada visual da solicitacao ate a formalizacao da Parceria. |
| [Jornada — Aditivo da Parceria](jornada-aditivo-parceria.md) | Jornada visual para aditivo de vigencia ou de aporte financeiro. |
| [Jornada — Suspensao e Encerramento](jornada-suspensao-encerramento-parceria.md) | Jornada visual para suspender, reativar ou encerrar a Parceria. |
| [Jornada — Suspensao em Cascata](jornada-suspensao-cascata.md) | Jornada visual do impacto da suspensao sobre Programas e Iniciativas. |
| [Modelo Estrutural](modelo-estrutural.md) | Classes, atributos e relacionamentos do subdominio. |
| [Modelo Comportamental](modelo-comportamental.md) | Estados, transicoes e regras de comportamento da Parceria. |
| [EPIC-M010-002 — Gestao de Parcerias](epics/EPIC-M010-002.md) | Backlog principal de gestao de parcerias. |
| [EPIC-M010-004 — Dashboard de Parcerias](epics/EPIC-M010-004.md) | Backlog dos dashboards global e local da Parceria. |

## Capacidades Principais

| Capacidade | Resultado Esperado |
|------------|--------------------|
| Criar e formalizar Parceria | Registrar Instituicao vinculada, vigencia original, documentos e aporte original. |
| Registrar aportes financeiros | Controlar valores investidos pela Instituicao vinculada, com documento formalizador. |
| Registrar aditivos | Preservar historico de nova vigencia ou novo aporte sem sobrescrever a Parceria original. |
| Alocar recursos em Programas | Destinar parte do saldo da Parceria a Programas, mantendo rastreabilidade financeira. |
| Consultar dashboards e saldo | Responder quanto foi investido, aportado, alocado, consumido e quanto permanece disponivel. |
| Suspender ou encerrar Parceria | Controlar impacto sobre Programas e Iniciativas vinculadas. |

---

## Fluxo Financeiro

O recurso da Parceria percorre quatro camadas distintas. Cada camada tem seu proprio conceito, formula e dono.

### 1. Entrada — AporteFinanceiro

A Instituicao vinculada deposita dinheiro na conta bancaria da agencia de fomento (M008/ContaBancaria). Cada deposito gera um `AporteFinanceiro` com `valorInvestido > 0`.

```
valorBrutoRecebido = SUM(AporteFinanceiro.valorInvestido)
```

Regras de registro: Parceria deve ter `dataAssinatura` (RN03); origem do aporte deve ser a mesma Instituicao vinculada (RN04); primeiro aporte tem `isAditivo = false`, aditivos exigem `dataAporte` posterior (RN17); aditivo pode ser editado/removido desde que saldo nao fique negativo (RN18); todo aporte exige `Documento` classificado como "Termo de Descentralizacao" (RN12).

### Aditivo de AporteFinanceiro

Um `AporteFinanceiro` com `isAditivo = true` representa recurso adicional recebido da mesma Instituicao vinculada apos o aporte original.

**Pre-condicoes para registro (RN17):**
- Deve existir pelo menos um `AporteFinanceiro` com `isAditivo = false`
- `dataAporte` deve ser posterior ao `dataAporte` do aporte original
- Mesmas exigencias do original: `Documento` como "Termo de Descentralizacao" (RN12) e origem na mesma Instituicao (RN04)

**Impacto no saldo — recalculo imediato apos registro:**

```
valorBrutoRecebido  += aditivo.valorInvestido
valorTaxaGestao     += TaxaGestaoParcerias gerada pelo aditivo (snapshot da politica vigente no M016)
saldoAlocavelEmProgramas = valorBrutoRecebido - valorTaxaGestao - SUM(AporteFinanceiroParceriaPrograma.valor[ATIVO])
```

**Edicao e remocao de aditivo (RN18):**
- Aporte aditivo pode ser editado ou removido apos criacao
- Operacao rejeitada se `saldoAlocavelEmProgramas` resultante ficar negativo (INV-M010-PAR-01)
- Aporte original (`isAditivo = false`) nao pode ser removido enquanto existirem aditivos

**Aplicacao da Taxa de Gestao:**
- Calculada no ato do registro do aditivo, com base na `PoliticaTaxaGestaoParcerias` vigente **naquele momento** no M016
- Nao retroativa: aportes anteriores nao sao recalculados (RN23)
- Cada aditivo gera sua propria `TaxaGestaoParcerias` com snapshot imutavel de faixa, percentual e valor

**Exemplo:**

| Momento | Evento | valorBrutoRecebido | valorTaxaGestao | saldoAlocavel |
|---------|--------|--------------------|-----------------|---------------|
| t0 | Aporte original R$ 1.000.000 (taxa 5%) | 1.000.000 | 50.000 | 950.000 |
| t1 | Aditivo R$ 500.000 (taxa 4%) | 1.500.000 | 70.000 | 1.430.000 |
| t2 | Alocacao em Programa R$ 300.000 | 1.500.000 | 70.000 | 1.130.000 |
| t3 | Remocao do aditivo (t1) — saldo resultante ok | 1.000.000 | 50.000 | 650.000 |

### 2. Deducao — Taxa de Gestao de Parcerias

No ato de registrar o `AporteFinanceiro`, o sistema identifica a `VersaoPoliticaTaxaGestao` vigente no M016 e calcula a taxa conforme a `VersaoFaixaPercentual` correspondente ao valor do aporte. Gera uma entidade `TaxaGestaoParcerias` com **snapshot imutavel** da versao da politica, faixa e percentual aplicados — nao se recalcula retroativamente (RN23).

```
valorTaxaGestao = SUM(TaxaGestaoParcerias.valorTaxaGestao WHERE parceria = this)
```

O `valorTaxaGestao` **nao compoe** o saldo alocavel em Programas (RN21). Programas nao recalculam taxa sobre aportes recebidos (RN20). M016 custodia o valor e o aplica via `AcaoTransversal`.

**Referencia normativa:** [Resolucao CCAF n. 334/2023 — FAPES](https://fapes.es.gov.br/Media/fapes/Resolu%C3%A7%C3%B5es/Resolu%C3%A7%C3%A3o_CCAF_n%C2%BA_334.2023_-_utiliza%C3%A7%C3%A3o_recursos_financeiros_de_projetos_e-ou_programas_em_parcerias_destinados_a_A%C3%A7%C3%A3o_Transversal_para_a_FAPES..pdf)

Os percentuais sao parametrizados em `VersaoPoliticaTaxaGestao` + `VersaoFaixaPercentual` no M016 — nunca constantes fixas no codigo. Uma nova Resolucao cria nova versao da politica; aportes anteriores permanecem com o snapshot original.

| Faixa (Resolucao CCAF 334/2023) | Percentual |
|----------------------------------|------------|
| R$ 50.000 a R$ 2.000.000 | 5% |
| R$ 2.000.000,01 a R$ 5.000.000 | 4% |
| Acima de R$ 5.000.000 | 3% |

### 3. Saldo Alocavel em Programas

```
saldoAlocavelEmProgramas = valorBrutoRecebido - valorTaxaGestao - SUM(AporteFinanceiroParceriaPrograma.valor[ATIVO])
```

Invariante: sempre `>= 0` (RN14, RN22). Quando a Parceria retira aporte de um Programa, o valor retorna ao saldo.

### 4. Saida — Alocacao em Programas

A Parceria aloca para Programas via entidade N:N `AporteFinanceiroParceriaPrograma` (definida em `programas/`). Valor `>= 0`; negativo rejeitado (RN11). Parceria deve estar vigente. Datas do Programa devem caber na vigencia da Parceria (RN13).

### 5. Execucao — Consumido pelas Iniciativas

A execucao do recurso ocorre nas **Iniciativas (projetos)** vinculadas aos Programas que receberam alocacao desta Parceria. Isso inclui projetos de **demanda induzida** e qualquer projeto ligado ao Programa aportado.

```
valorConsumido = SUM(Iniciativa.valorExecutado
                     WHERE Iniciativa.programa IN programas_aportados_por_esta_parceria)

saldoNivelPrograma = valorAlocado - valorConsumido
```

`valorExecutado` de cada Iniciativa e calculado por M003 a partir das movimentacoes registradas em M014 (pagamentos, compromissos reconhecidos). A Parceria nao armazena `valorConsumido` diretamente — acessa via consolidacao M003/M014.

A prestacao financeira da `AcaoTransversal` (Taxa de Gestao) pertence ao M016, nao ao M014 (RN24).

### Termos canonicos

| Conceito | Definicao | Nao usar |
|----------|-----------|----------|
| `valorInvestido` | Valor de cada AporteFinanceiro recebido pela Parceria | "recebido", "depositado" |
| `valorBrutoRecebido` | SUM de todos os `valorInvestido` da Parceria | "total recebido" |
| `valorTaxaGestao` | Taxa retida sobre cada aporte, calculada por M010, custodiada por M016 | "reserva", "retencao" |
| `saldoAlocavelEmProgramas` | Saldo disponivel para destinar a Programas | "saldo livre", "saldo nao alocado" |
| `valorAlocado` | Parcela destinada a um Programa via AporteFinanceiroParceriaPrograma | "reservado", "comprometido" |
| `valorConsumido` | Consolidacao do que foi executado nas Iniciativas (projetos de demanda induzida e projetos ligados a Programas aportados); calculado por M003 via M014 | "pago", "executado" |

---

## Regras de Negocio

As regras oficiais ficam centralizadas em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas). Este subdominio referencia principalmente: `RN02`, `RN03`, `RN04`, `RN06`, `RN10`, `RN11`, `RN12`, `RN13`, `RN14`, `RN15`, `RN17`, `RN18`, `RN19`, `RN20`, `RN21`, `RN22`, `RN23`, `RN24`, `RI2`, `RI3`, `RI4`.
