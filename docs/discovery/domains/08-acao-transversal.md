# Domain 08 — Taxa de Gestao de Parcerias e Acao Transversal

Dois conceitos distintos que antes compartilhavam o mesmo nome "Acao Transversal". A separacao foi necessaria porque os dois mecanismos tem natureza, dono e ciclo de vida completamente diferentes.

**Modulos que implementam este domain:** M010, M016

---

## 8.1 Por Que Separar

O nome "Acao Transversal" era usado de forma ambigua para descrever:

1. **O mecanismo de retencao** — um percentual retido sobre o aporte de uma Parceria, custodiado em conta bancaria especifica no BANESTES. Mecanismo financeiro/tributario que nasce automaticamente ao registrar um aporte.

2. **O projeto de execucao** — uma acao ou projeto interno da FAPES que gasta esses recursos para custear despesas operacionais e administrativas. Tem plano de aplicacao, Coordenador Outorgado, despesas e prestacao de contas.

Modelar os dois como um unico conceito criava ambiguidade: quem e o dono do dinheiro? Quando ele "vira" acao? O Coordenador Outorgado gerencia a retencao ou o projeto? A conta bancaria pertence a reserva ou ao projeto?

**Decisao:** separar em dois conceitos com nomes distintos na linguagem ubiqua do dominio.

---

## 8.2 Taxa de Gestao de Parcerias

### Conceito

A Taxa de Gestao de Parcerias e o percentual retido sobre o valor de cada AporteFinanceiro de uma Parceria, destinado a custear despesas operacionais e administrativas da FAPES relacionadas a execucao dos programas e projetos apoiados. Conforme a Resolucao CCAF n. 334/2023, esses recursos apoiam, estruturam, organizam e capacitam as areas meio e finalisticas da Fundacao.

A Taxa **nao e** uma rubrica livre do projeto nem um recurso disponivel ao coordenador da iniciativa apoiada.

### Percentuais

Os percentuais devem ser parametrizados como politica normativa (PoliticaTaxaGestaoParcerias no M016), mantendo vigencia, base legal e faixas aplicaveis. A politica e imutavel para taxas ja calculadas — atualizacoes valem apenas para novos aportes.

| Valor total do aporte | Percentual |
|----------------------|------------|
| R$ 50.000,00 a R$ 2.000.000,00 | 5% |
| R$ 2.000.000,01 a R$ 5.000.000,00 | 4% |
| Acima de R$ 5.000.000,00 | 3% |

### Responsabilidades por Modulo

| Modulo | Responsabilidade |
|--------|-----------------|
| M010 | Calcula a taxa no momento do registro do AporteFinanceiro; registra o snapshot da politica aplicada; bloqueia o valor do saldo alocavel em Programas. |
| M016 | Recebe a TaxaGestaoParcerias; classifica em conta contabil, fundo e centro de custo; controla a conta bancaria BANESTES quando houver repasse. |

### Conta Bancaria

Quando houver repasse ao Coordenador Outorgado, a Resolucao CCAF n. 334/2023 determina que a transferencia ocorra em conta bancaria especifica, aberta pela FAPES no BANESTES em nome do Coordenador Outorgado. Essa conta e cadastrada como `ContaBancaria` no M008 (cadastro corporativo) e referenciada pelo M016.

A expressao "conta bancaria especifica" nao significa uma conta global para toda a Taxa de Gestao — significa uma conta vinculada ao escopo autorizado no Termo de Outorga.

---

## 8.3 Acao Transversal

### Conceito

A Acao Transversal e um projeto ou acao institucional interna da FAPES financiada por uma ou mais TaxaGestaoParcerias. Ela tem:

- objetivo e descricao
- periodo de vigencia
- area responsavel na FAPES
- Coordenador Outorgado designado via Termo de Outorga
- plano de aplicacao por rubrica permitida
- despesas institucionais registradas
- prestacao de contas financeira

A Acao Transversal **nao e** rubrica de projeto externo. Ela representa o mecanismo pelo qual a FAPES gasta, de forma rastreavel e com prestacao de contas, os recursos custodiados pela Taxa de Gestao de Parcerias.

### Coordenador Outorgado

O Coordenador Outorgado e o servidor publico vinculado a FAPES que recebe autorizacao formal da Diretoria Executiva para gerir os recursos de uma Acao Transversal por meio de Termo de Outorga (TO).

**Regra critica:** o Coordenador Outorgado NAO pode ser inferido automaticamente a partir do coordenador da Parceria, do Programa ou do Projeto apoiado. A designacao depende do ato da Diretoria Executiva e do respectivo Termo de Outorga. O outorgado pode indicar membros para executar atividades previstas no TO, mas a responsabilidade pela gestao e prestacao de contas permanece vinculada a ele.

---

## 8.4 Relacao entre os Dois Conceitos

```
AporteFinanceiro (Parceria)
  → gera TaxaGestaoParcerias (M010 calcula, M016 custodia)
      → financia AcaoTransversal (via OutorgaAcaoTransversal)
          → OutorgaAcaoTransversal
              → ContaBancaria (BANESTES, cadastrada no M008)
              → CoordenadorOutorgado (PessoaFisica do M008)
          → PlanoAplicacaoAT
          → DespesaAcaoTransversal
          → PrestacaoContasAcaoTransversal
```

Uma TaxaGestaoParcerias pode financiar uma ou mais AcoesTransversais. Uma AcaoTransversal pode ser financiada por multiplas Taxas (via OutorgaAcaoTransversal).

---

## 8.5 Fronteiras

| Contexto | Responsabilidade |
|----------|-----------------|
| M010 - Planejamento e Estrategia | Calcula a TaxaGestaoParcerias na Parceria ao registrar AporteFinanceiro; registra snapshot da politica; bloqueia o valor do saldo alocavel em Programas. |
| M016 - Contabilidade e Financeiro | Recebe a Taxa, classifica contabilmente, controla conta bancaria quando houver repasse; e dono da AcaoTransversal como projeto de gasto, incluindo plano de aplicacao, despesas e prestacao de contas. |
| M008 - Cadastros Corporativos | Fornece PessoaFisica (Coordenador Outorgado), ContaBancaria como cadastro corporativo reutilizavel. |
| M014 - Prestacao de Contas | Trata prestacao de contas de Iniciativas/Projetos externos; NAO e dono da prestacao financeira institucional da AcaoTransversal. |

---

## 8.6 Funcionalidades

### Taxa de Gestao de Parcerias

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 8.1.1 | Parametrizar Politica de Taxa de Gestao | Cadastrar base legal, vigencia, faixas percentuais e rubricas permitidas | Gestor Financeiro | Resolucao CCAF n. 334/2023 |
| 8.1.2 | Calcular Taxa de Gestao | Calcular taxa sobre aporte original ou aditivo, mantendo snapshot da politica aplicada | Servidor da Area de Parcerias | Resolucao CCAF n. 334/2023 |
| 8.1.3 | Classificar Taxa de Gestao | Classificar em conta contabil, fundo financeiro e centro de custo institucional | Gestor Financeiro | Art. 25, III |
| 8.1.4 | Registrar Conta Bancaria | Registrar conta BANESTES aberta pela FAPES em nome do Coordenador Outorgado | Gestor Financeiro | Resolucao CCAF n. 334/2023 |

### Acao Transversal

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 8.2.1 | Criar Acao Transversal | Registrar projeto interno FAPES com objetivo, periodo e area responsavel | Gestor Financeiro | Resolucao CCAF n. 334/2023 |
| 8.2.2 | Designar Coordenador Outorgado | Registrar Termo de Outorga, servidor FAPES designado, periodo e recurso abrangido | Diretoria Executiva, Gestor Financeiro | Resolucao CCAF n. 334/2023 |
| 8.2.3 | Planejar Aplicacao | Distribuir a taxa por rubricas permitidas sem ultrapassar o saldo disponivel | Gestor Financeiro | Resolucao CCAF n. 334/2023 |
| 8.2.4 | Executar Despesa de Acao Transversal | Registrar despesa institucional com rubrica permitida, documento comprobatorio e justificativa | Coordenador Outorgado, Gestor Financeiro | Resolucao CCAF n. 334/2023 |
| 8.2.5 | Prestar Contas da Acao Transversal | Submeter e analisar prestacao financeira institucional do recurso gerido pelo Coordenador Outorgado | Coordenador Outorgado, Analista Financeiro | Resolucao CCAF n. 334/2023; Art. 27, II |
