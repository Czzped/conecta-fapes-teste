# EP-09 — Geracao de Remessas Bancarias

**Bounded Context:** Remessa
**Status:** Done
**Dependencias:** EP-08

## Descricao

Permitir que o sistema gere arquivos de remessa bancaria para cadastro de bolsistas e para pagamento, enviando-os ao banco (Banestes) em formato de arquivo de largura fixa. O epico garante a integracao bancaria para efetivacao dos pagamentos.

## Criterios de aceite

- O sistema gera RemessaCadastro com dados pessoais e bancarios dos bolsistas para registro no banco.
- O sistema gera RemessaPagamento com valores de pagamento vinculados a uma Folha.
- Os arquivos sao gerados em formato de largura fixa com secoes Header, Detalhe e Trailer.
- Caracteres acentuados sao removidos e campos sao formatados conforme especificacao bancaria.
- Um hash SHA256 e gerado a partir do conteudo do arquivo para garantir integridade.
- Os arquivos sao armazenados no MinIO (bucket BUCKET_REMESSAS).
- A RemessaCadastro atualiza o StatusCadastroBaneste da alocacao para ENVIADO.
- A RemessaPagamento possui status: GERANDO -> GERADA -> ENVIADA -> AGENDADA -> AUTORIZADA -> EFETIVADA.
- Os contadores BolsistasEnviados e BolsistasComErros sao registrados na remessa.
- Arquivos de remessa podem ser baixados via download.

---

## Casos de Uso

### Gerar Remessas Bancarias

```gherkin
Feature: Gerar Remessas Bancarias
  Como operador da FAPES
  Quero gerar arquivos de remessa bancaria
  Para enviar dados de cadastro e pagamento de bolsistas ao banco

  Background:
    Given que estou autenticado como usuario com papel "OPERADOR"

  Scenario: Gerar remessa de cadastro de bolsistas
    Given existem alocacoes com StatusCadastroBaneste "PENDENTE"
    When gero a remessa de cadastro de bolsistas
    Then o arquivo de remessa e gerado em formato de largura fixa
    And o arquivo e armazenado no MinIO
    And o StatusCadastroBaneste das alocacoes e atualizado para "ENVIADO"
    And o hash SHA256 do arquivo e registrado
    And o contador de BolsistasEnviados e atualizado
    And o arquivo e retornado para download

  Scenario: Gerar remessa de pagamento
    Given existe uma folha com status "AUTORIZADA"
    And existem pagamentos com status "EM_FOLHA"
    When gero a remessa de pagamento para a folha
    Then o arquivo de remessa e gerado com Header, Detalhes e Trailer
    And caracteres acentuados sao removidos dos campos
    And o arquivo e armazenado no MinIO
    And a RemessaPagamento e criada com status "GERADA"
    And os pagamentos enviados sao vinculados a remessa

  Scenario: Garantir integridade do arquivo via hash
    When a remessa e gerada
    Then um hash SHA256 e calculado a partir do conteudo
    And o hash e armazenado no registro da remessa

  Scenario: Registrar bolsistas com erro na remessa
    Given existem bolsistas com dados bancarios incompletos
    When gero a remessa de cadastro
    Then os bolsistas com erro sao contabilizados em BolsistasComErros
    And os erros sao registrados individualmente

  Scenario: Fazer download de remessa de pagamento
    Given existe uma remessa de pagamento gerada
    When faco download da remessa
    Then o sistema retorna o arquivo armazenado no MinIO
```
