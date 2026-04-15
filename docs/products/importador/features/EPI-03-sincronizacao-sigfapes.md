# EPI-03 — Sincronizacao com SIGFAPES

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M002 |
| **Produto** | Importador SIGFAPES |
| **Status** | Entregue |

## Jornada

O operador dispara a sincronizacao de dados entre SIGFAPES e Conecta FAPES, acompanha o progresso em tempo real e consulta relatorios de execucao com erros e divergencias para tratamento.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M002 | [EPIC-M002-003](../../../implementation/modules/M002-importacao-editais/epics/EPIC-M002-003.md) | Sincronizar Dados de Editais | Done |

## Cenarios de aceitacao do produto

- **Disparar sincronizacao**: botao de inicio com confirmacao e indicador de progresso
- **Acompanhar progresso**: barra de progresso com contadores (processados/total/erros)
- **Consultar relatorio de sincronizacao**: detalhamento de registros importados, atualizados e com erro
- **Reprocessar erros**: opcao de reexecutar a sincronizacao para registros com falha
