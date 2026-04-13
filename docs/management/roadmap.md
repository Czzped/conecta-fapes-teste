# Roadmap de Entregas 2026 — ConectaFAPES

Visao markdown de leitura e navegacao das entregas de 2026. **Fonte de verdade: [releases-2026.csv](releases-2026.csv)** — ao atualizar status ou adicionar features, edite o CSV.

[← Voltar ao Management](README.md)

---

## Relacao com Milestones

As entregas operacionais de 2026 mapeiam para os seguintes milestones estrategicos. Ver [milestones.md](milestones.md) para criterios de conclusao de cada marco.

| Trimestre | Produto | Dominio principal | Milestone |
|-----------|---------|-------------------|-----------|
| Q1 | IMPORTADOR | 7 — Importacao SIGFAPES | [MS-01 Base Operacional](milestones.md#ms-01--base-operacional) |
| Q1 | PORTAL FAPES - ADMIN | 7 — Importacao SIGFAPES | [MS-01 Base Operacional](milestones.md#ms-01--base-operacional) |
| Q1 | PORTAL FAPES - ADMIN | 1 — Corporativo (IAM) | [MS-01 Base Operacional](milestones.md#ms-01--base-operacional) |
| Q1 | PORTAL FAPES - ADMIN | 5 — Financeiro | [MS-04 Financeiro](milestones.md#ms-04--financeiro) |
| Q1 | CONECTA FAPES | 4 — Fomento Post-Award | [MS-03 Ciclo de Fomento Post-Award](milestones.md#ms-03--ciclo-de-fomento-post-award) |
| Q1 | CONECTA FAPES | 3 — Fomento Pre-Award | [MS-02 Ciclo de Fomento Pre-Award](milestones.md#ms-02--ciclo-de-fomento-pre-award) |
| Q2 | PORTAL FAPES - ADMIN | 4 — Fomento Post-Award | [MS-03 Ciclo de Fomento Post-Award](milestones.md#ms-03--ciclo-de-fomento-post-award) |
| Q2 | PORTAL FAPES - ADMIN | 5 — Financeiro | [MS-04 Financeiro](milestones.md#ms-04--financeiro) |
| Q2 | PORTAL FAPES - COORDENADOR | 4 — Fomento Post-Award | [MS-03 Ciclo de Fomento Post-Award](milestones.md#ms-03--ciclo-de-fomento-post-award) |
| Q2 | CONECTA FAPES | 2 — Planejamento e Estrategia | [MS-02 Ciclo de Fomento Pre-Award](milestones.md#ms-02--ciclo-de-fomento-pre-award) |
| Q3 | PORTAL FAPES - ADMIN | 3 — Fomento Pre-Award | [MS-02 Ciclo de Fomento Pre-Award](milestones.md#ms-02--ciclo-de-fomento-pre-award) |
| Q3 | PORTAL FAPES - ADMIN | 5 — Financeiro | [MS-04 Financeiro](milestones.md#ms-04--financeiro) |
| Q4 | CONECTA FAPES | 6 — Suporte e Inteligencia | [MS-05 Inteligencia e Transparencia](milestones.md#ms-05--inteligencia-e-transparencia) |

---

## Legenda

| Status | Significado |
|--------|-------------|
| Entregue | Disponivel em producao |
| Em Andamento | Em desenvolvimento ativo |
| Homol | Em homologacao |
| Validacao | Em validacao com usuarios |
| Pendente | Planejado, nao iniciado |
| Postergado | Adiado para data posterior |
| Nao Implementado | Cancelado ou despriorizacao |

---

## Produtos

| Produto | Descricao |
|---------|-----------|
| **CONECTA FAPES** | Plataforma principal de gestao de fomento |
| **PORTAL FAPES - ADMIN** | Portal administrativo interno da FAPES |
| **PORTAL FAPES - COORDENADOR** | Portal do Coordenador de Projeto |
| **IMPORTADOR** | Importacao de dados do SIGFAPES |

---

## Q1 — Janeiro a Marco

### Janeiro

| Feature | Produto | Responsavel | Categoria | Status |
|---------|---------|-------------|-----------|--------|
| Importacao dos bolsistas do UNAC | PORTAL FAPES - ADMIN | Mateus | Funcionalidade | Nao Implementado |

### Fevereiro

| Feature | Produto | Responsavel | Categoria | Status |
|---------|---------|-------------|-----------|--------|
| Modulo de importacao de novos bolsistas e projetos pela equipe FAPES | PORTAL FAPES - ADMIN | Mateus | Oportunidade | Entregue / Pendente |
| Importacao de cotas de bolsas por projetos | PORTAL FAPES - ADMIN | Marcela / Omena | Funcionalidade | Entregue |
| Edicao de Cotas ao importar do Sigfapes | PORTAL FAPES - ADMIN | Marcela | Oportunidade | Homol |
| Acerto do cadastro de Versao de Bolsa | PORTAL FAPES - ADMIN | Vinicius | Melhoria | Nao entregue |
| Tela de Pagamento Manual | PORTAL FAPES - ADMIN | Vinicius | Funcionalidade | Entregue |
| Mapa de Pagamento (exportacao em Excel/CSV) | PORTAL FAPES - ADMIN | Vinicius | Funcionalidade | Postergado |
| Resiliencia das APIs usando Fila | PORTAL FAPES - ADMIN | Vinicius | Melhoria | Entregue |
| Seguranca Cookies | PORTAL FAPES - ADMIN | Vinicius | Melhoria | Entregue |
| Estudo de Acessibilidade Digital EMAG | CONECTA FAPES | Marcela | Melhoria | Validacao |
| Notificacao automatica | CONECTA FAPES | Manoel | Oportunidade | Homol |
| Pagamento avancado do UNAC | CONECTA FAPES | Marcela | Oportunidade | Homol |
| Prestacao de Contas V1 — Servico, Produtos e Diarias (Portal Coordenador) | CONECTA FAPES | Leticia | Funcionalidade | Em Andamento |

### Marco

| Feature | Produto | Responsavel | Categoria | Status |
|---------|---------|-------------|-----------|--------|
| Refatoracao e Melhoria (Vue + Node) | IMPORTADOR | Mateus | Melhoria | Entregue |
| Importacao dos bolsistas de Mestrado e Doutorado | PORTAL FAPES - ADMIN | Mateus | Funcionalidade | Entregue |
| Refatoracao do Portal Conecta | CONECTA FAPES | Marcela | Melhoria | Entregue |
| Produtacao da Captacao de Projetos | CONECTA FAPES | Leticia | Funcionalidade | Em Andamento |
| Adicionar pelo menos 500 pessoas usando o portal (teste de carga) | PORTAL FAPES - COORDENADOR | Arthur | Funcionalidade | Pendente |
| Realizar Teste de Carga e Seguranca | PORTAL FAPES - COORDENADOR | Marcela | Teste | Pendente |
| Criar equipe e processo de suporte ao usuario final | PORTAL FAPES - COORDENADOR | Joao | Suporte | Pendente |

---

## Q2 — Abril a Junho _(trimestre atual)_

### PORTAL FAPES - ADMIN

| Feature | Previsao | Responsavel | Categoria | Status |
|---------|----------|-------------|-----------|--------|
| Gestao de Aditivos — alteracao de valores, prazos, escopo e substituicao de coordenacao | Junho | Eduardo | Funcionalidade | Planejado |
| Gestao Financeira — compensacao, estorno e pagamento retroativo | Junho | Eduardo | Funcionalidade | Planejado |
| Reajuste de Bolsas — atualizacao e correcao de valores no sistema | Junho | Eduardo | Funcionalidade | Planejado |
| Ajuste Visualizar Pendencias — exibir apenas solicitacoes do Conecta | Junho | Eduardo | Melhoria | Planejado |
| Permissao para terceirizado — validar documentacao sem permissao de implantacao | Junho | Eduardo | Funcionalidade | Planejado |
| Cronograma de Expansao UNAC — adesao dos novos projetos do ciclo de Maio | Junho | — | Funcionalidade | Planejado |
| Escalonamento de Projetos — regua de prioridade para inclusao de editais no fluxo | Junho | — | Funcionalidade | Planejado |
| Area de Conhecimento — correcao da experiencia de cadastro | Junho | — | Melhoria | Planejado |
| Gestao Financeira e Contabil da FAPES sobre editais, projetos e programas (Fluxo de Caixa) | Junho | — | Funcionalidade | Planejado |

### CONECTA FAPES

| Feature | Previsao | Responsavel | Categoria | Status |
|---------|----------|-------------|-----------|--------|
| Criar sustentacao e processo | Junho | — | — | Planejado |
| Desenvolver consultas sobre as Financas do Projeto | Abril | — | Funcionalidade | Planejado |
| Gestao de Planejamento Estrategico | Junho | — | — | Planejado |
| Gestao de Programas | Junho | Leticia | — | Em Andamento |
| Ajustes no V1 da Prestacao de Contas Financeira | Junho | — | Melhoria | Planejado |
| Produtar / Iniciar Prestacao de Contas Tecnica | Junho | — | Funcionalidade | Planejado |
| Colocar em Producao o Portal do Coordenador | Maio | — | Implantacao | Planejado |
| Testar a Gestao de Editais e Novos Projetos com usuarios de teste | Maio | — | Teste | Planejado |
| Fluxo de Chamados NUTIC — workflow de abertura e triagem de chamados tecnicos | Junho | — | Funcionalidade | Planejado |
| Proposta de declaracao — exibir ao coordenador quando houver modelo disponivel | Junho | — | Oportunidade | Planejado |
| Cadastrar Parceria | Maio | — | Funcionalidade | Planejado |
| Associar Parceria a Programa | Maio | — | Funcionalidade | Planejado |
| Registrar Aporte Financeiro do Parceiro | Maio | — | Funcionalidade | Planejado |
| Acompanhar Execucao da Parceria | Maio | — | Funcionalidade | Planejado |

### PORTAL FAPES - COORDENADOR

| Feature | Previsao | Responsavel | Categoria | Status |
|---------|----------|-------------|-----------|--------|
| Prorrogacao de Vigencia — extensao do periodo das bolsas conforme parametrizacao do edital | Junho | Eduardo | Funcionalidade | Planejado |
| Prorrogacao de Janela de Solicitacao — prazos excepcionais por edital, projeto ou coordenador | Junho | Eduardo | Funcionalidade | Planejado |
| Gestao de Aditivos — alteracoes de valores, prazos, escopo e substituicao de coordenacao | Junho | Eduardo | Funcionalidade | Planejado |
| Suspensao de Bolsa — interrupcao temporaria do pagamento e das atividades do bolsista | Junho | Eduardo | Funcionalidade | Planejado |
| Ajuste Fluxo de Submissao — bloqueio de envio a FAPES quando ha pendencias documentais | Junho | Eduardo | Melhoria | Planejado |
| Controle de Reenvio (Reavaliacao) — prazo minimo de 24h para reenvio apos recusa | Junho | Eduardo | Funcionalidade | Planejado |
| Validacao de documentos por IA | Junho | Eduardo | Funcionalidade | Planejado |
| Minha Equipe — melhorar titulos da tela | Junho | — | Melhoria | Planejado |

---

## Q3 — Julho a Setembro

### PORTAL FAPES - ADMIN

| Feature | Previsao | Responsavel | Categoria | Status |
|---------|----------|-------------|-----------|--------|
| Finalizacao do Desenvolvimento e Implantacao da Gestao de Editais | Setembro | — | Funcionalidade | Planejado |
| Desenvolvimento do modulo de gestao financeira e contabil | Setembro | — | Funcionalidade | Planejado |

---

## Q4 — Outubro a Dezembro

### CONECTA FAPES

| Feature | Previsao | Responsavel | Categoria | Status |
|---------|----------|-------------|-----------|--------|
| Melhorias, Monitoramento e Levantamento de Novas Demandas | Novembro | — | Oportunidade | Planejado |

---

## Consolidado por Produto

| Produto | Q1 | Q2 | Q3 | Q4 | Total |
|---------|----|----|----|----|-------|
| CONECTA FAPES | 6 | 14 | — | 1 | 21 |
| PORTAL FAPES - ADMIN | 10 | 9 | 2 | — | 21 |
| PORTAL FAPES - COORDENADOR | 3 | 8 | — | — | 11 |
| IMPORTADOR | 1 | — | — | — | 1 |
| **Total** | **20** | **31** | **2** | **1** | **54** |
