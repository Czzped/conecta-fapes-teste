## Título
Tela em branco e exceção no console ao acessar rota de classificação de crédito com ID inexistente ou inválido

## ID
BUG-M014-FO-003

## Requisito/Regra Violada
- Regra Canônica: M014: `RN11` / Tratamento de Erro de Roteamento SPA (Acesso por URL direta com ID de transação inexistente)
- Rota/Componente: `/coordenador/prestacao-financeira/classificar-credito/:paymentId` (`ClassificarCredito.vue`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
[Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`]

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Fazer login no portal com o perfil `coordenador`.
2. Digitar ou colar na barra de endereços uma URL de classificação de crédito contendo um ID inexistente ou inválido (ex: `/coordenador/prestacao-financeira/classificar-credito/id_inexistente_999`).
3. Pressionar `Enter` para carregar a página.
4. Observar o comportamento da interface e o console do navegador (`F12`).

## Dados de Entrada
- Rota com ID Inexistente: `/coordenador/prestacao-financeira/classificar-credito/id_inexistente_999`

## Comportamento Esperado
- Ao tentar acessar uma transação com ID inexistente ou inválido, o sistema deve tratar a resposta da busca e exibir uma tela/mensagem de erro amigável (ex: *"Transação não encontrada"*, erro 404) ou redirecionar o usuário com segurança para o extrato em `/coordenador/financeira`.

## Comportamento Atual
- A página permanece em branco (tela preta), sem carregar nenhum componente nem exibir mensagem de erro amigável ao usuário.
- O console do navegador registra a seguinte exceção JavaScript não tratada:
  ```text
  TypeError: Cannot read properties of undefined (reading 'valor')
      at De (ClassificarCredito-zLG5DMY_.js:1:2396)
      at setup (ClassificarCredito-zLG5DMY_.js:1:4462)
      at _c (index-DPkYzQxp.js:14:1385)
  ```

## Evidências
- 📷 **Tela Preta no Acesso com ID Inexistente:**
  ![Tela Preta Acesso ID Inexistente](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788306342730.png)

## Sugestão de Investigação (Opcional)
- Adicionar verificação e tratamento de exceção (ex: *error boundary* ou checagem de retorno nulo da API/serviço) quando a consulta da transação por ID retornar vazia ou 404.
