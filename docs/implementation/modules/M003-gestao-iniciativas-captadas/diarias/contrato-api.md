# Contrato API - Diarias da Iniciativa

[← Voltar](README.md)

Base sugerida: `/api/v1/m003/diarias`

## Endpoints

| Metodo | Rota | Operacao | Perfil |
|--------|------|----------|--------|
| POST | `/tipos-diaria` | CadastrarTipoDiaria | ANALISTA_FAPES |
| GET | `/tipos-diaria/vigente?dataReferencia=YYYY-MM-DD&tipoViagemRef=TVI-001` | ConsultarTipoDiariaVigente | ANALISTA_FAPES, COORDENADOR |
| POST | `/tipos-viagem` | CadastrarTipoViagem | ANALISTA_FAPES |
| GET | `/tipos-viagem` | ConsultarTiposViagem | ANALISTA_FAPES, COORDENADOR |
| POST | `/iniciativas/{iniciativaId}/solicitacoes` | SolicitarDiaria | COORDENADOR |
| GET | `/iniciativas/{iniciativaId}/solicitacoes` | ConsultarSolicitacoesDiaria | COORDENADOR, ANALISTA_FAPES |
| GET | `/solicitacoes/{solicitacaoDiariaId}` | ConsultarSolicitacaoDiaria | COORDENADOR, ANALISTA_FAPES, M014 |
| POST | `/solicitacoes/{solicitacaoDiariaId}/submeter-aceite` | SubmeterSolicitacaoDiariaParaAceite | COORDENADOR |
| POST | `/solicitacoes/{solicitacaoDiariaId}/beneficiarios/{beneficiarioId}/aceite` | AssinarTermoAceiteDiaria | BOLSISTA |
| POST | `/solicitacoes/{solicitacaoDiariaId}/beneficiarios/{beneficiarioId}/recusa` | RecusarTermoAceiteDiaria | BOLSISTA |
| POST | `/solicitacoes/{solicitacaoDiariaId}/decisao` | DecidirSolicitacaoDiaria | ANALISTA_FAPES |
| POST | `/solicitacoes/{solicitacaoDiariaId}/cancelar` | CancelarSolicitacaoDiaria | COORDENADOR |

## GET /iniciativas/{iniciativaId}/solicitacoes

Consulta usada pela tela operacional **Diarias** no Backoffice e pelo painel do coordenador. Deve aceitar filtros e paginacao.

Query params sugeridos:

| Parametro | Obrigatorio | Descricao |
|-----------|-------------|-----------|
| `busca` | Nao | Busca livre por codigo, iniciativa, coordenador, beneficiario, destino, motivo, tipo de viagem ou tipo de diaria. |
| `estado` | Nao | Estado da solicitacao. Ex.: `AGUARDANDO_ACEITES`, `AGUARDANDO_APROVACAO`, `APROVADA`, `REJEITADA`, `CANCELADA`, `RECUSADA`. |
| `partidaInicio` | Nao | Data inicial do periodo de partida. |
| `partidaFim` | Nao | Data final do periodo de partida. |
| `pagina` | Nao | Numero da pagina, iniciando em 1. |
| `tamanhoPagina` | Nao | Quantidade de registros por pagina. |

Resposta:

```json
{
  "itens": [
    {
      "id": "SD-2026-001",
      "iniciativa": "Conecta Fapes",
      "coordenador": "Marina Costa",
      "beneficiarios": ["Ana Souza"],
      "destino": "Vitoria/ES",
      "partida": "2026-06-10T08:00:00-03:00",
      "chegada": "2026-06-12T18:00:00-03:00",
      "estado": "APROVADA",
      "tipoViagemRef": "TVI-001",
      "tipoViagemSnapshot": "Dentro do Estado - Nacional",
      "tipoDiariaRef": "DIA-2026-001",
      "valorTotal": 800.0
    }
  ],
  "pagina": 1,
  "tamanhoPagina": 10,
  "totalItens": 1,
  "totalPaginas": 1
}
```

## POST /tipos-diaria

```json
{
  "codigo": "DIA-2026-001",
  "tipoViagemRef": "TVI-001",
  "valorUnitario": 260.0,
  "fracaoCalculo": "12H",
  "vigenciaInicio": "2026-05-01",
  "vigenciaFim": null,
  "ativo": true
}
```

Resposta:

```json
{
  "id": "DIA-2026-001",
  "tipoViagemRef": "TVI-001",
  "valorUnitario": 260.0,
  "fracaoCalculo": "12H",
  "vigenciaInicio": "2026-05-01",
  "vigenciaFim": null,
  "ativo": true
}
```

## POST /tipos-viagem

```json
{
  "codigo": "TVI-001",
  "nome": "Dentro do Estado",
  "abrangencia": "NACIONAL",
  "descricao": "Deslocamento dentro do Espirito Santo.",
  "ativo": true
}
```

Resposta:

```json
{
  "id": "TVI-001",
  "nome": "Dentro do Estado",
  "abrangencia": "NACIONAL",
  "descricao": "Deslocamento dentro do Espirito Santo.",
  "ativo": true
}
```

## POST /iniciativas/{iniciativaId}/solicitacoes

Ao criar a solicitacao, o backend deve localizar o tipo de viagem, buscar o tipo de diaria vigente vinculado a ele, associar sua referencia em `tipoDiariaRef` e persistir o tipo de viagem selecionado por referencia/snapshot. O valor unitario efetivo e a fracao de calculo devem vir do tipo de diaria vigente. A quantidade de diarias deve seguir a normativa FAPES vigente.

```json
{
  "tipoViagemRef": "TVI-001",
  "dataHoraPartida": "2026-06-10T08:00:00-03:00",
  "dataHoraChegada": "2026-06-12T18:00:00-03:00",
  "destino": "Vitoria/ES",
  "motivo": "Participacao em reuniao tecnica do projeto.",
  "beneficiarios": [
    { "alocacaoBolsistaRef": "ALO-2026-001" },
    { "alocacaoBolsistaRef": "ALO-2026-002" }
  ]
}
```

Resposta:

```json
{
  "id": "SD-2026-001",
  "estado": "RASCUNHO",
  "tipoViagemRef": "TVI-001",
  "tipoViagemSnapshot": "Dentro do Estado - Nacional",
  "tipoDiariaRef": "DIA-2026-001",
  "fracaoCalculoSnapshot": "12H",
  "regraCalculoSnapshot": "Normativa FAPES vigente",
  "valorUnitarioDiaria": 260.0,
  "quantidadeDiariasCalculada": 2.5,
  "valorTotalCalculado": 1300.0,
  "beneficiarios": [
    {
      "id": "BD-2026-001",
      "alocacaoBolsistaRef": "ALO-2026-001",
      "valorCalculado": 650.0,
      "termoAceite": { "estado": "PENDENTE" }
    }
  ]
}
```

## POST /solicitacoes/{solicitacaoDiariaId}/decisao

Quando `decisao` for `REJEITAR`, o campo `justificativa` e obrigatorio. A rejeicao nao gera debito na rubrica.

```json
{
  "decisao": "APROVAR",
  "justificativa": "Todos os aceites assinados e saldo disponivel.",
  "rubricaDiariasPassagensId": "RUB-DIARIAS-PASSAGENS"
}
```

## POST /solicitacoes/{solicitacaoDiariaId}/beneficiarios/{beneficiarioId}/recusa

```json
{
  "justificativa": "Conflito de agenda academica no periodo da viagem."
}
```

Resposta:

```json
{
  "id": "SD-2026-001",
  "beneficiarioId": "BD-2026-001",
  "estadoTermo": "RECUSADO",
  "estadoSolicitacao": "RECUSADA"
}
```

## POST /solicitacoes/{solicitacaoDiariaId}/cancelar

```json
{
  "justificativa": "Atividade cancelada pelo parceiro."
}
```

Resposta:

```json
{
  "id": "SD-2026-001",
  "estado": "CANCELADA",
  "lancamentoCreditoRef": "LEX-2026-046"
}
```
