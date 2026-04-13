# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M012 como contexto responsavel por dashboards de acompanhamento, relatorios tecnicos, contestacoes e solicitacoes de alteracao de projetos.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Coordenador | Submete relatorios, contesta pareceres e solicita alteracoes |
| Area Tecnica da Agencia de Fomento | Analisa relatorios e decide solicitacoes |
| SECONT | Consulta dashboards somente leitura quando aplicavel |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Projeto`, `Coordenador` e `Edital` |
| M020 | Modulo interno | Pode ser acionado para notificacoes de prazo e resultado |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| ConsultarDashboardAcompanhamento | Query | Consultar indicadores operacionais do projeto ou do painel institucional | projeto, edital, filtros | `DashboardProjeto` consolidado | RN01, RN04 | Projeto contratado quando aplicavel | Projeto nao elegivel, dashboard indisponivel | N/A | Area Tecnica, Coordenador ou perfil autorizado | API interna a definir |
| SubmeterRelatorioTecnico | Command | Registrar submissao de relatorio tecnico do projeto | projeto, periodo, conteudo, anexos | `RelatorioTecnico` submetido | RN02, RN06, RI1 | Projeto ativo | Projeto inativo, periodo ja coberto | Nao | Coordenador | API interna/backoffice a definir |
| EmitirParecerRelatorio | Command | Aprovar ou reprovar relatorio tecnico | relatorio, tipoParecer, justificativa | `ParecerRelatorio` registrado | RN02, RN06 | Relatorio submetido | Relatorio inexistente, parecer invalido | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarContestacaoRelatorio | Command | Registrar contestacao de reprovacao de relatorio | relatorio, justificativa, documentos | `ContestacaoRelatorio` criada | RN03, RN07, RN08 | Relatorio reprovado e prazo vigente | Prazo expirado, contestacao duplicada | Nao | Coordenador | API interna/backoffice a definir |
| RegistrarSolicitacaoDeAlteracao | Command | Solicitar alteracao relevante do projeto com justificativa | projeto, tipoAlteracao, justificativa | `SolicitacaoAlteracao` criada | RN05, RN09, RI2 | Projeto ativo | Projeto encerrado, solicitacao pendente existente | Nao | Coordenador | API interna/backoffice a definir |
| DecidirSolicitacaoDeAlteracao | Command | Aprovar ou reprovar solicitacao de alteracao do projeto | solicitacao, aprovado, justificativa | `SolicitacaoAlteracao` decidida | RN05, RI2 | Solicitacao pendente | Solicitacao inexistente, estado invalido | Nao | Area Tecnica da Agencia de Fomento | API interna/backoffice a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa widget de dashboard, mecanismo de armazenamento de anexos ou notificacao.

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

### ConsultarDashboardAcompanhamento

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014"
}
```

**Exemplo de saida**

```json
{
  "dashboardProjeto": {
    "projetoId": "PROJ-2026-014",
    "statusProjeto": "ATIVO",
    "relatoriosPendentes": 1
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PROJETO_NAO_ELEGIVEL_DASHBOARD | Somente projetos contratados podem ser exibidos no dashboard de acompanhamento. |
| DASHBOARD_INDISPONIVEL | Nao foi possivel consolidar os indicadores de acompanhamento neste momento. |

### SubmeterRelatorioTecnico

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "periodoReferencia": "2026-S1",
  "conteudo": "Resumo das entregas do semestre."
}
```

**Exemplo de saida**

```json
{
  "relatorioTecnico": {
    "id": "REL-2026-010",
    "estado": "SUBMETIDO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PROJETO_INATIVO | O projeto nao esta ativo para submissao de relatorio tecnico. |
| PERIODO_RELATORIO_DUPLICADO | Ja existe relatorio aprovado para o periodo informado. |

### EmitirParecerRelatorio

**Exemplo de entrada**

```json
{
  "relatorioId": "REL-2026-010",
  "tipoParecer": "REPROVADO",
  "justificativa": "Necessario detalhar indicadores de entrega."
}
```

**Exemplo de saida**

```json
{
  "parecerRelatorio": {
    "tipoParecer": "REPROVADO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| RELATORIO_NAO_ENCONTRADO | O relatorio informado nao foi encontrado para analise. |
| PARECER_RELATORIO_INVALIDO | O parecer informado para o relatorio e invalido. |

### RegistrarContestacaoRelatorio

**Exemplo de entrada**

```json
{
  "relatorioId": "REL-2026-010",
  "justificativa": "Os anexos complementares foram atualizados.",
  "documentos": [
    "DOC-2026-014"
  ]
}
```

**Exemplo de saida**

```json
{
  "contestacaoRelatorio": {
    "id": "CON-2026-003",
    "estado": "SUBMETIDA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PRAZO_CONTESTACAO_EXPIRADO | O prazo para contestar a reprovacao do relatorio ja expirou. |
| CONTESTACAO_RELATORIO_INVALIDA | A contestacao deve conter justificativa e documentos complementares. |

### RegistrarSolicitacaoDeAlteracao

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "tipoAlteracao": "PRAZO",
  "justificativa": "Necessidade de extensao de cronograma."
}
```

**Exemplo de saida**

```json
{
  "solicitacaoAlteracao": {
    "id": "ALT-2026-007",
    "estado": "SUBMETIDA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PROJETO_ENCERRADO | Nao e permitido registrar solicitacao de alteracao para projeto encerrado. |
| SOLICITACAO_ALTERACAO_DUPLICADA | Ja existe solicitacao de alteracao pendente para o projeto informado. |

### DecidirSolicitacaoDeAlteracao

**Exemplo de entrada**

```json
{
  "solicitacaoId": "ALT-2026-007",
  "aprovado": true,
  "justificativa": "Alteracao compatibilizada com o acompanhamento do projeto."
}
```

**Exemplo de saida**

```json
{
  "solicitacaoAlteracao": {
    "id": "ALT-2026-007",
    "estado": "APROVADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| SOLICITACAO_ALTERACAO_NAO_ENCONTRADA | A solicitacao de alteracao nao foi encontrada para decisao. |
| ESTADO_SOLICITACAO_INVALIDO | A solicitacao nao esta em estado valido para decisao. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Nenhum mecanismo de dashboard ou notificacao foi estabilizado nesta rodada.

## Eventos e Efeitos Colaterais

- `EmitirParecerRelatorio` pode abrir a janela de contestacao quando o parecer for reprovado.
- `RegistrarSolicitacaoDeAlteracao` passa a compor a trilha de acompanhamento do projeto.
- `DecidirSolicitacaoDeAlteracao` altera o estado da solicitacao e pode impactar o planejamento operacional do projeto.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
