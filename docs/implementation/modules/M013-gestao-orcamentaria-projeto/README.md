# M013 - Gestao Orcamentaria do Projeto

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 04 — Fomento Post-Award](../../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da SolicitacaoOrcamentaria |

---

## Sobre o Modulo

Durante a execucao de um projeto, coordenadores precisam solicitar adicoes orcamentarias, incluir novas rubricas de despesa e realocar recursos entre rubricas. Atualmente, esses processos sao realizados por e-mail e formularios em papel, sem visibilidade em tempo real sobre o saldo orcamentario disponivel. Este modulo visa resolver esse problema ao prover uma gestao digital e integrada do orcamento do projeto, com rastreabilidade de todas as movimentacoes financeiras. O sucesso sera medido pela reducao do tempo medio de aprovacao de remanejamentos e pela eliminacao de inconsistencias entre saldo registrado e saldo real.

---

## Dominio

O orcamento do projeto nao e uma conta contabil. O M013 gerencia o planejamento/limite aprovado por rubricas da Iniciativa/Projeto. O M016 gerencia contas contabeis, fundos financeiros, contas bancarias, centros de custo, lancamentos, saldos financeiros e conciliacao.

| Conceito | Dono | Exemplo |
|----------|------|---------|
| Orcamento do projeto | M013 | Projeto com R$ 100.000,00 aprovados. |
| Rubrica orcamentaria do projeto | M013/M008 | Bolsas, diarias, material de consumo. |
| Conta contabil | M016 | Despesa com servicos de terceiros, receita de parceria. |
| Fundo financeiro | M016 | Carteira/fonte de recursos segregada. |
| Centro de custo | M016 | Area ou finalidade interna responsavel pelo gasto. |

A agencia de fomento concede recursos financeiros a projetos de pesquisa por meio de editais. Cada projeto possui um orcamento aprovado, distribuido em rubricas (categorias de despesa como diarias, passagens, material de consumo, servicos de terceiros, bolsas). Durante a execucao do projeto, e comum que o coordenador identifique a necessidade de ajustar o orcamento.

As principais operacoes orcamentarias sao: (1) adicoes orcamentarias, quando recursos adicionais sao solicitados a agencia de fomento; (2) inclusao de novas rubricas que nao estavam previstas originalmente no projeto; (3) remanejamento entre rubricas, quando recursos sao transferidos de uma categoria para outra; (4) realocacao de bolsas, quando cotas de bolsa sao redistribuidas entre modalidades ou niveis.

Todas essas operacoes exigem justificativa do coordenador e passam por analise da Area Tecnica da agencia de fomento. Adicoes orcamentarias requerem aprovacao formal da agencia de fomento. Remanejamentos acima de 25% do valor da rubrica de origem necessitam de aprovacao do Diretor.

O saldo de cada rubrica deve ser atualizado em tempo real, refletindo comprometimentos, pagamentos ja realizados (M004) e movimentacoes aprovadas. As rubricas disponiveis para um projeto devem estar previamente cadastradas no modulo de cadastros corporativos (M008).

> Projetos e editais sao gerenciados por M003. Pagamentos sao gerenciados por M004. Rubricas financeiras corporativas sao gerenciadas por M008 e especializadas neste modulo como RubricaProjeto. Este modulo consome essas informacoes para operacionalizar a gestao orcamentaria.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Toda solicitacao de adicao orcamentaria deve conter justificativa e requer aprovacao formal da agencia de fomento. | Must |
| RN02 | Remanejamento entre rubricas nao pode exceder 25% do valor da rubrica de origem sem aprovacao do Diretor. | Must |
| RN03 | A rubrica a ser incluida em um projeto deve existir no cadastro basico de rubricas (M008). | Must |
| RN04 | Todas as operacoes orcamentarias (adicao, inclusao, remanejamento, realocacao) exigem justificativa do coordenador. | Must |
| RN05 | O sistema deve manter trilha de auditoria completa de todas as movimentacoes orcamentarias. | Must |
| RN06 | O saldo de cada rubrica deve ser atualizado em tempo real apos aprovacao de qualquer movimentacao. | Must |
| RN07 | Realocacao de bolsas segue as mesmas regras de aprovacao do remanejamento entre rubricas. | Must |
| RN08 | Nao e permitido remanejamento que resulte em saldo negativo na rubrica de origem. | Must |
| RI1 | Uma solicitacao orcamentaria so pode ser submetida para projetos com status "Ativo". | Must |
| RI2 | O valor total do projeto apos adicao orcamentaria nao pode exceder o limite definido pelo edital, salvo autorizacao especial. | Should |
