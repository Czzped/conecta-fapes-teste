# Contexto Instituicoes

[M008](../README.md) | [Backlog](backlog.md) | [Modelo estrutural](modelo-estrutural.md) | [Modelo consolidado](../modelo-estrutural.md)

Agrupa os cadastros corporativos de organizacoes, sua classificacao institucional e dirigentes.

| Entidade | Responsabilidade |
|----------|------------------|
| Instituicao | Organizacao, campus, filial, unidade ou setor interno |
| TipoInstituicao | Classificacao institucional |
| Dirigente | Vinculo temporal entre pessoa fisica e instituicao |

## Instituicao

`Instituicao` representa qualquer organizacao cadastravel no M008: instituicao, empresa, matriz, filial, campus, centro, departamento, coordenacao, laboratorio ou setor. A diferenca entre entidade juridica e setor interno e definida por CNPJ e relacao hierarquica.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| nome | Nome comum de exibicao | Sim | String | Ex: UFES, IFES Campus Serra, Centro Tecnologico | 300 | |
| sigla | Sigla comum da instituicao ou setor | Nao | String | Ex: UFES, CT | 20 | |
| cnpj | CNPJ proprio, somente digitos | Cond. | String | Obrigatorio para instituicao raiz ou juridicamente identificavel | 14 | Sim quando informado |
| razaoSocial | Razao social da instituicao com CNPJ proprio | Cond. | String | Obrigatoria quando houver CNPJ | 300 | |
| email | Email institucional ou de contato | Cond. | String | Obrigatorio quando houver CNPJ | 200 | |
| telefone | Telefone institucional ou de contato | Nao | String | | 20 | |
| endereco | Endereco completo | Cond. | String | Obrigatorio quando houver CNPJ | 500 | |
| ativa | Indica se a instituicao esta ativa | Sim | Boolean | true/false | | |
| isExterna | Indica se a instituicao e externa a agencia de fomento | Sim | Boolean | true/false | | |
| isPublica | Indica se a instituicao e publica ou privada | Cond. | Boolean | Obrigatorio quando houver CNPJ | | |

### Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| superior | 0..1 | Instituicao superior, matriz, setor pai ou hierarquia equivalente |
| subestruturas | 0..* | Instituicoes vinculadas hierarquicamente abaixo desta instituicao |
| dirigentes | 0..* | Mandatos vinculados a pessoa fisica |
| tipoInstituicao | 0..1 | Classificacao institucional da instituicao |

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

## Dirigente

`Dirigente` e o vinculo temporal entre uma pessoa fisica e uma instituicao, indicando que a pessoa exerce mandato ou responsabilidade formal naquela instituicao.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| dataInicioMandato | Data de inicio do mandato | Sim | Date | | | |
| dataFimMandato | Data de termino do mandato | Sim | Date | | | |
| ativo | Indica se o mandato esta vigente | Gerado | Boolean | true/false | | |

### Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| pessoa | 1 | Pessoa fisica que assume o papel de dirigente |
| instituicao | 1 | Instituicao onde a pessoa exerce o mandato |

## Regras

- RN02: instituicao com CNPJ proprio e identificada unicamente pelo CNPJ.
- RN03: instituicoes podem possuir hierarquia superior-subestrutura.
- RN04: dirigente e o vinculo temporal entre uma pessoa fisica e uma instituicao.
- RN11: instituicao com CNPJ proprio deve possuir exatamente um dirigente ativo.
- RN12: organizacao, campus, filial ou unidade com CNPJ proprio deve ser cadastrada como Instituicao com CNPJ.
- RN13: setor interno sem CNPJ proprio deve ter superior informado.
- RN14: instituicao sem superior deve possuir CNPJ proprio.
- RN15: instituicao sem CNPJ proprio e tratada como setor interno para cadastro, consulta e hierarquia.
- RI1: uma instituicao so pode ter um dirigente ativo ao mesmo tempo.
- O nome do tipo de instituicao deve ser unico.
- A classificacao por tipo e aplicavel principalmente a instituicoes com CNPJ proprio.
- O periodo de mandato do dirigente deve possuir data inicial e final.
