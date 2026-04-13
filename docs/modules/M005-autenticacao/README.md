# M005 - Autenticacao

[← Voltar ao Backlog Central](../../backlog-product.md) | [Domain 01 — Corporativo e Administrativo](../../discovery/domains/01-corporativo.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Diagramas de estado do modulo |

---

## Sobre o Modulo

Sem controle granular de acesso, qualquer usuario autenticado pode acessar dados sensiveis sem rastro de auditoria, expondo a organizacao a riscos de seguranca e conformidade. Este modulo resolve esse problema ao implementar autenticacao integrada ao Acesso Cidadao com autorizacao em nivel de dados e logs de auditoria completos. O sucesso sera medido pela cobertura de controle de acesso e pelo percentual de acoes auditadas.

Especificacao de referencia: [/documentation/docs/modulos/05_autenticacao/](/documentation/docs/modulos/05_autenticacao/)

---

## Dominio

O projeto tem como objetivo definir e controlar o acesso a objetos (e.g., papeis, rotas, documentos e dados) baseado em uma politica de seguranca.

As politicas de seguranca sao definidas pelo Gestor de Politicas da organizacao. Uma politica de seguranca define regras de acesso aos objetos, por meio da definicao de relacoes entre objetos. Por exemplo, podemos definir que todo analista (objeto do tipo papel) tem acesso de leitura a um documento do tipo Ata (objeto do tipo documento), ou podemos definir que um usuario especifico tem acesso a um documento especifico (instancia do objeto do tipo documento).

As politicas sao agrupadas, ou armazenadas, em um store, para melhorar a organizacao destas.

Todo sistema ou usuario utiliza o servico de autorizacao para verificar se tem acesso ou nao a um objeto. Para isso, ele questiona se ha ou nao permissao baseada nas relacoes. O servico responde informando se o usuario pode realizar a acao com uma mensagem de aprovacao ou reprovacao.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Um store agrupa politicas de seguranca para melhorar a organizacao. | Must |
| RN02 | Politicas de seguranca definem regras de acesso a objetos por meio de relacoes entre objetos. | Must |
| RN03 | Uma relacao entre objetos define quem (sujeito) pode executar qual acao sobre qual recurso (objeto). | Must |
| RN04 | Relacoes podem ser definidas entre tipos de objetos (ex: papel analista tem leitura em tipo Ata) ou entre instancias especificas (ex: usuario X tem acesso ao documento Y). | Must |
| RN05 | A validacao de acesso e feita consultando as relacoes existentes e retornando aprovacao ou reprovacao. | Must |
| RN06 | O Gestor de Politicas e o responsavel por definir e manter as politicas de seguranca. | Must |
| RN07 | Somente usuarios autenticados podem acessar o sistema. | Must |
| RN08 | No primeiro acesso, o sistema deve criar automaticamente o Gestor de Politicas. | Must |
