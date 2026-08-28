## ID do Cenário
[CT-M014-FO-039]

## Título
Anexar arquivo de Nota Fiscal em formato XML ou PDF

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito
- Regra Canônica: M014: `RN05` / `RI-NFE01` (Upload e validação de documento fiscal)
- Contrato/API: `M014: UploadDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Arquivo da Nota Fiscal (XML ou PDF com chave de acesso de 44 dígitos) disponível no ambiente local.

## Passo a Passo
1. Localizar o componente de upload *"Selecione o arquivo ou arraste e solte aqui"*.
2. Clicar no botão `Anexar Nota Fiscal` ou arrastar o arquivo para a área de drop.
3. Aguardar o processamento e a leitura automatizada dos metadados da nota.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Arquivo: `32240743708379014585550010000249881100249880-procNFe.pdf`

## Resultado Esperado
- O arquivo é anexado e exibido em um pill contendo o nome do arquivo, ícone de visualização (olho) e ícone de remoção (lixeira).
- O sistema realiza a leitura automatizada dos dados da nota e expande a seção `Verificar Informações da Nota Fiscal`.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
