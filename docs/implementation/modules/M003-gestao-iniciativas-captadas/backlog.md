# Sub-Backlog: M003 - Gestao de Iniciativas Captadas

[← Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Apos a contratacao, a agencia precisa gerir a iniciativa apoiada como unidade operacional unica, mantendo seu plano versionado, resultados, riscos, beneficios, equipe, cronograma, orcamento planejado, execucao consolidada e solicitacoes de alteracao de rubrica.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M003-001 | Registrar Iniciativa Contratada | RN01-RN04, RN13 | Must | To Do | [EPIC-M003-001](epics/EPIC-M003-001.md) |
| EPIC-M003-002 | Gerir Plano Versionado da Iniciativa | RN04-RN08 | Must | To Do | [EPIC-M003-002](epics/EPIC-M003-002.md) |
| EPIC-M003-003 | Gerir Orcamento Planejado e Rubricas | RN08, RN09, RN11, RN12 | Must | To Do | [EPIC-M003-003](epics/EPIC-M003-003.md) |
| EPIC-M003-004 | Consolidar Execucao Financeira da Iniciativa | RN09, RN10, RN15 | Must | To Do | [EPIC-M003-004](epics/EPIC-M003-004.md) |
| EPIC-M003-005 | Consultar Visao Consolidada da Iniciativa | RN01-RN15, RN42 | Must | To Do | [EPIC-M003-005](epics/EPIC-M003-005.md) |
| EPIC-M003-006 | Solicitar Diarias da Iniciativa | RN22-RN33 | Must | To Do | [EPIC-M003-006](diarias/epics/EPIC-M003-006.md) |
| EPIC-M003-007 | Consultar Ciclo de Fomento da Iniciativa | RN16-RN21 | Must | To Do | [EPIC-M003-007](epics/EPIC-M003-007.md) |
| EPIC-M003-008 | Consultar Vigencia e Aditivos da Iniciativa | RN34-RN41 | Must | To Do | [EPIC-M003-008](aditivos/epics/EPIC-M003-008.md) |

> **Nota de fronteira:** Edital pertence ao M011; bolsas, cotas e alocacoes pertencem ao M009; prestacao de contas detalhada pertence ao M014. Solicitacao operacional de diaria pertence ao M003 e e referenciada por M014 na comprovacao.

---

## Rastreabilidade

```text
EPIC-M003-001 (Registrar Iniciativa Contratada)
├── US-M003-001 Registrar iniciativa apos contratacao/outorga
├── US-M003-002 Classificar iniciativa por TipoIniciativa
└── US-M003-003 Registrar Ortogado da iniciativa

EPIC-M003-002 (Gerir Plano Versionado da Iniciativa)
├── US-M003-004 Criar versao inicial do plano
├── US-M003-005 Registrar objetivos gerais e especificos
├── US-M003-006 Associar objetivos especificos a resultados
├── US-M003-007 Registrar riscos e beneficios por resultado
├── US-M003-008 Planejar equipe por papeis
└── US-M003-009 Planejar cronograma por atividades

EPIC-M003-003 (Gerir Orcamento Planejado e Rubricas)
├── US-M003-010 Registrar orcamento planejado da versao do plano
├── US-M003-011 Associar item de orcamento a rubrica
├── US-M003-012 Solicitar inclusao de rubrica
└── US-M003-013 Solicitar retirada de rubrica

EPIC-M003-004 (Consolidar Execucao Financeira da Iniciativa)
├── US-M003-014 Registrar lancamento de execucao recebido de integracao
├── US-M003-015 Consolidar valores executados por rubrica
└── US-M003-016 Consultar saldo planejado versus executado

EPIC-M003-005 (Consultar Visao Consolidada da Iniciativa)
├── US-M003-017 Consultar iniciativa consolidada
├── US-M003-018 Listar iniciativas por programa
├── US-M003-019 Listar iniciativas por parceria
├── US-M003-020 Listar iniciativas por estado
└── US-M003-042 Visualizar acompanhamento orcamentario por rubrica no Meu Projeto

EPIC-M003-006 (Solicitar Diarias da Iniciativa)
├── US-M003-021 Validar referencias externas na criacao da solicitacao de diaria
├── US-M003-022 Criar solicitacao de diaria vinculada a AlocacaoBolsista
├── US-M003-023 Associar solicitacao de diaria ao tipo de diaria e parametros vigentes da abrangencia
├── US-M003-024 Calcular quantidade e valor da solicitacao de diaria automaticamente
├── US-M003-025 Notificar bolsistas para aceite da diaria solicitada
├── US-M003-026 Registrar aceite da diaria na solicitacao
├── US-M003-027 Validar saldo e comprometer rubrica ao criar solicitacao de diaria
├── US-M003-028 Registrar transacao da solicitacao na RubricaProjeto da abrangencia
├── US-M003-029 Remover solicitacao de diaria alocada/aprovada antes do inicio e gerar reversao
├── US-M003-030 Consultar solicitacoes de diaria da iniciativa
├── US-M003-031 Concluir solicitacao de diaria automaticamente apos aceite ou quando propria do coordenador
├── US-M003-032 Visualizar, aceitar ou recusar diaria pelo bolsista
└── US-M003-033 Consultar, filtrar e paginar solicitacoes de diaria no Backoffice

EPIC-M003-007 (Consultar Ciclo de Fomento da Iniciativa)
├── US-M003-034 Consultar timeline consolidada da iniciativa
├── US-M003-035 Identificar origem de cada marco
├── US-M003-036 Exibir marco atual da iniciativa
└── US-M003-037 Consultar ciclo por proposta antes da iniciativa operacional

EPIC-M003-008 (Consultar Vigencia e Aditivos da Iniciativa)
├── US-M003-038 Consultar vigencia da iniciativa
├── US-M003-039 Identificar aditivo de tempo
├── US-M003-040 Identificar aditivo financeiro
└── US-M003-041 Listar dados dos aditivos no bloco Vigencia e aditivos
```
