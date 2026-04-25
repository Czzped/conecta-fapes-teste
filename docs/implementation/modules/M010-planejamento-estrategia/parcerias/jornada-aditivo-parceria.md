# Jornada — Aditivo da Parceria

[← Voltar ao Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Aditivo da Parceria

    section 1. Inicio
      1.1 Selecionar Parceria vigente: 4: Area de Parcerias
      1.2 Identificar necessidade de aditivo: 3: Area de Parcerias

    section 2. Aditivo de Vigencia
      2.1 Registrar nova Vigencia aditivo: 4: Area de Parcerias
      2.2 Anexar termo aditivo: 4: Area de Parcerias
      2.3 Validar datas pela RN06: 3: Area de Parcerias
      2.4 Recalcular vigencia corrente: 4: Area de Parcerias

    section 3. Aditivo de Aporte
      3.1 Registrar aporte financeiro aditivo: 4: Area de Parcerias
      3.2 Validar origem na Instituicao vinculada: 3: Area de Parcerias
      3.3 Validar conta bancaria de destino: 3: Financeiro
      3.4 Atualizar saldo da Parceria: 4: Financeiro

    section 4. Resultado
      4.1 Preservar historico do aditivo: 5: Area de Parcerias
      4.2 Disponibilizar dados atualizados para Programas: 4: Area de Parcerias
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Selecionar Parceria | Area de Parcerias | Parceria vigente selecionada para alteracao. |
| 2 | Aditivo de vigencia | Area de Parcerias | Nova `Vigencia` com `isAditivo = true` registrada. |
| 3 | Aditivo de aporte | Area de Parcerias / Financeiro | Novo `AporteFinanceiro` com `isAditivo = true` registrado. |
| 4 | Recalculo | Area de Parcerias / Financeiro | Vigencia corrente ou saldo atualizados. |
| 5 | Historico | Area de Parcerias | Alteracao preservada como aditivo, sem sobrescrever o instrumento original. |

## Referencia de Regras

Regras aplicaveis: `RN04`, `RN06`, `RN10`, `RN14`, `RN17`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
