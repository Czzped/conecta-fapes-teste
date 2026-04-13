# Sub-Backlog: M020 - Comunicacao

[<< Voltar ao Backlog Central](../../backlog-product.md)

## Sobre o Modulo

A plataforma ConectaFAPES necessita de um servico centralizado de notificacao e comunicacao para todos os modulos. Atualmente, as notificacoes para usuarios sao feitas manualmente ou nao existem, gerando atrasos e perda de prazos. Este modulo resolve esse problema ao prover um servico transversal de envio de notificacoes por email, gerenciamento de templates, comunicados em massa e lembretes automaticos.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M020-001 | Servico de Notificacao | UC01 | Must | To Do | [EPIC-M020-001](epics/EPIC-M020-001.md) |
| EPIC-M020-002 | Comunicados e Lembretes | UC02 | Must | To Do | [EPIC-M020-002](epics/EPIC-M020-002.md) |

---

## Rastreabilidade

```
EPIC-M020-001 (Servico de Notificacao)
├── US-M020-001 Enviar Notificacao por Email
├── US-M020-002 Configurar Templates de Notificacao
└── US-M020-003 Consultar Historico de Notificacoes

EPIC-M020-002 (Comunicados e Lembretes)  <- depende de EPIC-M020-001
├── US-M020-004 Enviar Comunicado em Massa
└── US-M020-005 Configurar Lembretes Automaticos de Prazo
```
