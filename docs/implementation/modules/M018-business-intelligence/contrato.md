# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M018 como contexto analitico para consolidacao diaria de dados, consulta de paineis e exportacao de relatorios gerenciais.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Diretoria | Consulta indicadores consolidados e comparativos entre periodos |
| Area Tecnica | Consulta paineis filtrados pelo proprio escopo |
| Gestores de programa | Exportam relatorios analiticos para acompanhamento |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M010 | Modulo interno | Fornece `Programa` |
| M003 | Modulo interno | Fornece `Iniciativa` e sua visao consolidada |
| M011 | Modulo interno | Fornece `Edital` e dados de captacao |
| M009 | Modulo interno | Fornece `BolsaPesquisa` |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| AtualizarPaineisAnaliticos | Async Job | Consolidar diariamente dados transacionais em paineis analiticos | dataReferencia | `PainelAnalitico` atualizado | RN01, RN05, RN08 | Fontes disponiveis | Falha de consolidacao, fonte indisponivel | Sim por data de referencia | Sistema | Job agendado a definir |
| ConsultarPainelAnalitico | Query | Consultar painel analitico com filtros de periodo, programa, edital e instituicao | tipoPainel, filtros | `PainelAnalitico` detalhado | RN02, RN04 | Perfil autorizado | Painel inexistente, acesso restrito | N/A | Diretoria, Area Tecnica ou gestor autorizado | API interna a definir |
| ConsultarIndicadoresConsolidados | Query | Consultar indicadores de desempenho e comparativos entre periodos | periodoAtual, periodoComparativo, filtros | Lista de `Indicador` | RN05, RN06 | Periodos informados | Indicador indisponivel, filtros invalidos | N/A | Diretoria ou perfil autorizado | API interna a definir |
| ExportarRelatorioAnalitico | Command | Exportar relatorio analitico em formato PDF ou Excel | painel, filtros, formato | `RelatorioExportado` gerado | RN03, RN07 | Painel disponivel | Formato nao suportado, exportacao indisponivel | Nao | Usuario interno autorizado | API interna/backoffice a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa engine de BI, cubo analitico ou armazenamento de exportacoes.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "painel": "PROGRAMAS_PROJETOS"
    }
  }
}
```

## Exemplos JSON por Operacao

### AtualizarPaineisAnaliticos

**Exemplo de entrada**

```json
{
  "dataReferencia": "2026-04-13"
}
```

**Exemplo de saida**

```json
{
  "atualizacao": {
    "paineisProcessados": 6,
    "status": "CONCLUIDA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FONTE_ANALITICA_INDISPONIVEL | Uma ou mais fontes transacionais nao estavam disponiveis para atualizacao analitica. |
| TEMPO_PROCESSAMENTO_EXCEDIDO | A atualizacao analitica excedeu o tempo maximo esperado. |

### ConsultarPainelAnalitico

**Exemplo de entrada**

```json
{
  "tipoPainel": "PROGRAMAS_PROJETOS",
  "filtros": {
    "programaId": "PROG-2026-01"
  }
}
```

**Exemplo de saida**

```json
{
  "painelAnalitico": {
    "tipoPainel": "PROGRAMAS_PROJETOS",
    "indicadores": 5
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PAINEL_ANALITICO_NAO_ENCONTRADO | O painel analitico solicitado nao foi encontrado. |
| ACESSO_PAINEL_NEGADO | O usuario nao possui permissao para visualizar os dados do painel solicitado. |

### ConsultarIndicadoresConsolidados

**Exemplo de entrada**

```json
{
  "periodoAtual": "2026",
  "periodoComparativo": "2025"
}
```

**Exemplo de saida**

```json
{
  "indicadores": [
    {
      "nome": "taxaExecucao",
      "valorAtual": 0.82,
      "valorComparativo": 0.74
    }
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| INDICADOR_NAO_DISPONIVEL | Nao foi possivel calcular um ou mais indicadores consolidados para os periodos informados. |
| PERIODO_ANALITICO_INVALIDO | Os periodos informados para comparacao analitica sao invalidos. |

### ExportarRelatorioAnalitico

**Exemplo de entrada**

```json
{
  "tipoPainel": "BOLSAS_RESULTADOS",
  "formato": "PDF"
}
```

**Exemplo de saida**

```json
{
  "relatorioExportado": {
    "id": "RELBI-2026-008",
    "formato": "PDF"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FORMATO_EXPORTACAO_NAO_SUPORTADO | O formato solicitado nao e suportado pelo modulo de BI. |
| EXPORTACAO_ANALITICA_INDISPONIVEL | Nao foi possivel gerar a exportacao analitica neste momento. |

## Mapeamento de Transporte

- `Query`: `API interna a definir`.
- `AtualizarPaineisAnaliticos`: `job agendado a definir`.
- `ExportarRelatorioAnalitico`: `API interna/backoffice a definir`.

## Eventos e Efeitos Colaterais

- `AtualizarPaineisAnaliticos` consolida os dados consumidos pelos demais comandos e consultas analiticas.
- `ExportarRelatorioAnalitico` gera artefato persistente consultavel pelo usuario.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
