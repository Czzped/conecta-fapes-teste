## ID do Cenário
[CT-M014-FO-023]

## Título
Validar layout responsivo da listagem de transações em dispositivos móveis

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, layout mobile.
- Critérios de Usabilidade e Heurísticas de Nielsen (Design Responsivo).

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal.
- Viewport do navegador ajustado para resolução mobile (largura $\le$ 768px, ex.: 375x667).

## Passo a Passo
1. Emular dispositivo mobile ou redimensionar a janela do navegador para largura inferior a 768px.
2. Acessar `/coordenador/prestacao-financeira`.
3. Aguardar o carregamento da página.
4. Inspecionar o card de uma transação na listagem.

## Dados de Entrada
- Perfil: `coordenador`.
- Resolução de tela: 375px $\times$ 667px (Mobile).

## Resultado Esperado
- A listagem oculta a estrutura tabular/grid de desktop e renderiza a visualização em cards empilhados (`md:hidden`).
- O card exibe claramente o tipo de movimento, status no topo, valor e data em colunas duplas, e o favorecido/terceiro na parte inferior.
- O botão/ícone de chevron permanece alinhado e clicável para abrir os detalhes.
- Não ocorrem barras de rolagem horizontais involuntárias na tela.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
