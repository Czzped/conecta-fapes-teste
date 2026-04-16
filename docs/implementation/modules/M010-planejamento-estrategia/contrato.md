# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M010 como contexto responsavel por plano estrategico, eixos, programas, parcerias e recursos associados ao fomento.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Diretoria e Analista da Agencia de Fomento | Mantem planejamento, programas e parcerias |
| M003 e M011 | Referenciam programa e parceria no ciclo de edital |
| M016, M018 e M019 | Consomem referencias para contabilidade, BI e transparencia |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece `Pessoa`, `Instituicao`, `UnidadeOrganizacional`, `TipoInstituicao` e `Finalidade` |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| RegistrarPlanoEstrategico | Command | Criar ou atualizar plano estrategico com sua vigencia | nome, descricao, dataInicio, dataFim | `PlanoEstrategico` persistido | RN08, RN09 | Vigencia informada | Plano ativo duplicado, vigencia invalida | Nao | Diretoria autorizada | API interna/backoffice a definir |
| CriarPrograma | Command | Registrar programa associado a eixos estrategicos | nome, eixo, resumo, dataInicio, dataFim | `Programa` criado | RN01, RN02, RI1 | Eixo estrategico existente | Programa sem eixo | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CriarParceria | Command | Registrar parceria com vigencia, objetivo e finalidade | nome, numeroDProcesso, dataAssinatura, vigenciaInicio, vigenciaFim, objetivo, finalidadeId, unidadeResponsavelId | `Parceria` criada | RN03, RN05, RN06, RI2 | Finalidade e UnidadeOrganizacional informadas | Finalidade inexistente, vigencia invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarAporteFinanceiro | Command | Registrar aporte financeiro com origem em instituicao | parceriaId, instituicaoId, valorInvestido, dataAporte | `AporteFinanceiro` registrado | RN03, RN04 | Parceria com dataAssinatura preenchida | Parceria sem acordo assinado, instituicao inexistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarCoordenacao | Command | Registrar coordenacao temporal entre pessoa e parceria | parceriaId, pessoaId, dataInicio, dataFim | `Coordenacao` registrada | — | Parceria e Pessoa existentes | Parceria inexistente, pessoa inexistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConsultarPortfolioEstrategico | Query | Consultar plano, programas, parcerias e aportes consolidados | plano, programa, parceria, estado | Portfolio consolidado | RN01, RN02, RN09 | Filtro informado | Nenhum registro encontrado | N/A | Diretoria ou analista autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O contrato nao fixa endpoint, serializacao ou armazenamento de documentos.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "programa": "PROG-2026-01"
    }
  }
}
```

## Exemplos JSON por Operacao

### RegistrarPlanoEstrategico

**Exemplo de entrada**

```json
{
  "nome": "Plano Estrategico 2026-2029",
  "descricao": "Diretrizes para o ciclo de fomento 2026-2029.",
  "dataInicio": "2026-01-01",
  "dataFim": "2029-12-31",
  "estado": "ATIVO"
}
```

**Exemplo de saida**

```json
{
  "planoEstrategico": {
    "id": "PE-2026-01",
    "estado": "ATIVO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PLANO_ATIVO_DUPLICADO | Ja existe outro plano estrategico ativo no periodo informado. |
| VIGENCIA_PLANO_INVALIDA | A vigencia informada para o plano estrategico e invalida. |

### CriarPrograma

**Exemplo de entrada**

```json
{
  "nome": "Programa de Dados Publicos",
  "eixos": [
    "EIXO-TRANSFORMACAO-DIGITAL"
  ],
  "resumo": "Programa voltado a projetos de dados e inovacao.",
  "beneficios": [
    "Amplia capacidade analitica do estado."
  ]
}
```

**Exemplo de saida**

```json
{
  "programa": {
    "id": "PROG-2026-01",
    "estado": "EM_ESTRUTURACAO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PROGRAMA_SEM_EIXO | O programa deve estar vinculado a pelo menos um eixo estrategico. |
| EIXO_ESTRATEGICO_NAO_ENCONTRADO | Um dos eixos informados nao foi encontrado. |

### RegistrarRecursoDePrograma

**Exemplo de entrada**

```json
{
  "programaId": "PROG-2026-01",
  "origem": "TESOURO_ESTADUAL",
  "valor": 500000.0,
  "dataAporte": "2026-02-01",
  "documento": "DOC-2026-001"
}
```

**Exemplo de saida**

```json
{
  "recursoPrograma": {
    "id": "REC-2026-011",
    "valor": 500000.0
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| SALDO_FONTE_INSUFICIENTE | O valor informado excede o saldo disponivel da fonte de recursos. |
| DOCUMENTO_APORTE_OBRIGATORIO | O recurso do programa exige documento de origem ou descentralizacao. |

### CriarParceria

**Exemplo de entrada**

```json
{
  "nome": "Parceria Inovacao 2026",
  "instituicoes": [
    "INST-2026-010"
  ],
  "dataInicio": "2026-03-01",
  "dataFim": "2027-12-31",
  "objetivo": "Apoiar iniciativas de pesquisa aplicada."
}
```

**Exemplo de saida**

```json
{
  "parceria": {
    "id": "PAR-2026-03",
    "estado": "EM_NEGOCIACAO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_SEM_INSTITUICAO | A parceria deve ter ao menos uma instituicao participante. |
| VIGENCIA_PARCERIA_INVALIDA | A vigencia informada para a parceria e invalida. |

### RegistrarMovimentacaoDeParceria

**Exemplo de entrada**

```json
{
  "parceriaId": "PAR-2026-03",
  "tipoMovimentacao": "APORTE",
  "valor": 120000.0,
  "justificativa": "Aporte inicial da parceria.",
  "documento": "DOC-PAR-2026-010"
}
```

**Exemplo de saida**

```json
{
  "movimentacaoParceria": {
    "tipo": "APORTE",
    "valor": 120000.0
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARCERIA_NAO_VIGENTE | A parceria precisa estar vigente para registrar aporte financeiro. |
| DOCUMENTO_MOVIMENTACAO_OBRIGATORIO | E obrigatorio anexar documento comprobatorio para a movimentacao da parceria. |

### ConsultarPortfolioEstrategico

**Exemplo de entrada**

```json
{
  "estadoPrograma": "EM_ESTRUTURACAO",
  "estadoParceria": "EM_NEGOCIACAO"
}
```

**Exemplo de saida**

```json
{
  "programas": 4,
  "parcerias": 3,
  "valorTotalAportado": 620000.0
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PORTFOLIO_NAO_ENCONTRADO | Nenhum registro estrategico foi encontrado para os filtros informados. |
| FILTRO_PORTFOLIO_INVALIDO | Os filtros informados para o portfolio estrategico sao invalidos. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- Nenhum endpoint ou integracao documental foi estabilizado nesta rodada.

## Eventos e Efeitos Colaterais

- `CriarPrograma` disponibiliza referencia canonica para M003, M011, M016, M018 e M019.
- `RegistrarRecursoDePrograma` atualiza a capacidade financeira do programa para consumo pelos modulos dependentes.
- `RegistrarMovimentacaoDeParceria` altera o saldo vinculavel da parceria.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
