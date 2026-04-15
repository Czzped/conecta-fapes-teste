# EP-09 — Pagamentos de Bolsa

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M004 |
| **Produto** | Portal Coordenador |
| **Status** | Done |

## Jornada

O usuario consulta historico de pagamentos do projeto com filtros por data, modalidade e status.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M004 | [EPIC-M004-012](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-012.md) | Visualizacoes e Consultas | Done |

## Cenarios de aceitacao do produto

- **Exibir estado vazio**: quando nao ha pagamentos, exibir mensagem orientativa
- **Filtrar por data, modalidade e status**: campos de filtro com atualizacao reativa da listagem
