# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M004 como contexto responsavel por calendario mensal, decisao de liberacao, geracao de folhas, remessas e acompanhamento do pagamento de bolsistas.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Gerente GEPOF | Define marcos mensais, gera folhas e acompanha remessas |
| Area Tecnica | Decide a liberacao de editais por competencia |
| M015 e M017 | Bloqueiam ou restringem processamento de pagamentos em cenarios especificos |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Edital`, `Projeto` e `AlocacaoBolsista` |
| M001 | Modulo interno | Fornece `VersaoNivel` |
| M008 | Modulo interno | Fornece `AreaTecnica` |
| Banco / integracao financeira | Sistema externo | Recebe remessas e retorna status de agendamento/pagamento |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| ConfigurarPlanoMensalDeFolhas | Command | Definir os marcos M1, M2 e M3 da competencia | competencia, marcoSolicitacao, marcoGeracaoFolha, marcoPagamento | `PlanoMensal` criado/atualizado | RN01, RN02, RN03, RN07, RN08, RN09 | Datas informadas | Datas fora da janela, sequencia invalida | Nao | Gerente GEPOF | API interna/backoffice a definir |
| RegistrarDecisaoDeLiberacaoDoEditalCompetencia | Command | Liberar ou nao liberar edital para a competencia | edital, competencia, ehLiberado, justificativa | `EditalCompetencia` atualizado | RN12, RN13, RN18, RN24 | EditalCompetencia existente ou gerado | Prazo invalido, edital ja incluido em folha | Nao | Area Tecnica | API interna/backoffice a definir |
| GerarFolhaDePagamento | Command | Gerar folha normal ou complementar para a competencia | competencia, dataPagamento, tipoFolha | `Folha` gerada com pagamentos vinculados | RN10, RN15, RN16, RN23 | Marco de geracao atingido e folha anterior resolvida | Folha anterior pendente, pagamentos indisponiveis | Nao | Gerente GEPOF | API interna/backoffice a definir |
| RegistrarDecisaoSobreFolha | Command | Autorizar, rejeitar ou cancelar uma folha gerada | folha, tipoAcao, justificativa | `Folha` e pagamentos atualizados | RN14, RN20, RN21, RN22, RN25 | Folha existente | Estado da folha invalido, cancelamento nao permitido | Nao | Gerente GEPOF ou Diretor autorizado | API interna/backoffice a definir |
| GerarRemessaBancaria | Async Job | Preparar e enviar remessa de cadastro ou pagamento ao banco | folha, tipoRemessa | `Remessa` registrada | RN17, RN25 | Folha autorizada quando aplicavel | Folha nao autorizada, falha de integracao bancara | Sim por folha e tipo de remessa | Sistema | Job/fila a definir + integracao bancaria |
| ConsultarFolhasDaCompetencia | Query | Consultar folhas, decisoes, guias e remessas de uma competencia | competencia, edital, status | Lista de folhas e seus artefatos | RN10, RN17 | Competencia informada | Nenhuma folha encontrada | N/A | Gerente GEPOF ou Area Tecnica autorizada | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- Endpoint, fila, arquivo de remessa e integracao bancaria concreta continuam `a definir`.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "competencia": "2026-05"
    }
  }
}
```

## Exemplos JSON por Operacao

### ConfigurarPlanoMensalDeFolhas

**Exemplo de entrada**

```json
{
  "competencia": "2026-05",
  "marcoSolicitacao": "2026-05-05",
  "marcoGeracaoFolha": "2026-05-12",
  "marcoPagamento": "2026-05-20"
}
```

**Exemplo de saida**

```json
{
  "planoMensal": {
    "competencia": "2026-05",
    "ehAtual": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| MARCO_PLANO_INVALIDO | Os marcos informados para a competencia nao respeitam as janelas permitidas. |
| SEQUENCIA_MARCOS_INVALIDA | O marco M1 deve ocorrer antes de M2, e M2 antes de M3. |

### RegistrarDecisaoDeLiberacaoDoEditalCompetencia

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001",
  "competencia": "2026-05",
  "ehLiberado": true,
  "justificativa": null
}
```

**Exemplo de saida**

```json
{
  "editalCompetencia": {
    "status": "LIBERADO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PRAZO_LIBERACAO_INVALIDO | Ainda nao e permitido decidir a liberacao do edital para esta competencia. |
| EDITAL_COMPETENCIA_BLOQUEADO | O edital ja foi incluido em folha e nao pode mais ter a decisao alterada. |

### GerarFolhaDePagamento

**Exemplo de entrada**

```json
{
  "competencia": "2026-05",
  "tipoFolha": "NORMAL",
  "dataPagamento": "2026-05-20"
}
```

**Exemplo de saida**

```json
{
  "folha": {
    "id": "FOL-2026-05-01",
    "status": "GERADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FOLHA_ANTERIOR_PENDENTE | Nao e possivel gerar nova folha enquanto a ultima estiver gerada e sem decisao final. |
| DATA_PAGAMENTO_INVALIDA | A data de pagamento informada e invalida para o tipo de folha solicitado. |

### RegistrarDecisaoSobreFolha

**Exemplo de entrada**

```json
{
  "folhaId": "FOL-2026-05-01",
  "tipoAcao": "AUTORIZAR",
  "justificativa": "Folha validada para envio bancario."
}
```

**Exemplo de saida**

```json
{
  "folha": {
    "id": "FOL-2026-05-01",
    "status": "AUTORIZADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ACAO_FOLHA_INVALIDA | A acao solicitada nao pode ser aplicada ao estado atual da folha. |
| CANCELAMENTO_FOLHA_NAO_PERMITIDO | A folha nao pode mais ser cancelada no momento informado. |

### GerarRemessaBancaria

**Exemplo de entrada**

```json
{
  "folhaId": "FOL-2026-05-01",
  "tipoRemessa": "PAGAMENTO"
}
```

**Exemplo de saida**

```json
{
  "remessa": {
    "numero": 1042,
    "status": "ENVIADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FOLHA_NAO_AUTORIZADA | Somente folhas autorizadas podem gerar remessa de pagamento. |
| REMESSA_BANCARIA_INDISPONIVEL | Nao foi possivel enviar a remessa para o banco neste momento. |

### ConsultarFolhasDaCompetencia

**Exemplo de entrada**

```json
{
  "competencia": "2026-05",
  "status": "AUTORIZADA"
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "id": "FOL-2026-05-01",
      "status": "AUTORIZADA",
      "dataPagamento": "2026-05-20"
    }
  ],
  "total": 1
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FOLHA_NAO_ENCONTRADA | Nenhuma folha foi encontrada para os filtros informados. |
| FILTRO_FOLHA_INVALIDO | Os filtros informados para consulta de folhas sao invalidos. |

## Mapeamento de Transporte

- `Command` e `Query`: `API interna/backoffice a definir`.
- `GerarRemessaBancaria`: `job/fila a definir`.
- Integracao externa bancaria: `a definir`.

## Eventos e Efeitos Colaterais

- `RegistrarDecisaoDeLiberacaoDoEditalCompetencia` registra historico formal de decisao da area.
- `GerarFolhaDePagamento` altera o status dos pagamentos vinculados e do edital por competencia.
- `RegistrarDecisaoSobreFolha` pode devolver pagamentos para `ALOCADO`, conforme regras do modulo.
- `GerarRemessaBancaria` inicia a comunicacao com o provedor financeiro externo.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
