## ID do Cenário
[CT-M014-FO-101]

## Título
Validar acesso direto via URL à tela de classificação de transação de crédito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regra Canônica: M014: `RN11` (Classificação de transações de crédito e controle de acesso por rota)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado no sistema com o perfil `coordenador`.
- ID de uma transação de Crédito válida pertencente ao projeto do coordenador (`paymentId_credito_valido`).

## Passo a Passo
1. Abrir o navegador e inserir diretamente na barra de endereço a URL: `/coordenador/prestacao-financeira/classificar-credito/paymentId_credito_valido`.
2. Pressionar `Enter` para carregar a página.
3. **Cenário Alternativo (Sem autenticação):** Em uma janela anônima sem sessão ativa, tentar acessar a mesma URL.
4. **Cenário de Exceção (ID Inexistente):** Tentar acessar a URL com um ID inexistente: `/coordenador/prestacao-financeira/classificar-credito/id_inexistente_999`.

## Dados de Entrada
- Rota Válida: `/coordenador/prestacao-financeira/classificar-credito/paymentId_credito_valido`
- Rota Inexistente: `/coordenador/prestacao-financeira/classificar-credito/id_inexistente_999`

## Resultado Esperado
- **Acesso Válido:** A aplicação carrega diretamente a tela `Detalhes do Pagamento`, recuperando os dados da transação de crédito (Pagamento: Crédito, Valor, Data, Destinatário) e liberando as seções de classificação.
- **Sem Autenticação:** A aplicação intercepta a requisição e redireciona o usuário para a tela de Login (`/login`).
- **ID Inexistente:** O sistema exibe mensagem de erro ou tela de aviso (*"Transação não encontrada"* ou erro 404).

## Tipo de Teste
[x] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
