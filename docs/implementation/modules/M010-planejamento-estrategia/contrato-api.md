# Contrato de API HTTP — M010 Planejamento e Estrategia

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md) | Modelos: [planejamento](planejamento/modelo-estrutural.md) / [programas](programas/modelo-estrutural.md) / [parcerias](parcerias/modelo-estrutural.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M010 (Planejamento e Estrategia) — Plano Estrategico, Eixos, Programas e Parcerias — conforme o modelo de dominio consolidado. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1
```

> **Nota**: as rotas nao expoem o identificador interno do modulo (`M010`). Os recursos sao expostos diretamente sob `/api/v1/` (ex.: `/parcerias`, `/programas`, `/planos-estrategicos`). A segmentacao por modulo e uma decisao interna de arquitetura e nao deve vazar para clientes externos.

> **Implementacao atual (SPRINT-007)**: os endpoints de Parcerias estao sob `/api/parcerias` (sem prefixo `v1`). O prefixo `/api/v1` sera adicionado em sprint futura de versionamento.

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20; max pageSize=100) |
| Identificadores | Strings opacas (ex: `PE-2026-01`, `PROG-2026-01`, `PAR-2026-03`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. Perfis:

| Perfil | Descricao |
|--------|-----------|
| `DIRETORIA` | Manutencao e consulta do plano estrategico |
| `ANALISTA_AGENCIA` | Gestao de programas e parcerias (Area de Parcerias) |
| `MODULO_INTERNO` | Modulos consumidores (M003, M011, M016, M018, M019) — apenas consultas |

---

## Envelope de Erro

Todas as respostas de erro seguem o envelope abaixo:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "parceriaId": "PAR-2026-03"
    }
  }
}
```

### Mapeamento de HTTP Status para Categoria de Erro

| HTTP Status | Categoria | Quando usar |
|-------------|-----------|-------------|
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | Plano ativo duplicado, segunda Vigencia original |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Saldo insuficiente, invariante temporal violado |

---

## 1. Plano Estrategico

### `POST /api/v1/planos-estrategicos`

Registra plano estrategico.

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
  "ativo": true
}
```

**Response `201 Created`**

```json
{
  "planoEstrategico": {
    "id": "PE-2026-01",
    "nome": "Plano Estrategico 2026-2029",
    "ativo": true,
    "dataInicio": "2026-01-01",
    "dataFim": "2029-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `PLANO_DADOS_INVALIDOS` | Dados obrigatorios do plano estrategico ausentes ou mal formados. |
| `409` | `PLANO_ATIVO_DUPLICADO` | Ja existe outro plano ativo (RN09). |
| `422` | `VIGENCIA_PLANO_INVALIDA` | `dataInicio` >= `dataFim`. |

### `GET /api/v1/planos-estrategicos`

Lista planos.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`

**Query parameters**: `ativo`, `page`, `pageSize`

**Response `200 OK`** — objeto `{ items, total, page, pageSize }`

### `GET /api/v1/planos-estrategicos/{id}`

Consulta detalhe.

- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PLANO_NAO_ENCONTRADO` | Plano nao encontrado. |

### `PUT /api/v1/planos-estrategicos/{id}`

Atualiza. **Autorizacao:** `DIRETORIA`. **Idempotencia:** Sim.

---

## 2. Eixos Estrategicos

### `POST /api/v1/planos-estrategicos/{planoId}/eixos`

Cadastra eixo (RN08). **Autorizacao:** `DIRETORIA`.

**Request body**

```json
{
  "nome": "Transformacao Digital",
  "descricao": "Iniciativas de inovacao e tecnologia.",
  "prioridade": 1
}
```

**Response `201 Created`**

```json
{
  "eixoEstrategico": {
    "id": "EIXO-TD-001",
    "planoId": "PE-2026-01",
    "nome": "Transformacao Digital",
    "prioridade": 1
  }
}
```

**Erros**: `404 PLANO_NAO_ENCONTRADO`, `400 EIXO_DADOS_INVALIDOS`, `409 EIXO_CODIGO_DUPLICADO`.

### `GET /api/v1/planos-estrategicos/{planoId}/eixos`

Lista eixos do plano. **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`.

---

## 3. Programas

### `POST /api/v1/programas`

Registra programa vinculado a eixos e Instituicao demandante (RN01, RN16).

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CriarPrograma`
- **Idempotencia:** Nao

**Request body**

```json
{
  "nome": "Programa de Dados Publicos",
  "eixos": ["EIXO-TD-001"],
  "resumo": "Programa voltado a projetos de dados e inovacao.",
  "dataInicio": "2026-01-01",
  "dataFim": "2028-12-31",
  "instituicaoDemandanteId": "INST-2026-010"
}
```

**Response `201 Created`**

```json
{
  "programa": {
    "id": "PROG-2026-01",
    "estado": "EM_PLANEJAMENTO",
    "eixos": ["EIXO-TD-001"],
    "instituicaoDemandanteId": "INST-2026-010",
    "dataInicio": "2026-01-01",
    "dataFim": "2028-12-31"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `PROGRAMA_DADOS_INVALIDOS` | Dados obrigatorios ausentes. |
| `400` | `INSTITUICAO_DEMANDANTE_AUSENTE` | Programa deve ter uma Instituicao demandante (RN16). |
| `422` | `PROGRAMA_SEM_EIXO` | Programa deve ter pelo menos um eixo (RN01). |
| `404` | `EIXO_ESTRATEGICO_NAO_ENCONTRADO` | Eixo informado nao encontrado. |
| `404` | `INSTITUICAO_NAO_ENCONTRADA` | Instituicao demandante nao encontrada em M008. |

### `GET /api/v1/programas`

Lista com filtros: `nome`, `estado` (`EM_PLANEJAMENTO`/`ATIVO`/`SUSPENSO`/`ENCERRADO`), `eixoId`, `instituicaoDemandanteId`, `page`, `pageSize`.

### `GET /api/v1/programas/{id}`

Consulta com aportes recebidos de parcerias e comite de governanca.

**Response `200 OK`**

```json
{
  "programa": {
    "id": "PROG-2026-01",
    "estado": "EM_PLANEJAMENTO",
    "eixos": ["EIXO-TD-001"],
    "instituicaoDemandanteId": "INST-2026-010",
    "dataInicio": "2026-01-01",
    "dataFim": "2028-12-31",
    "aportesDeParcerias": [
      { "parceriaId": "PAR-2026-03", "valor": 150000.0, "dataAporte": "2026-04-10" }
    ],
    "totalAportadoPorParcerias": 150000.0
  }
}
```

### `PUT /api/v1/programas/{id}`

Atualiza. **Invariante RN13**: se houver aportes, `dataInicio`/`dataFim` alterados devem respeitar a vigencia de todas as Parcerias aportantes.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROGRAMA_NAO_ENCONTRADO` | Programa nao encontrado. |
| `422` | `PROGRAMA_FORA_DA_VIGENCIA` | Alteracao viola RN13 (periodo do Programa fora da vigencia de Parceria aportante). |

### `DELETE /api/v1/programas/{id}`

Remove programa (RI1). **Autorizacao:** `ANALISTA_AGENCIA`.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PROGRAMA_NAO_ENCONTRADO` | Programa nao encontrado. |
| `422` | `PROGRAMA_COM_INICIATIVAS_VINCULADAS` | Existem Iniciativas vinculadas ao Programa (RI1). |

---

## 4. Comite de Governanca

### `POST /api/v1/programas/{id}/comite`

Cadastra/atualiza membros. **Idempotencia:** Sim.

**Request body**

```json
{
  "membros": [
    { "pessoaId": "PF-2026-001", "papel": "PRESIDENTE" },
    { "pessoaId": "PF-2026-002", "papel": "MEMBRO" }
  ]
}
```

---

## 5. Parcerias

### `POST /api/v1/parcerias`

Registra parceria com Vigencia original e uma Instituicao vinculada (RN10, RN15).

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `CriarParceria`
- **Idempotencia:** Nao

**Request body**

```json
{
  "nome": "Parceria Inovacao 2026",
  "numeroDProcesso": "PRC-2026-001",
  "dataAssinatura": "2026-03-01",
  "objetivo": "Apoiar iniciativas de pesquisa aplicada.",
  "instituicaoId": "INST-2026-010",
  "vigenciaOriginal": {
    "dataInicio": "2026-03-01",
    "dataFim": "2028-12-31",
    "dataAssinatura": "2026-03-01",
    "documento": "DOC-TC-2026-001"
  }
}
```

**Response `201 Created`**

```json
{
  "parceria": {
    "id": "PAR-2026-03",
    "estado": "EmElaboracao",
    "vigenciaInicioCorrente": "2026-03-01",
    "vigenciaFimCorrente": "2028-12-31",
    "saldo": 0.0,
    "instituicaoId": "INST-2026-010"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `400` | `PARCERIA_DADOS_INVALIDOS` | Dados obrigatorios ausentes. |
| `400` | `VIGENCIA_ORIGINAL_AUSENTE` | `vigenciaOriginal` obrigatoria (RN15). |
| `422` | `PARCERIA_SEM_INSTITUICAO` | Exatamente uma Instituicao e obrigatoria (RN10). |
| `422` | `VIGENCIA_ORIGINAL_INVALIDA` | `dataInicio` >= `dataFim` na Vigencia original. |
| `404` | `INSTITUICAO_NAO_ENCONTRADA` | Instituicao informada nao encontrada em M008. |

### `GET /api/v1/parcerias`

Filtros: `nome`, `estado` (`EmElaboracao`/`Vigente`/`Suspensa`/`Encerrada`), `instituicaoId`, `page`, `pageSize`.

### `GET /api/v1/parcerias/{id}`

Detalhe com Vigencias, aportes recebidos, aportes destinados a programas, documentos, saldo.

**Response `200 OK`**

```json
{
  "parceria": {
    "id": "PAR-2026-03",
    "estado": "Vigente",
    "vigenciaInicioCorrente": "2026-03-01",
    "vigenciaFimCorrente": "2029-12-31",
    "saldo": 350000.0,
    "vigencias": [
      { "id": "VIG-2026-001", "isAditivo": false, "dataInicio": "2026-03-01", "dataFim": "2028-12-31" },
      { "id": "VIG-2027-002", "isAditivo": true, "dataInicio": "2026-03-01", "dataFim": "2029-12-31" }
    ],
    "aportesFinanceiros": [
      { "id": "APO-2026-001", "instituicaoId": "INST-2026-010", "valor": 500000.0, "isAditivo": false }
    ],
    "aportesEmProgramas": [
      { "id": "AFP-2026-001", "programaId": "PROG-2026-01", "valor": 150000.0 }
    ],
    "instituicaoId": "INST-2026-010",
    "documentos": ["DOC-TC-2026-001", "DOC-ANEXO-2026-005"]
  }
}
```

### `PUT /api/v1/parcerias/{id}`

Atualiza dados cadastrais (nome, objetivo, processo). **Nao altera Vigencia nem saldo.**

### `DELETE /api/v1/parcerias/{id}`

Remove a Parceria em caso de erro de cadastro (RI3).

- **Operacao de origem:** `RemoverParceria`
- **Autorizacao:** `ANALISTA_AGENCIA`

**Pre-condicao (RI3)**: a Parceria nao pode ter nenhum `AporteFinanceiroParceriaPrograma` vinculado.

**Response `204 No Content`** (sucesso).

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PARCERIA_NAO_ENCONTRADA` | Parceria nao encontrada. |
| `422` | `PARCERIA_VINCULADA_A_PROGRAMAS` | Parceria vinculada a Programas; impossivel remover (RI3). `details.programasVinculados` lista os Programas. |

### `POST /api/v1/parcerias/{id}/suspender`

Suspende temporariamente uma Parceria `Vigente` (estado → `Suspensa`). **Autorizacao:** `ANALISTA_AGENCIA`.

**Request body**: `{ "motivo": "..." }` (obrigatorio).

**Erros**: `404 PARCERIA_NAO_ENCONTRADA`, `422 PARCERIA_NAO_VIGENTE`.

### `POST /api/v1/parcerias/{id}/reativar`

Reativa Parceria Suspensa (estado → `Vigente`). Exige hoje em `[vigenciaInicioCorrente, vigenciaFimCorrente]`.

**Erros**: `404`, `422 PARCERIA_NAO_SUSPENSA`, `422 FORA_DA_VIGENCIA`.

### `POST /api/v1/programas/{id}/ativar`

Transiciona Programa para `ATIVO` (exige eixo vinculado e comite definido).

**Erros**: `404 PROGRAMA_NAO_ENCONTRADO`, `422 SEM_EIXO`, `422 SEM_COMITE`, `422 ESTADO_INVALIDO`.

### `POST /api/v1/programas/{id}/suspender`

Suspende Programa Ativo. **Request body**: `{ "motivo": "..." }`.

### `POST /api/v1/programas/{id}/reativar`

Reativa Programa Suspenso.

### `POST /api/v1/programas/{id}/encerrar`

Encerra Programa (transicao de estado distinta de `DELETE /programas/{id}`). Bloqueado se houver Iniciativas em andamento que impedem o encerramento (RI1).

**Request body**:
```json
{ "dataEncerramento": "2029-12-31", "justificativa": "..." }
```

**Erros**: `404`, `422 PROGRAMA_COM_INICIATIVAS_EM_ANDAMENTO` (RI1).

---

### `PATCH /api/parcerias/{id}/formalizar`

Transiciona a Parceria de `EmElaboracao` para `Vigente` (RN19).

- **Operacao de origem:** `FormalizarParceria`
- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim (rechamadas em estado `Vigente` retornam o estado atual)

**Pre-condicoes (RN19)**
1. `dataAssinatura` preenchida no body
2. Pelo menos 1 `AporteFinanceiro` registrado (original, `isAditivo = false`)
3. Data atual em `[vigenciaInicioCorrente, vigenciaFimCorrente]`
4. ~~Pelo menos 1 `Documento` anexado~~ — omitido neste sprint (M008 Documento fora do escopo)

**Request body**

```json
{
  "dataAssinatura": "2026-03-01"
}
```

**Response `200 OK`**

```json
{
  "parceria": {
    "id": "PAR-2026-03",
    "estado": "Vigente"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PARCERIA_NAO_ENCONTRADA` | Parceria nao encontrada. |
| `422` | `FORMALIZACAO_DATA_ASSINATURA_AUSENTE` | `dataAssinatura` ausente no body (RN19). |
| `422` | `FORMALIZACAO_SEM_APORTE` | Parceria nao possui AporteFinanceiro original registrado (RN19). |
| `422` | `FORMALIZACAO_FORA_DA_VIGENCIA` | Data atual fora de `[vigenciaInicioCorrente, vigenciaFimCorrente]` (RN19). |

### `PATCH /api/parcerias/{id}/encerrar`

Encerra a Parceria com justificativa obrigatoria (RI2).

- **Autorizacao:** `ANALISTA_AGENCIA`
- **Operacao de origem:** `EncerrarParceria`

> **Implementacao atual (SPRINT-007)**: encerramento simples com justificativa. O fluxo de confirmacao de cascata (`confirmarCascata`) e encerramento automatico por expiracao serao implementados em sprint futura, junto com `AporteFinanceiroParceriaPrograma` (M014).

**Request body**

```json
{
  "justificativa": "Cumprimento do plano de trabalho e conclusao de entregas."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `justificativa` | string | **Sim** | Justificativa textual do encerramento |

**Response `200 OK`**

```json
{
  "id": "PAR-2026-03",
  "estado": "Encerrada"
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PARCERIA_NAO_ENCONTRADA` | Parceria nao encontrada. |
| `400` | `JUSTIFICATIVA_AUSENTE` | Justificativa de encerramento e obrigatoria (RI2). |

---

## 6. Vigencias da Parceria

### `POST /api/parcerias/{id}/vigencias/aditivo`

Registra **Vigencia aditivo** (`isAditivo = true`). A Vigencia original e criada automaticamente no cadastro da parceria.

- **Operacao de origem:** `RegistrarVigenciaAditivo`
- **Autorizacao:** `ANALISTA_AGENCIA`

> **Implementacao atual (SPRINT-007)**: campo `documento` omitido — M008 Documento fora do escopo deste sprint.

**Request body**

```json
{
  "dataInicio": "2026-03-01",
  "dataFim": "2029-12-31",
  "dataAssinatura": "2027-10-15",
  "justificativa": "Continuidade das atividades de pesquisa."
}
```

**Response `201 Created`**

```json
{
  "vigencia": {
    "id": "VIG-2027-002",
    "parceriaId": "PAR-2026-03",
    "isAditivo": true,
    "dataInicio": "2026-03-01",
    "dataFim": "2029-12-31"
  },
  "vigenciaFimCorrente": "2029-12-31"
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PARCERIA_NAO_ENCONTRADA` | Parceria nao encontrada. |
| `422` | `PARCERIA_NAO_VIGENTE` | Parceria nao esta no estado Vigente. |
| `422` | `ADITIVO_DATA_ASSINATURA_INVALIDA` | `dataAssinatura` do aditivo anterior a da Vigencia original (RN06). |
| `422` | `ADITIVO_DATA_FIM_INVALIDA` | `dataFim` nao posterior a `vigenciaFimCorrente` (RN06). |
| `409` | `VIGENCIA_ORIGINAL_DUPLICADA` | Ja existe Vigencia com `isAditivo = false` (RN15). |

### `GET /api/v1/parcerias/{id}/vigencias`

Lista todas as Vigencias da parceria (original + aditivos), ordenadas por `dataAssinatura`.

---

## 7. Aportes Financeiros Recebidos

### `POST /api/parcerias/{id}/aportes`

Registra aporte recebido de Instituicao, formalizado por Documento tipo "Termo de Descentralizacao".

- **Operacao de origem:** `RegistrarAporteFinanceiro`
- **Autorizacao:** `ANALISTA_AGENCIA`

> **Implementacao atual (SPRINT-007)**: campo `documentoTermoDescentralizacaoId` omitido — M008 Documento fora do escopo deste sprint.

**Request body**

```json
{
  "instituicaoId": "INST-2026-010",
  "valorInvestido": 500000.0,
  "dataAporte": "2026-03-10",
  "isAditivo": false
}
```

**Response `201 Created`**

```json
{
  "aporteFinanceiro": {
    "id": "APO-2026-001",
    "parceriaId": "PAR-2026-03",
    "instituicaoId": "INST-2026-010",
    "valorInvestido": 500000.0,
    "isAditivo": false
  },
  "saldoCorrente": 500000.0
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `INSTITUICAO_NAO_ENCONTRADA` | Instituicao nao encontrada em M008 (RN04). |
| `404` | `DOCUMENTO_NAO_ENCONTRADO` | Documento nao encontrado em M008. |
| `422` | `PARCERIA_SEM_ACORDO` | Parceria sem `dataAssinatura` (RN03). |
| `422` | `ADITIVO_SEM_ORIGINAL` | Aditivo exige aporte original previo (RN17). |
| `422` | `ADITIVO_DATA_APORTE_INVALIDA` | `dataAporte` anterior ao aporte original (RN17). |

> **Observacao (RN12)**: o Documento informado e sempre classificado automaticamente com `TipoDocumento = "Termo de Descentralizacao"`, independente do tipo previo. Nao ha erro de "tipo invalido".

### `GET /api/v1/parcerias/{id}/aportes`

Lista aportes recebidos. Filtros: `isAditivo`, `instituicaoId`, `page`, `pageSize`.

### `PUT /api/v1/parcerias/{id}/aportes/{aporteId}`

Edita aporte com `isAditivo = true` (RN18). Recalcula saldo.

- **Operacao de origem:** `EditarAporteFinanceiroAditivo`
- **Autorizacao:** `ANALISTA_AGENCIA`
- **Idempotencia:** Sim

**Request body** (campos opcionais, enviar apenas os que serao alterados)

```json
{
  "valorInvestido": 180000.0,
  "dataAporte": "2026-10-05",
  "documentoTermoDescentralizacaoId": "DOC-TD-2026-007B"
}
```

**Response `200 OK`**

```json
{
  "aporteFinanceiro": { "id": "APO-2026-007", "valorInvestido": 180000.0, "isAditivo": true },
  "saldoCorrente": 380000.0
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `APORTE_NAO_ENCONTRADO` | AporteFinanceiro nao encontrado. |
| `422` | `APORTE_ORIGINAL_IMUTAVEL` | Aporte com `isAditivo = false` nao pode ser editado por esta operacao (RN18). |
| `422` | `SALDO_RESULTANTE_INSUFICIENTE` | Edicao tornaria saldo insuficiente para cobrir aportes em Programas (RN14, RN18). |

### `DELETE /api/v1/parcerias/{id}/aportes/{aporteId}`

Remove aporte com `isAditivo = true` (RN18). Recalcula saldo.

- **Operacao de origem:** `RemoverAporteFinanceiroAditivo`
- **Autorizacao:** `ANALISTA_AGENCIA`

**Response `200 OK`**

```json
{ "removido": true, "saldoCorrente": 200000.0 }
```

**Erros**: mesmos de PUT acima (`APORTE_NAO_ENCONTRADO`, `APORTE_ORIGINAL_IMUTAVEL`, `SALDO_RESULTANTE_INSUFICIENTE`).

---

## 8. Aportes em Programas (N:N Parceria → Programa)

### `POST /api/v1/parcerias/{parceriaId}/aportes-programas`

Registra aporte da Parceria em Programa (RN11, RN13, RN14).

- **Operacao de origem:** `RegistrarAporteFinanceiroParceriaPrograma`
- **Autorizacao:** `ANALISTA_AGENCIA`

**Request body**

```json
{
  "programaId": "PROG-2026-01",
  "valor": 150000.0,
  "dataAporte": "2026-04-10"
}
```

**Response `201 Created`**

```json
{
  "aporteFinanceiroParceriaPrograma": {
    "id": "AFP-2026-001",
    "parceriaId": "PAR-2026-03",
    "programaId": "PROG-2026-01",
    "valor": 150000.0,
    "dataAporte": "2026-04-10"
  },
  "saldoCorrente": 350000.0
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `PARCERIA_NAO_ENCONTRADA` | Parceria nao encontrada. |
| `404` | `PROGRAMA_NAO_ENCONTRADO` | Programa nao encontrado. |
| `422` | `PARCERIA_NAO_VIGENTE` | Parceria nao esta Vigente (RN11). |
| `422` | `VALOR_NEGATIVO` | Valor negativo nao e permitido (RN11). |
| `422` | `SALDO_INSUFICIENTE` | Saldo insuficiente (RN14). |
| `422` | `PROGRAMA_FORA_DA_VIGENCIA` | Periodo do Programa extrapola vigencia da Parceria (RN13). |

### `GET /api/v1/parcerias/{parceriaId}/aportes-programas`

Lista aportes destinados a programas.

### `GET /api/v1/programas/{programaId}/aportes-parcerias`

Lista aportes recebidos pelo programa (visao dual).

---

## 9. Documentos da Parceria

### `POST /api/v1/parcerias/{id}/documentos`

Anexa Documento existente (M008) a parceria.

- **Operacao de origem:** `AnexarDocumentoAParceria`
- **Autorizacao:** `ANALISTA_AGENCIA`

**Request body**

```json
{ "documentoId": "DOC-ANEXO-2026-005" }
```

**Response `201 Created`**

```json
{ "parceriaId": "PAR-2026-03", "documentoId": "DOC-ANEXO-2026-005", "anexado": true }
```

**Erros**: `404 PARCERIA_NAO_ENCONTRADA`, `404 DOCUMENTO_NAO_ENCONTRADO`.

### `GET /api/v1/parcerias/{id}/documentos`

Lista documentos anexados. Filtros: `tipoDocumentoId`.

### `DELETE /api/v1/parcerias/{id}/documentos/{documentoId}`

Desvincula Documento da parceria (nao remove o Documento de M008).

---

## 10. Saldo da Parceria

### `GET /api/v1/parcerias/{id}/saldo`

Consulta saldo corrente e composicao (RN14, RN15).

- **Operacao de origem:** `ConsultarSaldoParceria`
- **Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`

**Response `200 OK`**

```json
{
  "parceriaId": "PAR-2026-03",
  "saldo": 350000.0,
  "totalRecebido": 500000.0,
  "totalAportadoEmProgramas": 150000.0,
  "vigenciaInicioCorrente": "2026-03-01",
  "vigenciaFimCorrente": "2028-12-31"
}
```

**Erros**: `404 PARCERIA_NAO_ENCONTRADA`.

---

## 11. Portfolio Estrategico

### `GET /api/v1/portfolio`

Consulta consolidado. Filtros: `planoId`, `estadoPrograma`, `estadoParceria`.

**Autorizacao:** `DIRETORIA`, `ANALISTA_AGENCIA`, `MODULO_INTERNO`.

**Response `200 OK`**

```json
{
  "planoAtivo": { "id": "PE-2026-01", "nome": "Plano Estrategico 2026-2029" },
  "totalProgramas": 4,
  "totalParcerias": 3,
  "totalAportadoInstituicoes": 1500000.0,
  "totalAportadoEmProgramas": 620000.0
}
```

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/planos-estrategicos` | RegistrarPlanoEstrategico | DIRETORIA |
| `GET` | `/api/v1/planos-estrategicos` | ListarPlanosEstrategicos | DIRETORIA, ANALISTA_AGENCIA |
| `GET` | `/api/v1/planos-estrategicos/{id}` | ConsultarPlanoEstrategico | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/planos-estrategicos/{id}` | AtualizarPlanoEstrategico | DIRETORIA |
| `POST` | `/api/v1/planos-estrategicos/{planoId}/eixos` | CadastrarEixoEstrategico | DIRETORIA |
| `GET` | `/api/v1/planos-estrategicos/{planoId}/eixos` | ListarEixosEstrategicos | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/programas` | CriarPrograma | ANALISTA_AGENCIA |
| `GET` | `/api/v1/programas` | ListarProgramas | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/programas/{id}` | ConsultarPrograma | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/v1/programas/{id}` | AtualizarPrograma | ANALISTA_AGENCIA |
| `DELETE` | `/api/v1/programas/{id}` | RemoverPrograma (RI1) | ANALISTA_AGENCIA |
| `POST` | `/api/v1/programas/{id}/comite` | CadastrarComiteGovernanca | ANALISTA_AGENCIA |
| `GET` | `/api/v1/programas/{programaId}/aportes-parcerias` | ListarAportesRecebidosPorPrograma | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/parcerias` | CriarParceria | ANALISTA_AGENCIA |
| `GET` | `/api/parcerias` | ListarParcerias | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/parcerias/{id}` | ConsultarParceria | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/parcerias/{id}` | AtualizarParceria | ANALISTA_AGENCIA |
| `DELETE` | `/api/parcerias/{id}` | RemoverParceria (RI3) | ANALISTA_AGENCIA |
| `PATCH` | `/api/parcerias/{id}/formalizar` | FormalizarParceria (RN19) | ANALISTA_AGENCIA |
| `POST` | `/api/v1/parcerias/{id}/suspender` | SuspenderParceria | ANALISTA_AGENCIA |
| `POST` | `/api/v1/parcerias/{id}/reativar` | ReativarParceria | ANALISTA_AGENCIA |
| `PATCH` | `/api/parcerias/{id}/encerrar` | EncerrarParceria (RI2) | ANALISTA_AGENCIA |
| `POST` | `/api/v1/programas/{id}/ativar` | AtivarPrograma | ANALISTA_AGENCIA |
| `POST` | `/api/v1/programas/{id}/suspender` | SuspenderPrograma | ANALISTA_AGENCIA |
| `POST` | `/api/v1/programas/{id}/reativar` | ReativarPrograma | ANALISTA_AGENCIA |
| `POST` | `/api/v1/programas/{id}/encerrar` | EncerrarPrograma (RI1) | ANALISTA_AGENCIA |
| `POST` | `/api/parcerias/{id}/vigencias/aditivo` | RegistrarVigenciaAditivo | ANALISTA_AGENCIA |
| `GET` | `/api/v1/parcerias/{id}/vigencias` | ListarVigencias | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/parcerias/{id}/aportes` | RegistrarAporteFinanceiro | ANALISTA_AGENCIA |
| `GET` | `/api/v1/parcerias/{id}/aportes` | ListarAportesFinanceiros | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `PUT` | `/api/parcerias/{id}/aportes/{aporteId}` | EditarAporteFinanceiroAditivo (RN18) | ANALISTA_AGENCIA |
| `DELETE` | `/api/parcerias/{id}/aportes/{aporteId}` | RemoverAporteFinanceiroAditivo (RN18) | ANALISTA_AGENCIA |
| `POST` | `/api/v1/parcerias/{parceriaId}/aportes-programas` | RegistrarAporteFinanceiroParceriaPrograma | ANALISTA_AGENCIA |
| `GET` | `/api/v1/parcerias/{parceriaId}/aportes-programas` | ListarAportesEmProgramas | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `POST` | `/api/v1/parcerias/{id}/documentos` | AnexarDocumentoAParceria | ANALISTA_AGENCIA |
| `GET` | `/api/v1/parcerias/{id}/documentos` | ListarDocumentosDaParceria | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `DELETE` | `/api/v1/parcerias/{id}/documentos/{documentoId}` | DesanexarDocumento | ANALISTA_AGENCIA |
| `GET` | `/api/parcerias/{id}/saldo` | ConsultarSaldoParceria | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |
| `GET` | `/api/v1/portfolio` | ConsultarPortfolioEstrategico | DIRETORIA, ANALISTA_AGENCIA, MODULO_INTERNO |

---

## Schemas de Dominio (Referencia)

### Parceria

```json
{
  "id": "string",
  "nome": "string",
  "numeroDProcesso": "string",
  "dataAssinatura": "YYYY-MM-DD",
  "objetivo": "string",
  "estado": "EmElaboracao | Vigente | Suspensa | Encerrada",
  "vigenciaInicioCorrente": "YYYY-MM-DD",
  "vigenciaFimCorrente": "YYYY-MM-DD",
  "saldo": "number",
  "instituicaoId": "string"
}
```

### Vigencia

```json
{
  "id": "string",
  "parceriaId": "string",
  "dataInicio": "YYYY-MM-DD",
  "dataFim": "YYYY-MM-DD",
  "dataAssinatura": "YYYY-MM-DD",
  "isAditivo": "boolean",
  "justificativa": "string (opcional para original)",
  "documento": "string (referencia a Documento em M008)"
}
```

### AporteFinanceiro

```json
{
  "id": "string",
  "parceriaId": "string",
  "instituicaoId": "string",
  "valorInvestido": "number",
  "dataAporte": "YYYY-MM-DD",
  "documentoTermoDescentralizacaoId": "string",
  "isAditivo": "boolean"
}
```

### AporteFinanceiroParceriaPrograma

```json
{
  "id": "string",
  "parceriaId": "string",
  "programaId": "string",
  "valor": "number",
  "dataAporte": "YYYY-MM-DD"
}
```

### Programa

```json
{
  "id": "string",
  "nome": "string",
  "resumo": "string",
  "estado": "EM_PLANEJAMENTO | ATIVO | SUSPENSO | ENCERRADO",
  "eixos": ["string"],
  "instituicaoDemandanteId": "string",
  "dataInicio": "YYYY-MM-DD",
  "dataFim": "YYYY-MM-DD"
}
```

---

## Rastreabilidade

| Artefato | Link |
|----------|------|
| Contrato de aplicacao (operacoes) | [contrato.md](contrato.md) |
| Dominio e regras de negocio | [README.md](README.md) |
| Modelo estrutural — Planejamento | [planejamento/modelo-estrutural.md](planejamento/modelo-estrutural.md) |
| Modelo estrutural — Programas | [programas/modelo-estrutural.md](programas/modelo-estrutural.md) |
| Modelo estrutural — Parcerias | [parcerias/modelo-estrutural.md](parcerias/modelo-estrutural.md) |
| Modelo comportamental — Programas | [programas/modelo-comportamental.md](programas/modelo-comportamental.md) |
| Modelo comportamental — Parcerias | [parcerias/modelo-comportamental.md](parcerias/modelo-comportamental.md) |
| EPIC-M010-001 (Plano Estrategico) | [planejamento/epics/EPIC-M010-001.md](planejamento/epics/EPIC-M010-001.md) |
| EPIC-M010-002 (Parcerias) | [parcerias/epics/EPIC-M010-002.md](parcerias/epics/EPIC-M010-002.md) |
| EPIC-M010-003 (Programas) | [programas/epics/EPIC-M010-003.md](programas/epics/EPIC-M010-003.md) |
