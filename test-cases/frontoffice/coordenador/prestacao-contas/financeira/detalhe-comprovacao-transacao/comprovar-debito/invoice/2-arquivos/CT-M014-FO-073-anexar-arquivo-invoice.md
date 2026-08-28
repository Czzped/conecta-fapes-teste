## ID do Cenário
[CT-M014-FO-073]

## Título
Anexar arquivo do Invoice (PDF ou imagem) com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN05` (Comprovante do Invoice com nome do coordenador, itens, valores e fornecedor)
- Contrato/API: `M014: AnexarDocumentoInvoice`

## Pré-condições
- Tipo de documento selecionado como `Invoice (Pagamento Internacional)`.
- Seção `2. Anexar Arquivos do Invoice *` visível.
- Arquivo PDF ou imagem do Invoice disponível (tamanho <= 10MB).

## Passo a Passo
1. Na seção `2. Anexar Arquivos do Invoice *`, clicar no botão `Anexar arquivos` ou arrastar o arquivo para a área de upload.
2. Selecionar o arquivo PDF/imagem do Invoice.
3. Aguardar o upload completar.

## Dados de Entrada
- Arquivo: `invoice_fornecedor_internacional.pdf` (Tamanho: `234 KB`)
- Formatos aceitos: `PDF` ou `imagem`

## Resultado Esperado
- O arquivo é enviado e exibido abaixo da área de upload em um pill com nome, tamanho e ícone de visualização (olho).
- A pergunta *"Deseja enviar o comprovante da fatura do cartão?"* é exibida abaixo do arquivo anexado.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
