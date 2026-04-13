# Sub-Backlog: M017 - Prevencao a Lavagem de Dinheiro (PLD)

[<< Voltar ao Backlog Central](../../backlog-product.md)

## Sobre o Modulo

A FAPES deve cumprir regulamentacoes de prevencao a lavagem de dinheiro: verificar identidade de beneficiarios (KYC), monitorar transacoes para padroes suspeitos, reportar ao COAF, bloquear pagamentos preventivamente e consultar listas restritivas. Atualmente nao existe sistema automatizado para essas atividades, o que expoe a instituicao a riscos regulatorios e dificulta a deteccao de operacoes atipicas. Este modulo visa resolver esses problemas ao automatizar os processos de compliance PLD em uma plataforma integrada. O sucesso sera medido pela taxa de alertas tratados dentro do prazo legal e pela reducao do tempo de resposta a operacoes suspeitas.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M017-001 | Verificacao Cadastral KYC | UC01 | Must | To Do | [EPIC-M017-001](epics/EPIC-M017-001.md) |
| EPIC-M017-002 | Monitoramento de Transacoes | UC02 | Must | To Do | [EPIC-M017-002](epics/EPIC-M017-002.md) |
| EPIC-M017-003 | Bloqueio e Reporte | UC03 | Must | To Do | [EPIC-M017-003](epics/EPIC-M017-003.md) |
| EPIC-M017-004 | Auditoria e Dashboard PLD | UC04 | Must | To Do | [EPIC-M017-004](epics/EPIC-M017-004.md) |

---

## Rastreabilidade

```
EPIC-M017-001 (Verificacao Cadastral KYC)
├── US-M017-001 Verificar Dados Cadastrais
├── US-M017-002 Consultar Listas Restritivas
└── US-M017-003 Registrar Resultado KYC

EPIC-M017-002 (Monitoramento de Transacoes)  <- depende de EPIC-M017-001
├── US-M017-004 Monitorar Transacoes Atipicas
├── US-M017-005 Gerar Alerta de Operacao Suspeita
└── US-M017-006 Analisar e Tratar Alerta

EPIC-M017-003 (Bloqueio e Reporte)  <- depende de EPIC-M017-002
├── US-M017-007 Bloquear Pagamento Preventivamente
├── US-M017-008 Desbloquear Pagamento
├── US-M017-009 Gerar Reporte ao COAF
└── US-M017-010 Analisar Conflito de Interesse com PJ

EPIC-M017-004 (Auditoria e Dashboard PLD)  <- depende de EPIC-M017-001, EPIC-M017-002, EPIC-M017-003
├── US-M017-011 Consultar Trilha de Auditoria PLD
└── US-M017-012 Dashboard PLD
```
