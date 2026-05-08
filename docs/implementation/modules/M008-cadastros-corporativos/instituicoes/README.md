# Contexto Instituicoes

[M008](../README.md) | [Backlog](backlog.md) | [Modelo estrutural](modelo-estrutural.md) | [Modelo consolidado](../modelo-estrutural.md)

Agrupa os cadastros corporativos de organizacoes (Instituicao, UnidadeOrganizacional), sua classificacao institucional e responsaveis (mandatos temporais com pessoas fisicas).

| Entidade | Responsabilidade |
|----------|------------------|
| Instituicao | Entidade juridicamente identificavel: matriz, filial ou campus com CNPJ proprio |
| UnidadeOrganizacional | Subdivisao interna sem CNPJ: centro, departamento, coordenacao, laboratorio, setor |
| TipoInstituicao | Classificacao institucional |
| Responsavel | Vinculo temporal entre pessoa fisica e entidade organizacional (Instituicao ou UnidadeOrganizacional) |

## Instituicao

`Instituicao` representa entidade juridicamente identificavel cadastravel no M008: matriz, filial ou campus com CNPJ proprio. CNPJ e obrigatorio. Subdivisoes internas sem CNPJ sao modeladas como `UnidadeOrganizacional`.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| nome | Nome comum de exibicao | Sim | String | Ex: UFES, IFES Campus Serra | 300 | |
| sigla | Sigla comum da instituicao | Nao | String | Ex: UFES | 20 | |
| cnpj | CNPJ proprio, somente digitos | Sim | String | Ex: 12345678000199 | 14 | Sim |
| razaoSocial | Razao social da instituicao | Sim | String | | 300 | |
| email | Email institucional da entidade juridica (nao confundir com email do Responsavel) | Sim | String | | 200 | |
| telefone | Telefone institucional da entidade juridica (nao confundir com telefone do Responsavel) | Nao | String | | 20 | |
| endereco | Endereco completo | Sim | String | | 500 | |
| ativa | Indica se a instituicao esta ativa | Sim | Boolean | true/false | | |
| isExterna | Indica se a instituicao e externa a agencia de fomento | Sim | Boolean | true/false | | |
| isPublica | Indica se a instituicao e publica ou privada | Sim | Boolean | true/false | | |

### Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| instituicaoSuperior | 0..1 | Instituicao matriz quando esta for filial juridicamente identificavel |
| subInstituicoes | 0..* | Instituicoes filhas ligadas a esta como matriz |
| unidades | 0..* | Unidades organizacionais internas vinculadas diretamente a esta instituicao |
| responsaveis | 0..* | Mandatos de responsavel vinculados a pessoa fisica |
| tipoInstituicao | 0..1 | Classificacao institucional da instituicao |

## UnidadeOrganizacional

`UnidadeOrganizacional` representa subdivisao interna de uma `Instituicao`: centro, departamento, coordenacao, laboratorio, setor. Nao possui CNPJ. Pode ser composta por outras `UnidadeOrganizacional`. Toda `UnidadeOrganizacional` deve ser rastreavel transitivamente a uma `Instituicao` raiz.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| nome | Nome de exibicao da unidade | Sim | String | Ex: Centro Tecnologico, Departamento de Informatica | 300 | |
| sigla | Sigla da unidade | Nao | String | Ex: CT, DI | 20 | |
| descricao | Descricao da unidade | Nao | String | | 500 | |
| email | Email de contato da unidade | Nao | String | | 200 | |
| telefone | Telefone de contato da unidade | Nao | String | | 20 | |
| ativa | Indica se a unidade esta ativa | Sim | Boolean | true/false | | |

### Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| instituicaoPai | 0..1 | Instituicao a qual a unidade esta diretamente vinculada (quando o pai for Instituicao) |
| unidadeSuperior | 0..1 | Unidade superior na hierarquia interna (quando o pai for outra unidade) |
| subUnidades | 0..* | Unidades filhas vinculadas a esta unidade |
| responsaveis | 0..* | Mandatos de responsavel vinculados a pessoa fisica |

> Invariante: exatamente um entre `instituicaoPai` e `unidadeSuperior` deve estar preenchido.

## TipoInstituicao

`TipoInstituicao` classifica instituicoes com finalidade semelhante, como ensino, empresa, agencia de fomento, orgao publico ou entidade parceira.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| nome | Nome do tipo de instituicao | Sim | String | Ex: Ensino, Empresa, Agencia de Fomento | 200 | Sim |
| descricao | Descricao do tipo | Nao | String | | 500 | |

### Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| instituicoes | 0..* | Instituicoes classificadas por este tipo |

## Responsavel

`Responsavel` e o vinculo temporal entre uma pessoa fisica e uma entidade organizacional (`Instituicao` OU `UnidadeOrganizacional`), com periodo de mandato. Cada `Responsavel` aponta exatamente para uma das duas entidades (xor).

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| dataInicioMandato | Data de inicio do mandato | Sim | Date | | | |
| dataFimMandato | Data de termino do mandato | Cond. | Date | Obrigatorio quando mandato estiver encerrado (Responsavel inativo). Pode ficar vazio enquanto Responsavel estiver ativo. | | |
| ativo | Indica se o mandato esta vigente | Gerado | Boolean | true/false | | |

### Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| pessoa | 1 | Pessoa fisica que assume o papel de responsavel |
| instituicao | 0..1 | Instituicao onde a pessoa exerce o mandato (xor com `unidade`) |
| unidade | 0..1 | UnidadeOrganizacional onde a pessoa exerce o mandato (xor com `instituicao`) |

> Invariante: exatamente um entre `instituicao` e `unidade` deve estar preenchido.

## Regras

- RN02: instituicao e identificada unicamente pelo CNPJ (obrigatorio).
- RN03: instituicoes formam hierarquia matriz/subInstituicoes; instituicoes podem conter unidades organizacionais; unidades formam sub-hierarquia interna.
- RN04: responsavel e o vinculo temporal entre uma pessoa fisica e uma entidade organizacional (Instituicao OU UnidadeOrganizacional).
- RN11: instituicao deve possuir exatamente um responsavel ativo.
- RN12: organizacao, campus ou filial com CNPJ proprio deve ser cadastrada como Instituicao.
- RN13: setor interno e cadastrado como UnidadeOrganizacional vinculada a uma Instituicao ou a outra UnidadeOrganizacional.
- RN14: toda Instituicao deve possuir CNPJ proprio.
- RN25: toda UnidadeOrganizacional deve ser rastreavel transitivamente a uma Instituicao raiz.
- RN26: UnidadeOrganizacional deve possuir exatamente um responsavel ativo.
- RI1: uma Instituicao so pode ter um responsavel ativo ao mesmo tempo.
- RI3: uma UnidadeOrganizacional so pode ter um responsavel ativo ao mesmo tempo.
- RI4: em UnidadeOrganizacional, exatamente um entre `instituicaoPai` e `unidadeSuperior` deve estar preenchido.
- RI5: em Responsavel, exatamente um entre `instituicao` e `unidade` deve estar preenchido.
- O nome do tipo de instituicao deve ser unico.
- A classificacao por tipo aplica-se apenas a Instituicao.
- O periodo de mandato do Responsavel deve possuir data inicial e final.
