## ID do Cenário
[CT-M014-FO-061]

## Título
Validar rejeição de anexo de Nota Fiscal com tamanho de arquivo excedente

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal)
- Regra Canônica: M014: `RN05` / `RI-NFE02` (Limite máximo de tamanho de arquivo permitido no upload)
- Contrato/API: `M014: UploadDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Tipo de documento selecionado como `Nota Fiscal (Produto ou Serviço)`.
- Arquivo PDF com tamanho superior a 10MB disponível no ambiente local.

## Passo a Passo
1. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no componente de upload `Anexar Nota Fiscal`.
2. Selecionar um arquivo PDF com tamanho superior a 10MB (ex: `nota_fiscal_grande.pdf` - 12MB).
3. Aguardar a resposta do sistema.

## Dados de Entrada
- Arquivo: `nota_fiscal_grande.pdf` (Tamanho: `12 MB`)
- Limite permitido: `10 MB`

## Resultado Esperado
- O upload é interrompido antes de completar o envio ao servidor.
- O arquivo não é listado como anexado.
- O sistema exibe mensagem de erro: *"O arquivo excede o tamanho máximo permitido de 10MB."*.

## Tipo de Teste
[ ] Positivo  [x] Negativo  [x] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
