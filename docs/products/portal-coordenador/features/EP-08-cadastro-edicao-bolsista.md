# EP-08 — Cadastro e Edição de Bolsista

| Atributo | Valor |
|----------|-------|
| **Modulos backend** | M003, M009 |
| **Produto** | Portal Coordenador |

`Bounded Context:` Portal FAPES (Alocação) `Status:` Done `Dependências:` EP-01, EP-02, EP-07

## Descrição

Permitir ao coordenador cadastrar uma nova alocação de bolsista, editar alocações em edição, salvar rascunho, configurar pagamento avançado, selecionar orientador e estruturar plano de atividades.

## Critérios de aceite

- O formulário permite buscar e selecionar bolsista e orientador.
- O coordenador pode informar modalidade, início, duração, área de conhecimento, atividade, objetivos e plano de atividades.
- O fluxo suporta marcar o coordenador como orientador da bolsa.
- O formulário permite configurar pagamento avançado e distribuir competências quando necessário.
- O usuário pode salvar rascunho antes do envio final.
- O fluxo possui ação de cancelamento de bolsa com justificativa e último dia de atividade.

## Casos de Uso

### Cadastrar nova bolsa

```gherkin
Feature: Cadastrar bolsista no projeto
  Como coordenador do projeto
  Quero registrar uma nova alocação de bolsista
  Para iniciar o vínculo de bolsa no Portal FAPES

  Background:
    Given que sou coordenador do projeto ativo
    And acesso "/minha-equipe/cadastrar-bolsista"

  Scenario: Preencher dados da alocação
    When seleciono bolsista, orientador, modalidade, data de início e duração
    And informo atividade, objetivos, área de conhecimento e plano de atividades
    Then o sistema valida os campos obrigatórios

  Scenario: Salvar rascunho da alocação
    Given que preenchi parcialmente o formulário
    When aciono "Salvar Rascunho"
    Then o sistema persiste a solicitação em estado de rascunho
```

### Configurar edição e cancelamento

```gherkin
Feature: Manter alocação existente
  Como coordenador do projeto
  Quero editar ou cancelar uma alocação existente
  Para ajustar o vínculo do bolsista conforme a necessidade do projeto

  Scenario: Editar bolsa em edição
    Given que existe uma alocação em edição
    When acesso "/minha-equipe/editar-bolsista/:id"
    Then o sistema abre o formulário com os dados atuais da alocação

  Scenario: Cancelar bolsa
    Given que existe uma bolsa ativa ou em gestão
    When informo justificativa e último dia de atividade no modal de cancelamento
    Then o sistema envia a solicitação de cancelamento da bolsa
```
