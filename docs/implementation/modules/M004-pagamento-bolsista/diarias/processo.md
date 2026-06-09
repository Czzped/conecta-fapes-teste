# Processo - Pagamento de Diarias

[← Voltar](README.md)

## Fluxo de pagamento

```mermaid
sequenceDiagram
    autonumber
    actor Coord as Coordenador / Outorgado
    actor Bolsista as Bolsista
    participant M003 as M003 Diarias
    participant M004 as M004 Pagamento
    participant M013 as M013 Orcamento
    participant M014 as M014 Prestacao de Contas
    participant M016 as M016 Contabilidade
    participant Banestes as Banestes

    M003->>M004: SolicitacaoDiaria APROVADA disponivel para pagamento
    Coord->>M004: Consulta diarias aprovadas pendentes de pagamento
    M004->>M003: Obtem snapshot de conta bancaria e valor total calculado
    Coord->>M004: Autoriza pagamento da diaria
    M004->>Banestes: Gera remessa de pagamento para conta do bolsista
    Banestes-->>M004: Retorno bancario com resultado do agendamento
    M004->>M003: Atualiza SolicitacaoDiaria para DISPONIVEL_PRESTACAO
    M004->>M013: Registra TransacaoFinanceira vinculada ao comprometimento
    Banestes-->>Bolsista: Transferencia creditada na conta Banestes
    Bolsista->>M004: Confirma recebimento (opcional)
    Coord->>M003: Comprova realizacao da viagem com texto e imagem apos retorno
    Coord->>M014: Associa saida financeira a SolicitacaoDiaria na prestacao de contas
    M014->>M016: Registra lancamento contabil da despesa de diaria
    M016->>M013: Reconcilia comprometimento com execucao financeira
```

## Estados relevantes da SolicitacaoDiaria no fluxo M004

```mermaid
stateDiagram-v2
    [*] --> APROVADA : todos aceites assinados (M003)
    APROVADA --> DISPONIVEL_PRESTACAO : pagamento processado e retorno bancario confirmado (M004)
    DISPONIVEL_PRESTACAO --> [*] : comprovacao e prestacao de contas concluidas (M014)
```

## Responsabilidades por ator

| Ator | Responsabilidade no fluxo de pagamento |
|------|----------------------------------------|
| Coordenador / Outorgado | Consulta diarias aprovadas, autoriza pagamento e comprova realizacao da viagem |
| Bolsista | Confirma recebimento quando solicitado |
| M003 Diarias | Fonte da SolicitacaoDiaria APROVADA com snapshot de conta bancaria, valor e regra de calculo |
| M004 Pagamento | Gera e processa remessa bancaria para Banestes, registra retorno e atualiza estado da solicitacao |
| M013 Orcamento | Registra TransacaoFinanceira vinculada ao comprometimento existente |
| M014 Prestacao de Contas | Associa saida financeira a SolicitacaoDiaria aprovada para comprovacao |
| M016 Contabilidade | Registra lancamento contabil da despesa de diaria e reconcilia execucao |
| Banestes | Processa a transferencia bancaria para a conta do bolsista |

## Pontos de controle

1. **Pre-condicao:** `SolicitacaoDiaria` deve estar `APROVADA` com `estadoAceite = ASSINADO` e `contaBancariaSnapshot` preenchido.
2. **Conta bancaria:** M004 usa o `contaBancariaSnapshot` gravado no aceite da `SolicitacaoDiaria`, nao consulta conta atual do bolsista no momento do pagamento.
3. **Valor:** M004 usa `valorTotalCalculado` do snapshot; nao recalcula nem consulta valores vigentes do M008.
4. **Remessa:** gerada pelo M004 com os dados do snapshot, seguindo o mesmo fluxo de remessa Banestes do pagamento de bolsas mensais.
5. **Retorno bancario:** ao processar o retorno com sucesso, M004 atualiza `SolicitacaoDiaria` para `DISPONIVEL_PRESTACAO` e registra `TransacaoFinanceira` no M013.
6. **Comprovacao obrigatoria:** apos a data de retorno da viagem, o coordenador ou bolsista deve comprovar a realizacao da viagem com texto e imagem antes de encerrar a prestacao de contas.
7. **Prestacao de contas:** o coordenador associa a saida financeira a `SolicitacaoDiaria` em M014; M014 usa o snapshot de valor e regra — nunca recalcula.
8. **Falha bancaria:** se o retorno Banestes indicar falha, a `SolicitacaoDiaria` nao avanca para `DISPONIVEL_PRESTACAO` e o coordenador deve corrigir os dados e reprocessar.
