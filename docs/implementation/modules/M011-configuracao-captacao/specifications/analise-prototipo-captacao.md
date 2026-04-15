# Analise: Prototipo Backoffice vs Documentacao M011

Data: 2026-04-15

## Contexto

O prototipo do backoffice (`prototype/backoffice/`) possui um modulo completo de **Captacao** implementado nos componentes React listados abaixo. Esta analise cruza as funcionalidades do prototipo com a documentacao atual do M011 (Configuracao de Captacao) e do M003 (Gestao de Iniciativas Captadas) para identificar inconsistencias e lacunas.

## Componentes do Prototipo

| Componente | Arquivo | Funcionalidade |
|------------|---------|----------------|
| Editais | `Editais.tsx` | Tela principal de captacao: listagem de editais/captacoes com filtros (area, status, instituicao), tabs de inscricoes/avaliacao/recurso/finalizado |
| EditaisLight | `EditaisLight.tsx` | Versao simplificada da listagem com KPIs (editais abertos, em andamento, em avaliacao, avaliados, total inscricoes) |
| FormularioEdital | `FormularioEdital.tsx` | Formulario completo de criacao de edital/captacao com 8 secoes |
| DetalhesCaptacao | `DetalhesCaptacao.tsx` | Visualizacao detalhada de uma captacao com selecao de avaliadores |
| FormularioAvaliacao | `FormularioAvaliacao.tsx` | Template de formulario de avaliacao com perguntas, justificativa, nota e peso |
| FormularioRecurso | `FormularioRecurso.tsx` | Formulario de recurso do proponente |
| FormularioInscricaoGeral | `FormularioInscricaoGeral.tsx` | Template de formulario de inscricao/submissao |
| FormularioPersonalizado | `FormularioPersonalizado.tsx` | Builder de formulario personalizado |
| FormularioInstituicaoParceira | `FormularioInstituicaoParceira.tsx` | Cadastro de instituicao parceira vinculada a captacao |

## Funcionalidades Extraidas do Prototipo

### 1. Identificacao da Captacao (FormularioEdital, secao 1)

- Titulo da Captacao
- Tipo de Captacao (Edital Aberto, Edital Interno, Chamada Publica, etc.)
- Setor Responsavel (area tecnica: GEINOV, DGPP, etc.)
- Tipo de Fomento (Pesquisa, Inovacao, Extensao, etc.)
- Numero da Captacao
- Data de Inicio e Data de Fim
- Descricao da Captacao

### 2. Formularios (FormularioEdital, secao 2)

- Selecao de Formulario de Inscricao (da biblioteca ou criado)
- Selecao de Formulario de Avaliacao
- Selecao de Formulario de Recurso
- Formularios adicionais (tipo + formulario)
- Opcao de criar formulario personalizado

### 3. Parametrizacoes Gerais (FormularioEdital, secao 3)

- Faixas de Financiamento (habilitado/desabilitado)
- Para cada faixa: duracao (meses), valor minimo, valor maximo
- Multiplas faixas com adicao/remocao dinamica

### 4. Regras de Submissao (FormularioEdital, secao 4)

- Multiplas submissoes por proponente (permitido/nao permitido)
- Coordenador pode ter outro projeto ativo (sim/nao)

### 5. Requisitos do Coordenador (FormularioEdital, secao 5)

- Vinculada a Instituicao (sim/nao)
- Nivel Academico minimo (Graduacao, Mestrado, Doutorado)
- Restricao de Vinculo Empregaticio (sim/nao)
- Parceria com Instituicoes (permitida/nao permitida)

### 6. Avaliacao e Prestacao de Contas (FormularioEdital, secao 6)

- Necessita Avaliacao (sim/nao)
- Possui Prestacao Tecnica (sim/nao)
- Rubricas Permitidas (selecao: Material Permanente, Material de Consumo, Pessoa Fisica, Servico de Terceiros, Passagem, Diaria, Encargos)

### 7. Recursos Financeiros (FormularioEdital, secao 7)

- Origens de Recurso (Tesouro Estadual, Convenio Federal, etc.)
- Valor Total Disponivel

### 8. Bolsas (FormularioEdital, secao 8)

- Para cada bolsa: Modalidade (M001), Nivel, Versao, Max Bolsistas, Quantidade Cotas
- Bolsa institucional (checkbox)
- Multiplas bolsas com adicao/remocao dinamica

### 9. Gestao de Inscricoes (Editais.tsx, tab Inscricoes)

- Listagem de inscricoes por edital
- Filtros: area, status (Enviado, Em Avaliacao, Avaliado, Aprovado, Reprovado), instituicao
- Dados: proponente, data de envio, setor

### 10. Gestao de Avaliacao (Editais.tsx, tab Avaliacao)

- Listagem de avaliacoes com avaliador, edital, datas, status
- Selecao de avaliadores por captacao (modal em DetalhesCaptacao)
- Status: Em Avaliacao, Avaliado

### 11. Gestao de Recurso (Editais.tsx, tab Recurso)

- Formulario de recurso: edital, proponente, CPF, email, instituicao, motivo, descricao, anexos

### 12. Resultado Final (Editais.tsx, tab Finalizado)

- Listagem de captacoes finalizadas

---

## Inconsistencias Identificadas

### I1. Sobreposicao M003 vs M011

O prototipo trata **toda a gestao de captacao** como um unico fluxo (componente `Editais`), mas a documentacao divide em dois modulos:

| Funcionalidade | M003 (Gestao de Iniciativas Captadas) | M011 (Config. Captacao) | Prototipo |
|---------------|--------------------------|------------------------|-----------|
| Criar/registrar edital | RegistrarEditalOperacional | US-M011-001 Criar Edital | FormularioEdital (unico formulario) |
| Cronograma | Nao previsto | ConfigurarCronogramaDoEdital | Secao "Data Inicio/Fim" |
| Formularios | Nao previsto | PublicarVersaoFormulario | Secao "Formularios" |
| Parametros de fomento | Nao previsto | ConfigurarParametrosDeFomento | Secoes "Parametrizacoes", "Recursos Financeiros", "Bolsas" |
| Revisores/Avaliadores | Nao previsto | AssociarRevisorAdHoc | Modal "Enviar para Avaliacao" |
| Inscricoes | Nao previsto | Nao previsto | Tab "Inscricoes" |
| Avaliacao de merito | Nao previsto | Nao previsto | Tab "Avaliacao" |
| Recurso | Nao previsto | Nao previsto | Tab "Recurso" |
| Resultado final | Nao previsto | Nao previsto | Tab "Finalizado" |

**Conclusao:** M003 cobre apenas o registro operacional do edital. M011 cobre configuracao (cronograma, formularios, parametros, revisores). Nenhum dos dois cobre inscricoes, avaliacao de merito, recursos e resultado final — funcionalidades presentes no prototipo mas **sem modulo atribuido**.

### I2. Funcionalidades do prototipo sem cobertura em nenhum modulo

| Funcionalidade | Evidencia no prototipo | Modulo atual |
|---------------|----------------------|--------------|
| Submissao de proposta pelo proponente | FormularioInscricaoGeral | Nenhum |
| Avaliacao de merito por revisores | Tab "Avaliacao" + FormularioAvaliacao | Nenhum |
| Gestao de recursos/contestacao pre-award | Tab "Recurso" + FormularioRecurso | Nenhum |
| Resultado final e publicacao | Tab "Finalizado" | Nenhum |
| Requisitos do coordenador | FormularioEdital secao 5 | Nenhum |
| Regras de submissao | FormularioEdital secao 4 | Nenhum |
| Faixas de financiamento | FormularioEdital secao 3 | Parcial em M011 (ParametroFomento) |
| Bolsas por captacao (modalidade, nivel, cotas) | FormularioEdital secao 8 | Parcial em M003 (CotaEdital) + M001 |
| Cadastro de instituicao parceira | FormularioInstituicaoParceira | Nenhum (M010 trata Parcerias estrategicas, nao por edital) |
| KPIs da captacao | EditaisLight | Nenhum |

### I3. Entidades do prototipo ausentes nos modelos estruturais

| Entidade | Prototipo | M011 modelo-estrutural | M003 modelo-estrutural |
|----------|-----------|----------------------|----------------------|
| FaixaFinanciamento | Duracao, valor min, valor max | Ausente | Ausente |
| RegraSubmissao | Multiplas submissoes, coordenador com outro projeto | Ausente | Ausente |
| RequisitosCoordenador | Nivel academico, vinculo institucional, restricao empregaticia | Ausente | Ausente |
| RubricaPermitida | Lista de rubricas habilitadas para o edital | Ausente | Ausente |
| OrigemRecurso | Tesouro Estadual, Convenio Federal, etc. | Ausente (parcial em ParametroFomento.valorParceria) | Ausente |
| BolsaCaptacao | Modalidade, nivel, versao, max bolsistas, cotas, institucional | Ausente | Parcial (CotaEdital) |
| Inscricao | Proponente, data envio, status | Ausente | Ausente |

### I4. Status do EPIC-M011-001 ("In Progress") vs cobertura real

O EPIC-M011-001 (Configuracao do Edital) tem 4 user stories:
- US-M011-001 Criar Edital
- US-M011-002 Definir Cronograma
- US-M011-003 Configurar Parametros de Fomento
- US-M011-004 Publicar Edital

O prototipo mostra que a configuracao do edital e **muito mais abrangente** do que essas 4 stories cobrem. Faltam: faixas de financiamento, regras de submissao, requisitos do coordenador, rubricas permitidas, origens de recurso, bolsas da captacao.

---

## Recomendacoes

1. **Expandir o escopo do M011** para cobrir todo o ciclo da captacao conforme o prototipo (configuracao + inscricoes + avaliacao + recurso + resultado)
2. **Adicionar novas entidades** ao modelo estrutural: FaixaFinanciamento, RegraSubmissao, RequisitosCoordenador, RubricaPermitida, OrigemRecurso, BolsaCaptacao, Inscricao
3. **Criar novos EPICs** para funcionalidades descobertas: Gestao de Inscricoes, Avaliacao de Merito, Gestao de Recursos Pre-Award, Publicacao de Resultado
4. **Esclarecer fronteira M003/M011** com a seguinte separacao:
   - **M011 — Configuracao de Captacao**: cobre o ciclo de captacao de ponta a ponta (configuracao do edital, submissao de propostas, avaliacao de merito, recurso, resultado final)
   - **M003 — Gestao de Iniciativas Captadas**: gerencia os dados operacionais *apos* a contratacao (edital operacional, projetos contratados, cotas, alocacoes de bolsistas). Renomear de "Gestao de Iniciativas Captadas" para "Gestao de Iniciativas Captadas" para refletir melhor seu papel pos-contratacao
5. **Renomear M003** de "Gestao de Iniciativas Captadas" para **"Gestao de Iniciativas Captadas"** — o nome atual confunde com a funcionalidade de M011 e nao reflete que M003 trata de iniciativas ja contratadas
