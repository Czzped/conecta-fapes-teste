# Contrato de API HTTP — M004 Pagamento de Bolsistas

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

> **Nota sobre implementacao atual:** A implementacao em producao utiliza controllers genericos do framework (`BaseCrudController`, `BaseController`) com endpoints no padrao `/api/{entidade}` (ex: `/api/planoMensal`, `/api/folha`). Os endpoints `/api/v1/m004/...` descritos abaixo representam o **design target** para a evolucao da API com versionamento e agrupamento por modulo. Consulte [contrato.md](contrato.md) para o mapeamento atual.

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M004 como bounded context responsavel pelo calendario mensal, decisao de liberacao, geracao de folhas, bonus de pagamento, remessas bancarias, retornos, guias de liberacao, relatorios e acompanhamento do pagamento de bolsistas. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m004
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Formato de competencia | `YYYY-MM` (ano e mes) |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `FOL-2026-05-01`, `COMP-2026-05`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `GERENTE_GEPOF` | Gerente GEPOF — define marcos mensais, gera folhas e acompanha remessas |
| `AREA_TECNICA` | Area Tecnica — decide a liberacao de editais por competencia |
| `DIRETOR` | Diretor autorizado — decide sobre autorizacao de folhas |
| `SISTEMA` | Job ou processo interno autorizado — acesso restrito a geracao de remessa bancaria |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "competencia": "2026-05"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Competencia, folha ou edital nao encontrado |
| `409 Conflict` | Conflito de estado | Folha anterior pendente, edital ja incluido em folha |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Datas fora da janela, sequencia invalida, cancelamento nao permitido |

---

## Recursos

### 1. Plano Mensal

#### `POST /api/v1/m004/plano-mensal`

Define os marcos M1, M2 e M3 da competencia.

- **Autorizacao:** `GERENTE_GEPOF`
- **Operacao de origem:** `ConfigurarPlanoMensalDeFolhas`
- **Idempotencia:** Nao

**Request body**

```json
{
  "competencia": "2026-05",
  "marcoSolicitacao": "2026-05-05",
  "marcoGeracaoFolha": "2026-05-12",
  "marcoPagamento": "2026-05-20"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `competencia` | string (`YYYY-MM`) | Sim | Mes de competencia do plano |
| `marcoSolicitacao` | string (date) | Sim | Data limite de solicitacao de bolsas (M1) |
| `marcoGeracaoFolha` | string (date) | Sim | Data prevista de geracao da folha normal (M2) |
| `marcoPagamento` | string (date) | Sim | Data de pagamento da folha normal (M3) |

**Response `201 Created`**

```json
{
  "planoMensal": {
    "competencia": "2026-05",
    "marcoSolicitacao": "2026-05-05",
    "marcoGeracaoFolha": "2026-05-12",
    "marcoPagamento": "2026-05-20",
    "ehAtual": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `MARCO_PLANO_INVALIDO` | Os marcos informados para a competencia nao respeitam as janelas permitidas. |
| `422` | `SEQUENCIA_MARCOS_INVALIDA` | O marco M1 deve ocorrer antes de M2, e M2 antes de M3. |

---

#### `GET /api/v1/m004/plano-mensal`

Lista os planos mensais cadastrados.

- **Autorizacao:** `GERENTE_GEPOF`, `AREA_TECNICA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `competencia` | string | Filtra por competencia especifica (`YYYY-MM`) |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "competencia": "2026-05",
      "marcoSolicitacao": "2026-05-05",
      "marcoGeracaoFolha": "2026-05-12",
      "marcoPagamento": "2026-05-20",
      "ehAtual": true
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `PUT /api/v1/m004/plano-mensal/{competencia}`

Atualiza os marcos de uma competencia existente.

- **Autorizacao:** `GERENTE_GEPOF`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `competencia` | string | Competencia no formato `YYYY-MM` |

**Request body**

```json
{
  "marcoSolicitacao": "2026-05-06",
  "marcoGeracaoFolha": "2026-05-13",
  "marcoPagamento": "2026-05-21"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `marcoSolicitacao` | string (date) | Nao | Nova data de marco M1 |
| `marcoGeracaoFolha` | string (date) | Nao | Nova data de marco M2 |
| `marcoPagamento` | string (date) | Nao | Nova data de marco M3 |

**Response `200 OK`**

```json
{
  "planoMensal": {
    "competencia": "2026-05",
    "marcoSolicitacao": "2026-05-06",
    "marcoGeracaoFolha": "2026-05-13",
    "marcoPagamento": "2026-05-21"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PLANO_MENSAL_NAO_ENCONTRADO` | O plano mensal para a competencia informada nao foi encontrado. |
| `422` | `MARCO_PLANO_INVALIDO` | Os marcos informados nao respeitam as regras de edicao permitidas. |
| `422` | `SEQUENCIA_MARCOS_INVALIDA` | A sequencia dos marcos informados e invalida. |

---

### 2. Editais por Competencia

#### `POST /api/v1/m004/competencias/{competencia}/editais/{editalId}/decisao-liberacao`

Libera ou nao libera um edital para a competencia.

- **Autorizacao:** `AREA_TECNICA`
- **Operacao de origem:** `RegistrarDecisaoDeLiberacaoDoEditalCompetencia`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `competencia` | string | Competencia no formato `YYYY-MM` |
| `editalId` | string | Identificador do edital (ex: `EDT-2026-001`) |

**Request body**

```json
{
  "ehLiberado": true,
  "justificativa": null
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `ehLiberado` | boolean | Sim | `true` para liberar, `false` para nao liberar |
| `justificativa` | string | Condicional | Obrigatoria quando `ehLiberado=false` |

**Response `200 OK`**

```json
{
  "editalCompetencia": {
    "editalId": "EDT-2026-001",
    "competencia": "2026-05",
    "status": "LIBERADO",
    "decisao": {
      "usuario": "area.tecnica@agencia.gov.br",
      "horario": "2026-05-07T10:30:00Z",
      "ehLiberado": true,
      "justificativa": null
    }
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_COMPETENCIA_NAO_ENCONTRADO` | O edital nao foi encontrado para a competencia informada. |
| `422` | `PRAZO_LIBERACAO_INVALIDO` | Ainda nao e permitido decidir a liberacao do edital para esta competencia. |
| `409` | `EDITAL_COMPETENCIA_BLOQUEADO` | O edital ja foi incluido em folha e nao pode mais ter a decisao alterada. |
| `400` | `DECISAO_LIBERACAO_INVALIDA` | A decisao de liberacao informada e invalida ou esta incompleta. |

---

#### `GET /api/v1/m004/competencias/{competencia}/editais`

Lista os editais e suas decisoes de liberacao para uma competencia.

- **Autorizacao:** `GERENTE_GEPOF`, `AREA_TECNICA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `competencia` | string | Competencia no formato `YYYY-MM` |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `status` | string | Filtra por status: `SEM_DECISAO`, `LIBERADO`, `NAO_LIBERADO`, `INCLUIDO_EM_FOLHA` |
| `areaTecnicaId` | string | Filtra pela area tecnica responsavel |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "competencia": "2026-05",
  "items": [
    {
      "editalId": "EDT-2026-001",
      "areaTecnicaId": "AT-DGPP-01",
      "status": "LIBERADO"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

### 3. Folhas de Pagamento

#### `POST /api/v1/m004/folhas`

Gera folha normal ou complementar para a competencia.

- **Autorizacao:** `GERENTE_GEPOF`
- **Operacao de origem:** `GerarFolhaDePagamento`
- **Idempotencia:** Nao

**Request body**

```json
{
  "competencia": "2026-05",
  "tipoFolha": "NORMAL",
  "dataPagamento": "2026-05-20"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `competencia` | string (`YYYY-MM`) | Sim | Competencia da folha |
| `tipoFolha` | string (enum) | Sim | `NORMAL` ou `COMPLEMENTAR` |
| `dataPagamento` | string (date) | Sim | Data de pagamento; para `NORMAL` deve corresponder a M3; para `COMPLEMENTAR` e livre |

**Response `201 Created`**

```json
{
  "folha": {
    "id": "FOL-2026-05-01",
    "competencia": "2026-05",
    "tipoFolha": "NORMAL",
    "dataPagamento": "2026-05-20",
    "status": "GERADA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `DATA_PAGAMENTO_INVALIDA` | A data de pagamento informada e invalida para o tipo de folha solicitado. |
| `409` | `FOLHA_ANTERIOR_PENDENTE` | Nao e possivel gerar nova folha enquanto a ultima estiver gerada e sem decisao final. |
| `422` | `MARCO_GERACAO_NAO_ATINGIDO` | O marco M2 ainda nao foi atingido para gerar a folha da competencia informada. |

---

#### `GET /api/v1/m004/folhas`

Consulta folhas, decisoes e remessas de uma competencia.

- **Autorizacao:** `GERENTE_GEPOF`, `AREA_TECNICA`
- **Operacao de origem:** `ConsultarFolhasDaCompetencia`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `competencia` | string | Filtra por competencia (`YYYY-MM`) |
| `editalId` | string | Filtra por edital incluido na folha |
| `status` | string | Filtra por status: `GERADA`, `AUTORIZADA`, `REJEITADA`, `CANCELADA` |
| `tipoFolha` | string | Filtra por tipo: `NORMAL`, `COMPLEMENTAR` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "FOL-2026-05-01",
      "competencia": "2026-05",
      "tipoFolha": "NORMAL",
      "dataPagamento": "2026-05-20",
      "status": "AUTORIZADA"
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
| `400` | `FILTRO_FOLHA_INVALIDO` | Os filtros informados para consulta de folhas sao invalidos. |

---

#### `GET /api/v1/m004/folhas/{id}`

Consulta o detalhe de uma folha especifica.

- **Autorizacao:** `GERENTE_GEPOF`, `AREA_TECNICA`, `DIRETOR`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da folha (ex: `FOL-2026-05-01`) |

**Response `200 OK`**

```json
{
  "folha": {
    "id": "FOL-2026-05-01",
    "competencia": "2026-05",
    "tipoFolha": "NORMAL",
    "dataPagamento": "2026-05-20",
    "status": "AUTORIZADA",
    "totalPagamentos": 48,
    "decisoes": [
      {
        "tipoAcao": "AUTORIZAR",
        "usuario": "diraf@agencia.gov.br",
        "horario": "2026-05-15T09:00:00Z",
        "justificativa": "Folha validada para envio bancario."
      }
    ]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `FOLHA_NAO_ENCONTRADA` | Nenhuma folha foi encontrada para o identificador informado. |

---

#### `POST /api/v1/m004/folhas/{id}/cancelar`

Cancela uma folha gerada antes do M2 do mes seguinte.

- **Autorizacao:** `GERENTE_GEPOF`
- **Operacao de origem:** `RegistrarDecisaoSobreFolha` (tipoAcao=CANCELAR)
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da folha |

**Request body**

```json
{
  "justificativa": "Necessidade de revisao dos editais liberados."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Nao | Motivo do cancelamento |

**Response `200 OK`**

```json
{
  "folha": {
    "id": "FOL-2026-05-01",
    "status": "CANCELADA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `FOLHA_NAO_ENCONTRADA` | A folha informada nao foi encontrada. |
| `422` | `CANCELAMENTO_FOLHA_NAO_PERMITIDO` | A folha nao pode mais ser cancelada no momento informado. |
| `422` | `ACAO_FOLHA_INVALIDA` | A acao solicitada nao pode ser aplicada ao estado atual da folha. |

---

#### `POST /api/v1/m004/folhas/{id}/autorizar`

Autoriza uma folha gerada para envio bancario.

- **Autorizacao:** `DIRETOR`, `GERENTE_GEPOF`
- **Operacao de origem:** `RegistrarDecisaoSobreFolha` (tipoAcao=AUTORIZAR)
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da folha |

**Request body**

```json
{
  "justificativa": "Folha validada para envio bancario."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Nao | Observacao da decisao de autorizacao |

**Response `200 OK`**

```json
{
  "folha": {
    "id": "FOL-2026-05-01",
    "status": "AUTORIZADA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `FOLHA_NAO_ENCONTRADA` | A folha informada nao foi encontrada. |
| `422` | `ACAO_FOLHA_INVALIDA` | A acao solicitada nao pode ser aplicada ao estado atual da folha. |

---

#### `POST /api/v1/m004/folhas/{id}/rejeitar`

Rejeita uma folha gerada, retornando os pagamentos ao status `ALOCADO`.

- **Autorizacao:** `DIRETOR`, `GERENTE_GEPOF`
- **Operacao de origem:** `RegistrarDecisaoSobreFolha` (tipoAcao=REJEITAR)
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da folha |

**Request body**

```json
{
  "justificativa": "Divergencia encontrada nos valores de bolsa."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Motivo da rejeicao |

**Response `200 OK`**

```json
{
  "folha": {
    "id": "FOL-2026-05-01",
    "status": "REJEITADA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `FOLHA_NAO_ENCONTRADA` | A folha informada nao foi encontrada. |
| `422` | `ACAO_FOLHA_INVALIDA` | A acao solicitada nao pode ser aplicada ao estado atual da folha. |

---

### 4. Remessas Bancarias

#### `POST /api/v1/m004/folhas/{id}/remessas`

Prepara e envia remessa de cadastro ou pagamento ao banco. Operacao assincrona.

- **Autorizacao:** `SISTEMA`, `GERENTE_GEPOF`
- **Operacao de origem:** `GerarRemessaBancaria`
- **Idempotencia:** Sim por folha e tipo de remessa

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da folha |

**Request body**

```json
{
  "tipoRemessa": "PAGAMENTO"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `tipoRemessa` | string (enum) | Sim | Um de: `CADASTRO`, `PAGAMENTO` |

**Response `201 Created`**

```json
{
  "remessa": {
    "numero": 1042,
    "folhaId": "FOL-2026-05-01",
    "tipoRemessa": "PAGAMENTO",
    "status": "ENVIADA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `FOLHA_NAO_ENCONTRADA` | A folha informada nao foi encontrada. |
| `422` | `FOLHA_NAO_AUTORIZADA` | Somente folhas autorizadas podem gerar remessa de pagamento. |
| `502` | `REMESSA_BANCARIA_INDISPONIVEL` | Nao foi possivel enviar a remessa para o banco neste momento. |

---

#### `GET /api/v1/m004/folhas/{id}/remessas`

Lista as remessas bancarias de uma folha.

- **Autorizacao:** `GERENTE_GEPOF`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da folha |

**Response `200 OK`**

```json
{
  "items": [
    {
      "numero": 1042,
      "tipoRemessa": "PAGAMENTO",
      "status": "ENVIADA",
      "dataEnvio": "2026-05-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `FOLHA_NAO_ENCONTRADA` | A folha informada nao foi encontrada. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m004/plano-mensal` | ConfigurarPlanoMensalDeFolhas | GERENTE_GEPOF |
| `GET` | `/api/v1/m004/plano-mensal` | ListarPlanosMensais | GERENTE_GEPOF, AREA_TECNICA |
| `PUT` | `/api/v1/m004/plano-mensal/{competencia}` | AtualizarPlanoMensal | GERENTE_GEPOF |
| `POST` | `/api/v1/m004/competencias/{competencia}/editais/{editalId}/decisao-liberacao` | RegistrarDecisaoDeLiberacaoDoEditalCompetencia | AREA_TECNICA |
| `GET` | `/api/v1/m004/competencias/{competencia}/editais` | ListarEditaisDaCompetencia | GERENTE_GEPOF, AREA_TECNICA |
| `POST` | `/api/v1/m004/folhas` | GerarFolhaDePagamento | GERENTE_GEPOF |
| `GET` | `/api/v1/m004/folhas` | ConsultarFolhasDaCompetencia | GERENTE_GEPOF, AREA_TECNICA |
| `GET` | `/api/v1/m004/folhas/{id}` | ConsultarFolha | GERENTE_GEPOF, AREA_TECNICA, DIRETOR |
| `POST` | `/api/v1/m004/folhas/{id}/cancelar` | CancelarFolha | GERENTE_GEPOF |
| `POST` | `/api/v1/m004/folhas/{id}/autorizar` | AutorizarFolha | DIRETOR, GERENTE_GEPOF |
| `POST` | `/api/v1/m004/folhas/{id}/rejeitar` | RejeitarFolha | DIRETOR, GERENTE_GEPOF |
| `POST` | `/api/v1/m004/folhas/{id}/remessas` | GerarRemessaBancaria | SISTEMA, GERENTE_GEPOF |
| `GET` | `/api/v1/m004/folhas/{id}/remessas` | ListarRemessasDaFolha | GERENTE_GEPOF |

---

## Schemas de Dominio (Referencia)

### PlanoMensal

```json
{
  "competencia": "string (YYYY-MM)",
  "marcoSolicitacao": "string (YYYY-MM-DD)",
  "marcoGeracaoFolha": "string (YYYY-MM-DD)",
  "marcoPagamento": "string (YYYY-MM-DD)",
  "ehAtual": "boolean"
}
```

### EditalCompetencia

```json
{
  "editalId": "string",
  "competencia": "string (YYYY-MM)",
  "status": "SEM_DECISAO | LIBERADO | NAO_LIBERADO | INCLUIDO_EM_FOLHA"
}
```

### DecisaoLiberacao

```json
{
  "editalId": "string",
  "competencia": "string (YYYY-MM)",
  "ehLiberado": "boolean",
  "usuario": "string",
  "horario": "string (ISO 8601)",
  "justificativa": "string | null"
}
```

### Folha

```json
{
  "id": "string",
  "competencia": "string (YYYY-MM)",
  "tipoFolha": "NORMAL | COMPLEMENTAR",
  "dataPagamento": "string (YYYY-MM-DD)",
  "status": "GERADA | AUTORIZADA | REJEITADA | CANCELADA",
  "totalPagamentos": "integer"
}
```

### DecisaoFolha

```json
{
  "tipoAcao": "GERAR | CANCELAR | AUTORIZAR | REJEITAR",
  "usuario": "string",
  "horario": "string (ISO 8601)",
  "justificativa": "string | null"
}
```

### Remessa

```json
{
  "numero": "integer",
  "folhaId": "string",
  "tipoRemessa": "CADASTRO | PAGAMENTO",
  "status": "PENDENTE | ENVIADA | CONFIRMADA | FALHOU",
  "dataEnvio": "string (ISO 8601) | null"
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
| EPIC-M004-001 (Definir Calendario das Folhas) | [epics/EPIC-M004-001.md](epics/EPIC-M004-001.md) |
| EPIC-M004-002 (Liberar Editais da Area para Pagamento) | [epics/EPIC-M004-002.md](epics/EPIC-M004-002.md) |
| EPIC-M004-003 (Gerenciar Folhas de Pagamento) | [epics/EPIC-M004-003.md](epics/EPIC-M004-003.md) |
| EPIC-M004-004 (Autorizar Pagamento da Folha) | [epics/EPIC-M004-004.md](epics/EPIC-M004-004.md) |
