# Integracao — Banestes

```yaml
ontology: "Integração Banestes — ConectaFAPES"
namespace: "integrations.banestes"

imports: []

metadata:
  type: "integration"
  version: "1.0.0"
  description: "Integração com o Banestes para processamento de pagamentos via CNAB240. ConectaFAPES envia remessas de pagamento e recebe arquivos de retorno com status."
  modules_using: [M004]
  direction: "bidirectional"

integration:
  system: "Banestes"
  system_description: "Banco do Estado do Espírito Santo — banco oficial de pagamentos da FAPES"
  direction: "bidirectional"
  protocol: "CNAB240"
  authentication: "Certificado digital A3 (ICP-Brasil) e credenciais bancárias"
  base_url: "todo: configure per environment"
  file_transfer: "SFTP ou portal bancário (definir por ambiente)"

  outbound_files:
    - file_type: "RemessaCadastro"
      cnab_layout: "CNAB240 — Segmento P e Q (cadastro de beneficiários)"
      description: "Arquivo enviado ao Banestes para cadastrar ou atualizar dados bancários dos beneficiários antes do pagamento."
      trigger: "ProcessoRemessa.GERANDO_REMESSA_CADASTRO"
      used_by: "M004.RemessaCadastro"
      fields:
        - campo: "Agência"
          source: "corporativo.pessoas.ContaBancaria.agencia"
        - campo: "Conta"
          source: "corporativo.pessoas.ContaBancaria.conta"
        - campo: "CPF/CNPJ"
          source: "corporativo.pessoas.PessoaFisica.cpf OR corporativo.pessoas.PessoaJuridica.cnpj"
        - campo: "Nome"
          source: "corporativo.pessoas.PessoaFisica.nome"

    - file_type: "RemessaPagamento"
      cnab_layout: "CNAB240 — Segmento A (transferência crédito em conta)"
      description: "Arquivo com os valores e beneficiários a serem pagos pela FAPES."
      trigger: "ProcessoRemessa.GERANDO_REMESSA_PAGAMENTO"
      used_by: "M004.RemessaPagamento"
      fields:
        - campo: "Valor"
          source: "financeiro.pagamento.ItemFolha.valor"
        - campo: "Data pagamento"
          source: "financeiro.pagamento.FolhaPagamento.data_pagamento"
        - campo: "Finalidade"
          source: "financeiro.pagamento.ItemFolha.descricao"
        - campo: "Nosso número"
          source: "financeiro.pagamento.ItemFolha.id (convertido)"

  inbound_files:
    - file_type: "RetornoCadastro"
      cnab_layout: "CNAB240 — Retorno de cadastro"
      description: "Arquivo de retorno com confirmação ou rejeição de cadastro de beneficiários."
      trigger_event: "RetornoBancoRecebido (tipo: cadastro)"
      used_by: "M004.ProcessoRemessa"
      fields:
        - campo: "Código de ocorrência"
          description: "00 = Crédito realizado / 01-99 = Códigos de erro Banestes"
          mapped_to: "M004.RetornoCNAB.codigo_ocorrencia"

    - file_type: "RetornoPagamento"
      cnab_layout: "CNAB240 — Retorno de pagamento"
      description: "Arquivo de retorno com confirmação de liquidação ou rejeição de pagamentos."
      trigger_event: "RetornoBancoRecebido (tipo: pagamento)"
      used_by: "M004.ProcessoRemessa"
      fields:
        - campo: "Código de ocorrência"
          description: "00 = Crédito realizado / 01-99 = Códigos de erro Banestes"
          mapped_to: "M004.RetornoCNAB.codigo_ocorrencia"
        - campo: "Data efetiva"
          description: "Data em que o crédito foi efetivado."
          mapped_to: "M004.ItemFolha.data_liquidacao"

data_mappings:
  - external_entity: "CNAB240.LoteRemessa"
    internal_entity: "financeiro.pagamento.RemessaPagamento"
    mapping_notes: "Um lote CNAB corresponde a uma RemessaPagamento. Múltiplas RemessaPagamento podem compor um único arquivo CNAB240."

  - external_entity: "CNAB240.RegistroDetalhe"
    internal_entity: "financeiro.pagamento.ItemFolha"
    mapping_notes: "Cada registro detalhe CNAB corresponde a um ItemFolha da FolhaPagamento."

  - external_entity: "CNAB240.RetornoLote"
    internal_entity: "financeiro.pagamento.RetornoCNAB"
    mapping_notes: "Retorno do banco mapeado para RetornoCNAB; código de ocorrência determina status do ItemFolha."

  todo: "Complete mapping when integration is implemented"

error_codes:
  description: "Códigos de ocorrência Banestes CNAB240 relevantes"
  codes:
    - code: "00"
      description: "Crédito realizado com sucesso"
      action: "Marcar ItemFolha como LIQUIDADO"

    - code: "05"
      description: "Conta destino inválida"
      action: "Marcar ItemFolha como FALHA; notificar gestor para atualizar dados bancários"

    - code: "09"
      description: "Agência/conta bloqueada"
      action: "Marcar ItemFolha como FALHA; suspender pagamentos para este beneficiário"

    - code: "17"
      description: "CPF/CNPJ do beneficiário inválido"
      action: "Marcar ItemFolha como FALHA; verificar dados em M008"

agent_instructions:
  rules:
    - "Não criar integrações fora deste arquivo."
    - "Toda integração deve ter data_mappings definidos."
    - "Arquivos CNAB devem ser gerados e armazenados no eDocs antes do envio ao Banestes."
    - "Retentativas de remessa devem recriar o arquivo CNAB; nunca reenviar arquivo idêntico."
    - "Código de ocorrência 00 é o único sucesso; qualquer outro código é tratado como falha."
    - "Credenciais bancárias e certificado A3 nunca devem ser versionados no código."
  notes:
    - "Layout CNAB240 específico do Banestes pode ter variações; validar com banco antes da implementação."
    - "GuiaDeLiberacao é um documento interno gerado após retorno positivo; armazenado no eDocs."
    - "Ambiente de homologação (sandbox) do Banestes deve ser configurado separadamente."

```
