## ID do Cenário
[CT-M014-FO-136]

## Título
Validar unificação e consistência dos controles de edição na Seção 3 (Informações da Passagem)

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito de Passagem (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regras Canônicas / Padrões de Interface:
  - M014: `RN12` (Comprovação de passagem: informações de passageiros e itinerário da viagem)
  - Heurísticas de Nielsen: #4 (Consistência e Padrões) e #8 (Design Estético e Minimalista)
- Bug Relacionado: `BUG-M014-FO-PAS-015`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação de débito aberta para comprovação com a modalidade `Passagem` selecionada.
- Informações de passageiro e itinerário já salvas em rascunho na Seção 3.
- Rota acessada: `/coordenador/prestacao-financeira/detalhes/:paymentId`.

## Passo a Passo
1. Acessar a página de comprovação de débito da transação de Passagem.
2. Rolar até a seção `3. Informações da Passagem *`.
3. Inspecionar visualmente os controles de ação e edição presentes no card:
   - Notar os botões de edição disponíveis para a lista de passageiros e para os campos de itinerário.
   - Validar a nomenclatura dos botões e a ausência do rótulo conflitante "Editar Informações Gerais" dentro da Seção 3.
4. Acionar a edição dos dados da seção e verificar se todos os campos editáveis são liberados de maneira fluida e compreensível.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Seção inspecionada: `3. Informações da Passagem *`

## Resultado Esperado
- A Seção 3 deve apresentar controles de edição consolidados e alinhados às diretrizes de UX da equipe de Design (Letícia):
  - Não deve coexistir duplicidade desordenada de botões de edição dentro do mesmo container (evitando a sobreposição de dois botões independentes: `Editar passageiros` e `Editar Informações Gerais`).
  - O rótulo *"Informações Gerais"* não deve ser utilizado dentro da Seção 3, eliminando a ambiguidade com o nome oficial da **Seção 1 (Informações Gerais)**.
  - A interface deve oferecer um fluxo de edição coeso (seja unificando o botão em um único `Editar informações da passagem`, seja subdividindo claramente os blocos em subcards com títulos dedicados como `Itinerário`).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
