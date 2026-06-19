# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do M021 como modulo responsavel pelo ciclo de vida de formularios reutilizaveis, pela classificacao por categorias e pelo registro de respostas a formularios utilizados por outros modulos.

O M021 nao implementa as regras de submissao, avaliacao ou associacao de formularios aos objetos de outros modulos. Esses modulos apenas referenciam formularios publicados e registram respostas quando um formulario e utilizado.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Funcionario da FAPES | Cria formularios e respostas, cria copias de formularios existentes independentemente da autoria do formulario original e gerencia categorias de formulario |
| Autor do registro | Edita formularios e respostas de sua autoria, respeitando as restricoes de estado aplicaveis |
| Gestor da FAPES | Publica, reverte publicacao, inativa, exclui e consulta formularios |
| M011 | Seleciona formularios publicados para fomento/captacao e registra respostas na submissao, habilitacao e avaliacao de propostas |
| M003 | Consulta formularios e respostas referentes a uma iniciativa/projeto quando necessario |
| Modulos internos | Consultam formularios publicados e registram respostas para usos ja vinculados |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece usuarios responsaveis por criacao e ultima alteracao de formularios e respostas |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Pre-condicoes | Rejeicoes | Autorizacao |
|------------------|------|----------|---------|-------|---------------------|---------------|-----------|-------------|
| CriarCategoriaFormulario | Command | Criar categoria para organizacao e busca de formularios | nome, descricao | `CategoriaFormulario` criada | RN14, RN31 | Nome e descricao informados; funcionario da FAPES autenticado | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, CATEGORIA_INVALIDA, CATEGORIA_DUPLICADA | Funcionario da FAPES |
| ConsultarCategoriaFormulario | Query | Consultar dados de uma categoria | categoriaId | `CategoriaFormulario` consultada | RN14, RN31 | Categoria existente; funcionario da FAPES autenticado ou modulo interno autorizado | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, CATEGORIA_NAO_ENCONTRADA | Funcionario da FAPES, Modulo interno |
| AtualizarCategoriaFormulario | Command | Alterar nome ou descricao de categoria | categoriaId, nome, descricao | `CategoriaFormulario` atualizada | RN14, RN31 | Categoria existente; funcionario da FAPES autenticado | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, CATEGORIA_NAO_ENCONTRADA, CATEGORIA_INVALIDA | Funcionario da FAPES |
| ExcluirCategoriaFormulario | Command | Excluir categoria que nao esteja associada a formulario | categoriaId | Categoria excluida | RN27, RN31 | Categoria existente e sem formulario associado; funcionario da FAPES autenticado | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, CATEGORIA_NAO_ENCONTRADA, CATEGORIA_EM_USO | Funcionario da FAPES |
| ListarCategoriasFormulario | Query | Listar categorias disponiveis | filtros? | Lista de categorias | RN14, RN31 | Funcionario da FAPES autenticado ou modulo interno autorizado | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO | Funcionario da FAPES, Modulo interno |
| CriarFormulario | Command | Criar formulario do zero no estado "Em Edicao" | titulo, descricao, tipo, categorias?, conteudo | `Formulario` criado em "Em Edicao", com dataCriacao, dataUltimaAlteracao, usuarioCriacao e usuarioUltimaAlteracao registrados | RN01-RN05, RN15-RN18, RN22, RN28 | Dados obrigatorios informados; tipo valido; funcionario da FAPES autenticado | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, FORMULARIO_INVALIDO, TIPO_FORMULARIO_INVALIDO, CATEGORIA_NAO_ENCONTRADA | Funcionario da FAPES |
| CopiarFormulario | Command | Criar novo formulario a partir da copia de formulario existente | formularioOrigemId, titulo?, descricao?, categorias? | Novo `Formulario` em "Em Edicao", vinculado ao formularioOrigem, com dataCriacao, dataUltimaAlteracao, usuarioCriacao e usuarioUltimaAlteracao registrados | RN04, RN05, RN28, RN30 | Formulario origem existente; funcionario da FAPES autenticado | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, FORMULARIO_NAO_ENCONTRADO, FORMULARIO_INVALIDO | Funcionario da FAPES |
| AtualizarFormulario | Command | Editar dados, categorias e conteudo do formulario | formularioId, titulo, descricao, tipo, categorias?, conteudo | `Formulario` atualizado com dataUltimaAlteracao e usuarioUltimaAlteracao registrados | RN01-RN03, RN06, RN15-RN18, RN22, RN29 | Formulario em "Em Edicao"; funcionario da FAPES autenticado solicitante e autor do formulario | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, FORMULARIO_NAO_ENCONTRADO, FORMULARIO_NAO_EDITAVEL, FORMULARIO_INVALIDO | Autor do formulario |
| PublicarFormulario | Command | Publicar formulario para ficar visivel a outros modulos | formularioId | `Formulario` em "Publicado", com dataPublicacao, dataUltimaAlteracao e usuarioUltimaAlteracao registrados | RN01-RN07 | Formulario em "Em Edicao"; estrutura valida com secoes e questoes | FORMULARIO_NAO_ENCONTRADO, FORMULARIO_SEM_ESTRUTURA, FORMULARIO_INVALIDO, TRANSICAO_INVALIDA | Gestor da FAPES |
| ReverterPublicacaoFormulario | Command | Retornar formulario publicado para "Em Edicao" | formularioId | `Formulario` em "Em Edicao", com dataPublicacao limpa e dataUltimaAlteracao/usuarioUltimaAlteracao registrados | RN08 | Formulario em "Publicado" e ainda nao utilizado por outro modulo | FORMULARIO_NAO_ENCONTRADO, FORMULARIO_JA_UTILIZADO, TRANSICAO_INVALIDA | Gestor da FAPES |
| NotificarUsoFormulario | Command | Alterar o status do formulario para "Utilizado" e registrar a data do primeiro uso | formularioId | `Formulario` em "Utilizado", com dataPrimeiroUso registrada somente se ainda estiver vazia | RN09, RN10 | Formulario em "Publicado" | FORMULARIO_NAO_ENCONTRADO, FORMULARIO_NAO_PUBLICADO | Modulo interno |
| InativarFormulario | Command | Impedir novos usos de formulario publicado ou utilizado | formularioId | `Formulario` em "Inativo", com dataInativacao registrada somente se ainda nao estiver inativo | RN11, RN12 | Formulario em "Publicado" ou "Utilizado" | FORMULARIO_NAO_ENCONTRADO, TRANSICAO_INVALIDA | Gestor da FAPES |
| ExcluirFormulario | Command | Excluir formulario ainda em elaboracao | formularioId | Formulario excluido | RN13 | Formulario em "Em Edicao" | FORMULARIO_NAO_ENCONTRADO, FORMULARIO_NAO_EXCLUIVEL | Gestor da FAPES |
| ListarFormularios | Query | Listar formularios por filtros de busca | estado?, tipo?, categoriaId?, termo? | Lista de formularios | RN07, RN12, RN15, RN16 | N/A | N/A | Gestor da FAPES, Modulo interno |
| ListarFormulariosPublicados | Query | Listar formularios disponiveis para novos usos por outros modulos | tipo?, categoriaId?, termo? | Lista de formularios publicados | RN07, RN12, RN16 | N/A | N/A | Modulo interno |
| ConsultarFormulario | Query | Consultar dados e conteudo de um formulario | formularioId | `Formulario` com categorias e conteudo | RN01-RN03, RN16-RN18, RN22 | Formulario existente | FORMULARIO_NAO_ENCONTRADO | Gestor da FAPES, Modulo interno |
| RegistrarRespostaFormulario | Command | Iniciar resposta para formulario utilizado por outro modulo | formularioId, respostas | `RespostaFormulario` criada em estado RASCUNHO, com dataRegistro, dataUltimaAlteracao, usuarioCriacao, usuarioUltimaAlteracao e resultado calculado quando aplicavel | RN09, RN12, RN18-RN26, RN28 | Formulario "Utilizado" ou "Inativo"; funcionario da FAPES autenticado | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, FORMULARIO_NAO_ENCONTRADO, RESPOSTA_INVALIDA | Funcionario da FAPES ou modulo interno em nome do funcionario respondedor |
| AtualizarRespostaFormulario | Command | Editar resposta em rascunho | respostaId, respostas | `RespostaFormulario` em RASCUNHO atualizada com dataUltimaAlteracao, usuarioUltimaAlteracao e resultado recalculado quando aplicavel | RN18-RN26, RN29 | Resposta existente em estado RASCUNHO; funcionario da FAPES autenticado solicitante e autor da resposta | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, RESPOSTA_NAO_ENCONTRADA, RESPOSTA_NAO_EDITAVEL, RESPOSTA_INVALIDA | Autor da resposta |
| EnviarRespostaFormulario | Command | Enviar resposta em rascunho | respostaId | `RespostaFormulario` em ENVIADA, com dataEnvio registrada e resultado calculado/recalculado quando aplicavel | RN18-RN26, RN29 | Resposta existente em estado RASCUNHO; funcionario da FAPES autenticado solicitante e autor da resposta | USUARIO_NAO_AUTENTICADO, USUARIO_NAO_AUTORIZADO, RESPOSTA_NAO_ENCONTRADA, RESPOSTA_NAO_EDITAVEL, RESPOSTA_INVALIDA | Autor da resposta |
| ConsultarRespostaFormulario | Query | Consultar resposta registrada e seu resultado | respostaId | `RespostaFormulario` com estado, dataRegistro, dataUltimaAlteracao, dataEnvio e resultado quando aplicavel | RN18-RN26 | Resposta existente | RESPOSTA_NAO_ENCONTRADA | Gestor da FAPES, Modulo interno |
| ListarRespostasFormulario | Query | Listar respostas de um formulario | formularioId, estado? | Lista de respostas com estado e datas principais | RN09, RN12, RN24-RN26 | Formulario informado | FORMULARIO_NAO_ENCONTRADO | Gestor da FAPES, Modulo interno |

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
- Modelo comportamental: [modelo-comportamental.md](modelo-comportamental.md)
