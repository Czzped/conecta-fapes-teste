# Sub-Backlog: M014 - Prestacao de Contas

[<< Voltar ao Backlog Central](../../../management/backlog-product.md)

## Sobre o Modulo

Coordenadores devem submeter documentos fiscais que comprovem a aplicacao dos recursos do projeto. A agencia de fomento analisa e pode rejeitar documentos, e a SECONT realiza auditorias. Atualmente, esse processo e inteiramente baseado em papel e e-mail, sem fluxo digital, sem rastreabilidade e sem reconciliacao automatica entre movimentos bancarios e despesas declaradas. Este modulo visa resolver esse problema ao digitalizar todo o ciclo de prestacao de contas, desde as importacoes de projeto, orcamento planejado e movimentos CNAB 240 ate a auditoria da SECONT. O sucesso sera medido pela reducao do tempo medio de analise da prestacao de contas e pela taxa de prestacoes aprovadas na primeira submissao.

Especificacao de referencia: [README.md](README.md)

---

## Backlog

Status: **Done** = implementado no backend atual. **To Do (Pos-MVP)** = documentado com US + Gherkin mas fora do backend; aguarda decisao formal para entrar em desenvolvimento (ver [README — Escopo Pos-MVP](README.md#escopo-pos-mvp-fora-do-backend-atual)).

| ID | Titulo | Requisito | Prioridade | Status | Observacoes | Documento |
|----|--------|-----------|------------|--------|-------------|-----------|
| EPIC-M014-010 | Importacao | UC10 | Must | To Do | Importa projeto/conta, orcamento planejado e movimentos CNAB 240 | [EPIC-M014-010](epics/EPIC-M014-010.md) |
| EPIC-M014-001 | Submissao de Prestacao de Contas | UC01 | Must | To Do | Depende dos movimentos bancarios importados para submissao final | [EPIC-M014-001](epics/EPIC-M014-001.md) |
| EPIC-M014-002 | Analise de Prestacao de Contas | UC02 | Must | To Do (Pos-MVP) | Recusa com justificativa detalhada, gatilho de contestacao (15d) | [EPIC-M014-002](epics/EPIC-M014-002.md) |
| EPIC-M014-003 | Contestacao e Auditoria | UC03 | Must | To Do (Pos-MVP) | Contestacao (15d), reanalise, auditoria SECONT, 6 estados adicionais | [EPIC-M014-003](epics/EPIC-M014-003.md) |
| EPIC-M014-004 | Justificativas de Despesa (NF, Diaria, Invoice) | UC04 | Must | Done | — | [EPIC-M014-004](epics/EPIC-M014-004.md) |
| EPIC-M014-005 | Documentos Fiscais e Integracao SERPRO | UC05 | Must | Done | — | [EPIC-M014-005](epics/EPIC-M014-005.md) |
| EPIC-M014-006 | Itens de Documento Fiscal e Associacao a Rubricas | UC06 | Must | To Do | Inclui atualizacao do balanco do projeto apos NF | [EPIC-M014-006](epics/EPIC-M014-006.md) |
| EPIC-M014-007 | Orcamentos de Fornecedor | UC07 | Must | Done | — | [EPIC-M014-007](epics/EPIC-M014-007.md) |
| EPIC-M014-008 | Fluxo de Submissao e Analise (V1) | UC08 | Must | Done | Ciclo nuclear RASCUNHO → EM_ANALISE → {FINALIZADO \| NEGADO \| REVISAO} | [EPIC-M014-008](epics/EPIC-M014-008.md) |
| EPIC-M014-009 | Prazos Temporais da Prestacao | UC09 | Must | To Do (Pos-MVP) | Prazo 30d submissao + 30d reposicao + notificacoes T-7/T-3/T-0 | [EPIC-M014-009](epics/EPIC-M014-009.md) |
| EPIC-M014-011 | Prestacao de Contas de Diarias | UC11 | Must | To Do | Seleciona diaria do M003 ainda nao prestada, comprovante de pagamento e conciliacao | [EPIC-M014-011](epics/EPIC-M014-011.md) |
| EPIC-M014-012 | Prestacao de Contas de Passagens | UC12 | Must | To Do | Registra valor da passagem comprada, rubrica de passagem, comprovantes e conciliacao | [EPIC-M014-012](epics/EPIC-M014-012.md) |

> **Nota:** Os EPICs do legado EP-01 a EP-04 (Contas Bancarias, Orcamento, Rubricas Orcamentarias, Transacoes Financeiras) estao implementados no backend `ConectaFapes.PrestacaoContas` mas pertencem conceitualmente a M016 (Contabilidade e Financeiro). Ver [debito tecnico](#debito-tecnico). A maquina de estados expandida (11 estados) que habilita os EPICs Pos-MVP e rastreada em DT-M014-002.

---

## Rastreabilidade

```
EPIC-M014-010 (Importacao)
├── US-M014-037 Importar Projetos e Dados Bancarios
├── US-M014-036 Importar Orcamento Planejado do SIGFAPES
└── US-M014-001 Importar Movimentos Bancarios CNAB 240  <- depende de US-M014-036

EPIC-M014-001 (Submissao de Prestacao de Contas)  <- depende de EPIC-M014-010
├── US-M014-002 Submeter PC de Servico
├── US-M014-003 Submeter PC de Diarias
├── US-M014-004 Submeter PC de Passagens
├── US-M014-033 Submeter Compra de Produto por Nota Fiscal
├── US-M014-034 Submeter Compra de Produto sem Nota Fiscal
└── US-M014-049 Associar Estorno na Prestacao

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
├── US-M014-019 Vincular Item a Rubrica Orcamentaria
├── US-M014-020 Desvincular Item de Rubrica Orcamentaria
├── US-M014-021 Consultar Impacto no Saldo da Rubrica
└── US-M014-035 Apresentar Balanco do Projeto apos Nota Fiscal

EPIC-M014-007 (Orcamentos de Fornecedor)  <- depende de EPIC-M014-004
├── US-M014-022 Criar Orcamentos em Lote
├── US-M014-023 Upload de PDF do Orcamento
├── US-M014-024 Selecionar Orcamento Vencedor
└── US-M014-025 Listar e Editar Orcamentos

EPIC-M014-008 (Fluxo de Submissao e Analise V1)  <- depende de EPIC-M014-010 e dos EPICs M014-001 a M014-007
├── US-M014-026 Submeter Prestacao (RASCUNHO → EM_ANALISE)
├── US-M014-027 Aprovar Prestacao (EM_ANALISE → FINALIZADO)
├── US-M014-028 Negar Prestacao (EM_ANALISE → NEGADO)
└── US-M014-029 Solicitar Revisao (EM_ANALISE → REVISAO)

EPIC-M014-009 (Prazos Temporais)  [Pos-MVP]  <- depende de EPIC-M014-008
├── US-M014-030 Validar Prazo de Submissao (30 dias)
├── US-M014-031 Validar e Registrar Reposicao de Valor (30 dias)
└── US-M014-032 Notificar Coordenador dos Prazos em Aberto

EPIC-M014-011 (Prestacao de Contas de Diarias)  <- depende de M013, M003 Diarias, EPIC-M014-001
├── US-M014-039 Selecionar Diaria ainda nao Prestada
├── US-M014-040 Criar Diaria pelo Modal Compartilhado quando Ausente
├── US-M014-041 Validar Comprovante de Pagamento da Diaria
├── US-M014-042 Atualizar Impacto da Diaria no Saldo da Rubrica
└── US-M014-043 Separar Rubrica e Transacao Financeira na Prestacao de Diaria

EPIC-M014-012 (Prestacao de Contas de Passagens)  <- depende de M013, EPIC-M014-001
├── US-M014-044 Informar Valor da Passagem Comprada
├── US-M014-045 Validar Comprovantes de Passagem
├── US-M014-046 Selecionar Rubrica do Projeto para Passagem
├── US-M014-047 Separar Rubrica e Transacao Financeira na Prestacao de Passagem
└── US-M014-048 Atualizar Impacto da Passagem no Saldo da Rubrica
```

---

## Debito Tecnico

Itens identificados na reconciliacao com a documentacao legada (`docs/deprecated/prestacao-de-contas/`).

### Prioridade Alta

| ID | Titulo | Status | Impacto |
|----|--------|--------|---------|
| DT-M014-001 | Entidades financeiras (ContaBancaria, Orcamento, RubricaOrcamentaria, TransacaoFinanceira) estao implementadas no backend M014 mas pertencem conceitualmente a M016/M013 | To Do | Arquitetura, separacao de bounded contexts |
| DT-M014-002 | Maquina de estados implementada (5 estados: RASCUNHO, EM_ANALISE, REVISAO, FINALIZADO, NEGADO) diverge da spec (11 estados com contestacao e auditoria SECONT) — alinhar progressivamente | To Do | modelo-comportamental.md |
| DT-M014-005 | Renomear codigo e persistencia legados de `ContaContabil` para `RubricaOrcamentaria`, mantendo compatibilidade temporaria em migrations/adapters quando necessario | To Do | Linguagem ubiqua, consistencia entre dominio, modelo e backend |

### Prioridade Media

| ID | Titulo | Status | Impacto |
|----|--------|--------|---------|
| DT-M014-003 | Backend e um projeto separado (ConectaFapes.PrestacaoContas.*) com AppDbContext proprio — documentar como decisao arquitetural ou planejar unificacao | To Do | architecture/ |
| DT-M014-004 | Integrar SERPRO como dependencia formal no contrato do modulo | To Do | contrato.md |
