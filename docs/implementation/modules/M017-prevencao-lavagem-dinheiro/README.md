# M017 - Prevencao a Lavagem de Dinheiro (PLD)

[<< Voltar ao Backlog Central](../../../management/backlog-product.md) | [Domain 05 -- Financeiro](../../../discovery/domains/05-financeiro.md)

## Indice

| Documento | Descricao |
|-----------|-----------|
| [Contrato](contrato.md) | Superficie publica do modulo: comandos, consultas, jobs e eventos |
| [Backlog](backlog.md) | EPICs, rastreabilidade e metricas do modulo |
| [Modelo Estrutural](modelo-estrutural.md) | Diagrama de classes e dicionario de dados |
| [Modelo Comportamental](modelo-comportamental.md) | Ciclo de vida do AlertaPLD |

---

## Sobre o Modulo

A agencia de fomento deve cumprir regulamentacoes de prevencao a lavagem de dinheiro: verificar identidade de beneficiarios (KYC), monitorar transacoes para padroes suspeitos, reportar ao COAF, bloquear pagamentos preventivamente e consultar listas restritivas. Atualmente nao existe sistema automatizado para essas atividades, o que expoe a instituicao a riscos regulatorios e dificulta a deteccao de operacoes atipicas. Este modulo visa resolver esses problemas ao automatizar os processos de compliance PLD em uma plataforma integrada. O sucesso sera medido pela taxa de alertas tratados dentro do prazo legal e pela reducao do tempo de resposta a operacoes suspeitas.

---

## Dominio

A agencia de fomento, como entidade publica que movimenta recursos financeiros para fomento a pesquisa, esta sujeita a legislacao de prevencao a lavagem de dinheiro. O processo de compliance PLD envolve diversas etapas complementares.

A verificacao cadastral (KYC - Know Your Customer) e o primeiro passo: antes de qualquer pagamento, o sistema deve verificar os dados cadastrais do beneficiario e consultar listas restritivas (lista de sancoes, PEPs, listas de impedidos). Essa consulta deve ocorrer automaticamente de forma diaria.

O monitoramento de transacoes analisa padroes de movimentacoes financeiras para identificar operacoes atipicas. Quando uma operacao e detectada como suspeita, o sistema gera um alerta que deve ser analisado por um oficial de compliance dentro de 48 horas. A analise pode confirmar a suspeita ou descartar o alerta.

Alertas confirmados podem resultar em bloqueio preventivo de pagamentos e na geracao de reporte ao COAF (Conselho de Controle de Atividades Financeiras) dentro do prazo legal. O desbloqueio de pagamentos requer autorizacao do diretor.

A analise de conflito de interesse verifica se existe relacao entre beneficiarios (pessoa fisica) e entidades contratadas pela agencia de fomento (pessoa juridica), cruzando dados de CNPJ.

Todas as acoes de PLD sao registradas em trilha de auditoria completa, e um dashboard permite que o oficial de compliance acompanhe indicadores de risco e status dos alertas.

> Dados de beneficiarios e pagamentos sao gerenciados por outros modulos (M004, M008, M009). Este modulo consome essas informacoes para operacionalizar os controles de PLD.

---

## Regras de Negocio

| ID | Descricao | Prioridade |
|----|-----------|------------|
| RN01 | A verificacao KYC e obrigatoria antes do primeiro pagamento a qualquer beneficiario. | Must |
| RN02 | A consulta a listas restritivas deve ser automatica e executada diariamente. | Must |
| RN03 | Todo alerta gerado deve ser analisado por um oficial de compliance dentro de 48 horas. | Must |
| RN04 | O reporte ao COAF deve ser gerado dentro do prazo legal definido pela legislacao vigente. | Must |
| RN05 | O bloqueio preventivo de pagamento e imediato e requer autorizacao do diretor para desbloqueio. | Must |
| RN06 | A verificacao de conflito de interesse deve cruzar CPF do beneficiario com CNPJ das entidades contratadas pela agencia de fomento. | Must |
| RN07 | Todas as acoes de PLD devem ser registradas em trilha de auditoria completa (usuario, data, hora, acao, justificativa). | Must |
| RN08 | O dashboard PLD e acessivel exclusivamente para usuarios com perfil de oficial de compliance. | Must |
| RN09 | Um alerta descartado deve conter justificativa obrigatoria do oficial de compliance. | Must |
| RN10 | O monitoramento de transacoes deve considerar parametros configuraveis (valor limite, frequencia, padrao de fracionamento). | Should |
| RI1 | Um pagamento bloqueado nao pode ser processado por M004 ate que seja desbloqueado. | Must |
| RI2 | Um beneficiario reprovado no KYC nao pode receber pagamentos ate regularizacao. | Must |
