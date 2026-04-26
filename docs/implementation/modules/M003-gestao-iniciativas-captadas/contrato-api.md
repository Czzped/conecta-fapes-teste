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
| Bolsas, cotas, bolsistas e alocacoes | M009 | Consulta ou integracao, sem persistir como entidade do M003 |
| Documentos fiscais, extratos e prestacao de contas | M014 | Origem dos lancamentos de execucao consolidada |
| PessoaFisica | M008 | Referencia para Ortogado e membros da equipe |
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
| POST | `/iniciativas/{id}/solicitacoes-rubrica` | SolicitarAlteracaoRubrica | Ortogado solicita inclusao ou retirada de rubrica |
| POST | `/solicitacoes-rubrica/{id}/decisao` | DecidirSolicitacaoAlteracaoRubrica | Analisa solicitacao de rubrica |
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
| `POST /iniciativas/{id}/solicitacoes-rubrica` | ORTOGADO |
| `POST /solicitacoes-rubrica/{id}/decisao` | ANALISTA_AGENCIA |
| `POST /iniciativas/{id}/lancamentos-execucao` | MODULO_INTERNO |
| `GET /iniciativas/{id}/execucao` | ANALISTA_AGENCIA, ORTOGADO, MODULO_INTERNO |
