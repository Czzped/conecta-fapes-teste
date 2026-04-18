# EPA-07 — Gestao de Parcerias

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M010 (Planejamento e Estrategia — subdominio `parcerias/`) + M010 `programas/` para aportes destinados |
| **Produto** | Portal Admin |
| **Status** | Em desenvolvimento (sprint-007) |
| **GitHub EPIC** | [#1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) Portal Admin — Parcerias |

## Jornada

O **Servidor da Area de Parcerias** utiliza o Portal Admin para gerenciar todo o ciclo de vida das parcerias institucionais: cadastro, formalizacao, registro de aportes financeiros (recebidos de Instituicoes e destinados a Programas), prorrogacoes de vigencia via aditivos, anexacao de documentos regularizadores (M008), consulta de saldo, alteracoes em aditivos e encerramento em cascata quando a parceria finaliza.

## Escopo — refactor da sprint-007

O dominio M010 foi refatorado com as seguintes mudancas importantes:

**Removidos**:
- `Coordenacao` / coordenador em Parceria
- `Finalidade` vinculada a Parceria (permanece em M008 como catalogo geral)
- `UnidadeOrganizacional responsavel` da Parceria
- Relacao direta "parceria de referencia" Programa→Parceria

**Adicionados**:
- `Vigencia` (com `isAditivo: boolean`) — suporta Vigencia original + aditivos
- `AporteFinanceiro.isAditivo` — distingue aporte original de aditivos
- `AporteFinanceiroParceriaPrograma` — relacao N:N Parceria-Programa (entidade vive em M010/programas)
- Atributos derivados: `/vigenciaInicioCorrente`, `/vigenciaFimCorrente`, `/saldo`
- RN17 (aditivo requer original posterior), RN18 (edicao/remocao aditivo), RN19 (precondicoes Vigente)
- RI2 (encerramento em cascata com confirmacao + justificativa), RI3 (remocao bloqueada se vinculado a Programa)

## EPICs de implementacao

| Modulo | EPIC | Titulo | GitHub | Status |
|--------|------|--------|--------|--------|
| M010/parcerias | [EPIC-M010-002](../../../implementation/modules/M010-planejamento-estrategia/parcerias/epics/EPIC-M010-002.md) | Gestao de Parcerias | [#1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) | In Progress |

## User Stories e Telas do Portal Admin

| US | Titulo | Issue | Tela de referencia (Figma/prototype) |
|----|--------|-------|-------------------------------------|
| US-M010-004 | Cadastrar e Formalizar Parceria (RN19) | [#1739](https://github.com/leds-conectafapes/conectafapes-project/issues/1739) | `FormularioParceria.tsx` |
| US-M010-005 | Registrar Aporte Financeiro (inflow, isAditivo) | [#1740](https://github.com/leds-conectafapes/conectafapes-project/issues/1740) | `DetalhesParceria.tsx` (aba Aportes) |
| US-M010-008 | Listar e Consultar Parcerias | [#1743](https://github.com/leds-conectafapes/conectafapes-project/issues/1743) | `Parceria.tsx` |
| US-M010-009 | Encerrar Parceria (cascata RI2 + justificativa) | [#1744](https://github.com/leds-conectafapes/conectafapes-project/issues/1744) | `DetalhesParceria.tsx` (acao Encerrar) |
| US-M010-010 | Registrar Vigencia (Aditivo) | [#1791](https://github.com/leds-conectafapes/conectafapes-project/issues/1791) | `DetalhesParceria.tsx` (aba Vigencias) |
| US-M010-011 | Registrar Aditivo de Aporte (isAditivo + editar/remover RN18) | [#1792](https://github.com/leds-conectafapes/conectafapes-project/issues/1792) | `DetalhesParceria.tsx` (aba Aportes — aditivos) |
| US-M010-012 | Anexar Documentos a Parceria | [#1793](https://github.com/leds-conectafapes/conectafapes-project/issues/1793) | `DetalhesParceria.tsx` (aba Documentos) |
| US-M010-014 | Registrar Aporte Financeiro Parceria → Programa (N:N) | [#1794](https://github.com/leds-conectafapes/conectafapes-project/issues/1794) | `DetalhesParceria.tsx` (aba Programas Aportados) |
| US-M010-015 | Validar Invariante Temporal RN13 | [#1795](https://github.com/leds-conectafapes/conectafapes-project/issues/1795) | feedback inline nos formularios acima |
| US-M010-016 | Consultar Saldo da Parceria (RN14) | [#1796](https://github.com/leds-conectafapes/conectafapes-project/issues/1796) | `DetalhesParceria.tsx` (header — card de saldo) |
| US-M010-017 | Remover Parceria (em caso de erro, RI3) | [#1797](https://github.com/leds-conectafapes/conectafapes-project/issues/1797) | `DetalhesParceria.tsx` (acao Remover — com guarda) |

**Issues fechadas (conceitos removidos)**: ~~#1741 Coordenacao~~, ~~#1742 Finalidade~~.

## Cenarios de aceitacao do produto

- **Cadastro guiado**: formulario cria Parceria + Vigencia original em uma unica submissao
- **Formalizacao com checklist**: UI exibe pre-condicoes RN19 (dataAssinatura, >=1 aporte, >=1 documento, hoje na vigencia) com indicadores de atendido/pendente
- **Saldo visivel sempre**: card de saldo no header da Parceria com detalhamento (total recebido, total aportado em programas)
- **Aditivos em historico**: lista cronologica de Vigencias e de AporteFinanceiros com flag `isAditivo` claramente identificada
- **Encerramento em duas fases**: modal lista Programas afetados e exige confirmacao explicita + justificativa
- **Remocao segura**: acao desabilitada quando ha vinculo com Programas, com explicacao da regra (RI3)

## Prototipos de referencia

- [Back-office (Figma)](https://bucket-lake-78647159.figma.site/) — Telas de Parcerias
- [Prototipo Backoffice (codigo)](../../../prototype/backoffice/) — `Parceria.tsx`, `DetalhesParceria.tsx`, `FormularioParceria.tsx`

## Documentacao M010

- [M010 README (indice)](../../../implementation/modules/M010-planejamento-estrategia/README.md)
- [Parcerias — Modelo Estrutural](../../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md)
- [Parcerias — Modelo Comportamental](../../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-comportamental.md)
- [Programas — Modelo Estrutural](../../../implementation/modules/M010-planejamento-estrategia/programas/modelo-estrutural.md) (onde vive `AporteFinanceiroParceriaPrograma`)
- [Contrato M010](../../../implementation/modules/M010-planejamento-estrategia/contrato.md)
- [Contrato API M010](../../../implementation/modules/M010-planejamento-estrategia/contrato-api.md)
