# Contrato API - M003 Gestao de Iniciativas Captadas

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
| Edital/chamada/captacao | M011 | Referencia de origem da iniciativa, quando necessario |
| Bolsas, cotas, bolsistas e alocacoes | M009 | Consulta ou integracao; alocacoes sao referenciadas em beneficiarios de diaria |
| Documentos fiscais, extratos e prestacao de contas | M014 | Origem dos lancamentos de execucao consolidada e consumidor da solicitacao de diaria aprovada |
| PessoaFisica | M008 | Referencia para Ortogado, membros da equipe e conta bancaria confirmada no aceite de diaria |
| Programa e Parceria | M010 | Referencias para consultas e consolidacao estrategica |

## Endpoints

| Metodo | Path | Operacao | Descricao |
|--------|------|----------|-----------|
| POST | `/iniciativas` | RegistrarIniciativaContratada | Cria iniciativa apos contratacao/outorga |
| GET | `/iniciativas/{id}` | ConsultarIniciativaConsolidada | Consulta visao consolidada da iniciativa |
| GET | `/programas/{programaId}/iniciativas` | ConsultarIniciativasPorPrograma | Lista iniciativas associadas a programa |
| GET | `/parcerias/{parceriaId}/iniciativas` | ConsultarIniciativasPorParceria | Lista iniciativas associadas a parceria |
| POST | `/iniciativas/{id}/versoes-plano` | CriarVersaoPlanoIniciativa | Cria nova versao do plano da iniciativa |
| POST | `/iniciativas/{id}/versoes-plano/{versaoId}/ativar` | AtivarVersaoPlanoIniciativa | Ativa uma versao do plano |
| POST | `/tipos-diaria` | CadastrarTipoDiaria | FAPES cadastra valor, vigencia, fracao de calculo e tipo de viagem |
| POST | `/iniciativas/{id}/solicitacoes-rubrica` | SolicitarAlteracaoRubrica | Ortogado solicita inclusao ou retirada de rubrica |
| POST | `/solicitacoes-rubrica/{id}/decisao` | DecidirSolicitacaoAlteracaoRubrica | Analisa solicitacao de rubrica |
| POST | `/iniciativas/{id}/solicitacoes-diaria` | SolicitarDiaria | Ortogado solicita diaria para bolsistas da iniciativa |
| POST | `/solicitacoes-diaria/{id}/submeter-aceite` | SubmeterSolicitacaoDiariaParaAceite | Envia solicitacao para aceite dos bolsistas |
| POST | `/solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/aceite` | AssinarTermoAceiteDiaria | Bolsista assina o termo de aceite |
| POST | `/solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/recusa` | RecusarTermoAceiteDiaria | Bolsista recusa a viagem com justificativa |
| POST | `/solicitacoes-diaria/{id}/decisao` | DecidirSolicitacaoDiaria | FAPES aprova ou rejeita diaria e gera debito quando aprovada |
| POST | `/solicitacoes-diaria/{id}/cancelar` | CancelarSolicitacaoDiaria | Cancela solicitacao de diaria |
| GET | `/iniciativas/{id}/solicitacoes-diaria` | ConsultarSolicitacoesDiaria | Lista solicitacoes de diaria da iniciativa |
| GET | `/solicitacoes-diaria/{id}` | ConsultarSolicitacaoDiaria | Consulta detalhe da solicitacao de diaria |
| POST | `/iniciativas/{id}/lancamentos-execucao` | RegistrarLancamentoExecucao | Registra lancamento financeiro consolidavel |
| GET | `/iniciativas/{id}/execucao` | ConsultarExecucaoConsolidadaIniciativa | Consulta execucao consolidada por rubrica |

## Erros

```json
{
  "error": {
    "code": "INICIATIVA_NAO_ENCONTRADA",
    "message": "A iniciativa informada nao foi encontrada.",
    "details": {
      "iniciativaId": "INI-2026-014"
    }
  }
}
```

| HTTP | Codigo | Situacao |
|------|--------|----------|
| 400 | PAYLOAD_INVALIDO | Dados obrigatorios ausentes ou formato invalido |
| 403 | OPERACAO_NAO_AUTORIZADA | Usuario ou modulo sem permissao |
| 404 | INICIATIVA_NAO_ENCONTRADA | Iniciativa inexistente |
| 404 | VERSAO_PLANO_NAO_ENCONTRADA | Versao de plano inexistente |
| 404 | RUBRICA_NAO_ENCONTRADA | Rubrica inexistente |
| 409 | VERSAO_PLANO_VIGENTE_DUPLICADA | Tentativa de manter mais de uma versao vigente |
| 409 | LANCAMENTO_DUPLICADO | Lancamento ja registrado para a mesma origem |
| 422 | ORTOGADO_INVALIDO | Pessoa informada nao e o ortogado ativo da iniciativa |
| 422 | PLANO_INICIATIVA_INVALIDO | Plano nao atende as regras de objetivos/resultados/orcamento |
| 422 | RETIRADA_RUBRICA_IMPEDIDA | Rubrica possui lancamento impeditivo para retirada |
| 422 | PERIODO_DIARIA_INVALIDO | Data/hora de chegada deve ser posterior a partida |
| 422 | BENEFICIARIO_DIARIA_INVALIDO | Beneficiario nao possui alocacao valida na iniciativa |
| 422 | TIPO_DIARIA_VIGENTE_AUSENTE | Nao ha tipo de diaria vigente para o tipo de viagem informado |
| 422 | TIPO_DIARIA_INVALIDO | Tipo de diaria deve possuir tipo de viagem, valor maior que zero, fracao de calculo e vigencia valida |
| 422 | ACEITES_DIARIA_PENDENTES | Solicitacao ainda possui aceites obrigatorios pendentes |
| 422 | RUBRICA_DIARIAS_PASSAGENS_INVALIDA | Rubrica de Diarias e Passagens ausente ou invalida |
| 422 | JUSTIFICATIVA_CANCELAMENTO_DIARIA_OBRIGATORIA | Cancelamento de diaria exige justificativa |
| 422 | JUSTIFICATIVA_REJEICAO_DIARIA_OBRIGATORIA | Rejeicao de diaria pela FAPES exige justificativa |
| 409 | TIPO_DIARIA_VIGENCIA_SOBREPOSTA | Ja existe tipo de diaria ativo para a vigencia e tipo de viagem informados |
| 409 | ACEITE_DIARIA_JA_REGISTRADO | Beneficiario ja assinou ou recusou o termo |
| 409 | SOLICITACAO_DIARIA_VINCULADA_PRESTACAO | Solicitacao ja vinculada a prestacao de contas |

## POST `/iniciativas`

Cria uma iniciativa no M003 apos contratacao/outorga.

### Request

```json
{
  "tipoIniciativaId": "TIPO-PESQUISA",
  "titulo": "Laboratorio de Dados Publicos",
  "resumo": "Iniciativa para estruturacao de laboratorio institucional.",
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
  "iniciativa": {
    "id": "INI-2026-014",
    "codigo": "INI-2026-014",
    "estado": "CONTRATADA",
    "ortogadoId": "ORT-2026-001"
  }
}
```

## GET `/iniciativas/{id}`

Consulta a visao consolidada da iniciativa, incluindo plano vigente e resumo financeiro.

### Response `200`

```json
{
  "iniciativa": {
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

## GET `/programas/{programaId}/iniciativas`

Lista iniciativas associadas a um programa do M010.

### Response `200`

```json
{
  "programaId": "PROG-2026-01",
  "iniciativas": [
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

## GET `/parcerias/{parceriaId}/iniciativas`

Lista iniciativas associadas a uma parceria do M010.

### Response `200`

```json
{
  "parceriaId": "PAR-2026-03",
  "iniciativas": [
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

## POST `/iniciativas/{id}/versoes-plano`

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

## POST `/iniciativas/{id}/versoes-plano/{versaoId}/ativar`

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

## POST `/iniciativas/{id}/solicitacoes-rubrica`

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

## POST `/tipos-diaria`

Cadastra o tipo de diaria que sera usado pelo M003 no calculo das solicitacoes. A FAPES deve manter vigencias sem sobreposicao por tipo de viagem para evitar ambiguidade no calculo.

### Request

```json
{
  "codigo": "DIA-2026-001",
  "tipoViagemRef": "TVI-001",
  "valorUnitario": 260.00,
  "fracaoCalculo": "12H",
  "vigenciaInicio": "2026-01-01",
  "vigenciaFim": null,
  "ativo": true
}
```

### Response `201`

```json
{
  "tipoDiaria": {
    "id": "DIA-2026-001",
    "codigo": "DIA-2026-001",
    "tipoViagemRef": "TVI-001",
    "valorUnitario": 260.00,
    "fracaoCalculo": "12H",
    "vigenciaInicio": "2026-01-01",
    "vigenciaFim": null,
    "ativo": true
  }
}
```

## POST `/iniciativas/{id}/solicitacoes-diaria`

Cria solicitacao operacional de diaria para um ou mais bolsistas alocados na iniciativa. O valor nao e informado pelo coordenador; o sistema calcula quantidade a partir do periodo informado, localiza o tipo de diaria vigente para o tipo de viagem selecionado e usa valor unitario e fracao de calculo desse cadastro no momento da solicitacao.

### Request

```json
{
  "ortogadoId": "ORT-2026-001",
  "tipoViagemRef": "TVI-001",
  "dataHoraPartida": "2026-06-10T08:00:00-03:00",
  "dataHoraChegada": "2026-06-12T18:00:00-03:00",
  "destino": "Vitoria/ES - evento de acompanhamento tecnico",
  "motivo": "Participacao dos bolsistas na apresentacao de resultados parciais da iniciativa.",
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
    "estado": "RASCUNHO",
    "quantidadeDiariasCalculada": 2.5,
    "tipoViagemRef": "TVI-001",
    "tipoDiariaRef": "DIA-2026-001",
    "valorUnitarioDiaria": 260.00,
    "fracaoCalculoSnapshot": "12H",
    "valorTotalCalculado": 650.00,
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

## POST `/solicitacoes-diaria/{id}/submeter-aceite`

Submete a solicitacao para assinatura dos bolsistas e dispara notificacoes.

### Response `200`

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "AGUARDANDO_ACEITES",
    "beneficiariosPendentes": 1
  }
}
```

## POST `/solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/aceite`

Registra assinatura do termo de aceite pelo bolsista beneficiario.

### Request

```json
{
  "pessoaFisicaId": "PF-2026-045",
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
  "termoAceite": {
    "estado": "ASSINADO",
    "dataAssinatura": "2026-06-01T14:30:00-03:00",
    "versaoTermo": "2026.1"
  },
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "AGUARDANDO_APROVACAO"
  }
}
```

## POST `/solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/recusa`

Registra recusa da viagem pelo bolsista beneficiario. A justificativa e obrigatoria.

### Request

```json
{
  "pessoaFisicaId": "PF-2026-045",
  "justificativa": "Conflito de agenda academica no periodo da viagem."
}
```

### Response `200`

```json
{
  "termoAceite": {
    "estado": "RECUSADO",
    "dataRecusa": "2026-06-01T14:45:00-03:00"
  },
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "RECUSADA"
  }
}
```

## POST `/solicitacoes-diaria/{id}/decisao`

A FAPES aprova ou rejeita a solicitacao apos os aceites dos bolsistas. Quando aprovada, o M003 gera um lancamento de debito/comprometimento na rubrica de Diarias e Passagens. Quando rejeitada, a justificativa e obrigatoria e nenhum debito deve ser gerado.

### Request

```json
{
  "decisao": "APROVADA",
  "justificativa": "Deslocamento previsto no plano de trabalho e aceito pelos bolsistas.",
  "rubricaDiariasPassagensId": "RUB-DIARIAS-PASSAGENS"
}
```

### Response `200`

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "estado": "APROVADA",
    "valorTotalAprovado": 800.00,
    "rubricaDebitoRef": "RUB-DIARIAS-PASSAGENS",
    "lancamentoDebitoRef": "LEX-2026-045"
  },
  "lancamentoExecucao": {
    "id": "LEX-2026-045",
    "tipo": "DEBITO",
    "rubricaId": "RUB-DIARIAS-PASSAGENS",
    "valor": 800.00,
    "origem": "M003:SolicitacaoDiaria:SD-2026-001"
  }
}
```

## GET `/iniciativas/{id}/solicitacoes-diaria`

Lista solicitacoes de diaria da iniciativa, com filtros opcionais por busca livre, estado, periodo de partida e paginacao.

### Query params

| Parametro | Obrigatorio | Descricao |
|-----------|-------------|-----------|
| `busca` | Nao | Busca por codigo, iniciativa, coordenador, beneficiario, destino, motivo ou referencia da diaria corrente. |
| `estado` | Nao | Estado da solicitacao: `AGUARDANDO_ACEITES`, `AGUARDANDO_APROVACAO`, `APROVADA`, `REJEITADA`, `CANCELADA` ou `RECUSADA`. |
| `partidaInicio` | Nao | Data inicial do periodo de partida. |
| `partidaFim` | Nao | Data final do periodo de partida. |
| `pagina` | Nao | Numero da pagina, iniciando em 1. |
| `tamanhoPagina` | Nao | Quantidade de registros por pagina. |

### Response `200`

```json
{
  "iniciativaId": "INI-2026-014",
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

Consulta detalhe da solicitacao, incluindo beneficiarios, calculo aplicado e termos de aceite.

### Response `200`

```json
{
  "solicitacaoDiaria": {
    "id": "SD-2026-001",
    "codigo": "SD-2026-001",
    "estado": "APROVADA",
    "dataHoraPartida": "2026-06-10T08:00:00-03:00",
    "dataHoraChegada": "2026-06-12T18:00:00-03:00",
    "destino": "Vitoria/ES - evento de acompanhamento tecnico",
    "motivo": "Participacao dos bolsistas na apresentacao de resultados parciais da iniciativa.",
    "quantidadeDiariasCalculada": 2.5,
    "tipoViagemRef": "TVI-001",
    "tipoDiariaRef": "DIA-2026-001",
    "valorUnitarioDiaria": 260.00,
    "fracaoCalculoSnapshot": "12H",
    "valorTotalCalculado": 650.00,
    "rubricaDebitoRef": "RUB-DIARIAS-PASSAGENS",
    "lancamentoDebitoRef": "LEX-2026-045",
    "beneficiarios": [
      {
        "id": "BD-2026-001",
        "pessoaFisicaRef": "PF-2026-045",
        "valorCalculado": 650.00,
        "termoAceite": {
          "estado": "ASSINADO",
          "dataAssinatura": "2026-06-01T14:30:00-03:00",
          "versaoTermo": "2026.1"
        }
      }
    ]
  }
}
```

## POST `/solicitacoes-diaria/{id}/cancelar`

Cancela solicitacao de diaria com justificativa obrigatoria. Quando a solicitacao ja estiver aprovada e tiver gerado debito na rubrica de Diarias e Passagens, o cancelamento gera um lancamento de credito na mesma rubrica.

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
    "origem": "M003:SolicitacaoDiariaCancelada:SD-2026-001"
  }
}
```

## POST `/iniciativas/{id}/lancamentos-execucao`

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

## GET `/iniciativas/{id}/execucao`

Consulta a execucao consolidada da iniciativa.

### Response `200`

```json
{
  "iniciativaId": "INI-2026-014",
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
| `POST /iniciativas` | ANALISTA_AGENCIA |
| `GET /iniciativas/{id}` | ANALISTA_AGENCIA, ORTOGADO, MODULO_INTERNO |
| `GET /programas/{programaId}/iniciativas` | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET /parcerias/{parceriaId}/iniciativas` | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST /iniciativas/{id}/versoes-plano` | ANALISTA_AGENCIA |
| `POST /iniciativas/{id}/versoes-plano/{versaoId}/ativar` | ANALISTA_AGENCIA |
| `POST /tipos-diaria` | ANALISTA_AGENCIA |
| `POST /iniciativas/{id}/solicitacoes-rubrica` | ORTOGADO |
| `POST /solicitacoes-rubrica/{id}/decisao` | ANALISTA_AGENCIA |
| `POST /iniciativas/{id}/solicitacoes-diaria` | ORTOGADO |
| `POST /solicitacoes-diaria/{id}/submeter-aceite` | ORTOGADO |
| `POST /solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/aceite` | BOLSISTA |
| `POST /solicitacoes-diaria/{id}/beneficiarios/{beneficiarioId}/recusa` | BOLSISTA |
| `POST /solicitacoes-diaria/{id}/decisao` | ANALISTA_AGENCIA |
| `POST /solicitacoes-diaria/{id}/cancelar` | ORTOGADO |
| `GET /iniciativas/{id}/solicitacoes-diaria` | ANALISTA_AGENCIA, ORTOGADO, MODULO_INTERNO |
| `GET /solicitacoes-diaria/{id}` | ANALISTA_AGENCIA, ORTOGADO, BOLSISTA, MODULO_INTERNO |
| `POST /iniciativas/{id}/lancamentos-execucao` | MODULO_INTERNO |
| `GET /iniciativas/{id}/execucao` | ANALISTA_AGENCIA, ORTOGADO, MODULO_INTERNO |
