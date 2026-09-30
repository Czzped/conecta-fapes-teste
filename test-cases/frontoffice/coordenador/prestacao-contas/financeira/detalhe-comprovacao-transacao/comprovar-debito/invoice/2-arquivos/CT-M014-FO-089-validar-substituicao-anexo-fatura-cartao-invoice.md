## ID do Cenário
[CT-M014-FO-089]

## Título
Validar substituição e persistência do anexo de Comprovante da Fatura do Cartão de Crédito no Invoice

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Invoice)
- Regra Canônica: M014: `RN05` / `RI-INV01` (Integridade do gerenciamento e substituição de documentos secundários de Invoice - Fatura do Cartão)
- Contrato/API: `M014: AtualizarComprovanteFaturaCartao`

## Pré-condições
- Usuário autenticado com o perfil de `coordenador`.
- Estar na comprovação de débito sob a modalidade `Invoice (Pagamento Internacional)` em rascunho.
- A checkbox *"Deseja enviar o comprovante da fatura do cartão?"* estar ativada e possuir um anexo de fatura preexistente.

## Passo a Passo
1. Acessar a Seção `2. Anexar Arquivos do Invoice *`.
2. No campo `Comprovante da fatura do cartão`, clicar no ícone `X` (Remover) no anexo da fatura atual (`fatura_antiga.pdf`).
3. Clicar no botão `Anexar fatura do cartão` e selecionar o novo arquivo substituto (`fatura_nova.pdf`).
4. Clicar no botão azul `Confirmar edição`.
5. Verificar a exibição do toast de confirmação.
6. Recarregar a página no navegador (`F5`) ou reabrir a prestação de contas.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Checkbox: `Deseja enviar o comprovante da fatura do cartão?` (Marcada)
- Arquivo de Fatura Inicial: `fatura_antiga.pdf` (324 KB)
- Arquivo de Fatura Substituto: `fatura_nova.pdf` (150 KB)

## Resultado Esperado
- O sistema atualiza o comprovante da fatura do cartão com o novo arquivo selecionado (`fatura_nova.pdf`).
- Ao salvar e recarregar a página (`F5`), o novo arquivo de fatura deve permanecer salvo e persistido no formulário da despesa.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
