# Workflow — Pagamento de Bolsistas

```yaml
ontology: "Workflow de Pagamento — ConectaFAPES"
namespace: "workflows.pagamento"

imports:
  - namespace: "financeiro.pagamento"
    path: "../../implementation/modules/M004-pagamento-bolsista/ontology.yaml"
  - namespace: "post_award.iniciativas"
    path: "../../implementation/modules/M003-gestao-iniciativas-captadas/ontology.yaml"
  - namespace: "financeiro.saldo"
    path: "../../implementation/modules/M013-gestao-orcamentaria-projeto/ontology.yaml"

metadata:
  type: "cross-cutting-workflow"
  version: "1.0.0"
  description: "Fluxo de processamento de pagamentos: elaboração de folha, aprovação, geração de remessa e liquidação bancária."
  modules_involved: [M004, M003, M013]

workflows:
  ProcessamentoFolha:
    description: "Ciclo de vida de uma FolhaPagamento, desde rascunho até o status paga."
    entity: "financeiro.pagamento.FolhaPagamento"
    initial_state: "RASCUNHO"
    final_states: [PAGA, CANCELADA]

    states:
      - name: "RASCUNHO"
        description: "Folha em elaboração; itens de pagamento podem ser adicionados ou removidos."
      - name: "EM_APROVACAO"
        description: "Folha submetida para aprovação do gestor financeiro."
      - name: "APROVADA"
        description: "Folha aprovada; pronta para geração de remessa."
      - name: "PAGA"
        description: "Pagamentos liquidados pelo banco; confirmado via arquivo de retorno CNAB."
      - name: "CANCELADA"
        description: "Folha cancelada antes de ser enviada ao banco."

    transitions:
      - from: "RASCUNHO"
        to: "EM_APROVACAO"
        trigger: "submeter_folha"
        guard: "folha.itens não vazia AND folha.iniciativa.status == ATIVA"
        module: "M004"

      - from: "EM_APROVACAO"
        to: "APROVADA"
        trigger: "aprovar_folha"
        guard: "role == GestorFinanceiro AND saldo_disponivel >= folha.valor_total"
        module: "M004"
        event_emitted: "FolhaAprovada"

      - from: "EM_APROVACAO"
        to: "RASCUNHO"
        trigger: "devolver_folha"
        guard: "role == GestorFinanceiro"
        module: "M004"

      - from: "APROVADA"
        to: "PAGA"
        trigger: "confirmar_liquidacao"
        guard: "retorno_cnab_processado == true AND todos_itens_liquidados == true"
        module: "M004"
        event_emitted: "FolhaPaga"

      - from: ["RASCUNHO", "EM_APROVACAO"]
        to: "CANCELADA"
        trigger: "cancelar_folha"
        guard: "role == GestorFinanceiro"
        module: "M004"

  ProcessoRemessa:
    description: "Orquestra a geração e envio de remessas de pagamento ao Banestes."
    entity: "financeiro.pagamento.ProcessoRemessa"
    initial_state: "AGUARDANDO_FOLHA_APROVADA"
    final_states: [CONCLUIDA, FALHA_DEFINITIVA]

    states:
      - name: "AGUARDANDO_FOLHA_APROVADA"
        description: "Aguardando evento FolhaAprovada para iniciar o processo."
      - name: "GERANDO_REMESSA_CADASTRO"
        description: "Arquivo RemessaCadastro (cadastro de beneficiários) sendo gerado."
      - name: "AGUARDANDO_RETORNO_CADASTRO"
        description: "Arquivo enviado ao Banestes; aguardando retorno de confirmação de cadastro."
      - name: "GERANDO_REMESSA_PAGAMENTO"
        description: "Arquivo RemessaPagamento sendo gerado com os valores a pagar."
      - name: "AGUARDANDO_RETORNO_PAGAMENTO"
        description: "Arquivo de pagamento enviado; aguardando retorno CNAB do banco."
      - name: "GERANDO_GUIA_LIBERACAO"
        description: "Guia de liberação sendo gerada para autorização final."
      - name: "CONCLUIDA"
        description: "Remessa liquidada com sucesso; FolhaPagamento marcada como PAGA."
      - name: "FALHA"
        description: "Erro em etapa intermediária; processo pode ser retentado."
      - name: "FALHA_DEFINITIVA"
        description: "Falha não recuperável; requer intervenção manual."

    transitions:
      - from: "AGUARDANDO_FOLHA_APROVADA"
        to: "GERANDO_REMESSA_CADASTRO"
        trigger: "FolhaAprovada"
        module: "M004"

      - from: "GERANDO_REMESSA_CADASTRO"
        to: "AGUARDANDO_RETORNO_CADASTRO"
        trigger: "enviar_remessa_cadastro"
        guard: "arquivo_cnab_gerado == true"
        module: "M004"
        integration: "integrations.banestes"

      - from: "AGUARDANDO_RETORNO_CADASTRO"
        to: "GERANDO_REMESSA_PAGAMENTO"
        trigger: "retorno_cadastro_confirmado"
        guard: "cnab_retorno.status == SUCESSO"
        module: "M004"
        integration: "integrations.banestes"

      - from: "AGUARDANDO_RETORNO_CADASTRO"
        to: "FALHA"
        trigger: "retorno_cadastro_rejeitado"
        module: "M004"

      - from: "GERANDO_REMESSA_PAGAMENTO"
        to: "AGUARDANDO_RETORNO_PAGAMENTO"
        trigger: "enviar_remessa_pagamento"
        guard: "arquivo_cnab_pagamento_gerado == true"
        module: "M004"
        integration: "integrations.banestes"

      - from: "AGUARDANDO_RETORNO_PAGAMENTO"
        to: "GERANDO_GUIA_LIBERACAO"
        trigger: "retorno_pagamento_recebido"
        guard: "cnab_retorno.status == SUCESSO"
        module: "M004"

      - from: "AGUARDANDO_RETORNO_PAGAMENTO"
        to: "FALHA"
        trigger: "retorno_pagamento_rejeitado"
        module: "M004"

      - from: "GERANDO_GUIA_LIBERACAO"
        to: "CONCLUIDA"
        trigger: "guia_liberada"
        guard: "guia_assinada == true"
        module: "M004"

      - from: "FALHA"
        to: "GERANDO_REMESSA_CADASTRO"
        trigger: "retentar_processo"
        guard: "tentativas < 3"
        module: "M004"

      - from: "FALHA"
        to: "FALHA_DEFINITIVA"
        trigger: "abandonar_processo"
        guard: "tentativas >= 3 OR intervencao_manual == true"
        module: "M004"

  RemessaStatus:
    description: "Estados de um arquivo de remessa individual (cadastro ou pagamento)."
    entity: "financeiro.pagamento.Remessa"
    states:
      - PENDENTE
      - EM_PROCESSAMENTO
      - CONCLUIDA
      - FALHA

    transitions:
      - from: "PENDENTE"
        to: "EM_PROCESSAMENTO"
        trigger: "iniciar_envio"
        module: "M004"

      - from: "EM_PROCESSAMENTO"
        to: "CONCLUIDA"
        trigger: "confirmar_retorno_banco"
        module: "M004"
        integration: "integrations.banestes"

      - from: "EM_PROCESSAMENTO"
        to: "FALHA"
        trigger: "receber_rejeicao_banco"
        module: "M004"
        integration: "integrations.banestes"

events:
  - name: "FolhaAprovada"
    description: "FolhaPagamento aprovada pelo GestorFinanceiro; dispara geração de remessa."
    source_module: "M004"
    payload: "financeiro.pagamento.FolhaPagamento"

  - name: "FolhaPaga"
    description: "Todos os itens da folha liquidados pelo banco."
    source_module: "M004"
    payload: "financeiro.pagamento.FolhaPagamento"

  - name: "RemessaEnviada"
    description: "Arquivo de remessa CNAB enviado ao Banestes."
    source_module: "M004"
    payload: "financeiro.pagamento.Remessa"

  - name: "RetornoBancoRecebido"
    description: "Arquivo de retorno CNAB recebido e processado."
    source_module: "M004"
    payload: "financeiro.pagamento.RetornoCNAB"

agent_instructions:
  rules:
    - "Não criar entidades fora da ontologia."
    - "Toda spec deve respeitar axioms definidos nos módulos de domínio."
    - "FolhaPagamento só pode ser enviada para remessa quando status == APROVADA."
    - "Débito em saldo (M013) deve ocorrer no momento da aprovação da folha, não do pagamento."
    - "Arquivos CNAB seguem o padrão CNAB240 definido em integrations.banestes."
    - "Retentativas de remessa devem recriar o arquivo; nunca reenviar o mesmo arquivo."
  notes:
    - "GuiaDeLiberacao é um documento gerado internamente e armazenado no eDocs (M019)."
    - "Integração com Banestes detalhada em integrations/banestes.yaml."

```
