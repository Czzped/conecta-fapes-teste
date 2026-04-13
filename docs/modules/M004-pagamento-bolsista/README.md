# M004 - Pagamento de Bolsistas

[← Voltar ao Backlog Central](../../backlog-product.md) | [Domain 05 — Financeiro](../../discovery/domains/05-financeiro.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de EditalCompetencia, Folha e PagamentoBolsista |

---

## Sobre o Modulo

A geracao de folhas de pagamento e a comunicacao com Banestes e BANDES sao feitas por processos manuais, sujeitos a atrasos e erros que impactam diretamente os bolsistas. Este modulo resolve esse problema ao automatizar a geracao de folhas de pagamento e operacionalizar o pagamento via integracao direta com Banestes e BANDES, alem de gerar os documentos necessarios para anexacao no EDOCS. O sucesso sera medido pelo percentual de pagamentos processados no prazo e pela reducao de erros em folha.

---

## Dominio

A FAPES gerencia centenas de editais e projetos com milhares de bolsistas alocados. A cada mes e necessario contabilizar as bolsas dos editais sob responsabilidade de cada area tecnica a serem agrupadas em uma folha de pagamento que, apos autorizada, e enviada ao Banestes para que os pagamentos sejam feitos aos respectivos bolsistas.

O processo de pagamento ocorre em ciclos mensais que contam com tres marcos relevantes: Data Limite de Solicitacao de Bolsas (M1), Data Prevista de Geracao da Folha Normal (M2) e Data de Pagamento da Folha Normal (M3). Tais marcos devem ser definidos, mes a mes, em um calendario atual.

Cada ciclo mensal de pagamentos ocorre da seguinte maneira: os coordenadores de projeto solicitam novas alocacoes de bolsas ate o prazo limite de M1. No dia seguinte ao M1 (M1+1), os editais ativos e suas informacoes sobre bolsas sao listados para suas respectivas areas tecnicas para que elas decidam sobre sua liberacao para a folha. Cada area tecnica define os editais que deseja liberar (ou nao) o pagamento daquela competencia.

A partir do marco M2, a GEPOF pode monitorar a liberacao dos editais no mes e gerar uma folha de pagamento. Quando a folha e a primeira do mes, e dita Folha Normal; as seguintes sao Folhas Complementares. A geracao de uma folha de pagamento implica em relacionar todos os pagamentos dos bolsistas alocados a projetos dos editais que foram liberados pelas areas tecnicas naquele mes.

Uma vez gerada, a folha nao pode mais ter editais ou pagamentos alterados, mas podem ser geradas folhas complementares incluindo editais liberados posteriormente ou bolsistas com alocacao aprovada apos a geracao da folha anterior. Uma folha gerada tambem pode ser cancelada, para que seja gerada novamente com provaveis mudancas.

A DIRAF decide sobre a autorizacao ou rejeicao de uma folha gerada. Em caso de rejeicao, a folha fica cancelada, podendo ser gerada novamente. Em caso de autorizacao, a folha segue para pagamento no Banestes, a ser efetuado na data do marco M3.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Para definicao do Marco M1 (Data Limite de Solicitacao de Bolsas) serao aceitas apenas datas dentro do mes de competencia ou do mes anterior ao mes de competencia. | Must |
| RN02 | Para definicao do Marco M2 (Data Prevista de Geracao da Folha Normal) serao aceitas apenas datas dentro do mes de competencia. | Must |
| RN03 | Para definicao do Marco M3 (Data de Pagamento da Folha Normal) serao aceitas apenas datas dentro do mes de competencia ou do mes posterior ao mes de competencia. | Must |
| RN04 | O marco M1 pode ser editado ate o fim do dia atualmente definido para o marco. | Must |
| RN05 | O marco M2 pode ser editado ate o fim do dia anterior ao atualmente definido para o marco. | Must |
| RN06 | O marco M3 pode ser editado ate antes da efetiva geracao da Folha Normal do mes em questao. | Must |
| RN07 | Para cada mes, o marco M1 ocorre antes do marco M2 e o marco M2 ocorre antes do marco M3. | Must |
| RN08 | O marco M2 de um dado mes nao pode ocorrer depois que o marco M1 do mes seguinte. | Must |
| RN09 | Para cada mes, e recomendavel que haja uma distancia maior que 5 dias entre M1 e M2 e entre M2 e M3. | Must |
| RN10 | A Folha de uma competencia e considerada Normal quando e a primeira folha gerada a partir do marco M2. Se nao for a primeira, e considerada Folha Complementar. | Must |
| RN11 | Editais liberados que contem pendencia de avaliacao de bolsa nao precisarao de nova liberacao quando as bolsas forem aprovadas. As bolsas aprovadas ficam automaticamente disponiveis para gerar folha. | Must |
| RN12 | As areas so podem liberar os editais para a competencia do mes seguinte apos o marco M1 + 1 dia. | Must |
| RN13 | Quando um edital entra em uma folha ele nao pode mais sofrer alteracoes de decisao de liberacao. | Must |
| RN14 | Nao e possivel desfazer/cancelar uma folha autorizada. | Must |
| RN15 | Nao e possivel gerar uma nova folha se a ultima folha ainda estiver no estado Gerada (aguardando decisao de autorizacao ou cancelamento). | Must |
| RN16 | Caso uma folha do mes seja cancelada, a proxima acao de gerar folha daquele mes ira gera-la novamente (e nao gerar uma nova folha). | Must |
| RN17 | Em cada confirmacao de acao, os impactos potenciais da acao devem ser apresentados de forma clara e compreensivel ao usuario. | Must |
| RN18 | Instancias de EditalCompetencia sao criadas no estado "Sem Decisao" apos o marco M1 + 1 dia da competencia em questao. | Must |
| RN19 | Quando uma alocacao assume o status "Ativa", todas as cotas de pagamentos futuros do bolsista devem ser criadas com o status "Alocado". | Must |
| RN20 | Uma folha gerada so pode ser cancelada antes do M2 do mes seguinte. | Must |
| RN21 | Ao cancelar ou rejeitar uma folha, os Editais por Competencia envolvidos so voltam ao status "Liberado" se nao possuirem pagamentos incluidos em outra folha. | Must |
| RN22 | Ao cancelar ou rejeitar uma folha, os pagamentos incluidos sao desvinculados e retornam ao status "Alocado". | Must |
| RN23 | A data de pagamento de uma folha complementar e informada pelo Gerente GEPOF no momento da geracao. | Must |
| RN24 | A cada decisao sobre EditalCompetencia (Liberado ou Nao Liberado) deve ser criado um registro de DecisaoLiberacao com usuario, horario e justificativa (quando Nao Liberado). | Must |
| RN25 | A cada decisao sobre Folha (Gerar, Cancelar, Autorizar, Rejeitar) deve ser criado um registro de DecisaoFolha com usuario, horario e tipo de acao. | Must |
