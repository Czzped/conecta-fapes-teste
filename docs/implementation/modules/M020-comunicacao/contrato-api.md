# Contrato de API HTTP — M020 Comunicacao

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M020 como servico transversal de comunicacao da plataforma ConectaFAPES. O modulo e responsavel por registrar notificacoes, processar envios, gerenciar templates, operar comunicados em massa e disparar lembretes automaticos. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m020
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Formato de data-hora | ISO 8601 — `YYYY-MM-DDTHH:MM:SSZ` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `NTF-2026-001`, `TPL-001`, `COM-2026-001`, `LEM-2026-001`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `SERVIDOR_AREA_TECNICA` | Servidor da Area Tecnica — configura templates, consulta historico, solicita comunicados e configura lembretes |
| `DIRETOR` | Diretor — aprova ou rejeita comunicados em massa |
| `MODULO_INTERNO` | Modulo interno autorizado — dispara eventos de negocio para geracao de notificacao |
| `SISTEMA` | Sistema — executa jobs asincronos de envio e processamento de lembretes |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "codigo": "NTF-2026-001"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Notificacao, template ou comunicado nao encontrado |
| `409 Conflict` | Conflito de estado | Evento ja registrado com a mesma chave de deduplicacao |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido, template mandatorio, limite de tentativas |

---

## Recursos

### 1. Notificacoes

#### `POST /api/v1/m020/notificacoes`

Registra uma notificacao pendente a partir de evento de negocio de outro modulo.

- **Autorizacao:** `MODULO_INTERNO`
- **Operacao de origem:** `ReceberEventoDeNegocioParaNotificacao`
- **Idempotencia:** Sim — por chaveEvento quando houver mecanismo de deduplicacao

**Request body**

```json
{
  "eventoOrigem": "BOLSA_IMPLEMENTADA",
  "moduloOrigem": "M009",
  "destinatarios": [
    {
      "email": "bolsista@exemplo.br",
      "nome": "Maria Oliveira"
    }
  ],
  "dados": {
    "codigoBolsa": "BP-2026-004",
    "status": "IMPLEMENTADA"
  },
  "chaveEvento": "M009-BP-2026-004-BOLSA_IMPLEMENTADA"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `eventoOrigem` | string | Sim | Nome do evento de negocio que origina a notificacao |
| `moduloOrigem` | string | Sim | Identificador do modulo de origem (ex: `M009`) |
| `destinatarios` | array | Sim | Lista de destinatarios da notificacao |
| `destinatarios[].email` | string (email) | Sim | Email do destinatario |
| `destinatarios[].nome` | string | Sim | Nome do destinatario para resolucao de variaveis do template |
| `dados` | object | Sim | Dados dinamicos para resolucao de variaveis do template |
| `chaveEvento` | string | Nao | Chave unica para deduplicacao do evento |

**Response `201 Created`**

```json
{
  "notificacao": {
    "codigo": "NTF-2026-001",
    "estado": "PENDENTE",
    "moduloOrigem": "M009",
    "eventoOrigem": "BOLSA_IMPLEMENTADA",
    "totalDestinatarios": 1
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `TEMPLATE_NOTIFICACAO_INEXISTENTE` | Nao existe template ativo compativel com o evento informado. |
| `422` | `DADOS_TEMPLATE_INSUFICIENTES` | Os dados informados nao sao suficientes para resolver as variaveis do template. |
| `400` | `NOTIFICACAO_DADOS_INVALIDOS` | Os dados obrigatorios para registro da notificacao nao foram informados corretamente. |
| `409` | `NOTIFICACAO_EVENTO_DUPLICADO` | Ja existe uma notificacao registrada para a chave de evento informada. |

---

#### `GET /api/v1/m020/notificacoes`

Consulta notificacoes enviadas, seus estados e tentativas.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`
- **Operacao de origem:** `ConsultarHistoricoDeNotificacoes`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `moduloOrigem` | string | Filtra por modulo de origem (ex: `M009`) |
| `estado` | string | Filtra por estado: `PENDENTE`, `ENVIADA`, `FALHA`, `LIMITE_EXCEDIDO` |
| `destinatarioEmail` | string | Filtra por email do destinatario |
| `periodoInicio` | string (date) | Filtra notificacoes a partir desta data |
| `periodoFim` | string (date) | Filtra notificacoes ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "NTF-2026-001",
      "eventoOrigem": "BOLSA_IMPLEMENTADA",
      "moduloOrigem": "M009",
      "destinatarioEmail": "bolsista@exemplo.br",
      "estado": "ENVIADA",
      "tentativasEnvio": 1,
      "historico": [
        {
          "tentativa": 1,
          "sucesso": true,
          "dataEnvio": "2026-04-14T10:05:00Z",
          "mensagemErro": null
        }
      ]
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
| `404` | `HISTORICO_NOTIFICACAO_NAO_ENCONTRADO` | Nenhuma notificacao foi encontrada para o filtro informado. |
| `400` | `FILTRO_HISTORICO_INVALIDO` | Os filtros informados para consulta de historico sao invalidos. |

---

#### `GET /api/v1/m020/notificacoes/{codigo}`

Consulta o detalhe de uma notificacao especifica.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo da notificacao (ex: `NTF-2026-001`) |

**Response `200 OK`**

```json
{
  "notificacao": {
    "codigo": "NTF-2026-001",
    "eventoOrigem": "BOLSA_IMPLEMENTADA",
    "moduloOrigem": "M009",
    "estado": "ENVIADA",
    "tentativasEnvio": 1,
    "destinatarios": [
      {
        "email": "bolsista@exemplo.br",
        "nome": "Maria Oliveira"
      }
    ],
    "historico": [
      {
        "tentativa": 1,
        "sucesso": true,
        "dataEnvio": "2026-04-14T10:05:00Z",
        "mensagemErro": null
      }
    ]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `NOTIFICACAO_NAO_ENCONTRADA` | A notificacao informada nao foi encontrada. |

---

#### `POST /api/v1/m020/notificacoes/processar`

Resolve templates, envia emails, registra historico e trata retry de notificacoes pendentes.

- **Autorizacao:** `SISTEMA`
- **Operacao de origem:** `ProcessarEnvioDeNotificacao`
- **Idempotencia:** Sim — por notificacao enquanto respeitar o limite de tentativas

**Request body**

```json
{
  "notificacoes": [
    "NTF-2026-001",
    "NTF-2026-002"
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `notificacoes` | array (string) | Sim | Lista de codigos de notificacoes pendentes ou em reenvio |

**Response `200 OK`**

```json
{
  "processamento": {
    "processadas": 2,
    "enviadas": 1,
    "falhas": 1
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `PROVEDOR_EMAIL_INDISPONIVEL` | O provedor de email institucional esta indisponivel no momento. |
| `422` | `LIMITE_TENTATIVAS_EXCEDIDO` | A notificacao atingiu o limite maximo de tentativas de envio. |

---

### 2. Templates de Notificacao

#### `POST /api/v1/m020/templates`

Cria um novo template de notificacao.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`
- **Operacao de origem:** `ConfigurarTemplateNotificacao` (criacao)
- **Idempotencia:** Nao

**Request body**

```json
{
  "nome": "Bolsa implementada",
  "eventoOrigem": "BOLSA_IMPLEMENTADA",
  "assuntoTemplate": "Bolsa {{codigoBolsa}} - {{status}}",
  "corpoTemplate": "<p>Ola {{nome}}, sua bolsa foi {{status}}.</p>",
  "tipo": "MUDANCA_STATUS",
  "mandatorio": true,
  "ativo": true
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `nome` | string | Sim | Nome identificador do template |
| `eventoOrigem` | string | Sim | Evento de negocio ao qual o template esta vinculado |
| `assuntoTemplate` | string | Sim | Assunto do email com suporte a variaveis `{{variavel}}` |
| `corpoTemplate` | string | Sim | Corpo HTML do email com suporte a variaveis `{{variavel}}` |
| `tipo` | string (enum) | Sim | Um de: `MUDANCA_STATUS`, `PRAZO`, `APROVACAO`, `INFORMATIVO` |
| `mandatorio` | boolean | Sim | Indica se e template mandatorio (nao permite opt-out) |
| `ativo` | boolean | Sim | Indica se o template esta ativo |

**Response `201 Created`**

```json
{
  "templateNotificacao": {
    "codigo": "TPL-001",
    "nome": "Bolsa implementada",
    "eventoOrigem": "BOLSA_IMPLEMENTADA",
    "tipo": "MUDANCA_STATUS",
    "mandatorio": true,
    "ativo": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `TEMPLATE_DADOS_INVALIDOS` | Os dados informados para o template de notificacao sao invalidos. |
| `409` | `TEMPLATE_EVENTO_DUPLICADO` | Ja existe um template ativo vinculado ao evento de origem informado. |

---

#### `GET /api/v1/m020/templates`

Lista templates de notificacao cadastrados.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipo` | string | Filtra por tipo: `MUDANCA_STATUS`, `PRAZO`, `APROVACAO`, `INFORMATIVO` |
| `ativo` | boolean | Filtra por estado ativo (`true`) ou inativo (`false`) |
| `eventoOrigem` | string | Filtra por evento de negocio vinculado |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "TPL-001",
      "nome": "Bolsa implementada",
      "eventoOrigem": "BOLSA_IMPLEMENTADA",
      "tipo": "MUDANCA_STATUS",
      "mandatorio": true,
      "ativo": true
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m020/templates/{codigo}`

Consulta o detalhe de um template de notificacao.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do template (ex: `TPL-001`) |

**Response `200 OK`**

```json
{
  "templateNotificacao": {
    "codigo": "TPL-001",
    "nome": "Bolsa implementada",
    "eventoOrigem": "BOLSA_IMPLEMENTADA",
    "assuntoTemplate": "Bolsa {{codigoBolsa}} - {{status}}",
    "corpoTemplate": "<p>Ola {{nome}}, sua bolsa foi {{status}}.</p>",
    "tipo": "MUDANCA_STATUS",
    "mandatorio": true,
    "ativo": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `TEMPLATE_NAO_ENCONTRADO` | O template de notificacao informado nao foi encontrado. |

---

#### `PUT /api/v1/m020/templates/{codigo}`

Atualiza os dados de um template de notificacao.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`
- **Operacao de origem:** `ConfigurarTemplateNotificacao` (alteracao)
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do template |

**Request body**

```json
{
  "nome": "Bolsa implementada - atualizado",
  "assuntoTemplate": "Bolsa {{codigoBolsa}} foi {{status}}",
  "corpoTemplate": "<p>Ola {{nome}}, sua bolsa {{codigoBolsa}} foi {{status}}.</p>",
  "tipo": "MUDANCA_STATUS",
  "mandatorio": true,
  "ativo": true
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `nome` | string | Sim | Nome identificador do template |
| `assuntoTemplate` | string | Sim | Novo assunto do email |
| `corpoTemplate` | string | Sim | Novo corpo HTML do email |
| `tipo` | string (enum) | Sim | Tipo do template |
| `mandatorio` | boolean | Sim | Indica se e mandatorio |
| `ativo` | boolean | Sim | Indica se o template esta ativo |

**Response `200 OK`**

```json
{
  "templateNotificacao": {
    "codigo": "TPL-001",
    "nome": "Bolsa implementada - atualizado",
    "eventoOrigem": "BOLSA_IMPLEMENTADA",
    "tipo": "MUDANCA_STATUS",
    "mandatorio": true,
    "ativo": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `TEMPLATE_NAO_ENCONTRADO` | O template de notificacao informado nao foi encontrado. |
| `422` | `TEMPLATE_MANDATORIO_NAO_PODE_SER_DESATIVADO` | Templates mandatorios nao podem ser desativados. |
| `400` | `TEMPLATE_DADOS_INVALIDOS` | Os dados informados para o template de notificacao sao invalidos. |

---

### 3. Comunicados em Massa

#### `POST /api/v1/m020/comunicados`

Registra um comunicado em massa para avaliacao do Diretor.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`
- **Operacao de origem:** `SolicitarComunicadoMassa`
- **Idempotencia:** Nao

**Request body**

```json
{
  "titulo": "Atualizacao de cronograma",
  "corpo": "O cronograma do edital foi atualizado.",
  "publicoAlvo": "Bolsistas do Edital 01/2026",
  "templateCodigo": "TPL-020"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `titulo` | string | Sim | Titulo do comunicado em massa |
| `corpo` | string | Sim | Corpo da mensagem do comunicado |
| `publicoAlvo` | string | Sim | Descricao ou identificador do publico alvo |
| `templateCodigo` | string | Sim | Codigo do template de notificacao a ser usado |

**Response `201 Created`**

```json
{
  "comunicadoMassa": {
    "codigo": "COM-2026-001",
    "titulo": "Atualizacao de cronograma",
    "estado": "AGUARDANDO_APROVACAO",
    "totalDestinatarios": 240,
    "solicitadoPor": "servidor@agencia.br",
    "dataSolicitacao": "2026-04-14T09:00:00Z"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `PUBLICO_ALVO_INVALIDO` | O publico alvo informado para o comunicado em massa e invalido. |
| `422` | `TEMPLATE_COMUNICADO_INVALIDO` | O template informado nao pode ser usado para comunicado em massa. |
| `400` | `COMUNICADO_DADOS_INVALIDOS` | Os dados obrigatorios do comunicado em massa nao foram informados corretamente. |

---

#### `GET /api/v1/m020/comunicados`

Lista comunicados em massa.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`, `DIRETOR`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra por estado: `AGUARDANDO_APROVACAO`, `APROVADO`, `REJEITADO`, `EM_ENVIO`, `CONCLUIDO` |
| `dataInicio` | string (date) | Filtra comunicados criados a partir desta data |
| `dataFim` | string (date) | Filtra comunicados criados ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "COM-2026-001",
      "titulo": "Atualizacao de cronograma",
      "estado": "AGUARDANDO_APROVACAO",
      "totalDestinatarios": 240,
      "dataSolicitacao": "2026-04-14T09:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m020/comunicados/{codigo}`

Consulta o detalhe de um comunicado em massa.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`, `DIRETOR`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do comunicado (ex: `COM-2026-001`) |

**Response `200 OK`**

```json
{
  "comunicadoMassa": {
    "codigo": "COM-2026-001",
    "titulo": "Atualizacao de cronograma",
    "corpo": "O cronograma do edital foi atualizado.",
    "publicoAlvo": "Bolsistas do Edital 01/2026",
    "templateCodigo": "TPL-020",
    "estado": "AGUARDANDO_APROVACAO",
    "totalDestinatarios": 240,
    "solicitadoPor": "servidor@agencia.br",
    "dataSolicitacao": "2026-04-14T09:00:00Z"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `COMUNICADO_NAO_ENCONTRADO` | O comunicado em massa informado nao foi encontrado. |

---

#### `POST /api/v1/m020/comunicados/{codigo}/aprovar`

Aprova um comunicado em massa e libera o processamento de envio.

- **Autorizacao:** `DIRETOR`
- **Operacao de origem:** `AprovarComunicadoMassa`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do comunicado em massa |

**Sem corpo na requisicao.**

**Response `200 OK`**

```json
{
  "comunicadoMassa": {
    "codigo": "COM-2026-001",
    "estado": "APROVADO",
    "aprovadoPor": "diretor@agencia.br",
    "dataAprovacao": "2026-04-14T15:00:00Z"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `COMUNICADO_NAO_ENCONTRADO` | O comunicado em massa informado nao foi encontrado. |
| `422` | `COMUNICADO_ESTADO_INVALIDO` | Somente comunicados aguardando aprovacao podem ser aprovados. |

---

#### `POST /api/v1/m020/comunicados/{codigo}/rejeitar`

Rejeita um comunicado em massa e registra justificativa.

- **Autorizacao:** `DIRETOR`
- **Operacao de origem:** `RejeitarComunicadoMassa`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do comunicado em massa |

**Request body**

```json
{
  "justificativa": "O publico alvo precisa ser refinado antes do envio."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Justificativa formal do diretor para a rejeicao |

**Response `200 OK`**

```json
{
  "comunicadoMassa": {
    "codigo": "COM-2026-001",
    "estado": "REJEITADO",
    "rejeitadoPor": "diretor@agencia.br",
    "dataRejeicao": "2026-04-14T15:30:00Z",
    "justificativa": "O publico alvo precisa ser refinado antes do envio."
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `COMUNICADO_NAO_ENCONTRADO` | O comunicado em massa informado nao foi encontrado. |
| `422` | `JUSTIFICATIVA_OBRIGATORIA` | E obrigatorio informar justificativa para rejeitar o comunicado. |
| `422` | `COMUNICADO_ESTADO_INVALIDO` | Somente comunicados aguardando aprovacao podem ser rejeitados. |

---

### 4. Lembretes de Prazo

#### `POST /api/v1/m020/lembretes`

Registra um lembrete automatico de prazo para uma entidade de outro modulo.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConfigurarLembreteDePrazo` (criacao)
- **Idempotencia:** Nao

**Request body**

```json
{
  "moduloOrigem": "M014",
  "entidadeReferencia": "PrestacaoContas",
  "entidadeId": "PC-2026-013",
  "dataPrazo": "2026-05-20",
  "diasAntecedencia": 15,
  "ativo": true
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `moduloOrigem` | string | Sim | Identificador do modulo que origina o lembrete (ex: `M014`) |
| `entidadeReferencia` | string | Sim | Nome da entidade associada ao prazo (ex: `PrestacaoContas`) |
| `entidadeId` | string | Sim | Identificador da entidade no modulo de origem |
| `dataPrazo` | string (date) | Sim | Data do prazo que dispara o lembrete |
| `diasAntecedencia` | integer | Sim | Quantos dias antes do prazo o lembrete e enviado |
| `ativo` | boolean | Sim | Indica se o lembrete esta ativo |

**Response `201 Created`**

```json
{
  "lembretePrazo": {
    "codigo": "LEM-2026-001",
    "moduloOrigem": "M014",
    "entidadeReferencia": "PrestacaoContas",
    "entidadeId": "PC-2026-013",
    "dataPrazo": "2026-05-20",
    "diasAntecedencia": 15,
    "ativo": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `ENTIDADE_REFERENCIA_INVALIDA` | A entidade de referencia informada nao pode receber lembrete de prazo. |
| `400` | `DATA_PRAZO_OBRIGATORIA` | E obrigatorio informar a data de prazo do lembrete. |
| `400` | `LEMBRETE_DADOS_INVALIDOS` | Os dados obrigatorios do lembrete de prazo nao foram informados corretamente. |

---

#### `GET /api/v1/m020/lembretes`

Lista lembretes de prazo cadastrados.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `moduloOrigem` | string | Filtra por modulo de origem |
| `entidadeReferencia` | string | Filtra por tipo de entidade |
| `ativo` | boolean | Filtra por estado ativo (`true`) ou inativo (`false`) |
| `dataInicio` | string (date) | Filtra lembretes com prazo a partir desta data |
| `dataFim` | string (date) | Filtra lembretes com prazo ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "codigo": "LEM-2026-001",
      "moduloOrigem": "M014",
      "entidadeReferencia": "PrestacaoContas",
      "entidadeId": "PC-2026-013",
      "dataPrazo": "2026-05-20",
      "diasAntecedencia": 15,
      "ativo": true
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m020/lembretes/{codigo}`

Consulta o detalhe de um lembrete de prazo.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do lembrete (ex: `LEM-2026-001`) |

**Response `200 OK`**

```json
{
  "lembretePrazo": {
    "codigo": "LEM-2026-001",
    "moduloOrigem": "M014",
    "entidadeReferencia": "PrestacaoContas",
    "entidadeId": "PC-2026-013",
    "dataPrazo": "2026-05-20",
    "diasAntecedencia": 15,
    "ativo": true,
    "ultimoEnvio": null
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `LEMBRETE_NAO_ENCONTRADO` | O lembrete de prazo informado nao foi encontrado. |

---

#### `PUT /api/v1/m020/lembretes/{codigo}`

Atualiza ou desativa um lembrete de prazo.

- **Autorizacao:** `SERVIDOR_AREA_TECNICA`
- **Operacao de origem:** `ConfigurarLembreteDePrazo` (alteracao)
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `codigo` | string | Codigo do lembrete |

**Request body**

```json
{
  "dataPrazo": "2026-05-25",
  "diasAntecedencia": 10,
  "ativo": false
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `dataPrazo` | string (date) | Sim | Nova data do prazo |
| `diasAntecedencia` | integer | Sim | Novo valor de antecedencia em dias |
| `ativo` | boolean | Sim | Novo estado do lembrete |

**Response `200 OK`**

```json
{
  "lembretePrazo": {
    "codigo": "LEM-2026-001",
    "dataPrazo": "2026-05-25",
    "diasAntecedencia": 10,
    "ativo": false
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `LEMBRETE_NAO_ENCONTRADO` | O lembrete de prazo informado nao foi encontrado. |
| `400` | `LEMBRETE_DADOS_INVALIDOS` | Os dados informados para atualizacao do lembrete sao invalidos. |

---

#### `POST /api/v1/m020/lembretes/processar`

Avalia lembretes ativos e gera notificacoes automaticas na antecedencia configurada.

- **Autorizacao:** `SISTEMA`
- **Operacao de origem:** `ProcessarLembretesAtivos`
- **Idempotencia:** Sim — por lembrete e marco temporal

**Request body**

```json
{
  "dataReferencia": "2026-05-05"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `dataReferencia` | string (date) | Sim | Data de referencia para avaliacao dos lembretes |

**Response `200 OK`**

```json
{
  "processamento": {
    "dataReferencia": "2026-05-05",
    "lembretesAvaliados": 35,
    "notificacoesGeradas": 12,
    "lembretesDesativados": 2
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `PROVEDOR_EMAIL_INDISPONIVEL` | O provedor de email institucional esta indisponivel durante o processamento dos lembretes. |
| `422` | `LEMBRETE_ENTIDADE_ENCERRADA` | O lembrete referencia uma entidade encerrada e nao pode mais gerar notificacao. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m020/notificacoes` | ReceberEventoDeNegocioParaNotificacao | MODULO_INTERNO |
| `GET` | `/api/v1/m020/notificacoes` | ConsultarHistoricoDeNotificacoes | SERVIDOR_AREA_TECNICA |
| `GET` | `/api/v1/m020/notificacoes/{codigo}` | ConsultarNotificacao | SERVIDOR_AREA_TECNICA |
| `POST` | `/api/v1/m020/notificacoes/processar` | ProcessarEnvioDeNotificacao | SISTEMA |
| `POST` | `/api/v1/m020/templates` | CriarTemplateNotificacao | SERVIDOR_AREA_TECNICA |
| `GET` | `/api/v1/m020/templates` | ListarTemplatesNotificacao | SERVIDOR_AREA_TECNICA |
| `GET` | `/api/v1/m020/templates/{codigo}` | ConsultarTemplateNotificacao | SERVIDOR_AREA_TECNICA |
| `PUT` | `/api/v1/m020/templates/{codigo}` | AtualizarTemplateNotificacao | SERVIDOR_AREA_TECNICA |
| `POST` | `/api/v1/m020/comunicados` | SolicitarComunicadoMassa | SERVIDOR_AREA_TECNICA |
| `GET` | `/api/v1/m020/comunicados` | ListarComunicadosMassa | SERVIDOR_AREA_TECNICA, DIRETOR |
| `GET` | `/api/v1/m020/comunicados/{codigo}` | ConsultarComunicadoMassa | SERVIDOR_AREA_TECNICA, DIRETOR |
| `POST` | `/api/v1/m020/comunicados/{codigo}/aprovar` | AprovarComunicadoMassa | DIRETOR |
| `POST` | `/api/v1/m020/comunicados/{codigo}/rejeitar` | RejeitarComunicadoMassa | DIRETOR |
| `POST` | `/api/v1/m020/lembretes` | CriarLembreteDePrazo | SERVIDOR_AREA_TECNICA, MODULO_INTERNO |
| `GET` | `/api/v1/m020/lembretes` | ListarLembretesDePrazo | SERVIDOR_AREA_TECNICA |
| `GET` | `/api/v1/m020/lembretes/{codigo}` | ConsultarLembreteDePrazo | SERVIDOR_AREA_TECNICA |
| `PUT` | `/api/v1/m020/lembretes/{codigo}` | AtualizarLembreteDePrazo | SERVIDOR_AREA_TECNICA |
| `POST` | `/api/v1/m020/lembretes/processar` | ProcessarLembretesAtivos | SISTEMA |

---

## Schemas de Dominio (Referencia)

### Notificacao

```json
{
  "codigo": "string",
  "eventoOrigem": "string",
  "moduloOrigem": "string",
  "estado": "PENDENTE | ENVIADA | FALHA | LIMITE_EXCEDIDO",
  "tentativasEnvio": "integer",
  "historico": [
    {
      "tentativa": "integer",
      "sucesso": "boolean",
      "dataEnvio": "string (ISO 8601)",
      "mensagemErro": "string | null"
    }
  ]
}
```

### TemplateNotificacao

```json
{
  "codigo": "string",
  "nome": "string",
  "eventoOrigem": "string",
  "assuntoTemplate": "string",
  "corpoTemplate": "string (HTML)",
  "tipo": "MUDANCA_STATUS | PRAZO | APROVACAO | INFORMATIVO",
  "mandatorio": "boolean",
  "ativo": "boolean"
}
```

### ComunicadoMassa

```json
{
  "codigo": "string",
  "titulo": "string",
  "corpo": "string",
  "publicoAlvo": "string",
  "templateCodigo": "string",
  "estado": "AGUARDANDO_APROVACAO | APROVADO | REJEITADO | EM_ENVIO | CONCLUIDO",
  "totalDestinatarios": "integer",
  "solicitadoPor": "string",
  "dataSolicitacao": "string (ISO 8601)"
}
```

### LembretePrazo

```json
{
  "codigo": "string",
  "moduloOrigem": "string",
  "entidadeReferencia": "string",
  "entidadeId": "string",
  "dataPrazo": "string (YYYY-MM-DD)",
  "diasAntecedencia": "integer",
  "ativo": "boolean",
  "ultimoEnvio": "string (ISO 8601) | null"
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
| EPIC-M020-001 (Servico de Notificacao) | [epics/EPIC-M020-001.md](epics/EPIC-M020-001.md) |
| EPIC-M020-002 (Comunicados e Lembretes) | [epics/EPIC-M020-002.md](epics/EPIC-M020-002.md) |
