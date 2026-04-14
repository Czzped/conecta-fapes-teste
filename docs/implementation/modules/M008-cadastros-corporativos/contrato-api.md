# Contrato de API HTTP — M008 Cadastros Corporativos

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M008 como bounded context responsavel pelos cadastros corporativos compartilhados da plataforma: pessoas, instituicoes, unidades organizacionais, areas tecnicas, dirigentes e referencias basicas. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m008
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `PES-2026-001`, `INST-2026-010`, `AT-DGPP-01`, `DIR-2026-003`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `ANALISTA_AGENCIA` | Analista da Agencia de Fomento — acesso completo de leitura e escrita nos cadastros corporativos |
| `MODULO_INTERNO` | Modulo interno autorizado — acesso restrito a consultas de referencia canonica |
| `SISTEMA` | Processo interno — acesso exclusivo a sincronizacao via Acesso Cidadao |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "cpf": "000.000.000-00"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | CPF ou CNPJ duplicado, mandato sobreposto |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Reativacao sem justificativa, hierarquia invalida |

---

## Recursos

### 1. Pessoas Fisicas

#### `POST /api/v1/m008/pessoas`

Cria ou atualiza pessoa fisica canonical da plataforma.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CadastrarOuAtualizarPessoaFisica`
- **Idempotencia:** Sim por CPF

**Request body**

```json
{
  "cpf": "123.456.789-00",
  "nome": "Maria Oliveira",
  "email": "maria@exemplo.br"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `cpf` | string | Sim | CPF da pessoa no formato `NNN.NNN.NNN-NN` |
| `nome` | string | Sim | Nome completo da pessoa |
| `email` | string | Sim | Endereco de e-mail da pessoa |

**Response `201 Created`**

```json
{
  "pessoaFisica": {
    "id": "PES-2026-001",
    "cpf": "123.456.789-00",
    "nome": "Maria Oliveira",
    "email": "maria@exemplo.br",
    "estado": "ATIVA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `CPF_DUPLICADO` | Ja existe uma pessoa cadastrada com o CPF informado. |
| `400` | `PESSOA_DADOS_INVALIDOS` | Os dados da pessoa fisica sao invalidos ou incompletos. |

---

#### `GET /api/v1/m008/pessoas`

Lista e filtra pessoas fisicas cadastradas.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarCadastrosCorporativos` (tipoCadastro=PESSOA_FISICA)

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `cpf` | string | Filtra pelo CPF exato |
| `nome` | string | Busca textual no nome |
| `email` | string | Filtra pelo e-mail exato |
| `estado` | string | Filtra pelo estado: `ATIVA`, `SUSPENSA` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "PES-2026-001",
      "cpf": "123.456.789-00",
      "nome": "Maria Oliveira",
      "email": "maria@exemplo.br",
      "estado": "ATIVA"
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
| `400` | `FILTRO_PESSOA_INVALIDO` | Os filtros informados para consulta de pessoas sao invalidos. |

---

#### `GET /api/v1/m008/pessoas/{id}`

Consulta o detalhe de uma pessoa fisica pelo identificador.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da pessoa (ex: `PES-2026-001`) |

**Response `200 OK`**

```json
{
  "pessoaFisica": {
    "id": "PES-2026-001",
    "cpf": "123.456.789-00",
    "nome": "Maria Oliveira",
    "email": "maria@exemplo.br",
    "estado": "ATIVA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PESSOA_NAO_ENCONTRADA` | A pessoa informada nao foi encontrada. |

---

#### `PUT /api/v1/m008/pessoas/{id}`

Atualiza os dados de uma pessoa fisica existente.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da pessoa |

**Request body**

```json
{
  "nome": "Maria Oliveira Santos",
  "email": "maria.santos@exemplo.br"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `nome` | string | Nao | Novo nome completo da pessoa |
| `email` | string | Nao | Novo endereco de e-mail |

**Response `200 OK`**

```json
{
  "pessoaFisica": {
    "id": "PES-2026-001",
    "cpf": "123.456.789-00",
    "nome": "Maria Oliveira Santos",
    "email": "maria.santos@exemplo.br",
    "estado": "ATIVA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PESSOA_NAO_ENCONTRADA` | A pessoa informada nao foi encontrada. |
| `400` | `PESSOA_DADOS_INVALIDOS` | Os dados da pessoa fisica sao invalidos ou incompletos. |

---

#### `POST /api/v1/m008/pessoas/{id}/suspender`

Suspende uma pessoa fisica, bloqueando todas as operacoes vinculadas.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `AlterarEstadoPessoaFisica` (novoEstado=SUSPENSA)
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da pessoa |

**Request body**

```json
{
  "justificativa": "Irregularidade cadastral identificada."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Motivo da suspensao |

**Response `200 OK`**

```json
{
  "pessoaFisica": {
    "id": "PES-2026-001",
    "estado": "SUSPENSA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PESSOA_NAO_ENCONTRADA` | A pessoa informada nao foi encontrada. |
| `422` | `PESSOA_JA_SUSPENSA` | A pessoa informada ja esta suspensa. |

---

#### `POST /api/v1/m008/pessoas/{id}/reativar`

Reativa uma pessoa fisica suspensa.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `AlterarEstadoPessoaFisica` (novoEstado=ATIVA)
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da pessoa |

**Request body**

```json
{
  "justificativa": "Irregularidade cadastral sanada apos revisao."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | Sim | Motivo da reativacao (obrigatoria conforme RI2) |

**Response `200 OK`**

```json
{
  "pessoaFisica": {
    "id": "PES-2026-001",
    "estado": "ATIVA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PESSOA_NAO_ENCONTRADA` | A pessoa informada nao foi encontrada. |
| `422` | `REATIVACAO_SEM_JUSTIFICATIVA` | Nao e permitido reativar pessoa suspensa sem justificativa registrada. |
| `422` | `PESSOA_JA_ATIVA` | A pessoa informada ja esta ativa. |

---

### 2. Instituicoes e Unidades Organizacionais

#### `POST /api/v1/m008/instituicoes`

Registra uma instituicao e sua estrutura minima de unidade organizacional.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CadastrarInstituicaoComUnidadeOrganizacional`
- **Idempotencia:** Nao

**Request body**

```json
{
  "cnpj": "12.345.678/0001-90",
  "nome": "Agencia de Fomento do Estado",
  "unidades": [
    {
      "codigo": "AT-DGPP-01",
      "nome": "Area Tecnica DGPP",
      "tipo": "AREA_TECNICA"
    }
  ]
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `cnpj` | string | Sim | CNPJ da instituicao no formato `NN.NNN.NNN/NNNN-NN` |
| `nome` | string | Sim | Nome oficial da instituicao |
| `unidades` | array | Nao | Lista de unidades organizacionais iniciais |
| `unidades[].codigo` | string | Sim | Codigo unico da unidade |
| `unidades[].nome` | string | Sim | Nome da unidade organizacional |
| `unidades[].tipo` | string (enum) | Sim | Tipo: `AREA_TECNICA`, `DEPARTAMENTO`, `DIRETORIA`, etc. |
| `unidades[].unidadePaiId` | string | Nao | Identificador da unidade pai (para hierarquia) |

**Response `201 Created`**

```json
{
  "instituicao": {
    "id": "INST-2026-010",
    "cnpj": "12.345.678/0001-90",
    "nome": "Agencia de Fomento do Estado"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `CNPJ_DUPLICADO` | Ja existe uma instituicao cadastrada com o CNPJ informado. |
| `422` | `UNIDADE_HIERARQUIA_INVALIDA` | A estrutura de unidades informada e invalida para a instituicao. |
| `400` | `INSTITUICAO_DADOS_INVALIDOS` | Os dados da instituicao sao invalidos ou incompletos. |

---

#### `GET /api/v1/m008/instituicoes`

Lista e filtra instituicoes cadastradas.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarCadastrosCorporativos` (tipoCadastro=INSTITUICAO)

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `cnpj` | string | Filtra pelo CNPJ exato |
| `nome` | string | Busca textual no nome |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "INST-2026-010",
      "cnpj": "12.345.678/0001-90",
      "nome": "Agencia de Fomento do Estado"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m008/instituicoes/{id}`

Consulta o detalhe de uma instituicao pelo identificador.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da instituicao (ex: `INST-2026-010`) |

**Response `200 OK`**

```json
{
  "instituicao": {
    "id": "INST-2026-010",
    "cnpj": "12.345.678/0001-90",
    "nome": "Agencia de Fomento do Estado"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `INSTITUICAO_NAO_ENCONTRADA` | A instituicao informada nao foi encontrada. |

---

#### `POST /api/v1/m008/instituicoes/{id}/unidades`

Registra uma nova unidade organizacional em uma instituicao existente.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da instituicao |

**Request body**

```json
{
  "codigo": "AT-DPCI-02",
  "nome": "Diretoria de Prospeccao e Captacao de Investimentos",
  "tipo": "DIRETORIA",
  "unidadePaiId": null
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `codigo` | string | Sim | Codigo unico da unidade |
| `nome` | string | Sim | Nome da unidade organizacional |
| `tipo` | string (enum) | Sim | Tipo: `AREA_TECNICA`, `DEPARTAMENTO`, `DIRETORIA`, etc. |
| `unidadePaiId` | string | Nao | Identificador da unidade pai na hierarquia |

**Response `201 Created`**

```json
{
  "unidadeOrganizacional": {
    "id": "AT-DPCI-02",
    "codigo": "AT-DPCI-02",
    "nome": "Diretoria de Prospeccao e Captacao de Investimentos",
    "tipo": "DIRETORIA",
    "instituicaoId": "INST-2026-010"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `INSTITUICAO_NAO_ENCONTRADA` | A instituicao informada nao foi encontrada. |
| `409` | `UNIDADE_CODIGO_DUPLICADO` | Ja existe uma unidade com o codigo informado nesta instituicao. |
| `422` | `UNIDADE_HIERARQUIA_INVALIDA` | A unidade pai informada nao pertence a esta instituicao. |

---

#### `GET /api/v1/m008/instituicoes/{id}/unidades`

Lista as unidades organizacionais de uma instituicao.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarCadastrosCorporativos` (tipoCadastro=UNIDADE_ORGANIZACIONAL)

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da instituicao |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipo` | string | Filtra pelo tipo da unidade |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "AT-DGPP-01",
      "codigo": "AT-DGPP-01",
      "nome": "Area Tecnica DGPP",
      "tipo": "AREA_TECNICA",
      "unidadePaiId": null
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
| `404` | `INSTITUICAO_NAO_ENCONTRADA` | A instituicao informada nao foi encontrada. |

---

#### `GET /api/v1/m008/areas-tecnicas`

Lista as areas tecnicas cadastradas como atalho de referencia para modulos consumidores.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarCadastrosCorporativos` (tipoCadastro=AREA_TECNICA)

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `instituicaoId` | string | Filtra pela instituicao dona da area tecnica |
| `nome` | string | Busca textual no nome |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "AT-DGPP-01",
      "nome": "Area Tecnica DGPP",
      "instituicaoId": "INST-2026-010"
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
| `400` | `FILTRO_AREA_TECNICA_INVALIDO` | Os filtros informados para consulta de areas tecnicas sao invalidos. |

---

### 3. Dirigentes

#### `POST /api/v1/m008/dirigentes`

Registra um dirigente com unidade e mandato.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarDirigente`
- **Idempotencia:** Nao

**Request body**

```json
{
  "pessoaId": "PES-2026-001",
  "unidadeId": "AT-DGPP-01",
  "tipoDirigente": "DIRETOR",
  "dataInicio": "2026-01-01",
  "dataFim": "2026-12-31"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `pessoaId` | string | Sim | Identificador da pessoa fisica (M008) |
| `unidadeId` | string | Sim | Identificador da unidade organizacional |
| `tipoDirigente` | string (enum) | Sim | Tipo: `DIRETOR`, `REITOR`, `CHEFE`, etc. |
| `dataInicio` | string (date) | Sim | Data de inicio do mandato |
| `dataFim` | string (date) | Sim | Data de fim do mandato |

**Response `201 Created`**

```json
{
  "dirigente": {
    "id": "DIR-2026-003",
    "pessoaId": "PES-2026-001",
    "unidadeId": "AT-DGPP-01",
    "tipoDirigente": "DIRETOR",
    "dataInicio": "2026-01-01",
    "dataFim": "2026-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PESSOA_NAO_ENCONTRADA` | A pessoa informada nao foi encontrada. |
| `404` | `UNIDADE_ORGANIZACIONAL_NAO_ENCONTRADA` | A unidade organizacional informada nao foi encontrada. |
| `409` | `MANDATO_SOBREPOSTO` | Ja existe mandato ativo para a mesma unidade no periodo informado. |
| `400` | `DIRIGENTE_DADOS_INVALIDOS` | Os dados do dirigente sao invalidos ou incompletos. |

---

#### `GET /api/v1/m008/dirigentes`

Lista e filtra dirigentes cadastrados.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `pessoaId` | string | Filtra pelo identificador da pessoa |
| `unidadeId` | string | Filtra pela unidade organizacional |
| `tipoDirigente` | string | Filtra pelo tipo de dirigente |
| `ativo` | boolean | Quando `true`, retorna apenas dirigentes com mandato vigente |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "DIR-2026-003",
      "pessoaId": "PES-2026-001",
      "unidadeId": "AT-DGPP-01",
      "tipoDirigente": "DIRETOR",
      "dataInicio": "2026-01-01",
      "dataFim": "2026-12-31"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

### 4. Cadastros Basicos de Referencia

#### `GET /api/v1/m008/areas-conhecimento`

Lista as areas de conhecimento seguindo a classificacao hierarquica do CNPq.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarCadastrosCorporativos` (tipoCadastro=AREA_CONHECIMENTO)

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `nivel` | string | Filtra por nivel: `GRANDE_AREA`, `AREA`, `SUBAREA`, `ESPECIALIDADE` |
| `paiId` | string | Filtra pelos filhos de uma area especifica |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "AC-CIENCIAS-EXATAS",
      "nome": "Ciencias Exatas e da Terra",
      "nivel": "GRANDE_AREA",
      "paiId": null
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m008/rubricas`

Lista as rubricas financeiras cadastradas.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarCadastrosCorporativos` (tipoCadastro=RUBRICA)

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `categoriaOrcamentaria` | string | Filtra pela categoria orcamentaria vinculada |
| `nome` | string | Busca textual no nome |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "RUB-BOLSA-PESQ",
      "nome": "Bolsa de Pesquisa",
      "categoriaOrcamentaria": "CUSTEIO"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m008/cidades`

Lista as cidades e regioes do estado.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarCadastrosCorporativos` (tipoCadastro=CIDADE)

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `regiaoId` | string | Filtra por regiao |
| `nome` | string | Busca textual no nome da cidade |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "CID-VITORIA",
      "nome": "Vitoria",
      "regiaoId": "REG-GRANDE-VITORIA"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

### 5. Sincronizacao via Acesso Cidadao

#### `POST /api/v1/m008/pessoas/sincronizar-acesso-cidadao`

Cria ou vincula pessoa automaticamente a partir de evento do Acesso Cidadao.

- **Autorizacao:** `SISTEMA`
- **Operacao de origem:** `SincronizarPessoaViaAcessoCidadao`
- **Idempotencia:** Sim por CPF e origem do evento

**Request body**

```json
{
  "origem": "ACESSO_CIDADAO",
  "cpf": "123.456.789-00",
  "nome": "Maria Oliveira",
  "email": "maria@exemplo.br"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `origem` | string (enum) | Sim | Origem do evento: `ACESSO_CIDADAO` |
| `cpf` | string | Sim | CPF da pessoa no formato `NNN.NNN.NNN-NN` |
| `nome` | string | Sim | Nome completo da pessoa |
| `email` | string | Sim | Endereco de e-mail |

**Response `200 OK`**

```json
{
  "pessoaFisica": {
    "id": "PES-2026-001",
    "cpf": "123.456.789-00",
    "vinculadaPorCpf": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `CPF_INVALIDO` | O CPF recebido no evento do Acesso Cidadao e invalido. |
| `422` | `EVENTO_CADASTRAL_INCONSISTENTE` | O evento recebido nao possui dados suficientes para sincronizacao. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m008/pessoas` | CadastrarOuAtualizarPessoaFisica | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m008/pessoas` | ListarPessoas | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/pessoas/{id}` | ConsultarPessoa | ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/m008/pessoas/{id}` | AtualizarPessoaFisica | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m008/pessoas/{id}/suspender` | SuspenderPessoa | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m008/pessoas/{id}/reativar` | ReativarPessoa | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m008/pessoas/sincronizar-acesso-cidadao` | SincronizarPessoaViaAcessoCidadao | SISTEMA |
| `POST` | `/api/v1/m008/instituicoes` | CadastrarInstituicaoComUnidadeOrganizacional | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m008/instituicoes` | ListarInstituicoes | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/instituicoes/{id}` | ConsultarInstituicao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m008/instituicoes/{id}/unidades` | RegistrarUnidadeOrganizacional | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m008/instituicoes/{id}/unidades` | ListarUnidadesDaInstituicao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/areas-tecnicas` | ListarAreasTecnicas | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m008/dirigentes` | RegistrarDirigente | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m008/dirigentes` | ListarDirigentes | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/areas-conhecimento` | ListarAreasDeConhecimento | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/rubricas` | ListarRubricas | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/cidades` | ListarCidades | ANALISTA_AGENCIA, MODULO_INTERNO |

---

## Schemas de Dominio (Referencia)

### PessoaFisica

```json
{
  "id": "string",
  "cpf": "string",
  "nome": "string",
  "email": "string",
  "estado": "ATIVA | SUSPENSA"
}
```

### Instituicao

```json
{
  "id": "string",
  "cnpj": "string",
  "nome": "string"
}
```

### UnidadeOrganizacional

```json
{
  "id": "string",
  "codigo": "string",
  "nome": "string",
  "tipo": "AREA_TECNICA | DEPARTAMENTO | DIRETORIA | ...",
  "instituicaoId": "string",
  "unidadePaiId": "string | null"
}
```

### Dirigente

```json
{
  "id": "string",
  "pessoaId": "string",
  "unidadeId": "string",
  "tipoDirigente": "DIRETOR | REITOR | CHEFE | ...",
  "dataInicio": "string (YYYY-MM-DD)",
  "dataFim": "string (YYYY-MM-DD)"
}
```

### AreaConhecimento

```json
{
  "id": "string",
  "nome": "string",
  "nivel": "GRANDE_AREA | AREA | SUBAREA | ESPECIALIDADE",
  "paiId": "string | null"
}
```

### Rubrica

```json
{
  "id": "string",
  "nome": "string",
  "categoriaOrcamentaria": "string"
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
| EPIC-M008-001 (Cadastro de Pessoas Fisicas) | [epics/EPIC-M008-001.md](epics/EPIC-M008-001.md) |
| EPIC-M008-002 (Cadastro de Instituicoes e Unidades) | [epics/EPIC-M008-002.md](epics/EPIC-M008-002.md) |
| EPIC-M008-003 (Cadastros Basicos de Referencia) | [epics/EPIC-M008-003.md](epics/EPIC-M008-003.md) |
