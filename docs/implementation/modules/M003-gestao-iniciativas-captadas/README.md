# M003 - Gestao de Iniciativas Captadas

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 04 — Fomento Post-Award](../../../discovery/domains/04-fomento-post-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Contrato API](contrato-api.md) | Especificacao HTTP REST concreta: endpoints, payloads, erros e autorizacao |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Entidades operacionais de edital, iniciativa, projeto e alocacoes |

---

## Sobre o Modulo

Apos a contratacao de uma iniciativa (projeto de pesquisa, visita tecnica, publicacao, etc.), a agencia de fomento precisa gerenciar os dados operacionais: o edital de origem, os projetos contratados, as cotas de bolsa disponiveis, as alocacoes de bolsistas e os papeis de coordenador, orientador e bolsista. Atualmente, a falta de visibilidade consolidada dificulta a tomada de decisao, obrigando os usuarios a consultar multiplas fontes desconectadas. Este modulo concentra o ownership operacional das iniciativas captadas, permitindo acompanhar projetos, cotas e alocacoes em um unico contexto. O sucesso sera medido pelo tempo medio de consulta para tomada de decisao, pela consistencia dos dados operacionais e pela rastreabilidade entre edital, iniciativa e bolsa.

> **Fronteira com M011:** O processo de captacao (configuracao do edital, inscricoes, avaliacao de merito, recurso e resultado final) e responsabilidade do M011. O M003 assume a gestao das iniciativas **apos a contratacao**, quando os projetos ja estao em execucao.

---

## Dominio

No ConectaFAPES, `Iniciativa` e o conceito guardachuva para os itens apoiados pela agencia de fomento. Nesta rodada documental, `Iniciativa` passa a existir como uma abstracao do dominio no M003, e `Projeto` e o subtipo concreto com detalhamento operacional completo. Outros tipos de iniciativa sao representados apenas como placeholders estruturais para evolucao futura.

O M003 e o contexto dono do `Edital` e das entidades operacionais decorrentes da captacao. O edital representa a unidade operacional publicada pela agencia, vinculada a uma `AreaTecnica` e, quando aplicavel, associada a um `Programa` ou a uma `Parceria`. A partir dele surgem iniciativas concretas, hoje detalhadas pelo subtipo `Projeto`.

Cada projeto pode consumir cotas de bolsa do edital por meio de `CotaEdital` e de `AlocacaoBolsista`. O modulo tambem e dono dos papeis operacionais de `Coordenador`, `Orientador` e `Bolsista`, todos vinculados a `PessoaFisica` cadastrada no M008.

O M002 pode importar e sincronizar dados legados do SigFapes, mas nao redefine o ownership dessas entidades. O M011 configura cronogramas, formularios e parametros do edital, mas o ownership do edital permanece no M003.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Todo edital operacional deve estar vinculado a exatamente uma AreaTecnica responsavel. | Must |
| RN02 | Uma iniciativa operacional pertence a exatamente um edital. | Must |
| RN03 | `Projeto` e o subtipo concreto de `Iniciativa` detalhado operacionalmente nesta rodada. | Must |
| RN04 | Uma cota de edital referencia exatamente uma versao de nivel de bolsa. | Must |
| RN05 | Toda alocacao de bolsista consome uma cota de edital e vincula bolsista e orientador responsaveis. | Must |
| RN06 | Coordenador, Orientador e Bolsista devem referenciar uma PessoaFisica cadastrada no M008. | Must |
| RN07 | O ownership operacional de edital, projeto, cota e alocacao permanece no M003 mesmo quando os dados tiverem origem no SigFapes. | Must |
| RN08 | Tipos futuros de iniciativa devem ser introduzidos como subtipos explicitos de `Iniciativa`, e nao por redefinicao de `Projeto`. | Should |
