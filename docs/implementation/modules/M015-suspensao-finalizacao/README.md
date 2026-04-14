# M015 - Suspensao e Finalizacao

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 04 — Fomento Post-Award](../../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida do Projeto (extensao de estados) |

---

## Sobre o Modulo

Projetos podem necessitar de suspensao temporaria (por solicitacao do coordenador ou decisao da agencia de fomento) ou de encerramento definitivo. Atualmente, nao existe um fluxo de trabalho estruturado para essas operacoes -- suspensoes e encerramentos sao comunicados informalmente, sem garantia de que pagamentos sejam bloqueados, bolsas sejam encerradas ou prestacoes de contas sejam exigidas. Este modulo visa resolver esse problema ao prover um fluxo digital completo para suspensao e finalizacao de projetos, garantindo que todas as pendencias sejam verificadas antes do encerramento. O sucesso sera medido pela taxa de projetos encerrados com todas as pendencias resolvidas e pelo tempo medio de processamento de suspensoes.

---

## Dominio

Durante a execucao de um projeto financiado pela agencia de fomento, situacoes podem exigir a suspensao temporaria ou o encerramento definitivo do projeto. A suspensao pode ser solicitada pelo coordenador (por motivo de forca maior, licenca, ou replanejamento) ou determinada pela agencia de fomento (por irregularidade, inadimplencia ou descumprimento de obrigacoes).

Um projeto suspenso tem todos os pagamentos bloqueados e nao pode ter novas bolsas alocadas. A reativacao exige aprovacao da Area Tecnica e, dependendo do motivo da suspensao, pode exigir documentacao complementar.

O encerramento definitivo de um projeto pode ocorrer por conclusao natural, por decisao do coordenador ou por determinacao da agencia de fomento. Antes de encerrar, o sistema deve verificar que todas as prestacoes de contas foram submetidas e aprovadas (M014) e que todas as bolsas ativas foram encerradas (M009). Um projeto encerrado e irreversivel.

> Projetos sao gerenciados por M003. Bolsas sao gerenciadas por M009. Pagamentos sao gerenciados por M004. Prestacao de contas e gerenciada por M014. Este modulo coordena a suspensao e finalizacao verificando pendencias nesses contextos.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Toda solicitacao de suspensao deve conter justificativa. | Must |
| RN02 | Um projeto suspenso tem todos os pagamentos bloqueados (M004) e nao permite alocacao de novas bolsas (M009). | Must |
| RN03 | A reativacao de projeto suspenso requer aprovacao da Area Tecnica. | Must |
| RN04 | O encerramento de projeto requer que todas as prestacoes de contas estejam submetidas e aprovadas (M014). | Must |
| RN05 | O encerramento de projeto requer que todas as bolsas ativas estejam encerradas (M009). | Must |
| RN06 | Um projeto encerrado e irreversivel -- nao pode ser reativado ou ter qualquer operacao realizada. | Must |
| RN07 | O sistema deve manter trilha de auditoria completa de todas as operacoes de suspensao e finalizacao. | Must |
| RN08 | A suspensao pode ser solicitada pelo coordenador ou determinada pela agencia de fomento. | Must |
| RI1 | Um projeto ja suspenso nao pode ser suspenso novamente. | Must |
| RI2 | Um projeto em processo de encerramento nao pode ser suspenso. | Must |
