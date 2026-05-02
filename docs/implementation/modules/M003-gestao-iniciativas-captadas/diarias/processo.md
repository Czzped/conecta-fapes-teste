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
    participant M013 as M013 Orcamento
    participant M020 as M020 Comunicacao
    participant M014 as M014 Prestacao de Contas

    FAPES->>M008: Cadastra TipoDiaria com valor, vigencia, fracao de calculo e tipo de viagem
    FAPES->>M008: Cadastra TipoViagem em Configuracoes > Referencias Corporativas
    Coord->>M003: Solicita diaria
    M003->>M008: Valida TipoViagem ativo
    M003->>M008: Localiza TipoDiaria vigente pelo TipoViagem selecionado
    M003->>M003: Associa tipoViagemRef e tipoDiariaRef
    M003->>M009: Valida alocacoes dos beneficiarios
    M003->>M008: Consulta dados bancarios
    M003->>M003: Calcula quantidade e valores
    M003->>M013: Valida saldo na RubricaProjeto do tipo de viagem
    M003->>M013: Registra Transacao de comprometimento
    M003->>M003: Define estado ALOCADA sem aprovacao manual da FAPES
    M003->>M020: Notifica bolsistas
    Bolsista->>M003: Assina termo e confirma conta bancaria
    Bolsista-->>M003: Ou recusa viagem com justificativa
    M003->>M003: Quando todos assinam, altera para APROVADA automaticamente
    M003->>M013: Se houver recusa, registra transacao de reversao
    M014->>M003: Consulta diaria aprovada para comprovacao
    Coord->>M003: Remove diaria alocada/aprovada com justificativa antes do inicio
    M003->>M013: Registra transacao de reversao
    Coord->>M003: Regulariza diaria nao utilizada quando o inicio ja passou
    M003->>M003: Registra justificativa e auditoria
    M003->>M013: Registra transacao de reversao quando cabivel
```

## Estados e transicoes

```mermaid
stateDiagram-v2
    [*] --> ALOCADA: criar para bolsistas com saldo
    [*] --> APROVADA: criar somente para o coordenador
    ALOCADA --> APROVADA: todos os aceites assinados
    ALOCADA --> RECUSADA: bolsista recusa com justificativa
    ALOCADA --> CANCELADA: remover antes do inicio com justificativa
    APROVADA --> DISPONIVEL_PRESTACAO: comprometimento registrado
    APROVADA --> CANCELADA: remover antes do inicio com justificativa
    APROVADA --> REGULARIZADA_NAO_UTILIZADA: regularizar se inicio ja passou e viagem nao ocorreu
    RECUSADA --> [*]
    CANCELADA --> [*]
    REGULARIZADA_NAO_UTILIZADA --> [*]
```

## Pontos de controle

1. **Cadastro do valor vigente:** deve existir no M008 tipo de diaria vigente em **Configuracoes > Referencias Corporativas > Diarias**, contendo valor, data de vigencia, fracao de calculo e tipo de viagem ativo.
2. **Associacao obrigatoria:** a solicitacao grava `tipoDiariaRef`, `tipoViagemRef` e snapshots do valor unitario e da fracao de calculo do tipo de diaria.
3. **Beneficiarios validos:** bolsistas devem ter alocacao valida em M009.
4. **Aceite individual:** cada bolsista confirma termo e conta bancaria.
5. **Saldo na rubrica:** a solicitacao somente e criada quando a rubrica de diaria correspondente ao tipo de viagem existe no orcamento do projeto e possui saldo disponivel.
6. **Transacao da rubrica:** gerada no M013 como comprometimento vinculado a `RubricaProjeto` do tipo de viagem no ato da criacao.
7. **Visibilidade por orcamento:** o painel do coordenador deve listar uma linha por rubrica de diaria com orcamento no projeto: **Diaria dentro do Estado**, **Diaria nacional** e/ou **Diaria internacional**. Rubricas sem orcamento nao aparecem e nao ficam disponiveis para nova solicitacao.
8. **Pendente de aceite:** em diarias, pendente significa bolsista beneficiario que ainda nao aceitou a diaria. Nao representa aprovacao FAPES nem pendencia financeira.
9. **Estado alocado:** apos a criacao com saldo suficiente, a diaria fica `ALOCADA` enquanto a viagem nao iniciou e os aceites ainda estao pendentes.
10. **Aceite sem aprovacao FAPES:** quando todos os bolsistas assinam, a solicitacao passa automaticamente para `APROVADA`.
11. **Recusa individual:** quando o bolsista recusa, a justificativa e obrigatoria e o comprometimento e revertido por transacao de reversao.
12. **Remocao antes do inicio:** diaria `ALOCADA` ou `APROVADA` pode ser removida pelo coordenador com justificativa somente antes da data/hora de partida.
13. **Regularizacao apos inicio:** diaria nao utilizada depois do inicio previsto deve ser regularizada com justificativa e auditoria, sem exclusao fisica, gerando `Transacao` de reversao quando cabivel.
14. **Rubrica x transacao:** a rubrica classifica e limita o uso; a `Transacao` movimenta o saldo; a transacao financeira/bancaria so sera vinculada depois, na prestacao/conciliacao do pagamento em M014/M016.
