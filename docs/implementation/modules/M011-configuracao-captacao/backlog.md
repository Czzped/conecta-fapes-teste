# Sub-Backlog: M011 - Configuracao de Captacao

[<- Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

A agencia de fomento configura e publica captacoes para selecionar projetos. O ciclo do M011 envolve: configuracao da captacao, cronograma da captacao, selecao de formularios publicados no M021, recebimento de propostas, avaliacao documental, avaliacao ad hoc, revisao de resultado e publicacao do resultado final. Atualmente esse processo e manual, sem padronizacao, gerando inconsistencias e retrabalho. Este modulo termina na publicacao do resultado final; contratacao/outorga segue no M022.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M011-001 | Configuracao da Captacao | UC01 | Must | In Progress | [EPIC-M011-001](epics/EPIC-M011-001.md) |
| EPIC-M011-002 | Selecao de Formularios | UC02 | Must | To Do | [EPIC-M011-002](epics/EPIC-M011-002.md) |
| EPIC-M011-003 | Gestao de Pool de Revisores Ad Hoc | UC03 | Must | To Do | [EPIC-M011-003](epics/EPIC-M011-003.md) |
| EPIC-M011-004 | Recebimento de Propostas | UC04 | Must | To Do | [EPIC-M011-004](epics/EPIC-M011-004.md) |
| EPIC-M011-005 | Avaliacao Documental e Ad Hoc | UC05 | Must | To Do | [EPIC-M011-005](epics/EPIC-M011-005.md) |
| EPIC-M011-006 | Revisao de Resultado | UC06 | Must | To Do | [EPIC-M011-006](epics/EPIC-M011-006.md) |
| EPIC-M011-007 | Publicacao de Resultado | UC07 | Must | To Do | [EPIC-M011-007](epics/EPIC-M011-007.md) |
| EPIC-M011-008 | Rubricas Permitidas da Captacao | UC08 | Must | To Do | [EPIC-M011-008](epics/EPIC-M011-008.md) |
| EPIC-M011-009 | Gestao do Fomento | UC09 | Must | To Do | [EPIC-M011-009](epics/EPIC-M011-009.md) |
| EPIC-M011-010 | Controles Operacionais da Captacao (Pausa, Retomada e Encerramento) | UC10 | Must | To Do | [EPIC-M011-010](epics/EPIC-M011-010.md) |

> **Nota:** EPICs 004-007 foram identificados na [analise do prototipo backoffice](specifications/analise-prototipo-captacao.md) — funcionalidades presentes no prototipo sem cobertura na documentacao anterior.

---

## Rastreabilidade

```
EPIC-M011-001 (Configuracao da Captacao)
├── US-M011-001 Criar Configuracao de Captacao
├── US-M011-002 Definir Cronograma da Captacao
├── US-M011-035 Adiar Etapa do Cronograma da Captacao
├── US-M011-003 Visualizar Total Financeiro da Captacao
├── US-M011-004 Publicar Configuracao de Captacao
├── US-M011-011 Definir Regras de Submissao
├── US-M011-012 Definir Requisitos do Proponente
├── US-M011-013 Configurar Rubricas e Subrubricas Permitidas  -> detalhado em EPIC-M011-008
├── US-M011-014 Configurar Versoes de Bolsas Permitidas
├── US-M011-029 Definir Categorias de projeto
├── US-M011-030 Configurar faixas
├── US-M011-031 Configurar Documentos Exigidos do Proponente
├── US-M011-032 Definir Prestacoes Exigidas
├── US-M011-033 Configurar Aportes Financeiros da Captacao
└── US-M011-034 Definir Proponentes Escolhidos

EPIC-M011-002 (Selecao de Formularios)  <- depende de EPIC-M011-001, M021
├── US-M011-005 Selecionar Formulario de Submissao
├── US-M011-006 Selecionar Formulario de Avaliacao Ad Hoc
├── US-M011-007 Selecionar Formulario de Revisao de Resultado
├── US-M011-015 Selecionar Formulario de Anexos
└── US-M011-016 Consultar Versao Selecionada do Formulario

EPIC-M011-003 (Gestao de Pool de Revisores Ad Hoc)  <- depende de EPIC-M011-001
├── US-M011-008 Selecionar Pool de Revisores
├── US-M011-009 Definir Regras de Distribuicao
└── US-M011-010 Listar e Consultar Revisores

EPIC-M011-004 (Recebimento de Propostas)  <- depende de EPIC-M011-001, EPIC-M011-002
├── US-M011-017 Submeter Proposta (proponente)
├── US-M011-018 Listar e Filtrar Propostas
└── US-M011-019 Consultar Detalhes da Proposta

EPIC-M011-005 (Avaliacao Documental e Ad Hoc)  <- depende de EPIC-M011-003, EPIC-M011-004
├── US-M011-020 Conferir Documentacao e Distribuir Propostas
├── US-M011-021 Avaliar Proposta (revisor)
└── US-M011-022 Consolidar Pareceres e Classificar Propostas

EPIC-M011-006 (Revisao de Resultado)  <- depende de EPIC-M011-005
├── US-M011-023 Submeter Revisao de Resultado (proponente)
├── US-M011-024 Analisar Revisao de Resultado
└── US-M011-025 Decidir sobre Revisao

EPIC-M011-007 (Publicacao de Resultado)  <- depende de EPIC-M011-005, EPIC-M011-006
├── US-M011-026 Publicar Resultado Preliminar
├── US-M011-027 Publicar Resultado Final e Disponibilizar Aprovados ao M022
└── US-M011-028 Dashboard KPIs da Captacao

EPIC-M011-008 (Rubricas Permitidas da Captacao)  <- depende de M008, EPIC-M011-001
├── US-M011-036 Selecionar Rubricas Permitidas
├── US-M011-037 Configurar Subrubricas Permitidas
├── US-M011-038 Definir Limites por Rubrica
├── US-M011-039 Definir Restricoes e Comprovantes por Rubrica
└── US-M011-040 Validar Orcamento da Proposta contra Rubricas Permitidas

EPIC-M011-009 (Gestao do Fomento)  <- depende de M010, M008; pre-requisito de todos os demais EPICs do M011
├── US-M011-042 Criar Fomento
├── US-M011-043 Configurar Aportes do Fomento
├── US-M011-044 Configurar faixas do Fomento
├── US-M011-045 Aprovar Fomento
├── US-M011-046 Registrar aporte aditivo no Fomento
├── US-M011-047 Registrar Remanejamento entre Faixas
├── US-M011-048 Interromper e Retomar Fomento
├── US-M011-049 Encerrar Fomento
├── US-M011-050 Conclusao Automatica do Fomento pelo Sistema
└── US-M011-051 Registrar Resultados Esperados do Fomento

EPIC-M011-010 (Controles Operacionais da Captacao)  <- depende de EPIC-M011-001, EPIC-M011-007
├── US-M011-052 Pausar Processo de Selecao
├── US-M011-053 Retomar Processo de Selecao com Validacao de Datas
├── US-M011-054 Bloquear Operacoes durante Pausa
├── US-M011-055 Encerramento Automatico por Expiracao
└── US-M011-056 Cancelamento Administrativo da Captacao
```

## Observacoes do Prototipo Backoffice

- A tela principal de Captacao abre na aba **Captacoes**.
- A ordem das abas operacionais e: **Captacoes**, **Propostas**, **Avaliacao**, **Revisao**, **Resultado final** e **Dashboard**.
- O **Dashboard** e uma visao consolidada de acompanhamento e deve permanecer como ultima aba, apos o fluxo operacional.
- A biblioteca/criacao de **Formularios** foi posicionada em **Configuracoes**, junto com outros cadastros estruturantes consumidos pela captacao.
