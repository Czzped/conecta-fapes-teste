# M014 - Prestacao de Contas

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 04 — Fomento Post-Award](../../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de PrestacaoContas e Contestacao |

---

## Sobre o Modulo

Coordenadores devem submeter documentos fiscais que comprovem a aplicacao dos recursos do projeto. A agencia de fomento analisa e pode rejeitar documentos, e a SECONT realiza auditorias. Atualmente, esse processo e inteiramente baseado em papel e e-mail, sem fluxo digital, sem rastreabilidade e sem reconciliacao automatica entre extrato bancario e despesas declaradas. Este modulo visa resolver esse problema ao digitalizar todo o ciclo de prestacao de contas, desde a importacao do extrato bancario ate a auditoria da SECONT. O sucesso sera medido pela reducao do tempo medio de analise da prestacao de contas e pela taxa de prestacoes aprovadas na primeira submissao.

---

## Dominio

A agencia de fomento exige que coordenadores de projetos prestem contas dos recursos recebidos, comprovando cada despesa por meio de documentos fiscais (notas fiscais, recibos, bilhetes aereos, comprovantes de diarias). A prestacao de contas e organizada por rubrica, e cada documento fiscal deve estar vinculado a uma rubrica do orcamento aprovado.

O fluxo de prestacao de contas segue as seguintes etapas: (1) o Coordenador importa o extrato bancario da conta do projeto; (2) submete os documentos fiscais organizados por tipo de despesa (servicos, produtos, diarias, passagens); (3) a Area Tecnica da agencia de fomento analisa os documentos, verificando conformidade com as rubricas e consistencia com o extrato bancario; (4) caso haja irregularidades, a prestacao e recusada com justificativa; (5) o Coordenador pode contestar a recusa dentro de 15 dias; (6) a Area Tecnica reanalisa a contestacao; (7) apos aprovacao final, a SECONT pode solicitar auditoria a qualquer momento.

O Coordenador possui 30 dias apos o encerramento do periodo para submeter a prestacao de contas. Uma prestacao aprovada e considerada final e irreversivel. Cada rubrica do orcamento deve ser reconciliada com os documentos fiscais submetidos.

> Projetos e editais sao gerenciados por M003. Orcamentos e rubricas do projeto sao gerenciados por M013. Este modulo consome essas informacoes para operacionalizar a prestacao de contas.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Todos os documentos fiscais devem conter nota fiscal (NF) ou documento equivalente valido. | Must |
| RN02 | O extrato bancario importado deve ser conciliado com as despesas declaradas na prestacao de contas. | Must |
| RN03 | O Coordenador possui 30 dias apos o encerramento do periodo para submeter a prestacao de contas. | Must |
| RN04 | O Coordenador pode contestar uma recusa dentro de 15 dias a partir da data da notificacao de rejeicao. | Must |
| RN05 | A SECONT pode solicitar documentos adicionais a qualquer momento durante a auditoria. | Must |
| RN06 | Uma prestacao de contas aprovada em carater final e irreversivel. | Must |
| RN07 | Cada rubrica do orcamento do projeto deve ser reconciliada com os documentos fiscais submetidos. | Must |
| RN08 | Documentos fiscais devem estar vinculados a uma rubrica do projeto. | Must |
| RN09 | O sistema deve manter trilha de auditoria completa de todas as operacoes sobre a prestacao de contas. | Must |
| RI1 | Uma prestacao de contas so pode ser submetida para projetos com prestacoes anteriores aprovadas ou sem prestacoes pendentes. | Must |
| RI2 | A soma dos documentos fiscais de uma rubrica nao pode exceder o saldo aprovado da rubrica no modulo M013. | Must |
