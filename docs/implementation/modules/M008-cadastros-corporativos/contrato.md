# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do modulo M008 como contexto responsavel pelos cadastros corporativos compartilhados da plataforma: pessoas, instituicoes, dirigentes e referencias basicas.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Todos os modulos operacionais | Consultam pessoas, instituicoes, dirigentes e referencias corporativas como base canonica |
| M003 - Gestao de Iniciativas Captadas | Consulta `TipoViagem` e `TipoDiaria` vigentes para calcular solicitacoes de diaria e gravar snapshots |
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
| CadastrarInstituicao | Command | Registrar instituicao com ou sem CNPJ proprio, incluindo natureza publica/privada quando aplicavel e eventual superior hierarquico | nome, sigla?, cnpj?, razaoSocial?, email?, telefone?, endereco?, isPublica?, isExterna, superiorId?, tipoInstituicaoId? | `Instituicao` registrada | RN02, RN03, RN12, RN13, RN14, RN15 | Nome informado; superior informado quando nao houver CNPJ | CNPJ duplicado, superior inexistente, instituicao sem CNPJ e sem superior, dados invalidos | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarDirigente | Command | Registrar dirigente como vinculo temporal entre uma pessoa e uma instituicao | pessoaId, instituicaoId, dataInicio, dataFim | `Dirigente` criado/atualizado | RN04, RN11, RI1 | Pessoa e instituicao existentes | Mandato sobreposto, pessoa inexistente, instituicao inexistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| SincronizarPessoaViaAcessoCidadao | Event Consumed | Criar ou vincular pessoa automaticamente a partir do Acesso Cidadao | cpf, nome, email, origem | `PessoaFisica` criada/vinculada | RN10 | Evento recebido com CPF valido | CPF invalido, inconsistencias cadastrais | Sim por CPF e origem do evento | Sistema | Evento/mensagem interna a definir |
| CadastrarRubrica | Command | Criar Rubrica canonica de custeio ou capital | codigo, nome, descricao, natureza, categoriaOrcamentaria?, documentoFonte?, vigenciaInicio?, rubricaPaiId? | `Rubrica` criada | RN07, RN16, RN17 | Codigo, nome, descricao e natureza informados | Codigo duplicado, rubrica pai inexistente, hierarquia invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| AtualizarRubrica | Command | Atualizar metadados, vigencia, documento fonte ou rubrica pai | rubricaId, dados atualizados, justificativa | `Rubrica` atualizada | RN16, RN17, RN18 | Rubrica existente | Rubrica inexistente, hierarquia invalida, justificativa ausente quando aplicavel | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| AlterarEstadoRubrica | Command | Ativar ou desativar Rubrica preservando historico | rubricaId, ativa, justificativa | `Rubrica` atualizada | RN18 | Rubrica existente | Rubrica inexistente, desativacao sem justificativa | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| RegistrarSinonimoRubrica | Command | Vincular termo equivalente a uma Rubrica canonica | rubricaId, termo, origem? | `SinonimoRubrica` criado | RN19 | Rubrica existente | Termo duplicado, rubrica inexistente | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| DefinirMapeamentoContabilRubrica | Command | Vincular Rubrica a referencia contabil vigente do M016 | rubricaId, contaContabilRef, classificacaoContabil?, vigenciaInicio, vigenciaFim? | `MapeamentoContabilRubrica` criado | RN20 | Rubrica existente; conta contabil existente no M016 quando validavel | Conta contabil inexistente, vigencia sobreposta | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CadastrarTipoViagem | Command | Criar ou atualizar tipo de viagem usado em solicitacoes de diaria | codigo, nome, abrangencia, descricao?, ativo | `TipoViagem` criado/atualizado | RN22 | Codigo, nome e abrangencia informados | Codigo duplicado, abrangencia invalida | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| CadastrarTipoDiaria | Command | Criar valor vigente de diaria por tipo de viagem | codigo, tipoViagemId, valorUnitario, fracaoCalculo, vigenciaInicio, vigenciaFim?, ativo | `TipoDiaria` criado/atualizado | RN23 | TipoViagem ativo; valor maior que zero; vigencia valida | Codigo duplicado, tipo viagem inexistente/inativo, vigencia sobreposta | Nao | Analista da Agencia de Fomento | API interna/backoffice a definir |
| ConsultarTipoDiariaVigente | Query | Obter tipo de diaria vigente para data de referencia e tipo de viagem | tipoViagemId, dataReferencia | `TipoDiaria` vigente | RN23 | TipoViagem existente | TipoDiaria vigente ausente | N/A | Modulo interno autorizado ou analista | API interna a definir |
| ConsultarCadastrosCorporativos | Query | Consultar pessoas, instituicoes, dirigentes e referencias basicas | tipoCadastro, filtros | Lista ou detalhe cadastral | RN01, RN02, RN03, RN09, RN11, RN12, RN13, RN14, RN15 | Filtro informado | Cadastro nao encontrado | N/A | Modulo interno autorizado ou analista | API interna a definir |

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
  "isPublica": true,
  "isExterna": true,
  "superiorId": null
}
```

**Exemplo de saida**

```json
{
  "instituicao": {
    "id": "INST-2026-010",
    "nome": "UFES",
    "cnpj": "12.345.678/0001-90",
    "superiorId": null
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| CNPJ_DUPLICADO | Ja existe uma instituicao cadastrada com o CNPJ informado. |
| INSTITUICAO_SUPERIOR_NAO_ENCONTRADA | A instituicao superior informada nao foi encontrada. |
| INSTITUICAO_SEM_CNPJ_SEM_SUPERIOR | Instituicao sem CNPJ proprio deve possuir uma instituicao superior. |

### RegistrarDirigente

**Exemplo de entrada**

```json
{
  "pessoaId": "PES-2026-001",
  "instituicaoId": "INST-2026-010",
  "dataInicio": "2026-01-01",
  "dataFim": "2026-12-31"
}
```

**Exemplo de saida**

```json
{
  "dirigente": {
    "id": "DIR-2026-003",
    "instituicaoId": "INST-2026-010",
    "ativo": true
  }
}
```

**Excecoes e mensagens**

| Codigo | Mensagem de erro exemplo |
|--------|---------------------------|
| MANDATO_SOBREPOSTO | Ja existe dirigente ativo na instituicao informada. |
| INSTITUICAO_NAO_ENCONTRADA | A instituicao informada nao foi encontrada. |

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
  "natureza": "CUSTEIO",
  "categoriaOrcamentaria": "Outras Despesas Correntes",
  "documentoFonte": "Resolucao CCAF no 309/2022",
  "vigenciaInicio": "2026-01-01",
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
    "natureza": "CUSTEIO",
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
