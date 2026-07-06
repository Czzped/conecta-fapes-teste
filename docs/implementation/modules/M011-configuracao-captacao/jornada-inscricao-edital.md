# Jornada de Inscrição em Edital Aberto

## Visão Geral

Esta jornada descreve o fluxo do **proponente/pesquisador** ao se inscrever em um edital (captação) publicado pela agência de fomento. A jornada cobre desde a descoberta do edital até a submissão da proposta.

## Pré-condições

- Edital publicado e com submissões abertas (status `ABERTA_PARA_SUBMISSAO`)
- Proponente autenticado no sistema com perfil de pesquisador/proponente
- Dados cadastrais do proponente completos

## Fluxo Principal

### 1. Encontrar o Edital
- Acessar a seção de editais abertos no sistema
- Visualizar lista de editais disponíveis com filtros por:
  - Área de conhecimento
  - Tipo de fomento
  - Prazo de submissão
- Clicar no edital desejado para ver detalhes completos

### 2. Visualizar Detalhes do Edital
- Informações gerais: objeto, vigência, modalidades
- Requisitos e critérios de participação
- Documentos obrigatórios
- Cronograma completo (etapas e prazos)
- Formulário de submissão vinculado ao edital

### 3. Iniciar Proposta
- Clicar em "Inscrever-se" ou "Submeter Proposta"
- Sistema cria uma proposta vinculada ao proponente e ao edital
- Status inicial: `EM_ELABORACAO`

### 4. Preencher Proposta
Dados da proposta:
- Dados básicos da pesquisa/projeto
- Equipe envolvida
- Orçamento e cronograma
- Anexar documentos obrigatórios
- Responder formulário dinâmico vinculado ao edital

### 5. Validação e Revisão
- Validações automáticas: campos obrigatórios, documentos, regras do edital
- Proponente pode salvar rascunho e retomar depois
- Visualização completa da proposta antes da submissão

### 6. Submeter Proposta
- Confirmação final com ciência das regras do edital
- Submissão: proposta transita para `SUBMETIDA`
- Prazo de submissão é respeitado (bloqueio automático após fechamento)
- Confirmação exibida ao proponente

### 7. Acompanhamento Pós-Submissão
- Visualizar status da proposta (em análise, aprovada, reprovada, pendente)
- Notificações sobre mudanças de status
- Possibilidade de solicitar revisão/resposta se previsto no edital

## Regras de Negócio

- Submissão permitida apenas dentro do período de `ABERTA_PARA_SUBMISSAO`
- Proposta só pode ser editada enquanto estiver `EM_ELABORACAO`
- Após submetida, proposta não pode ser alterada
- Se o edital fechar antes da submissão, rascunhos não submetidos são perdidos

## Atores

| Ator | Papel |
|------|-------|
| Proponente/Pesquisador | Executa a inscrição e submissão da proposta |
| Sistema ConectaFAPES | Orquestra o fluxo, valida regras e registra dados |

## Estados da Proposta

- `EM_ELABORACAO` — Proponente está preenchendo (rascunho)
- `SUBMETIDA` — Proposta enviada dentro do prazo
- `EM_ANALISE` — Em avaliação pela área técnica
- `APROVADA` / `REPROVADA` — Resultado da avaliação

## Relacionamento com Outros Módulos

| Módulo | Relação |
|--------|---------|
| M011 — Configuração de Captação | Edital configurado, submissão gerenciada |
| M012 — Acompanhamento de Resultados | Proposta aprovada transita para acompanhamento |
| M022 — Contratação/Outorga | Proposta aprovada segue para contratação |