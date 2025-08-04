---
sidebar_position: 1
---
# Propósitos do Módulo
O módulo Pagamento de Bolsistas visa permitir o controle de pagamentos mensais aos bolsistas de editais da FAPES.
Esta especificação tem como Escopo a Definição de Calendário, Liberação de Editais, Geração de Folha e Autorização de Folha. Para efeito dos eventos descritos, são considerados apenas Editais já importados e Projetos (exceto de capacitação e UNAC) com status de preenchimento completo.
Serão alvo da próxima versão da especificação a geração, envio e processamento de arquivos de pagamento ao Banestes e a criação de documentos para o E-DOCs.
        
## Minimundo
A FAPES gerencia centenas de editais e projetos com milhares de bolsistas alocados. A cada mês é necessário contabilizar as bolsas dos editais sob responsabilidade de cada área técnica a serem agrupadas em uma folha de pagamento que, após autorizada, é enviada ao Banestes para que os pagamentos sejam feitos aos respectivos bolsistas.
O processo de pagamento ocorre em ciclos mensais que contam com três marcos relevantes: Data Limite de Solicitação de Bolsas (M1), Data Prevista de Geração da Folha Normal (M2) e Data de Pagamento da Folha Normal (M3). Tais marcos devem ser definidos, mês a mês, em um calendário atual.
Assim, cada ciclo mensal de pagamentos ocorre da seguinte maneira:
Os coordenadores de projeto solicitam novas alocações de bolsas até o prazo limite de M1 (até o final do dia).
No dia seguinte ao M1 (M1+1), os editais ativos, e suas informações sobre bolsas (tais como quantidade bolsas vigentes, novas, pendentes e valores), são listados para suas respectivas áreas técnicas para que elas decidam sobre sua liberação para a folha.
Cada área técnica define os editais que deseja liberar (ou não) o pagamento daquela competência (ou anteriores, se pendentes). Em geral, os editais são liberados após a resolução de bolsas pendentes (aprovação ou negação das alocações solicitadas).
A partir do marco M2, a GEPOF pode monitorar a liberação dos editais no mês e gerar uma folha de pagamento. Quando a folha é a primeira do mês, é dita Folha Normal, as seguintes são Folhas Complementares.
A geração de uma folha de pagamento implica em relacionar todos os pagamentos dos bolsistas alocados a projetos dos editais que foram liberados pelas áreas técnicas naquele mês.
Uma vez gerada, a folha não pode mais ter editais ou pagamentos alterados, mas podem ser geradas folhas complementares incluindo editais liberados posteriormente ou bolsistas com alocação aprovada após a geração da folha anterior. Uma folha gerada também pode ser cancelada, para que seja gerada novamente com prováveis mudanças.
A DIRAF decide sobre a autorização ou rejeição de uma folha gerada. Em caso de rejeição, a folha fica cancelada, podendo ser gerada novamente.
Em caso de autorização, a folha segue para pagamento no Banestes, a ser efetuado na data do marco M3.
Ao longo de cada ciclo, são gerados documentos referentes às decisões de geração e autorização da folha, para serem anexados aos processos no E-DOCs.

Como exemplo, considere o seguinte cenário focado no curso normal de eventos de pagamento (exceções estão especificadas ao longo do documento).
No mês de outubro de 2024, a Área Técnica GEINOV possui 10 editais ativos (Alfa, Beta, Gama etc.), cada um com 5 projetos com 10 bolsistas cada. Temos, portanto, 500 bolsistas ativos na GEINOV. Antes do marco M1, o coordenador do projeto Alfa-01, do edital Alfa, solicita a inclusão de mais 4 bolsistas a seu projeto.
A partir de M1+1 (ex: dia 06/10), o Gerente da GEINOV visualiza a sua lista de 10 editais, cada um com 50 bolsistas, tendo o edital Alfa 4 pendências. À medida que as pendências são resolvidas por meio da avaliação das solicitações, o número de pendências diminui, incrementando-se o número de bolsistas ativos, caso aprovadas. Quando os técnicos da GEINOV aprovam 3 das solicitações e reprovam 1, o gerente visualiza o edital Alfa com 53 bolsistas ativos e, não havendo mais pendências, decide liberar todos os seus 10 editais para a folha.
Ao chegar a M2 (ex.: dia 15/10), o Gerente da GEPOF, visualiza um resumo de todas as áreas e observa que a GEINOV não possui mais editais a liberar, já tendo liberado editais totalizando 503 bolsistas no valor de R$ 503.000,00. A GEPOF avalia a situação de liberação da GEINOV e das outras áreas, e decide prosseguir com a geração da folha. Um resumo é exibido e o gerente confirma, gerando uma Folha de Pagamento Normal para o mês de Outubro, totalizando R$ 2.503.000,00 em bolsas, com os pagamentos a serem efetivados em M3 (ex:. 31/10). A Folha Normal de Outubro considera todos os pagamentos da competência de Outubro dos bolsistas alocados aos projetos dos editais liberados pelas áreas da FAPES.
Com a folha gerada, a Diretora Administrativa (DIRAF) avalia os pagamentos previstos e autoriza o pagamento da Folha. O processo segue para que o BANDES libere os recursos e o Banestes realize os pagamentos.

 