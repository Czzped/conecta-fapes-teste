> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M004-pagamento-bolsista/](../../implementation/modules/M004-pagamento-bolsista/backlog.md).

# EP-02 — Cadastro Base (CRUDs)

**Bounded Context:** Infraestrutura
**Status:** Done
**Dependencias:** EP-01

## Descricao

Permitir que operadores possam cadastrar e gerenciar as entidades base do sistema — areas tecnicas, modalidades de bolsa, versoes de modalidade, niveis de bolsa e atividades. O epico garante que essas entidades estejam disponiveis como referencia para editais, alocacoes e pagamentos.

## Criterios de aceite

- Operadores podem criar, visualizar, editar e excluir AreaTecnica, ModalidadeBolsa, VersaoModalidade, NivelBolsa e Atividade.
- Cada ModalidadeBolsa possui uma Sigla unica.
- Cada VersaoModalidade esta vinculada a uma ModalidadeBolsa e possui Sigla, ReducaoPorVinculo e Estado.
- Cada VersaoNivel esta vinculado a uma VersaoModalidade e a um NivelBolsa, com um Valor monetario.
- O calculo de valor com reducao e aplicado como: ReducaoPorVinculo * Valor.
- Somente versoes com Estado adequado podem ser associadas a alocacoes.
- Bancos podem ser consultados, distinguindo os que nao sao o banco padrao.

---

## Casos de Uso

### Cadastrar e Gerenciar Modalidades de Bolsa

```gherkin
Feature: Cadastrar e Gerenciar Modalidades de Bolsa
  Como operador da FAPES
  Quero cadastrar, editar e excluir modalidades de bolsa e suas versoes
  Para manter a base de modalidades atualizada para alocacoes e pagamentos

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"

  Scenario: Criar modalidade de bolsa com dados validos
    When crio uma modalidade de bolsa com:
      | Campo | Valor |
      | Sigla | MSC   |
    Then o registro e criado com sucesso
    And o sistema registra o usuario e horario da criacao

  Scenario: Impedir criacao com Sigla duplicada
    Given ja existe uma modalidade de bolsa com Sigla "MSC"
    When tento criar outra modalidade com a mesma Sigla
    Then o sistema retorna erro "Ja existe uma modalidade com esta sigla"

  Scenario: Criar versao de modalidade com niveis
    Given existe uma modalidade de bolsa "MSC"
    When crio uma versao de modalidade com:
      | Campo             | Valor |
      | Sigla             | V1    |
      | ReducaoPorVinculo | 0.70  |
      | Estado            | ATIVA |
    And associo niveis de bolsa com valores:
      | NivelBolsa | Valor   |
      | N1         | 1500.00 |
      | N2         | 2000.00 |
    Then a versao e criada com seus respectivos niveis

  Scenario: Calcular valor com reducao por vinculo
    Given existe uma VersaoNivel com Valor "2000.00" e ReducaoPorVinculo "0.70"
    When o bolsista possui reducao por vinculo
    Then o valor calculado e "1400.00"

  Scenario: Consultar bancos nao padrao
    When consulto os bancos que nao sao o banco padrao
    Then o sistema retorna a lista de bancos alternativos disponiveis
```

### Cadastrar e Gerenciar Areas Tecnicas e Atividades

```gherkin
Feature: Cadastrar e Gerenciar Areas Tecnicas e Atividades
  Como operador da FAPES
  Quero cadastrar areas tecnicas e atividades
  Para vincula-las a editais e projetos

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"

  Scenario: Criar area tecnica com dados validos
    When crio uma area tecnica com:
      | Campo     | Valor                  |
      | Nome      | Ciencias Exatas        |
      | Descricao | Area de exatas e terra |
    Then o registro e criado com sucesso

  Scenario: Criar atividade com dados validos
    When crio uma atividade com:
      | Campo  | Valor         |
      | Nome   | Pesquisa      |
      | Codigo | PESQ-001      |
    Then o registro e criado com sucesso

  Scenario: Impedir criacao sem campo obrigatorio
    When tento criar uma area tecnica sem informar o Nome
    Then o sistema retorna erro de validacao "Nome e obrigatorio"
```
