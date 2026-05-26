# Regras de Liberacao de Parcelas FAPES

## Fontes Consultadas

| Fonte | Uso no Discovery | Link |
|-------|------------------|------|
| Resolucao CCAF 122/2014 — Normas Gerais para Projetos e Auxilios FAPES | Norma base: regras de liberacao de parcelas (Secao 9) e prestacao de contas (Secao 10) | https://fapes.es.gov.br/Media/fapes/Legislacao/Resolu%C3%A7%C3%A3o%20122_2014%20-%20Normas%20Gerais%20Proj_Aux.pdf |
| Resolucao CCAF 340/2024 — Alteracoes a Resolucao 122/2014 | Atualizacoes posteriores que alteram itens da norma base; deve prevalecer sobre 122/2014 onde houver conflito | https://fapes.es.gov.br/Media/fapes/Legislacao/Resolu%C3%A7%C3%A3o%20CCAF%20n%C2%BA%20340%2C%20de%2012%20de%20dezembro%20de%202024%20-%20Altera%20normas%20gerais%20-%20projetos%20e%20auxilios.pdf |

> As regras extraidas abaixo referem-se principalmente aos itens 9.2, 9.4, 10.1.1, 10.1.3 e 10.1.5 da Resolucao CCAF 122/2014. O sistema deve tratar essas regras como versionadas por norma vigente, ja que a Resolucao 340/2024 introduziu alteracoes. Validar com a area juridica da FAPES antes da implementacao definitiva quais itens foram alterados pela 340/2024.

## Regras de Liberacao

| ID | Regra | Parcela | Fonte |
|----|-------|---------|-------|
| RLP-01 | A segunda parcela so pode ser liberada quando: (a) a primeira Prestacao de Contas Tecnica e Financeira (PCTF) for apresentada ao setor competente da FAPES; E (b) pelo menos 60% do valor da primeira parcela estiver comprometido ou efetivamente gasto | Segunda | Resolucao CCAF 122/2014, item 9.2.1 |
| RLP-02 | A terceira parcela (quando houver) so pode ser liberada quando: (a) a primeira PCTF for aprovada; E (b) pelo menos 60% do valor da segunda parcela estiver comprometido ou efetivamente gasto | Terceira+ | Resolucao CCAF 122/2014, item 9.2.2 |
| RLP-03 | Qualquer parcela e bloqueada enquanto o beneficiario estiver em situacao de inadimplencia com a FAPES ou possuir certidoes negativas pendentes (Federal, Estadual, Municipal e Trabalhista/FGTS) | Todas | Resolucao CCAF 122/2014, item 9.4 |
| RLP-04 | A PCTF e composta obrigatoriamente de: relatorios tecnicos parciais ou final, relatorios financeiros, e pode incluir visitas tecnicas e seminario de avaliacao | Todas | Resolucao CCAF 122/2014, item 10.1.1 |
| RLP-05 | Os formularios financeiros obrigatorios da PCTF incluem: Ficha de Encaminhamento, Mapa Comparativo de Precos, Relacao de Pagamentos, Recibos e Conciliacao Bancaria | Todas | Resolucao CCAF 122/2014, item 10.1.3 |
| RLP-06 | O primeiro relatorio tecnico parcial deve cobrir o periodo desde a assinatura do Termo de Outorga ate o ultimo dia do 12o mes de vigencia do projeto; prazo de entrega e 30 dias apos o fim desse periodo | Primeira PCTF | Resolucao CCAF 122/2014, item 10.1.5 |

## Regras em Linguagem Natural

A liberacao de parcelas financeiras de projetos FAPES e condicionada ao cumprimento de obrigacoes tecnicas e financeiras acumuladas. O sistema nao pode simplesmente liberar a proxima parcela no vencimento — precisa verificar se o beneficiario cumpriu os requisitos de execucao financeira e documental da parcela anterior.

Para a **segunda parcela**, a regra central e dupla: o coordenador precisa ter apresentado a primeira PCTF (nao necessariamente aprovada — apenas apresentada) E pelo menos 60% dos recursos da primeira parcela precisam estar comprometidos ou gastos. O comprometimento inclui despesas ja executadas e valores com processo de pagamento iniciado. Ambas as condicoes devem ser satisfeitas simultaneamente.

Para a **terceira parcela** (e subsequentes, quando houver), a exigencia sobe: a primeira PCTF precisa estar **aprovada** (nao apenas apresentada) E pelo menos 60% da parcela anterior deve estar comprometida. O sistema deve distinguir entre "apresentada" e "aprovada" — sao estados diferentes no ciclo da prestacao de contas.

Independente da sequencia de parcelas, o sistema deve bloquear qualquer liberacao se o beneficiario estiver inadimplente com a FAPES ou com certidoes negativas vencidas ou invalidas. As certidoes verificadas sao: Federal (Receita Federal + PGFN), Estadual, Municipal e Trabalhista (FGTS incluso). Esse bloqueio e absoluto — nao ha excecao por percentual de execucao.

A PCTF e o instrumento formal que prova a execucao. Ela deve conter relatorios tecnicos (parciais ou final) e relatorios financeiros. Para os financeiros, os formularios minimos sao: Ficha de Encaminhamento, Mapa Comparativo de Precos (para compras), Relacao de Pagamentos, Recibos e Conciliacao Bancaria. O sistema deve validar a presenca desses documentos antes de aceitar a submissao da PCTF.

O primeiro relatorio tecnico parcial tem prazo definido: cobre desde a assinatura do Termo de Outorga ate o ultimo dia do 12o mes de vigencia, com 30 dias para submissao apos esse encerramento. O sistema deve calcular e exibir esse prazo automaticamente com base na data de assinatura do TO.

## Implicacoes Para o Conecta FAPES

| Tema | Decisao Recomendada |
|------|---------------------|
| Gatilho de liberacao de parcela | M004 (pagamentos) nao deve liberar parcela por calendario — deve consultar M014 (prestacao de contas) e M003 (execucao financeira) para verificar RLP-01 e RLP-02 antes de autorizar o pagamento |
| Percentual de comprometimento | M003 deve expor endpoint `GET /iniciativas/{id}/comprometimento-parcela/{numero}` retornando valor comprometido, valor da parcela e percentual; M004 consume para validar regra dos 60% |
| Estado da PCTF | M014 deve expor estado distinto entre `APRESENTADA` e `APROVADA` — ambos sao relevantes para regras diferentes (RLP-01 vs RLP-02) |
| Verificacao de inadimplencia | Validacao de certidoes (RLP-03) deve ser feita no momento da solicitacao de liberacao, nao apenas no cadastro. Certidoes tem validade; o sistema deve revalidar antes de aprovar a liberacao |
| Prazo do primeiro relatorio | M014 deve calcular o prazo do primeiro relatorio parcial a partir da data de assinatura do TO (campo do M003), exibindo alerta antes do vencimento dos 30 dias |
| Formularios financeiros obrigatorios | M014 deve validar presenca dos documentos RLP-05 antes de aceitar submissao de PCTF; ausencia de qualquer item deve gerar erro explicito com o nome do documento faltante |
| Versionamento normativo | As regras de percentual e prazo podem ser alteradas por novas resolucoes CCAF. O sistema deve armazenar qual versao normativa estava vigente no momento de cada liberacao como snapshot, nao hardcodar as regras |

## Pontos em Aberto

| Ponto | Encaminhamento |
|-------|----------------|
| O que exatamente conta como "comprometido" para o calculo dos 60%? Inclui despesas lancadas nao pagas? | Confirmar com area financeira FAPES a definicao operacional de "comprometido" — se e apenas gasto (debito bancario) ou tambem inclui empenho/pedido aprovado |
| A Resolucao 340/2024 alterou algum dos percentuais ou prazos da 122/2014? | Fazer leitura comparativa dos itens 9.2 e 10.1 entre as duas resolucoes antes da implementacao |
| Projetos com parcela unica seguem alguma regra de prestacao intermediaria? | Confirmar com FAPES se ha obrigacao de PCTF para projetos de parcela unica ou se a prestacao e apenas final |
| Os formularios financeiros (RLP-05) variam por tipo de despesa (NF vs diaria vs invoice)? | Validar se Mapa Comparativo de Precos e obrigatorio para diarias e invoices ou apenas para compras de bens/servicos |
