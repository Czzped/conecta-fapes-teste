# Jornada — Aditivos do Programa

[← Voltar ao Indice](README.md) | [Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Aditivos do Programa

    section 1. Aditivo de Tempo
      1.1 Solicitar aditivo de tempo: 4: Instituicao Demandante
      1.2 Enviar justificativa e novo periodo: 4: Instituicao Demandante
      1.3 Analisar justificativa e periodo: 3: Area Tecnica
      1.4 Validar vigencia das Parcerias aportantes: 3: Area de Parcerias
      1.5 Atualizar periodo do Programa: 5: Area Tecnica

    section 2. Aditivo Financeiro
      2.1 Solicitar aditivo financeiro: 4: Instituicao Demandante
      2.2 Enviar justificativa e valor solicitado: 4: Instituicao Demandante
      2.3 Analisar demanda de reforco financeiro: 3: Area Tecnica
      2.4 Validar Parceria vigente e saldo: 3: Area de Parcerias
      2.5 Registrar AporteFinanceiroPrograma: 5: Area de Parcerias
      2.6 Recalcular saldo da Parceria: 5: Area de Parcerias
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Solicitar aditivo de tempo | Instituicao Demandante | Pedido de alteracao de prazo formalizado. |
| 2 | Validar periodo | Area Tecnica / Area de Parcerias | Novo periodo aprovado apenas se respeitar vigencias das Parcerias aportantes. |
| 3 | Solicitar aditivo financeiro | Instituicao Demandante | Pedido de reforco financeiro formalizado. |
| 4 | Validar Parceria e saldo | Area de Parcerias | Aporte permitido apenas com Parceria vigente e saldo suficiente. |
| 5 | Registrar aporte | Area de Parcerias | Recurso alocado ao Programa via `AporteFinanceiroPrograma`. |

## Referencia de Regras

Regras aplicaveis: `RN02`, `RN11`, `RN13`, `RN14`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
