# SPRINT-007

[← Voltar ao Management](../README.md)

| Atributo | Valor |
|----------|-------|
| **Periodo** | 2026-04-20 a 2026-05-01 |
| **Milestone** | [MS-01](../milestones/MS-01.md) / [MS-02](../milestones/MS-02.md) / [MS-03](../milestones/MS-03.md) |
| **GitHub Milestone** | `milestone: MS-01` |
| **Goal** | Construir a base cadastral corporativa (Instituicoes em modelo unico, Documentos) para desbloquear o modulo de Parcerias (M010 refatorado — Finalidade permanece em M008 mas nao e mais vinculada a Parceria); entregar o extrato financeiro da Prestacao de Contas; iniciar discovery de Captacao de Iniciativas e melhorias de experiencia do usuario |

> **Nota de reversao (2026-05-07):** decisao desta sprint de colapsar `Instituicao`/`UnidadeOrganizacional`/`Dirigente` em modelo unico foi parcialmente revertida. Modelo atual: `Instituicao` (CNPJ obrigatorio) + `UnidadeOrganizacional` (subdivisao interna sem CNPJ, composicao recursiva) + `Responsavel` (vinculo temporal unico para Instituicao OU UnidadeOrganizacional, substituindo `Dirigente`). Issue #1750 retitulada para "Cadastrar UnidadeOrganizacional"; #1751 retitulada para "Cadastrar Responsavel". Ver [M008 modelo-estrutural](../../implementation/modules/M008-cadastros-corporativos/instituicoes/modelo-estrutural.md).

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
| **Cadastros Corporativos** | Vinicius Estevam | Implementar CRUD de Instituicao em modelo unico (com CNPJ para entidade juridica; sem CNPJ para setor interno), Dirigente simplificado e consultas — pre-requisito para Parcerias | 4 issues ativas (M008) + 2 removidas do escopo |
| **Parcerias e Programas (M010 refatorado)** | Vinicius Estevam | Implementar cadastro + formalizacao (RN19), Vigencias (original + aditivos), aportes financeiros recebidos, saldo, encerramento e remocao; Parceria depende de Instituicao; manter documentado o aporte Parceria→Programa N:N, sem `RecursoPrograma` interno | 11 issues (M010) |
| **Prestacao de Contas** | Manoel | Entregar extrato do projeto com listagem paginada, controle de gastos e filtros | 5 issues (M014) |
| **Design de Produto** | Leticia | Discovery dos modulos M014 (analise/contestacao) e M011 (captacao completa): jornadas, prototipos e criterios de aceitacao | 2 issues |
| **Discovery de Melhorias** | Marcela + Leticia | Mapear jornadas de usuario em producao, coletar feedback e registrar melhorias e novas features | 1 issue |
| **Importacao SIGFAPES** | Mateus Lannes | Documentar sistema de importacao e monitorar execucao, integridade e proximos passos | 1 issue |

> Prototipo de referencia: `prototype/backoffice/`.

---

## Produtos Impactados

| Produto | EPICs/Features | Modulos backend | Issues da sprint |
|---------|---------------|-----------------|------------------|
| [Portal Admin](../../products/portal-admin/README.md) | EPA-07 Gestao de Parcerias (novo), M008 via EPA-04 e outros | M008, M010 | 15 (4 M008 + 11 M010) |
| [Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md) | Extrato do Projeto (M014) | M014 | 5 (dev) + 1 (discovery) = 6 |
| [Portal Admin](../../products/portal-admin/README.md) | Discovery Captacao de Iniciativas | M011 | 1 (discovery) |
| [Portal Coordenador](../../products/portal-coordenador/README.md) | Monitoramento UNAC | — | 1 |
| [Importador](../../products/importador/README.md) | Documentacao e KPIs SIGFAPES | M002 | 1 |
| Cross-product ([Portal Admin](../../products/portal-admin/README.md) + [Portal Coordenador](../../products/portal-coordenador/README.md)) | Discovery de Melhorias (jornadas de usuario) | — | 1 |

---

## Decisoes de Escopo — Deferimentos

> **ContaBancaria e FundoFinanceiro (M016) — fora do escopo deste sprint**
>
> O modelo estrutural de `AporteFinanceiro` (M010) inclui o campo `contaBancariaDestinoId` (FK → M016/ContaBancaria), documentando que todo aporte recebido pela agencia e depositado em uma conta bancaria. Porem, a entidade `ContaBancaria` e sua relacao N:1 com `FundoFinanceiro` **nao serao implementadas neste sprint**.
>
> **Motivo:** os requisitos de segregacao de fundos e gestao de contas bancarias surgem do fluxo de Prestacao de Contas (M014). A implementacao sera discutida somente apos M014 estar concluido.
>
> **Impacto pratico para o Vinicius:**
> - Issue [#1740](https://github.com/leds-conectafapes/conectafapes-project/issues/1740): implementar `AporteFinanceiro` **sem** o campo `contaBancariaDestinoId` (campo pode ser omitido/nulo na API por ora). Todas as demais RNs permanecem no escopo.
> - Issues [#1739](https://github.com/leds-conectafapes/conectafapes-project/issues/1739), [#1791–#1797](https://github.com/leds-conectafapes/conectafapes-project/issues/1791): nao impactadas.
>
> **Referencia:** [M016 Backlog](../../implementation/modules/M016-contabilidade-financeiro/backlog.md) — EPIC-M016-002 e EPIC-M016-004 marcados como deferidos pos-M014.

---

## Premissa Nao Negociavel — Testes

> **Todo codigo entregue neste sprint DEVE ter testes unitarios e testes de integracao.** Sem excecoes.

**Aplica-se a:**
- Todas as issues de desenvolvimento do Vinicius (M008 — 4 issues ativas + M010 — 11 issues = 15 issues)
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
- Prototipo Backoffice (codigo): `prototype/backoffice/` — Parceria.tsx, DetalhesParceria.tsx, FormularioParceria.tsx

### Vinicius Estevam — Cadastros Corporativos (M008)

> EPIC: [#1748](https://github.com/leds-conectafapes/conectafapes-project/issues/1748) Cadastro de Instituicoes
> **Mudancas de escopo nesta sprint**: dominio M008 refatorado — `Instituicao` passa a ser o agregado unico para entidades com CNPJ e setores internos sem CNPJ; `UnidadeOrganizacional`, `AreaTecnica` e vinculo direto Pessoa-Instituicao foram removidos. `Dirigente` foi simplificado para vinculo temporal PessoaFisica-Instituicao, sem `tipo` e sem `responsavel`.

| Feature | Issue | Produto | Documentacao | Status |
|---------|-------|---------|--------------|--------|
| Cadastrar Instituicao | [#1749](https://github.com/leds-conectafapes/conectafapes-project/issues/1749) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/instituicoes/modelo-estrutural.md) | 🟢 Done — [PR #271](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/271) merged 2026-05-04 |
| Cadastrar UnidadeOrganizacional (renomeada de "Setor Interno") | [#1750](https://github.com/leds-conectafapes/conectafapes-project/issues/1750) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/instituicoes/modelo-estrutural.md) | ⚪ To Do — replanejada apos reversao do modelo (ver nota de reversao) |
| Cadastrar Responsavel (renomeada de "Dirigente") | [#1751](https://github.com/leds-conectafapes/conectafapes-project/issues/1751) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/instituicoes/modelo-estrutural.md) | ⚪ To Do — replanejada para classe Responsavel unica (ver nota de reversao) |
| Listar e Consultar Instituicoes | [#1752](https://github.com/leds-conectafapes/conectafapes-project/issues/1752) | [Portal Admin](../../products/portal-admin/README.md) | [Modelo Instituicoes](../../implementation/modules/M008-cadastros-corporativos/instituicoes/modelo-estrutural.md) | 🟢 Done — [PR #274](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/274) merged 2026-05-05 |

**Issues removidas do escopo M008 atual**:
- ~~[#1753](https://github.com/leds-conectafapes/conectafapes-project/issues/1753) Vincular Pessoa a Instituicao/Unidade~~ — relacao direta Pessoa-Instituicao removida; pessoa se vincula a instituicao apenas via `Dirigente` quando aplicavel.
- ~~[#1754](https://github.com/leds-conectafapes/conectafapes-project/issues/1754) Cadastrar e Gerenciar Area Tecnica~~ — `AreaTecnica` removida do modelo; setores internos sao `Instituicao` sem CNPJ e com superior.

### Vinicius Estevam — Parcerias e Programas (M010)

> EPIC: [#1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) Portal Admin — Parcerias
> **Mudancas de escopo nesta sprint**: dominio M010 refatorado — Coordenacao e Finalidade removidas do dominio (#1741 e #1742 fechadas). `RecursoPrograma` e fontes internas de Programa foram removidos; Programa recebe recursos apenas por aportes de Parcerias via `AporteFinanceiroParceriaPrograma` (N:N), permitindo que um Programa receba aportes de uma ou mais Parcerias. Adicionadas 7 novas US: Vigencia (aditivo), Aditivo de Aporte, Anexar Documentos, Aporte em Programa, Invariante Temporal, Saldo, Remover Parceria.

| Feature | Issue | Produto | Documentacao | Status |
|---------|-------|---------|--------------|--------|
| Cadastrar e Formalizar Parceria (RN19) | [#1739](https://github.com/leds-conectafapes/conectafapes-project/issues/1739) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md), [EPIC](../../implementation/modules/M010-planejamento-estrategia/parcerias/epics/EPIC-M010-002.md) | 🟢 Done — [PR #272](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/272) merged 2026-05-04 + [PR #276](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/276) Publicar Parceria merged 2026-05-05 |
| Registrar Aporte Financeiro (inflow, isAditivo) | [#1740](https://github.com/leds-conectafapes/conectafapes-project/issues/1740) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | ⚪ Pendente — PR #264 fechado sem merge; replanejado |
| Listar e Consultar Parcerias | [#1743](https://github.com/leds-conectafapes/conectafapes-project/issues/1743) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Contrato API](../../implementation/modules/M010-planejamento-estrategia/contrato-api.md) | 🟢 Done — [PR #273](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/273) merged 2026-05-04 |
| Encerrar Parceria (cascata RI2) | [#1744](https://github.com/leds-conectafapes/conectafapes-project/issues/1744) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Comportamental](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-comportamental.md) | ⚪ Pendente — PR #267 fechado sem merge; replanejado |
| Registrar Vigencia (Aditivo) | [#1791](https://github.com/leds-conectafapes/conectafapes-project/issues/1791) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | ⚪ Pendente — PR #263 fechado sem merge; replanejado |
| Registrar Aditivo de Aporte Financeiro | [#1792](https://github.com/leds-conectafapes/conectafapes-project/issues/1792) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | ⚪ Pendente — PR #265 fechado sem merge; replanejado |
| Anexar Documentos a Parceria | [#1793](https://github.com/leds-conectafapes/conectafapes-project/issues/1793) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | 🔴 Omitido — Documento fora do escopo deste sprint |
| Registrar Aporte Financeiro Parceria em Programa (N:N) | [#1794](https://github.com/leds-conectafapes/conectafapes-project/issues/1794) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Programas — Estrutural](../../implementation/modules/M010-planejamento-estrategia/programas/modelo-estrutural.md) | 🔴 Adiado — aguarda M014; modelo permite multiplas Parcerias por Programa |
| Validar Invariante Temporal Programa/Parceria (RN13) | [#1795](https://github.com/leds-conectafapes/conectafapes-project/issues/1795) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Programas — Comportamental](../../implementation/modules/M010-planejamento-estrategia/programas/modelo-comportamental.md) | 🔴 Adiado — depende de #1794 |
| Consultar Saldo da Parceria (RN14) | [#1796](https://github.com/leds-conectafapes/conectafapes-project/issues/1796) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Estrutural](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md) | ⚪ Pendente — PR #266 fechado sem merge; replanejado |
| Remover Parceria (RI3) | [#1797](https://github.com/leds-conectafapes/conectafapes-project/issues/1797) | [Portal Admin / EPA-07](../../products/portal-admin/features/EPA-07-gestao-parcerias.md) | [Parcerias — Comportamental](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-comportamental.md) | ⚪ Pendente — PR #267 fechado sem merge; replanejado |

**Issues fechadas** (concepts removidos do dominio M010):
- ~~[#1741](https://github.com/leds-conectafapes/conectafapes-project/issues/1741) Registrar Coordenacao~~ — `Coordenacao` removida de M010 (parcerias nao tem coordenador no dominio atual)
- ~~[#1742](https://github.com/leds-conectafapes/conectafapes-project/issues/1742) Associar Finalidade~~ — `Finalidade` removida de Parceria (permanece em M008 como catalogo geral)

**Escopo de Programas atualizado**:
- `RecursoPrograma` e o endpoint `/programas/{id}/recursos` foram removidos do contrato.
- Nao ha mais registro de fontes internas (`LOA`, `TESOURO_ESTADUAL`, `FEDERAL`, `OUTRO`) dentro de Programa.
- O caminho financeiro canonico para Programa e `AporteFinanceiroParceriaPrograma`, com relacao N:N: uma Parceria pode aportar em varios Programas e um Programa pode receber aportes de varias Parcerias.

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

### Plano incremental acordado — Parceria, Programa e Instituicao

**Diretriz:** nao incluir Captacao neste plano de implementacao. O impacto de Captacao deve ser tratado como analise de fronteira entre M011 (configuracao da captacao), M003 (Iniciativa/Projeto), M016/M014 (conta bancaria, saldo e prestacao de contas) e Importadores, antes de qualquer implementacao nessa frente.

**Sequencia recomendada:**

1. **Backend base de Instituicao (M008)** — entregar o minimo necessario para Parceria referenciar uma Instituicao valida.
2. **Backend de Parceria e Programa (M010)** — construir os endpoints e regras do dominio ja considerando que Parceria precisa de Instituicao.
3. **Frontend de Parceria** — priorizar o fluxo operacional principal, usando Instituicao como dependencia obrigatoria.
4. **Frontend de Programa** — entregar cadastro/listagem/consulta de Programa e preparar a integracao futura com aportes de Parceria.
5. **Frontend completo de Instituicao** — evoluir a tela de Instituicao apos Parceria/Programa estarem destravados.
6. **Iniciativas com rubricas e acompanhamento financeiro** — manter fora da primeira versao; rubricas so fazem sentido vinculadas a Iniciativa/Projeto e entram em uma segunda entrega, depois do fluxo base de Instituicao, Parceria e Programa estar estavel.

**Impactos obrigatorios antes da implementacao de Captacao/Iniciativas:**

- Revisar M011 como configuracao da captacao: categorias multiplas, pool de revisores ad hoc e regras que determinam se a iniciativa exigira orcamento, rubricas e subrubricas.
- Revisar M003 como dono da Iniciativa/Projeto pos-outorga: valor planejado/aprovado deve ficar na iniciativa ou em seu orcamento planejado, conforme a versao vigente do plano.
- Revisar M016/M014 como donos dos dados financeiros realizados: conta bancaria, saldo em conta corrente, extratos, movimentacoes e prestacao de contas nao devem ser persistidos diretamente em M011.
- Avaliar solicitacao do Importador CNAB 240 para importar movimentacoes/saldo da conta corrente do projeto, alimentando M016/M014.
- Expor na Iniciativa uma visao financeira derivada com valor planejado/aprovado e valor em conta corrente quando houver conta bancaria vinculada e integracao CNAB 240 disponivel.
- Mapear impacto nos importadores para garantir compatibilidade entre dados legados, M003, M011, M016/M014 e M010.
- Registrar ajustes de contrato/API somente depois de validar o impacto entre M011, M003, M010, M016/M014 e Importadores.

### Vinicius Estevam — M008 + M010

**Fase 1 — Backend minimo de Instituicao (semana 1):**

1. #1749 Cadastrar Instituicao — dependencia direta para Parceria
2. #1752 Listar e Consultar Instituicoes — necessario para selecao/consulta em Parceria
3. #1750 Cadastrar Setor Interno (Instituicao sem CNPJ)
4. #1751 Cadastrar Dirigente

> #1753 (Vincular Pessoa a Instituicao/Unidade) e #1754 (Area Tecnica) **removidas do escopo** — conceitos removidos do modelo M008 atual.

**Fase 2 — Backend de Parcerias e Programas (semana 2) — M010 refatorado:**

1. #1739 Cadastrar + Formalizar Parceria (RN19) (depende de #1749 Instituicao)
2. #1791 Registrar Vigencia (Aditivo) (depende de #1739)
3. #1793 Anexar Documentos a Parceria (pre-requisito RN19; depende de M008 Documento)
4. #1740 Registrar Aporte Financeiro (inflow, isAditivo) (depende de #1739, #1749)
5. #1792 Registrar Aditivo de Aporte (editar/remover RN18) (depende de #1740)
6. #1796 Consultar Saldo da Parceria (depende de #1740)
7. #1794 Registrar Aporte Parceria → Programa (N:N; depende de #1740 e Programa; adiado nesta sprint)
8. #1795 Validar Invariante Temporal RN13 (atravessa #1794 e alteracoes de datas; adiado nesta sprint)
9. #1743 Listar e Consultar Parcerias
10. #1744 Encerrar Parceria (cascata RI2 + justificativa)
11. #1797 Remover Parceria (RI3 — baixa prioridade)

> #1741 (Coordenacao) e #1742 (Finalidade) **fechadas** — conceitos removidos do dominio. `RecursoPrograma` tambem foi removido do escopo de Programas; #1794 e #1795 permanecem adiadas, mas o modelo ja documenta a relacao N:N Parceria→Programa.

**Fase 3 — Frontend Parceria e Programa:**

1. Tela de Parceria: cadastro, listagem, consulta, formalizacao, vigencias, aportes, saldo, encerramento e remocao.
2. Tela de Programa: cadastro, listagem e consulta, preparada para receber a integracao futura de aportes de Parceria.
3. Seletores de Instituicao: usar os endpoints de M008 para vincular Parceria a Instituicao.

**Fase 4 — Frontend Instituicao:**

1. Completar a experiencia de Instituicao apos o fluxo de Parceria e Programa estar operacional.
2. Incluir melhorias de usabilidade identificadas no uso do seletor de Instituicao por Parceria.

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
| Cadastro de Instituicoes | M008 | [#1748](https://github.com/leds-conectafapes/conectafapes-project/issues/1748) |
| Portal Admin — Parcerias | M010 | [#1724](https://github.com/leds-conectafapes/conectafapes-project/issues/1724) |
| Extrato do Projeto | M014 | [#1718](https://github.com/leds-conectafapes/conectafapes-project/issues/1718) |

---

## Estatisticas

| Metrica | Valor |
|---------|-------|
| **Total de issues acompanhadas** | 23 |
| **Desenvolvimento (M008)** | 4 ativas (2 removidas do escopo) |
| **Desenvolvimento (M010 refatorado)** | 11 (4 atualizadas + 7 novas; 2 fechadas) |
| **Desenvolvimento (M014)** | 5 |
| **Design de Produto** | 2 |
| **Discovery de Melhorias** | 1 |
| **Concluidas** | 4 |
| **Em andamento** | 0 |
| **Pendentes (PR fechado, replanejado)** | 6 |
| **Pendentes (To Do)** | 10 |
| **Omitidas/adiadas/removidas** | 3 M010 + 2 M008 |
| **% Concluido** | ~17% (4/23) |

### Progresso por Responsavel

| Responsavel | Total | Done | In Progress | To Do | Omitidas/adiadas | % |
|-------------|-------|------|-------------|-------|------------------|---|
| Vinicius | 15 | 4 | 0 | 8 | 3 | 27% |
| Manoel | 5 | 0 | 0 | 5 | 0 | 0% |
| Leticia | 2 | 0 | 0 | 2 | 0 | 0% |
| Marcela + Leticia | 1 | 0 | 0 | 1 | 0 | 0% |

### Progresso Detalhado

| # | Responsavel | Feature | Issue | Produto | Status |
|---|-------------|---------|-------|---------|--------|
| 1 | Vinicius | Cadastrar Instituicao | #1749 | Portal Admin | 🟢 Done — [PR #271](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/271) merged 2026-05-04 |
| 2 | Vinicius | Cadastrar UnidadeOrganizacional | #1750 | Portal Admin | ⚪ To Do — replanejada |
| 3 | Vinicius | Cadastrar Responsavel | #1751 | Portal Admin | ⚪ To Do — replanejada |
| 4 | Vinicius | Listar e Consultar Instituicoes | #1752 | Portal Admin | 🟢 Done — [PR #274](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/274) merged 2026-05-05 |
| 5 | Vinicius | Cadastrar e Formalizar Parceria (RN19) | #1739 | Portal Admin / EPA-07 | 🟢 Done — [PR #272](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/272) merged 2026-05-04 + [PR #276](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/276) |
| 6 | Vinicius | Registrar Aporte Financeiro (inflow) | #1740 | Portal Admin / EPA-07 | 🔵 In Progress — PR #264 fechado, replanejado |
| 7 | Vinicius | Listar e Consultar Parcerias | #1743 | Portal Admin / EPA-07 | 🟢 Done — [PR #273](https://github.com/leds-conectafapes/leds-conectafapes-backend-admin/pull/273) merged 2026-05-04 |
| 8 | Vinicius | Encerrar Parceria (cascata RI2) | #1744 | Portal Admin / EPA-07 | ⚪ Pendente — PR #267 fechado, replanejado |
| 9 | Vinicius | Registrar Vigencia (Aditivo) | #1791 | Portal Admin / EPA-07 | ⚪ Pendente — PR #263 fechado, replanejado |
| 10 | Vinicius | Registrar Aditivo de Aporte Financeiro | #1792 | Portal Admin / EPA-07 | ⚪ Pendente — PR #265 fechado, replanejado |
| 11 | Vinicius | Anexar Documentos a Parceria | #1793 | Portal Admin / EPA-07 | 🔴 Omitido — Documento fora do escopo |
| 12 | Vinicius | Registrar Aporte Parceria em Programa (N:N) | #1794 | Portal Admin / EPA-07 | 🔴 Adiado — aguarda M014; modelo permite multiplas Parcerias por Programa |
| 13 | Vinicius | Validar Invariante Temporal RN13 | #1795 | Portal Admin / EPA-07 | 🔴 Adiado — depende de #1794 |
| 14 | Vinicius | Consultar Saldo da Parceria | #1796 | Portal Admin / EPA-07 | ⚪ Pendente — PR #266 fechado, replanejado |
| 15 | Vinicius | Remover Parceria (RI3) | #1797 | Portal Admin / EPA-07 | ⚪ Pendente — PR #267 fechado, replanejado |
| 16 | Manoel | Extrato do Projeto (EPIC) | #1718 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 17 | Manoel | Listagem paginada do Extrato | #1721 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 18 | Manoel | Controle de Gastos do Projeto | #1719 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 19 | Manoel | Filtros do Extrato do Projeto | #1720 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 20 | Manoel | Detalhes do extrato conforme status | #1723 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 21 | Leticia | Discovery Prestacao de Contas | #1756 | Portal Admin + Portal Coordenador | ⚪ To Do |
| 22 | Leticia | Discovery Captacao de Iniciativas | #1757 | Portal Admin | ⚪ To Do |
| 23 | Marcela + Leticia | Jornadas e melhorias de usuario | #1755 | Cross-product | ⚪ To Do |

> **Legenda:** ⚪ To Do | 🔵 In Progress | 🟢 Done | 🔴 Omitido/Adiado/Removido

---

## Snapshot do Sprint Board (Sprint 32) — atualizado em 2026-05-08

> Fonte: [GitHub Project #43 — Conecta Fapes](https://github.com/orgs/leds-conectafapes/projects/43/views/3). Sprint 32 e a iteracao corrente do board e cobre o periodo desta sprint interna SPRINT-007. Esta secao reflete o estado atual de 57 itens tracked no projeto.

### Resumo por Status

| Status | Quantidade |
|--------|-----------|
| Done | 9 |
| Homologation | 27 |
| Homologation In Progress | 1 |
| In Validation | 4 |
| In Progress | 8 |
| Paused | 5 |
| To Do | 2 |
| Backlog | 1 |
| **Total** | **57** |

### Done (9)

| # | Repo | Titulo | Squad | Assignees |
|---|------|--------|-------|-----------|
| [#167](https://github.com/leds-conectafapes/leds-conectafapes-frontoffice-frontend/issues/167) | frontoffice-frontend | [Front] Enviar termino da bolsa no ultimo dia do ultimo mes | Pink | OficialMark |
| [#1653](https://github.com/leds-conectafapes/conectafapes-project/issues/1653) | conectafapes-project | [DevOps] Workflow de autoupdate para PRs | Blue | ManoelRL |
| [#1684](https://github.com/leds-conectafapes/conectafapes-project/issues/1684) | conectafapes-project | [DevOps] Padronizar protecao de branches main/develop | Blue | ManoelRL |
| [#1800](https://github.com/leds-conectafapes/conectafapes-project/issues/1800) | conectafapes-project | [Front-end] Adicionar Plano de atividades do bolsista | Pink | Vitorfdan |
| [#1821](https://github.com/leds-conectafapes/conectafapes-project/issues/1821) | conectafapes-project | [DevOps] Workflow de autoupdate para PRs | Green | vinicius-je |
| [#1822](https://github.com/leds-conectafapes/conectafapes-project/issues/1822) | conectafapes-project | [DevOps] Padronizar protecao de branches | Pink | marcelasfl |
| [#1823](https://github.com/leds-conectafapes/conectafapes-project/issues/1823) | conectafapes-project | [DevOps] Padronizar protecao de branches | Green | vinicius-je |
| [#1851](https://github.com/leds-conectafapes/conectafapes-project/issues/1851) | conectafapes-project | [FIX] Aviso de data final do projeto na Solicitacao de bolsa | Pink | marcelasfl |
| [#1865](https://github.com/leds-conectafapes/conectafapes-project/issues/1865) | conectafapes-project | [BUG] Permitir pedido de bolsa ate o ultimo dia do projeto | Pink | marcelasfl, OficialMark |

### Homologation (27)

| # | Repo | Titulo | Squad | Assignees |
|---|------|--------|-------|-----------|
| [#153](https://github.com/leds-conectafapes/leds-conectafapes-frontend-backoffice/issues/153) | frontend-backoffice | [REFACTOR] Telas Pagamento NuxtUi | Green | — |
| [#158](https://github.com/leds-conectafapes/leds-conectafapes-frontend-backoffice/issues/158) | frontend-backoffice | [REFACTOR] Visualizar Liberacao para nuxt.ui | Green | — |
| [#162](https://github.com/leds-conectafapes/leds-conectafapes-frontoffice-frontend/issues/162) | frontoffice-frontend | [Front] Renomear Cadastrar Bolsista para Solicitar Bolsa | Pink | Vitorfdan |
| [#172](https://github.com/leds-conectafapes/leds-conectafapes-frontoffice-frontend/issues/172) | frontoffice-frontend | [Front] Modal de confirmacao antes da mensagem de sucesso | Pink | rafableao |
| [#1720](https://github.com/leds-conectafapes/conectafapes-project/issues/1720) | conectafapes-project | [Frontend] Filtros do Extrato do Projeto | Blue | joaopbarcellos |
| [#1721](https://github.com/leds-conectafapes/conectafapes-project/issues/1721) | conectafapes-project | [Frontend] Listagem paginada do Extrato do Projeto | Blue | joaopbarcellos |
| [#1738](https://github.com/leds-conectafapes/conectafapes-project/issues/1738) | conectafapes-project | [Backend] Listagem de parcerias | Green | vinicius-je, GustavoACaetano |
| [#1801](https://github.com/leds-conectafapes/conectafapes-project/issues/1801) | conectafapes-project | [Backend] Resumo financeiro do projeto por ContaContabil | Blue | ManoelRL |
| [#1802](https://github.com/leds-conectafapes/conectafapes-project/issues/1802) | conectafapes-project | [Backend] Filtros da listagem do extrato | Blue | ManoelRL |
| [#1803](https://github.com/leds-conectafapes/conectafapes-project/issues/1803) | conectafapes-project | [Backend] Listagem paginada do extrato | Blue | ManoelRL |
| [#1804](https://github.com/leds-conectafapes/conectafapes-project/issues/1804) | conectafapes-project | [Backend] Detalhes do extrato conforme status | Blue | ManoelRL |
| [#1805](https://github.com/leds-conectafapes/conectafapes-project/issues/1805) | conectafapes-project | [Backend] Criacao de parceria | Green | vinicius-je |
| [#1806](https://github.com/leds-conectafapes/conectafapes-project/issues/1806) | conectafapes-project | [Backend] Anexo de documentos na parceria | Green | vinicius-je |
| [#1807](https://github.com/leds-conectafapes/conectafapes-project/issues/1807) | conectafapes-project | [Backend] Download de documentos da parceria | Green | vinicius-je |
| [#1809](https://github.com/leds-conectafapes/conectafapes-project/issues/1809) | conectafapes-project | [Backend] Importar Orcamento e ContaContabil do Sigfapes | Blue | guihocosta |
| [#1812](https://github.com/leds-conectafapes/conectafapes-project/issues/1812) | conectafapes-project | [Backend] Cadastro de Orcamento com ContaContabil | Blue | guihocosta |
| [#1826](https://github.com/leds-conectafapes/conectafapes-project/issues/1826) | conectafapes-project | [Backend] Criacao de instituicao | Green | GustavoACaetano |
| [#1828](https://github.com/leds-conectafapes/conectafapes-project/issues/1828) | conectafapes-project | [Front-end] Adequar Visualizar Liberacao para nuxt.ui | Green | harianadm |
| [#1829](https://github.com/leds-conectafapes/conectafapes-project/issues/1829) | conectafapes-project | [Front-end] Adequar Gerenciar Bonus de Pagamento | Green | harianadm |
| [#1830](https://github.com/leds-conectafapes/conectafapes-project/issues/1830) | conectafapes-project | [Front-end] Adequar Processar Remessa de Cadastro | Green | harianadm, RafaBMartins |
| [#1831](https://github.com/leds-conectafapes/conectafapes-project/issues/1831) | conectafapes-project | [Front-end] Adequar Gerenciar Cotas Pagamento | Green | RafaBMartins |
| [#1832](https://github.com/leds-conectafapes/conectafapes-project/issues/1832) | conectafapes-project | [Front-end] Adequar Editar dados de Pessoa | Green | RafaBMartins |
| [#1843](https://github.com/leds-conectafapes/conectafapes-project/issues/1843) | conectafapes-project | [Front-end] Adequar tela de calendario | Green | RafaBMartins |
| [#1846](https://github.com/leds-conectafapes/conectafapes-project/issues/1846) | conectafapes-project | [Front-end] Adicionar nome da mae em Meus dados | Pink | rafableao |
| [#1870](https://github.com/leds-conectafapes/conectafapes-project/issues/1870) | conectafapes-project | [Front-end] adicionar loading nos botoes | Pink | Vitorfdan |
| [#1879](https://github.com/leds-conectafapes/conectafapes-project/issues/1879) | conectafapes-project | [Backend] Filtros da listagem de prestacoes | Blue | ManoelRL |
| [#1881](https://github.com/leds-conectafapes/conectafapes-project/issues/1881) | conectafapes-project | [Backend] Contestacao + endpoints de revisao/rejeicao | Blue | ManoelRL |

### In Progress (8) + Homologation In Progress (1)

| # | Repo | Titulo | Squad | Assignees | Status |
|---|------|--------|-------|-----------|--------|
| [#1357](https://github.com/leds-conectafapes/conectafapes-project/issues/1357) | conectafapes-project | [Back-end] Estender bolsa - pagamento avancado | Pink | Victor-Marins-Dev | In Progress |
| [#1458](https://github.com/leds-conectafapes/conectafapes-project/issues/1458) | conectafapes-project | [Front-end] Excluir solicitacao de bolsa | Pink | Vitorfdan | In Progress |
| [#1722](https://github.com/leds-conectafapes/conectafapes-project/issues/1722) | conectafapes-project | [Back-end] Auth para servicos no novo modelo | Pink | OficialMark | In Progress |
| [#1723](https://github.com/leds-conectafapes/conectafapes-project/issues/1723) | conectafapes-project | [Frontend] Detalhes do extrato conforme status | Blue | joaopbarcellos | In Progress |
| [#1818](https://github.com/leds-conectafapes/conectafapes-project/issues/1818) | conectafapes-project | [FRONTEND] Tela de submissao de projeto | Green | vinicius-je, HeloisaBorchardt | In Progress |
| [#1820](https://github.com/leds-conectafapes/conectafapes-project/issues/1820) | conectafapes-project | [DevOps] Workflow de autoupdate (Pink) | Pink | marcelasfl | In Progress |
| [#1825](https://github.com/leds-conectafapes/conectafapes-project/issues/1825) | conectafapes-project | [Frontend] Criacao de parceria | Green | RafaBMartins | In Progress |
| [#1836](https://github.com/leds-conectafapes/conectafapes-project/issues/1836) | conectafapes-project | [Back-end] Reformulacao do Pre-Cadastro | Pink | OficialMark | In Progress |
| [#1839](https://github.com/leds-conectafapes/conectafapes-project/issues/1839) | conectafapes-project | [Front-end] Padronizacao de mensagens de erro | Pink | lukevds | Homologation In Progress |

### In Validation (4)

| # | Repo | Titulo | Squad | Assignees |
|---|------|--------|-------|-----------|
| [#1459](https://github.com/leds-conectafapes/conectafapes-project/issues/1459) | conectafapes-project | [Back-end] Excluir solicitacao de bolsa | Pink | Victor-Marins-Dev |
| [#1714](https://github.com/leds-conectafapes/conectafapes-project/issues/1714) | conectafapes-project | [Front-end] Tela do mapa financeiro | Green | vinicius-je, harianadm |
| [#1838](https://github.com/leds-conectafapes/conectafapes-project/issues/1838) | conectafapes-project | [Back-end] Cadastro completo em Meus dados | Pink | Victor-Marins-Dev |
| [#1840](https://github.com/leds-conectafapes/conectafapes-project/issues/1840) | conectafapes-project | [Front-end] Documento pagamento Banestes | Pink | marcelasfl |

### Paused (5)

| # | Titulo | Squad | Assignees |
|---|--------|-------|-----------|
| [#1814](https://github.com/leds-conectafapes/conectafapes-project/issues/1814) | [BACKEND] Endpoint p/ associar formulario ao item externo | Green | RobsonGarcia, vinicius-je, JoaoRicardoCetto |
| [#1815](https://github.com/leds-conectafapes/conectafapes-project/issues/1815) | [Front-end] Tela p/ associar Edital a formulario Dynamic Forms | Green | vinicius-je, HeloisaBorchardt |
| [#1816](https://github.com/leds-conectafapes/conectafapes-project/issues/1816) | [BACKEND] GET template do Edital | Green | vinicius-je, JoaoRicardoCetto |
| [#1817](https://github.com/leds-conectafapes/conectafapes-project/issues/1817) | [BACKEND] POST submissao de projeto | Green | vinicius-je, JoaoRicardoCetto |
| [#1835](https://github.com/leds-conectafapes/conectafapes-project/issues/1835) | [BUG] Edicao de bolsa em rascunho cria nova alocacao | Pink | lukevds |

### To Do (2) + Backlog (1)

| # | Titulo | Squad | Status |
|---|--------|-------|--------|
| [#1719](https://github.com/leds-conectafapes/conectafapes-project/issues/1719) | [Frontend] Controle de Gastos do Projeto | Blue | To Do |
| [#1882](https://github.com/leds-conectafapes/conectafapes-project/issues/1882) | [Backend] Pedido de revisao da prestacao com Contestacao | Blue | To Do |
| [#1849](https://github.com/leds-conectafapes/conectafapes-project/issues/1849) | [Back-end] Coluna ProjetoVersaoModalidadeId nao deve ser usada | Pink | Backlog |

### Distribuicao por Squad (Sprint 32)

| Squad | Done | Em validacao/homologacao | Em desenvolvimento | Pausado | Pendente | Total |
|-------|------|--------------------------|--------------------|---------|----------|-------|
| Blue | 2 | 9 | 1 | 0 | 2 | 14 |
| Green | 2 | 13 | 2 | 4 | 0 | 21 |
| Pink | 5 | 8 | 5 | 1 | 1 | 20 |
| **Total** | **9** | **30** | **8** | **5** | **3** | **55** + 2 sem squad |

> Nota: o Sprint Board tem cobertura mais ampla que a tabela "Features Comprometidas" desta sprint doc. SPRINT-007 ainda foca em entregas backend de Vinicius (M008/M010). Sprint 32 do board agrega trabalho cross-squad: prestacao de contas (Blue), refatoracao backoffice nuxt.ui (Green), portal coordenador (Pink), DevOps. Ambos os escopos coexistem.

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
