## ID do Cenário
[CT-M014-FO-074]

## Título
Ativar e anexar comprovante da fatura do cartão (opcional)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN05` (Quando o pagamento internacional foi feito via cartão de crédito do coordenador, a fatura deve ser anexada)
- Contrato/API: `M014: AnexarFaturaCartao`

## Pré-condições
- Arquivo do Invoice já anexado na seção `2`.
- A pergunta *"Deseja enviar o comprovante da fatura do cartão?"* está visível abaixo do arquivo.

## Passo a Passo
1. Clicar no toggle/checkbox *"Deseja enviar o comprovante da fatura do cartão?"* para ativá-lo.
2. Verificar se a sub-seção `Comprovante da fatura do cartão` é exibida.
3. Clicar no botão `Anexar fatura do cartão` ou arrastar o arquivo para a área de upload.
4. Selecionar o arquivo PDF/imagem da fatura.

## Dados de Entrada
- Toggle: `Ativado (Sim)`
- Arquivo fatura: `fatura_cartao_maio_2026.pdf` (Tamanho: `512 KB`)

## Resultado Esperado
- Ao ativar o toggle, a sub-área de upload `Comprovante da fatura do cartão` é expandida.
- O arquivo da fatura é enviado e exibido com nome e tamanho.
- Ao desativar o toggle, a área colapsa e o arquivo não é enviado.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
