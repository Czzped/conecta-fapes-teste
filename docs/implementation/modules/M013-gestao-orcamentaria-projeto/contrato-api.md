# Contrato de API HTTP — M013 Gestao Orcamentaria do Projeto

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M013 como bounded context responsavel por rubricas de projeto, solicitacoes orcamentarias, pareceres, saldos e historico de movimentacao. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m013
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `PROJ-2026-014`, `RP-2026-004`, `SO-2026-001`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `ANALISTA_AGENCIA` | Analista da Agencia de Fomento — acesso completo de leitura e escrita, incluindo pareceres |
| `DIRETOR` | Diretor da Agencia de Fomento — aprovacao de remanejamentos acima de 25% |
| `COORDENADOR` | Coordenador do projeto — solicita movimentacoes e consulta saldos |
| `MODULO_INTERNO` | Modulo interno autorizado (M014, M019) — acesso restrito a consultas |

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
| `409 Conflict` | Conflito de estado ou duplicata | Rubrica ja vinculada, solicitacao duplicada |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Saldo insuficiente, projeto inativo, limite de edital excedido |

---

## Recursos

### 1. Rubricas do Projeto

#### `POST /api/v1/m013/projetos/{projetoId}/rubricas`

Vincula uma rubrica do cadastro corporativo ao projeto com saldo inicial.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarRubricaDoProjeto`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto (ex: `PROJ-2026-014`) |

**Request body**

```json
{
  "rubricaFinanceiraId": "RUB-339030",
  "valorAprovado": 150000.0
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `rubricaFinanceiraId` | string | Sim | Identificador da rubrica financeira do cadastro corporativo (M008) |
| `valorAprovado` | number | Sim | Valor aprovado para a rubrica neste projeto |

**Response `201 Created`**

```json
{
  "rubricaProjeto": {
    "id": "RP-2026-004",
    "projetoId": "PROJ-2026-014",
    "rubricaFinanceiraId": "RUB-339030",
    "valorAprovado": 150000.0,
    "saldoAtual": 150000.0
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RUBRICA_FINANCEIRA_NAO_ENCONTRADA` | A rubrica financeira informada nao existe no cadastro basico. |
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |
| `409` | `RUBRICA_JA_VINCULADA_AO_PROJETO` | A rubrica informada ja esta vinculada a este projeto. |
| `422` | `PROJETO_NAO_ELEGIVEL_RUBRICA` | O projeto informado nao esta apto a receber nova rubrica. |
| `400` | `RUBRICA_DADOS_INVALIDOS` | Os dados obrigatorios da rubrica do projeto nao foram informados corretamente. |

---

#### `GET /api/v1/m013/projetos/{projetoId}/rubricas`

Lista as rubricas vinculadas ao projeto com saldos atualizados.

- **Autorizacao:** `ANALISTA_AGENCIA`, `COORDENADOR`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarSaldoPorRubrica`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "RP-2026-004",
      "rubricaFinanceiraId": "RUB-339030",
      "valorAprovado": 150000.0,
      "saldoAtual": 138000.0
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
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado para consulta de saldo. |
| `422` | `SALDO_RUBRICA_INDISPONIVEL` | Nao foi possivel consolidar o saldo das rubricas neste momento. |

---

#### `GET /api/v1/m013/projetos/{projetoId}/rubricas/{rubricaId}`

Consulta o saldo atualizado de uma rubrica especifica do projeto.

- **Autorizacao:** `ANALISTA_AGENCIA`, `COORDENADOR`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarSaldoPorRubrica`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |
| `rubricaId` | string | Identificador da rubrica do projeto |

**Response `200 OK`**

```json
{
  "rubricaProjeto": {
    "id": "RP-2026-004",
    "rubricaFinanceiraId": "RUB-339030",
    "valorAprovado": 150000.0,
    "saldoAtual": 138000.0
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |
| `404` | `RUBRICA_PROJETO_NAO_ENCONTRADA` | A rubrica informada nao foi encontrada para este projeto. |

---

### 2. Solicitacoes Orcamentarias

#### `POST /api/v1/m013/projetos/{projetoId}/solicitacoes-orcamentarias`

Registra uma solicitacao de adicao, inclusao, remanejamento ou realocacao de bolsas.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `SolicitarMovimentacaoOrcamentaria`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Request body**

```json
{
  "tipoSolicitacao": "REMANEJAMENTO",
  "justificativa": "Adequacao de despesas de campo.",
  "rubricaOrigemId": "RP-2026-004",
  "rubricaDestinoId": "RP-2026-005",
  "valor": 12000.0
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `tipoSolicitacao` | string (enum) | Sim | Um de: `ADICAO`, `INCLUSAO_RUBRICA`, `REMANEJAMENTO`, `REALOCACAO_BOLSA` |
| `justificativa` | string | Sim | Justificativa detalhada da solicitacao |
| `rubricaOrigemId` | string | Condicional | Identificador da rubrica de origem (obrigatorio para REMANEJAMENTO e REALOCACAO_BOLSA) |
| `rubricaDestinoId` | string | Condicional | Identificador da rubrica de destino (obrigatorio para REMANEJAMENTO e REALOCACAO_BOLSA) |
| `valor` | number | Sim | Valor da solicitacao |

**Response `201 Created`**

```json
{
  "solicitacaoOrcamentaria": {
    "id": "SO-2026-001",
    "projetoId": "PROJ-2026-014",
    "tipoSolicitacao": "REMANEJAMENTO",
    "valor": 12000.0,
    "estado": "SUBMETIDA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `JUSTIFICATIVA_ORCAMENTARIA_OBRIGATORIA` | Toda solicitacao orcamentaria exige justificativa do coordenador. |
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |
| `404` | `RUBRICA_PROJETO_NAO_ENCONTRADA` | A rubrica de origem ou destino informada nao foi encontrada. |
| `422` | `PROJETO_INATIVO` | A solicitacao orcamentaria so pode ser submetida para projetos ativos. |
| `422` | `SALDO_RUBRICA_INSUFICIENTE` | O remanejamento solicitado deixaria saldo negativo na rubrica de origem. |
| `422` | `TIPO_SOLICITACAO_INVALIDO` | O tipo de solicitacao informado e invalido. |

---

#### `GET /api/v1/m013/projetos/{projetoId}/solicitacoes-orcamentarias`

Lista as solicitacoes orcamentarias do projeto com filtros e paginacao.

- **Autorizacao:** `ANALISTA_AGENCIA`, `COORDENADOR`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipoSolicitacao` | string | Filtra pelo tipo: `ADICAO`, `INCLUSAO_RUBRICA`, `REMANEJAMENTO`, `REALOCACAO_BOLSA` |
| `estado` | string | Filtra pelo estado: `SUBMETIDA`, `EM_ANALISE`, `APROVADA`, `REPROVADA` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "SO-2026-001",
      "tipoSolicitacao": "REMANEJAMENTO",
      "valor": 12000.0,
      "estado": "SUBMETIDA",
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
| `400` | `FILTRO_SOLICITACAO_INVALIDO` | Os filtros informados para consulta de solicitacao sao invalidos. |

---

#### `GET /api/v1/m013/solicitacoes-orcamentarias/{solicitacaoId}`

Consulta o detalhe de uma solicitacao orcamentaria.

- **Autorizacao:** `ANALISTA_AGENCIA`, `COORDENADOR`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `solicitacaoId` | string | Identificador da solicitacao (ex: `SO-2026-001`) |

**Response `200 OK`**

```json
{
  "solicitacaoOrcamentaria": {
    "id": "SO-2026-001",
    "projetoId": "PROJ-2026-014",
    "tipoSolicitacao": "REMANEJAMENTO",
    "justificativa": "Adequacao de despesas de campo.",
    "valor": 12000.0,
    "estado": "SUBMETIDA",
    "criadaEm": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `SOLICITACAO_ORCAMENTARIA_NAO_ENCONTRADA` | A solicitacao orcamentaria nao foi encontrada. |

---

### 3. Pareceres de Solicitacao

#### `POST /api/v1/m013/solicitacoes-orcamentarias/{solicitacaoId}/parecer`

Aprova ou reprova uma solicitacao orcamentaria.

- **Autorizacao:** `ANALISTA_AGENCIA`, `DIRETOR`
- **Operacao de origem:** `RegistrarParecerSolicitacaoOrcamentaria`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `solicitacaoId` | string | Identificador da solicitacao orcamentaria |

**Request body**

```json
{
  "aprovado": true,
  "justificativa": "Solicitacao aderente ao limite do edital."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `aprovado` | boolean | Sim | Indica se a solicitacao foi aprovada (`true`) ou reprovada (`false`) |
| `justificativa` | string | Sim | Justificativa do parecer |

**Response `200 OK`**

```json
{
  "parecerSolicitacao": {
    "solicitacaoId": "SO-2026-001",
    "aprovado": true,
    "justificativa": "Solicitacao aderente ao limite do edital.",
    "registradoEm": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `SOLICITACAO_ORCAMENTARIA_NAO_ENCONTRADA` | A solicitacao orcamentaria nao foi encontrada para parecer. |
| `422` | `SOLICITACAO_ESTADO_INVALIDO_PARECER` | A solicitacao nao esta em estado valido para receber parecer. |
| `422` | `LIMITE_EDITAL_EXCEDIDO` | O valor total do projeto excede o limite permitido pelo edital. |
| `400` | `PARECER_DADOS_INVALIDOS` | Os dados do parecer nao foram informados corretamente. |

---

### 4. Historico Orcamentario

#### `GET /api/v1/m013/projetos/{projetoId}/historico-orcamentario`

Consulta o historico completo das movimentacoes orcamentarias do projeto.

- **Autorizacao:** `ANALISTA_AGENCIA`, `COORDENADOR`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarHistoricoOrcamentario`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipoMovimentacao` | string | Filtra por tipo: `ADICAO`, `INCLUSAO_RUBRICA`, `REMANEJAMENTO`, `REALOCACAO_BOLSA` |
| `dataInicio` | string (date) | Filtra movimentacoes a partir desta data |
| `dataFim` | string (date) | Filtra movimentacoes ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "data": "2026-04-13",
      "tipoMovimentacao": "REMANEJAMENTO",
      "descricao": "Remanejamento aprovado entre rubricas.",
      "solicitacaoId": "SO-2026-001",
      "valor": 12000.0
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
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado para consulta de historico. |
| `404` | `HISTORICO_ORCAMENTARIO_NAO_ENCONTRADO` | Nenhum historico orcamentario foi encontrado para os filtros informados. |
| `400` | `FILTRO_HISTORICO_ORCAMENTARIO_INVALIDO` | Os filtros informados para historico orcamentario sao invalidos. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m013/projetos/{projetoId}/rubricas` | RegistrarRubricaDoProjeto | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m013/projetos/{projetoId}/rubricas` | ConsultarSaldoPorRubrica (lista) | ANALISTA_AGENCIA, COORDENADOR, MODULO_INTERNO |
| `GET` | `/api/v1/m013/projetos/{projetoId}/rubricas/{rubricaId}` | ConsultarSaldoPorRubrica (detalhe) | ANALISTA_AGENCIA, COORDENADOR, MODULO_INTERNO |
| `POST` | `/api/v1/m013/projetos/{projetoId}/solicitacoes-orcamentarias` | SolicitarMovimentacaoOrcamentaria | COORDENADOR |
| `GET` | `/api/v1/m013/projetos/{projetoId}/solicitacoes-orcamentarias` | ListarSolicitacoesOrcamentarias | ANALISTA_AGENCIA, COORDENADOR |
| `GET` | `/api/v1/m013/solicitacoes-orcamentarias/{solicitacaoId}` | ConsultarSolicitacaoOrcamentaria | ANALISTA_AGENCIA, COORDENADOR |
| `POST` | `/api/v1/m013/solicitacoes-orcamentarias/{solicitacaoId}/parecer` | RegistrarParecerSolicitacaoOrcamentaria | ANALISTA_AGENCIA, DIRETOR |
| `GET` | `/api/v1/m013/projetos/{projetoId}/historico-orcamentario` | ConsultarHistoricoOrcamentario | ANALISTA_AGENCIA, COORDENADOR, MODULO_INTERNO |

---

## Schemas de Dominio (Referencia)

### RubricaProjeto

```json
{
  "id": "string",
  "projetoId": "string",
  "rubricaFinanceiraId": "string",
  "valorAprovado": "number",
  "saldoAtual": "number"
}
```

### SolicitacaoOrcamentaria

```json
{
  "id": "string",
  "projetoId": "string",
  "tipoSolicitacao": "ADICAO | INCLUSAO_RUBRICA | REMANEJAMENTO | REALOCACAO_BOLSA",
  "justificativa": "string",
  "rubricaOrigemId": "string (opcional)",
  "rubricaDestinoId": "string (opcional)",
  "valor": "number",
  "estado": "SUBMETIDA | EM_ANALISE | APROVADA | REPROVADA",
  "criadaEm": "string (YYYY-MM-DD)"
}
```

### ParecerSolicitacao

```json
{
  "solicitacaoId": "string",
  "aprovado": "boolean",
  "justificativa": "string",
  "registradoEm": "string (YYYY-MM-DD)"
}
```

### HistoricoOrcamentario

```json
{
  "data": "string (YYYY-MM-DD)",
  "tipoMovimentacao": "ADICAO | INCLUSAO_RUBRICA | REMANEJAMENTO | REALOCACAO_BOLSA",
  "descricao": "string",
  "solicitacaoId": "string",
  "valor": "number"
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
| EPIC-M013-001 (Adicoes Orcamentarias) | [epics/EPIC-M013-001.md](epics/EPIC-M013-001.md) |
| EPIC-M013-002 (Gestao de Rubricas) | [epics/EPIC-M013-002.md](epics/EPIC-M013-002.md) |
| EPIC-M013-003 (Realocacao de Bolsas) | [epics/EPIC-M013-003.md](epics/EPIC-M013-003.md) |
