> **Documento depreciado.** A documentacao canonica migrou para [implementation/modules/M014-prestacao-contas/](../../implementation/modules/M014-prestacao-contas/backlog.md).

# EP-09 — Cadastro e Gestao de Documentos Fiscais e Integracao SERPRO

**Bounded Context:** Comprovacao de Despesas
**Status:** Done
**Dependencias:** EP-06

## Descricao

Permitir que o coordenador do projeto possa cadastrar e gerenciar documentos fiscais (NF-e e NFS-e) com integracao automatica ao SERPRO para validacao e consulta de notas fiscais eletronicas. O epico cobre o processamento de arquivos (XML, PDF, imagem), extracao de chave de acesso, consulta na API SERPRO e cadastro automatico dos dados da nota.

## Criterios de aceite

- Usuarios podem criar, visualizar, editar e excluir documentos fiscais.
- Cada documento fiscal esta vinculado a uma JustificativaNF (DocumentoFiscalJustificativaNFId).
- Os campos incluem: ChaveAcesso, NomeEmitente, Descricao, ValorTotal, UF, Pais, Identificador, impostos (ICMS, PIS, IPI, ISS) e TipoNota.
- O sistema identifica automaticamente o tipo de arquivo enviado (XML, PDF, Imagem) via TipoArquivoIdentifierService.
- O sistema extrai a chave de acesso de NF-e a partir de arquivos (XML, PDF ou imagem) via ChaveAcessoExtractorService.
- O sistema consulta a API SERPRO para validar e obter dados da NF-e (ConsultarNfe).
- O sistema cadastra documentos fiscais a partir dos dados retornados pelo SERPRO (CadastrarSerpro/CadastrarNfe).
- E possivel processar arquivos de NFS-e via NfseExtractorService.
- E possivel listar documentos por justificativa (ListarPorJustificativa).
- E possivel consultar detalhes completos do documento (GetDetalhes).
- Valores de impostos devem ser maiores ou iguais a 0.
- A exclusao e logica (soft delete via DateDeleted).

---

## Casos de Uso

### Cadastrar e Gerenciar Documentos Fiscais

```gherkin
Feature: Cadastrar e Gerenciar Documentos Fiscais com Integracao SERPRO
  Como coordenador do projeto
  Quero cadastrar documentos fiscais com validacao automatica via SERPRO
  Para garantir a autenticidade e integridade das notas fiscais

  Background:
    Given que estou autenticado como usuario com token JWT valido
    And existe uma justificativa NF cadastrada

  Scenario: Processar arquivo e identificar tipo automaticamente
    When envio um arquivo de nota fiscal
    Then o sistema identifica o tipo (XML, PDF ou Imagem)
    And processa o arquivo de acordo com o tipo identificado

  Scenario: Extrair chave de acesso de arquivo XML
    When envio um arquivo XML de NF-e
    Then o sistema extrai a chave de acesso de 44 digitos
    And retorna a chave extraida

  Scenario: Extrair chave de acesso de arquivo PDF
    When envio um arquivo PDF de NF-e
    Then o sistema extrai a chave de acesso do PDF
    And retorna a chave extraida

  Scenario: Consultar NF-e na API SERPRO
    Given possuo uma chave de acesso valida
    When consulto a NF-e no SERPRO
    Then o sistema autentica via OAuth2 (SerproTokenService)
    And retorna os dados completos da nota fiscal

  Scenario: Cadastrar documento fiscal a partir dos dados SERPRO
    Given o SERPRO retornou os dados de uma NF-e
    When cadastro o documento fiscal com os dados do SERPRO
    Then o documento e criado com todos os campos preenchidos automaticamente
    And os itens da nota sao cadastrados

  Scenario: Cadastrar documento fiscal manualmente
    When crio um documento fiscal com:
      | Campo         | Valor                        |
      | ChaveAcesso   | 35260612345678000195550010..  |
      | NomeEmitente  | Fornecedor ABC Ltda          |
      | Descricao     | Material de laboratorio      |
      | ValorTotal    | 15000.00                     |
      | UF            | ES                           |
      | Pais          | Brasil                       |
      | TipoNota      | PRODUTO                      |
    Then o registro e criado com sucesso

  Scenario: Impedir cadastro com impostos negativos
    When tento criar um documento com TotalICMS = -100.00
    Then o sistema retorna erro de validacao

  Scenario: Listar documentos por justificativa
    Given existem documentos fiscais vinculados a uma justificativa
    When listo documentos pela justificativa
    Then o sistema retorna os documentos da justificativa

  Scenario: Consultar detalhes do documento fiscal
    Given existe um documento fiscal com itens
    When solicito os detalhes completos
    Then o sistema retorna o documento com todos os itens e impostos

  Scenario: Processar NFS-e (nota de servico)
    When envio um arquivo de NFS-e
    Then o sistema processa via NfseExtractorService
    And cadastra o documento com TipoNota = SERVICO

  Scenario: Excluir documento fiscal (soft delete)
    Given existe um documento fiscal cadastrado
    When excluo o documento
    Then o campo DateDeleted e preenchido com a data atual
```
