## ID do Cenário
[CT-M014-FO-134]

## Título
Validar padrão visual, anatomia e elementos da modal de confirmação de envio da classificação de crédito

## Requisito/História Relacionada
- Requisito/Issue: EP-11 — Tela Classificar Crédito (`/coordenador/prestacao-financeira/classificar-credito/:paymentId`)
- Regra Canônica: M014: `RN10` (Confirmação prévia antes da submissão final e bloqueio de edição)
- Heurísticas de Usabilidade de Nielsen:
  - **Heurística #4 (Consistência e Padrões)**: A modal de confirmação deve seguir rigorosamente os tokens de design (cor de fundo, ausência de divisores indevidos e ícone de alerta junto ao título) padronizados no sistema.
  - **Heurística #8 (Design Estético e Minimalista)**: Interface limpa, com contraste harmonioso de fundo e sem linhas divisórias que quebrem o acabamento visual.
- Bug Relacionado: `BUG-M014-FO-CRED-009`

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Rota acessada: `/coordenador/prestacao-financeira/classificar-credito/:paymentId`.
- Formulário de classificação preenchido com dados válidos (`Estorno` com débito associado ou `Devolução` com descrição preenchida).

## Passo a Passo
1. Na tela de classificação de crédito, preencher as informações obrigatórias da classificação.
2. Clicar no botão primário `Enviar` no rodapé da página.
3. Observar a abertura da modal de confirmação *"Tem certeza que deseja enviar as informações?"*.
4. Inspecionar a anatomia e os elementos visuais da modal:
   - Presença do ícone/botão de alerta (`AlertTriangle` / aviso) ao lado do título.
   - Ausência de linha horizontal divisória entre o corpo do texto e os botões de ação.
   - Cor de fundo da modal alinhada com a superfície padrão dos modais do sistema (não utilizando preto puro despadronizado).
5. Clicar em `Cancelar` e validar o fechamento da modal sem submissão.
6. Clicar novamente em `Enviar` e na modal confirmar o envio para validar o fechamento e disparo da ação.

## Dados de Entrada
- Rota: `/coordenador/prestacao-financeira/classificar-credito/:paymentId`
- Ação: Clique em `Enviar`

## Resultado Esperado
- A modal de confirmação é renderizada em conformidade com o Design System do Conecta FAPES:
  - Exibe o ícone de alerta destacado ao lado do título *"Tem certeza que deseja enviar as informações?"*.
  - Não apresenta linhas divisórias horizontais antes dos botões de ação (`Cancelar` e `Enviar`).
  - A cor de fundo da modal utiliza a cor de superfície padronizada do tema (dark mode do frontoffice), garantindo harmonia visual com os demais modais da aplicação.
  - Ao clicar em `Cancelar`, a modal é fechada e os dados permanecem intactos no formulário.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [x] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
