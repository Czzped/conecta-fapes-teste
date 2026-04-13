# Sub-Backlog: M014 - Prestacao de Contas

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Coordenadores devem submeter documentos fiscais que comprovem a aplicacao dos recursos do projeto. A agencia de fomento analisa e pode rejeitar documentos, e a SECONT realiza auditorias. Atualmente, esse processo e inteiramente baseado em papel e e-mail, sem fluxo digital, sem rastreabilidade e sem reconciliacao automatica entre extrato bancario e despesas declaradas. Este modulo visa resolver esse problema ao digitalizar todo o ciclo de prestacao de contas, desde a importacao do extrato bancario ate a auditoria da SECONT. O sucesso sera medido pela reducao do tempo medio de analise da prestacao de contas e pela taxa de prestacoes aprovadas na primeira submissao.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M014-001 | Submissao de Prestacao de Contas | UC01 | Must | To Do | [EPIC-M014-001](epics/EPIC-M014-001.md) |
| EPIC-M014-002 | Analise de Prestacao de Contas | UC02 | Must | To Do | [EPIC-M014-002](epics/EPIC-M014-002.md) |
| EPIC-M014-003 | Contestacao e Auditoria | UC03 | Must | To Do | [EPIC-M014-003](epics/EPIC-M014-003.md) |

---

## Rastreabilidade

```
EPIC-M014-001 (Submissao de Prestacao de Contas)
├── US-M014-001 Importar Extrato Bancario
├── US-M014-002 Submeter PC de Servico
├── US-M014-003 Submeter PC de Diarias
└── US-M014-004 Submeter PC de Passagens

EPIC-M014-002 (Analise de Prestacao de Contas)  <- depende de EPIC-M014-001
├── US-M014-005 Analisar Documentos
├── US-M014-006 Recusar com Justificativa
└── US-M014-007 Aprovar Prestacao

EPIC-M014-003 (Contestacao e Auditoria)  <- depende de EPIC-M014-002
├── US-M014-008 Contestar Recusa
├── US-M014-009 Analisar Contestacao
└── US-M014-010 Auditar Prestacao SECONT
```
