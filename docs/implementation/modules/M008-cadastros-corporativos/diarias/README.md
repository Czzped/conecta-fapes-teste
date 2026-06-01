# Contexto Diarias

[M008](../README.md) | [Backlog](backlog.md) | [Modelo estrutural](modelo-estrutural.md) | [Modelo consolidado](../modelo-estrutural.md)

Agrupa os cadastros corporativos que definem valores vigentes de diaria por abrangencia da viagem e os parametros normativos vinculados a cada tipo de diaria. O M003 consome estes cadastros por referencia ao criar `SolicitacaoDiaria`.

| Entidade | Responsabilidade |
|----------|------------------|
| Abrangencia | Classificacao corporativa do deslocamento |
| TipoDiaria | Valor vigente, vigencia e abrangencia da viagem |
| ParametroCalculoDiaria | Parametros normativos vigentes vinculados ao TipoDiaria para calculo de quantidade, acrescimos, bloqueios e memoria de calculo |

## Abrangencia

`Abrangencia` e a classe corporativa que classifica o deslocamento para diaria. As abrangencias previstas inicialmente sao **Dentro do Estado**, **Nacional** e **Internacional**.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| codigo | Codigo canonico da abrangencia | Sim | String | DENTRO_ESTADO, NACIONAL, INTERNACIONAL | 40 | Sim |
| nome | Nome de exibicao | Sim | String | Ex: Dentro do Estado | 150 | |
| descricao | Descricao da abrangencia | Nao | String | | 500 | |
| ativo | Indica se a abrangencia esta ativa para novos tipos de diaria | Sim | Boolean | true/false | | |

## TipoDiaria

`TipoDiaria` e o cadastro corporativo do valor vigente de diaria, sua vigencia e abrangencia da viagem. Ele e mantido pela FAPES em **Configuracoes > Referencias Corporativas > Diarias**.

O M003 nao cadastra `TipoDiaria`; ele consulta o cadastro vigente por abrangencia, grava `tipoDiariaRef` e persiste snapshots de abrangencia, valor e regra de calculo na `SolicitacaoDiaria`.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| abrangencia | Abrangencia administrativa do deslocamento | Sim | FK -> Abrangencia | Via `tipos` | | |
| valorUnitario | Valor unitario vigente da diaria | Sim | Decimal | Maior que zero | | |
| vigenciaInicio | Inicio da vigencia | Sim | Date | | | |
| vigenciaFim | Fim da vigencia | Nao | Date | | | |
| ativo | Indica se o cadastro esta ativo | Sim | Boolean | true/false | | |

## ParametroCalculoDiaria

`ParametroCalculoDiaria` e o cadastro corporativo dos parametros normativos usados pelo M003 para calcular a diaria conforme norma vigente. Ele nao representa uma solicitacao; apenas versiona percentuais, limites e bloqueios da regra de calculo para um `TipoDiaria`.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| tipoDiaria | Tipo de diaria ao qual os parametros pertencem | Sim | FK -> TipoDiaria | Via `parametros` | | |
| normaReferencia | Decreto, resolucao ou ato normativo que fundamenta os parametros | Sim | String | Ex: Decreto ES no 5533-R/2023 | 200 | |
| percentualDiariaSemPernoite | Percentual aplicado quando nao ha pernoite e o afastamento atinge minimo normativo | Sim | Decimal | Ex: 0.40 | | |
| horasMinimasSemPernoite | Horas minimas para diaria sem pernoite | Sim | Integer | Ex: 6 | | |
| horaLimiteRetornoAcrescimo | Hora de retorno a partir da qual ha acrescimo normativo | Sim | Integer | Ex: 14 | | |
| percentualAcrescimoRetorno | Percentual acrescido quando retorno ocorrer apos o horario limite | Sim | Decimal | Ex: 0.40 | | |
| distanciaMinimaKm | Distancia minima para elegibilidade quando aplicavel | Nao | Integer | Ex: 150 | | |
| limiteDiasConsecutivos | Limite de dias consecutivos com diaria | Nao | Integer | Ex: 15 | | |
| limiteDiariasMes | Limite mensal de diarias por beneficiario | Nao | Integer | Ex: 15 | | |
| percentualComplementoTransporte | Percentual de complemento para transporte urbano quando aplicavel | Nao | Decimal | Ex: 0.20 | | |
| bloqueiaRegiaoMetropolitanaSemPernoite | Indica bloqueio para regiao metropolitana sem pernoite | Sim | Boolean | true/false | | |
| bloqueiaMunicipioLimitrofeSemPernoite | Indica bloqueio para municipio limitrofe sem pernoite | Sim | Boolean | true/false | | |
| ativo | Indica se os parametros estao vigentes para novas consultas | Sim | Boolean | true/false | | |
| vigenciaInicio | Inicio da vigencia normativa | Sim | Date | | | |
| vigenciaFim | Fim da vigencia normativa | Nao | Date | | | |

## Regras

- O valor unitario do tipo de diaria deve ser maior que zero.
- A abrangencia deve existir como classe corporativa ativa.
- `Abrangencia.codigo` deve ser unico.
- Nao pode haver vigencias ativas sobrepostas para a mesma abrangencia.
- `ParametroCalculoDiaria` sempre pertence a exatamente um `TipoDiaria`.
- Nao pode haver parametros de calculo ativos com vigencia sobreposta para o mesmo `TipoDiaria`.
- O valor vigente e obtido pela abrangencia e pela data de referencia da solicitacao.
- Os parametros vigentes sao obtidos pelo `TipoDiaria` localizado e pela data de referencia da solicitacao.
- Alteracoes posteriores em valor, abrangencia ou parametros normativos nao alteram snapshots ja gravados em solicitacoes do M003.
- M003 deve referenciar `tipoDiariaRef`, parametros vigentes e gravar snapshot no momento da solicitacao.

## Referência funcional de Diária

### Contexto

Diária é um recurso financeiro destinado a cobrir despesas com alimentação, hospedagem e locomoção decorrentes de afastamento da sede, em caráter eventual, para outro ponto do estado, do país ou do exterior relacionadas a atividades de pesquisa, inovação, extensão e capacitação vinculadas aos objetivos do projeto financiado apoiado pela Fundação de Amparo à Pesquisa e Inovação do Espírito Santo (FAPES).

Os valores atuais de Diária são:

- Dentro do Estado do Espírito Santo: R$ 220,00
- Fora do Estado (Brasil): R$ 450,00
- Internacional: US$ 220,00 a US$ 550,00, conforme o grupo de países de destino

Esses valores devem ser parametrizados para quando forem alterados no futuro.

### Comportamento

- Para o projeto usar Diária, ele deve ter esse recurso disponibilizado em seu Edital.
- Se o valor total da Diária for maior que o valor que o projeto tiver disponível para essa categoria, o coordenador deve fazer primeiro o Remanejamento de Recursos, pegar um valor que não usou em outra categoria e incluir em Diária.
- Antes de realizar a Diária é necessário fazer a Solicitação. Nela todas as informações ficam registradas.
- O Bolsista selecionado para a Diária deve fazer o aceite.
- A distância mínima para solicitar uma Diária é de 150km.
- Diária deve ter o período máximo de 15 dias por viagem dentro de um mês (Decreto Estadual e Norma Itens Financiáveis). Pode permitir mais de 15 dias entre um mês e outro, pois o Decreto não especifica essa situação.
- Diária é destinada apenas a membros do projeto. É proibido pagar diária para terceiros.
- O Coordenador deve retirar o valor da Diária da conta do Projeto e enviar para a conta Banestes do Bolsista.
- Após a data da Diária, o Bolsista ou Coordenador devem comprovar com texto e imagem que foram na viagem.
- Após o valor sair da conta do projeto, a Diária acontecer e seu relatório ser enviado, o Coordenador deve em Prestação de Contas Financeira associar a saída do valor a Diária solicitada.
