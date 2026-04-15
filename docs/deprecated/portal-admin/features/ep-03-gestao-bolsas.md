# EP-03 — Gestão de Bolsas

**Bounded Context:** GestaoBolsa
**Status:** Done
**Dependências:** EP-02 (CadastroModalidadesBolsas), EP-05 (ImportacaoEditais)

## Descrição

Permitir que gerentes de área técnica, coordenadores e administradores possam avaliar, aprovar e gerenciar bolsas acadêmicas, incluindo verificação de documentos, avaliação de voluntários e acompanhamento de pendências. O épico garante o controle completo do ciclo de vida das bolsas após a importação dos editais.

## Critérios de aceite

- Gerentes de área técnica podem visualizar e avaliar bolsas pendentes em suas áreas.
- Coordenadores podem visualizar e gerenciar bolsistas de seus projetos.
- Documentos podem ser enviados (apenas PDF, máx. 5MB), aprovados, reprovados ou ter revisão solicitada.
- Voluntários podem ser aprovados ou reprovados com justificativa.
- O sistema suporta controle de cotas por nível de bolsa.
- Consultas são paginadas e filtráveis por edital, projeto e status.
- Autenticação JWT com controle de acesso baseado em papéis (ADMIN, GERENTE_AREA_TECNICA, COORDENADOR, ORIENTADOR).

---

## Casos de Uso

### Autenticação e Autorização

```gherkin
Feature: Autenticação e Controle de Acesso
  Como sistema de gestão de bolsas
  Quero validar a identidade e permissões dos usuários
  Para garantir que apenas usuários autorizados executem operações

  Scenario: Extrair claims do token JWT
    Given um usuário com token JWT válido
    When o sistema extrai os claims
    Then obtém CPF, Nome e Email do usuário

  Scenario: Verificar papel de administrador
    Given um usuário autenticado com role "ADMIN"
    When verifico suas permissões
    Then o usuário tem acesso total a todas as áreas

  Scenario: Verificar papel de gerente de área técnica
    Given um usuário autenticado com role "GERENTE_ENGENHARIAS"
    When verifico suas permissões
    Then o usuário tem acesso apenas à área "Engenharias"

  Scenario: Negar acesso sem claims válidos
    Given um token JWT sem CPF, Nome ou Email
    When tento acessar uma operação
    Then o sistema retorna erro de autenticação
```

### Gestão de Documentos

```gherkin
Feature: Gestão de Documentos de Bolsistas
  Como gerente de área técnica
  Quero gerenciar documentos dos bolsistas
  Para validar requisitos de concessão de bolsa

  Background:
    Given que estou autenticado como gerente de área técnica ou administrador

  Scenario: Enviar documento (upload)
    When envio um documento com:
      | Campo       | Valor              |
      | Arquivo     | documento.pdf      |
      | ContentType | application/pdf    |
      | Tamanho     | < 5MB              |
    Then o documento é armazenado no object storage
    And o status muda para "ENVIADO"
    And metadados são registrados no sistema

  Scenario: Impedir upload de arquivo não-PDF
    When tento enviar um arquivo com ContentType "image/png"
    Then o sistema retorna erro "Apenas arquivos PDF são aceitos"

  Scenario: Impedir upload de arquivo maior que 5MB
    When tento enviar um arquivo com mais de 5MB
    Then o sistema retorna erro "Tamanho máximo do arquivo é 5MB"

  Scenario: Aprovar documento
    Given existe um documento com status "ENVIADO"
    When aprovo o documento
    Then o status muda para "APROVADO_MANUAL"

  Scenario: Reprovar documento
    Given existe um documento com status "ENVIADO"
    When reprovo o documento com justificativa "Documento ilegível"
    Then o status muda para "REPROVADO_MANUAL"

  Scenario: Solicitar revisão de documento
    Given existe um documento com status "ENVIADO"
    When solicito revisão com justificativa "Falta assinatura" (mín. 3 caracteres)
    Then o status muda para "PENDENTE_AVALIACAO"
    And um evento de revisão é publicado via MediatR

  Scenario: Impedir revisão sem justificativa válida
    When solicito revisão com justificativa "" (vazia)
    Then o sistema retorna erro "Justificativa é obrigatória (mínimo 3 caracteres)"

  Scenario: Download de documento
    Given existe um documento armazenado
    When solicito o download
    Then o sistema retorna o arquivo do object storage

  Scenario: Fluxo de processamento por IA
    Given existe um documento recém-enviado
    When o sistema processa via IA
    Then o status transita: ENVIADO → EM_PROCESSAMENTO → (APROVADO_IA | REPROVADO_IA | PENDENTE_AVALIACAO)
```

### Avaliação de Voluntários

```gherkin
Feature: Avaliação de Voluntários
  Como gerente de área técnica
  Quero avaliar solicitações de voluntariado
  Para aprovar ou reprovar candidatos a voluntário em projetos

  Background:
    Given que estou autenticado como gerente de área técnica ou administrador
    And o edital possui AnaliseDeVoluntario habilitado

  Scenario: Aprovar voluntário
    Given existe um voluntário com status "EM_AVALIACAO"
    When aprovo o voluntário
    Then o status muda para "ATIVA"
    And a DataUltimaMudancaDeStatus é atualizada

  Scenario: Reprovar voluntário com justificativa
    Given existe um voluntário com status "EM_AVALIACAO"
    When reprovo o voluntário com justificativa "Não atende aos requisitos"
    Then o status muda para "REPROVADA_AREA_TECNICA"
    And a DataUltimaMudancaDeStatus é atualizada

  Scenario: Impedir reprovação sem justificativa
    Given existe um voluntário com status "EM_AVALIACAO"
    When tento reprovar sem justificativa
    Then o sistema retorna erro "Justificativa é obrigatória"

  Scenario: Impedir avaliação de voluntário já avaliado
    Given existe um voluntário com status "ATIVA"
    When tento aprovar ou reprovar
    Then o sistema retorna erro "Voluntário não está em avaliação"

  Scenario: Verificar permissão de área
    Given um gerente da área "Engenharias"
    When tenta avaliar voluntário de um edital da área "Saúde"
    Then o sistema retorna erro de permissão

  Scenario: Listar voluntários pendentes (paginado)
    When consulto voluntários pendentes de avaliação
    Then o sistema retorna lista paginada filtrada por minha área
```

### Gestão de Cotas por Nível

```gherkin
Feature: Gestão de Cotas por Nível de Bolsa
  Como sistema de gestão de bolsas
  Quero controlar cotas de bolsa por nível
  Para garantir a correta distribuição de recursos por planejamento

  Scenario: Importar cotas por nível
    When importo cotas para um planejamento de alocação com:
      | Campo               | Valor                    |
      | VersaoNivelId       | <guid-versão-nível>      |
      | PlanejamentoAlocacaoId | <guid-planejamento>   |
      | Quantidade          | 10                       |
    Then as cotas são registradas ou incrementadas

  Scenario: Incrementar cotas existentes
    Given já existem cotas para o mesmo VersaoNivel e Planejamento
    When importo mais cotas
    Then a quantidade é incrementada no registro existente

  Scenario: Cotas com redução
    When importo cotas com flag de redução
    Then o sistema registra a redução no controle de cotas
```

### Visualização de Pendências (Área Técnica)

```gherkin
Feature: Visualizar Pendências da Área Técnica
  Como gerente de área técnica
  Quero visualizar bolsas pendentes de avaliação
  Para acompanhar e processar as pendências da minha área

  Background:
    Given que estou autenticado como gerente de área técnica ou administrador

  Scenario: Visualizar bolsas pendentes (dashboard)
    When acesso o painel de pendências
    Then vejo a lista paginada de bolsas pendentes
    And os status exibidos são: EM_AVALIACAO, DOCUMENTACAO_PENDENTE, PENDENTE_DE_AVALIACAO
    And a ordenação prioriza: EM_AVALIACAO (1) > DOCUMENTACAO_PENDENTE (2) > PENDENTE_DE_AVALIACAO (3)

  Scenario: Visualizar estatísticas mensais
    When consulto as estatísticas do mês
    Then vejo a contagem de bolsas aprovadas e reprovadas no mês

  Scenario: Filtrar por edital e projeto
    When filtro as pendências por edital e/ou projeto
    Then a lista é filtrada de acordo com os critérios

  Scenario: Administrador visualiza todas as áreas
    Given estou autenticado como ADMIN
    When acesso o painel de pendências
    Then vejo pendências de todas as áreas técnicas
```

### Visualização de Projetos (Coordenador)

```gherkin
Feature: Visualizar Projetos do Coordenador
  Como coordenador de projeto
  Quero visualizar as bolsas do meu projeto
  Para acompanhar o status dos bolsistas

  Background:
    Given que estou autenticado como coordenador atual do projeto

  Scenario: Listar bolsas por projeto (paginado)
    When acesso a lista de bolsas do meu projeto
    Then vejo a lista paginada (máx. 100 por página)
    And posso filtrar por status da bolsa

  Scenario: Impedir acesso de não-coordenador
    Given não sou o coordenador atual do projeto
    When tento acessar a lista de bolsas
    Then o sistema retorna erro de permissão

  Scenario: Verificar coordenador atual
    Given o projeto possui múltiplos coordenadores históricos
    When verifico permissão de acesso
    Then apenas o coordenador com CoordenadorAtual=true tem acesso
```
