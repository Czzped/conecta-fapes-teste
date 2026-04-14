# EP-12 — Aditivo de Bolsa

`Bounded Context:` Portal FAPES (Aditivos) `Status:` Prototype `Dependências:` EP-01, EP-02, EP-07, EP-08

## Descrição

Permitir ao coordenador iniciar a extensão de uma bolsa ativa, consultar o resumo da bolsa, propor novo término por competência, validar restrições de vigência e cotas e visualizar o impacto estimado antes da confirmação.

## Critérios de aceite

- O fluxo de aditivo está disponível por rota dedicada dentro de `Minha Equipe`.
- A tela exibe dados da bolsa, projeto, modalidade, vigência atual e vigência do projeto.
- O usuário pode informar um novo término por mês/ano e uma justificativa.
- O sistema valida se a bolsa está ativa, se há extensão real e se a nova vigência respeita o fim do projeto.
- O sistema calcula meses adicionais, total projetado de pagamentos e cotas disponíveis.
- O fluxo ainda opera como protótipo com feedback local, sem mutation fim a fim consolidada para backend.

## Casos de Uso

### Propor extensão da bolsa

```gherkin
Feature: Abrir fluxo de aditivo
  Como coordenador do projeto
  Quero propor a extensão de uma bolsa ativa
  Para registrar uma nova vigência quando o projeto permitir

  Background:
    Given que sou coordenador do projeto ativo
    And existe uma bolsa apta para extensão

  Scenario: Visualizar resumo da bolsa no aditivo
    When acesso "/minha-equipe/aditivo-bolsa/:bolsaId"
    Then o sistema exibe projeto, bolsista, modalidade, status e vigência atual

  Scenario: Informar novo término e justificativa
    Given que estou na tela de aditivo
    When escolho um novo mês de término e preencho a justificativa
    Then o sistema recalcula o impacto projetado da extensão
```

### Validar restrições do aditivo

```gherkin
Feature: Validar regras do aditivo
  Como coordenador do projeto
  Quero receber validações claras antes de confirmar a extensão
  Para evitar solicitações inválidas

  Scenario: Bloquear aditivo sem extensão real
    Given que a nova competência informada é igual ao fim atual da bolsa
    When tento confirmar o aditivo
    Then o sistema bloqueia a ação por ausência de extensão real

  Scenario: Bloquear aditivo acima da vigência do projeto
    Given que a nova competência ultrapassa o fim da vigência do projeto
    When tento confirmar o aditivo
    Then o sistema bloqueia a ação por violação da vigência do projeto

  Scenario: Exibir protótipo sem envio fim a fim
    Given que todas as validações locais foram atendidas
    When aciono a confirmação do aditivo
    Then o sistema apresenta feedback local de sucesso
    And o fluxo permanece em estágio de protótipo
```
