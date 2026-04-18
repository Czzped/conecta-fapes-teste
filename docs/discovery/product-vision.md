# ConectaFAPES — Visao do Produto

## Proposito

O ConectaFAPES e a plataforma digital da agencia de fomento (Fundacao de Amparo a Pesquisa e Inovacao do Espirito Santo) para a gestao do ciclo completo de fomento a pesquisa, ao desenvolvimento e a inovacao. O sistema substitui processos manuais e fragmentados por fluxos digitais integrados — do planejamento estrategico a prestacao de contas.

---

## Referencias rapidas

- **Personas**: [personas.md](personas.md)
- **Glossario de conceitos**: [glossario.md](glossario.md)

---

## Mapa de Dominios

Cada domain define uma capacidade de negocio. Um modulo e a implementacao de um domain.

| # | Domain | Descricao | Modulos |
|---|--------|-----------|---------|
| 01 | [Corporativo e Administrativo](domains/01-corporativo.md) | Identidades, cadastros mestres, estrutura organizacional e modalidades de bolsa | M001, M005, M006, M007, M008 |
| 02 | [Planejamento e Estrategia](domains/02-planejamento.md) | Plano estrategico, parcerias e programas de fomento | M010 |
| 03 | [Fomento Pre-Award](domains/03-fomento-pre-award.md) | Captacao, selecao e contratacao de iniciativas | M011, M002 |
| 04 | [Fomento Post-Award](domains/04-fomento-post-award.md) | Gestao de iniciativas captadas, acompanhamento, bolsistas e finalizacao | M003, M009, M012, M013, M014, M015 |
| 05 | [Financeiro](domains/05-financeiro.md) | Contabilidade, contas bancarias, pagamentos e PLD | M004, M016, M017 |
| 06 | [Suporte e Inteligencia](domains/06-suporte-inteligencia.md) | BI, transparencia, auditoria e comunicacao | M018, M019, M020 |
| 07 | [Importacao SIGFAPES](domains/07-importacao-sigfapes.md) | Migracao de editais, projetos, pessoas e pagamentos do sistema legado | M002 |

---

## Regras de Negocio Transversais

Regras que atravessam multiplos domains e nao pertencem a nenhum especificamente.

### Solicitacao de Bolsa — Prazo e Competencia

A solicitacao de bolsa envolve dois atores em sequencia: o coordenador abre a solicitacao e o bolsista envia a documentacao. A competencia do pagamento e determinada pelo prazo de envio da documentacao: dentro do prazo, o pagamento e processado no mes corrente; fora do prazo, no mes seguinte.

### Pagamento a Maior — Desconto em Parcelas Futuras

Quando identificado um pagamento acima do valor correto ao bolsista, o excedente e registrado como debito e descontado automaticamente nos pagamentos futuros ate quitacao total.

### Nota Fiscal — Uso Unico por Projeto

Cada nota fiscal pode ser vinculada a um unico projeto e registrada uma unica vez no sistema. O XML e validado junto ao SERPRO no momento da submissao.

### Conflito de Interesse com PJ

O coordenador e participantes do projeto nao podem ter vinculo com pessoas juridicas contratadas pelo projeto — societario, familiar (ate segundo grau) ou empregaticio. A contratacao e bloqueada automaticamente quando identificado conflito.

---

## Fundamentacao Legal

Este documento e os domains referenciam artigos da **LEC 978/2021** — Lei Complementar que dispoe sobre a Fundacao de Amparo a Pesquisa e Inovacao do Espirito Santo, aqui tratada como agencia de fomento.

| Artigo | Tema | Domains Relacionados |
|--------|------|----------------------|
| Art. 2 | Finalidades da agencia de fomento | 01 |
| Art. 3 | Publicidade, prestacao de contas e acompanhamento | 01, 03, 04, 05, 06 |
| Art. 4 | Apoio financeiro, habilitacao e avaliacao de merito | 01, 03, 04 |
| Art. 5 | Registros, programas e escrituracao contabil | 05, 06 |
| Art. 6, par. unico | Motivacao e transparencia dos atos | 02, 03, 04 |
| Art. 12 | Camaras e comites de avaliacao de merito | 02, 03 |
| Art. 14 | Politicas, financiamento e homologacao | 01, 02, 03 |
| Art. 15 | Editais, pareceres e prestacao de contas | 03, 04 |
| Art. 16 | Autorizacao de pagamentos | 05 |
| Art. 18 | Relatorios tecnicos | 04, 06 |
| Art. 25 e 26 | Registros contabeis e ajustes orcamentarios | 04, 05 |
| Art. 27 | Prestacao de contas financeira | 04, 05, 07 |
| Art. 28 | Instrumentos de fomento e liberacao de recursos | 02, 03, 05 |
| Art. 30 | Recursos humanos e movimentacoes | 01 |
| Art. 37 | Politicas de capacitacao | 01 |
