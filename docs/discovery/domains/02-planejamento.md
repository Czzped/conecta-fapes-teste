# Domain 02 — Planejamento e Estrategia

Definicao de diretrizes, plano estrategico, parcerias institucionais e programas de fomento. Glossario dos conceitos centrais em [../glossario.md](../glossario.md).

**Modulos que implementam este domain:** M010 (subdividido em tres subdominios: `planejamento/`, `programas/`, `parcerias/`).

---

## 2.1 Planejamento Estrategico

Definicao do plano estrategico da agencia e seus eixos, que orientam a criacao de programas de fomento e a alocacao de recursos. Um plano possui vigencia (data inicio e fim) e **so pode haver um plano ativo por vez** (RN09). Cada eixo pertence a exatamente um plano (RN08).

**Implementado por:** [M010 — subdominio planejamento/](../../implementation/modules/M010-planejamento-estrategia/planejamento/modelo-estrutural.md)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 2.1.1 | Cadastrar Plano Estrategico | Registrar plano com objetivos, metas e vigencia (data inicio e fim) | Diretoria da Agencia de Fomento | Art. 14 |
| 2.1.2 | Ativar Plano Estrategico | Tornar o plano o unico ativo; plano anterior e automaticamente desativado (RN09) | Diretoria da Agencia de Fomento | Art. 14 |
| 2.1.3 | Cadastrar Eixo Estrategico | Criar eixo vinculado ao plano; um eixo pertence a exatamente um plano (RN08) | Diretoria da Agencia de Fomento | — |
| 2.1.4 | Atualizar Plano / Eixo | Editar dados e vigencia do plano ou descricao do eixo | Diretoria da Agencia de Fomento | — |

## 2.2 Gestao de Parcerias

Parcerias sao instrumentos formais de cooperacao entre a agencia e uma ou mais **Instituicoes** (RN10, cadastradas em M008). Uma Parceria possui **Vigencia** (original + aditivos), **AporteFinanceiro** recebido das Instituicoes envolvidas, **Documentos** regularizadores e pode destinar aportes a Programas via `AporteFinanceiroParceriaPrograma` (N:N, RN11).

A vigencia efetiva e derivada: `vigenciaInicioCorrente = MIN(Vigencia.dataInicio)` e `vigenciaFimCorrente = MAX(Vigencia.dataFim)` (RN15). A primeira Vigencia tem `isAditivo = false`; alteracoes posteriores sao novas Vigencias com `isAditivo = true` contendo justificativa e termo aditivo (RN06). Analogamente, o primeiro AporteFinanceiro tem `isAditivo = false`; novos aportes sao aditivos (RN17). Todo AporteFinanceiro exige Documento classificado como `Termo de Descentralizacao` (RN12) e origem em Instituicao (RN04).

O saldo da Parceria e `SUM(AporteFinanceiro.valorInvestido) − SUM(AporteFinanceiroParceriaPrograma.valor)`, sempre `>= 0` (RN14). Estados: `EmElaboracao`, `Vigente`, `Suspensa`, `Encerrada`.

**Implementado por:** [M010 — subdominio parcerias/](../../implementation/modules/M010-planejamento-estrategia/parcerias/modelo-estrutural.md)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 2.2.1 | Cadastrar Parceria | Criar parceria em estado `EmElaboracao` com nome, numero do processo, dataAssinatura, objetivo e **Vigencia original** (`isAditivo = false`) vinculada a uma ou mais Instituicoes (RN10) | Servidor da Area de Parcerias | Art. 3, X; Art. 28, I |
| 2.2.2 | Adicionar Instituicao a Parceria | Vincular Instituicoes (cadastradas em M008) a uma Parceria existente | Servidor da Area de Parcerias | Art. 3, X |
| 2.2.3 | Registrar Aporte Financeiro (original) | Registrar primeiro aporte da Parceria (`isAditivo = false`) com origem em Instituicao, valor e Documento classificado como `Termo de Descentralizacao` (RN04, RN12) | Servidor da Area de Parcerias | Art. 25, III; Art. 28, II |
| 2.2.4 | Registrar Aporte Financeiro Aditivo | Registrar novo aporte (`isAditivo = true`) apos existir pelo menos um original, com `dataAporte` posterior (RN17) | Servidor da Area de Parcerias | Art. 25, III; Art. 28, II |
| 2.2.5 | Editar / Remover Aporte Aditivo | Editar ou remover aporte com `isAditivo = true`, recalculando o saldo; rejeita se o saldo resultante ficar negativo (RN14, RN18) | Servidor da Area de Parcerias | — |
| 2.2.6 | Registrar Aditivo de Vigencia | Criar nova `Vigencia` com `isAditivo = true`, `dataAssinatura` posterior a original, `dataFim` posterior a `vigenciaFimCorrente` anterior, com justificativa e termo aditivo anexado (RN06) | Servidor da Area de Parcerias | Art. 28, I; Art. 6, par. unico |
| 2.2.7 | Anexar Documento a Parceria | Anexar Documento classificado por TipoDocumento (M008) regularizador da Parceria | Servidor da Area de Parcerias | Art. 6, par. unico |
| 2.2.8 | Formalizar Parceria (EmElaboracao → Vigente) | Transicionar para `Vigente` quando atende: `dataAssinatura` + pelo menos um AporteFinanceiro original + Vigencia original + pelo menos um Documento + hoje dentro de `[vigenciaInicioCorrente, vigenciaFimCorrente]` (RN19) | Servidor da Area de Parcerias | Art. 28, I |
| 2.2.9 | Registrar Aporte a Programa | Destinar valor da Parceria a um Programa via `AporteFinanceiroParceriaPrograma`; valor `>= 0`, exige Parceria vigente (RN11) e respeito a RN13 (datas do Programa dentro da vigencia da Parceria) | Servidor da Area de Parcerias | Art. 25, III; Art. 28, II; Art. 3, X |
| 2.2.10 | Consultar Saldo da Parceria | Consultar saldo derivado `SUM(AporteFinanceiro.valorInvestido) − SUM(AporteFinanceiroParceriaPrograma.valor)` (RN14) | Servidor da Area de Parcerias | Art. 3, II |
| 2.2.11 | Suspender Parceria | Interromper temporariamente a Parceria (Vigente → Suspensa) | Servidor da Area de Parcerias | Art. 6, par. unico |
| 2.2.12 | Reativar Parceria | Retornar Parceria suspensa para Vigente (Suspensa → Vigente) | Servidor da Area de Parcerias | — |
| 2.2.13 | Encerrar Parceria (com cascata) | Transicionar para `Encerrada` por solicitacao do usuario ou expiracao automatica (`vigenciaFimCorrente < hoje`); exige `justificativa` obrigatoria e encerra em cascata todos os Programas aportados apos confirmacao explicita (RI2) | Servidor da Area de Parcerias | Art. 15, III |
| 2.2.14 | Remover Parceria | Remover Parceria apenas se nao houver `AporteFinanceiroParceriaPrograma` associado (RI3) | Servidor da Area de Parcerias | — |
| 2.2.15 | Dashboard de Parcerias | Painel consolidado com status, vigencia, saldo e aportes destinados por todas as parcerias | Servidor da Area de Parcerias | Art. 3, 3; Art. 14, VII |

## 2.3 Gestao de Programas

Programas sao o instrumento de execucao do fomento. Cada Programa esta vinculado a pelo menos um **Eixo Estrategico** (RN01), e deve ter exatamente uma **Instituicao demandante** (RN16, cadastrada em M008). Recebe recursos internos (LOA, Tesouro, Federal) e aportes de Parcerias via `AporteFinanceiroParceriaPrograma` (N:N, RN11). Nao existe relacao direta "parceria de referencia" — toda ligacao Parceria ↔ Programa ocorre por aporte (RN02).

**Invariante temporal (RN13):** as datas do Programa devem estar contidas na vigencia de toda Parceria que nele aporta (`vigenciaInicioCorrente` ≤ Programa.dataInicio e Programa.dataFim ≤ `vigenciaFimCorrente`). Validada ao registrar aporte, alterar datas do Programa e criar nova Vigencia.

Estados: `EmElaboracao`, `Ativo`, `Suspenso`, `Encerrado`. Um Programa nao pode ser excluido se houver editais vinculados (RI1).

**Implementado por:** [M010 — subdominio programas/](../../implementation/modules/M010-planejamento-estrategia/programas/modelo-estrutural.md)

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 2.3.1 | Cadastrar Programa | Criar programa em `EmElaboracao` com acoes apoiadas, modalidade de financiamento, datas, Eixo(s) estrategico(s) (RN01) e Instituicao demandante (RN16) | Servidor da Area Tecnica | Art. 4; Art. 14, VII |
| 2.3.2 | Associar Programa a Eixo | Vincular (ou revincular) programa a um ou mais Eixos do plano ativo (RN01) | Servidor da Area Tecnica | — |
| 2.3.3 | Definir Instituicao Demandante | Designar exatamente uma Instituicao demandante do Programa (RN16) | Servidor da Area Tecnica | — |
| 2.3.4 | Cadastro de Comite Gestor | Manter cadastro de membros de camaras e comites para avaliacao de merito do Programa | Servidor da Area Tecnica | Art. 12 |
| 2.3.5 | Adicionar Recursos Internos ao Programa | Registrar dotacao orcamentaria conforme LOA/LDO/PPA e outras fontes internas | Servidor da Area Tecnica | Art. 25 |
| 2.3.6 | Receber Aporte de Parceria | Aceitar `AporteFinanceiroParceriaPrograma` oriundo de uma Parceria (RN11); valida RN13 (datas do Programa dentro da vigencia da Parceria aportadora) | Servidor da Area Tecnica | Art. 25, III; Art. 28, II; Art. 3, X |
| 2.3.7 | Ativar Programa | Transicionar `EmElaboracao → Ativo` quando atendidos pre-requisitos (Instituicao demandante, Eixo, recursos) | Servidor da Area Tecnica | Art. 14, VII |
| 2.3.8 | Suspender Programa | Interromper temporariamente o Programa (Ativo → Suspenso) | Servidor da Area Tecnica | Art. 6, par. unico |
| 2.3.9 | Reativar Programa | Retornar Programa suspenso para Ativo (Suspenso → Ativo) | Servidor da Area Tecnica | — |
| 2.3.10 | Encerrar Programa | Transicionar para `Encerrado` (por solicitacao ou via cascata de encerramento de Parceria — RI2) | Servidor da Area Tecnica | Art. 15, III |
| 2.3.11 | Remover Programa | Remover Programa apenas se nao houver editais vinculados (RI1) | Servidor da Area Tecnica | — |
| 2.3.12 | Visualizar Captacoes Vinculadas | Consultar captacoes (M011) e iniciativas contratadas (M003) vinculadas ao Programa | Servidor da Area Tecnica | — |
| 2.3.13 | Dashboard de Programas | Painel consolidado com status, eixo, demandante, recursos internos, aportes recebidos de Parcerias e captacoes vinculadas | Servidor da Area Tecnica | Art. 14, VII; Art. 3, 3 |
