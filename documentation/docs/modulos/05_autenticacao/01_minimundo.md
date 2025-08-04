---
sidebar_position: 1
---
# Propósito
O projeto tem como objetivo definir e controlar o acesso a objetos (e.g., papéis, rotas, documentos e dados) baseado em uma política de segurança.
        
## Minimundo

        Inicialmente, as políticas de segurança são definidas pelo Gestor de Políticas da organização. Uma política de segurança define regras de acesso aos objetos, por meio da definição de relações entre objetos. Por exemplo, podemos definir que todo analista (objeto do tipo papel) tem acesso de leitura a um documento do tipo Ata (objeto do tipo documento), ou podemos definir que o Vinícius (objeto do tipo usuário) tem acesso ao documento da ata do dia 21/12/2024 (instância do objeto do tipo documento).
        Além disso, as políticas são agrupadas, ou armazenadas, em um store, para melhorar a organização destas. 

        Todo sistema ou usuário utiliza o Muttley para verificar se tem acesso ou não a um objeto. Para isso, ele questiona se há ou não permissão baseada nas relações. Assim, o Muttley responde informando se o usuário pode realizar a ação com uma mensagem de aprovação ou reprovação. 
        
    
 