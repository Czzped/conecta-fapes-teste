# Modelo Estrutural - Rubricas

[M008](../README.md) | [Backlog](backlog.md) | [Discovery FAPES](../../../../discovery/rubricas-subrubricas-fapes.md)

## Entidades

| Entidade | Documento | Responsabilidade |
|----------|-----------|------------------|
| Rubrica | [rubrica](rubrica/README.md) | Categoria normativa/orcamentaria para classificacao de despesas |

## Diagrama

```mermaid
classDiagram
    direction LR

    class Rubrica {
        +String codigo
        +String nome
        +String descricao
        +NaturezaDespesa naturezaDespesa
        +boolean ativa
    }

    class NaturezaDespesa {
        CUSTEIO
        CAPITAL
    }

   Rubrica  "*" --> "0..1"  NaturezaDespesa: natureza

    Rubrica "0..1" --> "*" Rubrica : subrubricas
```

## Regras

- Rubrica e categoria, nao transacao.
- Subrubrica e uma `Rubrica` filha por `rubricaPai`.
- Movimentacao de saldo pertence ao M013 como `Transacao`.
