## ID do Cenário
[CT-M014-FO-102]

## Título
Validar acesso direto via URL à tela de comprovação de transação de débito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regra Canônica: M014: `RN05` (Comprovação de despesas de débito e roteamento dinâmico por ID de transação)
- Contrato/API: `M014: ConsultarTransacaoFinanceira`

## Pré-condições
- Usuário autenticado no sistema com o perfil `coordenador`.
- ID de uma transação de Débito válida pertencente ao projeto do coordenador (`paymentId_debito_valido`).

## Passo a Passo
1. Abrir o navegador e inserir diretamente na barra de endereço a URL: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_valido`.
2. Pressionar `Enter` para carregar a página.
3. **Cenário Alternativo (Sem autenticação):** Em uma janela anônima (sem sessão ativa), tentar acessar a mesma URL.
4. **Cenário de Exceção (ID Inexistente):** Tentar acessar a URL com um ID inexistente: `/coordenador/prestacao-financeira/detalhes/id_inexistente_999`.

## Dados de Entrada
- Rota Válida: `/coordenador/prestacao-financeira/detalhes/paymentId_debito_valido`
- Rota Inexistente: `/coordenador/prestacao-financeira/detalhes/id_inexistente_999`

## Resultado Esperado
- **Acesso Válido:** A aplicação carrega a tela `Detalhes do Pagamento` referente ao débito informado, apresentando o cabeçalho e os formulários de comprovante e justificativa correspondentes.
- **Sem Autenticação:** A aplicação bloqueia o acesso e redireciona para a tela de Login (`/login`).
- **ID Inexistente:** O sistema exibe mensagem de erro apropriada (*"Transação não encontrada"* ou 404).

## Tipo de Teste
[x] Positivo  [x] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
