# M003 - Gerenciar Editais

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 03 — Fomento Pre-Award](../../../discovery/domains/03-fomento-pre-award.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Entidades operacionais de edital, iniciativa, projeto e alocacoes |

---

## Sobre o Modulo

A falta de visibilidade consolidada sobre editais, iniciativas, projetos, bolsistas e alocacoes dificulta a tomada de decisao operacional da agencia de fomento, obrigando os usuarios a consultar multiplas fontes desconectadas. Este modulo resolve esse problema ao concentrar o ownership operacional do edital e de suas iniciativas, permitindo acompanhar projetos, cotas e alocacoes em um unico contexto. O sucesso sera medido pelo tempo medio de consulta para tomada de decisao, pela consistencia dos dados operacionais e pela rastreabilidade entre edital, iniciativa e bolsa.

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
