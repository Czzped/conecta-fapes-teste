# Processo - Alocacao de Diaria de Passagem

[← Voltar](README.md)

## Diagrama de processo

```mermaid
---
title: Diagrama de processo
---
flowchart TD
    subgraph Coord["Coordenador / Outorgado"]
        A([Iniciar solicitacao de diaria])
        B[Selecionar tipo de viagem]
        C[Selecionar origem e destino]
        D[Informar data e hora de partida e chegada]
        E[Definir motivo da viagem]
        F[Selecionar bolsistas que irao viajar]
        G{Confirmar envio?}
        H[Enviar solicitacao aos bolsistas]
        N([Cancelar])
    end

    subgraph Sis["Sistema M003"]
        I[Buscar TipoDiaria e ParametroCalculoDiaria vigentes]
        J{Viagem dentro do Estado?}
        K[Calcular distancia e verificar elegibilidade]
        L[Validar alocacoes dos bolsistas no projeto]
        M[Calcular quantidade de diarias e valor total por bolsista]
        P[Apresentar custo total da viagem]
        Q[Criar SolicitacaoDiaria por bolsista com estado ALOCADA]
        R[Comprometer saldo no M013 por RubricaProjeto]
        S[Notificar bolsistas via M020]
        V[Reverter comprometimento e marcar RECUSADA]
        U([SolicitacaoDiaria APROVADA])
    end

    subgraph Bol["Bolsista"]
        W{Aceitar a viagem?}
        X[Registrar aceite e confirmar conta bancaria]
        Y[Recusar com justificativa]
    end

    A --> B --> I --> C --> J
    J -- Sim --> K --> D
    J -- Nao --> D
    D --> E --> F --> L --> M --> P --> G
    G -- Nao --> N
    G -- Sim --> H --> Q --> R --> S --> W
    W -- Sim --> X --> U
    W -- Nao --> Y --> V
```

## Cancelamento apos aceite

```mermaid
---
title: Cancelamento de diaria apos aceite do bolsista
---
flowchart TD
    subgraph Bol["Bolsista"]
        A([Bolsista informa ao coordenador\nque nao ira mais viajar])
    end

    subgraph Coord["Coordenador / Outorgado"]
        B[Acessa a SolicitacaoDiaria APROVADA]
        C{Viagem ainda\nnao iniciou?}
        D[Cancela a diaria do bolsista\ncom justificativa obrigatoria]
        E[Regulariza a diaria\ncomo nao utilizada com justificativa]
    end

    subgraph Sis["Sistema M003"]
        F[Marca SolicitacaoDiaria como CANCELADA]
        G[Marca SolicitacaoDiaria como REGULARIZADA_NAO_UTILIZADA]
        H[Reverte comprometimento no M013]
        I([Saldo devolvido a RubricaProjeto])
    end

    A --> B --> C
    C -- Sim, antes da partida --> D --> F --> H --> I
    C -- Nao, partida ja passou --> E --> G --> H --> I
```

## Estados e transicoes

```mermaid
stateDiagram-v2
    [*] --> ALOCADA : solicitacao criada com saldo e aceite pendente
    ALOCADA --> APROVADA : todos os aceites assinados
    ALOCADA --> RECUSADA : bolsista recusa com justificativa
    ALOCADA --> CANCELADA : coordenador remove antes da data de partida
    APROVADA --> DISPONIVEL_PRESTACAO : pagamento processado pelo M004
    APROVADA --> CANCELADA : coordenador remove antes da data de partida
    APROVADA --> REGULARIZADA_NAO_UTILIZADA : viagem nao realizada apos data de partida
    RECUSADA --> [*]
    CANCELADA --> [*]
    REGULARIZADA_NAO_UTILIZADA --> [*]
    DISPONIVEL_PRESTACAO --> [*] : prestacao de contas concluida no M014
```

## Pontos de controle

1. **Tipo de viagem:** define a abrangencia (Dentro do Estado, Nacional ou Internacional) e determina o `TipoDiaria` e `ParametroCalculoDiaria` vigentes usados no calculo.
2. **Elegibilidade dentro do Estado:** o sistema calcula automaticamente a distancia rodoviaria e verifica regiao metropolitana e municipios limitrofes; pode bloquear a diaria quando nao houver pernoite.
3. **Calculo automatico:** quantidade de diarias, acrescimos e valor total calculados pelo sistema; coordenador nao informa valores.
4. **Revisao antes do envio:** coordenador ve o custo total por bolsista e total geral antes de confirmar; pode cancelar nesse ponto.
5. **Uma SolicitacaoDiaria por bolsista:** cada bolsista gera solicitacao independente com comprometimento e aceite proprios.
6. **Saldo insuficiente:** se o saldo da `RubricaProjeto` for insuficiente para qualquer bolsista, a solicitacao e bloqueada antes da criacao.
7. **Aceite obrigatorio:** bolsista confirma ciencia da viagem e conta bancaria; nao ha aprovacao manual da FAPES.
8. **Recusa individual:** bolsista que recusa gera reversao do comprometimento; os demais que aceitaram permanecem APROVADOS.
9. **Snapshot imutavel:** valor unitario, parametros e conta bancaria ficam gravados no momento da criacao; mudancas posteriores no M008 nao afetam a solicitacao.
10. **Pagamento e prestacao:** pagamento bancario ocorre no M004; associacao da saida financeira ocorre no M014; o M003 nao executa nem registra a transacao financeira.
