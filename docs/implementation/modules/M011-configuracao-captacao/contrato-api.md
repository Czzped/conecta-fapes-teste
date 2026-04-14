# Contrato de API HTTP — M011 Configuracao de Captacao

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M011 como bounded context responsavel pela configuracao de editais: cronograma, formularios de submissao e avaliacao, parametros de fomento e revisores ad hoc. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

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
| Identificadores | Strings opacas (ex: `EDT-2026-001`, `CRON-2026-001`, `REV-2026-010`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `ANALISTA_AGENCIA` | Analista da Agencia de Fomento — configura cronograma, formularios, parametros e revisores |
| `MODULO_INTERNO` | Modulo interno autorizado (M003) — acesso restrito a consulta de prontidao |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "edital": "EDT-2026-001"
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

### 1. Cronograma do Edital

#### `POST /api/v1/m011/editais/{editalId}/cronograma`

Registra ou versiona os periodos do cronograma de um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `ConfigurarCronogramaDoEdital`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital em M003 (ex: `EDT-2026-001`) |

**Request body**

```json
{
  "periodos": [
    {
      "tipo": "SUBMISSAO",
      "inicio": "2026-06-01",
      "fim": "2026-06-30"
    },
    {
      "tipo": "AVALIACAO_MERITO",
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
| `periodos[].tipo` | string (enum) | Sim | Um de: `SUBMISSAO`, `AVALIACAO_MERITO`, `RESULTADO_PRELIMINAR`, `RECURSO`, `RESULTADO_FINAL`, `CONTRATACAO` |
| `periodos[].inicio` | string (date) | Sim | Data de inicio do periodo |
| `periodos[].fim` | string (date) | Sim | Data de fim do periodo |
| `versao` | integer | Sim | Numero da versao do cronograma |

**Response `201 Created`**

```json
{
  "cronograma": {
    "id": "CRON-2026-001",
    "editalId": "EDT-2026-001",
    "versao": 1,
    "totalPeriodos": 2
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado para configuracao do cronograma. |
| `400` | `CRONOGRAMA_DADOS_INVALIDOS` | Os dados obrigatorios do cronograma nao foram informados corretamente. |
| `422` | `CRONOGRAMA_SEQUENCIA_INVALIDA` | Os periodos do cronograma nao respeitam a sequencia exigida pelo edital. |
| `422` | `EDITAL_PUBLICADO_IMUTAVEL` | Um edital publicado nao pode ter sua configuracao alterada diretamente. |

---

#### `GET /api/v1/m011/editais/{editalId}/cronograma`

Consulta o cronograma vigente de um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `versao` | integer | Numero da versao a consultar (padrao: versao mais recente) |

**Response `200 OK`**

```json
{
  "cronograma": {
    "id": "CRON-2026-001",
    "editalId": "EDT-2026-001",
    "versao": 1,
    "periodos": [
      {
        "tipo": "SUBMISSAO",
        "inicio": "2026-06-01",
        "fim": "2026-06-30"
      }
    ]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |
| `404` | `CRONOGRAMA_NAO_ENCONTRADO` | O cronograma nao foi configurado para o edital informado. |

---

### 2. Formularios de Submissao

#### `POST /api/v1/m011/editais/{editalId}/formularios/submissao`

Publica nova versao do formulario de submissao de um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `PublicarVersaoFormularioSubmissao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Request body**

```json
{
  "versao": 2,
  "campos": [
    "titulo",
    "resumo",
    "orcamento"
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `versao` | integer | Sim | Numero da versao do formulario |
| `campos` | array (string) | Sim | Lista de identificadores dos campos do formulario |

**Response `201 Created`**

```json
{
  "versaoFormulario": {
    "id": "VFS-2026-002",
    "editalId": "EDT-2026-001",
    "tipo": "SUBMISSAO",
    "versao": 2,
    "publicada": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado para configuracao do formulario. |
| `409` | `FORMULARIO_SUBMISSAO_DUPLICADO` | Nao pode haver dois formularios de submissao ativos simultaneamente. |
| `400` | `FORMULARIO_SUBMISSAO_INVALIDO` | A estrutura do formulario de submissao e invalida. |
| `422` | `EDITAL_PUBLICADO_IMUTAVEL` | Um edital publicado nao pode ter sua configuracao alterada diretamente. |

---

#### `GET /api/v1/m011/editais/{editalId}/formularios/submissao`

Consulta a versao ativa do formulario de submissao de um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Response `200 OK`**

```json
{
  "versaoFormulario": {
    "id": "VFS-2026-002",
    "tipo": "SUBMISSAO",
    "versao": 2,
    "publicada": true,
    "campos": ["titulo", "resumo", "orcamento"]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |
| `404` | `FORMULARIO_NAO_ENCONTRADO` | O formulario de submissao nao foi configurado para o edital informado. |

---

### 3. Formularios de Avaliacao

#### `POST /api/v1/m011/editais/{editalId}/formularios/avaliacao`

Publica nova versao do formulario de avaliacao de um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `PublicarVersaoFormularioAvaliacao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Request body**

```json
{
  "versao": 1,
  "campos": [
    "aderencia",
    "merito",
    "viabilidade"
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `versao` | integer | Sim | Numero da versao do formulario |
| `campos` | array (string) | Sim | Lista de identificadores dos campos do formulario |

**Response `201 Created`**

```json
{
  "versaoFormulario": {
    "id": "VFA-2026-001",
    "editalId": "EDT-2026-001",
    "tipo": "AVALIACAO",
    "versao": 1,
    "publicada": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado para configuracao do formulario de avaliacao. |
| `400` | `FORMULARIO_AVALIACAO_INVALIDO` | A estrutura do formulario de avaliacao e invalida. |
| `422` | `EDITAL_PUBLICADO_IMUTAVEL` | Um edital publicado nao pode ter sua configuracao alterada diretamente. |

---

#### `GET /api/v1/m011/editais/{editalId}/formularios/avaliacao`

Consulta a versao ativa do formulario de avaliacao de um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Response `200 OK`**

```json
{
  "versaoFormulario": {
    "id": "VFA-2026-001",
    "tipo": "AVALIACAO",
    "versao": 1,
    "publicada": true,
    "campos": ["aderencia", "merito", "viabilidade"]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |
| `404` | `FORMULARIO_NAO_ENCONTRADO` | O formulario de avaliacao nao foi configurado para o edital informado. |

---

### 4. Parametros de Fomento

#### `POST /api/v1/m011/editais/{editalId}/parametros-fomento`

Registra parametros de cota, orcamento e distribuicao por area do edital.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `ConfigurarParametrosDeFomento`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Request body**

```json
{
  "orcamentoTotal": 800000.0,
  "valorMaximoPorProjeto": 200000.0,
  "cotasArea": [
    {
      "area": "Tecnologia",
      "valor": 500000.0
    },
    {
      "area": "Saude",
      "valor": 300000.0
    }
  ],
  "parceriaId": "PAR-2026-03",
  "valorParceria": 300000.0
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `orcamentoTotal` | number | Sim | Orcamento total do edital |
| `valorMaximoPorProjeto` | number | Nao | Valor maximo aprovavel por projeto |
| `cotasArea` | array | Nao | Lista de cotas por area do conhecimento |
| `cotasArea[].area` | string | Sim | Nome da area |
| `cotasArea[].valor` | number | Sim | Valor alocado para a area |
| `parceriaId` | string | Nao | Identificador da parceria financiadora (M010) |
| `valorParceria` | number | Condicional | Valor da parceria destinado ao edital (obrigatorio quando `parceriaId` informado) |

**Response `201 Created`**

```json
{
  "parametroFomento": {
    "editalId": "EDT-2026-001",
    "orcamentoTotal": 800000.0,
    "valorMaximoPorProjeto": 200000.0
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado para configuracao de parametros. |
| `422` | `ORCAMENTO_EDITAL_INSUFICIENTE` | O orcamento total do edital e inferior ao valor distribuido por area. |
| `400` | `COTA_AREA_INVALIDA` | Uma ou mais cotas por area estao invalidas para o edital informado. |
| `422` | `EDITAL_PUBLICADO_IMUTAVEL` | Um edital publicado nao pode ter sua configuracao alterada diretamente. |

---

#### `GET /api/v1/m011/editais/{editalId}/parametros-fomento`

Consulta os parametros de fomento configurados para um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Response `200 OK`**

```json
{
  "parametroFomento": {
    "editalId": "EDT-2026-001",
    "orcamentoTotal": 800000.0,
    "valorMaximoPorProjeto": 200000.0,
    "cotasArea": [
      {
        "area": "Tecnologia",
        "valor": 500000.0
      }
    ],
    "parceriaId": "PAR-2026-03",
    "valorParceria": 300000.0
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |
| `404` | `PARAMETROS_NAO_ENCONTRADOS` | Os parametros de fomento nao foram configurados para o edital informado. |

---

#### `PUT /api/v1/m011/editais/{editalId}/parametros-fomento`

Atualiza os parametros de fomento de um edital nao publicado (US-M011-003).

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Request body**

```json
{
  "orcamentoTotal": 900000.0,
  "valorMaximoPorProjeto": 250000.0
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `orcamentoTotal` | number | Nao | Novo orcamento total do edital |
| `valorMaximoPorProjeto` | number | Nao | Novo valor maximo por projeto |
| `cotasArea` | array | Nao | Nova lista de cotas por area (substitui a lista existente) |

**Response `200 OK`**

```json
{
  "parametroFomento": {
    "editalId": "EDT-2026-001",
    "orcamentoTotal": 900000.0,
    "valorMaximoPorProjeto": 250000.0
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |
| `422` | `ORCAMENTO_EDITAL_INSUFICIENTE` | O orcamento total do edital e inferior ao valor distribuido por area. |
| `422` | `EDITAL_PUBLICADO_IMUTAVEL` | Um edital publicado nao pode ter sua configuracao alterada diretamente. |

---

### 5. Revisores Ad Hoc

#### `POST /api/v1/m011/editais/{editalId}/revisores`

Associa um revisor ad hoc ao edital com validacao de conflito de interesses.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `AssociarRevisorAdHoc`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

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
    "editalId": "EDT-2026-001",
    "revisorCpf": "123.456.789-00",
    "instituicaoId": "INST-2026-090"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado para associacao de revisor. |
| `422` | `CONFLITO_INTERESSE_REVISOR` | O revisor ad hoc nao pode avaliar propostas da propria instituicao. |
| `409` | `REVISOR_DUPLICADO_NO_EDITAL` | O revisor informado ja esta associado ao edital. |

---

#### `GET /api/v1/m011/editais/{editalId}/revisores`

Lista os revisores ad hoc associados ao edital (US-M011-010).

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "editalId": "EDT-2026-001",
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
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |

---

#### `DELETE /api/v1/m011/editais/{editalId}/revisores/{revisorId}`

Remove a associacao de um revisor ad hoc do edital.

- **Autorizacao:** `ANALISTA_AGENCIA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |
| `revisorId` | string | Identificador do revisor ad hoc |

**Response `204 No Content`**

Sem corpo na resposta.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |
| `404` | `REVISOR_NAO_ENCONTRADO` | O revisor informado nao foi encontrado neste edital. |
| `422` | `EDITAL_PUBLICADO_IMUTAVEL` | Um edital publicado nao pode ter sua configuracao alterada diretamente. |

---

### 6. Validacao de Prontidao

#### `GET /api/v1/m011/editais/{editalId}/validar-configuracao`

Valida se o edital possui configuracao minima para publicacao operacional.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ValidarConfiguracaoDoEdital`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Response `200 OK`**

```json
{
  "editalId": "EDT-2026-001",
  "prontoParaPublicacao": true,
  "pendencias": []
}
```

Exemplo com pendencias:

```json
{
  "editalId": "EDT-2026-001",
  "prontoParaPublicacao": false,
  "pendencias": [
    "Cronograma nao configurado.",
    "Formulario de submissao nao publicado."
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado para validacao. |
| `422` | `CONFIGURACAO_EDITAL_INCOMPLETA` | O edital ainda possui pendencias de cronograma, formulario ou parametro obrigatorio. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m011/editais/{editalId}/cronograma` | ConfigurarCronogramaDoEdital | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/editais/{editalId}/cronograma` | ConsultarCronogramaDoEdital | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m011/editais/{editalId}/formularios/submissao` | PublicarVersaoFormularioSubmissao | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/editais/{editalId}/formularios/submissao` | ConsultarFormularioSubmissao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m011/editais/{editalId}/formularios/avaliacao` | PublicarVersaoFormularioAvaliacao | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/editais/{editalId}/formularios/avaliacao` | ConsultarFormularioAvaliacao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m011/editais/{editalId}/parametros-fomento` | ConfigurarParametrosDeFomento | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/editais/{editalId}/parametros-fomento` | ConsultarParametrosDeFomento | ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/m011/editais/{editalId}/parametros-fomento` | AtualizarParametrosDeFomento | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m011/editais/{editalId}/revisores` | AssociarRevisorAdHoc | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/editais/{editalId}/revisores` | ListarRevisoresAdHoc | ANALISTA_AGENCIA, MODULO_INTERNO |
| `DELETE` | `/api/v1/m011/editais/{editalId}/revisores/{revisorId}` | RemoverRevisorAdHoc | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m011/editais/{editalId}/validar-configuracao` | ValidarConfiguracaoDoEdital | ANALISTA_AGENCIA, MODULO_INTERNO |

---

## Schemas de Dominio (Referencia)

### Cronograma

```json
{
  "id": "string",
  "editalId": "string",
  "versao": "integer",
  "periodos": [
    {
      "tipo": "SUBMISSAO | AVALIACAO_MERITO | RESULTADO_PRELIMINAR | RECURSO | RESULTADO_FINAL | CONTRATACAO",
      "inicio": "string (YYYY-MM-DD)",
      "fim": "string (YYYY-MM-DD)"
    }
  ]
}
```

### VersaoFormulario

```json
{
  "id": "string",
  "editalId": "string",
  "tipo": "SUBMISSAO | AVALIACAO",
  "versao": "integer",
  "publicada": "boolean",
  "campos": ["string"]
}
```

### ParametroFomento

```json
{
  "editalId": "string",
  "orcamentoTotal": "number",
  "valorMaximoPorProjeto": "number (opcional)",
  "cotasArea": [
    {
      "area": "string",
      "valor": "number"
    }
  ],
  "parceriaId": "string (opcional)",
  "valorParceria": "number (opcional)"
}
```

### RevisorAdHoc

```json
{
  "id": "string",
  "editalId": "string",
  "revisorCpf": "string",
  "instituicaoId": "string"
}
```

### ChecklistProntidao

```json
{
  "editalId": "string",
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
| EPIC-M011-001 (Configuracao do Edital) | [epics/EPIC-M011-001.md](epics/EPIC-M011-001.md) |
| EPIC-M011-002 (Gestao de Formularios) | [epics/EPIC-M011-002.md](epics/EPIC-M011-002.md) |
| EPIC-M011-003 (Gestao de Revisores Ad Hoc) | [epics/EPIC-M011-003.md](epics/EPIC-M011-003.md) |
