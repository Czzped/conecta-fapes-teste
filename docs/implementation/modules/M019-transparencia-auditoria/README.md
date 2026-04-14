# M019 - Transparencia e Auditoria

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 06 -- Suporte e Inteligencia](../../../discovery/domains/06-suporte-inteligencia.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida do RelatorioSECONT |

---

## Sobre o Modulo

A agencia de fomento, como orgao publico, deve prestar contas de seus investimentos em fomento a sociedade e aos orgaos de controle. Atualmente, a publicacao de dados de transparencia e feita manualmente em planilhas no portal institucional, a geracao de relatorios para a SECONT exige compilacao manual de dados financeiros e nao ha trilha de auditoria sistematizada. Este modulo resolve esses problemas ao prover um portal de transparencia com dados abertos, geracao automatizada de relatorios para a SECONT, exportacao de dados para auditoria e trilha de auditoria completa de todas as operacoes. O sucesso sera medido pela completude dos dados publicados, pela reducao do tempo de geracao de relatorios SECONT e pela cobertura da trilha de auditoria.

---

## Dominio

A Lei de Acesso a Informacao e outras normas (Art. 3, Art. 5 II, Art. 6, Art. 15 III, Art. 27 II) exigem que a agencia de fomento disponibilize dados sobre o fomento publico de forma transparente e acessivel. Isso inclui publicar dados abertos sobre iniciativas financiadas, bolsas concedidas e execucao financeira.

A SECONT (Secretaria de Controle e Transparencia do ES) exige relatorios periodicos de execucao financeira em formato padronizado, contendo detalhamento de pagamentos, empenhos e liquidacoes relacionados aos programas de fomento.

Auditorias internas e externas demandam exportacao de dados com metadados de rastreabilidade, incluindo quem realizou cada operacao, quando e em qual contexto. A trilha de auditoria deve ser imutavel e registrar todas as operacoes CRUD realizadas na plataforma.

O portal de transparencia deve ser publicamente acessivel sem necessidade de autenticacao, respeitando a LGPD para anonimizacao de dados pessoais.

> Iniciativas sao gerenciadas por M003 como abstracao estrutural para publicacao e auditoria. Programas sao gerenciados por M010 e bolsas por M009.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Os dados do portal de transparencia sao atualizados diariamente a partir dos dados transacionais da plataforma. | Must |
| RN02 | Dados pessoais (nome, CPF) devem ser anonimizados nas publicacoes de transparencia, conforme LGPD. | Must |
| RN03 | Os relatorios de execucao financeira para a SECONT devem seguir o formato padronizado definido pela secretaria. | Must |
| RN04 | A trilha de auditoria e imutavel: registros nao podem ser alterados ou excluidos. | Must |
| RN05 | Todas as operacoes de criacao, alteracao e exclusao em qualquer modulo da plataforma devem ser registradas na trilha de auditoria. | Must |
| RN06 | As exportacoes de dados para auditoria devem incluir metadados de rastreabilidade (usuario, data, operacao, contexto). | Must |
| RN07 | O portal de transparencia deve ser acessivel publicamente sem necessidade de autenticacao. | Must |
| RN08 | Indicadores de transparencia (volume de dados publicados, frequencia de atualizacao) devem ser calculados automaticamente. | Should |
| RN09 | Relatorios SECONT devem ser gerados sob demanda e tambem de forma programada (mensal). | Should |
