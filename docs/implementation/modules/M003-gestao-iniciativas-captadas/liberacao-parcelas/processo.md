# Processo: Liberacao de Parcelas da Iniciativa

[← Voltar ao subfluxo](README.md)

## Fluxo 1 — Solicitacao e Validacao Automatica

**Gatilho:** Coordenador acessa o projeto e solicita liberacao da proxima parcela.

**Pre-condicao:** Iniciativa ativa; parcela N-1 no estado LIBERADA (para N > 1); nenhuma SolicitacaoLiberacaoParcela ativa para a mesma parcela.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | Coordenador acessa bloco "Parcelas" em Meu Projeto e clica em "Solicitar liberacao da parcela N" | Coordenador | `ParcelaProjeto` |
| 2 | Sistema verifica se ja existe solicitacao ativa para a parcela (AX-M003-LP004) | Sistema | `SolicitacaoLiberacaoParcela` |
| 3 | Sistema cria `SolicitacaoLiberacaoParcela` em estado `EM_VALIDACAO` | Sistema | `SolicitacaoLiberacaoParcela` |
| 4 | Sistema executa validacao automatica e cria `ValidacaoLiberacaoParcela` com snapshot de cada condicao | Sistema | `ValidacaoLiberacaoParcela` |
| 5a | Todas as condicoes passam → transita para `APROVADA`; emite `LiberacaoParcelaSolicitada` | Sistema | `SolicitacaoLiberacaoParcela` |
| 5b | Alguma condicao falha → transita para `PENDENTE_REVISAO`; notifica responsavel FAPES | Sistema | `SolicitacaoLiberacaoParcela` |
| 6 | Coordenador recebe notificacao do resultado (aprovada ou motivo de pendencia) | Sistema | — |

**Pos-condicao (caminho 5a):** `LiberacaoParcelaSolicitada` emitido; M004 recebe e agenda pagamento.

---

## Fluxo 2 — Revisao Manual pelo Responsavel FAPES

**Gatilho:** `SolicitacaoLiberacaoParcela` em estado `PENDENTE_REVISAO`.

**Pre-condicao:** Validacao automatica detectou impeditivo ou integracao de certidoes indisponivel.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | Responsavel FAPES acessa painel de solicitacoes pendentes | Responsavel FAPES | `SolicitacaoLiberacaoParcela` |
| 2 | Responsavel FAPES consulta os motivos de reprovacao em `ValidacaoLiberacaoParcela.motivosReprovacao` | Responsavel FAPES | `ValidacaoLiberacaoParcela` |
| 3a | Responsavel aprova com parecer → transita para `APROVADA`; emite `LiberacaoParcelaSolicitada` | Responsavel FAPES | `SolicitacaoLiberacaoParcela` |
| 3b | Responsavel rejeita com parecer → transita para `REJEITADA` (terminal); coordenador notificado | Responsavel FAPES | `SolicitacaoLiberacaoParcela` |

---

## Fluxo 3 — Confirmacao do Pagamento (M004 → M003)

**Gatilho:** M004 confirma execucao do pagamento via evento `ParcelaLiberada`.

| Passo | Atividade | Ator | Entidade |
|-------|-----------|------|----------|
| 1 | M004 executa pagamento e emite `ParcelaLiberada` com valor efetivo e data | M004 | — |
| 2 | M003 atualiza `ParcelaProjeto.estado = LIBERADA`, registra `dataEfetivaLiberacao` e `valorLiberado` | Sistema | `ParcelaProjeto` |
| 3 | Ciclo de fomento da iniciativa recebe marco de liberacao da parcela N | Sistema | `EstagioCicloFomento` |

---

## Detalhamento da Validacao Automatica (Passo 4 do Fluxo 1)

### Condicao 1 — Estado da PCTF anterior

| Parcela solicitada | Exigencia da PCTF anterior | Fonte |
|-------------------|---------------------------|-------|
| Segunda (N=2) | PCTF da primeira parcela no estado >= APRESENTADA | M014 |
| Terceira (N>=3) | PCTF da parcela anterior no estado APROVADA | M014 |

### Condicao 2 — Comprometimento minimo de 60%

- M003 calcula: `percentualComprometido = (totalComprometidoParcela / valorPrevistoParcela) * 100`
- `totalComprometidoParcela` = soma de `OrcamentoExecutado` e lancamentos alocados vinculados a parcela anterior
- Deve ser >= 60.0% (parametro versionado por norma — nao hardcoded)

### Condicao 3 — Impedimentos

- Consulta M008 ou integracao externa
- Bloqueia se: inadimplencia FAPES = true OU qualquer certidao (Federal, Estadual, Municipal, Trabalhista/FGTS) = invalida/vencida

### Resultado

- Todas as 3 condicoes OK → `resultadoGeral = APROVADA`
- Qualquer falha → `resultadoGeral = REPROVADA`; `motivosReprovacao` lista cada condicao que falhou com descricao legivel

---

## Regras de Interface — Bloco "Parcelas" em Meu Projeto

| Elemento | Comportamento |
|----------|---------------|
| Lista de parcelas | Exibe todas as `ParcelaProjeto` da iniciativa com numero, valor previsto, estado e data prevista |
| Botao "Solicitar" | Visivel apenas para coordenador na parcela elegivel (proxima apos a ultima LIBERADA); bloqueado se ja existir solicitacao ativa |
| Historico de solicitacoes | Exibe solicitacoes anteriores com estado, data, resultado da validacao e parecer (quando houver) |
| Alerta de prazo | Sistema exibe alerta quando a data prevista de liberacao da proxima parcela esta proxima e a PCTF anterior ainda nao foi apresentada |
