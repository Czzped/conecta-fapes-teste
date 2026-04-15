# Milestones — ConectaFAPES

Marcos de entrega do produto. Cada milestone agrupa domains que precisam estar concluidos juntos para representar uma capacidade entregavel significativa.

[← Voltar ao Management](README.md) | Domains e modulos definidos em [backlog-product.md](backlog-product.md)

---

## Indice

| # | Milestone | Domains | Status |
|---|-----------|---------|--------|
| MS-01 | [Base Operacional](#ms-01--base-operacional) | 01, 07 | Pendente |
| MS-02 | [Ciclo de Fomento Pre-Award](#ms-02--ciclo-de-fomento-pre-award) | 02, 03 | Pendente |
| MS-03 | [Ciclo de Fomento Post-Award](#ms-03--ciclo-de-fomento-post-award) | 04 | Pendente |
| MS-04 | [Financeiro](#ms-04--financeiro) | 05 | Parcial |
| MS-05 | [Inteligencia e Transparencia](#ms-05--inteligencia-e-transparencia) | 06 | Pendente |

---

## MS-01 — Base Operacional

Fundacao do sistema: identidades, cadastros mestres e migracao do legado.

| Domain | Descricao | Modulos |
|--------|-----------|---------|
| [01 Corporativo](../discovery/domains/01-corporativo.md) | IAM, Pessoas, Organizacoes, Cadastros Basicos, Modalidades de Bolsa | M001, M005, M006, M007, M008 |
| [07 Importacao SIGFAPES](../discovery/domains/07-importacao-sigfapes.md) | Migracao de editais, projetos, pessoas e pagamentos do legado | M002 |

> **Nota:** M005 (Autenticacao), M006 (Autorizacao) e M007 (API Gateway) ainda nao possuem documentacao de implementacao ("A definir" no backlog central). M008 (Cadastros Corporativos) possui spec completa.

---

## MS-02 — Ciclo de Fomento Pre-Award

Planejamento estrategico e fluxo completo de captacao de iniciativas.

| Domain | Descricao | Modulos |
|--------|-----------|---------|
| [02 Planejamento](../discovery/domains/02-planejamento.md) | Plano estrategico, parcerias, programas de fomento | M010 |
| [03 Fomento Pre-Award](../discovery/domains/03-fomento-pre-award.md) | Publicacao de edital, submissao, analise documental, merito, contratacao | M003, M011 |

---

## MS-03 — Ciclo de Fomento Post-Award

Execucao das iniciativas contratadas ate a finalizacao.

| Domain | Descricao | Modulos |
|--------|-----------|---------|
| [04 Fomento Post-Award](../discovery/domains/04-fomento-post-award.md) | Acompanhamento, resultados, orcamento, prestacao de contas, bolsistas, suspensao/finalizacao | M003, M009, M012, M013, M014, M015 |

> **Progresso:** M014 (Prestacao de Contas) esta 62% implementado (6/8 EPICs Done — submissao, justificativas, documentos fiscais, SERPRO, orcamentos de fornecedor e fluxo V1). Restam EPIC-M014-002 (Analise) e EPIC-M014-003 (Contestacao e Auditoria SECONT).

---

## MS-04 — Financeiro

Pagamentos, escrituracao e controle financeiro.

| Domain | Descricao | Modulos |
|--------|-----------|---------|
| [05 Financeiro](../discovery/domains/05-financeiro.md) | Pagamentos, contas bancarias, PLD, escrituracao | M004, M016, M017 |

> **Progresso:** M004 (Pagamento de Bolsistas) esta 100% implementado — calendario, liberacao, folhas, bonus, remessas, retornos, guias, relatorios e visualizacoes. Restam M016 (Contabilidade e Financeiro) e M017 (Prevencao a Lavagem de Dinheiro) para conclusao do milestone.

---

## MS-05 — Inteligencia e Transparencia

BI, portal de transparencia e auditoria.

| Domain | Descricao | Modulos |
|--------|-----------|---------|
| [06 Suporte e Inteligencia](../discovery/domains/06-suporte-inteligencia.md) | BI, transparencia, auditoria, comunicacao | M018, M019, M020 |
