# Regras de Saldo — Alocado, Consumido e Disponivel

[Glossario](glossario.md) | [Domain 04 Pos-Award](domains/04-fomento-post-award.md) | [Domain 05 Financeiro](domains/05-financeiro.md)

## Contexto

Bolsas (M009) e Diarias (M003) consomem orcamento de um projeto/edital/parceria. Sem distincao entre **valor reservado** e **valor efetivamente pago**, o sistema permite alocar mais recursos do que existem disponiveis, gerando estouro de orcamento. Este documento formaliza as definicoes canonicas dos saldos aplicaveis a esses dois instrumentos.

## Definicoes canonicas

| Termo | Definicao |
|-------|-----------|
| **Total** | Valor bruto do orcamento previsto para Bolsas ou Diarias em um Projeto, Edital ou Parceria. Origem: planejamento orcamentario (M013) ou rubrica especifica do projeto. |
| **Alocado** | Valor **reservado** para uma alocacao individual (bolsa concedida a bolsista, diaria solicitada e aprovada) que ainda **nao foi pago**. Compromete o orcamento mas nao consumiu caixa. |
| **Consumido** | Valor **efetivamente pago** ao beneficiario, baixado contra rubrica e refletido em movimentacao financeira (M014/M016). |
| **Disponivel** | Saldo livre para novas alocacoes. Calculado como `Total - Alocado - Consumido`. Sempre `>= 0`. |

## Regra de negocio

### RN-SLD01 — Saldo Disponivel para Bolsas e Diarias

Em todo orcamento de Bolsa (M009) ou Diaria (M003) vinculado a Projeto, Edital ou Parceria, o sistema deve manter tres valores derivados:

- `valorAlocado` = soma dos valores de alocacoes ativas com pagamento ainda pendente (reservadas).
- `valorConsumido` = soma dos valores de alocacoes ja pagas (refletidas em `TransacaoFinanceira` de M014/M016).
- `valorDisponivel` = `valorTotal − valorAlocado − valorConsumido`.

### RN-SLD02 — Bloqueio de alocacao por saldo insuficiente

Toda nova alocacao de Bolsa ou Diaria deve ser rejeitada quando `valorAlocacaoSolicitada > valorDisponivel`. Sistema retorna erro `SALDO_INSUFICIENTE` e exibe a decomposicao `Total / Alocado / Consumido / Disponivel` para o operador.

### RN-SLD03 — Transicao Alocado → Consumido

Quando uma alocacao reservada e efetivamente paga (evento de pagamento confirmado em M014/M016):
- decrementa `valorAlocado` pelo valor da alocacao;
- incrementa `valorConsumido` pelo mesmo valor;
- `valorTotal` e `valorDisponivel` permanecem inalterados.

A transicao e **conservativa**: a soma `Alocado + Consumido` permanece igual ate cancelamento, devolucao ou estorno.

### RN-SLD04 — Cancelamento de alocacao libera saldo

Cancelamento de bolsa antes do pagamento ou desistencia de diaria aprovada decrementa `valorAlocado` e incrementa `valorDisponivel` pelo mesmo valor. `valorConsumido` nao e afetado.

### RN-SLD05 — Estorno reverte consumo

Estorno de pagamento ja efetuado (ver [estornos-prestacao-contas.md](estornos-prestacao-contas.md)) decrementa `valorConsumido` e incrementa `valorDisponivel` pelo mesmo valor. `valorAlocado` nao e afetado.

### RI-SLD1 — Invariante de soma

Em qualquer momento: `valorTotal == valorAlocado + valorConsumido + valorDisponivel`. Violacao indica inconsistencia e exige reconciliacao manual.

### RI-SLD2 — Nao-negatividade

`valorAlocado`, `valorConsumido` e `valorDisponivel` devem ser `>= 0`. `valorAlocado < 0` ou `valorConsumido < 0` indica falha de processamento de evento.

## Aplicacao em Bolsas (M009)

| Conceito | Origem operacional |
|----------|--------------------|
| Total | Orcamento previsto de bolsas no Projeto/Edital, em valor monetario derivado de `Cota × Nivel × Mensalidades` |
| Alocado | Bolsa concedida a bolsista com pagamentos futuros previstos mas ainda nao pagos |
| Consumido | Mensalidades pagas via Folha de Pagamento Bolsista (M004) |
| Disponivel | Saldo restante para novas concessoes de bolsa no mesmo orcamento |

Eventos que mudam o saldo:
- `BolsaConcedida` → +Alocado (mensalidades futuras)
- `MensalidadePaga` → −Alocado, +Consumido
- `BolsaCancelada` (sem pagamento) → −Alocado, +Disponivel
- `MensalidadeEstornada` → −Consumido, +Disponivel

## Aplicacao em Diarias (M003)

| Conceito | Origem operacional |
|----------|--------------------|
| Total | Orcamento previsto de diarias no Projeto/Iniciativa, derivado da rubrica de diarias |
| Alocado | Solicitacao de diaria aprovada (estado `Aprovada`) mas ainda nao paga |
| Consumido | Diaria efetivamente paga ao beneficiario |
| Disponivel | Saldo restante para novas solicitacoes |

Eventos que mudam o saldo:
- `SolicitacaoDiariaAprovada` → +Alocado
- `DiariaPaga` → −Alocado, +Consumido
- `SolicitacaoDiariaCancelada` ou `Indeferida` → −Alocado, +Disponivel
- `DiariaEstornada` → −Consumido, +Disponivel

## Diferenca em relacao a Parcerias (M010)

M010 ja possui conceitos similares mas em outro nivel: `valorBrutoRecebido`, `valorAlocadoEmProgramas`, `valorConsumido`, `saldoAlocavelEmProgramas` (RN15 + glossario sec 3). As regras RN-SLD01..05 deste documento aplicam-se ao **uso operacional do orcamento dentro do projeto** (Bolsa + Diaria), enquanto as regras M010 aplicam-se a **alocacao macro entre Parceria e Programa**. Os dois niveis convivem:

```
Parceria.Total
  → Parceria.valorAlocadoEmProgramas (RN15)
    → Programa.Total (recebido)
      → Projeto.Total (rubricas)
        → Bolsa.Total + Diaria.Total + outras rubricas (RN-SLD01)
```

## Open questions

1. Reembolso parcial de diaria (beneficiario devolve sobra apos viagem) — entra como estorno ou cria categoria `Devolvido`?
2. Bolsa suspensa temporariamente — `valorAlocado` permanece reservado ou volta para `Disponivel` ate reativacao?
3. Saldos sao calculados em tempo real ou materializados via projecao? Reconciliacao em job ou imediata por evento?
4. Em projeto multi-rubrica, saldo e por rubrica ou agregado por categoria (bolsas / diarias / outras)?

## Referencias

- [Glossario sec 6 — Gestao Orcamentaria](glossario.md#6-gestao-orcamentaria)
- [Estornos na Prestacao de Contas](estornos-prestacao-contas.md)
- [Regras de Calculo de Diarias ES](regras-calculo-diarias-es.md)
- M009 (Gestao Bolsista), M003 (Gestao Iniciativas Captadas), M013 (Gestao Orcamentaria Projeto), M014 (Prestacao de Contas)
