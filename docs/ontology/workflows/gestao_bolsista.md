# Workflow — Gestao de Bolsista

```yaml
ontology: "Workflow de Gestão de Bolsista — ConectaFAPES"
namespace: "workflows.gestao_bolsista"

imports:
  - namespace: "post_award.bolsas"
    path: "../../implementation/modules/M009-gestao-bolsista/ontology.yaml"
  - namespace: "post_award.iniciativas"
    path: "../../implementation/modules/M003-gestao-projetos-captados/ontology.yaml"
  - namespace: "corporativo.pessoas"
    path: "../shared/people.yaml"

metadata:
  type: "cross-cutting-workflow"
  version: "1.0.0"
  description: "Ciclo de vida da bolsa de pesquisa: convite, aceite, documentação, publicação, implementação e encerramento."
  modules_involved: [M009, M003, M008]

workflows:
  BolsaPesquisa:
    description: "Máquina de estados de 14 estados para BolsaPesquisa, desde a oferta até o encerramento."
    entity: "post_award.bolsas.BolsaPesquisa"
    initial_state: "AGUARDANDO_ACEITE"
    final_states: [CONCLUIDA, ENCERRADA, CANCELADA, RECUSADA]

    states:
      - name: "AGUARDANDO_ACEITE"
        description: "Bolsa ofertada ao candidato; aguardando resposta de aceite ou recusa."
      - name: "ACEITA"
        description: "Candidato aceitou a bolsa; aguardando envio de documentação."
      - name: "RECUSADA"
        description: "Candidato recusou a bolsa. Estado final."
      - name: "DOCUMENTACAO_PENDENTE"
        description: "Bolsista deve enviar documentos exigidos para formalização."
      - name: "DOCUMENTACAO_ANALISADA"
        description: "Documentos recebidos e em análise pela equipe da FAPES."
      - name: "PUBLICADA"
        description: "Bolsa publicada (portaria ou ato equivalente); vigência iniciada formalmente."
      - name: "IMPLEMENTADA"
        description: "Bolsa ativa e bolsista recebendo pagamentos mensais."
      - name: "SUSPENSA"
        description: "Bolsa temporariamente suspensa (inadimplência ou decisão administrativa)."
      - name: "ENCERRADA"
        description: "Bolsa encerrada antecipadamente sem conclusão regular."
      - name: "CONCLUIDA"
        description: "Bolsa concluída normalmente ao fim do período previsto."
      - name: "CANCELADA"
        description: "Bolsa cancelada. Estado final alcançável de vários estados."

    transitions:
      # --- Aceite ---
      - from: "AGUARDANDO_ACEITE"
        to: "ACEITA"
        trigger: "aceitar_bolsa"
        guard: "role == Bolsista AND prazo_aceite_nao_expirado == true"
        module: "M009"
        event_emitted: "BolsaAceita"

      - from: "AGUARDANDO_ACEITE"
        to: "RECUSADA"
        trigger: "recusar_bolsa"
        guard: "role == Bolsista"
        module: "M009"
        event_emitted: "BolsaRecusada"

      - from: "AGUARDANDO_ACEITE"
        to: "CANCELADA"
        trigger: "cancelar_oferta"
        guard: "role == GestorFinanceiro OR prazo_aceite_expirado == true"
        module: "M009"

      # --- Documentação ---
      - from: "ACEITA"
        to: "DOCUMENTACAO_PENDENTE"
        trigger: "solicitar_documentacao"
        guard: "role == GestorFinanceiro"
        module: "M009"

      - from: "DOCUMENTACAO_PENDENTE"
        to: "DOCUMENTACAO_ANALISADA"
        trigger: "enviar_documentos"
        guard: "role == Bolsista AND documentos_obrigatorios_enviados == true"
        module: "M009"
        event_emitted: "DocumentosEnviados"

      - from: "DOCUMENTACAO_PENDENTE"
        to: "CANCELADA"
        trigger: "cancelar_por_prazo_documentacao"
        guard: "prazo_documentacao_expirado == true"
        module: "M009"

      # --- Análise e publicação ---
      - from: "DOCUMENTACAO_ANALISADA"
        to: "PUBLICADA"
        trigger: "publicar_bolsa"
        guard: "role == GestorFinanceiro AND documentos_aprovados == true AND termo_compromisso.status == ASSINADO"
        module: "M009"
        event_emitted: "BolsaPublicada"

      - from: "DOCUMENTACAO_ANALISADA"
        to: "DOCUMENTACAO_PENDENTE"
        trigger: "devolver_documentacao"
        guard: "role == GestorFinanceiro AND pendencias_documentais != null"
        module: "M009"

      # --- Implementação ---
      - from: "PUBLICADA"
        to: "IMPLEMENTADA"
        trigger: "implementar_bolsa"
        guard: "role == GestorFinanceiro AND primeiro_pagamento_processado == true"
        module: "M009"
        event_emitted: "BolsaImplementada"

      # --- Suspensão ---
      - from: "IMPLEMENTADA"
        to: "SUSPENSA"
        trigger: "suspender_bolsa"
        guard: "role == GestorFinanceiro AND motivo_suspensao != null"
        module: "M009"
        event_emitted: "BolsaSuspensa"

      - from: "SUSPENSA"
        to: "IMPLEMENTADA"
        trigger: "reativar_bolsa"
        guard: "role == GestorFinanceiro AND motivo_suspensao_sanado == true"
        module: "M009"
        event_emitted: "BolsaReativada"

      # --- Encerramento e conclusão ---
      - from: "IMPLEMENTADA"
        to: "CONCLUIDA"
        trigger: "concluir_bolsa"
        guard: "data_fim_vigencia <= hoje AND relatorio_final_aprovado == true"
        module: "M009"
        event_emitted: "BolsaConcluida"

      - from: ["IMPLEMENTADA", "SUSPENSA"]
        to: "ENCERRADA"
        trigger: "encerrar_bolsa_antecipado"
        guard: "role == GestorFinanceiro AND motivo_encerramento != null"
        module: "M009"
        event_emitted: "BolsaEncerrada"

      # --- Cancelamentos ---
      - from: ["ACEITA", "DOCUMENTACAO_PENDENTE", "DOCUMENTACAO_ANALISADA", "PUBLICADA"]
        to: "CANCELADA"
        trigger: "cancelar_bolsa"
        guard: "role == GestorFinanceiro AND justificativa_cancelamento != null"
        module: "M009"
        event_emitted: "BolsaCancelada"

  TermoCompromisso:
    description: "Fluxo de assinatura multi-parte do TermoCompromisso do bolsista."
    entity: "post_award.bolsas.TermoCompromisso"
    initial_state: "PENDENTE_ASSINATURA"
    final_states: [ASSINADO, RECUSADO]

    states:
      - name: "PENDENTE_ASSINATURA"
        description: "Termo gerado; aguardando assinaturas de todas as partes."
      - name: "PARCIALMENTE_ASSINADO"
        description: "Pelo menos uma parte assinou; aguardando demais signatários."
      - name: "ASSINADO"
        description: "Todas as partes assinaram; termo válido."
      - name: "RECUSADO"
        description: "Uma ou mais partes recusaram a assinatura."

    transitions:
      - from: "PENDENTE_ASSINATURA"
        to: "PARCIALMENTE_ASSINADO"
        trigger: "assinar_termo"
        guard: "signatario_autorizado == true AND nao_assinou_ainda == true"
        module: "M009"
        integration: "integrations.edocs"

      - from: "PARCIALMENTE_ASSINADO"
        to: "ASSINADO"
        trigger: "assinar_termo"
        guard: "todas_partes_assinaram == true"
        module: "M009"
        integration: "integrations.edocs"
        event_emitted: "TermoAssinado"

      - from: ["PENDENTE_ASSINATURA", "PARCIALMENTE_ASSINADO"]
        to: "RECUSADO"
        trigger: "recusar_assinatura"
        module: "M009"
        integration: "integrations.edocs"

events:
  - name: "BolsaAceita"
    description: "Bolsista aceitou a oferta de bolsa."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

  - name: "BolsaRecusada"
    description: "Bolsista recusou a oferta de bolsa."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

  - name: "DocumentosEnviados"
    description: "Bolsista enviou toda a documentação exigida."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

  - name: "TermoAssinado"
    description: "TermoCompromisso assinado por todas as partes."
    source_module: "M009"
    payload: "post_award.bolsas.TermoCompromisso"

  - name: "BolsaPublicada"
    description: "Bolsa publicada formalmente; vigência iniciada."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

  - name: "BolsaImplementada"
    description: "Primeiro pagamento processado; bolsa em plena execução."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

  - name: "BolsaSuspensa"
    description: "Bolsa suspensa temporariamente."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

  - name: "BolsaReativada"
    description: "Bolsa reativada após suspensão."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

  - name: "BolsaConcluida"
    description: "Bolsa concluída normalmente ao fim da vigência."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

  - name: "BolsaEncerrada"
    description: "Bolsa encerrada antecipadamente."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

  - name: "BolsaCancelada"
    description: "Bolsa cancelada antes da implementação."
    source_module: "M009"
    payload: "post_award.bolsas.BolsaPesquisa"

agent_instructions:
  rules:
    - "Não criar entidades fora da ontologia."
    - "Toda spec deve respeitar axioms definidos nos módulos de domínio."
    - "BolsaPesquisa só pode ser PUBLICADA após TermoCompromisso.status == ASSINADO."
    - "Pagamentos mensais só são gerados para bolsas no estado IMPLEMENTADA."
    - "CANCELADA é estado terminal; não há retorno de CANCELADA."
    - "RECUSADA é estado terminal; sistema deve oferecer a bolsa ao próximo candidato na lista."
    - "Documentos são armazenados via integrations.edocs; referências salvas em M009."
  notes:
    - "Assinatura do TermoCompromisso usa integração com eDocs (integrations/edocs.yaml)."
    - "Identidade do bolsista é obtida via PessoaFisica (M008) autenticada via AcessoCidadao."
    - "Currículo Lattes do bolsista pode ser vinculado via integrations/lattes.yaml."

```
