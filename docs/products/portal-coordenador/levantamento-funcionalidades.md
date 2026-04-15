# Levantamento de Funcionalidades

[← Voltar ao Portal Coordenador](README.md)

## Objetivo

Este documento inventaria as capacidades do sistema com foco no que ja existe no frontend atual. A organizacao e por capacidade de negocio, nao por pagina.

## Criterio de classificacao

- `Existente`: fluxo implementado com comportamento funcional claro.
- `Parcial`: fluxo ja iniciado, mas com lacunas relevantes.
- `Prototipo`: interface ou validacoes locais sem fechamento fim a fim.
- `Placeholder`: presenca apenas indicativa, sem regra funcional consolidada.

## 1. Autenticacao e sessao

| Capacidade | O que existe hoje | Status | Observacao |
|---|---|---|---|
| Login federado | acesso via Acesso Cidadao | Existente | fluxo principal de entrada do portal |
| Callback de autenticacao | recuperacao do usuario e redirecionamento para a home | Existente | conclui o retorno do login externo |
| Protecao de rotas | bloqueio de areas internas sem sessao valida | Existente | aplicado no roteador global |
| Refresh de sessao | renovacao periodica de cookie em background | Existente | reduz risco de expiracao durante uso |
| Logout | encerramento da sessao com retorno ao login | Existente | disponivel no cabecalho e na sidebar |

## 2. Contexto de projeto e navegacao

| Capacidade | O que existe hoje | Status | Observacao |
|---|---|---|---|
| Selecao de projeto ativo | troca do contexto do portal pelo projeto escolhido | Existente | afeta home, equipe, pagamentos, remanejamento e prestacao |
| Navegacao por perfil | esconde areas exclusivas quando o usuario nao e coordenador | Existente | combina menu e protecao de rota |
| Tema da aplicacao | alternancia entre claro e escuro | Existente | recurso transversal do shell |
| Idioma da aplicacao | alternancia entre `pt-BR` e `en` | Existente | ja exposto no cabecalho |
| Notificacoes do portal | botoes e card visual de notificacao | Parcial | ainda sem eventos reais identificados |
| Tratamento de erro por rota | tela dedicada para falhas com codigo de status | Existente | fallback geral do frontend |

## 3. Perfil do usuario e documentacao

| Capacidade | O que existe hoje | Status | Observacao |
|---|---|---|---|
| Edicao de dados pessoais | atualizacao de dados pessoais e academicos | Existente | inclui nome social, contato e curriculo |
| Gestao de enderecos | endereco residencial e profissional com busca por CEP | Existente | inclui definicao de endereco de correspondencia |
| Gestao bancaria | manutencao de dados Banestes com regras por periodo | Existente | considera bloqueio por marco da folha |
| Solicitacao de conta Banestes | pedido de conta quando o usuario nao possui uma | Existente | integrado ao fluxo de perfil |
| Upload de documentos solicitados | envio inicial de PDF por requisito | Existente | organizado por bolsa e requisito |
| Atualizacao e visualizacao de documentos | substituicao e consulta de arquivos enviados | Existente | inclui pre-visualizacao e abertura do arquivo |
| Revisao documental | exibicao de justificativa quando ha pedido de revisao | Existente | visivel no fluxo documental |
| Geracao de termo de responsabilidade | coleta declaracoes e gera o termo | Existente | inclui exclusao e nova geracao |

## 4. Gestao de projeto e equipe

| Capacidade | O que existe hoje | Status | Observacao |
|---|---|---|---|
| Visao consolidada do projeto | home do coordenador com resumo do projeto ativo | Existente | base para acompanhamento operacional |
| Visao individual da bolsa | home e meu projeto do participante com foco na bolsa | Existente | adaptado para usuario nao coordenador |
| Resumo financeiro do projeto | secao de meu projeto para coordenador | Existente | mostra orcamento e disponibilidade |
| Dashboard da equipe | orcamento, estatisticas e uso por modalidade | Existente | consolidado na area de equipe |
| Listagem de bolsistas | consulta paginada e filtravel de bolsistas do projeto | Existente | filtra por nome, data, modalidade e status |
| Consulta de documentos por bolsa | expansao da bolsa com leitura de documentos vinculados | Existente | carregamento sob demanda |
| Detalhes da bolsa | modal com informacoes de bolsa, orientador e plano | Existente | consulta detalhes adicionais ao abrir |
| Cadastro de bolsista | nova alocacao com orientador, modalidade, datas e plano | Existente | inclui area de conhecimento e atividades |
| Pagamento avancado na alocacao | distribuicao de meses no fluxo de alocacao | Existente | ja validado no formulario |
| Rascunho de alocacao | salvamento parcial da solicitacao | Existente | permite continuar edicao depois |
| Edicao de alocacao | reabertura e atualizacao de alocacao existente | Existente | aplicada ao fluxo de bolsa em edicao |
| Cancelamento de bolsa | cancelamento com justificativa e data fim de atividade | Existente | integrado por mutation |
| Entrada para aditivo | botao de estender bolsa em bolsas ativas | Parcial | regra completa de elegibilidade ainda nao esta fechada |

## 5. Pagamentos

| Capacidade | O que existe hoje | Status | Observacao |
|---|---|---|---|
| Historico de pagamentos | consulta pagamentos por projeto e filtros principais | Existente | inclui data, modalidade e status |

## 6. Prestacao financeira

| Capacidade | O que existe hoje | Status | Observacao |
|---|---|---|---|
| Listagem de transacoes | consulta paginada de transacoes financeiras | Existente | ponto de entrada do modulo |
| Criacao de prestacao a partir da transacao | gera prestacao quando a transacao ainda nao possui uma | Existente | acontece ao entrar no detalhe |
| Filtros da listagem | campos de busca, data, status e categoria | Parcial | ainda sem fechamento completo com backend |
| Processamento de nota fiscal | upload de PDF/XML e extracao de dados fiscais | Existente | etapa inicial do fluxo detalhado |
| Revisao dos itens da nota | ajuste manual de itens extraidos | Existente | permite corrigir descricao, quantidade e valor |
| Associacao contabil | vinculo de itens da nota a conta e subconta | Existente | etapa obrigatoria antes de avancar |
| Coleta de cotacoes | upload de ate tres orcamentos e escolha de um | Existente | ja inclui validacoes minimas |
| Observacoes complementares | campo de observacao disponivel no fluxo | Parcial | persistencia especifica nao foi identificada |
| Indicador orcamentario do modulo | cartao visual de progresso orcamentario | Placeholder | usa valores fixos no frontend |
| Submissao final da prestacao | envio da prestacao ao backend | Existente | fecha o fluxo principal do modulo |

## 7. Remanejamento

| Capacidade | O que existe hoje | Status | Observacao |
|---|---|---|---|
| Remanejamento de bolsas | ajuste de cotas por modalidade com base no projeto ativo | Existente | usa dados reais do projeto |
| Simulacao financeira | calculo de saldo, total previsto e percentual utilizado | Existente | retroalimenta a decisao do coordenador |
| Bloqueio por saldo negativo | impede envio quando o orcamento e excedido | Existente | regra ja presente na tela |
| Persistencia do remanejamento | envio do remanejamento ao backend com feedback | Existente | fluxo principal da aba de bolsa |
| Remanejamento interno | aba com CTA visual | Placeholder | sem fluxo funcional consolidado |
| Remanejamento FAPES | aba com CTA visual | Placeholder | sem fluxo funcional consolidado |

## 8. Aditivo de bolsa

| Capacidade | O que existe hoje | Status | Observacao |
|---|---|---|---|
| Tela inicial de aditivo | resumo da bolsa, novo fim, justificativa e impacto projetado | Prototipo | fluxo ainda guiado por dados de rota e validacoes locais |
| Validacoes de aditivo | extensao real, limite do projeto e disponibilidade de cotas | Prototipo | uteis, mas ainda nao fecham integracao |
| Confirmacao do aditivo | feedback local de envio | Prototipo | mutation real ainda nao identificada |
| Historico de aditivos | nao identificado no frontend atual | Placeholder | ja aparece como frente planejada no backlog |

## Prioridades funcionais sugeridas

1. Fechar o aditivo de bolsa do prototipo ate o fluxo operacional fim a fim.
2. Conectar os filtros, observacoes e o indicador orcamentario do modulo de prestacao financeira.
3. Concluir remanejamento interno e remanejamento FAPES.
4. Transformar notificacoes do portal em eventos reais do sistema.
