# EPI-01 — Importacao de Editais e Selecao

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |

## Jornada

O operador lista editais disponiveis no SIGFAPES, seleciona quais devem ser importados para o Conecta FAPES, informa a Area Tecnica responsavel e inicia a importacao. Os editais importados ficam disponiveis em M003.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [EPIC-M002-001](../../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-001.md) | Definir Editais a Sincronizar | Done |

## Cenarios de aceitacao do produto

- **Listar editais do SIGFAPES**: tela exibe editais disponiveis com filtros de busca
- **Selecionar editais para importacao**: checkbox para selecao multipla com confirmacao
- **Informar Area Tecnica**: campo obrigatorio antes de confirmar importacao
