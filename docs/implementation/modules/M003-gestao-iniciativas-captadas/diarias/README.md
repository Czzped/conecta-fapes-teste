# Diarias da Iniciativa

[← Voltar ao M003](../README.md)

## Objetivo

Esta pasta concentra a especificacao do subfluxo de **solicitacao operacional de diarias** no M003. O fluxo pertence ao M003 porque nasce durante a execucao da iniciativa, referencia a rubrica de diaria correspondente ao tipo de viagem, gera transacao de comprometimento e precisa existir antes da prestacao de contas.

O M014 apenas referencia uma `SolicitacaoDiaria` aprovada automaticamente pelo fluxo de saldo/aceite quando o coordenador comprova o pagamento na prestacao de contas.

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
| M003 | Criar e gerir `SolicitacaoDiaria`, `BeneficiarioDiaria` e `TermoAceiteDiaria`, gravando referencias/snapshots dos cadastros corporativos e acionando validacoes de saldo |
| M008 | Cadastro de `TipoViagem`, `TipoDiaria`, dados de pessoa fisica e conta bancaria do bolsista |
| M009 | Validacao de bolsistas/alocacoes da iniciativa |
| M013/M016 | Cadastro/saldo de rubricas e integracao contabil-financeira quando aplicavel |
| M014 | Comprovacao posterior da diaria aprovada na prestacao de contas |
| M020 | Notificacao na Home e na lateral do Front-Office, alem de e-mails de pendencias de aceite e aceite realizado |

## Regras-chave

- A FAPES deve cadastrar os tipos de diaria no M008 antes de novas solicitacoes, informando valor, data de vigencia, fracao de calculo e tipo de viagem.
- O cadastro dos tipos de diaria pertence ao M008 e deve ficar em **Configuracoes > Referencias Corporativas > Diarias** no Backoffice.
- A FAPES deve cadastrar os tipos de viagem no M008 em **Configuracoes > Referencias Corporativas > Tipos de Viagem** no Backoffice, sem valor unitario.
- O tipo de viagem classifica o deslocamento; o tipo de diaria concentra o valor vigente vinculado ao tipo de viagem.
- No M003, `TipoViagem` e `TipoDiaria` sao apenas referencias externas e snapshots na `SolicitacaoDiaria`; nao sao entidades do submodelo de diarias.
- A tela operacional **Diarias** do Backoffice deve ser usada para consulta, filtros, paginacao e acompanhamento dos lancamentos, sem aprovacao manual e sem formulario de manutencao de regras ou valores.
- Ao criar a solicitacao, o sistema deve localizar o tipo de diaria vigente para o tipo de viagem selecionado, associar sua referencia (`tipoDiariaRef`) e persistir o snapshot do valor unitario, da fracao de calculo e da regra de calculo da normativa FAPES.
- O coordenador nao informa manualmente o valor da diaria.
- A solicitacao deve possuir um ou mais bolsistas/alocacoes validas.
- Cada bolsista deve assinar termo de aceite, confirmando ciencia da diaria e aceite de recebimento na conta bancaria cadastrada.
- Quando houver diaria pendente de aceite para o usuario logado, a Home do Front-Office deve exibir a mensagem na secao **Notificacoes** e tambem na lateral de notificacoes.
- Ao criar diaria com aceite pendente, o sistema deve enviar e-mail ao bolsista; ao registrar o aceite, deve enviar e-mail ao coordenador/ortogado.
- A criacao da solicitacao gera `Transacao` de comprometimento vinculado a `RubricaProjeto` correspondente ao tipo de viagem quando houver saldo disponivel; nao ha permissao/aprovacao manual da FAPES.
- A diaria solicitada com saldo e viagem futura fica `ALOCADA` ate a conclusao dos aceites ou ate remocao/regularizacao.
- A remocao de diaria `ALOCADA` ou `APROVADA` exige justificativa, so pode ocorrer antes da data/hora de partida e gera transacao de reversao na mesma `RubricaProjeto`.
- Rubrica e categoria: a rubrica classifica e limita; a `Transacao` movimenta saldo; a transacao financeira/bancaria aparece apenas na prestacao/conciliacao em M014/M016.
- Depois da data/hora de partida, diaria nao utilizada deve seguir regularizacao propria com justificativa e auditoria, sem exclusao fisica.
