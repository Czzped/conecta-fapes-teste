## Título
[Bug] Botão "Editar passageiros" desaparece ao adicionar novo passageiro gerando deadlock de validação da soma de valores na Seção 3

## ID
BUG-M014-FO-PAS-003

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — Tipo de Documento: **Passagem**
- Regra Canônica: M014: `RN12` (Registro de passagem e passageiros) / Invariante de Conciliação Financeira (A soma dos valores das passagens individuais deve corresponder exatamente ao valor total da transação bancária de débito)
- Caso de Teste Relacionado: `CT-M014-FO-054` (Adicionar múltiplos passageiros à mesma comprovação de passagem)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Seção `3. Informações da Passagem *` / Gerenciador de Passageiros)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de `coordenador` e abrir a comprovação de débito de passagem que já possua o `Passageiro 1` cadastrado com o valor total da transação (ex.: `R$ 2.934,52`).
2. Na seção `3. Informações da Passagem *`, notar que os campos do `Passageiro 1` estão em modo de leitura (`disabled`) e o botão `Editar passageiros` está visível no canto inferior direito.
3. Sem acionar previamente o botão `Editar passageiros`, clicar no botão `+ Adicionar passageiro`.
4. Observar que a linha `Passageiro 2` é criada em modo de edição, porém os campos do `Passageiro 1` continuam bloqueados e o botão `Editar passageiros` desaparece da tela, restando apenas o botão `Enviar passageiros`.
5. Preencher os dados do `Passageiro 2` informando um valor (ex.: `R$ 110,00`).
6. Clicar no botão ciano `Enviar passageiros`.
7. Observar a mensagem de erro impeditiva em alerta vermelho e notificação toast: *"A soma dos passageiros (R$ 3.044,52) deve ser igual ao valor total das transações (R$ 2.934,52)."*.
8. Constatar que não há meio de editar o valor do `Passageiro 1` para rebalancear a soma, colocando a interface em estado de bloqueio (deadlock).

## Dados de Entrada
- Valor Total da Transação de Débito: `R$ 2.934,52`
- Passageiro 1 (bloqueado como somente leitura): `R$ 2.934,52`
- Passageiro 2 (novo registro): `R$ 110,00`
- Soma Total Calculada pelo Sistema: `R$ 3.044,52` (Diferença excedente de `R$ 110,00`)

## Comportamento Esperado
- Ao clicar em `+ Adicionar passageiro`, o sistema deve colocar automaticamente todos os passageiros já existentes em modo de edição (ou manter um botão/ícone de edição individual por card), permitindo que o usuário redistribua as frações do valor total entre o `Passageiro 1` e os novos passageiros antes da submissão.

## Comportamento Atual
- O botão `Editar passageiros` desaparece assim que `+ Adicionar passageiro` é clicado.
- Os campos do `Passageiro 1` permanecem travados para edição.
- Ao tentar salvar, a validação de soma barra o envio e o usuário não consegue corrigir o valor do primeiro passageiro, sendo forçado a excluir o novo passageiro para recuperar a edição do anterior.

## Evidências
- 📷 **Estado inicial com Passageiro 1 bloqueado e botão "Editar passageiros" visível:**
  ![Passageiro 1 com botão Editar passageiros visível](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-003-botao-editar-passageiros-visivel-apenas-com-um.png)

- 📷 **Botão de edição sumiu, campos do Passageiro 1 travados e erro de validação da soma:**
  ![Bloqueio de edição e erro de soma de passageiros](file:///c:/Users/phcos/Documents/leds/conectafapes-project/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/passagem/evidencias-BUG-PAS-003-bloqueio-edicao-passageiro-1-e-erro-soma.png)

## Sugestão de Investigação (Opcional)
- No componente de gerenciamento de passageiros, ao disparar a ação de adicionar novo passageiro (`addPassenger()`), alternar o estado booleano de edição global (`isEditing = true`) ou garantir que cada card possua seu próprio estado reativo de edição individual.
