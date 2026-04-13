# Arquitetura - Conecta FAPES

Visao geral da arquitetura do projeto Conecta FAPES.

[← Voltar ao Backlog Central](../backlog-product.md)

---

## Visao Geral

<!-- Descreva aqui a visao de alto nivel da arquitetura do sistema -->

## Diagrama de Contexto (C4 - Level 1)

<!-- Diagrama mostrando o sistema Conecta FAPES e seus atores/sistemas externos -->

```mermaid
graph TB
    subgraph Atores
        SF[Servidor FAPES]
        PB[Pesquisador / Bolsista]
    end

    subgraph Sistemas Externos
        SIG[Sigfapes]
        AC[Acesso Cidadao]
        BAN[Banestes]
        BAND[BANDES]
        EDOCS[EDOCS]
    end

    CF[Conecta FAPES]

    SF --> CF
    PB --> CF
    CF --> SIG
    CF --> AC
    CF --> BAN
    CF --> BAND
    CF --> EDOCS
```

## Diagrama de Containers (C4 - Level 2)

<!-- Diagrama mostrando os containers/servicos que compõem o sistema -->

## Stack Tecnologico

<!-- Liste as tecnologias utilizadas no projeto -->

| Camada | Tecnologia | Observacoes |
|--------|------------|-------------|
| Front-end | - | - |
| Back-end | - | - |
| Banco de Dados | - | - |
| Autenticacao | Acesso Cidadao / OpenFGA | - |
| Infraestrutura | Kubernetes | - |
| CI/CD | GitLab CI / GitHub Actions | - |
| Documentacao | Docusaurus | - |

## Modulos

```mermaid
graph LR
    M002[M002 - Importacao Editais] --> M004[M004 - Pagamento Bolsistas]
    M002 --> M003[M003 - Gerenciar Editais]
    M001[M001 - Modalidades Bolsas] --> M004
    M005[M005 - Autenticacao] --> M007[M007 - API Gateway]
    M006[M006 - Autorizacao] --> M007
    M003 --> M009[M009 - Gestao Bolsa Pesquisa]
```

## Integracoes Externas

| Sistema | Tipo | Descricao |
|---------|------|-----------|
| Sigfapes | Importacao de dados | Editais, Projetos, Alocacoes, Pessoas |
| Acesso Cidadao | Autenticacao | SSO do governo do ES |
| OpenFGA | Autorizacao | Controle de acesso granular |
| Banestes | Pagamento | Cadastro de bolsistas e remessa/retorno |
| BANDES | Pagamento | Transferencia de recursos |
| EDOCS | Documentos | Anexacao de documentos de pagamento |

## Decisoes de Arquitetura

As decisoes de arquitetura sao registradas como ADRs (Architecture Decision Records) na pasta [`adr/`](adr/).
