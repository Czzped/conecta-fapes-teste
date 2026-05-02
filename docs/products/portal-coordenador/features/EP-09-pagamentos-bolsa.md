# EP-09 — Pagamentos de Bolsa

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M004 |
| **Produto** | Portal Coordenador |
| **Status** | Done |

## Jornada

O coordenador consulta todos os pagamentos do projeto no grupo Gerenciamento. O bolsista consulta seus proprios pagamentos no grupo Meu Perfil. As duas visoes usam filtros multisselecao por ano de pagamento, modalidade e status.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M004 | [EPIC-M004-012](../../../implementation/modules/M004-pagamento-bolsista/epics/EPIC-M004-012.md) | Visualizacoes e Consultas | Done |

## Cenarios de aceitacao do produto

- **Exibir estado vazio**: quando nao ha pagamentos, exibir mensagem orientativa
- **Filtrar por anos, modalidades e status**: os filtros funcionam por multisselecao e permitem combinar um ou mais anos, modalidades e status; a tela nao exibe filtro de projeto porque opera no projeto selecionado no portal
- **Visualizar pagamentos do projeto**: no menu Gerenciamento, o coordenador acessa Pagamentos e visualiza uma linha por pagamento com referencia, projeto, bolsista, data, modalidade, valor e status
- **Visualizar meus pagamentos**: no menu Meu Perfil, o bolsista acessa Meus Pagamentos e visualiza apenas os pagamentos vinculados a ele
