# Contrato API - M021 Gestao de Formularios

Dominio e regras de negocio: ver [README.md](README.md)
Contrato funcional: ver [contrato.md](contrato.md)

## Convencoes

- Base path sugerido: `/api/v1/m021`
- Formularios devem ser referenciados por `formularioId`.
- Respostas devem ser referenciadas por `respostaId`.
- `conteudo` representa a estrutura do formulario em JSON, contendo secoes, questoes, opcoes, validacoes e metadados de avaliacao quando aplicavel.
- A notificacao de uso altera o formulario para "Utilizado" e registra `dataPrimeiroUso`.
- Formularios inativos nao aparecem para novos usos, mas continuam aceitando respostas.

## Endpoints

| Metodo | Path | Operacao | Descricao |
|--------|------|----------|-----------|
| POST | `/categorias` | CriarCategoriaFormulario | Cria categoria de formulario |
| GET | `/categorias/{categoriaId}` | ConsultarCategoriaFormulario | Consulta dados de uma categoria |
| PUT | `/categorias/{categoriaId}` | AtualizarCategoriaFormulario | Atualiza nome e descricao da categoria |
| DELETE | `/categorias/{categoriaId}` | ExcluirCategoriaFormulario | Exclui categoria somente se ela nao estiver associada a nenhum formulario |
| GET | `/categorias` | ListarCategoriasFormulario | Lista categorias |
| POST | `/formularios` | CriarFormulario | Cria formulario do zero em estado "Em Edicao" e registra data/usuario de criacao e ultima alteracao |
| POST | `/formularios/{formularioId}/copiar` | CopiarFormulario | Cria novo formulario em "Em Edicao", registra o formulario de origem e data/usuario de criacao e ultima alteracao |
| PUT | `/formularios/{formularioId}` | AtualizarFormulario | Atualiza dados, categorias e conteudo de formulario em edicao e registra data/usuario da ultima alteracao |
| POST | `/formularios/{formularioId}/publicar` | PublicarFormulario | Altera estado para "Publicado" e registra dataPublicacao e data/usuario da ultima alteracao |
| POST | `/formularios/{formularioId}/reverter-publicacao` | ReverterPublicacaoFormulario | Altera estado para "Em Edicao", limpa dataPublicacao e registra data/usuario da ultima alteracao |
| POST | `/formularios/{formularioId}/usos` | NotificarUsoFormulario | Altera estado para "Utilizado" e registra dataPrimeiroUso apenas se ainda estiver vazia |
| POST | `/formularios/{formularioId}/inativar` | InativarFormulario | Altera estado para "Inativo" e registra dataInativacao apenas se o formulario ainda nao estiver inativo |
| DELETE | `/formularios/{formularioId}` | ExcluirFormulario | Exclui formulario em edicao |
| GET | `/formularios` | ListarFormularios | Lista formularios por filtros |
| GET | `/formularios/publicados` | ListarFormulariosPublicados | Lista formularios disponiveis para novos usos |
| GET | `/formularios/{formularioId}` | ConsultarFormulario | Consulta dados e conteudo de formulario |
| POST | `/formularios/{formularioId}/respostas` | RegistrarRespostaFormulario | Inicia resposta em estado RASCUNHO, com dataRegistro, data/usuario de criacao e ultima alteracao, e resultado calculado quando aplicavel |
| GET | `/formularios/{formularioId}/respostas` | ListarRespostasFormulario | Lista respostas de um formulario, permitindo filtro por estado |
| PUT | `/respostas/{respostaId}` | AtualizarRespostaFormulario | Atualiza resposta em RASCUNHO, registra data/usuario da ultima alteracao e recalcula resultado quando aplicavel |
| POST | `/respostas/{respostaId}/enviar` | EnviarRespostaFormulario | Envia resposta em RASCUNHO, altera estado para ENVIADA, registra dataEnvio e calcula/recalcula resultado quando aplicavel |
| GET | `/respostas/{respostaId}` | ConsultarRespostaFormulario | Consulta resposta registrada com estado, datas e resultado quando aplicavel |

## Recursos

### CategoriaFormulario

```json
{
  "id": "CAT-SUBMISSAO",
  "nome": "Submissao",
  "descricao": "Formularios usados em submissao de propostas"
}
```

### Formulario

```json
{
  "id": "FORM-2026-001",
  "codigo": "FORM-2026-001",
  "titulo": "Formulario de submissao de proposta",
  "descricao": "Coleta dados especificos da proposta para um fomento.",
  "tipo": "CARACTERIZACAO",
  "estado": "EM_EDICAO",
  "categorias": [
    {
      "id": "CAT-SUBMISSAO",
      "nome": "Submissao",
      "descricao": "Formularios usados em submissao de propostas"
    }
  ],
  "conteudo": {
    "secoes": [
      {
        "titulo": "Dados da proposta",
        "ordem": 1,
        "questoes": [
          {
            "id": "Q1",
            "enunciado": "Titulo da proposta",
            "tipo": "TEXTO",
            "ordem": 1,
            "validacoes": [
              {
                "tipo": "MINIMO_CARACTERES",
                "parametro": "10",
                "mensagem": "Informe um titulo com ao menos 10 caracteres."
              }
            ]
          }
        ]
      }
    ]
  },
  "dataCriacao": "2026-06-16T10:00:00-03:00",
  "usuarioCriacao": {
    "id": "USR-001",
    "nome": "Analista FAPES"
  },
  "dataUltimaAlteracao": "2026-06-16T10:00:00-03:00",
  "usuarioUltimaAlteracao": {
    "id": "USR-001",
    "nome": "Analista FAPES"
  },
  "dataPublicacao": null,
  "dataPrimeiroUso": null,
  "dataInativacao": null
}
```

### RespostaFormulario

```json
{
  "id": "RESP-2026-001",
  "formularioId": "FORM-2026-001",
  "estado": "RASCUNHO",
  "dataRegistro": "2026-06-16T11:00:00-03:00",
  "usuarioCriacao": {
    "id": "USR-010",
    "nome": "Proponente"
  },
  "dataUltimaAlteracao": "2026-06-16T11:00:00-03:00",
  "usuarioUltimaAlteracao": {
    "id": "USR-010",
    "nome": "Proponente"
  },
  "dataEnvio": null,
  "respostas": {
    "Q1": {
      "valor": "Pesquisa aplicada em inovacao social"
    }
  },
  "resultadoHabilitacao": null,
  "resultadoAvaliacao": null
}
```

## Exemplos

### Criar Categoria

```json
{
  "nome": "Submissao",
  "descricao": "Formularios usados em submissao de propostas"
}
```

### Consultar Categoria

Resposta esperada:

```json
{
  "id": "CAT-SUBMISSAO",
  "nome": "Submissao",
  "descricao": "Formularios usados em submissao de propostas"
}
```

### Excluir Categoria

Esta operacao nao recebe corpo. Ela exclui a categoria somente se ela nao estiver associada a nenhum formulario.

Resposta esperada: `204 No Content`.

### Criar Formulario

```json
{
  "titulo": "Formulario de submissao de proposta",
  "descricao": "Coleta dados especificos da proposta para um fomento.",
  "tipo": "CARACTERIZACAO",
  "categoriasIds": ["CAT-SUBMISSAO"],
  "conteudo": {
    "secoes": [
      {
        "titulo": "Dados da proposta",
        "ordem": 1,
        "questoes": [
          {
            "id": "Q1",
            "enunciado": "Titulo da proposta",
            "tipo": "TEXTO",
            "ordem": 1,
            "validacoes": [
              {
                "tipo": "MINIMO_CARACTERES",
                "parametro": "10"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### Criar Formulario de Habilitacao

```json
{
  "titulo": "Habilitacao documental",
  "descricao": "Criterios para avaliacao de habilitacao.",
  "tipo": "HABILITACAO",
  "conteudo": {
    "secoes": [
      {
        "titulo": "Criterios",
        "ordem": 1,
        "questoes": [
          {
            "id": "CRIT-1",
            "enunciado": "A documentacao obrigatoria foi apresentada?",
            "tipo": "SELECAO",
            "ordem": 1,
            "opcoes": ["Sim", "Nao", "Nao se aplica", "Rever"],
            "justificativaObrigatoria": true
          }
        ]
      }
    ]
  }
}
```

### Criar Formulario de Avaliacao

```json
{
  "titulo": "Avaliacao ad hoc",
  "descricao": "Criterios quantitativos para avaliacao de proposta.",
  "tipo": "AVALIACAO",
  "conteudo": {
    "secoes": [
      {
        "titulo": "Merito",
        "ordem": 1,
        "questoes": [
          {
            "id": "MERITO-1",
            "enunciado": "Qualidade tecnica da proposta",
            "tipo": "NUMERICO",
            "ordem": 1,
            "escalaMinima": 0,
            "escalaMaxima": 10,
            "peso": 2
          }
        ]
      }
    ]
  }
}
```

### Notificar Uso do Formulario

Esta operacao nao recebe corpo. Ela altera o status do formulario para "Utilizado" e registra a data do primeiro uso somente se `dataPrimeiroUso` ainda estiver vazia. Nao altera `dataUltimaAlteracao` nem `usuarioUltimaAlteracao`.

Resposta esperada:

```json
{
  "formularioId": "FORM-2026-001",
  "estado": "UTILIZADO",
  "dataPrimeiroUso": "2026-06-16T11:00:00-03:00"
}
```

### Registrar Resposta

```json
{
  "respostas": {
    "Q1": {
      "valor": "Pesquisa aplicada em inovacao social"
    }
  }
}
```

Resposta esperada:

```json
{
  "id": "RESP-2026-001",
  "formularioId": "FORM-2026-001",
  "estado": "RASCUNHO",
  "dataRegistro": "2026-06-16T11:00:00-03:00",
  "usuarioCriacao": {
    "id": "USR-010",
    "nome": "Proponente"
  },
  "dataUltimaAlteracao": "2026-06-16T11:00:00-03:00",
  "usuarioUltimaAlteracao": {
    "id": "USR-010",
    "nome": "Proponente"
  },
  "dataEnvio": null,
  "resultadoHabilitacao": null,
  "resultadoAvaliacao": null
}
```

### Atualizar Resposta em Rascunho

```json
{
  "respostas": {
    "Q1": {
      "valor": "Pesquisa aplicada em inovacao social e tecnologia"
    }
  }
}
```

Resposta esperada:

```json
{
  "id": "RESP-2026-001",
  "formularioId": "FORM-2026-001",
  "estado": "RASCUNHO",
  "dataUltimaAlteracao": "2026-06-16T11:30:00-03:00",
  "usuarioUltimaAlteracao": {
    "id": "USR-010",
    "nome": "Proponente"
  },
  "dataEnvio": null,
  "resultadoHabilitacao": null,
  "resultadoAvaliacao": null
}
```

### Registrar Resposta de Habilitacao

```json
{
  "respostas": {
    "CRIT-1": {
      "valor": "Nao",
      "descricao": "Documento obrigatorio nao foi anexado."
    },
    "CRIT-2": {
      "valor": "Sim",
      "descricao": "Criterio atendido."
    }
  }
}
```

Resposta esperada:

```json
{
  "id": "RESP-2026-010",
  "formularioId": "FORM-HAB-2026-001",
  "estado": "RASCUNHO",
  "dataRegistro": "2026-06-16T11:00:00-03:00",
  "usuarioCriacao": {
    "id": "USR-010",
    "nome": "Proponente"
  },
  "dataUltimaAlteracao": "2026-06-16T11:00:00-03:00",
  "usuarioUltimaAlteracao": {
    "id": "USR-010",
    "nome": "Proponente"
  },
  "dataEnvio": null,
  "resultadoHabilitacao": "INABILITADO",
  "resultadoAvaliacao": null
}
```

### Registrar Resposta de Avaliacao

```json
{
  "respostas": {
    "MERITO-1": {
      "valor": 7
    },
    "MERITO-2": {
      "valor": 9
    }
  }
}
```

Resposta esperada:

```json
{
  "id": "RESP-2026-011",
  "formularioId": "FORM-AVA-2026-001",
  "estado": "RASCUNHO",
  "dataRegistro": "2026-06-16T11:00:00-03:00",
  "usuarioCriacao": {
    "id": "USR-010",
    "nome": "Proponente"
  },
  "dataUltimaAlteracao": "2026-06-16T11:00:00-03:00",
  "usuarioUltimaAlteracao": {
    "id": "USR-010",
    "nome": "Proponente"
  },
  "dataEnvio": null,
  "resultadoHabilitacao": null,
  "resultadoAvaliacao": 8
}
```

### Enviar Resposta

Esta operacao nao recebe corpo. Ela altera uma resposta em RASCUNHO para ENVIADA, registra `dataEnvio` e calcula ou recalcula o resultado quando aplicavel.

Resposta esperada:

```json
{
  "id": "RESP-2026-001",
  "formularioId": "FORM-2026-001",
  "estado": "ENVIADA",
  "dataEnvio": "2026-06-16T12:00:00-03:00",
  "resultadoHabilitacao": null,
  "resultadoAvaliacao": null
}
```

## Erros

| HTTP | Codigo | Situacao |
|------|--------|----------|
| 400 | PAYLOAD_INVALIDO | Dados obrigatorios ausentes ou invalidos |
| 400 | FILTRO_OBRIGATORIO | Consulta de respostas sem `formularioId` |
| 404 | FORMULARIO_NAO_ENCONTRADO | Formulario inexistente |
| 404 | CATEGORIA_NAO_ENCONTRADA | Categoria inexistente |
| 404 | RESPOSTA_NAO_ENCONTRADA | Resposta inexistente |
| 409 | CATEGORIA_DUPLICADA | Categoria com mesmo nome ja existe |
| 409 | CATEGORIA_EM_USO | Tentativa de excluir categoria associada a pelo menos um formulario |
| 409 | FORMULARIO_NAO_EDITAVEL | Tentativa de editar formulario fora do estado "Em Edicao" |
| 409 | FORMULARIO_NAO_EXCLUIVEL | Tentativa de excluir formulario fora do estado "Em Edicao" |
| 409 | FORMULARIO_JA_UTILIZADO | Tentativa de reverter publicacao de formulario ja utilizado |
| 409 | RESPOSTA_NAO_EDITAVEL | Tentativa de editar ou enviar resposta que nao esta em RASCUNHO |
| 409 | TRANSICAO_INVALIDA | Transicao de estado nao permitida para o estado atual |
| 422 | FORMULARIO_INVALIDO | Titulo, descricao, tipo, conteudo ou categorias invalidos |
| 422 | FORMULARIO_SEM_ESTRUTURA | Tentativa de publicar formulario sem secao ou questao |
| 422 | FORMULARIO_NAO_PUBLICADO | Tentativa de registrar uso de formulario que nao esta publicado |
| 422 | TIPO_FORMULARIO_INVALIDO | Tipo diferente de CARACTERIZACAO, HABILITACAO ou AVALIACAO |
| 422 | RESPOSTA_INVALIDA | Resposta nao atende ao tipo, opcoes ou validacoes do formulario |
