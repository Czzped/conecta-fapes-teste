## Título
[Bug] Modal de vinculação de transações exibe lista extensa e paginação interna em vez de componente de busca e seleção pesquisável (Select/Autocomplete)

## ID
BUG-M014-FO-PREST-007

## Requisito/Regra Violada
- Fluxo/Contexto: Comprovação de Débito — **Modal "Vincular transação"** (Vinculação de transações de débito que compõem a mesma compra)
- Regra Canônica: M014 / M013: `RN02` / `RN13` (Adição e conciliação de `TransacaoFinanceira` à `JustificativaDespesa` da mesma compra)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #7 (Flexibilidade e Eficiência de Uso)**: Inexistência de aceleradores de busca e filtragem. Em iniciativas ou projetos com grande volume de pagamentos (dezenas ou centenas de transações de débito), o usuário é submetido a um esforço operacional excessivo ao ter que folhear páginas sequenciais dentro de um modal para encontrar uma transação específica.
  - **Heurística #8 (Estética e Design Minimalista)**: Apresentação de múltiplos cards volumosos e paginação vertical aninhada em um modal com viewport limitado, gerando poluição visual e quebra do fluxo de trabalho.
  - **Heurística #6 (Reconhecimento em vez de Memorização)**: O usuário é obrigado a lembrar detalhes exatos ou varrer páginas manualmente, em vez de dispor de um campo de busca/digitação preditiva onde possa filtrar rapidamente por valor, data, favorecido, CPF/CNPJ ou histórico bancário.
- Casos de Teste Relacionados:
  - `CT-M014-FO-116` (Vincular uma nova transação de débito a uma prestação de contas em rascunho via modal) — *Nota: O caso de teste existente apenas prevê a lista paginada estática. Não existe atualmente no repositório um caso de teste para busca, filtro ou seleção por Select pesquisável na vinculação de transações, sendo recomendada sua inclusão.*
- Rota/Componente: `/coordenador/prestacao-financeira/detalhes/:paymentId` (`ComprovarDebito.vue` / Modal `Vincular transação`)

## Ambiente
[ ] Produção  [ ] Staging  [x] Homologação

## Dispositivo/SO
Desktop / Chrome v120+ / Frontoffice Vue-Nuxt UI em `https://conectafapes.hom.es.gov.br`

## Gravidade/Prioridade
[ ] 🔴 Bloqueante  [ ] 🟠 Alta  [x] 🟡 Média  [ ] 🟢 Baixa

## Passo a Passo
1. Acessar o sistema com perfil de Coordenador no ambiente de homologação.
2. Navegar até o extrato em `/coordenador/financeira` e abrir a comprovação de uma transação de débito com status `Em Rascunho`.
3. Na seção *"Transações desta prestação"*, clicar no botão `+ Vincular transação`.
4. Observar a renderização da janela modal *"Vincular transação"*.
5. Constatar que a modal carrega uma listagem vertical com cards individuais para cada débito sem prestação do projeto e uma paginação no rodapé da janela modal.
6. Em projetos com elevado número de pagamentos, verificar a ausência de qualquer mecanismo de busca/filtro textual (por favorecido, valor, data ou histórico) e a sobrecarga de navegar página por página dentro do modal.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Ação: Clique em `+ Vincular transação`
- Contexto: Projetos com múltiplas transações financeiras de débito pendentes/em rascunho

## Comportamento Esperado
- Para garantir eficiência, ergonomia e usabilidade na vinculação de transações em projetos de qualquer porte:
  - O modal não deve exigir navegação paginada exaustiva entre cards compridos.
  - O sistema deve fornecer um componente de seleção com busca integrada (Select com Autocomplete / Combobox pesquisável) onde o usuário possa:
    - Digitar qualquer fragmento para filtrar (ex.: valor `R$ 992,30`, data `01/10/2026`, número do PIX, histórico bancário ou CNPJ/CPF do favorecido).
    - Selecionar a transação desejada diretamente a partir do dropdown filtrado ou lista compacta com scroll virtualizado.
    - Confirmar a vinculação de forma rápida e com feedback imediato.

## Comportamento Atual
- A modal renderiza uma lista vertical de cards pesados, contendo texto descritivo longo e paginação interna restrita ao espaço do modal.
- Não há campo de texto de busca ou filtro, obrigando o coordenador a inspecionar visualmente item a item e navegar manualmente entre as páginas para localizar uma despesa.

## Evidências
- 📷 **Modal de vinculação exibindo lista com cards compridos e paginação interna dentro da modal:**
  ![Modal Vincular Transação com Lista Paginada](https://raw.githubusercontent.com/Czzped/conecta-fapes-teste/main/test-cases/frontoffice/coordenador/prestacao-contas/financeira/detalhe-comprovacao-transacao/comprovar-debito/bugs/evidencias-BUG-PREST-007-01-modal-vincular-transacao-lista-paginada.png)

## Sugestão de Investigação
- Refatorar a interface de seleção da modal de vinculação no Frontoffice (ex.: `ModalVincularTransacao.vue` ou componente equivalente dentro de `ComprovarDebito.vue`):
  - Substituir a lista estática paginada por um componente de Combobox / Select pesquisável (ex.: `USelectMenu` do Nuxt UI / `@headlessui/vue` / PrimeVue ou componente customizado do design system FAPES).
  - Incluir slot de exibição no item do select formatado com os dados essenciais: `[Valor] · [Data] · [Descrição/Histórico] · [CNPJ/CPF]`.
  - Implementar busca reativa no frontend (filtro por texto nos campos `valor`, `data`, `historico`, `destinatario`) ou busca com debounce na API caso os débitos sejam carregados sob demanda do backend.
  - Alternativamente, caso a visualização em cards seja mantida, adicionar obrigatoriamente um campo de busca/filtro no topo da modal acima da lista de pagamentos para busca instantânea.
