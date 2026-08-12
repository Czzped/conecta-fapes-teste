---
title: Extensão de Bolsa
tipo: requisito
---

# Extensão de Bolsa

<contexto>
Uma extensão de bolsa é um **aditivo** que amplia o período de uma bolsa que já está ativa. Este documento trata do caso implementado: a extensão de bolsas que usam **pagamento em meses específicos** — bolsas cujos pagamentos não seguem uma sequência mês a mês, mas sim uma distribuição manual de cotas em meses escolhidos.

Nesse tipo de bolsa, prorrogar não é só dizer "até quando" vai a bolsa. Como os pagamentos são distribuídos manualmente, estender exige três informações combinadas: um **novo mês de término**, **quantas cotas novas** serão acrescentadas e **em quais meses futuros** essas novas cotas serão pagas. O objetivo é ampliar a bolsa preservando todo o histórico já consolidado (meses já pagos e meses futuros já programados ficam intactos) e abrindo apenas os novos meses necessários para acomodar as cotas adicionais. Tudo isso exige uma **justificativa** antes de ser enviado.

Este requisito descreve o comportamento do coordenador ao configurar essa extensão: definir o novo período, informar as cotas, selecionar os meses e conferir o impacto antes de confirmar o aditivo.
</contexto>

## Atores

- **Coordenador do projeto** — quem solicita a extensão. Informa o novo mês de término, a quantidade de novas cotas, seleciona os meses futuros que receberão as cotas e escreve a justificativa. É o único ator do fluxo.

## Fluxo principal

1. **Ponto de partida.** O coordenador abre o aditivo de uma bolsa **ativa** que usa **pagamento em meses específicos**. A tela carrega a situação atual da bolsa: os meses já pagos, os meses futuros já programados e o fim atual da bolsa.
2. **Novo período.** O coordenador informa um **novo mês de término**, posterior ao fim atual e dentro da vigência do projeto. A tela recalcula quais meses futuros ficam elegíveis para receber novas cotas.
3. **Quantidade de novas cotas.** O coordenador informa **quantas cotas novas** quer acrescentar (um número maior que zero), que precisa caber na quantidade de meses futuros elegíveis do período estendido.
4. **Seleção dos meses.** Na grade de meses, o coordenador seleciona exatamente os meses futuros que receberão as novas cotas. A grade mostra cada mês com um estado visual claro: **bloqueado** (já pago ou já programado), **disponível**, **selecionado** ou **desabilitado**.
5. **Justificativa.** O coordenador escreve a justificativa da extensão — obrigatória para poder enviar.
6. **Conferência.** Um resumo reflete o impacto da extensão (novo período, novas cotas, meses escolhidos) antes do envio.
7. **Envio.** Com todas as validações atendidas, a ação de confirmar o aditivo fica habilitada e o coordenador envia a extensão. Se qualquer validação falhar, o envio permanece bloqueado.

## Regras de negócio

### Aplicabilidade

- O fluxo se aplica **apenas** a bolsas que estão **ativas** e que têm configuração de **pagamento em meses específicos**. Bolsas com pagamento sequencial mês a mês não usam este fluxo.

### Novo mês de término

- Informar o novo mês de término é **obrigatório**.
- O novo mês de término deve ser **posterior ao fim atual** da bolsa. Um mês igual ou anterior ao fim atual é inválido e bloqueia a continuidade, com aviso de extensão inválida.
- O novo mês de término **não pode ultrapassar a vigência do projeto**. Um mês além da vigência impede o envio, com aviso de limite do projeto.

### Quantidade de novas cotas

- Informar a quantidade de novas cotas é **obrigatório** e deve ser **maior que zero**.
- A quantidade precisa **caber** dentro dos meses futuros elegíveis do período estendido. Quantidade maior do que os meses disponíveis marca o campo como inválido e impede o envio.
- A disponibilidade de cotas é validada com base na **quantidade de novas cotas informada**, não apenas na diferença total de meses entre o fim atual e o novo término. É preciso haver cotas disponíveis (por modalidade) para acomodar a extensão.

### Meses elegíveis e meses travados

- **Meses já pagos e o mês atual ficam travados** — representam o histórico já consolidado e não podem ser alterados.
- **Meses futuros já configurados** na programação anterior também ficam **travados e visíveis**, mesmo sendo futuros; não podem ser reaproveitados como novas cotas.
- **Apenas meses futuros ainda não utilizados** podem ser selecionados como novas cotas da extensão.
- A **janela de seleção** dos novos meses começa logo após o **maior** entre dois marcos: o fim atual da bolsa mais um mês, e o mês atual mais um mês. Ou seja, a seleção nunca começa antes do próximo mês em relação ao presente, nem antes do próximo mês em relação ao fim atual da bolsa.
- A janela de seleção **termina no novo mês de término** informado.

### Coerência entre cotas e meses selecionados

- A quantidade de meses selecionados deve ser **exatamente igual** à quantidade de novas cotas informada. Selecionar menos ou mais meses do que o esperado gera erro de inconsistência e impede o envio.

### Justificativa e envio

- A **justificativa é obrigatória** antes de permitir o envio.
- A ação de envio só fica **habilitada** quando **todas** as condições estão satisfeitas ao mesmo tempo: bolsa ativa, novo término válido, quantidade de novas cotas válida, meses futuros selecionados corretamente, justificativa preenchida e cotas disponíveis.
- Se **qualquer** validação obrigatória falhar, o envio permanece **bloqueado**.
- O resumo da tela deve refletir o impacto da extensão antes do envio, para conferência.

### O que a extensão envia

- Ao confirmar, a extensão registra explicitamente: a identificação da bolsa/alocação, o novo mês de término, a justificativa, a quantidade de novas cotas e a lista dos novos meses selecionados.

## Estados e transições

A extensão não é uma máquina de estados própria — é uma ação de configuração aplicada a uma bolsa que já está ativa. O que muda é a montagem progressiva do aditivo, em que cada etapa habilita ou bloqueia a seguinte:

| Momento | Situação | Efeito |
|---|---|---|
| Abertura | Bolsa ativa com pagamento em meses específicos | Carrega meses pagos, meses programados e fim atual |
| Novo término definido | Novo mês posterior ao fim atual e dentro da vigência | Recalcula os meses futuros elegíveis |
| Novo término inválido | Mês ≤ fim atual, ou além da vigência | Bloqueia a continuidade / impede o envio, com aviso específico |
| Cotas informadas | Quantidade > 0 e que cabe nos meses elegíveis | Aceita a quantidade |
| Cotas em excesso | Quantidade acima dos meses disponíveis | Campo inválido, envio impedido |
| Meses selecionados | Quantidade de meses = quantidade de cotas | Seleção aprovada |
| Seleção incoerente | Meses a mais ou a menos que as cotas | Erro de inconsistência, envio impedido |
| Pronto para enviar | Todas as validações atendidas + justificativa | Ação de envio habilitada |
| Alguma validação falha | Qualquer regra obrigatória não atendida | Ação de envio bloqueada |

## Casos especiais e exceções

- **Novo término igual ou anterior ao fim atual.** Bloqueia a continuidade e exibe erro de extensão inválida.
- **Novo término além da vigência do projeto.** Impede o envio e exibe erro de limite do projeto.
- **Quantidade de novas cotas acima da capacidade do período.** Campo marcado como inválido; envio impedido.
- **Seleção de meses insuficiente ou excedente.** Quantidade de meses diferente da quantidade de cotas gera erro de inconsistência; envio impedido.
- **Meses futuros já programados.** Continuam visíveis e travados; não podem ser reaproveitados como novas cotas da extensão.
- **Meses já pagos e mês atual.** Sempre travados; nunca alteráveis pelo coordenador.
- **Sem justificativa.** O envio permanece bloqueado até a justificativa ser preenchida.
- **Sem cotas disponíveis.** Mesmo com período e meses válidos, a falta de cotas disponíveis (por modalidade) impede a extensão.

## Dados envolvidos

- [[AlocacaoBolsista]] — a alocação da bolsa que está sendo estendida (expõe se usa pagamento em meses específicos, os meses já configurados e o status atual).
- [[PagamentoBolsista]] — os pagamentos por mês, base para saber os meses já pagos e os meses futuros programados.
- [[Projeto]] — expõe o fim da vigência, que limita o novo mês de término.

## Funcionalidades relacionadas

- [[pagamentos]] — os pagamentos mensais de bolsa que a extensão amplia, incluindo o pagamento em meses específicos.
- [[solicitacao-de-bolsa]] — a solicitação e a alocação originais da bolsa que agora é estendida.
