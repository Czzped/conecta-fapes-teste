# Estornos na Prestacao de Contas

## Definicao

Estorno e um credito bancario de terceiro que anula um debito anterior do mesmo valor. No contexto da prestacao de contas, o caso tipico ocorre quando um vendedor, fornecedor, operadora ou prestador devolve o valor de uma compra que nao foi concluida, cancelada ou nao entregue.

O estorno nao deve ser tratado como rendimento, receita nova ou saldo livre. Ele deve ser pareado ao debito original para demonstrar que a saida financeira foi revertida. Esse pareamento pode ocorrer mesmo que o debito original ainda esteja sem prestacao de contas, sem justificativa e sem validacao pela FAPES.

## Exemplo de negocio

| Data | Movimento | Operacao | Classificacao | Valor | Interpretacao |
|------|-----------|----------|---------------|-------|----------------|
| 10/04/2026 | Pagamento ao fornecedor por compra nao concluida | DEBITO | DESPESA | R$ 1.250,00 | Saida bancaria que reduziu o saldo do projeto e ainda pode estar sem prestacao de contas. |
| 12/04/2026 | Devolucao do fornecedor pela compra cancelada | CREDITO | ESTORNO | R$ 1.250,00 | Entrada bancaria que anula o debito anterior antes ou durante a prestacao. |

Resultado liquido do par:

| Debito | Credito de estorno | Saldo liquido |
|--------|--------------------|---------------|
| R$ 1.250,00 | R$ 1.250,00 | R$ 0,00 |

## Regras de classificacao

- O estorno sempre nasce de uma transacao financeira de credito.
- O credito deve vir de terceiro relacionado ao debito original.
- O valor do credito deve ser igual ao valor do debito estornado.
- O debito original pode estar sem prestacao de contas, sem justificativa cadastrada e sem validacao pela FAPES.
- O sistema deve manter o vinculo entre o credito de estorno e o debito original.
- Durante a elaboracao ou apos a existencia de uma prestacao, o Coordenador pode associar um credito de estorno disponivel ao debito correspondente para levar o par para a conciliacao.
- Se a prestacao ja tiver sido submetida ou finalizada, a associacao deve ser registrada como ajuste conciliatorio pos-prestacao, preservando a submissao original.
- Quando o pareamento nao for seguro, o credito deve permanecer como `PENDENTE_CLASSIFICACAO`.
- O estorno nao deve gerar nova rubrica nem nova despesa; ele apenas anula o efeito financeiro do debito original.

## Diferencas conceituais

| Conceito | O que representa | Exemplo |
|----------|------------------|---------|
| Debito | Saida bancaria da conta do projeto | Pagamento ao fornecedor |
| Credito | Entrada bancaria na conta do projeto | Devolucao, rendimento ou outro credito |
| Estorno | Credito de terceiro que anula debito anterior | Fornecedor devolve valor de compra cancelada |
| Rendimento | Credito financeiro gerado pela aplicacao/saldo bancario | Rendimento mensal da conta |
| TransacaoFinanceira | Movimento bancario importado/conciliado | Linha do CNAB 240 |
| Transacao | Movimento de saldo orcamentario por rubrica no M013 | Comprometimento, execucao ou reversao de rubrica |

## Impacto nos modulos

| Modulo | Responsabilidade |
|--------|------------------|
| M014 - Prestacao de Contas | Importar, classificar e conciliar debitos e creditos; parear estorno com debito original mesmo quando o debito ainda esta sem prestacao de contas. |
| M013 - Gestao Orcamentaria | Refletir o efeito consolidado no saldo da rubrica quando o debito/estorno afetar execucao orcamentaria. |
| M016 - Contabilidade e Financeiro | Tratar classificacao contabil final e conciliacao financeira institucional quando aplicavel. |

## Perguntas abertas

- Definir quais metadados do CNAB 240 serao usados para identificar automaticamente o terceiro que devolveu o valor.
- Definir tolerancia de pareamento: inicialmente, o estorno deve exigir valor exatamente igual ao debito; divergencias devem ir para revisao manual.
- Definir se um credito parcial deve ser modelado como estorno parcial ou como pendencia de regularizacao.
