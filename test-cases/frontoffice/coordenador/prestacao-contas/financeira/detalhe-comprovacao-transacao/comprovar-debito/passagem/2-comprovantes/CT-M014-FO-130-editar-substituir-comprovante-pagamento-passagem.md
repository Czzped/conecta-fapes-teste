## ID do Cenário
[CT-M014-FO-130]

## Título
Editar e substituir o anexo de comprovante de pagamento da passagem com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RN05` / `RN12` (Edição, substituição e integridade dos comprovantes bancários de passagem)
- Contrato/API: `M014: AtualizarComprovantePagamentoPassagem`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito (tipo Passagem) em estado `Em Rascunho`.
- Comprovante de pagamento bancário da passagem (ex: `comprovante_pagamento_antigo.pdf`) já anexado na seção `2. Anexar Comprovantes da Passagem *`.
- Arquivo do novo comprovante de pagamento (PDF, até 10MB) disponível no ambiente local.

## Passo a Passo
1. Acessar a tela de comprovação de débito da passagem.
2. Na seção `2. Anexar Comprovantes da Passagem *`, clicar no botão `Editar`.
3. Na coluna `Comprovante de Pagamento`, remover o arquivo atual (clicando no ícone de remoção/lixeira do pill) ou acionar a opção de substituir arquivo.
4. Selecionar e enviar o novo arquivo de comprovante de pagamento (`comprovante_pagamento_novo.pdf`).
5. Aguardar a conclusão do upload.
6. Clicar no botão ciano `Confirmar edição`.
7. Recarregar a página (`F5`) para validar a persistência da substituição.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_passagem_01`
- Arquivo inicial: `comprovante_pagamento_antigo.pdf` (Tamanho: 59 KB)
- Novo arquivo: `comprovante_pagamento_novo.pdf` (Tamanho: 120 KB)
- Ação: Editar Seção 2 → Substituir anexo de comprovante de pagamento → Confirmar edição

## Resultado Esperado
- O novo arquivo (`comprovante_pagamento_novo.pdf`) substitui com sucesso o comprovante anterior no pill de upload.
- Ao clicar em `Confirmar edição`, as alterações são consolidadas no rascunho da prestação.
- Exibe notificação de sucesso informando que o comprovante foi atualizado.
- Ao recarregar a página (`F5`), o novo comprovante de pagamento permanece exibido na tela, confirmando a persistência no servidor.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
