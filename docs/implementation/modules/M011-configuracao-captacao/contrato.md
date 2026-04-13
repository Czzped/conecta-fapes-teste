# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M011 como contexto de configuracao do edital, incluindo cronograma, formularios, parametros de fomento e revisores ad hoc.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Analista da Agencia de Fomento | Configura cronograma, formularios e parametros do edital |
| M003 | Consome o resultado da validacao de prontidao para publicacao |
| Revisores ad hoc | Sao associados operacionalmente aos editais configurados |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M003 | Modulo interno | Fornece `Edital` como entidade externa canonicamente gerenciada |
| M010 | Modulo interno | Fornece `Programa` e `Parceria` para parametros de fomento |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| ConfigurarCronogramaDoEdital | Command | Registrar ou versionar periodos do cronograma do edital | edital, periodos, versao | `Cronograma` persistido | RN01, RN05, RN09 | Edital existente | Sequencia de datas invalida, edital nao encontrado | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| PublicarVersaoFormularioSubmissao | Command | Publicar nova versao do formulario de submissao do edital | edital, campos, versao | `VersaoFormulario` publicada | RN06, RI2 | Edital existente | Formulario ativo duplicado, formulario invalido | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| PublicarVersaoFormularioAvaliacao | Command | Publicar nova versao do formulario de avaliacao do edital | edital, campos, versao | `VersaoFormulario` publicada | RN02, RN06 | Edital existente | Inicio da avaliacao sem formulario, formulario invalido | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConfigurarParametrosDeFomento | Command | Registrar parametros de cota, orcamento e distribuicao por area | edital, orcamento, cotasArea, parametros | `ParametroFomento` persistido | RN07, RN08 | Edital existente | Orcamento insuficiente, soma por area inconsistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| AssociarRevisorAdHoc | Command | Associar revisor ad hoc ao edital com validacao de conflito | edital, revisor, instituicao | `RevisorAdHoc` associado | RN03, RI1 | Edital existente | Conflito de interesses, revisor duplicado | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ValidarConfiguracaoDoEdital | Query | Validar se o edital possui configuracao minima para publicacao operacional | edital | Checklist de prontidao | RN01, RN02, RN04, RN08, RN09 | Edital existente | Edital nao encontrado | N/A | Analista da Agencia de Fomento ou modulo interno autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa endpoint, builder de formulario nem mecanismo concreto de versionamento.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "edital": "EDT-2026-001"
    }
  }
}
```

## Exemplos JSON por Operacao

### ConfigurarCronogramaDoEdital

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001",
  "periodos": [
    {
      "tipo": "SUBMISSAO",
      "inicio": "2026-06-01",
      "fim": "2026-06-30"
    }
  ],
  "versao": 1
}
```

**Exemplo de saida**

```json
{
  "cronograma": {
    "id": "CRON-2026-001",
    "versao": 1
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CRONOGRAMA_SEQUENCIA_INVALIDA | Os periodos do cronograma nao respeitam a sequencia exigida pelo edital. |
| EDITAL_NAO_ENCONTRADO | O edital informado nao foi encontrado para configuracao do cronograma. |

### PublicarVersaoFormularioSubmissao

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001",
  "versao": 2,
  "campos": [
    "titulo",
    "resumo",
    "orcamento"
  ]
}
```

**Exemplo de saida**

```json
{
  "versaoFormulario": {
    "id": "VFS-2026-002",
    "tipo": "SUBMISSAO",
    "publicada": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FORMULARIO_SUBMISSAO_DUPLICADO | Nao pode haver dois formularios de submissao ativos simultaneamente. |
| FORMULARIO_SUBMISSAO_INVALIDO | A estrutura do formulario de submissao e invalida. |

### PublicarVersaoFormularioAvaliacao

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001",
  "versao": 1,
  "campos": [
    "aderencia",
    "merito",
    "viabilidade"
  ]
}
```

**Exemplo de saida**

```json
{
  "versaoFormulario": {
    "id": "VFA-2026-001",
    "tipo": "AVALIACAO",
    "publicada": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| FORMULARIO_AVALIACAO_OBRIGATORIO | O edital precisa possuir formulario de avaliacao antes da fase de merito. |
| FORMULARIO_AVALIACAO_INVALIDO | A estrutura do formulario de avaliacao e invalida. |

### ConfigurarParametrosDeFomento

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001",
  "orcamentoTotal": 800000.0,
  "cotasArea": [
    {
      "area": "Tecnologia",
      "valor": 500000.0
    }
  ]
}
```

**Exemplo de saida**

```json
{
  "parametroFomento": {
    "editalId": "EDT-2026-001",
    "orcamentoTotal": 800000.0
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| ORCAMENTO_EDITAL_INSUFICIENTE | O orcamento total do edital e inferior ao valor distribuido por area. |
| COTA_AREA_INVALIDA | Uma ou mais cotas por area estao invalidas para o edital informado. |

### AssociarRevisorAdHoc

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001",
  "revisorCpf": "123.456.789-00",
  "instituicaoId": "INST-2026-090"
}
```

**Exemplo de saida**

```json
{
  "revisorAdHoc": {
    "id": "REV-2026-010",
    "editalId": "EDT-2026-001"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CONFLITO_INTERESSE_REVISOR | O revisor ad hoc nao pode avaliar propostas da propria instituicao. |
| REVISOR_DUPLICADO_NO_EDITAL | O revisor informado ja esta associado ao edital. |

### ValidarConfiguracaoDoEdital

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001"
}
```

**Exemplo de saida**

```json
{
  "prontoParaPublicacao": true,
  "pendencias": []
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| EDITAL_NAO_ENCONTRADO | O edital informado nao foi encontrado para validacao. |
| CONFIGURACAO_EDITAL_INCOMPLETA | O edital ainda possui pendencias de cronograma, formulario ou parametro obrigatorio. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Nenhum endpoint ou mecanismo concreto de versionamento foi estabilizado nesta rodada.

## Eventos e Efeitos Colaterais

- `ConfigurarCronogramaDoEdital` define os periodos que condicionam submissao e avaliacao.
- `PublicarVersaoFormularioSubmissao` e `PublicarVersaoFormularioAvaliacao` bloqueiam alteracao direta da versao publicada.
- `ValidarConfiguracaoDoEdital` fornece a prontidao consumida antes da publicacao operacional em M003.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
