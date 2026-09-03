## Título
Renderização de cabeçalho com dados zerados/vazios e exceção JS ao acessar comprovação de débito com ID inexistente

## ID
BUG-M014-FO-004

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / Tratamento de Erros da API REST (Acesso direto por URL a comprovação de débito com ID inexistente)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / `usePrestacao`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
[Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`]

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Fazer login no portal com o perfil `coordenador`.
2. Inserir diretamente na barra de endereço a URL de comprovação de débito contendo um ID inexistente ou inválido (ex: `conectafapes.hom.es.gov.br/prestacao-financeira/teste_erro`).
3. Pressionar `Enter` para carregar a página.
4. Observar os campos do cabeçalho `Detalhes do Pagamento` e o console do navegador (`F12`).

## Dados de Entrada
- Rota com ID Inexistente: `/coordenador/prestacao-financeira/detalhes/teste_erro`
- ID de Projeto no Endpoint: `70f0b687-0ac1-45b7-abf7-08ddf54b091c`

## Comportamento Esperado
- Ao informar um ID de transação/prestação inexistente na URL, a API e o frontend devem capturar a falha e redirecionar o usuário com segurança ou exibir uma mensagem de erro clara (*"Transação de débito não encontrada"*, 404).

## Comportamento Atual
- A rota carrega o layout da página de detalhes, porém renderiza todos os campos do cabeçalho `Detalhes do Pagamento` com valores em branco/zerados (`Pagamento: -`, `Valor: R$ 0,00`, `Data: -`, `Status: -`).
- A requisição para a API retorna erro HTTP 400 (Bad Request):
  ```text
  GET https://conectafapes.hom.es.gov.br/api/prestacao-de-contas/projeto/.../prestacao/teste_erro/completa 400 (Bad Request)
  ```
- O console do navegador registra a seguinte exceção JavaScript não tratada no composable `usePrestacao`:
  ```text
  TypeError: Cannot read properties of undefined (reading 'justificativas')
      at usePrestacao-Dj_ayRuN.js:4:37516
  ```

## Evidências
- 📷 **Cabeçalho Renderizado com Dados Vazios/Zerados:**
  ![Cabeçalho de Débito Vazio](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788307019951.png)
- 🧾 **Stacktrace no Console do Navegador:**


## Sugestão de Investigação (Opcional)
- Tratar o retorno de erro da requisição HTTP no composable `usePrestacao` para evitar o acesso a propriedades de objetos não definidos (`justificativas`) e redirecionar o fluxo antes da montagem dos campos de cabeçalho.
