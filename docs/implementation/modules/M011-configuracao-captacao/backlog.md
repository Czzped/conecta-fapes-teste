# Sub-Backlog: M011 - Configuracao de Captacao

[<- Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Antes que um edital possa receber propostas, a agencia de fomento precisa configura-lo: definir cronograma, vincular programa e parceria quando aplicavel, criar formularios de submissao e avaliacao, registrar revisores ad hoc e definir parametros de fomento. Atualmente esse processo e realizado por meio de documentos manuais, sem templates nem padronizacao, o que gera inconsistencias entre editais e retrabalho frequente. Este modulo visa resolver esse problema ao permitir a configuracao completa de editais de forma estruturada e padronizada. O sucesso sera medido pela reducao do tempo de configuracao de editais e pela eliminacao de inconsistencias entre editais publicados.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M011-001 | Configuracao do Edital | UC01 | Must | To Do | [EPIC-M011-001](epics/EPIC-M011-001.md) |
| EPIC-M011-002 | Gestao de Formularios | UC02 | Must | To Do | [EPIC-M011-002](epics/EPIC-M011-002.md) |
| EPIC-M011-003 | Gestao de Revisores Ad Hoc | UC03 | Must | To Do | [EPIC-M011-003](epics/EPIC-M011-003.md) |

---

## Rastreabilidade

```
EPIC-M011-001 (Configuracao do Edital)
├── US-M011-001 Criar Edital
├── US-M011-002 Definir Cronograma
├── US-M011-003 Configurar Parametros de Fomento
└── US-M011-004 Publicar Edital

EPIC-M011-002 (Gestao de Formularios)  <- depende de EPIC-M011-001
├── US-M011-005 Criar Formulario de Submissao
├── US-M011-006 Criar Formulario de Avaliacao
└── US-M011-007 Versionar Formulario

EPIC-M011-003 (Gestao de Revisores Ad Hoc)  <- depende de EPIC-M011-001
├── US-M011-008 Cadastrar Revisor
├── US-M011-009 Associar Revisor ao Edital
└── US-M011-010 Listar e Consultar Revisores
```
