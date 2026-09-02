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
2. Aplicar um ou mais filtros na barra/painel de pesquisa (ex: filtrar por Categoria `Débito` ou pesquisar por texto/valor).
3. Na listagem filtrada, clicar em uma transação de débito (ex: transação em status `Em Rascunho`).
4. Observar os dados exibidos na barra de cabeçalho `Detalhes do Pagamento` e inspecionar a aba `Network` do navegador (`F12`).
5. Dar um recarregamento manual na página (`F5`).

## Dados de Entrada
- Rota Origem: `/coordenador/financeira` com filtro ativo (ex: Categoria = `Débito`)
- Transação Selecionada: Débito em status `Em Rascunho`

## Comportamento Esperado
- Ao clicar em uma transação na listagem filtrada, a aplicação deve disparar a requisição de busca dos dados da transação/prestação (`Fetch/XHR`) e carregar normalmente o cabeçalho e formulários na rota `/coordenador/prestacao-financeira/detalhes/:paymentId`.

## Comportamento Atual
- A aplicação transiciona para a rota de detalhes de débito, porém a tela renderiza o cabeçalho com todos os campos zerados/vazios (`Pagamento: -`, `Valor: R$ 0,00`, `Data: -`, `Status: -`).
- Na aba `Network` do navegador (`Fetch/XHR`), nenhuma requisição HTTP de busca de dados é disparada durante a transição de rota.
- Ao pressionar `F5` (recarregamento total da página), os dados são buscados do servidor e a tela carrega corretamente.
- *Nota:* O problema é intermitente e ocorre com maior frequência quando a navegação é iniciada a partir de uma listagem que possui filtros aplicados no extrato.

## Evidências
- 📷 **Tela de Débito com Cabeçalho Zerado:**
  ![Cabeçalho Zerado](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788308965728.png)
- 🧾 **Aba Network Sem Requisições Disparadas:**
  ![Network Vazia Sem HTTP Request](file:///C:/Users/phcos/.gemini/antigravity/brain/e9551114-8ca4-4c72-bf40-c8f0aa579ac7/.user_uploaded/media_1788308994262.png)

## Sugestão de Investigação (Opcional)
- Investigar se a transição de rota originada de uma tabela filtrada está impedindo o disparo da chamada de busca (`fetch`) no hook de montagem da tela de detalhes de débito.
