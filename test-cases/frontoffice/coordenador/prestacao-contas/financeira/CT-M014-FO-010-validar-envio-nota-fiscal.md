## ID do Cenário
[CT-M014-FO-010]

## Título
Validar envio de Nota Fiscal com campos válidos

## Requisito/História Relacionada
- Issue GitHub: #245
- M014: `SubmeterDocumentoFiscal`
- Produto: Prestação Financeira, seção de envio de notas fiscais.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal, com saldo suficiente na `RubricaProjeto` correspondente.
- Arquivo de Nota Fiscal (XML ou PDF) válido e dentro das especificações de tamanho limite.

## Passo a Passo
1. Acessar `/coordenador/financeira`.
2. Aguardar o carregamento da página e clicar no botão para adicionar/enviar uma nova Nota Fiscal.
3. Preencher os campos obrigatórios do formulário de Documento Fiscal (ex: Número da Nota, Data de Emissão, Fornecedor, Valor).
4. Anexar o arquivo válido da Nota Fiscal no componente de upload.
5. Clicar no botão "Enviar" (ou "Salvar").

## Dados de Entrada
- Perfil: `coordenador`.
- Número da Nota: `123456789`
- Valor: `R$ 500,00`
- Arquivo anexo: `nota_fiscal_exemplo.pdf` (tamanho: 1MB).

## Resultado Esperado
- O sistema processa o envio com sucesso, exibe uma notificação de feedback positivo ("Nota Fiscal salva com sucesso").
- A modal de envio é fechada.
- O novo `DocumentoFiscal` passa a ser listado na tabela da prestação de contas do projeto.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
