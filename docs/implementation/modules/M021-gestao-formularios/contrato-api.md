# Contrato API - M021 Gestao de Formularios

Dominio e regras de negocio: ver [README.md](README.md)
Contrato funcional: ver [contrato.md](contrato.md)

## Convencoes

- Base path sugerido: `/api/v1/m021`
- Formularios publicados devem ser referenciados por `formularioId` e `versaoId`.

## Endpoints

| Metodo | Path | Operacao | Descricao |
|--------|------|----------|-----------|
| POST | `/formularios` | CriarFormulario | Cria formulario na base |
| PATCH | `/formularios/{id}/classificacao` | ClassificarFormulario | Atualiza tipo e finalidade |
| POST | `/formularios/{id}/versoes` | CriarVersaoFormulario | Cria rascunho de versao |
| PUT | `/formularios/{id}/versoes/{versaoId}/estrutura` | ConfigurarEstruturaFormulario | Atualiza secoes, campos e regras |
| POST | `/formularios/{id}/versoes/{versaoId}/publicar` | PublicarVersaoFormulario | Publica versao |
| POST | `/formularios/{id}/inativar` | InativarFormulario | Inativa formulario |
| GET | `/formularios` | ListarFormulariosPublicados | Lista formularios por filtros |
| GET | `/formularios/{id}/versoes/{versaoId}` | ConsultarVersaoFormulario | Consulta estrutura de versao |

## Exemplo: Criar Formulario

```json
{
  "nome": "Submissao de Proposta de Iniciativa",
  "descricao": "Formulario base para submissao de proposta em captacao.",
  "tipoFormularioId": "TIPO-SUBMISSAO",
  "finalidadeFormularioId": "FIN-CAPTACAO"
}
```

## Exemplo: Configurar Estrutura

```json
{
  "secoes": [
    {
      "titulo": "Dados da Proposta",
      "ordem": 1,
      "campos": [
        {
          "rotulo": "Titulo da proposta",
          "tipo": "TEXTO_CURTO",
          "obrigatoriedade": "OBRIGATORIO",
          "ordem": 1
        },
        {
          "rotulo": "Resultados esperados",
          "tipo": "TEXTO_LONGO",
          "obrigatoriedade": "CONDICIONAL",
          "ordem": 2,
          "regras": [
            {
              "tipo": "OBRIGATORIEDADE",
              "expressao": "configuracaoCaptacao.resultados = EXIGIDO"
            }
          ]
        }
      ]
    }
  ]
}
```

## Erros

| HTTP | Codigo | Situacao |
|------|--------|----------|
| 400 | PAYLOAD_INVALIDO | Dados obrigatorios ausentes ou invalidos |
| 404 | FORMULARIO_NAO_ENCONTRADO | Formulario inexistente |
| 404 | VERSAO_FORMULARIO_NAO_ENCONTRADA | Versao inexistente |
| 409 | VERSAO_PUBLICADA_IMUTAVEL | Tentativa de editar versao publicada |
| 422 | FORMULARIO_SEM_ESTRUTURA | Tentativa de publicar versao sem secao ou campo |
| 422 | CAMPO_CONDICIONAL_SEM_REGRA | Campo condicional sem regra associada |
