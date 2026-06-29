# Processo — Taxa de Gestao de Parcerias

[<< Voltar ao Subdominio](README.md)

## Visao Geral

O processo cobre desde o recebimento da taxa calculada pelo M010 ate a vinculacao com a AcaoTransversal que vai gastar o recurso. A `TaxaGestaoParcerias` **nao tem campo de estado**: cada marco e derivado de um fato registrado (ver [modelo-comportamental](modelo-comportamental.md)).

```
M010 calcula  →  Receber (cria TaxaGestaoParcerias)
                      ↓  classificar contabilmente  → existe ClassificacaoContabilTGP
                      ↓  registrar repasse (opcional) → contaBancariaId BANESTES
                      ↓  vincular a AcaoTransversal   → existe OutorgaAcaoTransversal
                      ↓  prestacao da AT aprovada     → marco: encerrada
```

| Marco (derivado) | Fato que o evidencia |
|------------------|----------------------|
| Recebida | `TaxaGestaoParcerias` existe |
| Classificada | existe `ClassificacaoContabilTGP` |
| Repassada | `contaBancariaId` BANESTES preenchido (opcional) |
| Vinculada | existe `OutorgaAcaoTransversal` |
| Encerrada | prestacao de contas da AT vinculada aprovada |

---

## Fluxo 1 — Recebimento e Classificacao

**Gatilho:** evento `TaxaGestaoParceriasCalculada` emitido pelo M010 ao registrar `AporteFinanceiro`.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | Receber evento com snapshot da taxa (versaoFaixaId, valorBase, percentualAplicado, valorTaxaGestao) | Sistema M016 | `TaxaGestaoParcerias` |
| 2 | Validar idempotencia: se ja existe TaxaGestaoParcerias para o mesmo aporteFinanceiroId, ignorar | Sistema M016 | `TaxaGestaoParcerias` |
| 3 | Persistir TaxaGestaoParcerias | Sistema M016 | `TaxaGestaoParcerias` |
| 4 | Gestor Financeiro classifica em conta contabil, fundo financeiro e centro de custo | Gestor Financeiro | `ClassificacaoContabilTGP` |

**Pre-condicao:** VersaoFaixaPercentual referenciada no snapshot deve existir (leitura-only para auditoria).

**Pos-condicao:** existe `ClassificacaoContabilTGP` (marco: classificada) — pronta para repasse ou vinculacao.

---

## Fluxo 2 — Repasse para Conta BANESTES

**Gatilho:** Gestor Financeiro decide repassar o valor ao Coordenador Outorgado. Opcional.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | Gestor informa ContaBancaria (M008) para repasse | Gestor Financeiro | `ContaBancaria` (M008) |
| 2 | Sistema valida banco = BANESTES (INV-TGP03) | Sistema M016 | — |
| 3 | Sistema rejeita se banco != BANESTES com mensagem "Conta de repasse deve ser BANESTES (Resolucao CCAF 334/2023)" | Sistema M016 | — |
| 4 | Gestor confirma valor do repasse (<= saldo disponivel) | Gestor Financeiro | `TaxaGestaoParcerias` |
| 5 | Sistema registra contaBancariaId na TaxaGestaoParcerias | Sistema M016 | `TaxaGestaoParcerias` |

**Pre-condicao:** taxa ja classificada (existe `ClassificacaoContabilTGP`).

**Pos-condicao:** `contaBancariaId` registrado (marco: repassada).

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
| 6 | Diretoria Executiva designa Coordenador Outorgado para a AcaoTransversal | Diretoria Executiva | `OutorgaAcaoTransversal` |

**Pre-condicao:** taxa ja classificada (existe `ClassificacaoContabilTGP`).

**Regra:** Uma taxa pode financiar multiplas AcoesTransversais (N:N). Cada vinculacao cria uma OutorgaAcaoTransversal separada. Soma dos valorVinculado nao pode ultrapassar valorTaxaGestao (INV-TGP01).

**Pos-condicao:** existe `OutorgaAcaoTransversal` (marco: vinculada); AcaoTransversal pode avancar para ATIVA.

---

## Fluxo 4 — Encerramento

**Gatilho:** PrestacaoContasAcaoTransversal correspondente aprovada no subdominio Acao Transversal.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | Evento `PrestacaoAcaoTransversalSubmetida` com decisao APROVADA recebido | Sistema M016 | — |
| 2 | Sistema reconhece a taxa vinculada como encerrada (marco derivado) | Sistema M016 | `TaxaGestaoParcerias` |

**Pos-condicao:** marco encerrada. Snapshot permanece imutavel para auditoria historica.

---

## Regras Transversais

| ID | Regra |
|----|-------|
| INV-TGP01 | Total vinculado a AcoesTransversais nao pode exceder valorTaxaGestao. |
| INV-TGP03 | Conta de repasse deve ser BANESTES (Resolucao CCAF 334/2023). |
| INV-TGP04 | Somente uma VersaoPoliticaTaxaGestao pode estar vigente ao mesmo tempo. |
| INV-TGP05 | percentualAplicado, valorBase e valorTaxaGestao imutaveis apos criacao. |
| INV-TGP06 | TaxaGestaoParcerias.versaoFaixaId e imutavel apos criacao. |

---

## Fronteira com Acao Transversal

A partir da vinculacao (existe `OutorgaAcaoTransversal`), a execucao do recurso pertence ao subdominio Acao Transversal:

```
TaxaGestaoParcerias  ──vinculada──>  OutorgaAcaoTransversal
                                          ↓
                              AcaoTransversal → ATIVA
                                          ↓
                              PlanoAplicacaoAT (elaborado pelo Coordenador Outorgado)
                              DespesaAcaoTransversal
                              PrestacaoContasAcaoTransversal
                                          ↓ APROVADA
                              TaxaGestaoParcerias  (marco: encerrada)
```

Ver: [acao-transversal/processo.md](../acao-transversal/processo.md)
