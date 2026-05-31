# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M011 como contexto de configuracao e instancia da captacao, incluindo cronograma da captacao, selecao de formularios, aportes financeiros, faixas de financiamento, recebimento de propostas, avaliacao ad hoc, revisao de resultado e publicacao do resultado final.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Area Tecnica associada a captacao | Executa avaliacao documental, distribuicao, consolidacao, revisao e publicacao de resultados |
| Analista da Agencia de Fomento | Configura cronograma da captacao, seleciona formularios e regras da captacao |
| M022 | Consome propostas aprovadas no resultado final para contratacao/outorga |
| Revisores ad hoc | Sao associados operacionalmente aos captacoes configuradas |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Consome a referencia da captacao quando o projeto contratado passa para gestao pos-contratacao |
| M010 | Modulo interno | Fornece `Programa` e `Parceria` como origens de aportes financeiros da captacao |
| M021 | Modulo interno | Fornece formularios publicados e versionados para submissao, avaliacao ad hoc, revisao e anexos |
| M022 | Modulo interno | Consome propostas aprovadas no resultado final para formalizar contratacao/outorga |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| ConfigurarCronogramaDaCaptacao | Command | Registrar ou versionar periodos do cronograma da captacao (exige exatamente 8 periodos, um de cada TipoPeriodo) | captacao, periodos, versao | `CronogramaCaptacao` persistido | RN01, RN05, RN09, AX-M011-001 | Configuracao de captacao existente | Sequencia de datas invalida, captacao nao encontrada, quantidade de periodos diferente de 8 | Nao | AnalistaTecnico | API interna/backoffice a definir |
| AdiarEtapaCronogramaDaCaptacao | Command | Registrar adiamento de uma etapa e deslocar etapas posteriores (AX-M011-007: cascateia para todos os periodos subsequentes) | captacao, tipoPeriodo, dias, justificativa | `AdiamentoPeriodoCronograma` registrado e cronograma atualizado | RN28, RN29, AX-M011-007 | Cronograma existente; periodo existente | Dias invalidos (<=0), justificativa ausente, sequencia invalida | Nao | AnalistaTecnico | API interna/backoffice a definir |
| SelecionarFormularioSubmissao | Command | Selecionar versao publicada do formulario de submissao no M021 | captacao, formularioId, versaoFormularioId | `FormularioSubmissaoRef` selecionado | RN06, RI2 | Captacao existente; versao publicada no M021; Captacao nao PAUSADO | Formulario inexistente, versao nao publicada, formulario duplicado, AX-M011-032 | Nao | AnalistaTecnico | API interna/backoffice a definir |
| SelecionarFormularioAvaliacao | Command | Selecionar versao publicada do formulario de avaliacao ad hoc no M021 | captacao, formularioId, versaoFormularioId | `FormularioAvaliacaoRef` selecionado | RN02, RN06 | Captacao existente; versao publicada no M021; Captacao nao PAUSADO | Inicio da avaliacao sem formulario, formulario inexistente, AX-M011-032 | Nao | AnalistaTecnico | API interna/backoffice a definir |
| SelecionarFormularioRevisao | Command | Selecionar versao publicada do formulario de revisao de resultado no M021 | captacao, formularioId, versaoFormularioId | `FormularioRevisaoRef` selecionado | RN06 | Captacao existente; versao publicada no M021; Captacao nao PAUSADO | Etapa de revisao sem formulario, formulario inexistente, versao nao publicada, AX-M011-032 | Nao | AnalistaTecnico | API interna/backoffice a definir |
| SelecionarFormularioAnexos | Command | Selecionar versao publicada do formulario de anexos no M021, quando aplicavel | captacao, formularioId, versaoFormularioId | `FormularioAnexoRef` selecionado (optional) | RN06 | Captacao existente; versao publicada no M021; Captacao nao PAUSADO | Formulario inexistente, versao nao publicada, AX-M011-032 | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarCategoriasDeIniciativas | Command | Definir categorias de projetos aceitas pela captacao | captacao, categorias | `CategoriaProjeto` list associada | RN19 | Captacao existente | Categoria inexistente, lista vazia | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarFaixasSelecionadas | Command | Selecionar faixas do Fomento que participam desta captacao (AX-M011-029: faixas devem pertencer ao Fomento vinculado; AX-M011-030: >= 1 faixa exigida) | captacao, faixasIds | `faixasSelecionadas` atualizadas | RN10, AX-M011-029, AX-M011-030 | Captacao existente; faixas pertencem ao Fomento APROVADO vinculado | Lista vazia, faixa nao pertence ao Fomento, AX-M011-012 | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarRubricasPermitidas | Command | Definir RubricaPermitidaFaixa e subrubricas nas faixas selecionadas, com percentuais, restricoes, observacoes e bolsas (AX-M011-008, AX-M011-009, AX-M011-011) | captacao, faixaId, rubricasPermitidas | `RubricaPermitidaFaixa` list persistida | RN13, RN26, RN27, AX-M011-008, AX-M011-009, AX-M011-011 | Captacao existente; rubricas ativas no M008 | Rubrica inexistente/inativa, percentual invalido, subrubrica sem rubricaPai, BolsaPermitidaFaixa sem rubrica Bolsa na faixa | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarRegrasSubmissao | Command | Definir regras de participacao e submissao | captacao, regras | `RegraSubmissao` persistida | RN11 | Captacao existente | Regra invalida | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarProponentesEscolhidos | Command | Definir instituicoes ou pessoas autorizadas quando a submissao for restrita a escolhidos (TipoProponenteEscolhido: INSTITUICAO|PESSOA) | captacao, tipo, proponentes | `proponentesEscolhidos` persistidos | RN26 | Captacao existente; instituicao ou pessoa existente | Lista vazia, proponente inexistente | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarRequisitosProponente | Command | Definir requisitos e direcionamento da proposta (TipoDirecionamentoProposta: ABERTA|INSTITUICAO|TIPO_INSTITUICAO) | captacao, requisitos | `RequisitoProponente` persistido | RN12, RN21 | Captacao existente | Instituicao/tipo/nivel inexistente, direcionamento invalido | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarDocumentosExigidos | Command | Definir documentos exigidos do proponente, formatos, obrigatoriedade e regra de reaproveitamento do cadastro corporativo | captacao, documentos | `DocumentoExigido` list associada | RN24 | Captacao existente; documentos cadastrados | Documento inexistente, formato invalido | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarPrestacoesExigidas | Command | Definir exigencia de prestacao tecnica e/ou financeira | captacao, exigePrestacaoTecnica, exigePrestacaoFinanceira | `PrestacaoExigida` persistida | RN23 | Captacao existente | Configuracao invalida | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarRegraAvaliacao | Command | Definir se ha avaliacao ad hoc e a quantidade minima de revisores por proposta | captacao, exigeAvaliacaoAdHoc, quantidadeMinimaRevisores | `RegraAvaliacao` persistida | RN22 | Captacao existente | Quantidade minima invalida | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ConfigurarMatrizConfiguracao | Command | Definir obrigatoriedade de cada bloco do projeto: equipe, resultados, riscos, cronogramaProj, orcamento, objetivos, beneficios (ObrigatoriedadeBloco: EXIGIDO|DISPENSADO) | captacao, matrizConfiguracao | `MatrizConfiguracaoProjeto` persistida | — | Captacao existente | Bloco invalido | Nao | AnalistaTecnico | API interna/backoffice a definir |
| AssociarRevisorAdHoc | Command | Associar revisor ad hoc a captacao com validacao de conflito | captacao, revisor, instituicao | `RevisorAdHoc` associado | RN03, RI1 | Captacao existente | Conflito de interesses, revisor duplicado | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ValidarConfiguracaoDaCaptacao | Query | Validar se a captacao possui configuracao minima para publicacao: Fomento APROVADO, 8 periodos, edital, formularios obrigatorios e >= 1 faixa selecionada | captacao | Checklist de prontidao | RN01, RN02, RN04, RN08, RN09, AX-M011-001, AX-M011-030 | Captacao existente | Captacao nao encontrada | N/A | AnalistaTecnico ou modulo interno autorizado | API interna a definir |
| PublicarCaptacao | Command | Transicao EM_ANDAMENTO -> PUBLICADO: tornar a captacao visivel (guard: Fomento APROVADO, 8 periodos, edital, formularios) | captacao | Captacao com estadoConfiguracao=PUBLICADO | RN34, RN35, AX-M011-001, AX-M011-012 | estadoConfiguracao=EM_ANDAMENTO; Fomento APROVADO; 8 periodos configurados; edital vinculado; formularios obrigatorios selecionados | Fomento nao APROVADO, cronograma incompleto, formulario ausente, AX-M011-030 | Sim | AnalistaTecnico | API interna/backoffice a definir |
| DespublicarCaptacao | Command | Transicao PUBLICADO -> NAO_PUBLICADO: retirar captacao de circulacao sem cancelar (guard: sem propostas em periodo de submissao ativo) | captacao, justificativa | Captacao com estadoConfiguracao=NAO_PUBLICADO | — | estadoConfiguracao=PUBLICADO; nenhuma proposta em periodo de recebimento ativo | Propostas recebidas no periodo ativo | Nao | AnalistaTecnico | API interna/backoffice a definir |
| ReabrirCaptacao | Command | Transicao NAO_PUBLICADO -> EM_ANDAMENTO: reabrir captacao para edicao de configuracao | captacao | Captacao com estadoConfiguracao=EM_ANDAMENTO | — | estadoConfiguracao=NAO_PUBLICADO | — | Nao | AnalistaTecnico | API interna/backoffice a definir |
| PausarCaptacao | Command | Transicao PUBLICADO -> PAUSADO: suspender operacionalmente a captacao com justificativa (AX-M011-032: bloqueia todas as operacoes de selecao) | captacao, justificativa | Captacao com estadoConfiguracao=PAUSADO | AX-M011-032 | estadoConfiguracao=PUBLICADO; justificativa obrigatoria | Justificativa ausente | Nao | GestorFAPES | API interna/backoffice a definir |
| RetomarCaptacao | Command | Transicao PAUSADO -> PUBLICADO: retomar captacao pausada (AX-M011-033: bloqueado se qualquer periodo futuro com dataFim < hoje) | captacao | Captacao com estadoConfiguracao=PUBLICADO | AX-M011-033 | estadoConfiguracao=PAUSADO; todos os periodos futuros com dataFim >= hoje | Periodo futuro com dataFim expirado (sistema bloqueia) | Nao | GestorFAPES | API interna/backoffice a definir |
| CancelarCaptacao | Command | Transicao PUBLICADO|PAUSADO -> CANCELADO por cancelamento administrativo com justificativa | captacao, justificativa | Captacao com estadoConfiguracao=CANCELADO | AX-M011-034 | estadoConfiguracao=PUBLICADO ou PAUSADO; justificativa obrigatoria | Justificativa ausente; estadoConfiguracao invalido | Nao | GestorFAPES | API interna/backoffice a definir |
| SubmeterProposta | Command | Proponente submete proposta de projeto durante periodo RECEBIMENTO_PROPOSTAS | captacao, formularioPreenchido, proponente | Proposta criada | RN15, AX-M011-032 | estadoConfiguracao=PUBLICADO; periodo RECEBIMENTO_PROPOSTAS aberto; Captacao nao PAUSADO | Periodo encerrado, formulario incompleto, captacao PAUSADO | Nao | Proponente | API publica a definir |
| ListarPropostasDaCaptacao | Query | Consultar propostas de uma captacao com filtros por area, status e instituicao | captacao, filtros | Lista de propostas | — | Captacao existente | Captacao nao encontrada | N/A | AnalistaTecnico | API interna a definir |
| RegistrarAvaliacaoDocumental | Command | Registrar habilitacao ou inabilitacao documental de proposta durante periodo AVALIACAO_DOCUMENTAL | captacao, proposta, decisao, justificativa | Situacao documental registrada | RN15, RN35, AX-M011-032 | Periodo AVALIACAO_DOCUMENTAL aberto; Captacao nao PAUSADO | Proposta inexistente, fase incorreta, captacao PAUSADO | Nao | AnalistaTecnico | API interna/backoffice a definir |
| DistribuirPropostasParaRevisores | Command | Distribuir propostas habilitadas para revisores ad hoc associados a captacao | captacao, propostas, revisores | Distribuicao registrada | RN02, RN03, AX-M011-032 | Revisores associados a captacao; Captacao nao PAUSADO | Revisor com conflito de interesses, captacao PAUSADO | Nao | AnalistaTecnico | API interna/backoffice a definir |
| AvaliarProposta | Command | RevisorAdHoc registra parecer de merito de uma proposta durante periodo AVALIACAO_AD_HOC | proposta, revisor, notas, parecer | `Avaliacao` registrada | RN03, AX-M011-032 | Proposta distribuida para o revisor; Captacao nao PAUSADO | Revisor nao autorizado para esta proposta, captacao PAUSADO | Nao | RevisorAdHoc | API interna a definir |
| ConsolidarNotasDeAvaliacao | Query | Consolidar notas de todos os revisores para gerar ranking | captacao | Ranking consolidado | — | Todas as avaliacoes concluidas | Avaliacoes pendentes | N/A | AnalistaTecnico | API interna a definir |
| SubmeterRevisaoResultado | Command | Proponente solicita revisao durante periodo RECEBIMENTO_REVISAO | proposta, motivo, descricao, anexos | Revisao registrada | — | Periodo RECEBIMENTO_REVISAO aberto; Captacao nao PAUSADO | Periodo encerrado, proposta inexistente, captacao PAUSADO | Nao | Proponente | API publica a definir |
| AnalisarRevisaoResultado | Command | AnalistaTecnico decide sobre revisao solicitada durante periodo RESULTADO_APOS_REVISAO | revisao, decisao, justificativa | Decisao registrada | — | Revisao existente e pendente; Captacao nao PAUSADO | Revisao ja decidida, captacao PAUSADO | Nao | AnalistaTecnico | API interna/backoffice a definir |
| PublicarResultado | Command | Publicar resultado RESULTADO_PRELIMINAR ou RESULTADO_FINAL da captacao; RESULTADO_FINAL encerra o processo no M011 (transicao -> ENCERRADO) | captacao, tipo (RESULTADO_PRELIMINAR\|RESULTADO_FINAL), listaAprovados | Resultado publicado; se RESULTADO_FINAL captacao vai a ENCERRADO | RN16, AX-M011-034 | Avaliacoes consolidadas; revisoes analisadas para resultado final; Captacao nao PAUSADO | Avaliacoes pendentes, revisoes pendentes, captacao PAUSADO | Nao | AnalistaTecnico | API interna/backoffice a definir |

## Enumeracoes Relevantes

### EstadoConfiguracaoCaptacao
`EM_ANDAMENTO` | `PUBLICADO` | `NAO_PUBLICADO` | `PAUSADO` | `ENCERRADO` | `CANCELADO`

### EstadoFomento
`EM_ELABORACAO` | `APROVADO` | `INTERROMPIDO` | `ENCERRADO` | `CONCLUIDO`

### TipoPeriodo (ordem obrigatoria — AX-M011-001)
1. `PUBLICACAO_CAPTACAO`
2. `RECEBIMENTO_PROPOSTAS`
3. `AVALIACAO_DOCUMENTAL`
4. `AVALIACAO_AD_HOC`
5. `RESULTADO_PRELIMINAR`
6. `RECEBIMENTO_REVISAO`
7. `RESULTADO_APOS_REVISAO`
8. `RESULTADO_FINAL`

### TipoCaptacao
`CHAMADA_PUBLICA` | `DEMANDA_INDUZIDA`

### TipoOutorgado
`PESSOA_FISICA` | `PESSOA_JURIDICA`

### TipoResultado
`PRODUTO` | `SERVICO` | `PROCESSO`

### ObrigatoriedadeBloco
`EXIGIDO` | `DISPENSADO`

### TipoOrigemAporte
`PROGRAMA` | `PARCERIA` | `RECURSO_INTERNO`

### TipoProponenteEscolhido
`INSTITUICAO` | `PESSOA`

### TipoDirecionamentoProposta
`ABERTA` | `INSTITUICAO` | `TIPO_INSTITUICAO`

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa endpoint de renderizacao de formulario; a criacao e o versionamento dos formularios pertencem ao M021.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "captacao": "CAP-2026-001"
    }
  }
}
```

## Exemplos JSON por Operacao

### ConfigurarCronogramaDaCaptacao

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001",
  "periodos": [
    { "nome": "Publicacao da Captacao",        "tipo": "PUBLICACAO_CAPTACAO",      "dataInicio": "2026-06-01", "dataFim": "2026-06-01" },
    { "nome": "Recebimento de Propostas",       "tipo": "RECEBIMENTO_PROPOSTAS",    "dataInicio": "2026-06-02", "dataFim": "2026-06-30" },
    { "nome": "Avaliacao Documental",           "tipo": "AVALIACAO_DOCUMENTAL",     "dataInicio": "2026-07-01", "dataFim": "2026-07-15" },
    { "nome": "Avaliacao Ad Hoc",               "tipo": "AVALIACAO_AD_HOC",         "dataInicio": "2026-07-16", "dataFim": "2026-08-15" },
    { "nome": "Resultado Preliminar",           "tipo": "RESULTADO_PRELIMINAR",     "dataInicio": "2026-08-16", "dataFim": "2026-08-16" },
    { "nome": "Recebimento de Revisoes",        "tipo": "RECEBIMENTO_REVISAO",      "dataInicio": "2026-08-17", "dataFim": "2026-08-31" },
    { "nome": "Resultado Apos Revisao",         "tipo": "RESULTADO_APOS_REVISAO",   "dataInicio": "2026-09-01", "dataFim": "2026-09-15" },
    { "nome": "Resultado Final",                "tipo": "RESULTADO_FINAL",          "dataInicio": "2026-09-16", "dataFim": "2026-09-16" }
  ],
  "versao": 1
}
```

Nota: exatamente 8 periodos sao exigidos (AX-M011-001), um para cada TipoPeriodo na ordem: PUBLICACAO_CAPTACAO, RECEBIMENTO_PROPOSTAS, AVALIACAO_DOCUMENTAL, AVALIACAO_AD_HOC, RESULTADO_PRELIMINAR, RECEBIMENTO_REVISAO, RESULTADO_APOS_REVISAO, RESULTADO_FINAL.

**Exemplo de saida**

```json
{
  "cronograma": {
    "id": "CRON-2026-001",
    "descricao": "Cronograma CAP-2026-001",
    "versao": 1,
    "periodos": [
      { "nome": "Publicacao da Captacao", "tipo": "PUBLICACAO_CAPTACAO", "dataInicio": "2026-06-01", "dataFim": "2026-06-01", "adiamentos": [] }
    ]
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CRONOGRAMA_PERIODOS_INCOMPLETOS | O cronograma deve possuir exatamente 8 periodos, um de cada TipoPeriodo (AX-M011-001). |
| CRONOGRAMA_SEQUENCIA_INVALIDA | Os periodos do cronograma nao respeitam a sequencia exigida de TipoPeriodo. |
| CAPTACAO_NAO_ENCONTRADA | A captacao informada nao foi encontrada para configuracao do cronograma. |

### AdiarEtapaCronogramaDaCaptacao

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001",
  "tipoPeriodo": "AVALIACAO_DOCUMENTAL",
  "dias": 5,
  "justificativa": "Necessidade de tempo adicional para conferencia documental"
}
```

**Exemplo de saida**

```json
{
  "adiamento": {
    "tipoPeriodo": "AVALIACAO_DOCUMENTAL",
    "dias": 5,
    "justificativa": "Necessidade de tempo adicional para conferencia documental",
    "dataRegistro": "2026-07-01",
    "dataInicioOriginal": "2026-07-01",
    "dataFimOriginal": "2026-07-15",
    "dataInicioNova": "2026-07-06",
    "dataFimNova": "2026-07-20"
  },
  "cronogramaAtualizado": true,
  "periodosAfetados": ["AVALIACAO_DOCUMENTAL", "AVALIACAO_AD_HOC", "RESULTADO_PRELIMINAR", "RECEBIMENTO_REVISAO", "RESULTADO_APOS_REVISAO", "RESULTADO_FINAL"]
}
```

Nota: AX-M011-007 — o adiamento cascateia para todos os periodos subsequentes automaticamente.

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CRONOGRAMA_NAO_ENCONTRADO | O cronograma nao foi configurado para a captacao informada. |
| ETAPA_CRONOGRAMA_NAO_ENCONTRADA | A etapa informada nao existe no cronograma da captacao. |
| ADIAMENTO_DADOS_INVALIDOS | O adiamento deve possuir quantidade de dias positiva e justificativa. |

### SelecionarFormularioSubmissao

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001",
  "formularioId": "FORM-2026-001",
  "versaoFormularioId": "VF-2026-002"
}
```

**Exemplo de saida**

```json
{
  "formularioSelecionado": {
    "captacaoId": "CAP-2026-001",
    "formularioId": "FORM-2026-001",
    "versaoFormularioId": "VF-2026-002",
    "tipo": "SUBMISSAO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FORMULARIO_SUBMISSAO_DUPLICADO | Nao pode haver dois formularios de submissao ativos simultaneamente. |
| FORMULARIO_NAO_ENCONTRADO | O formulario informado nao foi encontrado no M021. |
| VERSAO_FORMULARIO_NAO_PUBLICADA | A versao informada nao esta publicada no M021. |

### SelecionarFormularioAvaliacao

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001",
  "formularioId": "FORM-2026-010",
  "versaoFormularioId": "VF-2026-015"
}
```

**Exemplo de saida**

```json
{
  "formularioSelecionado": {
    "captacaoId": "CAP-2026-001",
    "formularioId": "FORM-2026-010",
    "versaoFormularioId": "VF-2026-015",
    "tipo": "AVALIACAO_AD_HOC"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FORMULARIO_AVALIACAO_OBRIGATORIO | A captacao precisa possuir formulario de avaliacao antes da fase de merito. |
| FORMULARIO_NAO_ENCONTRADO | O formulario informado nao foi encontrado no M021. |
| VERSAO_FORMULARIO_NAO_PUBLICADA | A versao informada nao esta publicada no M021. |

### SelecionarFormularioRevisao

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001",
  "formularioId": "FORM-2026-020",
  "versaoFormularioId": "VF-2026-021"
}
```

**Exemplo de saida**

```json
{
  "formularioSelecionado": {
    "captacaoId": "CAP-2026-001",
    "formularioId": "FORM-2026-020",
    "versaoFormularioId": "VF-2026-021",
    "tipo": "REVISAO_RESULTADO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FORMULARIO_REVISAO_OBRIGATORIO | A captacao precisa possuir formulario de revisao de resultado. |
| FORMULARIO_NAO_ENCONTRADO | O formulario informado nao foi encontrado no M021. |
| VERSAO_FORMULARIO_NAO_PUBLICADA | A versao informada nao esta publicada no M021. |

### ConfigurarFaixasSelecionadas

Seleciona quais `Faixa` do Fomento vinculado participam desta captacao. As faixas ja existem no Fomento; este comando apenas associa (AX-M011-029: devem pertencer ao Fomento; AX-M011-030: >= 1 exigida).

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001",
  "faixasIds": ["FAIXA-FON-001", "FAIXA-FON-002"]
}
```

**Exemplo de saida**

```json
{
  "faixasSelecionadas": [
    {
      "id": "FAIXA-FON-001",
      "nome": "Faixa A",
      "descricao": "Projetos de menor complexidade operacional."
    },
    {
      "id": "FAIXA-FON-002",
      "nome": "Faixa B",
      "descricao": "Projetos estruturantes."
    }
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FAIXA_NAO_PERTENCE_AO_FOMENTO | A faixa informada nao pertence ao Fomento vinculado a esta captacao (AX-M011-029). |
| CAPTACAO_SEM_FAIXAS | A captacao deve ter ao menos uma faixa de investimento selecionada (AX-M011-030). |
| FOMENTO_NAO_APROVADO | O Fomento vinculado deve estar APROVADO para selecionar faixas (AX-M011-012). |

### ConfigurarDocumentosExigidos

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001",
  "documentos": [
    {
      "documentoExigidoId": "DOC-2026-001",
      "obrigatorio": true,
      "formatosPermitidos": ["PDF", "DOCX"]
    }
  ]
}
```

**Exemplo de saida**

```json
{
  "documentosExigidos": [
    {
      "documentoExigidoId": "DOC-2026-001",
      "nome": "Projeto do projeto",
      "obrigatorio": true,
      "formatosPermitidos": ["PDF", "DOCX"]
    }
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| DOCUMENTO_EXIGIDO_NAO_ENCONTRADO | O documento exigido informado nao foi encontrado. |
| FORMATO_ARQUIVO_INVALIDO | Um dos formatos informados nao e aceito para o documento exigido. |

### AssociarRevisorAdHoc

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001",
  "revisorCpf": "123.456.789-00",
  "instituicaoId": "INST-2026-090"
}
```

**Exemplo de saida**

```json
{
  "revisorAdHoc": {
    "id": "REV-2026-010",
    "captacaoId": "CAP-2026-001"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CONFLITO_INTERESSE_REVISOR | O revisor ad hoc nao pode avaliar propostas da propria instituicao. |
| REVISOR_DUPLICADO_NA_CAPTACAO | O revisor informado ja esta associado a captacao. |

### ValidarConfiguracaoDaCaptacao

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001"
}
```

**Exemplo de saida**

```json
{
  "prontoParaPublicacao": true,
  "pendencias": []
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CAPTACAO_NAO_ENCONTRADA | A captacao informada nao foi encontrada para validacao. |
| CONFIGURACAO_CAPTACAO_INCOMPLETA | A captacao ainda possui pendencias de cronograma, formulario ou configuracao obrigatoria. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Nenhum endpoint ou mecanismo concreto de versionamento foi estabilizado nesta rodada.

## Eventos e Efeitos Colaterais

- `ConfigurarCronogramaDaCaptacao` define os 8 periodos (AX-M011-001) que condicionam recebimento, avaliacao, revisao e publicacao de resultados.
- `SelecionarFormularioSubmissao`, `SelecionarFormularioAvaliacao`, `SelecionarFormularioRevisao` e `SelecionarFormularioAnexos` apenas referenciam versoes publicadas no M021 via `FormularioSubmissaoRef`, `FormularioAvaliacaoRef`, `FormularioRevisaoRef` e `FormularioAnexoRef`.
- `ValidarConfiguracaoDaCaptacao` fornece a prontidao necessaria para publicacao da captacao.
- `PublicarCaptacao` transiciona `EstadoConfiguracaoCaptacao` de `EM_ANDAMENTO` para `PUBLICADO`.
- `DespublicarCaptacao` transiciona `PUBLICADO` para `NAO_PUBLICADO`; `ReabrirCaptacao` devolve para `EM_ANDAMENTO`.
- `PausarCaptacao` (GestorFAPES) transiciona `PUBLICADO` para `PAUSADO` e bloqueia todas as operacoes de selecao (AX-M011-032).
- `RetomarCaptacao` (GestorFAPES) transiciona `PAUSADO` para `PUBLICADO`; o sistema bloqueia se qualquer periodo futuro tiver `dataFim < hoje` (AX-M011-033).
- `CancelarCaptacao` (GestorFAPES) transiciona `PUBLICADO` ou `PAUSADO` para `CANCELADO` por cancelamento administrativo.
- `PublicarResultado` com `tipo=RESULTADO_FINAL` encerra o processo no M011 (transicao para `ENCERRADO`) e disponibiliza propostas aprovadas para o M022.
- A expiracao automatica ocorre quando `RESULTADO_FINAL.dataFim` e atingida sem publicacao manual do resultado final (Sistema transiciona para `ENCERRADO`).
- Quando o Fomento vinculado e interrompido (GestorFomento), a captacao tem sua operacao suspensa em cascata.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural/modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
