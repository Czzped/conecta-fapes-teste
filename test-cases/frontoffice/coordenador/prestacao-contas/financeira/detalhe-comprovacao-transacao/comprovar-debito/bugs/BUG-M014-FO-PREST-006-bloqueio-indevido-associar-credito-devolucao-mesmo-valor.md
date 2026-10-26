## Título
[Bug] Bloqueio indevido ao associar crédito de devolução de mesmo valor ao débito com mensagem de saldo residual maior que o devido

## ID
BUG-M014-FO-PREST-006

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Card "Devolução pendente *" em transação com status "Em devolução"**
- Regra Canônica:
  - `EPIC-M014-013` (Devoluções do Coordenador)
  - `US-M014-052` (Associar Devolução a Compra ou Prestação)
  - `US-M014-053` (Exibir Saldo Residual da Compra — Cenário *Devolução integral*: débito de R$ X e devolução associada de R$ X resultam em saldo residual de R$ 0,00)
  - M014 / M013: `RN02` (Conciliação de despesas e transações financeiras) e `RN11` / `RN13` (Associação e compensação entre créditos e débitos)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #5 (Prevenção de Erros)**: Falso positivo em regra de validação que impede a conclusão de um fluxo válido e correto de devolução financeira integral.
  - **Heurística #9 (Ajudar usuários a reconhecer, diagnosticar e recuperar-se de erros)**: Mensagem de validação contraditória e incoerente com o estado real dos dados (*"A soma do valor da transação selecionada com o saldo residual não pode ser maior que o valor devido."*), uma vez que o débito devido é de R$ 4.200,00 e o crédito selecionado é exatamente de R$ 4.200,00.
  - **Heurística #3 (Controle do Usuário e Liberdade)**: Bloqueio da submissão da comprovação, impossibilitando que o Coordenador de Projeto saneie a pendência de devolução bancária.
- Casos de Teste Relacionados:
  - `CT-M014-FO-033` (Fluxo de Devolução / Preencher descrição devolução)
  - `CT-M014-FO-034` (Fluxo de Devolução / Validar campos)
  - `CT-M014-FO-122` (Validar bloqueio envio prestação conciliação divergente)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Card `Devolução pendente`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Desktop (1920×1080) / Chrome v120+ / Frontoffice Vue-Nuxt UI em Homologação

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o Frontoffice com perfil de Coordenador no Ambiente de Homologação.
2. Navegar até o extrato em `/coordenador/financeira` e abrir uma transação de Débito com status `"Em devolução"` (ex.: Débito de `R$ 4.200,00` em `/coordenador/prestacao-financeira/detalhes/:paymentId`).
3. Na tela de Detalhes do Pagamento, localizar a seção/card `"Devolução pendente *"`, contendo o subtítulo *"Associe a transação de crédito da devolução desta prestação e anexe o comprovante."*.
4. No campo `"Selecione um crédito para associar a prestação"`, abrir a lista suspensa e selecionar a transação de crédito correspondente de igual valor (`Par 4 - credito de 4.200,00 - R$ 4.200,00 - 01/09/2026 17:22`).
5. Anexar o comprovante da devolução (ex.: `2026-1_p2.pdf`).
6. Observar a validação do campo do select e a mensagem de erro exibida logo abaixo.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Transação da prestação: Débito de `R$ 4.200,00` (Status: `Em devolução`, Destinatário: `PAR4-DEB`, Data: `02/09/2026 - 20:22`)
- Valor devido da prestação: `R$ 4.200,00`
- Crédito selecionado: `Par 4 - credito de 4.200,00 - R$ 4.200,00 - 01/09/2026 17:22` (Valor: `R$ 4.200,00`)
- Comprovante anexado: `2026-1_p2.pdf` (243 kB)

## Comportamento Esperado
- Como o crédito selecionado (`R$ 4.200,00`) possui exatamente o mesmo valor do débito devido (`R$ 4.200,00`), a operação configura uma **devolução integral perfeita**, resultando em um saldo residual de `R$ 0,00`.
- O sistema deve aceitar a seleção sem apontar erro de validação.
- A borda do campo não deve ficar vermelha e nenhuma mensagem de erro deve ser renderizada.
- O botão `"Enviar"` deve ficar habilitado para que o coordenador conclua o envio da comprovação da devolução pendente.

## Comportamento Atual
- Ao selecionar a transação de crédito de valor igual ao débito, o campo fica com borda vermelha e dispara imediatamente a mensagem de erro impeditiva:
  > **"A soma do valor da transação selecionada com o saldo residual não pode ser maior que o valor devido."**
- A validação lógica do frontend comete um cálculo incorreto (falso positivo), aparentemente somando o valor selecionado (`4.200,00`) a um saldo residual inicial não recalculado ou não decrementado (`4.200,00`), totalizando `8.400,00` e considerando maior que o valor devido (`4.200,00`), ou aplicando uma condição `>=` indevida.
- A mensagem bloqueia o envio da comprovação de devolução pelo coordenador.

## Evidências
- 📷 **Mensagem de validação indevida abaixo do dropdown de crédito selecionado:**
  ![Erro de Validação Saldo Residual](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-006-01-validacao-saldo-residual.png)

- 📷 **Tela de Comprovação de Débito com status 'Em devolução' e valor de débito e crédito coincidentes (R$ 4.200,00):**
  ![Tela Devolução Pendente](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-006-02-tela-devolucao-pendente.png)

## Sugestão de Investigação
- Inspecionar a lógica de validação do campo `"Selecione um crédito para associar a prestação"` no componente responsável (ex.: `DevolucaoPendenteCard.vue` ou seção de devolução em `ComprovarDebito.vue`):
  - Revisar a fórmula de validação:
    ```ts
    // Erro provável atual:
    // const saldoResidualAtual = valorDevido; // não decrementado
    // if (valorTransacaoSelecionada + saldoResidualAtual > valorDevido) -> Erro (4200 + 4200 > 4200)

    // Correção:
    // O valor selecionado somado às devoluções JÁ VINCULADAS previamente não pode exceder o valor devido:
    // const totalDevolvido = totalDevolucoesAnteriores + valorTransacaoSelecionada;
    // if (totalDevolvido > valorDevido) -> erro
    // E o saldo residual recalculado deve ser:
    // const saldoResidual = valorDevido - totalDevolvido;
    ```
  - Verificar se não há operador `>=` em vez de `>` em comparações de limite.
  - Certificar que quando `valorTransacaoSelecionada === valorDevido`, o formulário considere o saldo residual zerado (`0,00`) e passe na validação com sucesso.
