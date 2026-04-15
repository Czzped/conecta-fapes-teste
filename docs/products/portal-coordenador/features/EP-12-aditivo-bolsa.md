# EP-12 — Aditivo de Bolsa

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M009, M015 |
| **Produto** | Portal Coordenador |
| **Status** | Prototype |

## Jornada

O coordenador solicita extensao de bolsa ativa informando novo termino e justificativa. O sistema calcula meses adicionais e impacto financeiro. Atualmente opera como prototipo sem envio fim a fim.

## EPICs de implementacao

| Modulo | EPIC | Titulo | Status |
|--------|------|--------|--------|
| M009 | [EPIC-M009-004](../../../implementation/modules/M009-gestao-bolsista/epics/EPIC-M009-004.md) | Consultar Bolsa Pesquisa | To Do |
| M015 | [EPIC-M015-001](../../../implementation/modules/M015-suspensao-finalizacao/epics/EPIC-M015-001.md) | Suspensao Temporaria | To Do |

## Cenarios de aceitacao do produto

- **Informar novo termino e justificativa**: formulario com data de termino e campo de justificativa
- **Bloquear aditivo sem extensao real**: validacao frontend impede submissao se novo termino nao estende a vigencia
- **Bloquear aditivo acima da vigencia do projeto**: validacao frontend impede termino alem do fim do projeto
- **Exibir prototipo sem envio fim a fim**: feedback local de sucesso sem mutation real ao backend
