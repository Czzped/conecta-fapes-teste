# PessoaFisica

[Contexto Pessoas](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md)

## Responsabilidade

`PessoaFisica` e o cadastro canonico de individuos que interagem com a FAPES: pesquisadores, bolsistas, coordenadores, responsaveis institucionais, avaliadores, consultores e demais pessoas naturais. A identidade primaria e o CPF.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| cpf | CPF da pessoa, somente digitos | Sim | String | Ex: 12345678901 | 11 | Sim |
| nome | Nome completo da pessoa | Sim | String | | 300 | |
| email | Email de contato | Sim | String | | 200 | |
| telefone | Telefone de contato | Nao | String | | 20 | |
| dataNascimento | Data de nascimento | Sim | Date | | | |
| lattes | URL do curriculo Lattes | Nao | String | | 500 | |
| estado | Estado atual da pessoa | Gerado | EstadoPessoa | ATIVA, SUSPENSA | | |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| nivelAcademico | 0..1 | Maior nivel academico informado, via [NivelAcademico](../nivel-academico/README.md) |
| historico | 1..* | Eventos de cadastro, atualizacao, suspensao e reativacao, via [HistoricoPessoa](../historico-pessoa/README.md) |
| responsavel | 0..* | Mandatos em Instituicoes ou UnidadeOrganizacional, via [Responsavel](../../instituicoes/README.md#responsavel) |
| responsavelLegal | 0..1 | Outra `PessoaFisica` que responde legalmente pela pessoa quando esta for menor de idade. Obrigatorio quando `dataNascimento` indicar idade < 18 anos completos (RN19). |
| dependentes | 0..* | Pessoas para as quais esta pessoa atua como `responsavelLegal`. |

## Enumeracoes

| Enum | Valores |
|------|---------|
| EstadoPessoa | ATIVA, SUSPENSA |

## Regras

- RN01: uma pessoa fisica e identificada unicamente pelo CPF.
- RN05: pessoa suspensa bloqueia operacoes vinculadas, como submissao, bolsa e pagamento.
- RN10: cadastro automatico via Acesso Cidadao cria ou vincula a pessoa pelo CPF.
- RN19: pessoa fisica com idade < 18 anos completos na data de cadastro deve informar `responsavelLegal` apontando para outra `PessoaFisica` cadastrada e maior de idade. Cadastro de menor sem responsavel legal e rejeitado.
- RI2: reativacao de pessoa suspensa exige justificativa registrada.
- RI7: `responsavelLegal` deve apontar para outra `PessoaFisica` cadastrada, ativa e maior de idade. Auto-referencia rejeitada.
