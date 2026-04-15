# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M008 como contexto responsavel pelos cadastros corporativos compartilhados da plataforma: pessoas, instituicoes, unidades organizacionais, areas tecnicas, dirigentes e referencias basicas.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Todos os modulos operacionais | Consultam pessoas, instituicoes, unidades, areas tecnicas e rubricas como referencia canonica |
| Autenticacao / Acesso Cidadao | Sincroniza cadastros de pessoas por CPF |
| Analista da Agencia de Fomento | Mantem a base cadastral corporativa |
| [Portal Coordenador](../../../products/portal-coordenador/README.md) | Gestao de perfil e dados pessoais ([EP-04](../../../products/portal-coordenador/features/EP-04-gestao-perfil-usuario.md)) |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| Acesso Cidadao | Sistema externo | Origem de eventos de cadastro automatico de pessoa |
| Base territorial/corporativa | Cadastro externo | Pode fornecer dados de cidade, regiao e classificacoes de referencia |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Recusas/erros | Idempotencia | Autorizacao | Mapeamento de transporte |
|------------------|------|----------|---------|-------|---------------------|---------------|---------------|--------------|-------------|--------------------------|
| CadastrarOuAtualizarPessoaFisica | Command | Criar ou atualizar pessoa fisica canonical da plataforma | cpf, nome, email, dados basicos | `PessoaFisica` criada/atualizada | RN01, RN05, RN10 | CPF informado | CPF duplicado, dados invalidos | Sim por CPF | Analista da Agencia de Fomento | API interna/backoffice a definir |
| AlterarEstadoPessoaFisica | Command | Suspender ou reativar pessoa com justificativa quando aplicavel | pessoa, novoEstado, justificativa | `PessoaFisica` atualizada | RN05, RI2 | Pessoa existente | Reativacao sem justificativa, pessoa inexistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CadastrarInstituicaoComUnidadeOrganizacional | Command | Registrar instituicao e sua estrutura minima de unidade organizacional | cnpj, nome, unidades | `Instituicao` registrada | RN02, RN03, RN08 | CNPJ informado | CNPJ duplicado, hierarquia invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarDirigente | Command | Registrar dirigente com unidade e mandato | pessoa, unidade, tipoDirigente, dataInicio, dataFim | `Dirigente` criado/atualizado | RN04, RI1 | Pessoa e unidade existentes | Mandato sobreposto, unidade inexistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| SincronizarPessoaViaAcessoCidadao | Event Consumed | Criar ou vincular pessoa automaticamente a partir do Acesso Cidadao | cpf, nome, email, origem | `PessoaFisica` criada/vinculada | RN10 | Evento recebido com CPF valido | CPF invalido, inconsistencias cadastrais | Sim por CPF e origem do evento | Sistema | Evento/mensagem interna a definir |
| ConsultarCadastrosCorporativos | Query | Consultar pessoas, instituicoes, unidades, areas tecnicas e referencias basicas | tipoCadastro, filtros | Lista ou detalhe cadastral | RN01, RN02, RN03, RN08, RN09 | Filtro informado | Cadastro nao encontrado | N/A | Modulo interno autorizado ou analista | API interna a definir |

## Padrao de Payload e Erro

- Os JSON abaixo sao exemplos ilustrativos do contrato de aplicacao do modulo.
- O modulo e dono dos cadastros corporativos; serializacao concreta e endpoint continuam `a definir`.

**Envelope de erro sugerido**

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem de erro legivel para operador ou modulo consumidor.",
    "details": {
      "cpf": "000.000.000-00"
    }
  }
}
```

## Exemplos JSON por Operacao

### CadastrarOuAtualizarPessoaFisica

**Exemplo de entrada**

```json
{
  "cpf": "123.456.789-00",
  "nome": "Maria Oliveira",
  "email": "maria@exemplo.br"
}
```

**Exemplo de saida**

```json
{
  "pessoaFisica": {
    "id": "PES-2026-001",
    "estado": "ATIVA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CPF_DUPLICADO | Ja existe uma pessoa cadastrada com o CPF informado. |
| PESSOA_DADOS_INVALIDOS | Os dados da pessoa fisica sao invalidos ou incompletos. |

### AlterarEstadoPessoaFisica

**Exemplo de entrada**

```json
{
  "pessoaId": "PES-2026-001",
  "novoEstado": "SUSPENSA",
  "justificativa": "Irregularidade cadastral identificada."
}
```

**Exemplo de saida**

```json
{
  "pessoaFisica": {
    "id": "PES-2026-001",
    "estado": "SUSPENSA"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PESSOA_NAO_ENCONTRADA | A pessoa informada nao foi encontrada. |
| REATIVACAO_SEM_JUSTIFICATIVA | Nao e permitido reativar pessoa suspensa sem justificativa registrada. |

### CadastrarInstituicaoComUnidadeOrganizacional

**Exemplo de entrada**

```json
{
  "cnpj": "12.345.678/0001-90",
  "nome": "Agencia de Fomento do Estado",
  "unidades": [
    {
      "codigo": "AT-DGPP-01",
      "nome": "Area Tecnica DGPP",
      "tipo": "AREA_TECNICA"
    }
  ]
}
```

**Exemplo de saida**

```json
{
  "instituicao": {
    "id": "INST-2026-010",
    "nome": "Agencia de Fomento do Estado"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CNPJ_DUPLICADO | Ja existe uma instituicao cadastrada com o CNPJ informado. |
| UNIDADE_HIERARQUIA_INVALIDA | A estrutura de unidades informada e invalida para a instituicao. |

### RegistrarDirigente

**Exemplo de entrada**

```json
{
  "pessoaId": "PES-2026-001",
  "unidadeId": "AT-DGPP-01",
  "tipoDirigente": "DIRETOR",
  "dataInicio": "2026-01-01",
  "dataFim": "2026-12-31"
}
```

**Exemplo de saida**

```json
{
  "dirigente": {
    "id": "DIR-2026-003",
    "tipoDirigente": "DIRETOR"
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| MANDATO_SOBREPOSTO | Ja existe mandato ativo para a mesma unidade no periodo informado. |
| UNIDADE_ORGANIZACIONAL_NAO_ENCONTRADA | A unidade organizacional informada nao foi encontrada. |

### SincronizarPessoaViaAcessoCidadao

**Exemplo de entrada**

```json
{
  "origem": "ACESSO_CIDADAO",
  "cpf": "123.456.789-00",
  "nome": "Maria Oliveira",
  "email": "maria@exemplo.br"
}
```

**Exemplo de saida**

```json
{
  "pessoaFisica": {
    "id": "PES-2026-001",
    "vinculadaPorCpf": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CPF_INVALIDO | O CPF recebido no evento do Acesso Cidadao e invalido. |
| EVENTO_CADASTRAL_INCONSISTENTE | O evento recebido nao possui dados suficientes para sincronizacao. |

### ConsultarCadastrosCorporativos

**Exemplo de entrada**

```json
{
  "tipoCadastro": "AREA_TECNICA",
  "filtros": {
    "instituicaoId": "INST-2026-010"
  }
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "id": "AT-DGPP-01",
      "nome": "Area Tecnica DGPP"
    }
  ],
  "total": 1
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CADASTRO_NAO_ENCONTRADO | Nenhum cadastro foi encontrado para o filtro informado. |
| TIPO_CADASTRO_INVALIDO | O tipo de cadastro informado nao e suportado por esta consulta. |

## Mapeamento de Transporte

- `Command` e `Query`: `API interna/backoffice a definir`.
- `SincronizarPessoaViaAcessoCidadao`: `evento/mensagem interna a definir`.

## Eventos e Efeitos Colaterais

- `AlterarEstadoPessoaFisica` afeta a elegibilidade de operacoes em modulos consumidores.
- `CadastrarInstituicaoComUnidadeOrganizacional` consolida a hierarquia corporativa e a relacao entre instituicao, unidade e area tecnica.
- `SincronizarPessoaViaAcessoCidadao` cria ou vincula pessoa pelo CPF sem duplicidade.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
