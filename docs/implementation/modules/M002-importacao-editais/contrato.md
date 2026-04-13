# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M002 como contexto tecnico de selecao, importacao, sincronizacao e conciliacao de dados legados do SigFapes. O modulo nao e dono das entidades de negocio sincronizadas; ele expoe operacoes de aplicacao para mover e reconciliar dados entre o legado e os modulos canonicos.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Gerente da Area Tecnica | Seleciona editais, acompanha execucoes, solicita reprocessamentos e consulta ocorrencias |
| M003 e demais modulos operacionais | Recebem dados canonicos atualizados apos importacao e sincronizacao |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| SigFapes | Sistema externo | Origem de editais, projetos, alocacoes e pessoas via Web Service |
| M003 | Modulo interno | Ownership canonico de Edital, Iniciativa, Projeto, CotaEdital, AlocacaoBolsista, Coordenador, Orientador e Bolsista |
| M008 | Modulo interno | Ownership canonico de PessoaFisica e AreaTecnica |
| M001 | Modulo interno | Ownership canonico de VersaoNivel |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| ListarEditaisDisponiveisNoSigFapes | Query | Exibir os editais disponiveis para selecao de importacao | filtros de busca | Lista de `EditalSigFapes` disponiveis | RN01, RN08 | Carga inicial ou catalogo disponivel | Falha de comunicacao com a origem, nenhuma opcao disponivel | N/A | Gerente da Area Tecnica | API interna/backoffice a definir |
| SelecionarEditaisParaImportacao | Command | Registrar quais editais entrarao no fluxo tecnico de importacao e qual area tecnica os acompanhara | editais selecionados, areaTecnica | `SelecaoImportacaoEdital` ativa por edital | RN01, RN07 | Editais disponiveis e AreaTecnica informada | AreaTecnica obrigatoria, edital inexistente ou indisponivel | Sim, deve reaproveitar a selecao ativa existente quando nao houver mudanca de intencao | Gerente da Area Tecnica | API interna/backoffice a definir |
| ExecutarImportacaoDeEditaisSelecionados | Async Job | Importar editais selecionados, seus projetos, alocacoes e pessoas associadas | conjunto de selecoes ativas ou execucao solicitada | `ExecucaoImportacao` concluida, vinculos `*SigFapes` atualizados | RN02, RN03, RN05, RN06, RN08, RNF01, RNF02, RNF03 | Existem editais selecionados e integracao com SigFapes disponivel | Falha no Web Service, inconsistencias de vinculo, ocorrencias de conciliacao | Sim, conforme RN06 | Sistema ou Gerente da Area Tecnica | Job manual/agendado a definir + Web Service SigFapes |
| ConsultarResumoDoEditalImportado | Query | Exibir o estado atual de um edital importado e seu contexto tecnico de sincronizacao | identificador do edital importado | Resumo do edital, projetos, alocacoes e ultima sincronizacao | RN03, RN08 | Edital ja importado | Edital inexistente | N/A | Gerente da Area Tecnica | API interna/backoffice a definir |
| ReprocessarExecucaoImportacao | Command | Solicitar novo processamento de uma execucao com falha ou com ocorrencias a partir dos vinculos tecnicos existentes | identificador da execucao, escopo do reprocessamento | Nova `ExecucaoImportacao` solicitada | RN03, RN06, RNF01, RNF03 | Execucao anterior existente | Execucao inexistente, escopo invalido, reprocessamento nao permitido para estado atual | Nao | Gerente da Area Tecnica | API interna/backoffice a definir |
| ExecutarSincronizacaoDoSigFapes | Async Job | Atualizar registros importados e incorporar novos registros relevantes antes de operacoes criticas | edital(es) alvo ou execucao global | `ExecucaoImportacao` do tipo `SINCRONIZACAO`, `OcorrenciaSincronizacao` e vinculos atualizados | RN02, RN03, RN06, RN08, RNF01, RNF02, RNF03 | Existe ao menos um edital importado | Falha de comunicacao, divergencias de conciliacao, dados orfaos | Sim, conforme RN06 | Sistema ou Gerente da Area Tecnica | Job manual/agendado a definir + Web Service SigFapes |
| ConsultarOcorrenciasDeSincronizacao | Query | Visualizar relatorio tecnico e ocorrencias da ultima importacao/sincronizacao | identificador da execucao, filtros por nivel ou entidade | Lista de `OcorrenciaSincronizacao` e totais da execucao | RN03, RN04, RNF01 | Execucao existente | Execucao inexistente | N/A | Gerente da Area Tecnica | API interna/backoffice a definir |
| ConsultarVinculosTecnicosDoLegado | Query | Inspecionar o estado dos vinculos entre registros do SigFapes e entidades canonicas do ConectaFAPES | filtros por entidade, `idSigFapes`, statusVinculo | Lista detalhada de `EditalSigFapes`, `ProjetoSigFapes`, `AlocacaoSigFapes` ou `PessoaSigFapes` | RN02, RN05, RN08 | Existencia de registros importados | Nenhum vinculo encontrado para o filtro informado | N/A | Gerente da Area Tecnica | API interna/backoffice a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato descreve a intencao tecnica da operacao; endpoint, fila, scheduler e serializacao concreta continuam `a definir`.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "execucaoCodigo": "IMP-2026-001"
    }
  }
}
```

## Exemplos JSON por Operacao

### ListarEditaisDisponiveisNoSigFapes

**Exemplo de entrada**

```json
{
  "filtros": {
    "ano": 2026,
    "termoBusca": "pesquisa",
    "somenteDisponiveis": true
  }
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "idSigFapes": 1045,
      "titulo": "Edital Pesquisa Aplicada 2026",
      "dataCriacaoOrigem": "2026-02-10",
      "statusVinculo": "A_IMPORTAR"
    }
  ],
  "total": 1
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| SIGFAPES_INDISPONIVEL | Nao foi possivel consultar os editais disponiveis no SigFapes neste momento. |
| FILTRO_IMPORTACAO_INVALIDO | Os filtros informados para consulta de editais do SigFapes sao invalidos. |

### SelecionarEditaisParaImportacao

**Exemplo de entrada**

```json
{
  "editaisSigFapes": [
    1045,
    1048
  ],
  "areaTecnicaId": "AT-DGPP-01"
}
```

**Exemplo de saida**

```json
{
  "selecoes": [
    {
      "idSigFapes": 1045,
      "dataSelecao": "2026-04-13",
      "ativa": true,
      "areaTecnicaId": "AT-DGPP-01"
    },
    {
      "idSigFapes": 1048,
      "dataSelecao": "2026-04-13",
      "ativa": true,
      "areaTecnicaId": "AT-DGPP-01"
    }
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| AREA_TECNICA_OBRIGATORIA | E obrigatorio informar a area tecnica responsavel pela importacao. |
| EDITAL_SIGFAPES_INDISPONIVEL | Um dos editais selecionados nao esta disponivel para importacao. |

### ExecutarImportacaoDeEditaisSelecionados

**Exemplo de entrada**

```json
{
  "idsSigFapes": [
    1045,
    1048
  ],
  "tipoExecucao": "IMPORTACAO"
}
```

**Exemplo de saida**

```json
{
  "execucao": {
    "codigo": "IMP-2026-001",
    "tipo": "IMPORTACAO",
    "status": "PENDENTE",
    "totalRegistrosProcessados": 0,
    "totalOcorrencias": 0
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| NENHUMA_SELECAO_ATIVA | Nao existem editais selecionados para iniciar a importacao. |
| SIGFAPES_INDISPONIVEL | O Web Service do SigFapes esta indisponivel para iniciar a importacao. |
| EXECUCAO_IMPORTACAO_FALHOU | A execucao de importacao foi interrompida por falha tecnica ou divergencia de dados. |

### ConsultarResumoDoEditalImportado

**Exemplo de entrada**

```json
{
  "idSigFapes": 1045
}
```

**Exemplo de saida**

```json
{
  "editalSigFapes": {
    "idSigFapes": 1045,
    "statusVinculo": "VINCULADO",
    "ultimaSincronizacao": "2026-04-13T14:15:00Z"
  },
  "projetos": 12,
  "alocacoes": 48,
  "ultimaExecucao": {
    "codigo": "IMP-2026-001",
    "status": "CONCLUIDA_COM_OCORRENCIAS"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| EDITAL_IMPORTADO_NAO_ENCONTRADO | O edital importado informado nao foi encontrado. |
| RESUMO_IMPORTACAO_INDISPONIVEL | O resumo tecnico da importacao nao pode ser montado neste momento. |

### ReprocessarExecucaoImportacao

**Exemplo de entrada**

```json
{
  "execucaoCodigo": "IMP-2026-001",
  "escopo": {
    "entidades": [
      "ProjetoSigFapes",
      "AlocacaoSigFapes"
    ]
  }
}
```

**Exemplo de saida**

```json
{
  "execucao": {
    "codigo": "IMP-2026-002",
    "tipo": "IMPORTACAO",
    "status": "PENDENTE",
    "reprocessaExecucaoCodigo": "IMP-2026-001"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| EXECUCAO_IMPORTACAO_NAO_ENCONTRADA | A execucao informada para reprocessamento nao foi encontrada. |
| ESCOPO_REPROCESSAMENTO_INVALIDO | O escopo informado para reprocessamento e invalido. |
| REPROCESSAMENTO_NAO_PERMITIDO | A execucao informada nao pode ser reprocessada no estado atual. |

### ExecutarSincronizacaoDoSigFapes

**Exemplo de entrada**

```json
{
  "idsSigFapes": [
    1045
  ],
  "tipoExecucao": "SINCRONIZACAO"
}
```

**Exemplo de saida**

```json
{
  "execucao": {
    "codigo": "SIN-2026-003",
    "tipo": "SINCRONIZACAO",
    "status": "PENDENTE",
    "totalRegistrosProcessados": 0,
    "totalOcorrencias": 0
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| NENHUM_EDITAL_IMPORTADO | Nao existe edital importado elegivel para sincronizacao. |
| SIGFAPES_INDISPONIVEL | O Web Service do SigFapes esta indisponivel para sincronizacao. |
| DIVERGENCIA_CONCILIACAO | A sincronizacao encontrou divergencias que exigem conciliacao manual. |

### ConsultarOcorrenciasDeSincronizacao

**Exemplo de entrada**

```json
{
  "execucaoCodigo": "SIN-2026-003",
  "filtros": {
    "nivel": "ERRO",
    "entidadeOrigem": "ProjetoSigFapes"
  }
}
```

**Exemplo de saida**

```json
{
  "execucao": {
    "codigo": "SIN-2026-003",
    "status": "CONCLUIDA_COM_OCORRENCIAS"
  },
  "ocorrencias": [
    {
      "dataOcorrencia": "2026-04-13T14:20:00Z",
      "nivel": "ERRO",
      "entidadeOrigem": "ProjetoSigFapes",
      "identificadorOrigem": "77441",
      "mensagem": "Projeto sem vinculo canonico correspondente.",
      "resolvida": false
    }
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| EXECUCAO_IMPORTACAO_NAO_ENCONTRADA | A execucao informada nao foi encontrada para consulta de ocorrencias. |
| FILTRO_OCORRENCIA_INVALIDO | Os filtros informados para ocorrencias de sincronizacao sao invalidos. |

### ConsultarVinculosTecnicosDoLegado

**Exemplo de entrada**

```json
{
  "entidade": "ProjetoSigFapes",
  "statusVinculo": "DESATUALIZADO"
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "entidade": "ProjetoSigFapes",
      "idSigFapes": 77441,
      "statusVinculo": "DESATUALIZADO",
      "ultimaSincronizacao": "2026-04-10T09:30:00Z",
      "entidadeCanonicaId": "PROJ-2026-014"
    }
  ],
  "total": 1
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| VINCULO_LEGADO_NAO_ENCONTRADO | Nenhum vinculo tecnico foi encontrado para o filtro informado. |
| FILTRO_VINCULO_INVALIDO | Os filtros informados para consulta de vinculos tecnicos sao invalidos. |

## Mapeamento de Transporte

- `Listar*`, `Consultar*`, `Selecionar*` e `Reprocessar*`: `API interna/backoffice a definir`.
- `ExecutarImportacaoDeEditaisSelecionados` e `ExecutarSincronizacaoDoSigFapes`: `job manual/agendado a definir`.
- Integracao externa obrigatoria: `Web Service SigFapes`.
- Nenhum endpoint HTTP, fila ou evento publico foi fixado nesta rodada.

## Eventos e Efeitos Colaterais

- `ExecutarImportacaoDeEditaisSelecionados` deve criar ou atualizar registros `EditalSigFapes`, `ProjetoSigFapes`, `AlocacaoSigFapes` e `PessoaSigFapes`, vinculando-os as entidades canonicas.
- `ExecutarSincronizacaoDoSigFapes` deve registrar ocorrencias de divergencia, novos registros e dados atualizados.
- `ReprocessarExecucaoImportacao` deve reaproveitar os vinculos tecnicos ja estabelecidos sempre que possivel.
- O modulo deve disponibilizar os dados sincronizados para uso pelos modulos donos de dominio, sem redefinir ownership nem regras de negocio.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- EPICs: [EPIC-M002-001](epics/EPIC-M002-001.md), [EPIC-M002-002](epics/EPIC-M002-002.md), [EPIC-M002-003](epics/EPIC-M002-003.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
