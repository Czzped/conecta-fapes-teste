# Sub-Backlog: M015 - Suspensao e Finalizacao

[<< Voltar ao Backlog Central](../../backlog-product.md)

## Sobre o Modulo

Projetos podem necessitar de suspensao temporaria (por solicitacao do coordenador ou decisao da agencia de fomento) ou de encerramento definitivo. Atualmente, nao existe um fluxo de trabalho estruturado para essas operacoes -- suspensoes e encerramentos sao comunicados informalmente, sem garantia de que pagamentos sejam bloqueados, bolsas sejam encerradas ou prestacoes de contas sejam exigidas. Este modulo visa resolver esse problema ao prover um fluxo digital completo para suspensao e finalizacao de projetos, garantindo que todas as pendencias sejam verificadas antes do encerramento. O sucesso sera medido pela taxa de projetos encerrados com todas as pendencias resolvidas e pelo tempo medio de processamento de suspensoes.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M015-001 | Suspensao de Projeto | UC01 | Must | To Do | [EPIC-M015-001](epics/EPIC-M015-001.md) |
| EPIC-M015-002 | Finalizacao de Projeto | UC02 | Must | To Do | [EPIC-M015-002](epics/EPIC-M015-002.md) |

---

## Rastreabilidade

```
EPIC-M015-001 (Suspensao de Projeto)
├── US-M015-001 Solicitar Suspensao
├── US-M015-002 Analisar Suspensao
└── US-M015-003 Reativar Projeto

EPIC-M015-002 (Finalizacao de Projeto)  <- depende de EPIC-M015-001
├── US-M015-004 Solicitar Encerramento
├── US-M015-005 Verificar Pendencias
└── US-M015-006 Encerrar Projeto
```
