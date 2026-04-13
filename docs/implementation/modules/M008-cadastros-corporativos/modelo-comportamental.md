# Modelo Comportamental

Dominio e regras de negocio: ver [README.md](README.md)

### Ciclo de Vida: PessoaFisica

```mermaid
stateDiagram-v2
    [*] --> Ativa : Cadastrar Pessoa (manual ou via Acesso Cidadao)

    Ativa --> Ativa : Atualizar Dados
    Ativa --> Suspensa : Suspender Pessoa [com justificativa]

    Suspensa --> Ativa : Reativar Pessoa [com justificativa]
    Suspensa --> Suspensa : entry / Bloquear operacoes vinculadas

    state Ativa : Pessoa habilitada para todas as operacoes
    state Suspensa : Submissoes, bolsas e pagamentos bloqueados

    note right of Suspensa : Reativacao exige justificativa\nregistrada no historico
```

### Ciclo de Vida: Dirigente (Mandato)

```mermaid
stateDiagram-v2
    [*] --> Ativo : Cadastrar Dirigente [com mandato]

    Ativo --> Ativo : Atualizar Dados do Mandato
    Ativo --> Encerrado : Data fim mandato atingida
    Ativo --> Encerrado : Encerrar Mandato Antecipado

    Encerrado --> [*]

    state Ativo : Dirigente responsavel pela unidade
    state Encerrado : Mandato finalizado, historico mantido
```

### Ciclo de Vida: Instituicao

```mermaid
stateDiagram-v2
    [*] --> Ativa : Cadastrar Instituicao

    Ativa --> Ativa : Atualizar Dados
    Ativa --> Inativa : Desativar Instituicao

    Inativa --> Ativa : Reativar Instituicao

    state Ativa : Instituicao habilitada para vinculos
    state Inativa : Instituicao desabilitada, vinculos mantidos como historico
```
