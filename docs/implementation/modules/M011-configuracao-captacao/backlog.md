# Sub-Backlog: M011 - Configuracao de Captacao

[<- Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

A agencia de fomento publica editais para selecionar e financiar projetos. O ciclo completo de captacao envolve: configuracao do edital (cronograma, formularios, parametros, bolsas, requisitos), recebimento de inscricoes, avaliacao de merito por revisores, analise de recursos e publicacao do resultado. Atualmente esse processo e manual, sem padronizacao, gerando inconsistencias e retrabalho. Este modulo cobre o ciclo de captacao de ponta a ponta.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M011-001 | Configuracao do Edital | UC01 | Must | In Progress | [EPIC-M011-001](epics/EPIC-M011-001.md) |
| EPIC-M011-002 | Gestao de Formularios | UC02 | Must | To Do | [EPIC-M011-002](epics/EPIC-M011-002.md) |
| EPIC-M011-003 | Gestao de Revisores Ad Hoc | UC03 | Must | To Do | [EPIC-M011-003](epics/EPIC-M011-003.md) |
| EPIC-M011-004 | Gestao de Inscricoes | UC04 | Must | To Do | [EPIC-M011-004](epics/EPIC-M011-004.md) |
| EPIC-M011-005 | Avaliacao de Merito | UC05 | Must | To Do | [EPIC-M011-005](epics/EPIC-M011-005.md) |
| EPIC-M011-006 | Gestao de Recursos Pre-Award | UC06 | Must | To Do | [EPIC-M011-006](epics/EPIC-M011-006.md) |
| EPIC-M011-007 | Publicacao de Resultado | UC07 | Must | To Do | [EPIC-M011-007](epics/EPIC-M011-007.md) |

> **Nota:** EPICs 004-007 foram identificados na [analise do prototipo backoffice](specifications/analise-prototipo-captacao.md) — funcionalidades presentes no prototipo sem cobertura na documentacao anterior.

---

## Rastreabilidade

```
EPIC-M011-001 (Configuracao do Edital)
├── US-M011-001 Criar Edital (identificacao, tipo captacao, setor, fomento)
├── US-M011-002 Definir Cronograma
├── US-M011-003 Configurar Parametros de Fomento (faixas, orcamento, origens recurso)
├── US-M011-004 Publicar Edital
├── US-M011-011 Definir Regras de Submissao
├── US-M011-012 Definir Requisitos do Coordenador
├── US-M011-013 Configurar Rubricas Permitidas
└── US-M011-014 Configurar Bolsas da Captacao

EPIC-M011-002 (Gestao de Formularios)  <- depende de EPIC-M011-001
├── US-M011-005 Criar Formulario de Submissao
├── US-M011-006 Criar Formulario de Avaliacao
├── US-M011-007 Versionar Formulario
├── US-M011-015 Criar Formulario de Recurso
└── US-M011-016 Criar Formulario Personalizado

EPIC-M011-003 (Gestao de Revisores Ad Hoc)  <- depende de EPIC-M011-001
├── US-M011-008 Cadastrar Revisor
├── US-M011-009 Associar Revisor ao Edital
└── US-M011-010 Listar e Consultar Revisores

EPIC-M011-004 (Gestao de Inscricoes)  <- depende de EPIC-M011-001, EPIC-M011-002
├── US-M011-017 Submeter Proposta (proponente)
├── US-M011-018 Listar e Filtrar Inscricoes
└── US-M011-019 Consultar Detalhes da Inscricao

EPIC-M011-005 (Avaliacao de Merito)  <- depende de EPIC-M011-003, EPIC-M011-004
├── US-M011-020 Distribuir Propostas para Revisores
├── US-M011-021 Avaliar Proposta (revisor)
└── US-M011-022 Consolidar Notas de Avaliacao

EPIC-M011-006 (Gestao de Recursos Pre-Award)  <- depende de EPIC-M011-005
├── US-M011-023 Submeter Recurso (proponente)
├── US-M011-024 Analisar Recurso
└── US-M011-025 Decidir sobre Recurso

EPIC-M011-007 (Publicacao de Resultado)  <- depende de EPIC-M011-005, EPIC-M011-006
├── US-M011-026 Publicar Resultado Preliminar
├── US-M011-027 Publicar Resultado Final
└── US-M011-028 Dashboard KPIs da Captacao
```
