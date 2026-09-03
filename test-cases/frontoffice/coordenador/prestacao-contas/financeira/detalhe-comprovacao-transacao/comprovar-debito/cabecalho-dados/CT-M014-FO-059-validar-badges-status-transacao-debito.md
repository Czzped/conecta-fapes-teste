## ID do Cenário
[CT-M014-FO-059]

## Título
Validar exibição dos badges de Status da transação de Débito (Pendente, Em Rascunho, Em Análise, Em Revisão, Aprovada, Rejeitada)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regra Canônica: M014: `RN08` / `RN10` / `RI4` (Ciclo de vida e máquina de estados da comprovação de débito — StatusTransacao derivado do Status da Prestacao vinculada)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transações de Débito cadastradas no sistema em diferentes estágios do ciclo de vida da `Prestacao`.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira/detalhes/:paymentId` para transações em diferentes estados.
2. Observar o badge de `Status` no canto direito da barra `Detalhes do Pagamento`.
3. Verificar a habilitação/desabilitação dos campos e botões conforme o estado atual.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Lista de Estados e Comportamentos Esperados (conforme `RI4`):
  1. **`Pendente`**: Transação importada sem Prestacao vinculada (edição liberada, botão `Enviar` ativo).
  2. **`Em Rascunho`**: Prestacao vinculada em `RASCUNHO` — coordenador ainda preenchendo (edição liberada).
  3. **`Em Análise`**: Prestacao vinculada em `EM_ANALISE` — campos **bloqueados** para edição.
  4. **`Em Revisão`**: Prestacao vinculada em `REVISAO` — coordenador deve complementar pendências (edição liberada).
  5. **`Aprovada`**: Prestacao vinculada em `FINALIZADO` — estado terminal, bloqueado para edição.
  6. **`Rejeitada`**: Prestacao vinculada em `NEGADO` — estado terminal, bloqueado para edição.

## Resultado Esperado
- O badge visual no banner `Detalhes do Pagamento` reflete exatamente o estado atual derivado da `Prestacao` vinculada.
- Para status `Pendente`, `Em Rascunho` e `Em Revisão`: a edição do formulário e os botões `Salvar Rascunho` e `Enviar` permanecem ativos.
- Para status `Em Análise`, `Aprovada` e `Rejeitada`: os campos e botões de ação ficam desativados/bloqueados (somente leitura).