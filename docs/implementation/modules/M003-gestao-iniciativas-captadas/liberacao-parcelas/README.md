# Liberacao de Parcelas da Iniciativa

[← Voltar ao M003](../README.md)

> **Status: Em Homologacao** — As regras normativas deste subfluxo estao sendo validadas com a area juridica e financeira da FAPES. Os percentuais, prazos e composicao da PCTF podem ser alterados pela Resolucao CCAF 340/2024 em relacao a 122/2014. Nao iniciar implementacao sem confirmacao das regras com a FAPES.

## Objetivo

Esta pasta concentra a especificacao do subfluxo de **solicitacao e validacao de liberacao de parcelas** no M003. O fluxo pertence ao M003 porque a decisao sobre se uma parcela pode ser liberada depende do estado de execucao financeira da iniciativa (comprometimento minimo de 60%) e do estado da prestacao de contas anterior (M014). O ato financeiro de pagamento pertence ao M004, que e acionado por evento apos a aprovacao da solicitacao.

## Documentos

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | Epico, historias e rastreabilidade do subfluxo |
| [Ontologia](ontology.yaml) | Entidades, enums, axioms, invariants e workflows |
| [Processo](processo.md) | Fluxo de solicitacao, validacao automatica e aprovacao |
| [Epico principal](epics/EPIC-M003-009.md) | Epico de liberacao de parcelas |

## Fronteiras

| Contexto | Responsabilidade |
|----------|------------------|
| M003 | Dono de `SolicitacaoLiberacaoParcela` e `ParcelaProjeto`; executa validacao automatica das condicoes de liberacao; emite evento para M004 |
| M014 | Expoe estado da PCTF anterior (APRESENTADA vs APROVADA); nao e dono do processo de liberacao |
| M004 | Recebe evento e executa o pagamento/liberacao financeira; nao decide se pode liberar |
| M008 | Fonte dos dados de certidoes e situacao de inadimplencia do beneficiario |

## Regras-chave

- Segunda parcela exige: PCTF anterior APRESENTADA + comprometimento >= 60% da primeira parcela.
- Terceira parcela (e seguintes) exige: PCTF anterior APROVADA + comprometimento >= 60% da parcela anterior.
- Qualquer solicitacao e bloqueada por inadimplencia FAPES ou certidoes invalidas (Federal, Estadual, Municipal, Trabalhista/FGTS).
- O resultado da validacao deve ser preservado como snapshot auditavel em `ValidacaoLiberacaoParcela`.
- M003 nao executa o pagamento — emite `LiberacaoParcelaSolicitada` para M004.

## Fontes Normativas

- Resolucao CCAF 122/2014, itens 9.2.1, 9.2.2 e 9.4
- Resolucao CCAF 340/2024 (alteracoes posteriores)
- Discovery detalhado: [Regras de Liberacao de Parcelas](../../../../discovery/regras-liberacao-parcelas.md)
