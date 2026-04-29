# Contrato de API HTTP — M016 Contabilidade e Financeiro

Referencia de dominio e regras de negocio: [contrato.md](contrato.md) | [README.md](README.md)

## Visao Geral

Este documento especifica o contrato HTTP REST do modulo M016 como bounded context responsavel por plano de contas, contas bancarias, movimentacoes financeiras, conciliacao, fluxo de caixa e gestao financeira institucional da Acao Transversal. O `contrato.md` define **o que** o modulo expoe; este documento define **como** acessar via HTTP.

### Base URL

```
/api/v1/m016
```

### Convencoes Gerais

| Aspecto | Convencao |
|---------|-----------|
| Formato de corpo | `application/json` |
| Formato de data | ISO 8601 — `YYYY-MM-DD` |
| Paginacao | Query params `?page=1&pageSize=20` (padrao: page=1, pageSize=20) |
| Identificadores | Strings opacas (ex: `CTB-2026-010`, `CB-2026-002`, `MOV-2026-088`) |
| Encoding | UTF-8 |
| Idioma de erros | Portugues brasileiro |

### Autorizacao

Todas as rotas exigem autenticacao. O perfil do chamador determina o acesso:

| Perfil | Descricao |
|--------|-----------|
| `GESTOR_FINANCEIRO` | Gestor financeiro da agencia — acesso completo de leitura e escrita |
| `MODULO_INTERNO` | Modulo interno autorizado (M010, M017, M018, M019) — acesso conforme contrato |

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
| `400 Bad Request` | Dados invalidos | Campos obrigatorios ausentes, formato invalido, tipo de conta invalido |
| `404 Not Found` | Recurso inexistente | Identificador nao encontrado |
| `409 Conflict` | Conflito de estado ou duplicata | Conta contabil ou bancaria duplicada, conciliacao em andamento |
| `422 Unprocessable Entity` | Violacao de regra de negocio | Saldo negativo nao autorizado, associacao obrigatoria ausente, conta com lancamentos |

---

## Acao Transversal

Referencia normativa inicial: [Resolucao CCAF nº 334/2023 - FAPES](https://fapes.es.gov.br/Media/fapes/Resolu%C3%A7%C3%B5es/Resolu%C3%A7%C3%A3o_CCAF_n%C2%BA_334.2023_-_utiliza%C3%A7%C3%A3o_recursos_financeiros_de_projetos_e-ou_programas_em_parcerias_destinados_a_A%C3%A7%C3%A3o_Transversal_para_a_FAPES..pdf).

### `POST /api/v1/m016/acao-transversal/politicas`

Cadastra politica e faixas percentuais de Acao Transversal.

- **Autorizacao:** `GESTOR_FINANCEIRO`
- **Operacao de origem:** `ParametrizarPoliticaAcaoTransversal`

**Request body**

```json
{
  "nome": "Resolucao CCAF 334/2023",
  "baseLegal": "Resolucao CCAF nº 334/2023",
  "dataInicioVigencia": "2023-01-01",
  "faixas": [
    { "valorMinimo": 50000.0, "valorMaximo": 2000000.0, "percentual": 5.0 },
    { "valorMinimo": 2000000.01, "valorMaximo": 5000000.0, "percentual": 4.0 },
    { "valorMinimo": 5000000.01, "valorMaximo": null, "percentual": 3.0 }
  ]
}
```

### `POST /api/v1/m016/acao-transversal/reservas`

Recebe do M010 a reserva calculada na Parceria.

- **Autorizacao:** `MODULO_INTERNO` (`M010`)
- **Operacao de origem:** `ReceberReservaAcaoTransversal`

**Request body**

```json
{
  "parceriaId": "PAR-2026-03",
  "aporteFinanceiroOrigemId": "APO-2026-001",
  "tipoOrigem": "APORTE_ORIGINAL",
  "politicaId": "PAT-2023-334",
  "valorBaseCalculo": 500000.0,
  "percentualAplicado": 5.0,
  "valorReservado": 25000.0,
  "contaContabilId": "CTB-ACAO-TRANSVERSAL",
  "fundoFinanceiroId": "FF-ACAO-TRANSVERSAL",
  "centroCustoId": "CC-GESTAO-PARCERIAS",
  "documentoReferenciaId": "DOC-TD-2026-001"
}
```

Para aditivos financeiros, `tipoOrigem` deve ser `APORTE_ADITIVO` e `valorBaseCalculo` deve conter o valor do proprio aditivo, sem recalculo retroativo das reservas anteriores.

### `POST /api/v1/m016/acao-transversal/reservas/{reservaId}/plano-aplicacao`

Cadastra plano de aplicacao por rubrica.

**Request body**

```json
{
  "itens": [
    { "rubricaId": "RUB-DIARIAS", "valorPrevisto": 10000.0, "justificativa": "Acompanhamento tecnico" },
    { "rubricaId": "RUB-PASSAGENS", "valorPrevisto": 12000.0, "justificativa": "Deslocamentos institucionais" }
  ]
}
```

### `POST /api/v1/m016/acao-transversal/reservas/{reservaId}/despesas`

Registra despesa institucional da Acao Transversal.

**Request body**

```json
{
  "itemPlanoAplicacaoId": "IPA-2026-001",
  "rubricaId": "RUB-DIARIAS",
  "valor": 3000.0,
  "dataDespesa": "2026-05-10",
  "documentoId": "DOC-COMP-2026-010",
  "justificativa": "Visita tecnica vinculada ao acompanhamento da parceria."
}
```

### `GET /api/v1/m016/acao-transversal/dashboard`

Consulta consolidado por parceria, rubrica e periodo.

**Query parameters:** `parceriaId`, `rubricaId`, `dataInicio`, `dataFim`, `estadoPrestacao`.

---

## Recursos

### 1. Contas Contabeis

#### `POST /api/v1/m016/contas-contabeis`

Registra uma conta contabil conforme o plano de contas governamental.

- **Autorizacao:** `GESTOR_FINANCEIRO`
- **Operacao de origem:** `CriarContaContabil`
- **Idempotencia:** Nao

**Request body**

```json
{
  "codigo": "1.1.1.01",
  "nome": "Caixa e equivalentes",
  "tipoConta": "ATIVO",
  "natureza": "DEVEDORA"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `codigo` | string | Sim | Codigo unico da conta conforme plano de contas governamental (ex: `1.1.1.01`) |
| `nome` | string | Sim | Nome descritivo da conta contabil |
| `tipoConta` | string (enum) | Sim | Um de: `ATIVO`, `PASSIVO`, `PATRIMONIO_LIQUIDO`, `RECEITA`, `DESPESA` |
| `natureza` | string (enum) | Sim | Um de: `DEVEDORA`, `CREDORA` |

**Response `201 Created`**

```json
{
  "contaContabil": {
    "id": "CTB-2026-010",
    "codigo": "1.1.1.01",
    "nome": "Caixa e equivalentes",
    "tipoConta": "ATIVO",
    "natureza": "DEVEDORA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `CONTA_CONTABIL_DUPLICADA` | Ja existe conta contabil cadastrada com o codigo informado. |
| `400` | `CONTA_CONTABIL_INVALIDA` | Os dados informados para a conta contabil sao invalidos. |

---

#### `GET /api/v1/m016/contas-contabeis`

Lista as contas contabeis cadastradas.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipoConta` | string | Filtra por tipo: `ATIVO`, `PASSIVO`, `PATRIMONIO_LIQUIDO`, `RECEITA`, `DESPESA` |
| `natureza` | string | Filtra por natureza: `DEVEDORA`, `CREDORA` |
| `codigo` | string | Filtra por codigo parcial ou exato |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "CTB-2026-010",
      "codigo": "1.1.1.01",
      "nome": "Caixa e equivalentes",
      "tipoConta": "ATIVO",
      "natureza": "DEVEDORA"
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
| `400` | `FILTRO_CONTA_CONTABIL_INVALIDO` | Os filtros informados para consulta de conta contabil sao invalidos. |

---

#### `GET /api/v1/m016/contas-contabeis/{contaId}`

Consulta o detalhe de uma conta contabil.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaId` | string | Identificador da conta contabil (ex: `CTB-2026-010`) |

**Response `200 OK`**

```json
{
  "contaContabil": {
    "id": "CTB-2026-010",
    "codigo": "1.1.1.01",
    "nome": "Caixa e equivalentes",
    "tipoConta": "ATIVO",
    "natureza": "DEVEDORA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_CONTABIL_NAO_ENCONTRADA` | A conta contabil informada nao foi encontrada. |

---

#### `PUT /api/v1/m016/contas-contabeis/{contaId}`

Atualiza os dados de uma conta contabil.

- **Autorizacao:** `GESTOR_FINANCEIRO`
- **Idempotencia:** Sim

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaId` | string | Identificador da conta contabil |

**Request body**

```json
{
  "nome": "Caixa, equivalentes e aplicacoes de curto prazo"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `nome` | string | Sim | Novo nome descritivo da conta contabil |

**Response `200 OK`**

```json
{
  "contaContabil": {
    "id": "CTB-2026-010",
    "codigo": "1.1.1.01",
    "nome": "Caixa, equivalentes e aplicacoes de curto prazo",
    "tipoConta": "ATIVO",
    "natureza": "DEVEDORA"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_CONTABIL_NAO_ENCONTRADA` | A conta contabil informada nao foi encontrada. |
| `400` | `CONTA_CONTABIL_INVALIDA` | Os dados informados para a conta contabil sao invalidos. |

---

#### `DELETE /api/v1/m016/contas-contabeis/{contaId}`

Remove uma conta contabil sem lancamentos associados.

- **Autorizacao:** `GESTOR_FINANCEIRO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaId` | string | Identificador da conta contabil |

**Response `204 No Content`**

Sem corpo na resposta.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_CONTABIL_NAO_ENCONTRADA` | A conta contabil informada nao foi encontrada. |
| `422` | `CONTA_COM_LANCAMENTOS_ASSOCIADOS` | Uma conta contabil nao pode ser excluida se possuir lancamentos associados. |

---

### 2. Associacoes de Conta Contabil

#### `POST /api/v1/m016/contas-contabeis/{contaId}/associacoes`

Associa uma conta contabil a uma iniciativa, programa ou parceria.

- **Autorizacao:** `GESTOR_FINANCEIRO`
- **Operacao de origem:** `AssociarContaAoEscopoFinanceiro`
- **Idempotencia:** Nao

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaId` | string | Identificador da conta contabil |

**Request body**

```json
{
  "tipoAssociacao": "PROGRAMA",
  "referenciaId": "PROG-2026-01"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `tipoAssociacao` | string (enum) | Sim | Um de: `INICIATIVA`, `PROGRAMA`, `PARCERIA` |
| `referenciaId` | string | Sim | Identificador da iniciativa, programa ou parceria |

**Response `201 Created`**

```json
{
  "associacaoConta": {
    "contaContabilId": "CTB-2026-010",
    "tipoAssociacao": "PROGRAMA",
    "referenciaId": "PROG-2026-01"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_CONTABIL_NAO_ENCONTRADA` | A conta contabil informada nao foi encontrada. |
| `422` | `REFERENCIA_FINANCEIRA_INVALIDA` | A iniciativa, programa ou parceria informada nao pode receber associacao financeira. |
| `422` | `CONTA_SEM_ASSOCIACAO_PERMITIDA` | A conta contabil precisa estar associada a ao menos um escopo valido. |
| `409` | `ASSOCIACAO_CONTA_DUPLICADA` | Ja existe associacao entre a conta e o escopo financeiro informado. |

---

#### `GET /api/v1/m016/contas-contabeis/{contaId}/associacoes`

Lista as associacoes de uma conta contabil.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaId` | string | Identificador da conta contabil |

**Response `200 OK`**

```json
{
  "contaContabilId": "CTB-2026-010",
  "associacoes": [
    {
      "tipoAssociacao": "PROGRAMA",
      "referenciaId": "PROG-2026-01"
    }
  ]
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_CONTABIL_NAO_ENCONTRADA` | A conta contabil informada nao foi encontrada. |

---

### 3. Contas Bancarias

#### `POST /api/v1/m016/contas-bancarias`

Registra uma conta bancaria e sua relacao com o escopo financeiro.

- **Autorizacao:** `GESTOR_FINANCEIRO`
- **Operacao de origem:** `CadastrarContaBancaria`
- **Idempotencia:** Nao

**Request body**

```json
{
  "banco": "104",
  "agencia": "1234",
  "numeroConta": "000123-4",
  "tipoAssociacao": "INICIATIVA",
  "referenciaId": "PROJ-2026-014"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `banco` | string | Sim | Codigo do banco (ex: `104` para Caixa Economica Federal) |
| `agencia` | string | Sim | Numero da agencia bancaria |
| `numeroConta` | string | Sim | Numero da conta bancaria com digito verificador |
| `tipoAssociacao` | string (enum) | Sim | Um de: `INICIATIVA`, `PROGRAMA`, `PARCERIA` |
| `referenciaId` | string | Sim | Identificador da iniciativa, programa ou parceria |

**Response `201 Created`**

```json
{
  "contaBancaria": {
    "id": "CB-2026-002",
    "banco": "104",
    "agencia": "1234",
    "numeroConta": "000123-4",
    "tipoAssociacao": "INICIATIVA",
    "referenciaId": "PROJ-2026-014"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `409` | `CONTA_BANCARIA_DUPLICADA` | Ja existe conta bancaria cadastrada com os mesmos dados informados. |
| `422` | `REFERENCIA_CONTA_BANCARIA_INVALIDA` | A referencia informada nao pode ser associada a conta bancaria. |
| `400` | `CONTA_BANCARIA_DADOS_INVALIDOS` | Os dados informados para a conta bancaria sao invalidos. |

---

#### `GET /api/v1/m016/contas-bancarias`

Lista as contas bancarias cadastradas.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `tipoAssociacao` | string | Filtra por tipo de associacao: `INICIATIVA`, `PROGRAMA`, `PARCERIA` |
| `referenciaId` | string | Filtra por identificador do escopo associado |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "CB-2026-002",
      "banco": "104",
      "agencia": "1234",
      "numeroConta": "000123-4",
      "tipoAssociacao": "INICIATIVA",
      "referenciaId": "PROJ-2026-014"
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
| `400` | `FILTRO_CONTA_BANCARIA_INVALIDO` | Os filtros informados para consulta de conta bancaria sao invalidos. |

---

#### `GET /api/v1/m016/contas-bancarias/{contaBancariaId}`

Consulta o detalhe de uma conta bancaria.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaBancariaId` | string | Identificador da conta bancaria (ex: `CB-2026-002`) |

**Response `200 OK`**

```json
{
  "contaBancaria": {
    "id": "CB-2026-002",
    "banco": "104",
    "agencia": "1234",
    "numeroConta": "000123-4",
    "tipoAssociacao": "INICIATIVA",
    "referenciaId": "PROJ-2026-014"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_BANCARIA_NAO_ENCONTRADA` | A conta bancaria informada nao foi encontrada. |

---

#### `DELETE /api/v1/m016/contas-bancarias/{contaBancariaId}`

Remove uma conta bancaria sem movimentacoes registradas.

- **Autorizacao:** `GESTOR_FINANCEIRO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaBancariaId` | string | Identificador da conta bancaria |

**Response `204 No Content`**

Sem corpo na resposta.

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_BANCARIA_NAO_ENCONTRADA` | A conta bancaria informada nao foi encontrada. |
| `422` | `CONTA_COM_MOVIMENTACOES_REGISTRADAS` | Uma conta bancaria nao pode ser excluida se possuir movimentacoes registradas. |

---

### 4. Movimentacoes Financeiras

#### `POST /api/v1/m016/movimentacoes-financeiras`

Registra um lancamento financeiro em conta contabil e bancaria.

- **Autorizacao:** `GESTOR_FINANCEIRO`
- **Operacao de origem:** `RegistrarMovimentacaoFinanceira`
- **Idempotencia:** Nao

**Request body**

```json
{
  "contaContabilId": "CTB-2026-010",
  "contaBancariaId": "CB-2026-002",
  "tipoMovimentacao": "DEBITO",
  "valor": 3500.0,
  "data": "2026-04-13",
  "descricao": "Pagamento de servico de consultoria."
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `contaContabilId` | string | Sim | Identificador da conta contabil |
| `contaBancariaId` | string | Sim | Identificador da conta bancaria |
| `tipoMovimentacao` | string (enum) | Sim | Um de: `DEBITO`, `CREDITO` |
| `valor` | number | Sim | Valor da movimentacao (positivo) |
| `data` | string (date) | Sim | Data da movimentacao no formato `YYYY-MM-DD` |
| `descricao` | string | Nao | Descricao opcional do lancamento |

**Response `201 Created`**

```json
{
  "movimentacaoFinanceira": {
    "id": "MOV-2026-088",
    "contaContabilId": "CTB-2026-010",
    "contaBancariaId": "CB-2026-002",
    "tipoMovimentacao": "DEBITO",
    "valor": 3500.0,
    "data": "2026-04-13"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_CONTABIL_NAO_ENCONTRADA` | A conta contabil informada nao foi encontrada. |
| `404` | `CONTA_BANCARIA_NAO_ENCONTRADA` | A conta bancaria informada nao foi encontrada. |
| `422` | `SALDO_NEGATIVO_NAO_AUTORIZADO` | A movimentacao resultaria em saldo negativo sem autorizacao expressa. |
| `422` | `ASSOCIACAO_FINANCEIRA_AUSENTE` | Nao existe associacao valida entre conta contabil e escopo para o lancamento. |
| `400` | `MOVIMENTACAO_DADOS_INVALIDOS` | Os dados da movimentacao financeira nao foram informados corretamente. |

---

#### `GET /api/v1/m016/movimentacoes-financeiras`

Lista as movimentacoes financeiras com filtros e paginacao.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaContabilId` | string | Filtra por conta contabil |
| `contaBancariaId` | string | Filtra por conta bancaria |
| `tipoMovimentacao` | string | Filtra por tipo: `DEBITO`, `CREDITO` |
| `dataInicio` | string (date) | Filtra movimentacoes a partir desta data |
| `dataFim` | string (date) | Filtra movimentacoes ate esta data |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "MOV-2026-088",
      "contaContabilId": "CTB-2026-010",
      "contaBancariaId": "CB-2026-002",
      "tipoMovimentacao": "DEBITO",
      "valor": 3500.0,
      "data": "2026-04-13",
      "descricao": "Pagamento de servico de consultoria."
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
| `400` | `FILTRO_MOVIMENTACAO_INVALIDO` | Os filtros informados para consulta de movimentacoes sao invalidos. |

---

### 5. Conciliacao Bancaria

#### `POST /api/v1/m016/conciliacoes-bancarias`

Inicia a execucao da conciliacao bancaria para uma conta e periodo. Operacao assincrona.

- **Autorizacao:** `GESTOR_FINANCEIRO`
- **Operacao de origem:** `ExecutarConciliacaoBancaria`
- **Idempotencia:** Sim (por conta bancaria e periodo)

**Request body**

```json
{
  "contaBancariaId": "CB-2026-002",
  "periodoInicio": "2026-04-01",
  "periodoFim": "2026-04-30"
}
```

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `contaBancariaId` | string | Sim | Identificador da conta bancaria a conciliar |
| `periodoInicio` | string (date) | Sim | Data de inicio do periodo da conciliacao |
| `periodoFim` | string (date) | Sim | Data de fim do periodo da conciliacao |

**Response `201 Created`**

```json
{
  "conciliacaoBancaria": {
    "id": "CONC-2026-004",
    "contaBancariaId": "CB-2026-002",
    "periodoInicio": "2026-04-01",
    "periodoFim": "2026-04-30",
    "estado": "EM_ANDAMENTO"
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_BANCARIA_NAO_ENCONTRADA` | A conta bancaria informada nao foi encontrada. |
| `409` | `CONCILIACAO_EM_ANDAMENTO` | Ja existe conciliacao em andamento para a conta bancaria informada. |
| `422` | `EXTRATO_BANCARIO_INDISPONIVEL` | Nao foi possivel obter ou processar o extrato bancario para conciliacao. |
| `400` | `PERIODO_CONCILIACAO_INVALIDO` | O periodo informado para conciliacao e invalido. |

---

#### `GET /api/v1/m016/conciliacoes-bancarias`

Lista as conciliacoes bancarias realizadas.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaBancariaId` | string | Filtra por conta bancaria |
| `estado` | string | Filtra por estado: `EM_ANDAMENTO`, `CONCLUIDA`, `COM_DIVERGENCIAS` |
| `page` | integer | Numero da pagina (padrao: 1) |
| `pageSize` | integer | Itens por pagina (padrao: 20, max: 100) |

**Response `200 OK`**

```json
{
  "items": [
    {
      "id": "CONC-2026-004",
      "contaBancariaId": "CB-2026-002",
      "periodoInicio": "2026-04-01",
      "periodoFim": "2026-04-30",
      "estado": "COM_DIVERGENCIAS",
      "divergenciasIdentificadas": 2
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
| `400` | `FILTRO_CONCILIACAO_INVALIDO` | Os filtros informados para consulta de conciliacao sao invalidos. |

---

#### `GET /api/v1/m016/conciliacoes-bancarias/{conciliacaoId}`

Consulta o resultado de uma conciliacao bancaria.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `conciliacaoId` | string | Identificador da conciliacao (ex: `CONC-2026-004`) |

**Response `200 OK`**

```json
{
  "conciliacaoBancaria": {
    "id": "CONC-2026-004",
    "contaBancariaId": "CB-2026-002",
    "periodoInicio": "2026-04-01",
    "periodoFim": "2026-04-30",
    "estado": "COM_DIVERGENCIAS",
    "divergencias": [
      {
        "tipo": "LANCAMENTO_SEM_CORRESPONDENCIA",
        "descricao": "Lancamento de R$ 500 em 2026-04-10 sem correspondencia no sistema."
      }
    ]
  }
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONCILIACAO_NAO_ENCONTRADA` | A conciliacao bancaria informada nao foi encontrada. |

---

### 6. Fluxo de Caixa e Saldos

#### `GET /api/v1/m016/fluxo-caixa`

Consulta o fluxo de caixa e saldos por conta, programa ou iniciativa.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`
- **Operacao de origem:** `ConsultarFluxoCaixaESaldos`

**Query parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaBancariaId` | string | Filtra por conta bancaria |
| `referenciaId` | string | Filtra por iniciativa, programa ou parceria |
| `tipoAssociacao` | string | Tipo da referencia: `INICIATIVA`, `PROGRAMA`, `PARCERIA` |
| `periodoInicio` | string (date) | Data de inicio do periodo |
| `periodoFim` | string (date) | Data de fim do periodo |

**Response `200 OK`**

```json
{
  "fluxoCaixa": {
    "referenciaId": "PROG-2026-01",
    "periodoInicio": "2026-04-01",
    "periodoFim": "2026-04-30",
    "entradas": 120000.0,
    "saidas": 3500.0
  },
  "saldoConta": 116500.0
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `422` | `CONSULTA_FINANCEIRA_SEM_DADOS` | Nao ha dados financeiros para o filtro informado. |
| `400` | `FILTRO_FINANCEIRO_INVALIDO` | Os filtros informados para fluxo de caixa e saldos sao invalidos. |

---

#### `GET /api/v1/m016/contas-bancarias/{contaBancariaId}/saldo`

Consulta o saldo atual de uma conta bancaria.

- **Autorizacao:** `GESTOR_FINANCEIRO`, `MODULO_INTERNO`

**Path parameters**

| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `contaBancariaId` | string | Identificador da conta bancaria |

**Response `200 OK`**

```json
{
  "contaBancariaId": "CB-2026-002",
  "saldoAtual": 116500.0,
  "atualizadoEm": "2026-04-14"
}
```

**Erros**

| HTTP | Codigo | Mensagem |
|------|--------|----------|
| `404` | `CONTA_BANCARIA_NAO_ENCONTRADA` | A conta bancaria informada nao foi encontrada. |

---

## Mapa Geral de Endpoints

| Metodo | Path | Operacao | Autorizacao |
|--------|------|----------|-------------|
| `POST` | `/api/v1/m016/contas-contabeis` | CriarContaContabil | GESTOR_FINANCEIRO |
| `GET` | `/api/v1/m016/contas-contabeis` | ListarContasContabeis | GESTOR_FINANCEIRO, MODULO_INTERNO |
| `GET` | `/api/v1/m016/contas-contabeis/{contaId}` | ConsultarContaContabil | GESTOR_FINANCEIRO, MODULO_INTERNO |
| `PUT` | `/api/v1/m016/contas-contabeis/{contaId}` | AtualizarContaContabil | GESTOR_FINANCEIRO |
| `DELETE` | `/api/v1/m016/contas-contabeis/{contaId}` | RemoverContaContabil | GESTOR_FINANCEIRO |
| `POST` | `/api/v1/m016/contas-contabeis/{contaId}/associacoes` | AssociarContaAoEscopoFinanceiro | GESTOR_FINANCEIRO |
| `GET` | `/api/v1/m016/contas-contabeis/{contaId}/associacoes` | ListarAssociacoesConta | GESTOR_FINANCEIRO, MODULO_INTERNO |
| `POST` | `/api/v1/m016/contas-bancarias` | CadastrarContaBancaria | GESTOR_FINANCEIRO |
| `GET` | `/api/v1/m016/contas-bancarias` | ListarContasBancarias | GESTOR_FINANCEIRO, MODULO_INTERNO |
| `GET` | `/api/v1/m016/contas-bancarias/{contaBancariaId}` | ConsultarContaBancaria | GESTOR_FINANCEIRO, MODULO_INTERNO |
| `DELETE` | `/api/v1/m016/contas-bancarias/{contaBancariaId}` | RemoverContaBancaria | GESTOR_FINANCEIRO |
| `GET` | `/api/v1/m016/contas-bancarias/{contaBancariaId}/saldo` | ConsultarSaldoConta | GESTOR_FINANCEIRO, MODULO_INTERNO |
| `POST` | `/api/v1/m016/movimentacoes-financeiras` | RegistrarMovimentacaoFinanceira | GESTOR_FINANCEIRO |
| `GET` | `/api/v1/m016/movimentacoes-financeiras` | ListarMovimentacoesFinanceiras | GESTOR_FINANCEIRO, MODULO_INTERNO |
| `POST` | `/api/v1/m016/conciliacoes-bancarias` | ExecutarConciliacaoBancaria | GESTOR_FINANCEIRO |
| `GET` | `/api/v1/m016/conciliacoes-bancarias` | ListarConciliacoesBancarias | GESTOR_FINANCEIRO, MODULO_INTERNO |
| `GET` | `/api/v1/m016/conciliacoes-bancarias/{conciliacaoId}` | ConsultarConciliacaoBancaria | GESTOR_FINANCEIRO, MODULO_INTERNO |
| `GET` | `/api/v1/m016/fluxo-caixa` | ConsultarFluxoCaixaESaldos | GESTOR_FINANCEIRO, MODULO_INTERNO |

---

## Schemas de Dominio (Referencia)

### ContaContabil

```json
{
  "id": "string",
  "codigo": "string",
  "nome": "string",
  "tipoConta": "ATIVO | PASSIVO | PATRIMONIO_LIQUIDO | RECEITA | DESPESA",
  "natureza": "DEVEDORA | CREDORA"
}
```

### AssociacaoConta

```json
{
  "contaContabilId": "string",
  "tipoAssociacao": "INICIATIVA | PROGRAMA | PARCERIA",
  "referenciaId": "string"
}
```

### ContaBancaria

```json
{
  "id": "string",
  "banco": "string",
  "agencia": "string",
  "numeroConta": "string",
  "tipoAssociacao": "INICIATIVA | PROGRAMA | PARCERIA",
  "referenciaId": "string"
}
```

### MovimentacaoFinanceira

```json
{
  "id": "string",
  "contaContabilId": "string",
  "contaBancariaId": "string",
  "tipoMovimentacao": "DEBITO | CREDITO",
  "valor": "number",
  "data": "string (YYYY-MM-DD)",
  "descricao": "string (opcional)"
}
```

### ConciliacaoBancaria

```json
{
  "id": "string",
  "contaBancariaId": "string",
  "periodoInicio": "string (YYYY-MM-DD)",
  "periodoFim": "string (YYYY-MM-DD)",
  "estado": "EM_ANDAMENTO | CONCLUIDA | COM_DIVERGENCIAS",
  "divergenciasIdentificadas": "integer"
}
```

### FluxoCaixa

```json
{
  "referenciaId": "string",
  "periodoInicio": "string (YYYY-MM-DD)",
  "periodoFim": "string (YYYY-MM-DD)",
  "entradas": "number",
  "saidas": "number"
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
| EPIC-M016-001 (Plano de Contas) | [epics/EPIC-M016-001.md](epics/EPIC-M016-001.md) |
| EPIC-M016-002 (Gestao de Contas Bancarias) | [epics/EPIC-M016-002.md](epics/EPIC-M016-002.md) |
| EPIC-M016-003 (Fluxo de Caixa e Conciliacao) | [epics/EPIC-M016-003.md](epics/EPIC-M016-003.md) |
