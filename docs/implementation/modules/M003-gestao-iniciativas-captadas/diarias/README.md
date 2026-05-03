# Diarias da Iniciativa

[← Voltar ao M003](../README.md)

## Objetivo

Esta pasta concentra a especificacao do subfluxo de **solicitacao operacional de diarias** no M003. O fluxo pertence ao M003 porque nasce durante a execucao da iniciativa, referencia a rubrica de diaria correspondente a abrangencia da viagem, gera transacao de comprometimento e precisa existir antes da prestacao de contas.

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
| [Discovery de regras de calculo](../../../../discovery/regras-calculo-diarias-es.md) | Regras normativas e operacionais baseadas na calculadora SEP e decretos estaduais |

## Fronteiras

| Contexto | Responsabilidade |
|----------|------------------|
| M003 | Criar e gerir `SolicitacaoDiaria`, gravando `alocacaoBolsistaRef`, dados de aceite, referencias/snapshots dos cadastros corporativos e acionando validacoes de saldo |
| M008 | Cadastro de `Abrangencia`, `TipoDiaria`, `ParametroCalculoDiaria` vinculado ao tipo, dados de pessoa fisica e conta bancaria do bolsista |
| M009 | Validacao de bolsistas/alocacoes da iniciativa |
| M013 | `RubricaProjeto`, saldo orcamentario e `Transacao` de comprometimento/reversao |
| M016 | Integracao contabil-financeira quando aplicavel |
| M014 | Comprovacao posterior da diaria aprovada na prestacao de contas |
| M020 | Notificacao na Home e na lateral do Front-Office, alem de e-mails de pendencias de aceite e aceite realizado |

## Analise de Foco

O M003 deve tratar a diaria como **solicitacao operacional da iniciativa**. O modelo proprio do subfluxo fica restrito a uma entidade:

- `SolicitacaoDiaria`, com `alocacaoBolsistaRef` do M009, dados da viagem, roteiro/trechos, abrangencia selecionada ou calculada conforme regra vigente, parametros de calculo usados, snapshots de valor, aceite, estado e justificativas.

Rubrica nao deve ser modelada como entidade interna do M003. A solicitacao apenas referencia a `RubricaProjeto` do M013 para validar orcamento/saldo e referencia as `Transacao` geradas para comprometer ou reverter saldo.

## Regras-chave

- A FAPES deve cadastrar os tipos de diaria no M008 antes de novas solicitacoes, informando abrangencia, valor e data de vigencia, e deve cadastrar os parametros de calculo vinculados a cada tipo.
- O cadastro dos tipos de diaria pertence ao M008 e deve ficar em **Configuracoes > Referencias Corporativas > Diarias** no Backoffice.
- A abrangencia classifica o deslocamento por classe corporativa do M008; nao ha cadastro editavel de tipo de viagem.
- No M003, `TipoDiaria` e `ParametroCalculoDiaria` sao apenas referencias externas e snapshots na `SolicitacaoDiaria`; nao sao entidades do submodelo de diarias.
- A tela operacional **Diarias** do Backoffice deve ser usada para consulta, filtros, paginacao e acompanhamento dos lancamentos, sem aprovacao manual e sem formulario de manutencao de regras ou valores.
- Ao criar a solicitacao, o sistema deve localizar o tipo de diaria vigente para a `abrangenciaRef` selecionada, localizar os parametros de calculo vigentes vinculados a esse tipo, associar suas referencias (`abrangenciaRef`, `tipoDiariaRef` e `parametroCalculoDiariaRef`) e persistir snapshots do valor unitario e da regra de calculo da normativa FAPES.
- Para viagens nacionais ou internacionais, deslocamentos internos de apoio, como municipio de residencia ate aeroporto/rodoviaria, devem ser registrados no roteiro para auditoria e memoria de calculo.
- **Duvida para PO:** definir se esses trechos internos de apoio devem compor uma unica diaria pela maior abrangencia da viagem ou se devem gerar diarias separadas por trecho, pois a decisao pode aumentar ou reduzir o valor consumido da rubrica.
- Enquanto essa duvida nao for decidida, a documentacao deve tratar o roteiro como dado obrigatorio de memoria, mas nao fechar a regra de consumo financeiro.
- A distancia entre municipios do ES deve ser usada para elegibilidade somente quando a abrangencia final da solicitacao for **Dentro do Estado**.
- As regras de quantidade, acrescimos, bloqueios e memoria de calculo devem seguir o discovery [Regras de Calculo de Diarias - ES](../../../../discovery/regras-calculo-diarias-es.md), versionado pela norma vigente.
- O coordenador nao informa manualmente o valor da diaria.
- Cada solicitacao deve possuir exatamente uma `alocacaoBolsistaRef` valida no M009, vinculada a iniciativa.
- O aceite fica registrado na propria `SolicitacaoDiaria`, confirmando ciencia da diaria e aceite de recebimento na conta bancaria cadastrada.
- Quando houver diaria pendente de aceite para o usuario logado, a Home do Front-Office deve exibir a mensagem na secao **Notificacoes** e tambem na lateral de notificacoes.
- Ao criar diaria com aceite pendente, o sistema deve enviar e-mail ao bolsista; ao registrar o aceite, deve enviar e-mail ao coordenador/ortogado.
- A criacao da solicitacao gera `Transacao` de comprometimento vinculado a `RubricaProjeto` correspondente a abrangencia quando houver saldo disponivel; nao ha permissao/aprovacao manual da FAPES.
- A diaria solicitada com saldo e viagem futura fica `ALOCADA` ate a conclusao dos aceites ou ate remocao/regularizacao.
- A remocao de diaria `ALOCADA` ou `APROVADA` exige justificativa, so pode ocorrer antes da data/hora de partida e gera transacao de reversao na mesma `RubricaProjeto`.
- Rubrica e categoria: a rubrica classifica e limita; a `Transacao` movimenta saldo; a transacao financeira/bancaria aparece apenas na prestacao/conciliacao em M014/M016.
- Depois da data/hora de partida, diaria nao utilizada deve seguir regularizacao propria com justificativa e auditoria, sem exclusao fisica.

## Municipios limitrofes

Municipios limitrofes sao municipios que fazem divisa territorial direta entre si. No fluxo de diarias, esse conceito e usado como uma regra objetiva de elegibilidade para viagens **Dentro do Estado**, principalmente quando nao ha pernoite.

Na solicitacao de diaria, o coordenador seleciona a origem e o destino. O sistema deve consultar a matriz de municipios limitrofes do ES e calcular automaticamente se a combinacao origem/destino e limitrofe. Esse campo nao deve ser informado manualmente pelo coordenador.

Quando a viagem for dentro do Estado, sem pernoite, e origem/destino forem municipios limitrofes, a regra de calculo pode bloquear a geracao de diaria ou aplicar o tratamento definido pela norma vigente. A decisao final deve ficar registrada na memoria de calculo da `SolicitacaoDiaria`.

A matriz operacional fica em [data/municipios-limitrofes-es.json](data/municipios-limitrofes-es.json), com os municipios do ES e os pares de divisa usados para consulta automatica.
