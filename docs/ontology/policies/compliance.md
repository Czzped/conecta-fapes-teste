# Policy — Compliance

```yaml
ontology: "Compliance — ConectaFAPES"
namespace: "policies.compliance"

imports:
  - namespace: "shared.people"
    path: "../shared/people.yaml"
  - namespace: "financeiro.saldo"
    path: "../../implementation/modules/M013-gestao-orcamentaria-projeto/ontology.yaml"
  - namespace: "financeiro.prestacao_contas"
    path: "../../implementation/modules/M014-prestacao-contas/ontology.yaml"
  - namespace: "financeiro.aml"
    path: "../../implementation/modules/M017-prevencao-lavagem-dinheiro/ontology.yaml"

metadata:
  type: "cross-cutting-policy"
  version: "1.0.0"
  description: "Regras de conformidade transversais: auditoria, validação fiscal, AML, LGPD e invariantes orçamentários."
  modules_covered: [M003, M004, M008, M013, M014, M017]

compliance_rules:

  auditoria:
    name: "Auditoria de Operações"
    description: "Toda operação de escrita deve gerar registro auditável permanente."
    applies_to: "all_modules"
    mechanism: "Auditavel mixin (campo audit_log em cada entidade raiz)"

    rules:
      - id: "AUD-001"
        description: "Toda mutação de estado em qualquer entidade raiz deve registrar: actor, timestamp, estado_anterior, estado_novo, motivo."
        severity: "critical"
        enforcement: "obrigatório"

      - id: "AUD-002"
        description: "Logs de auditoria são imutáveis; não há operação de delete ou update em registros de auditoria."
        severity: "critical"
        enforcement: "obrigatório"

      - id: "AUD-003"
        description: "Acesso a dados sensíveis (PessoaFisica, dados bancários) deve ser registrado mesmo sem mutação."
        severity: "high"
        enforcement: "obrigatório"

      - id: "AUD-004"
        description: "Logs devem ser exportáveis para auditores externos em formato JSON ou CSV."
        severity: "medium"
        enforcement: "recomendado"

  prestacao_contas:
    name: "Conformidade Fiscal — Prestação de Contas"
    description: "Regras de conformidade para comprovação de despesas com recursos públicos."
    applies_to: "M014"
    integration: "integrations.serpro"

    rules:
      - id: "PC-001"
        description: "Toda despesa classificada em TransacaoFinanceira deve ter comprovante validado."
        severity: "critical"
        enforcement: "obrigatório"

      - id: "PC-002"
        description: "NF-e deve ser validada via SERPRO antes de ser aceita como comprovante de despesa."
        severity: "critical"
        enforcement: "obrigatório"

      - id: "PC-003"
        description: "Recibos de autônomo requerem validação adicional (CPF do prestador via Receita Federal)."
        severity: "high"
        enforcement: "obrigatório"
        note: "Integração com Receita Federal não implementada; usar validação manual como fallback."

      - id: "PC-004"
        description: "Despesas devem estar dentro das rubricas previstas no PlanoTrabalho aprovado."
        severity: "high"
        enforcement: "obrigatório"
        module: "M003"

      - id: "PC-005"
        description: "Prazo para submissão de prestação periódica: até 30 dias após fim do período de referência."
        severity: "medium"
        enforcement: "soft — gera alerta, não bloqueia"

  aml:
    name: "Anti-Money Laundering (AML)"
    description: "Monitoramento de transações financeiras para prevenção à lavagem de dinheiro."
    applies_to: "M017"
    framework: "Lei 9.613/1998 e normas COAF"

    rules:
      - id: "AML-001"
        description: "Transações acima de R$ 10.000 devem ser monitoradas e registradas em M017."
        severity: "critical"
        enforcement: "obrigatório"
        threshold_brl: 10000

      - id: "AML-002"
        description: "Pagamentos fracionados que somem R$ 10.000 no mesmo mês devem acionar alerta."
        severity: "critical"
        enforcement: "obrigatório"

      - id: "AML-003"
        description: "Beneficiários em listas restritivas (PEP, sanções) não podem receber pagamentos."
        severity: "critical"
        enforcement: "obrigatório"
        source_lists: ["COAF", "OFAC", "UN_SANCTIONS"]

      - id: "AML-004"
        description: "Alertas AML devem ser revisados por GestorFinanceiro em até 48h úteis."
        severity: "high"
        enforcement: "recomendado"

  lgpd:
    name: "LGPD — Lei Geral de Proteção de Dados"
    description: "Conformidade com a Lei 13.709/2018 para dados pessoais de pesquisadores e bolsistas."
    applies_to: [M008, M009, M011]
    law: "Lei 13.709/2018"

    rules:
      - id: "LGPD-001"
        description: "Dados de PessoaFisica devem ter base legal explícita (contrato, obrigação legal ou consentimento)."
        severity: "critical"
        enforcement: "obrigatório"
        status: "TODO — rastreamento de consentimento não implementado em modelo-estrutural"

      - id: "LGPD-002"
        description: "PessoaFisica tem direito à portabilidade e exclusão de dados pessoais não obrigatórios por lei."
        severity: "high"
        enforcement: "obrigatório"
        status: "TODO — endpoints de portabilidade/exclusão não especificados"

      - id: "LGPD-003"
        description: "Dados sensíveis (saúde, biometria) requerem consentimento explícito e armazenamento segregado."
        severity: "critical"
        enforcement: "obrigatório"
        note: "ConectaFAPES não coleta dados de saúde; vigilância preventiva."

      - id: "LGPD-004"
        description: "Logs de acesso a dados pessoais devem ser mantidos por no mínimo 5 anos."
        severity: "high"
        enforcement: "obrigatório"

      - id: "LGPD-005"
        description: "Dados de candidatos reprovados em captações devem ser anonimizados após 2 anos."
        severity: "medium"
        enforcement: "recomendado"
        status: "TODO"

  budget_invariants:
    name: "Invariantes Orçamentários"
    description: "Invariantes financeiros críticos derivados de M013 (saldo)."
    applies_to: "M013"

    invariants:
      - id: "INV-SLD1"
        description: "Saldo disponível de uma conta corrente de iniciativa nunca pode ser negativo."
        formula: "saldo_disponivel = saldo_total - provisoes_ativas >= 0"
        severity: "critical"
        enforcement: "obrigatório — bloqueia aprovação de folha se violado"

      - id: "INV-SLD2"
        description: "Total de provisões ativas não pode exceder o saldo total da conta."
        formula: "sum(provisoes_ativas.valor) <= conta_corrente.saldo_total"
        severity: "critical"
        enforcement: "obrigatório"

      - id: "INV-SLD3"
        description: "Rubrica de despesa deve existir no PlanoTrabalho vigente e ter saldo de rubrica suficiente."
        severity: "high"
        enforcement: "obrigatório"
        module: "M003"

  data_retention:
    name: "Retenção de Dados"
    description: "Prazos mínimos de retenção de dados conforme legislação pública."

    rules:
      - id: "RET-001"
        entity: "Iniciativa e documentos vinculados"
        retention_years: 10
        law: "Lei 8.159/1991 (Lei de Arquivos)"

      - id: "RET-002"
        entity: "TermoOutorga, TermoCompromisso"
        retention_years: 20
        law: "Prescrição de atos administrativos"

      - id: "RET-003"
        entity: "FolhaPagamento, RemessaPagamento"
        retention_years: 10
        law: "Lei de Responsabilidade Fiscal"

      - id: "RET-004"
        entity: "Logs de auditoria"
        retention_years: 5
        note: "Extensível por decisão administrativa"

agent_instructions:
  rules:
    - "Não criar entidades fora da ontologia."
    - "Toda implementação deve verificar invariantes INV-SLD1 e INV-SLD2 antes de qualquer débito."
    - "Regras LGPD marcadas como TODO devem ser implementadas antes do go-live em produção."
    - "AML-001 e AML-002 devem ser checados em M004 no momento de aprovação de FolhaPagamento."
    - "Logs de auditoria (AUD-001) são responsabilidade do backend; não delegar ao frontend."
  notes:
    - "Auditoria implementada como mixin Auditavel nos modelos de domínio."
    - "AML detalhado em M017; integração e alertas a ser especificada."
    - "Validação SERPRO (PC-002) detalhada em integrations/serpro.yaml."

```
