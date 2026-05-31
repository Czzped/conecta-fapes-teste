# EPA-02 — Importacao de Editais e Projetos

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002, M003 |
| **Produto** | Portal Admin |
| **Status** | Em producao |

## Jornada

O operador seleciona editais do SIGFAPES para importacao, completa dados de alocacoes (cotas pagas, status), sincroniza dados e acompanha o progresso da importacao. Os editais importados ficam disponiveis para o fluxo de pagamento.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [EPIC-M002-001](../../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-001.md) | Definir Editais a Sincronizar | Done |
| M002 | [EPIC-M002-002](../../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-002.md) | Completar Dados de Alocacoes | Done |
| M002 | [EPIC-M002-003](../../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-003.md) | Sincronizar Dados de Editais | Done |
| M003 | [EPIC-M003-005](../../../implementation/modules/M003-gestao-projetos-captados/epics/EPIC-M003-005.md) | Visao Operacional Consolidada | Done |

## Cenarios de aceitacao do produto

- **Acompanhar progresso da importacao**: indicador visual de progresso por edital (importado, pendente, com erro)
- **Edicao de cotas ao importar**: possibilidade de corrigir cotas antes de confirmar a importacao
