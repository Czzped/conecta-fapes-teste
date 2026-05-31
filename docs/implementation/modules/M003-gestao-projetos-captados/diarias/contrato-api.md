# Contrato API - Diarias da Projeto

[← Voltar](README.md)

Base sugerida: `/api/v1/m003/diarias`

## Endpoints

| Metodo | Rota | Operacao | Perfil |
|--------|------|----------|--------|
| POST | `/projetos/{projetoId}/solicitacoes` | SolicitarDiaria | COORDENADOR |
| GET | `/projetos/{projetoId}/solicitacoes` | ConsultarSolicitacoesDiaria | COORDENADOR, ANALISTA_FAPES |
| GET | `/solicitacoes/{solicitacaoDiariaId}` | ConsultarSolicitacaoDiaria | COORDENADOR, ANALISTA_FAPES, M014 |
| POST | `/solicitacoes/{solicitacaoDiariaId}/aceite` | RegistrarAceiteDiaria | BOLSISTA |
| POST | `/solicitacoes/{solicitacaoDiariaId}/recusa` | RegistrarRecusaDiaria | BOLSISTA |
| POST | `/solicitacoes/{solicitacaoDiariaId}/cancelar` | RemoverSolicitacaoDiaria | COORDENADOR |
| POST | `/solicitacoes/{solicitacaoDiariaId}/regularizar-nao-utilizada` | RegularizarDiariaNaoUtilizada | COORDENADOR |
| GET | `/localidades/municipios-es` | ListarMunicipiosESDiaria | COORDENADOR, ANALISTA_FAPES |
| GET | `/localidades/distancias` | ConsultarDistanciaMunicipiosES | COORDENADOR, ANALISTA_FAPES |
| GET | `/localidades/distancias-matriz` | ConsultarMatrizDistanciasMunicipiosES | ANALISTA_FAPES, SISTEMA |
| GET | `/localidades/limitrofes` | ConsultarMunicipiosLimitrofesES | COORDENADOR, ANALISTA_FAPES |
| GET | `/localidades/limitrofes-matriz` | ConsultarMatrizMunicipiosLimitrofesES | ANALISTA_FAPES, SISTEMA |

> O cadastro de `TipoDiaria` e dos `ParametroCalculoDiaria` vinculados pertence ao M008. O M003 consome `/api/v1/m008/tipos-diaria/vigente` por `abrangenciaRef` para validar e calcular a solicitacao, recebendo o tipo vigente e seus parametros vigentes.

> A matriz inicial de distancias entre municipios do Espirito Santo fica em [`data/distancias-municipios-es.json`](data/distancias-municipios-es.json). Ela e usada como tabela em memoria/cache operacional para viagens dentro do Estado. Destinos fora do Estado e internacionais continuam sendo opcoes especiais e nao usam essa matriz.

> A matriz de municipios limitrofes fica em [`data/municipios-limitrofes-es.json`](data/municipios-limitrofes-es.json). Ela e usada para calcular automaticamente `municipioLimitrofe` pelo par origem-destino, especialmente na regra de diaria sem pernoite.

## GET /localidades/municipios-es

Lista somente municipios do Espirito Santo disponiveis para selecao de origem e destino em solicitacoes de diaria dentro do Estado.

Resposta:

```json
{
  "itens": [
    {
      "codigoIbge": "3200102",
      "nome": "Afonso Claudio",
      "uf": "ES",
      "latitude": -20.0778,
      "longitude": -41.1261
    }
  ],
  "totalItens": 78,
  "fonte": "data/distancias-municipios-es.json"
}
```

## GET /localidades/distancias

Consulta a distancia entre dois municipios do Espirito Santo. A consulta deve aceitar o par em qualquer ordem, pois a matriz e nao direcional.

Query params:

| Parametro | Obrigatorio | Descricao |
|-----------|-------------|-----------|
| `origemCodigoIbge` | Sim | Codigo IBGE do municipio de origem no ES. |
| `destinoCodigoIbge` | Sim | Codigo IBGE do municipio de destino no ES. |

Resposta:

```json
{
  "origem": {
    "codigoIbge": "3205309",
    "nome": "Vitoria",
    "uf": "ES"
  },
  "destino": {
    "codigoIbge": "3203205",
    "nome": "Linhares",
    "uf": "ES"
  },
  "distanciaKm": 105.65,
  "tipoDistancia": "GEODESICA_ENTRE_COORDENADAS_MUNICIPAIS",
  "fonte": "data/distancias-municipios-es.json",
  "direcional": false
}
```

Quando origem e destino forem o mesmo municipio, a API deve retornar `distanciaKm = 0`.

## GET /localidades/distancias-matriz

Retorna a matriz completa de distancias entre municipios do ES para carga em cache ou tabela em memoria.

Resposta:

```json
{
  "metadata": {
    "uf": "ES",
    "totalMunicipios": 78,
    "totalPares": 3003,
    "direcional": false,
    "unidade": "km"
  },
  "municipios": [],
  "distancias": []
}
```

## GET /localidades/limitrofes

Consulta se dois municipios do Espirito Santo sao limitrofes. A consulta deve aceitar o par em qualquer ordem, pois a matriz e nao direcional.

Query params:

| Parametro | Obrigatorio | Descricao |
|-----------|-------------|-----------|
| `origemIndiceSep` | Sim | Indice do municipio de origem conforme lista da calculadora SEP. |
| `destinoIndiceSep` | Sim | Indice do municipio de destino conforme lista da calculadora SEP. |

Resposta:

```json
{
  "origem": {
    "indiceSep": 76,
    "nome": "Vila Velha",
    "uf": "ES"
  },
  "destino": {
    "indiceSep": 77,
    "nome": "Vitoria",
    "uf": "ES"
  },
  "municipioLimitrofe": true,
  "fonte": "data/municipios-limitrofes-es.json",
  "direcional": false
}
```

Quando origem e destino forem o mesmo municipio, a API deve retornar `municipioLimitrofe = false`.

## GET /localidades/limitrofes-matriz

Retorna a matriz completa de municipios limitrofes do ES para carga em cache ou tabela em memoria.

Resposta:

```json
{
  "metadata": {
    "uf": "ES",
    "totalMunicipios": 78,
    "totalPares": 195,
    "direcional": false
  },
  "municipios": [],
  "limitrofes": []
}
```

## GET /projetos/{projetoId}/solicitacoes

Consulta usada pela tela operacional **Diarias** no Backoffice e pelo painel do coordenador. Deve aceitar filtros e paginacao.

Query params sugeridos:

| Parametro | Obrigatorio | Descricao |
|-----------|-------------|-----------|
| `busca` | Nao | Busca livre por codigo, projeto, coordenador, alocacao do bolsista, origem, destino, motivo, abrangencia ou tipo de diaria. |
| `estado` | Nao | Estado da solicitacao. Ex.: `ALOCADA`, `APROVADA`, `CANCELADA`, `RECUSADA`, `REGULARIZADA_NAO_UTILIZADA`. |
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
      "projeto": "Conecta Fapes",
      "coordenador": "Marina Costa",
      "alocacaoBolsistaRef": "ALO-2026-001",
      "origem": "Vitoria/ES",
      "destino": "Linhares/ES",
      "roteiroViagemSnapshot": [
        {
          "ordem": 1,
          "origem": "Vitoria/ES",
          "destino": "Linhares/ES",
          "tipoTrecho": "PRINCIPAL",
          "abrangenciaTrecho": "DENTRO_ESTADO",
          "distanciaKm": 105.65
        }
      ],
      "trechoPrincipalIndice": 0,
      "distanciaKm": 105.65,
      "partida": "2026-06-10T08:00:00-03:00",
      "chegada": "2026-06-12T18:00:00-03:00",
      "estado": "APROVADA",
      "abrangenciaRef": "ABR-2026-001",
      "abrangenciaSnapshot": {
        "codigo": "DENTRO_ESTADO",
        "nome": "Dentro do Estado"
      },
      "tipoDiariaRef": "DIA-2026-001",
      "parametroCalculoDiariaRef": "PCD-2026-001",
      "valorTotal": 800.0
    }
  ],
  "pagina": 1,
  "tamanhoPagina": 10,
  "totalItens": 1,
  "totalPaginas": 1
}
```

## POST /projetos/{projetoId}/solicitacoes

Ao criar a solicitacao, o backend deve consumir o M008 para validar a `abrangenciaRef`, buscar o tipo de diaria vigente vinculado a ela e buscar os parametros de calculo vigentes vinculados ao tipo localizado, associando as referencias em `abrangenciaRef`, `tipoDiariaRef` e `parametroCalculoDiariaRef`. O valor unitario efetivo deve vir do tipo de diaria vigente do M008. Origem e destino final devem vir de selecao em lista controlada de localidades ou destino especial. A solicitacao pode conter `roteiroViagem`, com um ou mais trechos logisticos, e deve preservar esse roteiro no snapshot para memoria e auditoria. **Duvida para PO:** quando houver deslocamento interno de apoio, como Anchieta/ES ate Vitoria/ES para embarque em aeroporto em viagem nacional/internacional, confirmar se deve haver uma unica diaria pela abrangencia principal ou diarias separadas por trecho, pois isso pode alterar o valor consumido da rubrica. A quantidade de diarias deve seguir a normativa FAPES vigente a partir dos parametros retornados pelo M008 e da politica definida para essa duvida. A distancia entre origem e destino deve ser calculada automaticamente no backend, preferencialmente via Google Routes API, com cache/tabela de distancias em memoria como fallback operacional, e usada conforme a politica de calculo vigente. A criacao so deve ser concluida quando houver orcamento e saldo na rubrica de diaria correspondente ao valor calculado; nesse caso, o sistema gera `Transacao` de comprometimento vinculado a `RubricaProjeto`, sem aprovacao manual da FAPES. A solicitacao deve receber uma unica `alocacaoBolsistaRef` valida em M009. Quando houver aceite pendente, o sistema deve criar notificacao para a secao **Notificacoes** da Home e para a lateral de notificacoes do Front-Office, alem de enviar e-mail ao bolsista. `TransacaoFinanceira` nao participa deste endpoint; ela aparece apenas na prestacao/conciliacao do pagamento.

```json
{
  "alocacaoBolsistaRef": "ALO-2026-001",
  "abrangenciaRef": "ABR-2026-003",
  "dataHoraPartida": "2026-06-10T08:00:00-03:00",
  "dataHoraChegada": "2026-06-12T18:00:00-03:00",
  "origem": "Anchieta/ES",
  "destino": "Lisboa/Portugal",
  "roteiroViagem": [
    {
      "ordem": 1,
      "origem": "Anchieta/ES",
      "destino": "Vitoria/ES",
      "tipoTrecho": "APOIO_INTERNO",
      "meioTransporte": "TERRESTRE"
    },
    {
      "ordem": 2,
      "origem": "Vitoria/ES",
      "destino": "Lisboa/Portugal",
      "tipoTrecho": "PRINCIPAL",
      "meioTransporte": "AEREO"
    }
  ],
  "motivo": "Participacao em reuniao tecnica do projeto."
}
```

Resposta:

> Exemplo ilustrativo considerando politica de diaria unica pela abrangencia internacional. A politica final deve ser confirmada pelo PO para o caso de trecho interno de apoio + trecho nacional/internacional.

```json
{
  "id": "SD-2026-001",
  "estado": "ALOCADA",
  "alocacaoBolsistaRef": "ALO-2026-001",
  "abrangenciaRef": "ABR-2026-003",
  "abrangenciaSnapshot": {
    "codigo": "INTERNACIONAL",
    "nome": "Internacional"
  },
  "tipoDiariaRef": "DIA-2026-003",
  "parametroCalculoDiariaRef": "PCD-2026-003",
  "regraCalculoSnapshot": "Normativa FAPES vigente",
  "roteiroViagemSnapshot": [
    {
      "ordem": 1,
      "origem": "Anchieta/ES",
      "destino": "Vitoria/ES",
      "tipoTrecho": "APOIO_INTERNO",
      "abrangenciaTrecho": "DENTRO_ESTADO",
      "distanciaKm": 65.2
    },
    {
      "ordem": 2,
      "origem": "Vitoria/ES",
      "destino": "Lisboa/Portugal",
      "tipoTrecho": "PRINCIPAL",
      "abrangenciaTrecho": "INTERNACIONAL"
    }
  ],
  "trechoPrincipalIndice": 1,
  "distanciaKm": null,
  "provedorDistancia": null,
  "origemRespostaDistancia": null,
  "valorUnitarioDiaria": 620.0,
  "quantidadeDiariasCalculada": 2.5,
  "valorTotalCalculado": 1550.0,
  "rubricaProjetoRef": "RP-DIARIAS-INTERNACIONAL",
  "transacaoComprometimentoRef": "TR-2026-045",
  "estadoAceite": "PENDENTE"
}
```

## POST /solicitacoes/{solicitacaoDiariaId}/aceite

Ao registrar o aceite, o backend deve gravar a confirmacao na propria `SolicitacaoDiaria`, atualizar `estadoAceite` e enviar e-mail ao coordenador/ortogado informando que a diaria foi aceita. A solicitacao deve passar automaticamente para `APROVADA`.

```json
{
  "contaBancariaConfirmada": {
    "banco": "001",
    "agencia": "1234",
    "conta": "98765-0"
  }
}
```

Resposta:

```json
{
  "id": "SD-2026-001",
  "estadoAceite": "ASSINADO",
  "estadoSolicitacao": "APROVADA",
  "emailCoordenadorRef": "EMAIL-2026-118"
}
```

## POST /solicitacoes/{solicitacaoDiariaId}/recusa

```json
{
  "justificativa": "Conflito de agenda academica no periodo da viagem."
}
```

Resposta:

```json
{
  "id": "SD-2026-001",
  "estadoAceite": "RECUSADO",
  "estadoSolicitacao": "RECUSADA"
}
```

## POST /solicitacoes/{solicitacaoDiariaId}/cancelar

Remove/cancela uma diaria alocada ou aprovada somente antes da data/hora de partida. A remocao exige justificativa e gera transacao de reversao quando havia comprometimento.

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
  "transacaoReversaoRef": "TR-2026-046"
}
```

## POST /solicitacoes/{solicitacaoDiariaId}/regularizar-nao-utilizada

Registra que a diaria nao foi utilizada quando a data/hora de partida ja passou. O registro nao apaga a solicitacao; preserva auditoria e gera transacao de reversao quando cabivel.

```json
{
  "justificativa": "Viagem nao realizada por cancelamento da agenda apos a data prevista."
}
```

Resposta:

```json
{
  "id": "SD-2026-001",
  "estado": "REGULARIZADA_NAO_UTILIZADA",
  "transacaoReversaoRef": "TR-2026-052"
}
```
