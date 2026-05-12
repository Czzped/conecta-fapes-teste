# Contrato de API HTTP — M024 Curriculo do Pesquisador

Referencia de dominio e regras de negocio: [README.md](README.md) | [modelo-estrutural.md](modelo-estrutural.md) | [eventos-dominio.md](eventos-dominio.md)

## Visao Geral

Especifica o contrato HTTP REST do M024 como bounded context responsavel pelo `Curriculo` academico do pesquisador. Integracao com o CNPq Lattes esta em [M023/lattes](../M023-integracoes/lattes/README.md) -- as rotas de sincronizacao deste modulo invocam o adapter de forma **sincrona** e retornam o resultado final na mesma resposta.

### Base URL

```
/api/v1/m024
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 -- `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | CPF (somente digitos), `numeroLattes` |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |
| Modelo de execucao | **Sincrono**. Vincular/Sincronizar chamam o adapter e bloqueiam ate concluir (sucesso ou erro). Sem polling, sem eventos assincronos. |

### Autorizacao

Todas as rotas exigem autenticacao. Perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `PESQUISADOR` | Pessoa fisica autenticada -- opera sobre o proprio curriculo |
| `ANALISTA_AGENCIA` | Analista da Agencia de Fomento -- leitura e disparo de sincronizacao para qualquer pesquisador |
| `MODULO_INTERNO` | Modulo interno autorizado (M011, M018, M019) -- consulta para selecao e indicadores |

---

## Envelope de Erro

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "cpf": "12345678901"
    }
  }
}
```

### Mapeamento de HTTP Status

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | CPF ou curriculo nao encontrado |
| `409 Conflict` | Conflito de estado | `numeroLattes` ja vinculado a outra PessoaFisica |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Pesquisador suspenso |
| `502 Bad Gateway` | Falha no adapter externo | Adapter M023/lattes retornou erro tecnico, parse failure, fonte indisponivel |

---

## Recursos

### 1. Vinculacao e Sincronizacao

#### `POST /api/v1/m024/pesquisadores/{cpf}/curriculo/vincular`

Associa um `numeroLattes` a uma `PessoaFisica` existente e executa a primeira sincronizacao via adapter [M023/lattes](../M023-integracoes/lattes/README.md). Sincrona: a resposta carrega o `Curriculo` ja populado, ou retorna erro se a importacao falhar.

- **Autorizacao:** `PESQUISADOR` (proprio CPF) ou `ANALISTA_AGENCIA`
- **Operacao de origem:** `VincularCurriculo`

**Request body**

```json
{
  "numeroLattes": "1234567890123456"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `numeroLattes` | string | Sim | Identificador CNPq do curriculo, 16 digitos |

**Response `201 Created`**

```json
{
  "cpf": "12345678901",
  "numeroLattes": "1234567890123456",
  "versao": 1,
  "dataAtualizacaoLattes": "2026-05-03",
  "dataUltimaSincronizacao": "2026-05-11T14:32:42Z",
  "resumo": "Pesquisadora em Ciencia da Computacao...",
  "contagens": {
    "formacoes": 3,
    "artigos": 27,
    "livros": 4,
    "orientacoes": 12,
    "projetos": 8,
    "premios": 2,
    "eventos": 18,
    "idiomas": 3,
    "areasDeAtuacao": 2
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PESSOA_NAO_ENCONTRADA` | Nao existe PessoaFisica cadastrada com o CPF informado. |
| `409` | `NUMERO_LATTES_JA_VINCULADO` | Este numero Lattes ja esta vinculado a outra PessoaFisica. |
| `422` | `PESQUISADOR_SUSPENSO` | A pessoa esta suspensa e nao pode vincular curriculo. |
| `502` | `ADAPTER_LATTES_FALHOU` | Adapter M023/lattes nao conseguiu importar o curriculo. `details.categoriaErro` em `Tecnico`, `Permissao`, `ParseError`, `FonteIndisponivel`. Vinculacao nao persiste -- chamada deve ser reexecutada. |

---

#### `POST /api/v1/m024/pesquisadores/{cpf}/curriculo/sincronizar`

Reexecuta a sincronizacao do curriculo. Delega ao adapter M023/lattes que apaga as entidades filhas anteriores e recria a partir do snapshot atual do Lattes (RN-M024-03). Sincrona: a resposta carrega o `Curriculo` atualizado, ou retorna erro mantendo o snapshot anterior intacto.

- **Autorizacao:** `PESQUISADOR` (proprio CPF) ou `ANALISTA_AGENCIA`
- **Operacao de origem:** `SincronizarCurriculo`

**Request body**

Vazio.

**Response `200 OK`**

```json
{
  "cpf": "12345678901",
  "numeroLattes": "1234567890123456",
  "versao": 5,
  "dataAtualizacaoLattes": "2026-05-03",
  "dataUltimaSincronizacao": "2026-05-11T14:32:42Z",
  "resumo": "Pesquisadora em Ciencia da Computacao...",
  "contagens": {
    "formacoes": 3,
    "artigos": 28,
    "livros": 4,
    "orientacoes": 12,
    "projetos": 8,
    "premios": 2,
    "eventos": 19,
    "idiomas": 3,
    "areasDeAtuacao": 2
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CURRICULO_NAO_VINCULADO` | A pessoa nao possui Curriculo vinculado. |
| `422` | `PESQUISADOR_SUSPENSO` | Pessoa suspensa nao pode sincronizar curriculo. |
| `502` | `ADAPTER_LATTES_FALHOU` | Adapter M023/lattes nao concluiu a sincronizacao. Snapshot anterior preservado. |

---

### 2. Consulta do Curriculo

#### `GET /api/v1/m024/pesquisadores/{cpf}/curriculo`

Retorna o perfil completo do pesquisador (Curriculo + entidades filhas consolidadas).

- **Autorizacao:** `PESQUISADOR` (proprio CPF), `ANALISTA_AGENCIA` ou `MODULO_INTERNO`

**Response `200 OK`**

```json
{
  "cpf": "12345678901",
  "nome": "Maria Oliveira",
  "curriculo": {
    "numeroLattes": "1234567890123456",
    "versao": 5,
    "dataAtualizacaoLattes": "2026-05-03",
  "dataUltimaSincronizacao": "2026-05-11T14:32:42Z",
    "resumo": "Pesquisadora em Ciencia da Computacao...",
    "valido": true,
    "formacoes": [],
    "artigos": [],
    "livros": [],
    "orientacoes": [],
    "projetos": [],
    "premios": [],
    "eventos": [],
    "idiomas": [],
    "areasDeAtuacao": []
  }
}
```

O campo `valido` reflete RN-M024-04 (sincronizado nos ultimos 12 meses).

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CURRICULO_NAO_VINCULADO` | A pessoa nao possui Curriculo vinculado. |

---

#### `GET /api/v1/m024/pesquisadores/{cpf}/curriculo/formacoes`

Lista as formacoes academicas do pesquisador.

- **Autorizacao:** `PESQUISADOR` (proprio CPF), `ANALISTA_AGENCIA` ou `MODULO_INTERNO`

**Query params**

| Param | Tipo | Descricao |
|-------|------|-----------|
| `nivel` | string | Filtra por `NivelFormacao` (Graduacao, Especializacao, Mestrado, Doutorado, PosDoutorado) |
| `status` | string | Filtra por `Concluida` ou `EmAndamento` |

**Response `200 OK`**

```json
{
  "formacoes": [
    {
      "nivel": "Doutorado",
      "instituicao": { "cnpj": "32479481000150", "nome": "UFES" },
      "curso": "Ciencia da Computacao",
      "areaConhecimento": { "grandeArea": "Ciencias Exatas e da Terra", "area": "Ciencia da Computacao" },
      "anoInicio": 2018,
      "anoConclusao": 2022,
      "status": "Concluida"
    }
  ]
}
```

---

#### `GET /api/v1/m024/pesquisadores/{cpf}/curriculo/artigos`

Lista a producao bibliografica em periodico ou anais. **Query params**: `anoMinimo`, `anoMaximo`, `qualis`.

---

#### `GET /api/v1/m024/pesquisadores/{cpf}/curriculo/livros`

Lista livros e capitulos. **Query params**: `tipo` (`Livro` ou `Capitulo`), `anoMinimo`, `anoMaximo`.

---

#### `GET /api/v1/m024/pesquisadores/{cpf}/curriculo/orientacoes`

Lista orientacoes. **Query params**: `nivel` (codigo de NivelOrientacao), `status`.

---

#### `GET /api/v1/m024/pesquisadores/{cpf}/curriculo/projetos`

Lista projetos. **Query params**: `papel`, `status`, `tipo` (codigo de TipoProjeto).

---

#### `GET /api/v1/m024/pesquisadores/{cpf}/curriculo/premios`

Lista premios recebidos.

---

#### `GET /api/v1/m024/pesquisadores/{cpf}/curriculo/eventos`

Lista participacoes em eventos cientificos. **Query params**: `papel`, `anoMinimo`.

---

#### `GET /api/v1/m024/pesquisadores/{cpf}/curriculo/idiomas`

Lista os idiomas declarados pelo pesquisador, com nivel de proficiencia por habilidade.

---

### 3. Busca por Expertise

#### `GET /api/v1/m024/pesquisadores`

Busca pesquisadores por area de conhecimento, titulacao minima e producao bibliografica minima. Endpoint dedicado a consumidores como M011 (selecao de Ad Hoc).

- **Autorizacao:** `ANALISTA_AGENCIA` ou `MODULO_INTERNO`
- **Operacao de origem:** `BuscarPesquisadoresPorExpertise`

**Query params**

| Param | Tipo | Obrig. | Descricao |
|-------|------|--------|-----------|
| `area` | string | Sim | Codigo da AreaConhecimento CNPq (grande area, area, subarea ou especialidade) |
| `titulacaoMinima` | string | Nao | Nivel minimo de formacao: `Mestrado`, `Doutorado`, `PosDoutorado` |
| `producaoMinima` | integer | Nao | Numero minimo de artigos publicados |
| `apenasValidos` | boolean | Nao | Se `true`, exclui pesquisadores com curriculo desatualizado (RN-M024-04). Padrao `true` |
| `page` | integer | Nao | Pagina |
| `pageSize` | integer | Nao | Tamanho da pagina |

**Response `200 OK`**

```json
{
  "pesquisadores": [
    {
      "cpf": "12345678901",
      "nome": "Maria Oliveira",
      "numeroLattes": "1234567890123456",
      "titulacaoMaxima": "Doutorado",
      "areaPrincipal": "Ciencia da Computacao",
      "totalArtigos": 27,
      "curriculoValido": true
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 134
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `AREA_INVALIDA` | A area de conhecimento informada nao existe no cadastro canonico CNPq. |

> Pesquisadores suspensos sao automaticamente excluidos do resultado (RN-M024-05).
