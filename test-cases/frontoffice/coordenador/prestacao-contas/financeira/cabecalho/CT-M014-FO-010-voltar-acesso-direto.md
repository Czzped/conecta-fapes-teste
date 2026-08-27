## ID do Cenário
[CT-M014-FO-010]

## Título
Validar ação do botão Voltar em acesso direto sem histórico

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, cabeçalho de navegação.
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Acesso efetuado diretamente inserindo a URL `/coordenador/prestacao-financeira` na barra de endereço de uma nova aba do navegador (sem histórico prévio na aba, `history.length <= 1`).

## Passo a Passo
1. Abrir uma nova aba do navegador.
2. Inserir a URL `/coordenador/prestacao-financeira` e pressionar Enter.
3. Aguardar o carregamento da página.
4. Clicar no botão de seta para a esquerda (Voltar) no cabeçalho.

## Dados de Entrada
- Perfil: `coordenador`.
- URL de acesso direto: `/coordenador/prestacao-financeira`.

## Resultado Esperado
- Como não há histórico de navegação anterior, o sistema aplica o fallback de segurança (`router.push('/')`).
- O usuário é redirecionado com sucesso para a página inicial do portal (`/`).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[ ] Alta  [x] Média  [ ] Baixa
