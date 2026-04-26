# Contrato do Modulo

Dominio e regras de negocio: ver [README.md](README.md)

## Proposito do Contrato

Este contrato documenta a superficie publica do M022 como modulo responsavel por formalizar contratacao/outorga de propostas aprovadas no resultado final de uma captacao.

## Consumidores e Dependencias

| Tipo | Modulo/Ator | Uso |
|------|-------------|-----|
| Dependencia | M011 | Fornece propostas aprovadas no resultado final |
| Dependencia | M008 | Fornece dados de pessoa fisica e instituicao |
| Consumidor | M003 | Recebe iniciativa apos contratacao/outorga |
| Ator | Area Tecnica | Conduz convocacao, conferencia e formalizacao |

## Operacoes Publicas

| Operacao | Tipo | Objetivo | Entrada | Saida |
|----------|------|----------|---------|-------|
| ListarPropostasAprovadas | Query | Listar propostas aprovadas no resultado final da captacao | captacaoId | Lista de propostas aprovadas |
| ConvocarPropostaAprovada | Command | Iniciar contratacao/outorga de uma proposta aprovada | propostaId, captacaoId | Contratacao/outorga em convocacao |
| ConferirRequisitosFinais | Command | Registrar conferencia final antes da formalizacao | contratacaoOutorgaId, resultado | Conferencia registrada |
| FormalizarContratacaoOutorga | Command | Registrar termo assinado e data de outorga | contratacaoOutorgaId, termo, outorgado | Contratacao/outorga formalizada |
| CancelarContratacaoOutorga | Command | Cancelar contratacao/outorga antes da formalizacao | contratacaoOutorgaId, justificativa | Contratacao/outorga cancelada |
| EncaminharIniciativaParaM003 | Command | Solicitar registro da iniciativa contratada no M003 | contratacaoOutorgaId | Referencia da iniciativa |

## Eventos

- `PropostaConvocada`
- `ContratacaoOutorgaFormalizada`
- `ContratacaoOutorgaCancelada`
- `IniciativaEncaminhadaParaM003`
