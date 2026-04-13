# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M015 como contexto coordenador dos fluxos de suspensao, reativacao e finalizacao de projetos, com verificacao de pendencias em modulos vizinhos.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Coordenador | Solicita suspensao e finalizacao do projeto |
| Area Tecnica da Agencia de Fomento | Analisa suspensoes e acompanha encerramentos |
| M004, M009 e M014 | Sofrem efeitos colaterais de bloqueio, pendencia ou validacao para encerramento |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Projeto` |
| M009 | Modulo interno | Fornece estado de `BolsaPesquisa` |
| M014 | Modulo interno | Fornece estado de `PrestacaoContas` |
| M004 | Modulo interno | Deve bloquear pagamentos quando a suspensao for efetivada |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| SolicitarSuspensaoProjeto | Command | Registrar solicitacao de suspensao de projeto | projeto, origem, justificativa | `SolicitacaoSuspensao` criada | RN01, RN08, RI1, RI2 | Projeto existente | Projeto ja suspenso, justificativa ausente | Nao | Coordenador ou agencia de fomento | API interna/backoffice a definir |
| DecidirSolicitacaoSuspensao | Command | Aprovar ou rejeitar a solicitacao de suspensao | solicitacao, aprovado, justificativa | `SolicitacaoSuspensao` decidida | RN02, RN03, RN07 | Solicitacao existente | Solicitacao inexistente, estado invalido | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |
| ReativarProjetoSuspenso | Command | Reativar projeto suspenso apos aprovacao da area tecnica | projeto, justificativa | Projeto reativado | RN03, RN06 | Projeto suspenso | Projeto nao suspenso, reativacao nao permitida | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |
| SolicitarFinalizacaoProjeto | Command | Registrar pedido de encerramento definitivo do projeto | projeto, motivo, justificativa | `SolicitacaoFinalizacao` criada | RN04, RN05, RN06, RI2 | Projeto existente | Projeto em processo incompatível, justificativa ausente | Nao | Coordenador ou agencia de fomento | API interna/backoffice a definir |
| ConcluirFinalizacaoProjeto | Command | Encerrar o projeto apos resolver ou validar pendencias | solicitacaoFinalizacao | Projeto encerrado | RN04, RN05, RN06, RN07 | Pendencias verificadas | Pendencias pendentes, projeto nao elegivel | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |
| ConsultarPendenciasDeFinalizacao | Query | Consultar pendencias impeditivas ao encerramento do projeto | projeto | Lista de `VerificacaoPendencia` | RN04, RN05 | Projeto existente | Projeto nao encontrado | N/A | Coordenador ou area tecnica autorizada | API interna a definir |

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
      "projeto": "PROJ-2026-014"
    }
  }
}
```

## Exemplos JSON por Operacao

### SolicitarSuspensaoProjeto

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "origem": "COORDENADOR",
  "justificativa": "Projeto em replanejamento metodologico."
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
| PROJETO_JA_SUSPENSO | O projeto informado ja se encontra suspenso e nao pode ser suspenso novamente. |

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

### ReativarProjetoSuspenso

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "justificativa": "Pendencias regularizadas e projeto apto a retomar execucao."
}
```

**Exemplo de saida**

```json
{
  "projeto": {
    "id": "PROJ-2026-014",
    "estado": "EM_EXECUCAO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PROJETO_NAO_SUSPENSO | O projeto informado nao esta suspenso para reativacao. |
| REATIVACAO_PROJETO_NAO_PERMITIDA | A reativacao do projeto nao foi autorizada pela area tecnica. |

### SolicitarFinalizacaoProjeto

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "motivo": "CONCLUSAO_NATURAL",
  "justificativa": "Metas executadas e projeto concluido."
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
| PROJETO_ENCERRAMENTO_INVALIDO | O projeto nao pode iniciar finalizacao no estado atual. |
| JUSTIFICATIVA_FINALIZACAO_OBRIGATORIA | A solicitacao de finalizacao exige justificativa detalhada. |

### ConcluirFinalizacaoProjeto

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
| PENDENCIAS_FINALIZACAO_ABERTAS | Ainda existem pendencias de bolsas, pagamentos ou prestacao de contas para o projeto. |
| PROJETO_ENCERRADO_IRREVERSIVEL | O projeto ja foi encerrado e nao aceita nova operacao de finalizacao. |

### ConsultarPendenciasDeFinalizacao

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014"
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
| PROJETO_NAO_ENCONTRADO | O projeto informado nao foi encontrado para consulta de pendencias. |
| CONSULTA_PENDENCIA_INVALIDA | Os filtros informados para consulta de pendencias sao invalidos. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Nenhum evento publico ou orquestracao cross-module foi estabilizado nesta rodada.

## Eventos e Efeitos Colaterais

- `DecidirSolicitacaoSuspensao` deve bloquear pagamentos em M004 e impedir novas alocacoes em M009 quando aprovada.
- `ConcluirFinalizacaoProjeto` depende do fechamento das pendencias verificadas em M009 e M014.
- `ConsultarPendenciasDeFinalizacao` consolida informacoes de modulos vizinhos sem alterar ownership.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
