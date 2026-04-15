# EP-10 — Remanejamento de Bolsas

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M013 |
| **Produto** | Portal Coordenador |
| **Status** | Partial |

## Jornada

O coordenador redistribui cotas de bolsa por modalidade com simulacao financeira em tempo real, submete o remanejamento e recebe feedback de confirmacao.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M013 | [EPIC-M013-003](../../../implementation/modules/M013-gestao-orcamentaria-projeto/epics/EPIC-M013-003.md) | Remanejamento Orcamentario | To Do |

## Cenarios de aceitacao do produto

- **Ajustar cotas com simulacao financeira**: formulario calcula saldo, total previsto e percentual utilizado em tempo real
- **Bloquear envio com saldo negativo**: validacao frontend impede submissao quando orcamento e excedido
- **Consultar abas ainda nao implementadas**: abas "Remanejamento Interno" e "Remanejamento FAPES" exibem placeholder
