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
| M003 e M011 | Referenciam programa e parceria no ciclo de edital |
| M016, M018 e M019 | Consomem referencias para contabilidade, BI e transparencia |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece `Instituicao`, `Documento` e `TipoDocumento` |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| RegistrarPlanoEstrategico | Command | Criar ou atualizar plano estrategico com sua vigencia | nome, descricao, dataInicio, dataFim | `PlanoEstrategico` persistido | RN08, RN09 | Vigencia informada | Plano ativo duplicado, vigencia invalida | Nao | Diretoria autorizada | API interna/backoffice a definir |
| CadastrarEixoEstrategico | Command | Cadastrar eixo estrategico dentro de um plano | planoId, nome, descricao, prioridade | `EixoEstrategico` criado | RN08 | Plano estrategico existente | Plano inexistente, codigo duplicado | Nao | Diretoria | API interna/backoffice a definir |
| CriarPrograma | Command | Registrar programa associado a eixos estrategicos e a uma Instituicao demandante | nome, eixo, resumo, dataInicio, dataFim, instituicaoDemandanteId | `Programa` criado | RN01, RN02, RN16, RI1 | Eixo estrategico existente; Instituicao demandante existe em M008 | Programa sem eixo, Instituicao demandante inexistente ou ausente | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| RemoverPrograma | Command | Remover um Programa que nao possua editais vinculados (RI1) | programaId | Programa removido | RI1 | Programa existente; sem editais vinculados em M011 | Programa inexistente, com editais vinculados | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| RegistrarRecursoDePrograma | Command | Registrar recurso interno de um Programa (LOA, Tesouro, Federal, etc.) | programaId, origem, valor, dataAporte, documento | `RecursoPrograma` registrado | RN13 (indiretamente via Programa) | Programa existente; origem valida; valor > 0 | Programa inexistente, origem invalida, saldo fonte insuficiente | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| CadastrarComiteGovernanca | Command | Cadastrar/atualizar membros do comite de governanca de um Programa | programaId, membros `[{pessoaId, papel}]` | Comite atualizado | — | Programa existente; pessoas existem em M008 | Programa inexistente, papel invalido, duplicidade de Presidente | Sim | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| CriarParceria | Command | Registrar parceria com Vigencia original (`isAditivo = false`), objetivo e instituicoes envolvidas | nome, numeroDProcesso, dataAssinatura, objetivo, instituicoesIds, vigenciaOriginal `{dataInicio, dataFim, dataAssinatura, documento}` | `Parceria` criada com Vigencia original (`isAditivo = false`) associada | RN03, RN06, RN10, RN15, RI2 | Pelo menos uma Instituicao informada; Vigencia original com `dataInicio < dataFim` | Instituicao inexistente, parceria sem instituicao, Vigencia original invalida | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| FormalizarParceria | Command | Transicionar a Parceria de `EmElaboracao` para `Vigente` apos preenchimento completo | parceriaId | Parceria no estado `Vigente` | RN19 | `dataAssinatura` preenchida; pelo menos 1 `AporteFinanceiro` original; pelo menos 1 `Documento` anexado; hoje em `[vigenciaInicioCorrente, vigenciaFimCorrente]` | Pre-condicoes nao satisfeitas: dataAssinatura ausente, sem AporteFinanceiro, sem Documento, fora da vigencia | Sim | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| RegistrarAporteFinanceiro | Command | Registrar aporte financeiro com origem em instituicao; o Documento informado e sempre classificado como "Termo de Descentralizacao" pelo sistema (RN12) | parceriaId, instituicaoId, valorInvestido, dataAporte, documentoId, isAditivo | `AporteFinanceiro` registrado; Documento vinculado classificado como "Termo de Descentralizacao" | RN03, RN04, RN12, RN17 | Parceria com dataAssinatura preenchida; Documento informado; se `isAditivo = true`: ja existe aporte original e `dataAporte > aporteOriginal.dataAporte` | Parceria sem acordo assinado, instituicao inexistente, documento ausente, aditivo sem aporte original previo, dataAporte anterior ao aporte original | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| EditarAporteFinanceiroAditivo | Command | Editar campos (valor, dataAporte, documento) de um aporte com `isAditivo = true`; recalcula o saldo da Parceria | aporteId, novoValor?, novaDataAporte?, novoDocumentoId? | `AporteFinanceiro` atualizado; `saldo` recomputado | RN14, RN18 | Aporte existe e tem `isAditivo = true`; saldo resultante >= total ja aportado em Programas | Aporte inexistente, aporte original (isAditivo=false), saldo resultante tornaria-se insuficiente para cobrir aportes em Programas | Sim | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| RemoverAporteFinanceiroAditivo | Command | Remover um aporte com `isAditivo = true`; recalcula o saldo da Parceria | aporteId | `AporteFinanceiro` removido; `saldo` recomputado | RN14, RN18 | Aporte existe e tem `isAditivo = true`; saldo resultante apos remocao >= total ja aportado em Programas | Aporte inexistente, aporte original (isAditivo=false), remocao tornaria saldo insuficiente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| RegistrarVigencia | Command | Registrar Vigencia aditivo (`isAditivo = true`) que prorroga a vigencia da parceria com justificativa e termo aditivo | parceriaId, dataInicio, dataFim, dataAssinatura, justificativa, documento | Nova `Vigencia` com `isAditivo = true`; `vigenciaFimCorrente` passa a ser `MAX(Vigencia.dataFim)` | RN06, RN15 | Parceria no estado Vigente; `dataAssinatura` posterior a `dataAssinatura` da Vigencia original; `dataFim` posterior a `vigenciaFimCorrente` anterior; justificativa e documento informados | Parceria nao vigente, dataAssinatura anterior a Vigencia original, dataFim invalida, justificativa ou documento ausentes | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| AnexarDocumentoAParceria | Command | Vincular a uma parceria um Documento classificado por TipoDocumento (catalogos em M008) | parceriaId, documentoId | `Documento` anexado a Parceria | — | Parceria, Documento e TipoDocumento existentes em M008 | Parceria inexistente, Documento inexistente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| RegistrarAporteFinanceiroParceriaPrograma | Command | Registrar aporte financeiro de uma Parceria em um Programa | parceriaId, programaId, valor, dataAporte | `AporteFinanceiroParceriaPrograma` registrado | RN11, RN13, RN14 | Parceria e Programa existentes; Parceria Vigente; `valor >= 0`; `valor <= saldo corrente`; periodo do Programa em `[vigenciaInicioCorrente, vigenciaFimCorrente]` da Parceria | Parceria/Programa inexistente, parceria nao vigente, valor negativo, saldo insuficiente, periodo do Programa fora da vigencia da Parceria | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| ConsultarSaldoParceria | Query | Consultar saldo financeiro corrente de uma Parceria e composicao (aportes recebidos e aportes realizados em programas) | parceriaId | `{ saldo, totalRecebido, totalAportadoEmProgramas, vigenciaFimCorrente }` | RN14, RN15 | Parceria existente | Parceria inexistente | N/A | Diretoria, Analista da Agencia de Fomento | API interna/backoffice a definir |
| GerarRelatorioParceria | Query | Gerar relatorio financeiro consolidado da parceria com valor total aportado (recebido de Instituicoes), valor alocado (destinado a Programas) e valor executado/pago (RubricaProjeto.valorExecutado via M013), com detalhamento por programa e percentual de execucao | parceriaId | `{ resumoFinanceiro: { valorTotalAportado, valorAlocado, saldoNaoAlocado, valorExecutado, saldoNaoExecutado, percentualExecutado }, porPrograma: [{ programaId, nomePrograma, valorAlocado, valorExecutado, saldoNaoExecutado }] }` | RN14 | Parceria existente | Parceria inexistente | N/A | Gestor da Parceria, Diretoria | API interna/backoffice a definir |
| ConsultarPainelFinanceiroParcerias | Query | Consultar painel geral de parcerias com KPIs financeiros por linha (valorTotalAportado, valorAlocado, saldoNaoAlocado, valorExecutado, saldoNaoExecutado, percentualExecutado) e consolidado agregado; suporta filtros combinaveis (estado, instituicaoId, programaId, vigenciaAtiva), ordenacao por qualquer coluna financeira e paginacao com consolidado sobre o total filtrado | estado?, instituicaoId?, programaId?, vigenciaAtiva?, orderBy?, orderDir?, page?, pageSize? | `{ consolidado: { totalParcerias, valorTotalAportado, valorAlocado, saldoNaoAlocado, valorExecutado, saldoNaoExecutado, percentualExecutado }, parcerias: [...], paginacao: { page, pageSize, total } }` | RN14 | — | Filtro invalido | N/A | Gestor da Parceria, Diretoria | API interna/backoffice a definir |
| EncerrarParceria | Command | Encerrar Parceria (gatilho manual ou automatico por expiracao) com encerramento em cascata dos Programas vinculados, apos confirmacao explicita do usuario. Exige justificativa. | parceriaId, confirmarCascata (boolean, default false), dataEncerramento, justificativa, origemGatilho (`USUARIO` ou `EXPIRACAO_VIGENCIA`) | `Parceria` no estado `Encerrada`; todos os Programas vinculados encerrados; evento `ProgramaEncerradoPorCascata` emitido por Programa | RI2 | Parceria existente; justificativa informada; usuario deve confirmar cascata apos ver lista de Programas afetados | Parceria inexistente; justificativa ausente; `confirmarCascata = false` (retorna lista dos Programas a encerrar para confirmacao) | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| RemoverParceria | Command | Remover uma Parceria em caso de erro de cadastro; bloqueada se houver vinculo com Programas | parceriaId | Parceria removida junto com suas Vigencias, AporteFinanceiros e vinculos de Documento | RI3 | Parceria existente; `nenhum AporteFinanceiroParceriaPrograma` vinculado | Parceria inexistente; vinculada a um ou mais Programas (lista retornada) | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| VerificarVigenciaExpirada | Job | Executado periodicamente (diariamente); para cada Parceria `Vigente` ou `Suspensa` com `vigenciaFimCorrente < hoje`, notifica o usuario responsavel e abre fluxo de confirmacao de encerramento (nao encerra automaticamente sem confirmacao) | — | Notificacoes enviadas; pendencias de confirmacao criadas | RI2 | — | — | Sim | Sistema (agendado) | Scheduler interno |
| SuspenderParceria | Command | Suspender temporariamente uma Parceria Vigente, interrompendo aportes | parceriaId, motivo | Parceria no estado `Suspensa` | — | Parceria no estado `Vigente` | Parceria inexistente, parceria nao vigente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| ReativarParceria | Command | Reativar uma Parceria Suspensa, retornando-a para Vigente | parceriaId, observacoes? | Parceria no estado `Vigente` | — | Parceria no estado `Suspensa`; hoje em `[vigenciaInicioCorrente, vigenciaFimCorrente]` | Parceria inexistente, parceria nao suspensa, fora da vigencia | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| AtualizarParceria | Command | Atualizar dados cadastrais da Parceria (nome, objetivo, numeroDProcesso) — nao altera Vigencias nem aportes | parceriaId, nome?, objetivo?, numeroDProcesso? | Parceria atualizada | — | Parceria existente; nao encerrada | Parceria inexistente, parceria encerrada | Sim | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| DesanexarDocumentoDaParceria | Command | Desvincular Documento da Parceria (Documento permanece em M008) | parceriaId, documentoId | Documento desvinculado da Parceria | — | Parceria e Documento existentes; vinculo existe | Parceria/Documento inexistente, vinculo ausente | Nao | Servidor da Area de Parcerias (Agencia de Fomento) | API interna/backoffice a definir |
| AtivarPrograma | Command | Ativar um Programa em planejamento, habilitando criacao de editais | programaId | Programa no estado `ATIVO` | RN01 | Programa em `EM_PLANEJAMENTO`; pelo menos um eixo vinculado; Comite de Governanca definido | Programa inexistente, estado invalido, sem eixo, sem comite | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| SuspenderPrograma | Command | Suspender um Programa Ativo, bloqueando novos editais | programaId, motivo | Programa no estado `SUSPENSO` | — | Programa no estado `ATIVO` | Programa inexistente, estado invalido | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| ReativarPrograma | Command | Reativar um Programa Suspenso | programaId, observacoes? | Programa no estado `ATIVO` | — | Programa no estado `SUSPENSO` | Programa inexistente, estado invalido | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
| EncerrarPrograma | Command | Encerrar um Programa (transicao de estado, diferente de RemoverPrograma) | programaId, dataEncerramento, observacoes? | Programa no estado `ENCERRADO` | RI1 | Programa em `ATIVO` ou `SUSPENSO`; sem editais em andamento | Programa inexistente, estado invalido, editais em andamento | Nao | Servidor da Area Tecnica (Agencia de Fomento) | API interna/backoffice a definir |
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
  "instituicoesIds": ["INST-2026-010", "INST-2026-020"],
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
    "saldo": 0.0
  }
}
```

> `saldo` retornado na criacao e sempre `0.0` — Parceria recem-criada nao possui `AporteFinanceiro` nem `AporteFinanceiroParceriaPrograma`. O saldo e derivado (RN14) e evolui conforme aportes sao registrados.

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_SEM_INSTITUICAO | A parceria deve ter ao menos uma Instituicao envolvida (RN10). |
| VIGENCIA_ORIGINAL_INVALIDA | A Vigencia original possui `dataInicio` >= `dataFim`. |
| VIGENCIA_ORIGINAL_AUSENTE | A Vigencia original e obrigatoria (RN15). |
| INSTITUICAO_NAO_ENCONTRADA | Uma das Instituicoes informadas nao foi encontrada em M008. |

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
  "saldoCorrente": 500000.0
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

### RegistrarAporteFinanceiroParceriaPrograma

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
  "saldoCorrente": 350000.0
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_NAO_VIGENTE | A parceria nao esta Vigente (RN11). |
| VALOR_NEGATIVO | O valor do aporte nao pode ser negativo (RN11). |
| SALDO_INSUFICIENTE | Saldo da Parceria insuficiente para o valor informado (RN14). |
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

### GerarRelatorioParceria

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
    "valorTotalAportado": 700000.0,
    "valorAlocado": 230000.0,
    "saldoNaoAlocado": 470000.0,
    "valorExecutado": 140000.0,
    "saldoNaoExecutado": 90000.0,
    "percentualExecutado": 60.87
  },
  "porPrograma": [
    {
      "programaId": "PRG-2026-001",
      "nomePrograma": "Programa de Dados Publicos",
      "valorAlocado": 150000.0,
      "valorExecutado": 90000.0,
      "saldoNaoExecutado": 60000.0
    },
    {
      "programaId": "PRG-2026-002",
      "nomePrograma": "Programa de Inovacao",
      "valorAlocado": 80000.0,
      "valorExecutado": 50000.0,
      "saldoNaoExecutado": 30000.0
    }
  ]
}
```

> **Nota de integracao:** `valorExecutado` e calculado por `SUM(RubricaProjeto.valorExecutado)` de todos os projetos vinculados a cada programa via M003, consultado em M013. A operacao agrega dados cross-modulo; o modulo M013 deve expor `ConsultarExecucaoPorPrograma(programaId)` para consumo interno.

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_NAO_ENCONTRADA | A parceria informada nao foi encontrada. |
| ACESSO_NEGADO | O usuario nao possui permissao para acessar o relatorio desta parceria. |

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
  "saldo": 350000.0,
  "totalRecebido": 500000.0,
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
  "valorTotalAportado": 620000.0
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
- `RegistrarAporteFinanceiro` incrementa o `saldo` corrente da Parceria (RN14).
- `RegistrarAporteFinanceiroParceriaPrograma` decrementa o `saldo` da Parceria e aumenta o total recebido pelo Programa.
- Atributos derivados `vigenciaInicioCorrente`, `vigenciaFimCorrente` e `saldo` sao recomputados em cada leitura e expostos via `ConsultarSaldoParceria`.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural — Planejamento: [planejamento/modelo-estrutural.md](planejamento/modelo-estrutural.md)
- Modelo estrutural — Programas: [programas/modelo-estrutural.md](programas/modelo-estrutural.md)
- Modelo estrutural — Parcerias: [parcerias/modelo-estrutural.md](parcerias/modelo-estrutural.md)
- Modelo comportamental — Programas: [programas/modelo-comportamental.md](programas/modelo-comportamental.md)
- Modelo comportamental — Parcerias: [parcerias/modelo-comportamental.md](parcerias/modelo-comportamental.md)
