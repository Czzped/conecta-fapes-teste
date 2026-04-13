# M009 - Gestao Bolsa Pesquisa

[← Voltar ao Backlog Central](../../backlog-product.md) | [Domain 04 — Fomento Post-Award](../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclos de vida de BolsaPesquisa e TermoCompromisso |

---

## Sobre o Modulo

O acompanhamento do ciclo de vida das bolsas -- desde a alocacao, passando pela vigencia e renovacao, ate o encerramento -- e feito de forma descentralizada e sem visao integrada, dificultando o controle e gerando atrasos nos processos. Este modulo resolve esse problema ao prover uma gestao integrada do ciclo de vida das bolsas de pesquisa, da alocacao ao encerramento, em uma unica plataforma. O sucesso sera medido pela taxa de bolsas com acompanhamento em dia e pelo tempo medio de processamento de renovacao.

---

## Dominio

A agencia de fomento concede bolsas de pesquisa a estudantes e pesquisadores por meio de projetos vinculados a editais. O processo de concessao de bolsa inicia-se com a alocacao de bolsas em um projeto e envolve multiplos atores: Coordenador do Programa, Orientador, Bolsista, Area Tecnica da agencia de fomento e SUCON.

Um Edital gerenciado operacionalmente em M003, eventualmente originado por sincronizacao do legado em M002, define cotas de bolsas por tipo (mestrado, doutorado, iniciacao cientifica). Cada Universidade possui Programas de Pos-graduacao (PPG) que participam dos editais e concorrem pelas cotas disponibilizadas. Um Coordenador e responsavel por um PPG e pode indicar bolsistas para as cotas do programa.

O fluxo de concessao segue as seguintes etapas: (1) o Coordenador do Programa indica o bolsista, informando orientador, quantidade de cotas, tema de pesquisa, periodo da bolsa e periodo previsto do curso; (2) o Orientador assina o termo de aceite; (3) o Bolsista insere os documentos exigidos; (4) a Area Tecnica da agencia de fomento avalia a documentacao; (5) caso aprovada, a Area Tecnica gera os termos de compromisso; (6) os termos sao assinados pelo Coordenador, Orientador, Bolsista, DIRAF e DIPRE; (7) a SUCON publica no Diario Oficial; (8) a Area Tecnica implementa a bolsa.

Caso a documentacao seja reprovada, o bolsista e notificado e pode reenviar os documentos. Caso a bolsa nao seja implementada, o Coordenador e notificado.

Uma bolsa implementada possui vigencia definida e pode ser renovada, suspensa ou encerrada. A renovacao exige nova avaliacao documental. O encerramento pode ocorrer por conclusao do curso, desistencia do bolsista, corte de recursos ou descumprimento de requisitos.

> Projetos, editais, cotas e alocacoes sao gerenciados por M003. O modulo M002 apenas sincroniza dados legados quando necessario. Este modulo consome essas informacoes para operacionalizar a gestao das bolsas.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Uma bolsa de pesquisa so pode ser alocada dentro das cotas disponibilizadas pelo edital para o programa. | Must |
| RN02 | O Coordenador do Programa e responsavel pela indicacao do bolsista. | Must |
| RN03 | O Orientador deve assinar o termo de aceite antes que o bolsista possa inserir documentos. | Must |
| RN04 | A documentacao do bolsista deve ser avaliada pela Area Tecnica da agencia de fomento antes da geracao dos termos de compromisso. | Must |
| RN05 | Documentacao reprovada permite reenvio pelo bolsista. | Must |
| RN06 | Os termos de compromisso devem ser assinados por Coordenador, Orientador, Bolsista, DIRAF e DIPRE. | Must |
| RN07 | A bolsa so pode ser implementada apos publicacao no Diario Oficial pela SUCON. | Must |
| RN08 | Uma bolsa implementada deve ter data de inicio e data de fim de vigencia definidas. | Must |
| RN09 | A renovacao de bolsa exige nova avaliacao documental pela Area Tecnica. | Must |
| RN10 | O encerramento de bolsa pode ocorrer por conclusao, desistencia, corte de recursos ou descumprimento de requisitos. | Must |
| RN11 | Ao encerrar ou suspender uma bolsa, a cota correspondente deve ser liberada para reutilizacao. | Should |
| RN12 | O sistema deve notificar o Coordenador quando uma bolsa nao for implementada. | Should |
| RN13 | Uma bolsa suspensa pode ser reativada mediante nova avaliacao. | Should |
| RI1 | Um bolsista nao pode receber mais de uma bolsa do mesmo tipo simultaneamente, salvo modalidades acumulativas definidas em M001. | Must |
| RI2 | O periodo da bolsa nao pode exceder o periodo de vigencia do edital. | Must |
