# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: Parceria

```mermaid
stateDiagram-v2
    [*] --> EmElaboracao : Cadastrar Parceria

    EmElaboracao --> EmElaboracao : Atualizar Dados
    EmElaboracao --> EmElaboracao : Associar Finalidade
    EmElaboracao --> EmElaboracao : Definir Unidade Responsavel
    EmElaboracao --> Vigente : Formalizar Parceria [acordo assinado]

    Vigente --> Vigente : Registrar Aporte Financeiro
    Vigente --> Vigente : Registrar Coordenacao
    Vigente --> Vigente : Acompanhar Execucao
    Vigente --> Suspensa : Suspender Parceria
    Vigente --> Encerrada : Encerrar Parceria [prestacao de contas aprovada]

    Suspensa --> Vigente : Reativar Parceria
    Suspensa --> Encerrada : Encerrar Parceria [prestacao de contas aprovada]

    Encerrada --> [*]

    state EmElaboracao : Parceria sendo configurada, sem aportes
    state Vigente : Acordo assinado, aportes e coordenacao permitidos
    state Suspensa : Operacoes interrompidas temporariamente
    state Encerrada : Prestacao de contas final aprovada

    note right of Vigente : Aportes so podem ser registrados\ncom parceria vigente (RN03).\nCada aporte tem origem em uma Instituicao (M008).
    note right of Encerrada : Nao pode encerrar se houver\nprogramas com editais em andamento (RI2)
```

### Ciclo de Vida: Programa

```mermaid
stateDiagram-v2
    [*] --> EmPlanejamento : Cadastrar Programa

    EmPlanejamento --> EmPlanejamento : Atualizar Dados
    EmPlanejamento --> EmPlanejamento : Vincular Parceria de Referencia
    EmPlanejamento --> Ativo : Ativar Programa [eixo vinculado]

    Ativo --> Ativo : Atualizar Dados
    Ativo --> Suspenso : Suspender Programa
    Ativo --> Encerrado : Encerrar Programa [sem editais em andamento]

    Suspenso --> Ativo : Reativar Programa
    Suspenso --> Encerrado : Encerrar Programa

    Encerrado --> [*]

    state EmPlanejamento : Configuracao inicial, sem editais
    state Ativo : Programa habilitado para criacao de editais
    state Suspenso : Novos editais bloqueados
    state Encerrado : Programa finalizado, historico mantido

    note right of Ativo : Editais configurados em M011 e\ngerenciados em M003 apos contratacao.
    note right of Encerrado : Nao pode encerrar com\neditais em andamento (RI1)
```
