# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M019 como contexto responsavel por transparencia publica, relatorios para a SECONT, exportacoes para auditoria e trilha imutavel de operacoes da plataforma.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Cidadao | Consulta o portal publico de transparencia sem autenticacao |
| SECONT | Consome relatorios padronizados e exportacoes de auditoria |
| Todos os modulos internos | Alimentam a trilha de auditoria e a publicacao de dados |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M010 | Modulo interno | Fornece `Programa` |
| M003 | Modulo interno | Fornece `Iniciativa` |
| M009 | Modulo interno | Fornece `BolsaPesquisa` |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| AtualizarPublicacaoTransparencia | Async Job | Publicar diariamente os dados anonimizados do portal de transparencia | dataReferencia | `PublicacaoTransparencia` atualizada | RN01, RN02, RN07 | Fontes de dados disponiveis | Falha de publicacao, anonimização inconsistente | Sim por data de referencia | Sistema | Job agendado a definir |
| ConsultarPortalTransparenciaPublica | Query | Consultar dados publicos anonimizados do portal de transparencia | filtros publicos | Dados publicados | RN02, RN07 | Nenhuma | Dados nao publicados | N/A | Publico | API publica a definir |
| GerarRelatorioSECONT | Command | Gerar relatorio financeiro padronizado para a SECONT | periodo, tipoRelatorio | `RelatorioSECONT` gerado | RN03, RN09 | Periodo informado | Formato padronizado indisponivel, dados insuficientes | Nao | Usuario interno autorizado | API interna/backoffice a definir |
| ExportarDadosParaAuditoria | Command | Exportar dados e trilha de auditoria com metadados de rastreabilidade | escopo, formato, periodo | `ExportacaoAuditoria` gerada | RN04, RN05, RN06 | Escopo informado | Formato invalido, exportacao indisponivel | Nao | Usuario interno autorizado | API interna/backoffice a definir |
| RegistrarEventoDeAuditoria | Event Consumed | Registrar evento de criacao, alteracao ou exclusao vindo de outros modulos | moduloOrigem, operacao, usuario, contexto | `RegistroAuditoria` persistido | RN04, RN05, RN06 | Evento recebido com metadados minimos | Evento inconsistente, tentativa de alteracao retroativa | Sim por chave do evento | Sistema | Evento/mensagem interna a definir |
| ConsultarIndicadoresTransparencia | Query | Consultar indicadores de volume e atualizacao do portal | periodo | `IndicadorTransparencia` consolidado | RN08 | Periodo informado | Indicador indisponivel | N/A | Usuario interno autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa endpoint publico, job scheduler nem formato final de integracao com a SECONT.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "periodo": "2026-04"
    }
  }
}
```

## Exemplos JSON por Operacao

### AtualizarPublicacaoTransparencia

**Exemplo de entrada**

```json
{
  "dataReferencia": "2026-04-13"
}
```

**Exemplo de saida**

```json
{
  "publicacaoTransparencia": {
    "id": "PUB-2026-013",
    "registrosPublicados": 1240
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ANONIMIZACAO_DADOS_INVALIDA | Os dados nao passaram pela anonimização exigida antes da publicacao. |
| PUBLICACAO_TRANSPARENCIA_FALHOU | Nao foi possivel atualizar o portal de transparencia nesta execucao. |

### ConsultarPortalTransparenciaPublica

**Exemplo de entrada**

```json
{
  "programaId": "PROG-2026-01"
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "programa": "Programa de Dados Publicos",
      "valorExecutado": 120000.0
    }
  ],
  "total": 1
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| DADOS_TRANSPARENCIA_NAO_PUBLICADOS | Os dados solicitados ainda nao foram publicados no portal de transparencia. |
| FILTRO_TRANSPARENCIA_INVALIDO | Os filtros informados para consulta publica sao invalidos. |

### GerarRelatorioSECONT

**Exemplo de entrada**

```json
{
  "periodoInicio": "2026-04-01",
  "periodoFim": "2026-04-30",
  "tipoRelatorio": "EXECUCAO_FINANCEIRA"
}
```

**Exemplo de saida**

```json
{
  "relatorioSECONT": {
    "id": "SEC-2026-004",
    "estado": "GERADO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| DADOS_SECONT_INSUFICIENTES | Nao ha dados suficientes para gerar o relatorio SECONT no formato padronizado. |
| PERIODO_RELATORIO_INVALIDO | O periodo informado para geracao do relatorio SECONT e invalido. |

### ExportarDadosParaAuditoria

**Exemplo de entrada**

```json
{
  "escopo": "FINANCEIRO",
  "formato": "CSV",
  "periodoInicio": "2026-04-01",
  "periodoFim": "2026-04-30"
}
```

**Exemplo de saida**

```json
{
  "exportacaoAuditoria": {
    "id": "AUD-2026-009",
    "formato": "CSV"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FORMATO_EXPORTACAO_AUDITORIA_INVALIDO | O formato solicitado nao e suportado para exportacao de auditoria. |
| EXPORTACAO_AUDITORIA_INDISPONIVEL | Nao foi possivel gerar a exportacao de auditoria neste momento. |

### RegistrarEventoDeAuditoria

**Exemplo de entrada**

```json
{
  "moduloOrigem": "M014",
  "operacao": "ALTERACAO",
  "usuario": "analista@agencia.br",
  "contexto": "Prestacao de contas PC-2026-013"
}
```

**Exemplo de saida**

```json
{
  "registroAuditoria": {
    "id": "AUDREG-2026-220"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| EVENTO_AUDITORIA_INCONSISTENTE | O evento recebido nao possui metadados minimos de rastreabilidade. |
| TRILHA_AUDITORIA_IMUTAVEL | Nao e permitido alterar ou sobrescrever registros da trilha de auditoria. |

### ConsultarIndicadoresTransparencia

**Exemplo de entrada**

```json
{
  "periodoInicio": "2026-01-01",
  "periodoFim": "2026-04-30"
}
```

**Exemplo de saida**

```json
{
  "indicadoresTransparencia": {
    "volumePublicacoes": 4,
    "frequenciaAtualizacaoDias": 1
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| INDICADOR_TRANSPARENCIA_INDISPONIVEL | Nao foi possivel calcular os indicadores de transparencia para o periodo informado. |
| PERIODO_INDICADOR_INVALIDO | O periodo informado para os indicadores de transparencia e invalido. |

## Mapeamento de Transporte

- `ConsultarPortalTransparenciaPublica`: `API publica a definir`.
- `Command` internos: `API interna/backoffice a definir`.
- `AtualizarPublicacaoTransparencia`: `job agendado a definir`.
- `RegistrarEventoDeAuditoria`: `evento/mensagem interna a definir`.

## Eventos e Efeitos Colaterais

- `AtualizarPublicacaoTransparencia` publica dados anonimizados para acesso publico.
- `RegistrarEventoDeAuditoria` materializa a trilha imutavel de operacoes da plataforma.
- `GerarRelatorioSECONT` e `ExportarDadosParaAuditoria` disponibilizam artefatos formais de controle externo.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
