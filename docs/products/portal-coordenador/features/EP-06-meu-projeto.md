# EP-06 — Meu Projeto

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M003, M009 |
| **Produto** | Portal Coordenador |
| **Status** | Done |

## Jornada

O coordenador visualiza resumo financeiro e itens orcamentarios do projeto. O participante visualiza suas bolsas priorizadas por status.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M003 | [EPIC-M003-005](../../../implementation/modules/M003-gestao-iniciativas-captadas/epics/EPIC-M003-005.md) | Visao Operacional Consolidada | Done |
| M009 | [EPIC-M009-004](../../../implementation/modules/M009-gestao-bolsista/epics/EPIC-M009-004.md) | Consultar Bolsa Pesquisa | To Do |

> **Nota:** A feature de frontend esta Done, porem o EPIC de backend (EPIC-M009-004) permanece To Do. O frontend foi implementado antecipadamente e aguarda a conclusao do backend para integracao completa.

## Cenarios de aceitacao do produto

- **Exibir estado sem bolsa**: quando o participante nao possui bolsa ativa, exibir mensagem orientativa
