# ADR-006: Reconciliacao da documentacao M004 com implementacao existente

| Atributo | Valor |
|----------|-------|
| **Status** | Aceita |
| **Data** | 2026-04-14 |
| **Autores** | Time de Arquitetura ConectaFAPES |
| **Modulos impactados** | M004 |

## Contexto

O modulo M004 (Pagamento de Bolsistas) foi implementado antes da estrutura de documentacao modular (`discovery/` → `implementation/` → `management/`). A documentacao original reside em `docs/deprecated/pagamento-bolsista/` com 15 epicos (EP-01 a EP-15), arquitetura tecnica detalhada (Clean Architecture, CQRS, Hangfire, Redis, MinIO) e entidades de dominio completas.

Quando a estrutura modular foi criada, o M004 recebeu uma especificacao de design em `docs/implementation/modules/M004-pagamento-bolsista/` com apenas 4 epicos e modelos simplificados, todos marcados como "To Do" — embora o codigo ja estivesse em producao.

Isso gerou **duas fontes de verdade divergentes** para o mesmo modulo:
- `deprecated/pagamento-bolsista/`: reflete o codigo implementado (27+ entidades, 15 epicos Done, infra detalhada)
- `implementation/M004/`: reflete o design planejado (16 entidades, 4 epicos To Do, modelos conceituais)

As divergencias incluem enums com valores diferentes, atributos ausentes na spec, status de backlog inconsistentes e ausencia de EPICs para funcionalidades ja construidas (bonus, remessas, retornos, guias, relatorios).

## Decisao

Reconciliar a documentacao do M004 adotando `implementation/modules/M004-pagamento-bolsista/` como **fonte unica de verdade** para o design do modulo, atualizada com os dados da implementacao real.

As acoes concretas sao:

1. **Backlog:** Atualizar status dos 4 EPICs existentes para Done. Criar 8 novos EPICs (M004-005 a M004-012) cobrindo funcionalidades implementadas que nao tinham correspondencia (bonus, remessas, retornos, encaminhamento Bandes, guias, relatorios, monitoramento, visualizacoes).

2. **Modelo Estrutural:** Adicionar entidades ausentes (BonusPagamento, ProcessoRemessa, Contratante). Adicionar atributos ausentes em entidades existentes (Folha.titulo, Folha.valorPrevisto, PagamentoBolsista.valorOriginal, Remessa.hash, etc.). Corrigir tipos (GuiaLiberacao.tipo de Integer para enum, Folha.ordem de 1-based para 0-based). Adicionar enums implementados.

3. **Modelo Comportamental:** Adicionar diagramas de estado para BonusPagamento e ProcessoRemessa. Alinhar maquinas de estado existentes com os enums reais do codigo. Marcar estados planejados mas nao implementados (SOLICITADO_AO_BANDES, REMESSAS_AUTORIZADAS, INCLUIDO_EM_GL_ALTERNATIVA) como `<<planejado>>`.

4. **Contrato:** Adicionar operacoes implementadas (GerarRemessaCadastro, ProcessarRetorno, EncaminharBandes, GerarGuia, GerarRelacao, SuspenderPagamento, etc.) com mapeamento de transporte real.

5. **Contrato API:** Manter endpoints `/api/v1/m004/...` como design target, com nota explicita de que a implementacao atual usa controllers genericos (`/api/{entidade}`).

6. **Infraestrutura:** Migrar detalhes de filas Redis, buckets MinIO e jobs Hangfire para `architecture/04-dados-e-operacao.md`.

7. **Depreciacao:** Adicionar nota de depreciacao em `deprecated/pagamento-bolsista/` redirecionando para `implementation/M004/`.

8. **Management:** Atualizar `backlog-product.md` com M004 a 100% de desenvolvimento e `milestones/README.md` com nota de progresso do MS-04.

## Consequencias

### Positivas

- Fonte unica de verdade para o modulo M004, eliminando ambiguidade
- Rastreabilidade ponta a ponta: discovery → implementation → management
- Novos desenvolvedores consultam um unico local para entender o modulo
- Enums e atributos documentados refletem fielmente o codigo em producao
- Funcionalidades futuras (estados planejados) estao explicitamente marcadas

### Negativas

- A documentacao em `deprecated/pagamento-bolsista/` contem detalhes de infraestrutura (estrutura de pastas do codigo, configuracoes de DI, pipeline MediatR) que nao sao cobertos pela estrutura `implementation/` — esses detalhes foram parcialmente migrados para `architecture/` mas a granularidade de codigo-fonte nao e o foco da doc modular
- Volume de documentacao aumenta temporariamente ate a depreciacao completa de `deprecated/pagamento-bolsista/`

### Riscos

- Futuras alteracoes no codigo podem divergir novamente da documentacao se nao houver disciplina de atualizacao — mitigado por revisao de PRs que incluam alteracoes em entidades ou enums do M004
- Estados marcados como `<<planejado>>` podem nunca ser implementados — devem ser revisados periodicamente e removidos se descartados

## Referencias

- Documentacao legada: `docs/deprecated/pagamento-bolsista/`
- Documentacao canonica: `docs/implementation/modules/M004-pagamento-bolsista/`
- ADR-001: Backend C# com Clean Architecture e CQRS
- ADR-003: Banco de Dados SQL Server
