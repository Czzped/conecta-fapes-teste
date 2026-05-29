# Analise: Prototipo Backoffice vs Documentacao M011

Data: 2026-04-15

## Contexto

O prototipo do backoffice (`prototype/backoffice/`) possui um modulo completo de **Captacao** implementado nos componentes React listados abaixo. Esta analise cruza as funcionalidades do prototipo com a documentacao atual do M011 (Configuracao de Captacao) e do M003 (Gestao de Iniciativas Captadas) para identificar inconsistencias e lacunas.

## Componentes do Prototipo

| Componente | Arquivo | Funcionalidade |
|------------|---------|----------------|
| Editais | `Editais.tsx` | Tela principal de captacao: listagem de editais/captacoes com filtros (area, status, instituicao), tabs operacionais de propostas/avaliacao/recurso/finalizado e Dashboard como ultima aba |
| EditaisLight | `EditaisLight.tsx` | Versao simplificada da listagem com KPIs (editais abertos, em andamento, em avaliacao, avaliados, total inscricoes) |
| FormularioEdital | `FormularioEdital.tsx` | Formulario completo de criacao de captacao com 6 secoes |
| DetalhesCaptacao | `DetalhesCaptacao.tsx` | Visualizacao detalhada de uma captacao, com aba Resumo e aba Dashboard para acompanhamento financeiro, fases, iniciativas e avaliadores |
| FormularioAvaliacao | `FormularioAvaliacao.tsx` | Template de formulario de avaliacao com perguntas, justificativa, nota e peso |
| FormularioRecurso | `FormularioRecurso.tsx` | Formulario de recurso do proponente |
| FormularioInscricaoGeral | `FormularioInscricaoGeral.tsx` | Template de formulario de inscricao/submissao |
| FormularioPersonalizado | `FormularioPersonalizado.tsx` | Builder de formulario personalizado |
| FormularioInstituicaoParceira | `FormularioInstituicaoParceira.tsx` | Cadastro de instituicao parceira vinculada a captacao |
| Configuracoes | `Configuracoes.tsx` | Hub de cadastros estruturantes; inclui o acesso a biblioteca/criacao de formularios e documentos exigidos |

## Funcionalidades Extraidas do Prototipo

### 1. Identificacao da Captacao (FormularioEdital, secao 1)

- Titulo da Captacao
- Tipo de Captacao (`Chamada Publica` ou `Demanda Induzida`)
- Ortogado destinatario, quando for `Demanda Induzida`
- Area Tecnica Responsavel
- Categorias de Iniciativas aceitas (Capacitacao, Difusao, Extensao, Inovacao, Pesquisa), selecionadas em campo multi-opcao com chips das categorias marcadas
- Tipos de Iniciativas aceitos
- Codigo da Captacao
- Aportes financeiros de Programa ou Parceria
- Descricao da Captacao

### 2. Formularios (FormularioEdital, secao Cronograma da Captacao)

- Selecao de Formulario de Inscricao (da biblioteca ou criado)
- Selecao de Formulario de Avaliacao
- Selecao de Formulario de Recurso
- Selecao de Formulario de Anexos
- Opcao de criar formulario personalizado
- A biblioteca e criacao de formularios ficam acessiveis pelo card **Formularios** dentro de **Configuracoes**, e nao mais como item direto do menu lateral de Projetos
- A tela de formularios possui retorno para **Configuracoes**, reforcando seu papel como cadastro estruturante consumido pela captacao

### 3. Cronograma da Captacao (FormularioEdital, secao 2)

- Publicacao da captacao
- Recebimento das propostas
- Avaliacao documental
- Avaliacao ad hoc
- Publicacao do resultado preliminar
- Recebimento de revisao do resultado
- Publicacao do resultado apos revisao
- Publicacao do resultado final
- Lista de cards, com validacao de uma etapa para cada fase obrigatoria
- Adiamento de etapa com quantidade de dias, justificativa, historico e deslocamento automatico das etapas posteriores

### 4. Aportes e Faixas de Financiamento (FormularioEdital, secao 1)

- Total financeiro calculado pela soma dos aportes financeiros
- Aportes financeiros originados de Programa ou Parceria
- Faixas de Financiamento
- Para cada faixa: duracao maxima da iniciativa, valor minimo, valor maximo e valor aportado na faixa
- Multiplas faixas com adicao/remocao dinamica
- Na visao de detalhe da captacao, o painel financeiro apresenta:
  - total solicitado pelas iniciativas e total disponivel da captacao
  - totais solicitados por rubrica
  - totais por faixa, incluindo valor total, quantidade de iniciativas e totais das rubricas dentro de cada faixa

### 5. Regras de Submissao (FormularioEdital, secao 3)

- Multiplas submissoes por proponente (permitido/nao permitido)
- Proponente pode ter outra iniciativa ativa (sim/nao)
- Coordenador pode acumular bolsa (sim/nao)
- Apenas proponentes escolhidos podem submeter proposta (sim/nao)

### 6. Requisitos do Proponente (FormularioEdital, secao 4)

- Direcionamento da proposta: aberta, instituicao especifica ou tipo de instituicao
- Nivel Academico minimo (Graduacao, Mestrado, Doutorado)
- Restricao de Vinculo Empregaticio (sim/nao)
- Parceria com Instituicoes (permitida/nao permitida)
- Gestor institucional obrigatorio (sim/nao)

### 7. Avaliacao, Prestacoes e Rubricas (FormularioEdital, secao 5)

- Necessita Avaliacao (sim/nao)
- Quantidade minima de revisores ad hoc por proposta
- Pool de revisores ad hoc em card proprio, com busca por CPF ou nome, adicao ao pool e remocao de revisores selecionados
- Possui Prestacao Tecnica (sim/nao)
- Possui Prestacao Financeira (sim/nao)
- Rubricas Permitidas em lista (selecao: Material Permanente, Material de Consumo, Pessoa Fisica, Pessoa Juridica, Passagem, Diaria, Bolsa)
- Ao selecionar uma rubrica, a tela abre as subrubricas correspondentes para selecao multipla
- Ao selecionar a rubrica Bolsa, exibe modalidades e niveis de bolsa permitidos

### 8. Bolsas (dentro de Rubricas Permitidas)

- Para cada bolsa: Modalidade (M001), Nivel, Versao, Max Bolsistas, Quantidade Cotas
- Bolsa institucional (checkbox)
- Multiplas bolsas com adicao/remocao dinamica

### 9. Documentos Exigidos do Proponente (FormularioEdital, secao 6 e Configuracoes)

- Lista de cards de documentos exigidos na submissao
- Nome do documento
- Descricao/orientacao
- Formatos permitidos
- Obrigatoriedade
- Cadastro reutilizavel em Configuracoes
- Observacao de que documentos institucionais recorrentes de empresas/instituicoes devem preferencialmente vir do cadastro corporativo do M008, com uma pessoa fisica representante vinculada ao proponente

### 10. Gestao de Inscricoes (Editais.tsx, tab Inscricoes)

- Listagem de inscricoes por edital
- Filtros: area, status (Enviado, Em Avaliacao, Avaliado, Aprovado, Reprovado), instituicao
- Dados: proponente, data de envio, setor

### 11. Gestao de Avaliacao (Editais.tsx, tab Avaliacao)

- Listagem de avaliacoes com avaliador, edital, datas, status
- Selecao de avaliadores por captacao (modal em DetalhesCaptacao)
- Status: Em Avaliacao, Avaliado

### 12. Gestao de Recurso (Editais.tsx, tab Recurso)

- Formulario de recurso: edital, proponente, CPF, email, instituicao, motivo, descricao, anexos

### 13. Resultado Final (Editais.tsx, tab Finalizado)

- Listagem de captacoes finalizadas

### 14. Dashboard da Captacao

- Na tela principal de captacao, o Dashboard e a ultima aba, apos Captacoes, Propostas, Avaliacao, Revisao e Resultado final.
- A tela abre inicialmente em **Captacoes**, pois esse e o fluxo operacional primario.
- O Dashboard consolida KPIs e visoes de acompanhamento, sem substituir as abas operacionais.
- No detalhe da captacao, a aba Dashboard consolida fases das iniciativas, financeiro da captacao, iniciativas enviadas, detalhe da iniciativa selecionada, revisores ad hoc e avaliacoes dos revisores.
- Em "Detalhes da Iniciativa Selecionada", os metadados da iniciativa ficam abaixo do nome e do resumo, em grade unica para leitura sequencial.

---

## Inconsistencias Identificadas

### I1. Sobreposicao M003 vs M011

O prototipo trata **toda a gestao de captacao** como um unico fluxo (componente `Editais`), mas a documentacao divide em dois modulos:

| Funcionalidade | M003 (Gestao de Iniciativas Captadas) | M011 (Config. Captacao) | Prototipo |
|---------------|--------------------------|------------------------|-----------|
| Criar/registrar captacao | Nao previsto | US-M011-001 Criar Configuracao de Captacao | FormularioEdital (unico formulario) |
| Cronograma | Nao previsto | ConfigurarCronogramaDaCaptacao | Secao "Cronograma da Captacao" |
| Formularios | Nao previsto | SelecionarFormulario no M021 | Secao "Formularios" |
| Aportes e faixas de financiamento | Nao previsto | ConfigurarAportesFinanceirosCaptacao, ConfigurarFaixasFinanciamento | Secoes "Aportes Financeiros" e "Faixas de Financiamento" |
| Adiamento de cronograma | Nao previsto | AdiarEtapaCronogramaDaCaptacao | Cards do cronograma da captacao |
| Revisores/Avaliadores | Nao previsto | AssociarRevisorAdHoc | Modal "Enviar para Avaliacao" |
| Propostas | Nao previsto | EPIC-M011-004 Recebimento de Propostas | Tab "Inscricoes" |
| Avaliacao documental e ad hoc | Nao previsto | EPIC-M011-005 Avaliacao Documental e Ad Hoc | Tab "Avaliacao" |
| Revisao de resultado | Nao previsto | EPIC-M011-006 Revisao de Resultado | Tab "Recurso" |
| Resultado final | Nao previsto | EPIC-M011-007 Publicacao de Resultado | Tab "Finalizado" |

**Conclusao:** M011 cobre o processo de captacao ate a publicacao do resultado final. M022 cobre a contratacao/outorga posterior. M003 assume a iniciativa apos a contratacao/outorga.

### I2. Funcionalidades do prototipo sem cobertura em nenhum modulo

| Funcionalidade | Evidencia no prototipo | Modulo atual |
|---------------|----------------------|--------------|
| Submissao de proposta pelo proponente | FormularioInscricaoGeral | M011 - EPIC-M011-004 |
| Avaliacao por revisores | Tab "Avaliacao" + FormularioAvaliacao | M011 - EPIC-M011-005 |
| Revisao de resultado | Tab "Recurso" + FormularioRecurso | M011 - EPIC-M011-006 |
| Resultado final e publicacao | Tab "Finalizado" | M011 - EPIC-M011-007 |
| Requisitos do proponente | FormularioEdital secao 5 | M011 - `RequisitoProponente` |
| Regras de submissao | FormularioEdital secao 4 | M011 - `RegraSubmissao` |
| Faixas de financiamento | FormularioEdital secao 3 | M011 - `FaixaFinanciamento` |
| Bolsas por captacao (modalidade, nivel, cotas) | FormularioEdital secao Rubricas Permitidas, quando rubrica Bolsa estiver selecionada | M011 referencia M001 por `BolsaPermitida` |
| Documentos exigidos do proponente | FormularioEdital secao 6 e Configuracoes | M011 - `DocumentoExigido` |
| KPIs da captacao | Editais/DetalhesCaptacao, Dashboard como ultima aba | M011 - EPIC-M011-007 |

### I3. Entidades do prototipo ausentes nos modelos estruturais

| Entidade | Prototipo | M011 modelo-estrutural | M003 modelo-estrutural |
|----------|-----------|----------------------|----------------------|
| FaixaFinanciamento | Duracao maxima, valor min, valor max | Presente | Ausente |
| RegraSubmissao | Multiplas submissoes, proponente com outra iniciativa ativa, acumulo de bolsa, restricao a escolhidos | Presente | Ausente |
| RequisitoProponente | Nivel academico, direcionamento, vinculo empregaticio, parceria institucional | Presente | Ausente |
| RubricaPermitida | Lista de rubricas habilitadas para a captacao | Presente | Ausente |
| BolsaPermitida | Modalidade, nivel, versao, max bolsistas, cotas, institucional | Presente por referencia ao M001 | Parcial |
| DocumentoExigido | Nome, descricao, formatos permitidos, obrigatoriedade | Presente | Ausente |
| AdiamentoPeriodoCronograma | Dias, justificativa, datas originais e novas datas | Presente | Ausente |
| Proposta | Proponente, data envio, status | Prevista em M011 | Ausente |

### I4. Status do EPIC-M011-001 ("In Progress") vs cobertura real

O EPIC-M011-001 (Configuracao da Captacao) tem historias fundacionais:
- US-M011-001 Criar Configuracao de Captacao
- US-M011-002 Definir Cronograma da Captacao
- US-M011-003 Visualizar Total Financeiro da Captacao
- US-M011-004 Publicar Configuracao de Captacao

O prototipo mostra que a configuracao da captacao e mais abrangente do que as historias fundacionais. Pontos como categorias de iniciativas, faixas de financiamento, regras de submissao, requisitos do proponente, documentos exigidos, rubricas permitidas, prestacoes exigidas, bolsas da captacao e adiamento de etapas do cronograma devem permanecer rastreados como detalhamento da configuracao.

---

## Recomendacoes

1. **Manter o escopo do M011** ate a publicacao do resultado final da captacao.
2. **Manter M021 como dono dos formularios** e o M011 como consumidor de versoes publicadas.
3. **Encaminhar propostas aprovadas ao M022** apos a publicacao do resultado final.
4. **Esclarecer fronteira M003/M011** com a seguinte separacao:
   - **M011 — Configuracao de Captacao**: cobre configuracao, recebimento de propostas, avaliacao, revisao e resultado final.
   - **M022 — Contratacao e Outorga**: formaliza propostas aprovadas.
   - **M003 — Gestao de Iniciativas Captadas**: gerencia a iniciativa apos contratacao/outorga.
