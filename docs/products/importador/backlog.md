# Backlog — Importador SIGFAPES

[← Voltar ao Importador](README.md) | [Roadmap](../../management/roadmap.md)

> Versao: 2026-04-17

| ID | Titulo | Detalhes | EPICs de implementacao | Status |
|----|--------|----------|------------------------|--------|
| EPI-01 | Listar e Selecionar Editais do SIGFAPES | [EPI-01](features/EPI-01-importacao-editais-selecao.md) | [EPIC-M002-001](../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-001.md) | Entregue |
| EPI-02 | Corrigir Planilha do Edital | [EPI-02](features/EPI-02-completar-alocacoes.md) | [EPIC-M002-002](../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-002.md) | Entregue |
| EPI-03 | Gerar Arquivos de Importacao (JSONL) | [EPI-03](features/EPI-03-sincronizacao-sigfapes.md) | [EPIC-M002-003](../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-003.md) | Entregue |

## Modulo Backend

Todas as funcionalidades do Importador sao implementadas pelo modulo [M002 — Importacao de Editais](../../implementation/modules/M002-importacao-editais/README.md) (3 EPICs, todos Done).

## Relacao com Roadmap

Features do Importador sao rastreadas em [releases-2026.csv](../../management/releases-2026.csv) como produto "IMPORTADOR". A entrega principal foi a reformulacao completa do fluxo de correcao com lock exclusivo, versionamento auditado e virtual scroll para editais volumosos.
