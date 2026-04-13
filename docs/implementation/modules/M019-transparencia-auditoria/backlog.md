# Sub-Backlog: M019 - Transparencia e Auditoria

[<< Voltar ao Backlog Central](../../backlog-product.md)

## Sobre o Modulo

A agencia de fomento, como orgao publico, deve prestar contas de seus investimentos em fomento a sociedade e aos orgaos de controle. Atualmente, a publicacao de dados de transparencia e a geracao de relatorios para a SECONT sao feitas manualmente, sem trilha de auditoria sistematizada. Este modulo resolve esses problemas ao prover transparencia, relatorios automatizados e rastreabilidade completa.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M019-001 | Portal de Transparencia | UC01 | Must | To Do | [EPIC-M019-001](epics/EPIC-M019-001.md) |
| EPIC-M019-002 | Relatorios e Auditoria | UC02 | Must | To Do | [EPIC-M019-002](epics/EPIC-M019-002.md) |

---

## Rastreabilidade

```
EPIC-M019-001 (Portal de Transparencia)
├── US-M019-001 Publicar Dados Abertos de Fomento
├── US-M019-002 Consultar Projetos e Bolsas Publicamente
└── US-M019-003 Dashboard de Indicadores de Transparencia

EPIC-M019-002 (Relatorios e Auditoria)  <- depende de EPIC-M019-001
├── US-M019-004 Gerar Relatorio de Execucao Financeira SECONT
├── US-M019-005 Exportar Dados para Auditoria
└── US-M019-006 Consultar Trilha de Auditoria Completa
```
