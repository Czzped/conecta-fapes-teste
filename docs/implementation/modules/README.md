# Módulos — Conecta FAPES

O backend do Conecta FAPES é organizado em 24 módulos, cada um responsável por um bounded context distinto. Cada módulo tem seu próprio modelo de domínio, contrato de API e backlog de épicos. As dependências entre módulos são explícitas e direcionadas — módulos downstream referenciam entidades de upstream via FK, nunca o contrário.

---

## Cadastros e Identidade

| Módulo | Nome | Resumo |
|--------|------|--------|
| [M005](M005-autenticacao/README.md) | Autenticação | SSO via Acesso Cidadão (governo ES). Ponto único de autenticação para todos os produtos. |
| [M006](M006-autorizacao/README.md) | Autorização | Políticas de acesso granular via OpenFGA. Operacionalizado pelo AuthRix, PDP interno consumido por todos os portais. Resolve o problema de permissões rígidas que bloqueiam processos quando responsáveis estão ausentes. |
| [M007](M007-api-gateway/README.md) | API Gateway | Roteamento centralizado, rate limiting e autenticação unificada para todos os serviços. Reduz a superfície de ataque e aplica políticas de segurança consistentes. |
| [M008](M008-cadastros-corporativos/README.md) | Cadastros Corporativos | Fonte canônica de pessoas físicas (por CPF), instituições (por CNPJ), unidades organizacionais hierárquicas, responsáveis com vínculo temporal, áreas de conhecimento CNPq, rubricas financeiras, dados geográficos e tabelas de diárias. Todos os outros módulos referenciam entidades daqui. |

---

## Planejamento e Captação (Pré-Award)

| Módulo | Nome | Resumo |
|--------|------|--------|
| [M010](M010-planejamento-estrategia/README.md) | Planejamento e Estratégia | Planos estratégicos com vigência controlada, programas vinculados a eixos estratégicos, e parcerias com aportes financeiros. Gerencia o fluxo de recursos desde o aporte até a alocação em programas, com cálculo de taxa de gestão e reserva para ação transversal. |
| [M011](M011-configuracao-captacao/README.md) | Configuração de Captação | Configuração e publicação de editais de chamadas públicas. Controla cronograma com 8 etapas obrigatórias, avaliação documental e ad hoc, gestão de recursos, publicação de resultados e transição para M022. |
| [M021](M021-gestao-formularios/README.md) | Gestão de Formulários | Definições reutilizáveis de formulários para submissão de propostas e avaliação. Versões publicadas são imutáveis. Evita criação redundante e garante padronização entre editais. |

---

## Execução (Pós-Award)

| Módulo | Nome | Resumo |
|--------|------|--------|
| [M003](M003-gestao-projetos-captados/README.md) | Gestão de Projetos Captados | Execução de projetos após contratação. Consolida equipe, cronograma, orçamento planejado e executado, versões de planejamento, e solicitações operacionais (diárias, liberações parciais). Não gerencia editais nem bolsas — integra com M011, M009 e M014. |
| [M013](M013-gestao-orcamentaria-projeto/README.md) | Gestão Orçamentária do Projeto | Planejamento e movimentação do orçamento durante a execução. Controla adições, inclusão de novas rubricas, remanejamento entre rubricas (limitado a 25% sem aprovação da diretoria) e remanejamento de bolsas. Saldo canônico: Total = Alocado + Consumido + Disponível. |
| [M022](M022-contratacao-outorga/README.md) | Contratação e Outorga | Formalização de termos de outorga ou contrato para propostas aprovadas em M011. Cria iniciativas em M003 somente após formalização. Registra data de outorga e beneficiário. |
| [M015](M015-suspensao-finalizacao/README.md) | Suspensão e Finalização | Workflows estruturados para suspensão temporária e encerramento definitivo de iniciativas. Encerramento é irreversível e requer pré-condições: todas as prestações de contas aprovadas (M014) e todas as bolsas encerradas (M009). |

---

## Bolsas

| Módulo | Nome | Resumo |
|--------|------|--------|
| [M001](M001-modalidade-bolsa/README.md) | Modalidades de Bolsas | Criação e manutenção de modalidades, níveis e requisitos vinculados a resoluções da agência. Versões publicadas são imutáveis. Controla compatibilidade para bolsas cumulativas e rastreabilidade entre modalidade aprovada e projeto financiado. |
| [M009](M009-gestao-bolsista/README.md) | Gestão Bolsa Pesquisa | Ciclo de vida completo da bolsa: indicação, assinatura do orientador, avaliação documental, geração do termo com 5 assinaturas, publicação em diário oficial, implementação, renovação, suspensão e encerramento. Controla cotas, saldos de rubricas e impede bolsas simultâneas salvo modalidades cumulativas definidas. |
| [M004](M004-pagamento-bolsista/README.md) | Pagamento de Bolsistas | Geração automatizada de folha de pagamento de bolsas integrada com Banestes e BANDES. Opera em ciclos mensais com três marcos (prazo de solicitação, geração da folha, data de pagamento). Folha gerada não pode ser alterada; cancelamento exige aprovação prévia com análise de impacto. |

---

## Financeiro e Prestação de Contas

| Módulo | Nome | Resumo |
|--------|------|--------|
| [M014](M014-prestacao-contas/README.md) | Prestação de Contas | Digitalização do processo de prestação de contas financeira. Coordenadores vinculam movimentações bancárias, registram justificativas de gasto (notas fiscais, diárias, passagens, produtos sem NF), classificam itens contra rubricas e submetem para análise técnica. Validação de NF eletrônica via API SERPRO. Estados imutáveis durante análise. |
| [M016](M016-contabilidade-financeiro/README.md) | Contabilidade e Financeiro | Plano de contas, movimentações financeiras, conciliação bancária periódica, fluxo de caixa, e gestão da reserva de ação transversal recebida de M010. Separa contabilidade institucional da prestação de contas por iniciativa (M014). |
| [M017](M017-prevencao-lavagem-dinheiro/README.md) | Prevenção à Lavagem de Dinheiro | Conformidade com PLD: verificação KYC diária automática contra listas restritivas, monitoramento de padrões suspeitos com alertas analisados em 48h, geração de relatórios COAF dentro dos prazos legais, bloqueio preventivo de pagamentos, e verificação de conflito de interesse por cruzamento de CPF/CNPJ. |

---

## Importação e Migração

| Módulo | Nome | Resumo |
|--------|------|--------|
| [M002](M002-importacao-editais/README.md) | Importação SIGFAPES | Ponte com o SIGFAPES legado via planilhas versionadas com lock exclusivo e dumps diários em Parquet. Interface de correção de inconsistências antes da importação. Gera JSONLs consumidos por M003. Mantém rastreabilidade completa entre dado importado e registro no novo sistema. |

---

## Comunicação e Governança

| Módulo | Nome | Resumo |
|--------|------|--------|
| [M012](M012-acompanhamento-resultados/README.md) | Acompanhamento e Resultados | Dashboards de execução e gestão de relatórios técnicos pós-contratação. Gerencia submissão, revisão, contestação e decisão final sobre relatórios técnicos periódicos. Também gerencia solicitações de alteração (escopo, cronograma, equipe, orçamento) com análise técnica. |
| [M018](M018-business-intelligence/README.md) | Business Intelligence | Painéis analíticos interativos com atualização diária. Perfis distintos: liderança (DIPRE, DIRAF) com visão estratégica consolidada, técnicos com visão operacional por área, e gestores de programa com indicadores específicos. Exportação PDF/Excel. Carregamento em até 5 segundos. |
| [M019](M019-transparencia-auditoria/README.md) | Transparência e Auditoria | Portal público com dados abertos (iniciativas, bolsas, execução financeira) atualizados diariamente com anonimização LGPD. Trilhas de auditoria imutáveis registrando todas as operações CRUD da plataforma. Relatórios padronizados para SECONT. |
| [M020](M020-comunicacao/README.md) | Comunicação | Serviço centralizado de notificações por e-mail com templates variáveis, 3 tentativas de reenvio, distinção entre notificações obrigatórias (prazos, pagamentos) e informativas (configuráveis pelo usuário). Lembretes automáticos de prazo com antecedência configurável (padrão: 30, 15, 7 dias). Comunicações em massa exigem aprovação da diretoria. |

---

## Integrações Externas

| Módulo | Nome | Resumo |
|--------|------|--------|
| [M023](M023-integracoes/README.md) | Integrações | Adaptadores plugáveis que isolam os módulos consumidores de OAuth, polling, parsing e idiossincrasias de provedores externos. Cobre assinatura eletrônica qualificada via E-Docs ES V2 (termos de bolsa, outorga, aceite e cooperação) e importação de currículo via Lattes CNPq e ORCID para M024. |
| [M024](M024-curriculo-pesquisador/README.md) | Currículo do Pesquisador | Réplica local versionada do currículo Lattes CNPq. Vincula PessoaFisica a Curriculo via número Lattes único. Gerencia FormacaoAcademica, Artigo, Livro, Orientacao, Projeto, ParticipacaoEvento, Premio e Idioma como entidades compartilhadas entre currículos. Usado por M011 para seleção de pareceristas ad hoc e validação de elegibilidade. Sincronização semanal automática via M023, com atualização sob demanda. |
