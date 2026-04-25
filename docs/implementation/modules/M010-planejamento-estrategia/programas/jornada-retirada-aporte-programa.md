# Jornada — Retirada de Aporte do Programa

[← Voltar ao Indice](README.md) | [Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Retirada de Aporte de Parceria do Programa

    section 1. Solicitacao
      1.1 Solicitar retirada do aporte: 4: Instituicao Demandante, Area Tecnica
      1.2 Enviar justificativa: 4: Instituicao Demandante, Area Tecnica
      1.3 Identificar Programa e aporte da Parceria: 4: Area Tecnica, Area de Parcerias

    section 2. Impacto Operacional
      2.1 Verificar dinheiro ja alocado: 3: M003, M011
      2.2 Bloquear retirada se houver alocacao: 2: Area Tecnica
      2.3 Cancelar, reduzir ou realocar iniciativas afetadas: 2: M003, M011
      2.4 Revisar cronograma quando necessario: 3: Area Tecnica

    section 3. Retirada
      3.1 Confirmar retirada sem impacto pendente: 4: Area Tecnica
      3.2 Reverter alocacao do aporte: 5: Area de Parcerias
      3.3 Recalcular saldo da Parceria: 5: Area de Parcerias
      3.4 Registrar historico financeiro e operacional: 5: Area Tecnica, Area de Parcerias
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Solicitacao | Instituicao Demandante ou Area Tecnica | Pedido de retirada formalizado com justificativa. |
| 2 | Identificacao do aporte | Area Tecnica / Area de Parcerias | `AporteFinanceiroParceriaPrograma` localizado. |
| 3 | Analise de impacto | M003 / M011 | Verifica se o dinheiro ja foi alocado em iniciativa ou execucao vinculada. |
| 4 | Ajuste operacional | M003 / M011 | Iniciativas afetadas sao canceladas, reduzidas ou realocadas quando necessario. |
| 5 | Retirada | Area de Parcerias | Aporte retirado do Programa e saldo devolvido a Parceria. |

## Pontos de Atencao

| Momento | Atencao |
|---------|---------|
| Sem alocacao operacional | A retirada pode ocorrer sem cancelamento de iniciativas. |
| Com dinheiro alocado | A retirada direta e bloqueada ate ajuste das iniciativas afetadas. |
| Impacto de prazo | O cronograma do Programa pode precisar ser revisado. |

## Referencia de Regras

Regras aplicaveis: `RN02`, `RN11`, `RN14`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
