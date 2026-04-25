# Jornada — Suspensao, Reativacao e Encerramento da Parceria

[← Voltar ao Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Suspensao, Reativacao e Encerramento da Parceria

    section 1. Solicitacao
      1.1 Solicitar suspensao: 3: Instituicao, Area de Parcerias
      1.2 Solicitar encerramento: 3: Instituicao, Area de Parcerias
      1.3 Enviar justificativa: 3: Instituicao
      1.4 Receber solicitacao: 4: Area de Parcerias

    section 2. Suspensao
      2.1 Informar motivo da suspensao: 3: Area de Parcerias
      2.2 Suspender Parceria: 3: Area de Parcerias
      2.3 Acionar suspensao em cascata: 2: Area de Parcerias
      2.4 Bloquear aportes e aditivos: 3: Area de Parcerias

    section 3. Reativacao
      3.1 Validar vigencia corrente: 3: Area de Parcerias
      3.2 Reativar Parceria: 4: Area de Parcerias
      3.3 Solicitar reativacao de Programas e Iniciativas: 4: Area de Parcerias

    section 4. Encerramento
      4.1 Iniciar encerramento operacional: 3: Area de Parcerias
      4.2 Informar justificativa e confirmacao: 3: Area de Parcerias
      4.3 Encerrar Programas aportados em cascata: 2: Programas
      4.4 Encerrar Parceria: 5: Area de Parcerias
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Solicitacao | Instituicao ou Area de Parcerias | Pedido de suspensao ou encerramento recebido. |
| 2 | Suspensao | Area de Parcerias | Parceria transita para `Suspensa` e bloqueia novas operacoes. |
| 3 | Reativacao | Area de Parcerias | Parceria volta para `Vigente` se a vigencia corrente estiver valida. |
| 4 | Encerramento | Area de Parcerias / Programas | Programas aportados sao encerrados em cascata e a Parceria transita para `Encerrada`. |

## Referencia de Regras

Regras aplicaveis: `RN14`, `RI2`, `RI4`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
