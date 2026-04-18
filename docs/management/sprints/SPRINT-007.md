# SPRINT-007

[← Voltar ao Management](../README.md)

| Atributo | Valor |
|----------|-------|
| **Periodo** | 2026-04-21 a 2026-05-02 |
| **Milestone** | [MS-01](../milestones.md#ms-01--base-operacional) / [MS-02](../milestones.md#ms-02--ciclo-de-fomento-pre-award) / [MS-03](../milestones.md#ms-03--ciclo-de-fomento-post-award) |
| **GitHub Milestone** | `milestone: MS-01` |
| **Goal** | Construir a base cadastral corporativa (Instituicoes, Unidades, Documentos) para desbloquear o modulo de Parcerias (M010 refatorado — Finalidade permanece em M008 mas nao e mais vinculada a Parceria); entregar o extrato financeiro da Prestacao de Contas; iniciar discovery de Captacao de Iniciativas e melhorias de experiencia do usuario |

---

## Prioridades da Sprint

> **Tarefas mais importantes deste sprint:**
>
> 1. **Prestacao de Contas** — Entregar o extrato do projeto e finalizar o discovery dos fluxos de analise e contestacao (Manoel + Leticia)
> 2. **Monitoramento e cadastro de novos usuarios (UNAC)** — Acompanhar adocao do Portal Coordenador e consolidar relatorio com usuarios cadastrados, problemas e melhorias (Marcela + Leticia)
> 3. **Melhorias do Portal** — Mapear jornadas de usuario em producao, coletar feedback e registrar melhorias e novas features como issues (Marcela + Leticia)
>
> As demais frentes (Cadastros Corporativos, Parcerias, documentacao AuthRix, importacao SIGFAPES) continuam na sprint mas devem ceder prioridade em caso de conflito de capacidade.

---

## Resumo por Frente de Trabalho

| Frente | Responsavel | Objetivo | Issues |
|--------|-------------|----------|--------|
| **Cadastros Corporativos** | Vinicius Estevam | Implementar CRUD de Instituicao, UnidadeOrg, AreaTecnica, Finalidade e vinculo de pessoas — pre-requisito para Parcerias | 8 issues (M008) |
| **Parcerias (M010 refatorado)** | Vinicius Estevam | Implementar cadastro + formalizacao (RN19), Vigencias (original + aditivos), aportes financeiros (inflow/outflow), anexo de Documentos, saldo, encerramento em cascata e remocao em caso de erro | 11 issues (M010) |
| **Prestacao de Contas** | Manoel | Entregar extrato do projeto com listagem paginada, controle de gastos e filtros | 5 issues (M014) |
| **Design de Produto** | Leticia | Discovery dos modulos M014 (analise/contestacao) e M011 (captacao completa): jornadas, prototipos e criterios de aceitacao | 2 issues |
| **Discovery de Melhorias** | Marcela + Leticia | Mapear jornadas de usuario em producao, coletar feedback e registrar melhorias e novas features | 1 issue |
| **Importacao SIGFAPES** | Mateus Lannes | Documentar sistema de importacao e monitorar execucao, integridade e proximos passos | 1 issue |

---

## Produtos Impactados

| Produto | EPICs/Features | Modulos backend | Issues da sprint |
|---------|---------------|-----------------|------------------|
| [Portal Admin](../../products/portal-admin/README.md) | EPA-07 Gestao de Parcerias (novo), M008 via EPA-04 e outros | M008, M010 | 19 (8 M008 + 11 M010) |
| [Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md) | Extrato do Projeto (M014) | M014 | 5 (dev) + 1 (discovery) = 6 |
| [Portal Admin](../../products/portal-admin/README.md) | Discovery Captacao de Iniciativas | M011 | 1 (discovery) |
| [Portal Coordenador](../../products/portal-coordenador/README.md) | Monitoramento UNAC | — | 1 |
| [Importador](../../products/importador/README.md) | Documentacao e KPIs SIGFAPES | M002 | 1 |
| Cross-product ([Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md)) | Discovery de Melhorias (jornadas de usuario) | — | 1 |

---

## Premissa Nao Negociavel — Testes

> **Todo codigo entregue neste sprint DEVE ter testes unitarios e testes de integracao.** Sem excecoes.

**Aplica-se a:**
- Todas as issues de desenvolvimento do Vinicius (M008 — 8 issues + M010 — 11 issues = 19 issues)
- Todas as issues do Manoel (M014 — 5 issues)
- Qualquer PR aberto no sprint

**Criterios de aceitacao adicionais (todas as US de desenvolvimento):**

- [ ] Testes unitarios cobrindo regras de negocio (RN) documentadas no modulo
- [ ] Testes de integracao cobrindo o fluxo end-to-end da operacao (endpoint -> persistencia -> resposta)
- [ ] Cobertura minima validada em CI antes do merge
- [ ] Testes executam em pipeline de CI sem dependencias manuais

**PRs sem testes serao automaticamente reprovados no review.**

---

## Features Comprometidas

**Prototipos de referencia:**
- [Back-office (Figma)](https://bucket-lake-78647159.figma.site/) — Telas de Parcerias, Instituicoes e Cadastros
- [Front-office (Figma)](https://rate-snort-02856207.figma.site/)
- [Prototipo Backoffice (codigo)](../../prototype/backoffice/) — Parceria.tsx, DetalhesParceria.tsx, FormularioParceria.tsx

### Vinicius Estevam — Cadastros Corporativos (M008)

> EPIC: [#1748](https://github.com/leds-conectafapes/conectafapes-project/issues/1748) Instituicoes e Unidades | [#1745](https://github.com/leds-conectafapes/conectafapes-project/issues/1745) Finalidades

| Feature | Issue | Produto | Documentacao | Status |
|---------|-------|---------|--------------|--------|
| Cadastrar Instituicao | [#1749](https://github.com/leds-conectafapes/conectafapes-project/issues/1749) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md) | ⚪ To Do |
| Cadastrar Unidade Organizacional | [#1750](https://github.com/leds-conectafapes/conectafapes-project/issues/1750) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md) | ⚪ To Do |
| Cadastrar Dirigente | [#1751](https://github.com/leds-conectafapes/conectafapes-project/issues/1751) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md) | ⚪ To Do |
| Listar e Consultar Instituicoes | [#1752](https://github.com/leds-conectafapes/conectafapes-project/issues/1752) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md) | ⚪ To Do |
| Vincular Pessoa a Instituicao/Unidade | [#1753](https://github.com/leds-conectafapes/conectafapes-project/issues/1753) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Pessoas](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-pessoas.md) | ⚪ To Do |
| Cadastrar e Gerenciar Area Tecnica | [#1754](https://github.com/leds-conectafapes/conectafapes-project/issues/1754) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Pessoas](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-pessoas.md) | ⚪ To Do |
| Cadastrar Finalidade | [#1746](https://github.com/leds-conectafapes/conectafapes-project/issues/1746) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Referencia](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-referencia.md) | ⚪ To Do |
| Listar Finalidades | [#1747](https://github.com/leds-conectafapes/conectafapes-project/issues/1747) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Referencia](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-referencia.md) | ⚪ To Do |

### Vinicius Estevam — Parcerias (M010)

> EPIC: [#1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) Portal Admin — Parcerias
> **Mudancas de escopo nesta sprint**: domınio M010 refatorado — Coordenacao e Finalidade removidas do dominio (#1741 e #1742 fechadas). Adicionadas 7 novas US: Vigencia (aditivo), Aditivo de Aporte, Anexar Documentos, Aporte em Programa, Invariante Temporal, Saldo, Remover Parceria.

| Feature | Issue | Produto | Documentacao | Status |
|---------|-------|---------|--------------|--------|
| Cadastrar e Formalizar Parceria (RN19) | [#1739](https://github.com/leds-conectafapes/conectafapes-project/issues/1739) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md), [EPIC](../../implementation/modules/M010-planejamento-estrategia/parcerias/epics/EPIC-M010-002.md) | ⚪ To Do |
| Registrar Aporte Financeiro (inflow, isAditivo) | [#1740](https://github.com/leds-conectafapes/conectafapes-project/issues/1740) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | ⚪ To Do |
| Listar e Consultar Parcerias | [#1743](https://github.com/leds-conectafapes/conectafapes-project/issues/1743) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Contrato API](../../implementation/modules/M010-planejamento-estrategia/contrato-api.md) | ⚪ To Do |
| Encerrar Parceria (cascata RI2) | [#1744](https://github.com/leds-conectafapes/conectafapes-project/issues/1744) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Comportamental](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-comportamental.md) | ⚪ To Do |
| Registrar Vigencia (Aditivo) | [#1791](https://github.com/leds-conectafapes/conectafapes-project/issues/1791) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | ⚪ To Do |
| Registrar Aditivo de Aporte Financeiro | [#1792](https://github.com/leds-conectafapes/conectafapes-project/issues/1792) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | ⚪ To Do |
| Anexar Documentos a Parceria | [#1793](https://github.com/leds-conectafapes/conectafapes-project/issues/1793) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | ⚪ To Do |
| Registrar Aporte Financeiro Parceria em Programa (N:N) | [#1794](https://github.com/leds-conectafapes/conectafapes-project/issues/1794) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Programas — Estrutural](../../implementation/modules/M010-planejamento-estrategia/programas/modelo-estrutural.md) | ⚪ To Do |
| Validar Invariante Temporal Programa/Parceria (RN13) | [#1795](https://github.com/leds-conectafapes/conectafapes-project/issues/1795) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Programas — Comportamental](../../implementation/modules/M010-planejamento-estrategia/programas/modelo-comportamental.md) | ⚪ To Do |
| Consultar Saldo da Parceria (RN14) | [#1796](https://github.com/leds-conectafapes/conectafapes-project/issues/1796) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | ⚪ To Do |
| Remover Parceria (RI3) | [#1797](https://github.com/leds-conectafapes/conectafapes-project/issues/1797) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Comportamental](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-comportamental.md) | ⚪ To Do |

**Issues fechadas** (concepts removidos do dominio M010):
- ~~[#1741](https://github.com/leds-conectafapes/conectafapes-project/issues/1741) Registrar Coordenacao~~ — `Coordenacao` removida de M010 (parcerias nao tem coordenador no dominio atual)
- ~~[#1742](https://github.com/leds-conectafapes/conectafapes-project/issues/1742) Associar Finalidade~~ — `Finalidade` removida de Parceria (permanece em M008 como catalogo geral)

### Manoel — Prestacao de Contas (M014)

> EPIC: [#1718](https://github.com/leds-conectafapes/conectafapes-project/issues/1718) Extrato do Projeto

| Feature | Issue | Produto | Documentacao | Status |
|---------|-------|---------|--------------|--------|
| Extrato do Projeto (EPIC) | [#1718](https://github.com/leds-conectafapes/conectafapes-project/issues/1718) | [Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md) | [M014 Backlog](../../implementation/modules/M014-prestacao-contas/backlog.md) | ⚪ To Do |
| Listagem paginada do Extrato | [#1721](https://github.com/leds-conectafapes/conectafapes-project/issues/1721) | [Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md) | [M014 Contrato API](../../implementation/modules/M014-prestacao-contas/contrato-api.md) | ⚪ To Do |
| Controle de Gastos do Projeto | [#1719](https://github.com/leds-conectafapes/conectafapes-project/issues/1719) | [Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md) | [M014 Modelo Estrutural](../../implementation/modules/M014-prestacao-contas/modelo-estrutural.md) | ⚪ To Do |
| Filtros do Extrato do Projeto | [#1720](https://github.com/leds-conectafapes/conectafapes-project/issues/1720) | [Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md) | [M014 Contrato API](../../implementation/modules/M014-prestacao-contas/contrato-api.md) | ⚪ To Do |
| Detalhes do extrato conforme status | [#1723](https://github.com/leds-conectafapes/conectafapes-project/issues/1723) | [Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md) | [M014 Modelo Comportamental](../../implementation/modules/M014-prestacao-contas/modelo-comportamental.md) | ⚪ To Do |

### Leticia — Design de Produto (Fase de Discovery)

| Feature | Modulo | Issue | Produto | Documentacao | Status |
|---------|--------|-------|---------|--------------|--------|
| Discovery Prestacao de Contas | M014 | [#1756](https://github.com/leds-conectafapes/conectafapes-project/issues/1756) | [Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md) | [M014 Backlog](../../implementation/modules/M014-prestacao-contas/backlog.md) | ⚪ To Do |
| Discovery Captacao de Iniciativas | M011 | [#1757](https://github.com/leds-conectafapes/conectafapes-project/issues/1757) | [Portal Admin](../../products/portal-admin/README.md) | [M011 Backlog](../../implementation/modules/M011-configuracao-captacao/backlog.md) | ⚪ To Do |

### Mateus Lannes — Importacao SIGFAPES (M002)

| Feature | Issue | Produto | Documentacao | Status |
|---------|-------|---------|--------------|--------|
| Documentar e monitorar o sistema de Importacao SIGFAPES | [#1760](https://github.com/leds-conectafapes/conectafapes-project/issues/1760) | [Importador](../../products/importador/README.md) | [M002 Backlog](../../implementation/modules/M002-importacao-editais/backlog.md) | ⚪ To Do |

### Marcela + Leticia — Discovery de Melhorias

| Feature | Issue | Produto | Status |
|---------|-------|---------|--------|
| Mapear jornadas de usuario, coletar feedback, registrar melhorias e novas features | [#1755](https://github.com/leds-conectafapes/conectafapes-project/issues/1755) | Cross-product ([Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md)) | ⚪ To Do |

### Marcela + Leticia — Monitoramento UNAC

| Feature | Issue | Produto | Status |
|---------|-------|---------|--------|
| Monitorar cadastro e uso do Portal Coordenador UNAC (relatorio com usuarios, problemas e melhorias) | [#1759](https://github.com/leds-conectafapes/conectafapes-project/issues/1759) | [Portal Coordenador](../../products/portal-coordenador/README.md) | ⚪ To Do |

---

## Ordem de Implementacao

### Vinicius Estevam — M008 + M010

**Fase 1 — Cadastros Corporativos (semana 1):**

1. #1749 Cadastrar Instituicao
2. #1750 Cadastrar Unidade Organizacional
3. #1753 Vincular Pessoa a Instituicao/Unidade
4. #1754 Cadastrar e Gerenciar Area Tecnica
5. #1746 Cadastrar Finalidade + #1747 Listar Finalidades
6. #1751 Cadastrar Dirigente
7. #1752 Listar e Consultar Instituicoes

**Fase 2 — Parcerias (semana 2) — M010 refatorado:**

1. #1739 Cadastrar + Formalizar Parceria (RN19) (depende de #1749 Instituicao)
2. #1791 Registrar Vigencia (Aditivo) (depende de #1739)
3. #1793 Anexar Documentos a Parceria (pre-requisito RN19; depende de M008 Documento)
4. #1740 Registrar Aporte Financeiro (inflow, isAditivo) (depende de #1739, #1749)
5. #1792 Registrar Aditivo de Aporte (editar/remover RN18) (depende de #1740)
6. #1796 Consultar Saldo da Parceria (depende de #1740)
7. #1794 Registrar Aporte Parceria → Programa (depende de #1740 e Programa)
8. #1795 Validar Invariante Temporal RN13 (atravessa #1794 e alteracoes de datas)
9. #1743 Listar e Consultar Parcerias
10. #1744 Encerrar Parceria (cascata RI2 + justificativa)
11. #1797 Remover Parceria (RI3 — baixa prioridade)

> #1741 (Coordenacao) e #1742 (Finalidade) **fechadas** — conceitos removidos do dominio.

### Manoel — M014 Prestacao de Contas

1. #1718 Extrato do Projeto (EPIC — estrutura base)
2. #1721 Listagem paginada do Extrato
3. #1720 Filtros do Extrato do Projeto
4. #1723 Abrir detalhes do extrato conforme status
5. #1719 Controle de Gastos do Projeto

### Leticia — Design de Produto

**Paralelo com desenvolvimento (semanas 1 e 2):**

1. #1755 Mapear jornadas de usuario e coletar feedback (com Marcela)
2. #1756 Discovery Prestacao de Contas — jornadas de Analista/Coordenador/SECONT, maquina de estados (11 estados), prototipos
3. #1757 Discovery Captacao de Iniciativas — jornadas de Analista/Proponente/Revisor, prototipos dos 7 EPICs

### Marcela — Discovery de Melhorias

1. #1755 Mapear jornadas de usuario em producao (com Leticia)
2. Criar issues para cada melhoria e nova feature identificada

### Mateus Lannes — Importacao SIGFAPES (M002)

1. #1760 Documentar arquitetura e fluxo de dados do Importador
2. Definir KPIs de monitoramento e executar primeiro ciclo
3. Registrar proximos passos como issues

---

## EPICs Relacionados

| EPIC | Modulo | Issue |
|------|--------|-------|
| Cadastro de Instituicoes e Unidades | M008 | [#1748](https://github.com/leds-conectafapes/conectafapes-project/issues/1748) |
| Cadastro de Finalidades | M008 | [#1745](https://github.com/leds-conectafapes/conectafapes-project/issues/1745) |
| Portal Admin — Parcerias | M010 | [#1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) |
| Extrato do Projeto | M014 | [#1718](https://github.com/leds-conectafapes/conectafapes-project/issues/1718) |

---

## Estatisticas

| Metrica | Valor |
|---------|-------|
| **Total de issues** | 27 |
| **Desenvolvimento (M008)** | 8 |
| **Desenvolvimento (M010 refatorado)** | 11 (4 atualizadas + 7 novas; 2 fechadas) |
| **Desenvolvimento (M014)** | 5 |
| **Design de Produto** | 2 |
| **Discovery de Melhorias** | 1 |
| **Concluidas** | 0 |
| **Em andamento** | 0 |
| **Pendentes** | 27 |
| **% Concluido** | 0% |

### Progresso por Responsavel

| Responsavel | Total | Done | In Progress | To Do | % |
|-------------|-------|------|-------------|-------|---|
| Vinicius | 19 | 0 | 0 | 19 | 0% |
| Manoel | 5 | 0 | 0 | 5 | 0% |
| Leticia | 2 | 0 | 0 | 2 | 0% |
| Marcela + Leticia | 1 | 0 | 0 | 1 | 0% |

### Progresso Detalhado

| # | Responsavel | Feature | Issue | Produto | Status |
|---|-------------|---------|-------|---------|--------|
| 1 | Vinicius | Cadastrar Instituicao | #1749 | Portal Admin | ⚪ To Do |
| 2 | Vinicius | Cadastrar Unidade Organizacional | #1750 | Portal Admin | ⚪ To Do |
| 3 | Vinicius | Vincular Pessoa a Instituicao/Unidade | #1753 | Portal Admin | ⚪ To Do |
| 4 | Vinicius | Cadastrar e Gerenciar Area Tecnica | #1754 | Portal Admin | ⚪ To Do |
| 5 | Vinicius | Cadastrar Dirigente | #1751 | Portal Admin | ⚪ To Do |
| 6 | Vinicius | Listar e Consultar Instituicoes | #1752 | Portal Admin | ⚪ To Do |
| 7 | Vinicius | Cadastrar Finalidade | #1746 | Portal Admin | ⚪ To Do |
| 8 | Vinicius | Listar Finalidades | #1747 | Portal Admin | ⚪ To Do |
| 9 | Vinicius | Cadastrar e Formalizar Parceria (RN19) | #1739 | Portal Admin / EPA-07 | ⚪ To Do |
| 10 | Vinicius | Registrar Aporte Financeiro (inflow) | #1740 | Portal Admin / EPA-07 | ⚪ To Do |
| 11 | Vinicius | Listar e Consultar Parcerias | #1743 | Portal Admin / EPA-07 | ⚪ To Do |
| 12 | Vinicius | Encerrar Parceria (cascata RI2) | #1744 | Portal Admin / EPA-07 | ⚪ To Do |
| 13 | Vinicius | Registrar Vigencia (Aditivo) | #1791 | Portal Admin / EPA-07 | ⚪ To Do |
| 14 | Vinicius | Registrar Aditivo de Aporte Financeiro | #1792 | Portal Admin / EPA-07 | ⚪ To Do |
| 15 | Vinicius | Anexar Documentos a Parceria | #1793 | Portal Admin / EPA-07 | ⚪ To Do |
| 16 | Vinicius | Registrar Aporte Parceria em Programa (N:N) | #1794 | Portal Admin / EPA-07 | ⚪ To Do |
| 17 | Vinicius | Validar Invariante Temporal RN13 | #1795 | Portal Admin / EPA-07 | ⚪ To Do |
| 18 | Vinicius | Consultar Saldo da Parceria | #1796 | Portal Admin / EPA-07 | ⚪ To Do |
| 19 | Vinicius | Remover Parceria (RI3) | #1797 | Portal Admin / EPA-07 | ⚪ To Do |
| 20 | Manoel | Extrato do Projeto (EPIC) | #1718 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 21 | Manoel | Listagem paginada do Extrato | #1721 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 22 | Manoel | Controle de Gastos do Projeto | #1719 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 23 | Manoel | Filtros do Extrato do Projeto | #1720 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 24 | Manoel | Detalhes do extrato conforme status | #1723 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 25 | Leticia | Discovery Prestacao de Contas | #1756 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 26 | Leticia | Discovery Captacao de Iniciativas | #1757 | Portal Admin | ⚪ To Do |
| 27 | Marcela + Leticia | Jornadas e melhorias de usuario | #1755 | Cross-product | ⚪ To Do |

> **Legenda:** ⚪ To Do | 🔵 In Progress | 🟢 Done

---

## Review

### Entregue

- ...

### Nao entregue

- ... (motivo)

---

## Retrospectiva

### O que funcionou

- ...

### O que melhorar

- ...

### Acoes para o proximo sprint

- ...
