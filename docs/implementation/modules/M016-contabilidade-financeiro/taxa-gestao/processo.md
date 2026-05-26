# Processo — Taxa de Gestao de Parcerias

[<< Voltar ao Subdominio](README.md)

## Visao Geral

O processo da Taxa de Gestao de Parcerias cobre o ciclo desde o recebimento da taxa calculada pelo M010 ate a vinculacao com a AcaoTransversal que vai gastar o recurso.

```
M010 calcula
     ↓
[CALCULADA] → classificar contabilmente → [CLASSIFICADA]
                                                ↓                   ↓
                                          registrar repasse    vincular a AT
                                                ↓                   ↓
                                          [REPASSADA] ────→ [VINCULADA]
                                                                    ↓
                                                     prestacao AT aprovada
                                                                    ↓
                                                           [ENCERRADA]
```

---

## Fluxo 1 — Recebimento e Classificacao

**Gatilho:** evento `TaxaGestaoParcelasCalculada` emitido pelo M010 ao registrar `AporteFinanceiro`.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | Receber evento com snapshot da taxa (versaoPoliticaId, versaoFaixaId, percentualAplicado, valorTaxaGestao) | Sistema M016 | `TaxaGestaoParcerias` |
| 2 | Validar idempotencia: se ja existe TaxaGestaoParcerias para o mesmo aporteFinanceiroId, ignorar | Sistema M016 | `TaxaGestaoParcerias` |
| 3 | Persistir TaxaGestaoParcerias em estado CALCULADA | Sistema M016 | `TaxaGestaoParcerias` |
| 4 | Gestor Financeiro classifica em conta contabil, fundo financeiro e centro de custo | Gestor Financeiro | `ClassificacaoContabilTGP` |
| 5 | Sistema transita TaxaGestaoParcerias para CLASSIFICADA | Sistema M016 | `TaxaGestaoParcerias` |

**Pre-condicao:** VersaoPoliticaTaxaGestao referenciada no snapshot deve existir (leitura-only para auditoria).

**Pos-condicao:** TaxaGestaoParcerias em CLASSIFICADA, pronta para repasse ou vinculacao.

---

## Fluxo 2 — Repasse para Conta BANESTES

**Gatilho:** Gestor Financeiro decide repassar o valor ao Coordenador Outorgado.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | Gestor informa ContaBancaria (M008) para repasse | Gestor Financeiro | `ContaBancaria` (M008) |
| 2 | Sistema valida banco = BANESTES (INV-TGP03) | Sistema M016 | — |
| 3 | Sistema rejeita se banco != BANESTES com mensagem "Conta de repasse deve ser BANESTES (Resolucao CCAF 334/2023)" | Sistema M016 | — |
| 4 | Gestor confirma valor do repasse (<= saldo disponivel) | Gestor Financeiro | `TaxaGestaoParcerias` |
| 5 | Sistema registra contaBancariaId na TaxaGestaoParcerias | Sistema M016 | `TaxaGestaoParcerias` |
| 6 | Sistema transita TaxaGestaoParcerias para REPASSADA | Sistema M016 | `TaxaGestaoParcerias` |

**Pre-condicao:** TaxaGestaoParcerias em CLASSIFICADA.

**Pos-condicao:** TaxaGestaoParcerias em REPASSADA; contaBancariaId registrado.

---

## Fluxo 3 — Vinculacao com AcaoTransversal

**Gatilho:** Gestor Financeiro vincula taxa a uma AcaoTransversal especifica.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | Gestor seleciona AcaoTransversal (EM_ELABORACAO ou ATIVA) | Gestor Financeiro | `AcaoTransversal` |
| 2 | Gestor informa valor a vincular | Gestor Financeiro | `OutorgaAcaoTransversal` |
| 3 | Sistema valida saldo disponivel: valorVinculado <= valorTaxaGestao - ja_vinculado (INV-TGP01) | Sistema M016 | — |
| 4 | Sistema rejeita se saldo insuficiente | Sistema M016 | — |
| 5 | Sistema registra OutorgaAcaoTransversal com valorVinculado | Sistema M016 | `OutorgaAcaoTransversal` |
| 6 | Sistema transita TaxaGestaoParcerias para VINCULADA | Sistema M016 | `TaxaGestaoParcerias` |
| 7 | Diretoria Executiva designa Coordenador Outorgado para a AcaoTransversal | Diretoria Executiva | `OutorgaAcaoTransversal` |

**Pre-condicao:** TaxaGestaoParcerias em CLASSIFICADA ou REPASSADA.

**Regra:** Uma taxa pode financiar multiplas AcoesTransversais (N:N). Cada vinculacao cria uma OutorgaAcaoTransversal separada. Soma dos valorVinculado nao pode ultrapassar valorTaxaGestao (INV-TGP01).

**Pos-condicao:** TaxaGestaoParcerias em VINCULADA; AcaoTransversal pode avancar para ATIVA.

---

## Fluxo 4 — Encerramento

**Gatilho:** PrestacaoContasAcaoTransversal correspondente aprovada no subdominio Acao Transversal.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | Evento `PrestacaoAcaoTransversalSubmetida` com estado APROVADA recebido | Sistema M016 | — |
| 2 | Sistema transita TaxaGestaoParcerias vinculada para ENCERRADA | Sistema M016 | `TaxaGestaoParcerias` |

**Pos-condicao:** TaxaGestaoParcerias em ENCERRADA. Snapshot permanece imutavel para auditoria historica.

---

## Regras Transversais

| ID | Regra |
|----|-------|
| INV-TGP01 | Total vinculado a AcoesTransversais nao pode exceder valorTaxaGestao. |
| INV-TGP03 | Conta de repasse deve ser BANESTES (Resolucao CCAF 334/2023). |
| INV-TGP04 | Somente uma VersaoPoliticaTaxaGestao pode estar vigente ao mesmo tempo. |
| INV-TGP05 | TaxaGestaoParcerias.versaoPoliticaId e imutavel apos criacao. |
| INV-TGP06 | TaxaGestaoParcerias.versaoFaixaId e imutavel apos criacao. |

---

## Fronteira com Acao Transversal

A partir de VINCULADA, a execucao do recurso pertence ao subdominio Acao Transversal:

```
TaxaGestaoParcerias → VINCULADA
                           ↓
               AcaoTransversal → ATIVA
                           ↓
               PlanoAplicacaoAT (elaborado pelo Coordenador Outorgado)
               DespesaAcaoTransversal
               PrestacaoContasAcaoTransversal
                           ↓ APROVADA
               TaxaGestaoParcerias → ENCERRADA
```

Ver: [acao-transversal/processo.md](../acao-transversal/processo.md)
