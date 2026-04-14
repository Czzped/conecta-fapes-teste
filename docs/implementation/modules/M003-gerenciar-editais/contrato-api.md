# Contrato de API HTTP — M003 Gerenciar Editais

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M003 como bounded context operacional de edital, iniciativa, projeto, cota e alocacao de bolsista. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m003
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `EDT-2026-001`, `PROJ-2026-014`, `COT-2026-001`, `ALC-2026-020`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `ANALISTA_AGENCIA` | Analista da Agencia de Fomento — acesso completo de leitura e escrita |
| `MODULO_INTERNO` | Modulo interno autorizado (M002, M011, M012, M015) — acesso restrito a consultas de referencia |

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
| `409 Conflict` | Conflito de estado ou duplicata | Codigo duplicado |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido, cota indisponivel, referencia invalida |

---

## Recursos

### 1. Editais

#### `POST /api/v1/m003/editais`

Cria ou atualiza o edital operacional com sua area tecnica e vinculos de programa/parceria.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarEditalOperacional`
- **Idempotencia:** Nao

**Request body**

```json
{
  "codigo": "EDT-2026-001",
  "titulo": "Edital Pesquisa Aplicada 2026",
  "tipo": "DEMANDA_PUBLICA",
  "areaTecnicaId": "AT-DGPP-01",
  "programaId": "PROG-2026-01",
  "parceriaId": "PAR-2026-03"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `codigo` | string | Sim | Codigo unico do edital (ex: `EDT-2026-001`) |
| `titulo` | string | Sim | Titulo completo do edital |
| `tipo` | string (enum) | Sim | Tipo do edital: `DEMANDA_PUBLICA`, `DEMANDA_INDUZIDA`, etc. |
| `areaTecnicaId` | string | Sim | Identificador da area tecnica responsavel (M008) |
| `programaId` | string | Nao | Identificador do programa vinculado (M010) |
| `parceriaId` | string | Nao | Identificador da parceria vinculada (M010) |

**Response `201 Created`**

```json
{
  "edital": {
    "id": "EDT-2026-001",
    "titulo": "Edital Pesquisa Aplicada 2026",
    "tipo": "DEMANDA_PUBLICA",
    "estado": "EM_CONFIGURACAO",
    "areaTecnicaId": "AT-DGPP-01"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `EDITAL_OPERACIONAL_INVALIDO` | Os dados operacionais do edital sao invalidos ou incompletos. |
| `404` | `AREA_TECNICA_NAO_ENCONTRADA` | A area tecnica informada para o edital nao foi encontrada. |
| `409` | `EDITAL_CODIGO_DUPLICADO` | Ja existe um edital cadastrado com o codigo informado. |

---

#### `GET /api/v1/m003/editais`

Lista editais com filtros.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `titulo` | string | Busca textual no titulo |
| `tipo` | string | Filtra pelo tipo do edital |
| `areaTecnicaId` | string | Filtra pela area tecnica responsavel |
| `estado` | string | Filtra pelo estado do edital |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "EDT-2026-001",
      "titulo": "Edital Pesquisa Aplicada 2026",
      "tipo": "DEMANDA_PUBLICA",
      "estado": "EM_CONFIGURACAO",
      "areaTecnicaId": "AT-DGPP-01"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m003/editais/{id}`

Consulta a visao operacional consolidada do edital com projetos, cotas e alocacoes.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarVisaoOperacionalDoEdital`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do edital (ex: `EDT-2026-001`) |

**Response `200 OK`**

```json
{
  "edital": {
    "id": "EDT-2026-001",
    "titulo": "Edital Pesquisa Aplicada 2026",
    "tipo": "DEMANDA_PUBLICA",
    "estado": "EM_CONFIGURACAO",
    "areaTecnicaId": "AT-DGPP-01",
    "programaId": "PROG-2026-01",
    "parceriaId": "PAR-2026-03"
  },
  "projetos": 8,
  "cotas": 3,
  "alocacoes": 14
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado para consulta operacional. |

---

#### `PUT /api/v1/m003/editais/{id}`

Atualiza dados de um edital existente.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do edital |

**Request body**

```json
{
  "titulo": "Edital Pesquisa Aplicada 2026 — Revisao 1",
  "areaTecnicaId": "AT-DGPP-02",
  "programaId": "PROG-2026-01",
  "parceriaId": null
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `titulo` | string | Nao | Novo titulo do edital |
| `areaTecnicaId` | string | Nao | Nova area tecnica responsavel |
| `programaId` | string | Nao | Novo programa vinculado |
| `parceriaId` | string | Nao | Nova parceria vinculada |

**Response `200 OK`**

```json
{
  "edital": {
    "id": "EDT-2026-001",
    "titulo": "Edital Pesquisa Aplicada 2026 — Revisao 1",
    "estado": "EM_CONFIGURACAO"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |
| `400` | `EDITAL_OPERACIONAL_INVALIDO` | Os dados operacionais do edital sao invalidos ou incompletos. |

---

### 2. Projetos

#### `POST /api/v1/m003/editais/{editalId}/projetos`

Registra um projeto concreto vinculado a um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarProjetoDoEdital`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Request body**

```json
{
  "titulo": "Projeto Laboratorio de Dados Publicos",
  "resumo": "Projeto para estruturacao de laboratorio institucional.",
  "coordenadorId": "COD-2026-011",
  "dataInicio": "2026-05-01",
  "dataFim": "2027-04-30"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `titulo` | string | Sim | Titulo do projeto |
| `resumo` | string | Nao | Resumo descritivo do projeto |
| `coordenadorId` | string | Sim | Identificador do coordenador responsavel |
| `dataInicio` | string (date) | Sim | Data de inicio do projeto |
| `dataFim` | string (date) | Sim | Data de termino prevista do projeto |

**Response `201 Created`**

```json
{
  "projeto": {
    "id": "PROJ-2026-014",
    "titulo": "Projeto Laboratorio de Dados Publicos",
    "estado": "CONTRATADA",
    "editalId": "EDT-2026-001"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado para o projeto nao foi encontrado. |
| `422` | `COORDENADOR_INVALIDO` | O coordenador informado nao e valido para o contexto operacional. |
| `400` | `PROJETO_DADOS_INVALIDOS` | Os dados do projeto sao invalidos ou incompletos. |

---

#### `GET /api/v1/m003/editais/{editalId}/projetos`

Lista os projetos de um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra pelo estado do projeto |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "PROJ-2026-014",
      "titulo": "Projeto Laboratorio de Dados Publicos",
      "estado": "CONTRATADA",
      "coordenadorId": "COD-2026-011",
      "dataInicio": "2026-05-01",
      "dataFim": "2027-04-30"
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
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |

---

#### `GET /api/v1/m003/projetos/{id}`

Consulta o detalhe de um projeto pelo identificador.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do projeto (ex: `PROJ-2026-014`) |

**Response `200 OK`**

```json
{
  "projeto": {
    "id": "PROJ-2026-014",
    "titulo": "Projeto Laboratorio de Dados Publicos",
    "resumo": "Projeto para estruturacao de laboratorio institucional.",
    "estado": "CONTRATADA",
    "editalId": "EDT-2026-001",
    "coordenadorId": "COD-2026-011",
    "dataInicio": "2026-05-01",
    "dataFim": "2027-04-30"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado nao foi encontrado. |

---

### 3. Cotas do Edital

#### `POST /api/v1/m003/editais/{editalId}/cotas`

Cadastra cotas de bolsa do edital por versao de nivel.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarCotaEdital`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Request body**

```json
{
  "versaoNivelId": "VN-BPIG-I-2026-02",
  "quantidadeTotal": 12
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `versaoNivelId` | string | Sim | Identificador da versao de nivel de bolsa (M001) |
| `quantidadeTotal` | integer | Sim | Quantidade total de bolsas na cota (deve ser maior que zero) |

**Response `201 Created`**

```json
{
  "cotaEdital": {
    "id": "COT-2026-001",
    "editalId": "EDT-2026-001",
    "versaoNivelId": "VN-BPIG-I-2026-02",
    "quantidadeTotal": 12,
    "quantidadeDisponivel": 12
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado para a cota nao foi encontrado. |
| `404` | `VERSAO_NIVEL_NAO_ENCONTRADA` | A versao de nivel informada para a cota nao foi encontrada. |
| `400` | `COTA_EDITAL_QUANTIDADE_INVALIDA` | A quantidade total da cota deve ser maior que zero. |

---

#### `GET /api/v1/m003/editais/{editalId}/cotas`

Lista as cotas de bolsa de um edital.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "COT-2026-001",
      "versaoNivelId": "VN-BPIG-I-2026-02",
      "quantidadeTotal": 12,
      "quantidadeDisponivel": 8
    }
  ],
  "total": 1
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `EDITAL_NAO_ENCONTRADO` | O edital informado nao foi encontrado. |

---

#### `PUT /api/v1/m003/editais/{editalId}/cotas/{cotaId}`

Atualiza a quantidade total de uma cota existente.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `editalId` | string | Identificador do edital |
| `cotaId` | string | Identificador da cota |

**Request body**

```json
{
  "quantidadeTotal": 15
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `quantidadeTotal` | integer | Sim | Nova quantidade total da cota |

**Response `200 OK`**

```json
{
  "cotaEdital": {
    "id": "COT-2026-001",
    "quantidadeTotal": 15,
    "quantidadeDisponivel": 11
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `COTA_EDITAL_NAO_ENCONTRADA` | A cota informada nao foi encontrada. |
| `422` | `COTA_EDITAL_QUANTIDADE_INVALIDA` | A quantidade total nao pode ser menor que o numero de alocacoes ja realizadas. |

---

### 4. Alocacoes de Bolsista

#### `POST /api/v1/m003/projetos/{projetoId}/alocacoes`

Registra a alocacao operacional de um bolsista consumindo uma cota do edital.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarAlocacaoBolsista`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Request body**

```json
{
  "cotaEditalId": "COT-2026-001",
  "orientadorId": "ORI-2026-004",
  "bolsistaId": "BOL-2026-009",
  "dataInicio": "2026-06-01",
  "dataFimPrevista": "2027-05-31"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `cotaEditalId` | string | Sim | Identificador da cota do edital a consumir |
| `orientadorId` | string | Sim | Identificador do orientador responsavel |
| `bolsistaId` | string | Sim | Identificador do bolsista a alocar |
| `dataInicio` | string (date) | Sim | Data de inicio da alocacao |
| `dataFimPrevista` | string (date) | Sim | Data de termino prevista da alocacao |

**Response `201 Created`**

```json
{
  "alocacaoBolsista": {
    "id": "ALC-2026-020",
    "projetoId": "PROJ-2026-014",
    "cotaEditalId": "COT-2026-001",
    "estado": "EM_ANALISE"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROJETO_NAO_ENCONTRADO` | O projeto informado para a alocacao nao foi encontrado. |
| `422` | `COTA_EDITAL_INDISPONIVEL` | A cota informada nao possui disponibilidade para nova alocacao. |
| `422` | `PAPEL_OPERACIONAL_INVALIDO` | O orientador ou bolsista informado nao e valido para a alocacao. |
| `400` | `ALOCACAO_DADOS_INVALIDOS` | Os dados da alocacao sao invalidos ou incompletos. |

---

#### `GET /api/v1/m003/projetos/{projetoId}/alocacoes`

Lista as alocacoes de bolsistas de um projeto.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `projetoId` | string | Identificador do projeto |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `estado` | string | Filtra pelo estado da alocacao |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "ALC-2026-020",
      "cotaEditalId": "COT-2026-001",
      "orientadorId": "ORI-2026-004",
      "bolsistaId": "BOL-2026-009",
      "estado": "EM_ANALISE",
      "dataInicio": "2026-06-01",
      "dataFimPrevista": "2027-05-31"
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

#### `GET /api/v1/m003/alocacoes/{id}`

Consulta o detalhe de uma alocacao pelo identificador.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da alocacao (ex: `ALC-2026-020`) |

**Response `200 OK`**

```json
{
  "alocacaoBolsista": {
    "id": "ALC-2026-020",
    "projetoId": "PROJ-2026-014",
    "cotaEditalId": "COT-2026-001",
    "orientadorId": "ORI-2026-004",
    "bolsistaId": "BOL-2026-009",
    "estado": "EM_ANALISE",
    "dataInicio": "2026-06-01",
    "dataFimPrevista": "2027-05-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `ALOCACAO_NAO_ENCONTRADA` | A alocacao informada nao foi encontrada. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m003/editais` | RegistrarEditalOperacional | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m003/editais` | ListarEditais | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m003/editais/{id}` | ConsultarVisaoOperacionalDoEdital | ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/m003/editais/{id}` | AtualizarEdital | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m003/editais/{editalId}/projetos` | RegistrarProjetoDoEdital | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m003/editais/{editalId}/projetos` | ListarProjetosDoEdital | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m003/projetos/{id}` | ConsultarProjeto | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m003/editais/{editalId}/cotas` | RegistrarCotaEdital | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m003/editais/{editalId}/cotas` | ListarCotasDoEdital | ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/m003/editais/{editalId}/cotas/{cotaId}` | AtualizarCotaEdital | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m003/projetos/{projetoId}/alocacoes` | RegistrarAlocacaoBolsista | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m003/projetos/{projetoId}/alocacoes` | ListarAlocacoesDoProjeito | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m003/alocacoes/{id}` | ConsultarAlocacao | ANALISTA_AGENCIA, MODULO_INTERNO |

---

## Schemas de Dominio (Referencia)

### Edital

```json
{
  "id": "string",
  "codigo": "string",
  "titulo": "string",
  "tipo": "string",
  "estado": "EM_CONFIGURACAO | PUBLICADO | ENCERRADO",
  "areaTecnicaId": "string",
  "programaId": "string (opcional)",
  "parceriaId": "string (opcional)"
}
```

### Projeto

```json
{
  "id": "string",
  "titulo": "string",
  "resumo": "string (opcional)",
  "estado": "CONTRATADA | CONCLUIDA | CANCELADA",
  "editalId": "string",
  "coordenadorId": "string",
  "dataInicio": "string (YYYY-MM-DD)",
  "dataFim": "string (YYYY-MM-DD)"
}
```

### CotaEdital

```json
{
  "id": "string",
  "editalId": "string",
  "versaoNivelId": "string",
  "quantidadeTotal": "integer",
  "quantidadeDisponivel": "integer"
}
```

### AlocacaoBolsista

```json
{
  "id": "string",
  "projetoId": "string",
  "cotaEditalId": "string",
  "orientadorId": "string",
  "bolsistaId": "string",
  "estado": "EM_ANALISE | ATIVA | ENCERRADA | CANCELADA",
  "dataInicio": "string (YYYY-MM-DD)",
  "dataFimPrevista": "string (YYYY-MM-DD)"
}
```

---

## Rastreabilidade

| Artefato | Link |
|----------|------|
| Contrato de aplicacao (operacoes) | [contrato.md](contrato.md) |
| Dominio e regras de negocio | [README.md](README.md) |
| Modelo estrutural | [modelo-estrutural.md](modelo-estrutural.md) |
| Backlog e EPICs | [backlog.md](backlog.md) |
