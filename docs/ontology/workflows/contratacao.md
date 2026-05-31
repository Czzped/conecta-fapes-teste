# Workflow — Contratacao e Outorga

```yaml
ontology: "Workflow de Contratação (Outorga) — ConectaFAPES"
namespace: "workflows.contratacao"

imports:
  - namespace: "pre_award.contratacao"
    path: "../../implementation/modules/M022-contratacao-outorga/ontology.yaml"
  - namespace: "pre_award.captacao"
    path: "../../implementation/modules/M011-configuracao-captacao/ontology.yaml"
  - namespace: "post_award.iniciativas"
    path: "../../implementation/modules/M003-gestao-projetos-captados/ontology.yaml"

metadata:
  type: "cross-cutting-workflow"
  version: "1.0.0"
  description: "Formalização contratual da outorga entre FAPES e beneficiário aprovado em captação, gerando a Iniciativa no pós-award."
  modules_involved: [M022, M011, M003]

workflows:
  ContratacaoOutorga:
    description: "Processo de convocação e formalização do instrumento jurídico de outorga."
    entity: "pre_award.contratacao.ContratacaoOutorga"
    initial_state: "EM_CONVOCACAO"
    final_states: [FORMALIZADA, CANCELADA]

    states:
      - name: "EM_CONVOCACAO"
        description: "Beneficiário convocado para apresentar documentação e assinar o termo de outorga."
      - name: "EM_FORMALIZACAO"
        description: "Documentação recebida; processo jurídico de formalização em andamento."
      - name: "FORMALIZADA"
        description: "Termo de outorga assinado por todas as partes; contrato vigente."
      - name: "CANCELADA"
        description: "Processo cancelado antes da formalização."

    transitions:
      - from: "EM_CONVOCACAO"
        to: "EM_FORMALIZACAO"
        trigger: "aceitar_convocacao"
        guard: "role == Coordenador AND documentacao_habilitacao_entregue == true AND prazo_convocacao_nao_expirado == true"
        module: "M022"
        event_emitted: "ConvocacaoAceita"

      - from: "EM_CONVOCACAO"
        to: "CANCELADA"
        trigger: "cancelar_por_prazo_convocacao"
        guard: "prazo_convocacao_expirado == true"
        module: "M022"
        event_emitted: "ContratacaoCancelada"

      - from: "EM_CONVOCACAO"
        to: "CANCELADA"
        trigger: "cancelar_contratacao"
        guard: "role == GestorCaptacao AND justificativa != null"
        module: "M022"
        event_emitted: "ContratacaoCancelada"

      - from: "EM_FORMALIZACAO"
        to: "FORMALIZADA"
        trigger: "assinar_termo_outorga"
        guard: "assinaturas_fapes == true AND assinatura_beneficiario == true AND parecer_juridico_aprovado == true"
        module: "M022"
        integration: "integrations.edocs"
        event_emitted: "ContratacaoFormalizada"

      - from: "EM_FORMALIZACAO"
        to: "CANCELADA"
        trigger: "cancelar_formalizacao"
        guard: "role == GestorCaptacao AND justificativa != null"
        module: "M022"
        event_emitted: "ContratacaoCancelada"

  CriacaoIniciativa:
    description: "Criação automática da Iniciativa em M003 após formalização da outorga."
    trigger_event: "ContratacaoFormalizada"
    module: "M003"

    steps:
      - step: 1
        action: "criar_iniciativa"
        guard: "ContratacaoFormalizada recebido"
        result: "Iniciativa criada com status EM_IMPLANTACAO"
        event_emitted: "IniciativaCriada"

      - step: 2
        action: "vincular_plano_trabalho"
        guard: "plano_trabalho_presente_na_proposta == true"
        result: "PlanoTrabalho vinculado à Iniciativa"

      - step: 3
        action: "criar_conta_corrente"
        description: "Conta corrente da iniciativa criada em M013 para controle de saldo."
        module: "M013"

  TermoOutorga:
    description: "Geração e assinatura do documento TermoOutorga."
    entity: "pre_award.contratacao.TermoOutorga"
    initial_state: "MINUTA"
    final_states: [ASSINADO, CANCELADO]

    states:
      - name: "MINUTA"
        description: "Minuta do termo gerada a partir da proposta aprovada."
      - name: "EM_REVISAO_JURIDICA"
        description: "Minuta em análise pela equipe jurídica da FAPES."
      - name: "APROVADO_JURIDICAMENTE"
        description: "Texto aprovado pela área jurídica; pronto para assinatura."
      - name: "AGUARDANDO_ASSINATURAS"
        description: "Documento enviado para assinatura eletrônica das partes."
      - name: "ASSINADO"
        description: "Todas as assinaturas coletadas; documento com valor jurídico."
      - name: "CANCELADO"
        description: "Termo cancelado antes da assinatura completa."

    transitions:
      - from: "MINUTA"
        to: "EM_REVISAO_JURIDICA"
        trigger: "enviar_para_revisao_juridica"
        guard: "role == GestorCaptacao"
        module: "M022"

      - from: "EM_REVISAO_JURIDICA"
        to: "APROVADO_JURIDICAMENTE"
        trigger: "aprovar_minuta"
        guard: "role == Juridico"
        module: "M022"

      - from: "EM_REVISAO_JURIDICA"
        to: "MINUTA"
        trigger: "devolver_minuta"
        guard: "role == Juridico AND alteracoes_solicitadas != null"
        module: "M022"

      - from: "APROVADO_JURIDICAMENTE"
        to: "AGUARDANDO_ASSINATURAS"
        trigger: "enviar_para_assinatura"
        guard: "role == GestorCaptacao"
        module: "M022"
        integration: "integrations.edocs"

      - from: "AGUARDANDO_ASSINATURAS"
        to: "ASSINADO"
        trigger: "todas_assinaturas_coletadas"
        guard: "assinaturas_fapes == true AND assinatura_beneficiario == true"
        module: "M022"
        integration: "integrations.edocs"

      - from: ["MINUTA", "EM_REVISAO_JURIDICA", "APROVADO_JURIDICAMENTE", "AGUARDANDO_ASSINATURAS"]
        to: "CANCELADO"
        trigger: "cancelar_termo"
        guard: "role == GestorCaptacao"
        module: "M022"

events:
  - name: "ConvocacaoAceita"
    description: "Beneficiário aceitou a convocação e entregou documentação de habilitação."
    source_module: "M022"
    payload: "pre_award.contratacao.ContratacaoOutorga"

  - name: "ContratacaoFormalizada"
    description: "Termo de outorga assinado; instrumento contratual vigente. Dispara criação de Iniciativa em M003."
    source_module: "M022"
    payload: "pre_award.contratacao.ContratacaoOutorga"

  - name: "ContratacaoCancelada"
    description: "Processo de contratação cancelado antes da formalização."
    source_module: "M022"
    payload: "pre_award.contratacao.ContratacaoOutorga"

  - name: "IniciativaCriada"
    description: "Iniciativa criada em M003 como resultado da formalização."
    source_module: "M003"
    payload: "post_award.iniciativas.Iniciativa"

agent_instructions:
  rules:
    - "Não criar entidades fora da ontologia."
    - "Toda spec deve respeitar axioms definidos nos módulos de domínio."
    - "ContratacaoOutorga só é iniciada após PropostaAprovada emitido por M011."
    - "Iniciativa em M003 só é criada após ContratacaoFormalizada — nunca diretamente."
    - "TermoOutorga deve ser armazenado no eDocs com referência salva em M022."
    - "Cancelamento em qualquer estado não bloqueia nova contratação para o mesmo beneficiário em outra captação."
  notes:
    - "Assinatura eletrônica do TermoOutorga via integrations/edocs.yaml."
    - "Prazo de convocação é configurável por captacao (M011); padrão 30 dias corridos."
    - "Revisão jurídica pode ser suprimida para termos-padrão aprovados (flag no template)."

```
