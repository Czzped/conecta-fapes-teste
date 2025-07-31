---
sidebar_position: 3
---
# Casos de Uso

O modelo de casos de uso captura e descreve as funcionalidades que o sistema provê a seus atores. No módulo Importação de Editais foi identificado um único ator com um único caso de uso, organizados em eventos.

| Ator            | Descrição           |
|-------------------|--------------------|
|**Gerente da Área Técnica**|Responsável pela concepção de editais, monitora a solicitação de bolsas, avaliação dos critérios e alocação de bolsista em projetos e liberação da folha de pagamento desses bolsistas |

![alt text](casos_uso.jpg)


O caso de uso Importar Dados de Editais provê os eventos necessários à importação e sincronização de dados do SigFapes para o ConectaFapes e ao preenchimento de informações complementares relativas à quantidade de cotas de bolsas já pagas e ao cancelamento de alocações.

# Descrição dos Casos de Uso

Nos eventos de caso de uso não foram descritos os fluxos alternativos referentes a validação de dados e cancelamento da execução do evento. Esses fluxos são considerados padrão e devem ser observados em todos os eventos. A validação de dados deve respeitar as definições do Dicionário de Dados.

## UC04. Importar Dados de Editais (UC de Transição)
Pré-Condição: Deve ser feita uma carga no banco de dados a fim de trazer para a base do ConectaFapes os dados relativos a Áreas Técnicas, Editais, Modalidades de Bolsas e Níveis de Bolsa, conforme Tabela de Recuperação de Dados.

### UC04.0 Definir Editais a Sincronizar
O objetivo deste evento é permitir que o usuário defina quais editais terão seus projetos, alocações e bolsistas importados para o ConectaFapes e frequentemente sincronizados.

1. O Sistema exibe uma lista de editais (do SigFapes), contendo o nome e a data de criação.
2. O Gerente da Área Técnica seleciona quais os editais (do SigFapes) deseja importar para que tenha os dados 1.sincronizados para o ConectaFapes, informa a Área Técnica ao qual esses editais estão relacionados e confirma.
3. O Sistema salva cada edital com a área técnica informada e status de importação “a importar” e o acrescenta à lista de editais a sincronizar.
4. A lista de editais a sincronizar exibe, de cada edital, o nome, a área técnica, o status de importação, a data e hora da última sincronização, a quantidade de projetos com preenchimento de dados completos e a quantidade total de projetos.
5. O sistema importa para a base do ConectaFapes, para cada edital, os seus Projetos, Alocações e Bolsistas, conforme a coluna “Importação” da Tabela de Recuperação de Dados.
6. Após a importação, cada edital recebe o status “importado”, para que tenha seus dados sincronizados sempre que o evento Sincronizar Dados de Editais for realizado e esteja disponível para Completar Dados de Alocações.


### UC04.1 Completar Dados de Alocações
O objetivo deste caso de uso é permitir que o usuário complete os dados das alocações importadas, informando a quantidade de cotas pagas em cada alocação de um projeto (pois essa informação não existe no Sigfapes) e a data de fim de atividades das alocações canceladas, a fim de que o projeto passe a ser considerado pelas funcionalidade de pagamento do Conecta Fapes (status “completo”).

1. O Gerente da Área Técnica seleciona um dentre os editais importados.
2. O Sistema exibe um resumo de informações do edital selecionado, incluindo nome, área técnica, data e hora da última sincronização, quantidade de projetos, quantidade de projetos completos, quantidade de alocações, quantidade de alocações completas. 
3. O Sistema exibe, de cada projeto do edital selecionado, o nome, o status e o status de preenchimento de dados (“Incompleto” ou “Completo”), 
4. O Sistema exibe, para cada alocação do projeto, o nome do bolsista, a quantidade de cotas pagas, a quantidade total de cotas e o status da alocação. Caso a alocação esteja no status “cancelada”, é exibida ainda a data de fim das atividades.
5. O Gerente da Área Técnica, para cada alocação não pendente, informa ou altera a quantidade de cotas pagas a cada bolsista e/ou a data de fim de atividades.
6. Os dados da alocação são salvos e, caso as informações de quantidade de cotas pagas e data de fim de atividades tenham sido informadas para todas as alocações do projeto, o status de preenchimento do projeto é alterado para “Completo”.


### UC04.2 Sincronizar Dados de Editais
Os dados de projetos, alocações e bolsistas do ConectaFapes devem estar sincronizados com os dados do SigFapes imediatamente antes de qualquer ação, no ConectaFapes, que envolva sua alteração ou geração de novos dados a partir deles (RNF03). O objetivo deste evento é realizar tal sincronização a fim de garantir o atendimento desse requisito.

1. O sistema importa do SigFapes para o ConectaFapes os dados de novos Editais, novos Projetos, novas Alocações e novos Bolsistas e atualiza os dados dos Editais, Projetos, Alocações e Bolsistas já existentes na base, conforme a coluna “Sincronização” da Tabela de Recuperação de Dados.
2. O sistema gera um relatório listando as ocorrências relevantes, descritas na coluna “Sincronização” da Tabela de Recuperação de Dados.

## Tabela de Recuperação de Dados do SigFapes para o ConectaFapes
A tabela a seguir define o que ocorre nos três contextos de importação para cada entidade relevante neste módulo.
* Colchetes ([]) denotam condições para que as ações ocorram.
* Asterisco (*) denota quais dados devem ser atualizados ou importados para a base.
* Seta (→) denota ação necessária sobre os dados.
* O atributo <ins>ident</ins> denota o identificador do registro no SigFapes, mantido para sincronização.



 