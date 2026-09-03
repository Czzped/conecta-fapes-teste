# Título
Falha intermitente na exibição dos dados de débito ao navegar a partir de extrato filtrado (campos vazios apesar de requisições 200 OK)

## ID
BUG-M014-FO-006

## Requisito/Regra Violada
- Regra Canônica: M014: `RN05` / Reatividade de Estado Client-Side (Vue Router / Mapeamento de Estado da Prestação)
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
5. Clicar na mesma transação novamente.
6. Observar os campos exibidos na barra `Detalhes do Pagamento` e inspecionar as requisições na aba `Network` (`F12`).
7. Pressionar `F5` para recarregar a página.

## Dados de Entrada
- Rota Origem: `/coordenador/financeira` com filtro ativo (ex: Categoria = `Débito`)
- Ação: Re-navegação (clique a partir da 2ª vez em diante em itens da listagem filtrada)

## Comportamento Esperado
- Em qualquer navegação para a rota `/coordenador/prestacao-financeira/detalhes/:paymentId`, a aplicação deve processar a resposta do servidor e renderizar o cabeçalho e formulários com as informações da transação selecionada.

## Comportamento Atual
- Na primeira abertura após o carregamento inicial, os dados podem carregar; porém, da **segunda navegação em diante** a partir da listagem filtrada, a tela abre com o cabeçalho completamente zerado/vazio (`Pagamento: -`, `Valor: R$ 0,00`, `Data: -`, `Status: -`).
- A aba `Network` registra a conclusão de chamadas HTTP (ex: `completa`, `conta-contabil`) com status `200 OK`, porém o frontend falha em atribuir ou re-vincular os dados recebidos aos campos da interface.
- Ao pressionar `F5` (recarregamento total), a página é remontada e exibe os dados corretamente.

## Evidências
- 📷 **Tela de Débito com Cabeçalho Zerado:**
  
<img width="2559" height="1300" alt="Image" src="https://github.com/user-attachments/assets/97f7f3e9-4511-469e-96f3-cc8ee82d1a85" />

- 📷 **Tela de Débito após o F5 na página**

<img width="2545" height="1286" alt="Image" src="https://github.com/user-attachments/assets/0397c391-eaa8-4e50-9b79-b2b9fd7777f2" />

- 🧾 **Stacktrace no Console do Navegador:**

<img width="2254" height="1205" alt="Image" src="https://github.com/user-attachments/assets/056f4983-1d6a-42f4-8075-3f5f3afcbe44" />

- 📷 **Video reproduzindo o caso.**

https://github.com/user-attachments/assets/6ece7a4b-9034-4cde-bdf8-45ff3bbb943f


## Sugestão de Investigação (Opcional)
- Verificar se o mapeamento/atribuição do payload retornado nas chamadas `completa` / `conta-contabil` deixa de atualizar o estado reativo do componente em navegações sucessivas.

