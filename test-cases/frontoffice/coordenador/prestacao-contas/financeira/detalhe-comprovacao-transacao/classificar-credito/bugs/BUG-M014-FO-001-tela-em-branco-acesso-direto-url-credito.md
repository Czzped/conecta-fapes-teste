## Título
Tela em branco e TypeError no console ao acessar rota de classificação de crédito via URL direta

## ID
BUG-M014-FO-001

## Requisito/Regra Violada
- Regra Canônica: M014: `RN11` / Roteamento SPA (Acesso direto por link/Deep Linking à classificação de crédito)
- Rota/Componente: `/coordenador/prestacao-financeira/classificar-credito/:paymentId` (`ClassificarCredito.vue`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
[Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`]

## Gravidade/Prioridade
[x] 🔴 Bloqueante  [ ] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Fazer login no portal com a conta de `coordenador`.
2. Acessar o extrato em `/coordenador/financeira` e copiar a URL direta de uma transação de crédito (ex: `/coordenador/prestacao-financeira/classificar-credito/payment_id_123`).
3. Abrir uma nova aba no navegador (ou atualizar a página via `F5` / colar a URL diretamente na barra de endereços).
4. Pressionar `Enter` e observar a renderização da tela e o console do navegador (`F12`).

## Dados de Entrada
- Rota de Acesso Direto: `/coordenador/prestacao-financeira/classificar-credito/paymentId_credito_valido`

## Comportamento Esperado
- O componente `ClassificarCredito` deve aguardar a resolução da busca assíncrona da transação (ou tratar o estado de carregamento/loading) e renderizar normalmente o cabeçalho e os formulários de classificação de crédito.

## Comportamento Atual
- A área principal do componente não é renderizada, ficando totalmente em branco (tela preta).
- A aplicação sofre um crash de montagem no `setup()` do Vue/Nuxt devido a uma exceção JavaScript não tratada no console do navegador:
  ```text
  TypeError: Cannot read properties of undefined (reading 'valor')
      at De (ClassificarCredito-zLG5DMY_.js:1:2396)
      at setup (ClassificarCredito-zLG5DMY_.js:1:4462)
      at _c (index-DPkYzQxp.js:14:1385)
  ```

## Evidências
- 📷 **Tela Preta / Crash de Montagem:**
  ![Tela Preta no Acesso Direto](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788208372214.png)
- 🧾 **Stacktrace no Console do Navegador:**
  ![Console Log TypeError](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788208435591.png)
