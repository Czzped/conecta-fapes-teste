# Contrato de API HTTP — M014 Prestacao de Contas

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M014 como bounded context responsavel pela prestacao de contas do projeto, incluindo documentos fiscais, importacoes de integracao, analise, contestacao e consulta do processo. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m014
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `PC-2026-013`, `DOCF-2026-021`, `EXT-2026-005`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `COORDENADOR` | Coordenador do projeto — registra documentos, submete e contesta prestacoes |
| `ANALISTA_AGENCIA` | Area Tecnica da Agencia de Fomento — emite pareceres e acompanha analise |
| `SECONT` | Controladora Estadual — solicita documentos e realiza auditoria |
| `MODULO_INTERNO` | Modulo interno autorizado (M015) — consulta pendencias |

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
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido, arquivo invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | Prestacao ja submetida, extrato ja importado |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Prazo expirado, prestacao anterior pendente, limite de rubrica excedido |

---

## Recursos

### 1. Prestacoes de Contas

#### `GET /api/v1/m014/projetos/{projetoId}/prestacoes-contas`

Lista as prestacoes de contas do projeto.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`, `SECONT`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarPrestacaoContas`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra pelo estado: `EM_ELABORACAO`, `SUBMETIDA`, `EM_ANALISE`, `APROVADA`, `REJEITADA` |
| `periodoReferencia` | string | Filtra pelo periodo (ex: `2026-S1`) |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "PC-2026-013",
      "projetoId": "PROJ-2026-014",
      "periodoReferencia": "2026-S1",
      "estado": "SUBMETIDA",
      "documentosFiscais": 8,
      "extratosImportados": 1
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
| `400` | `FILTRO_PRESTACAO_INVALIDO` | Os filtros informados para consulta da prestacao de contas sao invalidos. |

---

#### `GET /api/v1/m014/prestacoes-contas/{prestacaoId}`

Consulta o detalhe de uma prestacao de contas.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`, `SECONT`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarPrestacaoContas`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `prestacaoId` | string | Identificador da prestacao de contas (ex: `PC-2026-013`) |

**Response `200 OK`**

```json
{
  "prestacaoContas": {
    "id": "PC-2026-013",
    "projetoId": "PROJ-2026-014",
    "periodoReferencia": "2026-S1",
    "estado": "SUBMETIDA",
    "documentosFiscais": 8,
    "extratosImportados": 1,
    "submetidaEm": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | Nenhuma prestacao de contas foi encontrada para o identificador informado. |

---

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/submeter`

Submete a prestacao de contas para analise da Area Tecnica.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `SubmeterPrestacaoContas`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `prestacaoId` | string | Identificador da prestacao de contas |

**Request body**

```json
{
  "periodoReferencia": "2026-S1",
  "declaracaoFinal": true
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `periodoReferencia` | string | Sim | Periodo de referencia da prestacao (ex: `2026-S1`) |
| `declaracaoFinal` | boolean | Sim | Declaracao do coordenador de que as informacoes sao verdadeiras |

**Response `200 OK`**

```json
{
  "prestacaoContas": {
    "id": "PC-2026-013",
    "estado": "SUBMETIDA",
    "submetidaEm": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `422` | `PRESTACAO_ANTERIOR_PENDENTE` | Existem prestacoes anteriores pendentes para o projeto informado. |
| `422` | `LIMITE_RUBRICA_EXCEDIDO` | A soma dos documentos fiscais excede o saldo aprovado da rubrica. |
| `422` | `PRAZO_SUBMISSAO_EXPIRADO` | O prazo de 30 dias para submeter a prestacao de contas expirou. |
| `409` | `PRESTACAO_JA_SUBMETIDA` | A prestacao de contas ja foi submetida anteriormente. |

---

### 2. Documentos Fiscais

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/documentos-fiscais`

Registra um documento fiscal vinculado a uma rubrica do projeto.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `RegistrarDocumentoFiscal`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `prestacaoId` | string | Identificador da prestacao de contas |

**Request body**

```json
{
  "rubricaProjetoId": "RP-2026-004",
  "tipoDocumento": "NOTA_FISCAL",
  "valor": 2500.0,
  "url": "https://docs.exemplo.br/nf-001.pdf"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `rubricaProjetoId` | string | Sim | Identificador da rubrica do projeto a qual o documento se refere |
| `tipoDocumento` | string (enum) | Sim | Um de: `NOTA_FISCAL`, `RECIBO`, `BILHETE_AEREO`, `COMPROVANTE_DIARIA`, `OUTRO` |
| `valor` | number | Sim | Valor do documento fiscal |
| `url` | string (url) | Sim | URL do documento digitalizado |

**Response `201 Created`**

```json
{
  "documentoFiscal": {
    "id": "DOCF-2026-021",
    "prestacaoId": "PC-2026-013",
    "rubricaProjetoId": "RP-2026-004",
    "tipoDocumento": "NOTA_FISCAL",
    "valor": 2500.0,
    "status": "PENDENTE_ANALISE"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `422` | `RUBRICA_PROJETO_INVALIDA` | A rubrica informada nao pode receber o documento fiscal. |
| `422` | `PRESTACAO_ESTADO_INVALIDO` | Nao e possivel registrar documentos em uma prestacao ja submetida ou aprovada. |
| `400` | `DOCUMENTO_FISCAL_INVALIDO` | O documento fiscal informado nao possui dados validos para registro. |

---

#### `GET /api/v1/m014/prestacoes-contas/{prestacaoId}/documentos-fiscais`

Lista os documentos fiscais de uma prestacao de contas.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`, `SECONT`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `prestacaoId` | string | Identificador da prestacao de contas |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipoDocumento` | string | Filtra por tipo de documento |
| `rubricaProjetoId` | string | Filtra por rubrica do projeto |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "DOCF-2026-021",
      "rubricaProjetoId": "RP-2026-004",
      "tipoDocumento": "NOTA_FISCAL",
      "valor": 2500.0,
      "status": "PENDENTE_ANALISE",
      "url": "https://docs.exemplo.br/nf-001.pdf"
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
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |

---

#### `DELETE /api/v1/m014/prestacoes-contas/{prestacaoId}/documentos-fiscais/{documentoId}`

Remove um documento fiscal de uma prestacao ainda nao submetida.

- **Autorizacao:** `COORDENADOR`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `prestacaoId` | string | Identificador da prestacao de contas |
| `documentoId` | string | Identificador do documento fiscal |

**Response `204 No Content`**

Sem corpo na resposta.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `404` | `DOCUMENTO_FISCAL_NAO_ENCONTRADO` | O documento fiscal informado nao foi encontrado. |
| `422` | `PRESTACAO_ESTADO_INVALIDO` | Nao e possivel remover documentos de uma prestacao ja submetida ou aprovada. |

---

### 3. Importacoes de Integracao

As importacoes de projeto/dados bancarios, orcamento planejado SIGFAPES e movimentos bancarios CNAB 240 sao executadas por jobs internos. Nao ha endpoint publico para upload manual de arquivo bancario por Coordenador ou Analista.

| Job | Origem | Idempotencia | Observacao |
|-----|--------|--------------|------------|
| SincronizarProjetosDadosBancarios | Sistema de projetos/dados bancarios | Sim | Cria/atualiza ProjetoRef, IdentificadorBancario e ContaBancaria |
| ImportarOrcamentoPlanejadoSIGFAPES | SIGFAPES | Sim | Carga unica por projeto; novas tentativas so ocorrem ate sucesso |
| ImportarMovimentosBancariosCNAB240 | Sistema bancario | Sim | Executado diariamente em maquina de integracao; classifica creditos como Estorno, Rendimento ou pendente |

---

### 4. Pareceres de Prestacao de Contas

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/parecer`

Aprova, reprova ou solicita complementacao da prestacao de contas.

- **Autorizacao:** `ANALISTA_AGENCIA`, `SECONT`
- **Operacao de origem:** `EmitirParecerPrestacaoContas`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `prestacaoId` | string | Identificador da prestacao de contas |

**Request body**

```json
{
  "aprovado": false,
  "justificativa": "Faltam comprovantes vinculados a rubrica de servicos.",
  "tipoDecisao": "REJEITADA"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `aprovado` | boolean | Sim | Indica se a prestacao foi aprovada (`true`) ou nao (`false`) |
| `justificativa` | string | Sim | Justificativa do parecer |
| `tipoDecisao` | string (enum) | Sim | Um de: `APROVADA`, `REJEITADA`, `COMPLEMENTACAO_SOLICITADA` |

**Response `200 OK`**

```json
{
  "parecerPC": {
    "prestacaoId": "PC-2026-013",
    "aprovado": false,
    "tipoDecisao": "REJEITADA",
    "justificativa": "Faltam comprovantes vinculados a rubrica de servicos.",
    "registradoEm": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `422` | `PRESTACAO_NAO_SUBMETIDA` | A prestacao de contas ainda nao foi submetida para analise. |
| `422` | `PARECER_PC_INVALIDO` | O parecer informado para a prestacao e invalido. |
| `422` | `PRESTACAO_APROVADA_IRREVERSIVEL` | Uma prestacao de contas aprovada em carater final e irreversivel. |
| `400` | `PARECER_DADOS_INVALIDOS` | Os dados do parecer nao foram informados corretamente. |

---

### 5. Contestacoes

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/contestacoes`

Registra uma contestacao da rejeicao da prestacao de contas.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `RegistrarContestacaoPrestacaoContas`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `prestacaoId` | string | Identificador da prestacao de contas |

**Request body**

```json
{
  "justificativa": "Os comprovantes complementares foram anexados.",
  "documentos": [
    "DOC-2026-090"
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Justificativa detalhada da contestacao |
| `documentos` | array of string | Nao | Lista de identificadores de documentos complementares |

**Response `201 Created`**

```json
{
  "contestacaoPrestacaoContas": {
    "id": "CPC-2026-002",
    "prestacaoId": "PC-2026-013",
    "estado": "SUBMETIDA",
    "submetidaEm": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `422` | `PRAZO_CONTESTACAO_PC_EXPIRADO` | O prazo de 15 dias para contestar a recusa da prestacao de contas ja expirou. |
| `422` | `PRESTACAO_NAO_REJEITADA` | So e possivel contestar uma prestacao de contas rejeitada. |
| `400` | `CONTESTACAO_PC_INVALIDA` | A contestacao da prestacao de contas deve conter justificativa e anexos suficientes. |

---

#### `GET /api/v1/m014/prestacoes-contas/{prestacaoId}/contestacoes`

Lista as contestacoes de uma prestacao de contas.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`, `SECONT`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `prestacaoId` | string | Identificador da prestacao de contas |

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
      "id": "CPC-2026-002",
      "prestacaoId": "PC-2026-013",
      "estado": "SUBMETIDA",
      "submetidaEm": "2026-04-13"
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
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `GET` | `/api/v1/m014/projetos/{projetoId}/prestacoes-contas` | ConsultarPrestacaoContas (lista) | COORDENADOR, ANALISTA_AGENCIA, SECONT, MODULO_INTERNO |
| `GET` | `/api/v1/m014/prestacoes-contas/{prestacaoId}` | ConsultarPrestacaoContas (detalhe) | COORDENADOR, ANALISTA_AGENCIA, SECONT, MODULO_INTERNO |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/submeter` | SubmeterPrestacaoContas | COORDENADOR |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/documentos-fiscais` | RegistrarDocumentoFiscal | COORDENADOR |
| `GET` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/documentos-fiscais` | ListarDocumentosFiscais | COORDENADOR, ANALISTA_AGENCIA, SECONT |
| `DELETE` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/documentos-fiscais/{documentoId}` | RemoverDocumentoFiscal | COORDENADOR |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/parecer` | EmitirParecerPrestacaoContas | ANALISTA_AGENCIA, SECONT |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/contestacoes` | RegistrarContestacaoPrestacaoContas | COORDENADOR |
| `GET` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/contestacoes` | ListarContestacoes | COORDENADOR, ANALISTA_AGENCIA, SECONT |

---

## Schemas de Dominio (Referencia)

### PrestacaoContas

```json
{
  "id": "string",
  "projetoId": "string",
  "periodoReferencia": "string",
  "estado": "EM_ELABORACAO | SUBMETIDA | EM_ANALISE | APROVADA | REJEITADA",
  "documentosFiscais": "integer",
  "extratosImportados": "integer",
  "submetidaEm": "string (YYYY-MM-DD) | null"
}
```

### DocumentoFiscal

```json
{
  "id": "string",
  "prestacaoId": "string",
  "rubricaProjetoId": "string",
  "tipoDocumento": "NOTA_FISCAL | RECIBO | BILHETE_AEREO | COMPROVANTE_DIARIA | OUTRO",
  "valor": "number",
  "url": "string (url)",
  "status": "PENDENTE_ANALISE | APROVADO | REPROVADO"
}
```

### ExtratoBancario

```json
{
  "id": "string",
  "prestacaoId": "string",
  "conta": "string",
  "periodoInicio": "string (YYYY-MM-DD)",
  "periodoFim": "string (YYYY-MM-DD)",
  "lancamentosImportados": "integer"
}
```

### ParecerPC

```json
{
  "prestacaoId": "string",
  "aprovado": "boolean",
  "tipoDecisao": "APROVADA | REJEITADA | COMPLEMENTACAO_SOLICITADA",
  "justificativa": "string",
  "registradoEm": "string (YYYY-MM-DD)"
}
```

### ContestacaoPrestacaoContas

```json
{
  "id": "string",
  "prestacaoId": "string",
  "justificativa": "string",
  "documentos": ["string"],
  "estado": "SUBMETIDA | EM_ANALISE | ACEITA | REJEITADA",
  "submetidaEm": "string (YYYY-MM-DD)"
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
| EPIC-M014-010 (Importacao) | [epics/EPIC-M014-010.md](epics/EPIC-M014-010.md) |
| EPIC-M014-001 (Submissao de Prestacao de Contas) | [epics/EPIC-M014-001.md](epics/EPIC-M014-001.md) |
| EPIC-M014-002 (Analise de Prestacao de Contas) | [epics/EPIC-M014-002.md](epics/EPIC-M014-002.md) |
| EPIC-M014-003 (Contestacao e Auditoria) | [epics/EPIC-M014-003.md](epics/EPIC-M014-003.md) |
