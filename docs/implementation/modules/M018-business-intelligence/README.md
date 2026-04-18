# M018 - Business Intelligence

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 06 -- Suporte e Inteligencia](../../../discovery/domains/06-suporte-inteligencia.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Nota sobre ausencia de maquina de estados |

---

## Sobre o Modulo

A agencia de fomento necessita de visao analitica consolidada sobre programas, iniciativas, bolsas e resultados para tomada de decisao estrategica. Atualmente, os dados estao fragmentados entre multiplos sistemas e planilhas, exigindo compilacao manual a cada demanda de relatorio. Isso gera atraso na producao de indicadores, inconsistencias entre relatorios e impossibilidade de analise comparativa entre periodos. Este modulo resolve esse problema ao fornecer paineis analiticos interativos que consolidam dados de toda a plataforma, permitindo analise por programa, edital, instituicao e periodo. O sucesso sera medido pela reducao do tempo de producao de relatorios gerenciais e pela taxa de adocao dos paineis pela diretoria.

---

## Dominio

A agencia de fomento administra multiplos programas de fomento, cada um contendo editais que financiam iniciativas apoiadas e concedem bolsas e auxilios a pesquisadores e estudantes. A avaliacao do desempenho desses programas depende de indicadores que cruzam dados de diferentes dominios: quantidade de iniciativas por edital, volume de bolsas por modalidade, execucao financeira por programa e resultados de pesquisa publicados.

Diferentes perfis da organizacao necessitam de visoes distintas: a Diretoria (DIPRE, DIRAF) precisa de visao consolidada de todos os programas para planejamento estrategico; a Area Tecnica precisa de visao operacional dos editais, iniciativas e bolsas sob sua responsabilidade; e gestores de programa precisam acompanhar indicadores especificos de suas areas.

> Iniciativas e editais sao gerenciados por M003, com `Iniciativa` como abstracao estrutural comum para analises transversais. Programas e parcerias sao gerenciados por M010 — o M010 tambem produz relatorios financeiros de parcerias (valorAportado, valorAlocado, valorExecutado) que podem ser consumidos por paineis de BI. Bolsas sao gerenciadas por M009.

Os paineis devem permitir filtragem por periodo, programa, edital e instituicao, alem de exportacao para PDF e Excel para distribuicao em reunioes e relatorios oficiais. Os dados sao consolidados diariamente a partir das informacoes transacionais dos demais modulos.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Os dados dos paineis analiticos sao atualizados diariamente a partir dos dados transacionais da plataforma. | Must |
| RN02 | Todos os paineis devem permitir filtragem por periodo, programa, edital e instituicao. | Must |
| RN03 | Paineis devem suportar exportacao para PDF e Excel. | Must |
| RN04 | A visibilidade dos dados segue o perfil do usuario: Diretoria ve todos os dados; Area Tecnica ve apenas os dados do seu escopo de atuacao. | Must |
| RN05 | Indicadores de desempenho (taxa de execucao, tempo medio de concessao, taxa de renovacao) sao calculados automaticamente pelo sistema. | Must |
| RN06 | O dashboard de indicadores consolidados deve apresentar comparativo entre periodos (ano atual vs. ano anterior). | Should |
| RN07 | Graficos devem seguir padrao visual institucional da agencia de fomento. | Should |
| RN08 | O tempo de carregamento de qualquer painel nao deve exceder 5 segundos. | Should |
