# Aditivos da Projeto

[← Voltar ao M003](../README.md)

## Objetivo

Esta pasta concentra a especificacao do subfluxo de **consulta de vigencia e aditivos** no M003. O fluxo pertence ao M003 porque acompanha a projeto apoiada durante sua execucao, preservando a vigencia original, a vigencia vigente, o orcamento original e os impactos formais de aditivos de tempo e/ou financeiros.

## Documentos

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | Epico, historias e rastreabilidade do subfluxo |
| [Modelo Estrutural](modelo-estrutural.md) | Entidades, campos e relacionamentos de aditivos |
| [Processo](processo.md) | Fluxo de consulta no Front-Office e Projetos |
| [Contrato](contrato.md) | Consultas, eventos e integracoes |
| [Contrato API](contrato-api.md) | Endpoints REST sugeridos |
| [Epico principal](epics/EPIC-M003-008.md) | Epico de vigencia e aditivos |

## Fronteiras

| Contexto | Responsabilidade |
|----------|------------------|
| M003 | Consultar vigencia, orcamento original, indicadores e dados dos aditivos da projeto |
| M010/M022 | Origem de dados formais de aprovacao, contratacao/outorga e termos aditivos quando aplicavel |
| M013/M016 | Referencias orcamentarias e financeiras para impactos de valor |
| M014 | Prestacao de contas considera a vigencia e os valores vigentes, mas nao e dona da consulta de aditivos |

## Regras-chave

- A projeto deve preservar data de aprovacao original, data inicial, data final original, data final vigente e orcamento original.
- A data final vigente so deve mudar por aditivo de tempo aprovado.
- O orcamento original deve permanecer historico, mesmo que existam aditivos financeiros.
- A aba **Dados dos aditivos** deve listar os aditivos vinculados ao projeto quando existirem.
- Quando nao houver aditivos, a aba deve exibir estado vazio objetivo.
- Cada aditivo deve indicar tipo, situacao, data de formalizacao, impacto de prazo/valor e documento de referencia quando disponivel.
