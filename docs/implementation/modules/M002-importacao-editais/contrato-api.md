# Contrato de API HTTP — M002 Importacao de Editais

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M002 como bounded context responsavel pela selecao, importacao, sincronizacao e conciliacao de dados legados do SigFapes. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m002
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Formato de data-hora | ISO 8601 — `YYYY-MM-DDTHH:mm:ssZ` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `IMP-2026-001`, `SIN-2026-003`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `GERENTE_AREA_TECNICA` | Gerente da Area Tecnica — acesso completo as operacoes de selecao, consulta e reprocessamento |
| `SISTEMA` | Job ou processo interno autorizado — acesso restrito a execucao de importacao e sincronizacao |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

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

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido, filtros invalidos |
| `404 Not Found` | Recurso inexistente | Edital, execucao ou vinculo nao encontrado |
| `409 Conflict` | Conflito de estado | Selecao ja ativa para o edital informado |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido para a operacao, reprocessamento nao permitido |
| `502 Bad Gateway` | Falha na integracao externa | SigFapes indisponivel |

---

## Recursos

### 1. Editais do SigFapes

#### `GET /api/v1/m002/sigfapes/editais`

Lista os editais disponiveis no SigFapes para selecao de importacao.

- **Autorizacao:** `GERENTE_AREA_TECNICA`
- **Operacao de origem:** `ListarEditaisDisponiveisNoSigFapes`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `ano` | integer | Filtra editais pelo ano |
| `termoBusca` | string | Busca textual no titulo do edital |
| `somenteDisponiveis` | boolean | Quando `true`, retorna apenas editais no status `A_IMPORTAR` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

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
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `FILTRO_IMPORTACAO_INVALIDO` | Os filtros informados para consulta de editais do SigFapes sao invalidos. |
| `502` | `SIGFAPES_INDISPONIVEL` | Nao foi possivel consultar os editais disponiveis no SigFapes neste momento. |

---

### 2. Selecoes de Importacao

#### `POST /api/v1/m002/selecoes`

Registra quais editais entrarao no fluxo tecnico de importacao e qual area tecnica os acompanhara.

- **Autorizacao:** `GERENTE_AREA_TECNICA`
- **Operacao de origem:** `SelecionarEditaisParaImportacao`
- **Idempotencia:** Sim — reaproveia a selecao ativa existente quando nao houver mudanca de intencao

**Request body**

```json
{
  "editaisSigFapes": [1045, 1048],
  "areaTecnicaId": "AT-DGPP-01"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `editaisSigFapes` | array (integer) | Sim | Lista de identificadores SigFapes dos editais a selecionar |
| `areaTecnicaId` | string | Sim | Identificador da area tecnica responsavel pela importacao |

**Response `201 Created`**

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

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `AREA_TECNICA_OBRIGATORIA` | E obrigatorio informar a area tecnica responsavel pela importacao. |
| `422` | `EDITAL_SIGFAPES_INDISPONIVEL` | Um dos editais selecionados nao esta disponivel para importacao. |

---

#### `GET /api/v1/m002/selecoes`

Lista as selecoes de importacao ativas.

- **Autorizacao:** `GERENTE_AREA_TECNICA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `areaTecnicaId` | string | Filtra por area tecnica responsavel |
| `ativa` | boolean | Filtra por status de selecao (padrao: `true`) |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "idSigFapes": 1045,
      "dataSelecao": "2026-04-13",
      "ativa": true,
      "areaTecnicaId": "AT-DGPP-01"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

### 3. Execucoes de Importacao e Sincronizacao

#### `POST /api/v1/m002/execucoes`

Inicia uma execucao de importacao ou sincronizacao de editais selecionados. Operacao assincrona — retorna imediatamente com a execucao em estado `PENDENTE`.

- **Autorizacao:** `GERENTE_AREA_TECNICA`, `SISTEMA`
- **Operacao de origem:** `ExecutarImportacaoDeEditaisSelecionados` (tipoExecucao=IMPORTACAO) | `ExecutarSincronizacaoDoSigFapes` (tipoExecucao=SINCRONIZACAO)
- **Idempotencia:** Sim por vinculo tecnico (nao cria duplicidade de vinculos tecnicos)

**Request body**

```json
{
  "tipoExecucao": "IMPORTACAO",
  "idsSigFapes": [1045, 1048]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `tipoExecucao` | string (enum) | Sim | Um de: `IMPORTACAO`, `SINCRONIZACAO` |
| `idsSigFapes` | array (integer) | Nao | Identificadores SigFapes alvo; omitir para executar sobre todos os selecionados/importados |

**Response `201 Created`**

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

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `NENHUMA_SELECAO_ATIVA` | Nao existem editais selecionados para iniciar a importacao. |
| `422` | `NENHUM_EDITAL_IMPORTADO` | Nao existe edital importado elegivel para sincronizacao. |
| `502` | `SIGFAPES_INDISPONIVEL` | O Web Service do SigFapes esta indisponivel para iniciar a execucao. |

---

#### `GET /api/v1/m002/execucoes`

Lista execucoes de importacao e sincronizacao.

- **Autorizacao:** `GERENTE_AREA_TECNICA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipo` | string | Filtra por tipo: `IMPORTACAO` ou `SINCRONIZACAO` |
| `status` | string | Filtra por status: `PENDENTE`, `EM_ANDAMENTO`, `CONCLUIDA`, `CONCLUIDA_COM_OCORRENCIAS`, `FALHOU` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "IMP-2026-001",
      "tipo": "IMPORTACAO",
      "status": "CONCLUIDA_COM_OCORRENCIAS",
      "totalRegistrosProcessados": 60,
      "totalOcorrencias": 3,
      "dataInicio": "2026-04-13T14:00:00Z",
      "dataFim": "2026-04-13T14:20:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m002/execucoes/{codigo}`

Consulta o detalhe de uma execucao especifica.

- **Autorizacao:** `GERENTE_AREA_TECNICA`
- **Operacao de origem:** `ConsultarResumoDoEditalImportado` (parcialmente)

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da execucao (ex: `IMP-2026-001`) |

**Response `200 OK`**

```json
{
  "execucao": {
    "codigo": "IMP-2026-001",
    "tipo": "IMPORTACAO",
    "status": "CONCLUIDA_COM_OCORRENCIAS",
    "totalRegistrosProcessados": 60,
    "totalOcorrencias": 3,
    "dataInicio": "2026-04-13T14:00:00Z",
    "dataFim": "2026-04-13T14:20:00Z"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EXECUCAO_IMPORTACAO_NAO_ENCONTRADA` | A execucao informada nao foi encontrada. |

---

#### `POST /api/v1/m002/execucoes/{codigo}/reprocessar`

Solicita novo processamento de uma execucao com falha ou com ocorrencias, a partir dos vinculos tecnicos existentes.

- **Autorizacao:** `GERENTE_AREA_TECNICA`
- **Operacao de origem:** `ReprocessarExecucaoImportacao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da execucao a reprocessar |

**Request body**

```json
{
  "escopo": {
    "entidades": ["ProjetoSigFapes", "AlocacaoSigFapes"]
  }
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `escopo.entidades` | array (string) | Nao | Entidades alvo do reprocessamento; omitir para reprocessar todas |

**Response `201 Created`**

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

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EXECUCAO_IMPORTACAO_NAO_ENCONTRADA` | A execucao informada para reprocessamento nao foi encontrada. |
| `400` | `ESCOPO_REPROCESSAMENTO_INVALIDO` | O escopo informado para reprocessamento e invalido. |
| `422` | `REPROCESSAMENTO_NAO_PERMITIDO` | A execucao informada nao pode ser reprocessada no estado atual. |

---

### 4. Ocorrencias de Sincronizacao

#### `GET /api/v1/m002/execucoes/{codigo}/ocorrencias`

Visualiza o relatorio tecnico e ocorrencias de uma execucao de importacao ou sincronizacao.

- **Autorizacao:** `GERENTE_AREA_TECNICA`
- **Operacao de origem:** `ConsultarOcorrenciasDeSincronizacao`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da execucao |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `nivel` | string | Filtra por nivel: `INFO`, `AVISO`, `ERRO` |
| `entidadeOrigem` | string | Filtra por entidade de origem (ex: `ProjetoSigFapes`) |
| `resolvida` | boolean | Filtra por status de resolucao |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

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
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EXECUCAO_IMPORTACAO_NAO_ENCONTRADA` | A execucao informada nao foi encontrada para consulta de ocorrencias. |
| `400` | `FILTRO_OCORRENCIA_INVALIDO` | Os filtros informados para ocorrencias de sincronizacao sao invalidos. |

---

### 5. Editais Importados

#### `GET /api/v1/m002/editais-importados/{idSigFapes}`

Consulta o estado atual de um edital importado e seu contexto tecnico de sincronizacao.

- **Autorizacao:** `GERENTE_AREA_TECNICA`
- **Operacao de origem:** `ConsultarResumoDoEditalImportado`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `idSigFapes` | integer | Identificador do edital no SigFapes |

**Response `200 OK`**

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

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_IMPORTADO_NAO_ENCONTRADO` | O edital importado informado nao foi encontrado. |

---

### 6. Vinculos Tecnicos do Legado

#### `GET /api/v1/m002/vinculos`

Inspeciona o estado dos vinculos entre registros do SigFapes e entidades canonicas do ConectaFAPES.

- **Autorizacao:** `GERENTE_AREA_TECNICA`
- **Operacao de origem:** `ConsultarVinculosTecnicosDoLegado`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `entidade` | string | Filtra por tipo de entidade: `EditalSigFapes`, `ProjetoSigFapes`, `AlocacaoSigFapes`, `PessoaSigFapes` |
| `idSigFapes` | integer | Filtra pelo identificador de origem no SigFapes |
| `statusVinculo` | string | Filtra por status: `A_IMPORTAR`, `VINCULADO`, `DESATUALIZADO`, `ORFAO` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

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
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VINCULO_LEGADO_NAO_ENCONTRADO` | Nenhum vinculo tecnico foi encontrado para o filtro informado. |
| `400` | `FILTRO_VINCULO_INVALIDO` | Os filtros informados para consulta de vinculos tecnicos sao invalidos. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `GET` | `/api/v1/m002/sigfapes/editais` | ListarEditaisDisponiveisNoSigFapes | GERENTE_AREA_TECNICA |
| `POST` | `/api/v1/m002/selecoes` | SelecionarEditaisParaImportacao | GERENTE_AREA_TECNICA |
| `GET` | `/api/v1/m002/selecoes` | ListarSelecoes | GERENTE_AREA_TECNICA |
| `POST` | `/api/v1/m002/execucoes` | ExecutarImportacaoOuSincronizacao | GERENTE_AREA_TECNICA, SISTEMA |
| `GET` | `/api/v1/m002/execucoes` | ListarExecucoes | GERENTE_AREA_TECNICA |
| `GET` | `/api/v1/m002/execucoes/{codigo}` | ConsultarExecucao | GERENTE_AREA_TECNICA |
| `POST` | `/api/v1/m002/execucoes/{codigo}/reprocessar` | ReprocessarExecucaoImportacao | GERENTE_AREA_TECNICA |
| `GET` | `/api/v1/m002/execucoes/{codigo}/ocorrencias` | ConsultarOcorrenciasDeSincronizacao | GERENTE_AREA_TECNICA |
| `GET` | `/api/v1/m002/editais-importados/{idSigFapes}` | ConsultarResumoDoEditalImportado | GERENTE_AREA_TECNICA |
| `GET` | `/api/v1/m002/vinculos` | ConsultarVinculosTecnicosDoLegado | GERENTE_AREA_TECNICA |

---

## Schemas de Dominio (Referencia)

### SelecaoImportacaoEdital

```json
{
  "idSigFapes": "integer",
  "dataSelecao": "string (YYYY-MM-DD)",
  "ativa": "boolean",
  "areaTecnicaId": "string"
}
```

### ExecucaoImportacao

```json
{
  "codigo": "string",
  "tipo": "IMPORTACAO | SINCRONIZACAO",
  "status": "PENDENTE | EM_ANDAMENTO | CONCLUIDA | CONCLUIDA_COM_OCORRENCIAS | FALHOU",
  "totalRegistrosProcessados": "integer",
  "totalOcorrencias": "integer",
  "dataInicio": "string (ISO 8601)",
  "dataFim": "string (ISO 8601) | null"
}
```

### OcorrenciaSincronizacao

```json
{
  "dataOcorrencia": "string (ISO 8601)",
  "nivel": "INFO | AVISO | ERRO",
  "entidadeOrigem": "string",
  "identificadorOrigem": "string",
  "mensagem": "string",
  "resolvida": "boolean"
}
```

### VinculoTecnico

```json
{
  "entidade": "EditalSigFapes | ProjetoSigFapes | AlocacaoSigFapes | PessoaSigFapes",
  "idSigFapes": "integer",
  "statusVinculo": "A_IMPORTAR | VINCULADO | DESATUALIZADO | ORFAO",
  "ultimaSincronizacao": "string (ISO 8601) | null",
  "entidadeCanonicaId": "string | null"
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
| EPIC-M002-001 (Definir Editais a Sincronizar) | [epics/EPIC-M002-001.md](epics/EPIC-M002-001.md) |
| EPIC-M002-002 (Completar Dados de Alocacoes) | [epics/EPIC-M002-002.md](epics/EPIC-M002-002.md) |
| EPIC-M002-003 (Sincronizar Dados de Editais) | [epics/EPIC-M002-003.md](epics/EPIC-M002-003.md) |
