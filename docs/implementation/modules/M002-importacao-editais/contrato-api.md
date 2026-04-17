# Contrato de API HTTP — M002 Importacao de Editais

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M002 conforme implementado no backend FastAPI do Importador SIGFAPES. Todas as rotas listadas existem no codigo e sao expostas por um unico servico web Python/Uvicorn, deployado na Render.

### Base URL

A API nao utiliza prefixo de versao; as rotas sao expostas na raiz do servico.

```
https://{host}/
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm:ssZ`) |
| Competencia / mes-ano | `MM_YYYY` (ex: `02_2026`) em chaves S3 e `resource_key` |
| Arquivos binarios | `data_url` base64 (`data:application/...;base64,<payload>`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autenticacao

- Token JWT Bearer obrigatorio em todas as rotas, exceto `/auth/login`, `/status`, `/health` e endpoints internos explicitos.
- Aceita `Authorization: Bearer <token>` OU cookie HttpOnly `sb-access-token`.
- Tokens sao emitidos pelo Supabase Auth e validados via `PyJWT` com a chave publica do projeto.

| Perfil logico | Descricao |
|--------------|-----------|
| `OPERADOR` | Operador do Importador (equipe tecnica) — acesso completo as operacoes de correcao |
| `SISTEMA` | Role de servico (`service_role`) — jobs e consultas internas privilegiadas |

### Envelope de Erro

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "resource_key": "02_2026/editais/7777"
    }
  }
}
```

### Mapeamento de HTTP Status

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, `is_programa` fora do conjunto permitido |
| `401 Unauthorized` | Autenticacao | JWT ausente ou invalido |
| `403 Forbidden` | Lock invalido ou chamador nao autorizado para o recurso |
| `404 Not Found` | Recurso inexistente em S3 ou Supabase |
| `409 Conflict` | Conflito de estado (lock de outro usuario, versao otimista, planilha ja criada, tipo conflitante) |
| `502 Bad Gateway` | Falha em dependencia externa (S3, Supabase, Airflow) |

**Observacao importante:** `POST /validate-upload-planilha` nao retorna 4xx por regra violada. Mesmo com erros de layout ou lógica, a resposta e `200 OK` com `ok=false` e `errors[]` preenchido, para permitir a UI apresentar a sidebar de erros sem tratamento de excecao.

---

## Recursos

### 1. Autenticacao

#### `POST /auth/login`

Autentica operador junto ao Supabase Auth.

- **Autorizacao:** publica

**Request body**

```json
{ "email": "operador@agencia.gov.br", "password": "••••••••" }
```

**Response `200 OK`**

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "v1.M2J...",
  "expires_in": 3600,
  "user": { "id": "u_abc123", "email": "operador@agencia.gov.br" }
}
```

Cookies definidos na resposta: `sb-access-token` (HttpOnly) e `sb-refresh-token` (HttpOnly).

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `DADOS_INVALIDOS` | E obrigatorio informar email e senha validos. |
| `401` | `CREDENCIAIS_INVALIDAS` | Email ou senha incorretos. |
| `502` | `SUPABASE_INDISPONIVEL` | Provedor de autenticacao indisponivel. |

---

### 2. Editais

#### `GET /editais-latest`

Lista os editais do dump mais recente do SigFapes, anotando cada item com status de importacao e contagem de bolsistas.

- **Autorizacao:** `OPERADOR`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `include_importados` | boolean | Quando `true`, inclui editais ja importados (padrao: `false`) |

**Response `200 OK`**

```json
{
  "data": [
    {
      "edital_id": "7777",
      "edital_nome": "Edital Pesquisa Aplicada 2026",
      "edital_data_cadastro": "2026-03-10",
      "qtd_bolsistas": 148,
      "ja_importado": false,
      "novo_este_mes": true
    }
  ],
  "bolsistas_count_degraded": false
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `DUMP_NAO_ENCONTRADO` | Nenhum dump completo do SigFapes foi encontrado. |
| `502` | `S3_INDISPONIVEL` | Nao foi possivel acessar o bucket S3 neste momento. |

---

#### `GET /editais-grafico-metricas`

Retorna metricas agregadas exibidas na aba Graficos do Importador.

- **Autorizacao:** `OPERADOR`

**Response `200 OK`**

```json
{
  "allocation_importacao": {
    "total_fapes_rows": 2580,
    "imported_rows": 1984,
    "not_imported_rows": 596
  },
  "allocation_auditoria": {
    "matched_rows": 1980,
    "unmatched_rows": 4
  },
  "allocation_importacao_ativos_por_edital": [
    { "edital_id": "7777", "ativos": 84 }
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `500` | `S3_BUCKET_NAO_CONFIGURADO` | A variavel S3_BUCKET nao esta definida. |
| `502` | `S3_INDISPONIVEL` | Nao foi possivel acessar o bucket S3 neste momento. |

---

### 3. Planilhas

#### `GET /recurso-kind`

Descobre se o recurso esta classificado como `editais` ou `programas`.

- **Autorizacao:** `OPERADOR`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `edital_id` | string | Identificador do edital |

**Response `200 OK`**

```json
{
  "kind": "editais",
  "is_programa": "NAO",
  "resource_key": "02_2026/editais/7777",
  "historico_count": 5
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `HISTORICO_INEXISTENTE` | Nao ha historico para o edital no mes corrente. |
| `409` | `TIPO_CONFLITANTE` | O recurso possui historico em `editais` e `programas` simultaneamente. |

---

#### `POST /cria-planilha-edital`

Gera a planilha base (versao 0) do edital a partir dos dumps SigFapes. Pode executar sincronicamente ou enfileirar como job assincrono.

- **Autorizacao:** `OPERADOR`
- **Operacao de origem:** `CriarPlanilhaInicialDoEdital`
- **Idempotencia:** Nao (409 quando ja existe planilha inicial)

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `async` | boolean | Quando `true`, enfileira a geracao e retorna `job_id` |

**Request body**

```json
{ "edital_id": "7777", "is_programa": "NAO" }
```

**Response `201 Created` (sincrono)**

```json
{
  "ok": true,
  "bucket": "conecta-fapes-importador",
  "key": "editais_corrigidos/02_2026/editais/7777/historicoCorrecoesPlanilhas/0_17_04_2026.xlsx"
}
```

**Response `202 Accepted` (async)**

```json
{ "ok": true, "queued": true, "job_id": "job_abc123", "status": "pending" }
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `DADOS_DO_DUMP_AUSENTES` | Nao foram encontrados dados do edital no dump mais recente. |
| `409` | `PLANILHA_INICIAL_JA_EXISTE` | Ja existe uma planilha inicial para este recurso. |
| `502` | `S3_INDISPONIVEL` | Nao foi possivel acessar o bucket S3. |

---

#### `GET /planilha-selecionada`

Retorna a versao mais recente da planilha corrigida em base64.

- **Autorizacao:** `OPERADOR`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `edital_id` | string | Identificador do edital |

**Response `200 OK`**

```json
{
  "base64": "UEsDBB...",
  "filename": "4_17_04_2026.xlsx",
  "version": 4,
  "kind": "editais",
  "last_action": "upload_corrigida",
  "last_action_at": "2026-04-17T17:12:34Z",
  "last_actor_email": "operador@agencia.gov.br"
}
```

---

#### `GET /planilhas-mes-passado`

Lista versoes corrigidas do mes anterior disponiveis para consulta.

- **Autorizacao:** `OPERADOR`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `edital_id` | string | Identificador do edital |

**Response `200 OK`**

```json
{
  "ok": true,
  "edital_id": "7777",
  "month_year": "01_2026",
  "items": [
    {
      "kind": "editais",
      "filename": "3_28_01_2026.xlsx",
      "version": 3,
      "size_bytes": 84321,
      "last_modified": "2026-01-28T19:02:11Z",
      "action": "upload_corrigida",
      "actor_email": "operador@agencia.gov.br"
    }
  ]
}
```

---

#### `GET /planilhas-mes-passado/download`

Download direto de uma planilha do mes anterior.

- **Autorizacao:** `OPERADOR`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `edital_id` | string | Identificador do edital |
| `kind` | string | `editais` ou `programas` |
| `filename` | string | Nome do arquivo XLSX conforme retornado por `/planilhas-mes-passado` |

**Response `200 OK`** — corpo binario `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

---

#### `POST /recurso-kind/switch`

Troca o tipo ativo do recurso entre `editais` e `programas`, clonando a ultima versao para o novo kind e reemitindo o lock.

- **Autorizacao:** `OPERADOR` com lock valido

**Request body**

```json
{
  "edital_id": "7777",
  "target_kind": "programas",
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa",
  "confirm": true
}
```

**Response `200 OK`**

```json
{
  "ok": true,
  "from_kind": "editais",
  "to_kind": "programas",
  "cloned_from_key": ".../editais/7777/historicoCorrecoesPlanilhas/4_17_04_2026.xlsx",
  "cloned_to_key": ".../programas/7777/historicoCorrecoesPlanilhas/0_17_04_2026.xlsx",
  "lock": {
    "resource_key": "02_2026/programas/7777",
    "lock_token": "d4e5f6a7-b8c9-4d01-8e2f-1234567890ab",
    "expires_at": "2026-04-17T18:45:00Z"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `403` | `LOCK_INVALIDO` | Lock invalido ou expirado. |
| `409` | `TIPO_CONFLITANTE` | Ja existe historico no tipo de destino. |

---

#### `GET /bolsista-dump-json`

Inspeciona o registro bruto de um bolsista no dump SigFapes.

- **Autorizacao:** `OPERADOR`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `edital_id` | string | Identificador do edital |
| `formulario_bolsa_id` | string | Identificador do bolsista no SigFapes |

**Response `200 OK`**

```json
{
  "records": [ { "cpf": "...", "bolsa_nivel": 1, "bolsa_valor": 1500.0 } ],
  "dump_prefix": "dados_input/dump_sigfapes/17_04_2026/",
  "source_key": "dados_input/dump_sigfapes/17_04_2026/bolsistas_projeto.parquet"
}
```

---

### 4. Locks

#### `POST /locks/acquire`

Adquire lock exclusivo sobre `{month_year}/{kind}/{edital_id}`.

- **Autorizacao:** `OPERADOR`

**Request body**

```json
{ "edital_id": "7777", "kind": "editais" }
```

**Response `200 OK`**

```json
{
  "ok": true,
  "resource_key": "02_2026/editais/7777",
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa",
  "expires_at": "2026-04-17T18:40:00Z",
  "heartbeat_at": "2026-04-17T17:40:00Z",
  "owner_user_id": "u_abc123",
  "owner_email": "operador@agencia.gov.br"
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `RECURSO_EM_USO` | Recurso em uso por outro operador. |

---

#### `POST /locks/heartbeat`

Renova lock valido estendendo `expires_at`.

- **Autorizacao:** `OPERADOR`
- **Intervalo recomendado:** 45 segundos

**Request body**

```json
{ "resource_key": "02_2026/editais/7777", "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa" }
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `403` | `LOCK_INVALIDO` | Token invalido ou lock ja expirado. |

---

#### `POST /locks/release`

Encerra lock voluntariamente.

- **Autorizacao:** `OPERADOR`

**Request body**

```json
{
  "resource_key": "02_2026/editais/7777",
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa",
  "reason": "manual"
}
```

`reason` aceita: `manual`, `completed`, `abandon`.

---

#### `GET /locks/me`

Lista os locks ativos pertencentes ao chamador.

---

#### `POST /locks/batch-status`

Retorna status de lock de varios editais em uma unica chamada. Usado pela listagem de editais para indicar quem esta editando o que.

**Request body**

```json
{ "edital_ids": ["7777", "7778"], "month_year": "02_2026" }
```

**Response `200 OK`**

```json
{
  "ok": true,
  "month_year": "02_2026",
  "locks": {
    "7777": { "locked": true, "locked_by": "operador@agencia.gov.br", "expires_at": "2026-04-17T18:40:00Z" },
    "7778": { "locked": false }
  }
}
```

---

#### `GET /locks/status`

Status de um unico recurso por `resource_key` ou `(edital_id, kind)`.

---

### 5. Upload de Planilha

#### `POST /validate-upload-planilha`

Valida uma planilha candidata e retorna erros, warnings e diff contra a versao atual. Nunca retorna 4xx por regra violada.

- **Autorizacao:** `OPERADOR`

**Request body**

```json
{
  "edital_id": "7777",
  "kind": "editais",
  "data_url": "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBB..."
}
```

**Response `200 OK`**

```json
{
  "ok": false,
  "errors": [
    { "message": "...", "summary": "FIM ATIV anterior a INICIO ATIV", "bolsista_ids": ["123456"] }
  ],
  "warnings": [],
  "diff": {
    "changed_cells": 12,
    "changed_rows": 4,
    "added_count": 0,
    "removed_count": 0,
    "no_current_version": false
  }
}
```

---

#### `POST /upload-planilha-corrigida`

Persiste uma nova versao da planilha, com validacao de layout, lock e versao otimista.

- **Autorizacao:** `OPERADOR` com lock valido
- **Operacao de origem:** `EnviarPlanilhaCorrigida`

**Request body**

```json
{
  "edital_id": "7777",
  "kind": "editais",
  "base_version": 3,
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa",
  "data_url": "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBB..."
}
```

**Response `201 Created`**

```json
{
  "ok": true,
  "bucket": "conecta-fapes-importador",
  "kind": "editais",
  "key": "editais_corrigidos/02_2026/editais/7777/historicoCorrecoesPlanilhas/4_17_04_2026.xlsx",
  "filename": "4_17_04_2026.xlsx",
  "version": 4,
  "base_version": 3,
  "latest_version": 4
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `403` | `LOCK_INVALIDO` | Lock invalido ou expirado. |
| `409` | `CONFLITO_DE_VERSAO` | `base_version` informada nao corresponde a `latest_version` atual. |
| `409` | `LAYOUT_INVALIDO` | A planilha enviada nao respeita o layout obrigatorio. |

---

#### `POST /upload`

Upload tecnico para path controlado no bucket (uso interno).

- **Autorizacao:** `OPERADOR`

**Request body**

```json
{
  "name": "relatorio.pdf",
  "content_type": "application/pdf",
  "data_url": "data:application/pdf;base64,JVBER...",
  "path": "manual-uploads/"
}
```

---

### 6. Programas

#### `GET /dados-programas`

Consulta a configuracao de areas tecnicas do edital tratado como programa.

- **Autorizacao:** `OPERADOR`

**Response `200 OK`**

```json
{
  "ok": true,
  "found": true,
  "allowed_areas": ["GEPED", "NUPEX", "GECAP", "GEINOV"],
  "items": [
    { "edital": "465 - Pesquisa Basica 2026", "areaTecnica": "NUPEX", "projetos": ["PRJ001", "PRJ002"] }
  ],
  "saved_at": "2026-04-17T17:02:00Z"
}
```

---

#### `POST /dados-programas`

Persiste o mapeamento projeto -> area tecnica.

- **Autorizacao:** `OPERADOR` com lock valido

**Request body**

```json
{
  "edital_id": "7777",
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa",
  "items": [
    { "edital": "465 - Pesquisa Basica 2026", "areaTecnica": "NUPEX", "projetos": ["PRJ001"] }
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `AREA_NAO_PERMITIDA` | Area tecnica informada nao esta no conjunto permitido. |
| `403` | `LOCK_INVALIDO` | Lock invalido ou expirado. |
| `409` | `CONFIG_PROGRAMAS_INCONSISTENTE` | Projetos ausentes ou duplicados entre areas. |

---

### 7. Importacao

#### `POST /gerar-jsonl`

Gera os JSONL de importacao (`bolsistas.jsonl`, `projetos.jsonl`, `alocacoes.jsonl`) a partir da planilha corrigida mais recente.

- **Autorizacao:** `OPERADOR` com lock valido
- **Operacao de origem:** `GerarArquivosJsonlDeImportacao`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `async` | boolean | Quando `true`, enfileira e retorna `job_id` |

**Request body (edital simples)**

```json
{
  "edital_id": "7777",
  "is_programa": false,
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa"
}
```

**Request body (programa)**

```json
{
  "edital_id": "7777",
  "is_programa": true,
  "lock_token": "c2f4e8a0-9a1b-4e19-8a2f-3e6d9c4b77aa",
  "dados_programas": [
    { "edital": "465 - Pesquisa Basica 2026", "areaTecnica": "NUPEX", "projetos": ["PRJ001"] }
  ]
}
```

**Response `201 Created`**

```json
{
  "ok": true,
  "bucket": "conecta-fapes-importador",
  "keys": [
    "editais_corrigidos/02_2026/importacao/7777/bolsistas.jsonl",
    "editais_corrigidos/02_2026/importacao/7777/projetos.jsonl",
    "editais_corrigidos/02_2026/importacao/7777/alocacoes.jsonl"
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `403` | `LOCK_INVALIDO` | Lock invalido ou expirado. |
| `502` | `S3_INDISPONIVEL` | Nao foi possivel gravar os JSONL no bucket. |

---

### 8. Jobs Assincronos

#### `GET /jobs/{job_id}`

Consulta o status de um job disparado em modo assincrono.

- **Autorizacao:** criador do job OU `SISTEMA`

**Response `200 OK`**

```json
{
  "ok": true,
  "job": {
    "id": "job_abc123",
    "status": "processing",
    "created_at": "2026-04-17T17:30:00Z",
    "updated_at": "2026-04-17T17:31:22Z",
    "result": null,
    "error": null
  }
}
```

Estados possiveis: `pending`, `processing`, `completed`, `failed`.

---

### 9. Status

#### `GET /status`

Healthcheck publico.

```json
{ "ok": true, "time_utc": "2026-04-17T17:30:00Z", "s3_bucket_configured": true }
```

#### `GET /health`

Healthcheck curto: `{ "ok": true }`.

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/auth/login` | AutenticarOperador | Publica |
| `GET` | `/editais-latest` | ListarEditaisDoUltimoDump | OPERADOR |
| `GET` | `/editais-grafico-metricas` | ConsultarMetricasDeImportacao | OPERADOR |
| `GET` | `/recurso-kind` | DescobrirTipoDoRecurso | OPERADOR |
| `POST` | `/cria-planilha-edital` | CriarPlanilhaInicialDoEdital | OPERADOR |
| `GET` | `/planilha-selecionada` | ObterPlanilhaSelecionada | OPERADOR |
| `GET` | `/planilhas-mes-passado` | ListarPlanilhasDoMesAnterior | OPERADOR |
| `GET` | `/planilhas-mes-passado/download` | BaixarPlanilhaDoMesAnterior | OPERADOR |
| `POST` | `/recurso-kind/switch` | TrocarTipoDoRecurso | OPERADOR + lock |
| `GET` | `/bolsista-dump-json` | VisualizarBolsistaNoDump | OPERADOR |
| `POST` | `/locks/acquire` | AdquirirLockDoRecurso | OPERADOR |
| `POST` | `/locks/heartbeat` | RenovarLockDoRecurso | OPERADOR |
| `POST` | `/locks/release` | LiberarLockDoRecurso | OPERADOR |
| `GET` | `/locks/me` | ConsultarLocksAtivosDoUsuario | OPERADOR |
| `POST` | `/locks/batch-status` | ConsultarStatusDeLocksEmLote | OPERADOR |
| `GET` | `/locks/status` | ConsultarStatusDeRecurso | OPERADOR |
| `POST` | `/validate-upload-planilha` | ValidarUploadDePlanilha | OPERADOR |
| `POST` | `/upload-planilha-corrigida` | EnviarPlanilhaCorrigida | OPERADOR + lock |
| `POST` | `/upload` | UploadDeArquivoBruto | OPERADOR |
| `GET` | `/dados-programas` | ConsultarDadosDeProgramas | OPERADOR |
| `POST` | `/dados-programas` | SalvarDadosDeProgramas | OPERADOR + lock |
| `POST` | `/gerar-jsonl` | GerarArquivosJsonlDeImportacao | OPERADOR + lock |
| `GET` | `/jobs/{job_id}` | ConsultarStatusDeJobAssincrono | OPERADOR ou SISTEMA |
| `GET` | `/status` | ConsultarStatusDoServico | Publica |
| `GET` | `/health` | Healthcheck | Publica |

---

## Schemas de Dominio (Referencia)

### EditalListado

```json
{
  "edital_id": "string",
  "edital_nome": "string",
  "edital_data_cadastro": "string (YYYY-MM-DD)",
  "qtd_bolsistas": "integer",
  "ja_importado": "boolean",
  "novo_este_mes": "boolean"
}
```

### ResourceLock

```json
{
  "resource_key": "string (MM_YYYY/kind/edital_id)",
  "lock_token": "string (UUID)",
  "expires_at": "string (ISO 8601)",
  "heartbeat_at": "string (ISO 8601)",
  "owner_user_id": "string",
  "owner_email": "string | null"
}
```

### PlanilhaVersao

```json
{
  "kind": "editais | programas",
  "version": "integer",
  "filename": "string (\"{version}_{dd_mm_yyyy}.xlsx\")",
  "key": "string (S3 key)",
  "last_action": "create_initial | upload_corrigida | switch_clone",
  "last_action_at": "string (ISO 8601)",
  "last_actor_email": "string | null"
}
```

### ValidationErrorItem

```json
{
  "message": "string",
  "summary": "string",
  "bolsista_ids": ["string"]
}
```

### ValidationDiff

```json
{
  "changed_cells": "integer",
  "changed_rows": "integer",
  "added_count": "integer",
  "removed_count": "integer",
  "no_current_version": "boolean"
}
```

### ProgramaItem

```json
{
  "edital": "string",
  "areaTecnica": "GEPED | NUPEX | GECAP | GEINOV",
  "projetos": ["string"]
}
```

### AsyncJob

```json
{
  "id": "string",
  "status": "pending | processing | completed | failed",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)",
  "result": "object | null",
  "error": "string | null"
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
| EPIC-M002-001 (Listar e selecionar editais) | [epics/EPIC-M002-001.md](epics/EPIC-M002-001.md) |
| EPIC-M002-002 (Corrigir planilha do edital) | [epics/EPIC-M002-002.md](epics/EPIC-M002-002.md) |
| EPIC-M002-003 (Gerar arquivos de importacao) | [epics/EPIC-M002-003.md](epics/EPIC-M002-003.md) |
| Produto consumidor | [Importador SIGFAPES](../../../products/importador/README.md) |
