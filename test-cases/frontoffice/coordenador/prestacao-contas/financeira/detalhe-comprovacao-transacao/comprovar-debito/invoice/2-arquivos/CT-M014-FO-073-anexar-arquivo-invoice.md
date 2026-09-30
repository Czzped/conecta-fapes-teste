## ID do Cenário
[CT-M014-FO-073]

## Título
Anexar e substituir arquivo de Invoice com sucesso na comprovação de débito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN05` / `RI-INV01` (Gerenciamento, anexação e substituição de comprovantes do Invoice)
- Contrato/API: `M014: AnexarDocumentoInvoice` / `M014: AtualizarDocumentoInvoice`

## Pré-condições
- Usuário autenticado com perfil de `coordenador`.
- Estar na tela de comprovação de débito sob a modalidade `Invoice (Pagamento Internacional)`.
- Seção `2. Anexar Arquivos do Invoice *` visível.
- Arquivos em PDF ou imagem com tamanho inferior a 10MB disponíveis.

## Passo a Passo
1. Na Seção `2. Anexar Arquivos do Invoice *`, clicar em `Anexar arquivos` e selecionar o arquivo PDF/imagem inicial do Invoice (`invoice_inicial.pdf`).
2. Verificar se o arquivo é carregado e exibido no card da Seção 2.
3. Clicar no botão `X` (Remover) no card do arquivo anexado.
4. Clicar novamente em `Anexar arquivos` e selecionar o novo arquivo substituto (`invoice_substituto.pdf`).
5. Clicar no botão `Confirmar edição`.
6. Recarregar a página no navegador (`F5`).

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Arquivo Inicial: `invoice_inicial.pdf` (234 KB)
- Arquivo Substituto: `invoice_substituto.pdf` (180 KB)
- Formatos Aceitos: `PDF` ou `XML/Imagem` (até 10MB)

## Resultado Esperado
- O novo arquivo substituto (`invoice_substituto.pdf`) é carregado com sucesso.
- Ao confirmar a edição e atualizar a página (`F5`), o novo arquivo deve ser mantido e persistido como o anexo oficial do Invoice da despesa.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
