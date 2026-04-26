# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

## Ciclo de Vida da Versao do Formulario

```mermaid
stateDiagram-v2
    [*] --> Rascunho
    Rascunho --> Publicada : Publicar versao
    Rascunho --> Cancelada : Cancelar rascunho
    Publicada --> Substituida : Nova versao publicada
    Publicada --> Cancelada : Cancelamento administrativo
    Substituida --> [*]
    Cancelada --> [*]

    state Rascunho : Pode editar secoes, campos e regras
    state Publicada : Disponivel para selecao por outros modulos
    state Substituida : Mantida para historico
    state Cancelada : Indisponivel para novas configuracoes
```
