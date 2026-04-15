# Backlog de Epicos — Portal Admin

[← Voltar ao Portal Admin](README.md) | [Roadmap](../../management/roadmap.md) | [Releases 2026](../../management/releases-2026.csv)

> Versao: 2026-04-14

| ID | Titulo | EPICs de implementacao | Status |
|----|--------|------------------------|--------|
| EPA-01 | Gestao de Pagamento e Folhas | [EPIC-M004-001](../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-001.md) a [EPIC-M004-012](../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-012.md) — Calendario, liberacao, folhas, bonus, remessas, retornos, guias, relatorios | Em producao |
| EPA-02 | Importacao de Editais e Projetos | [EPIC-M002-001](../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-001.md) a [EPIC-M002-003](../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-003.md) — Selecao, completar alocacoes, sincronizacao | Em producao |
| EPA-03 | Modalidades de Bolsa | [EPIC-M001-001](../../implementation/modules/M001-modalidade-bolsa/epics/EPIC-M001-001.md) a [EPIC-M001-003](../../implementation/modules/M001-modalidade-bolsa/epics/EPIC-M001-003.md) — Resolucoes, modalidades, niveis | Em producao |
| EPA-04 | Gestao de Aditivos e Suspensao | [EPIC-M009-004](../../implementation/modules/M009-gestao-bolsista/epics/EPIC-M009-004.md), [EPIC-M015-001](../../implementation/modules/M015-suspensao-finalizacao/epics/EPIC-M015-001.md) — Consulta bolsa, suspensao | Planejado (Q2) |
| EPA-05 | Gestao Financeira e Contabil | [EPIC-M016-001](../../implementation/modules/M016-contabilidade-financeiro/epics/EPIC-M016-001.md) a [EPIC-M016-003](../../implementation/modules/M016-contabilidade-financeiro/epics/EPIC-M016-003.md) — Plano de contas, contas bancarias, fluxo de caixa | Planejado (Q2) |
| EPA-06 | Reajuste de Bolsas e Expansao UNAC | [EPIC-M004-005](../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-005.md) — Bonus de Pagamento (reajuste via bonus) | Planejado (Q2) |

## Modulos Backend Consumidos

| Modulo | Funcionalidades | EPICs |
|--------|----------------|-------|
| [M001](../../implementation/modules/M001-modalidade-bolsa/README.md) | Resolucoes, modalidades, versoes e niveis de bolsa | 3 EPICs (To Do) |
| [M002](../../implementation/modules/M002-importacao-editais/README.md) | Importacao do SIGFAPES | 3 EPICs (Done) |
| [M003](../../implementation/modules/M003-gerenciar-editais/README.md) | Visualizacao operacional de editais e projetos | 5 EPICs (Done) |
| [M004](../../implementation/modules/M004-pagamento-bolsista/README.md) | Folhas, remessas, retornos, guias, relatorios | 12 EPICs (Done) |
| [M005](../../implementation/modules/M005-autenticacao/README.md) | Autenticacao via Acesso Cidadao | A definir |
| [M008](../../implementation/modules/M008-cadastros-corporativos/README.md) | Pessoas, instituicoes, areas tecnicas | 3 EPICs (To Do) |
| [M009](../../implementation/modules/M009-gestao-bolsista/README.md) | Gestao de aditivos (admin) | 4 EPICs (To Do) |
| [M015](../../implementation/modules/M015-suspensao-finalizacao/README.md) | Suspensao de bolsas | 2 EPICs (To Do) |
| [M016](../../implementation/modules/M016-contabilidade-financeiro/README.md) | Gestao financeira e contabil | 3 EPICs (To Do) |

## Relacao com Roadmap

Features do Portal Admin sao rastreadas em [releases-2026.csv](../../management/releases-2026.csv) como produto "PORTAL FAPES - ADMIN".
