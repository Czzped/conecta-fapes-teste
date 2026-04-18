# Sub-Backlog: M014 - Prestacao de Contas

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Coordenadores devem submeter documentos fiscais que comprovem a aplicacao dos recursos do projeto. A agencia de fomento analisa e pode rejeitar documentos, e a SECONT realiza auditorias. Atualmente, esse processo e inteiramente baseado em papel e e-mail, sem fluxo digital, sem rastreabilidade e sem reconciliacao automatica entre extrato bancario e despesas declaradas. Este modulo visa resolver esse problema ao digitalizar todo o ciclo de prestacao de contas, desde a importacao do extrato bancario ate a auditoria da SECONT. O sucesso sera medido pela reducao do tempo medio de analise da prestacao de contas e pela taxa de prestacoes aprovadas na primeira submissao.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

| ID | Titulo | Requisito | Prioridade | Status | Documento |
|----|--------|-----------|------------|--------|-----------|
| EPIC-M014-001 | Submissao de Prestacao de Contas | UC01 | Must | Done | [EPIC-M014-001](epics/EPIC-M014-001.md) |
| EPIC-M014-002 | Analise de Prestacao de Contas | UC02 | Must | To Do (Pos-MVP) | [EPIC-M014-002](epics/EPIC-M014-002.md) |
| EPIC-M014-003 | Contestacao e Auditoria | UC03 | Must | To Do (Pos-MVP) | [EPIC-M014-003](epics/EPIC-M014-003.md) |
| EPIC-M014-004 | Justificativas de Despesa (NF, Diaria, Invoice) | UC04 | Must | Done | [EPIC-M014-004](epics/EPIC-M014-004.md) |
| EPIC-M014-005 | Documentos Fiscais e Integracao SERPRO | UC05 | Must | Done | [EPIC-M014-005](epics/EPIC-M014-005.md) |
| EPIC-M014-006 | Itens de Documento Fiscal e Associacao Contabil | UC06 | Must | Done | [EPIC-M014-006](epics/EPIC-M014-006.md) |
| EPIC-M014-007 | Orcamentos de Fornecedor | UC07 | Must | Done | [EPIC-M014-007](epics/EPIC-M014-007.md) |
| EPIC-M014-008 | Fluxo de Submissao e Analise (V1) | UC08 | Must | Done | [EPIC-M014-008](epics/EPIC-M014-008.md) |
| EPIC-M014-009 | Prazos Temporais da Prestacao (30d submissao + 30d reposicao) | UC09 | Must | To Do (Pos-MVP) | [EPIC-M014-009](epics/EPIC-M014-009.md) |

> **Nota:** Os EPICs do legado EP-01 a EP-04 (Contas Bancarias, Orcamento, Contas Contabeis, Transacoes Financeiras) estao implementados no backend `ConectaFapes.PrestacaoContas` mas pertencem conceitualmente a M016 (Contabilidade e Financeiro). Ver [debito tecnico](#debito-tecnico).

---

## Rastreabilidade

```
EPIC-M014-001 (Submissao de Prestacao de Contas)
├── US-M014-001 Importar Extrato Bancario
├── US-M014-002 Submeter PC de Servico
├── US-M014-003 Submeter PC de Diarias
└── US-M014-004 Submeter PC de Passagens

EPIC-M014-002 (Analise de Prestacao de Contas)  <- depende de EPIC-M014-001
├── US-M014-005 Analisar Documentos
├── US-M014-006 Recusar com Justificativa
└── US-M014-007 Aprovar Prestacao

EPIC-M014-003 (Contestacao e Auditoria)  <- depende de EPIC-M014-002
├── US-M014-008 Contestar Recusa
├── US-M014-009 Analisar Contestacao
└── US-M014-010 Auditar Prestacao SECONT

EPIC-M014-004 (Justificativas de Despesa)  <- depende de EPIC-M014-001
├── US-M014-011 Criar Justificativa por NF
├── US-M014-012 Criar Justificativa por Diaria
├── US-M014-013 Criar Justificativa por Invoice
└── US-M014-014 Listar e Editar Justificativas

EPIC-M014-005 (Documentos Fiscais e SERPRO)  <- depende de EPIC-M014-004
├── US-M014-015 Processar NF-e via SERPRO
├── US-M014-016 Processar NFS-e por Upload
├── US-M014-017 Detectar Tipo de Arquivo (XML/PDF)
└── US-M014-018 Extrair Chave de Acesso

EPIC-M014-006 (Itens de Documento Fiscal)  <- depende de EPIC-M014-005
├── US-M014-019 Vincular Item a Conta Contabil
├── US-M014-020 Desvincular Item de Conta Contabil
└── US-M014-021 Consultar Impacto no Saldo da Conta

EPIC-M014-007 (Orcamentos de Fornecedor)  <- depende de EPIC-M014-004
├── US-M014-022 Criar Orcamentos em Lote
├── US-M014-023 Upload de PDF do Orcamento
├── US-M014-024 Selecionar Orcamento Vencedor
└── US-M014-025 Listar e Editar Orcamentos

EPIC-M014-008 (Fluxo de Submissao e Analise V1)  <- depende de todos os anteriores
├── US-M014-026 Submeter Prestacao (RASCUNHO → EM_ANALISE)
├── US-M014-027 Aprovar Prestacao (EM_ANALISE → FINALIZADO)
├── US-M014-028 Negar Prestacao (EM_ANALISE → NEGADO)
└── US-M014-029 Solicitar Revisao (EM_ANALISE → REVISAO)

EPIC-M014-009 (Prazos Temporais)  [Pos-MVP]  <- depende de EPIC-M014-008
├── US-M014-030 Validar Prazo de Submissao (30 dias)
├── US-M014-031 Validar e Registrar Reposicao de Valor (30 dias)
└── US-M014-032 Notificar Coordenador dos Prazos em Aberto
```

## Pos-MVP

Os EPICs abaixo tratam de escopo **fora do backend atual** (ver [README — Escopo Pos-MVP](README.md#escopo-pos-mvp-fora-do-backend-atual)). Estao documentados com User Stories e Gherkin mas aguardam decisao formal para entrar em desenvolvimento.

| EPIC | Tema | Itens cobertos |
|------|------|----------------|
| [EPIC-M014-002](epics/EPIC-M014-002.md) | Analise de Prestacao de Contas (recusa com justificativa, prazo 15d) | Fluxo formal de recusa, gatilho de contestacao |
| [EPIC-M014-003](epics/EPIC-M014-003.md) | Contestacao e Auditoria SECONT | Contestacao (15d), reanalise, auditoria SECONT, 6 estados adicionais |
| [EPIC-M014-009](epics/EPIC-M014-009.md) | Prazos Temporais | Prazo 30d para submissao, prazo 30d para reposicao, notificacoes T-7/T-3/T-0 |
| DT-M014-002 | Maquina de 11 estados | Transversal — infraestrutura que habilita EPIC-002 + -003 |

---

## Debito Tecnico

Itens identificados na reconciliacao com a documentacao legada (`docs/deprecated/prestacao-de-contas/`).

### Prioridade Alta

| ID | Titulo | Status | Impacto |
|----|--------|--------|---------|
| DT-M014-001 | Entidades financeiras (ContaBancaria, Orcamento, ContaContabil, TransacaoFinanceira) estao implementadas no backend M014 mas pertencem conceitualmente a M016/M013 | To Do | Arquitetura, separacao de bounded contexts |
| DT-M014-002 | Maquina de estados implementada (5 estados: RASCUNHO, EM_ANALISE, REVISAO, FINALIZADO, NEGADO) diverge da spec (11 estados com contestacao e auditoria SECONT) — alinhar progressivamente | To Do | modelo-comportamental.md |

### Prioridade Media

| ID | Titulo | Status | Impacto |
|----|--------|--------|---------|
| DT-M014-003 | Backend e um projeto separado (ConectaFapes.PrestacaoContas.*) com AppDbContext proprio — documentar como decisao arquitetural ou planejar unificacao | To Do | architecture/ |
| DT-M014-004 | Integrar SERPRO como dependencia formal no contrato do modulo | To Do | contrato.md |
