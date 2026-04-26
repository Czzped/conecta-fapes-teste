# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do M021 como modulo responsavel pela base central de formularios reutilizaveis e versionados da FAPES.

## Consumidores e Dependencias

### Consumidores

| Consumidor | Uso do contrato |
|------------|-----------------|
| Gestor da FAPES | Cria, classifica, versiona, publica e inativa formularios |
| M011 | Seleciona formularios publicados para configuracao de captacao |
| Modulos internos | Consultam versoes publicadas para renderizacao e validacao |

### Dependencias

| Dependencia | Tipo | Observacao |
|-------------|------|------------|
| M008 | Modulo interno | Fornece usuario/pessoa responsavel pela criacao e publicacao |

## Operacoes Publicas

| Nome da Operacao | Tipo | Objetivo | Entrada | Saida | Regras relacionadas | Autorizacao |
|------------------|------|----------|---------|-------|---------------------|-------------|
| CriarFormulario | Command | Criar formulario na base | nome, descricao, tipo, finalidade | `Formulario` criado | RN01 | Gestor da FAPES |
| ClassificarFormulario | Command | Alterar tipo ou finalidade do formulario | formularioId, tipo, finalidade | `Formulario` atualizado | RN01, RN08 | Gestor da FAPES |
| CriarVersaoFormulario | Command | Criar rascunho de versao | formularioId, baseVersaoId? | `VersaoFormulario` em rascunho | RN02, RN04 | Gestor da FAPES |
| ConfigurarEstruturaFormulario | Command | Configurar secoes, campos e regras da versao | versaoId, secoes, campos, regras | Versao atualizada | RN05-RN07 | Gestor da FAPES |
| PublicarVersaoFormulario | Command | Publicar versao para uso por outros modulos | versaoId | Versao publicada | RN03, RN05, RN09 | Gestor da FAPES |
| InativarFormulario | Command | Inativar formulario para novas selecoes | formularioId, justificativa | Formulario inativo | RN10 | Gestor da FAPES |
| ListarFormulariosPublicados | Query | Listar formularios ativos por classificacao/finalidade | tipo?, finalidade? | Lista de formularios e versoes | RN09 | Modulo interno |
| ConsultarVersaoFormulario | Query | Consultar estrutura versionada do formulario | formularioId, versaoId | Estrutura do formulario | RN09 | Modulo interno |

## Eventos

- `FormularioCriado`
- `VersaoFormularioPublicada`
- `FormularioInativado`

## Rastreabilidade

- Dominio e regras: [README.md](README.md)
- Backlog e EPICs: [backlog.md](backlog.md)
- Modelo estrutural: [modelo-estrutural.md](modelo-estrutural.md)
