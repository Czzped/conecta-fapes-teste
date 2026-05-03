# Regras de Calculo de Diarias - ES

## Fontes Consultadas

| Fonte | Uso no Discovery | Link |
|-------|------------------|------|
| Calculadora de Diarias - Secretaria de Estado de Economia e Planejamento do ES | Referencia operacional para entradas, saidas e memoria de calculo esperada | https://planejamento.es.gov.br/calculadora-de-diarias-2-3 |
| Decreto no 5533-R, de 27/10/2023 | Norma base de concessao e calculo de diarias no Governo do Estado do Espirito Santo | https://servidor.es.gov.br/Media/PortalServidor/Documentos/Decreto%20n%C2%BA%205533-R%20de%2027_10_2023%20-%20Regulamenta%20a%20Concess%C3%A3o%20de%20di%C3%A1rias.pdf |
| Decreto no 5669-R, de 03/04/2024 | Alteracoes posteriores usadas pela calculadora oficial | Referenciado pela propria calculadora SEP |
| Decreto no 6202-R, de 2025 | Alteracao posterior identificada na pesquisa, especialmente sobre custeio por outra entidade | https://sistemas.sejus.es.gov.br/portarias/texto/109/ |

> Observacao: a calculadora oficial da SEP informa usar os Decretos no 5533-R/2023 e no 5669-R/2024. Como ha alteracao posterior pelo Decreto no 6202-R/2025, o sistema deve tratar a regra de calculo como versionada por norma vigente, evitando regra fixa no codigo.

## Entradas Observadas na Calculadora

| Entrada | Descricao | Impacto Esperado |
|---------|-----------|------------------|
| Finalidade da viagem | Tarefa oficial, curso/seminario/treinamento, orgao colegiado estadual ou prestacao de servicos ao Governo Estadual | Pode influenciar elegibilidade e memoria de calculo |
| Cargo/função | Faixa de cargo ou funcao do servidor | Define base de valor conforme tabela vigente |
| Origem e destino | Local de saida e local de destino, selecionados em lista controlada de localidades; destino pode usar opcoes especiais como `(Fora do Estado)` e `(Fora do Pais)` | Usados para identificar deslocamento e abrangencia |
| Abrangencia especial | Fora do Estado ou fora do Pais | Define diaria nacional/interestadual ou internacional |
| Regiao Metropolitana/municipios limitrofes | Indicador de deslocamento metropolitano ou limitrofe | Usado somente para viagens dentro do Estado; pode bloquear diaria sem pernoite |
| Distancia em km | Distancia rodoviaria entre origem e destino | Usada somente para viagens dentro do Estado; pode bloquear diaria abaixo de limite quando nao houver pernoite |
| Data/hora de ida | Inicio do afastamento | Compoe periodo total |
| Data/hora de volta | Fim do afastamento | Compoe periodo total |
| Despesas custeadas por outro meio publico | Indicador de custeio externo/publico | Pode reduzir ou complementar valor |
| Hospedagem e alimentacao custeadas por outra entidade | Indicador de custeio de despesas principais | Pode reduzir ou complementar valor conforme norma vigente |
| Veiculo oficial ou transporte custeado por outra entidade | Indicador de transporte ja custeado | Pode impedir complemento de transporte |

## Saidas Observadas na Calculadora

| Saida | Descricao |
|-------|-----------|
| Valor unitario da diaria | Valor base aplicavel para a abrangencia/faixa/cargo conforme tabela vigente |
| Pernoites | Quantidade de noites consideradas no afastamento |
| Afastamento em horas | Duracao total do afastamento |
| Quantidade de diarias | Quantidade calculada apos aplicar regras de pernoite, retorno e fracao por duracao |
| Subtotal | Valor antes de acrescimos/descontos |
| Acrescimos/descontos | Ajustes por retorno, transporte, custeio externo ou regra normativa |
| Total a receber | Valor final calculado |
| Memoria de calculo | Explicacao dos fatores aplicados |

## Regras de Calculo Identificadas

| ID | Regra | Fonte |
|----|-------|-------|
| RCD-01 | O periodo de afastamento considera a saida da origem, o deslocamento ate o destino e o retorno a origem. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-02 | Havendo pernoite, ha concessao de diaria por dia de afastamento/pernoite conforme norma vigente. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-03 | Pernoite deve considerar permanencia no destino ou em deslocamento durante a noite. | Decreto no 5669-R/2024; Calculadora SEP |
| RCD-04 | Sem pernoite, o afastamento igual ou superior a 6 horas gera diaria parcial equivalente a 40% do valor da diaria. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-05 | Sem pernoite e com afastamento inferior a 6 horas, nao ha diaria. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-06 | Retorno apos 14h gera acrescimo equivalente a diaria parcial prevista na norma vigente. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-07 | Deslocamento dentro da Regiao Metropolitana ou entre municipios limitrofes, em viagem dentro do Estado, nao gera diaria sem pernoite, salvo excecoes normativas. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-08 | Para viagens dentro do Estado, distancia inferior a 150 km pode impedir diaria quando nao houver pernoite ou afastamento minimo previsto. A distancia nao e parametro de elegibilidade para viagens nacionais fora do Estado ou internacionais. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-09 | Viagens interestaduais e internacionais sem veiculo oficial podem gerar complemento de transporte urbano de 20% do total. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-10 | O complemento de transporte nao deve ser aplicado quando houver veiculo oficial ou transporte custeado por outra entidade. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-11 | Ha limite de 15 dias consecutivos para viagem com diaria. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-12 | Ha limite mensal de 15 diarias por beneficiario, conforme norma vigente. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-13 | Viagens internacionais devem considerar moeda estrangeira aplicavel e conversao pela cotacao turismo do dia anterior a solicitacao, conforme regra vigente. | Decreto no 5533-R/2023; Calculadora SEP |
| RCD-14 | Quando hospedagem, alimentacao ou despesas correlatas forem custeadas por outra entidade, o calculo deve aplicar reducao ou complemento conforme a norma vigente. | Decreto no 6202-R/2025; Calculadora SEP |

## Regras em Linguagem Natural

A diaria representa uma compensacao financeira pelo afastamento temporario da origem para cumprir uma atividade vinculada ao projeto. Para calcular corretamente a diaria, o sistema precisa considerar o periodo total de afastamento, a abrangencia da viagem, a origem, o destino, a existencia de pernoite, a distancia quando a viagem for dentro do Estado e eventuais despesas ja custeadas por outra entidade.

O calculo comeca pela definicao da viagem. O coordenador informa a data e hora de partida, a data e hora de chegada, a origem, o destino e a finalidade da atividade. A partir dessas informacoes, o sistema identifica a abrangencia principal: **dentro do Estado**, **fora do Estado** ou **fora do Pais**. Essa abrangencia define qual tipo de diaria e qual valor unitario vigente devem ser usados.

Quando a viagem e **dentro do Estado**, origem e destino devem ser municipios selecionados em lista controlada. Nesse caso, o sistema calcula ou consulta automaticamente a distancia rodoviaria entre os municipios. Essa distancia serve apenas para regras de elegibilidade da diaria estadual. Ela nao deve ser usada para viagens nacionais fora do Estado nem para viagens internacionais.

Se a viagem dentro do Estado ocorrer entre municipios da Regiao Metropolitana, entre municipios limitrofes ou em deslocamento inferior ao limite normativo, a diaria pode ser bloqueada quando nao houver pernoite. A regra geral identificada e que, sem pernoite, deslocamentos metropolitanos, limitrofes ou inferiores a 150 km podem nao gerar direito a diaria, salvo excecao normativa especifica.

O pernoite e um fator central do calculo. Quando ha pernoite, a diaria e calculada considerando os dias/pernoites de afastamento conforme a norma vigente. O sistema deve registrar na memoria de calculo se o pernoite ocorreu no destino ou durante o deslocamento, pois essa informacao justifica a quantidade de diarias calculada.

Quando nao ha pernoite, o sistema calcula a duracao do afastamento em horas. Se o afastamento for inferior a 6 horas, nao ha diaria. Se o afastamento for igual ou superior a 6 horas, pode haver diaria parcial, equivalente a 40% do valor unitario da diaria, desde que as demais regras de elegibilidade permitam o pagamento.

O horario de retorno tambem pode alterar o valor. Quando o retorno ocorre apos as 14h, a norma permite acrescimo equivalente a uma diaria parcial, conforme regra vigente. Esse acrescimo deve aparecer de forma explicita na memoria de calculo, separado do valor base da diaria.

Em viagens fora do Estado e viagens internacionais, o sistema nao usa distancia municipal para validar elegibilidade. Nesses casos, a classificacao da viagem e feita pela abrangencia: nacional ou internacional. Para viagem internacional, pode haver regra de moeda estrangeira e conversao pela cotacao turismo do dia anterior a solicitacao, conforme a norma aplicavel.

Quando transporte, hospedagem, alimentacao ou outras despesas forem custeadas por outra entidade, o valor da diaria pode ser reduzido, bloqueado ou receber complemento de forma diferente, de acordo com a norma vigente. Por isso, esses indicadores precisam ser informados ou derivados no momento da solicitacao e preservados na memoria de calculo.

O complemento de transporte urbano pode ser aplicado em viagens interestaduais ou internacionais quando nao houver veiculo oficial nem transporte custeado por outra entidade. Se o transporte ja foi custeado, o complemento nao deve ser aplicado.

A solicitacao tambem deve respeitar limites normativos de quantidade. Foram identificados limite de 15 dias consecutivos por viagem e limite mensal de 15 diarias por beneficiario, conforme norma vigente. O sistema deve validar esses limites antes de criar ou confirmar a solicitacao.

Toda diaria calculada deve guardar um snapshot do calculo. Esse snapshot deve conter o tipo de diaria usado, o parametro normativo aplicado, o valor unitario vigente no momento da solicitacao, a quantidade calculada, os acrescimos ou descontos, a distancia usada quando aplicavel, os indicadores de pernoite/custeio por terceiro e a norma de referencia. A prestacao de contas deve usar esse snapshot, sem recalcular a diaria com valores ou regras alteradas posteriormente.

Em resumo, o sistema deve calcular a diaria no M003 no momento da solicitacao, consumindo valores e parametros vigentes cadastrados no M008, validando saldo na rubrica correspondente e preservando a memoria de calculo para auditoria e prestacao de contas.

## Implicacoes Para o Conecta FAPES

| Tema | Decisao Recomendada |
|------|--------------------|
| Versionamento normativo | Registrar a regra de calculo aplicada como snapshot textual na `SolicitacaoDiaria`, incluindo decreto/versao vigente. |
| TipoDiaria no M008 | Manter apenas valor vigente por abrangencia, vigencia e situacao. O cadastro nao deve armazenar fracao de calculo. |
| ParametroCalculoDiaria no M008 | Manter percentuais, limites, bloqueios, norma de referencia e vigencia vinculados ao `TipoDiaria`. |
| Abrangencia | Usar classe corporativa do M008, com codigos canonicos iniciais `DENTRO_ESTADO`, `NACIONAL`, `INTERNACIONAL`. |
| Calculo operacional | Implementar o calculo no fluxo de M003 com base na normativa vigente, datas/horarios, origem, destino, pernoite e excecoes. Distancia automatica e aplicada somente quando a abrangencia for dentro do Estado. |
| Provedor de distancia | Preferir Google Routes API no backend para calcular distancia rodoviaria origem-destino. Manter cache/tabela de distancias em memoria como fallback operacional e para reduzir custo/latencia. A solicitacao deve guardar snapshot da distancia, provedor, origem da resposta e data/hora do calculo. |
| Prestacao de contas | M014 deve usar a `SolicitacaoDiaria` aprovada e seu snapshot de valor/regra, sem recalcular valor por cadastro atualizado. |
| Auditoria | Guardar memoria de calculo, decreto considerado, parametros informados e valor final calculado. |

## Tabela de Localidades e Distancias

A calculadora oficial da SEP usa selecao de **Origem** e **Destino**. No destino, antes da lista de municipios, existem opcoes especiais **(Fora do Estado)** e **(Fora do Pais)**. Para o Conecta FAPES, a tabela de distancias deve ser tratada como referencia operacional versionada: o sistema pode consultar a Google Routes API e gravar/cachear o resultado, ou usar a tabela em memoria quando ja existir par homologado.

### Opcoes Especiais de Destino

| Codigo operacional | Rotulo na tela | Abrangencia resultante | Usa distancia para elegibilidade? | Observacao |
|--------------------|----------------|------------------------|-----------------------------------|------------|
| `FORA_ESTADO` | `(Fora do Estado)` | Nacional | Nao | Segue o padrao visual da calculadora SEP; enquadra diaria nacional/interestadual. |
| `FORA_PAIS` | `(Fora do Pais)` | Internacional | Nao | Segue o padrao visual da calculadora SEP; enquadra diaria internacional. |

### Estrutura da Tabela de Distancias

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| `origemMunicipio` | String | Sim | Municipio/UF de origem selecionado em lista controlada. |
| `destinoMunicipio` | String | Sim | Municipio/UF de destino selecionado em lista controlada. |
| `distanciaKm` | Decimal | Sim | Distancia rodoviaria em quilometros. |
| `fonte` | String | Sim | `GOOGLE_ROUTES_API`, `TABELA_DISTANCIAS_MEMORIA` ou outra fonte homologada. |
| `dataReferencia` | Date | Sim | Data em que a distancia foi calculada ou homologada. |
| `ativo` | Boolean | Sim | Indica se o par pode ser usado em novas solicitacoes. |

### Semente Inicial da Tabela em Memoria

Esta semente cobre pares usados nos prototipos e deve ser expandida para todos os municipios do Espirito Santo. A tabela deve ser simetrica: se existir `A -> B`, o sistema pode usar o mesmo valor para `B -> A`, salvo regra futura em contrario.

| Origem | Destino | Distancia km | Fonte inicial | Observacao |
|--------|---------|--------------|---------------|------------|
| Vitoria/ES | Linhares/ES | 133,86 | Tabela em memoria baseada na referencia SEP/capital | Dentro do Estado |
| Vitoria/ES | Cachoeiro de Itapemirim/ES | 143,40 | Tabela em memoria baseada na referencia SEP/capital | Dentro do Estado |
| Vitoria/ES | Serra/ES | 26,22 | Tabela em memoria baseada na referencia SEP/capital | Regiao Metropolitana |
| Vitoria/ES | Vila Velha/ES | 6,40 | Tabela em memoria baseada na referencia SEP/capital | Regiao Metropolitana |
| Linhares/ES | Cachoeiro de Itapemirim/ES | 270,50 | Tabela em memoria homologada para prototipo | Dentro do Estado |
| Linhares/ES | Serra/ES | 108,70 | Tabela em memoria homologada para prototipo | Dentro do Estado |
| Linhares/ES | Vila Velha/ES | 140,90 | Tabela em memoria homologada para prototipo | Dentro do Estado |
| Cachoeiro de Itapemirim/ES | Serra/ES | 167,80 | Tabela em memoria homologada para prototipo | Dentro do Estado |
| Cachoeiro de Itapemirim/ES | Vila Velha/ES | 137,20 | Tabela em memoria homologada para prototipo | Dentro do Estado |
| Serra/ES | Vila Velha/ES | 34,10 | Tabela em memoria homologada para prototipo | Regiao Metropolitana |

### Regra de Uso da Tabela

1. Se a abrangencia for **Dentro do Estado**, o M003 deve tentar obter a distancia rodoviaria para o par origem-destino.
2. A primeira fonte preferencial e a Google Routes API, chamada pelo backend.
3. Se ja houver par homologado em cache/tabela de memoria, o sistema pode usar essa distancia sem nova chamada externa.
4. Se a chamada externa falhar e existir distancia em memoria, usar a distancia em memoria e registrar a origem da resposta no snapshot.
5. Se a abrangencia for **Nacional** ou **Internacional**, a distancia nao deve compor a elegibilidade da diaria.

## Parametros Minimos Para Solicitar Diaria

| Parametro | Obrigatorio | Observacao |
|-----------|-------------|------------|
| Abrangencia | Sim | Dentro do Estado, Nacional ou Internacional |
| Data/hora de partida | Sim | Inicio do afastamento |
| Data/hora de chegada | Sim | Fim do afastamento |
| Origem | Sim | Selecionada em lista controlada; necessaria para contexto do afastamento e, quando dentro do Estado, para calculo automatico de distancia |
| Destino | Sim | Selecionado em lista controlada; necessario para contexto do afastamento, abrangencia e, quando dentro do Estado, excecoes territoriais |
| Motivo/finalidade | Sim | Apoia justificativa e enquadramento |
| Distancia automatica | Condicional | Calculada e usada somente em viagens dentro do Estado |
| Indicador de pernoite | Calculado/derivado | Pode ser inferido pelas datas/horarios, mas deve aparecer na memoria de calculo |
| Transporte custeado por outra entidade | Condicional | Afeta complemento de transporte |
| Hospedagem/alimentacao custeadas por outra entidade | Condicional | Afeta reducao/complemento conforme decreto vigente |

## Pontos em Aberto

| Ponto | Encaminhamento |
|-------|----------------|
| A FAPES segue integralmente a calculadora estadual ou possui regra propria em edital/termo? | Confirmar com area normativa/FAPES antes da implementacao definitiva. |
| Tabela de valores por cargo/faixa se aplica a bolsistas? | Confirmar se bolsistas usam valor fixo por abrangencia no M008 ou tabela por perfil. |
| Aplicacao do Decreto no 6202-R/2025 | Validar se deve substituir ou apenas complementar a regra usada atualmente pela FAPES. |
