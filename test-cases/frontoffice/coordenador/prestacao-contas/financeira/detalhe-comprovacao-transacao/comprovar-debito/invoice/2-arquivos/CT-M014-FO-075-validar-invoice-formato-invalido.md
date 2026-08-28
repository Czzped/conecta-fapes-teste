## ID do Cenário
[CT-M014-FO-075]

## Título
Validar rejeição de arquivo do Invoice com formato inválido

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN05` / `RI-INV01` (Apenas PDF ou imagens são permitidos para Invoice)
- Contrato/API: `M014: AnexarDocumentoInvoice`

## Pré-condições
- Tipo de documento selecionado como `Invoice (Pagamento Internacional)`.
- Arquivo com extensão não suportada disponível (ex: `.exe`, `.zip`, `.docx`).

## Passo a Passo
1. Na seção `2. Anexar Arquivos do Invoice *`, clicar em `Anexar arquivos`.
2. Tentar selecionar e enviar um arquivo `.exe` ou `.zip`.

## Dados de Entrada
- Arquivo: `invoice_malicioso.exe`

## Resultado Esperado
- O upload é bloqueado imediatamente.
- O arquivo não aparece na lista de anexos.
- Mensagem de erro: *"Formato de arquivo não suportado. Envie apenas arquivos PDF ou imagem."*.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
