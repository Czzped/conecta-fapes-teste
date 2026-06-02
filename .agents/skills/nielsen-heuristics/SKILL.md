---
name: nielsen-heuristics
description: Avalie ou projete interfaces do Conecta FAPES contra as 10 Heurísticas de Nielsen. Use ao revisar telas antes de merge, auditar formulários complexos, analisar mensagens de erro, avaliar feedback de estado, ou inspecionar fluxos multi-etapa como pagamento, prestação de contas e gestão de bolsas.
---

# Heurísticas de Nielsen para Interfaces do Conecta FAPES

Use esta skill quando a tarefa envolve avaliação de usabilidade, revisão de UI antes de merge, ou decisões de design de interação em `prototype/`, `portal-admin/`, ou `portal-bolsista/`.

## As 10 Heurísticas

### H1 — Visibilidade do Estado do Sistema

O sistema deve sempre informar o usuário sobre o que está acontecendo, em tempo razoável.

Aplicação no projeto:
- Formulários com múltiplos passos devem indicar etapa atual (ex.: wizard de cadastro de edital)
- Ações assíncronas (importação do Sigfapes, envio de pagamento) devem mostrar loading e confirmação de conclusão
- Status de bolsa (ativa, suspensa, encerrada) deve ser visível sem exigir navegação adicional

Sinais de violação:
- Botão de salvar sem feedback visual de sucesso/erro
- Upload de arquivo sem indicador de progresso
- Operação em lote sem log de resultado por item

### H2 — Correspondência entre Sistema e Mundo Real

O sistema deve falar a linguagem do usuário — palavras, frases e conceitos familiares ao domínio.

Aplicação no projeto:
- Usar termos do ubiquitous language do módulo (ex.: "Rubrica", "Edital", "Beneficiário") — nunca termos técnicos de banco ou código
- Labels de campo devem espelhar o vocabulário do glossário (`docs/discovery/glossario.md`)
- Sequência de etapas em fluxos deve seguir a ordem do processo real da FAPES

Sinais de violação:
- Campo chamado `id_modalidade_bolsa` visível ao usuário
- Status interno como `PENDING_APPROVAL` exibido sem tradução
- Ordem de campos que contradiz o fluxo do processo administrativo

### H3 — Controle e Liberdade do Usuário

Usuários cometem erros. Forneça saída de emergência clara — desfazer e refazer.

Aplicação no projeto:
- Formulários longos devem permitir salvar rascunho antes de submeter
- Exclusões e estornos devem pedir confirmação e descrever a consequência irreversível
- Navegação entre etapas de um wizard deve permitir voltar sem perder dados preenchidos

Sinais de violação:
- Modal de confirmação de exclusão sem descrição do que será excluído
- Wizard que perde dados ao clicar "Voltar"
- Nenhuma opção de cancelar uma operação em andamento

### H4 — Consistência e Padrões

Usuários não devem se perguntar se palavras, situações ou ações diferentes significam a mesma coisa.

Aplicação no projeto:
- Usar componentes do Nuxt UI de forma consistente — mesmo padrão de formulário, tabela, modal em todos os módulos
- Rótulos de ação devem ser uniformes: "Salvar" vs "Confirmar" vs "Enviar" — escolher um por contexto e manter
- Posição de botões primários (ex.: sempre à direita em modais) deve ser consistente

Sinais de violação:
- "Cancelar" em alguns modais e "Fechar" em outros para a mesma ação
- Tabelas com densidades de informação inconsistentes entre módulos
- Ícones sem significado fixo reutilizados para ações diferentes

### H5 — Prevenção de Erros

Melhor do que boas mensagens de erro é um design cuidadoso que evita o problema.

Aplicação no projeto:
- Campos de valor monetário com máscara e validação antes de submeter
- Seleção de rubrica deve filtrar apenas rubricas disponíveis para o edital em questão
- Datas de vigência devem ter picker com restrição de intervalo válido

Sinais de violação:
- Formulário aceita CNPJ inválido e só falha no backend
- Dropdown com todas as rubricas cadastradas, sem filtro por edital
- Campo livre para valor quando o domínio exige valor positivo com 2 casas decimais

### H6 — Reconhecimento em vez de Memorização

Minimize a carga de memória do usuário — opções, ações e objetos devem ser visíveis.

Aplicação no projeto:
- Em fluxos multi-etapa, resumir decisões anteriores no cabeçalho ou sidebar (ex.: "Edital: PE-2024-001 | Projeto: X")
- Labels de campos devem permanecer visíveis após preenchimento (floating label ou label acima)
- Filtros ativos em tabelas devem ser exibidos como chips removíveis

Sinais de violação:
- Usuário precisa lembrar o número do edital para preencher campo na etapa 3 de 5
- Label desaparece quando o campo recebe foco
- Filtro aplicado sem indicação visual de que está ativo

### H7 — Flexibilidade e Eficiência de Uso

Aceleradores — invisíveis para novatos — permitem que usuários experientes operem mais rápido.

Aplicação no projeto:
- Ações frequentes em tabelas devem ter atalho (botão de ação rápida na linha, sem precisar abrir modal)
- Relatórios recorrentes devem ter opção de salvar filtros como favorito
- Formulários de importação repetitiva devem suportar upload em lote

Sinais de violação:
- Gestor precisa clicar 5 vezes para aprovar um pagamento simples
- Sem paginação configurável em tabelas com centenas de registros
- Nenhum atalho de teclado em ações críticas de aprovação

### H8 — Design Estético e Minimalista

Interfaces não devem conter informação irrelevante ou raramente necessária.

Aplicação no projeto:
- Dashboards devem priorizar métricas de gestão — ocultar detalhes técnicos de auditoria por padrão
- Formulários devem mostrar apenas campos obrigatórios inicialmente, com expansão opcional para avançados
- Mensagens de sistema não devem expor stack trace ou IDs internos ao usuário final

Sinais de violação:
- Tabela com 15 colunas visíveis por padrão onde o usuário usa 4
- Campo `uuid` visível no formulário de edição
- Página de detalhe com informações de auditoria misturadas com dados operacionais

### H9 — Ajudar Usuários a Reconhecer, Diagnosticar e Recuperar de Erros

Mensagens de erro devem ser expressas em linguagem simples, indicar o problema e sugerir solução.

Aplicação no projeto:
- Erros de validação devem apontar o campo e descrever o valor esperado (ex.: "Data de início deve ser anterior à data de término")
- Erros de negócio devem ser traduzidos para o domínio (ex.: "Saldo insuficiente na rubrica — disponível: R$ 1.200,00")
- Falhas de integração (Sigfapes, Banestes) devem sugerir ação (ex.: "Tente novamente ou contate o suporte")

Sinais de violação:
- "Erro 422 Unprocessable Entity" exibido diretamente ao usuário
- Mensagem genérica "Ocorreu um erro" sem contexto ou próximo passo
- Validação de CPF falha sem indicar qual campo ou como corrigir

### H10 — Ajuda e Documentação

Mesmo que seja melhor não precisar de documentação, pode ser necessário fornecê-la.

Aplicação no projeto:
- Campos críticos (ex.: cálculo de saldo, regras de elegibilidade) devem ter tooltip ou ícone de ajuda com a regra de negócio resumida
- Fluxos novos devem ter onboarding contextual na primeira execução
- Mensagens de confirmação de operações irreversíveis devem descrever exatamente o que acontecerá

Sinais de violação:
- Campo "Valor de Contrapartida" sem explicação de como é calculado
- Nenhuma ajuda contextual no fluxo de prestação de contas
- Modal de exclusão de edital não descreve quais dados associados serão afetados

---

## Workflow de Avaliação

1. Identificar o fluxo ou tela a avaliar
2. Para cada heurística relevante, verificar se há violação
3. Classificar severidade: **Cosmético** / **Menor** / **Maior** / **Catastrófico**
4. Registrar como issue ou como critério de aceitação no EPIC afetado

## Quando usar esta skill

- Revisão de PR com mudanças de UI antes de merge
- Criação de critérios de aceitação em EPICs com componente de interface
- Auditoria de fluxos complexos: pagamento (M004), gestão de bolsa (M009), prestação de contas
- Avaliação de mensagens de erro geradas pelo backend antes de expô-las no frontend

## Complementa

- [`web-design-guidelines`](../../../SKILLS.md) — WCAG e acessibilidade
- [`nuxt-ui`](../../../SKILLS.md) — biblioteca de componentes (consistência H4)
- DDD skill — ubiquitous language no vocabulário da interface (H2)
