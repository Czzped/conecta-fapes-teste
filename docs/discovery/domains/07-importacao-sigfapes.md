# Domain 07 — Importacao de Dados (SIGFAPES)

Dominio responsavel pela migracao e sincronizacao de dados do sistema legado **Sigfapes** para a plataforma ConectaFAPES. O Sigfapes e o sistema anterior da FAPES e contem o historico de editais, projetos, pessoas e pagamentos realizados. A importacao garante continuidade operacional sem necessidade de redigitacao manual, preservando o historico institucional.

**Modulos que implementam este domain:** M002

---

## 7.1 Importacao de Editais

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 7.1.1 | Importar Editais do Sigfapes | Buscar e importar os editais publicados no Sigfapes, incluindo tipo, periodo, status e configuracoes | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 27, II |
| 7.1.2 | Conciliar Editais Importados | Verificar inconsistencias entre os dados importados e os cadastros existentes na plataforma | Analista da Area Tecnica da Agencia | Art. 25, III |

## 7.2 Importacao de Projetos

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 7.2.1 | Importar Projetos do Sigfapes | Buscar e importar projetos contratados, incluindo dados do coordenador, instituicao, vigencia e orcamento | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 27, II |
| 7.2.2 | Importar Equipe do Projeto | Importar participantes, bolsistas e voluntarios vinculados a cada projeto | Analista da Area Tecnica da Agencia | Art. 25, III |
| 7.2.3 | Conciliar Projetos Importados | Verificar inconsistencias e duplicidades entre projetos importados e cadastros existentes | Analista da Area Tecnica da Agencia | Art. 25, III |

## 7.3 Importacao de Pessoas

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 7.3.1 | Importar Pessoas do Sigfapes | Buscar e importar dados de pesquisadores, coordenadores, bolsistas e consultores cadastrados no Sigfapes | Analista da Area Tecnica da Agencia | Art. 4; Art. 25, III |
| 7.3.2 | Conciliar Pessoas Importadas | Identificar e resolver duplicidades de cadastro entre dados importados e pessoas ja existentes na plataforma | Analista da Area Tecnica da Agencia | Art. 4; Art. 25, III |

## 7.4 Importacao de Pagamentos

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 7.4.1 | Importar Historico de Pagamentos | Buscar e importar pagamentos de bolsas, auxilios e parcelas de projetos ja realizados no Sigfapes, preservando o historico financeiro | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 27, II |
| 7.4.2 | Conciliar Pagamentos Importados | Verificar consistencia entre os pagamentos importados e os registros contabeis da agencia | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 27, II |

## 7.5 Gestao da Importacao

| # | Funcionalidade | Descricao | Persona | Fundamentacao Legal |
|---|---------------|-----------|---------|---------------------|
| 7.5.1 | Monitorar Execucao da Importacao | Acompanhar o status de cada importacao com logs de sucesso, erro e pendencias por entidade | Analista da Area Tecnica da Agencia | Art. 25, III |
| 7.5.2 | Reprocessar Importacao com Erro | Reexecutar importacoes que falharam apos correcao da inconsistencia identificada | Analista da Area Tecnica da Agencia | Art. 25, III |
| 7.5.3 | Atualizar Servico de Importacao | Manter aderencia e confiabilidade do servico conforme evolucoes no Sigfapes ou na plataforma | Analista da Area Tecnica da Agencia | Art. 25, III |
| 7.5.4 | Dashboard de Importacao | Painel com indicadores de progresso da migracao: total importado, pendente e com erro por entidade (editais, projetos, pessoas, pagamentos) | Analista da Area Tecnica da Agencia | Art. 25, III; Art. 3, 3 |
