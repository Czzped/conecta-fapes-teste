# Contrato de API HTTP — M019 Transparencia e Auditoria

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M019 como bounded context responsavel por transparencia publica, relatorios para a SECONT, exportacoes para auditoria e trilha imutavel de operacoes da plataforma. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m019
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Formato de data-hora | ISO 8601 — `YYYY-MM-DDTHH:MM:SSZ` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `PUB-2026-013`, `SEC-2026-004`, `AUD-2026-009`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Rotas publicas nao exigem autenticacao. Rotas internas exigem autenticacao e perfil adequado:

| Perfil | Descricao |
|--------|-----------|
| `PUBLICO` | Acesso irrestrito sem autenticacao — apenas portal de transparencia |
| `USUARIO_INTERNO` | Usuario interno autorizado — acesso a relatorios SECONT, exportacoes de auditoria e indicadores |
| `MODULO_INTERNO` | Modulo interno autorizado — registro de eventos de auditoria na trilha imutavel |
| `SISTEMA` | Sistema — executa job agendado de publicacao de transparencia |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "periodo": "2026-04"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Dados nao publicados ou relatorio nao encontrado |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Tentativa de alteracao retroativa, formato invalido, dados insuficientes |

---

## Recursos

### 1. Publicacao de Transparencia

#### `POST /api/v1/m019/transparencia/publicar`

Publica diariamente os dados anonimizados do portal de transparencia.

- **Autorizacao:** `SISTEMA`
- **Operacao de origem:** `AtualizarPublicacaoTransparencia`
- **Idempotencia:** Sim — por dataReferencia

**Request body**

```json
{
  "dataReferencia": "2026-04-13"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `dataReferencia` | string (date) | Sim | Data de referencia da publicacao |

**Response `200 OK`**

```json
{
  "publicacaoTransparencia": {
    "id": "PUB-2026-013",
    "dataReferencia": "2026-04-13",
    "registrosPublicados": 1240,
    "status": "CONCLUIDA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `ANONIMIZACAO_DADOS_INVALIDA` | Os dados nao passaram pela anonimizacao exigida antes da publicacao. |
| `422` | `PUBLICACAO_TRANSPARENCIA_FALHOU` | Nao foi possivel atualizar o portal de transparencia nesta execucao. |
| `400` | `DATA_REFERENCIA_INVALIDA` | A data de referencia informada para publicacao de transparencia e invalida. |

---

#### `GET /api/v1/m019/transparencia`

Consulta dados publicos anonimizados do portal de transparencia. Rota publica, sem autenticacao.

- **Autorizacao:** `PUBLICO` (sem autenticacao)
- **Operacao de origem:** `ConsultarPortalTransparenciaPublica`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `programaId` | string | Filtra por identificador do programa |
| `editalId` | string | Filtra por identificador do edital |
| `periodoInicio` | string (date) | Filtra publicacoes a partir desta data |
| `periodoFim` | string (date) | Filtra publicacoes ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "programa": "Programa de Dados Publicos",
      "edital": "Edital 01/2026",
      "totalIniciativas": 42,
      "valorExecutado": 120000.0,
      "dataPublicacao": "2026-04-13"
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
| `404` | `DADOS_TRANSPARENCIA_NAO_PUBLICADOS` | Os dados solicitados ainda nao foram publicados no portal de transparencia. |
| `400` | `FILTRO_TRANSPARENCIA_INVALIDO` | Os filtros informados para consulta publica sao invalidos. |

---

### 2. Relatorios SECONT

#### `POST /api/v1/m019/relatorios-secont`

Gera relatorio financeiro padronizado para a SECONT.

- **Autorizacao:** `USUARIO_INTERNO`
- **Operacao de origem:** `GerarRelatorioSECONT`
- **Idempotencia:** Nao

**Request body**

```json
{
  "periodoInicio": "2026-04-01",
  "periodoFim": "2026-04-30",
  "tipoRelatorio": "EXECUCAO_FINANCEIRA"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `periodoInicio` | string (date) | Sim | Inicio do periodo do relatorio |
| `periodoFim` | string (date) | Sim | Fim do periodo do relatorio |
| `tipoRelatorio` | string (enum) | Sim | Um de: `EXECUCAO_FINANCEIRA`, `PAGAMENTOS`, `EMPENHOS_LIQUIDACOES` |

**Response `201 Created`**

```json
{
  "relatorioSECONT": {
    "id": "SEC-2026-004",
    "tipoRelatorio": "EXECUCAO_FINANCEIRA",
    "periodoInicio": "2026-04-01",
    "periodoFim": "2026-04-30",
    "estado": "GERADO",
    "dataGeracao": "2026-04-14T09:00:00Z",
    "url": "/api/v1/m019/relatorios-secont/SEC-2026-004/download"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `DADOS_SECONT_INSUFICIENTES` | Nao ha dados suficientes para gerar o relatorio SECONT no formato padronizado. |
| `400` | `PERIODO_RELATORIO_INVALIDO` | O periodo informado para geracao do relatorio SECONT e invalido. |

---

#### `GET /api/v1/m019/relatorios-secont`

Lista relatorios SECONT gerados.

- **Autorizacao:** `USUARIO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipoRelatorio` | string | Filtra por tipo de relatorio |
| `dataInicio` | string (date) | Filtra relatorios gerados a partir desta data |
| `dataFim` | string (date) | Filtra relatorios gerados ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "SEC-2026-004",
      "tipoRelatorio": "EXECUCAO_FINANCEIRA",
      "periodoInicio": "2026-04-01",
      "periodoFim": "2026-04-30",
      "estado": "GERADO",
      "dataGeracao": "2026-04-14T09:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m019/relatorios-secont/{id}`

Consulta o detalhe de um relatorio SECONT.

- **Autorizacao:** `USUARIO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do relatorio (ex: `SEC-2026-004`) |

**Response `200 OK`**

```json
{
  "relatorioSECONT": {
    "id": "SEC-2026-004",
    "tipoRelatorio": "EXECUCAO_FINANCEIRA",
    "periodoInicio": "2026-04-01",
    "periodoFim": "2026-04-30",
    "estado": "GERADO",
    "dataGeracao": "2026-04-14T09:00:00Z",
    "url": "/api/v1/m019/relatorios-secont/SEC-2026-004/download"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RELATORIO_SECONT_NAO_ENCONTRADO` | O relatorio SECONT informado nao foi encontrado. |

---

### 3. Exportacoes para Auditoria

#### `POST /api/v1/m019/exportacoes-auditoria`

Exporta dados e trilha de auditoria com metadados de rastreabilidade.

- **Autorizacao:** `USUARIO_INTERNO`
- **Operacao de origem:** `ExportarDadosParaAuditoria`
- **Idempotencia:** Nao

**Request body**

```json
{
  "escopo": "FINANCEIRO",
  "formato": "CSV",
  "periodoInicio": "2026-04-01",
  "periodoFim": "2026-04-30"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `escopo` | string (enum) | Sim | Um de: `FINANCEIRO`, `BOLSAS`, `INICIATIVAS`, `COMPLETO` |
| `formato` | string (enum) | Sim | Um de: `CSV`, `JSON`, `XLSX` |
| `periodoInicio` | string (date) | Sim | Inicio do periodo a exportar |
| `periodoFim` | string (date) | Sim | Fim do periodo a exportar |

**Response `201 Created`**

```json
{
  "exportacaoAuditoria": {
    "id": "AUD-2026-009",
    "escopo": "FINANCEIRO",
    "formato": "CSV",
    "periodoInicio": "2026-04-01",
    "periodoFim": "2026-04-30",
    "dataGeracao": "2026-04-14T11:00:00Z",
    "url": "/api/v1/m019/exportacoes-auditoria/AUD-2026-009/download"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `FORMATO_EXPORTACAO_AUDITORIA_INVALIDO` | O formato solicitado nao e suportado para exportacao de auditoria. |
| `422` | `EXPORTACAO_AUDITORIA_INDISPONIVEL` | Nao foi possivel gerar a exportacao de auditoria neste momento. |
| `400` | `EXPORTACAO_DADOS_INVALIDOS` | Os dados informados para exportacao de auditoria sao invalidos. |

---

#### `GET /api/v1/m019/exportacoes-auditoria`

Lista exportacoes de auditoria geradas.

- **Autorizacao:** `USUARIO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `escopo` | string | Filtra por escopo da exportacao |
| `formato` | string | Filtra por formato: `CSV`, `JSON`, `XLSX` |
| `dataInicio` | string (date) | Filtra exportacoes geradas a partir desta data |
| `dataFim` | string (date) | Filtra exportacoes geradas ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "AUD-2026-009",
      "escopo": "FINANCEIRO",
      "formato": "CSV",
      "dataGeracao": "2026-04-14T11:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

### 4. Trilha de Auditoria

#### `POST /api/v1/m019/trilha-auditoria`

Registra evento de criacao, alteracao ou exclusao vindo de outro modulo na trilha imutavel.

- **Autorizacao:** `MODULO_INTERNO`
- **Operacao de origem:** `RegistrarEventoDeAuditoria`
- **Idempotencia:** Sim — por chave unica do evento

**Request body**

```json
{
  "moduloOrigem": "M014",
  "operacao": "ALTERACAO",
  "usuario": "analista@agencia.br",
  "contexto": "Prestacao de contas PC-2026-013",
  "chaveEvento": "M014-PC-2026-013-ALTERACAO-20260414T103000Z"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `moduloOrigem` | string | Sim | Identificador do modulo que originou o evento (ex: `M014`) |
| `operacao` | string (enum) | Sim | Um de: `CRIACAO`, `ALTERACAO`, `EXCLUSAO` |
| `usuario` | string | Sim | Email ou identificador do usuario que executou a operacao |
| `contexto` | string | Sim | Descricao do contexto da operacao com identificadores rastreados |
| `chaveEvento` | string | Nao | Chave unica para deduplicacao do evento |

**Response `201 Created`**

```json
{
  "registroAuditoria": {
    "id": "AUDREG-2026-220",
    "moduloOrigem": "M014",
    "operacao": "ALTERACAO",
    "usuario": "analista@agencia.br",
    "contexto": "Prestacao de contas PC-2026-013",
    "dataRegistro": "2026-04-14T10:30:00Z"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `EVENTO_AUDITORIA_INCONSISTENTE` | O evento recebido nao possui metadados minimos de rastreabilidade. |
| `422` | `TRILHA_AUDITORIA_IMUTAVEL` | Nao e permitido alterar ou sobrescrever registros da trilha de auditoria. |

---

#### `GET /api/v1/m019/trilha-auditoria`

Consulta registros da trilha de auditoria com filtros de periodo, modulo e operacao.

- **Autorizacao:** `USUARIO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `moduloOrigem` | string | Filtra por modulo de origem (ex: `M014`) |
| `operacao` | string | Filtra por tipo de operacao: `CRIACAO`, `ALTERACAO`, `EXCLUSAO` |
| `usuario` | string | Filtra por usuario que executou a operacao |
| `periodoInicio` | string (date) | Filtra registros a partir desta data |
| `periodoFim` | string (date) | Filtra registros ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "AUDREG-2026-220",
      "moduloOrigem": "M014",
      "operacao": "ALTERACAO",
      "usuario": "analista@agencia.br",
      "contexto": "Prestacao de contas PC-2026-013",
      "dataRegistro": "2026-04-14T10:30:00Z"
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
| `400` | `FILTRO_TRILHA_AUDITORIA_INVALIDO` | Os filtros informados para consulta da trilha de auditoria sao invalidos. |

---

### 5. Indicadores de Transparencia

#### `GET /api/v1/m019/indicadores`

Consulta indicadores de volume e atualizacao do portal de transparencia.

- **Autorizacao:** `USUARIO_INTERNO`
- **Operacao de origem:** `ConsultarIndicadoresTransparencia`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `periodoInicio` | string (date) | Inicio do periodo de calculo dos indicadores |
| `periodoFim` | string (date) | Fim do periodo de calculo dos indicadores |

**Response `200 OK`**

```json
{
  "indicadoresTransparencia": {
    "periodoInicio": "2026-01-01",
    "periodoFim": "2026-04-30",
    "volumePublicacoes": 4,
    "registrosTotaisPublicados": 4820,
    "frequenciaAtualizacaoDias": 1,
    "ultimaPublicacao": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `INDICADOR_TRANSPARENCIA_INDISPONIVEL` | Nao foi possivel calcular os indicadores de transparencia para o periodo informado. |
| `400` | `PERIODO_INDICADOR_INVALIDO` | O periodo informado para os indicadores de transparencia e invalido. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m019/transparencia/publicar` | AtualizarPublicacaoTransparencia | SISTEMA |
| `GET` | `/api/v1/m019/transparencia` | ConsultarPortalTransparenciaPublica | PUBLICO |
| `POST` | `/api/v1/m019/relatorios-secont` | GerarRelatorioSECONT | USUARIO_INTERNO |
| `GET` | `/api/v1/m019/relatorios-secont` | ListarRelatoriosSECONT | USUARIO_INTERNO |
| `GET` | `/api/v1/m019/relatorios-secont/{id}` | ConsultarRelatorioSECONT | USUARIO_INTERNO |
| `POST` | `/api/v1/m019/exportacoes-auditoria` | ExportarDadosParaAuditoria | USUARIO_INTERNO |
| `GET` | `/api/v1/m019/exportacoes-auditoria` | ListarExportacoesAuditoria | USUARIO_INTERNO |
| `POST` | `/api/v1/m019/trilha-auditoria` | RegistrarEventoDeAuditoria | MODULO_INTERNO |
| `GET` | `/api/v1/m019/trilha-auditoria` | ConsultarTrilhaAuditoria | USUARIO_INTERNO |
| `GET` | `/api/v1/m019/indicadores` | ConsultarIndicadoresTransparencia | USUARIO_INTERNO |

---

## Schemas de Dominio (Referencia)

### PublicacaoTransparencia

```json
{
  "id": "string",
  "dataReferencia": "string (YYYY-MM-DD)",
  "registrosPublicados": "integer",
  "status": "CONCLUIDA | FALHA"
}
```

### RelatorioSECONT

```json
{
  "id": "string",
  "tipoRelatorio": "EXECUCAO_FINANCEIRA | PAGAMENTOS | EMPENHOS_LIQUIDACOES",
  "periodoInicio": "string (YYYY-MM-DD)",
  "periodoFim": "string (YYYY-MM-DD)",
  "estado": "GERADO | FALHA",
  "dataGeracao": "string (ISO 8601)",
  "url": "string"
}
```

### ExportacaoAuditoria

```json
{
  "id": "string",
  "escopo": "FINANCEIRO | BOLSAS | INICIATIVAS | COMPLETO",
  "formato": "CSV | JSON | XLSX",
  "periodoInicio": "string (YYYY-MM-DD)",
  "periodoFim": "string (YYYY-MM-DD)",
  "dataGeracao": "string (ISO 8601)",
  "url": "string"
}
```

### RegistroAuditoria

```json
{
  "id": "string",
  "moduloOrigem": "string",
  "operacao": "CRIACAO | ALTERACAO | EXCLUSAO",
  "usuario": "string",
  "contexto": "string",
  "dataRegistro": "string (ISO 8601)"
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
| EPIC-M019-001 (Portal de Transparencia) | [epics/EPIC-M019-001.md](epics/EPIC-M019-001.md) |
| EPIC-M019-002 (Relatorios e Auditoria) | [epics/EPIC-M019-002.md](epics/EPIC-M019-002.md) |
