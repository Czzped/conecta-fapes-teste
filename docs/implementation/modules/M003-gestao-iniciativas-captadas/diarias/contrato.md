# Contrato - Diarias da Iniciativa

[← Voltar](README.md)

## Comandos

| Operacao | Tipo | Descricao | Entrada | Saida | Regras |
|----------|------|-----------|---------|-------|--------|
| CadastrarTipoDiaria | Command | Cadastrar ou atualizar tipo de diaria vigente | codigo, tipoViagemRef, valorUnitario, fracaoCalculo, vigenciaInicio, vigenciaFim, ativo | TipoDiaria | RD04, RD08-A |
| CadastrarTipoViagem | Command | Cadastrar ou atualizar tipo de viagem | codigo, nome, abrangencia, descricao, ativo | TipoViagem | RD08-C |
| SolicitarDiaria | Command | Criar solicitacao para um ou mais bolsistas | iniciativaId, ortogadoId, tipoViagemRef, partida, chegada, destino, motivo, beneficiarios | SolicitacaoDiaria em RASCUNHO | RN22-RN25, RN28 |
| SubmeterSolicitacaoDiariaParaAceite | Command | Enviar aos bolsistas para assinatura | solicitacaoDiariaId | Estado AGUARDANDO_ACEITES | RN26 |
| AssinarTermoAceiteDiaria | Command | Registrar aceite do bolsista | beneficiarioDiariaId, contaBancariaConfirmada | Termo assinado | RN26 |
| RecusarTermoAceiteDiaria | Command | Registrar recusa do bolsista | beneficiarioDiariaId, justificativa | Termo recusado e solicitacao recusada quando aplicavel | RN26 |
| DecidirSolicitacaoDiaria | Command | Aprovar ou rejeitar solicitacao | solicitacaoDiariaId, decisao, justificativa | Solicitacao aprovada/rejeitada; justificativa obrigatoria quando a decisao for rejeitar | RN29-RN31 |
| CancelarSolicitacaoDiaria | Command | Cancelar diaria com justificativa | solicitacaoDiariaId, justificativa | Solicitacao cancelada e credito quando aplicavel | RN32-RN33 |

## Consultas

| Operacao | Tipo | Descricao | Entrada | Saida |
|----------|------|-----------|---------|-------|
| ConsultarTipoDiariaVigente | Query | Obter tipo de diaria vigente para data e tipo de viagem | dataReferencia, tipoViagemRef | TipoDiaria |
| ConsultarTiposViagem | Query | Listar tipos de viagem ativos | busca, abrangencia, pagina, tamanhoPagina | Lista paginada de TipoViagem |
| ConsultarSolicitacoesDiaria | Query | Listar solicitacoes da iniciativa | iniciativaId, busca, estado, periodoPartida, pagina, tamanhoPagina | Lista paginada de SolicitacaoDiaria |
| ConsultarSolicitacaoDiaria | Query | Consultar detalhe da solicitacao | solicitacaoDiariaId | Solicitacao, beneficiarios, termos e lancamentos |

## Eventos

| Evento | Quando ocorre | Payload minimo |
|--------|---------------|----------------|
| TipoDiariaCadastrado | FAPES cadastra tipo de diaria vigente | tipoDiariaRef, tipoViagemRef, valorUnitario, fracaoCalculo, vigencia |
| TipoViagemCadastrado | FAPES cadastra tipo de viagem | tipoViagemRef, nome, abrangencia, ativo |
| SolicitacaoDiariaCriada | Coordenador cria solicitacao | solicitacaoDiariaId, iniciativaId, tipoViagemRef, tipoDiariaRef, valorUnitarioDiaria |
| TermoAceiteDiariaAssinado | Bolsista assina termo | beneficiarioDiariaId, pessoaFisicaRef, dataAssinatura |
| TermoAceiteDiariaRecusado | Bolsista recusa viagem/termo | beneficiarioDiariaId, pessoaFisicaRef, dataRecusa, justificativa |
| SolicitacaoDiariaAprovada | FAPES aprova | solicitacaoDiariaId, valorTotal, lancamentoDebitoRef |
| SolicitacaoDiariaRejeitada | FAPES rejeita solicitacao | solicitacaoDiariaId, usuarioDecisorRef, dataDecisao, justificativa |
| SolicitacaoDiariaCancelada | Coordenador cancela | solicitacaoDiariaId, justificativa, lancamentoCreditoRef |

## Exemplo - SolicitarDiaria

```json
{
  "iniciativaId": "INI-2026-014",
  "ortogadoId": "ORT-2026-001",
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

Resposta esperada:

```json
{
  "solicitacaoDiariaId": "SD-2026-001",
  "estado": "RASCUNHO",
  "tipoViagemRef": "TVI-001",
  "tipoViagemSnapshot": "Dentro do Estado - Nacional",
  "tipoDiariaRef": "DIA-2026-001",
  "fracaoCalculoSnapshot": "12H",
  "regraCalculoSnapshot": "Normativa FAPES vigente",
  "valorUnitarioDiaria": 260.0,
  "quantidadeDiariasCalculada": 2.5,
  "valorTotalCalculado": 1300.0
}
```
