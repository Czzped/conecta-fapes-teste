# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M017 como contexto responsavel por KYC, monitoramento PLD, analise de alertas, bloqueio preventivo de pagamento, reporte ao COAF e dashboard de compliance.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Oficial de compliance | Analisa alertas, decide bloqueios e acompanha o dashboard PLD |
| M004 | Respeita bloqueios preventivos de pagamento |
| Diretoria autorizada | Autoriza desbloqueios e acompanha reportes sensiveis |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece `Beneficiario` |
| M004 | Modulo interno | Fornece `Pagamento` e precisa obedecer bloqueios |
| M016 | Modulo interno | Fornece `MovimentacaoFinanceira` para monitoramento |
| Listas restritivas / COAF | Sistema externo | Suportam consulta automatica e reporte |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| ExecutarVerificacaoKYC | Command | Realizar verificacao KYC antes do primeiro pagamento do beneficiario | beneficiario, contexto | `VerificacaoKYC` concluida | RN01, RI2 | Beneficiario existente | Beneficiario invalido, consulta incompleta | Sim por beneficiario e ciclo de verificacao | Sistema ou oficial de compliance | API interna/backoffice a definir |
| ExecutarMonitoramentoDiarioPLD | Async Job | Executar consultas a listas restritivas e gerar alertas automaticos | dataReferencia, parametrosMonitoramento | `AlertaPLD` e consultas registradas | RN02, RN10 | Parametros configurados | Lista restritiva indisponivel, monitoramento falhou | Sim por janela de processamento | Sistema | Job agendado a definir |
| RegistrarAnaliseDeAlertaPLD | Command | Confirmar ou descartar alerta com justificativa | alerta, confirmado, justificativa, parecer | `AnaliseAlerta` registrada | RN03, RN07, RN09 | Alerta existente | Alerta inexistente, descarte sem justificativa | Nao | Oficial de compliance | API interna/backoffice a definir |
| DecidirBloqueioPreventivoDePagamento | Command | Bloquear ou desbloquear preventivamente pagamento relacionado a alerta | alerta, pagamento, bloquear, autorizadorDesbloqueio | `BloqueioPagamento` atualizado | RN05, RI1 | Alerta existente e pagamento identificado | Pagamento ja bloqueado, desbloqueio sem autorizacao | Nao | Oficial de compliance ou diretor autorizado | API interna/backoffice a definir |
| GerarReporteCOAF | Command | Gerar reporte formal de alerta confirmado para o COAF | alerta, descricaoOperacao, valorOperacao | `ReporteCOAF` gerado | RN04, RN07 | Alerta confirmado | Alerta nao confirmado, dados legais incompletos | Nao | Oficial de compliance | API interna/backoffice a definir |
| ConsultarDashboardPLD | Query | Consultar verificacoes, alertas, bloqueios e reportes do dominio PLD | periodo, estadoAlerta, tipoAlerta | Dashboard PLD consolidado | RN08, RN10 | Usuario com perfil de compliance | Perfil sem acesso, dashboard indisponivel | N/A | Oficial de compliance | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa formato de listas restritivas, protocolo do COAF ou scheduler tecnico.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "alerta": "APLD-2026-001"
    }
  }
}
```

## Exemplos JSON por Operacao

### ExecutarVerificacaoKYC

**Exemplo de entrada**

```json
{
  "beneficiarioId": "PES-2026-001",
  "contexto": "PRIMEIRO_PAGAMENTO"
}
```

**Exemplo de saida**

```json
{
  "verificacaoKYC": {
    "codigo": "KYC-2026-001",
    "resultado": "APROVADO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| BENEFICIARIO_NAO_ENCONTRADO | O beneficiario informado nao foi encontrado para verificacao KYC. |
| KYC_INCONCLUSIVO | A verificacao KYC nao pode ser concluida com os dados disponiveis. |

### ExecutarMonitoramentoDiarioPLD

**Exemplo de entrada**

```json
{
  "dataReferencia": "2026-04-13",
  "parametrosMonitoramento": {
    "valorLimite": 50000.0
  }
}
```

**Exemplo de saida**

```json
{
  "monitoramento": {
    "alertasGerados": 2,
    "consultasExecutadas": 120
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| LISTA_RESTRITIVA_INDISPONIVEL | Nao foi possivel consultar as listas restritivas na execucao diaria. |
| PARAMETRO_MONITORAMENTO_INVALIDO | Os parametros configurados para monitoramento PLD sao invalidos. |

### RegistrarAnaliseDeAlertaPLD

**Exemplo de entrada**

```json
{
  "alertaCodigo": "APLD-2026-001",
  "confirmado": false,
  "justificativa": "Movimentacao compatível com historico aprovado.",
  "parecer": "Sem indicios adicionais de irregularidade."
}
```

**Exemplo de saida**

```json
{
  "analiseAlerta": {
    "confirmado": false
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ALERTA_PLD_NAO_ENCONTRADO | O alerta PLD informado nao foi encontrado para analise. |
| DESCARTE_ALERTA_SEM_JUSTIFICATIVA | Alertas descartados exigem justificativa obrigatoria do oficial de compliance. |

### DecidirBloqueioPreventivoDePagamento

**Exemplo de entrada**

```json
{
  "alertaCodigo": "APLD-2026-001",
  "pagamentoId": "PAG-2026-210",
  "bloquear": true
}
```

**Exemplo de saida**

```json
{
  "bloqueioPagamento": {
    "codigo": "BLQ-2026-001",
    "ativo": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PAGAMENTO_BLOQUEADO_JA_EXISTENTE | O pagamento informado ja possui bloqueio preventivo ativo. |
| DESBLOQUEIO_SEM_AUTORIZACAO_DIRETORIA | O desbloqueio exige autorizacao formal de diretor responsavel. |

### GerarReporteCOAF

**Exemplo de entrada**

```json
{
  "alertaCodigo": "APLD-2026-001",
  "descricaoOperacao": "Fracionamento atipico de pagamentos.",
  "valorOperacao": 78000.0
}
```

**Exemplo de saida**

```json
{
  "reporteCOAF": {
    "codigo": "RCOAF-2026-001",
    "dataGeracao": "2026-04-13"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ALERTA_NAO_CONFIRMADO_PARA_REPORTE | Somente alertas confirmados podem gerar reporte ao COAF. |
| DADOS_REPORTE_INCOMPLETOS | O reporte ao COAF exige descricao e valor completos da operacao suspeita. |

### ConsultarDashboardPLD

**Exemplo de entrada**

```json
{
  "periodoInicio": "2026-04-01",
  "periodoFim": "2026-04-13"
}
```

**Exemplo de saida**

```json
{
  "dashboardPLD": {
    "alertasGerados": 5,
    "alertasEmAnalise": 2,
    "bloqueiosAtivos": 1
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ACESSO_DASHBOARD_PLD_NEGADO | O dashboard PLD e acessivel apenas a usuarios com perfil de compliance. |
| DASHBOARD_PLD_INDISPONIVEL | Nao foi possivel consolidar os indicadores do dashboard PLD neste momento. |

## Mapeamento de Transporte

- `Command` e `Query`: `API interna/backoffice a definir`.
- `ExecutarMonitoramentoDiarioPLD`: `job agendado a definir`.
- Integracoes com listas restritivas e COAF permanecem `a definir`.

## Eventos e Efeitos Colaterais

- `ExecutarVerificacaoKYC` condiciona a elegibilidade de pagamento do beneficiario.
- `DecidirBloqueioPreventivoDePagamento` impede processamento em M004 quando o bloqueio estiver ativo.
- `GerarReporteCOAF` consolida o desfecho regulatorio de um alerta confirmado.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
