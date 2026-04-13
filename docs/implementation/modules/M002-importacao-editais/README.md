# M002 - Importacao de Editais

[← Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 07 — Importacao de Dados (SIGFAPES)](../../../discovery/domains/07-importacao-sigfapes.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Modelo tecnico de importacao, sincronizacao e conciliacao |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida das execucoes de importacao e sincronizacao |

---

## Sobre o Modulo

Hoje, os dados do SigFapes precisam ser trazidos para o ConectaFAPES com rastreabilidade, controle de reprocessamento e identificacao de divergencias entre a origem legado e os dados operacionais da plataforma. Este modulo resolve esse problema ao centralizar a selecao, a importacao, a sincronizacao e a conciliacao tecnica desses dados, sem assumir ownership das entidades de negocio. O sucesso sera medido pelo percentual de registros sincronizados com sucesso, pela reducao de falhas de importacao e pelo tempo necessario para detectar e tratar divergencias.

---

## Dominio

O SigFapes continua sendo a origem de diversos dados legados usados pela agencia de fomento. O papel do M002 e recuperar esses dados, registrar quando eles foram importados, manter o vinculo tecnico entre o identificador do legado e a entidade canonica do ConectaFAPES e gerar ocorrencias quando houver falhas, conflitos ou necessidade de conciliacao manual.

O modulo nao e dono do ciclo de vida de `Edital`, `Iniciativa`, `Projeto`, `AlocacaoBolsista`, `Bolsista`, `Coordenador`, `Orientador` ou `AreaTecnica`. Essas entidades pertencem a outros contextos de dominio e sao apenas referenciadas aqui para permitir sincronizacao tecnica. Neste desenho:

- `Edital`, `Iniciativa`, `Projeto`, `AlocacaoBolsista`, `CotaEdital`, `Coordenador`, `Orientador` e `Bolsista` pertencem ao M003.
- `PessoaFisica`, `Instituicao`, `UnidadeOrganizacional` e `AreaTecnica` pertencem ao M008.
- `VersaoNivel` pertence ao M001.

O M002 trata tres responsabilidades tecnicas: selecao de editais para importacao, execucao de cargas/importacoes/sincronizacoes e registro das ocorrencias geradas durante o processamento. Os registros `*SigFapes` existem para preservar o identificador da origem, o estado tecnico do vinculo e o historico de sincronizacao entre o legado e a entidade canonica do ConectaFAPES.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | Um edital so pode entrar no fluxo tecnico de importacao apos ser selecionado explicitamente para processamento. | Must |
| RN02 | Todo registro importado do SigFapes deve manter seu identificador de origem (`idSigFapes`) e o vinculo com a entidade canonica correspondente. | Must |
| RN03 | Toda execucao de importacao ou sincronizacao deve registrar data/hora, tipo, status e quantitativo de registros processados. | Must |
| RN04 | Divergencias, falhas e conflitos de conciliacao devem gerar ocorrencias rastreaveis para tratamento posterior. | Must |
| RN05 | O M002 nao altera o ownership nem redefine regras de negocio das entidades operacionais sincronizadas. | Must |
| RN06 | A sincronizacao deve ser idempotente: reprocessar a mesma carga nao pode criar duplicidade de vinculos tecnicos. | Must |
| RN07 | A selecao de importacao deve registrar a AreaTecnica responsavel pelo acompanhamento operacional posterior do edital importado. | Should |
| RN08 | Dados sincronizados a partir do SigFapes devem estar disponiveis para os modulos donos de dominio antes de serem usados em fluxos operacionais. | Must |

### Requisitos Nao-Funcionais

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RNF01 | Cada execucao de importacao ou sincronizacao deve registrar log tecnico suficiente para auditoria e reprocessamento. | Must |
| RNF02 | Os dados devem ser importados da origem legado por Web Services providos pelo cliente. | Must |
| RNF03 | O reprocessamento de uma execucao deve reutilizar os vinculos tecnicos ja estabelecidos sempre que possivel. | Must |
