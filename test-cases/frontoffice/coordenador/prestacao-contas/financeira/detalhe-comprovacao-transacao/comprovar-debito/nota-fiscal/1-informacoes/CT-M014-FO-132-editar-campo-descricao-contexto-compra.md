## ID do Cenário
[CT-M014-FO-132]

## Título
Editar e atualizar o campo de descrição/contexto da compra em prestação de contas

## Requisito/História Relacionada
- Requisito/Issue: #2943 / EP-11 (Comprovação de Débito - Descrição da Despesa)
- Regra Canônica: M014: `RN01` / `RN05` (Edição e persistência do texto descritivo da JustificativaDespesa)
- Contrato/API: `M014: AtualizarJustificativaDespesa`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Prestação de contas de débito em estado `Em Rascunho`.
- Campo de descrição previamente preenchido (ex: *"Compra inicial de equipamento para o laboratório"*).

## Passo a Passo
1. Acessar a tela de comprovação de débito em `/coordenador/prestacao-financeira/detalhes/:paymentId`.
2. Na seção de informações/descrição da despesa (`2. Adicionar Descrição e Anexar Nota Fiscal *` ou `1. Informações Gerais`), clicar no botão `Editar`.
3. Alterar o texto presente no campo `Descrição e Contexto da Compra *` (ex: inserindo novo texto detalhado ou corrigindo a justificativa).
4. Clicar no botão `Confirmar edição` (ou `Enviar Nota Fiscal`).
5. Observar o toast de sucesso e a atualização da tela.
6. Recarregar a página (`F5`) para validar a persistência da alteração do texto.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_01`
- Descrição original: *"Compra inicial de equipamento para o laboratório"*
- Nova descrição: *"Aquisição atualizada de 2 equipamentos de medição e acessórios para a fase 2 do projeto conforme edital"*
- Ação: Editar Seção → Alterar texto da descrição → Confirmar edição

## Resultado Esperado
- O campo de descrição aceita a alteração do texto respeitando o limite de caracteres permitido.
- Ao confirmar a edição, a requisição envia a nova descrição ao servidor com sucesso.
- É exibida a notificação de confirmação (ex: *"Descrição atualizada com sucesso"*).
- Ao recarregar a página (`F5`), o novo texto da descrição permanece exibido na tela, confirmando a persistência no backend.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
