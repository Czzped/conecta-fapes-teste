# Contrato de API HTTP — M009 Gestao Bolsa Pesquisa

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M009 como bounded context responsavel pela indicacao, avaliacao documental, formalizacao, implementacao e ciclo de vida de bolsas de pesquisa. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m009
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `BP-2026-001`, `DOC-2026-001`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `COORDENADOR` | Coordenador do Programa — indica bolsistas e acompanha o fluxo |
| `ORIENTADOR` | Orientador do bolsista — registra aceite ou recusa da indicacao |
| `BOLSISTA` | Bolsista — submete documentacao exigida |
| `AREA_TECNICA` | Area Tecnica da Agencia de Fomento — avalia documentacao e formaliza bolsas |
| `MODULO_INTERNO` | Modulo interno autorizado (M004, M015) — acesso restrito a consultas de estado |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "bolsa": "BP-2026-001"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | Bolsa simultanea invalida, periodo duplicado |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido para a operacao solicitada |

---

## Recursos

### 1. Bolsas de Pesquisa

#### `POST /api/v1/m009/bolsas`

Registra a indicacao inicial de um bolsista para uma cota do projeto.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `IndicarBolsista`
- **Idempotencia:** Nao

**Request body**

```json
{
  "projetoId": "PROJ-2026-014",
  "cotaEditalId": "COT-2026-001",
  "coordenadorId": "COD-2026-011",
  "orientadorId": "ORI-2026-004",
  "bolsistaId": "BOL-2026-009",
  "temaPesquisa": "Analise de dados publicos"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `iniciativaId` | string | Sim | Identificador da iniciativa em M003 |
| `cotaBolsaId` | string | Sim | Identificador da cota/oportunidade de bolsa gerenciada no M009 |
| `coordenadorId` | string | Sim | Identificador do coordenador responsavel |
| `orientadorId` | string | Sim | Identificador do orientador do bolsista |
| `bolsistaId` | string | Sim | Identificador do bolsista indicado |
| `temaPesquisa` | string | Sim | Tema de pesquisa da bolsa |

**Response `201 Created`**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "AGUARDANDO_ACEITE_ORIENTADOR"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `BOLSA_DADOS_INVALIDOS` | Os dados obrigatorios da indicacao nao foram informados corretamente. |
| `422` | `COTA_EDITAL_INDISPONIVEL` | A cota do edital nao possui disponibilidade para a indicacao informada. |
| `422` | `BOLSA_SIMULTANEA_NAO_PERMITIDA` | O bolsista nao pode receber mais de uma bolsa do mesmo tipo simultaneamente. |

---

#### `GET /api/v1/m009/bolsas`

Lista e filtra bolsas de pesquisa cadastradas.

- **Autorizacao:** `COORDENADOR`, `AREA_TECNICA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarBolsaPesquisa`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Filtra por projeto |
| `bolsistaId` | string | Filtra por bolsista |
| `estado` | string | Filtra por estado: `AGUARDANDO_ACEITE_ORIENTADOR`, `AGUARDANDO_DOCUMENTOS`, `EM_AVALIACAO_DOCUMENTAL`, `AGUARDANDO_FORMALIZACAO`, `IMPLEMENTADA`, `SUSPENSA`, `ENCERRADA` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "BP-2026-001",
      "estado": "IMPLEMENTADA",
      "projetoId": "PROJ-2026-014",
      "bolsistaId": "BOL-2026-009",
      "temaPesquisa": "Analise de dados publicos"
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
| `400` | `CONSULTA_BOLSA_INVALIDA` | Os filtros informados para consulta da bolsa sao invalidos. |

---

#### `GET /api/v1/m009/bolsas/{codigo}`

Consulta o estado completo de uma bolsa de pesquisa, incluindo documentos, pareceres e historico.

- **Autorizacao:** `COORDENADOR`, `ORIENTADOR`, `BOLSISTA`, `AREA_TECNICA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarBolsaPesquisa`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa (ex: `BP-2026-001`) |

**Response `200 OK`**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "IMPLEMENTADA",
    "projetoId": "PROJ-2026-014",
    "cotaEditalId": "COT-2026-001",
    "coordenadorId": "COD-2026-011",
    "orientadorId": "ORI-2026-004",
    "bolsistaId": "BOL-2026-009",
    "temaPesquisa": "Analise de dados publicos",
    "dataInicioBolsa": "2026-06-01",
    "dataFimBolsa": "2027-05-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | Nenhuma bolsa foi encontrada para o identificador informado. |

---

#### `POST /api/v1/m009/bolsas/{codigo}/cancelar`

Cancela uma indicacao de bolsa ainda nao implementada (US-M009-003).

- **Autorizacao:** `COORDENADOR`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Request body**

```json
{
  "justificativa": "Bolsista desistiu da indicacao."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Motivo do cancelamento da indicacao |

**Response `200 OK`**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "CANCELADA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada para cancelamento. |
| `422` | `BOLSA_NAO_CANCELAVEL` | A bolsa nao pode ser cancelada no estado atual. |

---

### 2. Aceite do Orientador

#### `POST /api/v1/m009/bolsas/{codigo}/aceite-orientador`

Registra o aceite ou recusa do orientador sobre a indicacao da bolsa.

- **Autorizacao:** `ORIENTADOR`
- **Operacao de origem:** `RegistrarAceiteDoOrientador`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Request body**

```json
{
  "aceito": true,
  "justificativa": null
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `aceito` | boolean | Sim | `true` para aceitar, `false` para recusar |
| `justificativa` | string | Condicional | Obrigatorio quando `aceito` for `false` |

**Response `200 OK`**

```json
{
  "termoAceite": {
    "aceito": true,
    "bolsaCodigo": "BP-2026-001"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada para aceite do orientador. |
| `422` | `BOLSA_ESTADO_INVALIDO_ACEITE` | A bolsa nao esta aguardando aceite do orientador. |
| `422` | `RECUSA_SEM_JUSTIFICATIVA` | E obrigatorio informar justificativa quando o orientador recusa a indicacao. |

---

### 3. Documentacao da Bolsa

#### `POST /api/v1/m009/bolsas/{codigo}/documentos`

Registra o envio de documentos da bolsa apos aceite do orientador.

- **Autorizacao:** `BOLSISTA`
- **Operacao de origem:** `SubmeterDocumentacaoDaBolsa`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Request body**

```json
{
  "documentos": [
    {
      "nome": "Comprovante de matricula",
      "tipo": "MATRICULA",
      "url": "https://docs.exemplo.br/matricula.pdf"
    }
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `documentos` | array | Sim | Lista de documentos a submeter |
| `documentos[].nome` | string | Sim | Nome descritivo do documento |
| `documentos[].tipo` | string (enum) | Sim | Tipo do documento: `MATRICULA`, `IDENTIDADE`, `COMPROVANTE_RESIDENCIA`, `HISTORICO`, `OUTRO` |
| `documentos[].url` | string (url) | Sim | URL de acesso ao documento |

**Response `201 Created`**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "AGUARDANDO_DOCUMENTOS",
    "documentosRegistrados": 1
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada para submissao de documentos. |
| `422` | `ACEITE_ORIENTADOR_PENDENTE` | O orientador ainda nao concluiu o aceite da indicacao. |
| `400` | `DOCUMENTO_BOLSA_INVALIDO` | Um ou mais documentos enviados sao invalidos ou obrigatorios nao foram anexados. |

---

#### `GET /api/v1/m009/bolsas/{codigo}/documentos`

Lista os documentos submetidos para uma bolsa de pesquisa.

- **Autorizacao:** `BOLSISTA`, `AREA_TECNICA`, `COORDENADOR`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Response `200 OK`**

```json
{
  "bolsaCodigo": "BP-2026-001",
  "documentos": [
    {
      "id": "DOC-2026-001",
      "nome": "Comprovante de matricula",
      "tipo": "MATRICULA",
      "url": "https://docs.exemplo.br/matricula.pdf"
    }
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada. |

---

### 4. Avaliacao Documental

#### `POST /api/v1/m009/bolsas/{codigo}/parecer-documental`

Emite parecer de aprovacao ou reprovacao da documentacao da bolsa.

- **Autorizacao:** `AREA_TECNICA`
- **Operacao de origem:** `AvaliarDocumentacaoDaBolsa`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Request body**

```json
{
  "aprovado": true,
  "justificativa": "Documentacao completa e valida."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `aprovado` | boolean | Sim | `true` para aprovar, `false` para reprovar e solicitar reenvio |
| `justificativa` | string | Condicional | Obrigatorio quando `aprovado` for `false` |

**Response `200 OK`**

```json
{
  "parecerAvaliacao": {
    "aprovado": true,
    "bolsaCodigo": "BP-2026-001"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada para avaliacao documental. |
| `422` | `DOCUMENTACAO_NAO_SUBMETIDA` | Nao existe documentacao submetida para a bolsa informada. |
| `422` | `PARECER_DOCUMENTAL_INVALIDO` | O parecer informado e inconsistente com os documentos da bolsa. |

---

### 5. Formalizacao e Implementacao

#### `POST /api/v1/m009/bolsas/{codigo}/implementar`

Registra assinaturas, publicacao no Diario Oficial e implementa a bolsa.

- **Autorizacao:** `AREA_TECNICA`
- **Operacao de origem:** `FormalizarEImplementarBolsa`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Request body**

```json
{
  "dataInicioBolsa": "2026-06-01",
  "dataFimBolsa": "2027-05-31",
  "numeroDiario": "1234"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `dataInicioBolsa` | string (date) | Sim | Data de inicio da vigencia da bolsa |
| `dataFimBolsa` | string (date) | Sim | Data de fim da vigencia da bolsa |
| `numeroDiario` | string | Sim | Numero de publicacao no Diario Oficial |

**Response `200 OK`**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "IMPLEMENTADA",
    "dataInicioBolsa": "2026-06-01",
    "dataFimBolsa": "2027-05-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada para implementacao. |
| `422` | `DOCUMENTACAO_NAO_APROVADA` | A documentacao da bolsa nao foi aprovada pela Area Tecnica. |
| `422` | `ASSINATURA_PENDENTE` | A bolsa ainda possui assinaturas pendentes para formalizacao. |
| `422` | `PUBLICACAO_DIARIO_OBRIGATORIA` | E obrigatoria a publicacao no Diario Oficial antes da implementacao da bolsa. |
| `400` | `VIGENCIA_BOLSA_INVALIDA` | As datas de inicio e fim da bolsa sao invalidas. |

---

### 6. Ciclo de Vida da Bolsa

#### `POST /api/v1/m009/bolsas/{codigo}/renovar`

Inicia o processo de renovacao de uma bolsa implementada (US-M009-012).

- **Autorizacao:** `COORDENADOR`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Request body**

```json
{
  "novaDataFim": "2028-05-31",
  "justificativa": "Continuidade da pesquisa conforme cronograma do programa."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `novaDataFim` | string (date) | Sim | Nova data de fim da vigencia apos renovacao |
| `justificativa` | string | Sim | Justificativa da solicitacao de renovacao |

**Response `200 OK`**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "AGUARDANDO_DOCUMENTOS"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada para renovacao. |
| `422` | `BOLSA_NAO_RENOVAVEL` | A bolsa nao esta em estado que permite renovacao. |

---

#### `POST /api/v1/m009/bolsas/{codigo}/suspender`

Suspende uma bolsa implementada (US-M009-013).

- **Autorizacao:** `AREA_TECNICA`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Request body**

```json
{
  "motivo": "Descumprimento de requisitos academicos.",
  "dataEfetivacao": "2026-09-01"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `motivo` | string | Sim | Motivo da suspensao |
| `dataEfetivacao` | string (date) | Sim | Data a partir da qual a suspensao e efetiva |

**Response `200 OK`**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "SUSPENSA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada para suspensao. |
| `422` | `BOLSA_NAO_SUSPENDIVEL` | A bolsa nao esta em estado que permite suspensao. |

---

#### `POST /api/v1/m009/bolsas/{codigo}/reativar`

Reativa uma bolsa suspensa mediante nova avaliacao (US-M009-014).

- **Autorizacao:** `AREA_TECNICA`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Request body**

```json
{
  "justificativa": "Pendencias sanadas. Bolsa apta para reativacao."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Justificativa para reativacao da bolsa |

**Response `200 OK`**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "IMPLEMENTADA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada para reativacao. |
| `422` | `BOLSA_NAO_REATIVAVEL` | Somente bolsas suspensas podem ser reativadas. |

---

#### `POST /api/v1/m009/bolsas/{codigo}/encerrar`

Encerra uma bolsa de pesquisa (US-M009-015).

- **Autorizacao:** `AREA_TECNICA`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da bolsa de pesquisa |

**Request body**

```json
{
  "motivoEncerramento": "CONCLUSAO",
  "dataEncerramento": "2027-05-31",
  "observacao": "Bolsista concluiu o programa com exito."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `motivoEncerramento` | string (enum) | Sim | Um de: `CONCLUSAO`, `DESISTENCIA`, `CORTE_RECURSOS`, `DESCUMPRIMENTO` |
| `dataEncerramento` | string (date) | Sim | Data efetiva do encerramento |
| `observacao` | string | Nao | Observacoes complementares |

**Response `200 OK`**

```json
{
  "bolsaPesquisa": {
    "codigo": "BP-2026-001",
    "estado": "ENCERRADA",
    "motivoEncerramento": "CONCLUSAO"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BOLSA_NAO_ENCONTRADA` | A bolsa informada nao foi encontrada para encerramento. |
| `422` | `BOLSA_NAO_ENCERRAVEL` | A bolsa nao esta em estado que permite encerramento. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m009/bolsas` | IndicarBolsista | COORDENADOR |
| `GET` | `/api/v1/m009/bolsas` | ListarBolsas | COORDENADOR, AREA_TECNICA, MODULO_INTERNO |
| `GET` | `/api/v1/m009/bolsas/{codigo}` | ConsultarBolsaPesquisa | COORDENADOR, ORIENTADOR, BOLSISTA, AREA_TECNICA, MODULO_INTERNO |
| `POST` | `/api/v1/m009/bolsas/{codigo}/cancelar` | CancelarIndicacao | COORDENADOR |
| `POST` | `/api/v1/m009/bolsas/{codigo}/aceite-orientador` | RegistrarAceiteDoOrientador | ORIENTADOR |
| `POST` | `/api/v1/m009/bolsas/{codigo}/documentos` | SubmeterDocumentacaoDaBolsa | BOLSISTA |
| `GET` | `/api/v1/m009/bolsas/{codigo}/documentos` | ListarDocumentosDaBolsa | BOLSISTA, AREA_TECNICA, COORDENADOR |
| `POST` | `/api/v1/m009/bolsas/{codigo}/parecer-documental` | AvaliarDocumentacaoDaBolsa | AREA_TECNICA |
| `POST` | `/api/v1/m009/bolsas/{codigo}/implementar` | FormalizarEImplementarBolsa | AREA_TECNICA |
| `POST` | `/api/v1/m009/bolsas/{codigo}/renovar` | RenovarBolsa | COORDENADOR |
| `POST` | `/api/v1/m009/bolsas/{codigo}/suspender` | SuspenderBolsa | AREA_TECNICA |
| `POST` | `/api/v1/m009/bolsas/{codigo}/reativar` | ReativarBolsa | AREA_TECNICA |
| `POST` | `/api/v1/m009/bolsas/{codigo}/encerrar` | EncerrarBolsa | AREA_TECNICA |

---

## Schemas de Dominio (Referencia)

### BolsaPesquisa

```json
{
  "codigo": "string (ex: BP-2026-001)",
  "estado": "AGUARDANDO_ACEITE_ORIENTADOR | AGUARDANDO_DOCUMENTOS | EM_AVALIACAO_DOCUMENTAL | AGUARDANDO_FORMALIZACAO | IMPLEMENTADA | SUSPENSA | ENCERRADA | CANCELADA",
  "projetoId": "string",
  "cotaEditalId": "string",
  "coordenadorId": "string",
  "orientadorId": "string",
  "bolsistaId": "string",
  "temaPesquisa": "string",
  "dataInicioBolsa": "string (YYYY-MM-DD) | null",
  "dataFimBolsa": "string (YYYY-MM-DD) | null"
}
```

### TermoAceite

```json
{
  "bolsaCodigo": "string",
  "aceito": "boolean",
  "justificativa": "string | null"
}
```

### DocumentoBolsa

```json
{
  "id": "string",
  "nome": "string",
  "tipo": "MATRICULA | IDENTIDADE | COMPROVANTE_RESIDENCIA | HISTORICO | OUTRO",
  "url": "string (url)"
}
```

### ParecerAvaliacao

```json
{
  "bolsaCodigo": "string",
  "aprovado": "boolean",
  "justificativa": "string | null"
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
| EPIC-M009-001 (Indicacao de Bolsista) | [epics/EPIC-M009-001.md](epics/EPIC-M009-001.md) |
| EPIC-M009-002 (Avaliacao Documental) | [epics/EPIC-M009-002.md](epics/EPIC-M009-002.md) |
| EPIC-M009-003 (Formalizacao e Implementacao) | [epics/EPIC-M009-003.md](epics/EPIC-M009-003.md) |
| EPIC-M009-004 (Ciclo de Vida da Bolsa) | [epics/EPIC-M009-004.md](epics/EPIC-M009-004.md) |
