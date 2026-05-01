# Proposta: Ciclo de Fomento da Iniciativa

## Contexto

O modelo atual do M003 trata a `Iniciativa` como unidade operacional pos-contratacao. Isso esta correto para o ownership do modulo, mas nao cobre a visao de jornada apresentada na linha do tempo do produto:

```text
Submissao -> Avaliacao de Documentos -> Avaliacao Ad Hoc -> Em Contratacao -> Contratado -> Em Execucao -> Em Aprovacao de Contas -> Concluido
```

Essa jornada atravessa tres macrofases de fomento:

| Macrofase | Estados da linha do tempo | Contexto dono |
|-----------|---------------------------|---------------|
| Pre-award | Submissao, Avaliacao de Documentos, Avaliacao Ad Hoc | M011 - Configuracao/Captacao |
| Award | Em Contratacao, Contratado | M022 - Contratacao/Outorga, quando formalizado |
| Post-award | Em Execucao, Em Aprovacao de Contas, Concluido | M003, M014, M015 |

## Avaliacao do modelo atual

O M003 hoje possui `EstadoIniciativa` com:

```text
CONTRATADA, EM_EXECUCAO, CONCLUIDA, CANCELADA
```

Esse recorte e insuficiente para a experiencia do usuario, porque:

- A tela precisa mostrar eventos anteriores a criacao operacional da iniciativa no M003.
- `Em Aprovacao de Contas` pertence ao fluxo de prestacao de contas do M014, mas precisa aparecer na timeline da iniciativa.
- `Em Contratacao` e um estado intermediario de outorga, citado como M022 em M011, e nao deve ser misturado com o estado operacional pos-award do M003.
- A documentacao de Domain 04 ainda diz que M003 concentra edital, cotas e alocacoes, enquanto o README do M003 ja corrige essa fronteira dizendo que edital e M011, bolsas/alocacoes sao M009 e prestacao detalhada e M014.

## Proposta de mudanca

Introduzir uma visao transversal chamada `CicloFomentoIniciativa`, tratada como uma projecao/read model de timeline. Ela nao substitui os estados internos dos modulos donos; apenas consolida marcos relevantes para exibicao, consulta e auditoria.

### 1. Manter `EstadoIniciativa` como estado operacional do M003

O `EstadoIniciativa` continua representando apenas a vida pos-contratacao sob responsabilidade do M003/M015:

```text
CONTRATADA
EM_EXECUCAO
SUSPENSA
CONCLUIDA
CANCELADA
```

Mudanca sugerida: adicionar `SUSPENSA`, pois o Domain 04 possui fluxo de suspensao/finalizacao.

### 2. Criar entidade transversal `EstagioCicloFomento`

A timeline deve ser representada por uma entidade de estagio/fase, associada a iniciativa:

```text
EstagioCicloFomento
- ordem
- fase: FaseCicloFomento
- marco: MarcoCicloFomento
- estado: EstadoEstagioCiclo
- dataPrevistaInicio
- dataPrevistaFim
- dataInicio
- dataFim
- moduloOrigem
- referenciaOrigemId
- observacao
```

`FaseCicloFomento`:

```text
PRE_AWARD
AWARD
POST_AWARD
```

`MarcoCicloFomento`:

```text
SUBMISSAO
AVALIACAO_DOCUMENTOS
AVALIACAO_AD_HOC
EM_CONTRATACAO
CONTRATADO
EM_EXECUCAO
SUSPENSA
EM_APROVACAO_CONTAS
CONCLUIDO
CANCELADA
```

`EstadoEstagioCiclo`:

```text
PENDENTE
ATUAL
CONCLUIDO
CANCELADO
```

Cada estagio deve possuir:

| Campo | Descricao |
|-------|-----------|
| `marco` | Valor do enum `MarcoCicloFomento` |
| `fase` | `PRE_AWARD`, `AWARD` ou `POST_AWARD` |
| `dataInicio` | Data em que o marco foi atingido |
| `dataFim` | Data opcional de conclusao do marco |
| `estado` | `PENDENTE`, `ATUAL`, `CONCLUIDO`, `CANCELADO` |
| `moduloOrigem` | M011, M022, M003, M014 ou M015 |
| `referenciaOrigemId` | ID do objeto dono do evento no modulo de origem |
| `observacao` | Texto opcional para detalhamento |

### 3. Mapear os marcos aos eventos dos modulos

| Marco | Evento ou gatilho esperado | Dono |
|-------|----------------------------|------|
| `SUBMISSAO` | Proposta submetida na captacao | M011 |
| `AVALIACAO_DOCUMENTOS` | Proposta entra em analise documental / habilitacao | M011 |
| `AVALIACAO_AD_HOC` | Proposta enviada para avaliacao de merito | M011 |
| `EM_CONTRATACAO` | Resultado homologado e proposta encaminhada para termo de outorga | M022 |
| `CONTRATADO` | Termo de outorga assinado/contratacao formalizada | M022 -> M003 |
| `EM_EXECUCAO` | Iniciativa inicia execucao operacional | M003 |
| `SUSPENSA` | Iniciativa suspensa temporariamente durante o post-award | M015 |
| `EM_APROVACAO_CONTAS` | Prestacao final submetida para analise | M014 |
| `CONCLUIDO` | Prestacao final aprovada e iniciativa encerrada | M014/M015 |
| `CANCELADA` | Iniciativa cancelada antes da conclusao regular | Modulo dono da transicao |

### 4. Adicionar consulta consolidada

Adicionar ao contrato do M003 uma query de leitura:

```text
ConsultarCicloFomentoIniciativa(iniciativaId | propostaId)
```

Saida esperada:

```json
{
  "iniciativaId": "INI-2026-014",
  "propostaId": "PROP-2026-088",
  "estadoAtual": "EM_EXECUCAO",
  "marcoAtual": "EM_EXECUCAO",
  "ciclo": [
    {
      "ordem": 1,
      "marco": "SUBMISSAO",
      "fase": "PRE_AWARD",
      "dataInicio": "2024-01-15",
      "estado": "CONCLUIDO",
      "moduloOrigem": "M011"
    },
    {
      "ordem": 2,
      "marco": "AVALIACAO_DOCUMENTOS",
      "fase": "PRE_AWARD",
      "dataInicio": "2024-01-20",
      "estado": "CONCLUIDO",
      "moduloOrigem": "M011"
    },
    {
      "ordem": 3,
      "marco": "AVALIACAO_AD_HOC",
      "fase": "PRE_AWARD",
      "dataInicio": "2024-02-05",
      "estado": "CONCLUIDO",
      "moduloOrigem": "M011"
    },
    {
      "ordem": 4,
      "marco": "EM_CONTRATACAO",
      "fase": "AWARD",
      "dataInicio": "2024-02-20",
      "estado": "CONCLUIDO",
      "moduloOrigem": "M022"
    },
    {
      "ordem": 5,
      "marco": "CONTRATADO",
      "fase": "AWARD",
      "dataInicio": "2024-03-01",
      "estado": "CONCLUIDO",
      "moduloOrigem": "M003"
    },
    {
      "ordem": 6,
      "marco": "EM_EXECUCAO",
      "fase": "POST_AWARD",
      "dataInicio": "2024-03-16",
      "estado": "ATUAL",
      "moduloOrigem": "M003"
    },
    {
      "ordem": 7,
      "marco": "SUSPENSA",
      "fase": "POST_AWARD",
      "estado": "PENDENTE",
      "moduloOrigem": "M015"
    },
    {
      "ordem": 8,
      "marco": "EM_APROVACAO_CONTAS",
      "fase": "POST_AWARD",
      "estado": "PENDENTE",
      "moduloOrigem": "M014"
    },
    {
      "ordem": 9,
      "marco": "CONCLUIDO",
      "fase": "POST_AWARD",
      "estado": "PENDENTE",
      "moduloOrigem": "M015"
    },
    {
      "ordem": 10,
      "marco": "CANCELADA",
      "fase": "POST_AWARD",
      "estado": "PENDENTE",
      "moduloOrigem": "M015"
    }
  ]
}
```

### 5. Incluir solicitacao operacional de diaria no M003

A solicitacao de diaria deve pertencer ao M003 por nascer da execucao operacional da iniciativa, antes da prestacao de contas. A FAPES cadastra o tipo de diaria usado no calculo, com valor, vigencia, fracao de calculo e tipo de viagem. O M014 deve apenas consumir a solicitacao aprovada quando o coordenador comprovar o pagamento da diaria.

Fluxo proposto:

1. FAPES cadastra `TipoDiaria` com valor unitario, vigencia, fracao de calculo, tipo de viagem e status ativo.
2. Coordenador/ortogado cria `SolicitacaoDiaria` na iniciativa.
3. Informa tipo de viagem, data/hora de partida, data/hora de chegada, destino e motivo.
4. Seleciona um ou mais bolsistas/alocacoes validas da iniciativa.
5. M003 consulta M009 para validar alocacoes e M008 para dados bancarios.
6. Sistema calcula automaticamente a quantidade de diarias e usa o tipo de diaria vigente no momento da solicitacao.
7. Sistema persiste o tipo de diaria, valor unitario, fracao de calculo, quantidade e total calculado como snapshot da solicitacao.
8. Cada bolsista assina `TermoAceiteDiaria`, declarando aceite da diaria na conta bancaria cadastrada.
9. A FAPES aprova ou rejeita a solicitacao apos os aceites.
10. Quando aprovada, a solicitacao gera debito/comprometimento na rubrica de Diarias e Passagens.
11. Solicitacao aprovada fica disponivel para referencia posterior em M014 na `JustificativaDiaria`.
12. Coordenador pode cancelar uma solicitacao aprovada com justificativa.
13. Quando uma solicitacao aprovada e cancelada, o M003 gera credito de reversao na rubrica de Diarias e Passagens.

Entidades sugeridas:

```text
TipoDiaria
- codigo
- tipoViagemRef
- valorUnitario
- fracaoCalculo
- vigenciaInicio
- vigenciaFim
- ativo

SolicitacaoDiaria
- codigo
- iniciativaId
- ortogadoId
- dataHoraPartida
- dataHoraChegada
- destino
- motivo
- tipoViagemRef
- tipoDiariaRef
- quantidadeDiariasCalculada
- valorUnitarioDiaria
- fracaoCalculoSnapshot
- valorTotalCalculado
- rubricaDebitoRef
- lancamentoDebitoRef
- justificativaCancelamento
- lancamentoCreditoRef
- estado

BeneficiarioDiaria
- solicitacaoDiariaId
- alocacaoBolsistaRef
- pessoaFisicaRef
- quantidadeDiariasCalculada
- valorCalculado
- contaBancariaSnapshot

TermoAceiteDiaria
- beneficiarioDiariaId
- estado
- dataAssinatura
- versaoTermo
- hashTermo
```

Estados sugeridos para `SolicitacaoDiaria`:

```text
RASCUNHO
AGUARDANDO_ACEITES
AGUARDANDO_APROVACAO
APROVADA
REJEITADA
CANCELADA
DISPONIVEL_PRESTACAO
```

Regras principais:

- O coordenador nao informa manualmente o valor da diaria.
- O valor deve ser calculado a partir do tipo de diaria cadastrado pela FAPES e vigente para o tipo de viagem no momento da solicitacao.
- O calculo deve ser preservado como snapshot para manter historico.
- A solicitacao deve possuir ao menos um beneficiario.
- Todos os beneficiarios obrigatorios devem assinar o termo para a solicitacao seguir para aprovacao da FAPES.
- A aprovacao da FAPES deve gerar debito na rubrica de Diarias e Passagens.
- O cancelamento de diaria aprovada exige justificativa do coordenador.
- O cancelamento de diaria aprovada deve gerar credito na rubrica de Diarias e Passagens pelo valor debitado.
- M014 deve exigir referencia da solicitacao aprovada ao registrar a comprovacao da diaria.

## Impacto na documentacao

Arquivos a ajustar em uma proxima implementacao:

| Arquivo | Mudanca |
|---------|---------|
| `docs/implementation/modules/M003-gestao-iniciativas-captadas/README.md` | Explicar que M003 e dono do estado operacional pos-award, mas oferece/projeta a timeline consolidada. |
| `docs/implementation/modules/M003-gestao-iniciativas-captadas/modelo-estrutural.md` | Adicionar `EstagioCicloFomento`, `FaseCicloFomento`, `MarcoCicloFomento` e `EstadoEstagioCiclo`. |
| `docs/implementation/modules/M003-gestao-iniciativas-captadas/contrato.md` | Adicionar query `ConsultarCicloFomentoIniciativa` e evento/projecao de marcos. |
| `docs/discovery/domains/04-fomento-post-award.md` | Corrigir a fronteira de M003, removendo ownership de edital, cotas e alocacoes. |
| `docs/discovery/domains/03-fomento-pre-award.md` | Alinhar a fase de contratacao com a macrofase `AWARD`, idealmente separando M022. |

## Decisao recomendada

Adotar o ciclo como **read model transversal**, nao como novo agregado dono de todos os estados. Assim:

- M011 continua dono de captacao, submissao e avaliacoes.
- M022 deve ser o dono natural de contratacao/outorga.
- M003 continua dono da iniciativa pos-contratacao e da visao operacional consolidada.
- M014 continua dono da prestacao de contas.
- M015 continua dono de suspensao e finalizacao.

Essa abordagem atende a experiencia da timeline sem violar ownership dos modulos.
