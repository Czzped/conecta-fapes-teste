# SPRINT-007

[← Voltar ao Management](../README.md)

| Atributo | Valor |
|----------|-------|
| **Periodo** | 2026-04-21 a 2026-05-02 |
| **Milestone** | [MS-01](../milestones.md#ms-01--base-operacional) / [MS-02](../milestones.md#ms-02--ciclo-de-fomento-pre-award) / [MS-03](../milestones.md#ms-03--ciclo-de-fomento-post-award) |
| **GitHub Milestone** | `milestone: MS-01` |
| **Goal** | Construir a base cadastral corporativa (Instituicoes, Unidades, Finalidades) para desbloquear o modulo de Parcerias; entregar o extrato financeiro da Prestacao de Contas; iniciar discovery de Captacao de Iniciativas e melhorias de experiencia do usuario |

---

## Resumo por Frente de Trabalho

| Frente | Responsavel | Objetivo | Issues |
|--------|-------------|----------|--------|
| **Cadastros Corporativos** | Vinicius Estevam | Implementar CRUD de Instituicao, UnidadeOrg, AreaTecnica, Finalidade e vinculo de pessoas — pre-requisito para Parcerias | 8 issues (M008) |
| **Parcerias** | Vinicius Estevam | Implementar cadastro, aportes, coordenacao e consulta de parcerias no Portal Admin | 6 issues (M010) |
| **Prestacao de Contas** | Manoel | Entregar extrato do projeto com listagem paginada, controle de gastos e filtros | 5 issues (M014) |
| **Design de Produto** | Leticia | Discovery dos modulos M014 (analise/contestacao) e M011 (captacao completa): jornadas, prototipos e criterios de aceitacao | 2 issues |
| **Discovery de Melhorias** | Marcela + Leticia | Mapear jornadas de usuario em producao, coletar feedback e registrar melhorias e novas features | 1 issue |

---

## Features Comprometidas

**Prototipos de referencia:**
- [Back-office (Figma)](https://bucket-lake-78647159.figma.site/) — Telas de Parcerias, Instituicoes e Cadastros
- [Front-office (Figma)](https://rate-snort-02856207.figma.site/)
- [Prototipo Backoffice (codigo)](../../prototype/backoffice/) — Parceria.tsx, DetalhesParceria.tsx, FormularioParceria.tsx

### Vinicius Estevam — Cadastros Corporativos (M008)

> EPIC: [#1748](https://github.com/leds-conectafapes/conectafapes-project/issues/1748) Instituicoes e Unidades | [#1745](https://github.com/leds-conectafapes/conectafapes-project/issues/1745) Finalidades

| Feature | Issue | Documentacao | Status |
|---------|-------|-------------|--------|
| Cadastrar Instituicao | [#1749](https://github.com/leds-conectafapes/conectafapes-project/issues/1749) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [EPIC-M008-002](../../implementation/modules/M008-cadastros-corporativos/epics/EPIC-M008-002.md) | ⚪ To Do |
| Cadastrar Unidade Organizacional | [#1750](https://github.com/leds-conectafapes/conectafapes-project/issues/1750) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [EPIC-M008-002](../../implementation/modules/M008-cadastros-corporativos/epics/EPIC-M008-002.md) | ⚪ To Do |
| Cadastrar Dirigente | [#1751](https://github.com/leds-conectafapes/conectafapes-project/issues/1751) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [EPIC-M008-002](../../implementation/modules/M008-cadastros-corporativos/epics/EPIC-M008-002.md) | ⚪ To Do |
| Listar e Consultar Instituicoes | [#1752](https://github.com/leds-conectafapes/conectafapes-project/issues/1752) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [EPIC-M008-002](../../implementation/modules/M008-cadastros-corporativos/epics/EPIC-M008-002.md) | ⚪ To Do |
| Vincular Pessoa a Instituicao/Unidade | [#1753](https://github.com/leds-conectafapes/conectafapes-project/issues/1753) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [Modelo Pessoas](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-pessoas.md) | ⚪ To Do |
| Cadastrar e Gerenciar Area Tecnica | [#1754](https://github.com/leds-conectafapes/conectafapes-project/issues/1754) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-instituicoes.md), [Modelo Pessoas](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-pessoas.md) | ⚪ To Do |
| Cadastrar Finalidade | [#1746](https://github.com/leds-conectafapes/conectafapes-project/issues/1746) | [Modelo Referencia](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-referencia.md) | ⚪ To Do |
| Listar Finalidades | [#1747](https://github.com/leds-conectafapes/conectafapes-project/issues/1747) | [Modelo Referencia](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-referencia.md) | ⚪ To Do |

### Vinicius Estevam — Parcerias (M010)

> EPIC: [#1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) Portal Admin — Parcerias

| Feature | Issue | Documentacao | Status |
|---------|-------|-------------|--------|
| Cadastrar Parceria | [#1739](https://github.com/leds-conectafapes/conectafapes-project/issues/1739) | [Modelo Estrutural](../../implementation/modules/M010-planejamento-estrategia/modelo-estrutural.md), [Contrato](../../implementation/modules/M010-planejamento-estrategia/contrato.md) | ⚪ To Do |
| Registrar Aporte Financeiro | [#1740](https://github.com/leds-conectafapes/conectafapes-project/issues/1740) | [Modelo Estrutural](../../implementation/modules/M010-planejamento-estrategia/modelo-estrutural.md), [Contrato](../../implementation/modules/M010-planejamento-estrategia/contrato.md) | ⚪ To Do |
| Registrar Coordenacao de Parceria | [#1741](https://github.com/leds-conectafapes/conectafapes-project/issues/1741) | [Modelo Estrutural](../../implementation/modules/M010-planejamento-estrategia/modelo-estrutural.md), [Contrato](../../implementation/modules/M010-planejamento-estrategia/contrato.md) | ⚪ To Do |
| Associar Finalidade a Parceria | [#1742](https://github.com/leds-conectafapes/conectafapes-project/issues/1742) | [Modelo Estrutural](../../implementation/modules/M010-planejamento-estrategia/modelo-estrutural.md), [Modelo Referencia M008](../../implementation/modules/M008-cadastros-corporativos/modelo-estrutural-referencia.md) | ⚪ To Do |
| Listar e Consultar Parcerias | [#1743](https://github.com/leds-conectafapes/conectafapes-project/issues/1743) | [Contrato](../../implementation/modules/M010-planejamento-estrategia/contrato.md), [Contrato API](../../implementation/modules/M010-planejamento-estrategia/contrato-api.md) | ⚪ To Do |
| Encerrar Parceria | [#1744](https://github.com/leds-conectafapes/conectafapes-project/issues/1744) | [Modelo Comportamental](../../implementation/modules/M010-planejamento-estrategia/modelo-comportamental.md) | ⚪ To Do |

### Manoel — Prestacao de Contas (M014)

> EPIC: [#1718](https://github.com/leds-conectafapes/conectafapes-project/issues/1718) Extrato do Projeto

| Feature | Issue | Documentacao | Status |
|---------|-------|-------------|--------|
| Extrato do Projeto (EPIC) | [#1718](https://github.com/leds-conectafapes/conectafapes-project/issues/1718) | [M014 Backlog](../../implementation/modules/M014-prestacao-contas/backlog.md) | ⚪ To Do |
| Listagem paginada do Extrato | [#1721](https://github.com/leds-conectafapes/conectafapes-project/issues/1721) | [M014 Contrato API](../../implementation/modules/M014-prestacao-contas/contrato-api.md) | ⚪ To Do |
| Controle de Gastos do Projeto | [#1719](https://github.com/leds-conectafapes/conectafapes-project/issues/1719) | [M014 Modelo Estrutural](../../implementation/modules/M014-prestacao-contas/modelo-estrutural.md) | ⚪ To Do |
| Filtros do Extrato do Projeto | [#1720](https://github.com/leds-conectafapes/conectafapes-project/issues/1720) | [M014 Contrato API](../../implementation/modules/M014-prestacao-contas/contrato-api.md) | ⚪ To Do |
| Detalhes do extrato conforme status | [#1723](https://github.com/leds-conectafapes/conectafapes-project/issues/1723) | [M014 Modelo Comportamental](../../implementation/modules/M014-prestacao-contas/modelo-comportamental.md) | ⚪ To Do |

### Leticia — Design de Produto (Fase de Discovery)

| Feature | Modulo | Issue | Documentacao | Status |
|---------|--------|-------|-------------|--------|
| Discovery Prestacao de Contas (jornadas, prototipos, DoD dos EPICs 002/003) | M014 | [#1756](https://github.com/leds-conectafapes/conectafapes-project/issues/1756) | [M014 Backlog](../../implementation/modules/M014-prestacao-contas/backlog.md), [Modelo Comportamental](../../implementation/modules/M014-prestacao-contas/modelo-comportamental.md) | ⚪ To Do |
| Discovery Captacao de Iniciativas (jornadas, prototipos, DoD dos EPICs 001-007) | M011 | [#1757](https://github.com/leds-conectafapes/conectafapes-project/issues/1757) | [M011 Backlog](../../implementation/modules/M011-configuracao-captacao/backlog.md), [Analise Prototipo](../../implementation/modules/M011-configuracao-captacao/specifications/analise-prototipo-captacao.md) | ⚪ To Do |

### Lannes — Importacao SIGFAPES (M002)

> Pendencia: documentacao do sistema de importacao nao foi feita. Questionar sobre status atual e proximos passos.

| Item | Descricao | Status |
|------|-----------|--------|
| Documentacao do Importador | Documentar arquitetura, fluxo de dados e decisoes tecnicas do sistema de importacao | Pendente |
| Proximos passos M002 | Definir se ha evolucoes planejadas ou se o modulo esta finalizado | A discutir |

### Marcela + Leticia — Discovery de Melhorias

| Feature | Issue | Status |
|---------|-------|--------|
| Mapear jornadas de usuario, coletar feedback, registrar melhorias e novas features | [#1755](https://github.com/leds-conectafapes/conectafapes-project/issues/1755) | ⚪ To Do |

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

**Fase 2 — Parcerias (semana 2):**

1. #1739 Cadastrar Parceria (depende de #1749, #1750, #1746)
2. #1740 Registrar Aporte Financeiro (depende de #1749)
3. #1741 Registrar Coordenacao
4. #1742 Associar Finalidade (depende de #1746, #1747)
5. #1743 Listar e Consultar Parcerias
6. #1744 Encerrar Parceria

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

### Lannes — Importacao SIGFAPES (M002)

1. Documentar arquitetura e fluxo de dados do sistema de importacao
2. Definir proximos passos do modulo

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
| **Total de issues** | 22 |
| **Desenvolvimento (M008)** | 8 |
| **Desenvolvimento (M010)** | 6 |
| **Desenvolvimento (M014)** | 5 |
| **Design de Produto** | 2 |
| **Discovery de Melhorias** | 1 |
| **Concluidas** | 0 |
| **Em andamento** | 0 |
| **Pendentes** | 22 |
| **% Concluido** | 0% |

### Progresso por Responsavel

| Responsavel | Total | Done | In Progress | To Do | % |
|-------------|-------|------|-------------|-------|---|
| Vinicius | 14 | 0 | 0 | 14 | 0% |
| Manoel | 5 | 0 | 0 | 5 | 0% |
| Leticia | 2 | 0 | 0 | 2 | 0% |
| Marcela + Leticia | 1 | 0 | 0 | 1 | 0% |

### Progresso Detalhado

| # | Responsavel | Feature | Issue | Status |
|---|-------------|---------|-------|--------|
| 1 | Vinicius | Cadastrar Instituicao | #1749 | ⚪ To Do |
| 2 | Vinicius | Cadastrar Unidade Organizacional | #1750 | ⚪ To Do |
| 3 | Vinicius | Vincular Pessoa a Instituicao/Unidade | #1753 | ⚪ To Do |
| 4 | Vinicius | Cadastrar e Gerenciar Area Tecnica | #1754 | ⚪ To Do |
| 5 | Vinicius | Cadastrar Dirigente | #1751 | ⚪ To Do |
| 6 | Vinicius | Listar e Consultar Instituicoes | #1752 | ⚪ To Do |
| 7 | Vinicius | Cadastrar Finalidade | #1746 | ⚪ To Do |
| 8 | Vinicius | Listar Finalidades | #1747 | ⚪ To Do |
| 9 | Vinicius | Cadastrar Parceria | #1739 | ⚪ To Do |
| 10 | Vinicius | Registrar Aporte Financeiro | #1740 | ⚪ To Do |
| 11 | Vinicius | Registrar Coordenacao | #1741 | ⚪ To Do |
| 12 | Vinicius | Associar Finalidade a Parceria | #1742 | ⚪ To Do |
| 13 | Vinicius | Listar e Consultar Parcerias | #1743 | ⚪ To Do |
| 14 | Vinicius | Encerrar Parceria | #1744 | ⚪ To Do |
| 15 | Manoel | Extrato do Projeto (EPIC) | #1718 | ⚪ To Do |
| 16 | Manoel | Listagem paginada do Extrato | #1721 | ⚪ To Do |
| 17 | Manoel | Controle de Gastos do Projeto | #1719 | ⚪ To Do |
| 18 | Manoel | Filtros do Extrato do Projeto | #1720 | ⚪ To Do |
| 19 | Manoel | Detalhes do extrato conforme status | #1723 | ⚪ To Do |
| 20 | Leticia | Discovery Prestacao de Contas | #1756 | ⚪ To Do |
| 21 | Leticia | Discovery Captacao de Iniciativas | #1757 | ⚪ To Do |
| 22 | Marcela + Leticia | Jornadas e melhorias de usuario | #1755 | ⚪ To Do |

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
