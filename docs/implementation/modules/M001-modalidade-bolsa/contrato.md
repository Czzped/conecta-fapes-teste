# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M001 como bounded context responsavel por resolucoes, modalidades, versoes, niveis e requisitos de bolsa. O foco aqui e explicitar os servicos de aplicacao do modulo, sem redefinir o dominio descrito no `README.md`.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Analista da Agencia de Fomento | Cadastra, versiona, publica e consulta resolucoes, modalidades e niveis |
| M003 | Referencia `VersaoNivel` para cotas de edital e alocacoes |
| M004 | Referencia `VersaoNivel` para pagamentos e `VersaoModalidade` para bonus (relacao N:N com BonusPagamento) |
| M009 | Referencia `VersaoNivel` para formalizacao de bolsas |
| M013 | Referencia `VersaoNivel` para orcamento de bolsas |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| Cadastro de Moeda | Cadastro corporativo | `Moeda` existe no modelo estrutural como referencia fora do escopo do modulo |
| Modulos consumidores de bolsas | Modulo interno | Consomem `VersaoModalidade` e `VersaoNivel` como referencia canonica |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| CriarResolucao | Command | Registrar a base legal para modalidades de bolsa | numero, data, ementa, url | Resolucao criada | RN01, RN02 | Numero ainda nao cadastrado | Numero duplicado, campos obrigatorios ausentes | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ListarOuConsultarResolucoes | Query | Localizar resolucoes e consultar seus detalhes | filtros, identificador da resolucao | Lista ou detalhe de Resolucao | RN01, RN02 | Nenhuma | Resolucao inexistente | N/A | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CriarModalidade | Command | Registrar uma modalidade e sua primeira versao em edicao | sigla, nome, resolucao, descricao, dataInicioVigencia, requisitos iniciais | ModalidadeBolsa e VersaoModalidade criadas | RN01, RN03, RN06, RI1 | Resolucao cadastrada | Resolucao inexistente, sigla duplicada, dados obrigatorios ausentes | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CriarVersaoModalidade | Command | Abrir nova versao de modalidade preservando historico | identificador da modalidade, resolucao, dataInicioVigencia | VersaoModalidade em edicao com niveis e requisitos copiados | RN04, RN05, RN06, RI1 | Modalidade existente e sem outra versao em edicao | Modalidade inexistente, ja existe versao em edicao | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| PublicarVersaoModalidade | Command | Ativar uma versao em edicao e inativar a anterior | identificador da versao | VersaoModalidade ativa e historico de vigencia atualizado | RN08, RN11 | Versao existente no estado `EM_EDICAO` | Versao inexistente, versao nao esta em edicao | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConsultarModalidadeVigente | Query | Obter a versao ativa de uma modalidade para uso operacional | sigla da modalidade ou identificador | VersaoModalidade ativa com dados de vigencia | RN08, RN11 | Modalidade cadastrada | Modalidade inexistente, modalidade sem versao ativa | N/A | Analista da Agencia de Fomento ou modulo interno autorizado | API interna a definir |
| RegistrarNivelDaVersao | Command | Criar ou atualizar a versao de um nivel dentro de uma versao de modalidade em edicao | versaoModalidade, siglaNivel, valor, moeda, requisitos | VersaoNivel registrada | RN03, RN05, RN07, RN10, RI2 | VersaoModalidade em edicao | Versao de modalidade nao editavel, nivel duplicado na mesma versao, moeda invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ListarNiveisERequisitosDaVersao | Query | Consultar niveis, valores, moedas e requisitos de uma versao | identificador da versao ou filtro por modalidade | Lista detalhada de VersaoNivel e RequisitoBolsa | RN03, RN06, RN07, RN10 | Versao cadastrada | Versao inexistente | N/A | Analista da Agencia de Fomento ou modulo interno autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- Os nomes de campos representam a intencao de negocio; endpoint, controller e serializacao concreta continuam `a definir`.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "campo": "valor-relacionado-ao-erro"
    }
  }
}
```

## Exemplos JSON por Operacao

### CriarResolucao

**Exemplo de entrada**

```json
{
  "numero": 332,
  "data": "2026-03-17",
  "ementa": "Atualiza as modalidades de bolsa de pesquisa e inovacao.",
  "url": "https://agencia.gov.br/resolucoes/332-2026"
}
```

**Exemplo de saida**

```json
{
  "resolucao": {
    "id": "RES-332-2026",
    "numero": 332,
    "data": "2026-03-17",
    "ementa": "Atualiza as modalidades de bolsa de pesquisa e inovacao.",
    "url": "https://agencia.gov.br/resolucoes/332-2026"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| RESOLUCAO_NUMERO_DUPLICADO | Ja existe uma resolucao cadastrada com o numero informado. |
| RESOLUCAO_DADOS_INVALIDOS | Os dados obrigatorios da resolucao nao foram informados corretamente. |

### ListarOuConsultarResolucoes

**Exemplo de entrada**

```json
{
  "filtros": {
    "numero": 332,
    "dataInicio": "2026-01-01",
    "dataFim": "2026-12-31"
  }
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "id": "RES-332-2026",
      "numero": 332,
      "data": "2026-03-17",
      "ementa": "Atualiza as modalidades de bolsa de pesquisa e inovacao."
    }
  ],
  "total": 1
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| RESOLUCAO_NAO_ENCONTRADA | Nenhuma resolucao foi encontrada para o filtro informado. |
| FILTRO_RESOLUCAO_INVALIDO | Os filtros informados para consulta de resolucao sao invalidos. |

### CriarModalidade

**Exemplo de entrada**

```json
{
  "sigla": "BPIG",
  "nome": "Bolsa de Pesquisa e Inovacao em Governo",
  "resolucaoId": "RES-332-2026",
  "descricao": "Bolsa destinada a projetos estrategicos de governo.",
  "dataInicioVigencia": "2026-04-01",
  "requisitosIniciais": [
    {
      "tipo": "QUALIFICACAO",
      "descricao": "Possuir titulacao minima exigida pela resolucao."
    }
  ]
}
```

**Exemplo de saida**

```json
{
  "modalidade": {
    "id": "MOD-BPIG",
    "sigla": "BPIG",
    "nome": "Bolsa de Pesquisa e Inovacao em Governo"
  },
  "versaoModalidade": {
    "id": "VM-BPIG-2026-01",
    "sigla": "BPIG-2026",
    "estado": "EM_EDICAO",
    "dataInicioVigencia": "2026-04-01"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| RESOLUCAO_NAO_ENCONTRADA | A resolucao informada para a modalidade nao foi encontrada. |
| MODALIDADE_SIGLA_DUPLICADA | Ja existe uma modalidade cadastrada com a sigla informada. |
| MODALIDADE_DADOS_INVALIDOS | Os dados obrigatorios da modalidade nao foram informados corretamente. |

### CriarVersaoModalidade

**Exemplo de entrada**

```json
{
  "modalidadeId": "MOD-BPIG",
  "resolucaoId": "RES-332-2026",
  "dataInicioVigencia": "2026-07-01"
}
```

**Exemplo de saida**

```json
{
  "versaoModalidade": {
    "id": "VM-BPIG-2026-02",
    "sigla": "BPIG-2026",
    "estado": "EM_EDICAO",
    "dataInicioVigencia": "2026-07-01",
    "copiadaDaVersaoId": "VM-BPIG-2026-01"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| MODALIDADE_NAO_ENCONTRADA | A modalidade informada nao foi encontrada. |
| VERSAO_EM_EDICAO_EXISTENTE | Ja existe uma versao em edicao para a modalidade informada. |
| DATA_VIGENCIA_INVALIDA | A data de inicio de vigencia da nova versao e invalida. |

### PublicarVersaoModalidade

**Exemplo de entrada**

```json
{
  "versaoModalidadeId": "VM-BPIG-2026-02"
}
```

**Exemplo de saida**

```json
{
  "versaoModalidade": {
    "id": "VM-BPIG-2026-02",
    "estado": "ATIVA",
    "dataInicioVigencia": "2026-07-01"
  },
  "versaoAnteriorInativada": "VM-BPIG-2026-01"
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| VERSAO_MODALIDADE_NAO_ENCONTRADA | A versao de modalidade informada nao foi encontrada. |
| VERSAO_MODALIDADE_ESTADO_INVALIDO | Somente versoes em edicao podem ser publicadas. |
| VERSAO_MODALIDADE_INCONSISTENTE | A versao nao atende aos requisitos minimos para publicacao. |

### ConsultarModalidadeVigente

**Exemplo de entrada**

```json
{
  "siglaModalidade": "BPIG"
}
```

**Exemplo de saida**

```json
{
  "versaoModalidade": {
    "id": "VM-BPIG-2026-02",
    "sigla": "BPIG-2026",
    "descricao": "Bolsa destinada a projetos estrategicos de governo.",
    "estado": "ATIVA",
    "dataInicioVigencia": "2026-07-01",
    "dataFimVigencia": null
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| MODALIDADE_NAO_ENCONTRADA | A modalidade informada nao foi encontrada. |
| MODALIDADE_SEM_VERSAO_ATIVA | A modalidade informada ainda nao possui versao ativa. |

### RegistrarNivelDaVersao

**Exemplo de entrada**

```json
{
  "versaoModalidadeId": "VM-BPIG-2026-02",
  "siglaNivel": "BPIG-I",
  "valor": 5200.0,
  "moeda": "BRL",
  "requisitos": [
    {
      "tipo": "VINCULO",
      "descricao": "Nao possuir vinculo incompatavel com a bolsa."
    }
  ]
}
```

**Exemplo de saida**

```json
{
  "versaoNivel": {
    "id": "VN-BPIG-I-2026-02",
    "siglaNivel": "BPIG-I",
    "valor": 5200.0,
    "moeda": "BRL"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| VERSAO_MODALIDADE_NAO_EDITAVEL | A versao de modalidade informada nao esta em edicao. |
| NIVEL_DUPLICADO_NA_VERSAO | Ja existe um nivel com a sigla informada nesta versao. |
| MOEDA_INVALIDA | A moeda informada nao esta cadastrada ou nao pode ser usada. |

### ListarNiveisERequisitosDaVersao

**Exemplo de entrada**

```json
{
  "versaoModalidadeId": "VM-BPIG-2026-02"
}
```

**Exemplo de saida**

```json
{
  "versaoModalidadeId": "VM-BPIG-2026-02",
  "niveis": [
    {
      "siglaNivel": "BPIG-I",
      "valor": 5200.0,
      "moeda": "BRL",
      "requisitos": [
        {
          "tipo": "VINCULO",
          "descricao": "Nao possuir vinculo incompatavel com a bolsa."
        }
      ]
    }
  ]
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| VERSAO_MODALIDADE_NAO_ENCONTRADA | A versao de modalidade informada nao foi encontrada. |
| VERSAO_MODALIDADE_SEM_NIVEIS | A versao de modalidade informada ainda nao possui niveis cadastrados. |

## Mapeamento de Transporte

- Nesta rodada, todas as operacoes de `Command` e `Query` ficam mapeadas como `API interna/backoffice a definir`.
- O contrato nao fixa endpoints HTTP, nomes de handlers ou classes concretas.
- Nenhum evento publico estavel foi fixado para M001 nesta rodada.

## Eventos e Efeitos Colaterais

- `CriarVersaoModalidade` deve copiar niveis e requisitos da versao ativa para a nova versao em edicao.
- `PublicarVersaoModalidade` deve inativar automaticamente a versao anterior e bloquear edicao futura da versao publicada.
- `RegistrarNivelDaVersao` deve manter a relacao correta entre `NivelBolsa`, `VersaoNivel`, `Moeda` e `RequisitoBolsa`.
- `ConsultarModalidadeVigente` expoe a referencia canonica consumida por modulos que dependem de modalidade e nivel de bolsa.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- EPICs: [EPIC-M001-001](epics/EPIC-M001-001.md), [EPIC-M001-002](epics/EPIC-M001-002.md), [EPIC-M001-003](epics/EPIC-M001-003.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
