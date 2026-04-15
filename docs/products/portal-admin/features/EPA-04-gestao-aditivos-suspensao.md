# EPA-04 — Gestao de Aditivos e Suspensao

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M009, M015 |
| **Produto** | Portal Admin |
| **Status** | Planejado (Q2) |

## Jornada

O operador gerencia aditivos de bolsa (alteracao de valores, prazos, escopo e substituicao de coordenacao) e aplica suspensoes temporarias de pagamento e atividades de bolsistas pelo lado administrativo.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M009 | [EPIC-M009-004](../../../implementation/modules/M009-gestao-bolsista/epics/EPIC-M009-004.md) | Consultar Bolsa Pesquisa | To Do |
| M015 | [EPIC-M015-001](../../../implementation/modules/M015-suspensao-finalizacao/epics/EPIC-M015-001.md) | Suspensao de Projeto | To Do |
| M015 | [EPIC-M015-002](../../../implementation/modules/M015-suspensao-finalizacao/epics/EPIC-M015-002.md) | Finalizacao de Projeto | To Do |

## Cenarios de aceitacao do produto

- **Visualizar pendencias do Conecta**: exibir apenas solicitacoes originadas no Conecta FAPES (ajuste de filtro)
- **Permissao para terceirizado**: validar documentacao sem permissao de implantacao de aditivos
