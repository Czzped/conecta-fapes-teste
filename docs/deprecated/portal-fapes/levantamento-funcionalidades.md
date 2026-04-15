# Levantamento de Funcionalidades

> **Documento depreciado.** Migrado para [products/portal-coordenador/levantamento-funcionalidades.md](../../products/portal-coordenador/levantamento-funcionalidades.md).

## Objetivo

Este documento inventaria as capacidades do sistema com foco no que já existe no frontend atual. A organização é por capacidade de negócio, não por página.

## Critério de classificação

- `Existente`: fluxo implementado com comportamento funcional claro.
- `Parcial`: fluxo já iniciado, mas com lacunas relevantes.
- `Protótipo`: interface ou validações locais sem fechamento fim a fim.
- `Placeholder`: presença apenas indicativa, sem regra funcional consolidada.

## 1. Autenticação e sessão

| Capacidade | O que existe hoje | Status | Observação |
| --- | --- | --- | --- |
| Login federado | acesso via Acesso Cidadão | Existente | fluxo principal de entrada do portal |
| Callback de autenticação | recuperação do usuário e redirecionamento para a home | Existente | conclui o retorno do login externo |
| Proteção de rotas | bloqueio de áreas internas sem sessão válida | Existente | aplicado no roteador global |
| Refresh de sessão | renovação periódica de cookie em background | Existente | reduz risco de expiração durante uso |
| Logout | encerramento da sessão com retorno ao login | Existente | disponível no cabeçalho e na sidebar |

## 2. Contexto de projeto e navegação

| Capacidade | O que existe hoje | Status | Observação |
| --- | --- | --- | --- |
| Seleção de projeto ativo | troca do contexto do portal pelo projeto escolhido | Existente | afeta home, equipe, pagamentos, remanejamento e prestação |
| Navegação por perfil | esconde áreas exclusivas quando o usuário não é coordenador | Existente | combina menu e proteção de rota |
| Tema da aplicação | alternância entre claro e escuro | Existente | recurso transversal do shell |
| Idioma da aplicação | alternância entre `pt-BR` e `en` | Existente | já exposto no cabeçalho |
| Notificações do portal | botões e card visual de notificação | Parcial | ainda sem eventos reais identificados |
| Tratamento de erro por rota | tela dedicada para falhas com código de status | Existente | fallback geral do frontend |

## 3. Perfil do usuário e documentação

| Capacidade | O que existe hoje | Status | Observação |
| --- | --- | --- | --- |
| Edição de dados pessoais | atualização de dados pessoais e acadêmicos | Existente | inclui nome social, contato e currículo |
| Gestão de endereços | endereço residencial e profissional com busca por CEP | Existente | inclui definição de endereço de correspondência |
| Gestão bancária | manutenção de dados Banestes com regras por período | Existente | considera bloqueio por marco da folha |
| Solicitação de conta Banestes | pedido de conta quando o usuário não possui uma | Existente | integrado ao fluxo de perfil |
| Upload de documentos solicitados | envio inicial de PDF por requisito | Existente | organizado por bolsa e requisito |
| Atualização e visualização de documentos | substituição e consulta de arquivos enviados | Existente | inclui pré-visualização e abertura do arquivo |
| Revisão documental | exibição de justificativa quando há pedido de revisão | Existente | visível no fluxo documental |
| Geração de termo de responsabilidade | coleta declarações e gera o termo | Existente | inclui exclusão e nova geração |

## 4. Gestão de projeto e equipe

| Capacidade | O que existe hoje | Status | Observação |
| --- | --- | --- | --- |
| Visão consolidada do projeto | home do coordenador com resumo do projeto ativo | Existente | base para acompanhamento operacional |
| Visão individual da bolsa | home e meu projeto do participante com foco na bolsa | Existente | adaptado para usuário não coordenador |
| Resumo financeiro do projeto | seção de meu projeto para coordenador | Existente | mostra orçamento e disponibilidade |
| Dashboard da equipe | orçamento, estatísticas e uso por modalidade | Existente | consolidado na área de equipe |
| Listagem de bolsistas | consulta paginada e filtrável de bolsistas do projeto | Existente | filtra por nome, data, modalidade e status |
| Consulta de documentos por bolsa | expansão da bolsa com leitura de documentos vinculados | Existente | carregamento sob demanda |
| Detalhes da bolsa | modal com informações de bolsa, orientador e plano | Existente | consulta detalhes adicionais ao abrir |
| Cadastro de bolsista | nova alocação com orientador, modalidade, datas e plano | Existente | inclui área de conhecimento e atividades |
| Pagamento avançado na alocação | distribuição de meses no fluxo de alocação | Existente | já validado no formulário |
| Rascunho de alocação | salvamento parcial da solicitação | Existente | permite continuar edição depois |
| Edição de alocação | reabertura e atualização de alocação existente | Existente | aplicada ao fluxo de bolsa em edição |
| Cancelamento de bolsa | cancelamento com justificativa e data fim de atividade | Existente | integrado por mutation |
| Entrada para aditivo | botão de estender bolsa em bolsas ativas | Parcial | regra completa de elegibilidade ainda não está fechada |

## 5. Pagamentos

| Capacidade | O que existe hoje | Status | Observação |
| --- | --- | --- | --- |
| Histórico de pagamentos | consulta pagamentos por projeto e filtros principais | Existente | inclui data, modalidade e status |

## 6. Prestação financeira

| Capacidade | O que existe hoje | Status | Observação |
| --- | --- | --- | --- |
| Listagem de transações | consulta paginada de transações financeiras | Existente | ponto de entrada do módulo |
| Criação de prestação a partir da transação | gera prestação quando a transação ainda não possui uma | Existente | acontece ao entrar no detalhe |
| Filtros da listagem | campos de busca, data, status e categoria | Parcial | ainda sem fechamento completo com backend |
| Processamento de nota fiscal | upload de PDF/XML e extração de dados fiscais | Existente | etapa inicial do fluxo detalhado |
| Revisão dos itens da nota | ajuste manual de itens extraídos | Existente | permite corrigir descrição, quantidade e valor |
| Associação contábil | vínculo de itens da nota a conta e subconta | Existente | etapa obrigatória antes de avançar |
| Coleta de cotações | upload de até três orçamentos e escolha de um | Existente | já inclui validações mínimas |
| Observações complementares | campo de observação disponível no fluxo | Parcial | persistência específica não foi identificada |
| Indicador orçamentário do módulo | cartão visual de progresso orçamentário | Placeholder | usa valores fixos no frontend |
| Submissão final da prestação | envio da prestação ao backend | Existente | fecha o fluxo principal do módulo |

## 7. Remanejamento

| Capacidade | O que existe hoje | Status | Observação |
| --- | --- | --- | --- |
| Remanejamento de bolsas | ajuste de cotas por modalidade com base no projeto ativo | Existente | usa dados reais do projeto |
| Simulação financeira | cálculo de saldo, total previsto e percentual utilizado | Existente | retroalimenta a decisão do coordenador |
| Bloqueio por saldo negativo | impede envio quando o orçamento é excedido | Existente | regra já presente na tela |
| Persistência do remanejamento | envio do remanejamento ao backend com feedback | Existente | fluxo principal da aba de bolsa |
| Remanejamento interno | aba com CTA visual | Placeholder | sem fluxo funcional consolidado |
| Remanejamento FAPES | aba com CTA visual | Placeholder | sem fluxo funcional consolidado |

## 8. Aditivo de bolsa

| Capacidade | O que existe hoje | Status | Observação |
| --- | --- | --- | --- |
| Tela inicial de aditivo | resumo da bolsa, novo fim, justificativa e impacto projetado | Protótipo | fluxo ainda guiado por dados de rota e validações locais |
| Validações de aditivo | extensão real, limite do projeto e disponibilidade de cotas | Protótipo | úteis, mas ainda não fecham integração |
| Confirmação do aditivo | feedback local de envio | Protótipo | mutation real ainda não identificada |
| Histórico de aditivos | não identificado no frontend atual | Placeholder | já aparece como frente planejada no backlog |

## Prioridades funcionais sugeridas

1. Fechar o aditivo de bolsa do protótipo até o fluxo operacional fim a fim.
2. Conectar os filtros, observações e o indicador orçamentário do módulo de prestação financeira.
3. Concluir remanejamento interno e remanejamento FAPES.
4. Transformar notificações do portal em eventos reais do sistema.
