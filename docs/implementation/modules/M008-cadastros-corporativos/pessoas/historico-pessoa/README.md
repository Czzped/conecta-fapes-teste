# HistoricoPessoa

[Contexto Pessoas](../README.md) | [M008](../../README.md) | [Modelo estrutural consolidado](../../modelo-estrutural.md)

## Responsabilidade

`HistoricoPessoa` registra eventos relevantes do ciclo de vida de uma [PessoaFisica](../pessoa-fisica/README.md), mantendo rastreabilidade de cadastro, atualizacao, suspensao e reativacao.

## Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| data | Data/hora do evento | Gerado | DateTime | | | |
| tipo | Tipo do evento registrado | Sim | TipoEventoPessoa | CADASTRO, ATUALIZACAO, SUSPENSAO, REATIVACAO | | |
| descricao | Descricao textual do evento | Sim | String | | 500 | |
| justificativa | Justificativa do evento | Cond. | String | Obrigatoria para suspensao e reativacao | 500 | |

## Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| pessoa | 1 | Pessoa fisica relacionada ao evento |

## Enumeracoes

| Enum | Valores |
|------|---------|
| TipoEventoPessoa | CADASTRO, ATUALIZACAO, SUSPENSAO, REATIVACAO |

## Regras

- Eventos de suspensao e reativacao exigem justificativa.
- Historico nao deve ser apagado fisicamente em operacoes de manutencao ordinaria.
- O historico deve apoiar auditoria de bloqueios e desbloqueios de pessoa.
