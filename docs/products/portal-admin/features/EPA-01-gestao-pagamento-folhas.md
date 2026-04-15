# EPA-01 — Gestao de Pagamento e Folhas

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M004 |
| **Produto** | Portal Admin |
| **Status** | Em producao |

## Jornada

O operador GEPOF configura o calendario mensal de pagamentos, monitora a liberacao de editais pelas areas tecnicas, gera folhas de pagamento, envia remessas ao Banestes, processa retornos bancarios e gera guias de liberacao e relatorios para o EDOCS. O diretor DIRAF autoriza ou rejeita folhas geradas.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M004 | [EPIC-M004-001](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-001.md) | Definir Calendario das Folhas | Done |
| M004 | [EPIC-M004-002](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-002.md) | Liberar Editais da Area para Pagamento | Done |
| M004 | [EPIC-M004-003](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-003.md) | Gerenciar Folhas de Pagamento | Done |
| M004 | [EPIC-M004-004](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-004.md) | Autorizar Pagamento da Folha | Done |
| M004 | [EPIC-M004-005](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-005.md) | Bonus de Pagamento | Done |
| M004 | [EPIC-M004-006](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-006.md) | Geracao de Remessas Bancarias | Done |
| M004 | [EPIC-M004-007](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-007.md) | Processamento de Retorno Bancario | Done |
| M004 | [EPIC-M004-008](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-008.md) | Encaminhamento de Pagamento (Bandes) | Done |
| M004 | [EPIC-M004-009](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-009.md) | Guia de Liberacao (PDF) | Done |
| M004 | [EPIC-M004-010](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-010.md) | Relatorios e Relacoes de Pagamento | Done |
| M004 | [EPIC-M004-011](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-011.md) | Monitoramento de Processos de Remessa | Done |
| M004 | [EPIC-M004-012](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-012.md) | Visualizacoes e Consultas | Done |

## Cenarios de aceitacao do produto

- **Dashboard de pagamento**: tela consolidada com folhas do mes, remessas pendentes e status por area tecnica
- **Exportar mapa de pagamento**: exportacao CSV/Excel dos dados da folha para controle externo
