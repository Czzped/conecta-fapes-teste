# Sub-Backlog: M003 - Gestao de Iniciativas Captadas

[← Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Apos a contratacao, a agencia precisa gerenciar os dados operacionais das iniciativas captadas: edital de origem, projetos contratados, cotas de bolsa e alocacoes de bolsistas. Este modulo concentra o ownership operacional das iniciativas pos-contratacao, fornecendo visualizacoes integradas para apoio a decisao.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M003-001 | Registrar Edital Operacional | RN01, RN07 | Must | Done | [EPIC-M003-001](epics/EPIC-M003-001.md) |
| EPIC-M003-002 | Registrar Projetos e Coordenacao | RN02, RN03, RN06 | Must | Done | [EPIC-M003-002](epics/EPIC-M003-002.md) |
| EPIC-M003-003 | Gestao de Cotas de Edital | RN04 | Must | Done | [EPIC-M003-003](epics/EPIC-M003-003.md) |
| EPIC-M003-004 | Alocacao Operacional de Bolsistas | RN05, RN06 | Must | Done | [EPIC-M003-004](epics/EPIC-M003-004.md) |
| EPIC-M003-005 | Visao Operacional Consolidada | RN01-RN05 | Must | Done | [EPIC-M003-005](epics/EPIC-M003-005.md) |

> **Nota:** Estes EPICs foram derivados das 5 operacoes publicas do [contrato.md](contrato.md). As entidades (Edital, Projeto, CotaEdital, AlocacaoBolsista) ja existem no codigo e sao consumidas por M004, M009, M012-M015 e pelo Portal Coordenador.

> **Nota (80%):** EPICs implementados e em producao via Portal Admin (EPA-02) e Portal Coordenador (EP-06/07/08). Pendencias: (1) integracao com M010 (Programa/Parceria) ainda nao disponivel — US-M003-003 "Vincular Edital a Programa/Parceria" depende de M010 que esta em desenvolvimento; (2) Sprint-004 planeja "Testar Gestao de Editais com usuarios" e "Escalonamento de Projetos".

---

## Rastreabilidade

```
EPIC-M003-001 (Registrar Edital Operacional)
├── US-M003-001 Criar Edital com Area Tecnica
├── US-M003-002 Atualizar Edital Operacional
└── US-M003-003 Vincular Edital a Programa/Parceria

EPIC-M003-002 (Registrar Projetos e Coordenacao)  <- depende de EPIC-M003-001
├── US-M003-004 Criar Projeto vinculado a Edital
├── US-M003-005 Registrar Coordenador do Projeto
└── US-M003-006 Substituir Coordenador com Justificativa

EPIC-M003-003 (Gestao de Cotas de Edital)  <- depende de EPIC-M003-001
├── US-M003-007 Cadastrar Cotas por VersaoNivel
└── US-M003-008 Consultar Disponibilidade de Cotas

EPIC-M003-004 (Alocacao Operacional de Bolsistas)  <- depende de EPIC-M003-002, EPIC-M003-003
├── US-M003-009 Registrar Alocacao consumindo Cota
├── US-M003-010 Vincular Orientador e Bolsista
└── US-M003-011 Cancelar Alocacao com Justificativa

EPIC-M003-005 (Visao Operacional Consolidada)  <- transversal
├── US-M003-012 Consultar Visao do Edital (projetos, cotas, alocacoes)
├── US-M003-013 Consultar Projetos do Edital
└── US-M003-014 Consultar Bolsistas do Projeto
```
