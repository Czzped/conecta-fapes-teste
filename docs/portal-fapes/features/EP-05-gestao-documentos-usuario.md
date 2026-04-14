# EP-05 — Gestão de Documentos do Usuário

`Bounded Context:` Portal FAPES (Documentos) `Status:` Done `Dependências:` EP-01, EP-02, EP-04

## Descrição

Centralizar os documentos solicitados por bolsa, permitindo envio, atualização, pré-visualização, download, justificativas de revisão e geração do termo de responsabilidade quando aplicável.

## Critérios de aceite

- A aba `Meus Documentos` lista documentos agrupados por bolsa.
- Cada requisito documental exibe status, metadados e data de envio.
- Documentos já enviados podem ser atualizados e visualizados.
- Quando existe pedido de revisão, o sistema apresenta a justificativa correspondente.
- O termo de responsabilidade pode ser gerado com base nas declarações exigidas.
- O usuário pode excluir um termo existente e gerar um novo quando necessário.

## Casos de Uso

### Enviar e atualizar documentos

```gherkin
Feature: Cumprir requisitos documentais da bolsa
  Como bolsista ou participante
  Quero enviar e substituir documentos exigidos
  Para atender às pendências do meu processo

  Background:
    Given que acesso a aba "Meus Documentos"

  Scenario: Anexar documento pendente
    Given que existe um requisito sem arquivo enviado
    When seleciono um PDF para o requisito
    Then o sistema realiza o upload do documento
    And atualiza o status do item documental

  Scenario: Atualizar documento já enviado
    Given que já existe um arquivo anexado para o requisito
    When seleciono um novo PDF para atualização
    Then o sistema substitui o documento anterior
    And mantém a consulta ao arquivo atualizado
```

### Gerar termo de responsabilidade

```gherkin
Feature: Gerar termo de responsabilidade
  Como usuário com requisito de termo
  Quero preencher as declarações exigidas e gerar o documento
  Para concluir a documentação da bolsa

  Scenario: Gerar novo termo
    Given que o requisito documental é "Termo de Responsabilidade"
    And ainda não existe termo gerado
    When preencho as declarações obrigatórias
    And aciono "Gerar Termo"
    Then o sistema gera o termo vinculado à bolsa

  Scenario: Regenerar termo existente
    Given que já existe um termo gerado
    When excluo o termo atual
    Then o sistema permite gerar um novo termo com os dados atualizados
```
