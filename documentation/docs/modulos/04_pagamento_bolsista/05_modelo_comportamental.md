---
sidebar_position: 5
---
# Modelos Comportamentais

### 10.1 Diagrama de Estados da Classe AlocacaoBolsista

![alt text](../../../../static/img/modulos/pagamento_bolsista/diagrama-estados-alocacao-bolsista.svg)

O DTE da classe AlocacaoBolsista exibe os estados possíveis da alocação e transições a partir de eventos do sistema. Os eventos considerados estão no escopo do módulo de Gestão de Bolsistas (a ser especificado). No entanto, alguns dos estados são relevantes a este módulo.
Quando uma bolsa é solicitada, ela não é considerada pelo Módulo de Pagamento até que seja enviada à FAPES e assuma os estados “Pendente de Avaliação” e “Em Avaliação”. Após aprovação, se torna “Ativa”, quando os pagamentos devem ser realizados, até que passe para outros estados que não fazem jus ao pagamento.


### 10.2 Diagrama de Estados da Classe EditalCompetencia

![alt text](../../../../static/img/modulos/pagamento_bolsista/diagrama-estados-edital-competencia.svg)

As instâncias da classe EditalCompetencia guardam informações quanto à liberação (ou não) de um Edital em uma dada Competência. Ela é criada no estado “Sem Decisão”, após o marco M1 + 1 dia da competência em questão (ou durante a importação de editais ativos). Exemplo: se o marco M1 é dia 05/09, no dia 06/09 são geradas as instâncias de EditalCompetencia de cada edital ativo para a competência Setembro. Um EditalCompetencia tem status inicial como “Sem Decisão”. O estado pode mudar para “Não Liberado” ou “Liberado” a depender da decisão da Àrea Técnica durante o evento Liberar Editais para Pagamento. Uma vez que a Folha da competência à qual esses editais estão associados foi gerada no evento Gerar Folha, o objeto passa para o estado “Incluído em Folha”, o que significa que os editais de folha não poderão ter sua decisão de liberação modificada. Caso a folha seja cancelada, o estado pode voltar para Liberado apenas se nenhum dos pagamentos de seu Edital estiver vinculado a qualquer folha gerada.

### 10.3 Diagrama de Estados da Classe Folha

![alt text](../../../../static/img/modulos/pagamento_bolsista/diagrama-estados-folha.svg)

Uma instância da classe Folha é criada com o status “Gerada” no evento Gerar Folha. O evento Cancelar Folha a leva para um status “Cancelada” e pode ser gerada novamente, caso os prazos permitam (antes do M2 do mês seguinte). Enquanto Gerada, a DIRAF pode realizar o evento Decidir sobre Autorização da Folha, levando para o estado “Autorizada” ou voltando para o estado “Cancelada”, caso a rejeite. 

A partir de uma folha “Autorizada” podem ser gerados os arquivos de pagamento. Ao realizar o evento Gerar  Remessa, a folha fica no estado “Em Agendamento”. Várias remessas podem ser enviadas, tendo o retorno do Banestes processado para cada envio. Quando no evento Processar Retorno de Pagamento é verificado que todas as remessas foram agendadas, a folha vai para o estado “Agendada”. Em seguida, é realizado o evento Solicitar Transferência ao Bandes no qual é solicitada a transferência de recursos para o pagamento da(s) guia(s) de liberação e a folha recebe o estado “Solicitado ao Bandes”.  

Para as remessas agendadas no Banestes, é necessária uma autorização de confirmação da Fapes para que o Banestes prossiga com a efetivação dos pagamentos. Uma vez que todas as remessas agendadas da folha foram autorizadas, a folha recebe o estado “Remessas Autorizadas”. Por fim, quando ao Processar DP9 verifica-se que todas as remessas estão efetivadas, a folha recebe o estado de “Paga”.

### 10.4 Diagrama de Estados da Classe PagamentoBolsista

![alt text](../../../../static/img/modulos/pagamento_bolsista/diagrama-estados-pagamento-bolsista.svg)

As instâncias da classe PagamentoBolsista são criadas com o estado “Alocado” quando a alocação do bolsista é aprovada (Módulo Gestão Bolsistas), gerando uma instância para cada mês ao qual o bolsista fará jus ao pagamento. Assim, se é aprovada uma alocação de bolsista para um período de 12 meses, são criadas 12 instâncias de PagamentoBolsista no estado “Alocado”. Este comportamento deve ser replicado quando as alocações são importadas (Módulo Importação Editais), garantindo que os pagamentos futuros tenham um objeto PagamentoBolsista que o represente.
Quando o evento Gerar Folha é realizado, se um PagamentoBolsista é incluído na folha, ele passa para o estado “Em Folha”. Se esta folha é cancelada pelo evento Cancelar Folha ou rejeitada pelo evento Rejeitar Folha, o objeto fica sem folha associada e, portanto, retorna ao estado “Alocado”.

Após a autorização da folha, os pagamentos são enviados para o Banestes para agendamento via arquivo de remessa e o status dos pagamentos passa a ser “Enviado”. Se o arquivo de remessa for processado sem erros pelo Banestes e portanto os pagamentos foram agendados, o status passa para “Agendado”. Quando o evento Gerar Remessa é realizado, se uma instância de PagamentoBolsista fizer parte da remessa que será enviada ao Banestes, ela recebe o estado “Enviado”. Caso os dados bancários informados pelo bolsista não sejam do banco Banestes, o PagamentoBolsista recebe o estado “Incluído em GL Alternativa”. 

Após o processamento da remessa pelo Banestes e envio do retorno é realizado o evento Processar Retorno, em caso de falha, o estado de PagamentoBolsista é alterado para “Falha Agendamento”. Quando as falhas forem resolvidas é possível gerar uma nova remessa, até que não haja mais falhas. Quando não é possível realizar o agendamento dos pagamentos apesar de diversas tentativas, e o evento de Encaminhar para guia de liberação alternativa é realizado, o estado de PagamentoBolsista é atualizado para “Incluído em GL Alternativa”. Se ao processar o retorno não houverem falhas, significa que o pagamento foi agendado no Banestes, logo o estado de PagamentoBolsista é atualizado para “Agendado”. 

Para os Pagamentos feitos via remessa Banestes, quando o evento Processar DP9 é realizado e o estado da remessa for “Efetivada”, o PagamentoBolsista recebe o estado “Pago”. Para os pagamentos fora da remessa, os objetos de PagamentoBolsista recebem o estado de “Pago” quando o evento Solicitar Transferência ao Bandes é realizado.

### 10.5 Diagrama de Estados da Classe Remessa

![alt text](../../../../static/img/modulos/pagamento_bolsista/diagrama-estados-remessa.svg)

Uma Remessa tem seus pagamentos gerados a partir de uma folha de pagamentos autorizada. A cada transição de estado da remessa no sistema do Banestes, um arquivo é enviado do próprio Banestes comunicando a alteração de estado. Esse arquivo é processado e indica qual o status atual da remessa.
Após ser gerada e enviada ao Banestes a Remessa recebe o estado “Enviada”. O Banestes recebe a Remessa e os pagamentos processados com sucesso ficam aguardando por uma autorização de confirmação da Fapes no sistema do Banestes. Quando o pagamento é autorizado pela Fapes, o estado da Remessa passa a ser “Autorizada”. Quando o pagamento da remessa é efetuado, a Remessa recebe o estado “Efetivada”.

Cada Alocação efetuada precisa de um cadastro correspondente no sistema do Banestes, para que os pagamentos referentes à ela possam ser efetuados, posteriormente. Quando uma Alocação passa para o status “ativo”, o estado de cadastro no banestes se torna “Pendente”. Em seguida, as alocações com status pendente são reunidas em uma remessa de cadastro que é enviada ao Banestes, nesse momento o estado de cadastro no banestes da alocação torna-se “Enviado”. O Banestes envia um arquivo de retorno contendo informações de quais alocações foram processadas com sucesso e quais não foram cadastradas. Para as alocações processadas com sucesso, o estado passa a ser “Cadastrado”. Para as alocações sinalizadas com erro, o estado retorna para “Pendente”.

### 10.6 Diagrama de Estados da Classe AlocacaoBolsista sob a perspectiva do cadastro no Banestes

![alt text](../../../../static/img/modulos/pagamento_bolsista/diagrama-estados-alocacao-banestes.svg)

Cada Alocação efetuada precisa de um cadastro correspondente no sistema do Banestes, para que os pagamentos referentes à ela possam ser efetuados, posteriormente. Quando uma Alocação passa para o status “ativo”, o estado de cadastro no banestes se torna “Pendente”. Em seguida, as alocações com status pendente são reunidas em uma remessa de cadastro que é enviada ao Banestes, nesse momento o estado de cadastro no banestes da alocação torna-se “Enviado”. O Banestes envia um arquivo de retorno contendo informações de quais alocações foram processadas com sucesso e quais não foram cadastradas. Para as alocações processadas com sucesso, o estado passa a ser “Cadastrado”. Para as alocações sinalizadas com erro, o estado retorna para “Pendente”.
