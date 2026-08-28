## ID do Cenário
[CT-M014-FO-060]

## Título
Validar rejeição de anexo de Nota Fiscal com formato de arquivo inválido

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal)
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Restrição de extensões permitidas para documentos fiscais)
- Contrato/API: `M014: UploadDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Tipo de documento selecionado como `Nota Fiscal (Produto ou Serviço)`.
- Arquivo com extensão não suportada (ex: `.exe`, `.zip`, `.png`, `.docx`) disponível no ambiente local.

## Passo a Passo
1. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no componente de upload `Anexar Nota Fiscal`.
2. Tentar selecionar e enviar um arquivo no formato `.exe` ou `.png`.

## Dados de Entrada
- Arquivo: `documento_fiscal_invalido.exe` (ou `nota_fiscal.png`)

## Resultado Esperado
- O upload é bloqueado imediatamente pelo sistema.
- O arquivo não é anexado nem exibido na lista.
- É apresentada uma mensagem de erro orientativa: *"Formato de arquivo não suportado. Envie apenas arquivos nos formatos XML ou PDF."*.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
