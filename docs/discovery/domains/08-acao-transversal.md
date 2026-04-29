# Domain 08 — Acao Transversal

Reserva normativa institucional criada a partir de recursos de parcerias, projetos ou programas para custear despesas operacionais e administrativas da FAPES relacionadas a execucao dos programas e projetos apoiados.

**Modulos que implementam este domain:** M010, M016

---

## 8.1 Conceito

A Acao Transversal e uma reserva financeira institucional calculada sobre o valor de uma parceria, projeto ou programa. Ela nao e uma rubrica livre do projeto nem um recurso automaticamente disponivel ao coordenador da iniciativa apoiada. Sua finalidade e apoiar, estruturar, organizar e capacitar as areas meio e finalisticas da FAPES para operar programas e projetos.

Conforme a Resolucao CCAF nº 334/2023, esses recursos podem ser usados para despesas internas vinculadas a essas atividades, como diarias, passagens, publicacoes, material permanente, servicos de terceiros e demais itens permitidos pelas normas aplicaveis.

## 8.2 Percentuais

Os percentuais da Acao Transversal devem ser parametrizados como politica normativa, mantendo vigencia, base legal e faixas aplicaveis.

| Valor total do programa/projeto/parceria | Percentual de Acao Transversal |
|------------------------------------------|--------------------------------|
| R$ 50.000,00 a R$ 2.000.000,00 | 5% |
| R$ 2.000.000,01 a R$ 5.000.000,00 | 4% |
| Acima de R$ 5.000.000,00 | 3% |

O M010 calcula a reserva na Parceria e desconta esse valor do saldo alocavel em Programas. O M016 recebe a reserva para classificacao contabil, fundo financeiro, centro de custo, plano de aplicacao, execucao e prestacao financeira institucional.

## 8.3 Conta Bancaria e Repasse

Quando houver repasse ao outorgado, a Resolucao CCAF nº 334/2023 determina que a transferencia ocorra em conta bancaria especifica, aberta pela FAPES em nome do coordenador, no Banco do Estado do Espirito Santo - BANESTES.

A resolucao nao define numero de agencia ou conta. Ela define a regra de destino:

```text
Acao Transversal
  -> conta bancaria especifica
  -> aberta pela FAPES
  -> em nome do Coordenador Outorgado
  -> BANESTES
```

A expressao "conta bancaria especifica" nao deve ser interpretada como uma conta corrente unica e global da FAPES para toda Acao Transversal. Tambem nao deve ser fixada, por regra de sistema, como exatamente uma conta para cada parceria. A conta deve ser especifica para o **escopo autorizado no Termo de Outorga ou no repasse**.

Assim, o sistema deve permitir que a conta esteja vinculada a uma outorga/repasse de Acao Transversal e registre claramente o que ela cobre. O escopo pode ser uma reserva, uma parceria, um conjunto de reservas ou outro agrupamento definido formalmente no Termo de Outorga. O ponto obrigatorio e que a conta seja especifica, aberta pela FAPES, em nome do Coordenador Outorgado e no BANESTES.

Modelo conceitual recomendado:

```text
OutorgaAcaoTransversal
  -> escopoGestao
  -> ContaBancariaAcaoTransversal
  -> RepasseAcaoTransversal
```

## 8.4 Coordenador Outorgado

O Coordenador Outorgado da Acao Transversal e o servidor publico vinculado a FAPES que recebe autorizacao formal da Diretoria Executiva para gerir os recursos da Acao Transversal por meio de Termo de Outorga (TO).

Esse papel existe para operacionalizar a movimentacao, utilizacao e prestacao de contas dos recursos institucionais reservados. Ele nao deve ser inferido automaticamente a partir do coordenador da parceria, do programa ou do projeto apoiado.

### Unidade de Designacao

O outorgado da Acao Transversal nao deve ser modelado como uma pessoa unica global da FAPES para todas as parcerias. A designacao deve ser rastreada por Termo de Outorga e pelo recurso ao qual o termo se aplica.

Modelo conceitual recomendado:

```text
Reserva/Repasse de Acao Transversal
  -> Termo de Outorga
  -> Coordenador Outorgado
  -> Pessoa Fisica vinculada a FAPES
```

Isso permite dois cenarios validos:

- uma parceria, reserva ou repasse possuir um Coordenador Outorgado especifico;
- a mesma pessoa da FAPES ser designada em mais de um Termo de Outorga.

Portanto, o sistema deve registrar quem foi autorizado, por qual TO, para qual recurso, em qual periodo e com qual responsabilidade de prestacao de contas. Quando necessario, o Coordenador Outorgado pode indicar membros para executar atividades previstas no TO, mas a responsabilidade pela gestao e pela prestacao de contas permanece vinculada ao outorgado.

## 8.5 Fronteiras

| Contexto | Responsabilidade |
|----------|------------------|
| M010 - Planejamento e Estrategia | Calcula a reserva na Parceria, registra a politica aplicada e bloqueia o valor para alocacao em Programas. |
| M016 - Contabilidade e Financeiro | Recebe a reserva, classifica em conta contabil/fundo/centro de custo, controla conta bancaria quando houver repasse, planeja, executa e presta financeiramente. |
| M008 - Cadastros Corporativos | Fornece Pessoa Fisica, vinculo institucional com a FAPES e dados cadastrais do Coordenador Outorgado. |
| M014 - Prestacao de Contas | Trata a prestacao de contas de Iniciativas/Projetos; nao e dono da prestacao financeira institucional da Acao Transversal. |

## 8.6 Funcionalidades

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 8.1.1 | Parametrizar Politica de Acao Transversal | Cadastrar base legal, vigencia, faixas percentuais e rubricas permitidas | Gestor Financeiro | Resolucao CCAF nº 334/2023 |
| 8.1.2 | Calcular Reserva de Acao Transversal | Calcular reserva sobre aporte original ou aditivo, mantendo snapshot da politica aplicada | Servidor da Area de Parcerias | Resolucao CCAF nº 334/2023 |
| 8.1.3 | Designar Coordenador Outorgado | Registrar Termo de Outorga, servidor FAPES designado, periodo e recurso abrangido | Diretoria Executiva, Gestor Financeiro | Resolucao CCAF nº 334/2023 |
| 8.1.4 | Registrar Conta Bancaria Especifica | Registrar conta BANESTES aberta pela FAPES em nome do Coordenador Outorgado para movimentacao do recurso | Gestor Financeiro | Resolucao CCAF nº 334/2023 |
| 8.1.5 | Classificar Reserva | Classificar a reserva em conta contabil, fundo financeiro e centro de custo institucional | Gestor Financeiro | Art. 25, III |
| 8.1.6 | Planejar Aplicacao | Distribuir a reserva por rubricas permitidas sem ultrapassar o saldo disponivel | Gestor Financeiro | Resolucao CCAF nº 334/2023 |
| 8.1.7 | Executar Despesa de Acao Transversal | Registrar despesa institucional com rubrica permitida, documento comprobatório e justificativa | Coordenador Outorgado, Gestor Financeiro | Resolucao CCAF nº 334/2023 |
| 8.1.8 | Prestar Contas da Acao Transversal | Submeter e analisar prestacao financeira institucional do recurso gerido pelo outorgado | Coordenador Outorgado, Analista Financeiro | Resolucao CCAF nº 334/2023; Art. 27, II |
