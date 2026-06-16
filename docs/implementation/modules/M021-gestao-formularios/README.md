# M021 - Gestao de Formularios

[Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 06 - Suporte e Inteligencia](../../../discovery/domains/06-suporte-inteligencia.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta |
| [Backlog](backlog.md) | EPICs e rastreabilidade do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Entidades de formulario, versao, campos e classificacao |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida da versao do formulario |

---

## Sobre o Modulo

O M021 centraliza a base de formularios reutilizaveis da FAPES. O Gestor da FAPES pode criar, editar, publicar, inativar e consultar formularios, além de criar, editar e consultar respostas aos formulários. A ideia é que as funções deste módulo sejam utilizadas para criar e gerenciar formulários a serem usados com diversas finalidades em outros módulos do ConectaFapes. O primeiro uso será no módulo M011 para submissao de propostas de projetos, avaliação de habilitação e avaliacao ad hoc.
Uma aplicação ilustrativa deste módulo se dá no contexto da criação de um fomento/captação. Os dados a serem informados sobre cada proposta de projeto variam de um fomento para outro. Assim a ideia é que este módulo seja usado para se criar os formulários a serem preenchidos pelos proponentes que submetem propostas aos fomentos. Assim ao criar um fomento o técnico da Fapes selecionará o formulário a ser preenchido pelos proponentes. Desta forma, o mesmo formulário poderá ser utilizado em vários fomentos.
Quando um proponente for submeter uma proposta, ele deverá fornecer várias informações que são comuns a todos os fomentos e preencher as respostas ao formulário selecionado para o fomento em questão. Assim, para cada submissão a um fomento existirá uma resposta ao formulário de subissão associado ao fomento em questão. Importante notar que o módulo M021 não é responsável por implementar as regras de submissão ou a associação de formulários a itens do domínio específico (como fomento, por exemplo). Ele apenas provê as funcionalidades referentes ao ciclo de vida de formulários.
---

## Descrição do Domínio

Um `Formulario` representa um instrumento reutilizavel de coleta de informacoes. Um formulario terá um título, uma descrição e será composto por seções, sendo cada seção composta por questões. As questões podem ser de diversos tipos: texto, numérico, verdadeiro ou falso, seleção, entre outros. Também deve ser possível configurar algumas regras de validação sobre as respostas como número mínmo de caracterres, range de valores em inteiros, entre outras.
Haverá duas formas de criar um formulário: iniciando do zero ou criando uma cópia de um formulário existente para fazer alterações nele. Em qualquer das duas formas, o novo formulário será criado no estado "Em edição" e, enquanto estiver neste estado, poderá ser editado, se mantendo neste estado.
Ao finalizar a edição, o usuário publicará o edital (estado "Publicado") o que o deixará visível a outros módulos para que seja utilizado e não permitirá que ele seja editado. Caso o usuário identifique a necessidade de realizar alguma alteração em um formulário "Publicado", ele deverá reverter sua publicação, de modo que o formulário volte ao estado "Em edição" para que alterações sejam possíveis.
Quando o módulo for notificado de que um formulário "Publicado" foi utilizado por outro módulo, o estado deste formulário será alterado para "Utilizado" e o formulário não poderá mais ter sua publicação revertida e, com isso, não poderá ser alterado em hipótese alguma durante o resto de seu ciclo de vida.
Quando um formulário é utilizado por outro módulo, respostas a ele podem ser registradas. Por exemplo, quando um formulário é selecionado para ser o formulário de submissão de um fomento, cada proposta submetida ao fomento deve registrar uma resposta a este formulário.
Quando o usuário julgar que algum formulário "Publicado" ou "Utilizado" está desatualizado e não deve mais ser utilizado, ele deverá inativar o formulário (estado "Inativo"). A inativação impede que o edital seja utilizado por outros módulos, mas não impede que novas respostas a ele sejam postadas (por exemplo, o formulário não poderá ser selecionado para novos fomentos, mas poderá continuar sendo respondido por proponentes submetendo propostas a fomentos que o use). Formulários só poderão ser excluídos enquanto estiverem "Em Edição".
Para facilitar a organização e a busca por formulários, o módulo permitirá que o usuário crie categorias para classificar os formulários. Cada categoria terá um nome e uma descrição. Cada formulário poderá ser classificado em zero ou mais categorias.
Existirão 3 tipos de formulários, a saber: formulário de caracterização, formulário de habilitação e formulário de avaliação.
Formulários de caracterização serão utilizados para coletar informações que caracterizem um objeto qualquer do conecta. Assim poderão conter perguntas de todos os tipos e não farão qualquer tipo de cômputo sobre as respostas. Um exemplo de utilização de formulário deste tipo será na submissão de propostas. Neste exemplo o formulário será associado ao fomento e cada resposta caracterizará uma proposta submetida ao fomento, estando associada à proposta.
Formulários de habilitação serão utilizados para julgar a habilitação ou não de um objeto de acordo com um conjunto de critérios. Cada critério será mapeado como uma questão que terá como possibilidades de respostas "Sim", "Não", "Não se aplica" ou "Rever" e ainda deve ter um campo texto no qual o respondedor possa justificar sua resposta. Todas as questões de um questionário de habilitação seguirão este mesmo formato. Com base nas respostas às questões, será computado o resultado da resposta, seguindo a seguinte regra: Caso alguma questão tenha sido respondida como "Rever", o resultado será "Rever". Caso contrário, se alguma resposta for "Não", o resultado será "Inabilitado". Não havendo nenhum "Rever" e nenhum "Não", o resultado será "Habilitado". Formulários deste tipo serão utilizados, por exemplo, para avaliações de habilitação de propostas em fomentos. Neste caso, o formulário será associado ao fomento e cada resposta conterá a avaliação de habilitação de uma proposta submetida ao fomento em questão.
Formulários de Avaliação serão utilizados para avaliar quantitativamente objetos do sistema. A questões serão utilizadas para mapear critérios de avaliação a serem considerados e terão uma escala numérica para a resposta (por exemplo de 0 a 10) e um peso dentro do formulário. A média ponderada das respostas às questões será o resultado da resposta. Por exemplo suponha que um formulário tenha duas questões, ambas com peso 1 e escala de 0 a 10. Se a resposta a este formulário ao avaliar uma proposta seja de 7 para a primeira questão e 9 para a segunda, o resultado do formulário para esta avaliação será 8. Formulários deste tipo poderão ser utilizados, por exemplo, para avaliação ad hoc de fomentos.
Uma resposta a formulario pode ser iniciada e salva como rascunho pelo usuario responsavel pelo preenchimento. Enquanto estiver em rascunho, a resposta pode ser editada. Ao enviar a resposta, ela passa a ser considerada submetida e nao pode mais ser alterada pelo respondedor.
---

## Regras de Negocio

| ID | Descricao |
|----|-----------|
| RN01 | Todo formulario deve possuir titulo, descricao e uma estrutura composta por secoes e questoes. |
| RN02 | Uma questao deve possuir um tipo de resposta, como texto, numerico, verdadeiro ou falso, selecao ou outro tipo suportado pelo modulo. |
| RN03 | Uma questao pode possuir regras de validacao sobre suas respostas, como numero minimo de caracteres ou faixa de valores numericos. |
| RN04 | Um formulario pode ser criado do zero ou a partir da copia de um formulario existente. |
| RN05 | Todo formulario novo deve ser criado no estado "Em edição". |
| RN06 | Apenas formularios no estado "Em edição" podem ser editados. |
| RN07 | Ao ser publicado, um formulario deve mudar para o estado "Publicado", ficar visivel para uso por outros modulos e deixar de permitir edicao direta. |
| RN08 | Um formulario "Publicado" pode ter sua publicacao revertida para voltar ao estado "Em edição" enquanto ainda nao tiver sido utilizado por outro modulo. |
| RN09 | Quando o modulo for notificado de que um formulario "Publicado" foi utilizado por outro modulo, o formulario deve mudar para o estado "Utilizado" e poderá receber respostas. |
| RN10 | Um formulario "Utilizado" nao pode ter sua publicacao revertida e nao pode ser alterado pelo restante de seu ciclo de vida. |
| RN11 | Formularios nos estados "Publicado" ou "Utilizado" podem ser inativados quando estiverem desatualizados. |
| RN12 | Um formulario "Inativo" nao pode ser selecionado para novos usos por outros modulos, mas podem receber novas respostas associadas a usos já existente. |
| RN13 | Formularios so poderao ser excluidos enquanto estiverem no estado "Em Edição". |
| RN14 | Uma categoria deve possuir nome e descricao. |
| RN15 | Um formulario pode ser classificado em zero ou mais categorias. |
| RN16 | Um formulario deve ser de um dos seguintes tipos: caracterizacao, habilitacao ou avaliacao. |
| RN17 | Formularios de caracterizacao podem conter perguntas de todos os tipos suportados e nao devem computar resultado sobre as respostas. |
| RN18 | Formularios de habilitacao devem possuir questoes em formato padronizado, com respostas possiveis "Sim", "Não", "Não se aplica" ou "Rever" e campo textual de justificativa. |
| RN19 | O resultado de uma resposta a formulario de habilitacao deve ser "Rever" quando ao menos uma questao tiver resposta "Rever". |
| RN20 | O resultado de uma resposta a formulario de habilitacao deve ser "Inabilitado" quando nao houver questões respondidas como "Rever" e ao menos uma questao tiver resposta "Não". |
| RN21 | O resultado de uma resposta a formulario de habilitacao deve ser "Habilitado" quando nao houver questões com resposta "Rever" nem "Não". |
| RN22 | Formularios de avaliacao devem possuir questoes com escala numerica de resposta e peso dentro do formulario. |
| RN23 | O resultado de uma resposta a formulario de avaliacao deve ser calculado pela media ponderada das respostas numericas das questoes. |
| RN24 | Uma resposta a formulario pode ser salva como rascunho antes de ser enviada. |
| RN25 | Uma resposta em rascunho pode ser editada pelo usuario responsavel pelo preenchimento. |
| RN26 | Uma resposta enviada nao pode mais ser alterada pelo respondedor. |
| RN27 | Uma categoria so podera ser excluida se nao estiver associada a nenhum formulario. |

## Integracoes

| Modulo | Uso |
|--------|-----|
| M011 | Seleciona formularios para configuracao de fomento e cria respostas na submissão de propostas de projetos. |
| M003 | Pode consultar os formularios e respostas referentes a uma iniciativa. |
| M008 | Fornece usuarios/gestores responsaveis pela criacao e publicacao. |
