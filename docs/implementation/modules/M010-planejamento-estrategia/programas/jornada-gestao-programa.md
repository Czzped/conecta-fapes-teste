# Jornadas — Gestao do Programa

[← Voltar ao Indice](README.md) | [Processo](processo.md) | [Estrutural](modelo-estrutural.md) | [Comportamental](modelo-comportamental.md)

---

## Visao Geral

As jornadas de Programas foram separadas por momento do ciclo de vida para facilitar leitura, validacao com usuarios e manutencao do backlog.

## Jornadas

| Jornada | Finalidade |
|---------|------------|
| [Criacao e Ativacao](jornada-criacao-ativacao-programa.md) | Cadastro do Programa, Instituicao demandante, eixos, comite e ativacao. |
| [Aditivos](jornada-aditivos-programa.md) | Aditivo de tempo e aditivo financeiro solicitados pela Instituicao demandante. |
| [Retirada de Aporte](jornada-retirada-aporte-programa.md) | Retirada de aporte solicitada pela Instituicao demandante ou Area Tecnica. |
| [Suspensao e Reativacao](jornada-suspensao-reativacao-programa.md) | Interrupcao temporaria do Programa e retorno para `ATIVO`. |
| [Encerramento e Remocao](jornada-encerramento-remocao-programa.md) | Encerramento com historico ou remocao sem impacto quando nao ha Iniciativa vinculada. |
| [Acompanhamento](jornada-acompanhamento-programa.md) | Dashboard, indicadores, aportes, eixos, comite, editais e iniciativas. |

## Mapa do Ciclo de Vida

| # | Etapa | Ator principal | Resultado |
|---|-------|----------------|-----------|
| 1 | Criacao | Area Tecnica | Programa criado em `EM_PLANEJAMENTO`, com exatamente uma Instituicao demandante, eixos, periodo, objetivo e dados de governanca. |
| 2 | Ativacao | Area Tecnica | Programa transita para `ATIVO` quando os criterios obrigatorios sao atendidos. |
| 3 | Aditivos | Instituicao Demandante / Area Tecnica / Area de Parcerias | Prazo ou aporte financeiro do Programa atualizado com validacao de Parcerias aportantes. |
| 4 | Retirada de aporte | Instituicao Demandante / Area Tecnica / Area de Parcerias | Aporte retirado quando nao ha alocacao operacional pendente; saldo da Parceria recalculado. |
| 5 | Execucao | Area Tecnica / M003 / M011 | Editais e iniciativas passam a ser criados ou vinculados ao Programa ativo. |
| 6 | Suspensao | Area Tecnica / Area de Parcerias | Programa transita para `SUSPENSO` e bloqueia novas publicacoes quando ha motivo proprio ou herdado de Parceria. |
| 7 | Reativacao | Instituicao Demandante / Area Tecnica | Programa retorna para `ATIVO` quando a causa da suspensao e resolvida. |
| 8 | Acompanhamento | Area Tecnica | Dashboard consolida estado, eixos, aportes, comite, editais e iniciativas. |
| 9 | Encerramento ou remocao | Area Tecnica | Programa e encerrado com historico ou removido sem impacto quando nao ha Iniciativa vinculada. |

## Pontos de Atencao

| Momento | Atencao |
|---------|---------|
| Criacao | O Programa deve ter exatamente uma Instituicao demandante. |
| Aditivo de tempo | O novo periodo deve respeitar a vigencia corrente de todas as Parcerias aportantes. |
| Aditivo financeiro | O aporte deve ser registrado via `AporteFinanceiroPrograma`, sem criar relacao direta entre Programa e Parceria. |
| Suspensao por cascata | Quando a suspensao vem de Parceria, a reativacao depende da resolucao do bloqueio herdado. |
| Encerramento/remocao | A remocao e sem impacto quando nao ha nenhuma Iniciativa vinculada; se houver Iniciativa, o caminho correto e encerramento com preservacao de historico. |

## Referencia de Regras

Regras aplicaveis: `RN01`, `RN02`, `RN11`, `RN13`, `RN14`, `RN16`, `RI1`, `RI2`, `RI4`. As definicoes oficiais ficam em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas).
