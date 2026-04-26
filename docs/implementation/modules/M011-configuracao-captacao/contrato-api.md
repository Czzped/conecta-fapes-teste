# Contrato de API HTTP — M011 Configuracao de Captacao

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M011 como bounded context responsavel pela configuracao de captacoes: cronograma, formularios de submissao, avaliacao, revisao e anexos, categorias de iniciativas, aportes financeiros, faixas de financiamento, regras e requisitos de submissao, documentos exigidos, prestacoes exigidas e revisores ad hoc. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m011
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `CAP-2026-001`, `CRON-2026-001`, `REV-2026-010`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `ANALISTA_AGENCIA` | Analista da Agencia de Fomento — configura cronograma, formularios, categorias, regras, requisitos, documentos exigidos e revisores |
| `DIRETORIA_FAPES` | Diretoria da FAPES — pode instanciar processo de captacao a partir de configuracao publicada |
| `AREA_TECNICA` | Area tecnica responsavel pela captacao — executa publicacao, avaliacao documental, distribuicao, consolidacao, revisao e resultados |
| `PROPONENTE` | Pessoa ou instituicao que submete proposta e solicita revisao de resultado |
| `REVISOR_AD_HOC` | Consultor externo que registra avaliacao de proposta distribuida |
| `MODULO_INTERNO` | Modulo interno autorizado, especialmente M022 para consumo de propostas aprovadas — acesso restrito a consulta de prontidao e resultados |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

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

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | Formulario ativo duplicado, revisor duplicado |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido para a operacao solicitada |

---

## Recursos

### 1. Cronograma da Captacao

#### `POST /api/v1/m011/captacoes/{captacaoId}/cronograma`

Registra ou versiona as fases do cronograma da captacao.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `ConfigurarCronogramaDaCaptacao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao (ex: `CAP-2026-001`) |

**Request body**

```json
{
  "periodos": [
    {
      "tipo": "RECEBIMENTO_PROPOSTAS",
      "inicio": "2026-06-01",
      "fim": "2026-06-30"
    },
    {
      "tipo": "AVALIACAO_AD_HOC",
      "inicio": "2026-07-01",
      "fim": "2026-07-31"
    }
  ],
  "versao": 1
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `periodos` | array | Sim | Lista de periodos do cronograma |
| `periodos[].tipo` | string (enum) | Sim | Um de: `PUBLICACAO_CAPTACAO`, `RECEBIMENTO_PROPOSTAS`, `AVALIACAO_DOCUMENTAL`, `AVALIACAO_AD_HOC`, `RESULTADO_PRELIMINAR`, `RECEBIMENTO_REVISAO`, `RESULTADO_APOS_REVISAO`, `RESULTADO_FINAL` |
| `periodos[].inicio` | string (date) | Sim | Data de inicio do periodo |
| `periodos[].fim` | string (date) | Sim | Data de fim do periodo |
| `versao` | integer | Sim | Numero da versao do cronograma |

**Response `201 Created`**

```json
{
  "cronograma": {
    "id": "CRON-2026-001",
    "captacaoId": "CAP-2026-001",
    "versao": 1,
    "totalPeriodos": 2
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada para configuracao do cronograma. |
| `400` | `CRONOGRAMA_DADOS_INVALIDOS` | Os dados obrigatorios do cronograma nao foram informados corretamente. |
| `422` | `CRONOGRAMA_SEQUENCIA_INVALIDA` | Os periodos do cronograma nao respeitam a sequencia exigida pela captacao. |
| `422` | `CONFIGURACAO_CAPTACAO_PUBLICADA_IMUTAVEL` | Uma configuracao de captacao publicada nao pode ser alterada diretamente. |

---

#### `POST /api/v1/m011/captacoes/{captacaoId}/cronograma/adiamentos`

Registra o adiamento de uma etapa do cronograma e desloca automaticamente as etapas posteriores pela mesma quantidade de dias.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `AdiarEtapaCronogramaDaCaptacao`
- **Idempotencia:** Nao

**Request body**

```json
{
  "tipoPeriodo": "AVALIACAO_DOCUMENTAL",
  "dias": 5,
  "justificativa": "Necessidade de tempo adicional para conferencia documental"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `tipoPeriodo` | string (enum) | Sim | Etapa do cronograma que sera adiada |
| `dias` | integer | Sim | Quantidade de dias a acrescentar na etapa e nas etapas posteriores |
| `justificativa` | string | Sim | Motivo do adiamento |

**Response `201 Created`**

```json
{
  "adiamento": {
    "id": "ADI-2026-001",
    "tipoPeriodo": "AVALIACAO_DOCUMENTAL",
    "dias": 5,
    "dataRegistro": "2026-06-10"
  },
  "cronogramaAtualizado": true
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CRONOGRAMA_NAO_ENCONTRADO` | O cronograma nao foi configurado para a captacao informada. |
| `404` | `ETAPA_CRONOGRAMA_NAO_ENCONTRADA` | A etapa informada nao existe no cronograma da captacao. |
| `400` | `ADIAMENTO_DADOS_INVALIDOS` | O adiamento deve possuir quantidade de dias positiva e justificativa. |
| `422` | `CRONOGRAMA_SEQUENCIA_INVALIDA` | O adiamento gerou uma sequencia invalida no cronograma. |

---

#### `GET /api/v1/m011/captacoes/{captacaoId}/cronograma`

Consulta o cronograma vigente de uma captacao.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `versao` | integer | Numero da versao a consultar (padrao: versao mais recente) |

**Response `200 OK`**

```json
{
  "cronograma": {
    "id": "CRON-2026-001",
    "captacaoId": "CAP-2026-001",
    "versao": 1,
    "periodos": [
      {
        "tipo": "RECEBIMENTO_PROPOSTAS",
        "inicio": "2026-06-01",
        "fim": "2026-06-30"
      }
    ],
    "adiamentos": [
      {
        "id": "ADI-2026-001",
        "tipoPeriodo": "AVALIACAO_DOCUMENTAL",
        "dias": 5,
        "justificativa": "Necessidade de tempo adicional para conferencia documental",
        "dataRegistro": "2026-06-10"
      }
    ]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada. |
| `404` | `CRONOGRAMA_NAO_ENCONTRADO` | O cronograma nao foi configurado para a captacao informada. |

---

### 2. Formularios de Submissao

#### `POST /api/v1/m011/captacoes/{captacaoId}/formularios/submissao`

Seleciona uma versao publicada no M021 para ser usada como formulario de submissao de uma captacao.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `SelecionarFormularioSubmissao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Request body**

```json
{
  "formularioId": "FORM-2026-001",
  "versaoFormularioId": "VF-2026-002"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `formularioId` | string | Sim | Identificador do formulario no M021 |
| `versaoFormularioId` | string | Sim | Identificador da versao publicada do formulario no M021 |

**Response `201 Created`**

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

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada para configuracao do formulario. |
| `404` | `FORMULARIO_NAO_ENCONTRADO` | O formulario informado nao foi encontrado no M021. |
| `422` | `VERSAO_FORMULARIO_NAO_PUBLICADA` | A versao informada nao esta publicada no M021. |
| `409` | `FORMULARIO_SUBMISSAO_DUPLICADO` | Nao pode haver dois formularios de submissao ativos simultaneamente. |
| `422` | `CONFIGURACAO_CAPTACAO_PUBLICADA_IMUTAVEL` | Uma configuracao de captacao publicada nao pode ser alterada diretamente. |

---

#### `GET /api/v1/m011/captacoes/{captacaoId}/formularios/submissao`

Consulta a versao ativa do formulario de submissao de uma captacao.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Response `200 OK`**

```json
{
  "formularioSelecionado": {
    "formularioId": "FORM-2026-001",
    "versaoFormularioId": "VF-2026-002",
    "tipo": "SUBMISSAO",
    "origem": "M021"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada. |
| `404` | `FORMULARIO_NAO_ENCONTRADO` | O formulario de submissao nao foi configurado para a captacao informada. |

---

### 3. Formularios de Avaliacao

#### `POST /api/v1/m011/captacoes/{captacaoId}/formularios/avaliacao`

Seleciona uma versao publicada no M021 para ser usada como formulario de avaliacao ad hoc de uma captacao.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `SelecionarFormularioAvaliacao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Request body**

```json
{
  "formularioId": "FORM-2026-010",
  "versaoFormularioId": "VF-2026-015"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `formularioId` | string | Sim | Identificador do formulario no M021 |
| `versaoFormularioId` | string | Sim | Identificador da versao publicada do formulario no M021 |

**Response `201 Created`**

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

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada para configuracao do formulario de avaliacao. |
| `404` | `FORMULARIO_NAO_ENCONTRADO` | O formulario informado nao foi encontrado no M021. |
| `422` | `VERSAO_FORMULARIO_NAO_PUBLICADA` | A versao informada nao esta publicada no M021. |
| `422` | `CONFIGURACAO_CAPTACAO_PUBLICADA_IMUTAVEL` | Uma configuracao de captacao publicada nao pode ser alterada diretamente. |

---

#### `GET /api/v1/m011/captacoes/{captacaoId}/formularios/avaliacao`

Consulta a versao ativa do formulario de avaliacao de uma captacao.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Response `200 OK`**

```json
{
  "formularioSelecionado": {
    "formularioId": "FORM-2026-010",
    "versaoFormularioId": "VF-2026-015",
    "tipo": "AVALIACAO_AD_HOC",
    "origem": "M021"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada. |
| `404` | `FORMULARIO_NAO_ENCONTRADO` | O formulario de avaliacao nao foi configurado para a captacao informada. |

---

### 4. Formulario de Revisao de Resultado

#### `POST /api/v1/m011/captacoes/{captacaoId}/formularios/revisao`

Seleciona uma versao publicada no M021 para ser usada como formulario de revisao de resultado de uma captacao.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `SelecionarFormularioRevisao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Request body**

```json
{
  "formularioId": "FORM-2026-020",
  "versaoFormularioId": "VF-2026-021"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `formularioId` | string | Sim | Identificador do formulario no M021 |
| `versaoFormularioId` | string | Sim | Identificador da versao publicada do formulario no M021 |

**Response `201 Created`**

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

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada para configuracao do formulario de revisao. |
| `404` | `FORMULARIO_NAO_ENCONTRADO` | O formulario informado nao foi encontrado no M021. |
| `422` | `VERSAO_FORMULARIO_NAO_PUBLICADA` | A versao informada nao esta publicada no M021. |
| `422` | `CONFIGURACAO_CAPTACAO_PUBLICADA_IMUTAVEL` | Uma configuracao de captacao publicada nao pode ser alterada diretamente. |

---

#### `GET /api/v1/m011/captacoes/{captacaoId}/formularios/revisao`

Consulta o formulario de revisao de resultado selecionado para uma captacao.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Response `200 OK`**

```json
{
  "formularioSelecionado": {
    "formularioId": "FORM-2026-020",
    "versaoFormularioId": "VF-2026-021",
    "tipo": "REVISAO_RESULTADO",
    "origem": "M021"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada. |
| `404` | `FORMULARIO_NAO_ENCONTRADO` | O formulario de revisao nao foi configurado para a captacao informada. |

---

### 5. Configuracoes Complementares da Captacao

As rotas abaixo mantem as configuracoes complementares descobertas no processo e no prototipo. Os payloads devem seguir o modelo estrutural do M011.

| Metodo | Path | Operacao | Payload principal |
|--------|------|----------|-------------------|
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/formularios/anexos` | SelecionarFormularioAnexos | `formularioId`, `versaoFormularioId` |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/categorias-iniciativas` | ConfigurarCategoriasDeIniciativas | `categorias[]` |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/aportes-financeiros` | ConfigurarAportesFinanceirosCaptacao | origem Programa/Parceria e valor aportado |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/faixas-financiamento` | ConfigurarFaixasFinanciamento | `duracaoMaximaMeses`, `valorMinimo`, `valorMaximo`, `valorAportado` |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/regras-submissao` | ConfigurarRegrasSubmissao | flags de multiplas propostas, acumulo de bolsa e restricao a escolhidos |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/proponentes-escolhidos` | ConfigurarProponentesEscolhidos | tipo INSTITUICAO/PESSOA e IDs autorizados |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/requisitos-proponente` | ConfigurarRequisitosProponente | direcionamento, instituicao/tipo de instituicao, nivel academico minimo e restricoes |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/documentos-exigidos` | ConfigurarDocumentosExigidos | documentos, formatos permitidos e obrigatoriedade |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/prestacoes-exigidas` | ConfigurarPrestacoesExigidas | `exigePrestacaoTecnica`, `exigePrestacaoFinanceira` |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/regra-avaliacao` | ConfigurarRegraAvaliacao | `exigeAvaliacaoAdHoc`, `quantidadeMinimaRevisores` |

**Exemplo: faixas de financiamento**

```json
{
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

**Exemplo: aportes financeiros**

```json
{
  "aportes": [
    {
      "origemTipo": "PROGRAMA",
      "programaId": "PROG-2026-001",
      "valorAportado": 500000.0
    },
    {
      "origemTipo": "PARCERIA",
      "parceriaId": "PAR-2026-003",
      "valorAportado": 300000.0
    }
  ]
}
```

**Exemplo: proponentes escolhidos**

```json
{
  "tipo": "INSTITUICAO",
  "instituicoesIds": [
    "INST-UFES",
    "INST-IFES"
  ]
}
```

**Exemplo: requisitos do proponente**

```json
{
  "tipo": "PESSOA",
  "pessoasCpfs": [
    "12345678900",
    "23456789011"
  ]
}
```

```json
{
  "direcionamento": "TIPO_INSTITUICAO",
  "tipoInstituicaoId": "TIPO-INST-ENSINO",
  "permiteParceriaInstituicoes": true,
  "exigeVinculoEmpregaticio": false,
  "exigeGestorInstitucional": true,
  "nivelAcademicoMinimoId": "NIVEL-DOUTORADO"
}
```

**Exemplo: documentos exigidos**

```json
{
  "documentos": [
    {
      "documentoExigidoId": "DOC-CONTRATO-SOCIAL",
      "obrigatorio": true,
      "formatosPermitidos": ["PDF"],
      "reutilizarCadastroCorporativo": true,
      "exigirNovoEnvioSeVencido": true
    }
  ]
}
```

Quando o documento exigido for institucional e o proponente for empresa ou instituicao, o consumidor deve verificar se ha representante legal e documento valido no cadastro corporativo do M008 antes de exigir novo envio na submissao.

---

### 7. Revisores Ad Hoc

#### `POST /api/v1/m011/captacoes/{captacaoId}/revisores`

Associa um revisor ad hoc a captacao com validacao de conflito de interesses.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `AssociarRevisorAdHoc`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Request body**

```json
{
  "revisorCpf": "123.456.789-00",
  "instituicaoId": "INST-2026-090"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `revisorCpf` | string | Sim | CPF do revisor ad hoc |
| `instituicaoId` | string | Sim | Identificador da instituicao de vinculo do revisor |

**Response `201 Created`**

```json
{
  "revisorAdHoc": {
    "id": "REV-2026-010",
    "captacaoId": "CAP-2026-001",
    "revisorCpf": "123.456.789-00",
    "instituicaoId": "INST-2026-090"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada para associacao de revisor. |
| `422` | `CONFLITO_INTERESSE_REVISOR` | O revisor ad hoc nao pode avaliar propostas da propria instituicao. |
| `409` | `REVISOR_DUPLICADO_NA_CAPTACAO` | O revisor informado ja esta associado a captacao. |

---

#### `GET /api/v1/m011/captacoes/{captacaoId}/revisores`

Lista os revisores ad hoc associados a captacao (US-M011-010).

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "captacaoId": "CAP-2026-001",
  "items": [
    {
      "id": "REV-2026-010",
      "revisorCpf": "123.456.789-00",
      "instituicaoId": "INST-2026-090"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada. |

---

#### `DELETE /api/v1/m011/captacoes/{captacaoId}/revisores/{revisorId}`

Remove a associacao de um revisor ad hoc da captacao.

- **Autorizacao:** `ANALISTA_AGENCIA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |
| `revisorId` | string | Identificador do revisor ad hoc |

**Response `204 No Content`**

Sem corpo na resposta.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada. |
| `404` | `REVISOR_NAO_ENCONTRADO` | O revisor informado nao foi encontrado nesta captacao. |
| `422` | `CONFIGURACAO_CAPTACAO_PUBLICADA_IMUTAVEL` | Uma configuracao de captacao publicada nao pode ser alterada diretamente. |

---

### 7. Validacao de Prontidao

#### `GET /api/v1/m011/captacoes/{captacaoId}/validar-configuracao`

Valida se a captacao possui configuracao minima para publicacao operacional.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ValidarConfiguracaoDaCaptacao`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `captacaoId` | string | Identificador da captacao |

**Response `200 OK`**

```json
{
  "captacaoId": "CAP-2026-001",
  "prontoParaPublicacao": true,
  "pendencias": []
}
```

Exemplo com pendencias:

```json
{
  "captacaoId": "CAP-2026-001",
  "prontoParaPublicacao": false,
  "pendencias": [
    "Cronograma nao configurado.",
    "Formulario de submissao nao selecionado."
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CAPTACAO_NAO_ENCONTRADA` | A captacao informada nao foi encontrada para validacao. |
| `422` | `CONFIGURACAO_CAPTACAO_INCOMPLETA` | A captacao ainda possui pendencias de cronograma, formulario ou configuracao obrigatoria. |

---

### 8. Operacoes da Instancia da Captacao

Estas rotas representam o processo operacional descrito em [process.md](process.md). O detalhamento completo de payload de cada formulario continua dependente das versoes selecionadas no M021.

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/instancias` | InstanciarProcessoCaptacao | DIRETORIA_FAPES, AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/publicacao` | PublicarCaptacao | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas` | SubmeterProposta | PROPONENTE |
| `GET` | `/api/v1/m011/captacoes/{captacaoId}/propostas` | ListarPropostasDaCaptacao | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas/{propostaId}/avaliacao-documental` | RegistrarAvaliacaoDocumental | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas/{propostaId}/distribuicoes` | DistribuirPropostasParaRevisores | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas/{propostaId}/avaliacoes-ad-hoc` | AvaliarProposta | REVISOR_AD_HOC |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/resultados/preliminar` | PublicarResultado | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas/{propostaId}/revisoes` | SubmeterRevisaoResultado | PROPONENTE |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/revisoes/{revisaoId}/decisao` | AnalisarRevisaoResultado | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/resultados/final` | PublicarResultado | AREA_TECNICA |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/cronograma` | ConfigurarCronogramaDaCaptacao | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/cronograma/adiamentos` | AdiarEtapaCronogramaDaCaptacao | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/captacoes/{captacaoId}/cronograma` | ConsultarCronogramaDaCaptacao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/formularios/submissao` | SelecionarFormularioSubmissao | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/captacoes/{captacaoId}/formularios/submissao` | ConsultarFormularioSubmissao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/formularios/avaliacao` | SelecionarFormularioAvaliacao | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/captacoes/{captacaoId}/formularios/avaliacao` | ConsultarFormularioAvaliacao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/formularios/revisao` | SelecionarFormularioRevisao | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/captacoes/{captacaoId}/formularios/revisao` | ConsultarFormularioRevisao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/formularios/anexos` | SelecionarFormularioAnexos | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/categorias-iniciativas` | ConfigurarCategoriasDeIniciativas | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/aportes-financeiros` | ConfigurarAportesFinanceirosCaptacao | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/faixas-financiamento` | ConfigurarFaixasFinanciamento | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/regras-submissao` | ConfigurarRegrasSubmissao | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/proponentes-escolhidos` | ConfigurarProponentesEscolhidos | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/requisitos-proponente` | ConfigurarRequisitosProponente | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/documentos-exigidos` | ConfigurarDocumentosExigidos | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/prestacoes-exigidas` | ConfigurarPrestacoesExigidas | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/regra-avaliacao` | ConfigurarRegraAvaliacao | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/revisores` | AssociarRevisorAdHoc | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/captacoes/{captacaoId}/revisores` | ListarRevisoresAdHoc | ANALISTA_AGENCIA, MODULO_INTERNO |
| `DELETE` | `/api/v1/m011/captacoes/{captacaoId}/revisores/{revisorId}` | RemoverRevisorAdHoc | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/captacoes/{captacaoId}/validar-configuracao` | ValidarConfiguracaoDaCaptacao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/instancias` | InstanciarProcessoCaptacao | DIRETORIA_FAPES, AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/publicacao` | PublicarCaptacao | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas` | SubmeterProposta | PROPONENTE |
| `GET` | `/api/v1/m011/captacoes/{captacaoId}/propostas` | ListarPropostasDaCaptacao | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas/{propostaId}/avaliacao-documental` | RegistrarAvaliacaoDocumental | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas/{propostaId}/distribuicoes` | DistribuirPropostasParaRevisores | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas/{propostaId}/avaliacoes-ad-hoc` | AvaliarProposta | REVISOR_AD_HOC |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/resultados/preliminar` | PublicarResultado | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/propostas/{propostaId}/revisoes` | SubmeterRevisaoResultado | PROPONENTE |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/revisoes/{revisaoId}/decisao` | AnalisarRevisaoResultado | AREA_TECNICA |
| `POST` | `/api/v1/m011/captacoes/{captacaoId}/resultados/final` | PublicarResultado | AREA_TECNICA |

---

## Schemas de Dominio (Referencia)

### Cronograma

```json
{
  "id": "string",
  "captacaoId": "string",
  "versao": "integer",
  "periodos": [
    {
      "tipo": "PUBLICACAO_CAPTACAO | RECEBIMENTO_PROPOSTAS | AVALIACAO_DOCUMENTAL | AVALIACAO_AD_HOC | RESULTADO_PRELIMINAR | RECEBIMENTO_REVISAO | RESULTADO_APOS_REVISAO | RESULTADO_FINAL",
      "inicio": "string (YYYY-MM-DD)",
      "fim": "string (YYYY-MM-DD)"
    }
  ]
}
```

### FormularioSelecionado

```json
{
  "captacaoId": "string",
  "formularioId": "string",
  "versaoFormularioId": "string",
  "tipo": "SUBMISSAO | AVALIACAO_AD_HOC | REVISAO_RESULTADO",
  "origem": "M021"
}
```

### RevisorAdHoc

```json
{
  "id": "string",
  "captacaoId": "string",
  "revisorCpf": "string",
  "instituicaoId": "string"
}
```

### ChecklistProntidao

```json
{
  "captacaoId": "string",
  "prontoParaPublicacao": "boolean",
  "pendencias": ["string"]
}
```

---

## Rastreabilidade

| Artefato | Link |
|----------|------|
| Contrato de aplicacao (operacoes) | [contrato.md](contrato.md) |
| Dominio e regras de negocio | [README.md](README.md) |
| Modelo estrutural | [modelo-estrutural.md](modelo-estrutural.md) |
| Modelo comportamental | [modelo-comportamental.md](modelo-comportamental.md) |
| EPIC-M011-001 (Configuracao da Captacao) | [epics/EPIC-M011-001.md](epics/EPIC-M011-001.md) |
| EPIC-M011-002 (Selecao de Formularios) | [epics/EPIC-M011-002.md](epics/EPIC-M011-002.md) |
| EPIC-M011-003 (Gestao de Pool de Revisores Ad Hoc) | [epics/EPIC-M011-003.md](epics/EPIC-M011-003.md) |
