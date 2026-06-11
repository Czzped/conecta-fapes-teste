# Sub-Backlog: M009 - Gestao Bolsa Pesquisa

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

O acompanhamento do ciclo de vida das bolsas -- desde a alocacao, passando pela vigencia e renovacao, ate o encerramento -- e feito de forma descentralizada e sem visao integrada, dificultando o controle e gerando atrasos nos processos. Este modulo resolve esse problema ao prover uma gestao integrada do ciclo de vida das bolsas de pesquisa, da alocacao ao encerramento, em uma unica plataforma. O sucesso sera medido pela taxa de bolsas com acompanhamento em dia e pelo tempo medio de processamento de renovacao.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M009-001 | Indicacao de Bolsista | UC01 | Must | In Progress | [EPIC-M009-001](epics/EPIC-M009-001.md) |
| EPIC-M009-002 | Avaliacao Documental | UC02 | Must | In Progress | [EPIC-M009-002](epics/EPIC-M009-002.md) |
| EPIC-M009-003 | Formalizacao e Implementacao de Bolsa | UC03 | Must | To Do | [EPIC-M009-003](epics/EPIC-M009-003.md) |
| EPIC-M009-004 | Ciclo de Vida da Bolsa | UC04 | Must | To Do | [EPIC-M009-004](epics/EPIC-M009-004.md) |
| EPIC-M009-005 | Perfil Academico na Aprovacao de Bolsa | UC05 | Must | To Do | [EPIC-M009-005](epics/EPIC-M009-005.md) |

---

## Rastreabilidade

```
EPIC-M009-001 (Indicacao de Bolsista)
├── US-M009-001 Indicar Bolsista
├── US-M009-002 Listar e Consultar Indicacoes
└── US-M009-003 Cancelar Indicacao

EPIC-M009-002 (Avaliacao Documental)  <- depende de EPIC-M009-001
├── US-M009-004 Assinar Termo de Aceite
├── US-M009-005 Enviar Documentos
├── US-M009-006 Avaliar Documentacao
└── US-M009-007 Solicitar Reenvio de Documentos

EPIC-M009-003 (Formalizacao e Implementacao)  <- depende de EPIC-M009-002
├── US-M009-008 Gerar Termo de Compromisso
├── US-M009-009 Assinar Termo de Compromisso
├── US-M009-010 Registrar Publicacao no Diario Oficial
└── US-M009-011 Implementar Bolsa

EPIC-M009-004 (Ciclo de Vida da Bolsa)  <- depende de EPIC-M009-003
├── US-M009-012 Renovar Bolsa
├── US-M009-013 Suspender Bolsa
├── US-M009-014 Reativar Bolsa
├── US-M009-015 Encerrar Bolsa
└── US-M009-016 Alertar Vencimento de Bolsa

EPIC-M009-005 (Perfil Academico na Aprovacao de Bolsa)  <- depende de EPIC-M009-002, M024
└── US-M009-017 Exibir dados academicos do pesquisador na tela de aprovacao de bolsa

```

