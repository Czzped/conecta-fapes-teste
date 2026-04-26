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
| M003 | Modulo interno | Consome a referencia da captacao quando a iniciativa contratada passa para gestao pos-contratacao |
| M010 | Modulo interno | Fornece `Programa` e `Parceria` como origens de aportes financeiros da captacao |
| M021 | Modulo interno | Fornece formularios publicados e versionados para submissao, avaliacao ad hoc, revisao e anexos |
| M022 | Modulo interno | Consome propostas aprovadas no resultado final para formalizar contratacao/outorga |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| ConfigurarCronogramaDaCaptacao | Command | Registrar ou versionar fases do cronograma da captacao | captacao, fases, versao | `Cronograma` persistido | RN01, RN05, RN09 | Configuracao de captacao existente | Sequencia de datas invalida, captacao nao encontrada | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| AdiarEtapaCronogramaDaCaptacao | Command | Registrar adiamento de uma etapa e deslocar etapas posteriores | captacao, etapa, dias, justificativa | Cronograma atualizado e historico registrado | RN28, RN29 | Cronograma existente; etapa existente | Dias invalidos, justificativa ausente, sequencia invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| SelecionarFormularioSubmissao | Command | Selecionar versao publicada do formulario de submissao no M021 | captacao, formularioId, versaoFormularioId | Formulario selecionado | RN06, RI2 | Captacao existente; versao publicada no M021 | Formulario inexistente, versao nao publicada, formulario duplicado | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| SelecionarFormularioAvaliacao | Command | Selecionar versao publicada do formulario de avaliacao ad hoc no M021 | captacao, formularioId, versaoFormularioId | Formulario selecionado | RN02, RN06 | Captacao existente; versao publicada no M021 | Inicio da avaliacao sem formulario, formulario inexistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| SelecionarFormularioRevisao | Command | Selecionar versao publicada do formulario de revisao de resultado no M021 | captacao, formularioId, versaoFormularioId | Formulario selecionado | RN06 | Captacao existente; versao publicada no M021 | Etapa de revisao sem formulario, formulario inexistente, versao nao publicada | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| SelecionarFormularioAnexos | Command | Selecionar versao publicada do formulario de anexos no M021, quando aplicavel | captacao, formularioId, versaoFormularioId | Formulario selecionado | RN06 | Captacao existente; versao publicada no M021 | Formulario inexistente, versao nao publicada | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarCategoriasDeIniciativas | Command | Definir categorias de iniciativas aceitas pela captacao | captacao, categorias | Categorias associadas | RN19 | Captacao existente | Categoria inexistente, lista vazia | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarAportesFinanceirosCaptacao | Command | Registrar programas ou parcerias que aportam financeiramente na captacao | captacao, aportes | Aportes financeiros persistidos | RN01, RN25 | Captacao existente; programa ou parceria existente | Aporte sem origem, valor invalido | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarFaixasFinanciamento | Command | Registrar faixas de financiamento por duracao maxima, valores minimo/maximo e valor aportado por faixa | captacao, faixas | `FaixaFinanciamento` persistida | RN10, RN20, RN27 | Captacao existente | Faixa invalida, valor maximo menor que minimo, soma de faixas maior que os aportes | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarRegrasSubmissao | Command | Definir regras de participacao e submissao | captacao, regras | `RegraSubmissao` persistida | RN11 | Captacao existente | Regra invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarProponentesEscolhidos | Command | Definir instituicoes ou pessoas autorizadas quando a submissao for restrita a escolhidos | captacao, tipo, proponentes | Proponentes escolhidos persistidos | RN26 | Captacao existente; instituicao ou pessoa existente | Lista vazia, proponente inexistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarRequisitosProponente | Command | Definir requisitos e direcionamento da proposta | captacao, requisitos | `RequisitoProponente` persistido | RN12, RN21 | Captacao existente | Instituicao/tipo/nivel inexistente, direcionamento invalido | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarDocumentosExigidos | Command | Definir documentos exigidos do proponente, formatos, obrigatoriedade e regra de reaproveitamento do cadastro corporativo | captacao, documentos | Documentos associados | RN24 | Captacao existente; documentos cadastrados | Documento inexistente, formato invalido | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarPrestacoesExigidas | Command | Definir exigencia de prestacao tecnica e/ou financeira | captacao, exigePrestacaoTecnica, exigePrestacaoFinanceira | `PrestacaoExigida` persistida | RN23 | Captacao existente | Configuracao invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarRegraAvaliacao | Command | Definir se ha avaliacao ad hoc e a quantidade minima de revisores por proposta | captacao, exigeAvaliacaoAdHoc, quantidadeMinimaRevisores | `RegraAvaliacao` persistida | RN22 | Captacao existente | Quantidade minima invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| AssociarRevisorAdHoc | Command | Associar revisor ad hoc a captacao com validacao de conflito | captacao, revisor, instituicao | `RevisorAdHoc` associado | RN03, RI1 | Captacao existente | Conflito de interesses, revisor duplicado | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ValidarConfiguracaoDaCaptacao | Query | Validar se a captacao possui configuracao minima para publicacao operacional | captacao | Checklist de prontidao | RN01, RN02, RN04, RN08, RN09 | Captacao existente | Captacao nao encontrada | N/A | Analista da Agencia de Fomento ou modulo interno autorizado | API interna a definir |
| InstanciarProcessoCaptacao | Command | Criar instancia operacional a partir de configuracao publicada | captacao | Instancia de captacao criada | RN33 | Configuracao publicada | Configuracao incompleta ou nao publicada | Nao | Diretoria da FAPES ou Area Tecnica | API interna/backoffice a definir |
| PublicarCaptacao | Command | Tornar a captacao visivel na data de publicacao definida no cronograma | captacao | Captacao publicada operacionalmente | RN34, RN35 | Instancia criada; data de publicacao atingida | Data de publicacao nao atingida | Sim | Area Tecnica associada a captacao | API interna/backoffice a definir |
| SubmeterProposta | Command | Proponente submete proposta de iniciativa durante periodo de recebimento | captacao, formularioPreenchido, proponente | Proposta criada | RN15 | Captacao publicada e periodo de recebimento aberto | Periodo encerrado, formulario incompleto | Nao | Cidadao (proponente) | API publica a definir |
| ListarPropostasDaCaptacao | Query | Consultar propostas de uma captacao com filtros por area, status e instituicao | captacao, filtros | Lista de propostas | — | Captacao existente | Captacao nao encontrada | N/A | Analista da Agencia de Fomento | API interna a definir |
| RegistrarAvaliacaoDocumental | Command | Registrar habilitacao ou inabilitacao documental de proposta | captacao, proposta, decisao, justificativa | Situacao documental registrada | RN15, RN35 | Periodo de avaliacao documental aberto | Proposta inexistente, fase incorreta | Nao | Area Tecnica associada a captacao | API interna/backoffice a definir |
| DistribuirPropostasParaRevisores | Command | Distribuir propostas habilitadas para revisores ad hoc associados a captacao | captacao, propostas, revisores | Distribuicao registrada | RN02, RN03 | Revisores associados a captacao | Revisor com conflito de interesses | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| AvaliarProposta | Command | Revisor registra avaliacao de merito de uma proposta | proposta, revisor, notas, parecer | `Avaliacao` registrada | RN03 | Proposta distribuida para o revisor | Revisor nao autorizado para esta proposta | Nao | Consultor Ad Hoc | API interna a definir |
| ConsolidarNotasDeAvaliacao | Query | Consolidar notas de todos os revisores para gerar ranking | captacao | Ranking consolidado | — | Todas as avaliacoes concluidas | Avaliacoes pendentes | N/A | Analista da Agencia de Fomento | API interna a definir |
| SubmeterRevisaoResultado | Command | Proponente solicita revisao durante periodo de revisao de resultado | proposta, motivo, descricao, anexos | Revisao registrada | — | Periodo de revisao aberto | Periodo encerrado, proposta inexistente | Nao | Cidadao (proponente) | API publica a definir |
| AnalisarRevisaoResultado | Command | Area tecnica decide sobre revisao solicitada | revisao, decisao, justificativa | Decisao registrada | — | Revisao existente e pendente | Revisao ja decidida | Nao | Area Tecnica associada a captacao | API interna/backoffice a definir |
| PublicarResultado | Command | Publicar resultado preliminar ou final da captacao | captacao, tipo (preliminar/final), lista aprovados | Resultado publicado | RN16 | Avaliacoes consolidadas; revisoes analisadas para resultado final | Avaliacoes pendentes, revisoes pendentes | Nao | Area Tecnica associada a captacao | API interna/backoffice a definir |

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
    {
      "tipo": "RECEBIMENTO_PROPOSTAS",
      "inicio": "2026-06-01",
      "fim": "2026-06-30"
    }
  ],
  "versao": 1
}
```

**Exemplo de saida**

```json
{
  "cronograma": {
    "id": "CRON-2026-001",
    "versao": 1
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CRONOGRAMA_SEQUENCIA_INVALIDA | As fases do cronograma nao respeitam a sequencia exigida pela captacao. |
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
    "id": "ADI-2026-001",
    "tipoPeriodo": "AVALIACAO_DOCUMENTAL",
    "dias": 5
  },
  "cronogramaAtualizado": true
}
```

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

### ConfigurarFaixasFinanciamento

**Exemplo de entrada**

```json
{
  "captacaoId": "CAP-2026-001",
  "faixas": [
    {
      "duracaoMaximaMeses": 24,
      "valorMinimo": 50000.0,
      "valorMaximo": 200000.0,
      "valorAportado": 500000.0
    }
  ]
}
```

**Exemplo de saida**

```json
{
  "faixasFinanciamento": [
    {
      "id": "FAIXA-2026-001",
      "duracaoMaximaMeses": 24,
      "valorMinimo": 50000.0,
      "valorMaximo": 200000.0,
      "valorAportado": 500000.0
    }
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FAIXA_FINANCIAMENTO_INVALIDA | A faixa deve possuir duracao maxima e valores minimo/maximo validos. |
| VALOR_MAXIMO_MENOR_QUE_MINIMO | O valor maximo da faixa nao pode ser menor que o valor minimo. |

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
      "nome": "Projeto da iniciativa",
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

- `ConfigurarCronogramaDaCaptacao` define as fases que condicionam recebimento, avaliacao, revisao e publicacao de resultados.
- `SelecionarFormularioSubmissao`, `SelecionarFormularioAvaliacao` e `SelecionarFormularioRevisao` apenas referenciam versoes publicadas no M021.
- `ValidarConfiguracaoDaCaptacao` fornece a prontidao necessaria para publicacao da captacao.
- `PublicarResultado` encerra o processo no M011 e disponibiliza propostas aprovadas para o M022.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
