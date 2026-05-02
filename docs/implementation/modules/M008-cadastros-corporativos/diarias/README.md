# Contexto Diarias

[M008](../README.md) | [Backlog](backlog.md) | [Modelo estrutural](modelo-estrutural.md) | [Modelo consolidado](../modelo-estrutural.md)

Agrupa os cadastros corporativos que classificam viagens e definem valores vigentes de diaria. O M003 consome estes cadastros por referencia ao criar `SolicitacaoDiaria`.

| Entidade | Responsabilidade |
|----------|------------------|
| TipoViagem | Classificacao do deslocamento usado em solicitacoes de diaria |
| TipoDiaria | Valor vigente, fracao de calculo e vigencia por tipo de viagem |

## TipoViagem

`TipoViagem` e o cadastro corporativo que classifica o deslocamento usado nas solicitacoes de diaria. Ele e mantido pela FAPES em **Configuracoes > Referencias Corporativas > Diarias**, no mesmo contexto administrativo dos valores de diaria.

O tipo de viagem nao possui valor unitario. O valor vigente fica em `TipoDiaria`, vinculado ao tipo de viagem.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| codigo | Codigo canonico do tipo de viagem | Sim | String | Ex: TVI-001 | 40 | Sim |
| nome | Nome de exibicao do tipo de viagem | Sim | String | Ex: Dentro do Estado, Nacional, Internacional | 150 | |
| abrangencia | Abrangencia administrativa do deslocamento | Sim | AbrangenciaViagem | DENTRO_ESTADO, NACIONAL, INTERNACIONAL | | |
| descricao | Descricao administrativa do tipo | Nao | String | | 500 | |
| ativo | Indica se o tipo esta disponivel para novas solicitacoes | Sim | Boolean | true/false | | |

### Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| tiposDiaria | 0..* | Valores vigentes de diaria vinculados ao tipo de viagem |

## TipoDiaria

`TipoDiaria` e o cadastro corporativo do valor vigente de diaria, sua vigencia e sua fracao de calculo para um `TipoViagem`. Ele e mantido pela FAPES em **Configuracoes > Referencias Corporativas > Diarias**.

O M003 nao cadastra `TipoDiaria`; ele consulta o tipo vigente, grava `tipoDiariaRef` e persiste snapshots de valor, fracao e regra de calculo na `SolicitacaoDiaria`.

### Atributos

| Atributo | Definicao | Obrig. | Tipo | Dominio | Tamanho | Unico |
|----------|-----------|--------|------|---------|---------|-------|
| codigo | Codigo canonico do tipo de diaria | Sim | String | Ex: DIA-2026-001 | 40 | Sim |
| valorUnitario | Valor unitario vigente da diaria | Sim | Decimal | Maior que zero | | |
| fracaoCalculo | Fracao usada no calculo | Sim | FracaoCalculoDiaria | 12H, 24H | | |
| vigenciaInicio | Inicio da vigencia | Sim | Date | | | |
| vigenciaFim | Fim da vigencia | Nao | Date | | | |
| ativo | Indica se o cadastro esta ativo | Sim | Boolean | true/false | | |

### Relacionamentos

| Relacao | Cardinalidade | Descricao |
|---------|----------------|-----------|
| tipoViagem | 1 | Tipo de viagem ao qual o valor se aplica |

## Enumeracoes

| Enum | Valores |
|------|---------|
| AbrangenciaViagem | DENTRO_ESTADO, NACIONAL, INTERNACIONAL |
| FracaoCalculoDiaria | 12H, 24H |

## Regras

- O codigo do tipo de viagem deve ser unico.
- Tipo de viagem inativo nao deve ser oferecido para novas solicitacoes de diaria.
- O valor unitario do tipo de diaria deve ser maior que zero.
- Deve existir tipo de viagem ativo para vincular o tipo de diaria.
- Nao pode haver vigencias ativas sobrepostas para o mesmo tipo de viagem.
- O tipo vigente e obtido pela data de referencia da solicitacao.
- Alteracoes posteriores no nome, abrangencia, valor ou fracao nao alteram snapshots ja gravados em solicitacoes do M003.
- M003 deve apenas referenciar `tipoViagemRef` e `tipoDiariaRef` e gravar snapshot no momento da solicitacao.
