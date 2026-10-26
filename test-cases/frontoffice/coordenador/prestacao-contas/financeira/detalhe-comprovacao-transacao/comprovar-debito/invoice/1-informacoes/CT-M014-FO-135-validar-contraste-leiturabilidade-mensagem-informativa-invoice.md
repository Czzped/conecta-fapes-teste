## ID do Cenário
[CT-M014-FO-135]

## Título
Validar contraste, leiturabilidade e cores de texto da mensagem informativa de Invoice em Light e Dark Mode

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Comprovação de Débito (`/coordenador/prestacao-financeira/detalhes/:paymentId`)
- Regras Canônicas / Critérios de Design e Acessibilidade:
  - M014: `RN05` (Orientações para comprovação de despesas via Invoice)
  - Critério WCAG 2.1 — 1.4.3 Contraste Mínimo (Nível AA)
  - Heurísticas de Nielsen: #8 (Design Estético e Minimalista) e #4 (Consistência e Padrões)
- Bug Relacionado: `BUG-M014-FO-INV-009`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Transação do tipo Débito pendente de comprovação selecionada no extrato.
- Rota acessada: `/coordenador/prestacao-financeira/detalhes/:paymentId`.

## Passo a Passo
1. Acessar a tela de comprovação de débito.
2. Na seção `1. Informações Gerais *`, clicar no campo `Documento` e selecionar a opção `Invoice (Pagamento Internacional)`.
3. Observar a renderização do banner/caixa informativa exibida entre o seletor de documento e o campo de descrição.
4. Inspecionar visualmente o contraste e a cor da tipografia do texto informativo com o tema configurado em **Dark Mode**.
5. Alternar o tema da aplicação para **Light Mode** no seletor de tema do cabeçalho.
6. Inspecionar visualmente o contraste e a cor da tipografia do texto informativo em **Light Mode**.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/detalhes/:paymentId`
- Opção selecionada: `Invoice (Pagamento Internacional)`
- Componente inspecionado: Banner informativo de orientações do Invoice

## Resultado Esperado
- A mensagem informativa deve apresentar excelente leiturabilidade e contraste compatível com as diretrizes de acessibilidade (WCAG 2.1 AA):
  - Em **Dark Mode**: o texto interno do banner deve adotar a cor clara padrão da tela (Branco / `text-white` ou token `text-foreground`).
  - Em **Light Mode**: o texto interno do banner deve adotar a cor escura padrão da tela (Preto / `text-black` / `text-zinc-900` ou token `text-foreground`).
- O texto não deve ser renderizado em tom azul/ciano de baixo contraste que se misture com a cor de fundo da caixa informativa.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
