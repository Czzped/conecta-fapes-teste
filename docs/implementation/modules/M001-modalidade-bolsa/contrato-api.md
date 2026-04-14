# Contrato de API HTTP — M001 Modalidade Bolsa

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M001 como bounded context responsavel por resolucoes, modalidades, versoes, niveis e requisitos de bolsa. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m001
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `RES-332-2026`, `MOD-BPIG`, `VM-BPIG-2026-01`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `ANALISTA_AGENCIA` | Analista da Agencia de Fomento — acesso completo de leitura e escrita |
| `MODULO_INTERNO` | Modulo interno autorizado — acesso restrito a consultas de referencia |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "campo": "valor-relacionado-ao-erro"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | Numero duplicado, versao ja em edicao |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido para a operacao solicitada |

---

## Recursos

### 1. Resolucoes

#### `POST /api/v1/m001/resolucoes`

Registra a base legal para modalidades de bolsa.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CriarResolucao`
- **Idempotencia:** Nao

**Request body**

```json
{
  "numero": 332,
  "data": "2026-03-17",
  "ementa": "Atualiza as modalidades de bolsa de pesquisa e inovacao.",
  "url": "https://agencia.gov.br/resolucoes/332-2026"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `numero` | integer | Sim | Numero unico da resolucao |
| `data` | string (date) | Sim | Data de publicacao no formato `YYYY-MM-DD` |
| `ementa` | string | Sim | Descricao resumida da resolucao |
| `url` | string (url) | Nao | Link para o documento oficial |

**Response `201 Created`**

```json
{
  "resolucao": {
    "id": "RES-332-2026",
    "numero": 332,
    "data": "2026-03-17",
    "ementa": "Atualiza as modalidades de bolsa de pesquisa e inovacao.",
    "url": "https://agencia.gov.br/resolucoes/332-2026"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `RESOLUCAO_NUMERO_DUPLICADO` | Ja existe uma resolucao cadastrada com o numero informado. |
| `400` | `RESOLUCAO_DADOS_INVALIDOS` | Os dados obrigatorios da resolucao nao foram informados corretamente. |

---

#### `GET /api/v1/m001/resolucoes`

Lista e filtra resolucoes cadastradas.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `ListarOuConsultarResolucoes`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `numero` | integer | Filtra pelo numero exato da resolucao |
| `dataInicio` | string (date) | Filtra resolucoes a partir desta data |
| `dataFim` | string (date) | Filtra resolucoes ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "RES-332-2026",
      "numero": 332,
      "data": "2026-03-17",
      "ementa": "Atualiza as modalidades de bolsa de pesquisa e inovacao."
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
| `400` | `FILTRO_RESOLUCAO_INVALIDO` | Os filtros informados para consulta de resolucao sao invalidos. |

---

#### `GET /api/v1/m001/resolucoes/{id}`

Consulta o detalhe de uma resolucao pelo identificador.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `ListarOuConsultarResolucoes`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da resolucao (ex: `RES-332-2026`) |

**Response `200 OK`**

```json
{
  "resolucao": {
    "id": "RES-332-2026",
    "numero": 332,
    "data": "2026-03-17",
    "ementa": "Atualiza as modalidades de bolsa de pesquisa e inovacao.",
    "url": "https://agencia.gov.br/resolucoes/332-2026"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RESOLUCAO_NAO_ENCONTRADA` | A resolucao informada nao foi encontrada. |

---

#### `PUT /api/v1/m001/resolucoes/{id}`

Atualiza os dados de uma resolucao existente. (US-M001-003)

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da resolucao |

**Request body**

```json
{
  "ementa": "Atualiza as modalidades de bolsa de pesquisa, inovacao e extensao.",
  "url": "https://agencia.gov.br/resolucoes/332-2026-rev1"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `ementa` | string | Sim | Nova ementa da resolucao |
| `url` | string (url) | Nao | Novo link para o documento oficial |

**Response `200 OK`**

```json
{
  "resolucao": {
    "id": "RES-332-2026",
    "numero": 332,
    "data": "2026-03-17",
    "ementa": "Atualiza as modalidades de bolsa de pesquisa, inovacao e extensao.",
    "url": "https://agencia.gov.br/resolucoes/332-2026-rev1"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RESOLUCAO_NAO_ENCONTRADA` | A resolucao informada nao foi encontrada. |
| `400` | `RESOLUCAO_DADOS_INVALIDOS` | Os dados obrigatorios da resolucao nao foram informados corretamente. |

---

#### `DELETE /api/v1/m001/resolucoes/{id}`

Remove uma resolucao que nao possui modalidades vinculadas. (US-M001-004)

- **Autorizacao:** `ANALISTA_AGENCIA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da resolucao |

**Response `204 No Content`**

Sem corpo na resposta.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RESOLUCAO_NAO_ENCONTRADA` | A resolucao informada nao foi encontrada. |
| `422` | `RESOLUCAO_COM_MODALIDADES_VINCULADAS` | A resolucao nao pode ser removida pois possui modalidades vinculadas. |

---

### 2. Modalidades

#### `POST /api/v1/m001/modalidades`

Registra uma nova modalidade de bolsa e sua primeira versao em edicao.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CriarModalidade`
- **Idempotencia:** Nao

**Request body**

```json
{
  "sigla": "BPIG",
  "nome": "Bolsa de Pesquisa e Inovacao em Governo",
  "resolucaoId": "RES-332-2026",
  "descricao": "Bolsa destinada a projetos estrategicos de governo.",
  "dataInicioVigencia": "2026-04-01",
  "requisitosIniciais": [
    {
      "tipo": "QUALIFICACAO",
      "descricao": "Possuir titulacao minima exigida pela resolucao."
    }
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `sigla` | string | Sim | Sigla unica da modalidade (ex: `BPIG`) |
| `nome` | string | Sim | Nome completo da modalidade |
| `resolucaoId` | string | Sim | Identificador da resolucao que ampara a modalidade |
| `descricao` | string | Nao | Descricao detalhada da modalidade |
| `dataInicioVigencia` | string (date) | Sim | Data de inicio da vigencia da primeira versao |
| `requisitosIniciais` | array | Nao | Lista de requisitos da versao inicial |
| `requisitosIniciais[].tipo` | string (enum) | Sim | Um de: `QUALIFICACAO`, `VINCULO`, `RESIDENCIA`, `DOCUMENTACAO`, `VIGENCIA`, `PARENTESCO`, `ADIMPLENCIA` |
| `requisitosIniciais[].descricao` | string | Sim | Texto descritivo do requisito |

**Response `201 Created`**

```json
{
  "modalidade": {
    "id": "MOD-BPIG",
    "sigla": "BPIG",
    "nome": "Bolsa de Pesquisa e Inovacao em Governo"
  },
  "versaoModalidade": {
    "id": "VM-BPIG-2026-01",
    "sigla": "BPIG-2026",
    "estado": "EM_EDICAO",
    "dataInicioVigencia": "2026-04-01"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RESOLUCAO_NAO_ENCONTRADA` | A resolucao informada para a modalidade nao foi encontrada. |
| `409` | `MODALIDADE_SIGLA_DUPLICADA` | Ja existe uma modalidade cadastrada com a sigla informada. |
| `400` | `MODALIDADE_DADOS_INVALIDOS` | Os dados obrigatorios da modalidade nao foram informados corretamente. |

---

#### `GET /api/v1/m001/modalidades`

Lista modalidades com historico de versoes. (US-M001-006)

- **Autorizacao:** `ANALISTA_AGENCIA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `sigla` | string | Filtra por sigla exata ou parcial |
| `nome` | string | Filtra por nome (busca textual) |
| `estado` | string | Filtra pelo estado da versao atual: `EM_EDICAO`, `ATIVA`, `INATIVA` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "MOD-BPIG",
      "sigla": "BPIG",
      "nome": "Bolsa de Pesquisa e Inovacao em Governo",
      "versaoAtiva": {
        "id": "VM-BPIG-2026-02",
        "sigla": "BPIG-2026",
        "estado": "ATIVA",
        "dataInicioVigencia": "2026-07-01"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m001/modalidades/{sigla}/vigente`

Retorna a versao ativa de uma modalidade para uso operacional.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarModalidadeVigente`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `sigla` | string | Sigla da modalidade (ex: `BPIG`) |

**Response `200 OK`**

```json
{
  "versaoModalidade": {
    "id": "VM-BPIG-2026-02",
    "sigla": "BPIG-2026",
    "descricao": "Bolsa destinada a projetos estrategicos de governo.",
    "estado": "ATIVA",
    "dataInicioVigencia": "2026-07-01",
    "dataFimVigencia": null
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `MODALIDADE_NAO_ENCONTRADA` | A modalidade informada nao foi encontrada. |
| `422` | `MODALIDADE_SEM_VERSAO_ATIVA` | A modalidade informada ainda nao possui versao ativa. |

---

#### `POST /api/v1/m001/modalidades/{id}/desativar`

Desativa uma modalidade, impedindo novas associacoes. (US-M001-011)

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da modalidade (ex: `MOD-BPIG`) |

**Response `200 OK`**

```json
{
  "modalidade": {
    "id": "MOD-BPIG",
    "sigla": "BPIG",
    "versaoInativada": "VM-BPIG-2026-02"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `MODALIDADE_NAO_ENCONTRADA` | A modalidade informada nao foi encontrada. |
| `422` | `MODALIDADE_JA_INATIVA` | A modalidade ja esta inativa. |

---

### 3. Versoes de Modalidade

#### `POST /api/v1/m001/modalidades/{id}/versoes`

Abre uma nova versao de modalidade preservando historico. Copia niveis e requisitos da versao ativa.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CriarVersaoModalidade`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da modalidade |

**Request body**

```json
{
  "resolucaoId": "RES-332-2026",
  "dataInicioVigencia": "2026-07-01"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `resolucaoId` | string | Sim | Identificador da resolucao que ampara a nova versao |
| `dataInicioVigencia` | string (date) | Sim | Data de inicio de vigencia da nova versao |

**Response `201 Created`**

```json
{
  "versaoModalidade": {
    "id": "VM-BPIG-2026-02",
    "sigla": "BPIG-2026",
    "estado": "EM_EDICAO",
    "dataInicioVigencia": "2026-07-01",
    "copiadaDaVersaoId": "VM-BPIG-2026-01"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `MODALIDADE_NAO_ENCONTRADA` | A modalidade informada nao foi encontrada. |
| `404` | `RESOLUCAO_NAO_ENCONTRADA` | A resolucao informada nao foi encontrada. |
| `409` | `VERSAO_EM_EDICAO_EXISTENTE` | Ja existe uma versao em edicao para a modalidade informada. |
| `400` | `DATA_VIGENCIA_INVALIDA` | A data de inicio de vigencia da nova versao e invalida. |

---

#### `PUT /api/v1/m001/versoes/{versaoId}`

Edita os dados de uma versao de modalidade em estado `EM_EDICAO`. (US-M001-008)

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `versaoId` | string | Identificador da versao de modalidade |

**Request body**

```json
{
  "descricao": "Bolsa destinada a projetos estrategicos de governo e inovacao publica.",
  "dataInicioVigencia": "2026-08-01",
  "requisitos": [
    {
      "tipo": "QUALIFICACAO",
      "descricao": "Possuir titulacao minima exigida pela resolucao vigente."
    }
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `descricao` | string | Nao | Nova descricao da versao |
| `dataInicioVigencia` | string (date) | Nao | Nova data de inicio de vigencia |
| `requisitos` | array | Nao | Lista completa de requisitos (substitui a lista existente) |

**Response `200 OK`**

```json
{
  "versaoModalidade": {
    "id": "VM-BPIG-2026-02",
    "sigla": "BPIG-2026",
    "estado": "EM_EDICAO",
    "descricao": "Bolsa destinada a projetos estrategicos de governo e inovacao publica.",
    "dataInicioVigencia": "2026-08-01"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VERSAO_MODALIDADE_NAO_ENCONTRADA` | A versao de modalidade informada nao foi encontrada. |
| `422` | `VERSAO_MODALIDADE_NAO_EDITAVEL` | Somente versoes em edicao podem ser alteradas. |

---

#### `POST /api/v1/m001/versoes/{versaoId}/publicar`

Ativa uma versao em edicao e inativa a versao anterior.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `PublicarVersaoModalidade`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `versaoId` | string | Identificador da versao de modalidade |

**Sem corpo na requisicao.**

**Response `200 OK`**

```json
{
  "versaoModalidade": {
    "id": "VM-BPIG-2026-02",
    "estado": "ATIVA",
    "dataInicioVigencia": "2026-07-01"
  },
  "versaoAnteriorInativada": "VM-BPIG-2026-01"
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VERSAO_MODALIDADE_NAO_ENCONTRADA` | A versao de modalidade informada nao foi encontrada. |
| `422` | `VERSAO_MODALIDADE_ESTADO_INVALIDO` | Somente versoes em edicao podem ser publicadas. |
| `422` | `VERSAO_MODALIDADE_INCONSISTENTE` | A versao nao atende aos requisitos minimos para publicacao. |

---

#### `DELETE /api/v1/m001/versoes/{versaoId}`

Remove uma versao de modalidade em estado `EM_EDICAO`. (US-M001-010)

- **Autorizacao:** `ANALISTA_AGENCIA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `versaoId` | string | Identificador da versao de modalidade |

**Response `204 No Content`**

Sem corpo na resposta.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VERSAO_MODALIDADE_NAO_ENCONTRADA` | A versao de modalidade informada nao foi encontrada. |
| `422` | `VERSAO_MODALIDADE_NAO_REMOVIVEL` | Somente versoes em edicao podem ser removidas. |

---

### 4. Niveis da Versao

#### `POST /api/v1/m001/versoes/{versaoId}/niveis`

Registra um nivel de bolsa dentro de uma versao de modalidade em edicao.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarNivelDaVersao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `versaoId` | string | Identificador da versao de modalidade |

**Request body**

```json
{
  "siglaNivel": "BPIG-I",
  "valor": 5200.0,
  "moeda": "BRL",
  "requisitos": [
    {
      "tipo": "VINCULO",
      "descricao": "Nao possuir vinculo incompatavel com a bolsa."
    }
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `siglaNivel` | string | Sim | Sigla unica do nivel dentro da versao (ex: `BPIG-I`) |
| `valor` | number | Sim | Valor monetario da bolsa para o nivel |
| `moeda` | string | Sim | Sigla da moeda (ex: `BRL`) — deve estar cadastrada |
| `requisitos` | array | Nao | Requisitos especificos do nivel |
| `requisitos[].tipo` | string (enum) | Sim | Um de: `QUALIFICACAO`, `VINCULO`, `RESIDENCIA`, `DOCUMENTACAO`, `VIGENCIA`, `PARENTESCO`, `ADIMPLENCIA` |
| `requisitos[].descricao` | string | Sim | Texto descritivo do requisito |

**Response `201 Created`**

```json
{
  "versaoNivel": {
    "id": "VN-BPIG-I-2026-02",
    "siglaNivel": "BPIG-I",
    "valor": 5200.0,
    "moeda": "BRL"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VERSAO_MODALIDADE_NAO_ENCONTRADA` | A versao de modalidade informada nao foi encontrada. |
| `422` | `VERSAO_MODALIDADE_NAO_EDITAVEL` | A versao de modalidade informada nao esta em edicao. |
| `409` | `NIVEL_DUPLICADO_NA_VERSAO` | Ja existe um nivel com a sigla informada nesta versao. |
| `422` | `MOEDA_INVALIDA` | A moeda informada nao esta cadastrada ou nao pode ser usada. |

---

#### `GET /api/v1/m001/versoes/{versaoId}/niveis`

Lista os niveis, valores, moedas e requisitos de uma versao de modalidade.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ListarNiveisERequisitosDaVersao`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `versaoId` | string | Identificador da versao de modalidade |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `siglaNivel` | string | Filtra por sigla parcial ou exata do nivel |

**Response `200 OK`**

```json
{
  "versaoModalidadeId": "VM-BPIG-2026-02",
  "niveis": [
    {
      "id": "VN-BPIG-I-2026-02",
      "siglaNivel": "BPIG-I",
      "valor": 5200.0,
      "moeda": "BRL",
      "requisitos": [
        {
          "tipo": "VINCULO",
          "descricao": "Nao possuir vinculo incompatavel com a bolsa."
        }
      ]
    }
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VERSAO_MODALIDADE_NAO_ENCONTRADA` | A versao de modalidade informada nao foi encontrada. |
| `404` | `VERSAO_MODALIDADE_SEM_NIVEIS` | A versao de modalidade informada ainda nao possui niveis cadastrados. |

---

#### `PUT /api/v1/m001/versoes/{versaoId}/niveis/{siglaNivel}`

Atualiza valor, moeda e requisitos de um nivel dentro de uma versao em edicao. (US-M001-014)

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `versaoId` | string | Identificador da versao de modalidade |
| `siglaNivel` | string | Sigla do nivel (ex: `BPIG-I`) |

**Request body**

```json
{
  "valor": 5500.0,
  "moeda": "BRL",
  "requisitos": [
    {
      "tipo": "VINCULO",
      "descricao": "Nao possuir vinculo incompatavel com a bolsa."
    },
    {
      "tipo": "QUALIFICACAO",
      "descricao": "Possuir titulacao minima de mestrado."
    }
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `valor` | number | Nao | Novo valor monetario da bolsa |
| `moeda` | string | Nao | Nova sigla de moeda |
| `requisitos` | array | Nao | Lista completa de requisitos (substitui a lista existente) |

**Response `200 OK`**

```json
{
  "versaoNivel": {
    "id": "VN-BPIG-I-2026-02",
    "siglaNivel": "BPIG-I",
    "valor": 5500.0,
    "moeda": "BRL"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VERSAO_MODALIDADE_NAO_ENCONTRADA` | A versao de modalidade informada nao foi encontrada. |
| `404` | `NIVEL_NAO_ENCONTRADO` | O nivel informado nao foi encontrado nesta versao. |
| `422` | `VERSAO_MODALIDADE_NAO_EDITAVEL` | Somente niveis de versoes em edicao podem ser alterados. |
| `422` | `MOEDA_INVALIDA` | A moeda informada nao esta cadastrada ou nao pode ser usada. |

---

#### `DELETE /api/v1/m001/versoes/{versaoId}/niveis/{siglaNivel}`

Remove um nivel de uma versao de modalidade em edicao. (US-M001-015)

- **Autorizacao:** `ANALISTA_AGENCIA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `versaoId` | string | Identificador da versao de modalidade |
| `siglaNivel` | string | Sigla do nivel a remover |

**Response `204 No Content`**

Sem corpo na resposta.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VERSAO_MODALIDADE_NAO_ENCONTRADA` | A versao de modalidade informada nao foi encontrada. |
| `404` | `NIVEL_NAO_ENCONTRADO` | O nivel informado nao foi encontrado nesta versao. |
| `422` | `VERSAO_MODALIDADE_NAO_EDITAVEL` | Somente niveis de versoes em edicao podem ser removidos. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m001/resolucoes` | CriarResolucao | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m001/resolucoes` | ListarResolucoes | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m001/resolucoes/{id}` | ConsultarResolucao | ANALISTA_AGENCIA |
| `PUT` | `/api/v1/m001/resolucoes/{id}` | AtualizarResolucao | ANALISTA_AGENCIA |
| `DELETE` | `/api/v1/m001/resolucoes/{id}` | RemoverResolucao | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m001/modalidades` | CriarModalidade | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m001/modalidades` | ListarModalidades | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m001/modalidades/{sigla}/vigente` | ConsultarModalidadeVigente | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m001/modalidades/{id}/desativar` | DesativarModalidade | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m001/modalidades/{id}/versoes` | CriarVersaoModalidade | ANALISTA_AGENCIA |
| `PUT` | `/api/v1/m001/versoes/{versaoId}` | EditarVersaoModalidade | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m001/versoes/{versaoId}/publicar` | PublicarVersaoModalidade | ANALISTA_AGENCIA |
| `DELETE` | `/api/v1/m001/versoes/{versaoId}` | RemoverVersaoEmEdicao | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m001/versoes/{versaoId}/niveis` | RegistrarNivelDaVersao | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m001/versoes/{versaoId}/niveis` | ListarNiveisERequisitosDaVersao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/m001/versoes/{versaoId}/niveis/{siglaNivel}` | AtualizarNivelDaVersao | ANALISTA_AGENCIA |
| `DELETE` | `/api/v1/m001/versoes/{versaoId}/niveis/{siglaNivel}` | RemoverNivelDaVersao | ANALISTA_AGENCIA |

---

## Schemas de Dominio (Referencia)

### Resolucao

```json
{
  "id": "string",
  "numero": "integer",
  "data": "string (YYYY-MM-DD)",
  "ementa": "string",
  "url": "string (url, opcional)"
}
```

### ModalidadeBolsa

```json
{
  "id": "string",
  "sigla": "string",
  "nome": "string"
}
```

### VersaoModalidade

```json
{
  "id": "string",
  "sigla": "string",
  "descricao": "string (opcional)",
  "estado": "EM_EDICAO | ATIVA | INATIVA",
  "dataInicioVigencia": "string (YYYY-MM-DD)",
  "dataFimVigencia": "string (YYYY-MM-DD) | null"
}
```

### VersaoNivel

```json
{
  "id": "string",
  "siglaNivel": "string",
  "valor": "number",
  "moeda": "string"
}
```

### RequisitoBolsa

```json
{
  "tipo": "QUALIFICACAO | VINCULO | RESIDENCIA | DOCUMENTACAO | VIGENCIA | PARENTESCO | ADIMPLENCIA",
  "descricao": "string"
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
| EPIC-M001-001 (Resolucoes) | [epics/EPIC-M001-001.md](epics/EPIC-M001-001.md) |
| EPIC-M001-002 (Modalidades) | [epics/EPIC-M001-002.md](epics/EPIC-M001-002.md) |
| EPIC-M001-003 (Niveis) | [epics/EPIC-M001-003.md](epics/EPIC-M001-003.md) |
