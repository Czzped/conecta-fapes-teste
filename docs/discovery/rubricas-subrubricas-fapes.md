# Rubricas e Subrubricas FAPES

Analise das rubricas e subrubricas encontradas em normativas e editais da FAPES, realizada em 2026-05-01. Este documento orienta discovery e modelagem de produto; a regra operacional final de cada iniciativa deve vir do edital, termo de outorga, plano aprovado e eventuais aditivos.

---

## Fontes Consultadas

| Fonte | Uso na analise |
|-------|----------------|
| [Resolucao CCAF no 309/2022 - Itens financiaveis e nao financiaveis](https://fapes.es.gov.br/Media/fapes/Prestacao%20de%20Contas/Resolu%C3%A7%C3%A3o%20309-2022%20-%20Itens%20financiaveis%20e%20n%C3%A3o%20financiaveis.pdf) | Fonte normativa principal para a classificacao de itens financiaveis por capital e custeio. |
| [Pagina FAPES - Itens Financiaveis e Nao Financiaveis](https://fapes.es.gov.br/itens-financiaveis-e-nao-financiaveis) | Pagina oficial que publica a norma de itens financiaveis. |
| [Resolucao CCAF no 313/2022 - Manual PCTF](https://fapes.es.gov.br/Media/fapes/Prestacao%20de%20Contas/Resolu%C3%A7%C3%A3o%20n%C2%BA%20313%20-%202022%20-%20MANUAL%20PCTF.pdf) | Regras de orcamento aprovado, agrupamento por elemento de despesa, comprovantes e prestacao de contas. |
| [Pagina FAPES - Resolucoes CCAF](https://fapes.es.gov.br/GrupodeArquivos/Resolu%C3%A7%C3%B5es) | Confirma alteracoes recentes: Resolucao 313 alterada pela 356/2025; tabela de bolsas alterada pela 361/2026. |
| [Pagina FAPES - Valores de Bolsas e Auxilios](https://fapes.es.gov.br/valores-de-bolsas-e-auxilios) | Fonte oficial para tabela vigente de bolsas e auxilios. |
| [Pagina FAPES - Instrucoes de Uso de Diarias](https://fapes.es.gov.br/instrucoes-de-uso-de-diarias) | Fonte oficial complementar para diaria e calculo de diarias. |
| [Edital FAPES no 07/2026 - Espacos Cientificos Culturais](https://fapes.es.gov.br/Media/fapes/Editais/Edital_Fapes_07.2026_-_Espa%C3%A7os_Cient%C3%ADficos_Culturais-ECCs%20-%20Assinado.pdf) | Exemplo de edital que permite capital e custeio, mas exclui bolsas, participacao em eventos e publicacoes. |
| [Edital FAPES no 21/2025 - PROINFRA](https://fapes.es.gov.br/Media/fapes/Editais/Edital_Fapes_21.2025_-_PROINFRA_2025%20%281%29-1.pdf) | Exemplo de edital que limita material de consumo e servicos e exclui bolsas, locomocao e diarias. |
| [Edital FAPES no 08/2025 - Economia Verde e Azul](https://fapes.es.gov.br/Media/fapes/Editais/Edital_08-2025_-Apoio_a_Projetos_de_Pesquisa_Aplicada_e_de_Extens%C3%A3o_da_Economia_Verde_e_Azul-1.pdf) | Exemplo de planilha com agrupamentos como passagens e diarias, servicos de terceiros e bolsas. |
| [Edital FAPES-SEAMA no 02/2025 - NISA](https://fapes.es.gov.br/Media/fapes/Editais/Edital_Neg%C3%B3cios_de_Impacto_Socioambiental_%28publica%C3%A7%C3%A3o%29-2.pdf) | Exemplo de uso de DOACI e de restricoes especificas em edital. |
| [Edital FAPES no 06/2026 - Clusters Inovadores](https://fapes.es.gov.br/Media/fapes/Editais/Edital_Clusters_Inovadores_-_2%C2%AA_Edi%C3%A7%C3%A3o_-_Lan%C3%A7amento.pdf) | Exemplo de edital de inovacao/subvencao que inclui vencimentos, vantagens fixas e obrigacoes patronais. |

---

## Conclusao de Discovery

A FAPES trabalha com uma base normativa de rubricas por natureza da despesa:

- `CUSTEIO`: itens consumiveis, servicos, bolsas, auxilios, locomocao, diarias e despesas operacionais do projeto.
- `CAPITAL`: bens patrimoniais, como equipamentos, material permanente, livros e software quando enquadrados como bens de vida util superior a dois anos e valor acima do limite em VRTE definido na norma.

Os editais nao repetem sempre a lista inteira da Resolucao 309/2022. Na pratica, eles aplicam uma `allowlist` por edital: podem permitir somente parte das rubricas, impor limites percentuais ou excluir itens que a norma geral permite. Portanto, o produto deve manter:

1. `CatalogoRubricaFapes`: catalogo normativo geral.
2. `RubricaPermitidaNoEdital`: subconjunto permitido por edital/captacao.
3. `RubricaOrcamentariaDaIniciativa`: rubrica efetivamente aprovada no plano/orcamento do projeto.
4. `Subrubrica`: sempre modelada como uma `Rubrica` filha, quando o edital, planilha SIGFAPES ou proposta aprovada trouxer granularidade adicional.

### Modelo conceitual de Rubrica

A entidade canonica deve se chamar apenas `Rubrica`. Ela possui dados cadastrais simples e uma relacao hierarquica opcional:

| Campo | Obrigatorio | Descricao |
|-------|-------------|-----------|
| `codigo` | Sim | Codigo canonico unico da rubrica. |
| `nome` | Sim | Nome oficial de exibicao da rubrica. |
| `descricao` | Sim | Descricao de uso, enquadramento e restricoes gerais da rubrica. |
| `rubricaPai` | Nao | Rubrica superior quando a rubrica atual for uma subrubrica. |
| `subrubricas` | Nao | Lista de rubricas filhas vinculadas a esta rubrica. |

Nao deve existir campo `nivelRubrica`. Uma rubrica principal e identificada por `rubricaPai = null`; uma subrubrica e uma rubrica com `rubricaPai` preenchida.

### Decisao sobre Diarias e Passagens

Na Resolucao 309/2022, `Diaria` e `Despesa de Locomocao` aparecem como rubricas distintas de custeio. Em editais e planilhas, elas podem aparecer agregadas como `Despesas com passagens e diarias` ou `Passagens, diarias e hospedagem`. Para o sistema, recomenda-se tratar o agregado como label textual do edital e normalizar o orcamento aprovado em rubricas analiticas:

- `Diarias`
- `Passagens`
- `Hospedagem`, quando o edital trouxer esse label separado
- `Taxas e seguros de viagem`, quando vierem discriminados

Assim o produto aceita o desenho real do edital sem perder conciliacao detalhada na prestacao de contas.

Para o fluxo operacional de solicitacao de diarias no M003, as rubricas devem representar apenas diarias: `Diaria dentro do Estado`, `Diaria nacional` e `Diaria internacional`, conforme o orcamento aprovado do projeto. Passagens e locomocao nao devem aparecer como subrubricas da rubrica de diarias; quando existirem no projeto, devem ser controladas em rubrica propria, com transacoes e comprovantes proprios.

---

## Fronteira entre Planejamento do Projeto e Contabilidade

| Projeto (Planejamento) | Contabilidade/Financeiro (Registro) |
| ---------------------- | ------------------------------------ |
| Projeto                | Centro de Custo                      |
| Orçamento              | Limite/Plano de Aplicacao            |
| Item do Orçamento      | Conta Contábil sugerida/mapeada      |
| Rubrica (Edital)       | Classificacao orcamentaria           |
| Valor Previsto         | Valor Realizado                      |
| Execução do Projeto    | Lancamento contabil/financeiro      |
| Movimento Bancario     | Movimento de conta/extrato           |
| Regras do Edital       | Normas Contábeis                     |
| Prestação de Contas    | Demonstrações Contábeis              |

A tabela separa planos de controle que precisam conversar, mas nao devem ser modelados como a mesma coisa. No planejamento do projeto, o sistema controla iniciativa, orcamento aprovado, rubricas do edital, saldos, comprometimentos, `Transacao` e prestacao de contas. Na contabilidade/financeiro, o sistema registra fatos contabeis e financeiros por plano de contas, conta contabil, centro de custo, lancamentos, movimentos bancarios e demonstracoes.

Essa relacao deve ser tratada como mapeamento e integracao, nao como equivalencia direta. O `Orcamento` do projeto nao e o `Plano de Contas`; o `Item do Orcamento` ou a `Rubrica` podem apontar para uma `Conta Contabil` ou classificacao contabil, mas continuam pertencendo ao dominio do projeto/edital. Da mesma forma, uma `Iniciativa` pode ser vinculada a um `Centro de Custo` para apuracao gerencial, sem transformar o centro de custo no dono da iniciativa.

### Rubrica e Transacao

`Rubrica` e uma categoria autorizada de planejamento e classificacao. Ela nao movimenta saldo sozinha. `Transacao` e o movimento dessa categoria: comprometimento, execucao, reversao, estorno, remanejamento ou ajuste. Ja o movimento de extrato/conta deve ser chamado explicitamente de `MovimentoBancario` ou `TransacaoBancaria`, para nao confundir com a `Transacao` do M013.

| Conceito | O que representa | Dono principal | Exemplo |
|----------|------------------|----------------|---------|
| `Rubrica` | Categoria corporativa/normativa de despesa, com natureza da despesa e hierarquia. | M008 | Diarias, Despesa de Locomocao, Material de Consumo. |
| `RubricaProjeto` | Rubrica aprovada no orcamento de uma iniciativa, com snapshot e limite financeiro. | M013 | Diarias com R$ 10.000,00 aprovados. |
| `Subrubrica` | Rubrica filha usada para detalhar a rubrica principal, sem entidade separada e sem campo de nivel. | M008/M011/M013 | Material laboratorial, Equipamentos de informatica, Servicos graficos. |
| `Transacao` | Movimento que altera comprometido, executado, estornado ou saldo de uma `RubricaProjeto`. | M013, consumido por M003/M014 | Comprometimento de diaria de R$ 780,00. |
| `MovimentoBancario` / `TransacaoBancaria` | Movimento de conta/extrato, importado do banco ou registrado financeiramente. | M014/M016 | PIX de pagamento, TED, credito de rendimento. |

Regra de modelagem: a rubrica deve ser referenciada pela transacao quando houver movimento de saldo. A rubrica nao deve armazenar o movimento em si; ela apenas recebe saldos derivados das `Transacao` vinculadas a ela. Quando houver pagamento efetivo, a `Transacao` pode referenciar o movimento bancario conciliado.

### Decisao de Arquitetura

Nao e necessario criar um novo modulo de contabilidade. O repositorio ja possui o `M016 - Contabilidade e Financeiro`, que deve concentrar plano de contas, contas contabeis, centros de custo, lancamentos contabeis/financeiros, contas bancarias, fundos, fluxo de caixa e conciliacao.

O ajuste recomendado e reforcar as fronteiras entre os modulos:

| Modulo | Responsabilidade na fronteira rubrica/orcamento/contabilidade |
|--------|---------------------------------------------------------------|
| `M008 - Cadastros Corporativos` | Mantem o catalogo corporativo de rubricas, natureza da despesa e hierarquias. |
| `M011 - Configuracao da Captacao` | Define quais rubricas/subrubricas sao permitidas no edital, com limites, exclusoes e regras especificas. |
| `M003 - Gestao de Iniciativas Captadas` | Mantem a iniciativa/projeto, vigencia, aditivos e leitura do orcamento aprovado em execucao. |
| `M013 - Gestao Orcamentaria do Projeto` | Controla orcamento aprovado, rubricas do projeto, saldos, comprometimentos, remanejamentos e aditivos financeiros. |
| `M014 - Prestacao de Contas` | Registra documentos, comprovantes e classificacoes da execucao contra rubricas/subrubricas aprovadas. |
| `M016 - Contabilidade/Financeiro` | Registra a camada contabil e financeira: plano de contas, contas contabeis, centros de custo, lancamentos, contas bancarias, fundos e conciliacao. |

Assim, a gestao fica mais simples porque cada modulo preserva seu vocabulario: projeto planeja e presta contas; contabilidade registra e concilia.

---

## Tabela de Rubricas Principais

| Natureza | Rubrica principal | Documento fonte principal | Uso esperado no produto |
|----------|-------------------|---------------------------|-------------------------|
| Custeio | Bolsas | Resolucao CCAF no 309/2022; Valores de Bolsas e Auxilios; editais especificos | Planejamento e execucao de bolsas por modalidade, nivel, vigencia e duracao aprovados. |
| Custeio | Auxilios | Resolucao CCAF no 309/2022; Valores de Bolsas e Auxilios | Auxilios de instalacao, publicacao, evento, estagio tecnico-cientifico, organizacao de evento CT&I e P&DI. |
| Custeio | Material de Consumo | Resolucao CCAF no 309/2022; editais como PROINFRA 21/2025 | Insumos e materiais consumiveis permitidos pelo edital e plano aprovado. |
| Custeio | Servicos de Terceiros | Resolucao CCAF no 309/2022; editais como PROINFRA 21/2025 | Contratacao de pessoa fisica, pessoa juridica e apoio administrativo quando permitido. |
| Custeio | Despesa de Locomocao | Resolucao CCAF no 309/2022; editais com agrupamento de passagens/diarias | Passagens, taxas, seguros, locacao/fretamento e demais deslocamentos. |
| Custeio | Diarias | Resolucao CCAF no 309/2022; Instrucoes de Uso de Diarias | Diarias estaduais, nacionais e internacionais por tipo de viagem e valor vigente. |
| Custeio | Adequacao de Espaco Fisico | Resolucao CCAF no 309/2022 | Adaptacoes fisicas autorizadas, com limites normativos e do edital. |
| Custeio | DOACI | Resolucao CCAF no 309/2022; editais de parceria/inovacao | Despesas operacionais e administrativas de carater indivisivel. |
| Custeio | Vencimentos e Vantagens Fixas | Edital FAPES no 06/2026 - Clusters Inovadores | Despesas de pessoal em chamadas de inovacao/subvencao que permitam esse grupo. |
| Custeio | Obrigacoes Patronais | Edital FAPES no 06/2026 - Clusters Inovadores | Encargos patronais associados a pessoal permitido no edital. |
| Capital | Equipamentos e Material Permanente | Resolucao CCAF no 309/2022; editais com capital | Bens permanentes, equipamentos, instrumentos, maquinas e mobiliario autorizado. |
| Capital | Material Bibliografico | Resolucao CCAF no 309/2022 | Livros e acervos classificados como capital quando atenderem aos criterios normativos. |
| Capital | Software | Resolucao CCAF no 309/2022 | Licencas ou aquisicoes classificadas como capital; pode migrar para custeio conforme documento fiscal/edital. |

## Rubricas Principais e Subrubricas

| Natureza | Rubrica principal | Subrubrica / detalhamento | Documento fonte |
|----------|-------------------|---------------------------|-----------------|
| Custeio | Bolsas | Coordenador, professor, alunos, ICT, BTU, BCO, DTI, EXT, BIPI, mestrado, doutorado, pos-doutorado | Resolucao CCAF no 309/2022; Valores de Bolsas e Auxilios; editais especificos |
| Custeio | Auxilios | Instalacao; Estagio Tecnico-cientifico; Publicacao; Participacao em Evento; Organizacao de Evento CT&I; P&DI | Resolucao CCAF no 309/2022; Valores de Bolsas e Auxilios |
| Custeio | Material de Consumo | Insumos; materiais nacionais/importados; materiais com perda de identidade fisica; itens abaixo do limite de capital | Resolucao CCAF no 309/2022; PROINFRA 21/2025 |
| Custeio | Servicos de Terceiros | Pessoa Fisica; Pessoa Juridica; Apoio administrativo a projetos | Resolucao CCAF no 309/2022; PROINFRA 21/2025 |
| Custeio | Despesa de Locomocao | Passagens aereas, terrestres, fluviais e maritimas; taxas de embarque; seguros; locacao/fretamento; vale-transporte; pedagios | Resolucao CCAF no 309/2022; Edital 08/2025 |
| Custeio | Diarias | Dentro do Estado; Nacional; Internacional; fracao de calculo; beneficiario; comprovante de pagamento | Resolucao CCAF no 309/2022; Instrucoes de Uso de Diarias |
| Custeio | Adequacao de Espaco Fisico | Material de consumo para adaptacao; servicos de terceiros para adaptacao | Resolucao CCAF no 309/2022 |
| Custeio | DOACI | Despesas operacionais e administrativas de carater indivisivel | Resolucao CCAF no 309/2022; Edital NISA 02/2025 |
| Custeio | Vencimentos e Vantagens Fixas | Salarios; 13o; adicional de ferias; salarios de estagiarios; profissionais de equipe sob CLT | Edital FAPES no 06/2026 - Clusters Inovadores |
| Custeio | Obrigacoes Patronais | INSS; FGTS; Sistema S/INCRA; seguro de acidente de trabalho; vale-transporte; encargos correlatos | Edital FAPES no 06/2026 - Clusters Inovadores |
| Capital | Equipamentos e Material Permanente | Equipamentos; instrumentos; maquinas; aparelhos; mobiliario autorizado; itens patrimoniais | Resolucao CCAF no 309/2022; Edital 07/2026 |
| Capital | Material Bibliografico | Livros e acervos bibliograficos enquadrados como capital | Resolucao CCAF no 309/2022 |
| Capital | Software | Licencas ou aquisicoes de software enquadradas como capital | Resolucao CCAF no 309/2022 |

---

## Catalogo Normativo

### Naturezas da Despesa

| Codigo sugerido | Natureza | Descricao de produto |
|-----------------|----------|----------------------|
| `CUSTEIO` | Despesa de Custeio | Despesa necessaria a execucao/manutencao do projeto, normalmente consumida ou exaurida no uso. |
| `CAPITAL` | Despesa de Capital | Bem patrimonial ou permanente incorporavel ao patrimonio, conforme regra de vida util e valor da norma. |

### Rubricas de Custeio

| Rubrica canonica | Subrubricas / detalhamentos encontrados | Observacoes de modelagem | Documento fonte |
|------------------|------------------------------------------|--------------------------|-----------------|
| `Bolsas` | Modalidades e niveis definidos em normas/tabelas especificas; exemplos recorrentes nos editais: coordenador, professor, alunos, ICT, BTU, BCO, DTI, EXT, BIPI, mestrado, doutorado, pos-doutorado. | A Resolucao 309 define a rubrica; os tipos, valores e vigencias devem vir de M001/tabela vigente de bolsas e do edital. | Resolucao CCAF no 309/2022; Valores de Bolsas e Auxilios; editais especificos |
| `Auxilios` | `Instalacao`, `Estagio Tecnico-cientifico`, `Publicacao`, `Participacao em Evento`, `Organizacao de Evento CT&I`, `P&DI`. | Algumas chamadas sao exclusivamente de auxilio. A subrubrica pode ser o proprio tipo de auxilio apoiado. | Resolucao CCAF no 309/2022; Valores de Bolsas e Auxilios |
| `Material de Consumo` | Insumos, materiais nacionais/importados, materiais com perda de identidade fisica, equipamento/livro/software abaixo do limite de capital. | Editais podem limitar por percentual ou valor absoluto. | Resolucao CCAF no 309/2022; PROINFRA 21/2025 |
| `Servicos de Terceiros` | `Pessoa Fisica`, `Pessoa Juridica`, `Apoio administrativo a projetos`. | Pessoa juridica pode incluir apoio administrativo, com limite especifico na norma ou no edital. | Resolucao CCAF no 309/2022; PROINFRA 21/2025 |
| `Despesa de Locomocao` | Passagens aereas, terrestres, fluviais, maritimas; taxas de embarque; seguros; locacao, fretamento ou uso de veiculos; transporte de pessoas e bagagens; vale-transporte; pedagios. | Em muitos editais aparece agrupada com diarias. Para prestacao de contas, passagens exigem comprovantes especificos. | Resolucao CCAF no 309/2022; Edital 08/2025 |
| `Diarias` | Diaria estadual, nacional ou internacional; tipo de viagem; fracao de calculo; beneficiario; aceite; comprovante de pagamento. | O valor e calculo devem seguir cadastro vigente de tipo de diaria e instrucoes de diaria da FAPES. | Resolucao CCAF no 309/2022; Instrucoes de Uso de Diarias |
| `Adequacao de Espaco Fisico` | Material de consumo para adaptacao; servicos de terceiros para adaptacao. | A norma geral traz limite em VRTE; editais podem restringir ou excluir. | Resolucao CCAF no 309/2022 |
| `DOACI` | Despesas operacionais e administrativas de carater indivisivel. | Limite percentual regressivo sobre valor total aprovado excluindo bolsas; nao pode remunerar membro/pessoa vinculada ao projeto; percentuais definidos na tabela DOACI da norma (ver secao abaixo). | Resolucao CCAF no 309/2022, item 2.4.8 e 2.4.8.1; Edital NISA 02/2025; Edital FAPES no 13/2025 - UNIVERSAL |
| `Vencimentos e Vantagens Fixas` | Salarios, 13o, adicional de ferias, salarios de estagiarios, profissionais de equipe sob CLT. | Rubrica aplicavel em contextos especificos, especialmente projetos de subvencao economica para empresa. | Edital FAPES no 06/2026 - Clusters Inovadores |
| `Obrigacoes Patronais` | INSS, FGTS, Sistema S/INCRA, seguro de acidente de trabalho, vale-transporte e encargos correlatos. | Rubrica aplicavel em contextos especificos; pode ter limite percentual sobre vencimentos e vantagens. | Edital FAPES no 06/2026 - Clusters Inovadores |

### DOACI — Regras e Tabela de Limites

Fonte normativa: **Resolucao CCAF no 309/2022, itens 2.4.8 e 2.4.8.1** (confirmar atualizacoes via pagina de resolucoes da FAPES).

**Definicao (item 2.4.8):** Despesas Operacionais e Administrativas de Carater Indivisivel — destinadas a custear gastos indivisíveis, usuais e necessarios a consecucao do objeto do projeto. Nao podem remunerar qualquer membro ou pessoa vinculada ao projeto, na forma da Lei no 10.973/04 (Lei da Inovacao).

**Base de calculo:** valor total aprovado no projeto, **excluindo** o valor destinado a bolsas.

**Tabela de valores DOACI (item 2.4.8.1):**

| Valor do Projeto (base sem bolsas) | Percentual maximo de DOACI |
|------------------------------------|---------------------------|
| R$ 0 a R$ 50.000,00 | 15% |
| R$ 50.000,01 a R$ 100.000,00 | 10% |
| R$ 100.000,01 a R$ 150.000,00 | 5% |
| R$ 150.000,01 a R$ 300.000,00 | 3% |
| R$ 300.000,01 a R$ 500.000,00 | 1% |
| Acima de R$ 500.000,00 | 0,5% |

**Regras criticas:**
- Percentual e regressivo: quanto maior o projeto, menor o percentual permitido.
- Teto absoluto da norma: 15% (projetos ate R$ 50.000,00).
- Editais podem impor limites mais restritivos que a norma (verificar item especifico do edital).
- Nao constitui remuneracao de pessoal vinculado ao projeto em nenhuma hipotese.
- O sistema deve parametrizar o limite de DOACI por edital/iniciativa, nao fixar apenas no catalogo global (ver RD-RUB-008).

**Exemplo (Edital FAPES no 13/2025 - UNIVERSAL, Categoria C):** projeto R$ 240.000,00 sem bolsas → faixa de 3% → DOACI maximo = R$ 7.200,00. Se houver bolsas, a base de calculo e reduzida pelo valor das bolsas aprovadas.

### Rubricas de Capital

| Rubrica canonica | Subrubricas / detalhamentos encontrados | Observacoes de modelagem | Documento fonte |
|------------------|------------------------------------------|--------------------------|-----------------|
| `Equipamentos e Material Permanente` | Equipamentos, instrumentos, maquinas, aparelhos, mobiliario autorizado pelo edital, itens patrimoniais. | Cada item de capital deve ser especificado individualmente no orcamento aprovado com descricao, quantidade, valor unitario e total. | Resolucao CCAF no 309/2022; Edital 07/2026 |
| `Material Bibliografico` | Livros e acervos bibliograficos enquadrados como capital. | Quando abaixo do limite normativo, pode ser tratado como consumo. | Resolucao CCAF no 309/2022 |
| `Software` | Licencas ou aquisicoes de software enquadradas como capital. | Software tambem pode aparecer como custeio quando contratado/hospedado/assinado; o edital e o documento fiscal devem orientar a classificacao. | Resolucao CCAF no 309/2022 |

---

## Padroes Observados em Editais

| Padrao encontrado | Como aparece nos editais | Interpretacao para o sistema |
|-------------------|--------------------------|------------------------------|
| `Capital e Custeio` | Editais como Espacos Cientificos Culturais permitem os dois grupos, mas excluem itens especificos. | Usar catalogo geral com allowlist do edital. |
| `Custeio limitado` | PROINFRA permite material de consumo e servicos, com limites, e exclui bolsas, locomocao e diarias. | Permitir limite por rubrica no edital. |
| `Passagens e Diarias` | Planilhas de proposta podem agrupar passagens e diarias em uma unica secao. | Tratar como label textual de edital e normalizar em rubricas operacionais separadas. |
| `Passagens, Diarias e Hospedagem` | Alguns editais de inovacao trazem hospedagem no mesmo grupo. | Separar diaria, passagem/locomocao e hospedagem quando houver orcamento ou comprovante especifico. |
| `Bolsas` | Editais trazem tabela propria de modalidades, quantidades, duracao e valor mensal. | Importar/registrar modalidades e valores vigentes no modulo de bolsas, vinculando ao edital. |
| `DOACI` | Editais de parceria/inovacao podem permitir DOACI com percentual proprio. | Parametrizar limite por edital/iniciativa, nao fixar apenas no catalogo global. |
| `Vencimentos e Obrigacoes Patronais` | Aparecem em editais de subvencao/inovacao para empresa. | Nao habilitar por padrao em editais academicos; exigir permissao explicita do edital. |
| `Exclusoes especificas` | Editais podem excluir bolsas, diarias, locomocao, participacao em eventos ou publicacoes mesmo sendo itens previstos na norma geral. | Validar sempre contra rubricas permitidas no edital e no orcamento aprovado. |

---

## Regras de Produto Derivadas

| ID | Regra de discovery | Impacto |
|----|--------------------|---------|
| RD-RUB-001 | A rubrica do projeto deve ser criada a partir do edital/plano aprovado, nao apenas do catalogo geral. | M013/M014 devem consumir rubricas aprovadas da iniciativa. |
| RD-RUB-002 | A norma geral fornece rubricas elegiveis, mas o edital define o que e permitido naquela captacao. | M011 deve registrar allowlist/restricoes por edital; M003/M013 devem respeitar. |
| RD-RUB-003 | Subrubricas podem representar detalhamentos normativos, modalidades de bolsa, tipos de auxilio, tipos de viagem ou agrupamentos de planilha. | Modelo deve aceitar hierarquia de rubricas em multiplos niveis. |
| RD-RUB-004 | Cada item de capital aprovado precisa ser detalhado individualmente. | Importacao/edicao de orcamento deve preservar descricao, quantidade, valor unitario e valor total. |
| RD-RUB-005 | Custeio pode ser agrupado por elemento de despesa, mas a prestacao de contas deve permitir classificacao analitica por item/documento. | M014 deve vincular justificativas e itens de documento fiscal a rubricas/subrubricas. |
| RD-RUB-006 | Diarias e locomocao podem vir juntas no edital, mas seus comprovantes e regras de execucao sao distintos. | Fluxo de diarias de M003 deve controlar apenas rubricas de diaria e manter passagens/locomocao em rubrica propria. |
| RD-RUB-007 | Valores de bolsa, auxilio e diaria sao tabelas versionadas por vigencia/resolucao/cadastro. | Nao armazenar somente valor corrente; salvar snapshot no momento da solicitacao/aprovacao. |
| RD-RUB-008 | Rubricas como DOACI, vencimentos e obrigacoes patronais dependem fortemente do tipo de edital. | Habilitacao deve ser explicita no edital e no orcamento aprovado. |
| RD-RUB-009 | Itens nao financiaveis devem ser usados como camada de validacao e alerta, mas editais podem permitir excecoes mediante avaliacao quando a norma assim admitir. | Criar validacoes com possibilidade de justificativa/analise quando aplicavel. |
| RD-RUB-010 | Orcamento do projeto nao deve ser modelado como plano de contas. | Evita misturar gestao orcamentaria de projeto com contabilidade institucional. |
| RD-RUB-011 | Item do orcamento ou rubrica do projeto pode ter mapeamento para conta contabil, mas nao deve ser a propria conta contabil. | Permite alterar classificacoes contabeis sem corromper o historico aprovado do projeto. |
| RD-RUB-012 | Projeto/Iniciativa pode ser vinculado a centro de custo para apuracao gerencial. | M016 consolida contabilidade por centro de custo sem assumir ownership da iniciativa. |
| RD-RUB-013 | Prestacao de contas alimenta a camada contabil/financeira, mas nao substitui demonstracoes contabeis. | M014 e M016 permanecem separados, integrados por eventos, classificacoes, transacoes e movimentos bancarios. |
| RD-RUB-014 | Rubrica canonica deve se chamar apenas `Rubrica`; toda Rubrica possui `codigo`, `nome`, `descricao` e pode ter `rubricaPai` ou `subrubricas`. | Evita campos artificiais de nivel e simplifica a hierarquia. |
| RD-RUB-015 | Variacoes textuais de editais, planilhas e SIGFAPES devem ser normalizadas para uma Rubrica existente sem criar entidade propria para isso no M008. | M002/M011 conseguem importar termos variados sem criar duplicidade no catalogo. |
| RD-RUB-016 | RubricaProjeto deve preservar snapshot da Rubrica no momento da aprovacao do projeto. | Mudancas futuras no M008 nao alteram historico orcamentario aprovado. |
| RD-RUB-017 | Rubrica e categoria; `Transacao` e o movimento da rubrica. Movimentos de comprometimento, execucao, reversao, estorno e remanejamento devem ser registrados como transacoes. Movimentos de extrato/conta devem ficar como movimento bancario separado. | Evita misturar catalogo/estrutura orcamentaria com fatos financeiros e bancarios. |

---

## Implicacoes por Modulo

| Modulo | Implicacao |
|--------|------------|
| `M008 - Cadastros Corporativos` | Deve manter catalogo corporativo de Rubricas FAPES, natureza da despesa, status e relacao pai/filha. |
| `M011 - Configuracao da Captacao` | Deve registrar quais Rubricas/subrubricas sao permitidas por edital, seus limites, exclusoes e comprovantes esperados. |
| `M002 - Importacao de Editais` | Deve tentar extrair secoes de itens financiaveis, planilhas anexas e agrupamentos de rubricas dos PDFs. |
| `M003 - Gestao de Iniciativas Captadas` | Deve manter a leitura do orcamento aprovado da iniciativa e suas rubricas vigentes apos aditivos. |
| `M013 - Gestao Orcamentaria do Projeto` | Deve materializar RubricaProjeto com snapshot da Rubrica aprovada, controlando saldos, comprometimentos, execucao orcamentaria e remanejamentos, sem modelar plano de contas. |
| `M014 - Prestacao de Contas` | Deve classificar justificativas, documentos e itens conforme RubricaProjeto aprovada, respeitando comprovantes especificos. |
| `M016 - Contabilidade/Financeiro` | Deve ser o modulo de contabilidade/financeiro existente, concentrando plano de contas, contas contabeis, centros de custo, lancamentos, fundos, contas bancarias e conciliacao, sem assumir o ownership do orcamento do projeto. |

---

## Backlog de Discovery

| ID | Item | Motivo |
|----|------|--------|
| DISC-RUB-001 | Confirmar com FAPES o mapeamento de labels agregados, como `Diarias e Passagens`, para rubricas operacionais separadas: `Diarias` e `Locomocao/Passagens`. | Editais podem usar agregacao textual, enquanto o produto deve controlar diaria sem passagem no fluxo M003. |
| DISC-RUB-002 | Mapear planilhas SIGFAPES reais para identificar nomes historicos de rubricas e subrubricas. | O importador precisa preservar nomenclatura legado sem perder normalizacao. |
| DISC-RUB-003 | Confirmar tratamento de `Hospedagem` quando aparece junto a passagens/diarias. | Pode ser diaria, servico/hospedagem ou subitem especifico do edital. |
| DISC-RUB-004 | Definir estrategia de normalizacao de labels textuais como `Servicos`, `Servicos de Terceiros`, `STPF`, `STPJ`, `Passagens`, `Locomocao`, `Diarias e Passagens`. | Necessario para importacao de editais e classificacao automatica, sem criar cadastro corporativo de variacoes textuais no M008. |
| DISC-RUB-005 | Validar regras de DOACI por tipo de instrumento. | Limites variam entre norma geral, acao transversal, parcerias e editais especificos. |
