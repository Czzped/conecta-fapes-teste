## ID do Cenário
[CT-M014-FO-011]

## Título
Validar exibição do título e texto informativo de compensação bancária

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, cabeçalho de identificação.
- M014: RN02 (importação e conciliação de movimentos bancários).

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Projeto ativo selecionado no contexto do portal.

## Passo a Passo
1. Acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Inspecionar os elementos visuais e textuais do cabeçalho superior.

## Dados de Entrada
- Perfil: `coordenador`.

## Resultado Esperado
- O cabeçalho exibe o ícone de cifrão (`$`) estilizado junto ao título `Prestação de Contas Financeira`.
- Abaixo do título, é exibido o texto informativo: `"Comprove os pagamentos realizados na conta bancária do seu projeto. As informações aparecem após 1 dia útil."`.
- O layout exibe a linha divisória separando o cabeçalho do restante do conteúdo da página.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
