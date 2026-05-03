# US-M003-042 - Visualizar acompanhamento orcamentario por rubrica no Meu Projeto

**Como** coordenador da iniciativa,  
**quero** visualizar o total, o consumido, o alocado quando aplicavel, o disponivel e os percentuais por rubrica,  
**para** acompanhar a execucao orcamentaria do projeto no Front-Office.

## Contexto

A visao orcamentaria por rubrica pertence ao acompanhamento da iniciativa no M003. Ela deve aparecer na tela **Meu Projeto** apenas para o coordenador, pois apresenta informacoes gerenciais da execucao financeira do projeto.

Bolsistas, voluntarios e demais perfis sem papel de coordenacao nao devem visualizar esse bloco. Esses perfis continuam acessando apenas as informacoes compativeis com sua participacao no projeto.

## Criterios de aceite

- A visao orcamentaria por rubrica deve aparecer somente para usuario com papel de coordenador da iniciativa.
- Bolsista, voluntario e demais perfis sem papel de coordenacao nao devem visualizar esse bloco em **Meu Projeto**.
- O sistema deve exibir uma linha por rubrica com orcamento no projeto.
- Cada linha deve apresentar **Total**, **Consumido**, **Disponivel** e seus respectivos percentuais.
- O sistema deve apresentar **Alocado** somente para rubricas que possuam reserva ou comprometimento antes do consumo efetivo, como **Bolsa** e **Diarias**.
- O sistema nao deve exibir **Alocado** para **Material Permanente**, **Material de Consumo**, **Passagens** e **Pessoa Juridica**.
- A rubrica **Diarias** deve aparecer logo abaixo de **Bolsa**.
- A barra de acompanhamento deve refletir o consumido, o alocado quando existir e o saldo disponivel.

## Regras de exibicao por rubrica

| Rubrica | Total | Consumido | Alocado | Disponivel | Percentuais |
|---------|-------|-----------|---------|------------|-------------|
| Bolsa | Sim | Sim | Sim | Sim | Sim |
| Diarias | Sim | Sim | Sim | Sim | Sim |
| Material Permanente | Sim | Sim | Nao | Sim | Sim |
| Material de Consumo | Sim | Sim | Nao | Sim | Sim |
| Passagens | Sim | Sim | Nao | Sim | Sim |
| Pessoa Juridica | Sim | Sim | Nao | Sim | Sim |

## Observacoes

- **Consumido** representa valor ja executado/realizado na rubrica.
- **Alocado** representa valor reservado ou comprometido antes do consumo efetivo.
- **Disponivel** representa saldo restante para novas utilizacoes da rubrica.
- Quando nao houver conceito de alocacao para a rubrica, o campo **Alocado** nao deve aparecer para evitar interpretacao contabil incorreta.
