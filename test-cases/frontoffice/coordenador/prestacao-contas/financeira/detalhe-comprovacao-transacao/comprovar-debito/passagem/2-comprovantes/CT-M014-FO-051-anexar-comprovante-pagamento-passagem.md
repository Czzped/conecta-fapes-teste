## ID do Cenário
[CT-M014-FO-051]

## Título
Anexar comprovante de pagamento da passagem

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` (Anexo de comprovante de pagamento bancário da passagem)
- Contrato/API: `M014: AnexarComprovantePagamento`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Seção `2. Anexar Comprovantes da Passagem *` visível na tela.
- Arquivo em PDF (até 10MB) do comprovante bancário de pagamento da passagem disponível no ambiente local.

## Passo a Passo
1. Na coluna `Comprovante de Pagamento`, clicar no botão `Anexar comprovante de pagamento` ou arrastar o arquivo.
2. Aguardar a conclusão do upload.

## Dados de Entrada
- Arquivo: `comprovante_pagamento_passagem.pdf` (Tamanho: `59 KB`)

## Resultado Esperado
- O arquivo é enviado e exibido na coluna em um pill com o nome do arquivo, tamanho e ícones para visualização (olho) e remoção (X).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
