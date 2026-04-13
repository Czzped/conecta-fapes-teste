# M012 - Acompanhamento e Resultados

[<- Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 04 -- Fomento Post-Award](../../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida do RelatorioTecnico |

---

## Sobre o Modulo

Apos a contratacao de projetos, a agencia de fomento precisa acompanhar a execucao e gerenciar resultados tecnicos. Atualmente, nao ha dashboard consolidado para os diferentes perfis (coordenador, agencia de fomento, SECONT) e as submissoes de relatorios e suas analises ocorrem fora do sistema, por e-mail e documentos avulsos. Este modulo visa resolver esse problema ao prover dashboards de acompanhamento por perfil, gestao de relatorios tecnicos com fluxo de analise e contestacao, e controle de solicitacoes de alteracao em projetos. O sucesso sera medido pela taxa de relatorios analisados no prazo e pela disponibilidade de informacoes consolidadas nos dashboards.

---

## Dominio

A agencia de fomento, apos contratar projetos de pesquisa por meio de editais, precisa acompanhar a execucao e coletar os resultados tecnicos produzidos. O acompanhamento envolve tres perfis com necessidades distintas:

O Coordenador do projeto precisa de uma visao consolidada da execucao do seu projeto: prazos, entregas pendentes, relatorios submetidos e solicitacoes de alteracao. O perfil agencia de fomento (Area Tecnica) precisa de uma visao gerencial de todos os projetos em andamento, com indicadores de desempenho, relatorios pendentes de analise e solicitacoes de alteracao a avaliar. O perfil SECONT (auditoria externa) precisa de uma visao somente-leitura para fins de fiscalizacao.

Os resultados tecnicos sao formalizados por meio de relatorios tecnicos submetidos pelo coordenador conforme cronograma definido no edital. A Area Tecnica da agencia de fomento analisa cada relatorio, podendo aprova-lo ou reprova-lo com justificativa. Em caso de reprovacao, o coordenador pode contestar a decisao dentro de 15 dias. A contestacao e reanalisada pela Area Tecnica, que emite uma decisao final.

Alteracoes no projeto (escopo, cronograma, equipe, orcamento) podem ser solicitadas pelo coordenador durante a execucao. Cada solicitacao requer justificativa e e analisada pela Area Tecnica, que registra a decisao de deferimento ou indeferimento.

> Projetos e editais sao gerenciados por M003. Neste ciclo documental, o acompanhamento permanece focado em iniciativas operacionalizadas como Projeto. O modulo M002 atua apenas como integracao legada quando necessario.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Somente projetos contratados aparecem nos dashboards de acompanhamento. | Must |
| RN02 | Relatorios tecnicos sao exigidos conforme cronograma definido no edital. | Must |
| RN03 | O coordenador pode contestar a reprovacao de um relatorio dentro de 15 dias corridos apos a notificacao. | Must |
| RN04 | O dashboard SECONT e somente-leitura, sem possibilidade de edicao ou intervencao. | Must |
| RN05 | Solicitacoes de alteracao requerem justificativa e aprovacao da Area Tecnica. | Must |
| RN06 | Um relatorio tecnico so pode ser submetido se o projeto estiver com status ativo. | Must |
| RN07 | A contestacao deve conter justificativa e documentos complementares. | Must |
| RN08 | Apos a decisao final (aprovacao ou reprovacao definitiva), nao cabe nova contestacao. | Must |
| RN09 | Solicitacoes de alteracao nao podem ser submetidas apos o encerramento do projeto. | Must |
| RI1 | Um relatorio tecnico nao pode ser submetido para um periodo ja coberto por outro relatorio aprovado. | Must |
| RI2 | Uma solicitacao de alteracao nao pode ser registrada se ja existe outra pendente de analise para o mesmo projeto. | Should |
