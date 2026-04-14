# Contrato de API HTTP — M010 Planejamento e Estrategia

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M010 como bounded context responsavel por plano estrategico, eixos, programas, parcerias e recursos associados ao fomento. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m010
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `PE-2026-01`, `PROG-2026-01`, `PAR-2026-03`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `DIRETORIA` | Diretoria da Agencia de Fomento — manutencao e consulta do plano estrategico |
| `ANALISTA_AGENCIA` | Analista da Agencia de Fomento — gestao de programas e parcerias |
| `MODULO_INTERNO` | Modulo interno autorizado (M003, M011, M016, M018, M019) — acesso restrito a consultas de referencia |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "programa": "PROG-2026-01"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | Plano ativo duplicado |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido para a operacao solicitada |

---

## Recursos

### 1. Plano Estrategico

#### `POST /api/v1/m010/planos-estrategicos`

Registra ou atualiza plano estrategico com sua vigencia.

- **Autorizacao:** `DIRETORIA`
- **Operacao de origem:** `RegistrarPlanoEstrategico`
- **Idempotencia:** Nao

**Request body**

```json
{
  "nome": "Plano Estrategico 2026-2029",
  "descricao": "Diretrizes para o ciclo de fomento 2026-2029.",
  "dataInicio": "2026-01-01",
  "dataFim": "2029-12-31",
  "estado": "ATIVO"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `nome` | string | Sim | Nome do plano estrategico |
| `descricao` | string | Nao | Descricao das diretrizes do plano |
| `dataInicio` | string (date) | Sim | Data de inicio da vigencia |
| `dataFim` | string (date) | Sim | Data de fim da vigencia |
| `estado` | string (enum) | Sim | Um de: `ATIVO`, `INATIVO`, `EM_ELABORACAO` |

**Response `201 Created`**

```json
{
  "planoEstrategico": {
    "id": "PE-2026-01",
    "nome": "Plano Estrategico 2026-2029",
    "estado": "ATIVO",
    "dataInicio": "2026-01-01",
    "dataFim": "2029-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `PLANO_DADOS_INVALIDOS` | Os dados obrigatorios do plano estrategico nao foram informados corretamente. |
| `409` | `PLANO_ATIVO_DUPLICADO` | Ja existe outro plano estrategico ativo no periodo informado. |
| `422` | `VIGENCIA_PLANO_INVALIDA` | A vigencia informada para o plano estrategico e invalida. |

---

#### `GET /api/v1/m010/planos-estrategicos`

Lista os planos estrategicos cadastrados.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra por estado: `ATIVO`, `INATIVO`, `EM_ELABORACAO` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "PE-2026-01",
      "nome": "Plano Estrategico 2026-2029",
      "estado": "ATIVO",
      "dataInicio": "2026-01-01",
      "dataFim": "2029-12-31"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m010/planos-estrategicos/{id}`

Consulta o detalhe de um plano estrategico.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do plano estrategico |

**Response `200 OK`**

```json
{
  "planoEstrategico": {
    "id": "PE-2026-01",
    "nome": "Plano Estrategico 2026-2029",
    "descricao": "Diretrizes para o ciclo de fomento 2026-2029.",
    "estado": "ATIVO",
    "dataInicio": "2026-01-01",
    "dataFim": "2029-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PLANO_NAO_ENCONTRADO` | O plano estrategico informado nao foi encontrado. |

---

#### `PUT /api/v1/m010/planos-estrategicos/{id}`

Atualiza os dados de um plano estrategico existente (US-M010-001).

- **Autorizacao:** `DIRETORIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do plano estrategico |

**Request body**

```json
{
  "nome": "Plano Estrategico 2026-2030 (Revisado)",
  "descricao": "Diretrizes atualizadas para o ciclo de fomento.",
  "dataFim": "2030-12-31"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `nome` | string | Nao | Novo nome do plano |
| `descricao` | string | Nao | Nova descricao |
| `dataFim` | string (date) | Nao | Nova data de fim da vigencia |

**Response `200 OK`**

```json
{
  "planoEstrategico": {
    "id": "PE-2026-01",
    "nome": "Plano Estrategico 2026-2030 (Revisado)",
    "estado": "ATIVO",
    "dataFim": "2030-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PLANO_NAO_ENCONTRADO` | O plano estrategico informado nao foi encontrado. |
| `422` | `VIGENCIA_PLANO_INVALIDA` | A vigencia informada para o plano estrategico e invalida. |

---

### 2. Eixos Estrategicos

#### `POST /api/v1/m010/planos-estrategicos/{planoId}/eixos`

Cadastra um eixo estrategico vinculado a um plano (US-M010-002).

- **Autorizacao:** `DIRETORIA`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `planoId` | string | Identificador do plano estrategico |

**Request body**

```json
{
  "codigo": "EIXO-TRANSFORMACAO-DIGITAL",
  "nome": "Transformacao Digital",
  "descricao": "Iniciativas de inovacao e tecnologia no setor publico."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `codigo` | string | Sim | Codigo unico do eixo dentro do plano |
| `nome` | string | Sim | Nome do eixo estrategico |
| `descricao` | string | Nao | Descricao das diretrizes do eixo |

**Response `201 Created`**

```json
{
  "eixoEstrategico": {
    "id": "EIXO-TRANSFORMACAO-DIGITAL",
    "planoId": "PE-2026-01",
    "nome": "Transformacao Digital"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PLANO_NAO_ENCONTRADO` | O plano estrategico informado nao foi encontrado. |
| `409` | `EIXO_CODIGO_DUPLICADO` | Ja existe um eixo estrategico com o codigo informado neste plano. |
| `400` | `EIXO_DADOS_INVALIDOS` | Os dados obrigatorios do eixo nao foram informados corretamente. |

---

#### `GET /api/v1/m010/planos-estrategicos/{planoId}/eixos`

Lista os eixos estrategicos de um plano.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `planoId` | string | Identificador do plano estrategico |

**Response `200 OK`**

```json
{
  "planoId": "PE-2026-01",
  "eixos": [
    {
      "id": "EIXO-TRANSFORMACAO-DIGITAL",
      "nome": "Transformacao Digital",
      "descricao": "Iniciativas de inovacao e tecnologia no setor publico."
    }
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PLANO_NAO_ENCONTRADO` | O plano estrategico informado nao foi encontrado. |

---

### 3. Programas

#### `POST /api/v1/m010/programas`

Registra um novo programa associado a eixos estrategicos.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CriarPrograma`
- **Idempotencia:** Nao

**Request body**

```json
{
  "nome": "Programa de Dados Publicos",
  "eixos": [
    "EIXO-TRANSFORMACAO-DIGITAL"
  ],
  "resumo": "Programa voltado a projetos de dados e inovacao.",
  "beneficios": [
    "Amplia capacidade analitica do estado."
  ],
  "resultadosEsperados": [
    "Publicacao de datasets abertos."
  ],
  "parceriaReferenciaId": "PAR-2026-03"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `nome` | string | Sim | Nome do programa |
| `eixos` | array (string) | Sim | Lista de identificadores de eixos estrategicos |
| `resumo` | string | Nao | Resumo do programa |
| `beneficios` | array (string) | Nao | Lista de beneficios esperados |
| `resultadosEsperados` | array (string) | Nao | Lista de resultados esperados |
| `parceriaReferenciaId` | string | Nao | Identificador da parceria de referencia (opcional) |

**Response `201 Created`**

```json
{
  "programa": {
    "id": "PROG-2026-01",
    "nome": "Programa de Dados Publicos",
    "estado": "EM_ESTRUTURACAO"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `PROGRAMA_DADOS_INVALIDOS` | Os dados obrigatorios do programa nao foram informados corretamente. |
| `422` | `PROGRAMA_SEM_EIXO` | O programa deve estar vinculado a pelo menos um eixo estrategico. |
| `404` | `EIXO_ESTRATEGICO_NAO_ENCONTRADO` | Um dos eixos informados nao foi encontrado. |
| `404` | `PARCERIA_NAO_ENCONTRADA` | A parceria de referencia informada nao foi encontrada. |

---

#### `GET /api/v1/m010/programas`

Lista programas com filtros.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `nome` | string | Filtra por nome (busca textual) |
| `estado` | string | Filtra por estado: `EM_ESTRUTURACAO`, `ATIVO`, `ENCERRADO` |
| `eixoId` | string | Filtra por eixo estrategico |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "PROG-2026-01",
      "nome": "Programa de Dados Publicos",
      "estado": "EM_ESTRUTURACAO"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m010/programas/{id}`

Consulta detalhe de um programa, incluindo eixos e recursos.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do programa |

**Response `200 OK`**

```json
{
  "programa": {
    "id": "PROG-2026-01",
    "nome": "Programa de Dados Publicos",
    "estado": "EM_ESTRUTURACAO",
    "eixos": ["EIXO-TRANSFORMACAO-DIGITAL"],
    "resumo": "Programa voltado a projetos de dados e inovacao.",
    "parceriaReferenciaId": "PAR-2026-03"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROGRAMA_NAO_ENCONTRADO` | O programa informado nao foi encontrado. |

---

#### `PUT /api/v1/m010/programas/{id}`

Atualiza os dados de um programa existente (US-M010-010).

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do programa |

**Request body**

```json
{
  "resumo": "Programa voltado a projetos de dados, inovacao e governo aberto.",
  "beneficios": [
    "Amplia capacidade analitica do estado.",
    "Promove transparencia."
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `resumo` | string | Nao | Novo resumo do programa |
| `beneficios` | array (string) | Nao | Nova lista de beneficios esperados |
| `resultadosEsperados` | array (string) | Nao | Nova lista de resultados esperados |

**Response `200 OK`**

```json
{
  "programa": {
    "id": "PROG-2026-01",
    "nome": "Programa de Dados Publicos",
    "estado": "EM_ESTRUTURACAO"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROGRAMA_NAO_ENCONTRADO` | O programa informado nao foi encontrado. |
| `422` | `PROGRAMA_COM_EDITAIS_VINCULADOS` | Nao e possivel excluir um programa que possua editais vinculados. |

---

#### `DELETE /api/v1/m010/programas/{id}`

Remove um programa sem editais vinculados.

- **Autorizacao:** `ANALISTA_AGENCIA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do programa |

**Response `204 No Content`**

Sem corpo na resposta.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROGRAMA_NAO_ENCONTRADO` | O programa informado nao foi encontrado. |
| `422` | `PROGRAMA_COM_EDITAIS_VINCULADOS` | Nao e possivel excluir um programa que possua editais vinculados. |

---

### 4. Recursos do Programa

#### `POST /api/v1/m010/programas/{id}/recursos`

Registra recurso e aporte financeiro de um programa.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarRecursoDePrograma`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do programa |

**Request body**

```json
{
  "origem": "TESOURO_ESTADUAL",
  "valor": 500000.0,
  "dataAporte": "2026-02-01",
  "documento": "DOC-2026-001"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `origem` | string (enum) | Sim | Origem do recurso: `TESOURO_ESTADUAL`, `PARCERIA`, `FEDERAL`, `OUTRO` |
| `valor` | number | Sim | Valor do aporte |
| `dataAporte` | string (date) | Sim | Data do aporte |
| `documento` | string | Condicional | Identificador do documento de descentralizacao (obrigatorio quando aplicavel) |

**Response `201 Created`**

```json
{
  "recursoPrograma": {
    "id": "REC-2026-011",
    "programaId": "PROG-2026-01",
    "origem": "TESOURO_ESTADUAL",
    "valor": 500000.0,
    "dataAporte": "2026-02-01"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROGRAMA_NAO_ENCONTRADO` | O programa informado nao foi encontrado para registro de recurso. |
| `422` | `SALDO_FONTE_INSUFICIENTE` | O valor informado excede o saldo disponivel da fonte de recursos. |
| `400` | `DOCUMENTO_APORTE_OBRIGATORIO` | O recurso do programa exige documento de origem ou descentralizacao. |

---

#### `GET /api/v1/m010/programas/{id}/recursos`

Lista os recursos registrados para um programa.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do programa |

**Response `200 OK`**

```json
{
  "programaId": "PROG-2026-01",
  "recursos": [
    {
      "id": "REC-2026-011",
      "origem": "TESOURO_ESTADUAL",
      "valor": 500000.0,
      "dataAporte": "2026-02-01"
    }
  ],
  "totalAportado": 500000.0
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROGRAMA_NAO_ENCONTRADO` | O programa informado nao foi encontrado. |

---

### 5. Comite de Governanca

#### `POST /api/v1/m010/programas/{id}/comite`

Cadastra ou atualiza membros do comite de governanca de um programa (US-M010-011).

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do programa |

**Request body**

```json
{
  "membros": [
    {
      "pessoaId": "PF-2026-001",
      "papel": "PRESIDENTE"
    },
    {
      "pessoaId": "PF-2026-002",
      "papel": "MEMBRO"
    }
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `membros` | array | Sim | Lista de membros do comite |
| `membros[].pessoaId` | string | Sim | Identificador da pessoa fisica em M008 |
| `membros[].papel` | string (enum) | Sim | Um de: `PRESIDENTE`, `MEMBRO`, `SUPLENTE` |

**Response `200 OK`**

```json
{
  "programaId": "PROG-2026-01",
  "comiteAtualizado": true,
  "totalMembros": 2
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROGRAMA_NAO_ENCONTRADO` | O programa informado nao foi encontrado. |
| `400` | `COMITE_DADOS_INVALIDOS` | Os dados do comite de governanca sao invalidos. |

---

### 6. Parcerias

#### `POST /api/v1/m010/parcerias`

Registra uma nova parceria com participantes, vigencia e documentos.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CriarParceria`
- **Idempotencia:** Nao

**Request body**

```json
{
  "nome": "Parceria Inovacao 2026",
  "instituicoes": [
    "INST-2026-010"
  ],
  "dataInicio": "2026-03-01",
  "dataFim": "2027-12-31",
  "objetivo": "Apoiar iniciativas de pesquisa aplicada.",
  "processo": "PROC-2026-001"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `nome` | string | Sim | Nome da parceria |
| `instituicoes` | array (string) | Sim | Lista de identificadores de instituicoes participantes (M008) |
| `dataInicio` | string (date) | Sim | Data de inicio da vigencia |
| `dataFim` | string (date) | Sim | Data de fim da vigencia |
| `objetivo` | string | Sim | Objetivo da parceria |
| `processo` | string | Nao | Numero ou identificador do processo administrativo |

**Response `201 Created`**

```json
{
  "parceria": {
    "id": "PAR-2026-03",
    "nome": "Parceria Inovacao 2026",
    "estado": "EM_NEGOCIACAO",
    "dataInicio": "2026-03-01",
    "dataFim": "2027-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `PARCERIA_DADOS_INVALIDOS` | Os dados obrigatorios da parceria nao foram informados corretamente. |
| `422` | `PARCERIA_SEM_INSTITUICAO` | A parceria deve ter ao menos uma instituicao participante. |
| `422` | `VIGENCIA_PARCERIA_INVALIDA` | A vigencia informada para a parceria e invalida. |

---

#### `GET /api/v1/m010/parcerias`

Lista parcerias com filtros.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `nome` | string | Filtra por nome (busca textual) |
| `estado` | string | Filtra por estado: `EM_NEGOCIACAO`, `VIGENTE`, `ENCERRADA` |
| `instituicaoId` | string | Filtra por instituicao participante |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "PAR-2026-03",
      "nome": "Parceria Inovacao 2026",
      "estado": "EM_NEGOCIACAO",
      "dataInicio": "2026-03-01",
      "dataFim": "2027-12-31"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m010/parcerias/{id}`

Consulta detalhe de uma parceria, incluindo programas e movimentacoes.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da parceria |

**Response `200 OK`**

```json
{
  "parceria": {
    "id": "PAR-2026-03",
    "nome": "Parceria Inovacao 2026",
    "estado": "VIGENTE",
    "dataInicio": "2026-03-01",
    "dataFim": "2027-12-31",
    "objetivo": "Apoiar iniciativas de pesquisa aplicada.",
    "instituicoes": ["INST-2026-010"],
    "valorTotalAportado": 120000.0
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PARCERIA_NAO_ENCONTRADA` | A parceria informada nao foi encontrada. |

---

#### `PUT /api/v1/m010/parcerias/{id}`

Atualiza os dados cadastrais de uma parceria (US-M010-004).

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da parceria |

**Request body**

```json
{
  "objetivo": "Apoiar iniciativas de pesquisa aplicada e desenvolvimento tecnologico.",
  "processo": "PROC-2026-002"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `objetivo` | string | Nao | Novo objetivo da parceria |
| `processo` | string | Nao | Novo numero do processo administrativo |

**Response `200 OK`**

```json
{
  "parceria": {
    "id": "PAR-2026-03",
    "nome": "Parceria Inovacao 2026",
    "estado": "EM_NEGOCIACAO"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PARCERIA_NAO_ENCONTRADA` | A parceria informada nao foi encontrada. |

---

#### `POST /api/v1/m010/parcerias/{id}/encerrar`

Encerra uma parceria apos aprovacao da prestacao de contas final (US-M010-009).

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da parceria |

**Request body**

```json
{
  "justificativa": "Prestacao de contas final aprovada. Parceria concluida com exito.",
  "dataEncerramento": "2027-12-31"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Justificativa e resultado da prestacao de contas final |
| `dataEncerramento` | string (date) | Sim | Data efetiva do encerramento |

**Response `200 OK`**

```json
{
  "parceria": {
    "id": "PAR-2026-03",
    "estado": "ENCERRADA",
    "dataEncerramento": "2027-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PARCERIA_NAO_ENCONTRADA` | A parceria informada nao foi encontrada para encerramento. |
| `422` | `PARCERIA_COM_PROGRAMAS_ATIVOS` | Nao e possivel encerrar uma parceria que possua programas ativos com editais em andamento. |
| `422` | `PRESTACAO_CONTAS_NAO_APROVADA` | O encerramento de parceria requer prestacao de contas final aprovada. |

---

### 7. Movimentacoes de Parceria

#### `POST /api/v1/m010/parcerias/{id}/movimentacoes`

Registra aporte ou aditivo de parceria com justificativa e documento.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarMovimentacaoDeParceria`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da parceria |

**Request body**

```json
{
  "tipoMovimentacao": "APORTE",
  "valor": 120000.0,
  "justificativa": "Aporte inicial da parceria.",
  "documento": "DOC-PAR-2026-010"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `tipoMovimentacao` | string (enum) | Sim | Um de: `APORTE`, `ADITIVO_TEMPO`, `ADITIVO_APORTE` |
| `valor` | number | Condicional | Obrigatorio para `APORTE` e `ADITIVO_APORTE` |
| `justificativa` | string | Sim | Justificativa da movimentacao |
| `documento` | string | Sim | Identificador do documento comprobatorio |

**Response `201 Created`**

```json
{
  "movimentacaoParceria": {
    "id": "MOV-2026-001",
    "parceriaId": "PAR-2026-03",
    "tipoMovimentacao": "APORTE",
    "valor": 120000.0
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PARCERIA_NAO_ENCONTRADA` | A parceria informada nao foi encontrada para movimentacao. |
| `422` | `PARCERIA_NAO_VIGENTE` | A parceria precisa estar vigente para registrar aporte financeiro. |
| `400` | `DOCUMENTO_MOVIMENTACAO_OBRIGATORIO` | E obrigatorio anexar documento comprobatorio para a movimentacao da parceria. |

---

#### `GET /api/v1/m010/parcerias/{id}/movimentacoes`

Lista as movimentacoes financeiras de uma parceria.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da parceria |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipoMovimentacao` | string | Filtra por tipo: `APORTE`, `ADITIVO_TEMPO`, `ADITIVO_APORTE` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "parceriaId": "PAR-2026-03",
  "items": [
    {
      "id": "MOV-2026-001",
      "tipoMovimentacao": "APORTE",
      "valor": 120000.0,
      "justificativa": "Aporte inicial da parceria."
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
| `404` | `PARCERIA_NAO_ENCONTRADA` | A parceria informada nao foi encontrada. |

---

### 8. Portfolio Estrategico

#### `GET /api/v1/m010/portfolio`

Consulta plano, programas, parcerias e aportes consolidados.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarPortfolioEstrategico`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estadoPrograma` | string | Filtra por estado do programa: `EM_ESTRUTURACAO`, `ATIVO`, `ENCERRADO` |
| `estadoParceria` | string | Filtra por estado da parceria: `EM_NEGOCIACAO`, `VIGENTE`, `ENCERRADA` |
| `planoId` | string | Filtra pelo plano estrategico |

**Response `200 OK`**

```json
{
  "planoAtivo": {
    "id": "PE-2026-01",
    "nome": "Plano Estrategico 2026-2029"
  },
  "programas": 4,
  "parcerias": 3,
  "valorTotalAportado": 620000.0
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PORTFOLIO_NAO_ENCONTRADO` | Nenhum registro estrategico foi encontrado para os filtros informados. |
| `400` | `FILTRO_PORTFOLIO_INVALIDO` | Os filtros informados para o portfolio estrategico sao invalidos. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m010/planos-estrategicos` | RegistrarPlanoEstrategico | DIRETORIA |
| `GET` | `/api/v1/m010/planos-estrategicos` | ListarPlanosEstrategicos | DIRETORIA, ANALISTA_AGENCIA |
| `GET` | `/api/v1/m010/planos-estrategicos/{id}` | ConsultarPlanoEstrategico | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/m010/planos-estrategicos/{id}` | AtualizarPlanoEstrategico | DIRETORIA |
| `POST` | `/api/v1/m010/planos-estrategicos/{planoId}/eixos` | CadastrarEixoEstrategico | DIRETORIA |
| `GET` | `/api/v1/m010/planos-estrategicos/{planoId}/eixos` | ListarEixosEstrategicos | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m010/programas` | CriarPrograma | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m010/programas` | ListarProgramas | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m010/programas/{id}` | ConsultarPrograma | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/m010/programas/{id}` | AtualizarPrograma | ANALISTA_AGENCIA |
| `DELETE` | `/api/v1/m010/programas/{id}` | RemoverPrograma | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m010/programas/{id}/recursos` | RegistrarRecursoDePrograma | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m010/programas/{id}/recursos` | ListarRecursosDoPrograma | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m010/programas/{id}/comite` | CadastrarComiteGovernanca | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m010/parcerias` | CriarParceria | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m010/parcerias` | ListarParcerias | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m010/parcerias/{id}` | ConsultarParceria | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/m010/parcerias/{id}` | AtualizarParceria | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m010/parcerias/{id}/encerrar` | EncerrarParceria | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m010/parcerias/{id}/movimentacoes` | RegistrarMovimentacaoDeParceria | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m010/parcerias/{id}/movimentacoes` | ListarMovimentacoesDeParceria | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m010/portfolio` | ConsultarPortfolioEstrategico | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |

---

## Schemas de Dominio (Referencia)

### PlanoEstrategico

```json
{
  "id": "string",
  "nome": "string",
  "descricao": "string (opcional)",
  "estado": "EM_ELABORACAO | ATIVO | INATIVO",
  "dataInicio": "string (YYYY-MM-DD)",
  "dataFim": "string (YYYY-MM-DD)"
}
```

### EixoEstrategico

```json
{
  "id": "string",
  "planoId": "string",
  "nome": "string",
  "descricao": "string (opcional)"
}
```

### Programa

```json
{
  "id": "string",
  "nome": "string",
  "estado": "EM_ESTRUTURACAO | ATIVO | ENCERRADO",
  "eixos": ["string"],
  "resumo": "string (opcional)",
  "parceriaReferenciaId": "string (opcional)"
}
```

### RecursoPrograma

```json
{
  "id": "string",
  "programaId": "string",
  "origem": "TESOURO_ESTADUAL | PARCERIA | FEDERAL | OUTRO",
  "valor": "number",
  "dataAporte": "string (YYYY-MM-DD)",
  "documento": "string (opcional)"
}
```

### Parceria

```json
{
  "id": "string",
  "nome": "string",
  "estado": "EM_NEGOCIACAO | VIGENTE | ENCERRADA",
  "dataInicio": "string (YYYY-MM-DD)",
  "dataFim": "string (YYYY-MM-DD)",
  "objetivo": "string",
  "instituicoes": ["string"]
}
```

### MovimentacaoParceria

```json
{
  "id": "string",
  "parceriaId": "string",
  "tipoMovimentacao": "APORTE | ADITIVO_TEMPO | ADITIVO_APORTE",
  "valor": "number (opcional)",
  "justificativa": "string",
  "documento": "string"
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
| EPIC-M010-001 (Gestao do Plano Estrategico) | [epics/EPIC-M010-001.md](epics/EPIC-M010-001.md) |
| EPIC-M010-002 (Gestao de Parcerias) | [epics/EPIC-M010-002.md](epics/EPIC-M010-002.md) |
| EPIC-M010-003 (Gestao de Programas) | [epics/EPIC-M010-003.md](epics/EPIC-M010-003.md) |
