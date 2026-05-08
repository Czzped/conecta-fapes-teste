# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M008 como contexto responsavel pelos cadastros corporativos compartilhados da plataforma: pessoas, instituicoes, unidades organizacionais, responsaveis e referencias basicas.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Todos os modulos operacionais | Consultam pessoas, instituicoes, unidades organizacionais, responsaveis e referencias corporativas como base canonica |
| M003 - Gestao de Iniciativas Captadas | Consulta `TipoDiaria` e `ParametroCalculoDiaria` vigentes para calcular solicitacoes de diaria e gravar snapshots |
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
| CadastrarInstituicao | Command | Registrar instituicao juridica com CNPJ proprio, natureza publica/privada e eventual matriz | nome, sigla?, cnpj, razaoSocial, email, telefone?, endereco, isPublica, isExterna, instituicaoSuperiorId?, tipoInstituicaoId? | `Instituicao` registrada | RN02, RN12, RN14 | Nome e CNPJ informados; matriz (instituicaoSuperior) existente quando informada | CNPJ duplicado, matriz inexistente, dados invalidos | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CadastrarUnidadeOrganizacional | Command | Registrar unidade organizacional interna sem CNPJ vinculada a Instituicao ou outra UnidadeOrganizacional | nome, sigla?, descricao?, email?, telefone?, ativa, instituicaoPaiId?, unidadeSuperiorId? | `UnidadeOrganizacional` registrada | RN03, RN13, RN25, RI4 | Exatamente um entre instituicaoPaiId e unidadeSuperiorId informado | Parent inexistente, ambos parents informados, ausencia de parent, dados invalidos | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarResponsavel | Command | Registrar responsavel como vinculo temporal entre uma pessoa e uma Instituicao OU UnidadeOrganizacional | pessoaId, instituicaoId?, unidadeId?, dataInicio, dataFim | `Responsavel` criado/atualizado | RN04, RN11, RN26, RI1, RI3, RI5 | Pessoa existente; exatamente um entre instituicaoId e unidadeId informado | Mandato sobreposto, pessoa inexistente, alvo inexistente, ambos alvos informados, ausencia de alvo | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| SincronizarPessoaViaAcessoCidadao | Event Consumed | Criar ou vincular pessoa automaticamente a partir do Acesso Cidadao | cpf, nome, email, origem | `PessoaFisica` criada/vinculada | RN10 | Evento recebido com CPF valido | CPF invalido, inconsistencias cadastrais | Sim por CPF e origem do evento | Sistema | Evento/mensagem interna a definir |
| CadastrarRubrica | Command | Criar Rubrica canonica de custeio ou capital | codigo, nome, descricao, naturezaDespesa, ativa, rubricaPaiId? | `Rubrica` criada | RN07, RN16, RN17 | Codigo, nome, descricao, natureza da despesa e ativa informados | Codigo duplicado, rubrica pai inexistente, hierarquia invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| AtualizarRubrica | Command | Atualizar metadados, indicador ativa ou rubrica pai | rubricaId, dados atualizados, justificativa | `Rubrica` atualizada | RN16, RN17, RN18 | Rubrica existente | Rubrica inexistente, hierarquia invalida, justificativa ausente quando aplicavel | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| AlterarEstadoRubrica | Command | Ativar ou desativar Rubrica preservando historico | rubricaId, ativa, justificativa | `Rubrica` atualizada | RN18 | Rubrica existente | Rubrica inexistente, desativacao sem justificativa | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CadastrarAbrangenciaDiaria | Command | Criar ou atualizar abrangencia corporativa de diaria | codigo, nome, descricao?, ativo | `Abrangencia` criada/atualizada | RN22 | Codigo e nome informados | Codigo duplicado, dados invalidos | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CadastrarTipoDiaria | Command | Criar valor vigente de diaria por abrangencia | abrangenciaId, valorUnitario, vigenciaInicio, vigenciaFim?, ativo | `TipoDiaria` criado/atualizado | RN22, RN23 | Abrangencia existente e ativa; valor maior que zero; vigencia valida | Abrangencia inexistente/inativa, valor invalido, vigencia sobreposta | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CadastrarParametroCalculoDiaria | Command | Criar parametros normativos vigentes de calculo de diaria vinculados a um tipo de diaria | tipoDiariaId, normaReferencia, percentualDiariaSemPernoite, horasMinimasSemPernoite, horaLimiteRetornoAcrescimo?, percentualAcrescimoRetorno?, distanciaMinimaKm?, limiteDiasConsecutivos?, limiteDiariasMes?, percentualComplementoTransporte?, bloqueiaRegiaoMetropolitanaSemPernoite, bloqueiaMunicipioLimitrofeSemPernoite, vigenciaInicio, vigenciaFim?, ativo | `ParametroCalculoDiaria` criado/atualizado | RN24 | TipoDiaria existente; norma, vigencia e parametros obrigatorios informados | TipoDiaria inexistente, parametros invalidos, vigencia sobreposta para o mesmo tipo | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConsultarTipoDiariaVigente | Query | Obter diaria e parametros normativos vigentes para data de referencia e abrangencia | abrangenciaId, dataReferencia | `TipoDiaria` e `ParametroCalculoDiaria` vigentes | RN22, RN23, RN24 | Abrangencia existente e ativa | TipoDiaria vigente ausente, parametros de calculo ausentes | N/A | Modulo interno autorizado ou analista | API interna a definir |
| ConsultarCadastrosCorporativos | Query | Consultar pessoas, instituicoes, unidades organizacionais, responsaveis e referencias basicas | tipoCadastro, filtros | Lista ou detalhe cadastral | RN01, RN02, RN03, RN09, RN11, RN12, RN13, RN14, RN25, RN26 | Filtro informado | Cadastro nao encontrado | N/A | Modulo interno autorizado ou analista | API interna a definir |

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

### CadastrarInstituicao

**Exemplo de entrada**

```json
{
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "Universidade Federal do Espirito Santo",
  "nome": "UFES",
  "sigla": "UFES",
  "email": "ufes@ufes.br",
  "endereco": "Av. Fernando Ferrari, 514, Vitoria/ES",
  "isPublica": true,
  "isExterna": true,
  "instituicaoSuperiorId": null
}
```

**Exemplo de saida**

```json
{
  "instituicao": {
    "id": "INST-2026-010",
    "nome": "UFES",
    "cnpj": "12.345.678/0001-90",
    "instituicaoSuperiorId": null
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CNPJ_DUPLICADO | Ja existe uma instituicao cadastrada com o CNPJ informado. |
| CNPJ_OBRIGATORIO | Instituicao deve possuir CNPJ proprio. Use UnidadeOrganizacional para subdivisoes internas. |
| INSTITUICAO_SUPERIOR_NAO_ENCONTRADA | A instituicao matriz informada nao foi encontrada. |

### CadastrarUnidadeOrganizacional

**Exemplo de entrada**

```json
{
  "nome": "Centro Tecnologico",
  "sigla": "CT",
  "descricao": "Centro academico de engenharias e computacao",
  "ativa": true,
  "instituicaoPaiId": "INST-2026-010",
  "unidadeSuperiorId": null
}
```

**Exemplo de saida**

```json
{
  "unidade": {
    "id": "UO-2026-001",
    "nome": "Centro Tecnologico",
    "instituicaoPaiId": "INST-2026-010",
    "unidadeSuperiorId": null,
    "ativa": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| PARENT_AUSENTE | Informe instituicaoPaiId ou unidadeSuperiorId. |
| PARENT_AMBIGUO | Informe apenas um entre instituicaoPaiId e unidadeSuperiorId. |
| INSTITUICAO_PAI_NAO_ENCONTRADA | A instituicao pai informada nao foi encontrada. |
| UNIDADE_SUPERIOR_NAO_ENCONTRADA | A unidade superior informada nao foi encontrada. |

### RegistrarResponsavel

**Exemplo de entrada (responsavel de Instituicao)**

```json
{
  "pessoaId": "PES-2026-001",
  "instituicaoId": "INST-2026-010",
  "unidadeId": null,
  "dataInicio": "2026-01-01",
  "dataFim": "2026-12-31"
}
```

**Exemplo de entrada (responsavel de UnidadeOrganizacional)**

```json
{
  "pessoaId": "PES-2026-002",
  "instituicaoId": null,
  "unidadeId": "UO-2026-001",
  "dataInicio": "2026-01-01",
  "dataFim": "2026-12-31"
}
```

**Exemplo de saida**

```json
{
  "responsavel": {
    "id": "RESP-2026-003",
    "instituicaoId": "INST-2026-010",
    "unidadeId": null,
    "ativo": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| MANDATO_SOBREPOSTO | Ja existe responsavel ativo na entidade informada. |
| INSTITUICAO_NAO_ENCONTRADA | A instituicao informada nao foi encontrada. |
| UNIDADE_NAO_ENCONTRADA | A unidade organizacional informada nao foi encontrada. |
| ALVO_AUSENTE | Informe instituicaoId ou unidadeId. |
| ALVO_AMBIGUO | Informe apenas um entre instituicaoId e unidadeId. |

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

### CadastrarRubrica

**Exemplo de entrada**

```json
{
  "codigo": "RUB-DIARIAS",
  "nome": "Diarias",
  "descricao": "Despesas com diarias conforme normativa da FAPES.",
  "naturezaDespesa": "CUSTEIO",
  "ativa": true,
  "rubricaPaiId": null
}
```

**Exemplo de saida**

```json
{
  "rubrica": {
    "id": "RUB-DIARIAS",
    "codigo": "RUB-DIARIAS",
    "nome": "Diarias",
    "descricao": "Despesas com diarias conforme normativa da FAPES.",
    "naturezaDespesa": "CUSTEIO",
    "rubricaPaiId": null,
    "subrubricas": [],
    "ativa": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| RUBRICA_CODIGO_DUPLICADO | Ja existe uma Rubrica cadastrada com o codigo informado. |
| RUBRICA_PAI_NAO_ENCONTRADA | A Rubrica pai informada nao foi encontrada. |
| RUBRICA_HIERARQUIA_INVALIDA | A alteracao criaria uma hierarquia invalida de rubricas. |

### ConsultarCadastrosCorporativos

**Exemplo de entrada**

```json
{
  "tipoCadastro": "INSTITUICAO",
  "filtros": {
    "nome": "UFES"
  }
}
```

**Exemplo de saida**

```json
{
  "items": [
    {
      "id": "INST-2026-010",
      "nome": "UFES"
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
- `CadastrarInstituicao` consolida a hierarquia corporativa via `Instituicao.superior`.
- `SincronizarPessoaViaAcessoCidadao` cria ou vincula pessoa pelo CPF sem duplicidade.

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
