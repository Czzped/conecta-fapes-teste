# Contrato de API HTTP — M018 Business Intelligence

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M018 como bounded context analitico responsavel por consolidacao diaria de dados, consulta de paineis e exportacao de relatorios gerenciais. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m018
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `RELBI-2026-008`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao, exceto onde indicado. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `DIRETORIA` | Diretoria (DIPRE, DIRAF) — acesso completo a todos os paineis e indicadores consolidados |
| `AREA_TECNICA` | Area Tecnica — acesso restrito aos dados do proprio escopo de atuacao |
| `GESTOR_PROGRAMA` | Gestor de programa — acesso a paineis e exportacoes do seu programa |
| `SISTEMA` | Sistema — executa job agendado de atualizacao dos paineis analiticos |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "painel": "PROGRAMAS_PROJETOS"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Painel ou relatorio nao encontrado |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Estado invalido, formato nao suportado, acesso negado |

---

## Recursos

### 1. Paineis Analiticos

#### `POST /api/v1/m018/paineis/atualizar`

Consolida diariamente dados transacionais em paineis analiticos.

- **Autorizacao:** `SISTEMA`
- **Operacao de origem:** `AtualizarPaineisAnaliticos`
- **Idempotencia:** Sim — por dataReferencia

**Request body**

```json
{
  "dataReferencia": "2026-04-13"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `dataReferencia` | string (date) | Sim | Data de referencia da consolidacao analitica |

**Response `200 OK`**

```json
{
  "atualizacao": {
    "dataReferencia": "2026-04-13",
    "paineisProcessados": 6,
    "status": "CONCLUIDA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `FONTE_ANALITICA_INDISPONIVEL` | Uma ou mais fontes transacionais nao estavam disponiveis para atualizacao analitica. |
| `422` | `TEMPO_PROCESSAMENTO_EXCEDIDO` | A atualizacao analitica excedeu o tempo maximo esperado. |
| `400` | `DATA_REFERENCIA_INVALIDA` | A data de referencia informada para atualizacao analitica e invalida. |

---

#### `GET /api/v1/m018/paineis`

Consulta painel analitico com filtros de periodo, programa, edital e instituicao.

- **Autorizacao:** `DIRETORIA`, `AREA_TECNICA`, `GESTOR_PROGRAMA`
- **Operacao de origem:** `ConsultarPainelAnalitico`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipoPainel` | string | Tipo do painel: `PROGRAMAS_PROJETOS`, `BOLSAS_RESULTADOS`, `FINANCEIRO`, `AUXILIOS` |
| `programaId` | string | Filtra por identificador de programa (M010) |
| `editalId` | string | Filtra por identificador de edital (M003) |
| `instituicaoId` | string | Filtra por instituicao |
| `periodoInicio` | string (date) | Inicio do periodo de analise |
| `periodoFim` | string (date) | Fim do periodo de analise |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "painelAnalitico": {
    "tipoPainel": "PROGRAMAS_PROJETOS",
    "periodoInicio": "2026-01-01",
    "periodoFim": "2026-04-13",
    "dataUltimaAtualizacao": "2026-04-13",
    "indicadores": [
      {
        "nome": "totalProgramas",
        "valor": 8
      },
      {
        "nome": "totalIniciativas",
        "valor": 142
      },
      {
        "nome": "taxaExecucao",
        "valor": 0.82
      }
    ]
  },
  "total": 3,
  "page": 1,
  "pageSize": 20
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PAINEL_ANALITICO_NAO_ENCONTRADO` | O painel analitico solicitado nao foi encontrado. |
| `422` | `ACESSO_PAINEL_NEGADO` | O usuario nao possui permissao para visualizar os dados do painel solicitado. |
| `400` | `FILTRO_PAINEL_INVALIDO` | Os filtros informados para consulta do painel analitico sao invalidos. |

---

### 2. Indicadores Consolidados

#### `GET /api/v1/m018/indicadores`

Consulta indicadores de desempenho e comparativos entre periodos.

- **Autorizacao:** `DIRETORIA`, `GESTOR_PROGRAMA`
- **Operacao de origem:** `ConsultarIndicadoresConsolidados`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `periodoAtual` | string | Periodo atual para calculo (ex: `2026`, `2026-04`) |
| `periodoComparativo` | string | Periodo de comparacao (ex: `2025`, `2025-04`) |
| `programaId` | string | Filtra por identificador de programa |
| `editalId` | string | Filtra por identificador de edital |

**Response `200 OK`**

```json
{
  "indicadores": [
    {
      "nome": "taxaExecucao",
      "descricao": "Taxa de execucao financeira",
      "valorAtual": 0.82,
      "valorComparativo": 0.74,
      "variacaoPercentual": 10.81
    },
    {
      "nome": "tempoMedioConcessao",
      "descricao": "Tempo medio de concessao de bolsa (dias)",
      "valorAtual": 18.5,
      "valorComparativo": 24.3,
      "variacaoPercentual": -23.87
    },
    {
      "nome": "taxaRenovacao",
      "descricao": "Taxa de renovacao de bolsas",
      "valorAtual": 0.91,
      "valorComparativo": 0.88,
      "variacaoPercentual": 3.41
    }
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `INDICADOR_NAO_DISPONIVEL` | Nao foi possivel calcular um ou mais indicadores consolidados para os periodos informados. |
| `400` | `PERIODO_ANALITICO_INVALIDO` | Os periodos informados para comparacao analitica sao invalidos. |

---

### 3. Relatorios Exportados

#### `POST /api/v1/m018/relatorios`

Exporta relatorio analitico em formato PDF ou Excel.

- **Autorizacao:** `DIRETORIA`, `AREA_TECNICA`, `GESTOR_PROGRAMA`
- **Operacao de origem:** `ExportarRelatorioAnalitico`
- **Idempotencia:** Nao

**Request body**

```json
{
  "tipoPainel": "BOLSAS_RESULTADOS",
  "formato": "PDF",
  "filtros": {
    "programaId": "PROG-2026-01",
    "periodoInicio": "2026-01-01",
    "periodoFim": "2026-04-13"
  }
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `tipoPainel` | string (enum) | Sim | Tipo do painel a exportar: `PROGRAMAS_PROJETOS`, `BOLSAS_RESULTADOS`, `FINANCEIRO`, `AUXILIOS` |
| `formato` | string (enum) | Sim | Formato de exportacao: `PDF`, `EXCEL` |
| `filtros` | object | Nao | Filtros aplicados ao relatorio (programa, edital, periodo) |
| `filtros.programaId` | string | Nao | Identificador de programa |
| `filtros.editalId` | string | Nao | Identificador de edital |
| `filtros.periodoInicio` | string (date) | Nao | Inicio do periodo do relatorio |
| `filtros.periodoFim` | string (date) | Nao | Fim do periodo do relatorio |

**Response `201 Created`**

```json
{
  "relatorioExportado": {
    "id": "RELBI-2026-008",
    "tipoPainel": "BOLSAS_RESULTADOS",
    "formato": "PDF",
    "dataGeracao": "2026-04-14T10:00:00Z",
    "url": "/api/v1/m018/relatorios/RELBI-2026-008/download"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `FORMATO_EXPORTACAO_NAO_SUPORTADO` | O formato solicitado nao e suportado pelo modulo de BI. |
| `422` | `EXPORTACAO_ANALITICA_INDISPONIVEL` | Nao foi possivel gerar a exportacao analitica neste momento. |
| `404` | `PAINEL_ANALITICO_NAO_ENCONTRADO` | O painel analitico solicitado para exportacao nao foi encontrado. |
| `400` | `RELATORIO_DADOS_INVALIDOS` | Os dados informados para geracao do relatorio sao invalidos. |

---

#### `GET /api/v1/m018/relatorios`

Lista relatorios exportados gerados pelo usuario.

- **Autorizacao:** `DIRETORIA`, `AREA_TECNICA`, `GESTOR_PROGRAMA`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipoPainel` | string | Filtra por tipo de painel |
| `formato` | string | Filtra por formato: `PDF`, `EXCEL` |
| `dataInicio` | string (date) | Filtra relatorios gerados a partir desta data |
| `dataFim` | string (date) | Filtra relatorios gerados ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "RELBI-2026-008",
      "tipoPainel": "BOLSAS_RESULTADOS",
      "formato": "PDF",
      "dataGeracao": "2026-04-14T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

---

#### `GET /api/v1/m018/relatorios/{id}`

Consulta o detalhe de um relatorio exportado.

- **Autorizacao:** `DIRETORIA`, `AREA_TECNICA`, `GESTOR_PROGRAMA`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `id` | string | Identificador do relatorio (ex: `RELBI-2026-008`) |

**Response `200 OK`**

```json
{
  "relatorioExportado": {
    "id": "RELBI-2026-008",
    "tipoPainel": "BOLSAS_RESULTADOS",
    "formato": "PDF",
    "dataGeracao": "2026-04-14T10:00:00Z",
    "url": "/api/v1/m018/relatorios/RELBI-2026-008/download"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `RELATORIO_NAO_ENCONTRADO` | O relatorio exportado informado nao foi encontrado. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m018/paineis/atualizar` | AtualizarPaineisAnaliticos | SISTEMA |
| `GET` | `/api/v1/m018/paineis` | ConsultarPainelAnalitico | DIRETORIA, AREA_TECNICA, GESTOR_PROGRAMA |
| `GET` | `/api/v1/m018/indicadores` | ConsultarIndicadoresConsolidados | DIRETORIA, GESTOR_PROGRAMA |
| `POST` | `/api/v1/m018/relatorios` | ExportarRelatorioAnalitico | DIRETORIA, AREA_TECNICA, GESTOR_PROGRAMA |
| `GET` | `/api/v1/m018/relatorios` | ListarRelatoriosExportados | DIRETORIA, AREA_TECNICA, GESTOR_PROGRAMA |
| `GET` | `/api/v1/m018/relatorios/{id}` | ConsultarRelatorioExportado | DIRETORIA, AREA_TECNICA, GESTOR_PROGRAMA |

---

## Schemas de Dominio (Referencia)

### PainelAnalitico

```json
{
  "tipoPainel": "PROGRAMAS_PROJETOS | BOLSAS_RESULTADOS | FINANCEIRO | AUXILIOS",
  "periodoInicio": "string (YYYY-MM-DD)",
  "periodoFim": "string (YYYY-MM-DD)",
  "dataUltimaAtualizacao": "string (YYYY-MM-DD)",
  "indicadores": [
    {
      "nome": "string",
      "valor": "number"
    }
  ]
}
```

### Indicador

```json
{
  "nome": "string",
  "descricao": "string",
  "valorAtual": "number",
  "valorComparativo": "number (opcional)",
  "variacaoPercentual": "number (opcional)"
}
```

### RelatorioExportado

```json
{
  "id": "string",
  "tipoPainel": "string",
  "formato": "PDF | EXCEL",
  "dataGeracao": "string (ISO 8601)",
  "url": "string"
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
| EPIC-M018-001 (Paineis de Programas e Projetos) | [epics/EPIC-M018-001.md](epics/EPIC-M018-001.md) |
| EPIC-M018-002 (Paineis de Bolsas e Resultados) | [epics/EPIC-M018-002.md](epics/EPIC-M018-002.md) |
