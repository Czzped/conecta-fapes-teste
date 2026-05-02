# Contrato de API HTTP — M008 Cadastros Corporativos

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M008 como bounded context responsavel pelos cadastros corporativos compartilhados da plataforma: pessoas, instituicoes, dirigentes e referencias basicas. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

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

### 2. Instituicoes

#### `POST /api/v1/m008/instituicoes`

Registra uma instituicao com ou sem CNPJ proprio. Quando nao houver CNPJ, a instituicao representa um setor interno e deve informar `superiorId`.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CadastrarInstituicao`
- **Idempotencia:** Nao

**Request body**

```json
{
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "Universidade Federal do Espirito Santo",
  "nome": "UFES",
  "sigla": "UFES",
  "email": "ufes@ufes.br",
  "isPublica": true,
  "isExterna": true,
  "superiorId": null
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `cnpj` | string | Cond. | CNPJ da instituicao no formato `NN.NNN.NNN/NNNN-NN`; obrigatorio quando nao houver superior |
| `razaoSocial` | string | Cond. | Razao social da instituicao; obrigatoria quando houver CNPJ |
| `nome` | string | Sim | Nome comum de exibicao da instituicao, campus, filial ou setor |
| `sigla` | string | Nao | Sigla comum da instituicao ou setor |
| `email` | string | Cond. | Email institucional; obrigatorio quando houver CNPJ |
| `isPublica` | boolean | Cond. | `true` para instituicao publica; `false` para privada; obrigatorio quando houver CNPJ |
| `isExterna` | boolean | Sim | Indica se e externa a agencia de fomento |
| `superiorId` | string | Cond. | Instituicao superior; obrigatoria quando nao houver CNPJ |

**Response `201 Created`**

```json
{
  "instituicao": {
    "id": "INST-2026-010",
    "cnpj": "12.345.678/0001-90",
    "nome": "UFES",
    "sigla": "UFES",
    "isPublica": true,
    "superiorId": null
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `CNPJ_DUPLICADO` | Ja existe uma instituicao cadastrada com o CNPJ informado. |
| `404` | `INSTITUICAO_SUPERIOR_NAO_ENCONTRADA` | A instituicao superior informada nao foi encontrada. |
| `422` | `INSTITUICAO_SEM_CNPJ_SEM_SUPERIOR` | Instituicao sem CNPJ proprio deve possuir uma instituicao superior. |
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
| `isPublica` | boolean | Filtra por natureza publica/privada |
| `superiorId` | string | Filtra por instituicao superior |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "INST-2026-010",
      "cnpj": "12.345.678/0001-90",
      "nome": "UFES",
      "isPublica": true,
      "superiorId": null
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
    "nome": "UFES",
    "sigla": "UFES",
    "isPublica": true,
    "superiorId": null
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `INSTITUICAO_NAO_ENCONTRADA` | A instituicao informada nao foi encontrada. |

---

#### `GET /api/v1/m008/instituicoes/{id}/subestruturas`

Lista as instituicoes diretamente vinculadas a uma instituicao superior. O retorno pode conter campi/filiais com CNPJ proprio e setores internos sem CNPJ.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarCadastrosCorporativos` (tipoCadastro=INSTITUICAO, superiorId={id})

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador da instituicao |

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `superiorId` | string | Filtra por instituicao superior |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "INST-2026-011",
      "nome": "Centro Tecnologico",
      "sigla": "CT",
      "cnpj": null,
      "superiorId": "INST-2026-010"
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

### 3. Dirigentes

#### `POST /api/v1/m008/dirigentes`

Registra um dirigente como vinculo temporal entre uma pessoa e uma instituicao.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarDirigente`
- **Idempotencia:** Nao

**Request body**

```json
{
  "pessoaId": "PES-2026-001",
  "instituicaoId": "INST-2026-010",
  "dataInicio": "2026-01-01",
  "dataFim": "2026-12-31"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `pessoaId` | string | Sim | Identificador da pessoa fisica (M008) |
| `instituicaoId` | string | Sim | Identificador da instituicao dirigida |
| `dataInicio` | string (date) | Sim | Data de inicio do mandato |
| `dataFim` | string (date) | Sim | Data de fim do mandato |

**Response `201 Created`**

```json
{
  "dirigente": {
    "id": "DIR-2026-003",
    "pessoaId": "PES-2026-001",
    "instituicaoId": "INST-2026-010",
    "ativo": true,
    "dataInicio": "2026-01-01",
    "dataFim": "2026-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PESSOA_NAO_ENCONTRADA` | A pessoa informada nao foi encontrada. |
| `404` | `INSTITUICAO_NAO_ENCONTRADA` | A instituicao informada nao foi encontrada. |
| `409` | `MANDATO_SOBREPOSTO` | Ja existe dirigente ativo na instituicao informada. |
| `400` | `DIRIGENTE_DADOS_INVALIDOS` | Os dados do dirigente sao invalidos ou incompletos. |

---

#### `GET /api/v1/m008/dirigentes`

Lista e filtra dirigentes cadastrados.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `pessoaId` | string | Filtra pelo identificador da pessoa |
| `instituicaoId` | string | Filtra pela instituicao |
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
      "instituicaoId": "INST-2026-010",
      "ativo": true,
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

#### `POST /api/v1/m008/rubricas`

Cria uma Rubrica canonica no cadastro corporativo.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CadastrarRubrica`

**Request body**

```json
{
  "codigo": "RUB-DIARIAS",
  "nome": "Diarias",
  "descricao": "Despesas com diarias conforme normativa da FAPES.",
  "natureza": "CUSTEIO",
  "categoriaOrcamentaria": "Outras Despesas Correntes",
  "documentoFonte": "Resolucao CCAF no 309/2022",
  "vigenciaInicio": "2026-01-01",
  "vigenciaFim": null,
  "rubricaPaiId": null
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `codigo` | string | Sim | Codigo canonico unico da Rubrica |
| `nome` | string | Sim | Nome de exibicao |
| `descricao` | string | Sim | Descricao de uso da Rubrica |
| `natureza` | string | Sim | `CUSTEIO` ou `CAPITAL` |
| `categoriaOrcamentaria` | string | Nao | Categoria orcamentaria quando aplicavel |
| `documentoFonte` | string | Nao | Norma, edital ou resolucao de referencia |
| `vigenciaInicio` | string | Nao | Inicio da vigencia cadastral |
| `vigenciaFim` | string | Nao | Fim da vigencia cadastral |
| `rubricaPaiId` | string | Nao | Rubrica superior, quando for subrubrica |

**Response `201 Created`**

```json
{
  "rubrica": {
    "id": "RUB-DIARIAS",
    "codigo": "RUB-DIARIAS",
    "nome": "Diarias",
    "descricao": "Despesas com diarias conforme normativa da FAPES.",
    "natureza": "CUSTEIO",
    "rubricaPaiId": null,
    "subrubricas": [],
    "ativa": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `RUBRICA_CODIGO_DUPLICADO` | Ja existe Rubrica cadastrada com o codigo informado. |
| `404` | `RUBRICA_PAI_NAO_ENCONTRADA` | A Rubrica pai informada nao foi encontrada. |
| `422` | `RUBRICA_HIERARQUIA_INVALIDA` | A relacao pai/filha informada criaria uma hierarquia invalida. |

---

#### `POST /api/v1/m008/abrangencias-diaria`

Cria ou atualiza uma abrangencia corporativa de diaria.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CadastrarAbrangenciaDiaria`

**Request body**

```json
{
  "codigo": "DENTRO_ESTADO",
  "nome": "Dentro do Estado",
  "descricao": "Deslocamento dentro do Espirito Santo.",
  "ativo": true
}
```

**Response `201 Created`**

```json
{
  "abrangencia": {
    "id": "ABR-2026-001",
    "codigo": "DENTRO_ESTADO",
    "nome": "Dentro do Estado",
    "descricao": "Deslocamento dentro do Espirito Santo.",
    "ativo": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `ABRANGENCIA_CODIGO_DUPLICADO` | Ja existe abrangencia cadastrada com o codigo informado. |
| `422` | `ABRANGENCIA_DADOS_INVALIDOS` | Os dados da abrangencia sao invalidos ou incompletos. |

---

#### `POST /api/v1/m008/tipos-diaria`

Cria valor vigente de diaria por abrangencia.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CadastrarTipoDiaria`

**Request body**

```json
{
  "abrangenciaId": "ABR-2026-001",
  "valorUnitario": 260.0,
  "vigenciaInicio": "2026-05-01",
  "vigenciaFim": null,
  "ativo": true
}
```

**Response `201 Created`**

```json
{
  "tipoDiaria": {
    "id": "DIA-2026-001",
    "abrangenciaId": "ABR-2026-001",
    "abrangencia": {
      "codigo": "DENTRO_ESTADO",
      "nome": "Dentro do Estado"
    },
    "valorUnitario": 260.0,
    "vigenciaInicio": "2026-05-01",
    "vigenciaFim": null,
    "ativo": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `TIPO_DIARIA_VIGENCIA_SOBREPOSTA` | Ja existe tipo de diaria ativo para a abrangencia e periodo informados. |
| `404` | `ABRANGENCIA_NAO_ENCONTRADA` | A abrangencia informada nao foi encontrada. |
| `422` | `TIPO_DIARIA_VALOR_INVALIDO` | O valor unitario deve ser maior que zero. |

---

#### `POST /api/v1/m008/tipos-diaria/{tipoDiariaId}/parametros-calculo`

Cria parametros normativos vigentes vinculados a um tipo de diaria.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CadastrarParametroCalculoDiaria`

**Request body**

```json
{
  "normaReferencia": "Decreto ES no 5533-R/2023",
  "percentualDiariaSemPernoite": 0.4,
  "horasMinimasSemPernoite": 6,
  "horaLimiteRetornoAcrescimo": 14,
  "percentualAcrescimoRetorno": 0.5,
  "distanciaMinimaKm": 150,
  "limiteDiasConsecutivos": 15,
  "limiteDiariasMes": 15,
  "percentualComplementoTransporte": 0.2,
  "bloqueiaRegiaoMetropolitanaSemPernoite": true,
  "bloqueiaMunicipioLimitrofeSemPernoite": true,
  "vigenciaInicio": "2026-05-01",
  "vigenciaFim": null,
  "ativo": true
}
```

**Response `201 Created`**

```json
{
  "parametroCalculoDiaria": {
    "id": "PCD-2026-001",
    "tipoDiariaId": "DIA-2026-001",
    "normaReferencia": "Decreto ES no 5533-R/2023",
    "percentualDiariaSemPernoite": 0.4,
    "horasMinimasSemPernoite": 6,
    "horaLimiteRetornoAcrescimo": 14,
    "percentualAcrescimoRetorno": 0.5,
    "distanciaMinimaKm": 150,
    "limiteDiasConsecutivos": 15,
    "limiteDiariasMes": 15,
    "percentualComplementoTransporte": 0.2,
    "bloqueiaRegiaoMetropolitanaSemPernoite": true,
    "bloqueiaMunicipioLimitrofeSemPernoite": true,
    "vigenciaInicio": "2026-05-01",
    "vigenciaFim": null,
    "ativo": true
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `TIPO_DIARIA_NAO_ENCONTRADO` | O tipo de diaria informado nao foi encontrado. |
| `409` | `PARAMETROS_DIARIA_VIGENCIA_SOBREPOSTA` | Ja existem parametros ativos para o tipo de diaria e periodo informados. |
| `422` | `PARAMETROS_DIARIA_VALOR_INVALIDO` | Os percentuais, limites ou bloqueios informados sao invalidos. |
| `422` | `PARAMETROS_DIARIA_NORMA_OBRIGATORIA` | A norma de referencia deve ser informada. |

---

#### `GET /api/v1/m008/tipos-diaria/vigente`

Consulta o tipo de diaria e os parametros normativos vigentes vinculados a ele para uma abrangencia e data de referencia.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarTipoDiariaVigente`

**Query parameters**

| Parametro | Tipo | Obrigatorio | Descricao |
|-----------|------|-------------|-----------|
| `abrangenciaId` | string | Sim | Identificador da abrangencia corporativa |
| `dataReferencia` | date | Sim | Data usada para localizar a vigencia |

**Response `200 OK`**

```json
{
  "tipoDiaria": {
    "id": "DIA-2026-001",
    "abrangenciaId": "ABR-2026-001",
    "abrangencia": {
      "codigo": "DENTRO_ESTADO",
      "nome": "Dentro do Estado"
    },
    "valorUnitario": 260.0,
    "vigenciaInicio": "2026-05-01",
    "vigenciaFim": null
  },
  "parametroCalculoDiaria": {
    "id": "PCD-2026-001",
    "tipoDiariaId": "DIA-2026-001",
    "normaReferencia": "Decreto ES no 5533-R/2023",
    "percentualDiariaSemPernoite": 0.4,
    "horasMinimasSemPernoite": 6,
    "horaLimiteRetornoAcrescimo": 14,
    "percentualAcrescimoRetorno": 0.5,
    "distanciaMinimaKm": 150,
    "limiteDiasConsecutivos": 15,
    "limiteDiariasMes": 15,
    "percentualComplementoTransporte": 0.2,
    "bloqueiaRegiaoMetropolitanaSemPernoite": true,
    "bloqueiaMunicipioLimitrofeSemPernoite": true,
    "vigenciaInicio": "2026-05-01",
    "vigenciaFim": null
  }
}
```

---

#### `GET /api/v1/m008/rubricas`

Lista as rubricas cadastradas.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarCadastrosCorporativos` (tipoCadastro=RUBRICA)

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `natureza` | string | Filtra pela natureza: `CUSTEIO`, `CAPITAL` |
| `categoriaOrcamentaria` | string | Filtra pela categoria orcamentaria vinculada |
| `rubricaPaiId` | string | Filtra subrubricas de uma rubrica especifica |
| `nome` | string | Busca textual no nome |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "RUB-DIARIAS",
      "codigo": "RUB-DIARIAS",
      "nome": "Diarias",
      "descricao": "Despesas com diarias conforme normativa da FAPES.",
      "natureza": "CUSTEIO",
      "categoriaOrcamentaria": "Outras Despesas Correntes",
      "documentoFonte": "Resolucao CCAF no 309/2022",
      "rubricaPaiId": null,
      "subrubricas": [
        {
          "id": "RUB-DIARIA-INTER",
          "codigo": "RUB-DIARIA-INTER",
          "nome": "Diaria internacional",
          "descricao": "Diarias para viagens internacionais.",
          "rubricaPaiId": "RUB-DIARIAS",
          "ativa": true
        }
      ],
      "ativa": true
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m008/rubricas/{id}`

Consulta uma Rubrica pelo identificador, incluindo sinonimos e mapeamentos contabeis vigentes.

- **Autorizacao:** `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Response `200 OK`**

```json
{
  "rubrica": {
    "id": "RUB-DIARIAS",
    "codigo": "RUB-DIARIAS",
    "nome": "Diarias",
    "descricao": "Despesas com diarias conforme normativa da FAPES.",
    "natureza": "CUSTEIO",
    "categoriaOrcamentaria": "Outras Despesas Correntes",
    "documentoFonte": "Resolucao CCAF no 309/2022",
    "vigenciaInicio": "2026-01-01",
    "vigenciaFim": null,
    "rubricaPaiId": null,
    "subrubricas": [
      {
        "id": "RUB-DIARIA-INTER",
        "codigo": "RUB-DIARIA-INTER",
        "nome": "Diaria internacional",
        "descricao": "Diarias para viagens internacionais.",
        "rubricaPaiId": "RUB-DIARIAS",
        "ativa": true
      }
    ],
    "ativa": true,
    "sinonimos": [
      {
        "id": "SIN-RUB-001",
        "termo": "Passagens e Diarias",
        "origem": "Edital 08/2025",
        "ativo": true
      }
    ],
    "mapeamentosContabeis": [
      {
        "id": "MAP-RUB-001",
        "contaContabilRef": "CONTA-339014",
        "classificacaoContabil": "Diarias - Civil",
        "vigenciaInicio": "2026-01-01",
        "vigenciaFim": null,
        "ativo": true
      }
    ]
  }
}
```

---

#### `PUT /api/v1/m008/rubricas/{id}`

Atualiza dados cadastrais, vigencia ou rubrica pai.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `AtualizarRubrica`

**Request body**

```json
{
  "nome": "Diarias",
  "descricao": "Despesas com diarias estaduais, nacionais e internacionais.",
  "documentoFonte": "Resolucao CCAF no 309/2022",
  "vigenciaInicio": "2026-01-01",
  "vigenciaFim": null,
  "rubricaPaiId": null,
  "justificativa": "Ajuste de descricao conforme discovery de rubricas."
}
```

---

#### `POST /api/v1/m008/rubricas/{id}/desativar`

Desativa uma Rubrica para novos usos, preservando historico.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `AlterarEstadoRubrica`

**Request body**

```json
{
  "justificativa": "Rubrica substituida por nova parametrizacao normativa."
}
```

---

#### `POST /api/v1/m008/rubricas/{id}/sinonimos`

Vincula um termo alternativo a uma Rubrica canonica.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `RegistrarSinonimoRubrica`

**Request body**

```json
{
  "termo": "Passagens e Diarias",
  "origem": "Edital 08/2025"
}
```

---

#### `POST /api/v1/m008/rubricas/{id}/mapeamentos-contabeis`

Cria mapeamento contabil versionado por vigencia.

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `DefinirMapeamentoContabilRubrica`

**Request body**

```json
{
  "contaContabilRef": "CONTA-339014",
  "classificacaoContabil": "Diarias - Civil",
  "vigenciaInicio": "2026-01-01",
  "vigenciaFim": null
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
| `POST` | `/api/v1/m008/instituicoes` | CadastrarInstituicao | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m008/instituicoes` | ListarInstituicoes | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/instituicoes/{id}` | ConsultarInstituicao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/instituicoes/{id}/subestruturas` | ListarSubestruturasDaInstituicao | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m008/dirigentes` | RegistrarDirigente | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m008/dirigentes` | ListarDirigentes | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/areas-conhecimento` | ListarAreasDeConhecimento | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m008/abrangencias-diaria` | CadastrarAbrangenciaDiaria | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m008/tipos-diaria` | CadastrarTipoDiaria | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m008/tipos-diaria/{tipoDiariaId}/parametros-calculo` | CadastrarParametroCalculoDiaria | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m008/tipos-diaria/vigente` | ConsultarTipoDiariaVigente | ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/m008/rubricas` | CadastrarRubrica | ANALISTA_AGENCIA |
| `GET` | `/api/v1/m008/rubricas` | ListarRubricas | ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/m008/rubricas/{id}` | ConsultarRubrica | ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/m008/rubricas/{id}` | AtualizarRubrica | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m008/rubricas/{id}/desativar` | DesativarRubrica | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m008/rubricas/{id}/sinonimos` | RegistrarSinonimoRubrica | ANALISTA_AGENCIA |
| `POST` | `/api/v1/m008/rubricas/{id}/mapeamentos-contabeis` | DefinirMapeamentoContabilRubrica | ANALISTA_AGENCIA |
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
  "cnpj": "string | null",
  "razaoSocial": "string | null",
  "nome": "string",
  "sigla": "string",
  "email": "string | null",
  "isPublica": true,
  "isExterna": true,
  "superiorId": "string | null"
}
```

### Dirigente

```json
{
  "id": "string",
  "pessoaId": "string",
  "instituicaoId": "string",
  "ativo": true,
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

### Abrangencia

```json
{
  "id": "string",
  "codigo": "DENTRO_ESTADO | NACIONAL | INTERNACIONAL",
  "nome": "string",
  "descricao": "string | null",
  "ativo": true
}
```

### TipoDiaria

```json
{
  "id": "string",
  "abrangenciaId": "string",
  "valorUnitario": 260.0,
  "vigenciaInicio": "string (YYYY-MM-DD)",
  "vigenciaFim": "string (YYYY-MM-DD) | null",
  "ativo": true
}
```

### ParametroCalculoDiaria

```json
{
  "id": "string",
  "tipoDiariaId": "string",
  "normaReferencia": "string",
  "percentualDiariaSemPernoite": 0.4,
  "horasMinimasSemPernoite": 6,
  "horaLimiteRetornoAcrescimo": 14,
  "percentualAcrescimoRetorno": 0.5,
  "distanciaMinimaKm": 150,
  "limiteDiasConsecutivos": 15,
  "limiteDiariasMes": 15,
  "percentualComplementoTransporte": 0.2,
  "bloqueiaRegiaoMetropolitanaSemPernoite": true,
  "bloqueiaMunicipioLimitrofeSemPernoite": true,
  "vigenciaInicio": "string (YYYY-MM-DD)",
  "vigenciaFim": "string (YYYY-MM-DD) | null",
  "ativo": true
}
```

### Rubrica

```json
{
  "id": "string",
  "codigo": "string",
  "nome": "string",
  "descricao": "string",
  "natureza": "CUSTEIO | CAPITAL",
  "categoriaOrcamentaria": "string | null",
  "documentoFonte": "string | null",
  "vigenciaInicio": "string (YYYY-MM-DD) | null",
  "vigenciaFim": "string (YYYY-MM-DD) | null",
  "rubricaPaiId": "string | null",
  "subrubricas": [
    {
      "id": "string",
      "codigo": "string",
      "nome": "string",
      "descricao": "string",
      "rubricaPaiId": "string",
      "ativa": true
    }
  ],
  "ativa": true,
  "sinonimos": [
    {
      "id": "string",
      "termo": "string",
      "origem": "string | null",
      "ativo": true
    }
  ],
  "mapeamentosContabeis": [
    {
      "id": "string",
      "contaContabilRef": "string",
      "classificacaoContabil": "string | null",
      "vigenciaInicio": "string (YYYY-MM-DD)",
      "vigenciaFim": "string (YYYY-MM-DD) | null",
      "ativo": true
    }
  ]
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
| EPIC-M008-001 (Cadastro de Pessoas Fisicas) | [pessoas/epics/EPIC-M008-001.md](pessoas/epics/EPIC-M008-001.md) |
| EPIC-M008-002 (Cadastro de Instituicoes) | [instituicoes/epics/EPIC-M008-002.md](instituicoes/epics/EPIC-M008-002.md) |
| EPIC-M008-003 (Classificacoes Corporativas) | [classificacoes/epics/EPIC-M008-003.md](classificacoes/epics/EPIC-M008-003.md) |
| EPIC-M008-004 (Catalogo de Rubricas) | [rubricas/epics/EPIC-M008-004.md](rubricas/epics/EPIC-M008-004.md) |
| EPIC-M008-005 (Gestao Corporativa de Diarias) | [diarias/epics/EPIC-M008-005.md](diarias/epics/EPIC-M008-005.md) |
| EPIC-M008-006 (Cadastros Geograficos) | [geografia/epics/EPIC-M008-006.md](geografia/epics/EPIC-M008-006.md) |
