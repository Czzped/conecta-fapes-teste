# M022 - Contratacao e Outorga

[Voltar ao Backlog Central](../../../management/backlog-product.md)

## Artefatos

| Artefato | Descricao |
|----------|-----------|
| [Backlog](backlog.md) | Epics e historias do modulo |
| [Contrato](contrato.md) | Operacoes publicas do modulo |
| [Contrato API](contrato-api.md) | Endpoints candidatos |
| [Modelo Estrutural](modelo-estrutural.md) | Entidades de contratacao e outorga |
| [Modelo Comportamental](modelo-comportamental.md) | Estados da contratacao/outorga |

## Visao Geral

O M022 formaliza a contratacao/outorga das propostas aprovadas no resultado final de uma captacao. Ele inicia apos o encerramento do processo de captacao no M011 e termina quando a iniciativa contratada/outorgada pode ser registrada no M003.

O modulo cobre a convocacao da proposta aprovada, conferencia dos requisitos finais, formalizacao do termo de outorga ou contrato, registro da data de outorga e encaminhamento da iniciativa para gestao pos-contratacao.

## Fronteiras

| Modulo | Relacao |
|--------|---------|
| M011 | Fornece propostas aprovadas no resultado final da captacao. |
| M003 | Recebe a iniciativa apos contratacao/outorga. |
| M008 | Fornece dados de pessoas, instituicoes e responsaveis. |

## Regras de Negocio

| ID | Regra | Prioridade |
|----|-------|------------|
| RN01 | Somente propostas aprovadas no resultado final da captacao podem iniciar contratacao/outorga. | Must |
| RN02 | A contratacao/outorga deve manter referencia para a captacao e para a proposta aprovada no M011. | Must |
| RN03 | A iniciativa somente deve ser registrada no M003 apos a formalizacao da contratacao/outorga. | Must |
| RN04 | Toda outorga deve registrar data de outorga e pessoa outorgada. | Must |
| RN05 | Contratacoes canceladas nao devem gerar iniciativa no M003. | Must |
