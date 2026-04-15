# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M003 como bounded context operacional de edital, iniciativa, projeto, cota e alocacao de bolsista. O foco aqui e explicitar comandos e consultas do modulo sem redefinir o dominio ja descrito no `README.md`.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Analista da Agencia de Fomento | Registra editais, projetos, cotas e alocacoes operacionais |
| M002 | Sincroniza dados legados do SigFapes para entidades canonicamente gerenciadas por M003 |
| M011, M012, M015 e modulos correlatos | Consultam edital, projeto e alocacao como referencias operacionais |
| [Portal Coordenador](../../../products/portal-coordenador/README.md) | Contexto de projeto, equipe, cadastro de bolsista ([EP-02](../../../products/portal-coordenador/features/EP-02-shell-portal-contexto-projeto.md), [EP-06](../../../products/portal-coordenador/features/EP-06-meu-projeto.md), [EP-07](../../../products/portal-coordenador/features/EP-07-minha-equipe-acompanhamento-bolsas.md), [EP-08](../../../products/portal-coordenador/features/EP-08-cadastro-edicao-bolsista.md)) |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M010 | Modulo interno | Fornece `Programa` e `Parceria` como referencias externas do edital |
| M008 | Modulo interno | Fornece `AreaTecnica` e `PessoaFisica` |
| M001 | Modulo interno | Fornece `VersaoNivel` referenciada por `CotaEdital` |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| RegistrarEditalOperacional | Command | Criar ou atualizar o edital operacional com sua area tecnica e vinculos de programa/parceria | codigo, titulo, tipo, areaTecnica, programa, parceria | `Edital` persistido | RN01, RN07 | AreaTecnica informada | AreaTecnica inexistente, edital inconsistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarProjetoDoEdital | Command | Registrar o projeto concreto vinculado a um edital | editalId, titulo, resumo, coordenador, datas | `Projeto` criado | RN02, RN03, RN06 | Edital existente | Edital inexistente, coordenador invalido | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarCotaEdital | Command | Cadastrar cotas de bolsa do edital por versao de nivel | editalId, versaoNivel, quantidadeTotal | `CotaEdital` criada | RN04 | Edital existente e versao de nivel valida | VersaoNivel inexistente, quantidade invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarAlocacaoBolsista | Command | Registrar a alocacao operacional de um bolsista consumindo uma cota do edital | projetoId, cotaEdital, orientador, bolsista, datas | `AlocacaoBolsista` criada | RN05, RN06 | Projeto e cota existentes | Cota indisponivel, orientador invalido, bolsista invalido | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConsultarVisaoOperacionalDoEdital | Query | Consultar a visao consolidada do edital com projetos, cotas e alocacoes | editalId ou codigo | Visao operacional do edital | RN01, RN02, RN04, RN05 | Edital existente | Edital nao encontrado | N/A | Analista da Agencia de Fomento ou modulo interno autorizado | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- Os exemplos mostram a intencao operacional do bounded context; endpoint, handler e serializacao concreta continuam `a definir`.

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

### RegistrarEditalOperacional

**Exemplo de entrada**

```json
{
  "codigo": "EDT-2026-001",
  "titulo": "Edital Pesquisa Aplicada 2026",
  "tipo": "DEMANDA_PUBLICA",
  "areaTecnicaId": "AT-DGPP-01",
  "programaId": "PROG-2026-01",
  "parceriaId": "PAR-2026-03"
}
```

**Exemplo de saida**

```json
{
  "edital": {
    "id": "EDT-2026-001",
    "estado": "EM_CONFIGURACAO"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| AREA_TECNICA_NAO_ENCONTRADA | A area tecnica informada para o edital nao foi encontrada. |
| EDITAL_OPERACIONAL_INVALIDO | Os dados operacionais do edital sao invalidos ou incompletos. |

### RegistrarProjetoDoEdital

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001",
  "titulo": "Projeto Laboratorio de Dados Publicos",
  "resumo": "Projeto para estruturacao de laboratorio institucional.",
  "coordenadorId": "COD-2026-011",
  "dataInicio": "2026-05-01",
  "dataFim": "2027-04-30"
}
```

**Exemplo de saida**

```json
{
  "projeto": {
    "id": "PROJ-2026-014",
    "estado": "CONTRATADA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| EDITAL_NAO_ENCONTRADO | O edital informado para o projeto nao foi encontrado. |
| COORDENADOR_INVALIDO | O coordenador informado nao e valido para o contexto operacional. |

### RegistrarCotaEdital

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001",
  "versaoNivelId": "VN-BPIG-I-2026-02",
  "quantidadeTotal": 12
}
```

**Exemplo de saida**

```json
{
  "cotaEdital": {
    "id": "COT-2026-001",
    "quantidadeDisponivel": 12
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| VERSAO_NIVEL_NAO_ENCONTRADA | A versao de nivel informada para a cota nao foi encontrada. |
| COTA_EDITAL_QUANTIDADE_INVALIDA | A quantidade total da cota deve ser maior que zero. |

### RegistrarAlocacaoBolsista

**Exemplo de entrada**

```json
{
  "projetoId": "PROJ-2026-014",
  "cotaEditalId": "COT-2026-001",
  "orientadorId": "ORI-2026-004",
  "bolsistaId": "BOL-2026-009",
  "dataInicio": "2026-06-01",
  "dataFimPrevista": "2027-05-31"
}
```

**Exemplo de saida**

```json
{
  "alocacaoBolsista": {
    "id": "ALC-2026-020",
    "estado": "EM_ANALISE"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| COTA_EDITAL_INDISPONIVEL | A cota informada nao possui disponibilidade para nova alocacao. |
| PAPEL_OPERACIONAL_INVALIDO | O orientador ou bolsista informado nao e valido para a alocacao. |

### ConsultarVisaoOperacionalDoEdital

**Exemplo de entrada**

```json
{
  "editalId": "EDT-2026-001"
}
```

**Exemplo de saida**

```json
{
  "edital": {
    "id": "EDT-2026-001",
    "titulo": "Edital Pesquisa Aplicada 2026"
  },
  "projetos": 8,
  "cotas": 3,
  "alocacoes": 14
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| EDITAL_NAO_ENCONTRADO | O edital informado nao foi encontrado para consulta operacional. |
| VISAO_OPERACIONAL_INDISPONIVEL | Nao foi possivel montar a visao operacional do edital neste momento. |

## Mapeamento de Transporte

- Todas as operacoes deste contrato ficam mapeadas como `API interna/backoffice a definir`.
- O contrato nao fixa endpoint HTTP, controller ou classe concreta.

## Eventos e Efeitos Colaterais

- `RegistrarEditalOperacional` consolida o ownership do edital em M003 mesmo quando houver origem legada em M002.
- `RegistrarProjetoDoEdital` cria a iniciativa concreta `Projeto` dentro do bounded context.
- `RegistrarCotaEdital` disponibiliza cotas consumidas por alocacoes e, posteriormente, por bolsas em M009.
- `RegistrarAlocacaoBolsista` reduz a disponibilidade operacional da cota correspondente.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: a definir no M003
