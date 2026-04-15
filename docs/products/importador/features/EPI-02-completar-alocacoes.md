# EPI-02 — Completar Dados de Alocacoes

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |

## Jornada

Apos a importacao inicial, o operador completa dados de alocacoes que nao vieram do SIGFAPES — cotas pagas, status de cancelamento e marcacao de projetos como completos. Esses ajustes garantem consistencia antes dos dados serem usados no fluxo de pagamento.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [EPIC-M002-002](../../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-002.md) | Completar Dados de Alocacoes | Done |

## Cenarios de aceitacao do produto

- **Consultar resumo do edital**: visao consolidada com projetos e alocacoes importados
- **Informar cotas pagas**: campo para ajustar cotas ja pagas antes da importacao
- **Cancelar alocacao**: marcacao de alocacao como cancelada com justificativa
- **Marcar projeto como completo**: confirmacao de que todos os dados do projeto estao corretos
