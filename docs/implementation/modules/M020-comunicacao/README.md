# M020 - Comunicacao

[<< Voltar ao Backlog Central](../../backlog-product.md) | [Domain 06 -- Suporte e Inteligencia](../../discovery/domains/06-suporte-inteligencia.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da Notificacao |

---

## Sobre o Modulo

A plataforma ConectaFAPES necessita de um servico centralizado de notificacao e comunicacao para todos os modulos. Atualmente, as notificacoes para usuarios (mudancas de status de bolsas, lembretes de prazo, solicitacoes de aprovacao) sao feitas manualmente ou simplesmente nao existem, gerando atrasos, perda de prazos e retrabalho. Este modulo resolve esse problema ao prover um servico transversal de envio de notificacoes por email, gerenciamento de templates, comunicados em massa e lembretes automaticos de prazo. O sucesso sera medido pela taxa de entrega de notificacoes, pela reducao de prazos perdidos e pela adocao do servico pelos demais modulos.

---

## Dominio

O servico de comunicacao da FAPES e transversal a toda a plataforma. Cada modulo gera eventos que demandam notificacao aos usuarios envolvidos: a indicacao de um bolsista (M009) precisa notificar o orientador; a aprovacao de uma prestacao de contas (M014) precisa notificar o coordenador; o vencimento de uma bolsa precisa alertar a Area Tecnica.

As notificacoes sao enviadas por email usando o remetente institucional no-reply@fapes.es.gov.br. Cada tipo de notificacao utiliza um template pre-configurado que suporta variaveis dinamicas (nome do destinatario, edital, prazo, status). O sistema realiza ate 3 tentativas de envio em caso de falha.

Existem notificacoes mandatorias (relacionadas a prazos e pagamentos) que nao permitem opt-out pelo usuario, e notificacoes informativas que podem ser configuradas pelo usuario. Comunicados em massa (para todos os bolsistas de um edital, por exemplo) requerem aprovacao do Diretor antes do envio.

Todas as notificacoes sao registradas no historico para auditoria e rastreabilidade.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Todas as notificacoes sao enviadas usando o remetente no-reply@fapes.es.gov.br. | Must |
| RN02 | Templates de notificacao suportam variaveis dinamicas: nome, edital, prazo, status, valor, entre outras. | Must |
| RN03 | Em caso de falha no envio, o sistema realiza ate 3 tentativas antes de marcar como falha definitiva. | Must |
| RN04 | Notificacoes mandatorias (prazo, pagamento) nao permitem opt-out pelo usuario. | Must |
| RN05 | Comunicados em massa requerem aprovacao do Diretor antes do envio. | Must |
| RN06 | Todas as notificacoes enviadas sao registradas no historico para auditoria. | Must |
| RN07 | Lembretes automaticos de prazo sao enviados com antecedencia configuravel (padrao: 30, 15 e 7 dias). | Should |
| RN08 | O servico de notificacao e consumido por todos os demais modulos da plataforma via API interna. | Should |
| RN09 | O sistema deve suportar envio de pelo menos 1000 emails por hora para comunicados em massa. | Should |
