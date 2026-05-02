# Contrato API - Diarias da Iniciativa

[← Voltar](README.md)

Base sugerida: `/api/v1/m003/diarias`

## Endpoints

| Metodo | Rota | Operacao | Perfil |
|--------|------|----------|--------|
| POST | `/iniciativas/{iniciativaId}/solicitacoes` | SolicitarDiaria | COORDENADOR |
| GET | `/iniciativas/{iniciativaId}/solicitacoes` | ConsultarSolicitacoesDiaria | COORDENADOR, ANALISTA_FAPES |
| GET | `/solicitacoes/{solicitacaoDiariaId}` | ConsultarSolicitacaoDiaria | COORDENADOR, ANALISTA_FAPES, M014 |
| POST | `/solicitacoes/{solicitacaoDiariaId}/beneficiarios/{beneficiarioId}/aceite` | AssinarTermoAceiteDiaria | BOLSISTA |
| POST | `/solicitacoes/{solicitacaoDiariaId}/beneficiarios/{beneficiarioId}/recusa` | RecusarTermoAceiteDiaria | BOLSISTA |
| POST | `/solicitacoes/{solicitacaoDiariaId}/cancelar` | RemoverSolicitacaoDiaria | COORDENADOR |
| POST | `/solicitacoes/{solicitacaoDiariaId}/regularizar-nao-utilizada` | RegularizarDiariaNaoUtilizada | COORDENADOR |

> Cadastros de `TipoViagem` e `TipoDiaria` pertencem ao M008. O M003 consome `/api/v1/m008/tipos-viagem` e `/api/v1/m008/tipos-diaria/vigente` para validar e calcular a solicitacao.

## GET /iniciativas/{iniciativaId}/solicitacoes

Consulta usada pela tela operacional **Diarias** no Backoffice e pelo painel do coordenador. Deve aceitar filtros e paginacao.

Query params sugeridos:

| Parametro | Obrigatorio | Descricao |
|-----------|-------------|-----------|
| `busca` | Nao | Busca livre por codigo, iniciativa, coordenador, beneficiario, destino, motivo, tipo de viagem ou tipo de diaria. |
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

## POST /iniciativas/{iniciativaId}/solicitacoes

Ao criar a solicitacao, o backend deve consumir o M008 para validar o tipo de viagem e buscar o tipo de diaria vigente vinculado a ele, associar sua referencia em `tipoDiariaRef` e persistir o tipo de viagem selecionado por referencia/snapshot. O valor unitario efetivo e a fracao de calculo devem vir do tipo de diaria vigente do M008. A quantidade de diarias deve seguir a normativa FAPES vigente. A criacao so deve ser concluida quando houver orcamento e saldo na rubrica de diaria correspondente ao tipo de viagem selecionado; nesse caso, o sistema gera `Transacao` de comprometimento vinculado a `RubricaProjeto`, sem aprovacao manual da FAPES. Quando houver beneficiario com aceite pendente, o sistema deve criar notificacao para a secao **Notificacoes** da Home e para a lateral de notificacoes do Front-Office, alem de enviar e-mail ao bolsista. `TransacaoFinanceira` nao participa deste endpoint; ela aparece apenas na prestacao/conciliacao do pagamento.

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
  "estado": "ALOCADA",
  "tipoViagemRef": "TVI-001",
  "tipoViagemSnapshot": "Dentro do Estado - Nacional",
  "tipoDiariaRef": "DIA-2026-001",
  "fracaoCalculoSnapshot": "12H",
  "regraCalculoSnapshot": "Normativa FAPES vigente",
  "valorUnitarioDiaria": 260.0,
  "quantidadeDiariasCalculada": 2.5,
  "valorTotalCalculado": 1300.0,
  "rubricaProjetoRef": "RP-DIARIAS",
  "transacaoComprometimentoRef": "TR-2026-045",
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

## POST /solicitacoes/{solicitacaoDiariaId}/beneficiarios/{beneficiarioId}/aceite

Ao assinar o termo de aceite, o backend deve registrar a confirmacao do bolsista, atualizar o estado do termo e enviar e-mail ao coordenador/ortogado informando que a diaria foi aceita. Quando todos os aceites obrigatorios estiverem assinados, a solicitacao deve passar automaticamente para `APROVADA`.

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
  "beneficiarioId": "BD-2026-001",
  "estadoTermo": "ACEITO",
  "estadoSolicitacao": "ALOCADA",
  "emailCoordenadorRef": "EMAIL-2026-118"
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
