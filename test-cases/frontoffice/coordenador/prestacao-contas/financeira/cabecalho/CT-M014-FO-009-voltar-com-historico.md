## ID do Cenário
[CT-M014-FO-009]

## Título
Validar ação do botão Voltar com histórico de navegação

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, cabeçalho de navegação.
- M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado com o perfil `coordenador`.
- Coordenador navegou a partir da tela de projetos (`/coordenador/projetos`) para a tela de prestação financeira (`/coordenador/prestacao-financeira`), existindo histórico de navegação ativo no navegador (`history.length > 1`).

## Passo a Passo
1. A partir de `/coordenador/projetos`, acessar `/coordenador/prestacao-financeira`.
2. Aguardar o carregamento da página.
3. Localizar o botão de seta para a esquerda (Voltar) no canto superior esquerdo do cabeçalho.
4. Clicar no botão Voltar.

## Dados de Entrada
- Perfil: `coordenador`.
- Histórico de navegação: rota de origem `/coordenador/projetos`.

## Resultado Esperado
- O sistema executa a navegação de retorno (`router.back()`).
- O navegador retorna exatamente para a tela anterior (`/coordenador/projetos`).

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
