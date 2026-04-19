# Deliveries 2026 — ConectaFAPES

Entregas comprometidas por sprint, organizadas por mes. Atualizado ao final de cada sprint com o status real (Done / Nao Entregue).

[← Voltar ao Management](README.md) | Ver planejamento: [roadmap.md](roadmap.md) | Ver milestones: [milestones/](milestones/README.md)

---

## Legenda

| Status | Significado |
|--------|-------------|
| ⚪ To Do | Planejado, nao iniciado |
| 🔵 In Progress | Em desenvolvimento |
| 🟢 Done | Entregue |
| 🔴 Nao Entregue | Nao concluido no sprint |
| ➡️ Transferido | Movido para sprint seguinte |

| Fase | Significado |
|------|-------------|
| Discovery | Pesquisa, design, prototipacao, jornadas de usuario |
| Implementation | Desenvolvimento (codigo, testes, API) |
| Homologation | Validacao em ambiente de homologacao (UAT / staging) |
| Production | Colocacao em producao, operacao, monitoramento |

---

## Abril 2026

### [SPRINT-001](sprints/SPRINT-001.md) — 13 a 17 Abr | MS-03

> Portal do Coordenador em producao + Prestacao de Contas completo

| Feature | Descricao | Produto | Fase | Status |
|---------|-----------|---------|------|--------|
| Colocar em Producao o Portal do Coordenador | Implantacao do portal para coordenadores de projetos no ambiente de producao | Portal Coordenador | Homologation | 🔵 In Progress |
| ~~Ajustes no V1 da Prestacao de Contas Financeira~~ | Evolucoes do modulo M014 entregues na SPRINT-007 | Portal Coordenador | — | ✅ Coberto pela SPRINT-007 (#1718 #1719 #1720 #1721 #1723) |
| Produtar / Iniciar Prestacao de Contas Tecnica | Discovery e prototipacao do fluxo de prestacao de contas tecnica (relatorios de atividades) | Portal Coordenador | Discovery | ➡️ Transferido (fora do escopo de Abril/Maio) |
| Ajuste Fluxo de Submissao — bloqueio por pendencias documentais | Bloquear submissao de bolsista a agencia quando ha pendencias documentais nao resolvidas pelo coordenador | Portal Coordenador | Discovery | ➡️ Transferido para SPRINT-007 |
| Controle de Reenvio — prazo minimo 24h apos recusa | Impor intervalo minimo de 24h entre reenvios apos recusa pela agencia | Portal Coordenador | Implementation | ➡️ Transferido para SPRINT-007 |
| Validacao de documentos por IA | Validar automaticamente documentos submetidos usando modelos de IA antes da analise humana | Portal Coordenador | Homologation | ➡️ Transferido para SPRINT-007 |

### [SPRINT-007](sprints/SPRINT-007.md) — 20 Abr a 01 Mai | MS-01 / MS-02 / MS-03

> Cadastros Corporativos (M008) + Parcerias (M010) + Extrato do Projeto (M014)

**Cadastros Corporativos — Vinicius (M008)**

| Feature | Descricao | Issue | Produto | Fase | Status |
|---------|-----------|-------|---------|------|--------|
| Cadastrar Instituicao | CRUD de instituicoes parceiras (universidades, empresas, orgaos publicos) | [#1749](https://github.com/leds-conectafapes/conectafapes-project/issues/1749) | Portal Admin | Implementation | ⚪ To Do |
| Cadastrar Unidade Organizacional | Cadastro de unidades e departamentos vinculados a uma instituicao | [#1750](https://github.com/leds-conectafapes/conectafapes-project/issues/1750) | Portal Admin | Implementation | ⚪ To Do |
| Vincular Pessoa a Instituicao/Unidade | Associar pessoas (dirigentes, tecnicos) a uma instituicao ou unidade organizacional | [#1753](https://github.com/leds-conectafapes/conectafapes-project/issues/1753) | Portal Admin | Implementation | ⚪ To Do |
| Cadastrar e Gerenciar Area Tecnica | CRUD de areas tecnicas para classificacao de projetos e parcerias | [#1754](https://github.com/leds-conectafapes/conectafapes-project/issues/1754) | Portal Admin | Implementation | ⚪ To Do |
| Cadastrar Dirigente | Registrar o dirigente responsavel por uma instituicao com cargo e periodo de mandato | [#1751](https://github.com/leds-conectafapes/conectafapes-project/issues/1751) | Portal Admin | Implementation | ⚪ To Do |
| Listar e Consultar Instituicoes | Listagem paginada com filtros e visao detalhada de cada instituicao cadastrada | [#1752](https://github.com/leds-conectafapes/conectafapes-project/issues/1752) | Portal Admin | Implementation | ⚪ To Do |

**Parcerias — Vinicius (M010)**

| Feature | Descricao | Issue | Produto | Fase | Status |
|---------|-----------|-------|---------|------|--------|
| Cadastrar e Formalizar Parceria (RN19) | Criar parceria com dados formais; RN19 exige ao menos um aporte registrado antes da formalizacao | [#1739](https://github.com/leds-conectafapes/conectafapes-project/issues/1739) | Portal Admin | Implementation | ⚪ To Do |
| Registrar Vigencia (Aditivo) | Adicionar ou prorrogar o periodo de vigencia de uma parceria via instrumento aditivo | [#1791](https://github.com/leds-conectafapes/conectafapes-project/issues/1791) | Portal Admin | Implementation | ⚪ To Do |
| Anexar Documentos a Parceria | Vincular documentos formais (contratos, convenios, portarias) ao registro da parceria | [#1793](https://github.com/leds-conectafapes/conectafapes-project/issues/1793) | Portal Admin | Implementation | ⚪ To Do |
| Registrar Aporte Financeiro (inflow, isAditivo) | Registrar entrada de recurso financeiro do parceiro na agencia, original ou via aditivo | [#1740](https://github.com/leds-conectafapes/conectafapes-project/issues/1740) | Portal Admin | Implementation | ⚪ To Do |
| Registrar Aditivo de Aporte Financeiro | Editar ou cancelar um aporte ja registrado por meio de instrumento aditivo (RN18) | [#1792](https://github.com/leds-conectafapes/conectafapes-project/issues/1792) | Portal Admin | Implementation | ⚪ To Do |
| Consultar Saldo da Parceria (RN14) | Calcular e exibir saldo disponivel da parceria: total aportado menos o alocado em programas | [#1796](https://github.com/leds-conectafapes/conectafapes-project/issues/1796) | Portal Admin | Implementation | ⚪ To Do |
| Registrar Aporte Parceria em Programa (N:N) | Alocar recursos de uma parceria para um programa especifico (relacao N:N entre parceria e programa) | [#1794](https://github.com/leds-conectafapes/conectafapes-project/issues/1794) | Portal Admin | Implementation | ⚪ To Do |
| Validar Invariante Temporal RN13 | Garantir que a vigencia do programa esteja inteiramente contida na vigencia da parceria associada | [#1795](https://github.com/leds-conectafapes/conectafapes-project/issues/1795) | Portal Admin | Implementation | ⚪ To Do |
| Listar e Consultar Parcerias | Listagem paginada com filtros e visao detalhada de cada parceria | [#1743](https://github.com/leds-conectafapes/conectafapes-project/issues/1743) | Portal Admin | Implementation | ⚪ To Do |
| Encerrar Parceria (cascata RI2) | Encerrar parceria e seus vinculos ativos em cascata; exige justificativa obrigatoria | [#1744](https://github.com/leds-conectafapes/conectafapes-project/issues/1744) | Portal Admin | Implementation | ⚪ To Do |
| Remover Parceria (RI3) | Remover parceria somente quando nao houver aportes ou programas vinculados (RI3) | [#1797](https://github.com/leds-conectafapes/conectafapes-project/issues/1797) | Portal Admin | Implementation | ⚪ To Do |

**Prestacao de Contas — Manoel (M014)**

| Feature | Descricao | Issue | Produto | Fase | Status |
|---------|-----------|-------|---------|------|--------|
| Extrato do Projeto (EPIC base) | Estrutura base do extrato financeiro do projeto com linha do tempo de movimentacoes | [#1718](https://github.com/leds-conectafapes/conectafapes-project/issues/1718) | Portal Admin + Portal Coordenador | Implementation | ⚪ To Do |
| Listagem paginada do Extrato | Lista de lancamentos financeiros do projeto com paginacao e ordenacao | [#1721](https://github.com/leds-conectafapes/conectafapes-project/issues/1721) | Portal Admin + Portal Coordenador | Implementation | ⚪ To Do |
| Filtros do Extrato do Projeto | Filtrar extrato por tipo, periodo, status e categoria de gasto | [#1720](https://github.com/leds-conectafapes/conectafapes-project/issues/1720) | Portal Admin + Portal Coordenador | Implementation | ⚪ To Do |
| Detalhes do extrato conforme status | Exibir campos e acoes diferentes para cada status de lancamento (pendente, aprovado, recusado) | [#1723](https://github.com/leds-conectafapes/conectafapes-project/issues/1723) | Portal Admin + Portal Coordenador | Implementation | ⚪ To Do |
| Controle de Gastos do Projeto | Painel de controle de gastos por categoria com saldo disponivel por rubrica orcamentaria | [#1719](https://github.com/leds-conectafapes/conectafapes-project/issues/1719) | Portal Admin + Portal Coordenador | Implementation | ⚪ To Do |

**Transferidos da SPRINT-001 (M009)**

| Feature | Descricao | Produto | Fase | Status |
|---------|-----------|---------|------|--------|
| Ajuste Fluxo de Submissao — bloqueio por pendencias documentais | Bloquear submissao de bolsista a agencia quando ha pendencias documentais nao resolvidas pelo coordenador | Portal Coordenador | Discovery | ⚪ To Do |
| Controle de Reenvio — prazo minimo 24h apos recusa | Impor intervalo minimo de 24h entre reenvios apos recusa pela agencia | Portal Coordenador | Implementation | ⚪ To Do |
| Validacao de documentos por IA | Validar automaticamente documentos submetidos usando modelos de IA antes da analise humana | Portal Coordenador | Homologation | 🔵 In Progress |

**Design e Discovery**

| Feature | Descricao | Issue | Responsavel | Fase | Status |
|---------|-----------|-------|-------------|------|--------|
| Discovery Prestacao de Contas (M014) | Mapear jornadas de analista/coordenador/SECONT e prototipar a maquina de 11 estados do M014 | [#1756](https://github.com/leds-conectafapes/conectafapes-project/issues/1756) | Leticia | Discovery | ⚪ To Do |
| Discovery Captacao de Iniciativas (M011) | Mapear jornadas e prototipar os 7 EPICs do modulo de captacao de iniciativas | [#1757](https://github.com/leds-conectafapes/conectafapes-project/issues/1757) | Leticia | Discovery | ⚪ To Do |
| Jornadas de usuario e melhorias | Mapear jornadas reais em producao, coletar feedback e registrar oportunidades de melhoria como issues | [#1755](https://github.com/leds-conectafapes/conectafapes-project/issues/1755) | Marcela + Leticia | Discovery | ⚪ To Do |
| Monitoramento UNAC | Acompanhar adocao do Portal Coordenador pela UNAC e consolidar relatorio com metricas de uso e problemas | [#1759](https://github.com/leds-conectafapes/conectafapes-project/issues/1759) | Marcela + Leticia | Production | ⚪ To Do |
| Documentar Importacao SIGFAPES | Documentar arquitetura, fluxo de dados e KPIs do importador SIGFAPES; registrar proximos passos | [#1760](https://github.com/leds-conectafapes/conectafapes-project/issues/1760) | Mateus Lannes | Discovery | ⚪ To Do |

---

## Maio 2026

### [SPRINT-002](sprints/SPRINT-002.md) — 04 a 15 Mai | MS-02

> Gestao de Programas e Planejamento Estrategico (infraestrutura de Parcerias entregue na SPRINT-007)

| Feature | Descricao | Produto | Fase | Status |
|---------|-----------|---------|------|--------|
| ~~Cadastrar Parceria~~ | Coberto pela SPRINT-007 | Portal Admin | — | ✅ Coberto pela SPRINT-007 (#1739) |
| ~~Associar Parceria a Programa~~ | Coberto pela SPRINT-007 | Portal Admin | — | ✅ Coberto pela SPRINT-007 (#1794 #1795) |
| ~~Registrar Aporte Financeiro do Parceiro~~ | Coberto pela SPRINT-007 | Portal Admin | — | ✅ Coberto pela SPRINT-007 (#1740 #1792) |
| Acompanhar Execucao da Parceria | Dashboard de execucao com graficos de alocacao, progresso e alertas por parceria | Portal Admin | Implementation | ⚪ To Do |
| Gestao de Programas (CRUD completo) | CRUD completo de programas de fomento vinculados a parcerias e editais | Portal Admin | Implementation | ⚪ To Do |
| Gestao de Planejamento Estrategico | Gerenciar objetivos estrategicos, metas e iniciativas da agencia com vinculo a programas | Portal Admin | Implementation | ⚪ To Do |

### [SPRINT-003](sprints/SPRINT-003.md) — 18 a 29 Mai | MS-03

> Aditivos e gestao de bolsistas (Eduardo)

| Feature | Descricao | Produto | Fase | Status |
|---------|-----------|---------|------|--------|
| Gestao de Aditivos — alteracao de valores, prazos, escopo e coordenacao | Registrar instrumento aditivo com alteracoes de valores, prazos, escopo e substituicao de coordenacao | Portal Admin | Implementation | ⚪ To Do |
| Gestao de Aditivos (Coordenador) | Solicitar e acompanhar aditivos de valores, prazos e escopo pelo portal do coordenador | Portal Coordenador | Implementation | ⚪ To Do |
| Suspensao de Bolsa | Interromper temporariamente o pagamento e as atividades de um bolsista com registro de motivo e prazo | Portal Coordenador | Implementation | ⚪ To Do |
| Prorrogacao de Vigencia | Estender o periodo das bolsas conforme parametrizacao do edital sem necessidade de novo instrumento | Portal Coordenador | Implementation | ⚪ To Do |
| Ajuste Visualizar Pendencias — exibir apenas solicitacoes do Conecta | Filtrar pendencias exibindo apenas solicitacoes originadas no Conecta, ocultando legados | Portal Admin | Implementation | ⚪ To Do |
| Permissao para terceirizado | Permitir que terceirizados validem documentacao sem acesso a funcionalidades restritas de implantacao | Portal Admin | Implementation | ⚪ To Do |

---

## Junho 2026

### [SPRINT-004](sprints/SPRINT-004.md) — 01 a 12 Jun | MS-03 / MS-02

> Prazos excepcionais, fluxo de submissao e escalonamento de projetos

| Feature | Descricao | Produto | Fase | Status |
|---------|-----------|---------|------|--------|
| Prorrogacao de Janela de Solicitacao — prazos excepcionais | Permitir prazos excepcionais de submissao por edital, projeto ou coordenador especifico | Portal Coordenador | Implementation | ⚪ To Do |
| Testar Gestao de Editais com usuarios de teste | Validar o fluxo completo de gestao de editais e novos projetos com usuarios reais em ambiente de teste | Portal Admin | Production | ⚪ To Do |
| Escalonamento de Projetos — regua de prioridade | Definir regua de prioridade para inclusao de editais e projetos no fluxo de analise | Portal Admin | Implementation | ⚪ To Do |
| Minha Equipe — melhorar titulos da tela | Corrigir titulos e labels da tela Minha Equipe no portal do coordenador | Portal Coordenador | Implementation | ⚪ To Do |

### [SPRINT-005](sprints/SPRINT-005.md) — 15 a 26 Jun | MS-04

> Operacoes financeiras avancadas, expansao UNAC e consultas financeiras

| Feature | Descricao | Produto | Fase | Status |
|---------|-----------|---------|------|--------|
| Gestao Financeira — compensacao, estorno e pagamento retroativo | Operacoes financeiras avancadas: compensacao entre lancamentos, estorno e pagamento retroativo | Portal Admin | Implementation | ⚪ To Do |
| Reajuste de Bolsas — atualizacao e correcao de valores | Atualizar e corrigir valores de bolsas no sistema conforme tabela vigente aprovada | Portal Admin | Implementation | ⚪ To Do |
| Cronograma de Expansao UNAC | Definir e executar o cronograma de adesao dos novos projetos do ciclo de Maio na UNAC | Portal Admin | Production | ⚪ To Do |
| Gestao Financeira e Contabil — Fluxo de Caixa | Painel de fluxo de caixa da agencia com entradas, saidas e projecoes por periodo | Portal Admin | Implementation | ⚪ To Do |
| Consultas sobre Financas do Projeto | Consultas analiticas sobre situacao financeira de projetos: saldo, gastos realizados e previsao | Portal Admin + Portal Coordenador | Implementation | ⚪ To Do |

### [SPRINT-006](sprints/SPRINT-006.md) — 29 Jun a 10 Jul | MS-05 / MS-01

> Encerramento Q2: suporte operacional NUTIC e itens transferidos do Q1

| Feature | Descricao | Produto | Fase | Status |
|---------|-----------|---------|------|--------|
| Mapa de Pagamento (exportacao Excel/CSV) | Exportar mapa de pagamentos de bolsistas em Excel/CSV filtrando por periodo e edital | Portal Admin | Implementation | ⚪ To Do |
| Adicionar 500 pessoas ao portal (teste de carga) | Onboarding de pelo menos 500 coordenadores no portal para validar capacidade em carga real | Portal Coordenador | Production | ⚪ To Do |
| Realizar Teste de Carga e Seguranca | Executar testes de carga e seguranca no Portal Coordenador antes da expansao para novos usuarios | Portal Coordenador | Production | ⚪ To Do |
| Importacao dos bolsistas do UNAC | Importar dados de bolsistas da UNAC para o sistema via integracao ou carga estruturada | Portal Admin | Implementation | ⚪ To Do |
| Acerto do cadastro de Versao de Bolsa | Corrigir inconsistencias no cadastro de versao de bolsa migradas do sistema legado | Portal Admin | Implementation | ⚪ To Do |
| Finalizar documentacao API de Nada Consta | Concluir documentacao tecnica da API de Nada Consta para integracao com o produto Valida | Valida | Discovery | ⚪ To Do |
| Integracao Conecta Fapes com API de Nada Consta | Integrar o ConectaFAPES com a API de Nada Consta para validacao automatica de impedimentos | Valida | Implementation | ⚪ To Do |
| Criar equipe e processo de suporte | Estruturar equipe e processos de suporte ao Portal Coordenador: SLA, canais e escalacao | Portal Coordenador | Production | ⚪ To Do |
| Criar sustentacao e processo | Criar processo formal de sustentacao e manutencao evolutiva do sistema pos-lancamento | Portal Admin | Production | ⚪ To Do |
| Fluxo de Chamados NUTIC | Implementar workflow de abertura e triagem de chamados tecnicos via NUTIC | Portal Admin | Implementation | ⚪ To Do |
| Area de Conhecimento — correcao de cadastro | Corrigir experiencia de cadastro de Area de Conhecimento com validacoes e UX adequados | Portal Admin | Implementation | ⚪ To Do |
