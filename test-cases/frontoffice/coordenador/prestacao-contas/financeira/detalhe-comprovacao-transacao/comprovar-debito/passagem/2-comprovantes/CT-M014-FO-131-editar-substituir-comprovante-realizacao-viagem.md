## ID do Cenário
[CT-M014-FO-131]

## Título
Editar e substituir o anexo de comprovante de realização da viagem (bilhete/cartão de embarque) com sucesso

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (Passagem)
- Regra Canônica: M014: `RN05` / `RN12` (Edição e substituição dos comprovantes de viagem/embarque)
- Contrato/API: `M014: AtualizarComprovanteViagemPassagem`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito (tipo Passagem) em estado `Em Rascunho`.
- Comprovante de realização de viagem (ex: `cartao_embarque_antigo.pdf`) já anexado na seção `2. Anexar Comprovantes da Passagem *`.
- Arquivo do novo cartão de embarque/bilhete (PDF, até 10MB) disponível no ambiente local.

## Passo a Passo
1. Acessar a tela de comprovação de débito da passagem.
2. Na seção `2. Anexar Comprovantes da Passagem *`, clicar no botão `Editar`.
3. Na coluna `Comprovante de Realização da viagem`, remover o arquivo atual (clicando no ícone de remoção/lixeira do pill) ou acionar a opção de substituir arquivo.
4. Selecionar e enviar o novo arquivo do comprovante de viagem (`cartao_embarque_novo.pdf`).
5. Aguardar a conclusão do upload.
6. Clicar no botão ciano `Confirmar edição`.
7. Recarregar a página (`F5`) para validar a persistência da substituição.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_passagem_01`
- Arquivo inicial: `cartao_embarque_antigo.pdf` (Tamanho: 59 KB)
- Novo arquivo: `cartao_embarque_novo.pdf` (Tamanho: 140 KB)
- Ação: Editar Seção 2 → Substituir anexo de realização de viagem → Confirmar edição

## Resultado Esperado
- O novo arquivo (`cartao_embarque_novo.pdf`) substitui o comprovante anterior na coluna correspondente.
- Ao clicar em `Confirmar edição`, as alterações da Seção 2 são salvas e consolidadas no rascunho.
- Exibe notificação de sucesso informando que o comprovante de viagem foi atualizado.
- Ao recarregar a página (`F5`), o novo comprovante de realização da viagem permanece exibido na tela de forma persistente.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
