# Contrato API - M003 Gestao de Projetos Captados

Dominio e regras de negocio: ver [README.md](README.md)
Contrato funcional: ver [contrato.md](contrato.md)

## Convencoes

- Base path sugerido: `/api/v1/m003`
- Payloads em JSON.
- Datas em ISO-8601 (`YYYY-MM-DD`).
- Valores monetarios em decimal.
- Identificadores externos de outros modulos devem ser tratados como referencias, sem assumir ownership no M003.

## Fronteiras de Ownership

| Conceito | Dono | Uso pelo M003 |
|----------|------|---------------|
| Edital/chamada/captacao | M011 | Referencia de origem da projeto, quando necessario |
| Bolsas, cotas, bolsistas e alocacoes | M009 | Consulta ou integracao; alocacoes sao referenciadas em beneficiarios de diaria |
| Documentos fiscais, extratos e prestacao de contas | M014 | Origem dos lancamentos de execucao consolidada e consumidor da solicitacao de diaria aprovada |
| PessoaFisica | M008 | Referencia para Ortogado, membros da equipe e conta bancaria confirmada no aceite de diaria |
| Programa e Parceria | M010 | Referencias para consultas e consolidacao estrategica |

## Endpoints

| Metodo | Path | Operacao | Descricao |
|--------|------|----------|-----------|
| POST | `/projetos` | RegistrarProjetoContratada | Cria projeto apos contratacao/outorga |
| GET | `/projetos/{id}` | ConsultarProjetoConsolidada | Consulta visao consolidada da projeto |
| GET | `/programas/{programaId}/projetos` | ConsultarProjetosPorPrograma | Lista projetos associadas a programa |
| GET | `/parcerias/{parceriaId}/projetos` | ConsultarProjetosPorParceria | Lista projetos associadas a parceria |
| POST | `/projetos/{id}/versoes-plano` | CriarVersaoPlanoProjeto | Cria nova versao do plano da projeto |
| POST | `/projetos/{id}/versoes-plano/{versaoId}/ativar` | AtivarVersaoPlanoProjeto | Ativa uma versao do plano |
| POST | `/projetos/{id}/solicitacoes-rubrica` | SolicitarAlteracaoRubrica | Ortogado solicita inclusao ou retirada de rubrica |
| POST | `/solicitacoes-rubrica/{id}/decisao` | DecidirSolicitacaoAlteracaoRubrica | Analisa solicitacao de rubrica |
| POST | `/projetos/{id}/solicitacoes-diaria` | SolicitarDiaria | Ortogado solicita diaria para bolsistas da projeto |
| POST | `/solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/aceite` | AssinarTermoAceiteDiaria | Bolsista assina o termo de aceite |
| POST | `/solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/recusa` | RecusarTermoAceiteDiaria | Bolsista recusa a viagem com justificativa |
| POST | `/solicitacoes-diaria/{id}/cancelar` | RemoverSolicitacaoDiaria | Remove/cancela diaria alocada ou aprovada antes do inicio |
| POST | `/solicitacoes-diaria/{id}/regularizar-nao-utilizada` | RegularizarDiariaNaoUtilizada | Regulariza diaria nao utilizada apos o inicio previsto |
| GET | `/projetos/{id}/solicitacoes-diaria` | ConsultarSolicitacoesDiaria | Lista solicitacoes de diaria da projeto |
| GET | `/solicitacoes-diaria/{id}` | ConsultarSolicitacaoDiaria | Consulta detalhe da solicitacao de diaria |
| POST | `/projetos/{id}/lancamentos-execucao` | RegistrarLancamentoExecucao | Registra lancamento financeiro consolidavel |
| GET | `/projetos/{id}/execucao` | ConsultarExecucaoConsolidadaProjeto | Consulta execucao consolidada por rubrica |

## Erros

```json
{
  "error": {
    "code": "PROJETO_NAO_ENCONTRADO",
    "message": "A projeto informada nao foi encontrada.",
    "details": {
      "projetoId": "INI-2026-014"
    }
  }
}
```

| HTTP | Codigo | Situacao |
|------|--------|----------|
| 400 | PAYLOAD_INVALIDO | Dados obrigatorios ausentes ou formato invalido |
| 403 | OPERACAO_NAO_AUTORIZADA | Usuario ou modulo sem permissao |
| 404 | PROJETO_NAO_ENCONTRADO | Projeto inexistente |
| 404 | VERSAO_PLANO_NAO_ENCONTRADA | Versao de plano inexistente |
| 404 | RUBRICA_NAO_ENCONTRADA | Rubrica inexistente |
| 409 | VERSAO_PLANO_VIGENTE_DUPLICADA | Tentativa de manter mais de uma versao vigente |
| 409 | LANCAMENTO_DUPLICADO | Lancamento ja registrado para a mesma origem |
| 422 | ORTOGADO_INVALIDO | Pessoa informada nao e o ortogado ativo da projeto |
| 422 | PLANO_PROJETO_INVALIDO | Plano nao atende as regras de objetivos/resultados/orcamento |
| 422 | RETIRADA_RUBRICA_IMPEDIDA | Rubrica possui lancamento impeditivo para retirada |
| 422 | PERIODO_DIARIA_INVALIDO | Data/hora de chegada deve ser posterior a partida |
| 422 | BENEFICIARIO_DIARIA_INVALIDO | Beneficiario nao possui alocacao valida na projeto |
| 422 | TIPO_DIARIA_VIGENTE_AUSENTE | Nao ha tipo de diaria vigente para a abrangencia informada |
| 422 | ACEITES_DIARIA_PENDENTES | Solicitacao ainda possui aceites obrigatorios pendentes |
| 422 | RUBRICA_DIARIAS_PASSAGENS_INVALIDA | Rubrica de Diarias e Passagens ausente ou invalida |
| 422 | JUSTIFICATIVA_CANCELAMENTO_DIARIA_OBRIGATORIA | Remocao/cancelamento de diaria exige justificativa |
| 422 | JUSTIFICATIVA_REGULARIZACAO_DIARIA_OBRIGATORIA | Regularizacao de diaria nao utilizada exige justificativa |
| 422 | REMOCAO_DIARIA_APOS_INICIO_INVALIDA | Diaria com data/hora de partida ja passada deve seguir regularizacao, nao remocao operacional |
| 409 | ACEITE_DIARIA_JA_REGISTRADO | Beneficiario ja assinou ou recusou o termo |
| 409 | SOLICITACAO_DIARIA_VINCULADA_PRESTACAO | Solicitacao ja vinculada a prestacao de contas |

## POST `/projetos`

Cria uma projeto no M003 apos contratacao/outorga.

### Request

```json
{
  "tipoProjetoId": "TIPO-PESQUISA",
  "titulo": "Laboratorio de Dados Publicos",
  "resumo": "Projeto para estruturacao de laboratorio institucional.",
  "restricoes": "Execucao condicionada a aquisicao de infraestrutura minima.",
  "viabilidadeTecnica": "Equipe e infraestrutura inicial disponiveis.",
  "dataContratacao": "2026-05-01",
  "dataInicio": "2026-06-01",
  "dataFim": "2027-05-31",
  "valorAprovado": 250000.00,
  "ortogadoPessoaFisicaId": "PF-2026-011",
  "programaId": "PROG-2026-01",
  "parceriaId": "PAR-2026-03",
  "origemCaptacaoId": "EDITAL-M011-2026-001"
}
```

### Response `201`

```json
{
  "projeto": {
    "id": "INI-2026-014",
    "codigo": "INI-2026-014",
    "estado": "CONTRATADA",
    "ortogadoId": "ORT-2026-001"
  }
}
```

## GET `/projetos/{id}`

Consulta a visao consolidada da projeto, incluindo plano vigente e resumo financeiro.

### Response `200`

```json
{
  "projeto": {
    "id": "INI-2026-014",
    "titulo": "Laboratorio de Dados Publicos",
    "tipo": {
      "id": "TIPO-PESQUISA",
      "nome": "Projeto de Pesquisa"
    },
    "estado": "EM_EXECUCAO",
    "programaId": "PROG-2026-01",
    "parceriaId": "PAR-2026-03",
    "origemCaptacaoId": "EDITAL-M011-2026-001"
  },
  "ortogado": {
    "id": "ORT-2026-001",
    "pessoaFisicaId": "PF-2026-011",
    "dataOutorga": "2026-05-01",
    "ativo": true
  },
  "planoVigente": {
    "id": "VPI-2026-001",
    "numero": 1,
    "estado": "VIGENTE",
    "resultados": 4,
    "atividades": 9
  },
  "orcamento": {
    "valorPlanejado": 250000.00,
    "valorExecutado": 18400.00,
    "saldo": 231600.00
  }
}
```

## GET `/programas/{programaId}/projetos`

Lista projetos associadas a um programa do M010.

### Response `200`

```json
{
  "programaId": "PROG-2026-01",
  "projetos": [
    {
      "id": "INI-2026-014",
      "titulo": "Laboratorio de Dados Publicos",
      "estado": "EM_EXECUCAO",
      "valorAprovado": 250000.00,
      "valorExecutado": 18400.00
    }
  ]
}
```

## GET `/parcerias/{parceriaId}/projetos`

Lista projetos associadas a uma parceria do M010.

### Response `200`

```json
{
  "parceriaId": "PAR-2026-03",
  "projetos": [
    {
      "id": "INI-2026-014",
      "titulo": "Laboratorio de Dados Publicos",
      "estado": "EM_EXECUCAO",
      "valorAprovado": 250000.00,
      "valorExecutado": 18400.00
    }
  ]
}
```

## POST `/projetos/{id}/versoes-plano`

Cria uma nova versao do plano. A versao pode nascer como `RASCUNHO` e depois ser ativada.

### Request

```json
{
  "justificativa": "Plano inicial aprovado na contratacao.",
  "dataVigenciaInicio": "2026-06-01",
  "objetivoGeral": {
    "descricao": "Estruturar ambiente institucional de dados para apoio a politicas publicas."
  },
  "objetivosEspecificos": [
    {
      "descricao": "Implantar infraestrutura minima do laboratorio.",
      "percentualImportancia": 60,
      "resultadoIds": ["RES-2026-001"]
    }
  ],
  "resultados": [
    {
      "nome": "Ambiente de dados implantado",
      "descricao": "Ambiente minimo instalado e operacional.",
      "tipoResultadoId": "TIPO-RESULTADO-PRODUTO"
    }
  ],
  "orcamentoPlanejado": {
    "valorTotal": 250000.00,
    "valorBolsas": 120000.00,
    "valorCapital": 130000.00,
    "itens": [
      {
        "rubricaId": "RUB-CAPITAL",
        "descricao": "Equipamentos de processamento",
        "valorPrevisto": 130000.00
      }
    ]
  }
}
```

### Response `201`

```json
{
  "versaoPlano": {
    "id": "VPI-2026-001",
    "numero": 1,
    "estado": "RASCUNHO"
  }
}
```

## POST `/projetos/{id}/versoes-plano/{versaoId}/ativar`

Ativa a versao do plano e substitui a versao vigente anterior.

### Request

```json
{
  "dataVigenciaInicio": "2026-06-01"
}
```

### Response `200`

```json
{
  "versaoPlano": {
    "id": "VPI-2026-001",
    "estado": "VIGENTE"
  }
}
```

## POST `/projetos/{id}/solicitacoes-rubrica`

Registra solicitacao do ortogado ativo para inclusao ou retirada de rubrica.

### Request

```json
{
  "ortogadoId": "ORT-2026-001",
  "rubricaId": "RUB-CAPITAL",
  "tipoAlteracao": "INCLUSAO",
  "justificativa": "Necessidade de compra de equipamento nao previsto no plano vigente."
}
```

### Response `201`

```json
{
  "solicitacao": {
    "id": "SAR-2026-001",
    "estado": "SOLICITADA",
    "dataSolicitacao": "2026-08-01"
  }
}
```

## POST `/solicitacoes-rubrica/{id}/decisao`

Registra a decisao sobre solicitacao de rubrica. Quando a decisao aprovada altera o planejamento, deve haver referencia para a versao de plano gerada.

### Request

```json
{
  "decisao": "APROVADA",
  "justificativa": "Rubrica necessaria para execucao do resultado aprovado.",
  "versaoPlanoGeradaId": "VPI-2026-002"
}
```

### Response `200`

```json
{
  "solicitacao": {
    "id": "SAR-2026-001",
    "estado": "APROVADA",
    "versaoPlanoGeradaId": "VPI-2026-002"
  }
}
```

## POST `/projetos/{id}/solicitacoes-diaria`

Cria solicitacao operacional de diaria para um ou mais bolsistas alocados na projeto. O valor nao e informado pelo coordenador; o sistema calcula quantidade a partir do periodo informado, consulta o M008 para validar a abrangencia, localizar o tipo de diaria vigente e obter os parametros de calculo vinculados, e usa valor unitario e memoria de calculo no snapshot da solicitacao.

### Request

```json
{
  "ortogadoId": "ORT-2026-001",
  "abrangenciaRef": "ABR-2026-001",
  "dataHoraPartida": "2026-06-10T08:00:00-03:00",
  "dataHoraChegada": "2026-06-12T18:00:00-03:00",
  "destino": "Vitoria/ES - evento de acompanhamento tecnico",
  "motivo": "Participacao dos bolsistas na apresentacao de resultados parciais da projeto.",
  "beneficiarios": [
    {
      "alocacaoBolsistaRef": "ALOC-M009-2026-031",
      "pessoaFisicaRef": "PF-2026-045"
    }
  ]
}
```

### Response `201`

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "codigo": "SD-2026-001",
    "estado": "ALOCADA",
    "quantidadeDiariasCalculada": 2.5,
    "abrangenciaRef": "ABR-2026-001",
    "abrangenciaSnapshot": {
      "codigo": "DENTRO_ESTADO",
      "nome": "Dentro do Estado"
    },
    "tipoDiariaRef": "DIA-2026-001",
    "parametroCalculoDiariaRef": "PCD-2026-001",
    "valorUnitarioDiaria": 260.00,
    "memoriaCalculoSnapshot": {
      "normaReferencia": "Decreto ES no 5533-R/2023",
      "horasMinimasSemPernoite": 6,
      "percentualDiariaSemPernoite": 0.5
    },
    "valorTotalCalculado": 650.00,
    "rubricaDebitoRef": "RUB-DIARIAS-PASSAGENS",
    "lancamentoDebitoRef": "LEX-2026-045",
    "beneficiarios": [
      {
        "id": "BD-2026-001",
        "alocacaoBolsistaRef": "ALOC-M009-2026-031",
        "pessoaFisicaRef": "PF-2026-045",
        "quantidadeDiariasCalculada": 2.5,
        "valorCalculado": 650.00,
        "aceite": "PENDENTE"
      }
    ]
  }
}
```

## POST `/solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/aceite`

Registra assinatura do termo de aceite pelo bolsista beneficiario.

### Request

```json
{
  "aceite": true,
  "contaBancariaConfirmada": {
    "banco": "021",
    "agencia": "0001",
    "conta": "12345-6",
    "tipo": "CONTA_CORRENTE"
  }
}
```

### Response `200`

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "APROVADA",
    "estadoAceite": "ASSINADO",
    "dataAssinaturaAceite": "2026-06-01T14:30:00-03:00",
    "versaoAceite": "2026.1"
  }
}
```

## POST `/solicitacoes-diaria/{id}/recusa`

Registra recusa da viagem pelo bolsista da `alocacaoBolsistaRef` vinculada a solicitacao. A justificativa e obrigatoria.

### Request

```json
{
  "justificativa": "Conflito de agenda academica no periodo da viagem."
}
```

### Response `200`

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "RECUSADA",
    "estadoAceite": "RECUSADO",
    "dataRecusaAceite": "2026-06-01T14:45:00-03:00"
  }
}
```

## GET `/projetos/{id}/solicitacoes-diaria`

Lista solicitacoes de diaria da projeto, com filtros opcionais por busca livre, estado, periodo de partida e paginacao.

### Query params

| Parametro | Obrigatorio | Descricao |
|-----------|-------------|-----------|
| `busca` | Nao | Busca por codigo, projeto, coordenador, alocacao do bolsista, destino, motivo ou referencia da diaria corrente. |
| `estado` | Nao | Estado da solicitacao: `ALOCADA`, `APROVADA`, `CANCELADA`, `RECUSADA` ou `REGULARIZADA_NAO_UTILIZADA`. |
| `partidaInicio` | Nao | Data inicial do periodo de partida. |
| `partidaFim` | Nao | Data final do periodo de partida. |
| `pagina` | Nao | Numero da pagina, iniciando em 1. |
| `tamanhoPagina` | Nao | Quantidade de registros por pagina. |

### Response `200`

```json
{
  "projetoId": "INI-2026-014",
  "pagina": 1,
  "tamanhoPagina": 10,
  "totalItens": 1,
  "totalPaginas": 1,
  "solicitacoes": [
    {
      "id": "SD-2026-001",
      "codigo": "SD-2026-001",
      "estado": "APROVADA",
      "dataHoraPartida": "2026-06-10T08:00:00-03:00",
      "dataHoraChegada": "2026-06-12T18:00:00-03:00",
      "valorTotalCalculado": 800.00
    }
  ]
}
```

## GET `/solicitacoes-diaria/{id}`

Consulta detalhe da solicitacao, incluindo alocacao do bolsista, calculo aplicado e aceite.

### Response `200`

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "codigo": "SD-2026-001",
    "estado": "APROVADA",
    "alocacaoBolsistaRef": "ALO-2026-001",
    "dataHoraPartida": "2026-06-10T08:00:00-03:00",
    "dataHoraChegada": "2026-06-12T18:00:00-03:00",
    "destino": "Vitoria/ES - evento de acompanhamento tecnico",
    "motivo": "Participacao dos bolsistas na apresentacao de resultados parciais da projeto.",
    "quantidadeDiariasCalculada": 2.5,
    "abrangenciaRef": "ABR-2026-001",
    "abrangenciaSnapshot": {
      "codigo": "DENTRO_ESTADO",
      "nome": "Dentro do Estado"
    },
    "tipoDiariaRef": "DIA-2026-001",
    "parametroCalculoDiariaRef": "PCD-2026-001",
    "valorUnitarioDiaria": 260.00,
    "memoriaCalculoSnapshot": {
      "normaReferencia": "Decreto ES no 5533-R/2023",
      "horasMinimasSemPernoite": 6,
      "percentualDiariaSemPernoite": 0.5
    },
    "valorTotalCalculado": 650.00,
    "estadoAceite": "ASSINADO",
    "dataAssinaturaAceite": "2026-06-01T14:30:00-03:00",
    "versaoAceite": "2026.1",
    "rubricaDebitoRef": "RUB-DIARIAS-PASSAGENS",
    "lancamentoDebitoRef": "LEX-2026-045"
  }
}
```

## POST `/solicitacoes-diaria/{id}/cancelar`

Remove/cancela solicitacao de diaria `ALOCADA` ou `APROVADA` com justificativa obrigatoria, somente antes da data/hora de partida. Quando a solicitacao tiver gerado debito na rubrica de Diarias e Passagens, o cancelamento gera um lancamento de credito na mesma rubrica.

### Request

```json
{
  "justificativa": "Viagem cancelada pela organizacao do evento."
}
```

### Response `200`

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "CANCELADA",
    "justificativaCancelamento": "Viagem cancelada pela organizacao do evento.",
    "lancamentoCreditoRef": "LEX-2026-046"
  },
  "lancamentoExecucao": {
    "id": "LEX-2026-046",
    "tipo": "CREDITO",
    "rubricaId": "RUB-DIARIAS-PASSAGENS",
    "valor": 800.00,
    "origem": "M003:SolicitacaoDiariaRemovida:SD-2026-001"
  }
}
```

## POST `/solicitacoes-diaria/{id}/regularizar-nao-utilizada`

Regulariza diaria nao utilizada quando a data/hora de partida ja passou. A solicitacao nao deve ser apagada fisicamente; o sistema preserva auditoria, exige justificativa e gera credito de reversao quando cabivel.

### Request

```json
{
  "justificativa": "Viagem nao realizada por cancelamento da agenda apos a data prevista."
}
```

### Response `200`

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "REGULARIZADA_NAO_UTILIZADA",
    "justificativaRegularizacao": "Viagem nao realizada por cancelamento da agenda apos a data prevista.",
    "lancamentoCreditoRef": "LEX-2026-052"
  }
}
```

## POST `/projetos/{id}/lancamentos-execucao`

Registra lancamento de execucao financeira. A origem deve permitir idempotencia quando o lancamento vier de outro modulo.

### Request

```json
{
  "rubricaId": "RUB-CAPITAL",
  "data": "2026-08-10",
  "descricao": "Nota fiscal de equipamento de processamento",
  "valor": 18400.00,
  "tipo": "EXECUCAO",
  "origem": "M014:DocumentoFiscal:DF-2026-223"
}
```

### Response `201`

```json
{
  "lancamento": {
    "id": "LEX-2026-001",
    "origem": "M014:DocumentoFiscal:DF-2026-223"
  }
}
```

## GET `/projetos/{id}/execucao`

Consulta a execucao consolidada da projeto.

### Response `200`

```json
{
  "projetoId": "INI-2026-014",
  "valorPlanejadoTotal": 250000.00,
  "valorExecutadoTotal": 18400.00,
  "saldoTotal": 231600.00,
  "rubricas": [
    {
      "rubricaId": "RUB-CAPITAL",
      "nome": "Capital",
      "valorPlanejado": 130000.00,
      "valorExecutado": 18400.00,
      "saldo": 111600.00
    }
  ]
}
```

## Autorizacao

| Endpoint | Perfis sugeridos |
|----------|------------------|
| `POST /projetos` | ANALISTA_AGENCIA |
| `GET /projetos/{id}` | ANALISTA_AGENCIA, ORTOGADO, MODULO_INTERNO |
| `GET /programas/{programaId}/projetos` | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET /parcerias/{parceriaId}/projetos` | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST /projetos/{id}/versoes-plano` | ANALISTA_AGENCIA |
| `POST /projetos/{id}/versoes-plano/{versaoId}/ativar` | ANALISTA_AGENCIA |
| `POST /projetos/{id}/solicitacoes-rubrica` | ORTOGADO |
| `POST /solicitacoes-rubrica/{id}/decisao` | ANALISTA_AGENCIA |
| `POST /projetos/{id}/solicitacoes-diaria` | ORTOGADO |
| `POST /solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/aceite` | BOLSISTA |
| `POST /solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/recusa` | BOLSISTA |
| `POST /solicitacoes-diaria/{id}/cancelar` | ORTOGADO |
| `POST /solicitacoes-diaria/{id}/regularizar-nao-utilizada` | ORTOGADO |
| `GET /projetos/{id}/solicitacoes-diaria` | ANALISTA_AGENCIA, ORTOGADO, MODULO_INTERNO |
| `GET /solicitacoes-diaria/{id}` | ANALISTA_AGENCIA, ORTOGADO, BOLSISTA, MODULO_INTERNO |
| `POST /projetos/{id}/lancamentos-execucao` | MODULO_INTERNO |
| `GET /projetos/{id}/execucao` | ANALISTA_AGENCIA, ORTOGADO, MODULO_INTERNO |
