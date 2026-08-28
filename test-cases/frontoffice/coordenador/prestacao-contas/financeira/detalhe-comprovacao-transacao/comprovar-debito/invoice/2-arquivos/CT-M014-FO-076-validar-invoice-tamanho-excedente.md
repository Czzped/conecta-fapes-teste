## ID do Cenário
[CT-M014-FO-076]

## Título
Validar rejeição de arquivo do Invoice com tamanho excedente ao limite permitido

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN05` / `RI-INV02` (Limite de tamanho para upload de Invoice)
- Contrato/API: `M014: AnexarDocumentoInvoice`

## Pré-condições
- Tipo de documento selecionado como `Invoice (Pagamento Internacional)`.
- Arquivo PDF/imagem com tamanho superior ao limite disponível.

## Passo a Passo
1. Na seção `2. Anexar Arquivos do Invoice *`, clicar em `Anexar arquivos`.
2. Selecionar um arquivo com tamanho superior ao limite permitido (ex: `invoice_grande.pdf` - 15MB).

## Dados de Entrada
- Arquivo: `invoice_grande.pdf` (Tamanho: `15 MB`)
- Limite: `10 MB` (conforme indicado na interface)

## Resultado Esperado
- O upload é interrompido antes de completar.
- O arquivo não é listado como anexado.
- Mensagem de erro: *"O arquivo excede o tamanho máximo permitido de 10MB."*.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
