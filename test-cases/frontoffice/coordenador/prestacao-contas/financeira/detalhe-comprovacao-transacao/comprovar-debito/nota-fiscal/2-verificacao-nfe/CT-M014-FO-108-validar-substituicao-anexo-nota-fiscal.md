## ID do Cenário
[CT-M014-FO-108]

## Título
Validar substituição de um anexo de Nota Fiscal por um novo arquivo

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Nota Fiscal)
- Regra Canônica: M014: `RN05` / `RN06` / `RI-NFE01` (Substituição de DocumentoFiscal e reextração/atualização dos itens associados)
- Contrato/API: `M014: AtualizarDocumentoFiscal`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de débito selecionada na prestação de contas.
- Primeira Nota Fiscal (ex: NF-e A) já anexada e com informações confirmadas na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`.
- Arquivo de uma nova Nota Fiscal distinta (ex: NF-e B - XML ou PDF) disponível no ambiente local.

## Passo a Passo
1. Acessar a tela de comprovação de débito contendo a NF-e A anexada.
2. Na seção `2. Adicionar Descrição e Anexar Nota Fiscal *`, clicar no botão `Editar`.
3. Remover o anexo da NF-e A atual (clicando no ícone de lixeira do pill) ou acionar a opção de troca de arquivo.
4. Anexar o novo arquivo de Nota Fiscal (NF-e B).
5. Aguardar a leitura e extração automática dos novos dados da NF-e B.
6. Clicar no botão `Confirmar` / `Enviar Nota Fiscal`.
7. Verificar se a seção `Verificar Informações da Nota Fiscal` exibe os novos dados extraídos da NF-e B.
8. Verificar se a lista de itens na seção `3. Associar Compra *` foi atualizada com os itens da nova NF-e B.
9. Recarregar a página (`F5`) para validar a persistência da substituição da Nota Fiscal.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Anexo Inicial (NF-e A): `32240743708379014585550010000249881100249880-procNFe.pdf`
- Novo Anexo (NF-e B): `43240843708379014585550010000249881100249881-procNFe.pdf`
- Ação: Editar Seção 2 → Remover NF-e A → Anexar NF-e B → Confirmar/Enviar

## Resultado Esperado
- A nova Nota Fiscal (NF-e B) substitui a anterior com sucesso.
- A seção `Verificar Informações da Nota Fiscal` reflete as novas informações extraídas (Chave de Acesso, Emitente, Impostos).
- Os itens exibidos na seção `3. Associar Compra *` são atualizados para refletir exclusivamente os itens contidos na NF-e B.
- Ao recarregar a página (`F5`), a substituição da Nota Fiscal e seus itens permanecem persistidos no servidor.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
