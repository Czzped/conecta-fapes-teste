# Sub-Backlog: M002 - Importacao de Editais

[← Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Hoje, os dados de editais, projetos e alocacoes precisam ser digitados manualmente a partir do Sigfapes, causando retrabalho significativo e erros de transcricao que comprometem a confiabilidade das informacoes. Este modulo resolve esse problema ao importar automaticamente do Sigfapes as informacoes de Editais, Projetos e Alocacoes, eliminando a entrada manual de dados. O sucesso sera medido pelo percentual de editais importados automaticamente e pela reducao de erros de transcricao.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M002-001 | Definir Editais a Sincronizar | UC04.0 | Must | Done | [EPIC-M002-001](epics/EPIC-M002-001.md) |
| EPIC-M002-002 | Completar Dados de Alocacoes | UC04.1 | Must | Done | [EPIC-M002-002](epics/EPIC-M002-002.md) |
| EPIC-M002-003 | Sincronizar Dados de Editais | UC04.2 | Must | Done | [EPIC-M002-003](epics/EPIC-M002-003.md) |

---

## Rastreabilidade

```
EPIC-M002-001 (Definir Editais a Sincronizar)
├── US-M002-001 Listar Editais Disponiveis no SigFapes
├── US-M002-002 Selecionar Editais para Importacao
├── US-M002-003 Importar Dados dos Editais Selecionados
└── US-M002-004 Listar Editais a Sincronizar

EPIC-M002-002 (Completar Dados de Alocacoes)  ← depende de EPIC-M002-001
├── US-M002-005 Consultar Resumo do Edital
├── US-M002-006 Visualizar Projetos e Alocacoes
├── US-M002-007 Informar Cotas Pagas da Alocacao
├── US-M002-008 Cancelar Alocacao
└── US-M002-009 Marcar Projeto como Completo

EPIC-M002-003 (Sincronizar Dados de Editais)  ← depende de EPIC-M002-001
├── US-M002-010 Sincronizar Dados do SigFapes
└── US-M002-011 Gerar Relatorio de Sincronizacao
```

