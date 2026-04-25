# Jornada — Suspensao e Reativacao do Programa

[← Voltar ao Indice](README.md) | [Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Suspensao e Reativacao do Programa

    section 1. Suspensao
      1.1 Solicitar suspensao por decisao tecnica: 3: Area Tecnica
      1.2 Receber suspensao herdada de Parceria: 2: Area de Parcerias
      1.3 Registrar motivo da suspensao: 3: Area Tecnica
      1.4 Suspender Programa: 3: Area Tecnica
      1.5 Bloquear novas publicacoes: 3: M003, M011

    section 2. Reativacao
      2.1 Solicitar reativacao: 4: Instituicao Demandante, Area Tecnica
      2.2 Enviar evidencias de resolucao: 4: Instituicao Demandante
      2.3 Verificar bloqueio herdado de Parceria: 3: Area de Parcerias
      2.4 Validar resolucao da causa: 3: Area Tecnica
      2.5 Reativar Programa: 5: Area Tecnica
      2.6 Desbloquear operacoes: 5: M003, M011
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Suspensao | Area Tecnica / Area de Parcerias | Programa transita para `SUSPENSO`. |
| 2 | Bloqueio operacional | M003 / M011 | Novas publicacoes e execucoes vinculadas ficam bloqueadas. |
| 3 | Solicitacao de reativacao | Instituicao Demandante / Area Tecnica | Pedido de retorno recebido. |
| 4 | Validacao | Area Tecnica / Area de Parcerias | Causa da suspensao e bloqueios herdados sao avaliados. |
| 5 | Reativacao | Area Tecnica | Programa retorna para `ATIVO`. |

## Referencia de Regras

Regras aplicaveis: `RI4`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
