# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M015 como contexto coordenador dos fluxos de suspensao, reativacao e finalizacao de iniciativas, com verificacao de pendencias em modulos vizinhos.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Ortogado | Solicita suspensao e finalizacao da iniciativa |
| Area Tecnica da Agencia de Fomento | Analisa suspensoes e acompanha encerramentos |
| M004, M009 e M014 | Sofrem efeitos colaterais de bloqueio, pendencia ou validacao para encerramento |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Iniciativa` |
| M009 | Modulo interno | Fornece estado de `BolsaPesquisa` |
| M014 | Modulo interno | Fornece estado de `PrestacaoContas` |
| M004 | Modulo interno | Deve bloquear pagamentos quando a suspensao for efetivada |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| SolicitarSuspensaoIniciativa | Command | Registrar solicitacao de suspensao de iniciativa | iniciativa, origem, justificativa | `SolicitacaoSuspensao` criada | RN01, RN08, RI1, RI2 | Iniciativa existente | Iniciativa ja suspensa, justificativa ausente | Nao | Ortogado ou agencia de fomento | API interna/backoffice a definir |
| DecidirSolicitacaoSuspensao | Command | Aprovar ou rejeitar a solicitacao de suspensao | solicitacao, aprovado, justificativa | `SolicitacaoSuspensao` decidida | RN02, RN03, RN07 | Solicitacao existente | Solicitacao inexistente, estado invalido | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |
| ReativarIniciativaSuspensa | Command | Reativar iniciativa suspensa apos aprovacao da area tecnica | iniciativa, justificativa | Iniciativa reativada | RN03 | Iniciativa suspensa | Iniciativa nao suspensa, reativacao nao permitida | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |
| SolicitarFinalizacaoIniciativa | Command | Registrar pedido de encerramento definitivo da iniciativa | iniciativa, motivo, justificativa | `SolicitacaoFinalizacao` criada | RN04, RN05, RN06, RI2 | Iniciativa existente | Iniciativa em processo incompatível, justificativa ausente | Nao | Ortogado ou agencia de fomento | API interna/backoffice a definir |
| ConcluirFinalizacaoIniciativa | Command | Encerrar a iniciativa apos resolver ou validar pendencias | solicitacaoFinalizacao | Iniciativa encerrada | RN04, RN05, RN06, RN07 | Pendencias verificadas | Pendencias pendentes, iniciativa nao elegivel | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |
| ConsultarPendenciasDeFinalizacao | Query | Consultar pendencias impeditivas ao encerramento da iniciativa | iniciativa | Lista de `VerificacaoPendencia` | RN04, RN05 | Iniciativa existente | Iniciativa nao encontrada | N/A | Ortogado ou area tecnica autorizada | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa os mecanismos internos de bloqueio em M004 nem o encerramento de bolsas em M009.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "iniciativa": "INI-2026-014"
    }
  }
}
```

## Exemplos JSON por Operacao

### SolicitarSuspensaoIniciativa

**Exemplo de entrada**

```json
{
  "iniciativaId": "INI-2026-014",
  "origem": "ORTOGADO",
  "justificativa": "Iniciativa em replanejamento metodologico."
}
```

**Exemplo de saida**

```json
{
  "solicitacaoSuspensao": {
    "codigo": "SS-2026-001",
    "estado": "SUBMETIDA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| JUSTIFICATIVA_SUSPENSAO_OBRIGATORIA | Toda solicitacao de suspensao deve conter justificativa. |
| INICIATIVA_JA_SUSPENSA | A iniciativa informada ja se encontra suspensa e nao pode ser suspensa novamente. |

### DecidirSolicitacaoSuspensao

**Exemplo de entrada**

```json
{
  "solicitacaoCodigo": "SS-2026-001",
  "aprovado": true,
  "justificativa": "Suspensao aprovada pela area tecnica."
}
```

**Exemplo de saida**

```json
{
  "solicitacaoSuspensao": {
    "codigo": "SS-2026-001",
    "estado": "APROVADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| SOLICITACAO_SUSPENSAO_NAO_ENCONTRADA | A solicitacao de suspensao nao foi encontrada para decisao. |
| ESTADO_SUSPENSAO_INVALIDO | A solicitacao de suspensao nao esta em estado valido para decisao. |

### ReativarIniciativaSuspensa

**Exemplo de entrada**

```json
{
  "iniciativaId": "INI-2026-014",
  "justificativa": "Pendencias regularizadas e iniciativa apto a retomar execucao."
}
```

**Exemplo de saida**

```json
{
  "iniciativa": {
    "id": "INI-2026-014",
    "estado": "EM_EXECUCAO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| INICIATIVA_NAO_SUSPENSA | A iniciativa informada nao esta suspensa para reativacao. |
| REATIVACAO_INICIATIVA_NAO_PERMITIDA | A reativacao da iniciativa nao foi autorizada pela area tecnica. |

### SolicitarFinalizacaoIniciativa

**Exemplo de entrada**

```json
{
  "iniciativaId": "INI-2026-014",
  "motivo": "CONCLUSAO_NATURAL",
  "justificativa": "Metas executadas e iniciativa concluido."
}
```

**Exemplo de saida**

```json
{
  "solicitacaoFinalizacao": {
    "codigo": "SF-2026-002",
    "estado": "VERIFICANDO_PENDENCIAS"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| INICIATIVA_ENCERRAMENTO_INVALIDO | A iniciativa nao pode iniciar finalizacao no estado atual. |
| JUSTIFICATIVA_FINALIZACAO_OBRIGATORIA | A solicitacao de finalizacao exige justificativa detalhada. |

### ConcluirFinalizacaoIniciativa

**Exemplo de entrada**

```json
{
  "solicitacaoFinalizacaoCodigo": "SF-2026-002"
}
```

**Exemplo de saida**

```json
{
  "solicitacaoFinalizacao": {
    "codigo": "SF-2026-002",
    "estado": "ENCERRADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PENDENCIAS_FINALIZACAO_ABERTAS | Ainda existem pendencias de bolsas, pagamentos ou prestacao de contas para a iniciativa. |
| INICIATIVA_ENCERRADA_IRREVERSIVEL | A iniciativa ja foi encerrada e nao aceita nova operacao de finalizacao. |

### ConsultarPendenciasDeFinalizacao

**Exemplo de entrada**

```json
{
  "iniciativaId": "INI-2026-014"
}
```

**Exemplo de saida**

```json
{
  "pendencias": [
    {
      "tipo": "PRESTACAO_CONTAS_PENDENTE",
      "descricao": "Prestacao 2026-S1 ainda nao aprovada."
    }
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| INICIATIVA_NAO_ENCONTRADA | A iniciativa informada nao foi encontrada para consulta de pendencias. |
| CONSULTA_PENDENCIA_INVALIDA | Os filtros informados para consulta de pendencias sao invalidos. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Nenhum evento publico ou orquestracao cross-module foi estabilizado nesta rodada.

## Eventos e Efeitos Colaterais

- `DecidirSolicitacaoSuspensao` deve bloquear pagamentos em M004 e impedir novas alocacoes em M009 quando aprovada.
- `ConcluirFinalizacaoIniciativa` depende do fechamento das pendencias verificadas em M009 e M014.
- `ConsultarPendenciasDeFinalizacao` consolida informacoes de modulos vizinhos sem alterar ownership.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
