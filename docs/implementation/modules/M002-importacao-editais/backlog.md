# Sub-Backlog: M002 - Importacao de Editais

[← Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

O M002 entrega o ciclo completo de correcao dos dados do SIGFAPES antes da importacao canonica: listagem de editais do ultimo dump, edicao colaborativa da planilha com lock exclusivo, versionamento auditado e geracao de JSONLs para consumo dos modulos donos do dominio. O sucesso e medido pelo tempo medio de correcao de um edital, pela cobertura de versionamento auditado e pela ausencia de conflitos de edicao concorrente.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Prioridade | Status | Documento |
|----|--------|------------|--------|-----------|
| EPIC-M002-001 | Listar e Selecionar Editais do SIGFAPES | Must | Done | [EPIC-M002-001](epics/EPIC-M002-001.md) |
| EPIC-M002-002 | Corrigir Planilha do Edital | Must | Done | [EPIC-M002-002](epics/EPIC-M002-002.md) |
| EPIC-M002-003 | Gerar Arquivos de Importacao (JSONL) | Must | Done | [EPIC-M002-003](epics/EPIC-M002-003.md) |

---

## Rastreabilidade

```
EPIC-M002-001 (Listar e Selecionar Editais do SIGFAPES)
├── US-M002-001 Autenticar Operador
├── US-M002-002 Listar Editais do Ultimo Dump
├── US-M002-003 Sinalizar Editais Novos (60 dias)
├── US-M002-004 Exibir Status de Lock e Planilha Existente
└── US-M002-005 Filtrar e Ordenar Editais

EPIC-M002-002 (Corrigir Planilha do Edital)  ← depende de EPIC-M002-001
├── US-M002-006 Adquirir e Manter Lock Exclusivo
├── US-M002-007 Gerar Planilha Inicial do Edital
├── US-M002-008 Editar Planilha com Validacoes em Tempo Real
├── US-M002-009 Validar e Enviar Planilha Corrigida
├── US-M002-010 Alternar entre Tipos editais e programas
└── US-M002-011 Configurar Mapeamento de Programas

EPIC-M002-003 (Gerar Arquivos de Importacao)  ← depende de EPIC-M002-002
├── US-M002-012 Iniciar Geracao de JSONL
├── US-M002-013 Acompanhar Progresso do Job
├── US-M002-014 Bloquear Geracao com Mapeamento Incompleto
└── US-M002-015 Listar Versoes e Arquivos Produzidos
```
