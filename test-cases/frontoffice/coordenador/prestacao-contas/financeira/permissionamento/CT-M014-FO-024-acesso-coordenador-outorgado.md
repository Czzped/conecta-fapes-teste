## ID do Cenário
[CT-M014-FO-024]

## Título
Permitir acesso à tela de prestação financeira para Coordenador com vínculo ativo no projeto

## Requisito/História Relacionada
- Produto: EP-11 — Prestação Financeira, controle de acesso.
- Arquitetura: 03 — Acesso e Segurança (RBAC/ABAC com OpenFGA).
- M006: Autorização granular / M014: `ConsultarPrestacaoContas`.

## Pré-condições
- Usuário autenticado via Acesso Cidadão (token JWT válido).
- Usuário possui o perfil `coordenador` e está formalmente vinculado como Coordenador Outorgado do projeto ativo selecionado.

## Passo a Passo
1. Autenticar no portal com credenciais de Coordenador.
2. Selecionar o projeto ativo sob sua coordenação.
3. Acessar a rota `/coordenador/prestacao-financeira`.
4. Aguardar o carregamento da página.

## Dados de Entrada
- Perfil: `coordenador`.
- Permissão: `pode_gerenciar_prestacao_contas` no contexto do projeto.

## Resultado Esperado
- A página `/coordenador/prestacao-financeira` é carregada com sucesso (HTTP 200).
- O cabeçalho, a seção de Controle de Gastos e o Extrato do Projeto são renderizados integralmente com os dados do projeto correspondente.

## Tipo de Teste
[x] Positivo  [ ] Negativo  [ ] Limite  [ ] Regressão

## Prioridade
[x] Alta  [ ] Média  [ ] Baixa
