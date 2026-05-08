# Modelo Estrutural — Instituicoes

Submodulo do M008. Modelo consolidado: [../modelo-estrutural.md](../modelo-estrutural.md) | Contexto: [README.md](README.md)

---

### Entidades do Contexto

| Entidade | Documento |
|----------|-----------|
| Instituicao | [Contexto Instituicoes](README.md#instituicao) |
| UnidadeOrganizacional | [Contexto Instituicoes](README.md#unidadeorganizacional) |
| TipoInstituicao | [Contexto Instituicoes](README.md#tipoinstituicao) |
| Responsavel | [Contexto Instituicoes](README.md#responsavel) |

---

### Diagrama de Classes

```mermaid
classDiagram
    direction TB

    class Instituicao {
        +String nome
        +String sigla
        +String cnpj
        +String razaoSocial
        +String email
        +String telefone
        +String endereco
        +boolean ativa
        +boolean isExterna
        +boolean isPublica
    }

    class TipoInstituicao {
        +String nome
        +String descricao
    }

    class Responsavel {
        +Date dataInicioMandato
        +Date dataFimMandato
        +boolean ativo
    }

    class UnidadeOrganizacional {
        +String nome
        +String sigla
        +String descricao
        +String email
        +String telefone
        +boolean ativa
    }

    class PessoaFisica {
        <<ver contexto Pessoas>>
    }

    Instituicao "0..1" *-- "0..*" Instituicao : matriz/subInstituicoes
    Instituicao "0..*" o-- "0..*" UnidadeOrganizacional : unidades
    UnidadeOrganizacional "0..*" o-- "0..*" UnidadeOrganizacional : subUnidades
    Instituicao "0..1" --> "0..*" Responsavel : responsaveis
    UnidadeOrganizacional "0..1" --> "0..*" Responsavel : responsaveis
    Instituicao "0..*" --> "0..1" TipoInstituicao : classificadaComo
    PessoaFisica "1" --> "0..*" Responsavel : assume
```

### Criterio de Modelagem

- **Instituicao** representa entidade juridicamente identificavel: matriz, filial ou campus com CNPJ proprio. CNPJ e obrigatorio em toda `Instituicao`.
- **UnidadeOrganizacional** representa subdivisao interna sem CNPJ proprio: centro, departamento, coordenacao, laboratorio, setor.
- Composicao:
  - uma `Instituicao` pode ser composta por outras `Instituicao` (matriz com filiais juridicamente identificaveis — relacao 1:N) e/ou por `UnidadeOrganizacional` (relacao N:N — uma UO pode pertencer a varias Instituicoes);
  - uma `UnidadeOrganizacional` pode ser composta por outras `UnidadeOrganizacional` em relacao N:N (uma UO pode ter multiplos pais entre Instituicoes e/ou outras UOs);
  - uma Instituicao tem no maximo um `instituicaoSuperior` — nao admite duas matrizes (RI8);
  - toda `UnidadeOrganizacional` deve ser rastreavel transitivamente a pelo menos uma `Instituicao` raiz (pode ter multiplos pais — `instituicoesPai` e/ou `unidadesSuperiores`).
- Invariante na `UnidadeOrganizacional`: a uniao de `instituicoesPai` + `unidadesSuperiores` deve ser nao vazia. Multiplos pais sao permitidos (relacao N:N).
- Invariante na `Instituicao`: tem no maximo um `instituicaoSuperior` (nao admite duas matrizes).
- Ex.: UFES e `Instituicao` (CNPJ proprio); IFES matriz e IFES Campus Serra, com CNPJ proprio cada, sao duas `Instituicao` ligadas por `matriz/subInstituicoes`; Centro Tecnologico (vinculado a UFES) e Departamento de Informatica (vinculado ao Centro Tecnologico) sao `UnidadeOrganizacional`.
- `Responsavel` e o vinculo temporal entre `PessoaFisica` e uma entidade organizacional (`Instituicao` OU `UnidadeOrganizacional`), com periodo de mandato. Cada `Responsavel` aponta exatamente para uma das duas entidades (xor).
- `TipoInstituicao` classifica apenas `Instituicao`. `UnidadeOrganizacional` nao possui classificacao tipologica neste modelo.

### Dicionario de Dados

| Classe | Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|--------|----------|-----------|--------|------|---------|---------|-------|
| **Instituicao** | nome | Nome comum de exibicao da instituicao | Sim | String | Ex: UFES, IFES Campus Serra | 300 | |
| | sigla | Sigla comum da instituicao | Nao | String | Ex: UFES | 20 | |
| | cnpj | CNPJ proprio da instituicao (somente digitos) | Sim | String | Ex: 12345678000199 | 14 | Sim |
| | razaoSocial | Razao social da instituicao | Sim | String | | 300 | |
| | email | Email institucional da entidade juridica (nao confundir com email do Responsavel) | Sim | String | | 200 | |
| | telefone | Telefone institucional da entidade juridica (nao confundir com telefone do Responsavel) | Nao | String | | 20 | |
| | endereco | Endereco completo | Sim | String | | 500 | |
| | ativa | Indica se a instituicao esta ativa | Sim | Boolean | true/false | | |
| | isExterna | Indica se a instituicao e externa a agencia de fomento | Sim | Boolean | true/false | | |
| | isPublica | Indica se a instituicao e publica (`true`) ou privada (`false`) | Sim | Boolean | true/false | | |
| | instituicaoSuperior (relacao) | Instituicao matriz quando esta for filial juridicamente identificavel | Nao | FK → Instituicao | Via `matriz/subInstituicoes` | | |
| | subInstituicoes (relacao) | Instituicoes filhas ligadas a esta como matriz | Nao | Lista FK → Instituicao | Via `matriz/subInstituicoes` | | |
| | unidades (relacao) | Unidades organizacionais internas vinculadas diretamente a esta instituicao | Nao | Lista FK → UnidadeOrganizacional | Via `unidades` | | |
| | responsaveis (relacao) | Vinculos de responsavel associados a esta instituicao | Nao | Lista FK → Responsavel | Via `responsaveis` | | |
| | tipoInstituicao (relacao) | Classificacao institucional | Nao | FK → TipoInstituicao | Via `classificadaComo` | | |
| **UnidadeOrganizacional** | nome | Nome de exibicao da unidade | Sim | String | Ex: Centro Tecnologico, Departamento de Informatica | 300 | |
| | sigla | Sigla da unidade | Nao | String | Ex: CT, DI | 20 | |
| | descricao | Descricao da unidade | Nao | String | | 500 | |
| | email | Email de contato da unidade | Nao | String | | 200 | |
| | telefone | Telefone de contato da unidade | Nao | String | | 20 | |
| | ativa | Indica se a unidade esta ativa | Sim | Boolean | true/false | | |
| | instituicoesPai (relacao) | Instituicoes as quais a unidade esta diretamente vinculada (relacao N:N — uma UO pode pertencer a varias Instituicoes) | Cond. | Lista FK → Instituicao | Via `unidades`. Pelo menos um pai (instituicao ou unidade) deve existir (RI4) | | |
| | unidadesSuperiores (relacao) | Outras Unidades Organizacionais as quais esta unidade esta vinculada (relacao N:N) | Cond. | Lista FK → UnidadeOrganizacional | Via `subUnidades`. Pelo menos um pai (instituicao ou unidade) deve existir (RI4) | | |
| | subUnidades (relacao) | Unidades filhas vinculadas a esta unidade | Nao | Lista FK → UnidadeOrganizacional | Via `subUnidades` | | |
| | responsaveis (relacao) | Vinculos de responsavel associados a esta unidade | Nao | Lista FK → Responsavel | Via `responsaveis` | | |
| **TipoInstituicao** | nome | Nome do tipo de instituicao | Sim | String | Ex: Ensino, Empresa, Agencia de Fomento | 200 | Sim |
| | descricao | Descricao do tipo | Nao | String | | 500 | |
| **Responsavel** | dataInicioMandato | Data de inicio do mandato | Sim | Date | | | |
| | dataFimMandato | Data de termino do mandato | Cond. | Date | Obrigatorio quando Responsavel estiver inativo; opcional enquanto ativo (mandato em curso) | | |
| | ativo | Indica se o mandato esta vigente | Gerado | Boolean | true/false | | |
| | pessoa (relacao) | Pessoa fisica que assume o papel de responsavel | Sim | FK → PessoaFisica | Via `assume` | | |
| | instituicao (relacao) | Instituicao onde a pessoa assume o papel (xor com `unidade`) | Cond. | FK → Instituicao | Via `responsaveis`. Obrigatorio quando `unidade` nao informada | | |
| | unidade (relacao) | Unidade organizacional onde a pessoa assume o papel (xor com `instituicao`) | Cond. | FK → UnidadeOrganizacional | Via `responsaveis`. Obrigatorio quando `instituicao` nao informada | | |

### Regras Relacionadas

- RN02: Instituicao e identificada unicamente pelo CNPJ (obrigatorio)
- RN03: Instituicoes formam hierarquia matriz/subInstituicoes; Instituicoes podem conter UnidadeOrganizacional; UnidadeOrganizacional formam sub-hierarquia interna
- RN04: Responsavel e o vinculo temporal entre uma PessoaFisica e uma entidade organizacional (Instituicao OU UnidadeOrganizacional), com mandato definido
- RN11: Instituicao deve possuir exatamente um Responsavel ativo
- RN12: Toda organizacao, campus ou filial com CNPJ proprio deve ser cadastrada como Instituicao
- RN13: UnidadeOrganizacional pode estar vinculada a uma ou mais Instituicoes e/ou Unidades Organizacionais (relacao N:N)
- RN14: Toda Instituicao deve possuir CNPJ proprio (raiz ou filial)
- RN25: Toda UnidadeOrganizacional deve ser rastreavel transitivamente a pelo menos uma Instituicao raiz (pode pertencer a multiplos pais)
- RN26: UnidadeOrganizacional deve possuir exatamente um Responsavel ativo ao mesmo tempo
- RI1: Uma Instituicao so pode ter um Responsavel ativo ao mesmo tempo
- RI3: Uma UnidadeOrganizacional so pode ter um Responsavel ativo ao mesmo tempo
- RI4: UnidadeOrganizacional deve ter pelo menos um pai entre Instituicoes e/ou outras Unidades Organizacionais; pode ter multiplos pais simultaneamente
- RI8: Instituicao tem no maximo um `instituicaoSuperior` (nao admite duas matrizes)
- RI5: Em Responsavel, exatamente um entre `instituicao` e `unidade` deve estar preenchido

### Consumidores

| Modulo | Entidade consumida | Uso |
|--------|-------------------|-----|
| M010 | Instituicao | Origem de AporteFinanceiro em Parcerias |
| M010 | Instituicao | Responsavel pela Parceria, quando area responsavel for entidade juridica |
| M010 | UnidadeOrganizacional | Responsavel pela Parceria, quando area responsavel for unidade interna |
| M010 | PessoaFisica | Coordenacao temporal de Parcerias |
| M001 | Instituicao | Referencia de Moeda (cadastro corporativo), quando aplicavel |

> Nota: M010 ainda referencia "setor interno (Instituicao sem CNPJ)". Atualizacao de M010 fora do escopo desta rodada.
