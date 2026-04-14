# EP-07 — Minha Equipe e Acompanhamento de Bolsas

`Bounded Context:` Portal FAPES (Equipe) `Status:` Done `Dependências:` EP-01, EP-02, EP-06

## Descrição

Oferecer ao coordenador um painel da equipe com orçamento, indicadores por modalidade e uma listagem filtrável de bolsas, incluindo acesso a documentos, detalhes e ações operacionais.

## Critérios de aceite

- A tela `Minha Equipe` exibe indicadores de orçamento e quantidade de bolsas.
- O módulo possui abas para visão consolidada e listagem de bolsas/equipe.
- A listagem permite filtrar por nome, data, modalidade e status.
- Cada item da listagem expõe status da bolsa, datas relevantes e modalidade.
- O coordenador pode expandir a linha para consultar documentos associados à bolsa.
- O modal de detalhes da bolsa exibe dados do bolsista, orientador, período, objetivos e plano de atividades.

## Casos de Uso

### Consultar painel da equipe

```gherkin
Feature: Acompanhar equipe do projeto
  Como coordenador do projeto
  Quero visualizar indicadores consolidados da minha equipe
  Para acompanhar orçamento e distribuição das bolsas

  Background:
    Given que sou coordenador do projeto ativo

  Scenario: Exibir dashboard de equipe
    When acesso "/minha-equipe"
    Then o sistema exibe orçamento, estatísticas e progresso por modalidade

  Scenario: Alternar para a aba de bolsistas
    Given que estou em "Minha Equipe"
    When seleciono a aba de bolsistas
    Then o sistema exibe a listagem operacional de bolsas do projeto
```

### Consultar detalhes e documentos da bolsa

```gherkin
Feature: Inspecionar bolsa da equipe
  Como coordenador do projeto
  Quero consultar documentos e detalhes de uma bolsa específica
  Para avaliar a situação operacional do bolsista

  Scenario: Expandir item da listagem
    Given que existe uma bolsa listada
    When expando a linha da bolsa
    Then o sistema consulta e exibe os documentos vinculados à bolsa

  Scenario: Abrir modal de detalhes
    Given que existe uma bolsa listada
    When aciono os detalhes da bolsa
    Then o sistema exibe dados do bolsista, orientador, período e plano de atividades
```
