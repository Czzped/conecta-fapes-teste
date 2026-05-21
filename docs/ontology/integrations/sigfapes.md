# Integracao — SIGFAPES

```yaml
ontology: "Integração SIGFAPES — ConectaFAPES"
namespace: "integrations.sigfapes"

imports: []

metadata:
  type: "integration"
  version: "1.0.0"
  description: "Importação de dados legados do SIGFAPES via arquivos parquet depositados em S3."
  modules_using: [M002]
  direction: "inbound"
  note: "Integração unidirecional de leitura. O SIGFAPES é o sistema legado e não recebe dados do ConectaFAPES."

integration:
  system: "SIGFAPES"
  system_description: "Sistema de Informação e Gestão de Fomento — sistema legado da FAPES"
  direction: "inbound"
  protocol: "parquet/S3"
  authentication: "AWS IAM Role (bucket policy)"
  base_url: "todo: configure per environment"

  data_flow:
    - step: 1
      actor: "SIGFAPES"
      action: "Exporta dados em arquivos parquet"
      destination: "S3 bucket (bucket configurado por ambiente)"
      frequency: "Diário — horário a definir em operação"

    - step: 2
      actor: "ConectaFAPES (M002)"
      action: "Job de importação lê arquivos novos do S3"
      trigger: "Agendamento (cron) ou evento S3 PutObject"

    - step: 3
      actor: "ConectaFAPES (M002)"
      action: "Transforma e carrega dados no modelo ConectaFAPES"
      result: "Entidades criadas ou atualizadas via match-or-create"

  endpoints:
    - path: "s3://{bucket}/sigfapes/editais/*.parquet"
      method: "S3_GET"
      description: "Dados de editais/captações do SIGFAPES"
      used_by: "M002.ImportJob.editais"

    - path: "s3://{bucket}/sigfapes/projetos/*.parquet"
      method: "S3_GET"
      description: "Dados de projetos/iniciativas do SIGFAPES"
      used_by: "M002.ImportJob.projetos"

    - path: "s3://{bucket}/sigfapes/bolsistas/*.parquet"
      method: "S3_GET"
      description: "Dados de bolsistas do SIGFAPES"
      used_by: "M002.ImportJob.bolsistas"

    - path: "s3://{bucket}/sigfapes/pagamentos/*.parquet"
      method: "S3_GET"
      description: "Histórico de pagamentos do SIGFAPES"
      used_by: "M002.ImportJob.pagamentos"

data_mappings:
  - external_entity: "SIGFAPES.Edital"
    internal_entity: "pre_award.captacao.Captacao"
    mapping_notes: "Editais importados são criados como Captacao com status HISTORICO; não entram no fluxo ativo."

  - external_entity: "SIGFAPES.Projeto"
    internal_entity: "post_award.iniciativas.Iniciativa"
    mapping_notes: "Projetos históricos importados como Iniciativa com status ENCERRADA ou HISTORICO."

  - external_entity: "SIGFAPES.Bolsista"
    internal_entity: "corporativo.pessoas.PessoaFisica"
    mapping_notes: "Bolsistas identificados por CPF; match-or-create via M008. Dados são enriquecidos, não substituídos."

  - external_entity: "SIGFAPES.Pagamento"
    internal_entity: "financeiro.pagamento.FolhaPagamento"
    mapping_notes: "Pagamentos históricos importados como somente leitura; não geram remessas."

import_job:
  entity: "M002.ImportJob"
  states: [PENDENTE, EM_EXECUCAO, CONCLUIDO, FALHA]
  idempotency: "Cada arquivo S3 é processado exatamente uma vez (controle por checksum/etag)"
  error_handling: "Falhas são registradas com stack trace; job pode ser reexecutado manualmente"

agent_instructions:
  rules:
    - "Não criar integrações fora deste arquivo."
    - "Toda integração deve ter data_mappings definidos."
    - "Dados importados do SIGFAPES são somente leitura após importação; não reverter para SIGFAPES."
    - "match-or-create em M008 garante unicidade de PessoaFisica por CPF."
    - "ImportJob deve ser idempotente — reprocessar o mesmo arquivo não duplica dados."
  notes:
    - "Credenciais AWS configuradas via variável de ambiente ou IAM role (não hardcoded)."
    - "Formato parquet pode variar por versão do SIGFAPES; schema validation antes do carregamento."
    - "todo: definir estratégia de reconciliação quando SIGFAPES tem dado divergente do ConectaFAPES."

```
