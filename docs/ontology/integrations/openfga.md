# Integracao — OpenFGA

```yaml
ontology: "Integração OpenFGA — ConectaFAPES"
namespace: "integrations.openfga"

imports: []

metadata:
  type: "integration"
  version: "1.0.0"
  description: "Motor de autorização baseado em relacionamentos (ReBAC/RBAC) via OpenFGA. ConectaFAPES escreve tuplas de permissão e consulta autorização em runtime."
  modules_using: [M006]
  direction: "bidirectional"

integration:
  system: "OpenFGA"
  system_description: "Fine-grained authorization engine (open source, baseado no Zanzibar do Google)"
  direction: "bidirectional"
  protocol: "REST (gRPC opcional)"
  authentication: "API Key ou mTLS (configurar por ambiente)"
  base_url: "todo: configure per environment"

  endpoints:
    - path: "/stores/{store_id}/authorization-models"
      method: "POST"
      description: "Cria ou atualiza o modelo de autorização (schema DSL)."
      used_by: "M006.ModeloAutorizacao"

    - path: "/stores/{store_id}/authorization-models/{model_id}"
      method: "GET"
      description: "Lê o modelo de autorização ativo."
      used_by: "M006.ModeloAutorizacao"

    - path: "/stores/{store_id}/write"
      method: "POST"
      description: "Escreve ou remove tuplas de relacionamento (permissão)."
      used_by: "M006.TuplaPermissao"

    - path: "/stores/{store_id}/read"
      method: "POST"
      description: "Lê tuplas de relacionamento filtradas."
      used_by: "M006.TuplaPermissao"

    - path: "/stores/{store_id}/check"
      method: "POST"
      description: "Verifica se um usuário tem uma relação com um objeto (autorização)."
      used_by: "M006.AuthorizationCheck"

    - path: "/stores/{store_id}/expand"
      method: "POST"
      description: "Expande todas as relações de um objeto para debug/auditoria."
      used_by: "M006.AuthorizationExpand"

    - path: "/stores/{store_id}/list-objects"
      method: "POST"
      description: "Lista objetos para os quais um usuário tem uma relação específica."
      used_by: "M006.AuthorizationListObjects"

rbac_model:
  description: "Modelo de autorização OpenFGA para ConectaFAPES"

  types:
    - type: "user"
      description: "Usuário autenticado (PessoaFisica.id)"

    - type: "role"
      description: "Papel global do usuário no sistema."
      relations:
        - name: "member"
          description: "Usuário pertence a este role."

    - type: "iniciativa"
      description: "Recurso Iniciativa (M003)."
      relations:
        - name: "coordenador"
          description: "Usuário é coordenador desta iniciativa."
        - name: "viewer"
          description: "Usuário pode visualizar esta iniciativa."
        - name: "can_edit"
          description: "Usuário pode editar esta iniciativa."

    - type: "proposta"
      description: "Recurso Proposta (M011)."
      relations:
        - name: "proponente"
          description: "Usuário submeteu esta proposta."
        - name: "avaliador"
          description: "Usuário foi designado para avaliar esta proposta."

    - type: "bolsa"
      description: "Recurso BolsaPesquisa (M009)."
      relations:
        - name: "bolsista"
          description: "Usuário é o bolsista desta bolsa."

    - type: "captacao"
      description: "Recurso Captacao (M011)."
      relations:
        - name: "gestor"
          description: "Usuário é gestor desta captacao."
        - name: "avaliador"
          description: "Usuário é avaliador desta captação."

  example_tuples:
    - user: "user:abc123"
      relation: "member"
      object: "role:Coordenador"
      description: "Paulo é membro do role Coordenador"

    - user: "user:abc123"
      relation: "coordenador"
      object: "iniciativa:INI-2024-001"
      description: "Paulo é coordenador da iniciativa INI-2024-001"

    - user: "user:xyz789"
      relation: "avaliador"
      object: "proposta:PROP-2024-042"
      description: "Maria foi designada avaliadora da proposta PROP-2024-042"

tuple_lifecycle:
  creation:
    - event: "Usuário recebe role via admin"
      action: "Criar tupla user:{id} → member → role:{RoleName}"
      module: "M006"

    - event: "Coordenador é vinculado a Iniciativa"
      action: "Criar tupla user:{id} → coordenador → iniciativa:{id}"
      module: "M003"

    - event: "Avaliador designado em captação"
      action: "Criar tupla user:{id} → avaliador → proposta:{id}"
      module: "M011"
      note: "Tupla tem expiração — remover após homologação do resultado"

    - event: "Bolsa aceita por bolsista"
      action: "Criar tupla user:{id} → bolsista → bolsa:{id}"
      module: "M009"

  removal:
    - event: "Avaliação encerrada (resultado homologado)"
      action: "Remover tuplas de avaliador para todas as propostas da captação"
      module: "M011"

    - event: "Bolsa encerrada/cancelada"
      action: "Remover tupla bolsista → bolsa:{id}"
      module: "M009"

data_mappings:
  - external_entity: "OpenFGA.Tuple"
    internal_entity: "M006.TuplaPermissao"
    mapping_notes: "Tuplas são criadas/removidas pelo ConectaFAPES em resposta a eventos de domínio."

  - external_entity: "OpenFGA.AuthorizationModel"
    internal_entity: "M006.ModeloAutorizacao"
    mapping_notes: "Modelo versionado; nova versão criada apenas em mudanças de schema de autorização."

agent_instructions:
  rules:
    - "Não criar integrações fora deste arquivo."
    - "Toda integração deve ter data_mappings definidos."
    - "Verificação de autorização (check) deve ser feita no backend, nunca apenas no frontend."
    - "Tuplas de avaliador são temporárias; limpar após encerramento da captação."
    - "Modelo de autorização é versionado; não editar modelo ativo em produção diretamente."
    - "Toda criação/remoção de tupla deve ser registrada no log de auditoria (AUD-001)."
  notes:
    - "OpenFGA pode ser autogerenciado ou usar OpenFGA Cloud; configurar por ambiente."
    - "store_id é único por ambiente (dev/staging/prod); configurar via variável de ambiente."
    - "Modelo DSL completo a ser definido quando M006 for detalhado."

```
