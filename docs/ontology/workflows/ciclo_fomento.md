# Workflow — Ciclo de Fomento

```yaml
ontology: "Ciclo de Fomento — ConectaFAPES"
namespace: "workflows.ciclo_fomento"

imports:
  - namespace: "planejamento.programa"
    path: "../../implementation/modules/M010-planejamento-estrategia/programas/ontology.yaml"
  - namespace: "pre_award.captacao"
    path: "../../implementation/modules/M011-configuracao-captacao/ontology.yaml"
  - namespace: "pre_award.contratacao"
    path: "../../implementation/modules/M022-contratacao-outorga/ontology.yaml"
  - namespace: "post_award.iniciativas"
    path: "../../implementation/modules/M003-gestao-projetos-captados/ontology.yaml"
  - namespace: "post_award.encerramento"
    path: "../../implementation/modules/M015-suspensao-finalizacao/ontology.yaml"

metadata:
  type: "cross-cutting-workflow"
  version: "1.0.0"
  description: "Ciclo de vida completo de um instrumento de fomento, desde o planejamento estratégico até o encerramento da iniciativa."
  modules_involved: [M010, M011, M022, M003, M015]

phases:
  - phase: "PLANEJAMENTO"
    module: "M010"
    namespace: "planejamento.programa"
    description: "Definição do Programa de fomento no planejamento estratégico da FAPES."
    states:
      - Programa.EM_PLANEJAMENTO
      - Programa.AGUARDANDO_APROVACAO
      - Programa.ATIVO

  - phase: "PRE_AWARD"
    module: "M011"
    namespace: "pre_award.captacao"
    description: "Publicação da captação (edital), submissão e avaliação de propostas."
    states:
      - Captacao.RASCUNHO
      - Captacao.PUBLICADO
      - Captacao.EM_AVALIACAO
      - Captacao.RESULTADO_HOMOLOGADO

  - phase: "CONTRATACAO"
    module: "M022"
    namespace: "pre_award.contratacao"
    description: "Convocação dos aprovados e formalização contratual."
    states:
      - ContratacaoOutorga.EM_CONVOCACAO
      - ContratacaoOutorga.EM_FORMALIZACAO
      - ContratacaoOutorga.FORMALIZADA

  - phase: "POST_AWARD"
    module: "M003"
    namespace: "post_award.iniciativas"
    description: "Execução da iniciativa (projeto/bolsa) financiada."
    states:
      - Iniciativa.EM_IMPLANTACAO
      - Iniciativa.ATIVA
      - Iniciativa.SUSPENSA

  - phase: "ENCERRAMENTO"
    module: "M015"
    namespace: "post_award.encerramento"
    description: "Finalização, prestação de contas final e arquivamento."
    states:
      - Iniciativa.EM_ENCERRAMENTO
      - Iniciativa.ENCERRADA

workflows:
  CicloFomento:
    description: "Orquestra as transições entre as cinco fases do ciclo de fomento da FAPES."
    initial_state: "Programa.EM_PLANEJAMENTO"
    final_states:
      - "Iniciativa.ENCERRADA"
      - "ContratacaoOutorga.CANCELADA"
      - "Captacao.REVOGADA"

    transitions:
      # --- PLANEJAMENTO → PRE_AWARD ---
      - from: "Programa.EM_PLANEJAMENTO"
        to: "Programa.ATIVO"
        trigger: "ativar_programa"
        guard: "Programa.aprovado_pela_diretoria == true"
        module: "M010"
        event_emitted: "ProgramaAtivado"

      - from: "Programa.ATIVO"
        to: "Captacao.PUBLICADO"
        trigger: "publicar_captacao"
        guard: "Captacao.vinculada_a_programa_ativo == true"
        module: "M011"
        event_emitted: "CaptacaoPublicada"

      # --- PRE_AWARD: avaliação ---
      - from: "Captacao.PUBLICADO"
        to: "Captacao.EM_AVALIACAO"
        trigger: "encerrar_submissoes"
        guard: "data_limite_submissao <= hoje"
        module: "M011"

      - from: "Captacao.EM_AVALIACAO"
        to: "Captacao.RESULTADO_HOMOLOGADO"
        trigger: "homologar_resultado"
        guard: "todas_propostas_avaliadas == true"
        module: "M011"
        event_emitted: "PropostaAprovada"

      # --- PRE_AWARD → CONTRATACAO ---
      - from: "Captacao.RESULTADO_HOMOLOGADO"
        to: "ContratacaoOutorga.EM_CONVOCACAO"
        trigger: "iniciar_contratacao"
        guard: "PropostaAprovada recebido"
        module: "M022"

      - from: "ContratacaoOutorga.EM_CONVOCACAO"
        to: "ContratacaoOutorga.EM_FORMALIZACAO"
        trigger: "aceitar_convocacao"
        module: "M022"

      - from: "ContratacaoOutorga.EM_FORMALIZACAO"
        to: "ContratacaoOutorga.FORMALIZADA"
        trigger: "assinar_termo_outorga"
        guard: "assinaturas_completas == true"
        module: "M022"
        event_emitted: "ContratacaoFormalizada"

      - from: "ContratacaoOutorga.EM_CONVOCACAO"
        to: "ContratacaoOutorga.CANCELADA"
        trigger: "cancelar_contratacao"
        module: "M022"

      # --- CONTRATACAO → POST_AWARD ---
      - from: "ContratacaoOutorga.FORMALIZADA"
        to: "Iniciativa.EM_IMPLANTACAO"
        trigger: "criar_iniciativa"
        guard: "ContratacaoFormalizada recebido"
        module: "M003"
        event_emitted: "IniciativaCriada"

      - from: "Iniciativa.EM_IMPLANTACAO"
        to: "Iniciativa.ATIVA"
        trigger: "ativar_iniciativa"
        guard: "plano_trabalho_aprovado == true"
        module: "M003"

      - from: "Iniciativa.ATIVA"
        to: "Iniciativa.SUSPENSA"
        trigger: "suspender_iniciativa"
        module: "M003"

      - from: "Iniciativa.SUSPENSA"
        to: "Iniciativa.ATIVA"
        trigger: "reativar_iniciativa"
        module: "M003"

      # --- POST_AWARD → ENCERRAMENTO ---
      - from: "Iniciativa.ATIVA"
        to: "Iniciativa.EM_ENCERRAMENTO"
        trigger: "iniciar_encerramento"
        guard: "prazo_execucao_encerrado == true OR solicitacao_encerramento_aprovada == true"
        module: "M015"

      - from: "Iniciativa.EM_ENCERRAMENTO"
        to: "Iniciativa.ENCERRADA"
        trigger: "concluir_encerramento"
        guard: "prestacao_contas_final_aprovada == true"
        module: "M015"
        event_emitted: "IniciativaEncerrada"

events:
  - name: "ProgramaAtivado"
    description: "Programa de fomento aprovado e ativado para receber captações."
    source_module: "M010"
    payload: "planejamento.programa.Programa"

  - name: "CaptacaoPublicada"
    description: "Edital/captação publicado e disponível para submissão de propostas."
    source_module: "M011"
    payload: "pre_award.captacao.Captacao"

  - name: "PropostaAprovada"
    description: "Proposta aprovada após avaliação; dispara fluxo de contratação."
    source_module: "M011"
    payload: "pre_award.captacao.Proposta"

  - name: "ContratacaoFormalizada"
    description: "Termo de outorga assinado; instrumento contratual vigente."
    source_module: "M022"
    payload: "pre_award.contratacao.ContratacaoOutorga"

  - name: "IniciativaCriada"
    description: "Iniciativa criada em M003 após formalização contratual."
    source_module: "M003"
    payload: "post_award.iniciativas.Iniciativa"

  - name: "IniciativaEncerrada"
    description: "Iniciativa encerrada após aprovação da prestação de contas final."
    source_module: "M015"
    payload: "post_award.iniciativas.Iniciativa"

agent_instructions:
  rules:
    - "Não criar entidades fora da ontologia."
    - "Toda spec deve respeitar axioms definidos nos módulos de domínio."
    - "O ciclo é sempre linear entre fases; retrocessos de fase requerem decisão explícita de gestão."
    - "Cancelamentos podem ocorrer em qualquer fase antes de POST_AWARD."
    - "Iniciativa só é criada após ContratacaoFormalizada — nunca diretamente de Proposta."
  notes:
    - "M015 (encerramento) ainda não está completamente especificado; fluxo de encerramento é preliminar."
    - "Suspensão de Iniciativa (M003) pode ser disparada por inadimplência financeira (M013/M004)."

```
