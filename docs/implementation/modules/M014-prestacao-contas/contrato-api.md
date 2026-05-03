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
| `estado` | string | Filtra pelo estado V1: `RASCUNHO`, `EM_ANALISE`, `REVISAO`, `FINALIZADO`, `NEGADO` |
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
      "estado": "EM_ANALISE",
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
    "estado": "EM_ANALISE",
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
    "estado": "EM_ANALISE",
    "submetidaEm": "2026-04-13"
  }
}
```

> No vocabulario V1 nao ha estado `SUBMETIDA` para a prestacao: ao submeter, a `Prestacao` transita diretamente de `RASCUNHO` para `EM_ANALISE`.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `422` | `PRESTACAO_ANTERIOR_PENDENTE` | Existem prestacoes anteriores pendentes para o projeto informado. |
| `422` | `LIMITE_RUBRICA_EXCEDIDO` | A soma dos documentos fiscais excede o saldo aprovado da rubrica. |
| `422` | `PRAZO_SUBMISSAO_EXPIRADO` | O prazo de 30 dias para submeter a prestacao de contas expirou. |
| `409` | `PRESTACAO_JA_SUBMETIDA` | A prestacao de contas ja esta `EM_ANALISE` ou em estado terminal. |

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
| `422` | `PRESTACAO_ESTADO_INVALIDO` | Nao e possivel registrar documentos em uma prestacao fora de `RASCUNHO` ou `REVISAO`. |
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
| `422` | `PRESTACAO_ESTADO_INVALIDO` | Nao e possivel remover documentos de uma prestacao fora de `RASCUNHO` ou `REVISAO`. |

---

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/estornos`

Associa um credito classificado como estorno ao debito correspondente em uma prestacao existente. Quando a prestacao ja foi submetida ou finalizada, a associacao e registrada como ajuste conciliatorio pos-prestacao, preservando a submissao original.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `AssociarEstornoPrestacaoContas`
- **Idempotencia:** Sim, por par `debitoTransacaoFinanceiraId` + `creditoEstornoTransacaoFinanceiraId`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `prestacaoId` | string | Identificador da prestacao de contas |

**Request body**

```json
{
  "debitoTransacaoFinanceiraId": "TR-2026-041",
  "creditoEstornoTransacaoFinanceiraId": "TR-2026-052",
  "modoAssociacao": "AUTO"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `debitoTransacaoFinanceiraId` | string | Sim | Transacao financeira de debito que sera estornada |
| `creditoEstornoTransacaoFinanceiraId` | string | Sim | Transacao financeira de credito classificada como `ESTORNO` |
| `modoAssociacao` | string | Nao | `AUTO`, `CONCILIACAO` ou `AJUSTE_POS_PRESTACAO`; quando omitido, o sistema deriva pelo estado da prestacao |

**Response `200 OK`**

```json
{
  "estornoAssociado": {
    "prestacaoId": "PC-2026-013",
    "debitoTransacaoFinanceiraId": "TR-2026-041",
    "creditoEstornoTransacaoFinanceiraId": "TR-2026-052",
    "valorDebito": 1250.0,
    "valorCredito": 1250.0,
    "efeitoLiquido": 0.0,
    "modoAssociacao": "AJUSTE_POS_PRESTACAO",
    "preservaSubmissaoOriginal": true,
    "situacao": "ASSOCIADO"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `404` | `TRANSACAO_NAO_ENCONTRADA` | Debito ou credito de estorno nao foi encontrado. |
| `422` | `ESTORNO_VALOR_DIVERGENTE` | O credito de estorno deve ter o mesmo valor do debito estornado. |
| `422` | `ESTORNO_OPERACAO_INVALIDA` | A transacao de credito deve estar classificada como `ESTORNO` e a transacao original deve ser `DEBITO`. |
| `409` | `ESTORNO_JA_ASSOCIADO` | O debito informado ja possui estorno associado. |

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
  "tipoDecisao": "NEGADO"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `aprovado` | boolean | Sim | Indica se a prestacao foi aprovada (`true`) ou nao (`false`) |
| `justificativa` | string | Sim | Justificativa do parecer |
| `tipoDecisao` | string (enum) | Sim | Um de: `FINALIZADO`, `NEGADO`, `REVISAO_SOLICITADA` (decisao de parecer alinhada ao vocabulario V1) |

**Response `200 OK`**

```json
{
  "parecerPC": {
    "prestacaoId": "PC-2026-013",
    "aprovado": false,
    "tipoDecisao": "NEGADO",
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

### 6. Justificativas de Despesa

Cada `JustificativaDespesa` esta atrelada a uma `Prestacao` em `RASCUNHO` ou `REVISAO`. Em `EM_ANALISE`, `FINALIZADO` e `NEGADO`, todos os endpoints de escrita desta secao retornam `422 PRESTACAO_EM_ANALISE` (RN03 / RN08).

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-nf`

Registra justificativa baseada em Nota Fiscal (NF-e ou NFS-e).

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `RegistrarJustificativaNF`
- **Idempotencia:** Nao
- **Regras:** RN06 — `chaveAcesso` (44 digitos) validada via SERPRO antes de aceitar o registro

**Request body**

```json
{
  "rubricaProjetoId": "RP-2026-004",
  "valorTotal": 2500.0,
  "chaveAcesso": "35200714200166000187550010000000071123456780",
  "documentoFiscalId": "DOCF-2026-021",
  "urlArquivo": "minio://m014/justif/jnf-001.pdf"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `rubricaProjetoId` | string | Sim | Rubrica do projeto onde a despesa sera classificada (RN07) |
| `valorTotal` | number | Sim | Valor total da nota (>= 0, RI1) |
| `chaveAcesso` | string (44) | Sim | Chave de acesso da NF-e — validada via SERPRO (RN06) |
| `documentoFiscalId` | string | Nao | DocumentoFiscal ja registrado a ser associado 1:1; se omitido, sera criado automaticamente apos validacao SERPRO |
| `urlArquivo` | string (url) | Sim | URL MinIO do arquivo da NF |

**Response `201 Created`**

```json
{
  "justificativaNF": {
    "id": "JNF-2026-007",
    "prestacaoId": "PC-2026-013",
    "rubricaProjetoId": "RP-2026-004",
    "valorTotal": 2500.0,
    "chaveAcesso": "35200714200166000187550010000000071123456780",
    "status": "PENDENTE_ANALISE"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `422` | `CHAVE_ACESSO_INVALIDA` | A chave de acesso informada nao tem 44 digitos numericos. |
| `422` | `SERPRO_VALIDACAO_FALHOU` | A consulta SERPRO nao validou a NF-e informada. |
| `422` | `RUBRICA_PROJETO_INVALIDA` | A rubrica informada nao pode receber a justificativa. |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-diaria`

Registra justificativa de diaria, referenciando a solicitacao de diaria aprovada no M003.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `RegistrarJustificativaDiaria`
- **Regras:** RN12 (rubrica de diaria); cada `solicitacaoDiariaRefId` so pode ser prestada contas uma vez

**Request body**

```json
{
  "rubricaProjetoId": "RP-2026-009",
  "solicitacaoDiariaRefId": "SD-2026-018",
  "alocacaoBolsistaId": "AB-2026-002",
  "valorTotal": 720.0,
  "urlArquivo": "minio://m014/justif/jd-018.pdf"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `rubricaProjetoId` | string | Sim | Rubrica de diaria do projeto |
| `solicitacaoDiariaRefId` | string | Sim | Identificador da solicitacao de diaria aprovada no M003 |
| `alocacaoBolsistaId` | string | Sim | Bolsista beneficiario da diaria |
| `valorTotal` | number | Sim | Valor total da diaria paga (>= 0) |
| `urlArquivo` | string (url) | Sim | URL MinIO do comprovante |

**Response `201 Created`**

```json
{
  "justificativaDiaria": {
    "id": "JD-2026-018",
    "prestacaoId": "PC-2026-013",
    "rubricaProjetoId": "RP-2026-009",
    "solicitacaoDiariaRefId": "SD-2026-018",
    "valorTotal": 720.0,
    "status": "PENDENTE_ANALISE"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `404` | `SOLICITACAO_DIARIA_NAO_ENCONTRADA` | A solicitacao de diaria informada nao foi encontrada no M003. |
| `409` | `DIARIA_JA_PRESTADA_CONTAS` | A solicitacao de diaria ja foi prestada contas em outra justificativa ativa. |
| `422` | `RUBRICA_PROJETO_INVALIDA` | A rubrica informada nao e de diaria. |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-passagem`

Registra justificativa de passagem aerea/terrestre.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `RegistrarJustificativaPassagem`
- **Regras:** RN12 — `valorPassagemComprada` obrigatorio, comprovante de pagamento e comprovante de realizacao da viagem

**Request body**

```json
{
  "rubricaProjetoId": "RP-2026-007",
  "valorPassagemComprada": 980.5,
  "origem": "Vitoria/ES",
  "destino": "Brasilia/DF",
  "dataViagem": "2026-04-10",
  "urlComprovantePagamento": "minio://m014/justif/jp-pgto.pdf",
  "urlComprovanteRealizacao": "minio://m014/justif/jp-bp.pdf"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `rubricaProjetoId` | string | Sim | Rubrica de passagem do projeto |
| `valorPassagemComprada` | number | Sim | Valor pago pela passagem (> 0) |
| `origem` | string | Sim | Cidade/UF de origem |
| `destino` | string | Sim | Cidade/UF de destino |
| `dataViagem` | string (YYYY-MM-DD) | Sim | Data da viagem |
| `urlComprovantePagamento` | string (url) | Sim | URL MinIO do comprovante de pagamento |
| `urlComprovanteRealizacao` | string (url) | Sim | URL MinIO do comprovante/registro da viagem realizada |

**Response `201 Created`**

```json
{
  "justificativaPassagem": {
    "id": "JP-2026-005",
    "prestacaoId": "PC-2026-013",
    "rubricaProjetoId": "RP-2026-007",
    "valorPassagemComprada": 980.5,
    "status": "PENDENTE_ANALISE"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `422` | `RUBRICA_PROJETO_INVALIDA` | A rubrica informada nao e de passagem. |
| `400` | `JUSTIFICATIVA_PASSAGEM_INVALIDA` | Comprovantes de pagamento e/ou realizacao ausentes ou `valorPassagemComprada` <= 0. |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-invoice`

Registra justificativa baseada em invoice em moeda estrangeira.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `RegistrarJustificativaInvoice`

**Request body**

```json
{
  "rubricaProjetoId": "RP-2026-011",
  "valorTotal": 1200.0,
  "moeda": "USD",
  "taxaCambio": 5.12,
  "valorTotalBRL": 6144.0,
  "dataInvoice": "2026-04-08",
  "urlArquivo": "minio://m014/justif/inv-009.pdf"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `rubricaProjetoId` | string | Sim | Rubrica do projeto |
| `valorTotal` | number | Sim | Valor na moeda original (> 0) |
| `moeda` | string (enum) | Sim | Um de: `BRL`, `USD`, `EUR`, `GBP` |
| `taxaCambio` | number | Sim | Taxa de cambio aplicada na conversao para BRL (> 0) |
| `valorTotalBRL` | number | Sim | Valor convertido em BRL (`valorTotal * taxaCambio`) |
| `dataInvoice` | string (YYYY-MM-DD) | Sim | Data do invoice |
| `urlArquivo` | string (url) | Sim | URL MinIO do invoice |

**Response `201 Created`**

```json
{
  "justificativaInvoice": {
    "id": "JI-2026-009",
    "prestacaoId": "PC-2026-013",
    "rubricaProjetoId": "RP-2026-011",
    "moeda": "USD",
    "taxaCambio": 5.12,
    "valorTotalBRL": 6144.0,
    "status": "PENDENTE_ANALISE"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `400` | `MOEDA_INVALIDA` | A moeda informada nao esta entre as suportadas. |
| `400` | `TAXA_CAMBIO_INVALIDA` | A taxa de cambio deve ser > 0 e coerente com `valorTotal × taxaCambio = valorTotalBRL`. |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-produto-sem-nota`

Registra compra excepcional sem NF, com comprovante alternativo. Marcada como `analiseObrigatoria = true`.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `RegistrarJustificativaProdutoSemNota`

**Request body**

```json
{
  "rubricaProjetoId": "RP-2026-014",
  "fornecedor": "Mercado Vitoria Ltda",
  "identificadorFornecedor": "12.345.678/0001-90",
  "dataCompra": "2026-04-05",
  "valorTotal": 180.0,
  "justificativaAusenciaNota": "Fornecedor MEI nao emite NF eletronica e e o unico no municipio.",
  "urlComprovanteAlternativo": "minio://m014/justif/sn-014.pdf"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `rubricaProjetoId` | string | Sim | Rubrica do projeto |
| `fornecedor` | string | Sim | Nome ou razao social |
| `identificadorFornecedor` | string | Nao | CPF ou CNPJ do fornecedor |
| `dataCompra` | string (YYYY-MM-DD) | Sim | Data da compra |
| `valorTotal` | number | Sim | Valor total (> 0) |
| `justificativaAusenciaNota` | string | Sim | Justificativa formal escrita pelo Coordenador |
| `urlComprovanteAlternativo` | string (url) | Sim | URL MinIO do comprovante alternativo |

**Response `201 Created`**

```json
{
  "justificativaProdutoSemNota": {
    "id": "JPSN-2026-002",
    "prestacaoId": "PC-2026-013",
    "rubricaProjetoId": "RP-2026-014",
    "fornecedor": "Mercado Vitoria Ltda",
    "valorTotal": 180.0,
    "analiseObrigatoria": true,
    "status": "PENDENTE_ANALISE"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao de contas informada nao foi encontrada. |
| `400` | `JUSTIFICATIVA_PRODUTO_SEM_NOTA_INVALIDA` | `justificativaAusenciaNota` ou `urlComprovanteAlternativo` ausente. |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `GET /api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas`

Lista todas as justificativas (NF, Diaria, Passagem, Invoice e Produto sem Nota) da prestacao.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`, `SECONT`
- **Operacao de origem:** `ListarJustificativas`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipo` | string | Filtra por tipo: `NF`, `DIARIA`, `PASSAGEM`, `INVOICE`, `PRODUTO_SEM_NOTA` |
| `rubricaProjetoId` | string | Filtra por rubrica |
| `page` | integer | Padrao: 1 |
| `pageSize` | integer | Padrao: 20, max: 100 |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "JNF-2026-007",
      "tipo": "NF",
      "rubricaProjetoId": "RP-2026-004",
      "valorTotal": 2500.0,
      "status": "PENDENTE_ANALISE"
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

#### `DELETE /api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas/{justificativaId}`

Remove uma justificativa de uma prestacao em `RASCUNHO` ou `REVISAO`.

- **Autorizacao:** `COORDENADOR`

**Response `204 No Content`**

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `JUSTIFICATIVA_NAO_ENCONTRADA` | A justificativa informada nao foi encontrada. |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

### 7. Itens de Documento Fiscal e Rubricas

#### `POST /api/v1/m014/documentos-fiscais/{documentoId}/itens`

Adiciona um item discriminado a um `DocumentoFiscal`.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `AdicionarItemDocumentoFiscal`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `documentoId` | string | Identificador do DocumentoFiscal |

**Request body**

```json
{
  "descricao": "Notebook Dell Inspiron 15",
  "quantidade": 1,
  "valorUnitario": 4200.0,
  "rubricaProjetoId": "RP-2026-004"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `descricao` | string | Sim | Descricao do item |
| `quantidade` | number | Sim | Quantidade (> 0) |
| `valorUnitario` | number | Sim | Valor unitario (>= 0) |
| `rubricaProjetoId` | string | Nao | Rubrica de classificacao; se omitido, item fica sem classificacao ate `PUT .../rubrica` (RN07) |

**Response `201 Created`**

```json
{
  "item": {
    "id": "ITDF-2026-091",
    "documentoId": "DOCF-2026-021",
    "descricao": "Notebook Dell Inspiron 15",
    "quantidade": 1,
    "valorUnitario": 4200.0,
    "valorTotal": 4200.0,
    "rubricaProjetoId": "RP-2026-004"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `DOCUMENTO_FISCAL_NAO_ENCONTRADO` | O documento fiscal informado nao foi encontrado. |
| `400` | `ITEM_DOCUMENTO_FISCAL_INVALIDO` | Quantidade <= 0 ou valor unitario < 0. |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `PUT /api/v1/m014/itens-documento/{itemId}/rubrica`

Classifica um `ItemDocumentoFiscal` em uma `RubricaProjeto` (RN07).

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `ClassificarItemEmRubrica`

**Request body**

```json
{
  "rubricaProjetoId": "RP-2026-004"
}
```

**Response `200 OK`**

```json
{
  "item": {
    "id": "ITDF-2026-091",
    "rubricaProjetoId": "RP-2026-004"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `ITEM_DOCUMENTO_FISCAL_NAO_ENCONTRADO` | O item informado nao foi encontrado. |
| `422` | `RUBRICA_PROJETO_INVALIDA` | A rubrica nao pode receber este item (incompatibilidade de tipo ou inativa). |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

### 8. Orcamentos de Fornecedor

Cada `JustificativaDespesa` pode ter ate 3 `OrcamentoFornecedor`, dos quais no maximo 1 e marcado como escolhido (RN05).

#### `POST /api/v1/m014/justificativas/{justificativaId}/orcamentos-fornecedor`

Adiciona um orcamento de fornecedor a uma justificativa.

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `AdicionarOrcamentoFornecedor`

**Request body**

```json
{
  "fornecedor": "Tech Express ME",
  "valor": 4180.0,
  "data": "2026-03-22",
  "urlArquivoPDF": "minio://m014/orc/of-091.pdf"
}
```

**Response `201 Created`**

```json
{
  "orcamentoFornecedor": {
    "id": "OF-2026-091",
    "justificativaId": "JNF-2026-007",
    "fornecedor": "Tech Express ME",
    "valor": 4180.0,
    "escolhido": false
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `JUSTIFICATIVA_NAO_ENCONTRADA` | A justificativa informada nao foi encontrada. |
| `422` | `LIMITE_ORCAMENTOS_EXCEDIDO` | A justificativa ja possui 3 orcamentos de fornecedor (RN05). |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `PUT /api/v1/m014/orcamentos-fornecedor/{orcamentoId}/escolher`

Marca um orcamento como escolhido. Desmarca os demais da mesma justificativa (RN05: max 1 escolhido).

- **Autorizacao:** `COORDENADOR`

**Response `200 OK`**

```json
{
  "orcamentoFornecedor": {
    "id": "OF-2026-091",
    "justificativaId": "JNF-2026-007",
    "escolhido": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `ORCAMENTO_FORNECEDOR_NAO_ENCONTRADO` | O orcamento informado nao foi encontrado. |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `DELETE /api/v1/m014/orcamentos-fornecedor/{orcamentoId}`

Remove um orcamento de fornecedor.

- **Autorizacao:** `COORDENADOR`

**Response `204 No Content`**

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `ORCAMENTO_FORNECEDOR_NAO_ENCONTRADO` | O orcamento informado nao foi encontrado. |
| `422` | `PRESTACAO_EM_ANALISE` | Edicao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

### 9. Transacoes Financeiras e Vinculacao

Transacoes sao importadas via job CNAB 240 (secao 3). Esta secao expoe a leitura, vinculacao a prestacao e classificacao de creditos.

#### `GET /api/v1/m014/projetos/{projetoId}/transacoes-financeiras`

Lista transacoes financeiras importadas do projeto.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`, `SECONT`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | `PENDENTE`, `EM_RASCUNHO`, `EM_ANALISE`, `EM_REVISAO`, `APROVADA`, `REJEITADA` (status derivado da Prestacao — RI4) |
| `tipo` | string | `DEBITO`, `CREDITO` |
| `classificacao` | string | `DESPESA`, `ESTORNO`, `RENDIMENTO`, `PENDENTE_CLASSIFICACAO` (RN11) |
| `prestacaoId` | string | Filtra por vinculacao a uma prestacao especifica |
| `page` | integer | Padrao: 1 |
| `pageSize` | integer | Padrao: 20, max: 100 |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "TR-2026-041",
      "projetoId": "PROJ-2026-014",
      "tipo": "DEBITO",
      "valor": 1250.0,
      "data": "2026-03-28",
      "classificacao": "DESPESA",
      "status": "EM_ANALISE",
      "prestacaoId": "PC-2026-013"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `POST /api/v1/m014/prestacoes-contas/{prestacaoId}/transacoes/{transacaoId}/vincular`

Vincula uma transacao financeira a uma prestacao (RN04 — uma transacao so pode estar vinculada a uma prestacao por vez).

- **Autorizacao:** `COORDENADOR`
- **Operacao de origem:** `VincularTransacaoPrestacao`
- **Idempotencia:** Sim, por par `prestacaoId` + `transacaoId`

**Response `200 OK`**

```json
{
  "vinculo": {
    "prestacaoId": "PC-2026-013",
    "transacaoId": "TR-2026-041",
    "vinculadaEm": "2026-04-01"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PRESTACAO_NAO_ENCONTRADA` | A prestacao informada nao foi encontrada. |
| `404` | `TRANSACAO_NAO_ENCONTRADA` | A transacao informada nao foi encontrada. |
| `409` | `TRANSACAO_JA_VINCULADA` | A transacao ja esta vinculada a outra prestacao (RN04). |
| `422` | `PRESTACAO_EM_ANALISE` | Vinculacao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `DELETE /api/v1/m014/prestacoes-contas/{prestacaoId}/transacoes/{transacaoId}/vincular`

Desfaz a vinculacao de uma transacao com a prestacao.

- **Autorizacao:** `COORDENADOR`

**Response `204 No Content`**

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VINCULO_NAO_ENCONTRADO` | Nao ha vinculo entre a prestacao e a transacao informada. |
| `422` | `PRESTACAO_EM_ANALISE` | Desvinculacao bloqueada: a prestacao nao esta em `RASCUNHO` ou `REVISAO`. |

---

#### `PUT /api/v1/m014/transacoes-financeiras/{transacaoId}/classificar`

Classifica uma `TransacaoFinanceira` de `Tipo = CREDITO` (RN11). Para credito, define `DESPESA`, `ESTORNO`, `RENDIMENTO` ou `PENDENTE_CLASSIFICACAO`.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`
- **Operacao de origem:** `ClassificarTransacaoFinanceira`

**Request body**

```json
{
  "classificacao": "ESTORNO",
  "transacaoEstornadaId": "TR-2026-038"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `classificacao` | string (enum) | Sim | `DESPESA`, `ESTORNO`, `RENDIMENTO`, `PENDENTE_CLASSIFICACAO` |
| `transacaoEstornadaId` | string | Condicional | Obrigatorio quando `classificacao = ESTORNO`; FK para o debito anterior pareado |

**Response `200 OK`**

```json
{
  "transacaoFinanceira": {
    "id": "TR-2026-052",
    "classificacao": "ESTORNO",
    "transacaoEstornadaId": "TR-2026-038"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `TRANSACAO_NAO_ENCONTRADA` | A transacao informada nao foi encontrada. |
| `422` | `ESTORNO_VALOR_DIVERGENTE` | O credito de estorno deve ter o mesmo valor do debito estornado. |
| `422` | `ESTORNO_OPERACAO_INVALIDA` | Apenas creditos podem ser classificados como `ESTORNO` apontando para um debito anterior. |

---

### 10. Anexos / Upload MinIO

#### `POST /api/v1/m014/anexos`

Faz upload de um arquivo para o MinIO e devolve a URL usada nos campos `urlArquivo`, `urlComprovantePagamento`, `urlComprovanteRealizacao`, `urlComprovanteAlternativo` e `urlArquivoPDF` dos demais recursos.

- **Autorizacao:** `COORDENADOR`, `ANALISTA_AGENCIA`
- **Operacao de origem:** `UploadAnexoMinIO`
- **Content-Type:** `multipart/form-data`

**Request (multipart)**

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `file` | file | Sim | Arquivo a ser armazenado (PDF, PNG, JPG, XML) |
| `categoria` | string | Sim | `JUSTIFICATIVA`, `DOCUMENTO_FISCAL`, `ORCAMENTO_FORNECEDOR`, `COMPROVANTE_PASSAGEM`, `COMPROVANTE_DIARIA`, `OUTRO` |
| `prestacaoId` | string | Nao | Quando informado, agrupa o objeto sob a prestacao no bucket |

**Response `201 Created`**

```json
{
  "anexo": {
    "id": "ANX-2026-077",
    "url": "minio://m014/justif/jnf-001.pdf",
    "tamanhoBytes": 184320,
    "contentType": "application/pdf",
    "categoria": "JUSTIFICATIVA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `ARQUIVO_INVALIDO` | O arquivo enviado e invalido ou excede o limite de tamanho. |
| `400` | `CATEGORIA_ANEXO_INVALIDA` | A categoria informada nao esta entre as suportadas. |

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
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/estornos` | AssociarEstornoPrestacaoContas | COORDENADOR |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/parecer` | EmitirParecerPrestacaoContas | ANALISTA_AGENCIA, SECONT |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/contestacoes` | RegistrarContestacaoPrestacaoContas | COORDENADOR |
| `GET` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/contestacoes` | ListarContestacoes | COORDENADOR, ANALISTA_AGENCIA, SECONT |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-nf` | RegistrarJustificativaNF | COORDENADOR |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-diaria` | RegistrarJustificativaDiaria | COORDENADOR |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-passagem` | RegistrarJustificativaPassagem | COORDENADOR |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-invoice` | RegistrarJustificativaInvoice | COORDENADOR |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas-produto-sem-nota` | RegistrarJustificativaProdutoSemNota | COORDENADOR |
| `GET` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas` | ListarJustificativas | COORDENADOR, ANALISTA_AGENCIA, SECONT |
| `DELETE` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/justificativas/{justificativaId}` | RemoverJustificativa | COORDENADOR |
| `POST` | `/api/v1/m014/documentos-fiscais/{documentoId}/itens` | AdicionarItemDocumentoFiscal | COORDENADOR |
| `PUT` | `/api/v1/m014/itens-documento/{itemId}/rubrica` | ClassificarItemEmRubrica | COORDENADOR |
| `POST` | `/api/v1/m014/justificativas/{justificativaId}/orcamentos-fornecedor` | AdicionarOrcamentoFornecedor | COORDENADOR |
| `PUT` | `/api/v1/m014/orcamentos-fornecedor/{orcamentoId}/escolher` | EscolherOrcamentoFornecedor | COORDENADOR |
| `DELETE` | `/api/v1/m014/orcamentos-fornecedor/{orcamentoId}` | RemoverOrcamentoFornecedor | COORDENADOR |
| `GET` | `/api/v1/m014/projetos/{projetoId}/transacoes-financeiras` | ListarTransacoesFinanceiras | COORDENADOR, ANALISTA_AGENCIA, SECONT |
| `POST` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/transacoes/{transacaoId}/vincular` | VincularTransacaoPrestacao | COORDENADOR |
| `DELETE` | `/api/v1/m014/prestacoes-contas/{prestacaoId}/transacoes/{transacaoId}/vincular` | DesvincularTransacaoPrestacao | COORDENADOR |
| `PUT` | `/api/v1/m014/transacoes-financeiras/{transacaoId}/classificar` | ClassificarTransacaoFinanceira | COORDENADOR, ANALISTA_AGENCIA |
| `POST` | `/api/v1/m014/anexos` | UploadAnexoMinIO | COORDENADOR, ANALISTA_AGENCIA |

---

## Schemas de Dominio (Referencia)

### PrestacaoContas

```json
{
  "id": "string",
  "projetoId": "string",
  "periodoReferencia": "string",
  "estado": "RASCUNHO | EM_ANALISE | REVISAO | FINALIZADO | NEGADO",
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

### JustificativaPassagem

```json
{
  "id": "string",
  "prestacaoId": "string",
  "rubricaProjetoId": "string",
  "valorPassagemComprada": "number",
  "origem": "string",
  "destino": "string",
  "dataViagem": "string (YYYY-MM-DD)",
  "urlComprovantePagamento": "string (url)",
  "urlComprovanteRealizacao": "string (url)",
  "transacaoFinanceiraId": "string | null",
  "status": "PENDENTE_ANALISE | APROVADO | REPROVADO"
}
```

`valorPassagemComprada` e obrigatorio, deve ser maior que zero e representa o valor efetivamente pago pela passagem. Esse valor deve ser usado como valor da despesa para validacao de rubrica, saldo e conciliacao com a transacao financeira do pagamento.

`rubricaProjetoId` tambem e obrigatorio e deve apontar para uma rubrica de passagem vigente do projeto. A API deve recusar o salvamento quando a rubrica informada for de diaria ou de outra categoria.

### EstornoAssociado

```json
{
  "prestacaoId": "string",
  "debitoTransacaoFinanceiraId": "string",
  "creditoEstornoTransacaoFinanceiraId": "string",
  "valorDebito": "number",
  "valorCredito": "number",
  "efeitoLiquido": "number",
  "modoAssociacao": "CONCILIACAO | AJUSTE_POS_PRESTACAO",
  "preservaSubmissaoOriginal": "boolean",
  "situacao": "ASSOCIADO"
}
```

O estorno associado representa o pareamento entre uma transacao de debito e uma transacao de credito classificada como `ESTORNO`. O par deve aparecer junto na conciliacao da prestacao e nao deve gerar nova despesa nem rendimento. Quando `modoAssociacao = AJUSTE_POS_PRESTACAO`, a associacao e append-only e nao altera documentos, justificativas ou a submissao original.

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
  "tipoDecisao": "FINALIZADO | NEGADO | REVISAO_SOLICITADA",
  "justificativa": "string",
  "registradoEm": "string (YYYY-MM-DD)"
}
```

### ContestacaoPrestacaoContas

```json
{
  // Pos-MVP: schema sujeito a mudanca quando EPIC-M014-003 entrar em desenvolvimento
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
