# Sub-Backlog: M004 - Pagamento de Bolsistas

[← Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

A geracao de folhas de pagamento e a comunicacao com Banestes e BANDES sao feitas por processos manuais, sujeitos a atrasos e erros que impactam diretamente os bolsistas. Este modulo resolve esse problema ao automatizar a geracao de folhas de pagamento e operacionalizar o pagamento via integracao direta com Banestes e BANDES, alem de gerar os documentos necessarios para anexacao no EDOCS. O sucesso sera medido pelo percentual de pagamentos processados no prazo e pela reducao de erros em folha.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M004-001 | Definir Calendario das Folhas | UC05 | Must | Done | [EPIC-M004-001](epics/EPIC-M004-001.md) |
| EPIC-M004-002 | Liberar Editais da Area para Pagamento | UC06 | Must | Done | [EPIC-M004-002](epics/EPIC-M004-002.md) |
| EPIC-M004-003 | Gerenciar Folhas de Pagamento | UC07 | Must | Done | [EPIC-M004-003](epics/EPIC-M004-003.md) |
| EPIC-M004-004 | Autorizar Pagamento da Folha | UC08 | Must | Done | [EPIC-M004-004](epics/EPIC-M004-004.md) |
| EPIC-M004-005 | Bonus de Pagamento | UC09 | Must | Done | [EPIC-M004-005](epics/EPIC-M004-005.md) |
| EPIC-M004-006 | Geracao de Remessas Bancarias | UC10 | Must | Done | [EPIC-M004-006](epics/EPIC-M004-006.md) |
| EPIC-M004-007 | Processamento de Retorno Bancario | UC11 | Must | Done | [EPIC-M004-007](epics/EPIC-M004-007.md) |
| EPIC-M004-008 | Encaminhamento de Pagamento (Bandes) | UC12 | Must | Done | [EPIC-M004-008](epics/EPIC-M004-008.md) |
| EPIC-M004-009 | Guia de Liberacao (PDF) | UC13 | Must | Done | [EPIC-M004-009](epics/EPIC-M004-009.md) |
| EPIC-M004-010 | Relatorios e Relacoes de Pagamento | UC14 | Must | Done | [EPIC-M004-010](epics/EPIC-M004-010.md) |
| EPIC-M004-011 | Monitoramento de Processos de Remessa | UC15 | Must | Done | [EPIC-M004-011](epics/EPIC-M004-011.md) |
| EPIC-M004-012 | Visualizacoes e Consultas | UC16 | Must | Done | [EPIC-M004-012](epics/EPIC-M004-012.md) |

---

## Rastreabilidade

```
EPIC-M004-001 (Definir Calendario das Folhas)
├── US-M004-001 Visualizar Calendario Anual
└── US-M004-002 Definir Marcos da Folha

EPIC-M004-002 (Liberar Editais da Area para Pagamento)  <- depende de EPIC-M004-001
├── US-M004-003 Visualizar Liberacao de Editais
└── US-M004-004 Liberar Editais para Pagamento

EPIC-M004-003 (Gerenciar Folhas de Pagamento)  <- depende de EPIC-M004-001, EPIC-M004-002
├── US-M004-005 Monitorar Liberacoes das Areas
├── US-M004-006 Gerar Folha de Pagamento
├── US-M004-007 Cancelar Folha de Pagamento
├── US-M004-008 Visualizar Previa de Folha Normal
├── US-M004-009 Visualizar Liberacoes da Area
├── US-M004-010 Visualizar Projetos do Edital
└── US-M004-011 Visualizar Bolsistas do Projeto

EPIC-M004-004 (Autorizar Pagamento da Folha)  <- depende de EPIC-M004-003
├── US-M004-012 Listar Folhas de Pagamento
├── US-M004-013 Visualizar Folha de Pagamento
├── US-M004-014 Visualizar Folha com Detalhes da Area Tecnica
└── US-M004-015 Decidir sobre Autorizacao da Folha

EPIC-M004-005 (Bonus de Pagamento)  <- depende de EPIC-M004-001
├── US-M004-016 Criar Bonus de Pagamento
├── US-M004-017 Editar Bonus de Pagamento
├── US-M004-018 Excluir Bonus de Pagamento
└── US-M004-019 Listar Bonus de Pagamento

EPIC-M004-006 (Geracao de Remessas Bancarias)  <- depende de EPIC-M004-004
├── US-M004-020 Gerar Remessa de Cadastro de Bolsistas
├── US-M004-021 Gerar Remessa de Pagamento
└── US-M004-022 Fazer Download de Remessa

EPIC-M004-007 (Processamento de Retorno Bancario)  <- depende de EPIC-M004-006
├── US-M004-023 Processar Retorno de Remessa de Cadastro
├── US-M004-024 Processar Retorno de Remessa de Pagamento
└── US-M004-025 Upload de Arquivo de Retorno

EPIC-M004-008 (Encaminhamento de Pagamento Bandes)  <- depende de EPIC-M004-004
└── US-M004-026 Encaminhar Pagamentos ao Bandes

EPIC-M004-009 (Guia de Liberacao PDF)  <- depende de EPIC-M004-003
├── US-M004-027 Gerar Guia de Liberacao Banestes
├── US-M004-028 Gerar Guia de Liberacao Bandes
└── US-M004-029 Consultar Guias de Liberacao

EPIC-M004-010 (Relatorios e Relacoes de Pagamento)  <- depende de EPIC-M004-003
├── US-M004-030 Gerar Relacao de Pagamento por Edital
├── US-M004-031 Gerar Relacao de Pagamento por Bolsista
└── US-M004-032 Exportar Folha em CSV

EPIC-M004-011 (Monitoramento de Processos de Remessa)  <- depende de EPIC-M004-006, EPIC-M004-007
├── US-M004-033 Listar Processos de Remessa
├── US-M004-034 Consultar Detalhes do Processo
└── US-M004-035 Reprocessar Remessa com Erro

EPIC-M004-012 (Visualizacoes e Consultas)  <- transversal
├── US-M004-036 Consultar Bancos
├── US-M004-037 Consultar Modalidades e Versoes
├── US-M004-038 Consultar Valores Pagos por Folha
└── US-M004-039 Consultar Historico de Folhas
```

---

## Debito Tecnico

Itens identificados na [analise de DDD e modularidade](specifications/analise-ddd-modularidade.md). Cada item referencia o problema correspondente no documento de analise.

### Prioridade Alta

| ID | Titulo | Problema | Status | Impacto |
|----|--------|----------|--------|---------|
| DT-M004-001 | Identificar Aggregate Roots e fronteiras transacionais | [P2](specifications/analise-ddd-modularidade.md#p2-aggregates-nao-identificados) | To Do | modelo-estrutural.md |
| DT-M004-002 | Resolver ownership de AlocacaoBolsista (entidade local vs Shared Kernel) | [P1](specifications/analise-ddd-modularidade.md#p1-escrita-em-entidades-fora-do-escopo) | To Do | modelo-estrutural.md, contrato.md, M003/M009 |
| DT-M004-003 | Formalizar Domain Events no contrato | [P6](specifications/analise-ddd-modularidade.md#p6-ausencia-de-domain-events-formalizados) | To Do | contrato.md |

### Prioridade Media

| ID | Titulo | Problema | Status | Impacto |
|----|--------|----------|--------|---------|
| DT-M004-004 | Remover ciclo de vida de AlocacaoBolsista do modelo comportamental | [P3](specifications/analise-ddd-modularidade.md#p3-modelo-comportamental-inclui-alocacaobolsista) | To Do | modelo-comportamental.md |
| DT-M004-005 | Classificar Value Objects (DecisaoLiberacao, DecisaoFolha, Erros) | [P4](specifications/analise-ddd-modularidade.md#p4-value-objects-nao-identificados) | To Do | modelo-estrutural.md |
| DT-M004-006 | Abstrair referencias a infraestrutura no modelo de dominio | [P5](specifications/analise-ddd-modularidade.md#p5-vazamento-de-infraestrutura-no-dominio) | To Do | modelo-estrutural.md, contrato.md |

### Prioridade Baixa

| ID | Titulo | Problema | Status | Impacto |
|----|--------|----------|--------|---------|
| DT-M004-007 | Marcar Usuario como fora do escopo ou criar VO local | [P7](specifications/analise-ddd-modularidade.md#p7-usuario-replicado-como-entidade-completa) | To Do | modelo-estrutural.md |
| DT-M004-008 | Documentar relacao de Contratante com Remessa | [P8](specifications/analise-ddd-modularidade.md#p8-contratante-orfao-no-modelo) | To Do | modelo-estrutural.md |
| DT-M004-009 | Documentar estrategia de campos computados em EditalCompetencia | [P9](specifications/analise-ddd-modularidade.md#p9-campos-computados-sem-documentacao-de-estrategia) | To Do | modelo-estrutural.md |
