## ID do Cenário
[CT-M014-FO-030]

## Título
Validar exibição dos badges de Status da transação de crédito (Pendente, Em Rascunho, Em Análise, Validado, Rejeitada)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito
- Regra Canônica: M014: `RN08` / `RN10` (Ciclo de vida e máquina de estados da prestação de contas)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transações de crédito cadastradas no sistema em diferentes estágios do ciclo de vida da prestação de contas.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira/classificar-credito/:paymentId` para transações em diferentes estados.
2. Observar o badge de `Status` no canto direito da barra `Detalhes do Pagamento`.
3. Verificar a habilitação/desabilitação dos campos e botões conforme o estado atual.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/:paymentId`
- Lista de Estados e Comportamentos Esperados:
  1. **`Pendente`**: Transação de crédito recém-importada, aguardando classificação inicial.
  2. **`Em Rascunho`**: Classificação salva como rascunho pelo coordenador (edição liberada).
  3. **`Em Análise`**: Classificação submetida pelo coordenador (campos bloqueados para edição).
  4. **`Validado` / `Aprovada`**: Comprovação de crédito aceita pela área técnica/FAPES (bloqueado para edição).
  5. **`Rejeitada` / `Contestada`**: Comprovação recusada necessitando ajuste do coordenador.

## Resultado Esperado
- O badge visual no banner `Detalhes do Pagamento` reflete exatamente o estado atual da transação no banco de dados.
- Para status `Pendente` e `Em Rascunho`, a edição do formulário (`1. Informações Gerais *`) e os botões `Salvar Rascunho` e `Enviar` permanecem ativos.
- Para status `Em Análise` e `Validado`, os campos e botões de ação ficam desativados/bloqueados para leitura apenas.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
