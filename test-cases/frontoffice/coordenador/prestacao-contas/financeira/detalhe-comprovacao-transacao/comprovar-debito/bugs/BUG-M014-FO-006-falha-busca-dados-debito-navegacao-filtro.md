## Título
Falha intermitente na busca de dados de débito ao navegar a partir de extrato com filtro aplicado (requisição não disparada)

## ID
BUG-M014-FO-006

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / Ciclo de vida de Navegação Client-Side (Vue Router / Store de Estado do Extrato)
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
[Windows 11 / Chrome v120 / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`]

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [x] 🟠 Alta  [ ] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o extrato de prestação financeira em `/coordenador/financeira`.
2. Aplicar um filtro no painel/barra de pesquisa (ex: Categoria = `Débito` ou buscar por palavra-chave).
3. Na listagem filtrada, clicar em uma transação de débito (na primeira vez, a tela pode carregar normalmente).
4. Voltar para o extrato em `/coordenador/financeira` mantendo o filtro ativo.
5. Clicar em uma segunda transação de débito (ou na mesma transação novamente).
6. Observar os campos exibidos na barra `Detalhes do Pagamento` e inspecionar a aba `Network` (`F12`).
7. Pressionar `F5` para recarregar a página.

## Dados de Entrada
- Rota Origem: `/coordenador/financeira` com filtro ativo (ex: Categoria = `Débito`)
- Ação: Re-navegação (clique a partir da 2ª vez em diante em itens da listagem filtrada)

## Comportamento Esperado
- Em qualquer navegação para a rota `/coordenador/prestacao-financeira/detalhes/:paymentId`, a aplicação deve buscar os dados atualizados da transação/prestação (`Fetch/XHR`) e renderizar o cabeçalho e formulários normalmente.

## Comportamento Atual
- Na primeira abertura após o carregamento inicial, os dados podem carregar; porém, da **segunda navegação em diante** a partir da listagem filtrada, a tela abre com o cabeçalho completamente zerado/vazio (`Pagamento: -`, `Valor: R$ 0,00`, `Data: -`, `Status: -`).
- A aba `Network` confirma que nenhuma requisição HTTP de busca (`Fetch/XHR`) foi disparada na transição de rota.
- Ao pressionar `F5` (recarregamento total), os dados são buscados do servidor e a tela carrega corretamente.

## Evidências
- 📷 **Tela de Débito com Cabeçalho Zerado:**
  ![Cabeçalho Zerado](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788308965728.png)
- 🧾 **Aba Network Sem Requisições Disparadas:**
  ![Network Vazia Sem HTTP Request](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788308994262.png)

## Sugestão de Investigação (Opcional)
- Verificar a reatividade do Vue Router/watchers na mudança dos parâmetros de rota (`:paymentId`) quando a visualização reutiliza a mesma instância de componente em navegações sucessivas a partir de tabelas filtradas.
