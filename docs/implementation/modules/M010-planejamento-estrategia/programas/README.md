# Programas

[← Voltar ao M010](../README.md)

---

## Visao Geral

O subdominio de Programas organiza o ciclo de vida dos Programas de fomento, desde a criacao e ativacao ate aditivos, aportes recebidos de Parcerias, retirada de aportes, suspensao, reativacao, execucao operacional, acompanhamento e encerramento.

Todo Programa possui exatamente uma Instituicao demandante, deve estar vinculado a pelo menos um eixo estrategico e pode receber aportes de uma ou mais Parcerias por meio de `AporteFinanceiroParceriaPrograma`.

## Documentos

| Documento | Finalidade |
|-----------|------------|
| [Processo](processo.md) | Fluxos operacionais de criacao, aditivos, retirada de aporte, suspensao, reativacao, encerramento, execucao e acompanhamento. |
| [Jornadas — Gestao do Programa](jornada-gestao-programa.md) | Mapa resumido das jornadas do subdominio. |
| [Jornada — Criacao e Ativacao](jornada-criacao-ativacao-programa.md) | Jornada de cadastro, validacao e ativacao do Programa. |
| [Jornada — Aditivos](jornada-aditivos-programa.md) | Jornada de aditivo de tempo e aditivo financeiro solicitados pela Instituicao demandante. |
| [Jornada — Retirada de Aporte](jornada-retirada-aporte-programa.md) | Jornada para retirar aporte de Parceria do Programa com validacao de impacto operacional. |
| [Jornada — Suspensao e Reativacao](jornada-suspensao-reativacao-programa.md) | Jornada de suspensao temporaria e retorno do Programa para `ATIVO`. |
| [Jornada — Encerramento e Remocao](jornada-encerramento-remocao-programa.md) | Jornada para encerrar ou remover Programa conforme existencia de Iniciativas vinculadas. |
| [Jornada — Acompanhamento](jornada-acompanhamento-programa.md) | Jornada de dashboard, indicadores, aportes, eixos, comite, editais e iniciativas. |
| [Modelo Estrutural](modelo-estrutural.md) | Classes, atributos e relacionamentos do subdominio. |
| [Modelo Comportamental](modelo-comportamental.md) | Estados, transicoes e regras de comportamento do Programa. |
| [EPIC-M010-003 — Gestao de Programas](epics/EPIC-M010-003.md) | Backlog principal de gestao de Programas. |

## Capacidades Principais

| Capacidade | Resultado Esperado |
|------------|--------------------|
| Criar e ativar Programa | Programa criado em `EM_PLANEJAMENTO` e ativado quando atende Instituicao demandante, eixo e comite. |
| Registrar aditivo de tempo | Periodo atualizado sem violar vigencia das Parcerias aportantes. |
| Solicitar aditivo financeiro | Reforco financeiro analisado e, quando aprovado, registrado via `AporteFinanceiroParceriaPrograma`. |
| Retirar aporte de Parceria | Aporte retirado quando ainda nao houve alocacao operacional; se houver alocacao, exige ajuste previo. |
| Suspender e reativar Programa | Publicacoes e execucoes bloqueadas durante impedimento e retomadas apos resolucao. |
| Encerrar ou remover Programa | Remocao sem impacto quando nao ha Iniciativa vinculada; encerramento preserva historico quando ha execucao. |
| Acompanhar Programa | Dashboard consolida estado, aportes, eixos, comite, editais e iniciativas. |

## Regras de Negocio

As regras oficiais ficam centralizadas em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas). Este subdominio referencia principalmente: `RN01`, `RN02`, `RN11`, `RN13`, `RN14`, `RN16`, `RI1`, `RI2`, `RI4`.
