# Sub-Backlog: M012 - Acompanhamento e Resultados

[<- Voltar ao Backlog Central](../../backlog-product.md)

## Sobre o Modulo

Apos a contratacao de projetos, a agencia de fomento precisa acompanhar a execucao e gerenciar resultados tecnicos. Atualmente, nao ha dashboard consolidado para os diferentes perfis (coordenador, agencia de fomento, SECONT) e as submissoes de relatorios e suas analises ocorrem fora do sistema, por e-mail e documentos avulsos. Este modulo visa resolver esse problema ao prover dashboards de acompanhamento por perfil, gestao de relatorios tecnicos com fluxo de analise e contestacao, e controle de solicitacoes de alteracao em projetos. O sucesso sera medido pela taxa de relatorios analisados no prazo e pela disponibilidade de informacoes consolidadas nos dashboards.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M012-001 | Dashboards de Acompanhamento | UC01 | Must | To Do | [EPIC-M012-001](epics/EPIC-M012-001.md) |
| EPIC-M012-002 | Gestao de Relatorios Tecnicos | UC02 | Must | To Do | [EPIC-M012-002](epics/EPIC-M012-002.md) |
| EPIC-M012-003 | Solicitacoes de Alteracao | UC03 | Must | To Do | [EPIC-M012-003](epics/EPIC-M012-003.md) |

---

## Rastreabilidade

```
EPIC-M012-001 (Dashboards de Acompanhamento)
├── US-M012-001 Dashboard Coordenador
├── US-M012-002 Dashboard da agencia de fomento
└── US-M012-003 Dashboard SECONT

EPIC-M012-002 (Gestao de Relatorios Tecnicos)  <- depende de EPIC-M012-001
├── US-M012-004 Submeter Relatorio Tecnico
├── US-M012-005 Analisar Relatorio
├── US-M012-006 Contestar Analise
└── US-M012-007 Aprovar Relatorio Final

EPIC-M012-003 (Solicitacoes de Alteracao)  <- depende de EPIC-M012-001
├── US-M012-008 Solicitar Alteracao no Projeto
├── US-M012-009 Analisar Solicitacao
└── US-M012-010 Registrar Decisao
```
