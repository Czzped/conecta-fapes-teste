# Proposta de Tela e Impacto no Codigo de Parcerias

[<< Voltar a Acao Transversal](README.md)

## Objetivo

Este documento analisa o impacto da Acao Transversal no prototipo de Parcerias e propoe a tela do M016 para gestao contabil e financeira da reserva institucional.

A conclusao principal e que a area de Parcerias deve apenas **calcular, evidenciar e bloquear** a reserva de Acao Transversal. A gestao contabil, o plano de aplicacao por rubrica, a execucao de despesas e a prestacao financeira institucional pertencem ao M016.

## Impacto no Codigo de Parcerias

O prototipo atual de Parcerias esta concentrado nos componentes:

| Arquivo | Papel atual | Impacto da Acao Transversal |
|---------|-------------|-----------------------------|
| `prototype/backoffice/src/app/components/Parceria.tsx` | Lista parcerias, calcula indicadores agregados e mostra dashboard de consumo por programa/rubrica. | O saldo exibido hoje considera `aporteTotal - valorAlocado`. Deve passar a considerar `aporteTotal - reservaAcaoTransversal - valorAlocado`. |
| `prototype/backoffice/src/app/components/FormularioParceria.tsx` | Cadastra a parceria, vigencia, aporte original, conta bancaria e documentos. | Deve exibir a estimativa da reserva normativa no momento do aporte original, mas sem permitir editar manualmente o percentual quando houver politica vigente. |
| `prototype/backoffice/src/app/components/DetalhesParceria.tsx` | Mostra resumo, financeiro, dashboard, documentos e permite registrar aditivo financeiro ou de tempo. | Deve calcular uma reserva para cada aporte financeiro: aporte original e cada aditivo financeiro. Aditivo de tempo nao gera reserva financeira. |
| `prototype/backoffice/src/app/components/FormularioPrograma.tsx` | Permite selecionar parceria aportante e informar valor alocado ao programa. | Deve usar somente `saldoAlocavelEmProgramas`, ja descontado da Acao Transversal. |

## Problema Atual

Hoje o modelo visual de Parcerias trata todo o valor da parceria como potencialmente alocavel em programas.

Exemplo simplificado:

```text
aporteTotal = 2.500.000
valorAlocado = 1.850.000
saldoDisponivel = 650.000
```

Com Acao Transversal, o calculo correto deve ser:

```text
valorBase = 2.500.000
percentualAcaoTransversal = 4%
valorReservaAcaoTransversal = 100.000
saldoAlocavelEmProgramas = 2.500.000 - 100.000 - 1.850.000
saldoAlocavelEmProgramas = 550.000
```

Portanto, se o codigo nao mudar, a tela de Parcerias vai permitir ou aparentar permitir que programas usem valor que ja deveria estar bloqueado para a Acao Transversal.

## Mudancas Necessarias no Modelo de Parceria

### ParceriaItem

O tipo `ParceriaItem` deve passar a representar explicitamente a reserva:

```ts
export interface ParceriaItem {
  id: number;
  nome: string;
  instituicaoParceira: string;
  aporteTotal: number;
  valorAlocado: number;
  valorReservaAcaoTransversal: number;
  percentualAcaoTransversal: number;
  saldoAlocavelEmProgramas: number;
  reservasAcaoTransversal: ReservaAcaoTransversalResumo[];
}
```

### ReservaAcaoTransversalResumo

Cada aporte financeiro que incide na norma deve gerar uma reserva propria:

```ts
export interface ReservaAcaoTransversalResumo {
  id: string;
  origem: 'APORTE_ORIGINAL' | 'ADITIVO_FINANCEIRO';
  aporteFinanceiroId: string;
  dataAporte: string;
  valorBaseCalculo: number;
  percentualAplicado: number;
  valorReservado: number;
  politicaId: string;
  faixaId: string;
  statusEnvioM016: 'PENDENTE' | 'ENVIADA' | 'CLASSIFICADA' | 'EM_EXECUCAO' | 'ENCERRADA';
}
```

### Saldos

O campo atual `saldoDisponivel` deve ser renomeado ou substituido para evitar ambiguidade:

| Campo | Formula | Dono |
|-------|---------|------|
| `aporteTotal` | Soma do aporte original e aditivos financeiros | M010 |
| `valorReservaAcaoTransversal` | Soma das reservas calculadas por aporte financeiro | M010 |
| `valorAlocado` | Soma alocada em programas | M010 |
| `saldoAlocavelEmProgramas` | `aporteTotal - valorReservaAcaoTransversal - valorAlocado` | M010 |
| `saldoFinanceiroAcaoTransversal` | `reservado - planejado/executado/glosado`, conforme estado | M016 |

## Mudancas no Cadastro da Parceria

Na secao **Aporte Financeiro Original**, o formulario deve incluir um bloco calculado:

| Campo | Comportamento |
|-------|---------------|
| Valor do aporte original | Informado pela area de Parcerias. |
| Politica de Acao Transversal | Selecionada automaticamente pela data do aporte e norma vigente. |
| Percentual aplicado | Calculado pela faixa normativa. |
| Valor reservado para Acao Transversal | Calculado e bloqueado. |
| Valor alocavel em programas | `valorAporteOriginal - valorReservado`. |

O usuario de Parcerias deve conseguir ver o calculo, mas a classificacao contabil e o plano por rubrica ficam bloqueados nesta tela e devem apontar para o M016.

## Mudancas no Aditivo da Parceria

No modal **Registrar aditivo**, quando o tipo for `Aditivo financeiro`, a tela deve exibir:

| Campo | Comportamento |
|-------|---------------|
| Valor do aditivo financeiro | Base de calculo da nova reserva. |
| Percentual aplicado | Calculado pela politica vigente na data do aditivo. |
| Valor reservado no aditivo | `valorAditivo * percentualAplicado`. |
| Valor liquido alocavel | `valorAditivo - valorReservadoNoAditivo`. |
| Envio ao M016 | Gerado ao registrar o aditivo financeiro. |

Regra: o aditivo financeiro calcula Acao Transversal somente sobre o valor do proprio aditivo. Ele nao recalcula reservas anteriores, salvo determinacao normativa explicita.

## Mudancas na Alocacao em Programas

O componente de Programa deve consultar a parceria usando `saldoAlocavelEmProgramas`, nao `saldoDisponivel`.

Ao selecionar uma parceria aportante, a tela deve apresentar:

```text
Aporte total da parceria
(-) Acao Transversal reservada
(-) Ja alocado em programas
(=) Saldo alocavel neste programa
```

Isso evita que o programa consuma recurso institucional reservado para o M016.

## Eventos Entre M010 e M016

Quando uma reserva for calculada na Parceria, o M010 deve publicar ou expor:

```json
{
  "evento": "ReservaAcaoTransversalCalculada",
  "parceriaId": "PAR-2026-001",
  "aporteFinanceiroId": "APO-2026-001",
  "origem": "APORTE_ORIGINAL",
  "valorBaseCalculo": 2500000,
  "percentualAplicado": 4,
  "valorReservado": 100000,
  "politicaId": "POL-AT-334-2023",
  "faixaId": "FX-AT-02",
  "dataCalculo": "2026-02-01"
}
```

O M016 recebe esse evento e cria a `ReservaAcaoTransversal` aguardando classificacao contabil.

## Proposta de Tela do M016

### Nome da Tela

**Contabilidade e Financeiro > Acao Transversal**

### Proposito da Tela

Permitir que a agencia de fomento acompanhe, classifique, planeje, execute e preste financeiramente os valores de Acao Transversal recebidos das Parcerias.

### Navegacao Principal

A tela deve ter cinco abas:

| Aba | Finalidade |
|-----|------------|
| Reservas | Receber e acompanhar reservas calculadas pelo M010. |
| Plano de Aplicacao | Informar como o percentual reservado sera gasto por rubrica. |
| Execucao | Registrar despesas, documentos, estornos e glosas. |
| Prestacao Financeira | Consolidar e encerrar a prestacao institucional da Acao Transversal. |
| Regras | Manter politicas, faixas percentuais e vigencias normativas. |

## Aba Reservas

### Indicadores

| Indicador | Calculo |
|-----------|---------|
| Reservado total | Soma das reservas recebidas do M010. |
| Classificado | Reservas com conta contabil, fundo financeiro e centro de custo definidos. |
| Planejado | Soma dos planos de aplicacao aprovados. |
| Executado | Soma das despesas aprovadas. |
| Saldo institucional | Reservado menos executado, considerando glosas e estornos. |

### Lista de Reservas

Colunas sugeridas:

| Coluna | Descricao |
|--------|-----------|
| Parceria | Nome/codigo da parceria de origem. |
| Origem | Aporte original ou aditivo financeiro. |
| Valor base | Valor do aporte usado no calculo. |
| Percentual | Percentual aplicado pela politica. |
| Valor reservado | Valor da Acao Transversal. |
| Conta contabil | Classificacao contabil vinculada. |
| Fundo financeiro | Fundo/carteira institucional. |
| Centro de custo | Area/finalidade responsavel. |
| Status | Pendente, classificada, planejada, em execucao, encerrada. |

### Acao Principal

**Classificar reserva**

Campos:

| Campo | Obrigatorio | Observacao |
|-------|-------------|------------|
| Conta contabil | Sim | Classificacao contabil da entrada da reserva. |
| Fundo financeiro | Sim | Fundo/carteira que segrega o recurso. |
| Centro de custo | Sim | Unidade ou finalidade institucional responsavel. |
| Conta bancaria vinculada | Condicional | Obrigatoria quando houver controle bancario segregado. |
| Observacao contabil | Nao | Justificativa ou referencia interna. |

## Aba Plano de Aplicacao

Esta aba responde diretamente a pergunta: **onde informo como vamos gastar o percentual da Acao Transversal?**

O gasto planejado deve ser informado no **Plano de Aplicacao da Acao Transversal**, dentro do M016, depois que a reserva estiver classificada contabilmente.

### Campos do Plano

| Campo | Descricao |
|-------|-----------|
| Reserva vinculada | Reserva de Acao Transversal que financia o plano. |
| Unidade responsavel | Area da FAPES responsavel pela aplicacao. |
| Periodo de aplicacao | Intervalo previsto para uso. |
| Rubrica | Categoria do gasto: diarias, passagens, publicacoes, servicos de terceiros, material permanente etc. |
| Valor planejado | Valor previsto para a rubrica. |
| Justificativa | Motivo do uso institucional. |
| Documento de suporte | Plano, despacho, memorando ou outro documento interno. |

### Validacoes

| Regra | Mensagem |
|-------|----------|
| Soma das rubricas nao pode superar a reserva disponivel. | Valor planejado excede saldo da reserva. |
| Rubrica deve estar permitida para Acao Transversal. | Rubrica nao permitida para esta politica. |
| Plano so pode ser aprovado se a reserva estiver classificada. | Classifique a reserva antes de aprovar o plano. |

## Aba Execucao

Permite registrar despesas reais da agencia:

| Campo | Descricao |
|-------|-----------|
| Plano de aplicacao | Plano aprovado que autoriza a despesa. |
| Rubrica | Rubrica planejada usada na despesa. |
| Favorecido | Pessoa ou instituicao recebedora, quando aplicavel. |
| Documento fiscal/comprobatorio | Nota, recibo, comprovante, processo ou documento equivalente. |
| Valor | Valor executado. |
| Data | Data da execucao. |
| Status | Lancada, em analise, aprovada, glosada, estornada. |

## Aba Prestacao Financeira

A prestacao financeira aqui e institucional da agencia, nao a prestacao de contas da iniciativa.

Blocos sugeridos:

| Bloco | Conteudo |
|-------|----------|
| Consolidado | Reservado, planejado, executado, glosado, estornado e saldo. |
| Documentos | Documentos comprobatórios das despesas. |
| Analise | Parecer financeiro interno, pendencias e glosas. |
| Encerramento | Resultado final e saldo remanescente. |

## Aba Regras

Cadastro das politicas normativas:

| Campo | Descricao |
|-------|-----------|
| Norma | Ex: Resolucao CCAF nº 334/2023. |
| Vigencia inicial/final | Periodo em que a regra vale. |
| Base de calculo | Aporte original, aditivo financeiro ou outra base normativa. |
| Faixas | Intervalos de valor e percentuais. |
| Rubricas permitidas | Rubricas autorizadas para plano de aplicacao. |
| Status | Rascunho, vigente, revogada. |

## Layout Sugerido

```text
Contabilidade e Financeiro / Acao Transversal

[Reservado total] [Classificado] [Planejado] [Executado] [Saldo institucional]

Filtros: Parceria | Programa relacionado | Status | Conta contabil | Periodo

Abas:
  Reservas
  Plano de Aplicacao
  Execucao
  Prestacao Financeira
  Regras

Tabela/Lista conforme aba selecionada

Painel lateral:
  Detalhes da reserva
  Origem M010
  Calculo normativo
  Classificacao contabil
  Historico de eventos
```

## Recomendacao de Implementacao

1. Ajustar Parcerias para calcular `valorReservaAcaoTransversal` e `saldoAlocavelEmProgramas`.
2. Ajustar o cadastro e o aditivo financeiro para exibir o calculo normativo.
3. Bloquear a alocacao em Programa acima do `saldoAlocavelEmProgramas`.
4. Criar no M016 a tela **Acao Transversal** com as abas Reservas, Plano de Aplicacao, Execucao, Prestacao Financeira e Regras.
5. Fazer a integracao M010 -> M016 por evento ou endpoint interno de recebimento de reserva.

