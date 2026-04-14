# Contrato de API HTTP — M017 Prevencao a Lavagem de Dinheiro (PLD)

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M017 como bounded context responsavel por verificacao KYC, monitoramento PLD, analise de alertas, bloqueio preventivo de pagamento, reporte ao COAF e dashboard de compliance. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m017
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Formato de data-hora | ISO 8601 — `YYYY-MM-DDTHH:MM:SSZ` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `KYC-2026-001`, `APLD-2026-001`, `BLQ-2026-001`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `OFICIAL_COMPLIANCE` | Oficial de compliance — acesso completo ao dominio PLD: alertas, bloqueios, KYC, dashboard e reporte COAF |
| `DIRETORIA_AUTORIZADA` | Diretor autorizado — autoriza desbloqueios de pagamento e acompanha reportes sensiveis |
| `MODULO_INTERNO` | Modulo interno autorizado — dispara verificacao KYC e consulta situacao de bloqueio |
| `SISTEMA` | Sistema — executa jobs agendados de monitoramento |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "alerta": "APLD-2026-001"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | Bloqueio ja ativo para o pagamento |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido para a operacao solicitada |

---

## Recursos

### 1. Verificacao KYC

#### `POST /api/v1/m017/verificacoes-kyc`

Realiza verificacao KYC de um beneficiario antes do primeiro pagamento.

- **Autorizacao:** `MODULO_INTERNO`, `OFICIAL_COMPLIANCE`
- **Operacao de origem:** `ExecutarVerificacaoKYC`
- **Idempotencia:** Sim — por beneficiarioId e contexto de verificacao

**Request body**

```json
{
  "beneficiarioId": "PES-2026-001",
  "contexto": "PRIMEIRO_PAGAMENTO"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `beneficiarioId` | string | Sim | Identificador do beneficiario em M008 |
| `contexto` | string (enum) | Sim | Um de: `PRIMEIRO_PAGAMENTO`, `ATUALIZACAO_CADASTRAL` |

**Response `201 Created`**

```json
{
  "verificacaoKYC": {
    "codigo": "KYC-2026-001",
    "beneficiarioId": "PES-2026-001",
    "contexto": "PRIMEIRO_PAGAMENTO",
    "resultado": "APROVADO",
    "dataVerificacao": "2026-04-14"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BENEFICIARIO_NAO_ENCONTRADO` | O beneficiario informado nao foi encontrado para verificacao KYC. |
| `422` | `KYC_INCONCLUSIVO` | A verificacao KYC nao pode ser concluida com os dados disponiveis. |
| `400` | `KYC_DADOS_INVALIDOS` | Os dados obrigatorios para verificacao KYC nao foram informados corretamente. |

---

#### `GET /api/v1/m017/verificacoes-kyc`

Lista e filtra verificacoes KYC realizadas.

- **Autorizacao:** `OFICIAL_COMPLIANCE`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `beneficiarioId` | string | Filtra por identificador do beneficiario |
| `resultado` | string | Filtra por resultado: `APROVADO`, `REPROVADO`, `INCONCLUSIVO` |
| `dataInicio` | string (date) | Filtra verificacoes a partir desta data |
| `dataFim` | string (date) | Filtra verificacoes ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "KYC-2026-001",
      "beneficiarioId": "PES-2026-001",
      "contexto": "PRIMEIRO_PAGAMENTO",
      "resultado": "APROVADO",
      "dataVerificacao": "2026-04-14"
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
| `400` | `FILTRO_KYC_INVALIDO` | Os filtros informados para consulta de verificacoes KYC sao invalidos. |

---

#### `GET /api/v1/m017/verificacoes-kyc/{codigo}`

Consulta o detalhe de uma verificacao KYC pelo codigo.

- **Autorizacao:** `OFICIAL_COMPLIANCE`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da verificacao KYC (ex: `KYC-2026-001`) |

**Response `200 OK`**

```json
{
  "verificacaoKYC": {
    "codigo": "KYC-2026-001",
    "beneficiarioId": "PES-2026-001",
    "contexto": "PRIMEIRO_PAGAMENTO",
    "resultado": "APROVADO",
    "dataVerificacao": "2026-04-14"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `VERIFICACAO_KYC_NAO_ENCONTRADA` | A verificacao KYC informada nao foi encontrada. |

---

### 2. Monitoramento PLD

#### `POST /api/v1/m017/monitoramentos`

Executa o monitoramento diario PLD consultando listas restritivas e gerando alertas automaticos.

- **Autorizacao:** `SISTEMA`
- **Operacao de origem:** `ExecutarMonitoramentoDiarioPLD`
- **Idempotencia:** Sim — por dataReferencia (janela de processamento)

**Request body**

```json
{
  "dataReferencia": "2026-04-13",
  "parametrosMonitoramento": {
    "valorLimite": 50000.0
  }
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `dataReferencia` | string (date) | Sim | Data de referencia do monitoramento |
| `parametrosMonitoramento` | object | Nao | Parametros configuraveis do monitoramento |
| `parametrosMonitoramento.valorLimite` | number | Nao | Valor limite para identificacao de operacao atipica |

**Response `201 Created`**

```json
{
  "monitoramento": {
    "codigo": "MON-2026-013",
    "dataReferencia": "2026-04-13",
    "alertasGerados": 2,
    "consultasExecutadas": 120,
    "status": "CONCLUIDO"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `LISTA_RESTRITIVA_INDISPONIVEL` | Nao foi possivel consultar as listas restritivas na execucao diaria. |
| `400` | `PARAMETRO_MONITORAMENTO_INVALIDO` | Os parametros configurados para monitoramento PLD sao invalidos. |

---

### 3. Alertas PLD

#### `GET /api/v1/m017/alertas`

Lista e filtra alertas PLD gerados pelo monitoramento.

- **Autorizacao:** `OFICIAL_COMPLIANCE`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra por estado: `PENDENTE`, `EM_ANALISE`, `CONFIRMADO`, `DESCARTADO` |
| `tipo` | string | Filtra por tipo de alerta |
| `dataInicio` | string (date) | Filtra alertas gerados a partir desta data |
| `dataFim` | string (date) | Filtra alertas gerados ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "APLD-2026-001",
      "tipo": "FRACIONAMENTO",
      "estado": "PENDENTE",
      "dataGeracao": "2026-04-13",
      "beneficiarioId": "PES-2026-001"
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
| `400` | `FILTRO_ALERTA_PLD_INVALIDO` | Os filtros informados para consulta de alertas PLD sao invalidos. |

---

#### `GET /api/v1/m017/alertas/{codigo}`

Consulta o detalhe de um alerta PLD.

- **Autorizacao:** `OFICIAL_COMPLIANCE`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do alerta PLD (ex: `APLD-2026-001`) |

**Response `200 OK`**

```json
{
  "alertaPLD": {
    "codigo": "APLD-2026-001",
    "tipo": "FRACIONAMENTO",
    "estado": "PENDENTE",
    "dataGeracao": "2026-04-13",
    "beneficiarioId": "PES-2026-001",
    "descricao": "Fracionamento atipico de pagamentos detectado."
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `ALERTA_PLD_NAO_ENCONTRADO` | O alerta PLD informado nao foi encontrado. |

---

#### `POST /api/v1/m017/alertas/{codigo}/analisar`

Registra a analise de um alerta PLD, confirmando ou descartando com justificativa.

- **Autorizacao:** `OFICIAL_COMPLIANCE`
- **Operacao de origem:** `RegistrarAnaliseDeAlertaPLD`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do alerta PLD |

**Request body**

```json
{
  "confirmado": false,
  "justificativa": "Movimentacao compativel com historico aprovado.",
  "parecer": "Sem indicios adicionais de irregularidade."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `confirmado` | boolean | Sim | Indica se o alerta foi confirmado (`true`) ou descartado (`false`) |
| `justificativa` | string | Sim (quando descartado) | Justificativa obrigatoria para descarte do alerta |
| `parecer` | string | Nao | Parecer tecnico complementar do oficial de compliance |

**Response `200 OK`**

```json
{
  "analiseAlerta": {
    "alertaCodigo": "APLD-2026-001",
    "confirmado": false,
    "justificativa": "Movimentacao compativel com historico aprovado.",
    "analista": "oficial@agencia.br",
    "dataAnalise": "2026-04-14T10:30:00Z"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `ALERTA_PLD_NAO_ENCONTRADO` | O alerta PLD informado nao foi encontrado para analise. |
| `422` | `DESCARTE_ALERTA_SEM_JUSTIFICATIVA` | Alertas descartados exigem justificativa obrigatoria do oficial de compliance. |
| `422` | `ALERTA_JA_ANALISADO` | O alerta PLD informado ja foi analisado e nao pode ser reanalisado. |

---

### 4. Bloqueios Preventivos de Pagamento

#### `POST /api/v1/m017/bloqueios`

Bloqueia preventivamente um pagamento relacionado a alerta PLD.

- **Autorizacao:** `OFICIAL_COMPLIANCE`
- **Operacao de origem:** `DecidirBloqueioPreventivoDePagamento` (bloquear)
- **Idempotencia:** Nao

**Request body**

```json
{
  "alertaCodigo": "APLD-2026-001",
  "pagamentoId": "PAG-2026-210"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `alertaCodigo` | string | Sim | Codigo do alerta PLD que fundamenta o bloqueio |
| `pagamentoId` | string | Sim | Identificador do pagamento a ser bloqueado (M004) |

**Response `201 Created`**

```json
{
  "bloqueioPagamento": {
    "codigo": "BLQ-2026-001",
    "alertaCodigo": "APLD-2026-001",
    "pagamentoId": "PAG-2026-210",
    "ativo": true,
    "dataBloqueio": "2026-04-14T11:00:00Z"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `ALERTA_PLD_NAO_ENCONTRADO` | O alerta PLD informado nao foi encontrado. |
| `404` | `PAGAMENTO_NAO_ENCONTRADO` | O pagamento informado nao foi encontrado. |
| `409` | `PAGAMENTO_BLOQUEADO_JA_EXISTENTE` | O pagamento informado ja possui bloqueio preventivo ativo. |

---

#### `POST /api/v1/m017/bloqueios/{codigo}/desbloquear`

Desbloqueia preventivamente um pagamento mediante autorizacao de diretor.

- **Autorizacao:** `DIRETORIA_AUTORIZADA`
- **Operacao de origem:** `DecidirBloqueioPreventivoDePagamento` (desbloquear)
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do bloqueio (ex: `BLQ-2026-001`) |

**Request body**

```json
{
  "justificativa": "Verificacao concluida sem indicios. Pagamento liberado por determinacao da diretoria."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Justificativa formal do diretor para o desbloqueio |

**Response `200 OK`**

```json
{
  "bloqueioPagamento": {
    "codigo": "BLQ-2026-001",
    "ativo": false,
    "dataDesbloqueio": "2026-04-14T14:00:00Z",
    "autorizadoPor": "diretor@agencia.br"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `BLOQUEIO_NAO_ENCONTRADO` | O bloqueio preventivo informado nao foi encontrado. |
| `422` | `BLOQUEIO_JA_INATIVO` | O bloqueio informado ja esta inativo. |
| `422` | `DESBLOQUEIO_SEM_AUTORIZACAO_DIRETORIA` | O desbloqueio exige autorizacao formal de diretor responsavel. |

---

#### `GET /api/v1/m017/bloqueios`

Lista e filtra bloqueios preventivos de pagamento.

- **Autorizacao:** `OFICIAL_COMPLIANCE`, `DIRETORIA_AUTORIZADA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `ativo` | boolean | Filtra por estado ativo (`true`) ou inativo (`false`) |
| `pagamentoId` | string | Filtra por identificador do pagamento |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "BLQ-2026-001",
      "alertaCodigo": "APLD-2026-001",
      "pagamentoId": "PAG-2026-210",
      "ativo": true,
      "dataBloqueio": "2026-04-14T11:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

### 5. Reportes COAF

#### `POST /api/v1/m017/reportes-coaf`

Gera reporte formal de alerta confirmado para o COAF.

- **Autorizacao:** `OFICIAL_COMPLIANCE`
- **Operacao de origem:** `GerarReporteCOAF`
- **Idempotencia:** Nao

**Request body**

```json
{
  "alertaCodigo": "APLD-2026-001",
  "descricaoOperacao": "Fracionamento atipico de pagamentos.",
  "valorOperacao": 78000.0
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `alertaCodigo` | string | Sim | Codigo do alerta confirmado que origina o reporte |
| `descricaoOperacao` | string | Sim | Descricao detalhada da operacao suspeita |
| `valorOperacao` | number | Sim | Valor total da operacao suspeita |

**Response `201 Created`**

```json
{
  "reporteCOAF": {
    "codigo": "RCOAF-2026-001",
    "alertaCodigo": "APLD-2026-001",
    "dataGeracao": "2026-04-14",
    "valorOperacao": 78000.0
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `ALERTA_PLD_NAO_ENCONTRADO` | O alerta PLD informado nao foi encontrado. |
| `422` | `ALERTA_NAO_CONFIRMADO_PARA_REPORTE` | Somente alertas confirmados podem gerar reporte ao COAF. |
| `400` | `DADOS_REPORTE_INCOMPLETOS` | O reporte ao COAF exige descricao e valor completos da operacao suspeita. |

---

#### `GET /api/v1/m017/reportes-coaf`

Lista reportes COAF gerados.

- **Autorizacao:** `OFICIAL_COMPLIANCE`, `DIRETORIA_AUTORIZADA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `dataInicio` | string (date) | Filtra reportes gerados a partir desta data |
| `dataFim` | string (date) | Filtra reportes gerados ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "RCOAF-2026-001",
      "alertaCodigo": "APLD-2026-001",
      "dataGeracao": "2026-04-14",
      "valorOperacao": 78000.0
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

### 6. Dashboard PLD

#### `GET /api/v1/m017/dashboard`

Consulta verificacoes, alertas, bloqueios e reportes do dominio PLD de forma consolidada.

- **Autorizacao:** `OFICIAL_COMPLIANCE`
- **Operacao de origem:** `ConsultarDashboardPLD`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `periodoInicio` | string (date) | Inicio do periodo de consolidacao |
| `periodoFim` | string (date) | Fim do periodo de consolidacao |
| `estadoAlerta` | string | Filtra por estado do alerta: `PENDENTE`, `CONFIRMADO`, `DESCARTADO` |
| `tipoAlerta` | string | Filtra por tipo de alerta |

**Response `200 OK`**

```json
{
  "dashboardPLD": {
    "periodoInicio": "2026-04-01",
    "periodoFim": "2026-04-13",
    "alertasGerados": 5,
    "alertasEmAnalise": 2,
    "alertasConfirmados": 1,
    "alertasDescartados": 2,
    "bloqueiosAtivos": 1,
    "reportesCOAFGerados": 1,
    "verificacoesKYCRealizadas": 18
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `ACESSO_DASHBOARD_PLD_NEGADO` | O dashboard PLD e acessivel apenas a usuarios com perfil de compliance. |
| `422` | `DASHBOARD_PLD_INDISPONIVEL` | Nao foi possivel consolidar os indicadores do dashboard PLD neste momento. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m017/verificacoes-kyc` | ExecutarVerificacaoKYC | MODULO_INTERNO, OFICIAL_COMPLIANCE |
| `GET` | `/api/v1/m017/verificacoes-kyc` | ListarVerificacoesKYC | OFICIAL_COMPLIANCE |
| `GET` | `/api/v1/m017/verificacoes-kyc/{codigo}` | ConsultarVerificacaoKYC | OFICIAL_COMPLIANCE, MODULO_INTERNO |
| `POST` | `/api/v1/m017/monitoramentos` | ExecutarMonitoramentoDiarioPLD | SISTEMA |
| `GET` | `/api/v1/m017/alertas` | ListarAlertasPLD | OFICIAL_COMPLIANCE |
| `GET` | `/api/v1/m017/alertas/{codigo}` | ConsultarAlertaPLD | OFICIAL_COMPLIANCE |
| `POST` | `/api/v1/m017/alertas/{codigo}/analisar` | RegistrarAnaliseDeAlertaPLD | OFICIAL_COMPLIANCE |
| `POST` | `/api/v1/m017/bloqueios` | BloquearPagamentoPreventivamente | OFICIAL_COMPLIANCE |
| `POST` | `/api/v1/m017/bloqueios/{codigo}/desbloquear` | DesbloquearPagamentoPreventivamente | DIRETORIA_AUTORIZADA |
| `GET` | `/api/v1/m017/bloqueios` | ListarBloqueiosPreventivos | OFICIAL_COMPLIANCE, DIRETORIA_AUTORIZADA |
| `POST` | `/api/v1/m017/reportes-coaf` | GerarReporteCOAF | OFICIAL_COMPLIANCE |
| `GET` | `/api/v1/m017/reportes-coaf` | ListarReportesCOAF | OFICIAL_COMPLIANCE, DIRETORIA_AUTORIZADA |
| `GET` | `/api/v1/m017/dashboard` | ConsultarDashboardPLD | OFICIAL_COMPLIANCE |

---

## Schemas de Dominio (Referencia)

### VerificacaoKYC

```json
{
  "codigo": "string",
  "beneficiarioId": "string",
  "contexto": "PRIMEIRO_PAGAMENTO | ATUALIZACAO_CADASTRAL",
  "resultado": "APROVADO | REPROVADO | INCONCLUSIVO",
  "dataVerificacao": "string (YYYY-MM-DD)"
}
```

### AlertaPLD

```json
{
  "codigo": "string",
  "tipo": "string",
  "estado": "PENDENTE | EM_ANALISE | CONFIRMADO | DESCARTADO",
  "dataGeracao": "string (YYYY-MM-DD)",
  "beneficiarioId": "string",
  "descricao": "string"
}
```

### AnaliseAlerta

```json
{
  "alertaCodigo": "string",
  "confirmado": "boolean",
  "justificativa": "string",
  "parecer": "string (opcional)",
  "analista": "string",
  "dataAnalise": "string (ISO 8601)"
}
```

### BloqueioPagamento

```json
{
  "codigo": "string",
  "alertaCodigo": "string",
  "pagamentoId": "string",
  "ativo": "boolean",
  "dataBloqueio": "string (ISO 8601)",
  "dataDesbloqueio": "string (ISO 8601) | null",
  "autorizadoPor": "string | null"
}
```

### ReporteCOAF

```json
{
  "codigo": "string",
  "alertaCodigo": "string",
  "descricaoOperacao": "string",
  "valorOperacao": "number",
  "dataGeracao": "string (YYYY-MM-DD)"
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
| EPIC-M017-001 (Verificacao Cadastral KYC) | [epics/EPIC-M017-001.md](epics/EPIC-M017-001.md) |
| EPIC-M017-002 (Monitoramento de Transacoes) | [epics/EPIC-M017-002.md](epics/EPIC-M017-002.md) |
| EPIC-M017-003 (Bloqueio e Reporte) | [epics/EPIC-M017-003.md](epics/EPIC-M017-003.md) |
| EPIC-M017-004 (Auditoria e Dashboard PLD) | [epics/EPIC-M017-004.md](epics/EPIC-M017-004.md) |
