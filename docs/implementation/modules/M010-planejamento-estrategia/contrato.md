# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M010 como contexto responsavel por plano estrategico, eixos, programas, parcerias e recursos associados ao fomento.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Diretoria da Agencia de Fomento | Mantem planejamento estrategico |
| Servidor da Area Tecnica (Agencia de Fomento) | Mantem programas de fomento |
| Servidor da Area de Parcerias (Agencia de Fomento) | Mantem parcerias, aportes e documentacao regularizadora |
| M003 e M011 | Referenciam programa e parceria no ciclo de iniciativa e edital |
| M016, M018 e M019 | Consomem referencias para contabilidade, BI e transparencia |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece `Instituicao`, `Documento` e `TipoDocumento` |
| M016 | Modulo interno | Fornece `ContaBancaria` como destino do deposito em `RegistrarAporteFinanceiro` (`contaBancariaDestinoId`) — implementacao deferida para pos-M014 |
| M003 | Modulo interno | Fornece `ConsultarIniciativasPorPrograma` e consumo consolidado por iniciativa |
| M014 | Modulo interno | Fornece movimentacoes e prestacoes de contas que alimentam consolidacoes de consumo por iniciativa |
| M016 / Acao Transversal | Modulo interno | Fornece politica/faixas de Acao Transversal e recebe a Taxa de Gestao de Parcerias calculada na Parceria |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| RegistrarPlanoEstrategico | Command | Criar ou atualizar plano estrategico com sua vigencia | nome, descricao, dataInicio, dataFim | `PlanoEstrategico` persistido | RN08, RN09 | Vigencia informada | Plano ativo duplicado, vigencia invalida | Nao | Diretoria autorizada | API interna/backoffice a definir |
| CadastrarEixoEstrategico | Command | Cadastrar eixo estrategico dentro de um plano | planoId, nome, descricao, prioridade | `EixoEstrategico` criado | RN08 | Plano estrategico existente | Plano inexistente, codigo duplicado | Nao | Diretoria | API interna/backoffice a definir |
| CriarPrograma | Command | Registrar programa associado a eixos estrategicos e a uma Instituicao demandante | nome, eixo, resumo, dataInicio, dataFim, instituicaoDemandanteId | `Programa` criado | RN01, RN02, RN16, RI1 | Eixo estrategico existente; Instituicao demandante existe em M008 | Programa sem eixo, Instituicao demandante inexistente ou ausente | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| RemoverPrograma | Command | Remover um Programa sem impacto quando nao possui nenhuma Iniciativa vinculada (RI1) | programaId | Programa removido | RI1 | Programa existente; sem Iniciativas vinculadas em M003 | Programa inexistente, com Iniciativas vinculadas | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| CadastrarComiteGovernanca | Command | Cadastrar/atualizar membros do comite de governanca de um Programa | programaId, membros `[{pessoaId, papel}]` | Comite atualizado | — | Programa existente; pessoas existem em M008 | Programa inexistente, papel invalido, duplicidade de Presidente | Sim | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| CriarParceria | Command | Registrar parceria com Vigencia original (`isAditivo = false`), objetivo e Instituicao vinculada | nome, numeroDProcesso, dataAssinatura, objetivo, instituicaoId, vigenciaOriginal `{dataInicio, dataFim, dataAssinatura, documento}` | `Parceria` criada com Vigencia original (`isAditivo = false`) associada | RN03, RN06, RN10, RN15, RI2 | Exatamente uma Instituicao informada; Vigencia original com `dataInicio < dataFim` | Instituicao inexistente, parceria sem instituicao, Vigencia original invalida | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| FormalizarParceria | Command | Transicionar a Parceria de `EmElaboracao` para `Vigente` apos preenchimento completo | parceriaId | Parceria no estado `Vigente` | RN19 | `dataAssinatura` preenchida; pelo menos 1 `AporteFinanceiro` original; pelo menos 1 `Documento` anexado; hoje em `[vigenciaInicioCorrente, vigenciaFimCorrente]` | Pre-condicoes nao satisfeitas: dataAssinatura ausente, sem AporteFinanceiro, sem Documento, fora da vigencia | Sim | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| RegistrarAporteFinanceiro | Command | Registrar aporte financeiro com origem na Instituicao vinculada a Parceria, depositado em conta bancaria da agencia (M016); o Documento informado e sempre classificado como "Termo de Descentralizacao" pelo sistema (RN12). Quando aplicavel, calcula a Taxa de Gestao de Parcerias na Parceria e disponibiliza ao M016. | parceriaId, instituicaoId, valorInvestido, dataAporte, documentoId, contaBancariaDestinoId, isAditivo | `AporteFinanceiro` registrado; Documento vinculado classificado como "Termo de Descentralizacao"; Taxa de Gestao de Parcerias calculada; `saldoAlocavelEmProgramas` recomputado | RN03, RN04, RN12, RN17, RN20, RN21, RN22, RN23 | Parceria com dataAssinatura preenchida; Instituicao do aporte igual a Instituicao vinculada a Parceria; Documento informado; ContaBancaria existente em M016; se `isAditivo = true`: ja existe aporte original e `dataAporte > aporteOriginal.dataAporte` | Parceria sem acordo assinado, instituicao divergente da Parceria, instituicao inexistente, documento ausente, contaBancaria inexistente, aditivo sem aporte original previo, dataAporte anterior ao aporte original, politica de Acao Transversal nao encontrada quando obrigatoria | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| EditarAporteFinanceiroAditivo | Command | Editar campos (valor, dataAporte, documento) de um aporte com `isAditivo = true`; recalcula somente a Taxa de Gestao de Parcerias vinculada ao aditivo editado e o saldo alocavel em Programas | aporteId, novoValor?, novaDataAporte?, novoDocumentoId? | `AporteFinanceiro` atualizado; Taxa de Gestao do aditivo e `saldoAlocavelEmProgramas` recomputados | RN14, RN18, RN22, RN23 | Aporte existe e tem `isAditivo = true`; saldo alocavel resultante >= total ja aportado em Programas | Aporte inexistente, aporte original (isAditivo=false), saldo alocavel resultante tornaria-se insuficiente para cobrir aportes em Programas | Sim | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| RemoverAporteFinanceiroAditivo | Command | Remover um aporte com `isAditivo = true`; remove ou estorna somente a Taxa de Gestao de Parcerias vinculada ao aditivo removido e recalcula o saldo alocavel em Programas | aporteId | `AporteFinanceiro` removido; Taxa de Gestao do aditivo removida/estornada; `saldoAlocavelEmProgramas` recomputado | RN14, RN18, RN22, RN23 | Aporte existe e tem `isAditivo = true`; saldo alocavel resultante apos remocao >= total ja aportado em Programas | Aporte inexistente, aporte original (isAditivo=false), remocao tornaria saldo alocavel insuficiente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| RegistrarVigencia | Command | Registrar Vigencia aditivo (`isAditivo = true`) que prorroga a vigencia da parceria com justificativa e termo aditivo | parceriaId, dataInicio, dataFim, dataAssinatura, justificativa, documento | Nova `Vigencia` com `isAditivo = true`; `vigenciaFimCorrente` passa a ser `MAX(Vigencia.dataFim)` | RN06, RN15 | Parceria no estado Vigente; `dataAssinatura` posterior a `dataAssinatura` da Vigencia original; `dataFim` posterior a `vigenciaFimCorrente` anterior; justificativa e documento informados | Parceria nao vigente, dataAssinatura anterior a Vigencia original, dataFim invalida, justificativa ou documento ausentes | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| AnexarDocumentoAParceria | Command | Vincular a uma parceria um Documento classificado por TipoDocumento (catalogos em M008) | parceriaId, documentoId | `Documento` anexado a Parceria | — | Parceria, Documento e TipoDocumento existentes em M008 | Parceria inexistente, Documento inexistente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| RegistrarAporteFinanceiroPrograma | Command | Registrar aporte financeiro de uma Parceria em um Programa, consumindo apenas o saldo liquido alocavel da Parceria | parceriaId, programaId, valor, dataAporte | `AporteFinanceiroPrograma` registrado | RN11, RN13, RN14, RN20, RN21, RN22 | Parceria e Programa existentes; Parceria Vigente; `valor >= 0`; `valor <= saldoAlocavelEmProgramas`; periodo do Programa em `[vigenciaInicioCorrente, vigenciaFimCorrente]` da Parceria | Parceria/Programa inexistente, parceria nao vigente, valor negativo, saldo alocavel insuficiente, periodo do Programa fora da vigencia da Parceria | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| ConsultarSaldoParceria | Query | Consultar saldo financeiro corrente de uma Parceria e composicao (aportes recebidos, Taxa de Gestao de Parcerias e aportes realizados em programas) | parceriaId | `{ valorBrutoRecebido, valorTaxaGestao, saldoAlocavelEmProgramas, totalAportadoEmProgramas, vigenciaFimCorrente }` | RN14, RN15, RN20, RN21, RN22 | Parceria existente | Parceria inexistente | N/A | Diretoria, Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConsultarDashboardLocalParceria | Query | Consultar dashboard local da parceria com valor bruto recebido, Taxa de Gestao de Parcerias, saldo alocavel em Programas, valor aportado, valor alocado, valor consumido e detalhamento por programa, rubrica e instituicao parceira | parceriaId | `{ resumoFinanceiro: { valorTotalInvestido, valorTaxaGestao, saldoAlocavelEmProgramas, valorAportado, valorAlocado, valorConsumido, saldoDisponivel, percentualAportado, percentualAlocado, percentualConsumido, percentualDisponivel }, porPrograma: [{ programaId, nomePrograma, valorAportado, valorAlocado, valorConsumido, saldoDisponivel, percentualConsumido }], porRubrica: [...] }` | RN14, RN20, RN21, RN22 | Parceria existente | Parceria inexistente | N/A | Gestor da Parceria, Diretoria | API interna/backoffice a definir |
| ConsultarDashboardGlobalParcerias | Query | Consultar dashboard global de parcerias com KPIs financeiros consolidados (valorTotalInvestido, valorTaxaGestao, saldoAlocavelEmProgramas, valorAportado, valorAlocado, valorConsumido, saldoDisponivel e percentuais), consumo por programa, consumo por rubrica e instituicoes parceiras; suporta filtros combinaveis (estado, instituicaoId, programaId, vigenciaAtiva), ordenacao por coluna financeira e paginacao quando houver listagem associada | estado?, instituicaoId?, programaId?, vigenciaAtiva?, orderBy?, orderDir?, page?, pageSize? | `{ consolidado: { valorTotalInvestido, valorTaxaGestao, saldoAlocavelEmProgramas, valorAportado, valorAlocado, valorConsumido, saldoDisponivel, percentualAportado, percentualAlocado, percentualConsumido, percentualDisponivel }, consumoPorPrograma: [...], consumoPorRubrica: [...], instituicoesParceiras: [...], paginacao?: { page, pageSize, total } }` | RN14, RN20, RN21, RN22 | — | Filtro invalido | N/A | Gestor da Parceria, Diretoria | API interna/backoffice a definir |
| EncerrarParceria | Command | Encerrar Parceria `VIGENTE` ou `SUSPENSA` com justificativa obrigatoria e encerramento em cascata dos Programas associados. | parceriaId, justificativa | `Parceria` no estado `ENCERRADA`, com `DataFim` e `JustificativaEncerramento`; todos os Programas associados passam para `ENCERRADO_POR_PARCERIA` | RI2 | Parceria existente; status `VIGENTE` ou `SUSPENSA`; justificativa informada | Parceria inexistente; status invalido; justificativa ausente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | `POST /api/captacaoprojetos/parcerias/{id}/encerrar` |
| RemoverParceria | Command | Remover uma Parceria em caso de erro de cadastro; bloqueada se houver vinculo com Programas | parceriaId | Parceria removida junto com suas Vigencias, AporteFinanceiros e vinculos de Documento | RI3 | Parceria existente; `nenhum AporteFinanceiroPrograma` vinculado | Parceria inexistente; vinculada a um ou mais Programas (lista retornada) | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| VerificarVigenciaExpirada | Job | Executado periodicamente; para cada Parceria `VIGENTE` ou `SUSPENSA` com `vigenciaFimCorrente < hoje`, notifica o responsavel e abre pendencia operacional. Nao encerra automaticamente sem chamada explicita de `EncerrarParceria`. | — | Notificacoes enviadas; pendencias criadas | RI2 | — | — | Sim | Sistema (agendado) | Scheduler interno |
| SuspenderParceria | Command | Suspender temporariamente uma Parceria `VIGENTE`, registrar historico e suspender em cascata Programas associados que estejam `VIGENTE`. | parceriaId, isAreaTecnica, motivo | Parceria no estado `SUSPENSA`; `SuspensaoParceria` ativa; Programas afetados em `SUSPENSO_POR_PARCERIA` com `SuspensaoPrograma` ativo | RI4 | Parceria no estado `VIGENTE`; motivo informado; origem resolvida a partir do token | Parceria inexistente, parceria nao vigente, motivo ausente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | `POST /api/captacaoprojetos/parcerias/{id}/suspender` |
| ReativarParceria | Command | Reativar uma Parceria `SUSPENSA`, fechar historico ativo e reverter a cascata de Programas. | parceriaId, isAreaTecnica | Parceria no estado `VIGENTE`; `SuspensaoParceria` e `SuspensaoPrograma` ativos fechados; Programas `SUSPENSO_POR_PARCERIA` retornam para `VIGENTE` | RI4 | Parceria no estado `SUSPENSA`; existe `SuspensaoParceria` ativa | Parceria inexistente, parceria nao suspensa, suspensao ativa inexistente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | `POST /api/captacaoprojetos/parcerias/{id}/reativar` |
| AtualizarParceria | Command | Atualizar dados cadastrais da Parceria (nome, objetivo, numeroDProcesso) — nao altera Vigencias nem aportes | parceriaId, nome?, objetivo?, numeroDProcesso? | Parceria atualizada | — | Parceria existente; nao encerrada | Parceria inexistente, parceria encerrada | Sim | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| DesanexarDocumentoDaParceria | Command | Desvincular Documento da Parceria (Documento permanece em M008) | parceriaId, documentoId | Documento desvinculado da Parceria | — | Parceria e Documento existentes; vinculo existe | Parceria/Documento inexistente, vinculo ausente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| AtivarPrograma | Command | Ativar um Programa em planejamento, habilitando criacao de editais | programaId | Programa no estado `ATIVO` | RN01 | Programa em `EM_PLANEJAMENTO`; pelo menos um eixo vinculado; Comite de Governanca definido | Programa inexistente, estado invalido, sem eixo, sem comite | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| SuspenderPrograma | Command | Suspender um Programa Ativo, bloqueando novos editais | programaId, motivo | Programa no estado `SUSPENSO` | — | Programa no estado `ATIVO` | Programa inexistente, estado invalido | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| ReativarPrograma | Command | Reativar um Programa Suspenso | programaId, observacoes? | Programa no estado `ATIVO` | — | Programa no estado `SUSPENSO` | Programa inexistente, estado invalido | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| EncerrarPrograma | Command | Encerrar um Programa (transicao de estado, diferente de RemoverPrograma) | programaId, dataEncerramento, observacoes? | Programa no estado `ENCERRADO` | RI1 | Programa em `ATIVO` ou `SUSPENSO`; sem Iniciativas em andamento que bloqueiem o encerramento | Programa inexistente, estado invalido, Iniciativas em andamento | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| AtualizarPrograma | Command | Atualizar dados cadastrais do Programa (nome, resumo, dataInicio, dataFim) — RN13 valida se datas afetam aportes | programaId, nome?, resumo?, dataInicio?, dataFim? | Programa atualizado | RN13 | Programa existente; se ha aportes em Parcerias, as datas novas devem respeitar vigencia das parcerias aportantes | Programa inexistente, programa encerrado, periodo fora da vigencia de Parceria aportante | Sim | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| ConsultarPortfolioEstrategico | Query | Consultar plano, programas, parcerias e aportes consolidados | plano, programa, parceria, estado | Portfolio consolidado | RN01, RN02, RN09 | Filtro informado | Nenhum registro encontrado | N/A | Diretoria ou analista autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa endpoint, serializacao ou armazenamento de documentos.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "programa": "PROG-2026-01"
    }
  }
}
```

## Exemplos JSON por Operacao

### RegistrarPlanoEstrategico

**Exemplo de entrada**

```json
{
  "nome": "Plano Estrategico 2026-2029",
  "descricao": "Diretrizes para o ciclo de fomento 2026-2029.",
  "dataInicio": "2026-01-01",
  "dataFim": "2029-12-31"
}
```

> O campo `ativo` nao e input: o sistema define o plano como ativo apenas se nao existir outro ativo no periodo (RN09).

**Exemplo de saida**

```json
{
  "planoEstrategico": {
    "id": "PE-2026-01",
    "ativo": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PLANO_ATIVO_DUPLICADO | Ja existe outro plano estrategico ativo no periodo informado. |
| VIGENCIA_PLANO_INVALIDA | A vigencia informada para o plano estrategico e invalida. |

### CriarPrograma

**Exemplo de entrada**

```json
{
  "nome": "Programa de Dados Publicos",
  "eixos": ["EIXO-TRANSFORMACAO-DIGITAL"],
  "resumo": "Programa voltado a projetos de dados e inovacao.",
  "dataInicio": "2026-01-01",
  "dataFim": "2028-12-31",
  "instituicaoDemandanteId": "INST-2026-010"
}
```

**Exemplo de saida**

```json
{
  "programa": {
    "id": "PROG-2026-01",
    "estado": "EM_PLANEJAMENTO",
    "instituicaoDemandanteId": "INST-2026-010"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PROGRAMA_SEM_EIXO | O programa deve estar vinculado a pelo menos um eixo estrategico. |
| EIXO_ESTRATEGICO_NAO_ENCONTRADO | Um dos eixos informados nao foi encontrado. |
| INSTITUICAO_DEMANDANTE_AUSENTE | O programa deve ter uma Instituicao demandante (RN16). |
| INSTITUICAO_NAO_ENCONTRADA | A Instituicao demandante informada nao foi encontrada em M008. |

### CriarParceria

**Exemplo de entrada**

```json
{
  "nome": "Parceria Inovacao 2026",
  "numeroDProcesso": "PRC-2026-001",
  "dataAssinatura": "2026-03-01",
  "objetivo": "Apoiar iniciativas de pesquisa aplicada.",
  "instituicaoId": "INST-2026-010",
  "vigenciaOriginal": {
    "dataInicio": "2026-03-01",
    "dataFim": "2028-12-31",
    "dataAssinatura": "2026-03-01",
    "documento": "DOC-TC-2026-001"
  }
}
```

**Exemplo de saida**

```json
{
  "parceria": {
    "id": "PAR-2026-03",
    "estado": "EmElaboracao",
    "vigenciaInicioCorrente": "2026-03-01",
    "vigenciaFimCorrente": "2028-12-31",
    "valorBrutoRecebido": 0.0,
    "valorTaxaGestao": 0.0,
    "saldoAlocavelEmProgramas": 0.0
  }
}
```

> `saldoAlocavelEmProgramas` retornado na criacao e sempre `0.0` — Parceria recem-criada nao possui `AporteFinanceiro`, Taxa de Gestao de Parcerias nem `AporteFinanceiroPrograma`. O saldo e derivado (RN14/RN22) e evolui conforme aportes e taxas de gestao sao registrados.

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_SEM_INSTITUICAO | A parceria deve ter exatamente uma Instituicao vinculada (RN10). |
| VIGENCIA_ORIGINAL_INVALIDA | A Vigencia original possui `dataInicio` >= `dataFim`. |
| VIGENCIA_ORIGINAL_AUSENTE | A Vigencia original e obrigatoria (RN15). |
| INSTITUICAO_NAO_ENCONTRADA | A Instituicao informada nao foi encontrada em M008. |

### RegistrarVigencia

**Exemplo de entrada**

```json
{
  "parceriaId": "PAR-2026-03",
  "dataInicio": "2026-03-01",
  "dataFim": "2029-12-31",
  "dataAssinatura": "2027-10-15",
  "justificativa": "Continuidade das atividades de pesquisa.",
  "documento": "DOC-TA-2027-001"
}
```

**Exemplo de saida**

```json
{
  "vigencia": {
    "id": "VIG-2027-002",
    "parceriaId": "PAR-2026-03",
    "isAditivo": true,
    "dataFim": "2029-12-31"
  },
  "vigenciaFimCorrente": "2029-12-31"
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_NAO_VIGENTE | A parceria nao esta no estado Vigente. |
| ADITIVO_DATA_ASSINATURA_INVALIDA | `dataAssinatura` do aditivo anterior a da Vigencia original (RN06). |
| ADITIVO_DATA_FIM_INVALIDA | `dataFim` nao e posterior a `vigenciaFimCorrente` atual (RN06). |
| VIGENCIA_ORIGINAL_DUPLICADA | Tentativa de registrar segunda Vigencia com `isAditivo = false` (RN15). |

### RegistrarAporteFinanceiro

**Exemplo de entrada**

```json
{
  "parceriaId": "PAR-2026-03",
  "instituicaoId": "INST-2026-010",
  "valorInvestido": 500000.0,
  "dataAporte": "2026-03-10",
  "documentoTermoDescentralizacaoId": "DOC-TD-2026-001",
  "contaBancariaDestinoId": "CB-2026-002",
  "isAditivo": false
}
```

**Exemplo de saida**

```json
{
  "aporteFinanceiro": {
    "id": "APO-2026-001",
    "parceriaId": "PAR-2026-03",
    "valorInvestido": 500000.0,
    "isAditivo": false
  },
  "acaoTransversal": {
    "valorBaseCalculo": 500000.0,
    "percentualAplicado": 5.0,
    "valorTaxaGestao": 25000.0,
    "moduloDestino": "M016"
  },
  "saldoAlocavelEmProgramas": 475000.0
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_SEM_ACORDO | A parceria nao possui `dataAssinatura` (RN03). |
| TD_DOCUMENTO_AUSENTE | Documento formalizador (Termo de Descentralizacao) obrigatorio (RN12). |
| TD_TIPO_INVALIDO | O Documento informado nao possui TipoDocumento "Termo de Descentralizacao" (RN12). |
| ADITIVO_SEM_ORIGINAL | Aditivo exige aporte original previo (RN17). |
| ADITIVO_DATA_APORTE_INVALIDA | `dataAporte` do aditivo anterior a do aporte original (RN17). |

### RegistrarAporteFinanceiroPrograma

**Exemplo de entrada**

```json
{
  "parceriaId": "PAR-2026-03",
  "programaId": "PROG-2026-01",
  "valor": 150000.0,
  "dataAporte": "2026-04-10"
}
```

**Exemplo de saida**

```json
{
  "aporteFinanceiroParceriaPrograma": {
    "id": "AFP-2026-001",
    "parceriaId": "PAR-2026-03",
    "programaId": "PROG-2026-01",
    "valor": 150000.0
  },
  "saldoAlocavelEmProgramas": 325000.0
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_NAO_VIGENTE | A parceria nao esta Vigente (RN11). |
| VALOR_NEGATIVO | O valor do aporte nao pode ser negativo (RN11). |
| SALDO_INSUFICIENTE | Saldo alocavel em Programas insuficiente para o valor informado (RN14/RN22). |
| PROGRAMA_FORA_DA_VIGENCIA | O periodo do Programa extrapola a vigencia da Parceria aportante (RN13). |

### AnexarDocumentoAParceria

**Exemplo de entrada**

```json
{
  "parceriaId": "PAR-2026-03",
  "documentoId": "DOC-ANEXO-2026-005"
}
```

**Exemplo de saida**

```json
{
  "parceriaId": "PAR-2026-03",
  "documentoId": "DOC-ANEXO-2026-005",
  "anexado": true
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_NAO_ENCONTRADA | A parceria informada nao foi encontrada. |
| DOCUMENTO_NAO_ENCONTRADO | O Documento informado nao foi encontrado em M008. |

### ConsultarDashboardLocalParceria

**Exemplo de entrada**

```json
{ "parceriaId": "PAR-2026-03" }
```

**Exemplo de saida**

```json
{
  "parceriaId": "PAR-2026-03",
  "nomeParceria": "Parceria Inovacao 2026",
  "vigenciaInicioCorrente": "2026-03-01",
  "vigenciaFimCorrente": "2028-12-31",
  "estado": "Vigente",
  "resumoFinanceiro": {
    "valorTotalInvestido": 700000.0,
    "valorTaxaGestao": 35000.0,
    "saldoAlocavelEmProgramas": 435000.0,
    "valorAportado": 190000.0,
    "valorAlocado": 230000.0,
    "valorConsumido": 140000.0,
    "saldoDisponivel": 435000.0,
    "percentualAportado": 82.61,
    "percentualAlocado": 32.86,
    "percentualConsumido": 60.87,
    "percentualDisponivel": 67.14
  },
  "porPrograma": [
    {
      "programaId": "PRG-2026-001",
      "nomePrograma": "Programa de Dados Publicos",
      "valorAportado": 120000.0,
      "valorAlocado": 150000.0,
      "valorConsumido": 90000.0,
      "saldoDisponivel": 60000.0,
      "percentualConsumido": 60.0
    },
    {
      "programaId": "PRG-2026-002",
      "nomePrograma": "Programa de Inovacao",
      "valorAportado": 70000.0,
      "valorAlocado": 80000.0,
      "valorConsumido": 50000.0,
      "saldoDisponivel": 30000.0,
      "percentualConsumido": 62.5
    }
  ],
  "porRubrica": [
    {
      "rubrica": "Bolsas",
      "valorAportado": 90000.0,
      "valorAlocado": 120000.0,
      "valorConsumido": 76000.0,
      "saldoDisponivel": 44000.0,
      "percentualConsumido": 63.33
    }
  ]
}
```

> **Nota de integracao:** `valorConsumido` e calculado pela soma do consumo consolidado das iniciativas vinculadas a cada programa, consultado em M003. As movimentacoes detalhadas permanecem no M014 e podem alimentar a visao consolidada do M003.

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_NAO_ENCONTRADA | A parceria informada nao foi encontrada. |
| ACESSO_NEGADO | O usuario nao possui permissao para acessar o dashboard desta parceria. |

---

### ConsultarSaldoParceria

**Exemplo de entrada**

```json
{ "parceriaId": "PAR-2026-03" }
```

**Exemplo de saida**

```json
{
  "parceriaId": "PAR-2026-03",
  "valorBrutoRecebido": 500000.0,
  "valorTaxaGestao": 25000.0,
  "saldoAlocavelEmProgramas": 325000.0,
  "totalAportadoEmProgramas": 150000.0,
  "vigenciaInicioCorrente": "2026-03-01",
  "vigenciaFimCorrente": "2028-12-31"
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_NAO_ENCONTRADA | A parceria informada nao foi encontrada. |

### ConsultarPortfolioEstrategico

**Exemplo de entrada**

```json
{
  "estadoPrograma": "EM_PLANEJAMENTO",
  "estadoParceria": "Vigente"
}
```

**Exemplo de saida**

```json
{
  "programas": 4,
  "parcerias": 3,
  "valorTotalInvestido": 620000.0
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PORTFOLIO_NAO_ENCONTRADO | Nenhum registro estrategico foi encontrado para os filtros informados. |
| FILTRO_PORTFOLIO_INVALIDO | Os filtros informados para o portfolio estrategico sao invalidos. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Nenhum endpoint ou integracao documental foi estabilizado nesta rodada.

## Eventos e Efeitos Colaterais

- `CriarPrograma` disponibiliza referencia canonica para M003, M011, M016, M018 e M019.
- `CriarParceria` cria simultaneamente a Parceria e a Vigencia original (`isAditivo = false`); emite evento de `ParceriaCriada`.
- `RegistrarVigencia` atualiza `vigenciaFimCorrente` (derivado) e pode destravar aportes Parceria-Programa antes invalidos por RN13.
- `RegistrarAporteFinanceiro` incrementa o valor bruto recebido da Parceria e, quando aplicavel, calcula Taxa de Gestao de Parcerias vinculada ao aporte original ou ao aditivo registrado. Aditivos calculam sobre o valor do proprio aditivo e nao recalculam retroativamente taxas anteriores (RN20/RN23).
- `RegistrarAporteFinanceiroPrograma` decrementa o `saldoAlocavelEmProgramas` da Parceria e aumenta o total recebido pelo Programa; o Programa nao recalcula Acao Transversal.
- Atributos derivados `vigenciaInicioCorrente`, `vigenciaFimCorrente`, `valorBrutoRecebido`, `valorTaxaGestao` e `saldoAlocavelEmProgramas` sao recomputados em cada leitura e expostos via `ConsultarSaldoParceria`.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural — Planejamento: [planejamento/modelo-estrutural.md](planejamento/modelo-estrutural.md)
- Modelo estrutural — Programas: [programas/modelo-estrutural.md](programas/modelo-estrutural.md)
- Modelo estrutural — Parcerias: [parcerias/modelo-estrutural.md](parcerias/modelo-estrutural.md)
- Modelo comportamental — Programas: [programas/modelo-comportamental.md](programas/modelo-comportamental.md)
- Modelo comportamental — Parcerias: [parcerias/modelo-comportamental.md](parcerias/modelo-comportamental.md)
