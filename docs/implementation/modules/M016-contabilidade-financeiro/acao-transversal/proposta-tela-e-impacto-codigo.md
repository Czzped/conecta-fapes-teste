# Proposta de Tela e Impacto no Codigo de Parcerias

[<< Voltar a Acao Transversal](README.md)

## Objetivo

Este documento analisa o impacto da Taxa de Gestao de Parcerias no prototipo de Parcerias e propoe a tela do M016 para a execucao dos recursos custodiados pela Acao Transversal.

A conclusao principal e que a area de Parcerias deve apenas **calcular, evidenciar e bloquear** a Taxa de Gestao de Parcerias. O recebimento, a classificacao, o repasse e a custodia da taxa pertencem ao subdominio taxa-gestao do M016. A Acao Transversal cobre somente a execucao: plano de aplicacao por rubrica, execucao de despesas e prestacao de contas institucional.

## Impacto no Codigo de Parcerias

O prototipo atual de Parcerias esta concentrado nos componentes:

| Arquivo | Papel atual | Impacto da Acao Transversal |
|---------|-------------|-----------------------------|
| `prototype/backoffice/src/app/components/Parceria.tsx` | Lista parcerias, calcula indicadores agregados e mostra dashboard de consumo por programa/rubrica. | O saldo exibido hoje considera `aporteTotal - valorAlocado`. Deve passar a considerar `aporteTotal - valorTaxaGestao - valorAlocado`. |
| `prototype/backoffice/src/app/components/FormularioParceria.tsx` | Cadastra a parceria, vigencia, aporte original, conta bancaria e documentos. | Deve exibir a estimativa da Taxa de Gestao de Parcerias no momento do aporte original, mas sem permitir editar manualmente o percentual quando houver politica vigente. |
| `prototype/backoffice/src/app/components/DetalhesParceria.tsx` | Mostra resumo, financeiro, dashboard, documentos e permite registrar aditivo financeiro ou de tempo. | Deve calcular uma taxa para cada aporte financeiro: aporte original e cada aditivo financeiro. Aditivo de tempo nao gera taxa financeira. |
| `prototype/backoffice/src/app/components/FormularioPrograma.tsx` | Permite selecionar parceria aportante e informar valor alocado ao programa. | Deve usar somente `saldoAlocavelEmProgramas`, ja descontado da Taxa de Gestao de Parcerias. |

## Problema Atual

Hoje o modelo visual de Parcerias trata todo o valor da parceria como potencialmente alocavel em programas.

Exemplo simplificado:

```text
aporteTotal = 2.500.000
valorAlocado = 1.850.000
saldoDisponivel = 650.000
```

Com a Taxa de Gestao de Parcerias, o calculo correto deve ser:

```text
valorBase = 2.500.000
percentualTaxaGestao = 4%
valorTaxaGestao = 100.000
saldoAlocavelEmProgramas = 2.500.000 - 100.000 - 1.850.000
saldoAlocavelEmProgramas = 550.000
```

Portanto, se o codigo nao mudar, a tela de Parcerias vai permitir ou aparentar permitir que programas usem valor que ja deveria estar bloqueado pela Taxa de Gestao de Parcerias.

## Mudancas Necessarias no Modelo de Parceria

### ParceriaItem

O tipo `ParceriaItem` deve passar a representar explicitamente a Taxa de Gestao de Parcerias:

```ts
export interface ParceriaItem {
  id: number;
  nome: string;
  instituicaoParceira: string;
  aporteTotal: number;
  valorAlocado: number;
  valorTaxaGestao: number;
  percentualTaxaGestao: number;
  saldoAlocavelEmProgramas: number;
  taxasGestao: TaxaGestaoParceriasResumo[];
}
```

### TaxaGestaoParceriasResumo

Cada aporte financeiro que incide na norma deve gerar uma taxa propria:

```ts
export interface TaxaGestaoParceriasResumo {
  id: string;
  origem: 'APORTE_ORIGINAL' | 'ADITIVO_FINANCEIRO';
  aporteFinanceiroId: string;
  dataAporte: string;
  valorBase: number;
  percentualAplicado: number;
  valorTaxaGestao: number;
  versaoFaixaId: string; // versao da politica, faixa e siglas derivam daqui
  marcoM016: 'Recebida' | 'Classificada' | 'Repassada' | 'Vinculada' | 'Encerrada'; // derivado de fatos, sem campo estado
}
```

### Saldos

O campo atual `saldoDisponivel` deve ser renomeado ou substituido para evitar ambiguidade:

| Campo | Formula | Dono |
|-------|---------|------|
| `aporteTotal` | Soma do aporte original e aditivos financeiros | M010 |
| `valorTaxaGestao` | Soma das taxas calculadas por aporte financeiro | M010 |
| `valorAlocado` | Soma alocada em programas | M010 |
| `saldoAlocavelEmProgramas` | `aporteTotal - valorTaxaGestao - valorAlocado` | M010 |
| `saldoFinanceiroAcaoTransversal` | `valorTaxaGestao - planejado/executado/glosado`, conforme estado | M016 (acao-transversal) |

## Mudancas no Cadastro da Parceria

Na secao **Aporte Financeiro Original**, o formulario deve incluir um bloco calculado:

| Campo | Comportamento |
|-------|---------------|
| Valor do aporte original | Informado pela area de Parcerias. |
| Politica de Taxa de Gestao de Parcerias | Selecionada automaticamente pela data do aporte e norma vigente. |
| Percentual aplicado | Calculado pela faixa normativa. |
| Valor da Taxa de Gestao de Parcerias | Calculado e bloqueado. |
| Valor alocavel em programas | `valorAporteOriginal - valorTaxaGestao`. |

O usuario de Parcerias deve conseguir ver o calculo, mas a classificacao contabil e o plano por rubrica ficam bloqueados nesta tela e devem apontar para o M016.

## Mudancas no Aditivo da Parceria

No modal **Registrar aditivo**, quando o tipo for `Aditivo financeiro`, a tela deve exibir:

| Campo | Comportamento |
|-------|---------------|
| Valor do aditivo financeiro | Base de calculo da nova taxa. |
| Percentual aplicado | Calculado pela politica vigente na data do aditivo. |
| Valor da taxa no aditivo | `valorAditivo * percentualAplicado`. |
| Valor liquido alocavel | `valorAditivo - valorTaxaGestaoNoAditivo`. |
| Envio ao M016 | Gerado ao registrar o aditivo financeiro. |

Regra: o aditivo financeiro calcula a Taxa de Gestao de Parcerias somente sobre o valor do proprio aditivo. Ele nao recalcula taxas anteriores, salvo determinacao normativa explicita.

## Mudancas na Alocacao em Programas

O componente de Programa deve consultar a parceria usando `saldoAlocavelEmProgramas`, nao `saldoDisponivel`.

Ao selecionar uma parceria aportante, a tela deve apresentar:

```text
Aporte total da parceria
(-) Taxa de Gestao de Parcerias
(-) Ja alocado em programas
(=) Saldo alocavel neste programa
```

Isso evita que o programa consuma recurso institucional retido pela Taxa de Gestao de Parcerias e custodiado pelo M016.

## Eventos Entre M010 e M016

Quando uma taxa for calculada na Parceria, o M010 deve publicar ou expor:

```json
{
  "evento": "TaxaGestaoParceriasCalculada",
  "aporteFinanceiroId": "APO-2026-001",
  "versaoFaixaId": "VFX-AT-02",
  "valorBase": 2500000,
  "percentualAplicado": 4,
  "valorTaxaGestao": 100000
}
```

> Parceria e versao da politica nao trafegam no evento — derivam, respectivamente, do `aporteFinanceiroId` (M010) e da `versaoFaixaId` (VersaoFaixaPercentual imutavel).

O subdominio taxa-gestao do M016 consome esse evento e cria a `TaxaGestaoParcerias` (marco derivado: recebida), aguardando classificacao contabil.

## Proposta de Tela do M016

### Nome da Tela

**Contabilidade e Financeiro > Acao Transversal**

### Proposito da Tela

Permitir que a agencia de fomento acompanhe, planeje, execute e preste contas dos valores da Taxa de Gestao de Parcerias custodiados e repassados pelo subdominio taxa-gestao. O recebimento, a classificacao contabil, o repasse e a versao da politica sao do subdominio taxa-gestao; a Acao Transversal e execucao.

### Navegacao Principal

A tela deve ter cinco abas:

| Aba | Finalidade |
|-----|------------|
| Taxa de Gestao | Acompanhar as taxas custodiadas e repassadas pelo subdominio taxa-gestao (origem no evento do M010). |
| Plano de Aplicacao | Informar como o valor da taxa sera gasto por rubrica. |
| Execucao | Registrar despesas, documentos, estornos e glosas. |
| Prestacao Financeira | Consolidar e encerrar a prestacao institucional da Acao Transversal. |
| Regras | Manter politicas, faixas percentuais e vigencias normativas (mantidas no subdominio taxa-gestao). |

## Aba Taxa de Gestao

Esta aba lista as taxas recebidas do M010 e custodiadas pelo subdominio taxa-gestao. O recebimento, a classificacao contabil e o repasse sao executados no subdominio taxa-gestao; aqui a Acao Transversal apenas acompanha e referencia a taxa que financia a execucao.

### Indicadores

| Indicador | Calculo |
|-----------|---------|
| Taxa total | Soma das taxas recebidas do M010. |
| Classificado | Taxas com conta contabil, fundo financeiro e centro de custo definidos (no subdominio taxa-gestao). |
| Planejado | Soma dos planos de aplicacao aprovados. |
| Executado | Soma das despesas aprovadas. |
| Saldo institucional | Taxa menos executado, considerando glosas e estornos. |

### Lista de Taxas

Colunas sugeridas:

| Coluna | Descricao |
|--------|-----------|
| Parceria | Nome/codigo da parceria de origem. |
| Origem | Aporte original ou aditivo financeiro. |
| Valor base | Valor do aporte usado no calculo. |
| Percentual | Percentual aplicado pela politica. |
| Valor da taxa | Valor da Taxa de Gestao de Parcerias. |
| Conta contabil | Classificacao contabil vinculada. |
| Fundo financeiro | Fundo/carteira institucional. |
| Centro de custo | Area/finalidade responsavel. |
| Marco (derivado) | Recebida, classificada, repassada, vinculada, encerrada. |

### Acao Principal

A classificacao contabil da taxa (conta contabil, fundo financeiro, centro de custo, conta bancaria de repasse) e responsabilidade do subdominio taxa-gestao. Nesta aba a Acao Transversal apenas consulta a taxa ja classificada e vinculada que financia o plano de aplicacao.

## Aba Plano de Aplicacao

Esta aba responde diretamente a pergunta: **onde informo como vamos gastar o valor da Taxa de Gestao de Parcerias?**

O gasto planejado deve ser informado no **Plano de Aplicacao da Acao Transversal**, dentro do M016, depois que a taxa estiver classificada e vinculada pelo subdominio taxa-gestao.

### Campos do Plano

| Campo | Descricao |
|-------|-----------|
| Taxa vinculada | Taxa de Gestao de Parcerias que financia o plano. |
| Unidade responsavel | Area da FAPES responsavel pela aplicacao. |
| Periodo de aplicacao | Intervalo previsto para uso. |
| Rubrica | Categoria do gasto: diarias, passagens, publicacoes, servicos de terceiros, material permanente etc. |
| Valor planejado | Valor previsto para a rubrica. |
| Justificativa | Motivo do uso institucional. |
| Documento de suporte | Plano, despacho, memorando ou outro documento interno. |

### Validacoes

| Regra | Mensagem |
|-------|----------|
| Soma das rubricas nao pode superar o valor da taxa disponivel. | Valor planejado excede saldo da taxa. |
| Rubrica deve estar permitida para Acao Transversal. | Rubrica nao permitida para esta politica. |
| Plano so pode ser aprovado se a taxa estiver classificada. | Classifique a taxa antes de aprovar o plano. |

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
| Consolidado | Valor da taxa, planejado, executado, glosado, estornado e saldo. |
| Documentos | Documentos comprobatórios das despesas. |
| Analise | Parecer financeiro interno, pendencias e glosas. |
| Encerramento | Resultado final e saldo remanescente. Quando a `PrestacaoContasAcaoTransversal` e aprovada, o subdominio taxa-gestao transita a `TaxaGestaoParcerias` para ENCERRADA. |

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

[Taxa total] [Classificado] [Planejado] [Executado] [Saldo institucional]

Filtros: Parceria | Programa relacionado | Status | Conta contabil | Periodo

Abas:
  Taxa de Gestao
  Plano de Aplicacao
  Execucao
  Prestacao Financeira
  Regras

Tabela/Lista conforme aba selecionada

Painel lateral:
  Detalhes da taxa
  Origem M010
  Calculo normativo
  Classificacao contabil (taxa-gestao)
  Historico de eventos
```

## Recomendacao de Implementacao

1. Ajustar Parcerias para calcular `valorTaxaGestao` e `saldoAlocavelEmProgramas`.
2. Ajustar o cadastro e o aditivo financeiro para exibir o calculo normativo.
3. Bloquear a alocacao em Programa acima do `saldoAlocavelEmProgramas`.
4. Criar no M016 a tela **Acao Transversal** com as abas Taxa de Gestao, Plano de Aplicacao, Execucao, Prestacao Financeira e Regras.
5. Fazer a integracao M010 -> M016 pelo evento `TaxaGestaoParceriasCalculada`, consumido pelo subdominio taxa-gestao.

