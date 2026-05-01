# Diarias da Iniciativa

[← Voltar ao M003](../README.md)

## Objetivo

Esta pasta concentra a especificacao do subfluxo de **solicitacao operacional de diarias** no M003. O fluxo pertence ao M003 porque nasce durante a execucao da iniciativa, compromete a rubrica de **Diarias e Passagens** e precisa existir antes da prestacao de contas.

O M014 apenas referencia uma `SolicitacaoDiaria` aprovada quando o coordenador comprova o pagamento na prestacao de contas.

## Documentos

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | Epicos, historias e rastreabilidade do subfluxo |
| [Modelo Estrutural](modelo-estrutural.md) | Entidades, estados e relacoes de diarias |
| [Processo](processo.md) | Fluxo operacional ponta a ponta |
| [Contrato](contrato.md) | Comandos, consultas, eventos e integracoes |
| [Contrato API](contrato-api.md) | Endpoints REST sugeridos |
| [Epico principal](epics/EPIC-M003-006.md) | Epico de solicitacao de diarias |

## Fronteiras

| Contexto | Responsabilidade |
|----------|------------------|
| M003 | Solicitar diaria por tipo de viagem, calcular com o tipo de diaria vigente vinculado ao tipo de viagem, coletar aceite, aprovar/rejeitar, debitar rubrica, cancelar e creditar |
| M008 | Dados de pessoa fisica e conta bancaria do bolsista |
| M009 | Validacao de bolsistas/alocacoes da iniciativa |
| M013/M016 | Cadastro/saldo de rubricas e integracao contabil-financeira quando aplicavel |
| M014 | Comprovacao posterior da diaria aprovada na prestacao de contas |
| M020 | Notificacao de pendencias de aceite |

## Regras-chave

- A FAPES deve cadastrar os tipos de diaria antes de novas solicitacoes, informando valor, data de vigencia, fracao de calculo e tipo de viagem.
- O cadastro dos tipos de diaria deve ficar em **Configuracoes > Referencias Corporativas > Diarias** no Backoffice.
- A FAPES deve cadastrar os tipos de viagem em **Configuracoes > Referencias Corporativas > Tipos de Viagem** no Backoffice, sem valor unitario.
- O tipo de viagem classifica o deslocamento; o tipo de diaria concentra o valor vigente vinculado ao tipo de viagem.
- A tela operacional **Diarias** do Backoffice deve ser usada para consulta, filtros, paginacao, aprovacao/rejeicao e acompanhamento dos lancamentos, sem formulario de manutencao de regras ou valores.
- Ao criar a solicitacao, o sistema deve localizar o tipo de diaria vigente para o tipo de viagem selecionado, associar sua referencia (`tipoDiariaRef`) e persistir o snapshot do valor unitario, da fracao de calculo e da regra de calculo da normativa FAPES.
- O coordenador nao informa manualmente o valor da diaria.
- A solicitacao deve possuir um ou mais bolsistas/alocacoes validas.
- Cada bolsista deve assinar termo de aceite, confirmando ciencia da diaria e aceite de recebimento na conta bancaria cadastrada.
- A aprovacao da FAPES gera debito/comprometimento na rubrica **Diarias e Passagens**.
- O cancelamento de diaria aprovada exige justificativa e gera credito de reversao na mesma rubrica.
