# Jornada — Acompanhamento do Programa

[← Voltar ao Indice](README.md) | [Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Jornada do Usuario

```mermaid
journey
    title Acompanhamento do Programa

    section 1. Consulta
      1.1 Acessar dashboard de Programas: 4: Area Tecnica
      1.2 Filtrar por estado, eixo ou Instituicao demandante: 4: Area Tecnica
      1.3 Selecionar Programa: 4: Area Tecnica

    section 2. Analise
      2.1 Consultar eixos estrategicos: 4: Planejamento
      2.2 Consultar comite de governanca: 4: Area Tecnica
      2.3 Consultar Parcerias aportantes: 4: Area de Parcerias
      2.4 Consultar editais e iniciativas vinculadas: 4: M003, M011
      2.5 Analisar situacao operacional: 4: Area Tecnica

    section 3. Decisao
      3.1 Decidir por aditivo, suspensao ou encerramento: 3: Area Tecnica
      3.2 Registrar encaminhamento: 4: Area Tecnica
```

## Etapas

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Consulta | Area Tecnica | Lista de Programas filtrada. |
| 2 | Detalhamento | Area Tecnica | Programa selecionado com eixos, comite, aportes, editais e iniciativas. |
| 3 | Analise financeira | Area de Parcerias | Aportes por Parceria e total aportado ao Programa apresentados. |
| 4 | Analise operacional | M003 / M011 | Situacao de editais e iniciativas vinculadas apresentada. |
| 5 | Decisao | Area Tecnica | Encaminhamento para aditivo, retirada, suspensao, reativacao, encerramento ou remocao. |

## Referencia de Regras

Regras aplicaveis: `RN01`, `RN02`, `RN11`, `RN13`, `RN14`, `RN16`, `RI1`, `RI4`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
