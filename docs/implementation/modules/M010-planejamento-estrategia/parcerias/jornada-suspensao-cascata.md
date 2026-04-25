# Jornada — Suspensao em Cascata

[← Voltar ao Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Suspensao em Cascata para Programas e Iniciativas

    section 1. Parceria
      1.1 Confirmar suspensao da Parceria: 3: Area de Parcerias
      1.2 Identificar causa e vigencia da suspensao: 3: Area de Parcerias
      1.3 Notificar areas responsaveis: 4: Area de Parcerias

    section 2. Programas
      2.1 Listar Programas aportados pela Parceria: 4: Programas
      2.2 Suspender Programas vinculados: 2: Programas
      2.3 Registrar motivo da suspensao herdada: 3: Programas
      2.4 Bloquear novos aportes e ativacoes: 3: Programas

    section 3. Iniciativas
      3.1 Listar Iniciativas vinculadas: 4: Iniciativas
      3.2 Suspender Iniciativas impactadas: 2: Iniciativas
      3.3 Registrar motivo da suspensao herdada: 3: Iniciativas
      3.4 Bloquear novas publicacoes ou execucoes: 3: Iniciativas

    section 4. Retomada
      4.1 Reativar Parceria: 4: Area de Parcerias
      4.2 Reativar Programas impactados: 4: Programas
      4.3 Reativar Iniciativas impactadas: 4: Iniciativas
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Confirmar suspensao | Area de Parcerias | Parceria permanece em `Suspensa` com motivo registrado. |
| 2 | Suspender Programas | Programas / M010 | Todos os Programas aportados pela Parceria ficam `Suspenso`. |
| 3 | Suspender Iniciativas | Iniciativas / M003 | Iniciativas vinculadas diretamente ou por Programa ficam suspensas. |
| 4 | Bloquear execucao | Programas / Iniciativas | Novas ativacoes, publicacoes ou execucoes ficam bloqueadas. |
| 5 | Retomada | Area de Parcerias / Programas / Iniciativas | Reativacao ocorre em ordem inversa: Parceria, Programas e Iniciativas. |

## Referencia de Regras

Regra aplicavel: `RI4`. A definicao oficial fica em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
