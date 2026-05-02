# Modelo Estrutural - Geografia

[M008](../README.md) | [Backlog](backlog.md)

## Entidades

| Entidade | Documento | Responsabilidade |
|----------|-----------|------------------|
| Cidade | [cidade](cidade/README.md) | Cadastro geografico de municipios |
| Regiao | [regiao](regiao/README.md) | Agrupamento geografico de cidades |

## Diagrama

```mermaid
classDiagram
    direction LR

    class Cidade {
        +String nome
        +String codigoIBGE
    }

    class Regiao {
        +String nome
        +String descricao
    }

    Regiao "1" --> "*" Cidade : cidades
```
