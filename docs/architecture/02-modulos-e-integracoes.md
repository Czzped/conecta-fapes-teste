# Arquitetura - Modulos e Integracoes

[← Voltar para Arquitetura](README.md)

## Modulos

```mermaid
graph LR
    subgraph Corporativo
        M001[M001 - Modalidades Bolsas]
        M005[M005 - Autenticacao]
        M006[M006 - Autorizacao]
        M007[M007 - API Gateway]
        M008[M008 - Cadastros Corporativos]
    end

    subgraph Planejamento
        M010[M010 - Planejamento e Estrategia]
    end

    subgraph Pre-Award
        M011[M011 - Configuracao Captacao]
    end

    subgraph Post-Award
        M003[M003 - Gestao de Iniciativas Captadas]
        M009[M009 - Gestao Bolsa Pesquisa]
        M012[M012 - Acompanhamento e Resultados]
        M013[M013 - Gestao Orcamentaria Projeto]
        M014[M014 - Prestacao de Contas]
        M015[M015 - Suspensao e Finalizacao]
    end

    subgraph Financeiro
        M004[M004 - Pagamento Bolsistas]
        M016[M016 - Contabilidade e Financeiro]
        M017[M017 - PLD]
    end

    subgraph Suporte
        M018[M018 - Business Intelligence]
        M019[M019 - Transparencia e Auditoria]
        M020[M020 - Comunicacao]
    end

    subgraph Importacao
        M002[M002 - Importacao SIGFAPES]
    end

    %% Corporativo
    M008 --> M001
    M008 --> M010
    M008 --> M011
    M008 --> M004
    M005 --> M007
    M006 --> M007

    %% Importacao e Pre-Award
    M002 --> M003
    M002 --> M004
    M010 --> M011
    M010 --> M016
    M011 --> M003

    %% Post-Award
    M001 --> M004
    M003 --> M009
    M003 --> M012
    M003 --> M013
    M003 --> M014
    M003 --> M015
    M009 --> M004
    M013 --> M016

    %% Financeiro
    M016 --> M004
    M016 --> M017
    M004 --> M017

    %% Suporte
    M012 --> M018
    M016 --> M018
    M004 --> M018
    M005 --> M019
    M018 --> M019
    M020 --> M003
    M020 --> M009
    M020 --> M012
    M020 --> M014
```

## Integracoes Externas

| Sistema | Tipo | Descricao |
|---------|------|-----------|
| Sigfapes | Importacao automatica de dados | Importacao de editais, projetos, equipes, bolsistas e historico de pagamentos do sistema legado. Dados intermediados pelo banco ConectaFapesJobImportacaoDB |
| Acesso Cidadao | Autenticacao (OpenID Connect) | SSO do governo do ES ([docs.acessocidadao.es.gov.br](https://docs.acessocidadao.es.gov.br)). Unico ponto de autenticacao de usuarios |
| OpenFGA | Autorizacao | Motor de decisao de acesso (PDP). Avalia politicas RBAC/ABAC em tempo real |
| Banestes | Pagamento (remessa/retorno) | Integracao via arquivos de remessa e retorno (@-EDI). Envio e recebimento atualmente manuais |
| BANDES | Pagamento | Transferencia de recursos financeiros para projetos |
| EDOCS | Documentos | Anexacao de documentos de pagamento gerados pelo sistema |

## Componentes de Backend

| Componente | Descricao |
|------------|-----------|
| **Conect Admin** | Modulo administrativo principal. Gerencia importacoes do Sigfapes, modelos de dominio (editais, projetos, alocacoes, bolsistas) e operacoes do back-office da agencia de fomento |
| **Dashboard Pagamento** | Painel analitico de gastos por edital, projeto e bolsista. Consolida dados financeiros para tomada de decisao |
| **Modulo Pagamento** | Operacionaliza o pagamento de bolsas via integracao com Banestes (arquivos de remessa/retorno @-EDI) e geracao de documentos para BANDES e EDOCS. **Implementado** — ver [M004](../implementation/modules/M004-pagamento-bolsista/README.md) e [ADR-006](adr/ADR-006-reconciliacao-m004-pagamento-bolsista.md) |
| **Gerenciamento de Usuarios** | Ultima barreira de acesso. Verifica se o usuario possui cadastro ativo no sistema apos autenticacao e autorizacao, aplicando restricoes adicionais (ex.: bloqueio por inatividade) |

## Evolucao Proposta: BFF

O [ADR-005](adr/ADR-005-adocao-bff.md) (Aceita) define a adocao de **um BFF por produto** para composicao de telas multi-modulo. O M007 continua como gateway tecnico; os BFFs ficam entre o frontend e o gateway.

```mermaid
graph LR
    subgraph Produtos
        PC[Portal Coordenador]
        PA[Portal Admin]
        IMP[Importador]
    end

    subgraph BFFs
        BFFC[BFF Coordenador]
        BFFA[BFF Admin]
    end

    PC --> BFFC
    PA --> BFFA
    IMP --> IGW

    BFFC --> IGW[Gateway Interno M007]
    BFFA --> IGW
    IGW --> API[APIs Modulares]
```

A implementacao atual **ainda nao possui BFF** — os frontends chamam diretamente as APIs modulares. A introducao sera incremental: queries compostas primeiro, depois comandos multi-etapa. Ver [ADR-005](adr/ADR-005-adocao-bff.md) para mapa de endpoints e regras.

## Decisoes de Arquitetura

As decisoes de arquitetura sao registradas como ADRs (Architecture Decision Records) na pasta [`adr/`](adr/).
