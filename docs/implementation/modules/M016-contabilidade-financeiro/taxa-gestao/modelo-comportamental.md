# Modelo Comportamental — Taxa de Gestao de Parcerias

[<< Voltar ao Subdominio](README.md) | [Estrutural](modelo-estrutural.md)

---

## Escopo

Comportamento do subdominio. Apenas a **VersaoPoliticaTaxaGestao** tem maquina de estados (vigencia por Resolucao). A **TaxaGestaoParcerias** NAO tem campo de estado nem ciclo formal: seu progresso e derivado de fatos (ver abaixo).

A taxa nasce **fora** deste subdominio: e calculada pelo M010 no registro do `AporteFinanceiro` e chega via evento `TaxaGestaoParceriasCalculada`. A execucao do recurso (plano, despesas, prestacao) pertence ao subdominio Acao Transversal — a partir da vinculacao via `OutorgaAcaoTransversal`. Fonte canonica: [ontology.yaml](ontology.yaml).

---

## Progresso da TaxaGestaoParcerias (derivado de fatos)

A taxa nao guarda estado. Cada marco e calculado a partir de registros relacionados — nao ha transicao de estado a validar, apenas as pre-condicoes/invariantes de cada fato:

| Marco | Condicao derivada |
|-------|-------------------|
| **Recebida** | `TaxaGestaoParcerias` existe (criada pelo evento `TaxaGestaoParceriasCalculada`; idempotente por `aporteFinanceiroId`; `valorBase > 0` — INV-TGP10) |
| **Classificada** | existe `ClassificacaoContabilTGP` (conta contabil + fundo + centro de custo) |
| **Repassada** | `contaBancariaId` preenchido com conta BANESTES (INV-TGP03) — repasse e opcional |
| **Vinculada** | existe `OutorgaAcaoTransversal`; `SUM(valorVinculado) <= valorTaxaGestao` (INV-TGP01) |
| **Encerrada** | `PrestacaoContasAcaoTransversal` da AcaoTransversal vinculada APROVADA |

As operacoes (classificar, repassar, vincular, encerrar) sao independentes e idempotentes. Detalhe dos fluxos em [processo.md](processo.md).

> Uma taxa pode financiar multiplas `AcoesTransversais` (N:N). Cada vinculacao cria uma `OutorgaAcaoTransversal` separada; a soma dos `valorVinculado` nao pode ultrapassar `valorTaxaGestao` (INV-TGP01).

---

## Snapshot Imutavel

Apos a criacao, os campos de snapshot **nunca** mudam, mesmo que uma nova `VersaoPoliticaTaxaGestao` entre em vigor (AX-TGP05):

| Campo | Imutavel | Invariante |
|-------|----------|------------|
| `versaoFaixaId` | Sim | INV-TGP06 |
| `percentualAplicado` | Sim | INV-TGP05 |
| `valorBase` | Sim | INV-TGP05 |
| `valorTaxaGestao` | Sim | INV-TGP05 |

Encerrar a versao da politica **nao** dispara recalculo de taxas ja emitidas (AX-TGP06). A versao da politica, a faixa e suas siglas (`versaoPoliticaSigla`, `faixaSigla`) derivam de `versaoFaixaId` — uma `VersaoFaixaPercentual` imutavel —, permitindo auditoria historica sem armazenar campos desnormalizados.

---

## Ciclo de Vida: VersaoPoliticaTaxaGestao

```mermaid
stateDiagram-v2
    [*] --> EM_CADASTRO : criar versao por Resolucao

    EM_CADASTRO --> EM_CADASTRO : cadastrar VersaoFaixaPercentual
    EM_CADASTRO --> VIGENTE : ativar (>= 1 faixa — INV-TGP11; encerra versao anterior — INV-TGP04)
    EM_CADASTRO --> REVOGADA : revogar antes de vigorar

    VIGENTE --> ENCERRADA : nova versao ativada
    VIGENTE --> REVOGADA : revogacao administrativa

    ENCERRADA --> [*]
    REVOGADA --> [*]
```

> `estado` e **derivado** de `dataInicioVigencia`, `dataFimVigencia` e data atual. `EM_CADASTRO` e o estado operacional antes da ativacao.

### Descricao dos estados

| Estado | Descricao |
|--------|-----------|
| **EM_CADASTRO** | Versao em montagem; faixas sendo cadastradas. Ainda nao usada em calculos. |
| **VIGENTE** | Versao ativa; usada nos calculos de novos aportes. Somente uma por vez (INV-TGP04). |
| **ENCERRADA** | Substituida por versao posterior; permanece consultavel para auditoria. |
| **REVOGADA** | Cancelada antes de vigorar ou por decisao administrativa. |

### Regra de troca de versao

Ao ativar nova versao, a anterior **deve** ser encerrada antes (INV-TGP04 — somente uma VIGENTE). Taxas calculadas com a versao anterior mantem snapshot — sem recalculo retroativo (AX-TGP05, AX-TGP06).

---

## Operacoes e Impacto

| Operacao | Ator | Efeito (fato registrado) |
|----------|------|--------------------------|
| Receber taxa (evento M010) | Sistema M016 | Cria `TaxaGestaoParcerias` (idempotente por `aporteFinanceiroId`) |
| Classificar | Gestor Financeiro | Cria `ClassificacaoContabilTGP` (marco: classificada) |
| Registrar repasse | Gestor Financeiro | Grava `contaBancariaId` BANESTES (marco: repassada) |
| Vincular a AcaoTransversal | Gestor Financeiro | Cria `OutorgaAcaoTransversal` (marco: vinculada) |
| Encerrar | Sistema M016 | Prestacao da AT aprovada (marco: encerrada) |
| Criar/ativar versao da politica | Gestor Financeiro | Encerra versao anterior; nova VIGENTE |

Ver fluxos passo a passo em [processo.md](processo.md).

---

## Eventos

| Evento | Origem | Consumo |
|--------|--------|---------|
| `TaxaGestaoParceriasCalculada` | M010 (no registro do aporte) | M016 cria a `TaxaGestaoParcerias` |
| `PrestacaoAcaoTransversalSubmetida` (APROVADA) | Acao Transversal | Marca a taxa vinculada como encerrada (derivado) |

---

## Permissoes

| Papel | Pode |
|-------|------|
| **GestorFinanceiro** | Parametrizar politica, criar versao, classificar, repassar, vincular a AcaoTransversal |
| **AnalistaFinanceiro** | Consultar historico de taxa, auditar snapshots |

---

## Fronteira com Acao Transversal

A partir da **vinculacao** (existe `OutorgaAcaoTransversal`), a execucao do recurso pertence ao subdominio Acao Transversal (plano de aplicacao, despesas, prestacao de contas). A taxa so volta a este subdominio para o marco final — **encerrada** — quando a prestacao de contas da AT vinculada e aprovada.
