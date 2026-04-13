# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M013 como contexto responsavel por rubricas de projeto, solicitacoes orcamentarias, pareceres, saldos e historico de movimentacao.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Coordenador | Solicita adicoes, remanejamentos e realocacoes |
| Analista da Agencia de Fomento | Analisa e decide solicitacoes orcamentarias |
| M014 e M019 | Consomem rubricas, saldos e historico para prestacao de contas e auditoria |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Projeto` |
| M008 | Modulo interno | Fornece `RubricaFinanceira` |
| M001 | Modulo interno | Fornece `VersaoNivel` para realocacao de bolsas |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| RegistrarRubricaDoProjeto | Command | Vincular rubrica do cadastro corporativo ao projeto com saldo inicial | projeto, rubricaFinanceira, valorAprovado | `RubricaProjeto` criada | RN03, RN06 | Projeto ativo | Rubrica inexistente, projeto invalido | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| SolicitarMovimentacaoOrcamentaria | Command | Registrar adicao, inclusao, remanejamento ou realocacao de bolsas | projeto, tipoSolicitacao, justificativa, valores | `SolicitacaoOrcamentaria` criada | RN01, RN02, RN04, RN07, RN08, RI1, RI2 | Projeto ativo | Justificativa ausente, saldo insuficiente, tipo invalido | Nao | Coordenador | API interna/backoffice a definir |
| RegistrarParecerSolicitacaoOrcamentaria | Command | Aprovar ou reprovar a solicitacao orcamentaria | solicitacao, aprovado, justificativa | `ParecerSolicitacao` registrado | RN01, RN02, RN05, RN06, RN07 | Solicitacao existente | Solicitacao inexistente, parecer inconsistente | Nao | Analista da Agencia de Fomento ou Diretor quando aplicavel | API interna/backoffice a definir |
| ConsultarSaldoPorRubrica | Query | Consultar o saldo atualizado das rubricas do projeto | projeto, rubrica | `SaldoRubrica` consolidado | RN06, RN08 | Projeto existente | Projeto nao encontrado | N/A | Usuario interno autorizado | API interna a definir |
| ConsultarHistoricoOrcamentario | Query | Consultar historico completo das movimentacoes orcamentarias do projeto | projeto, tipoMovimentacao, periodo | Lista de `HistoricoOrcamentario` | RN05, RN06 | Projeto existente | Nenhum historico encontrado | N/A | Usuario interno autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa endpoint, algoritmo de saldo nem mecanismo de auditoria concreto.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "solicitacao": "SO-2026-001"
    }
  }
}
```

## Exemplos JSON por Operacao

### RegistrarRubricaDoProjeto

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "rubricaFinanceiraId": "RUB-339030",
  "valorAprovado": 150000.0
}
```

**Exemplo de saida**

```json
{
  "rubricaProjeto": {
    "id": "RP-2026-004",
    "saldoAtual": 150000.0
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| RUBRICA_FINANCEIRA_NAO_ENCONTRADA | A rubrica financeira informada nao existe no cadastro basico. |
| PROJETO_NAO_ELEGIVEL_RUBRICA | O projeto informado nao esta apto a receber nova rubrica. |

### SolicitarMovimentacaoOrcamentaria

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "tipoSolicitacao": "REMANEJAMENTO",
  "justificativa": "Adequacao de despesas de campo.",
  "valor": 12000.0
}
```

**Exemplo de saida**

```json
{
  "solicitacaoOrcamentaria": {
    "id": "SO-2026-001",
    "estado": "SUBMETIDA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| JUSTIFICATIVA_ORCAMENTARIA_OBRIGATORIA | Toda solicitacao orcamentaria exige justificativa do coordenador. |
| SALDO_RUBRICA_INSUFICIENTE | O remanejamento solicitado deixaria saldo negativo na rubrica de origem. |

### RegistrarParecerSolicitacaoOrcamentaria

**Exemplo de entrada**

```json
{
  "solicitacaoId": "SO-2026-001",
  "aprovado": true,
  "justificativa": "Solicitacao aderente ao limite do edital."
}
```

**Exemplo de saida**

```json
{
  "parecerSolicitacao": {
    "aprovado": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| SOLICITACAO_ORCAMENTARIA_NAO_ENCONTRADA | A solicitacao orcamentaria nao foi encontrada para parecer. |
| LIMITE_EDITAL_EXCEDIDO | O valor total do projeto excede o limite permitido pelo edital. |

### ConsultarSaldoPorRubrica

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014"
}
```

**Exemplo de saida**

```json
{
  "saldos": [
    {
      "rubricaProjetoId": "RP-2026-004",
      "saldoAtual": 138000.0
    }
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PROJETO_NAO_ENCONTRADO | O projeto informado nao foi encontrado para consulta de saldo. |
| SALDO_RUBRICA_INDISPONIVEL | Nao foi possivel consolidar o saldo das rubricas neste momento. |

### ConsultarHistoricoOrcamentario

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "tipoMovimentacao": "REMANEJAMENTO"
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "data": "2026-04-13",
      "tipoMovimentacao": "REMANEJAMENTO",
      "descricao": "Remanejamento aprovado entre rubricas."
    }
  ],
  "total": 1
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| HISTORICO_ORCAMENTARIO_NAO_ENCONTRADO | Nenhum historico orcamentario foi encontrado para os filtros informados. |
| FILTRO_HISTORICO_ORCAMENTARIO_INVALIDO | Os filtros informados para historico orcamentario sao invalidos. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Nenhum endpoint ou mecanismo de calculo incremental foi estabilizado nesta rodada.

## Eventos e Efeitos Colaterais

- `RegistrarParecerSolicitacaoOrcamentaria` atualiza os saldos das rubricas em caso de aprovacao.
- `ConsultarHistoricoOrcamentario` expoe a trilha de auditoria funcional do modulo.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
