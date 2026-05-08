# Contrato API

Dominio: ver [README.md](README.md) | Contrato logico: [contrato.md](contrato.md)

> Estes endpoints sao **internos do M023**, expostos para os modulos consumidores e Portal Admin. M023 nao expoe os endpoints do provedor externo (E-Docs); apenas seu adapter os consome.

## Convencoes

| Item | Valor |
|------|-------|
| Prefixo | `/api/v1/m023/...` |
| Autenticacao | Bearer JWT Conecta |
| Idempotencia | `EnviarSolicitacaoAssinatura` e idempotente por `documentoId` |
| Identificadores | Strings opacas (`SOL-2026-001`, `DOC-2026-001`, `PES-2026-010`) |
| Erros | Envelope `{ "error": { "code", "message", "details" } }` |

## Endpoints

### `POST /api/v1/m023/solicitacoes-assinatura`

Cria nova `SolicitacaoAssinatura` para um Documento M008 e dispara envio ao provedor de assinatura. Idempotente por `documentoId` — chamadas repetidas retornam a solicitacao existente.

- **Autorizacao:** modulo consumidor autorizado (M009, M022, M003, M010) ou Sysadmin
- **Operacao de origem:** `EnviarDocumentoParaAssinatura`

**Request body**

```json
{
  "documentoId": "DOC-2026-001",
  "tipo": "TERMO_COMPROMISSO_BOLSA",
  "signatarios": [
    { "pessoaId": "PES-2026-010", "papel": "Coordenador", "ordem": 1 },
    { "pessoaId": "PES-2026-011", "papel": "Orientador",  "ordem": 2 },
    { "pessoaId": "PES-2026-012", "papel": "Bolsista",    "ordem": 3 },
    { "pessoaId": "PES-2026-020", "papel": "DIRAF",       "ordem": 4 },
    { "pessoaId": "PES-2026-021", "papel": "DIPRE",       "ordem": 5 }
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `documentoId` | string | Sim | Identificador do Documento canonico em M008 |
| `tipo` | string | Nao | Rotulo de negocio (apenas auditoria) |
| `signatarios` | array | Sim | Lista de signatarios; minimo 1 |
| `signatarios[].pessoaId` | string | Sim | Identificador de PessoaFisica (M008) |
| `signatarios[].papel` | string | Sim | Texto livre definido pelo modulo consumidor |
| `signatarios[].ordem` | integer | Sim | Ordem de assinatura quando aplicavel; >= 1 |

**Response `201 Created`**

```json
{
  "solicitacao": {
    "id": "SOL-2026-001",
    "documentoId": "DOC-2026-001",
    "provedor": "E_DOCS",
    "estado": "ENVIADA",
    "totalAssinantes": 5,
    "totalAssinados": 0,
    "totalRecusados": 0,
    "dataEnvio": "2026-05-08T14:00:00Z",
    "dataExpiracao": "2026-06-07T14:00:00Z"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `DOCUMENTO_NAO_ENCONTRADO` | O documento informado nao foi encontrado no M008. |
| `422` | `DOCUMENTO_INVALIDO_PDF` | O documento nao possui PDF valido (sem texto pesquisavel). |
| `422` | `DOCUMENTO_EXCEDE_LIMITE` | O PDF excede o limite suportado pelo provedor. |
| `409` | `SOLICITACAO_DUPLICADA` | Ja existe solicitacao nao terminal para este documento. |
| `503` | `PROVEDOR_INDISPONIVEL` | Provedor de assinatura indisponivel; tentar novamente. |
| `400` | `SOLICITACAO_DADOS_INVALIDOS` | Dados da solicitacao sao invalidos ou incompletos. |

---

### `GET /api/v1/m023/solicitacoes-assinatura/{id}`

Consulta o estado atual de uma solicitacao.

- **Autorizacao:** qualquer modulo interno autorizado, Sysadmin

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da SolicitacaoAssinatura (ex: `SOL-2026-001`) |

**Response `200 OK`**

```json
{
  "solicitacao": {
    "id": "SOL-2026-001",
    "documentoId": "DOC-2026-001",
    "provedor": "E_DOCS",
    "estado": "PARCIALMENTE_ASSINADA",
    "totalAssinantes": 5,
    "totalAssinados": 3,
    "totalRecusados": 0,
    "dataEnvio": "2026-05-08T14:00:00Z",
    "dataCapturaFinal": null,
    "dataExpiracao": "2026-06-07T14:00:00Z",
    "signatarios": [
      { "id": "SIG-001", "pessoaId": "PES-2026-010", "papel": "Coordenador", "estado": "ASSINOU",  "dataAssinatura": "2026-05-09T10:15:00Z" },
      { "id": "SIG-002", "pessoaId": "PES-2026-011", "papel": "Orientador",  "estado": "ASSINOU",  "dataAssinatura": "2026-05-10T08:30:00Z" },
      { "id": "SIG-003", "pessoaId": "PES-2026-012", "papel": "Bolsista",    "estado": "ASSINOU",  "dataAssinatura": "2026-05-10T14:45:00Z" },
      { "id": "SIG-004", "pessoaId": "PES-2026-020", "papel": "DIRAF",       "estado": "PENDENTE", "dataAssinatura": null },
      { "id": "SIG-005", "pessoaId": "PES-2026-021", "papel": "DIPRE",       "estado": "PENDENTE", "dataAssinatura": null }
    ]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `SOLICITACAO_NAO_ENCONTRADA` | A solicitacao informada nao foi encontrada. |

---

### `GET /api/v1/m023/solicitacoes-assinatura/por-documento/{documentoId}`

Atalho para consultar a solicitacao nao terminal de um documento (existe no maximo uma — RI2).

**Response:** mesmo formato do endpoint anterior, ou `404` quando nao houver.

---

### `GET /api/v1/m023/solicitacoes-assinatura/{id}/conteudo`

Devolve o PDF assinado + manifesto. Disponivel apenas quando `estado=ASSINADA`.

**Response `200 OK`**

```json
{
  "documento": {
    "id": "DOC-2026-001",
    "protocoloAssinatura": "9b8a7c6d-...",
    "hashAssinatura": "a1b2c3d4...",
    "dataCapturaFinal": "2026-05-12T16:20:00Z",
    "urlConteudoAssinado": "https://storage.conecta.fapes.es.gov.br/docs/DOC-2026-001.pdf"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `SOLICITACAO_NAO_ASSINADA` | A solicitacao ainda nao foi assinada. |
| `404` | `DOCUMENTO_NAO_ENCONTRADO` | O PDF assinado nao foi arquivado no M008. |

---

### `POST /api/v1/m023/solicitacoes-assinatura/{id}/cancelar`

Cancela uma solicitacao em estado nao terminal. Marca como `ERRO` e impede futuras transicoes.

**Request body**

```json
{ "motivo": "Documento substituido por nova versao." }
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `SOLICITACAO_TERMINAL` | Solicitacao ja em estado terminal; cancelamento rejeitado. |
| `404` | `SOLICITACAO_NAO_ENCONTRADA` | Solicitacao nao encontrada. |

---

### `POST /api/v1/m023/solicitacoes-assinatura/{id}/reconciliar`

Forca polling imediato no provedor para uma solicitacao especifica. Util para sysadmin investigando inconsistencia ou para reduzir latencia em demonstracao/teste.

- **Autorizacao:** Sysadmin

**Response `200 OK`**: estado atualizado da solicitacao (mesmo formato do `GET /{id}`).

---

### `GET /api/v1/m023/solicitacoes-assinatura`

Lista e filtra solicitacoes.

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra por estado (ex: `AGUARDANDO_ASSINATURAS`, `ASSINADA`) |
| `provedor` | string | Filtra por provedor (`E_DOCS`, `OUTRO`) |
| `documentoId` | string | Filtra pelo documento M008 |
| `pessoaId` | string | Lista solicitacoes onde a pessoa e signataria |
| `dataEnvioInicio` | date | Janela inicial |
| `dataEnvioFim` | date | Janela final |
| `page` | integer | Pagina (padrao 1) |
| `pageSize` | integer | Itens por pagina (padrao 20, max 100) |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m023/solicitacoes-assinatura` | EnviarSolicitacaoAssinatura | Modulo consumidor, Sysadmin |
| `GET` | `/api/v1/m023/solicitacoes-assinatura` | ListarSolicitacoes | Modulo interno autorizado |
| `GET` | `/api/v1/m023/solicitacoes-assinatura/{id}` | ConsultarSolicitacao | Modulo interno autorizado |
| `GET` | `/api/v1/m023/solicitacoes-assinatura/por-documento/{documentoId}` | ConsultarSolicitacaoPorDocumento | Modulo interno autorizado |
| `GET` | `/api/v1/m023/solicitacoes-assinatura/{id}/conteudo` | BaixarDocumentoAssinado | Modulo interno autorizado |
| `POST` | `/api/v1/m023/solicitacoes-assinatura/{id}/cancelar` | CancelarSolicitacao | Sysadmin, modulo consumidor |
| `POST` | `/api/v1/m023/solicitacoes-assinatura/{id}/reconciliar` | ReconciliarManualmente | Sysadmin |

## Schemas de Dominio

### SolicitacaoAssinatura

```json
{
  "id": "string",
  "documentoId": "string",
  "provedor": "E_DOCS | ICP_BRASIL_DIRETO | GOVBR | OUTRO",
  "estado": "ENVIADA | AGUARDANDO_ASSINATURAS | PARCIALMENTE_ASSINADA | ASSINADA | RECUSADA | ERRO",
  "totalAssinantes": "integer",
  "totalAssinados": "integer",
  "totalRecusados": "integer",
  "dataEnvio": "string (ISO 8601)",
  "dataCapturaFinal": "string (ISO 8601) | null",
  "dataExpiracao": "string (ISO 8601)",
  "signatarios": [
    {
      "id": "string",
      "pessoaId": "string",
      "papel": "string",
      "ordem": "integer",
      "estado": "PENDENTE | ASSINOU | RECUSOU",
      "dataAssinatura": "string (ISO 8601) | null",
      "motivoRecusa": "string | null"
    }
  ]
}
```

---

## Referencias

- **Contrato logico**: [contrato.md](contrato.md)
- **Modelo de dominio**: [modelo-estrutural.md](modelo-estrutural.md)
- **Discovery do provedor (E-Docs V2)**: [integracoes/e-docs.md](../../../discovery/integracoes/e-docs.md)
- **Documentacao oficial V2**: [docs.e-docs.es.gov.br/api](https://docs.e-docs.es.gov.br/api/)
- **Convencao de identificadores Conecta**: similar ao padrao usado em outros modulos (`PES-2026-001`, `INST-2026-010`)
- **Autorizacao**: JWT do M005-Autenticacao (Acesso Cidadao SSO)
