# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: VersaoModalidade

```mermaid
stateDiagram-v2
    [*] --> EmEdicao : Incluir Modalidade
    [*] --> EmEdicao : Criar Versao de Modalidade [ha versao ativa]

    EmEdicao --> Ativa : Ativar Versao Modalidade
    EmEdicao --> EmEdicao : Alterar Versao Modalidade

    Ativa : entry / Desativar versao anterior
    Ativa --> Inativa : Desativar Modalidade

    Inativa --> [*]
```
