# Sub-Backlog: M004 - Pagamento de Bolsistas

[← Voltar ao Backlog Central](../../backlog-product.md)

## Sobre o Modulo

A geracao de folhas de pagamento e a comunicacao com Banestes e BANDES sao feitas por processos manuais, sujeitos a atrasos e erros que impactam diretamente os bolsistas. Este modulo resolve esse problema ao automatizar a geracao de folhas de pagamento e operacionalizar o pagamento via integracao direta com Banestes e BANDES, alem de gerar os documentos necessarios para anexacao no EDOCS. O sucesso sera medido pelo percentual de pagamentos processados no prazo e pela reducao de erros em folha.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M004-001 | Definir Calendario das Folhas | UC05 | Must | To Do | [EPIC-M004-001](epics/EPIC-M004-001.md) |
| EPIC-M004-002 | Liberar Editais da Area para Pagamento | UC06 | Must | To Do | [EPIC-M004-002](epics/EPIC-M004-002.md) |
| EPIC-M004-003 | Gerenciar Folhas de Pagamento | UC07 | Must | To Do | [EPIC-M004-003](epics/EPIC-M004-003.md) |
| EPIC-M004-004 | Autorizar Pagamento da Folha | UC08 | Must | To Do | [EPIC-M004-004](epics/EPIC-M004-004.md) |

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
```

