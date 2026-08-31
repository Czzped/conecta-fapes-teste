## Título
Tela em branco e TypeError no console ao acessar rota de classificação de crédito via URL direta

## ID
BUG-M014-FO-001

## Requisito/Regra Violada
- Regra Canônica: M014: `RN11` / Roteamento SPA (Acesso direto por link/Deep Linking à classificação de crédito)
- Rota/Componente: https://conectafapes.hom.es.gov.br/prestacao-financeira/classificar-credito/d5c0a100-0000-4000-8000-000000000048

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
- Rota de Acesso Direto: `https://conectafapes.hom.es.gov.br/prestacao-financeira/classificar-credito/d5c0a100-0000-4000-8000-000000000048`

## Comportamento Esperado
- A página de classificação de crédito deve carregar normalmente ao ser acessada via URL direta, exibindo o cabeçalho com as informações da transação e os formulários de classificação habilitados.

## Comportamento Atual
- A área principal da página permanece em branco (tela preta), sem renderizar o cabeçalho nem os formulários da transação.
- O console do navegador registra a seguinte exceção JavaScript não tratada no carregamento do componente:
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

## Sugestão de Investigação (Opcional)
- Verificar o tratamento do estado inicial ou ciclo de vida assíncrono ao acessar a rota diretamente sem estado em memória preexistente.
