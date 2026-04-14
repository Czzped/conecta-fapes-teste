# Contrato de API HTTP — M015 Suspensao e Finalizacao

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M015 como bounded context coordenador dos fluxos de suspensao, reativacao e finalizacao de projetos, com verificacao de pendencias em modulos vizinhos. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m015
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `SS-2026-001`, `SF-2026-002`, `PROJ-2026-014`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `COORDENADOR` | Coordenador do projeto — solicita suspensao e finalizacao |
| `ANALISTA_AGENCIA` | Area Tecnica da Agencia de Fomento — decide suspensoes, reativa projetos e conclui finalizacoes |
| `MODULO_INTERNO` | Modulo interno autorizado (M004, M009, M014) — notificado por efeitos colaterais |

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
| `409 Conflict` | Conflito de estado ou duplicata | Projeto ja suspenso, projeto ja encerrado |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Pendencias abertas, projeto encerrado irreversivel, reativacao nao permitida |

---

## Recursos

### 1. Solicitacoes de Suspensao

#### `POST /api/v1/m015/projetos/{projetoId}/suspensoes`

Registra uma solicitacao de suspensao de projeto.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`
- **Operacao de origem:** `SolicitarSuspensaoProjeto`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto (ex: `PROJ-2026-014`) |

**Request body**

```json
{
  "origem": "COORDENADOR",
  "justificativa": "Projeto em replanejamento metodologico."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `origem` | string (enum) | Sim | Origem da solicitacao: `COORDENADOR` ou `AGENCIA_FOMENTO` |
| `justificativa` | string | Sim | Justificativa detalhada da solicitacao de suspensao |

**Response `201 Created`**

```json
{
  "solicitacaoSuspensao": {
    "codigo": "SS-2026-001",
    "projetoId": "PROJ-2026-014",
    "origem": "COORDENADOR",
    "estado": "SUBMETIDA",
    "criadaEm": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |
| `400` | `JUSTIFICATIVA_SUSPENSAO_OBRIGATORIA` | Toda solicitacao de suspensao deve conter justificativa. |
| `409` | `PROJETO_JA_SUSPENSO` | O projeto informado ja se encontra suspenso e nao pode ser suspenso novamente. |
| `422` | `PROJETO_EM_ENCERRAMENTO` | Um projeto em processo de encerramento nao pode ser suspenso. |

---

#### `GET /api/v1/m015/projetos/{projetoId}/suspensoes`

Lista as solicitacoes de suspensao do projeto.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra pelo estado: `SUBMETIDA`, `APROVADA`, `REJEITADA` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "SS-2026-001",
      "projetoId": "PROJ-2026-014",
      "origem": "COORDENADOR",
      "estado": "APROVADA",
      "criadaEm": "2026-04-13"
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
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |

---

#### `GET /api/v1/m015/suspensoes/{suspensaoCodigo}`

Consulta o detalhe de uma solicitacao de suspensao.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `suspensaoCodigo` | string | Codigo da solicitacao de suspensao (ex: `SS-2026-001`) |

**Response `200 OK`**

```json
{
  "solicitacaoSuspensao": {
    "codigo": "SS-2026-001",
    "projetoId": "PROJ-2026-014",
    "origem": "COORDENADOR",
    "justificativa": "Projeto em replanejamento metodologico.",
    "estado": "SUBMETIDA",
    "criadaEm": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `SOLICITACAO_SUSPENSAO_NAO_ENCONTRADA` | A solicitacao de suspensao nao foi encontrada. |

---

#### `POST /api/v1/m015/suspensoes/{suspensaoCodigo}/decidir`

Aprova ou rejeita a solicitacao de suspensao.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `DecidirSolicitacaoSuspensao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `suspensaoCodigo` | string | Codigo da solicitacao de suspensao |

**Request body**

```json
{
  "aprovado": true,
  "justificativa": "Suspensao aprovada pela area tecnica."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `aprovado` | boolean | Sim | Indica se a suspensao foi aprovada (`true`) ou rejeitada (`false`) |
| `justificativa` | string | Sim | Justificativa da decisao |

**Response `200 OK`**

```json
{
  "solicitacaoSuspensao": {
    "codigo": "SS-2026-001",
    "estado": "APROVADA",
    "decididaEm": "2026-04-14"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `SOLICITACAO_SUSPENSAO_NAO_ENCONTRADA` | A solicitacao de suspensao nao foi encontrada para decisao. |
| `422` | `ESTADO_SUSPENSAO_INVALIDO` | A solicitacao de suspensao nao esta em estado valido para decisao. |
| `400` | `DECISAO_DADOS_INVALIDOS` | Os dados da decisao nao foram informados corretamente. |

---

### 2. Reativacao de Projeto

#### `POST /api/v1/m015/projetos/{projetoId}/reativar`

Reativa um projeto suspenso apos aprovacao da area tecnica.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `ReativarProjetoSuspenso`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto suspenso |

**Request body**

```json
{
  "justificativa": "Pendencias regularizadas e projeto apto a retomar execucao."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Justificativa para reativacao do projeto |

**Response `200 OK`**

```json
{
  "projeto": {
    "id": "PROJ-2026-014",
    "estado": "EM_EXECUCAO",
    "reativadoEm": "2026-04-14"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |
| `422` | `PROJETO_NAO_SUSPENSO` | O projeto informado nao esta suspenso para reativacao. |
| `422` | `REATIVACAO_PROJETO_NAO_PERMITIDA` | A reativacao do projeto nao foi autorizada pela area tecnica. |
| `400` | `JUSTIFICATIVA_REATIVACAO_OBRIGATORIA` | A reativacao do projeto exige justificativa. |

---

### 3. Solicitacoes de Finalizacao

#### `POST /api/v1/m015/projetos/{projetoId}/finalizacoes`

Registra um pedido de encerramento definitivo do projeto.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`
- **Operacao de origem:** `SolicitarFinalizacaoProjeto`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Request body**

```json
{
  "motivo": "CONCLUSAO_NATURAL",
  "justificativa": "Metas executadas e projeto concluido."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `motivo` | string (enum) | Sim | Motivo do encerramento: `CONCLUSAO_NATURAL`, `DESISTENCIA_COORDENADOR`, `DETERMINACAO_AGENCIA` |
| `justificativa` | string | Sim | Justificativa detalhada do encerramento |

**Response `201 Created`**

```json
{
  "solicitacaoFinalizacao": {
    "codigo": "SF-2026-002",
    "projetoId": "PROJ-2026-014",
    "motivo": "CONCLUSAO_NATURAL",
    "estado": "VERIFICANDO_PENDENCIAS",
    "criadaEm": "2026-04-14"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |
| `400` | `JUSTIFICATIVA_FINALIZACAO_OBRIGATORIA` | A solicitacao de finalizacao exige justificativa detalhada. |
| `422` | `PROJETO_ENCERRAMENTO_INVALIDO` | O projeto nao pode iniciar finalizacao no estado atual. |
| `409` | `PROJETO_JA_ENCERRADO` | O projeto ja foi encerrado definitivamente. |

---

#### `GET /api/v1/m015/projetos/{projetoId}/finalizacoes`

Lista as solicitacoes de finalizacao do projeto.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra pelo estado: `VERIFICANDO_PENDENCIAS`, `PENDENCIAS_RESOLVIDAS`, `ENCERRADA` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "SF-2026-002",
      "projetoId": "PROJ-2026-014",
      "motivo": "CONCLUSAO_NATURAL",
      "estado": "ENCERRADA",
      "criadaEm": "2026-04-14"
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
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |

---

#### `POST /api/v1/m015/finalizacoes/{finalizacaoCodigo}/concluir`

Encerra o projeto apos verificacao e resolucao de todas as pendencias.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `ConcluirFinalizacaoProjeto`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `finalizacaoCodigo` | string | Codigo da solicitacao de finalizacao (ex: `SF-2026-002`) |

**Sem corpo na requisicao.**

**Response `200 OK`**

```json
{
  "solicitacaoFinalizacao": {
    "codigo": "SF-2026-002",
    "estado": "ENCERRADA",
    "encerradoEm": "2026-04-14"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `FINALIZACAO_NAO_ENCONTRADA` | A solicitacao de finalizacao nao foi encontrada. |
| `422` | `PENDENCIAS_FINALIZACAO_ABERTAS` | Ainda existem pendencias de bolsas, pagamentos ou prestacao de contas para o projeto. |
| `422` | `PROJETO_ENCERRADO_IRREVERSIVEL` | O projeto ja foi encerrado e nao aceita nova operacao de finalizacao. |

---

### 4. Pendencias de Finalizacao

#### `GET /api/v1/m015/projetos/{projetoId}/pendencias-finalizacao`

Consulta as pendencias impeditivas ao encerramento do projeto.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`
- **Operacao de origem:** `ConsultarPendenciasDeFinalizacao`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Response `200 OK`**

```json
{
  "projetoId": "PROJ-2026-014",
  "pendencias": [
    {
      "tipo": "PRESTACAO_CONTAS_PENDENTE",
      "descricao": "Prestacao 2026-S1 ainda nao aprovada.",
      "modulo": "M014"
    },
    {
      "tipo": "BOLSA_ATIVA",
      "descricao": "Bolsista ID BPS-2026-008 ainda com bolsa ativa.",
      "modulo": "M009"
    }
  ],
  "totalPendencias": 2
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado para consulta de pendencias. |
| `400` | `CONSULTA_PENDENCIA_INVALIDA` | Os filtros informados para consulta de pendencias sao invalidos. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m015/projetos/{projetoId}/suspensoes` | SolicitarSuspensaoProjeto | COORDENADOR, ANALISTA_AGENCIA |
| `GET` | `/api/v1/m015/projetos/{projetoId}/suspensoes` | ListarSuspensoes | COORDENADOR, ANALISTA_AGENCIA |
| `GET` | `/api/v1/m015/suspensoes/{suspensaoCodigo}` | ConsultarSuspensao | COORDENADOR, ANALISTA_AGENCIA |
| `POST` | `/api/v1/m015/suspensoes/{suspensaoCodigo}/decidir` | DecidirSolicitacaoSuspensao | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m015/projetos/{projetoId}/reativar` | ReativarProjetoSuspenso | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m015/projetos/{projetoId}/finalizacoes` | SolicitarFinalizacaoProjeto | COORDENADOR, ANALISTA_AGENCIA |
| `GET` | `/api/v1/m015/projetos/{projetoId}/finalizacoes` | ListarFinalizacoes | COORDENADOR, ANALISTA_AGENCIA |
| `POST` | `/api/v1/m015/finalizacoes/{finalizacaoCodigo}/concluir` | ConcluirFinalizacaoProjeto | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m015/projetos/{projetoId}/pendencias-finalizacao` | ConsultarPendenciasDeFinalizacao | COORDENADOR, ANALISTA_AGENCIA |

---

## Schemas de Dominio (Referencia)

### SolicitacaoSuspensao

```json
{
  "codigo": "string",
  "projetoId": "string",
  "origem": "COORDENADOR | AGENCIA_FOMENTO",
  "justificativa": "string",
  "estado": "SUBMETIDA | APROVADA | REJEITADA",
  "criadaEm": "string (YYYY-MM-DD)",
  "decididaEm": "string (YYYY-MM-DD) | null"
}
```

### SolicitacaoFinalizacao

```json
{
  "codigo": "string",
  "projetoId": "string",
  "motivo": "CONCLUSAO_NATURAL | DESISTENCIA_COORDENADOR | DETERMINACAO_AGENCIA",
  "justificativa": "string",
  "estado": "VERIFICANDO_PENDENCIAS | PENDENCIAS_RESOLVIDAS | ENCERRADA",
  "criadaEm": "string (YYYY-MM-DD)",
  "encerradoEm": "string (YYYY-MM-DD) | null"
}
```

### VerificacaoPendencia

```json
{
  "tipo": "PRESTACAO_CONTAS_PENDENTE | BOLSA_ATIVA | PAGAMENTO_PENDENTE",
  "descricao": "string",
  "modulo": "string"
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
| EPIC-M015-001 (Suspensao de Projeto) | [epics/EPIC-M015-001.md](epics/EPIC-M015-001.md) |
| EPIC-M015-002 (Finalizacao de Projeto) | [epics/EPIC-M015-002.md](epics/EPIC-M015-002.md) |
