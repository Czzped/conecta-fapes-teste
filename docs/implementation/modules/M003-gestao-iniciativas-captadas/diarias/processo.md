# Processo - Diarias da Iniciativa

[← Voltar](README.md)

## Fluxo operacional

```mermaid
sequenceDiagram
    autonumber
    actor FAPES as Analista FAPES
    actor Coord as Coordenador / Ortogado
    actor Bolsista as Bolsista
    participant M003 as M003 Diarias
    participant M009 as M009 Bolsistas
    participant M008 as M008 Cadastros
    participant M020 as M020 Comunicacao
    participant M014 as M014 Prestacao de Contas

    FAPES->>M003: Cadastra TipoDiaria com valor, vigencia, fracao de calculo e tipo de viagem em Configuracoes > Referencias Corporativas > Diarias
    FAPES->>M003: Cadastra TipoViagem em Configuracoes > Referencias Corporativas > Tipos de Viagem
    Coord->>M003: Cria SolicitacaoDiaria
    M003->>M003: Localiza TipoViagem vigente
    M003->>M003: Localiza TipoDiaria vigente pelo TipoViagem selecionado
    M003->>M003: Associa tipoViagemRef e tipoDiariaRef
    M003->>M009: Valida alocacoes dos beneficiarios
    M003->>M008: Consulta dados bancarios
    M003->>M003: Calcula quantidade e valores
    Coord->>M003: Submete para aceite
    M003->>M020: Notifica bolsistas
    Bolsista->>M003: Assina termo e confirma conta bancaria
    Bolsista-->>M003: Ou recusa viagem com justificativa
    M003->>M003: Quando todos assinam, envia para aprovacao
    FAPES->>M003: Aprova ou rejeita
    M003->>M003: Se aprovada, gera debito na rubrica
    M014->>M003: Consulta diaria aprovada para comprovacao
    Coord->>M003: Cancela diaria aprovada com justificativa
    M003->>M003: Gera credito de reversao
```

## Estados e transicoes

```mermaid
stateDiagram-v2
    [*] --> RASCUNHO
    RASCUNHO --> AGUARDANDO_ACEITES: submeter para aceite
    AGUARDANDO_ACEITES --> AGUARDANDO_APROVACAO: todos os aceites assinados
    AGUARDANDO_ACEITES --> RECUSADA: bolsista recusa com justificativa
    AGUARDANDO_APROVACAO --> APROVADA: FAPES aprova
    AGUARDANDO_APROVACAO --> REJEITADA: FAPES rejeita com justificativa
    APROVADA --> DISPONIVEL_PRESTACAO: debito gerado
    APROVADA --> CANCELADA: cancelar com justificativa
    DISPONIVEL_PRESTACAO --> CANCELADA: cancelar se sem prestacao finalizada
    REJEITADA --> [*]
    RECUSADA --> [*]
    CANCELADA --> [*]
```

## Pontos de controle

1. **Cadastro do valor vigente:** deve existir tipo de diaria vigente em **Configuracoes > Referencias Corporativas > Diarias**, contendo valor, data de vigencia, fracao de calculo e tipo de viagem ativo.
2. **Associacao obrigatoria:** a solicitacao grava `tipoDiariaRef`, `tipoViagemRef` e snapshots do valor unitario e da fracao de calculo do tipo de diaria.
3. **Beneficiarios validos:** bolsistas devem ter alocacao valida em M009.
4. **Aceite individual:** cada bolsista confirma termo e conta bancaria.
5. **Recusa individual:** quando o bolsista recusa, a justificativa e obrigatoria e a solicitacao nao segue para aprovacao.
6. **Aprovacao FAPES:** somente apos todos os aceites.
7. **Rejeicao FAPES:** exige justificativa obrigatoria e nao gera debito na rubrica.
8. **Lancamento de debito:** gerado na rubrica **Diarias e Passagens**.
9. **Cancelamento:** exige justificativa e gera credito se ja havia debito.
