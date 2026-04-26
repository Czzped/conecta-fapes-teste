# Parcerias

[← Voltar ao M010](../README.md)

---

## Visao Geral

O subdominio de Parcerias organiza o ciclo de vida das cooperacoes institucionais firmadas pela agencia de fomento com uma Instituicao. Ele cobre a solicitacao, formalizacao, vigencia, aditivos, aportes financeiros, alocacao de recursos em Programas ou Iniciativas, suspensao, encerramento e rastreabilidade documental.

Uma Parceria pertence a exatamente uma Instituicao e pode aportar recursos em um ou mais Programas. O Programa tambem pode receber aportes de mais de uma Parceria, sempre por meio de `AporteFinanceiroParceriaPrograma`.

## Dores

| Dor | Impacto | Resposta do Subdominio |
|-----|---------|------------------------|
| Falta de gestao processual de como criar uma parceria | A criacao da parceria depende de documentos avulsos, troca de informacoes fora do sistema e pouca clareza sobre o que falta para formalizar a cooperacao. | O processo de criacao define inicio pela solicitacao da Instituicao, envio do documento de solicitacao, analise, cadastro, vigencia original, documentos e criterios para transicao para `Vigente`. |
| Falta de gestao financeira da parceria | Nao ha rastreabilidade clara sobre quanto foi investido, quando o recurso foi implementado e quando foi alocado em Programas ou Iniciativas. | O modelo separa aportes recebidos pela Parceria (`AporteFinanceiro`) dos recursos destinados a Programas (`AporteFinanceiroParceriaPrograma`), permitindo acompanhar saldo, historico de aportes, aditivos e alocacoes. |

## Documentos

| Documento | Finalidade |
|-----------|------------|
| [Processo](processo.md) | Fluxos operacionais de criacao, aditivo, suspensao, encerramento e suspensao em cascata. |
| [Jornada — Criacao da Parceria](jornada-criacao-parceria.md) | Jornada visual da solicitacao ate a formalizacao da Parceria. |
| [Jornada — Aditivo da Parceria](jornada-aditivo-parceria.md) | Jornada visual para aditivo de vigencia ou de aporte financeiro. |
| [Jornada — Suspensao e Encerramento](jornada-suspensao-encerramento-parceria.md) | Jornada visual para suspender, reativar ou encerrar a Parceria. |
| [Jornada — Suspensao em Cascata](jornada-suspensao-cascata.md) | Jornada visual do impacto da suspensao sobre Programas e Iniciativas. |
| [Modelo Estrutural](modelo-estrutural.md) | Classes, atributos e relacionamentos do subdominio. |
| [Modelo Comportamental](modelo-comportamental.md) | Estados, transicoes e regras de comportamento da Parceria. |
| [EPIC-M010-002 — Gestao de Parcerias](epics/EPIC-M010-002.md) | Backlog principal de gestao de parcerias. |
| [EPIC-M010-004 — Dashboard de Parcerias](epics/EPIC-M010-004.md) | Backlog dos dashboards global e local da Parceria. |

## Capacidades Principais

| Capacidade | Resultado Esperado |
|------------|--------------------|
| Criar e formalizar Parceria | Registrar Instituicao vinculada, vigencia original, documentos e aporte original. |
| Registrar aportes financeiros | Controlar valores investidos pela Instituicao vinculada, com documento formalizador. |
| Registrar aditivos | Preservar historico de nova vigencia ou novo aporte sem sobrescrever a Parceria original. |
| Alocar recursos em Programas | Destinar parte do saldo da Parceria a Programas, mantendo rastreabilidade financeira. |
| Consultar dashboards e saldo | Responder quanto foi investido, aportado, alocado, consumido e quanto permanece disponivel. |
| Suspender ou encerrar Parceria | Controlar impacto sobre Programas e Iniciativas vinculadas. |

## Regras de Negocio

As regras oficiais ficam centralizadas em [M010 — Regras de Negocio](../README.md#regras-de-negocio-consolidadas). Este subdominio referencia principalmente: `RN02`, `RN03`, `RN04`, `RN06`, `RN10`, `RN11`, `RN12`, `RN13`, `RN14`, `RN15`, `RN17`, `RN18`, `RN19`, `RI2`, `RI3`, `RI4`.
