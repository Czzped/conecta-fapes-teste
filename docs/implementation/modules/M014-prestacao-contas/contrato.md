# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M014 como contexto responsavel pela prestacao de contas da iniciativa, incluindo documentos fiscais, importacoes de integracao, analise, contestacao e consulta do processo.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Coordenador | Registra documentos e submete a prestacao de contas |
| Area Tecnica / SECONT | Analisa, solicita complementos e acompanha auditoria |
| M015 | Consulta pendencias antes do encerramento da iniciativa |
| [Portal Coordenador](../../../products/portal-coordenador/README.md) | Prestacao financeira ([EP-11](../../../products/portal-coordenador/features/EP-11-prestacao-financeira.md)) |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Iniciativa` e pode consumir visao consolidada de execucao |
| Sistema bancario | Sistema externo | Disponibiliza arquivos CNAB 240 para importacao diaria de movimentos bancarios |
| SIGFAPES | Sistema externo | Fornece orcamento planejado da iniciativa para carga unica |
| SERPRO | Sistema externo | Consulta de NF-e (Nota Fiscal Eletronica) via API OAuth2 — valida documentos fiscais |
| MinIO | Sistema externo | Armazenamento de PDFs de orcamento de fornecedor e justificativas |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| RegistrarDocumentoFiscal | Command | Registrar documento fiscal vinculado a rubrica da iniciativa | prestacao, rubrica, tipoDocumento, valor, url | `DocumentoFiscal` criado | RN01, RN07, RN08, RI2 | Iniciativa e rubrica validas | Rubrica invalida, documento fiscal invalido | Nao | Coordenador/Ortogado | API interna/backoffice a definir |
| RegistrarJustificativaPassagem | Command | Registrar passagem comprada na prestacao de contas | prestacao, rubricaProjetoPassagem, origem, destino, dataViagem, valorPassagemComprada, comprovantePagamento, comprovanteRealizacao, transacaoFinanceira | `JustificativaPassagem` criada | RN01, RN12, RI1, RI2 | Prestacao em rascunho/revisao, RubricaProjeto de passagem valida e comprovantes informados | Valor da passagem ausente, comprovantes ausentes, rubrica ausente ou nao classificada como passagem | Nao | Coordenador/Ortogado | API interna/frontoffice a definir |
| AssociarEstornoPrestacaoContas | Command | Associar credito de estorno ao debito correspondente na prestacao existente | prestacao, debitoTransacaoFinanceiraId, creditoEstornoTransacaoFinanceiraId | Par debito/estorno associado com efeito liquido zero | RN11, RN13, RI1 | Prestacao existente, debito e credito da mesma conta bancaria, valores iguais | Valor divergente, credito nao classificado como estorno, debito ja estornado | Sim | Coordenador/Ortogado | API interna/frontoffice a definir |
| SincronizarIniciativasDadosBancarios | Job | Criar/atualizar referencia de iniciativa, identificador bancario e ContaBancaria obrigatoria por iniciativa | lote de iniciativas/dados bancarios | iniciativas/contas sincronizadas | RN09 | Fonte de iniciativas disponivel | Dados bancarios ausentes ou inconsistentes | Sim | Sistema de integracao | Job interno |
| ImportarOrcamentoPlanejadoSIGFAPES | Job | Executar carga unica do orcamento planejado da iniciativa | iniciativa, dados SIGFAPES | Orcamento e RubricaOrcamentaria criados | RN09, RI2 | Iniciativa e dados bancarios sincronizados | Orcamento inexistente, falha SIGFAPES | Sim | Sistema de integracao | Job interno |
| ImportarMovimentosBancariosCNAB240 | Job | Importar movimentos bancarios diarios para conciliacao | arquivo CNAB 240 | TransacaoFinanceira importadas | RN02, RN09, RN11, RI1 | Iniciativa, ContaBancaria e Orcamento importados | CNAB invalido, conta nao encontrada | Sim | Sistema de integracao | Job interno |
| SubmeterPrestacaoContas | Command | Submeter prestacao de contas para analise | prestacao, periodo, declaracaoFinal | `PrestacaoContas` submetida | RN01, RN02, RI1, RI2 | Documentos fiscais e movimentos bancarios carregados/conciliados | Prestacao anterior pendente, saldo de rubrica excedido | Nao | Coordenador | API interna/backoffice a definir |
| EmitirParecerPrestacaoContas | Command | Aprovar, reprovar ou solicitar complementacao da prestacao | prestacao, aprovado, justificativa | `ParecerPC` registrado | RN09, RN10 | Prestacao em analise | Prestacao inexistente, parecer invalido | Nao | Area Tecnica ou SECONT | API interna/backoffice a definir |
| RegistrarContestacaoPrestacaoContas | Command | Registrar contestacao da rejeicao com justificativa e anexos | prestacao, justificativa, documentos | `ContestacaoPrestacaoContas` criada | RN04 | Prestacao rejeitada e prazo vigente | Prazo expirado, contestacao sem justificativa | Nao | Coordenador | API interna/backoffice a definir |
| ConsultarPrestacaoContas | Query | Consultar estado, documentos, conciliacao e pareceres da prestacao | prestacao, projeto, periodo | Detalhe ou lista de prestacoes | RN02, RN03, RN06 | Filtro informado | Prestacao nao encontrada | N/A | Usuario interno autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa integracao bancaria, OCR ou armazenamento definitivo de anexos.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "prestacao": "PC-2026-013"
    }
  }
}
```

## Exemplos JSON por Operacao

### RegistrarDocumentoFiscal

**Exemplo de entrada**

```json
{
  "prestacaoId": "PC-2026-013",
  "rubricaProjetoId": "RP-2026-004",
  "tipoDocumento": "NOTA_FISCAL",
  "valor": 2500.0,
  "url": "https://docs.exemplo.br/nf-001.pdf"
}
```

**Exemplo de saida**

```json
{
  "documentoFiscal": {
    "id": "DOCF-2026-021",
    "status": "PENDENTE_ANALISE"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| DOCUMENTO_FISCAL_INVALIDO | O documento fiscal informado nao possui dados validos para registro. |
| RUBRICA_PROJETO_INVALIDA | A rubrica informada nao pode receber o documento fiscal. |

### ImportarMovimentosBancariosCNAB240

**Exemplo de entrada**

```json
{
  "arquivoCnab": "CNAB240_20260430_001.RET",
  "dataProcessamento": "2026-04-30"
}
```

**Exemplo de saida**

```json
{
  "importacaoCnab": {
    "arquivo": "CNAB240_20260430_001.RET",
    "lancamentosImportados": 14,
    "lancamentosIgnorados": 0,
    "status": "PROCESSADO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CNAB240_INVALIDO | O arquivo CNAB 240 informado nao pode ser processado. |
| CONTA_BANCARIA_NAO_ENCONTRADA | Nao existe conta bancaria cadastrada para os dados informados no CNAB 240. |

### SubmeterPrestacaoContas

**Exemplo de entrada**

```json
{
  "prestacaoId": "PC-2026-013",
  "periodoReferencia": "2026-S1",
  "declaracaoFinal": true
}
```

**Exemplo de saida**

```json
{
  "prestacaoContas": {
    "id": "PC-2026-013",
    "estado": "SUBMETIDA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PRESTACAO_ANTERIOR_PENDENTE | Existem prestacoes anteriores pendentes para o projeto informado. |
| LIMITE_RUBRICA_EXCEDIDO | A soma dos documentos fiscais excede o saldo aprovado da rubrica. |

### EmitirParecerPrestacaoContas

**Exemplo de entrada**

```json
{
  "prestacaoId": "PC-2026-013",
  "aprovado": false,
  "justificativa": "Faltam comprovantes vinculados a rubrica de servicos."
}
```

**Exemplo de saida**

```json
{
  "parecerPC": {
    "aprovado": false
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PRESTACAO_NAO_SUBMETIDA | A prestacao de contas ainda nao foi submetida para analise. |
| PARECER_PC_INVALIDO | O parecer informado para a prestacao e invalido. |

### RegistrarContestacaoPrestacaoContas

**Exemplo de entrada**

```json
{
  "prestacaoId": "PC-2026-013",
  "justificativa": "Os comprovantes complementares foram anexados.",
  "documentos": [
    "DOC-2026-090"
  ]
}
```

**Exemplo de saida**

```json
{
  "contestacaoPrestacaoContas": {
    "id": "CPC-2026-002",
    "estado": "SUBMETIDA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PRAZO_CONTESTACAO_PC_EXPIRADO | O prazo para contestar a recusa da prestacao de contas ja expirou. |
| CONTESTACAO_PC_INVALIDA | A contestacao da prestacao de contas deve conter justificativa e anexos suficientes. |

### ConsultarPrestacaoContas

**Exemplo de entrada**

```json
{
  "prestacaoId": "PC-2026-013"
}
```

**Exemplo de saida**

```json
{
  "prestacaoContas": {
    "id": "PC-2026-013",
    "estado": "SUBMETIDA",
    "documentosFiscais": 8,
    "extratosImportados": 1
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PRESTACAO_NAO_ENCONTRADA | Nenhuma prestacao de contas foi encontrada para o identificador informado. |
| FILTRO_PRESTACAO_INVALIDO | Os filtros informados para consulta da prestacao de contas sao invalidos. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Nenhuma integracao bancaria ou auditorial foi estabilizada como transporte publico nesta rodada.

## Eventos e Efeitos Colaterais

- `SubmeterPrestacaoContas` inicia o fluxo de analise do modulo.
- `EmitirParecerPrestacaoContas` pode abrir a janela de contestacao ou consolidar aprovacao final.
- `ConsultarPrestacaoContas` expoe pendencias consumidas por M015.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
