# Contrato de API HTTP — M012 Acompanhamento e Resultados

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M012 como bounded context responsavel por dashboards de acompanhamento, relatorios tecnicos, contestacoes e solicitacoes de alteracao de projetos. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m012
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `REL-2026-010`, `CON-2026-003`, `ALT-2026-007`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `COORDENADOR` | Coordenador de projeto — submete relatorios, contesta pareceres e solicita alteracoes |
| `AREA_TECNICA` | Area Tecnica da Agencia de Fomento — analisa relatorios e decide solicitacoes |
| `SECONT` | Auditoria externa — acesso somente leitura a dashboards |
| `MODULO_INTERNO` | Modulo interno autorizado — acesso restrito a consultas |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "projeto": "PROJ-2026-014"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | Periodo de relatorio duplicado, contestacao duplicada |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido para a operacao solicitada, prazo expirado |

---

## Recursos

### 1. Dashboards de Acompanhamento

#### `GET /api/v1/m012/dashboards/projeto/{projetoId}`

Consulta indicadores operacionais do projeto para o coordenador.

- **Autorizacao:** `COORDENADOR`, `AREA_TECNICA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarDashboardAcompanhamento`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto em M003 |

**Response `200 OK`**

```json
{
  "dashboardProjeto": {
    "projetoId": "PROJ-2026-014",
    "statusProjeto": "ATIVO",
    "relatoriosPendentes": 1,
    "relatoriosAprovados": 2,
    "solicitacoesAlteracao": 0,
    "proximoPrazoRelatorio": "2026-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |
| `422` | `PROJETO_NAO_ELEGIVEL_DASHBOARD` | Somente projetos contratados podem ser exibidos no dashboard de acompanhamento. |

---

#### `GET /api/v1/m012/dashboards/agencia`

Consulta visao gerencial da agencia de fomento com todos os projetos em andamento (US-M012-002).

- **Autorizacao:** `AREA_TECNICA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Filtra por edital |
| `statusProjeto` | string | Filtra por status: `ATIVO`, `ENCERRADO`, `SUSPENSO` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "totalProjetos": 25,
  "relatoriosPendentesAnalise": 8,
  "solicitacoesAlteracaoPendentes": 3,
  "items": [
    {
      "projetoId": "PROJ-2026-014",
      "statusProjeto": "ATIVO",
      "relatoriosPendentes": 1
    }
  ],
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m012/dashboards/secont`

Consulta visao somente-leitura de fiscalizacao para o perfil SECONT (US-M012-003).

- **Autorizacao:** `SECONT`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Filtra por edital |
| `projetoId` | string | Filtra por projeto especifico |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "totalProjetos": 25,
  "totalRelatoriosAprovados": 48,
  "totalRelatoriosReprovados": 3,
  "items": [
    {
      "projetoId": "PROJ-2026-014",
      "statusProjeto": "ATIVO",
      "totalRelatorios": 3,
      "relatoriosAprovados": 2
    }
  ],
  "page": 1,
  "pageSize": 20
}
```

---

### 2. Relatorios Tecnicos

#### `POST /api/v1/m012/relatorios`

Registra a submissao de um relatorio tecnico de projeto.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `SubmeterRelatorioTecnico`
- **Idempotencia:** Nao

**Request body**

```json
{
  "projetoId": "PROJ-2026-014",
  "periodoReferencia": "2026-S1",
  "conteudo": "Resumo das entregas do semestre.",
  "anexos": [
    "DOC-2026-010",
    "DOC-2026-011"
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `projetoId` | string | Sim | Identificador do projeto em M003 |
| `periodoReferencia` | string | Sim | Periodo de referencia do relatorio (ex: `2026-S1`, `2026-T1`) |
| `conteudo` | string | Sim | Conteudo ou resumo do relatorio tecnico |
| `anexos` | array (string) | Nao | Lista de identificadores de documentos anexos |

**Response `201 Created`**

```json
{
  "relatorioTecnico": {
    "id": "REL-2026-010",
    "projetoId": "PROJ-2026-014",
    "periodoReferencia": "2026-S1",
    "estado": "SUBMETIDO"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado para submissao de relatorio. |
| `422` | `PROJETO_INATIVO` | O projeto nao esta ativo para submissao de relatorio tecnico. |
| `409` | `PERIODO_RELATORIO_DUPLICADO` | Ja existe relatorio aprovado para o periodo informado. |
| `400` | `RELATORIO_DADOS_INVALIDOS` | Os dados obrigatorios do relatorio nao foram informados corretamente. |

---

#### `GET /api/v1/m012/relatorios`

Lista relatorios tecnicos com filtros.

- **Autorizacao:** `COORDENADOR`, `AREA_TECNICA`, `SECONT`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Filtra por projeto |
| `estado` | string | Filtra por estado: `SUBMETIDO`, `APROVADO`, `REPROVADO`, `CONTESTADO` |
| `periodoReferencia` | string | Filtra pelo periodo de referencia |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "REL-2026-010",
      "projetoId": "PROJ-2026-014",
      "periodoReferencia": "2026-S1",
      "estado": "SUBMETIDO"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m012/relatorios/{id}`

Consulta o detalhe de um relatorio tecnico.

- **Autorizacao:** `COORDENADOR`, `AREA_TECNICA`, `SECONT`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do relatorio tecnico |

**Response `200 OK`**

```json
{
  "relatorioTecnico": {
    "id": "REL-2026-010",
    "projetoId": "PROJ-2026-014",
    "periodoReferencia": "2026-S1",
    "estado": "SUBMETIDO",
    "conteudo": "Resumo das entregas do semestre.",
    "anexos": ["DOC-2026-010"]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RELATORIO_NAO_ENCONTRADO` | O relatorio informado nao foi encontrado. |

---

#### `POST /api/v1/m012/relatorios/{id}/parecer`

Aprova ou reprova um relatorio tecnico submetido.

- **Autorizacao:** `AREA_TECNICA`
- **Operacao de origem:** `EmitirParecerRelatorio`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do relatorio tecnico |

**Request body**

```json
{
  "tipoParecer": "REPROVADO",
  "justificativa": "Necessario detalhar indicadores de entrega."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `tipoParecer` | string (enum) | Sim | Um de: `APROVADO`, `REPROVADO` |
| `justificativa` | string | Condicional | Obrigatorio quando `tipoParecer` for `REPROVADO` |

**Response `200 OK`**

```json
{
  "parecerRelatorio": {
    "relatorioId": "REL-2026-010",
    "tipoParecer": "REPROVADO",
    "justificativa": "Necessario detalhar indicadores de entrega."
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RELATORIO_NAO_ENCONTRADO` | O relatorio informado nao foi encontrado para analise. |
| `422` | `RELATORIO_ESTADO_INVALIDO_PARECER` | O relatorio nao esta em estado que permite emissao de parecer. |
| `400` | `PARECER_RELATORIO_INVALIDO` | O parecer informado para o relatorio e invalido. |

---

### 3. Contestacoes de Relatorio

#### `POST /api/v1/m012/relatorios/{id}/contestacao`

Registra a contestacao de reprovacao de um relatorio tecnico.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `RegistrarContestacaoRelatorio`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do relatorio tecnico |

**Request body**

```json
{
  "justificativa": "Os anexos complementares foram atualizados.",
  "documentos": [
    "DOC-2026-014"
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Justificativa para contestar a reprovacao |
| `documentos` | array (string) | Sim | Identificadores dos documentos complementares |

**Response `201 Created`**

```json
{
  "contestacaoRelatorio": {
    "id": "CON-2026-003",
    "relatorioId": "REL-2026-010",
    "estado": "SUBMETIDA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RELATORIO_NAO_ENCONTRADO` | O relatorio informado nao foi encontrado para contestacao. |
| `422` | `RELATORIO_NAO_REPROVADO` | So e possivel contestar relatorios com parecer de reprovacao. |
| `422` | `PRAZO_CONTESTACAO_EXPIRADO` | O prazo para contestar a reprovacao do relatorio ja expirou. |
| `409` | `CONTESTACAO_RELATORIO_INVALIDA` | A contestacao deve conter justificativa e documentos complementares. |

---

#### `GET /api/v1/m012/relatorios/{id}/contestacao`

Consulta a contestacao registrada para um relatorio tecnico.

- **Autorizacao:** `COORDENADOR`, `AREA_TECNICA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do relatorio tecnico |

**Response `200 OK`**

```json
{
  "contestacaoRelatorio": {
    "id": "CON-2026-003",
    "relatorioId": "REL-2026-010",
    "estado": "SUBMETIDA",
    "justificativa": "Os anexos complementares foram atualizados.",
    "documentos": ["DOC-2026-014"]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RELATORIO_NAO_ENCONTRADO` | O relatorio informado nao foi encontrado. |
| `404` | `CONTESTACAO_NAO_ENCONTRADA` | Nao ha contestacao registrada para o relatorio informado. |

---

#### `POST /api/v1/m012/relatorios/{id}/contestacao/decisao`

Registra a decisao final sobre a contestacao de um relatorio (US-M012-007).

- **Autorizacao:** `AREA_TECNICA`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do relatorio tecnico |

**Request body**

```json
{
  "aprovado": true,
  "justificativa": "Documentacao complementar aceita. Relatorio aprovado definitivamente."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `aprovado` | boolean | Sim | `true` para aprovar apos contestacao, `false` para reprovar definitivamente |
| `justificativa` | string | Sim | Justificativa da decisao final |

**Response `200 OK`**

```json
{
  "relatorioTecnico": {
    "id": "REL-2026-010",
    "estado": "APROVADO"
  },
  "contestacaoRelatorio": {
    "id": "CON-2026-003",
    "estado": "DEFERIDA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RELATORIO_NAO_ENCONTRADO` | O relatorio informado nao foi encontrado. |
| `404` | `CONTESTACAO_NAO_ENCONTRADA` | Nao ha contestacao submetida para o relatorio informado. |
| `422` | `CONTESTACAO_JA_DECIDIDA` | Apos a decisao final, nao cabe nova contestacao. |

---

### 4. Solicitacoes de Alteracao

#### `POST /api/v1/m012/projetos/{projetoId}/solicitacoes-alteracao`

Solicita alteracao relevante do projeto com justificativa.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `RegistrarSolicitacaoDeAlteracao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto em M003 |

**Request body**

```json
{
  "tipoAlteracao": "PRAZO",
  "justificativa": "Necessidade de extensao de cronograma."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `tipoAlteracao` | string (enum) | Sim | Um de: `PRAZO`, `ESCOPO`, `EQUIPE`, `ORCAMENTO` |
| `justificativa` | string | Sim | Justificativa detalhada da solicitacao |

**Response `201 Created`**

```json
{
  "solicitacaoAlteracao": {
    "id": "ALT-2026-007",
    "projetoId": "PROJ-2026-014",
    "tipoAlteracao": "PRAZO",
    "estado": "SUBMETIDA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado para solicitacao de alteracao. |
| `422` | `PROJETO_ENCERRADO` | Nao e permitido registrar solicitacao de alteracao para projeto encerrado. |
| `409` | `SOLICITACAO_ALTERACAO_DUPLICADA` | Ja existe solicitacao de alteracao pendente para o projeto informado. |
| `400` | `SOLICITACAO_DADOS_INVALIDOS` | Os dados obrigatorios da solicitacao nao foram informados corretamente. |

---

#### `GET /api/v1/m012/projetos/{projetoId}/solicitacoes-alteracao`

Lista as solicitacoes de alteracao de um projeto.

- **Autorizacao:** `COORDENADOR`, `AREA_TECNICA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra por estado: `SUBMETIDA`, `APROVADA`, `REPROVADA` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "projetoId": "PROJ-2026-014",
  "items": [
    {
      "id": "ALT-2026-007",
      "tipoAlteracao": "PRAZO",
      "estado": "SUBMETIDA",
      "justificativa": "Necessidade de extensao de cronograma."
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

#### `GET /api/v1/m012/solicitacoes-alteracao/{id}`

Consulta o detalhe de uma solicitacao de alteracao.

- **Autorizacao:** `COORDENADOR`, `AREA_TECNICA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da solicitacao de alteracao |

**Response `200 OK`**

```json
{
  "solicitacaoAlteracao": {
    "id": "ALT-2026-007",
    "projetoId": "PROJ-2026-014",
    "tipoAlteracao": "PRAZO",
    "estado": "SUBMETIDA",
    "justificativa": "Necessidade de extensao de cronograma."
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `SOLICITACAO_ALTERACAO_NAO_ENCONTRADA` | A solicitacao de alteracao nao foi encontrada. |

---

#### `POST /api/v1/m012/solicitacoes-alteracao/{id}/decidir`

Aprova ou reprova uma solicitacao de alteracao do projeto.

- **Autorizacao:** `AREA_TECNICA`
- **Operacao de origem:** `DecidirSolicitacaoDeAlteracao`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da solicitacao de alteracao |

**Request body**

```json
{
  "aprovado": true,
  "justificativa": "Alteracao compatibilizada com o acompanhamento do projeto."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `aprovado` | boolean | Sim | `true` para aprovar, `false` para reprovar |
| `justificativa` | string | Sim | Justificativa da decisao |

**Response `200 OK`**

```json
{
  "solicitacaoAlteracao": {
    "id": "ALT-2026-007",
    "estado": "APROVADA",
    "justificativa": "Alteracao compatibilizada com o acompanhamento do projeto."
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `SOLICITACAO_ALTERACAO_NAO_ENCONTRADA` | A solicitacao de alteracao nao foi encontrada para decisao. |
| `422` | `ESTADO_SOLICITACAO_INVALIDO` | A solicitacao nao esta em estado valido para decisao. |
| `400` | `DECISAO_DADOS_INVALIDOS` | Os dados obrigatorios da decisao nao foram informados corretamente. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `GET` | `/api/v1/m012/dashboards/projeto/{projetoId}` | ConsultarDashboardCoordenador | COORDENADOR, AREA_TECNICA, MODULO_INTERNO |
| `GET` | `/api/v1/m012/dashboards/agencia` | ConsultarDashboardAgencia | AREA_TECNICA |
| `GET` | `/api/v1/m012/dashboards/secont` | ConsultarDashboardSECONT | SECONT |
| `POST` | `/api/v1/m012/relatorios` | SubmeterRelatorioTecnico | COORDENADOR |
| `GET` | `/api/v1/m012/relatorios` | ListarRelatoriosTecnicos | COORDENADOR, AREA_TECNICA, SECONT, MODULO_INTERNO |
| `GET` | `/api/v1/m012/relatorios/{id}` | ConsultarRelatorioTecnico | COORDENADOR, AREA_TECNICA, SECONT, MODULO_INTERNO |
| `POST` | `/api/v1/m012/relatorios/{id}/parecer` | EmitirParecerRelatorio | AREA_TECNICA |
| `POST` | `/api/v1/m012/relatorios/{id}/contestacao` | RegistrarContestacaoRelatorio | COORDENADOR |
| `GET` | `/api/v1/m012/relatorios/{id}/contestacao` | ConsultarContestacaoRelatorio | COORDENADOR, AREA_TECNICA |
| `POST` | `/api/v1/m012/relatorios/{id}/contestacao/decisao` | DecidirContestacaoRelatorio | AREA_TECNICA |
| `POST` | `/api/v1/m012/projetos/{projetoId}/solicitacoes-alteracao` | RegistrarSolicitacaoDeAlteracao | COORDENADOR |
| `GET` | `/api/v1/m012/projetos/{projetoId}/solicitacoes-alteracao` | ListarSolicitacoesAlteracao | COORDENADOR, AREA_TECNICA, MODULO_INTERNO |
| `GET` | `/api/v1/m012/solicitacoes-alteracao/{id}` | ConsultarSolicitacaoAlteracao | COORDENADOR, AREA_TECNICA |
| `POST` | `/api/v1/m012/solicitacoes-alteracao/{id}/decidir` | DecidirSolicitacaoDeAlteracao | AREA_TECNICA |

---

## Schemas de Dominio (Referencia)

### DashboardProjeto

```json
{
  "projetoId": "string",
  "statusProjeto": "ATIVO | ENCERRADO | SUSPENSO",
  "relatoriosPendentes": "integer",
  "relatoriosAprovados": "integer",
  "solicitacoesAlteracao": "integer",
  "proximoPrazoRelatorio": "string (YYYY-MM-DD) | null"
}
```

### RelatorioTecnico

```json
{
  "id": "string",
  "projetoId": "string",
  "periodoReferencia": "string",
  "estado": "SUBMETIDO | APROVADO | REPROVADO | CONTESTADO",
  "conteudo": "string",
  "anexos": ["string"]
}
```

### ParecerRelatorio

```json
{
  "relatorioId": "string",
  "tipoParecer": "APROVADO | REPROVADO",
  "justificativa": "string (opcional)"
}
```

### ContestacaoRelatorio

```json
{
  "id": "string",
  "relatorioId": "string",
  "estado": "SUBMETIDA | DEFERIDA | INDEFERIDA",
  "justificativa": "string",
  "documentos": ["string"]
}
```

### SolicitacaoAlteracao

```json
{
  "id": "string",
  "projetoId": "string",
  "tipoAlteracao": "PRAZO | ESCOPO | EQUIPE | ORCAMENTO",
  "estado": "SUBMETIDA | APROVADA | REPROVADA",
  "justificativa": "string"
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
| EPIC-M012-001 (Dashboards de Acompanhamento) | [epics/EPIC-M012-001.md](epics/EPIC-M012-001.md) |
| EPIC-M012-002 (Gestao de Relatorios Tecnicos) | [epics/EPIC-M012-002.md](epics/EPIC-M012-002.md) |
| EPIC-M012-003 (Solicitacoes de Alteracao) | [epics/EPIC-M012-003.md](epics/EPIC-M012-003.md) |
