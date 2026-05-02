# Sub-Backlog: M013 - Gestao Orcamentaria do Projeto

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Durante a execucao de um projeto, coordenadores precisam solicitar adicoes orcamentarias, incluir novas rubricas de despesa e realocar recursos entre rubricas. Atualmente, esses processos sao realizados por e-mail e formularios em papel, sem visibilidade em tempo real sobre o saldo orcamentario disponivel. Este modulo visa resolver esse problema ao prover uma gestao digital e integrada do orcamento do projeto, com rastreabilidade de todas as movimentacoes financeiras. O sucesso sera medido pela reducao do tempo medio de aprovacao de remanejamentos e pela eliminacao de inconsistencias entre saldo registrado e saldo real.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M013-001 | Adicoes Orcamentarias | UC01 | Must | To Do | [EPIC-M013-001](epics/EPIC-M013-001.md) |
| EPIC-M013-002 | Gestao de Rubricas | UC02 | Must | To Do | [EPIC-M013-002](epics/EPIC-M013-002.md) |
| EPIC-M013-003 | Realocacao de Bolsas | UC03 | Must | To Do | [EPIC-M013-003](epics/EPIC-M013-003.md) |
| EPIC-M013-004 | Orcamento do Projeto por Rubrica Aprovada | UC04 | Must | To Do | [EPIC-M013-004](epics/EPIC-M013-004.md) |

---

## Rastreabilidade

```
EPIC-M013-001 (Adicoes Orcamentarias)
├── US-M013-001 Solicitar Adicao Orcamentaria
├── US-M013-002 Analisar Solicitacao de Adicao
└── US-M013-003 Registrar Aprovacao de Adicao

EPIC-M013-002 (Gestao de Rubricas)  <- depende de EPIC-M013-001
├── US-M013-004 Incluir Rubrica no Projeto
├── US-M013-005 Remanejar entre Rubricas
└── US-M013-006 Consultar Saldo por Rubrica

EPIC-M013-003 (Realocacao de Bolsas)  <- depende de EPIC-M013-002
├── US-M013-007 Solicitar Realocacao de Bolsa
└── US-M013-008 Aprovar Realocacao de Bolsa

EPIC-M013-004 (Orcamento do Projeto por Rubrica Aprovada)  <- depende de M008, M011, M003/M022
├── US-M013-009 Gerar Rubricas do Projeto a partir do Orcamento Aprovado
├── US-M013-010 Preservar Snapshot da Rubrica no Projeto
├── US-M013-011 Controlar Comprometido, Executado e Saldo
├── US-M013-012 Bloquear Uso sem Saldo Disponivel
├── US-M013-013 Publicar Saldos para Modulos Consumidores
└── US-M013-014 Registrar Transacoes separadas de Movimentos Bancarios
```
